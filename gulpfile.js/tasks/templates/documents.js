module.exports = function(rootProcess, data) {
  let DocumentTemplates = function(callback) {
    let stream = $.lib.mergeStream()
    for(let fileSettings of data) {
      $.tasks.subtasks.delSync(fileSettings.delSync)
      let task = $.lib.gulp
        .src(fileSettings.src.globs, fileSettings.src.options)
          .pipe($.tasks.subtasks.data(fileSettings.data))
          .pipe($.tasks.subtasks.compileHandlebars(fileSettings.compileHandlebars))
          .pipe($.tasks.subtasks.rename(fileSettings.rename))
        .pipe($.lib.gulp.dest(fileSettings.dest))
      stream.add(task)
    }
    return stream
  }
  return DocumentTemplates
}
