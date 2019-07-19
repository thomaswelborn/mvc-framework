var MVC = MVC || {}

MVC.Utils = {
  getObjectFromDotNotationString: function(
    string,
    context
  ) {
    let object = string
      .split('.')
      .reduce(
        (accumulator, currentValue) => {
          currentValue = (currentValue[0] === '/')
            ? new RegExp(currentValue.replace(new RegExp('/', 'g'), ''))
            : currentValue
          for(let [contextKey, contextValue] of Object.entries(context)) {
            if(currentValue instanceof RegExp) {
              if(currentValue.test(contextKey)) {
                accumulator[contextKey] = contextValue
              }
            } else {
              if(currentValue === contextKey) {
                accumulator[contextKey] = contextValue
              }
            }
          }
          return accumulator
        }, {})
    return object
  },
  toggleEventsForTargetObjects(
    toggleMethod,
    events,
    targetObjects,
    callbacks
  ) {
    for(let [eventSettings, eventCallback] of Object.entries(events)) {
      let eventData = eventSettings.split(' ')
      let eventTargetSettings = eventData[0]
      let eventName = eventData[1]
      let eventTargets
      switch(eventTargetSettings[0] === '@') {
        case true:
          eventTargetSettings = eventTargetSettings.replace('@', '')
          eventTargets = (eventTargetSettings)
            ? this.getObjectFromDotNotationString(
              eventTargetSettings,
              targetObjects
            )
            : {
              0: targetObjects,
            }
          break
        case false:
          eventTargets = document.querySelectorAll(eventTargetSettings)
          break
      }
      for(let [eventTargetName, eventTarget] of Object.entries(eventTargets)) {
        let eventTargetMethodName = (toggleMethod === 'on')
          ? (eventTarget instanceof HTMLElement)
            ? 'addEventListener'
            : 'on'
          : (eventTarget instanceof HTMLElement)
            ? 'removeEventListener'
            : 'off'
        let eventCallbacks = (eventCallback.match('@'))
          ? this.getObjectFromDotNotationString(
            eventCallback.replace('@', ''),
            callbacks
          )
          : window[eventCallback]
        for(let eventCallback of Object.values(eventCallbacks)) {
          eventTarget[eventTargetMethodName](eventName, eventCallback)
        }
      }
    }
  },
  bindEventsToTargetObjects: function() {
    this.toggleEventsForTargetObjects('on', ...arguments)
  },
  unbindEventsFromTargetObjects: function() {
    this.toggleEventsForTargetObjects('off', ...arguments)
  },
  addPropertiesToTargetObject: function() {
    let targetObject
    switch(arguments.length) {
      case 2:
        let properties = arguments[0]
        targetObject = arguments[1]
        for(let [propertyName, propertyValue] of Object.entries(properties)) {
          targetObject[propertyName] = propertyValue
        }
        break
      case 3:
        let propertyName = arguments[0]
        let propertyValue = arguments[1]
        targetObject = arguments[2]
        targetObject[propertyName] = propertyValue
        break
    }
    return targetObject
  },
}

MVC.Events = class {
  constructor() {}
  get _events() {
    this.events = (this.events)
      ? this.events
      : {}
    return this.events
  }
  eventCallbacks(eventName) { return this._events[eventName] || {} }
  eventCallbackName(eventCallback) {
    return (eventCallback.name.length)
      ? eventCallback.name
      : 'anonymousFunction'
  }
  eventCallbackGroup(eventCallbacks, eventCallbackName) {
    return eventCallbacks[eventCallbackName] || []
  }
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
        let additionalArguments = Object.values(arguments).splice(2)
        eventCallback(eventData, ...additionalArguments)
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
  get _channels() { return this.channels || {} }
  channel(channelName) {
    this._channels[channelName] = (this._channels[channelName])
      ? this._channels[channelName]
      : new MVC.Channels.Channel()
    return this._channels[channelName]
  }
  off(channelName) {
    delete this._channels[channelName]
  }
}

