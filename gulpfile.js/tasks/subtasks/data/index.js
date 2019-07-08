module.exports = function(settings) {
  let data
  switch(settings.type) {
    case 'json':
      data = require('./json.js')(settings.request)
      break
  }
  return data
}
