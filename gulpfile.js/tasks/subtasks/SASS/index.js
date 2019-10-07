module.exports = function(settings) {
  if(settings) {
    settings.options = settings.options || {}
    return $.lib.sass(settings.options).on('error', $.lib.sass.logError)
  } else {
    return $.lib.through2.obj()
  }
}
