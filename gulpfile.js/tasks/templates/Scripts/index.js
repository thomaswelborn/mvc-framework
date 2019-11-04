module.exports = function(rootProcess, data) {
  let ScriptTemplates = function(callback) {
    let templateScriptStream = $.lib.mergeStream()
    for(let templateScriptSettings of data) {
      if(templateScriptSettings.handlebars) {
        let layouts = $.lib.gulp
          .src(templateScriptSettings.src.globs, templateScriptSettings.src.options)
            .pipe($.lib.handlebars({
              handlebars: require('handlebars')
            }))
            .pipe(Tasks.Subtasks.Wrap(templateScriptSettings.wrap.layouts))
            .pipe(Tasks.Subtasks.Declare(templateScriptSettings.declare.layouts))
        let partials = $.lib.gulp
          .src(templateScriptSettings.src.globs, templateScriptSettings.src.options)
            .pipe($.lib.handlebars({
              handlebars: require('handlebars')
            }))
            .pipe(Tasks.Subtasks.Wrap(templateScriptSettings.wrap.partials))
        let templateScript = templateScriptStream.add(layouts, partials)
          .pipe(Tasks.Subtasks.Concat(templateScriptSettings.concat))
          .pipe($.lib.dest(...templateScriptSettings.dest))
      } else if(templateScriptSettings.ejs) {
        let layouts = $.lib.gulp
          .src(templateScriptSettings.src.globs, templateScriptSettings.src.options)
            .pipe(Tasks.Subtasks.Wrap(templateScriptSettings.wrap))
            .pipe(Tasks.Subtasks.Declare(templateScriptSettings.declare))
        let templateScript = templateScriptStream.add(layouts)
          .pipe(Tasks.Subtasks.Concat(templateScriptSettings.concat))
          .pipe($.lib.dest(...templateScriptSettings.dest))
      }
    }
    templateScriptStream.on('finish', () => {
      if($.lib.browserSync.has('boilerplate')) {
        $.lib.browserSync.get('boilerplate').reload()
      }
    })
    return templateScriptStream
  }
  return ScriptTemplates
}
