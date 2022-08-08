import { isFunction, isObject } from './util';

const pending = Symbol('pending');
const fulfilled = Symbol('fulfilled');
const rejected = Symbol('rejected');

type Resolve = (value: unknown) => unknown;
type Reject = (value: unknown) => unknown;
type Executor = (resolve: Resolve, reject: Reject) => unknown;
type State = typeof pending | typeof fulfilled | typeof rejected;
type Deferred = Record<string, TsPromise | Resolve | Reject>;

// 3.1
// `onFulfilled` and `onRejected` need to be executed asynchronously,
// after the event loop turn in which then is called, and with a fresh stack.
const runMacro = (task: Function) => setTimeout(() => task());

class TsPromise {
  static deferred: () => Deferred;
  resolve: Resolve;
  reject: Reject;
  state: State = pending;
  value: unknown = null;
  resolveList: (() => void)[] = [];
  rejectList: (() => void)[] = [];

  constructor(executor: Executor) {
    this.resolve = (value: unknown) => {
      if (this.state !== pending) {
        return;
      }

      runMacro(() => {
        this.state = fulfilled;
        this.value = value;

        if (this.resolveList.length > 0) {
          this.resolveList.forEach((resolveFunction) => {
            resolveFunction();
          });
        }
      });
    };

    this.reject = (value: unknown) => {
      if (this.state !== pending) {
        return;
      }

      runMacro(() => {
        this.state = rejected;
        this.value = value;

        if (this.resolveList.length > 0) {
          this.rejectList.forEach((rejectFunction) => {
            rejectFunction();
          });
        }
      });
    };

    try {
      executor(this.resolve, this.reject);
    } catch (err) {
      this.reject(err);
    }
  }

  private handlePromiseResult = (
    result: unknown,
    thenPromise: TsPromise,
    resolve: Resolve,
    reject: Reject
  ) => {
    //2.3.1
    if (result === thenPromise) {
      return reject(new TypeError('Chaining cycle detected for promise'));
    }

    // 2.3.2
    if (result instanceof TsPromise) {
      // console.log('result is promise ', result);
      // 2.3.2.1
      if (result.state === pending) {
        result.then((data: unknown) => {
          this.handlePromiseResult(data, thenPromise, resolve, reject);
        }, reject);
        return;
      }

      // 2.3.2.2
      if (result.state === fulfilled) {
        resolve(result.value);
        return;
      }

      // 2.3.2.3
      if (result.state === rejected) {
        reject(result.value);
        return;
      }
    }

    // 2.3.3
    if (isObject(result) || isFunction(result)) {
      // console.log('result is object ', result);

      let then;
      try {
        // 2.3.3.1
        then = result.then;
      } catch (e) {
        // 2.3.3.2
        return reject(e);
      }

      // 2.3.3.3
      if (isFunction(then)) {
        let called = false;
        try {
          then.call(
            result,
            // 2.3.3.3.1
            (y: unknown) => {
              // console.log('y is', y);
              // 2.3.3.3.3
              if (called) return;
              called = true;
              // 2.3.3.3.1
              this.handlePromiseResult(y, thenPromise, resolve, reject);
            },
            (r: unknown) => {
              // 2.3.3.3.3
              if (called) return;
              called = true;
              // 2.3.3.3.2
              reject(r);
            }
          );
          // 2.3.3.3.4
        } catch (e) {
          // 2.3.3.3.4.1
          if (called) return;
          called = true;
          // 2.3.3.3.4.2
          reject(e);
        }
        return;
      }

      // 2.3.3.4
      resolve(result);
      return;
    }

    // 2.3.4
    return resolve(result);
  };

  then(onFulfilled: Resolve, onRejected: Reject) {
    // 2.2.1.1
    onFulfilled = isFunction(onFulfilled) ? onFulfilled : (value) => value;
    // 2.2.1.2
    onRejected = isFunction(onRejected)
      ? onRejected
      : (err) => {
          throw err;
        };

    const nextPromise = new TsPromise((resolve, reject) => {
      if (this.state === pending) {
        this.resolveList.push(() => {
          try {
            let result = onFulfilled(this.value);
            this.handlePromiseResult(result, nextPromise, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });

        this.rejectList.push(() => {
          try {
            let result = onRejected(this.value);
            this.handlePromiseResult(result, nextPromise, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }

      // 2.2.2.1
      if (this.state === fulfilled) {
        // 2.2.4 - must not be called until the execution context stack contains only platform code
        runMacro(() => {
          try {
            let result = onFulfilled(this.value);
            this.handlePromiseResult(result, nextPromise, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }

      // 2.2.3.1
      if (this.state === rejected) {
        runMacro(() => {
          try {
            let result = onRejected(this.value);
            this.handlePromiseResult(result, nextPromise, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
    });

    return nextPromise;
  }
}

TsPromise.deferred = function () {
  const result: Deferred = {};
  result.promise = new TsPromise((resolve: Resolve, reject: Reject) => {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
};

export = TsPromise;
