var MVC = MVC || {}

MVC.Events = class {
  constructor() {}
  get _events() { return this.events || {} }
  eventCallbacks(eventName) { return this._events[eventName] || {} }
  eventCallbackName(eventCallback) {
    return (eventCallback.name.length)
      ? eventCallback.name
      : 'anonymousFunction'
  }
  eventCallbackGroup(eventCallbacks, eventCallbackName) { return eventCallbacks[eventCallbackName] || [] }
  on(eventName, eventCallback) {
    let eventCallbacks = this.eventCallbacks(eventName)
    let eventCallbackName = this.eventCallbackName(eventCallback)
    let eventCallbackGroup = this.eventCallbackGroup(eventCallbacks, eventCallbackName)
    eventCallbackGroup.push(eventCallback)
    eventCallbacks[eventCallbackName] = eventCallbackGroup
    this._events[eventName] = eventCallbacks
  }
  off() {
    switch(arguments.length) {
      case 1:
        var eventName = arguments[0]
        delete this._events[eventName]
        break
      case 2:
        var eventName = arguments[0]
        var eventCallback = arguments[1]
        var eventCallbackName = this.eventCallbackName(eventCallback)
        delete this._events[eventName][eventCallbackName]
        break
    }
  }
  emit(eventName, eventData) {
    let eventCallbacks = this.eventCallbacks(eventName)
    for(let [eventCallbackGroupName, eventCallbackGroup] of Object.entries(eventCallbacks)) {
      for(let eventCallback of eventCallbackGroup) {
        eventCallback(eventData)
      }
    }
  }
}

MVC.Service = class extends MVC.Events {
  constructor(type, url, settings) {
    super()
    this._settings = settings || {}
    this._type = type
    this._url = url
  }
  get _defaults() { return this.defaults || {
    contentType: {'Content-Type': 'application/json'},
    responseType: 'json',
  } }
  get _settings() { return this.settings || {} }
  set _settings(settings) {
    this.settings = settings || {}
    this._data = this.settings.data || null
    this._headers = this._settings.headers || [this._defaults.contentType]
    this._responseType = this._settings.responseType
  }
  get _responseTypes() { return ['', 'arraybuffer', 'blob', 'document', 'json', 'text'] }
  get _responseType() { return this.responseType }
  set _responseType(responseType) {
    this._xhr.responseType = this._responseTypes.find(
      (responseTypeItem) => responseTypeItem === responseType
    ) || this._defaults.responseType
  }
  get _type() { return this.type }
  set _type(type) { this.type = type }
  get _url() { return this.url }
  set _url(url) { this.url = url }
  get _headers() { return this.headers || [] }
  set _headers(headers) {
    this._headers.length = 0
    for(let header of headers) {
      this._xhr.setRequestHeader({header}[0], {header}[1])
      this._headers.push(header)
    }
  }
  get _xhr() {
    this.xhr = (this.xhr)
      ? this.xhr
      : new XMLHttpRequest()
    return this.xhr
  }
  newXHR() {
    return new Promise((resolve, reject) => {
      if(this._xhr.status === 200) this._xhr.abort()
      this._xhr.open(this._type, this._url)
      this._xhr.onload = resolve
      this._xhr.onerror = reject
      this._xhr.send(this._data)
    })
  }
}

MVC.Channels = class {
  constructor() {}
  get channels() {
    this._channels = (this._channels)
      ? this._channels
      : {}
    return this._channels
  }
  channel(channelName) {
    this.channels[channelName] = (this.channels[channelName])
      ? this.channels[channelName]
      : new MVC.Channels.Channel()
    return this.channels[channelName]
  }
  off(channelName) {
    delete this.channels[channelName]
  }
}

MVC.Channels.Channel = class {
  constructor() {}
  get responses() {
    this._responses = (this._responses)
      ? this._responses
      : {}
    return this._responses
  }
  response(responseName, responseCallback) {
    if(responseCallback) {
      this.responses[responseName] = responseCallback
    } else {
      return this.responses[response]
    }
  }
  request(responseName, requestData) {
    if(this.responses[responseName]) {
      return this.responses[responseName](requestData)
    }
  }
  off(responseName) {
    if(responseName) {
      delete this.responses[responseName]
    } else {
      for(let [responseName] of Object.keys(this.responses)) {
        delete this.responses[responseName]
      }
    }
  }
}

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

