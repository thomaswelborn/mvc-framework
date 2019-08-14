var MVC = MVC || {};
MVC.Constants = {};
MVC.CONST = MVC.Constants;
MVC.Constants.Events = {};
MVC.CONST.EV = MVC.Constants.Events;
MVC.Constants.Operators = {};
MVC.CONST.Operators = {};
MVC.CONST.Operators.Comparison = {
  EQ: 'EQ',
  STEQ: 'STEQ',
  NOEQ: 'NOEQ',
  STNOEQ: 'STNOEQ',
  GT: 'GT',
  LT: 'LT',
  GTE: 'GTE',
  LTE: 'LTE'
};
MVC.CONST.Operators.Statement = {
  AND: 'AND',
  OR: 'OR'
};
console.log(MVC.CONST);
MVC.Utils = {};
MVC.Utils.isArray = function isArray(object) {
  return Array.isArray(object);
};

MVC.Utils.isObject = function isObject(object) {
  return !Array.isArray(object) && object !== null ? typeof object === 'object' : false;
};

MVC.Utils.typeOf = function typeOf(value) {
  return typeof valueA === 'object' ? MVC.Utils.isObject(valueA) ? 'object' : MVC.Utils.isArray(valueA) ? 'array' : valueA === null ? 'null' : undefined : typeof value;
};

MVC.Utils.isHTMLElement = function isHTMLElement(object) {
  return object instanceof HTMLElement;
};
MVC.Utils.typeOf = function typeOf(data) {
  switch (typeof data) {
    case 'object':
      var _object;

      if (MVC.Utils.isArray(data)) {
        // Array
        return 'array';
      } else if (MVC.Utils.isObject(data)) {
        // Object
        return 'object';
      } else if (data === null) {
        // Null
        return 'null';
      }

      return _object;
      break;

    case 'string':
    case 'number':
    case 'boolean':
    case 'undefined':
    case 'function':
      return typeof data;
      break;
  }
};
MVC.Utils.addPropertiesToObject = function addPropertiesToObject() {
  var targetObject;

  switch (arguments.length) {
    case 2:
      var properties = arguments[0];
      targetObject = arguments[1];

      for (var [_propertyName, _propertyValue] of Object.entries(properties)) {
        targetObject[_propertyName] = _propertyValue;
      }

      break;

    case 3:
      var propertyName = arguments[0];
      var propertyValue = arguments[1];
      targetObject = arguments[2];
      targetObject[propertyName] = propertyValue;
      break;
  }

  return targetObject;
};
MVC.Utils.objectQuery = function objectQuery(string, context) {
  var stringData = MVC.Utils.objectQuery.parseNotation(string);
  if (stringData[0] === '@') stringData.splice(0, 1);
  if (!stringData.length) return context;
  context = MVC.Utils.isObject(context) ? Object.entries(context) : context;
  return stringData.reduce((object, fragment, fragmentIndex, fragments) => {
    var properties = [];
    fragment = MVC.Utils.objectQuery.parseFragment(fragment);

    for (var [propertyKey, propertyValue] of object) {
      if (propertyKey.match(fragment)) {
        if (fragmentIndex === fragments.length - 1) {
          properties = properties.concat([[propertyKey, propertyValue]]);
        } else {
          properties = properties.concat(Object.entries(propertyValue));
        }
      }
    }

    object = properties;
    return object;
  }, context);
};

MVC.Utils.objectQuery.parseNotation = function parseNotation(string) {
  if (string.charAt(0) === '[' && string.charAt(string.length - 1) == ']') {
    string = string.slice(1, -1).split('][');
  } else {
    string = string.split('.');
  }

  return string;
};

MVC.Utils.objectQuery.parseFragment = function parseFragment(fragment) {
  if (fragment.charAt(0) === '/' && fragment.charAt(fragment.length - 1) == '/') {
    fragment = fragment.slice(1, -1);
    fragment = new RegExp('^'.concat(fragment, '$'));
  }

  return fragment;
};
MVC.Utils.toggleEventsForTargetObjects = function toggleEventsForTargetObjects(toggleMethod, events, targetObjects, callbacks) {
  for (var [eventSettings, eventCallbackName] of Object.entries(events)) {
    var eventData = eventSettings.split(' ');
    var eventTargetSettings = eventData[0];
    var eventName = eventData[1];
    var eventTargets = MVC.Utils.objectQuery(eventTargetSettings, targetObjects);
    eventTargets = !MVC.Utils.isArray(eventTargets) ? [['@', eventTargets]] : eventTargets;

    for (var [eventTargetName, eventTarget] of eventTargets) {
      var eventMethodName = toggleMethod === 'on' ? eventTarget instanceof NodeList || eventTarget instanceof HTMLElement || eventTarget instanceof Document ? 'addEventListener' : 'on' : eventTarget instanceof NodeList || eventTarget instanceof HTMLElement || eventTarget instanceof Document ? 'removeEventListener' : 'off';
      var eventCallback = MVC.Utils.objectQuery(eventCallbackName, callbacks)[0][1];

      if (eventTarget instanceof NodeList) {
        for (var _eventTarget of eventTarget) {
          _eventTarget[eventMethodName](eventName, eventCallback);
        }
      } else if (eventTarget instanceof HTMLElement) {
        eventTarget[eventMethodName](eventName, eventCallback);
      } else {
        eventTarget[eventMethodName](eventName, eventCallback);
      }
    }
  }
};

MVC.Utils.bindEventsToTargetObjects = function bindEventsToTargetObjects() {
  this.toggleEventsForTargetObjects('on', ...arguments);
};

MVC.Utils.unbindEventsFromTargetObjects = function unbindEventsFromTargetObjects() {
  this.toggleEventsForTargetObjects('off', ...arguments);
};
MVC.Utils.validateDataSchema = function validateDataSchema(data, schema) {
  if (schema) {
    var validationSummary = {};
    Object.entries(schema).forEach((_ref) => {
      var [schemaKey, schemaSettings] = _ref;
      var validation = {};
      var value = data[schemaKey];
      validation.key = schemaKey;

      if (schemaSettings.required) {
        validation.required = MVC.Utils.validateDataSchema.required(value, schemaSettings.required);
      }

      if (schemaSettings.type) {
        validation.type = MVC.Utils.validateDataSchema.type(value, schemaSettings.type);
      }

      if (schemaSettings.evaluations) {
        var validationEvaluations = MVC.Utils.validateDataSchema.evaluations(value, schemaSettings.evaluations);
        validation.evaluations = MVC.Utils.validateDataSchema.evaluationResults(validationEvaluations);
      }

      validationSummary[schemaKey] = validation;
    });
    return validationSummary;
  }
};

MVC.Utils.validateDataSchema.required = function required(value, schemaSettings) {
  var validationSummary = {
    value: value
  };
  var messages = Object.assign({
    pass: 'Value is defined.',
    fail: 'Value is not defined.'
  }, schemaSettings.messages);
  value = value !== undefined;

  switch (MVC.Utils.typeOf(schemaSettings)) {
    case 'boolean':
      validationSummary.comparator = schemaSettings;
      validationSummary.result = value === schemaSettings;
      break;

    case 'object':
      validationSummary.comparator = schemaSettings.value;
      validationSummary.result = value === schemaSettings.value;
      break;
  }

  validationSummary.message = validationSummary.result ? messages.pass : messages.fail;
  return validationSummary;
};

MVC.Utils.validateDataSchema.type = function required(value, schemaSettings) {
  var validationSummary = {
    value: value
  };
  var messages = Object.assign({
    pass: 'Valid Type.',
    fail: 'Invalid Type.'
  }, schemaSettings.messages);

  switch (MVC.Utils.typeOf(schemaSettings)) {
    case 'string':
      validationSummary.comparator;
      validationSummary.result = MVC.Utils.typeOf(value) === schemaSettings;
      break;

    case 'object':
      validationSummary.result = MVC.Utils.typeOf(value) === schemaSettings.value;
      break;
  }

  validationSummary.message = validationSummary.result ? messages.pass : messages.fail;
  return validationSummary;
};

MVC.Utils.validateDataSchema.evaluations = function required(value, evaluations) {
  return evaluations.reduce((_evaluations, evaluation, evaluationIndex) => {
    if (MVC.Utils.isArray(evaluation)) {
      _evaluations.push(...MVC.Utils.validateDataSchema.evaluations(value, evaluation));
    } else {
      evaluation.value = value;
      var valueComparison = MVC.Utils.validateDataSchema.compareValues(evaluation.value, evaluation.comparison.value, evaluation.comparator, evaluation.messages);
      evaluation.results = evaluation.results || {};
      evaluation.results.value = valueComparison;

      _evaluations.push(evaluation);
    }

    if (_evaluations.length > 1) {
      var currentEvaluation = _evaluations[evaluationIndex];

      if (currentEvaluation.comparison.statement) {
        var previousEvaluation = _evaluations[evaluationIndex - 1];
        var previousEvaluationComparisonValue = currentEvaluation.results.statement ? currentEvaluation.results.statement.result : currentEvaluation.results.value.result;
        var statementComparison = MVC.Utils.validateDataSchema.compareStatements(previousEvaluationComparisonValue, currentEvaluation.comparison.statement, currentEvaluation.results.value.result, currentEvaluation.messages);
        currentEvaluation.results = currentEvaluation.results || {};
        currentEvaluation.results.statement = statementComparison;
      }
    }

    return _evaluations;
  }, []);
};

MVC.Utils.validateDataSchema.evaluationResults = function evaluationResults(evaluations) {
  var validationEvaluations = {
    pass: [],
    fail: []
  };
  evaluations.forEach(evaluationValidation => {
    if (evaluationValidation.results.statement) {
      if (evaluationValidation.results.statement.result === false) {
        validationEvaluations.fail.push(evaluationValidation);
      } else if (evaluationValidation.results.statement.result === true) {
        validationEvaluations.pass.push(evaluationValidation);
      }
    } else if (evaluationValidation.results.value) {
      if (evaluationValidation.results.value.result === false) {
        validationEvaluations.fail.push(evaluationValidation);
      } else if (evaluationValidation.results.value.result === true) {
        validationEvaluations.pass.push(evaluationValidation);
      }
    }
  });
  return validationEvaluations;
};

MVC.Utils.validateDataSchema.compareValues = function compareValues(value, operator, comparator, messages) {
  var evaluationResult;

  switch (operator) {
    case MVC.CONST.Operators.Comparison.EQ:
      evaluationResult = value == comparator;
      break;

    case MVC.CONST.Operators.Comparison.STEQ:
      evaluationResult = value === comparator;
      break;

    case MVC.CONST.Operators.Comparison.NOEQ:
      evaluationResult = value != comparator;
      break;

    case MVC.CONST.Operators.Comparison.STNOEQ:
      evaluationResult = value !== comparator;
      break;

    case MVC.CONST.Operators.Comparison.GT:
      evaluationResult = value > comparator;
      break;

    case MVC.CONST.Operators.Comparison.LT:
      evaluationResult = value < comparator;
      break;

    case MVC.CONST.Operators.Comparison.GTE:
      evaluationResult = value >= comparator;
      break;

    case MVC.CONST.Operators.Comparison.LTE:
      evaluationResult = value <= comparator;
      break;
  }

  return {
    result: evaluationResult,
    message: evaluationResult ? messages.pass : messages.fail
  };
};

