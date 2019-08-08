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
    var property = arguments[0];
    return this._data['_'.concat(property)];
  }

  set() {
    this._history = this.parse();

    switch (arguments.length) {
      case 1:
        Object.entries(arguments[0]).forEach((_ref, index) => {
          var [key, value] = _ref;
          this.setDataProperty(key, value);
          if (this.localStorage) this.setDB(key, value);
        });
        break;

      case 2:
        var key = arguments[0];
        var value = arguments[1];
        this.setDataProperty(key, value);
        if (this.localStorage) this.setDB(key, value);
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
            context.emit(setEventName, {
              name: setEventName,
              data: {
                key: key,
                value: value
              }
            }, context);
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
MVC.Emitters.NavigateEmitter = class extends MVC.Emitter {
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
      if (settings.routerEvents) this._routerEvents = settings.routerEvents;
      if (settings.modelEvents) this._modelEvents = settings.modelEvents;
      if (settings.viewEvents) this._viewEvents = settings.viewEvents;
      if (settings.controllerEvents) this._controllerEvents = settings.controllerEvents;
      if (settings.emitterEvents) this._emitterEvents = settings.emitterEvents;

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

  get route() {
    if (this._hash) {
      return String(window.location.hash).split('#').pop();
    } else {
      return String(window.location.pathname);
    }
  }

  get _hash() {
    return this.hash;
  }

  set _hash(hash) {
    this.hash = hash;
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
    this.currentURL = currentURL;
  }

  get fragmentIDRegExp() {
    return new RegExp(/^([0-9A-Z\?\=\,\.\*\-\_\'\"\^\%\$\#\@\!\~\(\)\{\}\&\<\>\\\/])*$/, 'gi');
  }

  fragmentNameRegExp(fragment) {
    return new RegExp('^'.concat(fragment, '$'));
  }

  enable() {
    var settings = this.settings;

    if (settings && !this.enabled) {
      this._hash = typeof this.settings.hash === 'boolean' ? this.settings.hash : true;
      this.enableEmitters();
      this.enableEvents();
      this.enableRoutes();
      this.routeChange();
      this._enabled = true;
    }
  }

  disable() {
    var settings = this.settings;

    if (settings && this.enabled) {
      delete this._hash;
      this.disableEvents();
      this.disableRoutes();
      this.disableEmitters();
      this._enabled = false;
    }
  }

  enableRoutes() {
    if (this.settings.controller) this._controller = this.settings.controller;
    this._routes = Object.entries(this.settings.routes).reduce((_routes, _ref, routeIndex, originalRoutes) => {
      var [routePath, routeCallback] = _ref;
      _routes[routePath] = this.controller[routeCallback].bind(this.controller);
      return _routes;
    }, {});
    return;
  }

  enableEmitters() {
    this._emitters = {
      navigateEmitter: new MVC.Emitters.NavigateEmitter()
    };
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
  }

  disableEvents() {
    window.removeEventListener('hashchange', this.routeChange.bind(this));
  }

  routeChange() {
    var route = this.route.split('/').filter(fragment => fragment.length);
    route = route.length ? route : ['/'];
    var routeControllerData = Object.entries(this.routes).filter((_ref2) => {
      var [routerPath, routerController] = _ref2;
      routerPath = routerPath.split('/').filter(fragment => fragment.length);
      routerPath = routerPath.length ? routerPath : ['/'];

      if (route.length && route.length === routerPath.length) {
        routerPath;
        var match;
        return routerPath.filter((fragment, fragmentIndex) => {
          if (match === undefined || match === true) {
            if (fragment[0] === ':') {
              fragment = this.fragmentIDRegExp;
            } else {
              fragment = fragment.replace(new RegExp('/', 'gi'), '\\\/');
              fragment = this.fragmentNameRegExp(fragment);
            }

            match = fragment.test(route[fragmentIndex]);

            if (match === true && fragmentIndex === route.length - 1) {
              return routerController;
            }
          }
        })[0];
      }
    })[0];

    try {
      if (this.currentURL) this._previousURL = this.currentURL;
      this._currentURL = window.location.href;
      var routeControllerName = routeControllerData[0];
      var routeController = routeControllerData[1];
      var navigateEmitter = this.emitters.navigateEmitter;
      var navigateEmitterData = {
        currentURL: this.currentURL,
        previousURL: this.previousURL,
        currentRoute: this.route,
        currentController: routeController.name
      };
      navigateEmitter.set(navigateEmitterData);
      this.emit(navigateEmitter.name, navigateEmitter.emission());
      routeController(navigateEmitter.emission());
    } catch (error) {
      throw error;
    }
  }

  navigate(path) {
    window.location.hash = path;
  }

};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1WQy5qcyIsIkNvbnN0YW50cy5qcyIsIkV2ZW50cy5qcyIsIlRlbXBsYXRlcy5qcyIsIlV0aWxzLmpzIiwiaXMuanMiLCJ0eXBlT2YuanMiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QuanMiLCJvYmplY3RRdWVyeS5qcyIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMuanMiLCJ2YWxpZGF0ZURhdGFTY2hlbWEuanMiLCJDaGFubmVscy5qcyIsIkNoYW5uZWwuanMiLCJCYXNlLmpzIiwiU2VydmljZS5qcyIsIk1vZGVsLmpzIiwiRW1pdHRlci5qcyIsImluZGV4LmpzIiwiTmF2aWdhdGUuanMiLCJWaWV3LmpzIiwiQ29udHJvbGxlci5qcyIsIlJvdXRlci5qcyJdLCJuYW1lcyI6WyJNVkMiLCJDb25zdGFudHMiLCJDT05TVCIsIkV2ZW50cyIsIkVWIiwiVGVtcGxhdGVzIiwiT2JqZWN0UXVlcnlTdHJpbmdGb3JtYXRJbnZhbGlkUm9vdCIsIk9iamVjdFF1ZXJ5U3RyaW5nRm9ybWF0SW52YWxpZCIsImRhdGEiLCJqb2luIiwiRGF0YVNjaGVtYU1pc21hdGNoIiwiRGF0YUZ1bmN0aW9uSW52YWxpZCIsIkRhdGFVbmRlZmluZWQiLCJTY2hlbWFVbmRlZmluZWQiLCJUTVBMIiwiVXRpbHMiLCJpc0FycmF5Iiwib2JqZWN0IiwiQXJyYXkiLCJpc09iamVjdCIsImlzRXF1YWxUeXBlIiwidmFsdWVBIiwidmFsdWVCIiwiaXNIVE1MRWxlbWVudCIsIkhUTUxFbGVtZW50IiwidHlwZU9mIiwiX29iamVjdCIsImFkZFByb3BlcnRpZXNUb09iamVjdCIsInRhcmdldE9iamVjdCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInByb3BlcnRpZXMiLCJwcm9wZXJ0eU5hbWUiLCJwcm9wZXJ0eVZhbHVlIiwiT2JqZWN0IiwiZW50cmllcyIsIm9iamVjdFF1ZXJ5Iiwic3RyaW5nIiwiY29udGV4dCIsInN0cmluZ0RhdGEiLCJwYXJzZU5vdGF0aW9uIiwic3BsaWNlIiwicmVkdWNlIiwiZnJhZ21lbnQiLCJmcmFnbWVudEluZGV4IiwiZnJhZ21lbnRzIiwicGFyc2VGcmFnbWVudCIsInByb3BlcnR5S2V5IiwibWF0Y2giLCJjb25jYXQiLCJjaGFyQXQiLCJzbGljZSIsInNwbGl0IiwiUmVnRXhwIiwidG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyIsInRvZ2dsZU1ldGhvZCIsImV2ZW50cyIsInRhcmdldE9iamVjdHMiLCJjYWxsYmFja3MiLCJldmVudFNldHRpbmdzIiwiZXZlbnRDYWxsYmFja05hbWUiLCJldmVudERhdGEiLCJldmVudFRhcmdldFNldHRpbmdzIiwiZXZlbnROYW1lIiwiZXZlbnRUYXJnZXRzIiwiZXZlbnRUYXJnZXROYW1lIiwiZXZlbnRUYXJnZXQiLCJldmVudE1ldGhvZE5hbWUiLCJOb2RlTGlzdCIsIkRvY3VtZW50IiwiZXZlbnRDYWxsYmFjayIsIl9ldmVudFRhcmdldCIsImJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMiLCJ1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyIsInZhbGlkYXRlRGF0YVNjaGVtYSIsInNjaGVtYSIsImFycmF5IiwiY29uc29sZSIsImxvZyIsIm5hbWUiLCJhcnJheUtleSIsImFycmF5VmFsdWUiLCJwdXNoIiwib2JqZWN0S2V5Iiwib2JqZWN0VmFsdWUiLCJjb25zdHJ1Y3RvciIsIl9ldmVudHMiLCJldmVudENhbGxiYWNrcyIsImV2ZW50Q2FsbGJhY2tHcm91cCIsIm9uIiwib2ZmIiwiZW1pdCIsImV2ZW50Q2FsbGJhY2tHcm91cE5hbWUiLCJhZGRpdGlvbmFsQXJndW1lbnRzIiwidmFsdWVzIiwiQ2hhbm5lbHMiLCJfY2hhbm5lbHMiLCJjaGFubmVscyIsImNoYW5uZWwiLCJjaGFubmVsTmFtZSIsIkNoYW5uZWwiLCJfcmVzcG9uc2VzIiwicmVzcG9uc2VzIiwicmVzcG9uc2UiLCJyZXNwb25zZU5hbWUiLCJyZXNwb25zZUNhbGxiYWNrIiwicmVxdWVzdCIsInJlcXVlc3REYXRhIiwia2V5cyIsIkJhc2UiLCJzZXR0aW5ncyIsImNvbmZpZ3VyYXRpb24iLCJfY29uZmlndXJhdGlvbiIsIl9zZXR0aW5ncyIsIl9lbWl0dGVycyIsImVtaXR0ZXJzIiwiU2VydmljZSIsIl9kZWZhdWx0cyIsImRlZmF1bHRzIiwiY29udGVudFR5cGUiLCJyZXNwb25zZVR5cGUiLCJfcmVzcG9uc2VUeXBlcyIsIl9yZXNwb25zZVR5cGUiLCJfeGhyIiwiZmluZCIsInJlc3BvbnNlVHlwZUl0ZW0iLCJfdHlwZSIsInR5cGUiLCJfdXJsIiwidXJsIiwiX2hlYWRlcnMiLCJoZWFkZXJzIiwiZm9yRWFjaCIsImhlYWRlciIsInNldFJlcXVlc3RIZWFkZXIiLCJfZGF0YSIsInhociIsIlhNTEh0dHBSZXF1ZXN0IiwiX2VuYWJsZWQiLCJlbmFibGVkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzdGF0dXMiLCJhYm9ydCIsIm9wZW4iLCJvbmxvYWQiLCJvbmVycm9yIiwic2VuZCIsInRoZW4iLCJjdXJyZW50VGFyZ2V0IiwiZW5hYmxlIiwiZGlzYWJsZSIsIk1vZGVsIiwiX2xvY2FsU3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsIl9zY2hlbWEiLCJfaGlzdGlvZ3JhbSIsImhpc3Rpb2dyYW0iLCJhc3NpZ24iLCJfaGlzdG9yeSIsImhpc3RvcnkiLCJ1bnNoaWZ0IiwicGFyc2UiLCJfZGIiLCJkYiIsImdldEl0ZW0iLCJlbmRwb2ludCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzZXRJdGVtIiwiX2RhdGFFdmVudHMiLCJkYXRhRXZlbnRzIiwiX2RhdGFDYWxsYmFja3MiLCJkYXRhQ2FsbGJhY2tzIiwiX3NlcnZpY2VzIiwic2VydmljZXMiLCJfc2VydmljZUV2ZW50cyIsInNlcnZpY2VFdmVudHMiLCJfc2VydmljZUNhbGxiYWNrcyIsInNlcnZpY2VDYWxsYmFja3MiLCJlbmFibGVTZXJ2aWNlRXZlbnRzIiwiZGlzYWJsZVNlcnZpY2VFdmVudHMiLCJlbmFibGVEYXRhRXZlbnRzIiwiZGlzYWJsZURhdGFFdmVudHMiLCJzZXREZWZhdWx0cyIsInNldCIsImdldCIsInByb3BlcnR5IiwiaW5kZXgiLCJrZXkiLCJ2YWx1ZSIsInNldERhdGFQcm9wZXJ0eSIsInNldERCIiwidW5zZXQiLCJ1bnNldERhdGFQcm9wZXJ0eSIsIl9hcmd1bWVudHMiLCJ1bnNldERCIiwiZGVmaW5lUHJvcGVydGllcyIsImNvbmZpZ3VyYWJsZSIsInNldFZhbHVlRXZlbnROYW1lIiwic2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZUV2ZW50TmFtZSIsInVuc2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZSIsIkVtaXR0ZXIiLCJfbmFtZSIsImVtaXNzaW9uIiwiRW1pdHRlcnMiLCJOYXZpZ2F0ZUVtaXR0ZXIiLCJhZGRTZXR0aW5ncyIsIm9sZFVSTCIsIlN0cmluZyIsIm5ld1VSTCIsImN1cnJlbnRSb3V0ZSIsImN1cnJlbnRDb250cm9sbGVyIiwiVmlldyIsIl9lbGVtZW50TmFtZSIsIl9lbGVtZW50IiwidGFnTmFtZSIsImVsZW1lbnROYW1lIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJlbGVtZW50T2JzZXJ2ZXIiLCJvYnNlcnZlIiwic3VidHJlZSIsImNoaWxkTGlzdCIsIl9hdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZUtleSIsImF0dHJpYnV0ZVZhbHVlIiwicmVtb3ZlQXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwiX3VpIiwidWkiLCJ1aUtleSIsInVpVmFsdWUiLCJxdWVyeVNlbGVjdG9yQWxsIiwiX3VpRXZlbnRzIiwidWlFdmVudHMiLCJfdWlDYWxsYmFja3MiLCJ1aUNhbGxiYWNrcyIsIl9vYnNlcnZlckNhbGxiYWNrcyIsIm9ic2VydmVyQ2FsbGJhY2tzIiwiX2VsZW1lbnRPYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJlbGVtZW50T2JzZXJ2ZSIsImJpbmQiLCJfaW5zZXJ0IiwiaW5zZXJ0IiwiX3RlbXBsYXRlcyIsInRlbXBsYXRlcyIsIm11dGF0aW9uUmVjb3JkTGlzdCIsIm9ic2VydmVyIiwibXV0YXRpb25SZWNvcmRJbmRleCIsIm11dGF0aW9uUmVjb3JkIiwibXV0YXRpb25SZWNvcmRDYXRlZ29yaWVzIiwibXV0YXRpb25SZWNvcmRDYXRlZ29yeSIsInJlc2V0VUkiLCJhdXRvSW5zZXJ0IiwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50IiwibWV0aG9kIiwiYXV0b1JlbW92ZSIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImVuYWJsZUVsZW1lbnQiLCJkaXNhYmxlRWxlbWVudCIsImRpc2FibGVVSSIsImVuYWJsZVVJIiwiZW5hYmxlVUlFdmVudHMiLCJkaXNhYmxlVUlFdmVudHMiLCJlbmFibGVFbWl0dGVycyIsImRpc2FibGVFbWl0dGVycyIsInRoaXNzIiwiQ29udHJvbGxlciIsIl9lbWl0dGVyQ2FsbGJhY2tzIiwiZW1pdHRlckNhbGxiYWNrcyIsIl9tb2RlbENhbGxiYWNrcyIsIm1vZGVsQ2FsbGJhY2tzIiwiX3ZpZXdDYWxsYmFja3MiLCJ2aWV3Q2FsbGJhY2tzIiwiX2NvbnRyb2xsZXJDYWxsYmFja3MiLCJjb250cm9sbGVyQ2FsbGJhY2tzIiwiX21vZGVscyIsIm1vZGVscyIsIl92aWV3cyIsInZpZXdzIiwiX2NvbnRyb2xsZXJzIiwiY29udHJvbGxlcnMiLCJfcm91dGVycyIsInJvdXRlcnMiLCJfcm91dGVyRXZlbnRzIiwicm91dGVyRXZlbnRzIiwiX3JvdXRlckNhbGxiYWNrcyIsInJvdXRlckNhbGxiYWNrcyIsIl9lbWl0dGVyRXZlbnRzIiwiZW1pdHRlckV2ZW50cyIsIl9tb2RlbEV2ZW50cyIsIm1vZGVsRXZlbnRzIiwiX3ZpZXdFdmVudHMiLCJ2aWV3RXZlbnRzIiwiX2NvbnRyb2xsZXJFdmVudHMiLCJjb250cm9sbGVyRXZlbnRzIiwiZW5hYmxlTW9kZWxFdmVudHMiLCJkaXNhYmxlTW9kZWxFdmVudHMiLCJlbmFibGVWaWV3RXZlbnRzIiwiZGlzYWJsZVZpZXdFdmVudHMiLCJlbmFibGVDb250cm9sbGVyRXZlbnRzIiwiZGlzYWJsZUNvbnRyb2xsZXJFdmVudHMiLCJlbmFibGVFbWl0dGVyRXZlbnRzIiwiZGlzYWJsZUVtaXR0ZXJFdmVudHMiLCJlbmFibGVSb3V0ZXJFdmVudHMiLCJkaXNhYmxlUm91dGVyRXZlbnRzIiwicmVzZXQiLCJSb3V0ZXIiLCJyb3V0ZSIsIl9oYXNoIiwid2luZG93IiwibG9jYXRpb24iLCJoYXNoIiwicG9wIiwicGF0aG5hbWUiLCJfcm91dGVzIiwicm91dGVzIiwiX2NvbnRyb2xsZXIiLCJjb250cm9sbGVyIiwiX3ByZXZpb3VzVVJMIiwicHJldmlvdXNVUkwiLCJfY3VycmVudFVSTCIsImN1cnJlbnRVUkwiLCJmcmFnbWVudElEUmVnRXhwIiwiZnJhZ21lbnROYW1lUmVnRXhwIiwiZW5hYmxlRXZlbnRzIiwiZW5hYmxlUm91dGVzIiwicm91dGVDaGFuZ2UiLCJkaXNhYmxlRXZlbnRzIiwiZGlzYWJsZVJvdXRlcyIsInJvdXRlSW5kZXgiLCJvcmlnaW5hbFJvdXRlcyIsInJvdXRlUGF0aCIsInJvdXRlQ2FsbGJhY2siLCJuYXZpZ2F0ZUVtaXR0ZXIiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImZpbHRlciIsInJvdXRlQ29udHJvbGxlckRhdGEiLCJyb3V0ZXJQYXRoIiwicm91dGVyQ29udHJvbGxlciIsInVuZGVmaW5lZCIsInJlcGxhY2UiLCJ0ZXN0IiwiaHJlZiIsInJvdXRlQ29udHJvbGxlck5hbWUiLCJyb3V0ZUNvbnRyb2xsZXIiLCJuYXZpZ2F0ZUVtaXR0ZXJEYXRhIiwiZXJyb3IiLCJuYXZpZ2F0ZSIsInBhdGgiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLEVBQWpCO0FDQUFBLEdBQUcsQ0FBQ0MsU0FBSixHQUFnQixFQUFoQjtBQUNBRCxHQUFHLENBQUNFLEtBQUosR0FBWUYsR0FBRyxDQUFDQyxTQUFoQjtBQ0RBRCxHQUFHLENBQUNDLFNBQUosQ0FBY0UsTUFBZCxHQUF1QixFQUF2QjtBQUNBSCxHQUFHLENBQUNFLEtBQUosQ0FB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bWV3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE1WQyA9IE1WQyB8fCB7fVxyXG4iLCJNVkMuQ29uc3RhbnRzID0ge31cbk1WQy5DT05TVCA9IE1WQy5Db25zdGFudHNcbiIsIk1WQy5FdmVudHMgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfZXZlbnRzKCkge1xyXG4gICAgdGhpcy5ldmVudHMgPSAodGhpcy5ldmVudHMpXHJcbiAgICAgID8gdGhpcy5ldmVudHNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzXHJcbiAgfVxyXG4gIGV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSkgeyByZXR1cm4gdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gfHwge30gfVxyXG4gIGV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIHJldHVybiAoZXZlbnRDYWxsYmFjay5uYW1lLmxlbmd0aClcclxuICAgICAgPyBldmVudENhbGxiYWNrLm5hbWVcclxuICAgICAgOiAnYW5vbnltb3VzRnVuY3Rpb24nXHJcbiAgfVxyXG4gIGV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpIHtcclxuICAgIHJldHVybiBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gfHwgW11cclxuICB9XHJcbiAgb24oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKSB7XHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja3MgPSB0aGlzLmV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSlcclxuICAgIGxldCBldmVudENhbGxiYWNrTmFtZSA9IHRoaXMuZXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgIGxldCBldmVudENhbGxiYWNrR3JvdXAgPSB0aGlzLmV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpXHJcbiAgICBldmVudENhbGxiYWNrR3JvdXAucHVzaChldmVudENhbGxiYWNrKVxyXG4gICAgZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdID0gZXZlbnRDYWxsYmFja0dyb3VwXHJcbiAgICB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSA9IGV2ZW50Q2FsbGJhY2tzXHJcbiAgfVxyXG4gIG9mZigpIHtcclxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrTmFtZSA9IHRoaXMuZXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1bZXZlbnRDYWxsYmFja05hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICB9XHJcbiAgZW1pdChldmVudE5hbWUsIGV2ZW50RGF0YSkge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5ldmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBmb3IobGV0IFtldmVudENhbGxiYWNrR3JvdXBOYW1lLCBldmVudENhbGxiYWNrR3JvdXBdIG9mIE9iamVjdC5lbnRyaWVzKGV2ZW50Q2FsbGJhY2tzKSkge1xyXG4gICAgICBmb3IobGV0IGV2ZW50Q2FsbGJhY2sgb2YgZXZlbnRDYWxsYmFja0dyb3VwKSB7XHJcbiAgICAgICAgbGV0IGFkZGl0aW9uYWxBcmd1bWVudHMgPSBPYmplY3QudmFsdWVzKGFyZ3VtZW50cykuc3BsaWNlKDIpIHx8IFtdXHJcbiAgICAgICAgZXZlbnRDYWxsYmFjayhldmVudERhdGEsIC4uLmFkZGl0aW9uYWxBcmd1bWVudHMpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiTVZDLlRlbXBsYXRlcyA9IHtcclxuICBPYmplY3RRdWVyeVN0cmluZ0Zvcm1hdEludmFsaWRSb290OiBmdW5jdGlvbiBPYmplY3RRdWVyeVN0cmluZ0Zvcm1hdEludmFsaWQoZGF0YSkge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgJ09iamVjdCBRdWVyeSBcInN0cmluZ1wiIHByb3BlcnR5IG11c3QgYmUgZm9ybWF0dGVkIHRvIGZpcnN0IGluY2x1ZGUgXCJbQF1cIi4nXHJcbiAgICBdLmpvaW4oJ1xcbicpXHJcbiAgfSxcclxuICBEYXRhU2NoZW1hTWlzbWF0Y2g6IGZ1bmN0aW9uIERhdGFTY2hlbWFNaXNtYXRjaChkYXRhKSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBgRGF0YSBhbmQgU2NoZW1hIHByb3BlcnRpZXMgZG8gbm90IG1hdGNoLmBcclxuICAgIF0uam9pbignXFxuJylcclxuICB9LFxyXG4gIERhdGFGdW5jdGlvbkludmFsaWQ6IGZ1bmN0aW9uIERhdGFGdW5jdGlvbkludmFsaWQoZGF0YSkge1xyXG4gICAgW1xyXG4gICAgICBgTW9kZWwgRGF0YSBwcm9wZXJ0eSB0eXBlIFwiRnVuY3Rpb25cIiBpcyBub3QgdmFsaWQuYFxyXG4gICAgXS5qb2luKCdcXG4nKVxyXG4gIH0sXHJcbiAgRGF0YVVuZGVmaW5lZDogZnVuY3Rpb24gRGF0YVVuZGVmaW5lZChkYXRhKSB7XHJcbiAgICBbXHJcbiAgICAgIGBNb2RlbCBEYXRhIHByb3BlcnR5IHVuZGVmaW5lZC5gXHJcbiAgICBdLmpvaW4oJ1xcbicpXHJcbiAgfSxcclxuICBTY2hlbWFVbmRlZmluZWQ6IGZ1bmN0aW9uIFNjaGVtYVVuZGVmaW5lZChkYXRhKSB7XHJcbiAgICBbXHJcbiAgICAgIGBNb2RlbCBcIlNjaGVtYVwiIHVuZGVmaW5lZC5gXHJcbiAgICBdLmpvaW4oJ1xcbicpXHJcbiAgfSxcclxufVxyXG5NVkMuVE1QTCA9IE1WQy5UZW1wbGF0ZXNcclxuIiwiTVZDLlV0aWxzID0ge31cclxuIiwiTVZDLlV0aWxzLmlzQXJyYXkgPSBmdW5jdGlvbiBpc0FycmF5KG9iamVjdCkgeyByZXR1cm4gQXJyYXkuaXNBcnJheShvYmplY3QpIH1cclxuTVZDLlV0aWxzLmlzT2JqZWN0ID0gZnVuY3Rpb24gaXNPYmplY3Qob2JqZWN0KSB7XHJcbiAgcmV0dXJuICghQXJyYXkuaXNBcnJheShvYmplY3QpKVxyXG4gICAgPyB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0J1xyXG4gICAgOiBmYWxzZVxyXG59XHJcbk1WQy5VdGlscy5pc0VxdWFsVHlwZSA9IGZ1bmN0aW9uIGlzRXF1YWxUeXBlKHZhbHVlQSwgdmFsdWVCKSB7IHJldHVybiB2YWx1ZUEgPT09IHZhbHVlQiB9XHJcbk1WQy5VdGlscy5pc0hUTUxFbGVtZW50ID0gZnVuY3Rpb24gaXNIVE1MRWxlbWVudChvYmplY3QpIHtcclxuICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcclxufVxyXG4iLCJNVkMuVXRpbHMudHlwZU9mID0gIGZ1bmN0aW9uIHR5cGVPZihkYXRhKSB7XHJcbiAgc3dpdGNoKHR5cGVvZiBkYXRhKSB7XHJcbiAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICBsZXQgX29iamVjdFxyXG4gICAgICBpZihNVkMuVXRpbHMuaXNBcnJheShkYXRhKSkge1xyXG4gICAgICAgIC8vIEFycmF5XHJcbiAgICAgICAgcmV0dXJuICdhcnJheSdcclxuICAgICAgfSBlbHNlIGlmKFxyXG4gICAgICAgIE1WQy5VdGlscy5pc09iamVjdChkYXRhKVxyXG4gICAgICApIHtcclxuICAgICAgICAvLyBPYmplY3RcclxuICAgICAgICByZXR1cm4gJ29iamVjdCdcclxuICAgICAgfSBlbHNlIGlmKFxyXG4gICAgICAgIGRhdGEgPT09IG51bGxcclxuICAgICAgKSB7XHJcbiAgICAgICAgLy8gTnVsbFxyXG4gICAgICAgIHJldHVybiAnbnVsbCdcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gX29iamVjdFxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnc3RyaW5nJzpcclxuICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICBjYXNlICdib29sZWFuJzpcclxuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XHJcbiAgICBjYXNlICdmdW5jdGlvbic6XHJcbiAgICAgIHJldHVybiB0eXBlb2YgZGF0YVxyXG4gICAgICBicmVha1xyXG4gIH1cclxufVxyXG4iLCJNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0ID0gZnVuY3Rpb24gYWRkUHJvcGVydGllc1RvT2JqZWN0KCkge1xyXG4gIGxldCB0YXJnZXRPYmplY3RcclxuICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgY2FzZSAyOlxyXG4gICAgICBsZXQgcHJvcGVydGllcyA9IGFyZ3VtZW50c1swXVxyXG4gICAgICB0YXJnZXRPYmplY3QgPSBhcmd1bWVudHNbMV1cclxuICAgICAgZm9yKGxldCBbcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwcm9wZXJ0aWVzKSkge1xyXG4gICAgICAgIHRhcmdldE9iamVjdFtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZVxyXG4gICAgICB9XHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlIDM6XHJcbiAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgbGV0IHByb3BlcnR5VmFsdWUgPSBhcmd1bWVudHNbMV1cclxuICAgICAgdGFyZ2V0T2JqZWN0ID0gYXJndW1lbnRzWzJdXHJcbiAgICAgIHRhcmdldE9iamVjdFtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZVxyXG4gICAgICBicmVha1xyXG4gIH1cclxuICByZXR1cm4gdGFyZ2V0T2JqZWN0XHJcbn1cclxuIiwiTVZDLlV0aWxzLm9iamVjdFF1ZXJ5ID0gZnVuY3Rpb24gb2JqZWN0UXVlcnkoXHJcbiAgc3RyaW5nLFxyXG4gIGNvbnRleHRcclxuKSB7XHJcbiAgbGV0IHN0cmluZ0RhdGEgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VOb3RhdGlvbihzdHJpbmcpXHJcbiAgaWYoc3RyaW5nRGF0YVswXSA9PT0gJ0AnKSBzdHJpbmdEYXRhLnNwbGljZSgwLCAxKVxyXG4gIGlmKCFzdHJpbmdEYXRhLmxlbmd0aCkgcmV0dXJuIGNvbnRleHRcclxuICBjb250ZXh0ID0gKE1WQy5VdGlscy5pc09iamVjdChjb250ZXh0KSlcclxuICAgID8gT2JqZWN0LmVudHJpZXMoY29udGV4dClcclxuICAgIDogY29udGV4dFxyXG4gIHJldHVybiBzdHJpbmdEYXRhLnJlZHVjZSgob2JqZWN0LCBmcmFnbWVudCwgZnJhZ21lbnRJbmRleCwgZnJhZ21lbnRzKSA9PiB7XHJcbiAgICBsZXQgcHJvcGVydGllcyA9IFtdXHJcbiAgICBmcmFnbWVudCA9IE1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZUZyYWdtZW50KGZyYWdtZW50KVxyXG4gICAgZm9yKGxldCBbcHJvcGVydHlLZXksIHByb3BlcnR5VmFsdWVdIG9mIG9iamVjdCkge1xyXG4gICAgICBpZihwcm9wZXJ0eUtleS5tYXRjaChmcmFnbWVudCkpIHtcclxuICAgICAgICBpZihmcmFnbWVudEluZGV4ID09PSBmcmFnbWVudHMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMuY29uY2F0KFtbcHJvcGVydHlLZXksIHByb3BlcnR5VmFsdWVdXSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMuY29uY2F0KE9iamVjdC5lbnRyaWVzKHByb3BlcnR5VmFsdWUpKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgb2JqZWN0ID0gcHJvcGVydGllc1xyXG4gICAgcmV0dXJuIG9iamVjdFxyXG4gIH0sIGNvbnRleHQpXHJcbn1cclxuTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlTm90YXRpb24gPSBmdW5jdGlvbiBwYXJzZU5vdGF0aW9uKHN0cmluZykge1xyXG4gIGlmKFxyXG4gICAgc3RyaW5nLmNoYXJBdCgwKSA9PT0gJ1snICYmXHJcbiAgICBzdHJpbmcuY2hhckF0KHN0cmluZy5sZW5ndGggLSAxKSA9PSAnXSdcclxuICApIHtcclxuICAgIHN0cmluZyA9IHN0cmluZ1xyXG4gICAgICAuc2xpY2UoMSwgLTEpXHJcbiAgICAgIC5zcGxpdCgnXVsnKVxyXG4gIH0gZWxzZSB7XHJcbiAgICBzdHJpbmcgPSBzdHJpbmdcclxuICAgICAgLnNwbGl0KCcuJylcclxuICB9XHJcbiAgcmV0dXJuIHN0cmluZ1xyXG59XHJcbk1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZUZyYWdtZW50ID0gZnVuY3Rpb24gcGFyc2VGcmFnbWVudChmcmFnbWVudCkge1xyXG4gIGlmKFxyXG4gICAgZnJhZ21lbnQuY2hhckF0KDApID09PSAnLycgJiZcclxuICAgIGZyYWdtZW50LmNoYXJBdChmcmFnbWVudC5sZW5ndGggLSAxKSA9PSAnLydcclxuICApIHtcclxuICAgIGZyYWdtZW50ID0gZnJhZ21lbnQuc2xpY2UoMSwgLTEpXHJcbiAgICBmcmFnbWVudCA9IG5ldyBSZWdFeHAoJ14nLmNvbmNhdChmcmFnbWVudCwgJyQnKSlcclxuICB9XHJcbiAgcmV0dXJuIGZyYWdtZW50XHJcbn1cclxuIiwiTVZDLlV0aWxzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMgPSBmdW5jdGlvbiB0b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKFxyXG4gIHRvZ2dsZU1ldGhvZCxcclxuICBldmVudHMsXHJcbiAgdGFyZ2V0T2JqZWN0cyxcclxuICBjYWxsYmFja3NcclxuKSB7XHJcbiAgZm9yKGxldCBbZXZlbnRTZXR0aW5ncywgZXZlbnRDYWxsYmFja05hbWVdIG9mIE9iamVjdC5lbnRyaWVzKGV2ZW50cykpIHtcclxuICAgIGxldCBldmVudERhdGEgPSBldmVudFNldHRpbmdzLnNwbGl0KCcgJylcclxuICAgIGxldCBldmVudFRhcmdldFNldHRpbmdzID0gZXZlbnREYXRhWzBdXHJcbiAgICBsZXQgZXZlbnROYW1lID0gZXZlbnREYXRhWzFdXHJcbiAgICBsZXQgZXZlbnRUYXJnZXRzID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5KFxyXG4gICAgICBldmVudFRhcmdldFNldHRpbmdzLFxyXG4gICAgICB0YXJnZXRPYmplY3RzXHJcbiAgICApXHJcbiAgICBldmVudFRhcmdldHMgPSAoIU1WQy5VdGlscy5pc0FycmF5KGV2ZW50VGFyZ2V0cykpXHJcbiAgICAgID8gW1snQCcsIGV2ZW50VGFyZ2V0c11dXHJcbiAgICAgIDogZXZlbnRUYXJnZXRzXHJcbiAgICBmb3IobGV0IFtldmVudFRhcmdldE5hbWUsIGV2ZW50VGFyZ2V0XSBvZiBldmVudFRhcmdldHMpIHtcclxuICAgICAgbGV0IGV2ZW50TWV0aG9kTmFtZSA9ICh0b2dnbGVNZXRob2QgPT09ICdvbicpXHJcbiAgICAgID8gKFxyXG4gICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QgfHxcclxuICAgICAgICAoXHJcbiAgICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XHJcbiAgICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIERvY3VtZW50XHJcbiAgICAgICAgKVxyXG4gICAgICApID8gJ2FkZEV2ZW50TGlzdGVuZXInXHJcbiAgICAgICAgOiAnb24nXHJcbiAgICAgIDogKFxyXG4gICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QgfHxcclxuICAgICAgICAoXHJcbiAgICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XHJcbiAgICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIERvY3VtZW50XHJcbiAgICAgICAgKVxyXG4gICAgICApID8gJ3JlbW92ZUV2ZW50TGlzdGVuZXInXHJcbiAgICAgICAgOiAnb2ZmJ1xyXG4gICAgICBsZXQgZXZlbnRDYWxsYmFjayA9IE1WQy5VdGlscy5vYmplY3RRdWVyeShcclxuICAgICAgICBldmVudENhbGxiYWNrTmFtZSxcclxuICAgICAgICBjYWxsYmFja3NcclxuICAgICAgKVswXVsxXVxyXG4gICAgICBpZihldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XHJcbiAgICAgICAgZm9yKGxldCBfZXZlbnRUYXJnZXQgb2YgZXZlbnRUYXJnZXQpIHtcclxuICAgICAgICAgIF9ldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZihldmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMgPSBmdW5jdGlvbiBiaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKCkge1xyXG4gIHRoaXMudG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cygnb24nLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzID0gZnVuY3Rpb24gdW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMoKSB7XHJcbiAgdGhpcy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKCdvZmYnLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuIiwiTVZDLlV0aWxzLnZhbGlkYXRlRGF0YVNjaGVtYSA9IGZ1bmN0aW9uIHZhbGlkYXRlRGF0YVNjaGVtYShkYXRhLCBzY2hlbWEpIHtcclxuICBpZihzY2hlbWEpIHtcclxuICAgIHN3aXRjaChNVkMuVXRpbHMudHlwZU9mKGRhdGEpKSB7XHJcbiAgICAgIGNhc2UgJ2FycmF5JzpcclxuICAgICAgICBsZXQgYXJyYXkgPSBbXVxyXG4gICAgICAgIHNjaGVtYSA9IChNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSkgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICA/IHNjaGVtYSgpXHJcbiAgICAgICAgICA6IHNjaGVtYVxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgTVZDLlV0aWxzLmlzRXF1YWxUeXBlKFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSksXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2YoYXJyYXkpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhzY2hlbWEubmFtZSlcclxuICAgICAgICAgIGZvcihsZXQgW2FycmF5S2V5LCBhcnJheVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKFxyXG4gICAgICAgICAgICAgIHRoaXMudmFsaWRhdGVEYXRhU2NoZW1hKGFycmF5VmFsdWUpXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycmF5XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgICBsZXQgb2JqZWN0ID0ge31cclxuICAgICAgICBzY2hlbWEgPSAoTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgPyBzY2hlbWEoKVxyXG4gICAgICAgICAgOiBzY2hlbWFcclxuICAgICAgICBpZihcclxuICAgICAgICAgIE1WQy5VdGlscy5pc0VxdWFsVHlwZShcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpLFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKG9iamVjdClcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHNjaGVtYS5uYW1lKVxyXG4gICAgICAgICAgZm9yKGxldCBbb2JqZWN0S2V5LCBvYmplY3RWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGF0YSkpIHtcclxuICAgICAgICAgICAgb2JqZWN0W29iamVjdEtleV0gPSB0aGlzLnZhbGlkYXRlRGF0YVNjaGVtYShvYmplY3RWYWx1ZSwgc2NoZW1hW29iamVjdEtleV0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYmplY3RcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgICBjYXNlICdudW1iZXInOlxyXG4gICAgICBjYXNlICdib29sZWFuJzpcclxuICAgICAgICBzY2hlbWEgPSAoTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgPyBzY2hlbWEoKVxyXG4gICAgICAgICAgOiBzY2hlbWFcclxuICAgICAgICBpZihcclxuICAgICAgICAgIE1WQy5VdGlscy5pc0VxdWFsVHlwZShcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpLFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKGRhdGEpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhzY2hlbWEubmFtZSlcclxuICAgICAgICAgIHJldHVybiBkYXRhXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRocm93IE1WQy5UTVBMXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ251bGwnOlxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgTVZDLlV0aWxzLmlzRXF1YWxUeXBlKFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSksXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2YoZGF0YSlcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIHJldHVybiBkYXRhXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XHJcbiAgICAgICAgdGhyb3cgTVZDLlRNUExcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdmdW5jdGlvbic6XHJcbiAgICAgICAgdGhyb3cgTVZDLlRNUExcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICB0aHJvdyBNVkMuVE1QTFxyXG4gIH1cclxufVxyXG4iLCJNVkMuQ2hhbm5lbHMgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfY2hhbm5lbHMoKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzID0gKHRoaXMuY2hhbm5lbHMpXHJcbiAgICAgID8gdGhpcy5jaGFubmVsc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsc1xyXG4gIH1cclxuICBjaGFubmVsKGNoYW5uZWxOYW1lKSB7XHJcbiAgICB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0gPSAodGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdKVxyXG4gICAgICA/IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA6IG5ldyBNVkMuQ2hhbm5lbHMuQ2hhbm5lbCgpXHJcbiAgICByZXR1cm4gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG4gIG9mZihjaGFubmVsTmFtZSkge1xyXG4gICAgZGVsZXRlIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxufVxyXG4iLCJNVkMuQ2hhbm5lbHMuQ2hhbm5lbCA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9yZXNwb25zZXMoKSB7XHJcbiAgICB0aGlzLnJlc3BvbnNlcyA9ICh0aGlzLnJlc3BvbnNlcylcclxuICAgICAgPyB0aGlzLnJlc3BvbnNlc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZihyZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdID0gcmVzcG9uc2VDYWxsYmFja1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZV1cclxuICAgIH1cclxuICB9XHJcbiAgcmVxdWVzdChyZXNwb25zZU5hbWUsIHJlcXVlc3REYXRhKSB7XHJcbiAgICBpZih0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0ocmVxdWVzdERhdGEpXHJcbiAgICB9XHJcbiAgfVxyXG4gIG9mZihyZXNwb25zZU5hbWUpIHtcclxuICAgIGlmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvcihsZXQgW3Jlc3BvbnNlTmFtZV0gb2YgT2JqZWN0LmtleXModGhpcy5fcmVzcG9uc2VzKSkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIk1WQy5CYXNlID0gY2xhc3MgZXh0ZW5kcyBNVkMuRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncywgY29uZmlndXJhdGlvbikge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgaWYoY29uZmlndXJhdGlvbikgdGhpcy5fY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb25cclxuICAgIGlmKHNldHRpbmdzKSB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgfVxyXG4gIGdldCBfY29uZmlndXJhdGlvbigpIHtcclxuICAgIHRoaXMuY29uZmlndXJhdGlvbiA9ICh0aGlzLmNvbmZpZ3VyYXRpb24pXHJcbiAgICAgID8gdGhpcy5jb25maWd1cmF0aW9uXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25cclxuICB9XHJcbiAgc2V0IF9jb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHsgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbiB9XHJcbiAgZ2V0IF9zZXR0aW5ncygpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSAodGhpcy5zZXR0aW5ncylcclxuICAgICAgPyB0aGlzLnNldHRpbmdzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLnNldHRpbmdzXHJcbiAgfVxyXG4gIHNldCBfc2V0dGluZ3Moc2V0dGluZ3MpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxyXG4gICAgICBzZXR0aW5ncywgdGhpcy5fc2V0dGluZ3NcclxuICAgIClcclxuICB9XHJcbiAgZ2V0IF9lbWl0dGVycygpIHtcclxuICAgIHRoaXMuZW1pdHRlcnMgPSAodGhpcy5lbWl0dGVycylcclxuICAgICAgPyB0aGlzLmVtaXR0ZXJzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXJzXHJcbiAgfVxyXG4gIHNldCBfZW1pdHRlcnMoZW1pdHRlcnMpIHtcclxuICAgIHRoaXMuZW1pdHRlcnMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxyXG4gICAgICBlbWl0dGVycywgdGhpcy5fZW1pdHRlcnNcclxuICAgIClcclxuICB9XHJcbn1cclxuIiwiTVZDLlNlcnZpY2UgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLmRlZmF1bHRzIHx8IHtcbiAgICBjb250ZW50VHlwZTogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICB9IH1cbiAgZ2V0IF9yZXNwb25zZVR5cGVzKCkgeyByZXR1cm4gWycnLCAnYXJyYXlidWZmZXInLCAnYmxvYicsICdkb2N1bWVudCcsICdqc29uJywgJ3RleHQnXSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlKCkgeyByZXR1cm4gdGhpcy5yZXNwb25zZVR5cGUgfVxuICBzZXQgX3Jlc3BvbnNlVHlwZShyZXNwb25zZVR5cGUpIHtcbiAgICB0aGlzLl94aHIucmVzcG9uc2VUeXBlID0gdGhpcy5fcmVzcG9uc2VUeXBlcy5maW5kKFxuICAgICAgKHJlc3BvbnNlVHlwZUl0ZW0pID0+IHJlc3BvbnNlVHlwZUl0ZW0gPT09IHJlc3BvbnNlVHlwZVxuICAgICkgfHwgdGhpcy5fZGVmYXVsdHMucmVzcG9uc2VUeXBlXG4gIH1cbiAgZ2V0IF90eXBlKCkgeyByZXR1cm4gdGhpcy50eXBlIH1cbiAgc2V0IF90eXBlKHR5cGUpIHsgdGhpcy50eXBlID0gdHlwZSB9XG4gIGdldCBfdXJsKCkgeyByZXR1cm4gdGhpcy51cmwgfVxuICBzZXQgX3VybCh1cmwpIHsgdGhpcy51cmwgPSB1cmwgfVxuICBnZXQgX2hlYWRlcnMoKSB7IHJldHVybiB0aGlzLmhlYWRlcnMgfHwgW10gfVxuICBzZXQgX2hlYWRlcnMoaGVhZGVycykge1xuICAgIHRoaXMuX2hlYWRlcnMubGVuZ3RoID0gMFxuICAgIGhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICB0aGlzLl9oZWFkZXJzLnB1c2goaGVhZGVyKVxuICAgICAgaGVhZGVyID0gT2JqZWN0LmVudHJpZXMoaGVhZGVyKVswXVxuICAgICAgdGhpcy5feGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgfSlcbiAgfVxuICBnZXQgX2RhdGEoKSB7IHJldHVybiB0aGlzLmRhdGEgfVxuICBzZXQgX2RhdGEoZGF0YSkgeyB0aGlzLmRhdGEgPSBkYXRhIH1cbiAgZ2V0IF94aHIoKSB7XG4gICAgdGhpcy54aHIgPSAodGhpcy54aHIpXG4gICAgICA/IHRoaXMueGhyXG4gICAgICA6IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgcmV0dXJuIHRoaXMueGhyXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIHJlcXVlc3QoZGF0YSkge1xuICAgIGRhdGEgPSBkYXRhIHx8IHRoaXMuZGF0YSB8fCBudWxsXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmKHRoaXMuX3hoci5zdGF0dXMgPT09IDIwMCkgdGhpcy5feGhyLmFib3J0KClcbiAgICAgIHRoaXMuX3hoci5vcGVuKHRoaXMudHlwZSwgdGhpcy51cmwpXG4gICAgICB0aGlzLl9oZWFkZXJzID0gdGhpcy5zZXR0aW5ncy5oZWFkZXJzIHx8IFt0aGlzLl9kZWZhdWx0cy5jb250ZW50VHlwZV1cbiAgICAgIHRoaXMuX3hoci5vbmxvYWQgPSByZXNvbHZlXG4gICAgICB0aGlzLl94aHIub25lcnJvciA9IHJlamVjdFxuICAgICAgdGhpcy5feGhyLnNlbmQoZGF0YSlcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgdGhpcy5lbWl0KCd4aHI6cmVzb2x2ZScsIHtcbiAgICAgICAgbmFtZTogJ3hocjpyZXNvbHZlJyxcbiAgICAgICAgZGF0YTogcmVzcG9uc2UuY3VycmVudFRhcmdldCxcbiAgICAgIH0pXG4gICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICB9KVxuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICAhdGhpcy5lbmFibGVkICYmXG4gICAgICBPYmplY3Qua2V5cyhzZXR0aW5ncykubGVuZ3RoXG4gICAgKSB7XG4gICAgICBpZihzZXR0aW5ncy50eXBlKSB0aGlzLl90eXBlID0gc2V0dGluZ3MudHlwZVxuICAgICAgaWYoc2V0dGluZ3MudXJsKSB0aGlzLl91cmwgPSBzZXR0aW5ncy51cmxcbiAgICAgIGlmKHNldHRpbmdzLmRhdGEpIHRoaXMuX2RhdGEgPSBzZXR0aW5ncy5kYXRhIHx8IG51bGxcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MucmVzcG9uc2VUeXBlKSB0aGlzLl9yZXNwb25zZVR5cGUgPSB0aGlzLl9zZXR0aW5ncy5yZXNwb25zZVR5cGVcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICB0aGlzLmVuYWJsZWQgJiZcbiAgICAgIE9iamVjdC5rZXlzKHNldHRpbmdzKS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl90eXBlXG4gICAgICBkZWxldGUgdGhpcy5fdXJsXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YVxuICAgICAgZGVsZXRlIHRoaXMuX2hlYWRlcnNcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZVR5cGVcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG4iLCJNVkMuTW9kZWwgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfbG9jYWxTdG9yYWdlKCkgeyByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UgfVxuICBzZXQgX2xvY2FsU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHsgdGhpcy5sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UgfVxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5kZWZhdWx0cyB9XG4gIHNldCBfZGVmYXVsdHMoZGVmYXVsdHMpIHsgdGhpcy5kZWZhdWx0cyA9IGRlZmF1bHRzIH1cbiAgZ2V0IF9zY2hlbWEoKSB7IHJldHVybiB0aGlzLl9zY2hlbWEgfVxuICBzZXQgX3NjaGVtYShzY2hlbWEpIHsgdGhpcy5zY2hlbWEgPSBzY2hlbWEgfVxuICBnZXQgX2hpc3Rpb2dyYW0oKSB7IHJldHVybiB0aGlzLmhpc3Rpb2dyYW0gfHwge1xuICAgIGxlbmd0aDogMVxuICB9IH1cbiAgc2V0IF9oaXN0aW9ncmFtKGhpc3Rpb2dyYW0pIHtcbiAgICB0aGlzLmhpc3Rpb2dyYW0gPSBPYmplY3QuYXNzaWduKFxuICAgICAgdGhpcy5faGlzdGlvZ3JhbSxcbiAgICAgIGhpc3Rpb2dyYW1cbiAgICApXG4gIH1cbiAgZ2V0IF9oaXN0b3J5KCkge1xuICAgIHRoaXMuaGlzdG9yeSA9ICh0aGlzLmhpc3RvcnkpXG4gICAgICA/IHRoaXMuaGlzdG9yeVxuICAgICAgOiBbXVxuICAgIHJldHVybiB0aGlzLmhpc3RvcnlcbiAgfVxuICBzZXQgX2hpc3RvcnkoZGF0YSkge1xuICAgIGlmKFxuICAgICAgT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoXG4gICAgKSB7XG4gICAgICBpZih0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVuc2hpZnQodGhpcy5wYXJzZShkYXRhKSlcbiAgICAgICAgdGhpcy5faGlzdG9yeS5zcGxpY2UodGhpcy5faGlzdGlvZ3JhbS5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfZGIoKSB7XG4gICAgbGV0IGRiID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpXG4gICAgdGhpcy5kYiA9IChkYilcbiAgICAgID8gZGJcbiAgICAgIDogJ3t9J1xuICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMuZGIpXG4gIH1cbiAgc2V0IF9kYihkYikge1xuICAgIGRiID0gSlNPTi5zdHJpbmdpZnkoZGIpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQsIGRiKVxuICB9XG4gIGdldCBfZGF0YSgpIHtcbiAgICB0aGlzLmRhdGEgPSAgKHRoaXMuZGF0YSlcbiAgICAgID8gdGhpcy5kYXRhXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YVxuICB9XG4gIGdldCBfZGF0YUV2ZW50cygpIHtcbiAgICB0aGlzLmRhdGFFdmVudHMgPSAodGhpcy5kYXRhRXZlbnRzKVxuICAgICAgPyB0aGlzLmRhdGFFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5kYXRhRXZlbnRzXG4gIH1cbiAgc2V0IF9kYXRhRXZlbnRzKGRhdGFFdmVudHMpIHtcbiAgICB0aGlzLmRhdGFFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgZGF0YUV2ZW50cywgdGhpcy5fZGF0YUV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2RhdGFDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5kYXRhQ2FsbGJhY2tzID0gKHRoaXMuZGF0YUNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5kYXRhQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YUNhbGxiYWNrc1xuICB9XG4gIHNldCBfZGF0YUNhbGxiYWNrcyhkYXRhQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5kYXRhQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGRhdGFDYWxsYmFja3MsIHRoaXMuX2RhdGFDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9zZXJ2aWNlcygpIHtcbiAgICB0aGlzLnNlcnZpY2VzID0gICh0aGlzLnNlcnZpY2VzKVxuICAgICAgPyB0aGlzLnNlcnZpY2VzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZXNcbiAgfVxuICBzZXQgX3NlcnZpY2VzKHNlcnZpY2VzKSB7XG4gICAgdGhpcy5zZXJ2aWNlcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBzZXJ2aWNlcywgdGhpcy5fc2VydmljZXNcbiAgICApXG4gIH1cbiAgZ2V0IF9zZXJ2aWNlRXZlbnRzKCkge1xuICAgIHRoaXMuc2VydmljZUV2ZW50cyA9ICh0aGlzLnNlcnZpY2VFdmVudHMpXG4gICAgICA/IHRoaXMuc2VydmljZUV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnNlcnZpY2VFdmVudHNcbiAgfVxuICBzZXQgX3NlcnZpY2VFdmVudHMoc2VydmljZUV2ZW50cykge1xuICAgIHRoaXMuc2VydmljZUV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBzZXJ2aWNlRXZlbnRzLCB0aGlzLl9zZXJ2aWNlRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfc2VydmljZUNhbGxiYWNrcygpIHtcbiAgICB0aGlzLnNlcnZpY2VDYWxsYmFja3MgPSAodGhpcy5zZXJ2aWNlQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLnNlcnZpY2VDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9zZXJ2aWNlQ2FsbGJhY2tzKHNlcnZpY2VDYWxsYmFja3MpIHtcbiAgICB0aGlzLnNlcnZpY2VDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgc2VydmljZUNhbGxiYWNrcywgdGhpcy5fc2VydmljZUNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZW5hYmxlU2VydmljZUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnNlcnZpY2VFdmVudHMsIHRoaXMuc2VydmljZXMsIHRoaXMuc2VydmljZUNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlU2VydmljZUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5zZXJ2aWNlRXZlbnRzLCB0aGlzLnNlcnZpY2VzLCB0aGlzLnNlcnZpY2VDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlRGF0YUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmRhdGFFdmVudHMsIHRoaXMsIHRoaXMuZGF0YUNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlRGF0YUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5kYXRhRXZlbnRzLCB0aGlzLCB0aGlzLmRhdGFDYWxsYmFja3MpXG4gIH1cbiAgc2V0RGVmYXVsdHMoKSB7XG4gICAgbGV0IF9kZWZhdWx0cyA9IHt9XG4gICAgaWYodGhpcy5kZWZhdWx0cykgT2JqZWN0LmFzc2lnbihfZGVmYXVsdHMsIHRoaXMuZGVmYXVsdHMpXG4gICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIE9iamVjdC5hc3NpZ24oX2RlZmF1bHRzLCB0aGlzLl9kYilcbiAgICBpZihPYmplY3Qua2V5cyhfZGVmYXVsdHMpKSB0aGlzLnNldChfZGVmYXVsdHMpXG4gIH1cbiAgZ2V0KCkge1xuICAgIGxldCBwcm9wZXJ0eSA9IGFyZ3VtZW50c1swXVxuICAgIHJldHVybiB0aGlzLl9kYXRhWydfJy5jb25jYXQocHJvcGVydHkpXVxuICB9XG4gIHNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICAgIC5mb3JFYWNoKChba2V5LCB2YWx1ZV0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIHRoaXMuc2V0REIoa2V5LCB2YWx1ZSlcbiAgICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICB2YXIga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHZhciB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy5zZXREQihrZXksIHZhbHVlKVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICB1bnNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5fZGF0YSkpIHtcbiAgICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBzZXREQigpIHtcbiAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHZhciBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGxldCB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgdGhpcy5fZGIgPSBkYlxuICB9XG4gIHVuc2V0REIoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZGVsZXRlIHRoaXMuX2RiXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgZGVsZXRlIGRiW2tleV1cbiAgICAgICAgdGhpcy5fZGIgPSBkYlxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBzZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSkge1xuICAgIGlmKCF0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV0pIHtcbiAgICAgIGxldCBjb250ZXh0ID0gdGhpc1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXG4gICAgICAgIHRoaXMuX2RhdGEsXG4gICAgICAgIHtcbiAgICAgICAgICBbJ18nLmNvbmNhdChrZXkpXToge1xuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpc1trZXldIH0sXG4gICAgICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgdGhpc1trZXldID0gdmFsdWVcbiAgICAgICAgICAgICAgbGV0IHNldFZhbHVlRXZlbnROYW1lID0gWydzZXQnLCAnOicsIGtleV0uam9pbignJylcbiAgICAgICAgICAgICAgbGV0IHNldEV2ZW50TmFtZSA9ICdzZXQnXG4gICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICBzZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBzZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApXG4gICAgfVxuICAgIHRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXSA9IHZhbHVlXG4gIH1cbiAgdW5zZXREYXRhUHJvcGVydHkoa2V5KSB7XG4gICAgbGV0IHVuc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3Vuc2V0JywgJzonLCBrZXldLmpvaW4oJycpXG4gICAgbGV0IHVuc2V0RXZlbnROYW1lID0gJ3Vuc2V0J1xuICAgIGxldCB1bnNldFZhbHVlID0gdGhpcy5fZGF0YVtrZXldXG4gICAgZGVsZXRlIHRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXVxuICAgIGRlbGV0ZSB0aGlzLl9kYXRhW2tleV1cbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldFZhbHVlRXZlbnROYW1lLFxuICAgICAge1xuICAgICAgICBuYW1lOiB1bnNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgdmFsdWU6IHVuc2V0VmFsdWUsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApXG4gICAgdGhpcy5lbWl0KFxuICAgICAgdW5zZXRFdmVudE5hbWUsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IHVuc2V0RXZlbnROYW1lLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgdmFsdWU6IHVuc2V0VmFsdWUsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApXG4gIH1cbiAgcGFyc2UoZGF0YSkge1xuICAgIGRhdGEgPSBkYXRhIHx8IHRoaXMuX2RhdGFcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShPYmplY3QuYXNzaWduKHt9LCBkYXRhKSkpXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICBpZih0aGlzLnNldHRpbmdzLmxvY2FsU3RvcmFnZSkgdGhpcy5fbG9jYWxTdG9yYWdlID0gdGhpcy5zZXR0aW5ncy5sb2NhbFN0b3JhZ2VcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuaGlzdGlvZ3JhbSkgdGhpcy5faGlzdGlvZ3JhbSA9IHRoaXMuc2V0dGluZ3MuaGlzdGlvZ3JhbVxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5lbWl0dGVycykgdGhpcy5fZW1pdHRlcnMgPSB0aGlzLnNldHRpbmdzLmVtaXR0ZXJzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnNlcnZpY2VzKSB0aGlzLl9zZXJ2aWNlcyA9IHRoaXMuc2V0dGluZ3Muc2VydmljZXNcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3Muc2VydmljZUNhbGxiYWNrcykgdGhpcy5fc2VydmljZUNhbGxiYWNrcyA9IHRoaXMuc2V0dGluZ3Muc2VydmljZUNhbGxiYWNrc1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5zZXJ2aWNlRXZlbnRzKSB0aGlzLl9zZXJ2aWNlRXZlbnRzID0gdGhpcy5zZXR0aW5ncy5zZXJ2aWNlRXZlbnRzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRhdGEpIHRoaXMuc2V0KHRoaXMuc2V0dGluZ3MuZGF0YSlcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGF0YUNhbGxiYWNrcykgdGhpcy5fZGF0YUNhbGxiYWNrcyA9IHRoaXMuc2V0dGluZ3MuZGF0YUNhbGxiYWNrc1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5kYXRhRXZlbnRzKSB0aGlzLl9kYXRhRXZlbnRzID0gdGhpcy5zZXR0aW5ncy5kYXRhRXZlbnRzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnNjaGVtYSkgdGhpcy5fc2NoZW1hID0gdGhpcy5zZXR0aW5ncy5zY2hlbWFcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMpIHRoaXMuX2RlZmF1bHRzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0c1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMuc2VydmljZXMgJiZcbiAgICAgICAgdGhpcy5zZXJ2aWNlRXZlbnRzICYmXG4gICAgICAgIHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlU2VydmljZUV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5kYXRhRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZGF0YUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlRGF0YUV2ZW50cygpXG4gICAgICB9XG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5zZXJ2aWNlcyAmJlxuICAgICAgICB0aGlzLnNlcnZpY2VFdmVudHMgJiZcbiAgICAgICAgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlU2VydmljZUV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5kYXRhRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZGF0YUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZURhdGFFdmVudHMoKVxuICAgICAgfVxuICAgICAgZGVsZXRlIHRoaXMuX2xvY2FsU3RvcmFnZVxuICAgICAgZGVsZXRlIHRoaXMuX2hpc3Rpb2dyYW1cbiAgICAgIGRlbGV0ZSB0aGlzLl9zZXJ2aWNlc1xuICAgICAgZGVsZXRlIHRoaXMuX3NlcnZpY2VDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9zZXJ2aWNlRXZlbnRzXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YVxuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhRXZlbnRzXG4gICAgICBkZWxldGUgdGhpcy5fc2NoZW1hXG4gICAgICBkZWxldGUgdGhpcy5fZW1pdHRlcnNcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgfVxufVxuIiwiTVZDLkVtaXR0ZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5Nb2RlbCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgICBpZih0aGlzLnNldHRpbmdzKSB7XHJcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MubmFtZSkgdGhpcy5fbmFtZSA9IHRoaXMuc2V0dGluZ3MubmFtZVxyXG4gICAgfVxyXG4gIH1cclxuICBnZXQgX25hbWUoKSB7IHJldHVybiB0aGlzLm5hbWUgfVxyXG4gIHNldCBfbmFtZShuYW1lKSB7IHRoaXMubmFtZSA9IG5hbWUgfVxyXG4gIGVtaXNzaW9uKCkge1xyXG4gICAgbGV0IGV2ZW50RGF0YSA9IHtcclxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxyXG4gICAgICBkYXRhOiB0aGlzLmRhdGFcclxuICAgIH1cclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgdGhpcy5uYW1lLFxyXG4gICAgICBldmVudERhdGFcclxuICAgIClcclxuICAgIHJldHVybiBldmVudERhdGFcclxuICB9XHJcbn1cclxuIiwiTVZDLkVtaXR0ZXJzID0ge31cclxuIiwiTVZDLkVtaXR0ZXJzLk5hdmlnYXRlRW1pdHRlciA9IGNsYXNzIGV4dGVuZHMgTVZDLkVtaXR0ZXIge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxyXG4gICAgdGhpcy5hZGRTZXR0aW5ncygpXHJcbiAgICB0aGlzLmVuYWJsZSgpXHJcbiAgfVxyXG4gIGFkZFNldHRpbmdzKCkge1xyXG4gICAgdGhpcy5fbmFtZSA9ICduYXZpZ2F0ZSdcclxuICAgIHRoaXMuX3NjaGVtYSA9IHtcclxuICAgICAgb2xkVVJMOiBTdHJpbmcsXHJcbiAgICAgIG5ld1VSTDogU3RyaW5nLFxyXG4gICAgICBjdXJyZW50Um91dGU6IFN0cmluZyxcclxuICAgICAgY3VycmVudENvbnRyb2xsZXI6IFN0cmluZyxcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiTVZDLlZpZXcgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfZWxlbWVudE5hbWUoKSB7IHJldHVybiB0aGlzLl9lbGVtZW50LnRhZ05hbWUgfVxuICBzZXQgX2VsZW1lbnROYW1lKGVsZW1lbnROYW1lKSB7XG4gICAgaWYoIXRoaXMuX2VsZW1lbnQpIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnROYW1lKVxuICB9XG4gIGdldCBfZWxlbWVudCgpIHsgcmV0dXJuIHRoaXMuZWxlbWVudCB9XG4gIHNldCBfZWxlbWVudChlbGVtZW50KSB7XG4gICAgaWYoXG4gICAgICBlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcbiAgICAgIGVsZW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFxuICAgICkge1xuICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxuICAgIH0gZWxzZSBpZih0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudClcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50T2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmVsZW1lbnQsIHtcbiAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgfSlcbiAgfVxuICBnZXQgX2F0dHJpYnV0ZXMoKSB7IHJldHVybiB0aGlzLl9lbGVtZW50LmF0dHJpYnV0ZXMgfVxuICBzZXQgX2F0dHJpYnV0ZXMoYXR0cmlidXRlcykge1xuICAgIGZvcihsZXQgW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpKSB7XG4gICAgICBpZih0eXBlb2YgYXR0cmlidXRlVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZUtleSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfdWkoKSB7XG4gICAgdGhpcy51aSA9ICh0aGlzLnVpKVxuICAgICAgPyB0aGlzLnVpXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudWlcbiAgfVxuICBzZXQgX3VpKHVpKSB7XG4gICAgaWYoIXRoaXMuX3VpWyckZWxlbWVudCddKSB0aGlzLl91aVsnJGVsZW1lbnQnXSA9IHRoaXMuZWxlbWVudFxuICAgIGZvcihsZXQgW3VpS2V5LCB1aVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh1aSkpIHtcbiAgICAgIGlmKHR5cGVvZiB1aVZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICB0aGlzLl91aVt1aUtleV0gPSB0aGlzLl9lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodWlWYWx1ZSlcbiAgICAgIH0gZWxzZSBpZihcbiAgICAgICAgdWlWYWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICAgIHVpVmFsdWUgaW5zdGFuY2VvZiBEb2N1bWVudFxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuX3VpW3VpS2V5XSA9IHVpVmFsdWVcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IF91aUV2ZW50cygpIHsgcmV0dXJuIHRoaXMudWlFdmVudHMgfVxuICBzZXQgX3VpRXZlbnRzKHVpRXZlbnRzKSB7IHRoaXMudWlFdmVudHMgPSB1aUV2ZW50cyB9XG4gIGdldCBfdWlDYWxsYmFja3MoKSB7XG4gICAgdGhpcy51aUNhbGxiYWNrcyA9ICh0aGlzLnVpQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudWlDYWxsYmFja3NcbiAgfVxuICBzZXQgX3VpQ2FsbGJhY2tzKHVpQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy51aUNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB1aUNhbGxiYWNrcywgdGhpcy5fdWlDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9vYnNlcnZlckNhbGxiYWNrcygpIHtcbiAgICB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzID0gKHRoaXMub2JzZXJ2ZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMub2JzZXJ2ZXJDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5vYnNlcnZlckNhbGxiYWNrc1xuICB9XG4gIHNldCBfb2JzZXJ2ZXJDYWxsYmFja3Mob2JzZXJ2ZXJDYWxsYmFja3MpIHtcbiAgICB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG9ic2VydmVyQ2FsbGJhY2tzLCB0aGlzLl9vYnNlcnZlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgZWxlbWVudE9ic2VydmVyKCkge1xuICAgIHRoaXMuX2VsZW1lbnRPYnNlcnZlciA9ICh0aGlzLl9lbGVtZW50T2JzZXJ2ZXIpXG4gICAgICA/IHRoaXMuX2VsZW1lbnRPYnNlcnZlclxuICAgICAgOiBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLmVsZW1lbnRPYnNlcnZlLmJpbmQodGhpcykpXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRPYnNlcnZlclxuICB9XG4gIGdldCBfaW5zZXJ0KCkgeyByZXR1cm4gdGhpcy5pbnNlcnQgfVxuICBzZXQgX2luc2VydChpbnNlcnQpIHsgdGhpcy5pbnNlcnQgPSBpbnNlcnQgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZ2V0IF90ZW1wbGF0ZXMoKSB7XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSAodGhpcy50ZW1wbGF0ZXMpXG4gICAgICA/IHRoaXMudGVtcGxhdGVzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGVzXG4gIH1cbiAgc2V0IF90ZW1wbGF0ZXModGVtcGxhdGVzKSB7XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdGVtcGxhdGVzLCB0aGlzLl90ZW1wbGF0ZXNcbiAgICApXG4gIH1cbiAgZWxlbWVudE9ic2VydmUobXV0YXRpb25SZWNvcmRMaXN0LCBvYnNlcnZlcikge1xuICAgIGZvcihsZXQgW211dGF0aW9uUmVjb3JkSW5kZXgsIG11dGF0aW9uUmVjb3JkXSBvZiBPYmplY3QuZW50cmllcyhtdXRhdGlvblJlY29yZExpc3QpKSB7XG4gICAgICBzd2l0Y2gobXV0YXRpb25SZWNvcmQudHlwZSkge1xuICAgICAgICBjYXNlICdjaGlsZExpc3QnOlxuICAgICAgICAgIGxldCBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMgPSBbJ2FkZGVkTm9kZXMnLCAncmVtb3ZlZE5vZGVzJ11cbiAgICAgICAgICBmb3IobGV0IG11dGF0aW9uUmVjb3JkQ2F0ZWdvcnkgb2YgbXV0YXRpb25SZWNvcmRDYXRlZ29yaWVzKSB7XG4gICAgICAgICAgICBpZihtdXRhdGlvblJlY29yZFttdXRhdGlvblJlY29yZENhdGVnb3J5XS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgdGhpcy5yZXNldFVJKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYXV0b0luc2VydCgpIHtcbiAgICBpZih0aGlzLmluc2VydCkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLmluc2VydC5lbGVtZW50KVxuICAgICAgLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgZWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQodGhpcy5pbnNlcnQubWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBhdXRvUmVtb3ZlKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5lbGVtZW50ICYmXG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICkgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICB9XG4gIGVuYWJsZUVsZW1lbnQoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihzZXR0aW5ncy5lbGVtZW50TmFtZSkgdGhpcy5fZWxlbWVudE5hbWUgPSBzZXR0aW5ncy5lbGVtZW50TmFtZVxuICAgIGlmKHNldHRpbmdzLmVsZW1lbnQpIHRoaXMuX2VsZW1lbnQgPSBzZXR0aW5ncy5lbGVtZW50XG4gICAgaWYoc2V0dGluZ3MuYXR0cmlidXRlcykgdGhpcy5fYXR0cmlidXRlcyA9IHNldHRpbmdzLmF0dHJpYnV0ZXNcbiAgICBpZihzZXR0aW5ncy50ZW1wbGF0ZXMpIHRoaXMuX3RlbXBsYXRlcyA9IHNldHRpbmdzLnRlbXBsYXRlc1xuICAgIGlmKHNldHRpbmdzLmluc2VydCkgdGhpcy5faW5zZXJ0ID0gc2V0dGluZ3MuaW5zZXJ0XG4gIH1cbiAgZGlzYWJsZUVsZW1lbnQoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHRoaXMuZWxlbWVudCAmJlxuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnRcbiAgICApIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcbiAgICBpZih0aGlzLmVsZW1lbnQpIGRlbGV0ZSB0aGlzLmVsZW1lbnRcbiAgICBpZih0aGlzLmF0dHJpYnV0ZXMpIGRlbGV0ZSB0aGlzLmF0dHJpYnV0ZXNcbiAgICBpZih0aGlzLnRlbXBsYXRlcykgZGVsZXRlIHRoaXMudGVtcGxhdGVzXG4gICAgaWYodGhpcy5pbnNlcnQpIGRlbGV0ZSB0aGlzLmluc2VydFxuICB9XG4gIHJlc2V0VUkoKSB7XG4gICAgdGhpcy5kaXNhYmxlVUkoKVxuICAgIHRoaXMuZW5hYmxlVUkoKVxuICB9XG4gIGVuYWJsZVVJKHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzXG4gICAgaWYoc2V0dGluZ3MudWkpIHRoaXMuX3VpID0gc2V0dGluZ3MudWlcbiAgICBpZihzZXR0aW5ncy51aUNhbGxiYWNrcykgdGhpcy5fdWlDYWxsYmFja3MgPSBzZXR0aW5ncy51aUNhbGxiYWNrc1xuICAgIGlmKHNldHRpbmdzLnVpRXZlbnRzKSB7XG4gICAgICB0aGlzLl91aUV2ZW50cyA9IHNldHRpbmdzLnVpRXZlbnRzXG4gICAgICB0aGlzLmVuYWJsZVVJRXZlbnRzKClcbiAgICB9XG4gIH1cbiAgZGlzYWJsZVVJKHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzXG4gICAgaWYoc2V0dGluZ3MudWlFdmVudHMpIHtcbiAgICAgIHRoaXMuZGlzYWJsZVVJRXZlbnRzKClcbiAgICAgIGRlbGV0ZSB0aGlzLl91aUV2ZW50c1xuICAgIH1cbiAgICBkZWxldGUgdGhpcy51aUV2ZW50c1xuICAgIGRlbGV0ZSB0aGlzLnVpXG4gICAgZGVsZXRlIHRoaXMudWlDYWxsYmFja3NcbiAgfVxuICBlbmFibGVVSUV2ZW50cygpIHtcbiAgICBpZihcbiAgICAgIHRoaXMudWlFdmVudHMgJiZcbiAgICAgIHRoaXMudWkgJiZcbiAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKFxuICAgICAgICB0aGlzLnVpRXZlbnRzLFxuICAgICAgICB0aGlzLnVpLFxuICAgICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgICApXG4gICAgfVxuICB9XG4gIGRpc2FibGVVSUV2ZW50cygpIHtcbiAgICBpZihcbiAgICAgIHRoaXMudWlFdmVudHMgJiZcbiAgICAgIHRoaXMudWkgJiZcbiAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyhcbiAgICAgICAgdGhpcy51aUV2ZW50cyxcbiAgICAgICAgdGhpcy51aSxcbiAgICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICAgKVxuICAgIH1cbiAgfVxuICBlbmFibGVFbWl0dGVycygpIHtcbiAgICBpZih0aGlzLnNldHRpbmdzLmVtaXR0ZXJzKSB0aGlzLl9lbWl0dGVycyA9IHRoaXMuc2V0dGluZ3MuZW1pdHRlcnNcbiAgfVxuICBkaXNhYmxlRW1pdHRlcnMoKSB7XG4gICAgaWYodGhpcy5fZW1pdHRlcnMpIGRlbGV0ZSB0aGlzLl9lbWl0dGVyc1xuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuX2VuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZW5hYmxlRW1pdHRlcnMoKVxuICAgICAgdGhpcy5lbmFibGVFbGVtZW50KHNldHRpbmdzKVxuICAgICAgdGhpcy5lbmFibGVVSShzZXR0aW5ncylcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICB0aGlzLl9lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLmRpc2FibGVVSShzZXR0aW5ncylcbiAgICAgIHRoaXMuZGlzYWJsZUVsZW1lbnQoc2V0dGluZ3MpXG4gICAgICB0aGlzLmRpc2FibGVFbWl0dGVycygpXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICAgIHJldHVybiB0aGlzc1xuICAgIH1cbiAgfVxufVxuIiwiTVZDLkNvbnRyb2xsZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfZW1pdHRlckNhbGxiYWNrcygpIHtcbiAgICB0aGlzLmVtaXR0ZXJDYWxsYmFja3MgPSAodGhpcy5lbWl0dGVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9lbWl0dGVyQ2FsbGJhY2tzKGVtaXR0ZXJDYWxsYmFja3MpIHtcbiAgICB0aGlzLmVtaXR0ZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgZW1pdHRlckNhbGxiYWNrcywgdGhpcy5fZW1pdHRlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVsQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMubW9kZWxDYWxsYmFja3MgPSAodGhpcy5tb2RlbENhbGxiYWNrcylcbiAgICAgID8gdGhpcy5tb2RlbENhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm1vZGVsQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9tb2RlbENhbGxiYWNrcyhtb2RlbENhbGxiYWNrcykge1xuICAgIHRoaXMubW9kZWxDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgbW9kZWxDYWxsYmFja3MsIHRoaXMuX21vZGVsQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfdmlld0NhbGxiYWNrcygpIHtcbiAgICB0aGlzLnZpZXdDYWxsYmFja3MgPSAodGhpcy52aWV3Q2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLnZpZXdDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy52aWV3Q2FsbGJhY2tzXG4gIH1cbiAgc2V0IF92aWV3Q2FsbGJhY2tzKHZpZXdDYWxsYmFja3MpIHtcbiAgICB0aGlzLnZpZXdDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld0NhbGxiYWNrcywgdGhpcy5fdmlld0NhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzID0gKHRoaXMuY29udHJvbGxlckNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICB9XG4gIHNldCBfY29udHJvbGxlckNhbGxiYWNrcyhjb250cm9sbGVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGNvbnRyb2xsZXJDYWxsYmFja3MsIHRoaXMuX2NvbnRyb2xsZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9tb2RlbHMoKSB7XG4gICAgdGhpcy5tb2RlbHMgPSAodGhpcy5tb2RlbHMpXG4gICAgICA/IHRoaXMubW9kZWxzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMubW9kZWxzXG4gIH1cbiAgc2V0IF9tb2RlbHMobW9kZWxzKSB7XG4gICAgdGhpcy5tb2RlbHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgbW9kZWxzLCB0aGlzLl9tb2RlbHNcbiAgICApXG4gIH1cbiAgZ2V0IF92aWV3cygpIHtcbiAgICB0aGlzLnZpZXdzID0gKHRoaXMudmlld3MpXG4gICAgICA/IHRoaXMudmlld3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy52aWV3c1xuICB9XG4gIHNldCBfdmlld3Modmlld3MpIHtcbiAgICB0aGlzLnZpZXdzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHZpZXdzLCB0aGlzLl92aWV3c1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXJzKCkge1xuICAgIHRoaXMuY29udHJvbGxlcnMgPSAodGhpcy5jb250cm9sbGVycylcbiAgICAgID8gdGhpcy5jb250cm9sbGVyc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJzXG4gIH1cbiAgc2V0IF9jb250cm9sbGVycyhjb250cm9sbGVycykge1xuICAgIHRoaXMuY29udHJvbGxlcnMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlcnMsIHRoaXMuX2NvbnRyb2xsZXJzXG4gICAgKVxuICB9XG4gIGdldCBfcm91dGVycygpIHtcbiAgICB0aGlzLnJvdXRlcnMgPSAodGhpcy5yb3V0ZXJzKVxuICAgICAgPyB0aGlzLnJvdXRlcnNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXJzXG4gIH1cbiAgc2V0IF9yb3V0ZXJzKHJvdXRlcnMpIHtcbiAgICB0aGlzLnJvdXRlcnMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgcm91dGVycywgdGhpcy5fcm91dGVyc1xuICAgIClcbiAgfVxuICBnZXQgX3JvdXRlckV2ZW50cygpIHtcbiAgICB0aGlzLnJvdXRlckV2ZW50cyA9ICh0aGlzLnJvdXRlckV2ZW50cylcbiAgICAgID8gdGhpcy5yb3V0ZXJFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXJFdmVudHNcbiAgfVxuICBzZXQgX3JvdXRlckV2ZW50cyhyb3V0ZXJFdmVudHMpIHtcbiAgICB0aGlzLnJvdXRlckV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXJFdmVudHMsIHRoaXMuX3JvdXRlckV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX3JvdXRlckNhbGxiYWNrcygpIHtcbiAgICB0aGlzLnJvdXRlckNhbGxiYWNrcyA9ICh0aGlzLnJvdXRlckNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX3JvdXRlckNhbGxiYWNrcyhyb3V0ZXJDYWxsYmFja3MpIHtcbiAgICB0aGlzLnJvdXRlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXJDYWxsYmFja3MsIHRoaXMuX3JvdXRlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX2VtaXR0ZXJFdmVudHMoKSB7XG4gICAgdGhpcy5lbWl0dGVyRXZlbnRzID0gKHRoaXMuZW1pdHRlckV2ZW50cylcbiAgICAgID8gdGhpcy5lbWl0dGVyRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlckV2ZW50c1xuICB9XG4gIHNldCBfZW1pdHRlckV2ZW50cyhlbWl0dGVyRXZlbnRzKSB7XG4gICAgdGhpcy5lbWl0dGVyRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGVtaXR0ZXJFdmVudHMsIHRoaXMuX2VtaXR0ZXJFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9tb2RlbEV2ZW50cygpIHtcbiAgICB0aGlzLm1vZGVsRXZlbnRzID0gKHRoaXMubW9kZWxFdmVudHMpXG4gICAgICA/IHRoaXMubW9kZWxFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5tb2RlbEV2ZW50c1xuICB9XG4gIHNldCBfbW9kZWxFdmVudHMobW9kZWxFdmVudHMpIHtcbiAgICB0aGlzLm1vZGVsRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG1vZGVsRXZlbnRzLCB0aGlzLl9tb2RlbEV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX3ZpZXdFdmVudHMoKSB7XG4gICAgdGhpcy52aWV3RXZlbnRzID0gKHRoaXMudmlld0V2ZW50cylcbiAgICAgID8gdGhpcy52aWV3RXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudmlld0V2ZW50c1xuICB9XG4gIHNldCBfdmlld0V2ZW50cyh2aWV3RXZlbnRzKSB7XG4gICAgdGhpcy52aWV3RXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHZpZXdFdmVudHMsIHRoaXMuX3ZpZXdFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9jb250cm9sbGVyRXZlbnRzKCkge1xuICAgIHRoaXMuY29udHJvbGxlckV2ZW50cyA9ICh0aGlzLmNvbnRyb2xsZXJFdmVudHMpXG4gICAgICA/IHRoaXMuY29udHJvbGxlckV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJFdmVudHNcbiAgfVxuICBzZXQgX2NvbnRyb2xsZXJFdmVudHMoY29udHJvbGxlckV2ZW50cykge1xuICAgIHRoaXMuY29udHJvbGxlckV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBjb250cm9sbGVyRXZlbnRzLCB0aGlzLl9jb250cm9sbGVyRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICBlbmFibGVNb2RlbEV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLm1vZGVsRXZlbnRzLCB0aGlzLm1vZGVscywgdGhpcy5tb2RlbENhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlTW9kZWxFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMubW9kZWxFdmVudHMsIHRoaXMubW9kZWxzLCB0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZVZpZXdFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy52aWV3RXZlbnRzLCB0aGlzLnZpZXdzLCB0aGlzLnZpZXdDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZVZpZXdFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMudmlld0V2ZW50cywgdGhpcy52aWV3cywgdGhpcy52aWV3Q2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZUNvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5jb250cm9sbGVyRXZlbnRzLCB0aGlzLmNvbnRyb2xsZXJzLCB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZUNvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMuY29udHJvbGxlckV2ZW50cywgdGhpcy5jb250cm9sbGVycywgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZUVtaXR0ZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5lbWl0dGVyRXZlbnRzLCB0aGlzLmVtaXR0ZXJzLCB0aGlzLmVtaXR0ZXJDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZUVtaXR0ZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMuZW1pdHRlckV2ZW50cywgdGhpcy5lbWl0dGVycywgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZVJvdXRlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnJvdXRlckV2ZW50cywgdGhpcy5yb3V0ZXJzLCB0aGlzLnJvdXRlckNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlUm91dGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyh0aGlzLnJvdXRlckV2ZW50cywgdGhpcy5yb3V0ZXJzLCB0aGlzLnJvdXRlckNhbGxiYWNrcylcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKHNldHRpbmdzLm1vZGVsQ2FsbGJhY2tzKSB0aGlzLl9tb2RlbENhbGxiYWNrcyA9IHNldHRpbmdzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy52aWV3Q2FsbGJhY2tzKSB0aGlzLl92aWV3Q2FsbGJhY2tzID0gc2V0dGluZ3Mudmlld0NhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3MuY29udHJvbGxlckNhbGxiYWNrcykgdGhpcy5fY29udHJvbGxlckNhbGxiYWNrcyA9IHNldHRpbmdzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLmVtaXR0ZXJDYWxsYmFja3MpIHRoaXMuX2VtaXR0ZXJDYWxsYmFja3MgPSBzZXR0aW5ncy5lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5yb3V0ZXJDYWxsYmFja3MpIHRoaXMuX3JvdXRlckNhbGxiYWNrcyA9IHNldHRpbmdzLnJvdXRlckNhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3MubW9kZWxzKSB0aGlzLl9tb2RlbHMgPSBzZXR0aW5ncy5tb2RlbHNcbiAgICAgIGlmKHNldHRpbmdzLnZpZXdzKSB0aGlzLl92aWV3cyA9IHNldHRpbmdzLnZpZXdzXG4gICAgICBpZihzZXR0aW5ncy5jb250cm9sbGVycykgdGhpcy5fY29udHJvbGxlcnMgPSBzZXR0aW5ncy5jb250cm9sbGVyc1xuICAgICAgaWYoc2V0dGluZ3MuZW1pdHRlcnMpIHRoaXMuX2VtaXR0ZXJzID0gc2V0dGluZ3MuZW1pdHRlcnNcbiAgICAgIGlmKHNldHRpbmdzLnJvdXRlcnMpIHRoaXMuX3JvdXRlcnMgPSBzZXR0aW5ncy5yb3V0ZXJzXG4gICAgICBpZihzZXR0aW5ncy5yb3V0ZXJFdmVudHMpIHRoaXMuX3JvdXRlckV2ZW50cyA9IHNldHRpbmdzLnJvdXRlckV2ZW50c1xuICAgICAgaWYoc2V0dGluZ3MubW9kZWxFdmVudHMpIHRoaXMuX21vZGVsRXZlbnRzID0gc2V0dGluZ3MubW9kZWxFdmVudHNcbiAgICAgIGlmKHNldHRpbmdzLnZpZXdFdmVudHMpIHRoaXMuX3ZpZXdFdmVudHMgPSBzZXR0aW5ncy52aWV3RXZlbnRzXG4gICAgICBpZihzZXR0aW5ncy5jb250cm9sbGVyRXZlbnRzKSB0aGlzLl9jb250cm9sbGVyRXZlbnRzID0gc2V0dGluZ3MuY29udHJvbGxlckV2ZW50c1xuICAgICAgaWYoc2V0dGluZ3MuZW1pdHRlckV2ZW50cykgdGhpcy5fZW1pdHRlckV2ZW50cyA9IHNldHRpbmdzLmVtaXR0ZXJFdmVudHNcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLm1vZGVsRXZlbnRzICYmXG4gICAgICAgIHRoaXMubW9kZWxzICYmXG4gICAgICAgIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZU1vZGVsRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnZpZXdFdmVudHMgJiZcbiAgICAgICAgdGhpcy52aWV3cyAmJlxuICAgICAgICB0aGlzLnZpZXdDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZVZpZXdFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuY29udHJvbGxlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlQ29udHJvbGxlckV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5yb3V0ZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5yb3V0ZXJzICYmXG4gICAgICAgIHRoaXMucm91dGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5lbmFibGVSb3V0ZXJFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuZW1pdHRlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLmVtaXR0ZXJzICYmXG4gICAgICAgIHRoaXMuZW1pdHRlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlRW1pdHRlckV2ZW50cygpXG4gICAgICB9XG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICByZXNldCgpIHtcbiAgICB0aGlzLmRpc2FibGUoKVxuICAgIHRoaXMuZW5hYmxlKClcbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICB0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLm1vZGVsRXZlbnRzICYmXG4gICAgICAgIHRoaXMubW9kZWxzICYmXG4gICAgICAgIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVNb2RlbEV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy52aWV3RXZlbnRzICYmXG4gICAgICAgIHRoaXMudmlld3MgJiZcbiAgICAgICAgdGhpcy52aWV3Q2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlVmlld0V2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5jb250cm9sbGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlQ29udHJvbGxlckV2ZW50cygpXG4gICAgICB9fVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMucm91dGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMucm91dGVycyAmJlxuICAgICAgICB0aGlzLnJvdXRlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZVJvdXRlckV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5lbWl0dGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZW1pdHRlcnMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlRW1pdHRlckV2ZW50cygpXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9tb2RlbENhbGxiYWNrc1xuICAgICAgICBkZWxldGUgdGhpcy5fdmlld0NhbGxiYWNrc1xuICAgICAgICBkZWxldGUgdGhpcy5fY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgICBkZWxldGUgdGhpcy5fZW1pdHRlckNhbGxiYWNrc1xuICAgICAgICBkZWxldGUgdGhpcy5fcm91dGVyQ2FsbGJhY2tzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9tb2RlbHNcbiAgICAgICAgZGVsZXRlIHRoaXMuX3ZpZXdzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyc1xuICAgICAgICBkZWxldGUgdGhpcy5fZW1pdHRlcnNcbiAgICAgICAgZGVsZXRlIHRoaXMuX3JvdXRlcnNcbiAgICAgICAgZGVsZXRlIHRoaXMuX3JvdXRlckV2ZW50c1xuICAgICAgICBkZWxldGUgdGhpcy5fbW9kZWxFdmVudHNcbiAgICAgICAgZGVsZXRlIHRoaXMuX3ZpZXdFdmVudHNcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJFdmVudHNcbiAgICAgICAgZGVsZXRlIHRoaXMuX2VtaXR0ZXJFdmVudHNcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgfVxufVxuIiwiTVZDLlJvdXRlciA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IHJvdXRlKCkge1xuICAgIGlmKHRoaXMuX2hhc2gpIHtcbiAgICAgIHJldHVybiBTdHJpbmcod2luZG93LmxvY2F0aW9uLmhhc2gpLnNwbGl0KCcjJykucG9wKClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFN0cmluZyh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpXG4gICAgfVxuICB9XG4gIGdldCBfaGFzaCgpIHsgcmV0dXJuIHRoaXMuaGFzaCB9XG4gIHNldCBfaGFzaChoYXNoKSB7IHRoaXMuaGFzaCA9IGhhc2ggfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZ2V0IF9yb3V0ZXMoKSB7XG4gICAgdGhpcy5yb3V0ZXMgPSAodGhpcy5yb3V0ZXMpXG4gICAgICA/IHRoaXMucm91dGVzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVzXG4gIH1cbiAgc2V0IF9yb3V0ZXMocm91dGVzKSB7XG4gICAgdGhpcy5yb3V0ZXMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgcm91dGVzLCB0aGlzLl9yb3V0ZXNcbiAgICApXG4gIH1cbiAgZ2V0IF9jb250cm9sbGVyKCkgeyByZXR1cm4gdGhpcy5jb250cm9sbGVyIH1cbiAgc2V0IF9jb250cm9sbGVyKGNvbnRyb2xsZXIpIHsgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlciB9XG4gIGdldCBfcHJldmlvdXNVUkwoKSB7IHJldHVybiB0aGlzLnByZXZpb3VzVVJMIH1cbiAgc2V0IF9wcmV2aW91c1VSTChwcmV2aW91c1VSTCkgeyB0aGlzLnByZXZpb3VzVVJMID0gcHJldmlvdXNVUkwgfVxuICBnZXQgX2N1cnJlbnRVUkwoKSB7IHJldHVybiB0aGlzLmN1cnJlbnRVUkwgfVxuICBzZXQgX2N1cnJlbnRVUkwoY3VycmVudFVSTCkgeyB0aGlzLmN1cnJlbnRVUkwgPSBjdXJyZW50VVJMIH1cbiAgZ2V0IGZyYWdtZW50SURSZWdFeHAoKSB7IHJldHVybiBuZXcgUmVnRXhwKC9eKFswLTlBLVpcXD9cXD1cXCxcXC5cXCpcXC1cXF9cXCdcXFwiXFxeXFwlXFwkXFwjXFxAXFwhXFx+XFwoXFwpXFx7XFx9XFwmXFw8XFw+XFxcXFxcL10pKiQvLCAnZ2knKSB9XG4gIGZyYWdtZW50TmFtZVJlZ0V4cChmcmFnbWVudCkgeyByZXR1cm4gbmV3IFJlZ0V4cCgnXicuY29uY2F0KGZyYWdtZW50LCAnJCcpKSB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5faGFzaCA9ICh0eXBlb2YgdGhpcy5zZXR0aW5ncy5oYXNoID09PSAnYm9vbGVhbicpXG4gICAgICAgID8gdGhpcy5zZXR0aW5ncy5oYXNoXG4gICAgICAgIDogdHJ1ZVxuICAgICAgdGhpcy5lbmFibGVFbWl0dGVycygpXG4gICAgICB0aGlzLmVuYWJsZUV2ZW50cygpXG4gICAgICB0aGlzLmVuYWJsZVJvdXRlcygpXG4gICAgICB0aGlzLnJvdXRlQ2hhbmdlKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgfVxuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgIHRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgZGVsZXRlIHRoaXMuX2hhc2hcbiAgICAgIHRoaXMuZGlzYWJsZUV2ZW50cygpXG4gICAgICB0aGlzLmRpc2FibGVSb3V0ZXMoKVxuICAgICAgdGhpcy5kaXNhYmxlRW1pdHRlcnMoKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICB9XG4gIGVuYWJsZVJvdXRlcygpIHtcbiAgICBpZih0aGlzLnNldHRpbmdzLmNvbnRyb2xsZXIpIHRoaXMuX2NvbnRyb2xsZXIgPSB0aGlzLnNldHRpbmdzLmNvbnRyb2xsZXJcbiAgICB0aGlzLl9yb3V0ZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnNldHRpbmdzLnJvdXRlcykucmVkdWNlKFxuICAgICAgKFxuICAgICAgICBfcm91dGVzLFxuICAgICAgICBbcm91dGVQYXRoLCByb3V0ZUNhbGxiYWNrXSxcbiAgICAgICAgcm91dGVJbmRleCxcbiAgICAgICAgb3JpZ2luYWxSb3V0ZXMsXG4gICAgICApID0+IHtcbiAgICAgICAgX3JvdXRlc1tyb3V0ZVBhdGhdID0gdGhpcy5jb250cm9sbGVyW3JvdXRlQ2FsbGJhY2tdLmJpbmQodGhpcy5jb250cm9sbGVyKVxuICAgICAgICByZXR1cm4gX3JvdXRlc1xuICAgICAgfSxcbiAgICAgIHt9XG4gICAgKVxuICAgIHJldHVyblxuICB9XG4gIGVuYWJsZUVtaXR0ZXJzKCkge1xuICAgIHRoaXMuX2VtaXR0ZXJzID0ge1xuICAgICAgbmF2aWdhdGVFbWl0dGVyOiBuZXcgTVZDLkVtaXR0ZXJzLk5hdmlnYXRlRW1pdHRlcigpLFxuICAgIH1cbiAgfVxuICBkaXNhYmxlRW1pdHRlcnMoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2VtaXR0ZXJzLm5hdmlnYXRlRW1pdHRlclxuICB9XG4gIGRpc2FibGVSb3V0ZXMoKSB7XG4gICAgZGVsZXRlIHRoaXMuX3JvdXRlc1xuICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyXG4gIH1cbiAgZW5hYmxlRXZlbnRzKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgdGhpcy5yb3V0ZUNoYW5nZS5iaW5kKHRoaXMpKVxuICB9XG4gIGRpc2FibGVFdmVudHMoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLnJvdXRlQ2hhbmdlLmJpbmQodGhpcykpXG4gIH1cbiAgcm91dGVDaGFuZ2UoKSB7XG4gICAgbGV0IHJvdXRlID0gdGhpcy5yb3V0ZS5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICByb3V0ZSA9IChyb3V0ZS5sZW5ndGgpXG4gICAgICA/IHJvdXRlXG4gICAgICA6IFsnLyddXG4gICAgbGV0IHJvdXRlQ29udHJvbGxlckRhdGEgPSBPYmplY3QuZW50cmllcyh0aGlzLnJvdXRlcylcbiAgICAgIC5maWx0ZXIoKFtyb3V0ZXJQYXRoLCByb3V0ZXJDb250cm9sbGVyXSkgPT4ge1xuICAgICAgICByb3V0ZXJQYXRoID0gcm91dGVyUGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgICAgcm91dGVyUGF0aCA9IChyb3V0ZXJQYXRoLmxlbmd0aClcbiAgICAgICAgICA/IHJvdXRlclBhdGhcbiAgICAgICAgICA6IFsnLyddXG4gICAgICAgIGlmKFxuICAgICAgICAgIHJvdXRlLmxlbmd0aCAmJlxuICAgICAgICAgIHJvdXRlLmxlbmd0aCA9PT0gcm91dGVyUGF0aC5sZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgcm91dGVyUGF0aFxuICAgICAgICAgIGxldCBtYXRjaFxuICAgICAgICAgIHJldHVybiByb3V0ZXJQYXRoLmZpbHRlcigoZnJhZ21lbnQsIGZyYWdtZW50SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICBtYXRjaCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICAgIG1hdGNoID09PSB0cnVlXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgaWYoZnJhZ21lbnRbMF0gPT09ICc6Jykge1xuICAgICAgICAgICAgICAgIGZyYWdtZW50ID0gdGhpcy5mcmFnbWVudElEUmVnRXhwXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZnJhZ21lbnQgPSBmcmFnbWVudC5yZXBsYWNlKG5ldyBSZWdFeHAoJy8nLCAnZ2knKSwgJ1xcXFxcXC8nKVxuICAgICAgICAgICAgICAgIGZyYWdtZW50ID0gdGhpcy5mcmFnbWVudE5hbWVSZWdFeHAoZnJhZ21lbnQpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbWF0Y2ggPSBmcmFnbWVudC50ZXN0KHJvdXRlW2ZyYWdtZW50SW5kZXhdKVxuICAgICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICBtYXRjaCA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgICAgIGZyYWdtZW50SW5kZXggPT09IHJvdXRlLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvdXRlckNvbnRyb2xsZXJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pWzBdXG4gICAgICAgIH1cbiAgICAgIH0pWzBdXG4gICAgdHJ5IHtcbiAgICAgIGlmKHRoaXMuY3VycmVudFVSTCkgdGhpcy5fcHJldmlvdXNVUkwgPSB0aGlzLmN1cnJlbnRVUkxcbiAgICAgIHRoaXMuX2N1cnJlbnRVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgICAgbGV0IHJvdXRlQ29udHJvbGxlck5hbWUgPSByb3V0ZUNvbnRyb2xsZXJEYXRhWzBdXG4gICAgICBsZXQgcm91dGVDb250cm9sbGVyID0gcm91dGVDb250cm9sbGVyRGF0YVsxXVxuICAgICAgbGV0IG5hdmlnYXRlRW1pdHRlciA9IHRoaXMuZW1pdHRlcnMubmF2aWdhdGVFbWl0dGVyXG4gICAgICBsZXQgbmF2aWdhdGVFbWl0dGVyRGF0YSA9IHtcbiAgICAgICAgY3VycmVudFVSTDogdGhpcy5jdXJyZW50VVJMLFxuICAgICAgICBwcmV2aW91c1VSTDogdGhpcy5wcmV2aW91c1VSTCxcbiAgICAgICAgY3VycmVudFJvdXRlOiB0aGlzLnJvdXRlLFxuICAgICAgICBjdXJyZW50Q29udHJvbGxlcjogcm91dGVDb250cm9sbGVyLm5hbWVcbiAgICAgIH1cbiAgICAgIG5hdmlnYXRlRW1pdHRlci5zZXQobmF2aWdhdGVFbWl0dGVyRGF0YSlcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgbmF2aWdhdGVFbWl0dGVyLm5hbWUsXG4gICAgICAgIG5hdmlnYXRlRW1pdHRlci5lbWlzc2lvbigpXG4gICAgICApXG4gICAgICByb3V0ZUNvbnRyb2xsZXIobmF2aWdhdGVFbWl0dGVyLmVtaXNzaW9uKCkpXG4gICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgdGhyb3cgZXJyb3JcbiAgICB9XG4gIH1cbiAgbmF2aWdhdGUocGF0aCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gcGF0aFxuICB9XG59XG4iXX0=
