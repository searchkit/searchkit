var path = require("path");
var express = require("express");
var webpack = require("webpack");
var webpackMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require('webpack-hot-middleware');
var favicon = require('serve-favicon');
var apps = require("../apps")
var _ = require("lodash")

module.exports = {
  start:function(port){
    var app = express();
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');


    app.use(favicon(__dirname + "/search.ico"))
    if (process.env.NODE_ENV === 'production'){
      app.use('/static', express.static(path.join(__dirname, "../dist")))
    } else {
      var config = require("../webpack.config.js");
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
    }


    app.get("/", function(req, res){
      res.render("index", {
        apps:apps
      })
    })

    app.get('/:bundle', function(req, res) {
      var bundle = req.params.bundle
      res.render('app-template', {
        bundle:bundle
      });
    });

    app.listen(port, function () {
      console.log(`server running at localhost:${port}, go refresh and see magic`);
    });
  }
}
