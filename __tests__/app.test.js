const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');

it('GET / should respond with Hello world!', done => {
  request(app)
    .get('/')
    .then(res => {
      expect(res.statusCode).to.equal(200);
      expect(res.body.message).to.equal('Hello world!');
      done();
    });
});
