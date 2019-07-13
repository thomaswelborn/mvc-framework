module.exports = function(settings) {
  if(settings.options) {
    if(settings.options.processName) {
      let processName
      let processNameOptions = settings.options.processName
      let processNameFilePath = processNameOptions.filePath
      switch(typeof processNameFilePath) {
        case 'string':
          processNameOptions = (
            processNameFilePath === 'processNameByPath'
          ) ? $.lib.declare.processNameByPath
          : null
          break
        case 'object':
          processNameOptions = function(filePath) {
            if(processNameFilePath.location === 'relative') {
              filePath = $.lib.path.relative($.basedir, filePath)
            }
            if(processNameFilePath.replace) {
              for(let replaceSettings of processNameFilePath.replace) {
                replaceSettings['origin'] = filePath
                filePath = $.tasks.subtasks.string.replace(replaceSettings)
              }
            }
            if(processNameFilePath.transform) {
              for(let transformSettings of processNameFilePath.transform) {
                transformSettings['origin'] = filePath
                filePath = $.tasks.subtasks.string.transform(transformSettings)
              }
            }
            return JSON.stringify(filePath)
          }
          break
      }
      settings.options.processName = processNameOptions
    }
    return $.lib.declare(settings.options)
  } else {
    return $.lib.through2.obj()
  }
}
