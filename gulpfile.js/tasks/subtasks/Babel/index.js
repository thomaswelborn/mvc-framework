module.exports = function(settings) {
  if(settings) {
    return $.lib.babel(settings.options)
  } else {
    return $.lib.through2.obj()
  }
}
