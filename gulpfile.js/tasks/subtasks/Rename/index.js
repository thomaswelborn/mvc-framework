module.exports = function(settings) {
  if(settings) {
    settings.options = settings.options || {}
    return $.lib.rename(
      $.lib.path.format(settings.options)
    )
  } else {
    return $.lib.through2.obj()
  }
}
