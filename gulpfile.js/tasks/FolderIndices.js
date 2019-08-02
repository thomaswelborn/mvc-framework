module.exports = function(rootProcess, data) {
  let FolderIndices = function(callback) {
    for(let [folderIndexName, folderIndexSettings] of Object.entries(data)) {
      let folderIndex = new Tasks.Subtasks.FolderIndex(folderIndexSettings)
      folderIndex.index()
    }
    callback()
  }
  return FolderIndices
}
