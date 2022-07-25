import { isFunction } from './util';

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
            console.log('refolveFunction is', refolveFunction);

            refolveFunction();
          });
        }

        console.log('class resolve! ', value);
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

    executor(this.resolve, this.reject);
  }

  then(onFulfilled: Resolve, onRejected: Reject) {
    console.log('then is invoked');

    if (this.state === pending) {
      console.log('in the pending ');

      this.resolveList.push(() => {
        onFulfilled(this.value);
      });

      this.rejectList.push(() => {
        onRejected(this.reason);
      });
    }

    if (this.state === fulfilled) {
      console.log('in the fulfilled');
      onFulfilled(this.value);
    }

    if (this.state === rejected) {
      console.log('in the reject');
      onRejected(this.reason);
    }
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
