MVC.Base = class extends MVC.Events {
  constructor(settings, configuration) {
    super()
    if(configuration) this._configuration = configuration
    if(settings) this._settings = settings
  }
  get _configuration() {
    this.configuration = (this.configuration)
      ? this.configuration
      : {}
    return this.configuration
  }
  set _configuration(configuration) { this.configuration = configuration }
  get _settings() {
    this.settings = (this.settings)
      ? this.settings
      : {}
    return this.settings
  }
  set _settings(settings) {
    this.settings = MVC.Utils.addPropertiesToObject(
      settings, this._settings
    )
  }
  setProperties(settings, keyMap, switches) {
    switches = switches || {}
    let settingsCount = Object.keys(settings).length
    let keyCount = 0
    keyMap
      .some((key) => {
        if(settings[key] !== undefined) {
          keyCount += 1
          if(switches[key]) {
            switches[key](settings[key])
          } else {
            this['_'.concat(key)] = settings[key]
          }
        }
        return (keyCount === settingsCount)
          ? true
          : false
      })
    return this
  }
  deleteProperties(settings, keyMap, switches) {
    switches = switches || {}
    let settingsCount = Object.keys(settings).length
    let keyCount = 0
    keyMap
      .some((key) => {
        if(settings[key] !== undefined) {
          keyCount += 1
          if(switches[key]) {
            switches[key](settings[key])
          } else {
            delete this[key]
          }
        }
        return (keyCount === settingsCount)
          ? true
          : false
      })
    return this
  }
}
