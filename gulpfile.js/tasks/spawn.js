module.exports = function(rootProcess, settings) {
  let Spawn = function(callback) {
    process.emit('process:spawn')
    process.argv.shift()
    let processName = process.argv.shift()
    let processParameters = process.argv
    let childProcess = $.lib.spawn(
      processName,
      processParameters,
      settings.options
    )
    callback()
  }
  return Spawn
}