MVC.View = class extends MVC.Events {
  constructor() {
    super()
  }
  get _elementName() { return this._element.tagName }
  set _elementName(elementName) {
    if(!this._element) this._element = document.createElement(elementName)
  }
  get _element() { return this.element }
  set _element(element) {
    if(element instanceof HTMLElement) {
      this.element = element
    } else if(typeof element === 'string') {
      this.element = document.querySelector(element)
    }
  }
  get _attributes() { return this.attributes || {} }
  set _attributes(attributes) {
    for(let [attributeKey, attributeValue] of Object.entries(attributes)) {
      this._element.setAttribute(attributeKey, attributeValue)
    }
    this.attributes = this._element.attributes
  }
  get _ui() { return this.ui || {} }
  set _ui(ui) {
    for(let [key, value] of ui) {
      switch(key) {
        case '@':
          this.ui[key] = this.element
          break
        default:
          this.ui[key] = this.element.querySelectorAll(value)
          break;
      }
    }
    this.ui = ui
  }
  get _events() { return this.events || {} }
  set _events(events) {
    for(let [eventKey, eventValue] of events) {
      let eventData = eventKey.split[' ']
      let eventTarget = this[
        eventData[0].replace('@', '')
      ]
      let eventName = eventData[1]
      let eventCallback = this[
        eventValue.replace('@', '')
      ]
      eventTarget.on(eventName, eventCallback)
    }
  }
  get _callbacks() { return this.callbacks || {} }
  set _callbacks(callbacks) { this.callbacks = callbacks }
  get _emitters() { return this.emitters || {} }
  set _emitters(emitters) { this.emitters = emitters }
}

MVC.Controller = class extends MVC.Events {
  constructor(settings) {
    super()
    if(this.settings) this.settings = settings
  }
  get settings() { return this._settings }
  set settings(settings) {
    this._settings = settings
    if(this.settings.models) this._models = models
    if(this.settings.views) this._views = views
    if(this.settings.controllers) this._controllers = controllers
    if(this.settings.routers) this._routers = routers
    if(this.settings.emitters) this._emitters = emitters
    if(this.settings.callbacks) this._callbacks = callbacks
    if(this.settings.events) this._events = events
  }
  get _models() { return this.models || {} }
  set _models(models) { this.models = models }
  get _views() { return this.views || {} }
  set _views(views) { this.views = views }
  get _controllers() { return this.controllers || {} }
  set _controllers(controllers) { this.controllers = controllers }
  get _routers() { return this.routers || {} }
  set _routers(routers) { this.routers = routers }
  get _emitters() { return this.emitters || {} }
  set _emitters(emitters) { this.emitters = emitters }
  get _callbacks() { return this.callbacks || {} }
  set _callbacks(callbacks) { this.callbacks = callbacks }
  get _events() { return this.events || {} }
  set _events(events) {
    for(let [eventSettings, eventCallback] of Object.entries(events)) {
      let eventData = eventSettings.split(' ')
      let eventTarget = eventData[0].replace('@', '').split('.')
      let eventName = eventData[1]
      eventCallback = eventCallback.replace('@', '').split('.')
      this[eventTarget].on(eventName, eventCallback)
    }
  }
}

MVC.Router = class extends MVC.Events {
  constructor(settings) {
    super()
    Object.assign(this, settings, { settings: settings })
    this.setRoutes(this.routes, this.controllers)
    this.setEvents()
    this.start()
    if(typeof this.initialize === 'function') this.initialize()
  }
  start() {
    var location = this.getRoute()
    if(location === '') {
      this.navigate('/')
    }else {
      window.dispatchEvent(new Event('hashchange'))
    }
  }
  setRoutes(routes, controllers) {
    for(var route in routes) {
      this.routes[route] = controllers[routes[route]]
    }
    return
  }
  setEvents() {
    window.addEventListener('hashchange', this.hashChange.bind(this))
    return
  }
  getRoute() {
    return String(window.location.hash).split('#').pop()
  }
  hashChange(event) {
    var route = this.getRoute()
    try {
      this.routes[route](event)
      this.emit('navigate', this)
    } catch(error) {}
  }
  navigate(path) {
    window.location.hash = path
  }
}
