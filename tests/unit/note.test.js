const mongoose = require('mongoose');

require('../../src/models/Note');

const NoteModel = mongoose.model('notes');

const noteData = {
    type: 'notes',
    title: 'Note title',
    content: 'Note content',
    userID: 'id',
    created: 'today',
};

describe('Note Model Test', () => {

    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    });
    
    it('create & save note successfully', async () => {
        const savedNote = await new NoteModel(noteData).save()

        expect(savedNote._id).toBeDefined();
        expect(savedNote.type).toBe(noteData.type);
        expect(savedNote.title).toBe(noteData.title);
        expect(savedNote.content).toBe(noteData.content);
        expect(savedNote.userID).toBe(noteData.userID);
        expect(savedNote.created).toBe(noteData.created);
    });

    it('insert note successfully, but the field does not defined in schema should be undefined', async () => {

        const savedNote = await new NoteModel({...noteData, description: 'this is a note'}).save()

        expect(savedNote._id).toBeDefined();
        expect(savedNote.description).toBeUndefined();
    });

    it('create note without required field should failed', async () => {
        const noteWithoutRequiredField = new NoteModel({title: noteData.title});
        let err;
        try {
            const savedNoteWithoutRequiredField = await noteWithoutRequiredField.save();
            error = savedNoteWithoutRequiredField;
        } catch (error) {
            err = error
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(err.errors.type).toBeDefined();
        expect(err.errors.content).toBeDefined();
        expect(err.errors.userID).toBeDefined();
        expect(err.errors.created).toBeDefined();
    });

});
