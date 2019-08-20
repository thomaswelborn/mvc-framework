MVC.Model = class extends MVC.Base {
  constructor() {
    super(...arguments)
    return this
  }
  get uid() {
    this._uid = (this._uid)
      ? this._uid
      : MVC.Utils.uid()
    return this._uid
  }
  get _validator() { return this.validator }
  set _validator(validator) { this.validator = new MVC.Validator(validator) }
  get _schema() { return this._schema }
  set _schema(schema) { this.schema = schema }
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
  get() {
    switch(arguments.length) {
      case 0:
        return this._data
        break
      case 1:
        let key = arguments[0]
        return this._data[key]
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
          this.setDataProperty(key, value)
        })
        break
      case 2:
        var key = arguments[0]
        var value = arguments[1]
        this.setDataProperty(key, value)
        break
    }
    if(this.validator) {
      let validateMediator = this.mediators.validate
      this._validator.validate(
        this.parse()
      )
      validateMediator.set({
        data: this.validator.data,
        results: this.validator.results
      })
      this.emit(
        validateMediator.name,
        validateMediator.emission(),
        this
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
              let emit = new Boolean()
              let schema = context._settings.schema
              if(
                schema &&
                schema[key]
              ) {
                this[key] = value
                context._changing[key] = value
                if(this.localStorage) context.setDB(key, value)
              } else if(!schema) {
                this[key] = value
                context._changing[key] = value
                if(this.localStorage) context.setDB(key, value)
              }
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
                      data: context._data,
                    },
                    context
                  )
                } else {
                  context.emit(
                    setEventName,
                    {
                      name: setEventName,
                      data: Object.assign(
                        {},
                        context._changing,
                        context._data
                      ),
                    },
                    context
                  )
                }
                delete context.changing
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
      },
      this
    )
    this.emit(
      unsetEventName,
      {
        name: unsetEventName,
        data: {
          key: key,
          value: unsetValue,
        }
      },
      this
    )
    return this
  }
  setDefaults() {
    let _defaults = {}
    if(this.defaults) Object.assign(_defaults, this.defaults)
    if(this.localStorage) Object.assign(_defaults, this._db)
    if(Object.keys(_defaults)) this.set(_defaults)
  }
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
  enableMediators() {
    Object.assign(
      this._mediators,
      this.settings.mediators,
      {
        validate: new MVC.Mediators.Validate(),
      }
    )
    return this
  }
  disableMediators() {
    delete this._mediators
    return this
  }
  enable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      this.enableMediators()
      if(settings.schema) {
        this._validator = settings.schema
      }
      if(settings.localStorage) this._localStorage = settings.localStorage
      if(settings.histiogram) this._histiogram = settings.histiogram
      if(settings.services) this._services = settings.services
      if(settings.serviceCallbacks) this._serviceCallbacks = settings.serviceCallbacks
      if(settings.serviceEvents) this._serviceEvents = settings.serviceEvents
      if(settings.data) this.set(settings.data)
      if(settings.dataCallbacks) this._dataCallbacks = settings.dataCallbacks
      if(settings.dataEvents) this._dataEvents = settings.dataEvents
      if(settings.defaults) this._defaults = settings.defaults
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
    }
    this._enabled = true
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
      this.disableMediators()
    }
    this._enabled = false
    return this
  }
  parse(data) {
    data = data || this._data || {}
    return JSON.parse(JSON.stringify(data))
  }
}
