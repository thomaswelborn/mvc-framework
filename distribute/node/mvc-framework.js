var MVC = MVC || {}

MVC.Constants = {}
MVC.CONST = MVC.Constants

MVC.Constants.Events = {}
MVC.CONST.EV = MVC.Constants.Events

MVC.Templates = {
  ObjectQueryStringFormatInvalidRoot: function ObjectQueryStringFormatInvalid(data) {
    return [
      'Object Query "string" property must be formatted to first include "[@]".'
    ].join('\n')
  },
  DataSchemaMismatch: function DataSchemaMismatch(data) {
    return [
      `Data and Schema properties do not match.`
    ].join('\n')
  },
  DataFunctionInvalid: function DataFunctionInvalid(data) {
    [
      `Model Data property type "Function" is not valid.`
    ].join('\n')
  },
  DataUndefined: function DataUndefined(data) {
    [
      `Model Data property undefined.`
    ].join('\n')
  },
  SchemaUndefined: function SchemaUndefined(data) {
    [
      `Model "Schema" undefined.`
    ].join('\n')
  },
}
MVC.TMPL = MVC.Templates

MVC.Utils = {}

MVC.Utils.isArray = function isArray(object) { return Array.isArray(object) }
MVC.Utils.isObject = function isObject(object) {
  return (!Array.isArray(object))
    ? typeof object === 'object'
    : false
}
MVC.Utils.isEqualType = function isEqualType(valueA, valueB) { return valueA === valueB }
MVC.Utils.isHTMLElement = function isHTMLElement(object) {
  return object instanceof HTMLElement
}

MVC.Utils.typeOf =  function typeOf(data) {
  switch(typeof data) {
    case 'object':
      let _object
      if(MVC.Utils.isArray(data)) {
        // Array
        return 'array'
      } else if(
        MVC.Utils.isObject(data)
      ) {
        // Object
        return 'object'
      } else if(
        data === null
      ) {
        // Null
        return 'null'
      }
      return _object
      break
    case 'string':
    case 'number':
    case 'boolean':
    case 'undefined':
    case 'function':
      return typeof data
      break
  }
}

MVC.Utils.addPropertiesToObject = function addPropertiesToObject() {
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
}

MVC.Utils.objectQuery = function objectQuery(
  string,
  context
) {
  let stringData = MVC.Utils.objectQuery.parseNotation(string)
  if(stringData[0] === '@') stringData.splice(0, 1)
  if(!stringData.length) return context
  context = (MVC.Utils.isObject(context))
    ? Object.entries(context)
    : context
  return stringData.reduce((object, fragment, fragmentIndex, fragments) => {
    let properties = []
    fragment = MVC.Utils.objectQuery.parseFragment(fragment)
    for(let [propertyKey, propertyValue] of object) {
      if(propertyKey.match(fragment)) {
        if(fragmentIndex === fragments.length - 1) {
          properties = properties.concat([[propertyKey, propertyValue]])
        } else {
          properties = properties.concat(Object.entries(propertyValue))
        }
      }
    }
    object = properties
    return object
  }, context)
}
MVC.Utils.objectQuery.parseNotation = function parseNotation(string) {
  if(
    string.charAt(0) === '[' &&
    string.charAt(string.length - 1) == ']'
  ) {
    string = string
      .slice(1, -1)
      .split('][')
  } else {
    string = string
      .split('.')
  }
  return string
}
MVC.Utils.objectQuery.parseFragment = function parseFragment(fragment) {
  if(
    fragment.charAt(0) === '/' &&
    fragment.charAt(fragment.length - 1) == '/'
  ) {
    fragment = fragment.slice(1, -1)
    fragment = new RegExp(fragment)
  }
  return fragment
}

