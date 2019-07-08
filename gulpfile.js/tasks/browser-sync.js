module.exports = function(rootProcess, data) {
  let BrowserSync = function(callback) {
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
