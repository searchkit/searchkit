var book = require("../book")
var fs = require("fs")

book.pluginsConfig.versions.options.forEach(function(option){
  delete option.selected
})

fs.writeFileSync(
  __dirname+"/../book.json",
  JSON.stringify(book, null, 2)
)
