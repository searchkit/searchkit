var gulp = require('gulp');

gulp.task('copy-css', function() {
   gulp.src('src/**/*.scss')
   .pipe(gulp.dest('lib'));
});
