module.exports = function(rootProcess, data) {
  let Scripts = function(callback) {
    let packageStream = new $.lib.mergeStream()
    for(let [packageName, packageSettings] of Object.entries(data)) {
      packageSettings.src.options = packageSettings.src.options || {}
      packageSettings.sourcemaps = packageSettings.sourcemaps || {}
      let task = $.lib.gulp.src(packageSettings.src.globs, packageSettings.src.options)
        .pipe($.tasks.subtasks.sourcemaps.init(packageSettings.sourcemaps.init))
          .pipe($.tasks.subtasks.concat(packageSettings.concat))
          .pipe($.tasks.subtasks.minify(packageSettings.minify))
        .pipe($.tasks.subtasks.sourcemaps.write(packageSettings.sourcemaps.write))
        .pipe($.lib.gulp.dest(packageSettings.dest))
      packageStream.add(task)
      $.tasks.subtasks.delSync(packageSettings.delSync)
    }
    return packageStream
  }
  return Scripts
}
