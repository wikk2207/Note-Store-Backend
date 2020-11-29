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
            res
            .status(201)
            .send(note);
        });
    },
    getAllNotes: async (req, res) => {
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
        if (!NOTE_TYPES.includes(type)) {
            return res
                .status(400)
                .send(errorMessage.invalidNoteType);
        }

        Note.find({userID, type})
            .then((results) => res.send(results))
            .catch((err) => console.log(err));
    },
    getSingleNote: async (req, res) => {
        const { id } = req.params;
        Note.findById(id)
            .then(note => {
                if(!note) { 
                    return res
                        .status(404)
                        .send(errorMessage.noteDoesntExist);
                 };
                return res.send(note);
            })
            .catch( err => {
                return res
                .status(404)
                .send(errorMessage.noteDoesntExist);
            });
    },
    updateNote: async (req, res) => {
        const { id } = req.params;

        const updatedNoteContent = { 
            type,// twitters, articles, notes
            title,
            content,
            articleUrl,
            twitterName,
            userID,
            created} = req.body;

        if (type) {
            if (!NOTE_TYPES.includes(newNoteContent.type)) {
                return res
                    .status(400)
                    .send(errorMessage.invalidNoteType);
            }
        }

        Note.findByIdAndUpdate(id, updatedNoteContent, async (err, result) => {
            if(err) {
                if(err.name === 'CastError') {
                    return sendNoteNotFound(res);
                }
            }
            getNote(id)
                .then(note => {
                    if(!note) {
                        sendNoteNotFound(res);
                        return;
                    }
                    res
                        .status(200)
                        .send(note);
                });
        });

    },
    deleteNote: async (req, res) => {
        const { id } = req.params;

        const note = await Note.findById(id);
        if(!note) { 
            return res
                .status(404)
                .send(errorMessage.noteDoesntExist);
         };

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

 const requiredNoteFields = () => {
    const requiredFields = [];
    for (property in NoteSchema.obj) {
       if(NoteSchema.obj[property].required) {
           requiredFields.push(property)
       }
    }
    return requiredFields;
};

const getNote = async (id) => {
    await Note.findById(id)
        .then(note => {
            if(!note) { 
                return null
                };
            return note;
        })
        .catch( err => {
            return null
        });
};

const sendNoteNotFound = (res) => {
    res
        .status(404)
        .send(errorMessage.noteDoesntExist);
};

 module.exports = note;