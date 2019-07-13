module.exports = function(settings) {
  if(settings) {
    settings.options.helpers = {
      '_':  function() {
        let utilArguments = Object.values(arguments).slice(0, -1)
        let utilMethod = utilArguments.shift()
        return $.lib.lodash[utilMethod](...utilArguments)
      }
    }
    return $.lib.compileHandlebars({}, settings.options)
  } else {
    return $.lib.through2.obj()
  }
}
