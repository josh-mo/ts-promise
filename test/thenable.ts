import TsPromise from '../TsPromise';

const p = new TsPromise((resolve, reject) => {
  // resolve('resolve');
  setTimeout(() => resolve('client done for waiting'), 2000);

  // setTimeout(() => reject('client done for waiting'), 1000);
});

const p2 = new TsPromise((resolve, reject) => {
  setTimeout(() => resolve('promise 2'), 5000);
});

p.then(
  (data) => {
    console.log('from p', data);
    return p2;
  },
  (data) => {
    console.log('client reject 1', data);
    return 'client 1 reject';
  }
)
  .then(
    (data) => {
      console.log('from client 1', data);
      return 'ok 2';
    },
    (data) => {
      console.log('client reject 2', data);
      return 'cleint 2 reject';
    }
  )
  .then(
    (data) => {
      console.log('from client 2', data);
      return 'ok 3';
    },
    (data) => {
      console.log('client reject 3', data);
      return 'cleint 3 reject';
    }
  );
