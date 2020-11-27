 const mongoose = require('mongoose');
 const { NoteSchema, NOTE_TYPES } = require('../models/Note');
 const errorMessage = require('../utils/errorMessages');
 require('../models/Note');

 const Note = mongoose.model('notes');

 const note = {
    addNote: async (req, res) => {
        const newNoteContent = { 
            type,// twitters, articles, notes
            title,
            content,
            articleUrl,
            twitterName,
            userID,
            created} = req.body;
        
        for (const property of requiredNoteFields()) {
            if(!isValidRequiredProperty(newNoteContent[property], property, res)) {
                return;
            };
        }

        if (!NOTE_TYPES.includes(newNoteContent.type)) {
            return res
                .status(400)
                .send(errorMessage.invalidNoteType);
        }

        const newNote = await new Note(newNoteContent).save((err, note) => {
            if(err) {
                res.sendStatus(500);
            }
            console.log('Note saved:', note);
            res.send(note);
        });
    },
    getAllNotes: (req, res) => {
        const { userID } = req.body;

        if (!isValidRequiredProperty(userID, 'userID', res)) { return };

        Note.find({userID})
            .then((results) => res.send(results))
            .catch((err) => console.log(err));
    },
    getAllNotesOfOneType: (req, res) => {
        const { userID, type } = req.body;

        if (!isValidRequiredProperty(userID, 'userID', res)) { return };
        if (!isValidRequiredProperty(type, 'type', res)) { return };

        Note.find({userID, type})
            .then((results) => res.send(results))
            .catch((err) => console.log(err));
    },
    getSingleNote: (req, res) => {
        const { id } = req.params;
        const note = findNote(id, res);
        if(!note) { return };
        res.send(note);
    },
    updateNote: (req, res) => {
        const updatedNoteContent = { 
            type,// twitters, articles, notes
            title,
            content,
            articleUrl,
            twitterName,
            userID,
            created} = req.body;

        Note.findByIdAndUpdate(req.params.id, updatedNoteContent)
          .then((updatedNote) => res.send(updatedNote))
          .catch((err) => console.log(err));
        },
    deleteNote: (req, res) => {
        const { id } = req.params;

        const note = findNote(id, res);
        if(!note) { return };

        Note.findByIdAndDelete(id)
          .then((result) => {
            if (!result) {
              res.sendStatus(404)
            } else {
              res.sendStatus(200);
            }
        })
        .catch((err) => res.sendStatus(500));
    }
 };

 const isValidRequiredProperty = (property, propertyName, res) => {
    if (!property) {
        res
            .status(400)
            .send(errorMessage.missingProperty(propertyName));
    }
    return Boolean(property);
 };

 const sendNoteNotExist = (res) => {
    res
        .status(404)
        .send(errorMessage.noteDoesntExist);
 }

 const findNote = (id, res) => {
    Note.findById(id)
        .then((results) => {
            if (!results) {
                sendNoteNotExist(res);
                return null;
            } else {
                return results;
            }
        })
        .catch((err) => {
            sendNoteNotExist(res);
            return null;
        });
 }

 const requiredNoteFields = () => {
    const requiredFields = [];
    for (property in NoteSchema.obj) {
       if(NoteSchema.obj[property].required) {
           requiredFields.push(property)
       }
    }
    return requiredFields;
};

 module.exports = note;