module.exports = function(settings) {
  if(settings) {
    return $.lib.minifyHTML(settings.options)
  } else {
    return $.lib.through2.obj()
  }
}
