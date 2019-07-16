global.$ = {
  libraries: {
    gulp: require('gulp'),
    babel: require('gulp-babel'),
    concat: require('gulp-concat'),
    compileHandlebars: require('gulp-compile-handlebars'),
    data: require('gulp-data'),
    declare: require('gulp-declare'),
    flatten: require('gulp-flatten'),
    handlebars: require('gulp-handlebars'),
    minify: require('gulp-minify'),
    rename: require('gulp-rename'),
    sass: require('gulp-sass'),
    sourcemaps: require('gulp-sourcemaps'),
    wrap: require('gulp-wrap'),
    del: require('del'),
    fs: require('fs'),
    path: require('path'),
    browserSync: require('browser-sync').create(),
    decache: require('decache'),
    express: require('express'),
    lodash: require('lodash'),
    mergeStream: require('merge2'),
    mongoose: require('mongoose'),
    pluginError: require('plugin-error'),
    through2: require('through2'),
  },
}
$.lib = $.libraries
$.lib.lodash.mixin(require('../utils/scripts/lodash/mixins.js'))
$.lib.sass.compiler = require('node-sass')
$.basedir = $.lib.path.join(__dirname, '..')
$.configuration = require('./configuration.js')
$.config = $.configuration
$.tasks = require('./tasks')
$.processes = require('./processes')
module.exports = $
