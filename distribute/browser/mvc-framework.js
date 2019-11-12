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
      Object.keys(this.settings).forEach(settingKey => {
        if (this.classDefaultProperties.indexOf(settingKey) === -1) {
          this[settingKey] = this.settings[settingKey];
        }
      });
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
        var firstCharacter = propertyName.substring(0, 1).toUpperCase();
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
      var propertyName;

      switch (bindableClassPropertyName) {
        case 'data':
          propertyName = bindableClassPropertyName.concat(propertyNameExtension);
          break;

        default:
          propertyName = bindableClassPropertyName.concat('s', propertyNameExtension);
          break;
      }

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

  class Model extends Base {
    constructor() {
      super(...arguments);
    }

    get bindableClassProperties() {
      return ['data', 'service'];
    }

    get classDefaultProperties() {
      return ['name', 'localStorage', 'histiogram', 'defaults'];
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
      this.set(defaults);
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

    get db() {
      return this._db;
    }

    get _db() {
      var db = localStorage.getItem(this.localStorage.endpoint) || '{}';
      return JSON.parse(db);
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
              this[key] = value;
              context._changing[key] = value;
              if (context.localStorage) context.setDB(key, value);
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

    parse(data) {
      data = data || this._data || {};
      return JSON.parse(JSON.stringify(data));
    }

  }

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
    }

    get bindableClassProperties() {
      return ['model', 'view', 'controller', 'router'];
    }

    get classDefaultProperties() {
      return [];
    }

  };

  var Router = class extends Base {
    constructor() {
      super(...arguments);
      this.addWindowEvents();
    }

    get classDefaultProperties() {
      return ['root', 'hashRouting', 'controller', 'routes'];
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

    get pathname() {
      return window.location.pathname;
    }

    get path() {
      var string = window.location.pathname.replace(new RegExp(['^', this.root].join('')), '').split('?').slice(0, 1)[0];
      var fragments = string.length === 0 ? [] : string.length === 1 && string.match(/^\//) && string.match(/\/?/) ? ['/'] : string.replace(/^\//, '').replace(/\/$/, '').split('/');
      return {
        fragments: fragments,
        string: string
      };
    }

    get hash() {
      var string = window.location.hash.slice(1).split('?').slice(0, 1)[0];
      var fragments = string.length === 0 ? [] : string.length === 1 && string.match(/^\//) && string.match(/\/?/) ? ['/'] : string.replace(/^\//, '').replace(/\/$/, '').split('/');
      return {
        fragments: fragments,
        string: string
      };
    }

    get parameters() {
      var string;
      var data;

      if (window.location.href.match(/\?/)) {
        var parameters = window.location.href.split('?').slice(-1).join('');
        string = parameters;
        data = parameters.split('&').reduce((_parameters, parameter) => {
          var parameterData = parameter.split('=');
          _parameters[parameterData[0]] = parameterData[1];
          return _parameters;
        }, {});
      } else {
        string = '';
        data = {};
      }

      return {
        string: string,
        data: data
      };
    }

    get _root() {
      return this.root || '/';
    }

    set _root(root) {
      this.root = root;
    }

    get _hashRouting() {
      return this.hashRouting || false;
    }

    set _hashRouting(hashRouting) {
      this.hashRouting = hashRouting;
    }

    get _routeData() {}

    get _routeControllerData() {}

    get _routes() {
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

    get routeData() {
      return {
        root: this.root,
        protocol: this.protocol,
        hostname: this.hostname,
        port: this.port,
        pathname: this.pathname,
        path: this.path,
        hash: this.hash,
        parameters: this.parameters
      };
    }

    matchRoute(routeFragments, currentRouteFragments) {
      var routeMatches = new Array();

      if (routeFragments.length === currentRouteFragments.length) {
        routeMatches = routeFragments.reduce((_routeMatches, routeFragment, routeFragmentIndex) => {
          var currentRouteFragment = currentRouteFragments[routeFragmentIndex];

          if (routeFragment.match(/^\:/)) {
            _routeMatches.push(true);
          } else if (routeFragment === currentRouteFragment) {
            _routeMatches.push(true);
          } else {
            _routeMatches.push(false);
          }

          return _routeMatches;
        }, []);
      } else {
        routeMatches.push(false);
      }

      return routeMatches.indexOf(false) === -1 ? true : false;
    }

    getRoute(routeData) {
      var routes = Object.entries(this.routes).reduce((_routes, _ref) => {
        var [routeName, routeSettings] = _ref;
        var routeFragments = routeName.length === 1 && routeName.match(/^\//) ? [routeName] : routeName.length === 0 ? [''] : routeName.replace(/^\//, '').replace(/\/$/, '').split('/');
        routeSettings.fragments = routeFragments;
        _routes[routeFragments.join('/')] = routeSettings;
        return _routes;
      }, {});
      return Object.values(routes).find(route => {
        var routeFragments = route.fragments;
        var routeDataFragments = this.hashRouting ? routeData.hash.fragments : routeData.path.fragments;
        var matchRoute = this.matchRoute(routeFragments, routeDataFragments);
        return matchRoute === true;
      });
    }

    popState(event) {
      var routeData = this.routeData;
      var route = this.getRoute(routeData);

      if (route) {
        this.controller[route.callback](routeData);
      }
    }

    addWindowEvents() {
      window.on('popstate', this.popState.bind(this));
    }

    removeWindowEvents() {
      window.off('popstate', this.popState.bind(this));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL3BhcmFtc1RvT2JqZWN0LmpzIiwiLi4vLi4vc291cmNlL01WQy9VdGlscy90eXBlT2YuanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL3VpZC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQmFzZS9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvU2VydmljZS9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvTW9kZWwvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1ZpZXcvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL0NvbnRyb2xsZXIvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1JvdXRlci9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiRXZlbnRUYXJnZXQucHJvdG90eXBlLm9uID0gRXZlbnRUYXJnZXQucHJvdG90eXBlLm9uIHx8IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyXHJcbkV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vZmYgPSBFdmVudFRhcmdldC5wcm90b3R5cGUub2ZmIHx8IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyXHJcbiIsImNsYXNzIEV2ZW50cyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfZXZlbnRzKCkge1xyXG4gICAgdGhpcy5ldmVudHMgPSB0aGlzLmV2ZW50cyB8fCB7fVxyXG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzXHJcbiAgfVxyXG4gIGdldEV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSkgeyByZXR1cm4gdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gfHwge30gfVxyXG4gIGdldEV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIHJldHVybiAoZXZlbnRDYWxsYmFjay5uYW1lLmxlbmd0aClcclxuICAgICAgPyBldmVudENhbGxiYWNrLm5hbWVcclxuICAgICAgOiAnYW5vbnltb3VzRnVuY3Rpb24nXHJcbiAgfVxyXG4gIGdldEV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpIHtcclxuICAgIHJldHVybiBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gfHwgW11cclxuICB9XHJcbiAgb24oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKSB7XHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja3MgPSB0aGlzLmdldEV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSlcclxuICAgIGxldCBldmVudENhbGxiYWNrTmFtZSA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgIGxldCBldmVudENhbGxiYWNrR3JvdXAgPSB0aGlzLmdldEV2ZW50Q2FsbGJhY2tHcm91cChldmVudENhbGxiYWNrcywgZXZlbnRDYWxsYmFja05hbWUpXHJcbiAgICBldmVudENhbGxiYWNrR3JvdXAucHVzaChldmVudENhbGxiYWNrKVxyXG4gICAgZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdID0gZXZlbnRDYWxsYmFja0dyb3VwXHJcbiAgICB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSA9IGV2ZW50Q2FsbGJhY2tzXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBvZmYoKSB7XHJcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICBjYXNlIDA6XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZXZlbnRzXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAxOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDI6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2tOYW1lID0gKHR5cGVvZiBldmVudENhbGxiYWNrID09PSAnc3RyaW5nJylcclxuICAgICAgICAgID8gZXZlbnRDYWxsYmFja1xyXG4gICAgICAgICAgOiB0aGlzLmdldEV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgaWYodGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0pIHtcclxuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVtldmVudENhbGxiYWNrTmFtZV1cclxuICAgICAgICAgIGlmKFxyXG4gICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9ldmVudHNbZXZlbnROYW1lXSkubGVuZ3RoID09PSAwXHJcbiAgICAgICAgICApIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgZW1pdChldmVudE5hbWUsIGV2ZW50RGF0YSkge1xyXG4gICAgbGV0IF9hcmd1bWVudHMgPSBPYmplY3QudmFsdWVzKGFyZ3VtZW50cylcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IE9iamVjdC5lbnRyaWVzKFxyXG4gICAgICB0aGlzLmdldEV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSlcclxuICAgIClcclxuICAgIGZvcihsZXQgW2V2ZW50Q2FsbGJhY2tHcm91cE5hbWUsIGV2ZW50Q2FsbGJhY2tHcm91cF0gb2YgZXZlbnRDYWxsYmFja3MpIHtcclxuICAgICAgZm9yKGxldCBldmVudENhbGxiYWNrIG9mIGV2ZW50Q2FsbGJhY2tHcm91cCkge1xyXG4gICAgICAgIGxldCBhZGRpdGlvbmFsQXJndW1lbnRzID0gX2FyZ3VtZW50cy5zcGxpY2UoMikgfHwgW11cclxuICAgICAgICBldmVudENhbGxiYWNrKGV2ZW50RGF0YSwgLi4uYWRkaXRpb25hbEFyZ3VtZW50cylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRzXHJcbiIsImNvbnN0IENoYW5uZWwgPSBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfcmVzcG9uc2VzKCkge1xyXG4gICAgdGhpcy5yZXNwb25zZXMgPSB0aGlzLnJlc3BvbnNlcyB8fCB0aGlzLnJlc3BvbnNlc1xyXG4gICAgcmV0dXJuIHRoaXMucmVzcG9uc2VzXHJcbiAgfVxyXG4gIHJlc3BvbnNlKHJlc3BvbnNlTmFtZSwgcmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgaWYocmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgICB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSA9IHJlc3BvbnNlQ2FsbGJhY2tcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VdXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlcXVlc3QocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZih0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSkge1xyXG4gICAgICBsZXQgX2FyZ3VtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykuc2xpY2UoMSlcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKC4uLl9hcmd1bWVudHMpXHJcbiAgICB9XHJcbiAgfVxyXG4gIG9mZihyZXNwb25zZU5hbWUpIHtcclxuICAgIGlmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvcihsZXQgW3Jlc3BvbnNlTmFtZV0gb2YgT2JqZWN0LmtleXModGhpcy5fcmVzcG9uc2VzKSkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IENoYW5uZWxcclxuIiwiaW1wb3J0IENoYW5uZWwgZnJvbSAnLi9DaGFubmVsL2luZGV4J1xyXG5jb25zdCBDaGFubmVscyA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9jaGFubmVscygpIHtcclxuICAgIHRoaXMuY2hhbm5lbHMgPSB0aGlzLmNoYW5uZWxzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsc1xyXG4gIH1cclxuICBjaGFubmVsKGNoYW5uZWxOYW1lKSB7XHJcbiAgICB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0gPSAodGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdKVxyXG4gICAgICA/IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA6IG5ldyBDaGFubmVsKClcclxuICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbiAgb2ZmKGNoYW5uZWxOYW1lKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IENoYW5uZWxzXHJcbiIsImNvbnN0IHBhcmFtc1RvT2JqZWN0ID0gZnVuY3Rpb24gcGFyYW1zVG9PYmplY3QocGFyYW1zKSB7XHJcbiAgICB2YXIgcGFyYW1zID0gcGFyYW1zLnNwbGl0KCcmJylcclxuICAgIHZhciBvYmplY3QgPSB7fVxyXG4gICAgcGFyYW1zLmZvckVhY2goKHBhcmFtRGF0YSkgPT4ge1xyXG4gICAgICBwYXJhbURhdGEgPSBwYXJhbURhdGEuc3BsaXQoJz0nKVxyXG4gICAgICBvYmplY3RbcGFyYW1EYXRhWzBdXSA9IGRlY29kZVVSSUNvbXBvbmVudChwYXJhbURhdGFbMV0gfHwgJycpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqZWN0KSlcclxufVxyXG5leHBvcnQgZGVmYXVsdCBwYXJhbXNUb09iamVjdFxyXG4iLCJjb25zdCB0eXBlT2YgPSBmdW5jdGlvbiB0eXBlT2YoZGF0YSkge1xyXG4gIHN3aXRjaCh0eXBlb2YgZGF0YSkge1xyXG4gICAgY2FzZSAnb2JqZWN0JzpcclxuICAgICAgbGV0IF9vYmplY3RcclxuICAgICAgaWYoXHJcbiAgICAgICAgQXJyYXkuaXNBcnJheShkYXRhKVxyXG4gICAgICApIHtcclxuICAgICAgICByZXR1cm4gJ2FycmF5J1xyXG4gICAgICB9IGVsc2UgaWYoXHJcbiAgICAgICAgZGF0YSAhPT0gbnVsbFxyXG4gICAgICApIHtcclxuICAgICAgICByZXR1cm4gJ29iamVjdCdcclxuICAgICAgfSBlbHNlIGlmKFxyXG4gICAgICAgIGRhdGEgPT09IG51bGxcclxuICAgICAgKSB7XHJcbiAgICAgICAgcmV0dXJuICdudWxsJ1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBfb2JqZWN0XHJcbiAgICBjYXNlICdzdHJpbmcnOlxyXG4gICAgY2FzZSAnbnVtYmVyJzpcclxuICAgIGNhc2UgJ2Jvb2xlYW4nOlxyXG4gICAgY2FzZSAndW5kZWZpbmVkJzpcclxuICAgIGNhc2UgJ2Z1bmN0aW9uJzpcclxuICAgICAgcmV0dXJuIHR5cGVvZiBkYXRhXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IHR5cGVPZlxyXG4iLCJjb25zdCBVSUQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHV1aWQgPSAnJywgaWlcclxuICBmb3IgKGlpID0gMDsgaWkgPCAzMjsgaWkgKz0gMSkge1xyXG4gICAgc3dpdGNoIChpaSkge1xyXG4gICAgICBjYXNlIDg6XHJcbiAgICAgIGNhc2UgMjA6XHJcbiAgICAgICAgdXVpZCArPSAnLSc7XHJcbiAgICAgICAgdXVpZCArPSAoTWF0aC5yYW5kb20oKSAqIDE2IHwgMCkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAxMjpcclxuICAgICAgICB1dWlkICs9ICctJ1xyXG4gICAgICAgIHV1aWQgKz0gJzQnXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAxNjpcclxuICAgICAgICB1dWlkICs9ICctJ1xyXG4gICAgICAgIHV1aWQgKz0gKE1hdGgucmFuZG9tKCkgKiA0IHwgOCkudG9TdHJpbmcoMTYpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB1dWlkICs9IChNYXRoLnJhbmRvbSgpICogMTYgfCAwKS50b1N0cmluZygxNilcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHV1aWRcclxufVxyXG5leHBvcnQgZGVmYXVsdCBVSURcclxuIiwiaW1wb3J0IHsgVUlEIH0gZnJvbSAnLi4vVXRpbHMvaW5kZXgnXHJcbmltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4J1xyXG5cclxuY2xhc3MgQmFzZSBleHRlbmRzIEV2ZW50cyB7XHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MsIGNvbmZpZ3VyYXRpb24pIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICAgIHRoaXMuYWRkQ2xhc3NEZWZhdWx0UHJvcGVydGllcygpXHJcbiAgICB0aGlzLmFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKClcclxuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcclxuICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uXHJcbiAgfVxyXG4gIGdldCB1aWQoKSB7XHJcbiAgICB0aGlzLl91aWQgPSAodGhpcy5fdWlkKVxyXG4gICAgPyB0aGlzLl91aWRcclxuICAgIDogVUlEKClcclxuICAgIHJldHVybiB0aGlzLl91aWRcclxuICB9XHJcbiAgZ2V0IF9uYW1lKCkgeyByZXR1cm4gdGhpcy5uYW1lIH1cclxuICBzZXQgX25hbWUobmFtZSkgeyB0aGlzLm5hbWUgPSBuYW1lIH1cclxuICBnZXQgX3NldHRpbmdzKCkge1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3MgfHwge31cclxuICAgIHJldHVybiB0aGlzLnNldHRpbmdzXHJcbiAgfVxyXG4gIHNldCBfc2V0dGluZ3Moc2V0dGluZ3MpIHtcclxuICAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3MgfHwge31cclxuICAgICB0aGlzLmNsYXNzRGVmYXVsdFByb3BlcnRpZXNcclxuICAgICAgIC5mb3JFYWNoKChjbGFzc1NldHRpbmcpID0+IHtcclxuICAgICAgICAgaWYodGhpcy5zZXR0aW5nc1tjbGFzc1NldHRpbmddKSB7XHJcbiAgICAgICAgICAgdGhpc1snXycuY29uY2F0KGNsYXNzU2V0dGluZyldID0gdGhpcy5zZXR0aW5nc1tjbGFzc1NldHRpbmddXHJcbiAgICAgICAgIH1cclxuICAgICAgIH0pXHJcbiAgICAgT2JqZWN0LmtleXModGhpcy5zZXR0aW5ncylcclxuICAgICAgIC5mb3JFYWNoKChzZXR0aW5nS2V5KSA9PiB7XHJcbiAgICAgICAgIGlmKHRoaXMuY2xhc3NEZWZhdWx0UHJvcGVydGllcy5pbmRleE9mKHNldHRpbmdLZXkpID09PSAtMSkge1xyXG4gICAgICAgICAgIHRoaXNbc2V0dGluZ0tleV0gPSB0aGlzLnNldHRpbmdzW3NldHRpbmdLZXldXHJcbiAgICAgICAgIH1cclxuICAgICAgIH0pXHJcbiAgfVxyXG4gIGdldCBfY29uZmlndXJhdGlvbigpIHtcclxuICAgIHRoaXMuY29uZmlndXJhdGlvbiA9IHRoaXMuY29uZmlndXJhdGlvbiB8fCB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblxyXG4gIH1cclxuICBzZXQgX2NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikgeyB0aGlzLmNvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uIH1cclxuICBnZXQgYmluZGFibGVDbGFzc1Byb3BlcnR5RXh0ZW5zaW9ucygpIHsgcmV0dXJuIFtcclxuICAgICcnLFxyXG4gICAgJ0V2ZW50cycsXHJcbiAgICAnQ2FsbGJhY2tzJ1xyXG4gIF0gfVxyXG4gIGdldCBfdWlFbGVtZW50U2V0dGluZ3MoKSB7XHJcbiAgICB0aGlzLnVpRWxlbWVudFNldHRpbmdzID0gdGhpcy51aUVsZW1lbnRTZXR0aW5ncyB8fCB7fVxyXG4gICAgcmV0dXJuIHRoaXMudWlFbGVtZW50U2V0dGluZ3NcclxuICB9XHJcbiAgc2V0IF91aUVsZW1lbnRTZXR0aW5ncyh1aUVsZW1lbnRTZXR0aW5ncykge1xyXG4gICAgdGhpcy51aUVsZW1lbnRTZXR0aW5ncyA9IHVpRWxlbWVudFNldHRpbmdzXHJcbiAgfVxyXG4gIGNhcGl0YWxpemVQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lKSB7XHJcbiAgICBpZihwcm9wZXJ0eU5hbWUuc2xpY2UoMCwgMikgPT09ICd1aScpIHtcclxuICAgICAgcmV0dXJuIHByb3BlcnR5TmFtZS5yZXBsYWNlKC9edWkvLCAnVUknKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IGZpcnN0Q2hhcmFjdGVyID0gcHJvcGVydHlOYW1lLnN1YnN0cmluZygwLCAxKS50b1VwcGVyQ2FzZSgpXHJcbiAgICAgIHJldHVybiBwcm9wZXJ0eU5hbWUucmVwbGFjZSgvXi4vLCBmaXJzdENoYXJhY3RlcilcclxuICAgIH1cclxuICB9XHJcbiAgYWRkQ2xhc3NEZWZhdWx0UHJvcGVydGllcygpIHtcclxuICAgIHRoaXMuY2xhc3NEZWZhdWx0UHJvcGVydGllc1xyXG4gICAgICAuZm9yRWFjaCgoY2xhc3NEZWZhdWx0UHJvcGVydHkpID0+IHtcclxuICAgICAgICBpZih0aGlzW2NsYXNzRGVmYXVsdFByb3BlcnR5XSkge1xyXG4gICAgICAgICAgbGV0IHByb3BlcnR5ID0gdGhpc1tjbGFzc0RlZmF1bHRQcm9wZXJ0eV1cclxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBjbGFzc0RlZmF1bHRQcm9wZXJ0eSwge1xyXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmFsdWU6IHByb3BlcnR5XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgdGhpc1snXycuY29uY2F0KGNsYXNzRGVmYXVsdFByb3BlcnR5KV0gPSBwcm9wZXJ0eVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKCkge1xyXG4gICAgaWYodGhpcy5iaW5kYWJsZUNsYXNzUHJvcGVydGllcykge1xyXG4gICAgICB0aGlzLmJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzXHJcbiAgICAgICAgLmZvckVhY2goKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpID0+IHtcclxuICAgICAgICAgIHRoaXMuYmluZGFibGVDbGFzc1Byb3BlcnR5RXh0ZW5zaW9uc1xyXG4gICAgICAgICAgICAuZm9yRWFjaCgocHJvcGVydHlOYW1lRXh0ZW5zaW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5hZGRCaW5kYWJsZUNsYXNzUHJvcGVydHkoXHJcbiAgICAgICAgICAgICAgICBiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLFxyXG4gICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lRXh0ZW5zaW9uXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBhZGRCaW5kYWJsZUNsYXNzUHJvcGVydHkoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSwgcHJvcGVydHlOYW1lRXh0ZW5zaW9uKSB7XHJcbiAgICBsZXQgY29udGV4dCA9IHRoaXNcclxuICAgIGxldCBwcm9wZXJ0eU5hbWVcclxuICAgIHN3aXRjaChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSB7XHJcbiAgICAgIGNhc2UgJ2RhdGEnOlxyXG4gICAgICAgIHByb3BlcnR5TmFtZSA9IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUuY29uY2F0KHByb3BlcnR5TmFtZUV4dGVuc2lvbilcclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHByb3BlcnR5TmFtZSA9IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUuY29uY2F0KCdzJywgcHJvcGVydHlOYW1lRXh0ZW5zaW9uKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICBsZXQgY2FwaXRhbGl6ZVByb3BlcnR5TmFtZSA9IHRoaXMuY2FwaXRhbGl6ZVByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpXHJcbiAgICBsZXQgYWRkQmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSA9ICdhZGQnLmNvbmNhdChjYXBpdGFsaXplUHJvcGVydHlOYW1lKVxyXG4gICAgbGV0IHJlbW92ZUJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUgPSAncmVtb3ZlJy5jb25jYXQoY2FwaXRhbGl6ZVByb3BlcnR5TmFtZSlcclxuICAgIGlmKHByb3BlcnR5TmFtZSA9PT0gJ3VpRWxlbWVudHMnKSB7XHJcbiAgICAgIGNvbnRleHQuX3VpRWxlbWVudFNldHRpbmdzID0gdGhpc1twcm9wZXJ0eU5hbWVdXHJcbiAgICB9XHJcbiAgICBsZXQgY3VycmVudFByb3BlcnR5VmFsdWVzID0gdGhpc1twcm9wZXJ0eU5hbWVdXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhcclxuICAgICAgdGhpcyxcclxuICAgICAge1xyXG4gICAgICAgIFtwcm9wZXJ0eU5hbWVdOiB7XHJcbiAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgICAgIHZhbHVlOiBjdXJyZW50UHJvcGVydHlWYWx1ZXMsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBbJ18nLmNvbmNhdChwcm9wZXJ0eU5hbWUpXToge1xyXG4gICAgICAgICAgZ2V0KCkge1xyXG4gICAgICAgICAgICBjb250ZXh0W3Byb3BlcnR5TmFtZV0gPSBjb250ZXh0W3Byb3BlcnR5TmFtZV0gfHwge31cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHRbcHJvcGVydHlOYW1lXVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNldCh2YWx1ZXMpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXModmFsdWVzKVxyXG4gICAgICAgICAgICAgIC5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaChwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgY2FzZSAndWlFbGVtZW50cyc6XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5fdWlFbGVtZW50U2V0dGluZ3Nba2V5XSA9IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5TmFtZSldW2tleV0gPSBjb250ZXh0LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh2YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChwcm9wZXJ0eU5hbWUpXVtrZXldID0gdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgW2FkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdOiB7XHJcbiAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgICAgICAgbGV0IHZhbHVlID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICAgICAgICAgY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5TmFtZSldID0ge1xyXG4gICAgICAgICAgICAgICAgW2tleV06IHZhbHVlXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgIGxldCB2YWx1ZXMgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICAgICAgICBjb250ZXh0WydfJy5jb25jYXQocHJvcGVydHlOYW1lKV0gPSB2YWx1ZXNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgW3JlbW92ZUJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdOiB7XHJcbiAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgICAgICAgc3dpdGNoKHByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAndWlFbGVtZW50cyc6XHJcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQocHJvcGVydHlOYW1lKV1ba2V5XVxyXG4gICAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KCd1aUVsZW1lbnRTZXR0aW5ncycpXVtrZXldXHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KHByb3BlcnR5TmFtZSldW2tleV1cclxuICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihhcmd1bWVudHMubGVuZ3RoID09PSAwKXtcclxuICAgICAgICAgICAgICBPYmplY3Qua2V5cyhjb250ZXh0WydfJy5jb25jYXQocHJvcGVydHlOYW1lKV0pXHJcbiAgICAgICAgICAgICAgICAuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHN3aXRjaChwcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd1aUVsZW1lbnRzJzpcclxuICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQocHJvcGVydHlOYW1lKV1ba2V5XVxyXG4gICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRleHRbJ18nLmNvbmNhdCgndWlFbGVtZW50U2V0dGluZ3MnKV1ba2V5XVxyXG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRleHRbJ18nLmNvbmNhdChwcm9wZXJ0eU5hbWUpXVtrZXldXHJcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfVxyXG4gICAgKVxyXG4gICAgaWYoY3VycmVudFByb3BlcnR5VmFsdWVzKSB7XHJcbiAgICAgIHRoaXNbYWRkQmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZV0oY3VycmVudFByb3BlcnR5VmFsdWVzKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcmVzZXRUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpIHtcclxuICAgIHJldHVybiB0aGlzXHJcbiAgICAgIC50b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUsICdvZmYnKVxyXG4gICAgICAudG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLCAnb24nKVxyXG4gIH1cclxuICB0b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKSB7XHJcbiAgICBpZihcclxuICAgICAgdGhpc1tjbGFzc1R5cGUuY29uY2F0KCdzJyldICYmXHJcbiAgICAgIHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJyldICYmXHJcbiAgICAgIHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJyldXHJcbiAgICApIHtcclxuICAgICAgT2JqZWN0LmVudHJpZXModGhpc1tjbGFzc1R5cGUuY29uY2F0KCdFdmVudHMnKV0pXHJcbiAgICAgICAgLmZvckVhY2goKFtjbGFzc1R5cGVFdmVudERhdGEsIGNsYXNzVHlwZUNhbGxiYWNrTmFtZV0pID0+IHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNsYXNzVHlwZUV2ZW50RGF0YSA9IGNsYXNzVHlwZUV2ZW50RGF0YS5zcGxpdCgnICcpXHJcbiAgICAgICAgICAgIGxldCBjbGFzc1R5cGVUYXJnZXROYW1lID0gY2xhc3NUeXBlRXZlbnREYXRhWzBdXHJcbiAgICAgICAgICAgIGxldCBjbGFzc1R5cGVFdmVudE5hbWUgPSBjbGFzc1R5cGVFdmVudERhdGFbMV1cclxuICAgICAgICAgICAgbGV0IGNsYXNzVHlwZVRhcmdldCA9IHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgncycpXVtjbGFzc1R5cGVUYXJnZXROYW1lXVxyXG4gICAgICAgICAgICBsZXQgY2xhc3NUeXBlRXZlbnRDYWxsYmFja1xyXG4gICAgICAgICAgICBzd2l0Y2gobWV0aG9kKSB7XHJcbiAgICAgICAgICAgICAgY2FzZSAnb24nOlxyXG4gICAgICAgICAgICAgICAgc3dpdGNoKGNsYXNzVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICBjYXNlICd1aUVsZW1lbnQnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2sgPSB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXVtjbGFzc1R5cGVDYWxsYmFja05hbWVdLmJpbmQodGhpcylcclxuICAgICAgICAgICAgICAgICAgICBpZihjbGFzc1R5cGVUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShjbGFzc1R5cGVUYXJnZXQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKChfY2xhc3NUeXBlVGFyZ2V0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgX2NsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoY2xhc3NUeXBlVGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc1R5cGVFdmVudENhbGxiYWNrID0gdGhpc1tjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKV1bY2xhc3NUeXBlQ2FsbGJhY2tOYW1lXVxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaywgdGhpcylcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICBjYXNlICdvZmYnOlxyXG4gICAgICAgICAgICAgICAgY2xhc3NUeXBlRXZlbnRDYWxsYmFjayA9IHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJyldW2NsYXNzVHlwZUNhbGxiYWNrTmFtZV1cclxuICAgICAgICAgICAgICAgIHN3aXRjaChjbGFzc1R5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgY2FzZSAndWlFbGVtZW50JzpcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY2xhc3NUeXBlRXZlbnRDYWxsYmFja05hbWVzcGFjZSA9IGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2submFtZS5zcGxpdCgnICcpWzFdXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoY2xhc3NUeXBlVGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIEFycmF5LmZyb20oY2xhc3NUeXBlVGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaCgoX2NsYXNzVHlwZVRhcmdldCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF9jbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2tOYW1lc3BhY2UpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKGNsYXNzVHlwZVRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2tOYW1lc3BhY2UpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NUeXBlVGFyZ2V0W21ldGhvZF0oY2xhc3NUeXBlRXZlbnROYW1lLCBjbGFzc1R5cGVFdmVudENhbGxiYWNrLCB0aGlzKVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcclxuICAgICAgICAgICAgZXJyb3JcclxuICAgICAgICAgICkgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBCYXNlXHJcbiIsImltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNvbnN0IFNlcnZpY2UgPSBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gICAgdGhpcy5hZGRQcm9wZXJ0aWVzKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGdldCBfZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLmRlZmF1bHRzIHx8IHtcbiAgICBjb250ZW50VHlwZTogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICB9IH1cbiAgZ2V0IF9yZXNwb25zZVR5cGVzKCkgeyByZXR1cm4gWycnLCAnYXJyYXlidWZmZXInLCAnYmxvYicsICdkb2N1bWVudCcsICdqc29uJywgJ3RleHQnXSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlKCkgeyByZXR1cm4gdGhpcy5yZXNwb25zZVR5cGUgfVxuICBzZXQgX3Jlc3BvbnNlVHlwZShyZXNwb25zZVR5cGUpIHtcbiAgICB0aGlzLl94aHIucmVzcG9uc2VUeXBlID0gdGhpcy5fcmVzcG9uc2VUeXBlcy5maW5kKFxuICAgICAgKHJlc3BvbnNlVHlwZUl0ZW0pID0+IHJlc3BvbnNlVHlwZUl0ZW0gPT09IHJlc3BvbnNlVHlwZVxuICAgICkgfHwgdGhpcy5fZGVmYXVsdHMucmVzcG9uc2VUeXBlXG4gIH1cbiAgZ2V0IF90eXBlKCkgeyByZXR1cm4gdGhpcy50eXBlIH1cbiAgc2V0IF90eXBlKHR5cGUpIHsgdGhpcy50eXBlID0gdHlwZSB9XG4gIGdldCBfdXJsKCkgeyByZXR1cm4gdGhpcy51cmwgfVxuICBzZXQgX3VybCh1cmwpIHsgdGhpcy51cmwgPSB1cmwgfVxuICBnZXQgX2hlYWRlcnMoKSB7IHJldHVybiB0aGlzLmhlYWRlcnMgfHwgW10gfVxuICBzZXQgX2hlYWRlcnMoaGVhZGVycykge1xuICAgIHRoaXMuX2hlYWRlcnMubGVuZ3RoID0gMFxuICAgIGhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICB0aGlzLl9oZWFkZXJzLnB1c2goaGVhZGVyKVxuICAgICAgaGVhZGVyID0gT2JqZWN0LmVudHJpZXMoaGVhZGVyKVswXVxuICAgICAgdGhpcy5feGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgfSlcbiAgfVxuICBnZXQgX2RhdGEoKSB7IHJldHVybiB0aGlzLmRhdGEgfVxuICBzZXQgX2RhdGEoZGF0YSkgeyB0aGlzLmRhdGEgPSBkYXRhIH1cbiAgZ2V0IF94aHIoKSB7XG4gICAgdGhpcy54aHIgPSAodGhpcy54aHIpXG4gICAgICA/IHRoaXMueGhyXG4gICAgICA6IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgcmV0dXJuIHRoaXMueGhyXG4gIH1cbiAgcmVxdWVzdCgpIHtcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLmRhdGEgfHwgbnVsbFxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZih0aGlzLl94aHIuc3RhdHVzID09PSAyMDApIHRoaXMuX3hoci5hYm9ydCgpXG4gICAgICB0aGlzLl94aHIub3Blbih0aGlzLnR5cGUsIHRoaXMudXJsKVxuICAgICAgdGhpcy5faGVhZGVycyA9IHRoaXMuc2V0dGluZ3MuaGVhZGVycyB8fCBbdGhpcy5fZGVmYXVsdHMuY29udGVudFR5cGVdXG4gICAgICB0aGlzLl94aHIub25sb2FkID0gcmVzb2x2ZVxuICAgICAgdGhpcy5feGhyLm9uZXJyb3IgPSByZWplY3RcbiAgICAgIHRoaXMuX3hoci5zZW5kKGRhdGEpXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgJ3hocjpyZXNvbHZlJywge1xuICAgICAgICAgIG5hbWU6ICd4aHI6cmVzb2x2ZScsXG4gICAgICAgICAgZGF0YTogcmVzcG9uc2UuY3VycmVudFRhcmdldCxcbiAgICAgICAgfSxcbiAgICAgICAgdGhpc1xuICAgICAgKVxuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7IHRocm93IGVycm9yIH0pXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIE9iamVjdC5rZXlzKHNldHRpbmdzKS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGlmKHNldHRpbmdzLnR5cGUpIHRoaXMuX3R5cGUgPSBzZXR0aW5ncy50eXBlXG4gICAgICBpZihzZXR0aW5ncy51cmwpIHRoaXMuX3VybCA9IHNldHRpbmdzLnVybFxuICAgICAgaWYoc2V0dGluZ3MuZGF0YSkgdGhpcy5fZGF0YSA9IHNldHRpbmdzLmRhdGEgfHwgbnVsbFxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5yZXNwb25zZVR5cGUpIHRoaXMuX3Jlc3BvbnNlVHlwZSA9IHRoaXMuX3NldHRpbmdzLnJlc3BvbnNlVHlwZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgZGVsZXRlIHRoaXMuX3R5cGVcbiAgICAgIGRlbGV0ZSB0aGlzLl91cmxcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhXG4gICAgICBkZWxldGUgdGhpcy5faGVhZGVyc1xuICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlVHlwZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBTZXJ2aWNlXG4iLCJpbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4J1xuXG5jbGFzcyBNb2RlbCBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICdkYXRhJyxcbiAgICAnc2VydmljZSdcbiAgXSB9XG4gIGdldCBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICduYW1lJyxcbiAgICAnbG9jYWxTdG9yYWdlJyxcbiAgICAnaGlzdGlvZ3JhbScsXG4gICAgJ2RlZmF1bHRzJ1xuICBdIH1cbiAgZ2V0IF9pc1NldHRpbmcoKSB7IHJldHVybiB0aGlzLmlzU2V0dGluZyB9XG4gIHNldCBfaXNTZXR0aW5nKGlzU2V0dGluZykgeyB0aGlzLmlzU2V0dGluZyA9IGlzU2V0dGluZyB9XG4gIGdldCBfY2hhbmdpbmcoKSB7XG4gICAgdGhpcy5jaGFuZ2luZyA9IHRoaXMuY2hhbmdpbmcgfHwge31cbiAgICByZXR1cm4gdGhpcy5jaGFuZ2luZ1xuICB9XG4gIGdldCBfbG9jYWxTdG9yYWdlKCkgeyByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UgfVxuICBzZXQgX2xvY2FsU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHsgdGhpcy5sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UgfVxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5kZWZhdWx0cyB9XG4gIHNldCBfZGVmYXVsdHMoZGVmYXVsdHMpIHtcbiAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHNcbiAgICB0aGlzLnNldChkZWZhdWx0cylcbiAgfVxuICBnZXQgX2hpc3Rpb2dyYW0oKSB7IHJldHVybiB0aGlzLmhpc3Rpb2dyYW0gfHwge1xuICAgIGxlbmd0aDogMVxuICB9IH1cbiAgc2V0IF9oaXN0aW9ncmFtKGhpc3Rpb2dyYW0pIHtcbiAgICB0aGlzLmhpc3Rpb2dyYW0gPSBPYmplY3QuYXNzaWduKFxuICAgICAgdGhpcy5faGlzdGlvZ3JhbSxcbiAgICAgIGhpc3Rpb2dyYW1cbiAgICApXG4gIH1cbiAgZ2V0IF9oaXN0b3J5KCkge1xuICAgIHRoaXMuaGlzdG9yeSA9IHRoaXMuaGlzdG9yeSB8fCBbXVxuICAgIHJldHVybiB0aGlzLmhpc3RvcnlcbiAgfVxuICBzZXQgX2hpc3RvcnkoZGF0YSkge1xuICAgIGlmKFxuICAgICAgT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoXG4gICAgKSB7XG4gICAgICBpZih0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVuc2hpZnQodGhpcy5wYXJzZShkYXRhKSlcbiAgICAgICAgdGhpcy5faGlzdG9yeS5zcGxpY2UodGhpcy5faGlzdGlvZ3JhbS5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBkYigpIHsgcmV0dXJuIHRoaXMuX2RiIH1cbiAgZ2V0IF9kYigpIHtcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgfHwgJ3t9J1xuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICBnZXQoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtrZXldXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdGhpcy5faXNTZXR0aW5nID0gdHJ1ZVxuICAgICAgICBsZXQgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYoaW5kZXggPT09IChfYXJndW1lbnRzLmxlbmd0aCAtIDEpKSB0aGlzLl9pc1NldHRpbmcgPSBmYWxzZVxuICAgICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpKSB7XG4gICAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREQigpIHtcbiAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHZhciBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGxldCB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgdGhpcy5fZGIgPSBkYlxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXREQigpIHtcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBkZWxldGUgdGhpcy5fZGJcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBkZWxldGUgZGJba2V5XVxuICAgICAgICB0aGlzLl9kYiA9IGRiXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpIHtcbiAgICBpZighdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldKSB7XG4gICAgICBsZXQgY29udGV4dCA9IHRoaXNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgICAgICB0aGlzLl9kYXRhLFxuICAgICAgICB7XG4gICAgICAgICAgWydfJy5jb25jYXQoa2V5KV06IHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNba2V5XSB9LFxuICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgIGNvbnRleHQuX2NoYW5naW5nW2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgICBpZihjb250ZXh0LmxvY2FsU3RvcmFnZSkgY29udGV4dC5zZXREQihrZXksIHZhbHVlKVxuICAgICAgICAgICAgICBsZXQgc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3NldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgICAgICAgICAgICBsZXQgc2V0RXZlbnROYW1lID0gJ3NldCdcbiAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgIHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICBpZighY29udGV4dC5faXNTZXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgaWYoIU9iamVjdC52YWx1ZXMoY29udGV4dC5fY2hhbmdpbmcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgICAgICBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgZGF0YTogY29udGV4dC5fZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgICAgICAgICAge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0Ll9jaGFuZ2luZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuX2RhdGFcbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0LmNoYW5naW5nXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gICAgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldID0gdmFsdWVcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0RGF0YVByb3BlcnR5KGtleSkge1xuICAgIGxldCB1bnNldFZhbHVlRXZlbnROYW1lID0gWyd1bnNldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgIGxldCB1bnNldEV2ZW50TmFtZSA9ICd1bnNldCdcbiAgICBsZXQgdW5zZXRWYWx1ZSA9IHRoaXMuX2RhdGFba2V5XVxuICAgIGRlbGV0ZSB0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV1cbiAgICBkZWxldGUgdGhpcy5fZGF0YVtrZXldXG4gICAgdGhpcy5lbWl0KFxuICAgICAgdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiB1bnNldFZhbHVlLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdGhpc1xuICAgIClcbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldEV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRoaXNcbiAgICApXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBwYXJzZShkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5fZGF0YSB8fCB7fVxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vZGVsXG4iLCJpbXBvcnQgeyB0eXBlT2YgfSBmcm9tICcuLi9VdGlscy9pbmRleCdcbmltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNsYXNzIFZpZXcgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBiaW5kYWJsZUNsYXNzUHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAndWlFbGVtZW50J1xuICBdIH1cbiAgZ2V0IGNsYXNzRGVmYXVsdFByb3BlcnRpZXMoKSB7IHJldHVybiBbXG4gICAgJ2VsZW1lbnROYW1lJyxcbiAgICAnZWxlbWVudCcsXG4gICAgJ2F0dHJpYnV0ZXMnLFxuICAgICd0ZW1wbGF0ZXMnLFxuICAgICdpbnNlcnQnXG4gIF0gfVxuICBnZXQgX2VsZW1lbnROYW1lKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudC50YWdOYW1lIH1cbiAgc2V0IF9lbGVtZW50TmFtZShlbGVtZW50TmFtZSkge1xuICAgIGlmKCF0aGlzLl9lbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50TmFtZSlcbiAgfVxuICBnZXQgX2VsZW1lbnQoKSB7IHJldHVybiB0aGlzLmVsZW1lbnQgfVxuICBzZXQgX2VsZW1lbnQoZWxlbWVudCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICB0aGlzLmVsZW1lbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudCwge1xuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICB9KVxuICB9XG4gIGdldCBfYXR0cmlidXRlcygpIHtcbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSB0aGlzLmVsZW1lbnQuYXR0cmlidXRlc1xuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNcbiAgfVxuICBzZXQgX2F0dHJpYnV0ZXMoYXR0cmlidXRlcykge1xuICAgIGZvcihsZXQgW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpKSB7XG4gICAgICBpZih0eXBlb2YgYXR0cmlidXRlVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZUtleSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBlbGVtZW50T2JzZXJ2ZXIoKSB7XG4gICAgdGhpcy5fZWxlbWVudE9ic2VydmVyID0gdGhpcy5fZWxlbWVudE9ic2VydmVyIHx8IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuICAgICAgdGhpcy5lbGVtZW50T2JzZXJ2ZS5iaW5kKHRoaXMpXG4gICAgKVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgfVxuICBnZXQgX2luc2VydCgpIHtcbiAgICB0aGlzLmluc2VydCA9IHRoaXMuaW5zZXJ0IHx8IG51bGxcbiAgICByZXR1cm4gdGhpcy5pbnNlcnRcbiAgfVxuICBzZXQgX2luc2VydChpbnNlcnQpIHsgdGhpcy5pbnNlcnQgPSBpbnNlcnQgfVxuICBnZXQgX3RlbXBsYXRlcygpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IHRoaXMudGVtcGxhdGVzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGVzXG4gIH1cbiAgc2V0IF90ZW1wbGF0ZXModGVtcGxhdGVzKSB7IHRoaXMudGVtcGxhdGVzID0gdGVtcGxhdGVzIH1cbiAgcmVzZXRVSUVsZW1lbnRzKCkge1xuICAgIGxldCB1aUVsZW1lbnRTZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7fSxcbiAgICAgIHRoaXMuX3VpRWxlbWVudFNldHRpbmdzXG4gICAgKVxuICAgIHRoaXMudG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cygndWlFbGVtZW50JywgJ29mZicpXG4gICAgdGhpcy5yZW1vdmVVSUVsZW1lbnRzKClcbiAgICB0aGlzLmFkZFVJRWxlbWVudHModWlFbGVtZW50U2V0dGluZ3MpXG4gICAgdGhpcy50b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKCd1aUVsZW1lbnQnLCAnb24nKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZWxlbWVudE9ic2VydmUobXV0YXRpb25SZWNvcmRMaXN0LCBvYnNlcnZlcikge1xuICAgIGZvcihsZXQgW211dGF0aW9uUmVjb3JkSW5kZXgsIG11dGF0aW9uUmVjb3JkXSBvZiBPYmplY3QuZW50cmllcyhtdXRhdGlvblJlY29yZExpc3QpKSB7XG4gICAgICBzd2l0Y2gobXV0YXRpb25SZWNvcmQudHlwZSkge1xuICAgICAgICBjYXNlICdjaGlsZExpc3QnOlxuICAgICAgICAgIGxldCBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMgPSBbJ2FkZGVkTm9kZXMnLCAncmVtb3ZlZE5vZGVzJ11cbiAgICAgICAgICB0aGlzLnJlc2V0VUlFbGVtZW50cygpXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYXV0b0luc2VydCgpIHtcbiAgICBpZih0aGlzLmluc2VydCkge1xuICAgICAgbGV0IHBhcmVudEVsZW1lbnRcbiAgICAgIGlmKHR5cGVPZih0aGlzLmluc2VydC5lbGVtZW50KSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcGFyZW50RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5pbnNlcnQuZWxlbWVudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmVudEVsZW1lbnQgPSB0aGlzLmluc2VydC5lbGVtZW50XG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgcGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICAgIHBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlXG4gICAgICApIHtcbiAgICAgICAgcGFyZW50RWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQodGhpcy5pbnNlcnQubWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgICB9IGVsc2UgaWYocGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XG4gICAgICAgIHBhcmVudEVsZW1lbnRcbiAgICAgICAgICAuZm9yRWFjaCgoX3BhcmVudEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIF9wYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCh0aGlzLmluc2VydC5tZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmKHBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiBqUXVlcnkpIHtcbiAgICAgICAgcGFyZW50RWxlbWVudFxuICAgICAgICAgIC5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgZWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQodGhpcy5pbnNlcnQubWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdXRvUmVtb3ZlKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5lbGVtZW50ICYmXG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICkgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFZpZXdcbiIsImltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNvbnN0IENvbnRyb2xsZXIgPSBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICdtb2RlbCcsXG4gICAgJ3ZpZXcnLFxuICAgICdjb250cm9sbGVyJyxcbiAgICAncm91dGVyJ1xuICBdIH1cbiAgZ2V0IGNsYXNzRGVmYXVsdFByb3BlcnRpZXMoKSB7IHJldHVybiBbXSB9XG59XG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyXG4iLCJpbXBvcnQgeyBwYXJhbXNUb09iamVjdCB9IGZyb20gJy4uL1V0aWxzL2luZGV4J1xuaW1wb3J0IEJhc2UgZnJvbSAnLi4vQmFzZS9pbmRleCdcblxuY29uc3QgUm91dGVyID0gY2xhc3MgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICAgIHRoaXMuYWRkV2luZG93RXZlbnRzKClcbiAgfVxuICBnZXQgY2xhc3NEZWZhdWx0UHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAncm9vdCcsXG4gICAgJ2hhc2hSb3V0aW5nJyxcbiAgICAnY29udHJvbGxlcicsXG4gICAgJ3JvdXRlcydcbiAgXSB9XG4gIGdldCBwcm90b2NvbCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCB9XG4gIGdldCBob3N0bmFtZSgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSB9XG4gIGdldCBwb3J0KCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBvcnQgfVxuICBnZXQgcGF0aG5hbWUoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgfVxuICBnZXQgcGF0aCgpIHtcbiAgICBsZXQgc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lXG4gICAgICAucmVwbGFjZShuZXcgUmVnRXhwKFsnXicsIHRoaXMucm9vdF0uam9pbignJykpLCAnJylcbiAgICAgIC5zcGxpdCgnPycpXG4gICAgICAuc2xpY2UoMCwgMSlcbiAgICAgIFswXVxuICAgIGxldCBmcmFnbWVudHMgPSAoXG4gICAgICBzdHJpbmcubGVuZ3RoID09PSAwXG4gICAgKSA/IFtdXG4gICAgICA6IChcbiAgICAgICAgICBzdHJpbmcubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9eXFwvLykgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL1xcLz8vKVxuICAgICAgICApID8gWycvJ11cbiAgICAgICAgICA6IHN0cmluZ1xuICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAuc3BsaXQoJy8nKVxuICAgIHJldHVybiB7XG4gICAgICBmcmFnbWVudHM6IGZyYWdtZW50cyxcbiAgICAgIHN0cmluZzogc3RyaW5nLFxuICAgIH1cbiAgfVxuICBnZXQgaGFzaCgpIHtcbiAgICBsZXQgc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLmhhc2hcbiAgICAgIC5zbGljZSgxKVxuICAgICAgLnNwbGl0KCc/JylcbiAgICAgIC5zbGljZSgwLCAxKVxuICAgICAgWzBdXG4gICAgbGV0IGZyYWdtZW50cyA9IChcbiAgICAgIHN0cmluZy5sZW5ndGggPT09IDBcbiAgICApID8gW11cbiAgICAgIDogKFxuICAgICAgICAgIHN0cmluZy5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL15cXC8vKSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXFwvPy8pXG4gICAgICAgICkgPyBbJy8nXVxuICAgICAgICAgIDogc3RyaW5nXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC8kLywgJycpXG4gICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgcmV0dXJuIHtcbiAgICAgIGZyYWdtZW50czogZnJhZ21lbnRzLFxuICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgfVxuICB9XG4gIGdldCBwYXJhbWV0ZXJzKCkge1xuICAgIGxldCBzdHJpbmdcbiAgICBsZXQgZGF0YVxuICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKC9cXD8vKSkge1xuICAgICAgbGV0IHBhcmFtZXRlcnMgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgICAgICAuc3BsaXQoJz8nKVxuICAgICAgICAuc2xpY2UoLTEpXG4gICAgICAgIC5qb2luKCcnKVxuICAgICAgc3RyaW5nID0gcGFyYW1ldGVyc1xuICAgICAgZGF0YSA9IHBhcmFtZXRlcnNcbiAgICAgICAgLnNwbGl0KCcmJylcbiAgICAgICAgLnJlZHVjZSgoXG4gICAgICAgICAgX3BhcmFtZXRlcnMsXG4gICAgICAgICAgcGFyYW1ldGVyXG4gICAgICAgICkgPT4ge1xuICAgICAgICAgIGxldCBwYXJhbWV0ZXJEYXRhID0gcGFyYW1ldGVyLnNwbGl0KCc9JylcbiAgICAgICAgICBfcGFyYW1ldGVyc1twYXJhbWV0ZXJEYXRhWzBdXSA9IHBhcmFtZXRlckRhdGFbMV1cbiAgICAgICAgICByZXR1cm4gX3BhcmFtZXRlcnNcbiAgICAgICAgfSwge30pXG4gICAgfSBlbHNlIHtcbiAgICAgIHN0cmluZyA9ICcnXG4gICAgICBkYXRhID0ge31cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0cmluZzogc3RyaW5nLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH1cbiAgfVxuICBnZXQgX3Jvb3QoKSB7IHJldHVybiB0aGlzLnJvb3QgfHwgJy8nIH1cbiAgc2V0IF9yb290KHJvb3QpIHsgdGhpcy5yb290ID0gcm9vdCB9XG4gIGdldCBfaGFzaFJvdXRpbmcoKSB7IHJldHVybiB0aGlzLmhhc2hSb3V0aW5nIHx8IGZhbHNlIH1cbiAgc2V0IF9oYXNoUm91dGluZyhoYXNoUm91dGluZykgeyB0aGlzLmhhc2hSb3V0aW5nID0gaGFzaFJvdXRpbmcgfVxuICBnZXQgX3JvdXRlRGF0YSgpIHt9XG4gIGdldCBfcm91dGVDb250cm9sbGVyRGF0YSgpIHt9XG4gIGdldCBfcm91dGVzKCkgeyByZXR1cm4gdGhpcy5yb3V0ZXMgfVxuICBzZXQgX3JvdXRlcyhyb3V0ZXMpIHsgdGhpcy5yb3V0ZXMgPSByb3V0ZXMgfVxuICBnZXQgX2NvbnRyb2xsZXIoKSB7IHJldHVybiB0aGlzLmNvbnRyb2xsZXIgfVxuICBzZXQgX2NvbnRyb2xsZXIoY29udHJvbGxlcikgeyB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyIH1cbiAgZ2V0IHJvdXRlRGF0YSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm9vdDogdGhpcy5yb290LFxuICAgICAgcHJvdG9jb2w6IHRoaXMucHJvdG9jb2wsXG4gICAgICBob3N0bmFtZTogdGhpcy5ob3N0bmFtZSxcbiAgICAgIHBvcnQ6IHRoaXMucG9ydCxcbiAgICAgIHBhdGhuYW1lOiB0aGlzLnBhdGhuYW1lLFxuICAgICAgcGF0aDogdGhpcy5wYXRoLFxuICAgICAgaGFzaDogdGhpcy5oYXNoLFxuICAgICAgcGFyYW1ldGVyczogdGhpcy5wYXJhbWV0ZXJzLFxuICAgIH1cbiAgfVxuICBtYXRjaFJvdXRlKHJvdXRlRnJhZ21lbnRzLCBjdXJyZW50Um91dGVGcmFnbWVudHMpIHtcbiAgICBsZXQgcm91dGVNYXRjaGVzID0gbmV3IEFycmF5KClcbiAgICBpZihyb3V0ZUZyYWdtZW50cy5sZW5ndGggPT09IGN1cnJlbnRSb3V0ZUZyYWdtZW50cy5sZW5ndGgpIHtcbiAgICAgIHJvdXRlTWF0Y2hlcyA9IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgIC5yZWR1Y2UoKF9yb3V0ZU1hdGNoZXMsIHJvdXRlRnJhZ21lbnQsIHJvdXRlRnJhZ21lbnRJbmRleCkgPT4ge1xuICAgICAgICAgIGxldCBjdXJyZW50Um91dGVGcmFnbWVudCA9IGN1cnJlbnRSb3V0ZUZyYWdtZW50c1tyb3V0ZUZyYWdtZW50SW5kZXhdXG4gICAgICAgICAgaWYocm91dGVGcmFnbWVudC5tYXRjaCgvXlxcOi8pKSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2godHJ1ZSlcbiAgICAgICAgICB9IGVsc2UgaWYocm91dGVGcmFnbWVudCA9PT0gY3VycmVudFJvdXRlRnJhZ21lbnQpIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaCh0cnVlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2goZmFsc2UpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcm91dGVNYXRjaGVzXG4gICAgICAgIH0sIFtdKVxuICAgIH0gZWxzZSB7XG4gICAgICByb3V0ZU1hdGNoZXMucHVzaChmYWxzZSlcbiAgICB9XG4gICAgcmV0dXJuIChyb3V0ZU1hdGNoZXMuaW5kZXhPZihmYWxzZSkgPT09IC0xKVxuICAgICAgPyB0cnVlXG4gICAgICA6IGZhbHNlXG4gIH1cbiAgZ2V0Um91dGUocm91dGVEYXRhKSB7XG4gICAgbGV0IHJvdXRlcyA9IE9iamVjdC5lbnRyaWVzKHRoaXMucm91dGVzKVxuICAgICAgLnJlZHVjZSgoXG4gICAgICAgIF9yb3V0ZXMsXG4gICAgICAgIFtyb3V0ZU5hbWUsIHJvdXRlU2V0dGluZ3NdKSA9PiB7XG4gICAgICAgICAgbGV0IHJvdXRlRnJhZ21lbnRzID0gKFxuICAgICAgICAgICAgcm91dGVOYW1lLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgICAgcm91dGVOYW1lLm1hdGNoKC9eXFwvLylcbiAgICAgICAgICApID8gW3JvdXRlTmFtZV1cbiAgICAgICAgICAgIDogKHJvdXRlTmFtZS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgID8gWycnXVxuICAgICAgICAgICAgICA6IHJvdXRlTmFtZVxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC8kLywgJycpXG4gICAgICAgICAgICAgICAgICAuc3BsaXQoJy8nKVxuICAgICAgICAgIHJvdXRlU2V0dGluZ3MuZnJhZ21lbnRzID0gcm91dGVGcmFnbWVudHNcbiAgICAgICAgICBfcm91dGVzW3JvdXRlRnJhZ21lbnRzLmpvaW4oJy8nKV0gPSByb3V0ZVNldHRpbmdzXG4gICAgICAgICAgcmV0dXJuIF9yb3V0ZXNcbiAgICAgICAgfSxcbiAgICAgICAge31cbiAgICAgIClcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhyb3V0ZXMpXG4gICAgICAuZmluZCgocm91dGUpID0+IHtcbiAgICAgICAgbGV0IHJvdXRlRnJhZ21lbnRzID0gcm91dGUuZnJhZ21lbnRzXG4gICAgICAgIGxldCByb3V0ZURhdGFGcmFnbWVudHMgPSAodGhpcy5oYXNoUm91dGluZylcbiAgICAgICAgICA/IHJvdXRlRGF0YS5oYXNoLmZyYWdtZW50c1xuICAgICAgICAgIDogcm91dGVEYXRhLnBhdGguZnJhZ21lbnRzXG4gICAgICAgIGxldCBtYXRjaFJvdXRlID0gdGhpcy5tYXRjaFJvdXRlKFxuICAgICAgICAgIHJvdXRlRnJhZ21lbnRzLFxuICAgICAgICAgIHJvdXRlRGF0YUZyYWdtZW50cyxcbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gbWF0Y2hSb3V0ZSA9PT0gdHJ1ZVxuICAgICAgfSlcbiAgfVxuICBwb3BTdGF0ZShldmVudCkge1xuICAgIGxldCByb3V0ZURhdGEgPSB0aGlzLnJvdXRlRGF0YVxuICAgIGxldCByb3V0ZSA9IHRoaXMuZ2V0Um91dGUocm91dGVEYXRhKVxuICAgIGlmKHJvdXRlKSB7XG4gICAgICB0aGlzLmNvbnRyb2xsZXJbcm91dGUuY2FsbGJhY2tdKHJvdXRlRGF0YSlcbiAgICB9XG4gIH1cbiAgYWRkV2luZG93RXZlbnRzKCkge1xuICAgIHdpbmRvdy5vbigncG9wc3RhdGUnLCB0aGlzLnBvcFN0YXRlLmJpbmQodGhpcykpXG4gIH1cbiAgcmVtb3ZlV2luZG93RXZlbnRzKCkge1xuICAgIHdpbmRvdy5vZmYoJ3BvcHN0YXRlJywgdGhpcy5wb3BTdGF0ZS5iaW5kKHRoaXMpKVxuICB9XG4gIG5hdmlnYXRlKHBhdGgpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGhcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgUm91dGVyXG4iLCJpbXBvcnQgJy4vU2hpbXMvZXZlbnRzJ1xuaW1wb3J0IEV2ZW50cyBmcm9tICcuL0V2ZW50cy9pbmRleCdcbmltcG9ydCBDaGFubmVscyBmcm9tICcuL0NoYW5uZWxzL2luZGV4J1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi9VdGlscy9pbmRleCdcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4vU2VydmljZS9pbmRleCdcbmltcG9ydCBNb2RlbCBmcm9tICcuL01vZGVsL2luZGV4J1xuaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3L2luZGV4J1xuaW1wb3J0IENvbnRyb2xsZXIgZnJvbSAnLi9Db250cm9sbGVyL2luZGV4J1xuaW1wb3J0IFJvdXRlciBmcm9tICcuL1JvdXRlci9pbmRleCdcbmNvbnN0IE1WQyA9IHtcbiAgRXZlbnRzLFxuICBDaGFubmVscyxcbiAgVXRpbHMsXG4gIFNlcnZpY2UsXG4gIE1vZGVsLFxuICBWaWV3LFxuICBDb250cm9sbGVyLFxuICBSb3V0ZXIsXG59XG5leHBvcnQgZGVmYXVsdCBNVkNcbiJdLCJuYW1lcyI6WyJFdmVudFRhcmdldCIsInByb3RvdHlwZSIsIm9uIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9mZiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJFdmVudHMiLCJjb25zdHJ1Y3RvciIsIl9ldmVudHMiLCJldmVudHMiLCJnZXRFdmVudENhbGxiYWNrcyIsImV2ZW50TmFtZSIsImdldEV2ZW50Q2FsbGJhY2tOYW1lIiwiZXZlbnRDYWxsYmFjayIsIm5hbWUiLCJsZW5ndGgiLCJnZXRFdmVudENhbGxiYWNrR3JvdXAiLCJldmVudENhbGxiYWNrcyIsImV2ZW50Q2FsbGJhY2tOYW1lIiwiZXZlbnRDYWxsYmFja0dyb3VwIiwicHVzaCIsImFyZ3VtZW50cyIsIk9iamVjdCIsImtleXMiLCJlbWl0IiwiZXZlbnREYXRhIiwiX2FyZ3VtZW50cyIsInZhbHVlcyIsImVudHJpZXMiLCJldmVudENhbGxiYWNrR3JvdXBOYW1lIiwiYWRkaXRpb25hbEFyZ3VtZW50cyIsInNwbGljZSIsIkNoYW5uZWwiLCJfcmVzcG9uc2VzIiwicmVzcG9uc2VzIiwicmVzcG9uc2UiLCJyZXNwb25zZU5hbWUiLCJyZXNwb25zZUNhbGxiYWNrIiwicmVxdWVzdCIsIkFycmF5Iiwic2xpY2UiLCJjYWxsIiwiQ2hhbm5lbHMiLCJfY2hhbm5lbHMiLCJjaGFubmVscyIsImNoYW5uZWwiLCJjaGFubmVsTmFtZSIsInBhcmFtc1RvT2JqZWN0IiwicGFyYW1zIiwic3BsaXQiLCJvYmplY3QiLCJmb3JFYWNoIiwicGFyYW1EYXRhIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiSlNPTiIsInBhcnNlIiwic3RyaW5naWZ5IiwidHlwZU9mIiwiZGF0YSIsIl9vYmplY3QiLCJpc0FycmF5IiwiVUlEIiwidXVpZCIsImlpIiwiTWF0aCIsInJhbmRvbSIsInRvU3RyaW5nIiwiQmFzZSIsInNldHRpbmdzIiwiY29uZmlndXJhdGlvbiIsImFkZENsYXNzRGVmYXVsdFByb3BlcnRpZXMiLCJhZGRCaW5kYWJsZUNsYXNzUHJvcGVydGllcyIsIl9zZXR0aW5ncyIsIl9jb25maWd1cmF0aW9uIiwidWlkIiwiX3VpZCIsIl9uYW1lIiwiY2xhc3NEZWZhdWx0UHJvcGVydGllcyIsImNsYXNzU2V0dGluZyIsImNvbmNhdCIsInNldHRpbmdLZXkiLCJpbmRleE9mIiwiYmluZGFibGVDbGFzc1Byb3BlcnR5RXh0ZW5zaW9ucyIsIl91aUVsZW1lbnRTZXR0aW5ncyIsInVpRWxlbWVudFNldHRpbmdzIiwiY2FwaXRhbGl6ZVByb3BlcnR5TmFtZSIsInByb3BlcnR5TmFtZSIsInJlcGxhY2UiLCJmaXJzdENoYXJhY3RlciIsInN1YnN0cmluZyIsInRvVXBwZXJDYXNlIiwiY2xhc3NEZWZhdWx0UHJvcGVydHkiLCJwcm9wZXJ0eSIsImRlZmluZVByb3BlcnR5Iiwid3JpdGFibGUiLCJ2YWx1ZSIsImJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzIiwiYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSIsInByb3BlcnR5TmFtZUV4dGVuc2lvbiIsImFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eSIsImNvbnRleHQiLCJhZGRCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lIiwicmVtb3ZlQmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSIsImN1cnJlbnRQcm9wZXJ0eVZhbHVlcyIsImRlZmluZVByb3BlcnRpZXMiLCJnZXQiLCJzZXQiLCJrZXkiLCJlbGVtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInJlc2V0VGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyIsInRvZ2dsZVRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMiLCJjbGFzc1R5cGUiLCJtZXRob2QiLCJjbGFzc1R5cGVFdmVudERhdGEiLCJjbGFzc1R5cGVDYWxsYmFja05hbWUiLCJjbGFzc1R5cGVUYXJnZXROYW1lIiwiY2xhc3NUeXBlRXZlbnROYW1lIiwiY2xhc3NUeXBlVGFyZ2V0IiwiY2xhc3NUeXBlRXZlbnRDYWxsYmFjayIsImJpbmQiLCJOb2RlTGlzdCIsImZyb20iLCJfY2xhc3NUeXBlVGFyZ2V0IiwiSFRNTEVsZW1lbnQiLCJjbGFzc1R5cGVFdmVudENhbGxiYWNrTmFtZXNwYWNlIiwiZXJyb3IiLCJSZWZlcmVuY2VFcnJvciIsIlNlcnZpY2UiLCJhZGRQcm9wZXJ0aWVzIiwiX2RlZmF1bHRzIiwiZGVmYXVsdHMiLCJjb250ZW50VHlwZSIsInJlc3BvbnNlVHlwZSIsIl9yZXNwb25zZVR5cGVzIiwiX3Jlc3BvbnNlVHlwZSIsIl94aHIiLCJmaW5kIiwicmVzcG9uc2VUeXBlSXRlbSIsIl90eXBlIiwidHlwZSIsIl91cmwiLCJ1cmwiLCJfaGVhZGVycyIsImhlYWRlcnMiLCJoZWFkZXIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwiX2RhdGEiLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3RhdHVzIiwiYWJvcnQiLCJvcGVuIiwib25sb2FkIiwib25lcnJvciIsInNlbmQiLCJ0aGVuIiwiY3VycmVudFRhcmdldCIsImNhdGNoIiwiZW5hYmxlIiwiZGlzYWJsZSIsIk1vZGVsIiwiX2lzU2V0dGluZyIsImlzU2V0dGluZyIsIl9jaGFuZ2luZyIsImNoYW5naW5nIiwiX2xvY2FsU3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsIl9oaXN0aW9ncmFtIiwiaGlzdGlvZ3JhbSIsImFzc2lnbiIsIl9oaXN0b3J5IiwiaGlzdG9yeSIsInVuc2hpZnQiLCJkYiIsIl9kYiIsImdldEl0ZW0iLCJlbmRwb2ludCIsInNldEl0ZW0iLCJpbmRleCIsInNldERhdGFQcm9wZXJ0eSIsInVuc2V0IiwidW5zZXREYXRhUHJvcGVydHkiLCJzZXREQiIsInVuc2V0REIiLCJjb25maWd1cmFibGUiLCJzZXRWYWx1ZUV2ZW50TmFtZSIsImpvaW4iLCJzZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlRXZlbnROYW1lIiwidW5zZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlIiwiVmlldyIsIl9lbGVtZW50TmFtZSIsIl9lbGVtZW50IiwidGFnTmFtZSIsImVsZW1lbnROYW1lIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZWxlbWVudE9ic2VydmVyIiwib2JzZXJ2ZSIsInN1YnRyZWUiLCJjaGlsZExpc3QiLCJfYXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVLZXkiLCJhdHRyaWJ1dGVWYWx1ZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsIl9lbGVtZW50T2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZWxlbWVudE9ic2VydmUiLCJfaW5zZXJ0IiwiaW5zZXJ0IiwiX3RlbXBsYXRlcyIsInRlbXBsYXRlcyIsInJlc2V0VUlFbGVtZW50cyIsInJlbW92ZVVJRWxlbWVudHMiLCJhZGRVSUVsZW1lbnRzIiwibXV0YXRpb25SZWNvcmRMaXN0Iiwib2JzZXJ2ZXIiLCJtdXRhdGlvblJlY29yZEluZGV4IiwibXV0YXRpb25SZWNvcmQiLCJhdXRvSW5zZXJ0IiwicGFyZW50RWxlbWVudCIsIk5vZGUiLCJpbnNlcnRBZGphY2VudEVsZW1lbnQiLCJfcGFyZW50RWxlbWVudCIsImpRdWVyeSIsImVhY2giLCJhdXRvUmVtb3ZlIiwicmVtb3ZlQ2hpbGQiLCJDb250cm9sbGVyIiwiUm91dGVyIiwiYWRkV2luZG93RXZlbnRzIiwicHJvdG9jb2wiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhvc3RuYW1lIiwicG9ydCIsInBhdGhuYW1lIiwicGF0aCIsInN0cmluZyIsIlJlZ0V4cCIsInJvb3QiLCJmcmFnbWVudHMiLCJtYXRjaCIsImhhc2giLCJwYXJhbWV0ZXJzIiwiaHJlZiIsInJlZHVjZSIsIl9wYXJhbWV0ZXJzIiwicGFyYW1ldGVyIiwicGFyYW1ldGVyRGF0YSIsIl9yb290IiwiX2hhc2hSb3V0aW5nIiwiaGFzaFJvdXRpbmciLCJfcm91dGVEYXRhIiwiX3JvdXRlQ29udHJvbGxlckRhdGEiLCJfcm91dGVzIiwicm91dGVzIiwiX2NvbnRyb2xsZXIiLCJjb250cm9sbGVyIiwicm91dGVEYXRhIiwibWF0Y2hSb3V0ZSIsInJvdXRlRnJhZ21lbnRzIiwiY3VycmVudFJvdXRlRnJhZ21lbnRzIiwicm91dGVNYXRjaGVzIiwiX3JvdXRlTWF0Y2hlcyIsInJvdXRlRnJhZ21lbnQiLCJyb3V0ZUZyYWdtZW50SW5kZXgiLCJjdXJyZW50Um91dGVGcmFnbWVudCIsImdldFJvdXRlIiwicm91dGVOYW1lIiwicm91dGVTZXR0aW5ncyIsInJvdXRlIiwicm91dGVEYXRhRnJhZ21lbnRzIiwicG9wU3RhdGUiLCJldmVudCIsImNhbGxiYWNrIiwicmVtb3ZlV2luZG93RXZlbnRzIiwibmF2aWdhdGUiLCJNVkMiLCJVdGlscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0VBQUFBLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIsR0FBMkJGLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIsSUFBNEJGLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkUsZ0JBQTdFO0VBQ0FILFdB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
