var gulp = require("gulp");

var assetsGlob = "./src/**/*.{scss,svg,jpg,png}"

gulp.task("copy-assets", function() {
  gulp.src(assetsGlob)
    .pipe(gulp.dest("./lib"))
})

gulp.task("default", function() {
  gulp.watch(assetsGlob, ["copy-assets"])
})
