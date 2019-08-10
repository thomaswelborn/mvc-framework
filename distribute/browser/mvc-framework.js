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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1WQy5qcyIsIkNvbnN0YW50cy5qcyIsIkV2ZW50cy5qcyIsImluZGV4LmpzIiwiYWRkUHJvcGVydGllc1RvT2JqZWN0LmpzIiwiaXMuanMiLCJvYmplY3RRdWVyeS5qcyIsInBhcmFtc1RvT2JqZWN0LmpzIiwidG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cy5qcyIsInR5cGVPZi5qcyIsInZhbGlkYXRlRGF0YVNjaGVtYS5qcyIsIkNoYW5uZWxzLmpzIiwiQ2hhbm5lbC5qcyIsIkJhc2UuanMiLCJTZXJ2aWNlLmpzIiwiTW9kZWwuanMiLCJFbWl0dGVyLmpzIiwiVmlldy5qcyIsIkNvbnRyb2xsZXIuanMiLCJOYXZpZ2F0ZS5qcyIsIlJvdXRlci5qcyJdLCJuYW1lcyI6WyJNVkMiLCJDb25zdGFudHMiLCJDT05TVCIsIkV2ZW50cyIsIkVWIiwiVXRpbHMiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QiLCJ0YXJnZXRPYmplY3QiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJwcm9wZXJ0aWVzIiwicHJvcGVydHlOYW1lIiwicHJvcGVydHlWYWx1ZSIsIk9iamVjdCIsImVudHJpZXMiLCJpc0FycmF5Iiwib2JqZWN0IiwiQXJyYXkiLCJpc09iamVjdCIsImlzRXF1YWxUeXBlIiwidmFsdWVBIiwidmFsdWVCIiwiaXNIVE1MRWxlbWVudCIsIkhUTUxFbGVtZW50Iiwib2JqZWN0UXVlcnkiLCJzdHJpbmciLCJjb250ZXh0Iiwic3RyaW5nRGF0YSIsInBhcnNlTm90YXRpb24iLCJzcGxpY2UiLCJyZWR1Y2UiLCJmcmFnbWVudCIsImZyYWdtZW50SW5kZXgiLCJmcmFnbWVudHMiLCJwYXJzZUZyYWdtZW50IiwicHJvcGVydHlLZXkiLCJtYXRjaCIsImNvbmNhdCIsImNoYXJBdCIsInNsaWNlIiwic3BsaXQiLCJSZWdFeHAiLCJwYXJhbXNUb09iamVjdCIsInBhcmFtcyIsImZvckVhY2giLCJwYXJhbURhdGEiLCJkZWNvZGVVUklDb21wb25lbnQiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJ0b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzIiwidG9nZ2xlTWV0aG9kIiwiZXZlbnRzIiwidGFyZ2V0T2JqZWN0cyIsImNhbGxiYWNrcyIsImV2ZW50U2V0dGluZ3MiLCJldmVudENhbGxiYWNrTmFtZSIsImV2ZW50RGF0YSIsImV2ZW50VGFyZ2V0U2V0dGluZ3MiLCJldmVudE5hbWUiLCJldmVudFRhcmdldHMiLCJldmVudFRhcmdldE5hbWUiLCJldmVudFRhcmdldCIsImV2ZW50TWV0aG9kTmFtZSIsIk5vZGVMaXN0IiwiRG9jdW1lbnQiLCJldmVudENhbGxiYWNrIiwiX2V2ZW50VGFyZ2V0IiwiYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyIsInVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzIiwidHlwZU9mIiwiZGF0YSIsIl9vYmplY3QiLCJ2YWxpZGF0ZURhdGFTY2hlbWEiLCJzY2hlbWEiLCJhcnJheSIsImNvbnNvbGUiLCJsb2ciLCJuYW1lIiwiYXJyYXlLZXkiLCJhcnJheVZhbHVlIiwicHVzaCIsIm9iamVjdEtleSIsIm9iamVjdFZhbHVlIiwiVE1QTCIsImNvbnN0cnVjdG9yIiwiX2V2ZW50cyIsImV2ZW50Q2FsbGJhY2tzIiwiZXZlbnRDYWxsYmFja0dyb3VwIiwib24iLCJvZmYiLCJlbWl0IiwiZXZlbnRDYWxsYmFja0dyb3VwTmFtZSIsImFkZGl0aW9uYWxBcmd1bWVudHMiLCJ2YWx1ZXMiLCJDaGFubmVscyIsIl9jaGFubmVscyIsImNoYW5uZWxzIiwiY2hhbm5lbCIsImNoYW5uZWxOYW1lIiwiQ2hhbm5lbCIsIl9yZXNwb25zZXMiLCJyZXNwb25zZXMiLCJyZXNwb25zZSIsInJlc3BvbnNlTmFtZSIsInJlc3BvbnNlQ2FsbGJhY2siLCJyZXF1ZXN0IiwicmVxdWVzdERhdGEiLCJrZXlzIiwiQmFzZSIsInNldHRpbmdzIiwiY29uZmlndXJhdGlvbiIsIl9jb25maWd1cmF0aW9uIiwiX3NldHRpbmdzIiwiX2VtaXR0ZXJzIiwiZW1pdHRlcnMiLCJTZXJ2aWNlIiwiX2RlZmF1bHRzIiwiZGVmYXVsdHMiLCJjb250ZW50VHlwZSIsInJlc3BvbnNlVHlwZSIsIl9yZXNwb25zZVR5cGVzIiwiX3Jlc3BvbnNlVHlwZSIsIl94aHIiLCJmaW5kIiwicmVzcG9uc2VUeXBlSXRlbSIsIl90eXBlIiwidHlwZSIsIl91cmwiLCJ1cmwiLCJfaGVhZGVycyIsImhlYWRlcnMiLCJoZWFkZXIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwiX2RhdGEiLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIl9lbmFibGVkIiwiZW5hYmxlZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3RhdHVzIiwiYWJvcnQiLCJvcGVuIiwib25sb2FkIiwib25lcnJvciIsInNlbmQiLCJ0aGVuIiwiY3VycmVudFRhcmdldCIsImVuYWJsZSIsImRpc2FibGUiLCJNb2RlbCIsIl9sb2NhbFN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJfc2NoZW1hIiwiX2hpc3Rpb2dyYW0iLCJoaXN0aW9ncmFtIiwiYXNzaWduIiwiX2hpc3RvcnkiLCJoaXN0b3J5IiwidW5zaGlmdCIsIl9kYiIsImRiIiwiZ2V0SXRlbSIsImVuZHBvaW50Iiwic2V0SXRlbSIsIl9kYXRhRXZlbnRzIiwiZGF0YUV2ZW50cyIsIl9kYXRhQ2FsbGJhY2tzIiwiZGF0YUNhbGxiYWNrcyIsIl9zZXJ2aWNlcyIsInNlcnZpY2VzIiwiX3NlcnZpY2VFdmVudHMiLCJzZXJ2aWNlRXZlbnRzIiwiX3NlcnZpY2VDYWxsYmFja3MiLCJzZXJ2aWNlQ2FsbGJhY2tzIiwiZW5hYmxlU2VydmljZUV2ZW50cyIsImRpc2FibGVTZXJ2aWNlRXZlbnRzIiwiZW5hYmxlRGF0YUV2ZW50cyIsImRpc2FibGVEYXRhRXZlbnRzIiwic2V0RGVmYXVsdHMiLCJzZXQiLCJnZXQiLCJwcm9wZXJ0eSIsImluZGV4Iiwia2V5IiwidmFsdWUiLCJzZXREYXRhUHJvcGVydHkiLCJzZXREQiIsInVuc2V0IiwidW5zZXREYXRhUHJvcGVydHkiLCJfYXJndW1lbnRzIiwidW5zZXREQiIsImRlZmluZVByb3BlcnRpZXMiLCJjb25maWd1cmFibGUiLCJzZXRWYWx1ZUV2ZW50TmFtZSIsImpvaW4iLCJzZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlRXZlbnROYW1lIiwidW5zZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlIiwiRW1pdHRlciIsIl9uYW1lIiwiZW1pc3Npb24iLCJWaWV3IiwiX2VsZW1lbnROYW1lIiwiX2VsZW1lbnQiLCJ0YWdOYW1lIiwiZWxlbWVudE5hbWUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJlbGVtZW50IiwicXVlcnlTZWxlY3RvciIsImVsZW1lbnRPYnNlcnZlciIsIm9ic2VydmUiLCJzdWJ0cmVlIiwiY2hpbGRMaXN0IiwiX2F0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJfdWkiLCJ1aSIsInVpS2V5IiwidWlWYWx1ZSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJfdWlFdmVudHMiLCJ1aUV2ZW50cyIsIl91aUNhbGxiYWNrcyIsInVpQ2FsbGJhY2tzIiwiX29ic2VydmVyQ2FsbGJhY2tzIiwib2JzZXJ2ZXJDYWxsYmFja3MiLCJfZWxlbWVudE9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsImVsZW1lbnRPYnNlcnZlIiwiYmluZCIsIl9pbnNlcnQiLCJpbnNlcnQiLCJfdGVtcGxhdGVzIiwidGVtcGxhdGVzIiwibXV0YXRpb25SZWNvcmRMaXN0Iiwib2JzZXJ2ZXIiLCJtdXRhdGlvblJlY29yZEluZGV4IiwibXV0YXRpb25SZWNvcmQiLCJtdXRhdGlvblJlY29yZENhdGVnb3JpZXMiLCJtdXRhdGlvblJlY29yZENhdGVnb3J5IiwicmVzZXRVSSIsImF1dG9JbnNlcnQiLCJpbnNlcnRBZGphY2VudEVsZW1lbnQiLCJtZXRob2QiLCJhdXRvUmVtb3ZlIiwicGFyZW50RWxlbWVudCIsInJlbW92ZUNoaWxkIiwiZW5hYmxlRWxlbWVudCIsImRpc2FibGVFbGVtZW50IiwiZGlzYWJsZVVJIiwiZW5hYmxlVUkiLCJlbmFibGVVSUV2ZW50cyIsImRpc2FibGVVSUV2ZW50cyIsImVuYWJsZUVtaXR0ZXJzIiwiZGlzYWJsZUVtaXR0ZXJzIiwidGhpc3MiLCJDb250cm9sbGVyIiwiX2VtaXR0ZXJDYWxsYmFja3MiLCJlbWl0dGVyQ2FsbGJhY2tzIiwiX21vZGVsQ2FsbGJhY2tzIiwibW9kZWxDYWxsYmFja3MiLCJfdmlld0NhbGxiYWNrcyIsInZpZXdDYWxsYmFja3MiLCJfY29udHJvbGxlckNhbGxiYWNrcyIsImNvbnRyb2xsZXJDYWxsYmFja3MiLCJfbW9kZWxzIiwibW9kZWxzIiwiX3ZpZXdzIiwidmlld3MiLCJfY29udHJvbGxlcnMiLCJjb250cm9sbGVycyIsIl9yb3V0ZXJzIiwicm91dGVycyIsIl9yb3V0ZXJFdmVudHMiLCJyb3V0ZXJFdmVudHMiLCJfcm91dGVyQ2FsbGJhY2tzIiwicm91dGVyQ2FsbGJhY2tzIiwiX2VtaXR0ZXJFdmVudHMiLCJlbWl0dGVyRXZlbnRzIiwiX21vZGVsRXZlbnRzIiwibW9kZWxFdmVudHMiLCJfdmlld0V2ZW50cyIsInZpZXdFdmVudHMiLCJfY29udHJvbGxlckV2ZW50cyIsImNvbnRyb2xsZXJFdmVudHMiLCJlbmFibGVNb2RlbEV2ZW50cyIsImRpc2FibGVNb2RlbEV2ZW50cyIsImVuYWJsZVZpZXdFdmVudHMiLCJkaXNhYmxlVmlld0V2ZW50cyIsImVuYWJsZUNvbnRyb2xsZXJFdmVudHMiLCJkaXNhYmxlQ29udHJvbGxlckV2ZW50cyIsImVuYWJsZUVtaXR0ZXJFdmVudHMiLCJkaXNhYmxlRW1pdHRlckV2ZW50cyIsImVuYWJsZVJvdXRlckV2ZW50cyIsImRpc2FibGVSb3V0ZXJFdmVudHMiLCJyZXNldCIsIkVtaXR0ZXJzIiwiTmF2aWdhdGUiLCJhZGRTZXR0aW5ncyIsIm9sZFVSTCIsIlN0cmluZyIsIm5ld1VSTCIsImN1cnJlbnRSb3V0ZSIsImN1cnJlbnRDb250cm9sbGVyIiwiUm91dGVyIiwicHJvdG9jb2wiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhvc3RuYW1lIiwicG9ydCIsInBhdGgiLCJwYXRobmFtZSIsImhhc2giLCJocmVmIiwiaGFzaEluZGV4IiwiaW5kZXhPZiIsInBhcmFtSW5kZXgiLCJzbGljZVN0YXJ0Iiwic2xpY2VTdG9wIiwiX3JvdXRlRGF0YSIsInJvdXRlRGF0YSIsImZpbHRlciIsImhhc2hGcmFnbWVudHMiLCJjdXJyZW50VVJMIiwiX3JvdXRlQ29udHJvbGxlckRhdGEiLCJyb3V0ZXMiLCJyb3V0ZVBhdGgiLCJyb3V0ZVNldHRpbmdzIiwicGF0aEZyYWdtZW50cyIsInJvdXRlRnJhZ21lbnRzIiwicm91dGVGcmFnbWVudCIsInJvdXRlRnJhZ21lbnRJbmRleCIsInVuZGVmaW5lZCIsInJlcGxhY2UiLCJmcmFnbWVudElEUmVnRXhwIiwicm91dGVGcmFnbWVudE5hbWVSZWdFeHAiLCJ0ZXN0Iiwicm91dGUiLCJjb250cm9sbGVyIiwiX3JvdXRlcyIsIl9jb250cm9sbGVyIiwiX3ByZXZpb3VzVVJMIiwicHJldmlvdXNVUkwiLCJfY3VycmVudFVSTCIsImVuYWJsZUV2ZW50cyIsImVuYWJsZVJvdXRlcyIsInJvdXRlQ2hhbmdlIiwiZGlzYWJsZUV2ZW50cyIsImRpc2FibGVSb3V0ZXMiLCJyb3V0ZUluZGV4Iiwib3JpZ2luYWxSb3V0ZXMiLCJjYWxsYmFjayIsIm5hdmlnYXRlRW1pdHRlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibmF2aWdhdGUiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLEVBQWpCO0FDQUFBLEdBQUcsQ0FBQ0MsU0FBSixHQUFnQixFQUFoQjtBQUNBRCxHQUFHLENBQUNFLEtBQUosR0FBWUYsR0FBRyxDQUFDQyxTQUFoQjtBQ0RBRCxHQUFHLENBQUNDLFNBQUosQ0FBY0UsTUFBZCxHQUF1QixFQUF2QjtBQUNBSCxHQUFHLENBQUNFLEtBQUosQ0FBVUUsRUFBVixHQUFl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QUFDREksRUFBQUEsWUFBWSxHQUFHO0FBQ2J0QyxJQUFBQSxNQUFNLENBQUMrQyxnQkFBUCxDQUF3QixZQUF4QixFQUFzQyxLQUFLUCxXQUFMLENBQWlCckgsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBdEM7QUFDRDs7QUFDRHNILEVBQUFBLGFBQWEsR0FBRztBQUNkekMsSUFBQUEsTUFBTSxDQUFDZ0QsbUJBQVAsQ0FBMkIsWUFBM0IsRUFBeUMsS0FBS1IsV0FBTCxDQUFpQnJILElBQWpCLENBQXNCLElBQXRCLENBQXpDO0FBQ0Q7O0FBQ0RxSCxFQUFBQSxXQUFXLEdBQUc7QUFDWixTQUFLSCxXQUFMLEdBQW1CckMsTUFBTSxDQUFDQyxRQUFQLENBQWdCTSxJQUFuQztBQUNBLFFBQUlPLFNBQVMsR0FBRyxLQUFLRCxVQUFyQjs7QUFDQSxRQUFHQyxTQUFTLENBQUNrQixVQUFiLEVBQXlCO0FBQ3ZCLFVBQUljLGVBQWUsR0FBRyxLQUFLdFAsUUFBTCxDQUFjc1AsZUFBcEM7QUFDQSxVQUFHLEtBQUtWLFdBQVIsRUFBcUJ0QixTQUFTLENBQUNzQixXQUFWLEdBQXdCLEtBQUtBLFdBQTdCO0FBQ3JCVSxNQUFBQSxlQUFlLENBQ1ozSyxLQURILEdBRUdSLEdBRkgsQ0FFT21KLFNBRlA7QUFHQSxXQUFLOU8sSUFBTCxDQUNFOFEsZUFBZSxDQUFDM1IsSUFEbEIsRUFFRTJSLGVBQWUsQ0FBQzdKLFFBQWhCLEVBRkY7QUFJQTZILE1BQUFBLFNBQVMsQ0FBQ2tCLFVBQVYsQ0FBcUJhLFFBQXJCLENBQ0VDLGVBQWUsQ0FBQzdKLFFBQWhCLEVBREY7QUFHRDtBQUNGOztBQUNEZ0ssRUFBQUEsUUFBUSxDQUFDN0MsSUFBRCxFQUFPO0FBQ2JKLElBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkssSUFBaEIsR0FBdUJGLElBQXZCO0FBQ0Q7O0FBdFFpQyxDQUFwQyIsImZpbGUiOiJicm93c2VyL212Yy1mcmFtZXdvcmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTVZDID0gTVZDIHx8IHt9XHJcbiIsIk1WQy5Db25zdGFudHMgPSB7fVxuTVZDLkNPTlNUID0gTVZDLkNvbnN0YW50c1xuIiwiTVZDLkV2ZW50cyA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9ldmVudHMoKSB7XHJcbiAgICB0aGlzLmV2ZW50cyA9ICh0aGlzLmV2ZW50cylcclxuICAgICAgPyB0aGlzLmV2ZW50c1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5ldmVudHNcclxuICB9XHJcbiAgZXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKSB7IHJldHVybiB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSB8fCB7fSB9XHJcbiAgZXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIChldmVudENhbGxiYWNrLm5hbWUubGVuZ3RoKVxyXG4gICAgICA/IGV2ZW50Q2FsbGJhY2submFtZVxyXG4gICAgICA6ICdhbm9ueW1vdXNGdW5jdGlvbidcclxuICB9XHJcbiAgZXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSkge1xyXG4gICAgcmV0dXJuIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSB8fCBbXVxyXG4gIH1cclxuICBvbihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IHRoaXMuZXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tOYW1lID0gdGhpcy5ldmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tHcm91cCA9IHRoaXMuZXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSlcclxuICAgIGV2ZW50Q2FsbGJhY2tHcm91cC5wdXNoKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gPSBldmVudENhbGxiYWNrR3JvdXBcclxuICAgIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdID0gZXZlbnRDYWxsYmFja3NcclxuICB9XHJcbiAgb2ZmKCkge1xyXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgICAgY2FzZSAxOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDI6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2tOYW1lID0gdGhpcy5ldmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVtldmVudENhbGxiYWNrTmFtZV1cclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxuICBlbWl0KGV2ZW50TmFtZSwgZXZlbnREYXRhKSB7XHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja3MgPSB0aGlzLmV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSlcclxuICAgIGZvcihsZXQgW2V2ZW50Q2FsbGJhY2tHcm91cE5hbWUsIGV2ZW50Q2FsbGJhY2tHcm91cF0gb2YgT2JqZWN0LmVudHJpZXMoZXZlbnRDYWxsYmFja3MpKSB7XHJcbiAgICAgIGZvcihsZXQgZXZlbnRDYWxsYmFjayBvZiBldmVudENhbGxiYWNrR3JvdXApIHtcclxuICAgICAgICBsZXQgYWRkaXRpb25hbEFyZ3VtZW50cyA9IE9iamVjdC52YWx1ZXMoYXJndW1lbnRzKS5zcGxpY2UoMikgfHwgW11cclxuICAgICAgICBldmVudENhbGxiYWNrKGV2ZW50RGF0YSwgLi4uYWRkaXRpb25hbEFyZ3VtZW50cylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJNVkMuRW1pdHRlcnMgPSB7fVxyXG4iLCJNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0ID0gZnVuY3Rpb24gYWRkUHJvcGVydGllc1RvT2JqZWN0KCkge1xyXG4gIGxldCB0YXJnZXRPYmplY3RcclxuICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgY2FzZSAyOlxyXG4gICAgICBsZXQgcHJvcGVydGllcyA9IGFyZ3VtZW50c1swXVxyXG4gICAgICB0YXJnZXRPYmplY3QgPSBhcmd1bWVudHNbMV1cclxuICAgICAgZm9yKGxldCBbcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwcm9wZXJ0aWVzKSkge1xyXG4gICAgICAgIHRhcmdldE9iamVjdFtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZVxyXG4gICAgICB9XHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlIDM6XHJcbiAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgbGV0IHByb3BlcnR5VmFsdWUgPSBhcmd1bWVudHNbMV1cclxuICAgICAgdGFyZ2V0T2JqZWN0ID0gYXJndW1lbnRzWzJdXHJcbiAgICAgIHRhcmdldE9iamVjdFtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZVxyXG4gICAgICBicmVha1xyXG4gIH1cclxuICByZXR1cm4gdGFyZ2V0T2JqZWN0XHJcbn1cclxuIiwiTVZDLlV0aWxzLmlzQXJyYXkgPSBmdW5jdGlvbiBpc0FycmF5KG9iamVjdCkgeyByZXR1cm4gQXJyYXkuaXNBcnJheShvYmplY3QpIH1cclxuTVZDLlV0aWxzLmlzT2JqZWN0ID0gZnVuY3Rpb24gaXNPYmplY3Qob2JqZWN0KSB7XHJcbiAgcmV0dXJuICghQXJyYXkuaXNBcnJheShvYmplY3QpKVxyXG4gICAgPyB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0J1xyXG4gICAgOiBmYWxzZVxyXG59XHJcbk1WQy5VdGlscy5pc0VxdWFsVHlwZSA9IGZ1bmN0aW9uIGlzRXF1YWxUeXBlKHZhbHVlQSwgdmFsdWVCKSB7IHJldHVybiB2YWx1ZUEgPT09IHZhbHVlQiB9XHJcbk1WQy5VdGlscy5pc0hUTUxFbGVtZW50ID0gZnVuY3Rpb24gaXNIVE1MRWxlbWVudChvYmplY3QpIHtcclxuICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcclxufVxyXG4iLCJNVkMuVXRpbHMub2JqZWN0UXVlcnkgPSBmdW5jdGlvbiBvYmplY3RRdWVyeShcclxuICBzdHJpbmcsXHJcbiAgY29udGV4dFxyXG4pIHtcclxuICBsZXQgc3RyaW5nRGF0YSA9IE1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZU5vdGF0aW9uKHN0cmluZylcclxuICBpZihzdHJpbmdEYXRhWzBdID09PSAnQCcpIHN0cmluZ0RhdGEuc3BsaWNlKDAsIDEpXHJcbiAgaWYoIXN0cmluZ0RhdGEubGVuZ3RoKSByZXR1cm4gY29udGV4dFxyXG4gIGNvbnRleHQgPSAoTVZDLlV0aWxzLmlzT2JqZWN0KGNvbnRleHQpKVxyXG4gICAgPyBPYmplY3QuZW50cmllcyhjb250ZXh0KVxyXG4gICAgOiBjb250ZXh0XHJcbiAgcmV0dXJuIHN0cmluZ0RhdGEucmVkdWNlKChvYmplY3QsIGZyYWdtZW50LCBmcmFnbWVudEluZGV4LCBmcmFnbWVudHMpID0+IHtcclxuICAgIGxldCBwcm9wZXJ0aWVzID0gW11cclxuICAgIGZyYWdtZW50ID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlRnJhZ21lbnQoZnJhZ21lbnQpXHJcbiAgICBmb3IobGV0IFtwcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV0gb2Ygb2JqZWN0KSB7XHJcbiAgICAgIGlmKHByb3BlcnR5S2V5Lm1hdGNoKGZyYWdtZW50KSkge1xyXG4gICAgICAgIGlmKGZyYWdtZW50SW5kZXggPT09IGZyYWdtZW50cy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoW1twcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV1dKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoT2JqZWN0LmVudHJpZXMocHJvcGVydHlWYWx1ZSkpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBvYmplY3QgPSBwcm9wZXJ0aWVzXHJcbiAgICByZXR1cm4gb2JqZWN0XHJcbiAgfSwgY29udGV4dClcclxufVxyXG5NVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VOb3RhdGlvbiA9IGZ1bmN0aW9uIHBhcnNlTm90YXRpb24oc3RyaW5nKSB7XHJcbiAgaWYoXHJcbiAgICBzdHJpbmcuY2hhckF0KDApID09PSAnWycgJiZcclxuICAgIHN0cmluZy5jaGFyQXQoc3RyaW5nLmxlbmd0aCAtIDEpID09ICddJ1xyXG4gICkge1xyXG4gICAgc3RyaW5nID0gc3RyaW5nXHJcbiAgICAgIC5zbGljZSgxLCAtMSlcclxuICAgICAgLnNwbGl0KCddWycpXHJcbiAgfSBlbHNlIHtcclxuICAgIHN0cmluZyA9IHN0cmluZ1xyXG4gICAgICAuc3BsaXQoJy4nKVxyXG4gIH1cclxuICByZXR1cm4gc3RyaW5nXHJcbn1cclxuTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlRnJhZ21lbnQgPSBmdW5jdGlvbiBwYXJzZUZyYWdtZW50KGZyYWdtZW50KSB7XHJcbiAgaWYoXHJcbiAgICBmcmFnbWVudC5jaGFyQXQoMCkgPT09ICcvJyAmJlxyXG4gICAgZnJhZ21lbnQuY2hhckF0KGZyYWdtZW50Lmxlbmd0aCAtIDEpID09ICcvJ1xyXG4gICkge1xyXG4gICAgZnJhZ21lbnQgPSBmcmFnbWVudC5zbGljZSgxLCAtMSlcclxuICAgIGZyYWdtZW50ID0gbmV3IFJlZ0V4cCgnXicuY29uY2F0KGZyYWdtZW50LCAnJCcpKVxyXG4gIH1cclxuICByZXR1cm4gZnJhZ21lbnRcclxufVxyXG4iLCJNVkMuVXRpbHMucGFyYW1zVG9PYmplY3QgPSBmdW5jdGlvbiBwYXJhbXNUb09iamVjdChwYXJhbXMpIHtcclxuICAgIHZhciBwYXJhbXMgPSBwYXJhbXMuc3BsaXQoJyYnKVxyXG4gICAgdmFyIG9iamVjdCA9IHt9XHJcbiAgICBwYXJhbXMuZm9yRWFjaCgocGFyYW1EYXRhKSA9PiB7XHJcbiAgICAgIHBhcmFtRGF0YSA9IHBhcmFtRGF0YS5zcGxpdCgnPScpXHJcbiAgICAgIG9iamVjdFtwYXJhbURhdGFbMF1dID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcmFtRGF0YVsxXSB8fCAnJylcclxuICAgIH0pXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmplY3QpKVxyXG59XHJcbiIsIk1WQy5VdGlscy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzID0gZnVuY3Rpb24gdG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyhcclxuICB0b2dnbGVNZXRob2QsXHJcbiAgZXZlbnRzLFxyXG4gIHRhcmdldE9iamVjdHMsXHJcbiAgY2FsbGJhY2tzXHJcbikge1xyXG4gIGZvcihsZXQgW2V2ZW50U2V0dGluZ3MsIGV2ZW50Q2FsbGJhY2tOYW1lXSBvZiBPYmplY3QuZW50cmllcyhldmVudHMpKSB7XHJcbiAgICBsZXQgZXZlbnREYXRhID0gZXZlbnRTZXR0aW5ncy5zcGxpdCgnICcpXHJcbiAgICBsZXQgZXZlbnRUYXJnZXRTZXR0aW5ncyA9IGV2ZW50RGF0YVswXVxyXG4gICAgbGV0IGV2ZW50TmFtZSA9IGV2ZW50RGF0YVsxXVxyXG4gICAgbGV0IGV2ZW50VGFyZ2V0cyA9IE1WQy5VdGlscy5vYmplY3RRdWVyeShcclxuICAgICAgZXZlbnRUYXJnZXRTZXR0aW5ncyxcclxuICAgICAgdGFyZ2V0T2JqZWN0c1xyXG4gICAgKVxyXG4gICAgZXZlbnRUYXJnZXRzID0gKCFNVkMuVXRpbHMuaXNBcnJheShldmVudFRhcmdldHMpKVxyXG4gICAgICA/IFtbJ0AnLCBldmVudFRhcmdldHNdXVxyXG4gICAgICA6IGV2ZW50VGFyZ2V0c1xyXG4gICAgZm9yKGxldCBbZXZlbnRUYXJnZXROYW1lLCBldmVudFRhcmdldF0gb2YgZXZlbnRUYXJnZXRzKSB7XHJcbiAgICAgIGxldCBldmVudE1ldGhvZE5hbWUgPSAodG9nZ2xlTWV0aG9kID09PSAnb24nKVxyXG4gICAgICA/IChcclxuICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0IHx8XHJcbiAgICAgICAgKFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBEb2N1bWVudFxyXG4gICAgICAgIClcclxuICAgICAgKSA/ICdhZGRFdmVudExpc3RlbmVyJ1xyXG4gICAgICAgIDogJ29uJ1xyXG4gICAgICA6IChcclxuICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0IHx8XHJcbiAgICAgICAgKFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBEb2N1bWVudFxyXG4gICAgICAgIClcclxuICAgICAgKSA/ICdyZW1vdmVFdmVudExpc3RlbmVyJ1xyXG4gICAgICAgIDogJ29mZidcclxuICAgICAgbGV0IGV2ZW50Q2FsbGJhY2sgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkoXHJcbiAgICAgICAgZXZlbnRDYWxsYmFja05hbWUsXHJcbiAgICAgICAgY2FsbGJhY2tzXHJcbiAgICAgIClbMF1bMV1cclxuICAgICAgaWYoZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xyXG4gICAgICAgIGZvcihsZXQgX2V2ZW50VGFyZ2V0IG9mIGV2ZW50VGFyZ2V0KSB7XHJcbiAgICAgICAgICBfZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYoZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgIGV2ZW50VGFyZ2V0W2V2ZW50TWV0aG9kTmFtZV0oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGV2ZW50VGFyZ2V0W2V2ZW50TWV0aG9kTmFtZV0oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbk1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzID0gZnVuY3Rpb24gYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cygpIHtcclxuICB0aGlzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoJ29uJywgLi4uYXJndW1lbnRzKVxyXG59XHJcbk1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIHVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKCkge1xyXG4gIHRoaXMudG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cygnb2ZmJywgLi4uYXJndW1lbnRzKVxyXG59XHJcbiIsIk1WQy5VdGlscy50eXBlT2YgPSAgZnVuY3Rpb24gdHlwZU9mKGRhdGEpIHtcclxuICBzd2l0Y2godHlwZW9mIGRhdGEpIHtcclxuICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgIGxldCBfb2JqZWN0XHJcbiAgICAgIGlmKE1WQy5VdGlscy5pc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgLy8gQXJyYXlcclxuICAgICAgICByZXR1cm4gJ2FycmF5J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgTVZDLlV0aWxzLmlzT2JqZWN0KGRhdGEpXHJcbiAgICAgICkge1xyXG4gICAgICAgIC8vIE9iamVjdFxyXG4gICAgICAgIHJldHVybiAnb2JqZWN0J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgZGF0YSA9PT0gbnVsbFxyXG4gICAgICApIHtcclxuICAgICAgICAvLyBOdWxsXHJcbiAgICAgICAgcmV0dXJuICdudWxsJ1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBfb2JqZWN0XHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgY2FzZSAnbnVtYmVyJzpcclxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgcmV0dXJuIHR5cGVvZiBkYXRhXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5VdGlscy52YWxpZGF0ZURhdGFTY2hlbWEgPSBmdW5jdGlvbiB2YWxpZGF0ZURhdGFTY2hlbWEoZGF0YSwgc2NoZW1hKSB7XHJcbiAgaWYoc2NoZW1hKSB7XHJcbiAgICBzd2l0Y2goTVZDLlV0aWxzLnR5cGVPZihkYXRhKSkge1xyXG4gICAgICBjYXNlICdhcnJheSc6XHJcbiAgICAgICAgbGV0IGFycmF5ID0gW11cclxuICAgICAgICBzY2hlbWEgPSAoTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgPyBzY2hlbWEoKVxyXG4gICAgICAgICAgOiBzY2hlbWFcclxuICAgICAgICBpZihcclxuICAgICAgICAgIE1WQy5VdGlscy5pc0VxdWFsVHlwZShcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpLFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKGFycmF5KVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coc2NoZW1hLm5hbWUpXHJcbiAgICAgICAgICBmb3IobGV0IFthcnJheUtleSwgYXJyYXlWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGF0YSkpIHtcclxuICAgICAgICAgICAgYXJyYXkucHVzaChcclxuICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlRGF0YVNjaGVtYShhcnJheVZhbHVlKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnJheVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHt9XHJcbiAgICAgICAgc2NoZW1hID0gKE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgID8gc2NoZW1hKClcclxuICAgICAgICAgIDogc2NoZW1hXHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBNVkMuVXRpbHMuaXNFcXVhbFR5cGUoXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSxcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihvYmplY3QpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhzY2hlbWEubmFtZSlcclxuICAgICAgICAgIGZvcihsZXQgW29iamVjdEtleSwgb2JqZWN0VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XHJcbiAgICAgICAgICAgIG9iamVjdFtvYmplY3RLZXldID0gdGhpcy52YWxpZGF0ZURhdGFTY2hlbWEob2JqZWN0VmFsdWUsIHNjaGVtYVtvYmplY3RLZXldKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JqZWN0XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnc3RyaW5nJzpcclxuICAgICAgY2FzZSAnbnVtYmVyJzpcclxuICAgICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICAgICAgc2NoZW1hID0gKE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgID8gc2NoZW1hKClcclxuICAgICAgICAgIDogc2NoZW1hXHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBNVkMuVXRpbHMuaXNFcXVhbFR5cGUoXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSxcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihkYXRhKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coc2NoZW1hLm5hbWUpXHJcbiAgICAgICAgICByZXR1cm4gZGF0YVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aHJvdyBNVkMuVE1QTFxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdudWxsJzpcclxuICAgICAgICBpZihcclxuICAgICAgICAgIE1WQy5VdGlscy5pc0VxdWFsVHlwZShcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpLFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKGRhdGEpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICByZXR1cm4gZGF0YVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxyXG4gICAgICAgIHRocm93IE1WQy5UTVBMXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxyXG4gICAgICAgIHRocm93IE1WQy5UTVBMXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgTVZDLlRNUExcclxuICB9XHJcbn1cclxuIiwiTVZDLkNoYW5uZWxzID0gY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2NoYW5uZWxzKCkge1xyXG4gICAgdGhpcy5jaGFubmVscyA9ICh0aGlzLmNoYW5uZWxzKVxyXG4gICAgICA/IHRoaXMuY2hhbm5lbHNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbHNcclxuICB9XHJcbiAgY2hhbm5lbChjaGFubmVsTmFtZSkge1xyXG4gICAgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdID0gKHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXSlcclxuICAgICAgPyB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICAgICAgOiBuZXcgTVZDLkNoYW5uZWxzLkNoYW5uZWwoKVxyXG4gICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxuICBvZmYoY2hhbm5lbE5hbWUpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbn1cclxuIiwiTVZDLkNoYW5uZWxzLkNoYW5uZWwgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfcmVzcG9uc2VzKCkge1xyXG4gICAgdGhpcy5yZXNwb25zZXMgPSAodGhpcy5yZXNwb25zZXMpXHJcbiAgICAgID8gdGhpcy5yZXNwb25zZXNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMucmVzcG9uc2VzXHJcbiAgfVxyXG4gIHJlc3BvbnNlKHJlc3BvbnNlTmFtZSwgcmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgaWYocmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgICB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSA9IHJlc3BvbnNlQ2FsbGJhY2tcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VdXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlcXVlc3QocmVzcG9uc2VOYW1lLCByZXF1ZXN0RGF0YSkge1xyXG4gICAgaWYodGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0pIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKHJlcXVlc3REYXRhKVxyXG4gICAgfVxyXG4gIH1cclxuICBvZmYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZihyZXNwb25zZU5hbWUpIHtcclxuICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmb3IobGV0IFtyZXNwb25zZU5hbWVdIG9mIE9iamVjdC5rZXlzKHRoaXMuX3Jlc3BvbnNlcykpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJNVkMuQmFzZSA9IGNsYXNzIGV4dGVuZHMgTVZDLkV2ZW50cyB7XHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MsIGNvbmZpZ3VyYXRpb24pIHtcclxuICAgIHN1cGVyKClcclxuICAgIGlmKGNvbmZpZ3VyYXRpb24pIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uXHJcbiAgICBpZihzZXR0aW5ncykgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gIH1cclxuICBnZXQgX2NvbmZpZ3VyYXRpb24oKSB7XHJcbiAgICB0aGlzLmNvbmZpZ3VyYXRpb24gPSAodGhpcy5jb25maWd1cmF0aW9uKVxyXG4gICAgICA/IHRoaXMuY29uZmlndXJhdGlvblxyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uXHJcbiAgfVxyXG4gIHNldCBfY29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSB7IHRoaXMuY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb24gfVxyXG4gIGdldCBfc2V0dGluZ3MoKSB7XHJcbiAgICB0aGlzLnNldHRpbmdzID0gKHRoaXMuc2V0dGluZ3MpXHJcbiAgICAgID8gdGhpcy5zZXR0aW5nc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5nc1xyXG4gIH1cclxuICBzZXQgX3NldHRpbmdzKHNldHRpbmdzKSB7XHJcbiAgICB0aGlzLnNldHRpbmdzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcclxuICAgICAgc2V0dGluZ3MsIHRoaXMuX3NldHRpbmdzXHJcbiAgICApXHJcbiAgfVxyXG4gIGdldCBfZW1pdHRlcnMoKSB7XHJcbiAgICB0aGlzLmVtaXR0ZXJzID0gKHRoaXMuZW1pdHRlcnMpXHJcbiAgICAgID8gdGhpcy5lbWl0dGVyc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyc1xyXG4gIH1cclxuICBzZXQgX2VtaXR0ZXJzKGVtaXR0ZXJzKSB7XHJcbiAgICB0aGlzLmVtaXR0ZXJzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcclxuICAgICAgZW1pdHRlcnMsIHRoaXMuX2VtaXR0ZXJzXHJcbiAgICApXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5TZXJ2aWNlID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5kZWZhdWx0cyB8fCB7XG4gICAgY29udGVudFR5cGU6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSxcbiAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgfSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlcygpIHsgcmV0dXJuIFsnJywgJ2FycmF5YnVmZmVyJywgJ2Jsb2InLCAnZG9jdW1lbnQnLCAnanNvbicsICd0ZXh0J10gfVxuICBnZXQgX3Jlc3BvbnNlVHlwZSgpIHsgcmV0dXJuIHRoaXMucmVzcG9uc2VUeXBlIH1cbiAgc2V0IF9yZXNwb25zZVR5cGUocmVzcG9uc2VUeXBlKSB7XG4gICAgdGhpcy5feGhyLnJlc3BvbnNlVHlwZSA9IHRoaXMuX3Jlc3BvbnNlVHlwZXMuZmluZChcbiAgICAgIChyZXNwb25zZVR5cGVJdGVtKSA9PiByZXNwb25zZVR5cGVJdGVtID09PSByZXNwb25zZVR5cGVcbiAgICApIHx8IHRoaXMuX2RlZmF1bHRzLnJlc3BvbnNlVHlwZVxuICB9XG4gIGdldCBfdHlwZSgpIHsgcmV0dXJuIHRoaXMudHlwZSB9XG4gIHNldCBfdHlwZSh0eXBlKSB7IHRoaXMudHlwZSA9IHR5cGUgfVxuICBnZXQgX3VybCgpIHsgcmV0dXJuIHRoaXMudXJsIH1cbiAgc2V0IF91cmwodXJsKSB7IHRoaXMudXJsID0gdXJsIH1cbiAgZ2V0IF9oZWFkZXJzKCkgeyByZXR1cm4gdGhpcy5oZWFkZXJzIHx8IFtdIH1cbiAgc2V0IF9oZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLl9oZWFkZXJzLmxlbmd0aCA9IDBcbiAgICBoZWFkZXJzLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgdGhpcy5faGVhZGVycy5wdXNoKGhlYWRlcilcbiAgICAgIGhlYWRlciA9IE9iamVjdC5lbnRyaWVzKGhlYWRlcilbMF1cbiAgICAgIHRoaXMuX3hoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgIH0pXG4gIH1cbiAgZ2V0IF9kYXRhKCkgeyByZXR1cm4gdGhpcy5kYXRhIH1cbiAgc2V0IF9kYXRhKGRhdGEpIHsgdGhpcy5kYXRhID0gZGF0YSB9XG4gIGdldCBfeGhyKCkge1xuICAgIHRoaXMueGhyID0gKHRoaXMueGhyKVxuICAgICAgPyB0aGlzLnhoclxuICAgICAgOiBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHJldHVybiB0aGlzLnhoclxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICByZXF1ZXN0KGRhdGEpIHtcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLmRhdGEgfHwgbnVsbFxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZih0aGlzLl94aHIuc3RhdHVzID09PSAyMDApIHRoaXMuX3hoci5hYm9ydCgpXG4gICAgICB0aGlzLl94aHIub3Blbih0aGlzLnR5cGUsIHRoaXMudXJsKVxuICAgICAgdGhpcy5faGVhZGVycyA9IHRoaXMuc2V0dGluZ3MuaGVhZGVycyB8fCBbdGhpcy5fZGVmYXVsdHMuY29udGVudFR5cGVdXG4gICAgICB0aGlzLl94aHIub25sb2FkID0gcmVzb2x2ZVxuICAgICAgdGhpcy5feGhyLm9uZXJyb3IgPSByZWplY3RcbiAgICAgIHRoaXMuX3hoci5zZW5kKGRhdGEpXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgneGhyOnJlc29sdmUnLCB7XG4gICAgICAgIG5hbWU6ICd4aHI6cmVzb2x2ZScsXG4gICAgICAgIGRhdGE6IHJlc3BvbnNlLmN1cnJlbnRUYXJnZXQsXG4gICAgICB9KVxuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgIXRoaXMuZW5hYmxlZCAmJlxuICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgaWYoc2V0dGluZ3MudHlwZSkgdGhpcy5fdHlwZSA9IHNldHRpbmdzLnR5cGVcbiAgICAgIGlmKHNldHRpbmdzLnVybCkgdGhpcy5fdXJsID0gc2V0dGluZ3MudXJsXG4gICAgICBpZihzZXR0aW5ncy5kYXRhKSB0aGlzLl9kYXRhID0gc2V0dGluZ3MuZGF0YSB8fCBudWxsXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnJlc3BvbnNlVHlwZSkgdGhpcy5fcmVzcG9uc2VUeXBlID0gdGhpcy5fc2V0dGluZ3MucmVzcG9uc2VUeXBlXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgdGhpcy5lbmFibGVkICYmXG4gICAgICBPYmplY3Qua2V5cyhzZXR0aW5ncykubGVuZ3RoXG4gICAgKSB7XG4gICAgICBkZWxldGUgdGhpcy5fdHlwZVxuICAgICAgZGVsZXRlIHRoaXMuX3VybFxuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFcbiAgICAgIGRlbGV0ZSB0aGlzLl9oZWFkZXJzXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VUeXBlXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuIiwiTVZDLk1vZGVsID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgX2xvY2FsU3RvcmFnZSgpIHsgcmV0dXJuIHRoaXMubG9jYWxTdG9yYWdlIH1cbiAgc2V0IF9sb2NhbFN0b3JhZ2UobG9jYWxTdG9yYWdlKSB7IHRoaXMubG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yYWdlIH1cbiAgZ2V0IF9kZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuZGVmYXVsdHMgfVxuICBzZXQgX2RlZmF1bHRzKGRlZmF1bHRzKSB7IHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0cyB9XG4gIGdldCBfc2NoZW1hKCkgeyByZXR1cm4gdGhpcy5fc2NoZW1hIH1cbiAgc2V0IF9zY2hlbWEoc2NoZW1hKSB7IHRoaXMuc2NoZW1hID0gc2NoZW1hIH1cbiAgZ2V0IF9oaXN0aW9ncmFtKCkgeyByZXR1cm4gdGhpcy5oaXN0aW9ncmFtIHx8IHtcbiAgICBsZW5ndGg6IDFcbiAgfSB9XG4gIHNldCBfaGlzdGlvZ3JhbShoaXN0aW9ncmFtKSB7XG4gICAgdGhpcy5oaXN0aW9ncmFtID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHRoaXMuX2hpc3Rpb2dyYW0sXG4gICAgICBoaXN0aW9ncmFtXG4gICAgKVxuICB9XG4gIGdldCBfaGlzdG9yeSgpIHtcbiAgICB0aGlzLmhpc3RvcnkgPSAodGhpcy5oaXN0b3J5KVxuICAgICAgPyB0aGlzLmhpc3RvcnlcbiAgICAgIDogW11cbiAgICByZXR1cm4gdGhpcy5oaXN0b3J5XG4gIH1cbiAgc2V0IF9oaXN0b3J5KGRhdGEpIHtcbiAgICBpZihcbiAgICAgIE9iamVjdC5rZXlzKGRhdGEpLmxlbmd0aFxuICAgICkge1xuICAgICAgaWYodGhpcy5faGlzdGlvZ3JhbS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5faGlzdG9yeS51bnNoaWZ0KHRoaXMucGFyc2UoZGF0YSkpXG4gICAgICAgIHRoaXMuX2hpc3Rvcnkuc3BsaWNlKHRoaXMuX2hpc3Rpb2dyYW0ubGVuZ3RoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgX2RiKCkge1xuICAgIGxldCBkYiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KVxuICAgIHRoaXMuZGIgPSAoZGIpXG4gICAgICA/IGRiXG4gICAgICA6ICd7fSdcbiAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLmRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICBnZXQgX2RhdGEoKSB7XG4gICAgdGhpcy5kYXRhID0gICh0aGlzLmRhdGEpXG4gICAgICA/IHRoaXMuZGF0YVxuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmRhdGFcbiAgfVxuICBnZXQgX2RhdGFFdmVudHMoKSB7XG4gICAgdGhpcy5kYXRhRXZlbnRzID0gKHRoaXMuZGF0YUV2ZW50cylcbiAgICAgID8gdGhpcy5kYXRhRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YUV2ZW50c1xuICB9XG4gIHNldCBfZGF0YUV2ZW50cyhkYXRhRXZlbnRzKSB7XG4gICAgdGhpcy5kYXRhRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGRhdGFFdmVudHMsIHRoaXMuX2RhdGFFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9kYXRhQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuZGF0YUNhbGxiYWNrcyA9ICh0aGlzLmRhdGFDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuZGF0YUNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmRhdGFDYWxsYmFja3NcbiAgfVxuICBzZXQgX2RhdGFDYWxsYmFja3MoZGF0YUNhbGxiYWNrcykge1xuICAgIHRoaXMuZGF0YUNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBkYXRhQ2FsbGJhY2tzLCB0aGlzLl9kYXRhQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfc2VydmljZXMoKSB7XG4gICAgdGhpcy5zZXJ2aWNlcyA9ICAodGhpcy5zZXJ2aWNlcylcbiAgICAgID8gdGhpcy5zZXJ2aWNlc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnNlcnZpY2VzXG4gIH1cbiAgc2V0IF9zZXJ2aWNlcyhzZXJ2aWNlcykge1xuICAgIHRoaXMuc2VydmljZXMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgc2VydmljZXMsIHRoaXMuX3NlcnZpY2VzXG4gICAgKVxuICB9XG4gIGdldCBfc2VydmljZUV2ZW50cygpIHtcbiAgICB0aGlzLnNlcnZpY2VFdmVudHMgPSAodGhpcy5zZXJ2aWNlRXZlbnRzKVxuICAgICAgPyB0aGlzLnNlcnZpY2VFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5zZXJ2aWNlRXZlbnRzXG4gIH1cbiAgc2V0IF9zZXJ2aWNlRXZlbnRzKHNlcnZpY2VFdmVudHMpIHtcbiAgICB0aGlzLnNlcnZpY2VFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgc2VydmljZUV2ZW50cywgdGhpcy5fc2VydmljZUV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX3NlcnZpY2VDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzID0gKHRoaXMuc2VydmljZUNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICB9XG4gIHNldCBfc2VydmljZUNhbGxiYWNrcyhzZXJ2aWNlQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHNlcnZpY2VDYWxsYmFja3MsIHRoaXMuX3NlcnZpY2VDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGVuYWJsZVNlcnZpY2VFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5zZXJ2aWNlRXZlbnRzLCB0aGlzLnNlcnZpY2VzLCB0aGlzLnNlcnZpY2VDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZVNlcnZpY2VFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMuc2VydmljZUV2ZW50cywgdGhpcy5zZXJ2aWNlcywgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZURhdGFFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5kYXRhRXZlbnRzLCB0aGlzLCB0aGlzLmRhdGFDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZURhdGFFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMuZGF0YUV2ZW50cywgdGhpcywgdGhpcy5kYXRhQ2FsbGJhY2tzKVxuICB9XG4gIHNldERlZmF1bHRzKCkge1xuICAgIGxldCBfZGVmYXVsdHMgPSB7fVxuICAgIGlmKHRoaXMuZGVmYXVsdHMpIE9iamVjdC5hc3NpZ24oX2RlZmF1bHRzLCB0aGlzLmRlZmF1bHRzKVxuICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlKSBPYmplY3QuYXNzaWduKF9kZWZhdWx0cywgdGhpcy5fZGIpXG4gICAgaWYoT2JqZWN0LmtleXMoX2RlZmF1bHRzKSkgdGhpcy5zZXQoX2RlZmF1bHRzKVxuICB9XG4gIGdldCgpIHtcbiAgICBsZXQgcHJvcGVydHkgPSBhcmd1bWVudHNbMF1cbiAgICByZXR1cm4gdGhpcy5fZGF0YVsnXycuY29uY2F0KHByb3BlcnR5KV1cbiAgfVxuICBzZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgICAuZm9yRWFjaCgoW2tleSwgdmFsdWVdLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSlcbiAgICAgICAgICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlKSB0aGlzLnNldERCKGtleSwgdmFsdWUpXG4gICAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgdmFyIGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICB2YXIgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSlcbiAgICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIHRoaXMuc2V0REIoa2V5LCB2YWx1ZSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5fZGF0YSkpIHtcbiAgICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgICBicmVha1xuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHNldERCKCkge1xuICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdmFyIF9hcmd1bWVudHMgPSBPYmplY3QuZW50cmllcyhhcmd1bWVudHNbMF0pXG4gICAgICAgIF9hcmd1bWVudHMuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgZGJba2V5XSA9IHZhbHVlXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgbGV0IHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICBicmVha1xuICAgIH1cbiAgICB0aGlzLl9kYiA9IGRiXG4gIH1cbiAgdW5zZXREQigpIHtcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBkZWxldGUgdGhpcy5fZGJcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBkZWxldGUgZGJba2V5XVxuICAgICAgICB0aGlzLl9kYiA9IGRiXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKSB7XG4gICAgaWYoIXRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXSkge1xuICAgICAgbGV0IGNvbnRleHQgPSB0aGlzXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhcbiAgICAgICAgdGhpcy5fZGF0YSxcbiAgICAgICAge1xuICAgICAgICAgIFsnXycuY29uY2F0KGtleSldOiB7XG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzW2tleV0gfSxcbiAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgICBsZXQgc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3NldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgICAgICAgICAgICBsZXQgc2V0RXZlbnROYW1lID0gJ3NldCdcbiAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgIHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gICAgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldID0gdmFsdWVcbiAgfVxuICB1bnNldERhdGFQcm9wZXJ0eShrZXkpIHtcbiAgICBsZXQgdW5zZXRWYWx1ZUV2ZW50TmFtZSA9IFsndW5zZXQnLCAnOicsIGtleV0uam9pbignJylcbiAgICBsZXQgdW5zZXRFdmVudE5hbWUgPSAndW5zZXQnXG4gICAgbGV0IHVuc2V0VmFsdWUgPSB0aGlzLl9kYXRhW2tleV1cbiAgICBkZWxldGUgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldXG4gICAgZGVsZXRlIHRoaXMuX2RhdGFba2V5XVxuICAgIHRoaXMuZW1pdChcbiAgICAgIHVuc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IHVuc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIClcbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldEV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIClcbiAgfVxuICBwYXJzZShkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5fZGF0YVxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KE9iamVjdC5hc3NpZ24oe30sIGRhdGEpKSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MubG9jYWxTdG9yYWdlKSB0aGlzLl9sb2NhbFN0b3JhZ2UgPSB0aGlzLnNldHRpbmdzLmxvY2FsU3RvcmFnZVxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5oaXN0aW9ncmFtKSB0aGlzLl9oaXN0aW9ncmFtID0gdGhpcy5zZXR0aW5ncy5oaXN0aW9ncmFtXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmVtaXR0ZXJzKSB0aGlzLl9lbWl0dGVycyA9IHRoaXMuc2V0dGluZ3MuZW1pdHRlcnNcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3Muc2VydmljZXMpIHRoaXMuX3NlcnZpY2VzID0gdGhpcy5zZXR0aW5ncy5zZXJ2aWNlc1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5zZXJ2aWNlQ2FsbGJhY2tzKSB0aGlzLl9zZXJ2aWNlQ2FsbGJhY2tzID0gdGhpcy5zZXR0aW5ncy5zZXJ2aWNlQ2FsbGJhY2tzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnNlcnZpY2VFdmVudHMpIHRoaXMuX3NlcnZpY2VFdmVudHMgPSB0aGlzLnNldHRpbmdzLnNlcnZpY2VFdmVudHNcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGF0YSkgdGhpcy5zZXQodGhpcy5zZXR0aW5ncy5kYXRhKVxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5kYXRhQ2FsbGJhY2tzKSB0aGlzLl9kYXRhQ2FsbGJhY2tzID0gdGhpcy5zZXR0aW5ncy5kYXRhQ2FsbGJhY2tzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRhdGFFdmVudHMpIHRoaXMuX2RhdGFFdmVudHMgPSB0aGlzLnNldHRpbmdzLmRhdGFFdmVudHNcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3Muc2NoZW1hKSB0aGlzLl9zY2hlbWEgPSB0aGlzLnNldHRpbmdzLnNjaGVtYVxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5kZWZhdWx0cykgdGhpcy5fZGVmYXVsdHMgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzXG4gICAgICBpZihcbiAgICAgICAgdGhpcy5zZXJ2aWNlcyAmJlxuICAgICAgICB0aGlzLnNlcnZpY2VFdmVudHMgJiZcbiAgICAgICAgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5lbmFibGVTZXJ2aWNlRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmRhdGFFdmVudHMgJiZcbiAgICAgICAgdGhpcy5kYXRhQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5lbmFibGVEYXRhRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgfVxuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnNlcnZpY2VzICYmXG4gICAgICAgIHRoaXMuc2VydmljZUV2ZW50cyAmJlxuICAgICAgICB0aGlzLnNlcnZpY2VDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVTZXJ2aWNlRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmRhdGFFdmVudHMgJiZcbiAgICAgICAgdGhpcy5kYXRhQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlRGF0YUV2ZW50cygpXG4gICAgICB9XG4gICAgICBkZWxldGUgdGhpcy5fbG9jYWxTdG9yYWdlXG4gICAgICBkZWxldGUgdGhpcy5faGlzdGlvZ3JhbVxuICAgICAgZGVsZXRlIHRoaXMuX3NlcnZpY2VzXG4gICAgICBkZWxldGUgdGhpcy5fc2VydmljZUNhbGxiYWNrc1xuICAgICAgZGVsZXRlIHRoaXMuX3NlcnZpY2VFdmVudHNcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YUNhbGxiYWNrc1xuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFFdmVudHNcbiAgICAgIGRlbGV0ZSB0aGlzLl9zY2hlbWFcbiAgICAgIGRlbGV0ZSB0aGlzLl9lbWl0dGVyc1xuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICB9XG59XG4iLCJNVkMuRW1pdHRlciA9IGNsYXNzIGV4dGVuZHMgTVZDLk1vZGVsIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICAgIGlmKHRoaXMuc2V0dGluZ3MpIHtcclxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5uYW1lKSB0aGlzLl9uYW1lID0gdGhpcy5zZXR0aW5ncy5uYW1lXHJcbiAgICB9XHJcbiAgfVxyXG4gIGdldCBfbmFtZSgpIHsgcmV0dXJuIHRoaXMubmFtZSB9XHJcbiAgc2V0IF9uYW1lKG5hbWUpIHsgdGhpcy5uYW1lID0gbmFtZSB9XHJcbiAgZW1pc3Npb24oKSB7XHJcbiAgICBsZXQgZXZlbnREYXRhID0ge1xyXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXHJcbiAgICAgIGRhdGE6IHRoaXMuZGF0YVxyXG4gICAgfVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICB0aGlzLm5hbWUsXHJcbiAgICAgIGV2ZW50RGF0YVxyXG4gICAgKVxyXG4gICAgcmV0dXJuIGV2ZW50RGF0YVxyXG4gIH1cclxufVxyXG4iLCJNVkMuVmlldyA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IF9lbGVtZW50TmFtZSgpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQudGFnTmFtZSB9XG4gIHNldCBfZWxlbWVudE5hbWUoZWxlbWVudE5hbWUpIHtcbiAgICBpZighdGhpcy5fZWxlbWVudCkgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudE5hbWUpXG4gIH1cbiAgZ2V0IF9lbGVtZW50KCkgeyByZXR1cm4gdGhpcy5lbGVtZW50IH1cbiAgc2V0IF9lbGVtZW50KGVsZW1lbnQpIHtcbiAgICBpZihcbiAgICAgIGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxuICAgICAgZWxlbWVudCBpbnN0YW5jZW9mIERvY3VtZW50XG4gICAgKSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgfSBlbHNlIGlmKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50KVxuICAgIH1cbiAgICB0aGlzLmVsZW1lbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudCwge1xuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICB9KVxuICB9XG4gIGdldCBfYXR0cmlidXRlcygpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQuYXR0cmlidXRlcyB9XG4gIHNldCBfYXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgZm9yKGxldCBbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGVWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlS2V5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IF91aSgpIHtcbiAgICB0aGlzLnVpID0gKHRoaXMudWkpXG4gICAgICA/IHRoaXMudWlcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy51aVxuICB9XG4gIHNldCBfdWkodWkpIHtcbiAgICBpZighdGhpcy5fdWlbJyRlbGVtZW50J10pIHRoaXMuX3VpWyckZWxlbWVudCddID0gdGhpcy5lbGVtZW50XG4gICAgZm9yKGxldCBbdWlLZXksIHVpVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHVpKSkge1xuICAgICAgaWYodHlwZW9mIHVpVmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuX3VpW3VpS2V5XSA9IHRoaXMuX2VsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh1aVZhbHVlKVxuICAgICAgfSBlbHNlIGlmKFxuICAgICAgICB1aVZhbHVlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcbiAgICAgICAgdWlWYWx1ZSBpbnN0YW5jZW9mIERvY3VtZW50XG4gICAgICApIHtcbiAgICAgICAgdGhpcy5fdWlbdWlLZXldID0gdWlWYWx1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgX3VpRXZlbnRzKCkgeyByZXR1cm4gdGhpcy51aUV2ZW50cyB9XG4gIHNldCBfdWlFdmVudHModWlFdmVudHMpIHsgdGhpcy51aUV2ZW50cyA9IHVpRXZlbnRzIH1cbiAgZ2V0IF91aUNhbGxiYWNrcygpIHtcbiAgICB0aGlzLnVpQ2FsbGJhY2tzID0gKHRoaXMudWlDYWxsYmFja3MpXG4gICAgICA/IHRoaXMudWlDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy51aUNhbGxiYWNrc1xuICB9XG4gIHNldCBfdWlDYWxsYmFja3ModWlDYWxsYmFja3MpIHtcbiAgICB0aGlzLnVpQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHVpQ2FsbGJhY2tzLCB0aGlzLl91aUNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX29ic2VydmVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3MgPSAodGhpcy5vYnNlcnZlckNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5vYnNlcnZlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9vYnNlcnZlckNhbGxiYWNrcyhvYnNlcnZlckNhbGxiYWNrcykge1xuICAgIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgb2JzZXJ2ZXJDYWxsYmFja3MsIHRoaXMuX29ic2VydmVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBlbGVtZW50T2JzZXJ2ZXIoKSB7XG4gICAgdGhpcy5fZWxlbWVudE9ic2VydmVyID0gKHRoaXMuX2VsZW1lbnRPYnNlcnZlcilcbiAgICAgID8gdGhpcy5fZWxlbWVudE9ic2VydmVyXG4gICAgICA6IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuZWxlbWVudE9ic2VydmUuYmluZCh0aGlzKSlcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudE9ic2VydmVyXG4gIH1cbiAgZ2V0IF9pbnNlcnQoKSB7IHJldHVybiB0aGlzLmluc2VydCB9XG4gIHNldCBfaW5zZXJ0KGluc2VydCkgeyB0aGlzLmluc2VydCA9IGluc2VydCB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICBnZXQgX3RlbXBsYXRlcygpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9ICh0aGlzLnRlbXBsYXRlcylcbiAgICAgID8gdGhpcy50ZW1wbGF0ZXNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZXNcbiAgfVxuICBzZXQgX3RlbXBsYXRlcyh0ZW1wbGF0ZXMpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB0ZW1wbGF0ZXMsIHRoaXMuX3RlbXBsYXRlc1xuICAgIClcbiAgfVxuICBlbGVtZW50T2JzZXJ2ZShtdXRhdGlvblJlY29yZExpc3QsIG9ic2VydmVyKSB7XG4gICAgZm9yKGxldCBbbXV0YXRpb25SZWNvcmRJbmRleCwgbXV0YXRpb25SZWNvcmRdIG9mIE9iamVjdC5lbnRyaWVzKG11dGF0aW9uUmVjb3JkTGlzdCkpIHtcbiAgICAgIHN3aXRjaChtdXRhdGlvblJlY29yZC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2NoaWxkTGlzdCc6XG4gICAgICAgICAgbGV0IG11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcyA9IFsnYWRkZWROb2RlcycsICdyZW1vdmVkTm9kZXMnXVxuICAgICAgICAgIGZvcihsZXQgbXV0YXRpb25SZWNvcmRDYXRlZ29yeSBvZiBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMpIHtcbiAgICAgICAgICAgIGlmKG11dGF0aW9uUmVjb3JkW211dGF0aW9uUmVjb3JkQ2F0ZWdvcnldLmxlbmd0aCkge1xuICAgICAgICAgICAgICB0aGlzLnJlc2V0VUkoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBhdXRvSW5zZXJ0KCkge1xuICAgIGlmKHRoaXMuaW5zZXJ0KSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuaW5zZXJ0LmVsZW1lbnQpXG4gICAgICAuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICBlbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCh0aGlzLmluc2VydC5tZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIGF1dG9SZW1vdmUoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLmVsZW1lbnQgJiZcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50XG4gICAgKSB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpXG4gIH1cbiAgZW5hYmxlRWxlbWVudChzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKHNldHRpbmdzLmVsZW1lbnROYW1lKSB0aGlzLl9lbGVtZW50TmFtZSA9IHNldHRpbmdzLmVsZW1lbnROYW1lXG4gICAgaWYoc2V0dGluZ3MuZWxlbWVudCkgdGhpcy5fZWxlbWVudCA9IHNldHRpbmdzLmVsZW1lbnRcbiAgICBpZihzZXR0aW5ncy5hdHRyaWJ1dGVzKSB0aGlzLl9hdHRyaWJ1dGVzID0gc2V0dGluZ3MuYXR0cmlidXRlc1xuICAgIGlmKHNldHRpbmdzLnRlbXBsYXRlcykgdGhpcy5fdGVtcGxhdGVzID0gc2V0dGluZ3MudGVtcGxhdGVzXG4gICAgaWYoc2V0dGluZ3MuaW5zZXJ0KSB0aGlzLl9pbnNlcnQgPSBzZXR0aW5ncy5pbnNlcnRcbiAgfVxuICBkaXNhYmxlRWxlbWVudChzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgdGhpcy5lbGVtZW50ICYmXG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICkgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIGlmKHRoaXMuZWxlbWVudCkgZGVsZXRlIHRoaXMuZWxlbWVudFxuICAgIGlmKHRoaXMuYXR0cmlidXRlcykgZGVsZXRlIHRoaXMuYXR0cmlidXRlc1xuICAgIGlmKHRoaXMudGVtcGxhdGVzKSBkZWxldGUgdGhpcy50ZW1wbGF0ZXNcbiAgICBpZih0aGlzLmluc2VydCkgZGVsZXRlIHRoaXMuaW5zZXJ0XG4gIH1cbiAgcmVzZXRVSSgpIHtcbiAgICB0aGlzLmRpc2FibGVVSSgpXG4gICAgdGhpcy5lbmFibGVVSSgpXG4gIH1cbiAgZW5hYmxlVUkoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihzZXR0aW5ncy51aSkgdGhpcy5fdWkgPSBzZXR0aW5ncy51aVxuICAgIGlmKHNldHRpbmdzLnVpQ2FsbGJhY2tzKSB0aGlzLl91aUNhbGxiYWNrcyA9IHNldHRpbmdzLnVpQ2FsbGJhY2tzXG4gICAgaWYoc2V0dGluZ3MudWlFdmVudHMpIHtcbiAgICAgIHRoaXMuX3VpRXZlbnRzID0gc2V0dGluZ3MudWlFdmVudHNcbiAgICAgIHRoaXMuZW5hYmxlVUlFdmVudHMoKVxuICAgIH1cbiAgfVxuICBkaXNhYmxlVUkoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihzZXR0aW5ncy51aUV2ZW50cykge1xuICAgICAgdGhpcy5kaXNhYmxlVUlFdmVudHMoKVxuICAgICAgZGVsZXRlIHRoaXMuX3VpRXZlbnRzXG4gICAgfVxuICAgIGRlbGV0ZSB0aGlzLnVpRXZlbnRzXG4gICAgZGVsZXRlIHRoaXMudWlcbiAgICBkZWxldGUgdGhpcy51aUNhbGxiYWNrc1xuICB9XG4gIGVuYWJsZVVJRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy51aUV2ZW50cyAmJlxuICAgICAgdGhpcy51aSAmJlxuICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMoXG4gICAgICAgIHRoaXMudWlFdmVudHMsXG4gICAgICAgIHRoaXMudWksXG4gICAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgZGlzYWJsZVVJRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy51aUV2ZW50cyAmJlxuICAgICAgdGhpcy51aSAmJlxuICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKFxuICAgICAgICB0aGlzLnVpRXZlbnRzLFxuICAgICAgICB0aGlzLnVpLFxuICAgICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgICApXG4gICAgfVxuICB9XG4gIGVuYWJsZUVtaXR0ZXJzKCkge1xuICAgIGlmKHRoaXMuc2V0dGluZ3MuZW1pdHRlcnMpIHRoaXMuX2VtaXR0ZXJzID0gdGhpcy5zZXR0aW5ncy5lbWl0dGVyc1xuICB9XG4gIGRpc2FibGVFbWl0dGVycygpIHtcbiAgICBpZih0aGlzLl9lbWl0dGVycykgZGVsZXRlIHRoaXMuX2VtaXR0ZXJzXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5fZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5lbmFibGVFbWl0dGVycygpXG4gICAgICB0aGlzLmVuYWJsZUVsZW1lbnQoc2V0dGluZ3MpXG4gICAgICB0aGlzLmVuYWJsZVVJKHNldHRpbmdzKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgIHRoaXMuX2VuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZGlzYWJsZVVJKHNldHRpbmdzKVxuICAgICAgdGhpcy5kaXNhYmxlRWxlbWVudChzZXR0aW5ncylcbiAgICAgIHRoaXMuZGlzYWJsZUVtaXR0ZXJzKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgICAgcmV0dXJuIHRoaXNzXG4gICAgfVxuICB9XG59XG4iLCJNVkMuQ29udHJvbGxlciA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IF9lbWl0dGVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuZW1pdHRlckNhbGxiYWNrcyA9ICh0aGlzLmVtaXR0ZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuZW1pdHRlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX2VtaXR0ZXJDYWxsYmFja3MoZW1pdHRlckNhbGxiYWNrcykge1xuICAgIHRoaXMuZW1pdHRlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBlbWl0dGVyQ2FsbGJhY2tzLCB0aGlzLl9lbWl0dGVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfbW9kZWxDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5tb2RlbENhbGxiYWNrcyA9ICh0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgfVxuICBzZXQgX21vZGVsQ2FsbGJhY2tzKG1vZGVsQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5tb2RlbENhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBtb2RlbENhbGxiYWNrcywgdGhpcy5fbW9kZWxDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF92aWV3Q2FsbGJhY2tzKCkge1xuICAgIHRoaXMudmlld0NhbGxiYWNrcyA9ICh0aGlzLnZpZXdDYWxsYmFja3MpXG4gICAgICA/IHRoaXMudmlld0NhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnZpZXdDYWxsYmFja3NcbiAgfVxuICBzZXQgX3ZpZXdDYWxsYmFja3Modmlld0NhbGxiYWNrcykge1xuICAgIHRoaXMudmlld0NhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB2aWV3Q2FsbGJhY2tzLCB0aGlzLl92aWV3Q2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlckNhbGxiYWNrcygpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MgPSAodGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9jb250cm9sbGVyQ2FsbGJhY2tzKGNvbnRyb2xsZXJDYWxsYmFja3MpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlckNhbGxiYWNrcywgdGhpcy5fY29udHJvbGxlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVscygpIHtcbiAgICB0aGlzLm1vZGVscyA9ICh0aGlzLm1vZGVscylcbiAgICAgID8gdGhpcy5tb2RlbHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5tb2RlbHNcbiAgfVxuICBzZXQgX21vZGVscyhtb2RlbHMpIHtcbiAgICB0aGlzLm1vZGVscyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBtb2RlbHMsIHRoaXMuX21vZGVsc1xuICAgIClcbiAgfVxuICBnZXQgX3ZpZXdzKCkge1xuICAgIHRoaXMudmlld3MgPSAodGhpcy52aWV3cylcbiAgICAgID8gdGhpcy52aWV3c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnZpZXdzXG4gIH1cbiAgc2V0IF92aWV3cyh2aWV3cykge1xuICAgIHRoaXMudmlld3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld3MsIHRoaXMuX3ZpZXdzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlcnMoKSB7XG4gICAgdGhpcy5jb250cm9sbGVycyA9ICh0aGlzLmNvbnRyb2xsZXJzKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlcnNcbiAgfVxuICBzZXQgX2NvbnRyb2xsZXJzKGNvbnRyb2xsZXJzKSB7XG4gICAgdGhpcy5jb250cm9sbGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBjb250cm9sbGVycywgdGhpcy5fY29udHJvbGxlcnNcbiAgICApXG4gIH1cbiAgZ2V0IF9yb3V0ZXJzKCkge1xuICAgIHRoaXMucm91dGVycyA9ICh0aGlzLnJvdXRlcnMpXG4gICAgICA/IHRoaXMucm91dGVyc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlcnNcbiAgfVxuICBzZXQgX3JvdXRlcnMocm91dGVycykge1xuICAgIHRoaXMucm91dGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXJzLCB0aGlzLl9yb3V0ZXJzXG4gICAgKVxuICB9XG4gIGdldCBfcm91dGVyRXZlbnRzKCkge1xuICAgIHRoaXMucm91dGVyRXZlbnRzID0gKHRoaXMucm91dGVyRXZlbnRzKVxuICAgICAgPyB0aGlzLnJvdXRlckV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlckV2ZW50c1xuICB9XG4gIHNldCBfcm91dGVyRXZlbnRzKHJvdXRlckV2ZW50cykge1xuICAgIHRoaXMucm91dGVyRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlckV2ZW50cywgdGhpcy5fcm91dGVyRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfcm91dGVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMucm91dGVyQ2FsbGJhY2tzID0gKHRoaXMucm91dGVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLnJvdXRlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlckNhbGxiYWNrc1xuICB9XG4gIHNldCBfcm91dGVyQ2FsbGJhY2tzKHJvdXRlckNhbGxiYWNrcykge1xuICAgIHRoaXMucm91dGVyQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlckNhbGxiYWNrcywgdGhpcy5fcm91dGVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfZW1pdHRlckV2ZW50cygpIHtcbiAgICB0aGlzLmVtaXR0ZXJFdmVudHMgPSAodGhpcy5lbWl0dGVyRXZlbnRzKVxuICAgICAgPyB0aGlzLmVtaXR0ZXJFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyRXZlbnRzXG4gIH1cbiAgc2V0IF9lbWl0dGVyRXZlbnRzKGVtaXR0ZXJFdmVudHMpIHtcbiAgICB0aGlzLmVtaXR0ZXJFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgZW1pdHRlckV2ZW50cywgdGhpcy5fZW1pdHRlckV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVsRXZlbnRzKCkge1xuICAgIHRoaXMubW9kZWxFdmVudHMgPSAodGhpcy5tb2RlbEV2ZW50cylcbiAgICAgID8gdGhpcy5tb2RlbEV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm1vZGVsRXZlbnRzXG4gIH1cbiAgc2V0IF9tb2RlbEV2ZW50cyhtb2RlbEV2ZW50cykge1xuICAgIHRoaXMubW9kZWxFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgbW9kZWxFdmVudHMsIHRoaXMuX21vZGVsRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfdmlld0V2ZW50cygpIHtcbiAgICB0aGlzLnZpZXdFdmVudHMgPSAodGhpcy52aWV3RXZlbnRzKVxuICAgICAgPyB0aGlzLnZpZXdFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy52aWV3RXZlbnRzXG4gIH1cbiAgc2V0IF92aWV3RXZlbnRzKHZpZXdFdmVudHMpIHtcbiAgICB0aGlzLnZpZXdFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld0V2ZW50cywgdGhpcy5fdmlld0V2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgdGhpcy5jb250cm9sbGVyRXZlbnRzID0gKHRoaXMuY29udHJvbGxlckV2ZW50cylcbiAgICAgID8gdGhpcy5jb250cm9sbGVyRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlckV2ZW50c1xuICB9XG4gIHNldCBfY29udHJvbGxlckV2ZW50cyhjb250cm9sbGVyRXZlbnRzKSB7XG4gICAgdGhpcy5jb250cm9sbGVyRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGNvbnRyb2xsZXJFdmVudHMsIHRoaXMuX2NvbnRyb2xsZXJFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGVuYWJsZU1vZGVsRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMubW9kZWxFdmVudHMsIHRoaXMubW9kZWxzLCB0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVNb2RlbEV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5tb2RlbEV2ZW50cywgdGhpcy5tb2RlbHMsIHRoaXMubW9kZWxDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlVmlld0V2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnZpZXdFdmVudHMsIHRoaXMudmlld3MsIHRoaXMudmlld0NhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlVmlld0V2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy52aWV3RXZlbnRzLCB0aGlzLnZpZXdzLCB0aGlzLnZpZXdDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlQ29udHJvbGxlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmNvbnRyb2xsZXJFdmVudHMsIHRoaXMuY29udHJvbGxlcnMsIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlQ29udHJvbGxlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5jb250cm9sbGVyRXZlbnRzLCB0aGlzLmNvbnRyb2xsZXJzLCB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlRW1pdHRlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmVtaXR0ZXJFdmVudHMsIHRoaXMuZW1pdHRlcnMsIHRoaXMuZW1pdHRlckNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlRW1pdHRlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5lbWl0dGVyRXZlbnRzLCB0aGlzLmVtaXR0ZXJzLCB0aGlzLmVtaXR0ZXJDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlUm91dGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMucm91dGVyRXZlbnRzLCB0aGlzLnJvdXRlcnMsIHRoaXMucm91dGVyQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVSb3V0ZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMucm91dGVyRXZlbnRzLCB0aGlzLnJvdXRlcnMsIHRoaXMucm91dGVyQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgaWYoc2V0dGluZ3MubW9kZWxDYWxsYmFja3MpIHRoaXMuX21vZGVsQ2FsbGJhY2tzID0gc2V0dGluZ3MubW9kZWxDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLnZpZXdDYWxsYmFja3MpIHRoaXMuX3ZpZXdDYWxsYmFja3MgPSBzZXR0aW5ncy52aWV3Q2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5jb250cm9sbGVyQ2FsbGJhY2tzKSB0aGlzLl9jb250cm9sbGVyQ2FsbGJhY2tzID0gc2V0dGluZ3MuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3MuZW1pdHRlckNhbGxiYWNrcykgdGhpcy5fZW1pdHRlckNhbGxiYWNrcyA9IHNldHRpbmdzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLnJvdXRlckNhbGxiYWNrcykgdGhpcy5fcm91dGVyQ2FsbGJhY2tzID0gc2V0dGluZ3Mucm91dGVyQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5tb2RlbHMpIHRoaXMuX21vZGVscyA9IHNldHRpbmdzLm1vZGVsc1xuICAgICAgaWYoc2V0dGluZ3Mudmlld3MpIHRoaXMuX3ZpZXdzID0gc2V0dGluZ3Mudmlld3NcbiAgICAgIGlmKHNldHRpbmdzLmNvbnRyb2xsZXJzKSB0aGlzLl9jb250cm9sbGVycyA9IHNldHRpbmdzLmNvbnRyb2xsZXJzXG4gICAgICBpZihzZXR0aW5ncy5lbWl0dGVycykgdGhpcy5fZW1pdHRlcnMgPSBzZXR0aW5ncy5lbWl0dGVyc1xuICAgICAgaWYoc2V0dGluZ3Mucm91dGVycykgdGhpcy5fcm91dGVycyA9IHNldHRpbmdzLnJvdXRlcnNcbiAgICAgIGlmKHNldHRpbmdzLm1vZGVsRXZlbnRzKSB0aGlzLl9tb2RlbEV2ZW50cyA9IHNldHRpbmdzLm1vZGVsRXZlbnRzXG4gICAgICBpZihzZXR0aW5ncy52aWV3RXZlbnRzKSB0aGlzLl92aWV3RXZlbnRzID0gc2V0dGluZ3Mudmlld0V2ZW50c1xuICAgICAgaWYoc2V0dGluZ3MuY29udHJvbGxlckV2ZW50cykgdGhpcy5fY29udHJvbGxlckV2ZW50cyA9IHNldHRpbmdzLmNvbnRyb2xsZXJFdmVudHNcbiAgICAgIGlmKHNldHRpbmdzLmVtaXR0ZXJFdmVudHMpIHRoaXMuX2VtaXR0ZXJFdmVudHMgPSBzZXR0aW5ncy5lbWl0dGVyRXZlbnRzXG4gICAgICBpZihzZXR0aW5ncy5yb3V0ZXJFdmVudHMpIHRoaXMuX3JvdXRlckV2ZW50cyA9IHNldHRpbmdzLnJvdXRlckV2ZW50c1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMubW9kZWxFdmVudHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbENhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlTW9kZWxFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMudmlld0V2ZW50cyAmJlxuICAgICAgICB0aGlzLnZpZXdzICYmXG4gICAgICAgIHRoaXMudmlld0NhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlVmlld0V2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5jb250cm9sbGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5lbmFibGVDb250cm9sbGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnJvdXRlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLnJvdXRlcnMgJiZcbiAgICAgICAgdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZVJvdXRlckV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5lbWl0dGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZW1pdHRlcnMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5lbmFibGVFbWl0dGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgfVxuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZGlzYWJsZSgpXG4gICAgdGhpcy5lbmFibGUoKVxuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgIHRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMubW9kZWxFdmVudHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbENhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZU1vZGVsRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnZpZXdFdmVudHMgJiZcbiAgICAgICAgdGhpcy52aWV3cyAmJlxuICAgICAgICB0aGlzLnZpZXdDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVWaWV3RXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVycyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVDb250cm9sbGVyRXZlbnRzKClcbiAgICAgIH19XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5yb3V0ZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5yb3V0ZXJzICYmXG4gICAgICAgIHRoaXMucm91dGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlUm91dGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmVtaXR0ZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVycyAmJlxuICAgICAgICB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVFbWl0dGVyRXZlbnRzKClcbiAgICAgICAgZGVsZXRlIHRoaXMuX21vZGVsQ2FsbGJhY2tzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl92aWV3Q2FsbGJhY2tzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yb3V0ZXJDYWxsYmFja3NcbiAgICAgICAgZGVsZXRlIHRoaXMuX21vZGVsc1xuICAgICAgICBkZWxldGUgdGhpcy5fdmlld3NcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9lbWl0dGVyc1xuICAgICAgICBkZWxldGUgdGhpcy5fcm91dGVyc1xuICAgICAgICBkZWxldGUgdGhpcy5fcm91dGVyRXZlbnRzXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9tb2RlbEV2ZW50c1xuICAgICAgICBkZWxldGUgdGhpcy5fdmlld0V2ZW50c1xuICAgICAgICBkZWxldGUgdGhpcy5fY29udHJvbGxlckV2ZW50c1xuICAgICAgICBkZWxldGUgdGhpcy5fZW1pdHRlckV2ZW50c1xuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICB9XG59XG4iLCJNVkMuRW1pdHRlcnMuTmF2aWdhdGUgPSBjbGFzcyBleHRlbmRzIE1WQy5FbWl0dGVyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICAgIHRoaXMuYWRkU2V0dGluZ3MoKVxyXG4gICAgdGhpcy5lbmFibGUoKVxyXG4gIH1cclxuICBhZGRTZXR0aW5ncygpIHtcclxuICAgIHRoaXMuX25hbWUgPSAnbmF2aWdhdGUnXHJcbiAgICB0aGlzLl9zY2hlbWEgPSB7XHJcbiAgICAgIG9sZFVSTDogU3RyaW5nLFxyXG4gICAgICBuZXdVUkw6IFN0cmluZyxcclxuICAgICAgY3VycmVudFJvdXRlOiBTdHJpbmcsXHJcbiAgICAgIGN1cnJlbnRDb250cm9sbGVyOiBTdHJpbmcsXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIk1WQy5Sb3V0ZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBwcm90b2NvbCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCB9XG4gIGdldCBob3N0bmFtZSgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSB9XG4gIGdldCBwb3J0KCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBvcnQgfVxuICBnZXQgcGF0aCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSB9XG4gIGdldCBoYXNoKCkge1xuICAgIGxldCBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICBsZXQgaGFzaEluZGV4ID0gaHJlZi5pbmRleE9mKCcjJylcbiAgICBpZihoYXNoSW5kZXggPiAtMSkge1xuICAgICAgbGV0IHBhcmFtSW5kZXggPSBocmVmLmluZGV4T2YoJz8nKVxuICAgICAgbGV0IHNsaWNlU3RhcnQgPSBoYXNoSW5kZXggKyAxXG4gICAgICBsZXQgc2xpY2VTdG9wXG4gICAgICBpZihwYXJhbUluZGV4ID4gLTEpIHtcbiAgICAgICAgc2xpY2VTdG9wID0gKGhhc2hJbmRleCA+IHBhcmFtSW5kZXgpXG4gICAgICAgICAgPyBocmVmLmxlbmd0aFxuICAgICAgICAgIDogcGFyYW1JbmRleFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2xpY2VTdG9wID0gaHJlZi5sZW5ndGhcbiAgICAgIH1cbiAgICAgIGhyZWYgPSBocmVmLnNsaWNlKHNsaWNlU3RhcnQsIHNsaWNlU3RvcClcbiAgICAgIGlmKGhyZWYubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBocmVmXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuICBnZXQgcGFyYW1zKCkge1xuICAgIGxldCBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICBsZXQgcGFyYW1JbmRleCA9IGhyZWYuaW5kZXhPZignPycpXG4gICAgaWYocGFyYW1JbmRleCA+IC0xKSB7XG4gICAgICBsZXQgaGFzaEluZGV4ID0gaHJlZi5pbmRleE9mKCcjJylcbiAgICAgIGxldCBzbGljZVN0YXJ0ID0gcGFyYW1JbmRleCArIDFcbiAgICAgIGxldCBzbGljZVN0b3BcbiAgICAgIGlmKGhhc2hJbmRleCA+IC0xKSB7XG4gICAgICAgIHNsaWNlU3RvcCA9IChwYXJhbUluZGV4ID4gaGFzaEluZGV4KVxuICAgICAgICAgID8gaHJlZi5sZW5ndGhcbiAgICAgICAgICA6IGhhc2hJbmRleFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2xpY2VTdG9wID0gaHJlZi5sZW5ndGhcbiAgICAgIH1cbiAgICAgIGhyZWYgPSBocmVmLnNsaWNlKHNsaWNlU3RhcnQsIHNsaWNlU3RvcClcbiAgICAgIGlmKGhyZWYubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBocmVmXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuICBnZXQgX3JvdXRlRGF0YSgpIHtcbiAgICBsZXQgcm91dGVEYXRhID0ge31cbiAgICBsZXQgcGF0aCA9IHRoaXMucGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICBwYXRoID0gKHBhdGgubGVuZ3RoKVxuICAgICAgPyBwYXRoXG4gICAgICA6IFsnLyddXG4gICAgbGV0IGhhc2ggPSB0aGlzLmhhc2hcbiAgICBsZXQgaGFzaEZyYWdtZW50cyA9IChoYXNoKVxuICAgICAgPyBoYXNoLnNwbGl0KCcvJykuZmlsdGVyKChmcmFnbWVudCkgPT4gZnJhZ21lbnQubGVuZ3RoKVxuICAgICAgOiBudWxsXG4gICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zXG4gICAgbGV0IHBhcmFtRGF0YSA9IChwYXJhbXMpXG4gICAgICA/IE1WQy5VdGlscy5wYXJhbXNUb09iamVjdChwYXJhbXMpXG4gICAgICA6IG51bGxcbiAgICBpZih0aGlzLnByb3RvY29sKSByb3V0ZURhdGEucHJvdG9jb2wgPSB0aGlzLnByb3RvY29sXG4gICAgaWYodGhpcy5ob3N0bmFtZSkgcm91dGVEYXRhLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZVxuICAgIGlmKHRoaXMucG9ydCkgcm91dGVEYXRhLnBvcnQgPSB0aGlzLnBvcnRcbiAgICBpZih0aGlzLnBhdGgpIHJvdXRlRGF0YS5wYXRoID0gdGhpcy5wYXRoXG4gICAgaWYoXG4gICAgICBoYXNoICYmXG4gICAgICBoYXNoRnJhZ21lbnRzXG4gICAgKSB7XG4gICAgICBoYXNoRnJhZ21lbnRzID0gKGhhc2hGcmFnbWVudHMubGVuZ3RoKVxuICAgICAgPyBoYXNoRnJhZ21lbnRzXG4gICAgICA6IFsnLyddXG4gICAgICByb3V0ZURhdGEuaGFzaCA9IHtcbiAgICAgICAgcGF0aDogaGFzaCxcbiAgICAgICAgZnJhZ21lbnRzOiBoYXNoRnJhZ21lbnRzLFxuICAgICAgfVxuICAgIH1cbiAgICBpZihcbiAgICAgIHBhcmFtcyAmJlxuICAgICAgcGFyYW1EYXRhXG4gICAgKSB7XG4gICAgICByb3V0ZURhdGEucGFyYW1zID0ge1xuICAgICAgICBwYXRoOiBwYXJhbXMsXG4gICAgICAgIGRhdGE6IHBhcmFtRGF0YSxcbiAgICAgIH1cbiAgICB9XG4gICAgcm91dGVEYXRhLnBhdGggPSB7XG4gICAgICBuYW1lOiB0aGlzLnBhdGgsXG4gICAgICBmcmFnbWVudHM6IHBhdGgsXG4gICAgfVxuICAgIHJvdXRlRGF0YS5jdXJyZW50VVJMID0gdGhpcy5jdXJyZW50VVJMXG4gICAgcm91dGVEYXRhID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHJvdXRlRGF0YSxcbiAgICAgIHRoaXMuX3JvdXRlQ29udHJvbGxlckRhdGFcbiAgICApXG4gICAgdGhpcy5yb3V0ZURhdGEgPSByb3V0ZURhdGFcbiAgICByZXR1cm4gdGhpcy5yb3V0ZURhdGFcbiAgfVxuICBnZXQgX3JvdXRlQ29udHJvbGxlckRhdGEoKSB7XG4gICAgbGV0IHJvdXRlRGF0YSA9IHt9XG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5yb3V0ZXMpXG4gICAgICAuZm9yRWFjaCgoW3JvdXRlUGF0aCwgcm91dGVTZXR0aW5nc10pID0+IHtcbiAgICAgICAgbGV0IHBhdGhGcmFnbWVudHMgPSB0aGlzLnBhdGguc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgICAgIHBhdGhGcmFnbWVudHMgPSAocGF0aEZyYWdtZW50cy5sZW5ndGgpXG4gICAgICAgICAgPyBwYXRoRnJhZ21lbnRzXG4gICAgICAgICAgOiBbJy8nXVxuICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSByb3V0ZVBhdGguc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50LCBmcmFnbWVudEluZGV4KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgICAgIHJvdXRlRnJhZ21lbnRzID0gKHJvdXRlRnJhZ21lbnRzLmxlbmd0aClcbiAgICAgICAgICA/IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgICAgOiBbJy8nXVxuICAgICAgICBpZihcbiAgICAgICAgICBwYXRoRnJhZ21lbnRzLmxlbmd0aCAmJlxuICAgICAgICAgIHBhdGhGcmFnbWVudHMubGVuZ3RoID09PSByb3V0ZUZyYWdtZW50cy5sZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgbGV0IG1hdGNoXG4gICAgICAgICAgcmV0dXJuIHJvdXRlRnJhZ21lbnRzLmZpbHRlcigocm91dGVGcmFnbWVudCwgcm91dGVGcmFnbWVudEluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgbWF0Y2ggPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICBtYXRjaCA9PT0gdHJ1ZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGlmKHJvdXRlRnJhZ21lbnRbMF0gPT09ICc6Jykge1xuICAgICAgICAgICAgICAgIHJvdXRlRGF0YVtyb3V0ZUZyYWdtZW50LnJlcGxhY2UoJzonLCAnJyldID0gcGF0aEZyYWdtZW50c1tyb3V0ZUZyYWdtZW50SW5kZXhdXG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudCA9IHRoaXMuZnJhZ21lbnRJRFJlZ0V4cFxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJvdXRlRnJhZ21lbnQgPSByb3V0ZUZyYWdtZW50LnJlcGxhY2UobmV3IFJlZ0V4cCgnLycsICdnaScpLCAnXFxcXFxcLycpXG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudCA9IHRoaXMucm91dGVGcmFnbWVudE5hbWVSZWdFeHAocm91dGVGcmFnbWVudClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBtYXRjaCA9IHJvdXRlRnJhZ21lbnQudGVzdChwYXRoRnJhZ21lbnRzW3JvdXRlRnJhZ21lbnRJbmRleF0pXG4gICAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICAgIG1hdGNoID09PSB0cnVlICYmXG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudEluZGV4ID09PSBwYXRoRnJhZ21lbnRzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcm91dGVEYXRhLnJvdXRlID0ge1xuICAgICAgICAgICAgICAgICAgbmFtZTogcm91dGVQYXRoLFxuICAgICAgICAgICAgICAgICAgZnJhZ21lbnRzOiByb3V0ZUZyYWdtZW50cyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcm91dGVEYXRhLmNvbnRyb2xsZXIgPSByb3V0ZVNldHRpbmdzXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pWzBdXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgcmV0dXJuIHJvdXRlRGF0YVxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICBnZXQgX3JvdXRlcygpIHtcbiAgICB0aGlzLnJvdXRlcyA9ICh0aGlzLnJvdXRlcylcbiAgICAgID8gdGhpcy5yb3V0ZXNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXNcbiAgfVxuICBzZXQgX3JvdXRlcyhyb3V0ZXMpIHtcbiAgICB0aGlzLnJvdXRlcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXMsIHRoaXMuX3JvdXRlc1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXIoKSB7IHJldHVybiB0aGlzLmNvbnRyb2xsZXIgfVxuICBzZXQgX2NvbnRyb2xsZXIoY29udHJvbGxlcikgeyB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyIH1cbiAgZ2V0IF9wcmV2aW91c1VSTCgpIHsgcmV0dXJuIHRoaXMucHJldmlvdXNVUkwgfVxuICBzZXQgX3ByZXZpb3VzVVJMKHByZXZpb3VzVVJMKSB7IHRoaXMucHJldmlvdXNVUkwgPSBwcmV2aW91c1VSTCB9XG4gIGdldCBfY3VycmVudFVSTCgpIHsgcmV0dXJuIHRoaXMuY3VycmVudFVSTCB9XG4gIHNldCBfY3VycmVudFVSTChjdXJyZW50VVJMKSB7XG4gICAgaWYodGhpcy5jdXJyZW50VVJMKSB0aGlzLl9wcmV2aW91c1VSTCA9IHRoaXMuY3VycmVudFVSTFxuICAgIHRoaXMuY3VycmVudFVSTCA9IGN1cnJlbnRVUkxcbiAgfVxuICBnZXQgZnJhZ21lbnRJRFJlZ0V4cCgpIHsgcmV0dXJuIG5ldyBSZWdFeHAoL14oWzAtOUEtWlxcP1xcPVxcLFxcLlxcKlxcLVxcX1xcJ1xcXCJcXF5cXCVcXCRcXCNcXEBcXCFcXH5cXChcXClcXHtcXH1cXCZcXDxcXD5cXFxcXFwvXSkqJC8sICdnaScpIH1cbiAgcm91dGVGcmFnbWVudE5hbWVSZWdFeHAoZnJhZ21lbnQpIHsgcmV0dXJuIG5ldyBSZWdFeHAoJ14nLmNvbmNhdChmcmFnbWVudCwgJyQnKSkgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZW5hYmxlRW1pdHRlcnMoKVxuICAgICAgdGhpcy5lbmFibGVFdmVudHMoKVxuICAgICAgdGhpcy5lbmFibGVSb3V0ZXMoKVxuICAgICAgdGhpcy5yb3V0ZUNoYW5nZSgpXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICB0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZGlzYWJsZUV2ZW50cygpXG4gICAgICB0aGlzLmRpc2FibGVSb3V0ZXMoKVxuICAgICAgdGhpcy5kaXNhYmxlRW1pdHRlcnMoKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICB9XG4gIGVuYWJsZVJvdXRlcygpIHtcbiAgICBpZih0aGlzLnNldHRpbmdzLmNvbnRyb2xsZXIpIHRoaXMuX2NvbnRyb2xsZXIgPSB0aGlzLnNldHRpbmdzLmNvbnRyb2xsZXJcbiAgICB0aGlzLl9yb3V0ZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnNldHRpbmdzLnJvdXRlcykucmVkdWNlKFxuICAgICAgKFxuICAgICAgICBfcm91dGVzLFxuICAgICAgICBbcm91dGVQYXRoLCByb3V0ZVNldHRpbmdzXSxcbiAgICAgICAgcm91dGVJbmRleCxcbiAgICAgICAgb3JpZ2luYWxSb3V0ZXMsXG4gICAgICApID0+IHtcbiAgICAgICAgX3JvdXRlc1tyb3V0ZVBhdGhdID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICByb3V0ZVNldHRpbmdzLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhbGxiYWNrOiB0aGlzLmNvbnRyb2xsZXJbcm91dGVTZXR0aW5ncy5jYWxsYmFja10uYmluZCh0aGlzLmNvbnRyb2xsZXIpLFxuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gX3JvdXRlc1xuICAgICAgfSxcbiAgICAgIHt9XG4gICAgKVxuICAgIHJldHVyblxuICB9XG4gIGVuYWJsZUVtaXR0ZXJzKCkge1xuICAgIHRoaXMuX2VtaXR0ZXJzID0ge1xuICAgICAgbmF2aWdhdGVFbWl0dGVyOiBuZXcgTVZDLkVtaXR0ZXJzLk5hdmlnYXRlKCksXG4gICAgfVxuICB9XG4gIGRpc2FibGVFbWl0dGVycygpIHtcbiAgICBkZWxldGUgdGhpcy5fZW1pdHRlcnMubmF2aWdhdGVFbWl0dGVyXG4gIH1cbiAgZGlzYWJsZVJvdXRlcygpIHtcbiAgICBkZWxldGUgdGhpcy5fcm91dGVzXG4gICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJcbiAgfVxuICBlbmFibGVFdmVudHMoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLnJvdXRlQ2hhbmdlLmJpbmQodGhpcykpXG4gIH1cbiAgZGlzYWJsZUV2ZW50cygpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMucm91dGVDaGFuZ2UuYmluZCh0aGlzKSlcbiAgfVxuICByb3V0ZUNoYW5nZSgpIHtcbiAgICB0aGlzLl9jdXJyZW50VVJMID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICBsZXQgcm91dGVEYXRhID0gdGhpcy5fcm91dGVEYXRhXG4gICAgaWYocm91dGVEYXRhLmNvbnRyb2xsZXIpIHtcbiAgICAgIGxldCBuYXZpZ2F0ZUVtaXR0ZXIgPSB0aGlzLmVtaXR0ZXJzLm5hdmlnYXRlRW1pdHRlclxuICAgICAgaWYodGhpcy5wcmV2aW91c1VSTCkgcm91dGVEYXRhLnByZXZpb3VzVVJMID0gdGhpcy5wcmV2aW91c1VSTFxuICAgICAgbmF2aWdhdGVFbWl0dGVyXG4gICAgICAgIC51bnNldCgpXG4gICAgICAgIC5zZXQocm91dGVEYXRhKVxuICAgICAgdGhpcy5lbWl0KFxuICAgICAgICBuYXZpZ2F0ZUVtaXR0ZXIubmFtZSxcbiAgICAgICAgbmF2aWdhdGVFbWl0dGVyLmVtaXNzaW9uKClcbiAgICAgIClcbiAgICAgIHJvdXRlRGF0YS5jb250cm9sbGVyLmNhbGxiYWNrKFxuICAgICAgICBuYXZpZ2F0ZUVtaXR0ZXIuZW1pc3Npb24oKVxuICAgICAgKVxuICAgIH1cbiAgfVxuICBuYXZpZ2F0ZShwYXRoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBwYXRoXG4gIH1cbn1cbiJdfQ==