MVC.Channels.Channel = class {
  constructor() {}
  get _responses() { return this.responses || {} }
  response(responseName, responseCallback) {
    if(responseCallback) {
      this._responses[responseName] = responseCallback
    } else {
      return this._responses[response]
    }
  }
  request(responseName, requestData) {
    if(this._responses[responseName]) {
      return this._responses[responseName](requestData)
    }
  }
  off(responseName) {
    if(responseName) {
      delete this._responses[responseName]
    } else {
      for(let [responseName] of Object.keys(this._responses)) {
        delete this._responses[responseName]
      }
    }
  }
}

MVC.Observers = class {}

MVC.Observers.Observer = class {
  constructor(settings) {
    this._settings = settings
    this._observer.observe(this.target, this.options)
  }
  get _settings() {
    this.settings = (this.settings)
      ? this.settings
      : {}
    return this.settings
  }
  set _settings(settings) {
    if(settings) {
      this.settings = settings
      if(this.settings.context) this._context = this.settings.context
      if(this.settings.target) this._target = (this.settings.target instanceof NodeList)
        ? this.settings.target[0]
        : this.settings.target
      if(this.settings.options) this._options = this.settings.options
      if(this.settings.mutations) this._mutations = this.settings.mutations
    }
  }
  get _context() { return this.context }
  set _context(context) { this.context = context }
  get _target() { return this.target }
  set _target(target) { this.target = target }
  get _options() { return this.options }
  set _options(options) { this.options = options }
  get _observer() {
    this.observer = (this.observer)
      ? this.observer
      : new MutationObserver(this.observerCallback.bind(this))
    return this.observer
  }
  get _mutations() {
    this.mutations = (this.mutations)
      ? this.mutations
      : []
    return this.mutations
  }
  set _mutations(mutations) {
    for(let [mutationSettings, mutationCallback] of Object.entries(mutations)) {
      let mutation
      let mutationData = mutationSettings.split(' ')
      let mutationTarget = MVC.Utils.getObjectFromDotNotationString(
        mutationData[0].replace('@', ''),
        this.context.ui
      )
      let mutationEventName = mutationData[1]
      let mutationEventData = mutationData[2]
      mutationCallback = (mutationCallback.match('@'))
        ? this.context.observerCallbacks[mutationCallback.replace('@', '')]
        : (typeof mutationCallback === 'string')
          ? MVC.Utils.getObjectFromDotNotationString(mutationCallback, window)
          : mutationCallback
      mutation = {
        target: mutationTarget,
        name: mutationEventName,
        callback: mutationCallback,
      }
      if(mutationEventData) mutation.data = mutationEventData
      this._mutations.push(mutation)
    }
  }
  observerCallback(mutationRecordList, observer) {
    for(let [mutationRecordIndex, mutationRecord] of Object.entries(mutationRecordList)) {
      switch(mutationRecord.type) {
        case 'childList':
          let mutationRecordCategories = ['addedNodes', 'removedNodes']
          for(let mutationRecordCategory of mutationRecordCategories) {
            if(mutationRecord[mutationRecordCategory].length) {
              for(let [nodeIndex, node] of Object.entries(mutationRecord[mutationRecordCategory])) {
                let mutation = this.mutations.filter((_mutation) => _mutation.target === node)[0]
                if(mutation) {
                  mutation.callback({
                    mutation: mutation,
                    mutationRecord: mutationRecord,
                  })
                }
              }
            }
          }
          break
        case 'attributes':
          let mutation = this.mutations.filter((_mutation) => (
            _mutation.name === mutationRecord.type &&
            _mutation.data === mutationRecord.attributeName
          ))[0]
          if(mutation) {
            mutation.callback({
              mutation: mutation,
              mutationRecord: mutationRecord,
            })
          }
          break
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
    if(settings) {
      this.settings = settings
      if(this.settings.histiogram) this._histiogram = this.settings.histiogram
      if(this.settings.data) this.set(this.settings.data)
      if(this.settings.dataCallbacks) this._dataCallbacks = this.settings.dataCallbacks
      if(this.settings.dataEvents) this._dataEvents = this.settings.dataEvents
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
  get() {
    let property = arguments[0]
    return this._data['_'.concat(property)]
  }
  set() {
    this._history = this.parse()
    switch(arguments.length) {
      case 1:
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

MVC.View = class extends MVC.Events {
  constructor(settings) {
    super()
    this._settings = settings
  }
  get _settings() {
    this.settings = (this.settings)
      ? this.settings
      : {}
    return this.settings
  }
  set _settings(settings) {
    if(settings) {
      this.settings = settings
      if(this.settings.elementName) this._elementName = this.settings.elementName
      if(this.settings.element) this._element = this.settings.element
      if(this.settings.attributes) this._attributes = this.settings.attributes
      this._ui = this.settings.ui || {}
      if(this.settings.uiCallbacks) this._uiCallbacks = this.settings.uiCallbacks
      if(this.settings.observerCallbacks) this._observerCallbacks = this.settings.observerCallbacks
      if(this.settings.uiEmitters) this._uiEmitters = this.settings.uiEmitters
      if(this.settings.uiEvents) this._uiEvents = this.settings.uiEvents
      if(this.settings.observers) this._observers = this.settings.observers
      if(this.settings.template) this._template = this.settings.template
      if(this.settings.insert) this._insert = this.settings.insert
    } else {
      this._elementName = 'div'
    }
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
  get _attributes() { return this._element.attributes }
  set _attributes(attributes) {
    for(let [attributeKey, attributeValue] of Object.entries(attributes)) {
      if(typeof attributeValue === 'undefined') {
        this._element.removeAttribute(attributeKey)
      } else {
        this._element.setAttribute(attributeKey, attributeValue)
      }
    }
    this.attributes = this._element.attributes
  }
  get _ui() {
    this.ui = (this.ui)
      ? this.ui
      : {}
    return this.ui
  }
  set _ui(ui) {
    this._ui['$'] = this.element
    for(let [uiKey, uiSelector] of Object.entries(ui)) {
      if(typeof uiSelector === 'undefined') {
        delete this._ui[uiKey]
      } else {
        this._ui[uiKey] = this._element.querySelectorAll(uiSelector)
      }
    }
  }
  set _uiEvents(uiEvents) {
    MVC.Utils.bindEventsToTargetObjects(uiEvents, this.ui, this.uiCallbacks)
  }
  get _uiCallbacks() { return this.uiCallbacks || {} }
  set _uiCallbacks(uiCallbacks) { this.uiCallbacks = uiCallbacks }
  get _observerCallbacks() { return this.observerCallbacks || {} }
  set _observerCallbacks(observerCallbacks) { this.observerCallbacks = observerCallbacks }
  get _uiEmitters() { return this.uiEmitters || {} }
  set _uiEmitters(uiEmitters) { this.uiEmitters = emitters }
  get _observers() {
    this.observers = (this.observers)
      ? this.observers
      : {}
    return this.observers
  }
  set _observers(observers) {
    for(let [observerConfiguration, mutationSettings] of Object.entries(observers)) {
      let observerConfigurationData = observerConfiguration.split(' ')
      let observerName = observerConfigurationData[0]
      let observerTarget = (observerName.match('@', ''))
        ? MVC.Utils.getObjectFromDotNotationString(
            observerName.replace('@', ''),
            this.ui
          )
        : document.querySelectorAll(observerName)
      let observerOptions = (observerConfigurationData[1])
        ? observerConfigurationData[1]
          .split(',')
          .reduce((accumulator, currentValue) => {
            accumulator[currentValue] = true
            return accumulator
          }, {})
        : {}
      // if(observerOptions)  = observerOptions
      let observer = new MVC.Observers.Observer({
        context: this,
        target: observerTarget,
        options: observerOptions,
        mutations: mutationSettings
      })
      this._observers[observerName] = observer
    }
  }
  set _insert(insert) {
    if(this.element.parentElement) this.remove()
    let insertMethod = insert.method
    let parentElement = document.querySelector(insert.element)
    parentElement.insertAdjacentElement(insertMethod, this.element)
  }
  remove() { this.element.parentElement.removeChild(this.element) }
}

MVC.Controller = class extends MVC.Events {
  constructor(settings) {
    super()
    if(settings) this._settings = settings
  }
  get _settings() {
    this.settings = (this.settings)
      ? this.settings
      : {}
    return this.settings
  }
  set _settings(settings) {
    this.settings = settings
    if(this._settings.emitters) this._emitters = this._settings.emitters
    if(this._settings.modelCallbacks) this._modelCallbacks = this._settings.modelCallbacks
    if(this._settings.viewCallbacks) this._viewCallbacks = this._settings.viewCallbacks
    if(this._settings.controllerCallbacks) this._controllerCallbacks = this._settings.controllerCallbacks
    if(this._settings.routerCallbacks) this._routerCallbacks = this._settings.routerCallbacks
    if(this._settings.models) this._models = this._settings.models
    if(this._settings.views) this._views = this._settings.views
    if(this._settings.controllers) this._controllers = this._settings.controllers
    if(this._settings.routers) this._routers = this._settings.routers
    if(this._settings.modelEvents) this._modelEvents = this._settings.modelEvents
    if(this._settings.viewEvents) this._viewEvents = this._settings.viewEvents
    if(this._settings.controllerEvents) this._controllerEvents = this._settings.controllerEvents
  }
  get _emitters() {
    this.emitters = (this.emitters)
      ? this.emitters
      : {}
    return this.emitters
  }
  set _emitters(emitters) {
    this.emitters = MVC.Utils.addPropertiesToTargetObject(
      emitters, this._emitters
    )
  }
  get _modelCallbacks() {
    this.modelCallbacks = (this.modelCallbacks)
      ? this.modelCallbacks
      : {}
    return this.modelCallbacks
  }
  set _modelCallbacks(modelCallbacks) {
    this.modelCallbacks = MVC.Utils.addPropertiesToTargetObject(
      modelCallbacks, this._modelCallbacks
    )
  }
  get _viewCallbacks() {
    this.viewCallbacks = (this.viewCallbacks)
      ? this.viewCallbacks
      : {}
    return this.viewCallbacks
  }
  set _viewCallbacks(viewCallbacks) {
    this.viewCallbacks = MVC.Utils.addPropertiesToTargetObject(
      viewCallbacks, this._viewCallbacks
    )
  }
  get _controllerCallbacks() {
    this.controllerCallbacks = (this.controllerCallbacks)
      ? this.controllerCallbacks
      : {}
    return this.controllerCallbacks
  }
  set _controllerCallbacks(controllerCallbacks) {
    this.controllerCallbacks = MVC.Utils.addPropertiesToTargetObject(
      controllerCallbacks, this._controllerCallbacks
    )
  }
  get _routerCallbacks() {
    this.routerCallbacks = (this.routerCallbacks)
      ? this.routerCallbacks
      : {}
    return this.routerCallbacks
  }
  set _routerCallbacks(routerCallbacks) {
    this.routerCallbacks = MVC.Utils.addPropertiesToTargetObject(
      routerCallbacks, this._routerCallbacks
    )
  }
  get _models() {
    this.models = (this.models)
      ? this.models
      : {}
    return this.models
  }
  set _models(models) {
    this.models = MVC.Utils.addPropertiesToTargetObject(
      models, this._models
    )
  }
  get _views() {
    this.views = (this.views)
      ? this.views
      : {}
    return this.views
  }
  set _views(views) {
    this.views = MVC.Utils.addPropertiesToTargetObject(
      views, this._views
    )
  }
  get _controllers() {
    this.controllers = (this.controllers)
      ? this.controllers
      : {}
    return this.controllers
  }
  set _controllers(controllers) {
    this.controllers = MVC.Utils.addPropertiesToTargetObject(
      controllers, this._controllers
    )
  }
  get _routers() {
    this.routers = (this.routers)
      ? this.routers
      : {}
    return this.routers
  }
  set _routers(routers) {
    this.routers = MVC.Utils.addPropertiesToTargetObject(
      routers, this._routers
    )
  }
  set _modelEvents(modelEvents) {
    MVC.Utils.bindEventsToTargetObjects(modelEvents, this._models, this._modelCallbacks)
  }
  set _viewEvents(viewEvents) {
    MVC.Utils.bindEventsToTargetObjects(viewEvents, this._views)
  }
  set _controllerEvents(controllerEvents) {
    MVC.Utils.bindEventsToTargetObjects(controllerEvents, this._controllers, this._controllerCallbacks)
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

module.exports = MVC