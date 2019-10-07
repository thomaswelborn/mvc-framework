module.exports = function(_settings) {
  let Process = require('./Process')
  let Processes = class {
    constructor() {
      let settings = _settings
      for(let [processName, processMethod] of Object.entries(settings)) {
        let process = new Process(processName, processMethod)
        Object.assign(this, process.tasks, process.series, process.parallel)
      }
    }
  }
  return Processes
}
