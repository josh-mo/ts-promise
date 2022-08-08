import TsPromise from '../TsPromise';

const enrollment = {
  subject: 'js',
};

const student = {
  name: 'peter',
  grade: 'A',
};

const simulateRequest = (fn: Function) => {
  setTimeout(fn, 2000);
};

const p = new TsPromise((resolve, reject) => {
  simulateRequest(() => resolve(student));
});

const p2 = new TsPromise((resolve, reject) => {
  simulateRequest(() => resolve(enrollment));
});

p.then(
  (data) => {
    console.log('get student promise resolved', data);
    return p2;
  },
  (data) => {
    console.log('reject 1', data);
    return 'client 1 reject';
  }
)
  .then(
    (data) => {
      console.log('get enrollment promise resolved', data);
      return 'ok2';
    },
    (data) => {
      console.log('client reject 2', data);
      return 'client 2 reject';
    }
  )
  .then(
    (data) => {
      console.log('from client 2', data);
      return 'ok 3';
    },
    (data) => {
      console.log('client reject 3', data);
      return 'client 3 reject';
    }
  );
