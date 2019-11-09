(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.MVC = factory());
}(this, (function () { 'use strict';

class Events {
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

}

var Channel = class {
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

var Channels = class {
  constructor() {}

  get _channels() {
    this.channels = this.channels || {};
    return this.channels;
  }

  channel(channelName) {
    this._channels[channelName] = this._channels[channelName] ? this._channels[channelName] : new Channel();
    return this._channels[channelName];
  }

  off(channelName) {
    delete this._channels[channelName];
  }

};

var isArray = function isArray(object) {
  return Array.isArray(object);
};

var isObject = function isObject(object) {
  return !Array.isArray(object) && object !== null ? typeof object === 'object' : false;
};

var isHTMLElement = function isHTMLElement(object) {
  return object instanceof HTMLElement;
};

var typeOf = function typeOf(data) {
  switch (typeof data) {
    case 'object':
      var _object;

      if (isArray(data)) {
        // Array
        return 'array';
      } else if (isObject(data)) {
        // Object
        return 'object';
      } else if (data === null) {
        // Null
        return 'null';
      }

      return _object;

    case 'string':
    case 'number':
    case 'boolean':
    case 'undefined':
    case 'function':
      return typeof data;
      break;
  }
};

var paramsToObject = function paramsToObject(params) {
  var params = params.split('&');
  var object = {};
  params.forEach(paramData => {
    paramData = paramData.split('=');
    object[paramData[0]] = decodeURIComponent(paramData[1] || '');
  });
  return JSON.parse(JSON.stringify(object));
};

var UID = function UID() {
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

var Utils = {
  isArray,
  isObject,
  typeOf,
  isHTMLElement,
  paramsToObject,
  typeOf,
  UID
};

class Base extends Events {
  constructor(settings, configuration) {
    super(...arguments);
    this._settings = settings;
    this._configuration = configuration;
    this.addProperties();
  }

  get uid() {
    this._uid = this._uid ? this._uid : Utils.UID();
    return this._uid;
  }

  get _name() {
    return this.name;
  }

  set _name(name) {
    this.name = name;
  }

  get _configuration() {
    this.configuration = this.configuration || {};
    return this.configuration;
  }

  set _configuration(configuration) {
    this.configuration = configuration;
  }

  get _settings() {
    this.settings = this.settings || {};
    return this.settings;
  }

  set _settings(settings) {
    this.settings = settings || {};
    this.classSettingsProperties.forEach(classSetting => {
      if (this.settings[classSetting]) {
        this['_'.concat(classSetting)] = this.settings[classSetting];
      } else if (this[classSetting]) {
        this['_'.concat(classSetting)] = this[classSetting];
      }
    });
  }

  addProperties() {
    if (this.bindableClassProperties) {
      this.bindableClassProperties.forEach(bindableClassPropertyName => {
        this.addProperty(bindableClassPropertyName).addPropertyCallbacks(bindableClassPropertyName).addPropertyEvents(bindableClassPropertyName).resetTargetClassEvents(bindableClassPropertyName);
      });
    }

    return this;
  }

  addProperty(bindableClassPropertyName) {
    var context = this;
    var propertyName = bindableClassPropertyName.concat('s');
    var capitalizePropertyName = propertyName.split('').map((character, characterIndex) => {
      return characterIndex === 0 ? character.toUpperCase() : character;
    }).join('');
    var addPropertyMethodName = 'add'.concat(capitalizePropertyName);
    var removePropertyMethodName = 'remove'.concat(capitalizePropertyName);
    var currentPropertyValues = this[propertyName];
    Object.defineProperties(this, {
      [propertyName]: {
        writable: true,
        value: currentPropertyValues
      },
      ['_'.concat(propertyName)]: {
        get() {
          context[propertyName] = context[propertyName] || {};
          return context[propertyName];
        },

        set(values) {
          Object.entries(values).forEach((_ref) => {
            var [valueName, value] = _ref;
            context['_'.concat(propertyName)][valueName] = value;
          });
          this.resetTargetClassEvents(bindableClassPropertyName);
        }

      },
      [addPropertyMethodName]: {
        value: function value(values) {
          context['_'.concat(propertyName)] = values;
        }
      },
      [removePropertyMethodName]: {
        value: function value() {
          if (arguments[0]) {
            var name = arguments[0];
            delete context['_'.concat(propertyName)][name];
          } else {
            Object.keys(context['_'.concat(propertyName)]).forEach(propertyKey => {
              delete context['_'.concat(propertyName)][propertyKey];
            });
          }
        }
      }
    });
    return this;
  }

  addPropertyCallbacks(bindableClassPropertyName) {
    var context = this;
    var propertyName = bindableClassPropertyName.concat('s');
    var propertyCallbacksName = bindableClassPropertyName.concat('Callbacks');
    var capitalizePropertyCallbacksName = propertyCallbacksName.split('').map((character, characterIndex) => {
      return characterIndex === 0 ? character.toUpperCase() : character;
    }).join('');
    var addPropertyCallbacksName = 'add'.concat(capitalizePropertyCallbacksName);
    var removePropertyCallbacksName = 'remove'.concat(capitalizePropertyCallbacksName);
    var currentPropertyCallbackValues = this[propertyCallbacksName];
    Object.defineProperties(this, {
      [propertyCallbacksName]: {
        writable: true,
        value: currentPropertyCallbackValues
      },
      ['_'.concat(propertyCallbacksName)]: {
        get() {
          context[propertyCallbacksName] = context[propertyCallbacksName] || {};
          return context[propertyCallbacksName];
        },

        set(values) {
          Object.entries(values).forEach((_ref2) => {
            var [valueName, value] = _ref2;
            context['_'.concat(propertyCallbacksName)][valueName] = value.bind(context);
          });
          this.resetTargetClassEvents(bindableClassPropertyName);
        }

      },
      [addPropertyCallbacksName]: {
        value: function value(values) {
          context['_'.concat(propertyCallbacksName)] = values;
        }
      },
      [removePropertyCallbacksName]: {
        value: function value() {
          if (arguments[0]) {
            var name = arguments[0];
            delete context['_'.concat(propertyCallbacksName)][name];
          } else {
            Object.keys(context['_'.concat(propertyCallbacksName)]).forEach(propertyKey => {
              delete context['_'.concat(propertyCallbacksName)][propertyKey];
            });
          }
        }
      }
    });
    return this;
  }

  addPropertyEvents(bindableClassPropertyName) {
    var context = this;
    var propertyName = bindableClassPropertyName.concat('s');
    var propertyEventsName = bindableClassPropertyName.concat('Events');
    var capitalizePropertyEventsName = propertyEventsName.split('').map((character, characterIndex) => {
      return characterIndex === 0 ? character.toUpperCase() : character;
    }).join('');
    var addPropertyEventsName = 'add'.concat(capitalizePropertyEventsName);
    var removePropertyEventsName = 'remove'.concat(capitalizePropertyEventsName);
    var currentPropertyEventValues = this[propertyEventsName];
    Object.defineProperties(this, {
      [propertyEventsName]: {
        writable: true,
        value: currentPropertyEventValues
      },
      ['_'.concat(propertyEventsName)]: {
        get() {
          context[propertyEventsName] = context[propertyEventsName] || {};
          return context[propertyEventsName];
        },

        set(values) {
          Object.entries(values).forEach((_ref3) => {
            var [valueName, value] = _ref3;
            context['_'.concat(propertyEventsName)][valueName] = value;
          });
          this.resetTargetClassEvents(bindableClassPropertyName);
        }

      },
      [addPropertyEventsName]: {
        value: function value(values) {
          context['_'.concat(propertyEventsName)] = values;
        }
      },
      [removePropertyEventsName]: {
        value: function value() {
          if (arguments[0]) {
            var name = arguments[0];
            delete context['_'.concat(propertyEventsName)][name];
          } else {
            Object.keys(context['_'.concat(propertyEventsName)]).forEach(propertyKey => {
              delete context['_'.concat(propertyEventsName)][propertyKey];
            });
          }
        }
      }
    });
    return this;
  }

  resetTargetClassEvents(bindableClassPropertyName) {
    return this.toggleTargetClassEvents(bindableClassPropertyName, 'off').toggleTargetClassEvents(bindableClassPropertyName, 'on');
  }

  toggleTargetClassEvents(classType, method) {
    if (this[classType.concat('s')] && this[classType.concat('Events')] && this[classType.concat('Callbacks')]) {
      Object.entries(this[classType.concat('Events')]).forEach((_ref4) => {
        var [classTypeEventData, classTypeCallbackName] = _ref4;

        try {
          classTypeEventData = classTypeEventData.split(' ');
          var classTypeTargetName = classTypeEventData[0];
          var classTypeEventName = classTypeEventData[1];
          var classTypeTarget = this[classType.concat('s')][classTypeTargetName];
          var classTypeEventCallback;

          switch (method) {
            case 'on':
              switch (classType) {
                case 'uiElement':
                  classTypeEventCallback = this[classType.concat('Callbacks')][classTypeCallbackName].bind(this);
                  classTypeTarget[method](classTypeEventName, classTypeEventCallback);
                  break;

                default:
                  classTypeEventCallback = this[classType.concat('Callbacks')][classTypeCallbackName];
                  classTypeTarget[method](classTypeEventName, classTypeEventCallback, this);
                  break;
              }

              break;

            case 'off':
              classTypeEventCallback = this[classType.concat('Callbacks')][classTypeCallbackName];

              switch (classType) {
                case 'uiElement':
                  var classTypeEventCallbackNamespace = classTypeEventCallback.name.split(' ')[1];
                  classTypeTarget[method](classTypeEventName, classTypeEventCallbackNamespace);
                  break;

                default:
                  classTypeTarget[method](classTypeEventName, classTypeEventCallback, this);
                  break;
              }

              break;
          }
        } catch (error) {
          throw new ReferenceError(DemoProject.Base.Constants.Errors.CLASS_EVENT_BINDING_FAIL);
        }
      });
    }

    return this;
  }

}

var Service = class extends Base {
  constructor() {
    super(...arguments);
    this.addProperties();
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

  request() {
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

    if (Object.keys(settings).length) {
      if (settings.type) this._type = settings.type;
      if (settings.url) this._url = settings.url;
      if (settings.data) this._data = settings.data || null;
      if (this.settings.responseType) this._responseType = this._settings.responseType;
    }

    return this;
  }

  disable() {
    var settings = this.settings;

    if (Object.keys(settings).length) {
      delete this._type;
      delete this._url;
      delete this._data;
      delete this._headers;
      delete this._responseType;
    }

    return this;
  }

};

var Model = class extends Base {
  constructor() {
    super(...arguments);
    this.addProperties();
    return this;
  }

  get bindableClassProperties() {
    return ['data', 'services'];
  }

  get classSettingsProperties() {
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

  parse(data) {
    data = data || this._data || {};
    return JSON.parse(JSON.stringify(data));
  }

};

class View extends Base {
  constructor() {
    super(...arguments);
  }

  get bindableClassProperties() {
    return ['uiElement'];
  }

  get classSettingsProperties() {
    return ['elementName', 'element', 'attributes', 'uiElements', 'uiElementEvents', 'uiElementCallbacks', 'templates', 'insert'];
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

  get _observerCallbacks() {
    this.observerCallbacks = this.observerCallbacks || {};
    return this.observerCallbacks;
  }

  set _observerCallbacks(observerCallbacks) {
    this.observerCallbacks = Utils.addPropertiesToObject(observerCallbacks, this._observerCallbacks);
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

  get _templates() {
    this.templates = this.templates || {};
    return this.templates;
  }

  set _templates(templates) {
    this.templates = Utils.addPropertiesToObject(templates, this._templates);
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

      if (Utils.typeOf(this.insert.element) === 'string') {
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

}

var Controller = class extends Base {
  constructor() {
    super(...arguments);
    this.addProperties();
    return this;
  }

  get bindableClassProperties() {
    return ['model', 'view', 'controller', 'router'];
  }

  get classSettingsProperties() {
    return ['models', 'modelEvents', 'modelCallbacks', 'views', 'viewEvents', 'viewCallbacks', 'controllers', 'controllerEvents', 'controllerCallbacks', 'routers', 'routerEvents', 'routerCallbacks'];
  }

};

var Router = class extends Base {
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
    var paramData = params ? Utils.paramsToObject(params) : null;
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

  get _routes() {
    this.routes = this.routes || {};
    return this.routes;
  }

  set _routes(routes) {
    this.routes = Utils.addPropertiesToObject(routes, this._routes);
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

  enableRouteEvents() {
    window.addEventListener('hashchange', this.routeChange.bind(this));
    return this;
  }

  disableRouteEvents() {
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

var MVC = {
  Events,
  Channels,
  Utils,
  Service,
  Model,
  View,
  Controller,
  Router
};

return MVC;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9FdmVudHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL0NoYW5uZWxzL0NoYW5uZWwvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL0NoYW5uZWxzL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9VdGlscy9pcy5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVXRpbHMvdHlwZU9mLmpzIiwiLi4vLi4vc291cmNlL01WQy9VdGlscy9wYXJhbXNUb09iamVjdC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVXRpbHMvdWlkLmpzIiwiLi4vLi4vc291cmNlL01WQy9VdGlscy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQmFzZS9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvU2VydmljZS9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvTW9kZWwvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1ZpZXcvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL0NvbnRyb2xsZXIvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1JvdXRlci9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9ldmVudHMoKSB7XHJcbiAgICB0aGlzLmV2ZW50cyA9IHRoaXMuZXZlbnRzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5ldmVudHNcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKSB7IHJldHVybiB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSB8fCB7fSB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIChldmVudENhbGxiYWNrLm5hbWUubGVuZ3RoKVxyXG4gICAgICA/IGV2ZW50Q2FsbGJhY2submFtZVxyXG4gICAgICA6ICdhbm9ueW1vdXNGdW5jdGlvbidcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSkge1xyXG4gICAgcmV0dXJuIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSB8fCBbXVxyXG4gIH1cclxuICBvbihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tOYW1lID0gdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tHcm91cCA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSlcclxuICAgIGV2ZW50Q2FsbGJhY2tHcm91cC5wdXNoKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gPSBldmVudENhbGxiYWNrR3JvdXBcclxuICAgIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdID0gZXZlbnRDYWxsYmFja3NcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIG9mZigpIHtcclxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIGNhc2UgMDpcclxuICAgICAgICBkZWxldGUgdGhpcy5ldmVudHNcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2sgPSBhcmd1bWVudHNbMV1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFja05hbWUgPSAodHlwZW9mIGV2ZW50Q2FsbGJhY2sgPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgPyBldmVudENhbGxiYWNrXHJcbiAgICAgICAgICA6IHRoaXMuZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgICAgICBpZih0aGlzLl9ldmVudHNbZXZlbnROYW1lXSkge1xyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdW2V2ZW50Q2FsbGJhY2tOYW1lXVxyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKS5sZW5ndGggPT09IDBcclxuICAgICAgICAgICkgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBlbWl0KGV2ZW50TmFtZSwgZXZlbnREYXRhKSB7XHJcbiAgICBsZXQgX2FyZ3VtZW50cyA9IE9iamVjdC52YWx1ZXMoYXJndW1lbnRzKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gT2JqZWN0LmVudHJpZXMoXHJcbiAgICAgIHRoaXMuZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgKVxyXG4gICAgZm9yKGxldCBbZXZlbnRDYWxsYmFja0dyb3VwTmFtZSwgZXZlbnRDYWxsYmFja0dyb3VwXSBvZiBldmVudENhbGxiYWNrcykge1xyXG4gICAgICBmb3IobGV0IGV2ZW50Q2FsbGJhY2sgb2YgZXZlbnRDYWxsYmFja0dyb3VwKSB7XHJcbiAgICAgICAgbGV0IGFkZGl0aW9uYWxBcmd1bWVudHMgPSBfYXJndW1lbnRzLnNwbGljZSgyKSB8fCBbXVxyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2soZXZlbnREYXRhLCAuLi5hZGRpdGlvbmFsQXJndW1lbnRzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBFdmVudHNcclxuIiwiY29uc3QgQ2hhbm5lbCA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9yZXNwb25zZXMoKSB7XHJcbiAgICB0aGlzLnJlc3BvbnNlcyA9IHRoaXMucmVzcG9uc2VzIHx8IHRoaXMucmVzcG9uc2VzXHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZihyZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdID0gcmVzcG9uc2VDYWxsYmFja1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZV1cclxuICAgIH1cclxuICB9XHJcbiAgcmVxdWVzdChyZXNwb25zZU5hbWUpIHtcclxuICAgIGlmKHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKSB7XHJcbiAgICAgIGxldCBfYXJndW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5zbGljZSgxKVxyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0oLi4uX2FyZ3VtZW50cylcclxuICAgIH1cclxuICB9XHJcbiAgb2ZmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yKGxldCBbcmVzcG9uc2VOYW1lXSBvZiBPYmplY3Qua2V5cyh0aGlzLl9yZXNwb25zZXMpKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQ2hhbm5lbFxyXG4iLCJpbXBvcnQgQ2hhbm5lbCBmcm9tICcuL0NoYW5uZWwvaW5kZXgnXHJcbmNvbnN0IENoYW5uZWxzID0gY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2NoYW5uZWxzKCkge1xyXG4gICAgdGhpcy5jaGFubmVscyA9IHRoaXMuY2hhbm5lbHMgfHwge31cclxuICAgIHJldHVybiB0aGlzLmNoYW5uZWxzXHJcbiAgfVxyXG4gIGNoYW5uZWwoY2hhbm5lbE5hbWUpIHtcclxuICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXSA9ICh0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0pXHJcbiAgICAgID8gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgIDogbmV3IENoYW5uZWwoKVxyXG4gICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxuICBvZmYoY2hhbm5lbE5hbWUpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQ2hhbm5lbHNcclxuIiwiY29uc3QgaXNBcnJheSA9IGZ1bmN0aW9uIGlzQXJyYXkob2JqZWN0KSB7IHJldHVybiBBcnJheS5pc0FycmF5KG9iamVjdCkgfVxyXG5jb25zdCBpc09iamVjdCA9IGZ1bmN0aW9uIGlzT2JqZWN0KG9iamVjdCkge1xyXG4gIHJldHVybiAoXHJcbiAgICAhQXJyYXkuaXNBcnJheShvYmplY3QpICYmXHJcbiAgICBvYmplY3QgIT09IG51bGxcclxuICApID8gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCdcclxuICAgIDogZmFsc2VcclxufVxyXG5jb25zdCBpc0hUTUxFbGVtZW50ID0gZnVuY3Rpb24gaXNIVE1MRWxlbWVudChvYmplY3QpIHtcclxuICByZXR1cm4gb2JqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcclxufVxyXG5leHBvcnQge1xyXG4gIGlzQXJyYXksXHJcbiAgaXNPYmplY3QsXHJcbiAgaXNIVE1MRWxlbWVudCxcclxufVxyXG4iLCJpbXBvcnQgeyBpc0FycmF5LCBpc09iamVjdCB9IGZyb20gJy4vaXMnXHJcbmNvbnN0IHR5cGVPZiA9IGZ1bmN0aW9uIHR5cGVPZihkYXRhKSB7XHJcbiAgc3dpdGNoKHR5cGVvZiBkYXRhKSB7XHJcbiAgICBjYXNlICdvYmplY3QnOlxyXG4gICAgICBsZXQgX29iamVjdFxyXG4gICAgICBpZihpc0FycmF5KGRhdGEpKSB7XHJcbiAgICAgICAgLy8gQXJyYXlcclxuICAgICAgICByZXR1cm4gJ2FycmF5J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgaXNPYmplY3QoZGF0YSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgLy8gT2JqZWN0XHJcbiAgICAgICAgcmV0dXJuICdvYmplY3QnXHJcbiAgICAgIH0gZWxzZSBpZihcclxuICAgICAgICBkYXRhID09PSBudWxsXHJcbiAgICAgICkge1xyXG4gICAgICAgIC8vIE51bGxcclxuICAgICAgICByZXR1cm4gJ251bGwnXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIF9vYmplY3RcclxuICAgIGNhc2UgJ3N0cmluZyc6XHJcbiAgICBjYXNlICdudW1iZXInOlxyXG4gICAgY2FzZSAnYm9vbGVhbic6XHJcbiAgICBjYXNlICd1bmRlZmluZWQnOlxyXG4gICAgY2FzZSAnZnVuY3Rpb24nOlxyXG4gICAgICByZXR1cm4gdHlwZW9mIGRhdGFcclxuICAgICAgYnJlYWtcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgdHlwZU9mXHJcbiIsImNvbnN0IHBhcmFtc1RvT2JqZWN0ID0gZnVuY3Rpb24gcGFyYW1zVG9PYmplY3QocGFyYW1zKSB7XHJcbiAgICB2YXIgcGFyYW1zID0gcGFyYW1zLnNwbGl0KCcmJylcclxuICAgIHZhciBvYmplY3QgPSB7fVxyXG4gICAgcGFyYW1zLmZvckVhY2goKHBhcmFtRGF0YSkgPT4ge1xyXG4gICAgICBwYXJhbURhdGEgPSBwYXJhbURhdGEuc3BsaXQoJz0nKVxyXG4gICAgICBvYmplY3RbcGFyYW1EYXRhWzBdXSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJhbURhdGFbMV0gfHwgJycpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqZWN0KSlcclxufVxyXG5leHBvcnQgZGVmYXVsdCBwYXJhbXNUb09iamVjdFxyXG4iLCJjb25zdCBVSUQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHV1aWQgPSAnJywgaWlcclxuICBmb3IgKGlpID0gMDsgaWkgPCAzMjsgaWkgKz0gMSkge1xyXG4gICAgc3dpdGNoIChpaSkge1xyXG4gICAgICBjYXNlIDg6XHJcbiAgICAgIGNhc2UgMjA6XHJcbiAgICAgICAgdXVpZCArPSAnLSc7XHJcbiAgICAgICAgdXVpZCArPSAoTWF0aC5yYW5kb20oKSAqIDE2IHwgMCkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAxMjpcclxuICAgICAgICB1dWlkICs9ICctJ1xyXG4gICAgICAgIHV1aWQgKz0gJzQnXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAxNjpcclxuICAgICAgICB1dWlkICs9ICctJ1xyXG4gICAgICAgIHV1aWQgKz0gKE1hdGgucmFuZG9tKCkgKiA0IHwgOCkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB1dWlkICs9IChNYXRoLnJhbmRvbSgpICogMTYgfCAwKS50b1N0cmluZygxNilcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHV1aWRcclxufVxyXG5leHBvcnQgZGVmYXVsdCBVSURcclxuIiwiaW1wb3J0IHR5cGVPZiBmcm9tICcuL3R5cGVPZidcclxuaW1wb3J0IHtcclxuICBpc0FycmF5LFxyXG4gIGlzT2JqZWN0LFxyXG4gIGlzSFRNTEVsZW1lbnRcclxufSBmcm9tICcuL2lzJ1xyXG5pbXBvcnQgcGFyYW1zVG9PYmplY3QgZnJvbSAnLi9wYXJhbXNUb09iamVjdCdcclxuaW1wb3J0IFVJRCBmcm9tICcuL3VpZCdcclxuY29uc3QgVXRpbHMgPSB7XHJcbiAgaXNBcnJheSxcclxuICBpc09iamVjdCxcclxuICB0eXBlT2YsXHJcbiAgaXNIVE1MRWxlbWVudCxcclxuICBwYXJhbXNUb09iamVjdCxcclxuICB0eXBlT2YsXHJcbiAgVUlELFxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFV0aWxzXHJcbiIsImltcG9ydCBVdGlscyBmcm9tICcuLi9VdGlscy9pbmRleCdcclxuaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXgnXHJcblxyXG5jbGFzcyBCYXNlIGV4dGVuZHMgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncywgY29uZmlndXJhdGlvbikge1xyXG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxyXG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gICAgdGhpcy5fY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb25cclxuICAgIHRoaXMuYWRkUHJvcGVydGllcygpXHJcbiAgfVxyXG4gIGdldCB1aWQoKSB7XHJcbiAgICB0aGlzLl91aWQgPSAodGhpcy5fdWlkKVxyXG4gICAgPyB0aGlzLl91aWRcclxuICAgIDogVXRpbHMuVUlEKClcclxuICAgIHJldHVybiB0aGlzLl91aWRcclxuICB9XHJcbiAgZ2V0IF9uYW1lKCkgeyByZXR1cm4gdGhpcy5uYW1lIH1cclxuICBzZXQgX25hbWUobmFtZSkgeyB0aGlzLm5hbWUgPSBuYW1lIH1cclxuICBnZXQgX2NvbmZpZ3VyYXRpb24oKSB7XHJcbiAgICB0aGlzLmNvbmZpZ3VyYXRpb24gPSB0aGlzLmNvbmZpZ3VyYXRpb24gfHwge31cclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25cclxuICB9XHJcbiAgc2V0IF9jb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHsgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbiB9XHJcbiAgZ2V0IF9zZXR0aW5ncygpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5nc1xyXG4gIH1cclxuICBzZXQgX3NldHRpbmdzKHNldHRpbmdzKSB7XHJcbiAgICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzIHx8IHt9XHJcbiAgICAgdGhpcy5jbGFzc1NldHRpbmdzUHJvcGVydGllc1xyXG4gICAgICAgLmZvckVhY2goKGNsYXNzU2V0dGluZykgPT4ge1xyXG4gICAgICAgICBpZih0aGlzLnNldHRpbmdzW2NsYXNzU2V0dGluZ10pIHtcclxuICAgICAgICAgICB0aGlzWydfJy5jb25jYXQoY2xhc3NTZXR0aW5nKV0gPSB0aGlzLnNldHRpbmdzW2NsYXNzU2V0dGluZ11cclxuICAgICAgICAgfSBlbHNlIGlmKHRoaXNbY2xhc3NTZXR0aW5nXSkge1xyXG4gICAgICAgICAgIHRoaXNbJ18nLmNvbmNhdChjbGFzc1NldHRpbmcpXSA9IHRoaXNbY2xhc3NTZXR0aW5nXVxyXG4gICAgICAgICB9XHJcbiAgICAgICB9KVxyXG4gIH1cclxuICBhZGRQcm9wZXJ0aWVzKCkge1xyXG4gICAgaWYodGhpcy5iaW5kYWJsZUNsYXNzUHJvcGVydGllcykge1xyXG4gICAgICB0aGlzLmJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzXHJcbiAgICAgICAgLmZvckVhY2goKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpID0+IHtcclxuICAgICAgICAgIHRoaXNcclxuICAgICAgICAgICAgLmFkZFByb3BlcnR5KGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpXHJcbiAgICAgICAgICAgIC5hZGRQcm9wZXJ0eUNhbGxiYWNrcyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKVxyXG4gICAgICAgICAgICAuYWRkUHJvcGVydHlFdmVudHMoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSlcclxuICAgICAgICAgICAgLnJlc2V0VGFyZ2V0Q2xhc3NFdmVudHMoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgYWRkUHJvcGVydHkoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgbGV0IGNvbnRleHQgPSB0aGlzXHJcbiAgICBsZXQgcHJvcGVydHlOYW1lID0gYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ3MnKVxyXG4gICAgbGV0IGNhcGl0YWxpemVQcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUuc3BsaXQoJycpXHJcbiAgICAgIC5tYXAoKGNoYXJhY3RlciwgY2hhcmFjdGVySW5kZXgpID0+IHtcclxuICAgICAgICByZXR1cm4gKGNoYXJhY3RlckluZGV4ID09PSAwKVxyXG4gICAgICAgICAgPyBjaGFyYWN0ZXIudG9VcHBlckNhc2UoKVxyXG4gICAgICAgICAgOiBjaGFyYWN0ZXJcclxuICAgICAgfSkuam9pbignJylcclxuICAgIGxldCBhZGRQcm9wZXJ0eU1ldGhvZE5hbWUgPSAnYWRkJy5jb25jYXQoY2FwaXRhbGl6ZVByb3BlcnR5TmFtZSlcclxuICAgIGxldCByZW1vdmVQcm9wZXJ0eU1ldGhvZE5hbWUgPSAncmVtb3ZlJy5jb25jYXQoY2FwaXRhbGl6ZVByb3BlcnR5TmFtZSlcclxuICAgIGxldCBjdXJyZW50UHJvcGVydHlWYWx1ZXMgPSB0aGlzW3Byb3BlcnR5TmFtZV1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxyXG4gICAgICB0aGlzLFxyXG4gICAgICB7XHJcbiAgICAgICAgW3Byb3BlcnR5TmFtZV06IHtcclxuICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgdmFsdWU6IGN1cnJlbnRQcm9wZXJ0eVZhbHVlcyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFsnXycuY29uY2F0KHByb3BlcnR5TmFtZSldOiB7XHJcbiAgICAgICAgICBnZXQoKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHRbcHJvcGVydHlOYW1lXSA9IGNvbnRleHRbcHJvcGVydHlOYW1lXSB8fCB7fVxyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dFtwcm9wZXJ0eU5hbWVdXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2V0KHZhbHVlcykge1xyXG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyh2YWx1ZXMpXHJcbiAgICAgICAgICAgICAgLmZvckVhY2goKFt2YWx1ZU5hbWUsIHZhbHVlXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5TmFtZSldW3ZhbHVlTmFtZV0gPSB2YWx1ZVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRUYXJnZXRDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFthZGRQcm9wZXJ0eU1ldGhvZE5hbWVdOiB7XHJcbiAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24odmFsdWVzKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChwcm9wZXJ0eU5hbWUpXSA9IHZhbHVlc1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgW3JlbW92ZVByb3BlcnR5TWV0aG9kTmFtZV06IHtcclxuICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYoYXJndW1lbnRzWzBdKSB7XHJcbiAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5TmFtZSldW25hbWVdXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5TmFtZSldKVxyXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKHByb3BlcnR5S2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQocHJvcGVydHlOYW1lKV1bcHJvcGVydHlLZXldXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfVxyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgYWRkUHJvcGVydHlDYWxsYmFja3MoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgbGV0IGNvbnRleHQgPSB0aGlzXHJcbiAgICBsZXQgcHJvcGVydHlOYW1lID0gYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ3MnKVxyXG4gICAgbGV0IHByb3BlcnR5Q2FsbGJhY2tzTmFtZSA9IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUuY29uY2F0KCdDYWxsYmFja3MnKVxyXG4gICAgbGV0IGNhcGl0YWxpemVQcm9wZXJ0eUNhbGxiYWNrc05hbWUgPSBwcm9wZXJ0eUNhbGxiYWNrc05hbWUuc3BsaXQoJycpXHJcbiAgICAgIC5tYXAoKGNoYXJhY3RlciwgY2hhcmFjdGVySW5kZXgpID0+IHtcclxuICAgICAgICByZXR1cm4gKGNoYXJhY3RlckluZGV4ID09PSAwKVxyXG4gICAgICAgICAgPyBjaGFyYWN0ZXIudG9VcHBlckNhc2UoKVxyXG4gICAgICAgICAgOiBjaGFyYWN0ZXJcclxuICAgICAgfSkuam9pbignJylcclxuICAgIGxldCBhZGRQcm9wZXJ0eUNhbGxiYWNrc05hbWUgPSAnYWRkJy5jb25jYXQoY2FwaXRhbGl6ZVByb3BlcnR5Q2FsbGJhY2tzTmFtZSlcclxuICAgIGxldCByZW1vdmVQcm9wZXJ0eUNhbGxiYWNrc05hbWUgPSAncmVtb3ZlJy5jb25jYXQoY2FwaXRhbGl6ZVByb3BlcnR5Q2FsbGJhY2tzTmFtZSlcclxuICAgIGxldCBjdXJyZW50UHJvcGVydHlDYWxsYmFja1ZhbHVlcyA9IHRoaXNbcHJvcGVydHlDYWxsYmFja3NOYW1lXVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXHJcbiAgICAgIHRoaXMsXHJcbiAgICAgIHtcclxuICAgICAgICBbcHJvcGVydHlDYWxsYmFja3NOYW1lXToge1xyXG4gICAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgICB2YWx1ZTogY3VycmVudFByb3BlcnR5Q2FsbGJhY2tWYWx1ZXMsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBbJ18nLmNvbmNhdChwcm9wZXJ0eUNhbGxiYWNrc05hbWUpXToge1xyXG4gICAgICAgICAgZ2V0KCkge1xyXG4gICAgICAgICAgICBjb250ZXh0W3Byb3BlcnR5Q2FsbGJhY2tzTmFtZV0gPSBjb250ZXh0W3Byb3BlcnR5Q2FsbGJhY2tzTmFtZV0gfHwge31cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHRbcHJvcGVydHlDYWxsYmFja3NOYW1lXVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNldCh2YWx1ZXMpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXModmFsdWVzKVxyXG4gICAgICAgICAgICAgIC5mb3JFYWNoKChbdmFsdWVOYW1lLCB2YWx1ZV0pID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChwcm9wZXJ0eUNhbGxiYWNrc05hbWUpXVt2YWx1ZU5hbWVdID0gdmFsdWUuYmluZChjb250ZXh0KVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRUYXJnZXRDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFthZGRQcm9wZXJ0eUNhbGxiYWNrc05hbWVdOiB7XHJcbiAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24odmFsdWVzKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChwcm9wZXJ0eUNhbGxiYWNrc05hbWUpXSA9IHZhbHVlc1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgW3JlbW92ZVByb3BlcnR5Q2FsbGJhY2tzTmFtZV06IHtcclxuICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYoYXJndW1lbnRzWzBdKSB7XHJcbiAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5Q2FsbGJhY2tzTmFtZSldW25hbWVdXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5Q2FsbGJhY2tzTmFtZSldKVxyXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKHByb3BlcnR5S2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQocHJvcGVydHlDYWxsYmFja3NOYW1lKV1bcHJvcGVydHlLZXldXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfVxyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgYWRkUHJvcGVydHlFdmVudHMoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgbGV0IGNvbnRleHQgPSB0aGlzXHJcbiAgICBsZXQgcHJvcGVydHlOYW1lID0gYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ3MnKVxyXG4gICAgbGV0IHByb3BlcnR5RXZlbnRzTmFtZSA9IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUuY29uY2F0KCdFdmVudHMnKVxyXG4gICAgbGV0IGNhcGl0YWxpemVQcm9wZXJ0eUV2ZW50c05hbWUgPSBwcm9wZXJ0eUV2ZW50c05hbWUuc3BsaXQoJycpXHJcbiAgICAgIC5tYXAoKGNoYXJhY3RlciwgY2hhcmFjdGVySW5kZXgpID0+IHtcclxuICAgICAgICByZXR1cm4gKGNoYXJhY3RlckluZGV4ID09PSAwKVxyXG4gICAgICAgICAgPyBjaGFyYWN0ZXIudG9VcHBlckNhc2UoKVxyXG4gICAgICAgICAgOiBjaGFyYWN0ZXJcclxuICAgICAgfSkuam9pbignJylcclxuICAgIGxldCBhZGRQcm9wZXJ0eUV2ZW50c05hbWUgPSAnYWRkJy5jb25jYXQoY2FwaXRhbGl6ZVByb3BlcnR5RXZlbnRzTmFtZSlcclxuICAgIGxldCByZW1vdmVQcm9wZXJ0eUV2ZW50c05hbWUgPSAncmVtb3ZlJy5jb25jYXQoY2FwaXRhbGl6ZVByb3BlcnR5RXZlbnRzTmFtZSlcclxuICAgIGxldCBjdXJyZW50UHJvcGVydHlFdmVudFZhbHVlcyA9IHRoaXNbcHJvcGVydHlFdmVudHNOYW1lXVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXHJcbiAgICAgIHRoaXMsXHJcbiAgICAgIHtcclxuICAgICAgICBbcHJvcGVydHlFdmVudHNOYW1lXToge1xyXG4gICAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgICB2YWx1ZTogY3VycmVudFByb3BlcnR5RXZlbnRWYWx1ZXNcclxuICAgICAgICB9LFxyXG4gICAgICAgIFsnXycuY29uY2F0KHByb3BlcnR5RXZlbnRzTmFtZSldOiB7XHJcbiAgICAgICAgICBnZXQoKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHRbcHJvcGVydHlFdmVudHNOYW1lXSA9IGNvbnRleHRbcHJvcGVydHlFdmVudHNOYW1lXSB8fCB7fVxyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dFtwcm9wZXJ0eUV2ZW50c05hbWVdXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2V0KHZhbHVlcykge1xyXG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyh2YWx1ZXMpXHJcbiAgICAgICAgICAgICAgLmZvckVhY2goKFt2YWx1ZU5hbWUsIHZhbHVlXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5RXZlbnRzTmFtZSldW3ZhbHVlTmFtZV0gPSB2YWx1ZVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRUYXJnZXRDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFthZGRQcm9wZXJ0eUV2ZW50c05hbWVdOiB7XHJcbiAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24odmFsdWVzKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChwcm9wZXJ0eUV2ZW50c05hbWUpXSA9IHZhbHVlc1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgW3JlbW92ZVByb3BlcnR5RXZlbnRzTmFtZV06IHtcclxuICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYoYXJndW1lbnRzWzBdKSB7XHJcbiAgICAgICAgICAgICAgbGV0IG5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5RXZlbnRzTmFtZSldW25hbWVdXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5RXZlbnRzTmFtZSldKVxyXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKHByb3BlcnR5S2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQocHJvcGVydHlFdmVudHNOYW1lKV1bcHJvcGVydHlLZXldXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfVxyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcmVzZXRUYXJnZXRDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSB7XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gICAgICAudG9nZ2xlVGFyZ2V0Q2xhc3NFdmVudHMoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSwgJ29mZicpXHJcbiAgICAgIC50b2dnbGVUYXJnZXRDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLCAnb24nKVxyXG4gIH1cclxuICB0b2dnbGVUYXJnZXRDbGFzc0V2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZCkge1xyXG4gICAgaWYoXHJcbiAgICAgIHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgncycpXSAmJlxyXG4gICAgICB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXSAmJlxyXG4gICAgICB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXVxyXG4gICAgKSB7XHJcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJyldKVxyXG4gICAgICAgIC5mb3JFYWNoKChbY2xhc3NUeXBlRXZlbnREYXRhLCBjbGFzc1R5cGVDYWxsYmFja05hbWVdKSA9PiB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjbGFzc1R5cGVFdmVudERhdGEgPSBjbGFzc1R5cGVFdmVudERhdGEuc3BsaXQoJyAnKVxyXG4gICAgICAgICAgICBsZXQgY2xhc3NUeXBlVGFyZ2V0TmFtZSA9IGNsYXNzVHlwZUV2ZW50RGF0YVswXVxyXG4gICAgICAgICAgICBsZXQgY2xhc3NUeXBlRXZlbnROYW1lID0gY2xhc3NUeXBlRXZlbnREYXRhWzFdXHJcbiAgICAgICAgICAgIGxldCBjbGFzc1R5cGVUYXJnZXQgPSB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ3MnKV1bY2xhc3NUeXBlVGFyZ2V0TmFtZV1cclxuICAgICAgICAgICAgbGV0IGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2tcclxuICAgICAgICAgICAgc3dpdGNoKG1ldGhvZCkge1xyXG4gICAgICAgICAgICAgIGNhc2UgJ29uJzpcclxuICAgICAgICAgICAgICAgIHN3aXRjaChjbGFzc1R5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgY2FzZSAndWlFbGVtZW50JzpcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc1R5cGVFdmVudENhbGxiYWNrID0gdGhpc1tjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKV1bY2xhc3NUeXBlQ2FsbGJhY2tOYW1lXS5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NUeXBlVGFyZ2V0W21ldGhvZF0oY2xhc3NUeXBlRXZlbnROYW1lLCBjbGFzc1R5cGVFdmVudENhbGxiYWNrKVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NUeXBlRXZlbnRDYWxsYmFjayA9IHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJyldW2NsYXNzVHlwZUNhbGxiYWNrTmFtZV1cclxuICAgICAgICAgICAgICAgICAgICBjbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2ssIHRoaXMpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgY2FzZSAnb2ZmJzpcclxuICAgICAgICAgICAgICAgIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2sgPSB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXVtjbGFzc1R5cGVDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2goY2xhc3NUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3VpRWxlbWVudCc6XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2tOYW1lc3BhY2UgPSBjbGFzc1R5cGVFdmVudENhbGxiYWNrLm5hbWUuc3BsaXQoJyAnKVsxXVxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFja05hbWVzcGFjZSlcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaywgdGhpcylcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBjYXRjaChlcnJvcikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXHJcbiAgICAgICAgICAgIERlbW9Qcm9qZWN0LkJhc2UuQ29uc3RhbnRzLkVycm9ycy5DTEFTU19FVkVOVF9CSU5ESU5HX0ZBSUxcclxuICAgICAgICAgICkgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBCYXNlXHJcbiIsImltcG9ydCBVdGlscyBmcm9tICcuLi9VdGlscy9pbmRleCdcbmltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNvbnN0IFNlcnZpY2UgPSBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gICAgdGhpcy5hZGRQcm9wZXJ0aWVzKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGdldCBfZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLmRlZmF1bHRzIHx8IHtcbiAgICBjb250ZW50VHlwZTogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICB9IH1cbiAgZ2V0IF9yZXNwb25zZVR5cGVzKCkgeyByZXR1cm4gWycnLCAnYXJyYXlidWZmZXInLCAnYmxvYicsICdkb2N1bWVudCcsICdqc29uJywgJ3RleHQnXSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlKCkgeyByZXR1cm4gdGhpcy5yZXNwb25zZVR5cGUgfVxuICBzZXQgX3Jlc3BvbnNlVHlwZShyZXNwb25zZVR5cGUpIHtcbiAgICB0aGlzLl94aHIucmVzcG9uc2VUeXBlID0gdGhpcy5fcmVzcG9uc2VUeXBlcy5maW5kKFxuICAgICAgKHJlc3BvbnNlVHlwZUl0ZW0pID0+IHJlc3BvbnNlVHlwZUl0ZW0gPT09IHJlc3BvbnNlVHlwZVxuICAgICkgfHwgdGhpcy5fZGVmYXVsdHMucmVzcG9uc2VUeXBlXG4gIH1cbiAgZ2V0IF90eXBlKCkgeyByZXR1cm4gdGhpcy50eXBlIH1cbiAgc2V0IF90eXBlKHR5cGUpIHsgdGhpcy50eXBlID0gdHlwZSB9XG4gIGdldCBfdXJsKCkgeyByZXR1cm4gdGhpcy51cmwgfVxuICBzZXQgX3VybCh1cmwpIHsgdGhpcy51cmwgPSB1cmwgfVxuICBnZXQgX2hlYWRlcnMoKSB7IHJldHVybiB0aGlzLmhlYWRlcnMgfHwgW10gfVxuICBzZXQgX2hlYWRlcnMoaGVhZGVycykge1xuICAgIHRoaXMuX2hlYWRlcnMubGVuZ3RoID0gMFxuICAgIGhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICB0aGlzLl9oZWFkZXJzLnB1c2goaGVhZGVyKVxuICAgICAgaGVhZGVyID0gT2JqZWN0LmVudHJpZXMoaGVhZGVyKVswXVxuICAgICAgdGhpcy5feGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgfSlcbiAgfVxuICBnZXQgX2RhdGEoKSB7IHJldHVybiB0aGlzLmRhdGEgfVxuICBzZXQgX2RhdGEoZGF0YSkgeyB0aGlzLmRhdGEgPSBkYXRhIH1cbiAgZ2V0IF94aHIoKSB7XG4gICAgdGhpcy54aHIgPSAodGhpcy54aHIpXG4gICAgICA/IHRoaXMueGhyXG4gICAgICA6IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgcmV0dXJuIHRoaXMueGhyXG4gIH1cbiAgcmVxdWVzdCgpIHtcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLmRhdGEgfHwgbnVsbFxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZih0aGlzLl94aHIuc3RhdHVzID09PSAyMDApIHRoaXMuX3hoci5hYm9ydCgpXG4gICAgICB0aGlzLl94aHIub3Blbih0aGlzLnR5cGUsIHRoaXMudXJsKVxuICAgICAgdGhpcy5faGVhZGVycyA9IHRoaXMuc2V0dGluZ3MuaGVhZGVycyB8fCBbdGhpcy5fZGVmYXVsdHMuY29udGVudFR5cGVdXG4gICAgICB0aGlzLl94aHIub25sb2FkID0gcmVzb2x2ZVxuICAgICAgdGhpcy5feGhyLm9uZXJyb3IgPSByZWplY3RcbiAgICAgIHRoaXMuX3hoci5zZW5kKGRhdGEpXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgJ3hocjpyZXNvbHZlJywge1xuICAgICAgICAgIG5hbWU6ICd4aHI6cmVzb2x2ZScsXG4gICAgICAgICAgZGF0YTogcmVzcG9uc2UuY3VycmVudFRhcmdldCxcbiAgICAgICAgfSxcbiAgICAgICAgdGhpc1xuICAgICAgKVxuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7IHRocm93IGVycm9yIH0pXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIE9iamVjdC5rZXlzKHNldHRpbmdzKS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGlmKHNldHRpbmdzLnR5cGUpIHRoaXMuX3R5cGUgPSBzZXR0aW5ncy50eXBlXG4gICAgICBpZihzZXR0aW5ncy51cmwpIHRoaXMuX3VybCA9IHNldHRpbmdzLnVybFxuICAgICAgaWYoc2V0dGluZ3MuZGF0YSkgdGhpcy5fZGF0YSA9IHNldHRpbmdzLmRhdGEgfHwgbnVsbFxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5yZXNwb25zZVR5cGUpIHRoaXMuX3Jlc3BvbnNlVHlwZSA9IHRoaXMuX3NldHRpbmdzLnJlc3BvbnNlVHlwZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgZGVsZXRlIHRoaXMuX3R5cGVcbiAgICAgIGRlbGV0ZSB0aGlzLl91cmxcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhXG4gICAgICBkZWxldGUgdGhpcy5faGVhZGVyc1xuICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlVHlwZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBTZXJ2aWNlXG4iLCJpbXBvcnQgVXRpbHMgZnJvbSAnLi4vVXRpbHMvaW5kZXgnXG5pbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4J1xuXG5jb25zdCBNb2RlbCA9IGNsYXNzIGV4dGVuZHMgQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgICB0aGlzLmFkZFByb3BlcnRpZXMoKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZ2V0IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICdkYXRhJyxcbiAgICAnc2VydmljZXMnXG4gIF0gfVxuICBnZXQgY2xhc3NTZXR0aW5nc1Byb3BlcnRpZXMoKSB7IHJldHVybiBbXG4gICAgJ25hbWUnLFxuICAgICdzY2hlbWEnLFxuICAgICdsb2NhbFN0b3JhZ2UnLFxuICAgICdoaXN0aW9ncmFtJyxcbiAgICAnc2VydmljZXMnLFxuICAgICdzZXJ2aWNlQ2FsbGJhY2tzJyxcbiAgICAnc2VydmljZUV2ZW50cycsXG4gICAgJ2RhdGEnLFxuICAgICdkYXRhQ2FsbGJhY2tzJyxcbiAgICAnZGF0YUV2ZW50cycsXG4gICAgJ2RlZmF1bHRzJ1xuICBdIH1cbiAgZ2V0IF9zY2hlbWEoKSB7IHJldHVybiB0aGlzLl9zY2hlbWEgfVxuICBzZXQgX3NjaGVtYShzY2hlbWEpIHsgdGhpcy5zY2hlbWEgPSBzY2hlbWEgfVxuICBnZXQgX2lzU2V0dGluZygpIHsgcmV0dXJuIHRoaXMuaXNTZXR0aW5nIH1cbiAgc2V0IF9pc1NldHRpbmcoaXNTZXR0aW5nKSB7IHRoaXMuaXNTZXR0aW5nID0gaXNTZXR0aW5nIH1cbiAgZ2V0IF9jaGFuZ2luZygpIHtcbiAgICB0aGlzLmNoYW5naW5nID0gdGhpcy5jaGFuZ2luZyB8fCB7fVxuICAgIHJldHVybiB0aGlzLmNoYW5naW5nXG4gIH1cbiAgZ2V0IF9sb2NhbFN0b3JhZ2UoKSB7IHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZSB9XG4gIHNldCBfbG9jYWxTdG9yYWdlKGxvY2FsU3RvcmFnZSkgeyB0aGlzLmxvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XG4gIGdldCBfZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLmRlZmF1bHRzIH1cbiAgc2V0IF9kZWZhdWx0cyhkZWZhdWx0cykgeyB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHMgfVxuICBnZXQgX2hpc3Rpb2dyYW0oKSB7IHJldHVybiB0aGlzLmhpc3Rpb2dyYW0gfHwge1xuICAgIGxlbmd0aDogMVxuICB9IH1cbiAgc2V0IF9oaXN0aW9ncmFtKGhpc3Rpb2dyYW0pIHtcbiAgICB0aGlzLmhpc3Rpb2dyYW0gPSBPYmplY3QuYXNzaWduKFxuICAgICAgdGhpcy5faGlzdGlvZ3JhbSxcbiAgICAgIGhpc3Rpb2dyYW1cbiAgICApXG4gIH1cbiAgZ2V0IF9oaXN0b3J5KCkge1xuICAgIHRoaXMuaGlzdG9yeSA9IHRoaXMuaGlzdG9yeSB8fCBbXVxuICAgIHJldHVybiB0aGlzLmhpc3RvcnlcbiAgfVxuICBzZXQgX2hpc3RvcnkoZGF0YSkge1xuICAgIGlmKFxuICAgICAgT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoXG4gICAgKSB7XG4gICAgICBpZih0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVuc2hpZnQodGhpcy5wYXJzZShkYXRhKSlcbiAgICAgICAgdGhpcy5faGlzdG9yeS5zcGxpY2UodGhpcy5faGlzdGlvZ3JhbS5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfZGIoKSB7XG4gICAgbGV0IGRiID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpXG4gICAgdGhpcy5kYiA9IGRiIHx8ICd7fSdcbiAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLmRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICBnZXQoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtrZXldXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdGhpcy5faXNTZXR0aW5nID0gdHJ1ZVxuICAgICAgICBsZXQgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYoaW5kZXggPT09IChfYXJndW1lbnRzLmxlbmd0aCAtIDEpKSB0aGlzLl9pc1NldHRpbmcgPSBmYWxzZVxuICAgICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpKSB7XG4gICAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREQigpIHtcbiAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHZhciBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGxldCB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgdGhpcy5fZGIgPSBkYlxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXREQigpIHtcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBkZWxldGUgdGhpcy5fZGJcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBkZWxldGUgZGJba2V5XVxuICAgICAgICB0aGlzLl9kYiA9IGRiXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpIHtcbiAgICBpZighdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldKSB7XG4gICAgICBsZXQgY29udGV4dCA9IHRoaXNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgICAgICB0aGlzLl9kYXRhLFxuICAgICAgICB7XG4gICAgICAgICAgWydfJy5jb25jYXQoa2V5KV06IHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNba2V5XSB9LFxuICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgIGxldCBzY2hlbWEgPSBjb250ZXh0Ll9zZXR0aW5ncy5zY2hlbWFcbiAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgc2NoZW1hICYmXG4gICAgICAgICAgICAgICAgc2NoZW1hW2tleV1cbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpc1trZXldID0gdmFsdWVcbiAgICAgICAgICAgICAgICBjb250ZXh0Ll9jaGFuZ2luZ1trZXldID0gdmFsdWVcbiAgICAgICAgICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgY29udGV4dC5zZXREQihrZXksIHZhbHVlKVxuICAgICAgICAgICAgICB9IGVsc2UgaWYoIXNjaGVtYSkge1xuICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgY29udGV4dC5fY2hhbmdpbmdba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIGNvbnRleHQuc2V0REIoa2V5LCB2YWx1ZSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBsZXQgc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3NldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgICAgICAgICAgICBsZXQgc2V0RXZlbnROYW1lID0gJ3NldCdcbiAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgIHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICBpZighY29udGV4dC5faXNTZXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgaWYoIU9iamVjdC52YWx1ZXMoY29udGV4dC5fY2hhbmdpbmcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgICAgICBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgZGF0YTogY29udGV4dC5fZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgICAgICAgICAge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0Ll9jaGFuZ2luZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuX2RhdGFcbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0LmNoYW5naW5nXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gICAgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldID0gdmFsdWVcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0RGF0YVByb3BlcnR5KGtleSkge1xuICAgIGxldCB1bnNldFZhbHVlRXZlbnROYW1lID0gWyd1bnNldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgIGxldCB1bnNldEV2ZW50TmFtZSA9ICd1bnNldCdcbiAgICBsZXQgdW5zZXRWYWx1ZSA9IHRoaXMuX2RhdGFba2V5XVxuICAgIGRlbGV0ZSB0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV1cbiAgICBkZWxldGUgdGhpcy5fZGF0YVtrZXldXG4gICAgdGhpcy5lbWl0KFxuICAgICAgdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiB1bnNldFZhbHVlLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdGhpc1xuICAgIClcbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldEV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRoaXNcbiAgICApXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREZWZhdWx0cygpIHtcbiAgICBsZXQgX2RlZmF1bHRzID0ge31cbiAgICBpZih0aGlzLmRlZmF1bHRzKSBPYmplY3QuYXNzaWduKF9kZWZhdWx0cywgdGhpcy5kZWZhdWx0cylcbiAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgT2JqZWN0LmFzc2lnbihfZGVmYXVsdHMsIHRoaXMuX2RiKVxuICAgIGlmKE9iamVjdC5rZXlzKF9kZWZhdWx0cykpIHRoaXMuc2V0KF9kZWZhdWx0cylcbiAgfVxuICBwYXJzZShkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5fZGF0YSB8fCB7fVxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vZGVsXG4iLCJpbXBvcnQgVXRpbHMgZnJvbSAnLi4vVXRpbHMvaW5kZXgnXG5pbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4J1xuXG5jbGFzcyBWaWV3IGV4dGVuZHMgQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgYmluZGFibGVDbGFzc1Byb3BlcnRpZXMoKSB7IHJldHVybiBbXG4gICAgJ3VpRWxlbWVudCdcbiAgXSB9XG4gIGdldCBjbGFzc1NldHRpbmdzUHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAnZWxlbWVudE5hbWUnLFxuICAgICdlbGVtZW50JyxcbiAgICAnYXR0cmlidXRlcycsXG4gICAgJ3VpRWxlbWVudHMnLFxuICAgICd1aUVsZW1lbnRFdmVudHMnLFxuICAgICd1aUVsZW1lbnRDYWxsYmFja3MnLFxuICAgICd0ZW1wbGF0ZXMnLFxuICAgICdpbnNlcnQnXG4gIF0gfVxuICBnZXQgX2VsZW1lbnROYW1lKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudC50YWdOYW1lIH1cbiAgc2V0IF9lbGVtZW50TmFtZShlbGVtZW50TmFtZSkge1xuICAgIGlmKCF0aGlzLl9lbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50TmFtZSlcbiAgfVxuICBnZXQgX2VsZW1lbnQoKSB7IHJldHVybiB0aGlzLmVsZW1lbnQgfVxuICBzZXQgX2VsZW1lbnQoZWxlbWVudCkge1xuICAgIGlmKFxuICAgICAgZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICBlbGVtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRcbiAgICApIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICB9IGVsc2UgaWYodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsZW1lbnQpXG4gICAgfVxuICAgIHRoaXMuZWxlbWVudE9ic2VydmVyLm9ic2VydmUodGhpcy5lbGVtZW50LCB7XG4gICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIH0pXG4gIH1cbiAgZ2V0IF9hdHRyaWJ1dGVzKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudC5hdHRyaWJ1dGVzIH1cbiAgc2V0IF9hdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHtcbiAgICBmb3IobGV0IFthdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKSkge1xuICAgICAgaWYodHlwZW9mIGF0dHJpYnV0ZVZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVLZXkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgX29ic2VydmVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3MgPSB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX29ic2VydmVyQ2FsbGJhY2tzKG9ic2VydmVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5vYnNlcnZlckNhbGxiYWNrcyA9IFV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG9ic2VydmVyQ2FsbGJhY2tzLCB0aGlzLl9vYnNlcnZlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgZWxlbWVudE9ic2VydmVyKCkge1xuICAgIHRoaXMuX2VsZW1lbnRPYnNlcnZlciA9IHRoaXMuX2VsZW1lbnRPYnNlcnZlciB8fCBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLmVsZW1lbnRPYnNlcnZlLmJpbmQodGhpcykpXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRPYnNlcnZlclxuICB9XG4gIGdldCBfaW5zZXJ0KCkgeyByZXR1cm4gdGhpcy5pbnNlcnQgfVxuICBzZXQgX2luc2VydChpbnNlcnQpIHsgdGhpcy5pbnNlcnQgPSBpbnNlcnQgfVxuICBnZXQgX3RlbXBsYXRlcygpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IHRoaXMudGVtcGxhdGVzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGVzXG4gIH1cbiAgc2V0IF90ZW1wbGF0ZXModGVtcGxhdGVzKSB7XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSBVdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICB0ZW1wbGF0ZXMsIHRoaXMuX3RlbXBsYXRlc1xuICAgIClcbiAgfVxuICBlbGVtZW50T2JzZXJ2ZShtdXRhdGlvblJlY29yZExpc3QsIG9ic2VydmVyKSB7XG4gICAgZm9yKGxldCBbbXV0YXRpb25SZWNvcmRJbmRleCwgbXV0YXRpb25SZWNvcmRdIG9mIE9iamVjdC5lbnRyaWVzKG11dGF0aW9uUmVjb3JkTGlzdCkpIHtcbiAgICAgIHN3aXRjaChtdXRhdGlvblJlY29yZC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2NoaWxkTGlzdCc6XG4gICAgICAgICAgbGV0IG11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcyA9IFsnYWRkZWROb2RlcycsICdyZW1vdmVkTm9kZXMnXVxuICAgICAgICAgIGZvcihsZXQgbXV0YXRpb25SZWNvcmRDYXRlZ29yeSBvZiBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMpIHtcbiAgICAgICAgICAgIGlmKG11dGF0aW9uUmVjb3JkW211dGF0aW9uUmVjb3JkQ2F0ZWdvcnldLmxlbmd0aCkge1xuICAgICAgICAgICAgICB0aGlzLnJlc2V0VUkoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBhdXRvSW5zZXJ0KCkge1xuICAgIGlmKHRoaXMuaW5zZXJ0KSB7XG4gICAgICBsZXQgcGFyZW50RWxlbWVudFxuICAgICAgaWYoVXRpbHMudHlwZU9mKHRoaXMuaW5zZXJ0LmVsZW1lbnQpID09PSAnc3RyaW5nJykge1xuICAgICAgICBwYXJlbnRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLmluc2VydC5lbGVtZW50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyZW50RWxlbWVudCA9IHRoaXMuaW5zZXJ0LmVsZW1lbnRcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICBwYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcbiAgICAgICAgcGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIE5vZGVcbiAgICAgICkge1xuICAgICAgICBwYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCh0aGlzLmluc2VydC5tZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICAgIH0gZWxzZSBpZihwYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgICAgcGFyZW50RWxlbWVudFxuICAgICAgICAgIC5mb3JFYWNoKChfcGFyZW50RWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgX3BhcmVudEVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KHRoaXMuaW5zZXJ0Lm1ldGhvZCwgdGhpcy5lbGVtZW50KVxuICAgICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgYXV0b1JlbW92ZSgpIHtcbiAgICBpZihcbiAgICAgIHRoaXMuZWxlbWVudCAmJlxuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnRcbiAgICApIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBWaWV3XG4iLCJpbXBvcnQgVXRpbHMgZnJvbSAnLi4vVXRpbHMvaW5kZXgnXG5pbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4J1xuXG5jb25zdCBDb250cm9sbGVyID0gY2xhc3MgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICAgIHRoaXMuYWRkUHJvcGVydGllcygpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBnZXQgYmluZGFibGVDbGFzc1Byb3BlcnRpZXMoKSB7IHJldHVybiBbXG4gICAgJ21vZGVsJyxcbiAgICAndmlldycsXG4gICAgJ2NvbnRyb2xsZXInLFxuICAgICdyb3V0ZXInXG4gIF0gfVxuICBnZXQgY2xhc3NTZXR0aW5nc1Byb3BlcnRpZXMoKSB7IHJldHVybiBbXG4gICAgJ21vZGVscycsXG4gICAgJ21vZGVsRXZlbnRzJyxcbiAgICAnbW9kZWxDYWxsYmFja3MnLFxuICAgICd2aWV3cycsXG4gICAgJ3ZpZXdFdmVudHMnLFxuICAgICd2aWV3Q2FsbGJhY2tzJyxcbiAgICAnY29udHJvbGxlcnMnLFxuICAgICdjb250cm9sbGVyRXZlbnRzJyxcbiAgICAnY29udHJvbGxlckNhbGxiYWNrcycsXG4gICAgJ3JvdXRlcnMnLFxuICAgICdyb3V0ZXJFdmVudHMnLFxuICAgICdyb3V0ZXJDYWxsYmFja3MnLFxuICBdIH1cbn1cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xsZXJcbiIsImltcG9ydCBVdGlscyBmcm9tICcuLi9VdGlscy9pbmRleCdcbmltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNvbnN0IFJvdXRlciA9IGNsYXNzIGV4dGVuZHMgQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGdldCBwcm90b2NvbCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCB9XG4gIGdldCBob3N0bmFtZSgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSB9XG4gIGdldCBwb3J0KCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBvcnQgfVxuICBnZXQgcGF0aCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSB9XG4gIGdldCBoYXNoKCkge1xuICAgIGxldCBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICBsZXQgaGFzaEluZGV4ID0gaHJlZi5pbmRleE9mKCcjJylcbiAgICBpZihoYXNoSW5kZXggPiAtMSkge1xuICAgICAgbGV0IHBhcmFtSW5kZXggPSBocmVmLmluZGV4T2YoJz8nKVxuICAgICAgbGV0IHNsaWNlU3RhcnQgPSBoYXNoSW5kZXggKyAxXG4gICAgICBsZXQgc2xpY2VTdG9wXG4gICAgICBpZihwYXJhbUluZGV4ID4gLTEpIHtcbiAgICAgICAgc2xpY2VTdG9wID0gKGhhc2hJbmRleCA+IHBhcmFtSW5kZXgpXG4gICAgICAgICAgPyBocmVmLmxlbmd0aFxuICAgICAgICAgIDogcGFyYW1JbmRleFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2xpY2VTdG9wID0gaHJlZi5sZW5ndGhcbiAgICAgIH1cbiAgICAgIGhyZWYgPSBocmVmLnNsaWNlKHNsaWNlU3RhcnQsIHNsaWNlU3RvcClcbiAgICAgIGlmKGhyZWYubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBocmVmXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuICBnZXQgcGFyYW1zKCkge1xuICAgIGxldCBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICBsZXQgcGFyYW1JbmRleCA9IGhyZWYuaW5kZXhPZignPycpXG4gICAgaWYocGFyYW1JbmRleCA+IC0xKSB7XG4gICAgICBsZXQgaGFzaEluZGV4ID0gaHJlZi5pbmRleE9mKCcjJylcbiAgICAgIGxldCBzbGljZVN0YXJ0ID0gcGFyYW1JbmRleCArIDFcbiAgICAgIGxldCBzbGljZVN0b3BcbiAgICAgIGlmKGhhc2hJbmRleCA+IC0xKSB7XG4gICAgICAgIHNsaWNlU3RvcCA9IChwYXJhbUluZGV4ID4gaGFzaEluZGV4KVxuICAgICAgICAgID8gaHJlZi5sZW5ndGhcbiAgICAgICAgICA6IGhhc2hJbmRleFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2xpY2VTdG9wID0gaHJlZi5sZW5ndGhcbiAgICAgIH1cbiAgICAgIGhyZWYgPSBocmVmLnNsaWNlKHNsaWNlU3RhcnQsIHNsaWNlU3RvcClcbiAgICAgIGlmKGhyZWYubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBocmVmXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuICBnZXQgX3JvdXRlRGF0YSgpIHtcbiAgICBsZXQgcm91dGVEYXRhID0ge1xuICAgICAgbG9jYXRpb246IHt9LFxuICAgICAgY29udHJvbGxlcjoge30sXG4gICAgfVxuICAgIGxldCBwYXRoID0gdGhpcy5wYXRoLnNwbGl0KCcvJykuZmlsdGVyKChmcmFnbWVudCkgPT4gZnJhZ21lbnQubGVuZ3RoKVxuICAgIHBhdGggPSAocGF0aC5sZW5ndGgpXG4gICAgICA/IHBhdGhcbiAgICAgIDogWycvJ11cbiAgICBsZXQgaGFzaCA9IHRoaXMuaGFzaFxuICAgIGxldCBoYXNoRnJhZ21lbnRzID0gKGhhc2gpXG4gICAgICA/IGhhc2guc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgICA6IG51bGxcbiAgICBsZXQgcGFyYW1zID0gdGhpcy5wYXJhbXNcbiAgICBsZXQgcGFyYW1EYXRhID0gKHBhcmFtcylcbiAgICAgID8gVXRpbHMucGFyYW1zVG9PYmplY3QocGFyYW1zKVxuICAgICAgOiBudWxsXG4gICAgaWYodGhpcy5wcm90b2NvbCkgcm91dGVEYXRhLmxvY2F0aW9uLnByb3RvY29sID0gdGhpcy5wcm90b2NvbFxuICAgIGlmKHRoaXMuaG9zdG5hbWUpIHJvdXRlRGF0YS5sb2NhdGlvbi5ob3N0bmFtZSA9IHRoaXMuaG9zdG5hbWVcbiAgICBpZih0aGlzLnBvcnQpIHJvdXRlRGF0YS5sb2NhdGlvbi5wb3J0ID0gdGhpcy5wb3J0XG4gICAgaWYodGhpcy5wYXRoKSByb3V0ZURhdGEubG9jYXRpb24ucGF0aCA9IHRoaXMucGF0aFxuICAgIGlmKFxuICAgICAgaGFzaCAmJlxuICAgICAgaGFzaEZyYWdtZW50c1xuICAgICkge1xuICAgICAgaGFzaEZyYWdtZW50cyA9IChoYXNoRnJhZ21lbnRzLmxlbmd0aClcbiAgICAgICAgPyBoYXNoRnJhZ21lbnRzXG4gICAgICAgIDogWycvJ11cbiAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5oYXNoID0ge1xuICAgICAgICBwYXRoOiBoYXNoLFxuICAgICAgICBmcmFnbWVudHM6IGhhc2hGcmFnbWVudHMsXG4gICAgICB9XG4gICAgfVxuICAgIGlmKFxuICAgICAgcGFyYW1zICYmXG4gICAgICBwYXJhbURhdGFcbiAgICApIHtcbiAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5wYXJhbXMgPSB7XG4gICAgICAgIHBhdGg6IHBhcmFtcyxcbiAgICAgICAgZGF0YTogcGFyYW1EYXRhLFxuICAgICAgfVxuICAgIH1cbiAgICByb3V0ZURhdGEubG9jYXRpb24ucGF0aCA9IHtcbiAgICAgIG5hbWU6IHRoaXMucGF0aCxcbiAgICAgIGZyYWdtZW50czogcGF0aCxcbiAgICB9XG4gICAgcm91dGVEYXRhLmxvY2F0aW9uLmN1cnJlbnRVUkwgPSB0aGlzLmN1cnJlbnRVUkxcbiAgICBsZXQgcm91dGVDb250cm9sbGVyRGF0YSA9IHRoaXMuX3JvdXRlQ29udHJvbGxlckRhdGFcbiAgICByb3V0ZURhdGEubG9jYXRpb24gPSBPYmplY3QuYXNzaWduKFxuICAgICAgcm91dGVEYXRhLmxvY2F0aW9uLFxuICAgICAgcm91dGVDb250cm9sbGVyRGF0YS5sb2NhdGlvblxuICAgIClcbiAgICByb3V0ZURhdGEuY29udHJvbGxlciA9IHJvdXRlQ29udHJvbGxlckRhdGEuY29udHJvbGxlclxuICAgIHRoaXMucm91dGVEYXRhID0gcm91dGVEYXRhXG4gICAgcmV0dXJuIHRoaXMucm91dGVEYXRhXG4gIH1cbiAgZ2V0IF9yb3V0ZUNvbnRyb2xsZXJEYXRhKCkge1xuICAgIGxldCByb3V0ZURhdGEgPSB7XG4gICAgICBsb2NhdGlvbjoge30sXG4gICAgfVxuICAgIE9iamVjdC5lbnRyaWVzKHRoaXMucm91dGVzKVxuICAgICAgLmZvckVhY2goKFtyb3V0ZVBhdGgsIHJvdXRlU2V0dGluZ3NdKSA9PiB7XG4gICAgICAgIGxldCBwYXRoRnJhZ21lbnRzID0gdGhpcy5wYXRoLnNwbGl0KCcvJykuZmlsdGVyKChmcmFnbWVudCkgPT4gZnJhZ21lbnQubGVuZ3RoKVxuICAgICAgICBwYXRoRnJhZ21lbnRzID0gKHBhdGhGcmFnbWVudHMubGVuZ3RoKVxuICAgICAgICAgID8gcGF0aEZyYWdtZW50c1xuICAgICAgICAgIDogWycvJ11cbiAgICAgICAgbGV0IHJvdXRlRnJhZ21lbnRzID0gcm91dGVQYXRoLnNwbGl0KCcvJykuZmlsdGVyKChmcmFnbWVudCwgZnJhZ21lbnRJbmRleCkgPT4gZnJhZ21lbnQubGVuZ3RoKVxuICAgICAgICByb3V0ZUZyYWdtZW50cyA9IChyb3V0ZUZyYWdtZW50cy5sZW5ndGgpXG4gICAgICAgICAgPyByb3V0ZUZyYWdtZW50c1xuICAgICAgICAgIDogWycvJ11cbiAgICAgICAgaWYoXG4gICAgICAgICAgcGF0aEZyYWdtZW50cy5sZW5ndGggJiZcbiAgICAgICAgICBwYXRoRnJhZ21lbnRzLmxlbmd0aCA9PT0gcm91dGVGcmFnbWVudHMubGVuZ3RoXG4gICAgICAgICkge1xuICAgICAgICAgIGxldCBtYXRjaFxuICAgICAgICAgIHJldHVybiByb3V0ZUZyYWdtZW50cy5maWx0ZXIoKHJvdXRlRnJhZ21lbnQsIHJvdXRlRnJhZ21lbnRJbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgIG1hdGNoID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgICAgbWF0Y2ggPT09IHRydWVcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBpZihyb3V0ZUZyYWdtZW50WzBdID09PSAnOicpIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudElES2V5ID0gcm91dGVGcmFnbWVudC5yZXBsYWNlKCc6JywgJycpXG4gICAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50SW5kZXggPT09IHBhdGhGcmFnbWVudHMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgcm91dGVEYXRhLmxvY2F0aW9uLmN1cnJlbnRJREtleSA9IGN1cnJlbnRJREtleVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByb3V0ZURhdGEubG9jYXRpb25bY3VycmVudElES2V5XSA9IHBhdGhGcmFnbWVudHNbcm91dGVGcmFnbWVudEluZGV4XVxuICAgICAgICAgICAgICAgIHJvdXRlRnJhZ21lbnQgPSB0aGlzLmZyYWdtZW50SURSZWdFeHBcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50ID0gcm91dGVGcmFnbWVudC5yZXBsYWNlKG5ldyBSZWdFeHAoJy8nLCAnZ2knKSwgJ1xcXFxcXC8nKVxuICAgICAgICAgICAgICAgIHJvdXRlRnJhZ21lbnQgPSB0aGlzLnJvdXRlRnJhZ21lbnROYW1lUmVnRXhwKHJvdXRlRnJhZ21lbnQpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbWF0Y2ggPSByb3V0ZUZyYWdtZW50LnRlc3QocGF0aEZyYWdtZW50c1tyb3V0ZUZyYWdtZW50SW5kZXhdKVxuICAgICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICBtYXRjaCA9PT0gdHJ1ZSAmJlxuICAgICAgICAgICAgICAgIHJvdXRlRnJhZ21lbnRJbmRleCA9PT0gcGF0aEZyYWdtZW50cy5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5yb3V0ZSA9IHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHJvdXRlUGF0aCxcbiAgICAgICAgICAgICAgICAgIGZyYWdtZW50czogcm91dGVGcmFnbWVudHMsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJvdXRlRGF0YS5jb250cm9sbGVyID0gcm91dGVTZXR0aW5nc1xuICAgICAgICAgICAgICAgIHJldHVybiByb3V0ZVNldHRpbmdzXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVswXVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIHJldHVybiByb3V0ZURhdGFcbiAgfVxuICBnZXQgX3JvdXRlcygpIHtcbiAgICB0aGlzLnJvdXRlcyA9IHRoaXMucm91dGVzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVzXG4gIH1cbiAgc2V0IF9yb3V0ZXMocm91dGVzKSB7XG4gICAgdGhpcy5yb3V0ZXMgPSBVdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXMsIHRoaXMuX3JvdXRlc1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXIoKSB7IHJldHVybiB0aGlzLmNvbnRyb2xsZXIgfVxuICBzZXQgX2NvbnRyb2xsZXIoY29udHJvbGxlcikgeyB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyIH1cbiAgZ2V0IF9wcmV2aW91c1VSTCgpIHsgcmV0dXJuIHRoaXMucHJldmlvdXNVUkwgfVxuICBzZXQgX3ByZXZpb3VzVVJMKHByZXZpb3VzVVJMKSB7IHRoaXMucHJldmlvdXNVUkwgPSBwcmV2aW91c1VSTCB9XG4gIGdldCBfY3VycmVudFVSTCgpIHsgcmV0dXJuIHRoaXMuY3VycmVudFVSTCB9XG4gIHNldCBfY3VycmVudFVSTChjdXJyZW50VVJMKSB7XG4gICAgaWYodGhpcy5jdXJyZW50VVJMKSB0aGlzLl9wcmV2aW91c1VSTCA9IHRoaXMuY3VycmVudFVSTFxuICAgIHRoaXMuY3VycmVudFVSTCA9IGN1cnJlbnRVUkxcbiAgfVxuICBnZXQgZnJhZ21lbnRJRFJlZ0V4cCgpIHsgcmV0dXJuIG5ldyBSZWdFeHAoL14oWzAtOUEtWlxcP1xcPVxcLFxcLlxcKlxcLVxcX1xcJ1xcXCJcXF5cXCVcXCRcXCNcXEBcXCFcXH5cXChcXClcXHtcXH1cXCZcXDxcXD5cXFxcXFwvXSkqJC8sICdnaScpIH1cbiAgcm91dGVGcmFnbWVudE5hbWVSZWdFeHAoZnJhZ21lbnQpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cCgnXicuY29uY2F0KGZyYWdtZW50LCAnJCcpKVxuICB9XG4gIGVuYWJsZVJvdXRlcygpIHtcbiAgICBpZih0aGlzLnNldHRpbmdzLmNvbnRyb2xsZXIpIHRoaXMuX2NvbnRyb2xsZXIgPSB0aGlzLnNldHRpbmdzLmNvbnRyb2xsZXJcbiAgICB0aGlzLl9yb3V0ZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnNldHRpbmdzLnJvdXRlcykucmVkdWNlKFxuICAgICAgKFxuICAgICAgICBfcm91dGVzLFxuICAgICAgICBbcm91dGVQYXRoLCByb3V0ZVNldHRpbmdzXSxcbiAgICAgICAgcm91dGVJbmRleCxcbiAgICAgICAgb3JpZ2luYWxSb3V0ZXMsXG4gICAgICApID0+IHtcbiAgICAgICAgX3JvdXRlc1tyb3V0ZVBhdGhdID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICByb3V0ZVNldHRpbmdzLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhbGxiYWNrOiB0aGlzLmNvbnRyb2xsZXJbcm91dGVTZXR0aW5ncy5jYWxsYmFja10uYmluZCh0aGlzLmNvbnRyb2xsZXIpLFxuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gX3JvdXRlc1xuICAgICAgfSxcbiAgICAgIHt9XG4gICAgKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZW5hYmxlUm91dGVFdmVudHMoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLnJvdXRlQ2hhbmdlLmJpbmQodGhpcykpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBkaXNhYmxlUm91dGVFdmVudHMoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLnJvdXRlQ2hhbmdlLmJpbmQodGhpcykpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICByb3V0ZUNoYW5nZSgpIHtcbiAgICB0aGlzLl9jdXJyZW50VVJMID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICBsZXQgcm91dGVEYXRhID0gdGhpcy5fcm91dGVEYXRhXG4gICAgaWYocm91dGVEYXRhLmNvbnRyb2xsZXIpIHtcbiAgICAgIGlmKHRoaXMucHJldmlvdXNVUkwpIHJvdXRlRGF0YS5wcmV2aW91c1VSTCA9IHRoaXMucHJldmlvdXNVUkxcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgJ25hdmlnYXRlJyxcbiAgICAgICAgcm91dGVEYXRhXG4gICAgICApXG4gICAgICByb3V0ZURhdGEuY29udHJvbGxlci5jYWxsYmFjayhyb3V0ZURhdGEpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgbmF2aWdhdGUocGF0aCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aFxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBSb3V0ZXJcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi9FdmVudHMvaW5kZXgnXG5pbXBvcnQgQ2hhbm5lbHMgZnJvbSAnLi9DaGFubmVscy9pbmRleCdcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzL2luZGV4J1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi9TZXJ2aWNlL2luZGV4J1xuaW1wb3J0IE1vZGVsIGZyb20gJy4vTW9kZWwvaW5kZXgnXG5pbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcvaW5kZXgnXG5pbXBvcnQgQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXIvaW5kZXgnXG5pbXBvcnQgUm91dGVyIGZyb20gJy4vUm91dGVyL2luZGV4J1xuY29uc3QgTVZDID0ge1xuICBFdmVudHMsXG4gIENoYW5uZWxzLFxuICBVdGlscyxcbiAgU2VydmljZSxcbiAgTW9kZWwsXG4gIFZpZXcsXG4gIENvbnRyb2xsZXIsXG4gIFJvdXRlcixcbn1cbmV4cG9ydCBkZWZhdWx0IE1WQ1xuIl0sIm5hbWVzIjpbIkV2ZW50cyIsImNvbnN0cnVjdG9yIiwiX2V2ZW50cyIsImV2ZW50cyIsImdldEV2ZW50Q2FsbGJhY2tzIiwiZXZlbnROYW1lIiwiZ2V0RXZlbnRDYWxsYmFja05hbWUiLCJldmVudENhbGxiYWNrIiwibmFtZSIsImxlbmd0aCIsImdldEV2ZW50Q2FsbGJhY2tHcm91cCIsImV2ZW50Q2FsbGJhY2tzIiwiZXZlbnRDYWxsYmFja05hbWUiLCJvbiIsImV2ZW50Q2FsbGJhY2tHcm91cCIsInB1c2giLCJvZmYiLCJhcmd1bWVudHMiLCJPYmplY3QiLCJrZXlzIiwiZW1pdCIsImV2ZW50RGF0YSIsIl9hcmd1bWVudHMiLCJ2YWx1ZXMiLCJlbnRyaWVzIiwiZXZlbnRDYWxsYmFja0dyb3VwTmFtZSIsImFkZGl0aW9uYWxBcmd1bWVudHMiLCJzcGxpY2UiLCJDaGFubmVsIiwiX3Jlc3BvbnNlcyIsInJlc3BvbnNlcyIsInJlc3BvbnNlIiwicmVzcG9uc2VOYW1lIiwicmVzcG9uc2VDYWxsYmFjayIsInJlcXVlc3QiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsIkNoYW5uZWxzIiwiX2NoYW5uZWxzIiwiY2hhbm5lbHMiLCJjaGFubmVsIiwiY2hhbm5lbE5hbWUiLCJpc0FycmF5Iiwib2JqZWN0IiwiaXNPYmplY3QiLCJpc0hUTUxFbGVtZW50IiwiSFRNTEVsZW1lbnQiLCJ0eXBlT2YiLCJkYXRhIiwiX29iamVjdCIsInBhcmFtc1RvT2JqZWN0IiwicGFyYW1zIiwic3BsaXQiLCJmb3JFYWNoIiwicGFyYW1EYXRhIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwiVUlEIiwidXVpZCIsImlpIiwiTWF0aCIsInJhbmRvbSIsInRvU3RyaW5nIiwiVXRpbHMiLCJCYXNlIiwic2V0dGluZ3MiLCJjb25maWd1cmF0aW9uIiwiX3NldHRpbmdzIiwiX2NvbmZpZ3VyYXRpb24iLCJhZGRQcm9wZXJ0aWVzIiwidWlkIiwiX3VpZCIsIl9uYW1lIiwiY2xhc3NTZXR0aW5nc1Byb3BlcnRpZXMiLCJjbGFzc1NldHRpbmciLCJjb25jYXQiLCJiaW5kYWJsZUNsYXNzUHJvcGVydGllcyIsImJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUiLCJhZGRQcm9wZXJ0eSIsImFkZFByb3BlcnR5Q2FsbGJhY2tzIiwiYWRkUHJvcGVydHlFdmVudHMiLCJyZXNldFRhcmdldENsYXNzRXZlbnRzIiwiY29udGV4dCIsInByb3BlcnR5TmFtZSIsImNhcGl0YWxpemVQcm9wZXJ0eU5hbWUiLCJtYXAiLCJjaGFyYWN0ZXIiLCJjaGFyYWN0ZXJJbmRleCIsInRvVXBwZXJDYXNlIiwiam9pbiIsImFkZFByb3BlcnR5TWV0aG9kTmFtZSIsInJlbW92ZVByb3BlcnR5TWV0aG9kTmFtZSIsImN1cnJlbnRQcm9wZXJ0eVZhbHVlcyIsImRlZmluZVByb3BlcnRpZXMiLCJ3cml0YWJsZSIsInZhbHVlIiwiZ2V0Iiwic2V0IiwidmFsdWVOYW1lIiwicHJvcGVydHlLZXkiLCJwcm9wZXJ0eUNhbGxiYWNrc05hbWUiLCJjYXBpdGFsaXplUHJvcGVydHlDYWxsYmFja3NOYW1lIiwiYWRkUHJvcGVydHlDYWxsYmFja3NOYW1lIiwicmVtb3ZlUHJvcGVydHlDYWxsYmFja3NOYW1lIiwiY3VycmVudFByb3BlcnR5Q2FsbGJhY2tWYWx1ZXMiLCJiaW5kIiwicHJvcGVydHlFdmVudHNOYW1lIiwiY2FwaXRhbGl6ZVByb3BlcnR5RXZlbnRzTmFtZSIsImFkZFByb3BlcnR5RXZlbnRzTmFtZSIsInJlbW92ZVByb3BlcnR5RXZlbnRzTmFtZSIsImN1cnJlbnRQcm9wZXJ0eUV2ZW50VmFsdWVzIiwidG9nZ2xlVGFyZ2V0Q2xhc3NFdmVudHMiLCJjbGFzc1R5cGUiLCJtZXRob2QiLCJjbGFzc1R5cGVFdmVudERhdGEiLCJjbGFzc1R5cGVDYWxsYmFja05hbWUiLCJjbGFzc1R5cGVUYXJnZXROYW1lIiwiY2xhc3NUeXBlRXZlbnROYW1lIiwiY2xhc3NUeXBlVGFyZ2V0IiwiY2xhc3NUeXBlRXZlbnRDYWxsYmFjayIsImNsYXNzVHlwZUV2ZW50Q2FsbGJhY2tOYW1lc3BhY2UiLCJlcnJvciIsIlJlZmVyZW5jZUVycm9yIiwiRGVtb1Byb2plY3QiLCJDb25zdGFudHMiLCJFcnJvcnMiLCJDTEFTU19FVkVOVF9CSU5ESU5HX0ZBSUwiLCJTZXJ2aWNlIiwiX2RlZmF1bHRzIiwiZGVmYXVsdHMiLCJjb250ZW50VHlwZSIsInJlc3BvbnNlVHlwZSIsIl9yZXNwb25zZVR5cGVzIiwiX3Jlc3BvbnNlVHlwZSIsIl94aHIiLCJmaW5kIiwicmVzcG9uc2VUeXBlSXRlbSIsIl90eXBlIiwidHlwZSIsIl91cmwiLCJ1cmwiLCJfaGVhZGVycyIsImhlYWRlcnMiLCJoZWFkZXIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwiX2RhdGEiLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3RhdHVzIiwiYWJvcnQiLCJvcGVuIiwib25sb2FkIiwib25lcnJvciIsInNlbmQiLCJ0aGVuIiwiY3VycmVudFRhcmdldCIsImNhdGNoIiwiZW5hYmxlIiwiZGlzYWJsZSIsIk1vZGVsIiwiX3NjaGVtYSIsInNjaGVtYSIsIl9pc1NldHRpbmciLCJpc1NldHRpbmciLCJfY2hhbmdpbmciLCJjaGFuZ2luZyIsIl9sb2NhbFN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJfaGlzdGlvZ3JhbSIsImhpc3Rpb2dyYW0iLCJhc3NpZ24iLCJfaGlzdG9yeSIsImhpc3RvcnkiLCJ1bnNoaWZ0IiwiX2RiIiwiZGIiLCJnZXRJdGVtIiwiZW5kcG9pbnQiLCJzZXRJdGVtIiwia2V5IiwiaW5kZXgiLCJzZXREYXRhUHJvcGVydHkiLCJ1bnNldCIsInVuc2V0RGF0YVByb3BlcnR5Iiwic2V0REIiLCJ1bnNldERCIiwiY29uZmlndXJhYmxlIiwic2V0VmFsdWVFdmVudE5hbWUiLCJzZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlRXZlbnROYW1lIiwidW5zZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlIiwic2V0RGVmYXVsdHMiLCJWaWV3IiwiX2VsZW1lbnROYW1lIiwiX2VsZW1lbnQiLCJ0YWdOYW1lIiwiZWxlbWVudE5hbWUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJlbGVtZW50IiwiRG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZWxlbWVudE9ic2VydmVyIiwib2JzZXJ2ZSIsInN1YnRyZWUiLCJjaGlsZExpc3QiLCJfYXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVLZXkiLCJhdHRyaWJ1dGVWYWx1ZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsIl9vYnNlcnZlckNhbGxiYWNrcyIsIm9ic2VydmVyQ2FsbGJhY2tzIiwiYWRkUHJvcGVydGllc1RvT2JqZWN0IiwiX2VsZW1lbnRPYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJlbGVtZW50T2JzZXJ2ZSIsIl9pbnNlcnQiLCJpbnNlcnQiLCJfdGVtcGxhdGVzIiwidGVtcGxhdGVzIiwibXV0YXRpb25SZWNvcmRMaXN0Iiwib2JzZXJ2ZXIiLCJtdXRhdGlvblJlY29yZEluZGV4IiwibXV0YXRpb25SZWNvcmQiLCJtdXRhdGlvblJlY29yZENhdGVnb3JpZXMiLCJtdXRhdGlvblJlY29yZENhdGVnb3J5IiwicmVzZXRVSSIsImF1dG9JbnNlcnQiLCJwYXJlbnRFbGVtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsIk5vZGUiLCJpbnNlcnRBZGphY2VudEVsZW1lbnQiLCJOb2RlTGlzdCIsIl9wYXJlbnRFbGVtZW50IiwiYXV0b1JlbW92ZSIsInJlbW92ZUNoaWxkIiwiQ29udHJvbGxlciIsIlJvdXRlciIsInByb3RvY29sIiwid2luZG93IiwibG9jYXRpb24iLCJob3N0bmFtZSIsInBvcnQiLCJwYXRoIiwicGF0aG5hbWUiLCJoYXNoIiwiaHJlZiIsImhhc2hJbmRleCIsImluZGV4T2YiLCJwYXJhbUluZGV4Iiwic2xpY2VTdGFydCIsInNsaWNlU3RvcCIsIl9yb3V0ZURhdGEiLCJyb3V0ZURhdGEiLCJjb250cm9sbGVyIiwiZmlsdGVyIiwiZnJhZ21lbnQiLCJoYXNoRnJhZ21lbnRzIiwiZnJhZ21lbnRzIiwiY3VycmVudFVSTCIsInJvdXRlQ29udHJvbGxlckRhdGEiLCJfcm91dGVDb250cm9sbGVyRGF0YSIsInJvdXRlcyIsInJvdXRlUGF0aCIsInJvdXRlU2V0dGluZ3MiLCJwYXRoRnJhZ21lbnRzIiwicm91dGVGcmFnbWVudHMiLCJmcmFnbWVudEluZGV4IiwibWF0Y2giLCJyb3V0ZUZyYWdtZW50Iiwicm91dGVGcmFnbWVudEluZGV4IiwidW5kZWZpbmVkIiwiY3VycmVudElES2V5IiwicmVwbGFjZSIsImZyYWdtZW50SURSZWdFeHAiLCJSZWdFeHAiLCJyb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cCIsInRlc3QiLCJyb3V0ZSIsIl9yb3V0ZXMiLCJfY29udHJvbGxlciIsIl9wcmV2aW91c1VSTCIsInByZXZpb3VzVVJMIiwiX2N1cnJlbnRVUkwiLCJlbmFibGVSb3V0ZXMiLCJyZWR1Y2UiLCJyb3V0ZUluZGV4Iiwib3JpZ2luYWxSb3V0ZXMiLCJjYWxsYmFjayIsImVuYWJsZVJvdXRlRXZlbnRzIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJvdXRlQ2hhbmdlIiwiZGlzYWJsZVJvdXRlRXZlbnRzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm5hdmlnYXRlIiwiTVZDIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxNQUFNQSxNQUFOLENBQWE7RUFDWEMsV0FBVyxHQUFHOztNQUNWQyxPQUFKLEdBQWM7U0FDUEMsTUFBTCxHQUFjLEtBQUtBLE1BQUwsSUFBZSxFQUE3QjtXQUNPLEtBQUtBLE1BQVo7OztFQUVGQyxpQkFBaUIsQ0FBQ0MsU0FBRCxFQUFZO1dBQVMsS0FBS0gsT0FBTCxDQUFhRyxTQUFiLEtBQTJCLEVBQWxDOzs7RUFDL0JDLG9CQUFvQixDQUFDQyxhQUFELEVBQWdCO1dBQzFCQSxhQUFhLENBQUNDLElBQWQsQ0FBbUJDLE1BQXBCLEdBQ0hGLGFBQWEsQ0FBQ0MsSUFEWCxHQUVILG1CQUZKOzs7RUFJRkUscUJBQXFCLENBQUNDLGNBQUQsRUFBaUJDLGlCQUFqQixFQUFvQztXQUNoREQsY0FBYyxDQUFDQyxpQkFBRCxDQUFkLElBQXFDLEVBQTVDOzs7RUFFRkMsRUFBRSxDQUFDUixTQUFELEVBQVlFLGFBQVosRUFBMkI7UUFDdkJJLGNBQWMsR0FBRyxLQUFLUCxpQkFBTCxDQUF1QkMsU0FBdkIsQ0FBckI7UUFDSU8saUJBQWlCLEdBQUcsS0FBS04sb0JBQUwsQ0FBMEJDLGFBQTFCLENBQXhCO1FBQ0lPLGtCQUFrQixHQUFHLEtBQUtKLHFCQUFMLENBQTJCQyxjQUEzQixFQUEyQ0MsaUJBQTNDLENBQXpCO0lBQ0FFLGtCQUFrQixDQUFDQyxJQUFuQixDQUF3QlIsYUFBeEI7SUFDQUksY0FBYyxDQUFDQyxpQkFBRCxDQUFkLEdBQW9DRSxrQkFBcEM7U0FDS1osT0FBTCxDQUFhRyxTQUFiLElBQTBCTSxjQUExQjtXQUNPLElBQVA7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
