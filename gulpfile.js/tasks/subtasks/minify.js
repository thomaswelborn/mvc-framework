module.exports = function(settings) {
  if(settings) {
    return $.lib.minify(settings.options)
  } else {
    return $.lib.through2.obj()
  }
}
