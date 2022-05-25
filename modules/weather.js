'use strict';
const axios = require('axios');
let cache = require('./cache.js');




async function getWeather (req, res) {
  const latLon = req.query; //object destructuring
  const key = 'my-key:'+ latLon;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${latLon.lat}&lon=${latLon.lon}&days=5`;
  if(cache[key] !==undefined){
    console.log('Cache hit');
    return cache[key];
  } else{
    console.log('Cache miss');

    axios
      .get(url)
      .then(response => {
        const results = response.data.data.map(day => new Forecast(day));
        cache[key] = results;
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
