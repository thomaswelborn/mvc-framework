global.$ = {
  libraries: {
    gulp: require('gulp'),
    concat: require('gulp-concat'),
    minify: require('gulp-minify'),
    stream: require('merge-stream'),
    through2: require('through2'),
    path: require('path'),
  },
  configuration: require('./configuration/index.js'),
  tasks: require('./tasks/index.js'),
}
$.lib = $.libraries
$.config = $.configuration
module.exports = $
