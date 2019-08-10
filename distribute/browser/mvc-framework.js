var MVC = MVC || {};
MVC.Constants = {};
MVC.CONST = MVC.Constants;
MVC.Constants.Events = {};
MVC.CONST.EV = MVC.Constants.Events;
MVC.Utils = {};
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

  get _isSetting() {
    return this.isSetting;
  }

  set _isSetting(isSetting) {
    this.isSetting = isSetting;
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
        this._isSetting = true;

        var _arguments = Object.entries(arguments[0]);

        _arguments.forEach((_ref, index) => {
          var [key, value] = _ref;
          if (index === _arguments.length - 1) this._isSetting = false;
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

            if (!context._isSetting) {
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
    var routeData = {};
    var path = this.path.split('/').filter(fragment => fragment.length);
    path = path.length ? path : ['/'];
    var hash = this.hash;
    var hashFragments = hash ? hash.split('/').filter(fragment => fragment.length) : null;
    var params = this.params;
    var paramData = params ? MVC.Utils.paramsToObject(params) : null;
    if (this.protocol) routeData.protocol = this.protocol;
    if (this.hostname) routeData.hostname = this.hostname;
    if (this.port) routeData.port = this.port;
    if (this.path) routeData.path = this.path;

    if (hash && hashFragments) {
      hashFragments = hashFragments.length ? hashFragments : ['/'];
      routeData.hash = {
        path: hash,
        fragments: hashFragments
      };
    }

    if (params && paramData) {
      routeData.params = {
        path: params,
        data: paramData
      };
    }

    routeData.path = {
      name: this.path,
      fragments: path
    };
    routeData.currentURL = this.currentURL;
    routeData = Object.assign(routeData, this._routeControllerData);
    this.routeData = routeData;
    return this.routeData;
  }

  get _routeControllerData() {
    var routeData = {};
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
              routeData[routeFragment.replace(':', '')] = pathFragments[routeFragmentIndex];
              routeFragment = this.fragmentIDRegExp;
            } else {
              routeFragment = routeFragment.replace(new RegExp('/', 'gi'), '\\\/');
              routeFragment = this.routeFragmentNameRegExp(routeFragment);
            }

            match = routeFragment.test(pathFragments[routeFragmentIndex]);

            if (match === true && routeFragmentIndex === pathFragments.length - 1) {
              routeData.route = {
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
    var settings = this.settings;

    if (settings && !this.enabled) {
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
    return;
  }

  enableEmitters() {
    this._emitters = {
      navigateEmitter: new MVC.Emitters.Navigate()
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
    this._currentURL = window.location.href;
    var routeData = this._routeData;

    if (routeData.controller) {
      var navigateEmitter = this.emitters.navigateEmitter;
      if (this.previousURL) routeData.previousURL = this.previousURL;
      navigateEmitter.unset().set(routeData);
      this.emit(navigateEmitter.name, navigateEmitter.emission());
      routeData.controller.callback(navigateEmitter.emission());
    }
  }

  navigate(path) {
    window.location.hash = path;
  }

};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1WQy5qcyIsIkNvbnN0YW50cy5qcyIsIkV2ZW50cy5qcyIsImluZGV4LmpzIiwiYWRkUHJvcGVydGllc1RvT2JqZWN0LmpzIiwiaXMuanMiLCJvYmplY3RRdWVyeS5qcyIsInBhcmFtc1RvT2JqZWN0LmpzIiwidG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cy5qcyIsInR5cGVPZi5qcyIsInZhbGlkYXRlRGF0YVNjaGVtYS5qcyIsIkNoYW5uZWxzLmpzIiwiQ2hhbm5lbC5qcyIsIkJhc2UuanMiLCJTZXJ2aWNlLmpzIiwiTW9kZWwuanMiLCJFbWl0dGVyLmpzIiwiVmlldy5qcyIsIkNvbnRyb2xsZXIuanMiLCJOYXZpZ2F0ZS5qcyIsIlJvdXRlci5qcyJdLCJuYW1lcyI6WyJNVkMiLCJDb25zdGFudHMiLCJDT05TVCIsIkV2ZW50cyIsIkVWIiwiVXRpbHMiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QiLCJ0YXJnZXRPYmplY3QiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJwcm9wZXJ0aWVzIiwicHJvcGVydHlOYW1lIiwicHJvcGVydHlWYWx1ZSIsIk9iamVjdCIsImVudHJpZXMiLCJpc0FycmF5Iiwib2JqZWN0IiwiQXJyYXkiLCJpc09iamVjdCIsImlzRXF1YWxUeXBlIiwidmFsdWVBIiwidmFsdWVCIiwiaXNIVE1MRWxlbWVudCIsIkhUTUxFbGVtZW50Iiwib2JqZWN0UXVlcnkiLCJzdHJpbmciLCJjb250ZXh0Iiwic3RyaW5nRGF0YSIsInBhcnNlTm90YXRpb24iLCJzcGxpY2UiLCJyZWR1Y2UiLCJmcmFnbWVudCIsImZyYWdtZW50SW5kZXgiLCJmcmFnbWVudHMiLCJwYXJzZUZyYWdtZW50IiwicHJvcGVydHlLZXkiLCJtYXRjaCIsImNvbmNhdCIsImNoYXJBdCIsInNsaWNlIiwic3BsaXQiLCJSZWdFeHAiLCJwYXJhbXNUb09iamVjdCIsInBhcmFtcyIsImZvckVhY2giLCJwYXJhbURhdGEiLCJkZWNvZGVVUklDb21wb25lbnQiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJ0b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzIiwidG9nZ2xlTWV0aG9kIiwiZXZlbnRzIiwidGFyZ2V0T2JqZWN0cyIsImNhbGxiYWNrcyIsImV2ZW50U2V0dGluZ3MiLCJldmVudENhbGxiYWNrTmFtZSIsImV2ZW50RGF0YSIsImV2ZW50VGFyZ2V0U2V0dGluZ3MiLCJldmVudE5hbWUiLCJldmVudFRhcmdldHMiLCJldmVudFRhcmdldE5hbWUiLCJldmVudFRhcmdldCIsImV2ZW50TWV0aG9kTmFtZSIsIk5vZGVMaXN0IiwiRG9jdW1lbnQiLCJldmVudENhbGxiYWNrIiwiX2V2ZW50VGFyZ2V0IiwiYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyIsInVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzIiwidHlwZU9mIiwiZGF0YSIsIl9vYmplY3QiLCJ2YWxpZGF0ZURhdGFTY2hlbWEiLCJzY2hlbWEiLCJhcnJheSIsImNvbnNvbGUiLCJsb2ciLCJuYW1lIiwiYXJyYXlLZXkiLCJhcnJheVZhbHVlIiwicHVzaCIsIm9iamVjdEtleSIsIm9iamVjdFZhbHVlIiwiVE1QTCIsImNvbnN0cnVjdG9yIiwiX2V2ZW50cyIsImV2ZW50Q2FsbGJhY2tzIiwiZXZlbnRDYWxsYmFja0dyb3VwIiwib24iLCJvZmYiLCJlbWl0IiwiZXZlbnRDYWxsYmFja0dyb3VwTmFtZSIsImFkZGl0aW9uYWxBcmd1bWVudHMiLCJ2YWx1ZXMiLCJDaGFubmVscyIsIl9jaGFubmVscyIsImNoYW5uZWxzIiwiY2hhbm5lbCIsImNoYW5uZWxOYW1lIiwiQ2hhbm5lbCIsIl9yZXNwb25zZXMiLCJyZXNwb25zZXMiLCJyZXNwb25zZSIsInJlc3BvbnNlTmFtZSIsInJlc3BvbnNlQ2FsbGJhY2siLCJyZXF1ZXN0IiwicmVxdWVzdERhdGEiLCJrZXlzIiwiQmFzZSIsInNldHRpbmdzIiwiY29uZmlndXJhdGlvbiIsIl9jb25maWd1cmF0aW9uIiwiX3NldHRpbmdzIiwiX2VtaXR0ZXJzIiwiZW1pdHRlcnMiLCJTZXJ2aWNlIiwiX2RlZmF1bHRzIiwiZGVmYXVsdHMiLCJjb250ZW50VHlwZSIsInJlc3BvbnNlVHlwZSIsIl9yZXNwb25zZVR5cGVzIiwiX3Jlc3BvbnNlVHlwZSIsIl94aHIiLCJmaW5kIiwicmVzcG9uc2VUeXBlSXRlbSIsIl90eXBlIiwidHlwZSIsIl91cmwiLCJ1cmwiLCJfaGVhZGVycyIsImhlYWRlcnMiLCJoZWFkZXIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwiX2RhdGEiLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIl9lbmFibGVkIiwiZW5hYmxlZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3RhdHVzIiwiYWJvcnQiLCJvcGVuIiwib25sb2FkIiwib25lcnJvciIsInNlbmQiLCJ0aGVuIiwiY3VycmVudFRhcmdldCIsImVuYWJsZSIsImRpc2FibGUiLCJNb2RlbCIsIl9pc1NldHRpbmciLCJpc1NldHRpbmciLCJfbG9jYWxTdG9yYWdlIiwibG9jYWxTdG9yYWdlIiwiX3NjaGVtYSIsIl9oaXN0aW9ncmFtIiwiaGlzdGlvZ3JhbSIsImFzc2lnbiIsIl9oaXN0b3J5IiwiaGlzdG9yeSIsInVuc2hpZnQiLCJfZGIiLCJkYiIsImdldEl0ZW0iLCJlbmRwb2ludCIsInNldEl0ZW0iLCJfZGF0YUV2ZW50cyIsImRhdGFFdmVudHMiLCJfZGF0YUNhbGxiYWNrcyIsImRhdGFDYWxsYmFja3MiLCJfc2VydmljZXMiLCJzZXJ2aWNlcyIsIl9zZXJ2aWNlRXZlbnRzIiwic2VydmljZUV2ZW50cyIsIl9zZXJ2aWNlQ2FsbGJhY2tzIiwic2VydmljZUNhbGxiYWNrcyIsImVuYWJsZVNlcnZpY2VFdmVudHMiLCJkaXNhYmxlU2VydmljZUV2ZW50cyIsImVuYWJsZURhdGFFdmVudHMiLCJkaXNhYmxlRGF0YUV2ZW50cyIsInNldERlZmF1bHRzIiwic2V0IiwiZ2V0IiwicHJvcGVydHkiLCJfYXJndW1lbnRzIiwiaW5kZXgiLCJrZXkiLCJ2YWx1ZSIsInNldERhdGFQcm9wZXJ0eSIsInNldERCIiwidW5zZXQiLCJ1bnNldERhdGFQcm9wZXJ0eSIsInVuc2V0REIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiY29uZmlndXJhYmxlIiwic2V0VmFsdWVFdmVudE5hbWUiLCJqb2luIiwic2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZUV2ZW50TmFtZSIsInVuc2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZSIsIkVtaXR0ZXIiLCJfbmFtZSIsImVtaXNzaW9uIiwiVmlldyIsIl9lbGVtZW50TmFtZSIsIl9lbGVtZW50IiwidGFnTmFtZSIsImVsZW1lbnROYW1lIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJlbGVtZW50T2JzZXJ2ZXIiLCJvYnNlcnZlIiwic3VidHJlZSIsImNoaWxkTGlzdCIsIl9hdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZUtleSIsImF0dHJpYnV0ZVZhbHVlIiwicmVtb3ZlQXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwiX3VpIiwidWkiLCJ1aUtleSIsInVpVmFsdWUiLCJxdWVyeVNlbGVjdG9yQWxsIiwiX3VpRXZlbnRzIiwidWlFdmVudHMiLCJfdWlDYWxsYmFja3MiLCJ1aUNhbGxiYWNrcyIsIl9vYnNlcnZlckNhbGxiYWNrcyIsIm9ic2VydmVyQ2FsbGJhY2tzIiwiX2VsZW1lbnRPYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJlbGVtZW50T2JzZXJ2ZSIsImJpbmQiLCJfaW5zZXJ0IiwiaW5zZXJ0IiwiX3RlbXBsYXRlcyIsInRlbXBsYXRlcyIsIm11dGF0aW9uUmVjb3JkTGlzdCIsIm9ic2VydmVyIiwibXV0YXRpb25SZWNvcmRJbmRleCIsIm11dGF0aW9uUmVjb3JkIiwibXV0YXRpb25SZWNvcmRDYXRlZ29yaWVzIiwibXV0YXRpb25SZWNvcmRDYXRlZ29yeSIsInJlc2V0VUkiLCJhdXRvSW5zZXJ0IiwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50IiwibWV0aG9kIiwiYXV0b1JlbW92ZSIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImVuYWJsZUVsZW1lbnQiLCJkaXNhYmxlRWxlbWVudCIsImRpc2FibGVVSSIsImVuYWJsZVVJIiwiZW5hYmxlVUlFdmVudHMiLCJkaXNhYmxlVUlFdmVudHMiLCJlbmFibGVFbWl0dGVycyIsImRpc2FibGVFbWl0dGVycyIsInRoaXNzIiwiQ29udHJvbGxlciIsIl9lbWl0dGVyQ2FsbGJhY2tzIiwiZW1pdHRlckNhbGxiYWNrcyIsIl9tb2RlbENhbGxiYWNrcyIsIm1vZGVsQ2FsbGJhY2tzIiwiX3ZpZXdDYWxsYmFja3MiLCJ2aWV3Q2FsbGJhY2tzIiwiX2NvbnRyb2xsZXJDYWxsYmFja3MiLCJjb250cm9sbGVyQ2FsbGJhY2tzIiwiX21vZGVscyIsIm1vZGVscyIsIl92aWV3cyIsInZpZXdzIiwiX2NvbnRyb2xsZXJzIiwiY29udHJvbGxlcnMiLCJfcm91dGVycyIsInJvdXRlcnMiLCJfcm91dGVyRXZlbnRzIiwicm91dGVyRXZlbnRzIiwiX3JvdXRlckNhbGxiYWNrcyIsInJvdXRlckNhbGxiYWNrcyIsIl9lbWl0dGVyRXZlbnRzIiwiZW1pdHRlckV2ZW50cyIsIl9tb2RlbEV2ZW50cyIsIm1vZGVsRXZlbnRzIiwiX3ZpZXdFdmVudHMiLCJ2aWV3RXZlbnRzIiwiX2NvbnRyb2xsZXJFdmVudHMiLCJjb250cm9sbGVyRXZlbnRzIiwiZW5hYmxlTW9kZWxFdmVudHMiLCJkaXNhYmxlTW9kZWxFdmVudHMiLCJlbmFibGVWaWV3RXZlbnRzIiwiZGlzYWJsZVZpZXdFdmVudHMiLCJlbmFibGVDb250cm9sbGVyRXZlbnRzIiwiZGlzYWJsZUNvbnRyb2xsZXJFdmVudHMiLCJlbmFibGVFbWl0dGVyRXZlbnRzIiwiZGlzYWJsZUVtaXR0ZXJFdmVudHMiLCJlbmFibGVSb3V0ZXJFdmVudHMiLCJkaXNhYmxlUm91dGVyRXZlbnRzIiwicmVzZXQiLCJFbWl0dGVycyIsIk5hdmlnYXRlIiwiYWRkU2V0dGluZ3MiLCJvbGRVUkwiLCJTdHJpbmciLCJuZXdVUkwiLCJjdXJyZW50Um91dGUiLCJjdXJyZW50Q29udHJvbGxlciIsIlJvdXRlciIsInByb3RvY29sIiwid2luZG93IiwibG9jYXRpb24iLCJob3N0bmFtZSIsInBvcnQiLCJwYXRoIiwicGF0aG5hbWUiLCJoYXNoIiwiaHJlZiIsImhhc2hJbmRleCIsImluZGV4T2YiLCJwYXJhbUluZGV4Iiwic2xpY2VTdGFydCIsInNsaWNlU3RvcCIsIl9yb3V0ZURhdGEiLCJyb3V0ZURhdGEiLCJmaWx0ZXIiLCJoYXNoRnJhZ21lbnRzIiwiY3VycmVudFVSTCIsIl9yb3V0ZUNvbnRyb2xsZXJEYXRhIiwicm91dGVzIiwicm91dGVQYXRoIiwicm91dGVTZXR0aW5ncyIsInBhdGhGcmFnbWVudHMiLCJyb3V0ZUZyYWdtZW50cyIsInJvdXRlRnJhZ21lbnQiLCJyb3V0ZUZyYWdtZW50SW5kZXgiLCJ1bmRlZmluZWQiLCJyZXBsYWNlIiwiZnJhZ21lbnRJRFJlZ0V4cCIsInJvdXRlRnJhZ21lbnROYW1lUmVnRXhwIiwidGVzdCIsInJvdXRlIiwiY29udHJvbGxlciIsIl9yb3V0ZXMiLCJfY29udHJvbGxlciIsIl9wcmV2aW91c1VSTCIsInByZXZpb3VzVVJMIiwiX2N1cnJlbnRVUkwiLCJlbmFibGVFdmVudHMiLCJlbmFibGVSb3V0ZXMiLCJyb3V0ZUNoYW5nZSIsImRpc2FibGVFdmVudHMiLCJkaXNhYmxlUm91dGVzIiwicm91dGVJbmRleCIsIm9yaWdpbmFsUm91dGVzIiwiY2FsbGJhY2siLCJuYXZpZ2F0ZUVtaXR0ZXIiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm5hdmlnYXRlIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxHQUFHLEdBQUdBLEdBQUcsSUFBSSxFQUFqQjtBQ0FBQSxHQUFHLENBQUNDLFNBQUosR0FBZ0IsRUFBaEI7QUFDQUQsR0FBRyxDQUFDRSxLQUFKLEdBQVlGLEdBQUcsQ0FBQ0MsU0FBaEI7QUNEQUQsR0FBRyxDQUFDQyxTQUFKLENBQWNFLE1BQWQsR0FBdUIsRUFBdkI7QUFDQUgsR0FBRyxD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QUFHQSxXQUFLaFAsSUFBTCxDQUNFZ1IsZUFBZSxDQUFDN1IsSUFEbEIsRUFFRTZSLGVBQWUsQ0FBQzdKLFFBQWhCLEVBRkY7QUFJQTZILE1BQUFBLFNBQVMsQ0FBQ2tCLFVBQVYsQ0FBcUJhLFFBQXJCLENBQ0VDLGVBQWUsQ0FBQzdKLFFBQWhCLEVBREY7QUFHRDtBQUNGOztBQUNEZ0ssRUFBQUEsUUFBUSxDQUFDN0MsSUFBRCxFQUFPO0FBQ2JKLElBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkssSUFBaEIsR0FBdUJGLElBQXZCO0FBQ0Q7O0FBdFFpQyxDQUFwQyIsImZpbGUiOiJicm93c2VyL212Yy1mcmFtZXdvcmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTVZDID0gTVZDIHx8IHt9XHJcbiIsIk1WQy5Db25zdGFudHMgPSB7fVxuTVZDLkNPTlNUID0gTVZDLkNvbnN0YW50c1xuIiwiTVZDLkV2ZW50cyA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9ldmVudHMoKSB7XHJcbiAgICB0aGlzLmV2ZW50cyA9ICh0aGlzLmV2ZW50cylcclxuICAgICAgPyB0aGlzLmV2ZW50c1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5ldmVudHNcclxuICB9XHJcbiAgZXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKSB7IHJldHVybiB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSB8fCB7fSB9XHJcbiAgZXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIChldmVudENhbGxiYWNrLm5hbWUubGVuZ3RoKVxyXG4gICAgICA/IGV2ZW50Q2FsbGJhY2submFtZVxyXG4gICAgICA6ICdhbm9ueW1vdXNGdW5jdGlvbidcclxuICB9XHJcbiAgZXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSkge1xyXG4gICAgcmV0dXJuIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSB8fCBbXVxyXG4gIH1cclxuICBvbihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IHRoaXMuZXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tOYW1lID0gdGhpcy5ldmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tHcm91cCA9IHRoaXMuZXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSlcclxuICAgIGV2ZW50Q2FsbGJhY2tHcm91cC5wdXNoKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gPSBldmVudENhbGxiYWNrR3JvdXBcclxuICAgIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdID0gZXZlbnRDYWxsYmFja3NcclxuICB9XHJcbiAgb2ZmKCkge1xyXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgICAgY2FzZSAxOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDI6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2tOYW1lID0gdGhpcy5ldmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVtldmVudENhbGxiYWNrTmFtZV1cclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxuICBlbWl0KGV2ZW50TmFtZSwgZXZlbnREYXRhKSB7XHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja3MgPSB0aGlzLmV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSlcclxuICAgIGZvcihsZXQgW2V2ZW50Q2FsbGJhY2tHcm91cE5hbWUsIGV2ZW50Q2FsbGJhY2tHcm91cF0gb2YgT2JqZWN0LmVudHJpZXMoZXZlbnRDYWxsYmFja3MpKSB7XHJcbiAgICAgIGZvcihsZXQgZXZlbnRDYWxsYmFjayBvZiBldmVudENhbGxiYWNrR3JvdXApIHtcclxuICAgICAgICBsZXQgYWRkaXRpb25hbEFyZ3VtZW50cyA9IE9iamVjdC52YWx1ZXMoYXJndW1lbnRzKS5zcGxpY2UoMikgfHwgW11cclxuICAgICAgICBldmVudENhbGxiYWNrKGV2ZW50RGF0YSwgLi4uYWRkaXRpb25hbEFyZ3VtZW50cylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJNVkMuRW1pdHRlcnMgPSB7fVxyXG4iLCJNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0ID0gZnVuY3Rpb24gYWRkUHJvcGVydGllc1RvT2JqZWN0KCkge1xyXG4gIGxldCB0YXJnZXRPYmplY3RcclxuICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgY2FzZSAyOlxyXG4gICAgICBsZXQgcHJvcGVydGllcyA9IGFyZ3VtZW50c1swXVxyXG4gICAgICB0YXJnZXRPYmplY3QgPSBhcmd1bWVudHNbMV1cclxuICAgICAgZm9yKGxldCBbcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwcm9wZXJ0aWVzKSkge1xyXG4gICAgICAgIHRhcmdldE9iamVjdFtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZVxyXG4gICAgICB9XHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlIDM6XHJcbiAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgbGV0IHByb3BlcnR5VmFsdWUgPSBhcmd1bWVudHNbMV1cclxuICAgICAgdGFyZ2V0T2JqZWN0ID0gYXJndW1lbnRzWzJdXHJcbiAgICAgIHRhcmdldE9iamVjdFtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZVxyXG4gICAgICBicmVha1xyXG4gIH1cclxuICByZXR1cm4gdGFyZ2V0T2JqZWN0XHJcbn1cclxuIiwiTVZDLlV0aWxzLmlzQXJyYXkgPSBmdW5jdGlvbiBpc0FycmF5KG9iamVjdCkgeyByZXR1cm4gQXJyYXkuaXNBcnJheShvYmplY3QpIH1cclxuTVZDLlV0aWxzLmlzT2JqZWN0ID0gZnVuY3Rpb24gaXNPYmplY3Qob2JqZWN0KSB7XHJcbiAgcmV0dXJuICghQXJyYXkuaXNBcnJheShvYmplY3QpKVxyXG4gICAgPyB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0J1xyXG4gICAgOiBmYWxzZVxyXG59XHJcbk1WQy5VdGlscy5pc0VxdWFsVHlwZSA9IGZ1bmN0aW9uIGlzRXF1YWxUeXBlKHZhbHVlQSwgdmFsdWVCKSB7IHJldHVybiB2YWx1ZUEgPT09IHZhbHVlQiB9XHJcbk1WQy5VdGlscy5pc0hUTUxFbGVtZW50ID0gZnVuY3Rpb24gaXNIVE1MRWxlbWVudChvYmplY3QpIHtcclxuICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcclxufVxyXG4iLCJNVkMuVXRpbHMub2JqZWN0UXVlcnkgPSBmdW5jdGlvbiBvYmplY3RRdWVyeShcclxuICBzdHJpbmcsXHJcbiAgY29udGV4dFxyXG4pIHtcclxuICBsZXQgc3RyaW5nRGF0YSA9IE1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZU5vdGF0aW9uKHN0cmluZylcclxuICBpZihzdHJpbmdEYXRhWzBdID09PSAnQCcpIHN0cmluZ0RhdGEuc3BsaWNlKDAsIDEpXHJcbiAgaWYoIXN0cmluZ0RhdGEubGVuZ3RoKSByZXR1cm4gY29udGV4dFxyXG4gIGNvbnRleHQgPSAoTVZDLlV0aWxzLmlzT2JqZWN0KGNvbnRleHQpKVxyXG4gICAgPyBPYmplY3QuZW50cmllcyhjb250ZXh0KVxyXG4gICAgOiBjb250ZXh0XHJcbiAgcmV0dXJuIHN0cmluZ0RhdGEucmVkdWNlKChvYmplY3QsIGZyYWdtZW50LCBmcmFnbWVudEluZGV4LCBmcmFnbWVudHMpID0+IHtcclxuICAgIGxldCBwcm9wZXJ0aWVzID0gW11cclxuICAgIGZyYWdtZW50ID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlRnJhZ21lbnQoZnJhZ21lbnQpXHJcbiAgICBmb3IobGV0IFtwcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV0gb2Ygb2JqZWN0KSB7XHJcbiAgICAgIGlmKHByb3BlcnR5S2V5Lm1hdGNoKGZyYWdtZW50KSkge1xyXG4gICAgICAgIGlmKGZyYWdtZW50SW5kZXggPT09IGZyYWdtZW50cy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoW1twcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV1dKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoT2JqZWN0LmVudHJpZXMocHJvcGVydHlWYWx1ZSkpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBvYmplY3QgPSBwcm9wZXJ0aWVzXHJcbiAgICByZXR1cm4gb2JqZWN0XHJcbiAgfSwgY29udGV4dClcclxufVxyXG5NVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VOb3RhdGlvbiA9IGZ1bmN0aW9uIHBhcnNlTm90YXRpb24oc3RyaW5nKSB7XHJcbiAgaWYoXHJcbiAgICBzdHJpbmcuY2hhckF0KDApID09PSAnWycgJiZcclxuICAgIHN0cmluZy5jaGFyQXQoc3RyaW5nLmxlbmd0aCAtIDEpID09ICddJ1xyXG4gICkge1xyXG4gICAgc3RyaW5nID0gc3RyaW5nXHJcbiAgICAgIC5zbGljZSgxLCAtMSlcclxuICAgICAgLnNwbGl0KCddWycpXHJcbiAgfSBlbHNlIHtcclxuICAgIHN0cmluZyA9IHN0cmluZ1xyXG4gICAgICAuc3BsaXQoJy4nKVxyXG4gIH1cclxuICByZXR1cm4gc3RyaW5nXHJcbn1cclxuTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlRnJhZ21lbnQgPSBmdW5jdGlvbiBwYXJzZUZyYWdtZW50KGZyYWdtZW50KSB7XHJcbiAgaWYoXHJcbiAgICBmcmFnbWVudC5jaGFyQXQoMCkgPT09ICcvJyAmJlxyXG4gICAgZnJhZ21lbnQuY2hhckF0KGZyYWdtZW50Lmxlbmd0aCAtIDEpID09ICcvJ1xyXG4gICkge1xyXG4gICAgZnJhZ21lbnQgPSBmcmFnbWVudC5zbGljZSgxLCAtMSlcclxuICAgIGZyYWdtZW50ID0gbmV3IFJlZ0V4cCgnXicuY29uY2F0KGZyYWdtZW50LCAnJCcpKVxyXG4gIH1cclxuICByZXR1cm4gZnJhZ21lbnRcclxufVxyXG4iLCJNVkMuVXRpbHMucGFyYW1zVG9PYmplY3QgPSBmdW5jdGlvbiBwYXJhbXNUb09iamVjdChwYXJhbXMpIHtcclxuICAgIHZhciBwYXJhbXMgPSBwYXJhbXMuc3BsaXQoJyYnKVxyXG4gICAgdmFyIG9iamVjdCA9IHt9XHJcbiAgICBwYXJhbXMuZm9yRWFjaCgocGFyYW1EYXRhKSA9PiB7XHJcbiAgICAgIHBhcmFtRGF0YSA9IHBhcmFtRGF0YS5zcGxpdCgnPScpXHJcbiAgICAgIG9iamVjdFtwYXJhbURhdGFbMF1dID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcmFtRGF0YVsxXSB8fCAnJylcclxuICAgIH0pXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmplY3QpKVxyXG59XHJcbiIsIk1WQy5VdGlscy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzID0gZnVuY3Rpb24gdG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyhcclxuICB0b2dnbGVNZXRob2QsXHJcbiAgZXZlbnRzLFxyXG4gIHRhcmdldE9iamVjdHMsXHJcbiAgY2FsbGJhY2tzXHJcbikge1xyXG4gIGZvcihsZXQgW2V2ZW50U2V0dGluZ3MsIGV2ZW50Q2FsbGJhY2tOYW1lXSBvZiBPYmplY3QuZW50cmllcyhldmVudHMpKSB7XHJcbiAgICBsZXQgZXZlbnREYXRhID0gZXZlbnRTZXR0aW5ncy5zcGxpdCgnICcpXHJcbiAgICBsZXQgZXZlbnRUYXJnZXRTZXR0aW5ncyA9IGV2ZW50RGF0YVswXVxyXG4gICAgbGV0IGV2ZW50TmFtZSA9IGV2ZW50RGF0YVsxXVxyXG4gICAgbGV0IGV2ZW50VGFyZ2V0cyA9IE1WQy5VdGlscy5vYmplY3RRdWVyeShcclxuICAgICAgZXZlbnRUYXJnZXRTZXR0aW5ncyxcclxuICAgICAgdGFyZ2V0T2JqZWN0c1xyXG4gICAgKVxyXG4gICAgZXZlbnRUYXJnZXRzID0gKCFNVkMuVXRpbHMuaXNBcnJheShldmVudFRhcmdldHMpKVxyXG4gICAgICA/IFtbJ0AnLCBldmVudFRhcmdldHNdXVxyXG4gICAgICA6IGV2ZW50VGFyZ2V0c1xyXG4gICAgZm9yKGxldCBbZXZlbnRUYXJnZXROYW1lLCBldmVudFRhcmdldF0gb2YgZXZlbnRUYXJnZXRzKSB7XHJcbiAgICAgIGxldCBldmVudE1ldGhvZE5hbWUgPSAodG9nZ2xlTWV0aG9kID09PSAnb24nKVxyXG4gICAgICA/IChcclxuICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0IHx8XHJcbiAgICAgICAgKFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBEb2N1bWVudFxyXG4gICAgICAgIClcclxuICAgICAgKSA/ICdhZGRFdmVudExpc3RlbmVyJ1xyXG4gICAgICAgIDogJ29uJ1xyXG4gICAgICA6IChcclxuICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0IHx8XHJcbiAgICAgICAgKFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBEb2N1bWVudFxyXG4gICAgICAgIClcclxuICAgICAgKSA/ICdyZW1vdmVFdmVudExpc3RlbmVyJ1xyXG4gICAgICAgIDogJ29mZidcclxuICAgICAgbGV0IGV2ZW50Q2FsbGJhY2sgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkoXHJcbiAgICAgICAgZXZlbnRDYWxsYmFja05hbWUsXHJcbiAgICAgICAgY2FsbGJhY2tzXHJcbiAgICAgIClbMF1bMV1cclxuICAgICAgaWYoZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xyXG4gICAgICAgIGZvcihsZXQgX2V2ZW50VGFyZ2V0IG9mIGV2ZW50VGFyZ2V0KSB7XHJcbiAgICAgICAgICBfZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYoZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIGV2ZW50VGFyZ2V0W2V2ZW50TWV0aG9kTmFtZV0oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGV2ZW50VGFyZ2V0W2V2ZW50TWV0aG9kTmFtZV0oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbk1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzID0gZnVuY3Rpb24gYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cygpIHtcclxuICB0aGlzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoJ29uJywgLi4uYXJndW1lbnRzKVxyXG59XHJcbk1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIHVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKCkge1xyXG4gIHRoaXMudG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cygnb2ZmJywgLi4uYXJndW1lbnRzKVxyXG59XHJcbiIsIk1WQy5VdGlscy50eXBlT2YgPSAgZnVuY3Rpb24gdHlwZU9mKGRhdGEpIHtcclxuICBzd2l0Y2godHlwZW9mIGRhdGEpIHtcclxuICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgIGxldCBfb2JqZWN0XHJcbiAgICAgIGlmKE1WQy5VdGlscy5pc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgLy8gQXJyYXlcclxuICAgICAgICByZXR1cm4gJ2FycmF5J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgTVZDLlV0aWxzLmlzT2JqZWN0KGRhdGEpXHJcbiAgICAgICkge1xyXG4gICAgICAgIC8vIE9iamVjdFxyXG4gICAgICAgIHJldHVybiAnb2JqZWN0J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgZGF0YSA9PT0gbnVsbFxyXG4gICAgICApIHtcclxuICAgICAgICAvLyBOdWxsXHJcbiAgICAgICAgcmV0dXJuICdudWxsJ1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBfb2JqZWN0XHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgY2FzZSAnbnVtYmVyJzpcclxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgcmV0dXJuIHR5cGVvZiBkYXRhXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5VdGlscy52YWxpZGF0ZURhdGFTY2hlbWEgPSBmdW5jdGlvbiB2YWxpZGF0ZURhdGFTY2hlbWEoZGF0YSwgc2NoZW1hKSB7XHJcbiAgaWYoc2NoZW1hKSB7XHJcbiAgICBzd2l0Y2goTVZDLlV0aWxzLnR5cGVPZihkYXRhKSkge1xyXG4gICAgICBjYXNlICdhcnJheSc6XHJcbiAgICAgICAgbGV0IGFycmF5ID0gW11cclxuICAgICAgICBzY2hlbWEgPSAoTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgPyBzY2hlbWEoKVxyXG4gICAgICAgICAgOiBzY2hlbWFcclxuICAgICAgICBpZihcclxuICAgICAgICAgIE1WQy5VdGlscy5pc0VxdWFsVHlwZShcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpLFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKGFycmF5KVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coc2NoZW1hLm5hbWUpXHJcbiAgICAgICAgICBmb3IobGV0IFthcnJheUtleSwgYXJyYXlWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGF0YSkpIHtcclxuICAgICAgICAgICAgYXJyYXkucHVzaChcclxuICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlRGF0YVNjaGVtYShhcnJheVZhbHVlKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnJheVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHt9XHJcbiAgICAgICAgc2NoZW1hID0gKE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgID8gc2NoZW1hKClcclxuICAgICAgICAgIDogc2NoZW1hXHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBNVkMuVXRpbHMuaXNFcXVhbFR5cGUoXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSxcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihvYmplY3QpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhzY2hlbWEubmFtZSlcclxuICAgICAgICAgIGZvcihsZXQgW29iamVjdEtleSwgb2JqZWN0VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XHJcbiAgICAgICAgICAgIG9iamVjdFtvYmplY3RLZXldID0gdGhpcy52YWxpZGF0ZURhdGFTY2hlbWEob2JqZWN0VmFsdWUsIHNjaGVtYVtvYmplY3RLZXldKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JqZWN0XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnc3RyaW5nJzpcclxuICAgICAgY2FzZSAnbnVtYmVyJzpcclxuICAgICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICAgICAgc2NoZW1hID0gKE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgID8gc2NoZW1hKClcclxuICAgICAgICAgIDogc2NoZW1hXHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBNVkMuVXRpbHMuaXNFcXVhbFR5cGUoXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSxcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihkYXRhKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coc2NoZW1hLm5hbWUpXHJcbiAgICAgICAgICByZXR1cm4gZGF0YVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aHJvdyBNVkMuVE1QTFxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdudWxsJzpcclxuICAgICAgICBpZihcclxuICAgICAgICAgIE1WQy5VdGlscy5pc0VxdWFsVHlwZShcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpLFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKGRhdGEpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICByZXR1cm4gZGF0YVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxyXG4gICAgICAgIHRocm93IE1WQy5UTVBMXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxyXG4gICAgICAgIHRocm93IE1WQy5UTVBMXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgTVZDLlRNUExcclxuICB9XHJcbn1cclxuIiwiTVZDLkNoYW5uZWxzID0gY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2NoYW5uZWxzKCkge1xyXG4gICAgdGhpcy5jaGFubmVscyA9ICh0aGlzLmNoYW5uZWxzKVxyXG4gICAgICA/IHRoaXMuY2hhbm5lbHNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbHNcclxuICB9XHJcbiAgY2hhbm5lbChjaGFubmVsTmFtZSkge1xyXG4gICAgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdID0gKHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXSlcclxuICAgICAgPyB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICAgICAgOiBuZXcgTVZDLkNoYW5uZWxzLkNoYW5uZWwoKVxyXG4gICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxuICBvZmYoY2hhbm5lbE5hbWUpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbn1cclxuIiwiTVZDLkNoYW5uZWxzLkNoYW5uZWwgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfcmVzcG9uc2VzKCkge1xyXG4gICAgdGhpcy5yZXNwb25zZXMgPSAodGhpcy5yZXNwb25zZXMpXHJcbiAgICAgID8gdGhpcy5yZXNwb25zZXNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMucmVzcG9uc2VzXHJcbiAgfVxyXG4gIHJlc3BvbnNlKHJlc3BvbnNlTmFtZSwgcmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgaWYocmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgICB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSA9IHJlc3BvbnNlQ2FsbGJhY2tcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VdXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlcXVlc3QocmVzcG9uc2VOYW1lLCByZXF1ZXN0RGF0YSkge1xyXG4gICAgaWYodGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0pIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKHJlcXVlc3REYXRhKVxyXG4gICAgfVxyXG4gIH1cclxuICBvZmYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZihyZXNwb25zZU5hbWUpIHtcclxuICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmb3IobGV0IFtyZXNwb25zZU5hbWVdIG9mIE9iamVjdC5rZXlzKHRoaXMuX3Jlc3BvbnNlcykpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJNVkMuQmFzZSA9IGNsYXNzIGV4dGVuZHMgTVZDLkV2ZW50cyB7XHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MsIGNvbmZpZ3VyYXRpb24pIHtcclxuICAgIHN1cGVyKClcclxuICAgIGlmKGNvbmZpZ3VyYXRpb24pIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uXHJcbiAgICBpZihzZXR0aW5ncykgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gIH1cclxuICBnZXQgX2NvbmZpZ3VyYXRpb24oKSB7XHJcbiAgICB0aGlzLmNvbmZpZ3VyYXRpb24gPSAodGhpcy5jb25maWd1cmF0aW9uKVxyXG4gICAgICA/IHRoaXMuY29uZmlndXJhdGlvblxyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uXHJcbiAgfVxyXG4gIHNldCBfY29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSB7IHRoaXMuY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb24gfVxyXG4gIGdldCBfc2V0dGluZ3MoKSB7XHJcbiAgICB0aGlzLnNldHRpbmdzID0gKHRoaXMuc2V0dGluZ3MpXHJcbiAgICAgID8gdGhpcy5zZXR0aW5nc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5nc1xyXG4gIH1cclxuICBzZXQgX3NldHRpbmdzKHNldHRpbmdzKSB7XHJcbiAgICB0aGlzLnNldHRpbmdzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcclxuICAgICAgc2V0dGluZ3MsIHRoaXMuX3NldHRpbmdzXHJcbiAgICApXHJcbiAgfVxyXG4gIGdldCBfZW1pdHRlcnMoKSB7XHJcbiAgICB0aGlzLmVtaXR0ZXJzID0gKHRoaXMuZW1pdHRlcnMpXHJcbiAgICAgID8gdGhpcy5lbWl0dGVyc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyc1xyXG4gIH1cclxuICBzZXQgX2VtaXR0ZXJzKGVtaXR0ZXJzKSB7XHJcbiAgICB0aGlzLmVtaXR0ZXJzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcclxuICAgICAgZW1pdHRlcnMsIHRoaXMuX2VtaXR0ZXJzXHJcbiAgICApXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5TZXJ2aWNlID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5kZWZhdWx0cyB8fCB7XG4gICAgY29udGVudFR5cGU6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSxcbiAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgfSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlcygpIHsgcmV0dXJuIFsnJywgJ2FycmF5YnVmZmVyJywgJ2Jsb2InLCAnZG9jdW1lbnQnLCAnanNvbicsICd0ZXh0J10gfVxuICBnZXQgX3Jlc3BvbnNlVHlwZSgpIHsgcmV0dXJuIHRoaXMucmVzcG9uc2VUeXBlIH1cbiAgc2V0IF9yZXNwb25zZVR5cGUocmVzcG9uc2VUeXBlKSB7XG4gICAgdGhpcy5feGhyLnJlc3BvbnNlVHlwZSA9IHRoaXMuX3Jlc3BvbnNlVHlwZXMuZmluZChcbiAgICAgIChyZXNwb25zZVR5cGVJdGVtKSA9PiByZXNwb25zZVR5cGVJdGVtID09PSByZXNwb25zZVR5cGVcbiAgICApIHx8IHRoaXMuX2RlZmF1bHRzLnJlc3BvbnNlVHlwZVxuICB9XG4gIGdldCBfdHlwZSgpIHsgcmV0dXJuIHRoaXMudHlwZSB9XG4gIHNldCBfdHlwZSh0eXBlKSB7IHRoaXMudHlwZSA9IHR5cGUgfVxuICBnZXQgX3VybCgpIHsgcmV0dXJuIHRoaXMudXJsIH1cbiAgc2V0IF91cmwodXJsKSB7IHRoaXMudXJsID0gdXJsIH1cbiAgZ2V0IF9oZWFkZXJzKCkgeyByZXR1cm4gdGhpcy5oZWFkZXJzIHx8IFtdIH1cbiAgc2V0IF9oZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLl9oZWFkZXJzLmxlbmd0aCA9IDBcbiAgICBoZWFkZXJzLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgdGhpcy5faGVhZGVycy5wdXNoKGhlYWRlcilcbiAgICAgIGhlYWRlciA9IE9iamVjdC5lbnRyaWVzKGhlYWRlcilbMF1cbiAgICAgIHRoaXMuX3hoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgIH0pXG4gIH1cbiAgZ2V0IF9kYXRhKCkgeyByZXR1cm4gdGhpcy5kYXRhIH1cbiAgc2V0IF9kYXRhKGRhdGEpIHsgdGhpcy5kYXRhID0gZGF0YSB9XG4gIGdldCBfeGhyKCkge1xuICAgIHRoaXMueGhyID0gKHRoaXMueGhyKVxuICAgICAgPyB0aGlzLnhoclxuICAgICAgOiBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHJldHVybiB0aGlzLnhoclxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICByZXF1ZXN0KGRhdGEpIHtcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLmRhdGEgfHwgbnVsbFxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZih0aGlzLl94aHIuc3RhdHVzID09PSAyMDApIHRoaXMuX3hoci5hYm9ydCgpXG4gICAgICB0aGlzLl94aHIub3Blbih0aGlzLnR5cGUsIHRoaXMudXJsKVxuICAgICAgdGhpcy5faGVhZGVycyA9IHRoaXMuc2V0dGluZ3MuaGVhZGVycyB8fCBbdGhpcy5fZGVmYXVsdHMuY29udGVudFR5cGVdXG4gICAgICB0aGlzLl94aHIub25sb2FkID0gcmVzb2x2ZVxuICAgICAgdGhpcy5feGhyLm9uZXJyb3IgPSByZWplY3RcbiAgICAgIHRoaXMuX3hoci5zZW5kKGRhdGEpXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgneGhyOnJlc29sdmUnLCB7XG4gICAgICAgIG5hbWU6ICd4aHI6cmVzb2x2ZScsXG4gICAgICAgIGRhdGE6IHJlc3BvbnNlLmN1cnJlbnRUYXJnZXQsXG4gICAgICB9KVxuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgIXRoaXMuZW5hYmxlZCAmJlxuICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgaWYoc2V0dGluZ3MudHlwZSkgdGhpcy5fdHlwZSA9IHNldHRpbmdzLnR5cGVcbiAgICAgIGlmKHNldHRpbmdzLnVybCkgdGhpcy5fdXJsID0gc2V0dGluZ3MudXJsXG4gICAgICBpZihzZXR0aW5ncy5kYXRhKSB0aGlzLl9kYXRhID0gc2V0dGluZ3MuZGF0YSB8fCBudWxsXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnJlc3BvbnNlVHlwZSkgdGhpcy5fcmVzcG9uc2VUeXBlID0gdGhpcy5fc2V0dGluZ3MucmVzcG9uc2VUeXBlXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgdGhpcy5lbmFibGVkICYmXG4gICAgICBPYmplY3Qua2V5cyhzZXR0aW5ncykubGVuZ3RoXG4gICAgKSB7XG4gICAgICBkZWxldGUgdGhpcy5fdHlwZVxuICAgICAgZGVsZXRlIHRoaXMuX3VybFxuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFcbiAgICAgIGRlbGV0ZSB0aGlzLl9oZWFkZXJzXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VUeXBlXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuIiwiTVZDLk1vZGVsID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgX2lzU2V0dGluZygpIHsgcmV0dXJuIHRoaXMuaXNTZXR0aW5nIH1cbiAgc2V0IF9pc1NldHRpbmcoaXNTZXR0aW5nKSB7IHRoaXMuaXNTZXR0aW5nID0gaXNTZXR0aW5nIH1cbiAgZ2V0IF9sb2NhbFN0b3JhZ2UoKSB7IHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZSB9XG4gIHNldCBfbG9jYWxTdG9yYWdlKGxvY2FsU3RvcmFnZSkgeyB0aGlzLmxvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XG4gIGdldCBfZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLmRlZmF1bHRzIH1cbiAgc2V0IF9kZWZhdWx0cyhkZWZhdWx0cykgeyB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHMgfVxuICBnZXQgX3NjaGVtYSgpIHsgcmV0dXJuIHRoaXMuX3NjaGVtYSB9XG4gIHNldCBfc2NoZW1hKHNjaGVtYSkgeyB0aGlzLnNjaGVtYSA9IHNjaGVtYSB9XG4gIGdldCBfaGlzdGlvZ3JhbSgpIHsgcmV0dXJuIHRoaXMuaGlzdGlvZ3JhbSB8fCB7XG4gICAgbGVuZ3RoOiAxXG4gIH0gfVxuICBzZXQgX2hpc3Rpb2dyYW0oaGlzdGlvZ3JhbSkge1xuICAgIHRoaXMuaGlzdGlvZ3JhbSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB0aGlzLl9oaXN0aW9ncmFtLFxuICAgICAgaGlzdGlvZ3JhbVxuICAgIClcbiAgfVxuICBnZXQgX2hpc3RvcnkoKSB7XG4gICAgdGhpcy5oaXN0b3J5ID0gKHRoaXMuaGlzdG9yeSlcbiAgICAgID8gdGhpcy5oaXN0b3J5XG4gICAgICA6IFtdXG4gICAgcmV0dXJuIHRoaXMuaGlzdG9yeVxuICB9XG4gIHNldCBfaGlzdG9yeShkYXRhKSB7XG4gICAgaWYoXG4gICAgICBPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGlmKHRoaXMuX2hpc3Rpb2dyYW0ubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudW5zaGlmdCh0aGlzLnBhcnNlKGRhdGEpKVxuICAgICAgICB0aGlzLl9oaXN0b3J5LnNwbGljZSh0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aClcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IF9kYigpIHtcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludClcbiAgICB0aGlzLmRiID0gKGRiKVxuICAgICAgPyBkYlxuICAgICAgOiAne30nXG4gICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5kYilcbiAgfVxuICBzZXQgX2RiKGRiKSB7XG4gICAgZGIgPSBKU09OLnN0cmluZ2lmeShkYilcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCwgZGIpXG4gIH1cbiAgZ2V0IF9kYXRhKCkge1xuICAgIHRoaXMuZGF0YSA9ICAodGhpcy5kYXRhKVxuICAgICAgPyB0aGlzLmRhdGFcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5kYXRhXG4gIH1cbiAgZ2V0IF9kYXRhRXZlbnRzKCkge1xuICAgIHRoaXMuZGF0YUV2ZW50cyA9ICh0aGlzLmRhdGFFdmVudHMpXG4gICAgICA/IHRoaXMuZGF0YUV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmRhdGFFdmVudHNcbiAgfVxuICBzZXQgX2RhdGFFdmVudHMoZGF0YUV2ZW50cykge1xuICAgIHRoaXMuZGF0YUV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBkYXRhRXZlbnRzLCB0aGlzLl9kYXRhRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfZGF0YUNhbGxiYWNrcygpIHtcbiAgICB0aGlzLmRhdGFDYWxsYmFja3MgPSAodGhpcy5kYXRhQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLmRhdGFDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5kYXRhQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9kYXRhQ2FsbGJhY2tzKGRhdGFDYWxsYmFja3MpIHtcbiAgICB0aGlzLmRhdGFDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgZGF0YUNhbGxiYWNrcywgdGhpcy5fZGF0YUNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX3NlcnZpY2VzKCkge1xuICAgIHRoaXMuc2VydmljZXMgPSAgKHRoaXMuc2VydmljZXMpXG4gICAgICA/IHRoaXMuc2VydmljZXNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5zZXJ2aWNlc1xuICB9XG4gIHNldCBfc2VydmljZXMoc2VydmljZXMpIHtcbiAgICB0aGlzLnNlcnZpY2VzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHNlcnZpY2VzLCB0aGlzLl9zZXJ2aWNlc1xuICAgIClcbiAgfVxuICBnZXQgX3NlcnZpY2VFdmVudHMoKSB7XG4gICAgdGhpcy5zZXJ2aWNlRXZlbnRzID0gKHRoaXMuc2VydmljZUV2ZW50cylcbiAgICAgID8gdGhpcy5zZXJ2aWNlRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZUV2ZW50c1xuICB9XG4gIHNldCBfc2VydmljZUV2ZW50cyhzZXJ2aWNlRXZlbnRzKSB7XG4gICAgdGhpcy5zZXJ2aWNlRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHNlcnZpY2VFdmVudHMsIHRoaXMuX3NlcnZpY2VFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9zZXJ2aWNlQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuc2VydmljZUNhbGxiYWNrcyA9ICh0aGlzLnNlcnZpY2VDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnNlcnZpY2VDYWxsYmFja3NcbiAgfVxuICBzZXQgX3NlcnZpY2VDYWxsYmFja3Moc2VydmljZUNhbGxiYWNrcykge1xuICAgIHRoaXMuc2VydmljZUNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBzZXJ2aWNlQ2FsbGJhY2tzLCB0aGlzLl9zZXJ2aWNlQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICBlbmFibGVTZXJ2aWNlRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuc2VydmljZUV2ZW50cywgdGhpcy5zZXJ2aWNlcywgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVTZXJ2aWNlRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyh0aGlzLnNlcnZpY2VFdmVudHMsIHRoaXMuc2VydmljZXMsIHRoaXMuc2VydmljZUNhbGxiYWNrcylcbiAgfVxuICBlbmFibGVEYXRhRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuZGF0YUV2ZW50cywgdGhpcywgdGhpcy5kYXRhQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVEYXRhRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyh0aGlzLmRhdGFFdmVudHMsIHRoaXMsIHRoaXMuZGF0YUNhbGxiYWNrcylcbiAgfVxuICBzZXREZWZhdWx0cygpIHtcbiAgICBsZXQgX2RlZmF1bHRzID0ge31cbiAgICBpZih0aGlzLmRlZmF1bHRzKSBPYmplY3QuYXNzaWduKF9kZWZhdWx0cywgdGhpcy5kZWZhdWx0cylcbiAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgT2JqZWN0LmFzc2lnbihfZGVmYXVsdHMsIHRoaXMuX2RiKVxuICAgIGlmKE9iamVjdC5rZXlzKF9kZWZhdWx0cykpIHRoaXMuc2V0KF9kZWZhdWx0cylcbiAgfVxuICBnZXQoKSB7XG4gICAgbGV0IHByb3BlcnR5ID0gYXJndW1lbnRzWzBdXG4gICAgcmV0dXJuIHRoaXMuX2RhdGFbJ18nLmNvbmNhdChwcm9wZXJ0eSldXG4gIH1cbiAgc2V0KCkge1xuICAgIHRoaXMuX2hpc3RvcnkgPSB0aGlzLnBhcnNlKClcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICB0aGlzLl9pc1NldHRpbmcgPSB0cnVlXG4gICAgICAgIGxldCBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBpZihpbmRleCA9PT0gKF9hcmd1bWVudHMubGVuZ3RoIC0gMSkpIHRoaXMuX2lzU2V0dGluZyA9IGZhbHNlXG4gICAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSlcbiAgICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy5zZXREQihrZXksIHZhbHVlKVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICB2YXIga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHZhciB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy5zZXREQihrZXksIHZhbHVlKVxuICAgICAgICBicmVha1xuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0KCkge1xuICAgIHRoaXMuX2hpc3RvcnkgPSB0aGlzLnBhcnNlKClcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyh0aGlzLl9kYXRhKSkge1xuICAgICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0REIoKSB7XG4gICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICB2YXIgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBsZXQgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgZGJba2V5XSA9IHZhbHVlXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHRoaXMuX2RiID0gZGJcbiAgfVxuICB1bnNldERCKCkge1xuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9kYlxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGRlbGV0ZSBkYltrZXldXG4gICAgICAgIHRoaXMuX2RiID0gZGJcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpIHtcbiAgICBpZighdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldKSB7XG4gICAgICBsZXQgY29udGV4dCA9IHRoaXNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgICAgICB0aGlzLl9kYXRhLFxuICAgICAgICB7XG4gICAgICAgICAgWydfJy5jb25jYXQoa2V5KV06IHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNba2V5XSB9LFxuICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgIGxldCBzZXRWYWx1ZUV2ZW50TmFtZSA9IFsnc2V0JywgJzonLCBrZXldLmpvaW4oJycpXG4gICAgICAgICAgICAgIGxldCBzZXRFdmVudE5hbWUgPSAnc2V0J1xuICAgICAgICAgICAgICBpZighY29udGV4dC5faXNTZXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgICAgc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgICAgc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKVxuICAgIH1cbiAgICB0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV0gPSB2YWx1ZVxuICB9XG4gIHVuc2V0RGF0YVByb3BlcnR5KGtleSkge1xuICAgIGxldCB1bnNldFZhbHVlRXZlbnROYW1lID0gWyd1bnNldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgIGxldCB1bnNldEV2ZW50TmFtZSA9ICd1bnNldCdcbiAgICBsZXQgdW5zZXRWYWx1ZSA9IHRoaXMuX2RhdGFba2V5XVxuICAgIGRlbGV0ZSB0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV1cbiAgICBkZWxldGUgdGhpcy5fZGF0YVtrZXldXG4gICAgdGhpcy5lbWl0KFxuICAgICAgdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiB1bnNldFZhbHVlLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgKVxuICAgIHRoaXMuZW1pdChcbiAgICAgIHVuc2V0RXZlbnROYW1lLFxuICAgICAge1xuICAgICAgICBuYW1lOiB1bnNldEV2ZW50TmFtZSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiB1bnNldFZhbHVlLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgKVxuICB9XG4gIHBhcnNlKGRhdGEpIHtcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLl9kYXRhXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoT2JqZWN0LmFzc2lnbih7fSwgZGF0YSkpKVxuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5sb2NhbFN0b3JhZ2UpIHRoaXMuX2xvY2FsU3RvcmFnZSA9IHRoaXMuc2V0dGluZ3MubG9jYWxTdG9yYWdlXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmhpc3Rpb2dyYW0pIHRoaXMuX2hpc3Rpb2dyYW0gPSB0aGlzLnNldHRpbmdzLmhpc3Rpb2dyYW1cbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZW1pdHRlcnMpIHRoaXMuX2VtaXR0ZXJzID0gdGhpcy5zZXR0aW5ncy5lbWl0dGVyc1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5zZXJ2aWNlcykgdGhpcy5fc2VydmljZXMgPSB0aGlzLnNldHRpbmdzLnNlcnZpY2VzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnNlcnZpY2VDYWxsYmFja3MpIHRoaXMuX3NlcnZpY2VDYWxsYmFja3MgPSB0aGlzLnNldHRpbmdzLnNlcnZpY2VDYWxsYmFja3NcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3Muc2VydmljZUV2ZW50cykgdGhpcy5fc2VydmljZUV2ZW50cyA9IHRoaXMuc2V0dGluZ3Muc2VydmljZUV2ZW50c1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5kYXRhKSB0aGlzLnNldCh0aGlzLnNldHRpbmdzLmRhdGEpXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRhdGFDYWxsYmFja3MpIHRoaXMuX2RhdGFDYWxsYmFja3MgPSB0aGlzLnNldHRpbmdzLmRhdGFDYWxsYmFja3NcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGF0YUV2ZW50cykgdGhpcy5fZGF0YUV2ZW50cyA9IHRoaXMuc2V0dGluZ3MuZGF0YUV2ZW50c1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5zY2hlbWEpIHRoaXMuX3NjaGVtYSA9IHRoaXMuc2V0dGluZ3Muc2NoZW1hXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRlZmF1bHRzKSB0aGlzLl9kZWZhdWx0cyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHNcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnNlcnZpY2VzICYmXG4gICAgICAgIHRoaXMuc2VydmljZUV2ZW50cyAmJlxuICAgICAgICB0aGlzLnNlcnZpY2VDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZVNlcnZpY2VFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuZGF0YUV2ZW50cyAmJlxuICAgICAgICB0aGlzLmRhdGFDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZURhdGFFdmVudHMoKVxuICAgICAgfVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMuc2VydmljZXMgJiZcbiAgICAgICAgdGhpcy5zZXJ2aWNlRXZlbnRzICYmXG4gICAgICAgIHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZVNlcnZpY2VFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuZGF0YUV2ZW50cyAmJlxuICAgICAgICB0aGlzLmRhdGFDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVEYXRhRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSB0aGlzLl9sb2NhbFN0b3JhZ2VcbiAgICAgIGRlbGV0ZSB0aGlzLl9oaXN0aW9ncmFtXG4gICAgICBkZWxldGUgdGhpcy5fc2VydmljZXNcbiAgICAgIGRlbGV0ZSB0aGlzLl9zZXJ2aWNlQ2FsbGJhY2tzXG4gICAgICBkZWxldGUgdGhpcy5fc2VydmljZUV2ZW50c1xuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhQ2FsbGJhY2tzXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YUV2ZW50c1xuICAgICAgZGVsZXRlIHRoaXMuX3NjaGVtYVxuICAgICAgZGVsZXRlIHRoaXMuX2VtaXR0ZXJzXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gIH1cbn1cbiIsIk1WQy5FbWl0dGVyID0gY2xhc3MgZXh0ZW5kcyBNVkMuTW9kZWwge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxyXG4gICAgaWYodGhpcy5zZXR0aW5ncykge1xyXG4gICAgICBpZih0aGlzLnNldHRpbmdzLm5hbWUpIHRoaXMuX25hbWUgPSB0aGlzLnNldHRpbmdzLm5hbWVcclxuICAgIH1cclxuICB9XHJcbiAgZ2V0IF9uYW1lKCkgeyByZXR1cm4gdGhpcy5uYW1lIH1cclxuICBzZXQgX25hbWUobmFtZSkgeyB0aGlzLm5hbWUgPSBuYW1lIH1cclxuICBlbWlzc2lvbigpIHtcclxuICAgIGxldCBldmVudERhdGEgPSB7XHJcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcclxuICAgICAgZGF0YTogdGhpcy5kYXRhXHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgIHRoaXMubmFtZSxcclxuICAgICAgZXZlbnREYXRhXHJcbiAgICApXHJcbiAgICByZXR1cm4gZXZlbnREYXRhXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5WaWV3ID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgX2VsZW1lbnROYW1lKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudC50YWdOYW1lIH1cbiAgc2V0IF9lbGVtZW50TmFtZShlbGVtZW50TmFtZSkge1xuICAgIGlmKCF0aGlzLl9lbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50TmFtZSlcbiAgfVxuICBnZXQgX2VsZW1lbnQoKSB7IHJldHVybiB0aGlzLmVsZW1lbnQgfVxuICBzZXQgX2VsZW1lbnQoZWxlbWVudCkge1xuICAgIGlmKFxuICAgICAgZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICBlbGVtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRcbiAgICApIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICB9IGVsc2UgaWYodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQpXG4gICAgfVxuICAgIHRoaXMuZWxlbWVudE9ic2VydmVyLm9ic2VydmUodGhpcy5lbGVtZW50LCB7XG4gICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIH0pXG4gIH1cbiAgZ2V0IF9hdHRyaWJ1dGVzKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudC5hdHRyaWJ1dGVzIH1cbiAgc2V0IF9hdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHtcbiAgICBmb3IobGV0IFthdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKSkge1xuICAgICAgaWYodHlwZW9mIGF0dHJpYnV0ZVZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVLZXkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgX3VpKCkge1xuICAgIHRoaXMudWkgPSAodGhpcy51aSlcbiAgICAgID8gdGhpcy51aVxuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnVpXG4gIH1cbiAgc2V0IF91aSh1aSkge1xuICAgIGlmKCF0aGlzLl91aVsnJGVsZW1lbnQnXSkgdGhpcy5fdWlbJyRlbGVtZW50J10gPSB0aGlzLmVsZW1lbnRcbiAgICBmb3IobGV0IFt1aUtleSwgdWlWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModWkpKSB7XG4gICAgICBpZih0eXBlb2YgdWlWYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fdWlbdWlLZXldID0gdGhpcy5fZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHVpVmFsdWUpXG4gICAgICB9IGVsc2UgaWYoXG4gICAgICAgIHVpVmFsdWUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxuICAgICAgICB1aVZhbHVlIGluc3RhbmNlb2YgRG9jdW1lbnRcbiAgICAgICkge1xuICAgICAgICB0aGlzLl91aVt1aUtleV0gPSB1aVZhbHVlXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfdWlFdmVudHMoKSB7IHJldHVybiB0aGlzLnVpRXZlbnRzIH1cbiAgc2V0IF91aUV2ZW50cyh1aUV2ZW50cykgeyB0aGlzLnVpRXZlbnRzID0gdWlFdmVudHMgfVxuICBnZXQgX3VpQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMudWlDYWxsYmFja3MgPSAodGhpcy51aUNhbGxiYWNrcylcbiAgICAgID8gdGhpcy51aUNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnVpQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF91aUNhbGxiYWNrcyh1aUNhbGxiYWNrcykge1xuICAgIHRoaXMudWlDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdWlDYWxsYmFja3MsIHRoaXMuX3VpQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfb2JzZXJ2ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5vYnNlcnZlckNhbGxiYWNrcyA9ICh0aGlzLm9ic2VydmVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX29ic2VydmVyQ2FsbGJhY2tzKG9ic2VydmVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5vYnNlcnZlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBvYnNlcnZlckNhbGxiYWNrcywgdGhpcy5fb2JzZXJ2ZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IGVsZW1lbnRPYnNlcnZlcigpIHtcbiAgICB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgPSAodGhpcy5fZWxlbWVudE9ic2VydmVyKVxuICAgICAgPyB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgICAgIDogbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5lbGVtZW50T2JzZXJ2ZS5iaW5kKHRoaXMpKVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgfVxuICBnZXQgX2luc2VydCgpIHsgcmV0dXJuIHRoaXMuaW5zZXJ0IH1cbiAgc2V0IF9pbnNlcnQoaW5zZXJ0KSB7IHRoaXMuaW5zZXJ0ID0gaW5zZXJ0IH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGdldCBfdGVtcGxhdGVzKCkge1xuICAgIHRoaXMudGVtcGxhdGVzID0gKHRoaXMudGVtcGxhdGVzKVxuICAgICAgPyB0aGlzLnRlbXBsYXRlc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnRlbXBsYXRlc1xuICB9XG4gIHNldCBfdGVtcGxhdGVzKHRlbXBsYXRlcykge1xuICAgIHRoaXMudGVtcGxhdGVzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHRlbXBsYXRlcywgdGhpcy5fdGVtcGxhdGVzXG4gICAgKVxuICB9XG4gIGVsZW1lbnRPYnNlcnZlKG11dGF0aW9uUmVjb3JkTGlzdCwgb2JzZXJ2ZXIpIHtcbiAgICBmb3IobGV0IFttdXRhdGlvblJlY29yZEluZGV4LCBtdXRhdGlvblJlY29yZF0gb2YgT2JqZWN0LmVudHJpZXMobXV0YXRpb25SZWNvcmRMaXN0KSkge1xuICAgICAgc3dpdGNoKG11dGF0aW9uUmVjb3JkLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnY2hpbGRMaXN0JzpcbiAgICAgICAgICBsZXQgbXV0YXRpb25SZWNvcmRDYXRlZ29yaWVzID0gWydhZGRlZE5vZGVzJywgJ3JlbW92ZWROb2RlcyddXG4gICAgICAgICAgZm9yKGxldCBtdXRhdGlvblJlY29yZENhdGVnb3J5IG9mIG11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcykge1xuICAgICAgICAgICAgaWYobXV0YXRpb25SZWNvcmRbbXV0YXRpb25SZWNvcmRDYXRlZ29yeV0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHRoaXMucmVzZXRVSSgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGF1dG9JbnNlcnQoKSB7XG4gICAgaWYodGhpcy5pbnNlcnQpIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5pbnNlcnQuZWxlbWVudClcbiAgICAgIC5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KHRoaXMuaW5zZXJ0Lm1ldGhvZCwgdGhpcy5lbGVtZW50KVxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgYXV0b1JlbW92ZSgpIHtcbiAgICBpZihcbiAgICAgIHRoaXMuZWxlbWVudCAmJlxuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnRcbiAgICApIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcbiAgfVxuICBlbmFibGVFbGVtZW50KHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzXG4gICAgaWYoc2V0dGluZ3MuZWxlbWVudE5hbWUpIHRoaXMuX2VsZW1lbnROYW1lID0gc2V0dGluZ3MuZWxlbWVudE5hbWVcbiAgICBpZihzZXR0aW5ncy5lbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gc2V0dGluZ3MuZWxlbWVudFxuICAgIGlmKHNldHRpbmdzLmF0dHJpYnV0ZXMpIHRoaXMuX2F0dHJpYnV0ZXMgPSBzZXR0aW5ncy5hdHRyaWJ1dGVzXG4gICAgaWYoc2V0dGluZ3MudGVtcGxhdGVzKSB0aGlzLl90ZW1wbGF0ZXMgPSBzZXR0aW5ncy50ZW1wbGF0ZXNcbiAgICBpZihzZXR0aW5ncy5pbnNlcnQpIHRoaXMuX2luc2VydCA9IHNldHRpbmdzLmluc2VydFxuICB9XG4gIGRpc2FibGVFbGVtZW50KHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICB0aGlzLmVsZW1lbnQgJiZcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50XG4gICAgKSB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpXG4gICAgaWYodGhpcy5lbGVtZW50KSBkZWxldGUgdGhpcy5lbGVtZW50XG4gICAgaWYodGhpcy5hdHRyaWJ1dGVzKSBkZWxldGUgdGhpcy5hdHRyaWJ1dGVzXG4gICAgaWYodGhpcy50ZW1wbGF0ZXMpIGRlbGV0ZSB0aGlzLnRlbXBsYXRlc1xuICAgIGlmKHRoaXMuaW5zZXJ0KSBkZWxldGUgdGhpcy5pbnNlcnRcbiAgfVxuICByZXNldFVJKCkge1xuICAgIHRoaXMuZGlzYWJsZVVJKClcbiAgICB0aGlzLmVuYWJsZVVJKClcbiAgfVxuICBlbmFibGVVSShzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKHNldHRpbmdzLnVpKSB0aGlzLl91aSA9IHNldHRpbmdzLnVpXG4gICAgaWYoc2V0dGluZ3MudWlDYWxsYmFja3MpIHRoaXMuX3VpQ2FsbGJhY2tzID0gc2V0dGluZ3MudWlDYWxsYmFja3NcbiAgICBpZihzZXR0aW5ncy51aUV2ZW50cykge1xuICAgICAgdGhpcy5fdWlFdmVudHMgPSBzZXR0aW5ncy51aUV2ZW50c1xuICAgICAgdGhpcy5lbmFibGVVSUV2ZW50cygpXG4gICAgfVxuICB9XG4gIGRpc2FibGVVSShzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKHNldHRpbmdzLnVpRXZlbnRzKSB7XG4gICAgICB0aGlzLmRpc2FibGVVSUV2ZW50cygpXG4gICAgICBkZWxldGUgdGhpcy5fdWlFdmVudHNcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMudWlFdmVudHNcbiAgICBkZWxldGUgdGhpcy51aVxuICAgIGRlbGV0ZSB0aGlzLnVpQ2FsbGJhY2tzXG4gIH1cbiAgZW5hYmxlVUlFdmVudHMoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLnVpRXZlbnRzICYmXG4gICAgICB0aGlzLnVpICYmXG4gICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgKSB7XG4gICAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyhcbiAgICAgICAgdGhpcy51aUV2ZW50cyxcbiAgICAgICAgdGhpcy51aSxcbiAgICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICAgKVxuICAgIH1cbiAgfVxuICBkaXNhYmxlVUlFdmVudHMoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLnVpRXZlbnRzICYmXG4gICAgICB0aGlzLnVpICYmXG4gICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgKSB7XG4gICAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMoXG4gICAgICAgIHRoaXMudWlFdmVudHMsXG4gICAgICAgIHRoaXMudWksXG4gICAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgZW5hYmxlRW1pdHRlcnMoKSB7XG4gICAgaWYodGhpcy5zZXR0aW5ncy5lbWl0dGVycykgdGhpcy5fZW1pdHRlcnMgPSB0aGlzLnNldHRpbmdzLmVtaXR0ZXJzXG4gIH1cbiAgZGlzYWJsZUVtaXR0ZXJzKCkge1xuICAgIGlmKHRoaXMuX2VtaXR0ZXJzKSBkZWxldGUgdGhpcy5fZW1pdHRlcnNcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLl9lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLmVuYWJsZUVtaXR0ZXJzKClcbiAgICAgIHRoaXMuZW5hYmxlRWxlbWVudChzZXR0aW5ncylcbiAgICAgIHRoaXMuZW5hYmxlVUkoc2V0dGluZ3MpXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgdGhpcy5fZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5kaXNhYmxlVUkoc2V0dGluZ3MpXG4gICAgICB0aGlzLmRpc2FibGVFbGVtZW50KHNldHRpbmdzKVxuICAgICAgdGhpcy5kaXNhYmxlRW1pdHRlcnMoKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgICByZXR1cm4gdGhpc3NcbiAgICB9XG4gIH1cbn1cbiIsIk1WQy5Db250cm9sbGVyID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgX2VtaXR0ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzID0gKHRoaXMuZW1pdHRlckNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlckNhbGxiYWNrc1xuICB9XG4gIHNldCBfZW1pdHRlckNhbGxiYWNrcyhlbWl0dGVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGVtaXR0ZXJDYWxsYmFja3MsIHRoaXMuX2VtaXR0ZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9tb2RlbENhbGxiYWNrcygpIHtcbiAgICB0aGlzLm1vZGVsQ2FsbGJhY2tzID0gKHRoaXMubW9kZWxDYWxsYmFja3MpXG4gICAgICA/IHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5tb2RlbENhbGxiYWNrc1xuICB9XG4gIHNldCBfbW9kZWxDYWxsYmFja3MobW9kZWxDYWxsYmFja3MpIHtcbiAgICB0aGlzLm1vZGVsQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG1vZGVsQ2FsbGJhY2tzLCB0aGlzLl9tb2RlbENhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX3ZpZXdDYWxsYmFja3MoKSB7XG4gICAgdGhpcy52aWV3Q2FsbGJhY2tzID0gKHRoaXMudmlld0NhbGxiYWNrcylcbiAgICAgID8gdGhpcy52aWV3Q2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudmlld0NhbGxiYWNrc1xuICB9XG4gIHNldCBfdmlld0NhbGxiYWNrcyh2aWV3Q2FsbGJhY2tzKSB7XG4gICAgdGhpcy52aWV3Q2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHZpZXdDYWxsYmFja3MsIHRoaXMuX3ZpZXdDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9jb250cm9sbGVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcyA9ICh0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX2NvbnRyb2xsZXJDYWxsYmFja3MoY29udHJvbGxlckNhbGxiYWNrcykge1xuICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBjb250cm9sbGVyQ2FsbGJhY2tzLCB0aGlzLl9jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfbW9kZWxzKCkge1xuICAgIHRoaXMubW9kZWxzID0gKHRoaXMubW9kZWxzKVxuICAgICAgPyB0aGlzLm1vZGVsc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm1vZGVsc1xuICB9XG4gIHNldCBfbW9kZWxzKG1vZGVscykge1xuICAgIHRoaXMubW9kZWxzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG1vZGVscywgdGhpcy5fbW9kZWxzXG4gICAgKVxuICB9XG4gIGdldCBfdmlld3MoKSB7XG4gICAgdGhpcy52aWV3cyA9ICh0aGlzLnZpZXdzKVxuICAgICAgPyB0aGlzLnZpZXdzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudmlld3NcbiAgfVxuICBzZXQgX3ZpZXdzKHZpZXdzKSB7XG4gICAgdGhpcy52aWV3cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB2aWV3cywgdGhpcy5fdmlld3NcbiAgICApXG4gIH1cbiAgZ2V0IF9jb250cm9sbGVycygpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJzID0gKHRoaXMuY29udHJvbGxlcnMpXG4gICAgICA/IHRoaXMuY29udHJvbGxlcnNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyc1xuICB9XG4gIHNldCBfY29udHJvbGxlcnMoY29udHJvbGxlcnMpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGNvbnRyb2xsZXJzLCB0aGlzLl9jb250cm9sbGVyc1xuICAgIClcbiAgfVxuICBnZXQgX3JvdXRlcnMoKSB7XG4gICAgdGhpcy5yb3V0ZXJzID0gKHRoaXMucm91dGVycylcbiAgICAgID8gdGhpcy5yb3V0ZXJzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVyc1xuICB9XG4gIHNldCBfcm91dGVycyhyb3V0ZXJzKSB7XG4gICAgdGhpcy5yb3V0ZXJzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlcnMsIHRoaXMuX3JvdXRlcnNcbiAgICApXG4gIH1cbiAgZ2V0IF9yb3V0ZXJFdmVudHMoKSB7XG4gICAgdGhpcy5yb3V0ZXJFdmVudHMgPSAodGhpcy5yb3V0ZXJFdmVudHMpXG4gICAgICA/IHRoaXMucm91dGVyRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVyRXZlbnRzXG4gIH1cbiAgc2V0IF9yb3V0ZXJFdmVudHMocm91dGVyRXZlbnRzKSB7XG4gICAgdGhpcy5yb3V0ZXJFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgcm91dGVyRXZlbnRzLCB0aGlzLl9yb3V0ZXJFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9yb3V0ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5yb3V0ZXJDYWxsYmFja3MgPSAodGhpcy5yb3V0ZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMucm91dGVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9yb3V0ZXJDYWxsYmFja3Mocm91dGVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5yb3V0ZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgcm91dGVyQ2FsbGJhY2tzLCB0aGlzLl9yb3V0ZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9lbWl0dGVyRXZlbnRzKCkge1xuICAgIHRoaXMuZW1pdHRlckV2ZW50cyA9ICh0aGlzLmVtaXR0ZXJFdmVudHMpXG4gICAgICA/IHRoaXMuZW1pdHRlckV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXJFdmVudHNcbiAgfVxuICBzZXQgX2VtaXR0ZXJFdmVudHMoZW1pdHRlckV2ZW50cykge1xuICAgIHRoaXMuZW1pdHRlckV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBlbWl0dGVyRXZlbnRzLCB0aGlzLl9lbWl0dGVyRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfbW9kZWxFdmVudHMoKSB7XG4gICAgdGhpcy5tb2RlbEV2ZW50cyA9ICh0aGlzLm1vZGVsRXZlbnRzKVxuICAgICAgPyB0aGlzLm1vZGVsRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMubW9kZWxFdmVudHNcbiAgfVxuICBzZXQgX21vZGVsRXZlbnRzKG1vZGVsRXZlbnRzKSB7XG4gICAgdGhpcy5tb2RlbEV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBtb2RlbEV2ZW50cywgdGhpcy5fbW9kZWxFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF92aWV3RXZlbnRzKCkge1xuICAgIHRoaXMudmlld0V2ZW50cyA9ICh0aGlzLnZpZXdFdmVudHMpXG4gICAgICA/IHRoaXMudmlld0V2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnZpZXdFdmVudHNcbiAgfVxuICBzZXQgX3ZpZXdFdmVudHModmlld0V2ZW50cykge1xuICAgIHRoaXMudmlld0V2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB2aWV3RXZlbnRzLCB0aGlzLl92aWV3RXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlckV2ZW50cygpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgPSAodGhpcy5jb250cm9sbGVyRXZlbnRzKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyRXZlbnRzXG4gIH1cbiAgc2V0IF9jb250cm9sbGVyRXZlbnRzKGNvbnRyb2xsZXJFdmVudHMpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlckV2ZW50cywgdGhpcy5fY29udHJvbGxlckV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZW5hYmxlTW9kZWxFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5tb2RlbEV2ZW50cywgdGhpcy5tb2RlbHMsIHRoaXMubW9kZWxDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZU1vZGVsRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyh0aGlzLm1vZGVsRXZlbnRzLCB0aGlzLm1vZGVscywgdGhpcy5tb2RlbENhbGxiYWNrcylcbiAgfVxuICBlbmFibGVWaWV3RXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMudmlld0V2ZW50cywgdGhpcy52aWV3cywgdGhpcy52aWV3Q2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVWaWV3RXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyh0aGlzLnZpZXdFdmVudHMsIHRoaXMudmlld3MsIHRoaXMudmlld0NhbGxiYWNrcylcbiAgfVxuICBlbmFibGVDb250cm9sbGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuY29udHJvbGxlckV2ZW50cywgdGhpcy5jb250cm9sbGVycywgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVDb250cm9sbGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyh0aGlzLmNvbnRyb2xsZXJFdmVudHMsIHRoaXMuY29udHJvbGxlcnMsIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcylcbiAgfVxuICBlbmFibGVFbWl0dGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuZW1pdHRlckV2ZW50cywgdGhpcy5lbWl0dGVycywgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVFbWl0dGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyh0aGlzLmVtaXR0ZXJFdmVudHMsIHRoaXMuZW1pdHRlcnMsIHRoaXMuZW1pdHRlckNhbGxiYWNrcylcbiAgfVxuICBlbmFibGVSb3V0ZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5yb3V0ZXJFdmVudHMsIHRoaXMucm91dGVycywgdGhpcy5yb3V0ZXJDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZVJvdXRlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5yb3V0ZXJFdmVudHMsIHRoaXMucm91dGVycywgdGhpcy5yb3V0ZXJDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICBpZihzZXR0aW5ncy5tb2RlbENhbGxiYWNrcykgdGhpcy5fbW9kZWxDYWxsYmFja3MgPSBzZXR0aW5ncy5tb2RlbENhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3Mudmlld0NhbGxiYWNrcykgdGhpcy5fdmlld0NhbGxiYWNrcyA9IHNldHRpbmdzLnZpZXdDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLmNvbnRyb2xsZXJDYWxsYmFja3MpIHRoaXMuX2NvbnRyb2xsZXJDYWxsYmFja3MgPSBzZXR0aW5ncy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5lbWl0dGVyQ2FsbGJhY2tzKSB0aGlzLl9lbWl0dGVyQ2FsbGJhY2tzID0gc2V0dGluZ3MuZW1pdHRlckNhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3Mucm91dGVyQ2FsbGJhY2tzKSB0aGlzLl9yb3V0ZXJDYWxsYmFja3MgPSBzZXR0aW5ncy5yb3V0ZXJDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLm1vZGVscykgdGhpcy5fbW9kZWxzID0gc2V0dGluZ3MubW9kZWxzXG4gICAgICBpZihzZXR0aW5ncy52aWV3cykgdGhpcy5fdmlld3MgPSBzZXR0aW5ncy52aWV3c1xuICAgICAgaWYoc2V0dGluZ3MuY29udHJvbGxlcnMpIHRoaXMuX2NvbnRyb2xsZXJzID0gc2V0dGluZ3MuY29udHJvbGxlcnNcbiAgICAgIGlmKHNldHRpbmdzLmVtaXR0ZXJzKSB0aGlzLl9lbWl0dGVycyA9IHNldHRpbmdzLmVtaXR0ZXJzXG4gICAgICBpZihzZXR0aW5ncy5yb3V0ZXJzKSB0aGlzLl9yb3V0ZXJzID0gc2V0dGluZ3Mucm91dGVyc1xuICAgICAgaWYoc2V0dGluZ3MubW9kZWxFdmVudHMpIHRoaXMuX21vZGVsRXZlbnRzID0gc2V0dGluZ3MubW9kZWxFdmVudHNcbiAgICAgIGlmKHNldHRpbmdzLnZpZXdFdmVudHMpIHRoaXMuX3ZpZXdFdmVudHMgPSBzZXR0aW5ncy52aWV3RXZlbnRzXG4gICAgICBpZihzZXR0aW5ncy5jb250cm9sbGVyRXZlbnRzKSB0aGlzLl9jb250cm9sbGVyRXZlbnRzID0gc2V0dGluZ3MuY29udHJvbGxlckV2ZW50c1xuICAgICAgaWYoc2V0dGluZ3MuZW1pdHRlckV2ZW50cykgdGhpcy5fZW1pdHRlckV2ZW50cyA9IHNldHRpbmdzLmVtaXR0ZXJFdmVudHNcbiAgICAgIGlmKHNldHRpbmdzLnJvdXRlckV2ZW50cykgdGhpcy5fcm91dGVyRXZlbnRzID0gc2V0dGluZ3Mucm91dGVyRXZlbnRzXG4gICAgICBpZihcbiAgICAgICAgdGhpcy5tb2RlbEV2ZW50cyAmJlxuICAgICAgICB0aGlzLm1vZGVscyAmJlxuICAgICAgICB0aGlzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5lbmFibGVNb2RlbEV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy52aWV3RXZlbnRzICYmXG4gICAgICAgIHRoaXMudmlld3MgJiZcbiAgICAgICAgdGhpcy52aWV3Q2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5lbmFibGVWaWV3RXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVycyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZUNvbnRyb2xsZXJFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMucm91dGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMucm91dGVycyAmJlxuICAgICAgICB0aGlzLnJvdXRlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlUm91dGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmVtaXR0ZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVycyAmJlxuICAgICAgICB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZUVtaXR0ZXJFdmVudHMoKVxuICAgICAgfVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5kaXNhYmxlKClcbiAgICB0aGlzLmVuYWJsZSgpXG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5tb2RlbEV2ZW50cyAmJlxuICAgICAgICB0aGlzLm1vZGVscyAmJlxuICAgICAgICB0aGlzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlTW9kZWxFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMudmlld0V2ZW50cyAmJlxuICAgICAgICB0aGlzLnZpZXdzICYmXG4gICAgICAgIHRoaXMudmlld0NhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZVZpZXdFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuY29udHJvbGxlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZUNvbnRyb2xsZXJFdmVudHMoKVxuICAgICAgfX1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnJvdXRlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLnJvdXRlcnMgJiZcbiAgICAgICAgdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVSb3V0ZXJFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuZW1pdHRlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLmVtaXR0ZXJzICYmXG4gICAgICAgIHRoaXMuZW1pdHRlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZUVtaXR0ZXJFdmVudHMoKVxuICAgICAgICBkZWxldGUgdGhpcy5fbW9kZWxDYWxsYmFja3NcbiAgICAgICAgZGVsZXRlIHRoaXMuX3ZpZXdDYWxsYmFja3NcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgICAgZGVsZXRlIHRoaXMuX2VtaXR0ZXJDYWxsYmFja3NcbiAgICAgICAgZGVsZXRlIHRoaXMuX3JvdXRlckNhbGxiYWNrc1xuICAgICAgICBkZWxldGUgdGhpcy5fbW9kZWxzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl92aWV3c1xuICAgICAgICBkZWxldGUgdGhpcy5fY29udHJvbGxlcnNcbiAgICAgICAgZGVsZXRlIHRoaXMuX2VtaXR0ZXJzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yb3V0ZXJzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yb3V0ZXJFdmVudHNcbiAgICAgICAgZGVsZXRlIHRoaXMuX21vZGVsRXZlbnRzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl92aWV3RXZlbnRzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyRXZlbnRzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9lbWl0dGVyRXZlbnRzXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gIH1cbn1cbiIsIk1WQy5FbWl0dGVycy5OYXZpZ2F0ZSA9IGNsYXNzIGV4dGVuZHMgTVZDLkVtaXR0ZXIge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxyXG4gICAgdGhpcy5hZGRTZXR0aW5ncygpXHJcbiAgICB0aGlzLmVuYWJsZSgpXHJcbiAgfVxyXG4gIGFkZFNldHRpbmdzKCkge1xyXG4gICAgdGhpcy5fbmFtZSA9ICduYXZpZ2F0ZSdcclxuICAgIHRoaXMuX3NjaGVtYSA9IHtcclxuICAgICAgb2xkVVJMOiBTdHJpbmcsXHJcbiAgICAgIG5ld1VSTDogU3RyaW5nLFxyXG4gICAgICBjdXJyZW50Um91dGU6IFN0cmluZyxcclxuICAgICAgY3VycmVudENvbnRyb2xsZXI6IFN0cmluZyxcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiTVZDLlJvdXRlciA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IHByb3RvY29sKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnByb3RvY29sIH1cbiAgZ2V0IGhvc3RuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lIH1cbiAgZ2V0IHBvcnQoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucG9ydCB9XG4gIGdldCBwYXRoKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIH1cbiAgZ2V0IGhhc2goKSB7XG4gICAgbGV0IGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgIGxldCBoYXNoSW5kZXggPSBocmVmLmluZGV4T2YoJyMnKVxuICAgIGlmKGhhc2hJbmRleCA+IC0xKSB7XG4gICAgICBsZXQgcGFyYW1JbmRleCA9IGhyZWYuaW5kZXhPZignPycpXG4gICAgICBsZXQgc2xpY2VTdGFydCA9IGhhc2hJbmRleCArIDFcbiAgICAgIGxldCBzbGljZVN0b3BcbiAgICAgIGlmKHBhcmFtSW5kZXggPiAtMSkge1xuICAgICAgICBzbGljZVN0b3AgPSAoaGFzaEluZGV4ID4gcGFyYW1JbmRleClcbiAgICAgICAgICA/IGhyZWYubGVuZ3RoXG4gICAgICAgICAgOiBwYXJhbUluZGV4XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzbGljZVN0b3AgPSBocmVmLmxlbmd0aFxuICAgICAgfVxuICAgICAgaHJlZiA9IGhyZWYuc2xpY2Uoc2xpY2VTdGFydCwgc2xpY2VTdG9wKVxuICAgICAgaWYoaHJlZi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGhyZWZcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG4gIGdldCBwYXJhbXMoKSB7XG4gICAgbGV0IGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgIGxldCBwYXJhbUluZGV4ID0gaHJlZi5pbmRleE9mKCc/JylcbiAgICBpZihwYXJhbUluZGV4ID4gLTEpIHtcbiAgICAgIGxldCBoYXNoSW5kZXggPSBocmVmLmluZGV4T2YoJyMnKVxuICAgICAgbGV0IHNsaWNlU3RhcnQgPSBwYXJhbUluZGV4ICsgMVxuICAgICAgbGV0IHNsaWNlU3RvcFxuICAgICAgaWYoaGFzaEluZGV4ID4gLTEpIHtcbiAgICAgICAgc2xpY2VTdG9wID0gKHBhcmFtSW5kZXggPiBoYXNoSW5kZXgpXG4gICAgICAgICAgPyBocmVmLmxlbmd0aFxuICAgICAgICAgIDogaGFzaEluZGV4XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzbGljZVN0b3AgPSBocmVmLmxlbmd0aFxuICAgICAgfVxuICAgICAgaHJlZiA9IGhyZWYuc2xpY2Uoc2xpY2VTdGFydCwgc2xpY2VTdG9wKVxuICAgICAgaWYoaHJlZi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGhyZWZcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG4gIGdldCBfcm91dGVEYXRhKCkge1xuICAgIGxldCByb3V0ZURhdGEgPSB7fVxuICAgIGxldCBwYXRoID0gdGhpcy5wYXRoLnNwbGl0KCcvJykuZmlsdGVyKChmcmFnbWVudCkgPT4gZnJhZ21lbnQubGVuZ3RoKVxuICAgIHBhdGggPSAocGF0aC5sZW5ndGgpXG4gICAgICA/IHBhdGhcbiAgICAgIDogWycvJ11cbiAgICBsZXQgaGFzaCA9IHRoaXMuaGFzaFxuICAgIGxldCBoYXNoRnJhZ21lbnRzID0gKGhhc2gpXG4gICAgICA/IGhhc2guc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgICA6IG51bGxcbiAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXNcbiAgICBsZXQgcGFyYW1EYXRhID0gKHBhcmFtcylcbiAgICAgID8gTVZDLlV0aWxzLnBhcmFtc1RvT2JqZWN0KHBhcmFtcylcbiAgICAgIDogbnVsbFxuICAgIGlmKHRoaXMucHJvdG9jb2wpIHJvdXRlRGF0YS5wcm90b2NvbCA9IHRoaXMucHJvdG9jb2xcbiAgICBpZih0aGlzLmhvc3RuYW1lKSByb3V0ZURhdGEuaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lXG4gICAgaWYodGhpcy5wb3J0KSByb3V0ZURhdGEucG9ydCA9IHRoaXMucG9ydFxuICAgIGlmKHRoaXMucGF0aCkgcm91dGVEYXRhLnBhdGggPSB0aGlzLnBhdGhcbiAgICBpZihcbiAgICAgIGhhc2ggJiZcbiAgICAgIGhhc2hGcmFnbWVudHNcbiAgICApIHtcbiAgICAgIGhhc2hGcmFnbWVudHMgPSAoaGFzaEZyYWdtZW50cy5sZW5ndGgpXG4gICAgICA/IGhhc2hGcmFnbWVudHNcbiAgICAgIDogWycvJ11cbiAgICAgIHJvdXRlRGF0YS5oYXNoID0ge1xuICAgICAgICBwYXRoOiBoYXNoLFxuICAgICAgICBmcmFnbWVudHM6IGhhc2hGcmFnbWVudHMsXG4gICAgICB9XG4gICAgfVxuICAgIGlmKFxuICAgICAgcGFyYW1zICYmXG4gICAgICBwYXJhbURhdGFcbiAgICApIHtcbiAgICAgIHJvdXRlRGF0YS5wYXJhbXMgPSB7XG4gICAgICAgIHBhdGg6IHBhcmFtcyxcbiAgICAgICAgZGF0YTogcGFyYW1EYXRhLFxuICAgICAgfVxuICAgIH1cbiAgICByb3V0ZURhdGEucGF0aCA9IHtcbiAgICAgIG5hbWU6IHRoaXMucGF0aCxcbiAgICAgIGZyYWdtZW50czogcGF0aCxcbiAgICB9XG4gICAgcm91dGVEYXRhLmN1cnJlbnRVUkwgPSB0aGlzLmN1cnJlbnRVUkxcbiAgICByb3V0ZURhdGEgPSBPYmplY3QuYXNzaWduKFxuICAgICAgcm91dGVEYXRhLFxuICAgICAgdGhpcy5fcm91dGVDb250cm9sbGVyRGF0YVxuICAgIClcbiAgICB0aGlzLnJvdXRlRGF0YSA9IHJvdXRlRGF0YVxuICAgIHJldHVybiB0aGlzLnJvdXRlRGF0YVxuICB9XG4gIGdldCBfcm91dGVDb250cm9sbGVyRGF0YSgpIHtcbiAgICBsZXQgcm91dGVEYXRhID0ge31cbiAgICBPYmplY3QuZW50cmllcyh0aGlzLnJvdXRlcylcbiAgICAgIC5mb3JFYWNoKChbcm91dGVQYXRoLCByb3V0ZVNldHRpbmdzXSkgPT4ge1xuICAgICAgICBsZXQgcGF0aEZyYWdtZW50cyA9IHRoaXMucGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgICAgcGF0aEZyYWdtZW50cyA9IChwYXRoRnJhZ21lbnRzLmxlbmd0aClcbiAgICAgICAgICA/IHBhdGhGcmFnbWVudHNcbiAgICAgICAgICA6IFsnLyddXG4gICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IHJvdXRlUGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQsIGZyYWdtZW50SW5kZXgpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgICAgcm91dGVGcmFnbWVudHMgPSAocm91dGVGcmFnbWVudHMubGVuZ3RoKVxuICAgICAgICAgID8gcm91dGVGcmFnbWVudHNcbiAgICAgICAgICA6IFsnLyddXG4gICAgICAgIGlmKFxuICAgICAgICAgIHBhdGhGcmFnbWVudHMubGVuZ3RoICYmXG4gICAgICAgICAgcGF0aEZyYWdtZW50cy5sZW5ndGggPT09IHJvdXRlRnJhZ21lbnRzLmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICBsZXQgbWF0Y2hcbiAgICAgICAgICByZXR1cm4gcm91dGVGcmFnbWVudHMuZmlsdGVyKChyb3V0ZUZyYWdtZW50LCByb3V0ZUZyYWdtZW50SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICBtYXRjaCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICAgIG1hdGNoID09PSB0cnVlXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgaWYocm91dGVGcmFnbWVudFswXSA9PT0gJzonKSB7XG4gICAgICAgICAgICAgICAgcm91dGVEYXRhW3JvdXRlRnJhZ21lbnQucmVwbGFjZSgnOicsICcnKV0gPSBwYXRoRnJhZ21lbnRzW3JvdXRlRnJhZ21lbnRJbmRleF1cbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50ID0gdGhpcy5mcmFnbWVudElEUmVnRXhwXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudCA9IHJvdXRlRnJhZ21lbnQucmVwbGFjZShuZXcgUmVnRXhwKCcvJywgJ2dpJyksICdcXFxcXFwvJylcbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50ID0gdGhpcy5yb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cChyb3V0ZUZyYWdtZW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG1hdGNoID0gcm91dGVGcmFnbWVudC50ZXN0KHBhdGhGcmFnbWVudHNbcm91dGVGcmFnbWVudEluZGV4XSlcbiAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgbWF0Y2ggPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50SW5kZXggPT09IHBhdGhGcmFnbWVudHMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByb3V0ZURhdGEucm91dGUgPSB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiByb3V0ZVBhdGgsXG4gICAgICAgICAgICAgICAgICBmcmFnbWVudHM6IHJvdXRlRnJhZ21lbnRzLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByb3V0ZURhdGEuY29udHJvbGxlciA9IHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICAgICAgICByZXR1cm4gcm91dGVTZXR0aW5nc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlbMF1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICByZXR1cm4gcm91dGVEYXRhXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGdldCBfcm91dGVzKCkge1xuICAgIHRoaXMucm91dGVzID0gKHRoaXMucm91dGVzKVxuICAgICAgPyB0aGlzLnJvdXRlc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlc1xuICB9XG4gIHNldCBfcm91dGVzKHJvdXRlcykge1xuICAgIHRoaXMucm91dGVzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlcywgdGhpcy5fcm91dGVzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlcigpIHsgcmV0dXJuIHRoaXMuY29udHJvbGxlciB9XG4gIHNldCBfY29udHJvbGxlcihjb250cm9sbGVyKSB7IHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXIgfVxuICBnZXQgX3ByZXZpb3VzVVJMKCkgeyByZXR1cm4gdGhpcy5wcmV2aW91c1VSTCB9XG4gIHNldCBfcHJldmlvdXNVUkwocHJldmlvdXNVUkwpIHsgdGhpcy5wcmV2aW91c1VSTCA9IHByZXZpb3VzVVJMIH1cbiAgZ2V0IF9jdXJyZW50VVJMKCkgeyByZXR1cm4gdGhpcy5jdXJyZW50VVJMIH1cbiAgc2V0IF9jdXJyZW50VVJMKGN1cnJlbnRVUkwpIHtcbiAgICBpZih0aGlzLmN1cnJlbnRVUkwpIHRoaXMuX3ByZXZpb3VzVVJMID0gdGhpcy5jdXJyZW50VVJMXG4gICAgdGhpcy5jdXJyZW50VVJMID0gY3VycmVudFVSTFxuICB9XG4gIGdldCBmcmFnbWVudElEUmVnRXhwKCkgeyByZXR1cm4gbmV3IFJlZ0V4cCgvXihbMC05QS1aXFw/XFw9XFwsXFwuXFwqXFwtXFxfXFwnXFxcIlxcXlxcJVxcJFxcI1xcQFxcIVxcflxcKFxcKVxce1xcfVxcJlxcPFxcPlxcXFxcXC9dKSokLywgJ2dpJykgfVxuICByb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cChmcmFnbWVudCkgeyByZXR1cm4gbmV3IFJlZ0V4cCgnXicuY29uY2F0KGZyYWdtZW50LCAnJCcpKSB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5lbmFibGVFbWl0dGVycygpXG4gICAgICB0aGlzLmVuYWJsZUV2ZW50cygpXG4gICAgICB0aGlzLmVuYWJsZVJvdXRlcygpXG4gICAgICB0aGlzLnJvdXRlQ2hhbmdlKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgfVxuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgIHRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5kaXNhYmxlRXZlbnRzKClcbiAgICAgIHRoaXMuZGlzYWJsZVJvdXRlcygpXG4gICAgICB0aGlzLmRpc2FibGVFbWl0dGVycygpXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gIH1cbiAgZW5hYmxlUm91dGVzKCkge1xuICAgIGlmKHRoaXMuc2V0dGluZ3MuY29udHJvbGxlcikgdGhpcy5fY29udHJvbGxlciA9IHRoaXMuc2V0dGluZ3MuY29udHJvbGxlclxuICAgIHRoaXMuX3JvdXRlcyA9IE9iamVjdC5lbnRyaWVzKHRoaXMuc2V0dGluZ3Mucm91dGVzKS5yZWR1Y2UoXG4gICAgICAoXG4gICAgICAgIF9yb3V0ZXMsXG4gICAgICAgIFtyb3V0ZVBhdGgsIHJvdXRlU2V0dGluZ3NdLFxuICAgICAgICByb3V0ZUluZGV4LFxuICAgICAgICBvcmlnaW5hbFJvdXRlcyxcbiAgICAgICkgPT4ge1xuICAgICAgICBfcm91dGVzW3JvdXRlUGF0aF0gPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHJvdXRlU2V0dGluZ3MsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FsbGJhY2s6IHRoaXMuY29udHJvbGxlcltyb3V0ZVNldHRpbmdzLmNhbGxiYWNrXS5iaW5kKHRoaXMuY29udHJvbGxlciksXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICAgIHJldHVybiBfcm91dGVzXG4gICAgICB9LFxuICAgICAge31cbiAgICApXG4gICAgcmV0dXJuXG4gIH1cbiAgZW5hYmxlRW1pdHRlcnMoKSB7XG4gICAgdGhpcy5fZW1pdHRlcnMgPSB7XG4gICAgICBuYXZpZ2F0ZUVtaXR0ZXI6IG5ldyBNVkMuRW1pdHRlcnMuTmF2aWdhdGUoKSxcbiAgICB9XG4gIH1cbiAgZGlzYWJsZUVtaXR0ZXJzKCkge1xuICAgIGRlbGV0ZSB0aGlzLl9lbWl0dGVycy5uYXZpZ2F0ZUVtaXR0ZXJcbiAgfVxuICBkaXNhYmxlUm91dGVzKCkge1xuICAgIGRlbGV0ZSB0aGlzLl9yb3V0ZXNcbiAgICBkZWxldGUgdGhpcy5fY29udHJvbGxlclxuICB9XG4gIGVuYWJsZUV2ZW50cygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMucm91dGVDaGFuZ2UuYmluZCh0aGlzKSlcbiAgfVxuICBkaXNhYmxlRXZlbnRzKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgdGhpcy5yb3V0ZUNoYW5nZS5iaW5kKHRoaXMpKVxuICB9XG4gIHJvdXRlQ2hhbmdlKCkge1xuICAgIHRoaXMuX2N1cnJlbnRVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgIGxldCByb3V0ZURhdGEgPSB0aGlzLl9yb3V0ZURhdGFcbiAgICBpZihyb3V0ZURhdGEuY29udHJvbGxlcikge1xuICAgICAgbGV0IG5hdmlnYXRlRW1pdHRlciA9IHRoaXMuZW1pdHRlcnMubmF2aWdhdGVFbWl0dGVyXG4gICAgICBpZih0aGlzLnByZXZpb3VzVVJMKSByb3V0ZURhdGEucHJldmlvdXNVUkwgPSB0aGlzLnByZXZpb3VzVVJMXG4gICAgICBuYXZpZ2F0ZUVtaXR0ZXJcbiAgICAgICAgLnVuc2V0KClcbiAgICAgICAgLnNldChyb3V0ZURhdGEpXG4gICAgICB0aGlzLmVtaXQoXG4gICAgICAgIG5hdmlnYXRlRW1pdHRlci5uYW1lLFxuICAgICAgICBuYXZpZ2F0ZUVtaXR0ZXIuZW1pc3Npb24oKVxuICAgICAgKVxuICAgICAgcm91dGVEYXRhLmNvbnRyb2xsZXIuY2FsbGJhY2soXG4gICAgICAgIG5hdmlnYXRlRW1pdHRlci5lbWlzc2lvbigpXG4gICAgICApXG4gICAgfVxuICB9XG4gIG5hdmlnYXRlKHBhdGgpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHBhdGhcbiAgfVxufVxuIl19
