const mongoose = require('mongoose');
const passport = require('passport');
const errorMessage = require('../utils/errorMessages');
const checkRequiredField = require('../utils/checkRequiredField');
require('../models/User');

const User = mongoose.model('users');

const user = {
    userLogin: (req, res, next) => {
        const { username, password } = req.body;

        if (!checkRequiredField(username, 'username', res)) { return };
        if (!checkRequiredField(password, 'password', res)) { return };

        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) {
                return res
                    .status(403)
                    .send(errorMessage.invalidUser);
            }

            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.send(user);
            });
        })(req, res, next);
    },
    userLogout: (req, res) => {
        req.logout();
        res.sendStatus(200);
    },
    userRegister: (req, res) => {
        const { username, password } = req.body;

        if (!checkRequiredField(username, 'username', res)) { return };
        if (!checkRequiredField(password, 'password', res)) { return };

        User.register(new User({username}), password, function(err, user) {
            if (err) {
                console.log(err);
                if (err.name === 'UserExistsError' || err.code === 11000) {
                    return res
                        .status(409)
                        .send(errorMessage.userRegistered);
                }
                return res.sendStatus(500);
            }
            passport.authenticate('local')(req, res, function() {
                res.sendStatus(201);
            });
        });
    },
};

module.exports = user;