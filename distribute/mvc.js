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

require('./$.js')
let modes = {}
for(let [modeName, modeSettings] of Object.entries($.configuration)) {
  let taskSeries = []
  for(let [taskName, taskPackages] of Object.entries(modeSettings)) {
    let Task = $.tasks[taskName](taskPackages)
    taskSeries.push(Task)
  }
  modes[modeName] = $.lib.gulp.series(...taskSeries)
}
module.exports = modes
