import { isFunction, isPromise } from './util';

const pending = Symbol('pending');
const fulfilled = Symbol('fulfilled');
const rejected = Symbol('rejected');

type Resolve = (value: any) => any;
type Reject = (value: any) => any;
type Exector = (resolve: Resolve, reject: Reject) => any;
type State = typeof pending | typeof fulfilled | typeof rejected;

class TsPromise {
  static deferred: () => any;
  resolve!: Resolve;
  reject!: Reject;
  state: State = pending;
  value: any;
  reason: any;
  resolveList: (() => void)[] = [];
  rejectList: (() => void)[] = [];

  constructor(executor: Exector) {
    this.resolve = (value: any) => {
      if (this.state === pending) {
        this.state = fulfilled;
        this.value = value;

        if (this.resolveList.length > 0) {
          this.resolveList.forEach((refolveFunction) => {
            refolveFunction();
          });
        }
      }
    };

    this.reject = (value: any) => {
      if (this.state === pending) {
        this.state = rejected;
        this.reason = value;

        if (this.resolveList.length > 0) {
          this.rejectList.forEach((rejectFunction) => {
            console.log('rejectFunction is', rejectFunction);

            rejectFunction();
          });
        }

        console.log('class reject! ', value);
      }
    };

    try {
      executor(this.resolve, this.reject);
      this.state = pending;
    } catch (err) {
      this.reject(err);
      throw new Error('error');
    }
  }

  then(onFulfilled: Resolve, onRejected: Reject) {
    return new TsPromise((resolve, reject) => {
      let result: any;

      if (this.state === pending) {
        this.resolveList.push(() => {
          result = onFulfilled(this.value);
          if (isFunction(result)) {
            setTimeout(() => resolve(result.value));
          } else {
            resolve(result);
          }
        });

        this.rejectList.push(() => {
          result = onRejected(this.reason);
          if (isFunction(result)) {
            setTimeout(() => reject(result.value));
          } else {
            reject(result);
          }
        });
      }

      if (this.state === fulfilled) {
        console.log('in the fulfilled');
        result = onFulfilled(this.value);
        resolve(result);
      }

      if (this.state === rejected) {
        console.log('in the reject');
        result = onRejected(this.reason);
        reject(reject);
      }
    });
  }
}

TsPromise.deferred = function () {
  const result: any = {};
  result.promise = new TsPromise((resolve: any, reject: any) => {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
};

export = TsPromise;
