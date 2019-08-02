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
    this.settings = MVC.Utils.addPropertiesToObject(settings, this._settings);
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
      if (this.settings.data) this.set(this.settings.data);
      if (this.settings.dataCallbacks) this._dataCallbacks = this.settings.dataCallbacks;
      if (this.settings.dataEvents) this._dataEvents = this.settings.dataEvents;
      if (this.settings.schema) this._schema = this.settings.schema;
      if (this.settings.defaults) this._defaults = this.settings.defaults;

      if (this.dataEvents && this.dataCallbacks) {
        this.enableDataEvents();
      }

      this._enabled = true;
    }
  }

  disable() {
    var settings = this.settings;

    if (settings && !this.enabled) {
      if (this.dataEvents && this.dataCallbacks) {
        this.disableDataEvents();
      }

      delete this._histiogram;
      delete this._data;
      delete this._dataCallbacks;
      delete this._dataEvents;
      delete this._schema;
      delete this._defaults;

      if (this.dataEvents && this.dataCallbacks) {
        this.disableDataEvents();
      }

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
    this.emit(this.name, {
      name: this.name,
      data: this.parse()
    });
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

  get _emitters() {
    this.emitters = this.emitters ? this.emitters : {};
    return this.emitters;
  }

  set _emitters(emitters) {
    this.emitters = MVC.Utils.addPropertiesToObject(emitters, this._emitters);
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

  get _emitters() {
    this.emitters = this.emitters ? this.emitters : {};
    return this.emitters;
  }

  set _emitters(emitters) {
    this.emitters = MVC.Utils.addPropertiesToObject(emitters, this._emitters);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1WQy5qcyIsIkNvbnN0YW50cy5qcyIsIkV2ZW50cy5qcyIsIlRlbXBsYXRlcy5qcyIsIlV0aWxzLmpzIiwiaXMuanMiLCJ0eXBlT2YuanMiLCJhZGRQcm9wZXJ0aWVzVG9PYmplY3QuanMiLCJvYmplY3RRdWVyeS5qcyIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMuanMiLCJ2YWxpZGF0ZURhdGFTY2hlbWEuanMiLCJDaGFubmVscy5qcyIsIkNoYW5uZWwuanMiLCJCYXNlLmpzIiwiU2VydmljZS5qcyIsIk1vZGVsLmpzIiwiRW1pdHRlci5qcyIsIlZpZXcuanMiLCJDb250cm9sbGVyLmpzIiwiUm91dGVyLmpzIl0sIm5hbWVzIjpbIk1WQyIsIkNvbnN0YW50cyIsIkNPTlNUIiwiRXZlbnRzIiwiRVYiLCJUZW1wbGF0ZXMiLCJPYmplY3RRdWVyeVN0cmluZ0Zvcm1hdEludmFsaWRSb290IiwiT2JqZWN0UXVlcnlTdHJpbmdGb3JtYXRJbnZhbGlkIiwiZGF0YSIsImpvaW4iLCJEYXRhU2NoZW1hTWlzbWF0Y2giLCJEYXRhRnVuY3Rpb25JbnZhbGlkIiwiRGF0YVVuZGVmaW5lZCIsIlNjaGVtYVVuZGVmaW5lZCIsIlRNUEwiLCJVdGlscyIsImlzQXJyYXkiLCJvYmplY3QiLCJBcnJheSIsImlzT2JqZWN0IiwiaXNFcXVhbFR5cGUiLCJ2YWx1ZUEiLCJ2YWx1ZUIiLCJpc0hUTUxFbGVtZW50IiwiSFRNTEVsZW1lbnQiLCJ0eXBlT2YiLCJfb2JqZWN0IiwiYWRkUHJvcGVydGllc1RvT2JqZWN0IiwidGFyZ2V0T2JqZWN0IiwiYXJndW1lbnRzIiwibGVuZ3RoIiwicHJvcGVydGllcyIsInByb3BlcnR5TmFtZSIsInByb3BlcnR5VmFsdWUiLCJPYmplY3QiLCJlbnRyaWVzIiwib2JqZWN0UXVlcnkiLCJzdHJpbmciLCJjb250ZXh0Iiwic3RyaW5nRGF0YSIsInBhcnNlTm90YXRpb24iLCJzcGxpY2UiLCJyZWR1Y2UiLCJmcmFnbWVudCIsImZyYWdtZW50SW5kZXgiLCJmcmFnbWVudHMiLCJwYXJzZUZyYWdtZW50IiwicHJvcGVydHlLZXkiLCJtYXRjaCIsImNvbmNhdCIsImNoYXJBdCIsInNsaWNlIiwic3BsaXQiLCJSZWdFeHAiLCJ0b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzIiwidG9nZ2xlTWV0aG9kIiwiZXZlbnRzIiwidGFyZ2V0T2JqZWN0cyIsImNhbGxiYWNrcyIsImV2ZW50U2V0dGluZ3MiLCJldmVudENhbGxiYWNrTmFtZSIsImV2ZW50RGF0YSIsImV2ZW50VGFyZ2V0U2V0dGluZ3MiLCJldmVudE5hbWUiLCJldmVudFRhcmdldHMiLCJldmVudFRhcmdldE5hbWUiLCJldmVudFRhcmdldCIsImV2ZW50TWV0aG9kTmFtZSIsIk5vZGVMaXN0IiwiZXZlbnRDYWxsYmFjayIsIl9ldmVudFRhcmdldCIsImJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMiLCJ1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyIsInZhbGlkYXRlRGF0YVNjaGVtYSIsInNjaGVtYSIsImFycmF5IiwiY29uc29sZSIsImxvZyIsIm5hbWUiLCJhcnJheUtleSIsImFycmF5VmFsdWUiLCJwdXNoIiwib2JqZWN0S2V5Iiwib2JqZWN0VmFsdWUiLCJjb25zdHJ1Y3RvciIsIl9ldmVudHMiLCJldmVudENhbGxiYWNrcyIsImV2ZW50Q2FsbGJhY2tHcm91cCIsIm9uIiwib2ZmIiwiZW1pdCIsImV2ZW50Q2FsbGJhY2tHcm91cE5hbWUiLCJhZGRpdGlvbmFsQXJndW1lbnRzIiwidmFsdWVzIiwiQ2hhbm5lbHMiLCJfY2hhbm5lbHMiLCJjaGFubmVscyIsImNoYW5uZWwiLCJjaGFubmVsTmFtZSIsIkNoYW5uZWwiLCJfcmVzcG9uc2VzIiwicmVzcG9uc2VzIiwicmVzcG9uc2UiLCJyZXNwb25zZU5hbWUiLCJyZXNwb25zZUNhbGxiYWNrIiwicmVxdWVzdCIsInJlcXVlc3REYXRhIiwia2V5cyIsIkJhc2UiLCJzZXR0aW5ncyIsIm9wdGlvbnMiLCJjb25maWd1cmF0aW9uIiwiX2NvbmZpZ3VyYXRpb24iLCJfb3B0aW9ucyIsIl9zZXR0aW5ncyIsIlNlcnZpY2UiLCJfZGVmYXVsdHMiLCJkZWZhdWx0cyIsImNvbnRlbnRUeXBlIiwicmVzcG9uc2VUeXBlIiwiX3Jlc3BvbnNlVHlwZXMiLCJfcmVzcG9uc2VUeXBlIiwiX3hociIsImZpbmQiLCJyZXNwb25zZVR5cGVJdGVtIiwiX3R5cGUiLCJ0eXBlIiwiX3VybCIsInVybCIsIl9oZWFkZXJzIiwiaGVhZGVycyIsImhlYWRlciIsInNldFJlcXVlc3RIZWFkZXIiLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIl9lbmFibGVkIiwiZW5hYmxlZCIsIm5ld1hIUiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3RhdHVzIiwiYWJvcnQiLCJvcGVuIiwib25sb2FkIiwib25lcnJvciIsInNlbmQiLCJfZGF0YSIsImVuYWJsZSIsImRpc2FibGUiLCJNb2RlbCIsIl9pc1NldHRpbmciLCJpc1NldHRpbmciLCJzZXQiLCJfc2NoZW1hIiwiX2hpc3Rpb2dyYW0iLCJoaXN0aW9ncmFtIiwiYXNzaWduIiwiX2hpc3RvcnkiLCJoaXN0b3J5IiwidW5zaGlmdCIsInBhcnNlIiwiX2RhdGFFdmVudHMiLCJkYXRhRXZlbnRzIiwiX2RhdGFDYWxsYmFja3MiLCJkYXRhQ2FsbGJhY2tzIiwiZW5hYmxlRGF0YUV2ZW50cyIsImRpc2FibGVEYXRhRXZlbnRzIiwidW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzIiwiZ2V0IiwicHJvcGVydHkiLCJfYXJndW1lbnRzIiwiZm9yRWFjaCIsImluZGV4Iiwia2V5IiwidmFsdWUiLCJzZXREYXRhUHJvcGVydHkiLCJzaWxlbnQiLCJ1bnNldCIsInVuc2V0RGF0YVByb3BlcnR5IiwiZGVmaW5lUHJvcGVydGllcyIsImNvbmZpZ3VyYWJsZSIsInNldFZhbHVlRXZlbnROYW1lIiwic2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZUV2ZW50TmFtZSIsInVuc2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJFbWl0dGVyIiwiX25hbWUiLCJlbWlzc2lvbiIsIlZpZXciLCJfZWxlbWVudE5hbWUiLCJfZWxlbWVudCIsInRhZ05hbWUiLCJlbGVtZW50TmFtZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZWxlbWVudE9ic2VydmVyIiwib2JzZXJ2ZSIsInN1YnRyZWUiLCJjaGlsZExpc3QiLCJfYXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVLZXkiLCJhdHRyaWJ1dGVWYWx1ZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsIl91aSIsInVpIiwidWlLZXkiLCJ1aVZhbHVlIiwicXVlcnlTZWxlY3RvckFsbCIsIl91aUV2ZW50cyIsInVpRXZlbnRzIiwiX3VpQ2FsbGJhY2tzIiwidWlDYWxsYmFja3MiLCJfb2JzZXJ2ZXJDYWxsYmFja3MiLCJvYnNlcnZlckNhbGxiYWNrcyIsIl9lbWl0dGVycyIsImVtaXR0ZXJzIiwiX2VsZW1lbnRPYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJlbGVtZW50T2JzZXJ2ZSIsImJpbmQiLCJfaW5zZXJ0IiwiaW5zZXJ0IiwiX3RlbXBsYXRlcyIsInRlbXBsYXRlcyIsIm11dGF0aW9uUmVjb3JkTGlzdCIsIm9ic2VydmVyIiwibXV0YXRpb25SZWNvcmRJbmRleCIsIm11dGF0aW9uUmVjb3JkIiwibXV0YXRpb25SZWNvcmRDYXRlZ29yaWVzIiwibXV0YXRpb25SZWNvcmRDYXRlZ29yeSIsInJlc2V0VUkiLCJhdXRvSW5zZXJ0IiwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50IiwibWV0aG9kIiwiYXV0b1JlbW92ZSIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsImVuYWJsZUVsZW1lbnQiLCJkaXNhYmxlRWxlbWVudCIsImRpc2FibGVVSSIsImVuYWJsZVVJIiwiZW5hYmxlVUlFdmVudHMiLCJkaXNhYmxlVUlFdmVudHMiLCJlbmFibGVFbWl0dGVycyIsImRpc2FibGVFbWl0dGVycyIsInRoaXNzIiwiQ29udHJvbGxlciIsIl9lbWl0dGVyQ2FsbGJhY2tzIiwiZW1pdHRlckNhbGxiYWNrcyIsIl9tb2RlbENhbGxiYWNrcyIsIm1vZGVsQ2FsbGJhY2tzIiwiX3ZpZXdDYWxsYmFja3MiLCJ2aWV3Q2FsbGJhY2tzIiwiX2NvbnRyb2xsZXJDYWxsYmFja3MiLCJjb250cm9sbGVyQ2FsbGJhY2tzIiwiX3JvdXRlckNhbGxiYWNrcyIsInJvdXRlckNhbGxiYWNrcyIsIl9tb2RlbHMiLCJtb2RlbHMiLCJfdmlld3MiLCJ2aWV3cyIsIl9jb250cm9sbGVycyIsImNvbnRyb2xsZXJzIiwiX3JvdXRlcnMiLCJyb3V0ZXJzIiwiX2VtaXR0ZXJFdmVudHMiLCJlbWl0dGVyRXZlbnRzIiwiX21vZGVsRXZlbnRzIiwibW9kZWxFdmVudHMiLCJfdmlld0V2ZW50cyIsInZpZXdFdmVudHMiLCJfY29udHJvbGxlckV2ZW50cyIsImNvbnRyb2xsZXJFdmVudHMiLCJlbmFibGVNb2RlbEV2ZW50cyIsImRpc2FibGVNb2RlbEV2ZW50cyIsImVuYWJsZVZpZXdFdmVudHMiLCJkaXNhYmxlVmlld0V2ZW50cyIsImVuYWJsZUNvbnRyb2xsZXJFdmVudHMiLCJkaXNhYmxlQ29udHJvbGxlckV2ZW50cyIsImVuYWJsZUVtaXR0ZXJFdmVudHMiLCJkaXNhYmxlRW1pdHRlckV2ZW50cyIsIlJvdXRlciIsInJvdXRlIiwiU3RyaW5nIiwid2luZG93IiwibG9jYXRpb24iLCJoYXNoIiwicG9wIiwiX3JvdXRlcyIsInJvdXRlcyIsIl9jb250cm9sbGVyIiwiY29udHJvbGxlciIsImVuYWJsZVJvdXRlcyIsImVuYWJsZUV2ZW50cyIsImRpc2FibGVFdmVudHMiLCJkaXNhYmxlUm91dGVzIiwibWFwIiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhc2hDaGFuZ2UiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJlcnJvciIsIm5hdmlnYXRlIiwicGF0aCJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSUEsR0FB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cUIsSUFBckIsQ0FBekM7QUFDRDs7QUFDRCtFLEVBQUFBLFVBQVUsQ0FBQ0UsS0FBRCxFQUFRO0FBQ2hCLFFBQUlsQixLQUFLLEdBQUcsS0FBS0EsS0FBakI7O0FBQ0EsUUFBSTtBQUNGLFdBQUtPLE1BQUwsQ0FBWVAsS0FBWixFQUFtQmtCLEtBQW5CO0FBQ0EsV0FBSzFOLElBQUwsQ0FBVSxVQUFWLEVBQXNCLElBQXRCO0FBQ0QsS0FIRCxDQUdFLE9BQU0yTixLQUFOLEVBQWEsQ0FBRTtBQUNsQjs7QUFDREMsRUFBQUEsUUFBUSxDQUFDQyxJQUFELEVBQU87QUFDYm5CLElBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsSUFBaEIsR0FBdUJpQixJQUF2QjtBQUNEOztBQTdFaUMsQ0FBcEMiLCJmaWxlIjoiYnJvd3Nlci9tdmMtZnJhbWV3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE1WQyA9IE1WQyB8fCB7fVxyXG4iLCJNVkMuQ29uc3RhbnRzID0ge31cbk1WQy5DT05TVCA9IE1WQy5Db25zdGFudHNcbiIsIk1WQy5FdmVudHMgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfZXZlbnRzKCkge1xyXG4gICAgdGhpcy5ldmVudHMgPSAodGhpcy5ldmVudHMpXHJcbiAgICAgID8gdGhpcy5ldmVudHNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzXHJcbiAgfVxyXG4gIGV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSkgeyByZXR1cm4gdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gfHwge30gfVxyXG4gIGV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIHJldHVybiAoZXZlbnRDYWxsYmFjay5uYW1lLmxlbmd0aClcclxuICAgICAgPyBldmVudENhbGxiYWNrLm5hbWVcclxuICAgICAgOiAnYW5vbnltb3VzRnVuY3Rpb24nXHJcbiAgfVxyXG4gIGV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpIHtcclxuICAgIHJldHVybiBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gfHwgW11cclxuICB9XHJcbiAgb24oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKSB7XHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja3MgPSB0aGlzLmV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSlcclxuICAgIGxldCBldmVudENhbGxiYWNrTmFtZSA9IHRoaXMuZXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgIGxldCBldmVudENhbGxiYWNrR3JvdXAgPSB0aGlzLmV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpXHJcbiAgICBldmVudENhbGxiYWNrR3JvdXAucHVzaChldmVudENhbGxiYWNrKVxyXG4gICAgZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdID0gZXZlbnRDYWxsYmFja0dyb3VwXHJcbiAgICB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSA9IGV2ZW50Q2FsbGJhY2tzXHJcbiAgfVxyXG4gIG9mZigpIHtcclxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrTmFtZSA9IHRoaXMuZXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1bZXZlbnRDYWxsYmFja05hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICB9XHJcbiAgZW1pdChldmVudE5hbWUsIGV2ZW50RGF0YSkge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5ldmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBmb3IobGV0IFtldmVudENhbGxiYWNrR3JvdXBOYW1lLCBldmVudENhbGxiYWNrR3JvdXBdIG9mIE9iamVjdC5lbnRyaWVzKGV2ZW50Q2FsbGJhY2tzKSkge1xyXG4gICAgICBmb3IobGV0IGV2ZW50Q2FsbGJhY2sgb2YgZXZlbnRDYWxsYmFja0dyb3VwKSB7XHJcbiAgICAgICAgbGV0IGFkZGl0aW9uYWxBcmd1bWVudHMgPSBPYmplY3QudmFsdWVzKGFyZ3VtZW50cykuc3BsaWNlKDIpXHJcbiAgICAgICAgZXZlbnRDYWxsYmFjayhldmVudERhdGEsIC4uLmFkZGl0aW9uYWxBcmd1bWVudHMpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiTVZDLlRlbXBsYXRlcyA9IHtcclxuICBPYmplY3RRdWVyeVN0cmluZ0Zvcm1hdEludmFsaWRSb290OiBmdW5jdGlvbiBPYmplY3RRdWVyeVN0cmluZ0Zvcm1hdEludmFsaWQoZGF0YSkge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgJ09iamVjdCBRdWVyeSBcInN0cmluZ1wiIHByb3BlcnR5IG11c3QgYmUgZm9ybWF0dGVkIHRvIGZpcnN0IGluY2x1ZGUgXCJbQF1cIi4nXHJcbiAgICBdLmpvaW4oJ1xcbicpXHJcbiAgfSxcclxuICBEYXRhU2NoZW1hTWlzbWF0Y2g6IGZ1bmN0aW9uIERhdGFTY2hlbWFNaXNtYXRjaChkYXRhKSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBgRGF0YSBhbmQgU2NoZW1hIHByb3BlcnRpZXMgZG8gbm90IG1hdGNoLmBcclxuICAgIF0uam9pbignXFxuJylcclxuICB9LFxyXG4gIERhdGFGdW5jdGlvbkludmFsaWQ6IGZ1bmN0aW9uIERhdGFGdW5jdGlvbkludmFsaWQoZGF0YSkge1xyXG4gICAgW1xyXG4gICAgICBgTW9kZWwgRGF0YSBwcm9wZXJ0eSB0eXBlIFwiRnVuY3Rpb25cIiBpcyBub3QgdmFsaWQuYFxyXG4gICAgXS5qb2luKCdcXG4nKVxyXG4gIH0sXHJcbiAgRGF0YVVuZGVmaW5lZDogZnVuY3Rpb24gRGF0YVVuZGVmaW5lZChkYXRhKSB7XHJcbiAgICBbXHJcbiAgICAgIGBNb2RlbCBEYXRhIHByb3BlcnR5IHVuZGVmaW5lZC5gXHJcbiAgICBdLmpvaW4oJ1xcbicpXHJcbiAgfSxcclxuICBTY2hlbWFVbmRlZmluZWQ6IGZ1bmN0aW9uIFNjaGVtYVVuZGVmaW5lZChkYXRhKSB7XHJcbiAgICBbXHJcbiAgICAgIGBNb2RlbCBcIlNjaGVtYVwiIHVuZGVmaW5lZC5gXHJcbiAgICBdLmpvaW4oJ1xcbicpXHJcbiAgfSxcclxufVxyXG5NVkMuVE1QTCA9IE1WQy5UZW1wbGF0ZXNcclxuIiwiTVZDLlV0aWxzID0ge31cclxuIiwiTVZDLlV0aWxzLmlzQXJyYXkgPSBmdW5jdGlvbiBpc0FycmF5KG9iamVjdCkgeyByZXR1cm4gQXJyYXkuaXNBcnJheShvYmplY3QpIH1cclxuTVZDLlV0aWxzLmlzT2JqZWN0ID0gZnVuY3Rpb24gaXNPYmplY3Qob2JqZWN0KSB7XHJcbiAgcmV0dXJuICghQXJyYXkuaXNBcnJheShvYmplY3QpKVxyXG4gICAgPyB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0J1xyXG4gICAgOiBmYWxzZVxyXG59XHJcbk1WQy5VdGlscy5pc0VxdWFsVHlwZSA9IGZ1bmN0aW9uIGlzRXF1YWxUeXBlKHZhbHVlQSwgdmFsdWVCKSB7IHJldHVybiB2YWx1ZUEgPT09IHZhbHVlQiB9XHJcbk1WQy5VdGlscy5pc0hUTUxFbGVtZW50ID0gZnVuY3Rpb24gaXNIVE1MRWxlbWVudChvYmplY3QpIHtcclxuICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcclxufVxyXG4iLCJNVkMuVXRpbHMudHlwZU9mID0gIGZ1bmN0aW9uIHR5cGVPZihkYXRhKSB7XHJcbiAgc3dpdGNoKHR5cGVvZiBkYXRhKSB7XHJcbiAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICBsZXQgX29iamVjdFxyXG4gICAgICBpZihNVkMuVXRpbHMuaXNBcnJheShkYXRhKSkge1xyXG4gICAgICAgIC8vIEFycmF5XHJcbiAgICAgICAgcmV0dXJuICdhcnJheSdcclxuICAgICAgfSBlbHNlIGlmKFxyXG4gICAgICAgIE1WQy5VdGlscy5pc09iamVjdChkYXRhKVxyXG4gICAgICApIHtcclxuICAgICAgICAvLyBPYmplY3RcclxuICAgICAgICByZXR1cm4gJ29iamVjdCdcclxuICAgICAgfSBlbHNlIGlmKFxyXG4gICAgICAgIGRhdGEgPT09IG51bGxcclxuICAgICAgKSB7XHJcbiAgICAgICAgLy8gTnVsbFxyXG4gICAgICAgIHJldHVybiAnbnVsbCdcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gX29iamVjdFxyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnc3RyaW5nJzpcclxuICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICBjYXNlICdib29sZWFuJzpcclxuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XHJcbiAgICBjYXNlICdmdW5jdGlvbic6XHJcbiAgICAgIHJldHVybiB0eXBlb2YgZGF0YVxyXG4gICAgICBicmVha1xyXG4gIH1cclxufVxyXG4iLCJNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0ID0gZnVuY3Rpb24gYWRkUHJvcGVydGllc1RvT2JqZWN0KCkge1xyXG4gIGxldCB0YXJnZXRPYmplY3RcclxuICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgY2FzZSAyOlxyXG4gICAgICBsZXQgcHJvcGVydGllcyA9IGFyZ3VtZW50c1swXVxyXG4gICAgICB0YXJnZXRPYmplY3QgPSBhcmd1bWVudHNbMV1cclxuICAgICAgZm9yKGxldCBbcHJvcGVydHlOYW1lLCBwcm9wZXJ0eVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhwcm9wZXJ0aWVzKSkge1xyXG4gICAgICAgIHRhcmdldE9iamVjdFtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZVxyXG4gICAgICB9XHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlIDM6XHJcbiAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgbGV0IHByb3BlcnR5VmFsdWUgPSBhcmd1bWVudHNbMV1cclxuICAgICAgdGFyZ2V0T2JqZWN0ID0gYXJndW1lbnRzWzJdXHJcbiAgICAgIHRhcmdldE9iamVjdFtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZVxyXG4gICAgICBicmVha1xyXG4gIH1cclxuICByZXR1cm4gdGFyZ2V0T2JqZWN0XHJcbn1cclxuIiwiTVZDLlV0aWxzLm9iamVjdFF1ZXJ5ID0gZnVuY3Rpb24gb2JqZWN0UXVlcnkoXHJcbiAgc3RyaW5nLFxyXG4gIGNvbnRleHRcclxuKSB7XHJcbiAgbGV0IHN0cmluZ0RhdGEgPSBNVkMuVXRpbHMub2JqZWN0UXVlcnkucGFyc2VOb3RhdGlvbihzdHJpbmcpXHJcbiAgaWYoc3RyaW5nRGF0YVswXSA9PT0gJ0AnKSBzdHJpbmdEYXRhLnNwbGljZSgwLCAxKVxyXG4gIGlmKCFzdHJpbmdEYXRhLmxlbmd0aCkgcmV0dXJuIGNvbnRleHRcclxuICBjb250ZXh0ID0gKE1WQy5VdGlscy5pc09iamVjdChjb250ZXh0KSlcclxuICAgID8gT2JqZWN0LmVudHJpZXMoY29udGV4dClcclxuICAgIDogY29udGV4dFxyXG4gIHJldHVybiBzdHJpbmdEYXRhLnJlZHVjZSgob2JqZWN0LCBmcmFnbWVudCwgZnJhZ21lbnRJbmRleCwgZnJhZ21lbnRzKSA9PiB7XHJcbiAgICBsZXQgcHJvcGVydGllcyA9IFtdXHJcbiAgICBmcmFnbWVudCA9IE1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZUZyYWdtZW50KGZyYWdtZW50KVxyXG4gICAgZm9yKGxldCBbcHJvcGVydHlLZXksIHByb3BlcnR5VmFsdWVdIG9mIG9iamVjdCkge1xyXG4gICAgICBpZihwcm9wZXJ0eUtleS5tYXRjaChmcmFnbWVudCkpIHtcclxuICAgICAgICBpZihmcmFnbWVudEluZGV4ID09PSBmcmFnbWVudHMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMuY29uY2F0KFtbcHJvcGVydHlLZXksIHByb3BlcnR5VmFsdWVdXSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMuY29uY2F0KE9iamVjdC5lbnRyaWVzKHByb3BlcnR5VmFsdWUpKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgb2JqZWN0ID0gcHJvcGVydGllc1xyXG4gICAgcmV0dXJuIG9iamVjdFxyXG4gIH0sIGNvbnRleHQpXHJcbn1cclxuTVZDLlV0aWxzLm9iamVjdFF1ZXJ5LnBhcnNlTm90YXRpb24gPSBmdW5jdGlvbiBwYXJzZU5vdGF0aW9uKHN0cmluZykge1xyXG4gIGlmKFxyXG4gICAgc3RyaW5nLmNoYXJBdCgwKSA9PT0gJ1snICYmXHJcbiAgICBzdHJpbmcuY2hhckF0KHN0cmluZy5sZW5ndGggLSAxKSA9PSAnXSdcclxuICApIHtcclxuICAgIHN0cmluZyA9IHN0cmluZ1xyXG4gICAgICAuc2xpY2UoMSwgLTEpXHJcbiAgICAgIC5zcGxpdCgnXVsnKVxyXG4gIH0gZWxzZSB7XHJcbiAgICBzdHJpbmcgPSBzdHJpbmdcclxuICAgICAgLnNwbGl0KCcuJylcclxuICB9XHJcbiAgcmV0dXJuIHN0cmluZ1xyXG59XHJcbk1WQy5VdGlscy5vYmplY3RRdWVyeS5wYXJzZUZyYWdtZW50ID0gZnVuY3Rpb24gcGFyc2VGcmFnbWVudChmcmFnbWVudCkge1xyXG4gIGlmKFxyXG4gICAgZnJhZ21lbnQuY2hhckF0KDApID09PSAnLycgJiZcclxuICAgIGZyYWdtZW50LmNoYXJBdChmcmFnbWVudC5sZW5ndGggLSAxKSA9PSAnLydcclxuICApIHtcclxuICAgIGZyYWdtZW50ID0gZnJhZ21lbnQuc2xpY2UoMSwgLTEpXHJcbiAgICBmcmFnbWVudCA9IG5ldyBSZWdFeHAoZnJhZ21lbnQpXHJcbiAgfVxyXG4gIHJldHVybiBmcmFnbWVudFxyXG59XHJcbiIsIk1WQy5VdGlscy50b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzID0gZnVuY3Rpb24gdG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyhcclxuICB0b2dnbGVNZXRob2QsXHJcbiAgZXZlbnRzLFxyXG4gIHRhcmdldE9iamVjdHMsXHJcbiAgY2FsbGJhY2tzXHJcbikge1xyXG4gIGZvcihsZXQgW2V2ZW50U2V0dGluZ3MsIGV2ZW50Q2FsbGJhY2tOYW1lXSBvZiBPYmplY3QuZW50cmllcyhldmVudHMpKSB7XHJcbiAgICBsZXQgZXZlbnREYXRhID0gZXZlbnRTZXR0aW5ncy5zcGxpdCgnICcpXHJcbiAgICBsZXQgZXZlbnRUYXJnZXRTZXR0aW5ncyA9IGV2ZW50RGF0YVswXVxyXG4gICAgbGV0IGV2ZW50TmFtZSA9IGV2ZW50RGF0YVsxXVxyXG4gICAgbGV0IGV2ZW50VGFyZ2V0cyA9IE1WQy5VdGlscy5vYmplY3RRdWVyeShcclxuICAgICAgZXZlbnRUYXJnZXRTZXR0aW5ncyxcclxuICAgICAgdGFyZ2V0T2JqZWN0c1xyXG4gICAgKVxyXG4gICAgZm9yKGxldCBbZXZlbnRUYXJnZXROYW1lLCBldmVudFRhcmdldF0gb2YgZXZlbnRUYXJnZXRzKSB7XHJcbiAgICAgIGxldCBldmVudE1ldGhvZE5hbWUgPSAodG9nZ2xlTWV0aG9kID09PSAnb24nKVxyXG4gICAgICA/IChcclxuICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0IHx8XHJcbiAgICAgICAgZXZlbnRUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxyXG4gICAgICApID8gJ2FkZEV2ZW50TGlzdGVuZXInXHJcbiAgICAgICAgOiAnb24nXHJcbiAgICAgIDogKFxyXG4gICAgICAgIGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QgfHxcclxuICAgICAgICBldmVudFRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XHJcbiAgICAgICkgPyAncmVtb3ZlRXZlbnRMaXN0ZW5lcidcclxuICAgICAgICA6ICdvZmYnXHJcbiAgICAgIGxldCBldmVudENhbGxiYWNrID0gTVZDLlV0aWxzLm9iamVjdFF1ZXJ5KFxyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2tOYW1lLFxyXG4gICAgICAgIGNhbGxiYWNrc1xyXG4gICAgICApWzBdWzFdXHJcbiAgICAgIGlmKGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuICAgICAgICBmb3IobGV0IF9ldmVudFRhcmdldCBvZiBldmVudFRhcmdldCkge1xyXG4gICAgICAgICAgX2V2ZW50VGFyZ2V0W2V2ZW50TWV0aG9kTmFtZV0oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmKGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpe1xyXG4gICAgICAgIGV2ZW50VGFyZ2V0W2V2ZW50TWV0aG9kTmFtZV0oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGV2ZW50VGFyZ2V0W2V2ZW50TWV0aG9kTmFtZV0oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbk1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzID0gZnVuY3Rpb24gYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cygpIHtcclxuICB0aGlzLnRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoJ29uJywgLi4uYXJndW1lbnRzKVxyXG59XHJcbk1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIHVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKCkge1xyXG4gIHRoaXMudG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cygnb2ZmJywgLi4uYXJndW1lbnRzKVxyXG59XHJcbiIsIk1WQy5VdGlscy52YWxpZGF0ZURhdGFTY2hlbWEgPSBmdW5jdGlvbiB2YWxpZGF0ZURhdGFTY2hlbWEoZGF0YSwgc2NoZW1hKSB7XHJcbiAgaWYoc2NoZW1hKSB7XHJcbiAgICBzd2l0Y2goTVZDLlV0aWxzLnR5cGVPZihkYXRhKSkge1xyXG4gICAgICBjYXNlICdhcnJheSc6XHJcbiAgICAgICAgbGV0IGFycmF5ID0gW11cclxuICAgICAgICBzY2hlbWEgPSAoTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgPyBzY2hlbWEoKVxyXG4gICAgICAgICAgOiBzY2hlbWFcclxuICAgICAgICBpZihcclxuICAgICAgICAgIE1WQy5VdGlscy5pc0VxdWFsVHlwZShcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpLFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKGFycmF5KVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coc2NoZW1hLm5hbWUpXHJcbiAgICAgICAgICBmb3IobGV0IFthcnJheUtleSwgYXJyYXlWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoZGF0YSkpIHtcclxuICAgICAgICAgICAgYXJyYXkucHVzaChcclxuICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlRGF0YVNjaGVtYShhcnJheVZhbHVlKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnJheVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgICAgbGV0IG9iamVjdCA9IHt9XHJcbiAgICAgICAgc2NoZW1hID0gKE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgID8gc2NoZW1hKClcclxuICAgICAgICAgIDogc2NoZW1hXHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBNVkMuVXRpbHMuaXNFcXVhbFR5cGUoXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSxcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihvYmplY3QpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhzY2hlbWEubmFtZSlcclxuICAgICAgICAgIGZvcihsZXQgW29iamVjdEtleSwgb2JqZWN0VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XHJcbiAgICAgICAgICAgIG9iamVjdFtvYmplY3RLZXldID0gdGhpcy52YWxpZGF0ZURhdGFTY2hlbWEob2JqZWN0VmFsdWUsIHNjaGVtYVtvYmplY3RLZXldKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb2JqZWN0XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnc3RyaW5nJzpcclxuICAgICAgY2FzZSAnbnVtYmVyJzpcclxuICAgICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICAgICAgc2NoZW1hID0gKE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgID8gc2NoZW1hKClcclxuICAgICAgICAgIDogc2NoZW1hXHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBNVkMuVXRpbHMuaXNFcXVhbFR5cGUoXHJcbiAgICAgICAgICAgIE1WQy5VdGlscy50eXBlT2Yoc2NoZW1hKSxcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihkYXRhKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coc2NoZW1hLm5hbWUpXHJcbiAgICAgICAgICByZXR1cm4gZGF0YVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aHJvdyBNVkMuVE1QTFxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdudWxsJzpcclxuICAgICAgICBpZihcclxuICAgICAgICAgIE1WQy5VdGlscy5pc0VxdWFsVHlwZShcclxuICAgICAgICAgICAgTVZDLlV0aWxzLnR5cGVPZihzY2hlbWEpLFxyXG4gICAgICAgICAgICBNVkMuVXRpbHMudHlwZU9mKGRhdGEpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICByZXR1cm4gZGF0YVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxyXG4gICAgICAgIHRocm93IE1WQy5UTVBMXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnZnVuY3Rpb24nOlxyXG4gICAgICAgIHRocm93IE1WQy5UTVBMXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgdGhyb3cgTVZDLlRNUExcclxuICB9XHJcbn1cclxuIiwiTVZDLkNoYW5uZWxzID0gY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2NoYW5uZWxzKCkge1xyXG4gICAgdGhpcy5jaGFubmVscyA9ICh0aGlzLmNoYW5uZWxzKVxyXG4gICAgICA/IHRoaXMuY2hhbm5lbHNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbHNcclxuICB9XHJcbiAgY2hhbm5lbChjaGFubmVsTmFtZSkge1xyXG4gICAgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdID0gKHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXSlcclxuICAgICAgPyB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICAgICAgOiBuZXcgTVZDLkNoYW5uZWxzLkNoYW5uZWwoKVxyXG4gICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxuICBvZmYoY2hhbm5lbE5hbWUpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbn1cclxuIiwiTVZDLkNoYW5uZWxzLkNoYW5uZWwgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfcmVzcG9uc2VzKCkge1xyXG4gICAgdGhpcy5yZXNwb25zZXMgPSAodGhpcy5yZXNwb25zZXMpXHJcbiAgICAgID8gdGhpcy5yZXNwb25zZXNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMucmVzcG9uc2VzXHJcbiAgfVxyXG4gIHJlc3BvbnNlKHJlc3BvbnNlTmFtZSwgcmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgaWYocmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgICB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSA9IHJlc3BvbnNlQ2FsbGJhY2tcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VdXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlcXVlc3QocmVzcG9uc2VOYW1lLCByZXF1ZXN0RGF0YSkge1xyXG4gICAgaWYodGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0pIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKHJlcXVlc3REYXRhKVxyXG4gICAgfVxyXG4gIH1cclxuICBvZmYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZihyZXNwb25zZU5hbWUpIHtcclxuICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmb3IobGV0IFtyZXNwb25zZU5hbWVdIG9mIE9iamVjdC5rZXlzKHRoaXMuX3Jlc3BvbnNlcykpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJNVkMuQmFzZSA9IGNsYXNzIGV4dGVuZHMgTVZDLkV2ZW50cyB7XHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MsIG9wdGlvbnMsIGNvbmZpZ3VyYXRpb24pIHtcclxuICAgIHN1cGVyKClcclxuICAgIGlmKGNvbmZpZ3VyYXRpb24pIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uXHJcbiAgICBpZihvcHRpb25zKSB0aGlzLl9vcHRpb25zID0gb3B0aW9uc1xyXG4gICAgaWYoc2V0dGluZ3MpIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcclxuICB9XHJcbiAgZ2V0IF9jb25maWd1cmF0aW9uKCkge1xyXG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gKHRoaXMuY29uZmlndXJhdGlvbilcclxuICAgICAgPyB0aGlzLmNvbmZpZ3VyYXRpb25cclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblxyXG4gIH1cclxuICBzZXQgX2NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikgeyB0aGlzLmNvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uIH1cclxuICBnZXQgX29wdGlvbnMoKSB7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSAodGhpcy5vcHRpb25zKVxyXG4gICAgICA/IHRoaXMub3B0aW9uc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zXHJcbiAgfVxyXG4gIHNldCBfb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfVxyXG4gIGdldCBfc2V0dGluZ3MoKSB7XHJcbiAgICB0aGlzLnNldHRpbmdzID0gKHRoaXMuc2V0dGluZ3MpXHJcbiAgICAgID8gdGhpcy5zZXR0aW5nc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5nc1xyXG4gIH1cclxuICBzZXQgX3NldHRpbmdzKHNldHRpbmdzKSB7XHJcbiAgICB0aGlzLnNldHRpbmdzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcclxuICAgICAgc2V0dGluZ3MsIHRoaXMuX3NldHRpbmdzXHJcbiAgICApXHJcbiAgfVxyXG59XHJcbiIsIk1WQy5TZXJ2aWNlID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5kZWZhdWx0cyB8fCB7XG4gICAgY29udGVudFR5cGU6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSxcbiAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgfSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlcygpIHsgcmV0dXJuIFsnJywgJ2FycmF5YnVmZmVyJywgJ2Jsb2InLCAnZG9jdW1lbnQnLCAnanNvbicsICd0ZXh0J10gfVxuICBnZXQgX3Jlc3BvbnNlVHlwZSgpIHsgcmV0dXJuIHRoaXMucmVzcG9uc2VUeXBlIH1cbiAgc2V0IF9yZXNwb25zZVR5cGUocmVzcG9uc2VUeXBlKSB7XG4gICAgdGhpcy5feGhyLnJlc3BvbnNlVHlwZSA9IHRoaXMuX3Jlc3BvbnNlVHlwZXMuZmluZChcbiAgICAgIChyZXNwb25zZVR5cGVJdGVtKSA9PiByZXNwb25zZVR5cGVJdGVtID09PSByZXNwb25zZVR5cGVcbiAgICApIHx8IHRoaXMuX2RlZmF1bHRzLnJlc3BvbnNlVHlwZVxuICB9XG4gIGdldCBfdHlwZSgpIHsgcmV0dXJuIHRoaXMudHlwZSB9XG4gIHNldCBfdHlwZSh0eXBlKSB7IHRoaXMudHlwZSA9IHR5cGUgfVxuICBnZXQgX3VybCgpIHsgcmV0dXJuIHRoaXMudXJsIH1cbiAgc2V0IF91cmwodXJsKSB7IHRoaXMudXJsID0gdXJsIH1cbiAgZ2V0IF9oZWFkZXJzKCkgeyByZXR1cm4gdGhpcy5oZWFkZXJzIHx8IFtdIH1cbiAgc2V0IF9oZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLl9oZWFkZXJzLmxlbmd0aCA9IDBcbiAgICBmb3IobGV0IGhlYWRlciBvZiBoZWFkZXJzKSB7XG4gICAgICB0aGlzLl94aHIuc2V0UmVxdWVzdEhlYWRlcih7aGVhZGVyfVswXSwge2hlYWRlcn1bMV0pXG4gICAgICB0aGlzLl9oZWFkZXJzLnB1c2goaGVhZGVyKVxuICAgIH1cbiAgfVxuICBnZXQgX3hocigpIHtcbiAgICB0aGlzLnhociA9ICh0aGlzLnhocilcbiAgICAgID8gdGhpcy54aHJcbiAgICAgIDogbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICByZXR1cm4gdGhpcy54aHJcbiAgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgbmV3WEhSKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZih0aGlzLl94aHIuc3RhdHVzID09PSAyMDApIHRoaXMuX3hoci5hYm9ydCgpXG4gICAgICB0aGlzLl94aHIub3Blbih0aGlzLl90eXBlLCB0aGlzLl91cmwpXG4gICAgICB0aGlzLl94aHIub25sb2FkID0gcmVzb2x2ZVxuICAgICAgdGhpcy5feGhyLm9uZXJyb3IgPSByZWplY3RcbiAgICAgIHRoaXMuX3hoci5zZW5kKHRoaXMuX2RhdGEpXG4gICAgfSlcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKHNldHRpbmdzLnR5cGUpIHRoaXMuX3R5cGUgPSBzZXR0aW5ncy50eXBlXG4gICAgICBpZihzZXR0aW5ncy51cmwpIHRoaXMuX3VybCA9IHNldHRpbmdzLnVybFxuICAgICAgaWYoc2V0dGluZ3MuZGF0YSkgdGhpcy5fZGF0YSA9IHNldHRpbmdzLmRhdGEgfHwgbnVsbFxuICAgICAgaWYoc2V0dGluZ3MuaGVhZGVycykgdGhpcy5faGVhZGVycyA9IHNldHRpbmdzLmhlYWRlcnMgfHwgW3RoaXMuX2RlZmF1bHRzLmNvbnRlbnRUeXBlXVxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5yZXNwb25zZVR5cGUpIHRoaXMuX3Jlc3BvbnNlVHlwZSA9IHRoaXMuX3NldHRpbmdzLnJlc3BvbnNlVHlwZVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBpZihPYmplY3Qua2V5cyh0aGlzLnNldHRpbmdzKS5sZW5ndGgpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLnNldHRpbmdzLnR5cGVcbiAgICAgIGRlbGV0ZSB0aGlzLnNldHRpbmdzLnVybFxuICAgICAgZGVsZXRlIHRoaXMuc2V0dGluZ3MuZGF0YVxuICAgICAgZGVsZXRlIHRoaXMuc2V0dGluZ3MuaGVhZGVyc1xuICAgICAgZGVsZXRlIHRoaXMuc2V0dGluZ3MucmVzcG9uc2VUeXBlXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuIiwiTVZDLk1vZGVsID0gY2xhc3MgZXh0ZW5kcyBNVkMuQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgX2lzU2V0dGluZygpIHsgcmV0dXJuIHRoaXMuaXNTZXR0aW5nIH1cbiAgc2V0IF9pc1NldHRpbmcoaXNTZXR0aW5nKSB7IHRoaXMuaXNTZXR0aW5nID0gaXNTZXR0aW5nIH1cbiAgZ2V0IF9kZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuX2RlZmF1bHRzIH1cbiAgc2V0IF9kZWZhdWx0cyhkZWZhdWx0cykge1xuICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgIHRoaXMuc2V0KHRoaXMuZGVmYXVsdHMpXG4gIH1cbiAgZ2V0IF9zY2hlbWEoKSB7IHJldHVybiB0aGlzLl9zY2hlbWEgfVxuICBzZXQgX3NjaGVtYShzY2hlbWEpIHsgdGhpcy5zY2hlbWEgPSBzY2hlbWEgfVxuICBnZXQgX2hpc3Rpb2dyYW0oKSB7IHJldHVybiB0aGlzLmhpc3Rpb2dyYW0gfHwge1xuICAgIGxlbmd0aDogMVxuICB9IH1cbiAgc2V0IF9oaXN0aW9ncmFtKGhpc3Rpb2dyYW0pIHtcbiAgICB0aGlzLmhpc3Rpb2dyYW0gPSBPYmplY3QuYXNzaWduKFxuICAgICAgdGhpcy5faGlzdGlvZ3JhbSxcbiAgICAgIGhpc3Rpb2dyYW1cbiAgICApXG4gIH1cbiAgZ2V0IF9oaXN0b3J5KCkge1xuICAgIHRoaXMuaGlzdG9yeSA9ICh0aGlzLmhpc3RvcnkpXG4gICAgICA/IHRoaXMuaGlzdG9yeVxuICAgICAgOiBbXVxuICAgIHJldHVybiB0aGlzLmhpc3RvcnlcbiAgfVxuICBzZXQgX2hpc3RvcnkoZGF0YSkge1xuICAgIGlmKFxuICAgICAgT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoXG4gICAgKSB7XG4gICAgICBpZih0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVuc2hpZnQodGhpcy5wYXJzZShkYXRhKSlcbiAgICAgICAgdGhpcy5faGlzdG9yeS5zcGxpY2UodGhpcy5faGlzdGlvZ3JhbS5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfZGF0YSgpIHtcbiAgICB0aGlzLmRhdGEgPSAgKHRoaXMuZGF0YSlcbiAgICAgID8gdGhpcy5kYXRhXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YVxuICB9XG4gIGdldCBfZGF0YUV2ZW50cygpIHtcbiAgICB0aGlzLmRhdGFFdmVudHMgPSAodGhpcy5kYXRhRXZlbnRzKVxuICAgICAgPyB0aGlzLmRhdGFFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5kYXRhRXZlbnRzXG4gIH1cbiAgc2V0IF9kYXRhRXZlbnRzKGRhdGFFdmVudHMpIHtcbiAgICB0aGlzLmRhdGFFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgZGF0YUV2ZW50cywgdGhpcy5fZGF0YUV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2RhdGFDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5kYXRhQ2FsbGJhY2tzID0gKHRoaXMuZGF0YUNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5kYXRhQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YUNhbGxiYWNrc1xuICB9XG4gIHNldCBfZGF0YUNhbGxiYWNrcyhkYXRhQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5kYXRhQ2FsbGJhY2tzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGRhdGFDYWxsYmFja3MsIHRoaXMuX2RhdGFDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGVuYWJsZURhdGFFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5kYXRhRXZlbnRzLCB0aGlzLCB0aGlzLmRhdGFDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZURhdGFFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmRhdGFFdmVudHMsIHRoaXMsIHRoaXMuZGF0YUNhbGxiYWNrcylcbiAgfVxuICBnZXQoKSB7XG4gICAgbGV0IHByb3BlcnR5ID0gYXJndW1lbnRzWzBdXG4gICAgcmV0dXJuIHRoaXMuX2RhdGFbJ18nLmNvbmNhdChwcm9wZXJ0eSldXG4gIH1cbiAgc2V0KCkge1xuICAgIHRoaXMuX2hpc3RvcnkgPSB0aGlzLnBhcnNlKClcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuX2lzU2V0dGluZyA9IHRydWVcbiAgICAgICAgICB9IGVsc2UgaWYoaW5kZXggPT09IChfYXJndW1lbnRzLmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICB0aGlzLl9pc1NldHRpbmcgPSBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICB2YXIga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHZhciB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAzOlxuICAgICAgICB2YXIga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHZhciB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICB2YXIgc2lsZW50ID0gYXJndW1lbnRzWzJdXG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUsIHNpbGVudClcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgdW5zZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpKSB7XG4gICAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUsIHNpbGVudCkge1xuICAgIGlmKCF0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV0pIHtcbiAgICAgIGxldCBjb250ZXh0ID0gdGhpc1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXG4gICAgICAgIHRoaXMuX2RhdGEsXG4gICAgICAgIHtcbiAgICAgICAgICBbJ18nLmNvbmNhdChrZXkpXToge1xuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpc1trZXldIH0sXG4gICAgICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgdGhpc1trZXldID0gdmFsdWVcbiAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgIXNpbGVudCAmJlxuICAgICAgICAgICAgICAgICFjb250ZXh0Ll9pc1NldHRpbmdcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNldFZhbHVlRXZlbnROYW1lID0gWydzZXQnLCAnOicsIGtleV0uam9pbignJylcbiAgICAgICAgICAgICAgICBsZXQgc2V0RXZlbnROYW1lID0gJ3NldCdcbiAgICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgICBzZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgICBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApXG4gICAgfVxuICAgIHRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXSA9IHZhbHVlXG4gIH1cbiAgdW5zZXREYXRhUHJvcGVydHkoa2V5KSB7XG4gICAgbGV0IHVuc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3Vuc2V0JywgJzonLCBrZXldLmpvaW4oJycpXG4gICAgbGV0IHVuc2V0RXZlbnROYW1lID0gJ3Vuc2V0J1xuICAgIGxldCB1bnNldFZhbHVlID0gdGhpcy5fZGF0YVtrZXldXG4gICAgZGVsZXRlIHRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXVxuICAgIGRlbGV0ZSB0aGlzLl9kYXRhW2tleV1cbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldFZhbHVlRXZlbnROYW1lLFxuICAgICAge1xuICAgICAgICBuYW1lOiB1bnNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgdmFsdWU6IHVuc2V0VmFsdWUsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApXG4gICAgdGhpcy5lbWl0KFxuICAgICAgdW5zZXRFdmVudE5hbWUsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IHVuc2V0RXZlbnROYW1lLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgdmFsdWU6IHVuc2V0VmFsdWUsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApXG4gIH1cbiAgcGFyc2UoZGF0YSkge1xuICAgIGRhdGEgPSBkYXRhIHx8IHRoaXMuX2RhdGFcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShPYmplY3QuYXNzaWduKHt9LCBkYXRhKSkpXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICBpZih0aGlzLnNldHRpbmdzLmhpc3Rpb2dyYW0pIHRoaXMuX2hpc3Rpb2dyYW0gPSB0aGlzLnNldHRpbmdzLmhpc3Rpb2dyYW1cbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MuZGF0YSkgdGhpcy5zZXQodGhpcy5zZXR0aW5ncy5kYXRhKVxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5kYXRhQ2FsbGJhY2tzKSB0aGlzLl9kYXRhQ2FsbGJhY2tzID0gdGhpcy5zZXR0aW5ncy5kYXRhQ2FsbGJhY2tzXG4gICAgICBpZih0aGlzLnNldHRpbmdzLmRhdGFFdmVudHMpIHRoaXMuX2RhdGFFdmVudHMgPSB0aGlzLnNldHRpbmdzLmRhdGFFdmVudHNcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3Muc2NoZW1hKSB0aGlzLl9zY2hlbWEgPSB0aGlzLnNldHRpbmdzLnNjaGVtYVxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5kZWZhdWx0cykgdGhpcy5fZGVmYXVsdHMgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzXG4gICAgICBpZihcbiAgICAgICAgdGhpcy5kYXRhRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZGF0YUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlRGF0YUV2ZW50cygpXG4gICAgICB9XG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICAhdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5kYXRhRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZGF0YUNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZURhdGFFdmVudHMoKVxuICAgICAgfVxuICAgICAgZGVsZXRlIHRoaXMuX2hpc3Rpb2dyYW1cbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YUNhbGxiYWNrc1xuICAgICAgZGVsZXRlIHRoaXMuX2RhdGFFdmVudHNcbiAgICAgIGRlbGV0ZSB0aGlzLl9zY2hlbWFcbiAgICAgIGRlbGV0ZSB0aGlzLl9kZWZhdWx0c1xuICAgICAgaWYoXG4gICAgICAgIHRoaXMuZGF0YUV2ZW50cyAmJlxuICAgICAgICB0aGlzLmRhdGFDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVEYXRhRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgfVxufVxuIiwiTVZDLkVtaXR0ZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5Nb2RlbCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgICBpZih0aGlzLnNldHRpbmdzKSB7XHJcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MubmFtZSkgdGhpcy5fbmFtZSA9IHRoaXMuc2V0dGluZ3MubmFtZVxyXG4gICAgfVxyXG4gIH1cclxuICBnZXQgX25hbWUoKSB7IHJldHVybiB0aGlzLm5hbWUgfVxyXG4gIHNldCBfbmFtZShuYW1lKSB7IHRoaXMubmFtZSA9IG5hbWUgfVxyXG4gIGVtaXNzaW9uKCkge1xyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICB0aGlzLm5hbWUsXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiB0aGlzLm5hbWUsXHJcbiAgICAgICAgZGF0YTogdGhpcy5wYXJzZSgpXHJcbiAgICAgIH1cclxuICAgIClcclxuICB9XHJcbn1cclxuIiwiTVZDLlZpZXcgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfZWxlbWVudE5hbWUoKSB7IHJldHVybiB0aGlzLl9lbGVtZW50LnRhZ05hbWUgfVxuICBzZXQgX2VsZW1lbnROYW1lKGVsZW1lbnROYW1lKSB7XG4gICAgaWYoIXRoaXMuX2VsZW1lbnQpIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnROYW1lKVxuICB9XG4gIGdldCBfZWxlbWVudCgpIHsgcmV0dXJuIHRoaXMuZWxlbWVudCB9XG4gIHNldCBfZWxlbWVudChlbGVtZW50KSB7XG4gICAgaWYoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgfSBlbHNlIGlmKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50KVxuICAgIH1cbiAgICB0aGlzLmVsZW1lbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudCwge1xuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICB9KVxuICB9XG4gIGdldCBfYXR0cmlidXRlcygpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQuYXR0cmlidXRlcyB9XG4gIHNldCBfYXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgZm9yKGxldCBbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGVWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlS2V5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IF91aSgpIHtcbiAgICB0aGlzLnVpID0gKHRoaXMudWkpXG4gICAgICA/IHRoaXMudWlcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy51aVxuICB9XG4gIHNldCBfdWkodWkpIHtcbiAgICBpZighdGhpcy5fdWlbJyRlbGVtZW50J10pIHRoaXMuX3VpWyckZWxlbWVudCddID0gdGhpcy5lbGVtZW50XG4gICAgZm9yKGxldCBbdWlLZXksIHVpVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHVpKSkge1xuICAgICAgaWYodWlWYWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuX3VpW3VpS2V5XSA9IHVpVmFsdWVcbiAgICAgIH0gZWxzZSBpZih0eXBlb2YgdWlWYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fdWlbdWlLZXldID0gdGhpcy5fZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHVpVmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfdWlFdmVudHMoKSB7IHJldHVybiB0aGlzLnVpRXZlbnRzIH1cbiAgc2V0IF91aUV2ZW50cyh1aUV2ZW50cykgeyB0aGlzLnVpRXZlbnRzID0gdWlFdmVudHMgfVxuICBnZXQgX3VpQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMudWlDYWxsYmFja3MgPSAodGhpcy51aUNhbGxiYWNrcylcbiAgICAgID8gdGhpcy51aUNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnVpQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF91aUNhbGxiYWNrcyh1aUNhbGxiYWNrcykge1xuICAgIHRoaXMudWlDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdWlDYWxsYmFja3MsIHRoaXMuX3VpQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfb2JzZXJ2ZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5vYnNlcnZlckNhbGxiYWNrcyA9ICh0aGlzLm9ic2VydmVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX29ic2VydmVyQ2FsbGJhY2tzKG9ic2VydmVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5vYnNlcnZlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBvYnNlcnZlckNhbGxiYWNrcywgdGhpcy5fb2JzZXJ2ZXJDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF9lbWl0dGVycygpIHtcbiAgICB0aGlzLmVtaXR0ZXJzID0gKHRoaXMuZW1pdHRlcnMpXG4gICAgICA/IHRoaXMuZW1pdHRlcnNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyc1xuICB9XG4gIHNldCBfZW1pdHRlcnMoZW1pdHRlcnMpIHtcbiAgICB0aGlzLmVtaXR0ZXJzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGVtaXR0ZXJzLCB0aGlzLl9lbWl0dGVyc1xuICAgIClcbiAgfVxuICBnZXQgZWxlbWVudE9ic2VydmVyKCkge1xuICAgIHRoaXMuX2VsZW1lbnRPYnNlcnZlciA9ICh0aGlzLl9lbGVtZW50T2JzZXJ2ZXIpXG4gICAgICA/IHRoaXMuX2VsZW1lbnRPYnNlcnZlclxuICAgICAgOiBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLmVsZW1lbnRPYnNlcnZlLmJpbmQodGhpcykpXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRPYnNlcnZlclxuICB9XG4gIGdldCBfaW5zZXJ0KCkgeyByZXR1cm4gdGhpcy5pbnNlcnQgfVxuICBzZXQgX2luc2VydChpbnNlcnQpIHsgdGhpcy5pbnNlcnQgPSBpbnNlcnQgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZ2V0IF90ZW1wbGF0ZXMoKSB7XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSAodGhpcy50ZW1wbGF0ZXMpXG4gICAgICA/IHRoaXMudGVtcGxhdGVzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGVzXG4gIH1cbiAgc2V0IF90ZW1wbGF0ZXModGVtcGxhdGVzKSB7XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdGVtcGxhdGVzLCB0aGlzLl90ZW1wbGF0ZXNcbiAgICApXG4gIH1cbiAgZWxlbWVudE9ic2VydmUobXV0YXRpb25SZWNvcmRMaXN0LCBvYnNlcnZlcikge1xuICAgIGZvcihsZXQgW211dGF0aW9uUmVjb3JkSW5kZXgsIG11dGF0aW9uUmVjb3JkXSBvZiBPYmplY3QuZW50cmllcyhtdXRhdGlvblJlY29yZExpc3QpKSB7XG4gICAgICBzd2l0Y2gobXV0YXRpb25SZWNvcmQudHlwZSkge1xuICAgICAgICBjYXNlICdjaGlsZExpc3QnOlxuICAgICAgICAgIGxldCBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMgPSBbJ2FkZGVkTm9kZXMnLCAncmVtb3ZlZE5vZGVzJ11cbiAgICAgICAgICBmb3IobGV0IG11dGF0aW9uUmVjb3JkQ2F0ZWdvcnkgb2YgbXV0YXRpb25SZWNvcmRDYXRlZ29yaWVzKSB7XG4gICAgICAgICAgICBpZihtdXRhdGlvblJlY29yZFttdXRhdGlvblJlY29yZENhdGVnb3J5XS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgdGhpcy5yZXNldFVJKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYXV0b0luc2VydCgpIHtcbiAgICBpZih0aGlzLmluc2VydCkge1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLmluc2VydC5lbGVtZW50KVxuICAgICAgLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgZWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQodGhpcy5pbnNlcnQubWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBhdXRvUmVtb3ZlKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5lbGVtZW50ICYmXG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICkgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICB9XG4gIGVuYWJsZUVsZW1lbnQoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihzZXR0aW5ncy5lbGVtZW50TmFtZSkgdGhpcy5fZWxlbWVudE5hbWUgPSBzZXR0aW5ncy5lbGVtZW50TmFtZVxuICAgIGlmKHNldHRpbmdzLmVsZW1lbnQpIHRoaXMuX2VsZW1lbnQgPSBzZXR0aW5ncy5lbGVtZW50XG4gICAgaWYoc2V0dGluZ3MuYXR0cmlidXRlcykgdGhpcy5fYXR0cmlidXRlcyA9IHNldHRpbmdzLmF0dHJpYnV0ZXNcbiAgICBpZihzZXR0aW5ncy50ZW1wbGF0ZXMpIHRoaXMuX3RlbXBsYXRlcyA9IHNldHRpbmdzLnRlbXBsYXRlc1xuICAgIGlmKHNldHRpbmdzLmluc2VydCkgdGhpcy5faW5zZXJ0ID0gc2V0dGluZ3MuaW5zZXJ0XG4gIH1cbiAgZGlzYWJsZUVsZW1lbnQoc2V0dGluZ3MpIHtcbiAgICBzZXR0aW5ncyA9IHNldHRpbmdzIHx8IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHRoaXMuZWxlbWVudCAmJlxuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnRcbiAgICApIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcbiAgICBpZih0aGlzLmVsZW1lbnQpIGRlbGV0ZSB0aGlzLmVsZW1lbnRcbiAgICBpZih0aGlzLmF0dHJpYnV0ZXMpIGRlbGV0ZSB0aGlzLmF0dHJpYnV0ZXNcbiAgICBpZih0aGlzLnRlbXBsYXRlcykgZGVsZXRlIHRoaXMudGVtcGxhdGVzXG4gICAgaWYodGhpcy5pbnNlcnQpIGRlbGV0ZSB0aGlzLmluc2VydFxuICB9XG4gIHJlc2V0VUkoKSB7XG4gICAgdGhpcy5kaXNhYmxlVUkoKVxuICAgIHRoaXMuZW5hYmxlVUkoKVxuICB9XG4gIGVuYWJsZVVJKHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzXG4gICAgaWYoc2V0dGluZ3MudWkpIHRoaXMuX3VpID0gc2V0dGluZ3MudWlcbiAgICBpZihzZXR0aW5ncy51aUNhbGxiYWNrcykgdGhpcy5fdWlDYWxsYmFja3MgPSBzZXR0aW5ncy51aUNhbGxiYWNrc1xuICAgIGlmKHNldHRpbmdzLnVpRXZlbnRzKSB7XG4gICAgICB0aGlzLl91aUV2ZW50cyA9IHNldHRpbmdzLnVpRXZlbnRzXG4gICAgICB0aGlzLmVuYWJsZVVJRXZlbnRzKClcbiAgICB9XG4gIH1cbiAgZGlzYWJsZVVJKHNldHRpbmdzKSB7XG4gICAgc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB0aGlzLnNldHRpbmdzXG4gICAgaWYoc2V0dGluZ3MudWlFdmVudHMpIHtcbiAgICAgIHRoaXMuZGlzYWJsZVVJRXZlbnRzKClcbiAgICAgIGRlbGV0ZSB0aGlzLl91aUV2ZW50c1xuICAgIH1cbiAgICBkZWxldGUgdGhpcy51aUV2ZW50c1xuICAgIGRlbGV0ZSB0aGlzLnVpXG4gICAgZGVsZXRlIHRoaXMudWlDYWxsYmFja3NcbiAgfVxuICBlbmFibGVVSUV2ZW50cygpIHtcbiAgICBpZihcbiAgICAgIHRoaXMudWlFdmVudHMgJiZcbiAgICAgIHRoaXMudWkgJiZcbiAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKFxuICAgICAgICB0aGlzLnVpRXZlbnRzLFxuICAgICAgICB0aGlzLnVpLFxuICAgICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgICApXG4gICAgfVxuICB9XG4gIGRpc2FibGVVSUV2ZW50cygpIHtcbiAgICBpZihcbiAgICAgIHRoaXMudWlFdmVudHMgJiZcbiAgICAgIHRoaXMudWkgJiZcbiAgICAgIHRoaXMudWlDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyhcbiAgICAgICAgdGhpcy51aUV2ZW50cyxcbiAgICAgICAgdGhpcy51aSxcbiAgICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICAgKVxuICAgIH1cbiAgfVxuICBlbmFibGVFbWl0dGVycygpIHtcbiAgICBpZih0aGlzLnNldHRpbmdzLmVtaXR0ZXJzKSB0aGlzLl9lbWl0dGVycyA9IHRoaXMuc2V0dGluZ3MuZW1pdHRlcnNcbiAgfVxuICBkaXNhYmxlRW1pdHRlcnMoKSB7XG4gICAgaWYodGhpcy5fZW1pdHRlcnMpIGRlbGV0ZSB0aGlzLl9lbWl0dGVyc1xuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuX2VuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZW5hYmxlRW1pdHRlcnMoKVxuICAgICAgdGhpcy5lbmFibGVFbGVtZW50KHNldHRpbmdzKVxuICAgICAgdGhpcy5lbmFibGVVSShzZXR0aW5ncylcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICB0aGlzLl9lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLmRpc2FibGVVSShzZXR0aW5ncylcbiAgICAgIHRoaXMuZGlzYWJsZUVsZW1lbnQoc2V0dGluZ3MpXG4gICAgICB0aGlzLmRpc2FibGVFbWl0dGVycygpXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICAgIHJldHVybiB0aGlzc1xuICAgIH1cbiAgfVxufVxuIiwiTVZDLkNvbnRyb2xsZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBfZW1pdHRlcnMoKSB7XG4gICAgdGhpcy5lbWl0dGVycyA9ICh0aGlzLmVtaXR0ZXJzKVxuICAgICAgPyB0aGlzLmVtaXR0ZXJzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlcnNcbiAgfVxuICBzZXQgX2VtaXR0ZXJzKGVtaXR0ZXJzKSB7XG4gICAgdGhpcy5lbWl0dGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBlbWl0dGVycywgdGhpcy5fZW1pdHRlcnNcbiAgICApXG4gIH1cbiAgZ2V0IF9lbWl0dGVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMuZW1pdHRlckNhbGxiYWNrcyA9ICh0aGlzLmVtaXR0ZXJDYWxsYmFja3MpXG4gICAgICA/IHRoaXMuZW1pdHRlckNhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX2VtaXR0ZXJDYWxsYmFja3MoZW1pdHRlckNhbGxiYWNrcykge1xuICAgIHRoaXMuZW1pdHRlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBlbWl0dGVyQ2FsbGJhY2tzLCB0aGlzLl9lbWl0dGVyQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfbW9kZWxDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5tb2RlbENhbGxiYWNrcyA9ICh0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgfVxuICBzZXQgX21vZGVsQ2FsbGJhY2tzKG1vZGVsQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5tb2RlbENhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBtb2RlbENhbGxiYWNrcywgdGhpcy5fbW9kZWxDYWxsYmFja3NcbiAgICApXG4gIH1cbiAgZ2V0IF92aWV3Q2FsbGJhY2tzKCkge1xuICAgIHRoaXMudmlld0NhbGxiYWNrcyA9ICh0aGlzLnZpZXdDYWxsYmFja3MpXG4gICAgICA/IHRoaXMudmlld0NhbGxiYWNrc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnZpZXdDYWxsYmFja3NcbiAgfVxuICBzZXQgX3ZpZXdDYWxsYmFja3Modmlld0NhbGxiYWNrcykge1xuICAgIHRoaXMudmlld0NhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB2aWV3Q2FsbGJhY2tzLCB0aGlzLl92aWV3Q2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlckNhbGxiYWNrcygpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MgPSAodGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9jb250cm9sbGVyQ2FsbGJhY2tzKGNvbnRyb2xsZXJDYWxsYmFja3MpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlckNhbGxiYWNrcywgdGhpcy5fY29udHJvbGxlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX3JvdXRlckNhbGxiYWNrcygpIHtcbiAgICB0aGlzLnJvdXRlckNhbGxiYWNrcyA9ICh0aGlzLnJvdXRlckNhbGxiYWNrcylcbiAgICAgID8gdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX3JvdXRlckNhbGxiYWNrcyhyb3V0ZXJDYWxsYmFja3MpIHtcbiAgICB0aGlzLnJvdXRlckNhbGxiYWNrcyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXJDYWxsYmFja3MsIHRoaXMuX3JvdXRlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVscygpIHtcbiAgICB0aGlzLm1vZGVscyA9ICh0aGlzLm1vZGVscylcbiAgICAgID8gdGhpcy5tb2RlbHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5tb2RlbHNcbiAgfVxuICBzZXQgX21vZGVscyhtb2RlbHMpIHtcbiAgICB0aGlzLm1vZGVscyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBtb2RlbHMsIHRoaXMuX21vZGVsc1xuICAgIClcbiAgfVxuICBnZXQgX3ZpZXdzKCkge1xuICAgIHRoaXMudmlld3MgPSAodGhpcy52aWV3cylcbiAgICAgID8gdGhpcy52aWV3c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnZpZXdzXG4gIH1cbiAgc2V0IF92aWV3cyh2aWV3cykge1xuICAgIHRoaXMudmlld3MgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld3MsIHRoaXMuX3ZpZXdzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlcnMoKSB7XG4gICAgdGhpcy5jb250cm9sbGVycyA9ICh0aGlzLmNvbnRyb2xsZXJzKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlcnNcbiAgfVxuICBzZXQgX2NvbnRyb2xsZXJzKGNvbnRyb2xsZXJzKSB7XG4gICAgdGhpcy5jb250cm9sbGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBjb250cm9sbGVycywgdGhpcy5fY29udHJvbGxlcnNcbiAgICApXG4gIH1cbiAgZ2V0IF9yb3V0ZXJzKCkge1xuICAgIHRoaXMucm91dGVycyA9ICh0aGlzLnJvdXRlcnMpXG4gICAgICA/IHRoaXMucm91dGVyc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlcnNcbiAgfVxuICBzZXQgX3JvdXRlcnMocm91dGVycykge1xuICAgIHRoaXMucm91dGVycyA9IE1WQy5VdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXJzLCB0aGlzLl9yb3V0ZXJzXG4gICAgKVxuICB9XG4gIGdldCBfZW1pdHRlckV2ZW50cygpIHtcbiAgICB0aGlzLmVtaXR0ZXJFdmVudHMgPSAodGhpcy5lbWl0dGVyRXZlbnRzKVxuICAgICAgPyB0aGlzLmVtaXR0ZXJFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyRXZlbnRzXG4gIH1cbiAgc2V0IF9lbWl0dGVyRXZlbnRzKGVtaXR0ZXJFdmVudHMpIHtcbiAgICB0aGlzLmVtaXR0ZXJFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgZW1pdHRlckV2ZW50cywgdGhpcy5fZW1pdHRlckV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVsRXZlbnRzKCkge1xuICAgIHRoaXMubW9kZWxFdmVudHMgPSAodGhpcy5tb2RlbEV2ZW50cylcbiAgICAgID8gdGhpcy5tb2RlbEV2ZW50c1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLm1vZGVsRXZlbnRzXG4gIH1cbiAgc2V0IF9tb2RlbEV2ZW50cyhtb2RlbEV2ZW50cykge1xuICAgIHRoaXMubW9kZWxFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgbW9kZWxFdmVudHMsIHRoaXMuX21vZGVsRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfdmlld0V2ZW50cygpIHtcbiAgICB0aGlzLnZpZXdFdmVudHMgPSAodGhpcy52aWV3RXZlbnRzKVxuICAgICAgPyB0aGlzLnZpZXdFdmVudHNcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy52aWV3RXZlbnRzXG4gIH1cbiAgc2V0IF92aWV3RXZlbnRzKHZpZXdFdmVudHMpIHtcbiAgICB0aGlzLnZpZXdFdmVudHMgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld0V2ZW50cywgdGhpcy5fdmlld0V2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgdGhpcy5jb250cm9sbGVyRXZlbnRzID0gKHRoaXMuY29udHJvbGxlckV2ZW50cylcbiAgICAgID8gdGhpcy5jb250cm9sbGVyRXZlbnRzXG4gICAgICA6IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlckV2ZW50c1xuICB9XG4gIHNldCBfY29udHJvbGxlckV2ZW50cyhjb250cm9sbGVyRXZlbnRzKSB7XG4gICAgdGhpcy5jb250cm9sbGVyRXZlbnRzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGNvbnRyb2xsZXJFdmVudHMsIHRoaXMuX2NvbnRyb2xsZXJFdmVudHNcbiAgICApXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGVuYWJsZU1vZGVsRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMubW9kZWxFdmVudHMsIHRoaXMubW9kZWxzLCB0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVNb2RlbEV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMubW9kZWxFdmVudHMsIHRoaXMubW9kZWxzLCB0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZVZpZXdFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy52aWV3RXZlbnRzLCB0aGlzLnZpZXdzLCB0aGlzLnZpZXdDYWxsYmFja3MpXG4gIH1cbiAgZGlzYWJsZVZpZXdFdmVudHMoKSB7XG4gICAgTVZDLlV0aWxzLnVuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnZpZXdFdmVudHMsIHRoaXMudmlld3MsIHRoaXMudmlld0NhbGxiYWNrcylcbiAgfVxuICBlbmFibGVDb250cm9sbGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuY29udHJvbGxlckV2ZW50cywgdGhpcy5jb250cm9sbGVycywgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzKVxuICB9XG4gIGRpc2FibGVDb250cm9sbGVyRXZlbnRzKCkge1xuICAgIE1WQy5VdGlscy51bmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5jb250cm9sbGVyRXZlbnRzLCB0aGlzLmNvbnRyb2xsZXJzLCB0aGlzLmNvbnRyb2xsZXJDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlRW1pdHRlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmVtaXR0ZXJFdmVudHMsIHRoaXMuZW1pdHRlcnMsIHRoaXMuZW1pdHRlckNhbGxiYWNrcylcbiAgfVxuICBkaXNhYmxlRW1pdHRlckV2ZW50cygpIHtcbiAgICBNVkMuVXRpbHMudW5iaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzKHRoaXMuZW1pdHRlckV2ZW50cywgdGhpcy5lbWl0dGVycywgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzKVxuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgaWYoc2V0dGluZ3MuZW1pdHRlckNhbGxiYWNrcykgdGhpcy5fZW1pdHRlckNhbGxiYWNrcyA9IHNldHRpbmdzLmVtaXR0ZXJDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLm1vZGVsQ2FsbGJhY2tzKSB0aGlzLl9tb2RlbENhbGxiYWNrcyA9IHNldHRpbmdzLm1vZGVsQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy52aWV3Q2FsbGJhY2tzKSB0aGlzLl92aWV3Q2FsbGJhY2tzID0gc2V0dGluZ3Mudmlld0NhbGxiYWNrc1xuICAgICAgaWYoc2V0dGluZ3MuY29udHJvbGxlckNhbGxiYWNrcykgdGhpcy5fY29udHJvbGxlckNhbGxiYWNrcyA9IHNldHRpbmdzLmNvbnRyb2xsZXJDYWxsYmFja3NcbiAgICAgIGlmKHNldHRpbmdzLnJvdXRlckNhbGxiYWNrcykgdGhpcy5fcm91dGVyQ2FsbGJhY2tzID0gc2V0dGluZ3Mucm91dGVyQ2FsbGJhY2tzXG4gICAgICBpZihzZXR0aW5ncy5lbWl0dGVycykgdGhpcy5fZW1pdHRlcnMgPSBzZXR0aW5ncy5lbWl0dGVyc1xuICAgICAgaWYoc2V0dGluZ3MubW9kZWxzKSB0aGlzLl9tb2RlbHMgPSBzZXR0aW5ncy5tb2RlbHNcbiAgICAgIGlmKHNldHRpbmdzLnZpZXdzKSB0aGlzLl92aWV3cyA9IHNldHRpbmdzLnZpZXdzXG4gICAgICBpZihzZXR0aW5ncy5jb250cm9sbGVycykgdGhpcy5fY29udHJvbGxlcnMgPSBzZXR0aW5ncy5jb250cm9sbGVyc1xuICAgICAgaWYoc2V0dGluZ3Mucm91dGVycykgdGhpcy5fcm91dGVycyA9IHNldHRpbmdzLnJvdXRlcnNcbiAgICAgIGlmKHNldHRpbmdzLmVtaXR0ZXJFdmVudHMpIHRoaXMuX2VtaXR0ZXJFdmVudHMgPSBzZXR0aW5ncy5lbWl0dGVyRXZlbnRzXG4gICAgICBpZihzZXR0aW5ncy5tb2RlbEV2ZW50cykgdGhpcy5fbW9kZWxFdmVudHMgPSBzZXR0aW5ncy5tb2RlbEV2ZW50c1xuICAgICAgaWYoc2V0dGluZ3Mudmlld0V2ZW50cykgdGhpcy5fdmlld0V2ZW50cyA9IHNldHRpbmdzLnZpZXdFdmVudHNcbiAgICAgIGlmKHNldHRpbmdzLmNvbnRyb2xsZXJFdmVudHMpIHRoaXMuX2NvbnRyb2xsZXJFdmVudHMgPSBzZXR0aW5ncy5jb250cm9sbGVyRXZlbnRzXG4gICAgICBpZihcbiAgICAgICAgdGhpcy5lbWl0dGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuZW1pdHRlcnMgJiZcbiAgICAgICAgdGhpcy5lbWl0dGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5lbmFibGVFbWl0dGVyRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLm1vZGVsRXZlbnRzICYmXG4gICAgICAgIHRoaXMubW9kZWxzICYmXG4gICAgICAgIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZU1vZGVsRXZlbnRzKClcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICB0aGlzLnZpZXdFdmVudHMgJiZcbiAgICAgICAgdGhpcy52aWV3cyAmJlxuICAgICAgICB0aGlzLnZpZXdDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmVuYWJsZVZpZXdFdmVudHMoKVxuICAgICAgfVxuICAgICAgaWYoXG4gICAgICAgIHRoaXMuY29udHJvbGxlckV2ZW50cyAmJlxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlQ29udHJvbGxlckV2ZW50cygpXG4gICAgICB9XG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHNldHRpbmdzICYmXG4gICAgICB0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIGlmKFxuICAgICAgICB0aGlzLm1vZGVsRXZlbnRzICYmXG4gICAgICAgIHRoaXMubW9kZWxzICYmXG4gICAgICAgIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICAgICkge1xuICAgICAgICB0aGlzLmRpc2FibGVNb2RlbEV2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy52aWV3RXZlbnRzICYmXG4gICAgICAgIHRoaXMudmlld3MgJiZcbiAgICAgICAgdGhpcy52aWV3Q2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlVmlld0V2ZW50cygpXG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgdGhpcy5jb250cm9sbGVyRXZlbnRzICYmXG4gICAgICAgIHRoaXMuY29udHJvbGxlcnMgJiZcbiAgICAgICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlQ29udHJvbGxlckV2ZW50cygpXG4gICAgICB9XG4gICAgICBkZWxldGUgdGhpcy5fZW1pdHRlcnNcbiAgICAgIGRlbGV0ZSB0aGlzLl9tb2RlbENhbGxiYWNrc1xuICAgICAgZGVsZXRlIHRoaXMuX3ZpZXdDYWxsYmFja3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgICBkZWxldGUgdGhpcy5fcm91dGVyQ2FsbGJhY2tzXG4gICAgICBkZWxldGUgdGhpcy5fbW9kZWxzXG4gICAgICBkZWxldGUgdGhpcy5fdmlld3NcbiAgICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyc1xuICAgICAgZGVsZXRlIHRoaXMuX3JvdXRlcnNcbiAgICAgIGRlbGV0ZSB0aGlzLl9tb2RlbEV2ZW50c1xuICAgICAgZGVsZXRlIHRoaXMuX3ZpZXdFdmVudHNcbiAgICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyRXZlbnRzXG4gICAgICB0aGlzLl9lbmFibGVkID0gZmFsc2VcbiAgICB9XG4gIH1cbn1cbiIsIk1WQy5Sb3V0ZXIgPSBjbGFzcyBleHRlbmRzIE1WQy5CYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCByb3V0ZSgpIHtcbiAgICByZXR1cm4gU3RyaW5nKHdpbmRvdy5sb2NhdGlvbi5oYXNoKS5zcGxpdCgnIycpLnBvcCgpXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGdldCBfcm91dGVzKCkge1xuICAgIHRoaXMucm91dGVzID0gKHRoaXMucm91dGVzKVxuICAgICAgPyB0aGlzLnJvdXRlc1xuICAgICAgOiB7fVxuICAgIHJldHVybiB0aGlzLnJvdXRlc1xuICB9XG4gIHNldCBfcm91dGVzKHJvdXRlcykge1xuICAgIHRoaXMucm91dGVzID0gTVZDLlV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlcywgdGhpcy5fcm91dGVzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlcigpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSAodGhpcy5jb250cm9sbGVyKVxuICAgICAgPyB0aGlzLmNvbnRyb2xsZXJcbiAgICAgIDoge31cbiAgICByZXR1cm4gdGhpcy5jb250cm9sbGVyXG4gIH1cbiAgc2V0IF9jb250cm9sbGVyKGNvbnRyb2xsZXIpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBNVkMuVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlciwgdGhpcy5fY29udHJvbGxlclxuICAgIClcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgc2V0dGluZ3MgJiZcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZW5hYmxlUm91dGVzKHRoaXMucm91dGVzLCB0aGlzLmNvbnRyb2xsZXJzKVxuICAgICAgdGhpcy5lbmFibGVFdmVudHMoKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBzZXR0aW5ncyAmJlxuICAgICAgdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLmRpc2FibGVFdmVudHMoKVxuICAgICAgdGhpcy5kaXNhYmxlUm91dGVzKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgfVxuICBlbmFibGVSb3V0ZXMocm91dGVzLCBjb250cm9sbGVycykge1xuICAgIGlmKHNldHRpbmdzLmNvbnRyb2xsZXJzKSB0aGlzLl9jb250cm9sbGVycyA9IHNldHRpbmdzLmNvbnRyb2xsZXJzXG4gICAgdGhpcy5fcm91dGVzID0gc2V0dGluZ3Mucm91dGVzLm1hcCgocm91dGUpID0+IGNvbnRyb2xsZXJzW3JvdXRlc1tyb3V0ZV1dKVxuICAgIHJldHVyblxuICB9XG4gIGRpc2FibGVSb3V0ZXMoKSB7XG4gICAgZGVsZXRlIHRoaXMuX3JvdXRlc1xuICAgIGRlbGV0ZSB0aGlzLl9jb250cm9sbGVyc1xuICB9XG4gIGVuYWJsZUV2ZW50cygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMuaGFzaENoYW5nZS5iaW5kKHRoaXMpKVxuICB9XG4gIGRpc2FibGVFdmVudHMoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLmhhc2hDaGFuZ2UuYmluZCh0aGlzKSlcbiAgfVxuICBoYXNoQ2hhbmdlKGV2ZW50KSB7XG4gICAgdmFyIHJvdXRlID0gdGhpcy5yb3V0ZVxuICAgIHRyeSB7XG4gICAgICB0aGlzLnJvdXRlc1tyb3V0ZV0oZXZlbnQpXG4gICAgICB0aGlzLmVtaXQoJ25hdmlnYXRlJywgdGhpcylcbiAgICB9IGNhdGNoKGVycm9yKSB7fVxuICB9XG4gIG5hdmlnYXRlKHBhdGgpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHBhdGhcbiAgfVxufVxuIl19
