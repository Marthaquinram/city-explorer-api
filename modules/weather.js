'use strict';
const axios = require('axios');
let cache = require('./cache.js');




async function getWeather (req, res) {
  const {lat, lon} = req.query; //object destructuring
  const key = 'my-key:'+ lat+lon;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5`;
  if(cache[key] !==undefined && (Date.now()- cache[key].timestamp < 50000)){
    console.log('Cache hit', cache[key].timestamp);
    return cache[key];
  } else{
    console.log('Cache miss');
    cache[key] = {}; // making a nest object
    cache[key].timestamp = Date.now();
    axios
      .get(url)
      .then(response => {
        const results = response.data.data.map(day => new Forecast(day));
        cache[key].data = results;
        res.status(200).send(results);
      })
      .catch(error => res.status(500).send(`${error} `));
  }

  class Forecast {
    constructor(day) {
      this.description = day.weather.description;
      this.date = day.datetime;
    }

  }
}
module.exports = getWeather;