MVC.Utils.toggleEventsForTargetObjects = function toggleEventsForTargetObjects(
  toggleMethod,
  events,
  targetObjects,
  callbacks
) {
  for(let [eventSettings, eventCallbackName] of Object.entries(events)) {
    let eventData = eventSettings.split(' ')
    let eventTargetSettings = eventData[0]
    let eventName = eventData[1]
    let eventTargets = MVC.Utils.objectQuery(
      eventTargetSettings,
      targetObjects
    )
    for(let [eventTargetName, eventTarget] of eventTargets) {
      let eventMethodName = (toggleMethod === 'on')
      ? (
        eventTarget instanceof NodeList ||
        eventTarget instanceof HTMLElement
      ) ? 'addEventListener'
        : 'on'
      : (
        eventTarget instanceof NodeList ||
        eventTarget instanceof HTMLElement
      ) ? 'removeEventListener'
        : 'off'
      let eventCallback = MVC.Utils.objectQuery(
        eventCallbackName,
        callbacks
      )[0][1]
      if(eventTarget instanceof NodeList) {
        for(let _eventTarget of eventTarget) {
          _eventTarget[eventMethodName](eventName, eventCallback)
        }
      } else if(eventTarget instanceof HTMLElement){
        eventTarget[eventMethodName](eventName, eventCallback)
      } else {
        eventTarget[eventMethodName](eventName, eventCallback)
      }
    }
  }
}
MVC.Utils.bindEventsToTargetObjects = function bindEventsToTargetObjects() {
  this.toggleEventsForTargetObjects('on', ...arguments)
}
MVC.Utils.unbindEventsFromTargetObjects = function unbindEventsFromTargetObjects() {
  this.toggleEventsForTargetObjects('off', ...arguments)
}

