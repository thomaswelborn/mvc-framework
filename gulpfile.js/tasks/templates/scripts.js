module.exports = function(rootProcess, data) {
  let ScriptTemplates = function(callback) {
    let templateScriptStream = $.lib.mergeStream()
    for(let templateScriptSettings of data) {
      let partials = $.lib.gulp
        .src(templateScriptSettings.src.globs, templateScriptSettings.options)
          .pipe($.lib.handlebars({
            handlebars: require('handlebars')
          }))
          .pipe($.tasks.subtasks.wrap(templateScriptSettings.wrap.partials))

      let layouts = $.lib.gulp.src(templateScriptSettings.src.globs)
        .pipe($.lib.handlebars({
          handlebars: require('handlebars')
        }))
        .pipe($.tasks.subtasks.wrap(templateScriptSettings.wrap.layouts))
        .pipe($.tasks.subtasks.declare(templateScriptSettings.declare.layouts))

      let templateScript = $.lib.mergeStream(layouts, partials)
        .pipe($.tasks.subtasks.concat(templateScriptSettings.concat))
        .pipe($.lib.dest(templateScriptSettings.dest))
      templateScriptStream.add(templateScript)
    }
    return templateScriptStream
  }
  return ScriptTemplates
}
