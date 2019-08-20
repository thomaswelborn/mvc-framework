var MVC = MVC || {}

MVC.Constants = {}
MVC.CONST = MVC.Constants

MVC.Constants.Events = {}
MVC.CONST.EV = MVC.Constants.Events

MVC.Constants.Operators = {}
MVC.CONST.Operators = {}
MVC.CONST.Operators.Comparison = {
  EQ: 'EQ',
  STEQ: 'STEQ',
  NOEQ: 'NOEQ',
  STNOEQ: 'STNOEQ',
  GT: 'GT',
  LT: 'LT',
  GTE: 'GTE',
  LTE: 'LTE',
}
MVC.CONST.Operators.Statement = {
  AND: 'AND',
  OR: 'OR'
}

MVC.Utils = {}

MVC.Utils.isArray = function isArray(object) { return Array.isArray(object) }
MVC.Utils.isObject = function isObject(object) {
  return (
    !Array.isArray(object) &&
    object !== null
  ) ? typeof object === 'object'
    : false
}
MVC.Utils.typeOf = function typeOf(value) {
  return (typeof valueA === 'object')
    ? (MVC.Utils.isObject(valueA))
      ? 'object'
      : (MVC.Utils.isArray(valueA))
        ? 'array'
        : (valueA === null)
          ? 'null'
          : undefined
    : typeof value
}
MVC.Utils.isHTMLElement = function isHTMLElement(object) {
  return object instanceof HTMLElement
}

MVC.Utils.uid = function () {
  var uuid = '', ii
  for (ii = 0; ii < 32; ii += 1) {
    switch (ii) {
    case 8:
    case 20:
      uuid += '-';
      uuid += (Math.random() * 16 | 0).toString(16)
      break
    case 12:
      uuid += '-'
      uuid += '4'
      break
    case 16:
      uuid += '-'
      uuid += (Math.random() * 4 | 8).toString(16)
      break
    default:
      uuid += (Math.random() * 16 | 0).toString(16)
    }
  }
  return uuid
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
    fragment = new RegExp('^'.concat(fragment, '$'))
  }
  return fragment
}

