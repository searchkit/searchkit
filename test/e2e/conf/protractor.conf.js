
require("ts-node/register")

exports.config = {

  seleniumAddress: 'http://localhost:4444/wd/hub',
  chromeDriver: '../../../selenium/chromedriver',
  framework: 'jasmine',
  specs: [
    '../specs/**/*Spec.ts'
  ],

  jasmineNodeOpts: {
    defaultTimeoutInterval: 60000,
    isVerbose: false,
    showColors: true,
    includeStackTrace: true
  },

  onPrepare: function() {
    browser.ignoreSynchronization = true;
  }

};
