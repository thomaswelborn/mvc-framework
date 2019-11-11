import Base from '../Base/index'

class Model extends Base {
  constructor() {
    super(...arguments)
  }
  get bindableClassProperties() { return [
    'data',
    'service'
  ] }
  get classDefaultProperties() { return [
    'name',
    'localStorage',
    'histiogram',
    'defaults'
  ] }
  get _isSetting() { return this.isSetting }
  set _isSetting(isSetting) { this.isSetting = isSetting }
  get _changing() {
    this.changing = this.changing || {}
    return this.changing
  }
  get _localStorage() { return this.localStorage }
  set _localStorage(localStorage) { this.localStorage = localStorage }
  get _defaults() { return this.defaults }
  set _defaults(defaults) {
    this.defaults = defaults
    this.set(defaults)
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
  get db() { return this._db }
  get _db() {
    let db = localStorage.getItem(this.localStorage.endpoint) || '{}'
    return JSON.parse(db)
  }
  set _db(db) {
    db = JSON.stringify(db)
    localStorage.setItem(this.localStorage.endpoint, db)
  }
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
  parse(data) {
    data = data || this._data || {}
    return JSON.parse(JSON.stringify(data))
  }
}

export default Model