MVC.Utils.validateDataSchema = function validateDataSchema(data, schema) {
  if(schema) {
    switch(MVC.Utils.typeOf(data)) {
      case 'array':
        let array = []
        schema = (MVC.Utils.typeOf(schema) === 'function')
          ? schema()
          : schema
        if(
          MVC.Utils.isEqualType(
            MVC.Utils.typeOf(schema),
            MVC.Utils.typeOf(array)
          )
        ) {
          console.log(schema.name)
          for(let [arrayKey, arrayValue] of Object.entries(data)) {
            array.push(
              this.validateDataSchema(arrayValue)
            )
          }
        }
        return array
        break
      case 'object':
        let object = {}
        schema = (MVC.Utils.typeOf(schema) === 'function')
          ? schema()
          : schema
        if(
          MVC.Utils.isEqualType(
            MVC.Utils.typeOf(schema),
            MVC.Utils.typeOf(object)
          )
        ) {
          console.log(schema.name)
          for(let [objectKey, objectValue] of Object.entries(data)) {
            object[objectKey] = this.validateDataSchema(objectValue, schema[objectKey])
          }
        }
        return object
        break
      case 'string':
      case 'number':
      case 'boolean':
        schema = (MVC.Utils.typeOf(schema) === 'function')
          ? schema()
          : schema
        if(
          MVC.Utils.isEqualType(
            MVC.Utils.typeOf(schema),
            MVC.Utils.typeOf(data)
          )
        ) {
          console.log(schema.name)
          return data
        } else {
          throw MVC.TMPL
        }
        break
      case 'null':
        if(
          MVC.Utils.isEqualType(
            MVC.Utils.typeOf(schema),
            MVC.Utils.typeOf(data)
          )
        ) {
          return data
        }
        break
      case 'undefined':
        throw MVC.TMPL
        break
      case 'function':
        throw MVC.TMPL
        break
    }
  } else {
    throw MVC.TMPL
  }
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

MVC.Channels = class {
  constructor() {}
  get _channels() {
    this.channels = (this.channels)
      ? this.channels
      : {}
    return this.channels
  }
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
  get _responses() {
    this.responses = (this.responses)
      ? this.responses
      : {}
    return this.responses
  }
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

MVC.Base = class extends MVC.Events {
  constructor(settings, options, configuration) {
    super()
    if(configuration) this._configuration = configuration
    if(options) this._options = options
    if(settings) this._settings = settings
  }
  get _configuration() {
    this.configuration = (this.configuration)
      ? this.configuration
      : {}
    return this.configuration
  }
  set _configuration(configuration) { this.configuration = configuration }
  get _options() {
    this.options = (this.options)
      ? this.options
      : {}
    return this.options
  }
  set _options(options) { this.options = options }
  get _settings() {
    this.settings = (this.settings)
      ? this.settings
      : {}
    return this.settings
  }
  set _settings(settings) { this.settings = settings }
}

MVC.Observer = class extends MVC.Base {
  constructor() {
    super(...arguments)
    this.enable()
  }
  get _connected() { return this.connected || false }
  set _connected(connected) { this.connected = connected }
  get observer() {
    this._observer = (this._observer)
      ? this._observer
      : new MutationObserver(this.observerCallback.bind(this))
    return this._observer
  }
  get _target() { return this.target }
  set _target(target) { this.target = target }
  get _options() { return this.options }
  set _options(options) {
    this.options = options
  }
  get _mutations() {
    this.mutations = (this.mutations)
      ? this.mutations
      : []
    return this.mutations
  }
  set _mutations(mutations) {
    for(let [mutationSettings, mutationCallback] of Object.entries(mutations.settings)) {
      let mutation
      let mutationData = mutationSettings.split(' ')
      let mutationTarget = MVC.Utils.objectQuery(mutationData[0], mutations.targets)[0][1]
      let mutationEventName = mutationData[1]
      mutationCallback = MVC.Utils.objectQuery(mutationCallback, mutations.callbacks)[0][1]
      mutation = {
        target: mutationTarget,
        name: mutationEventName,
        callback: mutationCallback,
      }
      this._mutations.push(mutation)
    }
  }
  enable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      if(settings.target) this._target = (settings.target instanceof NodeList)
        ? settings.target[0]
        : settings.target
      if(settings.options) this._options = settings.options
      if(settings.mutations) this._mutations = settings.mutations
      this._enabled = true
    }
  }
  disable() {
    let settings = this.settings
    if(
      settings &&
      this.enabled
    ) {
      if(this.target) delete this.target
      if(this.options) delete this.options
      if(this.mutations) delete this.mutations
      if(this.observeer) delete this.observer
      this._enabled = false
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
                this.mutations.forEach((_mutation) => {
                  if(mutationRecordCategory.match(new RegExp('^'.concat(_mutation.name)))) {
                    if(_mutation.target instanceof HTMLElement) {
                      if(_mutation.target === node) {
                        _mutation.callback({
                          mutation: _mutation,
                          mutationRecord: mutationRecord
                        })
                      }
                    } else if(_mutation.target instanceof NodeList) {
                      for(let _mutationTarget of _mutation.target) {
                        if(_mutationTarget === node) {
                          _mutationTarget.callback({
                            mutation: _mutation,
                            mutationRecord: mutationRecord
                          })
                        }
                      }
                    }
                  }
                })
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
  connect() {
    if(
      !this.connected &&
      (
        (
          this.target instanceof NodeList &&
          this.target.length
        ) ||
        (
          this.target instanceof Node
        )
      )
    ) {
      this.observer.observe(this.target, this.options)
      this._connected = true
    }
  }
  disconnect() {
    if(
      this.connected
    ) {
      this.observer.disconnect()
      this._connected = false
    }
  }
}

MVC.Service = class extends MVC.Base {
  constructor() {
    super(...arguments)
    this.enable()
  }
  get _defaults() { return this.defaults || {
    contentType: {'Content-Type': 'application/json'},
    responseType: 'json',
  } }
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
  get _enabled() { return this.enabled || false }
  set _enabled(enabled) { this.enabled = enabled }
  newXHR() {
    return new Promise((resolve, reject) => {
      if(this._xhr.status === 200) this._xhr.abort()
      this._xhr.open(this._type, this._url)
      this._xhr.onload = resolve
      this._xhr.onerror = reject
      this._xhr.send(this._data)
    })
  }
  enable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      if(settings.type) this._type = settings.type
      if(settings.url) this._url = settings.url
      if(settings.data) this._data = settings.data || null
      if(settings.headers) this._headers = settings.headers || [this._defaults.contentType]
      if(this.settings.responseType) this._responseType = this._settings.responseType
      this._enabled = true
    }
  }
  disable() {
    if(Object.keys(this.settings).length) {
      delete this.settings.type
      delete this.settings.url
      delete this.settings.data
      delete this.settings.headers
      delete this.settings.responseType
      this._enabled = true
    }
  }
}

