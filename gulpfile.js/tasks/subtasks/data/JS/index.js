module.exports = function(settings) {
  let data = require($.lib.path.join(
    $.basedir,
    $.lib.path.format(settings.request)
  ))
  return data
}
