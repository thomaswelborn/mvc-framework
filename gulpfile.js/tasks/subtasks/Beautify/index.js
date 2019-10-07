module.exports = function(settings) {
  if(settings) {
    return $.lib.beautify(settings.data, settings.options)
  } else {
    return $.lib.through2.obj()
  }
}
