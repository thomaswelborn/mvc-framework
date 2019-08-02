MVC.Model = class extends MVC.Base {
  constructor() {
    super(...arguments)
  }
  get _isSetting() { return this.isSetting }
  set _isSetting(isSetting) { this.isSetting = isSetting }
  get _defaults() { return this._defaults }
  set _defaults(defaults) {
    this.defaults = defaults
    this.set(this.defaults)
  }
  get _schema() { return this._schema }
  set _schema(schema) { this.schema = schema }
  get _histiogram() { return this.histiogram || {
    length: 1
  } }
  set _histiogram(histiogram) {
    this.histiogram = Object.assign(
      this._histiogram,
      histiogram
    )
  }
  get _history() {
    this.history = (this.history)
      ? this.history
      : []
    return this.history
  }
  set _history(data) {
    if(
      Object.keys(data).length
    ) {
      if(this._histiogram.length) {
        this._history.unshift(this.parse(data))
        this._history.splice(this._histiogram.length)
      }
    }
  }
  get _data() {
    this.data =  (this.data)
      ? this.data
      : {}
    return this.data
  }
  get _dataEvents() {
    this.dataEvents = (this.dataEvents)
      ? this.dataEvents
      : {}
    return this.dataEvents
  }
  set _dataEvents(dataEvents) {
    this.dataEvents = MVC.Utils.addPropertiesToObject(
      dataEvents, this._dataEvents
    )
  }
  get _dataCallbacks() {
    this.dataCallbacks = (this.dataCallbacks)
      ? this.dataCallbacks
      : {}
    return this.dataCallbacks
  }
  set _dataCallbacks(dataCallbacks) {
    this.dataCallbacks = MVC.Utils.addPropertiesToObject(
      dataCallbacks, this._dataCallbacks
    )
  }
  get _enabled() { return this.enabled || false }
  set _enabled(enabled) { this.enabled = enabled }
  enableDataEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.dataEvents, this, this.dataCallbacks)
  }
  disableDataEvents() {
    MVC.Utils.unbindEventsToTargetObjects(this.dataEvents, this, this.dataCallbacks)
  }
  get() {
    let property = arguments[0]
    return this._data['_'.concat(property)]
  }
  set() {
    this._history = this.parse()
    switch(arguments.length) {
      case 1:
        let _arguments = Object.entries(arguments[0])
        _arguments.forEach(([key, value], index) => {
          if(index === 0) {
            this._isSetting = true
          } else if(index === (_arguments.length - 1)) {
            this._isSetting = false
          }
          this.setDataProperty(key, value)
        })
        break
      case 2:
        var key = arguments[0]
        var value = arguments[1]
        this.setDataProperty(key, value)
        break
      case 3:
        var key = arguments[0]
        var value = arguments[1]
        var silent = arguments[2]
        this.setDataProperty(key, value, silent)
        break
    }
  }
  unset() {
    this._history = this.parse()
    switch(arguments.length) {
      case 0:
        for(let key of Object.keys(this._data)) {
          this.unsetDataProperty(key)
        }
        break
      case 1:
        let key = arguments[0]
        this.unsetDataProperty(key)
        break
    }
  }
  setDataProperty(key, value, silent) {
    if(!this._data['_'.concat(key)]) {
      let context = this
      Object.defineProperties(
        this._data,
        {
          ['_'.concat(key)]: {
            configurable: true,
            get() { return this[key] },
            set(value) {
              this[key] = value
              if(
                !silent &&
                !context._isSetting
              ) {
                let setValueEventName = ['set', ':', key].join('')
                let setEventName = 'set'
                context.emit(
                  setValueEventName,
                  {
                    name: setValueEventName,
                    data: {
                      key: key,
                      value: value,
                    },
                  },
                  context
                )
                context.emit(
                  setEventName,
                  {
                    name: setEventName,
                    data: {
                      key: key,
                      value: value,
                    },
                  },
                  context
                )
              }
            }
          }
        }
      )
    }
    this._data['_'.concat(key)] = value
  }
  unsetDataProperty(key) {
    let unsetValueEventName = ['unset', ':', key].join('')
    let unsetEventName = 'unset'
    let unsetValue = this._data[key]
    delete this._data['_'.concat(key)]
    delete this._data[key]
    this.emit(
      unsetValueEventName,
      {
        name: unsetValueEventName,
        data: {
          key: key,
          value: unsetValue,
        }
      }
    )
    this.emit(
      unsetEventName,
      {
        name: unsetEventName,
        data: {
          key: key,
          value: unsetValue,
        }
      }
    )
  }
  parse(data) {
    data = data || this._data
    return JSON.parse(JSON.stringify(Object.assign({}, data)))
  }
  enable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      if(this.settings.histiogram) this._histiogram = this.settings.histiogram
      if(this.settings.data) this.set(this.settings.data)
      if(this.settings.dataCallbacks) this._dataCallbacks = this.settings.dataCallbacks
      if(this.settings.dataEvents) this._dataEvents = this.settings.dataEvents
      if(this.settings.schema) this._schema = this.settings.schema
      if(this.settings.defaults) this._defaults = this.settings.defaults
      if(
        this.dataEvents &&
        this.dataCallbacks
      ) {
        this.enableDataEvents()
      }
      this._enabled = true
    }
  }
  disable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      if(
        this.dataEvents &&
        this.dataCallbacks
      ) {
        this.disableDataEvents()
      }
      delete this._histiogram
      delete this._data
      delete this._dataCallbacks
      delete this._dataEvents
      delete this._schema
      delete this._defaults
      if(
        this.dataEvents &&
        this.dataCallbacks
      ) {
        this.disableDataEvents()
      }
      this._enabled = false
    }
  }
}
