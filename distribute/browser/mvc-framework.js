var MVC = MVC || {};
MVC.Constants = {};
MVC.CONST = MVC.Constants;
MVC.Constants.Events = {};
MVC.CONST.EV = MVC.Constants.Events;
MVC.Templates = {
  ObjectQueryStringFormatInvalidRoot: function ObjectQueryStringFormatInvalid(data) {
    return ['Object Query "string" property must be formatted to first include "[@]".'].join('\n');
  },
  DataSchemaMismatch: function DataSchemaMismatch(data) {
    return ["Data and Schema properties do not match."].join('\n');
  },
  DataFunctionInvalid: function DataFunctionInvalid(data) {
    ["Model Data property type \"Function\" is not valid."].join('\n');
  },
  DataUndefined: function DataUndefined(data) {
    ["Model Data property undefined."].join('\n');
  },
  SchemaUndefined: function SchemaUndefined(data) {
    ["Model \"Schema\" undefined."].join('\n');
  }
};
MVC.TMPL = MVC.Templates;
MVC.Utils = {};
MVC.Utils.isArray = function isArray(object) {
  return Array.isArray(object);
};

MVC.Utils.isObject = function isObject(object) {
  return !Array.isArray(object) ? typeof object === 'object' : false;
};

MVC.Utils.isEqualType = function isEqualType(valueA, valueB) {
  return valueA === valueB;
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
    fragment = new RegExp(fragment);
  }

  return fragment;
};
MVC.Utils.toggleEventsForTargetObjects = function toggleEventsForTargetObjects(toggleMethod, events, targetObjects, callbacks) {
  for (var [eventSettings, eventCallbackName] of Object.entries(events)) {
    var eventData = eventSettings.split(' ');
    var eventTargetSettings = eventData[0];
    var eventName = eventData[1];
    var eventTargets = MVC.Utils.objectQuery(eventTargetSettings, targetObjects);

    for (var [eventTargetName, eventTarget] of eventTargets) {
      var eventMethodName = toggleMethod === 'on' ? eventTarget instanceof NodeList || eventTarget instanceof HTMLElement ? 'addEventListener' : 'on' : eventTarget instanceof NodeList || eventTarget instanceof HTMLElement ? 'removeEventListener' : 'off';
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
    switch (MVC.Utils.typeOf(data)) {
      case 'array':
        var array = [];
        schema = MVC.Utils.typeOf(schema) === 'function' ? schema() : schema;

        if (MVC.Utils.isEqualType(MVC.Utils.typeOf(schema), MVC.Utils.typeOf(array))) {
          console.log(schema.name);

          for (var [arrayKey, arrayValue] of Object.entries(data)) {
            array.push(this.validateDataSchema(arrayValue));
          }
        }

        return array;
        break;

      case 'object':
        var object = {};
        schema = MVC.Utils.typeOf(schema) === 'function' ? schema() : schema;

        if (MVC.Utils.isEqualType(MVC.Utils.typeOf(schema), MVC.Utils.typeOf(object))) {
          console.log(schema.name);

          for (var [objectKey, objectValue] of Object.entries(data)) {
            object[objectKey] = this.validateDataSchema(objectValue, schema[objectKey]);
          }
        }

        return object;
        break;

      case 'string':
      case 'number':
      case 'boolean':
        schema = MVC.Utils.typeOf(schema) === 'function' ? schema() : schema;

        if (MVC.Utils.isEqualType(MVC.Utils.typeOf(schema), MVC.Utils.typeOf(data))) {
          console.log(schema.name);
          return data;
        } else {
          throw MVC.TMPL;
        }

        break;

      case 'null':
        if (MVC.Utils.isEqualType(MVC.Utils.typeOf(schema), MVC.Utils.typeOf(data))) {
          return data;
        }

        break;

      case 'undefined':
        throw MVC.TMPL;
        break;

      case 'function':
        throw MVC.TMPL;
        break;
    }
  } else {
    throw MVC.TMPL;
  }
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
        var additionalArguments = Object.values(arguments).splice(2);
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
  constructor(settings, options, configuration) {
    super();
    if (configuration) this._configuration = configuration;
    if (options) this._options = options;
    if (settings) this._settings = settings;
  }

  get _configuration() {
    this.configuration = this.configuration ? this.configuration : {};
    return this.configuration;
  }

  set _configuration(configuration) {
    this.configuration = configuration;
  }

  get _options() {
    this.options = this.options ? this.options : {};
    return this.options;
  }

  set _options(options) {
    this.options = options;
  }

  get _settings() {
    this.settings = this.settings ? this.settings : {};
    return this.settings;
  }

  set _settings(settings) {
    this.settings = settings;
  }

};
MVC.Observer = class extends MVC.Base {
  constructor() {
    super(...arguments);
    this.enable();
  }

  get _connected() {
    return this.connected || false;
  }

  set _connected(connected) {
    this.connected = connected;
  }

  get observer() {
    this._observer = this._observer ? this._observer : new MutationObserver(this.observerCallback.bind(this));
    return this._observer;
  }

  get _target() {
    return this.target;
  }

  set _target(target) {
    this.target = target;
  }

  get _options() {
    return this.options;
  }

  set _options(options) {
    this.options = options;
  }

  get _mutations() {
    this.mutations = this.mutations ? this.mutations : [];
    return this.mutations;
  }

  set _mutations(mutations) {
    for (var [mutationSettings, mutationCallback] of Object.entries(mutations.settings)) {
      var mutation = void 0;
      var mutationData = mutationSettings.split(' ');
      var mutationTarget = MVC.Utils.objectQuery(mutationData[0], mutations.targets)[0][1];
      var mutationEventName = mutationData[1];
      mutationCallback = MVC.Utils.objectQuery(mutationCallback, mutations.callbacks)[0][1];
      mutation = {
        target: mutationTarget,
        name: mutationEventName,
        callback: mutationCallback
      };

      this._mutations.push(mutation);
    }
  }

  enable() {
    var settings = this.settings;

    if (settings && !this.enabled) {
      if (settings.target) this._target = settings.target instanceof NodeList ? settings.target[0] : settings.target;
      if (settings.options) this._options = settings.options;
      if (settings.mutations) this._mutations = settings.mutations;
      this._enabled = true;
    }
  }

  disable() {
    var settings = this.settings;

    if (settings && this.enabled) {
      if (this.target) delete this.target;
      if (this.options) delete this.options;
      if (this.mutations) delete this.mutations;
      if (this.observeer) delete this.observer;
      this._enabled = false;
    }
  }

  observerCallback(mutationRecordList, observer) {
    var _this = this;

    var _loop = function _loop(mutationRecordIndex, mutationRecord) {
      switch (mutationRecord.type) {
        case 'childList':
          var mutationRecordCategories = ['addedNodes', 'removedNodes'];

          var _loop2 = function _loop2(mutationRecordCategory) {
            if (mutationRecord[mutationRecordCategory].length) {
              var _loop3 = function _loop3(nodeIndex, node) {
                _this.mutations.forEach(_mutation => {
                  if (mutationRecordCategory.match(new RegExp('^'.concat(_mutation.name)))) {
                    if (_mutation.target instanceof HTMLElement) {
                      if (_mutation.target === node) {
                        _mutation.callback({
                          mutation: _mutation,
                          mutationRecord: mutationRecord
                        });
                      }
                    } else if (_mutation.target instanceof NodeList) {
                      for (var _mutationTarget of _mutation.target) {
                        if (_mutationTarget === node) {
                          _mutationTarget.callback({
                            mutation: _mutation,
                            mutationRecord: mutationRecord
                          });
                        }
                      }
                    }
                  }
                });
              };

              for (var [nodeIndex, node] of Object.entries(mutationRecord[mutationRecordCategory])) {
                _loop3(nodeIndex, node);
              }
            }
          };

          for (var mutationRecordCategory of mutationRecordCategories) {
            _loop2(mutationRecordCategory);
          }

          break;

        case 'attributes':
          var mutation = _this.mutations.filter(_mutation => _mutation.name === mutationRecord.type && _mutation.data === mutationRecord.attributeName)[0];

          if (mutation) {
            mutation.callback({
              mutation: mutation,
              mutationRecord: mutationRecord
            });
          }

          break;
      }
    };

    for (var [mutationRecordIndex, mutationRecord] of Object.entries(mutationRecordList)) {
      _loop(mutationRecordIndex, mutationRecord);
    }
  }

  connect() {
    this.observer.observe(this.target, this.options);
    this._connected = true;
  }

  disconnect() {
    this.observer.disconnect();
    this._connected = false;
  }

};
MVC.Service = class extends MVC.Base {
  constructor() {
    super(...arguments);
    this.enable();
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

    for (var header of headers) {
      this._xhr.setRequestHeader({
        header
      }[0], {
        header
      }[1]);

      this._headers.push(header);
    }
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

  newXHR() {
    return new Promise((resolve, reject) => {
      if (this._xhr.status === 200) this._xhr.abort();

      this._xhr.open(this._type, this._url);

      this._xhr.onload = resolve;
      this._xhr.onerror = reject;

      this._xhr.send(this._data);
    });
  }

  enable() {
    var settings = this.settings;

    if (settings && !this.enabled) {
      if (settings.type) this._type = settings.type;
      if (settings.url) this._url = settings.url;
      if (settings.data) this._data = settings.data || null;
      if (settings.headers) this._headers = settings.headers || [this._defaults.contentType];
      if (this.settings.responseType) this._responseType = this._settings.responseType;
      this._enabled = true;
    }
  }

  disable() {
    if (Object.keys(this.settings).length) {
      delete this.settings.type;
      delete this.settings.url;
      delete this.settings.data;
      delete this.settings.headers;
      delete this.settings.responseType;
      this._enabled = true;
    }
  }

};
MVC.Model = class extends MVC.Base {
  constructor() {
    super(...arguments);
    this.enable();
  }

  get _isSetting() {
    return this.isSetting;
  }

  set _isSetting(isSetting) {
    this.isSetting = isSetting;
  }

  get _defaults() {
    return this._defaults;
  }

  set _defaults(defaults) {
    this.defaults = defaults;
    this.set(this.defaults);
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

  get _enabled() {
    return this.enabled || false;
  }

  set _enabled(enabled) {
    this.enabled = enabled;
  }

  addDataEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.dataEvents, this, this.dataCallbacks);
  }

  get() {
    var property = arguments[0];
    return this._data['_'.concat(property)];
  }

  set() {
    this._history = this.parse();

    switch (arguments.length) {
      case 1:
        var _arguments = Object.entries(arguments[0]);

        _arguments.forEach((_ref, index) => {
          var [key, value] = _ref;

          if (index === 0) {
            this._isSetting = true;
          } else if (index === _arguments.length - 1) {
            this._isSetting = false;
          }

          this.setDataProperty(key, value);
        });

        break;

      case 2:
        var key = arguments[0];
        var value = arguments[1];
        this.setDataProperty(key, value);
        break;

      case 3:
        var key = arguments[0];
        var value = arguments[1];
        var silent = arguments[2];
        this.setDataProperty(key, value, silent);
        break;
    }
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
  }

  setDataProperty(key, value, silent) {
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

            if (!silent && !context._isSetting) {
              var setValueEventName = ['set', ':', key].join('');
              var setEventName = 'set';
              context.emit(setValueEventName, {
                name: setValueEventName,
                data: {
                  key: key,
                  value: value
                }
              }, context);
              context.emit(setEventName, {
                name: setEventName,
                data: {
                  key: key,
                  value: value
                }
              }, context);
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
      if (this.settings.histiogram) this._histiogram = this.settings.histiogram;
      if (this.settings.data) this.set(this.settings.data);
      if (this.settings.dataCallbacks) this._dataCallbacks = this.settings.dataCallbacks;
      if (this.settings.dataEvents) this._dataEvents = this.settings.dataEvents;
      if (this.settings.schema) this._schema = this.settings.schema;
      if (this.settings.defaults) this._defaults = this.settings.defaults;

      if (this.dataEvents && this.dataCallbacks) {
        this.addDataEvents();
      }

      this._enabled = true;
    }
  }

  disable() {
    var settings = this.settings;

    if (settings && !this.enabled) {
      if (this.dataEvents && this.dataCallbacks) {
        this.removeDataEvents();
      }

      delete this._histiogram;
      delete this._data;
      delete this._dataCallbacks;
      delete this._dataEvents;
      delete this._schema;
      delete this._defaults;
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

  get emission() {
    return {
      name: this._name,
      data: this.parse()
    };
  }

};
MVC.View = class extends MVC.Base {
  constructor() {
    super(...arguments);
    this.enable();
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
    if (element instanceof HTMLElement) {
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
      if (uiValue instanceof HTMLElement) {
        this._ui[uiKey] = uiValue;
      } else if (typeof uiValue === 'string') {
        this._ui[uiKey] = this._element.querySelectorAll(uiValue);
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

  get _uiEmitters() {
    this.uiEmitters = this.uiEmitters ? this.uiEmitters : {};
    return this.uiEmitters;
  }

  set _uiEmitters(uiEmitters) {
    var _uiEmitters = {};
    uiEmitters.forEach(UIEmitter => {
      var uiEmitter = new UIEmitter();
      _uiEmitters[uiEmitter.name] = uiEmitter;
    });
    this.uiEmitters = MVC.Utils.addPropertiesToObject(_uiEmitters, this._uiEmitters);
  }

  get _observers() {
    this.observers = this.observers ? this.observers : {};
    return this.observers;
  }

  set _observers(observers) {
    for (var [observerConfiguration, mutationSettings] of Object.entries(observers)) {
      var observerConfigurationData = observerConfiguration.split(' ');
      var observerName = observerConfigurationData[0];
      var observerTarget = MVC.Utils.objectQuery(observerName, this.ui);
      var observerOptions = observerConfigurationData[1] ? observerConfigurationData[1].split(':').reduce((_observerOptions, currentValue) => {
        _observerOptions[currentValue] = true;
        return _observerOptions;
      }, {}) : {};
      var observerSettings = {
        target: observerTarget[0][1],
        options: observerOptions,
        mutations: {
          targets: this.ui,
          settings: mutationSettings,
          callbacks: this.observerCallbacks
        }
      };
      var observer = new MVC.Observer(observerSettings);
      this._observers[observerName] = observer;
    }
  }

  get elementObserver() {
    this._elementObserver = this._elementObserver ? this._elementObserver : new MutationObserver(this.elementObserve.bind(this));
    return this._elementObserver;
  }

  elementObserve(mutationRecordList, observer) {
    for (var [mutationRecordIndex, mutationRecord] of Object.entries(mutationRecordList)) {
      switch (mutationRecord.type) {
        case 'childList':
          var mutationRecordCategories = ['addedNodes', 'removedNodes'];

          for (var mutationRecordCategory of mutationRecordCategories) {
            if (mutationRecord[mutationRecordCategory].length) {
              this.removeObservers();
              this.removeUI();
              this.addUI();
              this.addObservers();
            }
          }

          break;
      }
    }
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
    for (var [templateName, templateSettings] of Object.entries(templates)) {
      this._templates[templateName] = templateSettings;
    }
  }

  autoInsert() {
    this.insert.element;
    this.insert.method;
    document.querySelectorAll(this.insert.element).forEach(element => {
      element.insertAdjacentElement(this.insert.method, this.element);
    });
  }

  autoRemove() {
    if (this.element && this.element.parentElement) this.element.parentElement.removeChild(this.element);
  }

  addElement(settings) {
    settings = settings || this.settings;
    if (settings.elementName) this._elementName = settings.elementName;
    if (settings.element) this._element = settings.element;
    if (settings.attributes) this._attributes = settings.attributes;
    if (settings.templates) this._templates = settings.templates;
    if (settings.insert) this._insert = settings.insert;
  }

  removeElement(settings) {
    settings = settings || this.settings;
    if (this.element && this.element.parentElement) this.element.parentElement.removeChild(this.element);
    if (this.element) delete this.element;
    if (this.attributes) delete this.attributes;
    if (this.templates) delete this.templates;
    if (this.insert) delete this.insert;
  }

  addUI(settings) {
    settings = settings || this.settings;
    if (settings.ui) this._ui = settings.ui;
    if (settings.uiEmitters) this._uiEmitters = settings.uiEmitters;
    if (settings.uiCallbacks) this._uiCallbacks = settings.uiCallbacks;

    if (settings.uiEvents) {
      this._uiEvents = settings.uiEvents;
      this.addUIEvents();
    }
  }

  removeUI(settings) {
    settings = settings || this.settings;

    if (settings.uiEvents) {
      this.removeUIEvents();
      delete this._uiEvents;
    }

    delete this.uiEvents;
    delete this.ui;
    delete this.uiCallbacks;
  }

  addObservers(settings) {
    settings = settings || this.settings;
    if (settings.observerCallbacks) this._observerCallbacks = settings.observerCallbacks;

    if (settings.observers) {
      this._observers = settings.observers;
      this.connectObservers();
    }
  }

  removeObservers() {
    if (this.observerCallbacks) delete this.observerCallbacks;

    if (this.observers) {
      this.disconnectObservers();
      delete this.observers;
    }
  }

  addUIEvents() {
    if (this.uiEvents && this.ui && this.uiCallbacks) {
      MVC.Utils.bindEventsToTargetObjects(this.uiEvents, this.ui, this.uiCallbacks);
    }
  }

  removeUIEvents() {
    if (this.uiEvents && this.ui && this.uiCallbacks) {
      MVC.Utils.unbindEventsFromTargetObjects(this.uiEvents, this.ui, this.uiCallbacks);
    }
  }

  connectObservers() {
    Object.entries(this._observers).forEach((_ref) => {
      var [observerName, observer] = _ref;
      observer.connect();
    });
  }

  disconnectObservers() {
    Object.entries(this._observers).forEach((_ref2) => {
      var [observerName, observer] = _ref2;
      observer.disconnect();
    });
  }

  enable() {
    var settings = this.settings;

    if (settings && !this.enabled) {
      this.addElement(settings);
      this.addUI(settings);
      this.addObservers(settings);
      this._enabled = true;
    }
  }

  disable() {
    var settings = this.settings;

    if (settings && this.enabled) {
      this.removeUI(settings);
      this.removeElement(settings);
      this.removeObservers(settings);
      this._enabled = false;
    }
  }

};
MVC.Controller = class extends MVC.Base {
  constructor() {
    super(...arguments);
    this.enable();
  }

  get _emitters() {
    this.emitters = this.emitters ? this.emitters : {};
    return this.emitters;
  }

  set _emitters(emitters) {
    this.emitters = MVC.Utils.addPropertiesToObject(emitters, this._emitters);
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

  get _routerCallbacks() {
    this.routerCallbacks = this.routerCallbacks ? this.routerCallbacks : {};
    return this.routerCallbacks;
  }

  set _routerCallbacks(routerCallbacks) {
    this.routerCallbacks = MVC.Utils.addPropertiesToObject(routerCallbacks, this._routerCallbacks);
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

  addModelEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.modelEvents, this.models, this.modelCallbacks);
  }

  removeModelEvents() {
    MVC.Utils.unbindEventsToTargetObjects(this.modelEvents, this.models, this.modelCallbacks);
  }

  addViewEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.viewEvents, this.views, this.viewCallbacks);
  }

  removeViewEvents() {
    MVC.Utils.unbindEventsToTargetObjects(this.viewEvents, this.views, this.viewCallbacks);
  }

  addControllerEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks);
  }

  removeControllerEvents() {
    MVC.Utils.unbindEventsToTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks);
  }

  enable() {
    var settings = this.settings;

    if (settings && !this.enabled) {
      if (settings.emitters) this._emitters = settings.emitters;
      if (settings.modelCallbacks) this._modelCallbacks = settings.modelCallbacks;
      if (settings.viewCallbacks) this._viewCallbacks = settings.viewCallbacks;
      if (settings.controllerCallbacks) this._controllerCallbacks = settings.controllerCallbacks;
      if (settings.routerCallbacks) this._routerCallbacks = settings.routerCallbacks;
      if (settings.models) this._models = settings.models;
      if (settings.views) this._views = settings.views;
      if (settings.controllers) this._controllers = settings.controllers;
      if (settings.routers) this._routers = settings.routers;
      if (settings.modelEvents) this._modelEvents = settings.modelEvents;
      if (settings.viewEvents) this._viewEvents = settings.viewEvents;
      if (settings.controllerEvents) this._controllerEvents = settings.controllerEvents;

      if (this.modelEvents && this.models && this.modelCallbacks) {
        this.addModelEvents();
      }

      if (this.viewEvents && this.views && this.viewCallbacks) {
        this.addViewEvents();
      }

      if (this.controllerEvents && this.controllers && this.controllerCallbacks) {
        this.addControllerEvents();
      }

      this._enabled = true;
    }
  }

  disable() {
    var settings = this.settings;

    if (settings && this.enabled) {
      if (this.modelEvents && this.models && this.modelCallbacks) {
        this.removeModelEvents();
      }

      if (this.viewEvents && this.views && this.viewCallbacks) {
        this.removeViewEvents();
      }

      if (this.controllerEvents && this.controllers && this.controllerCallbacks) {
        this.removeControllerEvents();
      }

      delete this._emitters;
      delete this._modelCallbacks;
      delete this._viewCallbacks;
      delete this._controllerCallbacks;
      delete this._routerCallbacks;
      delete this._models;
      delete this._views;
      delete this._controllers;
      delete this._routers;
      delete this._modelEvents;
      delete this._viewEvents;
      delete this._controllerEvents;
      this._enabled = false;
    }
  }

};
MVC.Router = class extends MVC.Base {
  constructor() {
    super(...arguments);
    this.addSettings();
    this.setRoutes(this.routes, this.controllers);
    this.setEvents();
    this.start();
    if (typeof this.initialize === 'function') this.initialize();
  }

  addSettings() {
    if (this._settings) {
      if (this._settings.routes) this.routes = this._settings.routes;
      if (this._settings.controllers) this.controllers = this._settings.controllers;
    }
  }

  start() {
    var location = this.getRoute();

    if (location === '') {
      this.navigate('/');
    } else {
      window.dispatchEvent(new Event('hashchange'));
    }
  }

  setRoutes(routes, controllers) {
    for (var route in routes) {
      this.routes[route] = controllers[routes[route]];
    }

    return;
  }

  setEvents() {
    window.addEventListener('hashchange', this.hashChange.bind(this));
    return;
  }

  getRoute() {
    return String(window.location.hash).split('#').pop();
  }

  hashChange(event) {
    var route = this.getRoute();

    try {
      this.routes[route](event);
      this.emit('navigate', this);
    } catch (error) {}
  }

  navigate(path) {
    window.location.hash = path;
  }

};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1WQy5qcyIsIkNvbnN0YW50cy5qcyIsIkV2ZW50cy5qcyIsIlRlbXBsYXRlcy5qcyIsIlV0aWxzLmpzIiwiaXMuanMiLCJ0eXBlT2YuanMiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QuanMiLCJvYmplY3RRdWVyeS5qcyIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMuanMiLCJ2YWxpZGF0ZURhdGFTY2hlbWEuanMiLCJDaGFubmVscy5qcyIsIkNoYW5uZWwuanMiLCJCYXNlLmpzIiwiT2JzZXJ2ZXIuanMiLCJTZXJ2aWNlLmpzIiwiTW9kZWwuanMiLCJFbWl0dGVyLmpzIiwiVmlldy5qcyIsIkNvbnRyb2xsZXIuanMiLCJSb3V0ZXIuanMiXSwibmFtZXMiOlsiTVZDIiwiQ29uc3RhbnRzIiwiQ09OU1QiLCJFdmVudHMiLCJFViIsIlRlbXBsYXRlcyIsIk9iamVjdFF1ZXJ5U3RyaW5nRm9ybWF0SW52YWxpZFJvb3QiLCJPYmplY3RRdWVyeVN0cmluZ0Zvcm1hdEludmFsaWQiLCJkYXRhIiwiam9pbiIsIkRhdGFTY2hlbWFNaXNtYXRjaCIsIkRhdGFGdW5jdGlvbkludmFsaWQiLCJEYXRhVW5kZWZpbmVkIiwiU2NoZW1hVW5kZWZpbmVkIiwiVE1QTCIsIlV0aWxzIiwiaXNBcnJheSIsIm9iamVjdCIsIkFycmF5IiwiaXNPYmplY3QiLCJpc0VxdWFsVHlwZSIsInZhbHVlQSIsInZhbHVlQiIsImlzSFRNTEVsZW1lbnQiLCJIVE1MRWxlbWVudCIsInR5cGVPZiIsIl9vYmplY3QiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QiLCJ0YXJnZXRPYmplY3QiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJwcm9wZXJ0aWVzIiwicHJvcGVydHlOYW1lIiwicHJvcGVydHlWYWx1ZSIsIk9iamVjdCIsImVudHJpZXMiLCJvYmplY3RRdWVyeSIsInN0cmluZyIsImNvbnRleHQiLCJzdHJpbmdEYXRhIiwicGFyc2VOb3RhdGlvbiIsInNwbGljZSIsInJlZHVjZSIsImZyYWdtZW50IiwiZnJhZ21lbnRJbmRleCIsImZyYWdtZW50cyIsInBhcnNlRnJhZ21lbnQiLCJwcm9wZXJ0eUtleSIsIm1hdGNoIiwiY29uY2F0IiwiY2hhckF0Iiwic2xpY2UiLCJzcGxpdCIsIlJlZ0V4cCIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMiLCJ0b2dnbGVNZXRob2QiLCJldmVudHMiLCJ0YXJnZXRPYmplY3RzIiwiY2FsbGJhY2tzIiwiZXZlbnRTZXR0aW5ncyIsImV2ZW50Q2FsbGJhY2tOYW1lIiwiZXZlbnREYXRhIiwiZXZlbnRUYXJnZXRTZXR0aW5ncyIsImV2ZW50TmFtZSIsImV2ZW50VGFyZ2V0cyIsImV2ZW50VGFyZ2V0TmFtZSIsImV2ZW50VGFyZ2V0IiwiZXZlbnRNZXRob2ROYW1lIiwiTm9kZUxpc3QiLCJldmVudENhbGxiYWNrIiwiX2V2ZW50VGFyZ2V0IiwiYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyIsInVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzIiwidmFsaWRhdGVEYXRhU2NoZW1hIiwic2NoZW1hIiwiYXJyYXkiLCJjb25zb2xlIiwibG9nIiwibmFtZSIsImFycmF5S2V5IiwiYXJyYXlWYWx1ZSIsInB1c2giLCJvYmplY3RLZXkiLCJvYmplY3RWYWx1ZSIsImNvbnN0cnVjdG9yIiwiX2V2ZW50cyIsImV2ZW50Q2FsbGJhY2tzIiwiZXZlbnRDYWxsYmFja0dyb3VwIiwib24iLCJvZmYiLCJlbWl0IiwiZXZlbnRDYWxsYmFja0dyb3VwTmFtZSIsImFkZGl0aW9uYWxBcmd1bWVudHMiLCJ2YWx1ZXMiLCJDaGFubmVscyIsIl9jaGFubmVscyIsImNoYW5uZWxzIiwiY2hhbm5lbCIsImNoYW5uZWxOYW1lIiwiQ2hhbm5lbCIsIl9yZXNwb25zZXMiLCJyZXNwb25zZXMiLCJyZXNwb25zZSIsInJlc3BvbnNlTmFtZSIsInJlc3BvbnNlQ2FsbGJhY2siLCJyZXF1ZXN0IiwicmVxdWVzdERhdGEiLCJrZXlzIiwiQmFzZSIsInNldHRpbmdzIiwib3B0aW9ucyIsImNvbmZpZ3VyYXRpb24iLCJfY29uZmlndXJhdGlvbiIsIl9vcHRpb25zIiwiX3NldHRpbmdzIiwiT2JzZXJ2ZXIiLCJlbmFibGUiLCJfY29ubmVjdGVkIiwiY29ubmVjdGVkIiwib2JzZXJ2ZXIiLCJfb2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwib2JzZXJ2ZXJDYWxsYmFjayIsImJpbmQiLCJfdGFyZ2V0IiwidGFyZ2V0IiwiX211dGF0aW9ucyIsIm11dGF0aW9ucyIsIm11dGF0aW9uU2V0dGluZ3MiLCJtdXRhdGlvbkNhbGxiYWNrIiwibXV0YXRpb24iLCJtdXRhdGlvbkRhdGEiLCJtdXRhdGlvblRhcmdldCIsInRhcmdldHMiLCJtdXRhdGlvbkV2ZW50TmFtZSIsImNhbGxiYWNrIiwiZW5hYmxlZCIsIl9lbmFibGVkIiwiZGlzYWJsZSIsIm9ic2VydmVlciIsIm11dGF0aW9uUmVjb3JkTGlzdCIsIm11dGF0aW9uUmVjb3JkSW5kZXgiLCJtdXRhdGlvblJlY29yZCIsInR5cGUiLCJtdXRhdGlvblJlY29yZENhdGVnb3JpZXMiLCJtdXRhdGlvblJlY29yZENhdGVnb3J5Iiwibm9kZUluZGV4Iiwibm9kZSIsImZvckVhY2giLCJfbXV0YXRpb24iLCJfbXV0YXRpb25UYXJnZXQiLCJmaWx0ZXIiLCJhdHRyaWJ1dGVOYW1lIiwiY29ubmVjdCIsIm9ic2VydmUiLCJkaXNjb25uZWN0IiwiU2VydmljZSIsIl9kZWZhdWx0cyIsImRlZmF1bHRzIiwiY29udGVudFR5cGUiLCJyZXNwb25zZVR5cGUiLCJfcmVzcG9uc2VUeXBlcyIsIl9yZXNwb25zZVR5cGUiLCJfeGhyIiwiZmluZCIsInJlc3BvbnNlVHlwZUl0ZW0iLCJfdHlwZSIsIl91cmwiLCJ1cmwiLCJfaGVhZGVycyIsImhlYWRlcnMiLCJoZWFkZXIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJuZXdYSFIiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInN0YXR1cyIsImFib3J0Iiwib3BlbiIsIm9ubG9hZCIsIm9uZXJyb3IiLCJzZW5kIiwiX2RhdGEiLCJNb2RlbCIsIl9pc1NldHRpbmciLCJpc1NldHRpbmciLCJzZXQiLCJfc2NoZW1hIiwiX2hpc3Rpb2dyYW0iLCJoaXN0aW9ncmFtIiwiYXNzaWduIiwiX2hpc3RvcnkiLCJoaXN0b3J5IiwidW5zaGlmdCIsInBhcnNlIiwiX2RhdGFFdmVudHMiLCJkYXRhRXZlbnRzIiwiX2RhdGFDYWxsYmFja3MiLCJkYXRhQ2FsbGJhY2tzIiwiYWRkRGF0YUV2ZW50cyIsImdldCIsInByb3BlcnR5IiwiX2FyZ3VtZW50cyIsImluZGV4Iiwia2V5IiwidmFsdWUiLCJzZXREYXRhUHJvcGVydHkiLCJzaWxlbnQiLCJ1bnNldCIsInVuc2V0RGF0YVByb3BlcnR5IiwiZGVmaW5lUHJvcGVydGllcyIsImNvbmZpZ3VyYWJsZSIsInNldFZhbHVlRXZlbnROYW1lIiwic2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZUV2ZW50TmFtZSIsInVuc2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJyZW1vdmVEYXRhRXZlbnRzIiwiRW1pdHRlciIsIl9uYW1lIiwiZW1pc3Npb24iLCJWaWV3IiwiX2VsZW1lbnROYW1lIiwiX2VsZW1lbnQiLCJ0YWdOYW1lIiwiZWxlbWVudE5hbWUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJlbGVtZW50IiwicXVlcnlTZWxlY3RvciIsImVsZW1lbnRPYnNlcnZlciIsInN1YnRyZWUiLCJjaGlsZExpc3QiLCJfYXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVLZXkiLCJhdHRyaWJ1dGVWYWx1ZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsIl91aSIsInVpIiwidWlLZXkiLCJ1aVZhbHVlIiwicXVlcnlTZWxlY3RvckFsbCIsIl91aUV2ZW50cyIsInVpRXZlbnRzIiwiX3VpQ2FsbGJhY2tzIiwidWlDYWxsYmFja3MiLCJfb2JzZXJ2ZXJDYWxsYmFja3MiLCJvYnNlcnZlckNhbGxiYWNrcyIsIl91aUVtaXR0ZXJzIiwidWlFbWl0dGVycyIsIlVJRW1pdHRlciIsInVpRW1pdHRlciIsIl9vYnNlcnZlcnMiLCJvYnNlcnZlcnMiLCJvYnNlcnZlckNvbmZpZ3VyYXRpb24iLCJvYnNlcnZlckNvbmZpZ3VyYXRpb25EYXRhIiwib2JzZXJ2ZXJOYW1lIiwib2JzZXJ2ZXJUYXJnZXQiLCJvYnNlcnZlck9wdGlvbnMiLCJfb2JzZXJ2ZXJPcHRpb25zIiwiY3VycmVudFZhbHVlIiwib2JzZXJ2ZXJTZXR0aW5ncyIsIl9lbGVtZW50T2JzZXJ2ZXIiLCJlbGVtZW50T2JzZXJ2ZSIsInJlbW92ZU9ic2VydmVycyIsInJlbW92ZVVJIiwiYWRkVUkiLCJhZGRPYnNlcnZlcnMiLCJfaW5zZXJ0IiwiaW5zZXJ0IiwiX3RlbXBsYXRlcyIsInRlbXBsYXRlcyIsInRlbXBsYXRlTmFtZSIsInRlbXBsYXRlU2V0dGluZ3MiLCJhdXRvSW5zZXJ0IiwibWV0aG9kIiwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50IiwiYXV0b1JlbW92ZSIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImFkZEVsZW1lbnQiLCJyZW1vdmVFbGVtZW50IiwiYWRkVUlFdmVudHMiLCJyZW1vdmVVSUV2ZW50cyIsImNvbm5lY3RPYnNlcnZlcnMiLCJkaXNjb25uZWN0T2JzZXJ2ZXJzIiwiQ29udHJvbGxlciIsIl9lbWl0dGVycyIsImVtaXR0ZXJzIiwiX21vZGVsQ2FsbGJhY2tzIiwibW9kZWxDYWxsYmFja3MiLCJfdmlld0NhbGxiYWNrcyIsInZpZXdDYWxsYmFja3MiLCJfY29udHJvbGxlckNhbGxiYWNrcyIsImNvbnRyb2xsZXJDYWxsYmFja3MiLCJfcm91dGVyQ2FsbGJhY2tzIiwicm91dGVyQ2FsbGJhY2tzIiwiX21vZGVscyIsIm1vZGVscyIsIl92aWV3cyIsInZpZXdzIiwiX2NvbnRyb2xsZXJzIiwiY29udHJvbGxlcnMiLCJfcm91dGVycyIsInJvdXRlcnMiLCJfbW9kZWxFdmVudHMiLCJtb2RlbEV2ZW50cyIsIl92aWV3RXZlbnRzIiwidmlld0V2ZW50cyIsIl9jb250cm9sbGVyRXZlbnRzIiwiY29udHJvbGxlckV2ZW50cyIsImFkZE1vZGVsRXZlbnRzIiwicmVtb3ZlTW9kZWxFdmVudHMiLCJ1bmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMiLCJhZGRWaWV3RXZlbnRzIiwicmVtb3ZlVmlld0V2ZW50cyIsImFkZENvbnRyb2xsZXJFdmVudHMiLCJyZW1vdmVDb250cm9sbGVyRXZlbnRzIiwiUm91dGVyIiwiYWRkU2V0dGluZ3MiLCJzZXRSb3V0ZXMiLCJyb3V0ZXMiLCJzZXRFdmVudHMiLCJzdGFydCIsImluaXRpYWxpemUiLCJsb2NhdGlvbiIsImdldFJvdXRlIiwibmF2aWdhdGUiLCJ3aW5kb3ciLCJkaXNwYXRjaEV2ZW50IiwiRXZlbnQiLCJyb3V0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJoYXNoQ2hhbmdlIiwiU3RyaW5nIiwiaGFzaCIsInBvcCIsImV2ZW50IiwiZXJyb3IiLCJwYXRoIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxHQUFHLEdBQUdBLEdBQUcsSUFBSSxFQUFqQjtBQ0FBQSxHQUFHLENBQUNDLFNBQUosR0FBZ0IsRUFBaEI7QUFDQUQsR0FBRyxDQUFDRSxLQUFKLEdBQVlGLEdBQUcsQ0FBQ0MsU0FBaEI7QUNEQUQsR0FBRyxDQUFDQyxTQUFKLENBQWNFLE1BQWQsR0FBdUIsRUFBdkI7QUFDQUgsR0FBRyxDQUFDRSxLQUFKLENBQVVFLEVBQVYsR0FBZUosR0FBRyxDQUFDQyxTQUFKLENBQWNFLE1BQTdCO0FDREFILEdBQUcsQ0FBQ0ssU0FBSixHQUFnQjtBQUNkQyxFQUFBQSxrQ0FBa0MsRUFBRSxTQUFTQyw4QkFBVCxDQUF3Q0MsSUFBeEMsRUFBOEM7QUFDaEYsV0FBTyxDQUNMLDBFQURLLEVBRUxDLElBRkssQ0FFQSxJQUZBLENBQVA7QUFHRCxHQUxhO0FBTWRDLEVBQUFBLGtCQUFrQixFQUFFLFNBQVNBLGtCQUFULENBQTRCRixJQUE1QixFQUFrQztBQUNwRCxXQUFPLDZDQUVMQyxJQUZLLENB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QVMsR0FBRztBQUNWTSxJQUFBQSxNQUFNLENBQUNJLGdCQUFQLENBQXdCLFlBQXhCLEVBQXNDLEtBQUtDLFVBQUwsQ0FBZ0J6TixJQUFoQixDQUFxQixJQUFyQixDQUF0QztBQUNBO0FBQ0Q7O0FBQ0RrTixFQUFBQSxRQUFRLEdBQUc7QUFDVCxXQUFPUSxNQUFNLENBQUNOLE1BQU0sQ0FBQ0gsUUFBUCxDQUFnQlUsSUFBakIsQ0FBTixDQUE2QmxTLEtBQTdCLENBQW1DLEdBQW5DLEVBQXdDbVMsR0FBeEMsRUFBUDtBQUNEOztBQUNESCxFQUFBQSxVQUFVLENBQUNJLEtBQUQsRUFBUTtBQUNoQixRQUFJTixLQUFLLEdBQUcsS0FBS0wsUUFBTCxFQUFaOztBQUNBLFFBQUk7QUFDRixXQUFLTCxNQUFMLENBQVlVLEtBQVosRUFBbUJNLEtBQW5CO0FBQ0EsV0FBSzlQLElBQUwsQ0FBVSxVQUFWLEVBQXNCLElBQXRCO0FBQ0QsS0FIRCxDQUdFLE9BQU0rUCxLQUFOLEVBQWEsQ0FBRTtBQUNsQjs7QUFDRFgsRUFBQUEsUUFBUSxDQUFDWSxJQUFELEVBQU87QUFDYlgsSUFBQUEsTUFBTSxDQUFDSCxRQUFQLENBQWdCVSxJQUFoQixHQUF1QkksSUFBdkI7QUFDRDs7QUE3Q2lDLENBQXBDIiwiZmlsZSI6ImJyb3dzZXIvbXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBNVkMgPSBNVkMgfHwge31cclxuIiwiTVZDLkNvbnN0YW50cyA9IHt9XG5NVkMuQ09OU1QgPSBNVkMuQ29uc3RhbnRzXG4iLCJNVkMuRXZlbnRzID0gY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2V2ZW50cygpIHtcclxuICAgIHRoaXMuZXZlbnRzID0gKHRoaXMuZXZlbnRzKVxyXG4gICAgICA/IHRoaXMuZXZlbnRzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmV2ZW50c1xyXG4gIH1cclxuICBldmVudENhbGxiYWNrcyhldmVudE5hbWUpIHsgcmV0dXJuIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdIHx8IHt9IH1cclxuICBldmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gKGV2ZW50Q2FsbGJhY2submFtZS5sZW5ndGgpXHJcbiAgICAgID8gZXZlbnRDYWxsYmFjay5uYW1lXHJcbiAgICAgIDogJ2Fub255bW91c0Z1bmN0aW9uJ1xyXG4gIH1cclxuICBldmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKSB7XHJcbiAgICByZXR1cm4gZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdIHx8IFtdXHJcbiAgfVxyXG4gIG9uKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaykge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5ldmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja05hbWUgPSB0aGlzLmV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja0dyb3VwID0gdGhpcy5ldmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKVxyXG4gICAgZXZlbnRDYWxsYmFja0dyb3VwLnB1c2goZXZlbnRDYWxsYmFjaylcclxuICAgIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudENhbGxiYWNrc1xyXG4gIH1cclxuICBvZmYoKSB7XHJcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2sgPSBhcmd1bWVudHNbMV1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFja05hbWUgPSB0aGlzLmV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdW2V2ZW50Q2FsbGJhY2tOYW1lXVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfVxyXG4gIGVtaXQoZXZlbnROYW1lLCBldmVudERhdGEpIHtcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IHRoaXMuZXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgZm9yKGxldCBbZXZlbnRDYWxsYmFja0dyb3VwTmFtZSwgZXZlbnRDYWxsYmFja0dyb3VwXSBvZiBPYmplY3QuZW50cmllcyhldmVudENhbGxiYWNrcykpIHtcclxuICAgICAgZm9yKGxldCBldmVudENhbGxiYWNrIG9mIGV2ZW50Q2FsbGJhY2tHcm91cCkge1xyXG4gICAgICAgIGxldCBhZGRpdGlvbmFsQXJndW1lbnRzID0gT2JqZWN0LnZhbHVlcyhhcmd1bWVudHMpLnNwbGljZSgyKVxyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2soZXZlbnREYXRhLCAuLi5hZGRpdGlvbmFsQXJndW1lbnRzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIk1WQy5UZW1wbGF0ZXMgPSB7XHJcbiAgT2JqZWN0UXVlcnlTdHJpbmdGb3JtYXRJbnZhbGlkUm9vdDogZnVuY3Rpb24gT2JqZWN0UXVlcnlTdHJpbmdGb3JtYXRJbnZhbGlkKGRhdGEpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgICdPYmplY3QgUXVlcnkgXCJzdHJpbmdcIiBwcm9wZXJ0eSBtdXN0IGJlIGZvcm1hdHRlZCB0byBmaXJzdCBpbmNsdWRlIFwiW0BdXCIuJ1xyXG4gICAgXS5qb2luKCdcXG4nKVxyXG4gIH0sXHJcbiAgRGF0YVNjaGVtYU1pc21hdGNoOiBmdW5jdGlvbiBEYXRhU2NoZW1hTWlzbWF0Y2goZGF0YSkge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgYERhdGEgYW5kIFNjaGVtYSBwcm9wZXJ0aWVzIGRvIG5vdCBtYXRjaC5gXHJcbiAgICBdLmpvaW4oJ1xcbicpXHJcbiAgfSxcclxuICBEYXRhRnVuY3Rpb25JbnZhbGlkOiBmdW5jdGlvbiBEYXRhRnVuY3Rpb25JbnZhbGlkKGRhdGEpIHtcclxuICAgIFtcclxuICAgICAgYE1vZGVsIERhdGEgcHJvcGVydHkgdHlwZSBcIkZ1bmN0aW9uXCIgaXMgbm90IHZhbGlkLmBcclxuICAgIF0uam9pbignXFxuJylcclxuICB9LFxyXG4gIERhdGFVbmRlZmluZWQ6IGZ1bmN0aW9uIERhdGFVbmRlZmluZWQoZGF0YSkge1xyXG4gICAgW1xyXG4gICAgICBgTW9kZWwgRGF0YSBwcm9wZXJ0eSB1bmRlZmluZWQuYFxyXG4gICAgXS5qb2luKCdcXG4nKVxyXG4gIH0sXHJcbiAgU2NoZW1hVW5kZWZpbmVkOiBmdW5jdGlvbiBTY2hlbWFVbmRlZmluZWQoZGF0YSkge1xyXG4gICAgW1xyXG4gICAgICBgTW9kZWwgXCJTY2hlbWFcIiB1bmRlZmluZWQuYFxyXG4gICAgXS5qb2luKCdcXG4nKVxyXG4gIH0sXHJcbn1cclxuTVZDLlRNUEwgPSBNVkMuVGVtcGxhdGVzXHJcbiIsIk1WQy5VdGlscyA9IHt9XHJcbiIsIk1WQy5VdGlscy5pc0FycmF5ID0gZnVuY3Rpb24gaXNBcnJheShvYmplY3QpIHsgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqZWN0KSB9XHJcbk1WQy5VdGlscy5pc09iamVjdCA9IGZ1bmN0aW9uIGlzT2JqZWN0KG9iamVjdCkge1xyXG4gIHJldHVybiAoIUFycmF5LmlzQXJyYXkob2JqZWN0KSlcclxuICAgID8gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCdcclxuICAgIDogZmFsc2VcclxufVxyXG5NVkMuVXRpbHMuaXNFcXVhbFR5cGUgPSBmdW5jdGlvbiBpc0VxdWFsVHlwZSh2YWx1ZUEsIHZhbHVlQikgeyByZXR1cm4gdmFsdWVBID09PSB2YWx1ZUIgfVxyXG5NVkMuVXRpbHMuaXNIVE1MRWxlbWVudCA9IGZ1bmN0aW9uIGlzSFRNTEVsZW1lbnQob2JqZWN0KSB7XHJcbiAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XHJcbn1cclxuIiwiTVZDLlV0aWxzLnR5cGVPZiA9ICBmdW5jdGlvbiB0eXBlT2YoZGF0YSkge1xyXG4gIHN3aXRjaCh0eXBlb2YgZGF0YSkge1xyXG4gICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgbGV0IF9vYmplY3RcclxuICAgICAgaWYoTVZDLlV0aWxzLmlzQXJyYXkoZGF0YSkpIHtcclxuICAgICAgICAvLyBBcnJheVxyXG4gICAgICAgIHJldHVybiAnYXJyYXknXHJcbiAgICAgIH0gZWxzZSBpZihcclxuICAgICAgICBNVkMuVXRpbHMuaXNPYmplY3QoZGF0YSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgLy8gT2JqZWN0XHJcbiAgICAgICAgcmV0dXJuICdvYmplY3QnXHJcbiAgICAgIH0gZWxzZSBpZihcclxuICAgICAgICBkYXRhID09PSBudWxsXHJcbiAgICAgICkge1xyXG4gICAgICAgIC8vIE51bGxcclxuICAgICAgICByZXR1cm4gJ251bGwnXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIF9vYmplY3RcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICBjYXNlICdudW1iZXInOlxyXG4gICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICBjYXNlICd1bmRlZmluZWQnOlxyXG4gICAgY2FzZSAnZnVuY3Rpb24nOlxyXG4gICAgICByZXR1cm4gdHlwZW9mIGRhdGFcclxuICAgICAgYnJlYWtcclxuICB9XHJcbn1cclxuIiwiTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdCA9IGZ1bmN0aW9uIGFkZFByb3BlcnRpZXNUb09iamVjdCgpIHtcclxuICBsZXQgdGFyZ2V0T2JqZWN0XHJcbiAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgIGNhc2UgMjpcclxuICAgICAgbGV0IHByb3BlcnRpZXMgPSBhcmd1bWVudHNbMF1cclxuICAgICAgdGFyZ2V0T2JqZWN0ID0gYXJndW1lbnRzWzFdXHJcbiAgICAgIGZvcihsZXQgW3Byb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocHJvcGVydGllcykpIHtcclxuICAgICAgICB0YXJnZXRPYmplY3RbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5VmFsdWVcclxuICAgICAgfVxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAzOlxyXG4gICAgICBsZXQgcHJvcGVydHlOYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgIGxldCBwcm9wZXJ0eVZhbHVlID0gYXJndW1lbnRzWzFdXHJcbiAgICAgIHRhcmdldE9iamVjdCA9IGFyZ3VtZW50c1syXVxyXG4gICAgICB0YXJnZXRPYmplY3RbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5VmFsdWVcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgcmV0dXJuIHRhcmdldE9iamVjdFxyXG59XHJcbiIsIk1WQy5VdGlscy5vYmplY3RRdWVyeSA9IGZ1bmN0aW9uIG9iamVjdFF1ZXJ5KFxyXG4gIHN0cmluZyxcclxuICBjb250ZXh0XHJcbikge1xyXG4gIGxldCBzdHJpbmdEYXRhID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlTm90YXRpb24oc3RyaW5nKVxyXG4gIGlmKHN0cmluZ0RhdGFbMF0gPT09ICdAJykgc3RyaW5nRGF0YS5zcGxpY2UoMCwgMSlcclxuICBpZighc3RyaW5nRGF0YS5sZW5ndGgpIHJldHVybiBjb250ZXh0XHJcbiAgY29udGV4dCA9IChNVkMuVXRpbHMuaXNPYmplY3QoY29udGV4dCkpXHJcbiAgICA/IE9iamVjdC5lbnRyaWVzKGNvbnRleHQpXHJcbiAgICA6IGNvbnRleHRcclxuICByZXR1cm4gc3RyaW5nRGF0YS5yZWR1Y2UoKG9iamVjdCwgZnJhZ21lbnQsIGZyYWdtZW50SW5kZXgsIGZyYWdtZW50cykgPT4ge1xyXG4gICAgbGV0IHByb3BlcnRpZXMgPSBbXVxyXG4gICAgZnJhZ21lbnQgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VGcmFnbWVudChmcmFnbWVudClcclxuICAgIGZvcihsZXQgW3Byb3BlcnR5S2V5LCBwcm9wZXJ0eVZhbHVlXSBvZiBvYmplY3QpIHtcclxuICAgICAgaWYocHJvcGVydHlLZXkubWF0Y2goZnJhZ21lbnQpKSB7XHJcbiAgICAgICAgaWYoZnJhZ21lbnRJbmRleCA9PT0gZnJhZ21lbnRzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzLmNvbmNhdChbW3Byb3BlcnR5S2V5LCBwcm9wZXJ0eVZhbHVlXV0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzLmNvbmNhdChPYmplY3QuZW50cmllcyhwcm9wZXJ0eVZhbHVlKSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIG9iamVjdCA9IHByb3BlcnRpZXNcclxuICAgIHJldHVybiBvYmplY3RcclxuICB9LCBjb250ZXh0KVxyXG59XHJcbk1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZU5vdGF0aW9uID0gZnVuY3Rpb24gcGFyc2VOb3RhdGlvbihzdHJpbmcpIHtcclxuICBpZihcclxuICAgIHN0cmluZy5jaGFyQXQoMCkgPT09ICdbJyAmJlxyXG4gICAgc3RyaW5nLmNoYXJBdChzdHJpbmcubGVuZ3RoIC0gMSkgPT0gJ10nXHJcbiAgKSB7XHJcbiAgICBzdHJpbmcgPSBzdHJpbmdcclxuICAgICAgLnNsaWNlKDEsIC0xKVxyXG4gICAgICAuc3BsaXQoJ11bJylcclxuICB9IGVsc2Uge1xyXG4gICAgc3RyaW5nID0gc3RyaW5nXHJcbiAgICAgIC5zcGxpdCgnLicpXHJcbiAgfVxyXG4gIHJldHVybiBzdHJpbmdcclxufVxyXG5NVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VGcmFnbWVudCA9IGZ1bmN0aW9uIHBhcnNlRnJhZ21lbnQoZnJhZ21lbnQpIHtcclxuICBpZihcclxuICAgIGZyYWdtZW50LmNoYXJBdCgwKSA9PT0gJy8nICYmXHJcbiAgICBmcmFnbWVudC5jaGFyQXQoZnJhZ21lbnQubGVuZ3RoIC0gMSkgPT0gJy8nXHJcbiAgKSB7XHJcbiAgICBmcmFnbWVudCA9IGZyYWdtZW50LnNsaWNlKDEsIC0xKVxyXG4gICAgZnJhZ21lbnQgPSBuZXcgUmVnRXhwKGZyYWdtZW50KVxyXG4gIH1cclxuICByZXR1cm4gZnJhZ21lbnRcclxufVxyXG4iLCJNVkMuVXRpbHMudG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIHRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoXHJcbiAgdG9nZ2xlTWV0aG9kLFxyXG4gIGV2ZW50cyxcclxuICB0YXJnZXRPYmplY3RzLFxyXG4gIGNhbGxiYWNrc1xyXG4pIHtcclxuICBmb3IobGV0IFtldmVudFNldHRpbmdzLCBldmVudENhbGxiYWNrTmFtZV0gb2YgT2JqZWN0LmVudHJpZXMoZXZlbnRzKSkge1xyXG4gICAgbGV0IGV2ZW50RGF0YSA9IGV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxyXG4gICAgbGV0IGV2ZW50VGFyZ2V0U2V0dGluZ3MgPSBldmVudERhdGFbMF1cclxuICAgIGxldCBldmVudE5hbWUgPSBldmVudERhdGFbMV1cclxuICAgIGxldCBldmVudFRhcmdldHMgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkoXHJcbiAgICAgIGV2ZW50VGFyZ2V0U2V0dGluZ3MsXHJcbiAgICAgIHRhcmdldE9iamVjdHNcclxuICAgIClcclxuICAgIGZvcihsZXQgW2V2ZW50VGFyZ2V0TmFtZSwgZXZlbnRUYXJnZXRdIG9mIGV2ZW50VGFyZ2V0cykge1xyXG4gICAgICBsZXQgZXZlbnRNZXRob2ROYW1lID0gKHRvZ2dsZU1ldGhvZCA9PT0gJ29uJylcclxuICAgICAgPyAoXHJcbiAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCB8fFxyXG4gICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcclxuICAgICAgKSA/ICdhZGRFdmVudExpc3RlbmVyJ1xyXG4gICAgICAgIDogJ29uJ1xyXG4gICAgICA6IChcclxuICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0IHx8XHJcbiAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxyXG4gICAgICApID8gJ3JlbW92ZUV2ZW50TGlzdGVuZXInXHJcbiAgICAgICAgOiAnb2ZmJ1xyXG4gICAgICBsZXQgZXZlbnRDYWxsYmFjayA9IE1WQy5VdGlscy5vYmplY3RRdWVyeShcclxuICAgICAgICBldmVudENhbGxiYWNrTmFtZSxcclxuICAgICAgICBjYWxsYmFja3NcclxuICAgICAgKVswXVsxXVxyXG4gICAgICBpZihldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XHJcbiAgICAgICAgZm9yKGxldCBfZXZlbnRUYXJnZXQgb2YgZXZlbnRUYXJnZXQpIHtcclxuICAgICAgICAgIF9ldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZihldmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KXtcclxuICAgICAgICBldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5NVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIGJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMoKSB7XHJcbiAgdGhpcy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKCdvbicsIC4uLmFyZ3VtZW50cylcclxufVxyXG5NVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMgPSBmdW5jdGlvbiB1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cygpIHtcclxuICB0aGlzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoJ29mZicsIC4uLmFyZ3VtZW50cylcclxufVxyXG4iLCJNVkMuVXRpbHMudmFsaWRhdGVEYXRhU2NoZW1hID0gZnVuY3Rpb24gdmFsaWRhdGVEYXRhU2NoZW1hKGRhdGEsIHNjaGVtYSkge1xyXG4gIGlmKHNjaGVtYSkge1xyXG4gICAgc3dpdGNoKE1WQy5VdGlscy50eXBlT2YoZGF0YSkpIHtcclxuICAgICAgY2FzZSAnYXJyYXknOlxyXG4gICAgICAgIGxldCBhcnJheSA9IFtdXHJcbiAgICAgICAgc2NoZW1hID0gKE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgID8gc2NoZW1hKClcclxuICAgICAgICAgIDogc2NoZW1hXHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBNVkMuVXRpbHMuaXNFcXVhbFR5cGUoXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSxcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihhcnJheSlcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHNjaGVtYS5uYW1lKVxyXG4gICAgICAgICAgZm9yKGxldCBbYXJyYXlLZXksIGFycmF5VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2goXHJcbiAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZURhdGFTY2hlbWEoYXJyYXlWYWx1ZSlcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyYXlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICAgIGxldCBvYmplY3QgPSB7fVxyXG4gICAgICAgIHNjaGVtYSA9IChNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSkgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICA/IHNjaGVtYSgpXHJcbiAgICAgICAgICA6IHNjaGVtYVxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgTVZDLlV0aWxzLmlzRXF1YWxUeXBlKFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSksXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yob2JqZWN0KVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coc2NoZW1hLm5hbWUpXHJcbiAgICAgICAgICBmb3IobGV0IFtvYmplY3RLZXksIG9iamVjdFZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xyXG4gICAgICAgICAgICBvYmplY3Rbb2JqZWN0S2V5XSA9IHRoaXMudmFsaWRhdGVEYXRhU2NoZW1hKG9iamVjdFZhbHVlLCBzY2hlbWFbb2JqZWN0S2V5XSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgICAgIHNjaGVtYSA9IChNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSkgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICA/IHNjaGVtYSgpXHJcbiAgICAgICAgICA6IHNjaGVtYVxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgTVZDLlV0aWxzLmlzRXF1YWxUeXBlKFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSksXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2YoZGF0YSlcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHNjaGVtYS5uYW1lKVxyXG4gICAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhyb3cgTVZDLlRNUExcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnbnVsbCc6XHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBNVkMuVXRpbHMuaXNFcXVhbFR5cGUoXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSxcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihkYXRhKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgICAgICB0aHJvdyBNVkMuVE1QTFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgICB0aHJvdyBNVkMuVE1QTFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IE1WQy5UTVBMXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5DaGFubmVscyA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9jaGFubmVscygpIHtcclxuICAgIHRoaXMuY2hhbm5lbHMgPSAodGhpcy5jaGFubmVscylcclxuICAgICAgPyB0aGlzLmNoYW5uZWxzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmNoYW5uZWxzXHJcbiAgfVxyXG4gIGNoYW5uZWwoY2hhbm5lbE5hbWUpIHtcclxuICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXSA9ICh0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0pXHJcbiAgICAgID8gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgIDogbmV3IE1WQy5DaGFubmVscy5DaGFubmVsKClcclxuICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbiAgb2ZmKGNoYW5uZWxOYW1lKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5DaGFubmVscy5DaGFubmVsID0gY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX3Jlc3BvbnNlcygpIHtcclxuICAgIHRoaXMucmVzcG9uc2VzID0gKHRoaXMucmVzcG9uc2VzKVxyXG4gICAgICA/IHRoaXMucmVzcG9uc2VzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLnJlc3BvbnNlc1xyXG4gIH1cclxuICByZXNwb25zZShyZXNwb25zZU5hbWUsIHJlc3BvbnNlQ2FsbGJhY2spIHtcclxuICAgIGlmKHJlc3BvbnNlQ2FsbGJhY2spIHtcclxuICAgICAgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0gPSByZXNwb25zZUNhbGxiYWNrXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlXVxyXG4gICAgfVxyXG4gIH1cclxuICByZXF1ZXN0KHJlc3BvbnNlTmFtZSwgcmVxdWVzdERhdGEpIHtcclxuICAgIGlmKHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXShyZXF1ZXN0RGF0YSlcclxuICAgIH1cclxuICB9XHJcbiAgb2ZmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yKGxldCBbcmVzcG9uc2VOYW1lXSBvZiBPYmplY3Qua2V5cyh0aGlzLl9yZXNwb25zZXMpKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiTVZDLkJhc2UgPSBjbGFzcyBleHRlbmRzIE1WQy5FdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzLCBvcHRpb25zLCBjb25maWd1cmF0aW9uKSB7XHJcbiAgICBzdXBlcigpXHJcbiAgICBpZihjb25maWd1cmF0aW9uKSB0aGlzLl9jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvblxyXG4gICAgaWYob3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnNcclxuICAgIGlmKHNldHRpbmdzKSB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgfVxyXG4gIGdldCBfY29uZmlndXJhdGlvbigpIHtcclxuICAgIHRoaXMuY29uZmlndXJhdGlvbiA9ICh0aGlzLmNvbmZpZ3VyYXRpb24pXHJcbiAgICAgID8gdGhpcy5jb25maWd1cmF0aW9uXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25cclxuICB9XHJcbiAgc2V0IF9jb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHsgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbiB9XHJcbiAgZ2V0IF9vcHRpb25zKCkge1xyXG4gICAgdGhpcy5vcHRpb25zID0gKHRoaXMub3B0aW9ucylcclxuICAgICAgPyB0aGlzLm9wdGlvbnNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9uc1xyXG4gIH1cclxuICBzZXQgX29wdGlvbnMob3B0aW9ucykgeyB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIH1cclxuICBnZXQgX3NldHRpbmdzKCkge1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9ICh0aGlzLnNldHRpbmdzKVxyXG4gICAgICA/IHRoaXMuc2V0dGluZ3NcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3NcclxuICB9XHJcbiAgc2V0IF9zZXR0aW5ncyhzZXR0aW5ncykgeyB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3MgfVxyXG59XHJcbiIsIk1WQy5PYnNlcnZlciA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxyXG4gICAgdGhpcy5lbmFibGUoKVxyXG4gIH1cclxuICBnZXQgX2Nvbm5lY3RlZCgpIHsgcmV0dXJuIHRoaXMuY29ubmVjdGVkIHx8IGZhbHNlIH1cclxuICBzZXQgX2Nvbm5lY3RlZChjb25uZWN0ZWQpIHsgdGhpcy5jb25uZWN0ZWQgPSBjb25uZWN0ZWQgfVxyXG4gIGdldCBvYnNlcnZlcigpIHtcclxuICAgIHRoaXMuX29ic2VydmVyID0gKHRoaXMuX29ic2VydmVyKVxyXG4gICAgICA/IHRoaXMuX29ic2VydmVyXHJcbiAgICAgIDogbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5vYnNlcnZlckNhbGxiYWNrLmJpbmQodGhpcykpXHJcbiAgICByZXR1cm4gdGhpcy5fb2JzZXJ2ZXJcclxuICB9XHJcbiAgZ2V0IF90YXJnZXQoKSB7IHJldHVybiB0aGlzLnRhcmdldCB9XHJcbiAgc2V0IF90YXJnZXQodGFyZ2V0KSB7IHRoaXMudGFyZ2V0ID0gdGFyZ2V0IH1cclxuICBnZXQgX29wdGlvbnMoKSB7IHJldHVybiB0aGlzLm9wdGlvbnMgfVxyXG4gIHNldCBfb3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXHJcbiAgfVxyXG4gIGdldCBfbXV0YXRpb25zKCkge1xyXG4gICAgdGhpcy5tdXRhdGlvbnMgPSAodGhpcy5tdXRhdGlvbnMpXHJcbiAgICAgID8gdGhpcy5tdXRhdGlvbnNcclxuICAgICAgOiBbXVxyXG4gICAgcmV0dXJuIHRoaXMubXV0YXRpb25zXHJcbiAgfVxyXG4gIHNldCBfbXV0YXRpb25zKG11dGF0aW9ucykge1xyXG4gICAgZm9yKGxldCBbbXV0YXRpb25TZXR0aW5ncywgbXV0YXRpb25DYWxsYmFja10gb2YgT2JqZWN0LmVudHJpZXMobXV0YXRpb25zLnNldHRpbmdzKSkge1xyXG4gICAgICBsZXQgbXV0YXRpb25cclxuICAgICAgbGV0IG11dGF0aW9uRGF0YSA9IG11dGF0aW9uU2V0dGluZ3Muc3BsaXQoJyAnKVxyXG4gICAgICBsZXQgbXV0YXRpb25UYXJnZXQgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkobXV0YXRpb25EYXRhWzBdLCBtdXRhdGlvbnMudGFyZ2V0cylbMF1bMV1cclxuICAgICAgbGV0IG11dGF0aW9uRXZlbnROYW1lID0gbXV0YXRpb25EYXRhWzFdXHJcbiAgICAgIG11dGF0aW9uQ2FsbGJhY2sgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkobXV0YXRpb25DYWxsYmFjaywgbXV0YXRpb25zLmNhbGxiYWNrcylbMF1bMV1cclxuICAgICAgbXV0YXRpb24gPSB7XHJcbiAgICAgICAgdGFyZ2V0OiBtdXRhdGlvblRhcmdldCxcclxuICAgICAgICBuYW1lOiBtdXRhdGlvbkV2ZW50TmFtZSxcclxuICAgICAgICBjYWxsYmFjazogbXV0YXRpb25DYWxsYmFjayxcclxuICAgICAgfVxyXG4gICAgICB0aGlzLl9tdXRhdGlvbnMucHVzaChtdXRhdGlvbilcclxuICAgIH1cclxuICB9XHJcbiAgZW5hYmxlKCkge1xyXG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xyXG4gICAgaWYoXHJcbiAgICAgIHNldHRpbmdzICYmXHJcbiAgICAgICF0aGlzLmVuYWJsZWRcclxuICAgICkge1xyXG4gICAgICBpZihzZXR0aW5ncy50YXJnZXQpIHRoaXMuX3RhcmdldCA9IChzZXR0aW5ncy50YXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdClcclxuICAgICAgICA/IHNldHRpbmdzLnRhcmdldFswXVxyXG4gICAgICAgIDogc2V0dGluZ3MudGFyZ2V0XHJcbiAgICAgIGlmKHNldHRpbmdzLm9wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSBzZXR0aW5ncy5vcHRpb25zXHJcbiAgICAgIGlmKHNldHRpbmdzLm11dGF0aW9ucykgdGhpcy5fbXV0YXRpb25zID0gc2V0dGluZ3MubXV0YXRpb25zXHJcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXHJcbiAgICB9XHJcbiAgfVxyXG4gIGRpc2FibGUoKSB7XHJcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXHJcbiAgICBpZihcclxuICAgICAgc2V0dGluZ3MgJiZcclxuICAgICAgdGhpcy5lbmFibGVkXHJcbiAgICApIHtcclxuICAgICAgaWYodGhpcy50YXJnZXQpIGRlbGV0ZSB0aGlzLnRhcmdldFxyXG4gICAgICBpZih0aGlzLm9wdGlvbnMpIGRlbGV0ZSB0aGlzLm9wdGlvbnNcclxuICAgICAgaWYodGhpcy5tdXRhdGlvbnMpIGRlbGV0ZSB0aGlzLm11dGF0aW9uc1xyXG4gICAgICBpZih0aGlzLm9ic2VydmVlcikgZGVsZXRlIHRoaXMub2JzZXJ2ZXJcclxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXHJcbiAgICB9XHJcbiAgfVxyXG4gIG9ic2VydmVyQ2FsbGJhY2sobXV0YXRpb25SZWNvcmRMaXN0LCBvYnNlcnZlcikge1xyXG4gICAgZm9yKGxldCBbbXV0YXRpb25SZWNvcmRJbmRleCwgbXV0YXRpb25SZWNvcmRdIG9mIE9iamVjdC5lbnRyaWVzKG11dGF0aW9uUmVjb3JkTGlzdCkpIHtcclxuICAgICAgc3dpdGNoKG11dGF0aW9uUmVjb3JkLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdjaGlsZExpc3QnOlxyXG4gICAgICAgICAgbGV0IG11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcyA9IFsnYWRkZWROb2RlcycsICdyZW1vdmVkTm9kZXMnXVxyXG4gICAgICAgICAgZm9yKGxldCBtdXRhdGlvblJlY29yZENhdGVnb3J5IG9mIG11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcykge1xyXG4gICAgICAgICAgICBpZihtdXRhdGlvblJlY29yZFttdXRhdGlvblJlY29yZENhdGVnb3J5XS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICBmb3IobGV0IFtub2RlSW5kZXgsIG5vZGVdIG9mIE9iamVjdC5lbnRyaWVzKG11dGF0aW9uUmVjb3JkW211dGF0aW9uUmVjb3JkQ2F0ZWdvcnldKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tdXRhdGlvbnMuZm9yRWFjaCgoX211dGF0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGlmKG11dGF0aW9uUmVjb3JkQ2F0ZWdvcnkubWF0Y2gobmV3IFJlZ0V4cCgnXicuY29uY2F0KF9tdXRhdGlvbi5uYW1lKSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoX211dGF0aW9uLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBpZihfbXV0YXRpb24udGFyZ2V0ID09PSBub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9tdXRhdGlvbi5jYWxsYmFjayh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbXV0YXRpb246IF9tdXRhdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBtdXRhdGlvblJlY29yZDogbXV0YXRpb25SZWNvcmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoX211dGF0aW9uLnRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IF9tdXRhdGlvblRhcmdldCBvZiBfbXV0YXRpb24udGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKF9tdXRhdGlvblRhcmdldCA9PT0gbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF9tdXRhdGlvblRhcmdldC5jYWxsYmFjayh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdXRhdGlvbjogX211dGF0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXV0YXRpb25SZWNvcmQ6IG11dGF0aW9uUmVjb3JkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgY2FzZSAnYXR0cmlidXRlcyc6XHJcbiAgICAgICAgICBsZXQgbXV0YXRpb24gPSB0aGlzLm11dGF0aW9ucy5maWx0ZXIoKF9tdXRhdGlvbikgPT4gKFxyXG4gICAgICAgICAgICBfbXV0YXRpb24ubmFtZSA9PT0gbXV0YXRpb25SZWNvcmQudHlwZSAmJlxyXG4gICAgICAgICAgICBfbXV0YXRpb24uZGF0YSA9PT0gbXV0YXRpb25SZWNvcmQuYXR0cmlidXRlTmFtZVxyXG4gICAgICAgICAgKSlbMF1cclxuICAgICAgICAgIGlmKG11dGF0aW9uKSB7XHJcbiAgICAgICAgICAgIG11dGF0aW9uLmNhbGxiYWNrKHtcclxuICAgICAgICAgICAgICBtdXRhdGlvbjogbXV0YXRpb24sXHJcbiAgICAgICAgICAgICAgbXV0YXRpb25SZWNvcmQ6IG11dGF0aW9uUmVjb3JkLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBjb25uZWN0KCkge1xyXG4gICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKHRoaXMudGFyZ2V0LCB0aGlzLm9wdGlvbnMpXHJcbiAgICB0aGlzLl9jb25uZWN0ZWQgPSB0cnVlXHJcbiAgfVxyXG4gIGRpc2Nvbm5lY3QoKSB7XHJcbiAgICB0aGlzLm9ic2VydmVyLmRpc2Nvbm5lY3QoKVxyXG4gICAgdGhpcy5fY29ubmVjdGVkID0gZmFsc2VcclxuICB9XHJcbn1cclxuIiwiTVZDLlNlcnZpY2UgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICAgIHRoaXMuZW5hYmxlKClcbiAgfVxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5kZWZhdWx0cyB8fCB7XG4gICAgY29udGVudFR5cGU6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSxcbiAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgfSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlcygpIHsgcmV0dXJuIFsnJywgJ2FycmF5YnVmZmVyJywgJ2Jsb2InLCAnZG9jdW1lbnQnLCAnanNvbicsICd0ZXh0J10gfVxuICBnZXQgX3Jlc3BvbnNlVHlwZSgpIHsgcmV0dXJuIHRoaXMucmVzcG9uc2VUeXBlIH1cbiAgc2V0IF9yZXNwb25zZVR5cGUocmVzcG9uc2VUeXBlKSB7XG4gICAgdGhpcy5feGhyLnJlc3BvbnNlVHlwZSA9IHRoaXMuX3Jlc3BvbnNlVHlwZXMuZmluZChcbiAgICAgIChyZXNwb25zZVR5cGVJdGVtKSA9PiByZXNwb25zZVR5cGVJdGVtID09PSByZXNwb25zZVR5cGVcbiAgICApIHx8IHRoaXMuX2RlZmF1bHRzLnJlc3BvbnNlVHlwZVxuICB9XG4gIGdldCBfdHlwZSgpIHsgcmV0dXJuIHRoaXMudHlwZSB9XG4gIHNldCBfdHlwZSh0eXBlKSB7IHRoaXMudHlwZSA9IHR5cGUgfVxuICBnZXQgX3VybCgpIHsgcmV0dXJuIHRoaXMudXJsIH1cbiAgc2V0IF91cmwodXJsKSB7IHRoaXMudXJsID0gdXJsIH1cbiAgZ2V0IF9oZWFkZXJzKCkgeyByZXR1cm4gdGhpcy5oZWFkZXJzIHx8IFtdIH1cbiAgc2V0IF9oZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLl9oZWFkZXJzLmxlbmd0aCA9IDBcbiAgICBmb3IobGV0IGhlYWRlciBvZiBoZWFkZXJzKSB7XG4gICAgICB0aGlzLl94aHIuc2V0UmVxdWVzdEhlYWRlcih7aGVhZGVyfVswXSwge2hlYWRlcn1bMV0pXG4gICAgICB0aGlzLl9oZWFkZXJzLnB1c2goaGVhZGVyKVxuICAgIH1cbiAgfVxuICBnZXQgX3hocigpIHtcbiAgICB0aGlzLnhociA9ICh0aGlzLnhocilcbiAgICAgID8gdGhpcy54aHJcbiAgICAgIDogbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICByZXR1cm4gdGhpcy54aHJcbiAgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgbmV3WEhSKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZih0aGlzLl94aHIuc3RhdHVzID09PSAyMDApIHRoaXMuX3hoci5hYm9ydCgpXG4gICAgICB0aGlzLl94aHIub3Blbih0aGlzLl90eXBlLCB0aGlzLl91cmwpXG4gICAgICB0aGlzLl94aHIub25sb2FkID0gcmVzb2x2ZVxuICAgICAgdGhpcy5feGhyLm9uZXJyb3IgPSByZWplY3RcbiAgICAgIHRoaXMuX3hoci5zZW5kKHRoaXMuX2RhdGEpXG4gICAgfSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKHNldHRpbmdzLnR5cGUpIHRoaXMuX3R5cGUgPSBzZXR0aW5ncy50eXBlXG4gICAgICBpZihzZXR0aW5ncy51cmwpIHRoaXMuX3VybCA9IHNldHRpbmdzLnVybFxuICAgICAgaWYoc2V0dGluZ3MuZGF0YSkgdGhpcy5fZGF0YSA9IHNldHRpbmdzLmRhdGEgfHwgbnVsbFxuICAgICAgaWYoc2V0dGluZ3MuaGVhZGVycykgdGhpcy5faGVhZGVycyA9IHNldHRpbmdzLmhlYWRlcnMgfHwgW3RoaXMuX2RlZmF1bHRzLmNvbnRlbnRUeXBlXVxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5yZXNwb25zZVR5cGUpIHRoaXMuX3Jlc3BvbnNlVHlwZSA9IHRoaXMuX3NldHRpbmdzLnJlc3BvbnNlVHlwZVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBpZihPYmplY3Qua2V5cyh0aGlzLnNldHRpbmdzKS5sZW5ndGgpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLnNldHRpbmdzLnR5cGVcbiAgICAgIGRlbGV0ZSB0aGlzLnNldHRpbmdzLnVybFxuICAgICAgZGVsZXRlIHRoaXMuc2V0dGluZ3MuZGF0YVxuICAgICAgZGVsZXRlIHRoaXMuc2V0dGluZ3MuaGVhZGVyc1xuICAgICAgZGVsZXRlIHRoaXMuc2V0dGluZ3MucmVzcG9uc2VUeXBlXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuIiwiTVZDLk1vZGVsID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgICB0aGlzLmVuYWJsZSgpXG4gIH1cbiAgZ2V0IF9pc1NldHRpbmcoKSB7IHJldHVybiB0aGlzLmlzU2V0dGluZyB9XG4gIHNldCBfaXNTZXR0aW5nKGlzU2V0dGluZykgeyB0aGlzLmlzU2V0dGluZyA9IGlzU2V0dGluZyB9XG4gIGdldCBfZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLl9kZWZhdWx0cyB9XG4gIHNldCBfZGVmYXVsdHMoZGVmYXVsdHMpIHtcbiAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHNcbiAgICB0aGlzLnNldCh0aGlzLmRlZmF1bHRzKVxuICB9XG4gIGdldCBfc2NoZW1hKCkgeyByZXR1cm4gdGhpcy5fc2NoZW1hIH1cbiAgc2V0IF9zY2hlbWEoc2NoZW1hKSB7IHRoaXMuc2NoZW1hID0gc2NoZW1hIH1cbiAgZ2V0IF9oaXN0aW9ncmFtKCkgeyByZXR1cm4gdGhpcy5oaXN0aW9ncmFtIHx8IHtcbiAgICBsZW5ndGg6IDFcbiAgfSB9XG4gIHNldCBfaGlzdGlvZ3JhbShoaXN0aW9ncmFtKSB7XG4gICAgdGhpcy5oaXN0aW9ncmFtID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHRoaXMuX2hpc3Rpb2dyYW0sXG4gICAgICBoaXN0aW9ncmFtXG4gICAgKVxuICB9XG4gIGdldCBfaGlzdG9yeSgpIHtcbiAgICB0aGlzLmhpc3RvcnkgPSAodGhpcy5oaXN0b3J5KVxuICAgICAgPyB0aGlzLmhpc3RvcnlcbiAgICAgIDogW11cbiAgICByZXR1cm4gdGhpcy5oaXN0b3J5XG4gIH1cbiAgc2V0IF9oaXN0b3J5KGRhdGEpIHtcbiAgICBpZihcbiAgICAgIE9iamVjdC5rZXlzKGRhdGEpLmxlbmd0aFxuICAgICkge1xuICAgICAgaWYodGhpcy5faGlzdGlvZ3JhbS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS51bnNoaWZ0KHRoaXMucGFyc2UoZGF0YSkpXG4gICAgICAgIHRoaXMuX2hpc3Rvcnkuc3BsaWNlKHRoaXMuX2hpc3Rpb2dyYW0ubGVuZ3RoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgX2RhdGEoKSB7XG4gICAgdGhpcy5kYXRhID0gICh0aGlzLmRhdGEpXG4gICAgICA/IHRoaXMuZGF0YVxuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmRhdGFcbiAgfVxuICBnZXQgX2RhdGFFdmVudHMoKSB7XG4gICAgdGhpcy5kYXRhRXZlbnRzID0gKHRoaXMuZGF0YUV2ZW50cylcbiAgICAgID8gdGhpcy5kYXRhRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YUV2ZW50c1xuICB9XG4gIHNldCBfZGF0YUV2ZW50cyhkYXRhRXZlbnRzKSB7XG4gICAgdGhpcy5kYXRhRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGRhdGFFdmVudHMsIHRoaXMuX2RhdGFFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9kYXRhQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuZGF0YUNhbGxiYWNrcyA9ICh0aGlzLmRhdGFDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuZGF0YUNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmRhdGFDYWxsYmFja3NcbiAgfVxuICBzZXQgX2RhdGFDYWxsYmFja3MoZGF0YUNhbGxiYWNrcykge1xuICAgIHRoaXMuZGF0YUNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBkYXRhQ2FsbGJhY2tzLCB0aGlzLl9kYXRhQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICBhZGREYXRhRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuZGF0YUV2ZW50cywgdGhpcywgdGhpcy5kYXRhQ2FsbGJhY2tzKVxuICB9XG4gIGdldCgpIHtcbiAgICBsZXQgcHJvcGVydHkgPSBhcmd1bWVudHNbMF1cbiAgICByZXR1cm4gdGhpcy5fZGF0YVsnXycuY29uY2F0KHByb3BlcnR5KV1cbiAgfVxuICBzZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBpZihpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5faXNTZXR0aW5nID0gdHJ1ZVxuICAgICAgICAgIH0gZWxzZSBpZihpbmRleCA9PT0gKF9hcmd1bWVudHMubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2lzU2V0dGluZyA9IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDM6XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHZhciBzaWxlbnQgPSBhcmd1bWVudHNbMl1cbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICB1bnNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5fZGF0YSkpIHtcbiAgICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBzZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KSB7XG4gICAgaWYoIXRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXSkge1xuICAgICAgbGV0IGNvbnRleHQgPSB0aGlzXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhcbiAgICAgICAgdGhpcy5fZGF0YSxcbiAgICAgICAge1xuICAgICAgICAgIFsnXycuY29uY2F0KGtleSldOiB7XG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzW2tleV0gfSxcbiAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICAhc2lsZW50ICYmXG4gICAgICAgICAgICAgICAgIWNvbnRleHQuX2lzU2V0dGluZ1xuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBsZXQgc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3NldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgICAgICAgICAgICAgIGxldCBzZXRFdmVudE5hbWUgPSAnc2V0J1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICAgIHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBzZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gICAgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldID0gdmFsdWVcbiAgfVxuICB1bnNldERhdGFQcm9wZXJ0eShrZXkpIHtcbiAgICBsZXQgdW5zZXRWYWx1ZUV2ZW50TmFtZSA9IFsndW5zZXQnLCAnOicsIGtleV0uam9pbignJylcbiAgICBsZXQgdW5zZXRFdmVudE5hbWUgPSAndW5zZXQnXG4gICAgbGV0IHVuc2V0VmFsdWUgPSB0aGlzLl9kYXRhW2tleV1cbiAgICBkZWxldGUgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldXG4gICAgZGVsZXRlIHRoaXMuX2RhdGFba2V5XVxuICAgIHRoaXMuZW1pdChcbiAgICAgIHVuc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IHVuc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIClcbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldEV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIClcbiAgfVxuICBwYXJzZShkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5fZGF0YVxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KE9iamVjdC5hc3NpZ24oe30sIGRhdGEpKSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuaGlzdGlvZ3JhbSkgdGhpcy5faGlzdGlvZ3JhbSA9IHRoaXMuc2V0dGluZ3MuaGlzdGlvZ3JhbVxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5kYXRhKSB0aGlzLnNldCh0aGlzLnNldHRpbmdzLmRhdGEpXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRhdGFDYWxsYmFja3MpIHRoaXMuX2RhdGFDYWxsYmFja3MgPSB0aGlzLnNldHRpbmdzLmRhdGFDYWxsYmFja3NcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGF0YUV2ZW50cykgdGhpcy5fZGF0YUV2ZW50cyA9IHRoaXMuc2V0dGluZ3MuZGF0YUV2ZW50c1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5zY2hlbWEpIHRoaXMuX3NjaGVtYSA9IHRoaXMuc2V0dGluZ3Muc2NoZW1hXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRlZmF1bHRzKSB0aGlzLl9kZWZhdWx0cyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHNcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmRhdGFFdmVudHMgJiZcbiAgICAgICAgdGhpcy5kYXRhQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5hZGREYXRhRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgfVxuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmRhdGFFdmVudHMgJiZcbiAgICAgICAgdGhpcy5kYXRhQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5yZW1vdmVEYXRhRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSB0aGlzLl9oaXN0aW9ncmFtXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YVxuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhRXZlbnRzXG4gICAgICBkZWxldGUgdGhpcy5fc2NoZW1hXG4gICAgICBkZWxldGUgdGhpcy5fZGVmYXVsdHNcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgfVxufVxuIiwiTVZDLkVtaXR0ZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5Nb2RlbCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgICBpZih0aGlzLnNldHRpbmdzKSB7XHJcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MubmFtZSkgdGhpcy5fbmFtZSA9IHRoaXMuc2V0dGluZ3MubmFtZVxyXG4gICAgfVxyXG4gIH1cclxuICBnZXQgX25hbWUoKSB7IHJldHVybiB0aGlzLm5hbWUgfVxyXG4gIHNldCBfbmFtZShuYW1lKSB7IHRoaXMubmFtZSA9IG5hbWUgfVxyXG4gIGdldCBlbWlzc2lvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5hbWU6IHRoaXMuX25hbWUsXHJcbiAgICAgIGRhdGE6IHRoaXMucGFyc2UoKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJNVkMuVmlldyA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gICAgdGhpcy5lbmFibGUoKVxuICB9XG4gIGdldCBfZWxlbWVudE5hbWUoKSB7IHJldHVybiB0aGlzLl9lbGVtZW50LnRhZ05hbWUgfVxuICBzZXQgX2VsZW1lbnROYW1lKGVsZW1lbnROYW1lKSB7XG4gICAgaWYoIXRoaXMuX2VsZW1lbnQpIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnROYW1lKVxuICB9XG4gIGdldCBfZWxlbWVudCgpIHsgcmV0dXJuIHRoaXMuZWxlbWVudCB9XG4gIHNldCBfZWxlbWVudChlbGVtZW50KSB7XG4gICAgaWYoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgfSBlbHNlIGlmKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50KVxuICAgIH1cbiAgICB0aGlzLmVsZW1lbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudCwge1xuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICB9KVxuICB9XG4gIGdldCBfYXR0cmlidXRlcygpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQuYXR0cmlidXRlcyB9XG4gIHNldCBfYXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgZm9yKGxldCBbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGVWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlS2V5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IF91aSgpIHtcbiAgICB0aGlzLnVpID0gKHRoaXMudWkpXG4gICAgICA/IHRoaXMudWlcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy51aVxuICB9XG4gIHNldCBfdWkodWkpIHtcbiAgICBpZighdGhpcy5fdWlbJyRlbGVtZW50J10pIHRoaXMuX3VpWyckZWxlbWVudCddID0gdGhpcy5lbGVtZW50XG4gICAgZm9yKGxldCBbdWlLZXksIHVpVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHVpKSkge1xuICAgICAgaWYodWlWYWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuX3VpW3VpS2V5XSA9IHVpVmFsdWVcbiAgICAgIH0gZWxzZSBpZih0eXBlb2YgdWlWYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fdWlbdWlLZXldID0gdGhpcy5fZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHVpVmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfdWlFdmVudHMoKSB7IHJldHVybiB0aGlzLnVpRXZlbnRzIH1cbiAgc2V0IF91aUV2ZW50cyh1aUV2ZW50cykgeyB0aGlzLnVpRXZlbnRzID0gdWlFdmVudHMgfVxuICBnZXQgX3VpQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMudWlDYWxsYmFja3MgPSAodGhpcy51aUNhbGxiYWNrcylcbiAgICAgID8gdGhpcy51aUNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnVpQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF91aUNhbGxiYWNrcyh1aUNhbGxiYWNrcykge1xuICAgIHRoaXMudWlDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdWlDYWxsYmFja3MsIHRoaXMuX3VpQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfb2JzZXJ2ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5vYnNlcnZlckNhbGxiYWNrcyA9ICh0aGlzLm9ic2VydmVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX29ic2VydmVyQ2FsbGJhY2tzKG9ic2VydmVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5vYnNlcnZlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBvYnNlcnZlckNhbGxiYWNrcywgdGhpcy5fb2JzZXJ2ZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF91aUVtaXR0ZXJzKCkge1xuICAgIHRoaXMudWlFbWl0dGVycyA9ICh0aGlzLnVpRW1pdHRlcnMpXG4gICAgICA/IHRoaXMudWlFbWl0dGVyc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnVpRW1pdHRlcnNcbiAgfVxuICBzZXQgX3VpRW1pdHRlcnModWlFbWl0dGVycykge1xuICAgIGxldCBfdWlFbWl0dGVycyA9IHt9XG4gICAgdWlFbWl0dGVycy5mb3JFYWNoKChVSUVtaXR0ZXIpID0+IHtcbiAgICAgIGxldCB1aUVtaXR0ZXIgPSBuZXcgVUlFbWl0dGVyKClcbiAgICAgIF91aUVtaXR0ZXJzW3VpRW1pdHRlci5uYW1lXSA9IHVpRW1pdHRlclxuICAgIH0pXG4gICAgdGhpcy51aUVtaXR0ZXJzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIF91aUVtaXR0ZXJzLCB0aGlzLl91aUVtaXR0ZXJzXG4gICAgKVxuICB9XG4gIGdldCBfb2JzZXJ2ZXJzKCkge1xuICAgIHRoaXMub2JzZXJ2ZXJzID0gKHRoaXMub2JzZXJ2ZXJzKVxuICAgICAgPyB0aGlzLm9ic2VydmVyc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm9ic2VydmVyc1xuICB9XG4gIHNldCBfb2JzZXJ2ZXJzKG9ic2VydmVycykge1xuICAgIGZvcihsZXQgW29ic2VydmVyQ29uZmlndXJhdGlvbiwgbXV0YXRpb25TZXR0aW5nc10gb2YgT2JqZWN0LmVudHJpZXMob2JzZXJ2ZXJzKSkge1xuICAgICAgbGV0IG9ic2VydmVyQ29uZmlndXJhdGlvbkRhdGEgPSBvYnNlcnZlckNvbmZpZ3VyYXRpb24uc3BsaXQoJyAnKVxuICAgICAgbGV0IG9ic2VydmVyTmFtZSA9IG9ic2VydmVyQ29uZmlndXJhdGlvbkRhdGFbMF1cbiAgICAgIGxldCBvYnNlcnZlclRhcmdldCA9IE1WQy5VdGlscy5vYmplY3RRdWVyeShcbiAgICAgICAgb2JzZXJ2ZXJOYW1lLFxuICAgICAgICB0aGlzLnVpXG4gICAgICApXG4gICAgICBsZXQgb2JzZXJ2ZXJPcHRpb25zID0gKG9ic2VydmVyQ29uZmlndXJhdGlvbkRhdGFbMV0pXG4gICAgICAgID8gb2JzZXJ2ZXJDb25maWd1cmF0aW9uRGF0YVsxXVxuICAgICAgICAgIC5zcGxpdCgnOicpXG4gICAgICAgICAgLnJlZHVjZSgoX29ic2VydmVyT3B0aW9ucywgY3VycmVudFZhbHVlKSA9PiB7XG4gICAgICAgICAgICBfb2JzZXJ2ZXJPcHRpb25zW2N1cnJlbnRWYWx1ZV0gPSB0cnVlXG4gICAgICAgICAgICByZXR1cm4gX29ic2VydmVyT3B0aW9uc1xuICAgICAgICAgIH0sIHt9KVxuICAgICAgICA6IHt9XG4gICAgICBsZXQgb2JzZXJ2ZXJTZXR0aW5ncyA9IHtcbiAgICAgICAgdGFyZ2V0OiBvYnNlcnZlclRhcmdldFswXVsxXSxcbiAgICAgICAgb3B0aW9uczogb2JzZXJ2ZXJPcHRpb25zLFxuICAgICAgICBtdXRhdGlvbnM6IHtcbiAgICAgICAgICB0YXJnZXRzOiB0aGlzLnVpLFxuICAgICAgICAgIHNldHRpbmdzOiBtdXRhdGlvblNldHRpbmdzLFxuICAgICAgICAgIGNhbGxiYWNrczogdGhpcy5vYnNlcnZlckNhbGxiYWNrcyxcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICAgIGxldCBvYnNlcnZlciA9IG5ldyBNVkMuT2JzZXJ2ZXIob2JzZXJ2ZXJTZXR0aW5ncylcbiAgICAgIHRoaXMuX29ic2VydmVyc1tvYnNlcnZlck5hbWVdID0gb2JzZXJ2ZXJcbiAgICB9XG4gIH1cbiAgZ2V0IGVsZW1lbnRPYnNlcnZlcigpIHtcbiAgICB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgPSAodGhpcy5fZWxlbWVudE9ic2VydmVyKVxuICAgICAgPyB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgICAgIDogbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5lbGVtZW50T2JzZXJ2ZS5iaW5kKHRoaXMpKVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgfVxuICBlbGVtZW50T2JzZXJ2ZShtdXRhdGlvblJlY29yZExpc3QsIG9ic2VydmVyKSB7XG4gICAgZm9yKGxldCBbbXV0YXRpb25SZWNvcmRJbmRleCwgbXV0YXRpb25SZWNvcmRdIG9mIE9iamVjdC5lbnRyaWVzKG11dGF0aW9uUmVjb3JkTGlzdCkpIHtcbiAgICAgIHN3aXRjaChtdXRhdGlvblJlY29yZC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2NoaWxkTGlzdCc6XG4gICAgICAgICAgbGV0IG11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcyA9IFsnYWRkZWROb2RlcycsICdyZW1vdmVkTm9kZXMnXVxuICAgICAgICAgIGZvcihsZXQgbXV0YXRpb25SZWNvcmRDYXRlZ29yeSBvZiBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMpIHtcbiAgICAgICAgICAgIGlmKG11dGF0aW9uUmVjb3JkW211dGF0aW9uUmVjb3JkQ2F0ZWdvcnldLmxlbmd0aCkge1xuICAgICAgICAgICAgICB0aGlzLnJlbW92ZU9ic2VydmVycygpXG4gICAgICAgICAgICAgIHRoaXMucmVtb3ZlVUkoKVxuICAgICAgICAgICAgICB0aGlzLmFkZFVJKClcbiAgICAgICAgICAgICAgdGhpcy5hZGRPYnNlcnZlcnMoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgX2luc2VydCgpIHsgcmV0dXJuIHRoaXMuaW5zZXJ0IH1cbiAgc2V0IF9pbnNlcnQoaW5zZXJ0KSB7IHRoaXMuaW5zZXJ0ID0gaW5zZXJ0IH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGdldCBfdGVtcGxhdGVzKCkge1xuICAgIHRoaXMudGVtcGxhdGVzID0gKHRoaXMudGVtcGxhdGVzKVxuICAgICAgPyB0aGlzLnRlbXBsYXRlc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnRlbXBsYXRlc1xuICB9XG4gIHNldCBfdGVtcGxhdGVzKHRlbXBsYXRlcykge1xuICAgIGZvcihsZXQgW3RlbXBsYXRlTmFtZSwgdGVtcGxhdGVTZXR0aW5nc10gb2YgT2JqZWN0LmVudHJpZXModGVtcGxhdGVzKSkge1xuICAgICAgdGhpcy5fdGVtcGxhdGVzW3RlbXBsYXRlTmFtZV0gPSB0ZW1wbGF0ZVNldHRpbmdzXG4gICAgfVxuICB9XG4gIGF1dG9JbnNlcnQoKSB7XG4gICAgdGhpcy5pbnNlcnQuZWxlbWVudFxuICAgIHRoaXMuaW5zZXJ0Lm1ldGhvZFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5pbnNlcnQuZWxlbWVudClcbiAgICAuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQodGhpcy5pbnNlcnQubWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgfSlcbiAgfVxuICBhdXRvUmVtb3ZlKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5lbGVtZW50ICYmXG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICkgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICB9XG4gIGFkZEVsZW1lbnQoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihzZXR0aW5ncy5lbGVtZW50TmFtZSkgdGhpcy5fZWxlbWVudE5hbWUgPSBzZXR0aW5ncy5lbGVtZW50TmFtZVxuICAgIGlmKHNldHRpbmdzLmVsZW1lbnQpIHRoaXMuX2VsZW1lbnQgPSBzZXR0aW5ncy5lbGVtZW50XG4gICAgaWYoc2V0dGluZ3MuYXR0cmlidXRlcykgdGhpcy5fYXR0cmlidXRlcyA9IHNldHRpbmdzLmF0dHJpYnV0ZXNcbiAgICBpZihzZXR0aW5ncy50ZW1wbGF0ZXMpIHRoaXMuX3RlbXBsYXRlcyA9IHNldHRpbmdzLnRlbXBsYXRlc1xuICAgIGlmKHNldHRpbmdzLmluc2VydCkgdGhpcy5faW5zZXJ0ID0gc2V0dGluZ3MuaW5zZXJ0XG4gIH1cbiAgcmVtb3ZlRWxlbWVudChzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgdGhpcy5lbGVtZW50ICYmXG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICkgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIGlmKHRoaXMuZWxlbWVudCkgZGVsZXRlIHRoaXMuZWxlbWVudFxuICAgIGlmKHRoaXMuYXR0cmlidXRlcykgZGVsZXRlIHRoaXMuYXR0cmlidXRlc1xuICAgIGlmKHRoaXMudGVtcGxhdGVzKSBkZWxldGUgdGhpcy50ZW1wbGF0ZXNcbiAgICBpZih0aGlzLmluc2VydCkgZGVsZXRlIHRoaXMuaW5zZXJ0XG4gIH1cbiAgYWRkVUkoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihzZXR0aW5ncy51aSkgdGhpcy5fdWkgPSBzZXR0aW5ncy51aVxuICAgIGlmKHNldHRpbmdzLnVpRW1pdHRlcnMpIHRoaXMuX3VpRW1pdHRlcnMgPSBzZXR0aW5ncy51aUVtaXR0ZXJzXG4gICAgaWYoc2V0dGluZ3MudWlDYWxsYmFja3MpIHRoaXMuX3VpQ2FsbGJhY2tzID0gc2V0dGluZ3MudWlDYWxsYmFja3NcbiAgICBpZihzZXR0aW5ncy51aUV2ZW50cykge1xuICAgICAgdGhpcy5fdWlFdmVudHMgPSBzZXR0aW5ncy51aUV2ZW50c1xuICAgICAgdGhpcy5hZGRVSUV2ZW50cygpXG4gICAgfVxuICB9XG4gIHJlbW92ZVVJKHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzXG4gICAgaWYoc2V0dGluZ3MudWlFdmVudHMpIHtcbiAgICAgIHRoaXMucmVtb3ZlVUlFdmVudHMoKVxuICAgICAgZGVsZXRlIHRoaXMuX3VpRXZlbnRzXG4gICAgfVxuICAgIGRlbGV0ZSB0aGlzLnVpRXZlbnRzXG4gICAgZGVsZXRlIHRoaXMudWlcbiAgICBkZWxldGUgdGhpcy51aUNhbGxiYWNrc1xuICB9XG4gIGFkZE9ic2VydmVycyhzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKHNldHRpbmdzLm9ic2VydmVyQ2FsbGJhY2tzKSB0aGlzLl9vYnNlcnZlckNhbGxiYWNrcyA9IHNldHRpbmdzLm9ic2VydmVyQ2FsbGJhY2tzXG4gICAgaWYoc2V0dGluZ3Mub2JzZXJ2ZXJzKSB7XG4gICAgICB0aGlzLl9vYnNlcnZlcnMgPSBzZXR0aW5ncy5vYnNlcnZlcnNcbiAgICAgIHRoaXMuY29ubmVjdE9ic2VydmVycygpXG4gICAgfVxuICB9XG4gIHJlbW92ZU9ic2VydmVycygpIHtcbiAgICBpZih0aGlzLm9ic2VydmVyQ2FsbGJhY2tzKSBkZWxldGUgdGhpcy5vYnNlcnZlckNhbGxiYWNrc1xuICAgIGlmKHRoaXMub2JzZXJ2ZXJzKSB7XG4gICAgICB0aGlzLmRpc2Nvbm5lY3RPYnNlcnZlcnMoKVxuICAgICAgZGVsZXRlIHRoaXMub2JzZXJ2ZXJzXG4gICAgfVxuICB9XG4gIGFkZFVJRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy51aUV2ZW50cyAmJlxuICAgICAgdGhpcy51aSAmJlxuICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMoXG4gICAgICAgIHRoaXMudWlFdmVudHMsXG4gICAgICAgIHRoaXMudWksXG4gICAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgcmVtb3ZlVUlFdmVudHMoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLnVpRXZlbnRzICYmXG4gICAgICB0aGlzLnVpICYmXG4gICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgKSB7XG4gICAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMoXG4gICAgICAgIHRoaXMudWlFdmVudHMsXG4gICAgICAgIHRoaXMudWksXG4gICAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgY29ubmVjdE9ic2VydmVycygpIHtcbiAgICBPYmplY3QuZW50cmllcyh0aGlzLl9vYnNlcnZlcnMpXG4gICAgICAuZm9yRWFjaCgoW29ic2VydmVyTmFtZSwgb2JzZXJ2ZXJdKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLmNvbm5lY3QoKVxuICAgICAgfSlcbiAgfVxuICBkaXNjb25uZWN0T2JzZXJ2ZXJzKCkge1xuICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuX29ic2VydmVycylcbiAgICAgIC5mb3JFYWNoKChbb2JzZXJ2ZXJOYW1lLCBvYnNlcnZlcl0pID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIuZGlzY29ubmVjdCgpXG4gICAgICB9KVxuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5hZGRFbGVtZW50KHNldHRpbmdzKVxuICAgICAgdGhpcy5hZGRVSShzZXR0aW5ncylcbiAgICAgIHRoaXMuYWRkT2JzZXJ2ZXJzKHNldHRpbmdzKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLnJlbW92ZVVJKHNldHRpbmdzKVxuICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHNldHRpbmdzKVxuICAgICAgdGhpcy5yZW1vdmVPYnNlcnZlcnMoc2V0dGluZ3MpXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gIH1cbn1cbiIsIk1WQy5Db250cm9sbGVyID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgICB0aGlzLmVuYWJsZSgpXG4gIH1cbiAgZ2V0IF9lbWl0dGVycygpIHtcbiAgICB0aGlzLmVtaXR0ZXJzID0gKHRoaXMuZW1pdHRlcnMpXG4gICAgICA/IHRoaXMuZW1pdHRlcnNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyc1xuICB9XG4gIHNldCBfZW1pdHRlcnMoZW1pdHRlcnMpIHtcbiAgICB0aGlzLmVtaXR0ZXJzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGVtaXR0ZXJzLCB0aGlzLl9lbWl0dGVyc1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVsQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMubW9kZWxDYWxsYmFja3MgPSAodGhpcy5tb2RlbENhbGxiYWNrcylcbiAgICAgID8gdGhpcy5tb2RlbENhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm1vZGVsQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9tb2RlbENhbGxiYWNrcyhtb2RlbENhbGxiYWNrcykge1xuICAgIHRoaXMubW9kZWxDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgbW9kZWxDYWxsYmFja3MsIHRoaXMuX21vZGVsQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfdmlld0NhbGxiYWNrcygpIHtcbiAgICB0aGlzLnZpZXdDYWxsYmFja3MgPSAodGhpcy52aWV3Q2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLnZpZXdDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy52aWV3Q2FsbGJhY2tzXG4gIH1cbiAgc2V0IF92aWV3Q2FsbGJhY2tzKHZpZXdDYWxsYmFja3MpIHtcbiAgICB0aGlzLnZpZXdDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld0NhbGxiYWNrcywgdGhpcy5fdmlld0NhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzID0gKHRoaXMuY29udHJvbGxlckNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICB9XG4gIHNldCBfY29udHJvbGxlckNhbGxiYWNrcyhjb250cm9sbGVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGNvbnRyb2xsZXJDYWxsYmFja3MsIHRoaXMuX2NvbnRyb2xsZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9yb3V0ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5yb3V0ZXJDYWxsYmFja3MgPSAodGhpcy5yb3V0ZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMucm91dGVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9yb3V0ZXJDYWxsYmFja3Mocm91dGVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5yb3V0ZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgcm91dGVyQ2FsbGJhY2tzLCB0aGlzLl9yb3V0ZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9tb2RlbHMoKSB7XG4gICAgdGhpcy5tb2RlbHMgPSAodGhpcy5tb2RlbHMpXG4gICAgICA/IHRoaXMubW9kZWxzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMubW9kZWxzXG4gIH1cbiAgc2V0IF9tb2RlbHMobW9kZWxzKSB7XG4gICAgdGhpcy5tb2RlbHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgbW9kZWxzLCB0aGlzLl9tb2RlbHNcbiAgICApXG4gIH1cbiAgZ2V0IF92aWV3cygpIHtcbiAgICB0aGlzLnZpZXdzID0gKHRoaXMudmlld3MpXG4gICAgICA/IHRoaXMudmlld3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy52aWV3c1xuICB9XG4gIHNldCBfdmlld3Modmlld3MpIHtcbiAgICB0aGlzLnZpZXdzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHZpZXdzLCB0aGlzLl92aWV3c1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXJzKCkge1xuICAgIHRoaXMuY29udHJvbGxlcnMgPSAodGhpcy5jb250cm9sbGVycylcbiAgICAgID8gdGhpcy5jb250cm9sbGVyc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJzXG4gIH1cbiAgc2V0IF9jb250cm9sbGVycyhjb250cm9sbGVycykge1xuICAgIHRoaXMuY29udHJvbGxlcnMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlcnMsIHRoaXMuX2NvbnRyb2xsZXJzXG4gICAgKVxuICB9XG4gIGdldCBfcm91dGVycygpIHtcbiAgICB0aGlzLnJvdXRlcnMgPSAodGhpcy5yb3V0ZXJzKVxuICAgICAgPyB0aGlzLnJvdXRlcnNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXJzXG4gIH1cbiAgc2V0IF9yb3V0ZXJzKHJvdXRlcnMpIHtcbiAgICB0aGlzLnJvdXRlcnMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgcm91dGVycywgdGhpcy5fcm91dGVyc1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVsRXZlbnRzKCkge1xuICAgIHRoaXMubW9kZWxFdmVudHMgPSAodGhpcy5tb2RlbEV2ZW50cylcbiAgICAgID8gdGhpcy5tb2RlbEV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm1vZGVsRXZlbnRzXG4gIH1cbiAgc2V0IF9tb2RlbEV2ZW50cyhtb2RlbEV2ZW50cykge1xuICAgIHRoaXMubW9kZWxFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgbW9kZWxFdmVudHMsIHRoaXMuX21vZGVsRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfdmlld0V2ZW50cygpIHtcbiAgICB0aGlzLnZpZXdFdmVudHMgPSAodGhpcy52aWV3RXZlbnRzKVxuICAgICAgPyB0aGlzLnZpZXdFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy52aWV3RXZlbnRzXG4gIH1cbiAgc2V0IF92aWV3RXZlbnRzKHZpZXdFdmVudHMpIHtcbiAgICB0aGlzLnZpZXdFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld0V2ZW50cywgdGhpcy5fdmlld0V2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgdGhpcy5jb250cm9sbGVyRXZlbnRzID0gKHRoaXMuY29udHJvbGxlckV2ZW50cylcbiAgICAgID8gdGhpcy5jb250cm9sbGVyRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlckV2ZW50c1xuICB9XG4gIHNldCBfY29udHJvbGxlckV2ZW50cyhjb250cm9sbGVyRXZlbnRzKSB7XG4gICAgdGhpcy5jb250cm9sbGVyRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGNvbnRyb2xsZXJFdmVudHMsIHRoaXMuX2NvbnRyb2xsZXJFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGFkZE1vZGVsRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMubW9kZWxFdmVudHMsIHRoaXMubW9kZWxzLCB0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICB9XG4gIHJlbW92ZU1vZGVsRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5tb2RlbEV2ZW50cywgdGhpcy5tb2RlbHMsIHRoaXMubW9kZWxDYWxsYmFja3MpXG4gIH1cbiAgYWRkVmlld0V2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnZpZXdFdmVudHMsIHRoaXMudmlld3MsIHRoaXMudmlld0NhbGxiYWNrcylcbiAgfVxuICByZW1vdmVWaWV3RXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy52aWV3RXZlbnRzLCB0aGlzLnZpZXdzLCB0aGlzLnZpZXdDYWxsYmFja3MpXG4gIH1cbiAgYWRkQ29udHJvbGxlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmNvbnRyb2xsZXJFdmVudHMsIHRoaXMuY29udHJvbGxlcnMsIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcylcbiAgfVxuICByZW1vdmVDb250cm9sbGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5jb250cm9sbGVyRXZlbnRzLCB0aGlzLmNvbnRyb2xsZXJzLCB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICBpZihzZXR0aW5ncy5lbWl0dGVycykgdGhpcy5fZW1pdHRlcnMgPSBzZXR0aW5ncy5lbWl0dGVyc1xuICAgICAgaWYoc2V0dGluZ3MubW9kZWxDYWxsYmFja3MpIHRoaXMuX21vZGVsQ2FsbGJhY2tzID0gc2V0dGluZ3MubW9kZWxDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLnZpZXdDYWxsYmFja3MpIHRoaXMuX3ZpZXdDYWxsYmFja3MgPSBzZXR0aW5ncy52aWV3Q2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5jb250cm9sbGVyQ2FsbGJhY2tzKSB0aGlzLl9jb250cm9sbGVyQ2FsbGJhY2tzID0gc2V0dGluZ3MuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3Mucm91dGVyQ2FsbGJhY2tzKSB0aGlzLl9yb3V0ZXJDYWxsYmFja3MgPSBzZXR0aW5ncy5yb3V0ZXJDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLm1vZGVscykgdGhpcy5fbW9kZWxzID0gc2V0dGluZ3MubW9kZWxzXG4gICAgICBpZihzZXR0aW5ncy52aWV3cykgdGhpcy5fdmlld3MgPSBzZXR0aW5ncy52aWV3c1xuICAgICAgaWYoc2V0dGluZ3MuY29udHJvbGxlcnMpIHRoaXMuX2NvbnRyb2xsZXJzID0gc2V0dGluZ3MuY29udHJvbGxlcnNcbiAgICAgIGlmKHNldHRpbmdzLnJvdXRlcnMpIHRoaXMuX3JvdXRlcnMgPSBzZXR0aW5ncy5yb3V0ZXJzXG4gICAgICBpZihzZXR0aW5ncy5tb2RlbEV2ZW50cykgdGhpcy5fbW9kZWxFdmVudHMgPSBzZXR0aW5ncy5tb2RlbEV2ZW50c1xuICAgICAgaWYoc2V0dGluZ3Mudmlld0V2ZW50cykgdGhpcy5fdmlld0V2ZW50cyA9IHNldHRpbmdzLnZpZXdFdmVudHNcbiAgICAgIGlmKHNldHRpbmdzLmNvbnRyb2xsZXJFdmVudHMpIHRoaXMuX2NvbnRyb2xsZXJFdmVudHMgPSBzZXR0aW5ncy5jb250cm9sbGVyRXZlbnRzXG4gICAgICBpZihcbiAgICAgICAgdGhpcy5tb2RlbEV2ZW50cyAmJlxuICAgICAgICB0aGlzLm1vZGVscyAmJlxuICAgICAgICB0aGlzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5hZGRNb2RlbEV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy52aWV3RXZlbnRzICYmXG4gICAgICAgIHRoaXMudmlld3MgJiZcbiAgICAgICAgdGhpcy52aWV3Q2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5hZGRWaWV3RXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVycyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmFkZENvbnRyb2xsZXJFdmVudHMoKVxuICAgICAgfVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5tb2RlbEV2ZW50cyAmJlxuICAgICAgICB0aGlzLm1vZGVscyAmJlxuICAgICAgICB0aGlzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5yZW1vdmVNb2RlbEV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy52aWV3RXZlbnRzICYmXG4gICAgICAgIHRoaXMudmlld3MgJiZcbiAgICAgICAgdGhpcy52aWV3Q2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5yZW1vdmVWaWV3RXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVycyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLnJlbW92ZUNvbnRyb2xsZXJFdmVudHMoKVxuICAgICAgfVxuICAgICAgZGVsZXRlIHRoaXMuX2VtaXR0ZXJzXG4gICAgICBkZWxldGUgdGhpcy5fbW9kZWxDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl92aWV3Q2FsbGJhY2tzXG4gICAgICBkZWxldGUgdGhpcy5fY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgZGVsZXRlIHRoaXMuX3JvdXRlckNhbGxiYWNrc1xuICAgICAgZGVsZXRlIHRoaXMuX21vZGVsc1xuICAgICAgZGVsZXRlIHRoaXMuX3ZpZXdzXG4gICAgICBkZWxldGUgdGhpcy5fY29udHJvbGxlcnNcbiAgICAgIGRlbGV0ZSB0aGlzLl9yb3V0ZXJzXG4gICAgICBkZWxldGUgdGhpcy5fbW9kZWxFdmVudHNcbiAgICAgIGRlbGV0ZSB0aGlzLl92aWV3RXZlbnRzXG4gICAgICBkZWxldGUgdGhpcy5fY29udHJvbGxlckV2ZW50c1xuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICB9XG59XG4iLCJNVkMuUm91dGVyID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgICB0aGlzLmFkZFNldHRpbmdzKClcbiAgICB0aGlzLnNldFJvdXRlcyh0aGlzLnJvdXRlcywgdGhpcy5jb250cm9sbGVycylcbiAgICB0aGlzLnNldEV2ZW50cygpXG4gICAgdGhpcy5zdGFydCgpXG4gICAgaWYodHlwZW9mIHRoaXMuaW5pdGlhbGl6ZSA9PT0gJ2Z1bmN0aW9uJykgdGhpcy5pbml0aWFsaXplKClcbiAgfVxuICBhZGRTZXR0aW5ncygpIHtcbiAgICBpZih0aGlzLl9zZXR0aW5ncykge1xuICAgICAgaWYodGhpcy5fc2V0dGluZ3Mucm91dGVzKSB0aGlzLnJvdXRlcyA9IHRoaXMuX3NldHRpbmdzLnJvdXRlc1xuICAgICAgaWYodGhpcy5fc2V0dGluZ3MuY29udHJvbGxlcnMpIHRoaXMuY29udHJvbGxlcnMgPSB0aGlzLl9zZXR0aW5ncy5jb250cm9sbGVyc1xuICAgIH1cbiAgfVxuICBzdGFydCgpIHtcbiAgICB2YXIgbG9jYXRpb24gPSB0aGlzLmdldFJvdXRlKClcbiAgICBpZihsb2NhdGlvbiA9PT0gJycpIHtcbiAgICAgIHRoaXMubmF2aWdhdGUoJy8nKVxuICAgIH1lbHNlIHtcbiAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnaGFzaGNoYW5nZScpKVxuICAgIH1cbiAgfVxuICBzZXRSb3V0ZXMocm91dGVzLCBjb250cm9sbGVycykge1xuICAgIGZvcih2YXIgcm91dGUgaW4gcm91dGVzKSB7XG4gICAgICB0aGlzLnJvdXRlc1tyb3V0ZV0gPSBjb250cm9sbGVyc1tyb3V0ZXNbcm91dGVdXVxuICAgIH1cbiAgICByZXR1cm5cbiAgfVxuICBzZXRFdmVudHMoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLmhhc2hDaGFuZ2UuYmluZCh0aGlzKSlcbiAgICByZXR1cm5cbiAgfVxuICBnZXRSb3V0ZSgpIHtcbiAgICByZXR1cm4gU3RyaW5nKHdpbmRvdy5sb2NhdGlvbi5oYXNoKS5zcGxpdCgnIycpLnBvcCgpXG4gIH1cbiAgaGFzaENoYW5nZShldmVudCkge1xuICAgIHZhciByb3V0ZSA9IHRoaXMuZ2V0Um91dGUoKVxuICAgIHRyeSB7XG4gICAgICB0aGlzLnJvdXRlc1tyb3V0ZV0oZXZlbnQpXG4gICAgICB0aGlzLmVtaXQoJ25hdmlnYXRlJywgdGhpcylcbiAgICB9IGNhdGNoKGVycm9yKSB7fVxuICB9XG4gIG5hdmlnYXRlKHBhdGgpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHBhdGhcbiAgfVxufVxuIl19
