const p = new Promise((resolve, reject) => {
  console.log('promise');

  setTimeout(() => resolve('done'), 1000);
});

const p2 = new Promise((resolve, reject) => {
  console.log('promise 2');

  setTimeout(() => resolve('promise 2'), 1000);
});

p.then(
  (data) => {
    console.log('success 1', data);
    return p2;
  },
  (data) => {
    console.log('reject 1', data);
  }
)
  .then(
    (data) => {
      console.log('success 2', data);
      return p;
    },
    () => {
      console.log('reject 2');
    }
  )
  .then(() => {
    console.log('end of promise');
  });
