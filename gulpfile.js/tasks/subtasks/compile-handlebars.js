module.exports = function(settings) {
  if(settings) {
    if(settings.options.batch) {
      settings.options.batch = $.lib.path.join(
        $.basedir,
        settings.options.batch
      )
    }
    return $.lib.compileHandlebars({}, settings.options)
  } else {
    return $.lib.through2.obj()
  }
}
