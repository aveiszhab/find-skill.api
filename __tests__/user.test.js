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
        postcode: 'OX2 6RU',
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
      expect(response.body.postcode).to.equal('OX2 6RU');
      expect(response.body.email).to.equal('TestEmail@gmail.com');
      expect(response.body.free).to.equal(false);
      expect(response.body.professional).to.equal(true);
      expect(response.body.long).to.equal('-1.265490');
      expect(response.body.lat).to.equal('51.767010');

      const newUser = await User.findById(response.body._id);

      expect(newUser.name).to.equal('TestName2');
      expect(newUser.skill).to.equal('TestSkill');
      expect(newUser.description).to.equal('TestDescription');
      expect(newUser.email).to.equal('TestEmail@gmail.com');
      expect(newUser.postcode).to.equal('OX2 6RU');
      expect(newUser.free).to.equal(false);
      expect(newUser.professional).to.equal(true);
      expect(newUser.long).to.equal('-1.265490');
      expect(newUser.lat).to.equal('51.767010');
    });

    it('No name provided', async () => {
      const response = await request(app).post('/users').send({
        name: null,
        postcode: 'OX2 6RU',
        skill: 'TestSkill',
        description: 'TestDescription',
        free: false,
        professional: true,
        email: 'TestEmail@gmail.com',
      });

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal('User validation failed: name: Name required');
    });

    it('No postcode provided', async () => {
      const response = await request(app).post('/users').send({
        name: 'TestName',
        postcode: null,
        skill: 'TestSkill',
        description: 'TestDescription',
        free: false,
        professional: true,
        email: 'TestEmail@gmail.com',
      });

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal('User validation failed: postcode: Valid postcode required');
    });

    it('No skill provided', async () => {
      const response = await request(app).post('/users').send({
        name: 'TestName',
        postcode: 'OX2 6RU',
        skill: null,
        description: 'TestDescription',
        free: false,
        professional: true,
        email: 'TestEmail@gmail.com',
      });

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal('User validation failed: skill: Skill required');
    });

    it('No description provided', async () => {
      const response = await request(app).post('/users').send({
        name: 'TestName',
        postcode: 'OX2 6RU',
        skill: 'TestSkill',
        description: null,
        free: false,
        professional: true,
        email: 'TestEmail@gmail.com',
      });

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal('User validation failed: description: Description required');
    });

    it('No free provided', async () => {
      const response = await request(app).post('/users').send({
        name: 'TestName',
        postcode: 'OX2 6RU',
        skill: 'TestSkill',
        description: 'TestDescription',
        free: null,
        professional: true,
        email: 'TestEmail@gmail.com',
      });

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal('User validation failed: free: Is the service free?');
    });

    it('No professional provided', async () => {
      const response = await request(app).post('/users').send({
        name: 'TestName',
        postcode: 'OX2 6RU',
        skill: 'TestSkill',
        description: 'TestDescription',
        free: false,
        professional: null,
        email: 'TestEmail@gmail.com',
      });

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal('User validation failed: professional: Is the service professional?');
    });

    it('No email provided', async () => {
      const response = await request(app).post('/users').send({
        name: 'TestName',
        postcode: 'OX2 6RU',
        skill: 'TestSkill',
        description: 'TestDescription',
        free: false,
        professional: true,
        email: null,
      });

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal('User validation failed: email: Email required');
    });

    it('Invalid postcode', async () => {
      const response = await request(app).post('/users').send({
        name: 'TestName',
        postcode: 'afk jsl',
        skill: 'TestSkill',
        description: 'TestDescription',
        free: false,
        professional: true,
        email: 'TestEmail@gmail.com',
      });

      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal('User validation failed: postcode: Valid postcode required');
    });

    it('Invalid email', async () => {
      const response = await request(app).post('/users').send({
        name: 'TestName',
        postcode: 'OX2 6RU',
        skill: 'TestSkill',
        description: 'TestDescription',
        free: false,
        professional: true,
        email: 'dasdfklha',
      });
      expect(response.status).to.equal(404);
      expect(response.body.error).to.equal('User validation failed: email: Please enter a valid email.');
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
      const user3 = {
        name: 'TestName3',
        postcode: 'SK17 7DW',
        skill: 'TestSkill2',
        description: 'TestDescription3',
        free: false,
        professional: true,
        email: 'TestEmail3@gmail.com',
        lat: '51.767010',
        long: '-1.265490',
      };
      const user4 = {
        name: 'TestName4',
        postcode: 'SK17 7DW',
        skill: 'TestSkill2',
        description: 'TestDescription3',
        free: true,
        professional: true,
        email: 'TestEmail3@gmail.com',
        lat: '51.767010',
        long: '-1.265490',
      };

      users = await User.create(user1, user2, user3, user4);
    });

    describe('GET /users', () => {
      it('list all Users', async () => {
        const response = await request(app).get('/users');

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(4);
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

      it('list all Users', async () => {
        const response = await request(app).get('/users').query({ skill: 'TestSkill2' });

        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(3);
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

        const response = await request(app).patch(`/users/${user._id}`)
          .send({ name: 'UpdatedName' });

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

      it('updates postcode by Id', async () => {
        const user = users[0];

        const response = await request(app)
          .patch(`/users/${user._id}`)
          .send({ postcode: 'OX26 6UZ' });

        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal('TestName1');
        expect(response.body.postcode).to.equal('OX26 6UZ');
        expect(response.body.skill).to.equal('TestSkill1');
        expect(response.body.description).to.equal('TestDescription1');
        expect(response.body.free).to.equal(false);
        expect(response.body.professional).to.equal(true);
        expect(response.body.email).to.equal('TestEmail1@gmail.com');
        expect(response.body.lat).to.equal('51.8947556');
        expect(response.body.long).to.equal('-1.1471935');
      });

      it('returns a 404 if the user does not exist', async () => {
        const response = await request(app).patch('/users/123');

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('The user could not be found.');
      });

      it('No name provided', async () => {
        const user = users[0];

        const response = await request(app).patch(`/users/${user._id}`)
          .send({ name: null });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('Validation failed: name: Name required');
      });

      it('No postcode provided', async () => {
        const user = users[0];

        const response = await request(app).patch(`/users/${user._id}`)
          .send({ postcode: null });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('Validation failed: postcode: Valid postcode required');
      });

      it('No skill provided', async () => {
        const user = users[0];

        const response = await request(app).patch(`/users/${user._id}`)
          .send({ skill: null });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('Validation failed: skill: Skill required');
      });

      it('No description provided', async () => {
        const user = users[0];

        const response = await request(app).patch(`/users/${user._id}`)
          .send({ description: null });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('Validation failed: description: Description required');
      });

      it('No free provided', async () => {
        const user = users[0];

        const response = await request(app).patch(`/users/${user._id}`)
          .send({ free: null });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('Validation failed: free: Is the service free?');
      });

      it('No professional provided', async () => {
        const user = users[0];

        const response = await request(app).patch(`/users/${user._id}`)
          .send({ professional: null });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('Validation failed: professional: Is the service professional?');
      });

      it('No email provided', async () => {
        const user = users[0];

        const response = await request(app).patch(`/users/${user._id}`)
          .send({ email: null });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('Validation failed: email: Email required');
      });

      it('Invalid postcode', async () => {
        const user = users[0];

        const response = await request(app).patch(`/users/${user._id}`)
          .send({ postcode: 'afkjsldjf' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('Validation failed: postcode: Valid postcode required');
      });

      it('Invalid email', async () => {
        const user = users[0];

        const response = await request(app).patch(`/users/${user._id}`)
          .send({ email: 'dasdfklha' });

        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('Validation failed: email: Please enter a valid email.');
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
