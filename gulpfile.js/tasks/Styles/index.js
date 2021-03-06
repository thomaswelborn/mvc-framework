module.exports = function(rootProcess, data) {
  let Styles = function(callback) {
    let packageStream = new $.lib.mergeStream()
    for(let [packageName, packageSettings] of Object.entries(data)) {
      packageSettings.src.options = packageSettings.src.options || {}
      let task = $.lib.gulp.src(packageSettings.src.globs, packageSettings.src.options)
          .pipe(Tasks.Subtasks.SASS(packageSettings.sass))
          .pipe(Tasks.Subtasks.Concat(packageSettings.concat))
          .pipe(Tasks.Subtasks.Flatten(packageSettings.flatten))
          .pipe(Tasks.Subtasks.Rename(packageSettings.rename))
        .pipe($.lib.dest(...packageSettings.dest))
      packageStream.add(task)
      Tasks.Subtasks.DelSync(packageSettings.delSync)
    }
    packageStream.on('finish', () => {
      if($.lib.browserSync.has('boilerplate')) {
        $.lib.browserSync.get('boilerplate').reload(['*.css'])
      }
    })
    return packageStream
  }
  return Styles
}
