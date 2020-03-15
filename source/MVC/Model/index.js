import Events from '../Events/index.js'

const Model = class extends Events {
  constructor(settings = {}, options = {}) {
    super()
    this.settings = settings
    this.options = options
  }
  get validSettings() { return [
    'localStorage',
    'defaults',
    'services',
    'serviceEvents',
    'serviceCallbacks',
  ] }
  get bindableEventClassPropertyTypes() { return [
    'service',
  ] }
  get settings() { return this._settings }
  set settings(settings) {
    this._settings = settings
    this.validSettings.forEach((validSetting) => {
      if(settings[validSetting]) this[validSetting] = settings[validSetting]
    })
    this.bindableEventClassPropertyTypes
      .forEach((bindableEventClassPropertyType) => {
        this.toggleEvents(bindableEventClassPropertyType, 'on')
      })
  }
  get options() {
    if(!this._options) this._options = {}
    return this._options
  }
  set options(options) { this._options = options }
  get services() {
    if(!this._services) this._services = {}
    return this._services
  }
  set services(services) { this._services = services }
  get data() {
    if(!this._data) this._data = {}
    return this._data
  }
  get defaults() {
    if(!this._defaults) this._defaults = {}
    return this._defaults
  }
  set defaults(defaults) {
    this._defaults = defaults
    this.set(this.defaults)
  }
  get localStorage() { return this._localStorage }
  set localStorage(localStorage) { this._localStorage = localStorage }
  get db() { return this._db }
  get _db() {
    let db = localStorage.getItem(this.localStorage.endpoint) || JSON.stringify(this.storageContainer)
    return JSON.parse(db)
  }
  set _db(db) {
    db = JSON.stringify(db)
    localStorage.setItem(this.localStorage.endpoint, db)
  }
  resetEvents(classType) {
    [
      'off',
      'on'
    ].forEach((method) => {
      this.toggleEvents(classType, method)
    })
    return this
  }
  toggleEvents(classType, method) {
    const baseName = classType.concat('s')
    const baseEventsName = classType.concat('Events')
    const baseCallbacksName = classType.concat('Callbacks')
    const base = this[baseName]
    const baseEvents = this[baseEventsName]
    const baseCallbacks = this[baseCallbacksName]
    if(
      base &&
      baseEvents &&
      baseCallbacks
    ) {
      Object.entries(baseEvents)
        .forEach(([baseEventData, baseCallbackName]) => {
          const [baseTargetName, baseEventName] = baseEventData.split(' ')
          const baseTarget = base[baseTargetName]
          const baseCallback = bseCallbacks[baseCallbackName]
          if(
            baseTargetName &&
            baseEventName &&
            baseTarget &&
            baseEventCallback
          ) {
            try {
              classTypeTarget[method](classTypeEventName, classTypeEventCallback)
            } catch(error) {}
          }
        })
    }
    return this
  }
  setDB() {
    let db = this._db
    switch(arguments.length) {
      case 1:
        var _arguments = Object.entries(arguments[0])
        _arguments.forEach(([key, value]) => {
          db[key] = value
        })
        break
      case 2:
        let key = arguments[0]
        let value = arguments[1]
        db[key] = value
        break
    }
    this._db = db
    return this
  }
  unsetDB() {
    switch(arguments.length) {
      case 0:
        delete this._db
        break
      case 1:
        let db = this._db
        let key = arguments[0]
        delete db[key]
        this._db = db
        break
    }
    return this
  }
  setDataProperty(key, value) {
    if(!this.data[key]) {
      Object.defineProperties(this.data, {
        ['_'.concat(key)]: {
          configurable: true,
          writable: true,
          enumerable: false,
        },
        [key]: {
          configurable: true,
          enumerable: true,
          get() { return this['_'.concat(key)] },
          set(value) { this['_'.concat(key)] = value }
        },
      })
    }
    this.data[key] = value
    this.emit('set'.concat(':', key), {
      key: key,
      value: value
    }, this)
    return this
  }
  unsetDataProperty(key) {
    if(this.data[key]) {
      delete this.data[key]
    }
    this.emit('unset'.concat(':', arguments[0]), this)
    return this
  }
  get() {
    if(arguments[0]) return this.data[arguments[0]]
    return Object.entries(this.data)
      .reduce((_data, [key, value]) => {
        _data[key] = value
        return _data
      }, {})
  }
  set() {
    if(arguments.length === 2) {
      this.setDataProperty(arguments[0], arguments[1])
      if(this.localStorage) this.setDB(arguments[0], arguments[1])
    } else if(
      arguments.length === 1 &&
      !Array.isArray(arguments[0]) &&
      typeof arguments[0] === 'object'
    ) {
      Object.entries(arguments[0]).forEach(([key, value]) => {
        this.setDataProperty(key, value)
        if(this.localStorage) this.setDB(key, value)
      })
    }
    this.emit('set', this.data, this)
    return this
  }
  unset() {
    if(arguments[0]) {
      this.unsetDataProperty(arguments[0])
      if(this.localStorage) this.unsetDB(key)
    } else {
      Object.keys(this.data).forEach((key) => {
        this.unsetDataProperty(key)
        if(this.localStorage) this.unsetDB(key)
      })
    }
    this.emit('unset', this)
    return this
  }
  parse(data = this.data) {
    return Object.entries(data).reduce((_data, [key, value]) => {
      if(value instanceof Model) {
        _data[key] = value.parse()
      } else {
        _data[key] = value
      }
      return _data
    }, {})
  }
}

export default Model
