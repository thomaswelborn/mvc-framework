var gulp = require('gulp');
var gulpConcat = require('gulp-concat');
var gulpMinify = require('gulp-minify');
var path = require('path');

var configuration = {
  name: 'mvc-framework',
  files: {
    root: function() {
      return configuration.paths.develop.root.concat(configuration.name, '.js');
    },
    minifiedRoot: function() {
      return configuration.paths.develop.root.concat(configuration.name, '.min.js');
    },
  },
  paths: {
    develop: {
      root: 'develop/',
      src: [
        'develop/scripts/Events.js',
        'develop/scripts/AJAX.js',
        'develop/scripts/Model.js',
        'develop/scripts/View.js',
        'develop/scripts/Controller.js',
        'develop/scripts/Router.js'
      ],
    },
    test: {
      root: 'test/scripts/vendor',
    },
  },
};

var application = {
  concat: function() {
    var relativeDirectory = path.relative(configuration.paths.develop.root, __dirname);
    console.log(path.normalize(relativeDirectory, configuration.paths.develop.root));
    gulp
      .src(configuration.paths.develop.src)
      .pipe(gulpConcat(configuration.files.root()))
      .pipe(gulp.dest(path.normalize(relativeDirectory, configuration.paths.develop.root)));
  },
  minify: function() {
    gulp
      .src(configuration.files.root())
      .pipe(gulpMinify({
        ext: { min: '.min.js' } 
      }))
      .pipe(gulp.dest(configuration.paths.develop.root));
  },
  copy: function() {
    gulp
      .src(configuration.files.root())
      .pipe(gulp.dest(configuration.paths.test.root));
    gulp
      .src(configuration.files.minifiedRoot())
      .pipe(gulp.dest(configuration.paths.test.root));
  },
};

gulp.task('develop', function() {
  application.concat();
  application.minify();
  application.copy();
});
