(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.MVC = factory());
}(this, (function () { 'use strict';

  EventTarget.prototype.on = EventTarget.prototype.on || EventTarget.prototype.addEventListener;
  EventTarget.prototype.off = EventTarget.prototype.off || EventTarget.prototype.removeEventListener;

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

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

    emit() {
      var _arguments = Array.from(arguments);

      var eventName = _arguments.splice(0, 1)[0];

      var eventData = _arguments.splice(0, 1)[0];

      var eventArguments = _arguments.splice(0);

      Object.entries(this.getEventCallbacks(eventName)).forEach((_ref) => {
        var [eventCallbackGroupName, eventCallbackGroup] = _ref;
        eventCallbackGroup.forEach(eventCallback => {
          eventCallback.apply(void 0, [{
            name: eventName,
            data: eventData
          }].concat(_toConsumableArray(eventArguments)));
        });
      });
      return this;
    }

  }

  class Channel {
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

    request(responseName) {
      if (this._responses[responseName]) {
        var _this$_responses;

        var _arguments = Array.prototype.slice.call(arguments).slice(1);

        return (_this$_responses = this._responses)[responseName].apply(_this$_responses, _toConsumableArray(_arguments));
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

  }

  class Channels {
    constructor() {}

    get _channels() {
      this.channels = this.channels ? this.channels : {};
      return this.channels;
    }

    channel(channelName) {
      this._channels[channelName] = this._channels[channelName] ? this._channels[channelName] : new Channel();
      return this._channels[channelName];
    }

    off(channelName) {
      delete this._channels[channelName];
    }

  }

  function UUID() {
    var uuid = "",
        i,
        random;

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;

      if (i == 8 || i == 12 || i == 16 || i == 20) {
        uuid += "-";
      }

      uuid += (i == 12 ? 4 : i == 16 ? random & 3 | 8 : random).toString(16);
    }

    return uuid;
  }



  var Utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    UUID: UUID
  });

  class Base extends Events {
    constructor(settings, configuration) {
      super();
      this._configuration = configuration || {};
      this._settings = settings || {};
      this.addBindableClassProperties();
      this.addClassDefaultProperties();
    }

    get _uuid() {
      this.uuid = this.uuid || MVC.Utils.UUID();
      return this.uuid;
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
      this.settings = settings;
      var classDefaultProperties = this.classDefaultProperties || [];
      classDefaultProperties = classDefaultProperties.concat(this.getBindableClassPropertiesNames());
      Object.entries(this.settings).forEach((_ref) => {
        var [settingKey, settingValue] = _ref;

        if (classDefaultProperties.indexOf(settingKey) === -1) {
          Object.defineProperty(this, ['_'.concat(settingKey)], {
            get: function get() {
              return this[settingKey];
            },
            set: function set(value) {
              this[settingKey] = value;
            }
          });
          this['_'.concat(settingKey)] = settingValue;
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

    getBindableClassPropertiesNames() {
      return this.bindableClassProperties ? this.bindableClassProperties.reduce((_bindableClassPropertiesNames, bindableClassPropertyName) => {
        _bindableClassPropertiesNames = _bindableClassPropertiesNames.concat(this.getBindableClassPropertyNames(bindableClassPropertyName));
        return _bindableClassPropertiesNames;
      }, []) : [];
    }

    getBindableClassPropertyNames(bindableClassPropertyName) {
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
        var currentPropertyValue = this.settings[classDefaultProperty] || this[classDefaultProperty];

        if (currentPropertyValue) {
          Object.defineProperty(this, classDefaultProperty, {
            writable: true
          });
          this['_'.concat(classDefaultProperty)] = currentPropertyValue;
        }
      });
      return this;
    }

    addBindableClassProperties() {
      if (this.bindableClassProperties) {
        this.bindableClassProperties.forEach(bindableClassPropertyName => {
          var bindableClassPropertyMethods = this.getBindableClassPropertyNames(bindableClassPropertyName);
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

      var currentPropertyValues = this.settings[bindableClassPropertyName] || this[bindableClassPropertyName];
      Object.defineProperties(this, {
        [bindableClassPropertyName]: {
          writable: true,
          value: currentPropertyValues
        },
        ['_'.concat(bindableClassPropertyName)]: {
          get: function get() {
            context[bindableClassPropertyName] = context[bindableClassPropertyName] || {};
            return context[bindableClassPropertyName];
          },
          set: function set(values) {
            var _values = Object.entries(values);

            _values.forEach((_ref2, index) => {
              var [key, value] = _ref2;

              switch (bindableClassPropertyName) {
                case 'uiElements':
                  context._uiElementSettings[key] = value;
                  Object.defineProperty(context['_'.concat(bindableClassPropertyName)], [key], {
                    get: function get() {
                      return context.element ? context.element.querySelectorAll(value) : null;
                    }
                  });

                  if (index === _values.length - 1) {
                    Object.defineProperty(context['_'.concat(bindableClassPropertyName)], '$element', {
                      configurable: true,
                      get: function get() {
                        if (context.element) {
                          return context.element;
                        }
                      }
                    });
                  }

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
        Object.entries(this[classType.concat('Events')]).forEach((_ref3) => {
          var [classTypeEventData, classTypeCallbackName] = _ref3;
          classTypeEventData = classTypeEventData.split(' ');
          var classTypeTargetName = classTypeEventData[0];
          var classTypeEventName = classTypeEventData[1];
          var classTypeTarget = this[classType.concat('s')][classTypeTargetName];
          var classTypeEventCallback = classType === 'uiElement' ? this[classType.concat('Callbacks')][classTypeCallbackName] : this[classType.concat('Callbacks')][classTypeCallbackName].bind(this);

          if (classTypeTargetName && classTypeEventName && classTypeTarget && classTypeEventCallback) {
            this.toggleTargetBindableClassEvent(classType, classTypeTarget, classTypeEventName, classTypeEventCallback, method);
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

  class Service extends Base {
    constructor() {
      super(...arguments);
    }

    get classDefaultProperties() {
      return ['responseType', 'type', 'parameters', 'url', 'headers', 'data'];
    }

    get _defaults() {
      return this.defaults || {
        contentType: {
          'Content-Type': 'application/json'
        },
        responseType: 'json'
      };
    }

    get _async() {
      this.async = this.async || true;
      return this.async;
    }

    set _async(async) {
      this.async = async;
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
      this.type = this.type || true;
      return this.type;
    }

    set _type(type) {
      this.type = type;
    }

    get _parameters() {
      this.parameters = this.parameters || {};
      return this.parameters;
    }

    set _parameters(parameters) {
      this.parameters = parameters;
    }

    get _url() {
      return this.url;
    }

    set _url(url) {
      this.url = url;
    }

    get _headers() {
      this.headers = this.headers || [this._defaults.contentType];
      return this.headers;
    }

    set _headers(headers) {
      this.headers = headers;
    }

    get _data() {
      this.data = this.data || {};
      return this.data;
    }

    set _data(data) {
      this.data = data;
    }

    get _xhr() {
      this.xhr = this.xhr ? this.xhr : new XMLHttpRequest();
      return this.xhr;
    }

    stringParameters() {
      var parameters = Object.entries(this._parameters);
      return parameters.length ? parameters.reduce((parameterString, _ref, parameterIndex) => {
        var [parameterKey, parameterValue] = _ref;
        var concatenator = parameterIndex !== parameters.length - 1 ? '&' : '';
        var assignmentOperator = '=';
        parameterString = parameterString.concat(parameterKey, assignmentOperator, parameterValue, concatenator);
        return parameterString;
      }, '?') : '';
    }

    request() {
      var type = this._type;
      var url = Object.keys(this._parameters).length ? this._url.concat(this.stringParameters()) : this._url;
      var async = this._async;
      var xhr = this._xhr;
      return new Promise((resolve, reject) => {
        xhr.onload = resolve;
        xhr.onerror = reject;
        xhr.open(type, url, async);

        this._headers.forEach(header => {
          header = Object.entries(header)[0];
          xhr.setRequestHeader(header[0], header[1]);
        });

        if (Object.keys(this._data).length) {
          xhr.send(this._data);
        } else {
          xhr.send();
        }
      }).then(response => {
        this.emit('xhrResolve', {
          name: 'xhrResolve',
          data: response.currentTarget
        }, this);
        return response;
      }).catch(error => {
        throw error;
      });
    }

  }

  class Model extends Base {
    constructor() {
      super(...arguments);
    }

    get storageContainer() {
      return {};
    }

    get defaultIDAttribute() {
      return '_id';
    }

    get bindableClassProperties() {
      return ['service'];
    }

    get classDefaultProperties() {
      return ['idAttribute', 'localStorage', 'histiogram', 'defaults'];
    }

    get _idAttribute() {
      this.idAttribute = this.idAttribute || this.defaultIDAttribute;
      return this.idAttribute;
    }

    set _idAttribute(idAttribute) {
      this.idAttribute = idAttribute;
    }

    get _defaults() {
      return this.defaults;
    }

    set _defaults(defaults) {
      this.defaults = defaults;
      this.set(this.defaults);
    }

    get _isSetting() {
      return this.isSetting;
    }

    set _isSetting(isSetting) {
      this.isSetting = isSetting;
    }

    get _silent() {
      this.silent = typeof this.silent === 'boolean' ? this.silent : false;
      return this.silent;
    }

    set _silent(silent) {
      this.silent = silent;
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

    get _data() {
      this.data = this.data || this.storageContainer;
      return this.data;
    }

    set _data(data) {
      this.data = data;
    }

    get db() {
      return this._db;
    }

    get _db() {
      var db = localStorage.getItem(this.localStorage.endpoint) || JSON.stringify(this.storageContainer);
      return JSON.parse(db);
    }

    set _db(db) {
      db = JSON.stringify(db);
      localStorage.setItem(this.localStorage.endpoint, db);
    }

    get() {
      switch (arguments.length) {
        case 0:
          return Object.assign({}, this._data);

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
            this._isSetting = index === _arguments.length - 1 ? false : true; // console.log('this._isSetting', this._isSetting, '\n', key, value, '\n', '------')

            this.setDataProperty(key, value);
          });

          break;

        case 2:
          if (typeof arguments[0] === 'string') {
            var key = arguments[0];
            var value = arguments[1];
            this.setDataProperty(key, value);
          } else {
            var _arguments = Object.entries(arguments[0]);

            var silent = arguments[1];

            _arguments.forEach((_ref2, index) => {
              var [key, value] = _ref2;
              this._isSetting = index === _arguments.length - 1 ? false : true; // console.log('this._isSetting', this._isSetting, '\n', key, value, '\n', '------')

              this._silent = silent;
              this.setDataProperty(key, value);
              this._silent = false;
            });
          }

          break;

        case 3:
          var key = arguments[0];
          var value = arguments[1];
          var silent = arguments[2];
          this._silent = silent;
          this.setDataProperty(key, value);
          this._silent = false;
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

          _arguments.forEach((_ref3) => {
            var [key, value] = _ref3;
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

              if (context.silent !== true) {
                context.emit(setValueEventName, {
                  name: setValueEventName,
                  data: {
                    key: key,
                    value: value
                  }
                }, context);
              }

              if (!context._isSetting) {
                if (!Object.values(context._changing).length) {
                  if (context.silent !== true) {
                    context.emit(setEventName, {
                      name: setEventName,
                      data: Object.assign({}, context._data)
                    }, context);
                  }
                } else {
                  if (context.silent !== true) {
                    context.emit(setEventName, {
                      name: setEventName,
                      data: Object.assign({}, context._changing, context._data)
                    }, context);
                  }
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
      data = data || this._data || this.storageContainer;
      return JSON.parse(JSON.stringify(data));
    }

  }

  class Collection extends Base {
    constructor() {
      super(...arguments);
    }

    get storageContainer() {
      return [];
    }

    get defaultIDAttribute() {
      return '_id';
    }

    get bindableClassProperties() {
      return ['service'];
    }

    get classDefaultProperties() {
      return ['idAttribute', 'model', 'defaults'];
    }

    get _idAttribute() {
      this.idAttribute = this.idAttribute || this.defaultIDAttribute;
      return this.idAttribute;
    }

    set _idAttribute(idAttribute) {
      this.idAttribute = idAttribute;
    }

    get _defaults() {
      return this.defaults;
    }

    set _defaults(defaults) {
      this.defaults = defaults;
      this.set(defaults);
    }

    get _models() {
      this.models = this.models || this.storageContainer;
      return this.models;
    }

    set _models(modelsData) {
      this.models = modelsData;
    }

    get _model() {
      return this.model;
    }

    set _model(model) {
      this.model = model;
    }

    get _isSetting() {
      return this.isSetting;
    }

    set _isSetting(isSetting) {
      this.isSetting = isSetting;
    }

    get _localStorage() {
      return this.localStorage;
    }

    set _localStorage(localStorage) {
      this.localStorage = localStorage;
    }

    get data() {
      return this._data;
    }

    get _data() {
      return this._models.map(model => model.parse());
    }

    get db() {
      return this._db;
    }

    get _db() {
      var db = localStorage.getItem(this._localStorage.endpoint) || JSON.stringify(this.storageContainer);
      return JSON.parse(db);
    }

    set _db(db) {
      db = JSON.stringify(db);
      localStorage.setItem(this._localStorage.endpoint, db);
    }

    getModelIndex(modelUUID) {
      var modelIndex;

      this._models.find((_model, _modelIndex) => {
        if (_model !== null) {
          if (_model instanceof Model && _model._uuid === modelUUID) {
            modelIndex = _modelIndex;
            return _model;
          }
        }
      });

      return modelIndex;
    }

    removeModelByIndex(modelIndex) {
      var model = this._models.splice(modelIndex, 1, null);

      this.emit('remove', {
        name: 'remove'
      }, model[0], this);
      return this;
    }

    addModel(modelData) {
      var model;

      if (modelData instanceof Model) {
        model = modelData;
        model.on('set', (event, _model) => {
          this.emit('change', {
            name: 'change'
          }, this);
        });

        this._models.push(model);
      }

      this.emit('add', {
        name: 'add'
      }, model, this);
      return this;
    }

    add(modelData) {
      this._isSetting = true;

      if (Array.isArray(modelData)) {
        modelData.forEach(_modelData => {
          this.addModel(_modelData);
        });
      } else {
        this.addModel(modelData);
      }

      if (this._localStorage) this._db = this._data;
      this._isSetting = false;
      this.emit('change', {
        name: 'change',
        data: this._data
      }, this);
      return this;
    }

    remove(modelData) {
      this._isSetting = true;

      if (!Array.isArray(modelData)) {
        var modelIndex = this.getModelIndex(modelData._uuid);
        this.removeModelByIndex(modelIndex);
      } else if (Array.isArray(modelData)) {
        modelData.forEach(model => {
          var modelIndex = this.getModelIndex(model._uuid);
          this.removeModelByIndex(modelIndex);
        });
      }

      this._models = this._models.filter(model => model !== null);
      if (this._localStorage) this._db = this._data;
      this._isSetting = false;
      this.emit('change', {
        name: 'change',
        data: this._data
      }, this);
      return this;
    }

    reset() {
      this.remove(this._models);
      return this;
    }

    parse(data) {
      data = data || this._data || this.storageContainer;
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

    elementObserve(mutationRecordList, observer) {
      for (var [mutationRecordIndex, mutationRecord] of Object.entries(mutationRecordList)) {
        switch (mutationRecord.type) {
          case 'childList':
            this.resetTargetBindableClassEvents('uiElement');

            if (mutationRecord.addedNodes.length && this.addedNodes) {
              this.addedNodes();
            }

            if (mutationRecord.removedNodes.length && this.removedNodes) {
              this.removedNodes();
            }

            break;
        }
      }
    }

    autoInsert() {
      var insert = this.insert;
      insert.parent.insertAdjacentElement(insert.method, this._element);
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
      return ['model', 'collection', 'view', 'controller', 'router'];
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

  var MVC$1 = {
    Events,
    Channels,
    Utils,
    Service,
    Model,
    Collection,
    View,
    Controller,
    Router
  };

  return MVC$1;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL3V1aWQuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0Jhc2UvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1NlcnZpY2UvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL01vZGVsL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Db2xsZWN0aW9uL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9WaWV3L2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Db250cm9sbGVyL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Sb3V0ZXIvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIkV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiA9IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lclxyXG5FdmVudFRhcmdldC5wcm90b3R5cGUub2ZmID0gRXZlbnRUYXJnZXQucHJvdG90eXBlLm9mZiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lclxyXG4iLCJjbGFzcyBFdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2V2ZW50cygpIHtcclxuICAgIHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMgfHwge31cclxuICAgIHJldHVybiB0aGlzLmV2ZW50c1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpIHsgcmV0dXJuIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdIHx8IHt9IH1cclxuICBnZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gKGV2ZW50Q2FsbGJhY2submFtZS5sZW5ndGgpXHJcbiAgICAgID8gZXZlbnRDYWxsYmFjay5uYW1lXHJcbiAgICAgIDogJ2Fub255bW91c0Z1bmN0aW9uJ1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKSB7XHJcbiAgICByZXR1cm4gZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdIHx8IFtdXHJcbiAgfVxyXG4gIG9uKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaykge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5nZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja05hbWUgPSB0aGlzLmdldEV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja0dyb3VwID0gdGhpcy5nZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKVxyXG4gICAgZXZlbnRDYWxsYmFja0dyb3VwLnB1c2goZXZlbnRDYWxsYmFjaylcclxuICAgIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudENhbGxiYWNrc1xyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgb2ZmKCkge1xyXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgICAgY2FzZSAwOlxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrTmFtZSA9ICh0eXBlb2YgZXZlbnRDYWxsYmFjayA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICA/IGV2ZW50Q2FsbGJhY2tcclxuICAgICAgICAgIDogdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKSB7XHJcbiAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1bZXZlbnRDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0pLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgKSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGVtaXQoKSB7XHJcbiAgICBsZXQgX2FyZ3VtZW50cyA9IEFycmF5LmZyb20oYXJndW1lbnRzKVxyXG4gICAgbGV0IGV2ZW50TmFtZSA9IF9hcmd1bWVudHMuc3BsaWNlKDAsIDEpWzBdXHJcbiAgICBsZXQgZXZlbnREYXRhID0gX2FyZ3VtZW50cy5zcGxpY2UoMCwgMSlbMF1cclxuICAgIGxldCBldmVudEFyZ3VtZW50cyA9IF9hcmd1bWVudHMuc3BsaWNlKDApXHJcbiAgICBPYmplY3QuZW50cmllcyh0aGlzLmdldEV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSkpXHJcbiAgICAgIC5mb3JFYWNoKChbZXZlbnRDYWxsYmFja0dyb3VwTmFtZSwgZXZlbnRDYWxsYmFja0dyb3VwXSkgPT4ge1xyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgICAgICAgLmZvckVhY2goKGV2ZW50Q2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgZXZlbnRDYWxsYmFjayhcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBldmVudE5hbWUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBldmVudERhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIC4uLmV2ZW50QXJndW1lbnRzXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBFdmVudHNcclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX3Jlc3BvbnNlcygpIHtcclxuICAgIHRoaXMucmVzcG9uc2VzID0gdGhpcy5yZXNwb25zZXNcclxuICAgICAgPyB0aGlzLnJlc3BvbnNlc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZiAocmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgICB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSA9IHJlc3BvbnNlQ2FsbGJhY2tcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VdXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlcXVlc3QocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZiAodGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0pIHtcclxuICAgICAgdmFyIF9hcmd1bWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLnNsaWNlKDEpXHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSguLi5fYXJndW1lbnRzKVxyXG4gICAgfVxyXG4gIH1cclxuICBvZmYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZiAocmVzcG9uc2VOYW1lKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yICh2YXIgW19yZXNwb25zZU5hbWVdIG9mIE9iamVjdC5rZXlzKHRoaXMuX3Jlc3BvbnNlcykpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW19yZXNwb25zZU5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IENoYW5uZWwgZnJvbSAnLi9DaGFubmVsL2luZGV4J1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfY2hhbm5lbHMoKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzID0gdGhpcy5jaGFubmVsc1xyXG4gICAgICA/IHRoaXMuY2hhbm5lbHNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbHNcclxuICB9XHJcbiAgY2hhbm5lbChjaGFubmVsTmFtZSkge1xyXG4gICAgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdID0gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgID8gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgIDogbmV3IENoYW5uZWwoKVxyXG4gICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxuICBvZmYoY2hhbm5lbE5hbWUpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVVVJRCgpIHtcclxuICB2YXIgdXVpZCA9IFwiXCIsIGksIHJhbmRvbVxyXG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSB7XHJcbiAgICByYW5kb20gPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwXHJcblxyXG4gICAgaWYgKGkgPT0gOCB8fCBpID09IDEyIHx8IGkgPT0gMTYgfHwgaSA9PSAyMCkge1xyXG4gICAgICB1dWlkICs9IFwiLVwiXHJcbiAgICB9XHJcbiAgICB1dWlkICs9IChpID09IDEyID8gNCA6IChpID09IDE2ID8gKHJhbmRvbSAmIDMgfCA4KSA6IHJhbmRvbSkpLnRvU3RyaW5nKDE2KVxyXG4gIH1cclxuICByZXR1cm4gdXVpZFxyXG59XHJcbiIsImltcG9ydCAnLi4vU2hpbXMvZXZlbnRzLmpzJ1xyXG5pbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleC5qcydcclxuXHJcbmNsYXNzIEJhc2UgZXh0ZW5kcyBFdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzLCBjb25maWd1cmF0aW9uKSB7XHJcbiAgICBzdXBlcigpXHJcbiAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbiB8fCB7fVxyXG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB7fVxyXG4gICAgdGhpcy5hZGRCaW5kYWJsZUNsYXNzUHJvcGVydGllcygpXHJcbiAgICB0aGlzLmFkZENsYXNzRGVmYXVsdFByb3BlcnRpZXMoKVxyXG4gIH1cclxuICBnZXQgX3V1aWQoKSB7XHJcbiAgICB0aGlzLnV1aWQgPSB0aGlzLnV1aWQgfHwgTVZDLlV0aWxzLlVVSUQoKVxyXG4gICAgcmV0dXJuIHRoaXMudXVpZFxyXG4gIH1cclxuICBnZXQgX25hbWUoKSB7IHJldHVybiB0aGlzLm5hbWUgfVxyXG4gIHNldCBfbmFtZShuYW1lKSB7IHRoaXMubmFtZSA9IG5hbWUgfVxyXG4gIGdldCBfc2V0dGluZ3MoKSB7XHJcbiAgICB0aGlzLnNldHRpbmdzID0gdGhpcy5zZXR0aW5ncyB8fCB7fVxyXG4gICAgcmV0dXJuIHRoaXMuc2V0dGluZ3NcclxuICB9XHJcbiAgc2V0IF9zZXR0aW5ncyhzZXR0aW5ncykge1xyXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgICBsZXQgY2xhc3NEZWZhdWx0UHJvcGVydGllcyA9IHRoaXMuY2xhc3NEZWZhdWx0UHJvcGVydGllcyB8fCBbXVxyXG4gICAgY2xhc3NEZWZhdWx0UHJvcGVydGllcyA9IGNsYXNzRGVmYXVsdFByb3BlcnRpZXMuY29uY2F0KHRoaXMuZ2V0QmluZGFibGVDbGFzc1Byb3BlcnRpZXNOYW1lcygpKVxyXG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5zZXR0aW5ncylcclxuICAgICAgLmZvckVhY2goKFtzZXR0aW5nS2V5LCBzZXR0aW5nVmFsdWVdKSA9PiB7XHJcbiAgICAgICAgaWYoY2xhc3NEZWZhdWx0UHJvcGVydGllcy5pbmRleE9mKHNldHRpbmdLZXkpID09PSAtMSkge1xyXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICBbJ18nLmNvbmNhdChzZXR0aW5nS2V5KV0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpc1tzZXR0aW5nS2V5XSB9LFxyXG4gICAgICAgICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHsgdGhpc1tzZXR0aW5nS2V5XSA9IHZhbHVlIH0sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIClcclxuICAgICAgICAgIHRoaXNbJ18nLmNvbmNhdChzZXR0aW5nS2V5KV0gPSBzZXR0aW5nVmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgfVxyXG4gIGdldCBfY29uZmlndXJhdGlvbigpIHtcclxuICAgIHRoaXMuY29uZmlndXJhdGlvbiA9IHRoaXMuY29uZmlndXJhdGlvbiB8fCB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblxyXG4gIH1cclxuICBzZXQgX2NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikge1xyXG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvblxyXG4gIH1cclxuICBnZXQgX3VpRWxlbWVudFNldHRpbmdzKCkge1xyXG4gICAgdGhpcy51aUVsZW1lbnRTZXR0aW5ncyA9IHRoaXMudWlFbGVtZW50U2V0dGluZ3MgfHwge31cclxuICAgIHJldHVybiB0aGlzLnVpRWxlbWVudFNldHRpbmdzXHJcbiAgfVxyXG4gIHNldCBfdWlFbGVtZW50U2V0dGluZ3ModWlFbGVtZW50U2V0dGluZ3MpIHtcclxuICAgIHRoaXMudWlFbGVtZW50U2V0dGluZ3MgPSB1aUVsZW1lbnRTZXR0aW5nc1xyXG4gIH1cclxuICBnZXRCaW5kYWJsZUNsYXNzUHJvcGVydGllc05hbWVzKCkge1xyXG4gICAgcmV0dXJuICh0aGlzLmJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKVxyXG4gICAgICA/IHRoaXMuYmluZGFibGVDbGFzc1Byb3BlcnRpZXNcclxuICAgICAgICAucmVkdWNlKChfYmluZGFibGVDbGFzc1Byb3BlcnRpZXNOYW1lcywgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkgPT4ge1xyXG4gICAgICAgICAgX2JpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzTmFtZXMgPSBfYmluZGFibGVDbGFzc1Byb3BlcnRpZXNOYW1lcy5jb25jYXQoXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0QmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZXMoXHJcbiAgICAgICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICByZXR1cm4gX2JpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzTmFtZXNcclxuICAgICAgICB9LCBbXSlcclxuICAgICAgOiBbXVxyXG4gIH1cclxuICBnZXRCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lcyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSB7XHJcbiAgICBzd2l0Y2goYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgICBjYXNlICdkYXRhJzpcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJycpLFxyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ0V2ZW50cycpLFxyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ0NhbGxiYWNrcycpXHJcbiAgICAgICAgXVxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICBiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLmNvbmNhdCgncycpLFxyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ0V2ZW50cycpLFxyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ0NhbGxiYWNrcycpXHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG4gIH1cclxuICBjYXBpdGFsaXplUHJvcGVydHlOYW1lKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpIHtcclxuICAgIGlmKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUuc2xpY2UoMCwgMikgPT09ICd1aScpIHtcclxuICAgICAgcmV0dXJuIGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUucmVwbGFjZSgvXnVpLywgJ1VJJylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCBmaXJzdENoYXJhY3RlciA9IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKClcclxuICAgICAgcmV0dXJuIGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUucmVwbGFjZSgvXi4vLCBmaXJzdENoYXJhY3RlcilcclxuICAgIH1cclxuICB9XHJcbiAgYWRkQ2xhc3NEZWZhdWx0UHJvcGVydGllcygpIHtcclxuICAgIHRoaXMuY2xhc3NEZWZhdWx0UHJvcGVydGllc1xyXG4gICAgICAuZm9yRWFjaCgoY2xhc3NEZWZhdWx0UHJvcGVydHksIGNsYXNzRGVmYXVsdFByb3BlcnR5SW5kZXgpID0+IHtcclxuICAgICAgICBsZXQgY3VycmVudFByb3BlcnR5VmFsdWUgPSB0aGlzLnNldHRpbmdzW2NsYXNzRGVmYXVsdFByb3BlcnR5XSB8fFxyXG4gICAgICAgIHRoaXNbY2xhc3NEZWZhdWx0UHJvcGVydHldXHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBjdXJyZW50UHJvcGVydHlWYWx1ZVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGNsYXNzRGVmYXVsdFByb3BlcnR5LCB7XHJcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIHRoaXNbJ18nLmNvbmNhdChjbGFzc0RlZmF1bHRQcm9wZXJ0eSldID0gY3VycmVudFByb3BlcnR5VmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBhZGRCaW5kYWJsZUNsYXNzUHJvcGVydGllcygpIHtcclxuICAgIGlmKHRoaXMuYmluZGFibGVDbGFzc1Byb3BlcnRpZXMpIHtcclxuICAgICAgdGhpcy5iaW5kYWJsZUNsYXNzUHJvcGVydGllc1xyXG4gICAgICAgIC5mb3JFYWNoKChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSA9PiB7XHJcbiAgICAgICAgICBsZXQgYmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kcyA9IHRoaXMuZ2V0QmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZXMoXHJcbiAgICAgICAgICAgIGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVcclxuICAgICAgICAgIClcclxuICAgICAgICAgIGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU1ldGhvZHNcclxuICAgICAgICAgICAgLmZvckVhY2goKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU1ldGhvZCwgYmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLmFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eShiaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2QpXHJcbiAgICAgICAgICAgICAgaWYoYmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kSW5kZXggPT09IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU1ldGhvZHMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUsICdvbicpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBhZGRCaW5kYWJsZUNsYXNzUHJvcGVydHkoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgbGV0IGNvbnRleHQgPSB0aGlzXHJcbiAgICBsZXQgY2FwaXRhbGl6ZVByb3BlcnR5TmFtZSA9IHRoaXMuY2FwaXRhbGl6ZVByb3BlcnR5TmFtZShiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKVxyXG4gICAgbGV0IGFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUgPSAnYWRkJy5jb25jYXQoY2FwaXRhbGl6ZVByb3BlcnR5TmFtZSlcclxuICAgIGxldCByZW1vdmVCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lID0gJ3JlbW92ZScuY29uY2F0KGNhcGl0YWxpemVQcm9wZXJ0eU5hbWUpXHJcbiAgICBpZihiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lID09PSAndWlFbGVtZW50cycpIHtcclxuICAgICAgY29udGV4dC5fdWlFbGVtZW50U2V0dGluZ3MgPSB0aGlzW2JpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdXHJcbiAgICB9XHJcbiAgICBsZXQgY3VycmVudFByb3BlcnR5VmFsdWVzID1cclxuICAgICAgdGhpcy5zZXR0aW5nc1tiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXSB8fFxyXG4gICAgICB0aGlzW2JpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhcclxuICAgICAgdGhpcyxcclxuICAgICAge1xyXG4gICAgICAgIFtiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXToge1xyXG4gICAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgICB2YWx1ZTogY3VycmVudFByb3BlcnR5VmFsdWVzLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgWydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldOiB7XHJcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjb250ZXh0W2JpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdID0gY29udGV4dFtiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXSB8fCB7fVxyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dFtiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNldDogZnVuY3Rpb24odmFsdWVzKSB7XHJcbiAgICAgICAgICAgIGxldCBfdmFsdWVzID0gT2JqZWN0LmVudHJpZXModmFsdWVzKVxyXG4gICAgICAgICAgICBfdmFsdWVzXHJcbiAgICAgICAgICAgICAgLmZvckVhY2goKFtrZXksIHZhbHVlXSwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgJ3VpRWxlbWVudHMnOlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuX3VpRWxlbWVudFNldHRpbmdzW2tleV0gPSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICBba2V5XSxcclxuICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGNvbnRleHQuZWxlbWVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gY29udGV4dC5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICBpZihpbmRleCA9PT0gX3ZhbHVlcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICckZWxlbWVudCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNvbnRleHQuZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGV4dC5lbGVtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dFsnXycuY29uY2F0KGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpXVtrZXldID0gdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgW2FkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdOiB7XHJcbiAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgICAgICAgbGV0IHZhbHVlID0gYXJndW1lbnRzWzFdXHJcbiAgICAgICAgICAgICAgY29udGV4dFsnXycuY29uY2F0KGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpXSA9IHtcclxuICAgICAgICAgICAgICAgIFtrZXldOiB2YWx1ZVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICBsZXQgdmFsdWVzID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgICAgICAgY29udGV4dFsnXycuY29uY2F0KGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpXSA9IHZhbHVlc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpXHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBbcmVtb3ZlQmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZV06IHtcclxuICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICAgICAgICBzd2l0Y2goYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAndWlFbGVtZW50cyc6XHJcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldW2tleV1cclxuICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRleHRbJ18nLmNvbmNhdCgndWlFbGVtZW50U2V0dGluZ3MnKV1ba2V5XVxyXG4gICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRleHRbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV1ba2V5XVxyXG4gICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDApe1xyXG4gICAgICAgICAgICAgIE9iamVjdC5rZXlzKGNvbnRleHRbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV0pXHJcbiAgICAgICAgICAgICAgICAuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHN3aXRjaChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndWlFbGVtZW50cyc6XHJcbiAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpXVtrZXldXHJcbiAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KCd1aUVsZW1lbnRTZXR0aW5ncycpXVtrZXldXHJcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpXVtrZXldXHJcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpXHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfVxyXG4gICAgKVxyXG4gICAgaWYoY3VycmVudFByb3BlcnR5VmFsdWVzKSB7XHJcbiAgICAgIHRoaXNbYWRkQmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZV0oY3VycmVudFByb3BlcnR5VmFsdWVzKVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcmVzZXRUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpIHtcclxuICAgIHJldHVybiB0aGlzXHJcbiAgICAgIC50b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUsICdvZmYnKVxyXG4gICAgICAudG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLCAnb24nKVxyXG4gIH1cclxuICB0b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKSB7XHJcbiAgICBpZihcclxuICAgICAgdGhpc1tjbGFzc1R5cGUuY29uY2F0KCdzJyldICYmXHJcbiAgICAgIHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJyldICYmXHJcbiAgICAgIHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJyldXHJcbiAgICApIHtcclxuICAgICAgT2JqZWN0LmVudHJpZXModGhpc1tjbGFzc1R5cGUuY29uY2F0KCdFdmVudHMnKV0pXHJcbiAgICAgICAgLmZvckVhY2goKFtjbGFzc1R5cGVFdmVudERhdGEsIGNsYXNzVHlwZUNhbGxiYWNrTmFtZV0pID0+IHtcclxuICAgICAgICAgIGNsYXNzVHlwZUV2ZW50RGF0YSA9IGNsYXNzVHlwZUV2ZW50RGF0YS5zcGxpdCgnICcpXHJcbiAgICAgICAgICBsZXQgY2xhc3NUeXBlVGFyZ2V0TmFtZSA9IGNsYXNzVHlwZUV2ZW50RGF0YVswXVxyXG4gICAgICAgICAgbGV0IGNsYXNzVHlwZUV2ZW50TmFtZSA9IGNsYXNzVHlwZUV2ZW50RGF0YVsxXVxyXG4gICAgICAgICAgbGV0IGNsYXNzVHlwZVRhcmdldCA9IHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgncycpXVtjbGFzc1R5cGVUYXJnZXROYW1lXVxyXG4gICAgICAgICAgbGV0IGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2sgPSAoY2xhc3NUeXBlID09PSAndWlFbGVtZW50JylcclxuICAgICAgICAgICAgPyB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXVtjbGFzc1R5cGVDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICAgIDogdGhpc1tjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKV1bY2xhc3NUeXBlQ2FsbGJhY2tOYW1lXS5iaW5kKHRoaXMpXHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgY2xhc3NUeXBlVGFyZ2V0TmFtZSAmJlxyXG4gICAgICAgICAgICBjbGFzc1R5cGVFdmVudE5hbWUgJiZcclxuICAgICAgICAgICAgY2xhc3NUeXBlVGFyZ2V0ICYmXHJcbiAgICAgICAgICAgIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2tcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudChcclxuICAgICAgICAgICAgICBjbGFzc1R5cGUsXHJcbiAgICAgICAgICAgICAgY2xhc3NUeXBlVGFyZ2V0LFxyXG4gICAgICAgICAgICAgIGNsYXNzVHlwZUV2ZW50TmFtZSxcclxuICAgICAgICAgICAgICBjbGFzc1R5cGVFdmVudENhbGxiYWNrLFxyXG4gICAgICAgICAgICAgIG1ldGhvZFxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHRvZ2dsZVRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudChcclxuICAgIGNsYXNzVHlwZSxcclxuICAgIGNsYXNzVHlwZVRhcmdldCxcclxuICAgIGNsYXNzVHlwZUV2ZW50TmFtZSxcclxuICAgIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2ssXHJcbiAgICBtZXRob2RcclxuICApIHtcclxuICAgIHN3aXRjaChtZXRob2QpIHtcclxuICAgICAgY2FzZSAnb24nOlxyXG4gICAgICAgIHN3aXRjaChjbGFzc1R5cGUpIHtcclxuICAgICAgICAgIGNhc2UgJ3VpRWxlbWVudCc6XHJcbiAgICAgICAgICAgIGlmKGNsYXNzVHlwZVRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XHJcbiAgICAgICAgICAgICAgQXJyYXkuZnJvbShjbGFzc1R5cGVUYXJnZXQpXHJcbiAgICAgICAgICAgICAgICAuZm9yRWFjaCgoX2NsYXNzVHlwZVRhcmdldCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBfY2xhc3NUeXBlVGFyZ2V0W21ldGhvZF0oY2xhc3NUeXBlRXZlbnROYW1lLCBjbGFzc1R5cGVFdmVudENhbGxiYWNrKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSBlbHNlIGlmKGNsYXNzVHlwZVRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgY2xhc3NUeXBlVGFyZ2V0W21ldGhvZF0oY2xhc3NUeXBlRXZlbnROYW1lLCBjbGFzc1R5cGVFdmVudENhbGxiYWNrKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ29mZic6XHJcbiAgICAgICAgc3dpdGNoKGNsYXNzVHlwZSkge1xyXG4gICAgICAgICAgY2FzZSAndWlFbGVtZW50JzpcclxuICAgICAgICAgICAgaWYoY2xhc3NUeXBlVGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuICAgICAgICAgICAgICBBcnJheS5mcm9tKGNsYXNzVHlwZVRhcmdldClcclxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKChfY2xhc3NUeXBlVGFyZ2V0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIF9jbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoY2xhc3NUeXBlVGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICBjbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQmFzZVxyXG4iLCJpbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4J1xuXG5jbGFzcyBTZXJ2aWNlIGV4dGVuZHMgQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgY2xhc3NEZWZhdWx0UHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAncmVzcG9uc2VUeXBlJyxcbiAgICAndHlwZScsXG4gICAgJ3BhcmFtZXRlcnMnLFxuICAgICd1cmwnLFxuICAgICdoZWFkZXJzJyxcbiAgICAnZGF0YSdcbiAgXSB9XG4gIGdldCBfZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLmRlZmF1bHRzIHx8IHtcbiAgICBjb250ZW50VHlwZTogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICAgIHJlc3BvbnNlVHlwZTogJ2pzb24nLFxuICB9IH1cbiAgZ2V0IF9hc3luYygpIHtcbiAgICB0aGlzLmFzeW5jID0gdGhpcy5hc3luYyB8fCB0cnVlXG4gICAgcmV0dXJuIHRoaXMuYXN5bmNcbiAgfVxuICBzZXQgX2FzeW5jKGFzeW5jKSB7IHRoaXMuYXN5bmMgPSBhc3luYyB9XG4gIGdldCBfcmVzcG9uc2VUeXBlcygpIHsgcmV0dXJuIFsnJywgJ2FycmF5YnVmZmVyJywgJ2Jsb2InLCAnZG9jdW1lbnQnLCAnanNvbicsICd0ZXh0J10gfVxuICBnZXQgX3Jlc3BvbnNlVHlwZSgpIHsgcmV0dXJuIHRoaXMucmVzcG9uc2VUeXBlIH1cbiAgc2V0IF9yZXNwb25zZVR5cGUocmVzcG9uc2VUeXBlKSB7XG4gICAgdGhpcy5feGhyLnJlc3BvbnNlVHlwZSA9IHRoaXMuX3Jlc3BvbnNlVHlwZXMuZmluZChcbiAgICAgIChyZXNwb25zZVR5cGVJdGVtKSA9PiByZXNwb25zZVR5cGVJdGVtID09PSByZXNwb25zZVR5cGVcbiAgICApIHx8IHRoaXMuX2RlZmF1bHRzLnJlc3BvbnNlVHlwZVxuICB9XG4gIGdldCBfdHlwZSgpIHtcbiAgICB0aGlzLnR5cGUgPSB0aGlzLnR5cGUgfHwgdHJ1ZVxuICAgIHJldHVybiB0aGlzLnR5cGVcbiAgfVxuICBzZXQgX3R5cGUodHlwZSkgeyB0aGlzLnR5cGUgPSB0eXBlIH1cbiAgZ2V0IF9wYXJhbWV0ZXJzKCkge1xuICAgIHRoaXMucGFyYW1ldGVycyA9IHRoaXMucGFyYW1ldGVycyB8fCB7fVxuICAgIHJldHVybiB0aGlzLnBhcmFtZXRlcnNcbiAgfVxuICBzZXQgX3BhcmFtZXRlcnMocGFyYW1ldGVycykgeyB0aGlzLnBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzIH1cbiAgZ2V0IF91cmwoKSB7IHJldHVybiB0aGlzLnVybCB9XG4gIHNldCBfdXJsKHVybCkgeyB0aGlzLnVybCA9IHVybCB9XG4gIGdldCBfaGVhZGVycygpIHtcbiAgICB0aGlzLmhlYWRlcnMgPSB0aGlzLmhlYWRlcnMgfHwgW3RoaXMuX2RlZmF1bHRzLmNvbnRlbnRUeXBlXVxuICAgIHJldHVybiB0aGlzLmhlYWRlcnNcbiAgfVxuICBzZXQgX2hlYWRlcnMoaGVhZGVycykgeyB0aGlzLmhlYWRlcnMgPSBoZWFkZXJzIH1cbiAgZ2V0IF9kYXRhKCkge1xuICAgIHRoaXMuZGF0YSA9IHRoaXMuZGF0YSB8fCB7fVxuICAgIHJldHVybiB0aGlzLmRhdGFcbiAgfVxuICBzZXQgX2RhdGEoZGF0YSkgeyB0aGlzLmRhdGEgPSBkYXRhIH1cbiAgZ2V0IF94aHIoKSB7XG4gICAgdGhpcy54aHIgPSAodGhpcy54aHIpXG4gICAgICA/IHRoaXMueGhyXG4gICAgICA6IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gICAgcmV0dXJuIHRoaXMueGhyXG4gIH1cbiAgc3RyaW5nUGFyYW1ldGVycygpIHtcbiAgICBsZXQgcGFyYW1ldGVycyA9IE9iamVjdC5lbnRyaWVzKHRoaXMuX3BhcmFtZXRlcnMpXG4gICAgcmV0dXJuIChwYXJhbWV0ZXJzLmxlbmd0aClcbiAgICAgID8gcGFyYW1ldGVyc1xuICAgICAgICAucmVkdWNlKFxuICAgICAgICAgIChcbiAgICAgICAgICAgIHBhcmFtZXRlclN0cmluZyxcbiAgICAgICAgICAgIFtwYXJhbWV0ZXJLZXksIHBhcmFtZXRlclZhbHVlXSxcbiAgICAgICAgICAgIHBhcmFtZXRlckluZGV4XG4gICAgICAgICAgKSA9PiB7XG4gICAgICAgICAgICBsZXQgY29uY2F0ZW5hdG9yID0gKFxuICAgICAgICAgICAgICBwYXJhbWV0ZXJJbmRleCAhPT0gcGFyYW1ldGVycy5sZW5ndGggLSAxXG4gICAgICAgICAgICApID8gJyYnXG4gICAgICAgICAgICAgIDogJydcbiAgICAgICAgICAgIGxldCBhc3NpZ25tZW50T3BlcmF0b3IgPSAnPSdcbiAgICAgICAgICAgIHBhcmFtZXRlclN0cmluZyA9IHBhcmFtZXRlclN0cmluZy5jb25jYXQoXG4gICAgICAgICAgICAgIHBhcmFtZXRlcktleSxcbiAgICAgICAgICAgICAgYXNzaWdubWVudE9wZXJhdG9yLFxuICAgICAgICAgICAgICBwYXJhbWV0ZXJWYWx1ZSxcbiAgICAgICAgICAgICAgY29uY2F0ZW5hdG9yXG4gICAgICAgICAgICApXG4gICAgICAgICAgICByZXR1cm4gcGFyYW1ldGVyU3RyaW5nXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnPydcbiAgICAgICAgKVxuICAgICAgOiAnJ1xuICB9XG4gIHJlcXVlc3QoKSB7XG4gICAgbGV0IHR5cGUgPSB0aGlzLl90eXBlXG4gICAgbGV0IHVybCA9IChPYmplY3Qua2V5cyh0aGlzLl9wYXJhbWV0ZXJzKS5sZW5ndGgpXG4gICAgICA/IHRoaXMuX3VybC5jb25jYXQoXG4gICAgICAgIHRoaXMuc3RyaW5nUGFyYW1ldGVycygpXG4gICAgICApXG4gICAgICA6IHRoaXMuX3VybFxuICAgIGxldCBhc3luYyA9IHRoaXMuX2FzeW5jXG4gICAgbGV0IHhociA9IHRoaXMuX3hoclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB4aHIub25sb2FkID0gcmVzb2x2ZVxuICAgICAgeGhyLm9uZXJyb3IgPSByZWplY3RcbiAgICAgIHhoci5vcGVuKHR5cGUsIHVybCwgYXN5bmMpXG4gICAgICB0aGlzLl9oZWFkZXJzLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICBoZWFkZXIgPSBPYmplY3QuZW50cmllcyhoZWFkZXIpWzBdXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgICAgfSlcbiAgICAgIGlmKE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpLmxlbmd0aCkge1xuICAgICAgICB4aHIuc2VuZCh0aGlzLl9kYXRhKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeGhyLnNlbmQoKVxuICAgICAgfVxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICB0aGlzLmVtaXQoXG4gICAgICAgICd4aHJSZXNvbHZlJywge1xuICAgICAgICAgIG5hbWU6ICd4aHJSZXNvbHZlJyxcbiAgICAgICAgICBkYXRhOiByZXNwb25zZS5jdXJyZW50VGFyZ2V0LFxuICAgICAgICB9LFxuICAgICAgICB0aGlzXG4gICAgICApXG4gICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHsgdGhyb3cgZXJyb3IgfSlcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgU2VydmljZVxuIiwiaW1wb3J0IEJhc2UgZnJvbSAnLi4vQmFzZS9pbmRleC5qcydcblxuY2xhc3MgTW9kZWwgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBzdG9yYWdlQ29udGFpbmVyKCkgeyByZXR1cm4ge30gfVxuICBnZXQgZGVmYXVsdElEQXR0cmlidXRlKCkgeyByZXR1cm4gJ19pZCcgfVxuICBnZXQgYmluZGFibGVDbGFzc1Byb3BlcnRpZXMoKSB7IHJldHVybiBbXG4gICAgJ3NlcnZpY2UnXG4gIF0gfVxuICBnZXQgY2xhc3NEZWZhdWx0UHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAnaWRBdHRyaWJ1dGUnLFxuICAgICdsb2NhbFN0b3JhZ2UnLFxuICAgICdoaXN0aW9ncmFtJyxcbiAgICAnZGVmYXVsdHMnXG4gIF0gfVxuICBnZXQgX2lkQXR0cmlidXRlKCkge1xuICAgIHRoaXMuaWRBdHRyaWJ1dGUgPSB0aGlzLmlkQXR0cmlidXRlIHx8IHRoaXMuZGVmYXVsdElEQXR0cmlidXRlXG4gICAgcmV0dXJuIHRoaXMuaWRBdHRyaWJ1dGVcbiAgfVxuICBzZXQgX2lkQXR0cmlidXRlKGlkQXR0cmlidXRlKSB7IHRoaXMuaWRBdHRyaWJ1dGUgPSBpZEF0dHJpYnV0ZSB9XG4gIGdldCBfZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLmRlZmF1bHRzIH1cbiAgc2V0IF9kZWZhdWx0cyhkZWZhdWx0cykge1xuICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgIHRoaXMuc2V0KHRoaXMuZGVmYXVsdHMpXG4gIH1cbiAgZ2V0IF9pc1NldHRpbmcoKSB7IHJldHVybiB0aGlzLmlzU2V0dGluZyB9XG4gIHNldCBfaXNTZXR0aW5nKGlzU2V0dGluZykgeyB0aGlzLmlzU2V0dGluZyA9IGlzU2V0dGluZyB9XG4gIGdldCBfc2lsZW50KCkge1xuICAgIHRoaXMuc2lsZW50ID0gKHR5cGVvZiB0aGlzLnNpbGVudCA9PT0gJ2Jvb2xlYW4nKVxuICAgICAgPyB0aGlzLnNpbGVudFxuICAgICAgOiBmYWxzZVxuICAgIHJldHVybiB0aGlzLnNpbGVudFxuICB9XG4gIHNldCBfc2lsZW50KHNpbGVudCkgeyB0aGlzLnNpbGVudCA9IHNpbGVudCB9XG4gIGdldCBfY2hhbmdpbmcoKSB7XG4gICAgdGhpcy5jaGFuZ2luZyA9IHRoaXMuY2hhbmdpbmcgfHwge31cbiAgICByZXR1cm4gdGhpcy5jaGFuZ2luZ1xuICB9XG4gIGdldCBfbG9jYWxTdG9yYWdlKCkgeyByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UgfVxuICBzZXQgX2xvY2FsU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHsgdGhpcy5sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UgfVxuICBnZXQgX2hpc3Rpb2dyYW0oKSB7IHJldHVybiB0aGlzLmhpc3Rpb2dyYW0gfHwge1xuICAgIGxlbmd0aDogMVxuICB9IH1cbiAgc2V0IF9oaXN0aW9ncmFtKGhpc3Rpb2dyYW0pIHtcbiAgICB0aGlzLmhpc3Rpb2dyYW0gPSBPYmplY3QuYXNzaWduKFxuICAgICAgdGhpcy5faGlzdGlvZ3JhbSxcbiAgICAgIGhpc3Rpb2dyYW1cbiAgICApXG4gIH1cbiAgZ2V0IF9oaXN0b3J5KCkge1xuICAgIHRoaXMuaGlzdG9yeSA9IHRoaXMuaGlzdG9yeSB8fCBbXVxuICAgIHJldHVybiB0aGlzLmhpc3RvcnlcbiAgfVxuICBzZXQgX2hpc3RvcnkoZGF0YSkge1xuICAgIGlmKFxuICAgICAgT2JqZWN0LmtleXMoZGF0YSkubGVuZ3RoXG4gICAgKSB7XG4gICAgICBpZih0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9oaXN0b3J5LnVuc2hpZnQodGhpcy5wYXJzZShkYXRhKSlcbiAgICAgICAgdGhpcy5faGlzdG9yeS5zcGxpY2UodGhpcy5faGlzdGlvZ3JhbS5sZW5ndGgpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBfZGF0YSgpIHtcbiAgICB0aGlzLmRhdGEgPSB0aGlzLmRhdGEgfHwgdGhpcy5zdG9yYWdlQ29udGFpbmVyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVxuICB9XG4gIHNldCBfZGF0YShkYXRhKSB7IHRoaXMuZGF0YSA9IGRhdGEgfVxuICBnZXQgZGIoKSB7IHJldHVybiB0aGlzLl9kYiB9XG4gIGdldCBfZGIoKSB7XG4gICAgbGV0IGRiID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHx8IEpTT04uc3RyaW5naWZ5KHRoaXMuc3RvcmFnZUNvbnRhaW5lcilcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkYilcbiAgfVxuICBzZXQgX2RiKGRiKSB7XG4gICAgZGIgPSBKU09OLnN0cmluZ2lmeShkYilcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCwgZGIpXG4gIH1cbiAgZ2V0KCkge1xuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIHRoaXMuX2RhdGFcbiAgICAgICAgKVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhW2tleV1cbiAgICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgc2V0KCkge1xuICAgIHRoaXMuX2hpc3RvcnkgPSB0aGlzLnBhcnNlKClcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICB0aGlzLl9pc1NldHRpbmcgPSB0cnVlXG4gICAgICAgIHZhciBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSwgaW5kZXgpID0+IHtcbiAgICAgICAgICB0aGlzLl9pc1NldHRpbmcgPSAoaW5kZXggPT09IChfYXJndW1lbnRzLmxlbmd0aCAtIDEpKVxuICAgICAgICAgICAgPyBmYWxzZVxuICAgICAgICAgICAgOiB0cnVlXG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ3RoaXMuX2lzU2V0dGluZycsIHRoaXMuX2lzU2V0dGluZywgJ1xcbicsIGtleSwgdmFsdWUsICdcXG4nLCAnLS0tLS0tJylcbiAgICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBpZih0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgICB2YXIgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICAgIHZhciBzaWxlbnQgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2lzU2V0dGluZyA9IChpbmRleCA9PT0gKF9hcmd1bWVudHMubGVuZ3RoIC0gMSkpXG4gICAgICAgICAgICAgID8gZmFsc2VcbiAgICAgICAgICAgICAgOiB0cnVlXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndGhpcy5faXNTZXR0aW5nJywgdGhpcy5faXNTZXR0aW5nLCAnXFxuJywga2V5LCB2YWx1ZSwgJ1xcbicsICctLS0tLS0nKVxuICAgICAgICAgICAgdGhpcy5fc2lsZW50ID0gc2lsZW50XG4gICAgICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICAgICAgdGhpcy5fc2lsZW50ID0gZmFsc2VcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDM6XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHZhciBzaWxlbnQgPSBhcmd1bWVudHNbMl1cbiAgICAgICAgdGhpcy5fc2lsZW50ID0gc2lsZW50XG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIHRoaXMuX3NpbGVudCA9IGZhbHNlXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpKSB7XG4gICAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREQigpIHtcbiAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHZhciBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGxldCB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgdGhpcy5fZGIgPSBkYlxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXREQigpIHtcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBkZWxldGUgdGhpcy5fZGJcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBkZWxldGUgZGJba2V5XVxuICAgICAgICB0aGlzLl9kYiA9IGRiXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpIHtcbiAgICBpZighdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldKSB7XG4gICAgICBsZXQgY29udGV4dCA9IHRoaXNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgICAgICB0aGlzLl9kYXRhLFxuICAgICAgICB7XG4gICAgICAgICAgWydfJy5jb25jYXQoa2V5KV06IHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNba2V5XSB9LFxuICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgIGNvbnRleHQuX2NoYW5naW5nW2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgICBpZihjb250ZXh0LmxvY2FsU3RvcmFnZSkgY29udGV4dC5zZXREQihrZXksIHZhbHVlKVxuICAgICAgICAgICAgICBsZXQgc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3NldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgICAgICAgICAgICBsZXQgc2V0RXZlbnROYW1lID0gJ3NldCdcbiAgICAgICAgICAgICAgaWYoY29udGV4dC5zaWxlbnQgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgICBzZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZighY29udGV4dC5faXNTZXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgaWYoIU9iamVjdC52YWx1ZXMoY29udGV4dC5fY2hhbmdpbmcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgaWYoY29udGV4dC5zaWxlbnQgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5fZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGlmKGNvbnRleHQuc2lsZW50ICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICAgICAgICBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAge30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuX2NoYW5naW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0Ll9kYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dC5jaGFuZ2luZ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApXG4gICAgfVxuICAgIHRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXSA9IHZhbHVlXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldERhdGFQcm9wZXJ0eShrZXkpIHtcbiAgICBsZXQgdW5zZXRWYWx1ZUV2ZW50TmFtZSA9IFsndW5zZXQnLCAnOicsIGtleV0uam9pbignJylcbiAgICBsZXQgdW5zZXRFdmVudE5hbWUgPSAndW5zZXQnXG4gICAgbGV0IHVuc2V0VmFsdWUgPSB0aGlzLl9kYXRhW2tleV1cbiAgICBkZWxldGUgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldXG4gICAgZGVsZXRlIHRoaXMuX2RhdGFba2V5XVxuICAgIHRoaXMuZW1pdChcbiAgICAgIHVuc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IHVuc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRoaXNcbiAgICApXG4gICAgdGhpcy5lbWl0KFxuICAgICAgdW5zZXRFdmVudE5hbWUsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IHVuc2V0RXZlbnROYW1lLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgdmFsdWU6IHVuc2V0VmFsdWUsXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0aGlzXG4gICAgKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgcGFyc2UoZGF0YSkge1xuICAgIGRhdGEgPSBkYXRhIHx8IHRoaXMuX2RhdGEgfHwgdGhpcy5zdG9yYWdlQ29udGFpbmVyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW9kZWxcbiIsImltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXguanMnXHJcbmltcG9ydCBNb2RlbCBmcm9tICcuLi9Nb2RlbC9pbmRleC5qcydcclxuXHJcbmNsYXNzIENvbGxlY3Rpb24gZXh0ZW5kcyBCYXNlIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICB9XHJcbiAgZ2V0IHN0b3JhZ2VDb250YWluZXIoKSB7IHJldHVybiBbXSB9XHJcbiAgZ2V0IGRlZmF1bHRJREF0dHJpYnV0ZSgpIHsgcmV0dXJuICdfaWQnIH1cclxuICBnZXQgYmluZGFibGVDbGFzc1Byb3BlcnRpZXMoKSB7IHJldHVybiBbXHJcbiAgICAnc2VydmljZSdcclxuICBdIH1cclxuICBnZXQgY2xhc3NEZWZhdWx0UHJvcGVydGllcygpIHsgcmV0dXJuIFtcclxuICAgICdpZEF0dHJpYnV0ZScsXHJcbiAgICAnbW9kZWwnLFxyXG4gICAgJ2RlZmF1bHRzJ1xyXG4gIF0gfVxyXG4gIGdldCBfaWRBdHRyaWJ1dGUoKSB7XHJcbiAgICB0aGlzLmlkQXR0cmlidXRlID0gdGhpcy5pZEF0dHJpYnV0ZSB8fCB0aGlzLmRlZmF1bHRJREF0dHJpYnV0ZVxyXG4gICAgcmV0dXJuIHRoaXMuaWRBdHRyaWJ1dGVcclxuICB9XHJcbiAgc2V0IF9pZEF0dHJpYnV0ZShpZEF0dHJpYnV0ZSkgeyB0aGlzLmlkQXR0cmlidXRlID0gaWRBdHRyaWJ1dGUgfVxyXG4gIGdldCBfZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLmRlZmF1bHRzIH1cclxuICBzZXQgX2RlZmF1bHRzKGRlZmF1bHRzKSB7XHJcbiAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHNcclxuICAgIHRoaXMuc2V0KGRlZmF1bHRzKVxyXG4gIH1cclxuICBnZXQgX21vZGVscygpIHtcclxuICAgIHRoaXMubW9kZWxzID0gdGhpcy5tb2RlbHMgfHwgdGhpcy5zdG9yYWdlQ29udGFpbmVyXHJcbiAgICByZXR1cm4gdGhpcy5tb2RlbHNcclxuICB9XHJcbiAgc2V0IF9tb2RlbHMobW9kZWxzRGF0YSkgeyB0aGlzLm1vZGVscyA9IG1vZGVsc0RhdGEgfVxyXG4gIGdldCBfbW9kZWwoKSB7IHJldHVybiB0aGlzLm1vZGVsIH1cclxuICBzZXQgX21vZGVsKG1vZGVsKSB7IHRoaXMubW9kZWwgPSBtb2RlbCB9XHJcbiAgZ2V0IF9pc1NldHRpbmcoKSB7IHJldHVybiB0aGlzLmlzU2V0dGluZyB9XHJcbiAgc2V0IF9pc1NldHRpbmcoaXNTZXR0aW5nKSB7IHRoaXMuaXNTZXR0aW5nID0gaXNTZXR0aW5nIH1cclxuICBnZXQgX2xvY2FsU3RvcmFnZSgpIHsgcmV0dXJuIHRoaXMubG9jYWxTdG9yYWdlIH1cclxuICBzZXQgX2xvY2FsU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHsgdGhpcy5sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UgfVxyXG4gIGdldCBkYXRhKCkgeyByZXR1cm4gdGhpcy5fZGF0YSB9XHJcbiAgZ2V0IF9kYXRhKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX21vZGVsc1xyXG4gICAgICAubWFwKChtb2RlbCkgPT4gbW9kZWwucGFyc2UoKSlcclxuICB9XHJcbiAgZ2V0IGRiKCkgeyByZXR1cm4gdGhpcy5fZGIgfVxyXG4gIGdldCBfZGIoKSB7XHJcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLl9sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHx8IEpTT04uc3RyaW5naWZ5KHRoaXMuc3RvcmFnZUNvbnRhaW5lcilcclxuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxyXG4gIH1cclxuICBzZXQgX2RiKGRiKSB7XHJcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5fbG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcclxuICB9XHJcbiAgZ2V0TW9kZWxJbmRleChtb2RlbFVVSUQpIHtcclxuICAgIGxldCBtb2RlbEluZGV4XHJcbiAgICB0aGlzLl9tb2RlbHNcclxuICAgICAgLmZpbmQoKF9tb2RlbCwgX21vZGVsSW5kZXgpID0+IHtcclxuICAgICAgICBpZihfbW9kZWwgIT09IG51bGwpIHtcclxuICAgICAgICAgIGlmKFxyXG4gICAgICAgICAgICBfbW9kZWwgaW5zdGFuY2VvZiBNb2RlbCAmJlxyXG4gICAgICAgICAgICBfbW9kZWwuX3V1aWQgPT09IG1vZGVsVVVJRFxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIG1vZGVsSW5kZXggPSBfbW9kZWxJbmRleFxyXG4gICAgICAgICAgICByZXR1cm4gX21vZGVsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgcmV0dXJuIG1vZGVsSW5kZXhcclxuICB9XHJcbiAgcmVtb3ZlTW9kZWxCeUluZGV4KG1vZGVsSW5kZXgpIHtcclxuICAgIGxldCBtb2RlbCA9IHRoaXMuX21vZGVscy5zcGxpY2UobW9kZWxJbmRleCwgMSwgbnVsbClcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ3JlbW92ZScsIHtcclxuICAgICAgICBuYW1lOiAncmVtb3ZlJyxcclxuICAgICAgfSxcclxuICAgICAgbW9kZWxbMF0sXHJcbiAgICAgIHRoaXNcclxuICAgIClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGFkZE1vZGVsKG1vZGVsRGF0YSkge1xyXG4gICAgbGV0IG1vZGVsXHJcbiAgICBpZihtb2RlbERhdGEgaW5zdGFuY2VvZiBNb2RlbCkge1xyXG4gICAgICBtb2RlbCA9IG1vZGVsRGF0YVxyXG4gICAgICBtb2RlbC5vbihcclxuICAgICAgICAnc2V0JyxcclxuICAgICAgICAoZXZlbnQsIF9tb2RlbCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5lbWl0KFxyXG4gICAgICAgICAgICAnY2hhbmdlJyxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIG5hbWU6ICdjaGFuZ2UnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuICAgICAgKVxyXG4gICAgICB0aGlzLl9tb2RlbHMucHVzaChtb2RlbClcclxuICAgIH1cclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ2FkZCcsXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnYWRkJyxcclxuICAgICAgfSxcclxuICAgICAgbW9kZWwsXHJcbiAgICAgIHRoaXNcclxuICAgIClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGFkZChtb2RlbERhdGEpIHtcclxuICAgIHRoaXMuX2lzU2V0dGluZyA9IHRydWVcclxuICAgIGlmKEFycmF5LmlzQXJyYXkobW9kZWxEYXRhKSkge1xyXG4gICAgICBtb2RlbERhdGFcclxuICAgICAgICAuZm9yRWFjaCgoX21vZGVsRGF0YSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5hZGRNb2RlbChfbW9kZWxEYXRhKVxyXG4gICAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmFkZE1vZGVsKG1vZGVsRGF0YSlcclxuICAgIH1cclxuICAgIGlmKHRoaXMuX2xvY2FsU3RvcmFnZSkgdGhpcy5fZGIgPSB0aGlzLl9kYXRhXHJcbiAgICB0aGlzLl9pc1NldHRpbmcgPSBmYWxzZVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAnY2hhbmdlJywge1xyXG4gICAgICAgIG5hbWU6ICdjaGFuZ2UnLFxyXG4gICAgICAgIGRhdGE6IHRoaXMuX2RhdGEsXHJcbiAgICAgIH0sXHJcbiAgICAgIHRoaXNcclxuICAgIClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHJlbW92ZShtb2RlbERhdGEpIHtcclxuICAgIHRoaXMuX2lzU2V0dGluZyA9IHRydWVcclxuICAgIGlmKFxyXG4gICAgICAhQXJyYXkuaXNBcnJheShtb2RlbERhdGEpXHJcbiAgICApIHtcclxuICAgICAgdmFyIG1vZGVsSW5kZXggPSB0aGlzLmdldE1vZGVsSW5kZXgobW9kZWxEYXRhLl91dWlkKVxyXG4gICAgICB0aGlzLnJlbW92ZU1vZGVsQnlJbmRleChtb2RlbEluZGV4KVxyXG4gICAgfSBlbHNlIGlmKEFycmF5LmlzQXJyYXkobW9kZWxEYXRhKSkge1xyXG4gICAgICBtb2RlbERhdGFcclxuICAgICAgICAuZm9yRWFjaCgobW9kZWwpID0+IHtcclxuICAgICAgICAgIHZhciBtb2RlbEluZGV4ID0gdGhpcy5nZXRNb2RlbEluZGV4KG1vZGVsLl91dWlkKVxyXG4gICAgICAgICAgdGhpcy5yZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgdGhpcy5fbW9kZWxzID0gdGhpcy5fbW9kZWxzXHJcbiAgICAgIC5maWx0ZXIoKG1vZGVsKSA9PiBtb2RlbCAhPT0gbnVsbClcclxuICAgIGlmKHRoaXMuX2xvY2FsU3RvcmFnZSkgdGhpcy5fZGIgPSB0aGlzLl9kYXRhXHJcblxyXG4gICAgdGhpcy5faXNTZXR0aW5nID0gZmFsc2VcclxuXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdjaGFuZ2UnLCB7XHJcbiAgICAgICAgbmFtZTogJ2NoYW5nZScsXHJcbiAgICAgICAgZGF0YTogdGhpcy5fZGF0YSxcclxuICAgICAgfSxcclxuICAgICAgdGhpc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLnJlbW92ZSh0aGlzLl9tb2RlbHMpXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBwYXJzZShkYXRhKSB7XHJcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLl9kYXRhIHx8IHRoaXMuc3RvcmFnZUNvbnRhaW5lclxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb2xsZWN0aW9uXHJcbiIsImltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXguanMnXG5cbmNsYXNzIFZpZXcgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBiaW5kYWJsZUNsYXNzUHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAndWlFbGVtZW50J1xuICBdIH1cbiAgZ2V0IGNsYXNzRGVmYXVsdFByb3BlcnRpZXMoKSB7IHJldHVybiBbXG4gICAgJ2VsZW1lbnROYW1lJyxcbiAgICAnZWxlbWVudCcsXG4gICAgJ2F0dHJpYnV0ZXMnLFxuICAgICd0ZW1wbGF0ZXMnLFxuICAgICdpbnNlcnQnXG4gIF0gfVxuICBnZXQgX2VsZW1lbnROYW1lKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudC50YWdOYW1lIH1cbiAgc2V0IF9lbGVtZW50TmFtZShlbGVtZW50TmFtZSkge1xuICAgIGlmKCF0aGlzLl9lbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50TmFtZSlcbiAgfVxuICBnZXQgX2VsZW1lbnQoKSB7IHJldHVybiB0aGlzLmVsZW1lbnQgfVxuICBzZXQgX2VsZW1lbnQoZWxlbWVudCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnRcbiAgICB0aGlzLmVsZW1lbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudCwge1xuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICB9KVxuICB9XG4gIGdldCBfYXR0cmlidXRlcygpIHtcbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSB0aGlzLmVsZW1lbnQuYXR0cmlidXRlc1xuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNcbiAgfVxuICBzZXQgX2F0dHJpYnV0ZXMoYXR0cmlidXRlcykge1xuICAgIGZvcihsZXQgW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGF0dHJpYnV0ZXMpKSB7XG4gICAgICBpZih0eXBlb2YgYXR0cmlidXRlVmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQucmVtb3ZlQXR0cmlidXRlKGF0dHJpYnV0ZUtleSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdldCBlbGVtZW50T2JzZXJ2ZXIoKSB7XG4gICAgdGhpcy5fZWxlbWVudE9ic2VydmVyID0gdGhpcy5fZWxlbWVudE9ic2VydmVyIHx8IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuICAgICAgdGhpcy5lbGVtZW50T2JzZXJ2ZS5iaW5kKHRoaXMpXG4gICAgKVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgfVxuICBnZXQgX2luc2VydCgpIHtcbiAgICB0aGlzLmluc2VydCA9IHRoaXMuaW5zZXJ0IHx8IG51bGxcbiAgICByZXR1cm4gdGhpcy5pbnNlcnRcbiAgfVxuICBzZXQgX2luc2VydChpbnNlcnQpIHsgdGhpcy5pbnNlcnQgPSBpbnNlcnQgfVxuICBnZXQgX3RlbXBsYXRlcygpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IHRoaXMudGVtcGxhdGVzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMudGVtcGxhdGVzXG4gIH1cbiAgc2V0IF90ZW1wbGF0ZXModGVtcGxhdGVzKSB7IHRoaXMudGVtcGxhdGVzID0gdGVtcGxhdGVzIH1cbiAgZWxlbWVudE9ic2VydmUobXV0YXRpb25SZWNvcmRMaXN0LCBvYnNlcnZlcikge1xuICAgIGZvcihsZXQgW211dGF0aW9uUmVjb3JkSW5kZXgsIG11dGF0aW9uUmVjb3JkXSBvZiBPYmplY3QuZW50cmllcyhtdXRhdGlvblJlY29yZExpc3QpKSB7XG4gICAgICBzd2l0Y2gobXV0YXRpb25SZWNvcmQudHlwZSkge1xuICAgICAgICBjYXNlICdjaGlsZExpc3QnOlxuICAgICAgICAgIGxldCBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMgPSBbJ2FkZGVkTm9kZXMnLCAncmVtb3ZlZE5vZGVzJ11cbiAgICAgICAgICB0aGlzLnJlc2V0VGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cygndWlFbGVtZW50JylcbiAgICAgICAgICBpZihtdXRhdGlvblJlY29yZC5hZGRlZE5vZGVzLmxlbmd0aCAmJiB0aGlzLmFkZGVkTm9kZXMpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkZWROb2RlcygpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKG11dGF0aW9uUmVjb3JkLnJlbW92ZWROb2Rlcy5sZW5ndGggJiYgdGhpcy5yZW1vdmVkTm9kZXMpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlZE5vZGVzKClcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYXV0b0luc2VydCgpIHtcbiAgICBsZXQgaW5zZXJ0ID0gdGhpcy5pbnNlcnRcbiAgICBpbnNlcnQucGFyZW50Lmluc2VydEFkamFjZW50RWxlbWVudChcbiAgICAgIGluc2VydC5tZXRob2QsXG4gICAgICB0aGlzLl9lbGVtZW50XG4gICAgKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgYXV0b1JlbW92ZSgpIHtcbiAgICBpZihcbiAgICAgIHRoaXMuZWxlbWVudCAmJlxuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnRcbiAgICApIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBWaWV3XG4iLCJpbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4J1xuXG5jb25zdCBDb250cm9sbGVyID0gY2xhc3MgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBiaW5kYWJsZUNsYXNzUHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAnbW9kZWwnLFxuICAgICdjb2xsZWN0aW9uJyxcbiAgICAndmlldycsXG4gICAgJ2NvbnRyb2xsZXInLFxuICAgICdyb3V0ZXInXG4gIF0gfVxuICBnZXQgY2xhc3NEZWZhdWx0UHJvcGVydGllcygpIHsgcmV0dXJuIFtdIH1cbn1cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xsZXJcbiIsImltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNvbnN0IFJvdXRlciA9IGNsYXNzIGV4dGVuZHMgQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgICB0aGlzLmFkZFdpbmRvd0V2ZW50cygpXG4gIH1cbiAgZ2V0IGNsYXNzRGVmYXVsdFByb3BlcnRpZXMoKSB7IHJldHVybiBbXG4gICAgJ3Jvb3QnLFxuICAgICdoYXNoUm91dGluZycsXG4gICAgJ2NvbnRyb2xsZXInLFxuICAgICdyb3V0ZXMnXG4gIF0gfVxuICBnZXQgcHJvdG9jb2woKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgfVxuICBnZXQgaG9zdG5hbWUoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgfVxuICBnZXQgcG9ydCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wb3J0IH1cbiAgZ2V0IHBhdGhuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIH1cbiAgZ2V0IHBhdGgoKSB7XG4gICAgbGV0IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZVxuICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cChbJ14nLCB0aGlzLnJvb3RdLmpvaW4oJycpKSwgJycpXG4gICAgICAuc3BsaXQoJz8nKVxuICAgICAgLnNsaWNlKDAsIDEpXG4gICAgICBbMF1cbiAgICBsZXQgZnJhZ21lbnRzID0gKFxuICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMFxuICAgICkgPyBbXVxuICAgICAgOiAoXG4gICAgICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXlxcLy8pICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9cXC8/LylcbiAgICAgICAgKSA/IFsnLyddXG4gICAgICAgICAgOiBzdHJpbmdcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICByZXR1cm4ge1xuICAgICAgZnJhZ21lbnRzOiBmcmFnbWVudHMsXG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICB9XG4gIH1cbiAgZ2V0IGhhc2goKSB7XG4gICAgbGV0IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoXG4gICAgICAuc2xpY2UoMSlcbiAgICAgIC5zcGxpdCgnPycpXG4gICAgICAuc2xpY2UoMCwgMSlcbiAgICAgIFswXVxuICAgIGxldCBmcmFnbWVudHMgPSAoXG4gICAgICBzdHJpbmcubGVuZ3RoID09PSAwXG4gICAgKSA/IFtdXG4gICAgICA6IChcbiAgICAgICAgICBzdHJpbmcubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9eXFwvLykgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL1xcLz8vKVxuICAgICAgICApID8gWycvJ11cbiAgICAgICAgICA6IHN0cmluZ1xuICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAuc3BsaXQoJy8nKVxuICAgIHJldHVybiB7XG4gICAgICBmcmFnbWVudHM6IGZyYWdtZW50cyxcbiAgICAgIHN0cmluZzogc3RyaW5nLFxuICAgIH1cbiAgfVxuICBnZXQgcGFyYW1ldGVycygpIHtcbiAgICBsZXQgc3RyaW5nXG4gICAgbGV0IGRhdGFcbiAgICBpZih3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvXFw/LykpIHtcbiAgICAgIGxldCBwYXJhbWV0ZXJzID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICAgICAgLnNwbGl0KCc/JylcbiAgICAgICAgLnNsaWNlKC0xKVxuICAgICAgICAuam9pbignJylcbiAgICAgIHN0cmluZyA9IHBhcmFtZXRlcnNcbiAgICAgIGRhdGEgPSBwYXJhbWV0ZXJzXG4gICAgICAgIC5zcGxpdCgnJicpXG4gICAgICAgIC5yZWR1Y2UoKFxuICAgICAgICAgIF9wYXJhbWV0ZXJzLFxuICAgICAgICAgIHBhcmFtZXRlclxuICAgICAgICApID0+IHtcbiAgICAgICAgICBsZXQgcGFyYW1ldGVyRGF0YSA9IHBhcmFtZXRlci5zcGxpdCgnPScpXG4gICAgICAgICAgX3BhcmFtZXRlcnNbcGFyYW1ldGVyRGF0YVswXV0gPSBwYXJhbWV0ZXJEYXRhWzFdXG4gICAgICAgICAgcmV0dXJuIF9wYXJhbWV0ZXJzXG4gICAgICAgIH0sIHt9KVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHJpbmcgPSAnJ1xuICAgICAgZGF0YSA9IHt9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9XG4gIH1cbiAgZ2V0IF9yb290KCkgeyByZXR1cm4gdGhpcy5yb290IHx8ICcvJyB9XG4gIHNldCBfcm9vdChyb290KSB7IHRoaXMucm9vdCA9IHJvb3QgfVxuICBnZXQgX2hhc2hSb3V0aW5nKCkgeyByZXR1cm4gdGhpcy5oYXNoUm91dGluZyB8fCBmYWxzZSB9XG4gIHNldCBfaGFzaFJvdXRpbmcoaGFzaFJvdXRpbmcpIHsgdGhpcy5oYXNoUm91dGluZyA9IGhhc2hSb3V0aW5nIH1cbiAgZ2V0IF9yb3V0ZXMoKSB7IHJldHVybiB0aGlzLnJvdXRlcyB9XG4gIHNldCBfcm91dGVzKHJvdXRlcykgeyB0aGlzLnJvdXRlcyA9IHJvdXRlcyB9XG4gIGdldCBfY29udHJvbGxlcigpIHsgcmV0dXJuIHRoaXMuY29udHJvbGxlciB9XG4gIHNldCBfY29udHJvbGxlcihjb250cm9sbGVyKSB7IHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXIgfVxuICBnZXQgbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvb3Q6IHRoaXMucm9vdCxcbiAgICAgIHBhdGg6IHRoaXMucGF0aCxcbiAgICAgIGhhc2g6IHRoaXMuaGFzaCxcbiAgICAgIHBhcmFtZXRlcnM6IHRoaXMucGFyYW1ldGVycyxcbiAgICB9XG4gIH1cbiAgbWF0Y2hSb3V0ZShyb3V0ZUZyYWdtZW50cywgbG9jYXRpb25GcmFnbWVudHMpIHtcbiAgICBsZXQgcm91dGVNYXRjaGVzID0gbmV3IEFycmF5KClcbiAgICBpZihyb3V0ZUZyYWdtZW50cy5sZW5ndGggPT09IGxvY2F0aW9uRnJhZ21lbnRzLmxlbmd0aCkge1xuICAgICAgcm91dGVNYXRjaGVzID0gcm91dGVGcmFnbWVudHNcbiAgICAgICAgLnJlZHVjZSgoX3JvdXRlTWF0Y2hlcywgcm91dGVGcmFnbWVudCwgcm91dGVGcmFnbWVudEluZGV4KSA9PiB7XG4gICAgICAgICAgbGV0IGxvY2F0aW9uRnJhZ21lbnQgPSBsb2NhdGlvbkZyYWdtZW50c1tyb3V0ZUZyYWdtZW50SW5kZXhdXG4gICAgICAgICAgaWYocm91dGVGcmFnbWVudC5tYXRjaCgvXlxcOi8pKSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2godHJ1ZSlcbiAgICAgICAgICB9IGVsc2UgaWYocm91dGVGcmFnbWVudCA9PT0gbG9jYXRpb25GcmFnbWVudCkge1xuICAgICAgICAgICAgX3JvdXRlTWF0Y2hlcy5wdXNoKHRydWUpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaChmYWxzZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yb3V0ZU1hdGNoZXNcbiAgICAgICAgfSwgW10pXG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRlTWF0Y2hlcy5wdXNoKGZhbHNlKVxuICAgIH1cbiAgICByZXR1cm4gKHJvdXRlTWF0Y2hlcy5pbmRleE9mKGZhbHNlKSA9PT0gLTEpXG4gICAgICA/IHRydWVcbiAgICAgIDogZmFsc2VcbiAgfVxuICBnZXRSb3V0ZShsb2NhdGlvbikge1xuICAgIGxldCByb3V0ZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnJvdXRlcylcbiAgICAgIC5yZWR1Y2UoKFxuICAgICAgICBfcm91dGVzLFxuICAgICAgICBbcm91dGVOYW1lLCByb3V0ZVNldHRpbmdzXSkgPT4ge1xuICAgICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IChcbiAgICAgICAgICAgIHJvdXRlTmFtZS5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICAgIHJvdXRlTmFtZS5tYXRjaCgvXlxcLy8pXG4gICAgICAgICAgKSA/IFtyb3V0ZU5hbWVdXG4gICAgICAgICAgICA6IChyb3V0ZU5hbWUubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICA/IFsnJ11cbiAgICAgICAgICAgICAgOiByb3V0ZU5hbWVcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICAgICAgICByb3V0ZVNldHRpbmdzLmZyYWdtZW50cyA9IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgICAgX3JvdXRlc1tyb3V0ZUZyYWdtZW50cy5qb2luKCcvJyldID0gcm91dGVTZXR0aW5nc1xuICAgICAgICAgIHJldHVybiBfcm91dGVzXG4gICAgICAgIH0sXG4gICAgICAgIHt9XG4gICAgICApXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMocm91dGVzKVxuICAgICAgLmZpbmQoKHJvdXRlKSA9PiB7XG4gICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IHJvdXRlLmZyYWdtZW50c1xuICAgICAgICBsZXQgbG9jYXRpb25GcmFnbWVudHMgPSAodGhpcy5oYXNoUm91dGluZylcbiAgICAgICAgICA/IGxvY2F0aW9uLmhhc2guZnJhZ21lbnRzXG4gICAgICAgICAgOiBsb2NhdGlvbi5wYXRoLmZyYWdtZW50c1xuICAgICAgICBsZXQgbWF0Y2hSb3V0ZSA9IHRoaXMubWF0Y2hSb3V0ZShcbiAgICAgICAgICByb3V0ZUZyYWdtZW50cyxcbiAgICAgICAgICBsb2NhdGlvbkZyYWdtZW50cyxcbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gbWF0Y2hSb3V0ZSA9PT0gdHJ1ZVxuICAgICAgfSlcbiAgfVxuICBwb3BTdGF0ZShldmVudCkge1xuICAgIGxldCBsb2NhdGlvbiA9IHRoaXMubG9jYXRpb25cbiAgICBsZXQgcm91dGUgPSB0aGlzLmdldFJvdXRlKGxvY2F0aW9uKVxuICAgIGxldCByb3V0ZURhdGEgPSB7XG4gICAgICByb3V0ZTogcm91dGUsXG4gICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgfVxuICAgIGlmKHJvdXRlKSB7XG4gICAgICB0aGlzLmNvbnRyb2xsZXJbcm91dGUuY2FsbGJhY2tdKHJvdXRlRGF0YSlcbiAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJywge1xuICAgICAgICBuYW1lOiAnY2hhbmdlJyxcbiAgICAgICAgZGF0YTogcm91dGVEYXRhLFxuICAgICAgfSxcbiAgICAgIHRoaXMpXG4gICAgfVxuICB9XG4gIGFkZFdpbmRvd0V2ZW50cygpIHtcbiAgICB3aW5kb3cub24oJ3BvcHN0YXRlJywgdGhpcy5wb3BTdGF0ZS5iaW5kKHRoaXMpKVxuICB9XG4gIHJlbW92ZVdpbmRvd0V2ZW50cygpIHtcbiAgICB3aW5kb3cub2ZmKCdwb3BzdGF0ZScsIHRoaXMucG9wU3RhdGUuYmluZCh0aGlzKSlcbiAgfVxuICBuYXZpZ2F0ZShwYXRoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFJvdXRlclxuIiwiaW1wb3J0ICcuL1NoaW1zL2V2ZW50cydcbmltcG9ydCBFdmVudHMgZnJvbSAnLi9FdmVudHMvaW5kZXgnXG5pbXBvcnQgQ2hhbm5lbHMgZnJvbSAnLi9DaGFubmVscy9pbmRleCdcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vVXRpbHMvaW5kZXgnXG5pbXBvcnQgU2VydmljZSBmcm9tICcuL1NlcnZpY2UvaW5kZXgnXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi9Nb2RlbC9pbmRleCdcbmltcG9ydCBDb2xsZWN0aW9uIGZyb20gJy4vQ29sbGVjdGlvbi9pbmRleCdcbmltcG9ydCBWaWV3IGZyb20gJy4vVmlldy9pbmRleCdcbmltcG9ydCBDb250cm9sbGVyIGZyb20gJy4vQ29udHJvbGxlci9pbmRleCdcbmltcG9ydCBSb3V0ZXIgZnJvbSAnLi9Sb3V0ZXIvaW5kZXgnXG5jb25zdCBNVkMgPSB7XG4gIEV2ZW50cyxcbiAgQ2hhbm5lbHMsXG4gIFV0aWxzLFxuICBTZXJ2aWNlLFxuICBNb2RlbCxcbiAgQ29sbGVjdGlvbixcbiAgVmlldyxcbiAgQ29udHJvbGxlcixcbiAgUm91dGVyLFxufVxuZXhwb3J0IGRlZmF1bHQgTVZDXG4iXSwibmFtZXMiOlsiRXZlbnRUYXJnZXQiLCJwcm90b3R5cGUiLCJvbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJvZmYiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiRXZlbnRzIiwiY29uc3RydWN0b3IiLCJfZXZlbnRzIiwiZXZlbnRzIiwiZ2V0RXZlbnRDYWxsYmFja3MiLCJldmVudE5hbWUiLCJnZXRFdmVudENhbGxiYWNrTmFtZSIsImV2ZW50Q2FsbGJhY2siLCJuYW1lIiwibGVuZ3RoIiwiZ2V0RXZlbnRDYWxsYmFja0dyb3VwIiwiZXZlbnRDYWxsYmFja3MiLCJldmVudENhbGxiYWNrTmFtZSIsImV2ZW50Q2FsbGJhY2tHcm91cCIsInB1c2giLCJhcmd1bWVudHMiLCJPYmplY3QiLCJrZXlzIiwiZW1pdCIsIl9hcmd1bWVudHMiLCJBcnJheSIsImZyb20iLCJzcGxpY2UiLCJldmVudERhdGEiLCJldmVudEFyZ3VtZW50cyIsImVudHJpZXMiLCJmb3JFYWNoIiwiZXZlbnRDYWxsYmFja0dyb3VwTmFtZSIsImRhdGEiLCJfcmVzcG9uc2VzIiwicmVzcG9uc2VzIiwicmVzcG9uc2UiLCJyZXNwb25zZU5hbWUiLCJyZXNwb25zZUNhbGxiYWNrIiwicmVxdWVzdCIsInNsaWNlIiwiY2FsbCIsIl9yZXNwb25zZU5hbWUiLCJfY2hhbm5lbHMiLCJjaGFubmVscyIsImNoYW5uZWwiLCJjaGFubmVsTmFtZSIsIkNoYW5uZWwiLCJVVUlEIiwidXVpZCIsImkiLCJyYW5kb20iLCJNYXRoIiwidG9TdHJpbmciLCJCYXNlIiwic2V0dGluZ3MiLCJjb25maWd1cmF0aW9uIiwiX2NvbmZpZ3VyYXRpb24iLCJfc2V0dGluZ3MiLCJhZGRCaW5kYWJsZUNsYXNzUHJvcGVydGllcyIsImFkZENsYXNzRGVmYXVsdFByb3BlcnRpZXMiLCJfdXVpZCIsIk1WQyIsIlV0aWxzIiwiX25hbWUiLCJjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzIiwiY29uY2F0IiwiZ2V0QmluZGFibGVDbGFzc1Byb3BlcnRpZXNOYW1lcyIsInNldHRpbmdLZXkiLCJzZXR0aW5nVmFsdWUiLCJpbmRleE9mIiwiZGVmaW5lUHJvcGVydHkiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsIl91aUVsZW1lbnRTZXR0aW5ncyIsInVpRWxlbWVudFNldHRpbmdzIiwiYmluZGFibGVDbGFzc1Byb3BlcnRpZXMiLCJyZWR1Y2UiLCJfYmluZGFibGVDbGFzc1Byb3BlcnRpZXNOYW1lcyIsImJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUiLCJnZXRCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lcyIsImNhcGl0YWxpemVQcm9wZXJ0eU5hbWUiLCJyZXBsYWNlIiwiZmlyc3RDaGFyYWN0ZXIiLCJzdWJzdHJpbmciLCJ0b1VwcGVyQ2FzZSIsImNsYXNzRGVmYXVsdFByb3BlcnR5IiwiY2xhc3NEZWZhdWx0UHJvcGVydHlJbmRleCIsImN1cnJlbnRQcm9wZXJ0eVZhbHVlIiwid3JpdGFibGUiLCJiaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2RzIiwiYmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kIiwiYmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kSW5kZXgiLCJhZGRCaW5kYWJsZUNsYXNzUHJvcGVydHkiLCJ0b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzIiwiY29udGV4dCIsImFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUiLCJyZW1vdmVCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lIiwiY3VycmVudFByb3BlcnR5VmFsdWVzIiwiZGVmaW5lUHJvcGVydGllcyIsInZhbHVlcyIsIl92YWx1ZXMiLCJpbmRleCIsImtleSIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiY29uZmlndXJhYmxlIiwicmVzZXRUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzIiwiY2xhc3NUeXBlIiwibWV0aG9kIiwiY2xhc3NUeXBlRXZlbnREYXRhIiwiY2xhc3NUeXBlQ2FsbGJhY2tOYW1lIiwic3BsaXQiLCJjbGFzc1R5cGVUYXJnZXROYW1lIiwiY2xhc3NUeXBlRXZlbnROYW1lIiwiY2xhc3NUeXBlVGFyZ2V0IiwiY2xhc3NUeXBlRXZlbnRDYWxsYmFjayIsImJpbmQiLCJ0b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnQiLCJOb2RlTGlzdCIsIl9jbGFzc1R5cGVUYXJnZXQiLCJIVE1MRWxlbWVudCIsIlNlcnZpY2UiLCJfZGVmYXVsdHMiLCJkZWZhdWx0cyIsImNvbnRlbnRUeXBlIiwicmVzcG9uc2VUeXBlIiwiX2FzeW5jIiwiYXN5bmMiLCJfcmVzcG9uc2VUeXBlcyIsIl9yZXNwb25zZVR5cGUiLCJfeGhyIiwiZmluZCIsInJlc3BvbnNlVHlwZUl0ZW0iLCJfdHlwZSIsInR5cGUiLCJfcGFyYW1ldGVycyIsInBhcmFtZXRlcnMiLCJfdXJsIiwidXJsIiwiX2hlYWRlcnMiLCJoZWFkZXJzIiwiX2RhdGEiLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsInN0cmluZ1BhcmFtZXRlcnMiLCJwYXJhbWV0ZXJTdHJpbmciLCJwYXJhbWV0ZXJJbmRleCIsInBhcmFtZXRlcktleSIsInBhcmFtZXRlclZhbHVlIiwiY29uY2F0ZW5hdG9yIiwiYXNzaWdubWVudE9wZXJhdG9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbmxvYWQiLCJvbmVycm9yIiwib3BlbiIsImhlYWRlciIsInNldFJlcXVlc3RIZWFkZXIiLCJzZW5kIiwidGhlbiIsImN1cnJlbnRUYXJnZXQiLCJjYXRjaCIsImVycm9yIiwiTW9kZWwiLCJzdG9yYWdlQ29udGFpbmVyIiwiZGVmYXVsdElEQXR0cmlidXRlIiwiX2lkQXR0cmlidXRlIiwiaWRBdHRyaWJ1dGUiLCJfaXNTZXR0aW5nIiwiaXNTZXR0aW5nIiwiX3NpbGVudCIsInNpbGVudCIsIl9jaGFuZ2luZyIsImNoYW5naW5nIiwiX2xvY2FsU3RvcmFnZSIsImxvY2FsU3RvcmFnZSIsIl9oaXN0aW9ncmFtIiwiaGlzdGlvZ3JhbSIsImFzc2lnbiIsIl9oaXN0b3J5IiwiaGlzdG9yeSIsInVuc2hpZnQiLCJwYXJzZSIsImRiIiwiX2RiIiwiZ2V0SXRlbSIsImVuZHBvaW50IiwiSlNPTiIsInN0cmluZ2lmeSIsInNldEl0ZW0iLCJzZXREYXRhUHJvcGVydHkiLCJ1bnNldCIsInVuc2V0RGF0YVByb3BlcnR5Iiwic2V0REIiLCJ1bnNldERCIiwic2V0VmFsdWVFdmVudE5hbWUiLCJqb2luIiwic2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZUV2ZW50TmFtZSIsInVuc2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZSIsIkNvbGxlY3Rpb24iLCJfbW9kZWxzIiwibW9kZWxzIiwibW9kZWxzRGF0YSIsIl9tb2RlbCIsIm1vZGVsIiwibWFwIiwiZ2V0TW9kZWxJbmRleCIsIm1vZGVsVVVJRCIsIm1vZGVsSW5kZXgiLCJfbW9kZWxJbmRleCIsInJlbW92ZU1vZGVsQnlJbmRleCIsImFkZE1vZGVsIiwibW9kZWxEYXRhIiwiZXZlbnQiLCJhZGQiLCJpc0FycmF5IiwiX21vZGVsRGF0YSIsInJlbW92ZSIsImZpbHRlciIsInJlc2V0IiwiVmlldyIsIl9lbGVtZW50TmFtZSIsIl9lbGVtZW50IiwidGFnTmFtZSIsImVsZW1lbnROYW1lIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZWxlbWVudE9ic2VydmVyIiwib2JzZXJ2ZSIsInN1YnRyZWUiLCJjaGlsZExpc3QiLCJfYXR0cmlidXRlcyIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVLZXkiLCJhdHRyaWJ1dGVWYWx1ZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsIl9lbGVtZW50T2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZWxlbWVudE9ic2VydmUiLCJfaW5zZXJ0IiwiaW5zZXJ0IiwiX3RlbXBsYXRlcyIsInRlbXBsYXRlcyIsIm11dGF0aW9uUmVjb3JkTGlzdCIsIm9ic2VydmVyIiwibXV0YXRpb25SZWNvcmRJbmRleCIsIm11dGF0aW9uUmVjb3JkIiwiYWRkZWROb2RlcyIsInJlbW92ZWROb2RlcyIsImF1dG9JbnNlcnQiLCJwYXJlbnQiLCJpbnNlcnRBZGphY2VudEVsZW1lbnQiLCJhdXRvUmVtb3ZlIiwicGFyZW50RWxlbWVudCIsInJlbW92ZUNoaWxkIiwiQ29udHJvbGxlciIsIlJvdXRlciIsImFkZFdpbmRvd0V2ZW50cyIsInByb3RvY29sIiwid2luZG93IiwibG9jYXRpb24iLCJob3N0bmFtZSIsInBvcnQiLCJwYXRobmFtZSIsInBhdGgiLCJzdHJpbmciLCJSZWdFeHAiLCJyb290IiwiZnJhZ21lbnRzIiwibWF0Y2giLCJoYXNoIiwiaHJlZiIsInBhcmFtZXRlciIsInBhcmFtZXRlckRhdGEiLCJfcm9vdCIsIl9oYXNoUm91dGluZyIsImhhc2hSb3V0aW5nIiwiX3JvdXRlcyIsInJvdXRlcyIsIl9jb250cm9sbGVyIiwiY29udHJvbGxlciIsIm1hdGNoUm91dGUiLCJyb3V0ZUZyYWdtZW50cyIsImxvY2F0aW9uRnJhZ21lbnRzIiwicm91dGVNYXRjaGVzIiwiX3JvdXRlTWF0Y2hlcyIsInJvdXRlRnJhZ21lbnQiLCJyb3V0ZUZyYWdtZW50SW5kZXgiLCJsb2NhdGlvbkZyYWdtZW50IiwiZ2V0Um91dGUiLCJyb3V0ZU5hbWUiLCJyb3V0ZVNldHRpbmdzIiwicm91dGUiLCJwb3BTdGF0ZSIsInJvdXRlRGF0YSIsImNhbGxiYWNrIiwicmVtb3ZlV2luZG93RXZlbnRzIiwibmF2aWdhdGUiLCJDaGFubmVscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0VBQUFBLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIsR0FBMkJGLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIsSUFBNEJGLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkUsZ0JBQTdFO0VBQ0FILFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkcsR0FBdEIsR0FBNEJKLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkcsR0FBdEIsSUFBNkJKLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkksbUJBQS9FOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VDREEsTUFBTUMsTUFBTixDQUFhO0VBQ1hDLEVBQUFBLFdBQVcsR0FBRzs7RUFDZCxNQUFJQyxPQUFKLEdBQWM7RUFDWixTQUFLQyxNQUFMLEdBQWMsS0FBS0EsTUFBTCxJQUFlLEVBQTdCO0VBQ0EsV0FBTyxLQUFLQSxNQUFaO0VBQ0Q7O0VBQ0RDLEVBQUFBLGlCQUFpQixDQUFDQyxTQUFELEVBQVk7RUFBRSxXQUFPLEtBQUtILE9BQUwsQ0FBYUcsU0FBYixLQUEyQixFQUFsQztFQUFzQzs7RUFDckVDLEVBQUFBLG9CQUFvQixDQUFDQyxhQUFELEVBQWdCO0VBQ2xDLFdBQVFBLGFBQWEsQ0FBQ0MsSUFBZCxDQUFtQkMsTUFBcEIsR0FDSEYsYUFBYSxDQUFDQyxJQURYLEdBRUgsbUJBRko7RUFHRDs7RUFDREUsRUFBQUEscUJBQXFCLENBQUNDLGNBQUQsRUFBaUJDLGlCQUFqQixFQUFvQztFQUN2RCxXQUFPRCxjQUFjLENBQUNDLGlCQUFELENBQWQsSUFBcUMsRUFBNUM7RUFDRDs7RUFDRGhCLEVBQUFBLEVBQUUsQ0FBQ1MsU0FBRCxFQUFZRSxhQUFaLEVBQTJCO0VBQzNCLFFBQUlJLGNBQWMsR0FBRyxLQUFLUCxpQkFBTCxDQUF1QkMsU0FBdkIsQ0FBckI7RUFDQSxRQUFJTyxpQkFBaUIsR0FBRyxLQUFLTixvQkFBTCxD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
