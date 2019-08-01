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
    if (!this.connected && (this.target instanceof NodeList && this.target.length || this.target instanceof Node)) {
      this.observer.observe(this.target, this.options);
      this._connected = true;
    }
  }

  disconnect() {
    if (this.connected) {
      this.observer.disconnect();
      this._connected = false;
    }
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
              this.resetUI();
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
    return document.querySelectorAll(this.insert.element).forEach(element => {
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

  resetUI() {
    this.removeUI();
    this.addUI();
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

  enable() {
    var settings = this.settings;

    if (settings && !this.enabled) {
      this.addElement(settings);
      this.addUI(settings);
      this._enabled = true;
    }
  }

  disable() {
    var settings = this.settings;

    if (settings && this.enabled) {
      this.removeUI(settings);
      this.removeElement(settings);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1WQy5qcyIsIkNvbnN0YW50cy5qcyIsIkV2ZW50cy5qcyIsIlRlbXBsYXRlcy5qcyIsIlV0aWxzLmpzIiwiaXMuanMiLCJ0eXBlT2YuanMiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QuanMiLCJvYmplY3RRdWVyeS5qcyIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMuanMiLCJ2YWxpZGF0ZURhdGFTY2hlbWEuanMiLCJDaGFubmVscy5qcyIsIkNoYW5uZWwuanMiLCJCYXNlLmpzIiwiT2JzZXJ2ZXIuanMiLCJTZXJ2aWNlLmpzIiwiTW9kZWwuanMiLCJFbWl0dGVyLmpzIiwiVmlldy5qcyIsIkNvbnRyb2xsZXIuanMiLCJSb3V0ZXIuanMiXSwibmFtZXMiOlsiTVZDIiwiQ29uc3RhbnRzIiwiQ09OU1QiLCJFdmVudHMiLCJFViIsIlRlbXBsYXRlcyIsIk9iamVjdFF1ZXJ5U3RyaW5nRm9ybWF0SW52YWxpZFJvb3QiLCJPYmplY3RRdWVyeVN0cmluZ0Zvcm1hdEludmFsaWQiLCJkYXRhIiwiam9pbiIsIkRhdGFTY2hlbWFNaXNtYXRjaCIsIkRhdGFGdW5jdGlvbkludmFsaWQiLCJEYXRhVW5kZWZpbmVkIiwiU2NoZW1hVW5kZWZpbmVkIiwiVE1QTCIsIlV0aWxzIiwiaXNBcnJheSIsIm9iamVjdCIsIkFycmF5IiwiaXNPYmplY3QiLCJpc0VxdWFsVHlwZSIsInZhbHVlQSIsInZhbHVlQiIsImlzSFRNTEVsZW1lbnQiLCJIVE1MRWxlbWVudCIsInR5cGVPZiIsIl9vYmplY3QiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QiLCJ0YXJnZXRPYmplY3QiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJwcm9wZXJ0aWVzIiwicHJvcGVydHlOYW1lIiwicHJvcGVydHlWYWx1ZSIsIk9iamVjdCIsImVudHJpZXMiLCJvYmplY3RRdWVyeSIsInN0cmluZyIsImNvbnRleHQiLCJzdHJpbmdEYXRhIiwicGFyc2VOb3RhdGlvbiIsInNwbGljZSIsInJlZHVjZSIsImZyYWdtZW50IiwiZnJhZ21lbnRJbmRleCIsImZyYWdtZW50cyIsInBhcnNlRnJhZ21lbnQiLCJwcm9wZXJ0eUtleSIsIm1hdGNoIiwiY29uY2F0IiwiY2hhckF0Iiwic2xpY2UiLCJzcGxpdCIsIlJlZ0V4cCIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMiLCJ0b2dnbGVNZXRob2QiLCJldmVudHMiLCJ0YXJnZXRPYmplY3RzIiwiY2FsbGJhY2tzIiwiZXZlbnRTZXR0aW5ncyIsImV2ZW50Q2FsbGJhY2tOYW1lIiwiZXZlbnREYXRhIiwiZXZlbnRUYXJnZXRTZXR0aW5ncyIsImV2ZW50TmFtZSIsImV2ZW50VGFyZ2V0cyIsImV2ZW50VGFyZ2V0TmFtZSIsImV2ZW50VGFyZ2V0IiwiZXZlbnRNZXRob2ROYW1lIiwiTm9kZUxpc3QiLCJldmVudENhbGxiYWNrIiwiX2V2ZW50VGFyZ2V0IiwiYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyIsInVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzIiwidmFsaWRhdGVEYXRhU2NoZW1hIiwic2NoZW1hIiwiYXJyYXkiLCJjb25zb2xlIiwibG9nIiwibmFtZSIsImFycmF5S2V5IiwiYXJyYXlWYWx1ZSIsInB1c2giLCJvYmplY3RLZXkiLCJvYmplY3RWYWx1ZSIsImNvbnN0cnVjdG9yIiwiX2V2ZW50cyIsImV2ZW50Q2FsbGJhY2tzIiwiZXZlbnRDYWxsYmFja0dyb3VwIiwib24iLCJvZmYiLCJlbWl0IiwiZXZlbnRDYWxsYmFja0dyb3VwTmFtZSIsImFkZGl0aW9uYWxBcmd1bWVudHMiLCJ2YWx1ZXMiLCJDaGFubmVscyIsIl9jaGFubmVscyIsImNoYW5uZWxzIiwiY2hhbm5lbCIsImNoYW5uZWxOYW1lIiwiQ2hhbm5lbCIsIl9yZXNwb25zZXMiLCJyZXNwb25zZXMiLCJyZXNwb25zZSIsInJlc3BvbnNlTmFtZSIsInJlc3BvbnNlQ2FsbGJhY2siLCJyZXF1ZXN0IiwicmVxdWVzdERhdGEiLCJrZXlzIiwiQmFzZSIsInNldHRpbmdzIiwib3B0aW9ucyIsImNvbmZpZ3VyYXRpb24iLCJfY29uZmlndXJhdGlvbiIsIl9vcHRpb25zIiwiX3NldHRpbmdzIiwiT2JzZXJ2ZXIiLCJlbmFibGUiLCJfY29ubmVjdGVkIiwiY29ubmVjdGVkIiwib2JzZXJ2ZXIiLCJfb2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwib2JzZXJ2ZXJDYWxsYmFjayIsImJpbmQiLCJfdGFyZ2V0IiwidGFyZ2V0IiwiX211dGF0aW9ucyIsIm11dGF0aW9ucyIsIm11dGF0aW9uU2V0dGluZ3MiLCJtdXRhdGlvbkNhbGxiYWNrIiwibXV0YXRpb24iLCJtdXRhdGlvbkRhdGEiLCJtdXRhdGlvblRhcmdldCIsInRhcmdldHMiLCJtdXRhdGlvbkV2ZW50TmFtZSIsImNhbGxiYWNrIiwiZW5hYmxlZCIsIl9lbmFibGVkIiwiZGlzYWJsZSIsIm9ic2VydmVlciIsIm11dGF0aW9uUmVjb3JkTGlzdCIsIm11dGF0aW9uUmVjb3JkSW5kZXgiLCJtdXRhdGlvblJlY29yZCIsInR5cGUiLCJtdXRhdGlvblJlY29yZENhdGVnb3JpZXMiLCJtdXRhdGlvblJlY29yZENhdGVnb3J5Iiwibm9kZUluZGV4Iiwibm9kZSIsImZvckVhY2giLCJfbXV0YXRpb24iLCJfbXV0YXRpb25UYXJnZXQiLCJmaWx0ZXIiLCJhdHRyaWJ1dGVOYW1lIiwiY29ubmVjdCIsIk5vZGUiLCJvYnNlcnZlIiwiZGlzY29ubmVjdCIsIlNlcnZpY2UiLCJfZGVmYXVsdHMiLCJkZWZhdWx0cyIsImNvbnRlbnRUeXBlIiwicmVzcG9uc2VUeXBlIiwiX3Jlc3BvbnNlVHlwZXMiLCJfcmVzcG9uc2VUeXBlIiwiX3hociIsImZpbmQiLCJyZXNwb25zZVR5cGVJdGVtIiwiX3R5cGUiLCJfdXJsIiwidXJsIiwiX2hlYWRlcnMiLCJoZWFkZXJzIiwiaGVhZGVyIiwic2V0UmVxdWVzdEhlYWRlciIsInhociIsIlhNTEh0dHBSZXF1ZXN0IiwibmV3WEhSIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzdGF0dXMiLCJhYm9ydCIsIm9wZW4iLCJvbmxvYWQiLCJvbmVycm9yIiwic2VuZCIsIl9kYXRhIiwiTW9kZWwiLCJfaXNTZXR0aW5nIiwiaXNTZXR0aW5nIiwic2V0IiwiX3NjaGVtYSIsIl9oaXN0aW9ncmFtIiwiaGlzdGlvZ3JhbSIsImFzc2lnbiIsIl9oaXN0b3J5IiwiaGlzdG9yeSIsInVuc2hpZnQiLCJwYXJzZSIsIl9kYXRhRXZlbnRzIiwiZGF0YUV2ZW50cyIsIl9kYXRhQ2FsbGJhY2tzIiwiZGF0YUNhbGxiYWNrcyIsImFkZERhdGFFdmVudHMiLCJnZXQiLCJwcm9wZXJ0eSIsIl9hcmd1bWVudHMiLCJpbmRleCIsImtleSIsInZhbHVlIiwic2V0RGF0YVByb3BlcnR5Iiwic2lsZW50IiwidW5zZXQiLCJ1bnNldERhdGFQcm9wZXJ0eSIsImRlZmluZVByb3BlcnRpZXMiLCJjb25maWd1cmFibGUiLCJzZXRWYWx1ZUV2ZW50TmFtZSIsInNldEV2ZW50TmFtZSIsInVuc2V0VmFsdWVFdmVudE5hbWUiLCJ1bnNldEV2ZW50TmFtZSIsInVuc2V0VmFsdWUiLCJKU09OIiwic3RyaW5naWZ5IiwicmVtb3ZlRGF0YUV2ZW50cyIsIkVtaXR0ZXIiLCJfbmFtZSIsImVtaXNzaW9uIiwiVmlldyIsIl9lbGVtZW50TmFtZSIsIl9lbGVtZW50IiwidGFnTmFtZSIsImVsZW1lbnROYW1lIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJlbGVtZW50T2JzZXJ2ZXIiLCJzdWJ0cmVlIiwiY2hpbGRMaXN0IiwiX2F0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJfdWkiLCJ1aSIsInVpS2V5IiwidWlWYWx1ZSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJfdWlFdmVudHMiLCJ1aUV2ZW50cyIsIl91aUNhbGxiYWNrcyIsInVpQ2FsbGJhY2tzIiwiX29ic2VydmVyQ2FsbGJhY2tzIiwib2JzZXJ2ZXJDYWxsYmFja3MiLCJfdWlFbWl0dGVycyIsInVpRW1pdHRlcnMiLCJVSUVtaXR0ZXIiLCJ1aUVtaXR0ZXIiLCJfZWxlbWVudE9ic2VydmVyIiwiZWxlbWVudE9ic2VydmUiLCJyZXNldFVJIiwiX2luc2VydCIsImluc2VydCIsIl90ZW1wbGF0ZXMiLCJ0ZW1wbGF0ZXMiLCJ0ZW1wbGF0ZU5hbWUiLCJ0ZW1wbGF0ZVNldHRpbmdzIiwiYXV0b0luc2VydCIsImluc2VydEFkamFjZW50RWxlbWVudCIsIm1ldGhvZCIsImF1dG9SZW1vdmUiLCJwYXJlbnRFbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJhZGRFbGVtZW50IiwicmVtb3ZlRWxlbWVudCIsInJlbW92ZVVJIiwiYWRkVUkiLCJhZGRVSUV2ZW50cyIsInJlbW92ZVVJRXZlbnRzIiwiQ29udHJvbGxlciIsIl9lbWl0dGVycyIsImVtaXR0ZXJzIiwiX21vZGVsQ2FsbGJhY2tzIiwibW9kZWxDYWxsYmFja3MiLCJfdmlld0NhbGxiYWNrcyIsInZpZXdDYWxsYmFja3MiLCJfY29udHJvbGxlckNhbGxiYWNrcyIsImNvbnRyb2xsZXJDYWxsYmFja3MiLCJfcm91dGVyQ2FsbGJhY2tzIiwicm91dGVyQ2FsbGJhY2tzIiwiX21vZGVscyIsIm1vZGVscyIsIl92aWV3cyIsInZpZXdzIiwiX2NvbnRyb2xsZXJzIiwiY29udHJvbGxlcnMiLCJfcm91dGVycyIsInJvdXRlcnMiLCJfbW9kZWxFdmVudHMiLCJtb2RlbEV2ZW50cyIsIl92aWV3RXZlbnRzIiwidmlld0V2ZW50cyIsIl9jb250cm9sbGVyRXZlbnRzIiwiY29udHJvbGxlckV2ZW50cyIsImFkZE1vZGVsRXZlbnRzIiwicmVtb3ZlTW9kZWxFdmVudHMiLCJ1bmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMiLCJhZGRWaWV3RXZlbnRzIiwicmVtb3ZlVmlld0V2ZW50cyIsImFkZENvbnRyb2xsZXJFdmVudHMiLCJyZW1vdmVDb250cm9sbGVyRXZlbnRzIiwiUm91dGVyIiwiYWRkU2V0dGluZ3MiLCJzZXRSb3V0ZXMiLCJyb3V0ZXMiLCJzZXRFdmVudHMiLCJzdGFydCIsImluaXRpYWxpemUiLCJsb2NhdGlvbiIsImdldFJvdXRlIiwibmF2aWdhdGUiLCJ3aW5kb3ciLCJkaXNwYXRjaEV2ZW50IiwiRXZlbnQiLCJyb3V0ZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJoYXNoQ2hhbmdlIiwiU3RyaW5nIiwiaGFzaCIsInBvcCIsImV2ZW50IiwiZXJyb3IiLCJwYXRoIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxHQUFHLEdBQUdBLEdBQUcsSUFBSSxFQUFqQjtBQ0FBQSxHQUFHLENBQUNDLFNBQUosR0FBZ0IsRUFBaEI7QUFDQUQsR0FBRyxDQUFDRSxLQUFKLEdBQVlGLEdBQUcsQ0FBQ0MsU0FBaEI7QUNEQUQsR0FBRyxDQUFDQyxTQUFKLENBQWNFLE1BQWQsR0FBdUIsRUFBdkI7QUFDQUgsR0FBRyxDQUFDRSxLQUFKLENBQVVFLEVBQVYsR0FBZUosR0FBRyxDQUFDQyxTQUFKLENBQWNFLE1BQTdCO0FDREFILEdBQUcsQ0FBQ0ssU0FBSixHQUFnQjtBQUNkQyxFQUFBQSxrQ0FBa0MsRUFBRSxTQUFTQyw4QkFBVCxDQUF3Q0MsSUFBeEMsRUFBOEM7QUFDaEYsV0FBTyxDQUNMLDBFQURLLEVBRUxDLElBRkssQ0FFQSxJQUZBLENBQVA7QUFHRCxHQUxhO0FBTWRDLEVBQUFBLGtCQUFrQixFQUFFLFNBQVNBLGtCQUFULENBQTRCRixJQUE1QixFQUFrQztBQUNwRCxXQUFPLDZDQUVMQyxJQUZLLENBRUEsSUFGQSxDQUFQO0FBR0QsR0FWYTtBQVdkRSxFQUFBQSxtQkFBbUIsRUFBRSxTQUFTQSxtQkFBVCxDQUE2QkgsSUFBN0IsRUFBbUM7QUFDdEQsNERBRUVDLElBRkYsQ0FFTyxJQUZQO0FBR0QsR0FmYTtBQWdCZEcsRUFBQUEsYUFBYSxFQUFFLFNBQVNBLGFBQVQsQ0FBdUJKLElBQXZCLEVBQTZCO0FBQzFDLHVDQUVFQyxJQUZGLENBRU8sSUFGUDtBQUdELEdBcEJhO0FBcUJkSSxFQUFBQSxlQUFlLEVBQUUsU0FBU0Es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Q3VSLEdBQXhDLEVBQVA7QUFDRDs7QUFDREgsRUFBQUEsVUFBVSxDQUFDSSxLQUFELEVBQVE7QUFDaEIsUUFBSU4sS0FBSyxHQUFHLEtBQUtMLFFBQUwsRUFBWjs7QUFDQSxRQUFJO0FBQ0YsV0FBS0wsTUFBTCxDQUFZVSxLQUFaLEVBQW1CTSxLQUFuQjtBQUNBLFdBQUtsUCxJQUFMLENBQVUsVUFBVixFQUFzQixJQUF0QjtBQUNELEtBSEQsQ0FHRSxPQUFNbVAsS0FBTixFQUFhLENBQUU7QUFDbEI7O0FBQ0RYLEVBQUFBLFFBQVEsQ0FBQ1ksSUFBRCxFQUFPO0FBQ2JYLElBQUFBLE1BQU0sQ0FBQ0gsUUFBUCxDQUFnQlUsSUFBaEIsR0FBdUJJLElBQXZCO0FBQ0Q7O0FBN0NpQyxDQUFwQyIsImZpbGUiOiJicm93c2VyL212Yy1mcmFtZXdvcmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTVZDID0gTVZDIHx8IHt9XHJcbiIsIk1WQy5Db25zdGFudHMgPSB7fVxuTVZDLkNPTlNUID0gTVZDLkNvbnN0YW50c1xuIiwiTVZDLkV2ZW50cyA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9ldmVudHMoKSB7XHJcbiAgICB0aGlzLmV2ZW50cyA9ICh0aGlzLmV2ZW50cylcclxuICAgICAgPyB0aGlzLmV2ZW50c1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5ldmVudHNcclxuICB9XHJcbiAgZXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKSB7IHJldHVybiB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSB8fCB7fSB9XHJcbiAgZXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIChldmVudENhbGxiYWNrLm5hbWUubGVuZ3RoKVxyXG4gICAgICA/IGV2ZW50Q2FsbGJhY2submFtZVxyXG4gICAgICA6ICdhbm9ueW1vdXNGdW5jdGlvbidcclxuICB9XHJcbiAgZXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSkge1xyXG4gICAgcmV0dXJuIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSB8fCBbXVxyXG4gIH1cclxuICBvbihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IHRoaXMuZXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tOYW1lID0gdGhpcy5ldmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tHcm91cCA9IHRoaXMuZXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSlcclxuICAgIGV2ZW50Q2FsbGJhY2tHcm91cC5wdXNoKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gPSBldmVudENhbGxiYWNrR3JvdXBcclxuICAgIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdID0gZXZlbnRDYWxsYmFja3NcclxuICB9XHJcbiAgb2ZmKCkge1xyXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgICAgY2FzZSAxOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDI6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2tOYW1lID0gdGhpcy5ldmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVtldmVudENhbGxiYWNrTmFtZV1cclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxuICBlbWl0KGV2ZW50TmFtZSwgZXZlbnREYXRhKSB7XHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja3MgPSB0aGlzLmV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSlcclxuICAgIGZvcihsZXQgW2V2ZW50Q2FsbGJhY2tHcm91cE5hbWUsIGV2ZW50Q2FsbGJhY2tHcm91cF0gb2YgT2JqZWN0LmVudHJpZXMoZXZlbnRDYWxsYmFja3MpKSB7XHJcbiAgICAgIGZvcihsZXQgZXZlbnRDYWxsYmFjayBvZiBldmVudENhbGxiYWNrR3JvdXApIHtcclxuICAgICAgICBsZXQgYWRkaXRpb25hbEFyZ3VtZW50cyA9IE9iamVjdC52YWx1ZXMoYXJndW1lbnRzKS5zcGxpY2UoMilcclxuICAgICAgICBldmVudENhbGxiYWNrKGV2ZW50RGF0YSwgLi4uYWRkaXRpb25hbEFyZ3VtZW50cylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJNVkMuVGVtcGxhdGVzID0ge1xyXG4gIE9iamVjdFF1ZXJ5U3RyaW5nRm9ybWF0SW52YWxpZFJvb3Q6IGZ1bmN0aW9uIE9iamVjdFF1ZXJ5U3RyaW5nRm9ybWF0SW52YWxpZChkYXRhKSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAnT2JqZWN0IFF1ZXJ5IFwic3RyaW5nXCIgcHJvcGVydHkgbXVzdCBiZSBmb3JtYXR0ZWQgdG8gZmlyc3QgaW5jbHVkZSBcIltAXVwiLidcclxuICAgIF0uam9pbignXFxuJylcclxuICB9LFxyXG4gIERhdGFTY2hlbWFNaXNtYXRjaDogZnVuY3Rpb24gRGF0YVNjaGVtYU1pc21hdGNoKGRhdGEpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgIGBEYXRhIGFuZCBTY2hlbWEgcHJvcGVydGllcyBkbyBub3QgbWF0Y2guYFxyXG4gICAgXS5qb2luKCdcXG4nKVxyXG4gIH0sXHJcbiAgRGF0YUZ1bmN0aW9uSW52YWxpZDogZnVuY3Rpb24gRGF0YUZ1bmN0aW9uSW52YWxpZChkYXRhKSB7XHJcbiAgICBbXHJcbiAgICAgIGBNb2RlbCBEYXRhIHByb3BlcnR5IHR5cGUgXCJGdW5jdGlvblwiIGlzIG5vdCB2YWxpZC5gXHJcbiAgICBdLmpvaW4oJ1xcbicpXHJcbiAgfSxcclxuICBEYXRhVW5kZWZpbmVkOiBmdW5jdGlvbiBEYXRhVW5kZWZpbmVkKGRhdGEpIHtcclxuICAgIFtcclxuICAgICAgYE1vZGVsIERhdGEgcHJvcGVydHkgdW5kZWZpbmVkLmBcclxuICAgIF0uam9pbignXFxuJylcclxuICB9LFxyXG4gIFNjaGVtYVVuZGVmaW5lZDogZnVuY3Rpb24gU2NoZW1hVW5kZWZpbmVkKGRhdGEpIHtcclxuICAgIFtcclxuICAgICAgYE1vZGVsIFwiU2NoZW1hXCIgdW5kZWZpbmVkLmBcclxuICAgIF0uam9pbignXFxuJylcclxuICB9LFxyXG59XHJcbk1WQy5UTVBMID0gTVZDLlRlbXBsYXRlc1xyXG4iLCJNVkMuVXRpbHMgPSB7fVxyXG4iLCJNVkMuVXRpbHMuaXNBcnJheSA9IGZ1bmN0aW9uIGlzQXJyYXkob2JqZWN0KSB7IHJldHVybiBBcnJheS5pc0FycmF5KG9iamVjdCkgfVxyXG5NVkMuVXRpbHMuaXNPYmplY3QgPSBmdW5jdGlvbiBpc09iamVjdChvYmplY3QpIHtcclxuICByZXR1cm4gKCFBcnJheS5pc0FycmF5KG9iamVjdCkpXHJcbiAgICA/IHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnXHJcbiAgICA6IGZhbHNlXHJcbn1cclxuTVZDLlV0aWxzLmlzRXF1YWxUeXBlID0gZnVuY3Rpb24gaXNFcXVhbFR5cGUodmFsdWVBLCB2YWx1ZUIpIHsgcmV0dXJuIHZhbHVlQSA9PT0gdmFsdWVCIH1cclxuTVZDLlV0aWxzLmlzSFRNTEVsZW1lbnQgPSBmdW5jdGlvbiBpc0hUTUxFbGVtZW50KG9iamVjdCkge1xyXG4gIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxyXG59XHJcbiIsIk1WQy5VdGlscy50eXBlT2YgPSAgZnVuY3Rpb24gdHlwZU9mKGRhdGEpIHtcclxuICBzd2l0Y2godHlwZW9mIGRhdGEpIHtcclxuICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgIGxldCBfb2JqZWN0XHJcbiAgICAgIGlmKE1WQy5VdGlscy5pc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgLy8gQXJyYXlcclxuICAgICAgICByZXR1cm4gJ2FycmF5J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgTVZDLlV0aWxzLmlzT2JqZWN0KGRhdGEpXHJcbiAgICAgICkge1xyXG4gICAgICAgIC8vIE9iamVjdFxyXG4gICAgICAgIHJldHVybiAnb2JqZWN0J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgZGF0YSA9PT0gbnVsbFxyXG4gICAgICApIHtcclxuICAgICAgICAvLyBOdWxsXHJcbiAgICAgICAgcmV0dXJuICdudWxsJ1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBfb2JqZWN0XHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgY2FzZSAnbnVtYmVyJzpcclxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgcmV0dXJuIHR5cGVvZiBkYXRhXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QgPSBmdW5jdGlvbiBhZGRQcm9wZXJ0aWVzVG9PYmplY3QoKSB7XHJcbiAgbGV0IHRhcmdldE9iamVjdFxyXG4gIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICBjYXNlIDI6XHJcbiAgICAgIGxldCBwcm9wZXJ0aWVzID0gYXJndW1lbnRzWzBdXHJcbiAgICAgIHRhcmdldE9iamVjdCA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICBmb3IobGV0IFtwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BlcnRpZXMpKSB7XHJcbiAgICAgICAgdGFyZ2V0T2JqZWN0W3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlXHJcbiAgICAgIH1cclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgMzpcclxuICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICBsZXQgcHJvcGVydHlWYWx1ZSA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICB0YXJnZXRPYmplY3QgPSBhcmd1bWVudHNbMl1cclxuICAgICAgdGFyZ2V0T2JqZWN0W3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIHJldHVybiB0YXJnZXRPYmplY3RcclxufVxyXG4iLCJNVkMuVXRpbHMub2JqZWN0UXVlcnkgPSBmdW5jdGlvbiBvYmplY3RRdWVyeShcclxuICBzdHJpbmcsXHJcbiAgY29udGV4dFxyXG4pIHtcclxuICBsZXQgc3RyaW5nRGF0YSA9IE1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZU5vdGF0aW9uKHN0cmluZylcclxuICBpZihzdHJpbmdEYXRhWzBdID09PSAnQCcpIHN0cmluZ0RhdGEuc3BsaWNlKDAsIDEpXHJcbiAgaWYoIXN0cmluZ0RhdGEubGVuZ3RoKSByZXR1cm4gY29udGV4dFxyXG4gIGNvbnRleHQgPSAoTVZDLlV0aWxzLmlzT2JqZWN0KGNvbnRleHQpKVxyXG4gICAgPyBPYmplY3QuZW50cmllcyhjb250ZXh0KVxyXG4gICAgOiBjb250ZXh0XHJcbiAgcmV0dXJuIHN0cmluZ0RhdGEucmVkdWNlKChvYmplY3QsIGZyYWdtZW50LCBmcmFnbWVudEluZGV4LCBmcmFnbWVudHMpID0+IHtcclxuICAgIGxldCBwcm9wZXJ0aWVzID0gW11cclxuICAgIGZyYWdtZW50ID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlRnJhZ21lbnQoZnJhZ21lbnQpXHJcbiAgICBmb3IobGV0IFtwcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV0gb2Ygb2JqZWN0KSB7XHJcbiAgICAgIGlmKHByb3BlcnR5S2V5Lm1hdGNoKGZyYWdtZW50KSkge1xyXG4gICAgICAgIGlmKGZyYWdtZW50SW5kZXggPT09IGZyYWdtZW50cy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoW1twcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV1dKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoT2JqZWN0LmVudHJpZXMocHJvcGVydHlWYWx1ZSkpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBvYmplY3QgPSBwcm9wZXJ0aWVzXHJcbiAgICByZXR1cm4gb2JqZWN0XHJcbiAgfSwgY29udGV4dClcclxufVxyXG5NVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VOb3RhdGlvbiA9IGZ1bmN0aW9uIHBhcnNlTm90YXRpb24oc3RyaW5nKSB7XHJcbiAgaWYoXHJcbiAgICBzdHJpbmcuY2hhckF0KDApID09PSAnWycgJiZcclxuICAgIHN0cmluZy5jaGFyQXQoc3RyaW5nLmxlbmd0aCAtIDEpID09ICddJ1xyXG4gICkge1xyXG4gICAgc3RyaW5nID0gc3RyaW5nXHJcbiAgICAgIC5zbGljZSgxLCAtMSlcclxuICAgICAgLnNwbGl0KCddWycpXHJcbiAgfSBlbHNlIHtcclxuICAgIHN0cmluZyA9IHN0cmluZ1xyXG4gICAgICAuc3BsaXQoJy4nKVxyXG4gIH1cclxuICByZXR1cm4gc3RyaW5nXHJcbn1cclxuTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlRnJhZ21lbnQgPSBmdW5jdGlvbiBwYXJzZUZyYWdtZW50KGZyYWdtZW50KSB7XHJcbiAgaWYoXHJcbiAgICBmcmFnbWVudC5jaGFyQXQoMCkgPT09ICcvJyAmJlxyXG4gICAgZnJhZ21lbnQuY2hhckF0KGZyYWdtZW50Lmxlbmd0aCAtIDEpID09ICcvJ1xyXG4gICkge1xyXG4gICAgZnJhZ21lbnQgPSBmcmFnbWVudC5zbGljZSgxLCAtMSlcclxuICAgIGZyYWdtZW50ID0gbmV3IFJlZ0V4cChmcmFnbWVudClcclxuICB9XHJcbiAgcmV0dXJuIGZyYWdtZW50XHJcbn1cclxuIiwiTVZDLlV0aWxzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMgPSBmdW5jdGlvbiB0b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKFxyXG4gIHRvZ2dsZU1ldGhvZCxcclxuICBldmVudHMsXHJcbiAgdGFyZ2V0T2JqZWN0cyxcclxuICBjYWxsYmFja3NcclxuKSB7XHJcbiAgZm9yKGxldCBbZXZlbnRTZXR0aW5ncywgZXZlbnRDYWxsYmFja05hbWVdIG9mIE9iamVjdC5lbnRyaWVzKGV2ZW50cykpIHtcclxuICAgIGxldCBldmVudERhdGEgPSBldmVudFNldHRpbmdzLnNwbGl0KCcgJylcclxuICAgIGxldCBldmVudFRhcmdldFNldHRpbmdzID0gZXZlbnREYXRhWzBdXHJcbiAgICBsZXQgZXZlbnROYW1lID0gZXZlbnREYXRhWzFdXHJcbiAgICBsZXQgZXZlbnRUYXJnZXRzID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5KFxyXG4gICAgICBldmVudFRhcmdldFNldHRpbmdzLFxyXG4gICAgICB0YXJnZXRPYmplY3RzXHJcbiAgICApXHJcbiAgICBmb3IobGV0IFtldmVudFRhcmdldE5hbWUsIGV2ZW50VGFyZ2V0XSBvZiBldmVudFRhcmdldHMpIHtcclxuICAgICAgbGV0IGV2ZW50TWV0aG9kTmFtZSA9ICh0b2dnbGVNZXRob2QgPT09ICdvbicpXHJcbiAgICAgID8gKFxyXG4gICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QgfHxcclxuICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XHJcbiAgICAgICkgPyAnYWRkRXZlbnRMaXN0ZW5lcidcclxuICAgICAgICA6ICdvbidcclxuICAgICAgOiAoXHJcbiAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCB8fFxyXG4gICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcclxuICAgICAgKSA/ICdyZW1vdmVFdmVudExpc3RlbmVyJ1xyXG4gICAgICAgIDogJ29mZidcclxuICAgICAgbGV0IGV2ZW50Q2FsbGJhY2sgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkoXHJcbiAgICAgICAgZXZlbnRDYWxsYmFja05hbWUsXHJcbiAgICAgICAgY2FsbGJhY2tzXHJcbiAgICAgIClbMF1bMV1cclxuICAgICAgaWYoZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xyXG4gICAgICAgIGZvcihsZXQgX2V2ZW50VGFyZ2V0IG9mIGV2ZW50VGFyZ2V0KSB7XHJcbiAgICAgICAgICBfZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYoZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCl7XHJcbiAgICAgICAgZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMgPSBmdW5jdGlvbiBiaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKCkge1xyXG4gIHRoaXMudG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cygnb24nLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzID0gZnVuY3Rpb24gdW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMoKSB7XHJcbiAgdGhpcy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKCdvZmYnLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuIiwiTVZDLlV0aWxzLnZhbGlkYXRlRGF0YVNjaGVtYSA9IGZ1bmN0aW9uIHZhbGlkYXRlRGF0YVNjaGVtYShkYXRhLCBzY2hlbWEpIHtcclxuICBpZihzY2hlbWEpIHtcclxuICAgIHN3aXRjaChNVkMuVXRpbHMudHlwZU9mKGRhdGEpKSB7XHJcbiAgICAgIGNhc2UgJ2FycmF5JzpcclxuICAgICAgICBsZXQgYXJyYXkgPSBbXVxyXG4gICAgICAgIHNjaGVtYSA9IChNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSkgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICA/IHNjaGVtYSgpXHJcbiAgICAgICAgICA6IHNjaGVtYVxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgTVZDLlV0aWxzLmlzRXF1YWxUeXBlKFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSksXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2YoYXJyYXkpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhzY2hlbWEubmFtZSlcclxuICAgICAgICAgIGZvcihsZXQgW2FycmF5S2V5LCBhcnJheVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKFxyXG4gICAgICAgICAgICAgIHRoaXMudmFsaWRhdGVEYXRhU2NoZW1hKGFycmF5VmFsdWUpXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycmF5XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgICBsZXQgb2JqZWN0ID0ge31cclxuICAgICAgICBzY2hlbWEgPSAoTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgPyBzY2hlbWEoKVxyXG4gICAgICAgICAgOiBzY2hlbWFcclxuICAgICAgICBpZihcclxuICAgICAgICAgIE1WQy5VdGlscy5pc0VxdWFsVHlwZShcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpLFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKG9iamVjdClcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHNjaGVtYS5uYW1lKVxyXG4gICAgICAgICAgZm9yKGxldCBbb2JqZWN0S2V5LCBvYmplY3RWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGF0YSkpIHtcclxuICAgICAgICAgICAgb2JqZWN0W29iamVjdEtleV0gPSB0aGlzLnZhbGlkYXRlRGF0YVNjaGVtYShvYmplY3RWYWx1ZSwgc2NoZW1hW29iamVjdEtleV0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYmplY3RcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgICBjYXNlICdudW1iZXInOlxyXG4gICAgICBjYXNlICdib29sZWFuJzpcclxuICAgICAgICBzY2hlbWEgPSAoTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgPyBzY2hlbWEoKVxyXG4gICAgICAgICAgOiBzY2hlbWFcclxuICAgICAgICBpZihcclxuICAgICAgICAgIE1WQy5VdGlscy5pc0VxdWFsVHlwZShcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpLFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKGRhdGEpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhzY2hlbWEubmFtZSlcclxuICAgICAgICAgIHJldHVybiBkYXRhXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRocm93IE1WQy5UTVBMXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ251bGwnOlxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgTVZDLlV0aWxzLmlzRXF1YWxUeXBlKFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSksXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2YoZGF0YSlcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIHJldHVybiBkYXRhXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XHJcbiAgICAgICAgdGhyb3cgTVZDLlRNUExcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdmdW5jdGlvbic6XHJcbiAgICAgICAgdGhyb3cgTVZDLlRNUExcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICB0aHJvdyBNVkMuVE1QTFxyXG4gIH1cclxufVxyXG4iLCJNVkMuQ2hhbm5lbHMgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfY2hhbm5lbHMoKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzID0gKHRoaXMuY2hhbm5lbHMpXHJcbiAgICAgID8gdGhpcy5jaGFubmVsc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsc1xyXG4gIH1cclxuICBjaGFubmVsKGNoYW5uZWxOYW1lKSB7XHJcbiAgICB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0gPSAodGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdKVxyXG4gICAgICA/IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA6IG5ldyBNVkMuQ2hhbm5lbHMuQ2hhbm5lbCgpXHJcbiAgICByZXR1cm4gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG4gIG9mZihjaGFubmVsTmFtZSkge1xyXG4gICAgZGVsZXRlIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxufVxyXG4iLCJNVkMuQ2hhbm5lbHMuQ2hhbm5lbCA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9yZXNwb25zZXMoKSB7XHJcbiAgICB0aGlzLnJlc3BvbnNlcyA9ICh0aGlzLnJlc3BvbnNlcylcclxuICAgICAgPyB0aGlzLnJlc3BvbnNlc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZihyZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdID0gcmVzcG9uc2VDYWxsYmFja1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZV1cclxuICAgIH1cclxuICB9XHJcbiAgcmVxdWVzdChyZXNwb25zZU5hbWUsIHJlcXVlc3REYXRhKSB7XHJcbiAgICBpZih0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0ocmVxdWVzdERhdGEpXHJcbiAgICB9XHJcbiAgfVxyXG4gIG9mZihyZXNwb25zZU5hbWUpIHtcclxuICAgIGlmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvcihsZXQgW3Jlc3BvbnNlTmFtZV0gb2YgT2JqZWN0LmtleXModGhpcy5fcmVzcG9uc2VzKSkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIk1WQy5CYXNlID0gY2xhc3MgZXh0ZW5kcyBNVkMuRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncywgb3B0aW9ucywgY29uZmlndXJhdGlvbikge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgaWYoY29uZmlndXJhdGlvbikgdGhpcy5fY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb25cclxuICAgIGlmKG9wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSBvcHRpb25zXHJcbiAgICBpZihzZXR0aW5ncykgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gIH1cclxuICBnZXQgX2NvbmZpZ3VyYXRpb24oKSB7XHJcbiAgICB0aGlzLmNvbmZpZ3VyYXRpb24gPSAodGhpcy5jb25maWd1cmF0aW9uKVxyXG4gICAgICA/IHRoaXMuY29uZmlndXJhdGlvblxyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uXHJcbiAgfVxyXG4gIHNldCBfY29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSB7IHRoaXMuY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb24gfVxyXG4gIGdldCBfb3B0aW9ucygpIHtcclxuICAgIHRoaXMub3B0aW9ucyA9ICh0aGlzLm9wdGlvbnMpXHJcbiAgICAgID8gdGhpcy5vcHRpb25zXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLm9wdGlvbnNcclxuICB9XHJcbiAgc2V0IF9vcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB9XHJcbiAgZ2V0IF9zZXR0aW5ncygpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSAodGhpcy5zZXR0aW5ncylcclxuICAgICAgPyB0aGlzLnNldHRpbmdzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLnNldHRpbmdzXHJcbiAgfVxyXG4gIHNldCBfc2V0dGluZ3Moc2V0dGluZ3MpIHsgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzIH1cclxufVxyXG4iLCJNVkMuT2JzZXJ2ZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICAgIHRoaXMuZW5hYmxlKClcclxuICB9XHJcbiAgZ2V0IF9jb25uZWN0ZWQoKSB7IHJldHVybiB0aGlzLmNvbm5lY3RlZCB8fCBmYWxzZSB9XHJcbiAgc2V0IF9jb25uZWN0ZWQoY29ubmVjdGVkKSB7IHRoaXMuY29ubmVjdGVkID0gY29ubmVjdGVkIH1cclxuICBnZXQgb2JzZXJ2ZXIoKSB7XHJcbiAgICB0aGlzLl9vYnNlcnZlciA9ICh0aGlzLl9vYnNlcnZlcilcclxuICAgICAgPyB0aGlzLl9vYnNlcnZlclxyXG4gICAgICA6IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMub2JzZXJ2ZXJDYWxsYmFjay5iaW5kKHRoaXMpKVxyXG4gICAgcmV0dXJuIHRoaXMuX29ic2VydmVyXHJcbiAgfVxyXG4gIGdldCBfdGFyZ2V0KCkgeyByZXR1cm4gdGhpcy50YXJnZXQgfVxyXG4gIHNldCBfdGFyZ2V0KHRhcmdldCkgeyB0aGlzLnRhcmdldCA9IHRhcmdldCB9XHJcbiAgZ2V0IF9vcHRpb25zKCkgeyByZXR1cm4gdGhpcy5vcHRpb25zIH1cclxuICBzZXQgX29wdGlvbnMob3B0aW9ucykge1xyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xyXG4gIH1cclxuICBnZXQgX211dGF0aW9ucygpIHtcclxuICAgIHRoaXMubXV0YXRpb25zID0gKHRoaXMubXV0YXRpb25zKVxyXG4gICAgICA/IHRoaXMubXV0YXRpb25zXHJcbiAgICAgIDogW11cclxuICAgIHJldHVybiB0aGlzLm11dGF0aW9uc1xyXG4gIH1cclxuICBzZXQgX211dGF0aW9ucyhtdXRhdGlvbnMpIHtcclxuICAgIGZvcihsZXQgW211dGF0aW9uU2V0dGluZ3MsIG11dGF0aW9uQ2FsbGJhY2tdIG9mIE9iamVjdC5lbnRyaWVzKG11dGF0aW9ucy5zZXR0aW5ncykpIHtcclxuICAgICAgbGV0IG11dGF0aW9uXHJcbiAgICAgIGxldCBtdXRhdGlvbkRhdGEgPSBtdXRhdGlvblNldHRpbmdzLnNwbGl0KCcgJylcclxuICAgICAgbGV0IG11dGF0aW9uVGFyZ2V0ID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5KG11dGF0aW9uRGF0YVswXSwgbXV0YXRpb25zLnRhcmdldHMpWzBdWzFdXHJcbiAgICAgIGxldCBtdXRhdGlvbkV2ZW50TmFtZSA9IG11dGF0aW9uRGF0YVsxXVxyXG4gICAgICBtdXRhdGlvbkNhbGxiYWNrID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5KG11dGF0aW9uQ2FsbGJhY2ssIG11dGF0aW9ucy5jYWxsYmFja3MpWzBdWzFdXHJcbiAgICAgIG11dGF0aW9uID0ge1xyXG4gICAgICAgIHRhcmdldDogbXV0YXRpb25UYXJnZXQsXHJcbiAgICAgICAgbmFtZTogbXV0YXRpb25FdmVudE5hbWUsXHJcbiAgICAgICAgY2FsbGJhY2s6IG11dGF0aW9uQ2FsbGJhY2ssXHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5fbXV0YXRpb25zLnB1c2gobXV0YXRpb24pXHJcbiAgICB9XHJcbiAgfVxyXG4gIGVuYWJsZSgpIHtcclxuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcclxuICAgIGlmKFxyXG4gICAgICBzZXR0aW5ncyAmJlxyXG4gICAgICAhdGhpcy5lbmFibGVkXHJcbiAgICApIHtcclxuICAgICAgaWYoc2V0dGluZ3MudGFyZ2V0KSB0aGlzLl90YXJnZXQgPSAoc2V0dGluZ3MudGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QpXHJcbiAgICAgICAgPyBzZXR0aW5ncy50YXJnZXRbMF1cclxuICAgICAgICA6IHNldHRpbmdzLnRhcmdldFxyXG4gICAgICBpZihzZXR0aW5ncy5vcHRpb25zKSB0aGlzLl9vcHRpb25zID0gc2V0dGluZ3Mub3B0aW9uc1xyXG4gICAgICBpZihzZXR0aW5ncy5tdXRhdGlvbnMpIHRoaXMuX211dGF0aW9ucyA9IHNldHRpbmdzLm11dGF0aW9uc1xyXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxyXG4gICAgfVxyXG4gIH1cclxuICBkaXNhYmxlKCkge1xyXG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xyXG4gICAgaWYoXHJcbiAgICAgIHNldHRpbmdzICYmXHJcbiAgICAgIHRoaXMuZW5hYmxlZFxyXG4gICAgKSB7XHJcbiAgICAgIGlmKHRoaXMudGFyZ2V0KSBkZWxldGUgdGhpcy50YXJnZXRcclxuICAgICAgaWYodGhpcy5vcHRpb25zKSBkZWxldGUgdGhpcy5vcHRpb25zXHJcbiAgICAgIGlmKHRoaXMubXV0YXRpb25zKSBkZWxldGUgdGhpcy5tdXRhdGlvbnNcclxuICAgICAgaWYodGhpcy5vYnNlcnZlZXIpIGRlbGV0ZSB0aGlzLm9ic2VydmVyXHJcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxyXG4gICAgfVxyXG4gIH1cclxuICBvYnNlcnZlckNhbGxiYWNrKG11dGF0aW9uUmVjb3JkTGlzdCwgb2JzZXJ2ZXIpIHtcclxuICAgIGZvcihsZXQgW211dGF0aW9uUmVjb3JkSW5kZXgsIG11dGF0aW9uUmVjb3JkXSBvZiBPYmplY3QuZW50cmllcyhtdXRhdGlvblJlY29yZExpc3QpKSB7XHJcbiAgICAgIHN3aXRjaChtdXRhdGlvblJlY29yZC50eXBlKSB7XHJcbiAgICAgICAgY2FzZSAnY2hpbGRMaXN0JzpcclxuICAgICAgICAgIGxldCBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMgPSBbJ2FkZGVkTm9kZXMnLCAncmVtb3ZlZE5vZGVzJ11cclxuICAgICAgICAgIGZvcihsZXQgbXV0YXRpb25SZWNvcmRDYXRlZ29yeSBvZiBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMpIHtcclxuICAgICAgICAgICAgaWYobXV0YXRpb25SZWNvcmRbbXV0YXRpb25SZWNvcmRDYXRlZ29yeV0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgZm9yKGxldCBbbm9kZUluZGV4LCBub2RlXSBvZiBPYmplY3QuZW50cmllcyhtdXRhdGlvblJlY29yZFttdXRhdGlvblJlY29yZENhdGVnb3J5XSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubXV0YXRpb25zLmZvckVhY2goKF9tdXRhdGlvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBpZihtdXRhdGlvblJlY29yZENhdGVnb3J5Lm1hdGNoKG5ldyBSZWdFeHAoJ14nLmNvbmNhdChfbXV0YXRpb24ubmFtZSkpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKF9tdXRhdGlvbi50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgaWYoX211dGF0aW9uLnRhcmdldCA9PT0gbm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfbXV0YXRpb24uY2FsbGJhY2soe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG11dGF0aW9uOiBfbXV0YXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbXV0YXRpb25SZWNvcmQ6IG11dGF0aW9uUmVjb3JkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKF9tdXRhdGlvbi50YXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBfbXV0YXRpb25UYXJnZXQgb2YgX211dGF0aW9uLnRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihfbXV0YXRpb25UYXJnZXQgPT09IG5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBfbXV0YXRpb25UYXJnZXQuY2FsbGJhY2soe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXV0YXRpb246IF9tdXRhdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG11dGF0aW9uUmVjb3JkOiBtdXRhdGlvblJlY29yZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgJ2F0dHJpYnV0ZXMnOlxyXG4gICAgICAgICAgbGV0IG11dGF0aW9uID0gdGhpcy5tdXRhdGlvbnMuZmlsdGVyKChfbXV0YXRpb24pID0+IChcclxuICAgICAgICAgICAgX211dGF0aW9uLm5hbWUgPT09IG11dGF0aW9uUmVjb3JkLnR5cGUgJiZcclxuICAgICAgICAgICAgX211dGF0aW9uLmRhdGEgPT09IG11dGF0aW9uUmVjb3JkLmF0dHJpYnV0ZU5hbWVcclxuICAgICAgICAgICkpWzBdXHJcbiAgICAgICAgICBpZihtdXRhdGlvbikge1xyXG4gICAgICAgICAgICBtdXRhdGlvbi5jYWxsYmFjayh7XHJcbiAgICAgICAgICAgICAgbXV0YXRpb246IG11dGF0aW9uLFxyXG4gICAgICAgICAgICAgIG11dGF0aW9uUmVjb3JkOiBtdXRhdGlvblJlY29yZCxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgY29ubmVjdCgpIHtcclxuICAgIGlmKFxyXG4gICAgICAhdGhpcy5jb25uZWN0ZWQgJiZcclxuICAgICAgKFxyXG4gICAgICAgIChcclxuICAgICAgICAgIHRoaXMudGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QgJiZcclxuICAgICAgICAgIHRoaXMudGFyZ2V0Lmxlbmd0aFxyXG4gICAgICAgICkgfHxcclxuICAgICAgICAoXHJcbiAgICAgICAgICB0aGlzLnRhcmdldCBpbnN0YW5jZW9mIE5vZGVcclxuICAgICAgICApXHJcbiAgICAgIClcclxuICAgICkge1xyXG4gICAgICB0aGlzLm9ic2VydmVyLm9ic2VydmUodGhpcy50YXJnZXQsIHRoaXMub3B0aW9ucylcclxuICAgICAgdGhpcy5fY29ubmVjdGVkID0gdHJ1ZVxyXG4gICAgfVxyXG4gIH1cclxuICBkaXNjb25uZWN0KCkge1xyXG4gICAgaWYoXHJcbiAgICAgIHRoaXMuY29ubmVjdGVkXHJcbiAgICApIHtcclxuICAgICAgdGhpcy5vYnNlcnZlci5kaXNjb25uZWN0KClcclxuICAgICAgdGhpcy5fY29ubmVjdGVkID0gZmFsc2VcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiTVZDLlNlcnZpY2UgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICAgIHRoaXMuZW5hYmxlKClcbiAgfVxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5kZWZhdWx0cyB8fCB7XG4gICAgY29udGVudFR5cGU6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSxcbiAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgfSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlcygpIHsgcmV0dXJuIFsnJywgJ2FycmF5YnVmZmVyJywgJ2Jsb2InLCAnZG9jdW1lbnQnLCAnanNvbicsICd0ZXh0J10gfVxuICBnZXQgX3Jlc3BvbnNlVHlwZSgpIHsgcmV0dXJuIHRoaXMucmVzcG9uc2VUeXBlIH1cbiAgc2V0IF9yZXNwb25zZVR5cGUocmVzcG9uc2VUeXBlKSB7XG4gICAgdGhpcy5feGhyLnJlc3BvbnNlVHlwZSA9IHRoaXMuX3Jlc3BvbnNlVHlwZXMuZmluZChcbiAgICAgIChyZXNwb25zZVR5cGVJdGVtKSA9PiByZXNwb25zZVR5cGVJdGVtID09PSByZXNwb25zZVR5cGVcbiAgICApIHx8IHRoaXMuX2RlZmF1bHRzLnJlc3BvbnNlVHlwZVxuICB9XG4gIGdldCBfdHlwZSgpIHsgcmV0dXJuIHRoaXMudHlwZSB9XG4gIHNldCBfdHlwZSh0eXBlKSB7IHRoaXMudHlwZSA9IHR5cGUgfVxuICBnZXQgX3VybCgpIHsgcmV0dXJuIHRoaXMudXJsIH1cbiAgc2V0IF91cmwodXJsKSB7IHRoaXMudXJsID0gdXJsIH1cbiAgZ2V0IF9oZWFkZXJzKCkgeyByZXR1cm4gdGhpcy5oZWFkZXJzIHx8IFtdIH1cbiAgc2V0IF9oZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLl9oZWFkZXJzLmxlbmd0aCA9IDBcbiAgICBmb3IobGV0IGhlYWRlciBvZiBoZWFkZXJzKSB7XG4gICAgICB0aGlzLl94aHIuc2V0UmVxdWVzdEhlYWRlcih7aGVhZGVyfVswXSwge2hlYWRlcn1bMV0pXG4gICAgICB0aGlzLl9oZWFkZXJzLnB1c2goaGVhZGVyKVxuICAgIH1cbiAgfVxuICBnZXQgX3hocigpIHtcbiAgICB0aGlzLnhociA9ICh0aGlzLnhocilcbiAgICAgID8gdGhpcy54aHJcbiAgICAgIDogbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICByZXR1cm4gdGhpcy54aHJcbiAgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgbmV3WEhSKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZih0aGlzLl94aHIuc3RhdHVzID09PSAyMDApIHRoaXMuX3hoci5hYm9ydCgpXG4gICAgICB0aGlzLl94aHIub3Blbih0aGlzLl90eXBlLCB0aGlzLl91cmwpXG4gICAgICB0aGlzLl94aHIub25sb2FkID0gcmVzb2x2ZVxuICAgICAgdGhpcy5feGhyLm9uZXJyb3IgPSByZWplY3RcbiAgICAgIHRoaXMuX3hoci5zZW5kKHRoaXMuX2RhdGEpXG4gICAgfSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKHNldHRpbmdzLnR5cGUpIHRoaXMuX3R5cGUgPSBzZXR0aW5ncy50eXBlXG4gICAgICBpZihzZXR0aW5ncy51cmwpIHRoaXMuX3VybCA9IHNldHRpbmdzLnVybFxuICAgICAgaWYoc2V0dGluZ3MuZGF0YSkgdGhpcy5fZGF0YSA9IHNldHRpbmdzLmRhdGEgfHwgbnVsbFxuICAgICAgaWYoc2V0dGluZ3MuaGVhZGVycykgdGhpcy5faGVhZGVycyA9IHNldHRpbmdzLmhlYWRlcnMgfHwgW3RoaXMuX2RlZmF1bHRzLmNvbnRlbnRUeXBlXVxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5yZXNwb25zZVR5cGUpIHRoaXMuX3Jlc3BvbnNlVHlwZSA9IHRoaXMuX3NldHRpbmdzLnJlc3BvbnNlVHlwZVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBpZihPYmplY3Qua2V5cyh0aGlzLnNldHRpbmdzKS5sZW5ndGgpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLnNldHRpbmdzLnR5cGVcbiAgICAgIGRlbGV0ZSB0aGlzLnNldHRpbmdzLnVybFxuICAgICAgZGVsZXRlIHRoaXMuc2V0dGluZ3MuZGF0YVxuICAgICAgZGVsZXRlIHRoaXMuc2V0dGluZ3MuaGVhZGVyc1xuICAgICAgZGVsZXRlIHRoaXMuc2V0dGluZ3MucmVzcG9uc2VUeXBlXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuIiwiTVZDLk1vZGVsID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgICB0aGlzLmVuYWJsZSgpXG4gIH1cbiAgZ2V0IF9pc1NldHRpbmcoKSB7IHJldHVybiB0aGlzLmlzU2V0dGluZyB9XG4gIHNldCBfaXNTZXR0aW5nKGlzU2V0dGluZykgeyB0aGlzLmlzU2V0dGluZyA9IGlzU2V0dGluZyB9XG4gIGdldCBfZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLl9kZWZhdWx0cyB9XG4gIHNldCBfZGVmYXVsdHMoZGVmYXVsdHMpIHtcbiAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHNcbiAgICB0aGlzLnNldCh0aGlzLmRlZmF1bHRzKVxuICB9XG4gIGdldCBfc2NoZW1hKCkgeyByZXR1cm4gdGhpcy5fc2NoZW1hIH1cbiAgc2V0IF9zY2hlbWEoc2NoZW1hKSB7IHRoaXMuc2NoZW1hID0gc2NoZW1hIH1cbiAgZ2V0IF9oaXN0aW9ncmFtKCkgeyByZXR1cm4gdGhpcy5oaXN0aW9ncmFtIHx8IHtcbiAgICBsZW5ndGg6IDFcbiAgfSB9XG4gIHNldCBfaGlzdGlvZ3JhbShoaXN0aW9ncmFtKSB7XG4gICAgdGhpcy5oaXN0aW9ncmFtID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHRoaXMuX2hpc3Rpb2dyYW0sXG4gICAgICBoaXN0aW9ncmFtXG4gICAgKVxuICB9XG4gIGdldCBfaGlzdG9yeSgpIHtcbiAgICB0aGlzLmhpc3RvcnkgPSAodGhpcy5oaXN0b3J5KVxuICAgICAgPyB0aGlzLmhpc3RvcnlcbiAgICAgIDogW11cbiAgICByZXR1cm4gdGhpcy5oaXN0b3J5XG4gIH1cbiAgc2V0IF9oaXN0b3J5KGRhdGEpIHtcbiAgICBpZihcbiAgICAgIE9iamVjdC5rZXlzKGRhdGEpLmxlbmd0aFxuICAgICkge1xuICAgICAgaWYodGhpcy5faGlzdGlvZ3JhbS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS51bnNoaWZ0KHRoaXMucGFyc2UoZGF0YSkpXG4gICAgICAgIHRoaXMuX2hpc3Rvcnkuc3BsaWNlKHRoaXMuX2hpc3Rpb2dyYW0ubGVuZ3RoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgX2RhdGEoKSB7XG4gICAgdGhpcy5kYXRhID0gICh0aGlzLmRhdGEpXG4gICAgICA/IHRoaXMuZGF0YVxuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmRhdGFcbiAgfVxuICBnZXQgX2RhdGFFdmVudHMoKSB7XG4gICAgdGhpcy5kYXRhRXZlbnRzID0gKHRoaXMuZGF0YUV2ZW50cylcbiAgICAgID8gdGhpcy5kYXRhRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YUV2ZW50c1xuICB9XG4gIHNldCBfZGF0YUV2ZW50cyhkYXRhRXZlbnRzKSB7XG4gICAgdGhpcy5kYXRhRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGRhdGFFdmVudHMsIHRoaXMuX2RhdGFFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9kYXRhQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuZGF0YUNhbGxiYWNrcyA9ICh0aGlzLmRhdGFDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuZGF0YUNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmRhdGFDYWxsYmFja3NcbiAgfVxuICBzZXQgX2RhdGFDYWxsYmFja3MoZGF0YUNhbGxiYWNrcykge1xuICAgIHRoaXMuZGF0YUNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBkYXRhQ2FsbGJhY2tzLCB0aGlzLl9kYXRhQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICBhZGREYXRhRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuZGF0YUV2ZW50cywgdGhpcywgdGhpcy5kYXRhQ2FsbGJhY2tzKVxuICB9XG4gIGdldCgpIHtcbiAgICBsZXQgcHJvcGVydHkgPSBhcmd1bWVudHNbMF1cbiAgICByZXR1cm4gdGhpcy5fZGF0YVsnXycuY29uY2F0KHByb3BlcnR5KV1cbiAgfVxuICBzZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBpZihpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5faXNTZXR0aW5nID0gdHJ1ZVxuICAgICAgICAgIH0gZWxzZSBpZihpbmRleCA9PT0gKF9hcmd1bWVudHMubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2lzU2V0dGluZyA9IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDM6XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHZhciBzaWxlbnQgPSBhcmd1bWVudHNbMl1cbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICB1bnNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5fZGF0YSkpIHtcbiAgICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBzZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KSB7XG4gICAgaWYoIXRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXSkge1xuICAgICAgbGV0IGNvbnRleHQgPSB0aGlzXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhcbiAgICAgICAgdGhpcy5fZGF0YSxcbiAgICAgICAge1xuICAgICAgICAgIFsnXycuY29uY2F0KGtleSldOiB7XG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzW2tleV0gfSxcbiAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICAhc2lsZW50ICYmXG4gICAgICAgICAgICAgICAgIWNvbnRleHQuX2lzU2V0dGluZ1xuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBsZXQgc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3NldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgICAgICAgICAgICAgIGxldCBzZXRFdmVudE5hbWUgPSAnc2V0J1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICAgIHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBzZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gICAgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldID0gdmFsdWVcbiAgfVxuICB1bnNldERhdGFQcm9wZXJ0eShrZXkpIHtcbiAgICBsZXQgdW5zZXRWYWx1ZUV2ZW50TmFtZSA9IFsndW5zZXQnLCAnOicsIGtleV0uam9pbignJylcbiAgICBsZXQgdW5zZXRFdmVudE5hbWUgPSAndW5zZXQnXG4gICAgbGV0IHVuc2V0VmFsdWUgPSB0aGlzLl9kYXRhW2tleV1cbiAgICBkZWxldGUgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldXG4gICAgZGVsZXRlIHRoaXMuX2RhdGFba2V5XVxuICAgIHRoaXMuZW1pdChcbiAgICAgIHVuc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IHVuc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIClcbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldEV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIClcbiAgfVxuICBwYXJzZShkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5fZGF0YVxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KE9iamVjdC5hc3NpZ24oe30sIGRhdGEpKSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuaGlzdGlvZ3JhbSkgdGhpcy5faGlzdGlvZ3JhbSA9IHRoaXMuc2V0dGluZ3MuaGlzdGlvZ3JhbVxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5kYXRhKSB0aGlzLnNldCh0aGlzLnNldHRpbmdzLmRhdGEpXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRhdGFDYWxsYmFja3MpIHRoaXMuX2RhdGFDYWxsYmFja3MgPSB0aGlzLnNldHRpbmdzLmRhdGFDYWxsYmFja3NcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGF0YUV2ZW50cykgdGhpcy5fZGF0YUV2ZW50cyA9IHRoaXMuc2V0dGluZ3MuZGF0YUV2ZW50c1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5zY2hlbWEpIHRoaXMuX3NjaGVtYSA9IHRoaXMuc2V0dGluZ3Muc2NoZW1hXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRlZmF1bHRzKSB0aGlzLl9kZWZhdWx0cyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHNcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmRhdGFFdmVudHMgJiZcbiAgICAgICAgdGhpcy5kYXRhQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5hZGREYXRhRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgfVxuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmRhdGFFdmVudHMgJiZcbiAgICAgICAgdGhpcy5kYXRhQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5yZW1vdmVEYXRhRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSB0aGlzLl9oaXN0aW9ncmFtXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YVxuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhRXZlbnRzXG4gICAgICBkZWxldGUgdGhpcy5fc2NoZW1hXG4gICAgICBkZWxldGUgdGhpcy5fZGVmYXVsdHNcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgfVxufVxuIiwiTVZDLkVtaXR0ZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5Nb2RlbCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgICBpZih0aGlzLnNldHRpbmdzKSB7XHJcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MubmFtZSkgdGhpcy5fbmFtZSA9IHRoaXMuc2V0dGluZ3MubmFtZVxyXG4gICAgfVxyXG4gIH1cclxuICBnZXQgX25hbWUoKSB7IHJldHVybiB0aGlzLm5hbWUgfVxyXG4gIHNldCBfbmFtZShuYW1lKSB7IHRoaXMubmFtZSA9IG5hbWUgfVxyXG4gIGdldCBlbWlzc2lvbigpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5hbWU6IHRoaXMuX25hbWUsXHJcbiAgICAgIGRhdGE6IHRoaXMucGFyc2UoKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJNVkMuVmlldyA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gICAgdGhpcy5lbmFibGUoKVxuICB9XG4gIGdldCBfZWxlbWVudE5hbWUoKSB7IHJldHVybiB0aGlzLl9lbGVtZW50LnRhZ05hbWUgfVxuICBzZXQgX2VsZW1lbnROYW1lKGVsZW1lbnROYW1lKSB7XG4gICAgaWYoIXRoaXMuX2VsZW1lbnQpIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnROYW1lKVxuICB9XG4gIGdldCBfZWxlbWVudCgpIHsgcmV0dXJuIHRoaXMuZWxlbWVudCB9XG4gIHNldCBfZWxlbWVudChlbGVtZW50KSB7XG4gICAgaWYoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgfSBlbHNlIGlmKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50KVxuICAgIH1cbiAgICB0aGlzLmVsZW1lbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudCwge1xuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICB9KVxuICB9XG4gIGdldCBfYXR0cmlidXRlcygpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQuYXR0cmlidXRlcyB9XG4gIHNldCBfYXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgZm9yKGxldCBbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGVWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlS2V5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IF91aSgpIHtcbiAgICB0aGlzLnVpID0gKHRoaXMudWkpXG4gICAgICA/IHRoaXMudWlcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy51aVxuICB9XG4gIHNldCBfdWkodWkpIHtcbiAgICBpZighdGhpcy5fdWlbJyRlbGVtZW50J10pIHRoaXMuX3VpWyckZWxlbWVudCddID0gdGhpcy5lbGVtZW50XG4gICAgZm9yKGxldCBbdWlLZXksIHVpVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHVpKSkge1xuICAgICAgaWYodWlWYWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuX3VpW3VpS2V5XSA9IHVpVmFsdWVcbiAgICAgIH0gZWxzZSBpZih0eXBlb2YgdWlWYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fdWlbdWlLZXldID0gdGhpcy5fZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHVpVmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfdWlFdmVudHMoKSB7IHJldHVybiB0aGlzLnVpRXZlbnRzIH1cbiAgc2V0IF91aUV2ZW50cyh1aUV2ZW50cykgeyB0aGlzLnVpRXZlbnRzID0gdWlFdmVudHMgfVxuICBnZXQgX3VpQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMudWlDYWxsYmFja3MgPSAodGhpcy51aUNhbGxiYWNrcylcbiAgICAgID8gdGhpcy51aUNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnVpQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF91aUNhbGxiYWNrcyh1aUNhbGxiYWNrcykge1xuICAgIHRoaXMudWlDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdWlDYWxsYmFja3MsIHRoaXMuX3VpQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfb2JzZXJ2ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5vYnNlcnZlckNhbGxiYWNrcyA9ICh0aGlzLm9ic2VydmVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX29ic2VydmVyQ2FsbGJhY2tzKG9ic2VydmVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5vYnNlcnZlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBvYnNlcnZlckNhbGxiYWNrcywgdGhpcy5fb2JzZXJ2ZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF91aUVtaXR0ZXJzKCkge1xuICAgIHRoaXMudWlFbWl0dGVycyA9ICh0aGlzLnVpRW1pdHRlcnMpXG4gICAgICA/IHRoaXMudWlFbWl0dGVyc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnVpRW1pdHRlcnNcbiAgfVxuICBzZXQgX3VpRW1pdHRlcnModWlFbWl0dGVycykge1xuICAgIGxldCBfdWlFbWl0dGVycyA9IHt9XG4gICAgdWlFbWl0dGVycy5mb3JFYWNoKChVSUVtaXR0ZXIpID0+IHtcbiAgICAgIGxldCB1aUVtaXR0ZXIgPSBuZXcgVUlFbWl0dGVyKClcbiAgICAgIF91aUVtaXR0ZXJzW3VpRW1pdHRlci5uYW1lXSA9IHVpRW1pdHRlclxuICAgIH0pXG4gICAgdGhpcy51aUVtaXR0ZXJzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIF91aUVtaXR0ZXJzLCB0aGlzLl91aUVtaXR0ZXJzXG4gICAgKVxuICB9XG4gIGdldCBlbGVtZW50T2JzZXJ2ZXIoKSB7XG4gICAgdGhpcy5fZWxlbWVudE9ic2VydmVyID0gKHRoaXMuX2VsZW1lbnRPYnNlcnZlcilcbiAgICAgID8gdGhpcy5fZWxlbWVudE9ic2VydmVyXG4gICAgICA6IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuZWxlbWVudE9ic2VydmUuYmluZCh0aGlzKSlcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudE9ic2VydmVyXG4gIH1cbiAgZWxlbWVudE9ic2VydmUobXV0YXRpb25SZWNvcmRMaXN0LCBvYnNlcnZlcikge1xuICAgIGZvcihsZXQgW211dGF0aW9uUmVjb3JkSW5kZXgsIG11dGF0aW9uUmVjb3JkXSBvZiBPYmplY3QuZW50cmllcyhtdXRhdGlvblJlY29yZExpc3QpKSB7XG4gICAgICBzd2l0Y2gobXV0YXRpb25SZWNvcmQudHlwZSkge1xuICAgICAgICBjYXNlICdjaGlsZExpc3QnOlxuICAgICAgICAgIGxldCBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMgPSBbJ2FkZGVkTm9kZXMnLCAncmVtb3ZlZE5vZGVzJ11cbiAgICAgICAgICBmb3IobGV0IG11dGF0aW9uUmVjb3JkQ2F0ZWdvcnkgb2YgbXV0YXRpb25SZWNvcmRDYXRlZ29yaWVzKSB7XG4gICAgICAgICAgICBpZihtdXRhdGlvblJlY29yZFttdXRhdGlvblJlY29yZENhdGVnb3J5XS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgdGhpcy5yZXNldFVJKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IF9pbnNlcnQoKSB7IHJldHVybiB0aGlzLmluc2VydCB9XG4gIHNldCBfaW5zZXJ0KGluc2VydCkgeyB0aGlzLmluc2VydCA9IGluc2VydCB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICBnZXQgX3RlbXBsYXRlcygpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9ICh0aGlzLnRlbXBsYXRlcylcbiAgICAgID8gdGhpcy50ZW1wbGF0ZXNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZXNcbiAgfVxuICBzZXQgX3RlbXBsYXRlcyh0ZW1wbGF0ZXMpIHtcbiAgICBmb3IobGV0IFt0ZW1wbGF0ZU5hbWUsIHRlbXBsYXRlU2V0dGluZ3NdIG9mIE9iamVjdC5lbnRyaWVzKHRlbXBsYXRlcykpIHtcbiAgICAgIHRoaXMuX3RlbXBsYXRlc1t0ZW1wbGF0ZU5hbWVdID0gdGVtcGxhdGVTZXR0aW5nc1xuICAgIH1cbiAgfVxuICBhdXRvSW5zZXJ0KCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuaW5zZXJ0LmVsZW1lbnQpXG4gICAgICAuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICBlbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCh0aGlzLmluc2VydC5tZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICAgIH0pXG4gIH1cbiAgYXV0b1JlbW92ZSgpIHtcbiAgICBpZihcbiAgICAgIHRoaXMuZWxlbWVudCAmJlxuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnRcbiAgICApIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcbiAgfVxuICBhZGRFbGVtZW50KHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzXG4gICAgaWYoc2V0dGluZ3MuZWxlbWVudE5hbWUpIHRoaXMuX2VsZW1lbnROYW1lID0gc2V0dGluZ3MuZWxlbWVudE5hbWVcbiAgICBpZihzZXR0aW5ncy5lbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gc2V0dGluZ3MuZWxlbWVudFxuICAgIGlmKHNldHRpbmdzLmF0dHJpYnV0ZXMpIHRoaXMuX2F0dHJpYnV0ZXMgPSBzZXR0aW5ncy5hdHRyaWJ1dGVzXG4gICAgaWYoc2V0dGluZ3MudGVtcGxhdGVzKSB0aGlzLl90ZW1wbGF0ZXMgPSBzZXR0aW5ncy50ZW1wbGF0ZXNcbiAgICBpZihzZXR0aW5ncy5pbnNlcnQpIHRoaXMuX2luc2VydCA9IHNldHRpbmdzLmluc2VydFxuICB9XG4gIHJlbW92ZUVsZW1lbnQoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHRoaXMuZWxlbWVudCAmJlxuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnRcbiAgICApIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcbiAgICBpZih0aGlzLmVsZW1lbnQpIGRlbGV0ZSB0aGlzLmVsZW1lbnRcbiAgICBpZih0aGlzLmF0dHJpYnV0ZXMpIGRlbGV0ZSB0aGlzLmF0dHJpYnV0ZXNcbiAgICBpZih0aGlzLnRlbXBsYXRlcykgZGVsZXRlIHRoaXMudGVtcGxhdGVzXG4gICAgaWYodGhpcy5pbnNlcnQpIGRlbGV0ZSB0aGlzLmluc2VydFxuICB9XG4gIHJlc2V0VUkoKSB7XG4gICAgdGhpcy5yZW1vdmVVSSgpXG4gICAgdGhpcy5hZGRVSSgpXG4gIH1cbiAgYWRkVUkoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihzZXR0aW5ncy51aSkgdGhpcy5fdWkgPSBzZXR0aW5ncy51aVxuICAgIGlmKHNldHRpbmdzLnVpRW1pdHRlcnMpIHRoaXMuX3VpRW1pdHRlcnMgPSBzZXR0aW5ncy51aUVtaXR0ZXJzXG4gICAgaWYoc2V0dGluZ3MudWlDYWxsYmFja3MpIHRoaXMuX3VpQ2FsbGJhY2tzID0gc2V0dGluZ3MudWlDYWxsYmFja3NcbiAgICBpZihzZXR0aW5ncy51aUV2ZW50cykge1xuICAgICAgdGhpcy5fdWlFdmVudHMgPSBzZXR0aW5ncy51aUV2ZW50c1xuICAgICAgdGhpcy5hZGRVSUV2ZW50cygpXG4gICAgfVxuICB9XG4gIHJlbW92ZVVJKHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzXG4gICAgaWYoc2V0dGluZ3MudWlFdmVudHMpIHtcbiAgICAgIHRoaXMucmVtb3ZlVUlFdmVudHMoKVxuICAgICAgZGVsZXRlIHRoaXMuX3VpRXZlbnRzXG4gICAgfVxuICAgIGRlbGV0ZSB0aGlzLnVpRXZlbnRzXG4gICAgZGVsZXRlIHRoaXMudWlcbiAgICBkZWxldGUgdGhpcy51aUNhbGxiYWNrc1xuICB9XG4gIGFkZFVJRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy51aUV2ZW50cyAmJlxuICAgICAgdGhpcy51aSAmJlxuICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMoXG4gICAgICAgIHRoaXMudWlFdmVudHMsXG4gICAgICAgIHRoaXMudWksXG4gICAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgcmVtb3ZlVUlFdmVudHMoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLnVpRXZlbnRzICYmXG4gICAgICB0aGlzLnVpICYmXG4gICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgKSB7XG4gICAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMoXG4gICAgICAgIHRoaXMudWlFdmVudHMsXG4gICAgICAgIHRoaXMudWksXG4gICAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLmFkZEVsZW1lbnQoc2V0dGluZ3MpXG4gICAgICB0aGlzLmFkZFVJKHNldHRpbmdzKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLnJlbW92ZVVJKHNldHRpbmdzKVxuICAgICAgdGhpcy5yZW1vdmVFbGVtZW50KHNldHRpbmdzKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICB9XG59XG4iLCJNVkMuQ29udHJvbGxlciA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gICAgdGhpcy5lbmFibGUoKVxuICB9XG4gIGdldCBfZW1pdHRlcnMoKSB7XG4gICAgdGhpcy5lbWl0dGVycyA9ICh0aGlzLmVtaXR0ZXJzKVxuICAgICAgPyB0aGlzLmVtaXR0ZXJzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlcnNcbiAgfVxuICBzZXQgX2VtaXR0ZXJzKGVtaXR0ZXJzKSB7XG4gICAgdGhpcy5lbWl0dGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBlbWl0dGVycywgdGhpcy5fZW1pdHRlcnNcbiAgICApXG4gIH1cbiAgZ2V0IF9tb2RlbENhbGxiYWNrcygpIHtcbiAgICB0aGlzLm1vZGVsQ2FsbGJhY2tzID0gKHRoaXMubW9kZWxDYWxsYmFja3MpXG4gICAgICA/IHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5tb2RlbENhbGxiYWNrc1xuICB9XG4gIHNldCBfbW9kZWxDYWxsYmFja3MobW9kZWxDYWxsYmFja3MpIHtcbiAgICB0aGlzLm1vZGVsQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG1vZGVsQ2FsbGJhY2tzLCB0aGlzLl9tb2RlbENhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX3ZpZXdDYWxsYmFja3MoKSB7XG4gICAgdGhpcy52aWV3Q2FsbGJhY2tzID0gKHRoaXMudmlld0NhbGxiYWNrcylcbiAgICAgID8gdGhpcy52aWV3Q2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudmlld0NhbGxiYWNrc1xuICB9XG4gIHNldCBfdmlld0NhbGxiYWNrcyh2aWV3Q2FsbGJhY2tzKSB7XG4gICAgdGhpcy52aWV3Q2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHZpZXdDYWxsYmFja3MsIHRoaXMuX3ZpZXdDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9jb250cm9sbGVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcyA9ICh0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX2NvbnRyb2xsZXJDYWxsYmFja3MoY29udHJvbGxlckNhbGxiYWNrcykge1xuICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBjb250cm9sbGVyQ2FsbGJhY2tzLCB0aGlzLl9jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfcm91dGVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMucm91dGVyQ2FsbGJhY2tzID0gKHRoaXMucm91dGVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLnJvdXRlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlckNhbGxiYWNrc1xuICB9XG4gIHNldCBfcm91dGVyQ2FsbGJhY2tzKHJvdXRlckNhbGxiYWNrcykge1xuICAgIHRoaXMucm91dGVyQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlckNhbGxiYWNrcywgdGhpcy5fcm91dGVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfbW9kZWxzKCkge1xuICAgIHRoaXMubW9kZWxzID0gKHRoaXMubW9kZWxzKVxuICAgICAgPyB0aGlzLm1vZGVsc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm1vZGVsc1xuICB9XG4gIHNldCBfbW9kZWxzKG1vZGVscykge1xuICAgIHRoaXMubW9kZWxzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG1vZGVscywgdGhpcy5fbW9kZWxzXG4gICAgKVxuICB9XG4gIGdldCBfdmlld3MoKSB7XG4gICAgdGhpcy52aWV3cyA9ICh0aGlzLnZpZXdzKVxuICAgICAgPyB0aGlzLnZpZXdzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudmlld3NcbiAgfVxuICBzZXQgX3ZpZXdzKHZpZXdzKSB7XG4gICAgdGhpcy52aWV3cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB2aWV3cywgdGhpcy5fdmlld3NcbiAgICApXG4gIH1cbiAgZ2V0IF9jb250cm9sbGVycygpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJzID0gKHRoaXMuY29udHJvbGxlcnMpXG4gICAgICA/IHRoaXMuY29udHJvbGxlcnNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyc1xuICB9XG4gIHNldCBfY29udHJvbGxlcnMoY29udHJvbGxlcnMpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGNvbnRyb2xsZXJzLCB0aGlzLl9jb250cm9sbGVyc1xuICAgIClcbiAgfVxuICBnZXQgX3JvdXRlcnMoKSB7XG4gICAgdGhpcy5yb3V0ZXJzID0gKHRoaXMucm91dGVycylcbiAgICAgID8gdGhpcy5yb3V0ZXJzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVyc1xuICB9XG4gIHNldCBfcm91dGVycyhyb3V0ZXJzKSB7XG4gICAgdGhpcy5yb3V0ZXJzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlcnMsIHRoaXMuX3JvdXRlcnNcbiAgICApXG4gIH1cbiAgZ2V0IF9tb2RlbEV2ZW50cygpIHtcbiAgICB0aGlzLm1vZGVsRXZlbnRzID0gKHRoaXMubW9kZWxFdmVudHMpXG4gICAgICA/IHRoaXMubW9kZWxFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5tb2RlbEV2ZW50c1xuICB9XG4gIHNldCBfbW9kZWxFdmVudHMobW9kZWxFdmVudHMpIHtcbiAgICB0aGlzLm1vZGVsRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG1vZGVsRXZlbnRzLCB0aGlzLl9tb2RlbEV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX3ZpZXdFdmVudHMoKSB7XG4gICAgdGhpcy52aWV3RXZlbnRzID0gKHRoaXMudmlld0V2ZW50cylcbiAgICAgID8gdGhpcy52aWV3RXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudmlld0V2ZW50c1xuICB9XG4gIHNldCBfdmlld0V2ZW50cyh2aWV3RXZlbnRzKSB7XG4gICAgdGhpcy52aWV3RXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHZpZXdFdmVudHMsIHRoaXMuX3ZpZXdFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9jb250cm9sbGVyRXZlbnRzKCkge1xuICAgIHRoaXMuY29udHJvbGxlckV2ZW50cyA9ICh0aGlzLmNvbnRyb2xsZXJFdmVudHMpXG4gICAgICA/IHRoaXMuY29udHJvbGxlckV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJFdmVudHNcbiAgfVxuICBzZXQgX2NvbnRyb2xsZXJFdmVudHMoY29udHJvbGxlckV2ZW50cykge1xuICAgIHRoaXMuY29udHJvbGxlckV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBjb250cm9sbGVyRXZlbnRzLCB0aGlzLl9jb250cm9sbGVyRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICBhZGRNb2RlbEV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLm1vZGVsRXZlbnRzLCB0aGlzLm1vZGVscywgdGhpcy5tb2RlbENhbGxiYWNrcylcbiAgfVxuICByZW1vdmVNb2RlbEV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMubW9kZWxFdmVudHMsIHRoaXMubW9kZWxzLCB0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICB9XG4gIGFkZFZpZXdFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy52aWV3RXZlbnRzLCB0aGlzLnZpZXdzLCB0aGlzLnZpZXdDYWxsYmFja3MpXG4gIH1cbiAgcmVtb3ZlVmlld0V2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMudmlld0V2ZW50cywgdGhpcy52aWV3cywgdGhpcy52aWV3Q2FsbGJhY2tzKVxuICB9XG4gIGFkZENvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5jb250cm9sbGVyRXZlbnRzLCB0aGlzLmNvbnRyb2xsZXJzLCB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MpXG4gIH1cbiAgcmVtb3ZlQ29udHJvbGxlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuY29udHJvbGxlckV2ZW50cywgdGhpcy5jb250cm9sbGVycywgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgaWYoc2V0dGluZ3MuZW1pdHRlcnMpIHRoaXMuX2VtaXR0ZXJzID0gc2V0dGluZ3MuZW1pdHRlcnNcbiAgICAgIGlmKHNldHRpbmdzLm1vZGVsQ2FsbGJhY2tzKSB0aGlzLl9tb2RlbENhbGxiYWNrcyA9IHNldHRpbmdzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy52aWV3Q2FsbGJhY2tzKSB0aGlzLl92aWV3Q2FsbGJhY2tzID0gc2V0dGluZ3Mudmlld0NhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3MuY29udHJvbGxlckNhbGxiYWNrcykgdGhpcy5fY29udHJvbGxlckNhbGxiYWNrcyA9IHNldHRpbmdzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLnJvdXRlckNhbGxiYWNrcykgdGhpcy5fcm91dGVyQ2FsbGJhY2tzID0gc2V0dGluZ3Mucm91dGVyQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5tb2RlbHMpIHRoaXMuX21vZGVscyA9IHNldHRpbmdzLm1vZGVsc1xuICAgICAgaWYoc2V0dGluZ3Mudmlld3MpIHRoaXMuX3ZpZXdzID0gc2V0dGluZ3Mudmlld3NcbiAgICAgIGlmKHNldHRpbmdzLmNvbnRyb2xsZXJzKSB0aGlzLl9jb250cm9sbGVycyA9IHNldHRpbmdzLmNvbnRyb2xsZXJzXG4gICAgICBpZihzZXR0aW5ncy5yb3V0ZXJzKSB0aGlzLl9yb3V0ZXJzID0gc2V0dGluZ3Mucm91dGVyc1xuICAgICAgaWYoc2V0dGluZ3MubW9kZWxFdmVudHMpIHRoaXMuX21vZGVsRXZlbnRzID0gc2V0dGluZ3MubW9kZWxFdmVudHNcbiAgICAgIGlmKHNldHRpbmdzLnZpZXdFdmVudHMpIHRoaXMuX3ZpZXdFdmVudHMgPSBzZXR0aW5ncy52aWV3RXZlbnRzXG4gICAgICBpZihzZXR0aW5ncy5jb250cm9sbGVyRXZlbnRzKSB0aGlzLl9jb250cm9sbGVyRXZlbnRzID0gc2V0dGluZ3MuY29udHJvbGxlckV2ZW50c1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMubW9kZWxFdmVudHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbENhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuYWRkTW9kZWxFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMudmlld0V2ZW50cyAmJlxuICAgICAgICB0aGlzLnZpZXdzICYmXG4gICAgICAgIHRoaXMudmlld0NhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuYWRkVmlld0V2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5jb250cm9sbGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5hZGRDb250cm9sbGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgfVxuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgIHRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMubW9kZWxFdmVudHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbENhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTW9kZWxFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMudmlld0V2ZW50cyAmJlxuICAgICAgICB0aGlzLnZpZXdzICYmXG4gICAgICAgIHRoaXMudmlld0NhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlVmlld0V2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5jb250cm9sbGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDb250cm9sbGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSB0aGlzLl9lbWl0dGVyc1xuICAgICAgZGVsZXRlIHRoaXMuX21vZGVsQ2FsbGJhY2tzXG4gICAgICBkZWxldGUgdGhpcy5fdmlld0NhbGxiYWNrc1xuICAgICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9yb3V0ZXJDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9tb2RlbHNcbiAgICAgIGRlbGV0ZSB0aGlzLl92aWV3c1xuICAgICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJzXG4gICAgICBkZWxldGUgdGhpcy5fcm91dGVyc1xuICAgICAgZGVsZXRlIHRoaXMuX21vZGVsRXZlbnRzXG4gICAgICBkZWxldGUgdGhpcy5fdmlld0V2ZW50c1xuICAgICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJFdmVudHNcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgfVxufVxuIiwiTVZDLlJvdXRlciA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gICAgdGhpcy5hZGRTZXR0aW5ncygpXG4gICAgdGhpcy5zZXRSb3V0ZXModGhpcy5yb3V0ZXMsIHRoaXMuY29udHJvbGxlcnMpXG4gICAgdGhpcy5zZXRFdmVudHMoKVxuICAgIHRoaXMuc3RhcnQoKVxuICAgIGlmKHR5cGVvZiB0aGlzLmluaXRpYWxpemUgPT09ICdmdW5jdGlvbicpIHRoaXMuaW5pdGlhbGl6ZSgpXG4gIH1cbiAgYWRkU2V0dGluZ3MoKSB7XG4gICAgaWYodGhpcy5fc2V0dGluZ3MpIHtcbiAgICAgIGlmKHRoaXMuX3NldHRpbmdzLnJvdXRlcykgdGhpcy5yb3V0ZXMgPSB0aGlzLl9zZXR0aW5ncy5yb3V0ZXNcbiAgICAgIGlmKHRoaXMuX3NldHRpbmdzLmNvbnRyb2xsZXJzKSB0aGlzLmNvbnRyb2xsZXJzID0gdGhpcy5fc2V0dGluZ3MuY29udHJvbGxlcnNcbiAgICB9XG4gIH1cbiAgc3RhcnQoKSB7XG4gICAgdmFyIGxvY2F0aW9uID0gdGhpcy5nZXRSb3V0ZSgpXG4gICAgaWYobG9jYXRpb24gPT09ICcnKSB7XG4gICAgICB0aGlzLm5hdmlnYXRlKCcvJylcbiAgICB9ZWxzZSB7XG4gICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2hhc2hjaGFuZ2UnKSlcbiAgICB9XG4gIH1cbiAgc2V0Um91dGVzKHJvdXRlcywgY29udHJvbGxlcnMpIHtcbiAgICBmb3IodmFyIHJvdXRlIGluIHJvdXRlcykge1xuICAgICAgdGhpcy5yb3V0ZXNbcm91dGVdID0gY29udHJvbGxlcnNbcm91dGVzW3JvdXRlXV1cbiAgICB9XG4gICAgcmV0dXJuXG4gIH1cbiAgc2V0RXZlbnRzKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgdGhpcy5oYXNoQ2hhbmdlLmJpbmQodGhpcykpXG4gICAgcmV0dXJuXG4gIH1cbiAgZ2V0Um91dGUoKSB7XG4gICAgcmV0dXJuIFN0cmluZyh3aW5kb3cubG9jYXRpb24uaGFzaCkuc3BsaXQoJyMnKS5wb3AoKVxuICB9XG4gIGhhc2hDaGFuZ2UoZXZlbnQpIHtcbiAgICB2YXIgcm91dGUgPSB0aGlzLmdldFJvdXRlKClcbiAgICB0cnkge1xuICAgICAgdGhpcy5yb3V0ZXNbcm91dGVdKGV2ZW50KVxuICAgICAgdGhpcy5lbWl0KCduYXZpZ2F0ZScsIHRoaXMpXG4gICAgfSBjYXRjaChlcnJvcikge31cbiAgfVxuICBuYXZpZ2F0ZShwYXRoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBwYXRoXG4gIH1cbn1cbiJdfQ==
