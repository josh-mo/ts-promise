import TsPromise from './TsPromise';

export function isFunction(data: any): data is Function {
  return typeof data === 'function';
}

function isObject(data: any): data is Record<any, any> {
  return data !== null && typeof data === 'object';
}

export function isPromise(data: any): data is TsPromise {
  return isObject(data) && isFunction(data.then);
}
