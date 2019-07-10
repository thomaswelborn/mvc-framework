MVC.Model = class extends MVC.Events {
  constructor(settings) {
    super()
    this._settings = settings
  }
  get _settings() { return this.settings || {} }
  set _settings(settings) {
    if(this.settings.histiogram) this._histiogram = this.settings.histiogram
    if(this.settings.data) this._data = this.settings.data
  }
  get _histiogram() { return this.histiogram || {
    length: 1
  } }
  set _histiogram(histiogram) {
    this.histiogram = Object.assign(
      this.histiogram,
      histiogram
    )
  }
  get _history() { return this.history || [] }
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
  get _data() { return this.data || {} }
  set() {
    this._history = this._data
    switch(arguments.length) {
      case 1:
        for(let [key, value] of Object.entries(arguments[0])) {
          if(!this._data['_'.concat(key)]) this.addDataProperty(key, value)
          this._data['_'.concat(key)] = value
        }
        break
      case 2:
        let key = arguments[0]
        let value = arguments[1]
        if(!this._data['_'.concat(key)]) this.addDataProperty(key, value)
        this._data['_'.concat(key)] = value
        break;
    }
  }
  unset() {
    this._history = this._data
    switch(arguments.length) {
      case 0:
        for(let key of Object.keys(this._data)) {
          delete this._data['_'.concat(key)]
          delete this._data[key]
        }
        break
      case 1:
        let key = arguments[0]
        delete this._data['_'.concat(key)]
        delete this._data[key]
        break
    }
  }
  addDataProperty(key, value) {
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
                key: key,
                value: value,
              }
            )
            context.emit(
              setEventName,
              {
                name: setEventName,
                key: key,
                value: value,
              }
            )
          }
        }
      }
    )
  }
  parse(data) {
    data = data || this._data
    return JSON.parse(JSON.stringify(data)) }
}
