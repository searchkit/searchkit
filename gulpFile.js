var gulp = require('gulp');
var sass = require("gulp-sass");
var ts = require('gulp-typescript');


gulp.task("styles", function() {
  gulp.src('./src/index.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./release'));
})

gulp.task("lib-ts", function() {
  var tsProject = ts.createProject('tsconfig.json');
  tsProject
    .src()
    .pipe(ts(tsProject, {
      outFile:"./test.js"
    }))
    .js
    .pipe(gulp.dest("lib"))
})
