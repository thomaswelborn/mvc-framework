module.exports = function(settings) {
  if(settings) {
    return $.lib.declare(settings.options)
  } else {
    return $.lib.through2.obj()
  }
}