MVC.Model = class extends MVC.Base {
  constructor() {
    super(...arguments)
    this.enable()
  }
  get _isSetting() { return this.isSetting }
  set _isSetting(isSetting) { this.isSetting = isSetting }
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
  get _enabled() { return this.enabled || false }
  set _enabled(enabled) { this.enabled = enabled }
  addDataEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.dataEvents, this, this.dataCallbacks)
  }
  get() {
    let property = arguments[0]
    return this._data['_'.concat(property)]
  }
  set() {
    this._history = this.parse()
    switch(arguments.length) {
      case 1:
        let _arguments = Object.entries(arguments[0])
        _arguments.forEach(([key, value], index) => {
          if(index === 0) {
            this._isSetting = true
          } else if(index === (_arguments.length - 1)) {
            this._isSetting = false
          }
          this.setDataProperty(key, value)
        })
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
              if(
                !silent &&
                !context._isSetting
              ) {
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
    return JSON.parse(JSON.stringify(Object.assign({}, data)))
  }
  enable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      if(this.settings.histiogram) this._histiogram = this.settings.histiogram
      if(this.settings.data) this.set(this.settings.data)
      if(this.settings.dataCallbacks) this._dataCallbacks = this.settings.dataCallbacks
      if(this.settings.dataEvents) this._dataEvents = this.settings.dataEvents
      if(this.settings.schema) this._schema = this.settings.schema
      if(this.settings.defaults) this._defaults = this.settings.defaults
      if(
        this.dataEvents &&
        this.dataCallbacks
      ) {
        this.addDataEvents()
      }
      this._enabled = true
    }
  }
  disable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      if(
        this.dataEvents &&
        this.dataCallbacks
      ) {
        this.removeDataEvents()
      }
      delete this._histiogram
      delete this._data
      delete this._dataCallbacks
      delete this._dataEvents
      delete this._schema
      delete this._defaults
      this._enabled = false
    }
  }
}

MVC.Emitter = class extends MVC.Model {
  constructor() {
    super(...arguments)
    if(this.settings) {
      if(this.settings.name) this._name = this.settings.name
    }
  }
  get _name() { return this.name }
  set _name(name) { this.name = name }
  get emission() {
    return {
      name: this._name,
      data: this.parse()
    }
  }
}

