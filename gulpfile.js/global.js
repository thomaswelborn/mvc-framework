global.$ = {
  process: process,
  argv: require('yargs').argv,
  libraries: {
    gulp: require('gulp'),
    babel: require('gulp-babel'),
    beautify: require('js-beautify').js,
    browserSync: require('browser-sync'),
    buffer: require('vinyl-buffer'),
    cleanHTML: require('gulp-htmlclean'),
    concat: require('gulp-concat'),
    compileHandlebars: require('gulp-compile-handlebars'),
    data: require('gulp-data'),
    decache: require('decache'),
    declare: require('gulp-declare'),
    del: require('del'),
    dest: require('gulp-multi-dest'),
    express: require('express'),
    file: require('gulp-file'),
    flatten: require('gulp-flatten'),
    fs: require('fs'),
    handlebars: require('gulp-handlebars'),
    lodash: require('lodash'),
    mergeStream: require('merge-stream'),
    minify: require('gulp-minify'),
    minifyHTML: require('gulp-htmlmin'),
    mongoose: require('mongoose'),
    path: require('path'),
    pluginError: require('plugin-error'),
    prettyprint: require('js-object-pretty-print'),
    rename: require('gulp-rename'),
    sass: require('gulp-sass'),
    source: require('vinyl-source-stream'),
    spawn: require('child_process').spawnSync,
    through2: require('through2'),
    util: require('util'),
    wrap: require('gulp-wrap'),
  },
}
$.lib = $.libraries
$.lib.lodash.mixin(require('../utils/scripts/lodash/mixins.js'))
$.lib.sass.compiler = require('node-sass')
$.basedir = $.lib.path.join(__dirname, '..')
global.Tasks = require('./Tasks')
