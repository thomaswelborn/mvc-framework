(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.MVC = factory());
}(this, (function () { 'use strict';

  EventTarget.prototype.on = EventTarget.prototype.on || EventTarget.prototype.addEventListener;
  EventTarget.prototype.off = EventTarget.prototype.off || EventTarget.prototype.removeEventListener;

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

  var paramsToObject = function paramsToObject(params) {
    var params = params.split('&');
    var object = {};
    params.forEach(paramData => {
      paramData = paramData.split('=');
      object[paramData[0]] = decodeURIComponent(paramData[1] || '');
    });
    return JSON.parse(JSON.stringify(object));
  };

  var typeOf = function typeOf(data) {
    switch (typeof data) {
      case 'object':
        var _object;

        if (Array.isArray(data)) {
          return 'array';
        } else if (data !== null) {
          return 'object';
        } else if (data === null) {
          return 'null';
        }

        return _object;

      case 'string':
      case 'number':
      case 'boolean':
      case 'undefined':
      case 'function':
        return typeof data;
    }
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



  var Utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    paramsToObject: paramsToObject,
    typeOf: typeOf,
    UID: UID
  });

  class Base extends Events {
    constructor(settings, configuration) {
      super(...arguments);
      this.addClassDefaultProperties();
      this.addBindableClassProperties();
      this._settings = settings;
      this._configuration = configuration;
    }

    get uid() {
      this._uid = this._uid ? this._uid : UID();
      return this._uid;
    }

    get _name() {
      return this.name;
    }

    set _name(name) {
      this.name = name;
    }

    get _settings() {
      this.settings = this.settings || {};
      return this.settings;
    }

    set _settings(settings) {
      this.settings = settings || {};
      this.classDefaultProperties.forEach(classSetting => {
        if (this.settings[classSetting]) {
          this['_'.concat(classSetting)] = this.settings[classSetting];
        }
      });
      return this;
    }

    get _configuration() {
      this.configuration = this.configuration || {};
      return this.configuration;
    }

    set _configuration(configuration) {
      this.configuration = configuration;
    }

    get bindableClassPropertyExtensions() {
      return ['', 'Events', 'Callbacks'];
    }

    get _uiElementSettings() {
      this.uiElementSettings = this.uiElementSettings || {};
      return this.uiElementSettings;
    }

    set _uiElementSettings(uiElementSettings) {
      this.uiElementSettings = uiElementSettings;
    }

    capitalizePropertyName(propertyName) {
      if (propertyName.slice(0, 2) === 'ui') {
        return propertyName.replace(/^ui/, 'UI');
      } else {
        var firstCharacter = propertyName.substring(0).toUpperCase();
        return propertyName.replace(/^./, firstCharacter);
      }
    }

    addClassDefaultProperties() {
      this.classDefaultProperties.forEach(classDefaultProperty => {
        if (this[classDefaultProperty]) {
          var property = this[classDefaultProperty];
          Object.defineProperty(this, classDefaultProperty, {
            writable: true,
            value: property
          });
          this['_'.concat(classDefaultProperty)] = property;
        }
      });
      return this;
    }

    addBindableClassProperties() {
      if (this.bindableClassProperties) {
        this.bindableClassProperties.forEach(bindableClassPropertyName => {
          this.bindableClassPropertyExtensions.forEach(propertyNameExtension => {
            this.addBindableClassProperty(bindableClassPropertyName, propertyNameExtension);
          });
        });
      }

      return this;
    }

    addBindableClassProperty(bindableClassPropertyName, propertyNameExtension) {
      var context = this;
      var propertyName = bindableClassPropertyName.concat('s', propertyNameExtension);
      var capitalizePropertyName = this.capitalizePropertyName(propertyName);
      var addBindableClassPropertyName = 'add'.concat(capitalizePropertyName);
      var removeBindableClassPropertyName = 'remove'.concat(capitalizePropertyName);

      if (propertyName === 'uiElements') {
        context._uiElementSettings = this[propertyName];
      }

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
              var [key, value] = _ref;

              switch (propertyName) {
                case 'uiElements':
                  context._uiElementSettings[key] = value;
                  context['_'.concat(propertyName)][key] = context.element.querySelectorAll(value);
                  break;

                default:
                  context['_'.concat(propertyName)][key] = value;
                  break;
              }
            });
          }

        },
        [addBindableClassPropertyName]: {
          value: function value() {
            if (arguments.length === 2) {
              var key = arguments[0];
              var value = arguments[1];
              context['_'.concat(propertyName)] = {
                [key]: value
              };
            } else if (arguments.length === 1) {
              var values = arguments[0];
              context['_'.concat(propertyName)] = values;
            }

            return context;
          }
        },
        [removeBindableClassPropertyName]: {
          value: function value() {
            if (arguments.length === 1) {
              var key = arguments[0];

              switch (propertyName) {
                case 'uiElements':
                  delete context['_'.concat(propertyName)][key];
                  delete context['_'.concat('uiElementSettings')][key];
                  break;

                default:
                  delete context['_'.concat(propertyName)][key];
                  break;
              }
            } else if (arguments.length === 0) {
              Object.keys(context['_'.concat(propertyName)]).forEach(key => {
                switch (propertyName) {
                  case 'uiElements':
                    delete context['_'.concat(propertyName)][key];
                    delete context['_'.concat('uiElementSettings')][key];
                    break;

                  default:
                    delete context['_'.concat(propertyName)][key];
                    break;
                }
              });
            }

            return context;
          }
        }
      });

      if (currentPropertyValues) {
        this[addBindableClassPropertyName](currentPropertyValues);
      }

      return this;
    }

    resetTargetBindableClassEvents(bindableClassPropertyName) {
      return this.toggleTargetBindableClassEvents(bindableClassPropertyName, 'off').toggleTargetBindableClassEvents(bindableClassPropertyName, 'on');
    }

    toggleTargetBindableClassEvents(classType, method) {
      if (this[classType.concat('s')] && this[classType.concat('Events')] && this[classType.concat('Callbacks')]) {
        Object.entries(this[classType.concat('Events')]).forEach((_ref2) => {
          var [classTypeEventData, classTypeCallbackName] = _ref2;

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

                    if (classTypeTarget instanceof NodeList) {
                      Array.from(classTypeTarget).forEach(_classTypeTarget => {
                        _classTypeTarget[method](classTypeEventName, classTypeEventCallback);
                      });
                    } else if (classTypeTarget instanceof HTMLElement) {
                      classTypeTarget[method](classTypeEventName, classTypeEventCallback);
                    }

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

                    if (classTypeTarget instanceof NodeList) {
                      Array.from(classTypeTarget).forEach(_classTypeTarget => {
                        _classTypeTarget[method](classTypeEventName, classTypeEventCallbackNamespace);
                      });
                    } else if (classTypeTarget instanceof HTMLElement) {
                      classTypeTarget[method](classTypeEventName, classTypeEventCallbackNamespace);
                    }

                    break;

                  default:
                    classTypeTarget[method](classTypeEventName, classTypeEventCallback, this);
                    break;
                }

                break;
            }
          } catch (error) {
            throw new ReferenceError(error);
          }
        });
      }

      return this;
    }

  }

  // import Utils from '../Utils/index'
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

    get classDefaultProperties() {
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

        case 1:
          var key = arguments[0];
          return this._data[key];
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

    get classDefaultProperties() {
      return ['elementName', 'element', 'attributes', 'templates', 'insert'];
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
      this.element = element;
      this.elementObserver.observe(this.element, {
        subtree: true,
        childList: true
      });
    }

    get _attributes() {
      this.attributes = this.element.attributes;
      return this.attributes;
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

    get elementObserver() {
      this._elementObserver = this._elementObserver || new MutationObserver(this.elementObserve.bind(this));
      return this._elementObserver;
    }

    get _insert() {
      this.insert = this.insert || null;
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
      this.templates = templates;
    }

    resetUIElements() {
      var uiElementSettings = Object.assign({}, this._uiElementSettings);
      this.toggleTargetBindableClassEvents('uiElement', 'off');
      this.removeUIElements();
      this.addUIElements(uiElementSettings);
      this.toggleTargetBindableClassEvents('uiElement', 'on');
      return this;
    }

    elementObserve(mutationRecordList, observer) {
      for (var [mutationRecordIndex, mutationRecord] of Object.entries(mutationRecordList)) {
        switch (mutationRecord.type) {
          case 'childList':
            this.resetUIElements();
            break;
        }
      }
    }

    autoInsert() {
      if (this.insert) {
        var parentElement;

        if (typeOf(this.insert.element) === 'string') {
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
        } else if (parentElement instanceof jQuery) {
          parentElement.each((index, element) => {
            element.insertAdjacentElement(this.insert.method, this.element);
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

    get classDefaultProperties() {
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
      var paramData = params ? paramsToObject(params) : null;
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
      this.routes = routes;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL3BhcmFtc1RvT2JqZWN0LmpzIiwiLi4vLi4vc291cmNlL01WQy9VdGlscy90eXBlT2YuanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL3VpZC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQmFzZS9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvU2VydmljZS9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvTW9kZWwvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1ZpZXcvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL0NvbnRyb2xsZXIvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1JvdXRlci9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiRXZlbnRUYXJnZXQucHJvdG90eXBlLm9uID0gRXZlbnRUYXJnZXQucHJvdG90eXBlLm9uIHx8IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyXHJcbkV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vZmYgPSBFdmVudFRhcmdldC5wcm90b3R5cGUub2ZmIHx8IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyXHJcbiIsImNsYXNzIEV2ZW50cyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfZXZlbnRzKCkge1xyXG4gICAgdGhpcy5ldmVudHMgPSB0aGlzLmV2ZW50cyB8fCB7fVxyXG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzXHJcbiAgfVxyXG4gIGdldEV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSkgeyByZXR1cm4gdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gfHwge30gfVxyXG4gIGdldEV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIHJldHVybiAoZXZlbnRDYWxsYmFjay5uYW1lLmxlbmd0aClcclxuICAgICAgPyBldmVudENhbGxiYWNrLm5hbWVcclxuICAgICAgOiAnYW5vbnltb3VzRnVuY3Rpb24nXHJcbiAgfVxyXG4gIGdldEV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpIHtcclxuICAgIHJldHVybiBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gfHwgW11cclxuICB9XHJcbiAgb24oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKSB7XHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja3MgPSB0aGlzLmdldEV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSlcclxuICAgIGxldCBldmVudENhbGxiYWNrTmFtZSA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgIGxldCBldmVudENhbGxiYWNrR3JvdXAgPSB0aGlzLmdldEV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpXHJcbiAgICBldmVudENhbGxiYWNrR3JvdXAucHVzaChldmVudENhbGxiYWNrKVxyXG4gICAgZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdID0gZXZlbnRDYWxsYmFja0dyb3VwXHJcbiAgICB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSA9IGV2ZW50Q2FsbGJhY2tzXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBvZmYoKSB7XHJcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICBjYXNlIDA6XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZXZlbnRzXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAxOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDI6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2tOYW1lID0gKHR5cGVvZiBldmVudENhbGxiYWNrID09PSAnc3RyaW5nJylcclxuICAgICAgICAgID8gZXZlbnRDYWxsYmFja1xyXG4gICAgICAgICAgOiB0aGlzLmdldEV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgaWYodGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0pIHtcclxuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVtldmVudENhbGxiYWNrTmFtZV1cclxuICAgICAgICAgIGlmKFxyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9ldmVudHNbZXZlbnROYW1lXSkubGVuZ3RoID09PSAwXHJcbiAgICAgICAgICApIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgZW1pdChldmVudE5hbWUsIGV2ZW50RGF0YSkge1xyXG4gICAgbGV0IF9hcmd1bWVudHMgPSBPYmplY3QudmFsdWVzKGFyZ3VtZW50cylcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IE9iamVjdC5lbnRyaWVzKFxyXG4gICAgICB0aGlzLmdldEV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSlcclxuICAgIClcclxuICAgIGZvcihsZXQgW2V2ZW50Q2FsbGJhY2tHcm91cE5hbWUsIGV2ZW50Q2FsbGJhY2tHcm91cF0gb2YgZXZlbnRDYWxsYmFja3MpIHtcclxuICAgICAgZm9yKGxldCBldmVudENhbGxiYWNrIG9mIGV2ZW50Q2FsbGJhY2tHcm91cCkge1xyXG4gICAgICAgIGxldCBhZGRpdGlvbmFsQXJndW1lbnRzID0gX2FyZ3VtZW50cy5zcGxpY2UoMikgfHwgW11cclxuICAgICAgICBldmVudENhbGxiYWNrKGV2ZW50RGF0YSwgLi4uYWRkaXRpb25hbEFyZ3VtZW50cylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRzXHJcbiIsImNvbnN0IENoYW5uZWwgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfcmVzcG9uc2VzKCkge1xyXG4gICAgdGhpcy5yZXNwb25zZXMgPSB0aGlzLnJlc3BvbnNlcyB8fCB0aGlzLnJlc3BvbnNlc1xyXG4gICAgcmV0dXJuIHRoaXMucmVzcG9uc2VzXHJcbiAgfVxyXG4gIHJlc3BvbnNlKHJlc3BvbnNlTmFtZSwgcmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgaWYocmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgICB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSA9IHJlc3BvbnNlQ2FsbGJhY2tcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VdXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlcXVlc3QocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZih0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSkge1xyXG4gICAgICBsZXQgX2FyZ3VtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykuc2xpY2UoMSlcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKC4uLl9hcmd1bWVudHMpXHJcbiAgICB9XHJcbiAgfVxyXG4gIG9mZihyZXNwb25zZU5hbWUpIHtcclxuICAgIGlmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvcihsZXQgW3Jlc3BvbnNlTmFtZV0gb2YgT2JqZWN0LmtleXModGhpcy5fcmVzcG9uc2VzKSkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IENoYW5uZWxcclxuIiwiaW1wb3J0IENoYW5uZWwgZnJvbSAnLi9DaGFubmVsL2luZGV4J1xyXG5jb25zdCBDaGFubmVscyA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9jaGFubmVscygpIHtcclxuICAgIHRoaXMuY2hhbm5lbHMgPSB0aGlzLmNoYW5uZWxzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsc1xyXG4gIH1cclxuICBjaGFubmVsKGNoYW5uZWxOYW1lKSB7XHJcbiAgICB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0gPSAodGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdKVxyXG4gICAgICA/IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA6IG5ldyBDaGFubmVsKClcclxuICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbiAgb2ZmKGNoYW5uZWxOYW1lKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IENoYW5uZWxzXHJcbiIsImNvbnN0IHBhcmFtc1RvT2JqZWN0ID0gZnVuY3Rpb24gcGFyYW1zVG9PYmplY3QocGFyYW1zKSB7XHJcbiAgICB2YXIgcGFyYW1zID0gcGFyYW1zLnNwbGl0KCcmJylcclxuICAgIHZhciBvYmplY3QgPSB7fVxyXG4gICAgcGFyYW1zLmZvckVhY2goKHBhcmFtRGF0YSkgPT4ge1xyXG4gICAgICBwYXJhbURhdGEgPSBwYXJhbURhdGEuc3BsaXQoJz0nKVxyXG4gICAgICBvYmplY3RbcGFyYW1EYXRhWzBdXSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJhbURhdGFbMV0gfHwgJycpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqZWN0KSlcclxufVxyXG5leHBvcnQgZGVmYXVsdCBwYXJhbXNUb09iamVjdFxyXG4iLCJjb25zdCB0eXBlT2YgPSBmdW5jdGlvbiB0eXBlT2YoZGF0YSkge1xyXG4gIHN3aXRjaCh0eXBlb2YgZGF0YSkge1xyXG4gICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgbGV0IF9vYmplY3RcclxuICAgICAgaWYoXHJcbiAgICAgICAgQXJyYXkuaXNBcnJheShkYXRhKVxyXG4gICAgICApIHtcclxuICAgICAgICByZXR1cm4gJ2FycmF5J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgZGF0YSAhPT0gbnVsbFxyXG4gICAgICApIHtcclxuICAgICAgICByZXR1cm4gJ29iamVjdCdcclxuICAgICAgfSBlbHNlIGlmKFxyXG4gICAgICAgIGRhdGEgPT09IG51bGxcclxuICAgICAgKSB7XHJcbiAgICAgICAgcmV0dXJuICdudWxsJ1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBfb2JqZWN0XHJcbiAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgY2FzZSAnbnVtYmVyJzpcclxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgcmV0dXJuIHR5cGVvZiBkYXRhXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IHR5cGVPZlxyXG4iLCJjb25zdCBVSUQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHV1aWQgPSAnJywgaWlcclxuICBmb3IgKGlpID0gMDsgaWkgPCAzMjsgaWkgKz0gMSkge1xyXG4gICAgc3dpdGNoIChpaSkge1xyXG4gICAgICBjYXNlIDg6XHJcbiAgICAgIGNhc2UgMjA6XHJcbiAgICAgICAgdXVpZCArPSAnLSc7XHJcbiAgICAgICAgdXVpZCArPSAoTWF0aC5yYW5kb20oKSAqIDE2IHwgMCkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAxMjpcclxuICAgICAgICB1dWlkICs9ICctJ1xyXG4gICAgICAgIHV1aWQgKz0gJzQnXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAxNjpcclxuICAgICAgICB1dWlkICs9ICctJ1xyXG4gICAgICAgIHV1aWQgKz0gKE1hdGgucmFuZG9tKCkgKiA0IHwgOCkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB1dWlkICs9IChNYXRoLnJhbmRvbSgpICogMTYgfCAwKS50b1N0cmluZygxNilcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHV1aWRcclxufVxyXG5leHBvcnQgZGVmYXVsdCBVSURcclxuIiwiaW1wb3J0IHsgVUlEIH0gZnJvbSAnLi4vVXRpbHMvaW5kZXgnXHJcbmltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4J1xyXG5cclxuY2xhc3MgQmFzZSBleHRlbmRzIEV2ZW50cyB7XHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MsIGNvbmZpZ3VyYXRpb24pIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICAgIHRoaXMuYWRkQ2xhc3NEZWZhdWx0UHJvcGVydGllcygpXHJcbiAgICB0aGlzLmFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKClcclxuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcclxuICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uXHJcbiAgfVxyXG4gIGdldCB1aWQoKSB7XHJcbiAgICB0aGlzLl91aWQgPSAodGhpcy5fdWlkKVxyXG4gICAgPyB0aGlzLl91aWRcclxuICAgIDogVUlEKClcclxuICAgIHJldHVybiB0aGlzLl91aWRcclxuICB9XHJcbiAgZ2V0IF9uYW1lKCkgeyByZXR1cm4gdGhpcy5uYW1lIH1cclxuICBzZXQgX25hbWUobmFtZSkgeyB0aGlzLm5hbWUgPSBuYW1lIH1cclxuICBnZXQgX3NldHRpbmdzKCkge1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3MgfHwge31cclxuICAgIHJldHVybiB0aGlzLnNldHRpbmdzXHJcbiAgfVxyXG4gIHNldCBfc2V0dGluZ3Moc2V0dGluZ3MpIHtcclxuICAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3MgfHwge31cclxuICAgICB0aGlzLmNsYXNzRGVmYXVsdFByb3BlcnRpZXNcclxuICAgICAgIC5mb3JFYWNoKChjbGFzc1NldHRpbmcpID0+IHtcclxuICAgICAgICAgaWYodGhpcy5zZXR0aW5nc1tjbGFzc1NldHRpbmddKSB7XHJcbiAgICAgICAgICAgdGhpc1snXycuY29uY2F0KGNsYXNzU2V0dGluZyldID0gdGhpcy5zZXR0aW5nc1tjbGFzc1NldHRpbmddXHJcbiAgICAgICAgIH1cclxuICAgICAgIH0pXHJcbiAgICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgZ2V0IF9jb25maWd1cmF0aW9uKCkge1xyXG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gdGhpcy5jb25maWd1cmF0aW9uIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uXHJcbiAgfVxyXG4gIHNldCBfY29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSB7IHRoaXMuY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb24gfVxyXG4gIGdldCBiaW5kYWJsZUNsYXNzUHJvcGVydHlFeHRlbnNpb25zKCkgeyByZXR1cm4gW1xyXG4gICAgJycsXHJcbiAgICAnRXZlbnRzJyxcclxuICAgICdDYWxsYmFja3MnXHJcbiAgXSB9XHJcbiAgZ2V0IF91aUVsZW1lbnRTZXR0aW5ncygpIHtcclxuICAgIHRoaXMudWlFbGVtZW50U2V0dGluZ3MgPSB0aGlzLnVpRWxlbWVudFNldHRpbmdzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy51aUVsZW1lbnRTZXR0aW5nc1xyXG4gIH1cclxuICBzZXQgX3VpRWxlbWVudFNldHRpbmdzKHVpRWxlbWVudFNldHRpbmdzKSB7XHJcbiAgICB0aGlzLnVpRWxlbWVudFNldHRpbmdzID0gdWlFbGVtZW50U2V0dGluZ3NcclxuICB9XHJcbiAgY2FwaXRhbGl6ZVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpIHtcclxuICAgIGlmKHByb3BlcnR5TmFtZS5zbGljZSgwLCAyKSA9PT0gJ3VpJykge1xyXG4gICAgICByZXR1cm4gcHJvcGVydHlOYW1lLnJlcGxhY2UoL151aS8sICdVSScpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgZmlyc3RDaGFyYWN0ZXIgPSBwcm9wZXJ0eU5hbWUuc3Vic3RyaW5nKDApLnRvVXBwZXJDYXNlKClcclxuICAgICAgcmV0dXJuIHByb3BlcnR5TmFtZS5yZXBsYWNlKC9eLi8sIGZpcnN0Q2hhcmFjdGVyKVxyXG4gICAgfVxyXG4gIH1cclxuICBhZGRDbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkge1xyXG4gICAgdGhpcy5jbGFzc0RlZmF1bHRQcm9wZXJ0aWVzXHJcbiAgICAgIC5mb3JFYWNoKChjbGFzc0RlZmF1bHRQcm9wZXJ0eSkgPT4ge1xyXG4gICAgICAgIGlmKHRoaXNbY2xhc3NEZWZhdWx0UHJvcGVydHldKSB7XHJcbiAgICAgICAgICBsZXQgcHJvcGVydHkgPSB0aGlzW2NsYXNzRGVmYXVsdFByb3BlcnR5XVxyXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGNsYXNzRGVmYXVsdFByb3BlcnR5LCB7XHJcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICB2YWx1ZTogcHJvcGVydHlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICB0aGlzWydfJy5jb25jYXQoY2xhc3NEZWZhdWx0UHJvcGVydHkpXSA9IHByb3BlcnR5XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgYWRkQmluZGFibGVDbGFzc1Byb3BlcnRpZXMoKSB7XHJcbiAgICBpZih0aGlzLmJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKSB7XHJcbiAgICAgIHRoaXMuYmluZGFibGVDbGFzc1Byb3BlcnRpZXNcclxuICAgICAgICAuZm9yRWFjaCgoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5iaW5kYWJsZUNsYXNzUHJvcGVydHlFeHRlbnNpb25zXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKChwcm9wZXJ0eU5hbWVFeHRlbnNpb24pID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLmFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eShcclxuICAgICAgICAgICAgICAgIGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUsXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWVFeHRlbnNpb25cclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eShiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLCBwcm9wZXJ0eU5hbWVFeHRlbnNpb24pIHtcclxuICAgIGxldCBjb250ZXh0ID0gdGhpc1xyXG4gICAgbGV0IHByb3BlcnR5TmFtZSA9IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUuY29uY2F0KCdzJywgcHJvcGVydHlOYW1lRXh0ZW5zaW9uKVxyXG4gICAgbGV0IGNhcGl0YWxpemVQcm9wZXJ0eU5hbWUgPSB0aGlzLmNhcGl0YWxpemVQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lKVxyXG4gICAgbGV0IGFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUgPSAnYWRkJy5jb25jYXQoY2FwaXRhbGl6ZVByb3BlcnR5TmFtZSlcclxuICAgIGxldCByZW1vdmVCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lID0gJ3JlbW92ZScuY29uY2F0KGNhcGl0YWxpemVQcm9wZXJ0eU5hbWUpXHJcbiAgICBpZihwcm9wZXJ0eU5hbWUgPT09ICd1aUVsZW1lbnRzJykge1xyXG4gICAgICBjb250ZXh0Ll91aUVsZW1lbnRTZXR0aW5ncyA9IHRoaXNbcHJvcGVydHlOYW1lXVxyXG4gICAgfVxyXG4gICAgbGV0IGN1cnJlbnRQcm9wZXJ0eVZhbHVlcyA9IHRoaXNbcHJvcGVydHlOYW1lXVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXHJcbiAgICAgIHRoaXMsXHJcbiAgICAgIHtcclxuICAgICAgICBbcHJvcGVydHlOYW1lXToge1xyXG4gICAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgICB2YWx1ZTogY3VycmVudFByb3BlcnR5VmFsdWVzLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgWydfJy5jb25jYXQocHJvcGVydHlOYW1lKV06IHtcclxuICAgICAgICAgIGdldCgpIHtcclxuICAgICAgICAgICAgY29udGV4dFtwcm9wZXJ0eU5hbWVdID0gY29udGV4dFtwcm9wZXJ0eU5hbWVdIHx8IHt9XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0W3Byb3BlcnR5TmFtZV1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzZXQodmFsdWVzKSB7XHJcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHZhbHVlcylcclxuICAgICAgICAgICAgICAuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2gocHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3VpRWxlbWVudHMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuX3VpRWxlbWVudFNldHRpbmdzW2tleV0gPSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChwcm9wZXJ0eU5hbWUpXVtrZXldID0gY29udGV4dC5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0WydfJy5jb25jYXQocHJvcGVydHlOYW1lKV1ba2V5XSA9IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFthZGRCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXToge1xyXG4gICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChwcm9wZXJ0eU5hbWUpXSA9IHtcclxuICAgICAgICAgICAgICAgIFtrZXldOiB2YWx1ZVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICBsZXQgdmFsdWVzID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgICAgICAgY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5TmFtZSldID0gdmFsdWVzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHRcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIFtyZW1vdmVCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXToge1xyXG4gICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgICAgICAgIHN3aXRjaChwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3VpRWxlbWVudHMnOlxyXG4gICAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5TmFtZSldW2tleV1cclxuICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRleHRbJ18nLmNvbmNhdCgndWlFbGVtZW50U2V0dGluZ3MnKV1ba2V5XVxyXG4gICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRleHRbJ18nLmNvbmNhdChwcm9wZXJ0eU5hbWUpXVtrZXldXHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5TmFtZSldKVxyXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBzd2l0Y2gocHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndWlFbGVtZW50cyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5TmFtZSldW2tleV1cclxuICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQoJ3VpRWxlbWVudFNldHRpbmdzJyldW2tleV1cclxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQocHJvcGVydHlOYW1lKV1ba2V5XVxyXG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH1cclxuICAgIClcclxuICAgIGlmKGN1cnJlbnRQcm9wZXJ0eVZhbHVlcykge1xyXG4gICAgICB0aGlzW2FkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdKGN1cnJlbnRQcm9wZXJ0eVZhbHVlcylcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHJlc2V0VGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSB7XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gICAgICAudG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLCAnb2ZmJylcclxuICAgICAgLnRvZ2dsZVRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSwgJ29uJylcclxuICB9XHJcbiAgdG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZCkge1xyXG4gICAgaWYoXHJcbiAgICAgIHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgncycpXSAmJlxyXG4gICAgICB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXSAmJlxyXG4gICAgICB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXVxyXG4gICAgKSB7XHJcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJyldKVxyXG4gICAgICAgIC5mb3JFYWNoKChbY2xhc3NUeXBlRXZlbnREYXRhLCBjbGFzc1R5cGVDYWxsYmFja05hbWVdKSA9PiB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjbGFzc1R5cGVFdmVudERhdGEgPSBjbGFzc1R5cGVFdmVudERhdGEuc3BsaXQoJyAnKVxyXG4gICAgICAgICAgICBsZXQgY2xhc3NUeXBlVGFyZ2V0TmFtZSA9IGNsYXNzVHlwZUV2ZW50RGF0YVswXVxyXG4gICAgICAgICAgICBsZXQgY2xhc3NUeXBlRXZlbnROYW1lID0gY2xhc3NUeXBlRXZlbnREYXRhWzFdXHJcbiAgICAgICAgICAgIGxldCBjbGFzc1R5cGVUYXJnZXQgPSB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ3MnKV1bY2xhc3NUeXBlVGFyZ2V0TmFtZV1cclxuICAgICAgICAgICAgbGV0IGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2tcclxuICAgICAgICAgICAgc3dpdGNoKG1ldGhvZCkge1xyXG4gICAgICAgICAgICAgIGNhc2UgJ29uJzpcclxuICAgICAgICAgICAgICAgIHN3aXRjaChjbGFzc1R5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgY2FzZSAndWlFbGVtZW50JzpcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc1R5cGVFdmVudENhbGxiYWNrID0gdGhpc1tjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKV1bY2xhc3NUeXBlQ2FsbGJhY2tOYW1lXS5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY2xhc3NUeXBlVGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20oY2xhc3NUeXBlVGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaCgoX2NsYXNzVHlwZVRhcmdldCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF9jbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKGNsYXNzVHlwZVRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NUeXBlRXZlbnRDYWxsYmFjayA9IHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJyldW2NsYXNzVHlwZUNhbGxiYWNrTmFtZV1cclxuICAgICAgICAgICAgICAgICAgICBjbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2ssIHRoaXMpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgY2FzZSAnb2ZmJzpcclxuICAgICAgICAgICAgICAgIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2sgPSB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXVtjbGFzc1R5cGVDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2goY2xhc3NUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3VpRWxlbWVudCc6XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2tOYW1lc3BhY2UgPSBjbGFzc1R5cGVFdmVudENhbGxiYWNrLm5hbWUuc3BsaXQoJyAnKVsxXVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNsYXNzVHlwZVRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGNsYXNzVHlwZVRhcmdldClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKF9jbGFzc1R5cGVUYXJnZXQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBfY2xhc3NUeXBlVGFyZ2V0W21ldGhvZF0oY2xhc3NUeXBlRXZlbnROYW1lLCBjbGFzc1R5cGVFdmVudENhbGxiYWNrTmFtZXNwYWNlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihjbGFzc1R5cGVUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NUeXBlVGFyZ2V0W21ldGhvZF0oY2xhc3NUeXBlRXZlbnROYW1lLCBjbGFzc1R5cGVFdmVudENhbGxiYWNrTmFtZXNwYWNlKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaywgdGhpcylcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBjYXRjaChlcnJvcikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXHJcbiAgICAgICAgICAgIGVycm9yXHJcbiAgICAgICAgICApIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQmFzZVxyXG4iLCIvLyBpbXBvcnQgVXRpbHMgZnJvbSAnLi4vVXRpbHMvaW5kZXgnXG5pbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4J1xuXG5jb25zdCBTZXJ2aWNlID0gY2xhc3MgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICAgIHRoaXMuYWRkUHJvcGVydGllcygpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5kZWZhdWx0cyB8fCB7XG4gICAgY29udGVudFR5cGU6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSxcbiAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgfSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlcygpIHsgcmV0dXJuIFsnJywgJ2FycmF5YnVmZmVyJywgJ2Jsb2InLCAnZG9jdW1lbnQnLCAnanNvbicsICd0ZXh0J10gfVxuICBnZXQgX3Jlc3BvbnNlVHlwZSgpIHsgcmV0dXJuIHRoaXMucmVzcG9uc2VUeXBlIH1cbiAgc2V0IF9yZXNwb25zZVR5cGUocmVzcG9uc2VUeXBlKSB7XG4gICAgdGhpcy5feGhyLnJlc3BvbnNlVHlwZSA9IHRoaXMuX3Jlc3BvbnNlVHlwZXMuZmluZChcbiAgICAgIChyZXNwb25zZVR5cGVJdGVtKSA9PiByZXNwb25zZVR5cGVJdGVtID09PSByZXNwb25zZVR5cGVcbiAgICApIHx8IHRoaXMuX2RlZmF1bHRzLnJlc3BvbnNlVHlwZVxuICB9XG4gIGdldCBfdHlwZSgpIHsgcmV0dXJuIHRoaXMudHlwZSB9XG4gIHNldCBfdHlwZSh0eXBlKSB7IHRoaXMudHlwZSA9IHR5cGUgfVxuICBnZXQgX3VybCgpIHsgcmV0dXJuIHRoaXMudXJsIH1cbiAgc2V0IF91cmwodXJsKSB7IHRoaXMudXJsID0gdXJsIH1cbiAgZ2V0IF9oZWFkZXJzKCkgeyByZXR1cm4gdGhpcy5oZWFkZXJzIHx8IFtdIH1cbiAgc2V0IF9oZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLl9oZWFkZXJzLmxlbmd0aCA9IDBcbiAgICBoZWFkZXJzLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgdGhpcy5faGVhZGVycy5wdXNoKGhlYWRlcilcbiAgICAgIGhlYWRlciA9IE9iamVjdC5lbnRyaWVzKGhlYWRlcilbMF1cbiAgICAgIHRoaXMuX3hoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgIH0pXG4gIH1cbiAgZ2V0IF9kYXRhKCkgeyByZXR1cm4gdGhpcy5kYXRhIH1cbiAgc2V0IF9kYXRhKGRhdGEpIHsgdGhpcy5kYXRhID0gZGF0YSB9XG4gIGdldCBfeGhyKCkge1xuICAgIHRoaXMueGhyID0gKHRoaXMueGhyKVxuICAgICAgPyB0aGlzLnhoclxuICAgICAgOiBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHJldHVybiB0aGlzLnhoclxuICB9XG4gIHJlcXVlc3QoKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5kYXRhIHx8IG51bGxcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYodGhpcy5feGhyLnN0YXR1cyA9PT0gMjAwKSB0aGlzLl94aHIuYWJvcnQoKVxuICAgICAgdGhpcy5feGhyLm9wZW4odGhpcy50eXBlLCB0aGlzLnVybClcbiAgICAgIHRoaXMuX2hlYWRlcnMgPSB0aGlzLnNldHRpbmdzLmhlYWRlcnMgfHwgW3RoaXMuX2RlZmF1bHRzLmNvbnRlbnRUeXBlXVxuICAgICAgdGhpcy5feGhyLm9ubG9hZCA9IHJlc29sdmVcbiAgICAgIHRoaXMuX3hoci5vbmVycm9yID0gcmVqZWN0XG4gICAgICB0aGlzLl94aHIuc2VuZChkYXRhKVxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICB0aGlzLmVtaXQoXG4gICAgICAgICd4aHI6cmVzb2x2ZScsIHtcbiAgICAgICAgICBuYW1lOiAneGhyOnJlc29sdmUnLFxuICAgICAgICAgIGRhdGE6IHJlc3BvbnNlLmN1cnJlbnRUYXJnZXQsXG4gICAgICAgIH0sXG4gICAgICAgIHRoaXNcbiAgICAgIClcbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH0pLmNhdGNoKChlcnJvcikgPT4geyB0aHJvdyBlcnJvciB9KVxuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBPYmplY3Qua2V5cyhzZXR0aW5ncykubGVuZ3RoXG4gICAgKSB7XG4gICAgICBpZihzZXR0aW5ncy50eXBlKSB0aGlzLl90eXBlID0gc2V0dGluZ3MudHlwZVxuICAgICAgaWYoc2V0dGluZ3MudXJsKSB0aGlzLl91cmwgPSBzZXR0aW5ncy51cmxcbiAgICAgIGlmKHNldHRpbmdzLmRhdGEpIHRoaXMuX2RhdGEgPSBzZXR0aW5ncy5kYXRhIHx8IG51bGxcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MucmVzcG9uc2VUeXBlKSB0aGlzLl9yZXNwb25zZVR5cGUgPSB0aGlzLl9zZXR0aW5ncy5yZXNwb25zZVR5cGVcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIE9iamVjdC5rZXlzKHNldHRpbmdzKS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl90eXBlXG4gICAgICBkZWxldGUgdGhpcy5fdXJsXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YVxuICAgICAgZGVsZXRlIHRoaXMuX2hlYWRlcnNcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZVR5cGVcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgU2VydmljZVxuIiwiaW1wb3J0IEJhc2UgZnJvbSAnLi4vQmFzZS9pbmRleCdcblxuY29uc3QgTW9kZWwgPSBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gICAgdGhpcy5hZGRQcm9wZXJ0aWVzKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGdldCBiaW5kYWJsZUNsYXNzUHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAnZGF0YScsXG4gICAgJ3NlcnZpY2VzJ1xuICBdIH1cbiAgZ2V0IGNsYXNzRGVmYXVsdFByb3BlcnRpZXMoKSB7IHJldHVybiBbXG4gICAgJ25hbWUnLFxuICAgICdzY2hlbWEnLFxuICAgICdsb2NhbFN0b3JhZ2UnLFxuICAgICdoaXN0aW9ncmFtJyxcbiAgICAnc2VydmljZXMnLFxuICAgICdzZXJ2aWNlQ2FsbGJhY2tzJyxcbiAgICAnc2VydmljZUV2ZW50cycsXG4gICAgJ2RhdGEnLFxuICAgICdkYXRhQ2FsbGJhY2tzJyxcbiAgICAnZGF0YUV2ZW50cycsXG4gICAgJ2RlZmF1bHRzJ1xuICBdIH1cbiAgZ2V0IF9zY2hlbWEoKSB7IHJldHVybiB0aGlzLl9zY2hlbWEgfVxuICBzZXQgX3NjaGVtYShzY2hlbWEpIHsgdGhpcy5zY2hlbWEgPSBzY2hlbWEgfVxuICBnZXQgX2lzU2V0dGluZygpIHsgcmV0dXJuIHRoaXMuaXNTZXR0aW5nIH1cbiAgc2V0IF9pc1NldHRpbmcoaXNTZXR0aW5nKSB7IHRoaXMuaXNTZXR0aW5nID0gaXNTZXR0aW5nIH1cbiAgZ2V0IF9jaGFuZ2luZygpIHtcbiAgICB0aGlzLmNoYW5naW5nID0gdGhpcy5jaGFuZ2luZyB8fCB7fVxuICAgIHJldHVybiB0aGlzLmNoYW5naW5nXG4gIH1cbiAgZ2V0IF9sb2NhbFN0b3JhZ2UoKSB7IHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZSB9XG4gIHNldCBfbG9jYWxTdG9yYWdlKGxvY2FsU3RvcmFnZSkgeyB0aGlzLmxvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XG4gIGdldCBfZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLmRlZmF1bHRzIH1cbiAgc2V0IF9kZWZhdWx0cyhkZWZhdWx0cykgeyB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHMgfVxuICBnZXQgX2hpc3Rpb2dyYW0oKSB7IHJldHVybiB0aGlzLmhpc3Rpb2dyYW0gfHwge1xuICAgIGxlbmd0aDogMVxuICB9IH1cbiAgc2V0IF9oaXN0aW9ncmFtKGhpc3Rpb2dyYW0pIHtcbiAgICB0aGlzLmhpc3Rpb2dyYW0gPSBPYmplY3QuYXNzaWduKFxuICAgICAgdGhpcy5faGlzdGlvZ3JhbSxcbiAgICAgIGhpc3Rpb2dyYW1cbiAgICApXG4gIH1cbiAgZ2V0IF9oaXN0b3J5KCkge1xuICAgIHRoaXMuaGlzdG9yeSA9IHRoaXMuaGlzdG9yeSB8fCBbXVxuICAgIHJldHVybiB0aGlzLmhpc3RvcnlcbiAgfVxuICBzZXQgX2hpc3RvcnkoZGF0YSkge1xuICAgIGlmKFxuICAgICAgT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoXG4gICAgKSB7XG4gICAgICBpZih0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVuc2hpZnQodGhpcy5wYXJzZShkYXRhKSlcbiAgICAgICAgdGhpcy5faGlzdG9yeS5zcGxpY2UodGhpcy5faGlzdGlvZ3JhbS5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfZGIoKSB7XG4gICAgbGV0IGRiID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpXG4gICAgdGhpcy5kYiA9IGRiIHx8ICd7fSdcbiAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLmRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICBnZXQoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtrZXldXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdGhpcy5faXNTZXR0aW5nID0gdHJ1ZVxuICAgICAgICBsZXQgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYoaW5kZXggPT09IChfYXJndW1lbnRzLmxlbmd0aCAtIDEpKSB0aGlzLl9pc1NldHRpbmcgPSBmYWxzZVxuICAgICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpKSB7XG4gICAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREQigpIHtcbiAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHZhciBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGxldCB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgdGhpcy5fZGIgPSBkYlxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXREQigpIHtcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBkZWxldGUgdGhpcy5fZGJcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBkZWxldGUgZGJba2V5XVxuICAgICAgICB0aGlzLl9kYiA9IGRiXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpIHtcbiAgICBpZighdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldKSB7XG4gICAgICBsZXQgY29udGV4dCA9IHRoaXNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgICAgICB0aGlzLl9kYXRhLFxuICAgICAgICB7XG4gICAgICAgICAgWydfJy5jb25jYXQoa2V5KV06IHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNba2V5XSB9LFxuICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgIGxldCBzY2hlbWEgPSBjb250ZXh0Ll9zZXR0aW5ncy5zY2hlbWFcbiAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgc2NoZW1hICYmXG4gICAgICAgICAgICAgICAgc2NoZW1hW2tleV1cbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpc1trZXldID0gdmFsdWVcbiAgICAgICAgICAgICAgICBjb250ZXh0Ll9jaGFuZ2luZ1trZXldID0gdmFsdWVcbiAgICAgICAgICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgY29udGV4dC5zZXREQihrZXksIHZhbHVlKVxuICAgICAgICAgICAgICB9IGVsc2UgaWYoIXNjaGVtYSkge1xuICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgY29udGV4dC5fY2hhbmdpbmdba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIGNvbnRleHQuc2V0REIoa2V5LCB2YWx1ZSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBsZXQgc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3NldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgICAgICAgICAgICBsZXQgc2V0RXZlbnROYW1lID0gJ3NldCdcbiAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgIHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICBpZighY29udGV4dC5faXNTZXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgaWYoIU9iamVjdC52YWx1ZXMoY29udGV4dC5fY2hhbmdpbmcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgICAgICBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgZGF0YTogY29udGV4dC5fZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgICAgICAgICAge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0Ll9jaGFuZ2luZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuX2RhdGFcbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0LmNoYW5naW5nXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gICAgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldID0gdmFsdWVcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0RGF0YVByb3BlcnR5KGtleSkge1xuICAgIGxldCB1bnNldFZhbHVlRXZlbnROYW1lID0gWyd1bnNldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgIGxldCB1bnNldEV2ZW50TmFtZSA9ICd1bnNldCdcbiAgICBsZXQgdW5zZXRWYWx1ZSA9IHRoaXMuX2RhdGFba2V5XVxuICAgIGRlbGV0ZSB0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV1cbiAgICBkZWxldGUgdGhpcy5fZGF0YVtrZXldXG4gICAgdGhpcy5lbWl0KFxuICAgICAgdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiB1bnNldFZhbHVlLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdGhpc1xuICAgIClcbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldEV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRoaXNcbiAgICApXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREZWZhdWx0cygpIHtcbiAgICBsZXQgX2RlZmF1bHRzID0ge31cbiAgICBpZih0aGlzLmRlZmF1bHRzKSBPYmplY3QuYXNzaWduKF9kZWZhdWx0cywgdGhpcy5kZWZhdWx0cylcbiAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgT2JqZWN0LmFzc2lnbihfZGVmYXVsdHMsIHRoaXMuX2RiKVxuICAgIGlmKE9iamVjdC5rZXlzKF9kZWZhdWx0cykpIHRoaXMuc2V0KF9kZWZhdWx0cylcbiAgfVxuICBwYXJzZShkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5fZGF0YSB8fCB7fVxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vZGVsXG4iLCJpbXBvcnQgeyB0eXBlT2YgfSBmcm9tICcuLi9VdGlscy9pbmRleCdcbmltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNsYXNzIFZpZXcgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBiaW5kYWJsZUNsYXNzUHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAndWlFbGVtZW50J1xuICBdIH1cbiAgZ2V0IGNsYXNzRGVmYXVsdFByb3BlcnRpZXMoKSB7IHJldHVybiBbXG4gICAgJ2VsZW1lbnROYW1lJyxcbiAgICAnZWxlbWVudCcsXG4gICAgJ2F0dHJpYnV0ZXMnLFxuICAgICd0ZW1wbGF0ZXMnLFxuICAgICdpbnNlcnQnXG4gIF0gfVxuICBnZXQgX2VsZW1lbnROYW1lKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudC50YWdOYW1lIH1cbiAgc2V0IF9lbGVtZW50TmFtZShlbGVtZW50TmFtZSkge1xuICAgIGlmKCF0aGlzLl9lbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50TmFtZSlcbiAgfVxuICBnZXQgX2VsZW1lbnQoKSB7IHJldHVybiB0aGlzLmVsZW1lbnQgfVxuICBzZXQgX2VsZW1lbnQoZWxlbWVudCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICB0aGlzLmVsZW1lbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudCwge1xuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICB9KVxuICB9XG4gIGdldCBfYXR0cmlidXRlcygpIHtcbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSB0aGlzLmVsZW1lbnQuYXR0cmlidXRlc1xuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNcbiAgfVxuICBzZXQgX2F0dHJpYnV0ZXMoYXR0cmlidXRlcykge1xuICAgIGZvcihsZXQgW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpKSB7XG4gICAgICBpZih0eXBlb2YgYXR0cmlidXRlVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZUtleSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBlbGVtZW50T2JzZXJ2ZXIoKSB7XG4gICAgdGhpcy5fZWxlbWVudE9ic2VydmVyID0gdGhpcy5fZWxlbWVudE9ic2VydmVyIHx8IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuICAgICAgdGhpcy5lbGVtZW50T2JzZXJ2ZS5iaW5kKHRoaXMpXG4gICAgKVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgfVxuICBnZXQgX2luc2VydCgpIHtcbiAgICB0aGlzLmluc2VydCA9IHRoaXMuaW5zZXJ0IHx8IG51bGxcbiAgICByZXR1cm4gdGhpcy5pbnNlcnRcbiAgfVxuICBzZXQgX2luc2VydChpbnNlcnQpIHsgdGhpcy5pbnNlcnQgPSBpbnNlcnQgfVxuICBnZXQgX3RlbXBsYXRlcygpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IHRoaXMudGVtcGxhdGVzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGVzXG4gIH1cbiAgc2V0IF90ZW1wbGF0ZXModGVtcGxhdGVzKSB7IHRoaXMudGVtcGxhdGVzID0gdGVtcGxhdGVzIH1cbiAgcmVzZXRVSUVsZW1lbnRzKCkge1xuICAgIGxldCB1aUVsZW1lbnRTZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7fSxcbiAgICAgIHRoaXMuX3VpRWxlbWVudFNldHRpbmdzXG4gICAgKVxuICAgIHRoaXMudG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cygndWlFbGVtZW50JywgJ29mZicpXG4gICAgdGhpcy5yZW1vdmVVSUVsZW1lbnRzKClcbiAgICB0aGlzLmFkZFVJRWxlbWVudHModWlFbGVtZW50U2V0dGluZ3MpXG4gICAgdGhpcy50b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKCd1aUVsZW1lbnQnLCAnb24nKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZWxlbWVudE9ic2VydmUobXV0YXRpb25SZWNvcmRMaXN0LCBvYnNlcnZlcikge1xuICAgIGZvcihsZXQgW211dGF0aW9uUmVjb3JkSW5kZXgsIG11dGF0aW9uUmVjb3JkXSBvZiBPYmplY3QuZW50cmllcyhtdXRhdGlvblJlY29yZExpc3QpKSB7XG4gICAgICBzd2l0Y2gobXV0YXRpb25SZWNvcmQudHlwZSkge1xuICAgICAgICBjYXNlICdjaGlsZExpc3QnOlxuICAgICAgICAgIGxldCBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMgPSBbJ2FkZGVkTm9kZXMnLCAncmVtb3ZlZE5vZGVzJ11cbiAgICAgICAgICB0aGlzLnJlc2V0VUlFbGVtZW50cygpXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYXV0b0luc2VydCgpIHtcbiAgICBpZih0aGlzLmluc2VydCkge1xuICAgICAgbGV0IHBhcmVudEVsZW1lbnRcbiAgICAgIGlmKHR5cGVPZih0aGlzLmluc2VydC5lbGVtZW50KSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcGFyZW50RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5pbnNlcnQuZWxlbWVudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmVudEVsZW1lbnQgPSB0aGlzLmluc2VydC5lbGVtZW50XG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgcGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICAgIHBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlXG4gICAgICApIHtcbiAgICAgICAgcGFyZW50RWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQodGhpcy5pbnNlcnQubWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgICB9IGVsc2UgaWYocGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XG4gICAgICAgIHBhcmVudEVsZW1lbnRcbiAgICAgICAgICAuZm9yRWFjaCgoX3BhcmVudEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIF9wYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCh0aGlzLmluc2VydC5tZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmKHBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiBqUXVlcnkpIHtcbiAgICAgICAgcGFyZW50RWxlbWVudFxuICAgICAgICAgIC5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgZWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQodGhpcy5pbnNlcnQubWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdXRvUmVtb3ZlKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5lbGVtZW50ICYmXG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICkgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFZpZXdcbiIsImltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNvbnN0IENvbnRyb2xsZXIgPSBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gICAgdGhpcy5hZGRQcm9wZXJ0aWVzKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGdldCBiaW5kYWJsZUNsYXNzUHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAnbW9kZWwnLFxuICAgICd2aWV3JyxcbiAgICAnY29udHJvbGxlcicsXG4gICAgJ3JvdXRlcidcbiAgXSB9XG4gIGdldCBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICdtb2RlbHMnLFxuICAgICdtb2RlbEV2ZW50cycsXG4gICAgJ21vZGVsQ2FsbGJhY2tzJyxcbiAgICAndmlld3MnLFxuICAgICd2aWV3RXZlbnRzJyxcbiAgICAndmlld0NhbGxiYWNrcycsXG4gICAgJ2NvbnRyb2xsZXJzJyxcbiAgICAnY29udHJvbGxlckV2ZW50cycsXG4gICAgJ2NvbnRyb2xsZXJDYWxsYmFja3MnLFxuICAgICdyb3V0ZXJzJyxcbiAgICAncm91dGVyRXZlbnRzJyxcbiAgICAncm91dGVyQ2FsbGJhY2tzJyxcbiAgXSB9XG59XG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyXG4iLCJpbXBvcnQgeyBwYXJhbXNUb09iamVjdCB9IGZyb20gJy4uL1V0aWxzL2luZGV4J1xuaW1wb3J0IEJhc2UgZnJvbSAnLi4vQmFzZS9pbmRleCdcblxuY29uc3QgUm91dGVyID0gY2xhc3MgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZ2V0IHByb3RvY29sKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnByb3RvY29sIH1cbiAgZ2V0IGhvc3RuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lIH1cbiAgZ2V0IHBvcnQoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucG9ydCB9XG4gIGdldCBwYXRoKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIH1cbiAgZ2V0IGhhc2goKSB7XG4gICAgbGV0IGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgIGxldCBoYXNoSW5kZXggPSBocmVmLmluZGV4T2YoJyMnKVxuICAgIGlmKGhhc2hJbmRleCA+IC0xKSB7XG4gICAgICBsZXQgcGFyYW1JbmRleCA9IGhyZWYuaW5kZXhPZignPycpXG4gICAgICBsZXQgc2xpY2VTdGFydCA9IGhhc2hJbmRleCArIDFcbiAgICAgIGxldCBzbGljZVN0b3BcbiAgICAgIGlmKHBhcmFtSW5kZXggPiAtMSkge1xuICAgICAgICBzbGljZVN0b3AgPSAoaGFzaEluZGV4ID4gcGFyYW1JbmRleClcbiAgICAgICAgICA/IGhyZWYubGVuZ3RoXG4gICAgICAgICAgOiBwYXJhbUluZGV4XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzbGljZVN0b3AgPSBocmVmLmxlbmd0aFxuICAgICAgfVxuICAgICAgaHJlZiA9IGhyZWYuc2xpY2Uoc2xpY2VTdGFydCwgc2xpY2VTdG9wKVxuICAgICAgaWYoaHJlZi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGhyZWZcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG4gIGdldCBwYXJhbXMoKSB7XG4gICAgbGV0IGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgIGxldCBwYXJhbUluZGV4ID0gaHJlZi5pbmRleE9mKCc/JylcbiAgICBpZihwYXJhbUluZGV4ID4gLTEpIHtcbiAgICAgIGxldCBoYXNoSW5kZXggPSBocmVmLmluZGV4T2YoJyMnKVxuICAgICAgbGV0IHNsaWNlU3RhcnQgPSBwYXJhbUluZGV4ICsgMVxuICAgICAgbGV0IHNsaWNlU3RvcFxuICAgICAgaWYoaGFzaEluZGV4ID4gLTEpIHtcbiAgICAgICAgc2xpY2VTdG9wID0gKHBhcmFtSW5kZXggPiBoYXNoSW5kZXgpXG4gICAgICAgICAgPyBocmVmLmxlbmd0aFxuICAgICAgICAgIDogaGFzaEluZGV4XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzbGljZVN0b3AgPSBocmVmLmxlbmd0aFxuICAgICAgfVxuICAgICAgaHJlZiA9IGhyZWYuc2xpY2Uoc2xpY2VTdGFydCwgc2xpY2VTdG9wKVxuICAgICAgaWYoaHJlZi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGhyZWZcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG4gIGdldCBfcm91dGVEYXRhKCkge1xuICAgIGxldCByb3V0ZURhdGEgPSB7XG4gICAgICBsb2NhdGlvbjoge30sXG4gICAgICBjb250cm9sbGVyOiB7fSxcbiAgICB9XG4gICAgbGV0IHBhdGggPSB0aGlzLnBhdGguc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgcGF0aCA9IChwYXRoLmxlbmd0aClcbiAgICAgID8gcGF0aFxuICAgICAgOiBbJy8nXVxuICAgIGxldCBoYXNoID0gdGhpcy5oYXNoXG4gICAgbGV0IGhhc2hGcmFnbWVudHMgPSAoaGFzaClcbiAgICAgID8gaGFzaC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgIDogbnVsbFxuICAgIGxldCBwYXJhbXMgPSB0aGlzLnBhcmFtc1xuICAgIGxldCBwYXJhbURhdGEgPSAocGFyYW1zKVxuICAgICAgPyBwYXJhbXNUb09iamVjdChwYXJhbXMpXG4gICAgICA6IG51bGxcbiAgICBpZih0aGlzLnByb3RvY29sKSByb3V0ZURhdGEubG9jYXRpb24ucHJvdG9jb2wgPSB0aGlzLnByb3RvY29sXG4gICAgaWYodGhpcy5ob3N0bmFtZSkgcm91dGVEYXRhLmxvY2F0aW9uLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZVxuICAgIGlmKHRoaXMucG9ydCkgcm91dGVEYXRhLmxvY2F0aW9uLnBvcnQgPSB0aGlzLnBvcnRcbiAgICBpZih0aGlzLnBhdGgpIHJvdXRlRGF0YS5sb2NhdGlvbi5wYXRoID0gdGhpcy5wYXRoXG4gICAgaWYoXG4gICAgICBoYXNoICYmXG4gICAgICBoYXNoRnJhZ21lbnRzXG4gICAgKSB7XG4gICAgICBoYXNoRnJhZ21lbnRzID0gKGhhc2hGcmFnbWVudHMubGVuZ3RoKVxuICAgICAgICA/IGhhc2hGcmFnbWVudHNcbiAgICAgICAgOiBbJy8nXVxuICAgICAgcm91dGVEYXRhLmxvY2F0aW9uLmhhc2ggPSB7XG4gICAgICAgIHBhdGg6IGhhc2gsXG4gICAgICAgIGZyYWdtZW50czogaGFzaEZyYWdtZW50cyxcbiAgICAgIH1cbiAgICB9XG4gICAgaWYoXG4gICAgICBwYXJhbXMgJiZcbiAgICAgIHBhcmFtRGF0YVxuICAgICkge1xuICAgICAgcm91dGVEYXRhLmxvY2F0aW9uLnBhcmFtcyA9IHtcbiAgICAgICAgcGF0aDogcGFyYW1zLFxuICAgICAgICBkYXRhOiBwYXJhbURhdGEsXG4gICAgICB9XG4gICAgfVxuICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5wYXRoID0ge1xuICAgICAgbmFtZTogdGhpcy5wYXRoLFxuICAgICAgZnJhZ21lbnRzOiBwYXRoLFxuICAgIH1cbiAgICByb3V0ZURhdGEubG9jYXRpb24uY3VycmVudFVSTCA9IHRoaXMuY3VycmVudFVSTFxuICAgIGxldCByb3V0ZUNvbnRyb2xsZXJEYXRhID0gdGhpcy5fcm91dGVDb250cm9sbGVyRGF0YVxuICAgIHJvdXRlRGF0YS5sb2NhdGlvbiA9IE9iamVjdC5hc3NpZ24oXG4gICAgICByb3V0ZURhdGEubG9jYXRpb24sXG4gICAgICByb3V0ZUNvbnRyb2xsZXJEYXRhLmxvY2F0aW9uXG4gICAgKVxuICAgIHJvdXRlRGF0YS5jb250cm9sbGVyID0gcm91dGVDb250cm9sbGVyRGF0YS5jb250cm9sbGVyXG4gICAgdGhpcy5yb3V0ZURhdGEgPSByb3V0ZURhdGFcbiAgICByZXR1cm4gdGhpcy5yb3V0ZURhdGFcbiAgfVxuICBnZXQgX3JvdXRlQ29udHJvbGxlckRhdGEoKSB7XG4gICAgbGV0IHJvdXRlRGF0YSA9IHtcbiAgICAgIGxvY2F0aW9uOiB7fSxcbiAgICB9XG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5yb3V0ZXMpXG4gICAgICAuZm9yRWFjaCgoW3JvdXRlUGF0aCwgcm91dGVTZXR0aW5nc10pID0+IHtcbiAgICAgICAgbGV0IHBhdGhGcmFnbWVudHMgPSB0aGlzLnBhdGguc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgICAgIHBhdGhGcmFnbWVudHMgPSAocGF0aEZyYWdtZW50cy5sZW5ndGgpXG4gICAgICAgICAgPyBwYXRoRnJhZ21lbnRzXG4gICAgICAgICAgOiBbJy8nXVxuICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSByb3V0ZVBhdGguc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50LCBmcmFnbWVudEluZGV4KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgICAgIHJvdXRlRnJhZ21lbnRzID0gKHJvdXRlRnJhZ21lbnRzLmxlbmd0aClcbiAgICAgICAgICA/IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgICAgOiBbJy8nXVxuICAgICAgICBpZihcbiAgICAgICAgICBwYXRoRnJhZ21lbnRzLmxlbmd0aCAmJlxuICAgICAgICAgIHBhdGhGcmFnbWVudHMubGVuZ3RoID09PSByb3V0ZUZyYWdtZW50cy5sZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgbGV0IG1hdGNoXG4gICAgICAgICAgcmV0dXJuIHJvdXRlRnJhZ21lbnRzLmZpbHRlcigocm91dGVGcmFnbWVudCwgcm91dGVGcmFnbWVudEluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgbWF0Y2ggPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICBtYXRjaCA9PT0gdHJ1ZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGlmKHJvdXRlRnJhZ21lbnRbMF0gPT09ICc6Jykge1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50SURLZXkgPSByb3V0ZUZyYWdtZW50LnJlcGxhY2UoJzonLCAnJylcbiAgICAgICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICAgIHJvdXRlRnJhZ21lbnRJbmRleCA9PT0gcGF0aEZyYWdtZW50cy5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICByb3V0ZURhdGEubG9jYXRpb24uY3VycmVudElES2V5ID0gY3VycmVudElES2V5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbltjdXJyZW50SURLZXldID0gcGF0aEZyYWdtZW50c1tyb3V0ZUZyYWdtZW50SW5kZXhdXG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudCA9IHRoaXMuZnJhZ21lbnRJRFJlZ0V4cFxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJvdXRlRnJhZ21lbnQgPSByb3V0ZUZyYWdtZW50LnJlcGxhY2UobmV3IFJlZ0V4cCgnLycsICdnaScpLCAnXFxcXFxcLycpXG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudCA9IHRoaXMucm91dGVGcmFnbWVudE5hbWVSZWdFeHAocm91dGVGcmFnbWVudClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBtYXRjaCA9IHJvdXRlRnJhZ21lbnQudGVzdChwYXRoRnJhZ21lbnRzW3JvdXRlRnJhZ21lbnRJbmRleF0pXG4gICAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICAgIG1hdGNoID09PSB0cnVlICYmXG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudEluZGV4ID09PSBwYXRoRnJhZ21lbnRzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcm91dGVEYXRhLmxvY2F0aW9uLnJvdXRlID0ge1xuICAgICAgICAgICAgICAgICAgbmFtZTogcm91dGVQYXRoLFxuICAgICAgICAgICAgICAgICAgZnJhZ21lbnRzOiByb3V0ZUZyYWdtZW50cyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcm91dGVEYXRhLmNvbnRyb2xsZXIgPSByb3V0ZVNldHRpbmdzXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pWzBdXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgcmV0dXJuIHJvdXRlRGF0YVxuICB9XG4gIGdldCBfcm91dGVzKCkge1xuICAgIHRoaXMucm91dGVzID0gdGhpcy5yb3V0ZXMgfHwge31cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXNcbiAgfVxuICBzZXQgX3JvdXRlcyhyb3V0ZXMpIHtcbiAgICB0aGlzLnJvdXRlcyA9IHJvdXRlc1xuICB9XG4gIGdldCBfY29udHJvbGxlcigpIHsgcmV0dXJuIHRoaXMuY29udHJvbGxlciB9XG4gIHNldCBfY29udHJvbGxlcihjb250cm9sbGVyKSB7IHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXIgfVxuICBnZXQgX3ByZXZpb3VzVVJMKCkgeyByZXR1cm4gdGhpcy5wcmV2aW91c1VSTCB9XG4gIHNldCBfcHJldmlvdXNVUkwocHJldmlvdXNVUkwpIHsgdGhpcy5wcmV2aW91c1VSTCA9IHByZXZpb3VzVVJMIH1cbiAgZ2V0IF9jdXJyZW50VVJMKCkgeyByZXR1cm4gdGhpcy5jdXJyZW50VVJMIH1cbiAgc2V0IF9jdXJyZW50VVJMKGN1cnJlbnRVUkwpIHtcbiAgICBpZih0aGlzLmN1cnJlbnRVUkwpIHRoaXMuX3ByZXZpb3VzVVJMID0gdGhpcy5jdXJyZW50VVJMXG4gICAgdGhpcy5jdXJyZW50VVJMID0gY3VycmVudFVSTFxuICB9XG4gIGdldCBmcmFnbWVudElEUmVnRXhwKCkgeyByZXR1cm4gbmV3IFJlZ0V4cCgvXihbMC05QS1aXFw/XFw9XFwsXFwuXFwqXFwtXFxfXFwnXFxcIlxcXlxcJVxcJFxcI1xcQFxcIVxcflxcKFxcKVxce1xcfVxcJlxcPFxcPlxcXFxcXC9dKSokLywgJ2dpJykgfVxuICByb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cChmcmFnbWVudCkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKCdeJy5jb25jYXQoZnJhZ21lbnQsICckJykpXG4gIH1cbiAgZW5hYmxlUm91dGVzKCkge1xuICAgIGlmKHRoaXMuc2V0dGluZ3MuY29udHJvbGxlcikgdGhpcy5fY29udHJvbGxlciA9IHRoaXMuc2V0dGluZ3MuY29udHJvbGxlclxuICAgIHRoaXMuX3JvdXRlcyA9IE9iamVjdC5lbnRyaWVzKHRoaXMuc2V0dGluZ3Mucm91dGVzKS5yZWR1Y2UoXG4gICAgICAoXG4gICAgICAgIF9yb3V0ZXMsXG4gICAgICAgIFtyb3V0ZVBhdGgsIHJvdXRlU2V0dGluZ3NdLFxuICAgICAgICByb3V0ZUluZGV4LFxuICAgICAgICBvcmlnaW5hbFJvdXRlcyxcbiAgICAgICkgPT4ge1xuICAgICAgICBfcm91dGVzW3JvdXRlUGF0aF0gPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHJvdXRlU2V0dGluZ3MsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FsbGJhY2s6IHRoaXMuY29udHJvbGxlcltyb3V0ZVNldHRpbmdzLmNhbGxiYWNrXS5iaW5kKHRoaXMuY29udHJvbGxlciksXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICAgIHJldHVybiBfcm91dGVzXG4gICAgICB9LFxuICAgICAge31cbiAgICApXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBlbmFibGVSb3V0ZUV2ZW50cygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMucm91dGVDaGFuZ2UuYmluZCh0aGlzKSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGVSb3V0ZUV2ZW50cygpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMucm91dGVDaGFuZ2UuYmluZCh0aGlzKSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHJvdXRlQ2hhbmdlKCkge1xuICAgIHRoaXMuX2N1cnJlbnRVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgIGxldCByb3V0ZURhdGEgPSB0aGlzLl9yb3V0ZURhdGFcbiAgICBpZihyb3V0ZURhdGEuY29udHJvbGxlcikge1xuICAgICAgaWYodGhpcy5wcmV2aW91c1VSTCkgcm91dGVEYXRhLnByZXZpb3VzVVJMID0gdGhpcy5wcmV2aW91c1VSTFxuICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAnbmF2aWdhdGUnLFxuICAgICAgICByb3V0ZURhdGFcbiAgICAgIClcbiAgICAgIHJvdXRlRGF0YS5jb250cm9sbGVyLmNhbGxiYWNrKHJvdXRlRGF0YSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBuYXZpZ2F0ZShwYXRoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFJvdXRlclxuIiwiaW1wb3J0ICcuL1NoaW1zL2V2ZW50cydcbmltcG9ydCBFdmVudHMgZnJvbSAnLi9FdmVudHMvaW5kZXgnXG5pbXBvcnQgQ2hhbm5lbHMgZnJvbSAnLi9DaGFubmVscy9pbmRleCdcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vVXRpbHMvaW5kZXgnXG5pbXBvcnQgU2VydmljZSBmcm9tICcuL1NlcnZpY2UvaW5kZXgnXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi9Nb2RlbC9pbmRleCdcbmltcG9ydCBWaWV3IGZyb20gJy4vVmlldy9pbmRleCdcbmltcG9ydCBDb250cm9sbGVyIGZyb20gJy4vQ29udHJvbGxlci9pbmRleCdcbmltcG9ydCBSb3V0ZXIgZnJvbSAnLi9Sb3V0ZXIvaW5kZXgnXG5jb25zdCBNVkMgPSB7XG4gIEV2ZW50cyxcbiAgQ2hhbm5lbHMsXG4gIFV0aWxzLFxuICBTZXJ2aWNlLFxuICBNb2RlbCxcbiAgVmlldyxcbiAgQ29udHJvbGxlcixcbiAgUm91dGVyLFxufVxuZXhwb3J0IGRlZmF1bHQgTVZDXG4iXSwibmFtZXMiOlsiRXZlbnRUYXJnZXQiLCJwcm90b3R5cGUiLCJvbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJvZmYiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiRXZlbnRzIiwiY29uc3RydWN0b3IiLCJfZXZlbnRzIiwiZXZlbnRzIiwiZ2V0RXZlbnRDYWxsYmFja3MiLCJldmVudE5hbWUiLCJnZXRFdmVudENhbGxiYWNrTmFtZSIsImV2ZW50Q2FsbGJhY2siLCJuYW1lIiwibGVuZ3RoIiwiZ2V0RXZlbnRDYWxsYmFja0dyb3VwIiwiZXZlbnRDYWxsYmFja3MiLCJldmVudENhbGxiYWNrTmFtZSIsImV2ZW50Q2FsbGJhY2tHcm91cCIsInB1c2giLCJhcmd1bWVudHMiLCJPYmplY3QiLCJrZXlzIiwiZW1pdCIsImV2ZW50RGF0YSIsIl9hcmd1bWVudHMiLCJ2YWx1ZXMiLCJlbnRyaWVzIiwiZXZlbnRDYWxsYmFja0dyb3VwTmFtZSIsImFkZGl0aW9uYWxBcmd1bWVudHMiLCJzcGxpY2UiLCJDaGFubmVsIiwiX3Jlc3BvbnNlcyIsInJlc3BvbnNlcyIsInJlc3BvbnNlIiwicmVzcG9uc2VOYW1lIiwicmVzcG9uc2VDYWxsYmFjayIsInJlcXVlc3QiLCJBcnJheSIsInNsaWNlIiwiY2FsbCIsIkNoYW5uZWxzIiwiX2NoYW5uZWxzIiwiY2hhbm5lbHMiLCJjaGFubmVsIiwiY2hhbm5lbE5hbWUiLCJwYXJhbXNUb09iamVjdCIsInBhcmFtcyIsInNwbGl0Iiwib2JqZWN0IiwiZm9yRWFjaCIsInBhcmFtRGF0YSIsImRlY29kZVVSSUNvbXBvbmVudCIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsInR5cGVPZiIsImRhdGEiLCJfb2JqZWN0IiwiaXNBcnJheSIsIlVJRCIsInV1aWQiLCJpaSIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsIkJhc2UiLCJzZXR0aW5ncyIsImNvbmZpZ3VyYXRpb24iLCJhZGRDbGFzc0RlZmF1bHRQcm9wZXJ0aWVzIiwiYWRkQmluZGFibGVDbGFzc1Byb3BlcnRpZXMiLCJfc2V0dGluZ3MiLCJfY29uZmlndXJhdGlvbiIsInVpZCIsIl91aWQiLCJfbmFtZSIsImNsYXNzRGVmYXVsdFByb3BlcnRpZXMiLCJjbGFzc1NldHRpbmciLCJjb25jYXQiLCJiaW5kYWJsZUNsYXNzUHJvcGVydHlFeHRlbnNpb25zIiwiX3VpRWxlbWVudFNldHRpbmdzIiwidWlFbGVtZW50U2V0dGluZ3MiLCJjYXBpdGFsaXplUHJvcGVydHlOYW1lIiwicHJvcGVydHlOYW1lIiwicmVwbGFjZSIsImZpcnN0Q2hhcmFjdGVyIiwic3Vic3RyaW5nIiwidG9VcHBlckNhc2UiLCJjbGFzc0RlZmF1bHRQcm9wZXJ0eSIsInByb3BlcnR5IiwiZGVmaW5lUHJvcGVydHkiLCJ3cml0YWJsZSIsInZhbHVlIiwiYmluZGFibGVDbGFzc1Byb3BlcnRpZXMiLCJiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lIiwicHJvcGVydHlOYW1lRXh0ZW5zaW9uIiwiYWRkQmluZGFibGVDbGFzc1Byb3BlcnR5IiwiY29udGV4dCIsImFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUiLCJyZW1vdmVCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lIiwiY3VycmVudFByb3BlcnR5VmFsdWVzIiwiZGVmaW5lUHJvcGVydGllcyIsImdldCIsInNldCIsImtleSIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwicmVzZXRUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzIiwidG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyIsImNsYXNzVHlwZSIsIm1ldGhvZCIsImNsYXNzVHlwZUV2ZW50RGF0YSIsImNsYXNzVHlwZUNhbGxiYWNrTmFtZSIsImNsYXNzVHlwZVRhcmdldE5hbWUiLCJjbGFzc1R5cGVFdmVudE5hbWUiLCJjbGFzc1R5cGVUYXJnZXQiLCJjbGFzc1R5cGVFdmVudENhbGxiYWNrIiwiYmluZCIsIk5vZGVMaXN0IiwiZnJvbSIsIl9jbGFzc1R5cGVUYXJnZXQiLCJIVE1MRWxlbWVudCIsImNsYXNzVHlwZUV2ZW50Q2FsbGJhY2tOYW1lc3BhY2UiLCJlcnJvciIsIlJlZmVyZW5jZUVycm9yIiwiU2VydmljZSIsImFkZFByb3BlcnRpZXMiLCJfZGVmYXVsdHMiLCJkZWZhdWx0cyIsImNvbnRlbnRUeXBlIiwicmVzcG9uc2VUeXBlIiwiX3Jlc3BvbnNlVHlwZXMiLCJfcmVzcG9uc2VUeXBlIiwiX3hociIsImZpbmQiLCJyZXNwb25zZVR5cGVJdGVtIiwiX3R5cGUiLCJ0eXBlIiwiX3VybCIsInVybCIsIl9oZWFkZXJzIiwiaGVhZGVycyIsImhlYWRlciIsInNldFJlcXVlc3RIZWFkZXIiLCJfZGF0YSIsInhociIsIlhNTEh0dHBSZXF1ZXN0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzdGF0dXMiLCJhYm9ydCIsIm9wZW4iLCJvbmxvYWQiLCJvbmVycm9yIiwic2VuZCIsInRoZW4iLCJjdXJyZW50VGFyZ2V0IiwiY2F0Y2giLCJlbmFibGUiLCJkaXNhYmxlIiwiTW9kZWwiLCJfc2NoZW1hIiwic2NoZW1hIiwiX2lzU2V0dGluZyIsImlzU2V0dGluZyIsIl9jaGFuZ2luZyIsImNoYW5naW5nIiwiX2xvY2FsU3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsIl9oaXN0aW9ncmFtIiwiaGlzdGlvZ3JhbSIsImFzc2lnbiIsIl9oaXN0b3J5IiwiaGlzdG9yeSIsInVuc2hpZnQiLCJfZGIiLCJkYiIsImdldEl0ZW0iLCJlbmRwb2ludCIsInNldEl0ZW0iLCJpbmRleCIsInNldERhdGFQcm9wZXJ0eSIsInVuc2V0IiwidW5zZXREYXRhUHJvcGVydHkiLCJzZXREQiIsInVuc2V0REIiLCJjb25maWd1cmFibGUiLCJzZXRWYWx1ZUV2ZW50TmFtZSIsImpvaW4iLCJzZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlRXZlbnROYW1lIiwidW5zZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlIiwic2V0RGVmYXVsdHMiLCJWaWV3IiwiX2VsZW1lbnROYW1lIiwiX2VsZW1lbnQiLCJ0YWdOYW1lIiwiZWxlbWVudE5hbWUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJlbGVtZW50T2JzZXJ2ZXIiLCJvYnNlcnZlIiwic3VidHJlZSIsImNoaWxkTGlzdCIsIl9hdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZUtleSIsImF0dHJpYnV0ZVZhbHVlIiwicmVtb3ZlQXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwiX2VsZW1lbnRPYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJlbGVtZW50T2JzZXJ2ZSIsIl9pbnNlcnQiLCJpbnNlcnQiLCJfdGVtcGxhdGVzIiwidGVtcGxhdGVzIiwicmVzZXRVSUVsZW1lbnRzIiwicmVtb3ZlVUlFbGVtZW50cyIsImFkZFVJRWxlbWVudHMiLCJtdXRhdGlvblJlY29yZExpc3QiLCJvYnNlcnZlciIsIm11dGF0aW9uUmVjb3JkSW5kZXgiLCJtdXRhdGlvblJlY29yZCIsImF1dG9JbnNlcnQiLCJwYXJlbnRFbGVtZW50IiwiTm9kZSIsImluc2VydEFkamFjZW50RWxlbWVudCIsIl9wYXJlbnRFbGVtZW50IiwialF1ZXJ5IiwiZWFjaCIsImF1dG9SZW1vdmUiLCJyZW1vdmVDaGlsZCIsIkNvbnRyb2xsZXIiLCJSb3V0ZXIiLCJwcm90b2NvbCIsIndpbmRvdyIsImxvY2F0aW9uIiwiaG9zdG5hbWUiLCJwb3J0IiwicGF0aCIsInBhdGhuYW1lIiwiaGFzaCIsImhyZWYiLCJoYXNoSW5kZXgiLCJpbmRleE9mIiwicGFyYW1JbmRleCIsInNsaWNlU3RhcnQiLCJzbGljZVN0b3AiLCJfcm91dGVEYXRhIiwicm91dGVEYXRhIiwiY29udHJvbGxlciIsImZpbHRlciIsImZyYWdtZW50IiwiaGFzaEZyYWdtZW50cyIsImZyYWdtZW50cyIsImN1cnJlbnRVUkwiLCJyb3V0ZUNvbnRyb2xsZXJEYXRhIiwiX3JvdXRlQ29udHJvbGxlckRhdGEiLCJyb3V0ZXMiLCJyb3V0ZVBhdGgiLCJyb3V0ZVNldHRpbmdzIiwicGF0aEZyYWdtZW50cyIsInJvdXRlRnJhZ21lbnRzIiwiZnJhZ21lbnRJbmRleCIsIm1hdGNoIiwicm91dGVGcmFnbWVudCIsInJvdXRlRnJhZ21lbnRJbmRleCIsInVuZGVmaW5lZCIsImN1cnJlbnRJREtleSIsImZyYWdtZW50SURSZWdFeHAiLCJSZWdFeHAiLCJyb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cCIsInRlc3QiLCJyb3V0ZSIsIl9yb3V0ZXMiLCJfY29udHJvbGxlciIsIl9wcmV2aW91c1VSTCIsInByZXZpb3VzVVJMIiwiX2N1cnJlbnRVUkwiLCJlbmFibGVSb3V0ZXMiLCJyZWR1Y2UiLCJyb3V0ZUluZGV4Iiwib3JpZ2luYWxSb3V0ZXMiLCJjYWxsYmFjayIsImVuYWJsZVJvdXRlRXZlbnRzIiwicm91dGVDaGFuZ2UiLCJkaXNhYmxlUm91dGVFdmVudHMiLCJuYXZpZ2F0ZSIsIk1WQyIsIlV0aWxzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7RUFBQUEsV0FBVyxDQUFDQyxTQUFaLENBQXNCQyxFQUF0QixHQUEyQkYsV0FBVyxDQUFDQyxTQUFaLENBQXNCQyxFQUF0QixJQUE0QkYsV0FBVyxDQUFDQyxTQUFaLENBQXNCRSxnQkFBN0U7RUFDQUgsV0FBVyxDQUFDQyxTQUFaLENBQXNCRyxHQUF0QixHQUE0QkosV0FBVyxDQUFDQyxTQUFaLENBQXNCRyxHQUF0QixJQUE2QkosV0FBVyxDQUFDQyxTQUFaLENBQXNCSSxtQkFBL0U7O0VDREEsTUFBTUMsTUFBTixDQUFhO0VBQ1hDLEVBQUFBLFdBQVcsR0FBRzs7RUFDZCxNQUFJQyxPQUFKLEdBQWM7RUFDWixTQUFLQyxNQUFMLEdBQWMsS0FBS0EsTUFBTCxJQUFlLEVBQTdCO0VBQ0EsV0FBTyxLQUFLQSxNQUFaO0VBQ0Q7O0VBQ0RDLEVBQUFBLGlCQUFpQixDQUFDQyxTQUFELEVBQVk7RUFBRSxXQUFPLEtBQUtILE9BQUwsQ0FBYUcsU0FBYixLQUEyQixFQUFsQztFQUFzQzs7RUFDckVDLEVBQUFBLG9CQUFvQixDQUFDQyxhQUFELEVBQWdCO0VBQ2xDLFdBQVFBLGFBQWEsQ0FBQ0MsSUFBZCxDQUFtQkMsTUFBcEIsR0FDSEYsYUFBYSxDQUFDQyxJQURYLEdBRUgsbUJBRko7RUFHRDs7RUFDREUsRUFBQUEscUJBQXFCLENBQUNDLGNBQUQsRUFBaUJDLGlCQUFqQixFQUFvQztFQUN2RCxXQUFPRCxjQUFjLENBQUNDLGlCQUFELENBQWQsSUFBcUMsRUFBNUM7RUFDRDs7RUFDRGhCLEVBQUFBLEVBQUUsQ0FBQ1MsU0FBRCxFQUFZRSxhQUFaLEVBQTJCO0VBQzNCLFFBQUlJLGNBQWMsR0FBRyxLQUFLUCxpQkFBTCxDQUF1QkMsU0FBdkIsQ0FBckI7RUFDQSxRQUFJTyxpQkFBaUIsR0FBRyxLQUFLTixvQkFBTCxDQUEwQkMsYUFBMUIsQ0FBeEI7RUFDQSxRQUFJTSxrQkFBa0IsR0FBRyxLQUFLSCxxQkFBTCxDQUEyQkMsY0FBM0IsRUFBMkNDLGlCQUEzQyxDQUF6QjtFQUNBQyxJQUFBQSxrQkFBa0IsQ0FBQ0MsSUFBbkIsQ0FBd0JQLGFBQXhCO0VBQ0FJLElBQUFBLGNBQWMsQ0FBQ0MsaUJBQUQsQ0FBZCxHQUFvQ0Msa0JBQXBDO0VBQ0EsU0FBS1gsT0FBTCxDQUFhRyxTQUFiLElBQTBCTSxjQUExQjtFQUNBLFdBQU8sSUFBUDtFQUNEOztFQUNEYixFQUFBQSxHQUFHLEdBQUc7RUFDSixZQUFPaUIsU0FBUyxDQUFDTixNQUFqQjtFQUNFLFdBQUssQ0FBTDtFQUNFLGVBQU8sS0FBS04sTUFBWjtFQUNBOztFQUNGLFdBQUssQ0FBTDtFQUNFLFlBQUlFLFNBQVMsR0FBR1UsU0FBUyxDQUFDLENBQUQsQ0FBekI7RUFDQSxlQUFPLEtBQUtiLE9BQUwsQ0FBYUcsU0FBYixDQUFQO0VBQ0E7O0VBQ0YsV0FBSyxDQUFMO0VBQ0UsWUFBSUEsU0FBUyxHQUFHVSxTQUFTLENBQUMsQ0FBRCxDQUF6QjtFQUNBLFlBQUlSLGFBQWEsR0FBR1EsU0FBUyxDQUFDLENBQUQsQ0FBN0I7RUFDQSxZQUFJSCxpQkFBaUIsR0FBSSxPQUFPTCxhQUFQLEtBQXlCLFFBQTFCLEdBQ3BCQSxhQURvQixHQUVwQixLQUFLRCxvQkFBTCxDQUEwQkMsYUFBMUIsQ0FGSjs7RUFHQSxZQUFHLEtBQUtMLE9BQUwsQ0FBYUcsU0FBYixDQUFILEVBQTRCO0VBQzFCLGlCQUFPLEtBQUtILE9BQUwsQ0FBYUcsU0FBYixFQUF3Qk8saUJBQXhCLENBQVA7RUFDQSxjQUNFSSxNQUFNLENBQUNDLElBQVAsQ0FBWSxLQUFLZixPQUFMLENBQWFHLFNBQWIsQ0FBWixFQUFxQ0ksTUFBckMsS0FBZ0QsQ0FEbEQsRUFFRSxPQUFPLEtBQUtQLE9BQUwsQ0FBYUcsU0FBYixDQUFQO0VBQ0g7O0VBQ0Q7RUFwQko7O0VBc0JBLFdBQU8sSUFBUDtFQUNEOztFQUNEYSxFQUFBQSxJQUFJLENBQUNiLFNBQUQsRUFBWWMsU0FBWixFQUF1QjtFQUN6QixRQUFJQyxVQUFVLEdBQUdKLE1BQU0sQ0FBQ0ssTUFBUCxDQUFjTixTQUFkLENBQWpCOztFQUNBLFFBQUlKLGNBQWMsR0FBR0ssTUFBTSxDQUFDTSxPQUFQLENBQ25CLEtBQUtsQixpQkFBTCxDQUF1QkMsU0FBdkIsQ0FEbUIsQ0FBckI7O0VBR0EsU0FBSSxJQUFJLENBQUNrQixzQkFBRCxFQUF5QlYsa0JBQXpCLENBQVIsSUFBd0RGLGNBQXhELEVBQXdFO0VBQ3RFLFdBQUksSUFBSUosYUFBUixJQUF5Qk0sa0JBQXpCLEVBQTZDO0VBQzNDLFlBQUlXLG1CQUFtQixHQUFHSixVQUFVLENBQUNLLE1BQVgsQ0FBa0IsQ0FBbEIsS0FBd0IsRUFBbEQ7RUFDQWxCLFFBQUFBLGFBQWEsQ0FBQ1ksU0FBRCxFQUFZLEdBQUdLLG1CQUFmLENBQWI7RUFDRDtFQUNGOztFQUNELFdBQU8sSUFBUDtFQUNEOztFQTdEVTs7RUNBYixJQUFNRSxPQUFPLEdBQUcsTUFBTTtFQUNwQnpCLEVBQUFBLFdBQVcsR0FBRzs7RUFDZCxNQUFJMEIsVUFBSixHQUFpQjtFQUNmLFNBQUtDLFNBQUwsR0FBaUIsS0FBS0EsU0FBTCxJQUFrQixLQUFLQSxTQUF4QztFQUNBLFdBQU8sS0FBS0EsU0FBWjtFQUNEOztFQUNEQyxFQUFBQSxRQUFRLENBQUNDLFlBQUQsRUFBZUMsZ0JBQWYsRUFBaUM7RUFDdkMsUUFBR0EsZ0JBQUgsRUFBcUI7RUFDbkIsV0FBS0osVUFBTCxDQUFnQkcsWUFBaEIsSUFBZ0NDLGdCQUFoQztFQUNELEtBRkQsTUFFTztFQUNMLGFBQU8sS0FBS0osVUFBTCxDQUFnQkUsUUFBaEIsQ0FBUDtFQUNEO0VBQ0Y7O0VBQ0RHLEVBQUFBLE9BQU8sQ0FBQ0YsWUFBRCxFQUFlO0VBQ3BCLFFBQUcsS0FBS0gsVUFBTCxDQUFnQkcsWUFBaEIsQ0FBSCxFQUFrQztFQUNoQyxVQUFJVixVQUFVLEdBQUdhLEtBQUssQ0FBQ3RDLFNBQU4sQ0FBZ0J1QyxLQUFoQixDQUFzQkMsSUFBdEIsQ0FBMkJwQixTQUEzQixFQUFzQ21CLEtBQXRDLENBQTRDLENBQTVDLENBQWpCOztFQUNBLGFBQU8sS0FBS1AsVUFBTCxDQUFnQkcsWUFBaEIsRUFBOEIsR0FBR1YsVUFBakMsQ0FBUDtFQUNEO0VBQ0Y7O0VBQ0R0QixFQUFBQSxHQUFHLENBQUNnQyxZQUFELEVBQWU7RUFDaEIsUUFBR0EsWUFBSCxFQUFpQjtFQUNmLGFBQU8sS0FBS0gsVUFBTCxDQUFnQkcsWUFBaEIsQ0FBUDtFQUNELEtBRkQsTUFFTztFQUNMLFdBQUksSUFBSSxDQUFDQSxhQUFELENBQVIsSUFBMEJkLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLEtBQUtVLFVBQWpCLENBQTFCLEVBQXdEO0VBQ3RELGVBQU8sS0FBS0EsVUFBTCxDQUFnQkcsYUFBaEIsQ0FBUDtFQUNEO0VBQ0Y7RUFDRjs7RUEzQm1CLENBQXRCOztFQ0NBLElBQU1NLFFBQVEsR0FBRyxNQUFNO0VBQ3JCbkMsRUFBQUEsV0FBVyxHQUFHOztFQUNkLE1BQUlvQyxTQUFKLEdBQWdCO0VBQ2QsU0FBS0MsUUFBTCxHQUFnQixLQUFLQSxRQUFMLElBQWlCLEVBQWpDO0VBQ0EsV0FBTyxLQUFLQSxRQUFaO0VBQ0Q7O0VBQ0RDLEVBQUFBLE9BQU8sQ0FBQ0MsV0FBRCxFQUFjO0VBQ25CLFNBQUtILFNBQUwsQ0FBZUcsV0FBZixJQUErQixLQUFLSCxTQUFMLENBQWVHLFdBQWYsQ0FBRCxHQUMxQixLQUFLSCxTQUFMLENBQWVHLFdBQWYsQ0FEMEIsR0FFMUIsSUFBSWQsT0FBSixFQUZKO0VBR0EsV0FBTyxLQUFLVyxTQUFMLENBQWVHLFdBQWYsQ0FBUDtFQUNEOztFQUNEMUMsRUFBQUEsR0FBRyxDQUFDMEMsV0FBRCxFQUFjO0VBQ2YsV0FBTyxLQUFLSCxTQUFMLENBQWVHLFdBQWYsQ0FBUDtFQUNEOztFQWRvQixDQUF2Qjs7RUNEQSxJQUFNQyxjQUFjLEdBQUcsU0FBU0EsY0FBVCxDQUF3QkMsTUFBeEIsRUFBZ0M7RUFDbkQsTUFBSUEsTUFBTSxHQUFHQSxNQUFNLENBQUNDLEtBQVAsQ0FBYSxHQUFiLENBQWI7RUFDQSxNQUFJQyxNQUFNLEdBQUcsRUFBYjtFQUNBRixFQUFBQSxNQUFNLENBQUNHLE9BQVAsQ0FBZ0JDLFNBQUQsSUFBZTtFQUM1QkEsSUFBQUEsU0FBUyxHQUFHQSxTQUFTLENBQUNILEtBQVYsQ0FBZ0IsR0FBaEIsQ0FBWjtFQUNBQyxJQUFBQSxNQUFNLENBQUNFLFNBQVMsQ0FBQyxDQUFELENBQVYsQ0FBTixHQUF1QkMsa0JBQWtCLENBQUNELFNBQVMsQ0FBQyxDQUFELENBQVQsSUFBZ0IsRUFBakIsQ0FBekM7RUFDRCxHQUhEO0VBSUEsU0FBT0UsSUFBSSxDQUFDQyxLQUFMLENBQVdELElBQUksQ0FBQ0UsU0FBTCxDQUFlTixNQUFmLENBQVgsQ0FBUDtFQUNILENBUkQ7O0VDQUEsSUFBTU8sTUFBTSxHQUFHLFNBQVNBLE1BQVQsQ0FBZ0JDLElBQWhCLEVBQXNCO0VBQ25DLFVBQU8sT0FBT0EsSUFBZDtFQUNFLFNBQUssUUFBTDtFQUNFLFVBQUlDLE9BQUo7O0VBQ0EsVUFDRXBCLEtBQUssQ0FBQ3FCLE9BQU4sQ0FBY0YsSUFBZCxDQURGLEVBRUU7RUFDQSxlQUFPLE9BQVA7RUFDRCxPQUpELE1BSU8sSUFDTEEsSUFBSSxLQUFLLElBREosRUFFTDtFQUNBLGVBQU8sUUFBUDtFQUNELE9BSk0sTUFJQSxJQUNMQSxJQUFJLEtBQUssSUFESixFQUVMO0VBQ0EsZUFBTyxNQUFQO0VBQ0Q7O0VBQ0QsYUFBT0MsT0FBUDs7RUFDRixTQUFLLFFBQUw7RUFDQSxTQUFLLFFBQUw7RUFDQSxTQUFLLFNBQUw7RUFDQSxTQUFLLFdBQUw7RUFDQSxTQUFLLFVBQUw7RUFDRSxhQUFPLE9BQU9ELElBQWQ7QUFDQSxFQXZCSjtFQXlCRCxDQTFCRDs7RUNBQSxJQUFNRyxHQUFHLEdBQUcsU0FBTkEsR0FBTSxHQUFZO0VBQ3RCLE1BQUlDLElBQUksR0FBRyxFQUFYO0VBQUEsTUFBZUMsRUFBZjs7RUFDQSxPQUFLQSxFQUFFLEdBQUcsQ0FBVixFQUFhQSxFQUFFLEdBQUcsRUFBbEIsRUFBc0JBLEVBQUUsSUFBSSxDQUE1QixFQUErQjtFQUM3QixZQUFRQSxFQUFSO0VBQ0UsV0FBSyxDQUFMO0VBQ0EsV0FBSyxFQUFMO0VBQ0VELFFBQUFBLElBQUksSUFBSSxHQUFSO0VBQ0FBLFFBQUFBLElBQUksSUFBSSxDQUFDRSxJQUFJLENBQUNDLE1BQUwsS0FBZ0IsRUFBaEIsR0FBcUIsQ0FBdEIsRUFBeUJDLFFBQXpCLENBQWtDLEVBQWxDLENBQVI7RUFDQTs7RUFDRixXQUFLLEVBQUw7RUFDRUosUUFBQUEsSUFBSSxJQUFJLEdBQVI7RUFDQUEsUUFBQUEsSUFBSSxJQUFJLEdBQVI7RUFDQTs7RUFDRixXQUFLLEVBQUw7RUFDRUEsUUFBQUEsSUFBSSxJQUFJLEdBQVI7RUFDQUEsUUFBQUEsSUFBSSxJQUFJLENBQUNFLElBQUksQ0FBQ0MsTUFBTCxLQUFnQixDQUFoQixHQUFvQixDQUFyQixFQUF3QkMsUUFBeEIsQ0FBaUMsRUFBakMsQ0FBUjtFQUNBOztFQUNGO0VBQ0VKLFFBQUFBLElBQUksSUFBSSxDQUFDRSxJQUFJLENBQUNDLE1BQUwsS0FBZ0IsRUFBaEIsR0FBcUIsQ0FBdEIsRUFBeUJDLFFBQXpCLENBQWtDLEVBQWxDLENBQVI7RUFmSjtFQWlCRDs7RUFDRCxTQUFPSixJQUFQO0VBQ0QsQ0F0QkQ7Ozs7Ozs7Ozs7O0VDR0EsTUFBTUssSUFBTixTQUFtQjdELE1BQW5CLENBQTBCO0VBQ3hCQyxFQUFBQSxXQUFXLENBQUM2RCxRQUFELEVBQVdDLGFBQVgsRUFBMEI7RUFDbkMsVUFBTSxHQUFHaEQsU0FBVDtFQUNBLFNBQUtpRCx5QkFBTDtFQUNBLFNBQUtDLDBCQUFMO0VBQ0EsU0FBS0MsU0FBTCxHQUFpQkosUUFBakI7RUFDQSxTQUFLSyxjQUFMLEdBQXNCSixhQUF0QjtFQUNEOztFQUNELE1BQUlLLEdBQUosR0FBVTtFQUNSLFNBQUtDLElBQUwsR0FBYSxLQUFLQSxJQUFOLEdBQ1YsS0FBS0EsSUFESyxHQUVWZCxHQUFHLEVBRkw7RUFHQSxXQUFPLEtBQUtjLElBQVo7RUFDRDs7RUFDRCxNQUFJQyxLQUFKLEdBQVk7RUFBRSxXQUFPLEtBQUs5RCxJQUFaO0VBQWtCOztFQUNoQyxNQUFJOEQsS0FBSixDQUFVOUQsSUFBVixFQUFnQjtFQUFFLFNBQUtBLElBQUwsR0FBWUEsSUFBWjtFQUFrQjs7RUFDcEMsTUFBSTBELFNBQUosR0FBZ0I7RUFDZCxTQUFLSixRQUFMLEdBQWdCLEtBQUtBLFFBQUwsSUFBaUIsRUFBakM7RUFDQSxXQUFPLEtBQUtBLFFBQVo7RUFDRDs7RUFDRCxNQUFJSSxTQUFKLENBQWNKLFFBQWQsRUFBd0I7RUFDckIsU0FBS0EsUUFBTCxHQUFnQkEsUUFBUSxJQUFJLEVBQTVCO0VBQ0EsU0FBS1Msc0JBQUwsQ0FDRzFCLE9BREgsQ0FDWTJCLFlBQUQsSUFBa0I7RUFDekIsVUFBRyxLQUFLVixRQUFMLENBQWNVLFlBQWQsQ0FBSCxFQUFnQztFQUM5QixhQUFLLElBQUlDLE1BQUosQ0FBV0QsWUFBWCxDQUFMLElBQWlDLEtBQUtWLFFBQUwsQ0FBY1UsWUFBZCxDQUFqQztFQUNEO0VBQ0YsS0FMSDtFQU1BLFdBQU8sSUFBUDtFQUNGOztFQUNELE1BQUlMLGNBQUosR0FBcUI7RUFDbkIsU0FBS0osYUFBTCxHQUFxQixLQUFLQSxhQUFMLElBQXNCLEVBQTNDO0VBQ0EsV0FBTyxLQUFLQSxhQUFaO0VBQ0Q7O0VBQ0QsTUFBSUksY0FBSixDQUFtQkosYUFBbkIsRUFBa0M7RUFBRSxTQUFLQSxhQUFMLEdBQXFCQSxhQUFyQjtFQUFvQzs7RUFDeEUsTUFBSVcsK0JBQUosR0FBc0M7RUFBRSxXQUFPLENBQzdDLEVBRDZDLEVBRTdDLFFBRjZDLEVBRzdDLFdBSDZDLENBQVA7RUFJckM7O0VBQ0gsTUFBSUMsa0JBQUosR0FBeUI7RUFDdkIsU0FBS0MsaUJBQUwsR0FBeUIsS0FBS0EsaUJBQUwsSUFBMEIsRUFBbkQ7RUFDQSxXQUFPLEtBQUtBLGlCQUFaO0VBQ0Q7O0VBQ0QsTUFBSUQsa0JBQUosQ0FBdUJDLGlCQUF2QixFQUEwQztFQUN4QyxTQUFLQSxpQkFBTCxHQUF5QkEsaUJBQXpCO0VBQ0Q7O0VBQ0RDLEVBQUFBLHNCQUFzQixDQUFDQyxZQUFELEVBQWU7RUFDbkMsUUFBR0EsWUFBWSxDQUFDNUMsS0FBYixDQUFtQixDQUFuQixFQUFzQixDQUF0QixNQUE2QixJQUFoQyxFQUFzQztFQUNwQyxhQUFPNEMsWUFBWSxDQUFDQyxPQUFiLENBQXFCLEtBQXJCLEVBQTRCLElBQTVCLENBQVA7RUFDRCxLQUZELE1BRU87RUFDTCxVQUFJQyxjQUFjLEdBQUdGLFlBQVksQ0FBQ0csU0FBYixDQUF1QixDQUF2QixFQUEwQkMsV0FBMUIsRUFBckI7RUFDQSxhQUFPSixZQUFZLENBQUNDLE9BQWIsQ0FBcUIsSUFBckIsRUFBMkJDLGNBQTNCLENBQVA7RUFDRDtFQUNGOztFQUNEaEIsRUFBQUEseUJBQXlCLEdBQUc7RUFDMUIsU0FBS08sc0JBQUwsQ0FDRzFCLE9BREgsQ0FDWXNDLG9CQUFELElBQTBCO0VBQ2pDLFVBQUcsS0FBS0Esb0JBQUwsQ0FBSCxFQUErQjtFQUM3QixZQUFJQyxRQUFRLEdBQUcsS0FBS0Qsb0JBQUwsQ0FBZjtFQUNBbkUsUUFBQUEsTUFBTSxDQUFDcUUsY0FBUCxDQUFzQixJQUF0QixFQUE0QkYsb0JBQTVCLEVBQWtEO0VBQ2hERyxVQUFBQSxRQUFRLEVBQUUsSUFEc0M7RUFFaERDLFVBQUFBLEtBQUssRUFBRUg7RUFGeUMsU0FBbEQ7RUFJQSxhQUFLLElBQUlYLE1BQUosQ0FBV1Usb0JBQVgsQ0FBTCxJQUF5Q0MsUUFBekM7RUFDRDtFQUNGLEtBVkg7RUFXQSxXQUFPLElBQVA7RUFDRDs7RUFDRG5CLEVBQUFBLDBCQUEwQixHQUFHO0VBQzNCLFFBQUcsS0FBS3VCLHVCQUFSLEVBQWlDO0VBQy9CLFdBQUtBLHVCQUFMLENBQ0czQyxPQURILENBQ1k0Qyx5QkFBRCxJQUErQjtFQUN0QyxhQUFLZiwrQkFBTCxDQUNHN0IsT0FESCxDQUNZNkMscUJBQUQsSUFBMkI7RUFDbEMsZUFBS0Msd0JBQUwsQ0FDRUYseUJBREYsRUFFRUMscUJBRkY7RUFJRCxTQU5IO0VBT0QsT0FUSDtFQVVEOztFQUNELFdBQU8sSUFBUDtFQUNEOztFQUNEQyxFQUFBQSx3QkFBd0IsQ0FBQ0YseUJBQUQsRUFBNEJDLHFCQUE1QixFQUFtRDtFQUN6RSxRQUFJRSxPQUFPLEdBQUcsSUFBZDtFQUNBLFFBQUlkLFlBQVksR0FBR1cseUJBQXlCLENBQUNoQixNQUExQixDQUFpQyxHQUFqQyxFQUFzQ2lCLHFCQUF0QyxDQUFuQjtFQUNBLFFBQUliLHNCQUFzQixHQUFHLEtBQUtBLHNCQUFMLENBQTRCQyxZQUE1QixDQUE3QjtFQUNBLFFBQUllLDRCQUE0QixHQUFHLE1BQU1wQixNQUFOLENBQWFJLHNCQUFiLENBQW5DO0VBQ0EsUUFBSWlCLCtCQUErQixHQUFHLFNBQVNyQixNQUFULENBQWdCSSxzQkFBaEIsQ0FBdEM7O0VBQ0EsUUFBR0MsWUFBWSxLQUFLLFlBQXBCLEVBQWtDO0VBQ2hDYyxNQUFBQSxPQUFPLENBQUNqQixrQkFBUixHQUE2QixLQUFLRyxZQUFMLENBQTdCO0VBQ0Q7O0VBQ0QsUUFBSWlCLHFCQUFxQixHQUFHLEtBQUtqQixZQUFMLENBQTVCO0VBQ0E5RCxJQUFBQSxNQUFNLENBQUNnRixnQkFBUCxDQUNFLElBREYsRUFFRTtFQUNFLE9BQUNsQixZQUFELEdBQWdCO0VBQ2RRLFFBQUFBLFFBQVEsRUFBRSxJQURJO0VBRWRDLFFBQUFBLEtBQUssRUFBRVE7RUFGTyxPQURsQjtFQUtFLE9BQUMsSUFBSXRCLE1BQUosQ0FBV0ssWUFBWCxDQUFELEdBQTRCO0VBQzFCbUIsUUFBQUEsR0FBRyxHQUFHO0VBQ0pMLFVBQUFBLE9BQU8sQ0FBQ2QsWUFBRCxDQUFQLEdBQXdCYyxPQUFPLENBQUNkLFlBQUQsQ0FBUCxJQUF5QixFQUFqRDtFQUNBLGlCQUFPYyxPQUFPLENBQUNkLFlBQUQsQ0FBZDtFQUNELFNBSnlCOztFQUsxQm9CLFFBQUFBLEdBQUcsQ0FBQzdFLE1BQUQsRUFBUztFQUNWTCxVQUFBQSxNQUFNLENBQUNNLE9BQVAsQ0FBZUQsTUFBZixFQUNHd0IsT0FESCxDQUNXLFVBQWtCO0VBQUEsZ0JBQWpCLENBQUNzRCxHQUFELEVBQU1aLEtBQU4sQ0FBaUI7O0VBQ3pCLG9CQUFPVCxZQUFQO0VBQ0UsbUJBQUssWUFBTDtFQUNFYyxnQkFBQUEsT0FBTyxDQUFDakIsa0JBQVIsQ0FBMkJ3QixHQUEzQixJQUFrQ1osS0FBbEM7RUFDQUssZ0JBQUFBLE9BQU8sQ0FBQyxJQUFJbkIsTUFBSixDQUFXSyxZQUFYLENBQUQsQ0FBUCxDQUFrQ3FCLEdBQWxDLElBQXlDUCxPQUFPLENBQUNRLE9BQVIsQ0FBZ0JDLGdCQUFoQixDQUFpQ2QsS0FBakMsQ0FBekM7RUFDQTs7RUFDRjtFQUNFSyxnQkFBQUEsT0FBTyxDQUFDLElBQUluQixNQUFKLENBQVdLLFlBQVgsQ0FBRCxDQUFQLENBQWtDcUIsR0FBbEMsSUFBeUNaLEtBQXpDO0VBQ0E7RUFQSjtFQVNELFdBWEg7RUFZRDs7RUFsQnlCLE9BTDlCO0VBeUJFLE9BQUNNLDRCQUFELEdBQWdDO0VBQzlCTixRQUFBQSxLQUFLLEVBQUUsaUJBQVc7RUFDaEIsY0FBR3hFLFNBQVMsQ0FBQ04sTUFBVixLQUFxQixDQUF4QixFQUEyQjtFQUN6QixnQkFBSTBGLEdBQUcsR0FBR3BGLFNBQVMsQ0FBQyxDQUFELENBQW5CO0VBQ0EsZ0JBQUl3RSxLQUFLLEdBQUd4RSxTQUFTLENBQUMsQ0FBRCxDQUFyQjtFQUNBNkUsWUFBQUEsT0FBTyxDQUFDLElBQUluQixNQUFKLENBQVdLLFlBQVgsQ0FBRCxDQUFQLEdBQW9DO0VBQ2xDLGVBQUNxQixHQUFELEdBQU9aO0VBRDJCLGFBQXBDO0VBR0QsV0FORCxNQU1PLElBQUd4RSxTQUFTLENBQUNOLE1BQVYsS0FBcUIsQ0FBeEIsRUFBMkI7RUFDaEMsZ0JBQUlZLE1BQU0sR0FBR04sU0FBUyxDQUFDLENBQUQsQ0FBdEI7RUFDQTZFLFlBQUFBLE9BQU8sQ0FBQyxJQUFJbkIsTUFBSixDQUFXSyxZQUFYLENBQUQsQ0FBUCxHQUFvQ3pELE1BQXBDO0VBQ0Q7O0VBQ0QsaUJBQU91RSxPQUFQO0VBQ0Q7RUFiNkIsT0F6QmxDO0VBd0NFLE9BQUNFLCtCQUFELEdBQW1DO0VBQ2pDUCxRQUFBQSxLQUFLLEVBQUUsaUJBQVc7RUFDaEIsY0FBR3hFLFNBQVMsQ0FBQ04sTUFBVixLQUFxQixDQUF4QixFQUEyQjtFQUN6QixnQkFBSTBGLEdBQUcsR0FBR3BGLFNBQVMsQ0FBQyxDQUFELENBQW5COztFQUNBLG9CQUFPK0QsWUFBUDtFQUNFLG1CQUFLLFlBQUw7RUFDRSx1QkFBT2MsT0FBTyxDQUFDLElBQUluQixNQUFKLENBQVdLLFlBQVgsQ0FBRCxDQUFQLENBQWtDcUIsR0FBbEMsQ0FBUDtFQUNBLHVCQUFPUCxPQUFPLENBQUMsSUFBSW5CLE1BQUosQ0FBVyxtQkFBWCxDQUFELENBQVAsQ0FBeUMwQixHQUF6QyxDQUFQO0VBQ0E7O0VBQ0Y7RUFDRSx1QkFBT1AsT0FBTyxDQUFDLElBQUluQixNQUFKLENBQVdLLFlBQVgsQ0FBRCxDQUFQLENBQWtDcUIsR0FBbEMsQ0FBUDtFQUNBO0VBUEo7RUFTRCxXQVhELE1BV08sSUFBR3BGLFNBQVMsQ0FBQ04sTUFBVixLQUFxQixDQUF4QixFQUEwQjtFQUMvQk8sWUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVkyRSxPQUFPLENBQUMsSUFBSW5CLE1BQUosQ0FBV0ssWUFBWCxDQUFELENBQW5CLEVBQ0dqQyxPQURILENBQ1lzRCxHQUFELElBQVM7RUFDaEIsc0JBQU9yQixZQUFQO0VBQ0UscUJBQUssWUFBTDtFQUNFLHlCQUFPYyxPQUFPLENBQUMsSUFBSW5CLE1BQUosQ0FBV0ssWUFBWCxDQUFELENBQVAsQ0FBa0NxQixHQUFsQyxDQUFQO0VBQ0EseUJBQU9QLE9BQU8sQ0FBQyxJQUFJbkIsTUFBSixDQUFXLG1CQUFYLENBQUQsQ0FBUCxDQUF5QzBCLEdBQXpDLENBQVA7RUFDQTs7RUFDRjtFQUNFLHlCQUFPUCxPQUFPLENBQUMsSUFBSW5CLE1BQUosQ0FBV0ssWUFBWCxDQUFELENBQVAsQ0FBa0NxQixHQUFsQyxDQUFQO0VBQ0E7RUFQSjtFQVNELGFBWEg7RUFZRDs7RUFDRCxpQkFBT1AsT0FBUDtFQUNEO0VBNUJnQztFQXhDckMsS0FGRjs7RUEwRUEsUUFBR0cscUJBQUgsRUFBMEI7RUFDeEIsV0FBS0YsNEJBQUwsRUFBbUNFLHFCQUFuQztFQUNEOztFQUNELFdBQU8sSUFBUDtFQUNEOztFQUNETyxFQUFBQSw4QkFBOEIsQ0FBQ2IseUJBQUQsRUFBNEI7RUFDeEQsV0FBTyxLQUNKYywrQkFESSxDQUM0QmQseUJBRDVCLEVBQ3VELEtBRHZELEVBRUpjLCtCQUZJLENBRTRCZCx5QkFGNUIsRUFFdUQsSUFGdkQsQ0FBUDtFQUdEOztFQUNEYyxFQUFBQSwrQkFBK0IsQ0FBQ0MsU0FBRCxFQUFZQyxNQUFaLEVBQW9CO0VBQ2pELFFBQ0UsS0FBS0QsU0FBUyxDQUFDL0IsTUFBVixDQUFpQixHQUFqQixDQUFMLEtBQ0EsS0FBSytCLFNBQVMsQ0FBQy9CLE1BQVYsQ0FBaUIsUUFBakIsQ0FBTCxDQURBLElBRUEsS0FBSytCLFNBQVMsQ0FBQy9CLE1BQVYsQ0FBaUIsV0FBakIsQ0FBTCxDQUhGLEVBSUU7RUFDQXpELE1BQUFBLE1BQU0sQ0FBQ00sT0FBUCxDQUFlLEtBQUtrRixTQUFTLENBQUMvQixNQUFWLENBQWlCLFFBQWpCLENBQUwsQ0FBZixFQUNHNUIsT0FESCxDQUNXLFdBQWlEO0VBQUEsWUFBaEQsQ0FBQzZELGtCQUFELEVBQXFCQyxxQkFBckIsQ0FBZ0Q7O0VBQ3hELFlBQUk7RUFDRkQsVUFBQUEsa0JBQWtCLEdBQUdBLGtCQUFrQixDQUFDL0QsS0FBbkIsQ0FBeUIsR0FBekIsQ0FBckI7RUFDQSxjQUFJaUUsbUJBQW1CLEdBQUdGLGtCQUFrQixDQUFDLENBQUQsQ0FBNUM7RUFDQSxjQUFJRyxrQkFBa0IsR0FBR0gsa0JBQWtCLENBQUMsQ0FBRCxDQUEzQztFQUNBLGNBQUlJLGVBQWUsR0FBRyxLQUFLTixTQUFTLENBQUMvQixNQUFWLENBQWlCLEdBQWpCLENBQUwsRUFBNEJtQyxtQkFBNUIsQ0FBdEI7RUFDQSxjQUFJRyxzQkFBSjs7RUFDQSxrQkFBT04sTUFBUDtFQUNFLGlCQUFLLElBQUw7RUFDRSxzQkFBT0QsU0FBUDtFQUNFLHFCQUFLLFdBQUw7RUFDRU8sa0JBQUFBLHNCQUFzQixHQUFHLEtBQUtQLFNBQVMsQ0FBQy9CLE1BQVYsQ0FBaUIsV0FBakIsQ0FBTCxFQUFvQ2tDLHFCQUFwQyxFQUEyREssSUFBM0QsQ0FBZ0UsSUFBaEUsQ0FBekI7O0VBQ0Esc0JBQUdGLGVBQWUsWUFBWUcsUUFBOUIsRUFBd0M7RUFDdENoRixvQkFBQUEsS0FBSyxDQUFDaUYsSUFBTixDQUFXSixlQUFYLEVBQ0dqRSxPQURILENBQ1lzRSxnQkFBRCxJQUFzQjtFQUM3QkEsc0JBQUFBLGdCQUFnQixDQUFDVixNQUFELENBQWhCLENBQXlCSSxrQkFBekIsRUFBNkNFLHNCQUE3QztFQUNELHFCQUhIO0VBSUQsbUJBTEQsTUFLTyxJQUFHRCxlQUFlLFlBQVlNLFdBQTlCLEVBQTJDO0VBQ2hETixvQkFBQUEsZUFBZSxDQUFDTCxNQUFELENBQWYsQ0FBd0JJLGtCQUF4QixFQUE0Q0Usc0JBQTVDO0VBQ0Q7O0VBQ0Q7O0VBQ0Y7RUFDRUEsa0JBQUFBLHNCQUFzQixHQUFHLEtBQUtQLFNBQVMsQ0FBQy9CLE1BQVYsQ0FBaUIsV0FBakIsQ0FBTCxFQUFvQ2tDLHFCQUFwQyxDQUF6QjtFQUNBRyxrQkFBQUEsZUFBZSxDQUFDTCxNQUFELENBQWYsQ0FBd0JJLGtCQUF4QixFQUE0Q0Usc0JBQTVDLEVBQW9FLElBQXBFO0VBQ0E7RUFmSjs7RUFpQkE7O0VBQ0YsaUJBQUssS0FBTDtFQUNFQSxjQUFBQSxzQkFBc0IsR0FBRyxLQUFLUCxTQUFTLENBQUMvQixNQUFWLENBQWlCLFdBQWpCLENBQUwsRUFBb0NrQyxxQkFBcEMsQ0FBekI7O0VBQ0Esc0JBQU9ILFNBQVA7RUFDRSxxQkFBSyxXQUFMO0VBQ0Usc0JBQUlhLCtCQUErQixHQUFHTixzQkFBc0IsQ0FBQ3ZHLElBQXZCLENBQTRCbUMsS0FBNUIsQ0FBa0MsR0FBbEMsRUFBdUMsQ0FBdkMsQ0FBdEM7O0VBQ0Esc0JBQUdtRSxlQUFlLFlBQVlHLFFBQTlCLEVBQXdDO0VBQ3RDaEYsb0JBQUFBLEtBQUssQ0FBQ2lGLElBQU4sQ0FBV0osZUFBWCxFQUNHakUsT0FESCxDQUNZc0UsZ0JBQUQsSUFBc0I7RUFDN0JBLHNCQUFBQSxnQkFBZ0IsQ0FBQ1YsTUFBRCxDQUFoQixDQUF5Qkksa0JBQXpCLEVBQTZDUSwrQkFBN0M7RUFDRCxxQkFISDtFQUlELG1CQUxELE1BS08sSUFBR1AsZUFBZSxZQUFZTSxXQUE5QixFQUEyQztFQUNoRE4sb0JBQUFBLGVBQWUsQ0FBQ0wsTUFBRCxDQUFmLENBQXdCSSxrQkFBeEIsRUFBNENRLCtCQUE1QztFQUNEOztFQUNEOztFQUNGO0VBQ0VQLGtCQUFBQSxlQUFlLENBQUNMLE1BQUQsQ0FBZixDQUF3Qkksa0JBQXhCLEVBQTRDRSxzQkFBNUMsRUFBb0UsSUFBcEU7RUFDQTtFQWRKOztFQWdCQTtFQXRDSjtFQXdDRCxTQTlDRCxDQThDRSxPQUFNTyxLQUFOLEVBQWE7RUFBRSxnQkFBTSxJQUFJQyxjQUFKLENBQ3JCRCxLQURxQixDQUFOO0VBRWQ7RUFDSixPQW5ESDtFQW9ERDs7RUFDRCxXQUFPLElBQVA7RUFDRDs7RUE5T3VCOztFQ0gxQjtBQUNBLEVBRUEsSUFBTUUsT0FBTyxHQUFHLGNBQWMzRCxJQUFkLENBQW1CO0VBQ2pDNUQsRUFBQUEsV0FBVyxHQUFHO0VBQ1osVUFBTSxHQUFHYyxTQUFUO0VBQ0EsU0FBSzBHLGFBQUw7RUFDQSxXQUFPLElBQVA7RUFDRDs7RUFDRCxNQUFJQyxTQUFKLEdBQWdCO0VBQUUsV0FBTyxLQUFLQyxRQUFMLElBQWlCO0VBQ3hDQyxNQUFBQSxXQUFXLEVBQUU7RUFBQyx3QkFBZ0I7RUFBakIsT0FEMkI7RUFFeENDLE1BQUFBLFlBQVksRUFBRTtFQUYwQixLQUF4QjtFQUdmOztFQUNILE1BQUlDLGNBQUosR0FBcUI7RUFBRSxXQUFPLENBQUMsRUFBRCxFQUFLLGFBQUwsRUFBb0IsTUFBcEIsRUFBNEIsVUFBNUIsRUFBd0MsTUFBeEMsRUFBZ0QsTUFBaEQsQ0FBUDtFQUFnRTs7RUFDdkYsTUFBSUMsYUFBSixHQUFvQjtFQUFFLFdBQU8sS0FBS0YsWUFBWjtFQUEwQjs7RUFDaEQsTUFBSUUsYUFBSixDQUFrQkYsWUFBbEIsRUFBZ0M7RUFDOUIsU0FBS0csSUFBTCxDQUFVSCxZQUFWLEdBQXlCLEtBQUtDLGNBQUwsQ0FBb0JHLElBQXBCLENBQ3RCQyxnQkFBRCxJQUFzQkEsZ0JBQWdCLEtBQUtMLFlBRHBCLEtBRXBCLEtBQUtILFNBQUwsQ0FBZUcsWUFGcEI7RUFHRDs7RUFDRCxNQUFJTSxLQUFKLEdBQVk7RUFBRSxXQUFPLEtBQUtDLElBQVo7RUFBa0I7O0VBQ2hDLE1BQUlELEtBQUosQ0FBVUMsSUFBVixFQUFnQjtFQUFFLFNBQUtBLElBQUwsR0FBWUEsSUFBWjtFQUFrQjs7RUFDcEMsTUFBSUMsSUFBSixHQUFXO0VBQUUsV0FBTyxLQUFLQyxHQUFaO0VBQWlCOztFQUM5QixNQUFJRCxJQUFKLENBQVNDLEdBQVQsRUFBYztFQUFFLFNBQUtBLEdBQUwsR0FBV0EsR0FBWDtFQUFnQjs7RUFDaEMsTUFBSUMsUUFBSixHQUFlO0VBQUUsV0FBTyxLQUFLQyxPQUFMLElBQWdCLEVBQXZCO0VBQTJCOztFQUM1QyxNQUFJRCxRQUFKLENBQWFDLE9BQWIsRUFBc0I7RUFDcEIsU0FBS0QsUUFBTCxDQUFjOUgsTUFBZCxHQUF1QixDQUF2QjtFQUNBK0gsSUFBQUEsT0FBTyxDQUFDM0YsT0FBUixDQUFpQjRGLE1BQUQsSUFBWTtFQUMxQixXQUFLRixRQUFMLENBQWN6SCxJQUFkLENBQW1CMkgsTUFBbkI7O0VBQ0FBLE1BQUFBLE1BQU0sR0FBR3pILE1BQU0sQ0FBQ00sT0FBUCxDQUFlbUgsTUFBZixFQUF1QixDQUF2QixDQUFUOztFQUNBLFdBQUtULElBQUwsQ0FBVVUsZ0JBQVYsQ0FBMkJELE1BQU0sQ0FBQyxDQUFELENBQWpDLEVBQXNDQSxNQUFNLENBQUMsQ0FBRCxDQUE1QztFQUNELEtBSkQ7RUFLRDs7RUFDRCxNQUFJRSxLQUFKLEdBQVk7RUFBRSxXQUFPLEtBQUt2RixJQUFaO0VBQWtCOztFQUNoQyxNQUFJdUYsS0FBSixDQUFVdkYsSUFBVixFQUFnQjtFQUFFLFNBQUtBLElBQUwsR0FBWUEsSUFBWjtFQUFrQjs7RUFDcEMsTUFBSTRFLElBQUosR0FBVztFQUNULFNBQUtZLEdBQUwsR0FBWSxLQUFLQSxHQUFOLEdBQ1AsS0FBS0EsR0FERSxHQUVQLElBQUlDLGNBQUosRUFGSjtFQUdBLFdBQU8sS0FBS0QsR0FBWjtFQUNEOztFQUNENUcsRUFBQUEsT0FBTyxHQUFHO0VBQ1JvQixJQUFBQSxJQUFJLEdBQUdBLElBQUksSUFBSSxLQUFLQSxJQUFiLElBQXFCLElBQTVCO0VBQ0EsV0FBTyxJQUFJMEYsT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtFQUN0QyxVQUFHLEtBQUtoQixJQUFMLENBQVVpQixNQUFWLEtBQXFCLEdBQXhCLEVBQTZCLEtBQUtqQixJQUFMLENBQVVrQixLQUFWOztFQUM3QixXQUFLbEIsSUFBTCxDQUFVbUIsSUFBVixDQUFlLEtBQUtmLElBQXBCLEVBQTBCLEtBQUtFLEdBQS9COztFQUNBLFdBQUtDLFFBQUwsR0FBZ0IsS0FBS3pFLFFBQUwsQ0FBYzBFLE9BQWQsSUFBeUIsQ0FBQyxLQUFLZCxTQUFMLENBQWVFLFdBQWhCLENBQXpDO0VBQ0EsV0FBS0ksSUFBTCxDQUFVb0IsTUFBVixHQUFtQkwsT0FBbkI7RUFDQSxXQUFLZixJQUFMLENBQVVxQixPQUFWLEdBQW9CTCxNQUFwQjs7RUFDQSxXQUFLaEIsSUFBTCxDQUFVc0IsSUFBVixDQUFlbEcsSUFBZjtFQUNELEtBUE0sRUFPSm1HLElBUEksQ0FPRTFILFFBQUQsSUFBYztFQUNwQixXQUFLWCxJQUFMLENBQ0UsYUFERixFQUNpQjtFQUNiVixRQUFBQSxJQUFJLEVBQUUsYUFETztFQUViNEMsUUFBQUEsSUFBSSxFQUFFdkIsUUFBUSxDQUFDMkg7RUFGRixPQURqQixFQUtFLElBTEY7RUFPQSxhQUFPM0gsUUFBUDtFQUNELEtBaEJNLEVBZ0JKNEgsS0FoQkksQ0FnQkduQyxLQUFELElBQVc7RUFBRSxZQUFNQSxLQUFOO0VBQWEsS0FoQjVCLENBQVA7RUFpQkQ7O0VBQ0RvQyxFQUFBQSxNQUFNLEdBQUc7RUFDUCxRQUFJNUYsUUFBUSxHQUFHLEtBQUtBLFFBQXBCOztFQUNBLFFBQ0U5QyxNQUFNLENBQUNDLElBQVAsQ0FBWTZDLFFBQVosRUFBc0JyRCxNQUR4QixFQUVFO0VBQ0EsVUFBR3FELFFBQVEsQ0FBQ3NFLElBQVosRUFBa0IsS0FBS0QsS0FBTCxHQUFhckUsUUFBUSxDQUFDc0UsSUFBdEI7RUFDbEIsVUFBR3RFLFFBQVEsQ0FBQ3dFLEdBQVosRUFBaUIsS0FBS0QsSUFBTCxHQUFZdkUsUUFBUSxDQUFDd0UsR0FBckI7RUFDakIsVUFBR3hFLFFBQVEsQ0FBQ1YsSUFBWixFQUFrQixLQUFLdUYsS0FBTCxHQUFhN0UsUUFBUSxDQUFDVixJQUFULElBQWlCLElBQTlCO0VBQ2xCLFVBQUcsS0FBS1UsUUFBTCxDQUFjK0QsWUFBakIsRUFBK0IsS0FBS0UsYUFBTCxHQUFxQixLQUFLN0QsU0FBTCxDQUFlMkQsWUFBcEM7RUFDaEM7O0VBQ0QsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0Q4QixFQUFBQSxPQUFPLEdBQUc7RUFDUixRQUFJN0YsUUFBUSxHQUFHLEtBQUtBLFFBQXBCOztFQUNBLFFBQ0U5QyxNQUFNLENBQUNDLElBQVAsQ0FBWTZDLFFBQVosRUFBc0JyRCxNQUR4QixFQUVFO0VBQ0EsYUFBTyxLQUFLMEgsS0FBWjtFQUNBLGFBQU8sS0FBS0UsSUFBWjtFQUNBLGFBQU8sS0FBS00sS0FBWjtFQUNBLGFBQU8sS0FBS0osUUFBWjtFQUNBLGFBQU8sS0FBS1IsYUFBWjtFQUNEOztFQUNELFdBQU8sSUFBUDtFQUNEOztFQWxGZ0MsQ0FBbkM7O0VDREEsSUFBTTZCLEtBQUssR0FBRyxjQUFjL0YsSUFBZCxDQUFtQjtFQUMvQjVELEVBQUFBLFdBQVcsR0FBRztFQUNaLFVBQU0sR0FBR2MsU0FBVDtFQUNBLFNBQUswRyxhQUFMO0VBQ0EsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0QsTUFBSWpDLHVCQUFKLEdBQThCO0VBQUUsV0FBTyxDQUNyQyxNQURxQyxFQUVyQyxVQUZxQyxDQUFQO0VBRzdCOztFQUNILE1BQUlqQixzQkFBSixHQUE2QjtFQUFFLFdBQU8sQ0FDcEMsTUFEb0MsRUFFcEMsUUFGb0MsRUFHcEMsY0FIb0MsRUFJcEMsWUFKb0MsRUFLcEMsVUFMb0MsRUFNcEMsa0JBTm9DLEVBT3BDLGVBUG9DLEVBUXBDLE1BUm9DLEVBU3BDLGVBVG9DLEVBVXBDLFlBVm9DLEVBV3BDLFVBWG9DLENBQVA7RUFZNUI7O0VBQ0gsTUFBSXNGLE9BQUosR0FBYztFQUFFLFdBQU8sS0FBS0EsT0FBWjtFQUFxQjs7RUFDckMsTUFBSUEsT0FBSixDQUFZQyxNQUFaLEVBQW9CO0VBQUUsU0FBS0EsTUFBTCxHQUFjQSxNQUFkO0VBQXNCOztFQUM1QyxNQUFJQyxVQUFKLEdBQWlCO0VBQUUsV0FBTyxLQUFLQyxTQUFaO0VBQXVCOztFQUMxQyxNQUFJRCxVQUFKLENBQWVDLFNBQWYsRUFBMEI7RUFBRSxTQUFLQSxTQUFMLEdBQWlCQSxTQUFqQjtFQUE0Qjs7RUFDeEQsTUFBSUMsU0FBSixHQUFnQjtFQUNkLFNBQUtDLFFBQUwsR0FBZ0IsS0FBS0EsUUFBTCxJQUFpQixFQUFqQztFQUNBLFdBQU8sS0FBS0EsUUFBWjtFQUNEOztFQUNELE1BQUlDLGFBQUosR0FBb0I7RUFBRSxXQUFPLEtBQUtDLFlBQVo7RUFBMEI7O0VBQ2hELE1BQUlELGFBQUosQ0FBa0JDLFlBQWxCLEVBQWdDO0VBQUUsU0FBS0EsWUFBTCxHQUFvQkEsWUFBcEI7RUFBa0M7O0VBQ3BFLE1BQUkxQyxTQUFKLEdBQWdCO0VBQUUsV0FBTyxLQUFLQyxRQUFaO0VBQXNCOztFQUN4QyxNQUFJRCxTQUFKLENBQWNDLFFBQWQsRUFBd0I7RUFBRSxTQUFLQSxRQUFMLEdBQWdCQSxRQUFoQjtFQUEwQjs7RUFDcEQsTUFBSTBDLFdBQUosR0FBa0I7RUFBRSxXQUFPLEtBQUtDLFVBQUwsSUFBbUI7RUFDNUM3SixNQUFBQSxNQUFNLEVBQUU7RUFEb0MsS0FBMUI7RUFFakI7O0VBQ0gsTUFBSTRKLFdBQUosQ0FBZ0JDLFVBQWhCLEVBQTRCO0VBQzFCLFNBQUtBLFVBQUwsR0FBa0J0SixNQUFNLENBQUN1SixNQUFQLENBQ2hCLEtBQUtGLFdBRFcsRUFFaEJDLFVBRmdCLENBQWxCO0VBSUQ7O0VBQ0QsTUFBSUUsUUFBSixHQUFlO0VBQ2IsU0FBS0MsT0FBTCxHQUFlLEtBQUtBLE9BQUwsSUFBZ0IsRUFBL0I7RUFDQSxXQUFPLEtBQUtBLE9BQVo7RUFDRDs7RUFDRCxNQUFJRCxRQUFKLENBQWFwSCxJQUFiLEVBQW1CO0VBQ2pCLFFBQ0VwQyxNQUFNLENBQUNDLElBQVAsQ0FBWW1DLElBQVosRUFBa0IzQyxNQURwQixFQUVFO0VBQ0EsVUFBRyxLQUFLNEosV0FBTCxDQUFpQjVKLE1BQXBCLEVBQTRCO0VBQzFCLGFBQUsrSixRQUFMLENBQWNFLE9BQWQsQ0FBc0IsS0FBS3pILEtBQUwsQ0FBV0csSUFBWCxDQUF0Qjs7RUFDQSxhQUFLb0gsUUFBTCxDQUFjL0ksTUFBZCxDQUFxQixLQUFLNEksV0FBTCxDQUFpQjVKLE1BQXRDO0VBQ0Q7RUFDRjtFQUNGOztFQUNELE1BQUlrSyxHQUFKLEdBQVU7RUFDUixRQUFJQyxFQUFFLEdBQUdSLFlBQVksQ0FBQ1MsT0FBYixDQUFxQixLQUFLVCxZQUFMLENBQWtCVSxRQUF2QyxDQUFUO0VBQ0EsU0FBS0YsRUFBTCxHQUFVQSxFQUFFLElBQUksSUFBaEI7RUFDQSxXQUFPNUgsSUFBSSxDQUFDQyxLQUFMLENBQVcsS0FBSzJILEVBQWhCLENBQVA7RUFDRDs7RUFDRCxNQUFJRCxHQUFKLENBQVFDLEVBQVIsRUFBWTtFQUNWQSxJQUFBQSxFQUFFLEdBQUc1SCxJQUFJLENBQUNFLFNBQUwsQ0FBZTBILEVBQWYsQ0FBTDtFQUNBUixJQUFBQSxZQUFZLENBQUNXLE9BQWIsQ0FBcUIsS0FBS1gsWUFBTCxDQUFrQlUsUUFBdkMsRUFBaURGLEVBQWpEO0VBQ0Q7O0VBQ0QzRSxFQUFBQSxHQUFHLEdBQUc7RUFDSixZQUFPbEYsU0FBUyxDQUFDTixNQUFqQjtFQUNFLFdBQUssQ0FBTDtFQUNFLGVBQU8sS0FBS2tJLEtBQVo7QUFDQTtFQUNGLFdBQUssQ0FBTDtFQUNFLFlBQUl4QyxHQUFHLEdBQUdwRixTQUFTLENBQUMsQ0FBRCxDQUFuQjtFQUNBLGVBQU8sS0FBSzRILEtBQUwsQ0FBV3hDLEdBQVgsQ0FBUDtBQUNBLEVBUEo7RUFTRDs7RUFDREQsRUFBQUEsR0FBRyxHQUFHO0VBQ0osU0FBS3NFLFFBQUwsR0FBZ0IsS0FBS3ZILEtBQUwsRUFBaEI7O0VBQ0EsWUFBT2xDLFNBQVMsQ0FBQ04sTUFBakI7RUFDRSxXQUFLLENBQUw7RUFDRSxhQUFLc0osVUFBTCxHQUFrQixJQUFsQjs7RUFDQSxZQUFJM0ksVUFBVSxHQUFHSixNQUFNLENBQUNNLE9BQVAsQ0FBZVAsU0FBUyxDQUFDLENBQUQsQ0FBeEIsQ0FBakI7O0VBQ0FLLFFBQUFBLFVBQVUsQ0FBQ3lCLE9BQVgsQ0FBbUIsT0FBZW1JLEtBQWYsS0FBeUI7RUFBQSxjQUF4QixDQUFDN0UsR0FBRCxFQUFNWixLQUFOLENBQXdCO0VBQzFDLGNBQUd5RixLQUFLLEtBQU01SixVQUFVLENBQUNYLE1BQVgsR0FBb0IsQ0FBbEMsRUFBc0MsS0FBS3NKLFVBQUwsR0FBa0IsS0FBbEI7RUFDdEMsZUFBS2tCLGVBQUwsQ0FBcUI5RSxHQUFyQixFQUEwQlosS0FBMUI7RUFDRCxTQUhEOztFQUlBOztFQUNGLFdBQUssQ0FBTDtFQUNFLFlBQUlZLEdBQUcsR0FBR3BGLFNBQVMsQ0FBQyxDQUFELENBQW5CO0VBQ0EsWUFBSXdFLEtBQUssR0FBR3hFLFNBQVMsQ0FBQyxDQUFELENBQXJCO0VBQ0EsYUFBS2tLLGVBQUwsQ0FBcUI5RSxHQUFyQixFQUEwQlosS0FBMUI7RUFDQTtFQWJKOztFQWVBLFdBQU8sSUFBUDtFQUNEOztFQUNEMkYsRUFBQUEsS0FBSyxHQUFHO0VBQ04sU0FBS1YsUUFBTCxHQUFnQixLQUFLdkgsS0FBTCxFQUFoQjs7RUFDQSxZQUFPbEMsU0FBUyxDQUFDTixNQUFqQjtFQUNFLFdBQUssQ0FBTDtFQUNFLGFBQUksSUFBSTBGLElBQVIsSUFBZW5GLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLEtBQUswSCxLQUFqQixDQUFmLEVBQXdDO0VBQ3RDLGVBQUt3QyxpQkFBTCxDQUF1QmhGLElBQXZCO0VBQ0Q7O0VBQ0Q7O0VBQ0YsV0FBSyxDQUFMO0VBQ0UsWUFBSUEsR0FBRyxHQUFHcEYsU0FBUyxDQUFDLENBQUQsQ0FBbkI7RUFDQSxhQUFLb0ssaUJBQUwsQ0FBdUJoRixHQUF2QjtFQUNBO0VBVEo7O0VBV0EsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0RpRixFQUFBQSxLQUFLLEdBQUc7RUFDTixRQUFJUixFQUFFLEdBQUcsS0FBS0QsR0FBZDs7RUFDQSxZQUFPNUosU0FBUyxDQUFDTixNQUFqQjtFQUNFLFdBQUssQ0FBTDtFQUNFLFlBQUlXLFVBQVUsR0FBR0osTUFBTSxDQUFDTSxPQUFQLENBQWVQLFNBQVMsQ0FBQyxDQUFELENBQXhCLENBQWpCOztFQUNBSyxRQUFBQSxVQUFVLENBQUN5QixPQUFYLENBQW1CLFdBQWtCO0VBQUEsY0FBakIsQ0FBQ3NELEdBQUQsRUFBTVosS0FBTixDQUFpQjtFQUNuQ3FGLFVBQUFBLEVBQUUsQ0FBQ3pFLEdBQUQsQ0FBRixHQUFVWixLQUFWO0VBQ0QsU0FGRDs7RUFHQTs7RUFDRixXQUFLLENBQUw7RUFDRSxZQUFJWSxHQUFHLEdBQUdwRixTQUFTLENBQUMsQ0FBRCxDQUFuQjtFQUNBLFlBQUl3RSxLQUFLLEdBQUd4RSxTQUFTLENBQUMsQ0FBRCxDQUFyQjtFQUNBNkosUUFBQUEsRUFBRSxDQUFDekUsR0FBRCxDQUFGLEdBQVVaLEtBQVY7RUFDQTtFQVhKOztFQWFBLFNBQUtvRixHQUFMLEdBQVdDLEVBQVg7RUFDQSxXQUFPLElBQVA7RUFDRDs7RUFDRFMsRUFBQUEsT0FBTyxHQUFHO0VBQ1IsWUFBT3RLLFNBQVMsQ0FBQ04sTUFBakI7RUFDRSxXQUFLLENBQUw7RUFDRSxlQUFPLEtBQUtrSyxHQUFaO0VBQ0E7O0VBQ0YsV0FBSyxDQUFMO0VBQ0UsWUFBSUMsRUFBRSxHQUFHLEtBQUtELEdBQWQ7RUFDQSxZQUFJeEUsR0FBRyxHQUFHcEYsU0FBUyxDQUFDLENBQUQsQ0FBbkI7RUFDQSxlQUFPNkosRUFBRSxDQUFDekUsR0FBRCxDQUFUO0VBQ0EsYUFBS3dFLEdBQUwsR0FBV0MsRUFBWDtFQUNBO0VBVEo7O0VBV0EsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0RLLEVBQUFBLGVBQWUsQ0FBQzlFLEdBQUQsRUFBTVosS0FBTixFQUFhO0VBQzFCLFFBQUcsQ0FBQyxLQUFLb0QsS0FBTCxDQUFXLElBQUlsRSxNQUFKLENBQVcwQixHQUFYLENBQVgsQ0FBSixFQUFpQztFQUMvQixVQUFJUCxPQUFPLEdBQUcsSUFBZDtFQUNBNUUsTUFBQUEsTUFBTSxDQUFDZ0YsZ0JBQVAsQ0FDRSxLQUFLMkMsS0FEUCxFQUVFO0VBQ0UsU0FBQyxJQUFJbEUsTUFBSixDQUFXMEIsR0FBWCxDQUFELEdBQW1CO0VBQ2pCbUYsVUFBQUEsWUFBWSxFQUFFLElBREc7O0VBRWpCckYsVUFBQUEsR0FBRyxHQUFHO0VBQUUsbUJBQU8sS0FBS0UsR0FBTCxDQUFQO0VBQWtCLFdBRlQ7O0VBR2pCRCxVQUFBQSxHQUFHLENBQUNYLEtBQUQsRUFBUTtFQUNULGdCQUFJdUUsTUFBTSxHQUFHbEUsT0FBTyxDQUFDMUIsU0FBUixDQUFrQjRGLE1BQS9COztFQUNBLGdCQUNFQSxNQUFNLElBQ05BLE1BQU0sQ0FBQzNELEdBQUQsQ0FGUixFQUdFO0VBQ0EsbUJBQUtBLEdBQUwsSUFBWVosS0FBWjtFQUNBSyxjQUFBQSxPQUFPLENBQUNxRSxTQUFSLENBQWtCOUQsR0FBbEIsSUFBeUJaLEtBQXpCO0VBQ0Esa0JBQUcsS0FBSzZFLFlBQVIsRUFBc0J4RSxPQUFPLENBQUN3RixLQUFSLENBQWNqRixHQUFkLEVBQW1CWixLQUFuQjtFQUN2QixhQVBELE1BT08sSUFBRyxDQUFDdUUsTUFBSixFQUFZO0VBQ2pCLG1CQUFLM0QsR0FBTCxJQUFZWixLQUFaO0VBQ0FLLGNBQUFBLE9BQU8sQ0FBQ3FFLFNBQVIsQ0FBa0I5RCxHQUFsQixJQUF5QlosS0FBekI7RUFDQSxrQkFBRyxLQUFLNkUsWUFBUixFQUFzQnhFLE9BQU8sQ0FBQ3dGLEtBQVIsQ0FBY2pGLEdBQWQsRUFBbUJaLEtBQW5CO0VBQ3ZCOztFQUNELGdCQUFJZ0csaUJBQWlCLEdBQUcsQ0FBQyxLQUFELEVBQVEsR0FBUixFQUFhcEYsR0FBYixFQUFrQnFGLElBQWxCLENBQXVCLEVBQXZCLENBQXhCO0VBQ0EsZ0JBQUlDLFlBQVksR0FBRyxLQUFuQjtFQUNBN0YsWUFBQUEsT0FBTyxDQUFDMUUsSUFBUixDQUNFcUssaUJBREYsRUFFRTtFQUNFL0ssY0FBQUEsSUFBSSxFQUFFK0ssaUJBRFI7RUFFRW5JLGNBQUFBLElBQUksRUFBRTtFQUNKK0MsZ0JBQUFBLEdBQUcsRUFBRUEsR0FERDtFQUVKWixnQkFBQUEsS0FBSyxFQUFFQTtFQUZIO0VBRlIsYUFGRixFQVNFSyxPQVRGOztFQVdBLGdCQUFHLENBQUNBLE9BQU8sQ0FBQ21FLFVBQVosRUFBd0I7RUFDdEIsa0JBQUcsQ0FBQy9JLE1BQU0sQ0FBQ0ssTUFBUCxDQUFjdUUsT0FBTyxDQUFDcUUsU0FBdEIsRUFBaUN4SixNQUFyQyxFQUE2QztFQUMzQ21GLGdCQUFBQSxPQUFPLENBQUMxRSxJQUFSLENBQ0V1SyxZQURGLEVBRUU7RUFDRWpMLGtCQUFBQSxJQUFJLEVBQUVpTCxZQURSO0VBRUVySSxrQkFBQUEsSUFBSSxFQUFFd0MsT0FBTyxDQUFDK0M7RUFGaEIsaUJBRkYsRUFNRS9DLE9BTkY7RUFRRCxlQVRELE1BU087RUFDTEEsZ0JBQUFBLE9BQU8sQ0FBQzFFLElBQVIsQ0FDRXVLLFlBREYsRUFFRTtFQUNFakwsa0JBQUFBLElBQUksRUFBRWlMLFlBRFI7RUFFRXJJLGtCQUFBQSxJQUFJLEVBQUVwQyxNQUFNLENBQUN1SixNQUFQLENBQ0osRUFESSxFQUVKM0UsT0FBTyxDQUFDcUUsU0FGSixFQUdKckUsT0FBTyxDQUFDK0MsS0FISjtFQUZSLGlCQUZGLEVBVUUvQyxPQVZGO0VBWUQ7O0VBQ0QscUJBQU9BLE9BQU8sQ0FBQ3NFLFFBQWY7RUFDRDtFQUNGOztFQXhEZ0I7RUFEckIsT0FGRjtFQStERDs7RUFDRCxTQUFLdkIsS0FBTCxDQUFXLElBQUlsRSxNQUFKLENBQVcwQixHQUFYLENBQVgsSUFBOEJaLEtBQTlCO0VBQ0EsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0Q0RixFQUFBQSxpQkFBaUIsQ0FBQ2hGLEdBQUQsRUFBTTtFQUNyQixRQUFJdUYsbUJBQW1CLEdBQUcsQ0FBQyxPQUFELEVBQVUsR0FBVixFQUFldkYsR0FBZixFQUFvQnFGLElBQXBCLENBQXlCLEVBQXpCLENBQTFCO0VBQ0EsUUFBSUcsY0FBYyxHQUFHLE9BQXJCO0VBQ0EsUUFBSUMsVUFBVSxHQUFHLEtBQUtqRCxLQUFMLENBQVd4QyxHQUFYLENBQWpCO0VBQ0EsV0FBTyxLQUFLd0MsS0FBTCxDQUFXLElBQUlsRSxNQUFKLENBQVcwQixHQUFYLENBQVgsQ0FBUDtFQUNBLFdBQU8sS0FBS3dDLEtBQUwsQ0FBV3hDLEdBQVgsQ0FBUDtFQUNBLFNBQUtqRixJQUFMLENBQ0V3SyxtQkFERixFQUVFO0VBQ0VsTCxNQUFBQSxJQUFJLEVBQUVrTCxtQkFEUjtFQUVFdEksTUFBQUEsSUFBSSxFQUFFO0VBQ0orQyxRQUFBQSxHQUFHLEVBQUVBLEdBREQ7RUFFSlosUUFBQUEsS0FBSyxFQUFFcUc7RUFGSDtFQUZSLEtBRkYsRUFTRSxJQVRGO0VBV0EsU0FBSzFLLElBQUwsQ0FDRXlLLGNBREYsRUFFRTtFQUNFbkwsTUFBQUEsSUFBSSxFQUFFbUwsY0FEUjtFQUVFdkksTUFBQUEsSUFBSSxFQUFFO0VBQ0orQyxRQUFBQSxHQUFHLEVBQUVBLEdBREQ7RUFFSlosUUFBQUEsS0FBSyxFQUFFcUc7RUFGSDtFQUZSLEtBRkYsRUFTRSxJQVRGO0VBV0EsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0RDLEVBQUFBLFdBQVcsR0FBRztFQUNaLFFBQUluRSxTQUFTLEdBQUcsRUFBaEI7RUFDQSxRQUFHLEtBQUtDLFFBQVIsRUFBa0IzRyxNQUFNLENBQUN1SixNQUFQLENBQWM3QyxTQUFkLEVBQXlCLEtBQUtDLFFBQTlCO0VBQ2xCLFFBQUcsS0FBS3lDLFlBQVIsRUFBc0JwSixNQUFNLENBQUN1SixNQUFQLENBQWM3QyxTQUFkLEVBQXlCLEtBQUtpRCxHQUE5QjtFQUN0QixRQUFHM0osTUFBTSxDQUFDQyxJQUFQLENBQVl5RyxTQUFaLENBQUgsRUFBMkIsS0FBS3hCLEdBQUwsQ0FBU3dCLFNBQVQ7RUFDNUI7O0VBQ0R6RSxFQUFBQSxLQUFLLENBQUNHLElBQUQsRUFBTztFQUNWQSxJQUFBQSxJQUFJLEdBQUdBLElBQUksSUFBSSxLQUFLdUYsS0FBYixJQUFzQixFQUE3QjtFQUNBLFdBQU8zRixJQUFJLENBQUNDLEtBQUwsQ0FBV0QsSUFBSSxDQUFDRSxTQUFMLENBQWVFLElBQWYsQ0FBWCxDQUFQO0VBQ0Q7O0VBN1A4QixDQUFqQzs7RUNDQSxNQUFNMEksSUFBTixTQUFtQmpJLElBQW5CLENBQXdCO0VBQ3RCNUQsRUFBQUEsV0FBVyxHQUFHO0VBQ1osVUFBTSxHQUFHYyxTQUFUO0VBQ0Q7O0VBQ0QsTUFBSXlFLHVCQUFKLEdBQThCO0VBQUUsV0FBTyxDQUNyQyxXQURxQyxDQUFQO0VBRTdCOztFQUNILE1BQUlqQixzQkFBSixHQUE2QjtFQUFFLFdBQU8sQ0FDcEMsYUFEb0MsRUFFcEMsU0FGb0MsRUFHcEMsWUFIb0MsRUFJcEMsV0FKb0MsRUFLcEMsUUFMb0MsQ0FBUDtFQU01Qjs7RUFDSCxNQUFJd0gsWUFBSixHQUFtQjtFQUFFLFdBQU8sS0FBS0MsUUFBTCxDQUFjQyxPQUFyQjtFQUE4Qjs7RUFDbkQsTUFBSUYsWUFBSixDQUFpQkcsV0FBakIsRUFBOEI7RUFDNUIsUUFBRyxDQUFDLEtBQUtGLFFBQVQsRUFBbUIsS0FBS0EsUUFBTCxHQUFnQkcsUUFBUSxDQUFDQyxhQUFULENBQXVCRixXQUF2QixDQUFoQjtFQUNwQjs7RUFDRCxNQUFJRixRQUFKLEdBQWU7RUFBRSxXQUFPLEtBQUs1RixPQUFaO0VBQXFCOztFQUN0QyxNQUFJNEYsUUFBSixDQUFhNUYsT0FBYixFQUFzQjtFQUNwQixTQUFLQSxPQUFMLEdBQWVBLE9BQWY7RUFDQSxTQUFLaUcsZUFBTCxDQUFxQkMsT0FBckIsQ0FBNkIsS0FBS2xHLE9BQWxDLEVBQTJDO0VBQ3pDbUcsTUFBQUEsT0FBTyxFQUFFLElBRGdDO0VBRXpDQyxNQUFBQSxTQUFTLEVBQUU7RUFGOEIsS0FBM0M7RUFJRDs7RUFDRCxNQUFJQyxXQUFKLEdBQWtCO0VBQ2hCLFNBQUtDLFVBQUwsR0FBa0IsS0FBS3RHLE9BQUwsQ0FBYXNHLFVBQS9CO0VBQ0EsV0FBTyxLQUFLQSxVQUFaO0VBQ0Q7O0VBQ0QsTUFBSUQsV0FBSixDQUFnQkMsVUFBaEIsRUFBNEI7RUFDMUIsU0FBSSxJQUFJLENBQUNDLFlBQUQsRUFBZUMsY0FBZixDQUFSLElBQTBDNUwsTUFBTSxDQUFDTSxPQUFQLENBQWVvTCxVQUFmLENBQTFDLEVBQXNFO0VBQ3BFLFVBQUcsT0FBT0UsY0FBUCxLQUEwQixXQUE3QixFQUEwQztFQUN4QyxhQUFLWixRQUFMLENBQWNhLGVBQWQsQ0FBOEJGLFlBQTlCO0VBQ0QsT0FGRCxNQUVPO0VBQ0wsYUFBS1gsUUFBTCxDQUFjYyxZQUFkLENBQTJCSCxZQUEzQixFQUF5Q0MsY0FBekM7RUFDRDtFQUNGO0VBQ0Y7O0VBQ0QsTUFBSVAsZUFBSixHQUFzQjtFQUNwQixTQUFLVSxnQkFBTCxHQUF3QixLQUFLQSxnQkFBTCxJQUF5QixJQUFJQyxnQkFBSixDQUMvQyxLQUFLQyxjQUFMLENBQW9CakcsSUFBcEIsQ0FBeUIsSUFBekIsQ0FEK0MsQ0FBakQ7RUFHQSxXQUFPLEtBQUsrRixnQkFBWjtFQUNEOztFQUNELE1BQUlHLE9BQUosR0FBYztFQUNaLFNBQUtDLE1BQUwsR0FBYyxLQUFLQSxNQUFMLElBQWUsSUFBN0I7RUFDQSxXQUFPLEtBQUtBLE1BQVo7RUFDRDs7RUFDRCxNQUFJRCxPQUFKLENBQVlDLE1BQVosRUFBb0I7RUFBRSxTQUFLQSxNQUFMLEdBQWNBLE1BQWQ7RUFBc0I7O0VBQzVDLE1BQUlDLFVBQUosR0FBaUI7RUFDZixTQUFLQyxTQUFMLEdBQWlCLEtBQUtBLFNBQUwsSUFBa0IsRUFBbkM7RUFDQSxXQUFPLEtBQUtBLFNBQVo7RUFDRDs7RUFDRCxNQUFJRCxVQUFKLENBQWVDLFNBQWYsRUFBMEI7RUFBRSxTQUFLQSxTQUFMLEdBQWlCQSxTQUFqQjtFQUE0Qjs7RUFDeERDLEVBQUFBLGVBQWUsR0FBRztFQUNoQixRQUFJMUksaUJBQWlCLEdBQUc1RCxNQUFNLENBQUN1SixNQUFQLENBQ3RCLEVBRHNCLEVBRXRCLEtBQUs1RixrQkFGaUIsQ0FBeEI7RUFJQSxTQUFLNEIsK0JBQUwsQ0FBcUMsV0FBckMsRUFBa0QsS0FBbEQ7RUFDQSxTQUFLZ0gsZ0JBQUw7RUFDQSxTQUFLQyxhQUFMLENBQW1CNUksaUJBQW5CO0VBQ0EsU0FBSzJCLCtCQUFMLENBQXFDLFdBQXJDLEVBQWtELElBQWxEO0VBQ0EsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0QwRyxFQUFBQSxjQUFjLENBQUNRLGtCQUFELEVBQXFCQyxRQUFyQixFQUErQjtFQUMzQyxTQUFJLElBQUksQ0FBQ0MsbUJBQUQsRUFBc0JDLGNBQXRCLENBQVIsSUFBaUQ1TSxNQUFNLENBQUNNLE9BQVAsQ0FBZW1NLGtCQUFmLENBQWpELEVBQXFGO0VBQ25GLGNBQU9HLGNBQWMsQ0FBQ3hGLElBQXRCO0VBQ0UsYUFBSyxXQUFMO0FBQ0UsRUFDQSxlQUFLa0YsZUFBTDtFQUNBO0VBSko7RUFNRDtFQUNGOztFQUNETyxFQUFBQSxVQUFVLEdBQUc7RUFDWCxRQUFHLEtBQUtWLE1BQVIsRUFBZ0I7RUFDZCxVQUFJVyxhQUFKOztFQUNBLFVBQUczSyxNQUFNLENBQUMsS0FBS2dLLE1BQUwsQ0FBWS9HLE9BQWIsQ0FBTixLQUFnQyxRQUFuQyxFQUE2QztFQUMzQzBILFFBQUFBLGFBQWEsR0FBRzNCLFFBQVEsQ0FBQzlGLGdCQUFULENBQTBCLEtBQUs4RyxNQUFMLENBQVkvRyxPQUF0QyxDQUFoQjtFQUNELE9BRkQsTUFFTztFQUNMMEgsUUFBQUEsYUFBYSxHQUFHLEtBQUtYLE1BQUwsQ0FBWS9HLE9BQTVCO0VBQ0Q7O0VBQ0QsVUFDRTBILGFBQWEsWUFBWTFHLFdBQXpCLElBQ0EwRyxhQUFhLFlBQVlDLElBRjNCLEVBR0U7RUFDQUQsUUFBQUEsYUFBYSxDQUFDRSxxQkFBZCxDQUFvQyxLQUFLYixNQUFMLENBQVkxRyxNQUFoRCxFQUF3RCxLQUFLTCxPQUE3RDtFQUNELE9BTEQsTUFLTyxJQUFHMEgsYUFBYSxZQUFZN0csUUFBNUIsRUFBc0M7RUFDM0M2RyxRQUFBQSxhQUFhLENBQ1ZqTCxPQURILENBQ1lvTCxjQUFELElBQW9CO0VBQzNCQSxVQUFBQSxjQUFjLENBQUNELHFCQUFmLENBQXFDLEtBQUtiLE1BQUwsQ0FBWTFHLE1BQWpELEVBQXlELEtBQUtMLE9BQTlEO0VBQ0QsU0FISDtFQUlELE9BTE0sTUFLQSxJQUFHMEgsYUFBYSxZQUFZSSxNQUE1QixFQUFvQztFQUN6Q0osUUFBQUEsYUFBYSxDQUNWSyxJQURILENBQ1EsQ0FBQ25ELEtBQUQsRUFBUTVFLE9BQVIsS0FBb0I7RUFDeEJBLFVBQUFBLE9BQU8sQ0FBQzRILHFCQUFSLENBQThCLEtBQUtiLE1BQUwsQ0FBWTFHLE1BQTFDLEVBQWtELEtBQUtMLE9BQXZEO0VBQ0QsU0FISDtFQUlEO0VBQ0Y7O0VBQ0QsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0RnSSxFQUFBQSxVQUFVLEdBQUc7RUFDWCxRQUNFLEtBQUtoSSxPQUFMLElBQ0EsS0FBS0EsT0FBTCxDQUFhMEgsYUFGZixFQUdFLEtBQUsxSCxPQUFMLENBQWEwSCxhQUFiLENBQTJCTyxXQUEzQixDQUF1QyxLQUFLakksT0FBNUM7RUFDRixXQUFPLElBQVA7RUFDRDs7RUE3R3FCOztFQ0R4QixJQUFNa0ksVUFBVSxHQUFHLGNBQWN6SyxJQUFkLENBQW1CO0VBQ3BDNUQsRUFBQUEsV0FBVyxHQUFHO0VBQ1osVUFBTSxHQUFHYyxTQUFUO0VBQ0EsU0FBSzBHLGFBQUw7RUFDQSxXQUFPLElBQVA7RUFDRDs7RUFDRCxNQUFJakMsdUJBQUosR0FBOEI7RUFBRSxXQUFPLENBQ3JDLE9BRHFDLEVBRXJDLE1BRnFDLEVBR3JDLFlBSHFDLEVBSXJDLFFBSnFDLENBQVA7RUFLN0I7O0VBQ0gsTUFBSWpCLHNCQUFKLEdBQTZCO0VBQUUsV0FBTyxDQUNwQyxRQURvQyxFQUVwQyxhQUZvQyxFQUdwQyxnQkFIb0MsRUFJcEMsT0FKb0MsRUFLcEMsWUFMb0MsRUFNcEMsZUFOb0MsRUFPcEMsYUFQb0MsRUFRcEMsa0JBUm9DLEVBU3BDLHFCQVRvQyxFQVVwQyxTQVZvQyxFQVdwQyxjQVhvQyxFQVlwQyxpQkFab0MsQ0FBUDtFQWE1Qjs7RUF6QmlDLENBQXRDOztFQ0NBLElBQU1nSyxNQUFNLEdBQUcsY0FBYzFLLElBQWQsQ0FBbUI7RUFDaEM1RCxFQUFBQSxXQUFXLEdBQUc7RUFDWixVQUFNLEdBQUdjLFNBQVQ7RUFDQSxXQUFPLElBQVA7RUFDRDs7RUFDRCxNQUFJeU4sUUFBSixHQUFlO0VBQUUsV0FBT0MsTUFBTSxDQUFDQyxRQUFQLENBQWdCRixRQUF2QjtFQUFpQzs7RUFDbEQsTUFBSUcsUUFBSixHQUFlO0VBQUUsV0FBT0YsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxRQUF2QjtFQUFpQzs7RUFDbEQsTUFBSUMsSUFBSixHQUFXO0VBQUUsV0FBT0gsTUFBTSxDQUFDQyxRQUFQLENBQWdCRSxJQUF2QjtFQUE2Qjs7RUFDMUMsTUFBSUMsSUFBSixHQUFXO0VBQUUsV0FBT0osTUFBTSxDQUFDQyxRQUFQLENBQWdCSSxRQUF2QjtFQUFpQzs7RUFDOUMsTUFBSUMsSUFBSixHQUFXO0VBQ1QsUUFBSUMsSUFBSSxHQUFHUCxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JNLElBQTNCO0VBQ0EsUUFBSUMsU0FBUyxHQUFHRCxJQUFJLENBQUNFLE9BQUwsQ0FBYSxHQUFiLENBQWhCOztFQUNBLFFBQUdELFNBQVMsR0FBRyxDQUFDLENBQWhCLEVBQW1CO0VBQ2pCLFVBQUlFLFVBQVUsR0FBR0gsSUFBSSxDQUFDRSxPQUFMLENBQWEsR0FBYixDQUFqQjtFQUNBLFVBQUlFLFVBQVUsR0FBR0gsU0FBUyxHQUFHLENBQTdCO0VBQ0EsVUFBSUksU0FBSjs7RUFDQSxVQUFHRixVQUFVLEdBQUcsQ0FBQyxDQUFqQixFQUFvQjtFQUNsQkUsUUFBQUEsU0FBUyxHQUFJSixTQUFTLEdBQUdFLFVBQWIsR0FDUkgsSUFBSSxDQUFDdk8sTUFERyxHQUVSME8sVUFGSjtFQUdELE9BSkQsTUFJTztFQUNMRSxRQUFBQSxTQUFTLEdBQUdMLElBQUksQ0FBQ3ZPLE1BQWpCO0VBQ0Q7O0VBQ0R1TyxNQUFBQSxJQUFJLEdBQUdBLElBQUksQ0FBQzlNLEtBQUwsQ0FBV2tOLFVBQVgsRUFBdUJDLFNBQXZCLENBQVA7O0VBQ0EsVUFBR0wsSUFBSSxDQUFDdk8sTUFBUixFQUFnQjtFQUNkLGVBQU91TyxJQUFQO0VBQ0QsT0FGRCxNQUVPO0VBQ0wsZUFBTyxJQUFQO0VBQ0Q7RUFDRixLQWpCRCxNQWlCTztFQUNMLGFBQU8sSUFBUDtFQUNEO0VBQ0Y7O0VBQ0QsTUFBSXRNLE1BQUosR0FBYTtFQUNYLFFBQUlzTSxJQUFJLEdBQUdQLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQk0sSUFBM0I7RUFDQSxRQUFJRyxVQUFVLEdBQUdILElBQUksQ0FBQ0UsT0FBTCxDQUFhLEdBQWIsQ0FBakI7O0VBQ0EsUUFBR0MsVUFBVSxHQUFHLENBQUMsQ0FBakIsRUFBb0I7RUFDbEIsVUFBSUYsU0FBUyxHQUFHRCxJQUFJLENBQUNFLE9BQUwsQ0FBYSxHQUFiLENBQWhCO0VBQ0EsVUFBSUUsVUFBVSxHQUFHRCxVQUFVLEdBQUcsQ0FBOUI7RUFDQSxVQUFJRSxTQUFKOztFQUNBLFVBQUdKLFNBQVMsR0FBRyxDQUFDLENBQWhCLEVBQW1CO0VBQ2pCSSxRQUFBQSxTQUFTLEdBQUlGLFVBQVUsR0FBR0YsU0FBZCxHQUNSRCxJQUFJLENBQUN2TyxNQURHLEdBRVJ3TyxTQUZKO0VBR0QsT0FKRCxNQUlPO0VBQ0xJLFFBQUFBLFNBQVMsR0FBR0wsSUFBSSxDQUFDdk8sTUFBakI7RUFDRDs7RUFDRHVPLE1BQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDOU0sS0FBTCxDQUFXa04sVUFBWCxFQUF1QkMsU0FBdkIsQ0FBUDs7RUFDQSxVQUFHTCxJQUFJLENBQUN2TyxNQUFSLEVBQWdCO0VBQ2QsZUFBT3VPLElBQVA7RUFDRCxPQUZELE1BRU87RUFDTCxlQUFPLElBQVA7RUFDRDtFQUNGLEtBakJELE1BaUJPO0VBQ0wsYUFBTyxJQUFQO0VBQ0Q7RUFDRjs7RUFDRCxNQUFJTSxVQUFKLEdBQWlCO0VBQ2YsUUFBSUMsU0FBUyxHQUFHO0VBQ2RiLE1BQUFBLFFBQVEsRUFBRSxFQURJO0VBRWRjLE1BQUFBLFVBQVUsRUFBRTtFQUZFLEtBQWhCO0VBSUEsUUFBSVgsSUFBSSxHQUFHLEtBQUtBLElBQUwsQ0FBVWxNLEtBQVYsQ0FBZ0IsR0FBaEIsRUFBcUI4TSxNQUFyQixDQUE2QkMsUUFBRCxJQUFjQSxRQUFRLENBQUNqUCxNQUFuRCxDQUFYO0VBQ0FvTyxJQUFBQSxJQUFJLEdBQUlBLElBQUksQ0FBQ3BPLE1BQU4sR0FDSG9PLElBREcsR0FFSCxDQUFDLEdBQUQsQ0FGSjtFQUdBLFFBQUlFLElBQUksR0FBRyxLQUFLQSxJQUFoQjtFQUNBLFFBQUlZLGFBQWEsR0FBSVosSUFBRCxHQUNoQkEsSUFBSSxDQUFDcE0sS0FBTCxDQUFXLEdBQVgsRUFBZ0I4TSxNQUFoQixDQUF3QkMsUUFBRCxJQUFjQSxRQUFRLENBQUNqUCxNQUE5QyxDQURnQixHQUVoQixJQUZKO0VBR0EsUUFBSWlDLE1BQU0sR0FBRyxLQUFLQSxNQUFsQjtFQUNBLFFBQUlJLFNBQVMsR0FBSUosTUFBRCxHQUNaRCxjQUFjLENBQUNDLE1BQUQsQ0FERixHQUVaLElBRko7RUFHQSxRQUFHLEtBQUs4TCxRQUFSLEVBQWtCZSxTQUFTLENBQUNiLFFBQVYsQ0FBbUJGLFFBQW5CLEdBQThCLEtBQUtBLFFBQW5DO0VBQ2xCLFFBQUcsS0FBS0csUUFBUixFQUFrQlksU0FBUyxDQUFDYixRQUFWLENBQW1CQyxRQUFuQixHQUE4QixLQUFLQSxRQUFuQztFQUNsQixRQUFHLEtBQUtDLElBQVIsRUFBY1csU0FBUyxDQUFDYixRQUFWLENBQW1CRSxJQUFuQixHQUEwQixLQUFLQSxJQUEvQjtFQUNkLFFBQUcsS0FBS0MsSUFBUixFQUFjVSxTQUFTLENBQUNiLFFBQVYsQ0FBbUJHLElBQW5CLEdBQTBCLEtBQUtBLElBQS9COztFQUNkLFFBQ0VFLElBQUksSUFDSlksYUFGRixFQUdFO0VBQ0FBLE1BQUFBLGFBQWEsR0FBSUEsYUFBYSxDQUFDbFAsTUFBZixHQUNaa1AsYUFEWSxHQUVaLENBQUMsR0FBRCxDQUZKO0VBR0FKLE1BQUFBLFNBQVMsQ0FBQ2IsUUFBVixDQUFtQkssSUFBbkIsR0FBMEI7RUFDeEJGLFFBQUFBLElBQUksRUFBRUUsSUFEa0I7RUFFeEJhLFFBQUFBLFNBQVMsRUFBRUQ7RUFGYSxPQUExQjtFQUlEOztFQUNELFFBQ0VqTixNQUFNLElBQ05JLFNBRkYsRUFHRTtFQUNBeU0sTUFBQUEsU0FBUyxDQUFDYixRQUFWLENBQW1CaE0sTUFBbkIsR0FBNEI7RUFDMUJtTSxRQUFBQSxJQUFJLEVBQUVuTSxNQURvQjtFQUUxQlUsUUFBQUEsSUFBSSxFQUFFTjtFQUZvQixPQUE1QjtFQUlEOztFQUNEeU0sSUFBQUEsU0FBUyxDQUFDYixRQUFWLENBQW1CRyxJQUFuQixHQUEwQjtFQUN4QnJPLE1BQUFBLElBQUksRUFBRSxLQUFLcU8sSUFEYTtFQUV4QmUsTUFBQUEsU0FBUyxFQUFFZjtFQUZhLEtBQTFCO0VBSUFVLElBQUFBLFNBQVMsQ0FBQ2IsUUFBVixDQUFtQm1CLFVBQW5CLEdBQWdDLEtBQUtBLFVBQXJDO0VBQ0EsUUFBSUMsbUJBQW1CLEdBQUcsS0FBS0Msb0JBQS9CO0VBQ0FSLElBQUFBLFNBQVMsQ0FBQ2IsUUFBVixHQUFxQjFOLE1BQU0sQ0FBQ3VKLE1BQVAsQ0FDbkJnRixTQUFTLENBQUNiLFFBRFMsRUFFbkJvQixtQkFBbUIsQ0FBQ3BCLFFBRkQsQ0FBckI7RUFJQWEsSUFBQUEsU0FBUyxDQUFDQyxVQUFWLEdBQXVCTSxtQkFBbUIsQ0FBQ04sVUFBM0M7RUFDQSxTQUFLRCxTQUFMLEdBQWlCQSxTQUFqQjtFQUNBLFdBQU8sS0FBS0EsU0FBWjtFQUNEOztFQUNELE1BQUlRLG9CQUFKLEdBQTJCO0VBQ3pCLFFBQUlSLFNBQVMsR0FBRztFQUNkYixNQUFBQSxRQUFRLEVBQUU7RUFESSxLQUFoQjtFQUdBMU4sSUFBQUEsTUFBTSxDQUFDTSxPQUFQLENBQWUsS0FBSzBPLE1BQXBCLEVBQ0duTixPQURILENBQ1csVUFBZ0M7RUFBQSxVQUEvQixDQUFDb04sU0FBRCxFQUFZQyxhQUFaLENBQStCO0VBQ3ZDLFVBQUlDLGFBQWEsR0FBRyxLQUFLdEIsSUFBTCxDQUFVbE0sS0FBVixDQUFnQixHQUFoQixFQUFxQjhNLE1BQXJCLENBQTZCQyxRQUFELElBQWNBLFFBQVEsQ0FBQ2pQLE1BQW5ELENBQXBCO0VBQ0EwUCxNQUFBQSxhQUFhLEdBQUlBLGFBQWEsQ0FBQzFQLE1BQWYsR0FDWjBQLGFBRFksR0FFWixDQUFDLEdBQUQsQ0FGSjtFQUdBLFVBQUlDLGNBQWMsR0FBR0gsU0FBUyxDQUFDdE4sS0FBVixDQUFnQixHQUFoQixFQUFxQjhNLE1BQXJCLENBQTRCLENBQUNDLFFBQUQsRUFBV1csYUFBWCxLQUE2QlgsUUFBUSxDQUFDalAsTUFBbEUsQ0FBckI7RUFDQTJQLE1BQUFBLGNBQWMsR0FBSUEsY0FBYyxDQUFDM1AsTUFBaEIsR0FDYjJQLGNBRGEsR0FFYixDQUFDLEdBQUQsQ0FGSjs7RUFHQSxVQUNFRCxhQUFhLENBQUMxUCxNQUFkLElBQ0EwUCxhQUFhLENBQUMxUCxNQUFkLEtBQXlCMlAsY0FBYyxDQUFDM1AsTUFGMUMsRUFHRTtFQUNBLFlBQUk2UCxLQUFKO0VBQ0EsZUFBT0YsY0FBYyxDQUFDWCxNQUFmLENBQXNCLENBQUNjLGFBQUQsRUFBZ0JDLGtCQUFoQixLQUF1QztFQUNsRSxjQUNFRixLQUFLLEtBQUtHLFNBQVYsSUFDQUgsS0FBSyxLQUFLLElBRlosRUFHRTtFQUNBLGdCQUFHQyxhQUFhLENBQUMsQ0FBRCxDQUFiLEtBQXFCLEdBQXhCLEVBQTZCO0VBQzNCLGtCQUFJRyxZQUFZLEdBQUdILGFBQWEsQ0FBQ3hMLE9BQWQsQ0FBc0IsR0FBdEIsRUFBMkIsRUFBM0IsQ0FBbkI7O0VBQ0Esa0JBQ0V5TCxrQkFBa0IsS0FBS0wsYUFBYSxDQUFDMVAsTUFBZCxHQUF1QixDQURoRCxFQUVFO0VBQ0E4TyxnQkFBQUEsU0FBUyxDQUFDYixRQUFWLENBQW1CZ0MsWUFBbkIsR0FBa0NBLFlBQWxDO0VBQ0Q7O0VBQ0RuQixjQUFBQSxTQUFTLENBQUNiLFFBQVYsQ0FBbUJnQyxZQUFuQixJQUFtQ1AsYUFBYSxDQUFDSyxrQkFBRCxDQUFoRDtFQUNBRCxjQUFBQSxhQUFhLEdBQUcsS0FBS0ksZ0JBQXJCO0VBQ0QsYUFURCxNQVNPO0VBQ0xKLGNBQUFBLGFBQWEsR0FBR0EsYUFBYSxDQUFDeEwsT0FBZCxDQUFzQixJQUFJNkwsTUFBSixDQUFXLEdBQVgsRUFBZ0IsSUFBaEIsQ0FBdEIsRUFBNkMsTUFBN0MsQ0FBaEI7RUFDQUwsY0FBQUEsYUFBYSxHQUFHLEtBQUtNLHVCQUFMLENBQTZCTixhQUE3QixDQUFoQjtFQUNEOztFQUNERCxZQUFBQSxLQUFLLEdBQUdDLGFBQWEsQ0FBQ08sSUFBZCxDQUFtQlgsYUFBYSxDQUFDSyxrQkFBRCxDQUFoQyxDQUFSOztFQUNBLGdCQUNFRixLQUFLLEtBQUssSUFBVixJQUNBRSxrQkFBa0IsS0FBS0wsYUFBYSxDQUFDMVAsTUFBZCxHQUF1QixDQUZoRCxFQUdFO0VBQ0E4TyxjQUFBQSxTQUFTLENBQUNiLFFBQVYsQ0FBbUJxQyxLQUFuQixHQUEyQjtFQUN6QnZRLGdCQUFBQSxJQUFJLEVBQUV5UCxTQURtQjtFQUV6QkwsZ0JBQUFBLFNBQVMsRUFBRVE7RUFGYyxlQUEzQjtFQUlBYixjQUFBQSxTQUFTLENBQUNDLFVBQVYsR0FBdUJVLGFBQXZCO0VBQ0EscUJBQU9BLGFBQVA7RUFDRDtFQUNGO0VBQ0YsU0EvQk0sRUErQkosQ0EvQkksQ0FBUDtFQWdDRDtFQUNGLEtBaERIO0VBaURBLFdBQU9YLFNBQVA7RUFDRDs7RUFDRCxNQUFJeUIsT0FBSixHQUFjO0VBQ1osU0FBS2hCLE1BQUwsR0FBYyxLQUFLQSxNQUFMLElBQWUsRUFBN0I7RUFDQSxXQUFPLEtBQUtBLE1BQVo7RUFDRDs7RUFDRCxNQUFJZ0IsT0FBSixDQUFZaEIsTUFBWixFQUFvQjtFQUNsQixTQUFLQSxNQUFMLEdBQWNBLE1BQWQ7RUFDRDs7RUFDRCxNQUFJaUIsV0FBSixHQUFrQjtFQUFFLFdBQU8sS0FBS3pCLFVBQVo7RUFBd0I7O0VBQzVDLE1BQUl5QixXQUFKLENBQWdCekIsVUFBaEIsRUFBNEI7RUFBRSxTQUFLQSxVQUFMLEdBQWtCQSxVQUFsQjtFQUE4Qjs7RUFDNUQsTUFBSTBCLFlBQUosR0FBbUI7RUFBRSxXQUFPLEtBQUtDLFdBQVo7RUFBeUI7O0VBQzlDLE1BQUlELFlBQUosQ0FBaUJDLFdBQWpCLEVBQThCO0VBQUUsU0FBS0EsV0FBTCxHQUFtQkEsV0FBbkI7RUFBZ0M7O0VBQ2hFLE1BQUlDLFdBQUosR0FBa0I7RUFBRSxXQUFPLEtBQUt2QixVQUFaO0VBQXdCOztFQUM1QyxNQUFJdUIsV0FBSixDQUFnQnZCLFVBQWhCLEVBQTRCO0VBQzFCLFFBQUcsS0FBS0EsVUFBUixFQUFvQixLQUFLcUIsWUFBTCxHQUFvQixLQUFLckIsVUFBekI7RUFDcEIsU0FBS0EsVUFBTCxHQUFrQkEsVUFBbEI7RUFDRDs7RUFDRCxNQUFJYyxnQkFBSixHQUF1QjtFQUFFLFdBQU8sSUFBSUMsTUFBSixDQUFXLGlFQUFYLEVBQThFLElBQTlFLENBQVA7RUFBNEY7O0VBQ3JIQyxFQUFBQSx1QkFBdUIsQ0FBQ25CLFFBQUQsRUFBVztFQUNoQyxXQUFPLElBQUlrQixNQUFKLENBQVcsSUFBSW5NLE1BQUosQ0FBV2lMLFFBQVgsRUFBcUIsR0FBckIsQ0FBWCxDQUFQO0VBQ0Q7O0VBQ0QyQixFQUFBQSxZQUFZLEdBQUc7RUFDYixRQUFHLEtBQUt2TixRQUFMLENBQWMwTCxVQUFqQixFQUE2QixLQUFLeUIsV0FBTCxHQUFtQixLQUFLbk4sUUFBTCxDQUFjMEwsVUFBakM7RUFDN0IsU0FBS3dCLE9BQUwsR0FBZWhRLE1BQU0sQ0FBQ00sT0FBUCxDQUFlLEtBQUt3QyxRQUFMLENBQWNrTSxNQUE3QixFQUFxQ3NCLE1BQXJDLENBQ2IsQ0FDRU4sT0FERixTQUdFTyxVQUhGLEVBSUVDLGNBSkYsS0FLSztFQUFBLFVBSEgsQ0FBQ3ZCLFNBQUQsRUFBWUMsYUFBWixDQUdHO0VBQ0hjLE1BQUFBLE9BQU8sQ0FBQ2YsU0FBRCxDQUFQLEdBQXFCalAsTUFBTSxDQUFDdUosTUFBUCxDQUNuQjJGLGFBRG1CLEVBRW5CO0VBQ0V1QixRQUFBQSxRQUFRLEVBQUUsS0FBS2pDLFVBQUwsQ0FBZ0JVLGFBQWEsQ0FBQ3VCLFFBQTlCLEVBQXdDekssSUFBeEMsQ0FBNkMsS0FBS3dJLFVBQWxEO0VBRFosT0FGbUIsQ0FBckI7RUFNQSxhQUFPd0IsT0FBUDtFQUNELEtBZFksRUFlYixFQWZhLENBQWY7RUFpQkEsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0RVLEVBQUFBLGlCQUFpQixHQUFHO0VBQ2xCakQsSUFBQUEsTUFBTSxDQUFDNU8sZ0JBQVAsQ0FBd0IsWUFBeEIsRUFBc0MsS0FBSzhSLFdBQUwsQ0FBaUIzSyxJQUFqQixDQUFzQixJQUF0QixDQUF0QztFQUNBLFdBQU8sSUFBUDtFQUNEOztFQUNENEssRUFBQUEsa0JBQWtCLEdBQUc7RUFDbkJuRCxJQUFBQSxNQUFNLENBQUMxTyxtQkFBUCxDQUEyQixZQUEzQixFQUF5QyxLQUFLNFIsV0FBTCxDQUFpQjNLLElBQWpCLENBQXNCLElBQXRCLENBQXpDO0VBQ0EsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0QySyxFQUFBQSxXQUFXLEdBQUc7RUFDWixTQUFLUCxXQUFMLEdBQW1CM0MsTUFBTSxDQUFDQyxRQUFQLENBQWdCTSxJQUFuQztFQUNBLFFBQUlPLFNBQVMsR0FBRyxLQUFLRCxVQUFyQjs7RUFDQSxRQUFHQyxTQUFTLENBQUNDLFVBQWIsRUFBeUI7RUFDdkIsVUFBRyxLQUFLMkIsV0FBUixFQUFxQjVCLFNBQVMsQ0FBQzRCLFdBQVYsR0FBd0IsS0FBS0EsV0FBN0I7RUFDckIsV0FBS2pRLElBQUwsQ0FDRSxVQURGLEVBRUVxTyxTQUZGO0VBSUFBLE1BQUFBLFNBQVMsQ0FBQ0MsVUFBVixDQUFxQmlDLFFBQXJCLENBQThCbEMsU0FBOUI7RUFDRDs7RUFDRCxXQUFPLElBQVA7RUFDRDs7RUFDRHNDLEVBQUFBLFFBQVEsQ0FBQ2hELElBQUQsRUFBTztFQUNiSixJQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JNLElBQWhCLEdBQXVCSCxJQUF2QjtFQUNEOztFQXhPK0IsQ0FBbEM7O0VDTUEsSUFBTWlELEdBQUcsR0FBRztFQUNWOVIsRUFBQUEsTUFEVTtFQUVWb0MsRUFBQUEsUUFGVTtFQUdWMlAsRUFBQUEsS0FIVTtFQUlWdkssRUFBQUEsT0FKVTtFQUtWb0MsRUFBQUEsS0FMVTtFQU1Wa0MsRUFBQUEsSUFOVTtFQU9Wd0MsRUFBQUEsVUFQVTtFQVFWQyxFQUFBQTtFQVJVLENBQVo7Ozs7Ozs7OyJ9
