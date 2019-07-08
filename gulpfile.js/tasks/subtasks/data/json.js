module.exports = function(settings) {
  if(settings) {
    return $.lib.data((file) => {
      let data = {}
      for(let [jsonDataName, jsonDataOptions] of Object.entries(settings)) {
        console.log('\n', 'jsonDataOptions', '\n', jsonDataOptions, '\n')
        data[jsonDataName] = require($.lib.path.join(
          $.basedir,
          $.lib.path.format(jsonDataOptions.name)
        ))
      }
      return data
    })
  } else {
    return $.lib.through2.obj()
  }
}
