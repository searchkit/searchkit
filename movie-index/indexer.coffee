elasticsearch = require "elasticsearch"
promise       = require "bluebird"
movies        = require "./imdbMovies"
moment        = require "moment"
_             = require "lodash"

client = new elasticsearch.Client({
  # host:"localhost:9200"
  host:"http://site:33ea8b2ed941dc6b96c1ca3434b7a9ba@eu-west-1.searchbox.io"
})


toNumber = (str)->
  return undefined unless str
  Number(str.replace(/\D+/g,""))

splitComma = (str)->
  return [] if str is "N/A"
  return str.split(", ")

splitWriter = (str)->
  _.unique _.map splitComma(str), (writer)->
    writer.replace(/\s\(.+\)/,"")

processAwards = (str)->

notNA = (str)-> str isnt "N/A"

getYears = (str)->
  return {} if str is "N/A"
  tokens = str.split("–")
  return {
    year:toNumber(tokens[0])
    yearEnded:toNumber(tokens[1])
  }

compact = (ob)->
  for k,v of ob
    delete ob[k] unless v and v isnt "N/A"
  return ob
processedMovies = movies.map (movie)->
  years = getYears(movie.Year)
  return compact({
    title:movie.Title
    year:years.year
    yearEnded:years.yearEnded
    rated:movie.Rated
    released:moment(movie.Released, "DD MMM YYYY").format("YYYY-MM-DD") if notNA(movie.Released)
    runtimeMinutes:toNumber(movie.Runtime)
    genres:splitComma(movie.Genre)
    directors:splitComma(movie.Director)
    writers:splitWriter(movie.Writer)
    actors:splitComma(movie.Actors)
    plot:movie.Plot
    languages:splitComma(movie.Language)
    countries:splitComma(movie.Country)
    awards:movie.Awards if notNA(movie.Awards)
    poster:movie.Poster
    metaScore:Number(movie.Metascore) if notNA(movie.Metascore)
    imdbRating:Number(movie.imdbRating)
    imdbVotes:toNumber(movie.imdbVotes)
    imdbId:movie.imdbID
    type:movie.Type
  })

getMultiFieldDef = (name) ->
  def = {
    type: "multi_field"
    fields: {
      "raw": {type:"string", "index": "not_analyzed"}
    }
  }

  def.fields[name] =  {"type" : "string", "index" : "analyzed"}

  def

# console.log processedMovies
mapping = {
  index:"movies"
  type:"movie"
  body:
    movie:
      properties:
        year:{type:"integer"}
        yearEnded:{type:"integer"}
        released:{type:"date"}
        runtimeMinutes:{type:"integer"}
        genres: getMultiFieldDef("genres")
        countries: getMultiFieldDef("countries")
        languages: getMultiFieldDef("languages")
        metaScore:{type:"integer"}
        imdbRating:{type:"float"}
        imdbVotes:{type:"integer"}
        writers: getMultiFieldDef("writers")
        directors: getMultiFieldDef("directors")
        actors: getMultiFieldDef("actors")
        type: getMultiFieldDef("type")
}
commands = []

for m in processedMovies
  commands.push {index:{_index:"movies", _type:"movie", _id:m.imdbId}}
  commands.push(m)
client.indices.delete {index:"movies"}, (err, res)->
  console.log(err, res)
  client.indices.create {index:"movies"}, (err, res)->
    console.log(err, res)
    client.indices.putMapping mapping, (err, res)->
      console.log(err, res)
      client.bulk {body:commands}, (err, res)->
        if err
          return console.log err
        if res.errors
          return console.log(errors)

        console.log "indexed #{res.items.length} items in #{res.took}ms"