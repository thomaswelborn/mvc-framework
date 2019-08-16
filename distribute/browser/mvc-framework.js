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
MVC.Utils.paramsToObject = function paramsToObject(params) {
  var params = params.split('&');
  var object = {};
  params.forEach(paramData => {
    paramData = paramData.split('=');
    object[paramData[0]] = decodeURIComponent(paramData[1] || '');
  });
  return JSON.parse(JSON.stringify(object));
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

    return this;
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

    return this;
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

  get _mediators() {
    this.mediators = this.mediators ? this.mediators : {};
    return this.mediators;
  }

  set _mediators(mediators) {
    this.mediators = MVC.Utils.addPropertiesToObject(mediators, this._mediators);
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
      }, this);
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
    return this;
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
      validation.value = value;

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
    var validationSummary = {};
    var messages = Object.assign({
      pass: 'Value is defined.',
      fail: 'Value is not defined.'
    }, schemaSettings.messages);
    value = value !== undefined;
    validationSummary.value = value;
    validationSummary.comparator = schemaSettings;
    validationSummary.result = value === schemaSettings;
    validationSummary.message = validationSummary.result ? messages.pass : messages.fail;
    return validationSummary;
  }

  type(value, schemaSettings) {
    var validationSummary = {};
    var messages = Object.assign({
      pass: 'Valid type.',
      fail: 'Invalid type.'
    }, schemaSettings.messages);
    var typeOfValue = MVC.Utils.typeOf(value);
    validationSummary.value = typeOfValue;
    validationSummary.comparator = schemaSettings;
    validationSummary.result = typeOfValue === schemaSettings;
    validationSummary.message = validationSummary.result ? messages.pass : messages.fail;
    return validationSummary;
  }

  evaluations(value, evaluations) {
    var messages = {
      pass: 'Valid.',
      fail: 'Invalid.'
    };
    return evaluations.reduce((_evaluations, evaluation, evaluationIndex) => {
      if (MVC.Utils.isArray(evaluation)) {
        _evaluations.push(...this.evaluations(value, evaluation));
      } else {
        evaluation._value = value;
        evaluation.messages = evaluation.messages ? evaluation.messages : messages;
        var valueComparison = this.compareValues(evaluation._value, evaluation.comparison.value, evaluation.comparator, evaluation.messages);
        evaluation.results = evaluation.results || {};
        evaluation.results.value = valueComparison;

        _evaluations.push(evaluation);
      }

      if (_evaluations.length > 1) {
        var currentEvaluation = _evaluations[evaluationIndex];

        if (currentEvaluation.comparison.statement) {
          var previousEvaluation = _evaluations[evaluationIndex - 1];
          var previousEvaluationComparisonValue = currentEvaluation.results.statement ? currentEvaluation.results.statement.result : currentEvaluation.results.value.result;
          currentEvaluation.messages = currentEvaluation.messages ? currentEvaluation.messages : messages;
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
      delete evaluationValidation.messages;

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

  get _schema() {
    return this._schema;
  }

  set _schema(schema) {
    this.schema = schema;
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
          this.setDataProperty(key, value);
        });

        break;

      case 2:
        var key = arguments[0];
        var value = arguments[1];
        this.setDataProperty(key, value);
        break;
    }

    if (this.validator) {
      var validateMediator = this.mediators.validate;

      this._validator.validate(JSON.parse(JSON.stringify(this.data)));

      validateMediator.set({
        data: this.validator.data,
        results: this.validator.results
      });
      this.emit(validateMediator.name, validateMediator.emission(), this);
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
            var emit = new Boolean();
            var schema = context._settings.schema;

            if (schema && schema[key]) {
              this[key] = value;
              context._changing[key] = value;
              if (this.localStorage) context.setDB(key, value);
            } else if (!schema) {
              this[key] = value;
              context._changing[key] = value;
              if (this.localStorage) context.setDB(key, value);
            }

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
                }, context);
              }

              delete context.changing;
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
    }, this);
    this.emit(unsetEventName, {
      name: unsetEventName,
      data: {
        key: key,
        value: unsetValue
      }
    }, this);
    return this;
  }

  setDefaults() {
    var _defaults = {};
    if (this.defaults) Object.assign(_defaults, this.defaults);
    if (this.localStorage) Object.assign(_defaults, this._db);
    if (Object.keys(_defaults)) this.set(_defaults);
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

  enableMediators() {
    Object.assign(this._mediators, this.settings.mediators, {
      validate: new MVC.Mediators.Validate()
    });
    return this;
  }

  disableMediators() {
    delete this._mediators;
    return this;
  }

  enable() {
    var settings = this.settings;

    if (settings && !this.enabled) {
      this.enableMediators();

      if (this.settings.schema) {
        this._validator = this.settings.schema;
      }

      if (this.settings.localStorage) this._localStorage = this.settings.localStorage;
      if (this.settings.histiogram) this._histiogram = this.settings.histiogram;
      if (this.settings.services) this._services = this.settings.services;
      if (this.settings.serviceCallbacks) this._serviceCallbacks = this.settings.serviceCallbacks;
      if (this.settings.serviceEvents) this._serviceEvents = this.settings.serviceEvents;
      if (this.settings.data) this.set(this.settings.data);
      if (this.settings.dataCallbacks) this._dataCallbacks = this.settings.dataCallbacks;
      if (this.settings.dataEvents) this._dataEvents = this.settings.dataEvents;
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
      delete this.disableMediators();
      this._enabled = false;
    }

    return this;
  }

  parse(data) {
    data = data || this._data;
    return JSON.parse(JSON.stringify(Object.assign({}, data)));
  }

};
MVC.Mediator = class extends MVC.Model {
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
MVC.Mediators = {};
MVC.Mediators.Navigate = class extends MVC.Mediator {
  constructor() {
    super(...arguments);
    this.addSettings();
    this.enable();
  }

  addSettings() {
    this._name = 'navigate';
    this._schema = {
      oldURL: {
        type: 'string'
      },
      newURL: {
        type: 'string'
      },
      currentRoute: {
        type: 'string'
      },
      currentController: {
        type: 'string'
      }
    };
  }

};
MVC.Mediators.Validate = class extends MVC.Mediator {
  constructor() {
    super(...arguments);
    this.addSettings();
    this.enable();
  }

  addSettings() {
    this._name = 'validate';
    this._schema = {
      data: {
        type: 'object'
      },
      results: {
        type: 'object'
      }
    };
  }

};
MVC.View = class extends MVC.Base {
  constructor() {
    super(...arguments);
    return this;
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
      var parentElement;

      if (MVC.Utils.typeOf(this.insert.element) === 'string') {
        parentElement = document.querySelectorAll(this.insert.element);
      } else {
        parentElement = this.insert.element;
      }

      if (parentElement instanceof HTMLElement || parentElement instanceof Node) {
        parentElement.insertAdjacentElement(this.insert.method, this.element);
      } else if (parentElement instanceof NodeList) {
        parentElement.forEach(_parentElement => {
          _parentElement.insertAdjacentElement(this.insert.method, this.element);
        });
      }
    }

    return this;
  }

  autoRemove() {
    if (this.element && this.element.parentElement) this.element.parentElement.removeChild(this.element);
    return this;
  }

  enableElement(settings) {
    settings = settings || this.settings;
    if (settings.elementName) this._elementName = settings.elementName;
    if (settings.element) this._element = settings.element;
    if (settings.attributes) this._attributes = settings.attributes;
    if (settings.templates) this._templates = settings.templates;
    if (settings.insert) this._insert = settings.insert;
    return this;
  }

  disableElement(settings) {
    settings = settings || this.settings;
    if (this.element) delete this.element;
    if (this.attributes) delete this.attributes;
    if (this.templates) delete this.templates;
    if (this.insert) delete this.insert;
    return this;
  }

  resetUI() {
    this.disableUI();
    this.enableUI();
    return this;
  }

  enableUI(settings) {
    settings = settings || this.settings;
    if (settings.ui) this._ui = settings.ui;
    if (settings.uiCallbacks) this._uiCallbacks = settings.uiCallbacks;

    if (settings.uiEvents) {
      this._uiEvents = settings.uiEvents;
      this.enableUIEvents();
    }

    return this;
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
    return this;
  }

  enableUIEvents() {
    if (this.uiEvents && this.ui && this.uiCallbacks) {
      MVC.Utils.bindEventsToTargetObjects(this.uiEvents, this.ui, this.uiCallbacks);
    }

    return this;
  }

  enableRenderers() {
    MVC.Utils.objectQuery('[/^render.*?/]', this.settings).forEach((_ref) => {
      var [rendererName, rendererFunction] = _ref;
      this[rendererName] = rendererFunction;
    });
    return this;
  }

  disableRenderers() {
    MVC.Utils.objectQuery('[/^render.*?/]', this.settings).forEach((rendererName, rendererFunction) => {
      delete this[rendererName];
    });
    return this;
  }

  disableUIEvents() {
    if (this.uiEvents && this.ui && this.uiCallbacks) {
      MVC.Utils.unbindEventsFromTargetObjects(this.uiEvents, this.ui, this.uiCallbacks);
    }

    return this;
  }

  enableMediators() {
    if (this.settings.mediators) this._mediators = this.settings.mediators;
    return this;
  }

  disableMediators() {
    if (this._mediators) delete this._mediators;
    return this;
  }

  enable() {
    var settings = this.settings;

    if (settings && !this._enabled) {
      this.enableRenderers();
      this.enableMediators();
      this.enableElement(settings);
      this.enableUI(settings);
      this._enabled = true;
    }

    return this;
  }

  disable() {
    var settings = this.settings;

    if (settings && this._enabled) {
      this.disableRenderers();
      this.disableUI(settings);
      this.disableElement(settings);
      this.disableMediators();
      this._enabled = false;
    }

    return this;
  }

};
MVC.Controller = class extends MVC.Base {
  constructor() {
    super(...arguments);
  }

  get _mediatorCallbacks() {
    this.mediatorCallbacks = this.mediatorCallbacks ? this.mediatorCallbacks : {};
    return this.mediatorCallbacks;
  }

  set _mediatorCallbacks(mediatorCallbacks) {
    this.mediatorCallbacks = MVC.Utils.addPropertiesToObject(mediatorCallbacks, this._mediatorCallbacks);
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

  get _mediatorEvents() {
    this.mediatorEvents = this.mediatorEvents ? this.mediatorEvents : {};
    return this.mediatorEvents;
  }

  set _mediatorEvents(mediatorEvents) {
    this.mediatorEvents = MVC.Utils.addPropertiesToObject(mediatorEvents, this._mediatorEvents);
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
    return this;
  }

  disableModelEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.modelEvents, this.models, this.modelCallbacks);
    return this;
  }

  enableViewEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.viewEvents, this.views, this.viewCallbacks);
    return this;
  }

  disableViewEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.viewEvents, this.views, this.viewCallbacks);
    return this;
  }

  enableControllerEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks);
    return this;
  }

  disableControllerEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks);
    return this;
  }

  enableMediatorEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.mediatorEvents, this.mediators, this.mediatorCallbacks);
    return this;
  }

  disableMediatorEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.mediatorEvents, this.mediators, this.mediatorCallbacks);
    return this;
  }

  enableRouterEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.routerEvents, this.routers, this.routerCallbacks);
    return this;
  }

  disableRouterEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.routerEvents, this.routers, this.routerCallbacks);
    return this;
  }

  enable() {
    var settings = this.settings;

    if (settings && !this.enabled) {
      if (settings.modelCallbacks) this._modelCallbacks = settings.modelCallbacks;
      if (settings.viewCallbacks) this._viewCallbacks = settings.viewCallbacks;
      if (settings.controllerCallbacks) this._controllerCallbacks = settings.controllerCallbacks;
      if (settings.mediatorCallbacks) this._mediatorCallbacks = settings.mediatorCallbacks;
      if (settings.routerCallbacks) this._routerCallbacks = settings.routerCallbacks;
      if (settings.models) this._models = settings.models;
      if (settings.views) this._views = settings.views;
      if (settings.controllers) this._controllers = settings.controllers;
      if (settings.mediators) this._mediators = settings.mediators;
      if (settings.routers) this._routers = settings.routers;
      if (settings.modelEvents) this._modelEvents = settings.modelEvents;
      if (settings.viewEvents) this._viewEvents = settings.viewEvents;
      if (settings.controllerEvents) this._controllerEvents = settings.controllerEvents;
      if (settings.mediatorEvents) this._mediatorEvents = settings.mediatorEvents;
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

      if (this.mediatorEvents && this.mediators && this.mediatorCallbacks) {
        this.enableMediatorEvents();
      }

      this._enabled = true;
    }

    return this;
  }

  reset() {
    this.disable();
    this.enable();
    return this;
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

    if (this.mediatorEvents && this.mediators && this.mediatorCallbacks) {
      this.disableMediatorEvents();
      delete this._modelCallbacks;
      delete this._viewCallbacks;
      delete this._controllerCallbacks;
      delete this._mediatorCallbacks;
      delete this._routerCallbacks;
      delete this._models;
      delete this._views;
      delete this._controllers;
      delete this._mediators;
      delete this._routers;
      delete this._routerEvents;
      delete this._modelEvents;
      delete this._viewEvents;
      delete this._controllerEvents;
      delete this._mediatorEvents;
      this._enabled = false;
    }

    return this;
  }

};
MVC.Router = class extends MVC.Base {
  constructor() {
    super(...arguments);
    return this;
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
      this.enableMediators();
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
      this.disableMediators();
      this._enabled = false;
    }

    return this;
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

  enableMediators() {
    Object.assign(this._mediators, this.settings.mediators, {
      navigateMediator: new MVC.Mediators.Navigate()
    });
    return this;
  }

  disableMediators() {
    delete this._mediators.navigateMediator;
    return this;
  }

  disableRoutes() {
    delete this._routes;
    delete this._controller;
    return this;
  }

  enableEvents() {
    window.addEventListener('hashchange', this.routeChange.bind(this));
    return this;
  }

  disableEvents() {
    window.removeEventListener('hashchange', this.routeChange.bind(this));
    return this;
  }

  routeChange() {
    this._currentURL = window.location.href;
    var routeData = this._routeData;

    if (routeData.controller) {
      var navigateMediator = this.mediators.navigateMediator;
      if (this.previousURL) routeData.previousURL = this.previousURL;
      navigateMediator.unset().set(routeData);
      this.emit(navigateMediator.name, navigateMediator.emission());
      routeData.controller.callback(navigateMediator.emission());
    }

    return this;
  }

  navigate(path) {
    window.location.href = path;
  }

};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwiRXZlbnRzLmpzIiwiT3BlcmF0b3JzLmpzIiwiaXMuanMiLCJ0eXBlT2YuanMiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QuanMiLCJvYmplY3RRdWVyeS5qcyIsInBhcmFtc1RvT2JqZWN0LmpzIiwidG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cy5qcyIsIk5hdmlnYXRlLmpzIiwiVmFsaWRhdGUuanMiXSwibmFtZXMiOlsiTVZDIiwiQ29uc3RhbnRzIiwiQ09OU1QiLCJFdmVudHMiLCJFViIsIk9wZXJhdG9ycyIsIkNvbXBhcmlzb24iLCJFUSIsIlNURVEiLCJOT0VRIiwiU1ROT0VRIiwiR1QiLCJMVCIsIkdURSIsIkxURSIsIlN0YXRlbWVudCIsIkFORCIsIk9SIiwiY29uc29sZSIsImxvZyIsIlV0aWxzIiwiaXNBcnJheSIsIm9iamVjdCIsIkFycmF5IiwiaXNPYmplY3QiLCJ0eXBlT2YiLCJ2YWx1ZSIsInZhbHVlQSIsInVuZGVmaW5lZCIsImlzSFRNTEVsZW1lbnQiLCJIVE1MRWxlbWVudCIsImRhdGEiLCJfb2JqZWN0IiwiYWRkUHJvcGVydGllc1RvT2JqZWN0IiwidGFyZ2V0T2JqZWN0IiwiYXJndW1lbnRzIiwibGVuZ3RoIiwicHJvcGVydGllcyIsInByb3BlcnR5TmFtZSIsInByb3BlcnR5VmFsdWUiLCJPYmplY3QiLCJlbnRyaWVzIiwib2JqZWN0UXVlcnkiLCJzdHJpbmciLCJjb250ZXh0Iiwic3RyaW5nRGF0YSIsInBhcnNlTm90YXRpb24iLCJzcGxpY2UiLCJyZWR1Y2UiLCJmcmFnbWVudCIsImZyYWdtZW50SW5kZXgiLCJmcmFnbWVudHMiLCJwYXJzZUZyYWdtZW50IiwicHJvcGVydHlLZXkiLCJtYXRjaCIsImNvbmNhdCIsImNoYXJBdCIsInNsaWNlIiwic3BsaXQiLCJSZWdFeHAiLCJwYXJhbXNUb09iamVjdCIsInBhcmFtcyIsImZvckVhY2giLCJwYXJhbURhdGEiLCJkZWNvZGVVUklDb21wb25lbnQiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJ0b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzIiwidG9nZ2xlTWV0aG9kIiwiZXZlbnRzIiwidGFyZ2V0T2JqZWN0cyIsImNhbGxiYWNrcyIsImV2ZW50U2V0dGluZ3MiLCJldmVudENhbGxiYWNrTmFtZSIsImV2ZW50RGF0YSIsImV2ZW50VGFyZ2V0U2V0dGluZ3MiLCJldmVudE5hbWUiLCJldmVudFRhcmdldHMiLCJldmVudFRhcmdldE5hbWUiLCJldmVudFRhcmdldCIsImV2ZW50TWV0aG9kTmFtZSIsIk5vZGVMaXN0IiwiRG9jdW1lbnQiLCJldmVudENhbGxiYWNrIiwiX2V2ZW50VGFyZ2V0IiwiYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyIsInVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzIiwiY29uc3RydWN0b3IiLCJfZXZlbnRzIiwiZ2V0RXZlbnRDYWxsYmFja3MiLCJnZXRFdmVudENhbGxiYWNrTmFtZSIsIm5hbWUiLCJnZXRFdmVudENhbGxiYWNrR3JvdXAiLCJldmVudENhbGxiYWNrcyIsIm9uIiwiZXZlbnRDYWxsYmFja0dyb3VwIiwicHVzaCIsIm9mZiIsImtleXMiLCJlbWl0IiwiX2FyZ3VtZW50cyIsInZhbHVlcyIsImV2ZW50Q2FsbGJhY2tHcm91cE5hbWUiLCJhZGRpdGlvbmFsQXJndW1lbnRzIiwiQ2hhbm5lbHMiLCJfY2hhbm5lbHMiLCJjaGFubmVscyIsImNoYW5uZWwiLCJjaGFubmVsTmFtZSIsIkNoYW5uZWwiLCJfcmVzcG9uc2VzIiwicmVzcG9uc2VzIiwicmVzcG9uc2UiLCJyZXNwb25zZU5hbWUiLCJyZXNwb25zZUNhbGxiYWNrIiwicmVxdWVzdCIsInJlcXVlc3REYXRhIiwiQmFzZSIsInNldHRpbmdzIiwiY29uZmlndXJhdGlvbiIsIl9jb25maWd1cmF0aW9uIiwiX3NldHRpbmdzIiwiX21lZGlhdG9ycyIsIm1lZGlhdG9ycyIsIlNlcnZpY2UiLCJfZGVmYXVsdHMiLCJkZWZhdWx0cyIsImNvbnRlbnRUeXBlIiwicmVzcG9uc2VUeXBlIiwiX3Jlc3BvbnNlVHlwZXMiLCJfcmVzcG9uc2VUeXBlIiwiX3hociIsImZpbmQiLCJyZXNwb25zZVR5cGVJdGVtIiwiX3R5cGUiLCJ0eXBlIiwiX3VybCIsInVybCIsIl9oZWFkZXJzIiwiaGVhZGVycyIsImhlYWRlciIsInNldFJlcXVlc3RIZWFkZXIiLCJfZGF0YSIsInhociIsIlhNTEh0dHBSZXF1ZXN0IiwiX2VuYWJsZWQiLCJlbmFibGVkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzdGF0dXMiLCJhYm9ydCIsIm9wZW4iLCJvbmxvYWQiLCJvbmVycm9yIiwic2VuZCIsInRoZW4iLCJjdXJyZW50VGFyZ2V0IiwiY2F0Y2giLCJlcnJvciIsImVuYWJsZSIsImRpc2FibGUiLCJWYWxpZGF0b3IiLCJzY2hlbWEiLCJfc2NoZW1hIiwiX3Jlc3VsdHMiLCJyZXN1bHRzIiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uU3VtbWFyeSIsInNjaGVtYUtleSIsInNjaGVtYVNldHRpbmdzIiwidmFsaWRhdGlvbiIsImtleSIsInJlcXVpcmVkIiwiZXZhbHVhdGlvbnMiLCJ2YWxpZGF0aW9uRXZhbHVhdGlvbnMiLCJldmFsdWF0aW9uUmVzdWx0cyIsIm1lc3NhZ2VzIiwiYXNzaWduIiwicGFzcyIsImZhaWwiLCJjb21wYXJhdG9yIiwicmVzdWx0IiwibWVzc2FnZSIsInR5cGVPZlZhbHVlIiwiX2V2YWx1YXRpb25zIiwiZXZhbHVhdGlvbiIsImV2YWx1YXRpb25JbmRleCIsIl92YWx1ZSIsInZhbHVlQ29tcGFyaXNvbiIsImNvbXBhcmVWYWx1ZXMiLCJjb21wYXJpc29uIiwiY3VycmVudEV2YWx1YXRpb24iLCJzdGF0ZW1lbnQiLCJwcmV2aW91c0V2YWx1YXRpb24iLCJwcmV2aW91c0V2YWx1YXRpb25Db21wYXJpc29uVmFsdWUiLCJzdGF0ZW1lbnRDb21wYXJpc29uIiwiY29tcGFyZVN0YXRlbWVudHMiLCJldmFsdWF0aW9uVmFsaWRhdGlvbiIsIm9wZXJhdG9yIiwiZXZhbHVhdGlvblJlc3VsdCIsIk1vZGVsIiwiX3ZhbGlkYXRvciIsInZhbGlkYXRvciIsIl9pc1NldHRpbmciLCJpc1NldHRpbmciLCJfY2hhbmdpbmciLCJjaGFuZ2luZyIsIl9sb2NhbFN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJfaGlzdGlvZ3JhbSIsImhpc3Rpb2dyYW0iLCJfaGlzdG9yeSIsImhpc3RvcnkiLCJ1bnNoaWZ0IiwiX2RiIiwiZGIiLCJnZXRJdGVtIiwiZW5kcG9pbnQiLCJzZXRJdGVtIiwiX2RhdGFFdmVudHMiLCJkYXRhRXZlbnRzIiwiX2RhdGFDYWxsYmFja3MiLCJkYXRhQ2FsbGJhY2tzIiwiX3NlcnZpY2VzIiwic2VydmljZXMiLCJfc2VydmljZUV2ZW50cyIsInNlcnZpY2VFdmVudHMiLCJfc2VydmljZUNhbGxiYWNrcyIsInNlcnZpY2VDYWxsYmFja3MiLCJnZXQiLCJzZXQiLCJpbmRleCIsInNldERhdGFQcm9wZXJ0eSIsInZhbGlkYXRlTWVkaWF0b3IiLCJlbWlzc2lvbiIsInVuc2V0IiwidW5zZXREYXRhUHJvcGVydHkiLCJzZXREQiIsInVuc2V0REIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiY29uZmlndXJhYmxlIiwiQm9vbGVhbiIsInNldFZhbHVlRXZlbnROYW1lIiwiam9pbiIsInNldEV2ZW50TmFtZSIsInVuc2V0VmFsdWVFdmVudE5hbWUiLCJ1bnNldEV2ZW50TmFtZSIsInVuc2V0VmFsdWUiLCJzZXREZWZhdWx0cyIsImVuYWJsZVNlcnZpY2VFdmVudHMiLCJkaXNhYmxlU2VydmljZUV2ZW50cyIsImVuYWJsZURhdGFFdmVudHMiLCJkaXNhYmxlRGF0YUV2ZW50cyIsImVuYWJsZU1lZGlhdG9ycyIsIk1lZGlhdG9ycyIsIlZhbGlkYXRlIiwiZGlzYWJsZU1lZGlhdG9ycyIsIk1lZGlhdG9yIiwiX25hbWUiLCJOYXZpZ2F0ZSIsImFkZFNldHRpbmdzIiwib2xkVVJMIiwibmV3VVJMIiwiY3VycmVudFJvdXRlIiwiY3VycmVudENvbnRyb2xsZXIiLCJWaWV3IiwiX2VsZW1lbnROYW1lIiwiX2VsZW1lbnQiLCJ0YWdOYW1lIiwiZWxlbWVudE5hbWUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJlbGVtZW50IiwicXVlcnlTZWxlY3RvciIsImVsZW1lbnRPYnNlcnZlciIsIm9ic2VydmUiLCJzdWJ0cmVlIiwiY2hpbGRMaXN0IiwiX2F0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJfdWkiLCJ1aSIsInVpS2V5IiwidWlWYWx1ZSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJfdWlFdmVudHMiLCJ1aUV2ZW50cyIsIl91aUNhbGxiYWNrcyIsInVpQ2FsbGJhY2tzIiwiX29ic2VydmVyQ2FsbGJhY2tzIiwib2JzZXJ2ZXJDYWxsYmFja3MiLCJfZWxlbWVudE9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsImVsZW1lbnRPYnNlcnZlIiwiYmluZCIsIl9pbnNlcnQiLCJpbnNlcnQiLCJfdGVtcGxhdGVzIiwidGVtcGxhdGVzIiwibXV0YXRpb25SZWNvcmRMaXN0Iiwib2JzZXJ2ZXIiLCJtdXRhdGlvblJlY29yZEluZGV4IiwibXV0YXRpb25SZWNvcmQiLCJtdXRhdGlvblJlY29yZENhdGVnb3JpZXMiLCJtdXRhdGlvblJlY29yZENhdGVnb3J5IiwicmVzZXRVSSIsImF1dG9JbnNlcnQiLCJwYXJlbnRFbGVtZW50IiwiTm9kZSIsImluc2VydEFkamFjZW50RWxlbWVudCIsIm1ldGhvZCIsIl9wYXJlbnRFbGVtZW50IiwiYXV0b1JlbW92ZSIsInJlbW92ZUNoaWxkIiwiZW5hYmxlRWxlbWVudCIsImRpc2FibGVFbGVtZW50IiwiZGlzYWJsZVVJIiwiZW5hYmxlVUkiLCJlbmFibGVVSUV2ZW50cyIsImRpc2FibGVVSUV2ZW50cyIsImVuYWJsZVJlbmRlcmVycyIsInJlbmRlcmVyTmFtZSIsInJlbmRlcmVyRnVuY3Rpb24iLCJkaXNhYmxlUmVuZGVyZXJzIiwiQ29udHJvbGxlciIsIl9tZWRpYXRvckNhbGxiYWNrcyIsIm1lZGlhdG9yQ2FsbGJhY2tzIiwiX21vZGVsQ2FsbGJhY2tzIiwibW9kZWxDYWxsYmFja3MiLCJfdmlld0NhbGxiYWNrcyIsInZpZXdDYWxsYmFja3MiLCJfY29udHJvbGxlckNhbGxiYWNrcyIsImNvbnRyb2xsZXJDYWxsYmFja3MiLCJfbW9kZWxzIiwibW9kZWxzIiwiX3ZpZXdzIiwidmlld3MiLCJfY29udHJvbGxlcnMiLCJjb250cm9sbGVycyIsIl9yb3V0ZXJzIiwicm91dGVycyIsIl9yb3V0ZXJFdmVudHMiLCJyb3V0ZXJFdmVudHMiLCJfcm91dGVyQ2FsbGJhY2tzIiwicm91dGVyQ2FsbGJhY2tzIiwiX21lZGlhdG9yRXZlbnRzIiwibWVkaWF0b3JFdmVudHMiLCJfbW9kZWxFdmVudHMiLCJtb2RlbEV2ZW50cyIsIl92aWV3RXZlbnRzIiwidmlld0V2ZW50cyIsIl9jb250cm9sbGVyRXZlbnRzIiwiY29udHJvbGxlckV2ZW50cyIsImVuYWJsZU1vZGVsRXZlbnRzIiwiZGlzYWJsZU1vZGVsRXZlbnRzIiwiZW5hYmxlVmlld0V2ZW50cyIsImRpc2FibGVWaWV3RXZlbnRzIiwiZW5hYmxlQ29udHJvbGxlckV2ZW50cyIsImRpc2FibGVDb250cm9sbGVyRXZlbnRzIiwiZW5hYmxlTWVkaWF0b3JFdmVudHMiLCJkaXNhYmxlTWVkaWF0b3JFdmVudHMiLCJlbmFibGVSb3V0ZXJFdmVudHMiLCJkaXNhYmxlUm91dGVyRXZlbnRzIiwicmVzZXQiLCJSb3V0ZXIiLCJwcm90b2NvbCIsIndpbmRvdyIsImxvY2F0aW9uIiwiaG9zdG5hbWUiLCJwb3J0IiwicGF0aCIsInBhdGhuYW1lIiwiaGFzaCIsImhyZWYiLCJoYXNoSW5kZXgiLCJpbmRleE9mIiwicGFyYW1JbmRleCIsInNsaWNlU3RhcnQiLCJzbGljZVN0b3AiLCJfcm91dGVEYXRhIiwicm91dGVEYXRhIiwiY29udHJvbGxlciIsImZpbHRlciIsImhhc2hGcmFnbWVudHMiLCJjdXJyZW50VVJMIiwicm91dGVDb250cm9sbGVyRGF0YSIsIl9yb3V0ZUNvbnRyb2xsZXJEYXRhIiwicm91dGVzIiwicm91dGVQYXRoIiwicm91dGVTZXR0aW5ncyIsInBhdGhGcmFnbWVudHMiLCJyb3V0ZUZyYWdtZW50cyIsInJvdXRlRnJhZ21lbnQiLCJyb3V0ZUZyYWdtZW50SW5kZXgiLCJjdXJyZW50SURLZXkiLCJyZXBsYWNlIiwiZnJhZ21lbnRJRFJlZ0V4cCIsInJvdXRlRnJhZ21lbnROYW1lUmVnRXhwIiwidGVzdCIsInJvdXRlIiwiX3JvdXRlcyIsIl9jb250cm9sbGVyIiwiX3ByZXZpb3VzVVJMIiwicHJldmlvdXNVUkwiLCJfY3VycmVudFVSTCIsImVuYWJsZUV2ZW50cyIsImVuYWJsZVJvdXRlcyIsImRpc2FibGVFdmVudHMiLCJkaXNhYmxlUm91dGVzIiwicm91dGVJbmRleCIsIm9yaWdpbmFsUm91dGVzIiwiY2FsbGJhY2siLCJuYXZpZ2F0ZU1lZGlhdG9yIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJvdXRlQ2hhbmdlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm5hdmlnYXRlIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxHQUFHLEdBQUdBLEdBQUcsSUFBSSxFQUFqQjtBQUFBQSxHQUFHLENBQUNDLFNBQUosR0FBZ0IsRUFBaEI7QUFDQUQsR0FBRyxDQUFDRSxLQUFKLEdBQVlGLEdBQUcsQ0FBQ0MsU0FBaEI7QUNEQUQsR0FBRyxDQUFDQyxTQUFKLENBQWNFLE1BQWQsR0FBdUIsRUFBdkI7QUFDQUgsR0FBRyxDQUFDRSxLQUFKLENBQVVFLEVBQVYsR0FBZUosR0FBRyxDQUFDQyxTQUFKLENBQWNFLE1BQTdCO0FDREFILEdBQUcsQ0FBQ0MsU0FBSixDQUFjSSxTQUFkLEdBQTBCLEVBQTFCO0FBQ0FMLEdBQUcsQ0FBQ0UsS0FBSixDQUFVRyxTQUFWLEdBQXNCLEVBQXRCO0FBQ0FMLEdBQUcsQ0FBQ0UsS0FBSixDQUFVRyxTQUFWLENBQW9CQyxVQUFwQixHQUFpQztBQUMvQkMsRUFBQUEsRUFBRSxFQUFFLElB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PSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZ2V0IHByb3RvY29sKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnByb3RvY29sIH1cbiAgZ2V0IGhvc3RuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lIH1cbiAgZ2V0IHBvcnQoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucG9ydCB9XG4gIGdldCBwYXRoKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIH1cbiAgZ2V0IGhhc2goKSB7XG4gICAgbGV0IGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgIGxldCBoYXNoSW5kZXggPSBocmVmLmluZGV4T2YoJyMnKVxuICAgIGlmKGhhc2hJbmRleCA+IC0xKSB7XG4gICAgICBsZXQgcGFyYW1JbmRleCA9IGhyZWYuaW5kZXhPZignPycpXG4gICAgICBsZXQgc2xpY2VTdGFydCA9IGhhc2hJbmRleCArIDFcbiAgICAgIGxldCBzbGljZVN0b3BcbiAgICAgIGlmKHBhcmFtSW5kZXggPiAtMSkge1xuICAgICAgICBzbGljZVN0b3AgPSAoaGFzaEluZGV4ID4gcGFyYW1JbmRleClcbiAgICAgICAgICA/IGhyZWYubGVuZ3RoXG4gICAgICAgICAgOiBwYXJhbUluZGV4XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzbGljZVN0b3AgPSBocmVmLmxlbmd0aFxuICAgICAgfVxuICAgICAgaHJlZiA9IGhyZWYuc2xpY2Uoc2xpY2VTdGFydCwgc2xpY2VTdG9wKVxuICAgICAgaWYoaHJlZi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGhyZWZcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG4gIGdldCBwYXJhbXMoKSB7XG4gICAgbGV0IGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgIGxldCBwYXJhbUluZGV4ID0gaHJlZi5pbmRleE9mKCc/JylcbiAgICBpZihwYXJhbUluZGV4ID4gLTEpIHtcbiAgICAgIGxldCBoYXNoSW5kZXggPSBocmVmLmluZGV4T2YoJyMnKVxuICAgICAgbGV0IHNsaWNlU3RhcnQgPSBwYXJhbUluZGV4ICsgMVxuICAgICAgbGV0IHNsaWNlU3RvcFxuICAgICAgaWYoaGFzaEluZGV4ID4gLTEpIHtcbiAgICAgICAgc2xpY2VTdG9wID0gKHBhcmFtSW5kZXggPiBoYXNoSW5kZXgpXG4gICAgICAgICAgPyBocmVmLmxlbmd0aFxuICAgICAgICAgIDogaGFzaEluZGV4XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzbGljZVN0b3AgPSBocmVmLmxlbmd0aFxuICAgICAgfVxuICAgICAgaHJlZiA9IGhyZWYuc2xpY2Uoc2xpY2VTdGFydCwgc2xpY2VTdG9wKVxuICAgICAgaWYoaHJlZi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGhyZWZcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG4gIGdldCBfcm91dGVEYXRhKCkge1xuICAgIGxldCByb3V0ZURhdGEgPSB7XG4gICAgICBsb2NhdGlvbjoge30sXG4gICAgICBjb250cm9sbGVyOiB7fSxcbiAgICB9XG4gICAgbGV0IHBhdGggPSB0aGlzLnBhdGguc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgcGF0aCA9IChwYXRoLmxlbmd0aClcbiAgICAgID8gcGF0aFxuICAgICAgOiBbJy8nXVxuICAgIGxldCBoYXNoID0gdGhpcy5oYXNoXG4gICAgbGV0IGhhc2hGcmFnbWVudHMgPSAoaGFzaClcbiAgICAgID8gaGFzaC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgIDogbnVsbFxuICAgIGxldCBwYXJhbXMgPSB0aGlzLnBhcmFtc1xuICAgIGxldCBwYXJhbURhdGEgPSAocGFyYW1zKVxuICAgICAgPyBNVkMuVXRpbHMucGFyYW1zVG9PYmplY3QocGFyYW1zKVxuICAgICAgOiBudWxsXG4gICAgaWYodGhpcy5wcm90b2NvbCkgcm91dGVEYXRhLmxvY2F0aW9uLnByb3RvY29sID0gdGhpcy5wcm90b2NvbFxuICAgIGlmKHRoaXMuaG9zdG5hbWUpIHJvdXRlRGF0YS5sb2NhdGlvbi5ob3N0bmFtZSA9IHRoaXMuaG9zdG5hbWVcbiAgICBpZih0aGlzLnBvcnQpIHJvdXRlRGF0YS5sb2NhdGlvbi5wb3J0ID0gdGhpcy5wb3J0XG4gICAgaWYodGhpcy5wYXRoKSByb3V0ZURhdGEubG9jYXRpb24ucGF0aCA9IHRoaXMucGF0aFxuICAgIGlmKFxuICAgICAgaGFzaCAmJlxuICAgICAgaGFzaEZyYWdtZW50c1xuICAgICkge1xuICAgICAgaGFzaEZyYWdtZW50cyA9IChoYXNoRnJhZ21lbnRzLmxlbmd0aClcbiAgICAgID8gaGFzaEZyYWdtZW50c1xuICAgICAgOiBbJy8nXVxuICAgICAgcm91dGVEYXRhLmxvY2F0aW9uLmhhc2ggPSB7XG4gICAgICAgIHBhdGg6IGhhc2gsXG4gICAgICAgIGZyYWdtZW50czogaGFzaEZyYWdtZW50cyxcbiAgICAgIH1cbiAgICB9XG4gICAgaWYoXG4gICAgICBwYXJhbXMgJiZcbiAgICAgIHBhcmFtRGF0YVxuICAgICkge1xuICAgICAgcm91dGVEYXRhLmxvY2F0aW9uLnBhcmFtcyA9IHtcbiAgICAgICAgcGF0aDogcGFyYW1zLFxuICAgICAgICBkYXRhOiBwYXJhbURhdGEsXG4gICAgICB9XG4gICAgfVxuICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5wYXRoID0ge1xuICAgICAgbmFtZTogdGhpcy5wYXRoLFxuICAgICAgZnJhZ21lbnRzOiBwYXRoLFxuICAgIH1cbiAgICByb3V0ZURhdGEubG9jYXRpb24uY3VycmVudFVSTCA9IHRoaXMuY3VycmVudFVSTFxuICAgIGxldCByb3V0ZUNvbnRyb2xsZXJEYXRhID0gdGhpcy5fcm91dGVDb250cm9sbGVyRGF0YVxuICAgIHJvdXRlRGF0YS5sb2NhdGlvbiA9IE9iamVjdC5hc3NpZ24oXG4gICAgICByb3V0ZURhdGEubG9jYXRpb24sXG4gICAgICByb3V0ZUNvbnRyb2xsZXJEYXRhLmxvY2F0aW9uXG4gICAgKVxuICAgIHJvdXRlRGF0YS5jb250cm9sbGVyID0gcm91dGVDb250cm9sbGVyRGF0YS5jb250cm9sbGVyXG4gICAgdGhpcy5yb3V0ZURhdGEgPSByb3V0ZURhdGFcbiAgICByZXR1cm4gdGhpcy5yb3V0ZURhdGFcbiAgfVxuICBnZXQgX3JvdXRlQ29udHJvbGxlckRhdGEoKSB7XG4gICAgbGV0IHJvdXRlRGF0YSA9IHtcbiAgICAgIGxvY2F0aW9uOiB7fSxcbiAgICB9XG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5yb3V0ZXMpXG4gICAgICAuZm9yRWFjaCgoW3JvdXRlUGF0aCwgcm91dGVTZXR0aW5nc10pID0+IHtcbiAgICAgICAgbGV0IHBhdGhGcmFnbWVudHMgPSB0aGlzLnBhdGguc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgICAgIHBhdGhGcmFnbWVudHMgPSAocGF0aEZyYWdtZW50cy5sZW5ndGgpXG4gICAgICAgICAgPyBwYXRoRnJhZ21lbnRzXG4gICAgICAgICAgOiBbJy8nXVxuICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSByb3V0ZVBhdGguc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50LCBmcmFnbWVudEluZGV4KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgICAgIHJvdXRlRnJhZ21lbnRzID0gKHJvdXRlRnJhZ21lbnRzLmxlbmd0aClcbiAgICAgICAgICA/IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgICAgOiBbJy8nXVxuICAgICAgICBpZihcbiAgICAgICAgICBwYXRoRnJhZ21lbnRzLmxlbmd0aCAmJlxuICAgICAgICAgIHBhdGhGcmFnbWVudHMubGVuZ3RoID09PSByb3V0ZUZyYWdtZW50cy5sZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgbGV0IG1hdGNoXG4gICAgICAgICAgcmV0dXJuIHJvdXRlRnJhZ21lbnRzLmZpbHRlcigocm91dGVGcmFnbWVudCwgcm91dGVGcmFnbWVudEluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgbWF0Y2ggPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICBtYXRjaCA9PT0gdHJ1ZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGlmKHJvdXRlRnJhZ21lbnRbMF0gPT09ICc6Jykge1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50SURLZXkgPSByb3V0ZUZyYWdtZW50LnJlcGxhY2UoJzonLCAnJylcbiAgICAgICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICAgIHJvdXRlRnJhZ21lbnRJbmRleCA9PT0gcGF0aEZyYWdtZW50cy5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICByb3V0ZURhdGEubG9jYXRpb24uY3VycmVudElES2V5ID0gY3VycmVudElES2V5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbltjdXJyZW50SURLZXldID0gcGF0aEZyYWdtZW50c1tyb3V0ZUZyYWdtZW50SW5kZXhdXG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudCA9IHRoaXMuZnJhZ21lbnRJRFJlZ0V4cFxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJvdXRlRnJhZ21lbnQgPSByb3V0ZUZyYWdtZW50LnJlcGxhY2UobmV3IFJlZ0V4cCgnLycsICdnaScpLCAnXFxcXFxcLycpXG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudCA9IHRoaXMucm91dGVGcmFnbWVudE5hbWVSZWdFeHAocm91dGVGcmFnbWVudClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBtYXRjaCA9IHJvdXRlRnJhZ21lbnQudGVzdChwYXRoRnJhZ21lbnRzW3JvdXRlRnJhZ21lbnRJbmRleF0pXG4gICAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICAgIG1hdGNoID09PSB0cnVlICYmXG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudEluZGV4ID09PSBwYXRoRnJhZ21lbnRzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcm91dGVEYXRhLmxvY2F0aW9uLnJvdXRlID0ge1xuICAgICAgICAgICAgICAgICAgbmFtZTogcm91dGVQYXRoLFxuICAgICAgICAgICAgICAgICAgZnJhZ21lbnRzOiByb3V0ZUZyYWdtZW50cyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcm91dGVEYXRhLmNvbnRyb2xsZXIgPSByb3V0ZVNldHRpbmdzXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pWzBdXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgcmV0dXJuIHJvdXRlRGF0YVxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICBnZXQgX3JvdXRlcygpIHtcbiAgICB0aGlzLnJvdXRlcyA9ICh0aGlzLnJvdXRlcylcbiAgICAgID8gdGhpcy5yb3V0ZXNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXNcbiAgfVxuICBzZXQgX3JvdXRlcyhyb3V0ZXMpIHtcbiAgICB0aGlzLnJvdXRlcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXMsIHRoaXMuX3JvdXRlc1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXIoKSB7IHJldHVybiB0aGlzLmNvbnRyb2xsZXIgfVxuICBzZXQgX2NvbnRyb2xsZXIoY29udHJvbGxlcikgeyB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyIH1cbiAgZ2V0IF9wcmV2aW91c1VSTCgpIHsgcmV0dXJuIHRoaXMucHJldmlvdXNVUkwgfVxuICBzZXQgX3ByZXZpb3VzVVJMKHByZXZpb3VzVVJMKSB7IHRoaXMucHJldmlvdXNVUkwgPSBwcmV2aW91c1VSTCB9XG4gIGdldCBfY3VycmVudFVSTCgpIHsgcmV0dXJuIHRoaXMuY3VycmVudFVSTCB9XG4gIHNldCBfY3VycmVudFVSTChjdXJyZW50VVJMKSB7XG4gICAgaWYodGhpcy5jdXJyZW50VVJMKSB0aGlzLl9wcmV2aW91c1VSTCA9IHRoaXMuY3VycmVudFVSTFxuICAgIHRoaXMuY3VycmVudFVSTCA9IGN1cnJlbnRVUkxcbiAgfVxuICBnZXQgZnJhZ21lbnRJRFJlZ0V4cCgpIHsgcmV0dXJuIG5ldyBSZWdFeHAoL14oWzAtOUEtWlxcP1xcPVxcLFxcLlxcKlxcLVxcX1xcJ1xcXCJcXF5cXCVcXCRcXCNcXEBcXCFcXH5cXChcXClcXHtcXH1cXCZcXDxcXD5cXFxcXFwvXSkqJC8sICdnaScpIH1cbiAgcm91dGVGcmFnbWVudE5hbWVSZWdFeHAoZnJhZ21lbnQpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cCgnXicuY29uY2F0KGZyYWdtZW50LCAnJCcpKVxuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBpZihcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZW5hYmxlTWVkaWF0b3JzKClcbiAgICAgIHRoaXMuZW5hYmxlRXZlbnRzKClcbiAgICAgIHRoaXMuZW5hYmxlUm91dGVzKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBpZihcbiAgICAgIHRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5kaXNhYmxlRXZlbnRzKClcbiAgICAgIHRoaXMuZGlzYWJsZVJvdXRlcygpXG4gICAgICB0aGlzLmRpc2FibGVNZWRpYXRvcnMoKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZW5hYmxlUm91dGVzKCkge1xuICAgIGlmKHRoaXMuc2V0dGluZ3MuY29udHJvbGxlcikgdGhpcy5fY29udHJvbGxlciA9IHRoaXMuc2V0dGluZ3MuY29udHJvbGxlclxuICAgIHRoaXMuX3JvdXRlcyA9IE9iamVjdC5lbnRyaWVzKHRoaXMuc2V0dGluZ3Mucm91dGVzKS5yZWR1Y2UoXG4gICAgICAoXG4gICAgICAgIF9yb3V0ZXMsXG4gICAgICAgIFtyb3V0ZVBhdGgsIHJvdXRlU2V0dGluZ3NdLFxuICAgICAgICByb3V0ZUluZGV4LFxuICAgICAgICBvcmlnaW5hbFJvdXRlcyxcbiAgICAgICkgPT4ge1xuICAgICAgICBfcm91dGVzW3JvdXRlUGF0aF0gPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHJvdXRlU2V0dGluZ3MsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FsbGJhY2s6IHRoaXMuY29udHJvbGxlcltyb3V0ZVNldHRpbmdzLmNhbGxiYWNrXS5iaW5kKHRoaXMuY29udHJvbGxlciksXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICAgIHJldHVybiBfcm91dGVzXG4gICAgICB9LFxuICAgICAge31cbiAgICApXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBlbmFibGVNZWRpYXRvcnMoKSB7XG4gICAgT2JqZWN0LmFzc2lnbihcbiAgICAgIHRoaXMuX21lZGlhdG9ycyxcbiAgICAgIHRoaXMuc2V0dGluZ3MubWVkaWF0b3JzLFxuICAgICAge1xuICAgICAgICBuYXZpZ2F0ZU1lZGlhdG9yOiBuZXcgTVZDLk1lZGlhdG9ycy5OYXZpZ2F0ZSgpLFxuICAgICAgfVxuICAgIClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGVNZWRpYXRvcnMoKSB7XG4gICAgZGVsZXRlIHRoaXMuX21lZGlhdG9ycy5uYXZpZ2F0ZU1lZGlhdG9yXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBkaXNhYmxlUm91dGVzKCkge1xuICAgIGRlbGV0ZSB0aGlzLl9yb3V0ZXNcbiAgICBkZWxldGUgdGhpcy5fY29udHJvbGxlclxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZW5hYmxlRXZlbnRzKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgdGhpcy5yb3V0ZUNoYW5nZS5iaW5kKHRoaXMpKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZGlzYWJsZUV2ZW50cygpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMucm91dGVDaGFuZ2UuYmluZCh0aGlzKSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHJvdXRlQ2hhbmdlKCkge1xuICAgIHRoaXMuX2N1cnJlbnRVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgIGxldCByb3V0ZURhdGEgPSB0aGlzLl9yb3V0ZURhdGFcbiAgICBpZihyb3V0ZURhdGEuY29udHJvbGxlcikge1xuICAgICAgbGV0IG5hdmlnYXRlTWVkaWF0b3IgPSB0aGlzLm1lZGlhdG9ycy5uYXZpZ2F0ZU1lZGlhdG9yXG4gICAgICBpZih0aGlzLnByZXZpb3VzVVJMKSByb3V0ZURhdGEucHJldmlvdXNVUkwgPSB0aGlzLnByZXZpb3VzVVJMXG4gICAgICBuYXZpZ2F0ZU1lZGlhdG9yXG4gICAgICAgIC51bnNldCgpXG4gICAgICAgIC5zZXQocm91dGVEYXRhKVxuICAgICAgdGhpcy5lbWl0KFxuICAgICAgICBuYXZpZ2F0ZU1lZGlhdG9yLm5hbWUsXG4gICAgICAgIG5hdmlnYXRlTWVkaWF0b3IuZW1pc3Npb24oKVxuICAgICAgKVxuICAgICAgcm91dGVEYXRhLmNvbnRyb2xsZXIuY2FsbGJhY2soXG4gICAgICAgIG5hdmlnYXRlTWVkaWF0b3IuZW1pc3Npb24oKVxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIG5hdmlnYXRlKHBhdGgpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGhcbiAgfVxufVxuIiwiTVZDLkNvbnN0YW50cy5FdmVudHMgPSB7fVxyXG5NVkMuQ09OU1QuRVYgPSBNVkMuQ29uc3RhbnRzLkV2ZW50c1xyXG4iLCJNVkMuQ29uc3RhbnRzLk9wZXJhdG9ycyA9IHt9XHJcbk1WQy5DT05TVC5PcGVyYXRvcnMgPSB7fVxyXG5NVkMuQ09OU1QuT3BlcmF0b3JzLkNvbXBhcmlzb24gPSB7XHJcbiAgRVE6ICdFUScsXHJcbiAgU1RFUTogJ1NURVEnLFxyXG4gIE5PRVE6ICdOT0VRJyxcclxuICBTVE5PRVE6ICdTVE5PRVEnLFxyXG4gIEdUOiAnR1QnLFxyXG4gIExUOiAnTFQnLFxyXG4gIEdURTogJ0dURScsXHJcbiAgTFRFOiAnTFRFJyxcclxufVxyXG5NVkMuQ09OU1QuT3BlcmF0b3JzLlN0YXRlbWVudCA9IHtcclxuICBBTkQ6ICdBTkQnLFxyXG4gIE9SOiAnT1InXHJcbn1cclxuY29uc29sZS5sb2coTVZDLkNPTlNUKVxyXG4iLCJNVkMuVXRpbHMuaXNBcnJheSA9IGZ1bmN0aW9uIGlzQXJyYXkob2JqZWN0KSB7IHJldHVybiBBcnJheS5pc0FycmF5KG9iamVjdCkgfVxyXG5NVkMuVXRpbHMuaXNPYmplY3QgPSBmdW5jdGlvbiBpc09iamVjdChvYmplY3QpIHtcclxuICByZXR1cm4gKFxyXG4gICAgIUFycmF5LmlzQXJyYXkob2JqZWN0KSAmJlxyXG4gICAgb2JqZWN0ICE9PSBudWxsXHJcbiAgKSA/IHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnXHJcbiAgICA6IGZhbHNlXHJcbn1cclxuTVZDLlV0aWxzLnR5cGVPZiA9IGZ1bmN0aW9uIHR5cGVPZih2YWx1ZSkge1xyXG4gIHJldHVybiAodHlwZW9mIHZhbHVlQSA9PT0gJ29iamVjdCcpXHJcbiAgICA/IChNVkMuVXRpbHMuaXNPYmplY3QodmFsdWVBKSlcclxuICAgICAgPyAnb2JqZWN0J1xyXG4gICAgICA6IChNVkMuVXRpbHMuaXNBcnJheSh2YWx1ZUEpKVxyXG4gICAgICAgID8gJ2FycmF5J1xyXG4gICAgICAgIDogKHZhbHVlQSA9PT0gbnVsbClcclxuICAgICAgICAgID8gJ251bGwnXHJcbiAgICAgICAgICA6IHVuZGVmaW5lZFxyXG4gICAgOiB0eXBlb2YgdmFsdWVcclxufVxyXG5NVkMuVXRpbHMuaXNIVE1MRWxlbWVudCA9IGZ1bmN0aW9uIGlzSFRNTEVsZW1lbnQob2JqZWN0KSB7XHJcbiAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XHJcbn1cclxuIiwiTVZDLlV0aWxzLnR5cGVPZiA9ICBmdW5jdGlvbiB0eXBlT2YoZGF0YSkge1xyXG4gIHN3aXRjaCh0eXBlb2YgZGF0YSkge1xyXG4gICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgbGV0IF9vYmplY3RcclxuICAgICAgaWYoTVZDLlV0aWxzLmlzQXJyYXkoZGF0YSkpIHtcclxuICAgICAgICAvLyBBcnJheVxyXG4gICAgICAgIHJldHVybiAnYXJyYXknXHJcbiAgICAgIH0gZWxzZSBpZihcclxuICAgICAgICBNVkMuVXRpbHMuaXNPYmplY3QoZGF0YSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgLy8gT2JqZWN0XHJcbiAgICAgICAgcmV0dXJuICdvYmplY3QnXHJcbiAgICAgIH0gZWxzZSBpZihcclxuICAgICAgICBkYXRhID09PSBudWxsXHJcbiAgICAgICkge1xyXG4gICAgICAgIC8vIE51bGxcclxuICAgICAgICByZXR1cm4gJ251bGwnXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIF9vYmplY3RcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICBjYXNlICdudW1iZXInOlxyXG4gICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICBjYXNlICd1bmRlZmluZWQnOlxyXG4gICAgY2FzZSAnZnVuY3Rpb24nOlxyXG4gICAgICByZXR1cm4gdHlwZW9mIGRhdGFcclxuICAgICAgYnJlYWtcclxuICB9XHJcbn1cclxuIiwiTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdCA9IGZ1bmN0aW9uIGFkZFByb3BlcnRpZXNUb09iamVjdCgpIHtcclxuICBsZXQgdGFyZ2V0T2JqZWN0XHJcbiAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgIGNhc2UgMjpcclxuICAgICAgbGV0IHByb3BlcnRpZXMgPSBhcmd1bWVudHNbMF1cclxuICAgICAgdGFyZ2V0T2JqZWN0ID0gYXJndW1lbnRzWzFdXHJcbiAgICAgIGZvcihsZXQgW3Byb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocHJvcGVydGllcykpIHtcclxuICAgICAgICB0YXJnZXRPYmplY3RbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5VmFsdWVcclxuICAgICAgfVxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAzOlxyXG4gICAgICBsZXQgcHJvcGVydHlOYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgIGxldCBwcm9wZXJ0eVZhbHVlID0gYXJndW1lbnRzWzFdXHJcbiAgICAgIHRhcmdldE9iamVjdCA9IGFyZ3VtZW50c1syXVxyXG4gICAgICB0YXJnZXRPYmplY3RbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5VmFsdWVcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgcmV0dXJuIHRhcmdldE9iamVjdFxyXG59XHJcbiIsIk1WQy5VdGlscy5vYmplY3RRdWVyeSA9IGZ1bmN0aW9uIG9iamVjdFF1ZXJ5KFxyXG4gIHN0cmluZyxcclxuICBjb250ZXh0XHJcbikge1xyXG4gIGxldCBzdHJpbmdEYXRhID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlTm90YXRpb24oc3RyaW5nKVxyXG4gIGlmKHN0cmluZ0RhdGFbMF0gPT09ICdAJykgc3RyaW5nRGF0YS5zcGxpY2UoMCwgMSlcclxuICBpZighc3RyaW5nRGF0YS5sZW5ndGgpIHJldHVybiBjb250ZXh0XHJcbiAgY29udGV4dCA9IChNVkMuVXRpbHMuaXNPYmplY3QoY29udGV4dCkpXHJcbiAgICA/IE9iamVjdC5lbnRyaWVzKGNvbnRleHQpXHJcbiAgICA6IGNvbnRleHRcclxuICByZXR1cm4gc3RyaW5nRGF0YS5yZWR1Y2UoKG9iamVjdCwgZnJhZ21lbnQsIGZyYWdtZW50SW5kZXgsIGZyYWdtZW50cykgPT4ge1xyXG4gICAgbGV0IHByb3BlcnRpZXMgPSBbXVxyXG4gICAgZnJhZ21lbnQgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VGcmFnbWVudChmcmFnbWVudClcclxuICAgIGZvcihsZXQgW3Byb3BlcnR5S2V5LCBwcm9wZXJ0eVZhbHVlXSBvZiBvYmplY3QpIHtcclxuICAgICAgaWYocHJvcGVydHlLZXkubWF0Y2goZnJhZ21lbnQpKSB7XHJcbiAgICAgICAgaWYoZnJhZ21lbnRJbmRleCA9PT0gZnJhZ21lbnRzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzLmNvbmNhdChbW3Byb3BlcnR5S2V5LCBwcm9wZXJ0eVZhbHVlXV0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzLmNvbmNhdChPYmplY3QuZW50cmllcyhwcm9wZXJ0eVZhbHVlKSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIG9iamVjdCA9IHByb3BlcnRpZXNcclxuICAgIHJldHVybiBvYmplY3RcclxuICB9LCBjb250ZXh0KVxyXG59XHJcbk1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZU5vdGF0aW9uID0gZnVuY3Rpb24gcGFyc2VOb3RhdGlvbihzdHJpbmcpIHtcclxuICBpZihcclxuICAgIHN0cmluZy5jaGFyQXQoMCkgPT09ICdbJyAmJlxyXG4gICAgc3RyaW5nLmNoYXJBdChzdHJpbmcubGVuZ3RoIC0gMSkgPT0gJ10nXHJcbiAgKSB7XHJcbiAgICBzdHJpbmcgPSBzdHJpbmdcclxuICAgICAgLnNsaWNlKDEsIC0xKVxyXG4gICAgICAuc3BsaXQoJ11bJylcclxuICB9IGVsc2Uge1xyXG4gICAgc3RyaW5nID0gc3RyaW5nXHJcbiAgICAgIC5zcGxpdCgnLicpXHJcbiAgfVxyXG4gIHJldHVybiBzdHJpbmdcclxufVxyXG5NVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VGcmFnbWVudCA9IGZ1bmN0aW9uIHBhcnNlRnJhZ21lbnQoZnJhZ21lbnQpIHtcclxuICBpZihcclxuICAgIGZyYWdtZW50LmNoYXJBdCgwKSA9PT0gJy8nICYmXHJcbiAgICBmcmFnbWVudC5jaGFyQXQoZnJhZ21lbnQubGVuZ3RoIC0gMSkgPT0gJy8nXHJcbiAgKSB7XHJcbiAgICBmcmFnbWVudCA9IGZyYWdtZW50LnNsaWNlKDEsIC0xKVxyXG4gICAgZnJhZ21lbnQgPSBuZXcgUmVnRXhwKCdeJy5jb25jYXQoZnJhZ21lbnQsICckJykpXHJcbiAgfVxyXG4gIHJldHVybiBmcmFnbWVudFxyXG59XHJcbiIsIk1WQy5VdGlscy5wYXJhbXNUb09iamVjdCA9IGZ1bmN0aW9uIHBhcmFtc1RvT2JqZWN0KHBhcmFtcykge1xyXG4gICAgdmFyIHBhcmFtcyA9IHBhcmFtcy5zcGxpdCgnJicpXHJcbiAgICB2YXIgb2JqZWN0ID0ge31cclxuICAgIHBhcmFtcy5mb3JFYWNoKChwYXJhbURhdGEpID0+IHtcclxuICAgICAgcGFyYW1EYXRhID0gcGFyYW1EYXRhLnNwbGl0KCc9JylcclxuICAgICAgb2JqZWN0W3BhcmFtRGF0YVswXV0gPSBkZWNvZGVVUklDb21wb25lbnQocGFyYW1EYXRhWzFdIHx8ICcnKVxyXG4gICAgfSlcclxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iamVjdCkpXHJcbn1cclxuIiwiTVZDLlV0aWxzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMgPSBmdW5jdGlvbiB0b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKFxyXG4gIHRvZ2dsZU1ldGhvZCxcclxuICBldmVudHMsXHJcbiAgdGFyZ2V0T2JqZWN0cyxcclxuICBjYWxsYmFja3NcclxuKSB7XHJcbiAgZm9yKGxldCBbZXZlbnRTZXR0aW5ncywgZXZlbnRDYWxsYmFja05hbWVdIG9mIE9iamVjdC5lbnRyaWVzKGV2ZW50cykpIHtcclxuICAgIGxldCBldmVudERhdGEgPSBldmVudFNldHRpbmdzLnNwbGl0KCcgJylcclxuICAgIGxldCBldmVudFRhcmdldFNldHRpbmdzID0gZXZlbnREYXRhWzBdXHJcbiAgICBsZXQgZXZlbnROYW1lID0gZXZlbnREYXRhWzFdXHJcbiAgICBsZXQgZXZlbnRUYXJnZXRzID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5KFxyXG4gICAgICBldmVudFRhcmdldFNldHRpbmdzLFxyXG4gICAgICB0YXJnZXRPYmplY3RzXHJcbiAgICApXHJcbiAgICBldmVudFRhcmdldHMgPSAoIU1WQy5VdGlscy5pc0FycmF5KGV2ZW50VGFyZ2V0cykpXHJcbiAgICAgID8gW1snQCcsIGV2ZW50VGFyZ2V0c11dXHJcbiAgICAgIDogZXZlbnRUYXJnZXRzXHJcbiAgICBmb3IobGV0IFtldmVudFRhcmdldE5hbWUsIGV2ZW50VGFyZ2V0XSBvZiBldmVudFRhcmdldHMpIHtcclxuICAgICAgbGV0IGV2ZW50TWV0aG9kTmFtZSA9ICh0b2dnbGVNZXRob2QgPT09ICdvbicpXHJcbiAgICAgID8gKFxyXG4gICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QgfHxcclxuICAgICAgICAoXHJcbiAgICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XHJcbiAgICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIERvY3VtZW50XHJcbiAgICAgICAgKVxyXG4gICAgICApID8gJ2FkZEV2ZW50TGlzdGVuZXInXHJcbiAgICAgICAgOiAnb24nXHJcbiAgICAgIDogKFxyXG4gICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QgfHxcclxuICAgICAgICAoXHJcbiAgICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XHJcbiAgICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIERvY3VtZW50XHJcbiAgICAgICAgKVxyXG4gICAgICApID8gJ3JlbW92ZUV2ZW50TGlzdGVuZXInXHJcbiAgICAgICAgOiAnb2ZmJ1xyXG4gICAgICBsZXQgZXZlbnRDYWxsYmFjayA9IE1WQy5VdGlscy5vYmplY3RRdWVyeShcclxuICAgICAgICBldmVudENhbGxiYWNrTmFtZSxcclxuICAgICAgICBjYWxsYmFja3NcclxuICAgICAgKVswXVsxXVxyXG4gICAgICBpZihldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XHJcbiAgICAgICAgZm9yKGxldCBfZXZlbnRUYXJnZXQgb2YgZXZlbnRUYXJnZXQpIHtcclxuICAgICAgICAgIF9ldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZihldmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMgPSBmdW5jdGlvbiBiaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKCkge1xyXG4gIHRoaXMudG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cygnb24nLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzID0gZnVuY3Rpb24gdW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMoKSB7XHJcbiAgdGhpcy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKCdvZmYnLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuIiwiTVZDLk1lZGlhdG9ycy5OYXZpZ2F0ZSA9IGNsYXNzIGV4dGVuZHMgTVZDLk1lZGlhdG9yIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICAgIHRoaXMuYWRkU2V0dGluZ3MoKVxyXG4gICAgdGhpcy5lbmFibGUoKVxyXG4gIH1cclxuICBhZGRTZXR0aW5ncygpIHtcclxuICAgIHRoaXMuX25hbWUgPSAnbmF2aWdhdGUnXHJcbiAgICB0aGlzLl9zY2hlbWEgPSB7XHJcbiAgICAgIG9sZFVSTDoge1xyXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICB9LFxyXG4gICAgICBuZXdVUkw6IHtcclxuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgfSxcclxuICAgICAgY3VycmVudFJvdXRlOiB7XHJcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgIH0sXHJcbiAgICAgIGN1cnJlbnRDb250cm9sbGVyOiB7XHJcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgIH0sXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIk1WQy5NZWRpYXRvcnMuVmFsaWRhdGUgPSBjbGFzcyBleHRlbmRzIE1WQy5NZWRpYXRvciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgICB0aGlzLmFkZFNldHRpbmdzKClcclxuICAgIHRoaXMuZW5hYmxlKClcclxuICB9XHJcbiAgYWRkU2V0dGluZ3MoKSB7XHJcbiAgICB0aGlzLl9uYW1lID0gJ3ZhbGlkYXRlJ1xyXG4gICAgdGhpcy5fc2NoZW1hID0ge1xyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXHJcbiAgICAgIH0sXHJcbiAgICAgIHJlc3VsdHM6IHtcclxuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcclxuICAgICAgfSxcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19
