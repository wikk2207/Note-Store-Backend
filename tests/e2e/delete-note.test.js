const supertest = require('supertest');
const app = require('../../src/app');
const request = supertest(app);
const { setupDB } = require('../test-setup');
const databaseName = "e2e-delete-note";

setupDB(databaseName);

describe('DELETE /api/note/:id', () => {
  const noteData = {
    type: 'twitters',
    title: 'Note nice title',
    content: 'Note content',
    userID: 'id',
    created: 'today',
  };

  it('should succesfully delete a note', async () => {
    const postRes = await request
        .post('/api/note')
        .send(noteData);

    const noteID = postRes.body._id;
    const deleteRes = await request
        .delete(`/api/note/${noteID}`);

    const getRes = await request
        .get(`/api/note/${noteID}`);

    expect(deleteRes.statusCode).toEqual(200);
    expect(getRes.statusCode).toEqual(404);
    expect(getRes.text).toEqual('Note with given id doesn\'t exist');
  });

  it('should receive an error because the note with given id doesn\'t exist', async () => {
    const deleteRes = await request
        .delete(`/api/note/5f95ba7c5dde57003f546f5a`);

    expect(deleteRes.statusCode).toEqual(404);
    expect(deleteRes.text).toEqual('Note with given id doesn\'t exist');
  });
})