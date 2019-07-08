const Process = require('./process')
var _settings
var Processes = class {
  constructor(settings) {
    this.settings = settings
    for(let [processName, processMethod] of Object.entries(this.settings)) {
      let process = new Process(processName, processMethod)
      Object.assign(this, process.tasks, process.series, process.parallel)
    }
  }
  get settings() { return _settings }
  set settings(settings) { _settings = Object.assign({}, settings) }
}

module.exports = Processes
