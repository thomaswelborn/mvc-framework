var gulp = require('gulp');
var gulpConcat = require('gulp-concat');
var gulpMinify = require('gulp-minify');
var path = require('path');

var configuration = {
  name: 'mvc-framework',
  files: {
    root: function() {
      return path.join(
        __dirname, 
        this.paths.develop.root
      ).concat(this.name, '.js');
    },
    minifiedRoot: function() {
      return path.join(
        __dirname, 
        this.paths.develop.root
      ).concat(this.name, '.min.js');
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
    gulp
      .src(configuration.develop.src)
      .pipe(gulpConcat(configuration.rootFile()))
      .pipe(gulp.dest(configuration.develop.root));
  },
  minify: function() {
    gulp
      .src(configuration.rootFile())
      .pipe(gulpMinify({
        ext: { min: '.min.js' } 
      }))
      .pipe(gulp.dest(configuration.develop.root));
  },
  copy: function() {
    gulp
      .src(configuration.files.root())
      .pipe(gulp.dest(configuration.test.root));
    gulp
      .src(configuration.files.minifiedRoot())
      .pipe(gulp.dest(configuration.test.root));
  },
};

gulp.task('develop', function() {
  application.concat();
  application.minify();
  application.copy();
});
