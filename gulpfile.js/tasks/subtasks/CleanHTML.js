module.exports = function(settings) {
  if(settings) {
    if(
      settings.options.unprotect &&
      Array.isArray(settings.options.unprotect)
    ) {
      settings.options.unprotect.forEach((regexp, index) => {
        settings.options.unprotect[index] = new RegExp(
          regexp.expression,
          regexp.flags
        )
      })
    } else {
      settings.options.unprotect = new RegExp(
        regexp.expression,
        regexp.flags
      )
    }
    return $.lib.cleanHTML(settings.options)
  } else {
    return $.lib.through2.obj()
  }
}
