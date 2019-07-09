module.exports = function(settings) {
  if(settings) {
    return $.lib.compileHandlebars({}, settings.options)
  } else {
    return $.lib.through2.obj()
  }
}
