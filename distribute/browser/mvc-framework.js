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

    for (var header of headers) {
      this._xhr.setRequestHeader({
        header
      }[0], {
        header
      }[1]);

      this._headers.push(header);
    }
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
      _routes[routePath] = this.controller[routeCallback];
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
      throw 'Route Definition Error';
    }
  }

  navigate(path) {
    window.location.hash = path;
  }

};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1WQy5qcyIsIkNvbnN0YW50cy5qcyIsIkV2ZW50cy5qcyIsIlRlbXBsYXRlcy5qcyIsIlV0aWxzLmpzIiwiaXMuanMiLCJ0eXBlT2YuanMiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QuanMiLCJvYmplY3RRdWVyeS5qcyIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMuanMiLCJ2YWxpZGF0ZURhdGFTY2hlbWEuanMiLCJDaGFubmVscy5qcyIsIkNoYW5uZWwuanMiLCJCYXNlLmpzIiwiU2VydmljZS5qcyIsIk1vZGVsLmpzIiwiRW1pdHRlci5qcyIsImluZGV4LmpzIiwiTmF2aWdhdGUuanMiLCJWaWV3LmpzIiwiQ29udHJvbGxlci5qcyIsIlJvdXRlci5qcyJdLCJuYW1lcyI6WyJNVkMiLCJDb25zdGFudHMiLCJDT05TVCIsIkV2ZW50cyIsIkVWIiwiVGVtcGxhdGVzIiwiT2JqZWN0UXVlcnlTdHJpbmdGb3JtYXRJbnZhbGlkUm9vdCIsIk9iamVjdFF1ZXJ5U3RyaW5nRm9ybWF0SW52YWxpZCIsImRhdGEiLCJqb2luIiwiRGF0YVNjaGVtYU1pc21hdGNoIiwiRGF0YUZ1bmN0aW9uSW52YWxpZCIsIkRhdGFVbmRlZmluZWQiLCJTY2hlbWFVbmRlZmluZWQiLCJUTVBMIiwiVXRpbHMiLCJpc0FycmF5Iiwib2JqZWN0IiwiQXJyYXkiLCJpc09iamVjdCIsImlzRXF1YWxUeXBlIiwidmFsdWVBIiwidmFsdWVCIiwiaXNIVE1MRWxlbWVudCIsIkhUTUxFbGVtZW50IiwidHlwZU9mIiwiX29iamVjdCIsImFkZFByb3BlcnRpZXNUb09iamVjdCIsInRhcmdldE9iamVjdCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInByb3BlcnRpZXMiLCJwcm9wZXJ0eU5hbWUiLCJwcm9wZXJ0eVZhbHVlIiwiT2JqZWN0IiwiZW50cmllcyIsIm9iamVjdFF1ZXJ5Iiwic3RyaW5nIiwiY29udGV4dCIsInN0cmluZ0RhdGEiLCJwYXJzZU5vdGF0aW9uIiwic3BsaWNlIiwicmVkdWNlIiwiZnJhZ21lbnQiLCJmcmFnbWVudEluZGV4IiwiZnJhZ21lbnRzIiwicGFyc2VGcmFnbWVudCIsInByb3BlcnR5S2V5IiwibWF0Y2giLCJjb25jYXQiLCJjaGFyQXQiLCJzbGljZSIsInNwbGl0IiwiUmVnRXhwIiwidG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyIsInRvZ2dsZU1ldGhvZCIsImV2ZW50cyIsInRhcmdldE9iamVjdHMiLCJjYWxsYmFja3MiLCJldmVudFNldHRpbmdzIiwiZXZlbnRDYWxsYmFja05hbWUiLCJldmVudERhdGEiLCJldmVudFRhcmdldFNldHRpbmdzIiwiZXZlbnROYW1lIiwiZXZlbnRUYXJnZXRzIiwiZXZlbnRUYXJnZXROYW1lIiwiZXZlbnRUYXJnZXQiLCJldmVudE1ldGhvZE5hbWUiLCJOb2RlTGlzdCIsIkRvY3VtZW50IiwiZXZlbnRDYWxsYmFjayIsIl9ldmVudFRhcmdldCIsImJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMiLCJ1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyIsInZhbGlkYXRlRGF0YVNjaGVtYSIsInNjaGVtYSIsImFycmF5IiwiY29uc29sZSIsImxvZyIsIm5hbWUiLCJhcnJheUtleSIsImFycmF5VmFsdWUiLCJwdXNoIiwib2JqZWN0S2V5Iiwib2JqZWN0VmFsdWUiLCJjb25zdHJ1Y3RvciIsIl9ldmVudHMiLCJldmVudENhbGxiYWNrcyIsImV2ZW50Q2FsbGJhY2tHcm91cCIsIm9uIiwib2ZmIiwiZW1pdCIsImV2ZW50Q2FsbGJhY2tHcm91cE5hbWUiLCJhZGRpdGlvbmFsQXJndW1lbnRzIiwidmFsdWVzIiwiQ2hhbm5lbHMiLCJfY2hhbm5lbHMiLCJjaGFubmVscyIsImNoYW5uZWwiLCJjaGFubmVsTmFtZSIsIkNoYW5uZWwiLCJfcmVzcG9uc2VzIiwicmVzcG9uc2VzIiwicmVzcG9uc2UiLCJyZXNwb25zZU5hbWUiLCJyZXNwb25zZUNhbGxiYWNrIiwicmVxdWVzdCIsInJlcXVlc3REYXRhIiwia2V5cyIsIkJhc2UiLCJzZXR0aW5ncyIsImNvbmZpZ3VyYXRpb24iLCJfY29uZmlndXJhdGlvbiIsIl9zZXR0aW5ncyIsIl9lbWl0dGVycyIsImVtaXR0ZXJzIiwiU2VydmljZSIsIl9kZWZhdWx0cyIsImRlZmF1bHRzIiwiY29udGVudFR5cGUiLCJyZXNwb25zZVR5cGUiLCJfcmVzcG9uc2VUeXBlcyIsIl9yZXNwb25zZVR5cGUiLCJfeGhyIiwiZmluZCIsInJlc3BvbnNlVHlwZUl0ZW0iLCJfdHlwZSIsInR5cGUiLCJfdXJsIiwidXJsIiwiX2hlYWRlcnMiLCJoZWFkZXJzIiwiaGVhZGVyIiwic2V0UmVxdWVzdEhlYWRlciIsIl9kYXRhIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJfZW5hYmxlZCIsImVuYWJsZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInN0YXR1cyIsImFib3J0Iiwib3BlbiIsIm9ubG9hZCIsIm9uZXJyb3IiLCJzZW5kIiwidGhlbiIsImN1cnJlbnRUYXJnZXQiLCJlbmFibGUiLCJkaXNhYmxlIiwiTW9kZWwiLCJfbG9jYWxTdG9yYWdlIiwibG9jYWxTdG9yYWdlIiwiX3NjaGVtYSIsIl9oaXN0aW9ncmFtIiwiaGlzdGlvZ3JhbSIsImFzc2lnbiIsIl9oaXN0b3J5IiwiaGlzdG9yeSIsInVuc2hpZnQiLCJwYXJzZSIsIl9kYiIsImRiIiwiZ2V0SXRlbSIsImVuZHBvaW50IiwiSlNPTiIsInN0cmluZ2lmeSIsInNldEl0ZW0iLCJfZGF0YUV2ZW50cyIsImRhdGFFdmVudHMiLCJfZGF0YUNhbGxiYWNrcyIsImRhdGFDYWxsYmFja3MiLCJfc2VydmljZXMiLCJzZXJ2aWNlcyIsIl9zZXJ2aWNlRXZlbnRzIiwic2VydmljZUV2ZW50cyIsIl9zZXJ2aWNlQ2FsbGJhY2tzIiwic2VydmljZUNhbGxiYWNrcyIsImVuYWJsZVNlcnZpY2VFdmVudHMiLCJkaXNhYmxlU2VydmljZUV2ZW50cyIsImVuYWJsZURhdGFFdmVudHMiLCJkaXNhYmxlRGF0YUV2ZW50cyIsInNldERlZmF1bHRzIiwic2V0IiwiZ2V0IiwicHJvcGVydHkiLCJmb3JFYWNoIiwiaW5kZXgiLCJrZXkiLCJ2YWx1ZSIsInNldERhdGFQcm9wZXJ0eSIsInNldERCIiwidW5zZXQiLCJ1bnNldERhdGFQcm9wZXJ0eSIsIl9hcmd1bWVudHMiLCJ1bnNldERCIiwiZGVmaW5lUHJvcGVydGllcyIsImNvbmZpZ3VyYWJsZSIsInNldFZhbHVlRXZlbnROYW1lIiwic2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZUV2ZW50TmFtZSIsInVuc2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZSIsIkVtaXR0ZXIiLCJfbmFtZSIsImVtaXNzaW9uIiwiRW1pdHRlcnMiLCJOYXZpZ2F0ZUVtaXR0ZXIiLCJhZGRTZXR0aW5ncyIsIm9sZFVSTCIsIlN0cmluZyIsIm5ld1VSTCIsImN1cnJlbnRSb3V0ZSIsImN1cnJlbnRDb250cm9sbGVyIiwiVmlldyIsIl9lbGVtZW50TmFtZSIsIl9lbGVtZW50IiwidGFnTmFtZSIsImVsZW1lbnROYW1lIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJlbGVtZW50T2JzZXJ2ZXIiLCJvYnNlcnZlIiwic3VidHJlZSIsImNoaWxkTGlzdCIsIl9hdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZUtleSIsImF0dHJpYnV0ZVZhbHVlIiwicmVtb3ZlQXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwiX3VpIiwidWkiLCJ1aUtleSIsInVpVmFsdWUiLCJxdWVyeVNlbGVjdG9yQWxsIiwiX3VpRXZlbnRzIiwidWlFdmVudHMiLCJfdWlDYWxsYmFja3MiLCJ1aUNhbGxiYWNrcyIsIl9vYnNlcnZlckNhbGxiYWNrcyIsIm9ic2VydmVyQ2FsbGJhY2tzIiwiX2VsZW1lbnRPYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJlbGVtZW50T2JzZXJ2ZSIsImJpbmQiLCJfaW5zZXJ0IiwiaW5zZXJ0IiwiX3RlbXBsYXRlcyIsInRlbXBsYXRlcyIsIm11dGF0aW9uUmVjb3JkTGlzdCIsIm9ic2VydmVyIiwibXV0YXRpb25SZWNvcmRJbmRleCIsIm11dGF0aW9uUmVjb3JkIiwibXV0YXRpb25SZWNvcmRDYXRlZ29yaWVzIiwibXV0YXRpb25SZWNvcmRDYXRlZ29yeSIsInJlc2V0VUkiLCJhdXRvSW5zZXJ0IiwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50IiwibWV0aG9kIiwiYXV0b1JlbW92ZSIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImVuYWJsZUVsZW1lbnQiLCJkaXNhYmxlRWxlbWVudCIsImRpc2FibGVVSSIsImVuYWJsZVVJIiwiZW5hYmxlVUlFdmVudHMiLCJkaXNhYmxlVUlFdmVudHMiLCJlbmFibGVFbWl0dGVycyIsImRpc2FibGVFbWl0dGVycyIsInRoaXNzIiwiQ29udHJvbGxlciIsIl9lbWl0dGVyQ2FsbGJhY2tzIiwiZW1pdHRlckNhbGxiYWNrcyIsIl9tb2RlbENhbGxiYWNrcyIsIm1vZGVsQ2FsbGJhY2tzIiwiX3ZpZXdDYWxsYmFja3MiLCJ2aWV3Q2FsbGJhY2tzIiwiX2NvbnRyb2xsZXJDYWxsYmFja3MiLCJjb250cm9sbGVyQ2FsbGJhY2tzIiwiX21vZGVscyIsIm1vZGVscyIsIl92aWV3cyIsInZpZXdzIiwiX2NvbnRyb2xsZXJzIiwiY29udHJvbGxlcnMiLCJfcm91dGVycyIsInJvdXRlcnMiLCJfcm91dGVyRXZlbnRzIiwicm91dGVyRXZlbnRzIiwiX3JvdXRlckNhbGxiYWNrcyIsInJvdXRlckNhbGxiYWNrcyIsIl9lbWl0dGVyRXZlbnRzIiwiZW1pdHRlckV2ZW50cyIsIl9tb2RlbEV2ZW50cyIsIm1vZGVsRXZlbnRzIiwiX3ZpZXdFdmVudHMiLCJ2aWV3RXZlbnRzIiwiX2NvbnRyb2xsZXJFdmVudHMiLCJjb250cm9sbGVyRXZlbnRzIiwiZW5hYmxlTW9kZWxFdmVudHMiLCJkaXNhYmxlTW9kZWxFdmVudHMiLCJlbmFibGVWaWV3RXZlbnRzIiwiZGlzYWJsZVZpZXdFdmVudHMiLCJlbmFibGVDb250cm9sbGVyRXZlbnRzIiwiZGlzYWJsZUNvbnRyb2xsZXJFdmVudHMiLCJlbmFibGVFbWl0dGVyRXZlbnRzIiwiZGlzYWJsZUVtaXR0ZXJFdmVudHMiLCJlbmFibGVSb3V0ZXJFdmVudHMiLCJkaXNhYmxlUm91dGVyRXZlbnRzIiwicmVzZXQiLCJSb3V0ZXIiLCJyb3V0ZSIsIl9oYXNoIiwid2luZG93IiwibG9jYXRpb24iLCJoYXNoIiwicG9wIiwicGF0aG5hbWUiLCJfcm91dGVzIiwicm91dGVzIiwiX2NvbnRyb2xsZXIiLCJjb250cm9sbGVyIiwiX3ByZXZpb3VzVVJMIiwicHJldmlvdXNVUkwiLCJfY3VycmVudFVSTCIsImN1cnJlbnRVUkwiLCJmcmFnbWVudElEUmVnRXhwIiwiZnJhZ21lbnROYW1lUmVnRXhwIiwiZW5hYmxlRXZlbnRzIiwiZW5hYmxlUm91dGVzIiwicm91dGVDaGFuZ2UiLCJkaXNhYmxlRXZlbnRzIiwiZGlzYWJsZVJvdXRlcyIsInJvdXRlSW5kZXgiLCJvcmlnaW5hbFJvdXRlcyIsInJvdXRlUGF0aCIsInJvdXRlQ2FsbGJhY2siLCJuYXZpZ2F0ZUVtaXR0ZXIiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImZpbHRlciIsInJvdXRlQ29udHJvbGxlckRhdGEiLCJyb3V0ZXJQYXRoIiwicm91dGVyQ29udHJvbGxlciIsInVuZGVmaW5lZCIsInJlcGxhY2UiLCJ0ZXN0IiwiaHJlZiIsInJvdXRlQ29udHJvbGxlck5hbWUiLCJyb3V0ZUNvbnRyb2xsZXIiLCJuYXZpZ2F0ZUVtaXR0ZXJEYXRhIiwiZXJyb3IiLCJuYXZpZ2F0ZSIsInBhdGgiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLEVBQWpCO0FDQUFBLEdBQUcsQ0FBQ0MsU0FBSixHQUFnQixFQUFoQjtBQUNBRCxHQUFHLENBQUNFLEtBQUosR0FBWUYsR0FBRyxDQUFDQyxTQUFoQjtBQ0RBRCxHQUFHLENBQUNDLFNBQUosQ0FBY0UsTUFBZCxHQUF1QixFQUF2QjtBQUNBSCxHQUFHLENBQUNFLEtBQUosQ0FBVUUsRUFBVixHQUFlSixHQUFHLENBQUNDLFNBQUosQ0FBY0UsTUFBN0I7QUNEQUgsR0FBRyxDQUFDSyxTQUFKLEdBQWdCO0FBQ2RDLEVBQUFBLGtDQUFrQyxFQUFFLFNBQVNDLDhCQUFULENBQXdDQyxJQUF4QyxFQUE4QztBQUNoRixXQUFPLENBQ0wsMEVBREssRUFFTEMsSUFGSyxDQUVBLElBRkEsQ0FBUDtBQUdELEdBTGE7QUFNZEMsRUFBQUEsa0JBQWtCLEVBQUUsU0FBU0Esa0JBQVQsQ0FBNEJGLElBQTVCLEVBQWtDO0FBQ3BELFdBQU8sNkNBRUxDLElBRkssQ0FFQSxJQUZBLENBQVA7QUFHRCxHQVZhO0FBV2RFLEVBQUFBLG1CQUFtQixFQUFFLFNBQVNBLG1CQUFULENBQTZCSCxJQUE3QixFQUFtQztBQUN0RCw0REFFRUMsSUFGRixDQUVPLElBRlA7QUFHRCxHQWZhO0FBZ0JkRyxFQUFBQSxhQUFhLEVBQUUsU0FBU0EsYUFBVCxDQUF1QkosSUFBdkIsRUFBNkI7QUFDMUMsdUNBRUVDLElBRkYsQ0FFTyxJQUZQO0FBR0QsR0FwQmE7QUFxQmRJLEVBQUFBLGVBQWUsRUFBRSxTQUFTQSxlQUFULENBQXlCTCxJQUF6QixFQUErQjtBQUM5QyxvQ0FFRUMsSUFGRixDQUVPLElBRlA7QUFHRDtBQXpCYSxDQUFoQjtBQTJCQVQsR0FBRyxDQUFDYyxJQUFKLEdBQVdkLEdBQUcsQ0FBQ0ssU0FBZjtBQzNCQUwsR0FBRyxDQUFDZSxLQUFKLEdBQVksRUFBWjtBQ0FBZixHQUFHLENBQUNlLEtBQUosQ0FBVUMsT0FBVixHQUFvQixTQUFTQSxPQUFULENBQWlCQyxNQUFqQixFQUF5QjtBQUFFLFNBQU9DLEtBQUssQ0FBQ0YsT0FBTixDQUFjQyxNQUFkLENBQVA7QUFBOEIsQ0FBN0U7O0FBQ0FqQixHQUFHLENBQUNlLEtBQUosQ0FBVUksUUFBVixHQUFxQixTQUFTQSxRQUFULENBQWtCRixNQUFsQixFQUEwQjtBQUM3QyxTQUFRLENBQUNDLEtBQUssQ0FBQ0YsT0FBTixDQUFjQyxNQUFkLENBQUYsR0FDSCxPQUFPQSxNQUFQLEtBQWtCLFFBRGYsR0FFSCxLQUZKO0FBR0QsQ0FKRDs7QUFLQWpCLEdBQUcsQ0FBQ2UsS0FBSixDQUFVSyxXQUFWLEdBQXdCLFNBQVNBLFdBQVQsQ0FBcUJDLE1BQXJCLEVBQTZCQyxNQUE3QixFQUFxQztBQUFFLFNBQU9ELE1BQU0sS0FBS0MsTUFBbEI7QUFBMEIsQ0FBekY7O0FBQ0F0QixHQUFHLENBQUNlLEtBQUosQ0FBVVEsYUFBVixHQUEwQixTQUFTQSxhQUFULENBQXVCTixNQUF2QixFQUErQjtBQUN2RCxTQUFPQSxNQUFNLFlBQVlPLFdBQXpCO0FBQ0QsQ0FGRDtBQ1BBeEIsR0FBRyxDQUFDZSxLQUFKLENBQVVVLE1BQVYsR0FBb0IsU0FBU0EsTUFBVCxDQUFnQmpCLElBQWhCLEVBQXNCO0FBQ3hDLFVBQU8sT0FBT0EsSUFBZDtBQUNFLFNBQUssUUFBTDtBQUNFLFVBQUlrQixPQUFKOztBQUNBLFVBQUcxQixHQUFHLENBQUNlLEtBQUosQ0FBVUMsT0FBVixDQUFrQlIsSUFBbEIsQ0FBSCxFQUE0QjtBQUMxQjtBQUNBLGVBQU8sT0FBUDtBQUNELE9BSEQsTUFHTyxJQUNMUixHQUFHLENBQUNlLEtBQUosQ0FBVUksUUFBVixDQUFtQlgsSUFBbkIsQ0FESyxFQUVMO0FBQ0E7QUFDQSxlQUFPLFFBQVA7QUFDRCxPQUxNLE1BS0EsSUFDTEEsSUFBSSxLQUFLLElBREosRUFFTDtBQUNBO0FBQ0EsZUFBTyxNQUFQO0FBQ0Q7O0FBQ0QsYUFBT2tCLE9BQVA7QUFDQTs7QUFDRixTQUFLLFFBQUw7QUFDQSxTQUFLLFFBQUw7QUFDQSxTQUFLLFNBQUw7QUFDQSxTQUFLLFdBQUw7QUFDQSxTQUFLLFVBQUw7QUFDRSxhQUFPLE9BQU9sQixJQUFkO0FBQ0E7QUF6Qko7QUEyQkQsQ0E1QkQ7QUNBQVIsR0FBRyxDQUFDZSxLQUFKLENBQVVZLHFCQUFWLEdBQWtDLFNBQVNBLHFCQUFULEdBQWlDO0FBQ2pFLE1BQUlDLFlBQUo7O0FBQ0EsVUFBT0MsU0FBUyxDQUFDQyxNQUFqQjtBQUNFLFNBQUssQ0FBTDtBQUNFLFVBQUlDLFVBQVUsR0FBR0YsU0FBUyxDQUFDLENBQUQsQ0FBMUI7QUFDQUQsTUFBQUEsWUFBWSxHQUFHQyxTQUFTLENBQUMsQ0FBRCxDQUF4Qjs7QUFDQSxXQUFJLElBQUksQ0FBQ0csYUFBRCxFQUFlQyxjQUFmLENBQVIsSUFBeUNDLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlSixVQUFmLENBQXpDLEVBQXFFO0FBQ25FSCxRQUFBQSxZQUFZLENBQUNJLGFBQUQsQ0FBWixHQUE2QkMsY0FBN0I7QUFDRDs7QUFDRDs7QUFDRixTQUFLLENBQUw7QUFDRSxVQUFJRCxZQUFZLEdBQUdILFNBQVMsQ0FBQyxDQUFELENBQTVCO0FBQ0EsVUFBSUksYUFBYSxHQUFHSixTQUFTLENBQUMsQ0FBRCxDQUE3QjtBQUNBRCxNQUFBQSxZQUFZLEdBQUdDLFNBQVMsQ0FBQyxDQUFELENBQXhCO0FBQ0FELE1BQUFBLFlBQVksQ0FBQ0ksWUFBRCxDQUFaLEdBQTZCQyxhQUE3QjtBQUNBO0FBYko7O0FBZUEsU0FBT0wsWUFBUDtBQUNELENBbEJEO0FDQUE1QixHQUFHLENBQUNlLEtBQUosQ0FBVXFCLFdBQVYsR0FBd0IsU0FBU0EsV0FBVCxDQUN0QkMsTUFEc0IsRUFFdEJDLE9BRnNCLEVBR3RCO0FBQ0EsTUFBSUMsVUFBVSxHQUFHdkMsR0FBRyxDQUFDZSxLQUFKLENBQVVxQixXQUFWLENBQXNCSSxhQUF0QixDQUFvQ0gsTUFBcEMsQ0FBakI7QUFDQSxNQUFHRSxVQUFVLENBQUMsQ0FBRCxDQUFWLEtBQWtCLEdBQXJCLEVBQTBCQSxVQUFVLENBQUNFLE1BQVgsQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckI7QUFDMUIsTUFBRyxDQUFDRixVQUFVLENBQUNULE1BQWYsRUFBdUIsT0FBT1EsT0FBUDtBQUN2QkEsRUFBQUEsT0FBTyxHQUFJdEMsR0FBRyxDQUFDZSxLQUFKLENBQVVJLFFBQVYsQ0FBbUJtQixPQUFuQixDQUFELEdBQ05KLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlRyxPQUFmLENBRE0sR0FFTkEsT0FGSjtBQUdBLFNBQU9DLFVBQVUsQ0FBQ0csTUFBWCxDQUFrQixDQUFDekIsTUFBRCxFQUFTMEIsUUFBVCxFQUFtQkMsYUFBbkIsRUFBa0NDLFNBQWxDLEtBQWdEO0FBQ3ZFLFFBQUlkLFVBQVUsR0FBRyxFQUFqQjtBQUNBWSxJQUFBQSxRQUFRLEdBQUczQyxHQUFHLENBQUNlLEtBQUosQ0FBVXFCLFdBQVYsQ0FBc0JVLGFBQXRCLENBQW9DSCxRQUFwQyxDQUFYOztBQUNBLFNBQUksSUFBSSxDQUFDSSxXQUFELEVBQWNkLGFBQWQsQ0FBUixJQUF3Q2hCLE1BQXhDLEVBQWdEO0FBQzlDLFVBQUc4QixXQUFXLENBQUNDLEtBQVosQ0FBa0JMLFFBQWxCLENBQUgsRUFBZ0M7QUFDOUIsWUFBR0MsYUFBYSxLQUFLQyxTQUFTLENBQUNmLE1BQVYsR0FBbUIsQ0FBeEMsRUFBMkM7QUFDekNDLFVBQUFBLFVBQVUsR0FBR0EsVUFBVSxDQUFDa0IsTUFBWCxDQUFrQixDQUFDLENBQUNGLFdBQUQsRUFBY2QsYUFBZCxDQUFELENBQWxCLENBQWI7QUFDRCxTQUZELE1BRU87QUFDTEYsVUFBQUEsVUFBVSxHQUFHQSxVQUFVLENBQUNrQixNQUFYLENBQWtCZixNQUFNLENBQUNDLE9BQVAsQ0FBZUYsYUFBZixDQUFsQixDQUFiO0FBQ0Q7QUFDRjtBQUNGOztBQUNEaEIsSUFBQUEsTUFBTSxHQUFHYyxVQUFUO0FBQ0EsV0FBT2QsTUFBUDtBQUNELEdBZE0sRUFjSnFCLE9BZEksQ0FBUDtBQWVELENBekJEOztBQTBCQXRDLEdBQUcsQ0FBQ2UsS0FBSixDQUFVcUIsV0FBVixDQUFzQkksYUFBdEIsR0FBc0MsU0FBU0EsYUFBVCxDQUF1QkgsTUFBdkIsRUFBK0I7QUFDbkUsTUFDRUEsTUFBTSxDQUFDYSxNQUFQLENBQWMsQ0FBZCxNQUFxQixHQUFyQixJQUNBYixNQUFNLENBQUNhLE1BQVAsQ0FBY2IsTUFBTSxDQUFDUCxNQUFQLEdBQWdCLENBQTlCLEtBQW9DLEdBRnRDLEVBR0U7QUFDQU8sSUFBQUEsTUFBTSxHQUFHQSxNQUFNLENBQ1pjLEtBRE0sQ0FDQSxDQURBLEVBQ0csQ0FBQyxDQURKLEVBRU5DLEtBRk0sQ0FFQSxJQUZBLENBQVQ7QUFHRCxHQVBELE1BT087QUFDTGYsSUFBQUEsTUFBTSxHQUFHQSxNQUFNLENBQ1plLEtBRE0sQ0FDQSxHQURBLENBQVQ7QUFFRDs7QUFDRCxTQUFPZixNQUFQO0FBQ0QsQ0FiRDs7QUFjQXJDLEdBQUcsQ0FBQ2UsS0FBSixDQUFVcUIsV0FBVixDQUFzQlUsYUFBdEIsR0FBc0MsU0FBU0EsYUFBVCxDQUF1QkgsUUFBdkIsRUFBaUM7QUFDckUsTUFDRUEsUUFBUSxDQUFDTyxNQUFULENBQWdCLENBQWhCLE1BQXVCLEdBQXZCLElBQ0FQLFFBQVEsQ0FBQ08sTUFBVCxDQUFnQlAsUUFBUSxDQUFDYixNQUFULEdBQWtCLENBQWxDLEtBQXdDLEdBRjFDLEVBR0U7QUFDQWEsSUFBQUEsUUFBUSxHQUFHQSxRQUFRLENBQUNRLEtBQVQsQ0FBZSxDQUFmLEVBQWtCLENBQUMsQ0FBbkIsQ0FBWDtBQUNBUixJQUFBQSxRQUFRLEdBQUcsSUFBSVUsTUFBSixDQUFXLElBQUlKLE1BQUosQ0FBV04sUUFBWCxFQUFxQixHQUFyQixDQUFYLENBQVg7QUFDRDs7QUFDRCxTQUFPQSxRQUFQO0FBQ0QsQ0FURDtBQ3hDQTNDLEdBQUcsQ0FBQ2UsS0FBSixDQUFVdUMsNEJBQVYsR0FBeUMsU0FBU0EsNEJBQVQsQ0FDdkNDLFlBRHVDLEVBRXZDQyxNQUZ1QyxFQUd2Q0MsYUFIdUMsRUFJdkNDLFNBSnVDLEVBS3ZDO0FBQ0EsT0FBSSxJQUFJLENBQUNDLGFBQUQsRUFBZ0JDLGlCQUFoQixDQUFSLElBQThDMUIsTUFBTSxDQUFDQyxPQUFQLENBQWVxQixNQUFmLENBQTlDLEVBQXNFO0FBQ3BFLFFBQUlLLFNBQVMsR0FBR0YsYUFBYSxDQUFDUCxLQUFkLENBQW9CLEdBQXBCLENBQWhCO0FBQ0EsUUFBSVUsbUJBQW1CLEdBQUdELFNBQVMsQ0FBQyxDQUFELENBQW5DO0FBQ0EsUUFBSUUsU0FBUyxHQUFHRixTQUFTLENBQUMsQ0FBRCxDQUF6QjtBQUNBLFFBQUlHLFlBQVksR0FBR2hFLEdBQUcsQ0FBQ2UsS0FBSixDQUFVcUIsV0FBVixDQUNqQjBCLG1CQURpQixFQUVqQkwsYUFGaUIsQ0FBbkI7QUFJQU8sSUFBQUEsWUFBWSxHQUFJLENBQUNoRSxHQUFHLENBQUNlLEtBQUosQ0FBVUMsT0FBVixDQUFrQmdELFlBQWxCLENBQUYsR0FDWCxDQUFDLENBQUMsR0FBRCxFQUFNQSxZQUFOLENBQUQsQ0FEVyxHQUVYQSxZQUZKOztBQUdBLFNBQUksSUFBSSxDQUFDQyxlQUFELEVBQWtCQyxXQUFsQixDQUFSLElBQTBDRixZQUExQyxFQUF3RDtBQUN0RCxVQUFJRyxlQUFlLEdBQUlaLFlBQVksS0FBSyxJQUFsQixHQUVwQlcsV0FBVyxZQUFZRSxRQUF2QixJQUVFRixXQUFXLFlBQVkxQyxXQUF2QixJQUNBMEMsV0FBVyxZQUFZRyxRQUp6QixHQU1FLGtCQU5GLEdBT0UsSUFSa0IsR0FVcEJILFdBQVcsWUFBWUUsUUFBdkIsSUFFRUYsV0FBVyxZQUFZMUMsV0FBdkIsSUFDQTBDLFdBQVcsWUFBWUcsUUFKekIsR0FNRSxxQkFORixHQU9FLEtBaEJKO0FBaUJBLFVBQUlDLGFBQWEsR0FBR3RFLEdBQUcsQ0FBQ2UsS0FBSixDQUFVcUIsV0FBVixDQUNsQndCLGlCQURrQixFQUVsQkYsU0FGa0IsRUFHbEIsQ0FIa0IsRUFHZixDQUhlLENBQXBCOztBQUlBLFVBQUdRLFdBQVcsWUFBWUUsUUFBMUIsRUFBb0M7QUFDbEMsYUFBSSxJQUFJRyxZQUFSLElBQXdCTCxXQUF4QixFQUFxQztBQUNuQ0ssVUFBQUEsWUFBWSxDQUFDSixlQUFELENBQVosQ0FBOEJKLFNBQTlCLEVBQXlDTyxhQUF6QztBQUNEO0FBQ0YsT0FKRCxNQUlPLElBQUdKLFdBQVcsWUFBWTFDLFdBQTFCLEVBQXVDO0FBQzVDMEMsUUFBQUEsV0FBVyxDQUFDQyxlQUFELENBQVgsQ0FBNkJKLFNBQTdCLEVBQXdDTyxhQUF4QztBQUNELE9BRk0sTUFFQTtBQUNMSixRQUFBQSxXQUFXLENBQUNDLGVBQUQsQ0FBWCxDQUE2QkosU0FBN0IsRUFBd0NPLGFBQXhDO0FBQ0Q7QUFDRjtBQUNGO0FBQ0YsQ0FsREQ7O0FBbURBdEUsR0FBRyxDQUFDZSxLQUFKLENBQVV5RCx5QkFBVixHQUFzQyxTQUFTQSx5QkFBVCxHQUFxQztBQUN6RSxPQUFLbEIsNEJBQUwsQ0FBa0MsSUFBbEMsRUFBd0MsR0FBR3pCLFNBQTNDO0FBQ0QsQ0FGRDs7QUFHQTdCLEdBQUcsQ0FBQ2UsS0FBSixDQUFVMEQsNkJBQVYsR0FBMEMsU0FBU0EsNkJBQVQsR0FBeUM7QUFDakYsT0FBS25CLDRCQUFMLENBQWtDLEtBQWxDLEVBQXlDLEdBQUd6QixTQUE1QztBQUNELENBRkQ7QUN0REE3QixHQUFHLENBQUNlLEtBQUosQ0FBVTJELGtCQUFWLEdBQStCLFNBQVNBLGtCQUFULENBQTRCbEUsSUFBNUIsRUFBa0NtRSxNQUFsQyxFQUEwQztBQUN2RSxNQUFHQSxNQUFILEVBQVc7QUFDVCxZQUFPM0UsR0FBRyxDQUFDZSxLQUFKLENBQVVVLE1BQVYsQ0FBaUJqQixJQUFqQixDQUFQO0FBQ0UsV0FBSyxPQUFMO0FBQ0UsWUFBSW9FLEtBQUssR0FBRyxFQUFaO0FBQ0FELFFBQUFBLE1BQU0sR0FBSTNFLEdBQUcsQ0FBQ2UsS0FBSixDQUFVVSxNQUFWLENBQWlCa0QsTUFBakIsTUFBNkIsVUFBOUIsR0FDTEEsTUFBTSxFQURELEdBRUxBLE1BRko7O0FBR0EsWUFDRTNFLEdBQUcsQ0FBQ2UsS0FBSixDQUFVSyxXQUFWLENBQ0VwQixHQUFHLENBQUNlLEtBQUosQ0FBVVUsTUFBVixDQUFpQmtELE1BQWpCLENBREYsRUFFRTNFLEdBQUcsQ0FBQ2UsS0FBSixDQUFVVSxNQUFWLENBQWlCbUQsS0FBakIsQ0FGRixDQURGLEVBS0U7QUFDQUMsVUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlILE1BQU0sQ0FBQ0ksSUFBbkI7O0FBQ0EsZUFBSSxJQUFJLENBQUNDLFFBQUQsRUFBV0MsVUFBWCxDQUFSLElBQWtDL0MsTUFBTSxDQUFDQyxPQUFQLENBQWUzQixJQUFmLENBQWxDLEVBQXdEO0FBQ3REb0UsWUFBQUEsS0FBSyxDQUFDTSxJQUFOLENBQ0UsS0FBS1Isa0JBQUwsQ0FBd0JPLFVBQXhCLENBREY7QUFHRDtBQUNGOztBQUNELGVBQU9MLEtBQVA7QUFDQTs7QUFDRixXQUFLLFFBQUw7QUFDRSxZQUFJM0QsTUFBTSxHQUFHLEVBQWI7QUFDQTBELFFBQUFBLE1BQU0sR0FBSTNFLEdBQUcsQ0FBQ2UsS0FBSixDQUFVVSxNQUFWLENBQWlCa0QsTUFBakIsTUFBNkIsVUFBOUIsR0FDTEEsTUFBTSxFQURELEdBRUxBLE1BRko7O0FBR0EsWUFDRTNFLEdBQUcsQ0FBQ2UsS0FBSixDQUFVSyxXQUFWLENBQ0VwQixHQUFHLENBQUNlLEtBQUosQ0FBVVUsTUFBVixDQUFpQmtELE1BQWpCLENBREYsRUFFRTNFLEdBQUcsQ0FBQ2UsS0FBSixDQUFVVSxNQUFWLENBQWlCUixNQUFqQixDQUZGLENBREYsRUFLRTtBQUNBNEQsVUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlILE1BQU0sQ0FBQ0ksSUFBbkI7O0FBQ0EsZUFBSSxJQUFJLENBQUNJLFNBQUQsRUFBWUMsV0FBWixDQUFSLElBQW9DbEQsTUFBTSxDQUFDQyxPQUFQLENBQWUzQixJQUFmLENBQXBDLEVBQTBEO0FBQ3hEUyxZQUFBQSxNQUFNLENBQUNrRSxTQUFELENBQU4sR0FBb0IsS0FBS1Qsa0JBQUwsQ0FBd0JVLFdBQXhCLEVBQXFDVCxNQUFNLENBQUNRLFNBQUQsQ0FBM0MsQ0FBcEI7QUFDRDtBQUNGOztBQUNELGVBQU9sRSxNQUFQO0FBQ0E7O0FBQ0YsV0FBSyxRQUFMO0FBQ0EsV0FBSyxRQUFMO0FBQ0EsV0FBSyxTQUFMO0FBQ0UwRCxRQUFBQSxNQUFNLEdBQUkzRSxHQUFHLENBQUNlLEtBQUosQ0FBVVUsTUFBVixDQUFpQmtELE1BQWpCLE1BQTZCLFVBQTlCLEdBQ0xBLE1BQU0sRUFERCxHQUVMQSxNQUZKOztBQUdBLFlBQ0UzRSxHQUFHLENBQUNlLEtBQUosQ0FBVUssV0FBVixDQUNFcEIsR0FBRyxDQUFDZSxLQUFKLENBQVVVLE1BQVYsQ0FBaUJrRCxNQUFqQixDQURGLEVBRUUzRSxHQUFHLENBQUNlLEtBQUosQ0FBVVUsTUFBVixDQUFpQmpCLElBQWpCLENBRkYsQ0FERixFQUtFO0FBQ0FxRSxVQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUgsTUFBTSxDQUFDSSxJQUFuQjtBQUNBLGlCQUFPdkUsSUFBUDtBQUNELFNBUkQsTUFRTztBQUNMLGdCQUFNUixHQUFHLENBQUNjLElBQVY7QUFDRDs7QUFDRDs7QUFDRixXQUFLLE1BQUw7QUFDRSxZQUNFZCxHQUFHLENBQUNlLEtBQUosQ0FBVUssV0FBVixDQUNFcEIsR0FBRyxDQUFDZSxLQUFKLENBQVVVLE1BQVYsQ0FBaUJrRCxNQUFqQixDQURGLEVBRUUzRSxHQUFHLENBQUNlLEtBQUosQ0FBVVUsTUFBVixDQUFpQmpCLElBQWpCLENBRkYsQ0FERixFQUtFO0FBQ0EsaUJBQU9BLElBQVA7QUFDRDs7QUFDRDs7QUFDRixXQUFLLFdBQUw7QUFDRSxjQUFNUixHQUFHLENBQUNjLElBQVY7QUFDQTs7QUFDRixXQUFLLFVBQUw7QUFDRSxjQUFNZCxHQUFHLENBQUNjLElBQVY7QUFDQTtBQXhFSjtBQTBFRCxHQTNFRCxNQTJFTztBQUNMLFVBQU1kLEdBQUcsQ0FBQ2MsSUFBVjtBQUNEO0FBQ0YsQ0EvRUQ7QVJBQWQsR0FBRyxDQUFDRyxNQUFKLEdBQWEsTUFBTTtBQUNqQmtGLEVBQUFBLFdBQVcsR0FBRyxDQUFFOztBQUNoQixNQUFJQyxPQUFKLEdBQWM7QUFDWixTQUFLOUIsTUFBTCxHQUFlLEtBQUtBLE1BQU4sR0FDVixLQUFLQSxNQURLLEdBRVYsRUFGSjtBQUdBLFdBQU8sS0FBS0EsTUFBWjtBQUNEOztBQUNEK0IsRUFBQUEsY0FBYyxDQUFDeEIsU0FBRCxFQUFZO0FBQUUsV0FBTyxLQUFLdUIsT0FBTCxDQUFhdkIsU0FBYixLQUEyQixFQUFsQztBQUFzQzs7QUFDbEVILEVBQUFBLGlCQUFpQixDQUFDVSxhQUFELEVBQWdCO0FBQy9CLFdBQVFBLGFBQWEsQ0FBQ1MsSUFBZCxDQUFtQmpELE1BQXBCLEdBQ0h3QyxhQUFhLENBQUNTLElBRFgsR0FFSCxtQkFGSjtBQUdEOztBQUNEUyxFQUFBQSxrQkFBa0IsQ0FBQ0QsY0FBRCxFQUFpQjNCLGlCQUFqQixFQUFvQztBQUNwRCxXQUFPMkIsY0FBYyxDQUFDM0IsaUJBQUQsQ0FBZCxJQUFxQyxFQUE1QztBQUNEOztBQUNENkIsRUFBQUEsRUFBRSxDQUFDMUIsU0FBRCxFQUFZTyxhQUFaLEVBQTJCO0FBQzNCLFFBQUlpQixjQUFjLEdBQUcsS0FBS0EsY0FBTCxDQUFvQnhCLFNBQXBCLENBQXJCO0FBQ0EsUUFBSUgsaUJBQWlCLEdBQUcsS0FBS0EsaUJBQUwsQ0FBdUJVLGFBQXZCLENBQXhCO0FBQ0EsUUFBSWtCLGtCQUFrQixHQUFHLEtBQUtBLGtCQUFMLENBQXdCRCxjQUF4QixFQUF3QzNCLGlCQUF4QyxDQUF6QjtBQUNBNEIsSUFBQUEsa0JBQWtCLENBQUNOLElBQW5CLENBQXdCWixhQUF4QjtBQUNBaUIsSUFBQUEsY0FBYyxDQUFDM0IsaUJBQUQsQ0FBZCxHQUFvQzRCLGtCQUFwQztBQUNBLFNBQUtGLE9BQUwsQ0FBYXZCLFNBQWIsSUFBMEJ3QixjQUExQjtBQUNEOztBQUNERyxFQUFBQSxHQUFHLEdBQUc7QUFDSixZQUFPN0QsU0FBUyxDQUFDQyxNQUFqQjtBQUNFLFdBQUssQ0FBTDtBQUNFLFlBQUlpQyxTQUFTLEdBQUdsQyxTQUFTLENBQUMsQ0FBRCxDQUF6QjtBQUNBLGVBQU8sS0FBS3lELE9BQUwsQ0FBYXZCLFNBQWIsQ0FBUDtBQUNBOztBQUNGLFdBQUssQ0FBTDtBQUNFLFlBQUlBLFNBQVMsR0FBR2xDLFNBQVMsQ0FBQyxDQUFELENBQXpCO0FBQ0EsWUFBSXlDLGFBQWEsR0FBR3pDLFNBQVMsQ0FBQyxDQUFELENBQTdCO0FBQ0EsWUFBSStCLGlCQUFpQixHQUFHLEtBQUtBLGlCQUFMLENBQXVCVSxhQUF2QixDQUF4QjtBQUNBLGVBQU8sS0FBS2dCLE9BQUwsQ0FBYXZCLFNBQWIsRUFBd0JILGlCQUF4QixDQUFQO0FBQ0E7QUFWSjtBQVlEOztBQUNEK0IsRUFBQUEsSUFBSSxDQUFDNUIsU0FBRCxFQUFZRixTQUFaLEVBQXVCO0FBQ3pCLFFBQUkwQixjQUFjLEdBQUcsS0FBS0EsY0FBTCxDQUFvQnhCLFNBQXBCLENBQXJCOztBQUNBLFNBQUksSUFBSSxDQUFDNkIsc0JBQUQsRUFBeUJKLGtCQUF6QixDQUFSLElBQXdEdEQsTUFBTSxDQUFDQyxPQUFQLENBQWVvRCxjQUFmLENBQXhELEVBQXdGO0FBQ3RGLFdBQUksSUFBSWpCLGFBQVIsSUFBeUJrQixrQkFBekIsRUFBNkM7QUFDM0MsWUFBSUssbUJBQW1CLEdBQUczRCxNQUFNLENBQUM0RCxNQUFQLENBQWNqRSxTQUFkLEVBQXlCWSxNQUF6QixDQUFnQyxDQUFoQyxLQUFzQyxFQUFoRTtBQUNBNkIsUUFBQUEsYUFBYSxDQUFDVCxTQUFELEVBQVksR0FBR2dDLG1CQUFmLENBQWI7QUFDRDtBQUNGO0FBQ0Y7O0FBL0NnQixDQUFuQjtBU0FBN0YsR0FBRyxDQUFDK0YsUUFBSixHQUFlLE1BQU07QUFDbkJWLEVBQUFBLFdBQVcsR0FBRyxDQUFFOztBQUNoQixNQUFJVyxTQUFKLEdBQWdCO0FBQ2QsU0FBS0MsUUFBTCxHQUFpQixLQUFLQSxRQUFOLEdBQ1osS0FBS0EsUUFETyxHQUVaLEVBRko7QUFHQSxXQUFPLEtBQUtBLFFBQVo7QUFDRDs7QUFDREMsRUFBQUEsT0FBTyxDQUFDQyxXQUFELEVBQWM7QUFDbkIsU0FBS0gsU0FBTCxDQUFlRyxXQUFmLElBQStCLEtBQUtILFNBQUwsQ0FBZUcsV0FBZixDQUFELEdBQzFCLEtBQUtILFNBQUwsQ0FBZUcsV0FBZixDQUQwQixHQUUxQixJQUFJbkcsR0FBRyxDQUFDK0YsUUFBSixDQUFhSyxPQUFqQixFQUZKO0FBR0EsV0FBTyxLQUFLSixTQUFMLENBQWVHLFdBQWYsQ0FBUDtBQUNEOztBQUNEVCxFQUFBQSxHQUFHLENBQUNTLFdBQUQsRUFBYztBQUNmLFdBQU8sS0FBS0gsU0FBTCxDQUFlRyxXQUFmLENBQVA7QUFDRDs7QUFoQmtCLENBQXJCO0FDQUFuRyxHQUFHLENBQUMrRixRQUFKLENBQWFLLE9BQWIsR0FBdUIsTUFBTTtBQUMzQmYsRUFBQUEsV0FBVyxHQUFHLENBQUU7O0FBQ2hCLE1BQUlnQixVQUFKLEdBQWlCO0FBQ2YsU0FBS0MsU0FBTCxHQUFrQixLQUFLQSxTQUFOLEdBQ2IsS0FBS0EsU0FEUSxHQUViLEVBRko7QUFHQSxXQUFPLEtBQUtBLFNBQVo7QUFDRDs7QUFDREMsRUFBQUEsUUFBUSxDQUFDQyxZQUFELEVBQWVDLGdCQUFmLEVBQWlDO0FBQ3ZDLFFBQUdBLGdCQUFILEVBQXFCO0FBQ25CLFdBQUtKLFVBQUwsQ0FBZ0JHLFlBQWhCLElBQWdDQyxnQkFBaEM7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPLEtBQUtKLFVBQUwsQ0FBZ0JFLFFBQWhCLENBQVA7QUFDRDtBQUNGOztBQUNERyxFQUFBQSxPQUFPLENBQUNGLFlBQUQsRUFBZUcsV0FBZixFQUE0QjtBQUNqQyxRQUFHLEtBQUtOLFVBQUwsQ0FBZ0JHLFlBQWhCLENBQUgsRUFBa0M7QUFDaEMsYUFBTyxLQUFLSCxVQUFMLENBQWdCRyxZQUFoQixFQUE4QkcsV0FBOUIsQ0FBUDtBQUNEO0FBQ0Y7O0FBQ0RqQixFQUFBQSxHQUFHLENBQUNjLFlBQUQsRUFBZTtBQUNoQixRQUFHQSxZQUFILEVBQWlCO0FBQ2YsYUFBTyxLQUFLSCxVQUFMLENBQWdCRyxZQUFoQixDQUFQO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsV0FBSSxJQUFJLENBQUNBLGFBQUQsQ0FBUixJQUEwQnRFLE1BQU0sQ0FBQzBFLElBQVAsQ0FBWSxLQUFLUCxVQUFqQixDQUExQixFQUF3RDtBQUN0RCxlQUFPLEtBQUtBLFVBQUwsQ0FBZ0JHLGFBQWhCLENBQVA7QUFDRDtBQUNGO0FBQ0Y7O0FBNUIwQixDQUE3QjtBQ0FBeEcsR0FBRyxDQUFDNkcsSUFBSixHQUFXLGNBQWM3RyxHQUFHLENBQUNHLE1BQWxCLENBQXlCO0FBQ2xDa0YsRUFBQUEsV0FBVyxDQUFDeUIsUUFBRCxFQUFXQyxhQUFYLEVBQTBCO0FBQ25DO0FBQ0EsUUFBR0EsYUFBSCxFQUFrQixLQUFLQyxjQUFMLEdBQXNCRCxhQUF0QjtBQUNsQixRQUFHRCxRQUFILEVBQWEsS0FBS0csU0FBTCxHQUFpQkgsUUFBakI7QUFDZDs7QUFDRCxNQUFJRSxjQUFKLEdBQXFCO0FBQ25CLFNBQUtELGFBQUwsR0FBc0IsS0FBS0EsYUFBTixHQUNqQixLQUFLQSxhQURZLEdBRWpCLEVBRko7QUFHQSxXQUFPLEtBQUtBLGFBQVo7QUFDRDs7QUFDRCxNQUFJQyxjQUFKLENBQW1CRCxhQUFuQixFQUFrQztBQUFFLFNBQUtBLGFBQUwsR0FBcUJBLGFBQXJCO0FBQW9DOztBQUN4RSxNQUFJRSxTQUFKLEdBQWdCO0FBQ2QsU0FBS0gsUUFBTCxHQUFpQixLQUFLQSxRQUFOLEdBQ1osS0FBS0EsUUFETyxHQUVaLEVBRko7QUFHQSxXQUFPLEtBQUtBLFFBQVo7QUFDRDs7QUFDRCxNQUFJRyxTQUFKLENBQWNILFFBQWQsRUFBd0I7QUFDdEIsU0FBS0EsUUFBTCxHQUFnQjlHLEdBQUcsQ0FBQ2UsS0FBSixDQUFVWSxxQkFBVixDQUNkbUYsUUFEYyxFQUNKLEtBQUtHLFNBREQsQ0FBaEI7QUFHRDs7QUFDRCxNQUFJQyxTQUFKLEdBQWdCO0FBQ2QsU0FBS0MsUUFBTCxHQUFpQixLQUFLQSxRQUFOLEdBQ1osS0FBS0EsUUFETyxHQUVaLEVBRko7QUFHQSxXQUFPLEtBQUtBLFFBQVo7QUFDRDs7QUFDRCxNQUFJRCxTQUFKLENBQWNDLFFBQWQsRUFBd0I7QUFDdEIsU0FBS0EsUUFBTCxHQUFnQm5ILEdBQUcsQ0FBQ2UsS0FBSixDQUFVWSxxQkFBVixDQUNkd0YsUUFEYyxFQUNKLEtBQUtELFNBREQsQ0FBaEI7QUFHRDs7QUFsQ2lDLENBQXBDO0FDQUFsSCxHQUFHLENBQUNvSCxPQUFKLEdBQWMsY0FBY3BILEdBQUcsQ0FBQzZHLElBQWxCLENBQXVCO0FBQ25DeEIsRUFBQUEsV0FBVyxHQUFHO0FBQ1osVUFBTSxHQUFHeEQsU0FBVDtBQUNEOztBQUNELE1BQUl3RixTQUFKLEdBQWdCO0FBQUUsV0FBTyxLQUFLQyxRQUFMLElBQWlCO0FBQ3hDQyxNQUFBQSxXQUFXLEVBQUU7QUFBQyx3QkFBZ0I7QUFBakIsT0FEMkI7QUFFeENDLE1BQUFBLFlBQVksRUFBRTtBQUYwQixLQUF4QjtBQUdmOztBQUNILE1BQUlDLGNBQUosR0FBcUI7QUFBRSxXQUFPLENBQUMsRUFBRCxFQUFLLGFBQUwsRUFBb0IsTUFBcEIsRUFBNEIsVUFBNUIsRUFBd0MsTUFBeEMsRUFBZ0QsTUFBaEQsQ0FBUDtBQUFnRTs7QUFDdkYsTUFBSUMsYUFBSixHQUFvQjtBQUFFLFdBQU8sS0FBS0YsWUFBWjtBQUEwQjs7QUFDaEQsTUFBSUUsYUFBSixDQUFrQkYsWUFBbEIsRUFBZ0M7QUFDOUIsU0FBS0csSUFBTCxDQUFVSCxZQUFWLEdBQXlCLEtBQUtDLGNBQUwsQ0FBb0JHLElBQXBCLENBQ3RCQyxnQkFBRCxJQUFzQkEsZ0JBQWdCLEtBQUtMLFlBRHBCLEtBRXBCLEtBQUtILFNBQUwsQ0FBZUcsWUFGcEI7QUFHRDs7QUFDRCxNQUFJTSxLQUFKLEdBQVk7QUFBRSxXQUFPLEtBQUtDLElBQVo7QUFBa0I7O0FBQ2hDLE1BQUlELEtBQUosQ0FBVUMsSUFBVixFQUFnQjtBQUFFLFNBQUtBLElBQUwsR0FBWUEsSUFBWjtBQUFrQjs7QUFDcEMsTUFBSUMsSUFBSixHQUFXO0FBQUUsV0FBTyxLQUFLQyxHQUFaO0FBQWlCOztBQUM5QixNQUFJRCxJQUFKLENBQVNDLEdBQVQsRUFBYztBQUFFLFNBQUtBLEdBQUwsR0FBV0EsR0FBWDtBQUFnQjs7QUFDaEMsTUFBSUMsUUFBSixHQUFlO0FBQUUsV0FBTyxLQUFLQyxPQUFMLElBQWdCLEVBQXZCO0FBQTJCOztBQUM1QyxNQUFJRCxRQUFKLENBQWFDLE9BQWIsRUFBc0I7QUFDcEIsU0FBS0QsUUFBTCxDQUFjcEcsTUFBZCxHQUF1QixDQUF2Qjs7QUFDQSxTQUFJLElBQUlzRyxNQUFSLElBQWtCRCxPQUFsQixFQUEyQjtBQUN6QixXQUFLUixJQUFMLENBQVVVLGdCQUFWLENBQTJCO0FBQUNELFFBQUFBO0FBQUQsUUFBUyxDQUFULENBQTNCLEVBQXdDO0FBQUNBLFFBQUFBO0FBQUQsUUFBUyxDQUFULENBQXhDOztBQUNBLFdBQUtGLFFBQUwsQ0FBY2hELElBQWQsQ0FBbUJrRCxNQUFuQjtBQUNEO0FBQ0Y7O0FBQ0QsTUFBSUUsS0FBSixHQUFZO0FBQUUsV0FBTyxLQUFLOUgsSUFBWjtBQUFrQjs7QUFDaEMsTUFBSThILEtBQUosQ0FBVTlILElBQVYsRUFBZ0I7QUFBRSxTQUFLQSxJQUFMLEdBQVlBLElBQVo7QUFBa0I7O0FBQ3BDLE1BQUltSCxJQUFKLEdBQVc7QUFDVCxTQUFLWSxHQUFMLEdBQVksS0FBS0EsR0FBTixHQUNQLEtBQUtBLEdBREUsR0FFUCxJQUFJQyxjQUFKLEVBRko7QUFHQSxXQUFPLEtBQUtELEdBQVo7QUFDRDs7QUFDRCxNQUFJRSxRQUFKLEdBQWU7QUFBRSxXQUFPLEtBQUtDLE9BQUwsSUFBZ0IsS0FBdkI7QUFBOEI7O0FBQy9DLE1BQUlELFFBQUosQ0FBYUMsT0FBYixFQUFzQjtBQUFFLFNBQUtBLE9BQUwsR0FBZUEsT0FBZjtBQUF3Qjs7QUFDaERoQyxFQUFBQSxPQUFPLENBQUNsRyxJQUFELEVBQU87QUFDWkEsSUFBQUEsSUFBSSxHQUFHQSxJQUFJLElBQUksS0FBS0EsSUFBYixJQUFxQixJQUE1QjtBQUNBLFdBQU8sSUFBSW1JLE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDdEMsVUFBRyxLQUFLbEIsSUFBTCxDQUFVbUIsTUFBVixLQUFxQixHQUF4QixFQUE2QixLQUFLbkIsSUFBTCxDQUFVb0IsS0FBVjs7QUFDN0IsV0FBS3BCLElBQUwsQ0FBVXFCLElBQVYsQ0FBZSxLQUFLakIsSUFBcEIsRUFBMEIsS0FBS0UsR0FBL0I7O0FBQ0EsV0FBS0MsUUFBTCxHQUFnQixLQUFLcEIsUUFBTCxDQUFjcUIsT0FBZCxJQUF5QixDQUFDLEtBQUtkLFNBQUwsQ0FBZUUsV0FBaEIsQ0FBekM7QUFDQSxXQUFLSSxJQUFMLENBQVVzQixNQUFWLEdBQW1CTCxPQUFuQjtBQUNBLFdBQUtqQixJQUFMLENBQVV1QixPQUFWLEdBQW9CTCxNQUFwQjs7QUFDQSxXQUFLbEIsSUFBTCxDQUFVd0IsSUFBVixDQUFlM0ksSUFBZjtBQUNELEtBUE0sRUFPSjRJLElBUEksQ0FPRTdDLFFBQUQsSUFBYztBQUNwQixXQUFLWixJQUFMLENBQVUsYUFBVixFQUF5QjtBQUN2QlosUUFBQUEsSUFBSSxFQUFFLGFBRGlCO0FBRXZCdkUsUUFBQUEsSUFBSSxFQUFFK0YsUUFBUSxDQUFDOEM7QUFGUSxPQUF6QjtBQUlBLGFBQU85QyxRQUFQO0FBQ0QsS0FiTSxDQUFQO0FBY0Q7O0FBQ0QrQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxRQUFJeEMsUUFBUSxHQUFHLEtBQUtBLFFBQXBCOztBQUNBLFFBQ0UsQ0FBQyxLQUFLNEIsT0FBTixJQUNBeEcsTUFBTSxDQUFDMEUsSUFBUCxDQUFZRSxRQUFaLEVBQXNCaEYsTUFGeEIsRUFHRTtBQUNBLFVBQUdnRixRQUFRLENBQUNpQixJQUFaLEVBQWtCLEtBQUtELEtBQUwsR0FBYWhCLFFBQVEsQ0FBQ2lCLElBQXRCO0FBQ2xCLFVBQUdqQixRQUFRLENBQUNtQixHQUFaLEVBQWlCLEtBQUtELElBQUwsR0FBWWxCLFFBQVEsQ0FBQ21CLEdBQXJCO0FBQ2pCLFVBQUduQixRQUFRLENBQUN0RyxJQUFaLEVBQWtCLEtBQUs4SCxLQUFMLEdBQWF4QixRQUFRLENBQUN0RyxJQUFULElBQWlCLElBQTlCO0FBQ2xCLFVBQUcsS0FBS3NHLFFBQUwsQ0FBY1UsWUFBakIsRUFBK0IsS0FBS0UsYUFBTCxHQUFxQixLQUFLVCxTQUFMLENBQWVPLFlBQXBDO0FBQy9CLFdBQUtpQixRQUFMLEdBQWdCLElBQWhCO0FBQ0Q7QUFDRjs7QUFDRGMsRUFBQUEsT0FBTyxHQUFHO0FBQ1IsUUFBSXpDLFFBQVEsR0FBRyxLQUFLQSxRQUFwQjs7QUFDQSxRQUNFLEtBQUs0QixPQUFMLElBQ0F4RyxNQUFNLENBQUMwRSxJQUFQLENBQVlFLFFBQVosRUFBc0JoRixNQUZ4QixFQUdFO0FBQ0EsYUFBTyxLQUFLZ0csS0FBWjtBQUNBLGFBQU8sS0FBS0UsSUFBWjtBQUNBLGFBQU8sS0FBS00sS0FBWjtBQUNBLGFBQU8sS0FBS0osUUFBWjtBQUNBLGFBQU8sS0FBS1IsYUFBWjtBQUNBLFdBQUtlLFFBQUwsR0FBZ0IsS0FBaEI7QUFDRDtBQUNGOztBQWhGa0MsQ0FBckM7QUNBQXpJLEdBQUcsQ0FBQ3dKLEtBQUosR0FBWSxjQUFjeEosR0FBRyxDQUFDNkcsSUFBbEIsQ0FBdUI7QUFDakN4QixFQUFBQSxXQUFXLEdBQUc7QUFDWixVQUFNLEdBQUd4RCxTQUFUO0FBQ0Q7O0FBQ0QsTUFBSTRILGFBQUosR0FBb0I7QUFBRSxXQUFPLEtBQUtDLFlBQVo7QUFBMEI7O0FBQ2hELE1BQUlELGFBQUosQ0FBa0JDLFlBQWxCLEVBQWdDO0FBQUUsU0FBS0EsWUFBTCxHQUFvQkEsWUFBcEI7QUFBa0M7O0FBQ3BFLE1BQUlyQyxTQUFKLEdBQWdCO0FBQUUsV0FBTyxLQUFLQyxRQUFaO0FBQXNCOztBQUN4QyxNQUFJRCxTQUFKLENBQWNDLFFBQWQsRUFBd0I7QUFBRSxTQUFLQSxRQUFMLEdBQWdCQSxRQUFoQjtBQUEwQjs7QUFDcEQsTUFBSXFDLE9BQUosR0FBYztBQUFFLFdBQU8sS0FBS0EsT0FBWjtBQUFxQjs7QUFDckMsTUFBSUEsT0FBSixDQUFZaEYsTUFBWixFQUFvQjtBQUFFLFNBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUFzQjs7QUFDNUMsTUFBSWlGLFdBQUosR0FBa0I7QUFBRSxXQUFPLEtBQUtDLFVBQUwsSUFBbUI7QUFDNUMvSCxNQUFBQSxNQUFNLEVBQUU7QUFEb0MsS0FBMUI7QUFFakI7O0FBQ0gsTUFBSThILFdBQUosQ0FBZ0JDLFVBQWhCLEVBQTRCO0FBQzFCLFNBQUtBLFVBQUwsR0FBa0IzSCxNQUFNLENBQUM0SCxNQUFQLENBQ2hCLEtBQUtGLFdBRFcsRUFFaEJDLFVBRmdCLENBQWxCO0FBSUQ7O0FBQ0QsTUFBSUUsUUFBSixHQUFlO0FBQ2IsU0FBS0MsT0FBTCxHQUFnQixLQUFLQSxPQUFOLEdBQ1gsS0FBS0EsT0FETSxHQUVYLEVBRko7QUFHQSxXQUFPLEtBQUtBLE9BQVo7QUFDRDs7QUFDRCxNQUFJRCxRQUFKLENBQWF2SixJQUFiLEVBQW1CO0FBQ2pCLFFBQ0UwQixNQUFNLENBQUMwRSxJQUFQLENBQVlwRyxJQUFaLEVBQWtCc0IsTUFEcEIsRUFFRTtBQUNBLFVBQUcsS0FBSzhILFdBQUwsQ0FBaUI5SCxNQUFwQixFQUE0QjtBQUMxQixhQUFLaUksUUFBTCxDQUFjRSxPQUFkLENBQXNCLEtBQUtDLEtBQUwsQ0FBVzFKLElBQVgsQ0FBdEI7O0FBQ0EsYUFBS3VKLFFBQUwsQ0FBY3RILE1BQWQsQ0FBcUIsS0FBS21ILFdBQUwsQ0FBaUI5SCxNQUF0QztBQUNEO0FBQ0Y7QUFDRjs7QUFDRCxNQUFJcUksR0FBSixHQUFVO0FBQ1IsUUFBSUMsRUFBRSxHQUFHVixZQUFZLENBQUNXLE9BQWIsQ0FBcUIsS0FBS1gsWUFBTCxDQUFrQlksUUFBdkMsQ0FBVDtBQUNBLFNBQUtGLEVBQUwsR0FBV0EsRUFBRCxHQUNOQSxFQURNLEdBRU4sSUFGSjtBQUdBLFdBQU9HLElBQUksQ0FBQ0wsS0FBTCxDQUFXLEtBQUtFLEVBQWhCLENBQVA7QUFDRDs7QUFDRCxNQUFJRCxHQUFKLENBQVFDLEVBQVIsRUFBWTtBQUNWQSxJQUFBQSxFQUFFLEdBQUdHLElBQUksQ0FBQ0MsU0FBTCxDQUFlSixFQUFmLENBQUw7QUFDQVYsSUFBQUEsWUFBWSxDQUFDZSxPQUFiLENBQXFCLEtBQUtmLFlBQUwsQ0FBa0JZLFFBQXZDLEVBQWlERixFQUFqRDtBQUNEOztBQUNELE1BQUk5QixLQUFKLEdBQVk7QUFDVixTQUFLOUgsSUFBTCxHQUFjLEtBQUtBLElBQU4sR0FDVCxLQUFLQSxJQURJLEdBRVQsRUFGSjtBQUdBLFdBQU8sS0FBS0EsSUFBWjtBQUNEOztBQUNELE1BQUlrSyxXQUFKLEdBQWtCO0FBQ2hCLFNBQUtDLFVBQUwsR0FBbUIsS0FBS0EsVUFBTixHQUNkLEtBQUtBLFVBRFMsR0FFZCxFQUZKO0FBR0EsV0FBTyxLQUFLQSxVQUFaO0FBQ0Q7O0FBQ0QsTUFBSUQsV0FBSixDQUFnQkMsVUFBaEIsRUFBNEI7QUFDMUIsU0FBS0EsVUFBTCxHQUFrQjNLLEdBQUcsQ0FBQ2UsS0FBSixDQUFVWSxxQkFBVixDQUNoQmdKLFVBRGdCLEVBQ0osS0FBS0QsV0FERCxDQUFsQjtBQUdEOztBQUNELE1BQUlFLGNBQUosR0FBcUI7QUFDbkIsU0FBS0MsYUFBTCxHQUFzQixLQUFLQSxhQUFOLEdBQ2pCLEtBQUtBLGFBRFksR0FFakIsRUFGSjtBQUdBLFdBQU8sS0FBS0EsYUFBWjtBQUNEOztBQUNELE1BQUlELGNBQUosQ0FBbUJDLGFBQW5CLEVBQWtDO0FBQ2hDLFNBQUtBLGFBQUwsR0FBcUI3SyxHQUFHLENBQUNlLEtBQUosQ0FBVVkscUJBQVYsQ0FDbkJrSixhQURtQixFQUNKLEtBQUtELGNBREQsQ0FBckI7QUFHRDs7QUFDRCxNQUFJRSxTQUFKLEdBQWdCO0FBQ2QsU0FBS0MsUUFBTCxHQUFrQixLQUFLQSxRQUFOLEdBQ2IsS0FBS0EsUUFEUSxHQUViLEVBRko7QUFHQSxXQUFPLEtBQUtBLFFBQVo7QUFDRDs7QUFDRCxNQUFJRCxTQUFKLENBQWNDLFFBQWQsRUFBd0I7QUFDdEIsU0FBS0EsUUFBTCxHQUFnQi9LLEdBQUcsQ0FBQ2UsS0FBSixDQUFVWSxxQkFBVixDQUNkb0osUUFEYyxFQUNKLEtBQUtELFNBREQsQ0FBaEI7QUFHRDs7QUFDRCxNQUFJRSxjQUFKLEdBQXFCO0FBQ25CLFNBQUtDLGFBQUwsR0FBc0IsS0FBS0EsYUFBTixHQUNqQixLQUFLQSxhQURZLEdBRWpCLEVBRko7QUFHQSxXQUFPLEtBQUtBLGFBQVo7QUFDRDs7QUFDRCxNQUFJRCxjQUFKLENBQW1CQyxhQUFuQixFQUFrQztBQUNoQyxTQUFLQSxhQUFMLEdBQXFCakwsR0FBRyxDQUFDZSxLQUFKLENBQVVZLHFCQUFWLENBQ25Cc0osYUFEbUIsRUFDSixLQUFLRCxjQURELENBQXJCO0FBR0Q7O0FBQ0QsTUFBSUUsaUJBQUosR0FBd0I7QUFDdEIsU0FBS0MsZ0JBQUwsR0FBeUIsS0FBS0EsZ0JBQU4sR0FDcEIsS0FBS0EsZ0JBRGUsR0FFcEIsRUFGSjtBQUdBLFdBQU8sS0FBS0EsZ0JBQVo7QUFDRDs7QUFDRCxNQUFJRCxpQkFBSixDQUFzQkMsZ0JBQXRCLEVBQXdDO0FBQ3RDLFNBQUtBLGdCQUFMLEdBQXdCbkwsR0FBRyxDQUFDZSxLQUFKLENBQVVZLHFCQUFWLENBQ3RCd0osZ0JBRHNCLEVBQ0osS0FBS0QsaUJBREQsQ0FBeEI7QUFHRDs7QUFDRCxNQUFJekMsUUFBSixHQUFlO0FBQUUsV0FBTyxLQUFLQyxPQUFMLElBQWdCLEtBQXZCO0FBQThCOztBQUMvQyxNQUFJRCxRQUFKLENBQWFDLE9BQWIsRUFBc0I7QUFBRSxTQUFLQSxPQUFMLEdBQWVBLE9BQWY7QUFBd0I7O0FBQ2hEMEMsRUFBQUEsbUJBQW1CLEdBQUc7QUFDcEJwTCxJQUFBQSxHQUFHLENBQUNlLEtBQUosQ0FBVXlELHlCQUFWLENBQW9DLEtBQUt5RyxhQUF6QyxFQUF3RCxLQUFLRixRQUE3RCxFQUF1RSxLQUFLSSxnQkFBNUU7QUFDRDs7QUFDREUsRUFBQUEsb0JBQW9CLEdBQUc7QUFDckJyTCxJQUFBQSxHQUFHLENBQUNlLEtBQUosQ0FBVTBELDZCQUFWLENBQXdDLEtBQUt3RyxhQUE3QyxFQUE0RCxLQUFLRixRQUFqRSxFQUEyRSxLQUFLSSxnQkFBaEY7QUFDRDs7QUFDREcsRUFBQUEsZ0JBQWdCLEdBQUc7QUFDakJ0TCxJQUFBQSxHQUFHLENBQUNlLEtBQUosQ0FBVXlELHlCQUFWLENBQW9DLEtBQUttRyxVQUF6QyxFQUFxRCxJQUFyRCxFQUEyRCxLQUFLRSxhQUFoRTtBQUNEOztBQUNEVSxFQUFBQSxpQkFBaUIsR0FBRztBQUNsQnZMLElBQUFBLEdBQUcsQ0FBQ2UsS0FBSixDQUFVMEQsNkJBQVYsQ0FBd0MsS0FBS2tHLFVBQTdDLEVBQXlELElBQXpELEVBQStELEtBQUtFLGFBQXBFO0FBQ0Q7O0FBQ0RXLEVBQUFBLFdBQVcsR0FBRztBQUNaLFFBQUluRSxTQUFTLEdBQUcsRUFBaEI7QUFDQSxRQUFHLEtBQUtDLFFBQVIsRUFBa0JwRixNQUFNLENBQUM0SCxNQUFQLENBQWN6QyxTQUFkLEVBQXlCLEtBQUtDLFFBQTlCO0FBQ2xCLFFBQUcsS0FBS29DLFlBQVIsRUFBc0J4SCxNQUFNLENBQUM0SCxNQUFQLENBQWN6QyxTQUFkLEVBQXlCLEtBQUs4QyxHQUE5QjtBQUN0QixRQUFHakksTUFBTSxDQUFDMEUsSUFBUCxDQUFZUyxTQUFaLENBQUgsRUFBMkIsS0FBS29FLEdBQUwsQ0FBU3BFLFNBQVQ7QUFDNUI7O0FBQ0RxRSxFQUFBQSxHQUFHLEdBQUc7QUFDSixRQUFJQyxRQUFRLEdBQUc5SixTQUFTLENBQUMsQ0FBRCxDQUF4QjtBQUNBLFdBQU8sS0FBS3lHLEtBQUwsQ0FBVyxJQUFJckYsTUFBSixDQUFXMEksUUFBWCxDQUFYLENBQVA7QUFDRDs7QUFDREYsRUFBQUEsR0FBRyxHQUFHO0FBQ0osU0FBSzFCLFFBQUwsR0FBZ0IsS0FBS0csS0FBTCxFQUFoQjs7QUFDQSxZQUFPckksU0FBUyxDQUFDQyxNQUFqQjtBQUNFLFdBQUssQ0FBTDtBQUNFSSxRQUFBQSxNQUFNLENBQUNDLE9BQVAsQ0FBZU4sU0FBUyxDQUFDLENBQUQsQ0FBeEIsRUFDRytKLE9BREgsQ0FDVyxPQUFlQyxLQUFmLEtBQXlCO0FBQUEsY0FBeEIsQ0FBQ0MsR0FBRCxFQUFNQyxLQUFOLENBQXdCO0FBQ2hDLGVBQUtDLGVBQUwsQ0FBcUJGLEdBQXJCLEVBQTBCQyxLQUExQjtBQUNBLGNBQUcsS0FBS3JDLFlBQVIsRUFBc0IsS0FBS3VDLEtBQUwsQ0FBV0gsR0FBWCxFQUFnQkMsS0FBaEI7QUFDdkIsU0FKSDtBQUtBOztBQUNGLFdBQUssQ0FBTDtBQUNFLFlBQUlELEdBQUcsR0FBR2pLLFNBQVMsQ0FBQyxDQUFELENBQW5CO0FBQ0EsWUFBSWtLLEtBQUssR0FBR2xLLFNBQVMsQ0FBQyxDQUFELENBQXJCO0FBQ0EsYUFBS21LLGVBQUwsQ0FBcUJGLEdBQXJCLEVBQTBCQyxLQUExQjtBQUNBLFlBQUcsS0FBS3JDLFlBQVIsRUFBc0IsS0FBS3VDLEtBQUwsQ0FBV0gsR0FBWCxFQUFnQkMsS0FBaEI7QUFDdEI7QUFiSjtBQWVEOztBQUNERyxFQUFBQSxLQUFLLEdBQUc7QUFDTixTQUFLbkMsUUFBTCxHQUFnQixLQUFLRyxLQUFMLEVBQWhCOztBQUNBLFlBQU9ySSxTQUFTLENBQUNDLE1BQWpCO0FBQ0UsV0FBSyxDQUFMO0FBQ0UsYUFBSSxJQUFJZ0ssSUFBUixJQUFlNUosTUFBTSxDQUFDMEUsSUFBUCxDQUFZLEtBQUswQixLQUFqQixDQUFmLEVBQXdDO0FBQ3RDLGVBQUs2RCxpQkFBTCxDQUF1QkwsSUFBdkI7QUFDRDs7QUFDRDs7QUFDRixXQUFLLENBQUw7QUFDRSxZQUFJQSxHQUFHLEdBQUdqSyxTQUFTLENBQUMsQ0FBRCxDQUFuQjtBQUNBLGFBQUtzSyxpQkFBTCxDQUF1QkwsR0FBdkI7QUFDQTtBQVRKO0FBV0Q7O0FBQ0RHLEVBQUFBLEtBQUssR0FBRztBQUNOLFFBQUk3QixFQUFFLEdBQUcsS0FBS0QsR0FBZDs7QUFDQSxZQUFPdEksU0FBUyxDQUFDQyxNQUFqQjtBQUNFLFdBQUssQ0FBTDtBQUNFLFlBQUlzSyxVQUFVLEdBQUdsSyxNQUFNLENBQUNDLE9BQVAsQ0FBZU4sU0FBUyxDQUFDLENBQUQsQ0FBeEIsQ0FBakI7O0FBQ0F1SyxRQUFBQSxVQUFVLENBQUNSLE9BQVgsQ0FBbUIsV0FBa0I7QUFBQSxjQUFqQixDQUFDRSxHQUFELEVBQU1DLEtBQU4sQ0FBaUI7QUFDbkMzQixVQUFBQSxFQUFFLENBQUMwQixHQUFELENBQUYsR0FBVUMsS0FBVjtBQUNELFNBRkQ7O0FBR0E7O0FBQ0YsV0FBSyxDQUFMO0FBQ0UsWUFBSUQsR0FBRyxHQUFHakssU0FBUyxDQUFDLENBQUQsQ0FBbkI7QUFDQSxZQUFJa0ssS0FBSyxHQUFHbEssU0FBUyxDQUFDLENBQUQsQ0FBckI7QUFDQXVJLFFBQUFBLEVBQUUsQ0FBQzBCLEdBQUQsQ0FBRixHQUFVQyxLQUFWO0FBQ0E7QUFYSjs7QUFhQSxTQUFLNUIsR0FBTCxHQUFXQyxFQUFYO0FBQ0Q7O0FBQ0RpQyxFQUFBQSxPQUFPLEdBQUc7QUFDUixZQUFPeEssU0FBUyxDQUFDQyxNQUFqQjtBQUNFLFdBQUssQ0FBTDtBQUNFLGVBQU8sS0FBS3FJLEdBQVo7QUFDQTs7QUFDRixXQUFLLENBQUw7QUFDRSxZQUFJQyxFQUFFLEdBQUcsS0FBS0QsR0FBZDtBQUNBLFlBQUkyQixHQUFHLEdBQUdqSyxTQUFTLENBQUMsQ0FBRCxDQUFuQjtBQUNBLGVBQU91SSxFQUFFLENBQUMwQixHQUFELENBQVQ7QUFDQSxhQUFLM0IsR0FBTCxHQUFXQyxFQUFYO0FBQ0E7QUFUSjtBQVdEOztBQUNENEIsRUFBQUEsZUFBZSxDQUFDRixHQUFELEVBQU1DLEtBQU4sRUFBYTtBQUMxQixRQUFHLENBQUMsS0FBS3pELEtBQUwsQ0FBVyxJQUFJckYsTUFBSixDQUFXNkksR0FBWCxDQUFYLENBQUosRUFBaUM7QUFDL0IsVUFBSXhKLE9BQU8sR0FBRyxJQUFkO0FBQ0FKLE1BQUFBLE1BQU0sQ0FBQ29LLGdCQUFQLENBQ0UsS0FBS2hFLEtBRFAsRUFFRTtBQUNFLFNBQUMsSUFBSXJGLE1BQUosQ0FBVzZJLEdBQVgsQ0FBRCxHQUFtQjtBQUNqQlMsVUFBQUEsWUFBWSxFQUFFLElBREc7O0FBRWpCYixVQUFBQSxHQUFHLEdBQUc7QUFBRSxtQkFBTyxLQUFLSSxHQUFMLENBQVA7QUFBa0IsV0FGVDs7QUFHakJMLFVBQUFBLEdBQUcsQ0FBQ00sS0FBRCxFQUFRO0FBQ1QsaUJBQUtELEdBQUwsSUFBWUMsS0FBWjtBQUNBLGdCQUFJUyxpQkFBaUIsR0FBRyxDQUFDLEtBQUQsRUFBUSxHQUFSLEVBQWFWLEdBQWIsRUFBa0JyTCxJQUFsQixDQUF1QixFQUF2QixDQUF4QjtBQUNBLGdCQUFJZ00sWUFBWSxHQUFHLEtBQW5CO0FBQ0FuSyxZQUFBQSxPQUFPLENBQUNxRCxJQUFSLENBQ0U2RyxpQkFERixFQUVFO0FBQ0V6SCxjQUFBQSxJQUFJLEVBQUV5SCxpQkFEUjtBQUVFaE0sY0FBQUEsSUFBSSxFQUFFO0FBQ0pzTCxnQkFBQUEsR0FBRyxFQUFFQSxHQUREO0FBRUpDLGdCQUFBQSxLQUFLLEVBQUVBO0FBRkg7QUFGUixhQUZGLEVBU0V6SixPQVRGO0FBV0FBLFlBQUFBLE9BQU8sQ0FBQ3FELElBQVIsQ0FDRThHLFlBREYsRUFFRTtBQUNFMUgsY0FBQUEsSUFBSSxFQUFFMEgsWUFEUjtBQUVFak0sY0FBQUEsSUFBSSxFQUFFO0FBQ0pzTCxnQkFBQUEsR0FBRyxFQUFFQSxHQUREO0FBRUpDLGdCQUFBQSxLQUFLLEVBQUVBO0FBRkg7QUFGUixhQUZGLEVBU0V6SixPQVRGO0FBV0Q7O0FBN0JnQjtBQURyQixPQUZGO0FBb0NEOztBQUNELFNBQUtnRyxLQUFMLENBQVcsSUFBSXJGLE1BQUosQ0FBVzZJLEdBQVgsQ0FBWCxJQUE4QkMsS0FBOUI7QUFDRDs7QUFDREksRUFBQUEsaUJBQWlCLENBQUNMLEdBQUQsRUFBTTtBQUNyQixRQUFJWSxtQkFBbUIsR0FBRyxDQUFDLE9BQUQsRUFBVSxHQUFWLEVBQWVaLEdBQWYsRUFBb0JyTCxJQUFwQixDQUF5QixFQUF6QixDQUExQjtBQUNBLFFBQUlrTSxjQUFjLEdBQUcsT0FBckI7QUFDQSxRQUFJQyxVQUFVLEdBQUcsS0FBS3RFLEtBQUwsQ0FBV3dELEdBQVgsQ0FBakI7QUFDQSxXQUFPLEtBQUt4RCxLQUFMLENBQVcsSUFBSXJGLE1BQUosQ0FBVzZJLEdBQVgsQ0FBWCxDQUFQO0FBQ0EsV0FBTyxLQUFLeEQsS0FBTCxDQUFXd0QsR0FBWCxDQUFQO0FBQ0EsU0FBS25HLElBQUwsQ0FDRStHLG1CQURGLEVBRUU7QUFDRTNILE1BQUFBLElBQUksRUFBRTJILG1CQURSO0FBRUVsTSxNQUFBQSxJQUFJLEVBQUU7QUFDSnNMLFFBQUFBLEdBQUcsRUFBRUEsR0FERDtBQUVKQyxRQUFBQSxLQUFLLEVBQUVhO0FBRkg7QUFGUixLQUZGO0FBVUEsU0FBS2pILElBQUwsQ0FDRWdILGNBREYsRUFFRTtBQUNFNUgsTUFBQUEsSUFBSSxFQUFFNEgsY0FEUjtBQUVFbk0sTUFBQUEsSUFBSSxFQUFFO0FBQ0pzTCxRQUFBQSxHQUFHLEVBQUVBLEdBREQ7QUFFSkMsUUFBQUEsS0FBSyxFQUFFYTtBQUZIO0FBRlIsS0FGRjtBQVVEOztBQUNEMUMsRUFBQUEsS0FBSyxDQUFDMUosSUFBRCxFQUFPO0FBQ1ZBLElBQUFBLElBQUksR0FBR0EsSUFBSSxJQUFJLEtBQUs4SCxLQUFwQjtBQUNBLFdBQU9pQyxJQUFJLENBQUNMLEtBQUwsQ0FBV0ssSUFBSSxDQUFDQyxTQUFMLENBQWV0SSxNQUFNLENBQUM0SCxNQUFQLENBQWMsRUFBZCxFQUFrQnRKLElBQWxCLENBQWYsQ0FBWCxDQUFQO0FBQ0Q7O0FBQ0Q4SSxFQUFBQSxNQUFNLEdBQUc7QUFDUCxRQUFJeEMsUUFBUSxHQUFHLEtBQUtBLFFBQXBCOztBQUNBLFFBQ0VBLFFBQVEsSUFDUixDQUFDLEtBQUs0QixPQUZSLEVBR0U7QUFDQSxVQUFHLEtBQUs1QixRQUFMLENBQWM0QyxZQUFqQixFQUErQixLQUFLRCxhQUFMLEdBQXFCLEtBQUszQyxRQUFMLENBQWM0QyxZQUFuQztBQUMvQixVQUFHLEtBQUs1QyxRQUFMLENBQWMrQyxVQUFqQixFQUE2QixLQUFLRCxXQUFMLEdBQW1CLEtBQUs5QyxRQUFMLENBQWMrQyxVQUFqQztBQUM3QixVQUFHLEtBQUsvQyxRQUFMLENBQWNLLFFBQWpCLEVBQTJCLEtBQUtELFNBQUwsR0FBaUIsS0FBS0osUUFBTCxDQUFjSyxRQUEvQjtBQUMzQixVQUFHLEtBQUtMLFFBQUwsQ0FBY2lFLFFBQWpCLEVBQTJCLEtBQUtELFNBQUwsR0FBaUIsS0FBS2hFLFFBQUwsQ0FBY2lFLFFBQS9CO0FBQzNCLFVBQUcsS0FBS2pFLFFBQUwsQ0FBY3FFLGdCQUFqQixFQUFtQyxLQUFLRCxpQkFBTCxHQUF5QixLQUFLcEUsUUFBTCxDQUFjcUUsZ0JBQXZDO0FBQ25DLFVBQUcsS0FBS3JFLFFBQUwsQ0FBY21FLGFBQWpCLEVBQWdDLEtBQUtELGNBQUwsR0FBc0IsS0FBS2xFLFFBQUwsQ0FBY21FLGFBQXBDO0FBQ2hDLFVBQUcsS0FBS25FLFFBQUwsQ0FBY3RHLElBQWpCLEVBQXVCLEtBQUtpTCxHQUFMLENBQVMsS0FBSzNFLFFBQUwsQ0FBY3RHLElBQXZCO0FBQ3ZCLFVBQUcsS0FBS3NHLFFBQUwsQ0FBYytELGFBQWpCLEVBQWdDLEtBQUtELGNBQUwsR0FBc0IsS0FBSzlELFFBQUwsQ0FBYytELGFBQXBDO0FBQ2hDLFVBQUcsS0FBSy9ELFFBQUwsQ0FBYzZELFVBQWpCLEVBQTZCLEtBQUtELFdBQUwsR0FBbUIsS0FBSzVELFFBQUwsQ0FBYzZELFVBQWpDO0FBQzdCLFVBQUcsS0FBSzdELFFBQUwsQ0FBY25DLE1BQWpCLEVBQXlCLEtBQUtnRixPQUFMLEdBQWUsS0FBSzdDLFFBQUwsQ0FBY25DLE1BQTdCO0FBQ3pCLFVBQUcsS0FBS21DLFFBQUwsQ0FBY1EsUUFBakIsRUFBMkIsS0FBS0QsU0FBTCxHQUFpQixLQUFLUCxRQUFMLENBQWNRLFFBQS9COztBQUMzQixVQUNFLEtBQUt5RCxRQUFMLElBQ0EsS0FBS0UsYUFETCxJQUVBLEtBQUtFLGdCQUhQLEVBSUU7QUFDQSxhQUFLQyxtQkFBTDtBQUNEOztBQUNELFVBQ0UsS0FBS1QsVUFBTCxJQUNBLEtBQUtFLGFBRlAsRUFHRTtBQUNBLGFBQUtTLGdCQUFMO0FBQ0Q7O0FBQ0QsV0FBSzdDLFFBQUwsR0FBZ0IsSUFBaEI7QUFDRDtBQUNGOztBQUNEYyxFQUFBQSxPQUFPLEdBQUc7QUFDUixRQUFJekMsUUFBUSxHQUFHLEtBQUtBLFFBQXBCOztBQUNBLFFBQ0VBLFFBQVEsSUFDUixDQUFDLEtBQUs0QixPQUZSLEVBR0U7QUFDQSxVQUNFLEtBQUtxQyxRQUFMLElBQ0EsS0FBS0UsYUFETCxJQUVBLEtBQUtFLGdCQUhQLEVBSUU7QUFDQSxhQUFLRSxvQkFBTDtBQUNEOztBQUNELFVBQ0UsS0FBS1YsVUFBTCxJQUNBLEtBQUtFLGFBRlAsRUFHRTtBQUNBLGFBQUtVLGlCQUFMO0FBQ0Q7O0FBQ0QsYUFBTyxLQUFLOUIsYUFBWjtBQUNBLGFBQU8sS0FBS0csV0FBWjtBQUNBLGFBQU8sS0FBS2tCLFNBQVo7QUFDQSxhQUFPLEtBQUtJLGlCQUFaO0FBQ0EsYUFBTyxLQUFLRixjQUFaO0FBQ0EsYUFBTyxLQUFLMUMsS0FBWjtBQUNBLGFBQU8sS0FBS3NDLGNBQVo7QUFDQSxhQUFPLEtBQUtGLFdBQVo7QUFDQSxhQUFPLEtBQUtmLE9BQVo7QUFDQSxhQUFPLEtBQUt6QyxTQUFaO0FBQ0Q7QUFDRjs7QUF6VWdDLENBQW5DO0FDQUFsSCxHQUFHLENBQUM2TSxPQUFKLEdBQWMsY0FBYzdNLEdBQUcsQ0FBQ3dKLEtBQWxCLENBQXdCO0FBQ3BDbkUsRUFBQUEsV0FBVyxHQUFHO0FBQ1osVUFBTSxHQUFHeEQsU0FBVDs7QUFDQSxRQUFHLEtBQUtpRixRQUFSLEVBQWtCO0FBQ2hCLFVBQUcsS0FBS0EsUUFBTCxDQUFjL0IsSUFBakIsRUFBdUIsS0FBSytILEtBQUwsR0FBYSxLQUFLaEcsUUFBTCxDQUFjL0IsSUFBM0I7QUFDeEI7QUFDRjs7QUFDRCxNQUFJK0gsS0FBSixHQUFZO0FBQUUsV0FBTyxLQUFLL0gsSUFBWjtBQUFrQjs7QUFDaEMsTUFBSStILEtBQUosQ0FBVS9ILElBQVYsRUFBZ0I7QUFBRSxTQUFLQSxJQUFMLEdBQVlBLElBQVo7QUFBa0I7O0FBQ3BDZ0ksRUFBQUEsUUFBUSxHQUFHO0FBQ1QsUUFBSWxKLFNBQVMsR0FBRztBQUNka0IsTUFBQUEsSUFBSSxFQUFFLEtBQUtBLElBREc7QUFFZHZFLE1BQUFBLElBQUksRUFBRSxLQUFLQTtBQUZHLEtBQWhCO0FBSUEsU0FBS21GLElBQUwsQ0FDRSxLQUFLWixJQURQLEVBRUVsQixTQUZGO0FBSUEsV0FBT0EsU0FBUDtBQUNEOztBQW5CbUMsQ0FBdEM7QUNBQTdELEdBQUcsQ0FBQ2dOLFFBQUosR0FBZSxFQUFmO0FDQUFoTixHQUFHLENBQUNnTixRQUFKLENBQWFDLGVBQWIsR0FBK0IsY0FBY2pOLEdBQUcsQ0FBQzZNLE9BQWxCLENBQTBCO0FBQ3ZEeEgsRUFBQUEsV0FBVyxHQUFHO0FBQ1osVUFBTSxHQUFHeEQsU0FBVDtBQUNBLFNBQUtxTCxXQUFMO0FBQ0EsU0FBSzVELE1BQUw7QUFDRDs7QUFDRDRELEVBQUFBLFdBQVcsR0FBRztBQUNaLFNBQUtKLEtBQUwsR0FBYSxVQUFiO0FBQ0EsU0FBS25ELE9BQUwsR0FBZTtBQUNid0QsTUFBQUEsTUFBTSxFQUFFQyxNQURLO0FBRWJDLE1BQUFBLE1BQU0sRUFBRUQsTUFGSztBQUdiRSxNQUFBQSxZQUFZLEVBQUVGLE1BSEQ7QUFJYkcsTUFBQUEsaUJBQWlCLEVBQUVIO0FBSk4sS0FBZjtBQU1EOztBQWRzRCxDQUF6RDtBQ0FBcE4sR0FBRyxDQUFDd04sSUFBSixHQUFXLGNBQWN4TixHQUFHLENBQUM2RyxJQUFsQixDQUF1QjtBQUNoQ3hCLEVBQUFBLFdBQVcsR0FBRztBQUNaLFVBQU0sR0FBR3hELFNBQVQ7QUFDRDs7QUFDRCxNQUFJNEwsWUFBSixHQUFtQjtBQUFFLFdBQU8sS0FBS0MsUUFBTCxDQUFjQyxPQUFyQjtBQUE4Qjs7QUFDbkQsTUFBSUYsWUFBSixDQUFpQkcsV0FBakIsRUFBOEI7QUFDNUIsUUFBRyxDQUFDLEtBQUtGLFFBQVQsRUFBbUIsS0FBS0EsUUFBTCxHQUFnQkcsUUFBUSxDQUFDQyxhQUFULENBQXVCRixXQUF2QixDQUFoQjtBQUNwQjs7QUFDRCxNQUFJRixRQUFKLEdBQWU7QUFBRSxXQUFPLEtBQUtLLE9BQVo7QUFBcUI7O0FBQ3RDLE1BQUlMLFFBQUosQ0FBYUssT0FBYixFQUFzQjtBQUNwQixRQUNFQSxPQUFPLFlBQVl2TSxXQUFuQixJQUNBdU0sT0FBTyxZQUFZMUosUUFGckIsRUFHRTtBQUNBLFdBQUswSixPQUFMLEdBQWVBLE9BQWY7QUFDRCxLQUxELE1BS08sSUFBRyxPQUFPQSxPQUFQLEtBQW1CLFFBQXRCLEVBQWdDO0FBQ3JDLFdBQUtBLE9BQUwsR0FBZUYsUUFBUSxDQUFDRyxhQUFULENBQXVCRCxPQUF2QixDQUFmO0FBQ0Q7O0FBQ0QsU0FBS0UsZUFBTCxDQUFxQkMsT0FBckIsQ0FBNkIsS0FBS0gsT0FBbEMsRUFBMkM7QUFDekNJLE1BQUFBLE9BQU8sRUFBRSxJQURnQztBQUV6Q0MsTUFBQUEsU0FBUyxFQUFFO0FBRjhCLEtBQTNDO0FBSUQ7O0FBQ0QsTUFBSUMsV0FBSixHQUFrQjtBQUFFLFdBQU8sS0FBS1gsUUFBTCxDQUFjWSxVQUFyQjtBQUFpQzs7QUFDckQsTUFBSUQsV0FBSixDQUFnQkMsVUFBaEIsRUFBNEI7QUFDMUIsU0FBSSxJQUFJLENBQUNDLFlBQUQsRUFBZUMsY0FBZixDQUFSLElBQTBDdE0sTUFBTSxDQUFDQyxPQUFQLENBQWVtTSxVQUFmLENBQTFDLEVBQXNFO0FBQ3BFLFVBQUcsT0FBT0UsY0FBUCxLQUEwQixXQUE3QixFQUEwQztBQUN4QyxhQUFLZCxRQUFMLENBQWNlLGVBQWQsQ0FBOEJGLFlBQTlCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBS2IsUUFBTCxDQUFjZ0IsWUFBZCxDQUEyQkgsWUFBM0IsRUFBeUNDLGNBQXpDO0FBQ0Q7QUFDRjtBQUNGOztBQUNELE1BQUlHLEdBQUosR0FBVTtBQUNSLFNBQUtDLEVBQUwsR0FBVyxLQUFLQSxFQUFOLEdBQ04sS0FBS0EsRUFEQyxHQUVOLEVBRko7QUFHQSxXQUFPLEtBQUtBLEVBQVo7QUFDRDs7QUFDRCxNQUFJRCxHQUFKLENBQVFDLEVBQVIsRUFBWTtBQUNWLFFBQUcsQ0FBQyxLQUFLRCxHQUFMLENBQVMsVUFBVCxDQUFKLEVBQTBCLEtBQUtBLEdBQUwsQ0FBUyxVQUFULElBQXVCLEtBQUtaLE9BQTVCOztBQUMxQixTQUFJLElBQUksQ0FBQ2MsS0FBRCxFQUFRQyxPQUFSLENBQVIsSUFBNEI1TSxNQUFNLENBQUNDLE9BQVAsQ0FBZXlNLEVBQWYsQ0FBNUIsRUFBZ0Q7QUFDOUMsVUFBRyxPQUFPRSxPQUFQLEtBQW1CLFFBQXRCLEVBQWdDO0FBQzlCLGFBQUtILEdBQUwsQ0FBU0UsS0FBVCxJQUFrQixLQUFLbkIsUUFBTCxDQUFjcUIsZ0JBQWQsQ0FBK0JELE9BQS9CLENBQWxCO0FBQ0QsT0FGRCxNQUVPLElBQ0xBLE9BQU8sWUFBWXROLFdBQW5CLElBQ0FzTixPQUFPLFlBQVl6SyxRQUZkLEVBR0w7QUFDQSxhQUFLc0ssR0FBTCxDQUFTRSxLQUFULElBQWtCQyxPQUFsQjtBQUNEO0FBQ0Y7QUFDRjs7QUFDRCxNQUFJRSxTQUFKLEdBQWdCO0FBQUUsV0FBTyxLQUFLQyxRQUFaO0FBQXNCOztBQUN4QyxNQUFJRCxTQUFKLENBQWNDLFFBQWQsRUFBd0I7QUFBRSxTQUFLQSxRQUFMLEdBQWdCQSxRQUFoQjtBQUEwQjs7QUFDcEQsTUFBSUMsWUFBSixHQUFtQjtBQUNqQixTQUFLQyxXQUFMLEdBQW9CLEtBQUtBLFdBQU4sR0FDZixLQUFLQSxXQURVLEdBRWYsRUFGSjtBQUdBLFdBQU8sS0FBS0EsV0FBWjtBQUNEOztBQUNELE1BQUlELFlBQUosQ0FBaUJDLFdBQWpCLEVBQThCO0FBQzVCLFNBQUtBLFdBQUwsR0FBbUJuUCxHQUFHLENBQUNlLEtBQUosQ0FBVVkscUJBQVYsQ0FDakJ3TixXQURpQixFQUNKLEtBQUtELFlBREQsQ0FBbkI7QUFHRDs7QUFDRCxNQUFJRSxrQkFBSixHQUF5QjtBQUN2QixTQUFLQyxpQkFBTCxHQUEwQixLQUFLQSxpQkFBTixHQUNyQixLQUFLQSxpQkFEZ0IsR0FFckIsRUFGSjtBQUdBLFdBQU8sS0FBS0EsaUJBQVo7QUFDRDs7QUFDRCxNQUFJRCxrQkFBSixDQUF1QkMsaUJBQXZCLEVBQTBDO0FBQ3hDLFNBQUtBLGlCQUFMLEdBQXlCclAsR0FBRyxDQUFDZSxLQUFKLENBQVVZLHFCQUFWLENBQ3ZCME4saUJBRHVCLEVBQ0osS0FBS0Qsa0JBREQsQ0FBekI7QUFHRDs7QUFDRCxNQUFJbkIsZUFBSixHQUFzQjtBQUNwQixTQUFLcUIsZ0JBQUwsR0FBeUIsS0FBS0EsZ0JBQU4sR0FDcEIsS0FBS0EsZ0JBRGUsR0FFcEIsSUFBSUMsZ0JBQUosQ0FBcUIsS0FBS0MsY0FBTCxDQUFvQkMsSUFBcEIsQ0FBeUIsSUFBekIsQ0FBckIsQ0FGSjtBQUdBLFdBQU8sS0FBS0gsZ0JBQVo7QUFDRDs7QUFDRCxNQUFJSSxPQUFKLEdBQWM7QUFBRSxXQUFPLEtBQUtDLE1BQVo7QUFBb0I7O0FBQ3BDLE1BQUlELE9BQUosQ0FBWUMsTUFBWixFQUFvQjtBQUFFLFNBQUtBLE1BQUwsR0FBY0EsTUFBZDtBQUFzQjs7QUFDNUMsTUFBSWxILFFBQUosR0FBZTtBQUFFLFdBQU8sS0FBS0MsT0FBTCxJQUFnQixLQUF2QjtBQUE4Qjs7QUFDL0MsTUFBSUQsUUFBSixDQUFhQyxPQUFiLEVBQXNCO0FBQUUsU0FBS0EsT0FBTCxHQUFlQSxPQUFmO0FBQXdCOztBQUNoRCxNQUFJa0gsVUFBSixHQUFpQjtBQUNmLFNBQUtDLFNBQUwsR0FBa0IsS0FBS0EsU0FBTixHQUNiLEtBQUtBLFNBRFEsR0FFYixFQUZKO0FBR0EsV0FBTyxLQUFLQSxTQUFaO0FBQ0Q7O0FBQ0QsTUFBSUQsVUFBSixDQUFlQyxTQUFmLEVBQTBCO0FBQ3hCLFNBQUtBLFNBQUwsR0FBaUI3UCxHQUFHLENBQUNlLEtBQUosQ0FBVVkscUJBQVYsQ0FDZmtPLFNBRGUsRUFDSixLQUFLRCxVQURELENBQWpCO0FBR0Q7O0FBQ0RKLEVBQUFBLGNBQWMsQ0FBQ00sa0JBQUQsRUFBcUJDLFFBQXJCLEVBQStCO0FBQzNDLFNBQUksSUFBSSxDQUFDQyxtQkFBRCxFQUFzQkMsY0FBdEIsQ0FBUixJQUFpRC9OLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlMk4sa0JBQWYsQ0FBakQsRUFBcUY7QUFDbkYsY0FBT0csY0FBYyxDQUFDbEksSUFBdEI7QUFDRSxhQUFLLFdBQUw7QUFDRSxjQUFJbUksd0JBQXdCLEdBQUcsQ0FBQyxZQUFELEVBQWUsY0FBZixDQUEvQjs7QUFDQSxlQUFJLElBQUlDLHNCQUFSLElBQWtDRCx3QkFBbEMsRUFBNEQ7QUFDMUQsZ0JBQUdELGNBQWMsQ0FBQ0Usc0JBQUQsQ0FBZCxDQUF1Q3JPLE1BQTFDLEVBQWtEO0FBQ2hELG1CQUFLc08sT0FBTDtBQUNEO0FBQ0Y7O0FBQ0Q7QUFSSjtBQVVEO0FBQ0Y7O0FBQ0RDLEVBQUFBLFVBQVUsR0FBRztBQUNYLFFBQUcsS0FBS1YsTUFBUixFQUFnQjtBQUNkOUIsTUFBQUEsUUFBUSxDQUFDa0IsZ0JBQVQsQ0FBMEIsS0FBS1ksTUFBTCxDQUFZNUIsT0FBdEMsRUFDQ25DLE9BREQsQ0FDVW1DLE9BQUQsSUFBYTtBQUNwQkEsUUFBQUEsT0FBTyxDQUFDdUMscUJBQVIsQ0FBOEIsS0FBS1gsTUFBTCxDQUFZWSxNQUExQyxFQUFrRCxLQUFLeEMsT0FBdkQ7QUFDRCxPQUhEO0FBSUQ7QUFDRjs7QUFDRHlDLEVBQUFBLFVBQVUsR0FBRztBQUNYLFFBQ0UsS0FBS3pDLE9BQUwsSUFDQSxLQUFLQSxPQUFMLENBQWEwQyxhQUZmLEVBR0UsS0FBSzFDLE9BQUwsQ0FBYTBDLGFBQWIsQ0FBMkJDLFdBQTNCLENBQXVDLEtBQUszQyxPQUE1QztBQUNIOztBQUNENEMsRUFBQUEsYUFBYSxDQUFDN0osUUFBRCxFQUFXO0FBQ3RCQSxJQUFBQSxRQUFRLEdBQUdBLFFBQVEsSUFBSSxLQUFLQSxRQUE1QjtBQUNBLFFBQUdBLFFBQVEsQ0FBQzhHLFdBQVosRUFBeUIsS0FBS0gsWUFBTCxHQUFvQjNHLFFBQVEsQ0FBQzhHLFdBQTdCO0FBQ3pCLFFBQUc5RyxRQUFRLENBQUNpSCxPQUFaLEVBQXFCLEtBQUtMLFFBQUwsR0FBZ0I1RyxRQUFRLENBQUNpSCxPQUF6QjtBQUNyQixRQUFHakgsUUFBUSxDQUFDd0gsVUFBWixFQUF3QixLQUFLRCxXQUFMLEdBQW1CdkgsUUFBUSxDQUFDd0gsVUFBNUI7QUFDeEIsUUFBR3hILFFBQVEsQ0FBQytJLFNBQVosRUFBdUIsS0FBS0QsVUFBTCxHQUFrQjlJLFFBQVEsQ0FBQytJLFNBQTNCO0FBQ3ZCLFFBQUcvSSxRQUFRLENBQUM2SSxNQUFaLEVBQW9CLEtBQUtELE9BQUwsR0FBZTVJLFFBQVEsQ0FBQzZJLE1BQXhCO0FBQ3JCOztBQUNEaUIsRUFBQUEsY0FBYyxDQUFDOUosUUFBRCxFQUFXO0FBQ3ZCQSxJQUFBQSxRQUFRLEdBQUdBLFFBQVEsSUFBSSxLQUFLQSxRQUE1QjtBQUNBLFFBQ0UsS0FBS2lILE9BQUwsSUFDQSxLQUFLQSxPQUFMLENBQWEwQyxhQUZmLEVBR0UsS0FBSzFDLE9BQUwsQ0FBYTBDLGFBQWIsQ0FBMkJDLFdBQTNCLENBQXVDLEtBQUszQyxPQUE1QztBQUNGLFFBQUcsS0FBS0EsT0FBUixFQUFpQixPQUFPLEtBQUtBLE9BQVo7QUFDakIsUUFBRyxLQUFLTyxVQUFSLEVBQW9CLE9BQU8sS0FBS0EsVUFBWjtBQUNwQixRQUFHLEtBQUt1QixTQUFSLEVBQW1CLE9BQU8sS0FBS0EsU0FBWjtBQUNuQixRQUFHLEtBQUtGLE1BQVIsRUFBZ0IsT0FBTyxLQUFLQSxNQUFaO0FBQ2pCOztBQUNEUyxFQUFBQSxPQUFPLEdBQUc7QUFDUixTQUFLUyxTQUFMO0FBQ0EsU0FBS0MsUUFBTDtBQUNEOztBQUNEQSxFQUFBQSxRQUFRLENBQUNoSyxRQUFELEVBQVc7QUFDakJBLElBQUFBLFFBQVEsR0FBR0EsUUFBUSxJQUFJLEtBQUtBLFFBQTVCO0FBQ0EsUUFBR0EsUUFBUSxDQUFDOEgsRUFBWixFQUFnQixLQUFLRCxHQUFMLEdBQVc3SCxRQUFRLENBQUM4SCxFQUFwQjtBQUNoQixRQUFHOUgsUUFBUSxDQUFDcUksV0FBWixFQUF5QixLQUFLRCxZQUFMLEdBQW9CcEksUUFBUSxDQUFDcUksV0FBN0I7O0FBQ3pCLFFBQUdySSxRQUFRLENBQUNtSSxRQUFaLEVBQXNCO0FBQ3BCLFdBQUtELFNBQUwsR0FBaUJsSSxRQUFRLENBQUNtSSxRQUExQjtBQUNBLFdBQUs4QixjQUFMO0FBQ0Q7QUFDRjs7QUFDREYsRUFBQUEsU0FBUyxDQUFDL0osUUFBRCxFQUFXO0FBQ2xCQSxJQUFBQSxRQUFRLEdBQUdBLFFBQVEsSUFBSSxLQUFLQSxRQUE1Qjs7QUFDQSxRQUFHQSxRQUFRLENBQUNtSSxRQUFaLEVBQXNCO0FBQ3BCLFdBQUsrQixlQUFMO0FBQ0EsYUFBTyxLQUFLaEMsU0FBWjtBQUNEOztBQUNELFdBQU8sS0FBS0MsUUFBWjtBQUNBLFdBQU8sS0FBS0wsRUFBWjtBQUNBLFdBQU8sS0FBS08sV0FBWjtBQUNEOztBQUNENEIsRUFBQUEsY0FBYyxHQUFHO0FBQ2YsUUFDRSxLQUFLOUIsUUFBTCxJQUNBLEtBQUtMLEVBREwsSUFFQSxLQUFLTyxXQUhQLEVBSUU7QUFDQW5QLE1BQUFBLEdBQUcsQ0FBQ2UsS0FBSixDQUFVeUQseUJBQVYsQ0FDRSxLQUFLeUssUUFEUCxFQUVFLEtBQUtMLEVBRlAsRUFHRSxLQUFLTyxXQUhQO0FBS0Q7QUFDRjs7QUFDRDZCLEVBQUFBLGVBQWUsR0FBRztBQUNoQixRQUNFLEtBQUsvQixRQUFMLElBQ0EsS0FBS0wsRUFETCxJQUVBLEtBQUtPLFdBSFAsRUFJRTtBQUNBblAsTUFBQUEsR0FBRyxDQUFDZSxLQUFKLENBQVUwRCw2QkFBVixDQUNFLEtBQUt3SyxRQURQLEVBRUUsS0FBS0wsRUFGUCxFQUdFLEtBQUtPLFdBSFA7QUFLRDtBQUNGOztBQUNEOEIsRUFBQUEsY0FBYyxHQUFHO0FBQ2YsUUFBRyxLQUFLbkssUUFBTCxDQUFjSyxRQUFqQixFQUEyQixLQUFLRCxTQUFMLEdBQWlCLEtBQUtKLFFBQUwsQ0FBY0ssUUFBL0I7QUFDNUI7O0FBQ0QrSixFQUFBQSxlQUFlLEdBQUc7QUFDaEIsUUFBRyxLQUFLaEssU0FBUixFQUFtQixPQUFPLEtBQUtBLFNBQVo7QUFDcEI7O0FBQ0RvQyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxRQUFJeEMsUUFBUSxHQUFHLEtBQUtBLFFBQXBCOztBQUNBLFFBQ0VBLFFBQVEsSUFDUixDQUFDLEtBQUsyQixRQUZSLEVBR0U7QUFDQSxXQUFLd0ksY0FBTDtBQUNBLFdBQUtOLGFBQUwsQ0FBbUI3SixRQUFuQjtBQUNBLFdBQUtnSyxRQUFMLENBQWNoSyxRQUFkO0FBQ0EsV0FBSzJCLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxhQUFPLElBQVA7QUFDRDtBQUNGOztBQUNEYyxFQUFBQSxPQUFPLEdBQUc7QUFDUixRQUFJekMsUUFBUSxHQUFHLEtBQUtBLFFBQXBCOztBQUNBLFFBQ0VBLFFBQVEsSUFDUixLQUFLMkIsUUFGUCxFQUdFO0FBQ0EsV0FBS29JLFNBQUwsQ0FBZS9KLFFBQWY7QUFDQSxXQUFLOEosY0FBTCxDQUFvQjlKLFFBQXBCO0FBQ0EsV0FBS29LLGVBQUw7QUFDQSxXQUFLekksUUFBTCxHQUFnQixLQUFoQjtBQUNBLGFBQU8wSSxLQUFQO0FBQ0Q7QUFDRjs7QUFoTytCLENBQWxDO0FDQUFuUixHQUFHLENBQUNvUixVQUFKLEdBQWlCLGNBQWNwUixHQUFHLENBQUM2RyxJQUFsQixDQUF1QjtBQUN0Q3hCLEVBQUFBLFdBQVcsR0FBRztBQUNaLFVBQU0sR0FBR3hELFNBQVQ7QUFDRDs7QUFDRCxNQUFJd1AsaUJBQUosR0FBd0I7QUFDdEIsU0FBS0MsZ0JBQUwsR0FBeUIsS0FBS0EsZ0JBQU4sR0FDcEIsS0FBS0EsZ0JBRGUsR0FFcEIsRUFGSjtBQUdBLFdBQU8sS0FBS0EsZ0JBQVo7QUFDRDs7QUFDRCxNQUFJRCxpQkFBSixDQUFzQkMsZ0JBQXRCLEVBQXdDO0FBQ3RDLFNBQUtBLGdCQUFMLEdBQXdCdFIsR0FBRyxDQUFDZSxLQUFKLENBQVVZLHFCQUFWLENBQ3RCMlAsZ0JBRHNCLEVBQ0osS0FBS0QsaUJBREQsQ0FBeEI7QUFHRDs7QUFDRCxNQUFJRSxlQUFKLEdBQXNCO0FBQ3BCLFNBQUtDLGNBQUwsR0FBdUIsS0FBS0EsY0FBTixHQUNsQixLQUFLQSxjQURhLEdBRWxCLEVBRko7QUFHQSxXQUFPLEtBQUtBLGNBQVo7QUFDRDs7QUFDRCxNQUFJRCxlQUFKLENBQW9CQyxjQUFwQixFQUFvQztBQUNsQyxTQUFLQSxjQUFMLEdBQXNCeFIsR0FBRyxDQUFDZSxLQUFKLENBQVVZLHFCQUFWLENBQ3BCNlAsY0FEb0IsRUFDSixLQUFLRCxlQURELENBQXRCO0FBR0Q7O0FBQ0QsTUFBSUUsY0FBSixHQUFxQjtBQUNuQixTQUFLQyxhQUFMLEdBQXNCLEtBQUtBLGFBQU4sR0FDakIsS0FBS0EsYUFEWSxHQUVqQixFQUZKO0FBR0EsV0FBTyxLQUFLQSxhQUFaO0FBQ0Q7O0FBQ0QsTUFBSUQsY0FBSixDQUFtQkMsYUFBbkIsRUFBa0M7QUFDaEMsU0FBS0EsYUFBTCxHQUFxQjFSLEdBQUcsQ0FBQ2UsS0FBSixDQUFVWSxxQkFBVixDQUNuQitQLGFBRG1CLEVBQ0osS0FBS0QsY0FERCxDQUFyQjtBQUdEOztBQUNELE1BQUlFLG9CQUFKLEdBQTJCO0FBQ3pCLFNBQUtDLG1CQUFMLEdBQTRCLEtBQUtBLG1CQUFOLEdBQ3ZCLEtBQUtBLG1CQURrQixHQUV2QixFQUZKO0FBR0EsV0FBTyxLQUFLQSxtQkFBWjtBQUNEOztBQUNELE1BQUlELG9CQUFKLENBQXlCQyxtQkFBekIsRUFBOEM7QUFDNUMsU0FBS0EsbUJBQUwsR0FBMkI1UixHQUFHLENBQUNlLEtBQUosQ0FBVVkscUJBQVYsQ0FDekJpUSxtQkFEeUIsRUFDSixLQUFLRCxvQkFERCxDQUEzQjtBQUdEOztBQUNELE1BQUlFLE9BQUosR0FBYztBQUNaLFNBQUtDLE1BQUwsR0FBZSxLQUFLQSxNQUFOLEdBQ1YsS0FBS0EsTUFESyxHQUVWLEVBRko7QUFHQSxXQUFPLEtBQUtBLE1BQVo7QUFDRDs7QUFDRCxNQUFJRCxPQUFKLENBQVlDLE1BQVosRUFBb0I7QUFDbEIsU0FBS0EsTUFBTCxHQUFjOVIsR0FBRyxDQUFDZSxLQUFKLENBQVVZLHFCQUFWLENBQ1ptUSxNQURZLEVBQ0osS0FBS0QsT0FERCxDQUFkO0FBR0Q7O0FBQ0QsTUFBSUUsTUFBSixHQUFhO0FBQ1gsU0FBS0MsS0FBTCxHQUFjLEtBQUtBLEtBQU4sR0FDVCxLQUFLQSxLQURJLEdBRVQsRUFGSjtBQUdBLFdBQU8sS0FBS0EsS0FBWjtBQUNEOztBQUNELE1BQUlELE1BQUosQ0FBV0MsS0FBWCxFQUFrQjtBQUNoQixTQUFLQSxLQUFMLEdBQWFoUyxHQUFHLENBQUNlLEtBQUosQ0FBVVkscUJBQVYsQ0FDWHFRLEtBRFcsRUFDSixLQUFLRCxNQURELENBQWI7QUFHRDs7QUFDRCxNQUFJRSxZQUFKLEdBQW1CO0FBQ2pCLFNBQUtDLFdBQUwsR0FBb0IsS0FBS0EsV0FBTixHQUNmLEtBQUtBLFdBRFUsR0FFZixFQUZKO0FBR0EsV0FBTyxLQUFLQSxXQUFaO0FBQ0Q7O0FBQ0QsTUFBSUQsWUFBSixDQUFpQkMsV0FBakIsRUFBOEI7QUFDNUIsU0FBS0EsV0FBTCxHQUFtQmxTLEdBQUcsQ0FBQ2UsS0FBSixDQUFVWSxxQkFBVixDQUNqQnVRLFdBRGlCLEVBQ0osS0FBS0QsWUFERCxDQUFuQjtBQUdEOztBQUNELE1BQUlFLFFBQUosR0FBZTtBQUNiLFNBQUtDLE9BQUwsR0FBZ0IsS0FBS0EsT0FBTixHQUNYLEtBQUtBLE9BRE0sR0FFWCxFQUZKO0FBR0EsV0FBTyxLQUFLQSxPQUFaO0FBQ0Q7O0FBQ0QsTUFBSUQsUUFBSixDQUFhQyxPQUFiLEVBQXNCO0FBQ3BCLFNBQUtBLE9BQUwsR0FBZXBTLEdBQUcsQ0FBQ2UsS0FBSixDQUFVWSxxQkFBVixDQUNieVEsT0FEYSxFQUNKLEtBQUtELFFBREQsQ0FBZjtBQUdEOztBQUNELE1BQUlFLGFBQUosR0FBb0I7QUFDbEIsU0FBS0MsWUFBTCxHQUFxQixLQUFLQSxZQUFOLEdBQ2hCLEtBQUtBLFlBRFcsR0FFaEIsRUFGSjtBQUdBLFdBQU8sS0FBS0EsWUFBWjtBQUNEOztBQUNELE1BQUlELGFBQUosQ0FBa0JDLFlBQWxCLEVBQWdDO0FBQzlCLFNBQUtBLFlBQUwsR0FBb0J0UyxHQUFHLENBQUNlLEtBQUosQ0FBVVkscUJBQVYsQ0FDbEIyUSxZQURrQixFQUNKLEtBQUtELGFBREQsQ0FBcEI7QUFHRDs7QUFDRCxNQUFJRSxnQkFBSixHQUF1QjtBQUNyQixTQUFLQyxlQUFMLEdBQXdCLEtBQUtBLGVBQU4sR0FDbkIsS0FBS0EsZUFEYyxHQUVuQixFQUZKO0FBR0EsV0FBTyxLQUFLQSxlQUFaO0FBQ0Q7O0FBQ0QsTUFBSUQsZ0JBQUosQ0FBcUJDLGVBQXJCLEVBQXNDO0FBQ3BDLFNBQUtBLGVBQUwsR0FBdUJ4UyxHQUFHLENBQUNlLEtBQUosQ0FBVVkscUJBQVYsQ0FDckI2USxlQURxQixFQUNKLEtBQUtELGdCQURELENBQXZCO0FBR0Q7O0FBQ0QsTUFBSUUsY0FBSixHQUFxQjtBQUNuQixTQUFLQyxhQUFMLEdBQXNCLEtBQUtBLGFBQU4sR0FDakIsS0FBS0EsYUFEWSxHQUVqQixFQUZKO0FBR0EsV0FBTyxLQUFLQSxhQUFaO0FBQ0Q7O0FBQ0QsTUFBSUQsY0FBSixDQUFtQkMsYUFBbkIsRUFBa0M7QUFDaEMsU0FBS0EsYUFBTCxHQUFxQjFTLEdBQUcsQ0FBQ2UsS0FBSixDQUFVWSxxQkFBVixDQUNuQitRLGFBRG1CLEVBQ0osS0FBS0QsY0FERCxDQUFyQjtBQUdEOztBQUNELE1BQUlFLFlBQUosR0FBbUI7QUFDakIsU0FBS0MsV0FBTCxHQUFvQixLQUFLQSxXQUFOLEdBQ2YsS0FBS0EsV0FEVSxHQUVmLEVBRko7QUFHQSxXQUFPLEtBQUtBLFdBQVo7QUFDRDs7QUFDRCxNQUFJRCxZQUFKLENBQWlCQyxXQUFqQixFQUE4QjtBQUM1QixTQUFLQSxXQUFMLEdBQW1CNVMsR0FBRyxDQUFDZSxLQUFKLENBQVVZLHFCQUFWLENBQ2pCaVIsV0FEaUIsRUFDSixLQUFLRCxZQURELENBQW5CO0FBR0Q7O0FBQ0QsTUFBSUUsV0FBSixHQUFrQjtBQUNoQixTQUFLQyxVQUFMLEdBQW1CLEtBQUtBLFVBQU4sR0FDZCxLQUFLQSxVQURTLEdBRWQsRUFGSjtBQUdBLFdBQU8sS0FBS0EsVUFBWjtBQUNEOztBQUNELE1BQUlELFdBQUosQ0FBZ0JDLFVBQWhCLEVBQTRCO0FBQzFCLFNBQUtBLFVBQUwsR0FBa0I5UyxHQUFHLENBQUNlLEtBQUosQ0FBVVkscUJBQVYsQ0FDaEJtUixVQURnQixFQUNKLEtBQUtELFdBREQsQ0FBbEI7QUFHRDs7QUFDRCxNQUFJRSxpQkFBSixHQUF3QjtBQUN0QixTQUFLQyxnQkFBTCxHQUF5QixLQUFLQSxnQkFBTixHQUNwQixLQUFLQSxnQkFEZSxHQUVwQixFQUZKO0FBR0EsV0FBTyxLQUFLQSxnQkFBWjtBQUNEOztBQUNELE1BQUlELGlCQUFKLENBQXNCQyxnQkFBdEIsRUFBd0M7QUFDdEMsU0FBS0EsZ0JBQUwsR0FBd0JoVCxHQUFHLENBQUNlLEtBQUosQ0FBVVkscUJBQVYsQ0FDdEJxUixnQkFEc0IsRUFDSixLQUFLRCxpQkFERCxDQUF4QjtBQUdEOztBQUNELE1BQUl0SyxRQUFKLEdBQWU7QUFBRSxXQUFPLEtBQUtDLE9BQUwsSUFBZ0IsS0FBdkI7QUFBOEI7O0FBQy9DLE1BQUlELFFBQUosQ0FBYUMsT0FBYixFQUFzQjtBQUFFLFNBQUtBLE9BQUwsR0FBZUEsT0FBZjtBQUF3Qjs7QUFDaER1SyxFQUFBQSxpQkFBaUIsR0FBRztBQUNsQmpULElBQUFBLEdBQUcsQ0FBQ2UsS0FBSixDQUFVeUQseUJBQVYsQ0FBb0MsS0FBS29PLFdBQXpDLEVBQXNELEtBQUtkLE1BQTNELEVBQW1FLEtBQUtOLGNBQXhFO0FBQ0Q7O0FBQ0QwQixFQUFBQSxrQkFBa0IsR0FBRztBQUNuQmxULElBQUFBLEdBQUcsQ0FBQ2UsS0FBSixDQUFVMEQsNkJBQVYsQ0FBd0MsS0FBS21PLFdBQTdDLEVBQTBELEtBQUtkLE1BQS9ELEVBQXVFLEtBQUtOLGNBQTVFO0FBQ0Q7O0FBQ0QyQixFQUFBQSxnQkFBZ0IsR0FBRztBQUNqQm5ULElBQUFBLEdBQUcsQ0FBQ2UsS0FBSixDQUFVeUQseUJBQVYsQ0FBb0MsS0FBS3NPLFVBQXpDLEVBQXFELEtBQUtkLEtBQTFELEVBQWlFLEtBQUtOLGFBQXRFO0FBQ0Q7O0FBQ0QwQixFQUFBQSxpQkFBaUIsR0FBRztBQUNsQnBULElBQUFBLEdBQUcsQ0FBQ2UsS0FBSixDQUFVMEQsNkJBQVYsQ0FBd0MsS0FBS3FPLFVBQTdDLEVBQXlELEtBQUtkLEtBQTlELEVBQXFFLEtBQUtOLGFBQTFFO0FBQ0Q7O0FBQ0QyQixFQUFBQSxzQkFBc0IsR0FBRztBQUN2QnJULElBQUFBLEdBQUcsQ0FBQ2UsS0FBSixDQUFVeUQseUJBQVYsQ0FBb0MsS0FBS3dPLGdCQUF6QyxFQUEyRCxLQUFLZCxXQUFoRSxFQUE2RSxLQUFLTixtQkFBbEY7QUFDRDs7QUFDRDBCLEVBQUFBLHVCQUF1QixHQUFHO0FBQ3hCdFQsSUFBQUEsR0FBRyxDQUFDZSxLQUFKLENBQVUwRCw2QkFBVixDQUF3QyxLQUFLdU8sZ0JBQTdDLEVBQStELEtBQUtkLFdBQXBFLEVBQWlGLEtBQUtOLG1CQUF0RjtBQUNEOztBQUNEMkIsRUFBQUEsbUJBQW1CLEdBQUc7QUFDcEJ2VCxJQUFBQSxHQUFHLENBQUNlLEtBQUosQ0FBVXlELHlCQUFWLENBQW9DLEtBQUtrTyxhQUF6QyxFQUF3RCxLQUFLdkwsUUFBN0QsRUFBdUUsS0FBS21LLGdCQUE1RTtBQUNEOztBQUNEa0MsRUFBQUEsb0JBQW9CLEdBQUc7QUFDckJ4VCxJQUFBQSxHQUFHLENBQUNlLEtBQUosQ0FBVTBELDZCQUFWLENBQXdDLEtBQUtpTyxhQUE3QyxFQUE0RCxLQUFLdkwsUUFBakUsRUFBMkUsS0FBS21LLGdCQUFoRjtBQUNEOztBQUNEbUMsRUFBQUEsa0JBQWtCLEdBQUc7QUFDbkJ6VCxJQUFBQSxHQUFHLENBQUNlLEtBQUosQ0FBVXlELHlCQUFWLENBQW9DLEtBQUs4TixZQUF6QyxFQUF1RCxLQUFLRixPQUE1RCxFQUFxRSxLQUFLSSxlQUExRTtBQUNEOztBQUNEa0IsRUFBQUEsbUJBQW1CLEdBQUc7QUFDcEIxVCxJQUFBQSxHQUFHLENBQUNlLEtBQUosQ0FBVTBELDZCQUFWLENBQXdDLEtBQUs2TixZQUE3QyxFQUEyRCxLQUFLRixPQUFoRSxFQUF5RSxLQUFLSSxlQUE5RTtBQUNEOztBQUNEbEosRUFBQUEsTUFBTSxHQUFHO0FBQ1AsUUFBSXhDLFFBQVEsR0FBRyxLQUFLQSxRQUFwQjs7QUFDQSxRQUNFQSxRQUFRLElBQ1IsQ0FBQyxLQUFLNEIsT0FGUixFQUdFO0FBQ0EsVUFBRzVCLFFBQVEsQ0FBQzBLLGNBQVosRUFBNEIsS0FBS0QsZUFBTCxHQUF1QnpLLFFBQVEsQ0FBQzBLLGNBQWhDO0FBQzVCLFVBQUcxSyxRQUFRLENBQUM0SyxhQUFaLEVBQTJCLEtBQUtELGNBQUwsR0FBc0IzSyxRQUFRLENBQUM0SyxhQUEvQjtBQUMzQixVQUFHNUssUUFBUSxDQUFDOEssbUJBQVosRUFBaUMsS0FBS0Qsb0JBQUwsR0FBNEI3SyxRQUFRLENBQUM4SyxtQkFBckM7QUFDakMsVUFBRzlLLFFBQVEsQ0FBQ3dLLGdCQUFaLEVBQThCLEtBQUtELGlCQUFMLEdBQXlCdkssUUFBUSxDQUFDd0ssZ0JBQWxDO0FBQzlCLFVBQUd4SyxRQUFRLENBQUMwTCxlQUFaLEVBQTZCLEtBQUtELGdCQUFMLEdBQXdCekwsUUFBUSxDQUFDMEwsZUFBakM7QUFDN0IsVUFBRzFMLFFBQVEsQ0FBQ2dMLE1BQVosRUFBb0IsS0FBS0QsT0FBTCxHQUFlL0ssUUFBUSxDQUFDZ0wsTUFBeEI7QUFDcEIsVUFBR2hMLFFBQVEsQ0FBQ2tMLEtBQVosRUFBbUIsS0FBS0QsTUFBTCxHQUFjakwsUUFBUSxDQUFDa0wsS0FBdkI7QUFDbkIsVUFBR2xMLFFBQVEsQ0FBQ29MLFdBQVosRUFBeUIsS0FBS0QsWUFBTCxHQUFvQm5MLFFBQVEsQ0FBQ29MLFdBQTdCO0FBQ3pCLFVBQUdwTCxRQUFRLENBQUNLLFFBQVosRUFBc0IsS0FBS0QsU0FBTCxHQUFpQkosUUFBUSxDQUFDSyxRQUExQjtBQUN0QixVQUFHTCxRQUFRLENBQUNzTCxPQUFaLEVBQXFCLEtBQUtELFFBQUwsR0FBZ0JyTCxRQUFRLENBQUNzTCxPQUF6QjtBQUNyQixVQUFHdEwsUUFBUSxDQUFDd0wsWUFBWixFQUEwQixLQUFLRCxhQUFMLEdBQXFCdkwsUUFBUSxDQUFDd0wsWUFBOUI7QUFDMUIsVUFBR3hMLFFBQVEsQ0FBQzhMLFdBQVosRUFBeUIsS0FBS0QsWUFBTCxHQUFvQjdMLFFBQVEsQ0FBQzhMLFdBQTdCO0FBQ3pCLFVBQUc5TCxRQUFRLENBQUNnTSxVQUFaLEVBQXdCLEtBQUtELFdBQUwsR0FBbUIvTCxRQUFRLENBQUNnTSxVQUE1QjtBQUN4QixVQUFHaE0sUUFBUSxDQUFDa00sZ0JBQVosRUFBOEIsS0FBS0QsaUJBQUwsR0FBeUJqTSxRQUFRLENBQUNrTSxnQkFBbEM7QUFDOUIsVUFBR2xNLFFBQVEsQ0FBQzRMLGFBQVosRUFBMkIsS0FBS0QsY0FBTCxHQUFzQjNMLFFBQVEsQ0FBQzRMLGFBQS9COztBQUMzQixVQUNFLEtBQUtFLFdBQUwsSUFDQSxLQUFLZCxNQURMLElBRUEsS0FBS04sY0FIUCxFQUlFO0FBQ0EsYUFBS3lCLGlCQUFMO0FBQ0Q7O0FBQ0QsVUFDRSxLQUFLSCxVQUFMLElBQ0EsS0FBS2QsS0FETCxJQUVBLEtBQUtOLGFBSFAsRUFJRTtBQUNBLGFBQUt5QixnQkFBTDtBQUNEOztBQUNELFVBQ0UsS0FBS0gsZ0JBQUwsSUFDQSxLQUFLZCxXQURMLElBRUEsS0FBS04sbUJBSFAsRUFJRTtBQUNBLGFBQUt5QixzQkFBTDtBQUNEOztBQUNELFVBQ0UsS0FBS2YsWUFBTCxJQUNBLEtBQUtGLE9BREwsSUFFQSxLQUFLSSxlQUhQLEVBSUU7QUFDQSxhQUFLaUIsa0JBQUw7QUFDRDs7QUFDRCxVQUNFLEtBQUtmLGFBQUwsSUFDQSxLQUFLdkwsUUFETCxJQUVBLEtBQUttSyxnQkFIUCxFQUlFO0FBQ0EsYUFBS2lDLG1CQUFMO0FBQ0Q7O0FBQ0QsV0FBSzlLLFFBQUwsR0FBZ0IsSUFBaEI7QUFDRDtBQUNGOztBQUNEa0wsRUFBQUEsS0FBSyxHQUFHO0FBQ04sU0FBS3BLLE9BQUw7QUFDQSxTQUFLRCxNQUFMO0FBQ0Q7O0FBQ0RDLEVBQUFBLE9BQU8sR0FBRztBQUNSLFFBQUl6QyxRQUFRLEdBQUcsS0FBS0EsUUFBcEI7O0FBQ0EsUUFDRUEsUUFBUSxJQUNSLEtBQUs0QixPQUZQLEVBR0U7QUFDQSxVQUNFLEtBQUtrSyxXQUFMLElBQ0EsS0FBS2QsTUFETCxJQUVBLEtBQUtOLGNBSFAsRUFJRTtBQUNBLGFBQUswQixrQkFBTDtBQUNEOztBQUNELFVBQ0UsS0FBS0osVUFBTCxJQUNBLEtBQUtkLEtBREwsSUFFQSxLQUFLTixhQUhQLEVBSUU7QUFDQSxhQUFLMEIsaUJBQUw7QUFDRDs7QUFDRCxVQUNFLEtBQUtKLGdCQUFMLElBQ0EsS0FBS2QsV0FETCxJQUVBLEtBQUtOLG1CQUhQLEVBSUU7QUFDQSxhQUFLMEIsdUJBQUw7QUFDRDtBQUFDOztBQUNGLFFBQ0UsS0FBS2hCLFlBQUwsSUFDQSxLQUFLRixPQURMLElBRUEsS0FBS0ksZUFIUCxFQUlFO0FBQ0EsV0FBS2tCLG1CQUFMO0FBQ0Q7O0FBQ0QsUUFDRSxLQUFLaEIsYUFBTCxJQUNBLEtBQUt2TCxRQURMLElBRUEsS0FBS21LLGdCQUhQLEVBSUU7QUFDQSxXQUFLa0Msb0JBQUw7QUFDQSxhQUFPLEtBQUtqQyxlQUFaO0FBQ0EsYUFBTyxLQUFLRSxjQUFaO0FBQ0EsYUFBTyxLQUFLRSxvQkFBWjtBQUNBLGFBQU8sS0FBS04saUJBQVo7QUFDQSxhQUFPLEtBQUtrQixnQkFBWjtBQUNBLGFBQU8sS0FBS1YsT0FBWjtBQUNBLGFBQU8sS0FBS0UsTUFBWjtBQUNBLGFBQU8sS0FBS0UsWUFBWjtBQUNBLGFBQU8sS0FBSy9LLFNBQVo7QUFDQSxhQUFPLEtBQUtpTCxRQUFaO0FBQ0EsYUFBTyxLQUFLRSxhQUFaO0FBQ0EsYUFBTyxLQUFLTSxZQUFaO0FBQ0EsYUFBTyxLQUFLRSxXQUFaO0FBQ0EsYUFBTyxLQUFLRSxpQkFBWjtBQUNBLGFBQU8sS0FBS04sY0FBWjtBQUNGLFdBQUtoSyxRQUFMLEdBQWdCLEtBQWhCO0FBQ0Q7QUFDRjs7QUF0VHFDLENBQXhDO0FDQUF6SSxHQUFHLENBQUM0VCxNQUFKLEdBQWEsY0FBYzVULEdBQUcsQ0FBQzZHLElBQWxCLENBQXVCO0FBQ2xDeEIsRUFBQUEsV0FBVyxHQUFHO0FBQ1osVUFBTSxHQUFHeEQsU0FBVDtBQUNEOztBQUNELE1BQUlnUyxLQUFKLEdBQVk7QUFDVixRQUFHLEtBQUtDLEtBQVIsRUFBZTtBQUNiLGFBQU8xRyxNQUFNLENBQUMyRyxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLElBQWpCLENBQU4sQ0FBNkI3USxLQUE3QixDQUFtQyxHQUFuQyxFQUF3QzhRLEdBQXhDLEVBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxhQUFPOUcsTUFBTSxDQUFDMkcsTUFBTSxDQUFDQyxRQUFQLENBQWdCRyxRQUFqQixDQUFiO0FBQ0Q7QUFDRjs7QUFDRCxNQUFJTCxLQUFKLEdBQVk7QUFBRSxXQUFPLEtBQUtHLElBQVo7QUFBa0I7O0FBQ2hDLE1BQUlILEtBQUosQ0FBVUcsSUFBVixFQUFnQjtBQUFFLFNBQUtBLElBQUwsR0FBWUEsSUFBWjtBQUFrQjs7QUFDcEMsTUFBSXhMLFFBQUosR0FBZTtBQUFFLFdBQU8sS0FBS0MsT0FBTCxJQUFnQixLQUF2QjtBQUE4Qjs7QUFDL0MsTUFBSUQsUUFBSixDQUFhQyxPQUFiLEVBQXNCO0FBQUUsU0FBS0EsT0FBTCxHQUFlQSxPQUFmO0FBQXdCOztBQUNoRCxNQUFJMEwsT0FBSixHQUFjO0FBQ1osU0FBS0MsTUFBTCxHQUFlLEtBQUtBLE1BQU4sR0FDVixLQUFLQSxNQURLLEdBRVYsRUFGSjtBQUdBLFdBQU8sS0FBS0EsTUFBWjtBQUNEOztBQUNELE1BQUlELE9BQUosQ0FBWUMsTUFBWixFQUFvQjtBQUNsQixTQUFLQSxNQUFMLEdBQWNyVSxHQUFHLENBQUNlLEtBQUosQ0FBVVkscUJBQVYsQ0FDWjBTLE1BRFksRUFDSixLQUFLRCxPQURELENBQWQ7QUFHRDs7QUFDRCxNQUFJRSxXQUFKLEdBQWtCO0FBQUUsV0FBTyxLQUFLQyxVQUFaO0FBQXdCOztBQUM1QyxNQUFJRCxXQUFKLENBQWdCQyxVQUFoQixFQUE0QjtBQUFFLFNBQUtBLFVBQUwsR0FBa0JBLFVBQWxCO0FBQThCOztBQUM1RCxNQUFJQyxZQUFKLEdBQW1CO0FBQUUsV0FBTyxLQUFLQyxXQUFaO0FBQXlCOztBQUM5QyxNQUFJRCxZQUFKLENBQWlCQyxXQUFqQixFQUE4QjtBQUFFLFNBQUtBLFdBQUwsR0FBbUJBLFdBQW5CO0FBQWdDOztBQUNoRSxNQUFJQyxXQUFKLEdBQWtCO0FBQUUsV0FBTyxLQUFLQyxVQUFaO0FBQXdCOztBQUM1QyxNQUFJRCxXQUFKLENBQWdCQyxVQUFoQixFQUE0QjtBQUFFLFNBQUtBLFVBQUwsR0FBa0JBLFVBQWxCO0FBQThCOztBQUM1RCxNQUFJQyxnQkFBSixHQUF1QjtBQUFFLFdBQU8sSUFBSXZSLE1BQUosQ0FBVyxpRUFBWCxFQUE4RSxJQUE5RSxDQUFQO0FBQTRGOztBQUNySHdSLEVBQUFBLGtCQUFrQixDQUFDbFMsUUFBRCxFQUFXO0FBQUUsV0FBTyxJQUFJVSxNQUFKLENBQVcsSUFBSUosTUFBSixDQUFXTixRQUFYLEVBQXFCLEdBQXJCLENBQVgsQ0FBUDtBQUE4Qzs7QUFDN0UyRyxFQUFBQSxNQUFNLEdBQUc7QUFDUCxRQUFJeEMsUUFBUSxHQUFHLEtBQUtBLFFBQXBCOztBQUNBLFFBQ0VBLFFBQVEsSUFDUixDQUFDLEtBQUs0QixPQUZSLEVBR0U7QUFDQSxXQUFLb0wsS0FBTCxHQUFjLE9BQU8sS0FBS2hOLFFBQUwsQ0FBY21OLElBQXJCLEtBQThCLFNBQS9CLEdBQ1QsS0FBS25OLFFBQUwsQ0FBY21OLElBREwsR0FFVCxJQUZKO0FBR0EsV0FBS2hELGNBQUw7QUFDQSxXQUFLNkQsWUFBTDtBQUNBLFdBQUtDLFlBQUw7QUFDQSxXQUFLQyxXQUFMO0FBQ0EsV0FBS3ZNLFFBQUwsR0FBZ0IsSUFBaEI7QUFDRDtBQUNGOztBQUNEYyxFQUFBQSxPQUFPLEdBQUc7QUFDUixRQUFJekMsUUFBUSxHQUFHLEtBQUtBLFFBQXBCOztBQUNBLFFBQ0VBLFFBQVEsSUFDUixLQUFLNEIsT0FGUCxFQUdFO0FBQ0EsYUFBTyxLQUFLb0wsS0FBWjtBQUNBLFdBQUttQixhQUFMO0FBQ0EsV0FBS0MsYUFBTDtBQUNBLFdBQUtoRSxlQUFMO0FBQ0EsV0FBS3pJLFFBQUwsR0FBZ0IsS0FBaEI7QUFDRDtBQUNGOztBQUNEc00sRUFBQUEsWUFBWSxHQUFHO0FBQ2IsUUFBRyxLQUFLak8sUUFBTCxDQUFjeU4sVUFBakIsRUFBNkIsS0FBS0QsV0FBTCxHQUFtQixLQUFLeE4sUUFBTCxDQUFjeU4sVUFBakM7QUFDN0IsU0FBS0gsT0FBTCxHQUFlbFMsTUFBTSxDQUFDQyxPQUFQLENBQWUsS0FBSzJFLFFBQUwsQ0FBY3VOLE1BQTdCLEVBQXFDM1IsTUFBckMsQ0FDYixDQUNFMFIsT0FERixRQUdFZSxVQUhGLEVBSUVDLGNBSkYsS0FLSztBQUFBLFVBSEgsQ0FBQ0MsU0FBRCxFQUFZQyxhQUFaLENBR0c7QUFDSGxCLE1BQUFBLE9BQU8sQ0FBQ2lCLFNBQUQsQ0FBUCxHQUFxQixLQUFLZCxVQUFMLENBQWdCZSxhQUFoQixDQUFyQjtBQUNBLGFBQU9sQixPQUFQO0FBQ0QsS0FUWSxFQVViLEVBVmEsQ0FBZjtBQVlBO0FBQ0Q7O0FBQ0RuRCxFQUFBQSxjQUFjLEdBQUc7QUFDZixTQUFLL0osU0FBTCxHQUFpQjtBQUNmcU8sTUFBQUEsZUFBZSxFQUFFLElBQUl2VixHQUFHLENBQUNnTixRQUFKLENBQWFDLGVBQWpCO0FBREYsS0FBakI7QUFHRDs7QUFDRGlFLEVBQUFBLGVBQWUsR0FBRztBQUNoQixXQUFPLEtBQUtoSyxTQUFMLENBQWVxTyxlQUF0QjtBQUNEOztBQUNETCxFQUFBQSxhQUFhLEdBQUc7QUFDZCxXQUFPLEtBQUtkLE9BQVo7QUFDQSxXQUFPLEtBQUtFLFdBQVo7QUFDRDs7QUFDRFEsRUFBQUEsWUFBWSxHQUFHO0FBQ2JmLElBQUFBLE1BQU0sQ0FBQ3lCLGdCQUFQLENBQXdCLFlBQXhCLEVBQXNDLEtBQUtSLFdBQUwsQ0FBaUJ2RixJQUFqQixDQUFzQixJQUF0QixDQUF0QztBQUNEOztBQUNEd0YsRUFBQUEsYUFBYSxHQUFHO0FBQ2RsQixJQUFBQSxNQUFNLENBQUMwQixtQkFBUCxDQUEyQixZQUEzQixFQUF5QyxLQUFLVCxXQUFMLENBQWlCdkYsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBekM7QUFDRDs7QUFDRHVGLEVBQUFBLFdBQVcsR0FBRztBQUNaLFFBQUluQixLQUFLLEdBQUcsS0FBS0EsS0FBTCxDQUFXelEsS0FBWCxDQUFpQixHQUFqQixFQUFzQnNTLE1BQXRCLENBQThCL1MsUUFBRCxJQUFjQSxRQUFRLENBQUNiLE1BQXBELENBQVo7QUFDQStSLElBQUFBLEtBQUssR0FBSUEsS0FBSyxDQUFDL1IsTUFBUCxHQUNKK1IsS0FESSxHQUVKLENBQUMsR0FBRCxDQUZKO0FBR0EsUUFBSThCLG1CQUFtQixHQUFHelQsTUFBTSxDQUFDQyxPQUFQLENBQWUsS0FBS2tTLE1BQXBCLEVBQ3ZCcUIsTUFEdUIsQ0FDaEIsV0FBb0M7QUFBQSxVQUFuQyxDQUFDRSxVQUFELEVBQWFDLGdCQUFiLENBQW1DO0FBQzFDRCxNQUFBQSxVQUFVLEdBQUdBLFVBQVUsQ0FBQ3hTLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0JzUyxNQUF0QixDQUE4Qi9TLFFBQUQsSUFBY0EsUUFBUSxDQUFDYixNQUFwRCxDQUFiO0FBQ0E4VCxNQUFBQSxVQUFVLEdBQUlBLFVBQVUsQ0FBQzlULE1BQVosR0FDVDhULFVBRFMsR0FFVCxDQUFDLEdBQUQsQ0FGSjs7QUFHQSxVQUNFL0IsS0FBSyxDQUFDL1IsTUFBTixJQUNBK1IsS0FBSyxDQUFDL1IsTUFBTixLQUFpQjhULFVBQVUsQ0FBQzlULE1BRjlCLEVBR0U7QUFDQSxZQUFJa0IsS0FBSjtBQUNBLGVBQU80UyxVQUFVLENBQUNGLE1BQVgsQ0FBa0IsQ0FBQy9TLFFBQUQsRUFBV0MsYUFBWCxLQUE2QjtBQUNwRCxjQUNFSSxLQUFLLEtBQUs4UyxTQUFWLElBQ0E5UyxLQUFLLEtBQUssSUFGWixFQUdFO0FBQ0EsZ0JBQUdMLFFBQVEsQ0FBQyxDQUFELENBQVIsS0FBZ0IsR0FBbkIsRUFBd0I7QUFDdEJBLGNBQUFBLFFBQVEsR0FBRyxLQUFLaVMsZ0JBQWhCO0FBQ0QsYUFGRCxNQUVPO0FBQ0xqUyxjQUFBQSxRQUFRLEdBQUdBLFFBQVEsQ0FBQ29ULE9BQVQsQ0FBaUIsSUFBSTFTLE1BQUosQ0FBVyxHQUFYLEVBQWdCLElBQWhCLENBQWpCLEVBQXdDLE1BQXhDLENBQVg7QUFDQVYsY0FBQUEsUUFBUSxHQUFHLEtBQUtrUyxrQkFBTCxDQUF3QmxTLFFBQXhCLENBQVg7QUFDRDs7QUFDREssWUFBQUEsS0FBSyxHQUFHTCxRQUFRLENBQUNxVCxJQUFULENBQWNuQyxLQUFLLENBQUNqUixhQUFELENBQW5CLENBQVI7O0FBQ0EsZ0JBQ0VJLEtBQUssS0FBSyxJQUFWLElBQ0FKLGFBQWEsS0FBS2lSLEtBQUssQ0FBQy9SLE1BQU4sR0FBZSxDQUZuQyxFQUdFO0FBQ0EscUJBQU8rVCxnQkFBUDtBQUNEO0FBQ0Y7QUFDRixTQW5CTSxFQW1CSixDQW5CSSxDQUFQO0FBb0JEO0FBQ0YsS0FoQ3VCLEVBZ0NyQixDQWhDcUIsQ0FBMUI7O0FBaUNBLFFBQUk7QUFDRixVQUFHLEtBQUtsQixVQUFSLEVBQW9CLEtBQUtILFlBQUwsR0FBb0IsS0FBS0csVUFBekI7QUFDcEIsV0FBS0QsV0FBTCxHQUFtQlgsTUFBTSxDQUFDQyxRQUFQLENBQWdCaUMsSUFBbkM7QUFDQSxVQUFJQyxtQkFBbUIsR0FBR1AsbUJBQW1CLENBQUMsQ0FBRCxDQUE3QztBQUNBLFVBQUlRLGVBQWUsR0FBR1IsbUJBQW1CLENBQUMsQ0FBRCxDQUF6QztBQUNBLFVBQUlKLGVBQWUsR0FBRyxLQUFLcE8sUUFBTCxDQUFjb08sZUFBcEM7QUFDQSxVQUFJYSxtQkFBbUIsR0FBRztBQUN4QnpCLFFBQUFBLFVBQVUsRUFBRSxLQUFLQSxVQURPO0FBRXhCRixRQUFBQSxXQUFXLEVBQUUsS0FBS0EsV0FGTTtBQUd4Qm5ILFFBQUFBLFlBQVksRUFBRSxLQUFLdUcsS0FISztBQUl4QnRHLFFBQUFBLGlCQUFpQixFQUFFNEksZUFBZSxDQUFDcFI7QUFKWCxPQUExQjtBQU1Bd1EsTUFBQUEsZUFBZSxDQUFDOUosR0FBaEIsQ0FBb0IySyxtQkFBcEI7QUFDQSxXQUFLelEsSUFBTCxDQUNFNFAsZUFBZSxDQUFDeFEsSUFEbEIsRUFFRXdRLGVBQWUsQ0FBQ3hJLFFBQWhCLEVBRkY7QUFJQW9KLE1BQUFBLGVBQWUsQ0FBQ1osZUFBZSxDQUFDeEksUUFBaEIsRUFBRCxDQUFmO0FBQ0QsS0FsQkQsQ0FrQkUsT0FBTXNKLEtBQU4sRUFBYTtBQUNiLFlBQU0sd0JBQU47QUFDRDtBQUNGOztBQUNEQyxFQUFBQSxRQUFRLENBQUNDLElBQUQsRUFBTztBQUNieEMsSUFBQUEsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxJQUFoQixHQUF1QnNDLElBQXZCO0FBQ0Q7O0FBL0ppQyxDQUFwQyIsImZpbGUiOiJicm93c2VyL212Yy1mcmFtZXdvcmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTVZDID0gTVZDIHx8IHt9XHJcbiIsIk1WQy5Db25zdGFudHMgPSB7fVxuTVZDLkNPTlNUID0gTVZDLkNvbnN0YW50c1xuIiwiTVZDLkV2ZW50cyA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9ldmVudHMoKSB7XHJcbiAgICB0aGlzLmV2ZW50cyA9ICh0aGlzLmV2ZW50cylcclxuICAgICAgPyB0aGlzLmV2ZW50c1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5ldmVudHNcclxuICB9XHJcbiAgZXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKSB7IHJldHVybiB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSB8fCB7fSB9XHJcbiAgZXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIChldmVudENhbGxiYWNrLm5hbWUubGVuZ3RoKVxyXG4gICAgICA/IGV2ZW50Q2FsbGJhY2submFtZVxyXG4gICAgICA6ICdhbm9ueW1vdXNGdW5jdGlvbidcclxuICB9XHJcbiAgZXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSkge1xyXG4gICAgcmV0dXJuIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSB8fCBbXVxyXG4gIH1cclxuICBvbihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IHRoaXMuZXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tOYW1lID0gdGhpcy5ldmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tHcm91cCA9IHRoaXMuZXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSlcclxuICAgIGV2ZW50Q2FsbGJhY2tHcm91cC5wdXNoKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gPSBldmVudENhbGxiYWNrR3JvdXBcclxuICAgIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdID0gZXZlbnRDYWxsYmFja3NcclxuICB9XHJcbiAgb2ZmKCkge1xyXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgICAgY2FzZSAxOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDI6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2tOYW1lID0gdGhpcy5ldmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVtldmVudENhbGxiYWNrTmFtZV1cclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxuICBlbWl0KGV2ZW50TmFtZSwgZXZlbnREYXRhKSB7XHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja3MgPSB0aGlzLmV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSlcclxuICAgIGZvcihsZXQgW2V2ZW50Q2FsbGJhY2tHcm91cE5hbWUsIGV2ZW50Q2FsbGJhY2tHcm91cF0gb2YgT2JqZWN0LmVudHJpZXMoZXZlbnRDYWxsYmFja3MpKSB7XHJcbiAgICAgIGZvcihsZXQgZXZlbnRDYWxsYmFjayBvZiBldmVudENhbGxiYWNrR3JvdXApIHtcclxuICAgICAgICBsZXQgYWRkaXRpb25hbEFyZ3VtZW50cyA9IE9iamVjdC52YWx1ZXMoYXJndW1lbnRzKS5zcGxpY2UoMikgfHwgW11cclxuICAgICAgICBldmVudENhbGxiYWNrKGV2ZW50RGF0YSwgLi4uYWRkaXRpb25hbEFyZ3VtZW50cylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJNVkMuVGVtcGxhdGVzID0ge1xyXG4gIE9iamVjdFF1ZXJ5U3RyaW5nRm9ybWF0SW52YWxpZFJvb3Q6IGZ1bmN0aW9uIE9iamVjdFF1ZXJ5U3RyaW5nRm9ybWF0SW52YWxpZChkYXRhKSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAnT2JqZWN0IFF1ZXJ5IFwic3RyaW5nXCIgcHJvcGVydHkgbXVzdCBiZSBmb3JtYXR0ZWQgdG8gZmlyc3QgaW5jbHVkZSBcIltAXVwiLidcclxuICAgIF0uam9pbignXFxuJylcclxuICB9LFxyXG4gIERhdGFTY2hlbWFNaXNtYXRjaDogZnVuY3Rpb24gRGF0YVNjaGVtYU1pc21hdGNoKGRhdGEpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgIGBEYXRhIGFuZCBTY2hlbWEgcHJvcGVydGllcyBkbyBub3QgbWF0Y2guYFxyXG4gICAgXS5qb2luKCdcXG4nKVxyXG4gIH0sXHJcbiAgRGF0YUZ1bmN0aW9uSW52YWxpZDogZnVuY3Rpb24gRGF0YUZ1bmN0aW9uSW52YWxpZChkYXRhKSB7XHJcbiAgICBbXHJcbiAgICAgIGBNb2RlbCBEYXRhIHByb3BlcnR5IHR5cGUgXCJGdW5jdGlvblwiIGlzIG5vdCB2YWxpZC5gXHJcbiAgICBdLmpvaW4oJ1xcbicpXHJcbiAgfSxcclxuICBEYXRhVW5kZWZpbmVkOiBmdW5jdGlvbiBEYXRhVW5kZWZpbmVkKGRhdGEpIHtcclxuICAgIFtcclxuICAgICAgYE1vZGVsIERhdGEgcHJvcGVydHkgdW5kZWZpbmVkLmBcclxuICAgIF0uam9pbignXFxuJylcclxuICB9LFxyXG4gIFNjaGVtYVVuZGVmaW5lZDogZnVuY3Rpb24gU2NoZW1hVW5kZWZpbmVkKGRhdGEpIHtcclxuICAgIFtcclxuICAgICAgYE1vZGVsIFwiU2NoZW1hXCIgdW5kZWZpbmVkLmBcclxuICAgIF0uam9pbignXFxuJylcclxuICB9LFxyXG59XHJcbk1WQy5UTVBMID0gTVZDLlRlbXBsYXRlc1xyXG4iLCJNVkMuVXRpbHMgPSB7fVxyXG4iLCJNVkMuVXRpbHMuaXNBcnJheSA9IGZ1bmN0aW9uIGlzQXJyYXkob2JqZWN0KSB7IHJldHVybiBBcnJheS5pc0FycmF5KG9iamVjdCkgfVxyXG5NVkMuVXRpbHMuaXNPYmplY3QgPSBmdW5jdGlvbiBpc09iamVjdChvYmplY3QpIHtcclxuICByZXR1cm4gKCFBcnJheS5pc0FycmF5KG9iamVjdCkpXHJcbiAgICA/IHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnXHJcbiAgICA6IGZhbHNlXHJcbn1cclxuTVZDLlV0aWxzLmlzRXF1YWxUeXBlID0gZnVuY3Rpb24gaXNFcXVhbFR5cGUodmFsdWVBLCB2YWx1ZUIpIHsgcmV0dXJuIHZhbHVlQSA9PT0gdmFsdWVCIH1cclxuTVZDLlV0aWxzLmlzSFRNTEVsZW1lbnQgPSBmdW5jdGlvbiBpc0hUTUxFbGVtZW50KG9iamVjdCkge1xyXG4gIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxyXG59XHJcbiIsIk1WQy5VdGlscy50eXBlT2YgPSAgZnVuY3Rpb24gdHlwZU9mKGRhdGEpIHtcclxuICBzd2l0Y2godHlwZW9mIGRhdGEpIHtcclxuICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgIGxldCBfb2JqZWN0XHJcbiAgICAgIGlmKE1WQy5VdGlscy5pc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgLy8gQXJyYXlcclxuICAgICAgICByZXR1cm4gJ2FycmF5J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgTVZDLlV0aWxzLmlzT2JqZWN0KGRhdGEpXHJcbiAgICAgICkge1xyXG4gICAgICAgIC8vIE9iamVjdFxyXG4gICAgICAgIHJldHVybiAnb2JqZWN0J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgZGF0YSA9PT0gbnVsbFxyXG4gICAgICApIHtcclxuICAgICAgICAvLyBOdWxsXHJcbiAgICAgICAgcmV0dXJuICdudWxsJ1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBfb2JqZWN0XHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgY2FzZSAnbnVtYmVyJzpcclxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgcmV0dXJuIHR5cGVvZiBkYXRhXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QgPSBmdW5jdGlvbiBhZGRQcm9wZXJ0aWVzVG9PYmplY3QoKSB7XHJcbiAgbGV0IHRhcmdldE9iamVjdFxyXG4gIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICBjYXNlIDI6XHJcbiAgICAgIGxldCBwcm9wZXJ0aWVzID0gYXJndW1lbnRzWzBdXHJcbiAgICAgIHRhcmdldE9iamVjdCA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICBmb3IobGV0IFtwcm9wZXJ0eU5hbWUsIHByb3BlcnR5VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHByb3BlcnRpZXMpKSB7XHJcbiAgICAgICAgdGFyZ2V0T2JqZWN0W3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlXHJcbiAgICAgIH1cclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgMzpcclxuICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICBsZXQgcHJvcGVydHlWYWx1ZSA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICB0YXJnZXRPYmplY3QgPSBhcmd1bWVudHNbMl1cclxuICAgICAgdGFyZ2V0T2JqZWN0W3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIHJldHVybiB0YXJnZXRPYmplY3RcclxufVxyXG4iLCJNVkMuVXRpbHMub2JqZWN0UXVlcnkgPSBmdW5jdGlvbiBvYmplY3RRdWVyeShcclxuICBzdHJpbmcsXHJcbiAgY29udGV4dFxyXG4pIHtcclxuICBsZXQgc3RyaW5nRGF0YSA9IE1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZU5vdGF0aW9uKHN0cmluZylcclxuICBpZihzdHJpbmdEYXRhWzBdID09PSAnQCcpIHN0cmluZ0RhdGEuc3BsaWNlKDAsIDEpXHJcbiAgaWYoIXN0cmluZ0RhdGEubGVuZ3RoKSByZXR1cm4gY29udGV4dFxyXG4gIGNvbnRleHQgPSAoTVZDLlV0aWxzLmlzT2JqZWN0KGNvbnRleHQpKVxyXG4gICAgPyBPYmplY3QuZW50cmllcyhjb250ZXh0KVxyXG4gICAgOiBjb250ZXh0XHJcbiAgcmV0dXJuIHN0cmluZ0RhdGEucmVkdWNlKChvYmplY3QsIGZyYWdtZW50LCBmcmFnbWVudEluZGV4LCBmcmFnbWVudHMpID0+IHtcclxuICAgIGxldCBwcm9wZXJ0aWVzID0gW11cclxuICAgIGZyYWdtZW50ID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlRnJhZ21lbnQoZnJhZ21lbnQpXHJcbiAgICBmb3IobGV0IFtwcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV0gb2Ygb2JqZWN0KSB7XHJcbiAgICAgIGlmKHByb3BlcnR5S2V5Lm1hdGNoKGZyYWdtZW50KSkge1xyXG4gICAgICAgIGlmKGZyYWdtZW50SW5kZXggPT09IGZyYWdtZW50cy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoW1twcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV1dKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoT2JqZWN0LmVudHJpZXMocHJvcGVydHlWYWx1ZSkpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBvYmplY3QgPSBwcm9wZXJ0aWVzXHJcbiAgICByZXR1cm4gb2JqZWN0XHJcbiAgfSwgY29udGV4dClcclxufVxyXG5NVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VOb3RhdGlvbiA9IGZ1bmN0aW9uIHBhcnNlTm90YXRpb24oc3RyaW5nKSB7XHJcbiAgaWYoXHJcbiAgICBzdHJpbmcuY2hhckF0KDApID09PSAnWycgJiZcclxuICAgIHN0cmluZy5jaGFyQXQoc3RyaW5nLmxlbmd0aCAtIDEpID09ICddJ1xyXG4gICkge1xyXG4gICAgc3RyaW5nID0gc3RyaW5nXHJcbiAgICAgIC5zbGljZSgxLCAtMSlcclxuICAgICAgLnNwbGl0KCddWycpXHJcbiAgfSBlbHNlIHtcclxuICAgIHN0cmluZyA9IHN0cmluZ1xyXG4gICAgICAuc3BsaXQoJy4nKVxyXG4gIH1cclxuICByZXR1cm4gc3RyaW5nXHJcbn1cclxuTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlRnJhZ21lbnQgPSBmdW5jdGlvbiBwYXJzZUZyYWdtZW50KGZyYWdtZW50KSB7XHJcbiAgaWYoXHJcbiAgICBmcmFnbWVudC5jaGFyQXQoMCkgPT09ICcvJyAmJlxyXG4gICAgZnJhZ21lbnQuY2hhckF0KGZyYWdtZW50Lmxlbmd0aCAtIDEpID09ICcvJ1xyXG4gICkge1xyXG4gICAgZnJhZ21lbnQgPSBmcmFnbWVudC5zbGljZSgxLCAtMSlcclxuICAgIGZyYWdtZW50ID0gbmV3IFJlZ0V4cCgnXicuY29uY2F0KGZyYWdtZW50LCAnJCcpKVxyXG4gIH1cclxuICByZXR1cm4gZnJhZ21lbnRcclxufVxyXG4iLCJNVkMuVXRpbHMudG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIHRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoXHJcbiAgdG9nZ2xlTWV0aG9kLFxyXG4gIGV2ZW50cyxcclxuICB0YXJnZXRPYmplY3RzLFxyXG4gIGNhbGxiYWNrc1xyXG4pIHtcclxuICBmb3IobGV0IFtldmVudFNldHRpbmdzLCBldmVudENhbGxiYWNrTmFtZV0gb2YgT2JqZWN0LmVudHJpZXMoZXZlbnRzKSkge1xyXG4gICAgbGV0IGV2ZW50RGF0YSA9IGV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxyXG4gICAgbGV0IGV2ZW50VGFyZ2V0U2V0dGluZ3MgPSBldmVudERhdGFbMF1cclxuICAgIGxldCBldmVudE5hbWUgPSBldmVudERhdGFbMV1cclxuICAgIGxldCBldmVudFRhcmdldHMgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkoXHJcbiAgICAgIGV2ZW50VGFyZ2V0U2V0dGluZ3MsXHJcbiAgICAgIHRhcmdldE9iamVjdHNcclxuICAgIClcclxuICAgIGV2ZW50VGFyZ2V0cyA9ICghTVZDLlV0aWxzLmlzQXJyYXkoZXZlbnRUYXJnZXRzKSlcclxuICAgICAgPyBbWydAJywgZXZlbnRUYXJnZXRzXV1cclxuICAgICAgOiBldmVudFRhcmdldHNcclxuICAgIGZvcihsZXQgW2V2ZW50VGFyZ2V0TmFtZSwgZXZlbnRUYXJnZXRdIG9mIGV2ZW50VGFyZ2V0cykge1xyXG4gICAgICBsZXQgZXZlbnRNZXRob2ROYW1lID0gKHRvZ2dsZU1ldGhvZCA9PT0gJ29uJylcclxuICAgICAgPyAoXHJcbiAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCB8fFxyXG4gICAgICAgIChcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgRG9jdW1lbnRcclxuICAgICAgICApXHJcbiAgICAgICkgPyAnYWRkRXZlbnRMaXN0ZW5lcidcclxuICAgICAgICA6ICdvbidcclxuICAgICAgOiAoXHJcbiAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCB8fFxyXG4gICAgICAgIChcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgRG9jdW1lbnRcclxuICAgICAgICApXHJcbiAgICAgICkgPyAncmVtb3ZlRXZlbnRMaXN0ZW5lcidcclxuICAgICAgICA6ICdvZmYnXHJcbiAgICAgIGxldCBldmVudENhbGxiYWNrID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5KFxyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2tOYW1lLFxyXG4gICAgICAgIGNhbGxiYWNrc1xyXG4gICAgICApWzBdWzFdXHJcbiAgICAgIGlmKGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuICAgICAgICBmb3IobGV0IF9ldmVudFRhcmdldCBvZiBldmVudFRhcmdldCkge1xyXG4gICAgICAgICAgX2V2ZW50VGFyZ2V0W2V2ZW50TWV0aG9kTmFtZV0oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmKGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICBldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5NVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIGJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMoKSB7XHJcbiAgdGhpcy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKCdvbicsIC4uLmFyZ3VtZW50cylcclxufVxyXG5NVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMgPSBmdW5jdGlvbiB1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cygpIHtcclxuICB0aGlzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoJ29mZicsIC4uLmFyZ3VtZW50cylcclxufVxyXG4iLCJNVkMuVXRpbHMudmFsaWRhdGVEYXRhU2NoZW1hID0gZnVuY3Rpb24gdmFsaWRhdGVEYXRhU2NoZW1hKGRhdGEsIHNjaGVtYSkge1xyXG4gIGlmKHNjaGVtYSkge1xyXG4gICAgc3dpdGNoKE1WQy5VdGlscy50eXBlT2YoZGF0YSkpIHtcclxuICAgICAgY2FzZSAnYXJyYXknOlxyXG4gICAgICAgIGxldCBhcnJheSA9IFtdXHJcbiAgICAgICAgc2NoZW1hID0gKE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgID8gc2NoZW1hKClcclxuICAgICAgICAgIDogc2NoZW1hXHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBNVkMuVXRpbHMuaXNFcXVhbFR5cGUoXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSxcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihhcnJheSlcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHNjaGVtYS5uYW1lKVxyXG4gICAgICAgICAgZm9yKGxldCBbYXJyYXlLZXksIGFycmF5VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2goXHJcbiAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZURhdGFTY2hlbWEoYXJyYXlWYWx1ZSlcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyYXlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICAgIGxldCBvYmplY3QgPSB7fVxyXG4gICAgICAgIHNjaGVtYSA9IChNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSkgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICA/IHNjaGVtYSgpXHJcbiAgICAgICAgICA6IHNjaGVtYVxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgTVZDLlV0aWxzLmlzRXF1YWxUeXBlKFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSksXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yob2JqZWN0KVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coc2NoZW1hLm5hbWUpXHJcbiAgICAgICAgICBmb3IobGV0IFtvYmplY3RLZXksIG9iamVjdFZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xyXG4gICAgICAgICAgICBvYmplY3Rbb2JqZWN0S2V5XSA9IHRoaXMudmFsaWRhdGVEYXRhU2NoZW1hKG9iamVjdFZhbHVlLCBzY2hlbWFbb2JqZWN0S2V5XSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgICAgIHNjaGVtYSA9IChNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSkgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICA/IHNjaGVtYSgpXHJcbiAgICAgICAgICA6IHNjaGVtYVxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgTVZDLlV0aWxzLmlzRXF1YWxUeXBlKFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSksXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2YoZGF0YSlcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHNjaGVtYS5uYW1lKVxyXG4gICAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhyb3cgTVZDLlRNUExcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnbnVsbCc6XHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBNVkMuVXRpbHMuaXNFcXVhbFR5cGUoXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSxcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihkYXRhKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgICAgICB0aHJvdyBNVkMuVE1QTFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgICB0aHJvdyBNVkMuVE1QTFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IE1WQy5UTVBMXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5DaGFubmVscyA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9jaGFubmVscygpIHtcclxuICAgIHRoaXMuY2hhbm5lbHMgPSAodGhpcy5jaGFubmVscylcclxuICAgICAgPyB0aGlzLmNoYW5uZWxzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmNoYW5uZWxzXHJcbiAgfVxyXG4gIGNoYW5uZWwoY2hhbm5lbE5hbWUpIHtcclxuICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXSA9ICh0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0pXHJcbiAgICAgID8gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgIDogbmV3IE1WQy5DaGFubmVscy5DaGFubmVsKClcclxuICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbiAgb2ZmKGNoYW5uZWxOYW1lKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5DaGFubmVscy5DaGFubmVsID0gY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX3Jlc3BvbnNlcygpIHtcclxuICAgIHRoaXMucmVzcG9uc2VzID0gKHRoaXMucmVzcG9uc2VzKVxyXG4gICAgICA/IHRoaXMucmVzcG9uc2VzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLnJlc3BvbnNlc1xyXG4gIH1cclxuICByZXNwb25zZShyZXNwb25zZU5hbWUsIHJlc3BvbnNlQ2FsbGJhY2spIHtcclxuICAgIGlmKHJlc3BvbnNlQ2FsbGJhY2spIHtcclxuICAgICAgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0gPSByZXNwb25zZUNhbGxiYWNrXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlXVxyXG4gICAgfVxyXG4gIH1cclxuICByZXF1ZXN0KHJlc3BvbnNlTmFtZSwgcmVxdWVzdERhdGEpIHtcclxuICAgIGlmKHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXShyZXF1ZXN0RGF0YSlcclxuICAgIH1cclxuICB9XHJcbiAgb2ZmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yKGxldCBbcmVzcG9uc2VOYW1lXSBvZiBPYmplY3Qua2V5cyh0aGlzLl9yZXNwb25zZXMpKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiTVZDLkJhc2UgPSBjbGFzcyBleHRlbmRzIE1WQy5FdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzLCBjb25maWd1cmF0aW9uKSB7XHJcbiAgICBzdXBlcigpXHJcbiAgICBpZihjb25maWd1cmF0aW9uKSB0aGlzLl9jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvblxyXG4gICAgaWYoc2V0dGluZ3MpIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcclxuICB9XHJcbiAgZ2V0IF9jb25maWd1cmF0aW9uKCkge1xyXG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gKHRoaXMuY29uZmlndXJhdGlvbilcclxuICAgICAgPyB0aGlzLmNvbmZpZ3VyYXRpb25cclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblxyXG4gIH1cclxuICBzZXQgX2NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikgeyB0aGlzLmNvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uIH1cclxuICBnZXQgX3NldHRpbmdzKCkge1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9ICh0aGlzLnNldHRpbmdzKVxyXG4gICAgICA/IHRoaXMuc2V0dGluZ3NcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3NcclxuICB9XHJcbiAgc2V0IF9zZXR0aW5ncyhzZXR0aW5ncykge1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXHJcbiAgICAgIHNldHRpbmdzLCB0aGlzLl9zZXR0aW5nc1xyXG4gICAgKVxyXG4gIH1cclxuICBnZXQgX2VtaXR0ZXJzKCkge1xyXG4gICAgdGhpcy5lbWl0dGVycyA9ICh0aGlzLmVtaXR0ZXJzKVxyXG4gICAgICA/IHRoaXMuZW1pdHRlcnNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlcnNcclxuICB9XHJcbiAgc2V0IF9lbWl0dGVycyhlbWl0dGVycykge1xyXG4gICAgdGhpcy5lbWl0dGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXHJcbiAgICAgIGVtaXR0ZXJzLCB0aGlzLl9lbWl0dGVyc1xyXG4gICAgKVxyXG4gIH1cclxufVxyXG4iLCJNVkMuU2VydmljZSA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IF9kZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuZGVmYXVsdHMgfHwge1xuICAgIGNvbnRlbnRUeXBlOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30sXG4gICAgcmVzcG9uc2VUeXBlOiAnanNvbicsXG4gIH0gfVxuICBnZXQgX3Jlc3BvbnNlVHlwZXMoKSB7IHJldHVybiBbJycsICdhcnJheWJ1ZmZlcicsICdibG9iJywgJ2RvY3VtZW50JywgJ2pzb24nLCAndGV4dCddIH1cbiAgZ2V0IF9yZXNwb25zZVR5cGUoKSB7IHJldHVybiB0aGlzLnJlc3BvbnNlVHlwZSB9XG4gIHNldCBfcmVzcG9uc2VUeXBlKHJlc3BvbnNlVHlwZSkge1xuICAgIHRoaXMuX3hoci5yZXNwb25zZVR5cGUgPSB0aGlzLl9yZXNwb25zZVR5cGVzLmZpbmQoXG4gICAgICAocmVzcG9uc2VUeXBlSXRlbSkgPT4gcmVzcG9uc2VUeXBlSXRlbSA9PT0gcmVzcG9uc2VUeXBlXG4gICAgKSB8fCB0aGlzLl9kZWZhdWx0cy5yZXNwb25zZVR5cGVcbiAgfVxuICBnZXQgX3R5cGUoKSB7IHJldHVybiB0aGlzLnR5cGUgfVxuICBzZXQgX3R5cGUodHlwZSkgeyB0aGlzLnR5cGUgPSB0eXBlIH1cbiAgZ2V0IF91cmwoKSB7IHJldHVybiB0aGlzLnVybCB9XG4gIHNldCBfdXJsKHVybCkgeyB0aGlzLnVybCA9IHVybCB9XG4gIGdldCBfaGVhZGVycygpIHsgcmV0dXJuIHRoaXMuaGVhZGVycyB8fCBbXSB9XG4gIHNldCBfaGVhZGVycyhoZWFkZXJzKSB7XG4gICAgdGhpcy5faGVhZGVycy5sZW5ndGggPSAwXG4gICAgZm9yKGxldCBoZWFkZXIgb2YgaGVhZGVycykge1xuICAgICAgdGhpcy5feGhyLnNldFJlcXVlc3RIZWFkZXIoe2hlYWRlcn1bMF0sIHtoZWFkZXJ9WzFdKVxuICAgICAgdGhpcy5faGVhZGVycy5wdXNoKGhlYWRlcilcbiAgICB9XG4gIH1cbiAgZ2V0IF9kYXRhKCkgeyByZXR1cm4gdGhpcy5kYXRhIH1cbiAgc2V0IF9kYXRhKGRhdGEpIHsgdGhpcy5kYXRhID0gZGF0YSB9XG4gIGdldCBfeGhyKCkge1xuICAgIHRoaXMueGhyID0gKHRoaXMueGhyKVxuICAgICAgPyB0aGlzLnhoclxuICAgICAgOiBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHJldHVybiB0aGlzLnhoclxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICByZXF1ZXN0KGRhdGEpIHtcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLmRhdGEgfHwgbnVsbFxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZih0aGlzLl94aHIuc3RhdHVzID09PSAyMDApIHRoaXMuX3hoci5hYm9ydCgpXG4gICAgICB0aGlzLl94aHIub3Blbih0aGlzLnR5cGUsIHRoaXMudXJsKVxuICAgICAgdGhpcy5faGVhZGVycyA9IHRoaXMuc2V0dGluZ3MuaGVhZGVycyB8fCBbdGhpcy5fZGVmYXVsdHMuY29udGVudFR5cGVdXG4gICAgICB0aGlzLl94aHIub25sb2FkID0gcmVzb2x2ZVxuICAgICAgdGhpcy5feGhyLm9uZXJyb3IgPSByZWplY3RcbiAgICAgIHRoaXMuX3hoci5zZW5kKGRhdGEpXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgneGhyOnJlc29sdmUnLCB7XG4gICAgICAgIG5hbWU6ICd4aHI6cmVzb2x2ZScsXG4gICAgICAgIGRhdGE6IHJlc3BvbnNlLmN1cnJlbnRUYXJnZXQsXG4gICAgICB9KVxuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgIXRoaXMuZW5hYmxlZCAmJlxuICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgaWYoc2V0dGluZ3MudHlwZSkgdGhpcy5fdHlwZSA9IHNldHRpbmdzLnR5cGVcbiAgICAgIGlmKHNldHRpbmdzLnVybCkgdGhpcy5fdXJsID0gc2V0dGluZ3MudXJsXG4gICAgICBpZihzZXR0aW5ncy5kYXRhKSB0aGlzLl9kYXRhID0gc2V0dGluZ3MuZGF0YSB8fCBudWxsXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnJlc3BvbnNlVHlwZSkgdGhpcy5fcmVzcG9uc2VUeXBlID0gdGhpcy5fc2V0dGluZ3MucmVzcG9uc2VUeXBlXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHRoaXMuZW5hYmxlZCAmJlxuICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgZGVsZXRlIHRoaXMuX3R5cGVcbiAgICAgIGRlbGV0ZSB0aGlzLl91cmxcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhXG4gICAgICBkZWxldGUgdGhpcy5faGVhZGVyc1xuICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlVHlwZVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICB9XG59XG4iLCJNVkMuTW9kZWwgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfbG9jYWxTdG9yYWdlKCkgeyByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UgfVxuICBzZXQgX2xvY2FsU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHsgdGhpcy5sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UgfVxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5kZWZhdWx0cyB9XG4gIHNldCBfZGVmYXVsdHMoZGVmYXVsdHMpIHsgdGhpcy5kZWZhdWx0cyA9IGRlZmF1bHRzIH1cbiAgZ2V0IF9zY2hlbWEoKSB7IHJldHVybiB0aGlzLl9zY2hlbWEgfVxuICBzZXQgX3NjaGVtYShzY2hlbWEpIHsgdGhpcy5zY2hlbWEgPSBzY2hlbWEgfVxuICBnZXQgX2hpc3Rpb2dyYW0oKSB7IHJldHVybiB0aGlzLmhpc3Rpb2dyYW0gfHwge1xuICAgIGxlbmd0aDogMVxuICB9IH1cbiAgc2V0IF9oaXN0aW9ncmFtKGhpc3Rpb2dyYW0pIHtcbiAgICB0aGlzLmhpc3Rpb2dyYW0gPSBPYmplY3QuYXNzaWduKFxuICAgICAgdGhpcy5faGlzdGlvZ3JhbSxcbiAgICAgIGhpc3Rpb2dyYW1cbiAgICApXG4gIH1cbiAgZ2V0IF9oaXN0b3J5KCkge1xuICAgIHRoaXMuaGlzdG9yeSA9ICh0aGlzLmhpc3RvcnkpXG4gICAgICA/IHRoaXMuaGlzdG9yeVxuICAgICAgOiBbXVxuICAgIHJldHVybiB0aGlzLmhpc3RvcnlcbiAgfVxuICBzZXQgX2hpc3RvcnkoZGF0YSkge1xuICAgIGlmKFxuICAgICAgT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoXG4gICAgKSB7XG4gICAgICBpZih0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVuc2hpZnQodGhpcy5wYXJzZShkYXRhKSlcbiAgICAgICAgdGhpcy5faGlzdG9yeS5zcGxpY2UodGhpcy5faGlzdGlvZ3JhbS5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfZGIoKSB7XG4gICAgbGV0IGRiID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpXG4gICAgdGhpcy5kYiA9IChkYilcbiAgICAgID8gZGJcbiAgICAgIDogJ3t9J1xuICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMuZGIpXG4gIH1cbiAgc2V0IF9kYihkYikge1xuICAgIGRiID0gSlNPTi5zdHJpbmdpZnkoZGIpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQsIGRiKVxuICB9XG4gIGdldCBfZGF0YSgpIHtcbiAgICB0aGlzLmRhdGEgPSAgKHRoaXMuZGF0YSlcbiAgICAgID8gdGhpcy5kYXRhXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YVxuICB9XG4gIGdldCBfZGF0YUV2ZW50cygpIHtcbiAgICB0aGlzLmRhdGFFdmVudHMgPSAodGhpcy5kYXRhRXZlbnRzKVxuICAgICAgPyB0aGlzLmRhdGFFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5kYXRhRXZlbnRzXG4gIH1cbiAgc2V0IF9kYXRhRXZlbnRzKGRhdGFFdmVudHMpIHtcbiAgICB0aGlzLmRhdGFFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgZGF0YUV2ZW50cywgdGhpcy5fZGF0YUV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2RhdGFDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5kYXRhQ2FsbGJhY2tzID0gKHRoaXMuZGF0YUNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5kYXRhQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YUNhbGxiYWNrc1xuICB9XG4gIHNldCBfZGF0YUNhbGxiYWNrcyhkYXRhQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5kYXRhQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGRhdGFDYWxsYmFja3MsIHRoaXMuX2RhdGFDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9zZXJ2aWNlcygpIHtcbiAgICB0aGlzLnNlcnZpY2VzID0gICh0aGlzLnNlcnZpY2VzKVxuICAgICAgPyB0aGlzLnNlcnZpY2VzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZXNcbiAgfVxuICBzZXQgX3NlcnZpY2VzKHNlcnZpY2VzKSB7XG4gICAgdGhpcy5zZXJ2aWNlcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBzZXJ2aWNlcywgdGhpcy5fc2VydmljZXNcbiAgICApXG4gIH1cbiAgZ2V0IF9zZXJ2aWNlRXZlbnRzKCkge1xuICAgIHRoaXMuc2VydmljZUV2ZW50cyA9ICh0aGlzLnNlcnZpY2VFdmVudHMpXG4gICAgICA/IHRoaXMuc2VydmljZUV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnNlcnZpY2VFdmVudHNcbiAgfVxuICBzZXQgX3NlcnZpY2VFdmVudHMoc2VydmljZUV2ZW50cykge1xuICAgIHRoaXMuc2VydmljZUV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBzZXJ2aWNlRXZlbnRzLCB0aGlzLl9zZXJ2aWNlRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfc2VydmljZUNhbGxiYWNrcygpIHtcbiAgICB0aGlzLnNlcnZpY2VDYWxsYmFja3MgPSAodGhpcy5zZXJ2aWNlQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLnNlcnZpY2VDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9zZXJ2aWNlQ2FsbGJhY2tzKHNlcnZpY2VDYWxsYmFja3MpIHtcbiAgICB0aGlzLnNlcnZpY2VDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgc2VydmljZUNhbGxiYWNrcywgdGhpcy5fc2VydmljZUNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZW5hYmxlU2VydmljZUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnNlcnZpY2VFdmVudHMsIHRoaXMuc2VydmljZXMsIHRoaXMuc2VydmljZUNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlU2VydmljZUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5zZXJ2aWNlRXZlbnRzLCB0aGlzLnNlcnZpY2VzLCB0aGlzLnNlcnZpY2VDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlRGF0YUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmRhdGFFdmVudHMsIHRoaXMsIHRoaXMuZGF0YUNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlRGF0YUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5kYXRhRXZlbnRzLCB0aGlzLCB0aGlzLmRhdGFDYWxsYmFja3MpXG4gIH1cbiAgc2V0RGVmYXVsdHMoKSB7XG4gICAgbGV0IF9kZWZhdWx0cyA9IHt9XG4gICAgaWYodGhpcy5kZWZhdWx0cykgT2JqZWN0LmFzc2lnbihfZGVmYXVsdHMsIHRoaXMuZGVmYXVsdHMpXG4gICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIE9iamVjdC5hc3NpZ24oX2RlZmF1bHRzLCB0aGlzLl9kYilcbiAgICBpZihPYmplY3Qua2V5cyhfZGVmYXVsdHMpKSB0aGlzLnNldChfZGVmYXVsdHMpXG4gIH1cbiAgZ2V0KCkge1xuICAgIGxldCBwcm9wZXJ0eSA9IGFyZ3VtZW50c1swXVxuICAgIHJldHVybiB0aGlzLl9kYXRhWydfJy5jb25jYXQocHJvcGVydHkpXVxuICB9XG4gIHNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICAgIC5mb3JFYWNoKChba2V5LCB2YWx1ZV0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIHRoaXMuc2V0REIoa2V5LCB2YWx1ZSlcbiAgICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICB2YXIga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHZhciB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy5zZXREQihrZXksIHZhbHVlKVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICB1bnNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5fZGF0YSkpIHtcbiAgICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBzZXREQigpIHtcbiAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHZhciBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGxldCB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgdGhpcy5fZGIgPSBkYlxuICB9XG4gIHVuc2V0REIoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZGVsZXRlIHRoaXMuX2RiXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgZGVsZXRlIGRiW2tleV1cbiAgICAgICAgdGhpcy5fZGIgPSBkYlxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBzZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSkge1xuICAgIGlmKCF0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV0pIHtcbiAgICAgIGxldCBjb250ZXh0ID0gdGhpc1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXG4gICAgICAgIHRoaXMuX2RhdGEsXG4gICAgICAgIHtcbiAgICAgICAgICBbJ18nLmNvbmNhdChrZXkpXToge1xuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpc1trZXldIH0sXG4gICAgICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgdGhpc1trZXldID0gdmFsdWVcbiAgICAgICAgICAgICAgbGV0IHNldFZhbHVlRXZlbnROYW1lID0gWydzZXQnLCAnOicsIGtleV0uam9pbignJylcbiAgICAgICAgICAgICAgbGV0IHNldEV2ZW50TmFtZSA9ICdzZXQnXG4gICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICBzZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBzZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApXG4gICAgfVxuICAgIHRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXSA9IHZhbHVlXG4gIH1cbiAgdW5zZXREYXRhUHJvcGVydHkoa2V5KSB7XG4gICAgbGV0IHVuc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3Vuc2V0JywgJzonLCBrZXldLmpvaW4oJycpXG4gICAgbGV0IHVuc2V0RXZlbnROYW1lID0gJ3Vuc2V0J1xuICAgIGxldCB1bnNldFZhbHVlID0gdGhpcy5fZGF0YVtrZXldXG4gICAgZGVsZXRlIHRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXVxuICAgIGRlbGV0ZSB0aGlzLl9kYXRhW2tleV1cbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldFZhbHVlRXZlbnROYW1lLFxuICAgICAge1xuICAgICAgICBuYW1lOiB1bnNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgdmFsdWU6IHVuc2V0VmFsdWUsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApXG4gICAgdGhpcy5lbWl0KFxuICAgICAgdW5zZXRFdmVudE5hbWUsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IHVuc2V0RXZlbnROYW1lLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgdmFsdWU6IHVuc2V0VmFsdWUsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApXG4gIH1cbiAgcGFyc2UoZGF0YSkge1xuICAgIGRhdGEgPSBkYXRhIHx8IHRoaXMuX2RhdGFcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShPYmplY3QuYXNzaWduKHt9LCBkYXRhKSkpXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICBpZih0aGlzLnNldHRpbmdzLmxvY2FsU3RvcmFnZSkgdGhpcy5fbG9jYWxTdG9yYWdlID0gdGhpcy5zZXR0aW5ncy5sb2NhbFN0b3JhZ2VcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuaGlzdGlvZ3JhbSkgdGhpcy5faGlzdGlvZ3JhbSA9IHRoaXMuc2V0dGluZ3MuaGlzdGlvZ3JhbVxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5lbWl0dGVycykgdGhpcy5fZW1pdHRlcnMgPSB0aGlzLnNldHRpbmdzLmVtaXR0ZXJzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnNlcnZpY2VzKSB0aGlzLl9zZXJ2aWNlcyA9IHRoaXMuc2V0dGluZ3Muc2VydmljZXNcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3Muc2VydmljZUNhbGxiYWNrcykgdGhpcy5fc2VydmljZUNhbGxiYWNrcyA9IHRoaXMuc2V0dGluZ3Muc2VydmljZUNhbGxiYWNrc1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5zZXJ2aWNlRXZlbnRzKSB0aGlzLl9zZXJ2aWNlRXZlbnRzID0gdGhpcy5zZXR0aW5ncy5zZXJ2aWNlRXZlbnRzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRhdGEpIHRoaXMuc2V0KHRoaXMuc2V0dGluZ3MuZGF0YSlcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGF0YUNhbGxiYWNrcykgdGhpcy5fZGF0YUNhbGxiYWNrcyA9IHRoaXMuc2V0dGluZ3MuZGF0YUNhbGxiYWNrc1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5kYXRhRXZlbnRzKSB0aGlzLl9kYXRhRXZlbnRzID0gdGhpcy5zZXR0aW5ncy5kYXRhRXZlbnRzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnNjaGVtYSkgdGhpcy5fc2NoZW1hID0gdGhpcy5zZXR0aW5ncy5zY2hlbWFcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMpIHRoaXMuX2RlZmF1bHRzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0c1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMuc2VydmljZXMgJiZcbiAgICAgICAgdGhpcy5zZXJ2aWNlRXZlbnRzICYmXG4gICAgICAgIHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlU2VydmljZUV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5kYXRhRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZGF0YUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlRGF0YUV2ZW50cygpXG4gICAgICB9XG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5zZXJ2aWNlcyAmJlxuICAgICAgICB0aGlzLnNlcnZpY2VFdmVudHMgJiZcbiAgICAgICAgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlU2VydmljZUV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5kYXRhRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZGF0YUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZURhdGFFdmVudHMoKVxuICAgICAgfVxuICAgICAgZGVsZXRlIHRoaXMuX2xvY2FsU3RvcmFnZVxuICAgICAgZGVsZXRlIHRoaXMuX2hpc3Rpb2dyYW1cbiAgICAgIGRlbGV0ZSB0aGlzLl9zZXJ2aWNlc1xuICAgICAgZGVsZXRlIHRoaXMuX3NlcnZpY2VDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9zZXJ2aWNlRXZlbnRzXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YVxuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhRXZlbnRzXG4gICAgICBkZWxldGUgdGhpcy5fc2NoZW1hXG4gICAgICBkZWxldGUgdGhpcy5fZW1pdHRlcnNcbiAgICB9XG4gIH1cbn1cbiIsIk1WQy5FbWl0dGVyID0gY2xhc3MgZXh0ZW5kcyBNVkMuTW9kZWwge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxyXG4gICAgaWYodGhpcy5zZXR0aW5ncykge1xyXG4gICAgICBpZih0aGlzLnNldHRpbmdzLm5hbWUpIHRoaXMuX25hbWUgPSB0aGlzLnNldHRpbmdzLm5hbWVcclxuICAgIH1cclxuICB9XHJcbiAgZ2V0IF9uYW1lKCkgeyByZXR1cm4gdGhpcy5uYW1lIH1cclxuICBzZXQgX25hbWUobmFtZSkgeyB0aGlzLm5hbWUgPSBuYW1lIH1cclxuICBlbWlzc2lvbigpIHtcclxuICAgIGxldCBldmVudERhdGEgPSB7XHJcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcclxuICAgICAgZGF0YTogdGhpcy5kYXRhXHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgIHRoaXMubmFtZSxcclxuICAgICAgZXZlbnREYXRhXHJcbiAgICApXHJcbiAgICByZXR1cm4gZXZlbnREYXRhXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5FbWl0dGVycyA9IHt9XHJcbiIsIk1WQy5FbWl0dGVycy5OYXZpZ2F0ZUVtaXR0ZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5FbWl0dGVyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICAgIHRoaXMuYWRkU2V0dGluZ3MoKVxyXG4gICAgdGhpcy5lbmFibGUoKVxyXG4gIH1cclxuICBhZGRTZXR0aW5ncygpIHtcclxuICAgIHRoaXMuX25hbWUgPSAnbmF2aWdhdGUnXHJcbiAgICB0aGlzLl9zY2hlbWEgPSB7XHJcbiAgICAgIG9sZFVSTDogU3RyaW5nLFxyXG4gICAgICBuZXdVUkw6IFN0cmluZyxcclxuICAgICAgY3VycmVudFJvdXRlOiBTdHJpbmcsXHJcbiAgICAgIGN1cnJlbnRDb250cm9sbGVyOiBTdHJpbmcsXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIk1WQy5WaWV3ID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgX2VsZW1lbnROYW1lKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudC50YWdOYW1lIH1cbiAgc2V0IF9lbGVtZW50TmFtZShlbGVtZW50TmFtZSkge1xuICAgIGlmKCF0aGlzLl9lbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50TmFtZSlcbiAgfVxuICBnZXQgX2VsZW1lbnQoKSB7IHJldHVybiB0aGlzLmVsZW1lbnQgfVxuICBzZXQgX2VsZW1lbnQoZWxlbWVudCkge1xuICAgIGlmKFxuICAgICAgZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICBlbGVtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRcbiAgICApIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICB9IGVsc2UgaWYodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQpXG4gICAgfVxuICAgIHRoaXMuZWxlbWVudE9ic2VydmVyLm9ic2VydmUodGhpcy5lbGVtZW50LCB7XG4gICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIH0pXG4gIH1cbiAgZ2V0IF9hdHRyaWJ1dGVzKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudC5hdHRyaWJ1dGVzIH1cbiAgc2V0IF9hdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHtcbiAgICBmb3IobGV0IFthdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKSkge1xuICAgICAgaWYodHlwZW9mIGF0dHJpYnV0ZVZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVLZXkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgX3VpKCkge1xuICAgIHRoaXMudWkgPSAodGhpcy51aSlcbiAgICAgID8gdGhpcy51aVxuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnVpXG4gIH1cbiAgc2V0IF91aSh1aSkge1xuICAgIGlmKCF0aGlzLl91aVsnJGVsZW1lbnQnXSkgdGhpcy5fdWlbJyRlbGVtZW50J10gPSB0aGlzLmVsZW1lbnRcbiAgICBmb3IobGV0IFt1aUtleSwgdWlWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModWkpKSB7XG4gICAgICBpZih0eXBlb2YgdWlWYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fdWlbdWlLZXldID0gdGhpcy5fZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHVpVmFsdWUpXG4gICAgICB9IGVsc2UgaWYoXG4gICAgICAgIHVpVmFsdWUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxuICAgICAgICB1aVZhbHVlIGluc3RhbmNlb2YgRG9jdW1lbnRcbiAgICAgICkge1xuICAgICAgICB0aGlzLl91aVt1aUtleV0gPSB1aVZhbHVlXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfdWlFdmVudHMoKSB7IHJldHVybiB0aGlzLnVpRXZlbnRzIH1cbiAgc2V0IF91aUV2ZW50cyh1aUV2ZW50cykgeyB0aGlzLnVpRXZlbnRzID0gdWlFdmVudHMgfVxuICBnZXQgX3VpQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMudWlDYWxsYmFja3MgPSAodGhpcy51aUNhbGxiYWNrcylcbiAgICAgID8gdGhpcy51aUNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnVpQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF91aUNhbGxiYWNrcyh1aUNhbGxiYWNrcykge1xuICAgIHRoaXMudWlDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdWlDYWxsYmFja3MsIHRoaXMuX3VpQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfb2JzZXJ2ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5vYnNlcnZlckNhbGxiYWNrcyA9ICh0aGlzLm9ic2VydmVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX29ic2VydmVyQ2FsbGJhY2tzKG9ic2VydmVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5vYnNlcnZlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBvYnNlcnZlckNhbGxiYWNrcywgdGhpcy5fb2JzZXJ2ZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IGVsZW1lbnRPYnNlcnZlcigpIHtcbiAgICB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgPSAodGhpcy5fZWxlbWVudE9ic2VydmVyKVxuICAgICAgPyB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgICAgIDogbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5lbGVtZW50T2JzZXJ2ZS5iaW5kKHRoaXMpKVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgfVxuICBnZXQgX2luc2VydCgpIHsgcmV0dXJuIHRoaXMuaW5zZXJ0IH1cbiAgc2V0IF9pbnNlcnQoaW5zZXJ0KSB7IHRoaXMuaW5zZXJ0ID0gaW5zZXJ0IH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGdldCBfdGVtcGxhdGVzKCkge1xuICAgIHRoaXMudGVtcGxhdGVzID0gKHRoaXMudGVtcGxhdGVzKVxuICAgICAgPyB0aGlzLnRlbXBsYXRlc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnRlbXBsYXRlc1xuICB9XG4gIHNldCBfdGVtcGxhdGVzKHRlbXBsYXRlcykge1xuICAgIHRoaXMudGVtcGxhdGVzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHRlbXBsYXRlcywgdGhpcy5fdGVtcGxhdGVzXG4gICAgKVxuICB9XG4gIGVsZW1lbnRPYnNlcnZlKG11dGF0aW9uUmVjb3JkTGlzdCwgb2JzZXJ2ZXIpIHtcbiAgICBmb3IobGV0IFttdXRhdGlvblJlY29yZEluZGV4LCBtdXRhdGlvblJlY29yZF0gb2YgT2JqZWN0LmVudHJpZXMobXV0YXRpb25SZWNvcmRMaXN0KSkge1xuICAgICAgc3dpdGNoKG11dGF0aW9uUmVjb3JkLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnY2hpbGRMaXN0JzpcbiAgICAgICAgICBsZXQgbXV0YXRpb25SZWNvcmRDYXRlZ29yaWVzID0gWydhZGRlZE5vZGVzJywgJ3JlbW92ZWROb2RlcyddXG4gICAgICAgICAgZm9yKGxldCBtdXRhdGlvblJlY29yZENhdGVnb3J5IG9mIG11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcykge1xuICAgICAgICAgICAgaWYobXV0YXRpb25SZWNvcmRbbXV0YXRpb25SZWNvcmRDYXRlZ29yeV0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHRoaXMucmVzZXRVSSgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGF1dG9JbnNlcnQoKSB7XG4gICAgaWYodGhpcy5pbnNlcnQpIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5pbnNlcnQuZWxlbWVudClcbiAgICAgIC5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KHRoaXMuaW5zZXJ0Lm1ldGhvZCwgdGhpcy5lbGVtZW50KVxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgYXV0b1JlbW92ZSgpIHtcbiAgICBpZihcbiAgICAgIHRoaXMuZWxlbWVudCAmJlxuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnRcbiAgICApIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcbiAgfVxuICBlbmFibGVFbGVtZW50KHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzXG4gICAgaWYoc2V0dGluZ3MuZWxlbWVudE5hbWUpIHRoaXMuX2VsZW1lbnROYW1lID0gc2V0dGluZ3MuZWxlbWVudE5hbWVcbiAgICBpZihzZXR0aW5ncy5lbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gc2V0dGluZ3MuZWxlbWVudFxuICAgIGlmKHNldHRpbmdzLmF0dHJpYnV0ZXMpIHRoaXMuX2F0dHJpYnV0ZXMgPSBzZXR0aW5ncy5hdHRyaWJ1dGVzXG4gICAgaWYoc2V0dGluZ3MudGVtcGxhdGVzKSB0aGlzLl90ZW1wbGF0ZXMgPSBzZXR0aW5ncy50ZW1wbGF0ZXNcbiAgICBpZihzZXR0aW5ncy5pbnNlcnQpIHRoaXMuX2luc2VydCA9IHNldHRpbmdzLmluc2VydFxuICB9XG4gIGRpc2FibGVFbGVtZW50KHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICB0aGlzLmVsZW1lbnQgJiZcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50XG4gICAgKSB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpXG4gICAgaWYodGhpcy5lbGVtZW50KSBkZWxldGUgdGhpcy5lbGVtZW50XG4gICAgaWYodGhpcy5hdHRyaWJ1dGVzKSBkZWxldGUgdGhpcy5hdHRyaWJ1dGVzXG4gICAgaWYodGhpcy50ZW1wbGF0ZXMpIGRlbGV0ZSB0aGlzLnRlbXBsYXRlc1xuICAgIGlmKHRoaXMuaW5zZXJ0KSBkZWxldGUgdGhpcy5pbnNlcnRcbiAgfVxuICByZXNldFVJKCkge1xuICAgIHRoaXMuZGlzYWJsZVVJKClcbiAgICB0aGlzLmVuYWJsZVVJKClcbiAgfVxuICBlbmFibGVVSShzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKHNldHRpbmdzLnVpKSB0aGlzLl91aSA9IHNldHRpbmdzLnVpXG4gICAgaWYoc2V0dGluZ3MudWlDYWxsYmFja3MpIHRoaXMuX3VpQ2FsbGJhY2tzID0gc2V0dGluZ3MudWlDYWxsYmFja3NcbiAgICBpZihzZXR0aW5ncy51aUV2ZW50cykge1xuICAgICAgdGhpcy5fdWlFdmVudHMgPSBzZXR0aW5ncy51aUV2ZW50c1xuICAgICAgdGhpcy5lbmFibGVVSUV2ZW50cygpXG4gICAgfVxuICB9XG4gIGRpc2FibGVVSShzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKHNldHRpbmdzLnVpRXZlbnRzKSB7XG4gICAgICB0aGlzLmRpc2FibGVVSUV2ZW50cygpXG4gICAgICBkZWxldGUgdGhpcy5fdWlFdmVudHNcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMudWlFdmVudHNcbiAgICBkZWxldGUgdGhpcy51aVxuICAgIGRlbGV0ZSB0aGlzLnVpQ2FsbGJhY2tzXG4gIH1cbiAgZW5hYmxlVUlFdmVudHMoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLnVpRXZlbnRzICYmXG4gICAgICB0aGlzLnVpICYmXG4gICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgKSB7XG4gICAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyhcbiAgICAgICAgdGhpcy51aUV2ZW50cyxcbiAgICAgICAgdGhpcy51aSxcbiAgICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICAgKVxuICAgIH1cbiAgfVxuICBkaXNhYmxlVUlFdmVudHMoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLnVpRXZlbnRzICYmXG4gICAgICB0aGlzLnVpICYmXG4gICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgKSB7XG4gICAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMoXG4gICAgICAgIHRoaXMudWlFdmVudHMsXG4gICAgICAgIHRoaXMudWksXG4gICAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgZW5hYmxlRW1pdHRlcnMoKSB7XG4gICAgaWYodGhpcy5zZXR0aW5ncy5lbWl0dGVycykgdGhpcy5fZW1pdHRlcnMgPSB0aGlzLnNldHRpbmdzLmVtaXR0ZXJzXG4gIH1cbiAgZGlzYWJsZUVtaXR0ZXJzKCkge1xuICAgIGlmKHRoaXMuX2VtaXR0ZXJzKSBkZWxldGUgdGhpcy5fZW1pdHRlcnNcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLl9lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLmVuYWJsZUVtaXR0ZXJzKClcbiAgICAgIHRoaXMuZW5hYmxlRWxlbWVudChzZXR0aW5ncylcbiAgICAgIHRoaXMuZW5hYmxlVUkoc2V0dGluZ3MpXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgdGhpcy5fZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5kaXNhYmxlVUkoc2V0dGluZ3MpXG4gICAgICB0aGlzLmRpc2FibGVFbGVtZW50KHNldHRpbmdzKVxuICAgICAgdGhpcy5kaXNhYmxlRW1pdHRlcnMoKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgICByZXR1cm4gdGhpc3NcbiAgICB9XG4gIH1cbn1cbiIsIk1WQy5Db250cm9sbGVyID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgX2VtaXR0ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzID0gKHRoaXMuZW1pdHRlckNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlckNhbGxiYWNrc1xuICB9XG4gIHNldCBfZW1pdHRlckNhbGxiYWNrcyhlbWl0dGVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGVtaXR0ZXJDYWxsYmFja3MsIHRoaXMuX2VtaXR0ZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9tb2RlbENhbGxiYWNrcygpIHtcbiAgICB0aGlzLm1vZGVsQ2FsbGJhY2tzID0gKHRoaXMubW9kZWxDYWxsYmFja3MpXG4gICAgICA/IHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5tb2RlbENhbGxiYWNrc1xuICB9XG4gIHNldCBfbW9kZWxDYWxsYmFja3MobW9kZWxDYWxsYmFja3MpIHtcbiAgICB0aGlzLm1vZGVsQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG1vZGVsQ2FsbGJhY2tzLCB0aGlzLl9tb2RlbENhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX3ZpZXdDYWxsYmFja3MoKSB7XG4gICAgdGhpcy52aWV3Q2FsbGJhY2tzID0gKHRoaXMudmlld0NhbGxiYWNrcylcbiAgICAgID8gdGhpcy52aWV3Q2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudmlld0NhbGxiYWNrc1xuICB9XG4gIHNldCBfdmlld0NhbGxiYWNrcyh2aWV3Q2FsbGJhY2tzKSB7XG4gICAgdGhpcy52aWV3Q2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHZpZXdDYWxsYmFja3MsIHRoaXMuX3ZpZXdDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9jb250cm9sbGVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcyA9ICh0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX2NvbnRyb2xsZXJDYWxsYmFja3MoY29udHJvbGxlckNhbGxiYWNrcykge1xuICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBjb250cm9sbGVyQ2FsbGJhY2tzLCB0aGlzLl9jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfbW9kZWxzKCkge1xuICAgIHRoaXMubW9kZWxzID0gKHRoaXMubW9kZWxzKVxuICAgICAgPyB0aGlzLm1vZGVsc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm1vZGVsc1xuICB9XG4gIHNldCBfbW9kZWxzKG1vZGVscykge1xuICAgIHRoaXMubW9kZWxzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG1vZGVscywgdGhpcy5fbW9kZWxzXG4gICAgKVxuICB9XG4gIGdldCBfdmlld3MoKSB7XG4gICAgdGhpcy52aWV3cyA9ICh0aGlzLnZpZXdzKVxuICAgICAgPyB0aGlzLnZpZXdzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudmlld3NcbiAgfVxuICBzZXQgX3ZpZXdzKHZpZXdzKSB7XG4gICAgdGhpcy52aWV3cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB2aWV3cywgdGhpcy5fdmlld3NcbiAgICApXG4gIH1cbiAgZ2V0IF9jb250cm9sbGVycygpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJzID0gKHRoaXMuY29udHJvbGxlcnMpXG4gICAgICA/IHRoaXMuY29udHJvbGxlcnNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyc1xuICB9XG4gIHNldCBfY29udHJvbGxlcnMoY29udHJvbGxlcnMpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGNvbnRyb2xsZXJzLCB0aGlzLl9jb250cm9sbGVyc1xuICAgIClcbiAgfVxuICBnZXQgX3JvdXRlcnMoKSB7XG4gICAgdGhpcy5yb3V0ZXJzID0gKHRoaXMucm91dGVycylcbiAgICAgID8gdGhpcy5yb3V0ZXJzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVyc1xuICB9XG4gIHNldCBfcm91dGVycyhyb3V0ZXJzKSB7XG4gICAgdGhpcy5yb3V0ZXJzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlcnMsIHRoaXMuX3JvdXRlcnNcbiAgICApXG4gIH1cbiAgZ2V0IF9yb3V0ZXJFdmVudHMoKSB7XG4gICAgdGhpcy5yb3V0ZXJFdmVudHMgPSAodGhpcy5yb3V0ZXJFdmVudHMpXG4gICAgICA/IHRoaXMucm91dGVyRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVyRXZlbnRzXG4gIH1cbiAgc2V0IF9yb3V0ZXJFdmVudHMocm91dGVyRXZlbnRzKSB7XG4gICAgdGhpcy5yb3V0ZXJFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgcm91dGVyRXZlbnRzLCB0aGlzLl9yb3V0ZXJFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9yb3V0ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5yb3V0ZXJDYWxsYmFja3MgPSAodGhpcy5yb3V0ZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMucm91dGVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9yb3V0ZXJDYWxsYmFja3Mocm91dGVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5yb3V0ZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgcm91dGVyQ2FsbGJhY2tzLCB0aGlzLl9yb3V0ZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9lbWl0dGVyRXZlbnRzKCkge1xuICAgIHRoaXMuZW1pdHRlckV2ZW50cyA9ICh0aGlzLmVtaXR0ZXJFdmVudHMpXG4gICAgICA/IHRoaXMuZW1pdHRlckV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXJFdmVudHNcbiAgfVxuICBzZXQgX2VtaXR0ZXJFdmVudHMoZW1pdHRlckV2ZW50cykge1xuICAgIHRoaXMuZW1pdHRlckV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBlbWl0dGVyRXZlbnRzLCB0aGlzLl9lbWl0dGVyRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfbW9kZWxFdmVudHMoKSB7XG4gICAgdGhpcy5tb2RlbEV2ZW50cyA9ICh0aGlzLm1vZGVsRXZlbnRzKVxuICAgICAgPyB0aGlzLm1vZGVsRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMubW9kZWxFdmVudHNcbiAgfVxuICBzZXQgX21vZGVsRXZlbnRzKG1vZGVsRXZlbnRzKSB7XG4gICAgdGhpcy5tb2RlbEV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBtb2RlbEV2ZW50cywgdGhpcy5fbW9kZWxFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF92aWV3RXZlbnRzKCkge1xuICAgIHRoaXMudmlld0V2ZW50cyA9ICh0aGlzLnZpZXdFdmVudHMpXG4gICAgICA/IHRoaXMudmlld0V2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnZpZXdFdmVudHNcbiAgfVxuICBzZXQgX3ZpZXdFdmVudHModmlld0V2ZW50cykge1xuICAgIHRoaXMudmlld0V2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB2aWV3RXZlbnRzLCB0aGlzLl92aWV3RXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlckV2ZW50cygpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgPSAodGhpcy5jb250cm9sbGVyRXZlbnRzKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyRXZlbnRzXG4gIH1cbiAgc2V0IF9jb250cm9sbGVyRXZlbnRzKGNvbnRyb2xsZXJFdmVudHMpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlckV2ZW50cywgdGhpcy5fY29udHJvbGxlckV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZW5hYmxlTW9kZWxFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5tb2RlbEV2ZW50cywgdGhpcy5tb2RlbHMsIHRoaXMubW9kZWxDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZU1vZGVsRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyh0aGlzLm1vZGVsRXZlbnRzLCB0aGlzLm1vZGVscywgdGhpcy5tb2RlbENhbGxiYWNrcylcbiAgfVxuICBlbmFibGVWaWV3RXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMudmlld0V2ZW50cywgdGhpcy52aWV3cywgdGhpcy52aWV3Q2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVWaWV3RXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyh0aGlzLnZpZXdFdmVudHMsIHRoaXMudmlld3MsIHRoaXMudmlld0NhbGxiYWNrcylcbiAgfVxuICBlbmFibGVDb250cm9sbGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuY29udHJvbGxlckV2ZW50cywgdGhpcy5jb250cm9sbGVycywgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVDb250cm9sbGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyh0aGlzLmNvbnRyb2xsZXJFdmVudHMsIHRoaXMuY29udHJvbGxlcnMsIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcylcbiAgfVxuICBlbmFibGVFbWl0dGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuZW1pdHRlckV2ZW50cywgdGhpcy5lbWl0dGVycywgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVFbWl0dGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyh0aGlzLmVtaXR0ZXJFdmVudHMsIHRoaXMuZW1pdHRlcnMsIHRoaXMuZW1pdHRlckNhbGxiYWNrcylcbiAgfVxuICBlbmFibGVSb3V0ZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5yb3V0ZXJFdmVudHMsIHRoaXMucm91dGVycywgdGhpcy5yb3V0ZXJDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZVJvdXRlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5yb3V0ZXJFdmVudHMsIHRoaXMucm91dGVycywgdGhpcy5yb3V0ZXJDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICBpZihzZXR0aW5ncy5tb2RlbENhbGxiYWNrcykgdGhpcy5fbW9kZWxDYWxsYmFja3MgPSBzZXR0aW5ncy5tb2RlbENhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3Mudmlld0NhbGxiYWNrcykgdGhpcy5fdmlld0NhbGxiYWNrcyA9IHNldHRpbmdzLnZpZXdDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLmNvbnRyb2xsZXJDYWxsYmFja3MpIHRoaXMuX2NvbnRyb2xsZXJDYWxsYmFja3MgPSBzZXR0aW5ncy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5lbWl0dGVyQ2FsbGJhY2tzKSB0aGlzLl9lbWl0dGVyQ2FsbGJhY2tzID0gc2V0dGluZ3MuZW1pdHRlckNhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3Mucm91dGVyQ2FsbGJhY2tzKSB0aGlzLl9yb3V0ZXJDYWxsYmFja3MgPSBzZXR0aW5ncy5yb3V0ZXJDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLm1vZGVscykgdGhpcy5fbW9kZWxzID0gc2V0dGluZ3MubW9kZWxzXG4gICAgICBpZihzZXR0aW5ncy52aWV3cykgdGhpcy5fdmlld3MgPSBzZXR0aW5ncy52aWV3c1xuICAgICAgaWYoc2V0dGluZ3MuY29udHJvbGxlcnMpIHRoaXMuX2NvbnRyb2xsZXJzID0gc2V0dGluZ3MuY29udHJvbGxlcnNcbiAgICAgIGlmKHNldHRpbmdzLmVtaXR0ZXJzKSB0aGlzLl9lbWl0dGVycyA9IHNldHRpbmdzLmVtaXR0ZXJzXG4gICAgICBpZihzZXR0aW5ncy5yb3V0ZXJzKSB0aGlzLl9yb3V0ZXJzID0gc2V0dGluZ3Mucm91dGVyc1xuICAgICAgaWYoc2V0dGluZ3Mucm91dGVyRXZlbnRzKSB0aGlzLl9yb3V0ZXJFdmVudHMgPSBzZXR0aW5ncy5yb3V0ZXJFdmVudHNcbiAgICAgIGlmKHNldHRpbmdzLm1vZGVsRXZlbnRzKSB0aGlzLl9tb2RlbEV2ZW50cyA9IHNldHRpbmdzLm1vZGVsRXZlbnRzXG4gICAgICBpZihzZXR0aW5ncy52aWV3RXZlbnRzKSB0aGlzLl92aWV3RXZlbnRzID0gc2V0dGluZ3Mudmlld0V2ZW50c1xuICAgICAgaWYoc2V0dGluZ3MuY29udHJvbGxlckV2ZW50cykgdGhpcy5fY29udHJvbGxlckV2ZW50cyA9IHNldHRpbmdzLmNvbnRyb2xsZXJFdmVudHNcbiAgICAgIGlmKHNldHRpbmdzLmVtaXR0ZXJFdmVudHMpIHRoaXMuX2VtaXR0ZXJFdmVudHMgPSBzZXR0aW5ncy5lbWl0dGVyRXZlbnRzXG4gICAgICBpZihcbiAgICAgICAgdGhpcy5tb2RlbEV2ZW50cyAmJlxuICAgICAgICB0aGlzLm1vZGVscyAmJlxuICAgICAgICB0aGlzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5lbmFibGVNb2RlbEV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy52aWV3RXZlbnRzICYmXG4gICAgICAgIHRoaXMudmlld3MgJiZcbiAgICAgICAgdGhpcy52aWV3Q2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5lbmFibGVWaWV3RXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVycyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZUNvbnRyb2xsZXJFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMucm91dGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMucm91dGVycyAmJlxuICAgICAgICB0aGlzLnJvdXRlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlUm91dGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmVtaXR0ZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVycyAmJlxuICAgICAgICB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZUVtaXR0ZXJFdmVudHMoKVxuICAgICAgfVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5kaXNhYmxlKClcbiAgICB0aGlzLmVuYWJsZSgpXG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5tb2RlbEV2ZW50cyAmJlxuICAgICAgICB0aGlzLm1vZGVscyAmJlxuICAgICAgICB0aGlzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlTW9kZWxFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMudmlld0V2ZW50cyAmJlxuICAgICAgICB0aGlzLnZpZXdzICYmXG4gICAgICAgIHRoaXMudmlld0NhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZVZpZXdFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuY29udHJvbGxlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZUNvbnRyb2xsZXJFdmVudHMoKVxuICAgICAgfX1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnJvdXRlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLnJvdXRlcnMgJiZcbiAgICAgICAgdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVSb3V0ZXJFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuZW1pdHRlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLmVtaXR0ZXJzICYmXG4gICAgICAgIHRoaXMuZW1pdHRlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZUVtaXR0ZXJFdmVudHMoKVxuICAgICAgICBkZWxldGUgdGhpcy5fbW9kZWxDYWxsYmFja3NcbiAgICAgICAgZGVsZXRlIHRoaXMuX3ZpZXdDYWxsYmFja3NcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgICAgZGVsZXRlIHRoaXMuX2VtaXR0ZXJDYWxsYmFja3NcbiAgICAgICAgZGVsZXRlIHRoaXMuX3JvdXRlckNhbGxiYWNrc1xuICAgICAgICBkZWxldGUgdGhpcy5fbW9kZWxzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl92aWV3c1xuICAgICAgICBkZWxldGUgdGhpcy5fY29udHJvbGxlcnNcbiAgICAgICAgZGVsZXRlIHRoaXMuX2VtaXR0ZXJzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yb3V0ZXJzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yb3V0ZXJFdmVudHNcbiAgICAgICAgZGVsZXRlIHRoaXMuX21vZGVsRXZlbnRzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl92aWV3RXZlbnRzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyRXZlbnRzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9lbWl0dGVyRXZlbnRzXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gIH1cbn1cbiIsIk1WQy5Sb3V0ZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCByb3V0ZSgpIHtcbiAgICBpZih0aGlzLl9oYXNoKSB7XG4gICAgICByZXR1cm4gU3RyaW5nKHdpbmRvdy5sb2NhdGlvbi5oYXNoKS5zcGxpdCgnIycpLnBvcCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBTdHJpbmcod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKVxuICAgIH1cbiAgfVxuICBnZXQgX2hhc2goKSB7IHJldHVybiB0aGlzLmhhc2ggfVxuICBzZXQgX2hhc2goaGFzaCkgeyB0aGlzLmhhc2ggPSBoYXNoIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGdldCBfcm91dGVzKCkge1xuICAgIHRoaXMucm91dGVzID0gKHRoaXMucm91dGVzKVxuICAgICAgPyB0aGlzLnJvdXRlc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlc1xuICB9XG4gIHNldCBfcm91dGVzKHJvdXRlcykge1xuICAgIHRoaXMucm91dGVzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlcywgdGhpcy5fcm91dGVzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlcigpIHsgcmV0dXJuIHRoaXMuY29udHJvbGxlciB9XG4gIHNldCBfY29udHJvbGxlcihjb250cm9sbGVyKSB7IHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXIgfVxuICBnZXQgX3ByZXZpb3VzVVJMKCkgeyByZXR1cm4gdGhpcy5wcmV2aW91c1VSTCB9XG4gIHNldCBfcHJldmlvdXNVUkwocHJldmlvdXNVUkwpIHsgdGhpcy5wcmV2aW91c1VSTCA9IHByZXZpb3VzVVJMIH1cbiAgZ2V0IF9jdXJyZW50VVJMKCkgeyByZXR1cm4gdGhpcy5jdXJyZW50VVJMIH1cbiAgc2V0IF9jdXJyZW50VVJMKGN1cnJlbnRVUkwpIHsgdGhpcy5jdXJyZW50VVJMID0gY3VycmVudFVSTCB9XG4gIGdldCBmcmFnbWVudElEUmVnRXhwKCkgeyByZXR1cm4gbmV3IFJlZ0V4cCgvXihbMC05QS1aXFw/XFw9XFwsXFwuXFwqXFwtXFxfXFwnXFxcIlxcXlxcJVxcJFxcI1xcQFxcIVxcflxcKFxcKVxce1xcfVxcJlxcPFxcPlxcXFxcXC9dKSokLywgJ2dpJykgfVxuICBmcmFnbWVudE5hbWVSZWdFeHAoZnJhZ21lbnQpIHsgcmV0dXJuIG5ldyBSZWdFeHAoJ14nLmNvbmNhdChmcmFnbWVudCwgJyQnKSkgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuX2hhc2ggPSAodHlwZW9mIHRoaXMuc2V0dGluZ3MuaGFzaCA9PT0gJ2Jvb2xlYW4nKVxuICAgICAgICA/IHRoaXMuc2V0dGluZ3MuaGFzaFxuICAgICAgICA6IHRydWVcbiAgICAgIHRoaXMuZW5hYmxlRW1pdHRlcnMoKVxuICAgICAgdGhpcy5lbmFibGVFdmVudHMoKVxuICAgICAgdGhpcy5lbmFibGVSb3V0ZXMoKVxuICAgICAgdGhpcy5yb3V0ZUNoYW5nZSgpXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICB0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9oYXNoXG4gICAgICB0aGlzLmRpc2FibGVFdmVudHMoKVxuICAgICAgdGhpcy5kaXNhYmxlUm91dGVzKClcbiAgICAgIHRoaXMuZGlzYWJsZUVtaXR0ZXJzKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgfVxuICBlbmFibGVSb3V0ZXMoKSB7XG4gICAgaWYodGhpcy5zZXR0aW5ncy5jb250cm9sbGVyKSB0aGlzLl9jb250cm9sbGVyID0gdGhpcy5zZXR0aW5ncy5jb250cm9sbGVyXG4gICAgdGhpcy5fcm91dGVzID0gT2JqZWN0LmVudHJpZXModGhpcy5zZXR0aW5ncy5yb3V0ZXMpLnJlZHVjZShcbiAgICAgIChcbiAgICAgICAgX3JvdXRlcyxcbiAgICAgICAgW3JvdXRlUGF0aCwgcm91dGVDYWxsYmFja10sXG4gICAgICAgIHJvdXRlSW5kZXgsXG4gICAgICAgIG9yaWdpbmFsUm91dGVzLFxuICAgICAgKSA9PiB7XG4gICAgICAgIF9yb3V0ZXNbcm91dGVQYXRoXSA9IHRoaXMuY29udHJvbGxlcltyb3V0ZUNhbGxiYWNrXVxuICAgICAgICByZXR1cm4gX3JvdXRlc1xuICAgICAgfSxcbiAgICAgIHt9XG4gICAgKVxuICAgIHJldHVyblxuICB9XG4gIGVuYWJsZUVtaXR0ZXJzKCkge1xuICAgIHRoaXMuX2VtaXR0ZXJzID0ge1xuICAgICAgbmF2aWdhdGVFbWl0dGVyOiBuZXcgTVZDLkVtaXR0ZXJzLk5hdmlnYXRlRW1pdHRlcigpLFxuICAgIH1cbiAgfVxuICBkaXNhYmxlRW1pdHRlcnMoKSB7XG4gICAgZGVsZXRlIHRoaXMuX2VtaXR0ZXJzLm5hdmlnYXRlRW1pdHRlclxuICB9XG4gIGRpc2FibGVSb3V0ZXMoKSB7XG4gICAgZGVsZXRlIHRoaXMuX3JvdXRlc1xuICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyXG4gIH1cbiAgZW5hYmxlRXZlbnRzKCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgdGhpcy5yb3V0ZUNoYW5nZS5iaW5kKHRoaXMpKVxuICB9XG4gIGRpc2FibGVFdmVudHMoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLnJvdXRlQ2hhbmdlLmJpbmQodGhpcykpXG4gIH1cbiAgcm91dGVDaGFuZ2UoKSB7XG4gICAgbGV0IHJvdXRlID0gdGhpcy5yb3V0ZS5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICByb3V0ZSA9IChyb3V0ZS5sZW5ndGgpXG4gICAgICA/IHJvdXRlXG4gICAgICA6IFsnLyddXG4gICAgbGV0IHJvdXRlQ29udHJvbGxlckRhdGEgPSBPYmplY3QuZW50cmllcyh0aGlzLnJvdXRlcylcbiAgICAgIC5maWx0ZXIoKFtyb3V0ZXJQYXRoLCByb3V0ZXJDb250cm9sbGVyXSkgPT4ge1xuICAgICAgICByb3V0ZXJQYXRoID0gcm91dGVyUGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgICAgcm91dGVyUGF0aCA9IChyb3V0ZXJQYXRoLmxlbmd0aClcbiAgICAgICAgICA/IHJvdXRlclBhdGhcbiAgICAgICAgICA6IFsnLyddXG4gICAgICAgIGlmKFxuICAgICAgICAgIHJvdXRlLmxlbmd0aCAmJlxuICAgICAgICAgIHJvdXRlLmxlbmd0aCA9PT0gcm91dGVyUGF0aC5sZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgbGV0IG1hdGNoXG4gICAgICAgICAgcmV0dXJuIHJvdXRlclBhdGguZmlsdGVyKChmcmFnbWVudCwgZnJhZ21lbnRJbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgIG1hdGNoID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgICAgbWF0Y2ggPT09IHRydWVcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBpZihmcmFnbWVudFswXSA9PT0gJzonKSB7XG4gICAgICAgICAgICAgICAgZnJhZ21lbnQgPSB0aGlzLmZyYWdtZW50SURSZWdFeHBcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmcmFnbWVudCA9IGZyYWdtZW50LnJlcGxhY2UobmV3IFJlZ0V4cCgnLycsICdnaScpLCAnXFxcXFxcLycpXG4gICAgICAgICAgICAgICAgZnJhZ21lbnQgPSB0aGlzLmZyYWdtZW50TmFtZVJlZ0V4cChmcmFnbWVudClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBtYXRjaCA9IGZyYWdtZW50LnRlc3Qocm91dGVbZnJhZ21lbnRJbmRleF0pXG4gICAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICAgIG1hdGNoID09PSB0cnVlICYmXG4gICAgICAgICAgICAgICAgZnJhZ21lbnRJbmRleCA9PT0gcm91dGUubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcm91dGVyQ29udHJvbGxlclxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlbMF1cbiAgICAgICAgfVxuICAgICAgfSlbMF1cbiAgICB0cnkge1xuICAgICAgaWYodGhpcy5jdXJyZW50VVJMKSB0aGlzLl9wcmV2aW91c1VSTCA9IHRoaXMuY3VycmVudFVSTFxuICAgICAgdGhpcy5fY3VycmVudFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgICBsZXQgcm91dGVDb250cm9sbGVyTmFtZSA9IHJvdXRlQ29udHJvbGxlckRhdGFbMF1cbiAgICAgIGxldCByb3V0ZUNvbnRyb2xsZXIgPSByb3V0ZUNvbnRyb2xsZXJEYXRhWzFdXG4gICAgICBsZXQgbmF2aWdhdGVFbWl0dGVyID0gdGhpcy5lbWl0dGVycy5uYXZpZ2F0ZUVtaXR0ZXJcbiAgICAgIGxldCBuYXZpZ2F0ZUVtaXR0ZXJEYXRhID0ge1xuICAgICAgICBjdXJyZW50VVJMOiB0aGlzLmN1cnJlbnRVUkwsXG4gICAgICAgIHByZXZpb3VzVVJMOiB0aGlzLnByZXZpb3VzVVJMLFxuICAgICAgICBjdXJyZW50Um91dGU6IHRoaXMucm91dGUsXG4gICAgICAgIGN1cnJlbnRDb250cm9sbGVyOiByb3V0ZUNvbnRyb2xsZXIubmFtZVxuICAgICAgfVxuICAgICAgbmF2aWdhdGVFbWl0dGVyLnNldChuYXZpZ2F0ZUVtaXR0ZXJEYXRhKVxuICAgICAgdGhpcy5lbWl0KFxuICAgICAgICBuYXZpZ2F0ZUVtaXR0ZXIubmFtZSxcbiAgICAgICAgbmF2aWdhdGVFbWl0dGVyLmVtaXNzaW9uKClcbiAgICAgIClcbiAgICAgIHJvdXRlQ29udHJvbGxlcihuYXZpZ2F0ZUVtaXR0ZXIuZW1pc3Npb24oKSlcbiAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICB0aHJvdyAnUm91dGUgRGVmaW5pdGlvbiBFcnJvcidcbiAgICB9XG4gIH1cbiAgbmF2aWdhdGUocGF0aCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gcGF0aFxuICB9XG59XG4iXX0=
