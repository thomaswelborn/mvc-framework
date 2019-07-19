module.exports = function(callback) {
  $.process = $.lib.spawn('gulp', [$.argv.task], {stdio: 'inherit'})
  callback()
}
