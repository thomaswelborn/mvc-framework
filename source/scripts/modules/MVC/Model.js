MVC.Model = class extends MVC.Base {
  constructor() {
    super(...arguments)
    this.addSettings()
  }
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
  set _dataEvents(dataEvents) {
    MVC.Utils.bindEventsToTargetObjects(dataEvents, this, this.dataCallbacks)
  }
  get _dataCallbacks() {
    this.dataCallbacks = (this.dataCallbacks)
      ? this.dataCallbacks
      : {}
    return this.dataCallbacks
  }
  set _dataCallbacks(dataCallbacks) {
    this.dataCallbacks = MVC.Utils.addPropertiesToTargetObject(
      dataCallbacks, this._dataCallbacks
    )
  }
  addSettings() {
    if(Object.keys(this._settings).length) {
      if(this._settings.histiogram) this._histiogram = this._settings.histiogram
      if(this._settings.data) this.set(this._settings.data)
      if(this._settings.dataCallbacks) this._dataCallbacks = this._settings.dataCallbacks
      if(this._settings.dataEvents) this._dataEvents = this._settings.dataEvents
      if(this._settings.schema) this._schema = this._settings.schema
      if(this._settings.defaults) this._defaults = this._settings.defaults
    }
  }
  get() {
    let property = arguments[0]
    return this._data['_'.concat(property)]
  }
  set() {
    this._history = this.parse()
    switch(arguments.length) {
      case 1:
        for(let [key, value] of Object.entries(arguments[0])) {
          let _data = Object.assign(
            this.parse(),
            {
              [key]: value,
            },
          )
          // console.log('\n', '_data', '\n', '-----', '\n', _data)
          this.setDataProperty(key, value)
        }
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
              let setValueEventName = ['set', ':', key].join('')
              let setEventName = 'set'
              if(!silent) {
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
    return JSON.parse(JSON.stringify(Object.assign({}, data))) }
}
