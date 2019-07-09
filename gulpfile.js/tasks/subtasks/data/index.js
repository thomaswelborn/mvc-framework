module.exports = function(settings) {
  let data = {}
  for(let [dataName, dataSettings] of Object.entries(settings)) {
    switch(dataSettings.type) {
      case 'json':
        data[dataName] = require('./json.js')(dataSettings)
        break
    }
  }
  console.log(data)
  return $.lib.data((file) => {
    return data
  })
}
