const supertest = require('supertest');
const app = require('../../src/app');
const request = supertest(app);
const { setupDB } = require('../test-setup');
const databaseName = "e2e-post-note";

setupDB(databaseName);

describe('POST /api/note', () => {
  const noteData = {
    type: 'notes',
    title: 'Note title',
    content: 'Note content',
    userID: 'id',
    created: 'today',
  };

  it('should create a new note of type "notes"', async () => {
    const res = await request
      .post('/api/note')
      .send(noteData);

    expect(res.statusCode).toEqual(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.type).toBe(noteData.type);
    expect(res.body.title).toBe(noteData.title);
    expect(res.body.content).toBe(noteData.content);
    expect(res.body.userID).toBe(noteData.userID);
    expect(res.body.created).toBe(noteData.created);
  });

  it('create note without "type" field should failed', async () => {
    const { type, ...missingPropertyNote} = noteData;
    const res = await request
      .post('/api/note')
      .send(missingPropertyNote);
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Property "type" is required')
  });

  it('create note without "content" field should failed', async () => {
    const { content, ...missingPropertyNote} = noteData;
    const res = await request
      .post('/api/note')
      .send(missingPropertyNote);
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Property "content" is required')
  });

  it('create note without "userID" field should failed', async () => {
    const { userID, ...missingPropertyNote} = noteData;
    const res = await request
      .post('/api/note')
      .send(missingPropertyNote);
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Property "userID" is required')
  });

  it('create note without "created" field should failed', async () => {
    const { created, ...missingPropertyNote} = noteData;
    const res = await request
      .post('/api/note')
      .send(missingPropertyNote);
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Property "created" is required')
  });

  it('create note with invalid type should failed', async () => {
    const invalidTypeNote = {
      ...noteData,
      type: 'invalid',
    };
    const res = await request
      .post('/api/note')
      .send(invalidTypeNote);

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Note\'s type must be one of: "twitters", "articles", "notes"')
  });

  it('create note successfully, but the field does not defined in schema should be undefined', async () => {
    const extraFieldNote = {
      ...noteData,
      priority: '2',
    };
    const res = await request
      .post('/api/note')
      .send(extraFieldNote);

    expect(res.statusCode).toEqual(201);
    expect(res.body.priority).toBeUndefined();
  });
})