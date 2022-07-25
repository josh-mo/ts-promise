import TsPromise from '../TsPromise';

const p = new TsPromise((resolve, reject) => {
  console.log('client promise');

  setTimeout(() => resolve('client done for waiting'), 1000);

  setTimeout(() => reject('client done for waiting'), 1000);
});
