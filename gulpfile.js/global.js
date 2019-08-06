global.$ = {
  process: process,
  argv: require('yargs').argv,
  libraries: {
    gulp: require('gulp'),
    babel: require('gulp-babel'),
    cleanHTML: require('gulp-htmlclean'),
    concat: require('gulp-concat'),
    compileHandlebars: require('gulp-compile-handlebars'),
    data: require('gulp-data'),
    declare: require('gulp-declare'),
    dest: require('gulp-multi-dest'),
    file: require('gulp-file'),
    flatten: require('gulp-flatten'),
    handlebars: require('gulp-handlebars'),
    minify: require('gulp-minify'),
    minifyHTML: require('gulp-htmlmin'),
    rename: require('gulp-rename'),
    sass: require('gulp-sass'),
    sourcemaps: require('gulp-sourcemaps'),
    spawn: require('child_process').spawnSync,
    wrap: require('gulp-wrap'),
    del: require('del'),
    fs: require('fs'),
    beautify: require('js-beautify').js,
    path: require('path'),
    browserSync: require('browser-sync'),
    decache: require('decache'),
    express: require('express'),
    lodash: require('lodash'),
    mergeStream: require('merge2'),
    mongoose: require('mongoose'),
    pluginError: require('plugin-error'),
    prettyprint: require('js-object-pretty-print'),
    through2: require('through2'),
    util: require('util'),
  },
}
$.lib = $.libraries
$.lib.lodash.mixin(require('../utils/scripts/lodash/mixins.js'))
$.lib.sass.compiler = require('node-sass')
$.basedir = $.lib.path.join(__dirname, '..')
global.Tasks = require('./Tasks')
