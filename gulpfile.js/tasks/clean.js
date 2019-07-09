module.exports = function(rootProcess, data) {
  function Clean(callback) {
    if(data) {
      for(let [packageName, packageSettings] of Object.entries(data)) {
        $.tasks.subtasks.delSync(packageSettings)
      }
    }
    callback()
  }
  return Clean
}
