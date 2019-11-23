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

    emit(eventName, eventData) {
      var _arguments = Object.values(arguments);

      var eventCallbacks = Object.entries(this.getEventCallbacks(eventName));

      for (var [eventCallbackGroupName, eventCallbackGroup] of eventCallbacks) {
        for (var eventCallback of eventCallbackGroup) {
          var additionalArguments = _arguments.splice(2) || [];
          eventCallback.apply(void 0, [eventData].concat(_toConsumableArray(additionalArguments)));
        }
      }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL3V1aWQuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0Jhc2UvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1NlcnZpY2UvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL01vZGVsL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Db2xsZWN0aW9uL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9WaWV3L2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Db250cm9sbGVyL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Sb3V0ZXIvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIkV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiA9IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lclxyXG5FdmVudFRhcmdldC5wcm90b3R5cGUub2ZmID0gRXZlbnRUYXJnZXQucHJvdG90eXBlLm9mZiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lclxyXG4iLCJjbGFzcyBFdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2V2ZW50cygpIHtcclxuICAgIHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMgfHwge31cclxuICAgIHJldHVybiB0aGlzLmV2ZW50c1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpIHsgcmV0dXJuIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdIHx8IHt9IH1cclxuICBnZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gKGV2ZW50Q2FsbGJhY2submFtZS5sZW5ndGgpXHJcbiAgICAgID8gZXZlbnRDYWxsYmFjay5uYW1lXHJcbiAgICAgIDogJ2Fub255bW91c0Z1bmN0aW9uJ1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKSB7XHJcbiAgICByZXR1cm4gZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdIHx8IFtdXHJcbiAgfVxyXG4gIG9uKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaykge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5nZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja05hbWUgPSB0aGlzLmdldEV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja0dyb3VwID0gdGhpcy5nZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKVxyXG4gICAgZXZlbnRDYWxsYmFja0dyb3VwLnB1c2goZXZlbnRDYWxsYmFjaylcclxuICAgIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudENhbGxiYWNrc1xyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgb2ZmKCkge1xyXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgICAgY2FzZSAwOlxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrTmFtZSA9ICh0eXBlb2YgZXZlbnRDYWxsYmFjayA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICA/IGV2ZW50Q2FsbGJhY2tcclxuICAgICAgICAgIDogdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKSB7XHJcbiAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1bZXZlbnRDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0pLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgKSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGVtaXQoZXZlbnROYW1lLCBldmVudERhdGEpIHtcclxuICAgIGxldCBfYXJndW1lbnRzID0gT2JqZWN0LnZhbHVlcyhhcmd1bWVudHMpXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja3MgPSBPYmplY3QuZW50cmllcyhcclxuICAgICAgdGhpcy5nZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICApXHJcbiAgICBmb3IobGV0IFtldmVudENhbGxiYWNrR3JvdXBOYW1lLCBldmVudENhbGxiYWNrR3JvdXBdIG9mIGV2ZW50Q2FsbGJhY2tzKSB7XHJcbiAgICAgIGZvcihsZXQgZXZlbnRDYWxsYmFjayBvZiBldmVudENhbGxiYWNrR3JvdXApIHtcclxuICAgICAgICBsZXQgYWRkaXRpb25hbEFyZ3VtZW50cyA9IF9hcmd1bWVudHMuc3BsaWNlKDIpIHx8IFtdXHJcbiAgICAgICAgZXZlbnRDYWxsYmFjayhldmVudERhdGEsIC4uLmFkZGl0aW9uYWxBcmd1bWVudHMpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IEV2ZW50c1xyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfcmVzcG9uc2VzKCkge1xyXG4gICAgdGhpcy5yZXNwb25zZXMgPSB0aGlzLnJlc3BvbnNlc1xyXG4gICAgICA/IHRoaXMucmVzcG9uc2VzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLnJlc3BvbnNlc1xyXG4gIH1cclxuICByZXNwb25zZShyZXNwb25zZU5hbWUsIHJlc3BvbnNlQ2FsbGJhY2spIHtcclxuICAgIGlmIChyZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdID0gcmVzcG9uc2VDYWxsYmFja1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZV1cclxuICAgIH1cclxuICB9XHJcbiAgcmVxdWVzdChyZXNwb25zZU5hbWUpIHtcclxuICAgIGlmICh0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSkge1xyXG4gICAgICB2YXIgX2FyZ3VtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykuc2xpY2UoMSlcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKC4uLl9hcmd1bWVudHMpXHJcbiAgICB9XHJcbiAgfVxyXG4gIG9mZihyZXNwb25zZU5hbWUpIHtcclxuICAgIGlmIChyZXNwb25zZU5hbWUpIHtcclxuICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmb3IgKHZhciBbX3Jlc3BvbnNlTmFtZV0gb2YgT2JqZWN0LmtleXModGhpcy5fcmVzcG9uc2VzKSkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbX3Jlc3BvbnNlTmFtZV1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgQ2hhbm5lbCBmcm9tICcuL0NoYW5uZWwvaW5kZXgnXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9jaGFubmVscygpIHtcclxuICAgIHRoaXMuY2hhbm5lbHMgPSB0aGlzLmNoYW5uZWxzXHJcbiAgICAgID8gdGhpcy5jaGFubmVsc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsc1xyXG4gIH1cclxuICBjaGFubmVsKGNoYW5uZWxOYW1lKSB7XHJcbiAgICB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0gPSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICAgICAgPyB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICAgICAgOiBuZXcgQ2hhbm5lbCgpXHJcbiAgICByZXR1cm4gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG4gIG9mZihjaGFubmVsTmFtZSkge1xyXG4gICAgZGVsZXRlIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBVVUlEKCkge1xyXG4gIHZhciB1dWlkID0gXCJcIiwgaSwgcmFuZG9tXHJcbiAgZm9yIChpID0gMDsgaSA8IDMyOyBpKyspIHtcclxuICAgIHJhbmRvbSA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDBcclxuXHJcbiAgICBpZiAoaSA9PSA4IHx8IGkgPT0gMTIgfHwgaSA9PSAxNiB8fCBpID09IDIwKSB7XHJcbiAgICAgIHV1aWQgKz0gXCItXCJcclxuICAgIH1cclxuICAgIHV1aWQgKz0gKGkgPT0gMTIgPyA0IDogKGkgPT0gMTYgPyAocmFuZG9tICYgMyB8IDgpIDogcmFuZG9tKSkudG9TdHJpbmcoMTYpXHJcbiAgfVxyXG4gIHJldHVybiB1dWlkXHJcbn1cclxuIiwiaW1wb3J0ICcuLi9TaGltcy9ldmVudHMuanMnXHJcbmltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xyXG5cclxuY2xhc3MgQmFzZSBleHRlbmRzIEV2ZW50cyB7XHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MsIGNvbmZpZ3VyYXRpb24pIHtcclxuICAgIHN1cGVyKClcclxuICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uIHx8IHt9XHJcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzIHx8IHt9XHJcbiAgICB0aGlzLmFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKClcclxuICAgIHRoaXMuYWRkQ2xhc3NEZWZhdWx0UHJvcGVydGllcygpXHJcbiAgfVxyXG4gIGdldCBfdXVpZCgpIHtcclxuICAgIHRoaXMudXVpZCA9IHRoaXMudXVpZCB8fCBNVkMuVXRpbHMuVVVJRCgpXHJcbiAgICByZXR1cm4gdGhpcy51dWlkXHJcbiAgfVxyXG4gIGdldCBfbmFtZSgpIHsgcmV0dXJuIHRoaXMubmFtZSB9XHJcbiAgc2V0IF9uYW1lKG5hbWUpIHsgdGhpcy5uYW1lID0gbmFtZSB9XHJcbiAgZ2V0IF9zZXR0aW5ncygpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5nc1xyXG4gIH1cclxuICBzZXQgX3NldHRpbmdzKHNldHRpbmdzKSB7XHJcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcclxuICAgIGxldCBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzID0gdGhpcy5jbGFzc0RlZmF1bHRQcm9wZXJ0aWVzIHx8IFtdXHJcbiAgICBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzID0gY2xhc3NEZWZhdWx0UHJvcGVydGllcy5jb25jYXQodGhpcy5nZXRCaW5kYWJsZUNsYXNzUHJvcGVydGllc05hbWVzKCkpXHJcbiAgICBPYmplY3QuZW50cmllcyh0aGlzLnNldHRpbmdzKVxyXG4gICAgICAuZm9yRWFjaCgoW3NldHRpbmdLZXksIHNldHRpbmdWYWx1ZV0pID0+IHtcclxuICAgICAgICBpZihjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzLmluZGV4T2Yoc2V0dGluZ0tleSkgPT09IC0xKSB7XHJcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIFsnXycuY29uY2F0KHNldHRpbmdLZXkpXSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzW3NldHRpbmdLZXldIH0sXHJcbiAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkgeyB0aGlzW3NldHRpbmdLZXldID0gdmFsdWUgfSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgdGhpc1snXycuY29uY2F0KHNldHRpbmdLZXkpXSA9IHNldHRpbmdWYWx1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICB9XHJcbiAgZ2V0IF9jb25maWd1cmF0aW9uKCkge1xyXG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gdGhpcy5jb25maWd1cmF0aW9uIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmF0aW9uXHJcbiAgfVxyXG4gIHNldCBfY29uZmlndXJhdGlvbihjb25maWd1cmF0aW9uKSB7XHJcbiAgICB0aGlzLmNvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uXHJcbiAgfVxyXG4gIGdldCBfdWlFbGVtZW50U2V0dGluZ3MoKSB7XHJcbiAgICB0aGlzLnVpRWxlbWVudFNldHRpbmdzID0gdGhpcy51aUVsZW1lbnRTZXR0aW5ncyB8fCB7fVxyXG4gICAgcmV0dXJuIHRoaXMudWlFbGVtZW50U2V0dGluZ3NcclxuICB9XHJcbiAgc2V0IF91aUVsZW1lbnRTZXR0aW5ncyh1aUVsZW1lbnRTZXR0aW5ncykge1xyXG4gICAgdGhpcy51aUVsZW1lbnRTZXR0aW5ncyA9IHVpRWxlbWVudFNldHRpbmdzXHJcbiAgfVxyXG4gIGdldEJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzTmFtZXMoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMuYmluZGFibGVDbGFzc1Byb3BlcnRpZXMpXHJcbiAgICAgID8gdGhpcy5iaW5kYWJsZUNsYXNzUHJvcGVydGllc1xyXG4gICAgICAgIC5yZWR1Y2UoKF9iaW5kYWJsZUNsYXNzUHJvcGVydGllc05hbWVzLCBiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSA9PiB7XHJcbiAgICAgICAgICBfYmluZGFibGVDbGFzc1Byb3BlcnRpZXNOYW1lcyA9IF9iaW5kYWJsZUNsYXNzUHJvcGVydGllc05hbWVzLmNvbmNhdChcclxuICAgICAgICAgICAgdGhpcy5nZXRCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lcyhcclxuICAgICAgICAgICAgICBiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIClcclxuICAgICAgICAgIHJldHVybiBfYmluZGFibGVDbGFzc1Byb3BlcnRpZXNOYW1lc1xyXG4gICAgICAgIH0sIFtdKVxyXG4gICAgICA6IFtdXHJcbiAgfVxyXG4gIGdldEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVzKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpIHtcclxuICAgIHN3aXRjaChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSB7XHJcbiAgICAgIGNhc2UgJ2RhdGEnOlxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICBiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLmNvbmNhdCgnJyksXHJcbiAgICAgICAgICBiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLmNvbmNhdCgnRXZlbnRzJyksXHJcbiAgICAgICAgICBiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLmNvbmNhdCgnQ2FsbGJhY2tzJylcclxuICAgICAgICBdXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgIGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUuY29uY2F0KCdzJyksXHJcbiAgICAgICAgICBiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLmNvbmNhdCgnRXZlbnRzJyksXHJcbiAgICAgICAgICBiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLmNvbmNhdCgnQ2FsbGJhY2tzJylcclxuICAgICAgICBdXHJcbiAgICB9XHJcbiAgfVxyXG4gIGNhcGl0YWxpemVQcm9wZXJ0eU5hbWUoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgaWYoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5zbGljZSgwLCAyKSA9PT0gJ3VpJykge1xyXG4gICAgICByZXR1cm4gYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5yZXBsYWNlKC9edWkvLCAnVUknKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IGZpcnN0Q2hhcmFjdGVyID0gYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5zdWJzdHJpbmcoMCwgMSkudG9VcHBlckNhc2UoKVxyXG4gICAgICByZXR1cm4gYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5yZXBsYWNlKC9eLi8sIGZpcnN0Q2hhcmFjdGVyKVxyXG4gICAgfVxyXG4gIH1cclxuICBhZGRDbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkge1xyXG4gICAgdGhpcy5jbGFzc0RlZmF1bHRQcm9wZXJ0aWVzXHJcbiAgICAgIC5mb3JFYWNoKChjbGFzc0RlZmF1bHRQcm9wZXJ0eSwgY2xhc3NEZWZhdWx0UHJvcGVydHlJbmRleCkgPT4ge1xyXG4gICAgICAgIGxldCBjdXJyZW50UHJvcGVydHlWYWx1ZSA9IHRoaXMuc2V0dGluZ3NbY2xhc3NEZWZhdWx0UHJvcGVydHldIHx8XHJcbiAgICAgICAgdGhpc1tjbGFzc0RlZmF1bHRQcm9wZXJ0eV1cclxuICAgICAgICBpZihcclxuICAgICAgICAgIGN1cnJlbnRQcm9wZXJ0eVZhbHVlXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgY2xhc3NEZWZhdWx0UHJvcGVydHksIHtcclxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgdGhpc1snXycuY29uY2F0KGNsYXNzRGVmYXVsdFByb3BlcnR5KV0gPSBjdXJyZW50UHJvcGVydHlWYWx1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKCkge1xyXG4gICAgaWYodGhpcy5iaW5kYWJsZUNsYXNzUHJvcGVydGllcykge1xyXG4gICAgICB0aGlzLmJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzXHJcbiAgICAgICAgLmZvckVhY2goKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpID0+IHtcclxuICAgICAgICAgIGxldCBiaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2RzID0gdGhpcy5nZXRCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lcyhcclxuICAgICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kc1xyXG4gICAgICAgICAgICAuZm9yRWFjaCgoYmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kLCBiaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2RJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgIHRoaXMuYWRkQmluZGFibGVDbGFzc1Byb3BlcnR5KGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU1ldGhvZClcclxuICAgICAgICAgICAgICBpZihiaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2RJbmRleCA9PT0gYmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZVRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSwgJ29uJylcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eShiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSB7XHJcbiAgICBsZXQgY29udGV4dCA9IHRoaXNcclxuICAgIGxldCBjYXBpdGFsaXplUHJvcGVydHlOYW1lID0gdGhpcy5jYXBpdGFsaXplUHJvcGVydHlOYW1lKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpXHJcbiAgICBsZXQgYWRkQmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSA9ICdhZGQnLmNvbmNhdChjYXBpdGFsaXplUHJvcGVydHlOYW1lKVxyXG4gICAgbGV0IHJlbW92ZUJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUgPSAncmVtb3ZlJy5jb25jYXQoY2FwaXRhbGl6ZVByb3BlcnR5TmFtZSlcclxuICAgIGlmKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUgPT09ICd1aUVsZW1lbnRzJykge1xyXG4gICAgICBjb250ZXh0Ll91aUVsZW1lbnRTZXR0aW5ncyA9IHRoaXNbYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZV1cclxuICAgIH1cclxuICAgIGxldCBjdXJyZW50UHJvcGVydHlWYWx1ZXMgPVxyXG4gICAgICB0aGlzLnNldHRpbmdzW2JpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdIHx8XHJcbiAgICAgIHRoaXNbYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZV1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxyXG4gICAgICB0aGlzLFxyXG4gICAgICB7XHJcbiAgICAgICAgW2JpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdOiB7XHJcbiAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgICAgIHZhbHVlOiBjdXJyZW50UHJvcGVydHlWYWx1ZXMsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV06IHtcclxuICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHRbYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZV0gPSBjb250ZXh0W2JpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdIHx8IHt9XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0W2JpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZXMpIHtcclxuICAgICAgICAgICAgbGV0IF92YWx1ZXMgPSBPYmplY3QuZW50cmllcyh2YWx1ZXMpXHJcbiAgICAgICAgICAgIF92YWx1ZXNcclxuICAgICAgICAgICAgICAuZm9yRWFjaCgoW2tleSwgdmFsdWVdLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgY2FzZSAndWlFbGVtZW50cyc6XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5fdWlFbGVtZW50U2V0dGluZ3Nba2V5XSA9IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgY29udGV4dFsnXycuY29uY2F0KGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpXSxcclxuICAgICAgICAgICAgICAgICAgICAgIFtrZXldLFxyXG4gICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoY29udGV4dC5lbGVtZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBjb250ZXh0LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh2YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGluZGV4ID09PSBfdmFsdWVzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dFsnXycuY29uY2F0KGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJyRlbGVtZW50JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoY29udGV4dC5lbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250ZXh0LmVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldW2tleV0gPSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBbYWRkQmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZV06IHtcclxuICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBhcmd1bWVudHNbMV1cclxuICAgICAgICAgICAgICBjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldID0ge1xyXG4gICAgICAgICAgICAgICAgW2tleV06IHZhbHVlXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgIGxldCB2YWx1ZXMgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICAgICAgICBjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldID0gdmFsdWVzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yZXNldFRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSlcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHRcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIFtyZW1vdmVCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXToge1xyXG4gICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgICAgICAgIHN3aXRjaChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICd1aUVsZW1lbnRzJzpcclxuICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRleHRbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV1ba2V5XVxyXG4gICAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KCd1aUVsZW1lbnRTZXR0aW5ncycpXVtrZXldXHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpXVtrZXldXHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY29udGV4dFsnXycuY29uY2F0KGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpXSlcclxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgc3dpdGNoKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd1aUVsZW1lbnRzJzpcclxuICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldW2tleV1cclxuICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQoJ3VpRWxlbWVudFNldHRpbmdzJyldW2tleV1cclxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldW2tleV1cclxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yZXNldFRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSlcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHRcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9XHJcbiAgICApXHJcbiAgICBpZihjdXJyZW50UHJvcGVydHlWYWx1ZXMpIHtcclxuICAgICAgdGhpc1thZGRCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXShjdXJyZW50UHJvcGVydHlWYWx1ZXMpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICByZXNldFRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgcmV0dXJuIHRoaXNcclxuICAgICAgLnRvZ2dsZVRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSwgJ29mZicpXHJcbiAgICAgIC50b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUsICdvbicpXHJcbiAgfVxyXG4gIHRvZ2dsZVRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpIHtcclxuICAgIGlmKFxyXG4gICAgICB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ3MnKV0gJiZcclxuICAgICAgdGhpc1tjbGFzc1R5cGUuY29uY2F0KCdFdmVudHMnKV0gJiZcclxuICAgICAgdGhpc1tjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKV1cclxuICAgICkge1xyXG4gICAgICBPYmplY3QuZW50cmllcyh0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXSlcclxuICAgICAgICAuZm9yRWFjaCgoW2NsYXNzVHlwZUV2ZW50RGF0YSwgY2xhc3NUeXBlQ2FsbGJhY2tOYW1lXSkgPT4ge1xyXG4gICAgICAgICAgY2xhc3NUeXBlRXZlbnREYXRhID0gY2xhc3NUeXBlRXZlbnREYXRhLnNwbGl0KCcgJylcclxuICAgICAgICAgIGxldCBjbGFzc1R5cGVUYXJnZXROYW1lID0gY2xhc3NUeXBlRXZlbnREYXRhWzBdXHJcbiAgICAgICAgICBsZXQgY2xhc3NUeXBlRXZlbnROYW1lID0gY2xhc3NUeXBlRXZlbnREYXRhWzFdXHJcbiAgICAgICAgICBsZXQgY2xhc3NUeXBlVGFyZ2V0ID0gdGhpc1tjbGFzc1R5cGUuY29uY2F0KCdzJyldW2NsYXNzVHlwZVRhcmdldE5hbWVdXHJcbiAgICAgICAgICBsZXQgY2xhc3NUeXBlRXZlbnRDYWxsYmFjayA9IChjbGFzc1R5cGUgPT09ICd1aUVsZW1lbnQnKVxyXG4gICAgICAgICAgICA/IHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJyldW2NsYXNzVHlwZUNhbGxiYWNrTmFtZV1cclxuICAgICAgICAgICAgOiB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXVtjbGFzc1R5cGVDYWxsYmFja05hbWVdLmJpbmQodGhpcylcclxuICAgICAgICAgIGlmKFxyXG4gICAgICAgICAgICBjbGFzc1R5cGVUYXJnZXROYW1lICYmXHJcbiAgICAgICAgICAgIGNsYXNzVHlwZUV2ZW50TmFtZSAmJlxyXG4gICAgICAgICAgICBjbGFzc1R5cGVUYXJnZXQgJiZcclxuICAgICAgICAgICAgY2xhc3NUeXBlRXZlbnRDYWxsYmFja1xyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50KFxyXG4gICAgICAgICAgICAgIGNsYXNzVHlwZSxcclxuICAgICAgICAgICAgICBjbGFzc1R5cGVUYXJnZXQsXHJcbiAgICAgICAgICAgICAgY2xhc3NUeXBlRXZlbnROYW1lLFxyXG4gICAgICAgICAgICAgIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2ssXHJcbiAgICAgICAgICAgICAgbWV0aG9kXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgdG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50KFxyXG4gICAgY2xhc3NUeXBlLFxyXG4gICAgY2xhc3NUeXBlVGFyZ2V0LFxyXG4gICAgY2xhc3NUeXBlRXZlbnROYW1lLFxyXG4gICAgY2xhc3NUeXBlRXZlbnRDYWxsYmFjayxcclxuICAgIG1ldGhvZFxyXG4gICkge1xyXG4gICAgc3dpdGNoKG1ldGhvZCkge1xyXG4gICAgICBjYXNlICdvbic6XHJcbiAgICAgICAgc3dpdGNoKGNsYXNzVHlwZSkge1xyXG4gICAgICAgICAgY2FzZSAndWlFbGVtZW50JzpcclxuICAgICAgICAgICAgaWYoY2xhc3NUeXBlVGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuICAgICAgICAgICAgICBBcnJheS5mcm9tKGNsYXNzVHlwZVRhcmdldClcclxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKChfY2xhc3NUeXBlVGFyZ2V0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIF9jbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoY2xhc3NUeXBlVGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICBjbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnb2ZmJzpcclxuICAgICAgICBzd2l0Y2goY2xhc3NUeXBlKSB7XHJcbiAgICAgICAgICBjYXNlICd1aUVsZW1lbnQnOlxyXG4gICAgICAgICAgICBpZihjbGFzc1R5cGVUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xyXG4gICAgICAgICAgICAgIEFycmF5LmZyb20oY2xhc3NUeXBlVGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKF9jbGFzc1R5cGVUYXJnZXQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgX2NsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihjbGFzc1R5cGVUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY2xhc3NUeXBlVGFyZ2V0W21ldGhvZF0oY2xhc3NUeXBlRXZlbnROYW1lLCBjbGFzc1R5cGVFdmVudENhbGxiYWNrKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBCYXNlXHJcbiIsImltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNsYXNzIFNlcnZpY2UgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICdyZXNwb25zZVR5cGUnLFxuICAgICd0eXBlJyxcbiAgICAncGFyYW1ldGVycycsXG4gICAgJ3VybCcsXG4gICAgJ2hlYWRlcnMnLFxuICAgICdkYXRhJ1xuICBdIH1cbiAgZ2V0IF9kZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuZGVmYXVsdHMgfHwge1xuICAgIGNvbnRlbnRUeXBlOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30sXG4gICAgcmVzcG9uc2VUeXBlOiAnanNvbicsXG4gIH0gfVxuICBnZXQgX2FzeW5jKCkge1xuICAgIHRoaXMuYXN5bmMgPSB0aGlzLmFzeW5jIHx8IHRydWVcbiAgICByZXR1cm4gdGhpcy5hc3luY1xuICB9XG4gIHNldCBfYXN5bmMoYXN5bmMpIHsgdGhpcy5hc3luYyA9IGFzeW5jIH1cbiAgZ2V0IF9yZXNwb25zZVR5cGVzKCkgeyByZXR1cm4gWycnLCAnYXJyYXlidWZmZXInLCAnYmxvYicsICdkb2N1bWVudCcsICdqc29uJywgJ3RleHQnXSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlKCkgeyByZXR1cm4gdGhpcy5yZXNwb25zZVR5cGUgfVxuICBzZXQgX3Jlc3BvbnNlVHlwZShyZXNwb25zZVR5cGUpIHtcbiAgICB0aGlzLl94aHIucmVzcG9uc2VUeXBlID0gdGhpcy5fcmVzcG9uc2VUeXBlcy5maW5kKFxuICAgICAgKHJlc3BvbnNlVHlwZUl0ZW0pID0+IHJlc3BvbnNlVHlwZUl0ZW0gPT09IHJlc3BvbnNlVHlwZVxuICAgICkgfHwgdGhpcy5fZGVmYXVsdHMucmVzcG9uc2VUeXBlXG4gIH1cbiAgZ2V0IF90eXBlKCkge1xuICAgIHRoaXMudHlwZSA9IHRoaXMudHlwZSB8fCB0cnVlXG4gICAgcmV0dXJuIHRoaXMudHlwZVxuICB9XG4gIHNldCBfdHlwZSh0eXBlKSB7IHRoaXMudHlwZSA9IHR5cGUgfVxuICBnZXQgX3BhcmFtZXRlcnMoKSB7XG4gICAgdGhpcy5wYXJhbWV0ZXJzID0gdGhpcy5wYXJhbWV0ZXJzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMucGFyYW1ldGVyc1xuICB9XG4gIHNldCBfcGFyYW1ldGVycyhwYXJhbWV0ZXJzKSB7IHRoaXMucGFyYW1ldGVycyA9IHBhcmFtZXRlcnMgfVxuICBnZXQgX3VybCgpIHsgcmV0dXJuIHRoaXMudXJsIH1cbiAgc2V0IF91cmwodXJsKSB7IHRoaXMudXJsID0gdXJsIH1cbiAgZ2V0IF9oZWFkZXJzKCkge1xuICAgIHRoaXMuaGVhZGVycyA9IHRoaXMuaGVhZGVycyB8fCBbdGhpcy5fZGVmYXVsdHMuY29udGVudFR5cGVdXG4gICAgcmV0dXJuIHRoaXMuaGVhZGVyc1xuICB9XG4gIHNldCBfaGVhZGVycyhoZWFkZXJzKSB7IHRoaXMuaGVhZGVycyA9IGhlYWRlcnMgfVxuICBnZXQgX2RhdGEoKSB7XG4gICAgdGhpcy5kYXRhID0gdGhpcy5kYXRhIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YVxuICB9XG4gIHNldCBfZGF0YShkYXRhKSB7IHRoaXMuZGF0YSA9IGRhdGEgfVxuICBnZXQgX3hocigpIHtcbiAgICB0aGlzLnhociA9ICh0aGlzLnhocilcbiAgICAgID8gdGhpcy54aHJcbiAgICAgIDogbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICByZXR1cm4gdGhpcy54aHJcbiAgfVxuICBzdHJpbmdQYXJhbWV0ZXJzKCkge1xuICAgIGxldCBwYXJhbWV0ZXJzID0gT2JqZWN0LmVudHJpZXModGhpcy5fcGFyYW1ldGVycylcbiAgICByZXR1cm4gKHBhcmFtZXRlcnMubGVuZ3RoKVxuICAgICAgPyBwYXJhbWV0ZXJzXG4gICAgICAgIC5yZWR1Y2UoXG4gICAgICAgICAgKFxuICAgICAgICAgICAgcGFyYW1ldGVyU3RyaW5nLFxuICAgICAgICAgICAgW3BhcmFtZXRlcktleSwgcGFyYW1ldGVyVmFsdWVdLFxuICAgICAgICAgICAgcGFyYW1ldGVySW5kZXhcbiAgICAgICAgICApID0+IHtcbiAgICAgICAgICAgIGxldCBjb25jYXRlbmF0b3IgPSAoXG4gICAgICAgICAgICAgIHBhcmFtZXRlckluZGV4ICE9PSBwYXJhbWV0ZXJzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICkgPyAnJidcbiAgICAgICAgICAgICAgOiAnJ1xuICAgICAgICAgICAgbGV0IGFzc2lnbm1lbnRPcGVyYXRvciA9ICc9J1xuICAgICAgICAgICAgcGFyYW1ldGVyU3RyaW5nID0gcGFyYW1ldGVyU3RyaW5nLmNvbmNhdChcbiAgICAgICAgICAgICAgcGFyYW1ldGVyS2V5LFxuICAgICAgICAgICAgICBhc3NpZ25tZW50T3BlcmF0b3IsXG4gICAgICAgICAgICAgIHBhcmFtZXRlclZhbHVlLFxuICAgICAgICAgICAgICBjb25jYXRlbmF0b3JcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIHJldHVybiBwYXJhbWV0ZXJTdHJpbmdcbiAgICAgICAgICB9LFxuICAgICAgICAgICc/J1xuICAgICAgICApXG4gICAgICA6ICcnXG4gIH1cbiAgcmVxdWVzdCgpIHtcbiAgICBsZXQgdHlwZSA9IHRoaXMuX3R5cGVcbiAgICBsZXQgdXJsID0gKE9iamVjdC5rZXlzKHRoaXMuX3BhcmFtZXRlcnMpLmxlbmd0aClcbiAgICAgID8gdGhpcy5fdXJsLmNvbmNhdChcbiAgICAgICAgdGhpcy5zdHJpbmdQYXJhbWV0ZXJzKClcbiAgICAgIClcbiAgICAgIDogdGhpcy5fdXJsXG4gICAgbGV0IGFzeW5jID0gdGhpcy5fYXN5bmNcbiAgICBsZXQgeGhyID0gdGhpcy5feGhyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHhoci5vbmxvYWQgPSByZXNvbHZlXG4gICAgICB4aHIub25lcnJvciA9IHJlamVjdFxuICAgICAgeGhyLm9wZW4odHlwZSwgdXJsLCBhc3luYylcbiAgICAgIHRoaXMuX2hlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICAgIGhlYWRlciA9IE9iamVjdC5lbnRyaWVzKGhlYWRlcilbMF1cbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgICB9KVxuICAgICAgaWYoT2JqZWN0LmtleXModGhpcy5fZGF0YSkubGVuZ3RoKSB7XG4gICAgICAgIHhoci5zZW5kKHRoaXMuX2RhdGEpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4aHIuc2VuZCgpXG4gICAgICB9XG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgJ3hoclJlc29sdmUnLCB7XG4gICAgICAgICAgbmFtZTogJ3hoclJlc29sdmUnLFxuICAgICAgICAgIGRhdGE6IHJlc3BvbnNlLmN1cnJlbnRUYXJnZXQsXG4gICAgICAgIH0sXG4gICAgICAgIHRoaXNcbiAgICAgIClcbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH0pLmNhdGNoKChlcnJvcikgPT4geyB0aHJvdyBlcnJvciB9KVxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBTZXJ2aWNlXG4iLCJpbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4LmpzJ1xuXG5jbGFzcyBNb2RlbCBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IHN0b3JhZ2VDb250YWluZXIoKSB7IHJldHVybiB7fSB9XG4gIGdldCBkZWZhdWx0SURBdHRyaWJ1dGUoKSB7IHJldHVybiAnX2lkJyB9XG4gIGdldCBiaW5kYWJsZUNsYXNzUHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAnc2VydmljZSdcbiAgXSB9XG4gIGdldCBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICdpZEF0dHJpYnV0ZScsXG4gICAgJ2xvY2FsU3RvcmFnZScsXG4gICAgJ2hpc3Rpb2dyYW0nLFxuICAgICdkZWZhdWx0cydcbiAgXSB9XG4gIGdldCBfaWRBdHRyaWJ1dGUoKSB7XG4gICAgdGhpcy5pZEF0dHJpYnV0ZSA9IHRoaXMuaWRBdHRyaWJ1dGUgfHwgdGhpcy5kZWZhdWx0SURBdHRyaWJ1dGVcbiAgICByZXR1cm4gdGhpcy5pZEF0dHJpYnV0ZVxuICB9XG4gIHNldCBfaWRBdHRyaWJ1dGUoaWRBdHRyaWJ1dGUpIHsgdGhpcy5pZEF0dHJpYnV0ZSA9IGlkQXR0cmlidXRlIH1cbiAgZ2V0IF9kZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuZGVmYXVsdHMgfVxuICBzZXQgX2RlZmF1bHRzKGRlZmF1bHRzKSB7XG4gICAgdGhpcy5kZWZhdWx0cyA9IGRlZmF1bHRzXG4gICAgdGhpcy5zZXQodGhpcy5kZWZhdWx0cylcbiAgfVxuICBnZXQgX2lzU2V0dGluZygpIHsgcmV0dXJuIHRoaXMuaXNTZXR0aW5nIH1cbiAgc2V0IF9pc1NldHRpbmcoaXNTZXR0aW5nKSB7IHRoaXMuaXNTZXR0aW5nID0gaXNTZXR0aW5nIH1cbiAgZ2V0IF9zaWxlbnQoKSB7XG4gICAgdGhpcy5zaWxlbnQgPSAodHlwZW9mIHRoaXMuc2lsZW50ID09PSAnYm9vbGVhbicpXG4gICAgICA/IHRoaXMuc2lsZW50XG4gICAgICA6IGZhbHNlXG4gICAgcmV0dXJuIHRoaXMuc2lsZW50XG4gIH1cbiAgc2V0IF9zaWxlbnQoc2lsZW50KSB7IHRoaXMuc2lsZW50ID0gc2lsZW50IH1cbiAgZ2V0IF9jaGFuZ2luZygpIHtcbiAgICB0aGlzLmNoYW5naW5nID0gdGhpcy5jaGFuZ2luZyB8fCB7fVxuICAgIHJldHVybiB0aGlzLmNoYW5naW5nXG4gIH1cbiAgZ2V0IF9sb2NhbFN0b3JhZ2UoKSB7IHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZSB9XG4gIHNldCBfbG9jYWxTdG9yYWdlKGxvY2FsU3RvcmFnZSkgeyB0aGlzLmxvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XG4gIGdldCBfaGlzdGlvZ3JhbSgpIHsgcmV0dXJuIHRoaXMuaGlzdGlvZ3JhbSB8fCB7XG4gICAgbGVuZ3RoOiAxXG4gIH0gfVxuICBzZXQgX2hpc3Rpb2dyYW0oaGlzdGlvZ3JhbSkge1xuICAgIHRoaXMuaGlzdGlvZ3JhbSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB0aGlzLl9oaXN0aW9ncmFtLFxuICAgICAgaGlzdGlvZ3JhbVxuICAgIClcbiAgfVxuICBnZXQgX2hpc3RvcnkoKSB7XG4gICAgdGhpcy5oaXN0b3J5ID0gdGhpcy5oaXN0b3J5IHx8IFtdXG4gICAgcmV0dXJuIHRoaXMuaGlzdG9yeVxuICB9XG4gIHNldCBfaGlzdG9yeShkYXRhKSB7XG4gICAgaWYoXG4gICAgICBPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGlmKHRoaXMuX2hpc3Rpb2dyYW0ubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudW5zaGlmdCh0aGlzLnBhcnNlKGRhdGEpKVxuICAgICAgICB0aGlzLl9oaXN0b3J5LnNwbGljZSh0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aClcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IF9kYXRhKCkge1xuICAgIHRoaXMuZGF0YSA9IHRoaXMuZGF0YSB8fCB0aGlzLnN0b3JhZ2VDb250YWluZXJcbiAgICByZXR1cm4gdGhpcy5kYXRhXG4gIH1cbiAgc2V0IF9kYXRhKGRhdGEpIHsgdGhpcy5kYXRhID0gZGF0YSB9XG4gIGdldCBkYigpIHsgcmV0dXJuIHRoaXMuX2RiIH1cbiAgZ2V0IF9kYigpIHtcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgfHwgSlNPTi5zdHJpbmdpZnkodGhpcy5zdG9yYWdlQ29udGFpbmVyKVxuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICBnZXQoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAge30sXG4gICAgICAgICAgdGhpcy5fZGF0YVxuICAgICAgICApXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFba2V5XVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBzZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHRoaXMuX2lzU2V0dGluZyA9IHRydWVcbiAgICAgICAgdmFyIF9hcmd1bWVudHMgPSBPYmplY3QuZW50cmllcyhhcmd1bWVudHNbMF0pXG4gICAgICAgIF9hcmd1bWVudHMuZm9yRWFjaCgoW2tleSwgdmFsdWVdLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2lzU2V0dGluZyA9IChpbmRleCA9PT0gKF9hcmd1bWVudHMubGVuZ3RoIC0gMSkpXG4gICAgICAgICAgICA/IGZhbHNlXG4gICAgICAgICAgICA6IHRydWVcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygndGhpcy5faXNTZXR0aW5nJywgdGhpcy5faXNTZXR0aW5nLCAnXFxuJywga2V5LCB2YWx1ZSwgJ1xcbicsICctLS0tLS0nKVxuICAgICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIGlmKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdmFyIGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICAgIHZhciB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIF9hcmd1bWVudHMgPSBPYmplY3QuZW50cmllcyhhcmd1bWVudHNbMF0pXG4gICAgICAgICAgdmFyIHNpbGVudCA9IGFyZ3VtZW50c1sxXVxuICAgICAgICAgIF9hcmd1bWVudHMuZm9yRWFjaCgoW2tleSwgdmFsdWVdLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5faXNTZXR0aW5nID0gKGluZGV4ID09PSAoX2FyZ3VtZW50cy5sZW5ndGggLSAxKSlcbiAgICAgICAgICAgICAgPyBmYWxzZVxuICAgICAgICAgICAgICA6IHRydWVcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCd0aGlzLl9pc1NldHRpbmcnLCB0aGlzLl9pc1NldHRpbmcsICdcXG4nLCBrZXksIHZhbHVlLCAnXFxuJywgJy0tLS0tLScpXG4gICAgICAgICAgICB0aGlzLl9zaWxlbnQgPSBzaWxlbnRcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgICAgICB0aGlzLl9zaWxlbnQgPSBmYWxzZVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgdmFyIGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICB2YXIgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgdmFyIHNpbGVudCA9IGFyZ3VtZW50c1syXVxuICAgICAgICB0aGlzLl9zaWxlbnQgPSBzaWxlbnRcbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSlcbiAgICAgICAgdGhpcy5fc2lsZW50ID0gZmFsc2VcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXModGhpcy5fZGF0YSkpIHtcbiAgICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgICBicmVha1xuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHNldERCKCkge1xuICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdmFyIF9hcmd1bWVudHMgPSBPYmplY3QuZW50cmllcyhhcmd1bWVudHNbMF0pXG4gICAgICAgIF9hcmd1bWVudHMuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgZGJba2V5XSA9IHZhbHVlXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgbGV0IHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICBicmVha1xuICAgIH1cbiAgICB0aGlzLl9kYiA9IGRiXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldERCKCkge1xuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9kYlxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGRlbGV0ZSBkYltrZXldXG4gICAgICAgIHRoaXMuX2RiID0gZGJcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSkge1xuICAgIGlmKCF0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV0pIHtcbiAgICAgIGxldCBjb250ZXh0ID0gdGhpc1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXG4gICAgICAgIHRoaXMuX2RhdGEsXG4gICAgICAgIHtcbiAgICAgICAgICBbJ18nLmNvbmNhdChrZXkpXToge1xuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpc1trZXldIH0sXG4gICAgICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgdGhpc1trZXldID0gdmFsdWVcbiAgICAgICAgICAgICAgY29udGV4dC5fY2hhbmdpbmdba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgIGlmKGNvbnRleHQubG9jYWxTdG9yYWdlKSBjb250ZXh0LnNldERCKGtleSwgdmFsdWUpXG4gICAgICAgICAgICAgIGxldCBzZXRWYWx1ZUV2ZW50TmFtZSA9IFsnc2V0JywgJzonLCBrZXldLmpvaW4oJycpXG4gICAgICAgICAgICAgIGxldCBzZXRFdmVudE5hbWUgPSAnc2V0J1xuICAgICAgICAgICAgICBpZihjb250ZXh0LnNpbGVudCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICAgIHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBzZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmKCFjb250ZXh0Ll9pc1NldHRpbmcpIHtcbiAgICAgICAgICAgICAgICBpZighT2JqZWN0LnZhbHVlcyhjb250ZXh0Ll9jaGFuZ2luZykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICBpZihjb250ZXh0LnNpbGVudCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgICAgICAgc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0Ll9kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgaWYoY29udGV4dC5zaWxlbnQgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5fY2hhbmdpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuX2RhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0LmNoYW5naW5nXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gICAgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldID0gdmFsdWVcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0RGF0YVByb3BlcnR5KGtleSkge1xuICAgIGxldCB1bnNldFZhbHVlRXZlbnROYW1lID0gWyd1bnNldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgIGxldCB1bnNldEV2ZW50TmFtZSA9ICd1bnNldCdcbiAgICBsZXQgdW5zZXRWYWx1ZSA9IHRoaXMuX2RhdGFba2V5XVxuICAgIGRlbGV0ZSB0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV1cbiAgICBkZWxldGUgdGhpcy5fZGF0YVtrZXldXG4gICAgdGhpcy5lbWl0KFxuICAgICAgdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiB1bnNldFZhbHVlLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdGhpc1xuICAgIClcbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldEV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRoaXNcbiAgICApXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBwYXJzZShkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5fZGF0YSB8fCB0aGlzLnN0b3JhZ2VDb250YWluZXJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNb2RlbFxuIiwiaW1wb3J0IEJhc2UgZnJvbSAnLi4vQmFzZS9pbmRleC5qcydcclxuaW1wb3J0IE1vZGVsIGZyb20gJy4uL01vZGVsL2luZGV4LmpzJ1xyXG5cclxuY2xhc3MgQ29sbGVjdGlvbiBleHRlbmRzIEJhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxyXG4gIH1cclxuICBnZXQgc3RvcmFnZUNvbnRhaW5lcigpIHsgcmV0dXJuIFtdIH1cclxuICBnZXQgZGVmYXVsdElEQXR0cmlidXRlKCkgeyByZXR1cm4gJ19pZCcgfVxyXG4gIGdldCBiaW5kYWJsZUNsYXNzUHJvcGVydGllcygpIHsgcmV0dXJuIFtcclxuICAgICdzZXJ2aWNlJ1xyXG4gIF0gfVxyXG4gIGdldCBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xyXG4gICAgJ2lkQXR0cmlidXRlJyxcclxuICAgICdtb2RlbCcsXHJcbiAgICAnZGVmYXVsdHMnXHJcbiAgXSB9XHJcbiAgZ2V0IF9pZEF0dHJpYnV0ZSgpIHtcclxuICAgIHRoaXMuaWRBdHRyaWJ1dGUgPSB0aGlzLmlkQXR0cmlidXRlIHx8IHRoaXMuZGVmYXVsdElEQXR0cmlidXRlXHJcbiAgICByZXR1cm4gdGhpcy5pZEF0dHJpYnV0ZVxyXG4gIH1cclxuICBzZXQgX2lkQXR0cmlidXRlKGlkQXR0cmlidXRlKSB7IHRoaXMuaWRBdHRyaWJ1dGUgPSBpZEF0dHJpYnV0ZSB9XHJcbiAgZ2V0IF9kZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuZGVmYXVsdHMgfVxyXG4gIHNldCBfZGVmYXVsdHMoZGVmYXVsdHMpIHtcclxuICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0c1xyXG4gICAgdGhpcy5zZXQoZGVmYXVsdHMpXHJcbiAgfVxyXG4gIGdldCBfbW9kZWxzKCkge1xyXG4gICAgdGhpcy5tb2RlbHMgPSB0aGlzLm1vZGVscyB8fCB0aGlzLnN0b3JhZ2VDb250YWluZXJcclxuICAgIHJldHVybiB0aGlzLm1vZGVsc1xyXG4gIH1cclxuICBzZXQgX21vZGVscyhtb2RlbHNEYXRhKSB7IHRoaXMubW9kZWxzID0gbW9kZWxzRGF0YSB9XHJcbiAgZ2V0IF9tb2RlbCgpIHsgcmV0dXJuIHRoaXMubW9kZWwgfVxyXG4gIHNldCBfbW9kZWwobW9kZWwpIHsgdGhpcy5tb2RlbCA9IG1vZGVsIH1cclxuICBnZXQgX2lzU2V0dGluZygpIHsgcmV0dXJuIHRoaXMuaXNTZXR0aW5nIH1cclxuICBzZXQgX2lzU2V0dGluZyhpc1NldHRpbmcpIHsgdGhpcy5pc1NldHRpbmcgPSBpc1NldHRpbmcgfVxyXG4gIGdldCBfbG9jYWxTdG9yYWdlKCkgeyByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UgfVxyXG4gIHNldCBfbG9jYWxTdG9yYWdlKGxvY2FsU3RvcmFnZSkgeyB0aGlzLmxvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XHJcbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9kYXRhIH1cclxuICBnZXQgX2RhdGEoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbW9kZWxzXHJcbiAgICAgIC5tYXAoKG1vZGVsKSA9PiBtb2RlbC5wYXJzZSgpKVxyXG4gIH1cclxuICBnZXQgZGIoKSB7IHJldHVybiB0aGlzLl9kYiB9XHJcbiAgZ2V0IF9kYigpIHtcclxuICAgIGxldCBkYiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuX2xvY2FsU3RvcmFnZS5lbmRwb2ludCkgfHwgSlNPTi5zdHJpbmdpZnkodGhpcy5zdG9yYWdlQ29udGFpbmVyKVxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGIpXHJcbiAgfVxyXG4gIHNldCBfZGIoZGIpIHtcclxuICAgIGRiID0gSlNPTi5zdHJpbmdpZnkoZGIpXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLl9sb2NhbFN0b3JhZ2UuZW5kcG9pbnQsIGRiKVxyXG4gIH1cclxuICBnZXRNb2RlbEluZGV4KG1vZGVsVVVJRCkge1xyXG4gICAgbGV0IG1vZGVsSW5kZXhcclxuICAgIHRoaXMuX21vZGVsc1xyXG4gICAgICAuZmluZCgoX21vZGVsLCBfbW9kZWxJbmRleCkgPT4ge1xyXG4gICAgICAgIGlmKF9tb2RlbCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIF9tb2RlbCBpbnN0YW5jZW9mIE1vZGVsICYmXHJcbiAgICAgICAgICAgIF9tb2RlbC5fdXVpZCA9PT0gbW9kZWxVVUlEXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgbW9kZWxJbmRleCA9IF9tb2RlbEluZGV4XHJcbiAgICAgICAgICAgIHJldHVybiBfbW9kZWxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gbW9kZWxJbmRleFxyXG4gIH1cclxuICByZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleCkge1xyXG4gICAgbGV0IG1vZGVsID0gdGhpcy5fbW9kZWxzLnNwbGljZShtb2RlbEluZGV4LCAxLCBudWxsKVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAncmVtb3ZlJywge1xyXG4gICAgICAgIG5hbWU6ICdyZW1vdmUnLFxyXG4gICAgICB9LFxyXG4gICAgICBtb2RlbFswXSxcclxuICAgICAgdGhpc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgYWRkTW9kZWwobW9kZWxEYXRhKSB7XHJcbiAgICBsZXQgbW9kZWxcclxuICAgIGlmKG1vZGVsRGF0YSBpbnN0YW5jZW9mIE1vZGVsKSB7XHJcbiAgICAgIG1vZGVsID0gbW9kZWxEYXRhXHJcbiAgICAgIG1vZGVsLm9uKFxyXG4gICAgICAgICdzZXQnLFxyXG4gICAgICAgIChldmVudCwgX21vZGVsKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmVtaXQoXHJcbiAgICAgICAgICAgICdjaGFuZ2UnLFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgbmFtZTogJ2NoYW5nZScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG4gICAgICApXHJcbiAgICAgIHRoaXMuX21vZGVscy5wdXNoKG1vZGVsKVxyXG4gICAgfVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAnYWRkJyxcclxuICAgICAge1xyXG4gICAgICAgIG5hbWU6ICdhZGQnLFxyXG4gICAgICB9LFxyXG4gICAgICBtb2RlbCxcclxuICAgICAgdGhpc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgYWRkKG1vZGVsRGF0YSkge1xyXG4gICAgdGhpcy5faXNTZXR0aW5nID0gdHJ1ZVxyXG4gICAgaWYoQXJyYXkuaXNBcnJheShtb2RlbERhdGEpKSB7XHJcbiAgICAgIG1vZGVsRGF0YVxyXG4gICAgICAgIC5mb3JFYWNoKChfbW9kZWxEYXRhKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmFkZE1vZGVsKF9tb2RlbERhdGEpXHJcbiAgICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYWRkTW9kZWwobW9kZWxEYXRhKVxyXG4gICAgfVxyXG4gICAgaWYodGhpcy5fbG9jYWxTdG9yYWdlKSB0aGlzLl9kYiA9IHRoaXMuX2RhdGFcclxuICAgIHRoaXMuX2lzU2V0dGluZyA9IGZhbHNlXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdjaGFuZ2UnLCB7XHJcbiAgICAgICAgbmFtZTogJ2NoYW5nZScsXHJcbiAgICAgICAgZGF0YTogdGhpcy5fZGF0YSxcclxuICAgICAgfSxcclxuICAgICAgdGhpc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcmVtb3ZlKG1vZGVsRGF0YSkge1xyXG4gICAgdGhpcy5faXNTZXR0aW5nID0gdHJ1ZVxyXG4gICAgaWYoXHJcbiAgICAgICFBcnJheS5pc0FycmF5KG1vZGVsRGF0YSlcclxuICAgICkge1xyXG4gICAgICB2YXIgbW9kZWxJbmRleCA9IHRoaXMuZ2V0TW9kZWxJbmRleChtb2RlbERhdGEuX3V1aWQpXHJcbiAgICAgIHRoaXMucmVtb3ZlTW9kZWxCeUluZGV4KG1vZGVsSW5kZXgpXHJcbiAgICB9IGVsc2UgaWYoQXJyYXkuaXNBcnJheShtb2RlbERhdGEpKSB7XHJcbiAgICAgIG1vZGVsRGF0YVxyXG4gICAgICAgIC5mb3JFYWNoKChtb2RlbCkgPT4ge1xyXG4gICAgICAgICAgdmFyIG1vZGVsSW5kZXggPSB0aGlzLmdldE1vZGVsSW5kZXgobW9kZWwuX3V1aWQpXHJcbiAgICAgICAgICB0aGlzLnJlbW92ZU1vZGVsQnlJbmRleChtb2RlbEluZGV4KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICB0aGlzLl9tb2RlbHMgPSB0aGlzLl9tb2RlbHNcclxuICAgICAgLmZpbHRlcigobW9kZWwpID0+IG1vZGVsICE9PSBudWxsKVxyXG4gICAgaWYodGhpcy5fbG9jYWxTdG9yYWdlKSB0aGlzLl9kYiA9IHRoaXMuX2RhdGFcclxuXHJcbiAgICB0aGlzLl9pc1NldHRpbmcgPSBmYWxzZVxyXG5cclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ2NoYW5nZScsIHtcclxuICAgICAgICBuYW1lOiAnY2hhbmdlJyxcclxuICAgICAgICBkYXRhOiB0aGlzLl9kYXRhLFxyXG4gICAgICB9LFxyXG4gICAgICB0aGlzXHJcbiAgICApXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICByZXNldCgpIHtcclxuICAgIHRoaXMucmVtb3ZlKHRoaXMuX21vZGVscylcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHBhcnNlKGRhdGEpIHtcclxuICAgIGRhdGEgPSBkYXRhIHx8IHRoaXMuX2RhdGEgfHwgdGhpcy5zdG9yYWdlQ29udGFpbmVyXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSlcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvbGxlY3Rpb25cclxuIiwiaW1wb3J0IEJhc2UgZnJvbSAnLi4vQmFzZS9pbmRleC5qcydcblxuY2xhc3MgVmlldyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICd1aUVsZW1lbnQnXG4gIF0gfVxuICBnZXQgY2xhc3NEZWZhdWx0UHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAnZWxlbWVudE5hbWUnLFxuICAgICdlbGVtZW50JyxcbiAgICAnYXR0cmlidXRlcycsXG4gICAgJ3RlbXBsYXRlcycsXG4gICAgJ2luc2VydCdcbiAgXSB9XG4gIGdldCBfZWxlbWVudE5hbWUoKSB7IHJldHVybiB0aGlzLl9lbGVtZW50LnRhZ05hbWUgfVxuICBzZXQgX2VsZW1lbnROYW1lKGVsZW1lbnROYW1lKSB7XG4gICAgaWYoIXRoaXMuX2VsZW1lbnQpIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnROYW1lKVxuICB9XG4gIGdldCBfZWxlbWVudCgpIHsgcmV0dXJuIHRoaXMuZWxlbWVudCB9XG4gIHNldCBfZWxlbWVudChlbGVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxuICAgIHRoaXMuZWxlbWVudE9ic2VydmVyLm9ic2VydmUodGhpcy5lbGVtZW50LCB7XG4gICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIH0pXG4gIH1cbiAgZ2V0IF9hdHRyaWJ1dGVzKCkge1xuICAgIHRoaXMuYXR0cmlidXRlcyA9IHRoaXMuZWxlbWVudC5hdHRyaWJ1dGVzXG4gICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1xuICB9XG4gIHNldCBfYXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgZm9yKGxldCBbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGVWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlS2V5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IGVsZW1lbnRPYnNlcnZlcigpIHtcbiAgICB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgPSB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgfHwgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoXG4gICAgICB0aGlzLmVsZW1lbnRPYnNlcnZlLmJpbmQodGhpcylcbiAgICApXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRPYnNlcnZlclxuICB9XG4gIGdldCBfaW5zZXJ0KCkge1xuICAgIHRoaXMuaW5zZXJ0ID0gdGhpcy5pbnNlcnQgfHwgbnVsbFxuICAgIHJldHVybiB0aGlzLmluc2VydFxuICB9XG4gIHNldCBfaW5zZXJ0KGluc2VydCkgeyB0aGlzLmluc2VydCA9IGluc2VydCB9XG4gIGdldCBfdGVtcGxhdGVzKCkge1xuICAgIHRoaXMudGVtcGxhdGVzID0gdGhpcy50ZW1wbGF0ZXMgfHwge31cbiAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZXNcbiAgfVxuICBzZXQgX3RlbXBsYXRlcyh0ZW1wbGF0ZXMpIHsgdGhpcy50ZW1wbGF0ZXMgPSB0ZW1wbGF0ZXMgfVxuICBlbGVtZW50T2JzZXJ2ZShtdXRhdGlvblJlY29yZExpc3QsIG9ic2VydmVyKSB7XG4gICAgZm9yKGxldCBbbXV0YXRpb25SZWNvcmRJbmRleCwgbXV0YXRpb25SZWNvcmRdIG9mIE9iamVjdC5lbnRyaWVzKG11dGF0aW9uUmVjb3JkTGlzdCkpIHtcbiAgICAgIHN3aXRjaChtdXRhdGlvblJlY29yZC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2NoaWxkTGlzdCc6XG4gICAgICAgICAgbGV0IG11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcyA9IFsnYWRkZWROb2RlcycsICdyZW1vdmVkTm9kZXMnXVxuICAgICAgICAgIHRoaXMucmVzZXRUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKCd1aUVsZW1lbnQnKVxuICAgICAgICAgIGlmKG11dGF0aW9uUmVjb3JkLmFkZGVkTm9kZXMubGVuZ3RoICYmIHRoaXMuYWRkZWROb2Rlcykge1xuICAgICAgICAgICAgdGhpcy5hZGRlZE5vZGVzKClcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYobXV0YXRpb25SZWNvcmQucmVtb3ZlZE5vZGVzLmxlbmd0aCAmJiB0aGlzLnJlbW92ZWROb2Rlcykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVkTm9kZXMoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBhdXRvSW5zZXJ0KCkge1xuICAgIGxldCBpbnNlcnQgPSB0aGlzLmluc2VydFxuICAgIGluc2VydC5wYXJlbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFxuICAgICAgaW5zZXJ0Lm1ldGhvZCxcbiAgICAgIHRoaXMuX2VsZW1lbnRcbiAgICApXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdXRvUmVtb3ZlKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5lbGVtZW50ICYmXG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudFxuICAgICkgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFZpZXdcbiIsImltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNvbnN0IENvbnRyb2xsZXIgPSBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICdtb2RlbCcsXG4gICAgJ2NvbGxlY3Rpb24nLFxuICAgICd2aWV3JyxcbiAgICAnY29udHJvbGxlcicsXG4gICAgJ3JvdXRlcidcbiAgXSB9XG4gIGdldCBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW10gfVxufVxuZXhwb3J0IGRlZmF1bHQgQ29udHJvbGxlclxuIiwiaW1wb3J0IEJhc2UgZnJvbSAnLi4vQmFzZS9pbmRleCdcblxuY29uc3QgUm91dGVyID0gY2xhc3MgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICAgIHRoaXMuYWRkV2luZG93RXZlbnRzKClcbiAgfVxuICBnZXQgY2xhc3NEZWZhdWx0UHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAncm9vdCcsXG4gICAgJ2hhc2hSb3V0aW5nJyxcbiAgICAnY29udHJvbGxlcicsXG4gICAgJ3JvdXRlcydcbiAgXSB9XG4gIGdldCBwcm90b2NvbCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCB9XG4gIGdldCBob3N0bmFtZSgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSB9XG4gIGdldCBwb3J0KCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBvcnQgfVxuICBnZXQgcGF0aG5hbWUoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgfVxuICBnZXQgcGF0aCgpIHtcbiAgICBsZXQgc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lXG4gICAgICAucmVwbGFjZShuZXcgUmVnRXhwKFsnXicsIHRoaXMucm9vdF0uam9pbignJykpLCAnJylcbiAgICAgIC5zcGxpdCgnPycpXG4gICAgICAuc2xpY2UoMCwgMSlcbiAgICAgIFswXVxuICAgIGxldCBmcmFnbWVudHMgPSAoXG4gICAgICBzdHJpbmcubGVuZ3RoID09PSAwXG4gICAgKSA/IFtdXG4gICAgICA6IChcbiAgICAgICAgICBzdHJpbmcubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9eXFwvLykgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL1xcLz8vKVxuICAgICAgICApID8gWycvJ11cbiAgICAgICAgICA6IHN0cmluZ1xuICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAuc3BsaXQoJy8nKVxuICAgIHJldHVybiB7XG4gICAgICBmcmFnbWVudHM6IGZyYWdtZW50cyxcbiAgICAgIHN0cmluZzogc3RyaW5nLFxuICAgIH1cbiAgfVxuICBnZXQgaGFzaCgpIHtcbiAgICBsZXQgc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLmhhc2hcbiAgICAgIC5zbGljZSgxKVxuICAgICAgLnNwbGl0KCc/JylcbiAgICAgIC5zbGljZSgwLCAxKVxuICAgICAgWzBdXG4gICAgbGV0IGZyYWdtZW50cyA9IChcbiAgICAgIHN0cmluZy5sZW5ndGggPT09IDBcbiAgICApID8gW11cbiAgICAgIDogKFxuICAgICAgICAgIHN0cmluZy5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL15cXC8vKSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXFwvPy8pXG4gICAgICAgICkgPyBbJy8nXVxuICAgICAgICAgIDogc3RyaW5nXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC8kLywgJycpXG4gICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgcmV0dXJuIHtcbiAgICAgIGZyYWdtZW50czogZnJhZ21lbnRzLFxuICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgfVxuICB9XG4gIGdldCBwYXJhbWV0ZXJzKCkge1xuICAgIGxldCBzdHJpbmdcbiAgICBsZXQgZGF0YVxuICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKC9cXD8vKSkge1xuICAgICAgbGV0IHBhcmFtZXRlcnMgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgICAgICAuc3BsaXQoJz8nKVxuICAgICAgICAuc2xpY2UoLTEpXG4gICAgICAgIC5qb2luKCcnKVxuICAgICAgc3RyaW5nID0gcGFyYW1ldGVyc1xuICAgICAgZGF0YSA9IHBhcmFtZXRlcnNcbiAgICAgICAgLnNwbGl0KCcmJylcbiAgICAgICAgLnJlZHVjZSgoXG4gICAgICAgICAgX3BhcmFtZXRlcnMsXG4gICAgICAgICAgcGFyYW1ldGVyXG4gICAgICAgICkgPT4ge1xuICAgICAgICAgIGxldCBwYXJhbWV0ZXJEYXRhID0gcGFyYW1ldGVyLnNwbGl0KCc9JylcbiAgICAgICAgICBfcGFyYW1ldGVyc1twYXJhbWV0ZXJEYXRhWzBdXSA9IHBhcmFtZXRlckRhdGFbMV1cbiAgICAgICAgICByZXR1cm4gX3BhcmFtZXRlcnNcbiAgICAgICAgfSwge30pXG4gICAgfSBlbHNlIHtcbiAgICAgIHN0cmluZyA9ICcnXG4gICAgICBkYXRhID0ge31cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0cmluZzogc3RyaW5nLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH1cbiAgfVxuICBnZXQgX3Jvb3QoKSB7IHJldHVybiB0aGlzLnJvb3QgfHwgJy8nIH1cbiAgc2V0IF9yb290KHJvb3QpIHsgdGhpcy5yb290ID0gcm9vdCB9XG4gIGdldCBfaGFzaFJvdXRpbmcoKSB7IHJldHVybiB0aGlzLmhhc2hSb3V0aW5nIHx8IGZhbHNlIH1cbiAgc2V0IF9oYXNoUm91dGluZyhoYXNoUm91dGluZykgeyB0aGlzLmhhc2hSb3V0aW5nID0gaGFzaFJvdXRpbmcgfVxuICBnZXQgX3JvdXRlcygpIHsgcmV0dXJuIHRoaXMucm91dGVzIH1cbiAgc2V0IF9yb3V0ZXMocm91dGVzKSB7IHRoaXMucm91dGVzID0gcm91dGVzIH1cbiAgZ2V0IF9jb250cm9sbGVyKCkgeyByZXR1cm4gdGhpcy5jb250cm9sbGVyIH1cbiAgc2V0IF9jb250cm9sbGVyKGNvbnRyb2xsZXIpIHsgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlciB9XG4gIGdldCBsb2NhdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm9vdDogdGhpcy5yb290LFxuICAgICAgcGF0aDogdGhpcy5wYXRoLFxuICAgICAgaGFzaDogdGhpcy5oYXNoLFxuICAgICAgcGFyYW1ldGVyczogdGhpcy5wYXJhbWV0ZXJzLFxuICAgIH1cbiAgfVxuICBtYXRjaFJvdXRlKHJvdXRlRnJhZ21lbnRzLCBsb2NhdGlvbkZyYWdtZW50cykge1xuICAgIGxldCByb3V0ZU1hdGNoZXMgPSBuZXcgQXJyYXkoKVxuICAgIGlmKHJvdXRlRnJhZ21lbnRzLmxlbmd0aCA9PT0gbG9jYXRpb25GcmFnbWVudHMubGVuZ3RoKSB7XG4gICAgICByb3V0ZU1hdGNoZXMgPSByb3V0ZUZyYWdtZW50c1xuICAgICAgICAucmVkdWNlKChfcm91dGVNYXRjaGVzLCByb3V0ZUZyYWdtZW50LCByb3V0ZUZyYWdtZW50SW5kZXgpID0+IHtcbiAgICAgICAgICBsZXQgbG9jYXRpb25GcmFnbWVudCA9IGxvY2F0aW9uRnJhZ21lbnRzW3JvdXRlRnJhZ21lbnRJbmRleF1cbiAgICAgICAgICBpZihyb3V0ZUZyYWdtZW50Lm1hdGNoKC9eXFw6LykpIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaCh0cnVlKVxuICAgICAgICAgIH0gZWxzZSBpZihyb3V0ZUZyYWdtZW50ID09PSBsb2NhdGlvbkZyYWdtZW50KSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2godHJ1ZSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3JvdXRlTWF0Y2hlcy5wdXNoKGZhbHNlKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3JvdXRlTWF0Y2hlc1xuICAgICAgICB9LCBbXSlcbiAgICB9IGVsc2Uge1xuICAgICAgcm91dGVNYXRjaGVzLnB1c2goZmFsc2UpXG4gICAgfVxuICAgIHJldHVybiAocm91dGVNYXRjaGVzLmluZGV4T2YoZmFsc2UpID09PSAtMSlcbiAgICAgID8gdHJ1ZVxuICAgICAgOiBmYWxzZVxuICB9XG4gIGdldFJvdXRlKGxvY2F0aW9uKSB7XG4gICAgbGV0IHJvdXRlcyA9IE9iamVjdC5lbnRyaWVzKHRoaXMucm91dGVzKVxuICAgICAgLnJlZHVjZSgoXG4gICAgICAgIF9yb3V0ZXMsXG4gICAgICAgIFtyb3V0ZU5hbWUsIHJvdXRlU2V0dGluZ3NdKSA9PiB7XG4gICAgICAgICAgbGV0IHJvdXRlRnJhZ21lbnRzID0gKFxuICAgICAgICAgICAgcm91dGVOYW1lLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgICAgcm91dGVOYW1lLm1hdGNoKC9eXFwvLylcbiAgICAgICAgICApID8gW3JvdXRlTmFtZV1cbiAgICAgICAgICAgIDogKHJvdXRlTmFtZS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgID8gWycnXVxuICAgICAgICAgICAgICA6IHJvdXRlTmFtZVxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC8kLywgJycpXG4gICAgICAgICAgICAgICAgICAuc3BsaXQoJy8nKVxuICAgICAgICAgIHJvdXRlU2V0dGluZ3MuZnJhZ21lbnRzID0gcm91dGVGcmFnbWVudHNcbiAgICAgICAgICBfcm91dGVzW3JvdXRlRnJhZ21lbnRzLmpvaW4oJy8nKV0gPSByb3V0ZVNldHRpbmdzXG4gICAgICAgICAgcmV0dXJuIF9yb3V0ZXNcbiAgICAgICAgfSxcbiAgICAgICAge31cbiAgICAgIClcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhyb3V0ZXMpXG4gICAgICAuZmluZCgocm91dGUpID0+IHtcbiAgICAgICAgbGV0IHJvdXRlRnJhZ21lbnRzID0gcm91dGUuZnJhZ21lbnRzXG4gICAgICAgIGxldCBsb2NhdGlvbkZyYWdtZW50cyA9ICh0aGlzLmhhc2hSb3V0aW5nKVxuICAgICAgICAgID8gbG9jYXRpb24uaGFzaC5mcmFnbWVudHNcbiAgICAgICAgICA6IGxvY2F0aW9uLnBhdGguZnJhZ21lbnRzXG4gICAgICAgIGxldCBtYXRjaFJvdXRlID0gdGhpcy5tYXRjaFJvdXRlKFxuICAgICAgICAgIHJvdXRlRnJhZ21lbnRzLFxuICAgICAgICAgIGxvY2F0aW9uRnJhZ21lbnRzLFxuICAgICAgICApXG4gICAgICAgIHJldHVybiBtYXRjaFJvdXRlID09PSB0cnVlXG4gICAgICB9KVxuICB9XG4gIHBvcFN0YXRlKGV2ZW50KSB7XG4gICAgbGV0IGxvY2F0aW9uID0gdGhpcy5sb2NhdGlvblxuICAgIGxldCByb3V0ZSA9IHRoaXMuZ2V0Um91dGUobG9jYXRpb24pXG4gICAgbGV0IHJvdXRlRGF0YSA9IHtcbiAgICAgIHJvdXRlOiByb3V0ZSxcbiAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbixcbiAgICB9XG4gICAgaWYocm91dGUpIHtcbiAgICAgIHRoaXMuY29udHJvbGxlcltyb3V0ZS5jYWxsYmFja10ocm91dGVEYXRhKVxuICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnLCB7XG4gICAgICAgIG5hbWU6ICdjaGFuZ2UnLFxuICAgICAgICBkYXRhOiByb3V0ZURhdGEsXG4gICAgICB9LFxuICAgICAgdGhpcylcbiAgICB9XG4gIH1cbiAgYWRkV2luZG93RXZlbnRzKCkge1xuICAgIHdpbmRvdy5vbigncG9wc3RhdGUnLCB0aGlzLnBvcFN0YXRlLmJpbmQodGhpcykpXG4gIH1cbiAgcmVtb3ZlV2luZG93RXZlbnRzKCkge1xuICAgIHdpbmRvdy5vZmYoJ3BvcHN0YXRlJywgdGhpcy5wb3BTdGF0ZS5iaW5kKHRoaXMpKVxuICB9XG4gIG5hdmlnYXRlKHBhdGgpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGhcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgUm91dGVyXG4iLCJpbXBvcnQgJy4vU2hpbXMvZXZlbnRzJ1xuaW1wb3J0IEV2ZW50cyBmcm9tICcuL0V2ZW50cy9pbmRleCdcbmltcG9ydCBDaGFubmVscyBmcm9tICcuL0NoYW5uZWxzL2luZGV4J1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi9VdGlscy9pbmRleCdcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4vU2VydmljZS9pbmRleCdcbmltcG9ydCBNb2RlbCBmcm9tICcuL01vZGVsL2luZGV4J1xuaW1wb3J0IENvbGxlY3Rpb24gZnJvbSAnLi9Db2xsZWN0aW9uL2luZGV4J1xuaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3L2luZGV4J1xuaW1wb3J0IENvbnRyb2xsZXIgZnJvbSAnLi9Db250cm9sbGVyL2luZGV4J1xuaW1wb3J0IFJvdXRlciBmcm9tICcuL1JvdXRlci9pbmRleCdcbmNvbnN0IE1WQyA9IHtcbiAgRXZlbnRzLFxuICBDaGFubmVscyxcbiAgVXRpbHMsXG4gIFNlcnZpY2UsXG4gIE1vZGVsLFxuICBDb2xsZWN0aW9uLFxuICBWaWV3LFxuICBDb250cm9sbGVyLFxuICBSb3V0ZXIsXG59XG5leHBvcnQgZGVmYXVsdCBNVkNcbiJdLCJuYW1lcyI6WyJFdmVudFRhcmdldCIsInByb3RvdHlwZSIsIm9uIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9mZiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJFdmVudHMiLCJjb25zdHJ1Y3RvciIsIl9ldmVudHMiLCJldmVudHMiLCJnZXRFdmVudENhbGxiYWNrcyIsImV2ZW50TmFtZSIsImdldEV2ZW50Q2FsbGJhY2tOYW1lIiwiZXZlbnRDYWxsYmFjayIsIm5hbWUiLCJsZW5ndGgiLCJnZXRFdmVudENhbGxiYWNrR3JvdXAiLCJldmVudENhbGxiYWNrcyIsImV2ZW50Q2FsbGJhY2tOYW1lIiwiZXZlbnRDYWxsYmFja0dyb3VwIiwicHVzaCIsImFyZ3VtZW50cyIsIk9iamVjdCIsImtleXMiLCJlbWl0IiwiZXZlbnREYXRhIiwiX2FyZ3VtZW50cyIsInZhbHVlcyIsImVudHJpZXMiLCJldmVudENhbGxiYWNrR3JvdXBOYW1lIiwiYWRkaXRpb25hbEFyZ3VtZW50cyIsInNwbGljZSIsIl9yZXNwb25zZXMiLCJyZXNwb25zZXMiLCJyZXNwb25zZSIsInJlc3BvbnNlTmFtZSIsInJlc3BvbnNlQ2FsbGJhY2siLCJyZXF1ZXN0IiwiQXJyYXkiLCJzbGljZSIsImNhbGwiLCJfcmVzcG9uc2VOYW1lIiwiX2NoYW5uZWxzIiwiY2hhbm5lbHMiLCJjaGFubmVsIiwiY2hhbm5lbE5hbWUiLCJDaGFubmVsIiwiVVVJRCIsInV1aWQiLCJpIiwicmFuZG9tIiwiTWF0aCIsInRvU3RyaW5nIiwiQmFzZSIsInNldHRpbmdzIiwiY29uZmlndXJhdGlvbiIsIl9jb25maWd1cmF0aW9uIiwiX3NldHRpbmdzIiwiYWRkQmluZGFibGVDbGFzc1Byb3BlcnRpZXMiLCJhZGRDbGFzc0RlZmF1bHRQcm9wZXJ0aWVzIiwiX3V1aWQiLCJNVkMiLCJVdGlscyIsIl9uYW1lIiwiY2xhc3NEZWZhdWx0UHJvcGVydGllcyIsImNvbmNhdCIsImdldEJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzTmFtZXMiLCJmb3JFYWNoIiwic2V0dGluZ0tleSIsInNldHRpbmdWYWx1ZSIsImluZGV4T2YiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsInNldCIsInZhbHVlIiwiX3VpRWxlbWVudFNldHRpbmdzIiwidWlFbGVtZW50U2V0dGluZ3MiLCJiaW5kYWJsZUNsYXNzUHJvcGVydGllcyIsInJlZHVjZSIsIl9iaW5kYWJsZUNsYXNzUHJvcGVydGllc05hbWVzIiwiYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSIsImdldEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVzIiwiY2FwaXRhbGl6ZVByb3BlcnR5TmFtZSIsInJlcGxhY2UiLCJmaXJzdENoYXJhY3RlciIsInN1YnN0cmluZyIsInRvVXBwZXJDYXNlIiwiY2xhc3NEZWZhdWx0UHJvcGVydHkiLCJjbGFzc0RlZmF1bHRQcm9wZXJ0eUluZGV4IiwiY3VycmVudFByb3BlcnR5VmFsdWUiLCJ3cml0YWJsZSIsImJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU1ldGhvZHMiLCJiaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2QiLCJiaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2RJbmRleCIsImFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eSIsInRvZ2dsZVRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMiLCJjb250ZXh0IiwiYWRkQmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSIsInJlbW92ZUJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUiLCJjdXJyZW50UHJvcGVydHlWYWx1ZXMiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiX3ZhbHVlcyIsImluZGV4Iiwia2V5IiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJjb25maWd1cmFibGUiLCJyZXNldFRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMiLCJjbGFzc1R5cGUiLCJtZXRob2QiLCJjbGFzc1R5cGVFdmVudERhdGEiLCJjbGFzc1R5cGVDYWxsYmFja05hbWUiLCJzcGxpdCIsImNsYXNzVHlwZVRhcmdldE5hbWUiLCJjbGFzc1R5cGVFdmVudE5hbWUiLCJjbGFzc1R5cGVUYXJnZXQiLCJjbGFzc1R5cGVFdmVudENhbGxiYWNrIiwiYmluZCIsInRvZ2dsZVRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudCIsIk5vZGVMaXN0IiwiZnJvbSIsIl9jbGFzc1R5cGVUYXJnZXQiLCJIVE1MRWxlbWVudCIsIlNlcnZpY2UiLCJfZGVmYXVsdHMiLCJkZWZhdWx0cyIsImNvbnRlbnRUeXBlIiwicmVzcG9uc2VUeXBlIiwiX2FzeW5jIiwiYXN5bmMiLCJfcmVzcG9uc2VUeXBlcyIsIl9yZXNwb25zZVR5cGUiLCJfeGhyIiwiZmluZCIsInJlc3BvbnNlVHlwZUl0ZW0iLCJfdHlwZSIsInR5cGUiLCJfcGFyYW1ldGVycyIsInBhcmFtZXRlcnMiLCJfdXJsIiwidXJsIiwiX2hlYWRlcnMiLCJoZWFkZXJzIiwiX2RhdGEiLCJkYXRhIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJzdHJpbmdQYXJhbWV0ZXJzIiwicGFyYW1ldGVyU3RyaW5nIiwicGFyYW1ldGVySW5kZXgiLCJwYXJhbWV0ZXJLZXkiLCJwYXJhbWV0ZXJWYWx1ZSIsImNvbmNhdGVuYXRvciIsImFzc2lnbm1lbnRPcGVyYXRvciIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25sb2FkIiwib25lcnJvciIsIm9wZW4iLCJoZWFkZXIiLCJzZXRSZXF1ZXN0SGVhZGVyIiwic2VuZCIsInRoZW4iLCJjdXJyZW50VGFyZ2V0IiwiY2F0Y2giLCJlcnJvciIsIk1vZGVsIiwic3RvcmFnZUNvbnRhaW5lciIsImRlZmF1bHRJREF0dHJpYnV0ZSIsIl9pZEF0dHJpYnV0ZSIsImlkQXR0cmlidXRlIiwiX2lzU2V0dGluZyIsImlzU2V0dGluZyIsIl9zaWxlbnQiLCJzaWxlbnQiLCJfY2hhbmdpbmciLCJjaGFuZ2luZyIsIl9sb2NhbFN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJfaGlzdGlvZ3JhbSIsImhpc3Rpb2dyYW0iLCJhc3NpZ24iLCJfaGlzdG9yeSIsImhpc3RvcnkiLCJ1bnNoaWZ0IiwicGFyc2UiLCJkYiIsIl9kYiIsImdldEl0ZW0iLCJlbmRwb2ludCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzZXRJdGVtIiwic2V0RGF0YVByb3BlcnR5IiwidW5zZXQiLCJ1bnNldERhdGFQcm9wZXJ0eSIsInNldERCIiwidW5zZXREQiIsInNldFZhbHVlRXZlbnROYW1lIiwiam9pbiIsInNldEV2ZW50TmFtZSIsInVuc2V0VmFsdWVFdmVudE5hbWUiLCJ1bnNldEV2ZW50TmFtZSIsInVuc2V0VmFsdWUiLCJDb2xsZWN0aW9uIiwiX21vZGVscyIsIm1vZGVscyIsIm1vZGVsc0RhdGEiLCJfbW9kZWwiLCJtb2RlbCIsIm1hcCIsImdldE1vZGVsSW5kZXgiLCJtb2RlbFVVSUQiLCJtb2RlbEluZGV4IiwiX21vZGVsSW5kZXgiLCJyZW1vdmVNb2RlbEJ5SW5kZXgiLCJhZGRNb2RlbCIsIm1vZGVsRGF0YSIsImV2ZW50IiwiYWRkIiwiaXNBcnJheSIsIl9tb2RlbERhdGEiLCJyZW1vdmUiLCJmaWx0ZXIiLCJyZXNldCIsIlZpZXciLCJfZWxlbWVudE5hbWUiLCJfZWxlbWVudCIsInRhZ05hbWUiLCJlbGVtZW50TmFtZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImVsZW1lbnRPYnNlcnZlciIsIm9ic2VydmUiLCJzdWJ0cmVlIiwiY2hpbGRMaXN0IiwiX2F0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJfZWxlbWVudE9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsImVsZW1lbnRPYnNlcnZlIiwiX2luc2VydCIsImluc2VydCIsIl90ZW1wbGF0ZXMiLCJ0ZW1wbGF0ZXMiLCJtdXRhdGlvblJlY29yZExpc3QiLCJvYnNlcnZlciIsIm11dGF0aW9uUmVjb3JkSW5kZXgiLCJtdXRhdGlvblJlY29yZCIsImFkZGVkTm9kZXMiLCJyZW1vdmVkTm9kZXMiLCJhdXRvSW5zZXJ0IiwicGFyZW50IiwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50IiwiYXV0b1JlbW92ZSIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsIkNvbnRyb2xsZXIiLCJSb3V0ZXIiLCJhZGRXaW5kb3dFdmVudHMiLCJwcm90b2NvbCIsIndpbmRvdyIsImxvY2F0aW9uIiwiaG9zdG5hbWUiLCJwb3J0IiwicGF0aG5hbWUiLCJwYXRoIiwic3RyaW5nIiwiUmVnRXhwIiwicm9vdCIsImZyYWdtZW50cyIsIm1hdGNoIiwiaGFzaCIsImhyZWYiLCJwYXJhbWV0ZXIiLCJwYXJhbWV0ZXJEYXRhIiwiX3Jvb3QiLCJfaGFzaFJvdXRpbmciLCJoYXNoUm91dGluZyIsIl9yb3V0ZXMiLCJyb3V0ZXMiLCJfY29udHJvbGxlciIsImNvbnRyb2xsZXIiLCJtYXRjaFJvdXRlIiwicm91dGVGcmFnbWVudHMiLCJsb2NhdGlvbkZyYWdtZW50cyIsInJvdXRlTWF0Y2hlcyIsIl9yb3V0ZU1hdGNoZXMiLCJyb3V0ZUZyYWdtZW50Iiwicm91dGVGcmFnbWVudEluZGV4IiwibG9jYXRpb25GcmFnbWVudCIsImdldFJvdXRlIiwicm91dGVOYW1lIiwicm91dGVTZXR0aW5ncyIsInJvdXRlIiwicG9wU3RhdGUiLCJyb3V0ZURhdGEiLCJjYWxsYmFjayIsInJlbW92ZVdpbmRvd0V2ZW50cyIsIm5hdmlnYXRlIiwiQ2hhbm5lbHMiXSwibWFwcGluZ3MiOiI7Ozs7OztFQUFBQSxXQUFXLENBQUNDLFNBQVosQ0FBc0JDLEVBQXRCLEdBQTJCRixXQUFXLENBQUNDLFNBQVosQ0FBc0JDLEVBQXRCLElBQTRC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
