const enrollment = {
  subject: 'js',
};

const studnet = {
  name: 'peter',
  grade: 'A',
};

const simulateRequest = (fn: Function) => {
  setTimeout(fn, 2000);
};

const p = new Promise((resolve, reject) => {
  simulateRequest(() => resolve(studnet));
});

const p2 = new Promise((resolve, reject) => {
  simulateRequest(() => resolve(enrollment));
});

p.then(
  (data) => {
    console.log('get student promise resolved', data);
    return p2;
  },
  (data) => {
    console.log('reject 1', data);
  }
)
  .then(
    (data) => {
      console.log('get enrollment promise resolved', data);
      return 'ok2';
    },
    (data) => {
      console.log('client reject 2', data);
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
