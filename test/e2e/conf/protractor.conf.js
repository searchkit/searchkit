
require("ts-node/register")
var server = require("../server/server")

exports.config = {

  seleniumAddress: 'http://localhost:4444/wd/hub',
  chromeDriver: '../../../selenium/chromedriver',
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
    // server.start(8080)
  }

};
