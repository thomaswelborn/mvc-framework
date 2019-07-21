module.exports = function(rootProcess, settings) {
  let Spawn = function(callback) {
    $.process.emit('reload')
    $.lib.spawn(
      settings.task,
      $.argv._,
      settings.options
    )
    callback()
  }
  return Spawn
}
