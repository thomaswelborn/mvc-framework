module.exports = function(rootProcess, data) {
  let ScriptTemplates = function(callback) {
    let templateScriptStream = $.lib.mergeStream()
    for(let templateScriptSettings of data) {
      let partials = $.lib.gulp
        .src(templateScriptSettings.src.globs, templateScriptSettings.options)
          .pipe($.lib.handlebars({
            handlebars: require('handlebars')
          }))
          .pipe(Tasks.Subtasks.Wrap(templateScriptSettings.wrap.partials))
      // console.log('\n', 'partials', '\n', '-----', '\n', partials)
      let layouts = $.lib.gulp.src(templateScriptSettings.src.globs)
        .pipe($.lib.handlebars({
          handlebars: require('handlebars')
        }))
        .pipe(Tasks.Subtasks.Wrap(templateScriptSettings.wrap.layouts))
        .pipe(Tasks.Subtasks.Declare(templateScriptSettings.declare.layouts))

      let templateScript = $.lib.mergeStream(layouts, partials)
        .pipe(Tasks.Subtasks.Concat(templateScriptSettings.concat))
        .pipe($.lib.dest(templateScriptSettings.dest))
      templateScriptStream.add(templateScript)
    }
    return templateScriptStream
  }
  return ScriptTemplates
}
