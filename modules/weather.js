'use strict';
const axios = require('axios');
// let cache = require('./cache.js');



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


  //     if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
  //       console.log('Cache hit');
  //     } else {
  //       console.log('Cache miss');
  //       cache[key] = {};
  //       cache[key].timestamp = Date.now();
  //       cache[key].data = axios.get(url)
  //         .then(response => parseWeather(response.data));
  //     }


  //     return cache[key].data;
  //   }
  //


  class Forecast {
    constructor(day) {
      this.description = day.weather.description;
      this.date = day.datetime;
    }

  }
}
module.exports = getWeather;
