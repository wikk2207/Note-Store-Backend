const mongoose = require('mongoose');
const passport = require('passport');
require('../models/User');

const User = mongoose.model('users');

const user = {
    userLogin: (req, res, next) => {
        passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            return res
                .status(403)
                .send("Invalid username or password");
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
        if (!username || !password) {
            return res
                .status(400)
                .send("Username or password was not given");
        }
        console.log(username, password);
        User.register(new User({username}), password, function(err, user) {
            if (err.name === 'UserExistsError') {
                return res
                    .status(409)
                    .send("A user with the given username is already registered");
            }
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            passport.authenticate('local')(req, res, function() {
                res.sendStatus(201);
            });
        });
    },
};

module.exports = user;