var nextVersion = process.argv[2]
var book = require("../book")
var fs = require("fs")

var currentVersion = book.pluginsConfig.versions.options[0]
var url = "https://searchkit.github.io/searchkit/"
var getVersion = function(str){
  return str.replace(/^\D+/, "").split(".").map(Number)
}

var currentVersionNumber = getVersion(currentVersion.text)
var nextVersionNumber = getVersion(nextVersion)

var requiresNewVersion = (
  (nextVersionNumber[0] - currentVersionNumber[0]) +
  (nextVersionNumber[1] - currentVersionNumber[1])
) > 0

var nextVersionString = nextVersionNumber.join(".")
var version = {
  value:url+"v"+ nextVersionString,
  text:"Version " + nextVersionString,
  selected:true
}
if(requiresNewVersion){
  book.pluginsConfig.versions.options = (
    [version].concat(book.pluginsConfig.versions.options)
  )
} else {
  book.pluginsConfig.versions.options[0] = version
}

fs.writeFileSync(
  __dirname+"/../book.json",
  JSON.stringify(book, null, 2)
)
