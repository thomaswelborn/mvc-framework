module.exports = function(rootProcess, data) {
  let BrowserSync = function(callback) {
    $.process.on('reload', () => {
      $.lib.browserSync.cleanup()
    })
    let settings = Object.assign(
      {},
      data,
      {
        snippetOptions: {
          rule: {
            match: /<\/body>/i,
            fn: function (snippet, match) {
              return snippet + match;
            }
          }
        }
      }
    )
    $.lib.browserSync.init(settings)
    callback()
  }
  return BrowserSync
}
