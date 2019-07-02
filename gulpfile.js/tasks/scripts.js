module.exports = function(data) {
  function concat(settings) {
    if(settings) {
      let filename = [
        settings.file.name,
        '.',
        settings.file.extension
      ].join('')
      let options = settings.options
      return $.lib.concat(filename, options)
    } else {
      return $.lib.through2.obj()
    }
  }
  function minify(settings) {
    if(settings) {
      let options = settings.options
      return $.lib.minify(options)
    } else {
      return $.lib.through2.obj()
    }
  }
  function scripts(callback) {
    let stream = new $.lib.stream()
    for(let [packageName, packageSettings] of Object.entries(data)) {
      let task = $.lib.gulp.src(['gulpfile.js/$.js', 'gulpfile.js/index.js'])
        .pipe(concat(packageSettings.concat))
        .pipe(minify(packageSettings.minify))
        .pipe($.lib.gulp.dest(packageSettings.dest))
      stream.add(task)
    }
    return stream
  }
  return scripts
}
