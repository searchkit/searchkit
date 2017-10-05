require("es6-promise").polyfill()
var context = require.context('./src', true, /.+(Spec|\.unit)\.tsx?$/);
context.keys().forEach(context);
