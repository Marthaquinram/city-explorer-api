'use strict';

const axios = require('axios');

async function getMovies(req, res, next) {
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
}
class Movies {
  constructor(movie) {
    this.title = movie.title;
    this.description = movie.overview;
    this.poster = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    this.avgVotes = movie.vote_average;
    this.totalVotes = movie.vote_count;
    this.popularity = movie.popularity;
    this.release = movie.release_date;
  }
}

module.exports = getMovies;