MVC.Utils.paramsToObject = function paramsToObject(params) {
    var params = params.split('&')
    var object = {}
    params.forEach((paramData) => {
      paramData = paramData.split('=')
      object[paramData[0]] = decodeURIComponent(paramData[1] || '')
    })
    return JSON.parse(JSON.stringify(object))
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
    eventTargets = (!MVC.Utils.isArray(eventTargets))
      ? [['@', eventTargets]]
      : eventTargets
    for(let [eventTargetName, eventTarget] of eventTargets) {
      let eventMethodName = (toggleMethod === 'on')
      ? (
        eventTarget instanceof NodeList ||
        (
          eventTarget instanceof HTMLElement ||
          eventTarget instanceof Document
        )
      ) ? 'addEventListener'
        : 'on'
      : (
        eventTarget instanceof NodeList ||
        (
          eventTarget instanceof HTMLElement ||
          eventTarget instanceof Document
        )
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
      } else if(eventTarget instanceof HTMLElement) {
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

MVC.Events = class {
  constructor() {}
  get _events() {
    this.events = (this.events)
      ? this.events
      : {}
    return this.events
  }
  getEventCallbacks(eventName) { return this._events[eventName] || {} }
  getEventCallbackName(eventCallback) {
    return (eventCallback.name.length)
      ? eventCallback.name
      : 'anonymousFunction'
  }
  getEventCallbackGroup(eventCallbacks, eventCallbackName) {
    return eventCallbacks[eventCallbackName] || []
  }
  on(eventName, eventCallback) {
    let eventCallbacks = this.getEventCallbacks(eventName)
    let eventCallbackName = this.getEventCallbackName(eventCallback)
    let eventCallbackGroup = this.getEventCallbackGroup(eventCallbacks, eventCallbackName)
    eventCallbackGroup.push(eventCallback)
    eventCallbacks[eventCallbackName] = eventCallbackGroup
    this._events[eventName] = eventCallbacks
    return this
  }
  off() {
    switch(arguments.length) {
      case 0:
        delete this._events
        break
      case 1:
        var eventName = arguments[0]
        delete this._events[eventName]
        break
      case 2:
        var eventName = arguments[0]
        var eventCallback = arguments[1]
        var eventCallbackName = (typeof eventCallback === 'string')
          ? eventCallback
          : this.getEventCallbackName(eventCallback)
        delete this._events[eventName][eventCallbackName]
        if(
          Object.keys(this._events[eventName]).length === 0
        ) delete this._events[eventName]
        break
    }
    return this
  }
  emit(eventName, eventData) {
    let _arguments = Object.values(arguments)
    let eventCallbacks = Object.entries(
      this.getEventCallbacks(eventName)
    )
    for(let [eventCallbackGroupName, eventCallbackGroup] of eventCallbacks) {
      for(let eventCallback of eventCallbackGroup) {
        let additionalArguments = _arguments.splice(2) || []
        eventCallback(eventData, ...additionalArguments)
      }
    }
    return this
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
  request(responseName) {
    if(this._responses[responseName]) {
      let _arguments = Array.prototype.slice.call(arguments).slice(1)
      return this._responses[responseName](..._arguments)
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
  constructor(settings, configuration) {
    super()
    if(configuration) this._configuration = configuration
    if(settings) this._settings = settings
  }
  get _configuration() {
    this.configuration = (this.configuration)
      ? this.configuration
      : {}
    return this.configuration
  }
  set _configuration(configuration) { this.configuration = configuration }
  get _settings() {
    this.settings = (this.settings)
      ? this.settings
      : {}
    return this.settings
  }
  set _settings(settings) {
    this.settings = MVC.Utils.addPropertiesToObject(
      settings, this._settings
    )
  }
  get _mediators() {
    this.mediators = (this.mediators)
      ? this.mediators
      : {}
    return this.mediators
  }
  set _mediators(mediators) {
    this.mediators = MVC.Utils.addPropertiesToObject(
      mediators, this._mediators
    )
  }
}

MVC.Service = class extends MVC.Base {
  constructor() {
    super(...arguments)
    return this
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
    headers.forEach((header) => {
      this._headers.push(header)
      header = Object.entries(header)[0]
      this._xhr.setRequestHeader(header[0], header[1])
    })
  }
  get _data() { return this.data }
  set _data(data) { this.data = data }
  get _xhr() {
    this.xhr = (this.xhr)
      ? this.xhr
      : new XMLHttpRequest()
    return this.xhr
  }
  get _enabled() { return this.enabled || false }
  set _enabled(enabled) { this.enabled = enabled }
  request(data) {
    data = data || this.data || null
    return new Promise((resolve, reject) => {
      if(this._xhr.status === 200) this._xhr.abort()
      this._xhr.open(this.type, this.url)
      this._headers = this.settings.headers || [this._defaults.contentType]
      this._xhr.onload = resolve
      this._xhr.onerror = reject
      this._xhr.send(data)
    }).then((response) => {
      this.emit(
        'xhr:resolve', {
          name: 'xhr:resolve',
          data: response.currentTarget,
        },
        this
      )
      return response
    }).catch((error) => { throw error })
  }
  enable() {
    let settings = this.settings
    if(
      !this.enabled &&
      Object.keys(settings).length
    ) {
      if(settings.type) this._type = settings.type
      if(settings.url) this._url = settings.url
      if(settings.data) this._data = settings.data || null
      if(this.settings.responseType) this._responseType = this._settings.responseType
      this._enabled = true
    }
    return this
  }
  disable() {
    let settings = this.settings
    if(
      this.enabled &&
      Object.keys(settings).length
    ) {
      delete this._type
      delete this._url
      delete this._data
      delete this._headers
      delete this._responseType
      this._enabled = false
    }
    return this
  }
}

MVC.Validator = class {
  constructor(schema) {
    this._schema = schema
    return this
  }
  get _schema() { return this.schema }
  set _schema(schema) { this.schema = schema }
  get _results() { return this.results }
  set _results(results) { this.results = results }
  get _data() { return this.data }
  set _data(data) { this.data = data }
  validate(data) {
    this._data = data
    let validationSummary = {}
    Object.entries(this._schema)
      .forEach(([schemaKey, schemaSettings]) => {
        let validation = {}
        let value = data[schemaKey]
        validation.key = schemaKey
        validation.value = value
        if(schemaSettings.required) {
          validation.required = this.required(value, schemaSettings.required)
        }
        if(schemaSettings.type) {
          validation.type = this.type(value, schemaSettings.type)
        }
        if(schemaSettings.evaluations) {
          let validationEvaluations = this.evaluations(value, schemaSettings.evaluations)
          validation.evaluations = this.evaluationResults(validationEvaluations)
        }
        validationSummary[schemaKey] = validation
      })
    this._results = validationSummary
    return validationSummary
  }
  required(value, schemaSettings) {
    let validationSummary = {}
    let messages = Object.assign(
      {
        pass: 'Value is defined.',
        fail: 'Value is not defined.',
      },
      schemaSettings.messages
    )
    value = (value !== undefined)
    validationSummary.value = value
    validationSummary.comparator = schemaSettings
    validationSummary.result = (value === schemaSettings)
    validationSummary.message = (validationSummary.result)
      ? messages.pass
      : messages.fail
    return validationSummary
  }
  type(value, schemaSettings) {
    let validationSummary = {}
    let messages = Object.assign(
      {
        pass: 'Valid type.',
        fail: 'Invalid type.',
      }
    )
    let typeOfValue = MVC.Utils.typeOf(value)
    let schemaType
    if(MVC.Utils.typeOf(schemaSettings) === 'object') {
      schemaType = schemaSettings.type
      if(schemaSettings.messages) {
        messages.pass = (schemaSettings.messages.pass)
          ? schemaSettings.messages.pass
          : messages.pass
        messages.fail = (schemaSettings.messages.fail)
          ? schemaSettings.messages.fail
          : messages.fail
      }
    } else {
      schemaType = schemaSettings
    }
    if(MVC.Utils.typeOf(schemaType) === 'array') {
      schemaType = schemaType[schemaType.indexOf(typeOfValue)]
    }
    validationSummary.comparator = schemaType
    validationSummary.value = typeOfValue
    validationSummary.result = (typeOfValue === schemaType)
    validationSummary.message = (validationSummary.result)
      ? messages.pass
      : messages.fail
    return validationSummary
  }
  evaluations(value, evaluations) {
    let messages = {
      pass: 'Valid.',
      fail: 'Invalid.',
    }
    return evaluations.reduce((_evaluations, evaluation, evaluationIndex) => {
      if(MVC.Utils.isArray(evaluation)) {
        _evaluations.push(
          ...this.evaluations(value, evaluation)
        )
      } else {
        evaluation._value = value
        evaluation.messages = (evaluation.messages)
          ? evaluation.messages
          : messages
        let valueComparison = this.compareValues(
          evaluation._value,
          evaluation.comparison.value,
          evaluation.comparator,
          evaluation.messages
        )
        evaluation.results = evaluation.results || {}
        evaluation.results.value = valueComparison
        _evaluations.push(evaluation)
      }
      if(_evaluations.length > 1) {
        let currentEvaluation = _evaluations[evaluationIndex]
        if(currentEvaluation.comparison.statement) {
          let previousEvaluation = _evaluations[evaluationIndex - 1]
          let previousEvaluationComparisonValue = (currentEvaluation.results.statement)
            ? currentEvaluation.results.statement.result
            : currentEvaluation.results.value.result
          currentEvaluation.messages = (currentEvaluation.messages)
            ? currentEvaluation.messages
            : messages
          let statementComparison = this.compareStatements(
            previousEvaluationComparisonValue,
            currentEvaluation.comparison.statement,
            currentEvaluation.results.value.result,
            currentEvaluation.messages
          )
          currentEvaluation.results = currentEvaluation.results || {}
          currentEvaluation.results.statement = statementComparison
        }
      }
      return _evaluations
    }, [])
  }
  evaluationResults(evaluations) {
    let validationEvaluations = {
      pass: [],
      fail: [],
    }
    evaluations.forEach((evaluationValidation) => {
      delete evaluationValidation.messages
      if(evaluationValidation.results.statement) {
        if(evaluationValidation.results.statement.result === false) {
          validationEvaluations.fail.push(evaluationValidation)
        } else if(evaluationValidation.results.statement.result === true) {
          validationEvaluations.pass.push(evaluationValidation)
        }
      } else if(evaluationValidation.results.value) {
        if(evaluationValidation.results.value.result === false) {
          validationEvaluations.fail.push(evaluationValidation)
        } else if(evaluationValidation.results.value.result === true) {
          validationEvaluations.pass.push(evaluationValidation)
        }
      }
    })
    return validationEvaluations
  }
  compareValues(value, operator, comparator, messages) {
    let evaluationResult
    switch(operator) {
      case MVC.CONST.Operators.Comparison.EQ:
        evaluationResult = (value == comparator)
        break
      case MVC.CONST.Operators.Comparison.STEQ:
        evaluationResult = (value === comparator)
        break
      case MVC.CONST.Operators.Comparison.NOEQ:
        evaluationResult = (value != comparator)
        break
      case MVC.CONST.Operators.Comparison.STNOEQ:
        evaluationResult = (value !== comparator)
        break
      case MVC.CONST.Operators.Comparison.GT:
        evaluationResult = (value > comparator)
        break
      case MVC.CONST.Operators.Comparison.LT:
        evaluationResult = (value < comparator)
        break
      case MVC.CONST.Operators.Comparison.GTE:
        evaluationResult = (value >= comparator)
        break
      case MVC.CONST.Operators.Comparison.LTE:
        evaluationResult = (value <= comparator)
        break
    }
    return {
      result: evaluationResult,
      message: (evaluationResult)
        ? messages.pass
        : messages.fail
    }
  }
  compareStatements(value, operator, comparator, messages) {
    let evaluationResult
    switch(operator) {
      case MVC.CONST.Operators.Statement.AND:
        evaluationResult = value && comparator
        break
      case MVC.CONST.Operators.Statement.OR:
        evaluationResult = value || comparator
        break
    }
    return {
      result: evaluationResult,
      message: (evaluationResult)
        ? messages.pass
        : messages.fail
    }
  }
}

MVC.Model = class extends MVC.Base {
  constructor() {
    super(...arguments)
    return this
  }
  get uid() {
    this._uid = (this._uid)
      ? this._uid
      : MVC.Utils.uid()
    return this._uid
  }
  get _validator() { return this.validator }
  set _validator(validator) { this.validator = new MVC.Validator(validator) }
  get _schema() { return this._schema }
  set _schema(schema) { this.schema = schema }
  get _isSetting() { return this.isSetting }
  set _isSetting(isSetting) { this.isSetting = isSetting }
  get _changing() {
    this.changing = (this.changing)
      ? this.changing
      : {}
    return this.changing
  }
  get _localStorage() { return this.localStorage }
  set _localStorage(localStorage) { this.localStorage = localStorage }
  get _defaults() { return this.defaults }
  set _defaults(defaults) { this.defaults = defaults }
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
  get _db() {
    let db = localStorage.getItem(this.localStorage.endpoint)
    this.db = (db)
      ? db
      : '{}'
    return JSON.parse(this.db)
  }
  set _db(db) {
    db = JSON.stringify(db)
    localStorage.setItem(this.localStorage.endpoint, db)
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
  get _services() {
    this.services =  (this.services)
      ? this.services
      : {}
    return this.services
  }
  set _services(services) {
    this.services = MVC.Utils.addPropertiesToObject(
      services, this._services
    )
  }
  get _serviceEvents() {
    this.serviceEvents = (this.serviceEvents)
      ? this.serviceEvents
      : {}
    return this.serviceEvents
  }
  set _serviceEvents(serviceEvents) {
    this.serviceEvents = MVC.Utils.addPropertiesToObject(
      serviceEvents, this._serviceEvents
    )
  }
  get _serviceCallbacks() {
    this.serviceCallbacks = (this.serviceCallbacks)
      ? this.serviceCallbacks
      : {}
    return this.serviceCallbacks
  }
  set _serviceCallbacks(serviceCallbacks) {
    this.serviceCallbacks = MVC.Utils.addPropertiesToObject(
      serviceCallbacks, this._serviceCallbacks
    )
  }
  get _enabled() { return this.enabled || false }
  set _enabled(enabled) { this.enabled = enabled }
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
    if(this.validator) {
      let validateMediator = this.mediators.validate
      this._validator.validate(
        this.parse()
      )
      validateMediator.set({
        data: this.validator.data,
        results: this.validator.results
      })
      this.emit(
        validateMediator.name,
        validateMediator.emission(),
        this
      )
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
              let emit = new Boolean()
              let schema = context._settings.schema
              if(
                schema &&
                schema[key]
              ) {
                this[key] = value
                context._changing[key] = value
                if(this.localStorage) context.setDB(key, value)
              } else if(!schema) {
                this[key] = value
                context._changing[key] = value
                if(this.localStorage) context.setDB(key, value)
              }
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
  setDefaults() {
    let _defaults = {}
    if(this.defaults) Object.assign(_defaults, this.defaults)
    if(this.localStorage) Object.assign(_defaults, this._db)
    if(Object.keys(_defaults)) this.set(_defaults)
  }
  enableServiceEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.serviceEvents, this.services, this.serviceCallbacks)
  }
  disableServiceEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.serviceEvents, this.services, this.serviceCallbacks)
  }
  enableDataEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.dataEvents, this, this.dataCallbacks)
  }
  disableDataEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.dataEvents, this, this.dataCallbacks)
  }
  enableMediators() {
    Object.assign(
      this._mediators,
      this.settings.mediators,
      {
        validate: new MVC.Mediators.Validate(),
      }
    )
    return this
  }
  disableMediators() {
    delete this._mediators
    return this
  }
  enable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      this.enableMediators()
      if(settings.schema) {
        this._validator = settings.schema
      }
      if(settings.localStorage) this._localStorage = settings.localStorage
      if(settings.histiogram) this._histiogram = settings.histiogram
      if(settings.services) this._services = settings.services
      if(settings.serviceCallbacks) this._serviceCallbacks = settings.serviceCallbacks
      if(settings.serviceEvents) this._serviceEvents = settings.serviceEvents
      if(settings.data) this.set(settings.data)
      if(settings.dataCallbacks) this._dataCallbacks = settings.dataCallbacks
      if(settings.dataEvents) this._dataEvents = settings.dataEvents
      if(settings.defaults) this._defaults = settings.defaults
      if(
        this.services &&
        this.serviceEvents &&
        this.serviceCallbacks
      ) {
        this.enableServiceEvents()
      }
      if(
        this.dataEvents &&
        this.dataCallbacks
      ) {
        this.enableDataEvents()
      }
    }
    this._enabled = true
    return this
  }
  disable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      if(
        this.services &&
        this.serviceEvents &&
        this.serviceCallbacks
      ) {
        this.disableServiceEvents()
      }
      if(
        this.dataEvents &&
        this.dataCallbacks
      ) {
        this.disableDataEvents()
      }
      delete this._localStorage
      delete this._histiogram
      delete this._services
      delete this._serviceCallbacks
      delete this._serviceEvents
      delete this._data
      delete this._dataCallbacks
      delete this._dataEvents
      delete this._schema
      delete this._validator
      this.disableMediators()
    }
    this._enabled = false
    return this
  }
  parse(data) {
    data = data || this._data || {}
    return JSON.parse(JSON.stringify(data))
  }
}

