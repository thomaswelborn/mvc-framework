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

    if($.lib.browserSync.has('boilerplate')) {
      $.lib.browserSync.get('boilerplate').reload(['*.js'])
    }
    callback()
  }
  return Spawn
}
