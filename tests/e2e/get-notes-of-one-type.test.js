const supertest = require('supertest');
const app = require('../../src/app');
const request = supertest(app);
const { setupDB } = require('../test-setup');
const databaseName = "e2e-get-notes-of-one-type";

setupDB(databaseName);

describe('GET /api/notes/type', () => {
  const noteData = {
    type: 'notes',
    title: 'Note title',
    content: 'Note content',
    userID: 'id',
    created: 'today',
  };

  it('should get list of notes of one type only', async () => {
    await request
        .post('/api/note')
        .send(noteData);

    await request
        .post('/api/note')
        .send({...noteData, type: 'articles'});

    await request
        .post('/api/note')
        .send({...noteData, type: 'twitters'});

    const getRes = await request
        .get('/api/notes')
        .send({userID: noteData.userID});

    expect(getRes.statusCode).toEqual(200);
    expect(getRes.body).toHaveLength(3);

    const getNotesRes = await request
        .get('/api/notes/type')
        .send({userID: noteData.userID, type: 'notes'});

    expect(getNotesRes.statusCode).toEqual(200);
    expect(getNotesRes.body).toHaveLength(1);

    const getArticlesRes = await request
        .get('/api/notes/type')
        .send({userID: noteData.userID, type: 'articles'});

    expect(getArticlesRes.statusCode).toEqual(200);
    expect(getArticlesRes.body).toHaveLength(1);

    const getTwittersRes = await request
        .get('/api/notes/type')
        .send({userID: noteData.userID, type: 'twitters'});

    expect(getTwittersRes.statusCode).toEqual(200);
    expect(getTwittersRes.body).toHaveLength(1);
  });

  it('should get empty list', async () => {
    const res = await request
        .get('/api/notes/type')
        .send({userID: noteData.userID, type: 'notes'});

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(0);
  });

  it('should get error because of lack of the userID property', async () => {
    const res = await request
        .get('/api/notes/type')
        .send({type: 'notes'});

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Property "userID" is required')
  });

  it('should get error because of lack of the type property', async () => {
    const res = await request
        .get('/api/notes/type')
        .send({userID: 'id'});

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Property "type" is required')
  });

  it('should get error because of invalid type property', async () => {
    const res = await request
        .get('/api/notes/type')
        .send({userID: 'id', type: "type"});

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Note\'s type must be one of: "twitters", "articles", "notes"')
  });
})