var MVC = MVC || {}

MVC.AJAX = class {
  constructor(type, url, settings) {
    this.responseTypes = ['', 'arraybuffer', 'blob', 'document', 'json', 'text']
    this.defaultContentType = {'Content-Type': 'application/json'}
    this.defaultResponseType = 'json'
    this.type = type
    this.url = url
    this.settings = settings || {}
    this.data = this.settings.data || null
    return new Promise(function (resolve, reject) {
      this.xhr = new XMLHttpRequest()
      this.xhr.open(this.type, this.url)
      this.setResponseType(this.xhr, this.settings.responseType || this.defaultResponseType)
      this.setHeaders(this.xhr, this.settings.headers || [this.defaultContentType])
      this.xhr.onload = resolve
      this.xhr.onerror = reject
      this.xhr.send(this.data)
    }.bind(this))
  }
  setResponseType(xhr, responseType) {
    xhr.responseType = this.responseTypes.find(function(responseTypeItem) {
      return responseTypeItem === responseType
    }) || ''
  }
  setHeaders(xhr, headers) {
    headers.forEach(function(header) {
      xhr.setRequestHeader(Object.keys(header)[0], Object.values(header)[0])
    })
  }
}

MVC.Events = class {
  constructor() {}
  get events() {
    this._events = (this._events)
      ? this._events
      : {}
    return this._events
  }
  event(eventName) {
    this.events[eventName] = (this.events[eventName])
      ? this.events[eventName]
      : {}
    return this.events[eventName]
  }
  on(eventName, eventCallback) {
    let event = this.event(eventName)
    let eventCallbackName = eventCallback.constructor.name
    event[eventCallbackName] = (event[eventCallbackName])
      ? event[eventCallbackName]
      : []
    event[eventCallbackName].push(eventCallback)
  }
  off(eventName, eventCallback) {
    let event = this.event(eventName)
    if(eventCallback) {
      let eventCallbackName = eventCallback.constructor.name
      delete this.events[eventName][eventCallbackName]
    } else {
      delete this.events[eventName]
    }
  }
  emit(eventName, eventData) {
    let event = this.event(eventName)
    for(let [callbackName, callbacks] of Object.entries(event)) {
      for(let callback of callbacks) {
        callback(eventData)
      }
    }
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
  }
  get data() {
    this._data = (this._data)
    ? this._data
    : {}
  }
}

MVC.View = class extends MVC.Events {
  constructor() {
    super()
  }
  get elementName() { return this.element.tagName }
  set elementName(data) {
    if(!this.element) this.element = document.createElement(data)
  }
  get element() { return this._element }
  set element(data) {
    let element
    if(data instanceof HTMLElement) {
      element = data
    } else if(typeof data === 'string') {
      element = document.querySelector(data)
    }
    this._element = element
  }
  get ui() { return this._ui }
  set ui(data) {
    let ui = {}
    for(let [key, value] of data) {
      switch(key) {
        case '@':
          ui[key] = this.element
          break
        default:
          ui[key] = this.element.querySelectorAll(value)
          break;
      }
    }
    this._ui = ui
  }
  get events() { return this._events }
  set events(data) {
    for(let [key, value] of data) {
      let eventData = key.split[' ']
      let eventTarget = this[
        eventData[0].replace('@', '')
      ]
      let eventName = eventData[1]
      let eventCallback = this[
        value.replace('@', '')
      ]
      eventTarget.on(eventName, eventCallback)
    }
  }
  get callbacks() { return this._callbacks }
  set callbacks(data) { this._callbacks = data }
  get emitters() { return this._emitters }
  set emitters(data) { this._emitters = data }
}

MVC.Controller = class extends MVC.Events {
  constructor(settings) {
    super()
    if(this.settings) this.settings = settings
  }
  get settings() { return this._settings }
  set settings(settings) {
    this._settings = settings
    if(this.settings.models) this.models = models
    if(this.settings.views) this.views = views
    if(this.settings.controllers) this.controllers = controllers
    if(this.settings.routers) this.routers = routers
    if(this.settings.emitters) this.emitters = emitters
    if(this.settings.callbacks) this.callbacks = callbacks
    if(this.settings.events) this.events = events
  }
  get models() { return this._models }
  set models(models) { this._models = models }
  get views() { return this._views }
  set views(views) { this._views = views }
  get controllers() { return this._controllers }
  set controllers(controllers) { this._controllers = controllers }
  get routers() { return this._routers }
  set routers(routers) { this._routers = routers }
  get emitters() { return this._emitters }
  set emitters(emitters) { this._emitters = emitters }
  get callbacks() { return this._callbacks }
  set callbacks(callbacks) { this._callbacks = callbacks }
  get events() { return this._events }
  set events(events) {
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

//# sourceMappingURL=http://localhost:3000/.maps/scripts/mvc-framework.js.map
