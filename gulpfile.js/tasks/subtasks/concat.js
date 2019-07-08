module.exports = function(settings) {
  if(settings) {
    return $.lib.concat(settings.options.path)
  } else {
    return $.lib.through2.obj()
  }
}
