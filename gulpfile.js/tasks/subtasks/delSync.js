module.exports = function(settings) {
  if(settings) return $.lib.del.sync(settings.src.globs)
}
