var _name = {}
var _settings = {}
var _tasks = {}
var _series = {}
var _parallel = {}
var Process = class {
  constructor(name, settings) {
    this.name = name
    this.settings = settings
    if(this.settings.tasks) this.tasks = this.settings.tasks
    if(this.settings.series) this.series = this.settings.series
    if(this.settings.parallel) this.parallel = this.settings.parallel
  }
  get name() { return _name }
  set name(name) { _name = name }
  get settings() { return _settings }
  set settings(settings) { _settings = Object.assign({}, settings) }
  get tasks() { return _tasks }
  set tasks(tasks) {
    for(let [taskName, taskSettings] of Object.entries(tasks)) {
      console.log(taskName, taskSettings)
      switch(taskName) {
        case 'templates':
          for(let [templateTaskName, templateTaskSettings] of Object.entries(taskSettings)) {
            _tasks[
              [this.name, ':', taskName, ':', templateTaskName].join('')
            ] = $.tasks[taskName][templateTaskName](this.name, templateTaskSettings)
          }
          break
        default:
          _tasks[
            [this.name, ':', taskName].join('')
          ] = $.tasks[taskName](this.name, taskSettings)
          break;
      }
    }
  }
  get series() { return _series }
  set series(series) {
    for(let [seriesName, seriesSettings] of Object.entries(series)) {
      for(let seriesTaskName of seriesSettings) {
        let seriesTaskIndex = seriesSettings.indexOf(seriesTaskName)
        seriesTaskName = [this.name, ':', seriesTaskName].join('')
        seriesSettings[seriesTaskIndex] = this.tasks[seriesTaskName]
      }
      _series[seriesName] = $.lib.gulp.series(...seriesSettings)
    }
  }
  get parallel() { return _parallel }
  set parallel(parallel) {
    for(let [parallelName, parallelSettings] of Object.entries(parallel)) {
      for(let parallelTaskName of parallelSettings) {
        let parallelTaskIndex = parallelSettings.indexOf(parallelTaskName)
        parallelTaskName = [this.name, ':', parallelTaskName].join('')
        parallelSettings[parallelTaskIndex] = this.tasks[parallelTaskName]
      }
      _parallel[parallelName] = $.lib.gulp.parallel(...parallelSettings)
    }
  }
}
module.exports = Process
