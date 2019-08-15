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

  enableMediators() {
    if (this.settings.mediators) this._mediators = this.settings.mediators;
  }

  disableMediators() {
    if (this._mediators) delete this._mediators;
  }

  enable() {
    var settings = this.settings;

    if (settings && !this._enabled) {
      this.enableMediators();
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
      this.disableMediators();
      this._enabled = false;
      return thiss;
    }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1WQy5qcyIsIkNvbnN0YW50cy5qcyIsIkV2ZW50cy5qcyIsIk9wZXJhdG9ycy5qcyIsImluZGV4LmpzIiwiaXMuanMiLCJ0eXBlT2YuanMiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QuanMiLCJvYmplY3RRdWVyeS5qcyIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMuanMiLCJOYXZpZ2F0ZS5qcyIsIlZhbGlkYXRlLmpzIl0sIm5hbWVzIjpbIk1WQyIsIkNvbnN0YW50cyIsIkNPTlNUIiwiRXZlbnRzIiwiRVYiLCJPcGVyYXRvcnMiLCJDb21wYXJpc29uIiwiRVEiLCJTVEVRIiwiTk9FUSIsIlNUTk9FUSIsIkdUIiwiTFQiLCJHVEUiLCJMVEUiLCJTdGF0ZW1lbnQiLCJBTkQiLCJPUiIsImNvbnNvbGUiLCJsb2ciLCJVdGlscyIsImlzQXJyYXkiLCJvYmplY3QiLCJBcnJheSIsImlzT2JqZWN0IiwidHlwZU9mIiwidmFsdWUiLCJ2YWx1ZUEiLCJ1bmRlZmluZWQiLCJpc0hUTUxFbGVtZW50IiwiSFRNTEVsZW1lbnQiLCJkYXRhIiwiX29iamVjdCIsImFkZFByb3BlcnRpZXNUb09iamVjdCIsInRhcmdldE9iamVjdCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInByb3BlcnRpZXMiLCJwcm9wZXJ0eU5hbWUiLCJwcm9wZXJ0eVZhbHVlIiwiT2JqZWN0IiwiZW50cmllcyIsIm9iamVjdFF1ZXJ5Iiwic3RyaW5nIiwiY29udGV4dCIsInN0cmluZ0RhdGEiLCJwYXJzZU5vdGF0aW9uIiwic3BsaWNlIiwicmVkdWNlIiwiZnJhZ21lbnQiLCJmcmFnbWVudEluZGV4IiwiZnJhZ21lbnRzIiwicGFyc2VGcmFnbWVudCIsInByb3BlcnR5S2V5IiwibWF0Y2giLCJjb25jYXQiLCJjaGFyQXQiLCJzbGljZSIsInNwbGl0IiwiUmVnRXhwIiwidG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyIsInRvZ2dsZU1ldGhvZCIsImV2ZW50cyIsInRhcmdldE9iamVjdHMiLCJjYWxsYmFja3MiLCJldmVudFNldHRpbmdzIiwiZXZlbnRDYWxsYmFja05hbWUiLCJldmVudERhdGEiLCJldmVudFRhcmdldFNldHRpbmdzIiwiZXZlbnROYW1lIiwiZXZlbnRUYXJnZXRzIiwiZXZlbnRUYXJnZXROYW1lIiwiZXZlbnRUYXJnZXQiLCJldmVudE1ldGhvZE5hbWUiLCJOb2RlTGlzdCIsIkRvY3VtZW50IiwiZXZlbnRDYWxsYmFjayIsIl9ldmVudFRhcmdldCIsImJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMiLCJ1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyIsImNvbnN0cnVjdG9yIiwiX2V2ZW50cyIsImdldEV2ZW50Q2FsbGJhY2tzIiwiZ2V0RXZlbnRDYWxsYmFja05hbWUiLCJuYW1lIiwiZ2V0RXZlbnRDYWxsYmFja0dyb3VwIiwiZXZlbnRDYWxsYmFja3MiLCJvbiIsImV2ZW50Q2FsbGJhY2tHcm91cCIsInB1c2giLCJvZmYiLCJrZXlzIiwiZW1pdCIsIl9hcmd1bWVudHMiLCJ2YWx1ZXMiLCJldmVudENhbGxiYWNrR3JvdXBOYW1lIiwiYWRkaXRpb25hbEFyZ3VtZW50cyIsIkNoYW5uZWxzIiwiX2NoYW5uZWxzIiwiY2hhbm5lbHMiLCJjaGFubmVsIiwiY2hhbm5lbE5hbWUiLCJDaGFubmVsIiwiX3Jlc3BvbnNlcyIsInJlc3BvbnNlcyIsInJlc3BvbnNlIiwicmVzcG9uc2VOYW1lIiwicmVzcG9uc2VDYWxsYmFjayIsInJlcXVlc3QiLCJyZXF1ZXN0RGF0YSIsIkJhc2UiLCJzZXR0aW5ncyIsImNvbmZpZ3VyYXRpb24iLCJfY29uZmlndXJhdGlvbiIsIl9zZXR0aW5ncyIsIl9tZWRpYXRvcnMiLCJtZWRpYXRvcnMiLCJTZXJ2aWNlIiwiX2RlZmF1bHRzIiwiZGVmYXVsdHMiLCJjb250ZW50VHlwZSIsInJlc3BvbnNlVHlwZSIsIl9yZXNwb25zZVR5cGVzIiwiX3Jlc3BvbnNlVHlwZSIsIl94aHIiLCJmaW5kIiwicmVzcG9uc2VUeXBlSXRlbSIsIl90eXBlIiwidHlwZSIsIl91cmwiLCJ1cmwiLCJfaGVhZGVycyIsImhlYWRlcnMiLCJmb3JFYWNoIiwiaGVhZGVyIiwic2V0UmVxdWVzdEhlYWRlciIsIl9kYXRhIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJfZW5hYmxlZCIsImVuYWJsZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInN0YXR1cyIsImFib3J0Iiwib3BlbiIsIm9ubG9hZCIsIm9uZXJyb3IiLCJzZW5kIiwidGhlbiIsImN1cnJlbnRUYXJnZXQiLCJjYXRjaCIsImVycm9yIiwiZW5hYmxlIiwiZGlzYWJsZSIsIlZhbGlkYXRvciIsInNjaGVtYSIsIl9zY2hlbWEiLCJfcmVzdWx0cyIsInJlc3VsdHMiLCJ2YWxpZGF0ZSIsInZhbGlkYXRpb25TdW1tYXJ5Iiwic2NoZW1hS2V5Iiwic2NoZW1hU2V0dGluZ3MiLCJ2YWxpZGF0aW9uIiwia2V5IiwicmVxdWlyZWQiLCJldmFsdWF0aW9ucyIsInZhbGlkYXRpb25FdmFsdWF0aW9ucyIsImV2YWx1YXRpb25SZXN1bHRzIiwibWVzc2FnZXMiLCJhc3NpZ24iLCJwYXNzIiwiZmFpbCIsImNvbXBhcmF0b3IiLCJyZXN1bHQiLCJtZXNzYWdlIiwiX2V2YWx1YXRpb25zIiwiZXZhbHVhdGlvbiIsImV2YWx1YXRpb25JbmRleCIsInZhbHVlQ29tcGFyaXNvbiIsImNvbXBhcmVWYWx1ZXMiLCJjb21wYXJpc29uIiwiY3VycmVudEV2YWx1YXRpb24iLCJzdGF0ZW1lbnQiLCJwcmV2aW91c0V2YWx1YXRpb24iLCJwcmV2aW91c0V2YWx1YXRpb25Db21wYXJpc29uVmFsdWUiLCJzdGF0ZW1lbnRDb21wYXJpc29uIiwiY29tcGFyZVN0YXRlbWVudHMiLCJldmFsdWF0aW9uVmFsaWRhdGlvbiIsIm9wZXJhdG9yIiwiZXZhbHVhdGlvblJlc3VsdCIsIk1vZGVsIiwiX3ZhbGlkYXRvciIsInZhbGlkYXRvciIsIl9pc1NldHRpbmciLCJpc1NldHRpbmciLCJfY2hhbmdpbmciLCJjaGFuZ2luZyIsIl9sb2NhbFN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJfaGlzdGlvZ3JhbSIsImhpc3Rpb2dyYW0iLCJfaGlzdG9yeSIsImhpc3RvcnkiLCJ1bnNoaWZ0IiwicGFyc2UiLCJfZGIiLCJkYiIsImdldEl0ZW0iLCJlbmRwb2ludCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzZXRJdGVtIiwiX2RhdGFFdmVudHMiLCJkYXRhRXZlbnRzIiwiX2RhdGFDYWxsYmFja3MiLCJkYXRhQ2FsbGJhY2tzIiwiX3NlcnZpY2VzIiwic2VydmljZXMiLCJfc2VydmljZUV2ZW50cyIsInNlcnZpY2VFdmVudHMiLCJfc2VydmljZUNhbGxiYWNrcyIsInNlcnZpY2VDYWxsYmFja3MiLCJnZXQiLCJzZXQiLCJpbmRleCIsInNldERhdGFQcm9wZXJ0eSIsInZhbGlkYXRlTWVkaWF0b3IiLCJlbWlzc2lvbiIsInVuc2V0IiwidW5zZXREYXRhUHJvcGVydHkiLCJzZXREQiIsInVuc2V0REIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiY29uZmlndXJhYmxlIiwiQm9vbGVhbiIsInNldFZhbHVlRXZlbnROYW1lIiwiam9pbiIsInNldEV2ZW50TmFtZSIsInVuc2V0VmFsdWVFdmVudE5hbWUiLCJ1bnNldEV2ZW50TmFtZSIsInVuc2V0VmFsdWUiLCJzZXREZWZhdWx0cyIsImVuYWJsZVNlcnZpY2VFdmVudHMiLCJkaXNhYmxlU2VydmljZUV2ZW50cyIsImVuYWJsZURhdGFFdmVudHMiLCJkaXNhYmxlRGF0YUV2ZW50cyIsImVuYWJsZU1lZGlhdG9ycyIsIk1lZGlhdG9ycyIsIlZhbGlkYXRlIiwiZGlzYWJsZU1lZGlhdG9ycyIsIk1lZGlhdG9yIiwiX25hbWUiLCJOYXZpZ2F0ZSIsImFkZFNldHRpbmdzIiwib2xkVVJMIiwibmV3VVJMIiwiY3VycmVudFJvdXRlIiwiY3VycmVudENvbnRyb2xsZXIiLCJWaWV3IiwiX2VsZW1lbnROYW1lIiwiX2VsZW1lbnQiLCJ0YWdOYW1lIiwiZWxlbWVudE5hbWUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJlbGVtZW50IiwicXVlcnlTZWxlY3RvciIsImVsZW1lbnRPYnNlcnZlciIsIm9ic2VydmUiLCJzdWJ0cmVlIiwiY2hpbGRMaXN0IiwiX2F0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJfdWkiLCJ1aSIsInVpS2V5IiwidWlWYWx1ZSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJfdWlFdmVudHMiLCJ1aUV2ZW50cyIsIl91aUNhbGxiYWNrcyIsInVpQ2FsbGJhY2tzIiwiX29ic2VydmVyQ2FsbGJhY2tzIiwib2JzZXJ2ZXJDYWxsYmFja3MiLCJfZWxlbWVudE9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsImVsZW1lbnRPYnNlcnZlIiwiYmluZCIsIl9pbnNlcnQiLCJpbnNlcnQiLCJfdGVtcGxhdGVzIiwidGVtcGxhdGVzIiwibXV0YXRpb25SZWNvcmRMaXN0Iiwib2JzZXJ2ZXIiLCJtdXRhdGlvblJlY29yZEluZGV4IiwibXV0YXRpb25SZWNvcmQiLCJtdXRhdGlvblJlY29yZENhdGVnb3JpZXMiLCJtdXRhdGlvblJlY29yZENhdGVnb3J5IiwicmVzZXRVSSIsImF1dG9JbnNlcnQiLCJpbnNlcnRBZGphY2VudEVsZW1lbnQiLCJtZXRob2QiLCJhdXRvUmVtb3ZlIiwicGFyZW50RWxlbWVudCIsInJlbW92ZUNoaWxkIiwiZW5hYmxlRWxlbWVudCIsImRpc2FibGVFbGVtZW50IiwiZGlzYWJsZVVJIiwiZW5hYmxlVUkiLCJlbmFibGVVSUV2ZW50cyIsImRpc2FibGVVSUV2ZW50cyIsInRoaXNzIiwiQ29udHJvbGxlciIsIl9tZWRpYXRvckNhbGxiYWNrcyIsIm1lZGlhdG9yQ2FsbGJhY2tzIiwiX21vZGVsQ2FsbGJhY2tzIiwibW9kZWxDYWxsYmFja3MiLCJfdmlld0NhbGxiYWNrcyIsInZpZXdDYWxsYmFja3MiLCJfY29udHJvbGxlckNhbGxiYWNrcyIsImNvbnRyb2xsZXJDYWxsYmFja3MiLCJfbW9kZWxzIiwibW9kZWxzIiwiX3ZpZXdzIiwidmlld3MiLCJfY29udHJvbGxlcnMiLCJjb250cm9sbGVycyIsIl9yb3V0ZXJzIiwicm91dGVycyIsIl9yb3V0ZXJFdmVudHMiLCJyb3V0ZXJFdmVudHMiLCJfcm91dGVyQ2FsbGJhY2tzIiwicm91dGVyQ2FsbGJhY2tzIiwiX21lZGlhdG9yRXZlbnRzIiwibWVkaWF0b3JFdmVudHMiLCJfbW9kZWxFdmVudHMiLCJtb2RlbEV2ZW50cyIsIl92aWV3RXZlbnRzIiwidmlld0V2ZW50cyIsIl9jb250cm9sbGVyRXZlbnRzIiwiY29udHJvbGxlckV2ZW50cyIsImVuYWJsZU1vZGVsRXZlbnRzIiwiZGlzYWJsZU1vZGVsRXZlbnRzIiwiZW5hYmxlVmlld0V2ZW50cyIsImRpc2FibGVWaWV3RXZlbnRzIiwiZW5hYmxlQ29udHJvbGxlckV2ZW50cyIsImRpc2FibGVDb250cm9sbGVyRXZlbnRzIiwiZW5hYmxlTWVkaWF0b3JFdmVudHMiLCJkaXNhYmxlTWVkaWF0b3JFdmVudHMiLCJlbmFibGVSb3V0ZXJFdmVudHMiLCJkaXNhYmxlUm91dGVyRXZlbnRzIiwicmVzZXQiLCJSb3V0ZXIiLCJwcm90b2NvbCIsIndpbmRvdyIsImxvY2F0aW9uIiwiaG9zdG5hbWUiLCJwb3J0IiwicGF0aCIsInBhdGhuYW1lIiwiaGFzaCIsImhyZWYiLCJoYXNoSW5kZXgiLCJpbmRleE9mIiwicGFyYW1JbmRleCIsInNsaWNlU3RhcnQiLCJzbGljZVN0b3AiLCJwYXJhbXMiLCJfcm91dGVEYXRhIiwicm91dGVEYXRhIiwiY29udHJvbGxlciIsImZpbHRlciIsImhhc2hGcmFnbWVudHMiLCJwYXJhbURhdGEiLCJwYXJhbXNUb09iamVjdCIsImN1cnJlbnRVUkwiLCJyb3V0ZUNvbnRyb2xsZXJEYXRhIiwiX3JvdXRlQ29udHJvbGxlckRhdGEiLCJyb3V0ZXMiLCJyb3V0ZVBhdGgiLCJyb3V0ZVNldHRpbmdzIiwicGF0aEZyYWdtZW50cyIsInJvdXRlRnJhZ21lbnRzIiwicm91dGVGcmFnbWVudCIsInJvdXRlRnJhZ21lbnRJbmRleCIsImN1cnJlbnRJREtleSIsInJlcGxhY2UiLCJmcmFnbWVudElEUmVnRXhwIiwicm91dGVGcmFnbWVudE5hbWVSZWdFeHAiLCJ0ZXN0Iiwicm91dGUiLCJfcm91dGVzIiwiX2NvbnRyb2xsZXIiLCJfcHJldmlvdXNVUkwiLCJwcmV2aW91c1VSTCIsIl9jdXJyZW50VVJMIiwiZW5hYmxlRXZlbnRzIiwiZW5hYmxlUm91dGVzIiwiZGlzYWJsZUV2ZW50cyIsImRpc2FibGVSb3V0ZXMiLCJyb3V0ZUluZGV4Iiwib3JpZ2luYWxSb3V0ZXMiLCJjYWxsYmFjayIsIm5hdmlnYXRlTWVkaWF0b3IiLCJhZGRFdmVudExpc3RlbmVyIiwicm91dGVDaGFuZ2UiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibmF2aWdhdGUiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLEVBQWpCO0FDQUFBLEdBQUcsQ0FBQ0MsU0FBSixHQUFnQixFQUFoQjtBQUNBRCxHQUFHLENBQUNFLEtBQUosR0FBWUYsR0FBRyxDQUFDQyxTQUFoQjtBQ0RBRCxHQUFHLENBQUNDLFNBQUosQ0FBY0UsTUFBZCxHQUF1QixFQUF2QjtBQUNBSCxHQUFHLENBQUNFLEtBQUosQ0FBVUUsRUFBVixHQUFlSixHQUFHLENBQUNDLFNBQUosQ0FBY0UsTUFBN0I7QUNEQUgsR0FBRyxDQUFDQyxTQUFKLENBQWNJLFNBQWQsR0FBMEIsRUFBMUI7QUFDQUwsR0FBRyxDQUFDRSxLQUFKLENBQVVHLFNBQVYsR0FBc0IsRUFBdEI7QUFDQUwsR0FBRyxDQUFDRSxLQUFKLENBQVVHLFNBQVYsQ0FBb0JDLFVBQXBCLEdBQWlDO0FBQy9CQyxFQUFBQSxFQUFFLEVBQUUsSUFEMkI7QUFFL0JDLEVBQUFBLElBQUksRUFBRSxNQUZ5QjtBQUcvQkMsRUFBQUEsSUFBSSxFQUFFLE1BSHlCO0FBSS9CQyxFQUFBQSxNQUFNLEVBQUUsUUFKdUI7QUFLL0JDLEVBQUFBLEVBQUUsRUFBRSxJQUwyQjtBQU0vQkMsRUFBQUEsRUFBRSxFQUFFLElBTjJCO0FBTy9CQyxFQUFBQSxHQUFHLEVBQUUsS0FQMEI7QUFRL0JDLEVBQUFBLEdBQUcsRUFBRTtBQVIwQixDQUFqQztBQVVBZCxHQUFHLENBQUNFLEtBQUosQ0FBVUcsU0FBVixDQUFvQlUsU0FBcEIsR0FBZ0M7QUFDOUJDLEVBQUFBLEdBQUcsRUFBRSxLQUR5QjtBQUU5QkMsRUFBQUEsRUFBRSxFQUFFO0FBRjBCLENBQWhDO0FBSUFDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZbkIsR0FBRyxDQUFDRSxLQUFoQjtBQ2hCQUYsR0FBRyxDQUFDb0IsS0FBSixHQUFZLEVBQVo7QUNBQXBCLEdBQUcsQ0FBQ29CLEtBQUosQ0FBVUMsT0FBVixHQUFvQixTQUFTQSxPQUFULENBQWlCQyxNQUFqQixFQUF5QjtBQUFFLFNBQU9DLEtBQUssQ0FBQ0YsT0FBTixDQUFjQyxNQUFkLENBQVA7QUFBOEIsQ0FBN0U7O0FBQ0F0QixHQUFHLENBQUNvQixLQUFKLENBQVVJLFFBQVYsR0FBcUIsU0FBU0EsUUFBVCxDQUFrQkYsTUFBbEIsRUFBMEI7QUFDN0MsU0FDRSxDQUFDQyxLQUFLLENBQUNGLE9BQU4sQ0FBY0MsTUFBZCxDQUFELElBQ0FBLE1BQU0sS0FBSyxJQUZOLEdBR0gsT0FBT0EsTUFBUCxLQUFrQixRQUhmLEdBSUgsS0FKSjtBQUtELENBTkQ7O0FBT0F0QixHQUFHLENBQUNvQixLQUFKLENBQVVLLE1BQVYsR0FBbUIsU0FBU0EsTUFBVCxDQUFnQkMsS0FBaEIsRUFBdUI7QUFDeEMsU0FBUSxPQUFPQyxNQUFQLEtBQWtCLFFBQW5CLEdBQ0YzQixHQUFHLENBQUNvQixLQUFKLENBQVVJLFFBQVYsQ0FBbUJHLE1BQW5CLENBQUQsR0FDRSxRQURGLEdBRUczQixHQUFHLENBQUNvQixLQUFKLENBQVVDLE9BQVYsQ0FBa0JNLE1BQWxCLENBQUQsR0FDRSxPQURGLEdBRUdBLE1BQU0sS0FBSyxJQUFaLEdBQ0UsTUFERixHQUVFQyxTQVBILEdBUUgsT0FBT0YsS0FSWDtBQVNELENBVkQ7O0FBV0ExQixHQUFHLENBQUNvQixLQUFKLENBQVVTLGFBQVYsR0FBMEIsU0FBU0EsYUFBVCxDQUF1QlAsTUFBdkIsRUFBK0I7QUFDdkQsU0FBT0EsTUFBTSxZQUFZUSxXQUF6QjtBQUNELENBRkQ7QUNuQkE5QixHQUFHLENBQUNvQixLQUFKLENBQVVLLE1BQVYsR0FBb0IsU0FBU0EsTUFBVCxDQUFnQk0sSUFBaEIsRUFBc0I7QUFDeEMsVUFBTyxPQUFPQSxJQUFkO0FBQ0UsU0FBSyxRQUFMO0FBQ0UsVUFBSUMsT0FBSjs7QUFDQSxVQUFHaEMsR0FBRyxDQUFDb0IsS0FBSixDQUFVQyxPQUFWLENBQWtCVSxJQUFsQixDQUFILEVBQTRCO0FBQzFCO0FBQ0EsZUFBTyxPQUFQO0FBQ0QsT0FIRCxNQUdPLElBQ0wvQixHQUFHLENBQUNvQixLQUFKLENBQVVJLFFBQVYsQ0FBbUJPLElBQW5CLENBREssRUFFTDtBQUNBO0FBQ0EsZUFBTyxRQUFQO0FBQ0QsT0FMTSxNQUtBLElBQ0xBLElBQUksS0FBSyxJQURKLEVBRUw7QUFDQTtBQUNBLGVBQU8sTUFBUDtBQUNEOztBQUNELGFBQU9DLE9BQVA7QUFDQTs7QUFDRixTQUFLLFFBQUw7QUFDQSxTQUFLLFFBQUw7QUFDQSxTQUFLLFNBQUw7QUFDQSxTQUFLLFdBQUw7QUFDQSxTQUFLLFVBQUw7QUFDRSxhQUFPLE9BQU9ELElBQWQ7QUFDQTtBQXpCSjtBQTJCRCxDQTVCRDtBQ0FBL0IsR0FBRyxDQUFDb0IsS0FBSixDQUFVYSxxQkFBVixHQUFrQyxTQUFTQSxxQkFBVCxHQUFpQztBQUNqRSxNQUFJQyxZQUFKOztBQUNBLFVBQU9DLFNBQVMsQ0FBQ0MsTUFBakI7QUFDRSxTQUFLLENBQUw7QUFDRSxVQUFJQyxVQUFVLEdBQUdGLFNBQVMsQ0FBQyxDQUFELENBQTFCO0FBQ0FELE1BQUFBLFlBQVksR0FBR0MsU0FBUyxDQUFDLENBQUQsQ0FBeEI7O0FBQ0EsV0FBSSxJQUFJLENBQUNHLGFBQUQsRUFBZUMsY0FBZixDQUFSLElBQXlDQyxNQUFNLENBQUNDLE9BQVAsQ0FBZUosVUFBZixDQUF6QyxFQUFxRTtBQUNuRUgsUUFBQUEsWUFBWSxDQUFDSSxhQUFELENBQVosR0FBNkJDLGNBQTdCO0FBQ0Q7O0FBQ0Q7O0FBQ0YsU0FBSyxDQUFMO0FBQ0UsVUFBSUQsWUFBWSxHQUFHSCxTQUFTLENBQUMsQ0FBRCxDQUE1QjtBQUNBLFVBQUlJLGFBQWEsR0FBR0osU0FBUyxDQUFDLENBQUQsQ0FBN0I7QUFDQUQsTUFBQUEsWUFBWSxHQUFHQyxTQUFTLENBQUMsQ0FBRCxDQUF4QjtBQUNBRCxNQUFBQSxZQUFZLENBQUNJLFlBQUQsQ0FBWixHQUE2QkMsYUFBN0I7QUFDQTtBQWJKOztBQWVBLFNBQU9MLFlBQVA7QUFDRCxDQWxCRDtBQ0FBbEMsR0FBRyxDQUFDb0IsS0FBSixDQUFVc0IsV0FBVixHQUF3QixTQUFTQSxXQUFULENBQ3RCQyxNQURzQixFQUV0QkMsT0FGc0IsRUFHdEI7QUFDQSxNQUFJQyxVQUFVLEdBQUc3QyxHQUFHLENBQUNvQixLQUFKLENBQVVzQixXQUFWLENBQXNCSSxhQUF0QixDQUFvQ0gsTUFBcEMsQ0FBakI7QUFDQSxNQUFHRSxVQUFVLENBQUMsQ0FBRCxDQUFWLEtBQWtCLEdBQXJCLEVBQTBCQSxVQUFVLENBQUNFLE1BQVgsQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckI7QUFDMUIsTUFBRyxDQUFDRixVQUFVLENBQUNULE1BQWYsRUFBdUIsT0FBT1EsT0FBUDtBQUN2QkEsRUFBQUEsT0FBTyxHQUFJNUMsR0FBRyxDQUFDb0IsS0FBSixDQUFVSSxRQUFWLENBQW1Cb0IsT0FBbkIsQ0FBRCxHQUNOSixNQUFNLENBQUNDLE9BQVAsQ0FBZUcsT0FBZixDQURNLEdBRU5BLE9BRko7QUFHQSxTQUFPQyxVQUFVLENBQUNHLE1BQVgsQ0FBa0IsQ0FBQzFCLE1BQUQsRUFBUzJCLFFBQVQsRUFBbUJDLGFBQW5CLEVBQWtDQyxTQUFsQyxLQUFnRDtBQUN2RSxRQUFJZCxVQUFVLEdBQUcsRUFBakI7QUFDQVksSUFBQUEsUUFBUSxHQUFHakQsR0FBRyxDQUFDb0IsS0FBSixDQUFVc0IsV0FBVixDQUFzQlUsYUFBdEIsQ0FBb0NILFFBQXBDLENBQVg7O0FBQ0EsU0FBSSxJQUFJLENBQUNJLFdBQUQsRUFBY2QsYUFBZCxDQUFSLElBQXdDakIsTUFBeEMsRUFBZ0Q7QUFDOUMsVUFBRytCLFdBQVcsQ0FBQ0MsS0FBWixDQUFrQkwsUUFBbEIsQ0FBSCxFQUFnQztBQUM5QixZQUFHQyxhQUFhLEtBQUtDLFNBQVMsQ0FBQ2YsTUFBVixHQUFtQixDQUF4QyxFQUEyQztBQUN6Q0MsVUFBQUEsVUFBVSxHQUFHQSxVQUFVLENBQUNrQixNQUFYLENBQWtCLENBQUMsQ0FBQ0YsV0FBRCxFQUFjZCxhQUFkLENBQUQsQ0FBbEIsQ0FBYjtBQUNELFNBRkQsTUFFTztBQUNMRixVQUFBQSxVQUFVLEdBQUdBLFVBQVUsQ0FBQ2tCLE1BQVgsQ0FBa0JmLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlRixhQUFmLENBQWxCLENBQWI7QUFDRDtBQUNGO0FBQ0Y7O0FBQ0RqQixJQUFBQSxNQUFNLEdBQUdlLFVBQVQ7QUFDQSxXQUFPZixNQUFQO0FBQ0QsR0FkTSxFQWNKc0IsT0FkSSxDQUFQO0FBZUQsQ0F6QkQ7O0FBMEJBNUMsR0FBRyxDQUFDb0IsS0FBSixDQUFVc0IsV0FBVixDQUFzQkksYUFBdEIsR0FBc0MsU0FBU0EsYUFBVCxDQUF1QkgsTUFBdkIsRUFBK0I7QUFDbkUsTUFDRUEsTUFBTSxDQUFDYSxNQUFQLENBQWMsQ0FBZCxNQUFxQixHQUFyQixJQUNBYixNQUFNLENBQUNhLE1BQVAsQ0FBY2IsTUFBTSxDQUFDUCxNQUFQLEdBQWdCLENBQTlCLEtBQW9DLEdBRnRDLEVBR0U7QUFDQU8sSUFBQUEsTUFBTSxHQUFHQSxNQUFNLENBQ1pjLEtBRE0sQ0FDQSxDQURBLEVBQ0csQ0FBQyxDQURKLEVBRU5DLEtBRk0sQ0FFQSxJQUZBLENBQVQ7QUFHRCxHQVBELE1BT087QUFDTGYsSUFBQUEsTUFBTSxHQUFHQSxNQUFNLENBQ1plLEtBRE0sQ0FDQSxHQURBLENBQVQ7QUFFRDs7QUFDRCxTQUFPZixNQUFQO0FBQ0QsQ0FiRDs7QUFjQTNDLEdBQUcsQ0FBQ29CLEtBQUosQ0FBVXNCLFdBQVYsQ0FBc0JVLGFBQXRCLEdBQXNDLFNBQVNBLGFBQVQsQ0FBdUJILFFBQXZCLEVBQWlDO0FBQ3JFLE1BQ0VBLFFBQVEsQ0FBQ08sTUFBVCxDQUFnQixDQUFoQixNQUF1QixHQUF2QixJQUNBUCxRQUFRLENBQUNPLE1BQVQsQ0FBZ0JQLFFBQVEsQ0FBQ2IsTUFBVCxHQUFrQixDQUFsQyxLQUF3QyxHQUYxQyxFQUdFO0FBQ0FhLElBQUFBLFFBQVEsR0FBR0EsUUFBUSxDQUFDUSxLQUFULENBQWUsQ0FBZixFQUFrQixDQUFDLENBQW5CLENBQVg7QUFDQVIsSUFBQUEsUUFBUSxHQUFHLElBQUlVLE1BQUosQ0FBVyxJQUFJSixNQUFKLENBQVdOLFFBQVgsRUFBcUIsR0FBckIsQ0FBWCxDQUFYO0FBQ0Q7O0FBQ0QsU0FBT0EsUUFBUDtBQUNELENBVEQ7QUN4Q0FqRCxHQUFHLENBQUNvQixLQUFKLENBQVV3Qyw0QkFBVixHQUF5QyxTQUFTQSw0QkFBVCxDQUN2Q0MsWUFEdUMsRUFFdkNDLE1BRnVDLEVBR3ZDQyxhQUh1QyxFQUl2Q0MsU0FKdUMsRUFLdkM7QUFDQSxPQUFJLElBQUksQ0FBQ0MsYUFBRCxFQUFnQkMsaUJBQWhCLENBQVIsSUFBOEMxQixNQUFNLENBQUNDLE9BQVAsQ0FBZXFCLE1BQWYsQ0FBOUMsRUFBc0U7QUFDcEUsUUFBSUssU0FBUyxHQUFHRixhQUFhLENBQUNQLEtBQWQsQ0FBb0IsR0FBcEIsQ0FBaEI7QUFDQSxRQUFJVSxtQkFBbUIsR0FBR0QsU0FBUyxDQUFDLENBQUQsQ0FBbkM7QUFDQSxRQUFJRSxTQUFTLEdBQUdGLFNBQVMsQ0FBQyxDQUFELENBQXpCO0FBQ0EsUUFBSUcsWUFBWSxHQUFHdEUsR0FBRyxDQUFDb0IsS0FBSixDQUFVc0IsV0FBVixDQUNqQjBCLG1CQURpQixFQUVqQkwsYUFGaUIsQ0FBbkI7QUFJQU8sSUFBQUEsWUFBWSxHQUFJLENBQUN0RSxHQUFHLENBQUNvQixLQUFKLENBQVVDLE9BQVYsQ0FBa0JpRCxZQUFsQixDQUFGLEdBQ1gsQ0FBQyxDQUFDLEdBQUQsRUFBTUEsWUFBTixDQUFELENBRFcsR0FFWEEsWUFGSjs7QUFHQSxTQUFJLElBQUksQ0FBQ0MsZUFBRCxFQUFrQkMsV0FBbEIsQ0FBUixJQUEwQ0YsWUFBMUMsRUFBd0Q7QUFDdEQsVUFBSUcsZUFBZSxHQUFJWixZQUFZLEtBQUssSUFBbEIsR0FFcEJXLFdBQVcsWUFBWUUsUUFBdkIsSUFFRUYsV0FBVyxZQUFZMUMsV0FBdkIsSUFDQTBDLFdBQVcsWUFBWUcsUUFKekIsR0FNRSxrQkFORixHQU9FLElBUmtCLEdBVXBCSCxXQUFXLFlBQVlFLFFBQXZCLElBRUVGLFdBQVcsWUFBWTFDLFdBQXZCLElBQ0EwQyxXQUFXLFlBQVlHLFFBSnpCLEdBTUUscUJBTkYsR0FPRSxLQWhCSjtBQWlCQSxVQUFJQyxhQUFhLEdBQUc1RSxHQUFHLENBQUNvQixLQUFKLENBQVVzQixXQUFWLENBQ2xCd0IsaUJBRGtCLEVBRWxCRixTQUZrQixFQUdsQixDQUhrQixFQUdmLENBSGUsQ0FBcEI7O0FBSUEsVUFBR1EsV0FBVyxZQUFZRSxRQUExQixFQUFvQztBQUNsQyxhQUFJLElBQUlHLFlBQVIsSUFBd0JMLFdBQXhCLEVBQXFDO0FBQ25DSyxVQUFBQSxZQUFZLENBQUNKLGVBQUQsQ0FBWixDQUE4QkosU0FBOUIsRUFBeUNPLGFBQXpDO0FBQ0Q7QUFDRixPQUpELE1BSU8sSUFBR0osV0FBVyxZQUFZMUMsV0FBMUIsRUFBdUM7QUFDNUMwQyxRQUFBQSxXQUFXLENBQUNDLGVBQUQsQ0FBWCxDQUE2QkosU0FBN0IsRUFBd0NPLGFBQXhDO0FBQ0QsT0FGTSxNQUVBO0FBQ0xKLFFBQUFBLFdBQVcsQ0FBQ0MsZUFBRCxDQUFYLENBQTZCSixTQUE3QixFQUF3Q08sYUFBeEM7QUFDRDtBQUNGO0FBQ0Y7QUFDRixDQWxERDs7QUFtREE1RSxHQUFHLENBQUNvQixLQUFKLENBQVUwRCx5QkFBVixHQUFzQyxTQUFTQSx5QkFBVCxHQUFxQztBQUN6RSxPQUFLbEIsNEJBQUwsQ0FBa0MsSUFBbEMsRUFBd0MsR0FBR3pCLFNBQTNDO0FBQ0QsQ0FGRDs7QUFHQW5DLEdBQUcsQ0FBQ29CLEtBQUosQ0FBVTJELDZCQUFWLEdBQTBDLFNBQVNBLDZCQUFULEdBQXlDO0FBQ2pGLE9BQUtuQiw0QkFBTCxDQUFrQyxLQUFsQyxFQUF5QyxHQUFHekIsU0FBNUM7QUFDRCxDQUZEO0FMdERBbkMsR0FBRyxDQUFDRyxNQUFKLEdBQWEsTUFBTTtBQUNqQjZFLEVBQUFBLFdBQVcsR0FBRyxDQUFFOztBQUNoQixNQUFJQyxPQUFKLEdBQWM7QUFDWixTQUFLbkIsTUFBTCxHQUFlLEtBQUtBLE1BQU4sR0FDVixLQUFLQSxNQURLLEdBRVYsRUFGSjtBQUdBLFdBQU8sS0FBS0EsTUFBWjtBQUNEOztBQUNEb0IsRUFBQUEsaUJBQWlCLENBQUNiLFNBQUQsRUFBWTtBQUFFLFdBQU8sS0FBS1ksT0FBTCxDQUFhWixTQUFiLEtBQTJCLEVBQWxDO0FBQXNDOztBQUNyRWMsRUFBQUEsb0JBQW9CLENBQUNQLGFBQUQsRUFBZ0I7QUFDbEMsV0FBUUEsYUFBYSxDQUFDUSxJQUFkLENBQW1CaEQsTUFBcEIsR0FDSHdDLGFBQWEsQ0FBQ1EsSUFEWCxHQUVILG1CQUZKO0FBR0Q7O0FBQ0RDLEVBQUFBLHFCQUFxQixDQUFDQyxjQUFELEVBQWlCcEIsaUJBQWpCLEVBQW9DO0FBQ3ZELFdBQU9vQixjQUFjLENBQUNwQixpQkFBRCxDQUFkLElBQXFDLEVBQTVDO0FBQ0Q7O0FBQ0RxQixFQUFBQSxFQUFFLENBQUNsQixTQUFELEVBQVlPLGFBQVosRUFBMkI7QUFDM0IsUUFBSVUsY0FBYyxHQUFHLEtBQUtKLGlCQUFMLENBQXVCYixTQUF2QixDQUFyQjtBQUNBLFFBQUlILGlCQUFpQixHQUFHLEtBQUtpQixvQkFBTCxDQUEwQlAsYUFBMUIsQ0FBeEI7QUFDQSxRQUFJWSxrQkFBa0IsR0FBRyxLQUFLSCxxQkFBTCxDQUEyQkMsY0FBM0IsRUFBMkNwQixpQkFBM0MsQ0FBekI7QUFDQXNCLElBQUFBLGtCQUFrQixDQUFDQyxJQUFuQixDQUF3QmIsYUFBeEI7QUFDQVUsSUFBQUEsY0FBYyxDQUFDcEIsaUJBQUQsQ0FBZCxHQUFvQ3NCLGtCQUFwQztBQUNBLFNBQUtQLE9BQUwsQ0FBYVosU0FBYixJQUEwQmlCLGNBQTFCO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBQ0RJLEVBQUFBLEdBQUcsR0FBRztBQUNKLFlBQU92RCxTQUFTLENBQUNDLE1BQWpCO0FBQ0UsV0FBSyxDQUFMO0FBQ0UsZUFBTyxLQUFLNkMsT0FBWjtBQUNBOztBQUNGLFdBQUssQ0FBTDtBQUNFLFlBQUlaLFNBQVMsR0FBR2xDLFNBQVMsQ0FBQyxDQUFELENBQXpCO0FBQ0EsZUFBTyxLQUFLOEMsT0FBTCxDQUFhWixTQUFiLENBQVA7QUFDQTs7QUFDRixXQUFLLENBQUw7QUFDRSxZQUFJQSxTQUFTLEdBQUdsQyxTQUFTLENBQUMsQ0FBRCxDQUF6QjtBQUNBLFlBQUl5QyxhQUFhLEdBQUd6QyxTQUFTLENBQUMsQ0FBRCxDQUE3QjtBQUNBLFlBQUkrQixpQkFBaUIsR0FBSSxPQUFPVSxhQUFQLEtBQXlCLFFBQTFCLEdBQ3BCQSxhQURvQixHQUVwQixLQUFLTyxvQkFBTCxDQUEwQlAsYUFBMUIsQ0FGSjtBQUdBLGVBQU8sS0FBS0ssT0FBTCxDQUFhWixTQUFiLEVBQXdCSCxpQkFBeEIsQ0FBUDtBQUNBLFlBQ0UxQixNQUFNLENBQUNtRCxJQUFQLENBQVksS0FBS1YsT0FBTCxDQUFhWixTQUFiLENBQVosRUFBcUNqQyxNQUFyQyxLQUFnRCxDQURsRCxFQUVFLE9BQU8sS0FBSzZDLE9BQUwsQ0FBYVosU0FBYixDQUFQO0FBQ0Y7QUFsQko7O0FBb0JBLFdBQU8sSUFBUDtBQUNEOztBQUNEdUIsRUFBQUEsSUFBSSxDQUFDdkIsU0FBRCxFQUFZRixTQUFaLEVBQXVCO0FBQ3pCLFFBQUkwQixVQUFVLEdBQUdyRCxNQUFNLENBQUNzRCxNQUFQLENBQWMzRCxTQUFkLENBQWpCOztBQUNBLFFBQUltRCxjQUFjLEdBQUc5QyxNQUFNLENBQUNDLE9BQVAsQ0FDbkIsS0FBS3lDLGlCQUFMLENBQXVCYixTQUF2QixDQURtQixDQUFyQjs7QUFHQSxTQUFJLElBQUksQ0FBQzBCLHNCQUFELEVBQXlCUCxrQkFBekIsQ0FBUixJQUF3REYsY0FBeEQsRUFBd0U7QUFDdEUsV0FBSSxJQUFJVixhQUFSLElBQXlCWSxrQkFBekIsRUFBNkM7QUFDM0MsWUFBSVEsbUJBQW1CLEdBQUdILFVBQVUsQ0FBQzlDLE1BQVgsQ0FBa0IsQ0FBbEIsS0FBd0IsRUFBbEQ7QUFDQTZCLFFBQUFBLGFBQWEsQ0FBQ1QsU0FBRCxFQUFZLEdBQUc2QixtQkFBZixDQUFiO0FBQ0Q7QUFDRjs7QUFDRCxXQUFPLElBQVA7QUFDRDs7QUE3RGdCLENBQW5CO0FBQUFoRyxHQUFHLENBQUNpRyxRQUFKLEdBQWUsTUFBTTtBQUNuQmpCLEVBQUFBLFdBQVcsR0FBRyxDQUFFOztBQUNoQixNQUFJa0IsU0FBSixHQUFnQjtBQUNkLFNBQUtDLFFBQUwsR0FBaUIsS0FBS0EsUUFBTixHQUNaLEtBQUtBLFFBRE8sR0FFWixFQUZKO0FBR0EsV0FBTyxLQUFLQSxRQUFaO0FBQ0Q7O0FBQ0RDLEVBQUFBLE9BQU8sQ0FBQ0MsV0FBRCxFQUFjO0FBQ25CLFNBQUtILFNBQUwsQ0FBZUcsV0FBZixJQUErQixLQUFLSCxTQUFMLENBQWVHLFdBQWYsQ0FBRCxHQUMxQixLQUFLSCxTQUFMLENBQWVHLFdBQWYsQ0FEMEIsR0FFMUIsSUFBSXJHLEdBQUcsQ0FBQ2lHLFFBQUosQ0FBYUssT0FBakIsRUFGSjtBQUdBLFdBQU8sS0FBS0osU0FBTCxDQUFlRyxXQUFmLENBQVA7QUFDRDs7QUFDRFgsRUFBQUEsR0FBRyxDQUFDVyxXQUFELEVBQWM7QUFDZixXQUFPLEtBQUtILFNBQUwsQ0FBZUcsV0FBZixDQUFQO0FBQ0Q7O0FBaEJrQixDQUFyQjtBQUFBckcsR0FBRyxDQUFDaUcsUUFBSixDQUFhSyxPQUFiLEdBQXVCLE1BQU07QUFDM0J0QixFQUFBQSxXQUFXLEdBQUcsQ0FBRTs7QUFDaEIsTUFBSXVCLFVBQUosR0FBaUI7QUFDZixTQUFLQyxTQUFMLEdBQWtCLEtBQUtBLFNBQU4sR0FDYixLQUFLQSxTQURRLEdBRWIsRUFGSjtBQUdBLFdBQU8sS0FBS0EsU0FBWjtBQUNEOztBQUNEQyxFQUFBQSxRQUFRLENBQUNDLFlBQUQsRUFBZUMsZ0JBQWYsRUFBaUM7QUFDdkMsUUFBR0EsZ0JBQUgsRUFBcUI7QUFDbkIsV0FBS0osVUFBTCxDQUFnQkcsWUFBaEIsSUFBZ0NDLGdCQUFoQztBQUNELEtBRkQsTUFFTztBQUNMLGFBQU8sS0FBS0osVUFBTCxDQUFnQkUsUUFBaEIsQ0FBUDtBQUNEO0FBQ0Y7O0FBQ0RHLEVBQUFBLE9BQU8sQ0FBQ0YsWUFBRCxFQUFlRyxXQUFmLEVBQTRCO0FBQ2pDLFFBQUcsS0FBS04sVUFBTCxDQUFnQkcsWUFBaEIsQ0FBSCxFQUFrQztBQUNoQyxhQUFPLEtBQUtILFVBQUwsQ0FBZ0JHLFlBQWhCLEVBQThCRyxXQUE5QixDQUFQO0FBQ0Q7QUFDRjs7QUFDRG5CLEVBQUFBLEdBQUcsQ0FBQ2dCLFlBQUQsRUFBZTtBQUNoQixRQUFHQSxZQUFILEVBQWlCO0FBQ2YsYUFBTyxLQUFLSCxVQUFMLENBQWdCRyxZQUFoQixDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsV0FBSSxJQUFJLENBQUNBLGFBQUQsQ0FBUixJQUEwQmxFLE1BQU0sQ0FBQ21ELElBQVAsQ0FBWSxLQUFLWSxVQUFqQixDQUExQixFQUF3RDtBQUN0RCxlQUFPLEtBQUtBLFVBQUwsQ0FBZ0JHLGFBQWhCLENBQVA7QUFDRDtBQUNGO0FBQ0Y7O0FBNUIwQixDQUE3QjtBQUFBMUcsR0FBRyxDQUFDOEcsSUFBSixHQUFXLGNBQWM5RyxHQUFHLENBQUNHLE1BQWxCLENBQXlCO0FBQ2xDNkUsRUFBQUEsV0FBVyxDQUFDK0IsUUFBRCxFQUFXQyxhQUFYLEVBQTBCO0FBQ25DO0FBQ0EsUUFBR0EsYUFBSCxFQUFrQixLQUFLQyxjQUFMLEdBQXNCRCxhQUF0QjtBQUNsQixRQUFHRCxRQUFILEVBQWEsS0FBS0csU0FBTCxHQUFpQkgsUUFBakI7QUFDZDs7QUFDRCxNQUFJRSxjQUFKLEdBQXFCO0FBQ25CLFNBQUtELGFBQUwsR0FBc0IsS0FBS0EsYUFBTixHQUNqQixLQUFLQSxhQURZLEdBRWpCLEVBRko7QUFHQSxXQUFPLEtBQUtBLGFBQVo7QUFDRDs7QUFDRCxNQUFJQyxjQUFKLENBQW1CRCxhQUFuQixFQUFrQztBQUFFLFNBQUtBLGFBQUwsR0FBcUJBLGFBQXJCO0FBQW9DOztBQUN4RSxNQUFJRSxTQUFKLEdBQWdCO0FBQ2QsU0FBS0gsUUFBTCxHQUFpQixLQUFLQSxRQUFOLEdBQ1osS0FBS0EsUUFETyxHQUVaLEVBRko7QUFHQSxXQUFPLEtBQUtBLFFBQVo7QUFDRDs7QUFDRCxNQUFJRyxTQUFKLENBQWNILFFBQWQsRUFBd0I7QUFDdEIsU0FBS0EsUUFBTCxHQUFnQi9HLEdBQUcsQ0FBQ29CLEtBQUosQ0FBVWEscUJBQVYsQ0FDZDhFLFFBRGMsRUFDSixLQUFLRyxTQURELENBQWhCO0FBR0Q7O0FBQ0QsTUFBSUMsVUFBSixHQUFpQjtBQUNmLFNBQUtDLFNBQUwsR0FBa0IsS0FBS0EsU0FBTixHQUNiLEtBQUtBLFNBRFEsR0FFYixFQUZKO0FBR0EsV0FBTyxLQUFLQSxTQUFaO0FBQ0Q7O0FBQ0QsTUFBSUQsVUFBSixDQUFlQyxTQUFmLEVBQTBCO0FBQ3hCLFNBQUtBLFNBQUwsR0FBaUJwSCxHQUFHLENBQUNvQixLQUFKLENBQVVhLHFCQUFWLENBQ2ZtRixTQURlLEVBQ0osS0FBS0QsVUFERCxDQUFqQjtBQUdEOztBQWxDaUMsQ0FBcEM7QUFBQW5ILEdBQUcsQ0FBQ3FILE9BQUosR0FBYyxjQUFjckgsR0FBRyxDQUFDOEcsSUFBbEIsQ0FBdUI7QUFDbkM5QixFQUFBQSxXQUFXLEdBQUc7QUFDWixVQUFNLEdBQUc3QyxTQUFUO0FBQ0Q7O0FBQ0QsTUFBSW1GLFNBQUosR0FBZ0I7QUFBRSxXQUFPLEtBQUtDLFFBQUwsSUFBaUI7QUFDeENDLE1BQUFBLFdBQVcsRUFBRTtBQUFDLHdCQUFnQjtBQUFqQixPQUQyQjtBQUV4Q0MsTUFBQUEsWUFBWSxFQUFFO0FBRjBCLEtBQXhCO0FBR2Y7O0FBQ0gsTUFBSUMsY0FBSixHQUFxQjtBQUFFLFdBQU8sQ0FBQyxFQUFELEVBQUssYUFBTCxFQUFvQixNQUFwQixFQUE0QixVQUE1QixFQUF3QyxNQUF4QyxFQUFnRCxNQUFoRCxDQUFQO0FBQWdFOztBQUN2RixNQUFJQyxhQUFKLEdBQW9CO0FBQUUsV0FBTyxLQUFLRixZQUFaO0FBQTBCOztBQUNoRCxNQUFJRSxhQUFKLENBQWtCRixZQUFsQixFQUFnQztBQUM5QixTQUFLRyxJQUFMLENBQVVILFlBQVYsR0FBeUIsS0FBS0MsY0FBTCxDQUFvQkcsSUFBcEIsQ0FDdEJDLGdCQUFELElBQXNCQSxnQkFBZ0IsS0FBS0wsWUFEcEIsS0FFcEIsS0FBS0gsU0FBTCxDQUFlRyxZQUZwQjtBQUdEOztBQUNELE1BQUlNLEtBQUosR0FBWTtBQUFFLFdBQU8sS0FBS0MsSUFBWjtBQUFrQjs7QUFDaEMsTUFBSUQsS0FBSixDQUFVQyxJQUFWLEVBQWdCO0FBQUUsU0FBS0EsSUFBTCxHQUFZQSxJQUFaO0FBQWtCOztBQUNwQyxNQUFJQyxJQUFKLEdBQVc7QUFBRSxXQUFPLEtBQUtDLEdBQVo7QUFBaUI7O0FBQzlCLE1BQUlELElBQUosQ0FBU0MsR0FBVCxFQUFjO0FBQUUsU0FBS0EsR0FBTCxHQUFXQSxHQUFYO0FBQWdCOztBQUNoQyxNQUFJQyxRQUFKLEdBQWU7QUFBRSxXQUFPLEtBQUtDLE9BQUwsSUFBZ0IsRUFBdkI7QUFBMkI7O0FBQzVDLE1BQUlELFFBQUosQ0FBYUMsT0FBYixFQUFzQjtBQUNwQixTQUFLRCxRQUFMLENBQWMvRixNQUFkLEdBQXVCLENBQXZCO0FBQ0FnRyxJQUFBQSxPQUFPLENBQUNDLE9BQVIsQ0FBaUJDLE1BQUQsSUFBWTtBQUMxQixXQUFLSCxRQUFMLENBQWMxQyxJQUFkLENBQW1CNkMsTUFBbkI7O0FBQ0FBLE1BQUFBLE1BQU0sR0FBRzlGLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlNkYsTUFBZixFQUF1QixDQUF2QixDQUFUOztBQUNBLFdBQUtWLElBQUwsQ0FBVVcsZ0JBQVYsQ0FBMkJELE1BQU0sQ0FBQyxDQUFELENBQWpDLEVBQXNDQSxNQUFNLENBQUMsQ0FBRCxDQUE1QztBQUNELEtBSkQ7QUFLRDs7QUFDRCxNQUFJRSxLQUFKLEdBQVk7QUFBRSxXQUFPLEtBQUt6RyxJQUFaO0FBQWtCOztBQUNoQyxNQUFJeUcsS0FBSixDQUFVekcsSUFBVixFQUFnQjtBQUFFLFNBQUtBLElBQUwsR0FBWUEsSUFBWjtBQUFrQjs7QUFDcEMsTUFBSTZGLElBQUosR0FBVztBQUNULFNBQUthLEdBQUwsR0FBWSxLQUFLQSxHQUFOLEdBQ1AsS0FBS0EsR0FERSxHQUVQLElBQUlDLGNBQUosRUFGSjtBQUdBLFdBQU8sS0FBS0QsR0FBWjtBQUNEOztBQUNELE1BQUlFLFFBQUosR0FBZTtBQUFFLFdBQU8sS0FBS0MsT0FBTCxJQUFnQixLQUF2QjtBQUE4Qjs7QUFDL0MsTUFBSUQsUUFBSixDQUFhQyxPQUFiLEVBQXNCO0FBQUUsU0FBS0EsT0FBTCxHQUFlQSxPQUFmO0FBQXdCOztBQUNoRGhDLEVBQUFBLE9BQU8sQ0FBQzdFLElBQUQsRUFBTztBQUNaQSxJQUFBQSxJQUFJLEdBQUdBLElBQUksSUFBSSxLQUFLQSxJQUFiLElBQXFCLElBQTVCO0FBQ0EsV0FBTyxJQUFJOEcsT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUN0QyxVQUFHLEtBQUtuQixJQUFMLENBQVVvQixNQUFWLEtBQXFCLEdBQXhCLEVBQTZCLEtBQUtwQixJQUFMLENBQVVxQixLQUFWOztBQUM3QixXQUFLckIsSUFBTCxDQUFVc0IsSUFBVixDQUFlLEtBQUtsQixJQUFwQixFQUEwQixLQUFLRSxHQUEvQjs7QUFDQSxXQUFLQyxRQUFMLEdBQWdCLEtBQUtwQixRQUFMLENBQWNxQixPQUFkLElBQXlCLENBQUMsS0FBS2QsU0FBTCxDQUFlRSxXQUFoQixDQUF6QztBQUNBLFdBQUtJLElBQUwsQ0FBVXVCLE1BQVYsR0FBbUJMLE9BQW5CO0FBQ0EsV0FBS2xCLElBQUwsQ0FBVXdCLE9BQVYsR0FBb0JMLE1BQXBCOztBQUNBLFdBQUtuQixJQUFMLENBQVV5QixJQUFWLENBQWV0SCxJQUFmO0FBQ0QsS0FQTSxFQU9KdUgsSUFQSSxDQU9FN0MsUUFBRCxJQUFjO0FBQ3BCLFdBQUtiLElBQUwsQ0FDRSxhQURGLEVBQ2lCO0FBQ2JSLFFBQUFBLElBQUksRUFBRSxhQURPO0FBRWJyRCxRQUFBQSxJQUFJLEVBQUUwRSxRQUFRLENBQUM4QztBQUZGLE9BRGpCLEVBS0UsSUFMRjtBQU9BLGFBQU85QyxRQUFQO0FBQ0QsS0FoQk0sRUFnQkorQyxLQWhCSSxDQWdCR0MsS0FBRCxJQUFXO0FBQUUsWUFBTUEsS0FBTjtBQUFhLEtBaEI1QixDQUFQO0FBaUJEOztBQUNEQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxRQUFJM0MsUUFBUSxHQUFHLEtBQUtBLFFBQXBCOztBQUNBLFFBQ0UsQ0FBQyxLQUFLNkIsT0FBTixJQUNBcEcsTUFBTSxDQUFDbUQsSUFBUCxDQUFZb0IsUUFBWixFQUFzQjNFLE1BRnhCLEVBR0U7QUFDQSxVQUFHMkUsUUFBUSxDQUFDaUIsSUFBWixFQUFrQixLQUFLRCxLQUFMLEdBQWFoQixRQUFRLENBQUNpQixJQUF0QjtBQUNsQixVQUFHakIsUUFBUSxDQUFDbUIsR0FBWixFQUFpQixLQUFLRCxJQUFMLEdBQVlsQixRQUFRLENBQUNtQixHQUFyQjtBQUNqQixVQUFHbkIsUUFBUSxDQUFDaEYsSUFBWixFQUFrQixLQUFLeUcsS0FBTCxHQUFhekIsUUFBUSxDQUFDaEYsSUFBVCxJQUFpQixJQUE5QjtBQUNsQixVQUFHLEtBQUtnRixRQUFMLENBQWNVLFlBQWpCLEVBQStCLEtBQUtFLGFBQUwsR0FBcUIsS0FBS1QsU0FBTCxDQUFlTyxZQUFwQztBQUMvQixXQUFLa0IsUUFBTCxHQUFnQixJQUFoQjtBQUNEOztBQUNELFdBQU8sSUFBUDtBQUNEOztBQUNEZ0IsRUFBQUEsT0FBTyxHQUFHO0FBQ1IsUUFBSTVDLFFBQVEsR0FBRyxLQUFLQSxRQUFwQjs7QUFDQSxRQUNFLEtBQUs2QixPQUFMLElBQ0FwRyxNQUFNLENBQUNtRCxJQUFQLENBQVlvQixRQUFaLEVBQXNCM0UsTUFGeEIsRUFHRTtBQUNBLGFBQU8sS0FBSzJGLEtBQVo7QUFDQSxhQUFPLEtBQUtFLElBQVo7QUFDQSxhQUFPLEtBQUtPLEtBQVo7QUFDQSxhQUFPLEtBQUtMLFFBQVo7QUFDQSxhQUFPLEtBQUtSLGFBQVo7QUFDQSxXQUFLZ0IsUUFBTCxHQUFnQixLQUFoQjtBQUNEOztBQUNELFdBQU8sSUFBUDtBQUNEOztBQXRGa0MsQ0FBckM7QUFBQTNJLEdBQUcsQ0FBQzRKLFNBQUosR0FBZ0IsTUFBTTtBQUNwQjVFLEVBQUFBLFdBQVcsQ0FBQzZFLE1BQUQsRUFBUztBQUNsQixTQUFLQyxPQUFMLEdBQWVELE1BQWY7QUFDRDs7QUFDRCxNQUFJQyxPQUFKLEdBQWM7QUFBRSxXQUFPLEtBQUtELE1BQVo7QUFBb0I7O0FBQ3BDLE1BQUlDLE9BQUosQ0FBWUQsTUFBWixFQUFvQjtBQUFFLFNBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUFzQjs7QUFDNUMsTUFBSUUsUUFBSixHQUFlO0FBQUUsV0FBTyxLQUFLQyxPQUFaO0FBQXFCOztBQUN0QyxNQUFJRCxRQUFKLENBQWFDLE9BQWIsRUFBc0I7QUFBRSxTQUFLQSxPQUFMLEdBQWVBLE9BQWY7QUFBd0I7O0FBQ2hELE1BQUl4QixLQUFKLEdBQVk7QUFBRSxXQUFPLEtBQUt6RyxJQUFaO0FBQWtCOztBQUNoQyxNQUFJeUcsS0FBSixDQUFVekcsSUFBVixFQUFnQjtBQUFFLFNBQUtBLElBQUwsR0FBWUEsSUFBWjtBQUFrQjs7QUFDcENrSSxFQUFBQSxRQUFRLENBQUNsSSxJQUFELEVBQU87QUFDYixTQUFLeUcsS0FBTCxHQUFhekcsSUFBYjtBQUNBLFFBQUltSSxpQkFBaUIsR0FBRyxFQUF4QjtBQUNBMUgsSUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWUsS0FBS3FILE9BQXBCLEVBQ0d6QixPQURILENBQ1csVUFBaUM7QUFBQSxVQUFoQyxDQUFDOEIsU0FBRCxFQUFZQyxjQUFaLENBQWdDO0FBQ3hDLFVBQUlDLFVBQVUsR0FBRyxFQUFqQjtBQUNBLFVBQUkzSSxLQUFLLEdBQUdLLElBQUksQ0FBQ29JLFNBQUQsQ0FBaEI7QUFDQUUsTUFBQUEsVUFBVSxDQUFDQyxHQUFYLEdBQWlCSCxTQUFqQjs7QUFDQSxVQUFHQyxjQUFjLENBQUNHLFFBQWxCLEVBQTRCO0FBQzFCRixRQUFBQSxVQUFVLENBQUNFLFFBQVgsR0FBc0IsS0FBS0EsUUFBTCxDQUFjN0ksS0FBZCxFQUFxQjBJLGNBQWMsQ0FBQ0csUUFBcEMsQ0FBdEI7QUFDRDs7QUFDRCxVQUFHSCxjQUFjLENBQUNwQyxJQUFsQixFQUF3QjtBQUN0QnFDLFFBQUFBLFVBQVUsQ0FBQ3JDLElBQVgsR0FBa0IsS0FBS0EsSUFBTCxDQUFVdEcsS0FBVixFQUFpQjBJLGNBQWMsQ0FBQ3BDLElBQWhDLENBQWxCO0FBQ0Q7O0FBQ0QsVUFBR29DLGNBQWMsQ0FBQ0ksV0FBbEIsRUFBK0I7QUFDN0IsWUFBSUMscUJBQXFCLEdBQUcsS0FBS0QsV0FBTCxDQUFpQjlJLEtBQWpCLEVBQXdCMEksY0FBYyxDQUFDSSxXQUF2QyxDQUE1QjtBQUNBSCxRQUFBQSxVQUFVLENBQUNHLFdBQVgsR0FBeUIsS0FBS0UsaUJBQUwsQ0FBdUJELHFCQUF2QixDQUF6QjtBQUNEOztBQUNEUCxNQUFBQSxpQkFBaUIsQ0FBQ0MsU0FBRCxDQUFqQixHQUErQkUsVUFBL0I7QUFDRCxLQWhCSDtBQWlCQSxTQUFLTixRQUFMLEdBQWdCRyxpQkFBaEI7QUFDQSxXQUFPQSxpQkFBUDtBQUNEOztBQUNESyxFQUFBQSxRQUFRLENBQUM3SSxLQUFELEVBQVEwSSxjQUFSLEVBQXdCO0FBQzlCLFFBQUlGLGlCQUFpQixHQUFHO0FBQ3RCeEksTUFBQUEsS0FBSyxFQUFFQTtBQURlLEtBQXhCO0FBR0EsUUFBSWlKLFFBQVEsR0FBR25JLE1BQU0sQ0FBQ29JLE1BQVAsQ0FDYjtBQUNFQyxNQUFBQSxJQUFJLEVBQUUsbUJBRFI7QUFFRUMsTUFBQUEsSUFBSSxFQUFFO0FBRlIsS0FEYSxFQUtiVixjQUFjLENBQUNPLFFBTEYsQ0FBZjtBQU9BakosSUFBQUEsS0FBSyxHQUFJQSxLQUFLLEtBQUtFLFNBQW5COztBQUNBLFlBQU81QixHQUFHLENBQUNvQixLQUFKLENBQVVLLE1BQVYsQ0FBaUIySSxjQUFqQixDQUFQO0FBQ0UsV0FBSyxTQUFMO0FBQ0VGLFFBQUFBLGlCQUFpQixDQUFDYSxVQUFsQixHQUErQlgsY0FBL0I7QUFDQUYsUUFBQUEsaUJBQWlCLENBQUNjLE1BQWxCLEdBQTRCdEosS0FBSyxLQUFLMEksY0FBdEM7QUFDQTs7QUFDRixXQUFLLFFBQUw7QUFDRUYsUUFBQUEsaUJBQWlCLENBQUNhLFVBQWxCLEdBQStCWCxjQUFjLENBQUMxSSxLQUE5QztBQUNBd0ksUUFBQUEsaUJBQWlCLENBQUNjLE1BQWxCLEdBQTRCdEosS0FBSyxLQUFLMEksY0FBYyxDQUFDMUksS0FBckQ7QUFDQTtBQVJKOztBQVVBd0ksSUFBQUEsaUJBQWlCLENBQUNlLE9BQWxCLEdBQTZCZixpQkFBaUIsQ0FBQ2MsTUFBbkIsR0FDeEJMLFFBQVEsQ0FBQ0UsSUFEZSxHQUV4QkYsUUFBUSxDQUFDRyxJQUZiO0FBR0EsV0FBT1osaUJBQVA7QUFDRDs7QUFDRGxDLEVBQUFBLElBQUksQ0FBQ3RHLEtBQUQsRUFBUTBJLGNBQVIsRUFBd0I7QUFDMUIsUUFBSUYsaUJBQWlCLEdBQUc7QUFDdEJ4SSxNQUFBQSxLQUFLLEVBQUVBO0FBRGUsS0FBeEI7QUFHQSxRQUFJaUosUUFBUSxHQUFHbkksTUFBTSxDQUFDb0ksTUFBUCxDQUNiO0FBQ0VDLE1BQUFBLElBQUksRUFBRSxhQURSO0FBRUVDLE1BQUFBLElBQUksRUFBRTtBQUZSLEtBRGEsRUFLYlYsY0FBYyxDQUFDTyxRQUxGLENBQWY7O0FBT0EsWUFBTzNLLEdBQUcsQ0FBQ29CLEtBQUosQ0FBVUssTUFBVixDQUFpQjJJLGNBQWpCLENBQVA7QUFDRSxXQUFLLFFBQUw7QUFDRUYsUUFBQUEsaUJBQWlCLENBQUNhLFVBQWxCO0FBQ0FiLFFBQUFBLGlCQUFpQixDQUFDYyxNQUFsQixHQUE0QmhMLEdBQUcsQ0FBQ29CLEtBQUosQ0FBVUssTUFBVixDQUFpQkMsS0FBakIsTUFBNEIwSSxjQUF4RDtBQUNBOztBQUNGLFdBQUssUUFBTDtBQUNFRixRQUFBQSxpQkFBaUIsQ0FBQ2MsTUFBbEIsR0FBNEJoTCxHQUFHLENBQUNvQixLQUFKLENBQVVLLE1BQVYsQ0FBaUJDLEtBQWpCLE1BQTRCMEksY0FBYyxDQUFDMUksS0FBdkU7QUFDQTtBQVBKOztBQVNBd0ksSUFBQUEsaUJBQWlCLENBQUNlLE9BQWxCLEdBQTZCZixpQkFBaUIsQ0FBQ2MsTUFBbkIsR0FDeEJMLFFBQVEsQ0FBQ0UsSUFEZSxHQUV4QkYsUUFBUSxDQUFDRyxJQUZiO0FBR0EsV0FBT1osaUJBQVA7QUFDRDs7QUFDRE0sRUFBQUEsV0FBVyxDQUFDOUksS0FBRCxFQUFROEksV0FBUixFQUFxQjtBQUM5QixXQUFPQSxXQUFXLENBQUN4SCxNQUFaLENBQW1CLENBQUNrSSxZQUFELEVBQWVDLFVBQWYsRUFBMkJDLGVBQTNCLEtBQStDO0FBQ3ZFLFVBQUdwTCxHQUFHLENBQUNvQixLQUFKLENBQVVDLE9BQVYsQ0FBa0I4SixVQUFsQixDQUFILEVBQWtDO0FBQ2hDRCxRQUFBQSxZQUFZLENBQUN6RixJQUFiLENBQ0UsR0FBRyxLQUFLK0UsV0FBTCxDQUFpQjlJLEtBQWpCLEVBQXdCeUosVUFBeEIsQ0FETDtBQUdELE9BSkQsTUFJTztBQUNMQSxRQUFBQSxVQUFVLENBQUN6SixLQUFYLEdBQW1CQSxLQUFuQjtBQUNBLFlBQUkySixlQUFlLEdBQUcsS0FBS0MsYUFBTCxDQUNwQkgsVUFBVSxDQUFDekosS0FEUyxFQUVwQnlKLFVBQVUsQ0FBQ0ksVUFBWCxDQUFzQjdKLEtBRkYsRUFHcEJ5SixVQUFVLENBQUNKLFVBSFMsRUFJcEJJLFVBQVUsQ0FBQ1IsUUFKUyxDQUF0QjtBQU1BUSxRQUFBQSxVQUFVLENBQUNuQixPQUFYLEdBQXFCbUIsVUFBVSxDQUFDbkIsT0FBWCxJQUFzQixFQUEzQztBQUNBbUIsUUFBQUEsVUFBVSxDQUFDbkIsT0FBWCxDQUFtQnRJLEtBQW5CLEdBQTJCMkosZUFBM0I7O0FBQ0FILFFBQUFBLFlBQVksQ0FBQ3pGLElBQWIsQ0FBa0IwRixVQUFsQjtBQUNEOztBQUNELFVBQUdELFlBQVksQ0FBQzlJLE1BQWIsR0FBc0IsQ0FBekIsRUFBNEI7QUFDMUIsWUFBSW9KLGlCQUFpQixHQUFHTixZQUFZLENBQUNFLGVBQUQsQ0FBcEM7O0FBQ0EsWUFBR0ksaUJBQWlCLENBQUNELFVBQWxCLENBQTZCRSxTQUFoQyxFQUEyQztBQUN6QyxjQUFJQyxrQkFBa0IsR0FBR1IsWUFBWSxDQUFDRSxlQUFlLEdBQUcsQ0FBbkIsQ0FBckM7QUFDQSxjQUFJTyxpQ0FBaUMsR0FBSUgsaUJBQWlCLENBQUN4QixPQUFsQixDQUEwQnlCLFNBQTNCLEdBQ3BDRCxpQkFBaUIsQ0FBQ3hCLE9BQWxCLENBQTBCeUIsU0FBMUIsQ0FBb0NULE1BREEsR0FFcENRLGlCQUFpQixDQUFDeEIsT0FBbEIsQ0FBMEJ0SSxLQUExQixDQUFnQ3NKLE1BRnBDO0FBR0EsY0FBSVksbUJBQW1CLEdBQUcsS0FBS0MsaUJBQUwsQ0FDeEJGLGlDQUR3QixFQUV4QkgsaUJBQWlCLENBQUNELFVBQWxCLENBQTZCRSxTQUZMLEVBR3hCRCxpQkFBaUIsQ0FBQ3hCLE9BQWxCLENBQTBCdEksS0FBMUIsQ0FBZ0NzSixNQUhSLEVBSXhCUSxpQkFBaUIsQ0FBQ2IsUUFKTSxDQUExQjtBQU1BYSxVQUFBQSxpQkFBaUIsQ0FBQ3hCLE9BQWxCLEdBQTRCd0IsaUJBQWlCLENBQUN4QixPQUFsQixJQUE2QixFQUF6RDtBQUNBd0IsVUFBQUEsaUJBQWlCLENBQUN4QixPQUFsQixDQUEwQnlCLFNBQTFCLEdBQXNDRyxtQkFBdEM7QUFDRDtBQUNGOztBQUNELGFBQU9WLFlBQVA7QUFDRCxLQW5DTSxFQW1DSixFQW5DSSxDQUFQO0FBb0NEOztBQUNEUixFQUFBQSxpQkFBaUIsQ0FBQ0YsV0FBRCxFQUFjO0FBQzdCLFFBQUlDLHFCQUFxQixHQUFHO0FBQzFCSSxNQUFBQSxJQUFJLEVBQUUsRUFEb0I7QUFFMUJDLE1BQUFBLElBQUksRUFBRTtBQUZvQixLQUE1QjtBQUlBTixJQUFBQSxXQUFXLENBQUNuQyxPQUFaLENBQXFCeUQsb0JBQUQsSUFBMEI7QUFDNUMsVUFBR0Esb0JBQW9CLENBQUM5QixPQUFyQixDQUE2QnlCLFNBQWhDLEVBQTJDO0FBQ3pDLFlBQUdLLG9CQUFvQixDQUFDOUIsT0FBckIsQ0FBNkJ5QixTQUE3QixDQUF1Q1QsTUFBdkMsS0FBa0QsS0FBckQsRUFBNEQ7QUFDMURQLFVBQUFBLHFCQUFxQixDQUFDSyxJQUF0QixDQUEyQnJGLElBQTNCLENBQWdDcUcsb0JBQWhDO0FBQ0QsU0FGRCxNQUVPLElBQUdBLG9CQUFvQixDQUFDOUIsT0FBckIsQ0FBNkJ5QixTQUE3QixDQUF1Q1QsTUFBdkMsS0FBa0QsSUFBckQsRUFBMkQ7QUFDaEVQLFVBQUFBLHFCQUFxQixDQUFDSSxJQUF0QixDQUEyQnBGLElBQTNCLENBQWdDcUcsb0JBQWhDO0FBQ0Q7QUFDRixPQU5ELE1BTU8sSUFBR0Esb0JBQW9CLENBQUM5QixPQUFyQixDQUE2QnRJLEtBQWhDLEVBQXVDO0FBQzVDLFlBQUdvSyxvQkFBb0IsQ0FBQzlCLE9BQXJCLENBQTZCdEksS0FBN0IsQ0FBbUNzSixNQUFuQyxLQUE4QyxLQUFqRCxFQUF3RDtBQUN0RFAsVUFBQUEscUJBQXFCLENBQUNLLElBQXRCLENBQTJCckYsSUFBM0IsQ0FBZ0NxRyxvQkFBaEM7QUFDRCxTQUZELE1BRU8sSUFBR0Esb0JBQW9CLENBQUM5QixPQUFyQixDQUE2QnRJLEtBQTdCLENBQW1Dc0osTUFBbkMsS0FBOEMsSUFBakQsRUFBdUQ7QUFDNURQLFVBQUFBLHFCQUFxQixDQUFDSSxJQUF0QixDQUEyQnBGLElBQTNCLENBQWdDcUcsb0JBQWhDO0FBQ0Q7QUFDRjtBQUNGLEtBZEQ7QUFlQSxXQUFPckIscUJBQVA7QUFDRDs7QUFDRGEsRUFBQUEsYUFBYSxDQUFDNUosS0FBRCxFQUFRcUssUUFBUixFQUFrQmhCLFVBQWxCLEVBQThCSixRQUE5QixFQUF3QztBQUNuRCxRQUFJcUIsZ0JBQUo7O0FBQ0EsWUFBT0QsUUFBUDtBQUNFLFdBQUsvTCxHQUFHLENBQUNFLEtBQUosQ0FBVUcsU0FBVixDQUFvQkMsVUFBcEIsQ0FBK0JDLEVBQXBDO0FBQ0V5TCxRQUFBQSxnQkFBZ0IsR0FBSXRLLEtBQUssSUFBSXFKLFVBQTdCO0FBQ0E7O0FBQ0YsV0FBSy9LLEdBQUcsQ0FBQ0UsS0FBSixDQUFVRyxTQUFWLENBQW9CQyxVQUFwQixDQUErQkUsSUFBcEM7QUFDRXdMLFFBQUFBLGdCQUFnQixHQUFJdEssS0FBSyxLQUFLcUosVUFBOUI7QUFDQTs7QUFDRixXQUFLL0ssR0FBRyxDQUFDRSxLQUFKLENBQVVHLFNBQVYsQ0FBb0JDLFVBQXBCLENBQStCRyxJQUFwQztBQUNFdUwsUUFBQUEsZ0JBQWdCLEdBQUl0SyxLQUFLLElBQUlxSixVQUE3QjtBQUNBOztBQUNGLFdBQUsvSyxHQUFHLENBQUNFLEtBQUosQ0FBVUcsU0FBVixDQUFvQkMsVUFBcEIsQ0FBK0JJLE1BQXBDO0FBQ0VzTCxRQUFBQSxnQkFBZ0IsR0FBSXRLLEtBQUssS0FBS3FKLFVBQTlCO0FBQ0E7O0FBQ0YsV0FBSy9LLEdBQUcsQ0FBQ0UsS0FBSixDQUFVRyxTQUFWLENBQW9CQyxVQUFwQixDQUErQkssRUFBcEM7QUFDRXFMLFFBQUFBLGdCQUFnQixHQUFJdEssS0FBSyxHQUFHcUosVUFBNUI7QUFDQTs7QUFDRixXQUFLL0ssR0FBRyxDQUFDRSxLQUFKLENBQVVHLFNBQVYsQ0FBb0JDLFVBQXBCLENBQStCTSxFQUFwQztBQUNFb0wsUUFBQUEsZ0JBQWdCLEdBQUl0SyxLQUFLLEdBQUdxSixVQUE1QjtBQUNBOztBQUNGLFdBQUsvSyxHQUFHLENBQUNFLEtBQUosQ0FBVUcsU0FBVixDQUFvQkMsVUFBcEIsQ0FBK0JPLEdBQXBDO0FBQ0VtTCxRQUFBQSxnQkFBZ0IsR0FBSXRLLEtBQUssSUFBSXFKLFVBQTdCO0FBQ0E7O0FBQ0YsV0FBSy9LLEdBQUcsQ0FBQ0UsS0FBSixDQUFVRyxTQUFWLENBQW9CQyxVQUFwQixDQUErQlEsR0FBcEM7QUFDRWtMLFFBQUFBLGdCQUFnQixHQUFJdEssS0FBSyxJQUFJcUosVUFBN0I7QUFDQTtBQXhCSjs7QUEwQkEsV0FBTztBQUNMQyxNQUFBQSxNQUFNLEVBQUVnQixnQkFESDtBQUVMZixNQUFBQSxPQUFPLEVBQUdlLGdCQUFELEdBQ0xyQixRQUFRLENBQUNFLElBREosR0FFTEYsUUFBUSxDQUFDRztBQUpSLEtBQVA7QUFNRDs7QUFDRGUsRUFBQUEsaUJBQWlCLENBQUNuSyxLQUFELEVBQVFxSyxRQUFSLEVBQWtCaEIsVUFBbEIsRUFBOEJKLFFBQTlCLEVBQXdDO0FBQ3ZELFFBQUlxQixnQkFBSjs7QUFDQSxZQUFPRCxRQUFQO0FBQ0UsV0FBSy9MLEdBQUcsQ0FBQ0UsS0FBSixDQUFVRyxTQUFWLENBQW9CVSxTQUFwQixDQUE4QkMsR0FBbkM7QUFDRWdMLFFBQUFBLGdCQUFnQixHQUFHdEssS0FBSyxJQUFJcUosVUFBNUI7QUFDQTs7QUFDRixXQUFLL0ssR0FBRyxDQUFDRSxLQUFKLENBQVVHLFNBQVYsQ0FBb0JVLFNBQXBCLENBQThCRSxFQUFuQztBQUNFK0ssUUFBQUEsZ0JBQWdCLEdBQUd0SyxLQUFLLElBQUlxSixVQUE1QjtBQUNBO0FBTko7O0FBUUEsV0FBTztBQUNMQyxNQUFBQSxNQUFNLEVBQUVnQixnQkFESDtBQUVMZixNQUFBQSxPQUFPLEVBQUdlLGdCQUFELEdBQ0xyQixRQUFRLENBQUNFLElBREosR0FFTEYsUUFBUSxDQUFDRztBQUpSLEtBQVA7QUFNRDs7QUFwTW1CLENBQXRCO0FBQUE5SyxHQUFHLENBQUNpTSxLQUFKLEdBQVksY0FBY2pNLEdBQUcsQ0FBQzhHLElBQWxCLENBQXVCO0FBQ2pDOUIsRUFBQUEsV0FBVyxHQUFHO0FBQ1osVUFBTSxHQUFHN0MsU0FBVDtBQUNEOztBQUNELE1BQUkrSixVQUFKLEdBQWlCO0FBQUUsV0FBTyxLQUFLQyxTQUFaO0FBQXVCOztBQUMxQyxNQUFJRCxVQUFKLENBQWVDLFNBQWYsRUFBMEI7QUFBRSxTQUFLQSxTQUFMLEdBQWlCLElBQUluTSxHQUFHLENBQUM0SixTQUFSLENBQWtCdUMsU0FBbEIsQ0FBakI7QUFBK0M7O0FBQzNFLE1BQUlyQyxPQUFKLEdBQWM7QUFBRSxXQUFPLEtBQUtBLE9BQVo7QUFBcUI7O0FBQ3JDLE1BQUlBLE9BQUosQ0FBWUQsTUFBWixFQUFvQjtBQUFFLFNBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUFzQjs7QUFDNUMsTUFBSXVDLFVBQUosR0FBaUI7QUFBRSxXQUFPLEtBQUtDLFNBQVo7QUFBdUI7O0FBQzFDLE1BQUlELFVBQUosQ0FBZUMsU0FBZixFQUEwQjtBQUFFLFNBQUtBLFNBQUwsR0FBaUJBLFNBQWpCO0FBQTRCOztBQUN4RCxNQUFJQyxTQUFKLEdBQWdCO0FBQ2QsU0FBS0MsUUFBTCxHQUFpQixLQUFLQSxRQUFOLEdBQ1osS0FBS0EsUUFETyxHQUVaLEVBRko7QUFHQSxXQUFPLEtBQUtBLFFBQVo7QUFDRDs7QUFDRCxNQUFJQyxhQUFKLEdBQW9CO0FBQUUsV0FBTyxLQUFLQyxZQUFaO0FBQTBCOztBQUNoRCxNQUFJRCxhQUFKLENBQWtCQyxZQUFsQixFQUFnQztBQUFFLFNBQUtBLFlBQUwsR0FBb0JBLFlBQXBCO0FBQWtDOztBQUNwRSxNQUFJbkYsU0FBSixHQUFnQjtBQUFFLFdBQU8sS0FBS0MsUUFBWjtBQUFzQjs7QUFDeEMsTUFBSUQsU0FBSixDQUFjQyxRQUFkLEVBQXdCO0FBQUUsU0FBS0EsUUFBTCxHQUFnQkEsUUFBaEI7QUFBMEI7O0FBQ3BELE1BQUltRixXQUFKLEdBQWtCO0FBQUUsV0FBTyxLQUFLQyxVQUFMLElBQW1CO0FBQzVDdkssTUFBQUEsTUFBTSxFQUFFO0FBRG9DLEtBQTFCO0FBRWpCOztBQUNILE1BQUlzSyxXQUFKLENBQWdCQyxVQUFoQixFQUE0QjtBQUMxQixTQUFLQSxVQUFMLEdBQWtCbkssTUFBTSxDQUFDb0ksTUFBUCxDQUNoQixLQUFLOEIsV0FEVyxFQUVoQkMsVUFGZ0IsQ0FBbEI7QUFJRDs7QUFDRCxNQUFJQyxRQUFKLEdBQWU7QUFDYixTQUFLQyxPQUFMLEdBQWdCLEtBQUtBLE9BQU4sR0FDWCxLQUFLQSxPQURNLEdBRVgsRUFGSjtBQUdBLFdBQU8sS0FBS0EsT0FBWjtBQUNEOztBQUNELE1BQUlELFFBQUosQ0FBYTdLLElBQWIsRUFBbUI7QUFDakIsUUFDRVMsTUFBTSxDQUFDbUQsSUFBUCxDQUFZNUQsSUFBWixFQUFrQkssTUFEcEIsRUFFRTtBQUNBLFVBQUcsS0FBS3NLLFdBQUwsQ0FBaUJ0SyxNQUFwQixFQUE0QjtBQUMxQixhQUFLd0ssUUFBTCxDQUFjRSxPQUFkLENBQXNCLEtBQUtDLEtBQUwsQ0FBV2hMLElBQVgsQ0FBdEI7O0FBQ0EsYUFBSzZLLFFBQUwsQ0FBYzdKLE1BQWQsQ0FBcUIsS0FBSzJKLFdBQUwsQ0FBaUJ0SyxNQUF0QztBQUNEO0FBQ0Y7QUFDRjs7QUFDRCxNQUFJNEssR0FBSixHQUFVO0FBQ1IsUUFBSUMsRUFBRSxHQUFHUixZQUFZLENBQUNTLE9BQWIsQ0FBcUIsS0FBS1QsWUFBTCxDQUFrQlUsUUFBdkMsQ0FBVDtBQUNBLFNBQUtGLEVBQUwsR0FBV0EsRUFBRCxHQUNOQSxFQURNLEdBRU4sSUFGSjtBQUdBLFdBQU9HLElBQUksQ0FBQ0wsS0FBTCxDQUFXLEtBQUtFLEVBQWhCLENBQVA7QUFDRDs7QUFDRCxNQUFJRCxHQUFKLENBQVFDLEVBQVIsRUFBWTtBQUNWQSxJQUFBQSxFQUFFLEdBQUdHLElBQUksQ0FBQ0MsU0FBTCxDQUFlSixFQUFmLENBQUw7QUFDQVIsSUFBQUEsWUFBWSxDQUFDYSxPQUFiLENBQXFCLEtBQUtiLFlBQUwsQ0FBa0JVLFFBQXZDLEVBQWlERixFQUFqRDtBQUNEOztBQUNELE1BQUl6RSxLQUFKLEdBQVk7QUFDVixTQUFLekcsSUFBTCxHQUFjLEtBQUtBLElBQU4sR0FDVCxLQUFLQSxJQURJLEdBRVQsRUFGSjtBQUdBLFdBQU8sS0FBS0EsSUFBWjtBQUNEOztBQUNELE1BQUl3TCxXQUFKLEdBQWtCO0FBQ2hCLFNBQUtDLFVBQUwsR0FBbUIsS0FBS0EsVUFBTixHQUNkLEtBQUtBLFVBRFMsR0FFZCxFQUZKO0FBR0EsV0FBTyxLQUFLQSxVQUFaO0FBQ0Q7O0FBQ0QsTUFBSUQsV0FBSixDQUFnQkMsVUFBaEIsRUFBNEI7QUFDMUIsU0FBS0EsVUFBTCxHQUFrQnhOLEdBQUcsQ0FBQ29CLEtBQUosQ0FBVWEscUJBQVYsQ0FDaEJ1TCxVQURnQixFQUNKLEtBQUtELFdBREQsQ0FBbEI7QUFHRDs7QUFDRCxNQUFJRSxjQUFKLEdBQXFCO0FBQ25CLFNBQUtDLGFBQUwsR0FBc0IsS0FBS0EsYUFBTixHQUNqQixLQUFLQSxhQURZLEdBRWpCLEVBRko7QUFHQSxXQUFPLEtBQUtBLGFBQVo7QUFDRDs7QUFDRCxNQUFJRCxjQUFKLENBQW1CQyxhQUFuQixFQUFrQztBQUNoQyxTQUFLQSxhQUFMLEdBQXFCMU4sR0FBRyxDQUFDb0IsS0FBSixDQUFVYSxxQkFBVixDQUNuQnlMLGFBRG1CLEVBQ0osS0FBS0QsY0FERCxDQUFyQjtBQUdEOztBQUNELE1BQUlFLFNBQUosR0FBZ0I7QUFDZCxTQUFLQyxRQUFMLEdBQWtCLEtBQUtBLFFBQU4sR0FDYixLQUFLQSxRQURRLEdBRWIsRUFGSjtBQUdBLFdBQU8sS0FBS0EsUUFBWjtBQUNEOztBQUNELE1BQUlELFNBQUosQ0FBY0MsUUFBZCxFQUF3QjtBQUN0QixTQUFLQSxRQUFMLEdBQWdCNU4sR0FBRyxDQUFDb0IsS0FBSixDQUFVYSxxQkFBVixDQUNkMkwsUUFEYyxFQUNKLEtBQUtELFNBREQsQ0FBaEI7QUFHRDs7QUFDRCxNQUFJRSxjQUFKLEdBQXFCO0FBQ25CLFNBQUtDLGFBQUwsR0FBc0IsS0FBS0EsYUFBTixHQUNqQixLQUFLQSxhQURZLEdBRWpCLEVBRko7QUFHQSxXQUFPLEtBQUtBLGFBQVo7QUFDRDs7QUFDRCxNQUFJRCxjQUFKLENBQW1CQyxhQUFuQixFQUFrQztBQUNoQyxTQUFLQSxhQUFMLEdBQXFCOU4sR0FBRyxDQUFDb0IsS0FBSixDQUFVYSxxQkFBVixDQUNuQjZMLGFBRG1CLEVBQ0osS0FBS0QsY0FERCxDQUFyQjtBQUdEOztBQUNELE1BQUlFLGlCQUFKLEdBQXdCO0FBQ3RCLFNBQUtDLGdCQUFMLEdBQXlCLEtBQUtBLGdCQUFOLEdBQ3BCLEtBQUtBLGdCQURlLEdBRXBCLEVBRko7QUFHQSxXQUFPLEtBQUtBLGdCQUFaO0FBQ0Q7O0FBQ0QsTUFBSUQsaUJBQUosQ0FBc0JDLGdCQUF0QixFQUF3QztBQUN0QyxTQUFLQSxnQkFBTCxHQUF3QmhPLEdBQUcsQ0FBQ29CLEtBQUosQ0FBVWEscUJBQVYsQ0FDdEIrTCxnQkFEc0IsRUFDSixLQUFLRCxpQkFERCxDQUF4QjtBQUdEOztBQUNELE1BQUlwRixRQUFKLEdBQWU7QUFBRSxXQUFPLEtBQUtDLE9BQUwsSUFBZ0IsS0FBdkI7QUFBOEI7O0FBQy9DLE1BQUlELFFBQUosQ0FBYUMsT0FBYixFQUFzQjtBQUFFLFNBQUtBLE9BQUwsR0FBZUEsT0FBZjtBQUF3Qjs7QUFDaERxRixFQUFBQSxHQUFHLEdBQUc7QUFDSixZQUFPOUwsU0FBUyxDQUFDQyxNQUFqQjtBQUNFLFdBQUssQ0FBTDtBQUNFLGVBQU8sS0FBS0wsSUFBWjtBQUNBOztBQUNGLFdBQUssQ0FBTDtBQUNFLFlBQUl1SSxHQUFHLEdBQUduSSxTQUFTLENBQUMsQ0FBRCxDQUFuQjtBQUNBLGVBQU8sS0FBS0osSUFBTCxDQUFVdUksR0FBVixDQUFQO0FBQ0E7QUFQSjtBQVNEOztBQUNENEQsRUFBQUEsR0FBRyxHQUFHO0FBQ0osU0FBS3RCLFFBQUwsR0FBZ0IsS0FBS0csS0FBTCxFQUFoQjs7QUFDQSxZQUFPNUssU0FBUyxDQUFDQyxNQUFqQjtBQUNFLFdBQUssQ0FBTDtBQUNFLGFBQUtnSyxVQUFMLEdBQWtCLElBQWxCOztBQUNBLFlBQUl2RyxVQUFVLEdBQUdyRCxNQUFNLENBQUNDLE9BQVAsQ0FBZU4sU0FBUyxDQUFDLENBQUQsQ0FBeEIsQ0FBakI7O0FBQ0EwRCxRQUFBQSxVQUFVLENBQUN3QyxPQUFYLENBQW1CLE9BQWU4RixLQUFmLEtBQXlCO0FBQUEsY0FBeEIsQ0FBQzdELEdBQUQsRUFBTTVJLEtBQU4sQ0FBd0I7QUFDMUMsY0FBR3lNLEtBQUssS0FBTXRJLFVBQVUsQ0FBQ3pELE1BQVgsR0FBb0IsQ0FBbEMsRUFBc0MsS0FBS2dLLFVBQUwsR0FBa0IsS0FBbEI7QUFDdEMsZUFBS2dDLGVBQUwsQ0FBcUI5RCxHQUFyQixFQUEwQjVJLEtBQTFCO0FBQ0QsU0FIRDs7QUFJQTs7QUFDRixXQUFLLENBQUw7QUFDRSxZQUFJNEksR0FBRyxHQUFHbkksU0FBUyxDQUFDLENBQUQsQ0FBbkI7QUFDQSxZQUFJVCxLQUFLLEdBQUdTLFNBQVMsQ0FBQyxDQUFELENBQXJCO0FBQ0EsYUFBS2lNLGVBQUwsQ0FBcUI5RCxHQUFyQixFQUEwQjVJLEtBQTFCO0FBQ0E7QUFiSjs7QUFlQSxRQUFHLEtBQUt5SyxTQUFSLEVBQW1CO0FBQ2pCLFVBQUlrQyxnQkFBZ0IsR0FBRyxLQUFLakgsU0FBTCxDQUFlNkMsUUFBdEM7O0FBQ0EsV0FBS2lDLFVBQUwsQ0FBZ0JqQyxRQUFoQixDQUNFbUQsSUFBSSxDQUFDTCxLQUFMLENBQVdLLElBQUksQ0FBQ0MsU0FBTCxDQUFlLEtBQUt0TCxJQUFwQixDQUFYLENBREY7O0FBR0FzTSxNQUFBQSxnQkFBZ0IsQ0FBQ0gsR0FBakIsQ0FBcUI7QUFDbkJuTSxRQUFBQSxJQUFJLEVBQUUsS0FBS29LLFNBQUwsQ0FBZXBLLElBREY7QUFFbkJpSSxRQUFBQSxPQUFPLEVBQUUsS0FBS21DLFNBQUwsQ0FBZW5DO0FBRkwsT0FBckI7QUFJQSxXQUFLcEUsSUFBTCxDQUNFeUksZ0JBQWdCLENBQUNqSixJQURuQixFQUVFaUosZ0JBQWdCLENBQUNDLFFBQWpCLEVBRkYsRUFHRSxJQUhGO0FBS0Q7O0FBQ0QsV0FBTyxJQUFQO0FBQ0Q7O0FBQ0RDLEVBQUFBLEtBQUssR0FBRztBQUNOLFNBQUszQixRQUFMLEdBQWdCLEtBQUtHLEtBQUwsRUFBaEI7O0FBQ0EsWUFBTzVLLFNBQVMsQ0FBQ0MsTUFBakI7QUFDRSxXQUFLLENBQUw7QUFDRSxhQUFJLElBQUlrSSxJQUFSLElBQWU5SCxNQUFNLENBQUNtRCxJQUFQLENBQVksS0FBSzZDLEtBQWpCLENBQWYsRUFBd0M7QUFDdEMsZUFBS2dHLGlCQUFMLENBQXVCbEUsSUFBdkI7QUFDRDs7QUFDRDs7QUFDRixXQUFLLENBQUw7QUFDRSxZQUFJQSxHQUFHLEdBQUduSSxTQUFTLENBQUMsQ0FBRCxDQUFuQjtBQUNBLGFBQUtxTSxpQkFBTCxDQUF1QmxFLEdBQXZCO0FBQ0E7QUFUSjs7QUFXQSxXQUFPLElBQVA7QUFDRDs7QUFDRG1FLEVBQUFBLEtBQUssR0FBRztBQUNOLFFBQUl4QixFQUFFLEdBQUcsS0FBS0QsR0FBZDs7QUFDQSxZQUFPN0ssU0FBUyxDQUFDQyxNQUFqQjtBQUNFLFdBQUssQ0FBTDtBQUNFLFlBQUl5RCxVQUFVLEdBQUdyRCxNQUFNLENBQUNDLE9BQVAsQ0FBZU4sU0FBUyxDQUFDLENBQUQsQ0FBeEIsQ0FBakI7O0FBQ0EwRCxRQUFBQSxVQUFVLENBQUN3QyxPQUFYLENBQW1CLFdBQWtCO0FBQUEsY0FBakIsQ0FBQ2lDLEdBQUQsRUFBTTVJLEtBQU4sQ0FBaUI7QUFDbkN1TCxVQUFBQSxFQUFFLENBQUMzQyxHQUFELENBQUYsR0FBVTVJLEtBQVY7QUFDRCxTQUZEOztBQUdBOztBQUNGLFdBQUssQ0FBTDtBQUNFLFlBQUk0SSxHQUFHLEdBQUduSSxTQUFTLENBQUMsQ0FBRCxDQUFuQjtBQUNBLFlBQUlULEtBQUssR0FBR1MsU0FBUyxDQUFDLENBQUQsQ0FBckI7QUFDQThLLFFBQUFBLEVBQUUsQ0FBQzNDLEdBQUQsQ0FBRixHQUFVNUksS0FBVjtBQUNBO0FBWEo7O0FBYUEsU0FBS3NMLEdBQUwsR0FBV0MsRUFBWDtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUNEeUIsRUFBQUEsT0FBTyxHQUFHO0FBQ1IsWUFBT3ZNLFNBQVMsQ0FBQ0MsTUFBakI7QUFDRSxXQUFLLENBQUw7QUFDRSxlQUFPLEtBQUs0SyxHQUFaO0FBQ0E7O0FBQ0YsV0FBSyxDQUFMO0FBQ0UsWUFBSUMsRUFBRSxHQUFHLEtBQUtELEdBQWQ7QUFDQSxZQUFJMUMsR0FBRyxHQUFHbkksU0FBUyxDQUFDLENBQUQsQ0FBbkI7QUFDQSxlQUFPOEssRUFBRSxDQUFDM0MsR0FBRCxDQUFUO0FBQ0EsYUFBSzBDLEdBQUwsR0FBV0MsRUFBWDtBQUNBO0FBVEo7O0FBV0EsV0FBTyxJQUFQO0FBQ0Q7O0FBQ0RtQixFQUFBQSxlQUFlLENBQUM5RCxHQUFELEVBQU01SSxLQUFOLEVBQWE7QUFDMUIsUUFBRyxDQUFDLEtBQUs4RyxLQUFMLENBQVcsSUFBSWpGLE1BQUosQ0FBVytHLEdBQVgsQ0FBWCxDQUFKLEVBQWlDO0FBQy9CLFVBQUkxSCxPQUFPLEdBQUcsSUFBZDtBQUNBSixNQUFBQSxNQUFNLENBQUNtTSxnQkFBUCxDQUNFLEtBQUtuRyxLQURQLEVBRUU7QUFDRSxTQUFDLElBQUlqRixNQUFKLENBQVcrRyxHQUFYLENBQUQsR0FBbUI7QUFDakJzRSxVQUFBQSxZQUFZLEVBQUUsSUFERzs7QUFFakJYLFVBQUFBLEdBQUcsR0FBRztBQUFFLG1CQUFPLEtBQUszRCxHQUFMLENBQVA7QUFBa0IsV0FGVDs7QUFHakI0RCxVQUFBQSxHQUFHLENBQUN4TSxLQUFELEVBQVE7QUFDVCxnQkFBSWtFLElBQUksR0FBRyxJQUFJaUosT0FBSixFQUFYO0FBQ0EsZ0JBQUloRixNQUFNLEdBQUdqSCxPQUFPLENBQUNzRSxTQUFSLENBQWtCMkMsTUFBL0I7O0FBQ0EsZ0JBQ0VBLE1BQU0sSUFDTkEsTUFBTSxDQUFDUyxHQUFELENBRlIsRUFHRTtBQUNBLG1CQUFLQSxHQUFMLElBQVk1SSxLQUFaO0FBQ0FrQixjQUFBQSxPQUFPLENBQUMwSixTQUFSLENBQWtCaEMsR0FBbEIsSUFBeUI1SSxLQUF6QjtBQUNBLGtCQUFHLEtBQUsrSyxZQUFSLEVBQXNCN0osT0FBTyxDQUFDNkwsS0FBUixDQUFjbkUsR0FBZCxFQUFtQjVJLEtBQW5CO0FBQ3ZCLGFBUEQsTUFPTyxJQUFHLENBQUNtSSxNQUFKLEVBQVk7QUFDakIsbUJBQUtTLEdBQUwsSUFBWTVJLEtBQVo7QUFDQWtCLGNBQUFBLE9BQU8sQ0FBQzBKLFNBQVIsQ0FBa0JoQyxHQUFsQixJQUF5QjVJLEtBQXpCO0FBQ0Esa0JBQUcsS0FBSytLLFlBQVIsRUFBc0I3SixPQUFPLENBQUM2TCxLQUFSLENBQWNuRSxHQUFkLEVBQW1CNUksS0FBbkI7QUFDdkI7O0FBQ0QsZ0JBQUlvTixpQkFBaUIsR0FBRyxDQUFDLEtBQUQsRUFBUSxHQUFSLEVBQWF4RSxHQUFiLEVBQWtCeUUsSUFBbEIsQ0FBdUIsRUFBdkIsQ0FBeEI7QUFDQSxnQkFBSUMsWUFBWSxHQUFHLEtBQW5CO0FBQ0FwTSxZQUFBQSxPQUFPLENBQUNnRCxJQUFSLENBQ0VrSixpQkFERixFQUVFO0FBQ0UxSixjQUFBQSxJQUFJLEVBQUUwSixpQkFEUjtBQUVFL00sY0FBQUEsSUFBSSxFQUFFO0FBQ0p1SSxnQkFBQUEsR0FBRyxFQUFFQSxHQUREO0FBRUo1SSxnQkFBQUEsS0FBSyxFQUFFQTtBQUZIO0FBRlIsYUFGRixFQVNFa0IsT0FURjs7QUFXQSxnQkFBRyxDQUFDQSxPQUFPLENBQUN3SixVQUFaLEVBQXdCO0FBQ3RCLGtCQUFHLENBQUM1SixNQUFNLENBQUNzRCxNQUFQLENBQWNsRCxPQUFPLENBQUMwSixTQUF0QixFQUFpQ2xLLE1BQXJDLEVBQTZDO0FBQzNDUSxnQkFBQUEsT0FBTyxDQUFDZ0QsSUFBUixDQUNFb0osWUFERixFQUVFO0FBQ0U1SixrQkFBQUEsSUFBSSxFQUFFNEosWUFEUjtBQUVFak4sa0JBQUFBLElBQUksRUFBRTtBQUNKdUksb0JBQUFBLEdBQUcsRUFBRUEsR0FERDtBQUVKNUksb0JBQUFBLEtBQUssRUFBRUE7QUFGSDtBQUZSLGlCQUZGLEVBU0VrQixPQVRGO0FBV0QsZUFaRCxNQVlPO0FBQ0xBLGdCQUFBQSxPQUFPLENBQUNnRCxJQUFSLENBQ0VvSixZQURGLEVBRUU7QUFDRTVKLGtCQUFBQSxJQUFJLEVBQUU0SixZQURSO0FBRUVqTixrQkFBQUEsSUFBSSxFQUFFYSxPQUFPLENBQUMwSjtBQUZoQixpQkFGRixFQU1FMUosT0FORjtBQVFEOztBQUNELHFCQUFPQSxPQUFPLENBQUMySixRQUFmO0FBQ0Q7QUFDRjs7QUF4RGdCO0FBRHJCLE9BRkY7QUErREQ7O0FBQ0QsU0FBSy9ELEtBQUwsQ0FBVyxJQUFJakYsTUFBSixDQUFXK0csR0FBWCxDQUFYLElBQThCNUksS0FBOUI7QUFDQSxXQUFPLElBQVA7QUFDRDs7QUFDRDhNLEVBQUFBLGlCQUFpQixDQUFDbEUsR0FBRCxFQUFNO0FBQ3JCLFFBQUkyRSxtQkFBbUIsR0FBRyxDQUFDLE9BQUQsRUFBVSxHQUFWLEVBQWUzRSxHQUFmLEVBQW9CeUUsSUFBcEIsQ0FBeUIsRUFBekIsQ0FBMUI7QUFDQSxRQUFJRyxjQUFjLEdBQUcsT0FBckI7QUFDQSxRQUFJQyxVQUFVLEdBQUcsS0FBSzNHLEtBQUwsQ0FBVzhCLEdBQVgsQ0FBakI7QUFDQSxXQUFPLEtBQUs5QixLQUFMLENBQVcsSUFBSWpGLE1BQUosQ0FBVytHLEdBQVgsQ0FBWCxDQUFQO0FBQ0EsV0FBTyxLQUFLOUIsS0FBTCxDQUFXOEIsR0FBWCxDQUFQO0FBQ0EsU0FBSzFFLElBQUwsQ0FDRXFKLG1CQURGLEVBRUU7QUFDRTdKLE1BQUFBLElBQUksRUFBRTZKLG1CQURSO0FBRUVsTixNQUFBQSxJQUFJLEVBQUU7QUFDSnVJLFFBQUFBLEdBQUcsRUFBRUEsR0FERDtBQUVKNUksUUFBQUEsS0FBSyxFQUFFeU47QUFGSDtBQUZSLEtBRkYsRUFTRSxJQVRGO0FBV0EsU0FBS3ZKLElBQUwsQ0FDRXNKLGNBREYsRUFFRTtBQUNFOUosTUFBQUEsSUFBSSxFQUFFOEosY0FEUjtBQUVFbk4sTUFBQUEsSUFBSSxFQUFFO0FBQ0p1SSxRQUFBQSxHQUFHLEVBQUVBLEdBREQ7QUFFSjVJLFFBQUFBLEtBQUssRUFBRXlOO0FBRkg7QUFGUixLQUZGLEVBU0UsSUFURjtBQVdBLFdBQU8sSUFBUDtBQUNEOztBQUNEQyxFQUFBQSxXQUFXLEdBQUc7QUFDWixRQUFJOUgsU0FBUyxHQUFHLEVBQWhCO0FBQ0EsUUFBRyxLQUFLQyxRQUFSLEVBQWtCL0UsTUFBTSxDQUFDb0ksTUFBUCxDQUFjdEQsU0FBZCxFQUF5QixLQUFLQyxRQUE5QjtBQUNsQixRQUFHLEtBQUtrRixZQUFSLEVBQXNCakssTUFBTSxDQUFDb0ksTUFBUCxDQUFjdEQsU0FBZCxFQUF5QixLQUFLMEYsR0FBOUI7QUFDdEIsUUFBR3hLLE1BQU0sQ0FBQ21ELElBQVAsQ0FBWTJCLFNBQVosQ0FBSCxFQUEyQixLQUFLNEcsR0FBTCxDQUFTNUcsU0FBVDtBQUM1Qjs7QUFDRCtILEVBQUFBLG1CQUFtQixHQUFHO0FBQ3BCclAsSUFBQUEsR0FBRyxDQUFDb0IsS0FBSixDQUFVMEQseUJBQVYsQ0FBb0MsS0FBS2dKLGFBQXpDLEVBQXdELEtBQUtGLFFBQTdELEVBQXVFLEtBQUtJLGdCQUE1RTtBQUNEOztBQUNEc0IsRUFBQUEsb0JBQW9CLEdBQUc7QUFDckJ0UCxJQUFBQSxHQUFHLENBQUNvQixLQUFKLENBQVUyRCw2QkFBVixDQUF3QyxLQUFLK0ksYUFBN0MsRUFBNEQsS0FBS0YsUUFBakUsRUFBMkUsS0FBS0ksZ0JBQWhGO0FBQ0Q7O0FBQ0R1QixFQUFBQSxnQkFBZ0IsR0FBRztBQUNqQnZQLElBQUFBLEdBQUcsQ0FBQ29CLEtBQUosQ0FBVTBELHlCQUFWLENBQW9DLEtBQUswSSxVQUF6QyxFQUFxRCxJQUFyRCxFQUEyRCxLQUFLRSxhQUFoRTtBQUNEOztBQUNEOEIsRUFBQUEsaUJBQWlCLEdBQUc7QUFDbEJ4UCxJQUFBQSxHQUFHLENBQUNvQixLQUFKLENBQVUyRCw2QkFBVixDQUF3QyxLQUFLeUksVUFBN0MsRUFBeUQsSUFBekQsRUFBK0QsS0FBS0UsYUFBcEU7QUFDRDs7QUFDRCtCLEVBQUFBLGVBQWUsR0FBRztBQUNoQmpOLElBQUFBLE1BQU0sQ0FBQ29JLE1BQVAsQ0FDRSxLQUFLekQsVUFEUCxFQUVFLEtBQUtKLFFBQUwsQ0FBY0ssU0FGaEIsRUFHRTtBQUNFNkMsTUFBQUEsUUFBUSxFQUFFLElBQUlqSyxHQUFHLENBQUMwUCxTQUFKLENBQWNDLFFBQWxCO0FBRFosS0FIRjtBQU9BLFdBQU8sSUFBUDtBQUNEOztBQUNEQyxFQUFBQSxnQkFBZ0IsR0FBRztBQUNqQixXQUFPLEtBQUt6SSxVQUFaO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBQ0R1QyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxRQUFJM0MsUUFBUSxHQUFHLEtBQUtBLFFBQXBCOztBQUNBLFFBQ0VBLFFBQVEsSUFDUixDQUFDLEtBQUs2QixPQUZSLEVBR0U7QUFDQSxXQUFLNkcsZUFBTDs7QUFDQSxVQUFHLEtBQUsxSSxRQUFMLENBQWM4QyxNQUFqQixFQUF5QjtBQUN2QixhQUFLcUMsVUFBTCxHQUFrQixLQUFLbkYsUUFBTCxDQUFjOEMsTUFBaEM7QUFDRDs7QUFDRCxVQUFHLEtBQUs5QyxRQUFMLENBQWMwRixZQUFqQixFQUErQixLQUFLRCxhQUFMLEdBQXFCLEtBQUt6RixRQUFMLENBQWMwRixZQUFuQztBQUMvQixVQUFHLEtBQUsxRixRQUFMLENBQWM0RixVQUFqQixFQUE2QixLQUFLRCxXQUFMLEdBQW1CLEtBQUszRixRQUFMLENBQWM0RixVQUFqQztBQUM3QixVQUFHLEtBQUs1RixRQUFMLENBQWM2RyxRQUFqQixFQUEyQixLQUFLRCxTQUFMLEdBQWlCLEtBQUs1RyxRQUFMLENBQWM2RyxRQUEvQjtBQUMzQixVQUFHLEtBQUs3RyxRQUFMLENBQWNpSCxnQkFBakIsRUFBbUMsS0FBS0QsaUJBQUwsR0FBeUIsS0FBS2hILFFBQUwsQ0FBY2lILGdCQUF2QztBQUNuQyxVQUFHLEtBQUtqSCxRQUFMLENBQWMrRyxhQUFqQixFQUFnQyxLQUFLRCxjQUFMLEdBQXNCLEtBQUs5RyxRQUFMLENBQWMrRyxhQUFwQztBQUNoQyxVQUFHLEtBQUsvRyxRQUFMLENBQWNoRixJQUFqQixFQUF1QixLQUFLbU0sR0FBTCxDQUFTLEtBQUtuSCxRQUFMLENBQWNoRixJQUF2QjtBQUN2QixVQUFHLEtBQUtnRixRQUFMLENBQWMyRyxhQUFqQixFQUFnQyxLQUFLRCxjQUFMLEdBQXNCLEtBQUsxRyxRQUFMLENBQWMyRyxhQUFwQztBQUNoQyxVQUFHLEtBQUszRyxRQUFMLENBQWN5RyxVQUFqQixFQUE2QixLQUFLRCxXQUFMLEdBQW1CLEtBQUt4RyxRQUFMLENBQWN5RyxVQUFqQztBQUM3QixVQUFHLEtBQUt6RyxRQUFMLENBQWNRLFFBQWpCLEVBQTJCLEtBQUtELFNBQUwsR0FBaUIsS0FBS1AsUUFBTCxDQUFjUSxRQUEvQjs7QUFDM0IsVUFDRSxLQUFLcUcsUUFBTCxJQUNBLEtBQUtFLGFBREwsSUFFQSxLQUFLRSxnQkFIUCxFQUlFO0FBQ0EsYUFBS3FCLG1CQUFMO0FBQ0Q7O0FBQ0QsVUFDRSxLQUFLN0IsVUFBTCxJQUNBLEtBQUtFLGFBRlAsRUFHRTtBQUNBLGFBQUs2QixnQkFBTDtBQUNEOztBQUNELFdBQUs1RyxRQUFMLEdBQWdCLElBQWhCO0FBQ0Q7O0FBQ0QsV0FBTyxJQUFQO0FBQ0Q7O0FBQ0RnQixFQUFBQSxPQUFPLEdBQUc7QUFDUixRQUFJNUMsUUFBUSxHQUFHLEtBQUtBLFFBQXBCOztBQUNBLFFBQ0VBLFFBQVEsSUFDUixDQUFDLEtBQUs2QixPQUZSLEVBR0U7QUFDQSxVQUNFLEtBQUtnRixRQUFMLElBQ0EsS0FBS0UsYUFETCxJQUVBLEtBQUtFLGdCQUhQLEVBSUU7QUFDQSxhQUFLc0Isb0JBQUw7QUFDRDs7QUFDRCxVQUNFLEtBQUs5QixVQUFMLElBQ0EsS0FBS0UsYUFGUCxFQUdFO0FBQ0EsYUFBSzhCLGlCQUFMO0FBQ0Q7O0FBQ0QsYUFBTyxLQUFLaEQsYUFBWjtBQUNBLGFBQU8sS0FBS0UsV0FBWjtBQUNBLGFBQU8sS0FBS2lCLFNBQVo7QUFDQSxhQUFPLEtBQUtJLGlCQUFaO0FBQ0EsYUFBTyxLQUFLRixjQUFaO0FBQ0EsYUFBTyxLQUFLckYsS0FBWjtBQUNBLGFBQU8sS0FBS2lGLGNBQVo7QUFDQSxhQUFPLEtBQUtGLFdBQVo7QUFDQSxhQUFPLEtBQUt6RCxPQUFaO0FBQ0EsYUFBTyxLQUFLb0MsVUFBWjtBQUNBLGFBQU8sS0FBSzBELGdCQUFMLEVBQVA7QUFDQSxXQUFLakgsUUFBTCxHQUFnQixLQUFoQjtBQUNEOztBQUNELFdBQU8sSUFBUDtBQUNEOztBQUNEb0UsRUFBQUEsS0FBSyxDQUFDaEwsSUFBRCxFQUFPO0FBQ1ZBLElBQUFBLElBQUksR0FBR0EsSUFBSSxJQUFJLEtBQUt5RyxLQUFwQjtBQUNBLFdBQU80RSxJQUFJLENBQUNMLEtBQUwsQ0FBV0ssSUFBSSxDQUFDQyxTQUFMLENBQWU3SyxNQUFNLENBQUNvSSxNQUFQLENBQWMsRUFBZCxFQUFrQjdJLElBQWxCLENBQWYsQ0FBWCxDQUFQO0FBQ0Q7O0FBaGFnQyxDQUFuQztBQUFBL0IsR0FBRyxDQUFDNlAsUUFBSixHQUFlLGNBQWM3UCxHQUFHLENBQUNpTSxLQUFsQixDQUF3QjtBQUNyQ2pILEVBQUFBLFdBQVcsR0FBRztBQUNaLFVBQU0sR0FBRzdDLFNBQVQ7O0FBQ0EsUUFBRyxLQUFLNEUsUUFBUixFQUFrQjtBQUNoQixVQUFHLEtBQUtBLFFBQUwsQ0FBYzNCLElBQWpCLEVBQXVCLEtBQUswSyxLQUFMLEdBQWEsS0FBSy9JLFFBQUwsQ0FBYzNCLElBQTNCO0FBQ3hCO0FBQ0Y7O0FBQ0QsTUFBSTBLLEtBQUosR0FBWTtBQUFFLFdBQU8sS0FBSzFLLElBQVo7QUFBa0I7O0FBQ2hDLE1BQUkwSyxLQUFKLENBQVUxSyxJQUFWLEVBQWdCO0FBQUUsU0FBS0EsSUFBTCxHQUFZQSxJQUFaO0FBQWtCOztBQUNwQ2tKLEVBQUFBLFFBQVEsR0FBRztBQUNULFFBQUluSyxTQUFTLEdBQUc7QUFDZGlCLE1BQUFBLElBQUksRUFBRSxLQUFLQSxJQURHO0FBRWRyRCxNQUFBQSxJQUFJLEVBQUUsS0FBS0E7QUFGRyxLQUFoQjtBQUlBLFNBQUs2RCxJQUFMLENBQ0UsS0FBS1IsSUFEUCxFQUVFakIsU0FGRjtBQUlBLFdBQU9BLFNBQVA7QUFDRDs7QUFuQm9DLENBQXZDO0FBQUFuRSxHQUFHLENBQUMwUCxTQUFKLEdBQWdCLEVBQWhCO0FNQUExUCxHQUFHLENBQUMwUCxTQUFKLENBQWNLLFFBQWQsR0FBeUIsY0FBYy9QLEdBQUcsQ0FBQzZQLFFBQWxCLENBQTJCO0FBQ2xEN0ssRUFBQUEsV0FBVyxHQUFHO0FBQ1osVUFBTSxHQUFHN0MsU0FBVDtBQUNBLFNBQUs2TixXQUFMO0FBQ0EsU0FBS3RHLE1BQUw7QUFDRDs7QUFDRHNHLEVBQUFBLFdBQVcsR0FBRztBQUNaLFNBQUtGLEtBQUwsR0FBYSxVQUFiO0FBQ0EsU0FBS2hHLE9BQUwsR0FBZTtBQUNibUcsTUFBQUEsTUFBTSxFQUFFO0FBQ05qSSxRQUFBQSxJQUFJLEVBQUU7QUFEQSxPQURLO0FBSWJrSSxNQUFBQSxNQUFNLEVBQUU7QUFDTmxJLFFBQUFBLElBQUksRUFBRTtBQURBLE9BSks7QUFPYm1JLE1BQUFBLFlBQVksRUFBRTtBQUNabkksUUFBQUEsSUFBSSxFQUFFO0FBRE0sT0FQRDtBQVVib0ksTUFBQUEsaUJBQWlCLEVBQUU7QUFDakJwSSxRQUFBQSxJQUFJLEVBQUU7QUFEVztBQVZOLEtBQWY7QUFjRDs7QUF0QmlELENBQXBEO0FDQUFoSSxHQUFHLENBQUMwUCxTQUFKLENBQWNDLFFBQWQsR0FBeUIsY0FBYzNQLEdBQUcsQ0FBQzZQLFFBQWxCLENBQTJCO0FBQ2xEN0ssRUFBQUEsV0FBVyxHQUFHO0FBQ1osVUFBTSxHQUFHN0MsU0FBVDtBQUNBLFNBQUs2TixXQUFMO0FBQ0EsU0FBS3RHLE1BQUw7QUFDRDs7QUFDRHNHLEVBQUFBLFdBQVcsR0FBRztBQUNaLFNBQUtGLEtBQUwsR0FBYSxVQUFiO0FBQ0EsU0FBS2hHLE9BQUwsR0FBZTtBQUNiL0gsTUFBQUEsSUFBSSxFQUFFO0FBQ0ppRyxRQUFBQSxJQUFJLEVBQUU7QUFERixPQURPO0FBSWJnQyxNQUFBQSxPQUFPLEVBQUU7QUFDUGhDLFFBQUFBLElBQUksRUFBRTtBQURDO0FBSkksS0FBZjtBQVFEOztBQWhCaUQsQ0FBcEQ7QVBBQWhJLEdBQUcsQ0FBQ3FRLElBQUosR0FBVyxjQUFjclEsR0FBRyxDQUFDOEcsSUFBbEIsQ0FBdUI7QUFDaEM5QixFQUFBQSxXQUFXLEdBQUc7QUFDWixVQUFNLEdBQUc3QyxTQUFUO0FBQ0Q7O0FBQ0QsTUFBSW1PLFlBQUosR0FBbUI7QUFBRSxXQUFPLEtBQUtDLFFBQUwsQ0FBY0MsT0FBckI7QUFBOEI7O0FBQ25ELE1BQUlGLFlBQUosQ0FBaUJHLFdBQWpCLEVBQThCO0FBQzVCLFFBQUcsQ0FBQyxLQUFLRixRQUFULEVBQW1CLEtBQUtBLFFBQUwsR0FBZ0JHLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QkYsV0FBdkIsQ0FBaEI7QUFDcEI7O0FBQ0QsTUFBSUYsUUFBSixHQUFlO0FBQUUsV0FBTyxLQUFLSyxPQUFaO0FBQXFCOztBQUN0QyxNQUFJTCxRQUFKLENBQWFLLE9BQWIsRUFBc0I7QUFDcEIsUUFDRUEsT0FBTyxZQUFZOU8sV0FBbkIsSUFDQThPLE9BQU8sWUFBWWpNLFFBRnJCLEVBR0U7QUFDQSxXQUFLaU0sT0FBTCxHQUFlQSxPQUFmO0FBQ0QsS0FMRCxNQUtPLElBQUcsT0FBT0EsT0FBUCxLQUFtQixRQUF0QixFQUFnQztBQUNyQyxXQUFLQSxPQUFMLEdBQWVGLFFBQVEsQ0FBQ0csYUFBVCxDQUF1QkQsT0FBdkIsQ0FBZjtBQUNEOztBQUNELFNBQUtFLGVBQUwsQ0FBcUJDLE9BQXJCLENBQTZCLEtBQUtILE9BQWxDLEVBQTJDO0FBQ3pDSSxNQUFBQSxPQUFPLEVBQUUsSUFEZ0M7QUFFekNDLE1BQUFBLFNBQVMsRUFBRTtBQUY4QixLQUEzQztBQUlEOztBQUNELE1BQUlDLFdBQUosR0FBa0I7QUFBRSxXQUFPLEtBQUtYLFFBQUwsQ0FBY1ksVUFBckI7QUFBaUM7O0FBQ3JELE1BQUlELFdBQUosQ0FBZ0JDLFVBQWhCLEVBQTRCO0FBQzFCLFNBQUksSUFBSSxDQUFDQyxZQUFELEVBQWVDLGNBQWYsQ0FBUixJQUEwQzdPLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlME8sVUFBZixDQUExQyxFQUFzRTtBQUNwRSxVQUFHLE9BQU9FLGNBQVAsS0FBMEIsV0FBN0IsRUFBMEM7QUFDeEMsYUFBS2QsUUFBTCxDQUFjZSxlQUFkLENBQThCRixZQUE5QjtBQUNELE9BRkQsTUFFTztBQUNMLGFBQUtiLFFBQUwsQ0FBY2dCLFlBQWQsQ0FBMkJILFlBQTNCLEVBQXlDQyxjQUF6QztBQUNEO0FBQ0Y7QUFDRjs7QUFDRCxNQUFJRyxHQUFKLEdBQVU7QUFDUixTQUFLQyxFQUFMLEdBQVcsS0FBS0EsRUFBTixHQUNOLEtBQUtBLEVBREMsR0FFTixFQUZKO0FBR0EsV0FBTyxLQUFLQSxFQUFaO0FBQ0Q7O0FBQ0QsTUFBSUQsR0FBSixDQUFRQyxFQUFSLEVBQVk7QUFDVixRQUFHLENBQUMsS0FBS0QsR0FBTCxDQUFTLFVBQVQsQ0FBSixFQUEwQixLQUFLQSxHQUFMLENBQVMsVUFBVCxJQUF1QixLQUFLWixPQUE1Qjs7QUFDMUIsU0FBSSxJQUFJLENBQUNjLEtBQUQsRUFBUUMsT0FBUixDQUFSLElBQTRCblAsTUFBTSxDQUFDQyxPQUFQLENBQWVnUCxFQUFmLENBQTVCLEVBQWdEO0FBQzlDLFVBQUcsT0FBT0UsT0FBUCxLQUFtQixRQUF0QixFQUFnQztBQUM5QixhQUFLSCxHQUFMLENBQVNFLEtBQVQsSUFBa0IsS0FBS25CLFFBQUwsQ0FBY3FCLGdCQUFkLENBQStCRCxPQUEvQixDQUFsQjtBQUNELE9BRkQsTUFFTyxJQUNMQSxPQUFPLFlBQVk3UCxXQUFuQixJQUNBNlAsT0FBTyxZQUFZaE4sUUFGZCxFQUdMO0FBQ0EsYUFBSzZNLEdBQUwsQ0FBU0UsS0FBVCxJQUFrQkMsT0FBbEI7QUFDRDtBQUNGO0FBQ0Y7O0FBQ0QsTUFBSUUsU0FBSixHQUFnQjtBQUFFLFdBQU8sS0FBS0MsUUFBWjtBQUFzQjs7QUFDeEMsTUFBSUQsU0FBSixDQUFjQyxRQUFkLEVBQXdCO0FBQUUsU0FBS0EsUUFBTCxHQUFnQkEsUUFBaEI7QUFBMEI7O0FBQ3BELE1BQUlDLFlBQUosR0FBbUI7QUFDakIsU0FBS0MsV0FBTCxHQUFvQixLQUFLQSxXQUFOLEdBQ2YsS0FBS0EsV0FEVSxHQUVmLEVBRko7QUFHQSxXQUFPLEtBQUtBLFdBQVo7QUFDRDs7QUFDRCxNQUFJRCxZQUFKLENBQWlCQyxXQUFqQixFQUE4QjtBQUM1QixTQUFLQSxXQUFMLEdBQW1CaFMsR0FBRyxDQUFDb0IsS0FBSixDQUFVYSxxQkFBVixDQUNqQitQLFdBRGlCLEVBQ0osS0FBS0QsWUFERCxDQUFuQjtBQUdEOztBQUNELE1BQUlFLGtCQUFKLEdBQXlCO0FBQ3ZCLFNBQUtDLGlCQUFMLEdBQTBCLEtBQUtBLGlCQUFOLEdBQ3JCLEtBQUtBLGlCQURnQixHQUVyQixFQUZKO0FBR0EsV0FBTyxLQUFLQSxpQkFBWjtBQUNEOztBQUNELE1BQUlELGtCQUFKLENBQXVCQyxpQkFBdkIsRUFBMEM7QUFDeEMsU0FBS0EsaUJBQUwsR0FBeUJsUyxHQUFHLENBQUNvQixLQUFKLENBQVVhLHFCQUFWLENBQ3ZCaVEsaUJBRHVCLEVBQ0osS0FBS0Qsa0JBREQsQ0FBekI7QUFHRDs7QUFDRCxNQUFJbkIsZUFBSixHQUFzQjtBQUNwQixTQUFLcUIsZ0JBQUwsR0FBeUIsS0FBS0EsZ0JBQU4sR0FDcEIsS0FBS0EsZ0JBRGUsR0FFcEIsSUFBSUMsZ0JBQUosQ0FBcUIsS0FBS0MsY0FBTCxDQUFvQkMsSUFBcEIsQ0FBeUIsSUFBekIsQ0FBckIsQ0FGSjtBQUdBLFdBQU8sS0FBS0gsZ0JBQVo7QUFDRDs7QUFDRCxNQUFJSSxPQUFKLEdBQWM7QUFBRSxXQUFPLEtBQUtDLE1BQVo7QUFBb0I7O0FBQ3BDLE1BQUlELE9BQUosQ0FBWUMsTUFBWixFQUFvQjtBQUFFLFNBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUFzQjs7QUFDNUMsTUFBSTdKLFFBQUosR0FBZTtBQUFFLFdBQU8sS0FBS0MsT0FBTCxJQUFnQixLQUF2QjtBQUE4Qjs7QUFDL0MsTUFBSUQsUUFBSixDQUFhQyxPQUFiLEVBQXNCO0FBQUUsU0FBS0EsT0FBTCxHQUFlQSxPQUFmO0FBQXdCOztBQUNoRCxNQUFJNkosVUFBSixHQUFpQjtBQUNmLFNBQUtDLFNBQUwsR0FBa0IsS0FBS0EsU0FBTixHQUNiLEtBQUtBLFNBRFEsR0FFYixFQUZKO0FBR0EsV0FBTyxLQUFLQSxTQUFaO0FBQ0Q7O0FBQ0QsTUFBSUQsVUFBSixDQUFlQyxTQUFmLEVBQTBCO0FBQ3hCLFNBQUtBLFNBQUwsR0FBaUIxUyxHQUFHLENBQUNvQixLQUFKLENBQVVhLHFCQUFWLENBQ2Z5USxTQURlLEVBQ0osS0FBS0QsVUFERCxDQUFqQjtBQUdEOztBQUNESixFQUFBQSxjQUFjLENBQUNNLGtCQUFELEVBQXFCQyxRQUFyQixFQUErQjtBQUMzQyxTQUFJLElBQUksQ0FBQ0MsbUJBQUQsRUFBc0JDLGNBQXRCLENBQVIsSUFBaUR0USxNQUFNLENBQUNDLE9BQVAsQ0FBZWtRLGtCQUFmLENBQWpELEVBQXFGO0FBQ25GLGNBQU9HLGNBQWMsQ0FBQzlLLElBQXRCO0FBQ0UsYUFBSyxXQUFMO0FBQ0UsY0FBSStLLHdCQUF3QixHQUFHLENBQUMsWUFBRCxFQUFlLGNBQWYsQ0FBL0I7O0FBQ0EsZUFBSSxJQUFJQyxzQkFBUixJQUFrQ0Qsd0JBQWxDLEVBQTREO0FBQzFELGdCQUFHRCxjQUFjLENBQUNFLHNCQUFELENBQWQsQ0FBdUM1USxNQUExQyxFQUFrRDtBQUNoRCxtQkFBSzZRLE9BQUw7QUFDRDtBQUNGOztBQUNEO0FBUko7QUFVRDtBQUNGOztBQUNEQyxFQUFBQSxVQUFVLEdBQUc7QUFDWCxRQUFHLEtBQUtWLE1BQVIsRUFBZ0I7QUFDZDlCLE1BQUFBLFFBQVEsQ0FBQ2tCLGdCQUFULENBQTBCLEtBQUtZLE1BQUwsQ0FBWTVCLE9BQXRDLEVBQ0N2SSxPQURELENBQ1V1SSxPQUFELElBQWE7QUFDcEJBLFFBQUFBLE9BQU8sQ0FBQ3VDLHFCQUFSLENBQThCLEtBQUtYLE1BQUwsQ0FBWVksTUFBMUMsRUFBa0QsS0FBS3hDLE9BQXZEO0FBQ0QsT0FIRDtBQUlEO0FBQ0Y7O0FBQ0R5QyxFQUFBQSxVQUFVLEdBQUc7QUFDWCxRQUNFLEtBQUt6QyxPQUFMLElBQ0EsS0FBS0EsT0FBTCxDQUFhMEMsYUFGZixFQUdFLEtBQUsxQyxPQUFMLENBQWEwQyxhQUFiLENBQTJCQyxXQUEzQixDQUF1QyxLQUFLM0MsT0FBNUM7QUFDSDs7QUFDRDRDLEVBQUFBLGFBQWEsQ0FBQ3pNLFFBQUQsRUFBVztBQUN0QkEsSUFBQUEsUUFBUSxHQUFHQSxRQUFRLElBQUksS0FBS0EsUUFBNUI7QUFDQSxRQUFHQSxRQUFRLENBQUMwSixXQUFaLEVBQXlCLEtBQUtILFlBQUwsR0FBb0J2SixRQUFRLENBQUMwSixXQUE3QjtBQUN6QixRQUFHMUosUUFBUSxDQUFDNkosT0FBWixFQUFxQixLQUFLTCxRQUFMLEdBQWdCeEosUUFBUSxDQUFDNkosT0FBekI7QUFDckIsUUFBRzdKLFFBQVEsQ0FBQ29LLFVBQVosRUFBd0IsS0FBS0QsV0FBTCxHQUFtQm5LLFFBQVEsQ0FBQ29LLFVBQTVCO0FBQ3hCLFFBQUdwSyxRQUFRLENBQUMyTCxTQUFaLEVBQXVCLEtBQUtELFVBQUwsR0FBa0IxTCxRQUFRLENBQUMyTCxTQUEzQjtBQUN2QixRQUFHM0wsUUFBUSxDQUFDeUwsTUFBWixFQUFvQixLQUFLRCxPQUFMLEdBQWV4TCxRQUFRLENBQUN5TCxNQUF4QjtBQUNyQjs7QUFDRGlCLEVBQUFBLGNBQWMsQ0FBQzFNLFFBQUQsRUFBVztBQUN2QkEsSUFBQUEsUUFBUSxHQUFHQSxRQUFRLElBQUksS0FBS0EsUUFBNUI7QUFDQSxRQUNFLEtBQUs2SixPQUFMLElBQ0EsS0FBS0EsT0FBTCxDQUFhMEMsYUFGZixFQUdFLEtBQUsxQyxPQUFMLENBQWEwQyxhQUFiLENBQTJCQyxXQUEzQixDQUF1QyxLQUFLM0MsT0FBNUM7QUFDRixRQUFHLEtBQUtBLE9BQVIsRUFBaUIsT0FBTyxLQUFLQSxPQUFaO0FBQ2pCLFFBQUcsS0FBS08sVUFBUixFQUFvQixPQUFPLEtBQUtBLFVBQVo7QUFDcEIsUUFBRyxLQUFLdUIsU0FBUixFQUFtQixPQUFPLEtBQUtBLFNBQVo7QUFDbkIsUUFBRyxLQUFLRixNQUFSLEVBQWdCLE9BQU8sS0FBS0EsTUFBWjtBQUNqQjs7QUFDRFMsRUFBQUEsT0FBTyxHQUFHO0FBQ1IsU0FBS1MsU0FBTDtBQUNBLFNBQUtDLFFBQUw7QUFDRDs7QUFDREEsRUFBQUEsUUFBUSxDQUFDNU0sUUFBRCxFQUFXO0FBQ2pCQSxJQUFBQSxRQUFRLEdBQUdBLFFBQVEsSUFBSSxLQUFLQSxRQUE1QjtBQUNBLFFBQUdBLFFBQVEsQ0FBQzBLLEVBQVosRUFBZ0IsS0FBS0QsR0FBTCxHQUFXekssUUFBUSxDQUFDMEssRUFBcEI7QUFDaEIsUUFBRzFLLFFBQVEsQ0FBQ2lMLFdBQVosRUFBeUIsS0FBS0QsWUFBTCxHQUFvQmhMLFFBQVEsQ0FBQ2lMLFdBQTdCOztBQUN6QixRQUFHakwsUUFBUSxDQUFDK0ssUUFBWixFQUFzQjtBQUNwQixXQUFLRCxTQUFMLEdBQWlCOUssUUFBUSxDQUFDK0ssUUFBMUI7QUFDQSxXQUFLOEIsY0FBTDtBQUNEO0FBQ0Y7O0FBQ0RGLEVBQUFBLFNBQVMsQ0FBQzNNLFFBQUQsRUFBVztBQUNsQkEsSUFBQUEsUUFBUSxHQUFHQSxRQUFRLElBQUksS0FBS0EsUUFBNUI7O0FBQ0EsUUFBR0EsUUFBUSxDQUFDK0ssUUFBWixFQUFzQjtBQUNwQixXQUFLK0IsZUFBTDtBQUNBLGFBQU8sS0FBS2hDLFNBQVo7QUFDRDs7QUFDRCxXQUFPLEtBQUtDLFFBQVo7QUFDQSxXQUFPLEtBQUtMLEVBQVo7QUFDQSxXQUFPLEtBQUtPLFdBQVo7QUFDRDs7QUFDRDRCLEVBQUFBLGNBQWMsR0FBRztBQUNmLFFBQ0UsS0FBSzlCLFFBQUwsSUFDQSxLQUFLTCxFQURMLElBRUEsS0FBS08sV0FIUCxFQUlFO0FBQ0FoUyxNQUFBQSxHQUFHLENBQUNvQixLQUFKLENBQVUwRCx5QkFBVixDQUNFLEtBQUtnTixRQURQLEVBRUUsS0FBS0wsRUFGUCxFQUdFLEtBQUtPLFdBSFA7QUFLRDtBQUNGOztBQUNENkIsRUFBQUEsZUFBZSxHQUFHO0FBQ2hCLFFBQ0UsS0FBSy9CLFFBQUwsSUFDQSxLQUFLTCxFQURMLElBRUEsS0FBS08sV0FIUCxFQUlFO0FBQ0FoUyxNQUFBQSxHQUFHLENBQUNvQixLQUFKLENBQVUyRCw2QkFBVixDQUNFLEtBQUsrTSxRQURQLEVBRUUsS0FBS0wsRUFGUCxFQUdFLEtBQUtPLFdBSFA7QUFLRDtBQUNGOztBQUNEdkMsRUFBQUEsZUFBZSxHQUFHO0FBQ2hCLFFBQUcsS0FBSzFJLFFBQUwsQ0FBY0ssU0FBakIsRUFBNEIsS0FBS0QsVUFBTCxHQUFrQixLQUFLSixRQUFMLENBQWNLLFNBQWhDO0FBQzdCOztBQUNEd0ksRUFBQUEsZ0JBQWdCLEdBQUc7QUFDakIsUUFBRyxLQUFLekksVUFBUixFQUFvQixPQUFPLEtBQUtBLFVBQVo7QUFDckI7O0FBQ0R1QyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxRQUFJM0MsUUFBUSxHQUFHLEtBQUtBLFFBQXBCOztBQUNBLFFBQ0VBLFFBQVEsSUFDUixDQUFDLEtBQUs0QixRQUZSLEVBR0U7QUFDQSxXQUFLOEcsZUFBTDtBQUNBLFdBQUsrRCxhQUFMLENBQW1Cek0sUUFBbkI7QUFDQSxXQUFLNE0sUUFBTCxDQUFjNU0sUUFBZDtBQUNBLFdBQUs0QixRQUFMLEdBQWdCLElBQWhCO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7QUFDRjs7QUFDRGdCLEVBQUFBLE9BQU8sR0FBRztBQUNSLFFBQUk1QyxRQUFRLEdBQUcsS0FBS0EsUUFBcEI7O0FBQ0EsUUFDRUEsUUFBUSxJQUNSLEtBQUs0QixRQUZQLEVBR0U7QUFDQSxXQUFLK0ssU0FBTCxDQUFlM00sUUFBZjtBQUNBLFdBQUswTSxjQUFMLENBQW9CMU0sUUFBcEI7QUFDQSxXQUFLNkksZ0JBQUw7QUFDQSxXQUFLakgsUUFBTCxHQUFnQixLQUFoQjtBQUNBLGFBQU9tTCxLQUFQO0FBQ0Q7QUFDRjs7QUFoTytCLENBQWxDO0FBQUE5VCxHQUFHLENBQUMrVCxVQUFKLEdBQWlCLGNBQWMvVCxHQUFHLENBQUM4RyxJQUFsQixDQUF1QjtBQUN0QzlCLEVBQUFBLFdBQVcsR0FBRztBQUNaLFVBQU0sR0FBRzdDLFNBQVQ7QUFDRDs7QUFDRCxNQUFJNlIsa0JBQUosR0FBeUI7QUFDdkIsU0FBS0MsaUJBQUwsR0FBMEIsS0FBS0EsaUJBQU4sR0FDckIsS0FBS0EsaUJBRGdCLEdBRXJCLEVBRko7QUFHQSxXQUFPLEtBQUtBLGlCQUFaO0FBQ0Q7O0FBQ0QsTUFBSUQsa0JBQUosQ0FBdUJDLGlCQUF2QixFQUEwQztBQUN4QyxTQUFLQSxpQkFBTCxHQUF5QmpVLEdBQUcsQ0FBQ29CLEtBQUosQ0FBVWEscUJBQVYsQ0FDdkJnUyxpQkFEdUIsRUFDSixLQUFLRCxrQkFERCxDQUF6QjtBQUdEOztBQUNELE1BQUlFLGVBQUosR0FBc0I7QUFDcEIsU0FBS0MsY0FBTCxHQUF1QixLQUFLQSxjQUFOLEdBQ2xCLEtBQUtBLGNBRGEsR0FFbEIsRUFGSjtBQUdBLFdBQU8sS0FBS0EsY0FBWjtBQUNEOztBQUNELE1BQUlELGVBQUosQ0FBb0JDLGNBQXBCLEVBQW9DO0FBQ2xDLFNBQUtBLGNBQUwsR0FBc0JuVSxHQUFHLENBQUNvQixLQUFKLENBQVVhLHFCQUFWLENBQ3BCa1MsY0FEb0IsRUFDSixLQUFLRCxlQURELENBQXRCO0FBR0Q7O0FBQ0QsTUFBSUUsY0FBSixHQUFxQjtBQUNuQixTQUFLQyxhQUFMLEdBQXNCLEtBQUtBLGFBQU4sR0FDakIsS0FBS0EsYUFEWSxHQUVqQixFQUZKO0FBR0EsV0FBTyxLQUFLQSxhQUFaO0FBQ0Q7O0FBQ0QsTUFBSUQsY0FBSixDQUFtQkMsYUFBbkIsRUFBa0M7QUFDaEMsU0FBS0EsYUFBTCxHQUFxQnJVLEdBQUcsQ0FBQ29CLEtBQUosQ0FBVWEscUJBQVYsQ0FDbkJvUyxhQURtQixFQUNKLEtBQUtELGNBREQsQ0FBckI7QUFHRDs7QUFDRCxNQUFJRSxvQkFBSixHQUEyQjtBQUN6QixTQUFLQyxtQkFBTCxHQUE0QixLQUFLQSxtQkFBTixHQUN2QixLQUFLQSxtQkFEa0IsR0FFdkIsRUFGSjtBQUdBLFdBQU8sS0FBS0EsbUJBQVo7QUFDRDs7QUFDRCxNQUFJRCxvQkFBSixDQUF5QkMsbUJBQXpCLEVBQThDO0FBQzVDLFNBQUtBLG1CQUFMLEdBQTJCdlUsR0FBRyxDQUFDb0IsS0FBSixDQUFVYSxxQkFBVixDQUN6QnNTLG1CQUR5QixFQUNKLEtBQUtELG9CQURELENBQTNCO0FBR0Q7O0FBQ0QsTUFBSUUsT0FBSixHQUFjO0FBQ1osU0FBS0MsTUFBTCxHQUFlLEtBQUtBLE1BQU4sR0FDVixLQUFLQSxNQURLLEdBRVYsRUFGSjtBQUdBLFdBQU8sS0FBS0EsTUFBWjtBQUNEOztBQUNELE1BQUlELE9BQUosQ0FBWUMsTUFBWixFQUFvQjtBQUNsQixTQUFLQSxNQUFMLEdBQWN6VSxHQUFHLENBQUNvQixLQUFKLENBQVVhLHFCQUFWLENBQ1p3UyxNQURZLEVBQ0osS0FBS0QsT0FERCxDQUFkO0FBR0Q7O0FBQ0QsTUFBSUUsTUFBSixHQUFhO0FBQ1gsU0FBS0MsS0FBTCxHQUFjLEtBQUtBLEtBQU4sR0FDVCxLQUFLQSxLQURJLEdBRVQsRUFGSjtBQUdBLFdBQU8sS0FBS0EsS0FBWjtBQUNEOztBQUNELE1BQUlELE1BQUosQ0FBV0MsS0FBWCxFQUFrQjtBQUNoQixTQUFLQSxLQUFMLEdBQWEzVSxHQUFHLENBQUNvQixLQUFKLENBQVVhLHFCQUFWLENBQ1gwUyxLQURXLEVBQ0osS0FBS0QsTUFERCxDQUFiO0FBR0Q7O0FBQ0QsTUFBSUUsWUFBSixHQUFtQjtBQUNqQixTQUFLQyxXQUFMLEdBQW9CLEtBQUtBLFdBQU4sR0FDZixLQUFLQSxXQURVLEdBRWYsRUFGSjtBQUdBLFdBQU8sS0FBS0EsV0FBWjtBQUNEOztBQUNELE1BQUlELFlBQUosQ0FBaUJDLFdBQWpCLEVBQThCO0FBQzVCLFNBQUtBLFdBQUwsR0FBbUI3VSxHQUFHLENBQUNvQixLQUFKLENBQVVhLHFCQUFWLENBQ2pCNFMsV0FEaUIsRUFDSixLQUFLRCxZQURELENBQW5CO0FBR0Q7O0FBQ0QsTUFBSUUsUUFBSixHQUFlO0FBQ2IsU0FBS0MsT0FBTCxHQUFnQixLQUFLQSxPQUFOLEdBQ1gsS0FBS0EsT0FETSxHQUVYLEVBRko7QUFHQSxXQUFPLEtBQUtBLE9BQVo7QUFDRDs7QUFDRCxNQUFJRCxRQUFKLENBQWFDLE9BQWIsRUFBc0I7QUFDcEIsU0FBS0EsT0FBTCxHQUFlL1UsR0FBRyxDQUFDb0IsS0FBSixDQUFVYSxxQkFBVixDQUNiOFMsT0FEYSxFQUNKLEtBQUtELFFBREQsQ0FBZjtBQUdEOztBQUNELE1BQUlFLGFBQUosR0FBb0I7QUFDbEIsU0FBS0MsWUFBTCxHQUFxQixLQUFLQSxZQUFOLEdBQ2hCLEtBQUtBLFlBRFcsR0FFaEIsRUFGSjtBQUdBLFdBQU8sS0FBS0EsWUFBWjtBQUNEOztBQUNELE1BQUlELGFBQUosQ0FBa0JDLFlBQWxCLEVBQWdDO0FBQzlCLFNBQUtBLFlBQUwsR0FBb0JqVixHQUFHLENBQUNvQixLQUFKLENBQVVhLHFCQUFWLENBQ2xCZ1QsWUFEa0IsRUFDSixLQUFLRCxhQURELENBQXBCO0FBR0Q7O0FBQ0QsTUFBSUUsZ0JBQUosR0FBdUI7QUFDckIsU0FBS0MsZUFBTCxHQUF3QixLQUFLQSxlQUFOLEdBQ25CLEtBQUtBLGVBRGMsR0FFbkIsRUFGSjtBQUdBLFdBQU8sS0FBS0EsZUFBWjtBQUNEOztBQUNELE1BQUlELGdCQUFKLENBQXFCQyxlQUFyQixFQUFzQztBQUNwQyxTQUFLQSxlQUFMLEdBQXVCblYsR0FBRyxDQUFDb0IsS0FBSixDQUFVYSxxQkFBVixDQUNyQmtULGVBRHFCLEVBQ0osS0FBS0QsZ0JBREQsQ0FBdkI7QUFHRDs7QUFDRCxNQUFJRSxlQUFKLEdBQXNCO0FBQ3BCLFNBQUtDLGNBQUwsR0FBdUIsS0FBS0EsY0FBTixHQUNsQixLQUFLQSxjQURhLEdBRWxCLEVBRko7QUFHQSxXQUFPLEtBQUtBLGNBQVo7QUFDRDs7QUFDRCxNQUFJRCxlQUFKLENBQW9CQyxjQUFwQixFQUFvQztBQUNsQyxTQUFLQSxjQUFMLEdBQXNCclYsR0FBRyxDQUFDb0IsS0FBSixDQUFVYSxxQkFBVixDQUNwQm9ULGNBRG9CLEVBQ0osS0FBS0QsZUFERCxDQUF0QjtBQUdEOztBQUNELE1BQUlFLFlBQUosR0FBbUI7QUFDakIsU0FBS0MsV0FBTCxHQUFvQixLQUFLQSxXQUFOLEdBQ2YsS0FBS0EsV0FEVSxHQUVmLEVBRko7QUFHQSxXQUFPLEtBQUtBLFdBQVo7QUFDRDs7QUFDRCxNQUFJRCxZQUFKLENBQWlCQyxXQUFqQixFQUE4QjtBQUM1QixTQUFLQSxXQUFMLEdBQW1CdlYsR0FBRyxDQUFDb0IsS0FBSixDQUFVYSxxQkFBVixDQUNqQnNULFdBRGlCLEVBQ0osS0FBS0QsWUFERCxDQUFuQjtBQUdEOztBQUNELE1BQUlFLFdBQUosR0FBa0I7QUFDaEIsU0FBS0MsVUFBTCxHQUFtQixLQUFLQSxVQUFOLEdBQ2QsS0FBS0EsVUFEUyxHQUVkLEVBRko7QUFHQSxXQUFPLEtBQUtBLFVBQVo7QUFDRDs7QUFDRCxNQUFJRCxXQUFKLENBQWdCQyxVQUFoQixFQUE0QjtBQUMxQixTQUFLQSxVQUFMLEdBQWtCelYsR0FBRyxDQUFDb0IsS0FBSixDQUFVYSxxQkFBVixDQUNoQndULFVBRGdCLEVBQ0osS0FBS0QsV0FERCxDQUFsQjtBQUdEOztBQUNELE1BQUlFLGlCQUFKLEdBQXdCO0FBQ3RCLFNBQUtDLGdCQUFMLEdBQXlCLEtBQUtBLGdCQUFOLEdBQ3BCLEtBQUtBLGdCQURlLEdBRXBCLEVBRko7QUFHQSxXQUFPLEtBQUtBLGdCQUFaO0FBQ0Q7O0FBQ0QsTUFBSUQsaUJBQUosQ0FBc0JDLGdCQUF0QixFQUF3QztBQUN0QyxTQUFLQSxnQkFBTCxHQUF3QjNWLEdBQUcsQ0FBQ29CLEtBQUosQ0FBVWEscUJBQVYsQ0FDdEIwVCxnQkFEc0IsRUFDSixLQUFLRCxpQkFERCxDQUF4QjtBQUdEOztBQUNELE1BQUkvTSxRQUFKLEdBQWU7QUFBRSxXQUFPLEtBQUtDLE9BQUwsSUFBZ0IsS0FBdkI7QUFBOEI7O0FBQy9DLE1BQUlELFFBQUosQ0FBYUMsT0FBYixFQUFzQjtBQUFFLFNBQUtBLE9BQUwsR0FBZUEsT0FBZjtBQUF3Qjs7QUFDaERnTixFQUFBQSxpQkFBaUIsR0FBRztBQUNsQjVWLElBQUFBLEdBQUcsQ0FBQ29CLEtBQUosQ0FBVTBELHlCQUFWLENBQW9DLEtBQUt5USxXQUF6QyxFQUFzRCxLQUFLZCxNQUEzRCxFQUFtRSxLQUFLTixjQUF4RTtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUNEMEIsRUFBQUEsa0JBQWtCLEdBQUc7QUFDbkI3VixJQUFBQSxHQUFHLENBQUNvQixLQUFKLENBQVUyRCw2QkFBVixDQUF3QyxLQUFLd1EsV0FBN0MsRUFBMEQsS0FBS2QsTUFBL0QsRUFBdUUsS0FBS04sY0FBNUU7QUFDQSxXQUFPLElBQVA7QUFDRDs7QUFDRDJCLEVBQUFBLGdCQUFnQixHQUFHO0FBQ2pCOVYsSUFBQUEsR0FBRyxDQUFDb0IsS0FBSixDQUFVMEQseUJBQVYsQ0FBb0MsS0FBSzJRLFVBQXpDLEVBQXFELEtBQUtkLEtBQTFELEVBQWlFLEtBQUtOLGFBQXRFO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBQ0QwQixFQUFBQSxpQkFBaUIsR0FBRztBQUNsQi9WLElBQUFBLEdBQUcsQ0FBQ29CLEtBQUosQ0FBVTJELDZCQUFWLENBQXdDLEtBQUswUSxVQUE3QyxFQUF5RCxLQUFLZCxLQUE5RCxFQUFxRSxLQUFLTixhQUExRTtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUNEMkIsRUFBQUEsc0JBQXNCLEdBQUc7QUFDdkJoVyxJQUFBQSxHQUFHLENBQUNvQixLQUFKLENBQVUwRCx5QkFBVixDQUFvQyxLQUFLNlEsZ0JBQXpDLEVBQTJELEtBQUtkLFdBQWhFLEVBQTZFLEtBQUtOLG1CQUFsRjtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUNEMEIsRUFBQUEsdUJBQXVCLEdBQUc7QUFDeEJqVyxJQUFBQSxHQUFHLENBQUNvQixLQUFKLENBQVUyRCw2QkFBVixDQUF3QyxLQUFLNFEsZ0JBQTdDLEVBQStELEtBQUtkLFdBQXBFLEVBQWlGLEtBQUtOLG1CQUF0RjtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUNEMkIsRUFBQUEsb0JBQW9CLEdBQUc7QUFDckJsVyxJQUFBQSxHQUFHLENBQUNvQixLQUFKLENBQVUwRCx5QkFBVixDQUFvQyxLQUFLdVEsY0FBekMsRUFBeUQsS0FBS2pPLFNBQTlELEVBQXlFLEtBQUs2TSxpQkFBOUU7QUFDQSxXQUFPLElBQVA7QUFDRDs7QUFDRGtDLEVBQUFBLHFCQUFxQixHQUFHO0FBQ3RCblcsSUFBQUEsR0FBRyxDQUFDb0IsS0FBSixDQUFVMkQsNkJBQVYsQ0FBd0MsS0FBS3NRLGNBQTdDLEVBQTZELEtBQUtqTyxTQUFsRSxFQUE2RSxLQUFLNk0saUJBQWxGO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7O0FBQ0RtQyxFQUFBQSxrQkFBa0IsR0FBRztBQUNuQnBXLElBQUFBLEdBQUcsQ0FBQ29CLEtBQUosQ0FBVTBELHlCQUFWLENBQW9DLEtBQUttUSxZQUF6QyxFQUF1RCxLQUFLRixPQUE1RCxFQUFxRSxLQUFLSSxlQUExRTtBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUNEa0IsRUFBQUEsbUJBQW1CLEdBQUc7QUFDcEJyVyxJQUFBQSxHQUFHLENBQUNvQixLQUFKLENBQVUyRCw2QkFBVixDQUF3QyxLQUFLa1EsWUFBN0MsRUFBMkQsS0FBS0YsT0FBaEUsRUFBeUUsS0FBS0ksZUFBOUU7QUFDQSxXQUFPLElBQVA7QUFDRDs7QUFDRHpMLEVBQUFBLE1BQU0sR0FBRztBQUNQLFFBQUkzQyxRQUFRLEdBQUcsS0FBS0EsUUFBcEI7O0FBQ0EsUUFDRUEsUUFBUSxJQUNSLENBQUMsS0FBSzZCLE9BRlIsRUFHRTtBQUNBLFVBQUc3QixRQUFRLENBQUNvTixjQUFaLEVBQTRCLEtBQUtELGVBQUwsR0FBdUJuTixRQUFRLENBQUNvTixjQUFoQztBQUM1QixVQUFHcE4sUUFBUSxDQUFDc04sYUFBWixFQUEyQixLQUFLRCxjQUFMLEdBQXNCck4sUUFBUSxDQUFDc04sYUFBL0I7QUFDM0IsVUFBR3ROLFFBQVEsQ0FBQ3dOLG1CQUFaLEVBQWlDLEtBQUtELG9CQUFMLEdBQTRCdk4sUUFBUSxDQUFDd04sbUJBQXJDO0FBQ2pDLFVBQUd4TixRQUFRLENBQUNrTixpQkFBWixFQUErQixLQUFLRCxrQkFBTCxHQUEwQmpOLFFBQVEsQ0FBQ2tOLGlCQUFuQztBQUMvQixVQUFHbE4sUUFBUSxDQUFDb08sZUFBWixFQUE2QixLQUFLRCxnQkFBTCxHQUF3Qm5PLFFBQVEsQ0FBQ29PLGVBQWpDO0FBQzdCLFVBQUdwTyxRQUFRLENBQUMwTixNQUFaLEVBQW9CLEtBQUtELE9BQUwsR0FBZXpOLFFBQVEsQ0FBQzBOLE1BQXhCO0FBQ3BCLFVBQUcxTixRQUFRLENBQUM0TixLQUFaLEVBQW1CLEtBQUtELE1BQUwsR0FBYzNOLFFBQVEsQ0FBQzROLEtBQXZCO0FBQ25CLFVBQUc1TixRQUFRLENBQUM4TixXQUFaLEVBQXlCLEtBQUtELFlBQUwsR0FBb0I3TixRQUFRLENBQUM4TixXQUE3QjtBQUN6QixVQUFHOU4sUUFBUSxDQUFDSyxTQUFaLEVBQXVCLEtBQUtELFVBQUwsR0FBa0JKLFFBQVEsQ0FBQ0ssU0FBM0I7QUFDdkIsVUFBR0wsUUFBUSxDQUFDZ08sT0FBWixFQUFxQixLQUFLRCxRQUFMLEdBQWdCL04sUUFBUSxDQUFDZ08sT0FBekI7QUFDckIsVUFBR2hPLFFBQVEsQ0FBQ3dPLFdBQVosRUFBeUIsS0FBS0QsWUFBTCxHQUFvQnZPLFFBQVEsQ0FBQ3dPLFdBQTdCO0FBQ3pCLFVBQUd4TyxRQUFRLENBQUMwTyxVQUFaLEVBQXdCLEtBQUtELFdBQUwsR0FBbUJ6TyxRQUFRLENBQUMwTyxVQUE1QjtBQUN4QixVQUFHMU8sUUFBUSxDQUFDNE8sZ0JBQVosRUFBOEIsS0FBS0QsaUJBQUwsR0FBeUIzTyxRQUFRLENBQUM0TyxnQkFBbEM7QUFDOUIsVUFBRzVPLFFBQVEsQ0FBQ3NPLGNBQVosRUFBNEIsS0FBS0QsZUFBTCxHQUF1QnJPLFFBQVEsQ0FBQ3NPLGNBQWhDO0FBQzVCLFVBQUd0TyxRQUFRLENBQUNrTyxZQUFaLEVBQTBCLEtBQUtELGFBQUwsR0FBcUJqTyxRQUFRLENBQUNrTyxZQUE5Qjs7QUFDMUIsVUFDRSxLQUFLTSxXQUFMLElBQ0EsS0FBS2QsTUFETCxJQUVBLEtBQUtOLGNBSFAsRUFJRTtBQUNBLGFBQUt5QixpQkFBTDtBQUNEOztBQUNELFVBQ0UsS0FBS0gsVUFBTCxJQUNBLEtBQUtkLEtBREwsSUFFQSxLQUFLTixhQUhQLEVBSUU7QUFDQSxhQUFLeUIsZ0JBQUw7QUFDRDs7QUFDRCxVQUNFLEtBQUtILGdCQUFMLElBQ0EsS0FBS2QsV0FETCxJQUVBLEtBQUtOLG1CQUhQLEVBSUU7QUFDQSxhQUFLeUIsc0JBQUw7QUFDRDs7QUFDRCxVQUNFLEtBQUtmLFlBQUwsSUFDQSxLQUFLRixPQURMLElBRUEsS0FBS0ksZUFIUCxFQUlFO0FBQ0EsYUFBS2lCLGtCQUFMO0FBQ0Q7O0FBQ0QsVUFDRSxLQUFLZixjQUFMLElBQ0EsS0FBS2pPLFNBREwsSUFFQSxLQUFLNk0saUJBSFAsRUFJRTtBQUNBLGFBQUtpQyxvQkFBTDtBQUNEOztBQUNELFdBQUt2TixRQUFMLEdBQWdCLElBQWhCO0FBQ0Q7O0FBQ0QsV0FBTyxJQUFQO0FBQ0Q7O0FBQ0QyTixFQUFBQSxLQUFLLEdBQUc7QUFDTixTQUFLM00sT0FBTDtBQUNBLFNBQUtELE1BQUw7QUFDQSxXQUFPLElBQVA7QUFDRDs7QUFDREMsRUFBQUEsT0FBTyxHQUFHO0FBQ1IsUUFBSTVDLFFBQVEsR0FBRyxLQUFLQSxRQUFwQjs7QUFDQSxRQUNFQSxRQUFRLElBQ1IsS0FBSzZCLE9BRlAsRUFHRTtBQUNBLFVBQ0UsS0FBSzJNLFdBQUwsSUFDQSxLQUFLZCxNQURMLElBRUEsS0FBS04sY0FIUCxFQUlFO0FBQ0EsYUFBSzBCLGtCQUFMO0FBQ0Q7O0FBQ0QsVUFDRSxLQUFLSixVQUFMLElBQ0EsS0FBS2QsS0FETCxJQUVBLEtBQUtOLGFBSFAsRUFJRTtBQUNBLGFBQUswQixpQkFBTDtBQUNEOztBQUNELFVBQ0UsS0FBS0osZ0JBQUwsSUFDQSxLQUFLZCxXQURMLElBRUEsS0FBS04sbUJBSFAsRUFJRTtBQUNBLGFBQUswQix1QkFBTDtBQUNEO0FBQUM7O0FBQ0YsUUFDRSxLQUFLaEIsWUFBTCxJQUNBLEtBQUtGLE9BREwsSUFFQSxLQUFLSSxlQUhQLEVBSUU7QUFDQSxXQUFLa0IsbUJBQUw7QUFDRDs7QUFDRCxRQUNFLEtBQUtoQixjQUFMLElBQ0EsS0FBS2pPLFNBREwsSUFFQSxLQUFLNk0saUJBSFAsRUFJRTtBQUNBLFdBQUtrQyxxQkFBTDtBQUNBLGFBQU8sS0FBS2pDLGVBQVo7QUFDQSxhQUFPLEtBQUtFLGNBQVo7QUFDQSxhQUFPLEtBQUtFLG9CQUFaO0FBQ0EsYUFBTyxLQUFLTixrQkFBWjtBQUNBLGFBQU8sS0FBS2tCLGdCQUFaO0FBQ0EsYUFBTyxLQUFLVixPQUFaO0FBQ0EsYUFBTyxLQUFLRSxNQUFaO0FBQ0EsYUFBTyxLQUFLRSxZQUFaO0FBQ0EsYUFBTyxLQUFLek4sVUFBWjtBQUNBLGFBQU8sS0FBSzJOLFFBQVo7QUFDQSxhQUFPLEtBQUtFLGFBQVo7QUFDQSxhQUFPLEtBQUtNLFlBQVo7QUFDQSxhQUFPLEtBQUtFLFdBQVo7QUFDQSxhQUFPLEtBQUtFLGlCQUFaO0FBQ0EsYUFBTyxLQUFLTixlQUFaO0FBQ0YsV0FBS3pNLFFBQUwsR0FBZ0IsS0FBaEI7QUFDRDs7QUFDRCxXQUFPLElBQVA7QUFDRDs7QUFuVXFDLENBQXhDO0FBQUEzSSxHQUFHLENBQUN1VyxNQUFKLEdBQWEsY0FBY3ZXLEdBQUcsQ0FBQzhHLElBQWxCLENBQXVCO0FBQ2xDOUIsRUFBQUEsV0FBVyxHQUFHO0FBQ1osVUFBTSxHQUFHN0MsU0FBVDtBQUNEOztBQUNELE1BQUlxVSxRQUFKLEdBQWU7QUFBRSxXQUFPQyxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JGLFFBQXZCO0FBQWlDOztBQUNsRCxNQUFJRyxRQUFKLEdBQWU7QUFBRSxXQUFPRixNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLFFBQXZCO0FBQWlDOztBQUNsRCxNQUFJQyxJQUFKLEdBQVc7QUFBRSxXQUFPSCxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JFLElBQXZCO0FBQTZCOztBQUMxQyxNQUFJQyxJQUFKLEdBQVc7QUFBRSxXQUFPSixNQUFNLENBQUNDLFFBQVAsQ0FBZ0JJLFFBQXZCO0FBQWlDOztBQUM5QyxNQUFJQyxJQUFKLEdBQVc7QUFDVCxRQUFJQyxJQUFJLEdBQUdQLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQk0sSUFBM0I7QUFDQSxRQUFJQyxTQUFTLEdBQUdELElBQUksQ0FBQ0UsT0FBTCxDQUFhLEdBQWIsQ0FBaEI7O0FBQ0EsUUFBR0QsU0FBUyxHQUFHLENBQUMsQ0FBaEIsRUFBbUI7QUFDakIsVUFBSUUsVUFBVSxHQUFHSCxJQUFJLENBQUNFLE9BQUwsQ0FBYSxHQUFiLENBQWpCO0FBQ0EsVUFBSUUsVUFBVSxHQUFHSCxTQUFTLEdBQUcsQ0FBN0I7QUFDQSxVQUFJSSxTQUFKOztBQUNBLFVBQUdGLFVBQVUsR0FBRyxDQUFDLENBQWpCLEVBQW9CO0FBQ2xCRSxRQUFBQSxTQUFTLEdBQUlKLFNBQVMsR0FBR0UsVUFBYixHQUNSSCxJQUFJLENBQUM1VSxNQURHLEdBRVIrVSxVQUZKO0FBR0QsT0FKRCxNQUlPO0FBQ0xFLFFBQUFBLFNBQVMsR0FBR0wsSUFBSSxDQUFDNVUsTUFBakI7QUFDRDs7QUFDRDRVLE1BQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDdlQsS0FBTCxDQUFXMlQsVUFBWCxFQUF1QkMsU0FBdkIsQ0FBUDs7QUFDQSxVQUFHTCxJQUFJLENBQUM1VSxNQUFSLEVBQWdCO0FBQ2QsZUFBTzRVLElBQVA7QUFDRCxPQUZELE1BRU87QUFDTCxlQUFPLElBQVA7QUFDRDtBQUNGLEtBakJELE1BaUJPO0FBQ0wsYUFBTyxJQUFQO0FBQ0Q7QUFDRjs7QUFDRCxNQUFJTSxNQUFKLEdBQWE7QUFDWCxRQUFJTixJQUFJLEdBQUdQLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQk0sSUFBM0I7QUFDQSxRQUFJRyxVQUFVLEdBQUdILElBQUksQ0FBQ0UsT0FBTCxDQUFhLEdBQWIsQ0FBakI7O0FBQ0EsUUFBR0MsVUFBVSxHQUFHLENBQUMsQ0FBakIsRUFBb0I7QUFDbEIsVUFBSUYsU0FBUyxHQUFHRCxJQUFJLENBQUNFLE9BQUwsQ0FBYSxHQUFiLENBQWhCO0FBQ0EsVUFBSUUsVUFBVSxHQUFHRCxVQUFVLEdBQUcsQ0FBOUI7QUFDQSxVQUFJRSxTQUFKOztBQUNBLFVBQUdKLFNBQVMsR0FBRyxDQUFDLENBQWhCLEVBQW1CO0FBQ2pCSSxRQUFBQSxTQUFTLEdBQUlGLFVBQVUsR0FBR0YsU0FBZCxHQUNSRCxJQUFJLENBQUM1VSxNQURHLEdBRVI2VSxTQUZKO0FBR0QsT0FKRCxNQUlPO0FBQ0xJLFFBQUFBLFNBQVMsR0FBR0wsSUFBSSxDQUFDNVUsTUFBakI7QUFDRDs7QUFDRDRVLE1BQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDdlQsS0FBTCxDQUFXMlQsVUFBWCxFQUF1QkMsU0FBdkIsQ0FBUDs7QUFDQSxVQUFHTCxJQUFJLENBQUM1VSxNQUFSLEVBQWdCO0FBQ2QsZUFBTzRVLElBQVA7QUFDRCxPQUZELE1BRU87QUFDTCxlQUFPLElBQVA7QUFDRDtBQUNGLEtBakJELE1BaUJPO0FBQ0wsYUFBTyxJQUFQO0FBQ0Q7QUFDRjs7QUFDRCxNQUFJTyxVQUFKLEdBQWlCO0FBQ2YsUUFBSUMsU0FBUyxHQUFHO0FBQ2RkLE1BQUFBLFFBQVEsRUFBRSxFQURJO0FBRWRlLE1BQUFBLFVBQVUsRUFBRTtBQUZFLEtBQWhCO0FBSUEsUUFBSVosSUFBSSxHQUFHLEtBQUtBLElBQUwsQ0FBVW5ULEtBQVYsQ0FBZ0IsR0FBaEIsRUFBcUJnVSxNQUFyQixDQUE2QnpVLFFBQUQsSUFBY0EsUUFBUSxDQUFDYixNQUFuRCxDQUFYO0FBQ0F5VSxJQUFBQSxJQUFJLEdBQUlBLElBQUksQ0FBQ3pVLE1BQU4sR0FDSHlVLElBREcsR0FFSCxDQUFDLEdBQUQsQ0FGSjtBQUdBLFFBQUlFLElBQUksR0FBRyxLQUFLQSxJQUFoQjtBQUNBLFFBQUlZLGFBQWEsR0FBSVosSUFBRCxHQUNoQkEsSUFBSSxDQUFDclQsS0FBTCxDQUFXLEdBQVgsRUFBZ0JnVSxNQUFoQixDQUF3QnpVLFFBQUQsSUFBY0EsUUFBUSxDQUFDYixNQUE5QyxDQURnQixHQUVoQixJQUZKO0FBR0EsUUFBSWtWLE1BQU0sR0FBRyxLQUFLQSxNQUFsQjtBQUNBLFFBQUlNLFNBQVMsR0FBSU4sTUFBRCxHQUNadFgsR0FBRyxDQUFDb0IsS0FBSixDQUFVeVcsY0FBVixDQUF5QlAsTUFBekIsQ0FEWSxHQUVaLElBRko7QUFHQSxRQUFHLEtBQUtkLFFBQVIsRUFBa0JnQixTQUFTLENBQUNkLFFBQVYsQ0FBbUJGLFFBQW5CLEdBQThCLEtBQUtBLFFBQW5DO0FBQ2xCLFFBQUcsS0FBS0csUUFBUixFQUFrQmEsU0FBUyxDQUFDZCxRQUFWLENBQW1CQyxRQUFuQixHQUE4QixLQUFLQSxRQUFuQztBQUNsQixRQUFHLEtBQUtDLElBQVIsRUFBY1ksU0FBUyxDQUFDZCxRQUFWLENBQW1CRSxJQUFuQixHQUEwQixLQUFLQSxJQUEvQjtBQUNkLFFBQUcsS0FBS0MsSUFBUixFQUFjVyxTQUFTLENBQUNkLFFBQVYsQ0FBbUJHLElBQW5CLEdBQTBCLEtBQUtBLElBQS9COztBQUNkLFFBQ0VFLElBQUksSUFDSlksYUFGRixFQUdFO0FBQ0FBLE1BQUFBLGFBQWEsR0FBSUEsYUFBYSxDQUFDdlYsTUFBZixHQUNkdVYsYUFEYyxHQUVkLENBQUMsR0FBRCxDQUZGO0FBR0FILE1BQUFBLFNBQVMsQ0FBQ2QsUUFBVixDQUFtQkssSUFBbkIsR0FBMEI7QUFDeEJGLFFBQUFBLElBQUksRUFBRUUsSUFEa0I7QUFFeEI1VCxRQUFBQSxTQUFTLEVBQUV3VTtBQUZhLE9BQTFCO0FBSUQ7O0FBQ0QsUUFDRUwsTUFBTSxJQUNOTSxTQUZGLEVBR0U7QUFDQUosTUFBQUEsU0FBUyxDQUFDZCxRQUFWLENBQW1CWSxNQUFuQixHQUE0QjtBQUMxQlQsUUFBQUEsSUFBSSxFQUFFUyxNQURvQjtBQUUxQnZWLFFBQUFBLElBQUksRUFBRTZWO0FBRm9CLE9BQTVCO0FBSUQ7O0FBQ0RKLElBQUFBLFNBQVMsQ0FBQ2QsUUFBVixDQUFtQkcsSUFBbkIsR0FBMEI7QUFDeEJ6UixNQUFBQSxJQUFJLEVBQUUsS0FBS3lSLElBRGE7QUFFeEIxVCxNQUFBQSxTQUFTLEVBQUUwVDtBQUZhLEtBQTFCO0FBSUFXLElBQUFBLFNBQVMsQ0FBQ2QsUUFBVixDQUFtQm9CLFVBQW5CLEdBQWdDLEtBQUtBLFVBQXJDO0FBQ0EsUUFBSUMsbUJBQW1CLEdBQUcsS0FBS0Msb0JBQS9CO0FBQ0FSLElBQUFBLFNBQVMsQ0FBQ2QsUUFBVixHQUFxQmxVLE1BQU0sQ0FBQ29JLE1BQVAsQ0FDbkI0TSxTQUFTLENBQUNkLFFBRFMsRUFFbkJxQixtQkFBbUIsQ0FBQ3JCLFFBRkQsQ0FBckI7QUFJQWMsSUFBQUEsU0FBUyxDQUFDQyxVQUFWLEdBQXVCTSxtQkFBbUIsQ0FBQ04sVUFBM0M7QUFDQSxTQUFLRCxTQUFMLEdBQWlCQSxTQUFqQjtBQUNBLFdBQU8sS0FBS0EsU0FBWjtBQUNEOztBQUNELE1BQUlRLG9CQUFKLEdBQTJCO0FBQ3pCLFFBQUlSLFNBQVMsR0FBRztBQUNkZCxNQUFBQSxRQUFRLEVBQUU7QUFESSxLQUFoQjtBQUdBbFUsSUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWUsS0FBS3dWLE1BQXBCLEVBQ0c1UCxPQURILENBQ1csVUFBZ0M7QUFBQSxVQUEvQixDQUFDNlAsU0FBRCxFQUFZQyxhQUFaLENBQStCO0FBQ3ZDLFVBQUlDLGFBQWEsR0FBRyxLQUFLdkIsSUFBTCxDQUFVblQsS0FBVixDQUFnQixHQUFoQixFQUFxQmdVLE1BQXJCLENBQTZCelUsUUFBRCxJQUFjQSxRQUFRLENBQUNiLE1BQW5ELENBQXBCO0FBQ0FnVyxNQUFBQSxhQUFhLEdBQUlBLGFBQWEsQ0FBQ2hXLE1BQWYsR0FDWmdXLGFBRFksR0FFWixDQUFDLEdBQUQsQ0FGSjtBQUdBLFVBQUlDLGNBQWMsR0FBR0gsU0FBUyxDQUFDeFUsS0FBVixDQUFnQixHQUFoQixFQUFxQmdVLE1BQXJCLENBQTRCLENBQUN6VSxRQUFELEVBQVdDLGFBQVgsS0FBNkJELFFBQVEsQ0FBQ2IsTUFBbEUsQ0FBckI7QUFDQWlXLE1BQUFBLGNBQWMsR0FBSUEsY0FBYyxDQUFDalcsTUFBaEIsR0FDYmlXLGNBRGEsR0FFYixDQUFDLEdBQUQsQ0FGSjs7QUFHQSxVQUNFRCxhQUFhLENBQUNoVyxNQUFkLElBQ0FnVyxhQUFhLENBQUNoVyxNQUFkLEtBQXlCaVcsY0FBYyxDQUFDalcsTUFGMUMsRUFHRTtBQUNBLFlBQUlrQixLQUFKO0FBQ0EsZUFBTytVLGNBQWMsQ0FBQ1gsTUFBZixDQUFzQixDQUFDWSxhQUFELEVBQWdCQyxrQkFBaEIsS0FBdUM7QUFDbEUsY0FDRWpWLEtBQUssS0FBSzFCLFNBQVYsSUFDQTBCLEtBQUssS0FBSyxJQUZaLEVBR0U7QUFDQSxnQkFBR2dWLGFBQWEsQ0FBQyxDQUFELENBQWIsS0FBcUIsR0FBeEIsRUFBNkI7QUFDM0Isa0JBQUlFLFlBQVksR0FBR0YsYUFBYSxDQUFDRyxPQUFkLENBQXNCLEdBQXRCLEVBQTJCLEVBQTNCLENBQW5COztBQUNBLGtCQUNFRixrQkFBa0IsS0FBS0gsYUFBYSxDQUFDaFcsTUFBZCxHQUF1QixDQURoRCxFQUVFO0FBQ0FvVixnQkFBQUEsU0FBUyxDQUFDZCxRQUFWLENBQW1COEIsWUFBbkIsR0FBa0NBLFlBQWxDO0FBQ0Q7O0FBQ0RoQixjQUFBQSxTQUFTLENBQUNkLFFBQVYsQ0FBbUI4QixZQUFuQixJQUFtQ0osYUFBYSxDQUFDRyxrQkFBRCxDQUFoRDtBQUNBRCxjQUFBQSxhQUFhLEdBQUcsS0FBS0ksZ0JBQXJCO0FBQ0QsYUFURCxNQVNPO0FBQ0xKLGNBQUFBLGFBQWEsR0FBR0EsYUFBYSxDQUFDRyxPQUFkLENBQXNCLElBQUk5VSxNQUFKLENBQVcsR0FBWCxFQUFnQixJQUFoQixDQUF0QixFQUE2QyxNQUE3QyxDQUFoQjtBQUNBMlUsY0FBQUEsYUFBYSxHQUFHLEtBQUtLLHVCQUFMLENBQTZCTCxhQUE3QixDQUFoQjtBQUNEOztBQUNEaFYsWUFBQUEsS0FBSyxHQUFHZ1YsYUFBYSxDQUFDTSxJQUFkLENBQW1CUixhQUFhLENBQUNHLGtCQUFELENBQWhDLENBQVI7O0FBQ0EsZ0JBQ0VqVixLQUFLLEtBQUssSUFBVixJQUNBaVYsa0JBQWtCLEtBQUtILGFBQWEsQ0FBQ2hXLE1BQWQsR0FBdUIsQ0FGaEQsRUFHRTtBQUNBb1YsY0FBQUEsU0FBUyxDQUFDZCxRQUFWLENBQW1CbUMsS0FBbkIsR0FBMkI7QUFDekJ6VCxnQkFBQUEsSUFBSSxFQUFFOFMsU0FEbUI7QUFFekIvVSxnQkFBQUEsU0FBUyxFQUFFa1Y7QUFGYyxlQUEzQjtBQUlBYixjQUFBQSxTQUFTLENBQUNDLFVBQVYsR0FBdUJVLGFBQXZCO0FBQ0EscUJBQU9BLGFBQVA7QUFDRDtBQUNGO0FBQ0YsU0EvQk0sRUErQkosQ0EvQkksQ0FBUDtBQWdDRDtBQUNGLEtBaERIO0FBaURBLFdBQU9YLFNBQVA7QUFDRDs7QUFDRCxNQUFJN08sUUFBSixHQUFlO0FBQUUsV0FBTyxLQUFLQyxPQUFMLElBQWdCLEtBQXZCO0FBQThCOztBQUMvQyxNQUFJRCxRQUFKLENBQWFDLE9BQWIsRUFBc0I7QUFBRSxTQUFLQSxPQUFMLEdBQWVBLE9BQWY7QUFBd0I7O0FBQ2hELE1BQUlrUSxPQUFKLEdBQWM7QUFDWixTQUFLYixNQUFMLEdBQWUsS0FBS0EsTUFBTixHQUNWLEtBQUtBLE1BREssR0FFVixFQUZKO0FBR0EsV0FBTyxLQUFLQSxNQUFaO0FBQ0Q7O0FBQ0QsTUFBSWEsT0FBSixDQUFZYixNQUFaLEVBQW9CO0FBQ2xCLFNBQUtBLE1BQUwsR0FBY2pZLEdBQUcsQ0FBQ29CLEtBQUosQ0FBVWEscUJBQVYsQ0FDWmdXLE1BRFksRUFDSixLQUFLYSxPQURELENBQWQ7QUFHRDs7QUFDRCxNQUFJQyxXQUFKLEdBQWtCO0FBQUUsV0FBTyxLQUFLdEIsVUFBWjtBQUF3Qjs7QUFDNUMsTUFBSXNCLFdBQUosQ0FBZ0J0QixVQUFoQixFQUE0QjtBQUFFLFNBQUtBLFVBQUwsR0FBa0JBLFVBQWxCO0FBQThCOztBQUM1RCxNQUFJdUIsWUFBSixHQUFtQjtBQUFFLFdBQU8sS0FBS0MsV0FBWjtBQUF5Qjs7QUFDOUMsTUFBSUQsWUFBSixDQUFpQkMsV0FBakIsRUFBOEI7QUFBRSxTQUFLQSxXQUFMLEdBQW1CQSxXQUFuQjtBQUFnQzs7QUFDaEUsTUFBSUMsV0FBSixHQUFrQjtBQUFFLFdBQU8sS0FBS3BCLFVBQVo7QUFBd0I7O0FBQzVDLE1BQUlvQixXQUFKLENBQWdCcEIsVUFBaEIsRUFBNEI7QUFDMUIsUUFBRyxLQUFLQSxVQUFSLEVBQW9CLEtBQUtrQixZQUFMLEdBQW9CLEtBQUtsQixVQUF6QjtBQUNwQixTQUFLQSxVQUFMLEdBQWtCQSxVQUFsQjtBQUNEOztBQUNELE1BQUlZLGdCQUFKLEdBQXVCO0FBQUUsV0FBTyxJQUFJL1UsTUFBSixDQUFXLGlFQUFYLEVBQThFLElBQTlFLENBQVA7QUFBNEY7O0FBQ3JIZ1YsRUFBQUEsdUJBQXVCLENBQUMxVixRQUFELEVBQVc7QUFDaEMsV0FBTyxJQUFJVSxNQUFKLENBQVcsSUFBSUosTUFBSixDQUFXTixRQUFYLEVBQXFCLEdBQXJCLENBQVgsQ0FBUDtBQUNEOztBQUNEeUcsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsUUFDRSxDQUFDLEtBQUtkLE9BRFIsRUFFRTtBQUNBLFdBQUs2RyxlQUFMO0FBQ0EsV0FBSzBKLFlBQUw7QUFDQSxXQUFLQyxZQUFMO0FBQ0EsV0FBS3pRLFFBQUwsR0FBZ0IsSUFBaEI7QUFDRDs7QUFDRCxXQUFPLElBQVA7QUFDRDs7QUFDRGdCLEVBQUFBLE9BQU8sR0FBRztBQUNSLFFBQ0UsS0FBS2YsT0FEUCxFQUVFO0FBQ0EsV0FBS3lRLGFBQUw7QUFDQSxXQUFLQyxhQUFMO0FBQ0EsV0FBSzFKLGdCQUFMO0FBQ0EsV0FBS2pILFFBQUwsR0FBZ0IsS0FBaEI7QUFDRDtBQUNGOztBQUNEeVEsRUFBQUEsWUFBWSxHQUFHO0FBQ2IsUUFBRyxLQUFLclMsUUFBTCxDQUFjMFEsVUFBakIsRUFBNkIsS0FBS3NCLFdBQUwsR0FBbUIsS0FBS2hTLFFBQUwsQ0FBYzBRLFVBQWpDO0FBQzdCLFNBQUtxQixPQUFMLEdBQWV0VyxNQUFNLENBQUNDLE9BQVAsQ0FBZSxLQUFLc0UsUUFBTCxDQUFja1IsTUFBN0IsRUFBcUNqVixNQUFyQyxDQUNiLENBQ0U4VixPQURGLFNBR0VTLFVBSEYsRUFJRUMsY0FKRixLQUtLO0FBQUEsVUFISCxDQUFDdEIsU0FBRCxFQUFZQyxhQUFaLENBR0c7QUFDSFcsTUFBQUEsT0FBTyxDQUFDWixTQUFELENBQVAsR0FBcUIxVixNQUFNLENBQUNvSSxNQUFQLENBQ25CdU4sYUFEbUIsRUFFbkI7QUFDRXNCLFFBQUFBLFFBQVEsRUFBRSxLQUFLaEMsVUFBTCxDQUFnQlUsYUFBYSxDQUFDc0IsUUFBOUIsRUFBd0NuSCxJQUF4QyxDQUE2QyxLQUFLbUYsVUFBbEQ7QUFEWixPQUZtQixDQUFyQjtBQU1BLGFBQU9xQixPQUFQO0FBQ0QsS0FkWSxFQWViLEVBZmEsQ0FBZjtBQWlCQSxXQUFPLElBQVA7QUFDRDs7QUFDRHJKLEVBQUFBLGVBQWUsR0FBRztBQUNoQmpOLElBQUFBLE1BQU0sQ0FBQ29JLE1BQVAsQ0FDRSxLQUFLekQsVUFEUCxFQUVFLEtBQUtKLFFBQUwsQ0FBY0ssU0FGaEIsRUFHRTtBQUNFc1MsTUFBQUEsZ0JBQWdCLEVBQUUsSUFBSTFaLEdBQUcsQ0FBQzBQLFNBQUosQ0FBY0ssUUFBbEI7QUFEcEIsS0FIRjtBQU9BLFdBQU8sSUFBUDtBQUNEOztBQUNESCxFQUFBQSxnQkFBZ0IsR0FBRztBQUNqQixXQUFPLEtBQUt6SSxVQUFMLENBQWdCdVMsZ0JBQXZCO0FBQ0Q7O0FBQ0RKLEVBQUFBLGFBQWEsR0FBRztBQUNkLFdBQU8sS0FBS1IsT0FBWjtBQUNBLFdBQU8sS0FBS0MsV0FBWjtBQUNEOztBQUNESSxFQUFBQSxZQUFZLEdBQUc7QUFDYjFDLElBQUFBLE1BQU0sQ0FBQ2tELGdCQUFQLENBQXdCLFlBQXhCLEVBQXNDLEtBQUtDLFdBQUwsQ0FBaUJ0SCxJQUFqQixDQUFzQixJQUF0QixDQUF0QztBQUNBLFdBQU8sSUFBUDtBQUNEOztBQUNEK0csRUFBQUEsYUFBYSxHQUFHO0FBQ2Q1QyxJQUFBQSxNQUFNLENBQUNvRCxtQkFBUCxDQUEyQixZQUEzQixFQUF5QyxLQUFLRCxXQUFMLENBQWlCdEgsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBekM7QUFDRDs7QUFDRHNILEVBQUFBLFdBQVcsR0FBRztBQUNaLFNBQUtWLFdBQUwsR0FBbUJ6QyxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JNLElBQW5DO0FBQ0EsUUFBSVEsU0FBUyxHQUFHLEtBQUtELFVBQXJCOztBQUNBLFFBQUdDLFNBQVMsQ0FBQ0MsVUFBYixFQUF5QjtBQUN2QixVQUFJaUMsZ0JBQWdCLEdBQUcsS0FBS3RTLFNBQUwsQ0FBZXNTLGdCQUF0QztBQUNBLFVBQUcsS0FBS1QsV0FBUixFQUFxQnpCLFNBQVMsQ0FBQ3lCLFdBQVYsR0FBd0IsS0FBS0EsV0FBN0I7QUFDckJTLE1BQUFBLGdCQUFnQixDQUNibkwsS0FESCxHQUVHTCxHQUZILENBRU9zSixTQUZQO0FBR0EsV0FBSzVSLElBQUwsQ0FDRThULGdCQUFnQixDQUFDdFUsSUFEbkIsRUFFRXNVLGdCQUFnQixDQUFDcEwsUUFBakIsRUFGRjtBQUlBa0osTUFBQUEsU0FBUyxDQUFDQyxVQUFWLENBQXFCZ0MsUUFBckIsQ0FDRUMsZ0JBQWdCLENBQUNwTCxRQUFqQixFQURGO0FBR0Q7O0FBQ0QsV0FBTyxJQUFQO0FBQ0Q7O0FBQ0R3TCxFQUFBQSxRQUFRLENBQUNqRCxJQUFELEVBQU87QUFDYkosSUFBQUEsTUFBTSxDQUFDQyxRQUFQLENBQWdCTSxJQUFoQixHQUF1QkgsSUFBdkI7QUFDRDs7QUF4UmlDLENBQXBDIiwiZmlsZSI6ImJyb3dzZXIvbXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBNVkMgPSBNVkMgfHwge31cclxuIiwiTVZDLkNvbnN0YW50cyA9IHt9XG5NVkMuQ09OU1QgPSBNVkMuQ29uc3RhbnRzXG4iLCJNVkMuQ29uc3RhbnRzLkV2ZW50cyA9IHt9XHJcbk1WQy5DT05TVC5FViA9IE1WQy5Db25zdGFudHMuRXZlbnRzXHJcbiIsIk1WQy5Db25zdGFudHMuT3BlcmF0b3JzID0ge31cclxuTVZDLkNPTlNULk9wZXJhdG9ycyA9IHt9XHJcbk1WQy5DT05TVC5PcGVyYXRvcnMuQ29tcGFyaXNvbiA9IHtcclxuICBFUTogJ0VRJyxcclxuICBTVEVROiAnU1RFUScsXHJcbiAgTk9FUTogJ05PRVEnLFxyXG4gIFNUTk9FUTogJ1NUTk9FUScsXHJcbiAgR1Q6ICdHVCcsXHJcbiAgTFQ6ICdMVCcsXHJcbiAgR1RFOiAnR1RFJyxcclxuICBMVEU6ICdMVEUnLFxyXG59XHJcbk1WQy5DT05TVC5PcGVyYXRvcnMuU3RhdGVtZW50ID0ge1xyXG4gIEFORDogJ0FORCcsXHJcbiAgT1I6ICdPUidcclxufVxyXG5jb25zb2xlLmxvZyhNVkMuQ09OU1QpXHJcbiIsIk1WQy5Sb3V0ZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBwcm90b2NvbCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCB9XG4gIGdldCBob3N0bmFtZSgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSB9XG4gIGdldCBwb3J0KCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBvcnQgfVxuICBnZXQgcGF0aCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSB9XG4gIGdldCBoYXNoKCkge1xuICAgIGxldCBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICBsZXQgaGFzaEluZGV4ID0gaHJlZi5pbmRleE9mKCcjJylcbiAgICBpZihoYXNoSW5kZXggPiAtMSkge1xuICAgICAgbGV0IHBhcmFtSW5kZXggPSBocmVmLmluZGV4T2YoJz8nKVxuICAgICAgbGV0IHNsaWNlU3RhcnQgPSBoYXNoSW5kZXggKyAxXG4gICAgICBsZXQgc2xpY2VTdG9wXG4gICAgICBpZihwYXJhbUluZGV4ID4gLTEpIHtcbiAgICAgICAgc2xpY2VTdG9wID0gKGhhc2hJbmRleCA+IHBhcmFtSW5kZXgpXG4gICAgICAgICAgPyBocmVmLmxlbmd0aFxuICAgICAgICAgIDogcGFyYW1JbmRleFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2xpY2VTdG9wID0gaHJlZi5sZW5ndGhcbiAgICAgIH1cbiAgICAgIGhyZWYgPSBocmVmLnNsaWNlKHNsaWNlU3RhcnQsIHNsaWNlU3RvcClcbiAgICAgIGlmKGhyZWYubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBocmVmXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuICBnZXQgcGFyYW1zKCkge1xuICAgIGxldCBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICBsZXQgcGFyYW1JbmRleCA9IGhyZWYuaW5kZXhPZignPycpXG4gICAgaWYocGFyYW1JbmRleCA+IC0xKSB7XG4gICAgICBsZXQgaGFzaEluZGV4ID0gaHJlZi5pbmRleE9mKCcjJylcbiAgICAgIGxldCBzbGljZVN0YXJ0ID0gcGFyYW1JbmRleCArIDFcbiAgICAgIGxldCBzbGljZVN0b3BcbiAgICAgIGlmKGhhc2hJbmRleCA+IC0xKSB7XG4gICAgICAgIHNsaWNlU3RvcCA9IChwYXJhbUluZGV4ID4gaGFzaEluZGV4KVxuICAgICAgICAgID8gaHJlZi5sZW5ndGhcbiAgICAgICAgICA6IGhhc2hJbmRleFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2xpY2VTdG9wID0gaHJlZi5sZW5ndGhcbiAgICAgIH1cbiAgICAgIGhyZWYgPSBocmVmLnNsaWNlKHNsaWNlU3RhcnQsIHNsaWNlU3RvcClcbiAgICAgIGlmKGhyZWYubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBocmVmXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuICBnZXQgX3JvdXRlRGF0YSgpIHtcbiAgICBsZXQgcm91dGVEYXRhID0ge1xuICAgICAgbG9jYXRpb246IHt9LFxuICAgICAgY29udHJvbGxlcjoge30sXG4gICAgfVxuICAgIGxldCBwYXRoID0gdGhpcy5wYXRoLnNwbGl0KCcvJykuZmlsdGVyKChmcmFnbWVudCkgPT4gZnJhZ21lbnQubGVuZ3RoKVxuICAgIHBhdGggPSAocGF0aC5sZW5ndGgpXG4gICAgICA/IHBhdGhcbiAgICAgIDogWycvJ11cbiAgICBsZXQgaGFzaCA9IHRoaXMuaGFzaFxuICAgIGxldCBoYXNoRnJhZ21lbnRzID0gKGhhc2gpXG4gICAgICA/IGhhc2guc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgICA6IG51bGxcbiAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXNcbiAgICBsZXQgcGFyYW1EYXRhID0gKHBhcmFtcylcbiAgICAgID8gTVZDLlV0aWxzLnBhcmFtc1RvT2JqZWN0KHBhcmFtcylcbiAgICAgIDogbnVsbFxuICAgIGlmKHRoaXMucHJvdG9jb2wpIHJvdXRlRGF0YS5sb2NhdGlvbi5wcm90b2NvbCA9IHRoaXMucHJvdG9jb2xcbiAgICBpZih0aGlzLmhvc3RuYW1lKSByb3V0ZURhdGEubG9jYXRpb24uaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lXG4gICAgaWYodGhpcy5wb3J0KSByb3V0ZURhdGEubG9jYXRpb24ucG9ydCA9IHRoaXMucG9ydFxuICAgIGlmKHRoaXMucGF0aCkgcm91dGVEYXRhLmxvY2F0aW9uLnBhdGggPSB0aGlzLnBhdGhcbiAgICBpZihcbiAgICAgIGhhc2ggJiZcbiAgICAgIGhhc2hGcmFnbWVudHNcbiAgICApIHtcbiAgICAgIGhhc2hGcmFnbWVudHMgPSAoaGFzaEZyYWdtZW50cy5sZW5ndGgpXG4gICAgICA/IGhhc2hGcmFnbWVudHNcbiAgICAgIDogWycvJ11cbiAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5oYXNoID0ge1xuICAgICAgICBwYXRoOiBoYXNoLFxuICAgICAgICBmcmFnbWVudHM6IGhhc2hGcmFnbWVudHMsXG4gICAgICB9XG4gICAgfVxuICAgIGlmKFxuICAgICAgcGFyYW1zICYmXG4gICAgICBwYXJhbURhdGFcbiAgICApIHtcbiAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5wYXJhbXMgPSB7XG4gICAgICAgIHBhdGg6IHBhcmFtcyxcbiAgICAgICAgZGF0YTogcGFyYW1EYXRhLFxuICAgICAgfVxuICAgIH1cbiAgICByb3V0ZURhdGEubG9jYXRpb24ucGF0aCA9IHtcbiAgICAgIG5hbWU6IHRoaXMucGF0aCxcbiAgICAgIGZyYWdtZW50czogcGF0aCxcbiAgICB9XG4gICAgcm91dGVEYXRhLmxvY2F0aW9uLmN1cnJlbnRVUkwgPSB0aGlzLmN1cnJlbnRVUkxcbiAgICBsZXQgcm91dGVDb250cm9sbGVyRGF0YSA9IHRoaXMuX3JvdXRlQ29udHJvbGxlckRhdGFcbiAgICByb3V0ZURhdGEubG9jYXRpb24gPSBPYmplY3QuYXNzaWduKFxuICAgICAgcm91dGVEYXRhLmxvY2F0aW9uLFxuICAgICAgcm91dGVDb250cm9sbGVyRGF0YS5sb2NhdGlvblxuICAgIClcbiAgICByb3V0ZURhdGEuY29udHJvbGxlciA9IHJvdXRlQ29udHJvbGxlckRhdGEuY29udHJvbGxlclxuICAgIHRoaXMucm91dGVEYXRhID0gcm91dGVEYXRhXG4gICAgcmV0dXJuIHRoaXMucm91dGVEYXRhXG4gIH1cbiAgZ2V0IF9yb3V0ZUNvbnRyb2xsZXJEYXRhKCkge1xuICAgIGxldCByb3V0ZURhdGEgPSB7XG4gICAgICBsb2NhdGlvbjoge30sXG4gICAgfVxuICAgIE9iamVjdC5lbnRyaWVzKHRoaXMucm91dGVzKVxuICAgICAgLmZvckVhY2goKFtyb3V0ZVBhdGgsIHJvdXRlU2V0dGluZ3NdKSA9PiB7XG4gICAgICAgIGxldCBwYXRoRnJhZ21lbnRzID0gdGhpcy5wYXRoLnNwbGl0KCcvJykuZmlsdGVyKChmcmFnbWVudCkgPT4gZnJhZ21lbnQubGVuZ3RoKVxuICAgICAgICBwYXRoRnJhZ21lbnRzID0gKHBhdGhGcmFnbWVudHMubGVuZ3RoKVxuICAgICAgICAgID8gcGF0aEZyYWdtZW50c1xuICAgICAgICAgIDogWycvJ11cbiAgICAgICAgbGV0IHJvdXRlRnJhZ21lbnRzID0gcm91dGVQYXRoLnNwbGl0KCcvJykuZmlsdGVyKChmcmFnbWVudCwgZnJhZ21lbnRJbmRleCkgPT4gZnJhZ21lbnQubGVuZ3RoKVxuICAgICAgICByb3V0ZUZyYWdtZW50cyA9IChyb3V0ZUZyYWdtZW50cy5sZW5ndGgpXG4gICAgICAgICAgPyByb3V0ZUZyYWdtZW50c1xuICAgICAgICAgIDogWycvJ11cbiAgICAgICAgaWYoXG4gICAgICAgICAgcGF0aEZyYWdtZW50cy5sZW5ndGggJiZcbiAgICAgICAgICBwYXRoRnJhZ21lbnRzLmxlbmd0aCA9PT0gcm91dGVGcmFnbWVudHMubGVuZ3RoXG4gICAgICAgICkge1xuICAgICAgICAgIGxldCBtYXRjaFxuICAgICAgICAgIHJldHVybiByb3V0ZUZyYWdtZW50cy5maWx0ZXIoKHJvdXRlRnJhZ21lbnQsIHJvdXRlRnJhZ21lbnRJbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgIG1hdGNoID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgICAgbWF0Y2ggPT09IHRydWVcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBpZihyb3V0ZUZyYWdtZW50WzBdID09PSAnOicpIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudElES2V5ID0gcm91dGVGcmFnbWVudC5yZXBsYWNlKCc6JywgJycpXG4gICAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50SW5kZXggPT09IHBhdGhGcmFnbWVudHMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgcm91dGVEYXRhLmxvY2F0aW9uLmN1cnJlbnRJREtleSA9IGN1cnJlbnRJREtleVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByb3V0ZURhdGEubG9jYXRpb25bY3VycmVudElES2V5XSA9IHBhdGhGcmFnbWVudHNbcm91dGVGcmFnbWVudEluZGV4XVxuICAgICAgICAgICAgICAgIHJvdXRlRnJhZ21lbnQgPSB0aGlzLmZyYWdtZW50SURSZWdFeHBcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50ID0gcm91dGVGcmFnbWVudC5yZXBsYWNlKG5ldyBSZWdFeHAoJy8nLCAnZ2knKSwgJ1xcXFxcXC8nKVxuICAgICAgICAgICAgICAgIHJvdXRlRnJhZ21lbnQgPSB0aGlzLnJvdXRlRnJhZ21lbnROYW1lUmVnRXhwKHJvdXRlRnJhZ21lbnQpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbWF0Y2ggPSByb3V0ZUZyYWdtZW50LnRlc3QocGF0aEZyYWdtZW50c1tyb3V0ZUZyYWdtZW50SW5kZXhdKVxuICAgICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICBtYXRjaCA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgICAgIHJvdXRlRnJhZ21lbnRJbmRleCA9PT0gcGF0aEZyYWdtZW50cy5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5yb3V0ZSA9IHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHJvdXRlUGF0aCxcbiAgICAgICAgICAgICAgICAgIGZyYWdtZW50czogcm91dGVGcmFnbWVudHMsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJvdXRlRGF0YS5jb250cm9sbGVyID0gcm91dGVTZXR0aW5nc1xuICAgICAgICAgICAgICAgIHJldHVybiByb3V0ZVNldHRpbmdzXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVswXVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIHJldHVybiByb3V0ZURhdGFcbiAgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZ2V0IF9yb3V0ZXMoKSB7XG4gICAgdGhpcy5yb3V0ZXMgPSAodGhpcy5yb3V0ZXMpXG4gICAgICA/IHRoaXMucm91dGVzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVzXG4gIH1cbiAgc2V0IF9yb3V0ZXMocm91dGVzKSB7XG4gICAgdGhpcy5yb3V0ZXMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgcm91dGVzLCB0aGlzLl9yb3V0ZXNcbiAgICApXG4gIH1cbiAgZ2V0IF9jb250cm9sbGVyKCkgeyByZXR1cm4gdGhpcy5jb250cm9sbGVyIH1cbiAgc2V0IF9jb250cm9sbGVyKGNvbnRyb2xsZXIpIHsgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlciB9XG4gIGdldCBfcHJldmlvdXNVUkwoKSB7IHJldHVybiB0aGlzLnByZXZpb3VzVVJMIH1cbiAgc2V0IF9wcmV2aW91c1VSTChwcmV2aW91c1VSTCkgeyB0aGlzLnByZXZpb3VzVVJMID0gcHJldmlvdXNVUkwgfVxuICBnZXQgX2N1cnJlbnRVUkwoKSB7IHJldHVybiB0aGlzLmN1cnJlbnRVUkwgfVxuICBzZXQgX2N1cnJlbnRVUkwoY3VycmVudFVSTCkge1xuICAgIGlmKHRoaXMuY3VycmVudFVSTCkgdGhpcy5fcHJldmlvdXNVUkwgPSB0aGlzLmN1cnJlbnRVUkxcbiAgICB0aGlzLmN1cnJlbnRVUkwgPSBjdXJyZW50VVJMXG4gIH1cbiAgZ2V0IGZyYWdtZW50SURSZWdFeHAoKSB7IHJldHVybiBuZXcgUmVnRXhwKC9eKFswLTlBLVpcXD9cXD1cXCxcXC5cXCpcXC1cXF9cXCdcXFwiXFxeXFwlXFwkXFwjXFxAXFwhXFx+XFwoXFwpXFx7XFx9XFwmXFw8XFw+XFxcXFxcL10pKiQvLCAnZ2knKSB9XG4gIHJvdXRlRnJhZ21lbnROYW1lUmVnRXhwKGZyYWdtZW50KSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoJ14nLmNvbmNhdChmcmFnbWVudCwgJyQnKSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgaWYoXG4gICAgICAhdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLmVuYWJsZU1lZGlhdG9ycygpXG4gICAgICB0aGlzLmVuYWJsZUV2ZW50cygpXG4gICAgICB0aGlzLmVuYWJsZVJvdXRlcygpXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZGlzYWJsZUV2ZW50cygpXG4gICAgICB0aGlzLmRpc2FibGVSb3V0ZXMoKVxuICAgICAgdGhpcy5kaXNhYmxlTWVkaWF0b3JzKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgfVxuICBlbmFibGVSb3V0ZXMoKSB7XG4gICAgaWYodGhpcy5zZXR0aW5ncy5jb250cm9sbGVyKSB0aGlzLl9jb250cm9sbGVyID0gdGhpcy5zZXR0aW5ncy5jb250cm9sbGVyXG4gICAgdGhpcy5fcm91dGVzID0gT2JqZWN0LmVudHJpZXModGhpcy5zZXR0aW5ncy5yb3V0ZXMpLnJlZHVjZShcbiAgICAgIChcbiAgICAgICAgX3JvdXRlcyxcbiAgICAgICAgW3JvdXRlUGF0aCwgcm91dGVTZXR0aW5nc10sXG4gICAgICAgIHJvdXRlSW5kZXgsXG4gICAgICAgIG9yaWdpbmFsUm91dGVzLFxuICAgICAgKSA9PiB7XG4gICAgICAgIF9yb3V0ZXNbcm91dGVQYXRoXSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgcm91dGVTZXR0aW5ncyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjYWxsYmFjazogdGhpcy5jb250cm9sbGVyW3JvdXRlU2V0dGluZ3MuY2FsbGJhY2tdLmJpbmQodGhpcy5jb250cm9sbGVyKSxcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuIF9yb3V0ZXNcbiAgICAgIH0sXG4gICAgICB7fVxuICAgIClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGVuYWJsZU1lZGlhdG9ycygpIHtcbiAgICBPYmplY3QuYXNzaWduKFxuICAgICAgdGhpcy5fbWVkaWF0b3JzLFxuICAgICAgdGhpcy5zZXR0aW5ncy5tZWRpYXRvcnMsXG4gICAgICB7XG4gICAgICAgIG5hdmlnYXRlTWVkaWF0b3I6IG5ldyBNVkMuTWVkaWF0b3JzLk5hdmlnYXRlKCksXG4gICAgICB9XG4gICAgKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZGlzYWJsZU1lZGlhdG9ycygpIHtcbiAgICBkZWxldGUgdGhpcy5fbWVkaWF0b3JzLm5hdmlnYXRlTWVkaWF0b3JcbiAgfVxuICBkaXNhYmxlUm91dGVzKCkge1xuICAgIGRlbGV0ZSB0aGlzLl9yb3V0ZXNcbiAgICBkZWxldGUgdGhpcy5fY29udHJvbGxlclxuICB9XG4gIGVuYWJsZUV2ZW50cygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMucm91dGVDaGFuZ2UuYmluZCh0aGlzKSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGVFdmVudHMoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLnJvdXRlQ2hhbmdlLmJpbmQodGhpcykpXG4gIH1cbiAgcm91dGVDaGFuZ2UoKSB7XG4gICAgdGhpcy5fY3VycmVudFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgbGV0IHJvdXRlRGF0YSA9IHRoaXMuX3JvdXRlRGF0YVxuICAgIGlmKHJvdXRlRGF0YS5jb250cm9sbGVyKSB7XG4gICAgICBsZXQgbmF2aWdhdGVNZWRpYXRvciA9IHRoaXMubWVkaWF0b3JzLm5hdmlnYXRlTWVkaWF0b3JcbiAgICAgIGlmKHRoaXMucHJldmlvdXNVUkwpIHJvdXRlRGF0YS5wcmV2aW91c1VSTCA9IHRoaXMucHJldmlvdXNVUkxcbiAgICAgIG5hdmlnYXRlTWVkaWF0b3JcbiAgICAgICAgLnVuc2V0KClcbiAgICAgICAgLnNldChyb3V0ZURhdGEpXG4gICAgICB0aGlzLmVtaXQoXG4gICAgICAgIG5hdmlnYXRlTWVkaWF0b3IubmFtZSxcbiAgICAgICAgbmF2aWdhdGVNZWRpYXRvci5lbWlzc2lvbigpXG4gICAgICApXG4gICAgICByb3V0ZURhdGEuY29udHJvbGxlci5jYWxsYmFjayhcbiAgICAgICAgbmF2aWdhdGVNZWRpYXRvci5lbWlzc2lvbigpXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgbmF2aWdhdGUocGF0aCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aFxuICB9XG59XG4iLCJNVkMuVXRpbHMuaXNBcnJheSA9IGZ1bmN0aW9uIGlzQXJyYXkob2JqZWN0KSB7IHJldHVybiBBcnJheS5pc0FycmF5KG9iamVjdCkgfVxyXG5NVkMuVXRpbHMuaXNPYmplY3QgPSBmdW5jdGlvbiBpc09iamVjdChvYmplY3QpIHtcclxuICByZXR1cm4gKFxyXG4gICAgIUFycmF5LmlzQXJyYXkob2JqZWN0KSAmJlxyXG4gICAgb2JqZWN0ICE9PSBudWxsXHJcbiAgKSA/IHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnXHJcbiAgICA6IGZhbHNlXHJcbn1cclxuTVZDLlV0aWxzLnR5cGVPZiA9IGZ1bmN0aW9uIHR5cGVPZih2YWx1ZSkge1xyXG4gIHJldHVybiAodHlwZW9mIHZhbHVlQSA9PT0gJ29iamVjdCcpXHJcbiAgICA/IChNVkMuVXRpbHMuaXNPYmplY3QodmFsdWVBKSlcclxuICAgICAgPyAnb2JqZWN0J1xyXG4gICAgICA6IChNVkMuVXRpbHMuaXNBcnJheSh2YWx1ZUEpKVxyXG4gICAgICAgID8gJ2FycmF5J1xyXG4gICAgICAgIDogKHZhbHVlQSA9PT0gbnVsbClcclxuICAgICAgICAgID8gJ251bGwnXHJcbiAgICAgICAgICA6IHVuZGVmaW5lZFxyXG4gICAgOiB0eXBlb2YgdmFsdWVcclxufVxyXG5NVkMuVXRpbHMuaXNIVE1MRWxlbWVudCA9IGZ1bmN0aW9uIGlzSFRNTEVsZW1lbnQob2JqZWN0KSB7XHJcbiAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XHJcbn1cclxuIiwiTVZDLlV0aWxzLnR5cGVPZiA9ICBmdW5jdGlvbiB0eXBlT2YoZGF0YSkge1xyXG4gIHN3aXRjaCh0eXBlb2YgZGF0YSkge1xyXG4gICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgbGV0IF9vYmplY3RcclxuICAgICAgaWYoTVZDLlV0aWxzLmlzQXJyYXkoZGF0YSkpIHtcclxuICAgICAgICAvLyBBcnJheVxyXG4gICAgICAgIHJldHVybiAnYXJyYXknXHJcbiAgICAgIH0gZWxzZSBpZihcclxuICAgICAgICBNVkMuVXRpbHMuaXNPYmplY3QoZGF0YSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgLy8gT2JqZWN0XHJcbiAgICAgICAgcmV0dXJuICdvYmplY3QnXHJcbiAgICAgIH0gZWxzZSBpZihcclxuICAgICAgICBkYXRhID09PSBudWxsXHJcbiAgICAgICkge1xyXG4gICAgICAgIC8vIE51bGxcclxuICAgICAgICByZXR1cm4gJ251bGwnXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIF9vYmplY3RcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICBjYXNlICdudW1iZXInOlxyXG4gICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICBjYXNlICd1bmRlZmluZWQnOlxyXG4gICAgY2FzZSAnZnVuY3Rpb24nOlxyXG4gICAgICByZXR1cm4gdHlwZW9mIGRhdGFcclxuICAgICAgYnJlYWtcclxuICB9XHJcbn1cclxuIiwiTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdCA9IGZ1bmN0aW9uIGFkZFByb3BlcnRpZXNUb09iamVjdCgpIHtcclxuICBsZXQgdGFyZ2V0T2JqZWN0XHJcbiAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgIGNhc2UgMjpcclxuICAgICAgbGV0IHByb3BlcnRpZXMgPSBhcmd1bWVudHNbMF1cclxuICAgICAgdGFyZ2V0T2JqZWN0ID0gYXJndW1lbnRzWzFdXHJcbiAgICAgIGZvcihsZXQgW3Byb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocHJvcGVydGllcykpIHtcclxuICAgICAgICB0YXJnZXRPYmplY3RbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5VmFsdWVcclxuICAgICAgfVxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAzOlxyXG4gICAgICBsZXQgcHJvcGVydHlOYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgIGxldCBwcm9wZXJ0eVZhbHVlID0gYXJndW1lbnRzWzFdXHJcbiAgICAgIHRhcmdldE9iamVjdCA9IGFyZ3VtZW50c1syXVxyXG4gICAgICB0YXJnZXRPYmplY3RbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5VmFsdWVcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgcmV0dXJuIHRhcmdldE9iamVjdFxyXG59XHJcbiIsIk1WQy5VdGlscy5vYmplY3RRdWVyeSA9IGZ1bmN0aW9uIG9iamVjdFF1ZXJ5KFxyXG4gIHN0cmluZyxcclxuICBjb250ZXh0XHJcbikge1xyXG4gIGxldCBzdHJpbmdEYXRhID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlTm90YXRpb24oc3RyaW5nKVxyXG4gIGlmKHN0cmluZ0RhdGFbMF0gPT09ICdAJykgc3RyaW5nRGF0YS5zcGxpY2UoMCwgMSlcclxuICBpZighc3RyaW5nRGF0YS5sZW5ndGgpIHJldHVybiBjb250ZXh0XHJcbiAgY29udGV4dCA9IChNVkMuVXRpbHMuaXNPYmplY3QoY29udGV4dCkpXHJcbiAgICA/IE9iamVjdC5lbnRyaWVzKGNvbnRleHQpXHJcbiAgICA6IGNvbnRleHRcclxuICByZXR1cm4gc3RyaW5nRGF0YS5yZWR1Y2UoKG9iamVjdCwgZnJhZ21lbnQsIGZyYWdtZW50SW5kZXgsIGZyYWdtZW50cykgPT4ge1xyXG4gICAgbGV0IHByb3BlcnRpZXMgPSBbXVxyXG4gICAgZnJhZ21lbnQgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VGcmFnbWVudChmcmFnbWVudClcclxuICAgIGZvcihsZXQgW3Byb3BlcnR5S2V5LCBwcm9wZXJ0eVZhbHVlXSBvZiBvYmplY3QpIHtcclxuICAgICAgaWYocHJvcGVydHlLZXkubWF0Y2goZnJhZ21lbnQpKSB7XHJcbiAgICAgICAgaWYoZnJhZ21lbnRJbmRleCA9PT0gZnJhZ21lbnRzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzLmNvbmNhdChbW3Byb3BlcnR5S2V5LCBwcm9wZXJ0eVZhbHVlXV0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzLmNvbmNhdChPYmplY3QuZW50cmllcyhwcm9wZXJ0eVZhbHVlKSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIG9iamVjdCA9IHByb3BlcnRpZXNcclxuICAgIHJldHVybiBvYmplY3RcclxuICB9LCBjb250ZXh0KVxyXG59XHJcbk1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZU5vdGF0aW9uID0gZnVuY3Rpb24gcGFyc2VOb3RhdGlvbihzdHJpbmcpIHtcclxuICBpZihcclxuICAgIHN0cmluZy5jaGFyQXQoMCkgPT09ICdbJyAmJlxyXG4gICAgc3RyaW5nLmNoYXJBdChzdHJpbmcubGVuZ3RoIC0gMSkgPT0gJ10nXHJcbiAgKSB7XHJcbiAgICBzdHJpbmcgPSBzdHJpbmdcclxuICAgICAgLnNsaWNlKDEsIC0xKVxyXG4gICAgICAuc3BsaXQoJ11bJylcclxuICB9IGVsc2Uge1xyXG4gICAgc3RyaW5nID0gc3RyaW5nXHJcbiAgICAgIC5zcGxpdCgnLicpXHJcbiAgfVxyXG4gIHJldHVybiBzdHJpbmdcclxufVxyXG5NVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VGcmFnbWVudCA9IGZ1bmN0aW9uIHBhcnNlRnJhZ21lbnQoZnJhZ21lbnQpIHtcclxuICBpZihcclxuICAgIGZyYWdtZW50LmNoYXJBdCgwKSA9PT0gJy8nICYmXHJcbiAgICBmcmFnbWVudC5jaGFyQXQoZnJhZ21lbnQubGVuZ3RoIC0gMSkgPT0gJy8nXHJcbiAgKSB7XHJcbiAgICBmcmFnbWVudCA9IGZyYWdtZW50LnNsaWNlKDEsIC0xKVxyXG4gICAgZnJhZ21lbnQgPSBuZXcgUmVnRXhwKCdeJy5jb25jYXQoZnJhZ21lbnQsICckJykpXHJcbiAgfVxyXG4gIHJldHVybiBmcmFnbWVudFxyXG59XHJcbiIsIk1WQy5VdGlscy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzID0gZnVuY3Rpb24gdG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyhcclxuICB0b2dnbGVNZXRob2QsXHJcbiAgZXZlbnRzLFxyXG4gIHRhcmdldE9iamVjdHMsXHJcbiAgY2FsbGJhY2tzXHJcbikge1xyXG4gIGZvcihsZXQgW2V2ZW50U2V0dGluZ3MsIGV2ZW50Q2FsbGJhY2tOYW1lXSBvZiBPYmplY3QuZW50cmllcyhldmVudHMpKSB7XHJcbiAgICBsZXQgZXZlbnREYXRhID0gZXZlbnRTZXR0aW5ncy5zcGxpdCgnICcpXHJcbiAgICBsZXQgZXZlbnRUYXJnZXRTZXR0aW5ncyA9IGV2ZW50RGF0YVswXVxyXG4gICAgbGV0IGV2ZW50TmFtZSA9IGV2ZW50RGF0YVsxXVxyXG4gICAgbGV0IGV2ZW50VGFyZ2V0cyA9IE1WQy5VdGlscy5vYmplY3RRdWVyeShcclxuICAgICAgZXZlbnRUYXJnZXRTZXR0aW5ncyxcclxuICAgICAgdGFyZ2V0T2JqZWN0c1xyXG4gICAgKVxyXG4gICAgZXZlbnRUYXJnZXRzID0gKCFNVkMuVXRpbHMuaXNBcnJheShldmVudFRhcmdldHMpKVxyXG4gICAgICA/IFtbJ0AnLCBldmVudFRhcmdldHNdXVxyXG4gICAgICA6IGV2ZW50VGFyZ2V0c1xyXG4gICAgZm9yKGxldCBbZXZlbnRUYXJnZXROYW1lLCBldmVudFRhcmdldF0gb2YgZXZlbnRUYXJnZXRzKSB7XHJcbiAgICAgIGxldCBldmVudE1ldGhvZE5hbWUgPSAodG9nZ2xlTWV0aG9kID09PSAnb24nKVxyXG4gICAgICA/IChcclxuICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0IHx8XHJcbiAgICAgICAgKFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBEb2N1bWVudFxyXG4gICAgICAgIClcclxuICAgICAgKSA/ICdhZGRFdmVudExpc3RlbmVyJ1xyXG4gICAgICAgIDogJ29uJ1xyXG4gICAgICA6IChcclxuICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0IHx8XHJcbiAgICAgICAgKFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBEb2N1bWVudFxyXG4gICAgICAgIClcclxuICAgICAgKSA/ICdyZW1vdmVFdmVudExpc3RlbmVyJ1xyXG4gICAgICAgIDogJ29mZidcclxuICAgICAgbGV0IGV2ZW50Q2FsbGJhY2sgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkoXHJcbiAgICAgICAgZXZlbnRDYWxsYmFja05hbWUsXHJcbiAgICAgICAgY2FsbGJhY2tzXHJcbiAgICAgIClbMF1bMV1cclxuICAgICAgaWYoZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xyXG4gICAgICAgIGZvcihsZXQgX2V2ZW50VGFyZ2V0IG9mIGV2ZW50VGFyZ2V0KSB7XHJcbiAgICAgICAgICBfZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYoZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIGV2ZW50VGFyZ2V0W2V2ZW50TWV0aG9kTmFtZV0oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGV2ZW50VGFyZ2V0W2V2ZW50TWV0aG9kTmFtZV0oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbk1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzID0gZnVuY3Rpb24gYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cygpIHtcclxuICB0aGlzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoJ29uJywgLi4uYXJndW1lbnRzKVxyXG59XHJcbk1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIHVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKCkge1xyXG4gIHRoaXMudG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cygnb2ZmJywgLi4uYXJndW1lbnRzKVxyXG59XHJcbiIsIk1WQy5NZWRpYXRvcnMuTmF2aWdhdGUgPSBjbGFzcyBleHRlbmRzIE1WQy5NZWRpYXRvciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgICB0aGlzLmFkZFNldHRpbmdzKClcclxuICAgIHRoaXMuZW5hYmxlKClcclxuICB9XHJcbiAgYWRkU2V0dGluZ3MoKSB7XHJcbiAgICB0aGlzLl9uYW1lID0gJ25hdmlnYXRlJ1xyXG4gICAgdGhpcy5fc2NoZW1hID0ge1xyXG4gICAgICBvbGRVUkw6IHtcclxuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgfSxcclxuICAgICAgbmV3VVJMOiB7XHJcbiAgICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgIH0sXHJcbiAgICAgIGN1cnJlbnRSb3V0ZToge1xyXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICB9LFxyXG4gICAgICBjdXJyZW50Q29udHJvbGxlcjoge1xyXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICB9LFxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJNVkMuTWVkaWF0b3JzLlZhbGlkYXRlID0gY2xhc3MgZXh0ZW5kcyBNVkMuTWVkaWF0b3Ige1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxyXG4gICAgdGhpcy5hZGRTZXR0aW5ncygpXHJcbiAgICB0aGlzLmVuYWJsZSgpXHJcbiAgfVxyXG4gIGFkZFNldHRpbmdzKCkge1xyXG4gICAgdGhpcy5fbmFtZSA9ICd2YWxpZGF0ZSdcclxuICAgIHRoaXMuX3NjaGVtYSA9IHtcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxyXG4gICAgICB9LFxyXG4gICAgICByZXN1bHRzOiB7XHJcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXHJcbiAgICAgIH0sXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==
