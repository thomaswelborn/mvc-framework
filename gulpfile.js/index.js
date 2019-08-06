require('./global.js')

let Configuration = require('./Configuration.js')
let Processes = require('./Processes')(Configuration.data)
let processes = new Processes()
module.exports = processes
