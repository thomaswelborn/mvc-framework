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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1WQy5qcyIsIkNvbnN0YW50cy5qcyIsIkV2ZW50cy5qcyIsIk9wZXJhdG9ycy5qcyIsImluZGV4LmpzIiwiaXMuanMiLCJ0eXBlT2YuanMiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QuanMiLCJvYmplY3RRdWVyeS5qcyIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMuanMiLCJDaGFubmVscy5qcyIsIkNoYW5uZWwuanMiLCJCYXNlLmpzIiwiU2VydmljZS5qcyIsIlZhbGlkYXRvci5qcyIsIk1vZGVsLmpzIiwiRW1pdHRlci5qcyIsIk5hdmlnYXRlLmpzIiwiVmFsaWRhdGUuanMiLCJWaWV3LmpzIiwiQ29udHJvbGxlci5qcyIsIlJvdXRlci5qcyJdLCJuYW1lcyI6WyJNVkMiLCJDb25zdGFudHMiLCJDT05TVCIsIkV2ZW50cyIsIkVWIiwiT3BlcmF0b3JzIiwiQ29tcGFyaXNvbiIsIkVRIiwiU1RFUSIsIk5PRVEiLCJTVE5PRVEiLCJHVCIsIkxUIiwiR1RFIiwiTFRFIiwiU3RhdGVtZW50IiwiQU5EIiwiT1IiLCJjb25zb2xlIiwibG9nIiwiVXRpbHMiLCJpc0FycmF5Iiwib2JqZWN0IiwiQXJyYXkiLCJpc09iamVjdCIsInR5cGVPZiIsInZhbHVlIiwidmFsdWVBIiwidW5kZWZpbmVkIiwiaXNIVE1MRWxlbWVudCIsIkhUTUxFbGVtZW50IiwiZGF0YSIsIl9vYmplY3QiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QiLCJ0YXJnZXRPYmplY3QiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJwcm9wZXJ0aWVzIiwicHJvcGVydHlOYW1lIiwicHJvcGVydHlWYWx1ZSIsIk9iamVjdCIsImVudHJpZXMiLCJvYmplY3RRdWVyeSIsInN0cmluZyIsImNvbnRleHQiLCJzdHJpbmdEYXRhIiwicGFyc2VOb3RhdGlvbiIsInNwbGljZSIsInJlZHVjZSIsImZyYWdtZW50IiwiZnJhZ21lbnRJbmRleCIsImZyYWdtZW50cyIsInBhcnNlRnJhZ21lbnQiLCJwcm9wZXJ0eUtleSIsIm1hdGNoIiwiY29uY2F0IiwiY2hhckF0Iiwic2xpY2UiLCJzcGxpdCIsIlJlZ0V4cCIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMiLCJ0b2dnbGVNZXRob2QiLCJldmVudHMiLCJ0YXJnZXRPYmplY3RzIiwiY2FsbGJhY2tzIiwiZXZlbnRTZXR0aW5ncyIsImV2ZW50Q2FsbGJhY2tOYW1lIiwiZXZlbnREYXRhIiwiZXZlbnRUYXJnZXRTZXR0aW5ncyIsImV2ZW50TmFtZSIsImV2ZW50VGFyZ2V0cyIsImV2ZW50VGFyZ2V0TmFtZSIsImV2ZW50VGFyZ2V0IiwiZXZlbnRNZXRob2ROYW1lIiwiTm9kZUxpc3QiLCJEb2N1bWVudCIsImV2ZW50Q2FsbGJhY2siLCJfZXZlbnRUYXJnZXQiLCJiaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzIiwidW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMiLCJjb25zdHJ1Y3RvciIsIl9ldmVudHMiLCJldmVudENhbGxiYWNrcyIsIm5hbWUiLCJldmVudENhbGxiYWNrR3JvdXAiLCJvbiIsInB1c2giLCJvZmYiLCJlbWl0IiwiZXZlbnRDYWxsYmFja0dyb3VwTmFtZSIsImFkZGl0aW9uYWxBcmd1bWVudHMiLCJ2YWx1ZXMiLCJDaGFubmVscyIsIl9jaGFubmVscyIsImNoYW5uZWxzIiwiY2hhbm5lbCIsImNoYW5uZWxOYW1lIiwiQ2hhbm5lbCIsIl9yZXNwb25zZXMiLCJyZXNwb25zZXMiLCJyZXNwb25zZSIsInJlc3BvbnNlTmFtZSIsInJlc3BvbnNlQ2FsbGJhY2siLCJyZXF1ZXN0IiwicmVxdWVzdERhdGEiLCJrZXlzIiwiQmFzZSIsInNldHRpbmdzIiwiY29uZmlndXJhdGlvbiIsIl9jb25maWd1cmF0aW9uIiwiX3NldHRpbmdzIiwiX2VtaXR0ZXJzIiwiZW1pdHRlcnMiLCJTZXJ2aWNlIiwiX2RlZmF1bHRzIiwiZGVmYXVsdHMiLCJjb250ZW50VHlwZSIsInJlc3BvbnNlVHlwZSIsIl9yZXNwb25zZVR5cGVzIiwiX3Jlc3BvbnNlVHlwZSIsIl94aHIiLCJmaW5kIiwicmVzcG9uc2VUeXBlSXRlbSIsIl90eXBlIiwidHlwZSIsIl91cmwiLCJ1cmwiLCJfaGVhZGVycyIsImhlYWRlcnMiLCJmb3JFYWNoIiwiaGVhZGVyIiwic2V0UmVxdWVzdEhlYWRlciIsIl9kYXRhIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJfZW5hYmxlZCIsImVuYWJsZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInN0YXR1cyIsImFib3J0Iiwib3BlbiIsIm9ubG9hZCIsIm9uZXJyb3IiLCJzZW5kIiwidGhlbiIsImN1cnJlbnRUYXJnZXQiLCJjYXRjaCIsImVycm9yIiwiZW5hYmxlIiwiZGlzYWJsZSIsIlZhbGlkYXRvciIsInNjaGVtYSIsIl9zY2hlbWEiLCJfcmVzdWx0cyIsInJlc3VsdHMiLCJ2YWxpZGF0ZSIsInZhbGlkYXRpb25TdW1tYXJ5Iiwic2NoZW1hS2V5Iiwic2NoZW1hU2V0dGluZ3MiLCJ2YWxpZGF0aW9uIiwia2V5IiwicmVxdWlyZWQiLCJldmFsdWF0aW9ucyIsInZhbGlkYXRpb25FdmFsdWF0aW9ucyIsImV2YWx1YXRpb25SZXN1bHRzIiwibWVzc2FnZXMiLCJhc3NpZ24iLCJwYXNzIiwiZmFpbCIsImNvbXBhcmF0b3IiLCJyZXN1bHQiLCJtZXNzYWdlIiwiX2V2YWx1YXRpb25zIiwiZXZhbHVhdGlvbiIsImV2YWx1YXRpb25JbmRleCIsInZhbHVlQ29tcGFyaXNvbiIsImNvbXBhcmVWYWx1ZXMiLCJjb21wYXJpc29uIiwiY3VycmVudEV2YWx1YXRpb24iLCJzdGF0ZW1lbnQiLCJwcmV2aW91c0V2YWx1YXRpb24iLCJwcmV2aW91c0V2YWx1YXRpb25Db21wYXJpc29uVmFsdWUiLCJzdGF0ZW1lbnRDb21wYXJpc29uIiwiY29tcGFyZVN0YXRlbWVudHMiLCJldmFsdWF0aW9uVmFsaWRhdGlvbiIsIm9wZXJhdG9yIiwiZXZhbHVhdGlvblJlc3VsdCIsIk1vZGVsIiwiX3ZhbGlkYXRvciIsInZhbGlkYXRvciIsIl9pc1NldHRpbmciLCJpc1NldHRpbmciLCJfY2hhbmdpbmciLCJjaGFuZ2luZyIsIl9sb2NhbFN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJfaGlzdGlvZ3JhbSIsImhpc3Rpb2dyYW0iLCJfaGlzdG9yeSIsImhpc3RvcnkiLCJ1bnNoaWZ0IiwicGFyc2UiLCJfZGIiLCJkYiIsImdldEl0ZW0iLCJlbmRwb2ludCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzZXRJdGVtIiwiX2RhdGFFdmVudHMiLCJkYXRhRXZlbnRzIiwiX2RhdGFDYWxsYmFja3MiLCJkYXRhQ2FsbGJhY2tzIiwiX3NlcnZpY2VzIiwic2VydmljZXMiLCJfc2VydmljZUV2ZW50cyIsInNlcnZpY2VFdmVudHMiLCJfc2VydmljZUNhbGxiYWNrcyIsInNlcnZpY2VDYWxsYmFja3MiLCJlbmFibGVTZXJ2aWNlRXZlbnRzIiwiZGlzYWJsZVNlcnZpY2VFdmVudHMiLCJlbmFibGVEYXRhRXZlbnRzIiwiZGlzYWJsZURhdGFFdmVudHMiLCJzZXREZWZhdWx0cyIsInNldCIsImdldCIsIl9hcmd1bWVudHMiLCJpbmRleCIsInNldERhdGFQcm9wZXJ0eSIsInNldERCIiwidmFsaWRhdGVFbWl0dGVyIiwiZW1pc3Npb24iLCJ1bnNldCIsInVuc2V0RGF0YVByb3BlcnR5IiwidW5zZXREQiIsImRlZmluZVByb3BlcnRpZXMiLCJjb25maWd1cmFibGUiLCJzZXRWYWx1ZUV2ZW50TmFtZSIsImpvaW4iLCJzZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlRXZlbnROYW1lIiwidW5zZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlIiwiZW5hYmxlRW1pdHRlcnMiLCJFbWl0dGVycyIsIlZhbGlkYXRlIiwiZGlzYWJsZUVtaXR0ZXJzIiwiRW1pdHRlciIsIl9uYW1lIiwiTmF2aWdhdGUiLCJhZGRTZXR0aW5ncyIsIm9sZFVSTCIsIlN0cmluZyIsIm5ld1VSTCIsImN1cnJlbnRSb3V0ZSIsImN1cnJlbnRDb250cm9sbGVyIiwiVmlldyIsIl9lbGVtZW50TmFtZSIsIl9lbGVtZW50IiwidGFnTmFtZSIsImVsZW1lbnROYW1lIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJlbGVtZW50T2JzZXJ2ZXIiLCJvYnNlcnZlIiwic3VidHJlZSIsImNoaWxkTGlzdCIsIl9hdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZUtleSIsImF0dHJpYnV0ZVZhbHVlIiwicmVtb3ZlQXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwiX3VpIiwidWkiLCJ1aUtleSIsInVpVmFsdWUiLCJxdWVyeVNlbGVjdG9yQWxsIiwiX3VpRXZlbnRzIiwidWlFdmVudHMiLCJfdWlDYWxsYmFja3MiLCJ1aUNhbGxiYWNrcyIsIl9vYnNlcnZlckNhbGxiYWNrcyIsIm9ic2VydmVyQ2FsbGJhY2tzIiwiX2VsZW1lbnRPYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJlbGVtZW50T2JzZXJ2ZSIsImJpbmQiLCJfaW5zZXJ0IiwiaW5zZXJ0IiwiX3RlbXBsYXRlcyIsInRlbXBsYXRlcyIsIm11dGF0aW9uUmVjb3JkTGlzdCIsIm9ic2VydmVyIiwibXV0YXRpb25SZWNvcmRJbmRleCIsIm11dGF0aW9uUmVjb3JkIiwibXV0YXRpb25SZWNvcmRDYXRlZ29yaWVzIiwibXV0YXRpb25SZWNvcmRDYXRlZ29yeSIsInJlc2V0VUkiLCJhdXRvSW5zZXJ0IiwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50IiwibWV0aG9kIiwiYXV0b1JlbW92ZSIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImVuYWJsZUVsZW1lbnQiLCJkaXNhYmxlRWxlbWVudCIsImRpc2FibGVVSSIsImVuYWJsZVVJIiwiZW5hYmxlVUlFdmVudHMiLCJkaXNhYmxlVUlFdmVudHMiLCJ0aGlzcyIsIkNvbnRyb2xsZXIiLCJfZW1pdHRlckNhbGxiYWNrcyIsImVtaXR0ZXJDYWxsYmFja3MiLCJfbW9kZWxDYWxsYmFja3MiLCJtb2RlbENhbGxiYWNrcyIsIl92aWV3Q2FsbGJhY2tzIiwidmlld0NhbGxiYWNrcyIsIl9jb250cm9sbGVyQ2FsbGJhY2tzIiwiY29udHJvbGxlckNhbGxiYWNrcyIsIl9tb2RlbHMiLCJtb2RlbHMiLCJfdmlld3MiLCJ2aWV3cyIsIl9jb250cm9sbGVycyIsImNvbnRyb2xsZXJzIiwiX3JvdXRlcnMiLCJyb3V0ZXJzIiwiX3JvdXRlckV2ZW50cyIsInJvdXRlckV2ZW50cyIsIl9yb3V0ZXJDYWxsYmFja3MiLCJyb3V0ZXJDYWxsYmFja3MiLCJfZW1pdHRlckV2ZW50cyIsImVtaXR0ZXJFdmVudHMiLCJfbW9kZWxFdmVudHMiLCJtb2RlbEV2ZW50cyIsIl92aWV3RXZlbnRzIiwidmlld0V2ZW50cyIsIl9jb250cm9sbGVyRXZlbnRzIiwiY29udHJvbGxlckV2ZW50cyIsImVuYWJsZU1vZGVsRXZlbnRzIiwiZGlzYWJsZU1vZGVsRXZlbnRzIiwiZW5hYmxlVmlld0V2ZW50cyIsImRpc2FibGVWaWV3RXZlbnRzIiwiZW5hYmxlQ29udHJvbGxlckV2ZW50cyIsImRpc2FibGVDb250cm9sbGVyRXZlbnRzIiwiZW5hYmxlRW1pdHRlckV2ZW50cyIsImRpc2FibGVFbWl0dGVyRXZlbnRzIiwiZW5hYmxlUm91dGVyRXZlbnRzIiwiZGlzYWJsZVJvdXRlckV2ZW50cyIsInJlc2V0IiwiUm91dGVyIiwicHJvdG9jb2wiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhvc3RuYW1lIiwicG9ydCIsInBhdGgiLCJwYXRobmFtZSIsImhhc2giLCJocmVmIiwiaGFzaEluZGV4IiwiaW5kZXhPZiIsInBhcmFtSW5kZXgiLCJzbGljZVN0YXJ0Iiwic2xpY2VTdG9wIiwicGFyYW1zIiwiX3JvdXRlRGF0YSIsInJvdXRlRGF0YSIsImNvbnRyb2xsZXIiLCJmaWx0ZXIiLCJoYXNoRnJhZ21lbnRzIiwicGFyYW1EYXRhIiwicGFyYW1zVG9PYmplY3QiLCJjdXJyZW50VVJMIiwicm91dGVDb250cm9sbGVyRGF0YSIsIl9yb3V0ZUNvbnRyb2xsZXJEYXRhIiwicm91dGVzIiwicm91dGVQYXRoIiwicm91dGVTZXR0aW5ncyIsInBhdGhGcmFnbWVudHMiLCJyb3V0ZUZyYWdtZW50cyIsInJvdXRlRnJhZ21lbnQiLCJyb3V0ZUZyYWdtZW50SW5kZXgiLCJjdXJyZW50SURLZXkiLCJyZXBsYWNlIiwiZnJhZ21lbnRJRFJlZ0V4cCIsInJvdXRlRnJhZ21lbnROYW1lUmVnRXhwIiwidGVzdCIsInJvdXRlIiwiX3JvdXRlcyIsIl9jb250cm9sbGVyIiwiX3ByZXZpb3VzVVJMIiwicHJldmlvdXNVUkwiLCJfY3VycmVudFVSTCIsImVuYWJsZUV2ZW50cyIsImVuYWJsZVJvdXRlcyIsImRpc2FibGVFdmVudHMiLCJkaXNhYmxlUm91dGVzIiwicm91dGVJbmRleCIsIm9yaWdpbmFsUm91dGVzIiwiY2FsbGJhY2siLCJuYXZpZ2F0ZUVtaXR0ZXIiLCJhZGRFdmVudExpc3RlbmVyIiwicm91dGVDaGFuZ2UiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibmF2aWdhdGUiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLEVBQWpCO0FDQUFBLEdBQUcsQ0FBQ0MsU0FBSixHQUFnQixFQUFoQjtBQUNBRCxHQUFHLENBQUNFLEtBQUosR0FBWUYsR0FBRyxDQUFDQyxTQUFoQjtBQ0RBRCxHQUFHLENBQUNDLFNBQUosQ0FBY0UsTUFBZCxHQUF1QixFQUF2QjtBQUNBSCxHQUFHLENBQUNFLEtBQUosQ0FBVUUsRUFBVixHQUFlSixHQUFHLENBQUNDLFNBQUosQ0FBY0UsTUFBN0I7QUNEQUgsR0FBRyxDQUFDQyxTQUFKLENBQWNJLFNBQWQsR0FBMEIsRUFBMUI7QUFDQUwsR0FBRyxDQUFDRSxLQUFKLENBQVVHLFNBQVYsR0FBc0IsRUFBdEI7QUFDQUwsR0FBRyxDQUFDRSxLQUFKLENBQVVHLFNBQVYsQ0FBb0JDLFVBQXBCLEdBQWlDO0FBQy9CQyxFQUFBQSxFQUFFLEVBQUUsSUFEMkI7QUFFL0JDLEVBQUFBLElBQUksRUFBRSxNQUZ5QjtBQUcvQkMsRUFBQUEsSUFBSSxFQUFFLE1BSHlCO0FBSS9CQyxFQUFBQSxNQUFNLEVB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RUFBTztBQUNiSixJQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JNLElBQWhCLEdBQXVCSCxJQUF2QjtBQUNEOztBQXhSaUMsQ0FBcEMiLCJmaWxlIjoiYnJvd3Nlci9tdmMtZnJhbWV3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE1WQyA9IE1WQyB8fCB7fVxyXG4iLCJNVkMuQ29uc3RhbnRzID0ge31cbk1WQy5DT05TVCA9IE1WQy5Db25zdGFudHNcbiIsIk1WQy5FdmVudHMgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfZXZlbnRzKCkge1xyXG4gICAgdGhpcy5ldmVudHMgPSAodGhpcy5ldmVudHMpXHJcbiAgICAgID8gdGhpcy5ldmVudHNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzXHJcbiAgfVxyXG4gIGV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSkgeyByZXR1cm4gdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gfHwge30gfVxyXG4gIGV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIHJldHVybiAoZXZlbnRDYWxsYmFjay5uYW1lLmxlbmd0aClcclxuICAgICAgPyBldmVudENhbGxiYWNrLm5hbWVcclxuICAgICAgOiAnYW5vbnltb3VzRnVuY3Rpb24nXHJcbiAgfVxyXG4gIGV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpIHtcclxuICAgIHJldHVybiBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gfHwgW11cclxuICB9XHJcbiAgb24oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKSB7XHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja3MgPSB0aGlzLmV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSlcclxuICAgIGxldCBldmVudENhbGxiYWNrTmFtZSA9IHRoaXMuZXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgIGxldCBldmVudENhbGxiYWNrR3JvdXAgPSB0aGlzLmV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpXHJcbiAgICBldmVudENhbGxiYWNrR3JvdXAucHVzaChldmVudENhbGxiYWNrKVxyXG4gICAgZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdID0gZXZlbnRDYWxsYmFja0dyb3VwXHJcbiAgICB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSA9IGV2ZW50Q2FsbGJhY2tzXHJcbiAgfVxyXG4gIG9mZigpIHtcclxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrTmFtZSA9IHRoaXMuZXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1bZXZlbnRDYWxsYmFja05hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICB9XHJcbiAgZW1pdChldmVudE5hbWUsIGV2ZW50RGF0YSkge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5ldmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBmb3IobGV0IFtldmVudENhbGxiYWNrR3JvdXBOYW1lLCBldmVudENhbGxiYWNrR3JvdXBdIG9mIE9iamVjdC5lbnRyaWVzKGV2ZW50Q2FsbGJhY2tzKSkge1xyXG4gICAgICBmb3IobGV0IGV2ZW50Q2FsbGJhY2sgb2YgZXZlbnRDYWxsYmFja0dyb3VwKSB7XHJcbiAgICAgICAgbGV0IGFkZGl0aW9uYWxBcmd1bWVudHMgPSBPYmplY3QudmFsdWVzKGFyZ3VtZW50cykuc3BsaWNlKDIpIHx8IFtdXHJcbiAgICAgICAgZXZlbnRDYWxsYmFjayhldmVudERhdGEsIC4uLmFkZGl0aW9uYWxBcmd1bWVudHMpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiTVZDLkNvbnN0YW50cy5PcGVyYXRvcnMgPSB7fVxyXG5NVkMuQ09OU1QuT3BlcmF0b3JzID0ge31cclxuTVZDLkNPTlNULk9wZXJhdG9ycy5Db21wYXJpc29uID0ge1xyXG4gIEVROiAnRVEnLFxyXG4gIFNURVE6ICdTVEVRJyxcclxuICBOT0VROiAnTk9FUScsXHJcbiAgU1ROT0VROiAnU1ROT0VRJyxcclxuICBHVDogJ0dUJyxcclxuICBMVDogJ0xUJyxcclxuICBHVEU6ICdHVEUnLFxyXG4gIExURTogJ0xURScsXHJcbn1cclxuTVZDLkNPTlNULk9wZXJhdG9ycy5TdGF0ZW1lbnQgPSB7XHJcbiAgQU5EOiAnQU5EJyxcclxuICBPUjogJ09SJ1xyXG59XHJcbmNvbnNvbGUubG9nKE1WQy5DT05TVClcclxuIiwiTVZDLkVtaXR0ZXJzID0ge31cclxuIiwiTVZDLlV0aWxzLmlzQXJyYXkgPSBmdW5jdGlvbiBpc0FycmF5KG9iamVjdCkgeyByZXR1cm4gQXJyYXkuaXNBcnJheShvYmplY3QpIH1cclxuTVZDLlV0aWxzLmlzT2JqZWN0ID0gZnVuY3Rpb24gaXNPYmplY3Qob2JqZWN0KSB7XHJcbiAgcmV0dXJuIChcclxuICAgICFBcnJheS5pc0FycmF5KG9iamVjdCkgJiZcclxuICAgIG9iamVjdCAhPT0gbnVsbFxyXG4gICkgPyB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0J1xyXG4gICAgOiBmYWxzZVxyXG59XHJcbk1WQy5VdGlscy50eXBlT2YgPSBmdW5jdGlvbiB0eXBlT2YodmFsdWUpIHtcclxuICByZXR1cm4gKHR5cGVvZiB2YWx1ZUEgPT09ICdvYmplY3QnKVxyXG4gICAgPyAoTVZDLlV0aWxzLmlzT2JqZWN0KHZhbHVlQSkpXHJcbiAgICAgID8gJ29iamVjdCdcclxuICAgICAgOiAoTVZDLlV0aWxzLmlzQXJyYXkodmFsdWVBKSlcclxuICAgICAgICA/ICdhcnJheSdcclxuICAgICAgICA6ICh2YWx1ZUEgPT09IG51bGwpXHJcbiAgICAgICAgICA/ICdudWxsJ1xyXG4gICAgICAgICAgOiB1bmRlZmluZWRcclxuICAgIDogdHlwZW9mIHZhbHVlXHJcbn1cclxuTVZDLlV0aWxzLmlzSFRNTEVsZW1lbnQgPSBmdW5jdGlvbiBpc0hUTUxFbGVtZW50KG9iamVjdCkge1xyXG4gIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxyXG59XHJcbiIsIk1WQy5VdGlscy50eXBlT2YgPSAgZnVuY3Rpb24gdHlwZU9mKGRhdGEpIHtcclxuICBzd2l0Y2godHlwZW9mIGRhdGEpIHtcclxuICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgIGxldCBfb2JqZWN0XHJcbiAgICAgIGlmKE1WQy5VdGlscy5pc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgLy8gQXJyYXlcclxuICAgICAgICByZXR1cm4gJ2FycmF5J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgTVZDLlV0aWxzLmlzT2JqZWN0KGRhdGEpXHJcbiAgICAgICkge1xyXG4gICAgICAgIC8vIE9iamVjdFxyXG4gICAgICAgIHJldHVybiAnb2JqZWN0J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgZGF0YSA9PT0gbnVsbFxyXG4gICAgICApIHtcclxuICAgICAgICAvLyBOdWxsXHJcbiAgICAgICAgcmV0dXJuICdudWxsJ1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBfb2JqZWN0XHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgY2FzZSAnbnVtYmVyJzpcclxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgcmV0dXJuIHR5cGVvZiBkYXRhXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QgPSBmdW5jdGlvbiBhZGRQcm9wZXJ0aWVzVG9PYmplY3QoKSB7XHJcbiAgbGV0IHRhcmdldE9iamVjdFxyXG4gIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICBjYXNlIDI6XHJcbiAgICAgIGxldCBwcm9wZXJ0aWVzID0gYXJndW1lbnRzWzBdXHJcbiAgICAgIHRhcmdldE9iamVjdCA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICBmb3IobGV0IFtwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BlcnRpZXMpKSB7XHJcbiAgICAgICAgdGFyZ2V0T2JqZWN0W3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlXHJcbiAgICAgIH1cclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgMzpcclxuICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICBsZXQgcHJvcGVydHlWYWx1ZSA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICB0YXJnZXRPYmplY3QgPSBhcmd1bWVudHNbMl1cclxuICAgICAgdGFyZ2V0T2JqZWN0W3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIHJldHVybiB0YXJnZXRPYmplY3RcclxufVxyXG4iLCJNVkMuVXRpbHMub2JqZWN0UXVlcnkgPSBmdW5jdGlvbiBvYmplY3RRdWVyeShcclxuICBzdHJpbmcsXHJcbiAgY29udGV4dFxyXG4pIHtcclxuICBsZXQgc3RyaW5nRGF0YSA9IE1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZU5vdGF0aW9uKHN0cmluZylcclxuICBpZihzdHJpbmdEYXRhWzBdID09PSAnQCcpIHN0cmluZ0RhdGEuc3BsaWNlKDAsIDEpXHJcbiAgaWYoIXN0cmluZ0RhdGEubGVuZ3RoKSByZXR1cm4gY29udGV4dFxyXG4gIGNvbnRleHQgPSAoTVZDLlV0aWxzLmlzT2JqZWN0KGNvbnRleHQpKVxyXG4gICAgPyBPYmplY3QuZW50cmllcyhjb250ZXh0KVxyXG4gICAgOiBjb250ZXh0XHJcbiAgcmV0dXJuIHN0cmluZ0RhdGEucmVkdWNlKChvYmplY3QsIGZyYWdtZW50LCBmcmFnbWVudEluZGV4LCBmcmFnbWVudHMpID0+IHtcclxuICAgIGxldCBwcm9wZXJ0aWVzID0gW11cclxuICAgIGZyYWdtZW50ID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlRnJhZ21lbnQoZnJhZ21lbnQpXHJcbiAgICBmb3IobGV0IFtwcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV0gb2Ygb2JqZWN0KSB7XHJcbiAgICAgIGlmKHByb3BlcnR5S2V5Lm1hdGNoKGZyYWdtZW50KSkge1xyXG4gICAgICAgIGlmKGZyYWdtZW50SW5kZXggPT09IGZyYWdtZW50cy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoW1twcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV1dKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoT2JqZWN0LmVudHJpZXMocHJvcGVydHlWYWx1ZSkpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBvYmplY3QgPSBwcm9wZXJ0aWVzXHJcbiAgICByZXR1cm4gb2JqZWN0XHJcbiAgfSwgY29udGV4dClcclxufVxyXG5NVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VOb3RhdGlvbiA9IGZ1bmN0aW9uIHBhcnNlTm90YXRpb24oc3RyaW5nKSB7XHJcbiAgaWYoXHJcbiAgICBzdHJpbmcuY2hhckF0KDApID09PSAnWycgJiZcclxuICAgIHN0cmluZy5jaGFyQXQoc3RyaW5nLmxlbmd0aCAtIDEpID09ICddJ1xyXG4gICkge1xyXG4gICAgc3RyaW5nID0gc3RyaW5nXHJcbiAgICAgIC5zbGljZSgxLCAtMSlcclxuICAgICAgLnNwbGl0KCddWycpXHJcbiAgfSBlbHNlIHtcclxuICAgIHN0cmluZyA9IHN0cmluZ1xyXG4gICAgICAuc3BsaXQoJy4nKVxyXG4gIH1cclxuICByZXR1cm4gc3RyaW5nXHJcbn1cclxuTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlRnJhZ21lbnQgPSBmdW5jdGlvbiBwYXJzZUZyYWdtZW50KGZyYWdtZW50KSB7XHJcbiAgaWYoXHJcbiAgICBmcmFnbWVudC5jaGFyQXQoMCkgPT09ICcvJyAmJlxyXG4gICAgZnJhZ21lbnQuY2hhckF0KGZyYWdtZW50Lmxlbmd0aCAtIDEpID09ICcvJ1xyXG4gICkge1xyXG4gICAgZnJhZ21lbnQgPSBmcmFnbWVudC5zbGljZSgxLCAtMSlcclxuICAgIGZyYWdtZW50ID0gbmV3IFJlZ0V4cCgnXicuY29uY2F0KGZyYWdtZW50LCAnJCcpKVxyXG4gIH1cclxuICByZXR1cm4gZnJhZ21lbnRcclxufVxyXG4iLCJNVkMuVXRpbHMudG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIHRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoXHJcbiAgdG9nZ2xlTWV0aG9kLFxyXG4gIGV2ZW50cyxcclxuICB0YXJnZXRPYmplY3RzLFxyXG4gIGNhbGxiYWNrc1xyXG4pIHtcclxuICBmb3IobGV0IFtldmVudFNldHRpbmdzLCBldmVudENhbGxiYWNrTmFtZV0gb2YgT2JqZWN0LmVudHJpZXMoZXZlbnRzKSkge1xyXG4gICAgbGV0IGV2ZW50RGF0YSA9IGV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxyXG4gICAgbGV0IGV2ZW50VGFyZ2V0U2V0dGluZ3MgPSBldmVudERhdGFbMF1cclxuICAgIGxldCBldmVudE5hbWUgPSBldmVudERhdGFbMV1cclxuICAgIGxldCBldmVudFRhcmdldHMgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkoXHJcbiAgICAgIGV2ZW50VGFyZ2V0U2V0dGluZ3MsXHJcbiAgICAgIHRhcmdldE9iamVjdHNcclxuICAgIClcclxuICAgIGV2ZW50VGFyZ2V0cyA9ICghTVZDLlV0aWxzLmlzQXJyYXkoZXZlbnRUYXJnZXRzKSlcclxuICAgICAgPyBbWydAJywgZXZlbnRUYXJnZXRzXV1cclxuICAgICAgOiBldmVudFRhcmdldHNcclxuICAgIGZvcihsZXQgW2V2ZW50VGFyZ2V0TmFtZSwgZXZlbnRUYXJnZXRdIG9mIGV2ZW50VGFyZ2V0cykge1xyXG4gICAgICBsZXQgZXZlbnRNZXRob2ROYW1lID0gKHRvZ2dsZU1ldGhvZCA9PT0gJ29uJylcclxuICAgICAgPyAoXHJcbiAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCB8fFxyXG4gICAgICAgIChcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgRG9jdW1lbnRcclxuICAgICAgICApXHJcbiAgICAgICkgPyAnYWRkRXZlbnRMaXN0ZW5lcidcclxuICAgICAgICA6ICdvbidcclxuICAgICAgOiAoXHJcbiAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCB8fFxyXG4gICAgICAgIChcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgRG9jdW1lbnRcclxuICAgICAgICApXHJcbiAgICAgICkgPyAncmVtb3ZlRXZlbnRMaXN0ZW5lcidcclxuICAgICAgICA6ICdvZmYnXHJcbiAgICAgIGxldCBldmVudENhbGxiYWNrID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5KFxyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2tOYW1lLFxyXG4gICAgICAgIGNhbGxiYWNrc1xyXG4gICAgICApWzBdWzFdXHJcbiAgICAgIGlmKGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuICAgICAgICBmb3IobGV0IF9ldmVudFRhcmdldCBvZiBldmVudFRhcmdldCkge1xyXG4gICAgICAgICAgX2V2ZW50VGFyZ2V0W2V2ZW50TWV0aG9kTmFtZV0oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmKGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICBldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5NVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIGJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMoKSB7XHJcbiAgdGhpcy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKCdvbicsIC4uLmFyZ3VtZW50cylcclxufVxyXG5NVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMgPSBmdW5jdGlvbiB1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cygpIHtcclxuICB0aGlzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoJ29mZicsIC4uLmFyZ3VtZW50cylcclxufVxyXG4iLCJNVkMuQ2hhbm5lbHMgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfY2hhbm5lbHMoKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzID0gKHRoaXMuY2hhbm5lbHMpXHJcbiAgICAgID8gdGhpcy5jaGFubmVsc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsc1xyXG4gIH1cclxuICBjaGFubmVsKGNoYW5uZWxOYW1lKSB7XHJcbiAgICB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0gPSAodGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdKVxyXG4gICAgICA/IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA6IG5ldyBNVkMuQ2hhbm5lbHMuQ2hhbm5lbCgpXHJcbiAgICByZXR1cm4gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG4gIG9mZihjaGFubmVsTmFtZSkge1xyXG4gICAgZGVsZXRlIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxufVxyXG4iLCJNVkMuQ2hhbm5lbHMuQ2hhbm5lbCA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9yZXNwb25zZXMoKSB7XHJcbiAgICB0aGlzLnJlc3BvbnNlcyA9ICh0aGlzLnJlc3BvbnNlcylcclxuICAgICAgPyB0aGlzLnJlc3BvbnNlc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZihyZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdID0gcmVzcG9uc2VDYWxsYmFja1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZV1cclxuICAgIH1cclxuICB9XHJcbiAgcmVxdWVzdChyZXNwb25zZU5hbWUsIHJlcXVlc3REYXRhKSB7XHJcbiAgICBpZih0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0ocmVxdWVzdERhdGEpXHJcbiAgICB9XHJcbiAgfVxyXG4gIG9mZihyZXNwb25zZU5hbWUpIHtcclxuICAgIGlmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvcihsZXQgW3Jlc3BvbnNlTmFtZV0gb2YgT2JqZWN0LmtleXModGhpcy5fcmVzcG9uc2VzKSkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIk1WQy5CYXNlID0gY2xhc3MgZXh0ZW5kcyBNVkMuRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncywgY29uZmlndXJhdGlvbikge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgaWYoY29uZmlndXJhdGlvbikgdGhpcy5fY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb25cclxuICAgIGlmKHNldHRpbmdzKSB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgfVxyXG4gIGdldCBfY29uZmlndXJhdGlvbigpIHtcclxuICAgIHRoaXMuY29uZmlndXJhdGlvbiA9ICh0aGlzLmNvbmZpZ3VyYXRpb24pXHJcbiAgICAgID8gdGhpcy5jb25maWd1cmF0aW9uXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25cclxuICB9XHJcbiAgc2V0IF9jb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHsgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbiB9XHJcbiAgZ2V0IF9zZXR0aW5ncygpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSAodGhpcy5zZXR0aW5ncylcclxuICAgICAgPyB0aGlzLnNldHRpbmdzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLnNldHRpbmdzXHJcbiAgfVxyXG4gIHNldCBfc2V0dGluZ3Moc2V0dGluZ3MpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxyXG4gICAgICBzZXR0aW5ncywgdGhpcy5fc2V0dGluZ3NcclxuICAgIClcclxuICB9XHJcbiAgZ2V0IF9lbWl0dGVycygpIHtcclxuICAgIHRoaXMuZW1pdHRlcnMgPSAodGhpcy5lbWl0dGVycylcclxuICAgICAgPyB0aGlzLmVtaXR0ZXJzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXJzXHJcbiAgfVxyXG4gIHNldCBfZW1pdHRlcnMoZW1pdHRlcnMpIHtcclxuICAgIHRoaXMuZW1pdHRlcnMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxyXG4gICAgICBlbWl0dGVycywgdGhpcy5fZW1pdHRlcnNcclxuICAgIClcclxuICB9XHJcbn1cclxuIiwiTVZDLlNlcnZpY2UgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLmRlZmF1bHRzIHx8IHtcbiAgICBjb250ZW50VHlwZTogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICB9IH1cbiAgZ2V0IF9yZXNwb25zZVR5cGVzKCkgeyByZXR1cm4gWycnLCAnYXJyYXlidWZmZXInLCAnYmxvYicsICdkb2N1bWVudCcsICdqc29uJywgJ3RleHQnXSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlKCkgeyByZXR1cm4gdGhpcy5yZXNwb25zZVR5cGUgfVxuICBzZXQgX3Jlc3BvbnNlVHlwZShyZXNwb25zZVR5cGUpIHtcbiAgICB0aGlzLl94aHIucmVzcG9uc2VUeXBlID0gdGhpcy5fcmVzcG9uc2VUeXBlcy5maW5kKFxuICAgICAgKHJlc3BvbnNlVHlwZUl0ZW0pID0+IHJlc3BvbnNlVHlwZUl0ZW0gPT09IHJlc3BvbnNlVHlwZVxuICAgICkgfHwgdGhpcy5fZGVmYXVsdHMucmVzcG9uc2VUeXBlXG4gIH1cbiAgZ2V0IF90eXBlKCkgeyByZXR1cm4gdGhpcy50eXBlIH1cbiAgc2V0IF90eXBlKHR5cGUpIHsgdGhpcy50eXBlID0gdHlwZSB9XG4gIGdldCBfdXJsKCkgeyByZXR1cm4gdGhpcy51cmwgfVxuICBzZXQgX3VybCh1cmwpIHsgdGhpcy51cmwgPSB1cmwgfVxuICBnZXQgX2hlYWRlcnMoKSB7IHJldHVybiB0aGlzLmhlYWRlcnMgfHwgW10gfVxuICBzZXQgX2hlYWRlcnMoaGVhZGVycykge1xuICAgIHRoaXMuX2hlYWRlcnMubGVuZ3RoID0gMFxuICAgIGhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICB0aGlzLl9oZWFkZXJzLnB1c2goaGVhZGVyKVxuICAgICAgaGVhZGVyID0gT2JqZWN0LmVudHJpZXMoaGVhZGVyKVswXVxuICAgICAgdGhpcy5feGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgfSlcbiAgfVxuICBnZXQgX2RhdGEoKSB7IHJldHVybiB0aGlzLmRhdGEgfVxuICBzZXQgX2RhdGEoZGF0YSkgeyB0aGlzLmRhdGEgPSBkYXRhIH1cbiAgZ2V0IF94aHIoKSB7XG4gICAgdGhpcy54aHIgPSAodGhpcy54aHIpXG4gICAgICA/IHRoaXMueGhyXG4gICAgICA6IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgcmV0dXJuIHRoaXMueGhyXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIHJlcXVlc3QoZGF0YSkge1xuICAgIGRhdGEgPSBkYXRhIHx8IHRoaXMuZGF0YSB8fCBudWxsXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmKHRoaXMuX3hoci5zdGF0dXMgPT09IDIwMCkgdGhpcy5feGhyLmFib3J0KClcbiAgICAgIHRoaXMuX3hoci5vcGVuKHRoaXMudHlwZSwgdGhpcy51cmwpXG4gICAgICB0aGlzLl9oZWFkZXJzID0gdGhpcy5zZXR0aW5ncy5oZWFkZXJzIHx8IFt0aGlzLl9kZWZhdWx0cy5jb250ZW50VHlwZV1cbiAgICAgIHRoaXMuX3hoci5vbmxvYWQgPSByZXNvbHZlXG4gICAgICB0aGlzLl94aHIub25lcnJvciA9IHJlamVjdFxuICAgICAgdGhpcy5feGhyLnNlbmQoZGF0YSlcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgdGhpcy5lbWl0KCd4aHI6cmVzb2x2ZScsIHtcbiAgICAgICAgbmFtZTogJ3hocjpyZXNvbHZlJyxcbiAgICAgICAgZGF0YTogcmVzcG9uc2UuY3VycmVudFRhcmdldCxcbiAgICAgIH0pXG4gICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHsgdGhyb3cgZXJyb3IgfSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgIXRoaXMuZW5hYmxlZCAmJlxuICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgaWYoc2V0dGluZ3MudHlwZSkgdGhpcy5fdHlwZSA9IHNldHRpbmdzLnR5cGVcbiAgICAgIGlmKHNldHRpbmdzLnVybCkgdGhpcy5fdXJsID0gc2V0dGluZ3MudXJsXG4gICAgICBpZihzZXR0aW5ncy5kYXRhKSB0aGlzLl9kYXRhID0gc2V0dGluZ3MuZGF0YSB8fCBudWxsXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnJlc3BvbnNlVHlwZSkgdGhpcy5fcmVzcG9uc2VUeXBlID0gdGhpcy5fc2V0dGluZ3MucmVzcG9uc2VUeXBlXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgdGhpcy5lbmFibGVkICYmXG4gICAgICBPYmplY3Qua2V5cyhzZXR0aW5ncykubGVuZ3RoXG4gICAgKSB7XG4gICAgICBkZWxldGUgdGhpcy5fdHlwZVxuICAgICAgZGVsZXRlIHRoaXMuX3VybFxuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFcbiAgICAgIGRlbGV0ZSB0aGlzLl9oZWFkZXJzXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VUeXBlXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuIiwiTVZDLlZhbGlkYXRvciA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcihzY2hlbWEpIHtcclxuICAgIHRoaXMuX3NjaGVtYSA9IHNjaGVtYVxyXG4gIH1cclxuICBnZXQgX3NjaGVtYSgpIHsgcmV0dXJuIHRoaXMuc2NoZW1hIH1cclxuICBzZXQgX3NjaGVtYShzY2hlbWEpIHsgdGhpcy5zY2hlbWEgPSBzY2hlbWEgfVxyXG4gIGdldCBfcmVzdWx0cygpIHsgcmV0dXJuIHRoaXMucmVzdWx0cyB9XHJcbiAgc2V0IF9yZXN1bHRzKHJlc3VsdHMpIHsgdGhpcy5yZXN1bHRzID0gcmVzdWx0cyB9XHJcbiAgZ2V0IF9kYXRhKCkgeyByZXR1cm4gdGhpcy5kYXRhIH1cclxuICBzZXQgX2RhdGEoZGF0YSkgeyB0aGlzLmRhdGEgPSBkYXRhIH1cclxuICB2YWxpZGF0ZShkYXRhKSB7XHJcbiAgICB0aGlzLl9kYXRhID0gZGF0YVxyXG4gICAgbGV0IHZhbGlkYXRpb25TdW1tYXJ5ID0ge31cclxuICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuX3NjaGVtYSlcclxuICAgICAgLmZvckVhY2goKFtzY2hlbWFLZXksIHNjaGVtYVNldHRpbmdzXSkgPT4ge1xyXG4gICAgICAgIGxldCB2YWxpZGF0aW9uID0ge31cclxuICAgICAgICBsZXQgdmFsdWUgPSBkYXRhW3NjaGVtYUtleV1cclxuICAgICAgICB2YWxpZGF0aW9uLmtleSA9IHNjaGVtYUtleVxyXG4gICAgICAgIGlmKHNjaGVtYVNldHRpbmdzLnJlcXVpcmVkKSB7XHJcbiAgICAgICAgICB2YWxpZGF0aW9uLnJlcXVpcmVkID0gdGhpcy5yZXF1aXJlZCh2YWx1ZSwgc2NoZW1hU2V0dGluZ3MucmVxdWlyZWQpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHNjaGVtYVNldHRpbmdzLnR5cGUpIHtcclxuICAgICAgICAgIHZhbGlkYXRpb24udHlwZSA9IHRoaXMudHlwZSh2YWx1ZSwgc2NoZW1hU2V0dGluZ3MudHlwZSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoc2NoZW1hU2V0dGluZ3MuZXZhbHVhdGlvbnMpIHtcclxuICAgICAgICAgIGxldCB2YWxpZGF0aW9uRXZhbHVhdGlvbnMgPSB0aGlzLmV2YWx1YXRpb25zKHZhbHVlLCBzY2hlbWFTZXR0aW5ncy5ldmFsdWF0aW9ucylcclxuICAgICAgICAgIHZhbGlkYXRpb24uZXZhbHVhdGlvbnMgPSB0aGlzLmV2YWx1YXRpb25SZXN1bHRzKHZhbGlkYXRpb25FdmFsdWF0aW9ucylcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFsaWRhdGlvblN1bW1hcnlbc2NoZW1hS2V5XSA9IHZhbGlkYXRpb25cclxuICAgICAgfSlcclxuICAgIHRoaXMuX3Jlc3VsdHMgPSB2YWxpZGF0aW9uU3VtbWFyeVxyXG4gICAgcmV0dXJuIHZhbGlkYXRpb25TdW1tYXJ5XHJcbiAgfVxyXG4gIHJlcXVpcmVkKHZhbHVlLCBzY2hlbWFTZXR0aW5ncykge1xyXG4gICAgbGV0IHZhbGlkYXRpb25TdW1tYXJ5ID0ge1xyXG4gICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICB9XHJcbiAgICBsZXQgbWVzc2FnZXMgPSBPYmplY3QuYXNzaWduKFxyXG4gICAgICB7XHJcbiAgICAgICAgcGFzczogJ1ZhbHVlIGlzIGRlZmluZWQuJyxcclxuICAgICAgICBmYWlsOiAnVmFsdWUgaXMgbm90IGRlZmluZWQuJyxcclxuICAgICAgfSxcclxuICAgICAgc2NoZW1hU2V0dGluZ3MubWVzc2FnZXNcclxuICAgIClcclxuICAgIHZhbHVlID0gKHZhbHVlICE9PSB1bmRlZmluZWQpXHJcbiAgICBzd2l0Y2goTVZDLlV0aWxzLnR5cGVPZihzY2hlbWFTZXR0aW5ncykpIHtcclxuICAgICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICAgICAgdmFsaWRhdGlvblN1bW1hcnkuY29tcGFyYXRvciA9IHNjaGVtYVNldHRpbmdzXHJcbiAgICAgICAgdmFsaWRhdGlvblN1bW1hcnkucmVzdWx0ID0gKHZhbHVlID09PSBzY2hlbWFTZXR0aW5ncylcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICAgIHZhbGlkYXRpb25TdW1tYXJ5LmNvbXBhcmF0b3IgPSBzY2hlbWFTZXR0aW5ncy52YWx1ZVxyXG4gICAgICAgIHZhbGlkYXRpb25TdW1tYXJ5LnJlc3VsdCA9ICh2YWx1ZSA9PT0gc2NoZW1hU2V0dGluZ3MudmFsdWUpXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIHZhbGlkYXRpb25TdW1tYXJ5Lm1lc3NhZ2UgPSAodmFsaWRhdGlvblN1bW1hcnkucmVzdWx0KVxyXG4gICAgICA/IG1lc3NhZ2VzLnBhc3NcclxuICAgICAgOiBtZXNzYWdlcy5mYWlsXHJcbiAgICByZXR1cm4gdmFsaWRhdGlvblN1bW1hcnlcclxuICB9XHJcbiAgdHlwZSh2YWx1ZSwgc2NoZW1hU2V0dGluZ3MpIHtcclxuICAgIGxldCB2YWxpZGF0aW9uU3VtbWFyeSA9IHtcclxuICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICB9XHJcbiAgICBsZXQgbWVzc2FnZXMgPSBPYmplY3QuYXNzaWduKFxyXG4gICAgICB7XHJcbiAgICAgICAgcGFzczogJ1ZhbGlkIFR5cGUuJyxcclxuICAgICAgICBmYWlsOiAnSW52YWxpZCBUeXBlLicsXHJcbiAgICAgIH0sXHJcbiAgICAgIHNjaGVtYVNldHRpbmdzLm1lc3NhZ2VzXHJcbiAgICApXHJcbiAgICBzd2l0Y2goTVZDLlV0aWxzLnR5cGVPZihzY2hlbWFTZXR0aW5ncykpIHtcclxuICAgICAgY2FzZSAnc3RyaW5nJzpcclxuICAgICAgICB2YWxpZGF0aW9uU3VtbWFyeS5jb21wYXJhdG9yXHJcbiAgICAgICAgdmFsaWRhdGlvblN1bW1hcnkucmVzdWx0ID0gKE1WQy5VdGlscy50eXBlT2YodmFsdWUpID09PSBzY2hlbWFTZXR0aW5ncylcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICAgIHZhbGlkYXRpb25TdW1tYXJ5LnJlc3VsdCA9IChNVkMuVXRpbHMudHlwZU9mKHZhbHVlKSA9PT0gc2NoZW1hU2V0dGluZ3MudmFsdWUpXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIHZhbGlkYXRpb25TdW1tYXJ5Lm1lc3NhZ2UgPSAodmFsaWRhdGlvblN1bW1hcnkucmVzdWx0KVxyXG4gICAgICA/IG1lc3NhZ2VzLnBhc3NcclxuICAgICAgOiBtZXNzYWdlcy5mYWlsXHJcbiAgICByZXR1cm4gdmFsaWRhdGlvblN1bW1hcnlcclxuICB9XHJcbiAgZXZhbHVhdGlvbnModmFsdWUsIGV2YWx1YXRpb25zKSB7XHJcbiAgICByZXR1cm4gZXZhbHVhdGlvbnMucmVkdWNlKChfZXZhbHVhdGlvbnMsIGV2YWx1YXRpb24sIGV2YWx1YXRpb25JbmRleCkgPT4ge1xyXG4gICAgICBpZihNVkMuVXRpbHMuaXNBcnJheShldmFsdWF0aW9uKSkge1xyXG4gICAgICAgIF9ldmFsdWF0aW9ucy5wdXNoKFxyXG4gICAgICAgICAgLi4udGhpcy5ldmFsdWF0aW9ucyh2YWx1ZSwgZXZhbHVhdGlvbilcclxuICAgICAgICApXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXZhbHVhdGlvbi52YWx1ZSA9IHZhbHVlXHJcbiAgICAgICAgbGV0IHZhbHVlQ29tcGFyaXNvbiA9IHRoaXMuY29tcGFyZVZhbHVlcyhcclxuICAgICAgICAgIGV2YWx1YXRpb24udmFsdWUsXHJcbiAgICAgICAgICBldmFsdWF0aW9uLmNvbXBhcmlzb24udmFsdWUsXHJcbiAgICAgICAgICBldmFsdWF0aW9uLmNvbXBhcmF0b3IsXHJcbiAgICAgICAgICBldmFsdWF0aW9uLm1lc3NhZ2VzXHJcbiAgICAgICAgKVxyXG4gICAgICAgIGV2YWx1YXRpb24ucmVzdWx0cyA9IGV2YWx1YXRpb24ucmVzdWx0cyB8fCB7fVxyXG4gICAgICAgIGV2YWx1YXRpb24ucmVzdWx0cy52YWx1ZSA9IHZhbHVlQ29tcGFyaXNvblxyXG4gICAgICAgIF9ldmFsdWF0aW9ucy5wdXNoKGV2YWx1YXRpb24pXHJcbiAgICAgIH1cclxuICAgICAgaWYoX2V2YWx1YXRpb25zLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICBsZXQgY3VycmVudEV2YWx1YXRpb24gPSBfZXZhbHVhdGlvbnNbZXZhbHVhdGlvbkluZGV4XVxyXG4gICAgICAgIGlmKGN1cnJlbnRFdmFsdWF0aW9uLmNvbXBhcmlzb24uc3RhdGVtZW50KSB7XHJcbiAgICAgICAgICBsZXQgcHJldmlvdXNFdmFsdWF0aW9uID0gX2V2YWx1YXRpb25zW2V2YWx1YXRpb25JbmRleCAtIDFdXHJcbiAgICAgICAgICBsZXQgcHJldmlvdXNFdmFsdWF0aW9uQ29tcGFyaXNvblZhbHVlID0gKGN1cnJlbnRFdmFsdWF0aW9uLnJlc3VsdHMuc3RhdGVtZW50KVxyXG4gICAgICAgICAgICA/IGN1cnJlbnRFdmFsdWF0aW9uLnJlc3VsdHMuc3RhdGVtZW50LnJlc3VsdFxyXG4gICAgICAgICAgICA6IGN1cnJlbnRFdmFsdWF0aW9uLnJlc3VsdHMudmFsdWUucmVzdWx0XHJcbiAgICAgICAgICBsZXQgc3RhdGVtZW50Q29tcGFyaXNvbiA9IHRoaXMuY29tcGFyZVN0YXRlbWVudHMoXHJcbiAgICAgICAgICAgIHByZXZpb3VzRXZhbHVhdGlvbkNvbXBhcmlzb25WYWx1ZSxcclxuICAgICAgICAgICAgY3VycmVudEV2YWx1YXRpb24uY29tcGFyaXNvbi5zdGF0ZW1lbnQsXHJcbiAgICAgICAgICAgIGN1cnJlbnRFdmFsdWF0aW9uLnJlc3VsdHMudmFsdWUucmVzdWx0LFxyXG4gICAgICAgICAgICBjdXJyZW50RXZhbHVhdGlvbi5tZXNzYWdlc1xyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgY3VycmVudEV2YWx1YXRpb24ucmVzdWx0cyA9IGN1cnJlbnRFdmFsdWF0aW9uLnJlc3VsdHMgfHwge31cclxuICAgICAgICAgIGN1cnJlbnRFdmFsdWF0aW9uLnJlc3VsdHMuc3RhdGVtZW50ID0gc3RhdGVtZW50Q29tcGFyaXNvblxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gX2V2YWx1YXRpb25zXHJcbiAgICB9LCBbXSlcclxuICB9XHJcbiAgZXZhbHVhdGlvblJlc3VsdHMoZXZhbHVhdGlvbnMpIHtcclxuICAgIGxldCB2YWxpZGF0aW9uRXZhbHVhdGlvbnMgPSB7XHJcbiAgICAgIHBhc3M6IFtdLFxyXG4gICAgICBmYWlsOiBbXSxcclxuICAgIH1cclxuICAgIGV2YWx1YXRpb25zLmZvckVhY2goKGV2YWx1YXRpb25WYWxpZGF0aW9uKSA9PiB7XHJcbiAgICAgIGlmKGV2YWx1YXRpb25WYWxpZGF0aW9uLnJlc3VsdHMuc3RhdGVtZW50KSB7XHJcbiAgICAgICAgaWYoZXZhbHVhdGlvblZhbGlkYXRpb24ucmVzdWx0cy5zdGF0ZW1lbnQucmVzdWx0ID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgdmFsaWRhdGlvbkV2YWx1YXRpb25zLmZhaWwucHVzaChldmFsdWF0aW9uVmFsaWRhdGlvbilcclxuICAgICAgICB9IGVsc2UgaWYoZXZhbHVhdGlvblZhbGlkYXRpb24ucmVzdWx0cy5zdGF0ZW1lbnQucmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICB2YWxpZGF0aW9uRXZhbHVhdGlvbnMucGFzcy5wdXNoKGV2YWx1YXRpb25WYWxpZGF0aW9uKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmKGV2YWx1YXRpb25WYWxpZGF0aW9uLnJlc3VsdHMudmFsdWUpIHtcclxuICAgICAgICBpZihldmFsdWF0aW9uVmFsaWRhdGlvbi5yZXN1bHRzLnZhbHVlLnJlc3VsdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIHZhbGlkYXRpb25FdmFsdWF0aW9ucy5mYWlsLnB1c2goZXZhbHVhdGlvblZhbGlkYXRpb24pXHJcbiAgICAgICAgfSBlbHNlIGlmKGV2YWx1YXRpb25WYWxpZGF0aW9uLnJlc3VsdHMudmFsdWUucmVzdWx0ID09PSB0cnVlKSB7XHJcbiAgICAgICAgICB2YWxpZGF0aW9uRXZhbHVhdGlvbnMucGFzcy5wdXNoKGV2YWx1YXRpb25WYWxpZGF0aW9uKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIHJldHVybiB2YWxpZGF0aW9uRXZhbHVhdGlvbnNcclxuICB9XHJcbiAgY29tcGFyZVZhbHVlcyh2YWx1ZSwgb3BlcmF0b3IsIGNvbXBhcmF0b3IsIG1lc3NhZ2VzKSB7XHJcbiAgICBsZXQgZXZhbHVhdGlvblJlc3VsdFxyXG4gICAgc3dpdGNoKG9wZXJhdG9yKSB7XHJcbiAgICAgIGNhc2UgTVZDLkNPTlNULk9wZXJhdG9ycy5Db21wYXJpc29uLkVROlxyXG4gICAgICAgIGV2YWx1YXRpb25SZXN1bHQgPSAodmFsdWUgPT0gY29tcGFyYXRvcilcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIE1WQy5DT05TVC5PcGVyYXRvcnMuQ29tcGFyaXNvbi5TVEVROlxyXG4gICAgICAgIGV2YWx1YXRpb25SZXN1bHQgPSAodmFsdWUgPT09IGNvbXBhcmF0b3IpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBNVkMuQ09OU1QuT3BlcmF0b3JzLkNvbXBhcmlzb24uTk9FUTpcclxuICAgICAgICBldmFsdWF0aW9uUmVzdWx0ID0gKHZhbHVlICE9IGNvbXBhcmF0b3IpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBNVkMuQ09OU1QuT3BlcmF0b3JzLkNvbXBhcmlzb24uU1ROT0VROlxyXG4gICAgICAgIGV2YWx1YXRpb25SZXN1bHQgPSAodmFsdWUgIT09IGNvbXBhcmF0b3IpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBNVkMuQ09OU1QuT3BlcmF0b3JzLkNvbXBhcmlzb24uR1Q6XHJcbiAgICAgICAgZXZhbHVhdGlvblJlc3VsdCA9ICh2YWx1ZSA+IGNvbXBhcmF0b3IpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBNVkMuQ09OU1QuT3BlcmF0b3JzLkNvbXBhcmlzb24uTFQ6XHJcbiAgICAgICAgZXZhbHVhdGlvblJlc3VsdCA9ICh2YWx1ZSA8IGNvbXBhcmF0b3IpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBNVkMuQ09OU1QuT3BlcmF0b3JzLkNvbXBhcmlzb24uR1RFOlxyXG4gICAgICAgIGV2YWx1YXRpb25SZXN1bHQgPSAodmFsdWUgPj0gY29tcGFyYXRvcilcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIE1WQy5DT05TVC5PcGVyYXRvcnMuQ29tcGFyaXNvbi5MVEU6XHJcbiAgICAgICAgZXZhbHVhdGlvblJlc3VsdCA9ICh2YWx1ZSA8PSBjb21wYXJhdG9yKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN1bHQ6IGV2YWx1YXRpb25SZXN1bHQsXHJcbiAgICAgIG1lc3NhZ2U6IChldmFsdWF0aW9uUmVzdWx0KVxyXG4gICAgICAgID8gbWVzc2FnZXMucGFzc1xyXG4gICAgICAgIDogbWVzc2FnZXMuZmFpbFxyXG4gICAgfVxyXG4gIH1cclxuICBjb21wYXJlU3RhdGVtZW50cyh2YWx1ZSwgb3BlcmF0b3IsIGNvbXBhcmF0b3IsIG1lc3NhZ2VzKSB7XHJcbiAgICBsZXQgZXZhbHVhdGlvblJlc3VsdFxyXG4gICAgc3dpdGNoKG9wZXJhdG9yKSB7XHJcbiAgICAgIGNhc2UgTVZDLkNPTlNULk9wZXJhdG9ycy5TdGF0ZW1lbnQuQU5EOlxyXG4gICAgICAgIGV2YWx1YXRpb25SZXN1bHQgPSB2YWx1ZSAmJiBjb21wYXJhdG9yXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSBNVkMuQ09OU1QuT3BlcmF0b3JzLlN0YXRlbWVudC5PUjpcclxuICAgICAgICBldmFsdWF0aW9uUmVzdWx0ID0gdmFsdWUgfHwgY29tcGFyYXRvclxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXN1bHQ6IGV2YWx1YXRpb25SZXN1bHQsXHJcbiAgICAgIG1lc3NhZ2U6IChldmFsdWF0aW9uUmVzdWx0KVxyXG4gICAgICAgID8gbWVzc2FnZXMucGFzc1xyXG4gICAgICAgIDogbWVzc2FnZXMuZmFpbFxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJNVkMuTW9kZWwgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfdmFsaWRhdG9yKCkgeyByZXR1cm4gdGhpcy52YWxpZGF0b3IgfVxuICBzZXQgX3ZhbGlkYXRvcih2YWxpZGF0b3IpIHsgdGhpcy52YWxpZGF0b3IgPSBuZXcgTVZDLlZhbGlkYXRvcih2YWxpZGF0b3IpIH1cbiAgZ2V0IF9pc1NldHRpbmcoKSB7IHJldHVybiB0aGlzLmlzU2V0dGluZyB9XG4gIHNldCBfaXNTZXR0aW5nKGlzU2V0dGluZykgeyB0aGlzLmlzU2V0dGluZyA9IGlzU2V0dGluZyB9XG4gIGdldCBfY2hhbmdpbmcoKSB7XG4gICAgdGhpcy5jaGFuZ2luZyA9ICh0aGlzLmNoYW5naW5nKVxuICAgICAgPyB0aGlzLmNoYW5naW5nXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY2hhbmdpbmdcbiAgfVxuICBnZXQgX2xvY2FsU3RvcmFnZSgpIHsgcmV0dXJuIHRoaXMubG9jYWxTdG9yYWdlIH1cbiAgc2V0IF9sb2NhbFN0b3JhZ2UobG9jYWxTdG9yYWdlKSB7IHRoaXMubG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yYWdlIH1cbiAgZ2V0IF9kZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuZGVmYXVsdHMgfVxuICBzZXQgX2RlZmF1bHRzKGRlZmF1bHRzKSB7IHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0cyB9XG4gIGdldCBfc2NoZW1hKCkgeyByZXR1cm4gdGhpcy5fc2NoZW1hIH1cbiAgc2V0IF9zY2hlbWEoc2NoZW1hKSB7IHRoaXMuc2NoZW1hID0gc2NoZW1hIH1cbiAgZ2V0IF9oaXN0aW9ncmFtKCkgeyByZXR1cm4gdGhpcy5oaXN0aW9ncmFtIHx8IHtcbiAgICBsZW5ndGg6IDFcbiAgfSB9XG4gIHNldCBfaGlzdGlvZ3JhbShoaXN0aW9ncmFtKSB7XG4gICAgdGhpcy5oaXN0aW9ncmFtID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHRoaXMuX2hpc3Rpb2dyYW0sXG4gICAgICBoaXN0aW9ncmFtXG4gICAgKVxuICB9XG4gIGdldCBfaGlzdG9yeSgpIHtcbiAgICB0aGlzLmhpc3RvcnkgPSAodGhpcy5oaXN0b3J5KVxuICAgICAgPyB0aGlzLmhpc3RvcnlcbiAgICAgIDogW11cbiAgICByZXR1cm4gdGhpcy5oaXN0b3J5XG4gIH1cbiAgc2V0IF9oaXN0b3J5KGRhdGEpIHtcbiAgICBpZihcbiAgICAgIE9iamVjdC5rZXlzKGRhdGEpLmxlbmd0aFxuICAgICkge1xuICAgICAgaWYodGhpcy5faGlzdGlvZ3JhbS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS51bnNoaWZ0KHRoaXMucGFyc2UoZGF0YSkpXG4gICAgICAgIHRoaXMuX2hpc3Rvcnkuc3BsaWNlKHRoaXMuX2hpc3Rpb2dyYW0ubGVuZ3RoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgX2RiKCkge1xuICAgIGxldCBkYiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KVxuICAgIHRoaXMuZGIgPSAoZGIpXG4gICAgICA/IGRiXG4gICAgICA6ICd7fSdcbiAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLmRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICBnZXQgX2RhdGEoKSB7XG4gICAgdGhpcy5kYXRhID0gICh0aGlzLmRhdGEpXG4gICAgICA/IHRoaXMuZGF0YVxuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmRhdGFcbiAgfVxuICBnZXQgX2RhdGFFdmVudHMoKSB7XG4gICAgdGhpcy5kYXRhRXZlbnRzID0gKHRoaXMuZGF0YUV2ZW50cylcbiAgICAgID8gdGhpcy5kYXRhRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YUV2ZW50c1xuICB9XG4gIHNldCBfZGF0YUV2ZW50cyhkYXRhRXZlbnRzKSB7XG4gICAgdGhpcy5kYXRhRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGRhdGFFdmVudHMsIHRoaXMuX2RhdGFFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9kYXRhQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuZGF0YUNhbGxiYWNrcyA9ICh0aGlzLmRhdGFDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuZGF0YUNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmRhdGFDYWxsYmFja3NcbiAgfVxuICBzZXQgX2RhdGFDYWxsYmFja3MoZGF0YUNhbGxiYWNrcykge1xuICAgIHRoaXMuZGF0YUNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBkYXRhQ2FsbGJhY2tzLCB0aGlzLl9kYXRhQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfc2VydmljZXMoKSB7XG4gICAgdGhpcy5zZXJ2aWNlcyA9ICAodGhpcy5zZXJ2aWNlcylcbiAgICAgID8gdGhpcy5zZXJ2aWNlc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnNlcnZpY2VzXG4gIH1cbiAgc2V0IF9zZXJ2aWNlcyhzZXJ2aWNlcykge1xuICAgIHRoaXMuc2VydmljZXMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgc2VydmljZXMsIHRoaXMuX3NlcnZpY2VzXG4gICAgKVxuICB9XG4gIGdldCBfc2VydmljZUV2ZW50cygpIHtcbiAgICB0aGlzLnNlcnZpY2VFdmVudHMgPSAodGhpcy5zZXJ2aWNlRXZlbnRzKVxuICAgICAgPyB0aGlzLnNlcnZpY2VFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5zZXJ2aWNlRXZlbnRzXG4gIH1cbiAgc2V0IF9zZXJ2aWNlRXZlbnRzKHNlcnZpY2VFdmVudHMpIHtcbiAgICB0aGlzLnNlcnZpY2VFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgc2VydmljZUV2ZW50cywgdGhpcy5fc2VydmljZUV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX3NlcnZpY2VDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzID0gKHRoaXMuc2VydmljZUNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICB9XG4gIHNldCBfc2VydmljZUNhbGxiYWNrcyhzZXJ2aWNlQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHNlcnZpY2VDYWxsYmFja3MsIHRoaXMuX3NlcnZpY2VDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGVuYWJsZVNlcnZpY2VFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5zZXJ2aWNlRXZlbnRzLCB0aGlzLnNlcnZpY2VzLCB0aGlzLnNlcnZpY2VDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZVNlcnZpY2VFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMuc2VydmljZUV2ZW50cywgdGhpcy5zZXJ2aWNlcywgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZURhdGFFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5kYXRhRXZlbnRzLCB0aGlzLCB0aGlzLmRhdGFDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZURhdGFFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMuZGF0YUV2ZW50cywgdGhpcywgdGhpcy5kYXRhQ2FsbGJhY2tzKVxuICB9XG4gIHNldERlZmF1bHRzKCkge1xuICAgIGxldCBfZGVmYXVsdHMgPSB7fVxuICAgIGlmKHRoaXMuZGVmYXVsdHMpIE9iamVjdC5hc3NpZ24oX2RlZmF1bHRzLCB0aGlzLmRlZmF1bHRzKVxuICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlKSBPYmplY3QuYXNzaWduKF9kZWZhdWx0cywgdGhpcy5fZGIpXG4gICAgaWYoT2JqZWN0LmtleXMoX2RlZmF1bHRzKSkgdGhpcy5zZXQoX2RlZmF1bHRzKVxuICB9XG4gIGdldCgpIHtcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVtrZXldXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdGhpcy5faXNTZXR0aW5nID0gdHJ1ZVxuICAgICAgICBsZXQgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYoaW5kZXggPT09IChfYXJndW1lbnRzLmxlbmd0aCAtIDEpKSB0aGlzLl9pc1NldHRpbmcgPSBmYWxzZVxuICAgICAgICAgIHRoaXMuX2NoYW5naW5nW2tleV0gPSB2YWx1ZVxuICAgICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIHRoaXMuc2V0REIoa2V5LCB2YWx1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgZGVsZXRlIHRoaXMuY2hhbmdpbmdcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgdmFyIGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICB2YXIgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSlcbiAgICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIHRoaXMuc2V0REIoa2V5LCB2YWx1ZSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgaWYodGhpcy5fdmFsaWRhdG9yKSB7XG4gICAgICBsZXQgdmFsaWRhdGVFbWl0dGVyID0gdGhpcy5lbWl0dGVycy52YWxpZGF0ZVxuICAgICAgdGhpcy5fdmFsaWRhdG9yLnZhbGlkYXRlKFxuICAgICAgICBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuZGF0YSkpXG4gICAgICApXG4gICAgICB2YWxpZGF0ZUVtaXR0ZXIuc2V0KHtcbiAgICAgICAgZGF0YTogdGhpcy52YWxpZGF0b3IuZGF0YSxcbiAgICAgICAgcmVzdWx0czogdGhpcy52YWxpZGF0b3IucmVzdWx0c1xuICAgICAgfSlcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgdmFsaWRhdGVFbWl0dGVyLm5hbWUsXG4gICAgICAgIHZhbGlkYXRlRW1pdHRlci5lbWlzc2lvbigpXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpKSB7XG4gICAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREQigpIHtcbiAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHZhciBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGxldCB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgdGhpcy5fZGIgPSBkYlxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXREQigpIHtcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBkZWxldGUgdGhpcy5fZGJcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBkZWxldGUgZGJba2V5XVxuICAgICAgICB0aGlzLl9kYiA9IGRiXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpIHtcbiAgICBpZighdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldKSB7XG4gICAgICBsZXQgY29udGV4dCA9IHRoaXNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgICAgICB0aGlzLl9kYXRhLFxuICAgICAgICB7XG4gICAgICAgICAgWydfJy5jb25jYXQoa2V5KV06IHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNba2V5XSB9LFxuICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgIGxldCBzZXRWYWx1ZUV2ZW50TmFtZSA9IFsnc2V0JywgJzonLCBrZXldLmpvaW4oJycpXG4gICAgICAgICAgICAgIGxldCBzZXRFdmVudE5hbWUgPSAnc2V0J1xuICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbmFtZTogc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIGlmKCFjb250ZXh0Ll9pc1NldHRpbmcpIHtcbiAgICAgICAgICAgICAgICBpZighT2JqZWN0LnZhbHVlcyhjb250ZXh0Ll9jaGFuZ2luZykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICAgICAgc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGNvbnRleHQuX2NoYW5naW5nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKVxuICAgIH1cbiAgICB0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV0gPSB2YWx1ZVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXREYXRhUHJvcGVydHkoa2V5KSB7XG4gICAgbGV0IHVuc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3Vuc2V0JywgJzonLCBrZXldLmpvaW4oJycpXG4gICAgbGV0IHVuc2V0RXZlbnROYW1lID0gJ3Vuc2V0J1xuICAgIGxldCB1bnNldFZhbHVlID0gdGhpcy5fZGF0YVtrZXldXG4gICAgZGVsZXRlIHRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXVxuICAgIGRlbGV0ZSB0aGlzLl9kYXRhW2tleV1cbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldFZhbHVlRXZlbnROYW1lLFxuICAgICAge1xuICAgICAgICBuYW1lOiB1bnNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgdmFsdWU6IHVuc2V0VmFsdWUsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApXG4gICAgdGhpcy5lbWl0KFxuICAgICAgdW5zZXRFdmVudE5hbWUsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IHVuc2V0RXZlbnROYW1lLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgdmFsdWU6IHVuc2V0VmFsdWUsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBwYXJzZShkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5fZGF0YVxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KE9iamVjdC5hc3NpZ24oe30sIGRhdGEpKSlcbiAgfVxuICBlbmFibGVFbWl0dGVycygpIHtcbiAgICBPYmplY3QuYXNzaWduKFxuICAgICAgdGhpcy5fZW1pdHRlcnMsXG4gICAgICB0aGlzLnNldHRpbmdzLmVtaXR0ZXJzLFxuICAgICAge1xuICAgICAgICB2YWxpZGF0ZTogbmV3IE1WQy5FbWl0dGVycy5WYWxpZGF0ZSgpLFxuICAgICAgfVxuICAgIClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGVFbWl0dGVycygpIHtcbiAgICBkZWxldGUgdGhpcy5fZW1pdHRlcnNcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5lbmFibGVFbWl0dGVycygpXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnZhbGlkYXRvcikgdGhpcy5fdmFsaWRhdG9yID0gdGhpcy5zZXR0aW5ncy52YWxpZGF0b3JcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MubG9jYWxTdG9yYWdlKSB0aGlzLl9sb2NhbFN0b3JhZ2UgPSB0aGlzLnNldHRpbmdzLmxvY2FsU3RvcmFnZVxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5oaXN0aW9ncmFtKSB0aGlzLl9oaXN0aW9ncmFtID0gdGhpcy5zZXR0aW5ncy5oaXN0aW9ncmFtXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnNlcnZpY2VzKSB0aGlzLl9zZXJ2aWNlcyA9IHRoaXMuc2V0dGluZ3Muc2VydmljZXNcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3Muc2VydmljZUNhbGxiYWNrcykgdGhpcy5fc2VydmljZUNhbGxiYWNrcyA9IHRoaXMuc2V0dGluZ3Muc2VydmljZUNhbGxiYWNrc1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5zZXJ2aWNlRXZlbnRzKSB0aGlzLl9zZXJ2aWNlRXZlbnRzID0gdGhpcy5zZXR0aW5ncy5zZXJ2aWNlRXZlbnRzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRhdGEpIHRoaXMuc2V0KHRoaXMuc2V0dGluZ3MuZGF0YSlcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGF0YUNhbGxiYWNrcykgdGhpcy5fZGF0YUNhbGxiYWNrcyA9IHRoaXMuc2V0dGluZ3MuZGF0YUNhbGxiYWNrc1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5kYXRhRXZlbnRzKSB0aGlzLl9kYXRhRXZlbnRzID0gdGhpcy5zZXR0aW5ncy5kYXRhRXZlbnRzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnNjaGVtYSkgdGhpcy5fc2NoZW1hID0gdGhpcy5zZXR0aW5ncy5zY2hlbWFcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMpIHRoaXMuX2RlZmF1bHRzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0c1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMuc2VydmljZXMgJiZcbiAgICAgICAgdGhpcy5zZXJ2aWNlRXZlbnRzICYmXG4gICAgICAgIHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlU2VydmljZUV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5kYXRhRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZGF0YUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlRGF0YUV2ZW50cygpXG4gICAgICB9XG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnNlcnZpY2VzICYmXG4gICAgICAgIHRoaXMuc2VydmljZUV2ZW50cyAmJlxuICAgICAgICB0aGlzLnNlcnZpY2VDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVTZXJ2aWNlRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmRhdGFFdmVudHMgJiZcbiAgICAgICAgdGhpcy5kYXRhQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlRGF0YUV2ZW50cygpXG4gICAgICB9XG4gICAgICBkZWxldGUgdGhpcy5fbG9jYWxTdG9yYWdlXG4gICAgICBkZWxldGUgdGhpcy5faGlzdGlvZ3JhbVxuICAgICAgZGVsZXRlIHRoaXMuX3NlcnZpY2VzXG4gICAgICBkZWxldGUgdGhpcy5fc2VydmljZUNhbGxiYWNrc1xuICAgICAgZGVsZXRlIHRoaXMuX3NlcnZpY2VFdmVudHNcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YUNhbGxiYWNrc1xuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFFdmVudHNcbiAgICAgIGRlbGV0ZSB0aGlzLl9zY2hlbWFcbiAgICAgIGRlbGV0ZSB0aGlzLl92YWxpZGF0b3JcbiAgICAgIGRlbGV0ZSB0aGlzLmRpc2FibGVFbWl0dGVycygpXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuIiwiTVZDLkVtaXR0ZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5Nb2RlbCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgICBpZih0aGlzLnNldHRpbmdzKSB7XHJcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MubmFtZSkgdGhpcy5fbmFtZSA9IHRoaXMuc2V0dGluZ3MubmFtZVxyXG4gICAgfVxyXG4gIH1cclxuICBnZXQgX25hbWUoKSB7IHJldHVybiB0aGlzLm5hbWUgfVxyXG4gIHNldCBfbmFtZShuYW1lKSB7IHRoaXMubmFtZSA9IG5hbWUgfVxyXG4gIGVtaXNzaW9uKCkge1xyXG4gICAgbGV0IGV2ZW50RGF0YSA9IHtcclxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxyXG4gICAgICBkYXRhOiB0aGlzLmRhdGFcclxuICAgIH1cclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgdGhpcy5uYW1lLFxyXG4gICAgICBldmVudERhdGFcclxuICAgIClcclxuICAgIHJldHVybiBldmVudERhdGFcclxuICB9XHJcbn1cclxuIiwiTVZDLkVtaXR0ZXJzLk5hdmlnYXRlID0gY2xhc3MgZXh0ZW5kcyBNVkMuRW1pdHRlciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgICB0aGlzLmFkZFNldHRpbmdzKClcclxuICAgIHRoaXMuZW5hYmxlKClcclxuICB9XHJcbiAgYWRkU2V0dGluZ3MoKSB7XHJcbiAgICB0aGlzLl9uYW1lID0gJ25hdmlnYXRlJ1xyXG4gICAgdGhpcy5fc2NoZW1hID0ge1xyXG4gICAgICBvbGRVUkw6IFN0cmluZyxcclxuICAgICAgbmV3VVJMOiBTdHJpbmcsXHJcbiAgICAgIGN1cnJlbnRSb3V0ZTogU3RyaW5nLFxyXG4gICAgICBjdXJyZW50Q29udHJvbGxlcjogU3RyaW5nLFxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJNVkMuRW1pdHRlcnMuVmFsaWRhdGUgPSBjbGFzcyBleHRlbmRzIE1WQy5FbWl0dGVyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICAgIHRoaXMuYWRkU2V0dGluZ3MoKVxyXG4gICAgdGhpcy5lbmFibGUoKVxyXG4gIH1cclxuICBhZGRTZXR0aW5ncygpIHtcclxuICAgIHRoaXMuX25hbWUgPSAndmFsaWRhdGUnXHJcbiAgICB0aGlzLl9zY2hlbWEgPSB7XHJcbiAgICAgIGRhdGE6IE9iamVjdCxcclxuICAgICAgcmVzdWx0czogT2JqZWN0LFxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJNVkMuVmlldyA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IF9lbGVtZW50TmFtZSgpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQudGFnTmFtZSB9XG4gIHNldCBfZWxlbWVudE5hbWUoZWxlbWVudE5hbWUpIHtcbiAgICBpZighdGhpcy5fZWxlbWVudCkgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudE5hbWUpXG4gIH1cbiAgZ2V0IF9lbGVtZW50KCkgeyByZXR1cm4gdGhpcy5lbGVtZW50IH1cbiAgc2V0IF9lbGVtZW50KGVsZW1lbnQpIHtcbiAgICBpZihcbiAgICAgIGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxuICAgICAgZWxlbWVudCBpbnN0YW5jZW9mIERvY3VtZW50XG4gICAgKSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgfSBlbHNlIGlmKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50KVxuICAgIH1cbiAgICB0aGlzLmVsZW1lbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudCwge1xuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICB9KVxuICB9XG4gIGdldCBfYXR0cmlidXRlcygpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQuYXR0cmlidXRlcyB9XG4gIHNldCBfYXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgZm9yKGxldCBbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGVWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlS2V5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IF91aSgpIHtcbiAgICB0aGlzLnVpID0gKHRoaXMudWkpXG4gICAgICA/IHRoaXMudWlcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy51aVxuICB9XG4gIHNldCBfdWkodWkpIHtcbiAgICBpZighdGhpcy5fdWlbJyRlbGVtZW50J10pIHRoaXMuX3VpWyckZWxlbWVudCddID0gdGhpcy5lbGVtZW50XG4gICAgZm9yKGxldCBbdWlLZXksIHVpVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHVpKSkge1xuICAgICAgaWYodHlwZW9mIHVpVmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuX3VpW3VpS2V5XSA9IHRoaXMuX2VsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh1aVZhbHVlKVxuICAgICAgfSBlbHNlIGlmKFxuICAgICAgICB1aVZhbHVlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcbiAgICAgICAgdWlWYWx1ZSBpbnN0YW5jZW9mIERvY3VtZW50XG4gICAgICApIHtcbiAgICAgICAgdGhpcy5fdWlbdWlLZXldID0gdWlWYWx1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgX3VpRXZlbnRzKCkgeyByZXR1cm4gdGhpcy51aUV2ZW50cyB9XG4gIHNldCBfdWlFdmVudHModWlFdmVudHMpIHsgdGhpcy51aUV2ZW50cyA9IHVpRXZlbnRzIH1cbiAgZ2V0IF91aUNhbGxiYWNrcygpIHtcbiAgICB0aGlzLnVpQ2FsbGJhY2tzID0gKHRoaXMudWlDYWxsYmFja3MpXG4gICAgICA/IHRoaXMudWlDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy51aUNhbGxiYWNrc1xuICB9XG4gIHNldCBfdWlDYWxsYmFja3ModWlDYWxsYmFja3MpIHtcbiAgICB0aGlzLnVpQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHVpQ2FsbGJhY2tzLCB0aGlzLl91aUNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX29ic2VydmVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3MgPSAodGhpcy5vYnNlcnZlckNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5vYnNlcnZlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9vYnNlcnZlckNhbGxiYWNrcyhvYnNlcnZlckNhbGxiYWNrcykge1xuICAgIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgb2JzZXJ2ZXJDYWxsYmFja3MsIHRoaXMuX29ic2VydmVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBlbGVtZW50T2JzZXJ2ZXIoKSB7XG4gICAgdGhpcy5fZWxlbWVudE9ic2VydmVyID0gKHRoaXMuX2VsZW1lbnRPYnNlcnZlcilcbiAgICAgID8gdGhpcy5fZWxlbWVudE9ic2VydmVyXG4gICAgICA6IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuZWxlbWVudE9ic2VydmUuYmluZCh0aGlzKSlcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudE9ic2VydmVyXG4gIH1cbiAgZ2V0IF9pbnNlcnQoKSB7IHJldHVybiB0aGlzLmluc2VydCB9XG4gIHNldCBfaW5zZXJ0KGluc2VydCkgeyB0aGlzLmluc2VydCA9IGluc2VydCB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICBnZXQgX3RlbXBsYXRlcygpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9ICh0aGlzLnRlbXBsYXRlcylcbiAgICAgID8gdGhpcy50ZW1wbGF0ZXNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZXNcbiAgfVxuICBzZXQgX3RlbXBsYXRlcyh0ZW1wbGF0ZXMpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB0ZW1wbGF0ZXMsIHRoaXMuX3RlbXBsYXRlc1xuICAgIClcbiAgfVxuICBlbGVtZW50T2JzZXJ2ZShtdXRhdGlvblJlY29yZExpc3QsIG9ic2VydmVyKSB7XG4gICAgZm9yKGxldCBbbXV0YXRpb25SZWNvcmRJbmRleCwgbXV0YXRpb25SZWNvcmRdIG9mIE9iamVjdC5lbnRyaWVzKG11dGF0aW9uUmVjb3JkTGlzdCkpIHtcbiAgICAgIHN3aXRjaChtdXRhdGlvblJlY29yZC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2NoaWxkTGlzdCc6XG4gICAgICAgICAgbGV0IG11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcyA9IFsnYWRkZWROb2RlcycsICdyZW1vdmVkTm9kZXMnXVxuICAgICAgICAgIGZvcihsZXQgbXV0YXRpb25SZWNvcmRDYXRlZ29yeSBvZiBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMpIHtcbiAgICAgICAgICAgIGlmKG11dGF0aW9uUmVjb3JkW211dGF0aW9uUmVjb3JkQ2F0ZWdvcnldLmxlbmd0aCkge1xuICAgICAgICAgICAgICB0aGlzLnJlc2V0VUkoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBhdXRvSW5zZXJ0KCkge1xuICAgIGlmKHRoaXMuaW5zZXJ0KSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuaW5zZXJ0LmVsZW1lbnQpXG4gICAgICAuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICBlbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCh0aGlzLmluc2VydC5tZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIGF1dG9SZW1vdmUoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLmVsZW1lbnQgJiZcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50XG4gICAgKSB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpXG4gIH1cbiAgZW5hYmxlRWxlbWVudChzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKHNldHRpbmdzLmVsZW1lbnROYW1lKSB0aGlzLl9lbGVtZW50TmFtZSA9IHNldHRpbmdzLmVsZW1lbnROYW1lXG4gICAgaWYoc2V0dGluZ3MuZWxlbWVudCkgdGhpcy5fZWxlbWVudCA9IHNldHRpbmdzLmVsZW1lbnRcbiAgICBpZihzZXR0aW5ncy5hdHRyaWJ1dGVzKSB0aGlzLl9hdHRyaWJ1dGVzID0gc2V0dGluZ3MuYXR0cmlidXRlc1xuICAgIGlmKHNldHRpbmdzLnRlbXBsYXRlcykgdGhpcy5fdGVtcGxhdGVzID0gc2V0dGluZ3MudGVtcGxhdGVzXG4gICAgaWYoc2V0dGluZ3MuaW5zZXJ0KSB0aGlzLl9pbnNlcnQgPSBzZXR0aW5ncy5pbnNlcnRcbiAgfVxuICBkaXNhYmxlRWxlbWVudChzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgdGhpcy5lbGVtZW50ICYmXG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICkgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIGlmKHRoaXMuZWxlbWVudCkgZGVsZXRlIHRoaXMuZWxlbWVudFxuICAgIGlmKHRoaXMuYXR0cmlidXRlcykgZGVsZXRlIHRoaXMuYXR0cmlidXRlc1xuICAgIGlmKHRoaXMudGVtcGxhdGVzKSBkZWxldGUgdGhpcy50ZW1wbGF0ZXNcbiAgICBpZih0aGlzLmluc2VydCkgZGVsZXRlIHRoaXMuaW5zZXJ0XG4gIH1cbiAgcmVzZXRVSSgpIHtcbiAgICB0aGlzLmRpc2FibGVVSSgpXG4gICAgdGhpcy5lbmFibGVVSSgpXG4gIH1cbiAgZW5hYmxlVUkoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihzZXR0aW5ncy51aSkgdGhpcy5fdWkgPSBzZXR0aW5ncy51aVxuICAgIGlmKHNldHRpbmdzLnVpQ2FsbGJhY2tzKSB0aGlzLl91aUNhbGxiYWNrcyA9IHNldHRpbmdzLnVpQ2FsbGJhY2tzXG4gICAgaWYoc2V0dGluZ3MudWlFdmVudHMpIHtcbiAgICAgIHRoaXMuX3VpRXZlbnRzID0gc2V0dGluZ3MudWlFdmVudHNcbiAgICAgIHRoaXMuZW5hYmxlVUlFdmVudHMoKVxuICAgIH1cbiAgfVxuICBkaXNhYmxlVUkoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihzZXR0aW5ncy51aUV2ZW50cykge1xuICAgICAgdGhpcy5kaXNhYmxlVUlFdmVudHMoKVxuICAgICAgZGVsZXRlIHRoaXMuX3VpRXZlbnRzXG4gICAgfVxuICAgIGRlbGV0ZSB0aGlzLnVpRXZlbnRzXG4gICAgZGVsZXRlIHRoaXMudWlcbiAgICBkZWxldGUgdGhpcy51aUNhbGxiYWNrc1xuICB9XG4gIGVuYWJsZVVJRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy51aUV2ZW50cyAmJlxuICAgICAgdGhpcy51aSAmJlxuICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMoXG4gICAgICAgIHRoaXMudWlFdmVudHMsXG4gICAgICAgIHRoaXMudWksXG4gICAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgZGlzYWJsZVVJRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy51aUV2ZW50cyAmJlxuICAgICAgdGhpcy51aSAmJlxuICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKFxuICAgICAgICB0aGlzLnVpRXZlbnRzLFxuICAgICAgICB0aGlzLnVpLFxuICAgICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgICApXG4gICAgfVxuICB9XG4gIGVuYWJsZUVtaXR0ZXJzKCkge1xuICAgIGlmKHRoaXMuc2V0dGluZ3MuZW1pdHRlcnMpIHRoaXMuX2VtaXR0ZXJzID0gdGhpcy5zZXR0aW5ncy5lbWl0dGVyc1xuICB9XG4gIGRpc2FibGVFbWl0dGVycygpIHtcbiAgICBpZih0aGlzLl9lbWl0dGVycykgZGVsZXRlIHRoaXMuX2VtaXR0ZXJzXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5fZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5lbmFibGVFbWl0dGVycygpXG4gICAgICB0aGlzLmVuYWJsZUVsZW1lbnQoc2V0dGluZ3MpXG4gICAgICB0aGlzLmVuYWJsZVVJKHNldHRpbmdzKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgIHRoaXMuX2VuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZGlzYWJsZVVJKHNldHRpbmdzKVxuICAgICAgdGhpcy5kaXNhYmxlRWxlbWVudChzZXR0aW5ncylcbiAgICAgIHRoaXMuZGlzYWJsZUVtaXR0ZXJzKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgICAgcmV0dXJuIHRoaXNzXG4gICAgfVxuICB9XG59XG4iLCJNVkMuQ29udHJvbGxlciA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IF9lbWl0dGVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuZW1pdHRlckNhbGxiYWNrcyA9ICh0aGlzLmVtaXR0ZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuZW1pdHRlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX2VtaXR0ZXJDYWxsYmFja3MoZW1pdHRlckNhbGxiYWNrcykge1xuICAgIHRoaXMuZW1pdHRlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBlbWl0dGVyQ2FsbGJhY2tzLCB0aGlzLl9lbWl0dGVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfbW9kZWxDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5tb2RlbENhbGxiYWNrcyA9ICh0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgfVxuICBzZXQgX21vZGVsQ2FsbGJhY2tzKG1vZGVsQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5tb2RlbENhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBtb2RlbENhbGxiYWNrcywgdGhpcy5fbW9kZWxDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF92aWV3Q2FsbGJhY2tzKCkge1xuICAgIHRoaXMudmlld0NhbGxiYWNrcyA9ICh0aGlzLnZpZXdDYWxsYmFja3MpXG4gICAgICA/IHRoaXMudmlld0NhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnZpZXdDYWxsYmFja3NcbiAgfVxuICBzZXQgX3ZpZXdDYWxsYmFja3Modmlld0NhbGxiYWNrcykge1xuICAgIHRoaXMudmlld0NhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB2aWV3Q2FsbGJhY2tzLCB0aGlzLl92aWV3Q2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlckNhbGxiYWNrcygpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MgPSAodGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9jb250cm9sbGVyQ2FsbGJhY2tzKGNvbnRyb2xsZXJDYWxsYmFja3MpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlckNhbGxiYWNrcywgdGhpcy5fY29udHJvbGxlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVscygpIHtcbiAgICB0aGlzLm1vZGVscyA9ICh0aGlzLm1vZGVscylcbiAgICAgID8gdGhpcy5tb2RlbHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5tb2RlbHNcbiAgfVxuICBzZXQgX21vZGVscyhtb2RlbHMpIHtcbiAgICB0aGlzLm1vZGVscyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBtb2RlbHMsIHRoaXMuX21vZGVsc1xuICAgIClcbiAgfVxuICBnZXQgX3ZpZXdzKCkge1xuICAgIHRoaXMudmlld3MgPSAodGhpcy52aWV3cylcbiAgICAgID8gdGhpcy52aWV3c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnZpZXdzXG4gIH1cbiAgc2V0IF92aWV3cyh2aWV3cykge1xuICAgIHRoaXMudmlld3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld3MsIHRoaXMuX3ZpZXdzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlcnMoKSB7XG4gICAgdGhpcy5jb250cm9sbGVycyA9ICh0aGlzLmNvbnRyb2xsZXJzKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlcnNcbiAgfVxuICBzZXQgX2NvbnRyb2xsZXJzKGNvbnRyb2xsZXJzKSB7XG4gICAgdGhpcy5jb250cm9sbGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBjb250cm9sbGVycywgdGhpcy5fY29udHJvbGxlcnNcbiAgICApXG4gIH1cbiAgZ2V0IF9yb3V0ZXJzKCkge1xuICAgIHRoaXMucm91dGVycyA9ICh0aGlzLnJvdXRlcnMpXG4gICAgICA/IHRoaXMucm91dGVyc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlcnNcbiAgfVxuICBzZXQgX3JvdXRlcnMocm91dGVycykge1xuICAgIHRoaXMucm91dGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXJzLCB0aGlzLl9yb3V0ZXJzXG4gICAgKVxuICB9XG4gIGdldCBfcm91dGVyRXZlbnRzKCkge1xuICAgIHRoaXMucm91dGVyRXZlbnRzID0gKHRoaXMucm91dGVyRXZlbnRzKVxuICAgICAgPyB0aGlzLnJvdXRlckV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlckV2ZW50c1xuICB9XG4gIHNldCBfcm91dGVyRXZlbnRzKHJvdXRlckV2ZW50cykge1xuICAgIHRoaXMucm91dGVyRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlckV2ZW50cywgdGhpcy5fcm91dGVyRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfcm91dGVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMucm91dGVyQ2FsbGJhY2tzID0gKHRoaXMucm91dGVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLnJvdXRlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlckNhbGxiYWNrc1xuICB9XG4gIHNldCBfcm91dGVyQ2FsbGJhY2tzKHJvdXRlckNhbGxiYWNrcykge1xuICAgIHRoaXMucm91dGVyQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlckNhbGxiYWNrcywgdGhpcy5fcm91dGVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfZW1pdHRlckV2ZW50cygpIHtcbiAgICB0aGlzLmVtaXR0ZXJFdmVudHMgPSAodGhpcy5lbWl0dGVyRXZlbnRzKVxuICAgICAgPyB0aGlzLmVtaXR0ZXJFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyRXZlbnRzXG4gIH1cbiAgc2V0IF9lbWl0dGVyRXZlbnRzKGVtaXR0ZXJFdmVudHMpIHtcbiAgICB0aGlzLmVtaXR0ZXJFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgZW1pdHRlckV2ZW50cywgdGhpcy5fZW1pdHRlckV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVsRXZlbnRzKCkge1xuICAgIHRoaXMubW9kZWxFdmVudHMgPSAodGhpcy5tb2RlbEV2ZW50cylcbiAgICAgID8gdGhpcy5tb2RlbEV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm1vZGVsRXZlbnRzXG4gIH1cbiAgc2V0IF9tb2RlbEV2ZW50cyhtb2RlbEV2ZW50cykge1xuICAgIHRoaXMubW9kZWxFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgbW9kZWxFdmVudHMsIHRoaXMuX21vZGVsRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfdmlld0V2ZW50cygpIHtcbiAgICB0aGlzLnZpZXdFdmVudHMgPSAodGhpcy52aWV3RXZlbnRzKVxuICAgICAgPyB0aGlzLnZpZXdFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy52aWV3RXZlbnRzXG4gIH1cbiAgc2V0IF92aWV3RXZlbnRzKHZpZXdFdmVudHMpIHtcbiAgICB0aGlzLnZpZXdFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld0V2ZW50cywgdGhpcy5fdmlld0V2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgdGhpcy5jb250cm9sbGVyRXZlbnRzID0gKHRoaXMuY29udHJvbGxlckV2ZW50cylcbiAgICAgID8gdGhpcy5jb250cm9sbGVyRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlckV2ZW50c1xuICB9XG4gIHNldCBfY29udHJvbGxlckV2ZW50cyhjb250cm9sbGVyRXZlbnRzKSB7XG4gICAgdGhpcy5jb250cm9sbGVyRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGNvbnRyb2xsZXJFdmVudHMsIHRoaXMuX2NvbnRyb2xsZXJFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGVuYWJsZU1vZGVsRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMubW9kZWxFdmVudHMsIHRoaXMubW9kZWxzLCB0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVNb2RlbEV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5tb2RlbEV2ZW50cywgdGhpcy5tb2RlbHMsIHRoaXMubW9kZWxDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlVmlld0V2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnZpZXdFdmVudHMsIHRoaXMudmlld3MsIHRoaXMudmlld0NhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlVmlld0V2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy52aWV3RXZlbnRzLCB0aGlzLnZpZXdzLCB0aGlzLnZpZXdDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlQ29udHJvbGxlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmNvbnRyb2xsZXJFdmVudHMsIHRoaXMuY29udHJvbGxlcnMsIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlQ29udHJvbGxlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5jb250cm9sbGVyRXZlbnRzLCB0aGlzLmNvbnRyb2xsZXJzLCB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlRW1pdHRlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmVtaXR0ZXJFdmVudHMsIHRoaXMuZW1pdHRlcnMsIHRoaXMuZW1pdHRlckNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlRW1pdHRlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5lbWl0dGVyRXZlbnRzLCB0aGlzLmVtaXR0ZXJzLCB0aGlzLmVtaXR0ZXJDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlUm91dGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMucm91dGVyRXZlbnRzLCB0aGlzLnJvdXRlcnMsIHRoaXMucm91dGVyQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVSb3V0ZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMucm91dGVyRXZlbnRzLCB0aGlzLnJvdXRlcnMsIHRoaXMucm91dGVyQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgaWYoc2V0dGluZ3MubW9kZWxDYWxsYmFja3MpIHRoaXMuX21vZGVsQ2FsbGJhY2tzID0gc2V0dGluZ3MubW9kZWxDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLnZpZXdDYWxsYmFja3MpIHRoaXMuX3ZpZXdDYWxsYmFja3MgPSBzZXR0aW5ncy52aWV3Q2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5jb250cm9sbGVyQ2FsbGJhY2tzKSB0aGlzLl9jb250cm9sbGVyQ2FsbGJhY2tzID0gc2V0dGluZ3MuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3MuZW1pdHRlckNhbGxiYWNrcykgdGhpcy5fZW1pdHRlckNhbGxiYWNrcyA9IHNldHRpbmdzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLnJvdXRlckNhbGxiYWNrcykgdGhpcy5fcm91dGVyQ2FsbGJhY2tzID0gc2V0dGluZ3Mucm91dGVyQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5tb2RlbHMpIHRoaXMuX21vZGVscyA9IHNldHRpbmdzLm1vZGVsc1xuICAgICAgaWYoc2V0dGluZ3Mudmlld3MpIHRoaXMuX3ZpZXdzID0gc2V0dGluZ3Mudmlld3NcbiAgICAgIGlmKHNldHRpbmdzLmNvbnRyb2xsZXJzKSB0aGlzLl9jb250cm9sbGVycyA9IHNldHRpbmdzLmNvbnRyb2xsZXJzXG4gICAgICBpZihzZXR0aW5ncy5lbWl0dGVycykgdGhpcy5fZW1pdHRlcnMgPSBzZXR0aW5ncy5lbWl0dGVyc1xuICAgICAgaWYoc2V0dGluZ3Mucm91dGVycykgdGhpcy5fcm91dGVycyA9IHNldHRpbmdzLnJvdXRlcnNcbiAgICAgIGlmKHNldHRpbmdzLm1vZGVsRXZlbnRzKSB0aGlzLl9tb2RlbEV2ZW50cyA9IHNldHRpbmdzLm1vZGVsRXZlbnRzXG4gICAgICBpZihzZXR0aW5ncy52aWV3RXZlbnRzKSB0aGlzLl92aWV3RXZlbnRzID0gc2V0dGluZ3Mudmlld0V2ZW50c1xuICAgICAgaWYoc2V0dGluZ3MuY29udHJvbGxlckV2ZW50cykgdGhpcy5fY29udHJvbGxlckV2ZW50cyA9IHNldHRpbmdzLmNvbnRyb2xsZXJFdmVudHNcbiAgICAgIGlmKHNldHRpbmdzLmVtaXR0ZXJFdmVudHMpIHRoaXMuX2VtaXR0ZXJFdmVudHMgPSBzZXR0aW5ncy5lbWl0dGVyRXZlbnRzXG4gICAgICBpZihzZXR0aW5ncy5yb3V0ZXJFdmVudHMpIHRoaXMuX3JvdXRlckV2ZW50cyA9IHNldHRpbmdzLnJvdXRlckV2ZW50c1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMubW9kZWxFdmVudHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbENhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlTW9kZWxFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMudmlld0V2ZW50cyAmJlxuICAgICAgICB0aGlzLnZpZXdzICYmXG4gICAgICAgIHRoaXMudmlld0NhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlVmlld0V2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5jb250cm9sbGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5lbmFibGVDb250cm9sbGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnJvdXRlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLnJvdXRlcnMgJiZcbiAgICAgICAgdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZVJvdXRlckV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5lbWl0dGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZW1pdHRlcnMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5lbmFibGVFbWl0dGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgfVxuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZGlzYWJsZSgpXG4gICAgdGhpcy5lbmFibGUoKVxuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgIHRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMubW9kZWxFdmVudHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbENhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZU1vZGVsRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnZpZXdFdmVudHMgJiZcbiAgICAgICAgdGhpcy52aWV3cyAmJlxuICAgICAgICB0aGlzLnZpZXdDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVWaWV3RXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVycyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVDb250cm9sbGVyRXZlbnRzKClcbiAgICAgIH19XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5yb3V0ZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5yb3V0ZXJzICYmXG4gICAgICAgIHRoaXMucm91dGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlUm91dGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmVtaXR0ZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVycyAmJlxuICAgICAgICB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVFbWl0dGVyRXZlbnRzKClcbiAgICAgICAgZGVsZXRlIHRoaXMuX21vZGVsQ2FsbGJhY2tzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl92aWV3Q2FsbGJhY2tzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yb3V0ZXJDYWxsYmFja3NcbiAgICAgICAgZGVsZXRlIHRoaXMuX21vZGVsc1xuICAgICAgICBkZWxldGUgdGhpcy5fdmlld3NcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9lbWl0dGVyc1xuICAgICAgICBkZWxldGUgdGhpcy5fcm91dGVyc1xuICAgICAgICBkZWxldGUgdGhpcy5fcm91dGVyRXZlbnRzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9tb2RlbEV2ZW50c1xuICAgICAgICBkZWxldGUgdGhpcy5fdmlld0V2ZW50c1xuICAgICAgICBkZWxldGUgdGhpcy5fY29udHJvbGxlckV2ZW50c1xuICAgICAgICBkZWxldGUgdGhpcy5fZW1pdHRlckV2ZW50c1xuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICB9XG59XG4iLCJNVkMuUm91dGVyID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgcHJvdG9jb2woKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgfVxuICBnZXQgaG9zdG5hbWUoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgfVxuICBnZXQgcG9ydCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wb3J0IH1cbiAgZ2V0IHBhdGgoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgfVxuICBnZXQgaGFzaCgpIHtcbiAgICBsZXQgaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgbGV0IGhhc2hJbmRleCA9IGhyZWYuaW5kZXhPZignIycpXG4gICAgaWYoaGFzaEluZGV4ID4gLTEpIHtcbiAgICAgIGxldCBwYXJhbUluZGV4ID0gaHJlZi5pbmRleE9mKCc/JylcbiAgICAgIGxldCBzbGljZVN0YXJ0ID0gaGFzaEluZGV4ICsgMVxuICAgICAgbGV0IHNsaWNlU3RvcFxuICAgICAgaWYocGFyYW1JbmRleCA+IC0xKSB7XG4gICAgICAgIHNsaWNlU3RvcCA9IChoYXNoSW5kZXggPiBwYXJhbUluZGV4KVxuICAgICAgICAgID8gaHJlZi5sZW5ndGhcbiAgICAgICAgICA6IHBhcmFtSW5kZXhcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNsaWNlU3RvcCA9IGhyZWYubGVuZ3RoXG4gICAgICB9XG4gICAgICBocmVmID0gaHJlZi5zbGljZShzbGljZVN0YXJ0LCBzbGljZVN0b3ApXG4gICAgICBpZihocmVmLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gaHJlZlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbiAgZ2V0IHBhcmFtcygpIHtcbiAgICBsZXQgaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgbGV0IHBhcmFtSW5kZXggPSBocmVmLmluZGV4T2YoJz8nKVxuICAgIGlmKHBhcmFtSW5kZXggPiAtMSkge1xuICAgICAgbGV0IGhhc2hJbmRleCA9IGhyZWYuaW5kZXhPZignIycpXG4gICAgICBsZXQgc2xpY2VTdGFydCA9IHBhcmFtSW5kZXggKyAxXG4gICAgICBsZXQgc2xpY2VTdG9wXG4gICAgICBpZihoYXNoSW5kZXggPiAtMSkge1xuICAgICAgICBzbGljZVN0b3AgPSAocGFyYW1JbmRleCA+IGhhc2hJbmRleClcbiAgICAgICAgICA/IGhyZWYubGVuZ3RoXG4gICAgICAgICAgOiBoYXNoSW5kZXhcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNsaWNlU3RvcCA9IGhyZWYubGVuZ3RoXG4gICAgICB9XG4gICAgICBocmVmID0gaHJlZi5zbGljZShzbGljZVN0YXJ0LCBzbGljZVN0b3ApXG4gICAgICBpZihocmVmLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gaHJlZlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbiAgZ2V0IF9yb3V0ZURhdGEoKSB7XG4gICAgbGV0IHJvdXRlRGF0YSA9IHtcbiAgICAgIGxvY2F0aW9uOiB7fSxcbiAgICAgIGNvbnRyb2xsZXI6IHt9LFxuICAgIH1cbiAgICBsZXQgcGF0aCA9IHRoaXMucGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICBwYXRoID0gKHBhdGgubGVuZ3RoKVxuICAgICAgPyBwYXRoXG4gICAgICA6IFsnLyddXG4gICAgbGV0IGhhc2ggPSB0aGlzLmhhc2hcbiAgICBsZXQgaGFzaEZyYWdtZW50cyA9IChoYXNoKVxuICAgICAgPyBoYXNoLnNwbGl0KCcvJykuZmlsdGVyKChmcmFnbWVudCkgPT4gZnJhZ21lbnQubGVuZ3RoKVxuICAgICAgOiBudWxsXG4gICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zXG4gICAgbGV0IHBhcmFtRGF0YSA9IChwYXJhbXMpXG4gICAgICA/IE1WQy5VdGlscy5wYXJhbXNUb09iamVjdChwYXJhbXMpXG4gICAgICA6IG51bGxcbiAgICBpZih0aGlzLnByb3RvY29sKSByb3V0ZURhdGEubG9jYXRpb24ucHJvdG9jb2wgPSB0aGlzLnByb3RvY29sXG4gICAgaWYodGhpcy5ob3N0bmFtZSkgcm91dGVEYXRhLmxvY2F0aW9uLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZVxuICAgIGlmKHRoaXMucG9ydCkgcm91dGVEYXRhLmxvY2F0aW9uLnBvcnQgPSB0aGlzLnBvcnRcbiAgICBpZih0aGlzLnBhdGgpIHJvdXRlRGF0YS5sb2NhdGlvbi5wYXRoID0gdGhpcy5wYXRoXG4gICAgaWYoXG4gICAgICBoYXNoICYmXG4gICAgICBoYXNoRnJhZ21lbnRzXG4gICAgKSB7XG4gICAgICBoYXNoRnJhZ21lbnRzID0gKGhhc2hGcmFnbWVudHMubGVuZ3RoKVxuICAgICAgPyBoYXNoRnJhZ21lbnRzXG4gICAgICA6IFsnLyddXG4gICAgICByb3V0ZURhdGEubG9jYXRpb24uaGFzaCA9IHtcbiAgICAgICAgcGF0aDogaGFzaCxcbiAgICAgICAgZnJhZ21lbnRzOiBoYXNoRnJhZ21lbnRzLFxuICAgICAgfVxuICAgIH1cbiAgICBpZihcbiAgICAgIHBhcmFtcyAmJlxuICAgICAgcGFyYW1EYXRhXG4gICAgKSB7XG4gICAgICByb3V0ZURhdGEubG9jYXRpb24ucGFyYW1zID0ge1xuICAgICAgICBwYXRoOiBwYXJhbXMsXG4gICAgICAgIGRhdGE6IHBhcmFtRGF0YSxcbiAgICAgIH1cbiAgICB9XG4gICAgcm91dGVEYXRhLmxvY2F0aW9uLnBhdGggPSB7XG4gICAgICBuYW1lOiB0aGlzLnBhdGgsXG4gICAgICBmcmFnbWVudHM6IHBhdGgsXG4gICAgfVxuICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5jdXJyZW50VVJMID0gdGhpcy5jdXJyZW50VVJMXG4gICAgbGV0IHJvdXRlQ29udHJvbGxlckRhdGEgPSB0aGlzLl9yb3V0ZUNvbnRyb2xsZXJEYXRhXG4gICAgcm91dGVEYXRhLmxvY2F0aW9uID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbixcbiAgICAgIHJvdXRlQ29udHJvbGxlckRhdGEubG9jYXRpb25cbiAgICApXG4gICAgcm91dGVEYXRhLmNvbnRyb2xsZXIgPSByb3V0ZUNvbnRyb2xsZXJEYXRhLmNvbnRyb2xsZXJcbiAgICB0aGlzLnJvdXRlRGF0YSA9IHJvdXRlRGF0YVxuICAgIHJldHVybiB0aGlzLnJvdXRlRGF0YVxuICB9XG4gIGdldCBfcm91dGVDb250cm9sbGVyRGF0YSgpIHtcbiAgICBsZXQgcm91dGVEYXRhID0ge1xuICAgICAgbG9jYXRpb246IHt9LFxuICAgIH1cbiAgICBPYmplY3QuZW50cmllcyh0aGlzLnJvdXRlcylcbiAgICAgIC5mb3JFYWNoKChbcm91dGVQYXRoLCByb3V0ZVNldHRpbmdzXSkgPT4ge1xuICAgICAgICBsZXQgcGF0aEZyYWdtZW50cyA9IHRoaXMucGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgICAgcGF0aEZyYWdtZW50cyA9IChwYXRoRnJhZ21lbnRzLmxlbmd0aClcbiAgICAgICAgICA/IHBhdGhGcmFnbWVudHNcbiAgICAgICAgICA6IFsnLyddXG4gICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IHJvdXRlUGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQsIGZyYWdtZW50SW5kZXgpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgICAgcm91dGVGcmFnbWVudHMgPSAocm91dGVGcmFnbWVudHMubGVuZ3RoKVxuICAgICAgICAgID8gcm91dGVGcmFnbWVudHNcbiAgICAgICAgICA6IFsnLyddXG4gICAgICAgIGlmKFxuICAgICAgICAgIHBhdGhGcmFnbWVudHMubGVuZ3RoICYmXG4gICAgICAgICAgcGF0aEZyYWdtZW50cy5sZW5ndGggPT09IHJvdXRlRnJhZ21lbnRzLmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICBsZXQgbWF0Y2hcbiAgICAgICAgICByZXR1cm4gcm91dGVGcmFnbWVudHMuZmlsdGVyKChyb3V0ZUZyYWdtZW50LCByb3V0ZUZyYWdtZW50SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICBtYXRjaCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICAgIG1hdGNoID09PSB0cnVlXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgaWYocm91dGVGcmFnbWVudFswXSA9PT0gJzonKSB7XG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRJREtleSA9IHJvdXRlRnJhZ21lbnQucmVwbGFjZSgnOicsICcnKVxuICAgICAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudEluZGV4ID09PSBwYXRoRnJhZ21lbnRzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5jdXJyZW50SURLZXkgPSBjdXJyZW50SURLZXlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcm91dGVEYXRhLmxvY2F0aW9uW2N1cnJlbnRJREtleV0gPSBwYXRoRnJhZ21lbnRzW3JvdXRlRnJhZ21lbnRJbmRleF1cbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50ID0gdGhpcy5mcmFnbWVudElEUmVnRXhwXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudCA9IHJvdXRlRnJhZ21lbnQucmVwbGFjZShuZXcgUmVnRXhwKCcvJywgJ2dpJyksICdcXFxcXFwvJylcbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50ID0gdGhpcy5yb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cChyb3V0ZUZyYWdtZW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG1hdGNoID0gcm91dGVGcmFnbWVudC50ZXN0KHBhdGhGcmFnbWVudHNbcm91dGVGcmFnbWVudEluZGV4XSlcbiAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgbWF0Y2ggPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50SW5kZXggPT09IHBhdGhGcmFnbWVudHMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByb3V0ZURhdGEubG9jYXRpb24ucm91dGUgPSB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiByb3V0ZVBhdGgsXG4gICAgICAgICAgICAgICAgICBmcmFnbWVudHM6IHJvdXRlRnJhZ21lbnRzLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByb3V0ZURhdGEuY29udHJvbGxlciA9IHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICAgICAgICByZXR1cm4gcm91dGVTZXR0aW5nc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlbMF1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICByZXR1cm4gcm91dGVEYXRhXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGdldCBfcm91dGVzKCkge1xuICAgIHRoaXMucm91dGVzID0gKHRoaXMucm91dGVzKVxuICAgICAgPyB0aGlzLnJvdXRlc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlc1xuICB9XG4gIHNldCBfcm91dGVzKHJvdXRlcykge1xuICAgIHRoaXMucm91dGVzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlcywgdGhpcy5fcm91dGVzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlcigpIHsgcmV0dXJuIHRoaXMuY29udHJvbGxlciB9XG4gIHNldCBfY29udHJvbGxlcihjb250cm9sbGVyKSB7IHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXIgfVxuICBnZXQgX3ByZXZpb3VzVVJMKCkgeyByZXR1cm4gdGhpcy5wcmV2aW91c1VSTCB9XG4gIHNldCBfcHJldmlvdXNVUkwocHJldmlvdXNVUkwpIHsgdGhpcy5wcmV2aW91c1VSTCA9IHByZXZpb3VzVVJMIH1cbiAgZ2V0IF9jdXJyZW50VVJMKCkgeyByZXR1cm4gdGhpcy5jdXJyZW50VVJMIH1cbiAgc2V0IF9jdXJyZW50VVJMKGN1cnJlbnRVUkwpIHtcbiAgICBpZih0aGlzLmN1cnJlbnRVUkwpIHRoaXMuX3ByZXZpb3VzVVJMID0gdGhpcy5jdXJyZW50VVJMXG4gICAgdGhpcy5jdXJyZW50VVJMID0gY3VycmVudFVSTFxuICB9XG4gIGdldCBmcmFnbWVudElEUmVnRXhwKCkgeyByZXR1cm4gbmV3IFJlZ0V4cCgvXihbMC05QS1aXFw/XFw9XFwsXFwuXFwqXFwtXFxfXFwnXFxcIlxcXlxcJVxcJFxcI1xcQFxcIVxcflxcKFxcKVxce1xcfVxcJlxcPFxcPlxcXFxcXC9dKSokLywgJ2dpJykgfVxuICByb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cChmcmFnbWVudCkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKCdeJy5jb25jYXQoZnJhZ21lbnQsICckJykpXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGlmKFxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5lbmFibGVFbWl0dGVycygpXG4gICAgICB0aGlzLmVuYWJsZUV2ZW50cygpXG4gICAgICB0aGlzLmVuYWJsZVJvdXRlcygpXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZGlzYWJsZUV2ZW50cygpXG4gICAgICB0aGlzLmRpc2FibGVSb3V0ZXMoKVxuICAgICAgdGhpcy5kaXNhYmxlRW1pdHRlcnMoKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICB9XG4gIGVuYWJsZVJvdXRlcygpIHtcbiAgICBpZih0aGlzLnNldHRpbmdzLmNvbnRyb2xsZXIpIHRoaXMuX2NvbnRyb2xsZXIgPSB0aGlzLnNldHRpbmdzLmNvbnRyb2xsZXJcbiAgICB0aGlzLl9yb3V0ZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnNldHRpbmdzLnJvdXRlcykucmVkdWNlKFxuICAgICAgKFxuICAgICAgICBfcm91dGVzLFxuICAgICAgICBbcm91dGVQYXRoLCByb3V0ZVNldHRpbmdzXSxcbiAgICAgICAgcm91dGVJbmRleCxcbiAgICAgICAgb3JpZ2luYWxSb3V0ZXMsXG4gICAgICApID0+IHtcbiAgICAgICAgX3JvdXRlc1tyb3V0ZVBhdGhdID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICByb3V0ZVNldHRpbmdzLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhbGxiYWNrOiB0aGlzLmNvbnRyb2xsZXJbcm91dGVTZXR0aW5ncy5jYWxsYmFja10uYmluZCh0aGlzLmNvbnRyb2xsZXIpLFxuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gX3JvdXRlc1xuICAgICAgfSxcbiAgICAgIHt9XG4gICAgKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZW5hYmxlRW1pdHRlcnMoKSB7XG4gICAgT2JqZWN0LmFzc2lnbihcbiAgICAgIHRoaXMuX2VtaXR0ZXJzLFxuICAgICAgdGhpcy5zZXR0aW5ncy5lbWl0dGVycyxcbiAgICAgIHtcbiAgICAgICAgbmF2aWdhdGVFbWl0dGVyOiBuZXcgTVZDLkVtaXR0ZXJzLk5hdmlnYXRlKCksXG4gICAgICB9XG4gICAgKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZGlzYWJsZUVtaXR0ZXJzKCkge1xuICAgIGRlbGV0ZSB0aGlzLl9lbWl0dGVycy5uYXZpZ2F0ZUVtaXR0ZXJcbiAgfVxuICBkaXNhYmxlUm91dGVzKCkge1xuICAgIGRlbGV0ZSB0aGlzLl9yb3V0ZXNcbiAgICBkZWxldGUgdGhpcy5fY29udHJvbGxlclxuICB9XG4gIGVuYWJsZUV2ZW50cygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMucm91dGVDaGFuZ2UuYmluZCh0aGlzKSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGVFdmVudHMoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLnJvdXRlQ2hhbmdlLmJpbmQodGhpcykpXG4gIH1cbiAgcm91dGVDaGFuZ2UoKSB7XG4gICAgdGhpcy5fY3VycmVudFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgbGV0IHJvdXRlRGF0YSA9IHRoaXMuX3JvdXRlRGF0YVxuICAgIGlmKHJvdXRlRGF0YS5jb250cm9sbGVyKSB7XG4gICAgICBsZXQgbmF2aWdhdGVFbWl0dGVyID0gdGhpcy5lbWl0dGVycy5uYXZpZ2F0ZUVtaXR0ZXJcbiAgICAgIGlmKHRoaXMucHJldmlvdXNVUkwpIHJvdXRlRGF0YS5wcmV2aW91c1VSTCA9IHRoaXMucHJldmlvdXNVUkxcbiAgICAgIG5hdmlnYXRlRW1pdHRlclxuICAgICAgICAudW5zZXQoKVxuICAgICAgICAuc2V0KHJvdXRlRGF0YSlcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgbmF2aWdhdGVFbWl0dGVyLm5hbWUsXG4gICAgICAgIG5hdmlnYXRlRW1pdHRlci5lbWlzc2lvbigpXG4gICAgICApXG4gICAgICByb3V0ZURhdGEuY29udHJvbGxlci5jYWxsYmFjayhcbiAgICAgICAgbmF2aWdhdGVFbWl0dGVyLmVtaXNzaW9uKClcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBuYXZpZ2F0ZShwYXRoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoXG4gIH1cbn1cbiJdfQ==
