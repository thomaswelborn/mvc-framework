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
    $,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL3BhcmFtc1RvT2JqZWN0LmpzIiwiLi4vLi4vc291cmNlL01WQy9VdGlscy90eXBlT2YuanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL3VpZC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQmFzZS9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvU2VydmljZS9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvTW9kZWwvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1ZpZXcvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL0NvbnRyb2xsZXIvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1JvdXRlci9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiRXZlbnRUYXJnZXQucHJvdG90eXBlLm9uID0gRXZlbnRUYXJnZXQucHJvdG90eXBlLm9uIHx8IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyXHJcbkV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vZmYgPSBFdmVudFRhcmdldC5wcm90b3R5cGUub2ZmIHx8IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyXHJcbiIsImNsYXNzIEV2ZW50cyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfZXZlbnRzKCkge1xyXG4gICAgdGhpcy5ldmVudHMgPSB0aGlzLmV2ZW50cyB8fCB7fVxyXG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzXHJcbiAgfVxyXG4gIGdldEV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSkgeyByZXR1cm4gdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gfHwge30gfVxyXG4gIGdldEV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIHJldHVybiAoZXZlbnRDYWxsYmFjay5uYW1lLmxlbmd0aClcclxuICAgICAgPyBldmVudENhbGxiYWNrLm5hbWVcclxuICAgICAgOiAnYW5vbnltb3VzRnVuY3Rpb24nXHJcbiAgfVxyXG4gIGdldEV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpIHtcclxuICAgIHJldHVybiBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gfHwgW11cclxuICB9XHJcbiAgb24oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKSB7XHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja3MgPSB0aGlzLmdldEV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSlcclxuICAgIGxldCBldmVudENhbGxiYWNrTmFtZSA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgIGxldCBldmVudENhbGxiYWNrR3JvdXAgPSB0aGlzLmdldEV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpXHJcbiAgICBldmVudENhbGxiYWNrR3JvdXAucHVzaChldmVudENhbGxiYWNrKVxyXG4gICAgZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdID0gZXZlbnRDYWxsYmFja0dyb3VwXHJcbiAgICB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSA9IGV2ZW50Q2FsbGJhY2tzXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBvZmYoKSB7XHJcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICBjYXNlIDA6XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZXZlbnRzXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAxOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDI6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2tOYW1lID0gKHR5cGVvZiBldmVudENhbGxiYWNrID09PSAnc3RyaW5nJylcclxuICAgICAgICAgID8gZXZlbnRDYWxsYmFja1xyXG4gICAgICAgICAgOiB0aGlzLmdldEV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgaWYodGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0pIHtcclxuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVtldmVudENhbGxiYWNrTmFtZV1cclxuICAgICAgICAgIGlmKFxyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9ldmVudHNbZXZlbnROYW1lXSkubGVuZ3RoID09PSAwXHJcbiAgICAgICAgICApIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgZW1pdChldmVudE5hbWUsIGV2ZW50RGF0YSkge1xyXG4gICAgbGV0IF9hcmd1bWVudHMgPSBPYmplY3QudmFsdWVzKGFyZ3VtZW50cylcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IE9iamVjdC5lbnRyaWVzKFxyXG4gICAgICB0aGlzLmdldEV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSlcclxuICAgIClcclxuICAgIGZvcihsZXQgW2V2ZW50Q2FsbGJhY2tHcm91cE5hbWUsIGV2ZW50Q2FsbGJhY2tHcm91cF0gb2YgZXZlbnRDYWxsYmFja3MpIHtcclxuICAgICAgZm9yKGxldCBldmVudENhbGxiYWNrIG9mIGV2ZW50Q2FsbGJhY2tHcm91cCkge1xyXG4gICAgICAgIGxldCBhZGRpdGlvbmFsQXJndW1lbnRzID0gX2FyZ3VtZW50cy5zcGxpY2UoMikgfHwgW11cclxuICAgICAgICBldmVudENhbGxiYWNrKGV2ZW50RGF0YSwgLi4uYWRkaXRpb25hbEFyZ3VtZW50cylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRzXHJcbiIsImNvbnN0IENoYW5uZWwgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfcmVzcG9uc2VzKCkge1xyXG4gICAgdGhpcy5yZXNwb25zZXMgPSB0aGlzLnJlc3BvbnNlcyB8fCB0aGlzLnJlc3BvbnNlc1xyXG4gICAgcmV0dXJuIHRoaXMucmVzcG9uc2VzXHJcbiAgfVxyXG4gIHJlc3BvbnNlKHJlc3BvbnNlTmFtZSwgcmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgaWYocmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgICB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSA9IHJlc3BvbnNlQ2FsbGJhY2tcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VdXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlcXVlc3QocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZih0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSkge1xyXG4gICAgICBsZXQgX2FyZ3VtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykuc2xpY2UoMSlcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKC4uLl9hcmd1bWVudHMpXHJcbiAgICB9XHJcbiAgfVxyXG4gIG9mZihyZXNwb25zZU5hbWUpIHtcclxuICAgIGlmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvcihsZXQgW3Jlc3BvbnNlTmFtZV0gb2YgT2JqZWN0LmtleXModGhpcy5fcmVzcG9uc2VzKSkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IENoYW5uZWxcclxuIiwiaW1wb3J0IENoYW5uZWwgZnJvbSAnLi9DaGFubmVsL2luZGV4J1xyXG5jb25zdCBDaGFubmVscyA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9jaGFubmVscygpIHtcclxuICAgIHRoaXMuY2hhbm5lbHMgPSB0aGlzLmNoYW5uZWxzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsc1xyXG4gIH1cclxuICBjaGFubmVsKGNoYW5uZWxOYW1lKSB7XHJcbiAgICB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0gPSAodGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdKVxyXG4gICAgICA/IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA6IG5ldyBDaGFubmVsKClcclxuICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbiAgb2ZmKGNoYW5uZWxOYW1lKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IENoYW5uZWxzXHJcbiIsImNvbnN0IHBhcmFtc1RvT2JqZWN0ID0gZnVuY3Rpb24gcGFyYW1zVG9PYmplY3QocGFyYW1zKSB7XHJcbiAgICB2YXIgcGFyYW1zID0gcGFyYW1zLnNwbGl0KCcmJylcclxuICAgIHZhciBvYmplY3QgPSB7fVxyXG4gICAgcGFyYW1zLmZvckVhY2goKHBhcmFtRGF0YSkgPT4ge1xyXG4gICAgICBwYXJhbURhdGEgPSBwYXJhbURhdGEuc3BsaXQoJz0nKVxyXG4gICAgICBvYmplY3RbcGFyYW1EYXRhWzBdXSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJhbURhdGFbMV0gfHwgJycpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqZWN0KSlcclxufVxyXG5leHBvcnQgZGVmYXVsdCBwYXJhbXNUb09iamVjdFxyXG4iLCJjb25zdCB0eXBlT2YgPSBmdW5jdGlvbiB0eXBlT2YoZGF0YSkge1xyXG4gIHN3aXRjaCh0eXBlb2YgZGF0YSkge1xyXG4gICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgbGV0IF9vYmplY3RcclxuICAgICAgaWYoXHJcbiAgICAgICAgQXJyYXkuaXNBcnJheShkYXRhKVxyXG4gICAgICApIHtcclxuICAgICAgICByZXR1cm4gJ2FycmF5J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgZGF0YSAhPT0gbnVsbFxyXG4gICAgICApIHtcclxuICAgICAgICByZXR1cm4gJ29iamVjdCdcclxuICAgICAgfSBlbHNlIGlmKFxyXG4gICAgICAgIGRhdGEgPT09IG51bGxcclxuICAgICAgKSB7XHJcbiAgICAgICAgcmV0dXJuICdudWxsJ1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBfb2JqZWN0XHJcbiAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgY2FzZSAnbnVtYmVyJzpcclxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgcmV0dXJuIHR5cGVvZiBkYXRhXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IHR5cGVPZlxyXG4iLCJjb25zdCBVSUQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHV1aWQgPSAnJywgaWlcclxuICBmb3IgKGlpID0gMDsgaWkgPCAzMjsgaWkgKz0gMSkge1xyXG4gICAgc3dpdGNoIChpaSkge1xyXG4gICAgICBjYXNlIDg6XHJcbiAgICAgIGNhc2UgMjA6XHJcbiAgICAgICAgdXVpZCArPSAnLSc7XHJcbiAgICAgICAgdXVpZCArPSAoTWF0aC5yYW5kb20oKSAqIDE2IHwgMCkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAxMjpcclxuICAgICAgICB1dWlkICs9ICctJ1xyXG4gICAgICAgIHV1aWQgKz0gJzQnXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAxNjpcclxuICAgICAgICB1dWlkICs9ICctJ1xyXG4gICAgICAgIHV1aWQgKz0gKE1hdGgucmFuZG9tKCkgKiA0IHwgOCkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB1dWlkICs9IChNYXRoLnJhbmRvbSgpICogMTYgfCAwKS50b1N0cmluZygxNilcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHV1aWRcclxufVxyXG5leHBvcnQgZGVmYXVsdCBVSURcclxuIiwiaW1wb3J0IHsgVUlEIH0gZnJvbSAnLi4vVXRpbHMvaW5kZXgnXHJcbmltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4J1xyXG5cclxuY2xhc3MgQmFzZSBleHRlbmRzIEV2ZW50cyB7XHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MsIGNvbmZpZ3VyYXRpb24pIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICAgIHRoaXMuYWRkQ2xhc3NEZWZhdWx0UHJvcGVydGllcygpXHJcbiAgICB0aGlzLmFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKClcclxuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcclxuICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uXHJcbiAgfVxyXG4gIGdldCB1aWQoKSB7XHJcbiAgICB0aGlzLl91aWQgPSAodGhpcy5fdWlkKVxyXG4gICAgPyB0aGlzLl91aWRcclxuICAgIDogVUlEKClcclxuICAgIHJldHVybiB0aGlzLl91aWRcclxuICB9XHJcbiAgZ2V0IF9uYW1lKCkgeyByZXR1cm4gdGhpcy5uYW1lIH1cclxuICBzZXQgX25hbWUobmFtZSkgeyB0aGlzLm5hbWUgPSBuYW1lIH1cclxuICBnZXQgX3NldHRpbmdzKCkge1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3MgfHwge31cclxuICAgIHJldHVybiB0aGlzLnNldHRpbmdzXHJcbiAgfVxyXG4gIHNldCBfc2V0dGluZ3Moc2V0dGluZ3MpIHtcclxuICAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3MgfHwge31cclxuICAgICB0aGlzLmNsYXNzRGVmYXVsdFByb3BlcnRpZXNcclxuICAgICAgIC5mb3JFYWNoKChjbGFzc1NldHRpbmcpID0+IHtcclxuICAgICAgICAgaWYodGhpcy5zZXR0aW5nc1tjbGFzc1NldHRpbmddKSB7XHJcbiAgICAgICAgICAgdGhpc1snXycuY29uY2F0KGNsYXNzU2V0dGluZyldID0gdGhpcy5zZXR0aW5nc1tjbGFzc1NldHRpbmddXHJcbiAgICAgICAgIH1cclxuICAgICAgIH0pXHJcbiAgICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgZ2V0IF9jb25maWd1cmF0aW9uKCkge1xyXG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gdGhpcy5jb25maWd1cmF0aW9uIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uXHJcbiAgfVxyXG4gIHNldCBfY29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSB7IHRoaXMuY29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb24gfVxyXG4gIGdldCBiaW5kYWJsZUNsYXNzUHJvcGVydHlFeHRlbnNpb25zKCkgeyByZXR1cm4gW1xyXG4gICAgJycsXHJcbiAgICAnRXZlbnRzJyxcclxuICAgICdDYWxsYmFja3MnXHJcbiAgXSB9XHJcbiAgZ2V0IF91aUVsZW1lbnRTZXR0aW5ncygpIHtcclxuICAgIHRoaXMudWlFbGVtZW50U2V0dGluZ3MgPSB0aGlzLnVpRWxlbWVudFNldHRpbmdzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy51aUVsZW1lbnRTZXR0aW5nc1xyXG4gIH1cclxuICBzZXQgX3VpRWxlbWVudFNldHRpbmdzKHVpRWxlbWVudFNldHRpbmdzKSB7XHJcbiAgICB0aGlzLnVpRWxlbWVudFNldHRpbmdzID0gdWlFbGVtZW50U2V0dGluZ3NcclxuICB9XHJcbiAgY2FwaXRhbGl6ZVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpIHtcclxuICAgIGlmKHByb3BlcnR5TmFtZS5zbGljZSgwLCAyKSA9PT0gJ3VpJykge1xyXG4gICAgICByZXR1cm4gcHJvcGVydHlOYW1lLnJlcGxhY2UoL151aS8sICdVSScpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgZmlyc3RDaGFyYWN0ZXIgPSBwcm9wZXJ0eU5hbWUuc3Vic3RyaW5nKDApLnRvVXBwZXJDYXNlKClcclxuICAgICAgcmV0dXJuIHByb3BlcnR5TmFtZS5yZXBsYWNlKC9eLi8sIGZpcnN0Q2hhcmFjdGVyKVxyXG4gICAgfVxyXG4gIH1cclxuICBhZGRDbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkge1xyXG4gICAgdGhpcy5jbGFzc0RlZmF1bHRQcm9wZXJ0aWVzXHJcbiAgICAgIC5mb3JFYWNoKChjbGFzc0RlZmF1bHRQcm9wZXJ0eSkgPT4ge1xyXG4gICAgICAgIGlmKHRoaXNbY2xhc3NEZWZhdWx0UHJvcGVydHldKSB7XHJcbiAgICAgICAgICBsZXQgcHJvcGVydHkgPSB0aGlzW2NsYXNzRGVmYXVsdFByb3BlcnR5XVxyXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGNsYXNzRGVmYXVsdFByb3BlcnR5LCB7XHJcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICB2YWx1ZTogcHJvcGVydHlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICB0aGlzWydfJy5jb25jYXQoY2xhc3NEZWZhdWx0UHJvcGVydHkpXSA9IHByb3BlcnR5XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgYWRkQmluZGFibGVDbGFzc1Byb3BlcnRpZXMoKSB7XHJcbiAgICBpZih0aGlzLmJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKSB7XHJcbiAgICAgIHRoaXMuYmluZGFibGVDbGFzc1Byb3BlcnRpZXNcclxuICAgICAgICAuZm9yRWFjaCgoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5iaW5kYWJsZUNsYXNzUHJvcGVydHlFeHRlbnNpb25zXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKChwcm9wZXJ0eU5hbWVFeHRlbnNpb24pID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLmFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eShcclxuICAgICAgICAgICAgICAgIGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUsXHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWVFeHRlbnNpb25cclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eShiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLCBwcm9wZXJ0eU5hbWVFeHRlbnNpb24pIHtcclxuICAgIGxldCBjb250ZXh0ID0gdGhpc1xyXG4gICAgbGV0IHByb3BlcnR5TmFtZSA9IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUuY29uY2F0KCdzJywgcHJvcGVydHlOYW1lRXh0ZW5zaW9uKVxyXG4gICAgbGV0IGNhcGl0YWxpemVQcm9wZXJ0eU5hbWUgPSB0aGlzLmNhcGl0YWxpemVQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lKVxyXG4gICAgbGV0IGFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUgPSAnYWRkJy5jb25jYXQoY2FwaXRhbGl6ZVByb3BlcnR5TmFtZSlcclxuICAgIGxldCByZW1vdmVCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lID0gJ3JlbW92ZScuY29uY2F0KGNhcGl0YWxpemVQcm9wZXJ0eU5hbWUpXHJcbiAgICBpZihwcm9wZXJ0eU5hbWUgPT09ICd1aUVsZW1lbnRzJykge1xyXG4gICAgICBjb250ZXh0Ll91aUVsZW1lbnRTZXR0aW5ncyA9IHRoaXNbcHJvcGVydHlOYW1lXVxyXG4gICAgfVxyXG4gICAgbGV0IGN1cnJlbnRQcm9wZXJ0eVZhbHVlcyA9IHRoaXNbcHJvcGVydHlOYW1lXVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXHJcbiAgICAgIHRoaXMsXHJcbiAgICAgIHtcclxuICAgICAgICBbcHJvcGVydHlOYW1lXToge1xyXG4gICAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgICB2YWx1ZTogY3VycmVudFByb3BlcnR5VmFsdWVzLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgWydfJy5jb25jYXQocHJvcGVydHlOYW1lKV06IHtcclxuICAgICAgICAgIGdldCgpIHtcclxuICAgICAgICAgICAgY29udGV4dFtwcm9wZXJ0eU5hbWVdID0gY29udGV4dFtwcm9wZXJ0eU5hbWVdIHx8IHt9XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0W3Byb3BlcnR5TmFtZV1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzZXQodmFsdWVzKSB7XHJcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHZhbHVlcylcclxuICAgICAgICAgICAgICAuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2gocHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3VpRWxlbWVudHMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuX3VpRWxlbWVudFNldHRpbmdzW2tleV0gPSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChwcm9wZXJ0eU5hbWUpXVtrZXldID0gY29udGV4dC5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0WydfJy5jb25jYXQocHJvcGVydHlOYW1lKV1ba2V5XSA9IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFthZGRCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXToge1xyXG4gICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChwcm9wZXJ0eU5hbWUpXSA9IHtcclxuICAgICAgICAgICAgICAgIFtrZXldOiB2YWx1ZVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICBsZXQgdmFsdWVzID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgICAgICAgY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5TmFtZSldID0gdmFsdWVzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHRcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIFtyZW1vdmVCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXToge1xyXG4gICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgICAgICAgIHN3aXRjaChwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3VpRWxlbWVudHMnOlxyXG4gICAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5TmFtZSldW2tleV1cclxuICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRleHRbJ18nLmNvbmNhdCgndWlFbGVtZW50U2V0dGluZ3MnKV1ba2V5XVxyXG4gICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRleHRbJ18nLmNvbmNhdChwcm9wZXJ0eU5hbWUpXVtrZXldXHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5TmFtZSldKVxyXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBzd2l0Y2gocHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndWlFbGVtZW50cyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5TmFtZSldW2tleV1cclxuICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQoJ3VpRWxlbWVudFNldHRpbmdzJyldW2tleV1cclxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQocHJvcGVydHlOYW1lKV1ba2V5XVxyXG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH1cclxuICAgIClcclxuICAgIGlmKGN1cnJlbnRQcm9wZXJ0eVZhbHVlcykge1xyXG4gICAgICB0aGlzW2FkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdKGN1cnJlbnRQcm9wZXJ0eVZhbHVlcylcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHJlc2V0VGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSB7XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gICAgICAudG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLCAnb2ZmJylcclxuICAgICAgLnRvZ2dsZVRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSwgJ29uJylcclxuICB9XHJcbiAgdG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZCkge1xyXG4gICAgaWYoXHJcbiAgICAgIHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgncycpXSAmJlxyXG4gICAgICB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXSAmJlxyXG4gICAgICB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXVxyXG4gICAgKSB7XHJcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJyldKVxyXG4gICAgICAgIC5mb3JFYWNoKChbY2xhc3NUeXBlRXZlbnREYXRhLCBjbGFzc1R5cGVDYWxsYmFja05hbWVdKSA9PiB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjbGFzc1R5cGVFdmVudERhdGEgPSBjbGFzc1R5cGVFdmVudERhdGEuc3BsaXQoJyAnKVxyXG4gICAgICAgICAgICBsZXQgY2xhc3NUeXBlVGFyZ2V0TmFtZSA9IGNsYXNzVHlwZUV2ZW50RGF0YVswXVxyXG4gICAgICAgICAgICBsZXQgY2xhc3NUeXBlRXZlbnROYW1lID0gY2xhc3NUeXBlRXZlbnREYXRhWzFdXHJcbiAgICAgICAgICAgIGxldCBjbGFzc1R5cGVUYXJnZXQgPSB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ3MnKV1bY2xhc3NUeXBlVGFyZ2V0TmFtZV1cclxuICAgICAgICAgICAgbGV0IGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2tcclxuICAgICAgICAgICAgc3dpdGNoKG1ldGhvZCkge1xyXG4gICAgICAgICAgICAgIGNhc2UgJ29uJzpcclxuICAgICAgICAgICAgICAgIHN3aXRjaChjbGFzc1R5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgY2FzZSAndWlFbGVtZW50JzpcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc1R5cGVFdmVudENhbGxiYWNrID0gdGhpc1tjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKV1bY2xhc3NUeXBlQ2FsbGJhY2tOYW1lXS5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY2xhc3NUeXBlVGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20oY2xhc3NUeXBlVGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaCgoX2NsYXNzVHlwZVRhcmdldCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF9jbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKGNsYXNzVHlwZVRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NUeXBlRXZlbnRDYWxsYmFjayA9IHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJyldW2NsYXNzVHlwZUNhbGxiYWNrTmFtZV1cclxuICAgICAgICAgICAgICAgICAgICBjbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2ssIHRoaXMpXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgY2FzZSAnb2ZmJzpcclxuICAgICAgICAgICAgICAgIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2sgPSB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXVtjbGFzc1R5cGVDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2goY2xhc3NUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3VpRWxlbWVudCc6XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2tOYW1lc3BhY2UgPSBjbGFzc1R5cGVFdmVudENhbGxiYWNrLm5hbWUuc3BsaXQoJyAnKVsxXVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGNsYXNzVHlwZVRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGNsYXNzVHlwZVRhcmdldClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goKF9jbGFzc1R5cGVUYXJnZXQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBfY2xhc3NUeXBlVGFyZ2V0W21ldGhvZF0oY2xhc3NUeXBlRXZlbnROYW1lLCBjbGFzc1R5cGVFdmVudENhbGxiYWNrTmFtZXNwYWNlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihjbGFzc1R5cGVUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NUeXBlVGFyZ2V0W21ldGhvZF0oY2xhc3NUeXBlRXZlbnROYW1lLCBjbGFzc1R5cGVFdmVudENhbGxiYWNrTmFtZXNwYWNlKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaywgdGhpcylcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBjYXRjaChlcnJvcikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXHJcbiAgICAgICAgICAgIGVycm9yXHJcbiAgICAgICAgICApIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQmFzZVxyXG4iLCIvLyBpbXBvcnQgVXRpbHMgZnJvbSAnLi4vVXRpbHMvaW5kZXgnXG5pbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4J1xuXG5jb25zdCBTZXJ2aWNlID0gY2xhc3MgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICAgIHRoaXMuYWRkUHJvcGVydGllcygpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5kZWZhdWx0cyB8fCB7XG4gICAgY29udGVudFR5cGU6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSxcbiAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgfSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlcygpIHsgcmV0dXJuIFsnJywgJ2FycmF5YnVmZmVyJywgJ2Jsb2InLCAnZG9jdW1lbnQnLCAnanNvbicsICd0ZXh0J10gfVxuICBnZXQgX3Jlc3BvbnNlVHlwZSgpIHsgcmV0dXJuIHRoaXMucmVzcG9uc2VUeXBlIH1cbiAgc2V0IF9yZXNwb25zZVR5cGUocmVzcG9uc2VUeXBlKSB7XG4gICAgdGhpcy5feGhyLnJlc3BvbnNlVHlwZSA9IHRoaXMuX3Jlc3BvbnNlVHlwZXMuZmluZChcbiAgICAgIChyZXNwb25zZVR5cGVJdGVtKSA9PiByZXNwb25zZVR5cGVJdGVtID09PSByZXNwb25zZVR5cGVcbiAgICApIHx8IHRoaXMuX2RlZmF1bHRzLnJlc3BvbnNlVHlwZVxuICB9XG4gIGdldCBfdHlwZSgpIHsgcmV0dXJuIHRoaXMudHlwZSB9XG4gIHNldCBfdHlwZSh0eXBlKSB7IHRoaXMudHlwZSA9IHR5cGUgfVxuICBnZXQgX3VybCgpIHsgcmV0dXJuIHRoaXMudXJsIH1cbiAgc2V0IF91cmwodXJsKSB7IHRoaXMudXJsID0gdXJsIH1cbiAgZ2V0IF9oZWFkZXJzKCkgeyByZXR1cm4gdGhpcy5oZWFkZXJzIHx8IFtdIH1cbiAgc2V0IF9oZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLl9oZWFkZXJzLmxlbmd0aCA9IDBcbiAgICBoZWFkZXJzLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgdGhpcy5faGVhZGVycy5wdXNoKGhlYWRlcilcbiAgICAgIGhlYWRlciA9IE9iamVjdC5lbnRyaWVzKGhlYWRlcilbMF1cbiAgICAgIHRoaXMuX3hoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgIH0pXG4gIH1cbiAgZ2V0IF9kYXRhKCkgeyByZXR1cm4gdGhpcy5kYXRhIH1cbiAgc2V0IF9kYXRhKGRhdGEpIHsgdGhpcy5kYXRhID0gZGF0YSB9XG4gIGdldCBfeGhyKCkge1xuICAgIHRoaXMueGhyID0gKHRoaXMueGhyKVxuICAgICAgPyB0aGlzLnhoclxuICAgICAgOiBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHJldHVybiB0aGlzLnhoclxuICB9XG4gIHJlcXVlc3QoKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5kYXRhIHx8IG51bGxcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYodGhpcy5feGhyLnN0YXR1cyA9PT0gMjAwKSB0aGlzLl94aHIuYWJvcnQoKVxuICAgICAgdGhpcy5feGhyLm9wZW4odGhpcy50eXBlLCB0aGlzLnVybClcbiAgICAgIHRoaXMuX2hlYWRlcnMgPSB0aGlzLnNldHRpbmdzLmhlYWRlcnMgfHwgW3RoaXMuX2RlZmF1bHRzLmNvbnRlbnRUeXBlXVxuICAgICAgdGhpcy5feGhyLm9ubG9hZCA9IHJlc29sdmVcbiAgICAgIHRoaXMuX3hoci5vbmVycm9yID0gcmVqZWN0XG4gICAgICB0aGlzLl94aHIuc2VuZChkYXRhKVxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICB0aGlzLmVtaXQoXG4gICAgICAgICd4aHI6cmVzb2x2ZScsIHtcbiAgICAgICAgICBuYW1lOiAneGhyOnJlc29sdmUnLFxuICAgICAgICAgIGRhdGE6IHJlc3BvbnNlLmN1cnJlbnRUYXJnZXQsXG4gICAgICAgIH0sXG4gICAgICAgIHRoaXNcbiAgICAgIClcbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH0pLmNhdGNoKChlcnJvcikgPT4geyB0aHJvdyBlcnJvciB9KVxuICB9XG4gIGVuYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICBPYmplY3Qua2V5cyhzZXR0aW5ncykubGVuZ3RoXG4gICAgKSB7XG4gICAgICBpZihzZXR0aW5ncy50eXBlKSB0aGlzLl90eXBlID0gc2V0dGluZ3MudHlwZVxuICAgICAgaWYoc2V0dGluZ3MudXJsKSB0aGlzLl91cmwgPSBzZXR0aW5ncy51cmxcbiAgICAgIGlmKHNldHRpbmdzLmRhdGEpIHRoaXMuX2RhdGEgPSBzZXR0aW5ncy5kYXRhIHx8IG51bGxcbiAgICAgIGlmKHRoaXMuc2V0dGluZ3MucmVzcG9uc2VUeXBlKSB0aGlzLl9yZXNwb25zZVR5cGUgPSB0aGlzLl9zZXR0aW5ncy5yZXNwb25zZVR5cGVcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIE9iamVjdC5rZXlzKHNldHRpbmdzKS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl90eXBlXG4gICAgICBkZWxldGUgdGhpcy5fdXJsXG4gICAgICBkZWxldGUgdGhpcy5fZGF0YVxuICAgICAgZGVsZXRlIHRoaXMuX2hlYWRlcnNcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZVR5cGVcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgU2VydmljZVxuIiwiaW1wb3J0IEJhc2UgZnJvbSAnLi4vQmFzZS9pbmRleCdcblxuY29uc3QgTW9kZWwgPSBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gICAgdGhpcy5hZGRQcm9wZXJ0aWVzKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGdldCBiaW5kYWJsZUNsYXNzUHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAnZGF0YScsXG4gICAgJ3NlcnZpY2VzJ1xuICBdIH1cbiAgZ2V0IGNsYXNzRGVmYXVsdFByb3BlcnRpZXMoKSB7IHJldHVybiBbXG4gICAgJ25hbWUnLFxuICAgICdzY2hlbWEnLFxuICAgICdsb2NhbFN0b3JhZ2UnLFxuICAgICdoaXN0aW9ncmFtJyxcbiAgICAnc2VydmljZXMnLFxuICAgICdzZXJ2aWNlQ2FsbGJhY2tzJyxcbiAgICAnc2VydmljZUV2ZW50cycsXG4gICAgJ2RhdGEnLFxuICAgICdkYXRhQ2FsbGJhY2tzJyxcbiAgICAnZGF0YUV2ZW50cycsXG4gICAgJ2RlZmF1bHRzJ1xuICBdIH1cbiAgZ2V0IF9zY2hlbWEoKSB7IHJldHVybiB0aGlzLl9zY2hlbWEgfVxuICBzZXQgX3NjaGVtYShzY2hlbWEpIHsgdGhpcy5zY2hlbWEgPSBzY2hlbWEgfVxuICBnZXQgX2lzU2V0dGluZygpIHsgcmV0dXJuIHRoaXMuaXNTZXR0aW5nIH1cbiAgc2V0IF9pc1NldHRpbmcoaXNTZXR0aW5nKSB7IHRoaXMuaXNTZXR0aW5nID0gaXNTZXR0aW5nIH1cbiAgZ2V0IF9jaGFuZ2luZygpIHtcbiAgICB0aGlzLmNoYW5naW5nID0gdGhpcy5jaGFuZ2luZyB8fCB7fVxuICAgIHJldHVybiB0aGlzLmNoYW5naW5nXG4gIH1cbiAgZ2V0IF9sb2NhbFN0b3JhZ2UoKSB7IHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZSB9XG4gIHNldCBfbG9jYWxTdG9yYWdlKGxvY2FsU3RvcmFnZSkgeyB0aGlzLmxvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XG4gIGdldCBfZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLmRlZmF1bHRzIH1cbiAgc2V0IF9kZWZhdWx0cyhkZWZhdWx0cykgeyB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHMgfVxuICBnZXQgX2hpc3Rpb2dyYW0oKSB7IHJldHVybiB0aGlzLmhpc3Rpb2dyYW0gfHwge1xuICAgIGxlbmd0aDogMVxuICB9IH1cbiAgc2V0IF9oaXN0aW9ncmFtKGhpc3Rpb2dyYW0pIHtcbiAgICB0aGlzLmhpc3Rpb2dyYW0gPSBPYmplY3QuYXNzaWduKFxuICAgICAgdGhpcy5faGlzdGlvZ3JhbSxcbiAgICAgIGhpc3Rpb2dyYW1cbiAgICApXG4gIH1cbiAgZ2V0IF9oaXN0b3J5KCkge1xuICAgIHRoaXMuaGlzdG9yeSA9IHRoaXMuaGlzdG9yeSB8fCBbXVxuICAgIHJldHVybiB0aGlzLmhpc3RvcnlcbiAgfVxuICBzZXQgX2hpc3RvcnkoZGF0YSkge1xuICAgIGlmKFxuICAgICAgT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoXG4gICAgKSB7XG4gICAgICBpZih0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVuc2hpZnQodGhpcy5wYXJzZShkYXRhKSlcbiAgICAgICAgdGhpcy5faGlzdG9yeS5zcGxpY2UodGhpcy5faGlzdGlvZ3JhbS5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfZGIoKSB7XG4gICAgbGV0IGRiID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpXG4gICAgdGhpcy5kYiA9IGRiIHx8ICd7fSdcbiAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLmRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICBnZXQoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtrZXldXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdGhpcy5faXNTZXR0aW5nID0gdHJ1ZVxuICAgICAgICBsZXQgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYoaW5kZXggPT09IChfYXJndW1lbnRzLmxlbmd0aCAtIDEpKSB0aGlzLl9pc1NldHRpbmcgPSBmYWxzZVxuICAgICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpKSB7XG4gICAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREQigpIHtcbiAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHZhciBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGxldCB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgdGhpcy5fZGIgPSBkYlxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXREQigpIHtcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBkZWxldGUgdGhpcy5fZGJcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBkZWxldGUgZGJba2V5XVxuICAgICAgICB0aGlzLl9kYiA9IGRiXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpIHtcbiAgICBpZighdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldKSB7XG4gICAgICBsZXQgY29udGV4dCA9IHRoaXNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgICAgICB0aGlzLl9kYXRhLFxuICAgICAgICB7XG4gICAgICAgICAgWydfJy5jb25jYXQoa2V5KV06IHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNba2V5XSB9LFxuICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgIGxldCBzY2hlbWEgPSBjb250ZXh0Ll9zZXR0aW5ncy5zY2hlbWFcbiAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgc2NoZW1hICYmXG4gICAgICAgICAgICAgICAgc2NoZW1hW2tleV1cbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpc1trZXldID0gdmFsdWVcbiAgICAgICAgICAgICAgICBjb250ZXh0Ll9jaGFuZ2luZ1trZXldID0gdmFsdWVcbiAgICAgICAgICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgY29udGV4dC5zZXREQihrZXksIHZhbHVlKVxuICAgICAgICAgICAgICB9IGVsc2UgaWYoIXNjaGVtYSkge1xuICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgY29udGV4dC5fY2hhbmdpbmdba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIGNvbnRleHQuc2V0REIoa2V5LCB2YWx1ZSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBsZXQgc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3NldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgICAgICAgICAgICBsZXQgc2V0RXZlbnROYW1lID0gJ3NldCdcbiAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgIHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICBpZighY29udGV4dC5faXNTZXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgaWYoIU9iamVjdC52YWx1ZXMoY29udGV4dC5fY2hhbmdpbmcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgICAgICBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgZGF0YTogY29udGV4dC5fZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgICAgICAgICAge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0Ll9jaGFuZ2luZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuX2RhdGFcbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0LmNoYW5naW5nXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gICAgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldID0gdmFsdWVcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0RGF0YVByb3BlcnR5KGtleSkge1xuICAgIGxldCB1bnNldFZhbHVlRXZlbnROYW1lID0gWyd1bnNldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgIGxldCB1bnNldEV2ZW50TmFtZSA9ICd1bnNldCdcbiAgICBsZXQgdW5zZXRWYWx1ZSA9IHRoaXMuX2RhdGFba2V5XVxuICAgIGRlbGV0ZSB0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV1cbiAgICBkZWxldGUgdGhpcy5fZGF0YVtrZXldXG4gICAgdGhpcy5lbWl0KFxuICAgICAgdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiB1bnNldFZhbHVlLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdGhpc1xuICAgIClcbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldEV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRoaXNcbiAgICApXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREZWZhdWx0cygpIHtcbiAgICBsZXQgX2RlZmF1bHRzID0ge31cbiAgICBpZih0aGlzLmRlZmF1bHRzKSBPYmplY3QuYXNzaWduKF9kZWZhdWx0cywgdGhpcy5kZWZhdWx0cylcbiAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgT2JqZWN0LmFzc2lnbihfZGVmYXVsdHMsIHRoaXMuX2RiKVxuICAgIGlmKE9iamVjdC5rZXlzKF9kZWZhdWx0cykpIHRoaXMuc2V0KF9kZWZhdWx0cylcbiAgfVxuICBwYXJzZShkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5fZGF0YSB8fCB7fVxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vZGVsXG4iLCJpbXBvcnQgeyB0eXBlT2YgfSBmcm9tICcuLi9VdGlscy9pbmRleCdcbmltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNsYXNzIFZpZXcgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBiaW5kYWJsZUNsYXNzUHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAndWlFbGVtZW50J1xuICBdIH1cbiAgZ2V0IGNsYXNzRGVmYXVsdFByb3BlcnRpZXMoKSB7IHJldHVybiBbXG4gICAgJ2VsZW1lbnROYW1lJyxcbiAgICAnZWxlbWVudCcsXG4gICAgJ2F0dHJpYnV0ZXMnLFxuICAgICd0ZW1wbGF0ZXMnLFxuICAgICdpbnNlcnQnXG4gIF0gfVxuICBnZXQgX2VsZW1lbnROYW1lKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudC50YWdOYW1lIH1cbiAgc2V0IF9lbGVtZW50TmFtZShlbGVtZW50TmFtZSkge1xuICAgIGlmKCF0aGlzLl9lbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50TmFtZSlcbiAgfVxuICBnZXQgX2VsZW1lbnQoKSB7IHJldHVybiB0aGlzLmVsZW1lbnQgfVxuICBzZXQgX2VsZW1lbnQoZWxlbWVudCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICB0aGlzLmVsZW1lbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudCwge1xuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICB9KVxuICB9XG4gIGdldCBfYXR0cmlidXRlcygpIHtcbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSB0aGlzLmVsZW1lbnQuYXR0cmlidXRlc1xuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNcbiAgfVxuICBzZXQgX2F0dHJpYnV0ZXMoYXR0cmlidXRlcykge1xuICAgIGZvcihsZXQgW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpKSB7XG4gICAgICBpZih0eXBlb2YgYXR0cmlidXRlVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZUtleSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBlbGVtZW50T2JzZXJ2ZXIoKSB7XG4gICAgdGhpcy5fZWxlbWVudE9ic2VydmVyID0gdGhpcy5fZWxlbWVudE9ic2VydmVyIHx8IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuICAgICAgdGhpcy5lbGVtZW50T2JzZXJ2ZS5iaW5kKHRoaXMpXG4gICAgKVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgfVxuICBnZXQgX2luc2VydCgpIHtcbiAgICB0aGlzLmluc2VydCA9IHRoaXMuaW5zZXJ0IHx8IG51bGxcbiAgICByZXR1cm4gdGhpcy5pbnNlcnRcbiAgfVxuICBzZXQgX2luc2VydChpbnNlcnQpIHsgdGhpcy5pbnNlcnQgPSBpbnNlcnQgfVxuICBnZXQgX3RlbXBsYXRlcygpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IHRoaXMudGVtcGxhdGVzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGVzXG4gIH1cbiAgc2V0IF90ZW1wbGF0ZXModGVtcGxhdGVzKSB7IHRoaXMudGVtcGxhdGVzID0gdGVtcGxhdGVzIH1cbiAgcmVzZXRVSUVsZW1lbnRzKCkge1xuICAgIGxldCB1aUVsZW1lbnRTZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7fSxcbiAgICAgIHRoaXMuX3VpRWxlbWVudFNldHRpbmdzXG4gICAgKVxuICAgIHRoaXMudG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cygndWlFbGVtZW50JywgJ29mZicpXG4gICAgdGhpcy5yZW1vdmVVSUVsZW1lbnRzKClcbiAgICB0aGlzLmFkZFVJRWxlbWVudHModWlFbGVtZW50U2V0dGluZ3MpXG4gICAgdGhpcy50b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKCd1aUVsZW1lbnQnLCAnb24nKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZWxlbWVudE9ic2VydmUobXV0YXRpb25SZWNvcmRMaXN0LCBvYnNlcnZlcikge1xuICAgIGZvcihsZXQgW211dGF0aW9uUmVjb3JkSW5kZXgsIG11dGF0aW9uUmVjb3JkXSBvZiBPYmplY3QuZW50cmllcyhtdXRhdGlvblJlY29yZExpc3QpKSB7XG4gICAgICBzd2l0Y2gobXV0YXRpb25SZWNvcmQudHlwZSkge1xuICAgICAgICBjYXNlICdjaGlsZExpc3QnOlxuICAgICAgICAgIGxldCBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMgPSBbJ2FkZGVkTm9kZXMnLCAncmVtb3ZlZE5vZGVzJ11cbiAgICAgICAgICB0aGlzLnJlc2V0VUlFbGVtZW50cygpXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYXV0b0luc2VydCgpIHtcbiAgICBpZih0aGlzLmluc2VydCkge1xuICAgICAgbGV0IHBhcmVudEVsZW1lbnRcbiAgICAgIGlmKHR5cGVPZih0aGlzLmluc2VydC5lbGVtZW50KSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcGFyZW50RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5pbnNlcnQuZWxlbWVudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmVudEVsZW1lbnQgPSB0aGlzLmluc2VydC5lbGVtZW50XG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgcGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICAgIHBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlXG4gICAgICApIHtcbiAgICAgICAgcGFyZW50RWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQodGhpcy5pbnNlcnQubWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgICB9IGVsc2UgaWYocGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XG4gICAgICAgIHBhcmVudEVsZW1lbnRcbiAgICAgICAgICAuZm9yRWFjaCgoX3BhcmVudEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIF9wYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCh0aGlzLmluc2VydC5tZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmKHBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiBqUXVlcnkpIHtcbiAgICAgICAgcGFyZW50RWxlbWVudFxuICAgICAgICAgIC5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgZWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQodGhpcy5pbnNlcnQubWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdXRvUmVtb3ZlKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5lbGVtZW50ICYmXG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICkgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFZpZXdcbiIsImltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNvbnN0IENvbnRyb2xsZXIgPSBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gICAgdGhpcy5hZGRQcm9wZXJ0aWVzKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGdldCBiaW5kYWJsZUNsYXNzUHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAnbW9kZWwnLFxuICAgICd2aWV3JyxcbiAgICAnY29udHJvbGxlcicsXG4gICAgJ3JvdXRlcidcbiAgXSB9XG4gIGdldCBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICdtb2RlbHMnLFxuICAgICdtb2RlbEV2ZW50cycsXG4gICAgJ21vZGVsQ2FsbGJhY2tzJyxcbiAgICAndmlld3MnLFxuICAgICd2aWV3RXZlbnRzJyxcbiAgICAndmlld0NhbGxiYWNrcycsXG4gICAgJ2NvbnRyb2xsZXJzJyxcbiAgICAnY29udHJvbGxlckV2ZW50cycsXG4gICAgJ2NvbnRyb2xsZXJDYWxsYmFja3MnLFxuICAgICdyb3V0ZXJzJyxcbiAgICAncm91dGVyRXZlbnRzJyxcbiAgICAncm91dGVyQ2FsbGJhY2tzJyxcbiAgXSB9XG59XG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyXG4iLCJpbXBvcnQgeyBwYXJhbXNUb09iamVjdCB9IGZyb20gJy4uL1V0aWxzL2luZGV4J1xuaW1wb3J0IEJhc2UgZnJvbSAnLi4vQmFzZS9pbmRleCdcblxuY29uc3QgUm91dGVyID0gY2xhc3MgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZ2V0IHByb3RvY29sKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnByb3RvY29sIH1cbiAgZ2V0IGhvc3RuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lIH1cbiAgZ2V0IHBvcnQoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucG9ydCB9XG4gIGdldCBwYXRoKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIH1cbiAgZ2V0IGhhc2goKSB7XG4gICAgbGV0IGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgIGxldCBoYXNoSW5kZXggPSBocmVmLmluZGV4T2YoJyMnKVxuICAgIGlmKGhhc2hJbmRleCA+IC0xKSB7XG4gICAgICBsZXQgcGFyYW1JbmRleCA9IGhyZWYuaW5kZXhPZignPycpXG4gICAgICBsZXQgc2xpY2VTdGFydCA9IGhhc2hJbmRleCArIDFcbiAgICAgIGxldCBzbGljZVN0b3BcbiAgICAgIGlmKHBhcmFtSW5kZXggPiAtMSkge1xuICAgICAgICBzbGljZVN0b3AgPSAoaGFzaEluZGV4ID4gcGFyYW1JbmRleClcbiAgICAgICAgICA/IGhyZWYubGVuZ3RoXG4gICAgICAgICAgOiBwYXJhbUluZGV4XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzbGljZVN0b3AgPSBocmVmLmxlbmd0aFxuICAgICAgfVxuICAgICAgaHJlZiA9IGhyZWYuc2xpY2Uoc2xpY2VTdGFydCwgc2xpY2VTdG9wKVxuICAgICAgaWYoaHJlZi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGhyZWZcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG4gIGdldCBwYXJhbXMoKSB7XG4gICAgbGV0IGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgIGxldCBwYXJhbUluZGV4ID0gaHJlZi5pbmRleE9mKCc/JylcbiAgICBpZihwYXJhbUluZGV4ID4gLTEpIHtcbiAgICAgIGxldCBoYXNoSW5kZXggPSBocmVmLmluZGV4T2YoJyMnKVxuICAgICAgbGV0IHNsaWNlU3RhcnQgPSBwYXJhbUluZGV4ICsgMVxuICAgICAgbGV0IHNsaWNlU3RvcFxuICAgICAgaWYoaGFzaEluZGV4ID4gLTEpIHtcbiAgICAgICAgc2xpY2VTdG9wID0gKHBhcmFtSW5kZXggPiBoYXNoSW5kZXgpXG4gICAgICAgICAgPyBocmVmLmxlbmd0aFxuICAgICAgICAgIDogaGFzaEluZGV4XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzbGljZVN0b3AgPSBocmVmLmxlbmd0aFxuICAgICAgfVxuICAgICAgaHJlZiA9IGhyZWYuc2xpY2Uoc2xpY2VTdGFydCwgc2xpY2VTdG9wKVxuICAgICAgaWYoaHJlZi5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGhyZWZcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG4gIGdldCBfcm91dGVEYXRhKCkge1xuICAgIGxldCByb3V0ZURhdGEgPSB7XG4gICAgICBsb2NhdGlvbjoge30sXG4gICAgICBjb250cm9sbGVyOiB7fSxcbiAgICB9XG4gICAgbGV0IHBhdGggPSB0aGlzLnBhdGguc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgcGF0aCA9IChwYXRoLmxlbmd0aClcbiAgICAgID8gcGF0aFxuICAgICAgOiBbJy8nXVxuICAgIGxldCBoYXNoID0gdGhpcy5oYXNoXG4gICAgbGV0IGhhc2hGcmFnbWVudHMgPSAoaGFzaClcbiAgICAgID8gaGFzaC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgIDogbnVsbFxuICAgIGxldCBwYXJhbXMgPSB0aGlzLnBhcmFtc1xuICAgIGxldCBwYXJhbURhdGEgPSAocGFyYW1zKVxuICAgICAgPyBwYXJhbXNUb09iamVjdChwYXJhbXMpXG4gICAgICA6IG51bGxcbiAgICBpZih0aGlzLnByb3RvY29sKSByb3V0ZURhdGEubG9jYXRpb24ucHJvdG9jb2wgPSB0aGlzLnByb3RvY29sXG4gICAgaWYodGhpcy5ob3N0bmFtZSkgcm91dGVEYXRhLmxvY2F0aW9uLmhvc3RuYW1lID0gdGhpcy5ob3N0bmFtZVxuICAgIGlmKHRoaXMucG9ydCkgcm91dGVEYXRhLmxvY2F0aW9uLnBvcnQgPSB0aGlzLnBvcnRcbiAgICBpZih0aGlzLnBhdGgpIHJvdXRlRGF0YS5sb2NhdGlvbi5wYXRoID0gdGhpcy5wYXRoXG4gICAgaWYoXG4gICAgICBoYXNoICYmXG4gICAgICBoYXNoRnJhZ21lbnRzXG4gICAgKSB7XG4gICAgICBoYXNoRnJhZ21lbnRzID0gKGhhc2hGcmFnbWVudHMubGVuZ3RoKVxuICAgICAgICA/IGhhc2hGcmFnbWVudHNcbiAgICAgICAgOiBbJy8nXVxuICAgICAgcm91dGVEYXRhLmxvY2F0aW9uLmhhc2ggPSB7XG4gICAgICAgIHBhdGg6IGhhc2gsXG4gICAgICAgIGZyYWdtZW50czogaGFzaEZyYWdtZW50cyxcbiAgICAgIH1cbiAgICB9XG4gICAgaWYoXG4gICAgICBwYXJhbXMgJiZcbiAgICAgIHBhcmFtRGF0YVxuICAgICkge1xuICAgICAgcm91dGVEYXRhLmxvY2F0aW9uLnBhcmFtcyA9IHtcbiAgICAgICAgcGF0aDogcGFyYW1zLFxuICAgICAgICBkYXRhOiBwYXJhbURhdGEsXG4gICAgICB9XG4gICAgfVxuICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5wYXRoID0ge1xuICAgICAgbmFtZTogdGhpcy5wYXRoLFxuICAgICAgZnJhZ21lbnRzOiBwYXRoLFxuICAgIH1cbiAgICByb3V0ZURhdGEubG9jYXRpb24uY3VycmVudFVSTCA9IHRoaXMuY3VycmVudFVSTFxuICAgIGxldCByb3V0ZUNvbnRyb2xsZXJEYXRhID0gdGhpcy5fcm91dGVDb250cm9sbGVyRGF0YVxuICAgIHJvdXRlRGF0YS5sb2NhdGlvbiA9IE9iamVjdC5hc3NpZ24oXG4gICAgICByb3V0ZURhdGEubG9jYXRpb24sXG4gICAgICByb3V0ZUNvbnRyb2xsZXJEYXRhLmxvY2F0aW9uXG4gICAgKVxuICAgIHJvdXRlRGF0YS5jb250cm9sbGVyID0gcm91dGVDb250cm9sbGVyRGF0YS5jb250cm9sbGVyXG4gICAgdGhpcy5yb3V0ZURhdGEgPSByb3V0ZURhdGFcbiAgICByZXR1cm4gdGhpcy5yb3V0ZURhdGFcbiAgfVxuICBnZXQgX3JvdXRlQ29udHJvbGxlckRhdGEoKSB7XG4gICAgbGV0IHJvdXRlRGF0YSA9IHtcbiAgICAgIGxvY2F0aW9uOiB7fSxcbiAgICB9XG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5yb3V0ZXMpXG4gICAgICAuZm9yRWFjaCgoW3JvdXRlUGF0aCwgcm91dGVTZXR0aW5nc10pID0+IHtcbiAgICAgICAgbGV0IHBhdGhGcmFnbWVudHMgPSB0aGlzLnBhdGguc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgICAgIHBhdGhGcmFnbWVudHMgPSAocGF0aEZyYWdtZW50cy5sZW5ndGgpXG4gICAgICAgICAgPyBwYXRoRnJhZ21lbnRzXG4gICAgICAgICAgOiBbJy8nXVxuICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSByb3V0ZVBhdGguc3BsaXQoJy8nKS5maWx0ZXIoKGZyYWdtZW50LCBmcmFnbWVudEluZGV4KSA9PiBmcmFnbWVudC5sZW5ndGgpXG4gICAgICAgIHJvdXRlRnJhZ21lbnRzID0gKHJvdXRlRnJhZ21lbnRzLmxlbmd0aClcbiAgICAgICAgICA/IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgICAgOiBbJy8nXVxuICAgICAgICBpZihcbiAgICAgICAgICBwYXRoRnJhZ21lbnRzLmxlbmd0aCAmJlxuICAgICAgICAgIHBhdGhGcmFnbWVudHMubGVuZ3RoID09PSByb3V0ZUZyYWdtZW50cy5sZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgbGV0IG1hdGNoXG4gICAgICAgICAgcmV0dXJuIHJvdXRlRnJhZ21lbnRzLmZpbHRlcigocm91dGVGcmFnbWVudCwgcm91dGVGcmFnbWVudEluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgbWF0Y2ggPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICBtYXRjaCA9PT0gdHJ1ZVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGlmKHJvdXRlRnJhZ21lbnRbMF0gPT09ICc6Jykge1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50SURLZXkgPSByb3V0ZUZyYWdtZW50LnJlcGxhY2UoJzonLCAnJylcbiAgICAgICAgICAgICAgICBpZihcbiAgICAgICAgICAgICAgICAgIHJvdXRlRnJhZ21lbnRJbmRleCA9PT0gcGF0aEZyYWdtZW50cy5sZW5ndGggLSAxXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICByb3V0ZURhdGEubG9jYXRpb24uY3VycmVudElES2V5ID0gY3VycmVudElES2V5XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbltjdXJyZW50SURLZXldID0gcGF0aEZyYWdtZW50c1tyb3V0ZUZyYWdtZW50SW5kZXhdXG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudCA9IHRoaXMuZnJhZ21lbnRJRFJlZ0V4cFxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJvdXRlRnJhZ21lbnQgPSByb3V0ZUZyYWdtZW50LnJlcGxhY2UobmV3IFJlZ0V4cCgnLycsICdnaScpLCAnXFxcXFxcLycpXG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudCA9IHRoaXMucm91dGVGcmFnbWVudE5hbWVSZWdFeHAocm91dGVGcmFnbWVudClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBtYXRjaCA9IHJvdXRlRnJhZ21lbnQudGVzdChwYXRoRnJhZ21lbnRzW3JvdXRlRnJhZ21lbnRJbmRleF0pXG4gICAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICAgIG1hdGNoID09PSB0cnVlICYmXG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudEluZGV4ID09PSBwYXRoRnJhZ21lbnRzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcm91dGVEYXRhLmxvY2F0aW9uLnJvdXRlID0ge1xuICAgICAgICAgICAgICAgICAgbmFtZTogcm91dGVQYXRoLFxuICAgICAgICAgICAgICAgICAgZnJhZ21lbnRzOiByb3V0ZUZyYWdtZW50cyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcm91dGVEYXRhLmNvbnRyb2xsZXIgPSByb3V0ZVNldHRpbmdzXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pWzBdXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgcmV0dXJuIHJvdXRlRGF0YVxuICB9XG4gIGdldCBfcm91dGVzKCkge1xuICAgIHRoaXMucm91dGVzID0gdGhpcy5yb3V0ZXMgfHwge31cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXNcbiAgfVxuICBzZXQgX3JvdXRlcyhyb3V0ZXMpIHtcbiAgICB0aGlzLnJvdXRlcyA9IHJvdXRlc1xuICB9XG4gIGdldCBfY29udHJvbGxlcigpIHsgcmV0dXJuIHRoaXMuY29udHJvbGxlciB9XG4gIHNldCBfY29udHJvbGxlcihjb250cm9sbGVyKSB7IHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXIgfVxuICBnZXQgX3ByZXZpb3VzVVJMKCkgeyByZXR1cm4gdGhpcy5wcmV2aW91c1VSTCB9XG4gIHNldCBfcHJldmlvdXNVUkwocHJldmlvdXNVUkwpIHsgdGhpcy5wcmV2aW91c1VSTCA9IHByZXZpb3VzVVJMIH1cbiAgZ2V0IF9jdXJyZW50VVJMKCkgeyByZXR1cm4gdGhpcy5jdXJyZW50VVJMIH1cbiAgc2V0IF9jdXJyZW50VVJMKGN1cnJlbnRVUkwpIHtcbiAgICBpZih0aGlzLmN1cnJlbnRVUkwpIHRoaXMuX3ByZXZpb3VzVVJMID0gdGhpcy5jdXJyZW50VVJMXG4gICAgdGhpcy5jdXJyZW50VVJMID0gY3VycmVudFVSTFxuICB9XG4gIGdldCBmcmFnbWVudElEUmVnRXhwKCkgeyByZXR1cm4gbmV3IFJlZ0V4cCgvXihbMC05QS1aXFw/XFw9XFwsXFwuXFwqXFwtXFxfXFwnXFxcIlxcXlxcJVxcJFxcI1xcQFxcIVxcflxcKFxcKVxce1xcfVxcJlxcPFxcPlxcXFxcXC9dKSokLywgJ2dpJykgfVxuICByb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cChmcmFnbWVudCkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKCdeJy5jb25jYXQoZnJhZ21lbnQsICckJykpXG4gIH1cbiAgZW5hYmxlUm91dGVzKCkge1xuICAgIGlmKHRoaXMuc2V0dGluZ3MuY29udHJvbGxlcikgdGhpcy5fY29udHJvbGxlciA9IHRoaXMuc2V0dGluZ3MuY29udHJvbGxlclxuICAgIHRoaXMuX3JvdXRlcyA9IE9iamVjdC5lbnRyaWVzKHRoaXMuc2V0dGluZ3Mucm91dGVzKS5yZWR1Y2UoXG4gICAgICAoXG4gICAgICAgIF9yb3V0ZXMsXG4gICAgICAgIFtyb3V0ZVBhdGgsIHJvdXRlU2V0dGluZ3NdLFxuICAgICAgICByb3V0ZUluZGV4LFxuICAgICAgICBvcmlnaW5hbFJvdXRlcyxcbiAgICAgICkgPT4ge1xuICAgICAgICBfcm91dGVzW3JvdXRlUGF0aF0gPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHJvdXRlU2V0dGluZ3MsXG4gICAgICAgICAge1xuICAgICAgICAgICAgY2FsbGJhY2s6IHRoaXMuY29udHJvbGxlcltyb3V0ZVNldHRpbmdzLmNhbGxiYWNrXS5iaW5kKHRoaXMuY29udHJvbGxlciksXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICAgIHJldHVybiBfcm91dGVzXG4gICAgICB9LFxuICAgICAge31cbiAgICApXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBlbmFibGVSb3V0ZUV2ZW50cygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMucm91dGVDaGFuZ2UuYmluZCh0aGlzKSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGVSb3V0ZUV2ZW50cygpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMucm91dGVDaGFuZ2UuYmluZCh0aGlzKSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHJvdXRlQ2hhbmdlKCkge1xuICAgIHRoaXMuX2N1cnJlbnRVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgIGxldCByb3V0ZURhdGEgPSB0aGlzLl9yb3V0ZURhdGFcbiAgICBpZihyb3V0ZURhdGEuY29udHJvbGxlcikge1xuICAgICAgaWYodGhpcy5wcmV2aW91c1VSTCkgcm91dGVEYXRhLnByZXZpb3VzVVJMID0gdGhpcy5wcmV2aW91c1VSTFxuICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAnbmF2aWdhdGUnLFxuICAgICAgICByb3V0ZURhdGFcbiAgICAgIClcbiAgICAgIHJvdXRlRGF0YS5jb250cm9sbGVyLmNhbGxiYWNrKHJvdXRlRGF0YSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBuYXZpZ2F0ZShwYXRoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFJvdXRlclxuIiwiaW1wb3J0ICcuL1NoaW1zL2V2ZW50cydcbmltcG9ydCBFdmVudHMgZnJvbSAnLi9FdmVudHMvaW5kZXgnXG5pbXBvcnQgQ2hhbm5lbHMgZnJvbSAnLi9DaGFubmVscy9pbmRleCdcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vVXRpbHMvaW5kZXgnXG5pbXBvcnQgU2VydmljZSBmcm9tICcuL1NlcnZpY2UvaW5kZXgnXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi9Nb2RlbC9pbmRleCdcbmltcG9ydCBWaWV3IGZyb20gJy4vVmlldy9pbmRleCdcbmltcG9ydCBDb250cm9sbGVyIGZyb20gJy4vQ29udHJvbGxlci9pbmRleCdcbmltcG9ydCBSb3V0ZXIgZnJvbSAnLi9Sb3V0ZXIvaW5kZXgnXG5jb25zdCBNVkMgPSB7XG4gICQsXG4gIEV2ZW50cyxcbiAgQ2hhbm5lbHMsXG4gIFV0aWxzLFxuICBTZXJ2aWNlLFxuICBNb2RlbCxcbiAgVmlldyxcbiAgQ29udHJvbGxlcixcbiAgUm91dGVyLFxufVxuZXhwb3J0IGRlZmF1bHQgTVZDXG4iXSwibmFtZXMiOlsiRXZlbnRUYXJnZXQiLCJwcm90b3R5cGUiLCJvbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJvZmYiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiRXZlbnRzIiwiY29uc3RydWN0b3IiLCJfZXZlbnRzIiwiZXZlbnRzIiwiZ2V0RXZlbnRDYWxsYmFja3MiLCJldmVudE5hbWUiLCJnZXRFdmVudENhbGxiYWNrTmFtZSIsImV2ZW50Q2FsbGJhY2siLCJuYW1lIiwibGVuZ3RoIiwiZ2V0RXZlbnRDYWxsYmFja0dyb3VwIiwiZXZlbnRDYWxsYmFja3MiLCJldmVudENhbGxiYWNrTmFtZSIsImV2ZW50Q2FsbGJhY2tHcm91cCIsInB1c2giLCJhcmd1bWVudHMiLCJPYmplY3QiLCJrZXlzIiwiZW1pdCIsImV2ZW50RGF0YSIsIl9hcmd1bWVudHMiLCJ2YWx1ZXMiLCJlbnRyaWVzIiwiZXZlbnRDYWxsYmFja0dyb3VwTmFtZSIsImFkZGl0aW9uYWxBcmd1bWVudHMiLCJzcGxpY2UiLCJDaGFubmVsIiwiX3Jlc3BvbnNlcyIsInJlc3BvbnNlcyIsInJlc3BvbnNlIiwicmVzcG9uc2VOYW1lIiwicmVzcG9uc2VDYWxsYmFjayIsInJlcXVlc3QiLCJBcnJheSIsInNsaWNlIiwiY2FsbCIsIkNoYW5uZWxzIiwiX2NoYW5uZWxzIiwiY2hhbm5lbHMiLCJjaGFubmVsIiwiY2hhbm5lbE5hbWUiLCJwYXJhbXNUb09iamVjdCIsInBhcmFtcyIsInNwbGl0Iiwib2JqZWN0IiwiZm9yRWFjaCIsInBhcmFtRGF0YSIsImRlY29kZVVSSUNvbXBvbmVudCIsIkpTT04iLCJwYXJzZSIsInN0cmluZ2lmeSIsInR5cGVPZiIsImRhdGEiLCJfb2JqZWN0IiwiaXNBcnJheSIsIlVJRCIsInV1aWQiLCJpaSIsIk1hdGgiLCJyYW5kb20iLCJ0b1N0cmluZyIsIkJhc2UiLCJzZXR0aW5ncyIsImNvbmZpZ3VyYXRpb24iLCJhZGRDbGFzc0RlZmF1bHRQcm9wZXJ0aWVzIiwiYWRkQmluZGFibGVDbGFzc1Byb3BlcnRpZXMiLCJfc2V0dGluZ3MiLCJfY29uZmlndXJhdGlvbiIsInVpZCIsIl91aWQiLCJfbmFtZSIsImNsYXNzRGVmYXVsdFByb3BlcnRpZXMiLCJjbGFzc1NldHRpbmciLCJjb25jYXQiLCJiaW5kYWJsZUNsYXNzUHJvcGVydHlFeHRlbnNpb25zIiwiX3VpRWxlbWVudFNldHRpbmdzIiwidWlFbGVtZW50U2V0dGluZ3MiLCJjYXBpdGFsaXplUHJvcGVydHlOYW1lIiwicHJvcGVydHlOYW1lIiwicmVwbGFjZSIsImZpcnN0Q2hhcmFjdGVyIiwic3Vic3RyaW5nIiwidG9VcHBlckNhc2UiLCJjbGFzc0RlZmF1bHRQcm9wZXJ0eSIsInByb3BlcnR5IiwiZGVmaW5lUHJvcGVydHkiLCJ3cml0YWJsZSIsInZhbHVlIiwiYmluZGFibGVDbGFzc1Byb3BlcnRpZXMiLCJiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lIiwicHJvcGVydHlOYW1lRXh0ZW5zaW9uIiwiYWRkQmluZGFibGVDbGFzc1Byb3BlcnR5IiwiY29udGV4dCIsImFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUiLCJyZW1vdmVCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lIiwiY3VycmVudFByb3BlcnR5VmFsdWVzIiwiZGVmaW5lUHJvcGVydGllcyIsImdldCIsInNldCIsImtleSIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwicmVzZXRUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzIiwidG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyIsImNsYXNzVHlwZSIsIm1ldGhvZCIsImNsYXNzVHlwZUV2ZW50RGF0YSIsImNsYXNzVHlwZUNhbGxiYWNrTmFtZSIsImNsYXNzVHlwZVRhcmdldE5hbWUiLCJjbGFzc1R5cGVFdmVudE5hbWUiLCJjbGFzc1R5cGVUYXJnZXQiLCJjbGFzc1R5cGVFdmVudENhbGxiYWNrIiwiYmluZCIsIk5vZGVMaXN0IiwiZnJvbSIsIl9jbGFzc1R5cGVUYXJnZXQiLCJIVE1MRWxlbWVudCIsImNsYXNzVHlwZUV2ZW50Q2FsbGJhY2tOYW1lc3BhY2UiLCJlcnJvciIsIlJlZmVyZW5jZUVycm9yIiwiU2VydmljZSIsImFkZFByb3BlcnRpZXMiLCJfZGVmYXVsdHMiLCJkZWZhdWx0cyIsImNvbnRlbnRUeXBlIiwicmVzcG9uc2VUeXBlIiwiX3Jlc3BvbnNlVHlwZXMiLCJfcmVzcG9uc2VUeXBlIiwiX3hociIsImZpbmQiLCJyZXNwb25zZVR5cGVJdGVtIiwiX3R5cGUiLCJ0eXBlIiwiX3VybCIsInVybCIsIl9oZWFkZXJzIiwiaGVhZGVycyIsImhlYWRlciIsInNldFJlcXVlc3RIZWFkZXIiLCJfZGF0YSIsInhociIsIlhNTEh0dHBSZXF1ZXN0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzdGF0dXMiLCJhYm9ydCIsIm9wZW4iLCJvbmxvYWQiLCJvbmVycm9yIiwic2VuZCIsInRoZW4iLCJjdXJyZW50VGFyZ2V0IiwiY2F0Y2giLCJlbmFibGUiLCJkaXNhYmxlIiwiTW9kZWwiLCJfc2NoZW1hIiwic2NoZW1hIiwiX2lzU2V0dGluZyIsImlzU2V0dGluZyIsIl9jaGFuZ2luZyIsImNoYW5naW5nIiwiX2xvY2FsU3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsIl9oaXN0aW9ncmFtIiwiaGlzdGlvZ3JhbSIsImFzc2lnbiIsIl9oaXN0b3J5IiwiaGlzdG9yeSIsInVuc2hpZnQiLCJfZGIiLCJkYiIsImdldEl0ZW0iLCJlbmRwb2ludCIsInNldEl0ZW0iLCJpbmRleCIsInNldERhdGFQcm9wZXJ0eSIsInVuc2V0IiwidW5zZXREYXRhUHJvcGVydHkiLCJzZXREQiIsInVuc2V0REIiLCJjb25maWd1cmFibGUiLCJzZXRWYWx1ZUV2ZW50TmFtZSIsImpvaW4iLCJzZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlRXZlbnROYW1lIiwidW5zZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlIiwic2V0RGVmYXVsdHMiLCJWaWV3IiwiX2VsZW1lbnROYW1lIiwiX2VsZW1lbnQiLCJ0YWdOYW1lIiwiZWxlbWVudE5hbWUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJlbGVtZW50T2JzZXJ2ZXIiLCJvYnNlcnZlIiwic3VidHJlZSIsImNoaWxkTGlzdCIsIl9hdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZUtleSIsImF0dHJpYnV0ZVZhbHVlIiwicmVtb3ZlQXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwiX2VsZW1lbnRPYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJlbGVtZW50T2JzZXJ2ZSIsIl9pbnNlcnQiLCJpbnNlcnQiLCJfdGVtcGxhdGVzIiwidGVtcGxhdGVzIiwicmVzZXRVSUVsZW1lbnRzIiwicmVtb3ZlVUlFbGVtZW50cyIsImFkZFVJRWxlbWVudHMiLCJtdXRhdGlvblJlY29yZExpc3QiLCJvYnNlcnZlciIsIm11dGF0aW9uUmVjb3JkSW5kZXgiLCJtdXRhdGlvblJlY29yZCIsImF1dG9JbnNlcnQiLCJwYXJlbnRFbGVtZW50IiwiTm9kZSIsImluc2VydEFkamFjZW50RWxlbWVudCIsIl9wYXJlbnRFbGVtZW50IiwialF1ZXJ5IiwiZWFjaCIsImF1dG9SZW1vdmUiLCJyZW1vdmVDaGlsZCIsIkNvbnRyb2xsZXIiLCJSb3V0ZXIiLCJwcm90b2NvbCIsIndpbmRvdyIsImxvY2F0aW9uIiwiaG9zdG5hbWUiLCJwb3J0IiwicGF0aCIsInBhdGhuYW1lIiwiaGFzaCIsImhyZWYiLCJoYXNoSW5kZXgiLCJpbmRleE9mIiwicGFyYW1JbmRleCIsInNsaWNlU3RhcnQiLCJzbGljZVN0b3AiLCJfcm91dGVEYXRhIiwicm91dGVEYXRhIiwiY29udHJvbGxlciIsImZpbHRlciIsImZyYWdtZW50IiwiaGFzaEZyYWdtZW50cyIsImZyYWdtZW50cyIsImN1cnJlbnRVUkwiLCJyb3V0ZUNvbnRyb2xsZXJEYXRhIiwiX3JvdXRlQ29udHJvbGxlckRhdGEiLCJyb3V0ZXMiLCJyb3V0ZVBhdGgiLCJyb3V0ZVNldHRpbmdzIiwicGF0aEZyYWdtZW50cyIsInJvdXRlRnJhZ21lbnRzIiwiZnJhZ21lbnRJbmRleCIsIm1hdGNoIiwicm91dGVGcmFnbWVudCIsInJvdXRlRnJhZ21lbnRJbmRleCIsInVuZGVmaW5lZCIsImN1cnJlbnRJREtleSIsImZyYWdtZW50SURSZWdFeHAiLCJSZWdFeHAiLCJyb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cCIsInRlc3QiLCJyb3V0ZSIsIl9yb3V0ZXMiLCJfY29udHJvbGxlciIsIl9wcmV2aW91c1VSTCIsInByZXZpb3VzVVJMIiwiX2N1cnJlbnRVUkwiLCJlbmFibGVSb3V0ZXMiLCJyZWR1Y2UiLCJyb3V0ZUluZGV4Iiwib3JpZ2luYWxSb3V0ZXMiLCJjYWxsYmFjayIsImVuYWJsZVJvdXRlRXZlbnRzIiwicm91dGVDaGFuZ2UiLCJkaXNhYmxlUm91dGVFdmVudHMiLCJuYXZpZ2F0ZSIsIk1WQyIsIiQiLCJVdGlscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0VBQUFBLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIs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
