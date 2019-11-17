import Base from '../Base/index.js'

class Model extends Base {
  constructor() {
    super(...arguments)
  }
  get storageContainer() { return {} }
  get defaultIDAttribute() { return '_id' }
  get bindableClassProperties() { return [
    'service'
  ] }
  get classDefaultProperties() { return [
    'idAttribute',
    'localStorage',
    'histiogram',
    'defaults'
  ] }
  get _idAttribute() {
    this.idAttribute = this.idAttribute || this.defaultIDAttribute
    return this.idAttribute
  }
  set _idAttribute(idAttribute) { this.idAttribute = idAttribute }
  get _defaults() { return this.defaults }
  set _defaults(defaults) {
    this.defaults = defaults
    this.set(defaults)
  }
  get _isSetting() { return this.isSetting }
  set _isSetting(isSetting) { this.isSetting = isSetting }
  get _silent() {
    this.silent = (typeof this.silent === 'boolean')
      ? this.silent
      : false
    return this.silent
  }
  set _silent(silent) { this.silent = silent }
  get _changing() {
    this.changing = this.changing || {}
    return this.changing
  }
  get _localStorage() { return this.localStorage }
  set _localStorage(localStorage) { this.localStorage = localStorage }
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
    this.history = this.history || []
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
    this.data = this.data || this.storageContainer
    return this.data
  }
  set _data(data) { this.data = data }
  get db() { return this._db }
  get _db() {
    let db = localStorage.getItem(this.localStorage.endpoint) || JSON.stringify(this.storageContainer)
    return JSON.parse(db)
  }
  set _db(db) {
    db = JSON.stringify(db)
    localStorage.setItem(this.localStorage.endpoint, db)
  }
  get() {
    switch(arguments.length) {
      case 0:
        return Object.assign(
          {},
          this._data
        )
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
        var _arguments = Object.entries(arguments[0])
        _arguments.forEach(([key, value], index) => {
          if(index === (_arguments.length - 1)) this._isSetting = false
          this.setDataProperty(key, value)
        })
        break
      case 2:
        if(typeof arguments[0] === 'string') {
          var key = arguments[0]
          var value = arguments[1]
          this.setDataProperty(key, value)
        } else {
          var _arguments = Object.entries(arguments[0])
          var silent = arguments[1]
          _arguments.forEach(([key, value], index) => {
            if(index === (_arguments.length - 1)) this._isSetting = false
            this._silent = silent
            this.setDataProperty(key, value)
            this._silent = false
          })
        }
        break
      case 3:
        var key = arguments[0]
        var value = arguments[1]
        var silent = arguments[2]
        this._silent = silent
        this.setDataProperty(key, value)
        this._silent = false
        break
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
              context._changing[key] = value
              if(context.localStorage) context.setDB(key, value)
              let setValueEventName = ['set', ':', key].join('')
              let setEventName = 'set'
              if(context.silent !== true) {
                console.log('silent', context.silent)
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
              }
              if(!context._isSetting) {
                if(!Object.values(context._changing).length) {
                  if(context.silent !== true) {
                    console.log('silent', context.silent)
                    context.emit(
                      setEventName,
                      {
                        name: setEventName,
                        data: Object.assign(
                          {},
                          context._data
                        ),
                      },
                      context
                    )
                  }
                  } else {
                  if(context.silent !== true) {
                    console.log('silent', context.silent)
                    context.emit(
                      setEventName,
                      {
                        name: setEventName,
                        data: Object.assign(
                          {},
                          context._changing,
                          context._data,
                        ),
                      },
                      context
                    )
                  }
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
    console.log('unset')
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
  parse(data) {
    data = data || this._data || this.storageContainer
    return JSON.parse(JSON.stringify(data))
  }
}

export default Model
