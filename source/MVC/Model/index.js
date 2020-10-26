import Events from '../Events/index.js'
import { UUID } from '../Utilities/index'

const Model = class extends Events {
  constructor(settings = {}, options = {}) {
    super()
    this.settings = settings
    this.options = options
    this.emit(
      'ready',
      {},
      this,
    )
  }
  get uuid() {
    if(!this._uuid) this._uuid = UUID()
    return this._uuid
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
    if(this.localStorage.sync === true) {
      if(Object.entries(this.db).length === 0) {
        this._defaults = defaults
      } else {
        this._defaults = this.db
      }
    } else {
      this._defaults = defaults
    }
    this.set(this.defaults)
  }
  get localStorage() { return this._localStorage || {} }
  set localStorage(localStorage) { this._localStorage = localStorage }
  get storageContainer() { return {} }
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
    const base = this[baseName] || {}
    const baseEvents = this[baseEventsName] || {}
    const baseCallbacks = this[baseCallbacksName] || {}
    if(
      Object.values(base).length &&
      Object.values(baseEvents).length &&
      Object.values(baseCallbacks).length
    ) {
      Object.entries(baseEvents)
        .forEach(([baseEventData, baseCallbackName]) => {
          const [baseTargetName, baseEventName] = baseEventData.split(' ')
          const baseTargetNameSubstringFirst = baseTargetName.substring(0, 1)
          const baseTargetNameSubstringLast = baseTargetName.substring(baseTargetName.length - 1)
          let baseTargets = []
          if(
            baseTargetNameSubstringFirst === '[' &&
            baseTargetNameSubstringLast === ']'
          ) {
            baseTargets = Object.entries(base)
              .reduce((_baseTargets, [baseName, baseTarget]) => {
                let baseTargetNameRegExpString = baseTargetName.slice(1, -1)
                let baseTargetNameRegExp = new RegExp(baseTargetNameRegExpString)
                if(baseName.match(baseTargetNameRegExp)) {
                  _baseTargets.push(baseTarget)
                }
                return _baseTargets
              }, [])
          } else if(base[baseTargetName]) {
            baseTargets.push(base[baseTargetName])
          }
          let baseEventCallback = baseCallbacks[baseCallbackName]
          if(
            baseEventCallback &&
            baseEventCallback.name.split(' ').length === 1
          ) {
            baseEventCallback = baseEventCallback.bind(this)
          }
          if(
            baseTargetName &&
            baseEventName &&
            baseTargets.length &&
            baseEventCallback
          ) {
            baseTargets
              .forEach((baseTarget) => {
                try {
                  switch(method) {
                    case 'on':
                      baseTarget[method](baseEventName, baseEventCallback)
                      break
                    case 'off':
                      baseTarget[method](baseEventName, baseEventCallback)
                      break
                  }
                } catch(error) {
                  throw error
                }
              })
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
  setDataProperty(key, value, silent) {
    const currentDataProperty = this.data[key]
    if(!silent) {
      this.emit('beforeSet'.concat(':', key), {
        key: key,
        value: this.get(key),
      }, {
        key: key,
        value: value,
      }, this)
    }
    if(!currentDataProperty) {
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
    if(currentDataProperty instanceof Model) {
      const emit = (name, data, model) => this.emit(name, data, model)
      this.data[key]
        .on('beforeSet', this.emit(event.name, event.data, model))
        .on('set', this.emit(event.name, event.data, model))
        .on('beforeUnset', this.emit(event.name, event.data, model))
        .on('unset', this.emit(event.name, event.data, model))
    }
    if(!silent) {
      this.emit('set'.concat(':', key), {
        key: key,
        value: value,
      }, this)
    }
    return this
  }
  unsetDataProperty(key, silent) {
    if(!silent) {
      this.emit('beforeUnset'.concat(':', arguments[0]), this)
    }
    if(this.data[key]) {
      delete this.data[key]
    }
    if(!silent) {
      this.emit('unset'.concat(':', arguments[0]), this)
    }
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
    const _arguments = Array.from(arguments)
    var key, value, silent
    if(_arguments.length === 3) {
      key = _arguments[0]
      value = _arguments[1]
      silent = _arguments[2]
      if(!silent) this.emit('beforeSet', this.data, Object.assign(
        {},
        this.data,
        {
          [key]: value,
        },
      ), this)
      this.setDataProperty(key, value, silent)
      if(!silent) this.emit('set', this.data, this)
      if(this.localStorage.endpoint) this.setDB(arguments[0], arguments[1])
    } else if(_arguments.length === 2) {
      if(
        typeof _arguments[0] === 'object' &&
        typeof _arguments[1] === 'boolean'
      ) {
        silent = _arguments[1]
        if(!silent) this.emit('beforeSet', this.data, Object.assign(
          {},
          this.data,
          _arguments[0],
        ), this)
        Object.entries(_arguments[0]).forEach(([key, value]) => {
          this.setDataProperty(key, value, silent)
        })
        if(!silent) this.emit('set', this.data, this)
      } else {
        if(!silent) this.emit('beforeSet', this.data, Object.assign(
          {},
          this.data,
          {
            [_arguments[0]]: _arguments[1],
          },
        ), this)
        this.setDataProperty(_arguments[0], _arguments[1])
        if(!silent) this.emit('set', this.data, this)
      }
      if(this.localStorage.endpoint) this.setDB(_arguments[0], _arguments[1])
    } else if(
      _arguments.length === 1 &&
      !Array.isArray(_arguments[0]) &&
      typeof _arguments[0] === 'object'
    ) {
      if(!silent) this.emit('beforeSet', this.data, Object.assign(
        {},
        this.data,
        _arguments[0],
      ), this)
      Object.entries(_arguments[0]).forEach(([key, value]) => {
        this.setDataProperty(key, value)
        if(this.localStorage.endpoint) this.setDB(key, value)
      })
      if(!silent) this.emit('set', this.data, this)
    }
    return this
  }
  unset() {
    let silent
    if(
      arguments.length === 2
    ) {
      silent = arguments[1]
      if(!silent) this.emit('beforeUnset', this.data, this)
      this.unsetDataProperty(arguments[0], silent)
      if(!silent) this.emit('unset', this)
    } else if(
      arguments.length === 1
    ) {
      if(typeof arguments[0] === 'boolean') {
        silent = arguments[0]
        if(!silent) this.emit('beforeUnset', this.data, this)
        Object.keys(this.data).forEach((key) => {
          this.unsetDataProperty(key, silent)
        })
        if(!silent) this.emit('unset', this)
      }
    } else {
      if(!silent) this.emit('beforeUnset', this.data, this)
      Object.keys(this.data).forEach((key) => {
        this.unsetDataProperty(key)
      })
      if(!silent) this.emit('unset', this)
    }
    if(this.localStorage.endpoint) this.unsetDB(key)
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
