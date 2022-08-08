import TsPromise from '../TsPromise';

const p = new TsPromise((resolve, reject) => {
  // setTimeout(() => resolve('client done for waiting'), 1000);

  setTimeout(() => reject('client reject for waiting'), 1000);
});

p.then(
  (data) => {
    console.log('client then ', data);
  },
  (data) => {
    console.log('client reject ', data);
  }
)
