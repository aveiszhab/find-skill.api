/* eslint-disable no-console */
const mongoose = require('mongoose');
const { expect } = require('chai');
const request = require('supertest');
const User = require('../src/models/User');
const GeoCoding = require('../src/models/Geocoding');
const app = require('../src/app');

describe('/users', () => {
  before(async () => {
    const url = process.env.DB_CONNECTION;
    try {
      await mongoose.connect(url, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
      await console.log('MongoDB Connected');
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    await User.deleteMany({}, () => {
    });
    await GeoCoding.deleteMany();
  });

  afterEach(async () => {
    await User.deleteMany({}, () => {
    });
    await GeoCoding.deleteMany();
  });

  after(async () => {
    mongoose.connection.close();
  });

  describe('creates a new user in the database', () => {
    it('No postcode in the DB', async () => {
      const response = await request(app).post('/users').send({
        name: 'TestName',
        postcode: 'SK17 7DW',
        skill: 'TestSkill',
        description: 'TestDescription',
        free: false,
        professional: true,
        email: 'TestEmail@gmail.com',
      });

      expect(response.status).to.equal(201);
      expect(response.body.name).to.equal('TestName');
      expect(response.body.skill).to.equal('TestSkill');
      expect(response.body.description).to.equal('TestDescription');
      expect(response.body.postcode).to.equal('SK17 7DW');
      expect(response.body.email).to.equal('TestEmail@gmail.com');
      expect(response.body.free).to.equal(false);
      expect(response.body.professional).to.equal(true);
      expect(response.body.long).to.equal('-1.9057814');
      expect(response.body.lat).to.equal('53.26170519999999');

      const newUser = await User.findById(response.body._id);

      expect(newUser.name).to.equal('TestName');
      expect(newUser.skill).to.equal('TestSkill');
      expect(newUser.description).to.equal('TestDescription');
      expect(newUser.email).to.equal('TestEmail@gmail.com');
      expect(newUser.postcode).to.equal('SK17 7DW');
      expect(newUser.free).to.equal(false);
      expect(newUser.professional).to.equal(true);
      expect(newUser.long).to.equal('-1.9057814');
      expect(newUser.lat).to.equal('53.26170519999999');
    });

    it('With postcode in the DB', async () => {
      const location = {
        postcode: 'OX2 6RU',
        lat: '51.767010',
        long: '-1.265490',
      };

      await GeoCoding.create(location);

      const response = await request(app).post('/users').send({
        name: 'TestName2',
        postcode: 'SK17 7DW',
        skill: 'TestSkill',
        description: 'TestDescription',
        free: false,
        professional: true,
        email: 'TestEmail@gmail.com',
      });

      expect(response.status).to.equal(201);
      expect(response.body.name).to.equal('TestName2');
      expect(response.body.skill).to.equal('TestSkill');
      expect(response.body.description).to.equal('TestDescription');
      expect(response.body.postcode).to.equal('SK17 7DW');
      expect(response.body.email).to.equal('TestEmail@gmail.com');
      expect(response.body.free).to.equal(false);
      expect(response.body.professional).to.equal(true);
      expect(response.body.long).to.equal('-1.9057814');
      expect(response.body.lat).to.equal('53.26170519999999');

      const newUser = await User.findById(response.body._id);

      expect(newUser.name).to.equal('TestName2');
      expect(newUser.skill).to.equal('TestSkill');
      expect(newUser.description).to.equal('TestDescription');
      expect(newUser.email).to.equal('TestEmail@gmail.com');
      expect(newUser.postcode).to.equal('SK17 7DW');
      expect(newUser.free).to.equal(false);
      expect(newUser.professional).to.equal(true);
      expect(newUser.long).to.equal('-1.9057814');
      expect(newUser.lat).to.equal('53.26170519999999');
    });

    it('Invalid postcode', async () => {
      const response = await request(app).post('/users').send({
        name: 'TestName',
        postcode: 'afkjsldjf',
        skill: 'TestSkill',
        description: 'TestDescription',
        free: false,
        professional: true,
        email: 'TestEmail@gmail.com',
      });

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal('The user could not be created.');
    });
  });

  describe('with data in the database', () => {
    let users;

    beforeEach(async () => {
      const user1 = {
        name: 'TestName1',
        postcode: 'OX2 6RU',
        skill: 'TestSkill1',
        description: 'TestDescription1',
        free: false,
        professional: true,
        email: 'TestEmail1@gmail.com',
        lat: '51.767010',
        long: '-1.265490',
      };
      const user2 = {
        name: 'TestName2',
        postcode: 'SK17 7DW',
        skill: 'TestSkill2',
        description: 'TestDescription2',
        free: false,
        professional: true,
        email: 'TestEmail2@gmail.com',
        lat: '51.767010',
        long: '-1.265490',
      };

      users = await User.create(user1, user2);
    });

    describe('GET /users', () => {
      it('list all Users', async () => {
        const response = await request(app).get('/users');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(2);
        response.body.forEach((user) => {
        // eslint-disable-next-line eqeqeq
          const expected = users.find((a) => a._id == user._id);

          expect(user.name).to.equal(expected.name);
          expect(user.postcode).to.equal(expected.postcode);
          expect(user.skill).to.equal(expected.skill);
          expect(user.description).to.equal(expected.description);
          expect(user.free).to.equal(expected.free);
          expect(user.professional).to.equal(expected.professional);
          expect(user.lat).to.equal(expected.lat);
          expect(user.long).to.equal(expected.long);
        });
      });
    });

    describe('GET /users/:userId', () => {
      it('gets user by Id', async () => {
        const user = users[0];

        const response = await request(app).get(`/users/${user._id}`);

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal('TestName1');
        expect(response.body.postcode).to.equal('OX2 6RU');
        expect(response.body.skill).to.equal('TestSkill1');
        expect(response.body.description).to.equal('TestDescription1');
        expect(response.body.free).to.equal(false);
        expect(response.body.professional).to.equal(true);
        expect(response.body.email).to.equal('TestEmail1@gmail.com');
        expect(response.body.lat).to.equal('51.767010');
        expect(response.body.long).to.equal('-1.265490');
      });

      it('returns a 404 if the user does not exist', async () => {
        const response = await request(app).get('/users/123');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The user could not be found.');
      });
    });

    describe('PATCH /users/:userId', () => {
      it('updates user name by Id', async () => {
        const user = users[0];

        const response = await request(app).patch(`/users/${user._id}`).send({ name: 'UpdatedName' });

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal('UpdatedName');
        expect(response.body.postcode).to.equal('OX2 6RU');
        expect(response.body.skill).to.equal('TestSkill1');
        expect(response.body.description).to.equal('TestDescription1');
        expect(response.body.free).to.equal(false);
        expect(response.body.professional).to.equal(true);
        expect(response.body.email).to.equal('TestEmail1@gmail.com');
        expect(response.body.lat).to.equal('51.767010');
        expect(response.body.long).to.equal('-1.265490');
      });

      it('updates user name and skill by Id', async () => {
        const user = users[0];

        const response = await request(app)
          .patch(`/users/${user._id}`)
          .send({ name: 'UpdatedName', skill: 'UpdatedSkill' });

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal('UpdatedName');
        expect(response.body.postcode).to.equal('OX2 6RU');
        expect(response.body.skill).to.equal('UpdatedSkill');
        expect(response.body.description).to.equal('TestDescription1');
        expect(response.body.free).to.equal(false);
        expect(response.body.professional).to.equal(true);
        expect(response.body.email).to.equal('TestEmail1@gmail.com');
        expect(response.body.lat).to.equal('51.767010');
        expect(response.body.long).to.equal('-1.265490');
      });

      it('returns a 404 if the user does not exist', async () => {
        const response = await request(app).patch('/users/123');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The user could not be found.');
      });
    });

    describe('DELETE /users/:userId', () => {
      it('deletes user name by Id', async () => {
        const user = users[0];

        const response = await request(app).delete(`/users/${user._id}`);
        const deletedUser = await User.findById(user._id);

        expect(response.status).to.equal(204);
        expect(deletedUser).to.equal(null);
      });

      it('returns a 404 if the user does not exist', async () => {
        const response = await request(app).delete('/users/123');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The user could not be found.');
      });
    });
  });
});