MVC.View = class extends MVC.Base {
  constructor() {
    super(...arguments)
    this.enable()
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
    this.elementObserver.observe(this.element, {
      subtree: true,
      childList: true,
    })
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
  }
  get _ui() {
    this.ui = (this.ui)
      ? this.ui
      : {}
    return this.ui
  }
  set _ui(ui) {
    if(!this._ui['$element']) this._ui['$element'] = this.element
    for(let [uiKey, uiValue] of Object.entries(ui)) {
      if(uiValue instanceof HTMLElement) {
        this._ui[uiKey] = uiValue
      } else if(typeof uiValue === 'string') {
        this._ui[uiKey] = this._element.querySelectorAll(uiValue)
      }
    }
  }
  get _uiEvents() { return this.uiEvents }
  set _uiEvents(uiEvents) { this.uiEvents = uiEvents }
  get _uiCallbacks() {
    this.uiCallbacks = (this.uiCallbacks)
      ? this.uiCallbacks
      : {}
    return this.uiCallbacks
  }
  set _uiCallbacks(uiCallbacks) {
    this.uiCallbacks = MVC.Utils.addPropertiesToObject(
      uiCallbacks, this._uiCallbacks
    )
  }
  get _observerCallbacks() {
    this.observerCallbacks = (this.observerCallbacks)
      ? this.observerCallbacks
      : {}
    return this.observerCallbacks
  }
  set _observerCallbacks(observerCallbacks) {
    this.observerCallbacks = MVC.Utils.addPropertiesToObject(
      observerCallbacks, this._observerCallbacks
    )
  }
  get _uiEmitters() {
    this.uiEmitters = (this.uiEmitters)
      ? this.uiEmitters
      : {}
    return this.uiEmitters
  }
  set _uiEmitters(uiEmitters) {
    let _uiEmitters = {}
    uiEmitters.forEach((UIEmitter) => {
      let uiEmitter = new UIEmitter()
      _uiEmitters[uiEmitter.name] = uiEmitter
    })
    this.uiEmitters = MVC.Utils.addPropertiesToObject(
      _uiEmitters, this._uiEmitters
    )
  }
  get elementObserver() {
    this._elementObserver = (this._elementObserver)
      ? this._elementObserver
      : new MutationObserver(this.elementObserve.bind(this))
    return this._elementObserver
  }
  elementObserve(mutationRecordList, observer) {
    for(let [mutationRecordIndex, mutationRecord] of Object.entries(mutationRecordList)) {
      switch(mutationRecord.type) {
        case 'childList':
          let mutationRecordCategories = ['addedNodes', 'removedNodes']
          for(let mutationRecordCategory of mutationRecordCategories) {
            if(mutationRecord[mutationRecordCategory].length) {
              this.resetUI()
            }
          }
          break
      }
    }
  }
  get _insert() { return this.insert }
  set _insert(insert) { this.insert = insert }
  get _enabled() { return this.enabled || false }
  set _enabled(enabled) { this.enabled = enabled }
  get _templates() {
    this.templates = (this.templates)
      ? this.templates
      : {}
    return this.templates
  }
  set _templates(templates) {
    for(let [templateName, templateSettings] of Object.entries(templates)) {
      this._templates[templateName] = templateSettings
    }
  }
  autoInsert() {
    return document.querySelectorAll(this.insert.element)
      .forEach((element) => {
        element.insertAdjacentElement(this.insert.method, this.element)
      })
  }
  autoRemove() {
    if(
      this.element &&
      this.element.parentElement
    ) this.element.parentElement.removeChild(this.element)
  }
  addElement(settings) {
    settings = settings || this.settings
    if(settings.elementName) this._elementName = settings.elementName
    if(settings.element) this._element = settings.element
    if(settings.attributes) this._attributes = settings.attributes
    if(settings.templates) this._templates = settings.templates
    if(settings.insert) this._insert = settings.insert
  }
  removeElement(settings) {
    settings = settings || this.settings
    if(
      this.element &&
      this.element.parentElement
    ) this.element.parentElement.removeChild(this.element)
    if(this.element) delete this.element
    if(this.attributes) delete this.attributes
    if(this.templates) delete this.templates
    if(this.insert) delete this.insert
  }
  resetUI() {
    this.removeUI()
    this.addUI()
  }
  addUI(settings) {
    settings = settings || this.settings
    if(settings.ui) this._ui = settings.ui
    if(settings.uiEmitters) this._uiEmitters = settings.uiEmitters
    if(settings.uiCallbacks) this._uiCallbacks = settings.uiCallbacks
    if(settings.uiEvents) {
      this._uiEvents = settings.uiEvents
      this.addUIEvents()
    }
  }
  removeUI(settings) {
    settings = settings || this.settings
    if(settings.uiEvents) {
      this.removeUIEvents()
      delete this._uiEvents
    }
    delete this.uiEvents
    delete this.ui
    delete this.uiCallbacks
  }
  addUIEvents() {
    if(
      this.uiEvents &&
      this.ui &&
      this.uiCallbacks
    ) {
      MVC.Utils.bindEventsToTargetObjects(
        this.uiEvents,
        this.ui,
        this.uiCallbacks
      )
    }
  }
  removeUIEvents() {
    if(
      this.uiEvents &&
      this.ui &&
      this.uiCallbacks
    ) {
      MVC.Utils.unbindEventsFromTargetObjects(
        this.uiEvents,
        this.ui,
        this.uiCallbacks
      )
    }
  }
  enable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      this.addElement(settings)
      this.addUI(settings)
      this._enabled = true
    }
  }
  disable() {
    let settings = this.settings
    if(
      settings &&
      this.enabled
    ) {
      this.removeUI(settings)
      this.removeElement(settings)
      this._enabled = false
    }
  }
}

