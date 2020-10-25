const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const morgan = require('morgan');
const User = require('./models/User');
const LocalStrategy = require('passport-local').Strategy;
const routes = require('./routes');

const PORT = process.env.APP_PORT || 9000;

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

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.APP_DB_PORT;
const database = process.env.DB_DATABASE;

mongoose.set('useUnifiedTopology', true);
mongoose.connect(`mongodb://${user}:${password}@${host}:${port}/${database}`, {
    useNewUrlParser: true,
});

const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', () => {
  console.log('Connected to mongo database!');
  app.listen(PORT, () => console.log(`App is listening on port ${PORT}!`));
  app.use('/api', routes);
});