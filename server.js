var path = require("path");
var express = require("express");
var webpack = require("webpack");
var webpackMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require("./webpack.dev.config.js");
var elasticsearch = require("elasticsearch")
var bodyParser = require("body-parser")
var methodOverride = require("method-override")


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

    app.post("/api/search/:index", function(req, res){
      client.search({
        index: req.params.index,
        body:req.body || {}
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
