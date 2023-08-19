const moviesJson = require('./movies.json');
const fs = require('fs');

const bulk = moviesJson.reduce((acc, movie) => {
  acc.push({ index: { _index: 'search-movies', _id: movie.id } });
  acc.push(movie);
  return acc;
}, []);

fs.writeFileSync('./bulk.json', bulk.map((doc) => JSON.stringify(doc)).join('\n') + '\n');