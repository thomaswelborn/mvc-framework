module.exports = {
  init: function(settings) {
    if(settings) {
      settings.options = settings.options || {}
      return $.lib.sourcemaps.init(settings.options)
    } else {
      return $.lib.through2.obj()
    }
  },
  write: function(settings) {
    if(settings) {
      settings.options = settings.options || {}
      return $.lib.sourcemaps.write(settings.dest, settings.options)
    } else {
      return $.lib.through2.obj()
    }
  },
}
