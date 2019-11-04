module.exports = function(rootProcess, data) {
  let Copy = function(callback) {
    let stream = $.lib.mergeStream()
    for(let [packageName, packageSettings] of Object.entries(data)) {
      let task = $.lib.gulp.src(packageSettings.src.globs, packageSettings.src.options)
        .pipe(Tasks.Subtasks.Concat(packageSettings.concat))
        .pipe($.lib.dest(...packageSettings.dest))
      stream.add(task)
    }
    stream.on('finish', () => {
      if($.lib.browserSync.has('boilerplate')) {
        $.lib.browserSync.get('boilerplate').reload()
      }
    })
    return stream
  }
  return Copy
}
