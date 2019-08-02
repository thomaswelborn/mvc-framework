(() => {
  require('./global.js')

  let processes = new Processes(Config.data)
  module.exports = processes

})()
