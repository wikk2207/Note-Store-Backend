const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const morgan = require('morgan');
const User = require('./models/User');
const LocalStrategy = require('passport-local').Strategy;
const routes = require('./routes');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(session({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);

module.exports = app;