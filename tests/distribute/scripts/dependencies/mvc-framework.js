"use strict";

var MVC = MVC || {};
"use strict";

MVC.Utils = {};
"use strict";

MVC.Utils.bindEventsToTargetViewObjects = function bindEventsToTargetViewObjects() {
  this.toggleEventsForTargetViewObjects('on', ...arguments);
};

MVC.Utils.unbindEventsFromTargetViewObjects = function unbindEventsFromTargetViewObjects() {
  this.toggleEventsForTargetViewObjects('off', ...arguments);
};

MVC.Utils.bindEventsToTargetObjects = function bindEventsToTargetObjects() {
  this.toggleEventsForTargetObjects('on', ...arguments);
};

MVC.Utils.unbindEventsFromTargetObjects = function unbindEventsFromTargetObjects() {
  this.toggleEventsForTargetObjects('off', ...arguments);
};
"use strict";

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
"use strict";

MVC.Utils.UID = function () {
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
"use strict";

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
"use strict";

MVC.Utils.addPropertiesToObject = function addPropertiesToObject() {
  var targetObject;

  switch (arguments.length) {
    case 2:
      var properties = arguments[0];
      targetObject = arguments[1];
      Object.entries(properties).forEach((_ref) => {
        var [propertyName, propertyValue] = _ref;
        targetObject[propertyName] = propertyValue;
      });
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
"use strict";

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
"use strict";

MVC.Utils.paramsToObject = function paramsToObject(params) {
  var params = params.split('&');
  var object = {};
  params.forEach(paramData => {
    paramData = paramData.split('=');
    object[paramData[0]] = decodeURIComponent(paramData[1] || '');
  });
  return JSON.parse(JSON.stringify(object));
};
"use strict";

MVC.Utils.toggleEventsForTargetObjects = function toggleEventsForTargetObjects(toggleMethod, events, targetObjects, callbacks) {
  Object.entries(events).forEach((_ref) => {
    var [eventSettings, eventCallbackName] = _ref;
    var eventData = eventSettings.split(' ');
    var eventTargetSettings = eventData[0];
    var eventName = eventData[1];
    var eventTargets = MVC.Utils.objectQuery(eventTargetSettings, targetObjects);
    eventTargets = !MVC.Utils.isArray(eventTargets) ? [['@', eventTargets]] : eventTargets;

    for (var [eventTargetName, eventTarget] of eventTargets) {
      var eventMethodName = toggleMethod === 'on' ? 'on' : 'off';
      var eventCallback = MVC.Utils.objectQuery(eventCallbackName, callbacks)[0][1];
      eventTarget[eventMethodName](eventName, eventCallback);
    }
  });
};
"use strict";

MVC.Utils.toggleEventsForTargetViewObjects = function toggleEventsForTargetViewObjects(toggleMethod, events, targetObjects, callbacks) {
  Object.entries(events).forEach((eventSettings, eventCallbackName) => {
    var eventData = eventSettings.split(' ');
    var eventTargetSettings = eventData[0];
    var eventName = eventData[1];
    var eventTargets = MVC.Utils.objectQuery(eventTargetSettings, targetObjects);
    eventTargets = !MVC.Utils.isArray(eventTargets) ? [['@', eventTargets]] : eventTargets;

    for (var [eventTargetName, eventTarget] of eventTargets) {
      var eventMethodName = toggleMethod === 'on' ? 'addEventListener' : 'removeEventListener';
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
  });
};
"use strict";

MVC.Events = class {
  constructor() {}

  get _events() {
    this.events = this.events || {};
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
        delete this.events;
        break;

      case 1:
        var eventName = arguments[0];
        delete this._events[eventName];
        break;

      case 2:
        var eventName = arguments[0];
        var eventCallback = arguments[1];
        var eventCallbackName = typeof eventCallback === 'string' ? eventCallback : this.getEventCallbackName(eventCallback);

        if (this._events[eventName]) {
          delete this._events[eventName][eventCallbackName];
          if (Object.keys(this._events[eventName]).length === 0) delete this._events[eventName];
        }

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
"use strict";

MVC.Channels = class {
  constructor() {}

  get _channels() {
    this.channels = this.channels || {};
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
"use strict";

MVC.Channels.Channel = class {
  constructor() {}

  get _responses() {
    this.responses = this.responses || this.responses;
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
"use strict";

MVC.Base = class extends MVC.Events {
  constructor(settings, configuration) {
    super();
    if (configuration) this._configuration = configuration;
    if (settings) this._settings = settings;
  }

  get uid() {
    this._uid = this._uid ? this._uid : MVC.Utils.UID();
    return this._uid;
  }

  get _name() {
    return this.name;
  }

  set _name(name) {
    this.name = name;
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

  setProperties(settings, keyMap, switches) {
    switches = switches || {};
    var settingsCount = Object.keys(settings).length;
    var keyCount = 0;
    keyMap.some(key => {
      if (settings[key] !== undefined) {
        keyCount += 1;

        if (switches[key]) {
          switches[key](settings[key]);
        } else {
          this['_'.concat(key)] = settings[key];
        }
      }

      return keyCount === settingsCount ? true : false;
    });
    return this;
  }

  deleteProperties(settings, keyMap, switches) {
    switches = switches || {};
    var settingsCount = Object.keys(settings).length;
    var keyCount = 0;
    keyMap.some(key => {
      if (settings[key] !== undefined) {
        keyCount += 1;

        if (switches[key]) {
          switches[key](settings[key]);
        } else {
          delete this[key];
        }
      }

      return keyCount === settingsCount ? true : false;
    });
    return this;
  }

};
"use strict";

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
"use strict";

MVC.Model = class extends MVC.Base {
  constructor() {
    super(...arguments);
    return this;
  }

  get keyMap() {
    return ['name', 'schema', 'localStorage', 'histiogram', 'services', 'serviceCallbacks', 'serviceEvents', 'data', 'dataCallbacks', 'dataEvents', 'defaults'];
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
    this.changing = this.changing || {};
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
    this.history = this.history || [];
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
    this.db = db || '{}';
    return JSON.parse(this.db);
  }

  set _db(db) {
    db = JSON.stringify(db);
    localStorage.setItem(this.localStorage.endpoint, db);
  }

  get _data() {
    this.data = this.data || {};
    return this.data;
  }

  get _dataEvents() {
    this.dataEvents = this.dataEvents || {};
    return this.dataEvents;
  }

  set _dataEvents(dataEvents) {
    this.dataEvents = MVC.Utils.addPropertiesToObject(dataEvents, this._dataEvents);
  }

  get _dataCallbacks() {
    this.dataCallbacks = this.dataCallbacks || {};
    return this.dataCallbacks;
  }

  set _dataCallbacks(dataCallbacks) {
    this.dataCallbacks = MVC.Utils.addPropertiesToObject(dataCallbacks, this._dataCallbacks);
  }

  get _services() {
    this.services = this.services || {};
    return this.services;
  }

  set _services(services) {
    this.services = MVC.Utils.addPropertiesToObject(services, this._services);
  }

  get _serviceEvents() {
    this.serviceEvents = this.serviceEvents || {};
    return this.serviceEvents;
  }

  set _serviceEvents(serviceEvents) {
    this.serviceEvents = MVC.Utils.addPropertiesToObject(serviceEvents, this._serviceEvents);
  }

  get _serviceCallbacks() {
    this.serviceCallbacks = this.serviceCallbacks || {};
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

  resetServiceEvents() {
    return this.disableServiceEvents().enableServiceEvents();
  }

  enableServiceEvents() {
    if (this.services && this.serviceEvents && this.serviceCallbacks) {
      MVC.Utils.bindEventsToTargetObjects(this.serviceEvents, this.services, this.serviceCallbacks);
    }
  }

  disableServiceEvents() {
    if (this.services && this.serviceEvents && this.serviceCallbacks) {
      MVC.Utils.unbindEventsFromTargetObjects(this.serviceEvents, this.services, this.serviceCallbacks);
    }
  }

  resetDataEvents() {
    return this.disableDataEvents().enableDataEvents();
  }

  enableDataEvents() {
    if (this.dataEvents && this.dataCallbacks) {
      MVC.Utils.bindEventsToTargetObjects(this.dataEvents, this, this.dataCallbacks);
    }
  }

  disableDataEvents() {
    if (this.dataEvents && this.dataCallbacks) {}

    MVC.Utils.unbindEventsFromTargetObjects(this.dataEvents, this, this.dataCallbacks);
  }

  enable() {
    var settings = this.settings;

    if (!this.enabled) {
      this.setProperties(settings || {}, this.keyMap, {
        'data': function (value) {
          this.set(value);
        }.bind(this)
      });
      this.enableServiceEvents();
      this.enableDataEvents();
      this._enabled = true;
    }

    return this;
  }

  disable() {
    var settings = this.settings;

    if (this.enabled) {
      this.disableServiceEvents();
      this.disableDataEvents();
      this.deleteProperties(settings || {}, this.keyMap);
      this._enabled = false;
    }

    return this;
  }

  parse(data) {
    data = data || this._data || {};
    return JSON.parse(JSON.stringify(data));
  }

};
"use strict";

MVC.View = class extends MVC.Base {
  constructor() {
    super(...arguments);
    return this;
  }

  get elementKeyMap() {
    return ['elementName', 'element', 'attributes', 'templates', 'insert'];
  }

  get uiKeyMap() {
    return ['ui', 'uiCallbacks', 'uiEvents'];
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

  get ui() {
    return this._ui;
  }

  get _ui() {
    var ui = {};
    ui[':scope'] = this.element;
    Object.entries(this.uiElements).forEach((_ref) => {
      var [uiKey, uiValue] = _ref;

      if (typeof uiValue === 'string') {
        var scopeRegExp = new RegExp(/^(\:scope(\W){0,}>{0,})/);
        uiValue = uiValue.replace(scopeRegExp, '');
        ui[uiKey] = this.element.querySelectorAll(uiValue);
      } else if (uiValue instanceof HTMLElement || uiValue instanceof Document) {
        ui[uiKey] = uiValue;
      }
    });
    return ui;
  }

  set _ui(ui) {
    this.uiElements = ui;
  }

  get _uiEvents() {
    return this.uiEvents;
  }

  set _uiEvents(uiEvents) {
    this.uiEvents = uiEvents;
  }

  get _uiCallbacks() {
    this.uiCallbacks = this.uiCallbacks || {};
    return this.uiCallbacks;
  }

  set _uiCallbacks(uiCallbacks) {
    this.uiCallbacks = MVC.Utils.addPropertiesToObject(uiCallbacks, this._uiCallbacks);
  }

  get _observerCallbacks() {
    this.observerCallbacks = this.observerCallbacks || {};
    return this.observerCallbacks;
  }

  set _observerCallbacks(observerCallbacks) {
    this.observerCallbacks = MVC.Utils.addPropertiesToObject(observerCallbacks, this._observerCallbacks);
  }

  get elementObserver() {
    this._elementObserver = this._elementObserver || new MutationObserver(this.elementObserve.bind(this));
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
    this.templates = this.templates || {};
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

  enableElement() {
    return this.setProperties(this.settings || {}, this.elementKeyMap);
  }

  disableElement() {
    return this.deleteProperties(this.settings || {}, this.elementKeyMap);
  }

  resetUI() {
    return this.disableUI().enableUI();
  }

  enableUI() {
    return this.setProperties(this.settings || {}, this.uiKeyMap).enableUIEvents();
  }

  disableUI() {
    return this.disableUIEvents().deleteProperties(this.settings || {}, this.uiKeyMap);
  }

  enableUIEvents() {
    if (this.uiEvents && this.ui && this.uiCallbacks) {
      MVC.Utils.bindEventsToTargetViewObjects(this.uiEvents, this.ui, this.uiCallbacks);
    }

    return this;
  }

  enableRenderers() {
    var settings = this.settings || {};
    MVC.Utils.objectQuery('[/^render.*?/]', settings).forEach((_ref2) => {
      var [rendererName, rendererFunction] = _ref2;
      this[rendererName] = rendererFunction;
    });
    return this;
  }

  disableRenderers() {
    var settings = this.settings || {};
    MVC.Utils.objectQuery('[/^render.*?/]', settings).forEach((rendererName, rendererFunction) => {
      delete this[rendererName];
    });
    return this;
  }

  disableUIEvents() {
    if (this.uiEvents && this.ui && this.uiCallbacks) {
      MVC.Utils.unbindEventsFromTargetViewObjects(this.uiEvents, this.ui, this.uiCallbacks);
    }

    return this;
  }

  enable() {
    var settings = this.settings || {};

    if (!this._enabled) {
      this.enableRenderers().enableElement().enableUI()._enabled = true;
    }

    return this;
  }

  disable() {
    if (this._enabled) {
      this.disableRenderers().disableUI().disableElement()._enabled = false;
    }

    return this;
  }

};
"use strict";

MVC.Controller = class extends MVC.Base {
  constructor() {
    super(...arguments);
  }

  get keyMap() {
    return ['modelCallbacks', 'viewCallbacks', 'controllerCallbacks', 'routerCallbacks', 'models', 'views', 'controllers', 'routers', 'modelEvents', 'viewEvents', 'controllerEvents', 'routerEvents'];
  }

  get _modelCallbacks() {
    this.modelCallbacks = this.modelCallbacks || {};
    return this.modelCallbacks;
  }

  set _modelCallbacks(modelCallbacks) {
    this.modelCallbacks = MVC.Utils.addPropertiesToObject(modelCallbacks, this._modelCallbacks);
  }

  get _viewCallbacks() {
    this.viewCallbacks = this.viewCallbacks || {};
    return this.viewCallbacks;
  }

  set _viewCallbacks(viewCallbacks) {
    this.viewCallbacks = MVC.Utils.addPropertiesToObject(viewCallbacks, this._viewCallbacks);
  }

  get _controllerCallbacks() {
    this.controllerCallbacks = this.controllerCallbacks || {};
    return this.controllerCallbacks;
  }

  set _controllerCallbacks(controllerCallbacks) {
    this.controllerCallbacks = MVC.Utils.addPropertiesToObject(controllerCallbacks, this._controllerCallbacks);
  }

  get _models() {
    this.models = this.models || {};
    return this.models;
  }

  set _models(models) {
    this.models = MVC.Utils.addPropertiesToObject(models, this._models);
  }

  get _views() {
    this.views = this.views || {};
    return this.views;
  }

  set _views(views) {
    this.views = MVC.Utils.addPropertiesToObject(views, this._views);
  }

  get _controllers() {
    this.controllers = this.controllers || {};
    return this.controllers;
  }

  set _controllers(controllers) {
    this.controllers = MVC.Utils.addPropertiesToObject(controllers, this._controllers);
  }

  get _routers() {
    this.routers = this.routers || {};
    return this.routers;
  }

  set _routers(routers) {
    this.routers = MVC.Utils.addPropertiesToObject(routers, this._routers);
  }

  get _routerEvents() {
    this.routerEvents = this.routerEvents || {};
    return this.routerEvents;
  }

  set _routerEvents(routerEvents) {
    this.routerEvents = MVC.Utils.addPropertiesToObject(routerEvents, this._routerEvents);
  }

  get _routerCallbacks() {
    this.routerCallbacks = this.routerCallbacks || {};
    return this.routerCallbacks;
  }

  set _routerCallbacks(routerCallbacks) {
    this.routerCallbacks = MVC.Utils.addPropertiesToObject(routerCallbacks, this._routerCallbacks);
  }

  get _modelEvents() {
    this.modelEvents = this.modelEvents || {};
    return this.modelEvents;
  }

  set _modelEvents(modelEvents) {
    this.modelEvents = MVC.Utils.addPropertiesToObject(modelEvents, this._modelEvents);
  }

  get _viewEvents() {
    this.viewEvents = this.viewEvents || {};
    return this.viewEvents;
  }

  set _viewEvents(viewEvents) {
    this.viewEvents = MVC.Utils.addPropertiesToObject(viewEvents, this._viewEvents);
  }

  get _controllerEvents() {
    this.controllerEvents = this.controllerEvents || {};
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

  resetModelEvents() {
    return this.disableModelEvents().enableModelEvents();
  }

  enableModelEvents() {
    if (this.modelEvents && this.models && this.modelCallbacks) {
      MVC.Utils.bindEventsToTargetObjects(this.modelEvents, this.models, this.modelCallbacks);
    }

    return this;
  }

  disableModelEvents() {
    if (this.modelEvents && this.models && this.modelCallbacks) {
      MVC.Utils.unbindEventsFromTargetObjects(this.modelEvents, this.models, this.modelCallbacks);
    }

    return this;
  }

  resetViewEvents() {
    return this.disableViewEvents().enableViewEvents();
  }

  enableViewEvents() {
    if (this.viewEvents && this.views && this.viewCallbacks) {
      MVC.Utils.bindEventsToTargetObjects(this.viewEvents, this.views, this.viewCallbacks);
    }

    return this;
  }

  disableViewEvents() {
    if (this.viewEvents && this.views && this.viewCallbacks) {
      MVC.Utils.unbindEventsFromTargetObjects(this.viewEvents, this.views, this.viewCallbacks);
    }

    return this;
  }

  resetControllerEvents() {
    return this.disableControllerEvents().enableControllerEvents();
  }

  enableControllerEvents() {
    if (this.controllerEvents && this.controllers && this.controllerCallbacks) {
      MVC.Utils.bindEventsToTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks);
    }

    return this;
  }

  disableControllerEvents() {
    if (this.controllerEvents && this.controllers && this.controllerCallbacks) {
      MVC.Utils.unbindEventsFromTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks);
    }

    return this;
  }

  resetRouterEvents() {
    return this.disableRouterEvents().enableRouterEvents();
  }

  enableRouterEvents() {
    if (this.routerEvents && this.routers && this.routerCallbacks) {
      MVC.Utils.bindEventsToTargetObjects(this.routerEvents, this.routers, this.routerCallbacks);
    }

    return this;
  }

  disableRouterEvents() {
    if (this.routerEvents && this.routers && this.routerCallbacks) {
      MVC.Utils.unbindEventsFromTargetObjects(this.routerEvents, this.routers, this.routerCallbacks);
    }

    return this;
  }

  enable() {
    var settings = this.settings || {};

    if (!this.enabled) {
      this.setProperties(settings || {}, this.keyMap);
      this.enableModelEvents();
      this.enableViewEvents();
      this.enableControllerEvents();
      this.enableRouterEvents();
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

    if (this.enabled) {
      this.disableModelEvents();
      this.disableViewEvents();
      this.disableControllerEvents();
      this.disableRouterEvents();
      this.deleteProperties(settings || {}, this.keyMap);
      this._enabled = false;
    }

    return this;
  }

};
"use strict";

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
    this.routes = this.routes || {};
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
      if (this.previousURL) routeData.previousURL = this.previousURL;
      this.emit('navigate', routeData);
      routeData.controller.callback(routeData);
    }

    return this;
  }

  navigate(path) {
    window.location.href = path;
  }

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIiwiYmluZEV2ZW50cy5qcyIsImlzLmpzIiwidWlkLmpzIiwidHlwZU9mLmpzIiwiYWRkUHJvcGVydGllc1RvT2JqZWN0LmpzIiwib2JqZWN0UXVlcnkuanMiLCJwYXJhbXNUb09iamVjdC5qcyIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMuanMiLCJ0b2dnbGVFdmVudHNGb3JUYXJnZXRWaWV3T2JqZWN0cy5qcyJdLCJuYW1lcyI6WyJNVkMiLCJVdGlscyIsImJpbmRFdmVudHNUb1RhcmdldFZpZXdPYmplY3RzIiwidG9nZ2xlRXZlbnRzRm9yVGFyZ2V0Vmlld09iamVjdHMiLCJhcmd1bWVudHMiLCJ1bmJpbmRFdmVudHNGcm9tVGFyZ2V0Vmlld09iamVjdHMiLCJiaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzIiwidG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyIsInVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzIiwiaXNBcnJheSIsIm9iamVjdCIsIkFycmF5IiwiaXNPYmplY3QiLCJ0eXBlT2YiLCJ2YWx1ZSIsInZhbHVlQSIsInVuZGVmaW5lZCIsImlzSFRNTEVsZW1lbnQiLCJIVE1MRWxlbWVudCIsIlVJRCIsInV1aWQiLCJpaSIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsImRhdGEiLCJfb2JqZWN0IiwiYWRkUHJvcGVydGllc1RvT2JqZWN0IiwidGFyZ2V0T2JqZWN0IiwibGVuZ3RoIiwicHJvcGVydGllcyIsIk9iamVjdCIsImVudHJpZXMiLCJmb3JFYWNoIiwicHJvcGVydHlOYW1lIiwicHJvcGVydHlWYWx1ZSIsIm9iamVjdFF1ZXJ5Iiwic3RyaW5nIiwiY29udGV4dCIsInN0cmluZ0RhdGEiLCJwYXJzZU5vdGF0aW9uIiwic3BsaWNlIiwicmVkdWNlIiwiZnJhZ21lbnQiLCJmcmFnbWVudEluZGV4IiwiZnJhZ21lbnRzIiwicGFyc2VGcmFnbWVudCIsInByb3BlcnR5S2V5IiwibWF0Y2giLCJjb25jYXQiLCJjaGFyQXQiLCJzbGljZSIsInNwbGl0IiwiUmVnRXhwIiwicGFyYW1zVG9PYmplY3QiLCJwYXJhbXMiLCJwYXJhbURhdGEiLCJkZWNvZGVVUklDb21wb25lbnQiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJ0b2dnbGVNZXRob2QiLCJldmVudHMiLCJ0YXJnZXRPYmplY3RzIiwiY2FsbGJhY2tzIiwiZXZlbnRTZXR0aW5ncyIsImV2ZW50Q2FsbGJhY2tOYW1lIiwiZXZlbnREYXRhIiwiZXZlbnRUYXJnZXRTZXR0aW5ncyIsImV2ZW50TmFtZSIsImV2ZW50VGFyZ2V0cyIsImV2ZW50VGFyZ2V0TmFtZSIsImV2ZW50VGFyZ2V0IiwiZXZlbnRNZXRob2ROYW1lIiwiZXZlbnRDYWxsYmFjayIsIk5vZGVMaXN0IiwiX2V2ZW50VGFyZ2V0IiwiRXZlbnRzIiwiY29uc3RydWN0b3IiLCJfZXZlbnRzIiwiZ2V0RXZlbnRDYWxsYmFja3MiLCJnZXRFdmVudENhbGxiYWNrTmFtZSIsIm5hbWUiLCJnZXRFdmVudENhbGxiYWNrR3JvdXAiLCJldmVudENhbGxiYWNrcyIsIm9uIiwiZXZlbnRDYWxsYmFja0dyb3VwIiwicHVzaCIsIm9mZiIsImtleXMiLCJlbWl0IiwiX2FyZ3VtZW50cyIsInZhbHVlcyIsImV2ZW50Q2FsbGJhY2tHcm91cE5hbWUiLCJhZGRpdGlvbmFsQXJndW1lbnRzIiwiQ2hhbm5lbHMiLCJfY2hhbm5lbHMiLCJjaGFubmVscyIsImNoYW5uZWwiLCJjaGFubmVsTmFtZSIsIkNoYW5uZWwiLCJfcmVzcG9uc2VzIiwicmVzcG9uc2VzIiwicmVzcG9uc2UiLCJyZXNwb25zZU5hbWUiLCJyZXNwb25zZUNhbGxiYWNrIiwicmVxdWVzdCIsInByb3RvdHlwZSIsImNhbGwiLCJCYXNlIiwic2V0dGluZ3MiLCJjb25maWd1cmF0aW9uIiwiX2NvbmZpZ3VyYXRpb24iLCJfc2V0dGluZ3MiLCJ1aWQiLCJfdWlkIiwiX25hbWUiLCJzZXRQcm9wZXJ0aWVzIiwia2V5TWFwIiwic3dpdGNoZXMiLCJzZXR0aW5nc0NvdW50Iiwia2V5Q291bnQiLCJzb21lIiwia2V5IiwiZGVsZXRlUHJvcGVydGllcyIsIlNlcnZpY2UiLCJfZGVmYXVsdHMiLCJkZWZhdWx0cyIsImNvbnRlbnRUeXBlIiwicmVzcG9uc2VUeXBlIiwiX3Jlc3BvbnNlVHlwZXMiLCJfcmVzcG9uc2VUeXBlIiwiX3hociIsImZpbmQiLCJyZXNwb25zZVR5cGVJdGVtIiwiX3R5cGUiLCJ0eXBlIiwiX3VybCIsInVybCIsIl9oZWFkZXJzIiwiaGVhZGVycyIsImhlYWRlciIsInNldFJlcXVlc3RIZWFkZXIiLCJfZGF0YSIsInhociIsIlhNTEh0dHBSZXF1ZXN0IiwiX2VuYWJsZWQiLCJlbmFibGVkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzdGF0dXMiLCJhYm9ydCIsIm9wZW4iLCJvbmxvYWQiLCJvbmVycm9yIiwic2VuZCIsInRoZW4iLCJjdXJyZW50VGFyZ2V0IiwiY2F0Y2giLCJlcnJvciIsImVuYWJsZSIsImRpc2FibGUiLCJNb2RlbCIsIl9zY2hlbWEiLCJzY2hlbWEiLCJfaXNTZXR0aW5nIiwiaXNTZXR0aW5nIiwiX2NoYW5naW5nIiwiY2hhbmdpbmciLCJfbG9jYWxTdG9yYWdlIiwibG9jYWxTdG9yYWdlIiwiX2hpc3Rpb2dyYW0iLCJoaXN0aW9ncmFtIiwiYXNzaWduIiwiX2hpc3RvcnkiLCJoaXN0b3J5IiwidW5zaGlmdCIsIl9kYiIsImRiIiwiZ2V0SXRlbSIsImVuZHBvaW50Iiwic2V0SXRlbSIsIl9kYXRhRXZlbnRzIiwiZGF0YUV2ZW50cyIsIl9kYXRhQ2FsbGJhY2tzIiwiZGF0YUNhbGxiYWNrcyIsIl9zZXJ2aWNlcyIsInNlcnZpY2VzIiwiX3NlcnZpY2VFdmVudHMiLCJzZXJ2aWNlRXZlbnRzIiwiX3NlcnZpY2VDYWxsYmFja3MiLCJzZXJ2aWNlQ2FsbGJhY2tzIiwiZ2V0Iiwic2V0IiwiaW5kZXgiLCJzZXREYXRhUHJvcGVydHkiLCJ1bnNldCIsInVuc2V0RGF0YVByb3BlcnR5Iiwic2V0REIiLCJ1bnNldERCIiwiZGVmaW5lUHJvcGVydGllcyIsImNvbmZpZ3VyYWJsZSIsInNldFZhbHVlRXZlbnROYW1lIiwiam9pbiIsInNldEV2ZW50TmFtZSIsInVuc2V0VmFsdWVFdmVudE5hbWUiLCJ1bnNldEV2ZW50TmFtZSIsInVuc2V0VmFsdWUiLCJzZXREZWZhdWx0cyIsInJlc2V0U2VydmljZUV2ZW50cyIsImRpc2FibGVTZXJ2aWNlRXZlbnRzIiwiZW5hYmxlU2VydmljZUV2ZW50cyIsInJlc2V0RGF0YUV2ZW50cyIsImRpc2FibGVEYXRhRXZlbnRzIiwiZW5hYmxlRGF0YUV2ZW50cyIsImJpbmQiLCJWaWV3IiwiZWxlbWVudEtleU1hcCIsInVpS2V5TWFwIiwiX2VsZW1lbnROYW1lIiwiX2VsZW1lbnQiLCJ0YWdOYW1lIiwiZWxlbWVudE5hbWUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJlbGVtZW50IiwiRG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZWxlbWVudE9ic2VydmVyIiwib2JzZXJ2ZSIsInN1YnRyZWUiLCJjaGlsZExpc3QiLCJfYXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVLZXkiLCJhdHRyaWJ1dGVWYWx1ZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsInVpIiwiX3VpIiwidWlFbGVtZW50cyIsInVpS2V5IiwidWlWYWx1ZSIsInNjb3BlUmVnRXhwIiwicmVwbGFjZSIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJfdWlFdmVudHMiLCJ1aUV2ZW50cyIsIl91aUNhbGxiYWNrcyIsInVpQ2FsbGJhY2tzIiwiX29ic2VydmVyQ2FsbGJhY2tzIiwib2JzZXJ2ZXJDYWxsYmFja3MiLCJfZWxlbWVudE9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsImVsZW1lbnRPYnNlcnZlIiwiX2luc2VydCIsImluc2VydCIsIl90ZW1wbGF0ZXMiLCJ0ZW1wbGF0ZXMiLCJtdXRhdGlvblJlY29yZExpc3QiLCJvYnNlcnZlciIsIm11dGF0aW9uUmVjb3JkSW5kZXgiLCJtdXRhdGlvblJlY29yZCIsIm11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcyIsIm11dGF0aW9uUmVjb3JkQ2F0ZWdvcnkiLCJyZXNldFVJIiwiYXV0b0luc2VydCIsInBhcmVudEVsZW1lbnQiLCJOb2RlIiwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50IiwibWV0aG9kIiwiX3BhcmVudEVsZW1lbnQiLCJhdXRvUmVtb3ZlIiwicmVtb3ZlQ2hpbGQiLCJlbmFibGVFbGVtZW50IiwiZGlzYWJsZUVsZW1lbnQiLCJkaXNhYmxlVUkiLCJlbmFibGVVSSIsImVuYWJsZVVJRXZlbnRzIiwiZGlzYWJsZVVJRXZlbnRzIiwiZW5hYmxlUmVuZGVyZXJzIiwicmVuZGVyZXJOYW1lIiwicmVuZGVyZXJGdW5jdGlvbiIsImRpc2FibGVSZW5kZXJlcnMiLCJDb250cm9sbGVyIiwiX21vZGVsQ2FsbGJhY2tzIiwibW9kZWxDYWxsYmFja3MiLCJfdmlld0NhbGxiYWNrcyIsInZpZXdDYWxsYmFja3MiLCJfY29udHJvbGxlckNhbGxiYWNrcyIsImNvbnRyb2xsZXJDYWxsYmFja3MiLCJfbW9kZWxzIiwibW9kZWxzIiwiX3ZpZXdzIiwidmlld3MiLCJfY29udHJvbGxlcnMiLCJjb250cm9sbGVycyIsIl9yb3V0ZXJzIiwicm91dGVycyIsIl9yb3V0ZXJFdmVudHMiLCJyb3V0ZXJFdmVudHMiLCJfcm91dGVyQ2FsbGJhY2tzIiwicm91dGVyQ2FsbGJhY2tzIiwiX21vZGVsRXZlbnRzIiwibW9kZWxFdmVudHMiLCJfdmlld0V2ZW50cyIsInZpZXdFdmVudHMiLCJfY29udHJvbGxlckV2ZW50cyIsImNvbnRyb2xsZXJFdmVudHMiLCJyZXNldE1vZGVsRXZlbnRzIiwiZGlzYWJsZU1vZGVsRXZlbnRzIiwiZW5hYmxlTW9kZWxFdmVudHMiLCJyZXNldFZpZXdFdmVudHMiLCJkaXNhYmxlVmlld0V2ZW50cyIsImVuYWJsZVZpZXdFdmVudHMiLCJyZXNldENvbnRyb2xsZXJFdmVudHMiLCJkaXNhYmxlQ29udHJvbGxlckV2ZW50cyIsImVuYWJsZUNvbnRyb2xsZXJFdmVudHMiLCJyZXNldFJvdXRlckV2ZW50cyIsImRpc2FibGVSb3V0ZXJFdmVudHMiLCJlbmFibGVSb3V0ZXJFdmVudHMiLCJyZXNldCIsIlJvdXRlciIsInByb3RvY29sIiwid2luZG93IiwibG9jYXRpb24iLCJob3N0bmFtZSIsInBvcnQiLCJwYXRoIiwicGF0aG5hbWUiLCJoYXNoIiwiaHJlZiIsImhhc2hJbmRleCIsImluZGV4T2YiLCJwYXJhbUluZGV4Iiwic2xpY2VTdGFydCIsInNsaWNlU3RvcCIsIl9yb3V0ZURhdGEiLCJyb3V0ZURhdGEiLCJjb250cm9sbGVyIiwiZmlsdGVyIiwiaGFzaEZyYWdtZW50cyIsImN1cnJlbnRVUkwiLCJyb3V0ZUNvbnRyb2xsZXJEYXRhIiwiX3JvdXRlQ29udHJvbGxlckRhdGEiLCJyb3V0ZXMiLCJyb3V0ZVBhdGgiLCJyb3V0ZVNldHRpbmdzIiwicGF0aEZyYWdtZW50cyIsInJvdXRlRnJhZ21lbnRzIiwicm91dGVGcmFnbWVudCIsInJvdXRlRnJhZ21lbnRJbmRleCIsImN1cnJlbnRJREtleSIsImZyYWdtZW50SURSZWdFeHAiLCJyb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cCIsInRlc3QiLCJyb3V0ZSIsIl9yb3V0ZXMiLCJfY29udHJvbGxlciIsIl9wcmV2aW91c1VSTCIsInByZXZpb3VzVVJMIiwiX2N1cnJlbnRVUkwiLCJlbmFibGVFdmVudHMiLCJlbmFibGVSb3V0ZXMiLCJkaXNhYmxlRXZlbnRzIiwiZGlzYWJsZVJvdXRlcyIsInJvdXRlSW5kZXgiLCJvcmlnaW5hbFJvdXRlcyIsImNhbGxiYWNrIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJvdXRlQ2hhbmdlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm5hdmlnYXRlIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLEVBQWpCOzs7QUFBQUEsR0FBRyxDQUFDQyxLQUFKLEdBQVksRUFBWjs7O0FDQUFELEdBQUcsQ0FBQ0MsS0FBSixDQUFVQyw2QkFBVixH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RCxFQUFPO0FBQ2JKLElBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQk0sSUFBaEIsR0FBdUJILElBQXZCO0FBQ0Q7O0FBclFpQyxDQUFwQyIsImZpbGUiOiJicm93c2VyL212Yy1mcmFtZXdvcmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyJNVkMuUm91dGVyID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGdldCBwcm90b2NvbCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCB9XG4gIGdldCBob3N0bmFtZSgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSB9XG4gIGdldCBwb3J0KCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBvcnQgfVxuICBnZXQgcGF0aCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSB9XG4gIGdldCBoYXNoKCkge1xuICAgIGxldCBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICBsZXQgaGFzaEluZGV4ID0gaHJlZi5pbmRleE9mKCcjJylcbiAgICBpZihoYXNoSW5kZXggPiAtMSkge1xuICAgICAgbGV0IHBhcmFtSW5kZXggPSBocmVmLmluZGV4T2YoJz8nKVxuICAgICAgbGV0IHNsaWNlU3RhcnQgPSBoYXNoSW5kZXggKyAxXG4gICAgICBsZXQgc2xpY2VTdG9wXG4gICAgICBpZihwYXJhbUluZGV4ID4gLTEpIHtcbiAgICAgICAgc2xpY2VTdG9wID0gKGhhc2hJbmRleCA+IHBhcmFtSW5kZXgpXG4gICAgICAgICAgPyBocmVmLmxlbmd0aFxuICAgICAgICAgIDogcGFyYW1JbmRleFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2xpY2VTdG9wID0gaHJlZi5sZW5ndGhcbiAgICAgIH1cbiAgICAgIGhyZWYgPSBocmVmLnNsaWNlKHNsaWNlU3RhcnQsIHNsaWNlU3RvcClcbiAgICAgIGlmKGhyZWYubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBocmVmXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuICBnZXQgcGFyYW1zKCkge1xuICAgIGxldCBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICBsZXQgcGFyYW1JbmRleCA9IGhyZWYuaW5kZXhPZignPycpXG4gICAgaWYocGFyYW1JbmRleCA+IC0xKSB7XG4gICAgICBsZXQgaGFzaEluZGV4ID0gaHJlZi5pbmRleE9mKCcjJylcbiAgICAgIGxldCBzbGljZVN0YXJ0ID0gcGFyYW1JbmRleCArIDFcbiAgICAgIGxldCBzbGljZVN0b3BcbiAgICAgIGlmKGhhc2hJbmRleCA+IC0xKSB7XG4gICAgICAgIHNsaWNlU3RvcCA9IChwYXJhbUluZGV4ID4gaGFzaEluZGV4KVxuICAgICAgICAgID8gaHJlZi5sZW5ndGhcbiAgICAgICAgICA6IGhhc2hJbmRleFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2xpY2VTdG9wID0gaHJlZi5sZW5ndGhcbiAgICAgIH1cbiAgICAgIGhyZWYgPSBocmVmLnNsaWNlKHNsaWNlU3RhcnQsIHNsaWNlU3RvcClcbiAgICAgIGlmKGhyZWYubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBocmVmXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuICBnZXQgX3JvdXRlRGF0YSgpIHtcbiAgICBsZXQgcm91dGVEYXRhID0ge1xuICAgICAgbG9jYXRpb246IHt9LFxuICAgICAgY29udHJvbGxlcjoge30sXG4gICAgfVxuICAgIGxldCBwYXRoID0gdGhpcy5wYXRoLnNwbGl0KCcvJykuZmlsdGVyKChmcmFnbWVudCkgPT4gZnJhZ21lbnQubGVuZ3RoKVxuICAgIHBhdGggPSAocGF0aC5sZW5ndGgpXG4gICAgICA/IHBhdGhcbiAgICAgIDogWycvJ11cbiAgICBsZXQgaGFzaCA9IHRoaXMuaGFzaFxuICAgIGxldCBoYXNoRnJhZ21lbnRzID0gKGhhc2gpXG4gICAgICA/IGhhc2guc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgICA6IG51bGxcbiAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXNcbiAgICBsZXQgcGFyYW1EYXRhID0gKHBhcmFtcylcbiAgICAgID8gTVZDLlV0aWxzLnBhcmFtc1RvT2JqZWN0KHBhcmFtcylcbiAgICAgIDogbnVsbFxuICAgIGlmKHRoaXMucHJvdG9jb2wpIHJvdXRlRGF0YS5sb2NhdGlvbi5wcm90b2NvbCA9IHRoaXMucHJvdG9jb2xcbiAgICBpZih0aGlzLmhvc3RuYW1lKSByb3V0ZURhdGEubG9jYXRpb24uaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lXG4gICAgaWYodGhpcy5wb3J0KSByb3V0ZURhdGEubG9jYXRpb24ucG9ydCA9IHRoaXMucG9ydFxuICAgIGlmKHRoaXMucGF0aCkgcm91dGVEYXRhLmxvY2F0aW9uLnBhdGggPSB0aGlzLnBhdGhcbiAgICBpZihcbiAgICAgIGhhc2ggJiZcbiAgICAgIGhhc2hGcmFnbWVudHNcbiAgICApIHtcbiAgICAgIGhhc2hGcmFnbWVudHMgPSAoaGFzaEZyYWdtZW50cy5sZW5ndGgpXG4gICAgICAgID8gaGFzaEZyYWdtZW50c1xuICAgICAgICA6IFsnLyddXG4gICAgICByb3V0ZURhdGEubG9jYXRpb24uaGFzaCA9IHtcbiAgICAgICAgcGF0aDogaGFzaCxcbiAgICAgICAgZnJhZ21lbnRzOiBoYXNoRnJhZ21lbnRzLFxuICAgICAgfVxuICAgIH1cbiAgICBpZihcbiAgICAgIHBhcmFtcyAmJlxuICAgICAgcGFyYW1EYXRhXG4gICAgKSB7XG4gICAgICByb3V0ZURhdGEubG9jYXRpb24ucGFyYW1zID0ge1xuICAgICAgICBwYXRoOiBwYXJhbXMsXG4gICAgICAgIGRhdGE6IHBhcmFtRGF0YSxcbiAgICAgIH1cbiAgICB9XG4gICAgcm91dGVEYXRhLmxvY2F0aW9uLnBhdGggPSB7XG4gICAgICBuYW1lOiB0aGlzLnBhdGgsXG4gICAgICBmcmFnbWVudHM6IHBhdGgsXG4gICAgfVxuICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5jdXJyZW50VVJMID0gdGhpcy5jdXJyZW50VVJMXG4gICAgbGV0IHJvdXRlQ29udHJvbGxlckRhdGEgPSB0aGlzLl9yb3V0ZUNvbnRyb2xsZXJEYXRhXG4gICAgcm91dGVEYXRhLmxvY2F0aW9uID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbixcbiAgICAgIHJvdXRlQ29udHJvbGxlckRhdGEubG9jYXRpb25cbiAgICApXG4gICAgcm91dGVEYXRhLmNvbnRyb2xsZXIgPSByb3V0ZUNvbnRyb2xsZXJEYXRhLmNvbnRyb2xsZXJcbiAgICB0aGlzLnJvdXRlRGF0YSA9IHJvdXRlRGF0YVxuICAgIHJldHVybiB0aGlzLnJvdXRlRGF0YVxuICB9XG4gIGdldCBfcm91dGVDb250cm9sbGVyRGF0YSgpIHtcbiAgICBsZXQgcm91dGVEYXRhID0ge1xuICAgICAgbG9jYXRpb246IHt9LFxuICAgIH1cbiAgICBPYmplY3QuZW50cmllcyh0aGlzLnJvdXRlcylcbiAgICAgIC5mb3JFYWNoKChbcm91dGVQYXRoLCByb3V0ZVNldHRpbmdzXSkgPT4ge1xuICAgICAgICBsZXQgcGF0aEZyYWdtZW50cyA9IHRoaXMucGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgICAgcGF0aEZyYWdtZW50cyA9IChwYXRoRnJhZ21lbnRzLmxlbmd0aClcbiAgICAgICAgICA/IHBhdGhGcmFnbWVudHNcbiAgICAgICAgICA6IFsnLyddXG4gICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IHJvdXRlUGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQsIGZyYWdtZW50SW5kZXgpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgICAgcm91dGVGcmFnbWVudHMgPSAocm91dGVGcmFnbWVudHMubGVuZ3RoKVxuICAgICAgICAgID8gcm91dGVGcmFnbWVudHNcbiAgICAgICAgICA6IFsnLyddXG4gICAgICAgIGlmKFxuICAgICAgICAgIHBhdGhGcmFnbWVudHMubGVuZ3RoICYmXG4gICAgICAgICAgcGF0aEZyYWdtZW50cy5sZW5ndGggPT09IHJvdXRlRnJhZ21lbnRzLmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICBsZXQgbWF0Y2hcbiAgICAgICAgICByZXR1cm4gcm91dGVGcmFnbWVudHMuZmlsdGVyKChyb3V0ZUZyYWdtZW50LCByb3V0ZUZyYWdtZW50SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICBtYXRjaCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICAgIG1hdGNoID09PSB0cnVlXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgaWYocm91dGVGcmFnbWVudFswXSA9PT0gJzonKSB7XG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRJREtleSA9IHJvdXRlRnJhZ21lbnQucmVwbGFjZSgnOicsICcnKVxuICAgICAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudEluZGV4ID09PSBwYXRoRnJhZ21lbnRzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5jdXJyZW50SURLZXkgPSBjdXJyZW50SURLZXlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcm91dGVEYXRhLmxvY2F0aW9uW2N1cnJlbnRJREtleV0gPSBwYXRoRnJhZ21lbnRzW3JvdXRlRnJhZ21lbnRJbmRleF1cbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50ID0gdGhpcy5mcmFnbWVudElEUmVnRXhwXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudCA9IHJvdXRlRnJhZ21lbnQucmVwbGFjZShuZXcgUmVnRXhwKCcvJywgJ2dpJyksICdcXFxcXFwvJylcbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50ID0gdGhpcy5yb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cChyb3V0ZUZyYWdtZW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG1hdGNoID0gcm91dGVGcmFnbWVudC50ZXN0KHBhdGhGcmFnbWVudHNbcm91dGVGcmFnbWVudEluZGV4XSlcbiAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgbWF0Y2ggPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50SW5kZXggPT09IHBhdGhGcmFnbWVudHMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByb3V0ZURhdGEubG9jYXRpb24ucm91dGUgPSB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiByb3V0ZVBhdGgsXG4gICAgICAgICAgICAgICAgICBmcmFnbWVudHM6IHJvdXRlRnJhZ21lbnRzLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByb3V0ZURhdGEuY29udHJvbGxlciA9IHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICAgICAgICByZXR1cm4gcm91dGVTZXR0aW5nc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlbMF1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICByZXR1cm4gcm91dGVEYXRhXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGdldCBfcm91dGVzKCkge1xuICAgIHRoaXMucm91dGVzID0gdGhpcy5yb3V0ZXMgfHwge31cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXNcbiAgfVxuICBzZXQgX3JvdXRlcyhyb3V0ZXMpIHtcbiAgICB0aGlzLnJvdXRlcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXMsIHRoaXMuX3JvdXRlc1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXIoKSB7IHJldHVybiB0aGlzLmNvbnRyb2xsZXIgfVxuICBzZXQgX2NvbnRyb2xsZXIoY29udHJvbGxlcikgeyB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyIH1cbiAgZ2V0IF9wcmV2aW91c1VSTCgpIHsgcmV0dXJuIHRoaXMucHJldmlvdXNVUkwgfVxuICBzZXQgX3ByZXZpb3VzVVJMKHByZXZpb3VzVVJMKSB7IHRoaXMucHJldmlvdXNVUkwgPSBwcmV2aW91c1VSTCB9XG4gIGdldCBfY3VycmVudFVSTCgpIHsgcmV0dXJuIHRoaXMuY3VycmVudFVSTCB9XG4gIHNldCBfY3VycmVudFVSTChjdXJyZW50VVJMKSB7XG4gICAgaWYodGhpcy5jdXJyZW50VVJMKSB0aGlzLl9wcmV2aW91c1VSTCA9IHRoaXMuY3VycmVudFVSTFxuICAgIHRoaXMuY3VycmVudFVSTCA9IGN1cnJlbnRVUkxcbiAgfVxuICBnZXQgZnJhZ21lbnRJRFJlZ0V4cCgpIHsgcmV0dXJuIG5ldyBSZWdFeHAoL14oWzAtOUEtWlxcP1xcPVxcLFxcLlxcKlxcLVxcX1xcJ1xcXCJcXF5cXCVcXCRcXCNcXEBcXCFcXH5cXChcXClcXHtcXH1cXCZcXDxcXD5cXFxcXFwvXSkqJC8sICdnaScpIH1cbiAgcm91dGVGcmFnbWVudE5hbWVSZWdFeHAoZnJhZ21lbnQpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cCgnXicuY29uY2F0KGZyYWdtZW50LCAnJCcpKVxuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBpZihcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZW5hYmxlRXZlbnRzKClcbiAgICAgIHRoaXMuZW5hYmxlUm91dGVzKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBpZihcbiAgICAgIHRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5kaXNhYmxlRXZlbnRzKClcbiAgICAgIHRoaXMuZGlzYWJsZVJvdXRlcygpXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBlbmFibGVSb3V0ZXMoKSB7XG4gICAgaWYodGhpcy5zZXR0aW5ncy5jb250cm9sbGVyKSB0aGlzLl9jb250cm9sbGVyID0gdGhpcy5zZXR0aW5ncy5jb250cm9sbGVyXG4gICAgdGhpcy5fcm91dGVzID0gT2JqZWN0LmVudHJpZXModGhpcy5zZXR0aW5ncy5yb3V0ZXMpLnJlZHVjZShcbiAgICAgIChcbiAgICAgICAgX3JvdXRlcyxcbiAgICAgICAgW3JvdXRlUGF0aCwgcm91dGVTZXR0aW5nc10sXG4gICAgICAgIHJvdXRlSW5kZXgsXG4gICAgICAgIG9yaWdpbmFsUm91dGVzLFxuICAgICAgKSA9PiB7XG4gICAgICAgIF9yb3V0ZXNbcm91dGVQYXRoXSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgcm91dGVTZXR0aW5ncyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBjYWxsYmFjazogdGhpcy5jb250cm9sbGVyW3JvdXRlU2V0dGluZ3MuY2FsbGJhY2tdLmJpbmQodGhpcy5jb250cm9sbGVyKSxcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuIF9yb3V0ZXNcbiAgICAgIH0sXG4gICAgICB7fVxuICAgIClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGVSb3V0ZXMoKSB7XG4gICAgZGVsZXRlIHRoaXMuX3JvdXRlc1xuICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBlbmFibGVFdmVudHMoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLnJvdXRlQ2hhbmdlLmJpbmQodGhpcykpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBkaXNhYmxlRXZlbnRzKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgdGhpcy5yb3V0ZUNoYW5nZS5iaW5kKHRoaXMpKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgcm91dGVDaGFuZ2UoKSB7XG4gICAgdGhpcy5fY3VycmVudFVSTCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgbGV0IHJvdXRlRGF0YSA9IHRoaXMuX3JvdXRlRGF0YVxuICAgIGlmKHJvdXRlRGF0YS5jb250cm9sbGVyKSB7XG4gICAgICBpZih0aGlzLnByZXZpb3VzVVJMKSByb3V0ZURhdGEucHJldmlvdXNVUkwgPSB0aGlzLnByZXZpb3VzVVJMXG4gICAgICB0aGlzLmVtaXQoXG4gICAgICAgICduYXZpZ2F0ZScsXG4gICAgICAgIHJvdXRlRGF0YVxuICAgICAgKVxuICAgICAgcm91dGVEYXRhLmNvbnRyb2xsZXIuY2FsbGJhY2socm91dGVEYXRhKVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIG5hdmlnYXRlKHBhdGgpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGhcbiAgfVxufVxuIiwiTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldFZpZXdPYmplY3RzID0gZnVuY3Rpb24gYmluZEV2ZW50c1RvVGFyZ2V0Vmlld09iamVjdHMoKSB7XHJcbiAgdGhpcy50b2dnbGVFdmVudHNGb3JUYXJnZXRWaWV3T2JqZWN0cygnb24nLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRWaWV3T2JqZWN0cyA9IGZ1bmN0aW9uIHVuYmluZEV2ZW50c0Zyb21UYXJnZXRWaWV3T2JqZWN0cygpIHtcclxuICB0aGlzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldFZpZXdPYmplY3RzKCdvZmYnLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMgPSBmdW5jdGlvbiBiaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKCkge1xyXG4gIHRoaXMudG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cygnb24nLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzID0gZnVuY3Rpb24gdW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMoKSB7XHJcbiAgdGhpcy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKCdvZmYnLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuIiwiTVZDLlV0aWxzLmlzQXJyYXkgPSBmdW5jdGlvbiBpc0FycmF5KG9iamVjdCkgeyByZXR1cm4gQXJyYXkuaXNBcnJheShvYmplY3QpIH1cclxuTVZDLlV0aWxzLmlzT2JqZWN0ID0gZnVuY3Rpb24gaXNPYmplY3Qob2JqZWN0KSB7XHJcbiAgcmV0dXJuIChcclxuICAgICFBcnJheS5pc0FycmF5KG9iamVjdCkgJiZcclxuICAgIG9iamVjdCAhPT0gbnVsbFxyXG4gICkgPyB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0J1xyXG4gICAgOiBmYWxzZVxyXG59XHJcbk1WQy5VdGlscy50eXBlT2YgPSBmdW5jdGlvbiB0eXBlT2YodmFsdWUpIHtcclxuICByZXR1cm4gKHR5cGVvZiB2YWx1ZUEgPT09ICdvYmplY3QnKVxyXG4gICAgPyAoTVZDLlV0aWxzLmlzT2JqZWN0KHZhbHVlQSkpXHJcbiAgICAgID8gJ29iamVjdCdcclxuICAgICAgOiAoTVZDLlV0aWxzLmlzQXJyYXkodmFsdWVBKSlcclxuICAgICAgICA/ICdhcnJheSdcclxuICAgICAgICA6ICh2YWx1ZUEgPT09IG51bGwpXHJcbiAgICAgICAgICA/ICdudWxsJ1xyXG4gICAgICAgICAgOiB1bmRlZmluZWRcclxuICAgIDogdHlwZW9mIHZhbHVlXHJcbn1cclxuTVZDLlV0aWxzLmlzSFRNTEVsZW1lbnQgPSBmdW5jdGlvbiBpc0hUTUxFbGVtZW50KG9iamVjdCkge1xyXG4gIHJldHVybiBvYmplY3QgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxyXG59XHJcbiIsIk1WQy5VdGlscy5VSUQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHV1aWQgPSAnJywgaWlcclxuICBmb3IgKGlpID0gMDsgaWkgPCAzMjsgaWkgKz0gMSkge1xyXG4gICAgc3dpdGNoIChpaSkge1xyXG4gICAgICBjYXNlIDg6XHJcbiAgICAgIGNhc2UgMjA6XHJcbiAgICAgICAgdXVpZCArPSAnLSc7XHJcbiAgICAgICAgdXVpZCArPSAoTWF0aC5yYW5kb20oKSAqIDE2IHwgMCkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAxMjpcclxuICAgICAgICB1dWlkICs9ICctJ1xyXG4gICAgICAgIHV1aWQgKz0gJzQnXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAxNjpcclxuICAgICAgICB1dWlkICs9ICctJ1xyXG4gICAgICAgIHV1aWQgKz0gKE1hdGgucmFuZG9tKCkgKiA0IHwgOCkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB1dWlkICs9IChNYXRoLnJhbmRvbSgpICogMTYgfCAwKS50b1N0cmluZygxNilcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHV1aWRcclxufVxyXG4iLCJNVkMuVXRpbHMudHlwZU9mID0gIGZ1bmN0aW9uIHR5cGVPZihkYXRhKSB7XHJcbiAgc3dpdGNoKHR5cGVvZiBkYXRhKSB7XHJcbiAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICBsZXQgX29iamVjdFxyXG4gICAgICBpZihNVkMuVXRpbHMuaXNBcnJheShkYXRhKSkge1xyXG4gICAgICAgIC8vIEFycmF5XHJcbiAgICAgICAgcmV0dXJuICdhcnJheSdcclxuICAgICAgfSBlbHNlIGlmKFxyXG4gICAgICAgIE1WQy5VdGlscy5pc09iamVjdChkYXRhKVxyXG4gICAgICApIHtcclxuICAgICAgICAvLyBPYmplY3RcclxuICAgICAgICByZXR1cm4gJ29iamVjdCdcclxuICAgICAgfSBlbHNlIGlmKFxyXG4gICAgICAgIGRhdGEgPT09IG51bGxcclxuICAgICAgKSB7XHJcbiAgICAgICAgLy8gTnVsbFxyXG4gICAgICAgIHJldHVybiAnbnVsbCdcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gX29iamVjdFxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnc3RyaW5nJzpcclxuICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICBjYXNlICdib29sZWFuJzpcclxuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XHJcbiAgICBjYXNlICdmdW5jdGlvbic6XHJcbiAgICAgIHJldHVybiB0eXBlb2YgZGF0YVxyXG4gICAgICBicmVha1xyXG4gIH1cclxufVxyXG4iLCJNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0ID0gZnVuY3Rpb24gYWRkUHJvcGVydGllc1RvT2JqZWN0KCkge1xyXG4gIGxldCB0YXJnZXRPYmplY3RcclxuICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgY2FzZSAyOlxyXG4gICAgICBsZXQgcHJvcGVydGllcyA9IGFyZ3VtZW50c1swXVxyXG4gICAgICB0YXJnZXRPYmplY3QgPSBhcmd1bWVudHNbMV1cclxuICAgICAgT2JqZWN0LmVudHJpZXMocHJvcGVydGllcylcclxuICAgICAgICAuZm9yRWFjaCgoW3Byb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZV0pID0+IHtcclxuICAgICAgICAgIHRhcmdldE9iamVjdFtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZVxyXG4gICAgICAgIH0pXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlIDM6XHJcbiAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgbGV0IHByb3BlcnR5VmFsdWUgPSBhcmd1bWVudHNbMV1cclxuICAgICAgdGFyZ2V0T2JqZWN0ID0gYXJndW1lbnRzWzJdXHJcbiAgICAgIHRhcmdldE9iamVjdFtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZVxyXG4gICAgICBicmVha1xyXG4gIH1cclxuICByZXR1cm4gdGFyZ2V0T2JqZWN0XHJcbn1cclxuIiwiTVZDLlV0aWxzLm9iamVjdFF1ZXJ5ID0gZnVuY3Rpb24gb2JqZWN0UXVlcnkoXHJcbiAgc3RyaW5nLFxyXG4gIGNvbnRleHRcclxuKSB7XHJcbiAgbGV0IHN0cmluZ0RhdGEgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VOb3RhdGlvbihzdHJpbmcpXHJcbiAgaWYoc3RyaW5nRGF0YVswXSA9PT0gJ0AnKSBzdHJpbmdEYXRhLnNwbGljZSgwLCAxKVxyXG4gIGlmKCFzdHJpbmdEYXRhLmxlbmd0aCkgcmV0dXJuIGNvbnRleHRcclxuICBjb250ZXh0ID0gKE1WQy5VdGlscy5pc09iamVjdChjb250ZXh0KSlcclxuICAgID8gT2JqZWN0LmVudHJpZXMoY29udGV4dClcclxuICAgIDogY29udGV4dFxyXG4gIHJldHVybiBzdHJpbmdEYXRhLnJlZHVjZSgob2JqZWN0LCBmcmFnbWVudCwgZnJhZ21lbnRJbmRleCwgZnJhZ21lbnRzKSA9PiB7XHJcbiAgICBsZXQgcHJvcGVydGllcyA9IFtdXHJcbiAgICBmcmFnbWVudCA9IE1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZUZyYWdtZW50KGZyYWdtZW50KVxyXG4gICAgZm9yKGxldCBbcHJvcGVydHlLZXksIHByb3BlcnR5VmFsdWVdIG9mIG9iamVjdCkge1xyXG4gICAgICBpZihwcm9wZXJ0eUtleS5tYXRjaChmcmFnbWVudCkpIHtcclxuICAgICAgICBpZihmcmFnbWVudEluZGV4ID09PSBmcmFnbWVudHMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMuY29uY2F0KFtbcHJvcGVydHlLZXksIHByb3BlcnR5VmFsdWVdXSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMuY29uY2F0KE9iamVjdC5lbnRyaWVzKHByb3BlcnR5VmFsdWUpKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgb2JqZWN0ID0gcHJvcGVydGllc1xyXG4gICAgcmV0dXJuIG9iamVjdFxyXG4gIH0sIGNvbnRleHQpXHJcbn1cclxuTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlTm90YXRpb24gPSBmdW5jdGlvbiBwYXJzZU5vdGF0aW9uKHN0cmluZykge1xyXG4gIGlmKFxyXG4gICAgc3RyaW5nLmNoYXJBdCgwKSA9PT0gJ1snICYmXHJcbiAgICBzdHJpbmcuY2hhckF0KHN0cmluZy5sZW5ndGggLSAxKSA9PSAnXSdcclxuICApIHtcclxuICAgIHN0cmluZyA9IHN0cmluZ1xyXG4gICAgICAuc2xpY2UoMSwgLTEpXHJcbiAgICAgIC5zcGxpdCgnXVsnKVxyXG4gIH0gZWxzZSB7XHJcbiAgICBzdHJpbmcgPSBzdHJpbmdcclxuICAgICAgLnNwbGl0KCcuJylcclxuICB9XHJcbiAgcmV0dXJuIHN0cmluZ1xyXG59XHJcbk1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZUZyYWdtZW50ID0gZnVuY3Rpb24gcGFyc2VGcmFnbWVudChmcmFnbWVudCkge1xyXG4gIGlmKFxyXG4gICAgZnJhZ21lbnQuY2hhckF0KDApID09PSAnLycgJiZcclxuICAgIGZyYWdtZW50LmNoYXJBdChmcmFnbWVudC5sZW5ndGggLSAxKSA9PSAnLydcclxuICApIHtcclxuICAgIGZyYWdtZW50ID0gZnJhZ21lbnQuc2xpY2UoMSwgLTEpXHJcbiAgICBmcmFnbWVudCA9IG5ldyBSZWdFeHAoJ14nLmNvbmNhdChmcmFnbWVudCwgJyQnKSlcclxuICB9XHJcbiAgcmV0dXJuIGZyYWdtZW50XHJcbn1cclxuIiwiTVZDLlV0aWxzLnBhcmFtc1RvT2JqZWN0ID0gZnVuY3Rpb24gcGFyYW1zVG9PYmplY3QocGFyYW1zKSB7XHJcbiAgICB2YXIgcGFyYW1zID0gcGFyYW1zLnNwbGl0KCcmJylcclxuICAgIHZhciBvYmplY3QgPSB7fVxyXG4gICAgcGFyYW1zLmZvckVhY2goKHBhcmFtRGF0YSkgPT4ge1xyXG4gICAgICBwYXJhbURhdGEgPSBwYXJhbURhdGEuc3BsaXQoJz0nKVxyXG4gICAgICBvYmplY3RbcGFyYW1EYXRhWzBdXSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJhbURhdGFbMV0gfHwgJycpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqZWN0KSlcclxufVxyXG4iLCJNVkMuVXRpbHMudG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIHRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoXHJcbiAgdG9nZ2xlTWV0aG9kLFxyXG4gIGV2ZW50cyxcclxuICB0YXJnZXRPYmplY3RzLFxyXG4gIGNhbGxiYWNrc1xyXG4pIHtcclxuICBPYmplY3QuZW50cmllcyhldmVudHMpXHJcbiAgICAuZm9yRWFjaCgoW2V2ZW50U2V0dGluZ3MsIGV2ZW50Q2FsbGJhY2tOYW1lXSkgPT4ge1xyXG4gICAgICBsZXQgZXZlbnREYXRhID0gZXZlbnRTZXR0aW5ncy5zcGxpdCgnICcpXHJcbiAgICAgIGxldCBldmVudFRhcmdldFNldHRpbmdzID0gZXZlbnREYXRhWzBdXHJcbiAgICAgIGxldCBldmVudE5hbWUgPSBldmVudERhdGFbMV1cclxuICAgICAgbGV0IGV2ZW50VGFyZ2V0cyA9IE1WQy5VdGlscy5vYmplY3RRdWVyeShcclxuICAgICAgICBldmVudFRhcmdldFNldHRpbmdzLFxyXG4gICAgICAgIHRhcmdldE9iamVjdHNcclxuICAgICAgKVxyXG4gICAgICBldmVudFRhcmdldHMgPSAoIU1WQy5VdGlscy5pc0FycmF5KGV2ZW50VGFyZ2V0cykpXHJcbiAgICAgICAgPyBbWydAJywgZXZlbnRUYXJnZXRzXV1cclxuICAgICAgICA6IGV2ZW50VGFyZ2V0c1xyXG4gICAgICBmb3IobGV0IFtldmVudFRhcmdldE5hbWUsIGV2ZW50VGFyZ2V0XSBvZiBldmVudFRhcmdldHMpIHtcclxuICAgICAgICBsZXQgZXZlbnRNZXRob2ROYW1lID0gKHRvZ2dsZU1ldGhvZCA9PT0gJ29uJylcclxuICAgICAgICAgID8gJ29uJ1xyXG4gICAgICAgICAgOiAnb2ZmJ1xyXG4gICAgICAgIGxldCBldmVudENhbGxiYWNrID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5KFxyXG4gICAgICAgICAgZXZlbnRDYWxsYmFja05hbWUsXHJcbiAgICAgICAgICBjYWxsYmFja3NcclxuICAgICAgICApWzBdWzFdXHJcbiAgICAgICAgZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuIiwiTVZDLlV0aWxzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldFZpZXdPYmplY3RzID0gZnVuY3Rpb24gdG9nZ2xlRXZlbnRzRm9yVGFyZ2V0Vmlld09iamVjdHMoXHJcbiAgdG9nZ2xlTWV0aG9kLFxyXG4gIGV2ZW50cyxcclxuICB0YXJnZXRPYmplY3RzLFxyXG4gIGNhbGxiYWNrc1xyXG4pIHtcclxuICBPYmplY3QuZW50cmllcyhldmVudHMpXHJcbiAgICAuZm9yRWFjaCgoZXZlbnRTZXR0aW5ncywgZXZlbnRDYWxsYmFja05hbWUpID0+IHtcclxuICAgICAgbGV0IGV2ZW50RGF0YSA9IGV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxyXG4gICAgICBsZXQgZXZlbnRUYXJnZXRTZXR0aW5ncyA9IGV2ZW50RGF0YVswXVxyXG4gICAgICBsZXQgZXZlbnROYW1lID0gZXZlbnREYXRhWzFdXHJcbiAgICAgIGxldCBldmVudFRhcmdldHMgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkoXHJcbiAgICAgICAgZXZlbnRUYXJnZXRTZXR0aW5ncyxcclxuICAgICAgICB0YXJnZXRPYmplY3RzXHJcbiAgICAgIClcclxuICAgICAgZXZlbnRUYXJnZXRzID0gKCFNVkMuVXRpbHMuaXNBcnJheShldmVudFRhcmdldHMpKVxyXG4gICAgICAgID8gW1snQCcsIGV2ZW50VGFyZ2V0c11dXHJcbiAgICAgICAgOiBldmVudFRhcmdldHNcclxuICAgICAgZm9yKGxldCBbZXZlbnRUYXJnZXROYW1lLCBldmVudFRhcmdldF0gb2YgZXZlbnRUYXJnZXRzKSB7XHJcbiAgICAgICAgbGV0IGV2ZW50TWV0aG9kTmFtZSA9ICh0b2dnbGVNZXRob2QgPT09ICdvbicpXHJcbiAgICAgICAgICA/ICdhZGRFdmVudExpc3RlbmVyJ1xyXG4gICAgICAgICAgOiAncmVtb3ZlRXZlbnRMaXN0ZW5lcidcclxuICAgICAgICBsZXQgZXZlbnRDYWxsYmFjayA9IE1WQy5VdGlscy5vYmplY3RRdWVyeShcclxuICAgICAgICAgIGV2ZW50Q2FsbGJhY2tOYW1lLFxyXG4gICAgICAgICAgY2FsbGJhY2tzXHJcbiAgICAgICAgKVswXVsxXVxyXG4gICAgICAgIGlmKGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuICAgICAgICAgIGZvcihsZXQgX2V2ZW50VGFyZ2V0IG9mIGV2ZW50VGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIF9ldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYoZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG59XHJcbiJdfQ==