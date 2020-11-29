const supertest = require('supertest');
const app = require('../../src/app');
const request = supertest(app);
const { setupDB } = require('../test-setup');
const databaseName = "e2e-update-note";

setupDB(databaseName);

describe('PATCH /api/note', () => {
  const noteData = {
    type: 'twitters',
    title: 'Note nice title',
    content: 'Note content',
    userID: 'id',
    created: 'today',
  };

  it('should succesfully update a note', async () => {
    const postRes = await request
        .post('/api/note')
        .send(noteData);

    const noteID = postRes.body._id;
    const newTitle = 'New title';
    
    const patchRes = await request
        .patch(`/api/note/${noteID}`)
        .send({title: newTitle});

    expect(postRes.statusCode).toEqual(201);
    expect(patchRes.statusCode).toEqual(200);
    expect(patchRes.body.title).toBe(newTitle);
    expect(patchRes.body.type).toBe(noteData.type);
    expect(patchRes.body.content).toBe(noteData.content);
    expect(patchRes.body.userID).toBe(noteData.userID);
    expect(patchRes.body.created).toBe(noteData.created);
  });
  
  it('should receive error because a note doesn\'t exist', async () => {
    const patchRes = await request
        .patch(`/api/note/1`)
        .send({title: 'New title'});

    expect(patchRes.statusCode).toEqual(404);
  });
})