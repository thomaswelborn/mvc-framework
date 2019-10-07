module.exports = function(rootProcess, data) {
  function Clean(callback) {
    if(data) {
      for(let [packageName, packageSettings] of Object.entries(data)) {
        Tasks.Subtasks.DelSync(packageSettings)
      }
    }
    callback()
  }
  return Clean
}
