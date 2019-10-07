module.exports = function(rootProcess, data) {
  let BrowserSync = function(callback) {
    process.on('process:spawn', function processExit() {
      $.lib.browserSync.get('boilerplate').exit()
    })
    let settings = Object.assign(
      {
        etag: false,
        maxage: 0,
      },
      data,
      {
        snippetOptions: {
          rule: {
            match: /<\/body>/i,
            fn: function (snippet, match) {
              return snippet + match
            }
          }
        }
      }
    )
    let browserSync
    if ($.lib.browserSync.has('boilerplate')) {
      browserSync = $.lib.browserSync.get('boilerplate')
      browserSync.exit()
    } else {
      browserSync = $.lib.browserSync.create('boilerplate')
      browserSync.emitter.on('init', function browserSyncInit() {
        callback()
      })
    }
    browserSync.init(settings)
  }
  return BrowserSync
}
