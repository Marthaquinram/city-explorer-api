"use strict";
// this library lets us access our .env file
require("dotenv").config();

// express is a server library
const express = require("express");

// initalizes the express library
const app = express();

// library that determines who is allowed to speak to our server
const cors = require("cors");
const res = require("express/lib/response");

// this setting says that everyone is allowed to speak to our server
//middleware
//creating an instance of cors and telling our app to use it as part of the internet
app.use(cors());

// we are getting the port variable from the .env file.
const PORT = process.env.PORT;

// this is a route. if you turn the server on and go to http://localhost:3001/ (or whatever port you specified in your .env), you will see 'hello from the home route'
//GET = READ
// '/' is our "home" path or "testing" path
app.get("/", (req, res) => {
  res.send("testing, testing, is this thing on...???");
});

//create a route for handling weather data
app.get("/weather", (req, res) => {
  const cities = req.query.cities;
  console.log("weather requested: ", cities);
  const forecastResults = new Forecast(cities);
  console.log("Forecast Result: ", forecastResults);
  res.send(forecastResults);
});
// this class will be used to fullfill request for date and description
//reading the weather from our dummy data. static is a property that belongs to the Class no the instance of weather object that is created from the class.
class Forecast {
  static weatherFore = require("./data/weather.json");

  constructor(cities) {
   this.items = Forecast.weatherFore.find(weatherobj => weatherobj.city_name === cities); // this finds the matching city name, 
   this.weathArr = this.items.data.map(dayInfo => ({ // we are using maps to go through the 3 datas, and then its 
    description: `${dayInfo.low_temp}, ${dayInfo.high_temp} ${dayInfo.weather.description}`,
    data: `${dayInfo.datetime}`
   }))
  }

};

// this turns the server on to the port that you specifed in your .env file
// listen tells our express server which port to send data through.
app.listen(PORT, () => console.log(`listening on ${PORT}`));
