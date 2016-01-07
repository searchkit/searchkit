var static = require('node-static');
var path = require("path")
require("ts-node/register")

exports.config = {

  seleniumAddress: 'http://localhost:4444/wd/hub',
  chromeDriver: '../../../selenium/chromedriver',
  baseUrl: "http://localhost:3000/",
  framework: 'jasmine',
  specs: [
    '../specs/**/*Spec.ts'
  ],

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000,
    isVerbose: false,
    showColors: true,
    includeStackTrace: true
  },

  onPrepare: function() {
    browser.ignoreSynchronization = true;
    var fileServer = new static.Server(path.resolve(__dirname, "../../../"))
    require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            fileServer.serve(request, response);
        }).resume();
    }).listen(8080);

  }

};
