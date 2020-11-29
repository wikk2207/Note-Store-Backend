const supertest = require('supertest');
const app = require('../../src/app');
const request = supertest(app);
const { setupDB } = require('../test-setup');
const databaseName = "e2e-user-register";

setupDB(databaseName);

describe('POST /user/register', () => {
  it('should succesfully register a user', async () => {
    const res = await request
        .post('/api/user/register')
        .send({
          username: 'user',
          password: 'password',
        });

    expect(res.statusCode).toEqual(201);
  });
  

  it('register a user without "username" field should failed', async () => {
    const res = await request
      .post('/api/user/register')
      .send({password: 'password'});

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Property "username" is required');
  });

  it('register a user without "password" field should failed', async () => {
    const res = await request
      .post('/api/user/register')
      .send({username: 'username'});

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Property "password" is required');
  });

  it('register a user should failed because of username conflict', async () => {
    const userData = {
      username: 'user1',
      password: 'password',
    };
    const firstRes = await request
      .post('/api/user/register')
      .send(userData);

    const secondRes = await request
      .post('/api/user/register')
      .send(userData);

    expect(firstRes.statusCode).toEqual(201);
    expect(secondRes.statusCode).toEqual(409);
    expect(secondRes.text).toEqual('A user with the given username is already registered');
  });
})