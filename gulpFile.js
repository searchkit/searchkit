var gulp = require("gulp");

gulp.task("copy-assets", function() {
  gulp.src("./src/**/*.{scss,svg,jpg,png}")
    .pipe(gulp.dest("./lib"))
})
