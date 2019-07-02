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