MVC.Controller = class extends MVC.Base {
  constructor() {
    super(...arguments)
    this.enable()
  }
  get _emitters() {
    this.emitters = (this.emitters)
      ? this.emitters
      : {}
    return this.emitters
  }
  set _emitters(emitters) {
    this.emitters = MVC.Utils.addPropertiesToObject(
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
    this.modelCallbacks = MVC.Utils.addPropertiesToObject(
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
    this.viewCallbacks = MVC.Utils.addPropertiesToObject(
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
    this.controllerCallbacks = MVC.Utils.addPropertiesToObject(
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
    this.routerCallbacks = MVC.Utils.addPropertiesToObject(
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
    this.models = MVC.Utils.addPropertiesToObject(
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
    this.views = MVC.Utils.addPropertiesToObject(
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
    this.controllers = MVC.Utils.addPropertiesToObject(
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
    this.routers = MVC.Utils.addPropertiesToObject(
      routers, this._routers
    )
  }
  get _modelEvents() {
    this.modelEvents = (this.modelEvents)
      ? this.modelEvents
      : {}
    return this.modelEvents
  }
  set _modelEvents(modelEvents) {
    this.modelEvents = MVC.Utils.addPropertiesToObject(
      modelEvents, this._modelEvents
    )
  }
  get _viewEvents() {
    this.viewEvents = (this.viewEvents)
      ? this.viewEvents
      : {}
    return this.viewEvents
  }
  set _viewEvents(viewEvents) {
    this.viewEvents = MVC.Utils.addPropertiesToObject(
      viewEvents, this._viewEvents
    )
  }
  get _controllerEvents() {
    this.controllerEvents = (this.controllerEvents)
      ? this.controllerEvents
      : {}
    return this.controllerEvents
  }
  set _controllerEvents(controllerEvents) {
    this.controllerEvents = MVC.Utils.addPropertiesToObject(
      controllerEvents, this._controllerEvents
    )
  }
  get _enabled() { return this.enabled || false }
  set _enabled(enabled) { this.enabled = enabled }
  addModelEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.modelEvents, this.models, this.modelCallbacks)
  }
  removeModelEvents() {
    MVC.Utils.unbindEventsToTargetObjects(this.modelEvents, this.models, this.modelCallbacks)
  }
  addViewEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.viewEvents, this.views, this.viewCallbacks)
  }
  removeViewEvents() {
    MVC.Utils.unbindEventsToTargetObjects(this.viewEvents, this.views, this.viewCallbacks)
  }
  addControllerEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks)
  }
  removeControllerEvents() {
    MVC.Utils.unbindEventsToTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks)
  }
  enable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      if(settings.emitters) this._emitters = settings.emitters
      if(settings.modelCallbacks) this._modelCallbacks = settings.modelCallbacks
      if(settings.viewCallbacks) this._viewCallbacks = settings.viewCallbacks
      if(settings.controllerCallbacks) this._controllerCallbacks = settings.controllerCallbacks
      if(settings.routerCallbacks) this._routerCallbacks = settings.routerCallbacks
      if(settings.models) this._models = settings.models
      if(settings.views) this._views = settings.views
      if(settings.controllers) this._controllers = settings.controllers
      if(settings.routers) this._routers = settings.routers
      if(settings.modelEvents) this._modelEvents = settings.modelEvents
      if(settings.viewEvents) this._viewEvents = settings.viewEvents
      if(settings.controllerEvents) this._controllerEvents = settings.controllerEvents
      if(
        this.modelEvents &&
        this.models &&
        this.modelCallbacks
      ) {
        this.addModelEvents()
      }
      if(
        this.viewEvents &&
        this.views &&
        this.viewCallbacks
      ) {
        this.addViewEvents()
      }
      if(
        this.controllerEvents &&
        this.controllers &&
        this.controllerCallbacks
      ) {
        this.addControllerEvents()
      }
      this._enabled = true
    }
  }
  disable() {
    let settings = this.settings
    if(
      settings &&
      this.enabled
    ) {
      if(
        this.modelEvents &&
        this.models &&
        this.modelCallbacks
      ) {
        this.removeModelEvents()
      }
      if(
        this.viewEvents &&
        this.views &&
        this.viewCallbacks
      ) {
        this.removeViewEvents()
      }
      if(
        this.controllerEvents &&
        this.controllers &&
        this.controllerCallbacks
      ) {
        this.removeControllerEvents()
      }
      delete this._emitters
      delete this._modelCallbacks
      delete this._viewCallbacks
      delete this._controllerCallbacks
      delete this._routerCallbacks
      delete this._models
      delete this._views
      delete this._controllers
      delete this._routers
      delete this._modelEvents
      delete this._viewEvents
      delete this._controllerEvents
      this._enabled = false
    }
  }
}

MVC.Router = class extends MVC.Base {
  constructor() {
    super(...arguments)
    this.addSettings()
    this.setRoutes(this.routes, this.controllers)
    this.setEvents()
    this.start()
    if(typeof this.initialize === 'function') this.initialize()
  }
  addSettings() {
    if(this._settings) {
      if(this._settings.routes) this.routes = this._settings.routes
      if(this._settings.controllers) this.controllers = this._settings.controllers
    }
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