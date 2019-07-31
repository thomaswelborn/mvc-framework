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

MVC.Utils.addPropertiesToTargetObject = function addPropertiesToTargetObject() {
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
  context = (MVC.Utils.isObject(context))
    ? Object.entries(context)
    : context
  return stringData.reduce((properties, fragment, fragmentIndex, fragments) => {
    let _properties = []
    fragment = MVC.Utils.objectQuery.parseFragment(fragment)
    for(let [propertyKey, propertyValue] of properties) {
      if(propertyKey.match(fragment)) {
        if(fragmentIndex === fragments.length - 1) {
          _properties = _properties.concat([[propertyKey, propertyValue]])
        } else {
          _properties = _properties.concat(Object.entries(propertyValue))
        }
      }
    }
    properties = _properties
    return properties
  }, context)
  /*
  let stringData = MVC.Utils.objectQuery.parseNotation(string)
  if(stringData[0] === '@') stringData.splice(0, 1)
  let object = Object.entries(context)
    .reduce((properties, [propertyKey, propertyValue], propertyIndex, originalContext) => {
      properties = stringData.reduce((object, fragment, fragmentIndex, originalStringData) => {
        fragment = MVC.Utils.objectQuery.parseFragment(fragment)
        if(propertyKey.match(fragment)) {
          if(fragmentIndex === originalStringData.length - 1) {
            console.log('fragment', fragment)
            console.log('propertyValue', propertyValue)
            return propertyValue
          } else {
            console.log('fragment', fragment)
            console.log('propertyValue', propertyValue)
            return Object.entries(propertyValue)
          }
        }
      }, [])
      console.log('properties', '\n', properties)
      return properties
    }, [])
  console.log('object', object)
  */
  /*
  let stringData = MVC.Utils.objectQuery.parseNotation(string)
  if(stringData[0] === '@') stringData.splice(0, 1)
  stringData.reduce((object, fragment, fragmentIndex, originalStringData) => {
    console.log('-----', '\n', '-----', '\n')
    console.log('input', object)
    fragment = MVC.Utils.objectQuery.parseFragment(fragment)
    let properties = []
    object.forEach(([propertyKey, propertyValue]) => {
      if(propertyKey.match(fragment)) {
        if(fragmentIndex === originalStringData.length - 1) {
          // return propertyValue
          // console.log('propertyValue', propertyValue)
          properties.push(propertyValue)
        } else {
          // return Object.entries(propertyValue)
          // console.log('propertyValue', propertyValue)
          properties.push(Object.entries(propertyValue))
        }
      }
    })
    console.log('output', properties)
    return properties
  }, Object.entries(context))
  */
}
// Parse Notation
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
// Parse Fragments
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
      )
        ? 'addEventListener'
        : 'on'
      : (
        eventTarget instanceof NodeList ||
        eventTarget instanceof HTMLElement
      )
        ? 'removeEventListener'
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
    this.addSettings()
    this._observer.observe(this.target, this.options)
  }
  get _context() { return this.context }
  set _context(context) { this.context = context }
  get _target() { return this.target }
  set _target(target) { this.target = target }
  get _options() { return this.options }
  set _options(options) {
    this.options = options
  }
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
      let mutationTarget = MVC.Utils.objectQuery(
        mutationData[0]
      )
      let mutationEventName = mutationData[1]
      let mutationEventData = mutationData[2]
      mutationCallback = MVC.Utils.objectQuery(mutationCallback, window)
      mutation = {
        target: mutationTarget,
        name: mutationEventName,
        callback: mutationCallback,
      }
      if(mutationEventData) mutation.data = mutationEventData
      this._mutations.push(mutation)
    }
  }
  addSettings() {
    if(Object.keys(this._settings).length) {
      if(this._settings.context) this._context = this._settings.context
      if(this._settings.target) this._target = (this._settings.target instanceof NodeList)
        ? this._settings.target[0]
        : this._settings.target
      if(this._settings.options) this._options = this._settings.options
      if(this._settings.mutations) this._mutations = this._settings.mutations
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
                // let mutation = this.mutations.filter((_mutation) => _mutation.target === node)[0]
                console.log('nodeIndex, node', '\n', nodeIndex, node)
                console.log('this.mutations', '\n', this.mutations)
                // if(mutation) {
                //   mutation.callback({
                //     mutation: mutation,
                //     mutationRecord: mutationRecord,
                //   })
                // }
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

MVC.Service = class extends MVC.Base {
  constructor() {
    super(...arguments)
    this.addSettings()
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
  addSettings() {
    if(Object.keys(this._settings).length) {
      if(this._settings.type) this._type = this._settings.type
      if(this._settings.url) this._url = this._settings.url
      if(this._settings.data) this._data = this._settings.data || null
      if(this._settings.headers) this._headers = this._settings.headers || [this._defaults.contentType]
      if(this._settings.responseType) this._responseType = this._settings.responseType
    }
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

MVC.Model = class extends MVC.Base {
  constructor() {
    super(...arguments)
    this.addSettings()
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
    return JSON.parse(JSON.stringify(Object.assign({}, data))) }
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
    this.addSettings()
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
    this._ui['$element'] = this.element
    this._ui['$parentElement'] = this.element.parentElement
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
  get _uiCallbacks() {
    this.uiCallbacks = (this.uiCallbacks)
      ? this.uiCallbacks
      : {}
    return this.uiCallbacks
  }
  set _uiCallbacks(uiCallbacks) {
    this.uiCallbacks = MVC.Utils.addPropertiesToTargetObject(
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
    this.observerCallbacks = MVC.Utils.addPropertiesToTargetObject(
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
    this.uiEmitters = MVC.Utils.addPropertiesToTargetObject(
      _uiEmitters, this._uiEmitters
    )
  }
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
      let observerTarget = MVC.Utils.objectQuery(
        observerName,
        this.ui
      )
      let observerOptions = (observerConfigurationData[1])
        ? observerConfigurationData[1]
          .split(':')
          .reduce((accumulator, currentValue) => {
            accumulator[currentValue] = true
            return accumulator
          }, {})
        : {}
      let observer = new MVC.Observer({
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
  addSettings() {
    if(Object.keys(this._settings).length) {
      if(this._settings.elementName) this._elementName = this._settings.elementName
      if(this._settings.element) this._element = this._settings.element
      if(this._settings.attributes) this._attributes = this._settings.attributes
      this._ui = this._settings.ui || {}
      if(this._settings.uiCallbacks) this._uiCallbacks = this._settings.uiCallbacks
      if(this._settings.observerCallbacks) this._observerCallbacks = this._settings.observerCallbacks
      if(this._settings.uiEmitters) this._uiEmitters = this._settings.uiEmitters
      if(this._settings.uiEvents) this._uiEvents = this._settings.uiEvents
      if(this._settings.observers) this._observers = this._settings.observers
      if(this._settings.templates) this._templates = this._settings.templates
      if(this._settings.insert) this._insert = this._settings.insert
    } else {
      this._elementName = 'div'
    }
  }
  remove() { this.element.parentElement.removeChild(this.element) }
}

MVC.Controller = class extends MVC.Base {
  constructor() {
    super(...arguments)
    this.addSettings()
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
    MVC.Utils.bindEventsToTargetObjects(viewEvents, this._views, this._viewCallbacks)
  }
  set _controllerEvents(controllerEvents) {
    MVC.Utils.bindEventsToTargetObjects(controllerEvents, this._controllers, this._controllerCallbacks)
  }
  addSettings() {
    if(Object.keys(this._settings).length) {
      if(this.settings.emitters) this._emitters = this.settings.emitters
      if(this.settings.modelCallbacks) this._modelCallbacks = this.settings.modelCallbacks
      if(this.settings.viewCallbacks) this._viewCallbacks = this.settings.viewCallbacks
      if(this.settings.controllerCallbacks) this._controllerCallbacks = this.settings.controllerCallbacks
      if(this.settings.routerCallbacks) this._routerCallbacks = this.settings.routerCallbacks
      if(this.settings.models) this._models = this.settings.models
      if(this.settings.views) this._views = this.settings.views
      if(this.settings.controllers) this._controllers = this.settings.controllers
      if(this.settings.routers) this._routers = this.settings.routers
      if(this.settings.modelEvents) this._modelEvents = this.settings.modelEvents
      if(this.settings.viewEvents) this._viewEvents = this.settings.viewEvents
      if(this.settings.controllerEvents) this._controllerEvents = this.settings.controllerEvents
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