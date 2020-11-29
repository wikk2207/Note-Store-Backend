const supertest = require('supertest');
const app = require('../../src/app');
const request = supertest(app);
const { setupDB } = require('../test-setup');
const databaseName = "e2e-get-notes";

setupDB(databaseName);

describe('GET /api/notes', () => {
  const noteData = {
    type: 'notes',
    title: 'Note title',
    content: 'Note content',
    userID: 'id',
    created: 'today',
  };

  it('should get list of notes with added note', async () => {
    const postRes = await request
      .post('/api/note')
      .send(noteData);

    const getRes = await request
    .get('/api/notes')
    .send({userID: noteData.userID});

    expect(postRes.statusCode).toEqual(201);
    expect(getRes.statusCode).toEqual(200);
    expect(getRes.body).toHaveLength(1);
  });

  it('should get empty list', async () => {
    const res = await request
    .get('/api/notes')
    .send({userID: noteData.userID});

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(0);
  });

  it('should get error because of lack of the userID', async () => {
    const res = await request
    .get('/api/notes')
    .send();

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Property "userID" is required')
  });
})