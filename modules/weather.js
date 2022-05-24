'use strict';
const axios = require('axios');


async function getWeather (req, res, next) {
  const {lat,lon} = req.query;
  //object destructuring
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5`;
  try{
    const response = await axios.get(url);
    const results = response.data.data.map(day => new Forecast(day));
    res.send(results);
  } catch(error) {
    error.customMessage = 'Something went wrong in your weather API call.';
    next(error);
  }
}

class Forecast {
  constructor(day) {
    this.description = day.weather.description;
    this.date = day.datetime;
  }

}

module.exports = getWeather;