MVC.Mediator = class extends MVC.Model {
  constructor() {
    super(...arguments)
    if(this.settings) {
      if(this.settings.name) this._name = this.settings.name
    }
  }
  get _name() { return this.name }
  set _name(name) { this.name = name }
  emission() {
    let eventData = {
      name: this.name,
      data: this.data
    }
    this.emit(
      this.name,
      eventData
    )
    return eventData
  }
}

MVC.Mediators = {}

MVC.Mediators.Navigate = class extends MVC.Mediator {
  constructor() {
    super(...arguments)
    this.addSettings()
    this.enable()
  }
  addSettings() {
    this._name = 'navigate'
    this._schema = {
      oldURL: {
        type: 'string',
      },
      newURL: {
        type: 'string',
      },
      currentRoute: {
        type: 'string',
      },
      currentController: {
        type: 'string',
      },
    }
  }
}

MVC.Mediators.Validate = class extends MVC.Mediator {
  constructor() {
    super(...arguments)
    this.addSettings()
    this.enable()
  }
  addSettings() {
    this._name = 'validate'
    this._schema = {
      data: {
        type: 'object',
      },
      results: {
        type: 'object',
      },
    }
  }
}

MVC.View = class extends MVC.Base {
  constructor() {
    super(...arguments)
    return this
  }
  get _elementName() { return this._element.tagName }
  set _elementName(elementName) {
    if(!this._element) this._element = document.createElement(elementName)
  }
  get _element() { return this.element }
  set _element(element) {
    if(
      element instanceof HTMLElement ||
      element instanceof Document
    ) {
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
      if(typeof uiValue === 'string') {
        this._ui[uiKey] = this._element.querySelectorAll(uiValue)
      } else if(
        uiValue instanceof HTMLElement ||
        uiValue instanceof Document
      ) {
        this._ui[uiKey] = uiValue
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
  get elementObserver() {
    this._elementObserver = (this._elementObserver)
      ? this._elementObserver
      : new MutationObserver(this.elementObserve.bind(this))
    return this._elementObserver
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
    this.templates = MVC.Utils.addPropertiesToObject(
      templates, this._templates
    )
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
  autoInsert() {
    if(this.insert) {
      let parentElement
      if(MVC.Utils.typeOf(this.insert.element) === 'string') {
        parentElement = document.querySelectorAll(this.insert.element)
      } else {
        parentElement = this.insert.element
      }
      if(
        parentElement instanceof HTMLElement ||
        parentElement instanceof Node
      ) {
        parentElement.insertAdjacentElement(this.insert.method, this.element)
      } else if(parentElement instanceof NodeList) {
        parentElement
          .forEach((_parentElement) => {
            _parentElement.insertAdjacentElement(this.insert.method, this.element)
          })
      }
    }
    return this
  }
  autoRemove() {
    if(
      this.element &&
      this.element.parentElement
    ) this.element.parentElement.removeChild(this.element)
    return this
  }
  enableElement(settings) {
    settings = settings || this.settings
    if(settings.elementName) this._elementName = settings.elementName
    if(settings.element) this._element = settings.element
    if(settings.attributes) this._attributes = settings.attributes
    if(settings.templates) this._templates = settings.templates
    if(settings.insert) this._insert = settings.insert
    return this
  }
  disableElement(settings) {
    settings = settings || this.settings
    if(this.element) delete this.element
    if(this.attributes) delete this.attributes
    if(this.templates) delete this.templates
    if(this.insert) delete this.insert
    return this
  }
  resetUI() {
    this.disableUI()
    this.enableUI()
    return this
  }
  enableUI(settings) {
    settings = settings || this.settings
    if(settings.ui) this._ui = settings.ui
    if(settings.uiCallbacks) this._uiCallbacks = settings.uiCallbacks
    if(settings.uiEvents) {
      this._uiEvents = settings.uiEvents
      this.enableUIEvents()
    }
    return this
  }
  disableUI(settings) {
    settings = settings || this.settings
    if(settings.uiEvents) {
      this.disableUIEvents()
      delete this._uiEvents
    }
    delete this.uiEvents
    delete this.ui
    delete this.uiCallbacks
    return this
  }
  enableUIEvents() {
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
    return this
  }
  enableRenderers() {
    MVC.Utils.objectQuery(
      '[/^render.*?/]',
      this.settings
    ).forEach(([rendererName, rendererFunction]) => {
      this[rendererName] = rendererFunction
    })
    return this
  }
  disableRenderers() {
    MVC.Utils.objectQuery(
      '[/^render.*?/]',
      this.settings
    ).forEach((rendererName, rendererFunction) => {
      delete this[rendererName]
    })
    return this
  }
  disableUIEvents() {
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
    return this
  }
  enableMediators() {
    if(this.settings.mediators) this._mediators = this.settings.mediators
    return this
  }
  disableMediators() {
    if(this._mediators) delete this._mediators
    return this
  }
  enable() {
    let settings = this.settings
    if(
      settings &&
      !this._enabled
    ) {
      this.enableRenderers()
      this.enableMediators()
      this.enableElement(settings)
      this.enableUI(settings)
      this._enabled = true
    }
    return this
  }
  disable() {
    let settings = this.settings
    if(
      settings &&
      this._enabled
    ) {
      this.disableRenderers()
      this.disableUI(settings)
      this.disableElement(settings)
      this.disableMediators()
      this._enabled = false
    }
    return this
  }
}

MVC.Controller = class extends MVC.Base {
  constructor() {
    super(...arguments)
  }
  get _mediatorCallbacks() {
    this.mediatorCallbacks = (this.mediatorCallbacks)
      ? this.mediatorCallbacks
      : {}
    return this.mediatorCallbacks
  }
  set _mediatorCallbacks(mediatorCallbacks) {
    this.mediatorCallbacks = MVC.Utils.addPropertiesToObject(
      mediatorCallbacks, this._mediatorCallbacks
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
  get _routerEvents() {
    this.routerEvents = (this.routerEvents)
      ? this.routerEvents
      : {}
    return this.routerEvents
  }
  set _routerEvents(routerEvents) {
    this.routerEvents = MVC.Utils.addPropertiesToObject(
      routerEvents, this._routerEvents
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
  get _mediatorEvents() {
    this.mediatorEvents = (this.mediatorEvents)
      ? this.mediatorEvents
      : {}
    return this.mediatorEvents
  }
  set _mediatorEvents(mediatorEvents) {
    this.mediatorEvents = MVC.Utils.addPropertiesToObject(
      mediatorEvents, this._mediatorEvents
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
  enableModelEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.modelEvents, this.models, this.modelCallbacks)
    return this
  }
  disableModelEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.modelEvents, this.models, this.modelCallbacks)
    return this
  }
  enableViewEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.viewEvents, this.views, this.viewCallbacks)
    return this
  }
  disableViewEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.viewEvents, this.views, this.viewCallbacks)
    return this
  }
  enableControllerEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks)
    return this
  }
  disableControllerEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks)
    return this
  }
  enableMediatorEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.mediatorEvents, this.mediators, this.mediatorCallbacks)
    return this
  }
  disableMediatorEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.mediatorEvents, this.mediators, this.mediatorCallbacks)
    return this
  }
  enableRouterEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.routerEvents, this.routers, this.routerCallbacks)
    return this
  }
  disableRouterEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.routerEvents, this.routers, this.routerCallbacks)
    return this
  }
  enable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      if(settings.modelCallbacks) this._modelCallbacks = settings.modelCallbacks
      if(settings.viewCallbacks) this._viewCallbacks = settings.viewCallbacks
      if(settings.controllerCallbacks) this._controllerCallbacks = settings.controllerCallbacks
      if(settings.mediatorCallbacks) this._mediatorCallbacks = settings.mediatorCallbacks
      if(settings.routerCallbacks) this._routerCallbacks = settings.routerCallbacks
      if(settings.models) this._models = settings.models
      if(settings.views) this._views = settings.views
      if(settings.controllers) this._controllers = settings.controllers
      if(settings.mediators) this._mediators = settings.mediators
      if(settings.routers) this._routers = settings.routers
      if(settings.modelEvents) this._modelEvents = settings.modelEvents
      if(settings.viewEvents) this._viewEvents = settings.viewEvents
      if(settings.controllerEvents) this._controllerEvents = settings.controllerEvents
      if(settings.mediatorEvents) this._mediatorEvents = settings.mediatorEvents
      if(settings.routerEvents) this._routerEvents = settings.routerEvents
      if(
        this.modelEvents &&
        this.models &&
        this.modelCallbacks
      ) {
        this.enableModelEvents()
      }
      if(
        this.viewEvents &&
        this.views &&
        this.viewCallbacks
      ) {
        this.enableViewEvents()
      }
      if(
        this.controllerEvents &&
        this.controllers &&
        this.controllerCallbacks
      ) {
        this.enableControllerEvents()
      }
      if(
        this.routerEvents &&
        this.routers &&
        this.routerCallbacks
      ) {
        this.enableRouterEvents()
      }
      if(
        this.mediatorEvents &&
        this.mediators &&
        this.mediatorCallbacks
      ) {
        this.enableMediatorEvents()
      }
      this._enabled = true
    }
    return this
  }
  reset() {
    this.disable()
    this.enable()
    return this
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
        this.disableModelEvents()
      }
      if(
        this.viewEvents &&
        this.views &&
        this.viewCallbacks
      ) {
        this.disableViewEvents()
      }
      if(
        this.controllerEvents &&
        this.controllers &&
        this.controllerCallbacks
      ) {
        this.disableControllerEvents()
      }}
      if(
        this.routerEvents &&
        this.routers &&
        this.routerCallbacks
      ) {
        this.disableRouterEvents()
      }
      if(
        this.mediatorEvents &&
        this.mediators &&
        this.mediatorCallbacks
      ) {
        this.disableMediatorEvents()
        delete this._modelCallbacks
        delete this._viewCallbacks
        delete this._controllerCallbacks
        delete this._mediatorCallbacks
        delete this._routerCallbacks
        delete this._models
        delete this._views
        delete this._controllers
        delete this._mediators
        delete this._routers
        delete this._routerEvents
        delete this._modelEvents
        delete this._viewEvents
        delete this._controllerEvents
        delete this._mediatorEvents
      this._enabled = false
    }
    return this
  }
}

