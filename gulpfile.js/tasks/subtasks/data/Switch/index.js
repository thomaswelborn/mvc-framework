function switchDataType(data, dataName, dataSettings) {
  switch(dataSettings.type) {
    case 'json':
      data[dataName] = Tasks.Subtasks.Data.JSON(dataSettings)
      break
    default:
      data[dataName] = dataSettings
      break
  }
  return data
}
module.exports = function switchData(settings) {
  let data = {}
  for(let [dataName, dataSettings] of Object.entries(settings)) {
    switch(dataName) {
      case 'document':
        data = switchDataType(data, dataName, dataSettings)
        break
      case 'modules':
        let modules = {}
        for(let [moduleName, moduleSettings] of Object.entries(dataSettings)) {
          modules = switchDataType(modules, moduleName, moduleSettings)
        }
        data[dataName] = modules
        break
    }
  }
  return $.lib.data((file) => {
    return data
  })
}
