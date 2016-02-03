var static = require('node-static');
var path = require("path")

module.exports = {
  server: function() {
    var fileServer = new static.Server(path.resolve(__dirname, "../../../"))
    require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            fileServer.serve(request, response);
        }).resume();
    }).listen(8080);
  }
}
