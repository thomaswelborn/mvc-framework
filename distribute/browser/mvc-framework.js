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
MVC.Utils.uid = function () {
  var uuid = '',
      ii;

  for (ii = 0; ii < 32; ii += 1) {
    switch (ii) {
      case 8:
      case 20:
        uuid += '-';
        uuid += (Math.random() * 16 | 0).toString(16);
        break;

      case 12:
        uuid += '-';
        uuid += '4';
        break;

      case 16:
        uuid += '-';
        uuid += (Math.random() * 4 | 8).toString(16);
        break;

      default:
        uuid += (Math.random() * 16 | 0).toString(16);
    }
  }

  return uuid;
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

  request(responseName) {
    if (this._responses[responseName]) {
      var _arguments = Array.prototype.slice.call(arguments).slice(1);

      return this._responses[responseName](..._arguments);
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
    return this;
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
    });
    var typeOfValue = MVC.Utils.typeOf(value);
    var schemaType;

    if (MVC.Utils.typeOf(schemaSettings) === 'object') {
      schemaType = schemaSettings.type;

      if (schemaSettings.messages) {
        messages.pass = schemaSettings.messages.pass ? schemaSettings.messages.pass : messages.pass;
        messages.fail = schemaSettings.messages.fail ? schemaSettings.messages.fail : messages.fail;
      }
    } else {
      schemaType = schemaSettings;
    }

    if (MVC.Utils.typeOf(schemaType) === 'array') {
      schemaType = schemaType[schemaType.indexOf(typeOfValue)];
    }

    validationSummary.comparator = schemaType;
    validationSummary.value = typeOfValue;
    validationSummary.result = typeOfValue === schemaType;
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
    return this;
  }

  get uid() {
    this._uid = this._uid ? this._uid : MVC.Utils.uid();
    return this._uid;
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
        return this._data;
        break;

      case 1:
        var key = arguments[0];
        return this._data[key];
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

      this._validator.validate(this.parse());

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
                  data: context._data
                }, context);
              } else {
                context.emit(setEventName, {
                  name: setEventName,
                  data: Object.assign({}, context._changing, context._data)
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

      if (settings.schema) {
        this._validator = settings.schema;
      }

      if (settings.localStorage) this._localStorage = settings.localStorage;
      if (settings.histiogram) this._histiogram = settings.histiogram;
      if (settings.services) this._services = settings.services;
      if (settings.serviceCallbacks) this._serviceCallbacks = settings.serviceCallbacks;
      if (settings.serviceEvents) this._serviceEvents = settings.serviceEvents;
      if (settings.data) this.set(settings.data);
      if (settings.dataCallbacks) this._dataCallbacks = settings.dataCallbacks;
      if (settings.dataEvents) this._dataEvents = settings.dataEvents;
      if (settings.defaults) this._defaults = settings.defaults;

      if (this.services && this.serviceEvents && this.serviceCallbacks) {
        this.enableServiceEvents();
      }

      if (this.dataEvents && this.dataCallbacks) {
        this.enableDataEvents();
      }
    }

    this._enabled = true;
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
      this.disableMediators();
    }

    this._enabled = false;
    return this;
  }

  parse(data) {
    data = data || this._data || {};
    return JSON.parse(JSON.stringify(data));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwiRXZlbnRzLmpzIiwiT3BlcmF0b3JzLmpzIiwiaXMuanMiLCJ1aWQuanMiLCJ0eXBlT2YuanMiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QuanMiLCJvYmplY3RRdWVyeS5qcyIsInBhcmFtc1RvT2JqZWN0LmpzIiwidG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cy5qcyIsIk5hdmlnYXRlLmpzIiwiVmFsaWRhdGUuanMiXSwibmFtZXMiOlsiTVZDIiwiQ29uc3RhbnRzIiwiQ09OU1QiLCJFdmVudHMiLCJFViIsIk9wZXJhdG9ycyIsIkNvbXBhcmlzb24iLCJFUSIsIlNURVEiLCJOT0VRIiwiU1ROT0VRIiwiR1QiLCJMVCIsIkdURSIsIkxURSIsIlN0YXRlbWVudCIsIkFORCIsIk9SIiwiVXRpbHMiLCJpc0FycmF5Iiwib2JqZWN0IiwiQXJyYXkiLCJpc09iamVjdCIsInR5cGVPZiIsInZhbHVlIiwidmFsdWVBIiwidW5kZWZpbmVkIiwiaXNIVE1MRWxlbWVudCIsIkhUTUxFbGVtZW50IiwidWlkIiwidXVpZCIsImlpIiwiTWF0aCIsInJhbmRvbSIsInRvU3RyaW5nIiwiZGF0YSIsIl9vYmplY3QiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QiLCJ0YXJnZXRPYmplY3QiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJwcm9wZXJ0aWVzIiwicHJvcGVydHlOYW1lIiwicHJvcGVydHlWYWx1ZSIsIk9iamVjdCIsImVudHJpZXMiLCJvYmplY3RRdWVyeSIsInN0cmluZyIsImNvbnRleHQiLCJzdHJpbmdEYXRhIiwicGFyc2VOb3RhdGlvbiIsInNwbGljZSIsInJlZHVjZSIsImZyYWdtZW50IiwiZnJhZ21lbnRJbmRleCIsImZyYWdtZW50cyIsInBhcnNlRnJhZ21lbnQiLCJwcm9wZXJ0eUtleSIsIm1hdGNoIiwiY29uY2F0IiwiY2hhckF0Iiwic2xpY2UiLCJzcGxpdCIsIlJlZ0V4cCIsInBhcmFtc1RvT2JqZWN0IiwicGFyYW1zIiwiZm9yRWFjaCIsInBhcmFtRGF0YSIsImRlY29kZVVSSUNvbXBvbmVudCIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMiLCJ0b2dnbGVNZXRob2QiLCJldmVudHMiLCJ0YXJnZXRPYmplY3RzIiwiY2FsbGJhY2tzIiwiZXZlbnRTZXR0aW5ncyIsImV2ZW50Q2FsbGJhY2tOYW1lIiwiZXZlbnREYXRhIiwiZXZlbnRUYXJnZXRTZXR0aW5ncyIsImV2ZW50TmFtZSIsImV2ZW50VGFyZ2V0cyIsImV2ZW50VGFyZ2V0TmFtZSIsImV2ZW50VGFyZ2V0IiwiZXZlbnRNZXRob2ROYW1lIiwiTm9kZUxpc3QiLCJEb2N1bWVudCIsImV2ZW50Q2FsbGJhY2siLCJfZXZlbnRUYXJnZXQiLCJiaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzIiwidW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMiLCJjb25zdHJ1Y3RvciIsIl9ldmVudHMiLCJnZXRFdmVudENhbGxiYWNrcyIsImdldEV2ZW50Q2FsbGJhY2tOYW1lIiwibmFtZSIsImdldEV2ZW50Q2FsbGJhY2tHcm91cCIsImV2ZW50Q2FsbGJhY2tzIiwib24iLCJldmVudENhbGxiYWNrR3JvdXAiLCJwdXNoIiwib2ZmIiwia2V5cyIsImVtaXQiLCJfYXJndW1lbnRzIiwidmFsdWVzIiwiZXZlbnRDYWxsYmFja0dyb3VwTmFtZSIsImFkZGl0aW9uYWxBcmd1bWVudHMiLCJDaGFubmVscyIsIl9jaGFubmVscyIsImNoYW5uZWxzIiwiY2hhbm5lbCIsImNoYW5uZWxOYW1lIiwiQ2hhbm5lbCIsIl9yZXNwb25zZXMiLCJyZXNwb25zZXMiLCJyZXNwb25zZSIsInJlc3BvbnNlTmFtZSIsInJlc3BvbnNlQ2FsbGJhY2siLCJyZXF1ZXN0IiwicHJvdG90eXBlIiwiY2FsbCIsIkJhc2UiLCJzZXR0aW5ncyIsImNvbmZpZ3VyYXRpb24iLCJfY29uZmlndXJhdGlvbiIsIl9zZXR0aW5ncyIsIl9tZWRpYXRvcnMiLCJtZWRpYXRvcnMiLCJTZXJ2aWNlIiwiX2RlZmF1bHRzIiwiZGVmYXVsdHMiLCJjb250ZW50VHlwZSIsInJlc3BvbnNlVHlwZSIsIl9yZXNwb25zZVR5cGVzIiwiX3Jlc3BvbnNlVHlwZSIsIl94aHIiLCJmaW5kIiwicmVzcG9uc2VUeXBlSXRlbSIsIl90eXBlIiwidHlwZSIsIl91cmwiLCJ1cmwiLCJfaGVhZGVycyIsImhlYWRlcnMiLCJoZWFkZXIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwiX2RhdGEiLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIl9lbmFibGVkIiwiZW5hYmxlZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3RhdHVzIiwiYWJvcnQiLCJvcGVuIiwib25sb2FkIiwib25lcnJvciIsInNlbmQiLCJ0aGVuIiwiY3VycmVudFRhcmdldCIsImNhdGNoIiwiZXJyb3IiLCJlbmFibGUiLCJkaXNhYmxlIiwiVmFsaWRhdG9yIiwic2NoZW1hIiwiX3NjaGVtYSIsIl9yZXN1bHRzIiwicmVzdWx0cyIsInZhbGlkYXRlIiwidmFsaWRhdGlvblN1bW1hcnkiLCJzY2hlbWFLZXkiLCJzY2hlbWFTZXR0aW5ncyIsInZhbGlkYXRpb24iLCJrZXkiLCJyZXF1aXJlZCIsImV2YWx1YXRpb25zIiwidmFsaWRhdGlvbkV2YWx1YXRpb25zIiwiZXZhbHVhdGlvblJlc3VsdHMiLCJtZXNzYWdlcyIsImFzc2lnbiIsInBhc3MiLCJmYWlsIiwiY29tcGFyYXRvciIsInJlc3VsdCIsIm1lc3NhZ2UiLCJ0eXBlT2ZWYWx1ZSIsInNjaGVtYVR5cGUiLCJpbmRleE9mIiwiX2V2YWx1YXRpb25zIiwiZXZhbHVhdGlvbiIsImV2YWx1YXRpb25JbmRleCIsIl92YWx1ZSIsInZhbHVlQ29tcGFyaXNvbiIsImNvbXBhcmVWYWx1ZXMiLCJjb21wYXJpc29uIiwiY3VycmVudEV2YWx1YXRpb24iLCJzdGF0ZW1lbnQiLCJwcmV2aW91c0V2YWx1YXRpb24iLCJwcmV2aW91c0V2YWx1YXRpb25Db21wYXJpc29uVmFsdWUiLCJzdGF0ZW1lbnRDb21wYXJpc29uIiwiY29tcGFyZVN0YXRlbWVudHMiLCJldmFsdWF0aW9uVmFsaWRhdGlvbiIsIm9wZXJhdG9yIiwiZXZhbHVhdGlvblJlc3VsdCIsIk1vZGVsIiwiX3VpZCIsIl92YWxpZGF0b3IiLCJ2YWxpZGF0b3IiLCJfaXNTZXR0aW5nIiwiaXNTZXR0aW5nIiwiX2NoYW5naW5nIiwiY2hhbmdpbmciLCJfbG9jYWxTdG9yYWdlIiwibG9jYWxTdG9yYWdlIiwiX2hpc3Rpb2dyYW0iLCJoaXN0aW9ncmFtIiwiX2hpc3RvcnkiLCJoaXN0b3J5IiwidW5zaGlmdCIsIl9kYiIsImRiIiwiZ2V0SXRlbSIsImVuZHBvaW50Iiwic2V0SXRlbSIsIl9kYXRhRXZlbnRzIiwiZGF0YUV2ZW50cyIsIl9kYXRhQ2FsbGJhY2tzIiwiZGF0YUNhbGxiYWNrcyIsIl9zZXJ2aWNlcyIsInNlcnZpY2VzIiwiX3NlcnZpY2VFdmVudHMiLCJzZXJ2aWNlRXZlbnRzIiwiX3NlcnZpY2VDYWxsYmFja3MiLCJzZXJ2aWNlQ2FsbGJhY2tzIiwiZ2V0Iiwic2V0IiwiaW5kZXgiLCJzZXREYXRhUHJvcGVydHkiLCJ2YWxpZGF0ZU1lZGlhdG9yIiwiZW1pc3Npb24iLCJ1bnNldCIsInVuc2V0RGF0YVByb3BlcnR5Iiwic2V0REIiLCJ1bnNldERCIiwiZGVmaW5lUHJvcGVydGllcyIsImNvbmZpZ3VyYWJsZSIsIkJvb2xlYW4iLCJzZXRWYWx1ZUV2ZW50TmFtZSIsImpvaW4iLCJzZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlRXZlbnROYW1lIiwidW5zZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlIiwic2V0RGVmYXVsdHMiLCJlbmFibGVTZXJ2aWNlRXZlbnRzIiwiZGlzYWJsZVNlcnZpY2VFdmVudHMiLCJlbmFibGVEYXRhRXZlbnRzIiwiZGlzYWJsZURhdGFFdmVudHMiLCJlbmFibGVNZWRpYXRvcnMiLCJNZWRpYXRvcnMiLCJWYWxpZGF0ZSIsImRpc2FibGVNZWRpYXRvcnMiLCJNZWRpYXRvciIsIl9uYW1lIiwiTmF2aWdhdGUiLCJhZGRTZXR0aW5ncyIsIm9sZFVSTCIsIm5ld1VSTCIsImN1cnJlbnRSb3V0ZSIsImN1cnJlbnRDb250cm9sbGVyIiwiVmlldyIsIl9lbGVtZW50TmFtZSIsIl9lbGVtZW50IiwidGFnTmFtZSIsImVsZW1lbnROYW1lIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJlbGVtZW50T2JzZXJ2ZXIiLCJvYnNlcnZlIiwic3VidHJlZSIsImNoaWxkTGlzdCIsIl9hdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZUtleSIsImF0dHJpYnV0ZVZhbHVlIiwicmVtb3ZlQXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwiX3VpIiwidWkiLCJ1aUtleSIsInVpVmFsdWUiLCJxdWVyeVNlbGVjdG9yQWxsIiwiX3VpRXZlbnRzIiwidWlFdmVudHMiLCJfdWlDYWxsYmFja3MiLCJ1aUNhbGxiYWNrcyIsIl9vYnNlcnZlckNhbGxiYWNrcyIsIm9ic2VydmVyQ2FsbGJhY2tzIiwiX2VsZW1lbnRPYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJlbGVtZW50T2JzZXJ2ZSIsImJpbmQiLCJfaW5zZXJ0IiwiaW5zZXJ0IiwiX3RlbXBsYXRlcyIsInRlbXBsYXRlcyIsIm11dGF0aW9uUmVjb3JkTGlzdCIsIm9ic2VydmVyIiwibXV0YXRpb25SZWNvcmRJbmRleCIsIm11dGF0aW9uUmVjb3JkIiwibXV0YXRpb25SZWNvcmRDYXRlZ29yaWVzIiwibXV0YXRpb25SZWNvcmRDYXRlZ29yeSIsInJlc2V0VUkiLCJhdXRvSW5zZXJ0IiwicGFyZW50RWxlbWVudCIsIk5vZGUiLCJpbnNlcnRBZGphY2VudEVsZW1lbnQiLCJtZXRob2QiLCJfcGFyZW50RWxlbWVudCIsImF1dG9SZW1vdmUiLCJyZW1vdmVDaGlsZCIsImVuYWJsZUVsZW1lbnQiLCJkaXNhYmxlRWxlbWVudCIsImRpc2FibGVVSSIsImVuYWJsZVVJIiwiZW5hYmxlVUlFdmVudHMiLCJkaXNhYmxlVUlFdmVudHMiLCJlbmFibGVSZW5kZXJlcnMiLCJyZW5kZXJlck5hbWUiLCJyZW5kZXJlckZ1bmN0aW9uIiwiZGlzYWJsZVJlbmRlcmVycyIsIkNvbnRyb2xsZXIiLCJfbWVkaWF0b3JDYWxsYmFja3MiLCJtZWRpYXRvckNhbGxiYWNrcyIsIl9tb2RlbENhbGxiYWNrcyIsIm1vZGVsQ2FsbGJhY2tzIiwiX3ZpZXdDYWxsYmFja3MiLCJ2aWV3Q2FsbGJhY2tzIiwiX2NvbnRyb2xsZXJDYWxsYmFja3MiLCJjb250cm9sbGVyQ2FsbGJhY2tzIiwiX21vZGVscyIsIm1vZGVscyIsIl92aWV3cyIsInZpZXdzIiwiX2NvbnRyb2xsZXJzIiwiY29udHJvbGxlcnMiLCJfcm91dGVycyIsInJvdXRlcnMiLCJfcm91dGVyRXZlbnRzIiwicm91dGVyRXZlbnRzIiwiX3JvdXRlckNhbGxiYWNrcyIsInJvdXRlckNhbGxiYWNrcyIsIl9tZWRpYXRvckV2ZW50cyIsIm1lZGlhdG9yRXZlbnRzIiwiX21vZGVsRXZlbnRzIiwibW9kZWxFdmVudHMiLCJfdmlld0V2ZW50cyIsInZpZXdFdmVudHMiLCJfY29udHJvbGxlckV2ZW50cyIsImNvbnRyb2xsZXJFdmVudHMiLCJlbmFibGVNb2RlbEV2ZW50cyIsImRpc2FibGVNb2RlbEV2ZW50cyIsImVuYWJsZVZpZXdFdmVudHMiLCJkaXNhYmxlVmlld0V2ZW50cyIsImVuYWJsZUNvbnRyb2xsZXJFdmVudHMiLCJkaXNhYmxlQ29udHJvbGxlckV2ZW50cyIsImVuYWJsZU1lZGlhdG9yRXZlbnRzIiwiZGlzYWJsZU1lZGlhdG9yRXZlbnRzIiwiZW5hYmxlUm91dGVyRXZlbnRzIiwiZGlzYWJsZVJvdXRlckV2ZW50cyIsInJlc2V0IiwiUm91dGVyIiwicHJvdG9jb2wiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhvc3RuYW1lIiwicG9ydCIsInBhdGgiLCJwYXRobmFtZSIsImhhc2giLCJocmVmIiwiaGFzaEluZGV4IiwicGFyYW1JbmRleCIsInNsaWNlU3RhcnQiLCJzbGljZVN0b3AiLCJfcm91dGVEYXRhIiwicm91dGVEYXRhIiwiY29udHJvbGxlciIsImZpbHRlciIsImhhc2hGcmFnbWVudHMiLCJjdXJyZW50VVJMIiwicm91dGVDb250cm9sbGVyRGF0YSIsIl9yb3V0ZUNvbnRyb2xsZXJEYXRhIiwicm91dGVzIiwicm91dGVQYXRoIiwicm91dGVTZXR0aW5ncyIsInBhdGhGcmFnbWVudHMiLCJyb3V0ZUZyYWdtZW50cyIsInJvdXRlRnJhZ21lbnQiLCJyb3V0ZUZyYWdtZW50SW5kZXgiLCJjdXJyZW50SURLZXkiLCJyZXBsYWNlIiwiZnJhZ21lbnRJRFJlZ0V4cCIsInJvdXRlRnJhZ21lbnROYW1lUmVnRXhwIiwidGVzdCIsInJvdXRlIiwiX3JvdXRlcyIsIl9jb250cm9sbGVyIiwiX3ByZXZpb3VzVVJMIiwicHJldmlvdXNVUkwiLCJfY3VycmVudFVSTCIsImVuYWJsZUV2ZW50cyIsImVuYWJsZVJvdXRlcyIsImRpc2FibGVFdmVudHMiLCJkaXNhYmxlUm91dGVzIiwicm91dGVJbmRleCIsIm9yaWdpbmFsUm91dGVzIiwiY2FsbGJhY2siLCJuYXZpZ2F0ZU1lZGlhdG9yIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJvdXRlQ2hhbmdlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm5hdmlnYXRlIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxHQUFHLEdBQUdBLEdBQUcsSUFBSSxFQUFqQjtBQUFBQSxHQUFHLENBQUNDLFNBQUosR0FBZ0IsRUFBaEI7QUFDQUQsR0FBRyxDQUFDRSxLQUFKLEdBQVlGLEdBQUcsQ0FBQ0MsU0FBaEI7QUNEQUQsR0FBRyxDQUFDQyxTQUFKLENBQWNFLE1BQWQsR0FBdUIsRUFBdkI7QUFDQUgsR0FBRyxDQUFDRSxLQUFKLENBQVVFLEVBQVYsR0FBZUosR0FBRyxDQUFDQyxTQUFKLENBQWNFLE1BQTdCO0FDREFILEdBQUcsQ0FBQ0MsU0FBSixDQUFjSSxTQUFkLEdBQTBCLEVBQTFCO0FBQ0FMLEdBQUcsQ0FBQ0UsS0FBSixDQUFVRyxTQUFWLEdBQXNCLEVBQXRCO0FBQ0FMLEdBQUcsQ0FB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ckI7O0FBQ0EsUUFBR0MsU0FBUyxDQUFDQyxVQUFiLEVBQXlCO0FBQ3ZCLFVBQUkrQixnQkFBZ0IsR0FBRyxLQUFLeFMsU0FBTCxDQUFld1MsZ0JBQXRDO0FBQ0EsVUFBRyxLQUFLVCxXQUFSLEVBQXFCdkIsU0FBUyxDQUFDdUIsV0FBVixHQUF3QixLQUFLQSxXQUE3QjtBQUNyQlMsTUFBQUEsZ0JBQWdCLENBQ2JwTCxLQURILEdBRUdMLEdBRkgsQ0FFT3lKLFNBRlA7QUFHQSxXQUFLalMsSUFBTCxDQUNFaVUsZ0JBQWdCLENBQUN6VSxJQURuQixFQUVFeVUsZ0JBQWdCLENBQUNyTCxRQUFqQixFQUZGO0FBSUFxSixNQUFBQSxTQUFTLENBQUNDLFVBQVYsQ0FBcUI4QixRQUFyQixDQUNFQyxnQkFBZ0IsQ0FBQ3JMLFFBQWpCLEVBREY7QUFHRDs7QUFDRCxXQUFPLElBQVA7QUFDRDs7QUFDRHlMLEVBQUFBLFFBQVEsQ0FBQzdDLElBQUQsRUFBTztBQUNiSixJQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JNLElBQWhCLEdBQXVCSCxJQUF2QjtBQUNEOztBQTdSaUMsQ0FBcEMiLCJmaWxlIjoiYnJvd3Nlci9tdmMtZnJhbWV3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiTVZDLlJvdXRlciA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBnZXQgcHJvdG9jb2woKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgfVxuICBnZXQgaG9zdG5hbWUoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgfVxuICBnZXQgcG9ydCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wb3J0IH1cbiAgZ2V0IHBhdGgoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgfVxuICBnZXQgaGFzaCgpIHtcbiAgICBsZXQgaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgbGV0IGhhc2hJbmRleCA9IGhyZWYuaW5kZXhPZignIycpXG4gICAgaWYoaGFzaEluZGV4ID4gLTEpIHtcbiAgICAgIGxldCBwYXJhbUluZGV4ID0gaHJlZi5pbmRleE9mKCc/JylcbiAgICAgIGxldCBzbGljZVN0YXJ0ID0gaGFzaEluZGV4ICsgMVxuICAgICAgbGV0IHNsaWNlU3RvcFxuICAgICAgaWYocGFyYW1JbmRleCA+IC0xKSB7XG4gICAgICAgIHNsaWNlU3RvcCA9IChoYXNoSW5kZXggPiBwYXJhbUluZGV4KVxuICAgICAgICAgID8gaHJlZi5sZW5ndGhcbiAgICAgICAgICA6IHBhcmFtSW5kZXhcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNsaWNlU3RvcCA9IGhyZWYubGVuZ3RoXG4gICAgICB9XG4gICAgICBocmVmID0gaHJlZi5zbGljZShzbGljZVN0YXJ0LCBzbGljZVN0b3ApXG4gICAgICBpZihocmVmLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gaHJlZlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbiAgZ2V0IHBhcmFtcygpIHtcbiAgICBsZXQgaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgbGV0IHBhcmFtSW5kZXggPSBocmVmLmluZGV4T2YoJz8nKVxuICAgIGlmKHBhcmFtSW5kZXggPiAtMSkge1xuICAgICAgbGV0IGhhc2hJbmRleCA9IGhyZWYuaW5kZXhPZignIycpXG4gICAgICBsZXQgc2xpY2VTdGFydCA9IHBhcmFtSW5kZXggKyAxXG4gICAgICBsZXQgc2xpY2VTdG9wXG4gICAgICBpZihoYXNoSW5kZXggPiAtMSkge1xuICAgICAgICBzbGljZVN0b3AgPSAocGFyYW1JbmRleCA+IGhhc2hJbmRleClcbiAgICAgICAgICA/IGhyZWYubGVuZ3RoXG4gICAgICAgICAgOiBoYXNoSW5kZXhcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNsaWNlU3RvcCA9IGhyZWYubGVuZ3RoXG4gICAgICB9XG4gICAgICBocmVmID0gaHJlZi5zbGljZShzbGljZVN0YXJ0LCBzbGljZVN0b3ApXG4gICAgICBpZihocmVmLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gaHJlZlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbiAgZ2V0IF9yb3V0ZURhdGEoKSB7XG4gICAgbGV0IHJvdXRlRGF0YSA9IHtcbiAgICAgIGxvY2F0aW9uOiB7fSxcbiAgICAgIGNvbnRyb2xsZXI6IHt9LFxuICAgIH1cbiAgICBsZXQgcGF0aCA9IHRoaXMucGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICBwYXRoID0gKHBhdGgubGVuZ3RoKVxuICAgICAgPyBwYXRoXG4gICAgICA6IFsnLyddXG4gICAgbGV0IGhhc2ggPSB0aGlzLmhhc2hcbiAgICBsZXQgaGFzaEZyYWdtZW50cyA9IChoYXNoKVxuICAgICAgPyBoYXNoLnNwbGl0KCcvJykuZmlsdGVyKChmcmFnbWVudCkgPT4gZnJhZ21lbnQubGVuZ3RoKVxuICAgICAgOiBudWxsXG4gICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zXG4gICAgbGV0IHBhcmFtRGF0YSA9IChwYXJhbXMpXG4gICAgICA/IE1WQy5VdGlscy5wYXJhbXNUb09iamVjdChwYXJhbXMpXG4gICAgICA6IG51bGxcbiAgICBpZih0aGlzLnByb3RvY29sKSByb3V0ZURhdGEubG9jYXRpb24ucHJvdG9jb2wgPSB0aGlzLnByb3RvY29sXG4gICAgaWYodGhpcy5ob3N0bmFtZSkgcm91dGVEYXRhLmxvY2F0aW9uLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZVxuICAgIGlmKHRoaXMucG9ydCkgcm91dGVEYXRhLmxvY2F0aW9uLnBvcnQgPSB0aGlzLnBvcnRcbiAgICBpZih0aGlzLnBhdGgpIHJvdXRlRGF0YS5sb2NhdGlvbi5wYXRoID0gdGhpcy5wYXRoXG4gICAgaWYoXG4gICAgICBoYXNoICYmXG4gICAgICBoYXNoRnJhZ21lbnRzXG4gICAgKSB7XG4gICAgICBoYXNoRnJhZ21lbnRzID0gKGhhc2hGcmFnbWVudHMubGVuZ3RoKVxuICAgICAgPyBoYXNoRnJhZ21lbnRzXG4gICAgICA6IFsnLyddXG4gICAgICByb3V0ZURhdGEubG9jYXRpb24uaGFzaCA9IHtcbiAgICAgICAgcGF0aDogaGFzaCxcbiAgICAgICAgZnJhZ21lbnRzOiBoYXNoRnJhZ21lbnRzLFxuICAgICAgfVxuICAgIH1cbiAgICBpZihcbiAgICAgIHBhcmFtcyAmJlxuICAgICAgcGFyYW1EYXRhXG4gICAgKSB7XG4gICAgICByb3V0ZURhdGEubG9jYXRpb24ucGFyYW1zID0ge1xuICAgICAgICBwYXRoOiBwYXJhbXMsXG4gICAgICAgIGRhdGE6IHBhcmFtRGF0YSxcbiAgICAgIH1cbiAgICB9XG4gICAgcm91dGVEYXRhLmxvY2F0aW9uLnBhdGggPSB7XG4gICAgICBuYW1lOiB0aGlzLnBhdGgsXG4gICAgICBmcmFnbWVudHM6IHBhdGgsXG4gICAgfVxuICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5jdXJyZW50VVJMID0gdGhpcy5jdXJyZW50VVJMXG4gICAgbGV0IHJvdXRlQ29udHJvbGxlckRhdGEgPSB0aGlzLl9yb3V0ZUNvbnRyb2xsZXJEYXRhXG4gICAgcm91dGVEYXRhLmxvY2F0aW9uID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbixcbiAgICAgIHJvdXRlQ29udHJvbGxlckRhdGEubG9jYXRpb25cbiAgICApXG4gICAgcm91dGVEYXRhLmNvbnRyb2xsZXIgPSByb3V0ZUNvbnRyb2xsZXJEYXRhLmNvbnRyb2xsZXJcbiAgICB0aGlzLnJvdXRlRGF0YSA9IHJvdXRlRGF0YVxuICAgIHJldHVybiB0aGlzLnJvdXRlRGF0YVxuICB9XG4gIGdldCBfcm91dGVDb250cm9sbGVyRGF0YSgpIHtcbiAgICBsZXQgcm91dGVEYXRhID0ge1xuICAgICAgbG9jYXRpb246IHt9LFxuICAgIH1cbiAgICBPYmplY3QuZW50cmllcyh0aGlzLnJvdXRlcylcbiAgICAgIC5mb3JFYWNoKChbcm91dGVQYXRoLCByb3V0ZVNldHRpbmdzXSkgPT4ge1xuICAgICAgICBsZXQgcGF0aEZyYWdtZW50cyA9IHRoaXMucGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgICAgcGF0aEZyYWdtZW50cyA9IChwYXRoRnJhZ21lbnRzLmxlbmd0aClcbiAgICAgICAgICA/IHBhdGhGcmFnbWVudHNcbiAgICAgICAgICA6IFsnLyddXG4gICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IHJvdXRlUGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQsIGZyYWdtZW50SW5kZXgpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgICAgcm91dGVGcmFnbWVudHMgPSAocm91dGVGcmFnbWVudHMubGVuZ3RoKVxuICAgICAgICAgID8gcm91dGVGcmFnbWVudHNcbiAgICAgICAgICA6IFsnLyddXG4gICAgICAgIGlmKFxuICAgICAgICAgIHBhdGhGcmFnbWVudHMubGVuZ3RoICYmXG4gICAgICAgICAgcGF0aEZyYWdtZW50cy5sZW5ndGggPT09IHJvdXRlRnJhZ21lbnRzLmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICBsZXQgbWF0Y2hcbiAgICAgICAgICByZXR1cm4gcm91dGVGcmFnbWVudHMuZmlsdGVyKChyb3V0ZUZyYWdtZW50LCByb3V0ZUZyYWdtZW50SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICBtYXRjaCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICAgIG1hdGNoID09PSB0cnVlXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgaWYocm91dGVGcmFnbWVudFswXSA9PT0gJzonKSB7XG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRJREtleSA9IHJvdXRlRnJhZ21lbnQucmVwbGFjZSgnOicsICcnKVxuICAgICAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudEluZGV4ID09PSBwYXRoRnJhZ21lbnRzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5jdXJyZW50SURLZXkgPSBjdXJyZW50SURLZXlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcm91dGVEYXRhLmxvY2F0aW9uW2N1cnJlbnRJREtleV0gPSBwYXRoRnJhZ21lbnRzW3JvdXRlRnJhZ21lbnRJbmRleF1cbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50ID0gdGhpcy5mcmFnbWVudElEUmVnRXhwXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudCA9IHJvdXRlRnJhZ21lbnQucmVwbGFjZShuZXcgUmVnRXhwKCcvJywgJ2dpJyksICdcXFxcXFwvJylcbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50ID0gdGhpcy5yb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cChyb3V0ZUZyYWdtZW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG1hdGNoID0gcm91dGVGcmFnbWVudC50ZXN0KHBhdGhGcmFnbWVudHNbcm91dGVGcmFnbWVudEluZGV4XSlcbiAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgbWF0Y2ggPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50SW5kZXggPT09IHBhdGhGcmFnbWVudHMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByb3V0ZURhdGEubG9jYXRpb24ucm91dGUgPSB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiByb3V0ZVBhdGgsXG4gICAgICAgICAgICAgICAgICBmcmFnbWVudHM6IHJvdXRlRnJhZ21lbnRzLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByb3V0ZURhdGEuY29udHJvbGxlciA9IHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICAgICAgICByZXR1cm4gcm91dGVTZXR0aW5nc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlbMF1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICByZXR1cm4gcm91dGVEYXRhXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGdldCBfcm91dGVzKCkge1xuICAgIHRoaXMucm91dGVzID0gKHRoaXMucm91dGVzKVxuICAgICAgPyB0aGlzLnJvdXRlc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlc1xuICB9XG4gIHNldCBfcm91dGVzKHJvdXRlcykge1xuICAgIHRoaXMucm91dGVzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlcywgdGhpcy5fcm91dGVzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlcigpIHsgcmV0dXJuIHRoaXMuY29udHJvbGxlciB9XG4gIHNldCBfY29udHJvbGxlcihjb250cm9sbGVyKSB7IHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXIgfVxuICBnZXQgX3ByZXZpb3VzVVJMKCkgeyByZXR1cm4gdGhpcy5wcmV2aW91c1VSTCB9XG4gIHNldCBfcHJldmlvdXNVUkwocHJldmlvdXNVUkwpIHsgdGhpcy5wcmV2aW91c1VSTCA9IHByZXZpb3VzVVJMIH1cbiAgZ2V0IF9jdXJyZW50VVJMKCkgeyByZXR1cm4gdGhpcy5jdXJyZW50VVJMIH1cbiAgc2V0IF9jdXJyZW50VVJMKGN1cnJlbnRVUkwpIHtcbiAgICBpZih0aGlzLmN1cnJlbnRVUkwpIHRoaXMuX3ByZXZpb3VzVVJMID0gdGhpcy5jdXJyZW50VVJMXG4gICAgdGhpcy5jdXJyZW50VVJMID0gY3VycmVudFVSTFxuICB9XG4gIGdldCBmcmFnbWVudElEUmVnRXhwKCkgeyByZXR1cm4gbmV3IFJlZ0V4cCgvXihbMC05QS1aXFw/XFw9XFwsXFwuXFwqXFwtXFxfXFwnXFxcIlxcXlxcJVxcJFxcI1xcQFxcIVxcflxcKFxcKVxce1xcfVxcJlxcPFxcPlxcXFxcXC9dKSokLywgJ2dpJykgfVxuICByb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cChmcmFnbWVudCkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKCdeJy5jb25jYXQoZnJhZ21lbnQsICckJykpXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGlmKFxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5lbmFibGVNZWRpYXRvcnMoKVxuICAgICAgdGhpcy5lbmFibGVFdmVudHMoKVxuICAgICAgdGhpcy5lbmFibGVSb3V0ZXMoKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLmRpc2FibGVFdmVudHMoKVxuICAgICAgdGhpcy5kaXNhYmxlUm91dGVzKClcbiAgICAgIHRoaXMuZGlzYWJsZU1lZGlhdG9ycygpXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBlbmFibGVSb3V0ZXMoKSB7XG4gICAgaWYodGhpcy5zZXR0aW5ncy5jb250cm9sbGVyKSB0aGlzLl9jb250cm9sbGVyID0gdGhpcy5zZXR0aW5ncy5jb250cm9sbGVyXG4gICAgdGhpcy5fcm91dGVzID0gT2JqZWN0LmVudHJpZXModGhpcy5zZXR0aW5ncy5yb3V0ZXMpLnJlZHVjZShcbiAgICAgIChcbiAgICAgICAgX3JvdXRlcyxcbiAgICAgICAgW3JvdXRlUGF0aCwgcm91dGVTZXR0aW5nc10sXG4gICAgICAgIHJvdXRlSW5kZXgsXG4gICAgICAgIG9yaWdpbmFsUm91dGVzLFxuICAgICAgKSA9PiB7XG4gICAgICAgIF9yb3V0ZXNbcm91dGVQYXRoXSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgcm91dGVTZXR0aW5ncyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjYWxsYmFjazogdGhpcy5jb250cm9sbGVyW3JvdXRlU2V0dGluZ3MuY2FsbGJhY2tdLmJpbmQodGhpcy5jb250cm9sbGVyKSxcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuIF9yb3V0ZXNcbiAgICAgIH0sXG4gICAgICB7fVxuICAgIClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGVuYWJsZU1lZGlhdG9ycygpIHtcbiAgICBPYmplY3QuYXNzaWduKFxuICAgICAgdGhpcy5fbWVkaWF0b3JzLFxuICAgICAgdGhpcy5zZXR0aW5ncy5tZWRpYXRvcnMsXG4gICAgICB7XG4gICAgICAgIG5hdmlnYXRlTWVkaWF0b3I6IG5ldyBNVkMuTWVkaWF0b3JzLk5hdmlnYXRlKCksXG4gICAgICB9XG4gICAgKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZGlzYWJsZU1lZGlhdG9ycygpIHtcbiAgICBkZWxldGUgdGhpcy5fbWVkaWF0b3JzLm5hdmlnYXRlTWVkaWF0b3JcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGVSb3V0ZXMoKSB7XG4gICAgZGVsZXRlIHRoaXMuX3JvdXRlc1xuICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBlbmFibGVFdmVudHMoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLnJvdXRlQ2hhbmdlLmJpbmQodGhpcykpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBkaXNhYmxlRXZlbnRzKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgdGhpcy5yb3V0ZUNoYW5nZS5iaW5kKHRoaXMpKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgcm91dGVDaGFuZ2UoKSB7XG4gICAgdGhpcy5fY3VycmVudFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgbGV0IHJvdXRlRGF0YSA9IHRoaXMuX3JvdXRlRGF0YVxuICAgIGlmKHJvdXRlRGF0YS5jb250cm9sbGVyKSB7XG4gICAgICBsZXQgbmF2aWdhdGVNZWRpYXRvciA9IHRoaXMubWVkaWF0b3JzLm5hdmlnYXRlTWVkaWF0b3JcbiAgICAgIGlmKHRoaXMucHJldmlvdXNVUkwpIHJvdXRlRGF0YS5wcmV2aW91c1VSTCA9IHRoaXMucHJldmlvdXNVUkxcbiAgICAgIG5hdmlnYXRlTWVkaWF0b3JcbiAgICAgICAgLnVuc2V0KClcbiAgICAgICAgLnNldChyb3V0ZURhdGEpXG4gICAgICB0aGlzLmVtaXQoXG4gICAgICAgIG5hdmlnYXRlTWVkaWF0b3IubmFtZSxcbiAgICAgICAgbmF2aWdhdGVNZWRpYXRvci5lbWlzc2lvbigpXG4gICAgICApXG4gICAgICByb3V0ZURhdGEuY29udHJvbGxlci5jYWxsYmFjayhcbiAgICAgICAgbmF2aWdhdGVNZWRpYXRvci5lbWlzc2lvbigpXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgbmF2aWdhdGUocGF0aCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aFxuICB9XG59XG4iLCJNVkMuQ29uc3RhbnRzLkV2ZW50cyA9IHt9XHJcbk1WQy5DT05TVC5FViA9IE1WQy5Db25zdGFudHMuRXZlbnRzXHJcbiIsIk1WQy5Db25zdGFudHMuT3BlcmF0b3JzID0ge31cclxuTVZDLkNPTlNULk9wZXJhdG9ycyA9IHt9XHJcbk1WQy5DT05TVC5PcGVyYXRvcnMuQ29tcGFyaXNvbiA9IHtcclxuICBFUTogJ0VRJyxcclxuICBTVEVROiAnU1RFUScsXHJcbiAgTk9FUTogJ05PRVEnLFxyXG4gIFNUTk9FUTogJ1NUTk9FUScsXHJcbiAgR1Q6ICdHVCcsXHJcbiAgTFQ6ICdMVCcsXHJcbiAgR1RFOiAnR1RFJyxcclxuICBMVEU6ICdMVEUnLFxyXG59XHJcbk1WQy5DT05TVC5PcGVyYXRvcnMuU3RhdGVtZW50ID0ge1xyXG4gIEFORDogJ0FORCcsXHJcbiAgT1I6ICdPUidcclxufVxyXG4iLCJNVkMuVXRpbHMuaXNBcnJheSA9IGZ1bmN0aW9uIGlzQXJyYXkob2JqZWN0KSB7IHJldHVybiBBcnJheS5pc0FycmF5KG9iamVjdCkgfVxyXG5NVkMuVXRpbHMuaXNPYmplY3QgPSBmdW5jdGlvbiBpc09iamVjdChvYmplY3QpIHtcclxuICByZXR1cm4gKFxyXG4gICAgIUFycmF5LmlzQXJyYXkob2JqZWN0KSAmJlxyXG4gICAgb2JqZWN0ICE9PSBudWxsXHJcbiAgKSA/IHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnXHJcbiAgICA6IGZhbHNlXHJcbn1cclxuTVZDLlV0aWxzLnR5cGVPZiA9IGZ1bmN0aW9uIHR5cGVPZih2YWx1ZSkge1xyXG4gIHJldHVybiAodHlwZW9mIHZhbHVlQSA9PT0gJ29iamVjdCcpXHJcbiAgICA/IChNVkMuVXRpbHMuaXNPYmplY3QodmFsdWVBKSlcclxuICAgICAgPyAnb2JqZWN0J1xyXG4gICAgICA6IChNVkMuVXRpbHMuaXNBcnJheSh2YWx1ZUEpKVxyXG4gICAgICAgID8gJ2FycmF5J1xyXG4gICAgICAgIDogKHZhbHVlQSA9PT0gbnVsbClcclxuICAgICAgICAgID8gJ251bGwnXHJcbiAgICAgICAgICA6IHVuZGVmaW5lZFxyXG4gICAgOiB0eXBlb2YgdmFsdWVcclxufVxyXG5NVkMuVXRpbHMuaXNIVE1MRWxlbWVudCA9IGZ1bmN0aW9uIGlzSFRNTEVsZW1lbnQob2JqZWN0KSB7XHJcbiAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XHJcbn1cclxuIiwiTVZDLlV0aWxzLnVpZCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgdXVpZCA9ICcnLCBpaVxyXG4gIGZvciAoaWkgPSAwOyBpaSA8IDMyOyBpaSArPSAxKSB7XHJcbiAgICBzd2l0Y2ggKGlpKSB7XHJcbiAgICBjYXNlIDg6XHJcbiAgICBjYXNlIDIwOlxyXG4gICAgICB1dWlkICs9ICctJztcclxuICAgICAgdXVpZCArPSAoTWF0aC5yYW5kb20oKSAqIDE2IHwgMCkudG9TdHJpbmcoMTYpXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlIDEyOlxyXG4gICAgICB1dWlkICs9ICctJ1xyXG4gICAgICB1dWlkICs9ICc0J1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAxNjpcclxuICAgICAgdXVpZCArPSAnLSdcclxuICAgICAgdXVpZCArPSAoTWF0aC5yYW5kb20oKSAqIDQgfCA4KS50b1N0cmluZygxNilcclxuICAgICAgYnJlYWtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHV1aWQgKz0gKE1hdGgucmFuZG9tKCkgKiAxNiB8IDApLnRvU3RyaW5nKDE2KVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdXVpZFxyXG59XHJcbiIsIk1WQy5VdGlscy50eXBlT2YgPSAgZnVuY3Rpb24gdHlwZU9mKGRhdGEpIHtcclxuICBzd2l0Y2godHlwZW9mIGRhdGEpIHtcclxuICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgIGxldCBfb2JqZWN0XHJcbiAgICAgIGlmKE1WQy5VdGlscy5pc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgLy8gQXJyYXlcclxuICAgICAgICByZXR1cm4gJ2FycmF5J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgTVZDLlV0aWxzLmlzT2JqZWN0KGRhdGEpXHJcbiAgICAgICkge1xyXG4gICAgICAgIC8vIE9iamVjdFxyXG4gICAgICAgIHJldHVybiAnb2JqZWN0J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgZGF0YSA9PT0gbnVsbFxyXG4gICAgICApIHtcclxuICAgICAgICAvLyBOdWxsXHJcbiAgICAgICAgcmV0dXJuICdudWxsJ1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBfb2JqZWN0XHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgY2FzZSAnbnVtYmVyJzpcclxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgcmV0dXJuIHR5cGVvZiBkYXRhXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QgPSBmdW5jdGlvbiBhZGRQcm9wZXJ0aWVzVG9PYmplY3QoKSB7XHJcbiAgbGV0IHRhcmdldE9iamVjdFxyXG4gIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICBjYXNlIDI6XHJcbiAgICAgIGxldCBwcm9wZXJ0aWVzID0gYXJndW1lbnRzWzBdXHJcbiAgICAgIHRhcmdldE9iamVjdCA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICBmb3IobGV0IFtwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BlcnRpZXMpKSB7XHJcbiAgICAgICAgdGFyZ2V0T2JqZWN0W3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlXHJcbiAgICAgIH1cclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgMzpcclxuICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICBsZXQgcHJvcGVydHlWYWx1ZSA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICB0YXJnZXRPYmplY3QgPSBhcmd1bWVudHNbMl1cclxuICAgICAgdGFyZ2V0T2JqZWN0W3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIHJldHVybiB0YXJnZXRPYmplY3RcclxufVxyXG4iLCJNVkMuVXRpbHMub2JqZWN0UXVlcnkgPSBmdW5jdGlvbiBvYmplY3RRdWVyeShcclxuICBzdHJpbmcsXHJcbiAgY29udGV4dFxyXG4pIHtcclxuICBsZXQgc3RyaW5nRGF0YSA9IE1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZU5vdGF0aW9uKHN0cmluZylcclxuICBpZihzdHJpbmdEYXRhWzBdID09PSAnQCcpIHN0cmluZ0RhdGEuc3BsaWNlKDAsIDEpXHJcbiAgaWYoIXN0cmluZ0RhdGEubGVuZ3RoKSByZXR1cm4gY29udGV4dFxyXG4gIGNvbnRleHQgPSAoTVZDLlV0aWxzLmlzT2JqZWN0KGNvbnRleHQpKVxyXG4gICAgPyBPYmplY3QuZW50cmllcyhjb250ZXh0KVxyXG4gICAgOiBjb250ZXh0XHJcbiAgcmV0dXJuIHN0cmluZ0RhdGEucmVkdWNlKChvYmplY3QsIGZyYWdtZW50LCBmcmFnbWVudEluZGV4LCBmcmFnbWVudHMpID0+IHtcclxuICAgIGxldCBwcm9wZXJ0aWVzID0gW11cclxuICAgIGZyYWdtZW50ID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlRnJhZ21lbnQoZnJhZ21lbnQpXHJcbiAgICBmb3IobGV0IFtwcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV0gb2Ygb2JqZWN0KSB7XHJcbiAgICAgIGlmKHByb3BlcnR5S2V5Lm1hdGNoKGZyYWdtZW50KSkge1xyXG4gICAgICAgIGlmKGZyYWdtZW50SW5kZXggPT09IGZyYWdtZW50cy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoW1twcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV1dKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoT2JqZWN0LmVudHJpZXMocHJvcGVydHlWYWx1ZSkpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBvYmplY3QgPSBwcm9wZXJ0aWVzXHJcbiAgICByZXR1cm4gb2JqZWN0XHJcbiAgfSwgY29udGV4dClcclxufVxyXG5NVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VOb3RhdGlvbiA9IGZ1bmN0aW9uIHBhcnNlTm90YXRpb24oc3RyaW5nKSB7XHJcbiAgaWYoXHJcbiAgICBzdHJpbmcuY2hhckF0KDApID09PSAnWycgJiZcclxuICAgIHN0cmluZy5jaGFyQXQoc3RyaW5nLmxlbmd0aCAtIDEpID09ICddJ1xyXG4gICkge1xyXG4gICAgc3RyaW5nID0gc3RyaW5nXHJcbiAgICAgIC5zbGljZSgxLCAtMSlcclxuICAgICAgLnNwbGl0KCddWycpXHJcbiAgfSBlbHNlIHtcclxuICAgIHN0cmluZyA9IHN0cmluZ1xyXG4gICAgICAuc3BsaXQoJy4nKVxyXG4gIH1cclxuICByZXR1cm4gc3RyaW5nXHJcbn1cclxuTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlRnJhZ21lbnQgPSBmdW5jdGlvbiBwYXJzZUZyYWdtZW50KGZyYWdtZW50KSB7XHJcbiAgaWYoXHJcbiAgICBmcmFnbWVudC5jaGFyQXQoMCkgPT09ICcvJyAmJlxyXG4gICAgZnJhZ21lbnQuY2hhckF0KGZyYWdtZW50Lmxlbmd0aCAtIDEpID09ICcvJ1xyXG4gICkge1xyXG4gICAgZnJhZ21lbnQgPSBmcmFnbWVudC5zbGljZSgxLCAtMSlcclxuICAgIGZyYWdtZW50ID0gbmV3IFJlZ0V4cCgnXicuY29uY2F0KGZyYWdtZW50LCAnJCcpKVxyXG4gIH1cclxuICByZXR1cm4gZnJhZ21lbnRcclxufVxyXG4iLCJNVkMuVXRpbHMucGFyYW1zVG9PYmplY3QgPSBmdW5jdGlvbiBwYXJhbXNUb09iamVjdChwYXJhbXMpIHtcclxuICAgIHZhciBwYXJhbXMgPSBwYXJhbXMuc3BsaXQoJyYnKVxyXG4gICAgdmFyIG9iamVjdCA9IHt9XHJcbiAgICBwYXJhbXMuZm9yRWFjaCgocGFyYW1EYXRhKSA9PiB7XHJcbiAgICAgIHBhcmFtRGF0YSA9IHBhcmFtRGF0YS5zcGxpdCgnPScpXHJcbiAgICAgIG9iamVjdFtwYXJhbURhdGFbMF1dID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcmFtRGF0YVsxXSB8fCAnJylcclxuICAgIH0pXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmplY3QpKVxyXG59XHJcbiIsIk1WQy5VdGlscy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzID0gZnVuY3Rpb24gdG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyhcclxuICB0b2dnbGVNZXRob2QsXHJcbiAgZXZlbnRzLFxyXG4gIHRhcmdldE9iamVjdHMsXHJcbiAgY2FsbGJhY2tzXHJcbikge1xyXG4gIGZvcihsZXQgW2V2ZW50U2V0dGluZ3MsIGV2ZW50Q2FsbGJhY2tOYW1lXSBvZiBPYmplY3QuZW50cmllcyhldmVudHMpKSB7XHJcbiAgICBsZXQgZXZlbnREYXRhID0gZXZlbnRTZXR0aW5ncy5zcGxpdCgnICcpXHJcbiAgICBsZXQgZXZlbnRUYXJnZXRTZXR0aW5ncyA9IGV2ZW50RGF0YVswXVxyXG4gICAgbGV0IGV2ZW50TmFtZSA9IGV2ZW50RGF0YVsxXVxyXG4gICAgbGV0IGV2ZW50VGFyZ2V0cyA9IE1WQy5VdGlscy5vYmplY3RRdWVyeShcclxuICAgICAgZXZlbnRUYXJnZXRTZXR0aW5ncyxcclxuICAgICAgdGFyZ2V0T2JqZWN0c1xyXG4gICAgKVxyXG4gICAgZXZlbnRUYXJnZXRzID0gKCFNVkMuVXRpbHMuaXNBcnJheShldmVudFRhcmdldHMpKVxyXG4gICAgICA/IFtbJ0AnLCBldmVudFRhcmdldHNdXVxyXG4gICAgICA6IGV2ZW50VGFyZ2V0c1xyXG4gICAgZm9yKGxldCBbZXZlbnRUYXJnZXROYW1lLCBldmVudFRhcmdldF0gb2YgZXZlbnRUYXJnZXRzKSB7XHJcbiAgICAgIGxldCBldmVudE1ldGhvZE5hbWUgPSAodG9nZ2xlTWV0aG9kID09PSAnb24nKVxyXG4gICAgICA/IChcclxuICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0IHx8XHJcbiAgICAgICAgKFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBEb2N1bWVudFxyXG4gICAgICAgIClcclxuICAgICAgKSA/ICdhZGRFdmVudExpc3RlbmVyJ1xyXG4gICAgICAgIDogJ29uJ1xyXG4gICAgICA6IChcclxuICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0IHx8XHJcbiAgICAgICAgKFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBEb2N1bWVudFxyXG4gICAgICAgIClcclxuICAgICAgKSA/ICdyZW1vdmVFdmVudExpc3RlbmVyJ1xyXG4gICAgICAgIDogJ29mZidcclxuICAgICAgbGV0IGV2ZW50Q2FsbGJhY2sgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkoXHJcbiAgICAgICAgZXZlbnRDYWxsYmFja05hbWUsXHJcbiAgICAgICAgY2FsbGJhY2tzXHJcbiAgICAgIClbMF1bMV1cclxuICAgICAgaWYoZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xyXG4gICAgICAgIGZvcihsZXQgX2V2ZW50VGFyZ2V0IG9mIGV2ZW50VGFyZ2V0KSB7XHJcbiAgICAgICAgICBfZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYoZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIGV2ZW50VGFyZ2V0W2V2ZW50TWV0aG9kTmFtZV0oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMgPSBmdW5jdGlvbiBiaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKCkge1xyXG4gIHRoaXMudG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cygnb24nLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzID0gZnVuY3Rpb24gdW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMoKSB7XHJcbiAgdGhpcy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKCdvZmYnLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuIiwiTVZDLk1lZGlhdG9ycy5OYXZpZ2F0ZSA9IGNsYXNzIGV4dGVuZHMgTVZDLk1lZGlhdG9yIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICAgIHRoaXMuYWRkU2V0dGluZ3MoKVxyXG4gICAgdGhpcy5lbmFibGUoKVxyXG4gIH1cclxuICBhZGRTZXR0aW5ncygpIHtcclxuICAgIHRoaXMuX25hbWUgPSAnbmF2aWdhdGUnXHJcbiAgICB0aGlzLl9zY2hlbWEgPSB7XHJcbiAgICAgIG9sZFVSTDoge1xyXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICB9LFxyXG4gICAgICBuZXdVUkw6IHtcclxuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgfSxcclxuICAgICAgY3VycmVudFJvdXRlOiB7XHJcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgIH0sXHJcbiAgICAgIGN1cnJlbnRDb250cm9sbGVyOiB7XHJcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgIH0sXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIk1WQy5NZWRpYXRvcnMuVmFsaWRhdGUgPSBjbGFzcyBleHRlbmRzIE1WQy5NZWRpYXRvciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgICB0aGlzLmFkZFNldHRpbmdzKClcclxuICAgIHRoaXMuZW5hYmxlKClcclxuICB9XHJcbiAgYWRkU2V0dGluZ3MoKSB7XHJcbiAgICB0aGlzLl9uYW1lID0gJ3ZhbGlkYXRlJ1xyXG4gICAgdGhpcy5fc2NoZW1hID0ge1xyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXHJcbiAgICAgIH0sXHJcbiAgICAgIHJlc3VsdHM6IHtcclxuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcclxuICAgICAgfSxcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19
