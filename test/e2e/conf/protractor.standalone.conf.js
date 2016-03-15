
require("ts-node/register")
var server = require("../server/server")
var protractorConf = require("./protractor.conf.js")
protractorConf.config.onPrepare = function(){
  browser.ignoreSynchronization = true;
  server.start(4000)
}
exports.config = protractorConf.config
