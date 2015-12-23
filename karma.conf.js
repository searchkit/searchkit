var path = require("path");
var WebpackConfig = require('webpack-config');

// Karma configuration here
module.exports = function (config) {
  config.set({
    port: 3334,
    browsers: ['PhantomJS'],
    // singleRun: true, //just run once by default
    frameworks: ['jasmine'], //use jasmine as framework
    files: [
      path.join(__dirname, 'node_modules', 'phantomjs-polyfill', 'bind-polyfill.js'), // To enable PhantomJS to render React components
      'webpack.tests.js' //test files
    ],
    preprocessors: {
      'webpack.tests.js': ['webpack', 'sourcemap']
    },
    reporters: ['progress'], //report results in this format

    junitReporter: {
      outputDir: path.join(process.env.CIRCLE_TEST_REPORTS || '$CIRCLE_TEST_REPORTS', "karma", "junit.xml"),
      useBrowserName: false // add browser name to report and classes names
    },

    webpack: new WebpackConfig().extend("webpack.test.config")
  });
};
