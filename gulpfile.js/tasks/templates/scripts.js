module.exports = function(rootProcess, data) {
  let ScriptTemplates = function(callback) {
    let templateScriptStream = $.lib.mergeStream()
    for(let templateScriptSettings of data) {
      let partials = $.lib.gulp.src(templateScriptSettings.src.globs, templateScriptSettings.options)
        .pipe($.lib.handlebars({
          handlebars: require('handlebars')
        }))
        .pipe($.lib.wrap(
          'Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>))',
          {},
          {
            imports: {
              processPartialName: function(filePath) {
                let partialName = filePath.replace(
                  templateScriptSettings.handlebars.namespaceRoot,
                  ''
                ).replace('.js', '')
                return JSON.stringify(partialName)
              }
            }
          }
        ))
      templateScriptSettings.declare.options = Object.assign(
        templateScriptSettings.declare.options,
        {
          processName: function(filePath) {
            filePath = $.lib.path.relative($.basedir, filePath)
            var layoutName = filePath.replace(
              templateScriptSettings.handlebars.namespaceRoot,
              ''
            ).replace('.js', '')
            return JSON.stringify(layoutName);
          }
        }
      )
      let layouts = $.lib.gulp.src(templateScriptSettings.src.globs)
        .pipe($.lib.handlebars({
          handlebars: require('handlebars')
        }))
        .pipe($.lib.wrap('Handlebars.template(<%= contents %>)'))
        .pipe($.tasks.subtasks.declare(templateScriptSettings.declare))
      let templateScript = $.lib.mergeStream(layouts, partials)
        .pipe($.tasks.subtasks.concat(templateScriptSettings.concat))
        .pipe($.lib.gulp.dest(templateScriptSettings.dest))
      templateScriptStream.add(templateScript)
    }
    return templateScriptStream
  }
  return ScriptTemplates
}
