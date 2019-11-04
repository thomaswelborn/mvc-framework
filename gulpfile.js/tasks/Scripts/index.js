module.exports = function(rootProcess, data) {
  let Scripts = function(callback) {
    let packageStream = new $.lib.mergeStream()
    let dataRollupEntries = Object.values(data)
      .filter((dataRollupEntry) => dataRollupEntry.rollup)
    let dataRollupEntriesCount = 0
    let dataBabelEntries = Object.values(data)
      .filter((dataBabelEntry) => dataBabelEntry.babel)
    let dataBabelEntriesCount = 0
    for(let [packageName, packageSettings] of Object.entries(data)) {
      packageSettings.src.options = packageSettings.src.options || {}
      Tasks.Subtasks.DelSync(packageSettings.delSync)
      if(packageSettings.babel) {
        let task = $.lib.gulp
          .src(packageSettings.src.globs, packageSettings.src.options)
            .pipe(Tasks.Subtasks.Babel(packageSettings.babel))
            .pipe(Tasks.Subtasks.Concat(packageSettings.concat))
            .pipe(Tasks.Subtasks.Wrap(packageSettings.wrap))
            .pipe(Tasks.Subtasks.Minify(packageSettings.minify))
            .pipe($.lib.dest(...packageSettings.dest))
        packageStream.add(task)
        dataBabelEntriesCount++
      } else if(packageSettings.rollup) {
        let task = Tasks.Subtasks.Rollup(packageSettings.rollup)
        dataRollupEntriesCount++
      }
    }
    if(dataBabelEntries.length) {
      packageStream.on('finish', () => {
        if ($.lib.browserSync.has('boilerplate')) {
          if(dataRollupEntriesCount === dataRollupEntries.length) {
            $.lib.browserSync.get('boilerplate').reload(['*.js'])
            callback()
          }
        } else {
          callback()
        }
      })
    } else {
      if ($.lib.browserSync.has('boilerplate')) {
        if(dataRollupEntriesCount === dataRollupEntries.length) {
          $.lib.browserSync.get('boilerplate').reload(['*.js'])
          callback()
        }
      } else {
        callback()
      }
    }
  }
  return Scripts
}
