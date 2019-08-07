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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1WQy5qcyIsIkNvbnN0YW50cy5qcyIsIkV2ZW50cy5qcyIsIlRlbXBsYXRlcy5qcyIsIlV0aWxzLmpzIiwiaXMuanMiLCJ0eXBlT2YuanMiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QuanMiLCJvYmplY3RRdWVyeS5qcyIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMuanMiLCJ2YWxpZGF0ZURhdGFTY2hlbWEuanMiLCJDaGFubmVscy5qcyIsIkNoYW5uZWwuanMiLCJCYXNlLmpzIiwiU2VydmljZS5qcyIsIk1vZGVsLmpzIiwiRW1pdHRlci5qcyIsImluZGV4LmpzIiwiTmF2aWdhdGUuanMiLCJWaWV3LmpzIiwiQ29udHJvbGxlci5qcyIsIlJvdXRlci5qcyJdLCJuYW1lcyI6WyJNVkMiLCJDb25zdGFudHMiLCJDT05TVCIsIkV2ZW50cyIsIkVWIiwiVGVtcGxhdGVzIiwiT2JqZWN0UXVlcnlTdHJpbmdGb3JtYXRJbnZhbGlkUm9vdCIsIk9iamVjdFF1ZXJ5U3RyaW5nRm9ybWF0SW52YWxpZCIsImRhdGEiLCJqb2luIiwiRGF0YVNjaGVtYU1pc21hdGNoIiwiRGF0YUZ1bmN0aW9uSW52YWxpZCIsIkRhdGFVbmRlZmluZWQiLCJTY2hlbWFVbmRlZmluZWQiLCJUTVBMIiwiVXRpbHMiLCJpc0FycmF5Iiwib2JqZWN0IiwiQXJyYXkiLCJpc09iamVjdCIsImlzRXF1YWxUeXBlIiwidmFsdWVBIiwidmFsdWVCIiwiaXNIVE1MRWxlbWVudCIsIkhUTUxFbGVtZW50IiwidHlwZU9mIiwiX29iamVjdCIsImFkZFByb3BlcnRpZXNUb09iamVjdCIsInRhcmdldE9iamVjdCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInByb3BlcnRpZXMiLCJwcm9wZXJ0eU5hbWUiLCJwcm9wZXJ0eVZhbHVlIiwiT2JqZWN0IiwiZW50cmllcyIsIm9iamVjdFF1ZXJ5Iiwic3RyaW5nIiwiY29udGV4dCIsInN0cmluZ0RhdGEiLCJwYXJzZU5vdGF0aW9uIiwic3BsaWNlIiwicmVkdWNlIiwiZnJhZ21lbnQiLCJmcmFnbWVudEluZGV4IiwiZnJhZ21lbnRzIiwicGFyc2VGcmFnbWVudCIsInByb3BlcnR5S2V5IiwibWF0Y2giLCJjb25jYXQiLCJjaGFyQXQiLCJzbGljZSIsInNwbGl0IiwiUmVnRXhwIiwidG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyIsInRvZ2dsZU1ldGhvZCIsImV2ZW50cyIsInRhcmdldE9iamVjdHMiLCJjYWxsYmFja3MiLCJldmVudFNldHRpbmdzIiwiZXZlbnRDYWxsYmFja05hbWUiLCJldmVudERhdGEiLCJldmVudFRhcmdldFNldHRpbmdzIiwiZXZlbnROYW1lIiwiZXZlbnRUYXJnZXRzIiwiZXZlbnRUYXJnZXROYW1lIiwiZXZlbnRUYXJnZXQiLCJldmVudE1ldGhvZE5hbWUiLCJOb2RlTGlzdCIsIkRvY3VtZW50IiwiZXZlbnRDYWxsYmFjayIsIl9ldmVudFRhcmdldCIsImJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMiLCJ1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyIsInZhbGlkYXRlRGF0YVNjaGVtYSIsInNjaGVtYSIsImFycmF5IiwiY29uc29sZSIsImxvZyIsIm5hbWUiLCJhcnJheUtleSIsImFycmF5VmFsdWUiLCJwdXNoIiwib2JqZWN0S2V5Iiwib2JqZWN0VmFsdWUiLCJjb25zdHJ1Y3RvciIsIl9ldmVudHMiLCJldmVudENhbGxiYWNrcyIsImV2ZW50Q2FsbGJhY2tHcm91cCIsIm9uIiwib2ZmIiwiZW1pdCIsImV2ZW50Q2FsbGJhY2tHcm91cE5hbWUiLCJhZGRpdGlvbmFsQXJndW1lbnRzIiwidmFsdWVzIiwiQ2hhbm5lbHMiLCJfY2hhbm5lbHMiLCJjaGFubmVscyIsImNoYW5uZWwiLCJjaGFubmVsTmFtZSIsIkNoYW5uZWwiLCJfcmVzcG9uc2VzIiwicmVzcG9uc2VzIiwicmVzcG9uc2UiLCJyZXNwb25zZU5hbWUiLCJyZXNwb25zZUNhbGxiYWNrIiwicmVxdWVzdCIsInJlcXVlc3REYXRhIiwia2V5cyIsIkJhc2UiLCJzZXR0aW5ncyIsImNvbmZpZ3VyYXRpb24iLCJfY29uZmlndXJhdGlvbiIsIl9zZXR0aW5ncyIsIl9lbWl0dGVycyIsImVtaXR0ZXJzIiwiU2VydmljZSIsIl9kZWZhdWx0cyIsImRlZmF1bHRzIiwiY29udGVudFR5cGUiLCJyZXNwb25zZVR5cGUiLCJfcmVzcG9uc2VUeXBlcyIsIl9yZXNwb25zZVR5cGUiLCJfeGhyIiwiZmluZCIsInJlc3BvbnNlVHlwZUl0ZW0iLCJfdHlwZSIsInR5cGUiLCJfdXJsIiwidXJsIiwiX2hlYWRlcnMiLCJoZWFkZXJzIiwiaGVhZGVyIiwic2V0UmVxdWVzdEhlYWRlciIsIl9kYXRhIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJfZW5hYmxlZCIsImVuYWJsZWQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInN0YXR1cyIsImFib3J0Iiwib3BlbiIsIm9ubG9hZCIsIm9uZXJyb3IiLCJzZW5kIiwidGhlbiIsImN1cnJlbnRUYXJnZXQiLCJlbmFibGUiLCJkaXNhYmxlIiwiTW9kZWwiLCJfaXNTZXR0aW5nIiwiaXNTZXR0aW5nIiwic2V0IiwiX3NjaGVtYSIsIl9oaXN0aW9ncmFtIiwiaGlzdGlvZ3JhbSIsImFzc2lnbiIsIl9oaXN0b3J5IiwiaGlzdG9yeSIsInVuc2hpZnQiLCJwYXJzZSIsIl9kYXRhRXZlbnRzIiwiZGF0YUV2ZW50cyIsIl9kYXRhQ2FsbGJhY2tzIiwiZGF0YUNhbGxiYWNrcyIsIl9zZXJ2aWNlcyIsInNlcnZpY2VzIiwiX3NlcnZpY2VFdmVudHMiLCJzZXJ2aWNlRXZlbnRzIiwiX3NlcnZpY2VDYWxsYmFja3MiLCJzZXJ2aWNlQ2FsbGJhY2tzIiwiZW5hYmxlU2VydmljZUV2ZW50cyIsImRpc2FibGVTZXJ2aWNlRXZlbnRzIiwidW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzIiwiZW5hYmxlRGF0YUV2ZW50cyIsImRpc2FibGVEYXRhRXZlbnRzIiwiZ2V0IiwicHJvcGVydHkiLCJfYXJndW1lbnRzIiwiZm9yRWFjaCIsImluZGV4Iiwia2V5IiwidmFsdWUiLCJzZXREYXRhUHJvcGVydHkiLCJzaWxlbnQiLCJ1bnNldCIsInVuc2V0RGF0YVByb3BlcnR5IiwiZGVmaW5lUHJvcGVydGllcyIsImNvbmZpZ3VyYWJsZSIsInNldFZhbHVlRXZlbnROYW1lIiwic2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZUV2ZW50TmFtZSIsInVuc2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJFbWl0dGVyIiwiX25hbWUiLCJlbWlzc2lvbiIsIkVtaXR0ZXJzIiwiTmF2aWdhdGVFbWl0dGVyIiwiYWRkU2V0dGluZ3MiLCJvbGRVUkwiLCJTdHJpbmciLCJuZXdVUkwiLCJjdXJyZW50Um91dGUiLCJjdXJyZW50Q29udHJvbGxlciIsIlZpZXciLCJfZWxlbWVudE5hbWUiLCJfZWxlbWVudCIsInRhZ05hbWUiLCJlbGVtZW50TmFtZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZWxlbWVudE9ic2VydmVyIiwib2JzZXJ2ZSIsInN1YnRyZWUiLCJjaGlsZExpc3QiLCJfYXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVLZXkiLCJhdHRyaWJ1dGVWYWx1ZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsIl91aSIsInVpIiwidWlLZXkiLCJ1aVZhbHVlIiwicXVlcnlTZWxlY3RvckFsbCIsIl91aUV2ZW50cyIsInVpRXZlbnRzIiwiX3VpQ2FsbGJhY2tzIiwidWlDYWxsYmFja3MiLCJfb2JzZXJ2ZXJDYWxsYmFja3MiLCJvYnNlcnZlckNhbGxiYWNrcyIsIl9lbGVtZW50T2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZWxlbWVudE9ic2VydmUiLCJiaW5kIiwiX2luc2VydCIsImluc2VydCIsIl90ZW1wbGF0ZXMiLCJ0ZW1wbGF0ZXMiLCJtdXRhdGlvblJlY29yZExpc3QiLCJvYnNlcnZlciIsIm11dGF0aW9uUmVjb3JkSW5kZXgiLCJtdXRhdGlvblJlY29yZCIsIm11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcyIsIm11dGF0aW9uUmVjb3JkQ2F0ZWdvcnkiLCJyZXNldFVJIiwiYXV0b0luc2VydCIsImluc2VydEFkamFjZW50RWxlbWVudCIsIm1ldGhvZCIsImF1dG9SZW1vdmUiLCJwYXJlbnRFbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJlbmFibGVFbGVtZW50IiwiZGlzYWJsZUVsZW1lbnQiLCJkaXNhYmxlVUkiLCJlbmFibGVVSSIsImVuYWJsZVVJRXZlbnRzIiwiZGlzYWJsZVVJRXZlbnRzIiwiZW5hYmxlRW1pdHRlcnMiLCJkaXNhYmxlRW1pdHRlcnMiLCJ0aGlzcyIsIkNvbnRyb2xsZXIiLCJfZW1pdHRlckNhbGxiYWNrcyIsImVtaXR0ZXJDYWxsYmFja3MiLCJfbW9kZWxDYWxsYmFja3MiLCJtb2RlbENhbGxiYWNrcyIsIl92aWV3Q2FsbGJhY2tzIiwidmlld0NhbGxiYWNrcyIsIl9jb250cm9sbGVyQ2FsbGJhY2tzIiwiY29udHJvbGxlckNhbGxiYWNrcyIsIl9tb2RlbHMiLCJtb2RlbHMiLCJfdmlld3MiLCJ2aWV3cyIsIl9jb250cm9sbGVycyIsImNvbnRyb2xsZXJzIiwiX3JvdXRlcnMiLCJyb3V0ZXJzIiwiX3JvdXRlckV2ZW50cyIsInJvdXRlckV2ZW50cyIsIl9yb3V0ZXJDYWxsYmFja3MiLCJyb3V0ZXJDYWxsYmFja3MiLCJfZW1pdHRlckV2ZW50cyIsImVtaXR0ZXJFdmVudHMiLCJfbW9kZWxFdmVudHMiLCJtb2RlbEV2ZW50cyIsIl92aWV3RXZlbnRzIiwidmlld0V2ZW50cyIsIl9jb250cm9sbGVyRXZlbnRzIiwiY29udHJvbGxlckV2ZW50cyIsImVuYWJsZU1vZGVsRXZlbnRzIiwiZGlzYWJsZU1vZGVsRXZlbnRzIiwiZW5hYmxlVmlld0V2ZW50cyIsImRpc2FibGVWaWV3RXZlbnRzIiwiZW5hYmxlQ29udHJvbGxlckV2ZW50cyIsImRpc2FibGVDb250cm9sbGVyRXZlbnRzIiwiZW5hYmxlRW1pdHRlckV2ZW50cyIsImRpc2FibGVFbWl0dGVyRXZlbnRzIiwiZW5hYmxlUm91dGVyRXZlbnRzIiwiZGlzYWJsZVJvdXRlckV2ZW50cyIsIlJvdXRlciIsInJvdXRlIiwiX2hhc2giLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhhc2giLCJwb3AiLCJwYXRobmFtZSIsIl9yb3V0ZXMiLCJyb3V0ZXMiLCJfY29udHJvbGxlciIsImNvbnRyb2xsZXIiLCJfcHJldmlvdXNVUkwiLCJwcmV2aW91c1VSTCIsIl9jdXJyZW50VVJMIiwiY3VycmVudFVSTCIsImZyYWdtZW50SURSZWdFeHAiLCJmcmFnbWVudE5hbWVSZWdFeHAiLCJlbmFibGVFdmVudHMiLCJlbmFibGVSb3V0ZXMiLCJyb3V0ZUNoYW5nZSIsImRpc2FibGVFdmVudHMiLCJkaXNhYmxlUm91dGVzIiwicm91dGVJbmRleCIsIm9yaWdpbmFsUm91dGVzIiwicm91dGVQYXRoIiwicm91dGVDYWxsYmFjayIsIm5hdmlnYXRlRW1pdHRlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZmlsdGVyIiwicm91dGVDb250cm9sbGVyRGF0YSIsInJvdXRlclBhdGgiLCJyb3V0ZXJDb250cm9sbGVyIiwidW5kZWZpbmVkIiwicmVwbGFjZSIsInRlc3QiLCJocmVmIiwicm91dGVDb250cm9sbGVyTmFtZSIsInJvdXRlQ29udHJvbGxlciIsIm5hdmlnYXRlRW1pdHRlckRhdGEiLCJlcnJvciIsIm5hdmlnYXRlIiwicGF0aCJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSUEsR0FBRyxHQUFHQSxHQUFHLElBQUksRUFBakI7QUNBQUEsR0FBRyxDQUFDQyxTQUFKLEdBQWdCLEVBQWhCO0FBQ0FELEdBQUcsQ0FBQ0UsS0FBSixHQUFZRixHQUFHLENBQUNDLFNBQWhCO0FDREFELEdBQUcsQ0FBQ0MsU0FBSixDQUFjRSxNQUFkLEdBQXVCLEVBQXZCO0FBQ0FILEdBQUcsQ0FBQ0UsS0FBSixDQUFVRSxFQUFWLEdBQWVKLEdBQUcsQ0FBQ0MsU0FBSixDQUFjRSxNQUE3QjtBQ0RBSCxH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V0FBS2xRLElBQUwsQ0FDRXFQLGVBQWUsQ0FBQ2pRLElBRGxCLEVBRUVpUSxlQUFlLENBQUN2SSxRQUFoQixFQUZGO0FBSUFtSixNQUFBQSxlQUFlLENBQUNaLGVBQWUsQ0FBQ3ZJLFFBQWhCLEVBQUQsQ0FBZjtBQUNELEtBbEJELENBa0JFLE9BQU1xSixLQUFOLEVBQWE7QUFDYixZQUFNLHdCQUFOO0FBQ0Q7QUFDRjs7QUFDREMsRUFBQUEsUUFBUSxDQUFDQyxJQUFELEVBQU87QUFDYnhDLElBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsSUFBaEIsR0FBdUJzQyxJQUF2QjtBQUNEOztBQS9KaUMsQ0FBcEMiLCJmaWxlIjoiYnJvd3Nlci9tdmMtZnJhbWV3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE1WQyA9IE1WQyB8fCB7fVxyXG4iLCJNVkMuQ29uc3RhbnRzID0ge31cbk1WQy5DT05TVCA9IE1WQy5Db25zdGFudHNcbiIsIk1WQy5FdmVudHMgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfZXZlbnRzKCkge1xyXG4gICAgdGhpcy5ldmVudHMgPSAodGhpcy5ldmVudHMpXHJcbiAgICAgID8gdGhpcy5ldmVudHNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzXHJcbiAgfVxyXG4gIGV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSkgeyByZXR1cm4gdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gfHwge30gfVxyXG4gIGV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIHJldHVybiAoZXZlbnRDYWxsYmFjay5uYW1lLmxlbmd0aClcclxuICAgICAgPyBldmVudENhbGxiYWNrLm5hbWVcclxuICAgICAgOiAnYW5vbnltb3VzRnVuY3Rpb24nXHJcbiAgfVxyXG4gIGV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpIHtcclxuICAgIHJldHVybiBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gfHwgW11cclxuICB9XHJcbiAgb24oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKSB7XHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja3MgPSB0aGlzLmV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSlcclxuICAgIGxldCBldmVudENhbGxiYWNrTmFtZSA9IHRoaXMuZXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgIGxldCBldmVudENhbGxiYWNrR3JvdXAgPSB0aGlzLmV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpXHJcbiAgICBldmVudENhbGxiYWNrR3JvdXAucHVzaChldmVudENhbGxiYWNrKVxyXG4gICAgZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdID0gZXZlbnRDYWxsYmFja0dyb3VwXHJcbiAgICB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSA9IGV2ZW50Q2FsbGJhY2tzXHJcbiAgfVxyXG4gIG9mZigpIHtcclxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrTmFtZSA9IHRoaXMuZXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1bZXZlbnRDYWxsYmFja05hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICB9XHJcbiAgZW1pdChldmVudE5hbWUsIGV2ZW50RGF0YSkge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5ldmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBmb3IobGV0IFtldmVudENhbGxiYWNrR3JvdXBOYW1lLCBldmVudENhbGxiYWNrR3JvdXBdIG9mIE9iamVjdC5lbnRyaWVzKGV2ZW50Q2FsbGJhY2tzKSkge1xyXG4gICAgICBmb3IobGV0IGV2ZW50Q2FsbGJhY2sgb2YgZXZlbnRDYWxsYmFja0dyb3VwKSB7XHJcbiAgICAgICAgbGV0IGFkZGl0aW9uYWxBcmd1bWVudHMgPSBPYmplY3QudmFsdWVzKGFyZ3VtZW50cykuc3BsaWNlKDIpXHJcbiAgICAgICAgZXZlbnRDYWxsYmFjayhldmVudERhdGEsIC4uLmFkZGl0aW9uYWxBcmd1bWVudHMpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiTVZDLlRlbXBsYXRlcyA9IHtcclxuICBPYmplY3RRdWVyeVN0cmluZ0Zvcm1hdEludmFsaWRSb290OiBmdW5jdGlvbiBPYmplY3RRdWVyeVN0cmluZ0Zvcm1hdEludmFsaWQoZGF0YSkge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgJ09iamVjdCBRdWVyeSBcInN0cmluZ1wiIHByb3BlcnR5IG11c3QgYmUgZm9ybWF0dGVkIHRvIGZpcnN0IGluY2x1ZGUgXCJbQF1cIi4nXHJcbiAgICBdLmpvaW4oJ1xcbicpXHJcbiAgfSxcclxuICBEYXRhU2NoZW1hTWlzbWF0Y2g6IGZ1bmN0aW9uIERhdGFTY2hlbWFNaXNtYXRjaChkYXRhKSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBgRGF0YSBhbmQgU2NoZW1hIHByb3BlcnRpZXMgZG8gbm90IG1hdGNoLmBcclxuICAgIF0uam9pbignXFxuJylcclxuICB9LFxyXG4gIERhdGFGdW5jdGlvbkludmFsaWQ6IGZ1bmN0aW9uIERhdGFGdW5jdGlvbkludmFsaWQoZGF0YSkge1xyXG4gICAgW1xyXG4gICAgICBgTW9kZWwgRGF0YSBwcm9wZXJ0eSB0eXBlIFwiRnVuY3Rpb25cIiBpcyBub3QgdmFsaWQuYFxyXG4gICAgXS5qb2luKCdcXG4nKVxyXG4gIH0sXHJcbiAgRGF0YVVuZGVmaW5lZDogZnVuY3Rpb24gRGF0YVVuZGVmaW5lZChkYXRhKSB7XHJcbiAgICBbXHJcbiAgICAgIGBNb2RlbCBEYXRhIHByb3BlcnR5IHVuZGVmaW5lZC5gXHJcbiAgICBdLmpvaW4oJ1xcbicpXHJcbiAgfSxcclxuICBTY2hlbWFVbmRlZmluZWQ6IGZ1bmN0aW9uIFNjaGVtYVVuZGVmaW5lZChkYXRhKSB7XHJcbiAgICBbXHJcbiAgICAgIGBNb2RlbCBcIlNjaGVtYVwiIHVuZGVmaW5lZC5gXHJcbiAgICBdLmpvaW4oJ1xcbicpXHJcbiAgfSxcclxufVxyXG5NVkMuVE1QTCA9IE1WQy5UZW1wbGF0ZXNcclxuIiwiTVZDLlV0aWxzID0ge31cclxuIiwiTVZDLlV0aWxzLmlzQXJyYXkgPSBmdW5jdGlvbiBpc0FycmF5KG9iamVjdCkgeyByZXR1cm4gQXJyYXkuaXNBcnJheShvYmplY3QpIH1cclxuTVZDLlV0aWxzLmlzT2JqZWN0ID0gZnVuY3Rpb24gaXNPYmplY3Qob2JqZWN0KSB7XHJcbiAgcmV0dXJuICghQXJyYXkuaXNBcnJheShvYmplY3QpKVxyXG4gICAgPyB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0J1xyXG4gICAgOiBmYWxzZVxyXG59XHJcbk1WQy5VdGlscy5pc0VxdWFsVHlwZSA9IGZ1bmN0aW9uIGlzRXF1YWxUeXBlKHZhbHVlQSwgdmFsdWVCKSB7IHJldHVybiB2YWx1ZUEgPT09IHZhbHVlQiB9XHJcbk1WQy5VdGlscy5pc0hUTUxFbGVtZW50ID0gZnVuY3Rpb24gaXNIVE1MRWxlbWVudChvYmplY3QpIHtcclxuICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcclxufVxyXG4iLCJNVkMuVXRpbHMudHlwZU9mID0gIGZ1bmN0aW9uIHR5cGVPZihkYXRhKSB7XHJcbiAgc3dpdGNoKHR5cGVvZiBkYXRhKSB7XHJcbiAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICBsZXQgX29iamVjdFxyXG4gICAgICBpZihNVkMuVXRpbHMuaXNBcnJheShkYXRhKSkge1xyXG4gICAgICAgIC8vIEFycmF5XHJcbiAgICAgICAgcmV0dXJuICdhcnJheSdcclxuICAgICAgfSBlbHNlIGlmKFxyXG4gICAgICAgIE1WQy5VdGlscy5pc09iamVjdChkYXRhKVxyXG4gICAgICApIHtcclxuICAgICAgICAvLyBPYmplY3RcclxuICAgICAgICByZXR1cm4gJ29iamVjdCdcclxuICAgICAgfSBlbHNlIGlmKFxyXG4gICAgICAgIGRhdGEgPT09IG51bGxcclxuICAgICAgKSB7XHJcbiAgICAgICAgLy8gTnVsbFxyXG4gICAgICAgIHJldHVybiAnbnVsbCdcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gX29iamVjdFxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnc3RyaW5nJzpcclxuICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICBjYXNlICdib29sZWFuJzpcclxuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XHJcbiAgICBjYXNlICdmdW5jdGlvbic6XHJcbiAgICAgIHJldHVybiB0eXBlb2YgZGF0YVxyXG4gICAgICBicmVha1xyXG4gIH1cclxufVxyXG4iLCJNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0ID0gZnVuY3Rpb24gYWRkUHJvcGVydGllc1RvT2JqZWN0KCkge1xyXG4gIGxldCB0YXJnZXRPYmplY3RcclxuICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgY2FzZSAyOlxyXG4gICAgICBsZXQgcHJvcGVydGllcyA9IGFyZ3VtZW50c1swXVxyXG4gICAgICB0YXJnZXRPYmplY3QgPSBhcmd1bWVudHNbMV1cclxuICAgICAgZm9yKGxldCBbcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwcm9wZXJ0aWVzKSkge1xyXG4gICAgICAgIHRhcmdldE9iamVjdFtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZVxyXG4gICAgICB9XHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlIDM6XHJcbiAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgbGV0IHByb3BlcnR5VmFsdWUgPSBhcmd1bWVudHNbMV1cclxuICAgICAgdGFyZ2V0T2JqZWN0ID0gYXJndW1lbnRzWzJdXHJcbiAgICAgIHRhcmdldE9iamVjdFtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZVxyXG4gICAgICBicmVha1xyXG4gIH1cclxuICByZXR1cm4gdGFyZ2V0T2JqZWN0XHJcbn1cclxuIiwiTVZDLlV0aWxzLm9iamVjdFF1ZXJ5ID0gZnVuY3Rpb24gb2JqZWN0UXVlcnkoXHJcbiAgc3RyaW5nLFxyXG4gIGNvbnRleHRcclxuKSB7XHJcbiAgbGV0IHN0cmluZ0RhdGEgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VOb3RhdGlvbihzdHJpbmcpXHJcbiAgaWYoc3RyaW5nRGF0YVswXSA9PT0gJ0AnKSBzdHJpbmdEYXRhLnNwbGljZSgwLCAxKVxyXG4gIGlmKCFzdHJpbmdEYXRhLmxlbmd0aCkgcmV0dXJuIGNvbnRleHRcclxuICBjb250ZXh0ID0gKE1WQy5VdGlscy5pc09iamVjdChjb250ZXh0KSlcclxuICAgID8gT2JqZWN0LmVudHJpZXMoY29udGV4dClcclxuICAgIDogY29udGV4dFxyXG4gIHJldHVybiBzdHJpbmdEYXRhLnJlZHVjZSgob2JqZWN0LCBmcmFnbWVudCwgZnJhZ21lbnRJbmRleCwgZnJhZ21lbnRzKSA9PiB7XHJcbiAgICBsZXQgcHJvcGVydGllcyA9IFtdXHJcbiAgICBmcmFnbWVudCA9IE1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZUZyYWdtZW50KGZyYWdtZW50KVxyXG4gICAgZm9yKGxldCBbcHJvcGVydHlLZXksIHByb3BlcnR5VmFsdWVdIG9mIG9iamVjdCkge1xyXG4gICAgICBpZihwcm9wZXJ0eUtleS5tYXRjaChmcmFnbWVudCkpIHtcclxuICAgICAgICBpZihmcmFnbWVudEluZGV4ID09PSBmcmFnbWVudHMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMuY29uY2F0KFtbcHJvcGVydHlLZXksIHByb3BlcnR5VmFsdWVdXSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMuY29uY2F0KE9iamVjdC5lbnRyaWVzKHByb3BlcnR5VmFsdWUpKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgb2JqZWN0ID0gcHJvcGVydGllc1xyXG4gICAgcmV0dXJuIG9iamVjdFxyXG4gIH0sIGNvbnRleHQpXHJcbn1cclxuTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlTm90YXRpb24gPSBmdW5jdGlvbiBwYXJzZU5vdGF0aW9uKHN0cmluZykge1xyXG4gIGlmKFxyXG4gICAgc3RyaW5nLmNoYXJBdCgwKSA9PT0gJ1snICYmXHJcbiAgICBzdHJpbmcuY2hhckF0KHN0cmluZy5sZW5ndGggLSAxKSA9PSAnXSdcclxuICApIHtcclxuICAgIHN0cmluZyA9IHN0cmluZ1xyXG4gICAgICAuc2xpY2UoMSwgLTEpXHJcbiAgICAgIC5zcGxpdCgnXVsnKVxyXG4gIH0gZWxzZSB7XHJcbiAgICBzdHJpbmcgPSBzdHJpbmdcclxuICAgICAgLnNwbGl0KCcuJylcclxuICB9XHJcbiAgcmV0dXJuIHN0cmluZ1xyXG59XHJcbk1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZUZyYWdtZW50ID0gZnVuY3Rpb24gcGFyc2VGcmFnbWVudChmcmFnbWVudCkge1xyXG4gIGlmKFxyXG4gICAgZnJhZ21lbnQuY2hhckF0KDApID09PSAnLycgJiZcclxuICAgIGZyYWdtZW50LmNoYXJBdChmcmFnbWVudC5sZW5ndGggLSAxKSA9PSAnLydcclxuICApIHtcclxuICAgIGZyYWdtZW50ID0gZnJhZ21lbnQuc2xpY2UoMSwgLTEpXHJcbiAgICBmcmFnbWVudCA9IG5ldyBSZWdFeHAoJ14nLmNvbmNhdChmcmFnbWVudCwgJyQnKSlcclxuICB9XHJcbiAgcmV0dXJuIGZyYWdtZW50XHJcbn1cclxuIiwiTVZDLlV0aWxzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMgPSBmdW5jdGlvbiB0b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKFxyXG4gIHRvZ2dsZU1ldGhvZCxcclxuICBldmVudHMsXHJcbiAgdGFyZ2V0T2JqZWN0cyxcclxuICBjYWxsYmFja3NcclxuKSB7XHJcbiAgZm9yKGxldCBbZXZlbnRTZXR0aW5ncywgZXZlbnRDYWxsYmFja05hbWVdIG9mIE9iamVjdC5lbnRyaWVzKGV2ZW50cykpIHtcclxuICAgIGxldCBldmVudERhdGEgPSBldmVudFNldHRpbmdzLnNwbGl0KCcgJylcclxuICAgIGxldCBldmVudFRhcmdldFNldHRpbmdzID0gZXZlbnREYXRhWzBdXHJcbiAgICBsZXQgZXZlbnROYW1lID0gZXZlbnREYXRhWzFdXHJcbiAgICBsZXQgZXZlbnRUYXJnZXRzID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5KFxyXG4gICAgICBldmVudFRhcmdldFNldHRpbmdzLFxyXG4gICAgICB0YXJnZXRPYmplY3RzXHJcbiAgICApXHJcbiAgICBldmVudFRhcmdldHMgPSAoIU1WQy5VdGlscy5pc0FycmF5KGV2ZW50VGFyZ2V0cykpXHJcbiAgICAgID8gW1snQCcsIGV2ZW50VGFyZ2V0c11dXHJcbiAgICAgIDogZXZlbnRUYXJnZXRzXHJcbiAgICBmb3IobGV0IFtldmVudFRhcmdldE5hbWUsIGV2ZW50VGFyZ2V0XSBvZiBldmVudFRhcmdldHMpIHtcclxuICAgICAgbGV0IGV2ZW50TWV0aG9kTmFtZSA9ICh0b2dnbGVNZXRob2QgPT09ICdvbicpXHJcbiAgICAgID8gKFxyXG4gICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QgfHxcclxuICAgICAgICAoXHJcbiAgICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XHJcbiAgICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIERvY3VtZW50XHJcbiAgICAgICAgKVxyXG4gICAgICApID8gJ2FkZEV2ZW50TGlzdGVuZXInXHJcbiAgICAgICAgOiAnb24nXHJcbiAgICAgIDogKFxyXG4gICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QgfHxcclxuICAgICAgICAoXHJcbiAgICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XHJcbiAgICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIERvY3VtZW50XHJcbiAgICAgICAgKVxyXG4gICAgICApID8gJ3JlbW92ZUV2ZW50TGlzdGVuZXInXHJcbiAgICAgICAgOiAnb2ZmJ1xyXG4gICAgICBsZXQgZXZlbnRDYWxsYmFjayA9IE1WQy5VdGlscy5vYmplY3RRdWVyeShcclxuICAgICAgICBldmVudENhbGxiYWNrTmFtZSxcclxuICAgICAgICBjYWxsYmFja3NcclxuICAgICAgKVswXVsxXVxyXG4gICAgICBpZihldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XHJcbiAgICAgICAgZm9yKGxldCBfZXZlbnRUYXJnZXQgb2YgZXZlbnRUYXJnZXQpIHtcclxuICAgICAgICAgIF9ldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZihldmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KXtcclxuICAgICAgICBldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBldmVudFRhcmdldFtldmVudE1ldGhvZE5hbWVdKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5NVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIGJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMoKSB7XHJcbiAgdGhpcy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKCdvbicsIC4uLmFyZ3VtZW50cylcclxufVxyXG5NVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMgPSBmdW5jdGlvbiB1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cygpIHtcclxuICB0aGlzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoJ29mZicsIC4uLmFyZ3VtZW50cylcclxufVxyXG4iLCJNVkMuVXRpbHMudmFsaWRhdGVEYXRhU2NoZW1hID0gZnVuY3Rpb24gdmFsaWRhdGVEYXRhU2NoZW1hKGRhdGEsIHNjaGVtYSkge1xyXG4gIGlmKHNjaGVtYSkge1xyXG4gICAgc3dpdGNoKE1WQy5VdGlscy50eXBlT2YoZGF0YSkpIHtcclxuICAgICAgY2FzZSAnYXJyYXknOlxyXG4gICAgICAgIGxldCBhcnJheSA9IFtdXHJcbiAgICAgICAgc2NoZW1hID0gKE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgID8gc2NoZW1hKClcclxuICAgICAgICAgIDogc2NoZW1hXHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBNVkMuVXRpbHMuaXNFcXVhbFR5cGUoXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSxcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihhcnJheSlcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHNjaGVtYS5uYW1lKVxyXG4gICAgICAgICAgZm9yKGxldCBbYXJyYXlLZXksIGFycmF5VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2goXHJcbiAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZURhdGFTY2hlbWEoYXJyYXlWYWx1ZSlcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyYXlcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICAgIGxldCBvYmplY3QgPSB7fVxyXG4gICAgICAgIHNjaGVtYSA9IChNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSkgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICA/IHNjaGVtYSgpXHJcbiAgICAgICAgICA6IHNjaGVtYVxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgTVZDLlV0aWxzLmlzRXF1YWxUeXBlKFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSksXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yob2JqZWN0KVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coc2NoZW1hLm5hbWUpXHJcbiAgICAgICAgICBmb3IobGV0IFtvYmplY3RLZXksIG9iamVjdFZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkYXRhKSkge1xyXG4gICAgICAgICAgICBvYmplY3Rbb2JqZWN0S2V5XSA9IHRoaXMudmFsaWRhdGVEYXRhU2NoZW1hKG9iamVjdFZhbHVlLCBzY2hlbWFbb2JqZWN0S2V5XSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9iamVjdFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgICAgIHNjaGVtYSA9IChNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSkgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICA/IHNjaGVtYSgpXHJcbiAgICAgICAgICA6IHNjaGVtYVxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgTVZDLlV0aWxzLmlzRXF1YWxUeXBlKFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKHNjaGVtYSksXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2YoZGF0YSlcclxuICAgICAgICAgIClcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHNjaGVtYS5uYW1lKVxyXG4gICAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhyb3cgTVZDLlRNUExcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnbnVsbCc6XHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBNVkMuVXRpbHMuaXNFcXVhbFR5cGUoXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSxcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihkYXRhKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgcmV0dXJuIGRhdGFcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgICAgICB0aHJvdyBNVkMuVE1QTFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgICB0aHJvdyBNVkMuVE1QTFxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIHRocm93IE1WQy5UTVBMXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5DaGFubmVscyA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9jaGFubmVscygpIHtcclxuICAgIHRoaXMuY2hhbm5lbHMgPSAodGhpcy5jaGFubmVscylcclxuICAgICAgPyB0aGlzLmNoYW5uZWxzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmNoYW5uZWxzXHJcbiAgfVxyXG4gIGNoYW5uZWwoY2hhbm5lbE5hbWUpIHtcclxuICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXSA9ICh0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0pXHJcbiAgICAgID8gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgIDogbmV3IE1WQy5DaGFubmVscy5DaGFubmVsKClcclxuICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbiAgb2ZmKGNoYW5uZWxOYW1lKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5DaGFubmVscy5DaGFubmVsID0gY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX3Jlc3BvbnNlcygpIHtcclxuICAgIHRoaXMucmVzcG9uc2VzID0gKHRoaXMucmVzcG9uc2VzKVxyXG4gICAgICA/IHRoaXMucmVzcG9uc2VzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLnJlc3BvbnNlc1xyXG4gIH1cclxuICByZXNwb25zZShyZXNwb25zZU5hbWUsIHJlc3BvbnNlQ2FsbGJhY2spIHtcclxuICAgIGlmKHJlc3BvbnNlQ2FsbGJhY2spIHtcclxuICAgICAgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0gPSByZXNwb25zZUNhbGxiYWNrXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlXVxyXG4gICAgfVxyXG4gIH1cclxuICByZXF1ZXN0KHJlc3BvbnNlTmFtZSwgcmVxdWVzdERhdGEpIHtcclxuICAgIGlmKHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXShyZXF1ZXN0RGF0YSlcclxuICAgIH1cclxuICB9XHJcbiAgb2ZmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yKGxldCBbcmVzcG9uc2VOYW1lXSBvZiBPYmplY3Qua2V5cyh0aGlzLl9yZXNwb25zZXMpKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiTVZDLkJhc2UgPSBjbGFzcyBleHRlbmRzIE1WQy5FdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzLCBjb25maWd1cmF0aW9uKSB7XHJcbiAgICBzdXBlcigpXHJcbiAgICBpZihjb25maWd1cmF0aW9uKSB0aGlzLl9jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvblxyXG4gICAgaWYoc2V0dGluZ3MpIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcclxuICB9XHJcbiAgZ2V0IF9jb25maWd1cmF0aW9uKCkge1xyXG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gKHRoaXMuY29uZmlndXJhdGlvbilcclxuICAgICAgPyB0aGlzLmNvbmZpZ3VyYXRpb25cclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblxyXG4gIH1cclxuICBzZXQgX2NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikgeyB0aGlzLmNvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uIH1cclxuICBnZXQgX3NldHRpbmdzKCkge1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9ICh0aGlzLnNldHRpbmdzKVxyXG4gICAgICA/IHRoaXMuc2V0dGluZ3NcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3NcclxuICB9XHJcbiAgc2V0IF9zZXR0aW5ncyhzZXR0aW5ncykge1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXHJcbiAgICAgIHNldHRpbmdzLCB0aGlzLl9zZXR0aW5nc1xyXG4gICAgKVxyXG4gIH1cclxuICBnZXQgX2VtaXR0ZXJzKCkge1xyXG4gICAgdGhpcy5lbWl0dGVycyA9ICh0aGlzLmVtaXR0ZXJzKVxyXG4gICAgICA/IHRoaXMuZW1pdHRlcnNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlcnNcclxuICB9XHJcbiAgc2V0IF9lbWl0dGVycyhlbWl0dGVycykge1xyXG4gICAgdGhpcy5lbWl0dGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXHJcbiAgICAgIGVtaXR0ZXJzLCB0aGlzLl9lbWl0dGVyc1xyXG4gICAgKVxyXG4gIH1cclxufVxyXG4iLCJNVkMuU2VydmljZSA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IF9kZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuZGVmYXVsdHMgfHwge1xuICAgIGNvbnRlbnRUeXBlOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30sXG4gICAgcmVzcG9uc2VUeXBlOiAnanNvbicsXG4gIH0gfVxuICBnZXQgX3Jlc3BvbnNlVHlwZXMoKSB7IHJldHVybiBbJycsICdhcnJheWJ1ZmZlcicsICdibG9iJywgJ2RvY3VtZW50JywgJ2pzb24nLCAndGV4dCddIH1cbiAgZ2V0IF9yZXNwb25zZVR5cGUoKSB7IHJldHVybiB0aGlzLnJlc3BvbnNlVHlwZSB9XG4gIHNldCBfcmVzcG9uc2VUeXBlKHJlc3BvbnNlVHlwZSkge1xuICAgIHRoaXMuX3hoci5yZXNwb25zZVR5cGUgPSB0aGlzLl9yZXNwb25zZVR5cGVzLmZpbmQoXG4gICAgICAocmVzcG9uc2VUeXBlSXRlbSkgPT4gcmVzcG9uc2VUeXBlSXRlbSA9PT0gcmVzcG9uc2VUeXBlXG4gICAgKSB8fCB0aGlzLl9kZWZhdWx0cy5yZXNwb25zZVR5cGVcbiAgfVxuICBnZXQgX3R5cGUoKSB7IHJldHVybiB0aGlzLnR5cGUgfVxuICBzZXQgX3R5cGUodHlwZSkgeyB0aGlzLnR5cGUgPSB0eXBlIH1cbiAgZ2V0IF91cmwoKSB7IHJldHVybiB0aGlzLnVybCB9XG4gIHNldCBfdXJsKHVybCkgeyB0aGlzLnVybCA9IHVybCB9XG4gIGdldCBfaGVhZGVycygpIHsgcmV0dXJuIHRoaXMuaGVhZGVycyB8fCBbXSB9XG4gIHNldCBfaGVhZGVycyhoZWFkZXJzKSB7XG4gICAgdGhpcy5faGVhZGVycy5sZW5ndGggPSAwXG4gICAgZm9yKGxldCBoZWFkZXIgb2YgaGVhZGVycykge1xuICAgICAgdGhpcy5feGhyLnNldFJlcXVlc3RIZWFkZXIoe2hlYWRlcn1bMF0sIHtoZWFkZXJ9WzFdKVxuICAgICAgdGhpcy5faGVhZGVycy5wdXNoKGhlYWRlcilcbiAgICB9XG4gIH1cbiAgZ2V0IF9kYXRhKCkgeyByZXR1cm4gdGhpcy5kYXRhIH1cbiAgc2V0IF9kYXRhKGRhdGEpIHsgdGhpcy5kYXRhID0gZGF0YSB9XG4gIGdldCBfeGhyKCkge1xuICAgIHRoaXMueGhyID0gKHRoaXMueGhyKVxuICAgICAgPyB0aGlzLnhoclxuICAgICAgOiBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHJldHVybiB0aGlzLnhoclxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICByZXF1ZXN0KGRhdGEpIHtcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLmRhdGEgfHwgbnVsbFxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZih0aGlzLl94aHIuc3RhdHVzID09PSAyMDApIHRoaXMuX3hoci5hYm9ydCgpXG4gICAgICB0aGlzLl94aHIub3Blbih0aGlzLnR5cGUsIHRoaXMudXJsKVxuICAgICAgdGhpcy5faGVhZGVycyA9IHRoaXMuc2V0dGluZ3MuaGVhZGVycyB8fCBbdGhpcy5fZGVmYXVsdHMuY29udGVudFR5cGVdXG4gICAgICB0aGlzLl94aHIub25sb2FkID0gcmVzb2x2ZVxuICAgICAgdGhpcy5feGhyLm9uZXJyb3IgPSByZWplY3RcbiAgICAgIHRoaXMuX3hoci5zZW5kKGRhdGEpXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHRoaXMuZW1pdCgneGhyOnJlc29sdmUnLCB7XG4gICAgICAgIG5hbWU6ICd4aHI6cmVzb2x2ZScsXG4gICAgICAgIGRhdGE6IHJlc3BvbnNlLmN1cnJlbnRUYXJnZXQsXG4gICAgICB9KVxuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgIXRoaXMuZW5hYmxlZCAmJlxuICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgaWYoc2V0dGluZ3MudHlwZSkgdGhpcy5fdHlwZSA9IHNldHRpbmdzLnR5cGVcbiAgICAgIGlmKHNldHRpbmdzLnVybCkgdGhpcy5fdXJsID0gc2V0dGluZ3MudXJsXG4gICAgICBpZihzZXR0aW5ncy5kYXRhKSB0aGlzLl9kYXRhID0gc2V0dGluZ3MuZGF0YSB8fCBudWxsXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnJlc3BvbnNlVHlwZSkgdGhpcy5fcmVzcG9uc2VUeXBlID0gdGhpcy5fc2V0dGluZ3MucmVzcG9uc2VUeXBlXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHRoaXMuZW5hYmxlZCAmJlxuICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgZGVsZXRlIHRoaXMuX3R5cGVcbiAgICAgIGRlbGV0ZSB0aGlzLl91cmxcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhXG4gICAgICBkZWxldGUgdGhpcy5faGVhZGVyc1xuICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlVHlwZVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICB9XG59XG4iLCJNVkMuTW9kZWwgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfaXNTZXR0aW5nKCkgeyByZXR1cm4gdGhpcy5pc1NldHRpbmcgfVxuICBzZXQgX2lzU2V0dGluZyhpc1NldHRpbmcpIHsgdGhpcy5pc1NldHRpbmcgPSBpc1NldHRpbmcgfVxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5fZGVmYXVsdHMgfVxuICBzZXQgX2RlZmF1bHRzKGRlZmF1bHRzKSB7XG4gICAgdGhpcy5kZWZhdWx0cyA9IGRlZmF1bHRzXG4gICAgdGhpcy5zZXQodGhpcy5kZWZhdWx0cylcbiAgfVxuICBnZXQgX3NjaGVtYSgpIHsgcmV0dXJuIHRoaXMuX3NjaGVtYSB9XG4gIHNldCBfc2NoZW1hKHNjaGVtYSkgeyB0aGlzLnNjaGVtYSA9IHNjaGVtYSB9XG4gIGdldCBfaGlzdGlvZ3JhbSgpIHsgcmV0dXJuIHRoaXMuaGlzdGlvZ3JhbSB8fCB7XG4gICAgbGVuZ3RoOiAxXG4gIH0gfVxuICBzZXQgX2hpc3Rpb2dyYW0oaGlzdGlvZ3JhbSkge1xuICAgIHRoaXMuaGlzdGlvZ3JhbSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB0aGlzLl9oaXN0aW9ncmFtLFxuICAgICAgaGlzdGlvZ3JhbVxuICAgIClcbiAgfVxuICBnZXQgX2hpc3RvcnkoKSB7XG4gICAgdGhpcy5oaXN0b3J5ID0gKHRoaXMuaGlzdG9yeSlcbiAgICAgID8gdGhpcy5oaXN0b3J5XG4gICAgICA6IFtdXG4gICAgcmV0dXJuIHRoaXMuaGlzdG9yeVxuICB9XG4gIHNldCBfaGlzdG9yeShkYXRhKSB7XG4gICAgaWYoXG4gICAgICBPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGlmKHRoaXMuX2hpc3Rpb2dyYW0ubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudW5zaGlmdCh0aGlzLnBhcnNlKGRhdGEpKVxuICAgICAgICB0aGlzLl9oaXN0b3J5LnNwbGljZSh0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aClcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IF9kYXRhKCkge1xuICAgIHRoaXMuZGF0YSA9ICAodGhpcy5kYXRhKVxuICAgICAgPyB0aGlzLmRhdGFcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5kYXRhXG4gIH1cbiAgZ2V0IF9kYXRhRXZlbnRzKCkge1xuICAgIHRoaXMuZGF0YUV2ZW50cyA9ICh0aGlzLmRhdGFFdmVudHMpXG4gICAgICA/IHRoaXMuZGF0YUV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmRhdGFFdmVudHNcbiAgfVxuICBzZXQgX2RhdGFFdmVudHMoZGF0YUV2ZW50cykge1xuICAgIHRoaXMuZGF0YUV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBkYXRhRXZlbnRzLCB0aGlzLl9kYXRhRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfZGF0YUNhbGxiYWNrcygpIHtcbiAgICB0aGlzLmRhdGFDYWxsYmFja3MgPSAodGhpcy5kYXRhQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLmRhdGFDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5kYXRhQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9kYXRhQ2FsbGJhY2tzKGRhdGFDYWxsYmFja3MpIHtcbiAgICB0aGlzLmRhdGFDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgZGF0YUNhbGxiYWNrcywgdGhpcy5fZGF0YUNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX3NlcnZpY2VzKCkge1xuICAgIHRoaXMuc2VydmljZXMgPSAgKHRoaXMuc2VydmljZXMpXG4gICAgICA/IHRoaXMuc2VydmljZXNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5zZXJ2aWNlc1xuICB9XG4gIHNldCBfc2VydmljZXMoc2VydmljZXMpIHtcbiAgICB0aGlzLnNlcnZpY2VzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHNlcnZpY2VzLCB0aGlzLl9zZXJ2aWNlc1xuICAgIClcbiAgfVxuICBnZXQgX3NlcnZpY2VFdmVudHMoKSB7XG4gICAgdGhpcy5zZXJ2aWNlRXZlbnRzID0gKHRoaXMuc2VydmljZUV2ZW50cylcbiAgICAgID8gdGhpcy5zZXJ2aWNlRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZUV2ZW50c1xuICB9XG4gIHNldCBfc2VydmljZUV2ZW50cyhzZXJ2aWNlRXZlbnRzKSB7XG4gICAgdGhpcy5zZXJ2aWNlRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHNlcnZpY2VFdmVudHMsIHRoaXMuX3NlcnZpY2VFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9zZXJ2aWNlQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuc2VydmljZUNhbGxiYWNrcyA9ICh0aGlzLnNlcnZpY2VDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnNlcnZpY2VDYWxsYmFja3NcbiAgfVxuICBzZXQgX3NlcnZpY2VDYWxsYmFja3Moc2VydmljZUNhbGxiYWNrcykge1xuICAgIHRoaXMuc2VydmljZUNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBzZXJ2aWNlQ2FsbGJhY2tzLCB0aGlzLl9zZXJ2aWNlQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICBlbmFibGVTZXJ2aWNlRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuc2VydmljZUV2ZW50cywgdGhpcy5zZXJ2aWNlcywgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVTZXJ2aWNlRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5zZXJ2aWNlRXZlbnRzLCB0aGlzLnNlcnZpY2VzLCB0aGlzLnNlcnZpY2VDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlRGF0YUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmRhdGFFdmVudHMsIHRoaXMsIHRoaXMuZGF0YUNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlRGF0YUV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuZGF0YUV2ZW50cywgdGhpcywgdGhpcy5kYXRhQ2FsbGJhY2tzKVxuICB9XG4gIGdldCgpIHtcbiAgICBsZXQgcHJvcGVydHkgPSBhcmd1bWVudHNbMF1cbiAgICByZXR1cm4gdGhpcy5fZGF0YVsnXycuY29uY2F0KHByb3BlcnR5KV1cbiAgfVxuICBzZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBpZihpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5faXNTZXR0aW5nID0gdHJ1ZVxuICAgICAgICAgIH0gZWxzZSBpZihpbmRleCA9PT0gKF9hcmd1bWVudHMubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2lzU2V0dGluZyA9IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDM6XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHZhciBzaWxlbnQgPSBhcmd1bWVudHNbMl1cbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICB1bnNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5fZGF0YSkpIHtcbiAgICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBzZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KSB7XG4gICAgaWYoIXRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXSkge1xuICAgICAgbGV0IGNvbnRleHQgPSB0aGlzXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhcbiAgICAgICAgdGhpcy5fZGF0YSxcbiAgICAgICAge1xuICAgICAgICAgIFsnXycuY29uY2F0KGtleSldOiB7XG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzW2tleV0gfSxcbiAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICAhc2lsZW50ICYmXG4gICAgICAgICAgICAgICAgIWNvbnRleHQuX2lzU2V0dGluZ1xuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBsZXQgc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3NldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgICAgICAgICAgICAgIGxldCBzZXRFdmVudE5hbWUgPSAnc2V0J1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICAgIHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBzZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gICAgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldID0gdmFsdWVcbiAgfVxuICB1bnNldERhdGFQcm9wZXJ0eShrZXkpIHtcbiAgICBsZXQgdW5zZXRWYWx1ZUV2ZW50TmFtZSA9IFsndW5zZXQnLCAnOicsIGtleV0uam9pbignJylcbiAgICBsZXQgdW5zZXRFdmVudE5hbWUgPSAndW5zZXQnXG4gICAgbGV0IHVuc2V0VmFsdWUgPSB0aGlzLl9kYXRhW2tleV1cbiAgICBkZWxldGUgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldXG4gICAgZGVsZXRlIHRoaXMuX2RhdGFba2V5XVxuICAgIHRoaXMuZW1pdChcbiAgICAgIHVuc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IHVuc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIClcbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldEV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfVxuICAgIClcbiAgfVxuICBwYXJzZShkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5fZGF0YVxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KE9iamVjdC5hc3NpZ24oe30sIGRhdGEpKSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuaGlzdGlvZ3JhbSkgdGhpcy5faGlzdGlvZ3JhbSA9IHRoaXMuc2V0dGluZ3MuaGlzdGlvZ3JhbVxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5lbWl0dGVycykgdGhpcy5fZW1pdHRlcnMgPSB0aGlzLnNldHRpbmdzLmVtaXR0ZXJzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnNlcnZpY2VzKSB0aGlzLl9zZXJ2aWNlcyA9IHRoaXMuc2V0dGluZ3Muc2VydmljZXNcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3Muc2VydmljZUNhbGxiYWNrcykgdGhpcy5fc2VydmljZUNhbGxiYWNrcyA9IHRoaXMuc2V0dGluZ3Muc2VydmljZUNhbGxiYWNrc1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5zZXJ2aWNlRXZlbnRzKSB0aGlzLl9zZXJ2aWNlRXZlbnRzID0gdGhpcy5zZXR0aW5ncy5zZXJ2aWNlRXZlbnRzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRhdGEpIHRoaXMuc2V0KHRoaXMuc2V0dGluZ3MuZGF0YSlcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGF0YUNhbGxiYWNrcykgdGhpcy5fZGF0YUNhbGxiYWNrcyA9IHRoaXMuc2V0dGluZ3MuZGF0YUNhbGxiYWNrc1xuICAgICAgaWYodGhpcy5zZXR0aW5ncy5kYXRhRXZlbnRzKSB0aGlzLl9kYXRhRXZlbnRzID0gdGhpcy5zZXR0aW5ncy5kYXRhRXZlbnRzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLnNjaGVtYSkgdGhpcy5fc2NoZW1hID0gdGhpcy5zZXR0aW5ncy5zY2hlbWFcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMpIHRoaXMuX2RlZmF1bHRzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0c1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMuc2VydmljZXMgJiZcbiAgICAgICAgdGhpcy5zZXJ2aWNlRXZlbnRzICYmXG4gICAgICAgIHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlU2VydmljZUV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5kYXRhRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZGF0YUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlRGF0YUV2ZW50cygpXG4gICAgICB9XG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5zZXJ2aWNlcyAmJlxuICAgICAgICB0aGlzLnNlcnZpY2VFdmVudHMgJiZcbiAgICAgICAgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlU2VydmljZUV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5kYXRhRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZGF0YUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZURhdGFFdmVudHMoKVxuICAgICAgfVxuICAgICAgZGVsZXRlIHRoaXMuX2hpc3Rpb2dyYW1cbiAgICAgIGRlbGV0ZSB0aGlzLl9zZXJ2aWNlc1xuICAgICAgZGVsZXRlIHRoaXMuX3NlcnZpY2VDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9zZXJ2aWNlRXZlbnRzXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YVxuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhRXZlbnRzXG4gICAgICBkZWxldGUgdGhpcy5fc2NoZW1hXG4gICAgICBkZWxldGUgdGhpcy5fZW1pdHRlcnNcbiAgICB9XG4gIH1cbn1cbiIsIk1WQy5FbWl0dGVyID0gY2xhc3MgZXh0ZW5kcyBNVkMuTW9kZWwge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxyXG4gICAgaWYodGhpcy5zZXR0aW5ncykge1xyXG4gICAgICBpZih0aGlzLnNldHRpbmdzLm5hbWUpIHRoaXMuX25hbWUgPSB0aGlzLnNldHRpbmdzLm5hbWVcclxuICAgIH1cclxuICB9XHJcbiAgZ2V0IF9uYW1lKCkgeyByZXR1cm4gdGhpcy5uYW1lIH1cclxuICBzZXQgX25hbWUobmFtZSkgeyB0aGlzLm5hbWUgPSBuYW1lIH1cclxuICBlbWlzc2lvbigpIHtcclxuICAgIGxldCBldmVudERhdGEgPSB7XHJcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcclxuICAgICAgZGF0YTogdGhpcy5kYXRhXHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgIHRoaXMubmFtZSxcclxuICAgICAgZXZlbnREYXRhXHJcbiAgICApXHJcbiAgICByZXR1cm4gZXZlbnREYXRhXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5FbWl0dGVycyA9IHt9XHJcbiIsIk1WQy5FbWl0dGVycy5OYXZpZ2F0ZUVtaXR0ZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5FbWl0dGVyIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICAgIHRoaXMuYWRkU2V0dGluZ3MoKVxyXG4gICAgdGhpcy5lbmFibGUoKVxyXG4gIH1cclxuICBhZGRTZXR0aW5ncygpIHtcclxuICAgIHRoaXMuX25hbWUgPSAnbmF2aWdhdGUnXHJcbiAgICB0aGlzLl9zY2hlbWEgPSB7XHJcbiAgICAgIG9sZFVSTDogU3RyaW5nLFxyXG4gICAgICBuZXdVUkw6IFN0cmluZyxcclxuICAgICAgY3VycmVudFJvdXRlOiBTdHJpbmcsXHJcbiAgICAgIGN1cnJlbnRDb250cm9sbGVyOiBTdHJpbmcsXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIk1WQy5WaWV3ID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgX2VsZW1lbnROYW1lKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudC50YWdOYW1lIH1cbiAgc2V0IF9lbGVtZW50TmFtZShlbGVtZW50TmFtZSkge1xuICAgIGlmKCF0aGlzLl9lbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50TmFtZSlcbiAgfVxuICBnZXQgX2VsZW1lbnQoKSB7IHJldHVybiB0aGlzLmVsZW1lbnQgfVxuICBzZXQgX2VsZW1lbnQoZWxlbWVudCkge1xuICAgIGlmKFxuICAgICAgZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICBlbGVtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRcbiAgICApIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICB9IGVsc2UgaWYodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQpXG4gICAgfVxuICAgIHRoaXMuZWxlbWVudE9ic2VydmVyLm9ic2VydmUodGhpcy5lbGVtZW50LCB7XG4gICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIH0pXG4gIH1cbiAgZ2V0IF9hdHRyaWJ1dGVzKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudC5hdHRyaWJ1dGVzIH1cbiAgc2V0IF9hdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHtcbiAgICBmb3IobGV0IFthdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKSkge1xuICAgICAgaWYodHlwZW9mIGF0dHJpYnV0ZVZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVLZXkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgX3VpKCkge1xuICAgIHRoaXMudWkgPSAodGhpcy51aSlcbiAgICAgID8gdGhpcy51aVxuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnVpXG4gIH1cbiAgc2V0IF91aSh1aSkge1xuICAgIGlmKCF0aGlzLl91aVsnJGVsZW1lbnQnXSkgdGhpcy5fdWlbJyRlbGVtZW50J10gPSB0aGlzLmVsZW1lbnRcbiAgICBmb3IobGV0IFt1aUtleSwgdWlWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXModWkpKSB7XG4gICAgICBpZih0eXBlb2YgdWlWYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fdWlbdWlLZXldID0gdGhpcy5fZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHVpVmFsdWUpXG4gICAgICB9IGVsc2UgaWYoXG4gICAgICAgIHVpVmFsdWUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxuICAgICAgICB1aVZhbHVlIGluc3RhbmNlb2YgRG9jdW1lbnRcbiAgICAgICkge1xuICAgICAgICB0aGlzLl91aVt1aUtleV0gPSB1aVZhbHVlXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfdWlFdmVudHMoKSB7IHJldHVybiB0aGlzLnVpRXZlbnRzIH1cbiAgc2V0IF91aUV2ZW50cyh1aUV2ZW50cykgeyB0aGlzLnVpRXZlbnRzID0gdWlFdmVudHMgfVxuICBnZXQgX3VpQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMudWlDYWxsYmFja3MgPSAodGhpcy51aUNhbGxiYWNrcylcbiAgICAgID8gdGhpcy51aUNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnVpQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF91aUNhbGxiYWNrcyh1aUNhbGxiYWNrcykge1xuICAgIHRoaXMudWlDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdWlDYWxsYmFja3MsIHRoaXMuX3VpQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfb2JzZXJ2ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5vYnNlcnZlckNhbGxiYWNrcyA9ICh0aGlzLm9ic2VydmVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX29ic2VydmVyQ2FsbGJhY2tzKG9ic2VydmVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5vYnNlcnZlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBvYnNlcnZlckNhbGxiYWNrcywgdGhpcy5fb2JzZXJ2ZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IGVsZW1lbnRPYnNlcnZlcigpIHtcbiAgICB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgPSAodGhpcy5fZWxlbWVudE9ic2VydmVyKVxuICAgICAgPyB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgICAgIDogbmV3IE11dGF0aW9uT2JzZXJ2ZXIodGhpcy5lbGVtZW50T2JzZXJ2ZS5iaW5kKHRoaXMpKVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgfVxuICBnZXQgX2luc2VydCgpIHsgcmV0dXJuIHRoaXMuaW5zZXJ0IH1cbiAgc2V0IF9pbnNlcnQoaW5zZXJ0KSB7IHRoaXMuaW5zZXJ0ID0gaW5zZXJ0IH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGdldCBfdGVtcGxhdGVzKCkge1xuICAgIHRoaXMudGVtcGxhdGVzID0gKHRoaXMudGVtcGxhdGVzKVxuICAgICAgPyB0aGlzLnRlbXBsYXRlc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnRlbXBsYXRlc1xuICB9XG4gIHNldCBfdGVtcGxhdGVzKHRlbXBsYXRlcykge1xuICAgIHRoaXMudGVtcGxhdGVzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHRlbXBsYXRlcywgdGhpcy5fdGVtcGxhdGVzXG4gICAgKVxuICB9XG4gIGVsZW1lbnRPYnNlcnZlKG11dGF0aW9uUmVjb3JkTGlzdCwgb2JzZXJ2ZXIpIHtcbiAgICBmb3IobGV0IFttdXRhdGlvblJlY29yZEluZGV4LCBtdXRhdGlvblJlY29yZF0gb2YgT2JqZWN0LmVudHJpZXMobXV0YXRpb25SZWNvcmRMaXN0KSkge1xuICAgICAgc3dpdGNoKG11dGF0aW9uUmVjb3JkLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnY2hpbGRMaXN0JzpcbiAgICAgICAgICBsZXQgbXV0YXRpb25SZWNvcmRDYXRlZ29yaWVzID0gWydhZGRlZE5vZGVzJywgJ3JlbW92ZWROb2RlcyddXG4gICAgICAgICAgZm9yKGxldCBtdXRhdGlvblJlY29yZENhdGVnb3J5IG9mIG11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcykge1xuICAgICAgICAgICAgaWYobXV0YXRpb25SZWNvcmRbbXV0YXRpb25SZWNvcmRDYXRlZ29yeV0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHRoaXMucmVzZXRVSSgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGF1dG9JbnNlcnQoKSB7XG4gICAgaWYodGhpcy5pbnNlcnQpIHtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5pbnNlcnQuZWxlbWVudClcbiAgICAgIC5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KHRoaXMuaW5zZXJ0Lm1ldGhvZCwgdGhpcy5lbGVtZW50KVxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgYXV0b1JlbW92ZSgpIHtcbiAgICBpZihcbiAgICAgIHRoaXMuZWxlbWVudCAmJlxuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnRcbiAgICApIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcbiAgfVxuICBlbmFibGVFbGVtZW50KHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzXG4gICAgaWYoc2V0dGluZ3MuZWxlbWVudE5hbWUpIHRoaXMuX2VsZW1lbnROYW1lID0gc2V0dGluZ3MuZWxlbWVudE5hbWVcbiAgICBpZihzZXR0aW5ncy5lbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gc2V0dGluZ3MuZWxlbWVudFxuICAgIGlmKHNldHRpbmdzLmF0dHJpYnV0ZXMpIHRoaXMuX2F0dHJpYnV0ZXMgPSBzZXR0aW5ncy5hdHRyaWJ1dGVzXG4gICAgaWYoc2V0dGluZ3MudGVtcGxhdGVzKSB0aGlzLl90ZW1wbGF0ZXMgPSBzZXR0aW5ncy50ZW1wbGF0ZXNcbiAgICBpZihzZXR0aW5ncy5pbnNlcnQpIHRoaXMuX2luc2VydCA9IHNldHRpbmdzLmluc2VydFxuICB9XG4gIGRpc2FibGVFbGVtZW50KHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICB0aGlzLmVsZW1lbnQgJiZcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50XG4gICAgKSB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpXG4gICAgaWYodGhpcy5lbGVtZW50KSBkZWxldGUgdGhpcy5lbGVtZW50XG4gICAgaWYodGhpcy5hdHRyaWJ1dGVzKSBkZWxldGUgdGhpcy5hdHRyaWJ1dGVzXG4gICAgaWYodGhpcy50ZW1wbGF0ZXMpIGRlbGV0ZSB0aGlzLnRlbXBsYXRlc1xuICAgIGlmKHRoaXMuaW5zZXJ0KSBkZWxldGUgdGhpcy5pbnNlcnRcbiAgfVxuICByZXNldFVJKCkge1xuICAgIHRoaXMuZGlzYWJsZVVJKClcbiAgICB0aGlzLmVuYWJsZVVJKClcbiAgfVxuICBlbmFibGVVSShzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKHNldHRpbmdzLnVpKSB0aGlzLl91aSA9IHNldHRpbmdzLnVpXG4gICAgaWYoc2V0dGluZ3MudWlDYWxsYmFja3MpIHRoaXMuX3VpQ2FsbGJhY2tzID0gc2V0dGluZ3MudWlDYWxsYmFja3NcbiAgICBpZihzZXR0aW5ncy51aUV2ZW50cykge1xuICAgICAgdGhpcy5fdWlFdmVudHMgPSBzZXR0aW5ncy51aUV2ZW50c1xuICAgICAgdGhpcy5lbmFibGVVSUV2ZW50cygpXG4gICAgfVxuICB9XG4gIGRpc2FibGVVSShzZXR0aW5ncykge1xuICAgIHNldHRpbmdzID0gc2V0dGluZ3MgfHwgdGhpcy5zZXR0aW5nc1xuICAgIGlmKHNldHRpbmdzLnVpRXZlbnRzKSB7XG4gICAgICB0aGlzLmRpc2FibGVVSUV2ZW50cygpXG4gICAgICBkZWxldGUgdGhpcy5fdWlFdmVudHNcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMudWlFdmVudHNcbiAgICBkZWxldGUgdGhpcy51aVxuICAgIGRlbGV0ZSB0aGlzLnVpQ2FsbGJhY2tzXG4gIH1cbiAgZW5hYmxlVUlFdmVudHMoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLnVpRXZlbnRzICYmXG4gICAgICB0aGlzLnVpICYmXG4gICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgKSB7XG4gICAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyhcbiAgICAgICAgdGhpcy51aUV2ZW50cyxcbiAgICAgICAgdGhpcy51aSxcbiAgICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICAgKVxuICAgIH1cbiAgfVxuICBkaXNhYmxlVUlFdmVudHMoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLnVpRXZlbnRzICYmXG4gICAgICB0aGlzLnVpICYmXG4gICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgKSB7XG4gICAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMoXG4gICAgICAgIHRoaXMudWlFdmVudHMsXG4gICAgICAgIHRoaXMudWksXG4gICAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgZW5hYmxlRW1pdHRlcnMoKSB7XG4gICAgaWYodGhpcy5zZXR0aW5ncy5lbWl0dGVycykgdGhpcy5fZW1pdHRlcnMgPSB0aGlzLnNldHRpbmdzLmVtaXR0ZXJzXG4gIH1cbiAgZGlzYWJsZUVtaXR0ZXJzKCkge1xuICAgIGlmKHRoaXMuX2VtaXR0ZXJzKSBkZWxldGUgdGhpcy5fZW1pdHRlcnNcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLl9lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLmVuYWJsZUVtaXR0ZXJzKClcbiAgICAgIHRoaXMuZW5hYmxlRWxlbWVudChzZXR0aW5ncylcbiAgICAgIHRoaXMuZW5hYmxlVUkoc2V0dGluZ3MpXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgdGhpcy5fZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5kaXNhYmxlVUkoc2V0dGluZ3MpXG4gICAgICB0aGlzLmRpc2FibGVFbGVtZW50KHNldHRpbmdzKVxuICAgICAgdGhpcy5kaXNhYmxlRW1pdHRlcnMoKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgICByZXR1cm4gdGhpc3NcbiAgICB9XG4gIH1cbn1cbiIsIk1WQy5Db250cm9sbGVyID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgX2VtaXR0ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzID0gKHRoaXMuZW1pdHRlckNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlckNhbGxiYWNrc1xuICB9XG4gIHNldCBfZW1pdHRlckNhbGxiYWNrcyhlbWl0dGVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGVtaXR0ZXJDYWxsYmFja3MsIHRoaXMuX2VtaXR0ZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9tb2RlbENhbGxiYWNrcygpIHtcbiAgICB0aGlzLm1vZGVsQ2FsbGJhY2tzID0gKHRoaXMubW9kZWxDYWxsYmFja3MpXG4gICAgICA/IHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5tb2RlbENhbGxiYWNrc1xuICB9XG4gIHNldCBfbW9kZWxDYWxsYmFja3MobW9kZWxDYWxsYmFja3MpIHtcbiAgICB0aGlzLm1vZGVsQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG1vZGVsQ2FsbGJhY2tzLCB0aGlzLl9tb2RlbENhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX3ZpZXdDYWxsYmFja3MoKSB7XG4gICAgdGhpcy52aWV3Q2FsbGJhY2tzID0gKHRoaXMudmlld0NhbGxiYWNrcylcbiAgICAgID8gdGhpcy52aWV3Q2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudmlld0NhbGxiYWNrc1xuICB9XG4gIHNldCBfdmlld0NhbGxiYWNrcyh2aWV3Q2FsbGJhY2tzKSB7XG4gICAgdGhpcy52aWV3Q2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHZpZXdDYWxsYmFja3MsIHRoaXMuX3ZpZXdDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9jb250cm9sbGVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcyA9ICh0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX2NvbnRyb2xsZXJDYWxsYmFja3MoY29udHJvbGxlckNhbGxiYWNrcykge1xuICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBjb250cm9sbGVyQ2FsbGJhY2tzLCB0aGlzLl9jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfbW9kZWxzKCkge1xuICAgIHRoaXMubW9kZWxzID0gKHRoaXMubW9kZWxzKVxuICAgICAgPyB0aGlzLm1vZGVsc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm1vZGVsc1xuICB9XG4gIHNldCBfbW9kZWxzKG1vZGVscykge1xuICAgIHRoaXMubW9kZWxzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG1vZGVscywgdGhpcy5fbW9kZWxzXG4gICAgKVxuICB9XG4gIGdldCBfdmlld3MoKSB7XG4gICAgdGhpcy52aWV3cyA9ICh0aGlzLnZpZXdzKVxuICAgICAgPyB0aGlzLnZpZXdzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudmlld3NcbiAgfVxuICBzZXQgX3ZpZXdzKHZpZXdzKSB7XG4gICAgdGhpcy52aWV3cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB2aWV3cywgdGhpcy5fdmlld3NcbiAgICApXG4gIH1cbiAgZ2V0IF9jb250cm9sbGVycygpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJzID0gKHRoaXMuY29udHJvbGxlcnMpXG4gICAgICA/IHRoaXMuY29udHJvbGxlcnNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyc1xuICB9XG4gIHNldCBfY29udHJvbGxlcnMoY29udHJvbGxlcnMpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGNvbnRyb2xsZXJzLCB0aGlzLl9jb250cm9sbGVyc1xuICAgIClcbiAgfVxuICBnZXQgX3JvdXRlcnMoKSB7XG4gICAgdGhpcy5yb3V0ZXJzID0gKHRoaXMucm91dGVycylcbiAgICAgID8gdGhpcy5yb3V0ZXJzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVyc1xuICB9XG4gIHNldCBfcm91dGVycyhyb3V0ZXJzKSB7XG4gICAgdGhpcy5yb3V0ZXJzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlcnMsIHRoaXMuX3JvdXRlcnNcbiAgICApXG4gIH1cbiAgZ2V0IF9yb3V0ZXJFdmVudHMoKSB7XG4gICAgdGhpcy5yb3V0ZXJFdmVudHMgPSAodGhpcy5yb3V0ZXJFdmVudHMpXG4gICAgICA/IHRoaXMucm91dGVyRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVyRXZlbnRzXG4gIH1cbiAgc2V0IF9yb3V0ZXJFdmVudHMocm91dGVyRXZlbnRzKSB7XG4gICAgdGhpcy5yb3V0ZXJFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgcm91dGVyRXZlbnRzLCB0aGlzLl9yb3V0ZXJFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9yb3V0ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5yb3V0ZXJDYWxsYmFja3MgPSAodGhpcy5yb3V0ZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMucm91dGVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9yb3V0ZXJDYWxsYmFja3Mocm91dGVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5yb3V0ZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgcm91dGVyQ2FsbGJhY2tzLCB0aGlzLl9yb3V0ZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9lbWl0dGVyRXZlbnRzKCkge1xuICAgIHRoaXMuZW1pdHRlckV2ZW50cyA9ICh0aGlzLmVtaXR0ZXJFdmVudHMpXG4gICAgICA/IHRoaXMuZW1pdHRlckV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXJFdmVudHNcbiAgfVxuICBzZXQgX2VtaXR0ZXJFdmVudHMoZW1pdHRlckV2ZW50cykge1xuICAgIHRoaXMuZW1pdHRlckV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBlbWl0dGVyRXZlbnRzLCB0aGlzLl9lbWl0dGVyRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfbW9kZWxFdmVudHMoKSB7XG4gICAgdGhpcy5tb2RlbEV2ZW50cyA9ICh0aGlzLm1vZGVsRXZlbnRzKVxuICAgICAgPyB0aGlzLm1vZGVsRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMubW9kZWxFdmVudHNcbiAgfVxuICBzZXQgX21vZGVsRXZlbnRzKG1vZGVsRXZlbnRzKSB7XG4gICAgdGhpcy5tb2RlbEV2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBtb2RlbEV2ZW50cywgdGhpcy5fbW9kZWxFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF92aWV3RXZlbnRzKCkge1xuICAgIHRoaXMudmlld0V2ZW50cyA9ICh0aGlzLnZpZXdFdmVudHMpXG4gICAgICA/IHRoaXMudmlld0V2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnZpZXdFdmVudHNcbiAgfVxuICBzZXQgX3ZpZXdFdmVudHModmlld0V2ZW50cykge1xuICAgIHRoaXMudmlld0V2ZW50cyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB2aWV3RXZlbnRzLCB0aGlzLl92aWV3RXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlckV2ZW50cygpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgPSAodGhpcy5jb250cm9sbGVyRXZlbnRzKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyRXZlbnRzXG4gIH1cbiAgc2V0IF9jb250cm9sbGVyRXZlbnRzKGNvbnRyb2xsZXJFdmVudHMpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlckV2ZW50cywgdGhpcy5fY29udHJvbGxlckV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZW5hYmxlTW9kZWxFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5tb2RlbEV2ZW50cywgdGhpcy5tb2RlbHMsIHRoaXMubW9kZWxDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZU1vZGVsRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5tb2RlbEV2ZW50cywgdGhpcy5tb2RlbHMsIHRoaXMubW9kZWxDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlVmlld0V2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnZpZXdFdmVudHMsIHRoaXMudmlld3MsIHRoaXMudmlld0NhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlVmlld0V2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMudmlld0V2ZW50cywgdGhpcy52aWV3cywgdGhpcy52aWV3Q2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZUNvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5jb250cm9sbGVyRXZlbnRzLCB0aGlzLmNvbnRyb2xsZXJzLCB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZUNvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmNvbnRyb2xsZXJFdmVudHMsIHRoaXMuY29udHJvbGxlcnMsIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcylcbiAgfVxuICBlbmFibGVFbWl0dGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuZW1pdHRlckV2ZW50cywgdGhpcy5lbWl0dGVycywgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVFbWl0dGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5lbWl0dGVyRXZlbnRzLCB0aGlzLmVtaXR0ZXJzLCB0aGlzLmVtaXR0ZXJDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlUm91dGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMucm91dGVyRXZlbnRzLCB0aGlzLnJvdXRlcnMsIHRoaXMucm91dGVyQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVSb3V0ZXJFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnJvdXRlckV2ZW50cywgdGhpcy5yb3V0ZXJzLCB0aGlzLnJvdXRlckNhbGxiYWNrcylcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKHNldHRpbmdzLmVtaXR0ZXJDYWxsYmFja3MpIHRoaXMuX2VtaXR0ZXJDYWxsYmFja3MgPSBzZXR0aW5ncy5lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5tb2RlbENhbGxiYWNrcykgdGhpcy5fbW9kZWxDYWxsYmFja3MgPSBzZXR0aW5ncy5tb2RlbENhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3Mudmlld0NhbGxiYWNrcykgdGhpcy5fdmlld0NhbGxiYWNrcyA9IHNldHRpbmdzLnZpZXdDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLmNvbnRyb2xsZXJDYWxsYmFja3MpIHRoaXMuX2NvbnRyb2xsZXJDYWxsYmFja3MgPSBzZXR0aW5ncy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5yb3V0ZXJDYWxsYmFja3MpIHRoaXMuX3JvdXRlckNhbGxiYWNrcyA9IHNldHRpbmdzLnJvdXRlckNhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3MuZW1pdHRlcnMpIHRoaXMuX2VtaXR0ZXJzID0gc2V0dGluZ3MuZW1pdHRlcnNcbiAgICAgIGlmKHNldHRpbmdzLm1vZGVscykgdGhpcy5fbW9kZWxzID0gc2V0dGluZ3MubW9kZWxzXG4gICAgICBpZihzZXR0aW5ncy52aWV3cykgdGhpcy5fdmlld3MgPSBzZXR0aW5ncy52aWV3c1xuICAgICAgaWYoc2V0dGluZ3MuY29udHJvbGxlcnMpIHRoaXMuX2NvbnRyb2xsZXJzID0gc2V0dGluZ3MuY29udHJvbGxlcnNcbiAgICAgIGlmKHNldHRpbmdzLnJvdXRlcnMpIHRoaXMuX3JvdXRlcnMgPSBzZXR0aW5ncy5yb3V0ZXJzXG4gICAgICBpZihzZXR0aW5ncy5yb3V0ZXJFdmVudHMpIHRoaXMuX3JvdXRlckV2ZW50cyA9IHNldHRpbmdzLnJvdXRlckV2ZW50c1xuICAgICAgaWYoc2V0dGluZ3MuZW1pdHRlckV2ZW50cykgdGhpcy5fZW1pdHRlckV2ZW50cyA9IHNldHRpbmdzLmVtaXR0ZXJFdmVudHNcbiAgICAgIGlmKHNldHRpbmdzLm1vZGVsRXZlbnRzKSB0aGlzLl9tb2RlbEV2ZW50cyA9IHNldHRpbmdzLm1vZGVsRXZlbnRzXG4gICAgICBpZihzZXR0aW5ncy52aWV3RXZlbnRzKSB0aGlzLl92aWV3RXZlbnRzID0gc2V0dGluZ3Mudmlld0V2ZW50c1xuICAgICAgaWYoc2V0dGluZ3MuY29udHJvbGxlckV2ZW50cykgdGhpcy5fY29udHJvbGxlckV2ZW50cyA9IHNldHRpbmdzLmNvbnRyb2xsZXJFdmVudHNcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmVtaXR0ZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVycyAmJlxuICAgICAgICB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZUVtaXR0ZXJFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMucm91dGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMucm91dGVycyAmJlxuICAgICAgICB0aGlzLnJvdXRlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlUm91dGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLm1vZGVsRXZlbnRzICYmXG4gICAgICAgIHRoaXMubW9kZWxzICYmXG4gICAgICAgIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZU1vZGVsRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnZpZXdFdmVudHMgJiZcbiAgICAgICAgdGhpcy52aWV3cyAmJlxuICAgICAgICB0aGlzLnZpZXdDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZVZpZXdFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuY29udHJvbGxlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlQ29udHJvbGxlckV2ZW50cygpXG4gICAgICB9XG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICB0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmVtaXR0ZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVycyAmJlxuICAgICAgICB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVFbWl0dGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnJvdXRlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLnJvdXRlcnMgJiZcbiAgICAgICAgdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVSb3V0ZXJFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMubW9kZWxFdmVudHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbHMgJiZcbiAgICAgICAgdGhpcy5tb2RlbENhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZU1vZGVsRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnZpZXdFdmVudHMgJiZcbiAgICAgICAgdGhpcy52aWV3cyAmJlxuICAgICAgICB0aGlzLnZpZXdDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVWaWV3RXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVycyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVDb250cm9sbGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGRlbGV0ZSB0aGlzLl9lbWl0dGVyc1xuICAgICAgZGVsZXRlIHRoaXMuX21vZGVsQ2FsbGJhY2tzXG4gICAgICBkZWxldGUgdGhpcy5fdmlld0NhbGxiYWNrc1xuICAgICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9yb3V0ZXJDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9tb2RlbHNcbiAgICAgIGRlbGV0ZSB0aGlzLl92aWV3c1xuICAgICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJzXG4gICAgICBkZWxldGUgdGhpcy5fcm91dGVyc1xuICAgICAgZGVsZXRlIHRoaXMuX21vZGVsRXZlbnRzXG4gICAgICBkZWxldGUgdGhpcy5fdmlld0V2ZW50c1xuICAgICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJFdmVudHNcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgfVxufVxuIiwiTVZDLlJvdXRlciA9IGNsYXNzIGV4dGVuZHMgTVZDLkJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IHJvdXRlKCkge1xuICAgIGlmKHRoaXMuX2hhc2gpIHtcbiAgICAgIHJldHVybiBTdHJpbmcod2luZG93LmxvY2F0aW9uLmhhc2gpLnNwbGl0KCcjJykucG9wKClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFN0cmluZyh3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpXG4gICAgfVxuICB9XG4gIGdldCBfaGFzaCgpIHsgcmV0dXJuIHRoaXMuaGFzaCB9XG4gIHNldCBfaGFzaChoYXNoKSB7IHRoaXMuaGFzaCA9IGhhc2ggfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZ2V0IF9yb3V0ZXMoKSB7XG4gICAgdGhpcy5yb3V0ZXMgPSAodGhpcy5yb3V0ZXMpXG4gICAgICA/IHRoaXMucm91dGVzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVzXG4gIH1cbiAgc2V0IF9yb3V0ZXMocm91dGVzKSB7XG4gICAgdGhpcy5yb3V0ZXMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgcm91dGVzLCB0aGlzLl9yb3V0ZXNcbiAgICApXG4gIH1cbiAgZ2V0IF9jb250cm9sbGVyKCkgeyByZXR1cm4gdGhpcy5jb250cm9sbGVyIH1cbiAgc2V0IF9jb250cm9sbGVyKGNvbnRyb2xsZXIpIHsgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlciB9XG4gIGdldCBfcHJldmlvdXNVUkwoKSB7IHJldHVybiB0aGlzLnByZXZpb3VzVVJMIH1cbiAgc2V0IF9wcmV2aW91c1VSTChwcmV2aW91c1VSTCkgeyB0aGlzLnByZXZpb3VzVVJMID0gcHJldmlvdXNVUkwgfVxuICBnZXQgX2N1cnJlbnRVUkwoKSB7IHJldHVybiB0aGlzLmN1cnJlbnRVUkwgfVxuICBzZXQgX2N1cnJlbnRVUkwoY3VycmVudFVSTCkgeyB0aGlzLmN1cnJlbnRVUkwgPSBjdXJyZW50VVJMIH1cbiAgZ2V0IGZyYWdtZW50SURSZWdFeHAoKSB7IHJldHVybiBuZXcgUmVnRXhwKC9eKFswLTlBLVpcXD9cXD1cXCxcXC5cXCpcXC1cXF9cXCdcXFwiXFxeXFwlXFwkXFwjXFxAXFwhXFx+XFwoXFwpXFx7XFx9XFwmXFw8XFw+XFxcXFxcL10pKiQvLCAnZ2knKSB9XG4gIGZyYWdtZW50TmFtZVJlZ0V4cChmcmFnbWVudCkgeyByZXR1cm4gbmV3IFJlZ0V4cCgnXicuY29uY2F0KGZyYWdtZW50LCAnJCcpKSB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5faGFzaCA9ICh0eXBlb2YgdGhpcy5zZXR0aW5ncy5oYXNoID09PSAnYm9vbGVhbicpXG4gICAgICAgID8gdGhpcy5zZXR0aW5ncy5oYXNoXG4gICAgICAgIDogdHJ1ZVxuICAgICAgdGhpcy5lbmFibGVFbWl0dGVycygpXG4gICAgICB0aGlzLmVuYWJsZUV2ZW50cygpXG4gICAgICB0aGlzLmVuYWJsZVJvdXRlcygpXG4gICAgICB0aGlzLnJvdXRlQ2hhbmdlKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgfVxuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgIHRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgZGVsZXRlIHRoaXMuX2hhc2hcbiAgICAgIHRoaXMuZGlzYWJsZUV2ZW50cygpXG4gICAgICB0aGlzLmRpc2FibGVSb3V0ZXMoKVxuICAgICAgdGhpcy5kaXNhYmxlRW1pdHRlcnMoKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICB9XG4gIGVuYWJsZVJvdXRlcygpIHtcbiAgICBpZih0aGlzLnNldHRpbmdzLmNvbnRyb2xsZXIpIHRoaXMuX2NvbnRyb2xsZXIgPSB0aGlzLnNldHRpbmdzLmNvbnRyb2xsZXJcbiAgICB0aGlzLl9yb3V0ZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnNldHRpbmdzLnJvdXRlcykucmVkdWNlKFxuICAgICAgKFxuICAgICAgICBfcm91dGVzLFxuICAgICAgICBbcm91dGVQYXRoLCByb3V0ZUNhbGxiYWNrXSxcbiAgICAgICAgcm91dGVJbmRleCxcbiAgICAgICAgb3JpZ2luYWxSb3V0ZXMsXG4gICAgICApID0+IHtcbiAgICAgICAgX3JvdXRlc1tyb3V0ZVBhdGhdID0gdGhpcy5jb250cm9sbGVyW3JvdXRlQ2FsbGJhY2tdXG4gICAgICAgIHJldHVybiBfcm91dGVzXG4gICAgICB9LFxuICAgICAge31cbiAgICApXG4gICAgcmV0dXJuXG4gIH1cbiAgZW5hYmxlRW1pdHRlcnMoKSB7XG4gICAgdGhpcy5fZW1pdHRlcnMgPSB7XG4gICAgICBuYXZpZ2F0ZUVtaXR0ZXI6IG5ldyBNVkMuRW1pdHRlcnMuTmF2aWdhdGVFbWl0dGVyKCksXG4gICAgfVxuICB9XG4gIGRpc2FibGVFbWl0dGVycygpIHtcbiAgICBkZWxldGUgdGhpcy5fZW1pdHRlcnMubmF2aWdhdGVFbWl0dGVyXG4gIH1cbiAgZGlzYWJsZVJvdXRlcygpIHtcbiAgICBkZWxldGUgdGhpcy5fcm91dGVzXG4gICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJcbiAgfVxuICBlbmFibGVFdmVudHMoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLnJvdXRlQ2hhbmdlLmJpbmQodGhpcykpXG4gIH1cbiAgZGlzYWJsZUV2ZW50cygpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMucm91dGVDaGFuZ2UuYmluZCh0aGlzKSlcbiAgfVxuICByb3V0ZUNoYW5nZSgpIHtcbiAgICBsZXQgcm91dGUgPSB0aGlzLnJvdXRlLnNwbGl0KCcvJykuZmlsdGVyKChmcmFnbWVudCkgPT4gZnJhZ21lbnQubGVuZ3RoKVxuICAgIHJvdXRlID0gKHJvdXRlLmxlbmd0aClcbiAgICAgID8gcm91dGVcbiAgICAgIDogWycvJ11cbiAgICBsZXQgcm91dGVDb250cm9sbGVyRGF0YSA9IE9iamVjdC5lbnRyaWVzKHRoaXMucm91dGVzKVxuICAgICAgLmZpbHRlcigoW3JvdXRlclBhdGgsIHJvdXRlckNvbnRyb2xsZXJdKSA9PiB7XG4gICAgICAgIHJvdXRlclBhdGggPSByb3V0ZXJQYXRoLnNwbGl0KCcvJykuZmlsdGVyKChmcmFnbWVudCkgPT4gZnJhZ21lbnQubGVuZ3RoKVxuICAgICAgICByb3V0ZXJQYXRoID0gKHJvdXRlclBhdGgubGVuZ3RoKVxuICAgICAgICAgID8gcm91dGVyUGF0aFxuICAgICAgICAgIDogWycvJ11cbiAgICAgICAgaWYoXG4gICAgICAgICAgcm91dGUubGVuZ3RoICYmXG4gICAgICAgICAgcm91dGUubGVuZ3RoID09PSByb3V0ZXJQYXRoLmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICBsZXQgbWF0Y2hcbiAgICAgICAgICByZXR1cm4gcm91dGVyUGF0aC5maWx0ZXIoKGZyYWdtZW50LCBmcmFnbWVudEluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgbWF0Y2ggPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICBtYXRjaCA9PT0gdHJ1ZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGlmKGZyYWdtZW50WzBdID09PSAnOicpIHtcbiAgICAgICAgICAgICAgICBmcmFnbWVudCA9IHRoaXMuZnJhZ21lbnRJRFJlZ0V4cFxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZyYWdtZW50ID0gZnJhZ21lbnQucmVwbGFjZShuZXcgUmVnRXhwKCcvJywgJ2dpJyksICdcXFxcXFwvJylcbiAgICAgICAgICAgICAgICBmcmFnbWVudCA9IHRoaXMuZnJhZ21lbnROYW1lUmVnRXhwKGZyYWdtZW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG1hdGNoID0gZnJhZ21lbnQudGVzdChyb3V0ZVtmcmFnbWVudEluZGV4XSlcbiAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgbWF0Y2ggPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICBmcmFnbWVudEluZGV4ID09PSByb3V0ZS5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiByb3V0ZXJDb250cm9sbGVyXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVswXVxuICAgICAgICB9XG4gICAgICB9KVswXVxuICAgIHRyeSB7XG4gICAgICBpZih0aGlzLmN1cnJlbnRVUkwpIHRoaXMuX3ByZXZpb3VzVVJMID0gdGhpcy5jdXJyZW50VVJMXG4gICAgICB0aGlzLl9jdXJyZW50VVJMID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICAgIGxldCByb3V0ZUNvbnRyb2xsZXJOYW1lID0gcm91dGVDb250cm9sbGVyRGF0YVswXVxuICAgICAgbGV0IHJvdXRlQ29udHJvbGxlciA9IHJvdXRlQ29udHJvbGxlckRhdGFbMV1cbiAgICAgIGxldCBuYXZpZ2F0ZUVtaXR0ZXIgPSB0aGlzLmVtaXR0ZXJzLm5hdmlnYXRlRW1pdHRlclxuICAgICAgbGV0IG5hdmlnYXRlRW1pdHRlckRhdGEgPSB7XG4gICAgICAgIGN1cnJlbnRVUkw6IHRoaXMuY3VycmVudFVSTCxcbiAgICAgICAgcHJldmlvdXNVUkw6IHRoaXMucHJldmlvdXNVUkwsXG4gICAgICAgIGN1cnJlbnRSb3V0ZTogdGhpcy5yb3V0ZSxcbiAgICAgICAgY3VycmVudENvbnRyb2xsZXI6IHJvdXRlQ29udHJvbGxlci5uYW1lXG4gICAgICB9XG4gICAgICBuYXZpZ2F0ZUVtaXR0ZXIuc2V0KG5hdmlnYXRlRW1pdHRlckRhdGEpXG4gICAgICB0aGlzLmVtaXQoXG4gICAgICAgIG5hdmlnYXRlRW1pdHRlci5uYW1lLFxuICAgICAgICBuYXZpZ2F0ZUVtaXR0ZXIuZW1pc3Npb24oKVxuICAgICAgKVxuICAgICAgcm91dGVDb250cm9sbGVyKG5hdmlnYXRlRW1pdHRlci5lbWlzc2lvbigpKVxuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgIHRocm93ICdSb3V0ZSBEZWZpbml0aW9uIEVycm9yJ1xuICAgIH1cbiAgfVxuICBuYXZpZ2F0ZShwYXRoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBwYXRoXG4gIH1cbn1cbiJdfQ==
