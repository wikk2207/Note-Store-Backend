const express = require('express');
const mongoose = require('mongoose');

const PORT = process.env.APP_PORT || 9000;

const app = express();


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
  console.log('Connected to mlab database!');
  app.listen(PORT, () => console.log(`App is listening on port ${PORT}!`));
});