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
    eventTargets = !MVC.Utils.isArray(eventTargets) ? [['@', eventTargets]] : eventTargets;

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
      data: this.parse()
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
      if (settings.emitterEvents) this._emitterEvents = settings.emitterEvents;
      if (settings.modelEvents) this._modelEvents = settings.modelEvents;
      if (settings.viewEvents) this._viewEvents = settings.viewEvents;
      if (settings.controllerEvents) this._controllerEvents = settings.controllerEvents;

      if (this.emitterEvents && this.emitters && this.emitterCallbacks) {
        this.enableEmitterEvents();
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
    return String(window.location.hash).split('#').pop();
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
    this.controller = this.controller ? this.controller : {};
    return this.controller;
  }

  set _controller(controller) {
    this.controller = MVC.Utils.addPropertiesToObject(controller, this._controller);
  }

  enable() {
    var settings = this.settings;

    if (settings && !this.enabled) {
      this.enableRoutes(this.routes, this.controllers);
      this.enableEvents();
      this._enabled = true;
    }
  }

  disable() {
    var settings = this.settings;

    if (settings && this.enabled) {
      this.disableEvents();
      this.disableRoutes();
      this._enabled = false;
    }
  }

  enableRoutes(routes, controllers) {
    if (settings.controllers) this._controllers = settings.controllers;
    this._routes = settings.routes.map(route => controllers[routes[route]]);
    return;
  }

  disableRoutes() {
    delete this._routes;
    delete this._controllers;
  }

  enableEvents() {
    window.addEventListener('hashchange', this.hashChange.bind(this));
  }

  disableEvents() {
    window.removeEventListener('hashchange', this.hashChange.bind(this));
  }

  hashChange(event) {
    var route = this.route;

    try {
      this.routes[route](event);
      this.emit('navigate', this);
    } catch (error) {}
  }

  navigate(path) {
    window.location.hash = path;
  }

};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1WQy5qcyIsIkNvbnN0YW50cy5qcyIsIkV2ZW50cy5qcyIsIlRlbXBsYXRlcy5qcyIsIlV0aWxzLmpzIiwiaXMuanMiLCJ0eXBlT2YuanMiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QuanMiLCJvYmplY3RRdWVyeS5qcyIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMuanMiLCJ2YWxpZGF0ZURhdGFTY2hlbWEuanMiLCJDaGFubmVscy5qcyIsIkNoYW5uZWwuanMiLCJCYXNlLmpzIiwiU2VydmljZS5qcyIsIk1vZGVsLmpzIiwiRW1pdHRlci5qcyIsIlZpZXcuanMiLCJDb250cm9sbGVyLmpzIiwiUm91dGVyLmpzIl0sIm5hbWVzIjpbIk1WQyIsIkNvbnN0YW50cyIsIkNPTlNUIiwiRXZlbnRzIiwiRVYiLCJUZW1wbGF0ZXMiLCJPYmplY3RRdWVyeVN0cmluZ0Zvcm1hdEludmFsaWRSb290IiwiT2JqZWN0UXVlcnlTdHJpbmdGb3JtYXRJbnZhbGlkIiwiZGF0YSIsImpvaW4iLCJEYXRhU2NoZW1hTWlzbWF0Y2giLCJEYXRhRnVuY3Rpb25JbnZhbGlkIiwiRGF0YVVuZGVmaW5lZCIsIlNjaGVtYVVuZGVmaW5lZCIsIlRNUEwiLCJVdGlscyIsImlzQXJyYXkiLCJvYmplY3QiLCJBcnJheSIsImlzT2JqZWN0IiwiaXNFcXVhbFR5cGUiLCJ2YWx1ZUEiLCJ2YWx1ZUIiLCJpc0hUTUxFbGVtZW50IiwiSFRNTEVsZW1lbnQiLCJ0eXBlT2YiLCJfb2JqZWN0IiwiYWRkUHJvcGVydGllc1RvT2JqZWN0IiwidGFyZ2V0T2JqZWN0IiwiYXJndW1lbnRzIiwibGVuZ3RoIiwicHJvcGVydGllcyIsInByb3BlcnR5TmFtZSIsInByb3BlcnR5VmFsdWUiLCJPYmplY3QiLCJlbnRyaWVzIiwib2JqZWN0UXVlcnkiLCJzdHJpbmciLCJjb250ZXh0Iiwic3RyaW5nRGF0YSIsInBhcnNlTm90YXRpb24iLCJzcGxpY2UiLCJyZWR1Y2UiLCJmcmFnbWVudCIsImZyYWdtZW50SW5kZXgiLCJmcmFnbWVudHMiLCJwYXJzZUZyYWdtZW50IiwicHJvcGVydHlLZXkiLCJtYXRjaCIsImNvbmNhdCIsImNoYXJBdCIsInNsaWNlIiwic3BsaXQiLCJSZWdFeHAiLCJ0b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzIiwidG9nZ2xlTWV0aG9kIiwiZXZlbnRzIiwidGFyZ2V0T2JqZWN0cyIsImNhbGxiYWNrcyIsImV2ZW50U2V0dGluZ3MiLCJldmVudENhbGxiYWNrTmFtZSIsImV2ZW50RGF0YSIsImV2ZW50VGFyZ2V0U2V0dGluZ3MiLCJldmVudE5hbWUiLCJldmVudFRhcmdldHMiLCJldmVudFRhcmdldE5hbWUiLCJldmVudFRhcmdldCIsImV2ZW50TWV0aG9kTmFtZSIsIk5vZGVMaXN0IiwiZXZlbnRDYWxsYmFjayIsIl9ldmVudFRhcmdldCIsImJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMiLCJ1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyIsInZhbGlkYXRlRGF0YVNjaGVtYSIsInNjaGVtYSIsImFycmF5IiwiY29uc29sZSIsImxvZyIsIm5hbWUiLCJhcnJheUtleSIsImFycmF5VmFsdWUiLCJwdXNoIiwib2JqZWN0S2V5Iiwib2JqZWN0VmFsdWUiLCJjb25zdHJ1Y3RvciIsIl9ldmVudHMiLCJldmVudENhbGxiYWNrcyIsImV2ZW50Q2FsbGJhY2tHcm91cCIsIm9uIiwib2ZmIiwiZW1pdCIsImV2ZW50Q2FsbGJhY2tHcm91cE5hbWUiLCJhZGRpdGlvbmFsQXJndW1lbnRzIiwidmFsdWVzIiwiQ2hhbm5lbHMiLCJfY2hhbm5lbHMiLCJjaGFubmVscyIsImNoYW5uZWwiLCJjaGFubmVsTmFtZSIsIkNoYW5uZWwiLCJfcmVzcG9uc2VzIiwicmVzcG9uc2VzIiwicmVzcG9uc2UiLCJyZXNwb25zZU5hbWUiLCJyZXNwb25zZUNhbGxiYWNrIiwicmVxdWVzdCIsInJlcXVlc3REYXRhIiwia2V5cyIsIkJhc2UiLCJzZXR0aW5ncyIsIm9wdGlvbnMiLCJjb25maWd1cmF0aW9uIiwiX2NvbmZpZ3VyYXRpb24iLCJfb3B0aW9ucyIsIl9zZXR0aW5ncyIsIl9lbWl0dGVycyIsImVtaXR0ZXJzIiwiU2VydmljZSIsIl9kZWZhdWx0cyIsImRlZmF1bHRzIiwiY29udGVudFR5cGUiLCJyZXNwb25zZVR5cGUiLCJfcmVzcG9uc2VUeXBlcyIsIl9yZXNwb25zZVR5cGUiLCJfeGhyIiwiZmluZCIsInJlc3BvbnNlVHlwZUl0ZW0iLCJfdHlwZSIsInR5cGUiLCJfdXJsIiwidXJsIiwiX2hlYWRlcnMiLCJoZWFkZXJzIiwiaGVhZGVyIiwic2V0UmVxdWVzdEhlYWRlciIsIl9kYXRhIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJfZW5hYmxlZCIsImVuYWJsZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInN0YXR1cyIsImFib3J0Iiwib3BlbiIsIm9ubG9hZCIsIm9uZXJyb3IiLCJzZW5kIiwidGhlbiIsImN1cnJlbnRUYXJnZXQiLCJlbmFibGUiLCJkaXNhYmxlIiwiTW9kZWwiLCJfaXNTZXR0aW5nIiwiaXNTZXR0aW5nIiwic2V0IiwiX3NjaGVtYSIsIl9oaXN0aW9ncmFtIiwiaGlzdGlvZ3JhbSIsImFzc2lnbiIsIl9oaXN0b3J5IiwiaGlzdG9yeSIsInVuc2hpZnQiLCJwYXJzZSIsIl9kYXRhRXZlbnRzIiwiZGF0YUV2ZW50cyIsIl9kYXRhQ2FsbGJhY2tzIiwiZGF0YUNhbGxiYWNrcyIsIl9zZXJ2aWNlcyIsInNlcnZpY2VzIiwiX3NlcnZpY2VFdmVudHMiLCJzZXJ2aWNlRXZlbnRzIiwiX3NlcnZpY2VDYWxsYmFja3MiLCJzZXJ2aWNlQ2FsbGJhY2tzIiwiZW5hYmxlU2VydmljZUV2ZW50cyIsImRpc2FibGVTZXJ2aWNlRXZlbnRzIiwidW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzIiwiZW5hYmxlRGF0YUV2ZW50cyIsImRpc2FibGVEYXRhRXZlbnRzIiwiZ2V0IiwicHJvcGVydHkiLCJfYXJndW1lbnRzIiwiZm9yRWFjaCIsImluZGV4Iiwia2V5IiwidmFsdWUiLCJzZXREYXRhUHJvcGVydHkiLCJzaWxlbnQiLCJ1bnNldCIsInVuc2V0RGF0YVByb3BlcnR5IiwiZGVmaW5lUHJvcGVydGllcyIsImNvbmZpZ3VyYWJsZSIsInNldFZhbHVlRXZlbnROYW1lIiwic2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZUV2ZW50TmFtZSIsInVuc2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJFbWl0dGVyIiwiX25hbWUiLCJlbWlzc2lvbiIsIlZpZXciLCJfZWxlbWVudE5hbWUiLCJfZWxlbWVudCIsInRhZ05hbWUiLCJlbGVtZW50TmFtZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZWxlbWVudE9ic2VydmVyIiwib2JzZXJ2ZSIsInN1YnRyZWUiLCJjaGlsZExpc3QiLCJfYXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVLZXkiLCJhdHRyaWJ1dGVWYWx1ZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsIl91aSIsInVpIiwidWlLZXkiLCJ1aVZhbHVlIiwicXVlcnlTZWxlY3RvckFsbCIsIl91aUV2ZW50cyIsInVpRXZlbnRzIiwiX3VpQ2FsbGJhY2tzIiwidWlDYWxsYmFja3MiLCJfb2JzZXJ2ZXJDYWxsYmFja3MiLCJvYnNlcnZlckNhbGxiYWNrcyIsIl9lbGVtZW50T2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZWxlbWVudE9ic2VydmUiLCJiaW5kIiwiX2luc2VydCIsImluc2VydCIsIl90ZW1wbGF0ZXMiLCJ0ZW1wbGF0ZXMiLCJtdXRhdGlvblJlY29yZExpc3QiLCJvYnNlcnZlciIsIm11dGF0aW9uUmVjb3JkSW5kZXgiLCJtdXRhdGlvblJlY29yZCIsIm11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcyIsIm11dGF0aW9uUmVjb3JkQ2F0ZWdvcnkiLCJyZXNldFVJIiwiYXV0b0luc2VydCIsImluc2VydEFkamFjZW50RWxlbWVudCIsIm1ldGhvZCIsImF1dG9SZW1vdmUiLCJwYXJlbnRFbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJlbmFibGVFbGVtZW50IiwiZGlzYWJsZUVsZW1lbnQiLCJkaXNhYmxlVUkiLCJlbmFibGVVSSIsImVuYWJsZVVJRXZlbnRzIiwiZGlzYWJsZVVJRXZlbnRzIiwiZW5hYmxlRW1pdHRlcnMiLCJkaXNhYmxlRW1pdHRlcnMiLCJ0aGlzcyIsIkNvbnRyb2xsZXIiLCJfZW1pdHRlckNhbGxiYWNrcyIsImVtaXR0ZXJDYWxsYmFja3MiLCJfbW9kZWxDYWxsYmFja3MiLCJtb2RlbENhbGxiYWNrcyIsIl92aWV3Q2FsbGJhY2tzIiwidmlld0NhbGxiYWNrcyIsIl9jb250cm9sbGVyQ2FsbGJhY2tzIiwiY29udHJvbGxlckNhbGxiYWNrcyIsIl9yb3V0ZXJDYWxsYmFja3MiLCJyb3V0ZXJDYWxsYmFja3MiLCJfbW9kZWxzIiwibW9kZWxzIiwiX3ZpZXdzIiwidmlld3MiLCJfY29udHJvbGxlcnMiLCJjb250cm9sbGVycyIsIl9yb3V0ZXJzIiwicm91dGVycyIsIl9lbWl0dGVyRXZlbnRzIiwiZW1pdHRlckV2ZW50cyIsIl9tb2RlbEV2ZW50cyIsIm1vZGVsRXZlbnRzIiwiX3ZpZXdFdmVudHMiLCJ2aWV3RXZlbnRzIiwiX2NvbnRyb2xsZXJFdmVudHMiLCJjb250cm9sbGVyRXZlbnRzIiwiZW5hYmxlTW9kZWxFdmVudHMiLCJkaXNhYmxlTW9kZWxFdmVudHMiLCJlbmFibGVWaWV3RXZlbnRzIiwiZGlzYWJsZVZpZXdFdmVudHMiLCJlbmFibGVDb250cm9sbGVyRXZlbnRzIiwiZGlzYWJsZUNvbnRyb2xsZXJFdmVudHMiLCJlbmFibGVFbWl0dGVyRXZlbnRzIiwiZGlzYWJsZUVtaXR0ZXJFdmVudHMiLCJSb3V0ZXIiLCJyb3V0ZSIsIlN0cmluZyIsIndpbmRvdyIsImxvY2F0aW9uIiwiaGFzaCIsInBvcCIsIl9yb3V0ZXMiLCJyb3V0ZXMiLCJfY29udHJvbGxlciIsImNvbnRyb2xsZXIiLCJlbmFibGVSb3V0ZXMiLCJlbmFibGVFdmVudHMiLCJkaXNhYmxlRXZlbnRzIiwiZGlzYWJsZVJvdXRlcyIsIm1hcCIsImFkZEV2ZW50TGlzdGVuZXIiLCJoYXNoQ2hhbmdlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwiZXJyb3IiLCJuYXZpZ2F0ZSIsInBhdGgiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLEdBQUcsR0FBR0EsR0FBRyxJQUFJLEVBQWpCO0FDQUFBLEdBQUcsQ0FBQ0MsU0FBSixHQUFnQixFQUFoQjtBQUNBRCxHQUFHLENBQUNFLEtBQUosR0FBWUYsR0FBRyxDQUFDQyxTQUFoQjtBQ0RBRCxHQUFHLENBQUNDLFNBQUosQ0FBY0UsTUFBZCxHQUF1QixFQUF2QjtBQUNBSCxHQUFHLENBQUNFLEtBQUosQ0FBVUUsRUFBVixHQUFlSixHQUFHLENBQUNDLFNBQUosQ0FBY0UsTUFBN0I7QUNEQUgsR0FBRyxDQUFDSyxTQUFKLEdBQWdCO0FBQ2RDLEVBQUFBLGtDQUFrQyxFQUFFLFNBQVNDLDhCQUFULENBQXdDQyxJQUF4QyxFQUE4QztBQUNoRixXQUFPLENBQ0wsMEVBREssRUFFTEMsSUFGSyxDQUVBLElBRkEsQ0FBUDtBQUdELEdBTGE7QUFNZEMsRUFBQUEsa0JBQWtCLEVBQUUsU0FBU0Esa0JBQVQsQ0FBNEJGLElBQTVCLEVBQWtDO0FBQ3BELFdBQU8sNkNBRUxDLElBRkssQ0FFQSxJQUZBLENBQVA7QUFHRCxHQVZhO0FBV2RFLEVBQUFBLG1CQUFtQixFQUFFLFNBQVNBLG1CQUFULENBQTZCSCxJQUE3QixFQUFtQztBQUN0RCw0REFFRUMsSUFGRixDQUVPLElBRlA7QUFHRCxHQWZhO0FBZ0JkRyxFQUFBQSxhQUFhLEVBQUUsU0FBU0EsYUFBVCxDQUF1QkosSUFBdkIsRUFBNkI7QUFDMUMsdUNBRUVDLElBRkYsQ0FFTyxJQUZQO0FBR0QsR0FwQmE7QUFxQmRJLEVBQUFBLGVBQWUsRUFBRSxTQUFTQSxlQUFULENBQXlCTCxJQUF6QixFQUErQjtBQUM5QyxvQ0FFRUMsSUFGRixDQUVPLElBRlA7QUFHRDtBQXpCYSxDQUFoQjtBQTJC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LENBQXdCLFlBQXhCLEVBQXNDLEtBQUtDLFVBQUwsQ0FBZ0IvRSxJQUFoQixDQUFxQixJQUFyQixDQUF0QztBQUNEOztBQUNEMkUsRUFBQUEsYUFBYSxHQUFHO0FBQ2RWLElBQUFBLE1BQU0sQ0FBQ2UsbUJBQVAsQ0FBMkIsWUFBM0IsRUFBeUMsS0FBS0QsVUFBTCxDQUFnQi9FLElBQWhCLENBQXFCLElBQXJCLENBQXpDO0FBQ0Q7O0FBQ0QrRSxFQUFBQSxVQUFVLENBQUNFLEtBQUQsRUFBUTtBQUNoQixRQUFJbEIsS0FBSyxHQUFHLEtBQUtBLEtBQWpCOztBQUNBLFFBQUk7QUFDRixXQUFLTyxNQUFMLENBQVlQLEtBQVosRUFBbUJrQixLQUFuQjtBQUNBLFdBQUtuTyxJQUFMLENBQVUsVUFBVixFQUFzQixJQUF0QjtBQUNELEtBSEQsQ0FHRSxPQUFNb08sS0FBTixFQUFhLENBQUU7QUFDbEI7O0FBQ0RDLEVBQUFBLFFBQVEsQ0FBQ0MsSUFBRCxFQUFPO0FBQ2JuQixJQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLElBQWhCLEdBQXVCaUIsSUFBdkI7QUFDRDs7QUE3RWlDLENBQXBDIiwiZmlsZSI6ImJyb3dzZXIvbXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBNVkMgPSBNVkMgfHwge31cclxuIiwiTVZDLkNvbnN0YW50cyA9IHt9XG5NVkMuQ09OU1QgPSBNVkMuQ29uc3RhbnRzXG4iLCJNVkMuRXZlbnRzID0gY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2V2ZW50cygpIHtcclxuICAgIHRoaXMuZXZlbnRzID0gKHRoaXMuZXZlbnRzKVxyXG4gICAgICA/IHRoaXMuZXZlbnRzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmV2ZW50c1xyXG4gIH1cclxuICBldmVudENhbGxiYWNrcyhldmVudE5hbWUpIHsgcmV0dXJuIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdIHx8IHt9IH1cclxuICBldmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gKGV2ZW50Q2FsbGJhY2submFtZS5sZW5ndGgpXHJcbiAgICAgID8gZXZlbnRDYWxsYmFjay5uYW1lXHJcbiAgICAgIDogJ2Fub255bW91c0Z1bmN0aW9uJ1xyXG4gIH1cclxuICBldmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKSB7XHJcbiAgICByZXR1cm4gZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdIHx8IFtdXHJcbiAgfVxyXG4gIG9uKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaykge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5ldmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja05hbWUgPSB0aGlzLmV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja0dyb3VwID0gdGhpcy5ldmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKVxyXG4gICAgZXZlbnRDYWxsYmFja0dyb3VwLnB1c2goZXZlbnRDYWxsYmFjaylcclxuICAgIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudENhbGxiYWNrc1xyXG4gIH1cclxuICBvZmYoKSB7XHJcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2sgPSBhcmd1bWVudHNbMV1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFja05hbWUgPSB0aGlzLmV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdW2V2ZW50Q2FsbGJhY2tOYW1lXVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfVxyXG4gIGVtaXQoZXZlbnROYW1lLCBldmVudERhdGEpIHtcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IHRoaXMuZXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgZm9yKGxldCBbZXZlbnRDYWxsYmFja0dyb3VwTmFtZSwgZXZlbnRDYWxsYmFja0dyb3VwXSBvZiBPYmplY3QuZW50cmllcyhldmVudENhbGxiYWNrcykpIHtcclxuICAgICAgZm9yKGxldCBldmVudENhbGxiYWNrIG9mIGV2ZW50Q2FsbGJhY2tHcm91cCkge1xyXG4gICAgICAgIGxldCBhZGRpdGlvbmFsQXJndW1lbnRzID0gT2JqZWN0LnZhbHVlcyhhcmd1bWVudHMpLnNwbGljZSgyKVxyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2soZXZlbnREYXRhLCAuLi5hZGRpdGlvbmFsQXJndW1lbnRzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIk1WQy5UZW1wbGF0ZXMgPSB7XHJcbiAgT2JqZWN0UXVlcnlTdHJpbmdGb3JtYXRJbnZhbGlkUm9vdDogZnVuY3Rpb24gT2JqZWN0UXVlcnlTdHJpbmdGb3JtYXRJbnZhbGlkKGRhdGEpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgICdPYmplY3QgUXVlcnkgXCJzdHJpbmdcIiBwcm9wZXJ0eSBtdXN0IGJlIGZvcm1hdHRlZCB0byBmaXJzdCBpbmNsdWRlIFwiW0BdXCIuJ1xyXG4gICAgXS5qb2luKCdcXG4nKVxyXG4gIH0sXHJcbiAgRGF0YVNjaGVtYU1pc21hdGNoOiBmdW5jdGlvbiBEYXRhU2NoZW1hTWlzbWF0Y2goZGF0YSkge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgYERhdGEgYW5kIFNjaGVtYSBwcm9wZXJ0aWVzIGRvIG5vdCBtYXRjaC5gXHJcbiAgICBdLmpvaW4oJ1xcbicpXHJcbiAgfSxcclxuICBEYXRhRnVuY3Rpb25JbnZhbGlkOiBmdW5jdGlvbiBEYXRhRnVuY3Rpb25JbnZhbGlkKGRhdGEpIHtcclxuICAgIFtcclxuICAgICAgYE1vZGVsIERhdGEgcHJvcGVydHkgdHlwZSBcIkZ1bmN0aW9uXCIgaXMgbm90IHZhbGlkLmBcclxuICAgIF0uam9pbignXFxuJylcclxuICB9LFxyXG4gIERhdGFVbmRlZmluZWQ6IGZ1bmN0aW9uIERhdGFVbmRlZmluZWQoZGF0YSkge1xyXG4gICAgW1xyXG4gICAgICBgTW9kZWwgRGF0YSBwcm9wZXJ0eSB1bmRlZmluZWQuYFxyXG4gICAgXS5qb2luKCdcXG4nKVxyXG4gIH0sXHJcbiAgU2NoZW1hVW5kZWZpbmVkOiBmdW5jdGlvbiBTY2hlbWFVbmRlZmluZWQoZGF0YSkge1xyXG4gICAgW1xyXG4gICAgICBgTW9kZWwgXCJTY2hlbWFcIiB1bmRlZmluZWQuYFxyXG4gICAgXS5qb2luKCdcXG4nKVxyXG4gIH0sXHJcbn1cclxuTVZDLlRNUEwgPSBNVkMuVGVtcGxhdGVzXHJcbiIsIk1WQy5VdGlscyA9IHt9XHJcbiIsIk1WQy5VdGlscy5pc0FycmF5ID0gZnVuY3Rpb24gaXNBcnJheShvYmplY3QpIHsgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqZWN0KSB9XHJcbk1WQy5VdGlscy5pc09iamVjdCA9IGZ1bmN0aW9uIGlzT2JqZWN0KG9iamVjdCkge1xyXG4gIHJldHVybiAoIUFycmF5LmlzQXJyYXkob2JqZWN0KSlcclxuICAgID8gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCdcclxuICAgIDogZmFsc2VcclxufVxyXG5NVkMuVXRpbHMuaXNFcXVhbFR5cGUgPSBmdW5jdGlvbiBpc0VxdWFsVHlwZSh2YWx1ZUEsIHZhbHVlQikgeyByZXR1cm4gdmFsdWVBID09PSB2YWx1ZUIgfVxyXG5NVkMuVXRpbHMuaXNIVE1MRWxlbWVudCA9IGZ1bmN0aW9uIGlzSFRNTEVsZW1lbnQob2JqZWN0KSB7XHJcbiAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XHJcbn1cclxuIiwiTVZDLlV0aWxzLnR5cGVPZiA9ICBmdW5jdGlvbiB0eXBlT2YoZGF0YSkge1xyXG4gIHN3aXRjaCh0eXBlb2YgZGF0YSkge1xyXG4gICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgbGV0IF9vYmplY3RcclxuICAgICAgaWYoTVZDLlV0aWxzLmlzQXJyYXkoZGF0YSkpIHtcclxuICAgICAgICAvLyBBcnJheVxyXG4gICAgICAgIHJldHVybiAnYXJyYXknXHJcbiAgICAgIH0gZWxzZSBpZihcclxuICAgICAgICBNVkMuVXRpbHMuaXNPYmplY3QoZGF0YSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgLy8gT2JqZWN0XHJcbiAgICAgICAgcmV0dXJuICdvYmplY3QnXHJcbiAgICAgIH0gZWxzZSBpZihcclxuICAgICAgICBkYXRhID09PSBudWxsXHJcbiAgICAgICkge1xyXG4gICAgICAgIC8vIE51bGxcclxuICAgICAgICByZXR1cm4gJ251bGwnXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIF9vYmplY3RcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICBjYXNlICdudW1iZXInOlxyXG4gICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICBjYXNlICd1bmRlZmluZWQnOlxyXG4gICAgY2FzZSAnZnVuY3Rpb24nOlxyXG4gICAgICByZXR1cm4gdHlwZW9mIGRhdGFcclxuICAgICAgYnJlYWtcclxuICB9XHJcbn1cclxuIiwiTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdCA9IGZ1bmN0aW9uIGFkZFByb3BlcnRpZXNUb09iamVjdCgpIHtcclxuICBsZXQgdGFyZ2V0T2JqZWN0XHJcbiAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgIGNhc2UgMjpcclxuICAgICAgbGV0IHByb3BlcnRpZXMgPSBhcmd1bWVudHNbMF1cclxuICAgICAgdGFyZ2V0T2JqZWN0ID0gYXJndW1lbnRzWzFdXHJcbiAgICAgIGZvcihsZXQgW3Byb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocHJvcGVydGllcykpIHtcclxuICAgICAgICB0YXJnZXRPYmplY3RbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5VmFsdWVcclxuICAgICAgfVxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAzOlxyXG4gICAgICBsZXQgcHJvcGVydHlOYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgIGxldCBwcm9wZXJ0eVZhbHVlID0gYXJndW1lbnRzWzFdXHJcbiAgICAgIHRhcmdldE9iamVjdCA9IGFyZ3VtZW50c1syXVxyXG4gICAgICB0YXJnZXRPYmplY3RbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5VmFsdWVcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgcmV0dXJuIHRhcmdldE9iamVjdFxyXG59XHJcbiIsIk1WQy5VdGlscy5vYmplY3RRdWVyeSA9IGZ1bmN0aW9uIG9iamVjdFF1ZXJ5KFxyXG4gIHN0cmluZyxcclxuICBjb250ZXh0XHJcbikge1xyXG4gIGxldCBzdHJpbmdEYXRhID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlTm90YXRpb24oc3RyaW5nKVxyXG4gIGlmKHN0cmluZ0RhdGFbMF0gPT09ICdAJykgc3RyaW5nRGF0YS5zcGxpY2UoMCwgMSlcclxuICBpZighc3RyaW5nRGF0YS5sZW5ndGgpIHJldHVybiBjb250ZXh0XHJcbiAgY29udGV4dCA9IChNVkMuVXRpbHMuaXNPYmplY3QoY29udGV4dCkpXHJcbiAgICA/IE9iamVjdC5lbnRyaWVzKGNvbnRleHQpXHJcbiAgICA6IGNvbnRleHRcclxuICByZXR1cm4gc3RyaW5nRGF0YS5yZWR1Y2UoKG9iamVjdCwgZnJhZ21lbnQsIGZyYWdtZW50SW5kZXgsIGZyYWdtZW50cykgPT4ge1xyXG4gICAgbGV0IHByb3BlcnRpZXMgPSBbXVxyXG4gICAgZnJhZ21lbnQgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VGcmFnbWVudChmcmFnbWVudClcclxuICAgIGZvcihsZXQgW3Byb3BlcnR5S2V5LCBwcm9wZXJ0eVZhbHVlXSBvZiBvYmplY3QpIHtcclxuICAgICAgaWYocHJvcGVydHlLZXkubWF0Y2goZnJhZ21lbnQpKSB7XHJcbiAgICAgICAgaWYoZnJhZ21lbnRJbmRleCA9PT0gZnJhZ21lbnRzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzLmNvbmNhdChbW3Byb3BlcnR5S2V5LCBwcm9wZXJ0eVZhbHVlXV0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzLmNvbmNhdChPYmplY3QuZW50cmllcyhwcm9wZXJ0eVZhbHVlKSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIG9iamVjdCA9IHByb3BlcnRpZXNcclxuICAgIHJldHVybiBvYmplY3RcclxuICB9LCBjb250ZXh0KVxyXG59XHJcbk1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZU5vdGF0aW9uID0gZnVuY3Rpb24gcGFyc2VOb3RhdGlvbihzdHJpbmcpIHtcclxuICBpZihcclxuICAgIHN0cmluZy5jaGFyQXQoMCkgPT09ICdbJyAmJlxyXG4gICAgc3RyaW5nLmNoYXJBdChzdHJpbmcubGVuZ3RoIC0gMSkgPT0gJ10nXHJcbiAgKSB7XHJcbiAgICBzdHJpbmcgPSBzdHJpbmdcclxuICAgICAgLnNsaWNlKDEsIC0xKVxyXG4gICAgICAuc3BsaXQoJ11bJylcclxuICB9IGVsc2Uge1xyXG4gICAgc3RyaW5nID0gc3RyaW5nXHJcbiAgICAgIC5zcGxpdCgnLicpXHJcbiAgfVxyXG4gIHJldHVybiBzdHJpbmdcclxufVxyXG5NVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VGcmFnbWVudCA9IGZ1bmN0aW9uIHBhcnNlRnJhZ21lbnQoZnJhZ21lbnQpIHtcclxuICBpZihcclxuICAgIGZyYWdtZW50LmNoYXJBdCgwKSA9PT0gJy8nICYmXHJcbiAgICBmcmFnbWVudC5jaGFyQXQoZnJhZ21lbnQubGVuZ3RoIC0gMSkgPT0gJy8nXHJcbiAgKSB7XHJcbiAgICBmcmFnbWVudCA9IGZyYWdtZW50LnNsaWNlKDEsIC0xKVxyXG4gICAgZnJhZ21lbnQgPSBuZXcgUmVnRXhwKGZyYWdtZW50KVxyXG4gIH1cclxuICByZXR1cm4gZnJhZ21lbnRcclxufVxyXG4iLCJNVkMuVXRpbHMudG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIHRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoXHJcbiAgdG9nZ2xlTWV0aG9kLFxyXG4gIGV2ZW50cyxcclxuICB0YXJnZXRPYmplY3RzLFxyXG4gIGNhbGxiYWNrc1xyXG4pIHtcclxuICBmb3IobGV0IFtldmVudFNldHRpbmdzLCBldmVudENhbGxiYWNrTmFtZV0gb2YgT2JqZWN0LmVudHJpZXMoZXZlbnRzKSkge1xyXG4gICAgbGV0IGV2ZW50RGF0YSA9IGV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxyXG4gICAgbGV0IGV2ZW50VGFyZ2V0U2V0dGluZ3MgPSBldmVudERhdGFbMF1cclxuICAgIGxldCBldmVudE5hbWUgPSBldmVudERhdGFbMV1cclxuICAgIGxldCBldmVudFRhcmdldHMgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkoXHJcbiAgICAgIGV2ZW50VGFyZ2V0U2V0dGluZ3MsXHJcbiAgICAgIHRhcmdldE9iamVjdHNcclxuICAgIClcclxuICAgIGV2ZW50VGFyZ2V0cyA9ICghTVZDLlV0aWxzLmlzQXJyYXkoZXZlbnRUYXJnZXRzKSlcclxuICAgICAgPyBbWydAJywgZXZlbnRUYXJnZXRzXV1cclxuICAgICAgOiBldmVudFRhcmdldHNcclxuICAgIGZvcihsZXQgW2V2ZW50VGFyZ2V0TmFtZSwgZXZlbnRUYXJnZXRdIG9mIGV2ZW50VGFyZ2V0cykge1xyXG4gICAgICBsZXQgZXZlbnRNZXRob2ROYW1lID0gKHRvZ2dsZU1ldGhvZCA9PT0gJ29uJylcclxuICAgICAgPyAoXHJcbiAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCB8fFxyXG4gICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcclxuICAgICAgKSA/ICdhZGRFdmVudExpc3RlbmVyJ1xyXG4gICAgICAgIDogJ29uJ1xyXG4gICAgICA6IChcclxuICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0IHx8XHJcbiAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxyXG4gICAgICApID8gJ3JlbW92ZUV2ZW50TGlzdGVuZXInXHJcbiAgICAgICAgOiAnb2ZmJ1xyXG4gICAgICBsZXQgZXZlbnRDYWxsYmFjayA9IE1WQy5VdGlscy5vYmplY3RRdWVyeShcclxuICAgICAgICBldmVudENhbGxiYWNrTmFtZSxcclxuICAgICAgICBjYWxsYmFja3NcclxuICAgICAgKVswXVsxXVxyXG4gICAgICBpZihldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XHJcbiAgICAgICAgZm9yKGxldCBfZXZlbnRUYXJnZXQgb2YgZXZlbnRUYXJnZXQpIHtcclxuICAgICAgICAgIF9ldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZihldmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KXtcclxuICAgICAgICBldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5NVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIGJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMoKSB7XHJcbiAgdGhpcy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKCdvbicsIC4uLmFyZ3VtZW50cylcclxufVxyXG5NVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMgPSBmdW5jdGlvbiB1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cygpIHtcclxuICB0aGlzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoJ29mZicsIC4uLmFyZ3VtZW50cylcclxufVxyXG4iLCJNVkMuVXRpbHMudmFsaWRhdGVEYXRhU2NoZW1hID0gZnVuY3Rpb24gdmFsaWRhdGVEYXRhU2NoZW1hKGRhdGEsIHNjaGVtYSkge1xyXG4gIGlmKHNjaGVtYSkge1xyXG4gICAgc3dpdGNoKE1WQy5VdGlscy50eXBlT2YoZGF0YSkpIHtcclxuICAgICAgY2FzZSAnYXJyYXknOlxyXG4gICAgICAgIGxldCBhcnJheSA9IFtdXHJcbiAgICAgICAgc2NoZW1hID0gKE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgID8gc2NoZW1hKClcclxuICAgICAgICAgIDogc2NoZW1hXHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBNVkMuVXRpbHMuaXNFcXVhbFR5cGUoXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSxcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihhcnJheSlcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHNjaGVtYS5uYW1lKVxyXG4gICAgICAgICAgZm9yKGxldCBbYXJyYXlLZXksIGFycmF5VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2goXHJcbiAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZURhdGFTY2hlbWEoYXJyYXlWYWx1ZSlcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyYXlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICAgIGxldCBvYmplY3QgPSB7fVxyXG4gICAgICAgIHNjaGVtYSA9IChNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSkgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICA/IHNjaGVtYSgpXHJcbiAgICAgICAgICA6IHNjaGVtYVxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgTVZDLlV0aWxzLmlzRXF1YWxUeXBlKFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSksXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yob2JqZWN0KVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coc2NoZW1hLm5hbWUpXHJcbiAgICAgICAgICBmb3IobGV0IFtvYmplY3RLZXksIG9iamVjdFZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xyXG4gICAgICAgICAgICBvYmplY3Rbb2JqZWN0S2V5XSA9IHRoaXMudmFsaWRhdGVEYXRhU2NoZW1hKG9iamVjdFZhbHVlLCBzY2hlbWFbb2JqZWN0S2V5XSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgICAgIHNjaGVtYSA9IChNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSkgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICA/IHNjaGVtYSgpXHJcbiAgICAgICAgICA6IHNjaGVtYVxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgTVZDLlV0aWxzLmlzRXF1YWxUeXBlKFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSksXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2YoZGF0YSlcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHNjaGVtYS5uYW1lKVxyXG4gICAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhyb3cgTVZDLlRNUExcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnbnVsbCc6XHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBNVkMuVXRpbHMuaXNFcXVhbFR5cGUoXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSxcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihkYXRhKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgICAgICB0aHJvdyBNVkMuVE1QTFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgICB0aHJvdyBNVkMuVE1QTFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IE1WQy5UTVBMXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5DaGFubmVscyA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9jaGFubmVscygpIHtcclxuICAgIHRoaXMuY2hhbm5lbHMgPSAodGhpcy5jaGFubmVscylcclxuICAgICAgPyB0aGlzLmNoYW5uZWxzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmNoYW5uZWxzXHJcbiAgfVxyXG4gIGNoYW5uZWwoY2hhbm5lbE5hbWUpIHtcclxuICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXSA9ICh0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0pXHJcbiAgICAgID8gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgIDogbmV3IE1WQy5DaGFubmVscy5DaGFubmVsKClcclxuICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbiAgb2ZmKGNoYW5uZWxOYW1lKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5DaGFubmVscy5DaGFubmVsID0gY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX3Jlc3BvbnNlcygpIHtcclxuICAgIHRoaXMucmVzcG9uc2VzID0gKHRoaXMucmVzcG9uc2VzKVxyXG4gICAgICA/IHRoaXMucmVzcG9uc2VzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLnJlc3BvbnNlc1xyXG4gIH1cclxuICByZXNwb25zZShyZXNwb25zZU5hbWUsIHJlc3BvbnNlQ2FsbGJhY2spIHtcclxuICAgIGlmKHJlc3BvbnNlQ2FsbGJhY2spIHtcclxuICAgICAgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0gPSByZXNwb25zZUNhbGxiYWNrXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlXVxyXG4gICAgfVxyXG4gIH1cclxuICByZXF1ZXN0KHJlc3BvbnNlTmFtZSwgcmVxdWVzdERhdGEpIHtcclxuICAgIGlmKHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXShyZXF1ZXN0RGF0YSlcclxuICAgIH1cclxuICB9XHJcbiAgb2ZmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yKGxldCBbcmVzcG9uc2VOYW1lXSBvZiBPYmplY3Qua2V5cyh0aGlzLl9yZXNwb25zZXMpKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiTVZDLkJhc2UgPSBjbGFzcyBleHRlbmRzIE1WQy5FdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzLCBvcHRpb25zLCBjb25maWd1cmF0aW9uKSB7XHJcbiAgICBzdXBlcigpXHJcbiAgICBpZihjb25maWd1cmF0aW9uKSB0aGlzLl9jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvblxyXG4gICAgaWYob3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnNcclxuICAgIGlmKHNldHRpbmdzKSB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgfVxyXG4gIGdldCBfY29uZmlndXJhdGlvbigpIHtcclxuICAgIHRoaXMuY29uZmlndXJhdGlvbiA9ICh0aGlzLmNvbmZpZ3VyYXRpb24pXHJcbiAgICAgID8gdGhpcy5jb25maWd1cmF0aW9uXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25cclxuICB9XHJcbiAgc2V0IF9jb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHsgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbiB9XHJcbiAgZ2V0IF9vcHRpb25zKCkge1xyXG4gICAgdGhpcy5vcHRpb25zID0gKHRoaXMub3B0aW9ucylcclxuICAgICAgPyB0aGlzLm9wdGlvbnNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9uc1xyXG4gIH1cclxuICBzZXQgX29wdGlvbnMob3B0aW9ucykgeyB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIH1cclxuICBnZXQgX3NldHRpbmdzKCkge1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9ICh0aGlzLnNldHRpbmdzKVxyXG4gICAgICA/IHRoaXMuc2V0dGluZ3NcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3NcclxuICB9XHJcbiAgc2V0IF9zZXR0aW5ncyhzZXR0aW5ncykge1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXHJcbiAgICAgIHNldHRpbmdzLCB0aGlzLl9zZXR0aW5nc1xyXG4gICAgKVxyXG4gIH1cclxuICBnZXQgX2VtaXR0ZXJzKCkge1xyXG4gICAgdGhpcy5lbWl0dGVycyA9ICh0aGlzLmVtaXR0ZXJzKVxyXG4gICAgICA/IHRoaXMuZW1pdHRlcnNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlcnNcclxuICB9XHJcbiAgc2V0IF9lbWl0dGVycyhlbWl0dGVycykge1xyXG4gICAgdGhpcy5lbWl0dGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXHJcbiAgICAgIGVtaXR0ZXJzLCB0aGlzLl9lbWl0dGVyc1xyXG4gICAgKVxyXG4gIH1cclxufVxyXG4iLCJNVkMuU2VydmljZSA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IF9kZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuZGVmYXVsdHMgfHwge1xuICAgIGNvbnRlbnRUeXBlOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30sXG4gICAgcmVzcG9uc2VUeXBlOiAnanNvbicsXG4gIH0gfVxuICBnZXQgX3Jlc3BvbnNlVHlwZXMoKSB7IHJldHVybiBbJycsICdhcnJheWJ1ZmZlcicsICdibG9iJywgJ2RvY3VtZW50JywgJ2pzb24nLCAndGV4dCddIH1cbiAgZ2V0IF9yZXNwb25zZVR5cGUoKSB7IHJldHVybiB0aGlzLnJlc3BvbnNlVHlwZSB9XG4gIHNldCBfcmVzcG9uc2VUeXBlKHJlc3BvbnNlVHlwZSkge1xuICAgIHRoaXMuX3hoci5yZXNwb25zZVR5cGUgPSB0aGlzLl9yZXNwb25zZVR5cGVzLmZpbmQoXG4gICAgICAocmVzcG9uc2VUeXBlSXRlbSkgPT4gcmVzcG9uc2VUeXBlSXRlbSA9PT0gcmVzcG9uc2VUeXBlXG4gICAgKSB8fCB0aGlzLl9kZWZhdWx0cy5yZXNwb25zZVR5cGVcbiAgfVxuICBnZXQgX3R5cGUoKSB7IHJldHVybiB0aGlzLnR5cGUgfVxuICBzZXQgX3R5cGUodHlwZSkgeyB0aGlzLnR5cGUgPSB0eXBlIH1cbiAgZ2V0IF91cmwoKSB7IHJldHVybiB0aGlzLnVybCB9XG4gIHNldCBfdXJsKHVybCkgeyB0aGlzLnVybCA9IHVybCB9XG4gIGdldCBfaGVhZGVycygpIHsgcmV0dXJuIHRoaXMuaGVhZGVycyB8fCBbXSB9XG4gIHNldCBfaGVhZGVycyhoZWFkZXJzKSB7XG4gICAgdGhpcy5faGVhZGVycy5sZW5ndGggPSAwXG4gICAgZm9yKGxldCBoZWFkZXIgb2YgaGVhZGVycykge1xuICAgICAgdGhpcy5feGhyLnNldFJlcXVlc3RIZWFkZXIoe2hlYWRlcn1bMF0sIHtoZWFkZXJ9WzFdKVxuICAgICAgdGhpcy5faGVhZGVycy5wdXNoKGhlYWRlcilcbiAgICB9XG4gIH1cbiAgZ2V0IF9kYXRhKCkgeyByZXR1cm4gdGhpcy5kYXRhIH1cbiAgc2V0IF9kYXRhKGRhdGEpIHsgdGhpcy5kYXRhID0gZGF0YSB9XG4gIGdldCBfeGhyKCkge1xuICAgIHRoaXMueGhyID0gKHRoaXMueGhyKVxuICAgICAgPyB0aGlzLnhoclxuICAgICAgOiBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHJldHVybiB0aGlzLnhoclxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICByZXF1ZXN0KGRhdGEpIHtcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLmRhdGEgfHwgbnVsbFxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZih0aGlzLl94aHIuc3RhdHVzID09PSAyMDApIHRoaXMuX3hoci5hYm9ydCgpXG4gICAgICB0aGlzLl94aHIub3Blbih0aGlzLnR5cGUsIHRoaXMudXJsKVxuICAgICAgdGhpcy5faGVhZGVycyA9IHRoaXMuc2V0dGluZ3MuaGVhZGVycyB8fCBbdGhpcy5fZGVmYXVsdHMuY29udGVudFR5cGVdXG4gICAgICB0aGlzLl94aHIub25sb2FkID0gcmVzb2x2ZVxuICAgICAgdGhpcy5feGhyLm9uZXJyb3IgPSByZWplY3RcbiAgICAgIHRoaXMuX3hoci5zZW5kKGRhdGEpXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgneGhyOnJlc29sdmUnLCB7XG4gICAgICAgIG5hbWU6ICd4aHI6cmVzb2x2ZScsXG4gICAgICAgIGRhdGE6IHJlc3BvbnNlLmN1cnJlbnRUYXJnZXQsXG4gICAgICB9KVxuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgIXRoaXMuZW5hYmxlZCAmJlxuICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgaWYoc2V0dGluZ3MudHlwZSkgdGhpcy5fdHlwZSA9IHNldHRpbmdzLnR5cGVcbiAgICAgIGlmKHNldHRpbmdzLnVybCkgdGhpcy5fdXJsID0gc2V0dGluZ3MudXJsXG4gICAgICBpZihzZXR0aW5ncy5kYXRhKSB0aGlzLl9kYXRhID0gc2V0dGluZ3MuZGF0YSB8fCBudWxsXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnJlc3BvbnNlVHlwZSkgdGhpcy5fcmVzcG9uc2VUeXBlID0gdGhpcy5fc2V0dGluZ3MucmVzcG9uc2VUeXBlXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHRoaXMuZW5hYmxlZCAmJlxuICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgZGVsZXRlIHRoaXMuX3R5cGVcbiAgICAgIGRlbGV0ZSB0aGlzLl91cmxcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhXG4gICAgICBkZWxldGUgdGhpcy5faGVhZGVyc1xuICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlVHlwZVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICB9XG59XG4iLCJNVkMuTW9kZWwgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfaXNTZXR0aW5nKCkgeyByZXR1cm4gdGhpcy5pc1NldHRpbmcgfVxuICBzZXQgX2lzU2V0dGluZyhpc1NldHRpbmcpIHsgdGhpcy5pc1NldHRpbmcgPSBpc1NldHRpbmcgfVxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5fZGVmYXVsdHMgfVxuICBzZXQgX2RlZmF1bHRzKGRlZmF1bHRzKSB7XG4gICAgdGhpcy5kZWZhdWx0cyA9IGRlZmF1bHRzXG4gICAgdGhpcy5zZXQodGhpcy5kZWZhdWx0cylcbiAgfVxuICBnZXQgX3NjaGVtYSgpIHsgcmV0dXJuIHRoaXMuX3NjaGVtYSB9XG4gIHNldCBfc2NoZW1hKHNjaGVtYSkgeyB0aGlzLnNjaGVtYSA9IHNjaGVtYSB9XG4gIGdldCBfaGlzdGlvZ3JhbSgpIHsgcmV0dXJuIHRoaXMuaGlzdGlvZ3JhbSB8fCB7XG4gICAgbGVuZ3RoOiAxXG4gIH0gfVxuICBzZXQgX2hpc3Rpb2dyYW0oaGlzdGlvZ3JhbSkge1xuICAgIHRoaXMuaGlzdGlvZ3JhbSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB0aGlzLl9oaXN0aW9ncmFtLFxuICAgICAgaGlzdGlvZ3JhbVxuICAgIClcbiAgfVxuICBnZXQgX2hpc3RvcnkoKSB7XG4gICAgdGhpcy5oaXN0b3J5ID0gKHRoaXMuaGlzdG9yeSlcbiAgICAgID8gdGhpcy5oaXN0b3J5XG4gICAgICA6IFtdXG4gICAgcmV0dXJuIHRoaXMuaGlzdG9yeVxuICB9XG4gIHNldCBfaGlzdG9yeShkYXRhKSB7XG4gICAgaWYoXG4gICAgICBPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGlmKHRoaXMuX2hpc3Rpb2dyYW0ubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudW5zaGlmdCh0aGlzLnBhcnNlKGRhdGEpKVxuICAgICAgICB0aGlzLl9oaXN0b3J5LnNwbGljZSh0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aClcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IF9kYXRhKCkge1xuICAgIHRoaXMuZGF0YSA9ICAodGhpcy5kYXRhKVxuICAgICAgPyB0aGlzLmRhdGFcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5kYXRhXG4gIH1cbiAgZ2V0IF9kYXRhRXZlbnRzKCkge1xuICAgIHRoaXMuZGF0YUV2ZW50cyA9ICh0aGlzLmRhdGFFdmVudHMpXG4gICAgICA/IHRoaXMuZGF0YUV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmRhdGFFdmVudHNcbiAgfVxuICBzZXQgX2RhdGFFdmVudHMoZGF0YUV2ZW50cykge1xuICAgIHRoaXMuZGF0YUV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBkYXRhRXZlbnRzLCB0aGlzLl9kYXRhRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfZGF0YUNhbGxiYWNrcygpIHtcbiAgICB0aGlzLmRhdGFDYWxsYmFja3MgPSAodGhpcy5kYXRhQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLmRhdGFDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5kYXRhQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9kYXRhQ2FsbGJhY2tzKGRhdGFDYWxsYmFja3MpIHtcbiAgICB0aGlzLmRhdGFDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgZGF0YUNhbGxiYWNrcywgdGhpcy5fZGF0YUNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX3NlcnZpY2VzKCkge1xuICAgIHRoaXMuc2VydmljZXMgPSAgKHRoaXMuc2VydmljZXMpXG4gICAgICA/IHRoaXMuc2VydmljZXNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5zZXJ2aWNlc1xuICB9XG4gIHNldCBfc2VydmljZXMoc2VydmljZXMpIHtcbiAgICB0aGlzLnNlcnZpY2VzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHNlcnZpY2VzLCB0aGlzLl9zZXJ2aWNlc1xuICAgIClcbiAgfVxuICBnZXQgX3NlcnZpY2VFdmVudHMoKSB7XG4gICAgdGhpcy5zZXJ2aWNlRXZlbnRzID0gKHRoaXMuc2VydmljZUV2ZW50cylcbiAgICAgID8gdGhpcy5zZXJ2aWNlRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZUV2ZW50c1xuICB9XG4gIHNldCBfc2VydmljZUV2ZW50cyhzZXJ2aWNlRXZlbnRzKSB7XG4gICAgdGhpcy5zZXJ2aWNlRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHNlcnZpY2VFdmVudHMsIHRoaXMuX3NlcnZpY2VFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9zZXJ2aWNlQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuc2VydmljZUNhbGxiYWNrcyA9ICh0aGlzLnNlcnZpY2VDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnNlcnZpY2VDYWxsYmFja3NcbiAgfVxuICBzZXQgX3NlcnZpY2VDYWxsYmFja3Moc2VydmljZUNhbGxiYWNrcykge1xuICAgIHRoaXMuc2VydmljZUNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBzZXJ2aWNlQ2FsbGJhY2tzLCB0aGlzLl9zZXJ2aWNlQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICBlbmFibGVTZXJ2aWNlRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuc2VydmljZUV2ZW50cywgdGhpcy5zZXJ2aWNlcywgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVTZXJ2aWNlRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5zZXJ2aWNlRXZlbnRzLCB0aGlzLnNlcnZpY2VzLCB0aGlzLnNlcnZpY2VDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlRGF0YUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmRhdGFFdmVudHMsIHRoaXMsIHRoaXMuZGF0YUNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlRGF0YUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuZGF0YUV2ZW50cywgdGhpcywgdGhpcy5kYXRhQ2FsbGJhY2tzKVxuICB9XG4gIGdldCgpIHtcbiAgICBsZXQgcHJvcGVydHkgPSBhcmd1bWVudHNbMF1cbiAgICByZXR1cm4gdGhpcy5fZGF0YVsnXycuY29uY2F0KHByb3BlcnR5KV1cbiAgfVxuICBzZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBpZihpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5faXNTZXR0aW5nID0gdHJ1ZVxuICAgICAgICAgIH0gZWxzZSBpZihpbmRleCA9PT0gKF9hcmd1bWVudHMubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2lzU2V0dGluZyA9IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDM6XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHZhciBzaWxlbnQgPSBhcmd1bWVudHNbMl1cbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICB1bnNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5fZGF0YSkpIHtcbiAgICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBzZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KSB7XG4gICAgaWYoIXRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXSkge1xuICAgICAgbGV0IGNvbnRleHQgPSB0aGlzXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhcbiAgICAgICAgdGhpcy5fZGF0YSxcbiAgICAgICAge1xuICAgICAgICAgIFsnXycuY29uY2F0KGtleSldOiB7XG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzW2tleV0gfSxcbiAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICAhc2lsZW50ICYmXG4gICAgICAgICAgICAgICAgIWNvbnRleHQuX2lzU2V0dGluZ1xuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBsZXQgc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3NldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgICAgICAgICAgICAgIGxldCBzZXRFdmVudE5hbWUgPSAnc2V0J1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICAgIHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBzZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gICAgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldID0gdmFsdWVcbiAgfVxuICB1bnNldERhdGFQcm9wZXJ0eShrZXkpIHtcbiAgICBsZXQgdW5zZXRWYWx1ZUV2ZW50TmFtZSA9IFsndW5zZXQnLCAnOicsIGtleV0uam9pbignJylcbiAgICBsZXQgdW5zZXRFdmVudE5hbWUgPSAndW5zZXQnXG4gICAgbGV0IHVuc2V0VmFsdWUgPSB0aGlzLl9kYXRhW2tleV1cbiAgICBkZWxldGUgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldXG4gICAgZGVsZXRlIHRoaXMuX2RhdGFba2V5XVxuICAgIHRoaXMuZW1pdChcbiAgICAgIHVuc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IHVuc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIClcbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldEV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIClcbiAgfVxuICBwYXJzZShkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5fZGF0YVxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KE9iamVjdC5hc3NpZ24oe30sIGRhdGEpKSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuaGlzdGlvZ3JhbSkgdGhpcy5faGlzdGlvZ3JhbSA9IHRoaXMuc2V0dGluZ3MuaGlzdGlvZ3JhbVxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5lbWl0dGVycykgdGhpcy5fZW1pdHRlcnMgPSB0aGlzLnNldHRpbmdzLmVtaXR0ZXJzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnNlcnZpY2VzKSB0aGlzLl9zZXJ2aWNlcyA9IHRoaXMuc2V0dGluZ3Muc2VydmljZXNcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3Muc2VydmljZUNhbGxiYWNrcykgdGhpcy5fc2VydmljZUNhbGxiYWNrcyA9IHRoaXMuc2V0dGluZ3Muc2VydmljZUNhbGxiYWNrc1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5zZXJ2aWNlRXZlbnRzKSB0aGlzLl9zZXJ2aWNlRXZlbnRzID0gdGhpcy5zZXR0aW5ncy5zZXJ2aWNlRXZlbnRzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRhdGEpIHRoaXMuc2V0KHRoaXMuc2V0dGluZ3MuZGF0YSlcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGF0YUNhbGxiYWNrcykgdGhpcy5fZGF0YUNhbGxiYWNrcyA9IHRoaXMuc2V0dGluZ3MuZGF0YUNhbGxiYWNrc1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5kYXRhRXZlbnRzKSB0aGlzLl9kYXRhRXZlbnRzID0gdGhpcy5zZXR0aW5ncy5kYXRhRXZlbnRzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnNjaGVtYSkgdGhpcy5fc2NoZW1hID0gdGhpcy5zZXR0aW5ncy5zY2hlbWFcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMpIHRoaXMuX2RlZmF1bHRzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0c1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMuc2VydmljZXMgJiZcbiAgICAgICAgdGhpcy5zZXJ2aWNlRXZlbnRzICYmXG4gICAgICAgIHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlU2VydmljZUV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5kYXRhRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZGF0YUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlRGF0YUV2ZW50cygpXG4gICAgICB9XG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5zZXJ2aWNlcyAmJlxuICAgICAgICB0aGlzLnNlcnZpY2VFdmVudHMgJiZcbiAgICAgICAgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlU2VydmljZUV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5kYXRhRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZGF0YUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZURhdGFFdmVudHMoKVxuICAgICAgfVxuICAgICAgZGVsZXRlIHRoaXMuX2hpc3Rpb2dyYW1cbiAgICAgIGRlbGV0ZSB0aGlzLl9zZXJ2aWNlc1xuICAgICAgZGVsZXRlIHRoaXMuX3NlcnZpY2VDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9zZXJ2aWNlRXZlbnRzXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YVxuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhRXZlbnRzXG4gICAgICBkZWxldGUgdGhpcy5fc2NoZW1hXG4gICAgICBkZWxldGUgdGhpcy5fZW1pdHRlcnNcbiAgICB9XG4gIH1cbn1cbiIsIk1WQy5FbWl0dGVyID0gY2xhc3MgZXh0ZW5kcyBNVkMuTW9kZWwge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxyXG4gICAgaWYodGhpcy5zZXR0aW5ncykge1xyXG4gICAgICBpZih0aGlzLnNldHRpbmdzLm5hbWUpIHRoaXMuX25hbWUgPSB0aGlzLnNldHRpbmdzLm5hbWVcclxuICAgIH1cclxuICB9XHJcbiAgZ2V0IF9uYW1lKCkgeyByZXR1cm4gdGhpcy5uYW1lIH1cclxuICBzZXQgX25hbWUobmFtZSkgeyB0aGlzLm5hbWUgPSBuYW1lIH1cclxuICBlbWlzc2lvbigpIHtcclxuICAgIGxldCBldmVudERhdGEgPSB7XHJcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcclxuICAgICAgZGF0YTogdGhpcy5wYXJzZSgpXHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgIHRoaXMubmFtZSxcclxuICAgICAgZXZlbnREYXRhXHJcbiAgICApXHJcbiAgICByZXR1cm4gZXZlbnREYXRhXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5WaWV3ID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgX2VsZW1lbnROYW1lKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudC50YWdOYW1lIH1cbiAgc2V0IF9lbGVtZW50TmFtZShlbGVtZW50TmFtZSkge1xuICAgIGlmKCF0aGlzLl9lbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50TmFtZSlcbiAgfVxuICBnZXQgX2VsZW1lbnQoKSB7IHJldHVybiB0aGlzLmVsZW1lbnQgfVxuICBzZXQgX2VsZW1lbnQoZWxlbWVudCkge1xuICAgIGlmKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxuICAgIH0gZWxzZSBpZih0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudClcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50T2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmVsZW1lbnQsIHtcbiAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgfSlcbiAgfVxuICBnZXQgX2F0dHJpYnV0ZXMoKSB7IHJldHVybiB0aGlzLl9lbGVtZW50LmF0dHJpYnV0ZXMgfVxuICBzZXQgX2F0dHJpYnV0ZXMoYXR0cmlidXRlcykge1xuICAgIGZvcihsZXQgW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpKSB7XG4gICAgICBpZih0eXBlb2YgYXR0cmlidXRlVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZUtleSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfdWkoKSB7XG4gICAgdGhpcy51aSA9ICh0aGlzLnVpKVxuICAgICAgPyB0aGlzLnVpXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudWlcbiAgfVxuICBzZXQgX3VpKHVpKSB7XG4gICAgaWYoIXRoaXMuX3VpWyckZWxlbWVudCddKSB0aGlzLl91aVsnJGVsZW1lbnQnXSA9IHRoaXMuZWxlbWVudFxuICAgIGZvcihsZXQgW3VpS2V5LCB1aVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh1aSkpIHtcbiAgICAgIGlmKHVpVmFsdWUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICB0aGlzLl91aVt1aUtleV0gPSB1aVZhbHVlXG4gICAgICB9IGVsc2UgaWYodHlwZW9mIHVpVmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuX3VpW3VpS2V5XSA9IHRoaXMuX2VsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh1aVZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgX3VpRXZlbnRzKCkgeyByZXR1cm4gdGhpcy51aUV2ZW50cyB9XG4gIHNldCBfdWlFdmVudHModWlFdmVudHMpIHsgdGhpcy51aUV2ZW50cyA9IHVpRXZlbnRzIH1cbiAgZ2V0IF91aUNhbGxiYWNrcygpIHtcbiAgICB0aGlzLnVpQ2FsbGJhY2tzID0gKHRoaXMudWlDYWxsYmFja3MpXG4gICAgICA/IHRoaXMudWlDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy51aUNhbGxiYWNrc1xuICB9XG4gIHNldCBfdWlDYWxsYmFja3ModWlDYWxsYmFja3MpIHtcbiAgICB0aGlzLnVpQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHVpQ2FsbGJhY2tzLCB0aGlzLl91aUNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX29ic2VydmVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3MgPSAodGhpcy5vYnNlcnZlckNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5vYnNlcnZlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9vYnNlcnZlckNhbGxiYWNrcyhvYnNlcnZlckNhbGxiYWNrcykge1xuICAgIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgb2JzZXJ2ZXJDYWxsYmFja3MsIHRoaXMuX29ic2VydmVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBlbGVtZW50T2JzZXJ2ZXIoKSB7XG4gICAgdGhpcy5fZWxlbWVudE9ic2VydmVyID0gKHRoaXMuX2VsZW1lbnRPYnNlcnZlcilcbiAgICAgID8gdGhpcy5fZWxlbWVudE9ic2VydmVyXG4gICAgICA6IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuZWxlbWVudE9ic2VydmUuYmluZCh0aGlzKSlcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudE9ic2VydmVyXG4gIH1cbiAgZ2V0IF9pbnNlcnQoKSB7IHJldHVybiB0aGlzLmluc2VydCB9XG4gIHNldCBfaW5zZXJ0KGluc2VydCkgeyB0aGlzLmluc2VydCA9IGluc2VydCB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICBnZXQgX3RlbXBsYXRlcygpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9ICh0aGlzLnRlbXBsYXRlcylcbiAgICAgID8gdGhpcy50ZW1wbGF0ZXNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZXNcbiAgfVxuICBzZXQgX3RlbXBsYXRlcyh0ZW1wbGF0ZXMpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB0ZW1wbGF0ZXMsIHRoaXMuX3RlbXBsYXRlc1xuICAgIClcbiAgfVxuICBlbGVtZW50T2JzZXJ2ZShtdXRhdGlvblJlY29yZExpc3QsIG9ic2VydmVyKSB7XG4gICAgZm9yKGxldCBbbXV0YXRpb25SZWNvcmRJbmRleCwgbXV0YXRpb25SZWNvcmRdIG9mIE9iamVjdC5lbnRyaWVzKG11dGF0aW9uUmVjb3JkTGlzdCkpIHtcbiAgICAgIHN3aXRjaChtdXRhdGlvblJlY29yZC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2NoaWxkTGlzdCc6XG4gICAgICAgICAgbGV0IG11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcyA9IFsnYWRkZWROb2RlcycsICdyZW1vdmVkTm9kZXMnXVxuICAgICAgICAgIGZvcihsZXQgbXV0YXRpb25SZWNvcmRDYXRlZ29yeSBvZiBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMpIHtcbiAgICAgICAgICAgIGlmKG11dGF0aW9uUmVjb3JkW211dGF0aW9uUmVjb3JkQ2F0ZWdvcnldLmxlbmd0aCkge1xuICAgICAgICAgICAgICB0aGlzLnJlc2V0VUkoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBhdXRvSW5zZXJ0KCkge1xuICAgIGlmKHRoaXMuaW5zZXJ0KSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuaW5zZXJ0LmVsZW1lbnQpXG4gICAgICAuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICBlbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCh0aGlzLmluc2VydC5tZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIGF1dG9SZW1vdmUoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLmVsZW1lbnQgJiZcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50XG4gICAgKSB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpXG4gIH1cbiAgZW5hYmxlRWxlbWVudChzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKHNldHRpbmdzLmVsZW1lbnROYW1lKSB0aGlzLl9lbGVtZW50TmFtZSA9IHNldHRpbmdzLmVsZW1lbnROYW1lXG4gICAgaWYoc2V0dGluZ3MuZWxlbWVudCkgdGhpcy5fZWxlbWVudCA9IHNldHRpbmdzLmVsZW1lbnRcbiAgICBpZihzZXR0aW5ncy5hdHRyaWJ1dGVzKSB0aGlzLl9hdHRyaWJ1dGVzID0gc2V0dGluZ3MuYXR0cmlidXRlc1xuICAgIGlmKHNldHRpbmdzLnRlbXBsYXRlcykgdGhpcy5fdGVtcGxhdGVzID0gc2V0dGluZ3MudGVtcGxhdGVzXG4gICAgaWYoc2V0dGluZ3MuaW5zZXJ0KSB0aGlzLl9pbnNlcnQgPSBzZXR0aW5ncy5pbnNlcnRcbiAgfVxuICBkaXNhYmxlRWxlbWVudChzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgdGhpcy5lbGVtZW50ICYmXG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICkgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIGlmKHRoaXMuZWxlbWVudCkgZGVsZXRlIHRoaXMuZWxlbWVudFxuICAgIGlmKHRoaXMuYXR0cmlidXRlcykgZGVsZXRlIHRoaXMuYXR0cmlidXRlc1xuICAgIGlmKHRoaXMudGVtcGxhdGVzKSBkZWxldGUgdGhpcy50ZW1wbGF0ZXNcbiAgICBpZih0aGlzLmluc2VydCkgZGVsZXRlIHRoaXMuaW5zZXJ0XG4gIH1cbiAgcmVzZXRVSSgpIHtcbiAgICB0aGlzLmRpc2FibGVVSSgpXG4gICAgdGhpcy5lbmFibGVVSSgpXG4gIH1cbiAgZW5hYmxlVUkoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihzZXR0aW5ncy51aSkgdGhpcy5fdWkgPSBzZXR0aW5ncy51aVxuICAgIGlmKHNldHRpbmdzLnVpQ2FsbGJhY2tzKSB0aGlzLl91aUNhbGxiYWNrcyA9IHNldHRpbmdzLnVpQ2FsbGJhY2tzXG4gICAgaWYoc2V0dGluZ3MudWlFdmVudHMpIHtcbiAgICAgIHRoaXMuX3VpRXZlbnRzID0gc2V0dGluZ3MudWlFdmVudHNcbiAgICAgIHRoaXMuZW5hYmxlVUlFdmVudHMoKVxuICAgIH1cbiAgfVxuICBkaXNhYmxlVUkoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihzZXR0aW5ncy51aUV2ZW50cykge1xuICAgICAgdGhpcy5kaXNhYmxlVUlFdmVudHMoKVxuICAgICAgZGVsZXRlIHRoaXMuX3VpRXZlbnRzXG4gICAgfVxuICAgIGRlbGV0ZSB0aGlzLnVpRXZlbnRzXG4gICAgZGVsZXRlIHRoaXMudWlcbiAgICBkZWxldGUgdGhpcy51aUNhbGxiYWNrc1xuICB9XG4gIGVuYWJsZVVJRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy51aUV2ZW50cyAmJlxuICAgICAgdGhpcy51aSAmJlxuICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMoXG4gICAgICAgIHRoaXMudWlFdmVudHMsXG4gICAgICAgIHRoaXMudWksXG4gICAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgZGlzYWJsZVVJRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy51aUV2ZW50cyAmJlxuICAgICAgdGhpcy51aSAmJlxuICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKFxuICAgICAgICB0aGlzLnVpRXZlbnRzLFxuICAgICAgICB0aGlzLnVpLFxuICAgICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgICApXG4gICAgfVxuICB9XG4gIGVuYWJsZUVtaXR0ZXJzKCkge1xuICAgIGlmKHRoaXMuc2V0dGluZ3MuZW1pdHRlcnMpIHRoaXMuX2VtaXR0ZXJzID0gdGhpcy5zZXR0aW5ncy5lbWl0dGVyc1xuICB9XG4gIGRpc2FibGVFbWl0dGVycygpIHtcbiAgICBpZih0aGlzLl9lbWl0dGVycykgZGVsZXRlIHRoaXMuX2VtaXR0ZXJzXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5fZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5lbmFibGVFbWl0dGVycygpXG4gICAgICB0aGlzLmVuYWJsZUVsZW1lbnQoc2V0dGluZ3MpXG4gICAgICB0aGlzLmVuYWJsZVVJKHNldHRpbmdzKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgIHRoaXMuX2VuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZGlzYWJsZVVJKHNldHRpbmdzKVxuICAgICAgdGhpcy5kaXNhYmxlRWxlbWVudChzZXR0aW5ncylcbiAgICAgIHRoaXMuZGlzYWJsZUVtaXR0ZXJzKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgICAgcmV0dXJuIHRoaXNzXG4gICAgfVxuICB9XG59XG4iLCJNVkMuQ29udHJvbGxlciA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IF9lbWl0dGVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuZW1pdHRlckNhbGxiYWNrcyA9ICh0aGlzLmVtaXR0ZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuZW1pdHRlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX2VtaXR0ZXJDYWxsYmFja3MoZW1pdHRlckNhbGxiYWNrcykge1xuICAgIHRoaXMuZW1pdHRlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBlbWl0dGVyQ2FsbGJhY2tzLCB0aGlzLl9lbWl0dGVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfbW9kZWxDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5tb2RlbENhbGxiYWNrcyA9ICh0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgfVxuICBzZXQgX21vZGVsQ2FsbGJhY2tzKG1vZGVsQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5tb2RlbENhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBtb2RlbENhbGxiYWNrcywgdGhpcy5fbW9kZWxDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF92aWV3Q2FsbGJhY2tzKCkge1xuICAgIHRoaXMudmlld0NhbGxiYWNrcyA9ICh0aGlzLnZpZXdDYWxsYmFja3MpXG4gICAgICA/IHRoaXMudmlld0NhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnZpZXdDYWxsYmFja3NcbiAgfVxuICBzZXQgX3ZpZXdDYWxsYmFja3Modmlld0NhbGxiYWNrcykge1xuICAgIHRoaXMudmlld0NhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB2aWV3Q2FsbGJhY2tzLCB0aGlzLl92aWV3Q2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlckNhbGxiYWNrcygpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MgPSAodGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9jb250cm9sbGVyQ2FsbGJhY2tzKGNvbnRyb2xsZXJDYWxsYmFja3MpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlckNhbGxiYWNrcywgdGhpcy5fY29udHJvbGxlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX3JvdXRlckNhbGxiYWNrcygpIHtcbiAgICB0aGlzLnJvdXRlckNhbGxiYWNrcyA9ICh0aGlzLnJvdXRlckNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX3JvdXRlckNhbGxiYWNrcyhyb3V0ZXJDYWxsYmFja3MpIHtcbiAgICB0aGlzLnJvdXRlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXJDYWxsYmFja3MsIHRoaXMuX3JvdXRlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVscygpIHtcbiAgICB0aGlzLm1vZGVscyA9ICh0aGlzLm1vZGVscylcbiAgICAgID8gdGhpcy5tb2RlbHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5tb2RlbHNcbiAgfVxuICBzZXQgX21vZGVscyhtb2RlbHMpIHtcbiAgICB0aGlzLm1vZGVscyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBtb2RlbHMsIHRoaXMuX21vZGVsc1xuICAgIClcbiAgfVxuICBnZXQgX3ZpZXdzKCkge1xuICAgIHRoaXMudmlld3MgPSAodGhpcy52aWV3cylcbiAgICAgID8gdGhpcy52aWV3c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnZpZXdzXG4gIH1cbiAgc2V0IF92aWV3cyh2aWV3cykge1xuICAgIHRoaXMudmlld3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld3MsIHRoaXMuX3ZpZXdzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlcnMoKSB7XG4gICAgdGhpcy5jb250cm9sbGVycyA9ICh0aGlzLmNvbnRyb2xsZXJzKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlcnNcbiAgfVxuICBzZXQgX2NvbnRyb2xsZXJzKGNvbnRyb2xsZXJzKSB7XG4gICAgdGhpcy5jb250cm9sbGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBjb250cm9sbGVycywgdGhpcy5fY29udHJvbGxlcnNcbiAgICApXG4gIH1cbiAgZ2V0IF9yb3V0ZXJzKCkge1xuICAgIHRoaXMucm91dGVycyA9ICh0aGlzLnJvdXRlcnMpXG4gICAgICA/IHRoaXMucm91dGVyc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlcnNcbiAgfVxuICBzZXQgX3JvdXRlcnMocm91dGVycykge1xuICAgIHRoaXMucm91dGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXJzLCB0aGlzLl9yb3V0ZXJzXG4gICAgKVxuICB9XG4gIGdldCBfZW1pdHRlckV2ZW50cygpIHtcbiAgICB0aGlzLmVtaXR0ZXJFdmVudHMgPSAodGhpcy5lbWl0dGVyRXZlbnRzKVxuICAgICAgPyB0aGlzLmVtaXR0ZXJFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyRXZlbnRzXG4gIH1cbiAgc2V0IF9lbWl0dGVyRXZlbnRzKGVtaXR0ZXJFdmVudHMpIHtcbiAgICB0aGlzLmVtaXR0ZXJFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgZW1pdHRlckV2ZW50cywgdGhpcy5fZW1pdHRlckV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVsRXZlbnRzKCkge1xuICAgIHRoaXMubW9kZWxFdmVudHMgPSAodGhpcy5tb2RlbEV2ZW50cylcbiAgICAgID8gdGhpcy5tb2RlbEV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm1vZGVsRXZlbnRzXG4gIH1cbiAgc2V0IF9tb2RlbEV2ZW50cyhtb2RlbEV2ZW50cykge1xuICAgIHRoaXMubW9kZWxFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgbW9kZWxFdmVudHMsIHRoaXMuX21vZGVsRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfdmlld0V2ZW50cygpIHtcbiAgICB0aGlzLnZpZXdFdmVudHMgPSAodGhpcy52aWV3RXZlbnRzKVxuICAgICAgPyB0aGlzLnZpZXdFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy52aWV3RXZlbnRzXG4gIH1cbiAgc2V0IF92aWV3RXZlbnRzKHZpZXdFdmVudHMpIHtcbiAgICB0aGlzLnZpZXdFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld0V2ZW50cywgdGhpcy5fdmlld0V2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgdGhpcy5jb250cm9sbGVyRXZlbnRzID0gKHRoaXMuY29udHJvbGxlckV2ZW50cylcbiAgICAgID8gdGhpcy5jb250cm9sbGVyRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlckV2ZW50c1xuICB9XG4gIHNldCBfY29udHJvbGxlckV2ZW50cyhjb250cm9sbGVyRXZlbnRzKSB7XG4gICAgdGhpcy5jb250cm9sbGVyRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGNvbnRyb2xsZXJFdmVudHMsIHRoaXMuX2NvbnRyb2xsZXJFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGVuYWJsZU1vZGVsRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMubW9kZWxFdmVudHMsIHRoaXMubW9kZWxzLCB0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVNb2RlbEV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMubW9kZWxFdmVudHMsIHRoaXMubW9kZWxzLCB0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZVZpZXdFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy52aWV3RXZlbnRzLCB0aGlzLnZpZXdzLCB0aGlzLnZpZXdDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZVZpZXdFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnZpZXdFdmVudHMsIHRoaXMudmlld3MsIHRoaXMudmlld0NhbGxiYWNrcylcbiAgfVxuICBlbmFibGVDb250cm9sbGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuY29udHJvbGxlckV2ZW50cywgdGhpcy5jb250cm9sbGVycywgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVDb250cm9sbGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5jb250cm9sbGVyRXZlbnRzLCB0aGlzLmNvbnRyb2xsZXJzLCB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlRW1pdHRlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmVtaXR0ZXJFdmVudHMsIHRoaXMuZW1pdHRlcnMsIHRoaXMuZW1pdHRlckNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlRW1pdHRlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuZW1pdHRlckV2ZW50cywgdGhpcy5lbWl0dGVycywgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgaWYoc2V0dGluZ3MuZW1pdHRlckNhbGxiYWNrcykgdGhpcy5fZW1pdHRlckNhbGxiYWNrcyA9IHNldHRpbmdzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLm1vZGVsQ2FsbGJhY2tzKSB0aGlzLl9tb2RlbENhbGxiYWNrcyA9IHNldHRpbmdzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy52aWV3Q2FsbGJhY2tzKSB0aGlzLl92aWV3Q2FsbGJhY2tzID0gc2V0dGluZ3Mudmlld0NhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3MuY29udHJvbGxlckNhbGxiYWNrcykgdGhpcy5fY29udHJvbGxlckNhbGxiYWNrcyA9IHNldHRpbmdzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLnJvdXRlckNhbGxiYWNrcykgdGhpcy5fcm91dGVyQ2FsbGJhY2tzID0gc2V0dGluZ3Mucm91dGVyQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5lbWl0dGVycykgdGhpcy5fZW1pdHRlcnMgPSBzZXR0aW5ncy5lbWl0dGVyc1xuICAgICAgaWYoc2V0dGluZ3MubW9kZWxzKSB0aGlzLl9tb2RlbHMgPSBzZXR0aW5ncy5tb2RlbHNcbiAgICAgIGlmKHNldHRpbmdzLnZpZXdzKSB0aGlzLl92aWV3cyA9IHNldHRpbmdzLnZpZXdzXG4gICAgICBpZihzZXR0aW5ncy5jb250cm9sbGVycykgdGhpcy5fY29udHJvbGxlcnMgPSBzZXR0aW5ncy5jb250cm9sbGVyc1xuICAgICAgaWYoc2V0dGluZ3Mucm91dGVycykgdGhpcy5fcm91dGVycyA9IHNldHRpbmdzLnJvdXRlcnNcbiAgICAgIGlmKHNldHRpbmdzLmVtaXR0ZXJFdmVudHMpIHRoaXMuX2VtaXR0ZXJFdmVudHMgPSBzZXR0aW5ncy5lbWl0dGVyRXZlbnRzXG4gICAgICBpZihzZXR0aW5ncy5tb2RlbEV2ZW50cykgdGhpcy5fbW9kZWxFdmVudHMgPSBzZXR0aW5ncy5tb2RlbEV2ZW50c1xuICAgICAgaWYoc2V0dGluZ3Mudmlld0V2ZW50cykgdGhpcy5fdmlld0V2ZW50cyA9IHNldHRpbmdzLnZpZXdFdmVudHNcbiAgICAgIGlmKHNldHRpbmdzLmNvbnRyb2xsZXJFdmVudHMpIHRoaXMuX2NvbnRyb2xsZXJFdmVudHMgPSBzZXR0aW5ncy5jb250cm9sbGVyRXZlbnRzXG4gICAgICBpZihcbiAgICAgICAgdGhpcy5lbWl0dGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZW1pdHRlcnMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5lbmFibGVFbWl0dGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLm1vZGVsRXZlbnRzICYmXG4gICAgICAgIHRoaXMubW9kZWxzICYmXG4gICAgICAgIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZU1vZGVsRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnZpZXdFdmVudHMgJiZcbiAgICAgICAgdGhpcy52aWV3cyAmJlxuICAgICAgICB0aGlzLnZpZXdDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZVZpZXdFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuY29udHJvbGxlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlQ29udHJvbGxlckV2ZW50cygpXG4gICAgICB9XG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICB0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmVtaXR0ZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVycyAmJlxuICAgICAgICB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVFbWl0dGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLm1vZGVsRXZlbnRzICYmXG4gICAgICAgIHRoaXMubW9kZWxzICYmXG4gICAgICAgIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVNb2RlbEV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy52aWV3RXZlbnRzICYmXG4gICAgICAgIHRoaXMudmlld3MgJiZcbiAgICAgICAgdGhpcy52aWV3Q2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlVmlld0V2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5jb250cm9sbGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlQ29udHJvbGxlckV2ZW50cygpXG4gICAgICB9XG4gICAgICBkZWxldGUgdGhpcy5fZW1pdHRlcnNcbiAgICAgIGRlbGV0ZSB0aGlzLl9tb2RlbENhbGxiYWNrc1xuICAgICAgZGVsZXRlIHRoaXMuX3ZpZXdDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICBkZWxldGUgdGhpcy5fcm91dGVyQ2FsbGJhY2tzXG4gICAgICBkZWxldGUgdGhpcy5fbW9kZWxzXG4gICAgICBkZWxldGUgdGhpcy5fdmlld3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyc1xuICAgICAgZGVsZXRlIHRoaXMuX3JvdXRlcnNcbiAgICAgIGRlbGV0ZSB0aGlzLl9tb2RlbEV2ZW50c1xuICAgICAgZGVsZXRlIHRoaXMuX3ZpZXdFdmVudHNcbiAgICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyRXZlbnRzXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gIH1cbn1cbiIsIk1WQy5Sb3V0ZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCByb3V0ZSgpIHtcbiAgICByZXR1cm4gU3RyaW5nKHdpbmRvdy5sb2NhdGlvbi5oYXNoKS5zcGxpdCgnIycpLnBvcCgpXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGdldCBfcm91dGVzKCkge1xuICAgIHRoaXMucm91dGVzID0gKHRoaXMucm91dGVzKVxuICAgICAgPyB0aGlzLnJvdXRlc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlc1xuICB9XG4gIHNldCBfcm91dGVzKHJvdXRlcykge1xuICAgIHRoaXMucm91dGVzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlcywgdGhpcy5fcm91dGVzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlcigpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSAodGhpcy5jb250cm9sbGVyKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyXG4gIH1cbiAgc2V0IF9jb250cm9sbGVyKGNvbnRyb2xsZXIpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlciwgdGhpcy5fY29udHJvbGxlclxuICAgIClcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZW5hYmxlUm91dGVzKHRoaXMucm91dGVzLCB0aGlzLmNvbnRyb2xsZXJzKVxuICAgICAgdGhpcy5lbmFibGVFdmVudHMoKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLmRpc2FibGVFdmVudHMoKVxuICAgICAgdGhpcy5kaXNhYmxlUm91dGVzKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgfVxuICBlbmFibGVSb3V0ZXMocm91dGVzLCBjb250cm9sbGVycykge1xuICAgIGlmKHNldHRpbmdzLmNvbnRyb2xsZXJzKSB0aGlzLl9jb250cm9sbGVycyA9IHNldHRpbmdzLmNvbnRyb2xsZXJzXG4gICAgdGhpcy5fcm91dGVzID0gc2V0dGluZ3Mucm91dGVzLm1hcCgocm91dGUpID0+IGNvbnRyb2xsZXJzW3JvdXRlc1tyb3V0ZV1dKVxuICAgIHJldHVyblxuICB9XG4gIGRpc2FibGVSb3V0ZXMoKSB7XG4gICAgZGVsZXRlIHRoaXMuX3JvdXRlc1xuICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyc1xuICB9XG4gIGVuYWJsZUV2ZW50cygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMuaGFzaENoYW5nZS5iaW5kKHRoaXMpKVxuICB9XG4gIGRpc2FibGVFdmVudHMoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLmhhc2hDaGFuZ2UuYmluZCh0aGlzKSlcbiAgfVxuICBoYXNoQ2hhbmdlKGV2ZW50KSB7XG4gICAgdmFyIHJvdXRlID0gdGhpcy5yb3V0ZVxuICAgIHRyeSB7XG4gICAgICB0aGlzLnJvdXRlc1tyb3V0ZV0oZXZlbnQpXG4gICAgICB0aGlzLmVtaXQoJ25hdmlnYXRlJywgdGhpcylcbiAgICB9IGNhdGNoKGVycm9yKSB7fVxuICB9XG4gIG5hdmlnYXRlKHBhdGgpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHBhdGhcbiAgfVxufVxuIl19
