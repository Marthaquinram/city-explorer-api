'use strict';

console.log('hello world!');
// this library lets us access our .env file
require('dotenv').config();

// express is a server library
const express = require('express');

// initalizes the express library
const app = express();

// library that determines who is allowed to speak to our server
const cors = require('cors');
const res = require('express/lib/response');

// this setting says that everyone is allowed to speak to our server
//middleware
//creating an instance of cors and telling our app to use it as part of the internet
app.use(cors());

// we are getting the port variable from the .env file.
const PORT = process.env.PORT;
const axios = require('axios');
// this is a route. if you turn the server on and go to http://localhost:3001/ (or whatever port you specified in your .env), you will see 'hello from the home route'
//GET = READ
// '/' is our "home" path or "testing" path
app.get('/', (req, res) => {
  res.send('testing, testing, is this thing on...???');
});

//create a route for handling weather data
app.get('/weather', async (req, res, next) => {
  const {lat,lon} = req.query;
  console.log(req.query);
  console.log(lat);
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5`;
  try{
    const response = await axios.get(url);
    const results = response.data.data.map(day => new Forecast(day));
    res.send(results);
  } catch(error) {
    error.customMessage = 'Something went wrong in your weather API call.'; //the catch is only gonna run if something goes wrong in the try. This is good for error handling.
    next(error);
  }
});
// this class will be used to fullfill request for date and description
//reading the weather from our dummy data. static is a property that belongs to the Class no the instance of weather object that is created from the class.
class Forecast {
  constructor(day) {
    this.description = day.weather.description;
    this.date = day.datetime;
  }

}


app.get('/movies', async (req, res, next) => {
  let search = req.query.search;
  search = search.split(',')[0];//going to return array split by commas
  console.log(search, 'Movie Search');
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${search}`;
  try{
    const response = await axios.get(url);
    console.log('This is my response! ', response);
    const results = response.data.results.map(movie => new Movies(movie));
    res.send(results);//response reps awaiting for axios, hey movie do this search, response = what they give back to us, we package it up into movies results and ship it off.
  } catch(error) {
    error.customMessage = 'Something went wrong in your weather API call.'; //the catch is only gonna run if something goes wrong in the try. This is good for error handling.
    next(error);
  }
});
// this class will be used to fullfill request for date and description
//reading the weather from our dummy data. static is a property that belongs to the Class no the instance of weather object that is created from the class.
class Movies {
  constructor(movie) {
    this.description = movie.overview;
    this.title = movie.title;
  }

}
//error handling function, Must be last app.use function in my application
app.use((error, req, res, next) => {
  res.status(500).send(`Something went wrong during an API call. ERROR: ${error.customMessage}`);
});

// this turns the server on to the port that you specifed in your .env file
// listen tells our express server which port to send data through.
app.listen(PORT, () => console.log(`listening on ${PORT}`));
