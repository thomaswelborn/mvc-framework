MVC.Model = class extends MVC.Base {
  constructor() {
    super(...arguments)
  }
  get _validator() { return this.validator }
  set _validator(validator) { this.validator = new MVC.Validator(validator) }
  get _isSetting() { return this.isSetting }
  set _isSetting(isSetting) { this.isSetting = isSetting }
  get _changing() {
    this.changing = (this.changing)
      ? this.changing
      : {}
    return this.changing
  }
  get _localStorage() { return this.localStorage }
  set _localStorage(localStorage) { this.localStorage = localStorage }
  get _defaults() { return this.defaults }
  set _defaults(defaults) { this.defaults = defaults }
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
  get _db() {
    let db = localStorage.getItem(this.localStorage.endpoint)
    this.db = (db)
      ? db
      : '{}'
    return JSON.parse(this.db)
  }
  set _db(db) {
    db = JSON.stringify(db)
    localStorage.setItem(this.localStorage.endpoint, db)
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
  get _services() {
    this.services =  (this.services)
      ? this.services
      : {}
    return this.services
  }
  set _services(services) {
    this.services = MVC.Utils.addPropertiesToObject(
      services, this._services
    )
  }
  get _serviceEvents() {
    this.serviceEvents = (this.serviceEvents)
      ? this.serviceEvents
      : {}
    return this.serviceEvents
  }
  set _serviceEvents(serviceEvents) {
    this.serviceEvents = MVC.Utils.addPropertiesToObject(
      serviceEvents, this._serviceEvents
    )
  }
  get _serviceCallbacks() {
    this.serviceCallbacks = (this.serviceCallbacks)
      ? this.serviceCallbacks
      : {}
    return this.serviceCallbacks
  }
  set _serviceCallbacks(serviceCallbacks) {
    this.serviceCallbacks = MVC.Utils.addPropertiesToObject(
      serviceCallbacks, this._serviceCallbacks
    )
  }
  get _enabled() { return this.enabled || false }
  set _enabled(enabled) { this.enabled = enabled }
  enableServiceEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.serviceEvents, this.services, this.serviceCallbacks)
  }
  disableServiceEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.serviceEvents, this.services, this.serviceCallbacks)
  }
  enableDataEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.dataEvents, this, this.dataCallbacks)
  }
  disableDataEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.dataEvents, this, this.dataCallbacks)
  }
  setDefaults() {
    let _defaults = {}
    if(this.defaults) Object.assign(_defaults, this.defaults)
    if(this.localStorage) Object.assign(_defaults, this._db)
    if(Object.keys(_defaults)) this.set(_defaults)
  }
  get() {
    switch(arguments.length) {
      case 0:
        return this.data
        break
      case 1:
        let key = arguments[0]
        return this.data[key]
        break
    }
  }
  set() {
    this._history = this.parse()
    switch(arguments.length) {
      case 1:
        this._isSetting = true
        let _arguments = Object.entries(arguments[0])
        _arguments.forEach(([key, value], index) => {
          if(index === (_arguments.length - 1)) this._isSetting = false
          this._changing[key] = value
          this.setDataProperty(key, value)
          if(this.localStorage) this.setDB(key, value)
        })
        delete this.changing
        break
      case 2:
        var key = arguments[0]
        var value = arguments[1]
        this.setDataProperty(key, value)
        if(this.localStorage) this.setDB(key, value)
        break
    }
    if(this._validator) {
      let validateEmitter = this.emitters.validate
      this._validator.validate(
        JSON.parse(JSON.stringify(this.data))
      )
      validateEmitter.set({
        data: this.validator.data,
        results: this.validator.results
      })
      this.emit(
        validateEmitter.name,
        validateEmitter.emission()
      )
    }
    return this
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
              if(!context._isSetting) {
                if(!Object.values(context._changing).length) {
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
                } else {
                  context.emit(
                    setEventName,
                    {
                      name: setEventName,
                      data: context._changing,
                    },
                  )
                }
              }
            }
          }
        }
      )
    }
    this._data['_'.concat(key)] = value
    return this
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
    return this
  }
  parse(data) {
    data = data || this._data
    return JSON.parse(JSON.stringify(Object.assign({}, data)))
  }
  enableEmitters() {
    Object.assign(
      this._emitters,
      this.settings.emitters,
      {
        validate: new MVC.Emitters.Validate(),
      }
    )
    return this
  }
  disableEmitters() {
    delete this._emitters
    return this
  }
  enable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      this.enableEmitters()
      if(this.settings.validator) this._validator = this.settings.validator
      if(this.settings.localStorage) this._localStorage = this.settings.localStorage
      if(this.settings.histiogram) this._histiogram = this.settings.histiogram
      if(this.settings.services) this._services = this.settings.services
      if(this.settings.serviceCallbacks) this._serviceCallbacks = this.settings.serviceCallbacks
      if(this.settings.serviceEvents) this._serviceEvents = this.settings.serviceEvents
      if(this.settings.data) this.set(this.settings.data)
      if(this.settings.dataCallbacks) this._dataCallbacks = this.settings.dataCallbacks
      if(this.settings.dataEvents) this._dataEvents = this.settings.dataEvents
      if(this.settings.schema) this._schema = this.settings.schema
      if(this.settings.defaults) this._defaults = this.settings.defaults
      if(
        this.services &&
        this.serviceEvents &&
        this.serviceCallbacks
      ) {
        this.enableServiceEvents()
      }
      if(
        this.dataEvents &&
        this.dataCallbacks
      ) {
        this.enableDataEvents()
      }
      this._enabled = true
    }
    return this
  }
  disable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      if(
        this.services &&
        this.serviceEvents &&
        this.serviceCallbacks
      ) {
        this.disableServiceEvents()
      }
      if(
        this.dataEvents &&
        this.dataCallbacks
      ) {
        this.disableDataEvents()
      }
      delete this._localStorage
      delete this._histiogram
      delete this._services
      delete this._serviceCallbacks
      delete this._serviceEvents
      delete this._data
      delete this._dataCallbacks
      delete this._dataEvents
      delete this._schema
      delete this._validator
      delete this.disableEmitters()
      this._enabled = false
    }
    return this
  }
}
