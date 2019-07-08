module.exports = function(rootProcess, data) {
  let Watch = function() {
    for(let [packageName, packageSettings] of Object.entries(data)) {
      for(let taskName of packageSettings.task.tasks) {
        let taskNameIndex = packageSettings.task.tasks.indexOf(taskName)
        packageSettings.task.tasks[taskNameIndex] = [
          rootProcess, ':', taskName
        ].join('')
        packageSettings.task = $.lib.gulp[packageSettings.task.type](packageSettings.task.tasks)
        $.lib.gulp.watch(packageSettings.globs, packageSettings.options, packageSettings.task)
      }
    }
  }
  return Watch
}
