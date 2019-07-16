module.exports = function(rootProcess, data) {
  let Copy = function(callback) {
    let stream = $.lib.mergeStream()
    for(let [packageName, packageSettings] of Object.entries(data)) {
      let task = $.lib.gulp.src(packageSettings.src.globs, packageSettings.src.options)
        .pipe($.lib.gulp.dest(packageSettings.dest))
      stream.add(task)
    }
    return stream
  }
  return Copy
}
