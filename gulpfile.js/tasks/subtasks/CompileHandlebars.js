module.exports = function(settings) {
  if(settings) {
    settings.options.helpers = {
      '_': function() {
        let _arguments = Object.values(arguments)
        let method = _arguments.splice(0, 1)[0]
        let options = _arguments.splice(-1)[0]
        _arguments = _arguments[0]
        if(options.fn) {
          let __ = ''
          for(let argument of _arguments) {
            __ = __.concat(options.fn(argument))
          }
          return __
        } else {
          return $.lib.lodash[method](_arguments)
        }
      }
    }
    return $.lib.compileHandlebars({}, settings.options)
  } else {
    return $.lib.through2.obj()
  }
}
