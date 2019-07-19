module.exports = function(settings) {
  if(settings) {
    return $.lib.prettyprint.pretty(
      settings.options.object,
      settings.options.indentSize,
      settings.options.outputTo,
      settings.options.fullFunction
    )
  } else {
    return $.lib.through2.obj()
  }
}
