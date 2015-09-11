// including plugins
var gulp = require('gulp')
, concat = require("gulp-concat")
, uglify = require("gulp-uglify");
 
// task
gulp.task('build-triangular', function () {
    gulp.src('./src/*.js') // path to your files
    .pipe(concat('triangular.js'))  // concat and name it "triangular.js"
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});