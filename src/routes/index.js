const express = require('express');
const { note, user } = require('../controllers');
const { noteExistsMiddleware } = require('../middlewares/noteMiddlewares');

const router = express.Router();

router.post('/user/login', user.userLogin);
router.post('/user/logout', user.userLogout);
router.post('/user/register', user.userRegister);

router.get('/notes', note.getAllNotes);
router.get('/notes/type', note.getAllNotesOfOneType);

router.post('/note', note.addNote);
router.get('/note/:id', note.getSingleNote);
router.patch('/note/:id', noteExistsMiddleware, note.updateNote, note.getSingleNote);
router.delete('/note/:id', noteExistsMiddleware, note.deleteNote);

module.exports = router;
