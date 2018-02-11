var gulp = require('gulp');
var gulpConcat = require('gulp-concat');

var configuration = {
  develop: {
    src: 'develop/scripts/**.js',
    destination: 'develop/',
    filename: 'mvc-framework.js',
  },
  test: {
    destination: 'test/scripts/vendor',
  },
};

var application = {
  concat: function() {
    return gulp
      .src(configuration.develop.src)
      .pipe(gulpConcat(configuration.develop.filename))
      .pipe(gulp.dest(configuration.develop.destination));
  },
  copy: function() {
    return gulp
      .src(String.prototype.concat(
        configuration.develop.destination,
        configuration.develop.filename
      ))
      .pipe(gulp.dest(configuration.test.destination));
  },
};

gulp.task('develop', function() {
  application.concat();
  application.copy();
});
