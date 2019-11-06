import Utils from '../Utils/index'
import Events from '../Events/index'

const Base = class extends Events {
  constructor(settings, configuration) {
    super()
    if(settings) this._settings = settings
    if(configuration) this._configuration = configuration
  }
  get uid() {
    this._uid = (this._uid)
    ? this._uid
    : Utils.UID()
    return this._uid
  }
  get _name() { return this.name }
  set _name(name) { this.name = name }
  get _configuration() {
    this.configuration = this.configuration || {}
    return this.configuration
  }
  set _configuration(configuration) { this.configuration = configuration }
  get _settings() {
    this.settings = this.settings || {}
    return this.settings
  }
  set _settings(settings) {
    this.settings = Utils.addPropertiesToObject(
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
export default Base
