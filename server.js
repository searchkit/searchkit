require("coffee-script/register")
var path = require("path");
var express = require("express");
var webpack = require("webpack");
var webpackMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require("./webpack.dev.config.js");
var elasticsearch = require("elasticsearch")
var bodyParser = require("body-parser")
var methodOverride = require("method-override")
// var PermissionsService = require("./brand-index/PermissionsService")
var _ = require("lodash")

module.exports = {
  start: function(prodMode) {

    var env = {
      production: process.env.NODE_ENV === 'production'
    };

    var express = require('express');
    var app = express();
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/server/views');
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(methodOverride())

    var port = Number(process.env.PORT || 3000);

    if (!env.production) {
      var compiler = webpack(config);

      app.use(webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: 'src',
        stats: {
          colors: true,
          hash: false,
          timings: true,
          chunks: false,
          chunkModules: false,
          modules: false
        }
      }));

      app.use(webpackHotMiddleware(compiler));
      app.use("/assets", express.static(__dirname + '/brand-index/assets'));


    } else {
      app.use("/static", express.static(__dirname + '/../dist'));
    }


    var client = new elasticsearch.Client({
      host: 'localhost:9200',
      log: 'debug'
    });

    var currentGroupId = "20"
    app.get("/api/setgroup/:groupId", function(req, res){
      currentGroupId = req.params.groupId
      console.log("currentGroupId is "+ currentGroupId)
      res.end()
    })

    app.post("/api/search/:index", function(req, res){
      var queryBody = req.body || {}
      client.search({
        index: req.params.index,
        body:queryBody
      }).then(function(resp){
        res.send(resp)
      })
    });

    app.post("/api/multisearch/:index", function(req, res){
      var declareIndexCommand = {index:req.params.index}
      var mSearchPayload = _.chain(req.body)
        .map(function(query){
          return [declareIndexCommand, query]
        })
        .flatten().value()
      client.msearch({body:mSearchPayload})
        .then(function(resp){
          res.send(resp)
        })
    });

    app.post("/api/search/:index", function(req, res){
      var permissionsQuery = PermissionsService.makeQuery(currentGroupId)
      var queryBody = req.body || {}
      queryBody.query = _.merge(queryBody.query || {}, permissionsQuery)
      console.log(JSON.stringify(queryBody, null, 2))
      client.search({
        index: req.params.index,
        body:queryBody
      }).then(function(resp){
        res.send(resp)
      })
    });

    app.get('*', function(req, res) {
      res.render('index');
    });

    app.listen(port, function () {
      console.log('server running at localhost:3000, go refresh and see magic');
    });
  }
}
