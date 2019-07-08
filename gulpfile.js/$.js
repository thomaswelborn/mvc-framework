global.$ = {
  libraries: {
    gulp: require('gulp'),
    compileHandlebars: require('gulp-compile-handlebars'),
    concat: require('gulp-concat'),
    data: require('gulp-data'),
    declare: require('gulp-declare'),
    flatten: require('gulp-flatten'),
    handlebars: require('gulp-handlebars'),
    rename: require('gulp-rename'),
    sass: require('gulp-sass'),
    sourcemaps: require('gulp-sourcemaps'),
    wrap: require('gulp-wrap'),
    browserSync: require('browser-sync').create(),
    del: require('del'),
    decache: require('decache'),
    fs: require('fs'),
    path: require('path'),
    pluginError: require('plugin-error'),
    mergeStream: require('merge2'),
    through2: require('through2'),
    underscore: require('underscore'),
  },
}
$.lib = $.libraries
$.lib.sass.compiler = require('node-sass')
$.basedir = $.lib.path.join(__dirname, '..')
$.configuration = require('./configuration.js')
$.config = $.configuration
$.tasks = require('./tasks')
$.processes = require('./processes')
module.exports = $
