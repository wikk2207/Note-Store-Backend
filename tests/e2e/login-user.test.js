const supertest = require('supertest');
const app = require('../../src/app');
const request = supertest(app);
const { setupDB } = require('../test-setup');
const databaseName = "e2e-user-login";

setupDB(databaseName);

describe('POST /user/login', () => {
  it('should succesfully login a user', async () => {
    const userData = {
        username: 'username',
        password: 'password',
      };
    const registerRes = await request
        .post('/api/user/register')
        .send(userData);

    const loginRes = await request
        .post('/api/user/login')
        .send(userData);

    expect(registerRes.statusCode).toEqual(201);
    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body.username).toEqual(userData.username);
    expect(loginRes.body._id).toBeDefined();
  });

  it('login a user without "username" field should failed', async () => {
    const res = await request
      .post('/api/user/login')
      .send({password: 'password'});

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Property "username" is required');
  });

  it('login a user without "password" field should failed', async () => {
    const res = await request
      .post('/api/user/login')
      .send({username: 'user'});

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Property "password" is required');
  });

  it('login a user with invalid password should fail', async () => {
    const userData = {
        username: 'user1',
        password: 'password',
      };
    const registerRes = await request
        .post('/api/user/register')
        .send(userData);

    const invalidUser = {
        ...userData,
        password: 'wrongpassword',
    }

    const loginRes = await request
        .post('/api/user/login')
        .send(invalidUser);

    expect(registerRes.statusCode).toEqual(201);
    expect(loginRes.statusCode).toEqual(403);
    expect(loginRes.text).toEqual('Invalid username or password');
  });

  it('login unregistered user should fail', async () => {
    const userData = {
        username: 'username',
        password: 'password',
      };
    const res = await request
        .post('/api/user/login')
        .send(userData);

    expect(res.statusCode).toEqual(403);
    expect(res.text).toEqual('Invalid username or password');
  });
})