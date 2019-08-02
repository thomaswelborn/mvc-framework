let Processes = class {
  constructor(settings) {
    this._settings = settings
    for(let [processName, processMethod] of Object.entries(this.settings)) {
      let process = new Processes.Process(processName, processMethod)
      Object.assign(this, process.tasks, process.series, process.parallel)
    }
  }
  get _settings() { return this.settings }
  set _settings(settings) { this.settings = Object.assign({}, settings) }
}

module.exports = Processes
