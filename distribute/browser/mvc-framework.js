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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1WQy5qcyIsIkNvbnN0YW50cy5qcyIsIkV2ZW50cy5qcyIsIlRlbXBsYXRlcy5qcyIsIlV0aWxzLmpzIiwiaXMuanMiLCJ0eXBlT2YuanMiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QuanMiLCJvYmplY3RRdWVyeS5qcyIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMuanMiLCJ2YWxpZGF0ZURhdGFTY2hlbWEuanMiLCJDaGFubmVscy5qcyIsIkNoYW5uZWwuanMiLCJCYXNlLmpzIiwiU2VydmljZS5qcyIsIk1vZGVsLmpzIiwiRW1pdHRlci5qcyIsIlZpZXcuanMiLCJDb250cm9sbGVyLmpzIiwiUm91dGVyLmpzIl0sIm5hbWVzIjpbIk1WQyIsIkNvbnN0YW50cyIsIkNPTlNUIiwiRXZlbnRzIiwiRVYiLCJUZW1wbGF0ZXMiLCJPYmplY3RRdWVyeVN0cmluZ0Zvcm1hdEludmFsaWRSb290IiwiT2JqZWN0UXVlcnlTdHJpbmdGb3JtYXRJbnZhbGlkIiwiZGF0YSIsImpvaW4iLCJEYXRhU2NoZW1hTWlzbWF0Y2giLCJEYXRhRnVuY3Rpb25JbnZhbGlkIiwiRGF0YVVuZGVmaW5lZCIsIlNjaGVtYVVuZGVmaW5lZCIsIlRNUEwiLCJVdGlscyIsImlzQXJyYXkiLCJvYmplY3QiLCJBcnJheSIsImlzT2JqZWN0IiwiaXNFcXVhbFR5cGUiLCJ2YWx1ZUEiLCJ2YWx1ZUIiLCJpc0hUTUxFbGVtZW50IiwiSFRNTEVsZW1lbnQiLCJ0eXBlT2YiLCJfb2JqZWN0IiwiYWRkUHJvcGVydGllc1RvT2JqZWN0IiwidGFyZ2V0T2JqZWN0IiwiYXJndW1lbnRzIiwibGVuZ3RoIiwicHJvcGVydGllcyIsInByb3BlcnR5TmFtZSIsInByb3BlcnR5VmFsdWUiLCJPYmplY3QiLCJlbnRyaWVzIiwib2JqZWN0UXVlcnkiLCJzdHJpbmciLCJjb250ZXh0Iiwic3RyaW5nRGF0YSIsInBhcnNlTm90YXRpb24iLCJzcGxpY2UiLCJyZWR1Y2UiLCJmcmFnbWVudCIsImZyYWdtZW50SW5kZXgiLCJmcmFnbWVudHMiLCJwYXJzZUZyYWdtZW50IiwicHJvcGVydHlLZXkiLCJtYXRjaCIsImNvbmNhdCIsImNoYXJBdCIsInNsaWNlIiwic3BsaXQiLCJSZWdFeHAiLCJ0b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzIiwidG9nZ2xlTWV0aG9kIiwiZXZlbnRzIiwidGFyZ2V0T2JqZWN0cyIsImNhbGxiYWNrcyIsImV2ZW50U2V0dGluZ3MiLCJldmVudENhbGxiYWNrTmFtZSIsImV2ZW50RGF0YSIsImV2ZW50VGFyZ2V0U2V0dGluZ3MiLCJldmVudE5hbWUiLCJldmVudFRhcmdldHMiLCJldmVudFRhcmdldE5hbWUiLCJldmVudFRhcmdldCIsImV2ZW50TWV0aG9kTmFtZSIsIk5vZGVMaXN0IiwiRG9jdW1lbnQiLCJldmVudENhbGxiYWNrIiwiX2V2ZW50VGFyZ2V0IiwiYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyIsInVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzIiwidmFsaWRhdGVEYXRhU2NoZW1hIiwic2NoZW1hIiwiYXJyYXkiLCJjb25zb2xlIiwibG9nIiwibmFtZSIsImFycmF5S2V5IiwiYXJyYXlWYWx1ZSIsInB1c2giLCJvYmplY3RLZXkiLCJvYmplY3RWYWx1ZSIsImNvbnN0cnVjdG9yIiwiX2V2ZW50cyIsImV2ZW50Q2FsbGJhY2tzIiwiZXZlbnRDYWxsYmFja0dyb3VwIiwib24iLCJvZmYiLCJlbWl0IiwiZXZlbnRDYWxsYmFja0dyb3VwTmFtZSIsImFkZGl0aW9uYWxBcmd1bWVudHMiLCJ2YWx1ZXMiLCJDaGFubmVscyIsIl9jaGFubmVscyIsImNoYW5uZWxzIiwiY2hhbm5lbCIsImNoYW5uZWxOYW1lIiwiQ2hhbm5lbCIsIl9yZXNwb25zZXMiLCJyZXNwb25zZXMiLCJyZXNwb25zZSIsInJlc3BvbnNlTmFtZSIsInJlc3BvbnNlQ2FsbGJhY2siLCJyZXF1ZXN0IiwicmVxdWVzdERhdGEiLCJrZXlzIiwiQmFzZSIsInNldHRpbmdzIiwiY29uZmlndXJhdGlvbiIsIl9jb25maWd1cmF0aW9uIiwiX3NldHRpbmdzIiwiX2VtaXR0ZXJzIiwiZW1pdHRlcnMiLCJTZXJ2aWNlIiwiX2RlZmF1bHRzIiwiZGVmYXVsdHMiLCJjb250ZW50VHlwZSIsInJlc3BvbnNlVHlwZSIsIl9yZXNwb25zZVR5cGVzIiwiX3Jlc3BvbnNlVHlwZSIsIl94aHIiLCJmaW5kIiwicmVzcG9uc2VUeXBlSXRlbSIsIl90eXBlIiwidHlwZSIsIl91cmwiLCJ1cmwiLCJfaGVhZGVycyIsImhlYWRlcnMiLCJoZWFkZXIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwiX2RhdGEiLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIl9lbmFibGVkIiwiZW5hYmxlZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3RhdHVzIiwiYWJvcnQiLCJvcGVuIiwib25sb2FkIiwib25lcnJvciIsInNlbmQiLCJ0aGVuIiwiY3VycmVudFRhcmdldCIsImVuYWJsZSIsImRpc2FibGUiLCJNb2RlbCIsIl9pc1NldHRpbmciLCJpc1NldHRpbmciLCJzZXQiLCJfc2NoZW1hIiwiX2hpc3Rpb2dyYW0iLCJoaXN0aW9ncmFtIiwiYXNzaWduIiwiX2hpc3RvcnkiLCJoaXN0b3J5IiwidW5zaGlmdCIsInBhcnNlIiwiX2RhdGFFdmVudHMiLCJkYXRhRXZlbnRzIiwiX2RhdGFDYWxsYmFja3MiLCJkYXRhQ2FsbGJhY2tzIiwiX3NlcnZpY2VzIiwic2VydmljZXMiLCJfc2VydmljZUV2ZW50cyIsInNlcnZpY2VFdmVudHMiLCJfc2VydmljZUNhbGxiYWNrcyIsInNlcnZpY2VDYWxsYmFja3MiLCJlbmFibGVTZXJ2aWNlRXZlbnRzIiwiZGlzYWJsZVNlcnZpY2VFdmVudHMiLCJ1bmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMiLCJlbmFibGVEYXRhRXZlbnRzIiwiZGlzYWJsZURhdGFFdmVudHMiLCJnZXQiLCJwcm9wZXJ0eSIsIl9hcmd1bWVudHMiLCJmb3JFYWNoIiwiaW5kZXgiLCJrZXkiLCJ2YWx1ZSIsInNldERhdGFQcm9wZXJ0eSIsInNpbGVudCIsInVuc2V0IiwidW5zZXREYXRhUHJvcGVydHkiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiY29uZmlndXJhYmxlIiwic2V0VmFsdWVFdmVudE5hbWUiLCJzZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlRXZlbnROYW1lIiwidW5zZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlIiwiSlNPTiIsInN0cmluZ2lmeSIsIkVtaXR0ZXIiLCJfbmFtZSIsImVtaXNzaW9uIiwiVmlldyIsIl9lbGVtZW50TmFtZSIsIl9lbGVtZW50IiwidGFnTmFtZSIsImVsZW1lbnROYW1lIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJlbGVtZW50T2JzZXJ2ZXIiLCJvYnNlcnZlIiwic3VidHJlZSIsImNoaWxkTGlzdCIsIl9hdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZUtleSIsImF0dHJpYnV0ZVZhbHVlIiwicmVtb3ZlQXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwiX3VpIiwidWkiLCJ1aUtleSIsInVpVmFsdWUiLCJxdWVyeVNlbGVjdG9yQWxsIiwiX3VpRXZlbnRzIiwidWlFdmVudHMiLCJfdWlDYWxsYmFja3MiLCJ1aUNhbGxiYWNrcyIsIl9vYnNlcnZlckNhbGxiYWNrcyIsIm9ic2VydmVyQ2FsbGJhY2tzIiwiX2VsZW1lbnRPYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJlbGVtZW50T2JzZXJ2ZSIsImJpbmQiLCJfaW5zZXJ0IiwiaW5zZXJ0IiwiX3RlbXBsYXRlcyIsInRlbXBsYXRlcyIsIm11dGF0aW9uUmVjb3JkTGlzdCIsIm9ic2VydmVyIiwibXV0YXRpb25SZWNvcmRJbmRleCIsIm11dGF0aW9uUmVjb3JkIiwibXV0YXRpb25SZWNvcmRDYXRlZ29yaWVzIiwibXV0YXRpb25SZWNvcmRDYXRlZ29yeSIsInJlc2V0VUkiLCJhdXRvSW5zZXJ0IiwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50IiwibWV0aG9kIiwiYXV0b1JlbW92ZSIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImVuYWJsZUVsZW1lbnQiLCJkaXNhYmxlRWxlbWVudCIsImRpc2FibGVVSSIsImVuYWJsZVVJIiwiZW5hYmxlVUlFdmVudHMiLCJkaXNhYmxlVUlFdmVudHMiLCJlbmFibGVFbWl0dGVycyIsImRpc2FibGVFbWl0dGVycyIsInRoaXNzIiwiQ29udHJvbGxlciIsIl9lbWl0dGVyQ2FsbGJhY2tzIiwiZW1pdHRlckNhbGxiYWNrcyIsIl9tb2RlbENhbGxiYWNrcyIsIm1vZGVsQ2FsbGJhY2tzIiwiX3ZpZXdDYWxsYmFja3MiLCJ2aWV3Q2FsbGJhY2tzIiwiX2NvbnRyb2xsZXJDYWxsYmFja3MiLCJjb250cm9sbGVyQ2FsbGJhY2tzIiwiX3JvdXRlckNhbGxiYWNrcyIsInJvdXRlckNhbGxiYWNrcyIsIl9tb2RlbHMiLCJtb2RlbHMiLCJfdmlld3MiLCJ2aWV3cyIsIl9jb250cm9sbGVycyIsImNvbnRyb2xsZXJzIiwiX3JvdXRlcnMiLCJyb3V0ZXJzIiwiX2VtaXR0ZXJFdmVudHMiLCJlbWl0dGVyRXZlbnRzIiwiX21vZGVsRXZlbnRzIiwibW9kZWxFdmVudHMiLCJfdmlld0V2ZW50cyIsInZpZXdFdmVudHMiLCJfY29udHJvbGxlckV2ZW50cyIsImNvbnRyb2xsZXJFdmVudHMiLCJlbmFibGVNb2RlbEV2ZW50cyIsImRpc2FibGVNb2RlbEV2ZW50cyIsImVuYWJsZVZpZXdFdmVudHMiLCJkaXNhYmxlVmlld0V2ZW50cyIsImVuYWJsZUNvbnRyb2xsZXJFdmVudHMiLCJkaXNhYmxlQ29udHJvbGxlckV2ZW50cyIsImVuYWJsZUVtaXR0ZXJFdmVudHMiLCJkaXNhYmxlRW1pdHRlckV2ZW50cyIsIlJvdXRlciIsInJvdXRlIiwiU3RyaW5nIiwid2luZG93IiwibG9jYXRpb24iLCJoYXNoIiwicG9wIiwiX3JvdXRlcyIsInJvdXRlcyIsIl9jb250cm9sbGVyIiwiY29udHJvbGxlciIsImVuYWJsZVJvdXRlcyIsImVuYWJsZUV2ZW50cyIsImRpc2FibGVFdmVudHMiLCJkaXNhYmxlUm91dGVzIiwibWFwIiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhc2hDaGFuZ2UiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJlcnJvciIsIm5hdmlnYXRlIiwicGF0aCJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSUEsR0FBRyxHQUFHQSxHQUFHLElBQUksRUFBakI7QUNBQUEsR0FBRyxDQUFDQyxTQUFKLEdBQWdCLEVBQWhCO0FBQ0FELEdBQUcsQ0FBQ0UsS0FBSixHQUFZRixHQUFHLENBQUNDLFNBQWhCO0FDREFELEdBQUcsQ0FBQ0MsU0FBSixDQUFjRSxNQUFkLEdBQXVCLEVBQXZCO0FBQ0FILEdBQUcsQ0FBQ0UsS0FBSixDQUFVRSxFQUFWLEdBQWVKLEdBQUcsQ0FBQ0MsU0FBSixDQUFjRSxNQUE3QjtBQ0RBSCxHQUFHLENBQUNLLFNBQUosR0FBZ0I7QUFDZEMsRUFBQUEsa0NBQWtDLEVBQUUsU0FBU0MsOEJBQVQsQ0FBd0NDLElBQXhDLEVBQThDO0FBQ2hGLFdBQU8sQ0FDTCwwRUFESyxFQUVMQyxJQUZLLENBRUEsSUFGQSxDQUFQO0FBR0QsR0FMYTtBQU1kQyxFQUFBQSxrQkFBa0IsRUFBRSxTQUFTQSxrQkFBVCxDQUE0QkYsSUFBNUIsRUFBa0M7QUFDcEQsV0FBTyw2Q0FFTEMsSUFGSyxDQUVBLElBRkEsQ0FBUDtBQUdELEdBVmE7QUFXZEUsRUFBQUEsbUJBQW1CLEVBQUUsU0FBU0EsbUJBQVQsQ0FBNkJILElBQTdCLEVBQW1DO0FBQ3RELDREQUVFQyxJQUZGLENBRU8sSUFGUDtBQUdELEdBZmE7QUFnQmRHLEVBQUFBLGFBQWEsRUFBRSxTQUFTQSxhQUFULENBQXVCSixJQUF2QixFQUE2QjtBQUMxQyx1Q0FFRUMsSUFGRixDQUVPLElBRlA7QUFHRCxHQXBCYTtBQXFCZEksRUFBQUEsZUFBZSxFQUFFLFNBQVNBLGVBQVQsQ0FBeUJMLElBQXpCLEVBQStCO0FBQzlDLG9DQUVFQyxJQUZGLENBRU8sSUFGUDtBQUdEO0FBekJhLENBQWhCO0FBMkJBVCxHQUFHLENB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MkIsWUFBM0IsRUFBeUMsS0FBS0QsVUFBTCxDQUFnQi9FLElBQWhCLENBQXFCLElBQXJCLENBQXpDO0FBQ0Q7O0FBQ0QrRSxFQUFBQSxVQUFVLENBQUNFLEtBQUQsRUFBUTtBQUNoQixRQUFJbEIsS0FBSyxHQUFHLEtBQUtBLEtBQWpCOztBQUNBLFFBQUk7QUFDRixXQUFLTyxNQUFMLENBQVlQLEtBQVosRUFBbUJrQixLQUFuQjtBQUNBLFdBQUtqTyxJQUFMLENBQVUsVUFBVixFQUFzQixJQUF0QjtBQUNELEtBSEQsQ0FHRSxPQUFNa08sS0FBTixFQUFhLENBQUU7QUFDbEI7O0FBQ0RDLEVBQUFBLFFBQVEsQ0FBQ0MsSUFBRCxFQUFPO0FBQ2JuQixJQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLElBQWhCLEdBQXVCaUIsSUFBdkI7QUFDRDs7QUE3RWlDLENBQXBDIiwiZmlsZSI6ImJyb3dzZXIvbXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBNVkMgPSBNVkMgfHwge31cclxuIiwiTVZDLkNvbnN0YW50cyA9IHt9XG5NVkMuQ09OU1QgPSBNVkMuQ29uc3RhbnRzXG4iLCJNVkMuRXZlbnRzID0gY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2V2ZW50cygpIHtcclxuICAgIHRoaXMuZXZlbnRzID0gKHRoaXMuZXZlbnRzKVxyXG4gICAgICA/IHRoaXMuZXZlbnRzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmV2ZW50c1xyXG4gIH1cclxuICBldmVudENhbGxiYWNrcyhldmVudE5hbWUpIHsgcmV0dXJuIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdIHx8IHt9IH1cclxuICBldmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gKGV2ZW50Q2FsbGJhY2submFtZS5sZW5ndGgpXHJcbiAgICAgID8gZXZlbnRDYWxsYmFjay5uYW1lXHJcbiAgICAgIDogJ2Fub255bW91c0Z1bmN0aW9uJ1xyXG4gIH1cclxuICBldmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKSB7XHJcbiAgICByZXR1cm4gZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdIHx8IFtdXHJcbiAgfVxyXG4gIG9uKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaykge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5ldmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja05hbWUgPSB0aGlzLmV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja0dyb3VwID0gdGhpcy5ldmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKVxyXG4gICAgZXZlbnRDYWxsYmFja0dyb3VwLnB1c2goZXZlbnRDYWxsYmFjaylcclxuICAgIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudENhbGxiYWNrc1xyXG4gIH1cclxuICBvZmYoKSB7XHJcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2sgPSBhcmd1bWVudHNbMV1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFja05hbWUgPSB0aGlzLmV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdW2V2ZW50Q2FsbGJhY2tOYW1lXVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfVxyXG4gIGVtaXQoZXZlbnROYW1lLCBldmVudERhdGEpIHtcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IHRoaXMuZXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgZm9yKGxldCBbZXZlbnRDYWxsYmFja0dyb3VwTmFtZSwgZXZlbnRDYWxsYmFja0dyb3VwXSBvZiBPYmplY3QuZW50cmllcyhldmVudENhbGxiYWNrcykpIHtcclxuICAgICAgZm9yKGxldCBldmVudENhbGxiYWNrIG9mIGV2ZW50Q2FsbGJhY2tHcm91cCkge1xyXG4gICAgICAgIGxldCBhZGRpdGlvbmFsQXJndW1lbnRzID0gT2JqZWN0LnZhbHVlcyhhcmd1bWVudHMpLnNwbGljZSgyKVxyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2soZXZlbnREYXRhLCAuLi5hZGRpdGlvbmFsQXJndW1lbnRzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIk1WQy5UZW1wbGF0ZXMgPSB7XHJcbiAgT2JqZWN0UXVlcnlTdHJpbmdGb3JtYXRJbnZhbGlkUm9vdDogZnVuY3Rpb24gT2JqZWN0UXVlcnlTdHJpbmdGb3JtYXRJbnZhbGlkKGRhdGEpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgICdPYmplY3QgUXVlcnkgXCJzdHJpbmdcIiBwcm9wZXJ0eSBtdXN0IGJlIGZvcm1hdHRlZCB0byBmaXJzdCBpbmNsdWRlIFwiW0BdXCIuJ1xyXG4gICAgXS5qb2luKCdcXG4nKVxyXG4gIH0sXHJcbiAgRGF0YVNjaGVtYU1pc21hdGNoOiBmdW5jdGlvbiBEYXRhU2NoZW1hTWlzbWF0Y2goZGF0YSkge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgYERhdGEgYW5kIFNjaGVtYSBwcm9wZXJ0aWVzIGRvIG5vdCBtYXRjaC5gXHJcbiAgICBdLmpvaW4oJ1xcbicpXHJcbiAgfSxcclxuICBEYXRhRnVuY3Rpb25JbnZhbGlkOiBmdW5jdGlvbiBEYXRhRnVuY3Rpb25JbnZhbGlkKGRhdGEpIHtcclxuICAgIFtcclxuICAgICAgYE1vZGVsIERhdGEgcHJvcGVydHkgdHlwZSBcIkZ1bmN0aW9uXCIgaXMgbm90IHZhbGlkLmBcclxuICAgIF0uam9pbignXFxuJylcclxuICB9LFxyXG4gIERhdGFVbmRlZmluZWQ6IGZ1bmN0aW9uIERhdGFVbmRlZmluZWQoZGF0YSkge1xyXG4gICAgW1xyXG4gICAgICBgTW9kZWwgRGF0YSBwcm9wZXJ0eSB1bmRlZmluZWQuYFxyXG4gICAgXS5qb2luKCdcXG4nKVxyXG4gIH0sXHJcbiAgU2NoZW1hVW5kZWZpbmVkOiBmdW5jdGlvbiBTY2hlbWFVbmRlZmluZWQoZGF0YSkge1xyXG4gICAgW1xyXG4gICAgICBgTW9kZWwgXCJTY2hlbWFcIiB1bmRlZmluZWQuYFxyXG4gICAgXS5qb2luKCdcXG4nKVxyXG4gIH0sXHJcbn1cclxuTVZDLlRNUEwgPSBNVkMuVGVtcGxhdGVzXHJcbiIsIk1WQy5VdGlscyA9IHt9XHJcbiIsIk1WQy5VdGlscy5pc0FycmF5ID0gZnVuY3Rpb24gaXNBcnJheShvYmplY3QpIHsgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqZWN0KSB9XHJcbk1WQy5VdGlscy5pc09iamVjdCA9IGZ1bmN0aW9uIGlzT2JqZWN0KG9iamVjdCkge1xyXG4gIHJldHVybiAoIUFycmF5LmlzQXJyYXkob2JqZWN0KSlcclxuICAgID8gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCdcclxuICAgIDogZmFsc2VcclxufVxyXG5NVkMuVXRpbHMuaXNFcXVhbFR5cGUgPSBmdW5jdGlvbiBpc0VxdWFsVHlwZSh2YWx1ZUEsIHZhbHVlQikgeyByZXR1cm4gdmFsdWVBID09PSB2YWx1ZUIgfVxyXG5NVkMuVXRpbHMuaXNIVE1MRWxlbWVudCA9IGZ1bmN0aW9uIGlzSFRNTEVsZW1lbnQob2JqZWN0KSB7XHJcbiAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XHJcbn1cclxuIiwiTVZDLlV0aWxzLnR5cGVPZiA9ICBmdW5jdGlvbiB0eXBlT2YoZGF0YSkge1xyXG4gIHN3aXRjaCh0eXBlb2YgZGF0YSkge1xyXG4gICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgbGV0IF9vYmplY3RcclxuICAgICAgaWYoTVZDLlV0aWxzLmlzQXJyYXkoZGF0YSkpIHtcclxuICAgICAgICAvLyBBcnJheVxyXG4gICAgICAgIHJldHVybiAnYXJyYXknXHJcbiAgICAgIH0gZWxzZSBpZihcclxuICAgICAgICBNVkMuVXRpbHMuaXNPYmplY3QoZGF0YSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgLy8gT2JqZWN0XHJcbiAgICAgICAgcmV0dXJuICdvYmplY3QnXHJcbiAgICAgIH0gZWxzZSBpZihcclxuICAgICAgICBkYXRhID09PSBudWxsXHJcbiAgICAgICkge1xyXG4gICAgICAgIC8vIE51bGxcclxuICAgICAgICByZXR1cm4gJ251bGwnXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIF9vYmplY3RcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICBjYXNlICdudW1iZXInOlxyXG4gICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICBjYXNlICd1bmRlZmluZWQnOlxyXG4gICAgY2FzZSAnZnVuY3Rpb24nOlxyXG4gICAgICByZXR1cm4gdHlwZW9mIGRhdGFcclxuICAgICAgYnJlYWtcclxuICB9XHJcbn1cclxuIiwiTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdCA9IGZ1bmN0aW9uIGFkZFByb3BlcnRpZXNUb09iamVjdCgpIHtcclxuICBsZXQgdGFyZ2V0T2JqZWN0XHJcbiAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgIGNhc2UgMjpcclxuICAgICAgbGV0IHByb3BlcnRpZXMgPSBhcmd1bWVudHNbMF1cclxuICAgICAgdGFyZ2V0T2JqZWN0ID0gYXJndW1lbnRzWzFdXHJcbiAgICAgIGZvcihsZXQgW3Byb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocHJvcGVydGllcykpIHtcclxuICAgICAgICB0YXJnZXRPYmplY3RbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5VmFsdWVcclxuICAgICAgfVxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAzOlxyXG4gICAgICBsZXQgcHJvcGVydHlOYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgIGxldCBwcm9wZXJ0eVZhbHVlID0gYXJndW1lbnRzWzFdXHJcbiAgICAgIHRhcmdldE9iamVjdCA9IGFyZ3VtZW50c1syXVxyXG4gICAgICB0YXJnZXRPYmplY3RbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5VmFsdWVcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgcmV0dXJuIHRhcmdldE9iamVjdFxyXG59XHJcbiIsIk1WQy5VdGlscy5vYmplY3RRdWVyeSA9IGZ1bmN0aW9uIG9iamVjdFF1ZXJ5KFxyXG4gIHN0cmluZyxcclxuICBjb250ZXh0XHJcbikge1xyXG4gIGxldCBzdHJpbmdEYXRhID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlTm90YXRpb24oc3RyaW5nKVxyXG4gIGlmKHN0cmluZ0RhdGFbMF0gPT09ICdAJykgc3RyaW5nRGF0YS5zcGxpY2UoMCwgMSlcclxuICBpZighc3RyaW5nRGF0YS5sZW5ndGgpIHJldHVybiBjb250ZXh0XHJcbiAgY29udGV4dCA9IChNVkMuVXRpbHMuaXNPYmplY3QoY29udGV4dCkpXHJcbiAgICA/IE9iamVjdC5lbnRyaWVzKGNvbnRleHQpXHJcbiAgICA6IGNvbnRleHRcclxuICByZXR1cm4gc3RyaW5nRGF0YS5yZWR1Y2UoKG9iamVjdCwgZnJhZ21lbnQsIGZyYWdtZW50SW5kZXgsIGZyYWdtZW50cykgPT4ge1xyXG4gICAgbGV0IHByb3BlcnRpZXMgPSBbXVxyXG4gICAgZnJhZ21lbnQgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VGcmFnbWVudChmcmFnbWVudClcclxuICAgIGZvcihsZXQgW3Byb3BlcnR5S2V5LCBwcm9wZXJ0eVZhbHVlXSBvZiBvYmplY3QpIHtcclxuICAgICAgaWYocHJvcGVydHlLZXkubWF0Y2goZnJhZ21lbnQpKSB7XHJcbiAgICAgICAgaWYoZnJhZ21lbnRJbmRleCA9PT0gZnJhZ21lbnRzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzLmNvbmNhdChbW3Byb3BlcnR5S2V5LCBwcm9wZXJ0eVZhbHVlXV0pXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzLmNvbmNhdChPYmplY3QuZW50cmllcyhwcm9wZXJ0eVZhbHVlKSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIG9iamVjdCA9IHByb3BlcnRpZXNcclxuICAgIHJldHVybiBvYmplY3RcclxuICB9LCBjb250ZXh0KVxyXG59XHJcbk1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZU5vdGF0aW9uID0gZnVuY3Rpb24gcGFyc2VOb3RhdGlvbihzdHJpbmcpIHtcclxuICBpZihcclxuICAgIHN0cmluZy5jaGFyQXQoMCkgPT09ICdbJyAmJlxyXG4gICAgc3RyaW5nLmNoYXJBdChzdHJpbmcubGVuZ3RoIC0gMSkgPT0gJ10nXHJcbiAgKSB7XHJcbiAgICBzdHJpbmcgPSBzdHJpbmdcclxuICAgICAgLnNsaWNlKDEsIC0xKVxyXG4gICAgICAuc3BsaXQoJ11bJylcclxuICB9IGVsc2Uge1xyXG4gICAgc3RyaW5nID0gc3RyaW5nXHJcbiAgICAgIC5zcGxpdCgnLicpXHJcbiAgfVxyXG4gIHJldHVybiBzdHJpbmdcclxufVxyXG5NVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VGcmFnbWVudCA9IGZ1bmN0aW9uIHBhcnNlRnJhZ21lbnQoZnJhZ21lbnQpIHtcclxuICBpZihcclxuICAgIGZyYWdtZW50LmNoYXJBdCgwKSA9PT0gJy8nICYmXHJcbiAgICBmcmFnbWVudC5jaGFyQXQoZnJhZ21lbnQubGVuZ3RoIC0gMSkgPT0gJy8nXHJcbiAgKSB7XHJcbiAgICBmcmFnbWVudCA9IGZyYWdtZW50LnNsaWNlKDEsIC0xKVxyXG4gICAgZnJhZ21lbnQgPSBuZXcgUmVnRXhwKCdeJy5jb25jYXQoZnJhZ21lbnQsICckJykpXHJcbiAgfVxyXG4gIHJldHVybiBmcmFnbWVudFxyXG59XHJcbiIsIk1WQy5VdGlscy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzID0gZnVuY3Rpb24gdG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyhcclxuICB0b2dnbGVNZXRob2QsXHJcbiAgZXZlbnRzLFxyXG4gIHRhcmdldE9iamVjdHMsXHJcbiAgY2FsbGJhY2tzXHJcbikge1xyXG4gIGZvcihsZXQgW2V2ZW50U2V0dGluZ3MsIGV2ZW50Q2FsbGJhY2tOYW1lXSBvZiBPYmplY3QuZW50cmllcyhldmVudHMpKSB7XHJcbiAgICBsZXQgZXZlbnREYXRhID0gZXZlbnRTZXR0aW5ncy5zcGxpdCgnICcpXHJcbiAgICBsZXQgZXZlbnRUYXJnZXRTZXR0aW5ncyA9IGV2ZW50RGF0YVswXVxyXG4gICAgbGV0IGV2ZW50TmFtZSA9IGV2ZW50RGF0YVsxXVxyXG4gICAgbGV0IGV2ZW50VGFyZ2V0cyA9IE1WQy5VdGlscy5vYmplY3RRdWVyeShcclxuICAgICAgZXZlbnRUYXJnZXRTZXR0aW5ncyxcclxuICAgICAgdGFyZ2V0T2JqZWN0c1xyXG4gICAgKVxyXG4gICAgZXZlbnRUYXJnZXRzID0gKCFNVkMuVXRpbHMuaXNBcnJheShldmVudFRhcmdldHMpKVxyXG4gICAgICA/IFtbJ0AnLCBldmVudFRhcmdldHNdXVxyXG4gICAgICA6IGV2ZW50VGFyZ2V0c1xyXG4gICAgZm9yKGxldCBbZXZlbnRUYXJnZXROYW1lLCBldmVudFRhcmdldF0gb2YgZXZlbnRUYXJnZXRzKSB7XHJcbiAgICAgIGxldCBldmVudE1ldGhvZE5hbWUgPSAodG9nZ2xlTWV0aG9kID09PSAnb24nKVxyXG4gICAgICA/IChcclxuICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0IHx8XHJcbiAgICAgICAgKFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBEb2N1bWVudFxyXG4gICAgICAgIClcclxuICAgICAgKSA/ICdhZGRFdmVudExpc3RlbmVyJ1xyXG4gICAgICAgIDogJ29uJ1xyXG4gICAgICA6IChcclxuICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0IHx8XHJcbiAgICAgICAgKFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxyXG4gICAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBEb2N1bWVudFxyXG4gICAgICAgIClcclxuICAgICAgKSA/ICdyZW1vdmVFdmVudExpc3RlbmVyJ1xyXG4gICAgICAgIDogJ29mZidcclxuICAgICAgbGV0IGV2ZW50Q2FsbGJhY2sgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkoXHJcbiAgICAgICAgZXZlbnRDYWxsYmFja05hbWUsXHJcbiAgICAgICAgY2FsbGJhY2tzXHJcbiAgICAgIClbMF1bMV1cclxuICAgICAgaWYoZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xyXG4gICAgICAgIGZvcihsZXQgX2V2ZW50VGFyZ2V0IG9mIGV2ZW50VGFyZ2V0KSB7XHJcbiAgICAgICAgICBfZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYoZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCl7XHJcbiAgICAgICAgZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMgPSBmdW5jdGlvbiBiaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKCkge1xyXG4gIHRoaXMudG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cygnb24nLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzID0gZnVuY3Rpb24gdW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMoKSB7XHJcbiAgdGhpcy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKCdvZmYnLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuIiwiTVZDLlV0aWxzLnZhbGlkYXRlRGF0YVNjaGVtYSA9IGZ1bmN0aW9uIHZhbGlkYXRlRGF0YVNjaGVtYShkYXRhLCBzY2hlbWEpIHtcclxuICBpZihzY2hlbWEpIHtcclxuICAgIHN3aXRjaChNVkMuVXRpbHMudHlwZU9mKGRhdGEpKSB7XHJcbiAgICAgIGNhc2UgJ2FycmF5JzpcclxuICAgICAgICBsZXQgYXJyYXkgPSBbXVxyXG4gICAgICAgIHNjaGVtYSA9IChNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSkgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICA/IHNjaGVtYSgpXHJcbiAgICAgICAgICA6IHNjaGVtYVxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgTVZDLlV0aWxzLmlzRXF1YWxUeXBlKFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSksXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2YoYXJyYXkpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhzY2hlbWEubmFtZSlcclxuICAgICAgICAgIGZvcihsZXQgW2FycmF5S2V5LCBhcnJheVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKFxyXG4gICAgICAgICAgICAgIHRoaXMudmFsaWRhdGVEYXRhU2NoZW1hKGFycmF5VmFsdWUpXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycmF5XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgICBsZXQgb2JqZWN0ID0ge31cclxuICAgICAgICBzY2hlbWEgPSAoTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgPyBzY2hlbWEoKVxyXG4gICAgICAgICAgOiBzY2hlbWFcclxuICAgICAgICBpZihcclxuICAgICAgICAgIE1WQy5VdGlscy5pc0VxdWFsVHlwZShcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpLFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKG9iamVjdClcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHNjaGVtYS5uYW1lKVxyXG4gICAgICAgICAgZm9yKGxldCBbb2JqZWN0S2V5LCBvYmplY3RWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGF0YSkpIHtcclxuICAgICAgICAgICAgb2JqZWN0W29iamVjdEtleV0gPSB0aGlzLnZhbGlkYXRlRGF0YVNjaGVtYShvYmplY3RWYWx1ZSwgc2NoZW1hW29iamVjdEtleV0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvYmplY3RcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgICBjYXNlICdudW1iZXInOlxyXG4gICAgICBjYXNlICdib29sZWFuJzpcclxuICAgICAgICBzY2hlbWEgPSAoTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgPyBzY2hlbWEoKVxyXG4gICAgICAgICAgOiBzY2hlbWFcclxuICAgICAgICBpZihcclxuICAgICAgICAgIE1WQy5VdGlscy5pc0VxdWFsVHlwZShcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpLFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKGRhdGEpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhzY2hlbWEubmFtZSlcclxuICAgICAgICAgIHJldHVybiBkYXRhXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRocm93IE1WQy5UTVBMXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ251bGwnOlxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgTVZDLlV0aWxzLmlzRXF1YWxUeXBlKFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSksXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2YoZGF0YSlcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIHJldHVybiBkYXRhXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XHJcbiAgICAgICAgdGhyb3cgTVZDLlRNUExcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdmdW5jdGlvbic6XHJcbiAgICAgICAgdGhyb3cgTVZDLlRNUExcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICB0aHJvdyBNVkMuVE1QTFxyXG4gIH1cclxufVxyXG4iLCJNVkMuQ2hhbm5lbHMgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfY2hhbm5lbHMoKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzID0gKHRoaXMuY2hhbm5lbHMpXHJcbiAgICAgID8gdGhpcy5jaGFubmVsc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsc1xyXG4gIH1cclxuICBjaGFubmVsKGNoYW5uZWxOYW1lKSB7XHJcbiAgICB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0gPSAodGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdKVxyXG4gICAgICA/IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA6IG5ldyBNVkMuQ2hhbm5lbHMuQ2hhbm5lbCgpXHJcbiAgICByZXR1cm4gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG4gIG9mZihjaGFubmVsTmFtZSkge1xyXG4gICAgZGVsZXRlIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxufVxyXG4iLCJNVkMuQ2hhbm5lbHMuQ2hhbm5lbCA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9yZXNwb25zZXMoKSB7XHJcbiAgICB0aGlzLnJlc3BvbnNlcyA9ICh0aGlzLnJlc3BvbnNlcylcclxuICAgICAgPyB0aGlzLnJlc3BvbnNlc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZihyZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdID0gcmVzcG9uc2VDYWxsYmFja1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZV1cclxuICAgIH1cclxuICB9XHJcbiAgcmVxdWVzdChyZXNwb25zZU5hbWUsIHJlcXVlc3REYXRhKSB7XHJcbiAgICBpZih0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0ocmVxdWVzdERhdGEpXHJcbiAgICB9XHJcbiAgfVxyXG4gIG9mZihyZXNwb25zZU5hbWUpIHtcclxuICAgIGlmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvcihsZXQgW3Jlc3BvbnNlTmFtZV0gb2YgT2JqZWN0LmtleXModGhpcy5fcmVzcG9uc2VzKSkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIk1WQy5CYXNlID0gY2xhc3MgZXh0ZW5kcyBNVkMuRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncywgY29uZmlndXJhdGlvbikge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgaWYoY29uZmlndXJhdGlvbikgdGhpcy5fY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb25cclxuICAgIGlmKHNldHRpbmdzKSB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgfVxyXG4gIGdldCBfY29uZmlndXJhdGlvbigpIHtcclxuICAgIHRoaXMuY29uZmlndXJhdGlvbiA9ICh0aGlzLmNvbmZpZ3VyYXRpb24pXHJcbiAgICAgID8gdGhpcy5jb25maWd1cmF0aW9uXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25cclxuICB9XHJcbiAgc2V0IF9jb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHsgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbiB9XHJcbiAgZ2V0IF9zZXR0aW5ncygpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSAodGhpcy5zZXR0aW5ncylcclxuICAgICAgPyB0aGlzLnNldHRpbmdzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLnNldHRpbmdzXHJcbiAgfVxyXG4gIHNldCBfc2V0dGluZ3Moc2V0dGluZ3MpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxyXG4gICAgICBzZXR0aW5ncywgdGhpcy5fc2V0dGluZ3NcclxuICAgIClcclxuICB9XHJcbiAgZ2V0IF9lbWl0dGVycygpIHtcclxuICAgIHRoaXMuZW1pdHRlcnMgPSAodGhpcy5lbWl0dGVycylcclxuICAgICAgPyB0aGlzLmVtaXR0ZXJzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXJzXHJcbiAgfVxyXG4gIHNldCBfZW1pdHRlcnMoZW1pdHRlcnMpIHtcclxuICAgIHRoaXMuZW1pdHRlcnMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxyXG4gICAgICBlbWl0dGVycywgdGhpcy5fZW1pdHRlcnNcclxuICAgIClcclxuICB9XHJcbn1cclxuIiwiTVZDLlNlcnZpY2UgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLmRlZmF1bHRzIHx8IHtcbiAgICBjb250ZW50VHlwZTogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICB9IH1cbiAgZ2V0IF9yZXNwb25zZVR5cGVzKCkgeyByZXR1cm4gWycnLCAnYXJyYXlidWZmZXInLCAnYmxvYicsICdkb2N1bWVudCcsICdqc29uJywgJ3RleHQnXSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlKCkgeyByZXR1cm4gdGhpcy5yZXNwb25zZVR5cGUgfVxuICBzZXQgX3Jlc3BvbnNlVHlwZShyZXNwb25zZVR5cGUpIHtcbiAgICB0aGlzLl94aHIucmVzcG9uc2VUeXBlID0gdGhpcy5fcmVzcG9uc2VUeXBlcy5maW5kKFxuICAgICAgKHJlc3BvbnNlVHlwZUl0ZW0pID0+IHJlc3BvbnNlVHlwZUl0ZW0gPT09IHJlc3BvbnNlVHlwZVxuICAgICkgfHwgdGhpcy5fZGVmYXVsdHMucmVzcG9uc2VUeXBlXG4gIH1cbiAgZ2V0IF90eXBlKCkgeyByZXR1cm4gdGhpcy50eXBlIH1cbiAgc2V0IF90eXBlKHR5cGUpIHsgdGhpcy50eXBlID0gdHlwZSB9XG4gIGdldCBfdXJsKCkgeyByZXR1cm4gdGhpcy51cmwgfVxuICBzZXQgX3VybCh1cmwpIHsgdGhpcy51cmwgPSB1cmwgfVxuICBnZXQgX2hlYWRlcnMoKSB7IHJldHVybiB0aGlzLmhlYWRlcnMgfHwgW10gfVxuICBzZXQgX2hlYWRlcnMoaGVhZGVycykge1xuICAgIHRoaXMuX2hlYWRlcnMubGVuZ3RoID0gMFxuICAgIGZvcihsZXQgaGVhZGVyIG9mIGhlYWRlcnMpIHtcbiAgICAgIHRoaXMuX3hoci5zZXRSZXF1ZXN0SGVhZGVyKHtoZWFkZXJ9WzBdLCB7aGVhZGVyfVsxXSlcbiAgICAgIHRoaXMuX2hlYWRlcnMucHVzaChoZWFkZXIpXG4gICAgfVxuICB9XG4gIGdldCBfZGF0YSgpIHsgcmV0dXJuIHRoaXMuZGF0YSB9XG4gIHNldCBfZGF0YShkYXRhKSB7IHRoaXMuZGF0YSA9IGRhdGEgfVxuICBnZXQgX3hocigpIHtcbiAgICB0aGlzLnhociA9ICh0aGlzLnhocilcbiAgICAgID8gdGhpcy54aHJcbiAgICAgIDogbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICByZXR1cm4gdGhpcy54aHJcbiAgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgcmVxdWVzdChkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5kYXRhIHx8IG51bGxcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYodGhpcy5feGhyLnN0YXR1cyA9PT0gMjAwKSB0aGlzLl94aHIuYWJvcnQoKVxuICAgICAgdGhpcy5feGhyLm9wZW4odGhpcy50eXBlLCB0aGlzLnVybClcbiAgICAgIHRoaXMuX2hlYWRlcnMgPSB0aGlzLnNldHRpbmdzLmhlYWRlcnMgfHwgW3RoaXMuX2RlZmF1bHRzLmNvbnRlbnRUeXBlXVxuICAgICAgdGhpcy5feGhyLm9ubG9hZCA9IHJlc29sdmVcbiAgICAgIHRoaXMuX3hoci5vbmVycm9yID0gcmVqZWN0XG4gICAgICB0aGlzLl94aHIuc2VuZChkYXRhKVxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICB0aGlzLmVtaXQoJ3hocjpyZXNvbHZlJywge1xuICAgICAgICBuYW1lOiAneGhyOnJlc29sdmUnLFxuICAgICAgICBkYXRhOiByZXNwb25zZS5jdXJyZW50VGFyZ2V0LFxuICAgICAgfSlcbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH0pXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgICF0aGlzLmVuYWJsZWQgJiZcbiAgICAgIE9iamVjdC5rZXlzKHNldHRpbmdzKS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGlmKHNldHRpbmdzLnR5cGUpIHRoaXMuX3R5cGUgPSBzZXR0aW5ncy50eXBlXG4gICAgICBpZihzZXR0aW5ncy51cmwpIHRoaXMuX3VybCA9IHNldHRpbmdzLnVybFxuICAgICAgaWYoc2V0dGluZ3MuZGF0YSkgdGhpcy5fZGF0YSA9IHNldHRpbmdzLmRhdGEgfHwgbnVsbFxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5yZXNwb25zZVR5cGUpIHRoaXMuX3Jlc3BvbnNlVHlwZSA9IHRoaXMuX3NldHRpbmdzLnJlc3BvbnNlVHlwZVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICB0aGlzLmVuYWJsZWQgJiZcbiAgICAgIE9iamVjdC5rZXlzKHNldHRpbmdzKS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl90eXBlXG4gICAgICBkZWxldGUgdGhpcy5fdXJsXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YVxuICAgICAgZGVsZXRlIHRoaXMuX2hlYWRlcnNcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZVR5cGVcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgfVxufVxuIiwiTVZDLk1vZGVsID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgX2lzU2V0dGluZygpIHsgcmV0dXJuIHRoaXMuaXNTZXR0aW5nIH1cbiAgc2V0IF9pc1NldHRpbmcoaXNTZXR0aW5nKSB7IHRoaXMuaXNTZXR0aW5nID0gaXNTZXR0aW5nIH1cbiAgZ2V0IF9kZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuX2RlZmF1bHRzIH1cbiAgc2V0IF9kZWZhdWx0cyhkZWZhdWx0cykge1xuICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgIHRoaXMuc2V0KHRoaXMuZGVmYXVsdHMpXG4gIH1cbiAgZ2V0IF9zY2hlbWEoKSB7IHJldHVybiB0aGlzLl9zY2hlbWEgfVxuICBzZXQgX3NjaGVtYShzY2hlbWEpIHsgdGhpcy5zY2hlbWEgPSBzY2hlbWEgfVxuICBnZXQgX2hpc3Rpb2dyYW0oKSB7IHJldHVybiB0aGlzLmhpc3Rpb2dyYW0gfHwge1xuICAgIGxlbmd0aDogMVxuICB9IH1cbiAgc2V0IF9oaXN0aW9ncmFtKGhpc3Rpb2dyYW0pIHtcbiAgICB0aGlzLmhpc3Rpb2dyYW0gPSBPYmplY3QuYXNzaWduKFxuICAgICAgdGhpcy5faGlzdGlvZ3JhbSxcbiAgICAgIGhpc3Rpb2dyYW1cbiAgICApXG4gIH1cbiAgZ2V0IF9oaXN0b3J5KCkge1xuICAgIHRoaXMuaGlzdG9yeSA9ICh0aGlzLmhpc3RvcnkpXG4gICAgICA/IHRoaXMuaGlzdG9yeVxuICAgICAgOiBbXVxuICAgIHJldHVybiB0aGlzLmhpc3RvcnlcbiAgfVxuICBzZXQgX2hpc3RvcnkoZGF0YSkge1xuICAgIGlmKFxuICAgICAgT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoXG4gICAgKSB7XG4gICAgICBpZih0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVuc2hpZnQodGhpcy5wYXJzZShkYXRhKSlcbiAgICAgICAgdGhpcy5faGlzdG9yeS5zcGxpY2UodGhpcy5faGlzdGlvZ3JhbS5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfZGF0YSgpIHtcbiAgICB0aGlzLmRhdGEgPSAgKHRoaXMuZGF0YSlcbiAgICAgID8gdGhpcy5kYXRhXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YVxuICB9XG4gIGdldCBfZGF0YUV2ZW50cygpIHtcbiAgICB0aGlzLmRhdGFFdmVudHMgPSAodGhpcy5kYXRhRXZlbnRzKVxuICAgICAgPyB0aGlzLmRhdGFFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5kYXRhRXZlbnRzXG4gIH1cbiAgc2V0IF9kYXRhRXZlbnRzKGRhdGFFdmVudHMpIHtcbiAgICB0aGlzLmRhdGFFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgZGF0YUV2ZW50cywgdGhpcy5fZGF0YUV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2RhdGFDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5kYXRhQ2FsbGJhY2tzID0gKHRoaXMuZGF0YUNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5kYXRhQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YUNhbGxiYWNrc1xuICB9XG4gIHNldCBfZGF0YUNhbGxiYWNrcyhkYXRhQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5kYXRhQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGRhdGFDYWxsYmFja3MsIHRoaXMuX2RhdGFDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9zZXJ2aWNlcygpIHtcbiAgICB0aGlzLnNlcnZpY2VzID0gICh0aGlzLnNlcnZpY2VzKVxuICAgICAgPyB0aGlzLnNlcnZpY2VzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZXNcbiAgfVxuICBzZXQgX3NlcnZpY2VzKHNlcnZpY2VzKSB7XG4gICAgdGhpcy5zZXJ2aWNlcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBzZXJ2aWNlcywgdGhpcy5fc2VydmljZXNcbiAgICApXG4gIH1cbiAgZ2V0IF9zZXJ2aWNlRXZlbnRzKCkge1xuICAgIHRoaXMuc2VydmljZUV2ZW50cyA9ICh0aGlzLnNlcnZpY2VFdmVudHMpXG4gICAgICA/IHRoaXMuc2VydmljZUV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnNlcnZpY2VFdmVudHNcbiAgfVxuICBzZXQgX3NlcnZpY2VFdmVudHMoc2VydmljZUV2ZW50cykge1xuICAgIHRoaXMuc2VydmljZUV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBzZXJ2aWNlRXZlbnRzLCB0aGlzLl9zZXJ2aWNlRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfc2VydmljZUNhbGxiYWNrcygpIHtcbiAgICB0aGlzLnNlcnZpY2VDYWxsYmFja3MgPSAodGhpcy5zZXJ2aWNlQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLnNlcnZpY2VDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9zZXJ2aWNlQ2FsbGJhY2tzKHNlcnZpY2VDYWxsYmFja3MpIHtcbiAgICB0aGlzLnNlcnZpY2VDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgc2VydmljZUNhbGxiYWNrcywgdGhpcy5fc2VydmljZUNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZW5hYmxlU2VydmljZUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnNlcnZpY2VFdmVudHMsIHRoaXMuc2VydmljZXMsIHRoaXMuc2VydmljZUNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlU2VydmljZUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuc2VydmljZUV2ZW50cywgdGhpcy5zZXJ2aWNlcywgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZURhdGFFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5kYXRhRXZlbnRzLCB0aGlzLCB0aGlzLmRhdGFDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZURhdGFFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmRhdGFFdmVudHMsIHRoaXMsIHRoaXMuZGF0YUNhbGxiYWNrcylcbiAgfVxuICBnZXQoKSB7XG4gICAgbGV0IHByb3BlcnR5ID0gYXJndW1lbnRzWzBdXG4gICAgcmV0dXJuIHRoaXMuX2RhdGFbJ18nLmNvbmNhdChwcm9wZXJ0eSldXG4gIH1cbiAgc2V0KCkge1xuICAgIHRoaXMuX2hpc3RvcnkgPSB0aGlzLnBhcnNlKClcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2lzU2V0dGluZyA9IHRydWVcbiAgICAgICAgICB9IGVsc2UgaWYoaW5kZXggPT09IChfYXJndW1lbnRzLmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICB0aGlzLl9pc1NldHRpbmcgPSBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICB2YXIga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHZhciB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAzOlxuICAgICAgICB2YXIga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHZhciB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICB2YXIgc2lsZW50ID0gYXJndW1lbnRzWzJdXG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUsIHNpbGVudClcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgdW5zZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpKSB7XG4gICAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUsIHNpbGVudCkge1xuICAgIGlmKCF0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV0pIHtcbiAgICAgIGxldCBjb250ZXh0ID0gdGhpc1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXG4gICAgICAgIHRoaXMuX2RhdGEsXG4gICAgICAgIHtcbiAgICAgICAgICBbJ18nLmNvbmNhdChrZXkpXToge1xuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpc1trZXldIH0sXG4gICAgICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgdGhpc1trZXldID0gdmFsdWVcbiAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgIXNpbGVudCAmJlxuICAgICAgICAgICAgICAgICFjb250ZXh0Ll9pc1NldHRpbmdcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNldFZhbHVlRXZlbnROYW1lID0gWydzZXQnLCAnOicsIGtleV0uam9pbignJylcbiAgICAgICAgICAgICAgICBsZXQgc2V0RXZlbnROYW1lID0gJ3NldCdcbiAgICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgICBzZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgICBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApXG4gICAgfVxuICAgIHRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXSA9IHZhbHVlXG4gIH1cbiAgdW5zZXREYXRhUHJvcGVydHkoa2V5KSB7XG4gICAgbGV0IHVuc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3Vuc2V0JywgJzonLCBrZXldLmpvaW4oJycpXG4gICAgbGV0IHVuc2V0RXZlbnROYW1lID0gJ3Vuc2V0J1xuICAgIGxldCB1bnNldFZhbHVlID0gdGhpcy5fZGF0YVtrZXldXG4gICAgZGVsZXRlIHRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXVxuICAgIGRlbGV0ZSB0aGlzLl9kYXRhW2tleV1cbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldFZhbHVlRXZlbnROYW1lLFxuICAgICAge1xuICAgICAgICBuYW1lOiB1bnNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgdmFsdWU6IHVuc2V0VmFsdWUsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApXG4gICAgdGhpcy5lbWl0KFxuICAgICAgdW5zZXRFdmVudE5hbWUsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IHVuc2V0RXZlbnROYW1lLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgdmFsdWU6IHVuc2V0VmFsdWUsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApXG4gIH1cbiAgcGFyc2UoZGF0YSkge1xuICAgIGRhdGEgPSBkYXRhIHx8IHRoaXMuX2RhdGFcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShPYmplY3QuYXNzaWduKHt9LCBkYXRhKSkpXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICBpZih0aGlzLnNldHRpbmdzLmhpc3Rpb2dyYW0pIHRoaXMuX2hpc3Rpb2dyYW0gPSB0aGlzLnNldHRpbmdzLmhpc3Rpb2dyYW1cbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZW1pdHRlcnMpIHRoaXMuX2VtaXR0ZXJzID0gdGhpcy5zZXR0aW5ncy5lbWl0dGVyc1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5zZXJ2aWNlcykgdGhpcy5fc2VydmljZXMgPSB0aGlzLnNldHRpbmdzLnNlcnZpY2VzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnNlcnZpY2VDYWxsYmFja3MpIHRoaXMuX3NlcnZpY2VDYWxsYmFja3MgPSB0aGlzLnNldHRpbmdzLnNlcnZpY2VDYWxsYmFja3NcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3Muc2VydmljZUV2ZW50cykgdGhpcy5fc2VydmljZUV2ZW50cyA9IHRoaXMuc2V0dGluZ3Muc2VydmljZUV2ZW50c1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5kYXRhKSB0aGlzLnNldCh0aGlzLnNldHRpbmdzLmRhdGEpXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRhdGFDYWxsYmFja3MpIHRoaXMuX2RhdGFDYWxsYmFja3MgPSB0aGlzLnNldHRpbmdzLmRhdGFDYWxsYmFja3NcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGF0YUV2ZW50cykgdGhpcy5fZGF0YUV2ZW50cyA9IHRoaXMuc2V0dGluZ3MuZGF0YUV2ZW50c1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5zY2hlbWEpIHRoaXMuX3NjaGVtYSA9IHRoaXMuc2V0dGluZ3Muc2NoZW1hXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRlZmF1bHRzKSB0aGlzLl9kZWZhdWx0cyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHNcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnNlcnZpY2VzICYmXG4gICAgICAgIHRoaXMuc2VydmljZUV2ZW50cyAmJlxuICAgICAgICB0aGlzLnNlcnZpY2VDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZVNlcnZpY2VFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuZGF0YUV2ZW50cyAmJlxuICAgICAgICB0aGlzLmRhdGFDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZURhdGFFdmVudHMoKVxuICAgICAgfVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMuc2VydmljZXMgJiZcbiAgICAgICAgdGhpcy5zZXJ2aWNlRXZlbnRzICYmXG4gICAgICAgIHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZVNlcnZpY2VFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuZGF0YUV2ZW50cyAmJlxuICAgICAgICB0aGlzLmRhdGFDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVEYXRhRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSB0aGlzLl9oaXN0aW9ncmFtXG4gICAgICBkZWxldGUgdGhpcy5fc2VydmljZXNcbiAgICAgIGRlbGV0ZSB0aGlzLl9zZXJ2aWNlQ2FsbGJhY2tzXG4gICAgICBkZWxldGUgdGhpcy5fc2VydmljZUV2ZW50c1xuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhQ2FsbGJhY2tzXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YUV2ZW50c1xuICAgICAgZGVsZXRlIHRoaXMuX3NjaGVtYVxuICAgICAgZGVsZXRlIHRoaXMuX2VtaXR0ZXJzXG4gICAgfVxuICB9XG59XG4iLCJNVkMuRW1pdHRlciA9IGNsYXNzIGV4dGVuZHMgTVZDLk1vZGVsIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICAgIGlmKHRoaXMuc2V0dGluZ3MpIHtcclxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5uYW1lKSB0aGlzLl9uYW1lID0gdGhpcy5zZXR0aW5ncy5uYW1lXHJcbiAgICB9XHJcbiAgfVxyXG4gIGdldCBfbmFtZSgpIHsgcmV0dXJuIHRoaXMubmFtZSB9XHJcbiAgc2V0IF9uYW1lKG5hbWUpIHsgdGhpcy5uYW1lID0gbmFtZSB9XHJcbiAgZW1pc3Npb24oKSB7XHJcbiAgICBsZXQgZXZlbnREYXRhID0ge1xyXG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXHJcbiAgICAgIGRhdGE6IHRoaXMuZGF0YVxyXG4gICAgfVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICB0aGlzLm5hbWUsXHJcbiAgICAgIGV2ZW50RGF0YVxyXG4gICAgKVxyXG4gICAgcmV0dXJuIGV2ZW50RGF0YVxyXG4gIH1cclxufVxyXG4iLCJNVkMuVmlldyA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IF9lbGVtZW50TmFtZSgpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQudGFnTmFtZSB9XG4gIHNldCBfZWxlbWVudE5hbWUoZWxlbWVudE5hbWUpIHtcbiAgICBpZighdGhpcy5fZWxlbWVudCkgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudE5hbWUpXG4gIH1cbiAgZ2V0IF9lbGVtZW50KCkgeyByZXR1cm4gdGhpcy5lbGVtZW50IH1cbiAgc2V0IF9lbGVtZW50KGVsZW1lbnQpIHtcbiAgICBpZihcbiAgICAgIGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxuICAgICAgZWxlbWVudCBpbnN0YW5jZW9mIERvY3VtZW50XG4gICAgKSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgfSBlbHNlIGlmKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50KVxuICAgIH1cbiAgICB0aGlzLmVsZW1lbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudCwge1xuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICB9KVxuICB9XG4gIGdldCBfYXR0cmlidXRlcygpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQuYXR0cmlidXRlcyB9XG4gIHNldCBfYXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgZm9yKGxldCBbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGVWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlS2V5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IF91aSgpIHtcbiAgICB0aGlzLnVpID0gKHRoaXMudWkpXG4gICAgICA/IHRoaXMudWlcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy51aVxuICB9XG4gIHNldCBfdWkodWkpIHtcbiAgICBpZighdGhpcy5fdWlbJyRlbGVtZW50J10pIHRoaXMuX3VpWyckZWxlbWVudCddID0gdGhpcy5lbGVtZW50XG4gICAgZm9yKGxldCBbdWlLZXksIHVpVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHVpKSkge1xuICAgICAgaWYodHlwZW9mIHVpVmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuX3VpW3VpS2V5XSA9IHRoaXMuX2VsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh1aVZhbHVlKVxuICAgICAgfSBlbHNlIGlmKFxuICAgICAgICB1aVZhbHVlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcbiAgICAgICAgdWlWYWx1ZSBpbnN0YW5jZW9mIERvY3VtZW50XG4gICAgICApIHtcbiAgICAgICAgdGhpcy5fdWlbdWlLZXldID0gdWlWYWx1ZVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgX3VpRXZlbnRzKCkgeyByZXR1cm4gdGhpcy51aUV2ZW50cyB9XG4gIHNldCBfdWlFdmVudHModWlFdmVudHMpIHsgdGhpcy51aUV2ZW50cyA9IHVpRXZlbnRzIH1cbiAgZ2V0IF91aUNhbGxiYWNrcygpIHtcbiAgICB0aGlzLnVpQ2FsbGJhY2tzID0gKHRoaXMudWlDYWxsYmFja3MpXG4gICAgICA/IHRoaXMudWlDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy51aUNhbGxiYWNrc1xuICB9XG4gIHNldCBfdWlDYWxsYmFja3ModWlDYWxsYmFja3MpIHtcbiAgICB0aGlzLnVpQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHVpQ2FsbGJhY2tzLCB0aGlzLl91aUNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX29ic2VydmVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3MgPSAodGhpcy5vYnNlcnZlckNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5vYnNlcnZlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9vYnNlcnZlckNhbGxiYWNrcyhvYnNlcnZlckNhbGxiYWNrcykge1xuICAgIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgb2JzZXJ2ZXJDYWxsYmFja3MsIHRoaXMuX29ic2VydmVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBlbGVtZW50T2JzZXJ2ZXIoKSB7XG4gICAgdGhpcy5fZWxlbWVudE9ic2VydmVyID0gKHRoaXMuX2VsZW1lbnRPYnNlcnZlcilcbiAgICAgID8gdGhpcy5fZWxlbWVudE9ic2VydmVyXG4gICAgICA6IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuZWxlbWVudE9ic2VydmUuYmluZCh0aGlzKSlcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudE9ic2VydmVyXG4gIH1cbiAgZ2V0IF9pbnNlcnQoKSB7IHJldHVybiB0aGlzLmluc2VydCB9XG4gIHNldCBfaW5zZXJ0KGluc2VydCkgeyB0aGlzLmluc2VydCA9IGluc2VydCB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICBnZXQgX3RlbXBsYXRlcygpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9ICh0aGlzLnRlbXBsYXRlcylcbiAgICAgID8gdGhpcy50ZW1wbGF0ZXNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZXNcbiAgfVxuICBzZXQgX3RlbXBsYXRlcyh0ZW1wbGF0ZXMpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB0ZW1wbGF0ZXMsIHRoaXMuX3RlbXBsYXRlc1xuICAgIClcbiAgfVxuICBlbGVtZW50T2JzZXJ2ZShtdXRhdGlvblJlY29yZExpc3QsIG9ic2VydmVyKSB7XG4gICAgZm9yKGxldCBbbXV0YXRpb25SZWNvcmRJbmRleCwgbXV0YXRpb25SZWNvcmRdIG9mIE9iamVjdC5lbnRyaWVzKG11dGF0aW9uUmVjb3JkTGlzdCkpIHtcbiAgICAgIHN3aXRjaChtdXRhdGlvblJlY29yZC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2NoaWxkTGlzdCc6XG4gICAgICAgICAgbGV0IG11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcyA9IFsnYWRkZWROb2RlcycsICdyZW1vdmVkTm9kZXMnXVxuICAgICAgICAgIGZvcihsZXQgbXV0YXRpb25SZWNvcmRDYXRlZ29yeSBvZiBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMpIHtcbiAgICAgICAgICAgIGlmKG11dGF0aW9uUmVjb3JkW211dGF0aW9uUmVjb3JkQ2F0ZWdvcnldLmxlbmd0aCkge1xuICAgICAgICAgICAgICB0aGlzLnJlc2V0VUkoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBhdXRvSW5zZXJ0KCkge1xuICAgIGlmKHRoaXMuaW5zZXJ0KSB7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuaW5zZXJ0LmVsZW1lbnQpXG4gICAgICAuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICBlbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCh0aGlzLmluc2VydC5tZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIGF1dG9SZW1vdmUoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLmVsZW1lbnQgJiZcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50XG4gICAgKSB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpXG4gIH1cbiAgZW5hYmxlRWxlbWVudChzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKHNldHRpbmdzLmVsZW1lbnROYW1lKSB0aGlzLl9lbGVtZW50TmFtZSA9IHNldHRpbmdzLmVsZW1lbnROYW1lXG4gICAgaWYoc2V0dGluZ3MuZWxlbWVudCkgdGhpcy5fZWxlbWVudCA9IHNldHRpbmdzLmVsZW1lbnRcbiAgICBpZihzZXR0aW5ncy5hdHRyaWJ1dGVzKSB0aGlzLl9hdHRyaWJ1dGVzID0gc2V0dGluZ3MuYXR0cmlidXRlc1xuICAgIGlmKHNldHRpbmdzLnRlbXBsYXRlcykgdGhpcy5fdGVtcGxhdGVzID0gc2V0dGluZ3MudGVtcGxhdGVzXG4gICAgaWYoc2V0dGluZ3MuaW5zZXJ0KSB0aGlzLl9pbnNlcnQgPSBzZXR0aW5ncy5pbnNlcnRcbiAgfVxuICBkaXNhYmxlRWxlbWVudChzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgdGhpcy5lbGVtZW50ICYmXG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICkgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIGlmKHRoaXMuZWxlbWVudCkgZGVsZXRlIHRoaXMuZWxlbWVudFxuICAgIGlmKHRoaXMuYXR0cmlidXRlcykgZGVsZXRlIHRoaXMuYXR0cmlidXRlc1xuICAgIGlmKHRoaXMudGVtcGxhdGVzKSBkZWxldGUgdGhpcy50ZW1wbGF0ZXNcbiAgICBpZih0aGlzLmluc2VydCkgZGVsZXRlIHRoaXMuaW5zZXJ0XG4gIH1cbiAgcmVzZXRVSSgpIHtcbiAgICB0aGlzLmRpc2FibGVVSSgpXG4gICAgdGhpcy5lbmFibGVVSSgpXG4gIH1cbiAgZW5hYmxlVUkoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihzZXR0aW5ncy51aSkgdGhpcy5fdWkgPSBzZXR0aW5ncy51aVxuICAgIGlmKHNldHRpbmdzLnVpQ2FsbGJhY2tzKSB0aGlzLl91aUNhbGxiYWNrcyA9IHNldHRpbmdzLnVpQ2FsbGJhY2tzXG4gICAgaWYoc2V0dGluZ3MudWlFdmVudHMpIHtcbiAgICAgIHRoaXMuX3VpRXZlbnRzID0gc2V0dGluZ3MudWlFdmVudHNcbiAgICAgIHRoaXMuZW5hYmxlVUlFdmVudHMoKVxuICAgIH1cbiAgfVxuICBkaXNhYmxlVUkoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihzZXR0aW5ncy51aUV2ZW50cykge1xuICAgICAgdGhpcy5kaXNhYmxlVUlFdmVudHMoKVxuICAgICAgZGVsZXRlIHRoaXMuX3VpRXZlbnRzXG4gICAgfVxuICAgIGRlbGV0ZSB0aGlzLnVpRXZlbnRzXG4gICAgZGVsZXRlIHRoaXMudWlcbiAgICBkZWxldGUgdGhpcy51aUNhbGxiYWNrc1xuICB9XG4gIGVuYWJsZVVJRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy51aUV2ZW50cyAmJlxuICAgICAgdGhpcy51aSAmJlxuICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMoXG4gICAgICAgIHRoaXMudWlFdmVudHMsXG4gICAgICAgIHRoaXMudWksXG4gICAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgZGlzYWJsZVVJRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy51aUV2ZW50cyAmJlxuICAgICAgdGhpcy51aSAmJlxuICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKFxuICAgICAgICB0aGlzLnVpRXZlbnRzLFxuICAgICAgICB0aGlzLnVpLFxuICAgICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgICApXG4gICAgfVxuICB9XG4gIGVuYWJsZUVtaXR0ZXJzKCkge1xuICAgIGlmKHRoaXMuc2V0dGluZ3MuZW1pdHRlcnMpIHRoaXMuX2VtaXR0ZXJzID0gdGhpcy5zZXR0aW5ncy5lbWl0dGVyc1xuICB9XG4gIGRpc2FibGVFbWl0dGVycygpIHtcbiAgICBpZih0aGlzLl9lbWl0dGVycykgZGVsZXRlIHRoaXMuX2VtaXR0ZXJzXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5fZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5lbmFibGVFbWl0dGVycygpXG4gICAgICB0aGlzLmVuYWJsZUVsZW1lbnQoc2V0dGluZ3MpXG4gICAgICB0aGlzLmVuYWJsZVVJKHNldHRpbmdzKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgIHRoaXMuX2VuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZGlzYWJsZVVJKHNldHRpbmdzKVxuICAgICAgdGhpcy5kaXNhYmxlRWxlbWVudChzZXR0aW5ncylcbiAgICAgIHRoaXMuZGlzYWJsZUVtaXR0ZXJzKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgICAgcmV0dXJuIHRoaXNzXG4gICAgfVxuICB9XG59XG4iLCJNVkMuQ29udHJvbGxlciA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IF9lbWl0dGVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuZW1pdHRlckNhbGxiYWNrcyA9ICh0aGlzLmVtaXR0ZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuZW1pdHRlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX2VtaXR0ZXJDYWxsYmFja3MoZW1pdHRlckNhbGxiYWNrcykge1xuICAgIHRoaXMuZW1pdHRlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBlbWl0dGVyQ2FsbGJhY2tzLCB0aGlzLl9lbWl0dGVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfbW9kZWxDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5tb2RlbENhbGxiYWNrcyA9ICh0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgfVxuICBzZXQgX21vZGVsQ2FsbGJhY2tzKG1vZGVsQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5tb2RlbENhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBtb2RlbENhbGxiYWNrcywgdGhpcy5fbW9kZWxDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF92aWV3Q2FsbGJhY2tzKCkge1xuICAgIHRoaXMudmlld0NhbGxiYWNrcyA9ICh0aGlzLnZpZXdDYWxsYmFja3MpXG4gICAgICA/IHRoaXMudmlld0NhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnZpZXdDYWxsYmFja3NcbiAgfVxuICBzZXQgX3ZpZXdDYWxsYmFja3Modmlld0NhbGxiYWNrcykge1xuICAgIHRoaXMudmlld0NhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB2aWV3Q2FsbGJhY2tzLCB0aGlzLl92aWV3Q2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlckNhbGxiYWNrcygpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MgPSAodGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9jb250cm9sbGVyQ2FsbGJhY2tzKGNvbnRyb2xsZXJDYWxsYmFja3MpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlckNhbGxiYWNrcywgdGhpcy5fY29udHJvbGxlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX3JvdXRlckNhbGxiYWNrcygpIHtcbiAgICB0aGlzLnJvdXRlckNhbGxiYWNrcyA9ICh0aGlzLnJvdXRlckNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX3JvdXRlckNhbGxiYWNrcyhyb3V0ZXJDYWxsYmFja3MpIHtcbiAgICB0aGlzLnJvdXRlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXJDYWxsYmFja3MsIHRoaXMuX3JvdXRlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVscygpIHtcbiAgICB0aGlzLm1vZGVscyA9ICh0aGlzLm1vZGVscylcbiAgICAgID8gdGhpcy5tb2RlbHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5tb2RlbHNcbiAgfVxuICBzZXQgX21vZGVscyhtb2RlbHMpIHtcbiAgICB0aGlzLm1vZGVscyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBtb2RlbHMsIHRoaXMuX21vZGVsc1xuICAgIClcbiAgfVxuICBnZXQgX3ZpZXdzKCkge1xuICAgIHRoaXMudmlld3MgPSAodGhpcy52aWV3cylcbiAgICAgID8gdGhpcy52aWV3c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnZpZXdzXG4gIH1cbiAgc2V0IF92aWV3cyh2aWV3cykge1xuICAgIHRoaXMudmlld3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld3MsIHRoaXMuX3ZpZXdzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlcnMoKSB7XG4gICAgdGhpcy5jb250cm9sbGVycyA9ICh0aGlzLmNvbnRyb2xsZXJzKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlcnNcbiAgfVxuICBzZXQgX2NvbnRyb2xsZXJzKGNvbnRyb2xsZXJzKSB7XG4gICAgdGhpcy5jb250cm9sbGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBjb250cm9sbGVycywgdGhpcy5fY29udHJvbGxlcnNcbiAgICApXG4gIH1cbiAgZ2V0IF9yb3V0ZXJzKCkge1xuICAgIHRoaXMucm91dGVycyA9ICh0aGlzLnJvdXRlcnMpXG4gICAgICA/IHRoaXMucm91dGVyc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlcnNcbiAgfVxuICBzZXQgX3JvdXRlcnMocm91dGVycykge1xuICAgIHRoaXMucm91dGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXJzLCB0aGlzLl9yb3V0ZXJzXG4gICAgKVxuICB9XG4gIGdldCBfZW1pdHRlckV2ZW50cygpIHtcbiAgICB0aGlzLmVtaXR0ZXJFdmVudHMgPSAodGhpcy5lbWl0dGVyRXZlbnRzKVxuICAgICAgPyB0aGlzLmVtaXR0ZXJFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyRXZlbnRzXG4gIH1cbiAgc2V0IF9lbWl0dGVyRXZlbnRzKGVtaXR0ZXJFdmVudHMpIHtcbiAgICB0aGlzLmVtaXR0ZXJFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgZW1pdHRlckV2ZW50cywgdGhpcy5fZW1pdHRlckV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVsRXZlbnRzKCkge1xuICAgIHRoaXMubW9kZWxFdmVudHMgPSAodGhpcy5tb2RlbEV2ZW50cylcbiAgICAgID8gdGhpcy5tb2RlbEV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm1vZGVsRXZlbnRzXG4gIH1cbiAgc2V0IF9tb2RlbEV2ZW50cyhtb2RlbEV2ZW50cykge1xuICAgIHRoaXMubW9kZWxFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgbW9kZWxFdmVudHMsIHRoaXMuX21vZGVsRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfdmlld0V2ZW50cygpIHtcbiAgICB0aGlzLnZpZXdFdmVudHMgPSAodGhpcy52aWV3RXZlbnRzKVxuICAgICAgPyB0aGlzLnZpZXdFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy52aWV3RXZlbnRzXG4gIH1cbiAgc2V0IF92aWV3RXZlbnRzKHZpZXdFdmVudHMpIHtcbiAgICB0aGlzLnZpZXdFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld0V2ZW50cywgdGhpcy5fdmlld0V2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgdGhpcy5jb250cm9sbGVyRXZlbnRzID0gKHRoaXMuY29udHJvbGxlckV2ZW50cylcbiAgICAgID8gdGhpcy5jb250cm9sbGVyRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlckV2ZW50c1xuICB9XG4gIHNldCBfY29udHJvbGxlckV2ZW50cyhjb250cm9sbGVyRXZlbnRzKSB7XG4gICAgdGhpcy5jb250cm9sbGVyRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGNvbnRyb2xsZXJFdmVudHMsIHRoaXMuX2NvbnRyb2xsZXJFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGVuYWJsZU1vZGVsRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMubW9kZWxFdmVudHMsIHRoaXMubW9kZWxzLCB0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVNb2RlbEV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMubW9kZWxFdmVudHMsIHRoaXMubW9kZWxzLCB0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZVZpZXdFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy52aWV3RXZlbnRzLCB0aGlzLnZpZXdzLCB0aGlzLnZpZXdDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZVZpZXdFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnZpZXdFdmVudHMsIHRoaXMudmlld3MsIHRoaXMudmlld0NhbGxiYWNrcylcbiAgfVxuICBlbmFibGVDb250cm9sbGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuY29udHJvbGxlckV2ZW50cywgdGhpcy5jb250cm9sbGVycywgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVDb250cm9sbGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5jb250cm9sbGVyRXZlbnRzLCB0aGlzLmNvbnRyb2xsZXJzLCB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlRW1pdHRlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmVtaXR0ZXJFdmVudHMsIHRoaXMuZW1pdHRlcnMsIHRoaXMuZW1pdHRlckNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlRW1pdHRlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuZW1pdHRlckV2ZW50cywgdGhpcy5lbWl0dGVycywgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgaWYoc2V0dGluZ3MuZW1pdHRlckNhbGxiYWNrcykgdGhpcy5fZW1pdHRlckNhbGxiYWNrcyA9IHNldHRpbmdzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLm1vZGVsQ2FsbGJhY2tzKSB0aGlzLl9tb2RlbENhbGxiYWNrcyA9IHNldHRpbmdzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy52aWV3Q2FsbGJhY2tzKSB0aGlzLl92aWV3Q2FsbGJhY2tzID0gc2V0dGluZ3Mudmlld0NhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3MuY29udHJvbGxlckNhbGxiYWNrcykgdGhpcy5fY29udHJvbGxlckNhbGxiYWNrcyA9IHNldHRpbmdzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLnJvdXRlckNhbGxiYWNrcykgdGhpcy5fcm91dGVyQ2FsbGJhY2tzID0gc2V0dGluZ3Mucm91dGVyQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5lbWl0dGVycykgdGhpcy5fZW1pdHRlcnMgPSBzZXR0aW5ncy5lbWl0dGVyc1xuICAgICAgaWYoc2V0dGluZ3MubW9kZWxzKSB0aGlzLl9tb2RlbHMgPSBzZXR0aW5ncy5tb2RlbHNcbiAgICAgIGlmKHNldHRpbmdzLnZpZXdzKSB0aGlzLl92aWV3cyA9IHNldHRpbmdzLnZpZXdzXG4gICAgICBpZihzZXR0aW5ncy5jb250cm9sbGVycykgdGhpcy5fY29udHJvbGxlcnMgPSBzZXR0aW5ncy5jb250cm9sbGVyc1xuICAgICAgaWYoc2V0dGluZ3Mucm91dGVycykgdGhpcy5fcm91dGVycyA9IHNldHRpbmdzLnJvdXRlcnNcbiAgICAgIGlmKHNldHRpbmdzLmVtaXR0ZXJFdmVudHMpIHRoaXMuX2VtaXR0ZXJFdmVudHMgPSBzZXR0aW5ncy5lbWl0dGVyRXZlbnRzXG4gICAgICBpZihzZXR0aW5ncy5tb2RlbEV2ZW50cykgdGhpcy5fbW9kZWxFdmVudHMgPSBzZXR0aW5ncy5tb2RlbEV2ZW50c1xuICAgICAgaWYoc2V0dGluZ3Mudmlld0V2ZW50cykgdGhpcy5fdmlld0V2ZW50cyA9IHNldHRpbmdzLnZpZXdFdmVudHNcbiAgICAgIGlmKHNldHRpbmdzLmNvbnRyb2xsZXJFdmVudHMpIHRoaXMuX2NvbnRyb2xsZXJFdmVudHMgPSBzZXR0aW5ncy5jb250cm9sbGVyRXZlbnRzXG4gICAgICBpZihcbiAgICAgICAgdGhpcy5lbWl0dGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZW1pdHRlcnMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5lbmFibGVFbWl0dGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLm1vZGVsRXZlbnRzICYmXG4gICAgICAgIHRoaXMubW9kZWxzICYmXG4gICAgICAgIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZU1vZGVsRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnZpZXdFdmVudHMgJiZcbiAgICAgICAgdGhpcy52aWV3cyAmJlxuICAgICAgICB0aGlzLnZpZXdDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZVZpZXdFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuY29udHJvbGxlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlQ29udHJvbGxlckV2ZW50cygpXG4gICAgICB9XG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICB0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmVtaXR0ZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVycyAmJlxuICAgICAgICB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVFbWl0dGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLm1vZGVsRXZlbnRzICYmXG4gICAgICAgIHRoaXMubW9kZWxzICYmXG4gICAgICAgIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVNb2RlbEV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy52aWV3RXZlbnRzICYmXG4gICAgICAgIHRoaXMudmlld3MgJiZcbiAgICAgICAgdGhpcy52aWV3Q2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlVmlld0V2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5jb250cm9sbGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlQ29udHJvbGxlckV2ZW50cygpXG4gICAgICB9XG4gICAgICBkZWxldGUgdGhpcy5fZW1pdHRlcnNcbiAgICAgIGRlbGV0ZSB0aGlzLl9tb2RlbENhbGxiYWNrc1xuICAgICAgZGVsZXRlIHRoaXMuX3ZpZXdDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICBkZWxldGUgdGhpcy5fcm91dGVyQ2FsbGJhY2tzXG4gICAgICBkZWxldGUgdGhpcy5fbW9kZWxzXG4gICAgICBkZWxldGUgdGhpcy5fdmlld3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyc1xuICAgICAgZGVsZXRlIHRoaXMuX3JvdXRlcnNcbiAgICAgIGRlbGV0ZSB0aGlzLl9tb2RlbEV2ZW50c1xuICAgICAgZGVsZXRlIHRoaXMuX3ZpZXdFdmVudHNcbiAgICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyRXZlbnRzXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gIH1cbn1cbiIsIk1WQy5Sb3V0ZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCByb3V0ZSgpIHtcbiAgICByZXR1cm4gU3RyaW5nKHdpbmRvdy5sb2NhdGlvbi5oYXNoKS5zcGxpdCgnIycpLnBvcCgpXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGdldCBfcm91dGVzKCkge1xuICAgIHRoaXMucm91dGVzID0gKHRoaXMucm91dGVzKVxuICAgICAgPyB0aGlzLnJvdXRlc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlc1xuICB9XG4gIHNldCBfcm91dGVzKHJvdXRlcykge1xuICAgIHRoaXMucm91dGVzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlcywgdGhpcy5fcm91dGVzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlcigpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSAodGhpcy5jb250cm9sbGVyKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyXG4gIH1cbiAgc2V0IF9jb250cm9sbGVyKGNvbnRyb2xsZXIpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlciwgdGhpcy5fY29udHJvbGxlclxuICAgIClcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZW5hYmxlUm91dGVzKHRoaXMucm91dGVzLCB0aGlzLmNvbnRyb2xsZXJzKVxuICAgICAgdGhpcy5lbmFibGVFdmVudHMoKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLmRpc2FibGVFdmVudHMoKVxuICAgICAgdGhpcy5kaXNhYmxlUm91dGVzKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgfVxuICBlbmFibGVSb3V0ZXMocm91dGVzLCBjb250cm9sbGVycykge1xuICAgIGlmKHNldHRpbmdzLmNvbnRyb2xsZXJzKSB0aGlzLl9jb250cm9sbGVycyA9IHNldHRpbmdzLmNvbnRyb2xsZXJzXG4gICAgdGhpcy5fcm91dGVzID0gc2V0dGluZ3Mucm91dGVzLm1hcCgocm91dGUpID0+IGNvbnRyb2xsZXJzW3JvdXRlc1tyb3V0ZV1dKVxuICAgIHJldHVyblxuICB9XG4gIGRpc2FibGVSb3V0ZXMoKSB7XG4gICAgZGVsZXRlIHRoaXMuX3JvdXRlc1xuICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyc1xuICB9XG4gIGVuYWJsZUV2ZW50cygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMuaGFzaENoYW5nZS5iaW5kKHRoaXMpKVxuICB9XG4gIGRpc2FibGVFdmVudHMoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLmhhc2hDaGFuZ2UuYmluZCh0aGlzKSlcbiAgfVxuICBoYXNoQ2hhbmdlKGV2ZW50KSB7XG4gICAgdmFyIHJvdXRlID0gdGhpcy5yb3V0ZVxuICAgIHRyeSB7XG4gICAgICB0aGlzLnJvdXRlc1tyb3V0ZV0oZXZlbnQpXG4gICAgICB0aGlzLmVtaXQoJ25hdmlnYXRlJywgdGhpcylcbiAgICB9IGNhdGNoKGVycm9yKSB7fVxuICB9XG4gIG5hdmlnYXRlKHBhdGgpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHBhdGhcbiAgfVxufVxuIl19
