module.exports = function(rootProcess, data) {
  let Styles = function(callback) {
    let packageStream = new $.lib.mergeStream()
    for(let [packageName, packageSettings] of Object.entries(data)) {
      packageSettings.src.options = packageSettings.src.options || {}
      packageSettings.sourcemaps = packageSettings.sourcemaps || {}
      let task = $.lib.gulp.src(packageSettings.src.globs, packageSettings.src.options)
        .pipe(Tasks.Subtasks.SourceMaps.init(packageSettings.sourcemaps.init))
          .pipe(Tasks.Subtasks.SASS(packageSettings.sass))
          .pipe(Tasks.Subtasks.Concat(packageSettings.concat))
          .pipe(Tasks.Subtasks.Flatten(packageSettings.flatten))
          .pipe(Tasks.Subtasks.Rename(packageSettings.rename))
        .pipe(Tasks.Subtasks.SourceMaps.write(packageSettings.sourcemaps.write))
        .pipe($.lib.dest(packageSettings.dest))
      packageStream.add(task)
      Tasks.Subtasks.DelSync(packageSettings.delSync)
    }
    return packageStream
  }
  return Styles
}
