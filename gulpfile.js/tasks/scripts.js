module.exports = function(rootProcess, data) {
  let Scripts = function(callback) {
    let packageStream = new $.lib.mergeStream()
    for(let [packageName, packageSettings] of Object.entries(data)) {
      packageSettings.src.options = packageSettings.src.options || {}
      packageSettings.sourcemaps = packageSettings.sourcemaps || {}
      $.tasks.subtasks.delSync(packageSettings.delSync)
      let task = $.lib.gulp
        .src(packageSettings.src.globs, packageSettings.src.options)
          .pipe($.tasks.subtasks.babel(packageSettings.babel))
          .pipe($.tasks.subtasks.concat(packageSettings.concat))
          .pipe($.tasks.subtasks.wrap(packageSettings.wrap))
          .pipe($.tasks.subtasks.minify(packageSettings.minify))
          .pipe($.tasks.subtasks.sourcemaps.write(
            packageSettings.sourcemaps.write
          ))
        .pipe($.lib.gulp.dest(packageSettings.dest))
      packageStream.add(task)
    }
    return packageStream
  }
  return Scripts
}
