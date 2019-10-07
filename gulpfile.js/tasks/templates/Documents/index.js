module.exports = function(rootProcess, data) {
  let DocumentTemplates = function(callback) {
    let stream = $.lib.mergeStream()
    for(let fileSettings of data) {
      Tasks.Subtasks.DelSync(fileSettings.delSync)
      let task = $.lib.gulp
        .src(fileSettings.src.globs, fileSettings.src.options)
          .pipe(Tasks.Subtasks.Data.Switch(fileSettings.data))
          .pipe(Tasks.Subtasks.CompileHandlebars(fileSettings.compileHandlebars))
          .pipe(Tasks.Subtasks.CleanHTML(fileSettings.cleanHTML))
          .pipe(Tasks.Subtasks.MinifyHTML(fileSettings.minifyHTML))
          .pipe(Tasks.Subtasks.Rename(fileSettings.rename))
        .pipe($.lib.dest(...fileSettings.dest))
      stream.on('finish', () => {
        if($.lib.browserSync.has('boilerplate')) {
          $.lib.browserSync.get('boilerplate').reload()
        }
      })
      stream.add(task)
    }
    return stream
  }
  return DocumentTemplates
}
