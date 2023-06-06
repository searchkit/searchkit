const moviesJson = require('./movies.json');
const fs = require('fs');

const movies = moviesJson.map((movie) => {
  const { Language, Country, Genre, Metascore, Actors, Director = "", Writer, Year, Runtime, imdbRating, imdbVotes, Released, ...rest } = movie;
  return {
    ...rest,
    id: `${movie.imdbID}`,
    language: Language ? Language.split(', ') : [],
    genres: Genre.split(', '),
    actors: Actors ? Actors.split(', ') : [],
    country: Country ? Country.split(', ') : [],
    directors: Director ? Director.split(', ') : [],
    writers: Writer ? Writer.split(', ') : [],
    year: parseInt(Year, 10),
    metascore: parseInt(Metascore, 10),
    runtime: parseInt(Runtime, 10),
    imdbRating: parseFloat(imdbRating),
    imdbVotes: parseInt((imdbVotes || "").replace(/,/g, ''), 10),
    released: Date.parse(Released) ? new Date((Date.parse(Released))).toISOString() : null
  };
});

const bulk = movies.reduce((acc, movie) => {
  acc.push({ index: { _index: 'search-movies', _id: movie.id } });
  acc.push(movie);
  return acc;
}, []);

fs.writeFileSync('./bulk.json', bulk.map((doc) => JSON.stringify(doc)).join('\n') + '\n');