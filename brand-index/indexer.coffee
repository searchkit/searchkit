elasticsearch = require "elasticsearch"
promise       = require "bluebird"
moment        = require "moment"
_             = require "lodash"
assets        = require "./assets"

animalsAge = require "./animals-age";
animalsClassificiation = require "./animals-classification";
ethnicityCountry = require "./ethnicity-country";
peopleGender = require "./people-gender";

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

getLevelDef = (properties, name) ->
  properties[name+"_lvl1"] = {type:"string", "index": "not_analyzed"}
  properties[name+"_lvl2"] = {type:"string", "index": "not_analyzed"}
  properties[name+"_lvl3"] = {type:"string", "index": "not_analyzed"}

setHierarchicalValue = (fieldName, values, taxonomy, doc) ->

  parseLevels = (root, level) ->
    _.each root.I, (category) ->
      category.level = level
      parseLevels(category, level+1) if category.I

  findCategory = (root, categoryId) ->
    for category in root.I
      return category if category["-id"] is categoryId
      if category.I?
        childCategory = findCategory(category, categoryId)
        return childCategory if !!childCategory
    return false

  parseLevels(taxonomy.B, 1)

  categories = _(values.split(","))
  .map((value) =>
    findCategory(taxonomy.B, value)
  )
  .value()

  # console.log categories

  _.each categories, (cat) ->
    if !!cat
      doc[fieldName+"_lvl"+cat.level] ?= []
      doc[fieldName+"_lvl"+cat.level].push(cat['-optionsCurrentLang'])

processedAssets = _.map(assets,(asset)->
  doc = {}
  _.extend doc, {
    title:asset.title
    pixelWidth:asset.pixelwidth
    pixelHeight: asset.pixelheight
    orientation: asset.orientation
    originalFilename: asset.originalFilename
    filetype: asset.filetype
    fileCategory: asset.fileCategory
    created: asset.datecreated
    modified: asset.datemodified
    assetExpiry: asset.assetExpiryDate
    imagePath: "#{asset.pathFolderNames.join('/')}/#{asset.title}.#{asset.filetype}"
    resolution: asset.resolution
    pathFolderIds:asset.pathFolderIDs
  }

  setHierarchicalValue("animalsAge", asset["BMS_META|MAMMALS|AGE"], animalsAge, doc)
  setHierarchicalValue("animalsClassification", asset["BMS_META|MAMMALS|CLASSIFICATION"], animalsClassificiation, doc)
  setHierarchicalValue("ethnicityCountry", asset["BMS_META|PEOPLE|ETHNICITYCOUNTRY"], ethnicityCountry, doc)
  setHierarchicalValue("peopleGender", asset["BMS_META|PEOPLE|GENDER"], peopleGender, doc)


  doc

)

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

getLevelDef(mapping.body.asset.properties,"animalsAge")

commands = []

for m in processedAssets
  commands.push {index:{_index:"assets", _type:"asset", _id:m.artwork_id}}
  commands.push(m)

# console.log processedAssets
#
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
          return console.log(res.errors)

        console.log "indexed #{res.items.length} items in #{res.took}ms"
