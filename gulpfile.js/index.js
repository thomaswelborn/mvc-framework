require('./Global.js')

let Configuration = require('./Configuration.js')
let Processes = require('./Processes')(Configuration.data)

module.exports = new Processes()
