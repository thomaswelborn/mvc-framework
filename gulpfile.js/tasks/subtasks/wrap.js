module.exports = function(settings) {
  if(settings) {
    if(settings.options) {
      if(settings.options.imports) {
        if(settings.options.imports.processPartialName) {
          let processPartialName
          let processPartialNameOptions = settings.options.imports.processPartialName
          console.log('\n', 'processPartialNameOptions', '\n', processPartialNameOptions)
          let processPartialNameFilePath = processPartialNameOptions.filePath
          switch(typeof processPartialNameFilePath) {
            case 'string':
              processPartialNameOptions = (
                processPartialNameFilePath === 'processPartialNameByPath'
              ) ? $.lib.declare.processPartialNameByPath
                : null
              break
            case 'object':
              processPartialNameOptions = function(filePath) {
              if(processPartialNameFilePath.location === 'relative') {
                filePath = $.lib.path.relative($.basedir, filePath)
              }
              if(processPartialNameFilePath.replace) {
                for(let replaceSettings of processPartialNameFilePath.replace) {
                  replaceSettings['origin'] = filePath
                  filePath = Tasks.Subtasks.String.Replace(replaceSettings)
                }
              }
              if(processPartialNameFilePath.transform) {
                for(let transformSettings of processPartialNameFilePath.transform) {
                  transformSettings['origin'] = filePath
                  filePath = Tasks.Subtasks.String.Transform(transformSettings)
                }
              }
              if(settings.options.namespace) {
                filePath = settings.options.namespace.concat('.', filePath)
              }
              return filePath
            }
            break
          }
          settings.options.imports.processPartialName = processPartialNameOptions
        }
      }
    }
    return $.lib.wrap(
      settings.template,
      settings.data,
      settings.options
    )
  } else {
    return $.lib.through2.obj()
  }
}
