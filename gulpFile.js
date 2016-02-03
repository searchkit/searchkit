var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer")

var assetsGlob = "./src/**/*.{scss,svg,jpg,png}"
var themeGlob = "./theming/*.scss"

gulp.task("copy-assets", function() {
  gulp.src(assetsGlob)
    .pipe(gulp.dest("./lib/src"))
})

gulp.task("theme", function() {
  gulp.src(themeGlob)
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({}))
    .pipe(gulp.dest("./release"))
})

gulp.task("default",["copy-assets","theme"], function() {
  gulp.watch(assetsGlob, ["copy-assets"])
  gulp.watch(themeGlob, ["theme"])

})