MVC.Utils.validateDataSchema.compareStatements = function compareStatements(value, operator, comparator, messages) {
  var evaluationResult;

  switch (operator) {
    case MVC.CONST.Operators.Statement.AND:
      evaluationResult = value && comparator;
      break;

    case MVC.CONST.Operators.Statement.OR:
      evaluationResult = value || comparator;
      break;
  }

  return {
    result: evaluationResult,
    message: evaluationResult ? messages.pass : messages.fail
  };
};
MVC.Events = class {
  constructor() {}

  get _events() {
    this.events = this.events ? this.events : {};
    return this.events;
  }

  eventCallbacks(eventName) {
    return this._events[eventName] || {};
  }

  eventCallbackName(eventCallback) {
    return eventCallback.name.length ? eventCallback.name : 'anonymousFunction';
  }

  eventCallbackGroup(eventCallbacks, eventCallbackName) {
    return eventCallbacks[eventCallbackName] || [];
  }

  on(eventName, eventCallback) {
    var eventCallbacks = this.eventCallbacks(eventName);
    var eventCallbackName = this.eventCallbackName(eventCallback);
    var eventCallbackGroup = this.eventCallbackGroup(eventCallbacks, eventCallbackName);
    eventCallbackGroup.push(eventCallback);
    eventCallbacks[eventCallbackName] = eventCallbackGroup;
    this._events[eventName] = eventCallbacks;
  }

  off() {
    switch (arguments.length) {
      case 1:
        var eventName = arguments[0];
        delete this._events[eventName];
        break;

      case 2:
        var eventName = arguments[0];
        var eventCallback = arguments[1];
        var eventCallbackName = this.eventCallbackName(eventCallback);
        delete this._events[eventName][eventCallbackName];
        break;
    }
  }

  emit(eventName, eventData) {
    var eventCallbacks = this.eventCallbacks(eventName);

    for (var [eventCallbackGroupName, eventCallbackGroup] of Object.entries(eventCallbacks)) {
      for (var eventCallback of eventCallbackGroup) {
        var additionalArguments = Object.values(arguments).splice(2) || [];
        eventCallback(eventData, ...additionalArguments);
      }
    }
  }

};
MVC.Channels = class {
  constructor() {}

  get _channels() {
    this.channels = this.channels ? this.channels : {};
    return this.channels;
  }

  channel(channelName) {
    this._channels[channelName] = this._channels[channelName] ? this._channels[channelName] : new MVC.Channels.Channel();
    return this._channels[channelName];
  }

  off(channelName) {
    delete this._channels[channelName];
  }

};
MVC.Channels.Channel = class {
  constructor() {}

  get _responses() {
    this.responses = this.responses ? this.responses : {};
    return this.responses;
  }

  response(responseName, responseCallback) {
    if (responseCallback) {
      this._responses[responseName] = responseCallback;
    } else {
      return this._responses[response];
    }
  }

  request(responseName, requestData) {
    if (this._responses[responseName]) {
      return this._responses[responseName](requestData);
    }
  }

  off(responseName) {
    if (responseName) {
      delete this._responses[responseName];
    } else {
      for (var [_responseName] of Object.keys(this._responses)) {
        delete this._responses[_responseName];
      }
    }
  }

};
MVC.Base = class extends MVC.Events {
  constructor(settings, configuration) {
    super();
    if (configuration) this._configuration = configuration;
    if (settings) this._settings = settings;
  }

  get _configuration() {
    this.configuration = this.configuration ? this.configuration : {};
    return this.configuration;
  }

  set _configuration(configuration) {
    this.configuration = configuration;
  }

  get _settings() {
    this.settings = this.settings ? this.settings : {};
    return this.settings;
  }

  set _settings(settings) {
    this.settings = MVC.Utils.addPropertiesToObject(settings, this._settings);
  }

  get _emitters() {
    this.emitters = this.emitters ? this.emitters : {};
    return this.emitters;
  }

  set _emitters(emitters) {
    this.emitters = MVC.Utils.addPropertiesToObject(emitters, this._emitters);
  }

};
MVC.Service = class extends MVC.Base {
  constructor() {
    super(...arguments);
  }

  get _defaults() {
    return this.defaults || {
      contentType: {
        'Content-Type': 'application/json'
      },
      responseType: 'json'
    };
  }

  get _responseTypes() {
    return ['', 'arraybuffer', 'blob', 'document', 'json', 'text'];
  }

  get _responseType() {
    return this.responseType;
  }

  set _responseType(responseType) {
    this._xhr.responseType = this._responseTypes.find(responseTypeItem => responseTypeItem === responseType) || this._defaults.responseType;
  }

  get _type() {
    return this.type;
  }

  set _type(type) {
    this.type = type;
  }

  get _url() {
    return this.url;
  }

  set _url(url) {
    this.url = url;
  }

  get _headers() {
    return this.headers || [];
  }

  set _headers(headers) {
    this._headers.length = 0;
    headers.forEach(header => {
      this._headers.push(header);

      header = Object.entries(header)[0];

      this._xhr.setRequestHeader(header[0], header[1]);
    });
  }

  get _data() {
    return this.data;
  }

  set _data(data) {
    this.data = data;
  }

  get _xhr() {
    this.xhr = this.xhr ? this.xhr : new XMLHttpRequest();
    return this.xhr;
  }

  get _enabled() {
    return this.enabled || false;
  }

  set _enabled(enabled) {
    this.enabled = enabled;
  }

  request(data) {
    data = data || this.data || null;
    return new Promise((resolve, reject) => {
      if (this._xhr.status === 200) this._xhr.abort();

      this._xhr.open(this.type, this.url);

      this._headers = this.settings.headers || [this._defaults.contentType];
      this._xhr.onload = resolve;
      this._xhr.onerror = reject;

      this._xhr.send(data);
    }).then(response => {
      this.emit('xhr:resolve', {
        name: 'xhr:resolve',
        data: response.currentTarget
      });
      return response;
    }).catch(error => {
      throw error;
    });
  }

  enable() {
    var settings = this.settings;

    if (!this.enabled && Object.keys(settings).length) {
      if (settings.type) this._type = settings.type;
      if (settings.url) this._url = settings.url;
      if (settings.data) this._data = settings.data || null;
      if (this.settings.responseType) this._responseType = this._settings.responseType;
      this._enabled = true;
    }

    return this;
  }

  disable() {
    var settings = this.settings;

    if (this.enabled && Object.keys(settings).length) {
      delete this._type;
      delete this._url;
      delete this._data;
      delete this._headers;
      delete this._responseType;
      this._enabled = false;
    }

    return this;
  }

};
MVC.Model = class extends MVC.Base {
  constructor() {
    super(...arguments);
  }

  get _isSetting() {
    return this.isSetting;
  }

  set _isSetting(isSetting) {
    this.isSetting = isSetting;
  }

  get _changing() {
    this.changing = this.changing ? this.changing : {};
    return this.changing;
  }

  get _localStorage() {
    return this.localStorage;
  }

  set _localStorage(localStorage) {
    this.localStorage = localStorage;
  }

  get _defaults() {
    return this.defaults;
  }

  set _defaults(defaults) {
    this.defaults = defaults;
  }

  get _schema() {
    return this._schema;
  }

  set _schema(schema) {
    this.schema = schema;
  }

  get _histiogram() {
    return this.histiogram || {
      length: 1
    };
  }

  set _histiogram(histiogram) {
    this.histiogram = Object.assign(this._histiogram, histiogram);
  }

  get _history() {
    this.history = this.history ? this.history : [];
    return this.history;
  }

  set _history(data) {
    if (Object.keys(data).length) {
      if (this._histiogram.length) {
        this._history.unshift(this.parse(data));

        this._history.splice(this._histiogram.length);
      }
    }
  }

  get _db() {
    var db = localStorage.getItem(this.localStorage.endpoint);
    this.db = db ? db : '{}';
    return JSON.parse(this.db);
  }

  set _db(db) {
    db = JSON.stringify(db);
    localStorage.setItem(this.localStorage.endpoint, db);
  }

  get _data() {
    this.data = this.data ? this.data : {};
    return this.data;
  }

  get _dataEvents() {
    this.dataEvents = this.dataEvents ? this.dataEvents : {};
    return this.dataEvents;
  }

  set _dataEvents(dataEvents) {
    this.dataEvents = MVC.Utils.addPropertiesToObject(dataEvents, this._dataEvents);
  }

  get _dataCallbacks() {
    this.dataCallbacks = this.dataCallbacks ? this.dataCallbacks : {};
    return this.dataCallbacks;
  }

  set _dataCallbacks(dataCallbacks) {
    this.dataCallbacks = MVC.Utils.addPropertiesToObject(dataCallbacks, this._dataCallbacks);
  }

  get _services() {
    this.services = this.services ? this.services : {};
    return this.services;
  }

  set _services(services) {
    this.services = MVC.Utils.addPropertiesToObject(services, this._services);
  }

  get _serviceEvents() {
    this.serviceEvents = this.serviceEvents ? this.serviceEvents : {};
    return this.serviceEvents;
  }

  set _serviceEvents(serviceEvents) {
    this.serviceEvents = MVC.Utils.addPropertiesToObject(serviceEvents, this._serviceEvents);
  }

  get _serviceCallbacks() {
    this.serviceCallbacks = this.serviceCallbacks ? this.serviceCallbacks : {};
    return this.serviceCallbacks;
  }

  set _serviceCallbacks(serviceCallbacks) {
    this.serviceCallbacks = MVC.Utils.addPropertiesToObject(serviceCallbacks, this._serviceCallbacks);
  }

  get _enabled() {
    return this.enabled || false;
  }

  set _enabled(enabled) {
    this.enabled = enabled;
  }

  enableServiceEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.serviceEvents, this.services, this.serviceCallbacks);
  }

  disableServiceEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.serviceEvents, this.services, this.serviceCallbacks);
  }

  enableDataEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.dataEvents, this, this.dataCallbacks);
  }

  disableDataEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.dataEvents, this, this.dataCallbacks);
  }

  setDefaults() {
    var _defaults = {};
    if (this.defaults) Object.assign(_defaults, this.defaults);
    if (this.localStorage) Object.assign(_defaults, this._db);
    if (Object.keys(_defaults)) this.set(_defaults);
  }

  get() {
    switch (arguments.length) {
      case 0:
        return this.data;
        break;

      case 1:
        var key = arguments[0];
        return this.data[key];
        break;
    }
  }

  set() {
    this._history = this.parse();

    switch (arguments.length) {
      case 1:
        this._isSetting = true;

        var _arguments = Object.entries(arguments[0]);

        _arguments.forEach((_ref, index) => {
          var [key, value] = _ref;
          if (index === _arguments.length - 1) this._isSetting = false;
          this._changing[key] = value;
          this.setDataProperty(key, value);
          if (this.localStorage) this.setDB(key, value);
        });

        delete this.changing;
        break;

      case 2:
        var key = arguments[0];
        var value = arguments[1];
        this.setDataProperty(key, value);
        if (this.localStorage) this.setDB(key, value);
        break;
    }

    return this;
  }

  unset() {
    this._history = this.parse();

    switch (arguments.length) {
      case 0:
        for (var _key of Object.keys(this._data)) {
          this.unsetDataProperty(_key);
        }

        break;

      case 1:
        var key = arguments[0];
        this.unsetDataProperty(key);
        break;
    }

    return this;
  }

  setDB() {
    var db = this._db;

    switch (arguments.length) {
      case 1:
        var _arguments = Object.entries(arguments[0]);

        _arguments.forEach((_ref2) => {
          var [key, value] = _ref2;
          db[key] = value;
        });

        break;

      case 2:
        var key = arguments[0];
        var value = arguments[1];
        db[key] = value;
        break;
    }

    this._db = db;
  }

  unsetDB() {
    switch (arguments.length) {
      case 0:
        delete this._db;
        break;

      case 1:
        var db = this._db;
        var key = arguments[0];
        delete db[key];
        this._db = db;
        break;
    }
  }

  setDataProperty(key, value) {
    if (!this._data['_'.concat(key)]) {
      var context = this;
      Object.defineProperties(this._data, {
        ['_'.concat(key)]: {
          configurable: true,

          get() {
            return this[key];
          },

          set(value) {
            this[key] = value;
            var setValueEventName = ['set', ':', key].join('');
            var setEventName = 'set';
            context.emit(setValueEventName, {
              name: setValueEventName,
              data: {
                key: key,
                value: value
              }
            }, context);

            if (!context._isSetting) {
              if (!Object.values(context._changing).length) {
                context.emit(setEventName, {
                  name: setEventName,
                  data: {
                    key: key,
                    value: value
                  }
                }, context);
              } else {
                context.emit(setEventName, {
                  name: setEventName,
                  data: context._changing
                });
              }
            }
          }

        }
      });
    }

    this._data['_'.concat(key)] = value;
  }

  unsetDataProperty(key) {
    var unsetValueEventName = ['unset', ':', key].join('');
    var unsetEventName = 'unset';
    var unsetValue = this._data[key];
    delete this._data['_'.concat(key)];
    delete this._data[key];
    this.emit(unsetValueEventName, {
      name: unsetValueEventName,
      data: {
        key: key,
        value: unsetValue
      }
    });
    this.emit(unsetEventName, {
      name: unsetEventName,
      data: {
        key: key,
        value: unsetValue
      }
    });
  }

  parse(data) {
    data = data || this._data;
    return JSON.parse(JSON.stringify(Object.assign({}, data)));
  }

  enable() {
    var settings = this.settings;

    if (settings && !this.enabled) {
      if (this.settings.localStorage) this._localStorage = this.settings.localStorage;
      if (this.settings.histiogram) this._histiogram = this.settings.histiogram;
      if (this.settings.emitters) this._emitters = this.settings.emitters;
      if (this.settings.services) this._services = this.settings.services;
      if (this.settings.serviceCallbacks) this._serviceCallbacks = this.settings.serviceCallbacks;
      if (this.settings.serviceEvents) this._serviceEvents = this.settings.serviceEvents;
      if (this.settings.data) this.set(this.settings.data);
      if (this.settings.dataCallbacks) this._dataCallbacks = this.settings.dataCallbacks;
      if (this.settings.dataEvents) this._dataEvents = this.settings.dataEvents;
      if (this.settings.schema) this._schema = this.settings.schema;
      if (this.settings.defaults) this._defaults = this.settings.defaults;

      if (this.services && this.serviceEvents && this.serviceCallbacks) {
        this.enableServiceEvents();
      }

      if (this.dataEvents && this.dataCallbacks) {
        this.enableDataEvents();
      }

      this._enabled = true;
    }
  }

  disable() {
    var settings = this.settings;

    if (settings && !this.enabled) {
      if (this.services && this.serviceEvents && this.serviceCallbacks) {
        this.disableServiceEvents();
      }

      if (this.dataEvents && this.dataCallbacks) {
        this.disableDataEvents();
      }

      delete this._localStorage;
      delete this._histiogram;
      delete this._services;
      delete this._serviceCallbacks;
      delete this._serviceEvents;
      delete this._data;
      delete this._dataCallbacks;
      delete this._dataEvents;
      delete this._schema;
      delete this._emitters;
      this._enabled = false;
    }
  }

};
MVC.Emitter = class extends MVC.Model {
  constructor() {
    super(...arguments);

    if (this.settings) {
      if (this.settings.name) this._name = this.settings.name;
    }
  }

  get _name() {
    return this.name;
  }

  set _name(name) {
    this.name = name;
  }

  emission() {
    var eventData = {
      name: this.name,
      data: this.data
    };
    this.emit(this.name, eventData);
    return eventData;
  }

};
MVC.Emitters = {};
MVC.Emitters.Navigate = class extends MVC.Emitter {
  constructor() {
    super(...arguments);
    this.addSettings();
    this.enable();
  }

  addSettings() {
    this._name = 'navigate';
    this._schema = {
      oldURL: String,
      newURL: String,
      currentRoute: String,
      currentController: String
    };
  }

};
MVC.View = class extends MVC.Base {
  constructor() {
    super(...arguments);
  }

  get _elementName() {
    return this._element.tagName;
  }

  set _elementName(elementName) {
    if (!this._element) this._element = document.createElement(elementName);
  }

  get _element() {
    return this.element;
  }

  set _element(element) {
    if (element instanceof HTMLElement || element instanceof Document) {
      this.element = element;
    } else if (typeof element === 'string') {
      this.element = document.querySelector(element);
    }

    this.elementObserver.observe(this.element, {
      subtree: true,
      childList: true
    });
  }

  get _attributes() {
    return this._element.attributes;
  }

  set _attributes(attributes) {
    for (var [attributeKey, attributeValue] of Object.entries(attributes)) {
      if (typeof attributeValue === 'undefined') {
        this._element.removeAttribute(attributeKey);
      } else {
        this._element.setAttribute(attributeKey, attributeValue);
      }
    }
  }

  get _ui() {
    this.ui = this.ui ? this.ui : {};
    return this.ui;
  }

  set _ui(ui) {
    if (!this._ui['$element']) this._ui['$element'] = this.element;

    for (var [uiKey, uiValue] of Object.entries(ui)) {
      if (typeof uiValue === 'string') {
        this._ui[uiKey] = this._element.querySelectorAll(uiValue);
      } else if (uiValue instanceof HTMLElement || uiValue instanceof Document) {
        this._ui[uiKey] = uiValue;
      }
    }
  }

  get _uiEvents() {
    return this.uiEvents;
  }

  set _uiEvents(uiEvents) {
    this.uiEvents = uiEvents;
  }

  get _uiCallbacks() {
    this.uiCallbacks = this.uiCallbacks ? this.uiCallbacks : {};
    return this.uiCallbacks;
  }

  set _uiCallbacks(uiCallbacks) {
    this.uiCallbacks = MVC.Utils.addPropertiesToObject(uiCallbacks, this._uiCallbacks);
  }

  get _observerCallbacks() {
    this.observerCallbacks = this.observerCallbacks ? this.observerCallbacks : {};
    return this.observerCallbacks;
  }

  set _observerCallbacks(observerCallbacks) {
    this.observerCallbacks = MVC.Utils.addPropertiesToObject(observerCallbacks, this._observerCallbacks);
  }

  get elementObserver() {
    this._elementObserver = this._elementObserver ? this._elementObserver : new MutationObserver(this.elementObserve.bind(this));
    return this._elementObserver;
  }

  get _insert() {
    return this.insert;
  }

  set _insert(insert) {
    this.insert = insert;
  }

  get _enabled() {
    return this.enabled || false;
  }

  set _enabled(enabled) {
    this.enabled = enabled;
  }

  get _templates() {
    this.templates = this.templates ? this.templates : {};
    return this.templates;
  }

  set _templates(templates) {
    this.templates = MVC.Utils.addPropertiesToObject(templates, this._templates);
  }

  elementObserve(mutationRecordList, observer) {
    for (var [mutationRecordIndex, mutationRecord] of Object.entries(mutationRecordList)) {
      switch (mutationRecord.type) {
        case 'childList':
          var mutationRecordCategories = ['addedNodes', 'removedNodes'];

          for (var mutationRecordCategory of mutationRecordCategories) {
            if (mutationRecord[mutationRecordCategory].length) {
              this.resetUI();
            }
          }

          break;
      }
    }
  }

  autoInsert() {
    if (this.insert) {
      document.querySelectorAll(this.insert.element).forEach(element => {
        element.insertAdjacentElement(this.insert.method, this.element);
      });
    }
  }

  autoRemove() {
    if (this.element && this.element.parentElement) this.element.parentElement.removeChild(this.element);
  }

  enableElement(settings) {
    settings = settings || this.settings;
    if (settings.elementName) this._elementName = settings.elementName;
    if (settings.element) this._element = settings.element;
    if (settings.attributes) this._attributes = settings.attributes;
    if (settings.templates) this._templates = settings.templates;
    if (settings.insert) this._insert = settings.insert;
  }

  disableElement(settings) {
    settings = settings || this.settings;
    if (this.element && this.element.parentElement) this.element.parentElement.removeChild(this.element);
    if (this.element) delete this.element;
    if (this.attributes) delete this.attributes;
    if (this.templates) delete this.templates;
    if (this.insert) delete this.insert;
  }

  resetUI() {
    this.disableUI();
    this.enableUI();
  }

  enableUI(settings) {
    settings = settings || this.settings;
    if (settings.ui) this._ui = settings.ui;
    if (settings.uiCallbacks) this._uiCallbacks = settings.uiCallbacks;

    if (settings.uiEvents) {
      this._uiEvents = settings.uiEvents;
      this.enableUIEvents();
    }
  }

  disableUI(settings) {
    settings = settings || this.settings;

    if (settings.uiEvents) {
      this.disableUIEvents();
      delete this._uiEvents;
    }

    delete this.uiEvents;
    delete this.ui;
    delete this.uiCallbacks;
  }

  enableUIEvents() {
    if (this.uiEvents && this.ui && this.uiCallbacks) {
      MVC.Utils.bindEventsToTargetObjects(this.uiEvents, this.ui, this.uiCallbacks);
    }
  }

  disableUIEvents() {
    if (this.uiEvents && this.ui && this.uiCallbacks) {
      MVC.Utils.unbindEventsFromTargetObjects(this.uiEvents, this.ui, this.uiCallbacks);
    }
  }

  enableEmitters() {
    if (this.settings.emitters) this._emitters = this.settings.emitters;
  }

  disableEmitters() {
    if (this._emitters) delete this._emitters;
  }

  enable() {
    var settings = this.settings;

    if (settings && !this._enabled) {
      this.enableEmitters();
      this.enableElement(settings);
      this.enableUI(settings);
      this._enabled = true;
      return this;
    }
  }

  disable() {
    var settings = this.settings;

    if (settings && this._enabled) {
      this.disableUI(settings);
      this.disableElement(settings);
      this.disableEmitters();
      this._enabled = false;
      return thiss;
    }
  }

};
MVC.Controller = class extends MVC.Base {
  constructor() {
    super(...arguments);
  }

  get _emitterCallbacks() {
    this.emitterCallbacks = this.emitterCallbacks ? this.emitterCallbacks : {};
    return this.emitterCallbacks;
  }

  set _emitterCallbacks(emitterCallbacks) {
    this.emitterCallbacks = MVC.Utils.addPropertiesToObject(emitterCallbacks, this._emitterCallbacks);
  }

  get _modelCallbacks() {
    this.modelCallbacks = this.modelCallbacks ? this.modelCallbacks : {};
    return this.modelCallbacks;
  }

  set _modelCallbacks(modelCallbacks) {
    this.modelCallbacks = MVC.Utils.addPropertiesToObject(modelCallbacks, this._modelCallbacks);
  }

  get _viewCallbacks() {
    this.viewCallbacks = this.viewCallbacks ? this.viewCallbacks : {};
    return this.viewCallbacks;
  }

  set _viewCallbacks(viewCallbacks) {
    this.viewCallbacks = MVC.Utils.addPropertiesToObject(viewCallbacks, this._viewCallbacks);
  }

  get _controllerCallbacks() {
    this.controllerCallbacks = this.controllerCallbacks ? this.controllerCallbacks : {};
    return this.controllerCallbacks;
  }

  set _controllerCallbacks(controllerCallbacks) {
    this.controllerCallbacks = MVC.Utils.addPropertiesToObject(controllerCallbacks, this._controllerCallbacks);
  }

  get _models() {
    this.models = this.models ? this.models : {};
    return this.models;
  }

  set _models(models) {
    this.models = MVC.Utils.addPropertiesToObject(models, this._models);
  }

  get _views() {
    this.views = this.views ? this.views : {};
    return this.views;
  }

  set _views(views) {
    this.views = MVC.Utils.addPropertiesToObject(views, this._views);
  }

  get _controllers() {
    this.controllers = this.controllers ? this.controllers : {};
    return this.controllers;
  }

  set _controllers(controllers) {
    this.controllers = MVC.Utils.addPropertiesToObject(controllers, this._controllers);
  }

  get _routers() {
    this.routers = this.routers ? this.routers : {};
    return this.routers;
  }

  set _routers(routers) {
    this.routers = MVC.Utils.addPropertiesToObject(routers, this._routers);
  }

  get _routerEvents() {
    this.routerEvents = this.routerEvents ? this.routerEvents : {};
    return this.routerEvents;
  }

  set _routerEvents(routerEvents) {
    this.routerEvents = MVC.Utils.addPropertiesToObject(routerEvents, this._routerEvents);
  }

  get _routerCallbacks() {
    this.routerCallbacks = this.routerCallbacks ? this.routerCallbacks : {};
    return this.routerCallbacks;
  }

  set _routerCallbacks(routerCallbacks) {
    this.routerCallbacks = MVC.Utils.addPropertiesToObject(routerCallbacks, this._routerCallbacks);
  }

  get _emitterEvents() {
    this.emitterEvents = this.emitterEvents ? this.emitterEvents : {};
    return this.emitterEvents;
  }

  set _emitterEvents(emitterEvents) {
    this.emitterEvents = MVC.Utils.addPropertiesToObject(emitterEvents, this._emitterEvents);
  }

  get _modelEvents() {
    this.modelEvents = this.modelEvents ? this.modelEvents : {};
    return this.modelEvents;
  }

  set _modelEvents(modelEvents) {
    this.modelEvents = MVC.Utils.addPropertiesToObject(modelEvents, this._modelEvents);
  }

  get _viewEvents() {
    this.viewEvents = this.viewEvents ? this.viewEvents : {};
    return this.viewEvents;
  }

  set _viewEvents(viewEvents) {
    this.viewEvents = MVC.Utils.addPropertiesToObject(viewEvents, this._viewEvents);
  }

  get _controllerEvents() {
    this.controllerEvents = this.controllerEvents ? this.controllerEvents : {};
    return this.controllerEvents;
  }

  set _controllerEvents(controllerEvents) {
    this.controllerEvents = MVC.Utils.addPropertiesToObject(controllerEvents, this._controllerEvents);
  }

  get _enabled() {
    return this.enabled || false;
  }

  set _enabled(enabled) {
    this.enabled = enabled;
  }

  enableModelEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.modelEvents, this.models, this.modelCallbacks);
  }

  disableModelEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.modelEvents, this.models, this.modelCallbacks);
  }

  enableViewEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.viewEvents, this.views, this.viewCallbacks);
  }

  disableViewEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.viewEvents, this.views, this.viewCallbacks);
  }

  enableControllerEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks);
  }

  disableControllerEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks);
  }

  enableEmitterEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.emitterEvents, this.emitters, this.emitterCallbacks);
  }

  disableEmitterEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.emitterEvents, this.emitters, this.emitterCallbacks);
  }

  enableRouterEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.routerEvents, this.routers, this.routerCallbacks);
  }

  disableRouterEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.routerEvents, this.routers, this.routerCallbacks);
  }

  enable() {
    var settings = this.settings;

    if (settings && !this.enabled) {
      if (settings.modelCallbacks) this._modelCallbacks = settings.modelCallbacks;
      if (settings.viewCallbacks) this._viewCallbacks = settings.viewCallbacks;
      if (settings.controllerCallbacks) this._controllerCallbacks = settings.controllerCallbacks;
      if (settings.emitterCallbacks) this._emitterCallbacks = settings.emitterCallbacks;
      if (settings.routerCallbacks) this._routerCallbacks = settings.routerCallbacks;
      if (settings.models) this._models = settings.models;
      if (settings.views) this._views = settings.views;
      if (settings.controllers) this._controllers = settings.controllers;
      if (settings.emitters) this._emitters = settings.emitters;
      if (settings.routers) this._routers = settings.routers;
      if (settings.modelEvents) this._modelEvents = settings.modelEvents;
      if (settings.viewEvents) this._viewEvents = settings.viewEvents;
      if (settings.controllerEvents) this._controllerEvents = settings.controllerEvents;
      if (settings.emitterEvents) this._emitterEvents = settings.emitterEvents;
      if (settings.routerEvents) this._routerEvents = settings.routerEvents;

      if (this.modelEvents && this.models && this.modelCallbacks) {
        this.enableModelEvents();
      }

      if (this.viewEvents && this.views && this.viewCallbacks) {
        this.enableViewEvents();
      }

      if (this.controllerEvents && this.controllers && this.controllerCallbacks) {
        this.enableControllerEvents();
      }

      if (this.routerEvents && this.routers && this.routerCallbacks) {
        this.enableRouterEvents();
      }

      if (this.emitterEvents && this.emitters && this.emitterCallbacks) {
        this.enableEmitterEvents();
      }

      this._enabled = true;
    }
  }

  reset() {
    this.disable();
    this.enable();
  }

  disable() {
    var settings = this.settings;

    if (settings && this.enabled) {
      if (this.modelEvents && this.models && this.modelCallbacks) {
        this.disableModelEvents();
      }

      if (this.viewEvents && this.views && this.viewCallbacks) {
        this.disableViewEvents();
      }

      if (this.controllerEvents && this.controllers && this.controllerCallbacks) {
        this.disableControllerEvents();
      }
    }

    if (this.routerEvents && this.routers && this.routerCallbacks) {
      this.disableRouterEvents();
    }

    if (this.emitterEvents && this.emitters && this.emitterCallbacks) {
      this.disableEmitterEvents();
      delete this._modelCallbacks;
      delete this._viewCallbacks;
      delete this._controllerCallbacks;
      delete this._emitterCallbacks;
      delete this._routerCallbacks;
      delete this._models;
      delete this._views;
      delete this._controllers;
      delete this._emitters;
      delete this._routers;
      delete this._routerEvents;
      delete this._modelEvents;
      delete this._viewEvents;
      delete this._controllerEvents;
      delete this._emitterEvents;
      this._enabled = false;
    }
  }

};
MVC.Router = class extends MVC.Base {
  constructor() {
    super(...arguments);
  }

  get protocol() {
    return window.location.protocol;
  }

  get hostname() {
    return window.location.hostname;
  }

  get port() {
    return window.location.port;
  }

  get path() {
    return window.location.pathname;
  }

  get hash() {
    var href = window.location.href;
    var hashIndex = href.indexOf('#');

    if (hashIndex > -1) {
      var paramIndex = href.indexOf('?');
      var sliceStart = hashIndex + 1;
      var sliceStop;

      if (paramIndex > -1) {
        sliceStop = hashIndex > paramIndex ? href.length : paramIndex;
      } else {
        sliceStop = href.length;
      }

      href = href.slice(sliceStart, sliceStop);

      if (href.length) {
        return href;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  get params() {
    var href = window.location.href;
    var paramIndex = href.indexOf('?');

    if (paramIndex > -1) {
      var hashIndex = href.indexOf('#');
      var sliceStart = paramIndex + 1;
      var sliceStop;

      if (hashIndex > -1) {
        sliceStop = paramIndex > hashIndex ? href.length : hashIndex;
      } else {
        sliceStop = href.length;
      }

      href = href.slice(sliceStart, sliceStop);

      if (href.length) {
        return href;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  get _routeData() {
    var routeData = {
      location: {},
      controller: {}
    };
    var path = this.path.split('/').filter(fragment => fragment.length);
    path = path.length ? path : ['/'];
    var hash = this.hash;
    var hashFragments = hash ? hash.split('/').filter(fragment => fragment.length) : null;
    var params = this.params;
    var paramData = params ? MVC.Utils.paramsToObject(params) : null;
    if (this.protocol) routeData.location.protocol = this.protocol;
    if (this.hostname) routeData.location.hostname = this.hostname;
    if (this.port) routeData.location.port = this.port;
    if (this.path) routeData.location.path = this.path;

    if (hash && hashFragments) {
      hashFragments = hashFragments.length ? hashFragments : ['/'];
      routeData.location.hash = {
        path: hash,
        fragments: hashFragments
      };
    }

    if (params && paramData) {
      routeData.location.params = {
        path: params,
        data: paramData
      };
    }

    routeData.location.path = {
      name: this.path,
      fragments: path
    };
    routeData.location.currentURL = this.currentURL;
    var routeControllerData = this._routeControllerData;
    routeData.location = Object.assign(routeData.location, routeControllerData.location);
    routeData.controller = routeControllerData.controller;
    this.routeData = routeData;
    return this.routeData;
  }

  get _routeControllerData() {
    var routeData = {
      location: {}
    };
    Object.entries(this.routes).forEach((_ref) => {
      var [routePath, routeSettings] = _ref;
      var pathFragments = this.path.split('/').filter(fragment => fragment.length);
      pathFragments = pathFragments.length ? pathFragments : ['/'];
      var routeFragments = routePath.split('/').filter((fragment, fragmentIndex) => fragment.length);
      routeFragments = routeFragments.length ? routeFragments : ['/'];

      if (pathFragments.length && pathFragments.length === routeFragments.length) {
        var match;
        return routeFragments.filter((routeFragment, routeFragmentIndex) => {
          if (match === undefined || match === true) {
            if (routeFragment[0] === ':') {
              var currentIDKey = routeFragment.replace(':', '');

              if (routeFragmentIndex === pathFragments.length - 1) {
                routeData.location.currentIDKey = currentIDKey;
              }

              routeData.location[currentIDKey] = pathFragments[routeFragmentIndex];
              routeFragment = this.fragmentIDRegExp;
            } else {
              routeFragment = routeFragment.replace(new RegExp('/', 'gi'), '\\\/');
              routeFragment = this.routeFragmentNameRegExp(routeFragment);
            }

            match = routeFragment.test(pathFragments[routeFragmentIndex]);

            if (match === true && routeFragmentIndex === pathFragments.length - 1) {
              routeData.location.route = {
                name: routePath,
                fragments: routeFragments
              };
              routeData.controller = routeSettings;
              return routeSettings;
            }
          }
        })[0];
      }
    });
    return routeData;
  }

  get _enabled() {
    return this.enabled || false;
  }

  set _enabled(enabled) {
    this.enabled = enabled;
  }

  get _routes() {
    this.routes = this.routes ? this.routes : {};
    return this.routes;
  }

  set _routes(routes) {
    this.routes = MVC.Utils.addPropertiesToObject(routes, this._routes);
  }

  get _controller() {
    return this.controller;
  }

  set _controller(controller) {
    this.controller = controller;
  }

  get _previousURL() {
    return this.previousURL;
  }

  set _previousURL(previousURL) {
    this.previousURL = previousURL;
  }

  get _currentURL() {
    return this.currentURL;
  }

  set _currentURL(currentURL) {
    if (this.currentURL) this._previousURL = this.currentURL;
    this.currentURL = currentURL;
  }

  get fragmentIDRegExp() {
    return new RegExp(/^([0-9A-Z\?\=\,\.\*\-\_\'\"\^\%\$\#\@\!\~\(\)\{\}\&\<\>\\\/])*$/, 'gi');
  }

  routeFragmentNameRegExp(fragment) {
    return new RegExp('^'.concat(fragment, '$'));
  }

  enable() {
    if (!this.enabled) {
      this.enableEmitters();
      this.enableEvents();
      this.enableRoutes();
      this._enabled = true;
    }

    return this;
  }

  disable() {
    if (this.enabled) {
      this.disableEvents();
      this.disableRoutes();
      this.disableEmitters();
      this._enabled = false;
    }
  }

  enableRoutes() {
    if (this.settings.controller) this._controller = this.settings.controller;
    this._routes = Object.entries(this.settings.routes).reduce((_routes, _ref2, routeIndex, originalRoutes) => {
      var [routePath, routeSettings] = _ref2;
      _routes[routePath] = Object.assign(routeSettings, {
        callback: this.controller[routeSettings.callback].bind(this.controller)
      });
      return _routes;
    }, {});
    return this;
  }

  enableEmitters() {
    this._emitters = {
      navigateEmitter: new MVC.Emitters.Navigate()
    };
    return this;
  }

  disableEmitters() {
    delete this._emitters.navigateEmitter;
  }

  disableRoutes() {
    delete this._routes;
    delete this._controller;
  }

  enableEvents() {
    window.addEventListener('hashchange', this.routeChange.bind(this));
    return this;
  }

  disableEvents() {
    window.removeEventListener('hashchange', this.routeChange.bind(this));
  }

  routeChange() {
    this._currentURL = window.location.href;
    var routeData = this._routeData;

    if (routeData.controller) {
      var navigateEmitter = this.emitters.navigateEmitter;
      if (this.previousURL) routeData.previousURL = this.previousURL;
      navigateEmitter.unset().set(routeData);
      this.emit(navigateEmitter.name, navigateEmitter.emission());
      routeData.controller.callback(navigateEmitter.emission());
    }

    return this;
  }

  navigate(path) {
    window.location.href = path;
  }

};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1WQy5qcyIsIkNvbnN0YW50cy5qcyIsIkV2ZW50cy5qcyIsIk9wZXJhdG9ycy5qcyIsImluZGV4LmpzIiwiaXMuanMiLCJ0eXBlT2YuanMiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QuanMiLCJvYmplY3RRdWVyeS5qcyIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMuanMiLCJ2YWxpZGF0ZURhdGFTY2hlbWEuanMiLCJDaGFubmVscy5qcyIsIkNoYW5uZWwuanMiLCJCYXNlLmpzIiwiU2VydmljZS5qcyIsIk1vZGVsLmpzIiwiRW1pdHRlci5qcyIsIk5hdmlnYXRlLmpzIiwiVmlldy5qcyIsIkNvbnRyb2xsZXIuanMiLCJSb3V0ZXIuanMiXSwibmFtZXMiOlsiTVZDIiwiQ29uc3RhbnRzIiwiQ09OU1QiLCJFdmVudHMiLCJFViIsIk9wZXJhdG9ycyIsIkNvbXBhcmlzb24iLCJFUSIsIlNURVEiLCJOT0VRIiwiU1ROT0VRIiwiR1QiLCJMVCIsIkdURSIsIkxURSIsIlN0YXRlbWVudCIsIkFORCIsIk9SIiwiY29uc29sZSIsImxvZyIsIlV0aWxzIiwiaXNBcnJheSIsIm9iamVjdCIsIkFycmF5IiwiaXNPYmplY3QiLCJ0eXBlT2YiLCJ2YWx1ZSIsInZhbHVlQSIsInVuZGVmaW5lZCIsImlzSFRNTEVsZW1lbnQiLCJIVE1MRWxlbWVudCIsImRhdGEiLCJfb2JqZWN0IiwiYWRkUHJvcGVydGllc1RvT2JqZWN0IiwidGFyZ2V0T2JqZWN0IiwiYXJndW1lbnRzIiwibGVuZ3RoIiwicHJvcGVydGllcyIsInByb3BlcnR5TmFtZSIsInByb3BlcnR5VmFsdWUiLCJPYmplY3QiLCJlbnRyaWVzIiwib2JqZWN0UXVlcnkiLCJzdHJpbmciLCJjb250ZXh0Iiwic3RyaW5nRGF0YSIsInBhcnNlTm90YXRpb24iLCJzcGxpY2UiLCJyZWR1Y2UiLCJmcmFnbWVudCIsImZyYWdtZW50SW5kZXgiLCJmcmFnbWVudHMiLCJwYXJzZUZyYWdtZW50IiwicHJvcGVydHlLZXkiLCJtYXRjaCIsImNvbmNhdCIsImNoYXJBdCIsInNsaWNlIiwic3BsaXQiLCJSZWdFeHAiLCJ0b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzIiwidG9nZ2xlTWV0aG9kIiwiZXZlbnRzIiwidGFyZ2V0T2JqZWN0cyIsImNhbGxiYWNrcyIsImV2ZW50U2V0dGluZ3MiLCJldmVudENhbGxiYWNrTmFtZSIsImV2ZW50RGF0YSIsImV2ZW50VGFyZ2V0U2V0dGluZ3MiLCJldmVudE5hbWUiLCJldmVudFRhcmdldHMiLCJldmVudFRhcmdldE5hbWUiLCJldmVudFRhcmdldCIsImV2ZW50TWV0aG9kTmFtZSIsIk5vZGVMaXN0IiwiRG9jdW1lbnQiLCJldmVudENhbGxiYWNrIiwiX2V2ZW50VGFyZ2V0IiwiYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyIsInVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzIiwidmFsaWRhdGVEYXRhU2NoZW1hIiwic2NoZW1hIiwidmFsaWRhdGlvblN1bW1hcnkiLCJmb3JFYWNoIiwic2NoZW1hS2V5Iiwic2NoZW1hU2V0dGluZ3MiLCJ2YWxpZGF0aW9uIiwia2V5IiwicmVxdWlyZWQiLCJ0eXBlIiwiZXZhbHVhdGlvbnMiLCJ2YWxpZGF0aW9uRXZhbHVhdGlvbnMiLCJldmFsdWF0aW9uUmVzdWx0cyIsIm1lc3NhZ2VzIiwiYXNzaWduIiwicGFzcyIsImZhaWwiLCJjb21wYXJhdG9yIiwicmVzdWx0IiwibWVzc2FnZSIsIl9ldmFsdWF0aW9ucyIsImV2YWx1YXRpb24iLCJldmFsdWF0aW9uSW5kZXgiLCJwdXNoIiwidmFsdWVDb21wYXJpc29uIiwiY29tcGFyZVZhbHVlcyIsImNvbXBhcmlzb24iLCJyZXN1bHRzIiwiY3VycmVudEV2YWx1YXRpb24iLCJzdGF0ZW1lbnQiLCJwcmV2aW91c0V2YWx1YXRpb24iLCJwcmV2aW91c0V2YWx1YXRpb25Db21wYXJpc29uVmFsdWUiLCJzdGF0ZW1lbnRDb21wYXJpc29uIiwiY29tcGFyZVN0YXRlbWVudHMiLCJldmFsdWF0aW9uVmFsaWRhdGlvbiIsIm9wZXJhdG9yIiwiZXZhbHVhdGlvblJlc3VsdCIsImNvbnN0cnVjdG9yIiwiX2V2ZW50cyIsImV2ZW50Q2FsbGJhY2tzIiwibmFtZSIsImV2ZW50Q2FsbGJhY2tHcm91cCIsIm9uIiwib2ZmIiwiZW1pdCIsImV2ZW50Q2FsbGJhY2tHcm91cE5hbWUiLCJhZGRpdGlvbmFsQXJndW1lbnRzIiwidmFsdWVzIiwiQ2hhbm5lbHMiLCJfY2hhbm5lbHMiLCJjaGFubmVscyIsImNoYW5uZWwiLCJjaGFubmVsTmFtZSIsIkNoYW5uZWwiLCJfcmVzcG9uc2VzIiwicmVzcG9uc2VzIiwicmVzcG9uc2UiLCJyZXNwb25zZU5hbWUiLCJyZXNwb25zZUNhbGxiYWNrIiwicmVxdWVzdCIsInJlcXVlc3REYXRhIiwia2V5cyIsIkJhc2UiLCJzZXR0aW5ncyIsImNvbmZpZ3VyYXRpb24iLCJfY29uZmlndXJhdGlvbiIsIl9zZXR0aW5ncyIsIl9lbWl0dGVycyIsImVtaXR0ZXJzIiwiU2VydmljZSIsIl9kZWZhdWx0cyIsImRlZmF1bHRzIiwiY29udGVudFR5cGUiLCJyZXNwb25zZVR5cGUiLCJfcmVzcG9uc2VUeXBlcyIsIl9yZXNwb25zZVR5cGUiLCJfeGhyIiwiZmluZCIsInJlc3BvbnNlVHlwZUl0ZW0iLCJfdHlwZSIsIl91cmwiLCJ1cmwiLCJfaGVhZGVycyIsImhlYWRlcnMiLCJoZWFkZXIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwiX2RhdGEiLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIl9lbmFibGVkIiwiZW5hYmxlZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3RhdHVzIiwiYWJvcnQiLCJvcGVuIiwib25sb2FkIiwib25lcnJvciIsInNlbmQiLCJ0aGVuIiwiY3VycmVudFRhcmdldCIsImNhdGNoIiwiZXJyb3IiLCJlbmFibGUiLCJkaXNhYmxlIiwiTW9kZWwiLCJfaXNTZXR0aW5nIiwiaXNTZXR0aW5nIiwiX2NoYW5naW5nIiwiY2hhbmdpbmciLCJfbG9jYWxTdG9yYWdlIiwibG9jYWxTdG9yYWdlIiwiX3NjaGVtYSIsIl9oaXN0aW9ncmFtIiwiaGlzdGlvZ3JhbSIsIl9oaXN0b3J5IiwiaGlzdG9yeSIsInVuc2hpZnQiLCJwYXJzZSIsIl9kYiIsImRiIiwiZ2V0SXRlbSIsImVuZHBvaW50IiwiSlNPTiIsInN0cmluZ2lmeSIsInNldEl0ZW0iLCJfZGF0YUV2ZW50cyIsImRhdGFFdmVudHMiLCJfZGF0YUNhbGxiYWNrcyIsImRhdGFDYWxsYmFja3MiLCJfc2VydmljZXMiLCJzZXJ2aWNlcyIsIl9zZXJ2aWNlRXZlbnRzIiwic2VydmljZUV2ZW50cyIsIl9zZXJ2aWNlQ2FsbGJhY2tzIiwic2VydmljZUNhbGxiYWNrcyIsImVuYWJsZVNlcnZpY2VFdmVudHMiLCJkaXNhYmxlU2VydmljZUV2ZW50cyIsImVuYWJsZURhdGFFdmVudHMiLCJkaXNhYmxlRGF0YUV2ZW50cyIsInNldERlZmF1bHRzIiwic2V0IiwiZ2V0IiwiX2FyZ3VtZW50cyIsImluZGV4Iiwic2V0RGF0YVByb3BlcnR5Iiwic2V0REIiLCJ1bnNldCIsInVuc2V0RGF0YVByb3BlcnR5IiwidW5zZXREQiIsImRlZmluZVByb3BlcnRpZXMiLCJjb25maWd1cmFibGUiLCJzZXRWYWx1ZUV2ZW50TmFtZSIsImpvaW4iLCJzZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlRXZlbnROYW1lIiwidW5zZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlIiwiRW1pdHRlciIsIl9uYW1lIiwiZW1pc3Npb24iLCJFbWl0dGVycyIsIk5hdmlnYXRlIiwiYWRkU2V0dGluZ3MiLCJvbGRVUkwiLCJTdHJpbmciLCJuZXdVUkwiLCJjdXJyZW50Um91dGUiLCJjdXJyZW50Q29udHJvbGxlciIsIlZpZXciLCJfZWxlbWVudE5hbWUiLCJfZWxlbWVudCIsInRhZ05hbWUiLCJlbGVtZW50TmFtZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZWxlbWVudE9ic2VydmVyIiwib2JzZXJ2ZSIsInN1YnRyZWUiLCJjaGlsZExpc3QiLCJfYXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVLZXkiLCJhdHRyaWJ1dGVWYWx1ZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsIl91aSIsInVpIiwidWlLZXkiLCJ1aVZhbHVlIiwicXVlcnlTZWxlY3RvckFsbCIsIl91aUV2ZW50cyIsInVpRXZlbnRzIiwiX3VpQ2FsbGJhY2tzIiwidWlDYWxsYmFja3MiLCJfb2JzZXJ2ZXJDYWxsYmFja3MiLCJvYnNlcnZlckNhbGxiYWNrcyIsIl9lbGVtZW50T2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZWxlbWVudE9ic2VydmUiLCJiaW5kIiwiX2luc2VydCIsImluc2VydCIsIl90ZW1wbGF0ZXMiLCJ0ZW1wbGF0ZXMiLCJtdXRhdGlvblJlY29yZExpc3QiLCJvYnNlcnZlciIsIm11dGF0aW9uUmVjb3JkSW5kZXgiLCJtdXRhdGlvblJlY29yZCIsIm11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcyIsIm11dGF0aW9uUmVjb3JkQ2F0ZWdvcnkiLCJyZXNldFVJIiwiYXV0b0luc2VydCIsImluc2VydEFkamFjZW50RWxlbWVudCIsIm1ldGhvZCIsImF1dG9SZW1vdmUiLCJwYXJlbnRFbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJlbmFibGVFbGVtZW50IiwiZGlzYWJsZUVsZW1lbnQiLCJkaXNhYmxlVUkiLCJlbmFibGVVSSIsImVuYWJsZVVJRXZlbnRzIiwiZGlzYWJsZVVJRXZlbnRzIiwiZW5hYmxlRW1pdHRlcnMiLCJkaXNhYmxlRW1pdHRlcnMiLCJ0aGlzcyIsIkNvbnRyb2xsZXIiLCJfZW1pdHRlckNhbGxiYWNrcyIsImVtaXR0ZXJDYWxsYmFja3MiLCJfbW9kZWxDYWxsYmFja3MiLCJtb2RlbENhbGxiYWNrcyIsIl92aWV3Q2FsbGJhY2tzIiwidmlld0NhbGxiYWNrcyIsIl9jb250cm9sbGVyQ2FsbGJhY2tzIiwiY29udHJvbGxlckNhbGxiYWNrcyIsIl9tb2RlbHMiLCJtb2RlbHMiLCJfdmlld3MiLCJ2aWV3cyIsIl9jb250cm9sbGVycyIsImNvbnRyb2xsZXJzIiwiX3JvdXRlcnMiLCJyb3V0ZXJzIiwiX3JvdXRlckV2ZW50cyIsInJvdXRlckV2ZW50cyIsIl9yb3V0ZXJDYWxsYmFja3MiLCJyb3V0ZXJDYWxsYmFja3MiLCJfZW1pdHRlckV2ZW50cyIsImVtaXR0ZXJFdmVudHMiLCJfbW9kZWxFdmVudHMiLCJtb2RlbEV2ZW50cyIsIl92aWV3RXZlbnRzIiwidmlld0V2ZW50cyIsIl9jb250cm9sbGVyRXZlbnRzIiwiY29udHJvbGxlckV2ZW50cyIsImVuYWJsZU1vZGVsRXZlbnRzIiwiZGlzYWJsZU1vZGVsRXZlbnRzIiwiZW5hYmxlVmlld0V2ZW50cyIsImRpc2FibGVWaWV3RXZlbnRzIiwiZW5hYmxlQ29udHJvbGxlckV2ZW50cyIsImRpc2FibGVDb250cm9sbGVyRXZlbnRzIiwiZW5hYmxlRW1pdHRlckV2ZW50cyIsImRpc2FibGVFbWl0dGVyRXZlbnRzIiwiZW5hYmxlUm91dGVyRXZlbnRzIiwiZGlzYWJsZVJvdXRlckV2ZW50cyIsInJlc2V0IiwiUm91dGVyIiwicHJvdG9jb2wiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhvc3RuYW1lIiwicG9ydCIsInBhdGgiLCJwYXRobmFtZSIsImhhc2giLCJocmVmIiwiaGFzaEluZGV4IiwiaW5kZXhPZiIsInBhcmFtSW5kZXgiLCJzbGljZVN0YXJ0Iiwic2xpY2VTdG9wIiwicGFyYW1zIiwiX3JvdXRlRGF0YSIsInJvdXRlRGF0YSIsImNvbnRyb2xsZXIiLCJmaWx0ZXIiLCJoYXNoRnJhZ21lbnRzIiwicGFyYW1EYXRhIiwicGFyYW1zVG9PYmplY3QiLCJjdXJyZW50VVJMIiwicm91dGVDb250cm9sbGVyRGF0YSIsIl9yb3V0ZUNvbnRyb2xsZXJEYXRhIiwicm91dGVzIiwicm91dGVQYXRoIiwicm91dGVTZXR0aW5ncyIsInBhdGhGcmFnbWVudHMiLCJyb3V0ZUZyYWdtZW50cyIsInJvdXRlRnJhZ21lbnQiLCJyb3V0ZUZyYWdtZW50SW5kZXgiLCJjdXJyZW50SURLZXkiLCJyZXBsYWNlIiwiZnJhZ21lbnRJRFJlZ0V4cCIsInJvdXRlRnJhZ21lbnROYW1lUmVnRXhwIiwidGVzdCIsInJvdXRlIiwiX3JvdXRlcyIsIl9jb250cm9sbGVyIiwiX3ByZXZpb3VzVVJMIiwicHJldmlvdXNVUkwiLCJfY3VycmVudFVSTCIsImVuYWJsZUV2ZW50cyIsImVuYWJsZVJvdXRlcyIsImRpc2FibGVFdmVudHMiLCJkaXNhYmxlUm91dGVzIiwicm91dGVJbmRleCIsIm9yaWdpbmFsUm91dGVzIiwiY2FsbGJhY2siLCJuYXZpZ2F0ZUVtaXR0ZXIiLCJhZGRFdmVudExpc3RlbmVyIiwicm91dGVDaGFuZ2UiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibmF2aWdhdGUiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLEVBQWpCO0FDQUFBLEdBQUcsQ0FBQ0MsU0FBSixHQUFnQixFQUFoQjtBQUNBRCxHQUFHLENBQUNFLEtBQUosR0FBWUYsR0FBRyxDQUFDQyxTQUFoQjtBQ0RBRCxHQUFHLENBQUNDLFNBQUosQ0FBY0UsTUFBZCxHQUF1QixFQUF2QjtBQUNBSCxHQUFHLENBQUNFLEtBQUosQ0FBVUUsRUFBVixHQUFlSixHQUFHLENBQUNDLFNBQUosQ0FBY0UsTUFBN0I7QUNEQUgsR0FBRyxDQUFDQyxTQUFKLENBQWNJLFNBQWQsR0FBMEIsRUFBMUI7QUFDQUwsR0FBRyxDQUFDRSxLQUFKLENBQVVHLFNBQVYsR0FBc0IsRUFBdEI7QUFDQUwsR0FBRyxDQUFDRSxLQUFKLENBQVVHLFNBQVYsQ0FBb0JDLFVBQXBCLEdBQWlDO0FBQy9CQyxFQUFBQSxFQUFFLEVBQUUsSUFEMkI7QUFFL0JDLEVBQUFBLElBQUksRUFBRSxNQUZ5QjtBQUcvQkMsRUFBQUEsSUFBSSxFQUFFLE1BSHlCO0FBSS9CQyxFQUFBQSxNQUFNLEVBQUUsUUFKdUI7QUFLL0JDLEVBQUFBLEVBQUUsRUFBRSxJQUwyQjtBQU0vQkMsRUFBQUEsRUFBRSxFQUFFLElBTjJCO0FBTy9C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LElBQWpCLENBQXNCLElBQXRCLENBQXpDO0FBQ0Q7O0FBQ0R3SCxFQUFBQSxXQUFXLEdBQUc7QUFDWixTQUFLVixXQUFMLEdBQW1CekMsTUFBTSxDQUFDQyxRQUFQLENBQWdCTSxJQUFuQztBQUNBLFFBQUlRLFNBQVMsR0FBRyxLQUFLRCxVQUFyQjs7QUFDQSxRQUFHQyxTQUFTLENBQUNDLFVBQWIsRUFBeUI7QUFDdkIsVUFBSWlDLGVBQWUsR0FBRyxLQUFLN1AsUUFBTCxDQUFjNlAsZUFBcEM7QUFDQSxVQUFHLEtBQUtULFdBQVIsRUFBcUJ6QixTQUFTLENBQUN5QixXQUFWLEdBQXdCLEtBQUtBLFdBQTdCO0FBQ3JCUyxNQUFBQSxlQUFlLENBQ1o3SyxLQURILEdBRUdOLEdBRkgsQ0FFT2lKLFNBRlA7QUFHQSxXQUFLblAsSUFBTCxDQUNFcVIsZUFBZSxDQUFDelIsSUFEbEIsRUFFRXlSLGVBQWUsQ0FBQ2hLLFFBQWhCLEVBRkY7QUFJQThILE1BQUFBLFNBQVMsQ0FBQ0MsVUFBVixDQUFxQmdDLFFBQXJCLENBQ0VDLGVBQWUsQ0FBQ2hLLFFBQWhCLEVBREY7QUFHRDs7QUFDRCxXQUFPLElBQVA7QUFDRDs7QUFDRG9LLEVBQUFBLFFBQVEsQ0FBQ2pELElBQUQsRUFBTztBQUNiSixJQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JNLElBQWhCLEdBQXVCSCxJQUF2QjtBQUNEOztBQXBSaUMsQ0FBcEMiLCJmaWxlIjoiYnJvd3Nlci9tdmMtZnJhbWV3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE1WQyA9IE1WQyB8fCB7fVxyXG4iLCJNVkMuQ29uc3RhbnRzID0ge31cbk1WQy5DT05TVCA9IE1WQy5Db25zdGFudHNcbiIsIk1WQy5FdmVudHMgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfZXZlbnRzKCkge1xyXG4gICAgdGhpcy5ldmVudHMgPSAodGhpcy5ldmVudHMpXHJcbiAgICAgID8gdGhpcy5ldmVudHNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzXHJcbiAgfVxyXG4gIGV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSkgeyByZXR1cm4gdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gfHwge30gfVxyXG4gIGV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIHJldHVybiAoZXZlbnRDYWxsYmFjay5uYW1lLmxlbmd0aClcclxuICAgICAgPyBldmVudENhbGxiYWNrLm5hbWVcclxuICAgICAgOiAnYW5vbnltb3VzRnVuY3Rpb24nXHJcbiAgfVxyXG4gIGV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpIHtcclxuICAgIHJldHVybiBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gfHwgW11cclxuICB9XHJcbiAgb24oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKSB7XHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja3MgPSB0aGlzLmV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSlcclxuICAgIGxldCBldmVudENhbGxiYWNrTmFtZSA9IHRoaXMuZXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgIGxldCBldmVudENhbGxiYWNrR3JvdXAgPSB0aGlzLmV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpXHJcbiAgICBldmVudENhbGxiYWNrR3JvdXAucHVzaChldmVudENhbGxiYWNrKVxyXG4gICAgZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdID0gZXZlbnRDYWxsYmFja0dyb3VwXHJcbiAgICB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSA9IGV2ZW50Q2FsbGJhY2tzXHJcbiAgfVxyXG4gIG9mZigpIHtcclxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrTmFtZSA9IHRoaXMuZXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1bZXZlbnRDYWxsYmFja05hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICB9XHJcbiAgZW1pdChldmVudE5hbWUsIGV2ZW50RGF0YSkge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5ldmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBmb3IobGV0IFtldmVudENhbGxiYWNrR3JvdXBOYW1lLCBldmVudENhbGxiYWNrR3JvdXBdIG9mIE9iamVjdC5lbnRyaWVzKGV2ZW50Q2FsbGJhY2tzKSkge1xyXG4gICAgICBmb3IobGV0IGV2ZW50Q2FsbGJhY2sgb2YgZXZlbnRDYWxsYmFja0dyb3VwKSB7XHJcbiAgICAgICAgbGV0IGFkZGl0aW9uYWxBcmd1bWVudHMgPSBPYmplY3QudmFsdWVzKGFyZ3VtZW50cykuc3BsaWNlKDIpIHx8IFtdXHJcbiAgICAgICAgZXZlbnRDYWxsYmFjayhldmVudERhdGEsIC4uLmFkZGl0aW9uYWxBcmd1bWVudHMpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiTVZDLkNvbnN0YW50cy5PcGVyYXRvcnMgPSB7fVxyXG5NVkMuQ09OU1QuT3BlcmF0b3JzID0ge31cclxuTVZDLkNPTlNULk9wZXJhdG9ycy5Db21wYXJpc29uID0ge1xyXG4gIEVROiAnRVEnLFxyXG4gIFNURVE6ICdTVEVRJyxcclxuICBOT0VROiAnTk9FUScsXHJcbiAgU1ROT0VROiAnU1ROT0VRJyxcclxuICBHVDogJ0dUJyxcclxuICBMVDogJ0xUJyxcclxuICBHVEU6ICdHVEUnLFxyXG4gIExURTogJ0xURScsXHJcbn1cclxuTVZDLkNPTlNULk9wZXJhdG9ycy5TdGF0ZW1lbnQgPSB7XHJcbiAgQU5EOiAnQU5EJyxcclxuICBPUjogJ09SJ1xyXG59XHJcbmNvbnNvbGUubG9nKE1WQy5DT05TVClcclxuIiwiTVZDLkVtaXR0ZXJzID0ge31cclxuIiwiTVZDLlV0aWxzLmlzQXJyYXkgPSBmdW5jdGlvbiBpc0FycmF5KG9iamVjdCkgeyByZXR1cm4gQXJyYXkuaXNBcnJheShvYmplY3QpIH1cclxuTVZDLlV0aWxzLmlzT2JqZWN0ID0gZnVuY3Rpb24gaXNPYmplY3Qob2JqZWN0KSB7XHJcbiAgcmV0dXJuIChcclxuICAgICFBcnJheS5pc0FycmF5KG9iamVjdCkgJiZcclxuICAgIG9iamVjdCAhPT0gbnVsbFxyXG4gICkgPyB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0J1xyXG4gICAgOiBmYWxzZVxyXG59XHJcbk1WQy5VdGlscy50eXBlT2YgPSBmdW5jdGlvbiB0eXBlT2YodmFsdWUpIHtcclxuICByZXR1cm4gKHR5cGVvZiB2YWx1ZUEgPT09ICdvYmplY3QnKVxyXG4gICAgPyAoTVZDLlV0aWxzLmlzT2JqZWN0KHZhbHVlQSkpXHJcbiAgICAgID8gJ29iamVjdCdcclxuICAgICAgOiAoTVZDLlV0aWxzLmlzQXJyYXkodmFsdWVBKSlcclxuICAgICAgICA/ICdhcnJheSdcclxuICAgICAgICA6ICh2YWx1ZUEgPT09IG51bGwpXHJcbiAgICAgICAgICA/ICdudWxsJ1xyXG4gICAgICAgICAgOiB1bmRlZmluZWRcclxuICAgIDogdHlwZW9mIHZhbHVlXHJcbn1cclxuTVZDLlV0aWxzLmlzSFRNTEVsZW1lbnQgPSBmdW5jdGlvbiBpc0hUTUxFbGVtZW50KG9iamVjdCkge1xyXG4gIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxyXG59XHJcbiIsIk1WQy5VdGlscy50eXBlT2YgPSAgZnVuY3Rpb24gdHlwZU9mKGRhdGEpIHtcclxuICBzd2l0Y2godHlwZW9mIGRhdGEpIHtcclxuICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgIGxldCBfb2JqZWN0XHJcbiAgICAgIGlmKE1WQy5VdGlscy5pc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgLy8gQXJyYXlcclxuICAgICAgICByZXR1cm4gJ2FycmF5J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgTVZDLlV0aWxzLmlzT2JqZWN0KGRhdGEpXHJcbiAgICAgICkge1xyXG4gICAgICAgIC8vIE9iamVjdFxyXG4gICAgICAgIHJldHVybiAnb2JqZWN0J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgZGF0YSA9PT0gbnVsbFxyXG4gICAgICApIHtcclxuICAgICAgICAvLyBOdWxsXHJcbiAgICAgICAgcmV0dXJuICdudWxsJ1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBfb2JqZWN0XHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgY2FzZSAnbnVtYmVyJzpcclxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgcmV0dXJuIHR5cGVvZiBkYXRhXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QgPSBmdW5jdGlvbiBhZGRQcm9wZXJ0aWVzVG9PYmplY3QoKSB7XHJcbiAgbGV0IHRhcmdldE9iamVjdFxyXG4gIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICBjYXNlIDI6XHJcbiAgICAgIGxldCBwcm9wZXJ0aWVzID0gYXJndW1lbnRzWzBdXHJcbiAgICAgIHRhcmdldE9iamVjdCA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICBmb3IobGV0IFtwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BlcnRpZXMpKSB7XHJcbiAgICAgICAgdGFyZ2V0T2JqZWN0W3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlXHJcbiAgICAgIH1cclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgMzpcclxuICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICBsZXQgcHJvcGVydHlWYWx1ZSA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICB0YXJnZXRPYmplY3QgPSBhcmd1bWVudHNbMl1cclxuICAgICAgdGFyZ2V0T2JqZWN0W3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIHJldHVybiB0YXJnZXRPYmplY3RcclxufVxyXG4iLCJNVkMuVXRpbHMub2JqZWN0UXVlcnkgPSBmdW5jdGlvbiBvYmplY3RRdWVyeShcclxuICBzdHJpbmcsXHJcbiAgY29udGV4dFxyXG4pIHtcclxuICBsZXQgc3RyaW5nRGF0YSA9IE1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZU5vdGF0aW9uKHN0cmluZylcclxuICBpZihzdHJpbmdEYXRhWzBdID09PSAnQCcpIHN0cmluZ0RhdGEuc3BsaWNlKDAsIDEpXHJcbiAgaWYoIXN0cmluZ0RhdGEubGVuZ3RoKSByZXR1cm4gY29udGV4dFxyXG4gIGNvbnRleHQgPSAoTVZDLlV0aWxzLmlzT2JqZWN0KGNvbnRleHQpKVxyXG4gICAgPyBPYmplY3QuZW50cmllcyhjb250ZXh0KVxyXG4gICAgOiBjb250ZXh0XHJcbiAgcmV0dXJuIHN0cmluZ0RhdGEucmVkdWNlKChvYmplY3QsIGZyYWdtZW50LCBmcmFnbWVudEluZGV4LCBmcmFnbWVudHMpID0+IHtcclxuICAgIGxldCBwcm9wZXJ0aWVzID0gW11cclxuICAgIGZyYWdtZW50ID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlRnJhZ21lbnQoZnJhZ21lbnQpXHJcbiAgICBmb3IobGV0IFtwcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV0gb2Ygb2JqZWN0KSB7XHJcbiAgICAgIGlmKHByb3BlcnR5S2V5Lm1hdGNoKGZyYWdtZW50KSkge1xyXG4gICAgICAgIGlmKGZyYWdtZW50SW5kZXggPT09IGZyYWdtZW50cy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoW1twcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV1dKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoT2JqZWN0LmVudHJpZXMocHJvcGVydHlWYWx1ZSkpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBvYmplY3QgPSBwcm9wZXJ0aWVzXHJcbiAgICByZXR1cm4gb2JqZWN0XHJcbiAgfSwgY29udGV4dClcclxufVxyXG5NVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VOb3RhdGlvbiA9IGZ1bmN0aW9uIHBhcnNlTm90YXRpb24oc3RyaW5nKSB7XHJcbiAgaWYoXHJcbiAgICBzdHJpbmcuY2hhckF0KDApID09PSAnWycgJiZcclxuICAgIHN0cmluZy5jaGFyQXQoc3RyaW5nLmxlbmd0aCAtIDEpID09ICddJ1xyXG4gICkge1xyXG4gICAgc3RyaW5nID0gc3RyaW5nXHJcbiAgICAgIC5zbGljZSgxLCAtMSlcclxuICAgICAgLnNwbGl0KCddWycpXHJcbiAgfSBlbHNlIHtcclxuICAgIHN0cmluZyA9IHN0cmluZ1xyXG4gICAgICAuc3BsaXQoJy4nKVxyXG4gIH1cclxuICByZXR1cm4gc3RyaW5nXHJcbn1cclxuTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlRnJhZ21lbnQgPSBmdW5jdGlvbiBwYXJzZUZyYWdtZW50KGZyYWdtZW50KSB7XHJcbiAgaWYoXHJcbiAgICBmcmFnbWVudC5jaGFyQXQoMCkgPT09ICcvJyAmJlxyXG4gICAgZnJhZ21lbnQuY2hhckF0KGZyYWdtZW50Lmxlbmd0aCAtIDEpID09ICcvJ1xyXG4gICkge1xyXG4gICAgZnJhZ21lbnQgPSBmcmFnbWVudC5zbGljZSgxLCAtMSlcclxuICAgIGZyYWdtZW50ID0gbmV3IFJlZ0V4cCgnXicuY29uY2F0KGZyYWdtZW50LCAnJCcpKVxyXG4gIH1cclxuICByZXR1cm4gZnJhZ21lbnRcclxufVxyXG4iLCJNVkMuVXRpbHMudG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIHRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoXHJcbiAgdG9nZ2xlTWV0aG9kLFxyXG4gIGV2ZW50cyxcclxuICB0YXJnZXRPYmplY3RzLFxyXG4gIGNhbGxiYWNrc1xyXG4pIHtcclxuICBmb3IobGV0IFtldmVudFNldHRpbmdzLCBldmVudENhbGxiYWNrTmFtZV0gb2YgT2JqZWN0LmVudHJpZXMoZXZlbnRzKSkge1xyXG4gICAgbGV0IGV2ZW50RGF0YSA9IGV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxyXG4gICAgbGV0IGV2ZW50VGFyZ2V0U2V0dGluZ3MgPSBldmVudERhdGFbMF1cclxuICAgIGxldCBldmVudE5hbWUgPSBldmVudERhdGFbMV1cclxuICAgIGxldCBldmVudFRhcmdldHMgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkoXHJcbiAgICAgIGV2ZW50VGFyZ2V0U2V0dGluZ3MsXHJcbiAgICAgIHRhcmdldE9iamVjdHNcclxuICAgIClcclxuICAgIGV2ZW50VGFyZ2V0cyA9ICghTVZDLlV0aWxzLmlzQXJyYXkoZXZlbnRUYXJnZXRzKSlcclxuICAgICAgPyBbWydAJywgZXZlbnRUYXJnZXRzXV1cclxuICAgICAgOiBldmVudFRhcmdldHNcclxuICAgIGZvcihsZXQgW2V2ZW50VGFyZ2V0TmFtZSwgZXZlbnRUYXJnZXRdIG9mIGV2ZW50VGFyZ2V0cykge1xyXG4gICAgICBsZXQgZXZlbnRNZXRob2ROYW1lID0gKHRvZ2dsZU1ldGhvZCA9PT0gJ29uJylcclxuICAgICAgPyAoXHJcbiAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCB8fFxyXG4gICAgICAgIChcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgRG9jdW1lbnRcclxuICAgICAgICApXHJcbiAgICAgICkgPyAnYWRkRXZlbnRMaXN0ZW5lcidcclxuICAgICAgICA6ICdvbidcclxuICAgICAgOiAoXHJcbiAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCB8fFxyXG4gICAgICAgIChcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgRG9jdW1lbnRcclxuICAgICAgICApXHJcbiAgICAgICkgPyAncmVtb3ZlRXZlbnRMaXN0ZW5lcidcclxuICAgICAgICA6ICdvZmYnXHJcbiAgICAgIGxldCBldmVudENhbGxiYWNrID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5KFxyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2tOYW1lLFxyXG4gICAgICAgIGNhbGxiYWNrc1xyXG4gICAgICApWzBdWzFdXHJcbiAgICAgIGlmKGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuICAgICAgICBmb3IobGV0IF9ldmVudFRhcmdldCBvZiBldmVudFRhcmdldCkge1xyXG4gICAgICAgICAgX2V2ZW50VGFyZ2V0W2V2ZW50TWV0aG9kTmFtZV0oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmKGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICBldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5NVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIGJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMoKSB7XHJcbiAgdGhpcy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKCdvbicsIC4uLmFyZ3VtZW50cylcclxufVxyXG5NVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMgPSBmdW5jdGlvbiB1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cygpIHtcclxuICB0aGlzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoJ29mZicsIC4uLmFyZ3VtZW50cylcclxufVxyXG4iLCJNVkMuVXRpbHMudmFsaWRhdGVEYXRhU2NoZW1hID0gZnVuY3Rpb24gdmFsaWRhdGVEYXRhU2NoZW1hKGRhdGEsIHNjaGVtYSkge1xyXG4gIGlmKHNjaGVtYSkge1xyXG4gICAgbGV0IHZhbGlkYXRpb25TdW1tYXJ5ID0ge31cclxuICAgIE9iamVjdC5lbnRyaWVzKHNjaGVtYSlcclxuICAgICAgLmZvckVhY2goKFtzY2hlbWFLZXksIHNjaGVtYVNldHRpbmdzXSkgPT4ge1xyXG4gICAgICAgIGxldCB2YWxpZGF0aW9uID0ge31cclxuICAgICAgICBsZXQgdmFsdWUgPSBkYXRhW3NjaGVtYUtleV1cclxuICAgICAgICB2YWxpZGF0aW9uLmtleSA9IHNjaGVtYUtleVxyXG4gICAgICAgIGlmKHNjaGVtYVNldHRpbmdzLnJlcXVpcmVkKSB7XHJcbiAgICAgICAgICB2YWxpZGF0aW9uLnJlcXVpcmVkID0gTVZDLlV0aWxzLnZhbGlkYXRlRGF0YVNjaGVtYVxyXG4gICAgICAgICAgICAucmVxdWlyZWQodmFsdWUsIHNjaGVtYVNldHRpbmdzLnJlcXVpcmVkKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzY2hlbWFTZXR0aW5ncy50eXBlKSB7XHJcbiAgICAgICAgICB2YWxpZGF0aW9uLnR5cGUgPSBNVkMuVXRpbHMudmFsaWRhdGVEYXRhU2NoZW1hXHJcbiAgICAgICAgICAgIC50eXBlKHZhbHVlLCBzY2hlbWFTZXR0aW5ncy50eXBlKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzY2hlbWFTZXR0aW5ncy5ldmFsdWF0aW9ucykge1xyXG4gICAgICAgICAgbGV0IHZhbGlkYXRpb25FdmFsdWF0aW9ucyA9IE1WQy5VdGlscy52YWxpZGF0ZURhdGFTY2hlbWFcclxuICAgICAgICAgICAgLmV2YWx1YXRpb25zKHZhbHVlLCBzY2hlbWFTZXR0aW5ncy5ldmFsdWF0aW9ucylcclxuICAgICAgICAgIHZhbGlkYXRpb24uZXZhbHVhdGlvbnMgPSBNVkMuVXRpbHMudmFsaWRhdGVEYXRhU2NoZW1hXHJcbiAgICAgICAgICAgIC5ldmFsdWF0aW9uUmVzdWx0cyh2YWxpZGF0aW9uRXZhbHVhdGlvbnMpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhbGlkYXRpb25TdW1tYXJ5W3NjaGVtYUtleV0gPSB2YWxpZGF0aW9uXHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gdmFsaWRhdGlvblN1bW1hcnlcclxuICB9XHJcbn1cclxuXHJcbk1WQy5VdGlscy52YWxpZGF0ZURhdGFTY2hlbWEucmVxdWlyZWQgPSBmdW5jdGlvbiByZXF1aXJlZCh2YWx1ZSwgc2NoZW1hU2V0dGluZ3MpIHtcclxuICBsZXQgdmFsaWRhdGlvblN1bW1hcnkgPSB7XHJcbiAgICB2YWx1ZTogdmFsdWUsXHJcbiAgfVxyXG4gIGxldCBtZXNzYWdlcyA9IE9iamVjdC5hc3NpZ24oXHJcbiAgICB7XHJcbiAgICAgIHBhc3M6ICdWYWx1ZSBpcyBkZWZpbmVkLicsXHJcbiAgICAgIGZhaWw6ICdWYWx1ZSBpcyBub3QgZGVmaW5lZC4nLFxyXG4gICAgfSxcclxuICAgIHNjaGVtYVNldHRpbmdzLm1lc3NhZ2VzXHJcbiAgKVxyXG4gIHZhbHVlID0gKHZhbHVlICE9PSB1bmRlZmluZWQpXHJcbiAgc3dpdGNoKE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hU2V0dGluZ3MpKSB7XHJcbiAgICBjYXNlICdib29sZWFuJzpcclxuICAgICAgdmFsaWRhdGlvblN1bW1hcnkuY29tcGFyYXRvciA9IHNjaGVtYVNldHRpbmdzXHJcbiAgICAgIHZhbGlkYXRpb25TdW1tYXJ5LnJlc3VsdCA9ICh2YWx1ZSA9PT0gc2NoZW1hU2V0dGluZ3MpXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICB2YWxpZGF0aW9uU3VtbWFyeS5jb21wYXJhdG9yID0gc2NoZW1hU2V0dGluZ3MudmFsdWVcclxuICAgICAgdmFsaWRhdGlvblN1bW1hcnkucmVzdWx0ID0gKHZhbHVlID09PSBzY2hlbWFTZXR0aW5ncy52YWx1ZSlcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgdmFsaWRhdGlvblN1bW1hcnkubWVzc2FnZSA9ICh2YWxpZGF0aW9uU3VtbWFyeS5yZXN1bHQpXHJcbiAgICA/IG1lc3NhZ2VzLnBhc3NcclxuICAgIDogbWVzc2FnZXMuZmFpbFxyXG4gIHJldHVybiB2YWxpZGF0aW9uU3VtbWFyeVxyXG59XHJcblxyXG5NVkMuVXRpbHMudmFsaWRhdGVEYXRhU2NoZW1hLnR5cGUgPSBmdW5jdGlvbiByZXF1aXJlZCh2YWx1ZSwgc2NoZW1hU2V0dGluZ3MpIHtcclxuICBsZXQgdmFsaWRhdGlvblN1bW1hcnkgPSB7XHJcbiAgICB2YWx1ZTogdmFsdWVcclxuICB9XHJcbiAgbGV0IG1lc3NhZ2VzID0gT2JqZWN0LmFzc2lnbihcclxuICAgIHtcclxuICAgICAgcGFzczogJ1ZhbGlkIFR5cGUuJyxcclxuICAgICAgZmFpbDogJ0ludmFsaWQgVHlwZS4nLFxyXG4gICAgfSxcclxuICAgIHNjaGVtYVNldHRpbmdzLm1lc3NhZ2VzXHJcbiAgKVxyXG4gIHN3aXRjaChNVkMuVXRpbHMudHlwZU9mKHNjaGVtYVNldHRpbmdzKSkge1xyXG4gICAgY2FzZSAnc3RyaW5nJzpcclxuICAgICAgdmFsaWRhdGlvblN1bW1hcnkuY29tcGFyYXRvclxyXG4gICAgICB2YWxpZGF0aW9uU3VtbWFyeS5yZXN1bHQgPSAoTVZDLlV0aWxzLnR5cGVPZih2YWx1ZSkgPT09IHNjaGVtYVNldHRpbmdzKVxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgdmFsaWRhdGlvblN1bW1hcnkucmVzdWx0ID0gKE1WQy5VdGlscy50eXBlT2YodmFsdWUpID09PSBzY2hlbWFTZXR0aW5ncy52YWx1ZSlcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgdmFsaWRhdGlvblN1bW1hcnkubWVzc2FnZSA9ICh2YWxpZGF0aW9uU3VtbWFyeS5yZXN1bHQpXHJcbiAgICA/IG1lc3NhZ2VzLnBhc3NcclxuICAgIDogbWVzc2FnZXMuZmFpbFxyXG4gIHJldHVybiB2YWxpZGF0aW9uU3VtbWFyeVxyXG59XHJcblxyXG5NVkMuVXRpbHMudmFsaWRhdGVEYXRhU2NoZW1hLmV2YWx1YXRpb25zID0gZnVuY3Rpb24gcmVxdWlyZWQodmFsdWUsIGV2YWx1YXRpb25zKSB7XHJcbiAgcmV0dXJuIGV2YWx1YXRpb25zLnJlZHVjZSgoX2V2YWx1YXRpb25zLCBldmFsdWF0aW9uLCBldmFsdWF0aW9uSW5kZXgpID0+IHtcclxuICAgIGlmKE1WQy5VdGlscy5pc0FycmF5KGV2YWx1YXRpb24pKSB7XHJcbiAgICAgIF9ldmFsdWF0aW9ucy5wdXNoKFxyXG4gICAgICAgIC4uLk1WQy5VdGlscy52YWxpZGF0ZURhdGFTY2hlbWEuZXZhbHVhdGlvbnModmFsdWUsIGV2YWx1YXRpb24pXHJcbiAgICAgIClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGV2YWx1YXRpb24udmFsdWUgPSB2YWx1ZVxyXG4gICAgICBsZXQgdmFsdWVDb21wYXJpc29uID0gTVZDLlV0aWxzLnZhbGlkYXRlRGF0YVNjaGVtYS5jb21wYXJlVmFsdWVzKFxyXG4gICAgICAgIGV2YWx1YXRpb24udmFsdWUsXHJcbiAgICAgICAgZXZhbHVhdGlvbi5jb21wYXJpc29uLnZhbHVlLFxyXG4gICAgICAgIGV2YWx1YXRpb24uY29tcGFyYXRvcixcclxuICAgICAgICBldmFsdWF0aW9uLm1lc3NhZ2VzXHJcbiAgICAgIClcclxuICAgICAgZXZhbHVhdGlvbi5yZXN1bHRzID0gZXZhbHVhdGlvbi5yZXN1bHRzIHx8IHt9XHJcbiAgICAgIGV2YWx1YXRpb24ucmVzdWx0cy52YWx1ZSA9IHZhbHVlQ29tcGFyaXNvblxyXG4gICAgICBfZXZhbHVhdGlvbnMucHVzaChldmFsdWF0aW9uKVxyXG4gICAgfVxyXG4gICAgaWYoX2V2YWx1YXRpb25zLmxlbmd0aCA+IDEpIHtcclxuICAgICAgbGV0IGN1cnJlbnRFdmFsdWF0aW9uID0gX2V2YWx1YXRpb25zW2V2YWx1YXRpb25JbmRleF1cclxuICAgICAgaWYoY3VycmVudEV2YWx1YXRpb24uY29tcGFyaXNvbi5zdGF0ZW1lbnQpIHtcclxuICAgICAgICBsZXQgcHJldmlvdXNFdmFsdWF0aW9uID0gX2V2YWx1YXRpb25zW2V2YWx1YXRpb25JbmRleCAtIDFdXHJcbiAgICAgICAgbGV0IHByZXZpb3VzRXZhbHVhdGlvbkNvbXBhcmlzb25WYWx1ZSA9IChjdXJyZW50RXZhbHVhdGlvbi5yZXN1bHRzLnN0YXRlbWVudClcclxuICAgICAgICAgID8gY3VycmVudEV2YWx1YXRpb24ucmVzdWx0cy5zdGF0ZW1lbnQucmVzdWx0XHJcbiAgICAgICAgICA6IGN1cnJlbnRFdmFsdWF0aW9uLnJlc3VsdHMudmFsdWUucmVzdWx0XHJcbiAgICAgICAgbGV0IHN0YXRlbWVudENvbXBhcmlzb24gPSBNVkMuVXRpbHMudmFsaWRhdGVEYXRhU2NoZW1hLmNvbXBhcmVTdGF0ZW1lbnRzKFxyXG4gICAgICAgICAgcHJldmlvdXNFdmFsdWF0aW9uQ29tcGFyaXNvblZhbHVlLFxyXG4gICAgICAgICAgY3VycmVudEV2YWx1YXRpb24uY29tcGFyaXNvbi5zdGF0ZW1lbnQsXHJcbiAgICAgICAgICBjdXJyZW50RXZhbHVhdGlvbi5yZXN1bHRzLnZhbHVlLnJlc3VsdCxcclxuICAgICAgICAgIGN1cnJlbnRFdmFsdWF0aW9uLm1lc3NhZ2VzXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGN1cnJlbnRFdmFsdWF0aW9uLnJlc3VsdHMgPSBjdXJyZW50RXZhbHVhdGlvbi5yZXN1bHRzIHx8IHt9XHJcbiAgICAgICAgY3VycmVudEV2YWx1YXRpb24ucmVzdWx0cy5zdGF0ZW1lbnQgPSBzdGF0ZW1lbnRDb21wYXJpc29uXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBfZXZhbHVhdGlvbnNcclxuICB9LCBbXSlcclxufVxyXG5cclxuTVZDLlV0aWxzLnZhbGlkYXRlRGF0YVNjaGVtYS5ldmFsdWF0aW9uUmVzdWx0cyA9IGZ1bmN0aW9uIGV2YWx1YXRpb25SZXN1bHRzKGV2YWx1YXRpb25zKSB7XHJcbiAgbGV0IHZhbGlkYXRpb25FdmFsdWF0aW9ucyA9IHtcclxuICAgIHBhc3M6IFtdLFxyXG4gICAgZmFpbDogW10sXHJcbiAgfVxyXG4gIGV2YWx1YXRpb25zLmZvckVhY2goKGV2YWx1YXRpb25WYWxpZGF0aW9uKSA9PiB7XHJcbiAgICBpZihldmFsdWF0aW9uVmFsaWRhdGlvbi5yZXN1bHRzLnN0YXRlbWVudCkge1xyXG4gICAgICBpZihldmFsdWF0aW9uVmFsaWRhdGlvbi5yZXN1bHRzLnN0YXRlbWVudC5yZXN1bHQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgdmFsaWRhdGlvbkV2YWx1YXRpb25zLmZhaWwucHVzaChldmFsdWF0aW9uVmFsaWRhdGlvbilcclxuICAgICAgfSBlbHNlIGlmKGV2YWx1YXRpb25WYWxpZGF0aW9uLnJlc3VsdHMuc3RhdGVtZW50LnJlc3VsdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHZhbGlkYXRpb25FdmFsdWF0aW9ucy5wYXNzLnB1c2goZXZhbHVhdGlvblZhbGlkYXRpb24pXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZihldmFsdWF0aW9uVmFsaWRhdGlvbi5yZXN1bHRzLnZhbHVlKSB7XHJcbiAgICAgIGlmKGV2YWx1YXRpb25WYWxpZGF0aW9uLnJlc3VsdHMudmFsdWUucmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgIHZhbGlkYXRpb25FdmFsdWF0aW9ucy5mYWlsLnB1c2goZXZhbHVhdGlvblZhbGlkYXRpb24pXHJcbiAgICAgIH0gZWxzZSBpZihldmFsdWF0aW9uVmFsaWRhdGlvbi5yZXN1bHRzLnZhbHVlLnJlc3VsdCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHZhbGlkYXRpb25FdmFsdWF0aW9ucy5wYXNzLnB1c2goZXZhbHVhdGlvblZhbGlkYXRpb24pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG4gIHJldHVybiB2YWxpZGF0aW9uRXZhbHVhdGlvbnNcclxufVxyXG5cclxuTVZDLlV0aWxzLnZhbGlkYXRlRGF0YVNjaGVtYS5jb21wYXJlVmFsdWVzID0gZnVuY3Rpb24gY29tcGFyZVZhbHVlcyh2YWx1ZSwgb3BlcmF0b3IsIGNvbXBhcmF0b3IsIG1lc3NhZ2VzKSB7XHJcbiAgbGV0IGV2YWx1YXRpb25SZXN1bHRcclxuICBzd2l0Y2gob3BlcmF0b3IpIHtcclxuICAgIGNhc2UgTVZDLkNPTlNULk9wZXJhdG9ycy5Db21wYXJpc29uLkVROlxyXG4gICAgICBldmFsdWF0aW9uUmVzdWx0ID0gKHZhbHVlID09IGNvbXBhcmF0b3IpXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlIE1WQy5DT05TVC5PcGVyYXRvcnMuQ29tcGFyaXNvbi5TVEVROlxyXG4gICAgICBldmFsdWF0aW9uUmVzdWx0ID0gKHZhbHVlID09PSBjb21wYXJhdG9yKVxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSBNVkMuQ09OU1QuT3BlcmF0b3JzLkNvbXBhcmlzb24uTk9FUTpcclxuICAgICAgZXZhbHVhdGlvblJlc3VsdCA9ICh2YWx1ZSAhPSBjb21wYXJhdG9yKVxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSBNVkMuQ09OU1QuT3BlcmF0b3JzLkNvbXBhcmlzb24uU1ROT0VROlxyXG4gICAgICBldmFsdWF0aW9uUmVzdWx0ID0gKHZhbHVlICE9PSBjb21wYXJhdG9yKVxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSBNVkMuQ09OU1QuT3BlcmF0b3JzLkNvbXBhcmlzb24uR1Q6XHJcbiAgICAgIGV2YWx1YXRpb25SZXN1bHQgPSAodmFsdWUgPiBjb21wYXJhdG9yKVxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSBNVkMuQ09OU1QuT3BlcmF0b3JzLkNvbXBhcmlzb24uTFQ6XHJcbiAgICAgIGV2YWx1YXRpb25SZXN1bHQgPSAodmFsdWUgPCBjb21wYXJhdG9yKVxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSBNVkMuQ09OU1QuT3BlcmF0b3JzLkNvbXBhcmlzb24uR1RFOlxyXG4gICAgICBldmFsdWF0aW9uUmVzdWx0ID0gKHZhbHVlID49IGNvbXBhcmF0b3IpXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlIE1WQy5DT05TVC5PcGVyYXRvcnMuQ29tcGFyaXNvbi5MVEU6XHJcbiAgICAgIGV2YWx1YXRpb25SZXN1bHQgPSAodmFsdWUgPD0gY29tcGFyYXRvcilcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgcmV0dXJuIHtcclxuICAgIHJlc3VsdDogZXZhbHVhdGlvblJlc3VsdCxcclxuICAgIG1lc3NhZ2U6IChldmFsdWF0aW9uUmVzdWx0KVxyXG4gICAgICA/IG1lc3NhZ2VzLnBhc3NcclxuICAgICAgOiBtZXNzYWdlcy5mYWlsXHJcbiAgfVxyXG59XHJcblxyXG5NVkMuVXRpbHMudmFsaWRhdGVEYXRhU2NoZW1hLmNvbXBhcmVTdGF0ZW1lbnRzID0gZnVuY3Rpb24gY29tcGFyZVN0YXRlbWVudHModmFsdWUsIG9wZXJhdG9yLCBjb21wYXJhdG9yLCBtZXNzYWdlcykge1xyXG4gIGxldCBldmFsdWF0aW9uUmVzdWx0XHJcbiAgc3dpdGNoKG9wZXJhdG9yKSB7XHJcbiAgICBjYXNlIE1WQy5DT05TVC5PcGVyYXRvcnMuU3RhdGVtZW50LkFORDpcclxuICAgICAgZXZhbHVhdGlvblJlc3VsdCA9IHZhbHVlICYmIGNvbXBhcmF0b3JcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgTVZDLkNPTlNULk9wZXJhdG9ycy5TdGF0ZW1lbnQuT1I6XHJcbiAgICAgIGV2YWx1YXRpb25SZXN1bHQgPSB2YWx1ZSB8fCBjb21wYXJhdG9yXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIHJldHVybiB7XHJcbiAgICByZXN1bHQ6IGV2YWx1YXRpb25SZXN1bHQsXHJcbiAgICBtZXNzYWdlOiAoZXZhbHVhdGlvblJlc3VsdClcclxuICAgICAgPyBtZXNzYWdlcy5wYXNzXHJcbiAgICAgIDogbWVzc2FnZXMuZmFpbFxyXG4gIH1cclxufVxyXG4iLCJNVkMuQ2hhbm5lbHMgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfY2hhbm5lbHMoKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzID0gKHRoaXMuY2hhbm5lbHMpXHJcbiAgICAgID8gdGhpcy5jaGFubmVsc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsc1xyXG4gIH1cclxuICBjaGFubmVsKGNoYW5uZWxOYW1lKSB7XHJcbiAgICB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0gPSAodGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdKVxyXG4gICAgICA/IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA6IG5ldyBNVkMuQ2hhbm5lbHMuQ2hhbm5lbCgpXHJcbiAgICByZXR1cm4gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG4gIG9mZihjaGFubmVsTmFtZSkge1xyXG4gICAgZGVsZXRlIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxufVxyXG4iLCJNVkMuQ2hhbm5lbHMuQ2hhbm5lbCA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9yZXNwb25zZXMoKSB7XHJcbiAgICB0aGlzLnJlc3BvbnNlcyA9ICh0aGlzLnJlc3BvbnNlcylcclxuICAgICAgPyB0aGlzLnJlc3BvbnNlc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZihyZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdID0gcmVzcG9uc2VDYWxsYmFja1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZV1cclxuICAgIH1cclxuICB9XHJcbiAgcmVxdWVzdChyZXNwb25zZU5hbWUsIHJlcXVlc3REYXRhKSB7XHJcbiAgICBpZih0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0ocmVxdWVzdERhdGEpXHJcbiAgICB9XHJcbiAgfVxyXG4gIG9mZihyZXNwb25zZU5hbWUpIHtcclxuICAgIGlmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvcihsZXQgW3Jlc3BvbnNlTmFtZV0gb2YgT2JqZWN0LmtleXModGhpcy5fcmVzcG9uc2VzKSkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIk1WQy5CYXNlID0gY2xhc3MgZXh0ZW5kcyBNVkMuRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncywgY29uZmlndXJhdGlvbikge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgaWYoY29uZmlndXJhdGlvbikgdGhpcy5fY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb25cclxuICAgIGlmKHNldHRpbmdzKSB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgfVxyXG4gIGdldCBfY29uZmlndXJhdGlvbigpIHtcclxuICAgIHRoaXMuY29uZmlndXJhdGlvbiA9ICh0aGlzLmNvbmZpZ3VyYXRpb24pXHJcbiAgICAgID8gdGhpcy5jb25maWd1cmF0aW9uXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25cclxuICB9XHJcbiAgc2V0IF9jb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHsgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbiB9XHJcbiAgZ2V0IF9zZXR0aW5ncygpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSAodGhpcy5zZXR0aW5ncylcclxuICAgICAgPyB0aGlzLnNldHRpbmdzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLnNldHRpbmdzXHJcbiAgfVxyXG4gIHNldCBfc2V0dGluZ3Moc2V0dGluZ3MpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxyXG4gICAgICBzZXR0aW5ncywgdGhpcy5fc2V0dGluZ3NcclxuICAgIClcclxuICB9XHJcbiAgZ2V0IF9lbWl0dGVycygpIHtcclxuICAgIHRoaXMuZW1pdHRlcnMgPSAodGhpcy5lbWl0dGVycylcclxuICAgICAgPyB0aGlzLmVtaXR0ZXJzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXJzXHJcbiAgfVxyXG4gIHNldCBfZW1pdHRlcnMoZW1pdHRlcnMpIHtcclxuICAgIHRoaXMuZW1pdHRlcnMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxyXG4gICAgICBlbWl0dGVycywgdGhpcy5fZW1pdHRlcnNcclxuICAgIClcclxuICB9XHJcbn1cclxuIiwiTVZDLlNlcnZpY2UgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLmRlZmF1bHRzIHx8IHtcbiAgICBjb250ZW50VHlwZTogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICB9IH1cbiAgZ2V0IF9yZXNwb25zZVR5cGVzKCkgeyByZXR1cm4gWycnLCAnYXJyYXlidWZmZXInLCAnYmxvYicsICdkb2N1bWVudCcsICdqc29uJywgJ3RleHQnXSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlKCkgeyByZXR1cm4gdGhpcy5yZXNwb25zZVR5cGUgfVxuICBzZXQgX3Jlc3BvbnNlVHlwZShyZXNwb25zZVR5cGUpIHtcbiAgICB0aGlzLl94aHIucmVzcG9uc2VUeXBlID0gdGhpcy5fcmVzcG9uc2VUeXBlcy5maW5kKFxuICAgICAgKHJlc3BvbnNlVHlwZUl0ZW0pID0+IHJlc3BvbnNlVHlwZUl0ZW0gPT09IHJlc3BvbnNlVHlwZVxuICAgICkgfHwgdGhpcy5fZGVmYXVsdHMucmVzcG9uc2VUeXBlXG4gIH1cbiAgZ2V0IF90eXBlKCkgeyByZXR1cm4gdGhpcy50eXBlIH1cbiAgc2V0IF90eXBlKHR5cGUpIHsgdGhpcy50eXBlID0gdHlwZSB9XG4gIGdldCBfdXJsKCkgeyByZXR1cm4gdGhpcy51cmwgfVxuICBzZXQgX3VybCh1cmwpIHsgdGhpcy51cmwgPSB1cmwgfVxuICBnZXQgX2hlYWRlcnMoKSB7IHJldHVybiB0aGlzLmhlYWRlcnMgfHwgW10gfVxuICBzZXQgX2hlYWRlcnMoaGVhZGVycykge1xuICAgIHRoaXMuX2hlYWRlcnMubGVuZ3RoID0gMFxuICAgIGhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICB0aGlzLl9oZWFkZXJzLnB1c2goaGVhZGVyKVxuICAgICAgaGVhZGVyID0gT2JqZWN0LmVudHJpZXMoaGVhZGVyKVswXVxuICAgICAgdGhpcy5feGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgfSlcbiAgfVxuICBnZXQgX2RhdGEoKSB7IHJldHVybiB0aGlzLmRhdGEgfVxuICBzZXQgX2RhdGEoZGF0YSkgeyB0aGlzLmRhdGEgPSBkYXRhIH1cbiAgZ2V0IF94aHIoKSB7XG4gICAgdGhpcy54aHIgPSAodGhpcy54aHIpXG4gICAgICA/IHRoaXMueGhyXG4gICAgICA6IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgcmV0dXJuIHRoaXMueGhyXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIHJlcXVlc3QoZGF0YSkge1xuICAgIGRhdGEgPSBkYXRhIHx8IHRoaXMuZGF0YSB8fCBudWxsXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmKHRoaXMuX3hoci5zdGF0dXMgPT09IDIwMCkgdGhpcy5feGhyLmFib3J0KClcbiAgICAgIHRoaXMuX3hoci5vcGVuKHRoaXMudHlwZSwgdGhpcy51cmwpXG4gICAgICB0aGlzLl9oZWFkZXJzID0gdGhpcy5zZXR0aW5ncy5oZWFkZXJzIHx8IFt0aGlzLl9kZWZhdWx0cy5jb250ZW50VHlwZV1cbiAgICAgIHRoaXMuX3hoci5vbmxvYWQgPSByZXNvbHZlXG4gICAgICB0aGlzLl94aHIub25lcnJvciA9IHJlamVjdFxuICAgICAgdGhpcy5feGhyLnNlbmQoZGF0YSlcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgdGhpcy5lbWl0KCd4aHI6cmVzb2x2ZScsIHtcbiAgICAgICAgbmFtZTogJ3hocjpyZXNvbHZlJyxcbiAgICAgICAgZGF0YTogcmVzcG9uc2UuY3VycmVudFRhcmdldCxcbiAgICAgIH0pXG4gICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHsgdGhyb3cgZXJyb3IgfSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgIXRoaXMuZW5hYmxlZCAmJlxuICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgaWYoc2V0dGluZ3MudHlwZSkgdGhpcy5fdHlwZSA9IHNldHRpbmdzLnR5cGVcbiAgICAgIGlmKHNldHRpbmdzLnVybCkgdGhpcy5fdXJsID0gc2V0dGluZ3MudXJsXG4gICAgICBpZihzZXR0aW5ncy5kYXRhKSB0aGlzLl9kYXRhID0gc2V0dGluZ3MuZGF0YSB8fCBudWxsXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnJlc3BvbnNlVHlwZSkgdGhpcy5fcmVzcG9uc2VUeXBlID0gdGhpcy5fc2V0dGluZ3MucmVzcG9uc2VUeXBlXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgdGhpcy5lbmFibGVkICYmXG4gICAgICBPYmplY3Qua2V5cyhzZXR0aW5ncykubGVuZ3RoXG4gICAgKSB7XG4gICAgICBkZWxldGUgdGhpcy5fdHlwZVxuICAgICAgZGVsZXRlIHRoaXMuX3VybFxuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFcbiAgICAgIGRlbGV0ZSB0aGlzLl9oZWFkZXJzXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VUeXBlXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuIiwiTVZDLk1vZGVsID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgX2lzU2V0dGluZygpIHsgcmV0dXJuIHRoaXMuaXNTZXR0aW5nIH1cbiAgc2V0IF9pc1NldHRpbmcoaXNTZXR0aW5nKSB7IHRoaXMuaXNTZXR0aW5nID0gaXNTZXR0aW5nIH1cbiAgZ2V0IF9jaGFuZ2luZygpIHtcbiAgICB0aGlzLmNoYW5naW5nID0gKHRoaXMuY2hhbmdpbmcpXG4gICAgICA/IHRoaXMuY2hhbmdpbmdcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jaGFuZ2luZ1xuICB9XG4gIGdldCBfbG9jYWxTdG9yYWdlKCkgeyByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UgfVxuICBzZXQgX2xvY2FsU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHsgdGhpcy5sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UgfVxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5kZWZhdWx0cyB9XG4gIHNldCBfZGVmYXVsdHMoZGVmYXVsdHMpIHsgdGhpcy5kZWZhdWx0cyA9IGRlZmF1bHRzIH1cbiAgZ2V0IF9zY2hlbWEoKSB7IHJldHVybiB0aGlzLl9zY2hlbWEgfVxuICBzZXQgX3NjaGVtYShzY2hlbWEpIHsgdGhpcy5zY2hlbWEgPSBzY2hlbWEgfVxuICBnZXQgX2hpc3Rpb2dyYW0oKSB7IHJldHVybiB0aGlzLmhpc3Rpb2dyYW0gfHwge1xuICAgIGxlbmd0aDogMVxuICB9IH1cbiAgc2V0IF9oaXN0aW9ncmFtKGhpc3Rpb2dyYW0pIHtcbiAgICB0aGlzLmhpc3Rpb2dyYW0gPSBPYmplY3QuYXNzaWduKFxuICAgICAgdGhpcy5faGlzdGlvZ3JhbSxcbiAgICAgIGhpc3Rpb2dyYW1cbiAgICApXG4gIH1cbiAgZ2V0IF9oaXN0b3J5KCkge1xuICAgIHRoaXMuaGlzdG9yeSA9ICh0aGlzLmhpc3RvcnkpXG4gICAgICA/IHRoaXMuaGlzdG9yeVxuICAgICAgOiBbXVxuICAgIHJldHVybiB0aGlzLmhpc3RvcnlcbiAgfVxuICBzZXQgX2hpc3RvcnkoZGF0YSkge1xuICAgIGlmKFxuICAgICAgT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoXG4gICAgKSB7XG4gICAgICBpZih0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVuc2hpZnQodGhpcy5wYXJzZShkYXRhKSlcbiAgICAgICAgdGhpcy5faGlzdG9yeS5zcGxpY2UodGhpcy5faGlzdGlvZ3JhbS5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfZGIoKSB7XG4gICAgbGV0IGRiID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpXG4gICAgdGhpcy5kYiA9IChkYilcbiAgICAgID8gZGJcbiAgICAgIDogJ3t9J1xuICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMuZGIpXG4gIH1cbiAgc2V0IF9kYihkYikge1xuICAgIGRiID0gSlNPTi5zdHJpbmdpZnkoZGIpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQsIGRiKVxuICB9XG4gIGdldCBfZGF0YSgpIHtcbiAgICB0aGlzLmRhdGEgPSAgKHRoaXMuZGF0YSlcbiAgICAgID8gdGhpcy5kYXRhXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YVxuICB9XG4gIGdldCBfZGF0YUV2ZW50cygpIHtcbiAgICB0aGlzLmRhdGFFdmVudHMgPSAodGhpcy5kYXRhRXZlbnRzKVxuICAgICAgPyB0aGlzLmRhdGFFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5kYXRhRXZlbnRzXG4gIH1cbiAgc2V0IF9kYXRhRXZlbnRzKGRhdGFFdmVudHMpIHtcbiAgICB0aGlzLmRhdGFFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgZGF0YUV2ZW50cywgdGhpcy5fZGF0YUV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2RhdGFDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5kYXRhQ2FsbGJhY2tzID0gKHRoaXMuZGF0YUNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5kYXRhQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YUNhbGxiYWNrc1xuICB9XG4gIHNldCBfZGF0YUNhbGxiYWNrcyhkYXRhQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5kYXRhQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGRhdGFDYWxsYmFja3MsIHRoaXMuX2RhdGFDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9zZXJ2aWNlcygpIHtcbiAgICB0aGlzLnNlcnZpY2VzID0gICh0aGlzLnNlcnZpY2VzKVxuICAgICAgPyB0aGlzLnNlcnZpY2VzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZXNcbiAgfVxuICBzZXQgX3NlcnZpY2VzKHNlcnZpY2VzKSB7XG4gICAgdGhpcy5zZXJ2aWNlcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBzZXJ2aWNlcywgdGhpcy5fc2VydmljZXNcbiAgICApXG4gIH1cbiAgZ2V0IF9zZXJ2aWNlRXZlbnRzKCkge1xuICAgIHRoaXMuc2VydmljZUV2ZW50cyA9ICh0aGlzLnNlcnZpY2VFdmVudHMpXG4gICAgICA/IHRoaXMuc2VydmljZUV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnNlcnZpY2VFdmVudHNcbiAgfVxuICBzZXQgX3NlcnZpY2VFdmVudHMoc2VydmljZUV2ZW50cykge1xuICAgIHRoaXMuc2VydmljZUV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBzZXJ2aWNlRXZlbnRzLCB0aGlzLl9zZXJ2aWNlRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfc2VydmljZUNhbGxiYWNrcygpIHtcbiAgICB0aGlzLnNlcnZpY2VDYWxsYmFja3MgPSAodGhpcy5zZXJ2aWNlQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLnNlcnZpY2VDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9zZXJ2aWNlQ2FsbGJhY2tzKHNlcnZpY2VDYWxsYmFja3MpIHtcbiAgICB0aGlzLnNlcnZpY2VDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgc2VydmljZUNhbGxiYWNrcywgdGhpcy5fc2VydmljZUNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZW5hYmxlU2VydmljZUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnNlcnZpY2VFdmVudHMsIHRoaXMuc2VydmljZXMsIHRoaXMuc2VydmljZUNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlU2VydmljZUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5zZXJ2aWNlRXZlbnRzLCB0aGlzLnNlcnZpY2VzLCB0aGlzLnNlcnZpY2VDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlRGF0YUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmRhdGFFdmVudHMsIHRoaXMsIHRoaXMuZGF0YUNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlRGF0YUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5kYXRhRXZlbnRzLCB0aGlzLCB0aGlzLmRhdGFDYWxsYmFja3MpXG4gIH1cbiAgc2V0RGVmYXVsdHMoKSB7XG4gICAgbGV0IF9kZWZhdWx0cyA9IHt9XG4gICAgaWYodGhpcy5kZWZhdWx0cykgT2JqZWN0LmFzc2lnbihfZGVmYXVsdHMsIHRoaXMuZGVmYXVsdHMpXG4gICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIE9iamVjdC5hc3NpZ24oX2RlZmF1bHRzLCB0aGlzLl9kYilcbiAgICBpZihPYmplY3Qua2V5cyhfZGVmYXVsdHMpKSB0aGlzLnNldChfZGVmYXVsdHMpXG4gIH1cbiAgZ2V0KCkge1xuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhW2tleV1cbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgc2V0KCkge1xuICAgIHRoaXMuX2hpc3RvcnkgPSB0aGlzLnBhcnNlKClcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICB0aGlzLl9pc1NldHRpbmcgPSB0cnVlXG4gICAgICAgIGxldCBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBpZihpbmRleCA9PT0gKF9hcmd1bWVudHMubGVuZ3RoIC0gMSkpIHRoaXMuX2lzU2V0dGluZyA9IGZhbHNlXG4gICAgICAgICAgdGhpcy5fY2hhbmdpbmdba2V5XSA9IHZhbHVlXG4gICAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSlcbiAgICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy5zZXREQihrZXksIHZhbHVlKVxuICAgICAgICB9KVxuICAgICAgICBkZWxldGUgdGhpcy5jaGFuZ2luZ1xuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICB2YXIga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHZhciB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy5zZXREQihrZXksIHZhbHVlKVxuICAgICAgICBicmVha1xuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0KCkge1xuICAgIHRoaXMuX2hpc3RvcnkgPSB0aGlzLnBhcnNlKClcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyh0aGlzLl9kYXRhKSkge1xuICAgICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0REIoKSB7XG4gICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICB2YXIgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBsZXQgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgZGJba2V5XSA9IHZhbHVlXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHRoaXMuX2RiID0gZGJcbiAgfVxuICB1bnNldERCKCkge1xuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9kYlxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGRlbGV0ZSBkYltrZXldXG4gICAgICAgIHRoaXMuX2RiID0gZGJcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpIHtcbiAgICBpZighdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldKSB7XG4gICAgICBsZXQgY29udGV4dCA9IHRoaXNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgICAgICB0aGlzLl9kYXRhLFxuICAgICAgICB7XG4gICAgICAgICAgWydfJy5jb25jYXQoa2V5KV06IHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNba2V5XSB9LFxuICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgIGxldCBzZXRWYWx1ZUV2ZW50TmFtZSA9IFsnc2V0JywgJzonLCBrZXldLmpvaW4oJycpXG4gICAgICAgICAgICAgIGxldCBzZXRFdmVudE5hbWUgPSAnc2V0J1xuICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbmFtZTogc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIGlmKCFjb250ZXh0Ll9pc1NldHRpbmcpIHtcbiAgICAgICAgICAgICAgICBpZighT2JqZWN0LnZhbHVlcyhjb250ZXh0Ll9jaGFuZ2luZykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICAgICAgc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGNvbnRleHQuX2NoYW5naW5nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKVxuICAgIH1cbiAgICB0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV0gPSB2YWx1ZVxuICB9XG4gIHVuc2V0RGF0YVByb3BlcnR5KGtleSkge1xuICAgIGxldCB1bnNldFZhbHVlRXZlbnROYW1lID0gWyd1bnNldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgIGxldCB1bnNldEV2ZW50TmFtZSA9ICd1bnNldCdcbiAgICBsZXQgdW5zZXRWYWx1ZSA9IHRoaXMuX2RhdGFba2V5XVxuICAgIGRlbGV0ZSB0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV1cbiAgICBkZWxldGUgdGhpcy5fZGF0YVtrZXldXG4gICAgdGhpcy5lbWl0KFxuICAgICAgdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiB1bnNldFZhbHVlLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgKVxuICAgIHRoaXMuZW1pdChcbiAgICAgIHVuc2V0RXZlbnROYW1lLFxuICAgICAge1xuICAgICAgICBuYW1lOiB1bnNldEV2ZW50TmFtZSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiB1bnNldFZhbHVlLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgKVxuICB9XG4gIHBhcnNlKGRhdGEpIHtcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLl9kYXRhXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoT2JqZWN0LmFzc2lnbih7fSwgZGF0YSkpKVxuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5sb2NhbFN0b3JhZ2UpIHRoaXMuX2xvY2FsU3RvcmFnZSA9IHRoaXMuc2V0dGluZ3MubG9jYWxTdG9yYWdlXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmhpc3Rpb2dyYW0pIHRoaXMuX2hpc3Rpb2dyYW0gPSB0aGlzLnNldHRpbmdzLmhpc3Rpb2dyYW1cbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZW1pdHRlcnMpIHRoaXMuX2VtaXR0ZXJzID0gdGhpcy5zZXR0aW5ncy5lbWl0dGVyc1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5zZXJ2aWNlcykgdGhpcy5fc2VydmljZXMgPSB0aGlzLnNldHRpbmdzLnNlcnZpY2VzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnNlcnZpY2VDYWxsYmFja3MpIHRoaXMuX3NlcnZpY2VDYWxsYmFja3MgPSB0aGlzLnNldHRpbmdzLnNlcnZpY2VDYWxsYmFja3NcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3Muc2VydmljZUV2ZW50cykgdGhpcy5fc2VydmljZUV2ZW50cyA9IHRoaXMuc2V0dGluZ3Muc2VydmljZUV2ZW50c1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5kYXRhKSB0aGlzLnNldCh0aGlzLnNldHRpbmdzLmRhdGEpXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRhdGFDYWxsYmFja3MpIHRoaXMuX2RhdGFDYWxsYmFja3MgPSB0aGlzLnNldHRpbmdzLmRhdGFDYWxsYmFja3NcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGF0YUV2ZW50cykgdGhpcy5fZGF0YUV2ZW50cyA9IHRoaXMuc2V0dGluZ3MuZGF0YUV2ZW50c1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5zY2hlbWEpIHRoaXMuX3NjaGVtYSA9IHRoaXMuc2V0dGluZ3Muc2NoZW1hXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRlZmF1bHRzKSB0aGlzLl9kZWZhdWx0cyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHNcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnNlcnZpY2VzICYmXG4gICAgICAgIHRoaXMuc2VydmljZUV2ZW50cyAmJlxuICAgICAgICB0aGlzLnNlcnZpY2VDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZVNlcnZpY2VFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuZGF0YUV2ZW50cyAmJlxuICAgICAgICB0aGlzLmRhdGFDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZURhdGFFdmVudHMoKVxuICAgICAgfVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMuc2VydmljZXMgJiZcbiAgICAgICAgdGhpcy5zZXJ2aWNlRXZlbnRzICYmXG4gICAgICAgIHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZVNlcnZpY2VFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuZGF0YUV2ZW50cyAmJlxuICAgICAgICB0aGlzLmRhdGFDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVEYXRhRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSB0aGlzLl9sb2NhbFN0b3JhZ2VcbiAgICAgIGRlbGV0ZSB0aGlzLl9oaXN0aW9ncmFtXG4gICAgICBkZWxldGUgdGhpcy5fc2VydmljZXNcbiAgICAgIGRlbGV0ZSB0aGlzLl9zZXJ2aWNlQ2FsbGJhY2tzXG4gICAgICBkZWxldGUgdGhpcy5fc2VydmljZUV2ZW50c1xuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhQ2FsbGJhY2tzXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YUV2ZW50c1xuICAgICAgZGVsZXRlIHRoaXMuX3NjaGVtYVxuICAgICAgZGVsZXRlIHRoaXMuX2VtaXR0ZXJzXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gIH1cbn1cbiIsIk1WQy5FbWl0dGVyID0gY2xhc3MgZXh0ZW5kcyBNVkMuTW9kZWwge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxyXG4gICAgaWYodGhpcy5zZXR0aW5ncykge1xyXG4gICAgICBpZih0aGlzLnNldHRpbmdzLm5hbWUpIHRoaXMuX25hbWUgPSB0aGlzLnNldHRpbmdzLm5hbWVcclxuICAgIH1cclxuICB9XHJcbiAgZ2V0IF9uYW1lKCkgeyByZXR1cm4gdGhpcy5uYW1lIH1cclxuICBzZXQgX25hbWUobmFtZSkgeyB0aGlzLm5hbWUgPSBuYW1lIH1cclxuICBlbWlzc2lvbigpIHtcclxuICAgIGxldCBldmVudERhdGEgPSB7XHJcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcclxuICAgICAgZGF0YTogdGhpcy5kYXRhXHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgIHRoaXMubmFtZSxcclxuICAgICAgZXZlbnREYXRhXHJcbiAgICApXHJcbiAgICByZXR1cm4gZXZlbnREYXRhXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5FbWl0dGVycy5OYXZpZ2F0ZSA9IGNsYXNzIGV4dGVuZHMgTVZDLkVtaXR0ZXIge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxyXG4gICAgdGhpcy5hZGRTZXR0aW5ncygpXHJcbiAgICB0aGlzLmVuYWJsZSgpXHJcbiAgfVxyXG4gIGFkZFNldHRpbmdzKCkge1xyXG4gICAgdGhpcy5fbmFtZSA9ICduYXZpZ2F0ZSdcclxuICAgIHRoaXMuX3NjaGVtYSA9IHtcclxuICAgICAgb2xkVVJMOiBTdHJpbmcsXHJcbiAgICAgIG5ld1VSTDogU3RyaW5nLFxyXG4gICAgICBjdXJyZW50Um91dGU6IFN0cmluZyxcclxuICAgICAgY3VycmVudENvbnRyb2xsZXI6IFN0cmluZyxcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiTVZDLlZpZXcgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfZWxlbWVudE5hbWUoKSB7IHJldHVybiB0aGlzLl9lbGVtZW50LnRhZ05hbWUgfVxuICBzZXQgX2VsZW1lbnROYW1lKGVsZW1lbnROYW1lKSB7XG4gICAgaWYoIXRoaXMuX2VsZW1lbnQpIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnROYW1lKVxuICB9XG4gIGdldCBfZWxlbWVudCgpIHsgcmV0dXJuIHRoaXMuZWxlbWVudCB9XG4gIHNldCBfZWxlbWVudChlbGVtZW50KSB7XG4gICAgaWYoXG4gICAgICBlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcbiAgICAgIGVsZW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFxuICAgICkge1xuICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxuICAgIH0gZWxzZSBpZih0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudClcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50T2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmVsZW1lbnQsIHtcbiAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgfSlcbiAgfVxuICBnZXQgX2F0dHJpYnV0ZXMoKSB7IHJldHVybiB0aGlzLl9lbGVtZW50LmF0dHJpYnV0ZXMgfVxuICBzZXQgX2F0dHJpYnV0ZXMoYXR0cmlidXRlcykge1xuICAgIGZvcihsZXQgW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpKSB7XG4gICAgICBpZih0eXBlb2YgYXR0cmlidXRlVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZUtleSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfdWkoKSB7XG4gICAgdGhpcy51aSA9ICh0aGlzLnVpKVxuICAgICAgPyB0aGlzLnVpXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudWlcbiAgfVxuICBzZXQgX3VpKHVpKSB7XG4gICAgaWYoIXRoaXMuX3VpWyckZWxlbWVudCddKSB0aGlzLl91aVsnJGVsZW1lbnQnXSA9IHRoaXMuZWxlbWVudFxuICAgIGZvcihsZXQgW3VpS2V5LCB1aVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh1aSkpIHtcbiAgICAgIGlmKHR5cGVvZiB1aVZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLl91aVt1aUtleV0gPSB0aGlzLl9lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodWlWYWx1ZSlcbiAgICAgIH0gZWxzZSBpZihcbiAgICAgICAgdWlWYWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICAgIHVpVmFsdWUgaW5zdGFuY2VvZiBEb2N1bWVudFxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuX3VpW3VpS2V5XSA9IHVpVmFsdWVcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IF91aUV2ZW50cygpIHsgcmV0dXJuIHRoaXMudWlFdmVudHMgfVxuICBzZXQgX3VpRXZlbnRzKHVpRXZlbnRzKSB7IHRoaXMudWlFdmVudHMgPSB1aUV2ZW50cyB9XG4gIGdldCBfdWlDYWxsYmFja3MoKSB7XG4gICAgdGhpcy51aUNhbGxiYWNrcyA9ICh0aGlzLnVpQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudWlDYWxsYmFja3NcbiAgfVxuICBzZXQgX3VpQ2FsbGJhY2tzKHVpQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy51aUNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB1aUNhbGxiYWNrcywgdGhpcy5fdWlDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9vYnNlcnZlckNhbGxiYWNrcygpIHtcbiAgICB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzID0gKHRoaXMub2JzZXJ2ZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMub2JzZXJ2ZXJDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5vYnNlcnZlckNhbGxiYWNrc1xuICB9XG4gIHNldCBfb2JzZXJ2ZXJDYWxsYmFja3Mob2JzZXJ2ZXJDYWxsYmFja3MpIHtcbiAgICB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG9ic2VydmVyQ2FsbGJhY2tzLCB0aGlzLl9vYnNlcnZlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgZWxlbWVudE9ic2VydmVyKCkge1xuICAgIHRoaXMuX2VsZW1lbnRPYnNlcnZlciA9ICh0aGlzLl9lbGVtZW50T2JzZXJ2ZXIpXG4gICAgICA/IHRoaXMuX2VsZW1lbnRPYnNlcnZlclxuICAgICAgOiBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLmVsZW1lbnRPYnNlcnZlLmJpbmQodGhpcykpXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRPYnNlcnZlclxuICB9XG4gIGdldCBfaW5zZXJ0KCkgeyByZXR1cm4gdGhpcy5pbnNlcnQgfVxuICBzZXQgX2luc2VydChpbnNlcnQpIHsgdGhpcy5pbnNlcnQgPSBpbnNlcnQgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZ2V0IF90ZW1wbGF0ZXMoKSB7XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSAodGhpcy50ZW1wbGF0ZXMpXG4gICAgICA/IHRoaXMudGVtcGxhdGVzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGVzXG4gIH1cbiAgc2V0IF90ZW1wbGF0ZXModGVtcGxhdGVzKSB7XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdGVtcGxhdGVzLCB0aGlzLl90ZW1wbGF0ZXNcbiAgICApXG4gIH1cbiAgZWxlbWVudE9ic2VydmUobXV0YXRpb25SZWNvcmRMaXN0LCBvYnNlcnZlcikge1xuICAgIGZvcihsZXQgW211dGF0aW9uUmVjb3JkSW5kZXgsIG11dGF0aW9uUmVjb3JkXSBvZiBPYmplY3QuZW50cmllcyhtdXRhdGlvblJlY29yZExpc3QpKSB7XG4gICAgICBzd2l0Y2gobXV0YXRpb25SZWNvcmQudHlwZSkge1xuICAgICAgICBjYXNlICdjaGlsZExpc3QnOlxuICAgICAgICAgIGxldCBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMgPSBbJ2FkZGVkTm9kZXMnLCAncmVtb3ZlZE5vZGVzJ11cbiAgICAgICAgICBmb3IobGV0IG11dGF0aW9uUmVjb3JkQ2F0ZWdvcnkgb2YgbXV0YXRpb25SZWNvcmRDYXRlZ29yaWVzKSB7XG4gICAgICAgICAgICBpZihtdXRhdGlvblJlY29yZFttdXRhdGlvblJlY29yZENhdGVnb3J5XS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgdGhpcy5yZXNldFVJKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYXV0b0luc2VydCgpIHtcbiAgICBpZih0aGlzLmluc2VydCkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLmluc2VydC5lbGVtZW50KVxuICAgICAgLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgZWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQodGhpcy5pbnNlcnQubWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBhdXRvUmVtb3ZlKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5lbGVtZW50ICYmXG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICkgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICB9XG4gIGVuYWJsZUVsZW1lbnQoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihzZXR0aW5ncy5lbGVtZW50TmFtZSkgdGhpcy5fZWxlbWVudE5hbWUgPSBzZXR0aW5ncy5lbGVtZW50TmFtZVxuICAgIGlmKHNldHRpbmdzLmVsZW1lbnQpIHRoaXMuX2VsZW1lbnQgPSBzZXR0aW5ncy5lbGVtZW50XG4gICAgaWYoc2V0dGluZ3MuYXR0cmlidXRlcykgdGhpcy5fYXR0cmlidXRlcyA9IHNldHRpbmdzLmF0dHJpYnV0ZXNcbiAgICBpZihzZXR0aW5ncy50ZW1wbGF0ZXMpIHRoaXMuX3RlbXBsYXRlcyA9IHNldHRpbmdzLnRlbXBsYXRlc1xuICAgIGlmKHNldHRpbmdzLmluc2VydCkgdGhpcy5faW5zZXJ0ID0gc2V0dGluZ3MuaW5zZXJ0XG4gIH1cbiAgZGlzYWJsZUVsZW1lbnQoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHRoaXMuZWxlbWVudCAmJlxuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnRcbiAgICApIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcbiAgICBpZih0aGlzLmVsZW1lbnQpIGRlbGV0ZSB0aGlzLmVsZW1lbnRcbiAgICBpZih0aGlzLmF0dHJpYnV0ZXMpIGRlbGV0ZSB0aGlzLmF0dHJpYnV0ZXNcbiAgICBpZih0aGlzLnRlbXBsYXRlcykgZGVsZXRlIHRoaXMudGVtcGxhdGVzXG4gICAgaWYodGhpcy5pbnNlcnQpIGRlbGV0ZSB0aGlzLmluc2VydFxuICB9XG4gIHJlc2V0VUkoKSB7XG4gICAgdGhpcy5kaXNhYmxlVUkoKVxuICAgIHRoaXMuZW5hYmxlVUkoKVxuICB9XG4gIGVuYWJsZVVJKHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzXG4gICAgaWYoc2V0dGluZ3MudWkpIHRoaXMuX3VpID0gc2V0dGluZ3MudWlcbiAgICBpZihzZXR0aW5ncy51aUNhbGxiYWNrcykgdGhpcy5fdWlDYWxsYmFja3MgPSBzZXR0aW5ncy51aUNhbGxiYWNrc1xuICAgIGlmKHNldHRpbmdzLnVpRXZlbnRzKSB7XG4gICAgICB0aGlzLl91aUV2ZW50cyA9IHNldHRpbmdzLnVpRXZlbnRzXG4gICAgICB0aGlzLmVuYWJsZVVJRXZlbnRzKClcbiAgICB9XG4gIH1cbiAgZGlzYWJsZVVJKHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzXG4gICAgaWYoc2V0dGluZ3MudWlFdmVudHMpIHtcbiAgICAgIHRoaXMuZGlzYWJsZVVJRXZlbnRzKClcbiAgICAgIGRlbGV0ZSB0aGlzLl91aUV2ZW50c1xuICAgIH1cbiAgICBkZWxldGUgdGhpcy51aUV2ZW50c1xuICAgIGRlbGV0ZSB0aGlzLnVpXG4gICAgZGVsZXRlIHRoaXMudWlDYWxsYmFja3NcbiAgfVxuICBlbmFibGVVSUV2ZW50cygpIHtcbiAgICBpZihcbiAgICAgIHRoaXMudWlFdmVudHMgJiZcbiAgICAgIHRoaXMudWkgJiZcbiAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKFxuICAgICAgICB0aGlzLnVpRXZlbnRzLFxuICAgICAgICB0aGlzLnVpLFxuICAgICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgICApXG4gICAgfVxuICB9XG4gIGRpc2FibGVVSUV2ZW50cygpIHtcbiAgICBpZihcbiAgICAgIHRoaXMudWlFdmVudHMgJiZcbiAgICAgIHRoaXMudWkgJiZcbiAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyhcbiAgICAgICAgdGhpcy51aUV2ZW50cyxcbiAgICAgICAgdGhpcy51aSxcbiAgICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICAgKVxuICAgIH1cbiAgfVxuICBlbmFibGVFbWl0dGVycygpIHtcbiAgICBpZih0aGlzLnNldHRpbmdzLmVtaXR0ZXJzKSB0aGlzLl9lbWl0dGVycyA9IHRoaXMuc2V0dGluZ3MuZW1pdHRlcnNcbiAgfVxuICBkaXNhYmxlRW1pdHRlcnMoKSB7XG4gICAgaWYodGhpcy5fZW1pdHRlcnMpIGRlbGV0ZSB0aGlzLl9lbWl0dGVyc1xuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuX2VuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZW5hYmxlRW1pdHRlcnMoKVxuICAgICAgdGhpcy5lbmFibGVFbGVtZW50KHNldHRpbmdzKVxuICAgICAgdGhpcy5lbmFibGVVSShzZXR0aW5ncylcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICB0aGlzLl9lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLmRpc2FibGVVSShzZXR0aW5ncylcbiAgICAgIHRoaXMuZGlzYWJsZUVsZW1lbnQoc2V0dGluZ3MpXG4gICAgICB0aGlzLmRpc2FibGVFbWl0dGVycygpXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICAgIHJldHVybiB0aGlzc1xuICAgIH1cbiAgfVxufVxuIiwiTVZDLkNvbnRyb2xsZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfZW1pdHRlckNhbGxiYWNrcygpIHtcbiAgICB0aGlzLmVtaXR0ZXJDYWxsYmFja3MgPSAodGhpcy5lbWl0dGVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9lbWl0dGVyQ2FsbGJhY2tzKGVtaXR0ZXJDYWxsYmFja3MpIHtcbiAgICB0aGlzLmVtaXR0ZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgZW1pdHRlckNhbGxiYWNrcywgdGhpcy5fZW1pdHRlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVsQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMubW9kZWxDYWxsYmFja3MgPSAodGhpcy5tb2RlbENhbGxiYWNrcylcbiAgICAgID8gdGhpcy5tb2RlbENhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm1vZGVsQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9tb2RlbENhbGxiYWNrcyhtb2RlbENhbGxiYWNrcykge1xuICAgIHRoaXMubW9kZWxDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgbW9kZWxDYWxsYmFja3MsIHRoaXMuX21vZGVsQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfdmlld0NhbGxiYWNrcygpIHtcbiAgICB0aGlzLnZpZXdDYWxsYmFja3MgPSAodGhpcy52aWV3Q2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLnZpZXdDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy52aWV3Q2FsbGJhY2tzXG4gIH1cbiAgc2V0IF92aWV3Q2FsbGJhY2tzKHZpZXdDYWxsYmFja3MpIHtcbiAgICB0aGlzLnZpZXdDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld0NhbGxiYWNrcywgdGhpcy5fdmlld0NhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzID0gKHRoaXMuY29udHJvbGxlckNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICB9XG4gIHNldCBfY29udHJvbGxlckNhbGxiYWNrcyhjb250cm9sbGVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGNvbnRyb2xsZXJDYWxsYmFja3MsIHRoaXMuX2NvbnRyb2xsZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9tb2RlbHMoKSB7XG4gICAgdGhpcy5tb2RlbHMgPSAodGhpcy5tb2RlbHMpXG4gICAgICA/IHRoaXMubW9kZWxzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMubW9kZWxzXG4gIH1cbiAgc2V0IF9tb2RlbHMobW9kZWxzKSB7XG4gICAgdGhpcy5tb2RlbHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgbW9kZWxzLCB0aGlzLl9tb2RlbHNcbiAgICApXG4gIH1cbiAgZ2V0IF92aWV3cygpIHtcbiAgICB0aGlzLnZpZXdzID0gKHRoaXMudmlld3MpXG4gICAgICA/IHRoaXMudmlld3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy52aWV3c1xuICB9XG4gIHNldCBfdmlld3Modmlld3MpIHtcbiAgICB0aGlzLnZpZXdzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHZpZXdzLCB0aGlzLl92aWV3c1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXJzKCkge1xuICAgIHRoaXMuY29udHJvbGxlcnMgPSAodGhpcy5jb250cm9sbGVycylcbiAgICAgID8gdGhpcy5jb250cm9sbGVyc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJzXG4gIH1cbiAgc2V0IF9jb250cm9sbGVycyhjb250cm9sbGVycykge1xuICAgIHRoaXMuY29udHJvbGxlcnMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlcnMsIHRoaXMuX2NvbnRyb2xsZXJzXG4gICAgKVxuICB9XG4gIGdldCBfcm91dGVycygpIHtcbiAgICB0aGlzLnJvdXRlcnMgPSAodGhpcy5yb3V0ZXJzKVxuICAgICAgPyB0aGlzLnJvdXRlcnNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXJzXG4gIH1cbiAgc2V0IF9yb3V0ZXJzKHJvdXRlcnMpIHtcbiAgICB0aGlzLnJvdXRlcnMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgcm91dGVycywgdGhpcy5fcm91dGVyc1xuICAgIClcbiAgfVxuICBnZXQgX3JvdXRlckV2ZW50cygpIHtcbiAgICB0aGlzLnJvdXRlckV2ZW50cyA9ICh0aGlzLnJvdXRlckV2ZW50cylcbiAgICAgID8gdGhpcy5yb3V0ZXJFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXJFdmVudHNcbiAgfVxuICBzZXQgX3JvdXRlckV2ZW50cyhyb3V0ZXJFdmVudHMpIHtcbiAgICB0aGlzLnJvdXRlckV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXJFdmVudHMsIHRoaXMuX3JvdXRlckV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX3JvdXRlckNhbGxiYWNrcygpIHtcbiAgICB0aGlzLnJvdXRlckNhbGxiYWNrcyA9ICh0aGlzLnJvdXRlckNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX3JvdXRlckNhbGxiYWNrcyhyb3V0ZXJDYWxsYmFja3MpIHtcbiAgICB0aGlzLnJvdXRlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXJDYWxsYmFja3MsIHRoaXMuX3JvdXRlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX2VtaXR0ZXJFdmVudHMoKSB7XG4gICAgdGhpcy5lbWl0dGVyRXZlbnRzID0gKHRoaXMuZW1pdHRlckV2ZW50cylcbiAgICAgID8gdGhpcy5lbWl0dGVyRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlckV2ZW50c1xuICB9XG4gIHNldCBfZW1pdHRlckV2ZW50cyhlbWl0dGVyRXZlbnRzKSB7XG4gICAgdGhpcy5lbWl0dGVyRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGVtaXR0ZXJFdmVudHMsIHRoaXMuX2VtaXR0ZXJFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9tb2RlbEV2ZW50cygpIHtcbiAgICB0aGlzLm1vZGVsRXZlbnRzID0gKHRoaXMubW9kZWxFdmVudHMpXG4gICAgICA/IHRoaXMubW9kZWxFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5tb2RlbEV2ZW50c1xuICB9XG4gIHNldCBfbW9kZWxFdmVudHMobW9kZWxFdmVudHMpIHtcbiAgICB0aGlzLm1vZGVsRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG1vZGVsRXZlbnRzLCB0aGlzLl9tb2RlbEV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX3ZpZXdFdmVudHMoKSB7XG4gICAgdGhpcy52aWV3RXZlbnRzID0gKHRoaXMudmlld0V2ZW50cylcbiAgICAgID8gdGhpcy52aWV3RXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudmlld0V2ZW50c1xuICB9XG4gIHNldCBfdmlld0V2ZW50cyh2aWV3RXZlbnRzKSB7XG4gICAgdGhpcy52aWV3RXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHZpZXdFdmVudHMsIHRoaXMuX3ZpZXdFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9jb250cm9sbGVyRXZlbnRzKCkge1xuICAgIHRoaXMuY29udHJvbGxlckV2ZW50cyA9ICh0aGlzLmNvbnRyb2xsZXJFdmVudHMpXG4gICAgICA/IHRoaXMuY29udHJvbGxlckV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJFdmVudHNcbiAgfVxuICBzZXQgX2NvbnRyb2xsZXJFdmVudHMoY29udHJvbGxlckV2ZW50cykge1xuICAgIHRoaXMuY29udHJvbGxlckV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBjb250cm9sbGVyRXZlbnRzLCB0aGlzLl9jb250cm9sbGVyRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICBlbmFibGVNb2RlbEV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLm1vZGVsRXZlbnRzLCB0aGlzLm1vZGVscywgdGhpcy5tb2RlbENhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlTW9kZWxFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMubW9kZWxFdmVudHMsIHRoaXMubW9kZWxzLCB0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZVZpZXdFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy52aWV3RXZlbnRzLCB0aGlzLnZpZXdzLCB0aGlzLnZpZXdDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZVZpZXdFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMudmlld0V2ZW50cywgdGhpcy52aWV3cywgdGhpcy52aWV3Q2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZUNvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5jb250cm9sbGVyRXZlbnRzLCB0aGlzLmNvbnRyb2xsZXJzLCB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZUNvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMuY29udHJvbGxlckV2ZW50cywgdGhpcy5jb250cm9sbGVycywgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZUVtaXR0ZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5lbWl0dGVyRXZlbnRzLCB0aGlzLmVtaXR0ZXJzLCB0aGlzLmVtaXR0ZXJDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZUVtaXR0ZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMuZW1pdHRlckV2ZW50cywgdGhpcy5lbWl0dGVycywgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZVJvdXRlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnJvdXRlckV2ZW50cywgdGhpcy5yb3V0ZXJzLCB0aGlzLnJvdXRlckNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlUm91dGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyh0aGlzLnJvdXRlckV2ZW50cywgdGhpcy5yb3V0ZXJzLCB0aGlzLnJvdXRlckNhbGxiYWNrcylcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKHNldHRpbmdzLm1vZGVsQ2FsbGJhY2tzKSB0aGlzLl9tb2RlbENhbGxiYWNrcyA9IHNldHRpbmdzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy52aWV3Q2FsbGJhY2tzKSB0aGlzLl92aWV3Q2FsbGJhY2tzID0gc2V0dGluZ3Mudmlld0NhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3MuY29udHJvbGxlckNhbGxiYWNrcykgdGhpcy5fY29udHJvbGxlckNhbGxiYWNrcyA9IHNldHRpbmdzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLmVtaXR0ZXJDYWxsYmFja3MpIHRoaXMuX2VtaXR0ZXJDYWxsYmFja3MgPSBzZXR0aW5ncy5lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5yb3V0ZXJDYWxsYmFja3MpIHRoaXMuX3JvdXRlckNhbGxiYWNrcyA9IHNldHRpbmdzLnJvdXRlckNhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3MubW9kZWxzKSB0aGlzLl9tb2RlbHMgPSBzZXR0aW5ncy5tb2RlbHNcbiAgICAgIGlmKHNldHRpbmdzLnZpZXdzKSB0aGlzLl92aWV3cyA9IHNldHRpbmdzLnZpZXdzXG4gICAgICBpZihzZXR0aW5ncy5jb250cm9sbGVycykgdGhpcy5fY29udHJvbGxlcnMgPSBzZXR0aW5ncy5jb250cm9sbGVyc1xuICAgICAgaWYoc2V0dGluZ3MuZW1pdHRlcnMpIHRoaXMuX2VtaXR0ZXJzID0gc2V0dGluZ3MuZW1pdHRlcnNcbiAgICAgIGlmKHNldHRpbmdzLnJvdXRlcnMpIHRoaXMuX3JvdXRlcnMgPSBzZXR0aW5ncy5yb3V0ZXJzXG4gICAgICBpZihzZXR0aW5ncy5tb2RlbEV2ZW50cykgdGhpcy5fbW9kZWxFdmVudHMgPSBzZXR0aW5ncy5tb2RlbEV2ZW50c1xuICAgICAgaWYoc2V0dGluZ3Mudmlld0V2ZW50cykgdGhpcy5fdmlld0V2ZW50cyA9IHNldHRpbmdzLnZpZXdFdmVudHNcbiAgICAgIGlmKHNldHRpbmdzLmNvbnRyb2xsZXJFdmVudHMpIHRoaXMuX2NvbnRyb2xsZXJFdmVudHMgPSBzZXR0aW5ncy5jb250cm9sbGVyRXZlbnRzXG4gICAgICBpZihzZXR0aW5ncy5lbWl0dGVyRXZlbnRzKSB0aGlzLl9lbWl0dGVyRXZlbnRzID0gc2V0dGluZ3MuZW1pdHRlckV2ZW50c1xuICAgICAgaWYoc2V0dGluZ3Mucm91dGVyRXZlbnRzKSB0aGlzLl9yb3V0ZXJFdmVudHMgPSBzZXR0aW5ncy5yb3V0ZXJFdmVudHNcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLm1vZGVsRXZlbnRzICYmXG4gICAgICAgIHRoaXMubW9kZWxzICYmXG4gICAgICAgIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZU1vZGVsRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnZpZXdFdmVudHMgJiZcbiAgICAgICAgdGhpcy52aWV3cyAmJlxuICAgICAgICB0aGlzLnZpZXdDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZVZpZXdFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuY29udHJvbGxlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlQ29udHJvbGxlckV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5yb3V0ZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5yb3V0ZXJzICYmXG4gICAgICAgIHRoaXMucm91dGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5lbmFibGVSb3V0ZXJFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuZW1pdHRlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLmVtaXR0ZXJzICYmXG4gICAgICAgIHRoaXMuZW1pdHRlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlRW1pdHRlckV2ZW50cygpXG4gICAgICB9XG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXNldCgpIHtcbiAgICB0aGlzLmRpc2FibGUoKVxuICAgIHRoaXMuZW5hYmxlKClcbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICB0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLm1vZGVsRXZlbnRzICYmXG4gICAgICAgIHRoaXMubW9kZWxzICYmXG4gICAgICAgIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVNb2RlbEV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy52aWV3RXZlbnRzICYmXG4gICAgICAgIHRoaXMudmlld3MgJiZcbiAgICAgICAgdGhpcy52aWV3Q2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlVmlld0V2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5jb250cm9sbGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlQ29udHJvbGxlckV2ZW50cygpXG4gICAgICB9fVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMucm91dGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMucm91dGVycyAmJlxuICAgICAgICB0aGlzLnJvdXRlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZVJvdXRlckV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5lbWl0dGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZW1pdHRlcnMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlRW1pdHRlckV2ZW50cygpXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9tb2RlbENhbGxiYWNrc1xuICAgICAgICBkZWxldGUgdGhpcy5fdmlld0NhbGxiYWNrc1xuICAgICAgICBkZWxldGUgdGhpcy5fY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgICBkZWxldGUgdGhpcy5fZW1pdHRlckNhbGxiYWNrc1xuICAgICAgICBkZWxldGUgdGhpcy5fcm91dGVyQ2FsbGJhY2tzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9tb2RlbHNcbiAgICAgICAgZGVsZXRlIHRoaXMuX3ZpZXdzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyc1xuICAgICAgICBkZWxldGUgdGhpcy5fZW1pdHRlcnNcbiAgICAgICAgZGVsZXRlIHRoaXMuX3JvdXRlcnNcbiAgICAgICAgZGVsZXRlIHRoaXMuX3JvdXRlckV2ZW50c1xuICAgICAgICBkZWxldGUgdGhpcy5fbW9kZWxFdmVudHNcbiAgICAgICAgZGVsZXRlIHRoaXMuX3ZpZXdFdmVudHNcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJFdmVudHNcbiAgICAgICAgZGVsZXRlIHRoaXMuX2VtaXR0ZXJFdmVudHNcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgfVxufVxuIiwiTVZDLlJvdXRlciA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IHByb3RvY29sKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnByb3RvY29sIH1cbiAgZ2V0IGhvc3RuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lIH1cbiAgZ2V0IHBvcnQoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucG9ydCB9XG4gIGdldCBwYXRoKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIH1cbiAgZ2V0IGhhc2goKSB7XG4gICAgbGV0IGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgIGxldCBoYXNoSW5kZXggPSBocmVmLmluZGV4T2YoJyMnKVxuICAgIGlmKGhhc2hJbmRleCA+IC0xKSB7XG4gICAgICBsZXQgcGFyYW1JbmRleCA9IGhyZWYuaW5kZXhPZignPycpXG4gICAgICBsZXQgc2xpY2VTdGFydCA9IGhhc2hJbmRleCArIDFcbiAgICAgIGxldCBzbGljZVN0b3BcbiAgICAgIGlmKHBhcmFtSW5kZXggPiAtMSkge1xuICAgICAgICBzbGljZVN0b3AgPSAoaGFzaEluZGV4ID4gcGFyYW1JbmRleClcbiAgICAgICAgICA/IGhyZWYubGVuZ3RoXG4gICAgICAgICAgOiBwYXJhbUluZGV4XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzbGljZVN0b3AgPSBocmVmLmxlbmd0aFxuICAgICAgfVxuICAgICAgaHJlZiA9IGhyZWYuc2xpY2Uoc2xpY2VTdGFydCwgc2xpY2VTdG9wKVxuICAgICAgaWYoaHJlZi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGhyZWZcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG4gIGdldCBwYXJhbXMoKSB7XG4gICAgbGV0IGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgIGxldCBwYXJhbUluZGV4ID0gaHJlZi5pbmRleE9mKCc/JylcbiAgICBpZihwYXJhbUluZGV4ID4gLTEpIHtcbiAgICAgIGxldCBoYXNoSW5kZXggPSBocmVmLmluZGV4T2YoJyMnKVxuICAgICAgbGV0IHNsaWNlU3RhcnQgPSBwYXJhbUluZGV4ICsgMVxuICAgICAgbGV0IHNsaWNlU3RvcFxuICAgICAgaWYoaGFzaEluZGV4ID4gLTEpIHtcbiAgICAgICAgc2xpY2VTdG9wID0gKHBhcmFtSW5kZXggPiBoYXNoSW5kZXgpXG4gICAgICAgICAgPyBocmVmLmxlbmd0aFxuICAgICAgICAgIDogaGFzaEluZGV4XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzbGljZVN0b3AgPSBocmVmLmxlbmd0aFxuICAgICAgfVxuICAgICAgaHJlZiA9IGhyZWYuc2xpY2Uoc2xpY2VTdGFydCwgc2xpY2VTdG9wKVxuICAgICAgaWYoaHJlZi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGhyZWZcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG4gIGdldCBfcm91dGVEYXRhKCkge1xuICAgIGxldCByb3V0ZURhdGEgPSB7XG4gICAgICBsb2NhdGlvbjoge30sXG4gICAgICBjb250cm9sbGVyOiB7fSxcbiAgICB9XG4gICAgbGV0IHBhdGggPSB0aGlzLnBhdGguc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgcGF0aCA9IChwYXRoLmxlbmd0aClcbiAgICAgID8gcGF0aFxuICAgICAgOiBbJy8nXVxuICAgIGxldCBoYXNoID0gdGhpcy5oYXNoXG4gICAgbGV0IGhhc2hGcmFnbWVudHMgPSAoaGFzaClcbiAgICAgID8gaGFzaC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgIDogbnVsbFxuICAgIGxldCBwYXJhbXMgPSB0aGlzLnBhcmFtc1xuICAgIGxldCBwYXJhbURhdGEgPSAocGFyYW1zKVxuICAgICAgPyBNVkMuVXRpbHMucGFyYW1zVG9PYmplY3QocGFyYW1zKVxuICAgICAgOiBudWxsXG4gICAgaWYodGhpcy5wcm90b2NvbCkgcm91dGVEYXRhLmxvY2F0aW9uLnByb3RvY29sID0gdGhpcy5wcm90b2NvbFxuICAgIGlmKHRoaXMuaG9zdG5hbWUpIHJvdXRlRGF0YS5sb2NhdGlvbi5ob3N0bmFtZSA9IHRoaXMuaG9zdG5hbWVcbiAgICBpZih0aGlzLnBvcnQpIHJvdXRlRGF0YS5sb2NhdGlvbi5wb3J0ID0gdGhpcy5wb3J0XG4gICAgaWYodGhpcy5wYXRoKSByb3V0ZURhdGEubG9jYXRpb24ucGF0aCA9IHRoaXMucGF0aFxuICAgIGlmKFxuICAgICAgaGFzaCAmJlxuICAgICAgaGFzaEZyYWdtZW50c1xuICAgICkge1xuICAgICAgaGFzaEZyYWdtZW50cyA9IChoYXNoRnJhZ21lbnRzLmxlbmd0aClcbiAgICAgID8gaGFzaEZyYWdtZW50c1xuICAgICAgOiBbJy8nXVxuICAgICAgcm91dGVEYXRhLmxvY2F0aW9uLmhhc2ggPSB7XG4gICAgICAgIHBhdGg6IGhhc2gsXG4gICAgICAgIGZyYWdtZW50czogaGFzaEZyYWdtZW50cyxcbiAgICAgIH1cbiAgICB9XG4gICAgaWYoXG4gICAgICBwYXJhbXMgJiZcbiAgICAgIHBhcmFtRGF0YVxuICAgICkge1xuICAgICAgcm91dGVEYXRhLmxvY2F0aW9uLnBhcmFtcyA9IHtcbiAgICAgICAgcGF0aDogcGFyYW1zLFxuICAgICAgICBkYXRhOiBwYXJhbURhdGEsXG4gICAgICB9XG4gICAgfVxuICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5wYXRoID0ge1xuICAgICAgbmFtZTogdGhpcy5wYXRoLFxuICAgICAgZnJhZ21lbnRzOiBwYXRoLFxuICAgIH1cbiAgICByb3V0ZURhdGEubG9jYXRpb24uY3VycmVudFVSTCA9IHRoaXMuY3VycmVudFVSTFxuICAgIGxldCByb3V0ZUNvbnRyb2xsZXJEYXRhID0gdGhpcy5fcm91dGVDb250cm9sbGVyRGF0YVxuICAgIHJvdXRlRGF0YS5sb2NhdGlvbiA9IE9iamVjdC5hc3NpZ24oXG4gICAgICByb3V0ZURhdGEubG9jYXRpb24sXG4gICAgICByb3V0ZUNvbnRyb2xsZXJEYXRhLmxvY2F0aW9uXG4gICAgKVxuICAgIHJvdXRlRGF0YS5jb250cm9sbGVyID0gcm91dGVDb250cm9sbGVyRGF0YS5jb250cm9sbGVyXG4gICAgdGhpcy5yb3V0ZURhdGEgPSByb3V0ZURhdGFcbiAgICByZXR1cm4gdGhpcy5yb3V0ZURhdGFcbiAgfVxuICBnZXQgX3JvdXRlQ29udHJvbGxlckRhdGEoKSB7XG4gICAgbGV0IHJvdXRlRGF0YSA9IHtcbiAgICAgIGxvY2F0aW9uOiB7fSxcbiAgICB9XG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5yb3V0ZXMpXG4gICAgICAuZm9yRWFjaCgoW3JvdXRlUGF0aCwgcm91dGVTZXR0aW5nc10pID0+IHtcbiAgICAgICAgbGV0IHBhdGhGcmFnbWVudHMgPSB0aGlzLnBhdGguc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgICAgIHBhdGhGcmFnbWVudHMgPSAocGF0aEZyYWdtZW50cy5sZW5ndGgpXG4gICAgICAgICAgPyBwYXRoRnJhZ21lbnRzXG4gICAgICAgICAgOiBbJy8nXVxuICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSByb3V0ZVBhdGguc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50LCBmcmFnbWVudEluZGV4KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgICAgIHJvdXRlRnJhZ21lbnRzID0gKHJvdXRlRnJhZ21lbnRzLmxlbmd0aClcbiAgICAgICAgICA/IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgICAgOiBbJy8nXVxuICAgICAgICBpZihcbiAgICAgICAgICBwYXRoRnJhZ21lbnRzLmxlbmd0aCAmJlxuICAgICAgICAgIHBhdGhGcmFnbWVudHMubGVuZ3RoID09PSByb3V0ZUZyYWdtZW50cy5sZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgbGV0IG1hdGNoXG4gICAgICAgICAgcmV0dXJuIHJvdXRlRnJhZ21lbnRzLmZpbHRlcigocm91dGVGcmFnbWVudCwgcm91dGVGcmFnbWVudEluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgbWF0Y2ggPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICBtYXRjaCA9PT0gdHJ1ZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGlmKHJvdXRlRnJhZ21lbnRbMF0gPT09ICc6Jykge1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50SURLZXkgPSByb3V0ZUZyYWdtZW50LnJlcGxhY2UoJzonLCAnJylcbiAgICAgICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICAgIHJvdXRlRnJhZ21lbnRJbmRleCA9PT0gcGF0aEZyYWdtZW50cy5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICByb3V0ZURhdGEubG9jYXRpb24uY3VycmVudElES2V5ID0gY3VycmVudElES2V5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbltjdXJyZW50SURLZXldID0gcGF0aEZyYWdtZW50c1tyb3V0ZUZyYWdtZW50SW5kZXhdXG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudCA9IHRoaXMuZnJhZ21lbnRJRFJlZ0V4cFxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJvdXRlRnJhZ21lbnQgPSByb3V0ZUZyYWdtZW50LnJlcGxhY2UobmV3IFJlZ0V4cCgnLycsICdnaScpLCAnXFxcXFxcLycpXG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudCA9IHRoaXMucm91dGVGcmFnbWVudE5hbWVSZWdFeHAocm91dGVGcmFnbWVudClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBtYXRjaCA9IHJvdXRlRnJhZ21lbnQudGVzdChwYXRoRnJhZ21lbnRzW3JvdXRlRnJhZ21lbnRJbmRleF0pXG4gICAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICAgIG1hdGNoID09PSB0cnVlICYmXG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudEluZGV4ID09PSBwYXRoRnJhZ21lbnRzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcm91dGVEYXRhLmxvY2F0aW9uLnJvdXRlID0ge1xuICAgICAgICAgICAgICAgICAgbmFtZTogcm91dGVQYXRoLFxuICAgICAgICAgICAgICAgICAgZnJhZ21lbnRzOiByb3V0ZUZyYWdtZW50cyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcm91dGVEYXRhLmNvbnRyb2xsZXIgPSByb3V0ZVNldHRpbmdzXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pWzBdXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgcmV0dXJuIHJvdXRlRGF0YVxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICBnZXQgX3JvdXRlcygpIHtcbiAgICB0aGlzLnJvdXRlcyA9ICh0aGlzLnJvdXRlcylcbiAgICAgID8gdGhpcy5yb3V0ZXNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXNcbiAgfVxuICBzZXQgX3JvdXRlcyhyb3V0ZXMpIHtcbiAgICB0aGlzLnJvdXRlcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXMsIHRoaXMuX3JvdXRlc1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXIoKSB7IHJldHVybiB0aGlzLmNvbnRyb2xsZXIgfVxuICBzZXQgX2NvbnRyb2xsZXIoY29udHJvbGxlcikgeyB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyIH1cbiAgZ2V0IF9wcmV2aW91c1VSTCgpIHsgcmV0dXJuIHRoaXMucHJldmlvdXNVUkwgfVxuICBzZXQgX3ByZXZpb3VzVVJMKHByZXZpb3VzVVJMKSB7IHRoaXMucHJldmlvdXNVUkwgPSBwcmV2aW91c1VSTCB9XG4gIGdldCBfY3VycmVudFVSTCgpIHsgcmV0dXJuIHRoaXMuY3VycmVudFVSTCB9XG4gIHNldCBfY3VycmVudFVSTChjdXJyZW50VVJMKSB7XG4gICAgaWYodGhpcy5jdXJyZW50VVJMKSB0aGlzLl9wcmV2aW91c1VSTCA9IHRoaXMuY3VycmVudFVSTFxuICAgIHRoaXMuY3VycmVudFVSTCA9IGN1cnJlbnRVUkxcbiAgfVxuICBnZXQgZnJhZ21lbnRJRFJlZ0V4cCgpIHsgcmV0dXJuIG5ldyBSZWdFeHAoL14oWzAtOUEtWlxcP1xcPVxcLFxcLlxcKlxcLVxcX1xcJ1xcXCJcXF5cXCVcXCRcXCNcXEBcXCFcXH5cXChcXClcXHtcXH1cXCZcXDxcXD5cXFxcXFwvXSkqJC8sICdnaScpIH1cbiAgcm91dGVGcmFnbWVudE5hbWVSZWdFeHAoZnJhZ21lbnQpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cCgnXicuY29uY2F0KGZyYWdtZW50LCAnJCcpKVxuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBpZihcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZW5hYmxlRW1pdHRlcnMoKVxuICAgICAgdGhpcy5lbmFibGVFdmVudHMoKVxuICAgICAgdGhpcy5lbmFibGVSb3V0ZXMoKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLmRpc2FibGVFdmVudHMoKVxuICAgICAgdGhpcy5kaXNhYmxlUm91dGVzKClcbiAgICAgIHRoaXMuZGlzYWJsZUVtaXR0ZXJzKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgfVxuICBlbmFibGVSb3V0ZXMoKSB7XG4gICAgaWYodGhpcy5zZXR0aW5ncy5jb250cm9sbGVyKSB0aGlzLl9jb250cm9sbGVyID0gdGhpcy5zZXR0aW5ncy5jb250cm9sbGVyXG4gICAgdGhpcy5fcm91dGVzID0gT2JqZWN0LmVudHJpZXModGhpcy5zZXR0aW5ncy5yb3V0ZXMpLnJlZHVjZShcbiAgICAgIChcbiAgICAgICAgX3JvdXRlcyxcbiAgICAgICAgW3JvdXRlUGF0aCwgcm91dGVTZXR0aW5nc10sXG4gICAgICAgIHJvdXRlSW5kZXgsXG4gICAgICAgIG9yaWdpbmFsUm91dGVzLFxuICAgICAgKSA9PiB7XG4gICAgICAgIF9yb3V0ZXNbcm91dGVQYXRoXSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgcm91dGVTZXR0aW5ncyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjYWxsYmFjazogdGhpcy5jb250cm9sbGVyW3JvdXRlU2V0dGluZ3MuY2FsbGJhY2tdLmJpbmQodGhpcy5jb250cm9sbGVyKSxcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuIF9yb3V0ZXNcbiAgICAgIH0sXG4gICAgICB7fVxuICAgIClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGVuYWJsZUVtaXR0ZXJzKCkge1xuICAgIHRoaXMuX2VtaXR0ZXJzID0ge1xuICAgICAgbmF2aWdhdGVFbWl0dGVyOiBuZXcgTVZDLkVtaXR0ZXJzLk5hdmlnYXRlKCksXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZGlzYWJsZUVtaXR0ZXJzKCkge1xuICAgIGRlbGV0ZSB0aGlzLl9lbWl0dGVycy5uYXZpZ2F0ZUVtaXR0ZXJcbiAgfVxuICBkaXNhYmxlUm91dGVzKCkge1xuICAgIGRlbGV0ZSB0aGlzLl9yb3V0ZXNcbiAgICBkZWxldGUgdGhpcy5fY29udHJvbGxlclxuICB9XG4gIGVuYWJsZUV2ZW50cygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMucm91dGVDaGFuZ2UuYmluZCh0aGlzKSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGVFdmVudHMoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLnJvdXRlQ2hhbmdlLmJpbmQodGhpcykpXG4gIH1cbiAgcm91dGVDaGFuZ2UoKSB7XG4gICAgdGhpcy5fY3VycmVudFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgbGV0IHJvdXRlRGF0YSA9IHRoaXMuX3JvdXRlRGF0YVxuICAgIGlmKHJvdXRlRGF0YS5jb250cm9sbGVyKSB7XG4gICAgICBsZXQgbmF2aWdhdGVFbWl0dGVyID0gdGhpcy5lbWl0dGVycy5uYXZpZ2F0ZUVtaXR0ZXJcbiAgICAgIGlmKHRoaXMucHJldmlvdXNVUkwpIHJvdXRlRGF0YS5wcmV2aW91c1VSTCA9IHRoaXMucHJldmlvdXNVUkxcbiAgICAgIG5hdmlnYXRlRW1pdHRlclxuICAgICAgICAudW5zZXQoKVxuICAgICAgICAuc2V0KHJvdXRlRGF0YSlcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgbmF2aWdhdGVFbWl0dGVyLm5hbWUsXG4gICAgICAgIG5hdmlnYXRlRW1pdHRlci5lbWlzc2lvbigpXG4gICAgICApXG4gICAgICByb3V0ZURhdGEuY29udHJvbGxlci5jYWxsYmFjayhcbiAgICAgICAgbmF2aWdhdGVFbWl0dGVyLmVtaXNzaW9uKClcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBuYXZpZ2F0ZShwYXRoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoXG4gIH1cbn1cbiJdfQ==
