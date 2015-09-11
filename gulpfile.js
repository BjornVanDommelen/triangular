// including plugins
var gulp = require('gulp')
, concat = require("gulp-concat")
, uglify = require("gulp-uglify");
 
// task
gulp.task('build-triangular', function () {
    // Build unminified version
    gulp.src('./src/*.js')
    .pipe(concat('triangular.js'))
    .pipe(gulp.dest('.'));
    
    // Build minified version
    gulp.src('./src/*.js')
    .pipe(concat('triangular.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('.'));
});