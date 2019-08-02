module.exports = function(rootProcess, data) {
  let Scripts = function(callback) {
    let packageStream = new $.lib.mergeStream()
    for(let [packageName, packageSettings] of Object.entries(data)) {
      packageSettings.src.options = packageSettings.src.options || {}
      packageSettings.sourcemaps = packageSettings.sourcemaps || {}
      Tasks.Subtasks.DelSync(packageSettings.delSync)
      let task = $.lib.gulp
        .src(packageSettings.src.globs, packageSettings.src.options)
          .pipe(Tasks.Subtasks.SourceMaps.init(packageSettings.sourcemaps.init))
          .pipe(Tasks.Subtasks.Babel(packageSettings.babel))
          .pipe(Tasks.Subtasks.Concat(packageSettings.concat))
          .pipe(Tasks.Subtasks.Wrap(packageSettings.wrap))
          .pipe(Tasks.Subtasks.Minify(packageSettings.minify))
          .pipe(Tasks.Subtasks.SourceMaps.write(
            packageSettings.sourcemaps.write
          ))
        .pipe($.lib.dest(packageSettings.dest))
      packageStream.add(task)
    }
    return packageStream
  }
  return Scripts
}