MVC.Router = class extends MVC.Base {
  constructor() {
    super(...arguments)
    return this
  }
  get protocol() { return window.location.protocol }
  get hostname() { return window.location.hostname }
  get port() { return window.location.port }
  get path() { return window.location.pathname }
  get hash() {
    let href = window.location.href
    let hashIndex = href.indexOf('#')
    if(hashIndex > -1) {
      let paramIndex = href.indexOf('?')
      let sliceStart = hashIndex + 1
      let sliceStop
      if(paramIndex > -1) {
        sliceStop = (hashIndex > paramIndex)
          ? href.length
          : paramIndex
      } else {
        sliceStop = href.length
      }
      href = href.slice(sliceStart, sliceStop)
      if(href.length) {
        return href
      } else {
        return null
      }
    } else {
      return null
    }
  }
  get params() {
    let href = window.location.href
    let paramIndex = href.indexOf('?')
    if(paramIndex > -1) {
      let hashIndex = href.indexOf('#')
      let sliceStart = paramIndex + 1
      let sliceStop
      if(hashIndex > -1) {
        sliceStop = (paramIndex > hashIndex)
          ? href.length
          : hashIndex
      } else {
        sliceStop = href.length
      }
      href = href.slice(sliceStart, sliceStop)
      if(href.length) {
        return href
      } else {
        return null
      }
    } else {
      return null
    }
  }
  get _routeData() {
    let routeData = {
      location: {},
      controller: {},
    }
    let path = this.path.split('/').filter((fragment) => fragment.length)
    path = (path.length)
      ? path
      : ['/']
    let hash = this.hash
    let hashFragments = (hash)
      ? hash.split('/').filter((fragment) => fragment.length)
      : null
    let params = this.params
    let paramData = (params)
      ? MVC.Utils.paramsToObject(params)
      : null
    if(this.protocol) routeData.location.protocol = this.protocol
    if(this.hostname) routeData.location.hostname = this.hostname
    if(this.port) routeData.location.port = this.port
    if(this.path) routeData.location.path = this.path
    if(
      hash &&
      hashFragments
    ) {
      hashFragments = (hashFragments.length)
      ? hashFragments
      : ['/']
      routeData.location.hash = {
        path: hash,
        fragments: hashFragments,
      }
    }
    if(
      params &&
      paramData
    ) {
      routeData.location.params = {
        path: params,
        data: paramData,
      }
    }
    routeData.location.path = {
      name: this.path,
      fragments: path,
    }
    routeData.location.currentURL = this.currentURL
    let routeControllerData = this._routeControllerData
    routeData.location = Object.assign(
      routeData.location,
      routeControllerData.location
    )
    routeData.controller = routeControllerData.controller
    this.routeData = routeData
    return this.routeData
  }
  get _routeControllerData() {
    let routeData = {
      location: {},
    }
    Object.entries(this.routes)
      .forEach(([routePath, routeSettings]) => {
        let pathFragments = this.path.split('/').filter((fragment) => fragment.length)
        pathFragments = (pathFragments.length)
          ? pathFragments
          : ['/']
        let routeFragments = routePath.split('/').filter((fragment, fragmentIndex) => fragment.length)
        routeFragments = (routeFragments.length)
          ? routeFragments
          : ['/']
        if(
          pathFragments.length &&
          pathFragments.length === routeFragments.length
        ) {
          let match
          return routeFragments.filter((routeFragment, routeFragmentIndex) => {
            if(
              match === undefined ||
              match === true
            ) {
              if(routeFragment[0] === ':') {
                let currentIDKey = routeFragment.replace(':', '')
                if(
                  routeFragmentIndex === pathFragments.length - 1
                ) {
                  routeData.location.currentIDKey = currentIDKey
                }
                routeData.location[currentIDKey] = pathFragments[routeFragmentIndex]
                routeFragment = this.fragmentIDRegExp
              } else {
                routeFragment = routeFragment.replace(new RegExp('/', 'gi'), '\\\/')
                routeFragment = this.routeFragmentNameRegExp(routeFragment)
              }
              match = routeFragment.test(pathFragments[routeFragmentIndex])
              if(
                match === true &&
                routeFragmentIndex === pathFragments.length - 1
              ) {
                routeData.location.route = {
                  name: routePath,
                  fragments: routeFragments,
                }
                routeData.controller = routeSettings
                return routeSettings
              }
            }
          })[0]
        }
      })
    return routeData
  }
  get _enabled() { return this.enabled || false }
  set _enabled(enabled) { this.enabled = enabled }
  get _routes() {
    this.routes = (this.routes)
      ? this.routes
      : {}
    return this.routes
  }
  set _routes(routes) {
    this.routes = MVC.Utils.addPropertiesToObject(
      routes, this._routes
    )
  }
  get _controller() { return this.controller }
  set _controller(controller) { this.controller = controller }
  get _previousURL() { return this.previousURL }
  set _previousURL(previousURL) { this.previousURL = previousURL }
  get _currentURL() { return this.currentURL }
  set _currentURL(currentURL) {
    if(this.currentURL) this._previousURL = this.currentURL
    this.currentURL = currentURL
  }
  get fragmentIDRegExp() { return new RegExp(/^([0-9A-Z\?\=\,\.\*\-\_\'\"\^\%\$\#\@\!\~\(\)\{\}\&\<\>\\\/])*$/, 'gi') }
  routeFragmentNameRegExp(fragment) {
    return new RegExp('^'.concat(fragment, '$'))
  }
  enable() {
    if(
      !this.enabled
    ) {
      this.enableMediators()
      this.enableEvents()
      this.enableRoutes()
      this._enabled = true
    }
    return this
  }
  disable() {
    if(
      this.enabled
    ) {
      this.disableEvents()
      this.disableRoutes()
      this.disableMediators()
      this._enabled = false
    }
    return this
  }
  enableRoutes() {
    if(this.settings.controller) this._controller = this.settings.controller
    this._routes = Object.entries(this.settings.routes).reduce(
      (
        _routes,
        [routePath, routeSettings],
        routeIndex,
        originalRoutes,
      ) => {
        _routes[routePath] = Object.assign(
          routeSettings,
          {
            callback: this.controller[routeSettings.callback].bind(this.controller),
          }
        )
        return _routes
      },
      {}
    )
    return this
  }
  enableMediators() {
    Object.assign(
      this._mediators,
      this.settings.mediators,
      {
        navigateMediator: new MVC.Mediators.Navigate(),
      }
    )
    return this
  }
  disableMediators() {
    delete this._mediators.navigateMediator
    return this
  }
  disableRoutes() {
    delete this._routes
    delete this._controller
    return this
  }
  enableEvents() {
    window.addEventListener('hashchange', this.routeChange.bind(this))
    return this
  }
  disableEvents() {
    window.removeEventListener('hashchange', this.routeChange.bind(this))
    return this
  }
  routeChange() {
    this._currentURL = window.location.href
    let routeData = this._routeData
    if(routeData.controller) {
      let navigateMediator = this.mediators.navigateMediator
      if(this.previousURL) routeData.previousURL = this.previousURL
      navigateMediator
        .unset()
        .set(routeData)
      this.emit(
        navigateMediator.name,
        navigateMediator.emission()
      )
      routeData.controller.callback(
        navigateMediator.emission()
      )
    }
    return this
  }
  navigate(path) {
    window.location.href = path
  }
}

module.exports = MVC