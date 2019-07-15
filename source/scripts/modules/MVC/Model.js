MVC.Model = class extends MVC.Events {
  constructor(settings) {
    super()
    this._settings = settings
  }
  get _settings() { return this.settings || {} }
  set _settings(settings) {
    if(settings) {
      this.settings = settings
      if(this.settings.histiogram) this._histiogram = this.settings.histiogram
      if(this.settings.data) this.set(this.settings.data)
    }
  }
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
  set() {
    this._history = this.parse()
    switch(arguments.length) {
      case 1:
        console.log(arguments.length)
        for(let [key, value] of Object.entries(arguments[0])) {
          this.setDataProperty(key, value)
        }
        break
      case 2:
        let key = arguments[0]
        let value = arguments[1]
        this.setDataProperty(key, value)
        break;
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
        key: key,
        value: unsetValue,
      }
    )
    this.emit(
      unsetEventName,
      {
        name: unsetEventName,
        key: key,
        value: unsetValue,
      }
    )
  }
  parse(data) {
    data = data || this._data
    return JSON.parse(JSON.stringify(Object.assign({}, data))) }
}
