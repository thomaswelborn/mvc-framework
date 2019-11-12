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

    get _uiElementSettings() {
      this.uiElementSettings = this.uiElementSettings || {};
      return this.uiElementSettings;
    }

    set _uiElementSettings(uiElementSettings) {
      this.uiElementSettings = uiElementSettings;
    }

    getBindableClassPropertyMethods(bindableClassPropertyName) {
      switch (bindableClassPropertyName) {
        case 'data':
          return [bindableClassPropertyName.concat(''), bindableClassPropertyName.concat('Events'), bindableClassPropertyName.concat('Callbacks')];

        default:
          return [bindableClassPropertyName.concat('s'), bindableClassPropertyName.concat('Events'), bindableClassPropertyName.concat('Callbacks')];
      }
    }

    capitalizePropertyName(bindableClassPropertyName) {
      if (bindableClassPropertyName.slice(0, 2) === 'ui') {
        return bindableClassPropertyName.replace(/^ui/, 'UI');
      } else {
        var firstCharacter = bindableClassPropertyName.substring(0, 1).toUpperCase();
        return bindableClassPropertyName.replace(/^./, firstCharacter);
      }
    }

    addClassDefaultProperties() {
      this.classDefaultProperties.forEach((classDefaultProperty, classDefaultPropertyIndex) => {
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
          var bindableClassPropertyMethods = this.getBindableClassPropertyMethods(bindableClassPropertyName);
          bindableClassPropertyMethods.forEach((bindableClassPropertyMethod, bindableClassPropertyMethodIndex) => {
            this.addBindableClassProperty(bindableClassPropertyMethod);

            if (bindableClassPropertyMethodIndex === bindableClassPropertyMethods.length - 1) {
              this.toggleTargetBindableClassEvents(bindableClassPropertyName, 'on');
            }
          });
        });
      }

      return this;
    }

    addBindableClassProperty(bindableClassPropertyName) {
      var context = this;
      var capitalizePropertyName = this.capitalizePropertyName(bindableClassPropertyName);
      var addBindableClassPropertyName = 'add'.concat(capitalizePropertyName);
      var removeBindableClassPropertyName = 'remove'.concat(capitalizePropertyName);

      if (bindableClassPropertyName === 'uiElements') {
        context._uiElementSettings = this[bindableClassPropertyName];
      }

      var currentPropertyValues = this[bindableClassPropertyName];
      Object.defineProperties(this, {
        [bindableClassPropertyName]: {
          writable: true,
          value: currentPropertyValues
        },
        ['_'.concat(bindableClassPropertyName)]: {
          get() {
            context[bindableClassPropertyName] = context[bindableClassPropertyName] || {};
            return context[bindableClassPropertyName];
          },

          set(values) {
            Object.entries(values).forEach((_ref) => {
              var [key, value] = _ref;

              switch (bindableClassPropertyName) {
                case 'uiElements':
                  context._uiElementSettings[key] = value;
                  context['_'.concat(bindableClassPropertyName)][key] = context.element.querySelectorAll(value);
                  break;

                default:
                  context['_'.concat(bindableClassPropertyName)][key] = value;
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
              context['_'.concat(bindableClassPropertyName)] = {
                [key]: value
              };
            } else if (arguments.length === 1) {
              var values = arguments[0];
              context['_'.concat(bindableClassPropertyName)] = values;
            }

            this.resetTargetBindableClassEvents(bindableClassPropertyName);
            return context;
          }
        },
        [removeBindableClassPropertyName]: {
          value: function value() {
            if (arguments.length === 1) {
              var key = arguments[0];

              switch (bindableClassPropertyName) {
                case 'uiElements':
                  delete context['_'.concat(bindableClassPropertyName)][key];
                  delete context['_'.concat('uiElementSettings')][key];
                  break;

                default:
                  delete context['_'.concat(bindableClassPropertyName)][key];
                  break;
              }
            } else if (arguments.length === 0) {
              Object.keys(context['_'.concat(bindableClassPropertyName)]).forEach(key => {
                switch (bindableClassPropertyName) {
                  case 'uiElements':
                    delete context['_'.concat(bindableClassPropertyName)][key];
                    delete context['_'.concat('uiElementSettings')][key];
                    break;

                  default:
                    delete context['_'.concat(bindableClassPropertyName)][key];
                    break;
                }
              });
            }

            this.resetTargetBindableClassEvents(bindableClassPropertyName);
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
            var classTypeEventCallback = this[classType.concat('Callbacks')][classTypeCallbackName].bind(this);
            this.toggleTargetBindableClassEvent(classType, classTypeTarget, classTypeEventName, classTypeEventCallback, method);
          } catch (error) {
            throw new ReferenceError(error);
          }
        });
      }

      return this;
    }

    toggleTargetBindableClassEvent(classType, classTypeTarget, classTypeEventName, classTypeEventCallback, method) {
      switch (method) {
        case 'on':
          switch (classType) {
            case 'uiElement':
              if (classTypeTarget instanceof NodeList) {
                Array.from(classTypeTarget).forEach(_classTypeTarget => {
                  _classTypeTarget[method](classTypeEventName, classTypeEventCallback);
                });
              } else if (classTypeTarget instanceof HTMLElement) {
                classTypeTarget[method](classTypeEventName, classTypeEventCallback);
              }

              break;

            default:
              classTypeTarget[method](classTypeEventName, classTypeEventCallback);
              break;
          }

          break;

        case 'off':
          switch (classType) {
            case 'uiElement':
              if (classTypeTarget instanceof NodeList) {
                Array.from(classTypeTarget).forEach(_classTypeTarget => {
                  _classTypeTarget[method](classTypeEventName, classTypeEventCallback);
                });
              } else if (classTypeTarget instanceof HTMLElement) {
                classTypeTarget[method](classTypeEventName, classTypeEventCallback);
              }

              break;

            default:
              classTypeTarget[method](classTypeEventName, classTypeEventCallback);
              break;
          }

          break;
      }
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

    get location() {
      return {
        root: this.root,
        path: this.path,
        hash: this.hash,
        parameters: this.parameters
      };
    }

    matchRoute(routeFragments, locationFragments) {
      var routeMatches = new Array();

      if (routeFragments.length === locationFragments.length) {
        routeMatches = routeFragments.reduce((_routeMatches, routeFragment, routeFragmentIndex) => {
          var locationFragment = locationFragments[routeFragmentIndex];

          if (routeFragment.match(/^\:/)) {
            _routeMatches.push(true);
          } else if (routeFragment === locationFragment) {
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

    getRoute(location) {
      var routes = Object.entries(this.routes).reduce((_routes, _ref) => {
        var [routeName, routeSettings] = _ref;
        var routeFragments = routeName.length === 1 && routeName.match(/^\//) ? [routeName] : routeName.length === 0 ? [''] : routeName.replace(/^\//, '').replace(/\/$/, '').split('/');
        routeSettings.fragments = routeFragments;
        _routes[routeFragments.join('/')] = routeSettings;
        return _routes;
      }, {});
      return Object.values(routes).find(route => {
        var routeFragments = route.fragments;
        var locationFragments = this.hashRouting ? location.hash.fragments : location.path.fragments;
        var matchRoute = this.matchRoute(routeFragments, locationFragments);
        return matchRoute === true;
      });
    }

    popState(event) {
      var location = this.location;
      var route = this.getRoute(location);
      var routeData = {
        route: route,
        location: location
      };

      if (route) {
        this.controller[route.callback](routeData);
        this.emit('change', {
          name: 'change',
          data: routeData
        }, this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL3R5cGVPZi5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVXRpbHMvdWlkLmpzIiwiLi4vLi4vc291cmNlL01WQy9CYXNlL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9TZXJ2aWNlL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Nb2RlbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVmlldy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29udHJvbGxlci9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvUm91dGVyL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJFdmVudFRhcmdldC5wcm90b3R5cGUub24gPSBFdmVudFRhcmdldC5wcm90b3R5cGUub24gfHwgRXZlbnRUYXJnZXQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXJcclxuRXZlbnRUYXJnZXQucHJvdG90eXBlLm9mZiA9IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vZmYgfHwgRXZlbnRUYXJnZXQucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXJcclxuIiwiY2xhc3MgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9ldmVudHMoKSB7XHJcbiAgICB0aGlzLmV2ZW50cyA9IHRoaXMuZXZlbnRzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5ldmVudHNcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKSB7IHJldHVybiB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSB8fCB7fSB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIChldmVudENhbGxiYWNrLm5hbWUubGVuZ3RoKVxyXG4gICAgICA/IGV2ZW50Q2FsbGJhY2submFtZVxyXG4gICAgICA6ICdhbm9ueW1vdXNGdW5jdGlvbidcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSkge1xyXG4gICAgcmV0dXJuIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSB8fCBbXVxyXG4gIH1cclxuICBvbihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tOYW1lID0gdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tHcm91cCA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSlcclxuICAgIGV2ZW50Q2FsbGJhY2tHcm91cC5wdXNoKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gPSBldmVudENhbGxiYWNrR3JvdXBcclxuICAgIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdID0gZXZlbnRDYWxsYmFja3NcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIG9mZigpIHtcclxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIGNhc2UgMDpcclxuICAgICAgICBkZWxldGUgdGhpcy5ldmVudHNcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2sgPSBhcmd1bWVudHNbMV1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFja05hbWUgPSAodHlwZW9mIGV2ZW50Q2FsbGJhY2sgPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgPyBldmVudENhbGxiYWNrXHJcbiAgICAgICAgICA6IHRoaXMuZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgICAgICBpZih0aGlzLl9ldmVudHNbZXZlbnROYW1lXSkge1xyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdW2V2ZW50Q2FsbGJhY2tOYW1lXVxyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKS5sZW5ndGggPT09IDBcclxuICAgICAgICAgICkgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBlbWl0KGV2ZW50TmFtZSwgZXZlbnREYXRhKSB7XHJcbiAgICBsZXQgX2FyZ3VtZW50cyA9IE9iamVjdC52YWx1ZXMoYXJndW1lbnRzKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gT2JqZWN0LmVudHJpZXMoXHJcbiAgICAgIHRoaXMuZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgKVxyXG4gICAgZm9yKGxldCBbZXZlbnRDYWxsYmFja0dyb3VwTmFtZSwgZXZlbnRDYWxsYmFja0dyb3VwXSBvZiBldmVudENhbGxiYWNrcykge1xyXG4gICAgICBmb3IobGV0IGV2ZW50Q2FsbGJhY2sgb2YgZXZlbnRDYWxsYmFja0dyb3VwKSB7XHJcbiAgICAgICAgbGV0IGFkZGl0aW9uYWxBcmd1bWVudHMgPSBfYXJndW1lbnRzLnNwbGljZSgyKSB8fCBbXVxyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2soZXZlbnREYXRhLCAuLi5hZGRpdGlvbmFsQXJndW1lbnRzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBFdmVudHNcclxuIiwiY29uc3QgQ2hhbm5lbCA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9yZXNwb25zZXMoKSB7XHJcbiAgICB0aGlzLnJlc3BvbnNlcyA9IHRoaXMucmVzcG9uc2VzIHx8IHRoaXMucmVzcG9uc2VzXHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZihyZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdID0gcmVzcG9uc2VDYWxsYmFja1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZV1cclxuICAgIH1cclxuICB9XHJcbiAgcmVxdWVzdChyZXNwb25zZU5hbWUpIHtcclxuICAgIGlmKHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKSB7XHJcbiAgICAgIGxldCBfYXJndW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5zbGljZSgxKVxyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0oLi4uX2FyZ3VtZW50cylcclxuICAgIH1cclxuICB9XHJcbiAgb2ZmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yKGxldCBbcmVzcG9uc2VOYW1lXSBvZiBPYmplY3Qua2V5cyh0aGlzLl9yZXNwb25zZXMpKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQ2hhbm5lbFxyXG4iLCJpbXBvcnQgQ2hhbm5lbCBmcm9tICcuL0NoYW5uZWwvaW5kZXgnXHJcbmNvbnN0IENoYW5uZWxzID0gY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2NoYW5uZWxzKCkge1xyXG4gICAgdGhpcy5jaGFubmVscyA9IHRoaXMuY2hhbm5lbHMgfHwge31cclxuICAgIHJldHVybiB0aGlzLmNoYW5uZWxzXHJcbiAgfVxyXG4gIGNoYW5uZWwoY2hhbm5lbE5hbWUpIHtcclxuICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXSA9ICh0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0pXHJcbiAgICAgID8gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgIDogbmV3IENoYW5uZWwoKVxyXG4gICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxuICBvZmYoY2hhbm5lbE5hbWUpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQ2hhbm5lbHNcclxuIiwiY29uc3QgdHlwZU9mID0gZnVuY3Rpb24gdHlwZU9mKGRhdGEpIHtcclxuICBzd2l0Y2godHlwZW9mIGRhdGEpIHtcclxuICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgIGxldCBfb2JqZWN0XHJcbiAgICAgIGlmKFxyXG4gICAgICAgIEFycmF5LmlzQXJyYXkoZGF0YSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgcmV0dXJuICdhcnJheSdcclxuICAgICAgfSBlbHNlIGlmKFxyXG4gICAgICAgIGRhdGEgIT09IG51bGxcclxuICAgICAgKSB7XHJcbiAgICAgICAgcmV0dXJuICdvYmplY3QnXHJcbiAgICAgIH0gZWxzZSBpZihcclxuICAgICAgICBkYXRhID09PSBudWxsXHJcbiAgICAgICkge1xyXG4gICAgICAgIHJldHVybiAnbnVsbCdcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gX29iamVjdFxyXG4gICAgY2FzZSAnc3RyaW5nJzpcclxuICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICBjYXNlICdib29sZWFuJzpcclxuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XHJcbiAgICBjYXNlICdmdW5jdGlvbic6XHJcbiAgICAgIHJldHVybiB0eXBlb2YgZGF0YVxyXG4gICAgICBicmVha1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCB0eXBlT2ZcclxuIiwiY29uc3QgVUlEID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB1dWlkID0gJycsIGlpXHJcbiAgZm9yIChpaSA9IDA7IGlpIDwgMzI7IGlpICs9IDEpIHtcclxuICAgIHN3aXRjaCAoaWkpIHtcclxuICAgICAgY2FzZSA4OlxyXG4gICAgICBjYXNlIDIwOlxyXG4gICAgICAgIHV1aWQgKz0gJy0nO1xyXG4gICAgICAgIHV1aWQgKz0gKE1hdGgucmFuZG9tKCkgKiAxNiB8IDApLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMTI6XHJcbiAgICAgICAgdXVpZCArPSAnLSdcclxuICAgICAgICB1dWlkICs9ICc0J1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMTY6XHJcbiAgICAgICAgdXVpZCArPSAnLSdcclxuICAgICAgICB1dWlkICs9IChNYXRoLnJhbmRvbSgpICogNCB8IDgpLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgdXVpZCArPSAoTWF0aC5yYW5kb20oKSAqIDE2IHwgMCkudG9TdHJpbmcoMTYpXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB1dWlkXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgVUlEXHJcbiIsImltcG9ydCB7IFVJRCB9IGZyb20gJy4uL1V0aWxzL2luZGV4J1xyXG5pbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleCdcclxuXHJcbmNsYXNzIEJhc2UgZXh0ZW5kcyBFdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzLCBjb25maWd1cmF0aW9uKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgICB0aGlzLmFkZENsYXNzRGVmYXVsdFByb3BlcnRpZXMoKVxyXG4gICAgdGhpcy5hZGRCaW5kYWJsZUNsYXNzUHJvcGVydGllcygpXHJcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvblxyXG4gIH1cclxuICBnZXQgdWlkKCkge1xyXG4gICAgdGhpcy5fdWlkID0gKHRoaXMuX3VpZClcclxuICAgID8gdGhpcy5fdWlkXHJcbiAgICA6IFVJRCgpXHJcbiAgICByZXR1cm4gdGhpcy5fdWlkXHJcbiAgfVxyXG4gIGdldCBfbmFtZSgpIHsgcmV0dXJuIHRoaXMubmFtZSB9XHJcbiAgc2V0IF9uYW1lKG5hbWUpIHsgdGhpcy5uYW1lID0gbmFtZSB9XHJcbiAgZ2V0IF9zZXR0aW5ncygpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5nc1xyXG4gIH1cclxuICBzZXQgX3NldHRpbmdzKHNldHRpbmdzKSB7XHJcbiAgICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzIHx8IHt9XHJcbiAgICAgdGhpcy5jbGFzc0RlZmF1bHRQcm9wZXJ0aWVzXHJcbiAgICAgICAuZm9yRWFjaCgoY2xhc3NTZXR0aW5nKSA9PiB7XHJcbiAgICAgICAgIGlmKHRoaXMuc2V0dGluZ3NbY2xhc3NTZXR0aW5nXSkge1xyXG4gICAgICAgICAgIHRoaXNbJ18nLmNvbmNhdChjbGFzc1NldHRpbmcpXSA9IHRoaXMuc2V0dGluZ3NbY2xhc3NTZXR0aW5nXVxyXG4gICAgICAgICB9XHJcbiAgICAgICB9KVxyXG4gICAgIE9iamVjdC5rZXlzKHRoaXMuc2V0dGluZ3MpXHJcbiAgICAgICAuZm9yRWFjaCgoc2V0dGluZ0tleSkgPT4ge1xyXG4gICAgICAgICBpZih0aGlzLmNsYXNzRGVmYXVsdFByb3BlcnRpZXMuaW5kZXhPZihzZXR0aW5nS2V5KSA9PT0gLTEpIHtcclxuICAgICAgICAgICB0aGlzW3NldHRpbmdLZXldID0gdGhpcy5zZXR0aW5nc1tzZXR0aW5nS2V5XVxyXG4gICAgICAgICB9XHJcbiAgICAgICB9KVxyXG4gIH1cclxuICBnZXQgX2NvbmZpZ3VyYXRpb24oKSB7XHJcbiAgICB0aGlzLmNvbmZpZ3VyYXRpb24gPSB0aGlzLmNvbmZpZ3VyYXRpb24gfHwge31cclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25cclxuICB9XHJcbiAgc2V0IF9jb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHsgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbiB9XHJcbiAgZ2V0IF91aUVsZW1lbnRTZXR0aW5ncygpIHtcclxuICAgIHRoaXMudWlFbGVtZW50U2V0dGluZ3MgPSB0aGlzLnVpRWxlbWVudFNldHRpbmdzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy51aUVsZW1lbnRTZXR0aW5nc1xyXG4gIH1cclxuICBzZXQgX3VpRWxlbWVudFNldHRpbmdzKHVpRWxlbWVudFNldHRpbmdzKSB7XHJcbiAgICB0aGlzLnVpRWxlbWVudFNldHRpbmdzID0gdWlFbGVtZW50U2V0dGluZ3NcclxuICB9XHJcbiAgZ2V0QmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kcyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSB7XHJcbiAgICBzd2l0Y2goYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgICBjYXNlICdkYXRhJzpcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJycpLFxyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ0V2ZW50cycpLFxyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ0NhbGxiYWNrcycpXHJcbiAgICAgICAgXVxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICBiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLmNvbmNhdCgncycpLFxyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ0V2ZW50cycpLFxyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ0NhbGxiYWNrcycpXHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG4gIH1cclxuICBjYXBpdGFsaXplUHJvcGVydHlOYW1lKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpIHtcclxuICAgIGlmKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUuc2xpY2UoMCwgMikgPT09ICd1aScpIHtcclxuICAgICAgcmV0dXJuIGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUucmVwbGFjZSgvXnVpLywgJ1VJJylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCBmaXJzdENoYXJhY3RlciA9IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKClcclxuICAgICAgcmV0dXJuIGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUucmVwbGFjZSgvXi4vLCBmaXJzdENoYXJhY3RlcilcclxuICAgIH1cclxuICB9XHJcbiAgYWRkQ2xhc3NEZWZhdWx0UHJvcGVydGllcygpIHtcclxuICAgIHRoaXMuY2xhc3NEZWZhdWx0UHJvcGVydGllc1xyXG4gICAgICAuZm9yRWFjaCgoY2xhc3NEZWZhdWx0UHJvcGVydHksIGNsYXNzRGVmYXVsdFByb3BlcnR5SW5kZXgpID0+IHtcclxuICAgICAgICBpZih0aGlzW2NsYXNzRGVmYXVsdFByb3BlcnR5XSkge1xyXG4gICAgICAgICAgbGV0IHByb3BlcnR5ID0gdGhpc1tjbGFzc0RlZmF1bHRQcm9wZXJ0eV1cclxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBjbGFzc0RlZmF1bHRQcm9wZXJ0eSwge1xyXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmFsdWU6IHByb3BlcnR5XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgdGhpc1snXycuY29uY2F0KGNsYXNzRGVmYXVsdFByb3BlcnR5KV0gPSBwcm9wZXJ0eVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKCkge1xyXG4gICAgaWYodGhpcy5iaW5kYWJsZUNsYXNzUHJvcGVydGllcykge1xyXG4gICAgICB0aGlzLmJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzXHJcbiAgICAgICAgLmZvckVhY2goKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpID0+IHtcclxuICAgICAgICAgIGxldCBiaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2RzID0gdGhpcy5nZXRCaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2RzKFxyXG4gICAgICAgICAgICBiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICBiaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2RzXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKChiaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2QsIGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU1ldGhvZEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5hZGRCaW5kYWJsZUNsYXNzUHJvcGVydHkoYmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kKVxyXG4gICAgICAgICAgICAgIGlmKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU1ldGhvZEluZGV4ID09PSBiaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2RzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLCAnb24nKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgYWRkQmluZGFibGVDbGFzc1Byb3BlcnR5KGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpIHtcclxuICAgIGxldCBjb250ZXh0ID0gdGhpc1xyXG4gICAgbGV0IGNhcGl0YWxpemVQcm9wZXJ0eU5hbWUgPSB0aGlzLmNhcGl0YWxpemVQcm9wZXJ0eU5hbWUoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSlcclxuICAgIGxldCBhZGRCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lID0gJ2FkZCcuY29uY2F0KGNhcGl0YWxpemVQcm9wZXJ0eU5hbWUpXHJcbiAgICBsZXQgcmVtb3ZlQmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSA9ICdyZW1vdmUnLmNvbmNhdChjYXBpdGFsaXplUHJvcGVydHlOYW1lKVxyXG4gICAgaWYoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSA9PT0gJ3VpRWxlbWVudHMnKSB7XHJcbiAgICAgIGNvbnRleHQuX3VpRWxlbWVudFNldHRpbmdzID0gdGhpc1tiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXVxyXG4gICAgfVxyXG4gICAgbGV0IGN1cnJlbnRQcm9wZXJ0eVZhbHVlcyA9IHRoaXNbYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZV1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxyXG4gICAgICB0aGlzLFxyXG4gICAgICB7XHJcbiAgICAgICAgW2JpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdOiB7XHJcbiAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgICAgIHZhbHVlOiBjdXJyZW50UHJvcGVydHlWYWx1ZXMsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV06IHtcclxuICAgICAgICAgIGdldCgpIHtcclxuICAgICAgICAgICAgY29udGV4dFtiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXSA9IGNvbnRleHRbYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZV0gfHwge31cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHRbYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZV1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzZXQodmFsdWVzKSB7XHJcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHZhbHVlcylcclxuICAgICAgICAgICAgICAuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2goYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICBjYXNlICd1aUVsZW1lbnRzJzpcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0Ll91aUVsZW1lbnRTZXR0aW5nc1trZXldID0gdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldW2tleV0gPSBjb250ZXh0LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh2YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV1ba2V5XSA9IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFthZGRCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXToge1xyXG4gICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV0gPSB7XHJcbiAgICAgICAgICAgICAgICBba2V5XTogdmFsdWVcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHZhbHVlcyA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV0gPSB2YWx1ZXNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlc2V0VGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKVxyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgW3JlbW92ZUJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdOiB7XHJcbiAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgICAgICAgc3dpdGNoKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3VpRWxlbWVudHMnOlxyXG4gICAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpXVtrZXldXHJcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQoJ3VpRWxlbWVudFNldHRpbmdzJyldW2tleV1cclxuICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldW2tleV1cclxuICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihhcmd1bWVudHMubGVuZ3RoID09PSAwKXtcclxuICAgICAgICAgICAgICBPYmplY3Qua2V5cyhjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldKVxyXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBzd2l0Y2goYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3VpRWxlbWVudHMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRleHRbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV1ba2V5XVxyXG4gICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRleHRbJ18nLmNvbmNhdCgndWlFbGVtZW50U2V0dGluZ3MnKV1ba2V5XVxyXG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRleHRbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV1ba2V5XVxyXG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlc2V0VGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKVxyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH1cclxuICAgIClcclxuICAgIGlmKGN1cnJlbnRQcm9wZXJ0eVZhbHVlcykge1xyXG4gICAgICB0aGlzW2FkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdKGN1cnJlbnRQcm9wZXJ0eVZhbHVlcylcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHJlc2V0VGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSB7XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gICAgICAudG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLCAnb2ZmJylcclxuICAgICAgLnRvZ2dsZVRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSwgJ29uJylcclxuICB9XHJcbiAgdG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZCkge1xyXG4gICAgaWYoXHJcbiAgICAgIHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgncycpXSAmJlxyXG4gICAgICB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXSAmJlxyXG4gICAgICB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXVxyXG4gICAgKSB7XHJcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJyldKVxyXG4gICAgICAgIC5mb3JFYWNoKChbY2xhc3NUeXBlRXZlbnREYXRhLCBjbGFzc1R5cGVDYWxsYmFja05hbWVdKSA9PiB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjbGFzc1R5cGVFdmVudERhdGEgPSBjbGFzc1R5cGVFdmVudERhdGEuc3BsaXQoJyAnKVxyXG4gICAgICAgICAgICBsZXQgY2xhc3NUeXBlVGFyZ2V0TmFtZSA9IGNsYXNzVHlwZUV2ZW50RGF0YVswXVxyXG4gICAgICAgICAgICBsZXQgY2xhc3NUeXBlRXZlbnROYW1lID0gY2xhc3NUeXBlRXZlbnREYXRhWzFdXHJcbiAgICAgICAgICAgIGxldCBjbGFzc1R5cGVUYXJnZXQgPSB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ3MnKV1bY2xhc3NUeXBlVGFyZ2V0TmFtZV1cclxuICAgICAgICAgICAgbGV0IGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2sgPSB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXVtjbGFzc1R5cGVDYWxsYmFja05hbWVdLmJpbmQodGhpcylcclxuICAgICAgICAgICAgdGhpcy50b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnQoXHJcbiAgICAgICAgICAgICAgY2xhc3NUeXBlLFxyXG4gICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldCxcclxuICAgICAgICAgICAgICBjbGFzc1R5cGVFdmVudE5hbWUsXHJcbiAgICAgICAgICAgICAgY2xhc3NUeXBlRXZlbnRDYWxsYmFjayxcclxuICAgICAgICAgICAgICBtZXRob2RcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgfSBjYXRjaChlcnJvcikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXHJcbiAgICAgICAgICAgIGVycm9yXHJcbiAgICAgICAgICApIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgdG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50KFxyXG4gICAgY2xhc3NUeXBlLFxyXG4gICAgY2xhc3NUeXBlVGFyZ2V0LFxyXG4gICAgY2xhc3NUeXBlRXZlbnROYW1lLFxyXG4gICAgY2xhc3NUeXBlRXZlbnRDYWxsYmFjayxcclxuICAgIG1ldGhvZFxyXG4gICkge1xyXG4gICAgc3dpdGNoKG1ldGhvZCkge1xyXG4gICAgICBjYXNlICdvbic6XHJcbiAgICAgICAgc3dpdGNoKGNsYXNzVHlwZSkge1xyXG4gICAgICAgICAgY2FzZSAndWlFbGVtZW50JzpcclxuICAgICAgICAgICAgaWYoY2xhc3NUeXBlVGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuICAgICAgICAgICAgICBBcnJheS5mcm9tKGNsYXNzVHlwZVRhcmdldClcclxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKChfY2xhc3NUeXBlVGFyZ2V0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIF9jbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoY2xhc3NUeXBlVGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICBjbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnb2ZmJzpcclxuICAgICAgICBzd2l0Y2goY2xhc3NUeXBlKSB7XHJcbiAgICAgICAgICBjYXNlICd1aUVsZW1lbnQnOlxyXG4gICAgICAgICAgICBpZihjbGFzc1R5cGVUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xyXG4gICAgICAgICAgICAgIEFycmF5LmZyb20oY2xhc3NUeXBlVGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKF9jbGFzc1R5cGVUYXJnZXQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgX2NsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihjbGFzc1R5cGVUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY2xhc3NUeXBlVGFyZ2V0W21ldGhvZF0oY2xhc3NUeXBlRXZlbnROYW1lLCBjbGFzc1R5cGVFdmVudENhbGxiYWNrKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBCYXNlXHJcbiIsImltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNvbnN0IFNlcnZpY2UgPSBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gICAgdGhpcy5hZGRQcm9wZXJ0aWVzKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGdldCBfZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLmRlZmF1bHRzIHx8IHtcbiAgICBjb250ZW50VHlwZTogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICB9IH1cbiAgZ2V0IF9yZXNwb25zZVR5cGVzKCkgeyByZXR1cm4gWycnLCAnYXJyYXlidWZmZXInLCAnYmxvYicsICdkb2N1bWVudCcsICdqc29uJywgJ3RleHQnXSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlKCkgeyByZXR1cm4gdGhpcy5yZXNwb25zZVR5cGUgfVxuICBzZXQgX3Jlc3BvbnNlVHlwZShyZXNwb25zZVR5cGUpIHtcbiAgICB0aGlzLl94aHIucmVzcG9uc2VUeXBlID0gdGhpcy5fcmVzcG9uc2VUeXBlcy5maW5kKFxuICAgICAgKHJlc3BvbnNlVHlwZUl0ZW0pID0+IHJlc3BvbnNlVHlwZUl0ZW0gPT09IHJlc3BvbnNlVHlwZVxuICAgICkgfHwgdGhpcy5fZGVmYXVsdHMucmVzcG9uc2VUeXBlXG4gIH1cbiAgZ2V0IF90eXBlKCkgeyByZXR1cm4gdGhpcy50eXBlIH1cbiAgc2V0IF90eXBlKHR5cGUpIHsgdGhpcy50eXBlID0gdHlwZSB9XG4gIGdldCBfdXJsKCkgeyByZXR1cm4gdGhpcy51cmwgfVxuICBzZXQgX3VybCh1cmwpIHsgdGhpcy51cmwgPSB1cmwgfVxuICBnZXQgX2hlYWRlcnMoKSB7IHJldHVybiB0aGlzLmhlYWRlcnMgfHwgW10gfVxuICBzZXQgX2hlYWRlcnMoaGVhZGVycykge1xuICAgIHRoaXMuX2hlYWRlcnMubGVuZ3RoID0gMFxuICAgIGhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICB0aGlzLl9oZWFkZXJzLnB1c2goaGVhZGVyKVxuICAgICAgaGVhZGVyID0gT2JqZWN0LmVudHJpZXMoaGVhZGVyKVswXVxuICAgICAgdGhpcy5feGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgfSlcbiAgfVxuICBnZXQgX2RhdGEoKSB7IHJldHVybiB0aGlzLmRhdGEgfVxuICBzZXQgX2RhdGEoZGF0YSkgeyB0aGlzLmRhdGEgPSBkYXRhIH1cbiAgZ2V0IF94aHIoKSB7XG4gICAgdGhpcy54aHIgPSAodGhpcy54aHIpXG4gICAgICA/IHRoaXMueGhyXG4gICAgICA6IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgcmV0dXJuIHRoaXMueGhyXG4gIH1cbiAgcmVxdWVzdCgpIHtcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLmRhdGEgfHwgbnVsbFxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZih0aGlzLl94aHIuc3RhdHVzID09PSAyMDApIHRoaXMuX3hoci5hYm9ydCgpXG4gICAgICB0aGlzLl94aHIub3Blbih0aGlzLnR5cGUsIHRoaXMudXJsKVxuICAgICAgdGhpcy5faGVhZGVycyA9IHRoaXMuc2V0dGluZ3MuaGVhZGVycyB8fCBbdGhpcy5fZGVmYXVsdHMuY29udGVudFR5cGVdXG4gICAgICB0aGlzLl94aHIub25sb2FkID0gcmVzb2x2ZVxuICAgICAgdGhpcy5feGhyLm9uZXJyb3IgPSByZWplY3RcbiAgICAgIHRoaXMuX3hoci5zZW5kKGRhdGEpXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgJ3hocjpyZXNvbHZlJywge1xuICAgICAgICAgIG5hbWU6ICd4aHI6cmVzb2x2ZScsXG4gICAgICAgICAgZGF0YTogcmVzcG9uc2UuY3VycmVudFRhcmdldCxcbiAgICAgICAgfSxcbiAgICAgICAgdGhpc1xuICAgICAgKVxuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7IHRocm93IGVycm9yIH0pXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIE9iamVjdC5rZXlzKHNldHRpbmdzKS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGlmKHNldHRpbmdzLnR5cGUpIHRoaXMuX3R5cGUgPSBzZXR0aW5ncy50eXBlXG4gICAgICBpZihzZXR0aW5ncy51cmwpIHRoaXMuX3VybCA9IHNldHRpbmdzLnVybFxuICAgICAgaWYoc2V0dGluZ3MuZGF0YSkgdGhpcy5fZGF0YSA9IHNldHRpbmdzLmRhdGEgfHwgbnVsbFxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5yZXNwb25zZVR5cGUpIHRoaXMuX3Jlc3BvbnNlVHlwZSA9IHRoaXMuX3NldHRpbmdzLnJlc3BvbnNlVHlwZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5nc1xuICAgIGlmKFxuICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgZGVsZXRlIHRoaXMuX3R5cGVcbiAgICAgIGRlbGV0ZSB0aGlzLl91cmxcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhXG4gICAgICBkZWxldGUgdGhpcy5faGVhZGVyc1xuICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlVHlwZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBTZXJ2aWNlXG4iLCJpbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4J1xuXG5jbGFzcyBNb2RlbCBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICdkYXRhJyxcbiAgICAnc2VydmljZSdcbiAgXSB9XG4gIGdldCBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICduYW1lJyxcbiAgICAnbG9jYWxTdG9yYWdlJyxcbiAgICAnaGlzdGlvZ3JhbScsXG4gICAgJ2RlZmF1bHRzJ1xuICBdIH1cbiAgZ2V0IF9pc1NldHRpbmcoKSB7IHJldHVybiB0aGlzLmlzU2V0dGluZyB9XG4gIHNldCBfaXNTZXR0aW5nKGlzU2V0dGluZykgeyB0aGlzLmlzU2V0dGluZyA9IGlzU2V0dGluZyB9XG4gIGdldCBfY2hhbmdpbmcoKSB7XG4gICAgdGhpcy5jaGFuZ2luZyA9IHRoaXMuY2hhbmdpbmcgfHwge31cbiAgICByZXR1cm4gdGhpcy5jaGFuZ2luZ1xuICB9XG4gIGdldCBfbG9jYWxTdG9yYWdlKCkgeyByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UgfVxuICBzZXQgX2xvY2FsU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHsgdGhpcy5sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UgfVxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5kZWZhdWx0cyB9XG4gIHNldCBfZGVmYXVsdHMoZGVmYXVsdHMpIHtcbiAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHNcbiAgICB0aGlzLnNldChkZWZhdWx0cylcbiAgfVxuICBnZXQgX2hpc3Rpb2dyYW0oKSB7IHJldHVybiB0aGlzLmhpc3Rpb2dyYW0gfHwge1xuICAgIGxlbmd0aDogMVxuICB9IH1cbiAgc2V0IF9oaXN0aW9ncmFtKGhpc3Rpb2dyYW0pIHtcbiAgICB0aGlzLmhpc3Rpb2dyYW0gPSBPYmplY3QuYXNzaWduKFxuICAgICAgdGhpcy5faGlzdGlvZ3JhbSxcbiAgICAgIGhpc3Rpb2dyYW1cbiAgICApXG4gIH1cbiAgZ2V0IF9oaXN0b3J5KCkge1xuICAgIHRoaXMuaGlzdG9yeSA9IHRoaXMuaGlzdG9yeSB8fCBbXVxuICAgIHJldHVybiB0aGlzLmhpc3RvcnlcbiAgfVxuICBzZXQgX2hpc3RvcnkoZGF0YSkge1xuICAgIGlmKFxuICAgICAgT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoXG4gICAgKSB7XG4gICAgICBpZih0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVuc2hpZnQodGhpcy5wYXJzZShkYXRhKSlcbiAgICAgICAgdGhpcy5faGlzdG9yeS5zcGxpY2UodGhpcy5faGlzdGlvZ3JhbS5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBkYigpIHsgcmV0dXJuIHRoaXMuX2RiIH1cbiAgZ2V0IF9kYigpIHtcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgfHwgJ3t9J1xuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICBnZXQoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtrZXldXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdGhpcy5faXNTZXR0aW5nID0gdHJ1ZVxuICAgICAgICBsZXQgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYoaW5kZXggPT09IChfYXJndW1lbnRzLmxlbmd0aCAtIDEpKSB0aGlzLl9pc1NldHRpbmcgPSBmYWxzZVxuICAgICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpKSB7XG4gICAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREQigpIHtcbiAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHZhciBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGxldCB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgdGhpcy5fZGIgPSBkYlxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXREQigpIHtcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBkZWxldGUgdGhpcy5fZGJcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBkZWxldGUgZGJba2V5XVxuICAgICAgICB0aGlzLl9kYiA9IGRiXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpIHtcbiAgICBpZighdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldKSB7XG4gICAgICBsZXQgY29udGV4dCA9IHRoaXNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgICAgICB0aGlzLl9kYXRhLFxuICAgICAgICB7XG4gICAgICAgICAgWydfJy5jb25jYXQoa2V5KV06IHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNba2V5XSB9LFxuICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgIGNvbnRleHQuX2NoYW5naW5nW2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgICBpZihjb250ZXh0LmxvY2FsU3RvcmFnZSkgY29udGV4dC5zZXREQihrZXksIHZhbHVlKVxuICAgICAgICAgICAgICBsZXQgc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3NldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgICAgICAgICAgICBsZXQgc2V0RXZlbnROYW1lID0gJ3NldCdcbiAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgIHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICBpZighY29udGV4dC5faXNTZXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgaWYoIU9iamVjdC52YWx1ZXMoY29udGV4dC5fY2hhbmdpbmcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgICAgICBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgZGF0YTogY29udGV4dC5fZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgICAgICAgICAge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0Ll9jaGFuZ2luZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuX2RhdGFcbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0LmNoYW5naW5nXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gICAgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldID0gdmFsdWVcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0RGF0YVByb3BlcnR5KGtleSkge1xuICAgIGxldCB1bnNldFZhbHVlRXZlbnROYW1lID0gWyd1bnNldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgIGxldCB1bnNldEV2ZW50TmFtZSA9ICd1bnNldCdcbiAgICBsZXQgdW5zZXRWYWx1ZSA9IHRoaXMuX2RhdGFba2V5XVxuICAgIGRlbGV0ZSB0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV1cbiAgICBkZWxldGUgdGhpcy5fZGF0YVtrZXldXG4gICAgdGhpcy5lbWl0KFxuICAgICAgdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiB1bnNldFZhbHVlLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdGhpc1xuICAgIClcbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldEV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRoaXNcbiAgICApXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBwYXJzZShkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5fZGF0YSB8fCB7fVxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vZGVsXG4iLCJpbXBvcnQgeyB0eXBlT2YgfSBmcm9tICcuLi9VdGlscy9pbmRleCdcbmltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNsYXNzIFZpZXcgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBiaW5kYWJsZUNsYXNzUHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAndWlFbGVtZW50J1xuICBdIH1cbiAgZ2V0IGNsYXNzRGVmYXVsdFByb3BlcnRpZXMoKSB7IHJldHVybiBbXG4gICAgJ2VsZW1lbnROYW1lJyxcbiAgICAnZWxlbWVudCcsXG4gICAgJ2F0dHJpYnV0ZXMnLFxuICAgICd0ZW1wbGF0ZXMnLFxuICAgICdpbnNlcnQnXG4gIF0gfVxuICBnZXQgX2VsZW1lbnROYW1lKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudC50YWdOYW1lIH1cbiAgc2V0IF9lbGVtZW50TmFtZShlbGVtZW50TmFtZSkge1xuICAgIGlmKCF0aGlzLl9lbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50TmFtZSlcbiAgfVxuICBnZXQgX2VsZW1lbnQoKSB7IHJldHVybiB0aGlzLmVsZW1lbnQgfVxuICBzZXQgX2VsZW1lbnQoZWxlbWVudCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICB0aGlzLmVsZW1lbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudCwge1xuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICB9KVxuICB9XG4gIGdldCBfYXR0cmlidXRlcygpIHtcbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSB0aGlzLmVsZW1lbnQuYXR0cmlidXRlc1xuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNcbiAgfVxuICBzZXQgX2F0dHJpYnV0ZXMoYXR0cmlidXRlcykge1xuICAgIGZvcihsZXQgW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpKSB7XG4gICAgICBpZih0eXBlb2YgYXR0cmlidXRlVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZUtleSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBlbGVtZW50T2JzZXJ2ZXIoKSB7XG4gICAgdGhpcy5fZWxlbWVudE9ic2VydmVyID0gdGhpcy5fZWxlbWVudE9ic2VydmVyIHx8IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuICAgICAgdGhpcy5lbGVtZW50T2JzZXJ2ZS5iaW5kKHRoaXMpXG4gICAgKVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgfVxuICBnZXQgX2luc2VydCgpIHtcbiAgICB0aGlzLmluc2VydCA9IHRoaXMuaW5zZXJ0IHx8IG51bGxcbiAgICByZXR1cm4gdGhpcy5pbnNlcnRcbiAgfVxuICBzZXQgX2luc2VydChpbnNlcnQpIHsgdGhpcy5pbnNlcnQgPSBpbnNlcnQgfVxuICBnZXQgX3RlbXBsYXRlcygpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IHRoaXMudGVtcGxhdGVzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGVzXG4gIH1cbiAgc2V0IF90ZW1wbGF0ZXModGVtcGxhdGVzKSB7IHRoaXMudGVtcGxhdGVzID0gdGVtcGxhdGVzIH1cbiAgcmVzZXRVSUVsZW1lbnRzKCkge1xuICAgIGxldCB1aUVsZW1lbnRTZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB7fSxcbiAgICAgIHRoaXMuX3VpRWxlbWVudFNldHRpbmdzXG4gICAgKVxuICAgIHRoaXMudG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cygndWlFbGVtZW50JywgJ29mZicpXG4gICAgdGhpcy5yZW1vdmVVSUVsZW1lbnRzKClcbiAgICB0aGlzLmFkZFVJRWxlbWVudHModWlFbGVtZW50U2V0dGluZ3MpXG4gICAgdGhpcy50b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKCd1aUVsZW1lbnQnLCAnb24nKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZWxlbWVudE9ic2VydmUobXV0YXRpb25SZWNvcmRMaXN0LCBvYnNlcnZlcikge1xuICAgIGZvcihsZXQgW211dGF0aW9uUmVjb3JkSW5kZXgsIG11dGF0aW9uUmVjb3JkXSBvZiBPYmplY3QuZW50cmllcyhtdXRhdGlvblJlY29yZExpc3QpKSB7XG4gICAgICBzd2l0Y2gobXV0YXRpb25SZWNvcmQudHlwZSkge1xuICAgICAgICBjYXNlICdjaGlsZExpc3QnOlxuICAgICAgICAgIGxldCBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMgPSBbJ2FkZGVkTm9kZXMnLCAncmVtb3ZlZE5vZGVzJ11cbiAgICAgICAgICB0aGlzLnJlc2V0VUlFbGVtZW50cygpXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYXV0b0luc2VydCgpIHtcbiAgICBpZih0aGlzLmluc2VydCkge1xuICAgICAgbGV0IHBhcmVudEVsZW1lbnRcbiAgICAgIGlmKHR5cGVPZih0aGlzLmluc2VydC5lbGVtZW50KSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcGFyZW50RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5pbnNlcnQuZWxlbWVudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmVudEVsZW1lbnQgPSB0aGlzLmluc2VydC5lbGVtZW50XG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgcGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICAgIHBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlXG4gICAgICApIHtcbiAgICAgICAgcGFyZW50RWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQodGhpcy5pbnNlcnQubWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgICB9IGVsc2UgaWYocGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XG4gICAgICAgIHBhcmVudEVsZW1lbnRcbiAgICAgICAgICAuZm9yRWFjaCgoX3BhcmVudEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIF9wYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCh0aGlzLmluc2VydC5tZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmKHBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiBqUXVlcnkpIHtcbiAgICAgICAgcGFyZW50RWxlbWVudFxuICAgICAgICAgIC5lYWNoKChpbmRleCwgZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgZWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQodGhpcy5pbnNlcnQubWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdXRvUmVtb3ZlKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5lbGVtZW50ICYmXG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICkgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFZpZXdcbiIsImltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNvbnN0IENvbnRyb2xsZXIgPSBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICdtb2RlbCcsXG4gICAgJ3ZpZXcnLFxuICAgICdjb250cm9sbGVyJyxcbiAgICAncm91dGVyJ1xuICBdIH1cbiAgZ2V0IGNsYXNzRGVmYXVsdFByb3BlcnRpZXMoKSB7IHJldHVybiBbXSB9XG59XG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyXG4iLCJpbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4J1xuXG5jb25zdCBSb3V0ZXIgPSBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gICAgdGhpcy5hZGRXaW5kb3dFdmVudHMoKVxuICB9XG4gIGdldCBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICdyb290JyxcbiAgICAnaGFzaFJvdXRpbmcnLFxuICAgICdjb250cm9sbGVyJyxcbiAgICAncm91dGVzJ1xuICBdIH1cbiAgZ2V0IHByb3RvY29sKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnByb3RvY29sIH1cbiAgZ2V0IGhvc3RuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lIH1cbiAgZ2V0IHBvcnQoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucG9ydCB9XG4gIGdldCBwYXRobmFtZSgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSB9XG4gIGdldCBwYXRoKCkge1xuICAgIGxldCBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWVcbiAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoWydeJywgdGhpcy5yb290XS5qb2luKCcnKSksICcnKVxuICAgICAgLnNwbGl0KCc/JylcbiAgICAgIC5zbGljZSgwLCAxKVxuICAgICAgWzBdXG4gICAgbGV0IGZyYWdtZW50cyA9IChcbiAgICAgIHN0cmluZy5sZW5ndGggPT09IDBcbiAgICApID8gW11cbiAgICAgIDogKFxuICAgICAgICAgIHN0cmluZy5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL15cXC8vKSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXFwvPy8pXG4gICAgICAgICkgPyBbJy8nXVxuICAgICAgICAgIDogc3RyaW5nXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC8kLywgJycpXG4gICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgcmV0dXJuIHtcbiAgICAgIGZyYWdtZW50czogZnJhZ21lbnRzLFxuICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgfVxuICB9XG4gIGdldCBoYXNoKCkge1xuICAgIGxldCBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uaGFzaFxuICAgICAgLnNsaWNlKDEpXG4gICAgICAuc3BsaXQoJz8nKVxuICAgICAgLnNsaWNlKDAsIDEpXG4gICAgICBbMF1cbiAgICBsZXQgZnJhZ21lbnRzID0gKFxuICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMFxuICAgICkgPyBbXVxuICAgICAgOiAoXG4gICAgICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXlxcLy8pICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9cXC8/LylcbiAgICAgICAgKSA/IFsnLyddXG4gICAgICAgICAgOiBzdHJpbmdcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICByZXR1cm4ge1xuICAgICAgZnJhZ21lbnRzOiBmcmFnbWVudHMsXG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICB9XG4gIH1cbiAgZ2V0IHBhcmFtZXRlcnMoKSB7XG4gICAgbGV0IHN0cmluZ1xuICAgIGxldCBkYXRhXG4gICAgaWYod2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goL1xcPy8pKSB7XG4gICAgICBsZXQgcGFyYW1ldGVycyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgICAgIC5zcGxpdCgnPycpXG4gICAgICAgIC5zbGljZSgtMSlcbiAgICAgICAgLmpvaW4oJycpXG4gICAgICBzdHJpbmcgPSBwYXJhbWV0ZXJzXG4gICAgICBkYXRhID0gcGFyYW1ldGVyc1xuICAgICAgICAuc3BsaXQoJyYnKVxuICAgICAgICAucmVkdWNlKChcbiAgICAgICAgICBfcGFyYW1ldGVycyxcbiAgICAgICAgICBwYXJhbWV0ZXJcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgbGV0IHBhcmFtZXRlckRhdGEgPSBwYXJhbWV0ZXIuc3BsaXQoJz0nKVxuICAgICAgICAgIF9wYXJhbWV0ZXJzW3BhcmFtZXRlckRhdGFbMF1dID0gcGFyYW1ldGVyRGF0YVsxXVxuICAgICAgICAgIHJldHVybiBfcGFyYW1ldGVyc1xuICAgICAgICB9LCB7fSlcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyaW5nID0gJydcbiAgICAgIGRhdGEgPSB7fVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfVxuICB9XG4gIGdldCBfcm9vdCgpIHsgcmV0dXJuIHRoaXMucm9vdCB8fCAnLycgfVxuICBzZXQgX3Jvb3Qocm9vdCkgeyB0aGlzLnJvb3QgPSByb290IH1cbiAgZ2V0IF9oYXNoUm91dGluZygpIHsgcmV0dXJuIHRoaXMuaGFzaFJvdXRpbmcgfHwgZmFsc2UgfVxuICBzZXQgX2hhc2hSb3V0aW5nKGhhc2hSb3V0aW5nKSB7IHRoaXMuaGFzaFJvdXRpbmcgPSBoYXNoUm91dGluZyB9XG4gIGdldCBfcm91dGVzKCkgeyByZXR1cm4gdGhpcy5yb3V0ZXMgfVxuICBzZXQgX3JvdXRlcyhyb3V0ZXMpIHsgdGhpcy5yb3V0ZXMgPSByb3V0ZXMgfVxuICBnZXQgX2NvbnRyb2xsZXIoKSB7IHJldHVybiB0aGlzLmNvbnRyb2xsZXIgfVxuICBzZXQgX2NvbnRyb2xsZXIoY29udHJvbGxlcikgeyB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyIH1cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICByb290OiB0aGlzLnJvb3QsXG4gICAgICBwYXRoOiB0aGlzLnBhdGgsXG4gICAgICBoYXNoOiB0aGlzLmhhc2gsXG4gICAgICBwYXJhbWV0ZXJzOiB0aGlzLnBhcmFtZXRlcnMsXG4gICAgfVxuICB9XG4gIG1hdGNoUm91dGUocm91dGVGcmFnbWVudHMsIGxvY2F0aW9uRnJhZ21lbnRzKSB7XG4gICAgbGV0IHJvdXRlTWF0Y2hlcyA9IG5ldyBBcnJheSgpXG4gICAgaWYocm91dGVGcmFnbWVudHMubGVuZ3RoID09PSBsb2NhdGlvbkZyYWdtZW50cy5sZW5ndGgpIHtcbiAgICAgIHJvdXRlTWF0Y2hlcyA9IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgIC5yZWR1Y2UoKF9yb3V0ZU1hdGNoZXMsIHJvdXRlRnJhZ21lbnQsIHJvdXRlRnJhZ21lbnRJbmRleCkgPT4ge1xuICAgICAgICAgIGxldCBsb2NhdGlvbkZyYWdtZW50ID0gbG9jYXRpb25GcmFnbWVudHNbcm91dGVGcmFnbWVudEluZGV4XVxuICAgICAgICAgIGlmKHJvdXRlRnJhZ21lbnQubWF0Y2goL15cXDovKSkge1xuICAgICAgICAgICAgX3JvdXRlTWF0Y2hlcy5wdXNoKHRydWUpXG4gICAgICAgICAgfSBlbHNlIGlmKHJvdXRlRnJhZ21lbnQgPT09IGxvY2F0aW9uRnJhZ21lbnQpIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaCh0cnVlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2goZmFsc2UpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcm91dGVNYXRjaGVzXG4gICAgICAgIH0sIFtdKVxuICAgIH0gZWxzZSB7XG4gICAgICByb3V0ZU1hdGNoZXMucHVzaChmYWxzZSlcbiAgICB9XG4gICAgcmV0dXJuIChyb3V0ZU1hdGNoZXMuaW5kZXhPZihmYWxzZSkgPT09IC0xKVxuICAgICAgPyB0cnVlXG4gICAgICA6IGZhbHNlXG4gIH1cbiAgZ2V0Um91dGUobG9jYXRpb24pIHtcbiAgICBsZXQgcm91dGVzID0gT2JqZWN0LmVudHJpZXModGhpcy5yb3V0ZXMpXG4gICAgICAucmVkdWNlKChcbiAgICAgICAgX3JvdXRlcyxcbiAgICAgICAgW3JvdXRlTmFtZSwgcm91dGVTZXR0aW5nc10pID0+IHtcbiAgICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSAoXG4gICAgICAgICAgICByb3V0ZU5hbWUubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgICByb3V0ZU5hbWUubWF0Y2goL15cXC8vKVxuICAgICAgICAgICkgPyBbcm91dGVOYW1lXVxuICAgICAgICAgICAgOiAocm91dGVOYW1lLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgPyBbJyddXG4gICAgICAgICAgICAgIDogcm91dGVOYW1lXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgICAgICAgcm91dGVTZXR0aW5ncy5mcmFnbWVudHMgPSByb3V0ZUZyYWdtZW50c1xuICAgICAgICAgIF9yb3V0ZXNbcm91dGVGcmFnbWVudHMuam9pbignLycpXSA9IHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICByZXR1cm4gX3JvdXRlc1xuICAgICAgICB9LFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHJvdXRlcylcbiAgICAgIC5maW5kKChyb3V0ZSkgPT4ge1xuICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSByb3V0ZS5mcmFnbWVudHNcbiAgICAgICAgbGV0IGxvY2F0aW9uRnJhZ21lbnRzID0gKHRoaXMuaGFzaFJvdXRpbmcpXG4gICAgICAgICAgPyBsb2NhdGlvbi5oYXNoLmZyYWdtZW50c1xuICAgICAgICAgIDogbG9jYXRpb24ucGF0aC5mcmFnbWVudHNcbiAgICAgICAgbGV0IG1hdGNoUm91dGUgPSB0aGlzLm1hdGNoUm91dGUoXG4gICAgICAgICAgcm91dGVGcmFnbWVudHMsXG4gICAgICAgICAgbG9jYXRpb25GcmFnbWVudHMsXG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuIG1hdGNoUm91dGUgPT09IHRydWVcbiAgICAgIH0pXG4gIH1cbiAgcG9wU3RhdGUoZXZlbnQpIHtcbiAgICBsZXQgbG9jYXRpb24gPSB0aGlzLmxvY2F0aW9uXG4gICAgbGV0IHJvdXRlID0gdGhpcy5nZXRSb3V0ZShsb2NhdGlvbilcbiAgICBsZXQgcm91dGVEYXRhID0ge1xuICAgICAgcm91dGU6IHJvdXRlLFxuICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgIH1cbiAgICBpZihyb3V0ZSkge1xuICAgICAgdGhpcy5jb250cm9sbGVyW3JvdXRlLmNhbGxiYWNrXShyb3V0ZURhdGEpXG4gICAgICB0aGlzLmVtaXQoJ2NoYW5nZScsIHtcbiAgICAgICAgbmFtZTogJ2NoYW5nZScsXG4gICAgICAgIGRhdGE6IHJvdXRlRGF0YSxcbiAgICAgIH0sXG4gICAgICB0aGlzKVxuICAgIH1cbiAgfVxuICBhZGRXaW5kb3dFdmVudHMoKSB7XG4gICAgd2luZG93Lm9uKCdwb3BzdGF0ZScsIHRoaXMucG9wU3RhdGUuYmluZCh0aGlzKSlcbiAgfVxuICByZW1vdmVXaW5kb3dFdmVudHMoKSB7XG4gICAgd2luZG93Lm9mZigncG9wc3RhdGUnLCB0aGlzLnBvcFN0YXRlLmJpbmQodGhpcykpXG4gIH1cbiAgbmF2aWdhdGUocGF0aCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aFxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBSb3V0ZXJcbiIsImltcG9ydCAnLi9TaGltcy9ldmVudHMnXG5pbXBvcnQgRXZlbnRzIGZyb20gJy4vRXZlbnRzL2luZGV4J1xuaW1wb3J0IENoYW5uZWxzIGZyb20gJy4vQ2hhbm5lbHMvaW5kZXgnXG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL1V0aWxzL2luZGV4J1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi9TZXJ2aWNlL2luZGV4J1xuaW1wb3J0IE1vZGVsIGZyb20gJy4vTW9kZWwvaW5kZXgnXG5pbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcvaW5kZXgnXG5pbXBvcnQgQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXIvaW5kZXgnXG5pbXBvcnQgUm91dGVyIGZyb20gJy4vUm91dGVyL2luZGV4J1xuY29uc3QgTVZDID0ge1xuICBFdmVudHMsXG4gIENoYW5uZWxzLFxuICBVdGlscyxcbiAgU2VydmljZSxcbiAgTW9kZWwsXG4gIFZpZXcsXG4gIENvbnRyb2xsZXIsXG4gIFJvdXRlcixcbn1cbmV4cG9ydCBkZWZhdWx0IE1WQ1xuIl0sIm5hbWVzIjpbIkV2ZW50VGFyZ2V0IiwicHJvdG90eXBlIiwib24iLCJhZGRFdmVudExpc3RlbmVyIiwib2ZmIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIkV2ZW50cyIsImNvbnN0cnVjdG9yIiwiX2V2ZW50cyIsImV2ZW50cyIsImdldEV2ZW50Q2FsbGJhY2tzIiwiZXZlbnROYW1lIiwiZ2V0RXZlbnRDYWxsYmFja05hbWUiLCJldmVudENhbGxiYWNrIiwibmFtZSIsImxlbmd0aCIsImdldEV2ZW50Q2FsbGJhY2tHcm91cCIsImV2ZW50Q2FsbGJhY2tzIiwiZXZlbnRDYWxsYmFja05hbWUiLCJldmVudENhbGxiYWNrR3JvdXAiLCJwdXNoIiwiYXJndW1lbnRzIiwiT2JqZWN0Iiwia2V5cyIsImVtaXQiLCJldmVudERhdGEiLCJfYXJndW1lbnRzIiwidmFsdWVzIiwiZW50cmllcyIsImV2ZW50Q2FsbGJhY2tHcm91cE5hbWUiLCJhZGRpdGlvbmFsQXJndW1lbnRzIiwic3BsaWNlIiwiQ2hhbm5lbCIsIl9yZXNwb25zZXMiLCJyZXNwb25zZXMiLCJyZXNwb25zZSIsInJlc3BvbnNlTmFtZSIsInJlc3BvbnNlQ2FsbGJhY2siLCJyZXF1ZXN0IiwiQXJyYXkiLCJzbGljZSIsImNhbGwiLCJDaGFubmVscyIsIl9jaGFubmVscyIsImNoYW5uZWxzIiwiY2hhbm5lbCIsImNoYW5uZWxOYW1lIiwidHlwZU9mIiwiZGF0YSIsIl9vYmplY3QiLCJpc0FycmF5IiwiVUlEIiwidXVpZCIsImlpIiwiTWF0aCIsInJhbmRvbSIsInRvU3RyaW5nIiwiQmFzZSIsInNldHRpbmdzIiwiY29uZmlndXJhdGlvbiIsImFkZENsYXNzRGVmYXVsdFByb3BlcnRpZXMiLCJhZGRCaW5kYWJsZUNsYXNzUHJvcGVydGllcyIsIl9zZXR0aW5ncyIsIl9jb25maWd1cmF0aW9uIiwidWlkIiwiX3VpZCIsIl9uYW1lIiwiY2xhc3NEZWZhdWx0UHJvcGVydGllcyIsImZvckVhY2giLCJjbGFzc1NldHRpbmciLCJjb25jYXQiLCJzZXR0aW5nS2V5IiwiaW5kZXhPZiIsIl91aUVsZW1lbnRTZXR0aW5ncyIsInVpRWxlbWVudFNldHRpbmdzIiwiZ2V0QmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kcyIsImJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUiLCJjYXBpdGFsaXplUHJvcGVydHlOYW1lIiwicmVwbGFjZSIsImZpcnN0Q2hhcmFjdGVyIiwic3Vic3RyaW5nIiwidG9VcHBlckNhc2UiLCJjbGFzc0RlZmF1bHRQcm9wZXJ0eSIsImNsYXNzRGVmYXVsdFByb3BlcnR5SW5kZXgiLCJwcm9wZXJ0eSIsImRlZmluZVByb3BlcnR5Iiwid3JpdGFibGUiLCJ2YWx1ZSIsImJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzIiwiYmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kcyIsImJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU1ldGhvZCIsImJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU1ldGhvZEluZGV4IiwiYWRkQmluZGFibGVDbGFzc1Byb3BlcnR5IiwidG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyIsImNvbnRleHQiLCJhZGRCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lIiwicmVtb3ZlQmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSIsImN1cnJlbnRQcm9wZXJ0eVZhbHVlcyIsImRlZmluZVByb3BlcnRpZXMiLCJnZXQiLCJzZXQiLCJrZXkiLCJlbGVtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInJlc2V0VGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyIsImNsYXNzVHlwZSIsIm1ldGhvZCIsImNsYXNzVHlwZUV2ZW50RGF0YSIsImNsYXNzVHlwZUNhbGxiYWNrTmFtZSIsInNwbGl0IiwiY2xhc3NUeXBlVGFyZ2V0TmFtZSIsImNsYXNzVHlwZUV2ZW50TmFtZSIsImNsYXNzVHlwZVRhcmdldCIsImNsYXNzVHlwZUV2ZW50Q2FsbGJhY2siLCJiaW5kIiwidG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50IiwiZXJyb3IiLCJSZWZlcmVuY2VFcnJvciIsIk5vZGVMaXN0IiwiZnJvbSIsIl9jbGFzc1R5cGVUYXJnZXQiLCJIVE1MRWxlbWVudCIsIlNlcnZpY2UiLCJhZGRQcm9wZXJ0aWVzIiwiX2RlZmF1bHRzIiwiZGVmYXVsdHMiLCJjb250ZW50VHlwZSIsInJlc3BvbnNlVHlwZSIsIl9yZXNwb25zZVR5cGVzIiwiX3Jlc3BvbnNlVHlwZSIsIl94aHIiLCJmaW5kIiwicmVzcG9uc2VUeXBlSXRlbSIsIl90eXBlIiwidHlwZSIsIl91cmwiLCJ1cmwiLCJfaGVhZGVycyIsImhlYWRlcnMiLCJoZWFkZXIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwiX2RhdGEiLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3RhdHVzIiwiYWJvcnQiLCJvcGVuIiwib25sb2FkIiwib25lcnJvciIsInNlbmQiLCJ0aGVuIiwiY3VycmVudFRhcmdldCIsImNhdGNoIiwiZW5hYmxlIiwiZGlzYWJsZSIsIk1vZGVsIiwiX2lzU2V0dGluZyIsImlzU2V0dGluZyIsIl9jaGFuZ2luZyIsImNoYW5naW5nIiwiX2xvY2FsU3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsIl9oaXN0aW9ncmFtIiwiaGlzdGlvZ3JhbSIsImFzc2lnbiIsIl9oaXN0b3J5IiwiaGlzdG9yeSIsInVuc2hpZnQiLCJwYXJzZSIsImRiIiwiX2RiIiwiZ2V0SXRlbSIsImVuZHBvaW50IiwiSlNPTiIsInN0cmluZ2lmeSIsInNldEl0ZW0iLCJpbmRleCIsInNldERhdGFQcm9wZXJ0eSIsInVuc2V0IiwidW5zZXREYXRhUHJvcGVydHkiLCJzZXREQiIsInVuc2V0REIiLCJjb25maWd1cmFibGUiLCJzZXRWYWx1ZUV2ZW50TmFtZSIsImpvaW4iLCJzZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlRXZlbnROYW1lIiwidW5zZXRFdmVudE5hbWUiLCJ1bnNldFZhbHVlIiwiVmlldyIsIl9lbGVtZW50TmFtZSIsIl9lbGVtZW50IiwidGFnTmFtZSIsImVsZW1lbnROYW1lIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZWxlbWVudE9ic2VydmVyIiwib2JzZXJ2ZSIsInN1YnRyZWUiLCJjaGlsZExpc3QiLCJfYXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVLZXkiLCJhdHRyaWJ1dGVWYWx1ZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsIl9lbGVtZW50T2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZWxlbWVudE9ic2VydmUiLCJfaW5zZXJ0IiwiaW5zZXJ0IiwiX3RlbXBsYXRlcyIsInRlbXBsYXRlcyIsInJlc2V0VUlFbGVtZW50cyIsInJlbW92ZVVJRWxlbWVudHMiLCJhZGRVSUVsZW1lbnRzIiwibXV0YXRpb25SZWNvcmRMaXN0Iiwib2JzZXJ2ZXIiLCJtdXRhdGlvblJlY29yZEluZGV4IiwibXV0YXRpb25SZWNvcmQiLCJhdXRvSW5zZXJ0IiwicGFyZW50RWxlbWVudCIsIk5vZGUiLCJpbnNlcnRBZGphY2VudEVsZW1lbnQiLCJfcGFyZW50RWxlbWVudCIsImpRdWVyeSIsImVhY2giLCJhdXRvUmVtb3ZlIiwicmVtb3ZlQ2hpbGQiLCJDb250cm9sbGVyIiwiUm91dGVyIiwiYWRkV2luZG93RXZlbnRzIiwicHJvdG9jb2wiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhvc3RuYW1lIiwicG9ydCIsInBhdGhuYW1lIiwicGF0aCIsInN0cmluZyIsIlJlZ0V4cCIsInJvb3QiLCJmcmFnbWVudHMiLCJtYXRjaCIsImhhc2giLCJwYXJhbWV0ZXJzIiwiaHJlZiIsInJlZHVjZSIsIl9wYXJhbWV0ZXJzIiwicGFyYW1ldGVyIiwicGFyYW1ldGVyRGF0YSIsIl9yb290IiwiX2hhc2hSb3V0aW5nIiwiaGFzaFJvdXRpbmciLCJfcm91dGVzIiwicm91dGVzIiwiX2NvbnRyb2xsZXIiLCJjb250cm9sbGVyIiwibWF0Y2hSb3V0ZSIsInJvdXRlRnJhZ21lbnRzIiwibG9jYXRpb25GcmFnbWVudHMiLCJyb3V0ZU1hdGNoZXMiLCJfcm91dGVNYXRjaGVzIiwicm91dGVGcmFnbWVudCIsInJvdXRlRnJhZ21lbnRJbmRleCIsImxvY2F0aW9uRnJhZ21lbnQiLCJnZXRSb3V0ZSIsInJvdXRlTmFtZSIsInJvdXRlU2V0dGluZ3MiLCJyb3V0ZSIsInBvcFN0YXRlIiwiZXZlbnQiLCJyb3V0ZURhdGEiLCJjYWxsYmFjayIsInJlbW92ZVdpbmRvd0V2ZW50cyIsIm5hdmlnYXRlIiwiTVZDIiwiVXRpbHMiXSwibWFwcGluZ3Mi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
