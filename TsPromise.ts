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

  constructor(executor: Exector) {
    this.resolve = (value: any) => {
      if (this.state === pending) {
        this.state = fulfilled;
        console.log('class resolve! ', value);
      }
    };

    this.reject = (value: any) => {
      if (this.state === pending) {
        this.state = rejected;
        console.log('class reject! ', value);
      }
    };

    executor(this.resolve, this.reject);
  }

  then(onFulfilled: Resolve, onRejected: Reject) {}
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
