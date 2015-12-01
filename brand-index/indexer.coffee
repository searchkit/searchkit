elasticsearch = require "elasticsearch"
promise       = require "bluebird"
moment        = require "moment"
_             = require "lodash"

client = new elasticsearch.Client({
  host:"localhost:9200"
})

getMultiFieldDef = (name) ->
  def = {
    type: "multi_field"
    fields: {
      "raw": {type:"string", "index": "not_analyzed"}
    }
  }

processedMovies = movies.map (asset)->
  years = getYears(movie.Year)
  return compact({
    title:asset.title
    pixelWidth:asset.pixelWidth
    pixelHeight: asset.pixelHeight
    orientation: asset.orientation
    originalFilename: asset.originalFilename
    filetype: asset.filetype
    fileCategory: asset.fileCategory
    created: moment(asset.datecreated, "MM/DD/YY").format("YYYY-MM-DD")
    modified: moment(asset.datemodified, "MM/DD/YY").format("YYYY-MM-DD")
    assetExpiry: moment(asset.assetExpiryDate, "MM/DD/YY").format("YYYY-MM-DD")
  })

mapping = {
  index:"assets"
  type:"asset"
  body:
    asset:
      properties:
        version:{type:"integer"}
        pixelWidth:{type:"integer"}
        pixelHeight: {type:"integer"}

}

for m in processedAssets
  commands.push {index:{_index:"assets", _type:"asset", _id:m.artwork_id}}
  commands.push(m)

client.indices.delete {index:"assets"}, (err, res)->
  console.log(err, res)
  client.indices.create {index:"assets"}, (err, res)->
    console.log(err, res)
    client.indices.putMapping mapping, (err, res)->
      console.log(err, res)
      client.bulk {body:commands}, (err, res)->
        if err
          return console.log err
        if res.errors
          return console.log(errors)

        console.log "indexed #{res.items.length} items in #{res.took}ms"
