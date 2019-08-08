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
    MVC.Utils.unbindEventsToTargetObjects(this.serviceEvents, this.services, this.serviceCallbacks);
  }

  enableDataEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.dataEvents, this, this.dataCallbacks);
  }

  disableDataEvents() {
    MVC.Utils.unbindEventsToTargetObjects(this.dataEvents, this, this.dataCallbacks);
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
          if (this.localStorage) this.setDB(key, value);
        });

        break;

      case 2:
        var key = arguments[0];
        var value = arguments[1];
        this.setDataProperty(key, value);
        if (this.localStorage) this.setDB(key, value);
        break;

      case 3:
        var key = arguments[0];
        var value = arguments[1];
        var silent = arguments[2];
        this.setDataProperty(key, value, silent);
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
      if (this.settings.localStorage) this.localStorage = this.settings.localStorage;
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

      delete this.localStorage;
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
    MVC.Utils.unbindEventsToTargetObjects(this.modelEvents, this.models, this.modelCallbacks);
  }

  enableViewEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.viewEvents, this.views, this.viewCallbacks);
  }

  disableViewEvents() {
    MVC.Utils.unbindEventsToTargetObjects(this.viewEvents, this.views, this.viewCallbacks);
  }

  enableControllerEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks);
  }

  disableControllerEvents() {
    MVC.Utils.unbindEventsToTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks);
  }

  enableEmitterEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.emitterEvents, this.emitters, this.emitterCallbacks);
  }

  disableEmitterEvents() {
    MVC.Utils.unbindEventsToTargetObjects(this.emitterEvents, this.emitters, this.emitterCallbacks);
  }

  enableRouterEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.routerEvents, this.routers, this.routerCallbacks);
  }

  disableRouterEvents() {
    MVC.Utils.unbindEventsToTargetObjects(this.routerEvents, this.routers, this.routerCallbacks);
  }

  enable() {
    var settings = this.settings;

    if (settings && !this.enabled) {
      if (settings.emitterCallbacks) this._emitterCallbacks = settings.emitterCallbacks;
      if (settings.modelCallbacks) this._modelCallbacks = settings.modelCallbacks;
      if (settings.viewCallbacks) this._viewCallbacks = settings.viewCallbacks;
      if (settings.controllerCallbacks) this._controllerCallbacks = settings.controllerCallbacks;
      if (settings.routerCallbacks) this._routerCallbacks = settings.routerCallbacks;
      if (settings.emitters) this._emitters = settings.emitters;
      if (settings.models) this._models = settings.models;
      if (settings.views) this._views = settings.views;
      if (settings.controllers) this._controllers = settings.controllers;
      if (settings.routers) this._routers = settings.routers;
      if (settings.routerEvents) this._routerEvents = settings.routerEvents;
      if (settings.emitterEvents) this._emitterEvents = settings.emitterEvents;
      if (settings.modelEvents) this._modelEvents = settings.modelEvents;
      if (settings.viewEvents) this._viewEvents = settings.viewEvents;
      if (settings.controllerEvents) this._controllerEvents = settings.controllerEvents;

      if (this.emitterEvents && this.emitters && this.emitterCallbacks) {
        this.enableEmitterEvents();
      }

      if (this.routerEvents && this.routers && this.routerCallbacks) {
        this.enableRouterEvents();
      }

      if (this.modelEvents && this.models && this.modelCallbacks) {
        this.enableModelEvents();
      }

      if (this.viewEvents && this.views && this.viewCallbacks) {
        this.enableViewEvents();
      }

      if (this.controllerEvents && this.controllers && this.controllerCallbacks) {
        this.enableControllerEvents();
      }

      this._enabled = true;
    }
  }

  disable() {
    var settings = this.settings;

    if (settings && this.enabled) {
      if (this.emitterEvents && this.emitters && this.emitterCallbacks) {
        this.disableEmitterEvents();
      }

      if (this.routerEvents && this.routers && this.routerCallbacks) {
        this.disableRouterEvents();
      }

      if (this.modelEvents && this.models && this.modelCallbacks) {
        this.disableModelEvents();
      }

      if (this.viewEvents && this.views && this.viewCallbacks) {
        this.disableViewEvents();
      }

      if (this.controllerEvents && this.controllers && this.controllerCallbacks) {
        this.disableControllerEvents();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1WQy5qcyIsIkNvbnN0YW50cy5qcyIsIkV2ZW50cy5qcyIsIlRlbXBsYXRlcy5qcyIsIlV0aWxzLmpzIiwiaXMuanMiLCJ0eXBlT2YuanMiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QuanMiLCJvYmplY3RRdWVyeS5qcyIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMuanMiLCJ2YWxpZGF0ZURhdGFTY2hlbWEuanMiLCJDaGFubmVscy5qcyIsIkNoYW5uZWwuanMiLCJCYXNlLmpzIiwiU2VydmljZS5qcyIsIk1vZGVsLmpzIiwiRW1pdHRlci5qcyIsImluZGV4LmpzIiwiTmF2aWdhdGUuanMiLCJWaWV3LmpzIiwiQ29udHJvbGxlci5qcyIsIlJvdXRlci5qcyJdLCJuYW1lcyI6WyJNVkMiLCJDb25zdGFudHMiLCJDT05TVCIsIkV2ZW50cyIsIkVWIiwiVGVtcGxhdGVzIiwiT2JqZWN0UXVlcnlTdHJpbmdGb3JtYXRJbnZhbGlkUm9vdCIsIk9iamVjdFF1ZXJ5U3RyaW5nRm9ybWF0SW52YWxpZCIsImRhdGEiLCJqb2luIiwiRGF0YVNjaGVtYU1pc21hdGNoIiwiRGF0YUZ1bmN0aW9uSW52YWxpZCIsIkRhdGFVbmRlZmluZWQiLCJTY2hlbWFVbmRlZmluZWQiLCJUTVBMIiwiVXRpbHMiLCJpc0FycmF5Iiwib2JqZWN0IiwiQXJyYXkiLCJpc09iamVjdCIsImlzRXF1YWxUeXBlIiwidmFsdWVBIiwidmFsdWVCIiwiaXNIVE1MRWxlbWVudCIsIkhUTUxFbGVtZW50IiwidHlwZU9mIiwiX29iamVjdCIsImFkZFByb3BlcnRpZXNUb09iamVjdCIsInRhcmdldE9iamVjdCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInByb3BlcnRpZXMiLCJwcm9wZXJ0eU5hbWUiLCJwcm9wZXJ0eVZhbHVlIiwiT2JqZWN0IiwiZW50cmllcyIsIm9iamVjdFF1ZXJ5Iiwic3RyaW5nIiwiY29udGV4dCIsInN0cmluZ0RhdGEiLCJwYXJzZU5vdGF0aW9uIiwic3BsaWNlIiwicmVkdWNlIiwiZnJhZ21lbnQiLCJmcmFnbWVudEluZGV4IiwiZnJhZ21lbnRzIiwicGFyc2VGcmFnbWVudCIsInByb3BlcnR5S2V5IiwibWF0Y2giLCJjb25jYXQiLCJjaGFyQXQiLCJzbGljZSIsInNwbGl0IiwiUmVnRXhwIiwidG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyIsInRvZ2dsZU1ldGhvZCIsImV2ZW50cyIsInRhcmdldE9iamVjdHMiLCJjYWxsYmFja3MiLCJldmVudFNldHRpbmdzIiwiZXZlbnRDYWxsYmFja05hbWUiLCJldmVudERhdGEiLCJldmVudFRhcmdldFNldHRpbmdzIiwiZXZlbnROYW1lIiwiZXZlbnRUYXJnZXRzIiwiZXZlbnRUYXJnZXROYW1lIiwiZXZlbnRUYXJnZXQiLCJldmVudE1ldGhvZE5hbWUiLCJOb2RlTGlzdCIsIkRvY3VtZW50IiwiZXZlbnRDYWxsYmFjayIsIl9ldmVudFRhcmdldCIsImJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMiLCJ1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyIsInZhbGlkYXRlRGF0YVNjaGVtYSIsInNjaGVtYSIsImFycmF5IiwiY29uc29sZSIsImxvZyIsIm5hbWUiLCJhcnJheUtleSIsImFycmF5VmFsdWUiLCJwdXNoIiwib2JqZWN0S2V5Iiwib2JqZWN0VmFsdWUiLCJjb25zdHJ1Y3RvciIsIl9ldmVudHMiLCJldmVudENhbGxiYWNrcyIsImV2ZW50Q2FsbGJhY2tHcm91cCIsIm9uIiwib2ZmIiwiZW1pdCIsImV2ZW50Q2FsbGJhY2tHcm91cE5hbWUiLCJhZGRpdGlvbmFsQXJndW1lbnRzIiwidmFsdWVzIiwiQ2hhbm5lbHMiLCJfY2hhbm5lbHMiLCJjaGFubmVscyIsImNoYW5uZWwiLCJjaGFubmVsTmFtZSIsIkNoYW5uZWwiLCJfcmVzcG9uc2VzIiwicmVzcG9uc2VzIiwicmVzcG9uc2UiLCJyZXNwb25zZU5hbWUiLCJyZXNwb25zZUNhbGxiYWNrIiwicmVxdWVzdCIsInJlcXVlc3REYXRhIiwia2V5cyIsIkJhc2UiLCJzZXR0aW5ncyIsImNvbmZpZ3VyYXRpb24iLCJfY29uZmlndXJhdGlvbiIsIl9zZXR0aW5ncyIsIl9lbWl0dGVycyIsImVtaXR0ZXJzIiwiU2VydmljZSIsIl9kZWZhdWx0cyIsImRlZmF1bHRzIiwiY29udGVudFR5cGUiLCJyZXNwb25zZVR5cGUiLCJfcmVzcG9uc2VUeXBlcyIsIl9yZXNwb25zZVR5cGUiLCJfeGhyIiwiZmluZCIsInJlc3BvbnNlVHlwZUl0ZW0iLCJfdHlwZSIsInR5cGUiLCJfdXJsIiwidXJsIiwiX2hlYWRlcnMiLCJoZWFkZXJzIiwiaGVhZGVyIiwic2V0UmVxdWVzdEhlYWRlciIsIl9kYXRhIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJfZW5hYmxlZCIsImVuYWJsZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInN0YXR1cyIsImFib3J0Iiwib3BlbiIsIm9ubG9hZCIsIm9uZXJyb3IiLCJzZW5kIiwidGhlbiIsImN1cnJlbnRUYXJnZXQiLCJlbmFibGUiLCJkaXNhYmxlIiwiTW9kZWwiLCJfbG9jYWxTdG9yYWdlIiwibG9jYWxTdG9yYWdlIiwiX2lzU2V0dGluZyIsImlzU2V0dGluZyIsInNldCIsIl9zY2hlbWEiLCJfaGlzdGlvZ3JhbSIsImhpc3Rpb2dyYW0iLCJhc3NpZ24iLCJfaGlzdG9yeSIsImhpc3RvcnkiLCJ1bnNoaWZ0IiwicGFyc2UiLCJfZGIiLCJkYiIsImdldEl0ZW0iLCJlbmRwb2ludCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzZXRJdGVtIiwiX2RhdGFFdmVudHMiLCJkYXRhRXZlbnRzIiwiX2RhdGFDYWxsYmFja3MiLCJkYXRhQ2FsbGJhY2tzIiwiX3NlcnZpY2VzIiwic2VydmljZXMiLCJfc2VydmljZUV2ZW50cyIsInNlcnZpY2VFdmVudHMiLCJfc2VydmljZUNhbGxiYWNrcyIsInNlcnZpY2VDYWxsYmFja3MiLCJlbmFibGVTZXJ2aWNlRXZlbnRzIiwiZGlzYWJsZVNlcnZpY2VFdmVudHMiLCJ1bmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMiLCJlbmFibGVEYXRhRXZlbnRzIiwiZGlzYWJsZURhdGFFdmVudHMiLCJnZXQiLCJwcm9wZXJ0eSIsIl9hcmd1bWVudHMiLCJmb3JFYWNoIiwiaW5kZXgiLCJrZXkiLCJ2YWx1ZSIsInNldERhdGFQcm9wZXJ0eSIsInNldERCIiwic2lsZW50IiwidW5zZXQiLCJ1bnNldERhdGFQcm9wZXJ0eSIsInVuc2V0REIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiY29uZmlndXJhYmxlIiwic2V0VmFsdWVFdmVudE5hbWUiLCJzZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlRXZlbnROYW1lIiwidW5zZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlIiwiRW1pdHRlciIsIl9uYW1lIiwiZW1pc3Npb24iLCJFbWl0dGVycyIsIk5hdmlnYXRlRW1pdHRlciIsImFkZFNldHRpbmdzIiwib2xkVVJMIiwiU3RyaW5nIiwibmV3VVJMIiwiY3VycmVudFJvdXRlIiwiY3VycmVudENvbnRyb2xsZXIiLCJWaWV3IiwiX2VsZW1lbnROYW1lIiwiX2VsZW1lbnQiLCJ0YWdOYW1lIiwiZWxlbWVudE5hbWUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJlbGVtZW50IiwicXVlcnlTZWxlY3RvciIsImVsZW1lbnRPYnNlcnZlciIsIm9ic2VydmUiLCJzdWJ0cmVlIiwiY2hpbGRMaXN0IiwiX2F0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJfdWkiLCJ1aSIsInVpS2V5IiwidWlWYWx1ZSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJfdWlFdmVudHMiLCJ1aUV2ZW50cyIsIl91aUNhbGxiYWNrcyIsInVpQ2FsbGJhY2tzIiwiX29ic2VydmVyQ2FsbGJhY2tzIiwib2JzZXJ2ZXJDYWxsYmFja3MiLCJfZWxlbWVudE9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsImVsZW1lbnRPYnNlcnZlIiwiYmluZCIsIl9pbnNlcnQiLCJpbnNlcnQiLCJfdGVtcGxhdGVzIiwidGVtcGxhdGVzIiwibXV0YXRpb25SZWNvcmRMaXN0Iiwib2JzZXJ2ZXIiLCJtdXRhdGlvblJlY29yZEluZGV4IiwibXV0YXRpb25SZWNvcmQiLCJtdXRhdGlvblJlY29yZENhdGVnb3JpZXMiLCJtdXRhdGlvblJlY29yZENhdGVnb3J5IiwicmVzZXRVSSIsImF1dG9JbnNlcnQiLCJpbnNlcnRBZGphY2VudEVsZW1lbnQiLCJtZXRob2QiLCJhdXRvUmVtb3ZlIiwicGFyZW50RWxlbWVudCIsInJlbW92ZUNoaWxkIiwiZW5hYmxlRWxlbWVudCIsImRpc2FibGVFbGVtZW50IiwiZGlzYWJsZVVJIiwiZW5hYmxlVUkiLCJlbmFibGVVSUV2ZW50cyIsImRpc2FibGVVSUV2ZW50cyIsImVuYWJsZUVtaXR0ZXJzIiwiZGlzYWJsZUVtaXR0ZXJzIiwidGhpc3MiLCJDb250cm9sbGVyIiwiX2VtaXR0ZXJDYWxsYmFja3MiLCJlbWl0dGVyQ2FsbGJhY2tzIiwiX21vZGVsQ2FsbGJhY2tzIiwibW9kZWxDYWxsYmFja3MiLCJfdmlld0NhbGxiYWNrcyIsInZpZXdDYWxsYmFja3MiLCJfY29udHJvbGxlckNhbGxiYWNrcyIsImNvbnRyb2xsZXJDYWxsYmFja3MiLCJfbW9kZWxzIiwibW9kZWxzIiwiX3ZpZXdzIiwidmlld3MiLCJfY29udHJvbGxlcnMiLCJjb250cm9sbGVycyIsIl9yb3V0ZXJzIiwicm91dGVycyIsIl9yb3V0ZXJFdmVudHMiLCJyb3V0ZXJFdmVudHMiLCJfcm91dGVyQ2FsbGJhY2tzIiwicm91dGVyQ2FsbGJhY2tzIiwiX2VtaXR0ZXJFdmVudHMiLCJlbWl0dGVyRXZlbnRzIiwiX21vZGVsRXZlbnRzIiwibW9kZWxFdmVudHMiLCJfdmlld0V2ZW50cyIsInZpZXdFdmVudHMiLCJfY29udHJvbGxlckV2ZW50cyIsImNvbnRyb2xsZXJFdmVudHMiLCJlbmFibGVNb2RlbEV2ZW50cyIsImRpc2FibGVNb2RlbEV2ZW50cyIsImVuYWJsZVZpZXdFdmVudHMiLCJkaXNhYmxlVmlld0V2ZW50cyIsImVuYWJsZUNvbnRyb2xsZXJFdmVudHMiLCJkaXNhYmxlQ29udHJvbGxlckV2ZW50cyIsImVuYWJsZUVtaXR0ZXJFdmVudHMiLCJkaXNhYmxlRW1pdHRlckV2ZW50cyIsImVuYWJsZVJvdXRlckV2ZW50cyIsImRpc2FibGVSb3V0ZXJFdmVudHMiLCJSb3V0ZXIiLCJyb3V0ZSIsIl9oYXNoIiwid2luZG93IiwibG9jYXRpb24iLCJoYXNoIiwicG9wIiwicGF0aG5hbWUiLCJfcm91dGVzIiwicm91dGVzIiwiX2NvbnRyb2xsZXIiLCJjb250cm9sbGVyIiwiX3ByZXZpb3VzVVJMIiwicHJldmlvdXNVUkwiLCJfY3VycmVudFVSTCIsImN1cnJlbnRVUkwiLCJmcmFnbWVudElEUmVnRXhwIiwiZnJhZ21lbnROYW1lUmVnRXhwIiwiZW5hYmxlRXZlbnRzIiwiZW5hYmxlUm91dGVzIiwicm91dGVDaGFuZ2UiLCJkaXNhYmxlRXZlbnRzIiwiZGlzYWJsZVJvdXRlcyIsInJvdXRlSW5kZXgiLCJvcmlnaW5hbFJvdXRlcyIsInJvdXRlUGF0aCIsInJvdXRlQ2FsbGJhY2siLCJuYXZpZ2F0ZUVtaXR0ZXIiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImZpbHRlciIsInJvdXRlQ29udHJvbGxlckRhdGEiLCJyb3V0ZXJQYXRoIiwicm91dGVyQ29udHJvbGxlciIsInVuZGVmaW5lZCIsInJlcGxhY2UiLCJ0ZXN0IiwiaHJlZiIsInJvdXRlQ29udHJvbGxlck5hbWUiLCJyb3V0ZUNvbnRyb2xsZXIiLCJuYXZpZ2F0ZUVtaXR0ZXJEYXRhIiwiZXJyb3IiLCJuYXZpZ2F0ZSIsInBhdGgiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLEVBQWpCO0FDQUFBLEdBQUcsQ0FBQ0MsU0FBSixHQUFnQixFQUFoQjtBQUNBRCxHQUFHLENBQUNFLEtBQUosR0FBWUYsR0FBRyxDQUFDQyxTQUFoQjtBQ0RBRCxHQUFHLENBQUNDLFNBQUosQ0FBY0Us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QUFOLEVBQWE7QUFDYixZQUFNLHdCQUFOO0FBQ0Q7QUFDRjs7QUFDREMsRUFBQUEsUUFBUSxDQUFDQyxJQUFELEVBQU87QUFDYnhDLElBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsSUFBaEIsR0FBdUJzQyxJQUF2QjtBQUNEOztBQS9KaUMsQ0FBcEMiLCJmaWxlIjoiYnJvd3Nlci9tdmMtZnJhbWV3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE1WQyA9IE1WQyB8fCB7fVxyXG4iLCJNVkMuQ29uc3RhbnRzID0ge31cbk1WQy5DT05TVCA9IE1WQy5Db25zdGFudHNcbiIsIk1WQy5FdmVudHMgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfZXZlbnRzKCkge1xyXG4gICAgdGhpcy5ldmVudHMgPSAodGhpcy5ldmVudHMpXHJcbiAgICAgID8gdGhpcy5ldmVudHNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzXHJcbiAgfVxyXG4gIGV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSkgeyByZXR1cm4gdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gfHwge30gfVxyXG4gIGV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIHJldHVybiAoZXZlbnRDYWxsYmFjay5uYW1lLmxlbmd0aClcclxuICAgICAgPyBldmVudENhbGxiYWNrLm5hbWVcclxuICAgICAgOiAnYW5vbnltb3VzRnVuY3Rpb24nXHJcbiAgfVxyXG4gIGV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpIHtcclxuICAgIHJldHVybiBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gfHwgW11cclxuICB9XHJcbiAgb24oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKSB7XHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja3MgPSB0aGlzLmV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSlcclxuICAgIGxldCBldmVudENhbGxiYWNrTmFtZSA9IHRoaXMuZXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgIGxldCBldmVudENhbGxiYWNrR3JvdXAgPSB0aGlzLmV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpXHJcbiAgICBldmVudENhbGxiYWNrR3JvdXAucHVzaChldmVudENhbGxiYWNrKVxyXG4gICAgZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdID0gZXZlbnRDYWxsYmFja0dyb3VwXHJcbiAgICB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSA9IGV2ZW50Q2FsbGJhY2tzXHJcbiAgfVxyXG4gIG9mZigpIHtcclxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrTmFtZSA9IHRoaXMuZXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1bZXZlbnRDYWxsYmFja05hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICB9XHJcbiAgZW1pdChldmVudE5hbWUsIGV2ZW50RGF0YSkge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5ldmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBmb3IobGV0IFtldmVudENhbGxiYWNrR3JvdXBOYW1lLCBldmVudENhbGxiYWNrR3JvdXBdIG9mIE9iamVjdC5lbnRyaWVzKGV2ZW50Q2FsbGJhY2tzKSkge1xyXG4gICAgICBmb3IobGV0IGV2ZW50Q2FsbGJhY2sgb2YgZXZlbnRDYWxsYmFja0dyb3VwKSB7XHJcbiAgICAgICAgbGV0IGFkZGl0aW9uYWxBcmd1bWVudHMgPSBPYmplY3QudmFsdWVzKGFyZ3VtZW50cykuc3BsaWNlKDIpXHJcbiAgICAgICAgZXZlbnRDYWxsYmFjayhldmVudERhdGEsIC4uLmFkZGl0aW9uYWxBcmd1bWVudHMpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiTVZDLlRlbXBsYXRlcyA9IHtcclxuICBPYmplY3RRdWVyeVN0cmluZ0Zvcm1hdEludmFsaWRSb290OiBmdW5jdGlvbiBPYmplY3RRdWVyeVN0cmluZ0Zvcm1hdEludmFsaWQoZGF0YSkge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgJ09iamVjdCBRdWVyeSBcInN0cmluZ1wiIHByb3BlcnR5IG11c3QgYmUgZm9ybWF0dGVkIHRvIGZpcnN0IGluY2x1ZGUgXCJbQF1cIi4nXHJcbiAgICBdLmpvaW4oJ1xcbicpXHJcbiAgfSxcclxuICBEYXRhU2NoZW1hTWlzbWF0Y2g6IGZ1bmN0aW9uIERhdGFTY2hlbWFNaXNtYXRjaChkYXRhKSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBgRGF0YSBhbmQgU2NoZW1hIHByb3BlcnRpZXMgZG8gbm90IG1hdGNoLmBcclxuICAgIF0uam9pbignXFxuJylcclxuICB9LFxyXG4gIERhdGFGdW5jdGlvbkludmFsaWQ6IGZ1bmN0aW9uIERhdGFGdW5jdGlvbkludmFsaWQoZGF0YSkge1xyXG4gICAgW1xyXG4gICAgICBgTW9kZWwgRGF0YSBwcm9wZXJ0eSB0eXBlIFwiRnVuY3Rpb25cIiBpcyBub3QgdmFsaWQuYFxyXG4gICAgXS5qb2luKCdcXG4nKVxyXG4gIH0sXHJcbiAgRGF0YVVuZGVmaW5lZDogZnVuY3Rpb24gRGF0YVVuZGVmaW5lZChkYXRhKSB7XHJcbiAgICBbXHJcbiAgICAgIGBNb2RlbCBEYXRhIHByb3BlcnR5IHVuZGVmaW5lZC5gXHJcbiAgICBdLmpvaW4oJ1xcbicpXHJcbiAgfSxcclxuICBTY2hlbWFVbmRlZmluZWQ6IGZ1bmN0aW9uIFNjaGVtYVVuZGVmaW5lZChkYXRhKSB7XHJcbiAgICBbXHJcbiAgICAgIGBNb2RlbCBcIlNjaGVtYVwiIHVuZGVmaW5lZC5gXHJcbiAgICBdLmpvaW4oJ1xcbicpXHJcbiAgfSxcclxufVxyXG5NVkMuVE1QTCA9IE1WQy5UZW1wbGF0ZXNcclxuIiwiTVZDLlV0aWxzID0ge31cclxuIiwiTVZDLlV0aWxzLmlzQXJyYXkgPSBmdW5jdGlvbiBpc0FycmF5KG9iamVjdCkgeyByZXR1cm4gQXJyYXkuaXNBcnJheShvYmplY3QpIH1cclxuTVZDLlV0aWxzLmlzT2JqZWN0ID0gZnVuY3Rpb24gaXNPYmplY3Qob2JqZWN0KSB7XHJcbiAgcmV0dXJuICghQXJyYXkuaXNBcnJheShvYmplY3QpKVxyXG4gICAgPyB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0J1xyXG4gICAgOiBmYWxzZVxyXG59XHJcbk1WQy5VdGlscy5pc0VxdWFsVHlwZSA9IGZ1bmN0aW9uIGlzRXF1YWxUeXBlKHZhbHVlQSwgdmFsdWVCKSB7IHJldHVybiB2YWx1ZUEgPT09IHZhbHVlQiB9XHJcbk1WQy5VdGlscy5pc0hUTUxFbGVtZW50ID0gZnVuY3Rpb24gaXNIVE1MRWxlbWVudChvYmplY3QpIHtcclxuICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcclxufVxyXG4iLCJNVkMuVXRpbHMudHlwZU9mID0gIGZ1bmN0aW9uIHR5cGVPZihkYXRhKSB7XHJcbiAgc3dpdGNoKHR5cGVvZiBkYXRhKSB7XHJcbiAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICBsZXQgX29iamVjdFxyXG4gICAgICBpZihNVkMuVXRpbHMuaXNBcnJheShkYXRhKSkge1xyXG4gICAgICAgIC8vIEFycmF5XHJcbiAgICAgICAgcmV0dXJuICdhcnJheSdcclxuICAgICAgfSBlbHNlIGlmKFxyXG4gICAgICAgIE1WQy5VdGlscy5pc09iamVjdChkYXRhKVxyXG4gICAgICApIHtcclxuICAgICAgICAvLyBPYmplY3RcclxuICAgICAgICByZXR1cm4gJ29iamVjdCdcclxuICAgICAgfSBlbHNlIGlmKFxyXG4gICAgICAgIGRhdGEgPT09IG51bGxcclxuICAgICAgKSB7XHJcbiAgICAgICAgLy8gTnVsbFxyXG4gICAgICAgIHJldHVybiAnbnVsbCdcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gX29iamVjdFxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnc3RyaW5nJzpcclxuICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICBjYXNlICdib29sZWFuJzpcclxuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XHJcbiAgICBjYXNlICdmdW5jdGlvbic6XHJcbiAgICAgIHJldHVybiB0eXBlb2YgZGF0YVxyXG4gICAgICBicmVha1xyXG4gIH1cclxufVxyXG4iLCJNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0ID0gZnVuY3Rpb24gYWRkUHJvcGVydGllc1RvT2JqZWN0KCkge1xyXG4gIGxldCB0YXJnZXRPYmplY3RcclxuICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgY2FzZSAyOlxyXG4gICAgICBsZXQgcHJvcGVydGllcyA9IGFyZ3VtZW50c1swXVxyXG4gICAgICB0YXJnZXRPYmplY3QgPSBhcmd1bWVudHNbMV1cclxuICAgICAgZm9yKGxldCBbcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwcm9wZXJ0aWVzKSkge1xyXG4gICAgICAgIHRhcmdldE9iamVjdFtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZVxyXG4gICAgICB9XHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlIDM6XHJcbiAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgbGV0IHByb3BlcnR5VmFsdWUgPSBhcmd1bWVudHNbMV1cclxuICAgICAgdGFyZ2V0T2JqZWN0ID0gYXJndW1lbnRzWzJdXHJcbiAgICAgIHRhcmdldE9iamVjdFtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZVxyXG4gICAgICBicmVha1xyXG4gIH1cclxuICByZXR1cm4gdGFyZ2V0T2JqZWN0XHJcbn1cclxuIiwiTVZDLlV0aWxzLm9iamVjdFF1ZXJ5ID0gZnVuY3Rpb24gb2JqZWN0UXVlcnkoXHJcbiAgc3RyaW5nLFxyXG4gIGNvbnRleHRcclxuKSB7XHJcbiAgbGV0IHN0cmluZ0RhdGEgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VOb3RhdGlvbihzdHJpbmcpXHJcbiAgaWYoc3RyaW5nRGF0YVswXSA9PT0gJ0AnKSBzdHJpbmdEYXRhLnNwbGljZSgwLCAxKVxyXG4gIGlmKCFzdHJpbmdEYXRhLmxlbmd0aCkgcmV0dXJuIGNvbnRleHRcclxuICBjb250ZXh0ID0gKE1WQy5VdGlscy5pc09iamVjdChjb250ZXh0KSlcclxuICAgID8gT2JqZWN0LmVudHJpZXMoY29udGV4dClcclxuICAgIDogY29udGV4dFxyXG4gIHJldHVybiBzdHJpbmdEYXRhLnJlZHVjZSgob2JqZWN0LCBmcmFnbWVudCwgZnJhZ21lbnRJbmRleCwgZnJhZ21lbnRzKSA9PiB7XHJcbiAgICBsZXQgcHJvcGVydGllcyA9IFtdXHJcbiAgICBmcmFnbWVudCA9IE1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZUZyYWdtZW50KGZyYWdtZW50KVxyXG4gICAgZm9yKGxldCBbcHJvcGVydHlLZXksIHByb3BlcnR5VmFsdWVdIG9mIG9iamVjdCkge1xyXG4gICAgICBpZihwcm9wZXJ0eUtleS5tYXRjaChmcmFnbWVudCkpIHtcclxuICAgICAgICBpZihmcmFnbWVudEluZGV4ID09PSBmcmFnbWVudHMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMuY29uY2F0KFtbcHJvcGVydHlLZXksIHByb3BlcnR5VmFsdWVdXSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMuY29uY2F0KE9iamVjdC5lbnRyaWVzKHByb3BlcnR5VmFsdWUpKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgb2JqZWN0ID0gcHJvcGVydGllc1xyXG4gICAgcmV0dXJuIG9iamVjdFxyXG4gIH0sIGNvbnRleHQpXHJcbn1cclxuTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlTm90YXRpb24gPSBmdW5jdGlvbiBwYXJzZU5vdGF0aW9uKHN0cmluZykge1xyXG4gIGlmKFxyXG4gICAgc3RyaW5nLmNoYXJBdCgwKSA9PT0gJ1snICYmXHJcbiAgICBzdHJpbmcuY2hhckF0KHN0cmluZy5sZW5ndGggLSAxKSA9PSAnXSdcclxuICApIHtcclxuICAgIHN0cmluZyA9IHN0cmluZ1xyXG4gICAgICAuc2xpY2UoMSwgLTEpXHJcbiAgICAgIC5zcGxpdCgnXVsnKVxyXG4gIH0gZWxzZSB7XHJcbiAgICBzdHJpbmcgPSBzdHJpbmdcclxuICAgICAgLnNwbGl0KCcuJylcclxuICB9XHJcbiAgcmV0dXJuIHN0cmluZ1xyXG59XHJcbk1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZUZyYWdtZW50ID0gZnVuY3Rpb24gcGFyc2VGcmFnbWVudChmcmFnbWVudCkge1xyXG4gIGlmKFxyXG4gICAgZnJhZ21lbnQuY2hhckF0KDApID09PSAnLycgJiZcclxuICAgIGZyYWdtZW50LmNoYXJBdChmcmFnbWVudC5sZW5ndGggLSAxKSA9PSAnLydcclxuICApIHtcclxuICAgIGZyYWdtZW50ID0gZnJhZ21lbnQuc2xpY2UoMSwgLTEpXHJcbiAgICBmcmFnbWVudCA9IG5ldyBSZWdFeHAoJ14nLmNvbmNhdChmcmFnbWVudCwgJyQnKSlcclxuICB9XHJcbiAgcmV0dXJuIGZyYWdtZW50XHJcbn1cclxuIiwiTVZDLlV0aWxzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMgPSBmdW5jdGlvbiB0b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKFxyXG4gIHRvZ2dsZU1ldGhvZCxcclxuICBldmVudHMsXHJcbiAgdGFyZ2V0T2JqZWN0cyxcclxuICBjYWxsYmFja3NcclxuKSB7XHJcbiAgZm9yKGxldCBbZXZlbnRTZXR0aW5ncywgZXZlbnRDYWxsYmFja05hbWVdIG9mIE9iamVjdC5lbnRyaWVzKGV2ZW50cykpIHtcclxuICAgIGxldCBldmVudERhdGEgPSBldmVudFNldHRpbmdzLnNwbGl0KCcgJylcclxuICAgIGxldCBldmVudFRhcmdldFNldHRpbmdzID0gZXZlbnREYXRhWzBdXHJcbiAgICBsZXQgZXZlbnROYW1lID0gZXZlbnREYXRhWzFdXHJcbiAgICBsZXQgZXZlbnRUYXJnZXRzID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5KFxyXG4gICAgICBldmVudFRhcmdldFNldHRpbmdzLFxyXG4gICAgICB0YXJnZXRPYmplY3RzXHJcbiAgICApXHJcbiAgICBldmVudFRhcmdldHMgPSAoIU1WQy5VdGlscy5pc0FycmF5KGV2ZW50VGFyZ2V0cykpXHJcbiAgICAgID8gW1snQCcsIGV2ZW50VGFyZ2V0c11dXHJcbiAgICAgIDogZXZlbnRUYXJnZXRzXHJcbiAgICBmb3IobGV0IFtldmVudFRhcmdldE5hbWUsIGV2ZW50VGFyZ2V0XSBvZiBldmVudFRhcmdldHMpIHtcclxuICAgICAgbGV0IGV2ZW50TWV0aG9kTmFtZSA9ICh0b2dnbGVNZXRob2QgPT09ICdvbicpXHJcbiAgICAgID8gKFxyXG4gICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QgfHxcclxuICAgICAgICAoXHJcbiAgICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XHJcbiAgICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIERvY3VtZW50XHJcbiAgICAgICAgKVxyXG4gICAgICApID8gJ2FkZEV2ZW50TGlzdGVuZXInXHJcbiAgICAgICAgOiAnb24nXHJcbiAgICAgIDogKFxyXG4gICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QgfHxcclxuICAgICAgICAoXHJcbiAgICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XHJcbiAgICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIERvY3VtZW50XHJcbiAgICAgICAgKVxyXG4gICAgICApID8gJ3JlbW92ZUV2ZW50TGlzdGVuZXInXHJcbiAgICAgICAgOiAnb2ZmJ1xyXG4gICAgICBsZXQgZXZlbnRDYWxsYmFjayA9IE1WQy5VdGlscy5vYmplY3RRdWVyeShcclxuICAgICAgICBldmVudENhbGxiYWNrTmFtZSxcclxuICAgICAgICBjYWxsYmFja3NcclxuICAgICAgKVswXVsxXVxyXG4gICAgICBpZihldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XHJcbiAgICAgICAgZm9yKGxldCBfZXZlbnRUYXJnZXQgb2YgZXZlbnRUYXJnZXQpIHtcclxuICAgICAgICAgIF9ldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZihldmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KXtcclxuICAgICAgICBldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5NVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIGJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMoKSB7XHJcbiAgdGhpcy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKCdvbicsIC4uLmFyZ3VtZW50cylcclxufVxyXG5NVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMgPSBmdW5jdGlvbiB1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cygpIHtcclxuICB0aGlzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoJ29mZicsIC4uLmFyZ3VtZW50cylcclxufVxyXG4iLCJNVkMuVXRpbHMudmFsaWRhdGVEYXRhU2NoZW1hID0gZnVuY3Rpb24gdmFsaWRhdGVEYXRhU2NoZW1hKGRhdGEsIHNjaGVtYSkge1xyXG4gIGlmKHNjaGVtYSkge1xyXG4gICAgc3dpdGNoKE1WQy5VdGlscy50eXBlT2YoZGF0YSkpIHtcclxuICAgICAgY2FzZSAnYXJyYXknOlxyXG4gICAgICAgIGxldCBhcnJheSA9IFtdXHJcbiAgICAgICAgc2NoZW1hID0gKE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgID8gc2NoZW1hKClcclxuICAgICAgICAgIDogc2NoZW1hXHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBNVkMuVXRpbHMuaXNFcXVhbFR5cGUoXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSxcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihhcnJheSlcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHNjaGVtYS5uYW1lKVxyXG4gICAgICAgICAgZm9yKGxldCBbYXJyYXlLZXksIGFycmF5VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2goXHJcbiAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZURhdGFTY2hlbWEoYXJyYXlWYWx1ZSlcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyYXlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICAgIGxldCBvYmplY3QgPSB7fVxyXG4gICAgICAgIHNjaGVtYSA9IChNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSkgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICA/IHNjaGVtYSgpXHJcbiAgICAgICAgICA6IHNjaGVtYVxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgTVZDLlV0aWxzLmlzRXF1YWxUeXBlKFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSksXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yob2JqZWN0KVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coc2NoZW1hLm5hbWUpXHJcbiAgICAgICAgICBmb3IobGV0IFtvYmplY3RLZXksIG9iamVjdFZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xyXG4gICAgICAgICAgICBvYmplY3Rbb2JqZWN0S2V5XSA9IHRoaXMudmFsaWRhdGVEYXRhU2NoZW1hKG9iamVjdFZhbHVlLCBzY2hlbWFbb2JqZWN0S2V5XSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgICAgIHNjaGVtYSA9IChNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSkgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICA/IHNjaGVtYSgpXHJcbiAgICAgICAgICA6IHNjaGVtYVxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgTVZDLlV0aWxzLmlzRXF1YWxUeXBlKFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSksXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2YoZGF0YSlcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHNjaGVtYS5uYW1lKVxyXG4gICAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhyb3cgTVZDLlRNUExcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnbnVsbCc6XHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBNVkMuVXRpbHMuaXNFcXVhbFR5cGUoXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSxcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihkYXRhKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgICAgICB0aHJvdyBNVkMuVE1QTFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgICB0aHJvdyBNVkMuVE1QTFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IE1WQy5UTVBMXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5DaGFubmVscyA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9jaGFubmVscygpIHtcclxuICAgIHRoaXMuY2hhbm5lbHMgPSAodGhpcy5jaGFubmVscylcclxuICAgICAgPyB0aGlzLmNoYW5uZWxzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmNoYW5uZWxzXHJcbiAgfVxyXG4gIGNoYW5uZWwoY2hhbm5lbE5hbWUpIHtcclxuICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXSA9ICh0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0pXHJcbiAgICAgID8gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgIDogbmV3IE1WQy5DaGFubmVscy5DaGFubmVsKClcclxuICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbiAgb2ZmKGNoYW5uZWxOYW1lKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5DaGFubmVscy5DaGFubmVsID0gY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX3Jlc3BvbnNlcygpIHtcclxuICAgIHRoaXMucmVzcG9uc2VzID0gKHRoaXMucmVzcG9uc2VzKVxyXG4gICAgICA/IHRoaXMucmVzcG9uc2VzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLnJlc3BvbnNlc1xyXG4gIH1cclxuICByZXNwb25zZShyZXNwb25zZU5hbWUsIHJlc3BvbnNlQ2FsbGJhY2spIHtcclxuICAgIGlmKHJlc3BvbnNlQ2FsbGJhY2spIHtcclxuICAgICAgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0gPSByZXNwb25zZUNhbGxiYWNrXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlXVxyXG4gICAgfVxyXG4gIH1cclxuICByZXF1ZXN0KHJlc3BvbnNlTmFtZSwgcmVxdWVzdERhdGEpIHtcclxuICAgIGlmKHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXShyZXF1ZXN0RGF0YSlcclxuICAgIH1cclxuICB9XHJcbiAgb2ZmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yKGxldCBbcmVzcG9uc2VOYW1lXSBvZiBPYmplY3Qua2V5cyh0aGlzLl9yZXNwb25zZXMpKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiTVZDLkJhc2UgPSBjbGFzcyBleHRlbmRzIE1WQy5FdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzLCBjb25maWd1cmF0aW9uKSB7XHJcbiAgICBzdXBlcigpXHJcbiAgICBpZihjb25maWd1cmF0aW9uKSB0aGlzLl9jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvblxyXG4gICAgaWYoc2V0dGluZ3MpIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcclxuICB9XHJcbiAgZ2V0IF9jb25maWd1cmF0aW9uKCkge1xyXG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gKHRoaXMuY29uZmlndXJhdGlvbilcclxuICAgICAgPyB0aGlzLmNvbmZpZ3VyYXRpb25cclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblxyXG4gIH1cclxuICBzZXQgX2NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikgeyB0aGlzLmNvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uIH1cclxuICBnZXQgX3NldHRpbmdzKCkge1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9ICh0aGlzLnNldHRpbmdzKVxyXG4gICAgICA/IHRoaXMuc2V0dGluZ3NcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3NcclxuICB9XHJcbiAgc2V0IF9zZXR0aW5ncyhzZXR0aW5ncykge1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXHJcbiAgICAgIHNldHRpbmdzLCB0aGlzLl9zZXR0aW5nc1xyXG4gICAgKVxyXG4gIH1cclxuICBnZXQgX2VtaXR0ZXJzKCkge1xyXG4gICAgdGhpcy5lbWl0dGVycyA9ICh0aGlzLmVtaXR0ZXJzKVxyXG4gICAgICA/IHRoaXMuZW1pdHRlcnNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlcnNcclxuICB9XHJcbiAgc2V0IF9lbWl0dGVycyhlbWl0dGVycykge1xyXG4gICAgdGhpcy5lbWl0dGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXHJcbiAgICAgIGVtaXR0ZXJzLCB0aGlzLl9lbWl0dGVyc1xyXG4gICAgKVxyXG4gIH1cclxufVxyXG4iLCJNVkMuU2VydmljZSA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IF9kZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuZGVmYXVsdHMgfHwge1xuICAgIGNvbnRlbnRUeXBlOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30sXG4gICAgcmVzcG9uc2VUeXBlOiAnanNvbicsXG4gIH0gfVxuICBnZXQgX3Jlc3BvbnNlVHlwZXMoKSB7IHJldHVybiBbJycsICdhcnJheWJ1ZmZlcicsICdibG9iJywgJ2RvY3VtZW50JywgJ2pzb24nLCAndGV4dCddIH1cbiAgZ2V0IF9yZXNwb25zZVR5cGUoKSB7IHJldHVybiB0aGlzLnJlc3BvbnNlVHlwZSB9XG4gIHNldCBfcmVzcG9uc2VUeXBlKHJlc3BvbnNlVHlwZSkge1xuICAgIHRoaXMuX3hoci5yZXNwb25zZVR5cGUgPSB0aGlzLl9yZXNwb25zZVR5cGVzLmZpbmQoXG4gICAgICAocmVzcG9uc2VUeXBlSXRlbSkgPT4gcmVzcG9uc2VUeXBlSXRlbSA9PT0gcmVzcG9uc2VUeXBlXG4gICAgKSB8fCB0aGlzLl9kZWZhdWx0cy5yZXNwb25zZVR5cGVcbiAgfVxuICBnZXQgX3R5cGUoKSB7IHJldHVybiB0aGlzLnR5cGUgfVxuICBzZXQgX3R5cGUodHlwZSkgeyB0aGlzLnR5cGUgPSB0eXBlIH1cbiAgZ2V0IF91cmwoKSB7IHJldHVybiB0aGlzLnVybCB9XG4gIHNldCBfdXJsKHVybCkgeyB0aGlzLnVybCA9IHVybCB9XG4gIGdldCBfaGVhZGVycygpIHsgcmV0dXJuIHRoaXMuaGVhZGVycyB8fCBbXSB9XG4gIHNldCBfaGVhZGVycyhoZWFkZXJzKSB7XG4gICAgdGhpcy5faGVhZGVycy5sZW5ndGggPSAwXG4gICAgZm9yKGxldCBoZWFkZXIgb2YgaGVhZGVycykge1xuICAgICAgdGhpcy5feGhyLnNldFJlcXVlc3RIZWFkZXIoe2hlYWRlcn1bMF0sIHtoZWFkZXJ9WzFdKVxuICAgICAgdGhpcy5faGVhZGVycy5wdXNoKGhlYWRlcilcbiAgICB9XG4gIH1cbiAgZ2V0IF9kYXRhKCkgeyByZXR1cm4gdGhpcy5kYXRhIH1cbiAgc2V0IF9kYXRhKGRhdGEpIHsgdGhpcy5kYXRhID0gZGF0YSB9XG4gIGdldCBfeGhyKCkge1xuICAgIHRoaXMueGhyID0gKHRoaXMueGhyKVxuICAgICAgPyB0aGlzLnhoclxuICAgICAgOiBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHJldHVybiB0aGlzLnhoclxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICByZXF1ZXN0KGRhdGEpIHtcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLmRhdGEgfHwgbnVsbFxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZih0aGlzLl94aHIuc3RhdHVzID09PSAyMDApIHRoaXMuX3hoci5hYm9ydCgpXG4gICAgICB0aGlzLl94aHIub3Blbih0aGlzLnR5cGUsIHRoaXMudXJsKVxuICAgICAgdGhpcy5faGVhZGVycyA9IHRoaXMuc2V0dGluZ3MuaGVhZGVycyB8fCBbdGhpcy5fZGVmYXVsdHMuY29udGVudFR5cGVdXG4gICAgICB0aGlzLl94aHIub25sb2FkID0gcmVzb2x2ZVxuICAgICAgdGhpcy5feGhyLm9uZXJyb3IgPSByZWplY3RcbiAgICAgIHRoaXMuX3hoci5zZW5kKGRhdGEpXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgneGhyOnJlc29sdmUnLCB7XG4gICAgICAgIG5hbWU6ICd4aHI6cmVzb2x2ZScsXG4gICAgICAgIGRhdGE6IHJlc3BvbnNlLmN1cnJlbnRUYXJnZXQsXG4gICAgICB9KVxuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgIXRoaXMuZW5hYmxlZCAmJlxuICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgaWYoc2V0dGluZ3MudHlwZSkgdGhpcy5fdHlwZSA9IHNldHRpbmdzLnR5cGVcbiAgICAgIGlmKHNldHRpbmdzLnVybCkgdGhpcy5fdXJsID0gc2V0dGluZ3MudXJsXG4gICAgICBpZihzZXR0aW5ncy5kYXRhKSB0aGlzLl9kYXRhID0gc2V0dGluZ3MuZGF0YSB8fCBudWxsXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnJlc3BvbnNlVHlwZSkgdGhpcy5fcmVzcG9uc2VUeXBlID0gdGhpcy5fc2V0dGluZ3MucmVzcG9uc2VUeXBlXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHRoaXMuZW5hYmxlZCAmJlxuICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgZGVsZXRlIHRoaXMuX3R5cGVcbiAgICAgIGRlbGV0ZSB0aGlzLl91cmxcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhXG4gICAgICBkZWxldGUgdGhpcy5faGVhZGVyc1xuICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlVHlwZVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICB9XG59XG4iLCJNVkMuTW9kZWwgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfbG9jYWxTdG9yYWdlKCkgeyByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UgfVxuICBzZXQgX2xvY2FsU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHsgdGhpcy5sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UgfVxuICBnZXQgX2lzU2V0dGluZygpIHsgcmV0dXJuIHRoaXMuaXNTZXR0aW5nIH1cbiAgc2V0IF9pc1NldHRpbmcoaXNTZXR0aW5nKSB7IHRoaXMuaXNTZXR0aW5nID0gaXNTZXR0aW5nIH1cbiAgZ2V0IF9kZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuX2RlZmF1bHRzIH1cbiAgc2V0IF9kZWZhdWx0cyhkZWZhdWx0cykge1xuICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgIHRoaXMuc2V0KHRoaXMuZGVmYXVsdHMpXG4gIH1cbiAgZ2V0IF9zY2hlbWEoKSB7IHJldHVybiB0aGlzLl9zY2hlbWEgfVxuICBzZXQgX3NjaGVtYShzY2hlbWEpIHsgdGhpcy5zY2hlbWEgPSBzY2hlbWEgfVxuICBnZXQgX2hpc3Rpb2dyYW0oKSB7IHJldHVybiB0aGlzLmhpc3Rpb2dyYW0gfHwge1xuICAgIGxlbmd0aDogMVxuICB9IH1cbiAgc2V0IF9oaXN0aW9ncmFtKGhpc3Rpb2dyYW0pIHtcbiAgICB0aGlzLmhpc3Rpb2dyYW0gPSBPYmplY3QuYXNzaWduKFxuICAgICAgdGhpcy5faGlzdGlvZ3JhbSxcbiAgICAgIGhpc3Rpb2dyYW1cbiAgICApXG4gIH1cbiAgZ2V0IF9oaXN0b3J5KCkge1xuICAgIHRoaXMuaGlzdG9yeSA9ICh0aGlzLmhpc3RvcnkpXG4gICAgICA/IHRoaXMuaGlzdG9yeVxuICAgICAgOiBbXVxuICAgIHJldHVybiB0aGlzLmhpc3RvcnlcbiAgfVxuICBzZXQgX2hpc3RvcnkoZGF0YSkge1xuICAgIGlmKFxuICAgICAgT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoXG4gICAgKSB7XG4gICAgICBpZih0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVuc2hpZnQodGhpcy5wYXJzZShkYXRhKSlcbiAgICAgICAgdGhpcy5faGlzdG9yeS5zcGxpY2UodGhpcy5faGlzdGlvZ3JhbS5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfZGIoKSB7XG4gICAgbGV0IGRiID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpXG4gICAgdGhpcy5kYiA9IChkYilcbiAgICAgID8gZGJcbiAgICAgIDogJ3t9J1xuICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMuZGIpXG4gIH1cbiAgc2V0IF9kYihkYikge1xuICAgIGRiID0gSlNPTi5zdHJpbmdpZnkoZGIpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQsIGRiKVxuICB9XG4gIGdldCBfZGF0YSgpIHtcbiAgICB0aGlzLmRhdGEgPSAgKHRoaXMuZGF0YSlcbiAgICAgID8gdGhpcy5kYXRhXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YVxuICB9XG4gIGdldCBfZGF0YUV2ZW50cygpIHtcbiAgICB0aGlzLmRhdGFFdmVudHMgPSAodGhpcy5kYXRhRXZlbnRzKVxuICAgICAgPyB0aGlzLmRhdGFFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5kYXRhRXZlbnRzXG4gIH1cbiAgc2V0IF9kYXRhRXZlbnRzKGRhdGFFdmVudHMpIHtcbiAgICB0aGlzLmRhdGFFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgZGF0YUV2ZW50cywgdGhpcy5fZGF0YUV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2RhdGFDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5kYXRhQ2FsbGJhY2tzID0gKHRoaXMuZGF0YUNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5kYXRhQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YUNhbGxiYWNrc1xuICB9XG4gIHNldCBfZGF0YUNhbGxiYWNrcyhkYXRhQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5kYXRhQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGRhdGFDYWxsYmFja3MsIHRoaXMuX2RhdGFDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9zZXJ2aWNlcygpIHtcbiAgICB0aGlzLnNlcnZpY2VzID0gICh0aGlzLnNlcnZpY2VzKVxuICAgICAgPyB0aGlzLnNlcnZpY2VzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZXNcbiAgfVxuICBzZXQgX3NlcnZpY2VzKHNlcnZpY2VzKSB7XG4gICAgdGhpcy5zZXJ2aWNlcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBzZXJ2aWNlcywgdGhpcy5fc2VydmljZXNcbiAgICApXG4gIH1cbiAgZ2V0IF9zZXJ2aWNlRXZlbnRzKCkge1xuICAgIHRoaXMuc2VydmljZUV2ZW50cyA9ICh0aGlzLnNlcnZpY2VFdmVudHMpXG4gICAgICA/IHRoaXMuc2VydmljZUV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnNlcnZpY2VFdmVudHNcbiAgfVxuICBzZXQgX3NlcnZpY2VFdmVudHMoc2VydmljZUV2ZW50cykge1xuICAgIHRoaXMuc2VydmljZUV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBzZXJ2aWNlRXZlbnRzLCB0aGlzLl9zZXJ2aWNlRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfc2VydmljZUNhbGxiYWNrcygpIHtcbiAgICB0aGlzLnNlcnZpY2VDYWxsYmFja3MgPSAodGhpcy5zZXJ2aWNlQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLnNlcnZpY2VDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9zZXJ2aWNlQ2FsbGJhY2tzKHNlcnZpY2VDYWxsYmFja3MpIHtcbiAgICB0aGlzLnNlcnZpY2VDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgc2VydmljZUNhbGxiYWNrcywgdGhpcy5fc2VydmljZUNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZW5hYmxlU2VydmljZUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnNlcnZpY2VFdmVudHMsIHRoaXMuc2VydmljZXMsIHRoaXMuc2VydmljZUNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlU2VydmljZUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuc2VydmljZUV2ZW50cywgdGhpcy5zZXJ2aWNlcywgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZURhdGFFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5kYXRhRXZlbnRzLCB0aGlzLCB0aGlzLmRhdGFDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZURhdGFFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmRhdGFFdmVudHMsIHRoaXMsIHRoaXMuZGF0YUNhbGxiYWNrcylcbiAgfVxuICBnZXQoKSB7XG4gICAgbGV0IHByb3BlcnR5ID0gYXJndW1lbnRzWzBdXG4gICAgcmV0dXJuIHRoaXMuX2RhdGFbJ18nLmNvbmNhdChwcm9wZXJ0eSldXG4gIH1cbiAgc2V0KCkge1xuICAgIHRoaXMuX2hpc3RvcnkgPSB0aGlzLnBhcnNlKClcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2lzU2V0dGluZyA9IHRydWVcbiAgICAgICAgICB9IGVsc2UgaWYoaW5kZXggPT09IChfYXJndW1lbnRzLmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICB0aGlzLl9pc1NldHRpbmcgPSBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlKSB0aGlzLnNldERCKGtleSwgdmFsdWUpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlKSB0aGlzLnNldERCKGtleSwgdmFsdWUpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDM6XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHZhciBzaWxlbnQgPSBhcmd1bWVudHNbMl1cbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KVxuICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy5zZXREQihrZXksIHZhbHVlKVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICB1bnNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5fZGF0YSkpIHtcbiAgICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBzZXREQigpIHtcbiAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHZhciBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGxldCB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgdGhpcy5fZGIgPSBkYlxuICB9XG4gIHVuc2V0REIoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZGVsZXRlIHRoaXMuX2RiXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgZGVsZXRlIGRiW2tleV1cbiAgICAgICAgdGhpcy5fZGIgPSBkYlxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBzZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KSB7XG4gICAgaWYoIXRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXSkge1xuICAgICAgbGV0IGNvbnRleHQgPSB0aGlzXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhcbiAgICAgICAgdGhpcy5fZGF0YSxcbiAgICAgICAge1xuICAgICAgICAgIFsnXycuY29uY2F0KGtleSldOiB7XG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzW2tleV0gfSxcbiAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICAhc2lsZW50ICYmXG4gICAgICAgICAgICAgICAgIWNvbnRleHQuX2lzU2V0dGluZ1xuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBsZXQgc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3NldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgICAgICAgICAgICAgIGxldCBzZXRFdmVudE5hbWUgPSAnc2V0J1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICAgIHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBzZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gICAgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldID0gdmFsdWVcbiAgfVxuICB1bnNldERhdGFQcm9wZXJ0eShrZXkpIHtcbiAgICBsZXQgdW5zZXRWYWx1ZUV2ZW50TmFtZSA9IFsndW5zZXQnLCAnOicsIGtleV0uam9pbignJylcbiAgICBsZXQgdW5zZXRFdmVudE5hbWUgPSAndW5zZXQnXG4gICAgbGV0IHVuc2V0VmFsdWUgPSB0aGlzLl9kYXRhW2tleV1cbiAgICBkZWxldGUgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldXG4gICAgZGVsZXRlIHRoaXMuX2RhdGFba2V5XVxuICAgIHRoaXMuZW1pdChcbiAgICAgIHVuc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IHVuc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIClcbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldEV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIClcbiAgfVxuICBwYXJzZShkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5fZGF0YVxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KE9iamVjdC5hc3NpZ24oe30sIGRhdGEpKSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MubG9jYWxTdG9yYWdlKSB0aGlzLmxvY2FsU3RvcmFnZSA9IHRoaXMuc2V0dGluZ3MubG9jYWxTdG9yYWdlXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmhpc3Rpb2dyYW0pIHRoaXMuX2hpc3Rpb2dyYW0gPSB0aGlzLnNldHRpbmdzLmhpc3Rpb2dyYW1cbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZW1pdHRlcnMpIHRoaXMuX2VtaXR0ZXJzID0gdGhpcy5zZXR0aW5ncy5lbWl0dGVyc1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5zZXJ2aWNlcykgdGhpcy5fc2VydmljZXMgPSB0aGlzLnNldHRpbmdzLnNlcnZpY2VzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnNlcnZpY2VDYWxsYmFja3MpIHRoaXMuX3NlcnZpY2VDYWxsYmFja3MgPSB0aGlzLnNldHRpbmdzLnNlcnZpY2VDYWxsYmFja3NcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3Muc2VydmljZUV2ZW50cykgdGhpcy5fc2VydmljZUV2ZW50cyA9IHRoaXMuc2V0dGluZ3Muc2VydmljZUV2ZW50c1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5kYXRhKSB0aGlzLnNldCh0aGlzLnNldHRpbmdzLmRhdGEpXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRhdGFDYWxsYmFja3MpIHRoaXMuX2RhdGFDYWxsYmFja3MgPSB0aGlzLnNldHRpbmdzLmRhdGFDYWxsYmFja3NcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGF0YUV2ZW50cykgdGhpcy5fZGF0YUV2ZW50cyA9IHRoaXMuc2V0dGluZ3MuZGF0YUV2ZW50c1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5zY2hlbWEpIHRoaXMuX3NjaGVtYSA9IHRoaXMuc2V0dGluZ3Muc2NoZW1hXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRlZmF1bHRzKSB0aGlzLl9kZWZhdWx0cyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHNcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnNlcnZpY2VzICYmXG4gICAgICAgIHRoaXMuc2VydmljZUV2ZW50cyAmJlxuICAgICAgICB0aGlzLnNlcnZpY2VDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZVNlcnZpY2VFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuZGF0YUV2ZW50cyAmJlxuICAgICAgICB0aGlzLmRhdGFDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZURhdGFFdmVudHMoKVxuICAgICAgfVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMuc2VydmljZXMgJiZcbiAgICAgICAgdGhpcy5zZXJ2aWNlRXZlbnRzICYmXG4gICAgICAgIHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZVNlcnZpY2VFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuZGF0YUV2ZW50cyAmJlxuICAgICAgICB0aGlzLmRhdGFDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVEYXRhRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSB0aGlzLmxvY2FsU3RvcmFnZVxuICAgICAgZGVsZXRlIHRoaXMuX2hpc3Rpb2dyYW1cbiAgICAgIGRlbGV0ZSB0aGlzLl9zZXJ2aWNlc1xuICAgICAgZGVsZXRlIHRoaXMuX3NlcnZpY2VDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9zZXJ2aWNlRXZlbnRzXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YVxuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhRXZlbnRzXG4gICAgICBkZWxldGUgdGhpcy5fc2NoZW1hXG4gICAgICBkZWxldGUgdGhpcy5fZW1pdHRlcnNcbiAgICB9XG4gIH1cbn1cbiIsIk1WQy5FbWl0dGVyID0gY2xhc3MgZXh0ZW5kcyBNVkMuTW9kZWwge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxyXG4gICAgaWYodGhpcy5zZXR0aW5ncykge1xyXG4gICAgICBpZih0aGlzLnNldHRpbmdzLm5hbWUpIHRoaXMuX25hbWUgPSB0aGlzLnNldHRpbmdzLm5hbWVcclxuICAgIH1cclxuICB9XHJcbiAgZ2V0IF9uYW1lKCkgeyByZXR1cm4gdGhpcy5uYW1lIH1cclxuICBzZXQgX25hbWUobmFtZSkgeyB0aGlzLm5hbWUgPSBuYW1lIH1cclxuICBlbWlzc2lvbigpIHtcclxuICAgIGxldCBldmVudERhdGEgPSB7XHJcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcclxuICAgICAgZGF0YTogdGhpcy5kYXRhXHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgIHRoaXMubmFtZSxcclxuICAgICAgZXZlbnREYXRhXHJcbiAgICApXHJcbiAgICByZXR1cm4gZXZlbnREYXRhXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5FbWl0dGVycyA9IHt9XHJcbiIsIk1WQy5FbWl0dGVycy5OYXZpZ2F0ZUVtaXR0ZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5FbWl0dGVyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICAgIHRoaXMuYWRkU2V0dGluZ3MoKVxyXG4gICAgdGhpcy5lbmFibGUoKVxyXG4gIH1cclxuICBhZGRTZXR0aW5ncygpIHtcclxuICAgIHRoaXMuX25hbWUgPSAnbmF2aWdhdGUnXHJcbiAgICB0aGlzLl9zY2hlbWEgPSB7XHJcbiAgICAgIG9sZFVSTDogU3RyaW5nLFxyXG4gICAgICBuZXdVUkw6IFN0cmluZyxcclxuICAgICAgY3VycmVudFJvdXRlOiBTdHJpbmcsXHJcbiAgICAgIGN1cnJlbnRDb250cm9sbGVyOiBTdHJpbmcsXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIk1WQy5WaWV3ID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgX2VsZW1lbnROYW1lKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudC50YWdOYW1lIH1cbiAgc2V0IF9lbGVtZW50TmFtZShlbGVtZW50TmFtZSkge1xuICAgIGlmKCF0aGlzLl9lbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50TmFtZSlcbiAgfVxuICBnZXQgX2VsZW1lbnQoKSB7IHJldHVybiB0aGlzLmVsZW1lbnQgfVxuICBzZXQgX2VsZW1lbnQoZWxlbWVudCkge1xuICAgIGlmKFxuICAgICAgZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICBlbGVtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRcbiAgICApIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICB9IGVsc2UgaWYodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQpXG4gICAgfVxuICAgIHRoaXMuZWxlbWVudE9ic2VydmVyLm9ic2VydmUodGhpcy5lbGVtZW50LCB7XG4gICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIH0pXG4gIH1cbiAgZ2V0IF9hdHRyaWJ1dGVzKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudC5hdHRyaWJ1dGVzIH1cbiAgc2V0IF9hdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHtcbiAgICBmb3IobGV0IFthdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKSkge1xuICAgICAgaWYodHlwZW9mIGF0dHJpYnV0ZVZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVLZXkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgX3VpKCkge1xuICAgIHRoaXMudWkgPSAodGhpcy51aSlcbiAgICAgID8gdGhpcy51aVxuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnVpXG4gIH1cbiAgc2V0IF91aSh1aSkge1xuICAgIGlmKCF0aGlzLl91aVsnJGVsZW1lbnQnXSkgdGhpcy5fdWlbJyRlbGVtZW50J10gPSB0aGlzLmVsZW1lbnRcbiAgICBmb3IobGV0IFt1aUtleSwgdWlWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModWkpKSB7XG4gICAgICBpZih0eXBlb2YgdWlWYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fdWlbdWlLZXldID0gdGhpcy5fZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHVpVmFsdWUpXG4gICAgICB9IGVsc2UgaWYoXG4gICAgICAgIHVpVmFsdWUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxuICAgICAgICB1aVZhbHVlIGluc3RhbmNlb2YgRG9jdW1lbnRcbiAgICAgICkge1xuICAgICAgICB0aGlzLl91aVt1aUtleV0gPSB1aVZhbHVlXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfdWlFdmVudHMoKSB7IHJldHVybiB0aGlzLnVpRXZlbnRzIH1cbiAgc2V0IF91aUV2ZW50cyh1aUV2ZW50cykgeyB0aGlzLnVpRXZlbnRzID0gdWlFdmVudHMgfVxuICBnZXQgX3VpQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMudWlDYWxsYmFja3MgPSAodGhpcy51aUNhbGxiYWNrcylcbiAgICAgID8gdGhpcy51aUNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnVpQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF91aUNhbGxiYWNrcyh1aUNhbGxiYWNrcykge1xuICAgIHRoaXMudWlDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdWlDYWxsYmFja3MsIHRoaXMuX3VpQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfb2JzZXJ2ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5vYnNlcnZlckNhbGxiYWNrcyA9ICh0aGlzLm9ic2VydmVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX29ic2VydmVyQ2FsbGJhY2tzKG9ic2VydmVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5vYnNlcnZlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBvYnNlcnZlckNhbGxiYWNrcywgdGhpcy5fb2JzZXJ2ZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IGVsZW1lbnRPYnNlcnZlcigpIHtcbiAgICB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgPSAodGhpcy5fZWxlbWVudE9ic2VydmVyKVxuICAgICAgPyB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgICAgIDogbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5lbGVtZW50T2JzZXJ2ZS5iaW5kKHRoaXMpKVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgfVxuICBnZXQgX2luc2VydCgpIHsgcmV0dXJuIHRoaXMuaW5zZXJ0IH1cbiAgc2V0IF9pbnNlcnQoaW5zZXJ0KSB7IHRoaXMuaW5zZXJ0ID0gaW5zZXJ0IH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGdldCBfdGVtcGxhdGVzKCkge1xuICAgIHRoaXMudGVtcGxhdGVzID0gKHRoaXMudGVtcGxhdGVzKVxuICAgICAgPyB0aGlzLnRlbXBsYXRlc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnRlbXBsYXRlc1xuICB9XG4gIHNldCBfdGVtcGxhdGVzKHRlbXBsYXRlcykge1xuICAgIHRoaXMudGVtcGxhdGVzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHRlbXBsYXRlcywgdGhpcy5fdGVtcGxhdGVzXG4gICAgKVxuICB9XG4gIGVsZW1lbnRPYnNlcnZlKG11dGF0aW9uUmVjb3JkTGlzdCwgb2JzZXJ2ZXIpIHtcbiAgICBmb3IobGV0IFttdXRhdGlvblJlY29yZEluZGV4LCBtdXRhdGlvblJlY29yZF0gb2YgT2JqZWN0LmVudHJpZXMobXV0YXRpb25SZWNvcmRMaXN0KSkge1xuICAgICAgc3dpdGNoKG11dGF0aW9uUmVjb3JkLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnY2hpbGRMaXN0JzpcbiAgICAgICAgICBsZXQgbXV0YXRpb25SZWNvcmRDYXRlZ29yaWVzID0gWydhZGRlZE5vZGVzJywgJ3JlbW92ZWROb2RlcyddXG4gICAgICAgICAgZm9yKGxldCBtdXRhdGlvblJlY29yZENhdGVnb3J5IG9mIG11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcykge1xuICAgICAgICAgICAgaWYobXV0YXRpb25SZWNvcmRbbXV0YXRpb25SZWNvcmRDYXRlZ29yeV0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHRoaXMucmVzZXRVSSgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGF1dG9JbnNlcnQoKSB7XG4gICAgaWYodGhpcy5pbnNlcnQpIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5pbnNlcnQuZWxlbWVudClcbiAgICAgIC5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KHRoaXMuaW5zZXJ0Lm1ldGhvZCwgdGhpcy5lbGVtZW50KVxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgYXV0b1JlbW92ZSgpIHtcbiAgICBpZihcbiAgICAgIHRoaXMuZWxlbWVudCAmJlxuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnRcbiAgICApIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcbiAgfVxuICBlbmFibGVFbGVtZW50KHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzXG4gICAgaWYoc2V0dGluZ3MuZWxlbWVudE5hbWUpIHRoaXMuX2VsZW1lbnROYW1lID0gc2V0dGluZ3MuZWxlbWVudE5hbWVcbiAgICBpZihzZXR0aW5ncy5lbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gc2V0dGluZ3MuZWxlbWVudFxuICAgIGlmKHNldHRpbmdzLmF0dHJpYnV0ZXMpIHRoaXMuX2F0dHJpYnV0ZXMgPSBzZXR0aW5ncy5hdHRyaWJ1dGVzXG4gICAgaWYoc2V0dGluZ3MudGVtcGxhdGVzKSB0aGlzLl90ZW1wbGF0ZXMgPSBzZXR0aW5ncy50ZW1wbGF0ZXNcbiAgICBpZihzZXR0aW5ncy5pbnNlcnQpIHRoaXMuX2luc2VydCA9IHNldHRpbmdzLmluc2VydFxuICB9XG4gIGRpc2FibGVFbGVtZW50KHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICB0aGlzLmVsZW1lbnQgJiZcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50XG4gICAgKSB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpXG4gICAgaWYodGhpcy5lbGVtZW50KSBkZWxldGUgdGhpcy5lbGVtZW50XG4gICAgaWYodGhpcy5hdHRyaWJ1dGVzKSBkZWxldGUgdGhpcy5hdHRyaWJ1dGVzXG4gICAgaWYodGhpcy50ZW1wbGF0ZXMpIGRlbGV0ZSB0aGlzLnRlbXBsYXRlc1xuICAgIGlmKHRoaXMuaW5zZXJ0KSBkZWxldGUgdGhpcy5pbnNlcnRcbiAgfVxuICByZXNldFVJKCkge1xuICAgIHRoaXMuZGlzYWJsZVVJKClcbiAgICB0aGlzLmVuYWJsZVVJKClcbiAgfVxuICBlbmFibGVVSShzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKHNldHRpbmdzLnVpKSB0aGlzLl91aSA9IHNldHRpbmdzLnVpXG4gICAgaWYoc2V0dGluZ3MudWlDYWxsYmFja3MpIHRoaXMuX3VpQ2FsbGJhY2tzID0gc2V0dGluZ3MudWlDYWxsYmFja3NcbiAgICBpZihzZXR0aW5ncy51aUV2ZW50cykge1xuICAgICAgdGhpcy5fdWlFdmVudHMgPSBzZXR0aW5ncy51aUV2ZW50c1xuICAgICAgdGhpcy5lbmFibGVVSUV2ZW50cygpXG4gICAgfVxuICB9XG4gIGRpc2FibGVVSShzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKHNldHRpbmdzLnVpRXZlbnRzKSB7XG4gICAgICB0aGlzLmRpc2FibGVVSUV2ZW50cygpXG4gICAgICBkZWxldGUgdGhpcy5fdWlFdmVudHNcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMudWlFdmVudHNcbiAgICBkZWxldGUgdGhpcy51aVxuICAgIGRlbGV0ZSB0aGlzLnVpQ2FsbGJhY2tzXG4gIH1cbiAgZW5hYmxlVUlFdmVudHMoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLnVpRXZlbnRzICYmXG4gICAgICB0aGlzLnVpICYmXG4gICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgKSB7XG4gICAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyhcbiAgICAgICAgdGhpcy51aUV2ZW50cyxcbiAgICAgICAgdGhpcy51aSxcbiAgICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICAgKVxuICAgIH1cbiAgfVxuICBkaXNhYmxlVUlFdmVudHMoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLnVpRXZlbnRzICYmXG4gICAgICB0aGlzLnVpICYmXG4gICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgKSB7XG4gICAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMoXG4gICAgICAgIHRoaXMudWlFdmVudHMsXG4gICAgICAgIHRoaXMudWksXG4gICAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgZW5hYmxlRW1pdHRlcnMoKSB7XG4gICAgaWYodGhpcy5zZXR0aW5ncy5lbWl0dGVycykgdGhpcy5fZW1pdHRlcnMgPSB0aGlzLnNldHRpbmdzLmVtaXR0ZXJzXG4gIH1cbiAgZGlzYWJsZUVtaXR0ZXJzKCkge1xuICAgIGlmKHRoaXMuX2VtaXR0ZXJzKSBkZWxldGUgdGhpcy5fZW1pdHRlcnNcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLl9lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLmVuYWJsZUVtaXR0ZXJzKClcbiAgICAgIHRoaXMuZW5hYmxlRWxlbWVudChzZXR0aW5ncylcbiAgICAgIHRoaXMuZW5hYmxlVUkoc2V0dGluZ3MpXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgdGhpcy5fZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5kaXNhYmxlVUkoc2V0dGluZ3MpXG4gICAgICB0aGlzLmRpc2FibGVFbGVtZW50KHNldHRpbmdzKVxuICAgICAgdGhpcy5kaXNhYmxlRW1pdHRlcnMoKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgICByZXR1cm4gdGhpc3NcbiAgICB9XG4gIH1cbn1cbiIsIk1WQy5Db250cm9sbGVyID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgX2VtaXR0ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzID0gKHRoaXMuZW1pdHRlckNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlckNhbGxiYWNrc1xuICB9XG4gIHNldCBfZW1pdHRlckNhbGxiYWNrcyhlbWl0dGVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGVtaXR0ZXJDYWxsYmFja3MsIHRoaXMuX2VtaXR0ZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9tb2RlbENhbGxiYWNrcygpIHtcbiAgICB0aGlzLm1vZGVsQ2FsbGJhY2tzID0gKHRoaXMubW9kZWxDYWxsYmFja3MpXG4gICAgICA/IHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5tb2RlbENhbGxiYWNrc1xuICB9XG4gIHNldCBfbW9kZWxDYWxsYmFja3MobW9kZWxDYWxsYmFja3MpIHtcbiAgICB0aGlzLm1vZGVsQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG1vZGVsQ2FsbGJhY2tzLCB0aGlzLl9tb2RlbENhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX3ZpZXdDYWxsYmFja3MoKSB7XG4gICAgdGhpcy52aWV3Q2FsbGJhY2tzID0gKHRoaXMudmlld0NhbGxiYWNrcylcbiAgICAgID8gdGhpcy52aWV3Q2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudmlld0NhbGxiYWNrc1xuICB9XG4gIHNldCBfdmlld0NhbGxiYWNrcyh2aWV3Q2FsbGJhY2tzKSB7XG4gICAgdGhpcy52aWV3Q2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHZpZXdDYWxsYmFja3MsIHRoaXMuX3ZpZXdDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9jb250cm9sbGVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcyA9ICh0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX2NvbnRyb2xsZXJDYWxsYmFja3MoY29udHJvbGxlckNhbGxiYWNrcykge1xuICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBjb250cm9sbGVyQ2FsbGJhY2tzLCB0aGlzLl9jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfbW9kZWxzKCkge1xuICAgIHRoaXMubW9kZWxzID0gKHRoaXMubW9kZWxzKVxuICAgICAgPyB0aGlzLm1vZGVsc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm1vZGVsc1xuICB9XG4gIHNldCBfbW9kZWxzKG1vZGVscykge1xuICAgIHRoaXMubW9kZWxzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG1vZGVscywgdGhpcy5fbW9kZWxzXG4gICAgKVxuICB9XG4gIGdldCBfdmlld3MoKSB7XG4gICAgdGhpcy52aWV3cyA9ICh0aGlzLnZpZXdzKVxuICAgICAgPyB0aGlzLnZpZXdzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudmlld3NcbiAgfVxuICBzZXQgX3ZpZXdzKHZpZXdzKSB7XG4gICAgdGhpcy52aWV3cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB2aWV3cywgdGhpcy5fdmlld3NcbiAgICApXG4gIH1cbiAgZ2V0IF9jb250cm9sbGVycygpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJzID0gKHRoaXMuY29udHJvbGxlcnMpXG4gICAgICA/IHRoaXMuY29udHJvbGxlcnNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyc1xuICB9XG4gIHNldCBfY29udHJvbGxlcnMoY29udHJvbGxlcnMpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGNvbnRyb2xsZXJzLCB0aGlzLl9jb250cm9sbGVyc1xuICAgIClcbiAgfVxuICBnZXQgX3JvdXRlcnMoKSB7XG4gICAgdGhpcy5yb3V0ZXJzID0gKHRoaXMucm91dGVycylcbiAgICAgID8gdGhpcy5yb3V0ZXJzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVyc1xuICB9XG4gIHNldCBfcm91dGVycyhyb3V0ZXJzKSB7XG4gICAgdGhpcy5yb3V0ZXJzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlcnMsIHRoaXMuX3JvdXRlcnNcbiAgICApXG4gIH1cbiAgZ2V0IF9yb3V0ZXJFdmVudHMoKSB7XG4gICAgdGhpcy5yb3V0ZXJFdmVudHMgPSAodGhpcy5yb3V0ZXJFdmVudHMpXG4gICAgICA/IHRoaXMucm91dGVyRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVyRXZlbnRzXG4gIH1cbiAgc2V0IF9yb3V0ZXJFdmVudHMocm91dGVyRXZlbnRzKSB7XG4gICAgdGhpcy5yb3V0ZXJFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgcm91dGVyRXZlbnRzLCB0aGlzLl9yb3V0ZXJFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9yb3V0ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5yb3V0ZXJDYWxsYmFja3MgPSAodGhpcy5yb3V0ZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMucm91dGVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9yb3V0ZXJDYWxsYmFja3Mocm91dGVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5yb3V0ZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgcm91dGVyQ2FsbGJhY2tzLCB0aGlzLl9yb3V0ZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9lbWl0dGVyRXZlbnRzKCkge1xuICAgIHRoaXMuZW1pdHRlckV2ZW50cyA9ICh0aGlzLmVtaXR0ZXJFdmVudHMpXG4gICAgICA/IHRoaXMuZW1pdHRlckV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXJFdmVudHNcbiAgfVxuICBzZXQgX2VtaXR0ZXJFdmVudHMoZW1pdHRlckV2ZW50cykge1xuICAgIHRoaXMuZW1pdHRlckV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBlbWl0dGVyRXZlbnRzLCB0aGlzLl9lbWl0dGVyRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfbW9kZWxFdmVudHMoKSB7XG4gICAgdGhpcy5tb2RlbEV2ZW50cyA9ICh0aGlzLm1vZGVsRXZlbnRzKVxuICAgICAgPyB0aGlzLm1vZGVsRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMubW9kZWxFdmVudHNcbiAgfVxuICBzZXQgX21vZGVsRXZlbnRzKG1vZGVsRXZlbnRzKSB7XG4gICAgdGhpcy5tb2RlbEV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBtb2RlbEV2ZW50cywgdGhpcy5fbW9kZWxFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF92aWV3RXZlbnRzKCkge1xuICAgIHRoaXMudmlld0V2ZW50cyA9ICh0aGlzLnZpZXdFdmVudHMpXG4gICAgICA/IHRoaXMudmlld0V2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnZpZXdFdmVudHNcbiAgfVxuICBzZXQgX3ZpZXdFdmVudHModmlld0V2ZW50cykge1xuICAgIHRoaXMudmlld0V2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB2aWV3RXZlbnRzLCB0aGlzLl92aWV3RXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlckV2ZW50cygpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgPSAodGhpcy5jb250cm9sbGVyRXZlbnRzKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyRXZlbnRzXG4gIH1cbiAgc2V0IF9jb250cm9sbGVyRXZlbnRzKGNvbnRyb2xsZXJFdmVudHMpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlckV2ZW50cywgdGhpcy5fY29udHJvbGxlckV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZW5hYmxlTW9kZWxFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5tb2RlbEV2ZW50cywgdGhpcy5tb2RlbHMsIHRoaXMubW9kZWxDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZU1vZGVsRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5tb2RlbEV2ZW50cywgdGhpcy5tb2RlbHMsIHRoaXMubW9kZWxDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlVmlld0V2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnZpZXdFdmVudHMsIHRoaXMudmlld3MsIHRoaXMudmlld0NhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlVmlld0V2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMudmlld0V2ZW50cywgdGhpcy52aWV3cywgdGhpcy52aWV3Q2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZUNvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5jb250cm9sbGVyRXZlbnRzLCB0aGlzLmNvbnRyb2xsZXJzLCB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZUNvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmNvbnRyb2xsZXJFdmVudHMsIHRoaXMuY29udHJvbGxlcnMsIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcylcbiAgfVxuICBlbmFibGVFbWl0dGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuZW1pdHRlckV2ZW50cywgdGhpcy5lbWl0dGVycywgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVFbWl0dGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5lbWl0dGVyRXZlbnRzLCB0aGlzLmVtaXR0ZXJzLCB0aGlzLmVtaXR0ZXJDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlUm91dGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMucm91dGVyRXZlbnRzLCB0aGlzLnJvdXRlcnMsIHRoaXMucm91dGVyQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVSb3V0ZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnJvdXRlckV2ZW50cywgdGhpcy5yb3V0ZXJzLCB0aGlzLnJvdXRlckNhbGxiYWNrcylcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKHNldHRpbmdzLmVtaXR0ZXJDYWxsYmFja3MpIHRoaXMuX2VtaXR0ZXJDYWxsYmFja3MgPSBzZXR0aW5ncy5lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5tb2RlbENhbGxiYWNrcykgdGhpcy5fbW9kZWxDYWxsYmFja3MgPSBzZXR0aW5ncy5tb2RlbENhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3Mudmlld0NhbGxiYWNrcykgdGhpcy5fdmlld0NhbGxiYWNrcyA9IHNldHRpbmdzLnZpZXdDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLmNvbnRyb2xsZXJDYWxsYmFja3MpIHRoaXMuX2NvbnRyb2xsZXJDYWxsYmFja3MgPSBzZXR0aW5ncy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5yb3V0ZXJDYWxsYmFja3MpIHRoaXMuX3JvdXRlckNhbGxiYWNrcyA9IHNldHRpbmdzLnJvdXRlckNhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3MuZW1pdHRlcnMpIHRoaXMuX2VtaXR0ZXJzID0gc2V0dGluZ3MuZW1pdHRlcnNcbiAgICAgIGlmKHNldHRpbmdzLm1vZGVscykgdGhpcy5fbW9kZWxzID0gc2V0dGluZ3MubW9kZWxzXG4gICAgICBpZihzZXR0aW5ncy52aWV3cykgdGhpcy5fdmlld3MgPSBzZXR0aW5ncy52aWV3c1xuICAgICAgaWYoc2V0dGluZ3MuY29udHJvbGxlcnMpIHRoaXMuX2NvbnRyb2xsZXJzID0gc2V0dGluZ3MuY29udHJvbGxlcnNcbiAgICAgIGlmKHNldHRpbmdzLnJvdXRlcnMpIHRoaXMuX3JvdXRlcnMgPSBzZXR0aW5ncy5yb3V0ZXJzXG4gICAgICBpZihzZXR0aW5ncy5yb3V0ZXJFdmVudHMpIHRoaXMuX3JvdXRlckV2ZW50cyA9IHNldHRpbmdzLnJvdXRlckV2ZW50c1xuICAgICAgaWYoc2V0dGluZ3MuZW1pdHRlckV2ZW50cykgdGhpcy5fZW1pdHRlckV2ZW50cyA9IHNldHRpbmdzLmVtaXR0ZXJFdmVudHNcbiAgICAgIGlmKHNldHRpbmdzLm1vZGVsRXZlbnRzKSB0aGlzLl9tb2RlbEV2ZW50cyA9IHNldHRpbmdzLm1vZGVsRXZlbnRzXG4gICAgICBpZihzZXR0aW5ncy52aWV3RXZlbnRzKSB0aGlzLl92aWV3RXZlbnRzID0gc2V0dGluZ3Mudmlld0V2ZW50c1xuICAgICAgaWYoc2V0dGluZ3MuY29udHJvbGxlckV2ZW50cykgdGhpcy5fY29udHJvbGxlckV2ZW50cyA9IHNldHRpbmdzLmNvbnRyb2xsZXJFdmVudHNcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmVtaXR0ZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVycyAmJlxuICAgICAgICB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZUVtaXR0ZXJFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMucm91dGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMucm91dGVycyAmJlxuICAgICAgICB0aGlzLnJvdXRlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlUm91dGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLm1vZGVsRXZlbnRzICYmXG4gICAgICAgIHRoaXMubW9kZWxzICYmXG4gICAgICAgIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZU1vZGVsRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnZpZXdFdmVudHMgJiZcbiAgICAgICAgdGhpcy52aWV3cyAmJlxuICAgICAgICB0aGlzLnZpZXdDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZVZpZXdFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuY29udHJvbGxlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlQ29udHJvbGxlckV2ZW50cygpXG4gICAgICB9XG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICB0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmVtaXR0ZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVycyAmJlxuICAgICAgICB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVFbWl0dGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnJvdXRlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLnJvdXRlcnMgJiZcbiAgICAgICAgdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVSb3V0ZXJFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMubW9kZWxFdmVudHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbENhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZU1vZGVsRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnZpZXdFdmVudHMgJiZcbiAgICAgICAgdGhpcy52aWV3cyAmJlxuICAgICAgICB0aGlzLnZpZXdDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVWaWV3RXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVycyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVDb250cm9sbGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSB0aGlzLl9lbWl0dGVyc1xuICAgICAgZGVsZXRlIHRoaXMuX21vZGVsQ2FsbGJhY2tzXG4gICAgICBkZWxldGUgdGhpcy5fdmlld0NhbGxiYWNrc1xuICAgICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9yb3V0ZXJDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9tb2RlbHNcbiAgICAgIGRlbGV0ZSB0aGlzLl92aWV3c1xuICAgICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJzXG4gICAgICBkZWxldGUgdGhpcy5fcm91dGVyc1xuICAgICAgZGVsZXRlIHRoaXMuX21vZGVsRXZlbnRzXG4gICAgICBkZWxldGUgdGhpcy5fdmlld0V2ZW50c1xuICAgICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJFdmVudHNcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgfVxufVxuIiwiTVZDLlJvdXRlciA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IHJvdXRlKCkge1xuICAgIGlmKHRoaXMuX2hhc2gpIHtcbiAgICAgIHJldHVybiBTdHJpbmcod2luZG93LmxvY2F0aW9uLmhhc2gpLnNwbGl0KCcjJykucG9wKClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFN0cmluZyh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpXG4gICAgfVxuICB9XG4gIGdldCBfaGFzaCgpIHsgcmV0dXJuIHRoaXMuaGFzaCB9XG4gIHNldCBfaGFzaChoYXNoKSB7IHRoaXMuaGFzaCA9IGhhc2ggfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZ2V0IF9yb3V0ZXMoKSB7XG4gICAgdGhpcy5yb3V0ZXMgPSAodGhpcy5yb3V0ZXMpXG4gICAgICA/IHRoaXMucm91dGVzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVzXG4gIH1cbiAgc2V0IF9yb3V0ZXMocm91dGVzKSB7XG4gICAgdGhpcy5yb3V0ZXMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgcm91dGVzLCB0aGlzLl9yb3V0ZXNcbiAgICApXG4gIH1cbiAgZ2V0IF9jb250cm9sbGVyKCkgeyByZXR1cm4gdGhpcy5jb250cm9sbGVyIH1cbiAgc2V0IF9jb250cm9sbGVyKGNvbnRyb2xsZXIpIHsgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlciB9XG4gIGdldCBfcHJldmlvdXNVUkwoKSB7IHJldHVybiB0aGlzLnByZXZpb3VzVVJMIH1cbiAgc2V0IF9wcmV2aW91c1VSTChwcmV2aW91c1VSTCkgeyB0aGlzLnByZXZpb3VzVVJMID0gcHJldmlvdXNVUkwgfVxuICBnZXQgX2N1cnJlbnRVUkwoKSB7IHJldHVybiB0aGlzLmN1cnJlbnRVUkwgfVxuICBzZXQgX2N1cnJlbnRVUkwoY3VycmVudFVSTCkgeyB0aGlzLmN1cnJlbnRVUkwgPSBjdXJyZW50VVJMIH1cbiAgZ2V0IGZyYWdtZW50SURSZWdFeHAoKSB7IHJldHVybiBuZXcgUmVnRXhwKC9eKFswLTlBLVpcXD9cXD1cXCxcXC5cXCpcXC1cXF9cXCdcXFwiXFxeXFwlXFwkXFwjXFxAXFwhXFx+XFwoXFwpXFx7XFx9XFwmXFw8XFw+XFxcXFxcL10pKiQvLCAnZ2knKSB9XG4gIGZyYWdtZW50TmFtZVJlZ0V4cChmcmFnbWVudCkgeyByZXR1cm4gbmV3IFJlZ0V4cCgnXicuY29uY2F0KGZyYWdtZW50LCAnJCcpKSB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5faGFzaCA9ICh0eXBlb2YgdGhpcy5zZXR0aW5ncy5oYXNoID09PSAnYm9vbGVhbicpXG4gICAgICAgID8gdGhpcy5zZXR0aW5ncy5oYXNoXG4gICAgICAgIDogdHJ1ZVxuICAgICAgdGhpcy5lbmFibGVFbWl0dGVycygpXG4gICAgICB0aGlzLmVuYWJsZUV2ZW50cygpXG4gICAgICB0aGlzLmVuYWJsZVJvdXRlcygpXG4gICAgICB0aGlzLnJvdXRlQ2hhbmdlKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgfVxuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgIHRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgZGVsZXRlIHRoaXMuX2hhc2hcbiAgICAgIHRoaXMuZGlzYWJsZUV2ZW50cygpXG4gICAgICB0aGlzLmRpc2FibGVSb3V0ZXMoKVxuICAgICAgdGhpcy5kaXNhYmxlRW1pdHRlcnMoKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICB9XG4gIGVuYWJsZVJvdXRlcygpIHtcbiAgICBpZih0aGlzLnNldHRpbmdzLmNvbnRyb2xsZXIpIHRoaXMuX2NvbnRyb2xsZXIgPSB0aGlzLnNldHRpbmdzLmNvbnRyb2xsZXJcbiAgICB0aGlzLl9yb3V0ZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnNldHRpbmdzLnJvdXRlcykucmVkdWNlKFxuICAgICAgKFxuICAgICAgICBfcm91dGVzLFxuICAgICAgICBbcm91dGVQYXRoLCByb3V0ZUNhbGxiYWNrXSxcbiAgICAgICAgcm91dGVJbmRleCxcbiAgICAgICAgb3JpZ2luYWxSb3V0ZXMsXG4gICAgICApID0+IHtcbiAgICAgICAgX3JvdXRlc1tyb3V0ZVBhdGhdID0gdGhpcy5jb250cm9sbGVyW3JvdXRlQ2FsbGJhY2tdXG4gICAgICAgIHJldHVybiBfcm91dGVzXG4gICAgICB9LFxuICAgICAge31cbiAgICApXG4gICAgcmV0dXJuXG4gIH1cbiAgZW5hYmxlRW1pdHRlcnMoKSB7XG4gICAgdGhpcy5fZW1pdHRlcnMgPSB7XG4gICAgICBuYXZpZ2F0ZUVtaXR0ZXI6IG5ldyBNVkMuRW1pdHRlcnMuTmF2aWdhdGVFbWl0dGVyKCksXG4gICAgfVxuICB9XG4gIGRpc2FibGVFbWl0dGVycygpIHtcbiAgICBkZWxldGUgdGhpcy5fZW1pdHRlcnMubmF2aWdhdGVFbWl0dGVyXG4gIH1cbiAgZGlzYWJsZVJvdXRlcygpIHtcbiAgICBkZWxldGUgdGhpcy5fcm91dGVzXG4gICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJcbiAgfVxuICBlbmFibGVFdmVudHMoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLnJvdXRlQ2hhbmdlLmJpbmQodGhpcykpXG4gIH1cbiAgZGlzYWJsZUV2ZW50cygpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMucm91dGVDaGFuZ2UuYmluZCh0aGlzKSlcbiAgfVxuICByb3V0ZUNoYW5nZSgpIHtcbiAgICBsZXQgcm91dGUgPSB0aGlzLnJvdXRlLnNwbGl0KCcvJykuZmlsdGVyKChmcmFnbWVudCkgPT4gZnJhZ21lbnQubGVuZ3RoKVxuICAgIHJvdXRlID0gKHJvdXRlLmxlbmd0aClcbiAgICAgID8gcm91dGVcbiAgICAgIDogWycvJ11cbiAgICBsZXQgcm91dGVDb250cm9sbGVyRGF0YSA9IE9iamVjdC5lbnRyaWVzKHRoaXMucm91dGVzKVxuICAgICAgLmZpbHRlcigoW3JvdXRlclBhdGgsIHJvdXRlckNvbnRyb2xsZXJdKSA9PiB7XG4gICAgICAgIHJvdXRlclBhdGggPSByb3V0ZXJQYXRoLnNwbGl0KCcvJykuZmlsdGVyKChmcmFnbWVudCkgPT4gZnJhZ21lbnQubGVuZ3RoKVxuICAgICAgICByb3V0ZXJQYXRoID0gKHJvdXRlclBhdGgubGVuZ3RoKVxuICAgICAgICAgID8gcm91dGVyUGF0aFxuICAgICAgICAgIDogWycvJ11cbiAgICAgICAgaWYoXG4gICAgICAgICAgcm91dGUubGVuZ3RoICYmXG4gICAgICAgICAgcm91dGUubGVuZ3RoID09PSByb3V0ZXJQYXRoLmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICBsZXQgbWF0Y2hcbiAgICAgICAgICByZXR1cm4gcm91dGVyUGF0aC5maWx0ZXIoKGZyYWdtZW50LCBmcmFnbWVudEluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgbWF0Y2ggPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICBtYXRjaCA9PT0gdHJ1ZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGlmKGZyYWdtZW50WzBdID09PSAnOicpIHtcbiAgICAgICAgICAgICAgICBmcmFnbWVudCA9IHRoaXMuZnJhZ21lbnRJRFJlZ0V4cFxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZyYWdtZW50ID0gZnJhZ21lbnQucmVwbGFjZShuZXcgUmVnRXhwKCcvJywgJ2dpJyksICdcXFxcXFwvJylcbiAgICAgICAgICAgICAgICBmcmFnbWVudCA9IHRoaXMuZnJhZ21lbnROYW1lUmVnRXhwKGZyYWdtZW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG1hdGNoID0gZnJhZ21lbnQudGVzdChyb3V0ZVtmcmFnbWVudEluZGV4XSlcbiAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgbWF0Y2ggPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICBmcmFnbWVudEluZGV4ID09PSByb3V0ZS5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiByb3V0ZXJDb250cm9sbGVyXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVswXVxuICAgICAgICB9XG4gICAgICB9KVswXVxuICAgIHRyeSB7XG4gICAgICBpZih0aGlzLmN1cnJlbnRVUkwpIHRoaXMuX3ByZXZpb3VzVVJMID0gdGhpcy5jdXJyZW50VVJMXG4gICAgICB0aGlzLl9jdXJyZW50VVJMID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICAgIGxldCByb3V0ZUNvbnRyb2xsZXJOYW1lID0gcm91dGVDb250cm9sbGVyRGF0YVswXVxuICAgICAgbGV0IHJvdXRlQ29udHJvbGxlciA9IHJvdXRlQ29udHJvbGxlckRhdGFbMV1cbiAgICAgIGxldCBuYXZpZ2F0ZUVtaXR0ZXIgPSB0aGlzLmVtaXR0ZXJzLm5hdmlnYXRlRW1pdHRlclxuICAgICAgbGV0IG5hdmlnYXRlRW1pdHRlckRhdGEgPSB7XG4gICAgICAgIGN1cnJlbnRVUkw6IHRoaXMuY3VycmVudFVSTCxcbiAgICAgICAgcHJldmlvdXNVUkw6IHRoaXMucHJldmlvdXNVUkwsXG4gICAgICAgIGN1cnJlbnRSb3V0ZTogdGhpcy5yb3V0ZSxcbiAgICAgICAgY3VycmVudENvbnRyb2xsZXI6IHJvdXRlQ29udHJvbGxlci5uYW1lXG4gICAgICB9XG4gICAgICBuYXZpZ2F0ZUVtaXR0ZXIuc2V0KG5hdmlnYXRlRW1pdHRlckRhdGEpXG4gICAgICB0aGlzLmVtaXQoXG4gICAgICAgIG5hdmlnYXRlRW1pdHRlci5uYW1lLFxuICAgICAgICBuYXZpZ2F0ZUVtaXR0ZXIuZW1pc3Npb24oKVxuICAgICAgKVxuICAgICAgcm91dGVDb250cm9sbGVyKG5hdmlnYXRlRW1pdHRlci5lbWlzc2lvbigpKVxuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgIHRocm93ICdSb3V0ZSBEZWZpbml0aW9uIEVycm9yJ1xuICAgIH1cbiAgfVxuICBuYXZpZ2F0ZShwYXRoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBwYXRoXG4gIH1cbn1cbiJdfQ==
