'use strict';

console.log('hello world!');
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const getWeather = require('./modules/weather');
const getMovies = require('./modules/movie');

app.use(cors());

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('testing, testing, is this thing on...???');
});


app.get('/weather', getWeather);


app.get('/movies', getMovies );

app.use((error, req, res, next) => {
  res.status(500).send(`Something went wrong during an API call. ERROR: ${error.customMessage}`);
});


app.listen(PORT, () => console.log(`listening on ${PORT}`));
