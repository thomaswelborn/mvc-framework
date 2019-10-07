module.exports = function(rootProcess, data) {
  let Scripts = function(callback) {
    let packageStream = new $.lib.mergeStream()
    for(let [packageName, packageSettings] of Object.entries(data)) {
      packageSettings.src.options = packageSettings.src.options || {}
      Tasks.Subtasks.DelSync(packageSettings.delSync)
      let task = $.lib.gulp
        .src(packageSettings.src.globs, packageSettings.src.options)
          .pipe(Tasks.Subtasks.Babel(packageSettings.babel))
          .pipe(Tasks.Subtasks.Concat(packageSettings.concat))
          .pipe(Tasks.Subtasks.Wrap(packageSettings.wrap))
          .pipe(Tasks.Subtasks.Minify(packageSettings.minify))
        .pipe($.lib.dest(...packageSettings.dest))
      packageStream.add(task)
    }
    packageStream.on('finish', () => {
      if($.lib.browserSync.has('boilerplate')) {
        $.lib.browserSync.get('boilerplate').reload(['*.js'])
      }
    })
    return packageStream
  }
  return Scripts
}
