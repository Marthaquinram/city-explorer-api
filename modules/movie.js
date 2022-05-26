'use strict';

const axios = require('axios');
let cache = require('./cache.js');

async function getMovies(req, res) {
  let search = req.query.search;
  search = search.split(',')[0];//going to return array split by commas
  const key = 'my-key:' + search;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${search}`;
  if(cache[key] !==undefined && (Date.now() - cache[key].timestamp < 50000)){
    console.log('Cache hit', cache[key].timestamp);
    return cache[key];
  } else{
    console.log('Cache miss');

    axios
      .get(url)
      .then(response => {
        const results = response.data.results.map(movie => new Movies(movie));
        cache[key] = results;
        res.status(200).send(results);
      })
      .catch(error => res.status(500).send(`${error} `));
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
