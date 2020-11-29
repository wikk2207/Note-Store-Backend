const mongoose = require('mongoose');
const errorMessage = require('../utils/errorMessages');
require('../models/Note');

const Note = mongoose.model('notes');

const noteExistsMiddleware = (req, res, next) => {
    const { id } = req.params;
    Note.findById(id)
        .then(note => {
            if(!note) { 
                return res
                    .status(404)
                    .send(errorMessage.noteDoesntExist);
            };
            next();
        })
        .catch( err => {
            return res
            .status(404)
            .send(errorMessage.noteDoesntExist);
        });
}

module.exports = {
    noteExistsMiddleware
}