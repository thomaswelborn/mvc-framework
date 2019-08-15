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
MVC.Events = class {
  constructor() {}

  get _events() {
    this.events = this.events ? this.events : {};
    return this.events;
  }

  getEventCallbacks(eventName) {
    return this._events[eventName] || {};
  }

  getEventCallbackName(eventCallback) {
    return eventCallback.name.length ? eventCallback.name : 'anonymousFunction';
  }

  getEventCallbackGroup(eventCallbacks, eventCallbackName) {
    return eventCallbacks[eventCallbackName] || [];
  }

  on(eventName, eventCallback) {
    var eventCallbacks = this.getEventCallbacks(eventName);
    var eventCallbackName = this.getEventCallbackName(eventCallback);
    var eventCallbackGroup = this.getEventCallbackGroup(eventCallbacks, eventCallbackName);
    eventCallbackGroup.push(eventCallback);
    eventCallbacks[eventCallbackName] = eventCallbackGroup;
    this._events[eventName] = eventCallbacks;
    return this;
  }

  off() {
    switch (arguments.length) {
      case 0:
        delete this._events;
        break;

      case 1:
        var eventName = arguments[0];
        delete this._events[eventName];
        break;

      case 2:
        var eventName = arguments[0];
        var eventCallback = arguments[1];
        var eventCallbackName = typeof eventCallback === 'string' ? eventCallback : this.getEventCallbackName(eventCallback);
        delete this._events[eventName][eventCallbackName];
        if (Object.keys(this._events[eventName]).length === 0) delete this._events[eventName];
        break;
    }
  }

  emit(eventName, eventData) {
    var _arguments = Object.values(arguments);

    var eventCallbacks = Object.entries(this.getEventCallbacks(eventName));

    for (var [eventCallbackGroupName, eventCallbackGroup] of eventCallbacks) {
      for (var eventCallback of eventCallbackGroup) {
        var additionalArguments = _arguments.splice(2) || [];
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
MVC.Validator = class {
  constructor(schema) {
    this._schema = schema;
  }

  get _schema() {
    return this.schema;
  }

  set _schema(schema) {
    this.schema = schema;
  }

  get _results() {
    return this.results;
  }

  set _results(results) {
    this.results = results;
  }

  get _data() {
    return this.data;
  }

  set _data(data) {
    this.data = data;
  }

  validate(data) {
    this._data = data;
    var validationSummary = {};
    Object.entries(this._schema).forEach((_ref) => {
      var [schemaKey, schemaSettings] = _ref;
      var validation = {};
      var value = data[schemaKey];
      validation.key = schemaKey;

      if (schemaSettings.required) {
        validation.required = this.required(value, schemaSettings.required);
      }

      if (schemaSettings.type) {
        validation.type = this.type(value, schemaSettings.type);
      }

      if (schemaSettings.evaluations) {
        var validationEvaluations = this.evaluations(value, schemaSettings.evaluations);
        validation.evaluations = this.evaluationResults(validationEvaluations);
      }

      validationSummary[schemaKey] = validation;
    });
    this._results = validationSummary;
    return validationSummary;
  }

  required(value, schemaSettings) {
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
  }

  type(value, schemaSettings) {
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
  }

  evaluations(value, evaluations) {
    return evaluations.reduce((_evaluations, evaluation, evaluationIndex) => {
      if (MVC.Utils.isArray(evaluation)) {
        _evaluations.push(...this.evaluations(value, evaluation));
      } else {
        evaluation.value = value;
        var valueComparison = this.compareValues(evaluation.value, evaluation.comparison.value, evaluation.comparator, evaluation.messages);
        evaluation.results = evaluation.results || {};
        evaluation.results.value = valueComparison;

        _evaluations.push(evaluation);
      }

      if (_evaluations.length > 1) {
        var currentEvaluation = _evaluations[evaluationIndex];

        if (currentEvaluation.comparison.statement) {
          var previousEvaluation = _evaluations[evaluationIndex - 1];
          var previousEvaluationComparisonValue = currentEvaluation.results.statement ? currentEvaluation.results.statement.result : currentEvaluation.results.value.result;
          var statementComparison = this.compareStatements(previousEvaluationComparisonValue, currentEvaluation.comparison.statement, currentEvaluation.results.value.result, currentEvaluation.messages);
          currentEvaluation.results = currentEvaluation.results || {};
          currentEvaluation.results.statement = statementComparison;
        }
      }

      return _evaluations;
    }, []);
  }

  evaluationResults(evaluations) {
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
  }

  compareValues(value, operator, comparator, messages) {
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
  }

  compareStatements(value, operator, comparator, messages) {
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
  }

};
MVC.Model = class extends MVC.Base {
  constructor() {
    super(...arguments);
  }

  get _validator() {
    return this.validator;
  }

  set _validator(validator) {
    this.validator = new MVC.Validator(validator);
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

    if (this._validator) {
      var validateEmitter = this.emitters.validate;

      this._validator.validate(JSON.parse(JSON.stringify(this.data)));

      validateEmitter.set({
        data: this.validator.data,
        results: this.validator.results
      });
      this.emit(validateEmitter.name, validateEmitter.emission());
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
    return this;
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

    return this;
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
    return this;
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
    return this;
  }

  parse(data) {
    data = data || this._data;
    return JSON.parse(JSON.stringify(Object.assign({}, data)));
  }

  enableEmitters() {
    Object.assign(this._emitters, this.settings.emitters, {
      validate: new MVC.Emitters.Validate()
    });
    return this;
  }

  disableEmitters() {
    delete this._emitters;
    return this;
  }

  enable() {
    var settings = this.settings;

    if (settings && !this.enabled) {
      this.enableEmitters();
      if (this.settings.validator) this._validator = this.settings.validator;
      if (this.settings.localStorage) this._localStorage = this.settings.localStorage;
      if (this.settings.histiogram) this._histiogram = this.settings.histiogram;
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

    return this;
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
      delete this._validator;
      delete this.disableEmitters();
      this._enabled = false;
    }

    return this;
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
MVC.Emitters.Validate = class extends MVC.Emitter {
  constructor() {
    super(...arguments);
    this.addSettings();
    this.enable();
  }

  addSettings() {
    this._name = 'validate';
    this._schema = {
      data: Object,
      results: Object
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
    Object.assign(this._emitters, this.settings.emitters, {
      navigateEmitter: new MVC.Emitters.Navigate()
    });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1WQy5qcyIsIkNvbnN0YW50cy5qcyIsIkV2ZW50cy5qcyIsIk9wZXJhdG9ycy5qcyIsImluZGV4LmpzIiwiaXMuanMiLCJ0eXBlT2YuanMiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QuanMiLCJvYmplY3RRdWVyeS5qcyIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMuanMiLCJDaGFubmVscy5qcyIsIkNoYW5uZWwuanMiLCJCYXNlLmpzIiwiU2VydmljZS5qcyIsIlZhbGlkYXRvci5qcyIsIk1vZGVsLmpzIiwiRW1pdHRlci5qcyIsIk5hdmlnYXRlLmpzIiwiVmFsaWRhdGUuanMiLCJWaWV3LmpzIiwiQ29udHJvbGxlci5qcyIsIlJvdXRlci5qcyJdLCJuYW1lcyI6WyJNVkMiLCJDb25zdGFudHMiLCJDT05TVCIsIkV2ZW50cyIsIkVWIiwiT3BlcmF0b3JzIiwiQ29tcGFyaXNvbiIsIkVRIiwiU1RFUSIsIk5PRVEiLCJTVE5PRVEiLCJHVCIsIkxUIiwiR1RFIiwiTFRFIiwiU3RhdGVtZW50IiwiQU5EIiwiT1IiLCJjb25zb2xlIiwibG9nIiwiVXRpbHMiLCJpc0FycmF5Iiwib2JqZWN0IiwiQXJyYXkiLCJpc09iamVjdCIsInR5cGVPZiIsInZhbHVlIiwidmFsdWVBIiwidW5kZWZpbmVkIiwiaXNIVE1MRWxlbWVudCIsIkhUTUxFbGVtZW50IiwiZGF0YSIsIl9vYmplY3QiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QiLCJ0YXJnZXRPYmplY3QiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJwcm9wZXJ0aWVzIiwicHJvcGVydHlOYW1lIiwicHJvcGVydHlWYWx1ZSIsIk9iamVjdCIsImVudHJpZXMiLCJvYmplY3RRdWVyeSIsInN0cmluZyIsImNvbnRleHQiLCJzdHJpbmdEYXRhIiwicGFyc2VOb3RhdGlvbiIsInNwbGljZSIsInJlZHVjZSIsImZyYWdtZW50IiwiZnJhZ21lbnRJbmRleCIsImZyYWdtZW50cyIsInBhcnNlRnJhZ21lbnQiLCJwcm9wZXJ0eUtleSIsIm1hdGNoIiwiY29uY2F0IiwiY2hhckF0Iiwic2xpY2UiLCJzcGxpdCIsIlJlZ0V4cCIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMiLCJ0b2dnbGVNZXRob2QiLCJldmVudHMiLCJ0YXJnZXRPYmplY3RzIiwiY2FsbGJhY2tzIiwiZXZlbnRTZXR0aW5ncyIsImV2ZW50Q2FsbGJhY2tOYW1lIiwiZXZlbnREYXRhIiwiZXZlbnRUYXJnZXRTZXR0aW5ncyIsImV2ZW50TmFtZSIsImV2ZW50VGFyZ2V0cyIsImV2ZW50VGFyZ2V0TmFtZSIsImV2ZW50VGFyZ2V0IiwiZXZlbnRNZXRob2ROYW1lIiwiTm9kZUxpc3QiLCJEb2N1bWVudCIsImV2ZW50Q2FsbGJhY2siLCJfZXZlbnRUYXJnZXQiLCJiaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzIiwidW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMiLCJjb25zdHJ1Y3RvciIsIl9ldmVudHMiLCJnZXRFdmVudENhbGxiYWNrcyIsImdldEV2ZW50Q2FsbGJhY2tOYW1lIiwibmFtZSIsImdldEV2ZW50Q2FsbGJhY2tHcm91cCIsImV2ZW50Q2FsbGJhY2tzIiwib24iLCJldmVudENhbGxiYWNrR3JvdXAiLCJwdXNoIiwib2ZmIiwia2V5cyIsImVtaXQiLCJfYXJndW1lbnRzIiwidmFsdWVzIiwiZXZlbnRDYWxsYmFja0dyb3VwTmFtZSIsImFkZGl0aW9uYWxBcmd1bWVudHMiLCJDaGFubmVscyIsIl9jaGFubmVscyIsImNoYW5uZWxzIiwiY2hhbm5lbCIsImNoYW5uZWxOYW1lIiwiQ2hhbm5lbCIsIl9yZXNwb25zZXMiLCJyZXNwb25zZXMiLCJyZXNwb25zZSIsInJlc3BvbnNlTmFtZSIsInJlc3BvbnNlQ2FsbGJhY2siLCJyZXF1ZXN0IiwicmVxdWVzdERhdGEiLCJCYXNlIiwic2V0dGluZ3MiLCJjb25maWd1cmF0aW9uIiwiX2NvbmZpZ3VyYXRpb24iLCJfc2V0dGluZ3MiLCJfZW1pdHRlcnMiLCJlbWl0dGVycyIsIlNlcnZpY2UiLCJfZGVmYXVsdHMiLCJkZWZhdWx0cyIsImNvbnRlbnRUeXBlIiwicmVzcG9uc2VUeXBlIiwiX3Jlc3BvbnNlVHlwZXMiLCJfcmVzcG9uc2VUeXBlIiwiX3hociIsImZpbmQiLCJyZXNwb25zZVR5cGVJdGVtIiwiX3R5cGUiLCJ0eXBlIiwiX3VybCIsInVybCIsIl9oZWFkZXJzIiwiaGVhZGVycyIsImZvckVhY2giLCJoZWFkZXIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwiX2RhdGEiLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIl9lbmFibGVkIiwiZW5hYmxlZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3RhdHVzIiwiYWJvcnQiLCJvcGVuIiwib25sb2FkIiwib25lcnJvciIsInNlbmQiLCJ0aGVuIiwiY3VycmVudFRhcmdldCIsImNhdGNoIiwiZXJyb3IiLCJlbmFibGUiLCJkaXNhYmxlIiwiVmFsaWRhdG9yIiwic2NoZW1hIiwiX3NjaGVtYSIsIl9yZXN1bHRzIiwicmVzdWx0cyIsInZhbGlkYXRlIiwidmFsaWRhdGlvblN1bW1hcnkiLCJzY2hlbWFLZXkiLCJzY2hlbWFTZXR0aW5ncyIsInZhbGlkYXRpb24iLCJrZXkiLCJyZXF1aXJlZCIsImV2YWx1YXRpb25zIiwidmFsaWRhdGlvbkV2YWx1YXRpb25zIiwiZXZhbHVhdGlvblJlc3VsdHMiLCJtZXNzYWdlcyIsImFzc2lnbiIsInBhc3MiLCJmYWlsIiwiY29tcGFyYXRvciIsInJlc3VsdCIsIm1lc3NhZ2UiLCJfZXZhbHVhdGlvbnMiLCJldmFsdWF0aW9uIiwiZXZhbHVhdGlvbkluZGV4IiwidmFsdWVDb21wYXJpc29uIiwiY29tcGFyZVZhbHVlcyIsImNvbXBhcmlzb24iLCJjdXJyZW50RXZhbHVhdGlvbiIsInN0YXRlbWVudCIsInByZXZpb3VzRXZhbHVhdGlvbiIsInByZXZpb3VzRXZhbHVhdGlvbkNvbXBhcmlzb25WYWx1ZSIsInN0YXRlbWVudENvbXBhcmlzb24iLCJjb21wYXJlU3RhdGVtZW50cyIsImV2YWx1YXRpb25WYWxpZGF0aW9uIiwib3BlcmF0b3IiLCJldmFsdWF0aW9uUmVzdWx0IiwiTW9kZWwiLCJfdmFsaWRhdG9yIiwidmFsaWRhdG9yIiwiX2lzU2V0dGluZyIsImlzU2V0dGluZyIsIl9jaGFuZ2luZyIsImNoYW5naW5nIiwiX2xvY2FsU3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsIl9oaXN0aW9ncmFtIiwiaGlzdGlvZ3JhbSIsIl9oaXN0b3J5IiwiaGlzdG9yeSIsInVuc2hpZnQiLCJwYXJzZSIsIl9kYiIsImRiIiwiZ2V0SXRlbSIsImVuZHBvaW50IiwiSlNPTiIsInN0cmluZ2lmeSIsInNldEl0ZW0iLCJfZGF0YUV2ZW50cyIsImRhdGFFdmVudHMiLCJfZGF0YUNhbGxiYWNrcyIsImRhdGFDYWxsYmFja3MiLCJfc2VydmljZXMiLCJzZXJ2aWNlcyIsIl9zZXJ2aWNlRXZlbnRzIiwic2VydmljZUV2ZW50cyIsIl9zZXJ2aWNlQ2FsbGJhY2tzIiwic2VydmljZUNhbGxiYWNrcyIsImVuYWJsZVNlcnZpY2VFdmVudHMiLCJkaXNhYmxlU2VydmljZUV2ZW50cyIsImVuYWJsZURhdGFFdmVudHMiLCJkaXNhYmxlRGF0YUV2ZW50cyIsInNldERlZmF1bHRzIiwic2V0IiwiZ2V0IiwiaW5kZXgiLCJzZXREYXRhUHJvcGVydHkiLCJzZXREQiIsInZhbGlkYXRlRW1pdHRlciIsImVtaXNzaW9uIiwidW5zZXQiLCJ1bnNldERhdGFQcm9wZXJ0eSIsInVuc2V0REIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiY29uZmlndXJhYmxlIiwic2V0VmFsdWVFdmVudE5hbWUiLCJqb2luIiwic2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZUV2ZW50TmFtZSIsInVuc2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZSIsImVuYWJsZUVtaXR0ZXJzIiwiRW1pdHRlcnMiLCJWYWxpZGF0ZSIsImRpc2FibGVFbWl0dGVycyIsIkVtaXR0ZXIiLCJfbmFtZSIsIk5hdmlnYXRlIiwiYWRkU2V0dGluZ3MiLCJvbGRVUkwiLCJTdHJpbmciLCJuZXdVUkwiLCJjdXJyZW50Um91dGUiLCJjdXJyZW50Q29udHJvbGxlciIsIlZpZXciLCJfZWxlbWVudE5hbWUiLCJfZWxlbWVudCIsInRhZ05hbWUiLCJlbGVtZW50TmFtZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZWxlbWVudE9ic2VydmVyIiwib2JzZXJ2ZSIsInN1YnRyZWUiLCJjaGlsZExpc3QiLCJfYXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVLZXkiLCJhdHRyaWJ1dGVWYWx1ZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsIl91aSIsInVpIiwidWlLZXkiLCJ1aVZhbHVlIiwicXVlcnlTZWxlY3RvckFsbCIsIl91aUV2ZW50cyIsInVpRXZlbnRzIiwiX3VpQ2FsbGJhY2tzIiwidWlDYWxsYmFja3MiLCJfb2JzZXJ2ZXJDYWxsYmFja3MiLCJvYnNlcnZlckNhbGxiYWNrcyIsIl9lbGVtZW50T2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZWxlbWVudE9ic2VydmUiLCJiaW5kIiwiX2luc2VydCIsImluc2VydCIsIl90ZW1wbGF0ZXMiLCJ0ZW1wbGF0ZXMiLCJtdXRhdGlvblJlY29yZExpc3QiLCJvYnNlcnZlciIsIm11dGF0aW9uUmVjb3JkSW5kZXgiLCJtdXRhdGlvblJlY29yZCIsIm11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcyIsIm11dGF0aW9uUmVjb3JkQ2F0ZWdvcnkiLCJyZXNldFVJIiwiYXV0b0luc2VydCIsImluc2VydEFkamFjZW50RWxlbWVudCIsIm1ldGhvZCIsImF1dG9SZW1vdmUiLCJwYXJlbnRFbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJlbmFibGVFbGVtZW50IiwiZGlzYWJsZUVsZW1lbnQiLCJkaXNhYmxlVUkiLCJlbmFibGVVSSIsImVuYWJsZVVJRXZlbnRzIiwiZGlzYWJsZVVJRXZlbnRzIiwidGhpc3MiLCJDb250cm9sbGVyIiwiX2VtaXR0ZXJDYWxsYmFja3MiLCJlbWl0dGVyQ2FsbGJhY2tzIiwiX21vZGVsQ2FsbGJhY2tzIiwibW9kZWxDYWxsYmFja3MiLCJfdmlld0NhbGxiYWNrcyIsInZpZXdDYWxsYmFja3MiLCJfY29udHJvbGxlckNhbGxiYWNrcyIsImNvbnRyb2xsZXJDYWxsYmFja3MiLCJfbW9kZWxzIiwibW9kZWxzIiwiX3ZpZXdzIiwidmlld3MiLCJfY29udHJvbGxlcnMiLCJjb250cm9sbGVycyIsIl9yb3V0ZXJzIiwicm91dGVycyIsIl9yb3V0ZXJFdmVudHMiLCJyb3V0ZXJFdmVudHMiLCJfcm91dGVyQ2FsbGJhY2tzIiwicm91dGVyQ2FsbGJhY2tzIiwiX2VtaXR0ZXJFdmVudHMiLCJlbWl0dGVyRXZlbnRzIiwiX21vZGVsRXZlbnRzIiwibW9kZWxFdmVudHMiLCJfdmlld0V2ZW50cyIsInZpZXdFdmVudHMiLCJfY29udHJvbGxlckV2ZW50cyIsImNvbnRyb2xsZXJFdmVudHMiLCJlbmFibGVNb2RlbEV2ZW50cyIsImRpc2FibGVNb2RlbEV2ZW50cyIsImVuYWJsZVZpZXdFdmVudHMiLCJkaXNhYmxlVmlld0V2ZW50cyIsImVuYWJsZUNvbnRyb2xsZXJFdmVudHMiLCJkaXNhYmxlQ29udHJvbGxlckV2ZW50cyIsImVuYWJsZUVtaXR0ZXJFdmVudHMiLCJkaXNhYmxlRW1pdHRlckV2ZW50cyIsImVuYWJsZVJvdXRlckV2ZW50cyIsImRpc2FibGVSb3V0ZXJFdmVudHMiLCJyZXNldCIsIlJvdXRlciIsInByb3RvY29sIiwid2luZG93IiwibG9jYXRpb24iLCJob3N0bmFtZSIsInBvcnQiLCJwYXRoIiwicGF0aG5hbWUiLCJoYXNoIiwiaHJlZiIsImhhc2hJbmRleCIsImluZGV4T2YiLCJwYXJhbUluZGV4Iiwic2xpY2VTdGFydCIsInNsaWNlU3RvcCIsInBhcmFtcyIsIl9yb3V0ZURhdGEiLCJyb3V0ZURhdGEiLCJjb250cm9sbGVyIiwiZmlsdGVyIiwiaGFzaEZyYWdtZW50cyIsInBhcmFtRGF0YSIsInBhcmFtc1RvT2JqZWN0IiwiY3VycmVudFVSTCIsInJvdXRlQ29udHJvbGxlckRhdGEiLCJfcm91dGVDb250cm9sbGVyRGF0YSIsInJvdXRlcyIsInJvdXRlUGF0aCIsInJvdXRlU2V0dGluZ3MiLCJwYXRoRnJhZ21lbnRzIiwicm91dGVGcmFnbWVudHMiLCJyb3V0ZUZyYWdtZW50Iiwicm91dGVGcmFnbWVudEluZGV4IiwiY3VycmVudElES2V5IiwicmVwbGFjZSIsImZyYWdtZW50SURSZWdFeHAiLCJyb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cCIsInRlc3QiLCJyb3V0ZSIsIl9yb3V0ZXMiLCJfY29udHJvbGxlciIsIl9wcmV2aW91c1VSTCIsInByZXZpb3VzVVJMIiwiX2N1cnJlbnRVUkwiLCJlbmFibGVFdmVudHMiLCJlbmFibGVSb3V0ZXMiLCJkaXNhYmxlRXZlbnRzIiwiZGlzYWJsZVJvdXRlcyIsInJvdXRlSW5kZXgiLCJvcmlnaW5hbFJvdXRlcyIsImNhbGxiYWNrIiwibmF2aWdhdGVFbWl0dGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJvdXRlQ2hhbmdlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm5hdmlnYXRlIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxHQUFHLEdBQUdBLEdBQUcsSUFBSSxFQUFqQjtBQ0FBQSxHQUFHLENBQUNDLFNBQUosR0FBZ0IsRUFBaEI7QUFDQUQsR0FBRyxDQUFDRSxLQUFKLEdBQVlGLEdBQUcsQ0FBQ0MsU0FBaEI7QUNEQUQsR0FBRyxDQUFDQyxTQUFKLENBQWNFLE1BQWQsR0FBdUIsRUFBdkI7QUFDQUgsR0FBRyxDQUFDRSxLQUFKLENBQVVFLEVBQVYsR0FBZUosR0FBRyxDQUFDQyxTQUFKLENBQWNFLE1BQTdCO0FDREFILEdBQUcsQ0FBQ0MsU0FBSixDQUFjSSxTQUFkLEdBQTBCLEVBQTFCO0FBQ0FMLEdBQUcsQ0FBQ0UsS0FBSixDQUFVRyxTQUFWLEdBQXNCLEVBQXRCO0FBQ0FMLEdBQUcsQ0FBQ0UsS0FBSixDQUFVRyxTQUFWLENBQW9CQyxVQUFwQixHQUFpQztBQUMvQkMsRUFBQUEsRUFBRSxFQUFFLElBRDJCO0FBRS9CQyxFQUFB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QUFLdFMsUUFBTCxDQUFjc1MsZUFBcEM7QUFDQSxVQUFHLEtBQUtULFdBQVIsRUFBcUJ6QixTQUFTLENBQUN5QixXQUFWLEdBQXdCLEtBQUtBLFdBQTdCO0FBQ3JCUyxNQUFBQSxlQUFlLENBQ1o3SyxLQURILEdBRUdQLEdBRkgsQ0FFT2tKLFNBRlA7QUFHQSxXQUFLNVIsSUFBTCxDQUNFOFQsZUFBZSxDQUFDdFUsSUFEbEIsRUFFRXNVLGVBQWUsQ0FBQzlLLFFBQWhCLEVBRkY7QUFJQTRJLE1BQUFBLFNBQVMsQ0FBQ0MsVUFBVixDQUFxQmdDLFFBQXJCLENBQ0VDLGVBQWUsQ0FBQzlLLFFBQWhCLEVBREY7QUFHRDs7QUFDRCxXQUFPLElBQVA7QUFDRDs7QUFDRGtMLEVBQUFBLFFBQVEsQ0FBQ2pELElBQUQsRUFBTztBQUNiSixJQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JNLElBQWhCLEdBQXVCSCxJQUF2QjtBQUNEOztBQXhSaUMsQ0FBcEMiLCJmaWxlIjoiYnJvd3Nlci9tdmMtZnJhbWV3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE1WQyA9IE1WQyB8fCB7fVxyXG4iLCJNVkMuQ29uc3RhbnRzID0ge31cbk1WQy5DT05TVCA9IE1WQy5Db25zdGFudHNcbiIsIk1WQy5Db25zdGFudHMuRXZlbnRzID0ge31cclxuTVZDLkNPTlNULkVWID0gTVZDLkNvbnN0YW50cy5FdmVudHNcclxuIiwiTVZDLkNvbnN0YW50cy5PcGVyYXRvcnMgPSB7fVxyXG5NVkMuQ09OU1QuT3BlcmF0b3JzID0ge31cclxuTVZDLkNPTlNULk9wZXJhdG9ycy5Db21wYXJpc29uID0ge1xyXG4gIEVROiAnRVEnLFxyXG4gIFNURVE6ICdTVEVRJyxcclxuICBOT0VROiAnTk9FUScsXHJcbiAgU1ROT0VROiAnU1ROT0VRJyxcclxuICBHVDogJ0dUJyxcclxuICBMVDogJ0xUJyxcclxuICBHVEU6ICdHVEUnLFxyXG4gIExURTogJ0xURScsXHJcbn1cclxuTVZDLkNPTlNULk9wZXJhdG9ycy5TdGF0ZW1lbnQgPSB7XHJcbiAgQU5EOiAnQU5EJyxcclxuICBPUjogJ09SJ1xyXG59XHJcbmNvbnNvbGUubG9nKE1WQy5DT05TVClcclxuIiwiTVZDLkVtaXR0ZXJzID0ge31cclxuIiwiTVZDLlV0aWxzLmlzQXJyYXkgPSBmdW5jdGlvbiBpc0FycmF5KG9iamVjdCkgeyByZXR1cm4gQXJyYXkuaXNBcnJheShvYmplY3QpIH1cclxuTVZDLlV0aWxzLmlzT2JqZWN0ID0gZnVuY3Rpb24gaXNPYmplY3Qob2JqZWN0KSB7XHJcbiAgcmV0dXJuIChcclxuICAgICFBcnJheS5pc0FycmF5KG9iamVjdCkgJiZcclxuICAgIG9iamVjdCAhPT0gbnVsbFxyXG4gICkgPyB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0J1xyXG4gICAgOiBmYWxzZVxyXG59XHJcbk1WQy5VdGlscy50eXBlT2YgPSBmdW5jdGlvbiB0eXBlT2YodmFsdWUpIHtcclxuICByZXR1cm4gKHR5cGVvZiB2YWx1ZUEgPT09ICdvYmplY3QnKVxyXG4gICAgPyAoTVZDLlV0aWxzLmlzT2JqZWN0KHZhbHVlQSkpXHJcbiAgICAgID8gJ29iamVjdCdcclxuICAgICAgOiAoTVZDLlV0aWxzLmlzQXJyYXkodmFsdWVBKSlcclxuICAgICAgICA/ICdhcnJheSdcclxuICAgICAgICA6ICh2YWx1ZUEgPT09IG51bGwpXHJcbiAgICAgICAgICA/ICdudWxsJ1xyXG4gICAgICAgICAgOiB1bmRlZmluZWRcclxuICAgIDogdHlwZW9mIHZhbHVlXHJcbn1cclxuTVZDLlV0aWxzLmlzSFRNTEVsZW1lbnQgPSBmdW5jdGlvbiBpc0hUTUxFbGVtZW50KG9iamVjdCkge1xyXG4gIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxyXG59XHJcbiIsIk1WQy5VdGlscy50eXBlT2YgPSAgZnVuY3Rpb24gdHlwZU9mKGRhdGEpIHtcclxuICBzd2l0Y2godHlwZW9mIGRhdGEpIHtcclxuICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgIGxldCBfb2JqZWN0XHJcbiAgICAgIGlmKE1WQy5VdGlscy5pc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgLy8gQXJyYXlcclxuICAgICAgICByZXR1cm4gJ2FycmF5J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgTVZDLlV0aWxzLmlzT2JqZWN0KGRhdGEpXHJcbiAgICAgICkge1xyXG4gICAgICAgIC8vIE9iamVjdFxyXG4gICAgICAgIHJldHVybiAnb2JqZWN0J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgZGF0YSA9PT0gbnVsbFxyXG4gICAgICApIHtcclxuICAgICAgICAvLyBOdWxsXHJcbiAgICAgICAgcmV0dXJuICdudWxsJ1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBfb2JqZWN0XHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgY2FzZSAnbnVtYmVyJzpcclxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgcmV0dXJuIHR5cGVvZiBkYXRhXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QgPSBmdW5jdGlvbiBhZGRQcm9wZXJ0aWVzVG9PYmplY3QoKSB7XHJcbiAgbGV0IHRhcmdldE9iamVjdFxyXG4gIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICBjYXNlIDI6XHJcbiAgICAgIGxldCBwcm9wZXJ0aWVzID0gYXJndW1lbnRzWzBdXHJcbiAgICAgIHRhcmdldE9iamVjdCA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICBmb3IobGV0IFtwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BlcnRpZXMpKSB7XHJcbiAgICAgICAgdGFyZ2V0T2JqZWN0W3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlXHJcbiAgICAgIH1cclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgMzpcclxuICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICBsZXQgcHJvcGVydHlWYWx1ZSA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICB0YXJnZXRPYmplY3QgPSBhcmd1bWVudHNbMl1cclxuICAgICAgdGFyZ2V0T2JqZWN0W3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIHJldHVybiB0YXJnZXRPYmplY3RcclxufVxyXG4iLCJNVkMuVXRpbHMub2JqZWN0UXVlcnkgPSBmdW5jdGlvbiBvYmplY3RRdWVyeShcclxuICBzdHJpbmcsXHJcbiAgY29udGV4dFxyXG4pIHtcclxuICBsZXQgc3RyaW5nRGF0YSA9IE1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZU5vdGF0aW9uKHN0cmluZylcclxuICBpZihzdHJpbmdEYXRhWzBdID09PSAnQCcpIHN0cmluZ0RhdGEuc3BsaWNlKDAsIDEpXHJcbiAgaWYoIXN0cmluZ0RhdGEubGVuZ3RoKSByZXR1cm4gY29udGV4dFxyXG4gIGNvbnRleHQgPSAoTVZDLlV0aWxzLmlzT2JqZWN0KGNvbnRleHQpKVxyXG4gICAgPyBPYmplY3QuZW50cmllcyhjb250ZXh0KVxyXG4gICAgOiBjb250ZXh0XHJcbiAgcmV0dXJuIHN0cmluZ0RhdGEucmVkdWNlKChvYmplY3QsIGZyYWdtZW50LCBmcmFnbWVudEluZGV4LCBmcmFnbWVudHMpID0+IHtcclxuICAgIGxldCBwcm9wZXJ0aWVzID0gW11cclxuICAgIGZyYWdtZW50ID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlRnJhZ21lbnQoZnJhZ21lbnQpXHJcbiAgICBmb3IobGV0IFtwcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV0gb2Ygb2JqZWN0KSB7XHJcbiAgICAgIGlmKHByb3BlcnR5S2V5Lm1hdGNoKGZyYWdtZW50KSkge1xyXG4gICAgICAgIGlmKGZyYWdtZW50SW5kZXggPT09IGZyYWdtZW50cy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoW1twcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV1dKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoT2JqZWN0LmVudHJpZXMocHJvcGVydHlWYWx1ZSkpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBvYmplY3QgPSBwcm9wZXJ0aWVzXHJcbiAgICByZXR1cm4gb2JqZWN0XHJcbiAgfSwgY29udGV4dClcclxufVxyXG5NVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VOb3RhdGlvbiA9IGZ1bmN0aW9uIHBhcnNlTm90YXRpb24oc3RyaW5nKSB7XHJcbiAgaWYoXHJcbiAgICBzdHJpbmcuY2hhckF0KDApID09PSAnWycgJiZcclxuICAgIHN0cmluZy5jaGFyQXQoc3RyaW5nLmxlbmd0aCAtIDEpID09ICddJ1xyXG4gICkge1xyXG4gICAgc3RyaW5nID0gc3RyaW5nXHJcbiAgICAgIC5zbGljZSgxLCAtMSlcclxuICAgICAgLnNwbGl0KCddWycpXHJcbiAgfSBlbHNlIHtcclxuICAgIHN0cmluZyA9IHN0cmluZ1xyXG4gICAgICAuc3BsaXQoJy4nKVxyXG4gIH1cclxuICByZXR1cm4gc3RyaW5nXHJcbn1cclxuTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlRnJhZ21lbnQgPSBmdW5jdGlvbiBwYXJzZUZyYWdtZW50KGZyYWdtZW50KSB7XHJcbiAgaWYoXHJcbiAgICBmcmFnbWVudC5jaGFyQXQoMCkgPT09ICcvJyAmJlxyXG4gICAgZnJhZ21lbnQuY2hhckF0KGZyYWdtZW50Lmxlbmd0aCAtIDEpID09ICcvJ1xyXG4gICkge1xyXG4gICAgZnJhZ21lbnQgPSBmcmFnbWVudC5zbGljZSgxLCAtMSlcclxuICAgIGZyYWdtZW50ID0gbmV3IFJlZ0V4cCgnXicuY29uY2F0KGZyYWdtZW50LCAnJCcpKVxyXG4gIH1cclxuICByZXR1cm4gZnJhZ21lbnRcclxufVxyXG4iLCJNVkMuVXRpbHMudG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIHRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoXHJcbiAgdG9nZ2xlTWV0aG9kLFxyXG4gIGV2ZW50cyxcclxuICB0YXJnZXRPYmplY3RzLFxyXG4gIGNhbGxiYWNrc1xyXG4pIHtcclxuICBmb3IobGV0IFtldmVudFNldHRpbmdzLCBldmVudENhbGxiYWNrTmFtZV0gb2YgT2JqZWN0LmVudHJpZXMoZXZlbnRzKSkge1xyXG4gICAgbGV0IGV2ZW50RGF0YSA9IGV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxyXG4gICAgbGV0IGV2ZW50VGFyZ2V0U2V0dGluZ3MgPSBldmVudERhdGFbMF1cclxuICAgIGxldCBldmVudE5hbWUgPSBldmVudERhdGFbMV1cclxuICAgIGxldCBldmVudFRhcmdldHMgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkoXHJcbiAgICAgIGV2ZW50VGFyZ2V0U2V0dGluZ3MsXHJcbiAgICAgIHRhcmdldE9iamVjdHNcclxuICAgIClcclxuICAgIGV2ZW50VGFyZ2V0cyA9ICghTVZDLlV0aWxzLmlzQXJyYXkoZXZlbnRUYXJnZXRzKSlcclxuICAgICAgPyBbWydAJywgZXZlbnRUYXJnZXRzXV1cclxuICAgICAgOiBldmVudFRhcmdldHNcclxuICAgIGZvcihsZXQgW2V2ZW50VGFyZ2V0TmFtZSwgZXZlbnRUYXJnZXRdIG9mIGV2ZW50VGFyZ2V0cykge1xyXG4gICAgICBsZXQgZXZlbnRNZXRob2ROYW1lID0gKHRvZ2dsZU1ldGhvZCA9PT0gJ29uJylcclxuICAgICAgPyAoXHJcbiAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCB8fFxyXG4gICAgICAgIChcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgRG9jdW1lbnRcclxuICAgICAgICApXHJcbiAgICAgICkgPyAnYWRkRXZlbnRMaXN0ZW5lcidcclxuICAgICAgICA6ICdvbidcclxuICAgICAgOiAoXHJcbiAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCB8fFxyXG4gICAgICAgIChcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgRG9jdW1lbnRcclxuICAgICAgICApXHJcbiAgICAgICkgPyAncmVtb3ZlRXZlbnRMaXN0ZW5lcidcclxuICAgICAgICA6ICdvZmYnXHJcbiAgICAgIGxldCBldmVudENhbGxiYWNrID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5KFxyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2tOYW1lLFxyXG4gICAgICAgIGNhbGxiYWNrc1xyXG4gICAgICApWzBdWzFdXHJcbiAgICAgIGlmKGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuICAgICAgICBmb3IobGV0IF9ldmVudFRhcmdldCBvZiBldmVudFRhcmdldCkge1xyXG4gICAgICAgICAgX2V2ZW50VGFyZ2V0W2V2ZW50TWV0aG9kTmFtZV0oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmKGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICBldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5NVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIGJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMoKSB7XHJcbiAgdGhpcy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKCdvbicsIC4uLmFyZ3VtZW50cylcclxufVxyXG5NVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMgPSBmdW5jdGlvbiB1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cygpIHtcclxuICB0aGlzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoJ29mZicsIC4uLmFyZ3VtZW50cylcclxufVxyXG4iLCJNVkMuQ2hhbm5lbHMgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfY2hhbm5lbHMoKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzID0gKHRoaXMuY2hhbm5lbHMpXHJcbiAgICAgID8gdGhpcy5jaGFubmVsc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsc1xyXG4gIH1cclxuICBjaGFubmVsKGNoYW5uZWxOYW1lKSB7XHJcbiAgICB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0gPSAodGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdKVxyXG4gICAgICA/IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA6IG5ldyBNVkMuQ2hhbm5lbHMuQ2hhbm5lbCgpXHJcbiAgICByZXR1cm4gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG4gIG9mZihjaGFubmVsTmFtZSkge1xyXG4gICAgZGVsZXRlIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxufVxyXG4iLCJNVkMuQ2hhbm5lbHMuQ2hhbm5lbCA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9yZXNwb25zZXMoKSB7XHJcbiAgICB0aGlzLnJlc3BvbnNlcyA9ICh0aGlzLnJlc3BvbnNlcylcclxuICAgICAgPyB0aGlzLnJlc3BvbnNlc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZihyZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdID0gcmVzcG9uc2VDYWxsYmFja1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZV1cclxuICAgIH1cclxuICB9XHJcbiAgcmVxdWVzdChyZXNwb25zZU5hbWUsIHJlcXVlc3REYXRhKSB7XHJcbiAgICBpZih0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0ocmVxdWVzdERhdGEpXHJcbiAgICB9XHJcbiAgfVxyXG4gIG9mZihyZXNwb25zZU5hbWUpIHtcclxuICAgIGlmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvcihsZXQgW3Jlc3BvbnNlTmFtZV0gb2YgT2JqZWN0LmtleXModGhpcy5fcmVzcG9uc2VzKSkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIk1WQy5CYXNlID0gY2xhc3MgZXh0ZW5kcyBNVkMuRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncywgY29uZmlndXJhdGlvbikge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgaWYoY29uZmlndXJhdGlvbikgdGhpcy5fY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb25cclxuICAgIGlmKHNldHRpbmdzKSB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgfVxyXG4gIGdldCBfY29uZmlndXJhdGlvbigpIHtcclxuICAgIHRoaXMuY29uZmlndXJhdGlvbiA9ICh0aGlzLmNvbmZpZ3VyYXRpb24pXHJcbiAgICAgID8gdGhpcy5jb25maWd1cmF0aW9uXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25cclxuICB9XHJcbiAgc2V0IF9jb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHsgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbiB9XHJcbiAgZ2V0IF9zZXR0aW5ncygpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSAodGhpcy5zZXR0aW5ncylcclxuICAgICAgPyB0aGlzLnNldHRpbmdzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLnNldHRpbmdzXHJcbiAgfVxyXG4gIHNldCBfc2V0dGluZ3Moc2V0dGluZ3MpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxyXG4gICAgICBzZXR0aW5ncywgdGhpcy5fc2V0dGluZ3NcclxuICAgIClcclxuICB9XHJcbiAgZ2V0IF9lbWl0dGVycygpIHtcclxuICAgIHRoaXMuZW1pdHRlcnMgPSAodGhpcy5lbWl0dGVycylcclxuICAgICAgPyB0aGlzLmVtaXR0ZXJzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXJzXHJcbiAgfVxyXG4gIHNldCBfZW1pdHRlcnMoZW1pdHRlcnMpIHtcclxuICAgIHRoaXMuZW1pdHRlcnMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxyXG4gICAgICBlbWl0dGVycywgdGhpcy5fZW1pdHRlcnNcclxuICAgIClcclxuICB9XHJcbn1cclxuIiwiTVZDLlNlcnZpY2UgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLmRlZmF1bHRzIHx8IHtcbiAgICBjb250ZW50VHlwZTogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICB9IH1cbiAgZ2V0IF9yZXNwb25zZVR5cGVzKCkgeyByZXR1cm4gWycnLCAnYXJyYXlidWZmZXInLCAnYmxvYicsICdkb2N1bWVudCcsICdqc29uJywgJ3RleHQnXSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlKCkgeyByZXR1cm4gdGhpcy5yZXNwb25zZVR5cGUgfVxuICBzZXQgX3Jlc3BvbnNlVHlwZShyZXNwb25zZVR5cGUpIHtcbiAgICB0aGlzLl94aHIucmVzcG9uc2VUeXBlID0gdGhpcy5fcmVzcG9uc2VUeXBlcy5maW5kKFxuICAgICAgKHJlc3BvbnNlVHlwZUl0ZW0pID0+IHJlc3BvbnNlVHlwZUl0ZW0gPT09IHJlc3BvbnNlVHlwZVxuICAgICkgfHwgdGhpcy5fZGVmYXVsdHMucmVzcG9uc2VUeXBlXG4gIH1cbiAgZ2V0IF90eXBlKCkgeyByZXR1cm4gdGhpcy50eXBlIH1cbiAgc2V0IF90eXBlKHR5cGUpIHsgdGhpcy50eXBlID0gdHlwZSB9XG4gIGdldCBfdXJsKCkgeyByZXR1cm4gdGhpcy51cmwgfVxuICBzZXQgX3VybCh1cmwpIHsgdGhpcy51cmwgPSB1cmwgfVxuICBnZXQgX2hlYWRlcnMoKSB7IHJldHVybiB0aGlzLmhlYWRlcnMgfHwgW10gfVxuICBzZXQgX2hlYWRlcnMoaGVhZGVycykge1xuICAgIHRoaXMuX2hlYWRlcnMubGVuZ3RoID0gMFxuICAgIGhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICB0aGlzLl9oZWFkZXJzLnB1c2goaGVhZGVyKVxuICAgICAgaGVhZGVyID0gT2JqZWN0LmVudHJpZXMoaGVhZGVyKVswXVxuICAgICAgdGhpcy5feGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgfSlcbiAgfVxuICBnZXQgX2RhdGEoKSB7IHJldHVybiB0aGlzLmRhdGEgfVxuICBzZXQgX2RhdGEoZGF0YSkgeyB0aGlzLmRhdGEgPSBkYXRhIH1cbiAgZ2V0IF94aHIoKSB7XG4gICAgdGhpcy54aHIgPSAodGhpcy54aHIpXG4gICAgICA/IHRoaXMueGhyXG4gICAgICA6IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgcmV0dXJuIHRoaXMueGhyXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIHJlcXVlc3QoZGF0YSkge1xuICAgIGRhdGEgPSBkYXRhIHx8IHRoaXMuZGF0YSB8fCBudWxsXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmKHRoaXMuX3hoci5zdGF0dXMgPT09IDIwMCkgdGhpcy5feGhyLmFib3J0KClcbiAgICAgIHRoaXMuX3hoci5vcGVuKHRoaXMudHlwZSwgdGhpcy51cmwpXG4gICAgICB0aGlzLl9oZWFkZXJzID0gdGhpcy5zZXR0aW5ncy5oZWFkZXJzIHx8IFt0aGlzLl9kZWZhdWx0cy5jb250ZW50VHlwZV1cbiAgICAgIHRoaXMuX3hoci5vbmxvYWQgPSByZXNvbHZlXG4gICAgICB0aGlzLl94aHIub25lcnJvciA9IHJlamVjdFxuICAgICAgdGhpcy5feGhyLnNlbmQoZGF0YSlcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgdGhpcy5lbWl0KCd4aHI6cmVzb2x2ZScsIHtcbiAgICAgICAgbmFtZTogJ3hocjpyZXNvbHZlJyxcbiAgICAgICAgZGF0YTogcmVzcG9uc2UuY3VycmVudFRhcmdldCxcbiAgICAgIH0pXG4gICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHsgdGhyb3cgZXJyb3IgfSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgIXRoaXMuZW5hYmxlZCAmJlxuICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgaWYoc2V0dGluZ3MudHlwZSkgdGhpcy5fdHlwZSA9IHNldHRpbmdzLnR5cGVcbiAgICAgIGlmKHNldHRpbmdzLnVybCkgdGhpcy5fdXJsID0gc2V0dGluZ3MudXJsXG4gICAgICBpZihzZXR0aW5ncy5kYXRhKSB0aGlzLl9kYXRhID0gc2V0dGluZ3MuZGF0YSB8fCBudWxsXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnJlc3BvbnNlVHlwZSkgdGhpcy5fcmVzcG9uc2VUeXBlID0gdGhpcy5fc2V0dGluZ3MucmVzcG9uc2VUeXBlXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgdGhpcy5lbmFibGVkICYmXG4gICAgICBPYmplY3Qua2V5cyhzZXR0aW5ncykubGVuZ3RoXG4gICAgKSB7XG4gICAgICBkZWxldGUgdGhpcy5fdHlwZVxuICAgICAgZGVsZXRlIHRoaXMuX3VybFxuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFcbiAgICAgIGRlbGV0ZSB0aGlzLl9oZWFkZXJzXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VUeXBlXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuIiwiTVZDLlZhbGlkYXRvciA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcihzY2hlbWEpIHtcclxuICAgIHRoaXMuX3NjaGVtYSA9IHNjaGVtYVxyXG4gIH1cclxuICBnZXQgX3NjaGVtYSgpIHsgcmV0dXJuIHRoaXMuc2NoZW1hIH1cclxuICBzZXQgX3NjaGVtYShzY2hlbWEpIHsgdGhpcy5zY2hlbWEgPSBzY2hlbWEgfVxyXG4gIGdldCBfcmVzdWx0cygpIHsgcmV0dXJuIHRoaXMucmVzdWx0cyB9XHJcbiAgc2V0IF9yZXN1bHRzKHJlc3VsdHMpIHsgdGhpcy5yZXN1bHRzID0gcmVzdWx0cyB9XHJcbiAgZ2V0IF9kYXRhKCkgeyByZXR1cm4gdGhpcy5kYXRhIH1cclxuICBzZXQgX2RhdGEoZGF0YSkgeyB0aGlzLmRhdGEgPSBkYXRhIH1cclxuICB2YWxpZGF0ZShkYXRhKSB7XHJcbiAgICB0aGlzLl9kYXRhID0gZGF0YVxyXG4gICAgbGV0IHZhbGlkYXRpb25TdW1tYXJ5ID0ge31cclxuICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuX3NjaGVtYSlcclxuICAgICAgLmZvckVhY2goKFtzY2hlbWFLZXksIHNjaGVtYVNldHRpbmdzXSkgPT4ge1xyXG4gICAgICAgIGxldCB2YWxpZGF0aW9uID0ge31cclxuICAgICAgICBsZXQgdmFsdWUgPSBkYXRhW3NjaGVtYUtleV1cclxuICAgICAgICB2YWxpZGF0aW9uLmtleSA9IHNjaGVtYUtleVxyXG4gICAgICAgIGlmKHNjaGVtYVNldHRpbmdzLnJlcXVpcmVkKSB7XHJcbiAgICAgICAgICB2YWxpZGF0aW9uLnJlcXVpcmVkID0gdGhpcy5yZXF1aXJlZCh2YWx1ZSwgc2NoZW1hU2V0dGluZ3MucmVxdWlyZWQpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHNjaGVtYVNldHRpbmdzLnR5cGUpIHtcclxuICAgICAgICAgIHZhbGlkYXRpb24udHlwZSA9IHRoaXMudHlwZSh2YWx1ZSwgc2NoZW1hU2V0dGluZ3MudHlwZSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc2NoZW1hU2V0dGluZ3MuZXZhbHVhdGlvbnMpIHtcclxuICAgICAgICAgIGxldCB2YWxpZGF0aW9uRXZhbHVhdGlvbnMgPSB0aGlzLmV2YWx1YXRpb25zKHZhbHVlLCBzY2hlbWFTZXR0aW5ncy5ldmFsdWF0aW9ucylcclxuICAgICAgICAgIHZhbGlkYXRpb24uZXZhbHVhdGlvbnMgPSB0aGlzLmV2YWx1YXRpb25SZXN1bHRzKHZhbGlkYXRpb25FdmFsdWF0aW9ucylcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFsaWRhdGlvblN1bW1hcnlbc2NoZW1hS2V5XSA9IHZhbGlkYXRpb25cclxuICAgICAgfSlcclxuICAgIHRoaXMuX3Jlc3VsdHMgPSB2YWxpZGF0aW9uU3VtbWFyeVxyXG4gICAgcmV0dXJuIHZhbGlkYXRpb25TdW1tYXJ5XHJcbiAgfVxyXG4gIHJlcXVpcmVkKHZhbHVlLCBzY2hlbWFTZXR0aW5ncykge1xyXG4gICAgbGV0IHZhbGlkYXRpb25TdW1tYXJ5ID0ge1xyXG4gICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICB9XHJcbiAgICBsZXQgbWVzc2FnZXMgPSBPYmplY3QuYXNzaWduKFxyXG4gICAgICB7XHJcbiAgICAgICAgcGFzczogJ1ZhbHVlIGlzIGRlZmluZWQuJyxcclxuICAgICAgICBmYWlsOiAnVmFsdWUgaXMgbm90IGRlZmluZWQuJyxcclxuICAgICAgfSxcclxuICAgICAgc2NoZW1hU2V0dGluZ3MubWVzc2FnZXNcclxuICAgIClcclxuICAgIHZhbHVlID0gKHZhbHVlICE9PSB1bmRlZmluZWQpXHJcbiAgICBzd2l0Y2goTVZDLlV0aWxzLnR5cGVPZihzY2hlbWFTZXR0aW5ncykpIHtcclxuICAgICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICAgICAgdmFsaWRhdGlvblN1bW1hcnkuY29tcGFyYXRvciA9IHNjaGVtYVNldHRpbmdzXHJcbiAgICAgICAgdmFsaWRhdGlvblN1bW1hcnkucmVzdWx0ID0gKHZhbHVlID09PSBzY2hlbWFTZXR0aW5ncylcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICAgIHZhbGlkYXRpb25TdW1tYXJ5LmNvbXBhcmF0b3IgPSBzY2hlbWFTZXR0aW5ncy52YWx1ZVxyXG4gICAgICAgIHZhbGlkYXRpb25TdW1tYXJ5LnJlc3VsdCA9ICh2YWx1ZSA9PT0gc2NoZW1hU2V0dGluZ3MudmFsdWUpXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIHZhbGlkYXRpb25TdW1tYXJ5Lm1lc3NhZ2UgPSAodmFsaWRhdGlvblN1bW1hcnkucmVzdWx0KVxyXG4gICAgICA/IG1lc3NhZ2VzLnBhc3NcclxuICAgICAgOiBtZXNzYWdlcy5mYWlsXHJcbiAgICByZXR1cm4gdmFsaWRhdGlvblN1bW1hcnlcclxuICB9XHJcbiAgdHlwZSh2YWx1ZSwgc2NoZW1hU2V0dGluZ3MpIHtcclxuICAgIGxldCB2YWxpZGF0aW9uU3VtbWFyeSA9IHtcclxuICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICB9XHJcbiAgICBsZXQgbWVzc2FnZXMgPSBPYmplY3QuYXNzaWduKFxyXG4gICAgICB7XHJcbiAgICAgICAgcGFzczogJ1ZhbGlkIFR5cGUuJyxcclxuICAgICAgICBmYWlsOiAnSW52YWxpZCBUeXBlLicsXHJcbiAgICAgIH0sXHJcbiAgICAgIHNjaGVtYVNldHRpbmdzLm1lc3NhZ2VzXHJcbiAgICApXHJcbiAgICBzd2l0Y2goTVZDLlV0aWxzLnR5cGVPZihzY2hlbWFTZXR0aW5ncykpIHtcclxuICAgICAgY2FzZSAnc3RyaW5nJzpcclxuICAgICAgICB2YWxpZGF0aW9uU3VtbWFyeS5jb21wYXJhdG9yXHJcbiAgICAgICAgdmFsaWRhdGlvblN1bW1hcnkucmVzdWx0ID0gKE1WQy5VdGlscy50eXBlT2YodmFsdWUpID09PSBzY2hlbWFTZXR0aW5ncylcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICAgIHZhbGlkYXRpb25TdW1tYXJ5LnJlc3VsdCA9IChNVkMuVXRpbHMudHlwZU9mKHZhbHVlKSA9PT0gc2NoZW1hU2V0dGluZ3MudmFsdWUpXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIHZhbGlkYXRpb25TdW1tYXJ5Lm1lc3NhZ2UgPSAodmFsaWRhdGlvblN1bW1hcnkucmVzdWx0KVxyXG4gICAgICA/IG1lc3NhZ2VzLnBhc3NcclxuICAgICAgOiBtZXNzYWdlcy5mYWlsXHJcbiAgICByZXR1cm4gdmFsaWRhdGlvblN1bW1hcnlcclxuICB9XHJcbiAgZXZhbHVhdGlvbnModmFsdWUsIGV2YWx1YXRpb25zKSB7XHJcbiAgICByZXR1cm4gZXZhbHVhdGlvbnMucmVkdWNlKChfZXZhbHVhdGlvbnMsIGV2YWx1YXRpb24sIGV2YWx1YXRpb25JbmRleCkgPT4ge1xyXG4gICAgICBpZihNVkMuVXRpbHMuaXNBcnJheShldmFsdWF0aW9uKSkge1xyXG4gICAgICAgIF9ldmFsdWF0aW9ucy5wdXNoKFxyXG4gICAgICAgICAgLi4udGhpcy5ldmFsdWF0aW9ucyh2YWx1ZSwgZXZhbHVhdGlvbilcclxuICAgICAgICApXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXZhbHVhdGlvbi52YWx1ZSA9IHZhbHVlXHJcbiAgICAgICAgbGV0IHZhbHVlQ29tcGFyaXNvbiA9IHRoaXMuY29tcGFyZVZhbHVlcyhcclxuICAgICAgICAgIGV2YWx1YXRpb24udmFsdWUsXHJcbiAgICAgICAgICBldmFsdWF0aW9uLmNvbXBhcmlzb24udmFsdWUsXHJcbiAgICAgICAgICBldmFsdWF0aW9uLmNvbXBhcmF0b3IsXHJcbiAgICAgICAgICBldmFsdWF0aW9uLm1lc3NhZ2VzXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGV2YWx1YXRpb24ucmVzdWx0cyA9IGV2YWx1YXRpb24ucmVzdWx0cyB8fCB7fVxyXG4gICAgICAgIGV2YWx1YXRpb24ucmVzdWx0cy52YWx1ZSA9IHZhbHVlQ29tcGFyaXNvblxyXG4gICAgICAgIF9ldmFsdWF0aW9ucy5wdXNoKGV2YWx1YXRpb24pXHJcbiAgICAgIH1cclxuICAgICAgaWYoX2V2YWx1YXRpb25zLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICBsZXQgY3VycmVudEV2YWx1YXRpb24gPSBfZXZhbHVhdGlvbnNbZXZhbHVhdGlvbkluZGV4XVxyXG4gICAgICAgIGlmKGN1cnJlbnRFdmFsdWF0aW9uLmNvbXBhcmlzb24uc3RhdGVtZW50KSB7XHJcbiAgICAgICAgICBsZXQgcHJldmlvdXNFdmFsdWF0aW9uID0gX2V2YWx1YXRpb25zW2V2YWx1YXRpb25JbmRleCAtIDFdXHJcbiAgICAgICAgICBsZXQgcHJldmlvdXNFdmFsdWF0aW9uQ29tcGFyaXNvblZhbHVlID0gKGN1cnJlbnRFdmFsdWF0aW9uLnJlc3VsdHMuc3RhdGVtZW50KVxyXG4gICAgICAgICAgICA/IGN1cnJlbnRFdmFsdWF0aW9uLnJlc3VsdHMuc3RhdGVtZW50LnJlc3VsdFxyXG4gICAgICAgICAgICA6IGN1cnJlbnRFdmFsdWF0aW9uLnJlc3VsdHMudmFsdWUucmVzdWx0XHJcbiAgICAgICAgICBsZXQgc3RhdGVtZW50Q29tcGFyaXNvbiA9IHRoaXMuY29tcGFyZVN0YXRlbWVudHMoXHJcbiAgICAgICAgICAgIHByZXZpb3VzRXZhbHVhdGlvbkNvbXBhcmlzb25WYWx1ZSxcclxuICAgICAgICAgICAgY3VycmVudEV2YWx1YXRpb24uY29tcGFyaXNvbi5zdGF0ZW1lbnQsXHJcbiAgICAgICAgICAgIGN1cnJlbnRFdmFsdWF0aW9uLnJlc3VsdHMudmFsdWUucmVzdWx0LFxyXG4gICAgICAgICAgICBjdXJyZW50RXZhbHVhdGlvbi5tZXNzYWdlc1xyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgY3VycmVudEV2YWx1YXRpb24ucmVzdWx0cyA9IGN1cnJlbnRFdmFsdWF0aW9uLnJlc3VsdHMgfHwge31cclxuICAgICAgICAgIGN1cnJlbnRFdmFsdWF0aW9uLnJlc3VsdHMuc3RhdGVtZW50ID0gc3RhdGVtZW50Q29tcGFyaXNvblxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gX2V2YWx1YXRpb25zXHJcbiAgICB9LCBbXSlcclxuICB9XHJcbiAgZXZhbHVhdGlvblJlc3VsdHMoZXZhbHVhdGlvbnMpIHtcclxuICAgIGxldCB2YWxpZGF0aW9uRXZhbHVhdGlvbnMgPSB7XHJcbiAgICAgIHBhc3M6IFtdLFxyXG4gICAgICBmYWlsOiBbXSxcclxuICAgIH1cclxuICAgIGV2YWx1YXRpb25zLmZvckVhY2goKGV2YWx1YXRpb25WYWxpZGF0aW9uKSA9PiB7XHJcbiAgICAgIGlmKGV2YWx1YXRpb25WYWxpZGF0aW9uLnJlc3VsdHMuc3RhdGVtZW50KSB7XHJcbiAgICAgICAgaWYoZXZhbHVhdGlvblZhbGlkYXRpb24ucmVzdWx0cy5zdGF0ZW1lbnQucmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgdmFsaWRhdGlvbkV2YWx1YXRpb25zLmZhaWwucHVzaChldmFsdWF0aW9uVmFsaWRhdGlvbilcclxuICAgICAgICB9IGVsc2UgaWYoZXZhbHVhdGlvblZhbGlkYXRpb24ucmVzdWx0cy5zdGF0ZW1lbnQucmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICB2YWxpZGF0aW9uRXZhbHVhdGlvbnMucGFzcy5wdXNoKGV2YWx1YXRpb25WYWxpZGF0aW9uKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmKGV2YWx1YXRpb25WYWxpZGF0aW9uLnJlc3VsdHMudmFsdWUpIHtcclxuICAgICAgICBpZihldmFsdWF0aW9uVmFsaWRhdGlvbi5yZXN1bHRzLnZhbHVlLnJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIHZhbGlkYXRpb25FdmFsdWF0aW9ucy5mYWlsLnB1c2goZXZhbHVhdGlvblZhbGlkYXRpb24pXHJcbiAgICAgICAgfSBlbHNlIGlmKGV2YWx1YXRpb25WYWxpZGF0aW9uLnJlc3VsdHMudmFsdWUucmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICB2YWxpZGF0aW9uRXZhbHVhdGlvbnMucGFzcy5wdXNoKGV2YWx1YXRpb25WYWxpZGF0aW9uKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiB2YWxpZGF0aW9uRXZhbHVhdGlvbnNcclxuICB9XHJcbiAgY29tcGFyZVZhbHVlcyh2YWx1ZSwgb3BlcmF0b3IsIGNvbXBhcmF0b3IsIG1lc3NhZ2VzKSB7XHJcbiAgICBsZXQgZXZhbHVhdGlvblJlc3VsdFxyXG4gICAgc3dpdGNoKG9wZXJhdG9yKSB7XHJcbiAgICAgIGNhc2UgTVZDLkNPTlNULk9wZXJhdG9ycy5Db21wYXJpc29uLkVROlxyXG4gICAgICAgIGV2YWx1YXRpb25SZXN1bHQgPSAodmFsdWUgPT0gY29tcGFyYXRvcilcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIE1WQy5DT05TVC5PcGVyYXRvcnMuQ29tcGFyaXNvbi5TVEVROlxyXG4gICAgICAgIGV2YWx1YXRpb25SZXN1bHQgPSAodmFsdWUgPT09IGNvbXBhcmF0b3IpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBNVkMuQ09OU1QuT3BlcmF0b3JzLkNvbXBhcmlzb24uTk9FUTpcclxuICAgICAgICBldmFsdWF0aW9uUmVzdWx0ID0gKHZhbHVlICE9IGNvbXBhcmF0b3IpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBNVkMuQ09OU1QuT3BlcmF0b3JzLkNvbXBhcmlzb24uU1ROT0VROlxyXG4gICAgICAgIGV2YWx1YXRpb25SZXN1bHQgPSAodmFsdWUgIT09IGNvbXBhcmF0b3IpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBNVkMuQ09OU1QuT3BlcmF0b3JzLkNvbXBhcmlzb24uR1Q6XHJcbiAgICAgICAgZXZhbHVhdGlvblJlc3VsdCA9ICh2YWx1ZSA+IGNvbXBhcmF0b3IpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBNVkMuQ09OU1QuT3BlcmF0b3JzLkNvbXBhcmlzb24uTFQ6XHJcbiAgICAgICAgZXZhbHVhdGlvblJlc3VsdCA9ICh2YWx1ZSA8IGNvbXBhcmF0b3IpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBNVkMuQ09OU1QuT3BlcmF0b3JzLkNvbXBhcmlzb24uR1RFOlxyXG4gICAgICAgIGV2YWx1YXRpb25SZXN1bHQgPSAodmFsdWUgPj0gY29tcGFyYXRvcilcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIE1WQy5DT05TVC5PcGVyYXRvcnMuQ29tcGFyaXNvbi5MVEU6XHJcbiAgICAgICAgZXZhbHVhdGlvblJlc3VsdCA9ICh2YWx1ZSA8PSBjb21wYXJhdG9yKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN1bHQ6IGV2YWx1YXRpb25SZXN1bHQsXHJcbiAgICAgIG1lc3NhZ2U6IChldmFsdWF0aW9uUmVzdWx0KVxyXG4gICAgICAgID8gbWVzc2FnZXMucGFzc1xyXG4gICAgICAgIDogbWVzc2FnZXMuZmFpbFxyXG4gICAgfVxyXG4gIH1cclxuICBjb21wYXJlU3RhdGVtZW50cyh2YWx1ZSwgb3BlcmF0b3IsIGNvbXBhcmF0b3IsIG1lc3NhZ2VzKSB7XHJcbiAgICBsZXQgZXZhbHVhdGlvblJlc3VsdFxyXG4gICAgc3dpdGNoKG9wZXJhdG9yKSB7XHJcbiAgICAgIGNhc2UgTVZDLkNPTlNULk9wZXJhdG9ycy5TdGF0ZW1lbnQuQU5EOlxyXG4gICAgICAgIGV2YWx1YXRpb25SZXN1bHQgPSB2YWx1ZSAmJiBjb21wYXJhdG9yXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBNVkMuQ09OU1QuT3BlcmF0b3JzLlN0YXRlbWVudC5PUjpcclxuICAgICAgICBldmFsdWF0aW9uUmVzdWx0ID0gdmFsdWUgfHwgY29tcGFyYXRvclxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN1bHQ6IGV2YWx1YXRpb25SZXN1bHQsXHJcbiAgICAgIG1lc3NhZ2U6IChldmFsdWF0aW9uUmVzdWx0KVxyXG4gICAgICAgID8gbWVzc2FnZXMucGFzc1xyXG4gICAgICAgIDogbWVzc2FnZXMuZmFpbFxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJNVkMuTW9kZWwgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfdmFsaWRhdG9yKCkgeyByZXR1cm4gdGhpcy52YWxpZGF0b3IgfVxuICBzZXQgX3ZhbGlkYXRvcih2YWxpZGF0b3IpIHsgdGhpcy52YWxpZGF0b3IgPSBuZXcgTVZDLlZhbGlkYXRvcih2YWxpZGF0b3IpIH1cbiAgZ2V0IF9pc1NldHRpbmcoKSB7IHJldHVybiB0aGlzLmlzU2V0dGluZyB9XG4gIHNldCBfaXNTZXR0aW5nKGlzU2V0dGluZykgeyB0aGlzLmlzU2V0dGluZyA9IGlzU2V0dGluZyB9XG4gIGdldCBfY2hhbmdpbmcoKSB7XG4gICAgdGhpcy5jaGFuZ2luZyA9ICh0aGlzLmNoYW5naW5nKVxuICAgICAgPyB0aGlzLmNoYW5naW5nXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY2hhbmdpbmdcbiAgfVxuICBnZXQgX2xvY2FsU3RvcmFnZSgpIHsgcmV0dXJuIHRoaXMubG9jYWxTdG9yYWdlIH1cbiAgc2V0IF9sb2NhbFN0b3JhZ2UobG9jYWxTdG9yYWdlKSB7IHRoaXMubG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yYWdlIH1cbiAgZ2V0IF9kZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuZGVmYXVsdHMgfVxuICBzZXQgX2RlZmF1bHRzKGRlZmF1bHRzKSB7IHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0cyB9XG4gIGdldCBfc2NoZW1hKCkgeyByZXR1cm4gdGhpcy5fc2NoZW1hIH1cbiAgc2V0IF9zY2hlbWEoc2NoZW1hKSB7IHRoaXMuc2NoZW1hID0gc2NoZW1hIH1cbiAgZ2V0IF9oaXN0aW9ncmFtKCkgeyByZXR1cm4gdGhpcy5oaXN0aW9ncmFtIHx8IHtcbiAgICBsZW5ndGg6IDFcbiAgfSB9XG4gIHNldCBfaGlzdGlvZ3JhbShoaXN0aW9ncmFtKSB7XG4gICAgdGhpcy5oaXN0aW9ncmFtID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHRoaXMuX2hpc3Rpb2dyYW0sXG4gICAgICBoaXN0aW9ncmFtXG4gICAgKVxuICB9XG4gIGdldCBfaGlzdG9yeSgpIHtcbiAgICB0aGlzLmhpc3RvcnkgPSAodGhpcy5oaXN0b3J5KVxuICAgICAgPyB0aGlzLmhpc3RvcnlcbiAgICAgIDogW11cbiAgICByZXR1cm4gdGhpcy5oaXN0b3J5XG4gIH1cbiAgc2V0IF9oaXN0b3J5KGRhdGEpIHtcbiAgICBpZihcbiAgICAgIE9iamVjdC5rZXlzKGRhdGEpLmxlbmd0aFxuICAgICkge1xuICAgICAgaWYodGhpcy5faGlzdGlvZ3JhbS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS51bnNoaWZ0KHRoaXMucGFyc2UoZGF0YSkpXG4gICAgICAgIHRoaXMuX2hpc3Rvcnkuc3BsaWNlKHRoaXMuX2hpc3Rpb2dyYW0ubGVuZ3RoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgX2RiKCkge1xuICAgIGxldCBkYiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KVxuICAgIHRoaXMuZGIgPSAoZGIpXG4gICAgICA/IGRiXG4gICAgICA6ICd7fSdcbiAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLmRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICBnZXQgX2RhdGEoKSB7XG4gICAgdGhpcy5kYXRhID0gICh0aGlzLmRhdGEpXG4gICAgICA/IHRoaXMuZGF0YVxuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmRhdGFcbiAgfVxuICBnZXQgX2RhdGFFdmVudHMoKSB7XG4gICAgdGhpcy5kYXRhRXZlbnRzID0gKHRoaXMuZGF0YUV2ZW50cylcbiAgICAgID8gdGhpcy5kYXRhRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YUV2ZW50c1xuICB9XG4gIHNldCBfZGF0YUV2ZW50cyhkYXRhRXZlbnRzKSB7XG4gICAgdGhpcy5kYXRhRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGRhdGFFdmVudHMsIHRoaXMuX2RhdGFFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9kYXRhQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuZGF0YUNhbGxiYWNrcyA9ICh0aGlzLmRhdGFDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuZGF0YUNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmRhdGFDYWxsYmFja3NcbiAgfVxuICBzZXQgX2RhdGFDYWxsYmFja3MoZGF0YUNhbGxiYWNrcykge1xuICAgIHRoaXMuZGF0YUNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBkYXRhQ2FsbGJhY2tzLCB0aGlzLl9kYXRhQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfc2VydmljZXMoKSB7XG4gICAgdGhpcy5zZXJ2aWNlcyA9ICAodGhpcy5zZXJ2aWNlcylcbiAgICAgID8gdGhpcy5zZXJ2aWNlc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnNlcnZpY2VzXG4gIH1cbiAgc2V0IF9zZXJ2aWNlcyhzZXJ2aWNlcykge1xuICAgIHRoaXMuc2VydmljZXMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgc2VydmljZXMsIHRoaXMuX3NlcnZpY2VzXG4gICAgKVxuICB9XG4gIGdldCBfc2VydmljZUV2ZW50cygpIHtcbiAgICB0aGlzLnNlcnZpY2VFdmVudHMgPSAodGhpcy5zZXJ2aWNlRXZlbnRzKVxuICAgICAgPyB0aGlzLnNlcnZpY2VFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5zZXJ2aWNlRXZlbnRzXG4gIH1cbiAgc2V0IF9zZXJ2aWNlRXZlbnRzKHNlcnZpY2VFdmVudHMpIHtcbiAgICB0aGlzLnNlcnZpY2VFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgc2VydmljZUV2ZW50cywgdGhpcy5fc2VydmljZUV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX3NlcnZpY2VDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzID0gKHRoaXMuc2VydmljZUNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICB9XG4gIHNldCBfc2VydmljZUNhbGxiYWNrcyhzZXJ2aWNlQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHNlcnZpY2VDYWxsYmFja3MsIHRoaXMuX3NlcnZpY2VDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGVuYWJsZVNlcnZpY2VFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5zZXJ2aWNlRXZlbnRzLCB0aGlzLnNlcnZpY2VzLCB0aGlzLnNlcnZpY2VDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZVNlcnZpY2VFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMuc2VydmljZUV2ZW50cywgdGhpcy5zZXJ2aWNlcywgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZURhdGFFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5kYXRhRXZlbnRzLCB0aGlzLCB0aGlzLmRhdGFDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZURhdGFFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMuZGF0YUV2ZW50cywgdGhpcywgdGhpcy5kYXRhQ2FsbGJhY2tzKVxuICB9XG4gIHNldERlZmF1bHRzKCkge1xuICAgIGxldCBfZGVmYXVsdHMgPSB7fVxuICAgIGlmKHRoaXMuZGVmYXVsdHMpIE9iamVjdC5hc3NpZ24oX2RlZmF1bHRzLCB0aGlzLmRlZmF1bHRzKVxuICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlKSBPYmplY3QuYXNzaWduKF9kZWZhdWx0cywgdGhpcy5fZGIpXG4gICAgaWYoT2JqZWN0LmtleXMoX2RlZmF1bHRzKSkgdGhpcy5zZXQoX2RlZmF1bHRzKVxuICB9XG4gIGdldCgpIHtcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVtrZXldXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdGhpcy5faXNTZXR0aW5nID0gdHJ1ZVxuICAgICAgICBsZXQgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYoaW5kZXggPT09IChfYXJndW1lbnRzLmxlbmd0aCAtIDEpKSB0aGlzLl9pc1NldHRpbmcgPSBmYWxzZVxuICAgICAgICAgIHRoaXMuX2NoYW5naW5nW2tleV0gPSB2YWx1ZVxuICAgICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIHRoaXMuc2V0REIoa2V5LCB2YWx1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgZGVsZXRlIHRoaXMuY2hhbmdpbmdcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgdmFyIGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICB2YXIgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSlcbiAgICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIHRoaXMuc2V0REIoa2V5LCB2YWx1ZSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgaWYodGhpcy5fdmFsaWRhdG9yKSB7XG4gICAgICBsZXQgdmFsaWRhdGVFbWl0dGVyID0gdGhpcy5lbWl0dGVycy52YWxpZGF0ZVxuICAgICAgdGhpcy5fdmFsaWRhdG9yLnZhbGlkYXRlKFxuICAgICAgICBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YSkpXG4gICAgICApXG4gICAgICB2YWxpZGF0ZUVtaXR0ZXIuc2V0KHtcbiAgICAgICAgZGF0YTogdGhpcy52YWxpZGF0b3IuZGF0YSxcbiAgICAgICAgcmVzdWx0czogdGhpcy52YWxpZGF0b3IucmVzdWx0c1xuICAgICAgfSlcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgdmFsaWRhdGVFbWl0dGVyLm5hbWUsXG4gICAgICAgIHZhbGlkYXRlRW1pdHRlci5lbWlzc2lvbigpXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpKSB7XG4gICAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREQigpIHtcbiAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHZhciBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGxldCB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgdGhpcy5fZGIgPSBkYlxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXREQigpIHtcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBkZWxldGUgdGhpcy5fZGJcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBkZWxldGUgZGJba2V5XVxuICAgICAgICB0aGlzLl9kYiA9IGRiXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpIHtcbiAgICBpZighdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldKSB7XG4gICAgICBsZXQgY29udGV4dCA9IHRoaXNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgICAgICB0aGlzLl9kYXRhLFxuICAgICAgICB7XG4gICAgICAgICAgWydfJy5jb25jYXQoa2V5KV06IHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNba2V5XSB9LFxuICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgIGxldCBzZXRWYWx1ZUV2ZW50TmFtZSA9IFsnc2V0JywgJzonLCBrZXldLmpvaW4oJycpXG4gICAgICAgICAgICAgIGxldCBzZXRFdmVudE5hbWUgPSAnc2V0J1xuICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbmFtZTogc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIGlmKCFjb250ZXh0Ll9pc1NldHRpbmcpIHtcbiAgICAgICAgICAgICAgICBpZighT2JqZWN0LnZhbHVlcyhjb250ZXh0Ll9jaGFuZ2luZykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICAgICAgc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGNvbnRleHQuX2NoYW5naW5nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKVxuICAgIH1cbiAgICB0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV0gPSB2YWx1ZVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXREYXRhUHJvcGVydHkoa2V5KSB7XG4gICAgbGV0IHVuc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3Vuc2V0JywgJzonLCBrZXldLmpvaW4oJycpXG4gICAgbGV0IHVuc2V0RXZlbnROYW1lID0gJ3Vuc2V0J1xuICAgIGxldCB1bnNldFZhbHVlID0gdGhpcy5fZGF0YVtrZXldXG4gICAgZGVsZXRlIHRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXVxuICAgIGRlbGV0ZSB0aGlzLl9kYXRhW2tleV1cbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldFZhbHVlRXZlbnROYW1lLFxuICAgICAge1xuICAgICAgICBuYW1lOiB1bnNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgdmFsdWU6IHVuc2V0VmFsdWUsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApXG4gICAgdGhpcy5lbWl0KFxuICAgICAgdW5zZXRFdmVudE5hbWUsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IHVuc2V0RXZlbnROYW1lLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgdmFsdWU6IHVuc2V0VmFsdWUsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBwYXJzZShkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5fZGF0YVxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KE9iamVjdC5hc3NpZ24oe30sIGRhdGEpKSlcbiAgfVxuICBlbmFibGVFbWl0dGVycygpIHtcbiAgICBPYmplY3QuYXNzaWduKFxuICAgICAgdGhpcy5fZW1pdHRlcnMsXG4gICAgICB0aGlzLnNldHRpbmdzLmVtaXR0ZXJzLFxuICAgICAge1xuICAgICAgICB2YWxpZGF0ZTogbmV3IE1WQy5FbWl0dGVycy5WYWxpZGF0ZSgpLFxuICAgICAgfVxuICAgIClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGVFbWl0dGVycygpIHtcbiAgICBkZWxldGUgdGhpcy5fZW1pdHRlcnNcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5lbmFibGVFbWl0dGVycygpXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnZhbGlkYXRvcikgdGhpcy5fdmFsaWRhdG9yID0gdGhpcy5zZXR0aW5ncy52YWxpZGF0b3JcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MubG9jYWxTdG9yYWdlKSB0aGlzLl9sb2NhbFN0b3JhZ2UgPSB0aGlzLnNldHRpbmdzLmxvY2FsU3RvcmFnZVxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5oaXN0aW9ncmFtKSB0aGlzLl9oaXN0aW9ncmFtID0gdGhpcy5zZXR0aW5ncy5oaXN0aW9ncmFtXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnNlcnZpY2VzKSB0aGlzLl9zZXJ2aWNlcyA9IHRoaXMuc2V0dGluZ3Muc2VydmljZXNcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3Muc2VydmljZUNhbGxiYWNrcykgdGhpcy5fc2VydmljZUNhbGxiYWNrcyA9IHRoaXMuc2V0dGluZ3Muc2VydmljZUNhbGxiYWNrc1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5zZXJ2aWNlRXZlbnRzKSB0aGlzLl9zZXJ2aWNlRXZlbnRzID0gdGhpcy5zZXR0aW5ncy5zZXJ2aWNlRXZlbnRzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRhdGEpIHRoaXMuc2V0KHRoaXMuc2V0dGluZ3MuZGF0YSlcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGF0YUNhbGxiYWNrcykgdGhpcy5fZGF0YUNhbGxiYWNrcyA9IHRoaXMuc2V0dGluZ3MuZGF0YUNhbGxiYWNrc1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5kYXRhRXZlbnRzKSB0aGlzLl9kYXRhRXZlbnRzID0gdGhpcy5zZXR0aW5ncy5kYXRhRXZlbnRzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnNjaGVtYSkgdGhpcy5fc2NoZW1hID0gdGhpcy5zZXR0aW5ncy5zY2hlbWFcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMpIHRoaXMuX2RlZmF1bHRzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0c1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMuc2VydmljZXMgJiZcbiAgICAgICAgdGhpcy5zZXJ2aWNlRXZlbnRzICYmXG4gICAgICAgIHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlU2VydmljZUV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5kYXRhRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZGF0YUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlRGF0YUV2ZW50cygpXG4gICAgICB9XG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnNlcnZpY2VzICYmXG4gICAgICAgIHRoaXMuc2VydmljZUV2ZW50cyAmJlxuICAgICAgICB0aGlzLnNlcnZpY2VDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVTZXJ2aWNlRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmRhdGFFdmVudHMgJiZcbiAgICAgICAgdGhpcy5kYXRhQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlRGF0YUV2ZW50cygpXG4gICAgICB9XG4gICAgICBkZWxldGUgdGhpcy5fbG9jYWxTdG9yYWdlXG4gICAgICBkZWxldGUgdGhpcy5faGlzdGlvZ3JhbVxuICAgICAgZGVsZXRlIHRoaXMuX3NlcnZpY2VzXG4gICAgICBkZWxldGUgdGhpcy5fc2VydmljZUNhbGxiYWNrc1xuICAgICAgZGVsZXRlIHRoaXMuX3NlcnZpY2VFdmVudHNcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YUNhbGxiYWNrc1xuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFFdmVudHNcbiAgICAgIGRlbGV0ZSB0aGlzLl9zY2hlbWFcbiAgICAgIGRlbGV0ZSB0aGlzLl92YWxpZGF0b3JcbiAgICAgIGRlbGV0ZSB0aGlzLmRpc2FibGVFbWl0dGVycygpXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuIiwiTVZDLkVtaXR0ZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5Nb2RlbCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgICBpZih0aGlzLnNldHRpbmdzKSB7XHJcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MubmFtZSkgdGhpcy5fbmFtZSA9IHRoaXMuc2V0dGluZ3MubmFtZVxyXG4gICAgfVxyXG4gIH1cclxuICBnZXQgX25hbWUoKSB7IHJldHVybiB0aGlzLm5hbWUgfVxyXG4gIHNldCBfbmFtZShuYW1lKSB7IHRoaXMubmFtZSA9IG5hbWUgfVxyXG4gIGVtaXNzaW9uKCkge1xyXG4gICAgbGV0IGV2ZW50RGF0YSA9IHtcclxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxyXG4gICAgICBkYXRhOiB0aGlzLmRhdGFcclxuICAgIH1cclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgdGhpcy5uYW1lLFxyXG4gICAgICBldmVudERhdGFcclxuICAgIClcclxuICAgIHJldHVybiBldmVudERhdGFcclxuICB9XHJcbn1cclxuIiwiTVZDLkVtaXR0ZXJzLk5hdmlnYXRlID0gY2xhc3MgZXh0ZW5kcyBNVkMuRW1pdHRlciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgICB0aGlzLmFkZFNldHRpbmdzKClcclxuICAgIHRoaXMuZW5hYmxlKClcclxuICB9XHJcbiAgYWRkU2V0dGluZ3MoKSB7XHJcbiAgICB0aGlzLl9uYW1lID0gJ25hdmlnYXRlJ1xyXG4gICAgdGhpcy5fc2NoZW1hID0ge1xyXG4gICAgICBvbGRVUkw6IFN0cmluZyxcclxuICAgICAgbmV3VVJMOiBTdHJpbmcsXHJcbiAgICAgIGN1cnJlbnRSb3V0ZTogU3RyaW5nLFxyXG4gICAgICBjdXJyZW50Q29udHJvbGxlcjogU3RyaW5nLFxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJNVkMuRW1pdHRlcnMuVmFsaWRhdGUgPSBjbGFzcyBleHRlbmRzIE1WQy5FbWl0dGVyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICAgIHRoaXMuYWRkU2V0dGluZ3MoKVxyXG4gICAgdGhpcy5lbmFibGUoKVxyXG4gIH1cclxuICBhZGRTZXR0aW5ncygpIHtcclxuICAgIHRoaXMuX25hbWUgPSAndmFsaWRhdGUnXHJcbiAgICB0aGlzLl9zY2hlbWEgPSB7XHJcbiAgICAgIGRhdGE6IE9iamVjdCxcclxuICAgICAgcmVzdWx0czogT2JqZWN0LFxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJNVkMuVmlldyA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IF9lbGVtZW50TmFtZSgpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQudGFnTmFtZSB9XG4gIHNldCBfZWxlbWVudE5hbWUoZWxlbWVudE5hbWUpIHtcbiAgICBpZighdGhpcy5fZWxlbWVudCkgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudE5hbWUpXG4gIH1cbiAgZ2V0IF9lbGVtZW50KCkgeyByZXR1cm4gdGhpcy5lbGVtZW50IH1cbiAgc2V0IF9lbGVtZW50KGVsZW1lbnQpIHtcbiAgICBpZihcbiAgICAgIGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxuICAgICAgZWxlbWVudCBpbnN0YW5jZW9mIERvY3VtZW50XG4gICAgKSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgfSBlbHNlIGlmKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50KVxuICAgIH1cbiAgICB0aGlzLmVsZW1lbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudCwge1xuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICB9KVxuICB9XG4gIGdldCBfYXR0cmlidXRlcygpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQuYXR0cmlidXRlcyB9XG4gIHNldCBfYXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgZm9yKGxldCBbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGVWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlS2V5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IF91aSgpIHtcbiAgICB0aGlzLnVpID0gKHRoaXMudWkpXG4gICAgICA/IHRoaXMudWlcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy51aVxuICB9XG4gIHNldCBfdWkodWkpIHtcbiAgICBpZighdGhpcy5fdWlbJyRlbGVtZW50J10pIHRoaXMuX3VpWyckZWxlbWVudCddID0gdGhpcy5lbGVtZW50XG4gICAgZm9yKGxldCBbdWlLZXksIHVpVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHVpKSkge1xuICAgICAgaWYodHlwZW9mIHVpVmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuX3VpW3VpS2V5XSA9IHRoaXMuX2VsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh1aVZhbHVlKVxuICAgICAgfSBlbHNlIGlmKFxuICAgICAgICB1aVZhbHVlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcbiAgICAgICAgdWlWYWx1ZSBpbnN0YW5jZW9mIERvY3VtZW50XG4gICAgICApIHtcbiAgICAgICAgdGhpcy5fdWlbdWlLZXldID0gdWlWYWx1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgX3VpRXZlbnRzKCkgeyByZXR1cm4gdGhpcy51aUV2ZW50cyB9XG4gIHNldCBfdWlFdmVudHModWlFdmVudHMpIHsgdGhpcy51aUV2ZW50cyA9IHVpRXZlbnRzIH1cbiAgZ2V0IF91aUNhbGxiYWNrcygpIHtcbiAgICB0aGlzLnVpQ2FsbGJhY2tzID0gKHRoaXMudWlDYWxsYmFja3MpXG4gICAgICA/IHRoaXMudWlDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy51aUNhbGxiYWNrc1xuICB9XG4gIHNldCBfdWlDYWxsYmFja3ModWlDYWxsYmFja3MpIHtcbiAgICB0aGlzLnVpQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHVpQ2FsbGJhY2tzLCB0aGlzLl91aUNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX29ic2VydmVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3MgPSAodGhpcy5vYnNlcnZlckNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5vYnNlcnZlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9vYnNlcnZlckNhbGxiYWNrcyhvYnNlcnZlckNhbGxiYWNrcykge1xuICAgIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgb2JzZXJ2ZXJDYWxsYmFja3MsIHRoaXMuX29ic2VydmVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBlbGVtZW50T2JzZXJ2ZXIoKSB7XG4gICAgdGhpcy5fZWxlbWVudE9ic2VydmVyID0gKHRoaXMuX2VsZW1lbnRPYnNlcnZlcilcbiAgICAgID8gdGhpcy5fZWxlbWVudE9ic2VydmVyXG4gICAgICA6IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuZWxlbWVudE9ic2VydmUuYmluZCh0aGlzKSlcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudE9ic2VydmVyXG4gIH1cbiAgZ2V0IF9pbnNlcnQoKSB7IHJldHVybiB0aGlzLmluc2VydCB9XG4gIHNldCBfaW5zZXJ0KGluc2VydCkgeyB0aGlzLmluc2VydCA9IGluc2VydCB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICBnZXQgX3RlbXBsYXRlcygpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9ICh0aGlzLnRlbXBsYXRlcylcbiAgICAgID8gdGhpcy50ZW1wbGF0ZXNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZXNcbiAgfVxuICBzZXQgX3RlbXBsYXRlcyh0ZW1wbGF0ZXMpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB0ZW1wbGF0ZXMsIHRoaXMuX3RlbXBsYXRlc1xuICAgIClcbiAgfVxuICBlbGVtZW50T2JzZXJ2ZShtdXRhdGlvblJlY29yZExpc3QsIG9ic2VydmVyKSB7XG4gICAgZm9yKGxldCBbbXV0YXRpb25SZWNvcmRJbmRleCwgbXV0YXRpb25SZWNvcmRdIG9mIE9iamVjdC5lbnRyaWVzKG11dGF0aW9uUmVjb3JkTGlzdCkpIHtcbiAgICAgIHN3aXRjaChtdXRhdGlvblJlY29yZC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2NoaWxkTGlzdCc6XG4gICAgICAgICAgbGV0IG11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcyA9IFsnYWRkZWROb2RlcycsICdyZW1vdmVkTm9kZXMnXVxuICAgICAgICAgIGZvcihsZXQgbXV0YXRpb25SZWNvcmRDYXRlZ29yeSBvZiBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMpIHtcbiAgICAgICAgICAgIGlmKG11dGF0aW9uUmVjb3JkW211dGF0aW9uUmVjb3JkQ2F0ZWdvcnldLmxlbmd0aCkge1xuICAgICAgICAgICAgICB0aGlzLnJlc2V0VUkoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBhdXRvSW5zZXJ0KCkge1xuICAgIGlmKHRoaXMuaW5zZXJ0KSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuaW5zZXJ0LmVsZW1lbnQpXG4gICAgICAuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICBlbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCh0aGlzLmluc2VydC5tZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIGF1dG9SZW1vdmUoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLmVsZW1lbnQgJiZcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50XG4gICAgKSB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpXG4gIH1cbiAgZW5hYmxlRWxlbWVudChzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKHNldHRpbmdzLmVsZW1lbnROYW1lKSB0aGlzLl9lbGVtZW50TmFtZSA9IHNldHRpbmdzLmVsZW1lbnROYW1lXG4gICAgaWYoc2V0dGluZ3MuZWxlbWVudCkgdGhpcy5fZWxlbWVudCA9IHNldHRpbmdzLmVsZW1lbnRcbiAgICBpZihzZXR0aW5ncy5hdHRyaWJ1dGVzKSB0aGlzLl9hdHRyaWJ1dGVzID0gc2V0dGluZ3MuYXR0cmlidXRlc1xuICAgIGlmKHNldHRpbmdzLnRlbXBsYXRlcykgdGhpcy5fdGVtcGxhdGVzID0gc2V0dGluZ3MudGVtcGxhdGVzXG4gICAgaWYoc2V0dGluZ3MuaW5zZXJ0KSB0aGlzLl9pbnNlcnQgPSBzZXR0aW5ncy5pbnNlcnRcbiAgfVxuICBkaXNhYmxlRWxlbWVudChzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgdGhpcy5lbGVtZW50ICYmXG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICkgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIGlmKHRoaXMuZWxlbWVudCkgZGVsZXRlIHRoaXMuZWxlbWVudFxuICAgIGlmKHRoaXMuYXR0cmlidXRlcykgZGVsZXRlIHRoaXMuYXR0cmlidXRlc1xuICAgIGlmKHRoaXMudGVtcGxhdGVzKSBkZWxldGUgdGhpcy50ZW1wbGF0ZXNcbiAgICBpZih0aGlzLmluc2VydCkgZGVsZXRlIHRoaXMuaW5zZXJ0XG4gIH1cbiAgcmVzZXRVSSgpIHtcbiAgICB0aGlzLmRpc2FibGVVSSgpXG4gICAgdGhpcy5lbmFibGVVSSgpXG4gIH1cbiAgZW5hYmxlVUkoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihzZXR0aW5ncy51aSkgdGhpcy5fdWkgPSBzZXR0aW5ncy51aVxuICAgIGlmKHNldHRpbmdzLnVpQ2FsbGJhY2tzKSB0aGlzLl91aUNhbGxiYWNrcyA9IHNldHRpbmdzLnVpQ2FsbGJhY2tzXG4gICAgaWYoc2V0dGluZ3MudWlFdmVudHMpIHtcbiAgICAgIHRoaXMuX3VpRXZlbnRzID0gc2V0dGluZ3MudWlFdmVudHNcbiAgICAgIHRoaXMuZW5hYmxlVUlFdmVudHMoKVxuICAgIH1cbiAgfVxuICBkaXNhYmxlVUkoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihzZXR0aW5ncy51aUV2ZW50cykge1xuICAgICAgdGhpcy5kaXNhYmxlVUlFdmVudHMoKVxuICAgICAgZGVsZXRlIHRoaXMuX3VpRXZlbnRzXG4gICAgfVxuICAgIGRlbGV0ZSB0aGlzLnVpRXZlbnRzXG4gICAgZGVsZXRlIHRoaXMudWlcbiAgICBkZWxldGUgdGhpcy51aUNhbGxiYWNrc1xuICB9XG4gIGVuYWJsZVVJRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy51aUV2ZW50cyAmJlxuICAgICAgdGhpcy51aSAmJlxuICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMoXG4gICAgICAgIHRoaXMudWlFdmVudHMsXG4gICAgICAgIHRoaXMudWksXG4gICAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgZGlzYWJsZVVJRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy51aUV2ZW50cyAmJlxuICAgICAgdGhpcy51aSAmJlxuICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKFxuICAgICAgICB0aGlzLnVpRXZlbnRzLFxuICAgICAgICB0aGlzLnVpLFxuICAgICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgICApXG4gICAgfVxuICB9XG4gIGVuYWJsZUVtaXR0ZXJzKCkge1xuICAgIGlmKHRoaXMuc2V0dGluZ3MuZW1pdHRlcnMpIHRoaXMuX2VtaXR0ZXJzID0gdGhpcy5zZXR0aW5ncy5lbWl0dGVyc1xuICB9XG4gIGRpc2FibGVFbWl0dGVycygpIHtcbiAgICBpZih0aGlzLl9lbWl0dGVycykgZGVsZXRlIHRoaXMuX2VtaXR0ZXJzXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5fZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5lbmFibGVFbWl0dGVycygpXG4gICAgICB0aGlzLmVuYWJsZUVsZW1lbnQoc2V0dGluZ3MpXG4gICAgICB0aGlzLmVuYWJsZVVJKHNldHRpbmdzKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgIHRoaXMuX2VuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZGlzYWJsZVVJKHNldHRpbmdzKVxuICAgICAgdGhpcy5kaXNhYmxlRWxlbWVudChzZXR0aW5ncylcbiAgICAgIHRoaXMuZGlzYWJsZUVtaXR0ZXJzKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgICAgcmV0dXJuIHRoaXNzXG4gICAgfVxuICB9XG59XG4iLCJNVkMuQ29udHJvbGxlciA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IF9lbWl0dGVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuZW1pdHRlckNhbGxiYWNrcyA9ICh0aGlzLmVtaXR0ZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuZW1pdHRlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX2VtaXR0ZXJDYWxsYmFja3MoZW1pdHRlckNhbGxiYWNrcykge1xuICAgIHRoaXMuZW1pdHRlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBlbWl0dGVyQ2FsbGJhY2tzLCB0aGlzLl9lbWl0dGVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfbW9kZWxDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5tb2RlbENhbGxiYWNrcyA9ICh0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgfVxuICBzZXQgX21vZGVsQ2FsbGJhY2tzKG1vZGVsQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5tb2RlbENhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBtb2RlbENhbGxiYWNrcywgdGhpcy5fbW9kZWxDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF92aWV3Q2FsbGJhY2tzKCkge1xuICAgIHRoaXMudmlld0NhbGxiYWNrcyA9ICh0aGlzLnZpZXdDYWxsYmFja3MpXG4gICAgICA/IHRoaXMudmlld0NhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnZpZXdDYWxsYmFja3NcbiAgfVxuICBzZXQgX3ZpZXdDYWxsYmFja3Modmlld0NhbGxiYWNrcykge1xuICAgIHRoaXMudmlld0NhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB2aWV3Q2FsbGJhY2tzLCB0aGlzLl92aWV3Q2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlckNhbGxiYWNrcygpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MgPSAodGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9jb250cm9sbGVyQ2FsbGJhY2tzKGNvbnRyb2xsZXJDYWxsYmFja3MpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlckNhbGxiYWNrcywgdGhpcy5fY29udHJvbGxlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVscygpIHtcbiAgICB0aGlzLm1vZGVscyA9ICh0aGlzLm1vZGVscylcbiAgICAgID8gdGhpcy5tb2RlbHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5tb2RlbHNcbiAgfVxuICBzZXQgX21vZGVscyhtb2RlbHMpIHtcbiAgICB0aGlzLm1vZGVscyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBtb2RlbHMsIHRoaXMuX21vZGVsc1xuICAgIClcbiAgfVxuICBnZXQgX3ZpZXdzKCkge1xuICAgIHRoaXMudmlld3MgPSAodGhpcy52aWV3cylcbiAgICAgID8gdGhpcy52aWV3c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnZpZXdzXG4gIH1cbiAgc2V0IF92aWV3cyh2aWV3cykge1xuICAgIHRoaXMudmlld3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld3MsIHRoaXMuX3ZpZXdzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlcnMoKSB7XG4gICAgdGhpcy5jb250cm9sbGVycyA9ICh0aGlzLmNvbnRyb2xsZXJzKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlcnNcbiAgfVxuICBzZXQgX2NvbnRyb2xsZXJzKGNvbnRyb2xsZXJzKSB7XG4gICAgdGhpcy5jb250cm9sbGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBjb250cm9sbGVycywgdGhpcy5fY29udHJvbGxlcnNcbiAgICApXG4gIH1cbiAgZ2V0IF9yb3V0ZXJzKCkge1xuICAgIHRoaXMucm91dGVycyA9ICh0aGlzLnJvdXRlcnMpXG4gICAgICA/IHRoaXMucm91dGVyc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlcnNcbiAgfVxuICBzZXQgX3JvdXRlcnMocm91dGVycykge1xuICAgIHRoaXMucm91dGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXJzLCB0aGlzLl9yb3V0ZXJzXG4gICAgKVxuICB9XG4gIGdldCBfcm91dGVyRXZlbnRzKCkge1xuICAgIHRoaXMucm91dGVyRXZlbnRzID0gKHRoaXMucm91dGVyRXZlbnRzKVxuICAgICAgPyB0aGlzLnJvdXRlckV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlckV2ZW50c1xuICB9XG4gIHNldCBfcm91dGVyRXZlbnRzKHJvdXRlckV2ZW50cykge1xuICAgIHRoaXMucm91dGVyRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlckV2ZW50cywgdGhpcy5fcm91dGVyRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfcm91dGVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMucm91dGVyQ2FsbGJhY2tzID0gKHRoaXMucm91dGVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLnJvdXRlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlckNhbGxiYWNrc1xuICB9XG4gIHNldCBfcm91dGVyQ2FsbGJhY2tzKHJvdXRlckNhbGxiYWNrcykge1xuICAgIHRoaXMucm91dGVyQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlckNhbGxiYWNrcywgdGhpcy5fcm91dGVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfZW1pdHRlckV2ZW50cygpIHtcbiAgICB0aGlzLmVtaXR0ZXJFdmVudHMgPSAodGhpcy5lbWl0dGVyRXZlbnRzKVxuICAgICAgPyB0aGlzLmVtaXR0ZXJFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyRXZlbnRzXG4gIH1cbiAgc2V0IF9lbWl0dGVyRXZlbnRzKGVtaXR0ZXJFdmVudHMpIHtcbiAgICB0aGlzLmVtaXR0ZXJFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgZW1pdHRlckV2ZW50cywgdGhpcy5fZW1pdHRlckV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVsRXZlbnRzKCkge1xuICAgIHRoaXMubW9kZWxFdmVudHMgPSAodGhpcy5tb2RlbEV2ZW50cylcbiAgICAgID8gdGhpcy5tb2RlbEV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm1vZGVsRXZlbnRzXG4gIH1cbiAgc2V0IF9tb2RlbEV2ZW50cyhtb2RlbEV2ZW50cykge1xuICAgIHRoaXMubW9kZWxFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgbW9kZWxFdmVudHMsIHRoaXMuX21vZGVsRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfdmlld0V2ZW50cygpIHtcbiAgICB0aGlzLnZpZXdFdmVudHMgPSAodGhpcy52aWV3RXZlbnRzKVxuICAgICAgPyB0aGlzLnZpZXdFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy52aWV3RXZlbnRzXG4gIH1cbiAgc2V0IF92aWV3RXZlbnRzKHZpZXdFdmVudHMpIHtcbiAgICB0aGlzLnZpZXdFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld0V2ZW50cywgdGhpcy5fdmlld0V2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgdGhpcy5jb250cm9sbGVyRXZlbnRzID0gKHRoaXMuY29udHJvbGxlckV2ZW50cylcbiAgICAgID8gdGhpcy5jb250cm9sbGVyRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlckV2ZW50c1xuICB9XG4gIHNldCBfY29udHJvbGxlckV2ZW50cyhjb250cm9sbGVyRXZlbnRzKSB7XG4gICAgdGhpcy5jb250cm9sbGVyRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGNvbnRyb2xsZXJFdmVudHMsIHRoaXMuX2NvbnRyb2xsZXJFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGVuYWJsZU1vZGVsRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMubW9kZWxFdmVudHMsIHRoaXMubW9kZWxzLCB0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVNb2RlbEV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5tb2RlbEV2ZW50cywgdGhpcy5tb2RlbHMsIHRoaXMubW9kZWxDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlVmlld0V2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnZpZXdFdmVudHMsIHRoaXMudmlld3MsIHRoaXMudmlld0NhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlVmlld0V2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy52aWV3RXZlbnRzLCB0aGlzLnZpZXdzLCB0aGlzLnZpZXdDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlQ29udHJvbGxlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmNvbnRyb2xsZXJFdmVudHMsIHRoaXMuY29udHJvbGxlcnMsIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlQ29udHJvbGxlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5jb250cm9sbGVyRXZlbnRzLCB0aGlzLmNvbnRyb2xsZXJzLCB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlRW1pdHRlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmVtaXR0ZXJFdmVudHMsIHRoaXMuZW1pdHRlcnMsIHRoaXMuZW1pdHRlckNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlRW1pdHRlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5lbWl0dGVyRXZlbnRzLCB0aGlzLmVtaXR0ZXJzLCB0aGlzLmVtaXR0ZXJDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlUm91dGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMucm91dGVyRXZlbnRzLCB0aGlzLnJvdXRlcnMsIHRoaXMucm91dGVyQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVSb3V0ZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMucm91dGVyRXZlbnRzLCB0aGlzLnJvdXRlcnMsIHRoaXMucm91dGVyQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgaWYoc2V0dGluZ3MubW9kZWxDYWxsYmFja3MpIHRoaXMuX21vZGVsQ2FsbGJhY2tzID0gc2V0dGluZ3MubW9kZWxDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLnZpZXdDYWxsYmFja3MpIHRoaXMuX3ZpZXdDYWxsYmFja3MgPSBzZXR0aW5ncy52aWV3Q2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5jb250cm9sbGVyQ2FsbGJhY2tzKSB0aGlzLl9jb250cm9sbGVyQ2FsbGJhY2tzID0gc2V0dGluZ3MuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3MuZW1pdHRlckNhbGxiYWNrcykgdGhpcy5fZW1pdHRlckNhbGxiYWNrcyA9IHNldHRpbmdzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLnJvdXRlckNhbGxiYWNrcykgdGhpcy5fcm91dGVyQ2FsbGJhY2tzID0gc2V0dGluZ3Mucm91dGVyQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5tb2RlbHMpIHRoaXMuX21vZGVscyA9IHNldHRpbmdzLm1vZGVsc1xuICAgICAgaWYoc2V0dGluZ3Mudmlld3MpIHRoaXMuX3ZpZXdzID0gc2V0dGluZ3Mudmlld3NcbiAgICAgIGlmKHNldHRpbmdzLmNvbnRyb2xsZXJzKSB0aGlzLl9jb250cm9sbGVycyA9IHNldHRpbmdzLmNvbnRyb2xsZXJzXG4gICAgICBpZihzZXR0aW5ncy5lbWl0dGVycykgdGhpcy5fZW1pdHRlcnMgPSBzZXR0aW5ncy5lbWl0dGVyc1xuICAgICAgaWYoc2V0dGluZ3Mucm91dGVycykgdGhpcy5fcm91dGVycyA9IHNldHRpbmdzLnJvdXRlcnNcbiAgICAgIGlmKHNldHRpbmdzLm1vZGVsRXZlbnRzKSB0aGlzLl9tb2RlbEV2ZW50cyA9IHNldHRpbmdzLm1vZGVsRXZlbnRzXG4gICAgICBpZihzZXR0aW5ncy52aWV3RXZlbnRzKSB0aGlzLl92aWV3RXZlbnRzID0gc2V0dGluZ3Mudmlld0V2ZW50c1xuICAgICAgaWYoc2V0dGluZ3MuY29udHJvbGxlckV2ZW50cykgdGhpcy5fY29udHJvbGxlckV2ZW50cyA9IHNldHRpbmdzLmNvbnRyb2xsZXJFdmVudHNcbiAgICAgIGlmKHNldHRpbmdzLmVtaXR0ZXJFdmVudHMpIHRoaXMuX2VtaXR0ZXJFdmVudHMgPSBzZXR0aW5ncy5lbWl0dGVyRXZlbnRzXG4gICAgICBpZihzZXR0aW5ncy5yb3V0ZXJFdmVudHMpIHRoaXMuX3JvdXRlckV2ZW50cyA9IHNldHRpbmdzLnJvdXRlckV2ZW50c1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMubW9kZWxFdmVudHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbENhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlTW9kZWxFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMudmlld0V2ZW50cyAmJlxuICAgICAgICB0aGlzLnZpZXdzICYmXG4gICAgICAgIHRoaXMudmlld0NhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlVmlld0V2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5jb250cm9sbGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5lbmFibGVDb250cm9sbGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnJvdXRlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLnJvdXRlcnMgJiZcbiAgICAgICAgdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZVJvdXRlckV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5lbWl0dGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZW1pdHRlcnMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5lbmFibGVFbWl0dGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgfVxuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZGlzYWJsZSgpXG4gICAgdGhpcy5lbmFibGUoKVxuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgIHRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMubW9kZWxFdmVudHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbENhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZU1vZGVsRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnZpZXdFdmVudHMgJiZcbiAgICAgICAgdGhpcy52aWV3cyAmJlxuICAgICAgICB0aGlzLnZpZXdDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVWaWV3RXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVycyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVDb250cm9sbGVyRXZlbnRzKClcbiAgICAgIH19XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5yb3V0ZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5yb3V0ZXJzICYmXG4gICAgICAgIHRoaXMucm91dGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlUm91dGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmVtaXR0ZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVycyAmJlxuICAgICAgICB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVFbWl0dGVyRXZlbnRzKClcbiAgICAgICAgZGVsZXRlIHRoaXMuX21vZGVsQ2FsbGJhY2tzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl92aWV3Q2FsbGJhY2tzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yb3V0ZXJDYWxsYmFja3NcbiAgICAgICAgZGVsZXRlIHRoaXMuX21vZGVsc1xuICAgICAgICBkZWxldGUgdGhpcy5fdmlld3NcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9lbWl0dGVyc1xuICAgICAgICBkZWxldGUgdGhpcy5fcm91dGVyc1xuICAgICAgICBkZWxldGUgdGhpcy5fcm91dGVyRXZlbnRzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9tb2RlbEV2ZW50c1xuICAgICAgICBkZWxldGUgdGhpcy5fdmlld0V2ZW50c1xuICAgICAgICBkZWxldGUgdGhpcy5fY29udHJvbGxlckV2ZW50c1xuICAgICAgICBkZWxldGUgdGhpcy5fZW1pdHRlckV2ZW50c1xuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICB9XG59XG4iLCJNVkMuUm91dGVyID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgcHJvdG9jb2woKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgfVxuICBnZXQgaG9zdG5hbWUoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgfVxuICBnZXQgcG9ydCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wb3J0IH1cbiAgZ2V0IHBhdGgoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgfVxuICBnZXQgaGFzaCgpIHtcbiAgICBsZXQgaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgbGV0IGhhc2hJbmRleCA9IGhyZWYuaW5kZXhPZignIycpXG4gICAgaWYoaGFzaEluZGV4ID4gLTEpIHtcbiAgICAgIGxldCBwYXJhbUluZGV4ID0gaHJlZi5pbmRleE9mKCc/JylcbiAgICAgIGxldCBzbGljZVN0YXJ0ID0gaGFzaEluZGV4ICsgMVxuICAgICAgbGV0IHNsaWNlU3RvcFxuICAgICAgaWYocGFyYW1JbmRleCA+IC0xKSB7XG4gICAgICAgIHNsaWNlU3RvcCA9IChoYXNoSW5kZXggPiBwYXJhbUluZGV4KVxuICAgICAgICAgID8gaHJlZi5sZW5ndGhcbiAgICAgICAgICA6IHBhcmFtSW5kZXhcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNsaWNlU3RvcCA9IGhyZWYubGVuZ3RoXG4gICAgICB9XG4gICAgICBocmVmID0gaHJlZi5zbGljZShzbGljZVN0YXJ0LCBzbGljZVN0b3ApXG4gICAgICBpZihocmVmLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gaHJlZlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbiAgZ2V0IHBhcmFtcygpIHtcbiAgICBsZXQgaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgbGV0IHBhcmFtSW5kZXggPSBocmVmLmluZGV4T2YoJz8nKVxuICAgIGlmKHBhcmFtSW5kZXggPiAtMSkge1xuICAgICAgbGV0IGhhc2hJbmRleCA9IGhyZWYuaW5kZXhPZignIycpXG4gICAgICBsZXQgc2xpY2VTdGFydCA9IHBhcmFtSW5kZXggKyAxXG4gICAgICBsZXQgc2xpY2VTdG9wXG4gICAgICBpZihoYXNoSW5kZXggPiAtMSkge1xuICAgICAgICBzbGljZVN0b3AgPSAocGFyYW1JbmRleCA+IGhhc2hJbmRleClcbiAgICAgICAgICA/IGhyZWYubGVuZ3RoXG4gICAgICAgICAgOiBoYXNoSW5kZXhcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNsaWNlU3RvcCA9IGhyZWYubGVuZ3RoXG4gICAgICB9XG4gICAgICBocmVmID0gaHJlZi5zbGljZShzbGljZVN0YXJ0LCBzbGljZVN0b3ApXG4gICAgICBpZihocmVmLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gaHJlZlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbiAgZ2V0IF9yb3V0ZURhdGEoKSB7XG4gICAgbGV0IHJvdXRlRGF0YSA9IHtcbiAgICAgIGxvY2F0aW9uOiB7fSxcbiAgICAgIGNvbnRyb2xsZXI6IHt9LFxuICAgIH1cbiAgICBsZXQgcGF0aCA9IHRoaXMucGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICBwYXRoID0gKHBhdGgubGVuZ3RoKVxuICAgICAgPyBwYXRoXG4gICAgICA6IFsnLyddXG4gICAgbGV0IGhhc2ggPSB0aGlzLmhhc2hcbiAgICBsZXQgaGFzaEZyYWdtZW50cyA9IChoYXNoKVxuICAgICAgPyBoYXNoLnNwbGl0KCcvJykuZmlsdGVyKChmcmFnbWVudCkgPT4gZnJhZ21lbnQubGVuZ3RoKVxuICAgICAgOiBudWxsXG4gICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zXG4gICAgbGV0IHBhcmFtRGF0YSA9IChwYXJhbXMpXG4gICAgICA/IE1WQy5VdGlscy5wYXJhbXNUb09iamVjdChwYXJhbXMpXG4gICAgICA6IG51bGxcbiAgICBpZih0aGlzLnByb3RvY29sKSByb3V0ZURhdGEubG9jYXRpb24ucHJvdG9jb2wgPSB0aGlzLnByb3RvY29sXG4gICAgaWYodGhpcy5ob3N0bmFtZSkgcm91dGVEYXRhLmxvY2F0aW9uLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZVxuICAgIGlmKHRoaXMucG9ydCkgcm91dGVEYXRhLmxvY2F0aW9uLnBvcnQgPSB0aGlzLnBvcnRcbiAgICBpZih0aGlzLnBhdGgpIHJvdXRlRGF0YS5sb2NhdGlvbi5wYXRoID0gdGhpcy5wYXRoXG4gICAgaWYoXG4gICAgICBoYXNoICYmXG4gICAgICBoYXNoRnJhZ21lbnRzXG4gICAgKSB7XG4gICAgICBoYXNoRnJhZ21lbnRzID0gKGhhc2hGcmFnbWVudHMubGVuZ3RoKVxuICAgICAgPyBoYXNoRnJhZ21lbnRzXG4gICAgICA6IFsnLyddXG4gICAgICByb3V0ZURhdGEubG9jYXRpb24uaGFzaCA9IHtcbiAgICAgICAgcGF0aDogaGFzaCxcbiAgICAgICAgZnJhZ21lbnRzOiBoYXNoRnJhZ21lbnRzLFxuICAgICAgfVxuICAgIH1cbiAgICBpZihcbiAgICAgIHBhcmFtcyAmJlxuICAgICAgcGFyYW1EYXRhXG4gICAgKSB7XG4gICAgICByb3V0ZURhdGEubG9jYXRpb24ucGFyYW1zID0ge1xuICAgICAgICBwYXRoOiBwYXJhbXMsXG4gICAgICAgIGRhdGE6IHBhcmFtRGF0YSxcbiAgICAgIH1cbiAgICB9XG4gICAgcm91dGVEYXRhLmxvY2F0aW9uLnBhdGggPSB7XG4gICAgICBuYW1lOiB0aGlzLnBhdGgsXG4gICAgICBmcmFnbWVudHM6IHBhdGgsXG4gICAgfVxuICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5jdXJyZW50VVJMID0gdGhpcy5jdXJyZW50VVJMXG4gICAgbGV0IHJvdXRlQ29udHJvbGxlckRhdGEgPSB0aGlzLl9yb3V0ZUNvbnRyb2xsZXJEYXRhXG4gICAgcm91dGVEYXRhLmxvY2F0aW9uID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbixcbiAgICAgIHJvdXRlQ29udHJvbGxlckRhdGEubG9jYXRpb25cbiAgICApXG4gICAgcm91dGVEYXRhLmNvbnRyb2xsZXIgPSByb3V0ZUNvbnRyb2xsZXJEYXRhLmNvbnRyb2xsZXJcbiAgICB0aGlzLnJvdXRlRGF0YSA9IHJvdXRlRGF0YVxuICAgIHJldHVybiB0aGlzLnJvdXRlRGF0YVxuICB9XG4gIGdldCBfcm91dGVDb250cm9sbGVyRGF0YSgpIHtcbiAgICBsZXQgcm91dGVEYXRhID0ge1xuICAgICAgbG9jYXRpb246IHt9LFxuICAgIH1cbiAgICBPYmplY3QuZW50cmllcyh0aGlzLnJvdXRlcylcbiAgICAgIC5mb3JFYWNoKChbcm91dGVQYXRoLCByb3V0ZVNldHRpbmdzXSkgPT4ge1xuICAgICAgICBsZXQgcGF0aEZyYWdtZW50cyA9IHRoaXMucGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgICAgcGF0aEZyYWdtZW50cyA9IChwYXRoRnJhZ21lbnRzLmxlbmd0aClcbiAgICAgICAgICA/IHBhdGhGcmFnbWVudHNcbiAgICAgICAgICA6IFsnLyddXG4gICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IHJvdXRlUGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQsIGZyYWdtZW50SW5kZXgpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgICAgcm91dGVGcmFnbWVudHMgPSAocm91dGVGcmFnbWVudHMubGVuZ3RoKVxuICAgICAgICAgID8gcm91dGVGcmFnbWVudHNcbiAgICAgICAgICA6IFsnLyddXG4gICAgICAgIGlmKFxuICAgICAgICAgIHBhdGhGcmFnbWVudHMubGVuZ3RoICYmXG4gICAgICAgICAgcGF0aEZyYWdtZW50cy5sZW5ndGggPT09IHJvdXRlRnJhZ21lbnRzLmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICBsZXQgbWF0Y2hcbiAgICAgICAgICByZXR1cm4gcm91dGVGcmFnbWVudHMuZmlsdGVyKChyb3V0ZUZyYWdtZW50LCByb3V0ZUZyYWdtZW50SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICBtYXRjaCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICAgIG1hdGNoID09PSB0cnVlXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgaWYocm91dGVGcmFnbWVudFswXSA9PT0gJzonKSB7XG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRJREtleSA9IHJvdXRlRnJhZ21lbnQucmVwbGFjZSgnOicsICcnKVxuICAgICAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudEluZGV4ID09PSBwYXRoRnJhZ21lbnRzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5jdXJyZW50SURLZXkgPSBjdXJyZW50SURLZXlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcm91dGVEYXRhLmxvY2F0aW9uW2N1cnJlbnRJREtleV0gPSBwYXRoRnJhZ21lbnRzW3JvdXRlRnJhZ21lbnRJbmRleF1cbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50ID0gdGhpcy5mcmFnbWVudElEUmVnRXhwXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudCA9IHJvdXRlRnJhZ21lbnQucmVwbGFjZShuZXcgUmVnRXhwKCcvJywgJ2dpJyksICdcXFxcXFwvJylcbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50ID0gdGhpcy5yb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cChyb3V0ZUZyYWdtZW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG1hdGNoID0gcm91dGVGcmFnbWVudC50ZXN0KHBhdGhGcmFnbWVudHNbcm91dGVGcmFnbWVudEluZGV4XSlcbiAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgbWF0Y2ggPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50SW5kZXggPT09IHBhdGhGcmFnbWVudHMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByb3V0ZURhdGEubG9jYXRpb24ucm91dGUgPSB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiByb3V0ZVBhdGgsXG4gICAgICAgICAgICAgICAgICBmcmFnbWVudHM6IHJvdXRlRnJhZ21lbnRzLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByb3V0ZURhdGEuY29udHJvbGxlciA9IHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICAgICAgICByZXR1cm4gcm91dGVTZXR0aW5nc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlbMF1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICByZXR1cm4gcm91dGVEYXRhXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGdldCBfcm91dGVzKCkge1xuICAgIHRoaXMucm91dGVzID0gKHRoaXMucm91dGVzKVxuICAgICAgPyB0aGlzLnJvdXRlc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlc1xuICB9XG4gIHNldCBfcm91dGVzKHJvdXRlcykge1xuICAgIHRoaXMucm91dGVzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlcywgdGhpcy5fcm91dGVzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlcigpIHsgcmV0dXJuIHRoaXMuY29udHJvbGxlciB9XG4gIHNldCBfY29udHJvbGxlcihjb250cm9sbGVyKSB7IHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXIgfVxuICBnZXQgX3ByZXZpb3VzVVJMKCkgeyByZXR1cm4gdGhpcy5wcmV2aW91c1VSTCB9XG4gIHNldCBfcHJldmlvdXNVUkwocHJldmlvdXNVUkwpIHsgdGhpcy5wcmV2aW91c1VSTCA9IHByZXZpb3VzVVJMIH1cbiAgZ2V0IF9jdXJyZW50VVJMKCkgeyByZXR1cm4gdGhpcy5jdXJyZW50VVJMIH1cbiAgc2V0IF9jdXJyZW50VVJMKGN1cnJlbnRVUkwpIHtcbiAgICBpZih0aGlzLmN1cnJlbnRVUkwpIHRoaXMuX3ByZXZpb3VzVVJMID0gdGhpcy5jdXJyZW50VVJMXG4gICAgdGhpcy5jdXJyZW50VVJMID0gY3VycmVudFVSTFxuICB9XG4gIGdldCBmcmFnbWVudElEUmVnRXhwKCkgeyByZXR1cm4gbmV3IFJlZ0V4cCgvXihbMC05QS1aXFw/XFw9XFwsXFwuXFwqXFwtXFxfXFwnXFxcIlxcXlxcJVxcJFxcI1xcQFxcIVxcflxcKFxcKVxce1xcfVxcJlxcPFxcPlxcXFxcXC9dKSokLywgJ2dpJykgfVxuICByb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cChmcmFnbWVudCkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKCdeJy5jb25jYXQoZnJhZ21lbnQsICckJykpXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGlmKFxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5lbmFibGVFbWl0dGVycygpXG4gICAgICB0aGlzLmVuYWJsZUV2ZW50cygpXG4gICAgICB0aGlzLmVuYWJsZVJvdXRlcygpXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZGlzYWJsZUV2ZW50cygpXG4gICAgICB0aGlzLmRpc2FibGVSb3V0ZXMoKVxuICAgICAgdGhpcy5kaXNhYmxlRW1pdHRlcnMoKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICB9XG4gIGVuYWJsZVJvdXRlcygpIHtcbiAgICBpZih0aGlzLnNldHRpbmdzLmNvbnRyb2xsZXIpIHRoaXMuX2NvbnRyb2xsZXIgPSB0aGlzLnNldHRpbmdzLmNvbnRyb2xsZXJcbiAgICB0aGlzLl9yb3V0ZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnNldHRpbmdzLnJvdXRlcykucmVkdWNlKFxuICAgICAgKFxuICAgICAgICBfcm91dGVzLFxuICAgICAgICBbcm91dGVQYXRoLCByb3V0ZVNldHRpbmdzXSxcbiAgICAgICAgcm91dGVJbmRleCxcbiAgICAgICAgb3JpZ2luYWxSb3V0ZXMsXG4gICAgICApID0+IHtcbiAgICAgICAgX3JvdXRlc1tyb3V0ZVBhdGhdID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICByb3V0ZVNldHRpbmdzLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhbGxiYWNrOiB0aGlzLmNvbnRyb2xsZXJbcm91dGVTZXR0aW5ncy5jYWxsYmFja10uYmluZCh0aGlzLmNvbnRyb2xsZXIpLFxuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gX3JvdXRlc1xuICAgICAgfSxcbiAgICAgIHt9XG4gICAgKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZW5hYmxlRW1pdHRlcnMoKSB7XG4gICAgT2JqZWN0LmFzc2lnbihcbiAgICAgIHRoaXMuX2VtaXR0ZXJzLFxuICAgICAgdGhpcy5zZXR0aW5ncy5lbWl0dGVycyxcbiAgICAgIHtcbiAgICAgICAgbmF2aWdhdGVFbWl0dGVyOiBuZXcgTVZDLkVtaXR0ZXJzLk5hdmlnYXRlKCksXG4gICAgICB9XG4gICAgKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZGlzYWJsZUVtaXR0ZXJzKCkge1xuICAgIGRlbGV0ZSB0aGlzLl9lbWl0dGVycy5uYXZpZ2F0ZUVtaXR0ZXJcbiAgfVxuICBkaXNhYmxlUm91dGVzKCkge1xuICAgIGRlbGV0ZSB0aGlzLl9yb3V0ZXNcbiAgICBkZWxldGUgdGhpcy5fY29udHJvbGxlclxuICB9XG4gIGVuYWJsZUV2ZW50cygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMucm91dGVDaGFuZ2UuYmluZCh0aGlzKSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGVFdmVudHMoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLnJvdXRlQ2hhbmdlLmJpbmQodGhpcykpXG4gIH1cbiAgcm91dGVDaGFuZ2UoKSB7XG4gICAgdGhpcy5fY3VycmVudFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgbGV0IHJvdXRlRGF0YSA9IHRoaXMuX3JvdXRlRGF0YVxuICAgIGlmKHJvdXRlRGF0YS5jb250cm9sbGVyKSB7XG4gICAgICBsZXQgbmF2aWdhdGVFbWl0dGVyID0gdGhpcy5lbWl0dGVycy5uYXZpZ2F0ZUVtaXR0ZXJcbiAgICAgIGlmKHRoaXMucHJldmlvdXNVUkwpIHJvdXRlRGF0YS5wcmV2aW91c1VSTCA9IHRoaXMucHJldmlvdXNVUkxcbiAgICAgIG5hdmlnYXRlRW1pdHRlclxuICAgICAgICAudW5zZXQoKVxuICAgICAgICAuc2V0KHJvdXRlRGF0YSlcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgbmF2aWdhdGVFbWl0dGVyLm5hbWUsXG4gICAgICAgIG5hdmlnYXRlRW1pdHRlci5lbWlzc2lvbigpXG4gICAgICApXG4gICAgICByb3V0ZURhdGEuY29udHJvbGxlci5jYWxsYmFjayhcbiAgICAgICAgbmF2aWdhdGVFbWl0dGVyLmVtaXNzaW9uKClcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBuYXZpZ2F0ZShwYXRoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoXG4gIH1cbn1cbiJdfQ==
