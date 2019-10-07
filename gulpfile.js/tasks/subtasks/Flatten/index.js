module.exports = function(settings) {
  if(settings) {
    settings = (
      typeof settings === 'boolean' &&
      settings === true
    ) ? {}
      : settings
    settings.options = settings.options || {}
    return $.lib.flatten(settings.options)
  } else {
    return $.lib.through2.obj()
  }
}
