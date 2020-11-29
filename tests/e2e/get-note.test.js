const supertest = require('supertest');
const app = require('../../src/app');
const request = supertest(app);
const { setupDB } = require('../test-setup');
const databaseName = "e2e-get-note";

setupDB(databaseName);

describe('GET /api/note/:id', () => {
  const noteData = {
    type: 'twitters',
    title: 'Note nice title',
    content: 'Note content',
    userID: 'id',
    created: 'today',
  };

  it('should receive a note', async () => {
    const postRes = await request
        .post('/api/note')
        .send(noteData);

    const noteID = postRes.body._id;
    const getRes = await request
        .get(`/api/note/${noteID}`);

    expect(getRes.statusCode).toEqual(200);
    expect(getRes.body).toEqual(postRes.body);
  });

  it('should receive an error because the note doesn\'t exist', async () => {
    const getRes = await request
        .get(`/api/note/1`);

    expect(getRes.statusCode).toEqual(404);
    expect(getRes.text).toEqual('Note with given id doesn\'t exist');
  })
})