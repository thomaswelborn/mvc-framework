let _name = {}
let _settings = {}
let _tasks = {}
let _series = {}
let _parallel = {}
let Process = class {
  constructor(name, settings) {
    this.name = name
    this.settings = settings
    if(this.settings.Tasks) this.tasks = this.settings.Tasks
    if(this.settings.Series) this.series = this.settings.Series
    if(this.settings.Parallel) this.parallel = this.settings.Parallel
  }
  get name() { return _name }
  set name(name) { _name = name }
  get settings() { return _settings }
  set settings(settings) { _settings = Object.assign({}, settings) }
  get tasks() { return _tasks }
  set tasks(tasks) {
    for(let [taskName, taskSettings] of Object.entries(tasks)) {
      switch(taskName) {
        case 'Templates':
          for(let [templateTaskName, templateTaskSettings] of Object.entries(taskSettings)) {
            _tasks[
              [this.name, ':', taskName, ':', templateTaskName].join('')
            ] = Tasks[taskName][templateTaskName](this.name, templateTaskSettings)
          }
          break
        default:
          _tasks[
            [this.name, ':', taskName].join('')
          ] = Tasks[taskName](this.name, taskSettings)
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
