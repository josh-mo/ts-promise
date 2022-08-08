export function isFunction(data: any): data is Function {
  return data !== null && typeof data === 'function';
}

export function isObject(data: any): data is Record<any, any> {
  return data !== null && typeof data === 'object';
}
