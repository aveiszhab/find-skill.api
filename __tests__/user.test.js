/* eslint-disable no-console */
const mongoose = require('mongoose');
const { expect } = require('chai');
const request = require('supertest');
const User = require('../src/models/User');
const app = require('../src/app');

describe('/users', () => {
  before(async () => {
    const url = process.env.DB_CONNECTION;
    try {
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await console.log('MongoDB Connected');
    } catch (err) {
      console.log(err);
    }
  });

  /* afterEach(async () => {
    await User.deleteMany({}, () => {
    });
  });

  after(async () => {
    mongoose.connection.close();
  }); */


  it('creates a new user in the database', async () => {
    const response = await request(app).post('/users').send({
      name: 'TestName',
      skill: 'TestSkill',
      description: 'TestDescription',
      postcode: 'SK17 7DW',
      free: false,
      professional: true,
      long: '-1.9057814',
      lat: '53.26170519999999',
    });

    expect(response.status).to.equal(201);
    expect(response.body.name).to.equal('TestName');
    expect(response.body.skill).to.equal('TestSkill');
    expect(response.body.description).to.equal('TestDescription');
    expect(response.body.postcode).to.equal('SK17 7DW');
    expect(response.body.free).to.equal(false);
    expect(response.body.professional).to.equal(true);
    expect(response.body.long).to.equal('-1.9057814');
    expect(response.body.lat).to.equal('53.26170519999999');

    const newUser = await User.findById(response.body._id);

    expect(newUser.name).to.equal('TestName');
    expect(newUser.skill).to.equal('TestSkill');
    expect(newUser.description).to.equal('TestDescription');
    expect(newUser.postcode).to.equal('SK17 7DW');
    expect(newUser.free).to.equal(false);
    expect(newUser.professional).to.equal(true);
    expect(newUser.long).to.equal('-1.9057814');
    expect(newUser.lat).to.equal('53.26170519999999');
  });
});
