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
            get() {
              return this[settingKey];
            },

            set(value) {
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
          get() {
            context[bindableClassPropertyName] = context[bindableClassPropertyName] || {};
            return context[bindableClassPropertyName];
          },

          set(values) {
            var _values = Object.entries(values);

            _values.forEach((_ref2, index) => {
              var [key, value] = _ref2;

              switch (bindableClassPropertyName) {
                case 'uiElements':
                  context._uiElementSettings[key] = value;
                  Object.defineProperty(context['_'.concat(bindableClassPropertyName)], [key], {
                    configurable: true,

                    get() {
                      if (context.element) {
                        return context.element.querySelectorAll(value);
                      }
                    }

                  });

                  if (index === _values.length - 1) {
                    Object.defineProperty(context['_'.concat(bindableClassPropertyName)], '$element', {
                      configurable: true,

                      get() {
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

          try {
            classTypeEventData = classTypeEventData.split(' ');
            var classTypeTargetName = classTypeEventData[0];
            var classTypeEventName = classTypeEventData[1];
            var classTypeTarget = this[classType.concat('s')][classTypeTargetName];
            var classTypeEventCallback = classType === 'uiElement' ? this[classType.concat('Callbacks')][classTypeCallbackName] : this[classType.concat('Callbacks')][classTypeCallbackName].bind(this);
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
            if (index === _arguments.length - 1) this._isSetting = false;
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
              if (index === _arguments.length - 1) this._isSetting = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL3V1aWQuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0Jhc2UvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1NlcnZpY2UvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL01vZGVsL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Db2xsZWN0aW9uL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9WaWV3L2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Db250cm9sbGVyL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Sb3V0ZXIvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIkV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiA9IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lclxyXG5FdmVudFRhcmdldC5wcm90b3R5cGUub2ZmID0gRXZlbnRUYXJnZXQucHJvdG90eXBlLm9mZiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lclxyXG4iLCJjbGFzcyBFdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2V2ZW50cygpIHtcclxuICAgIHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMgfHwge31cclxuICAgIHJldHVybiB0aGlzLmV2ZW50c1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpIHsgcmV0dXJuIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdIHx8IHt9IH1cclxuICBnZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gKGV2ZW50Q2FsbGJhY2submFtZS5sZW5ndGgpXHJcbiAgICAgID8gZXZlbnRDYWxsYmFjay5uYW1lXHJcbiAgICAgIDogJ2Fub255bW91c0Z1bmN0aW9uJ1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKSB7XHJcbiAgICByZXR1cm4gZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdIHx8IFtdXHJcbiAgfVxyXG4gIG9uKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaykge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5nZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja05hbWUgPSB0aGlzLmdldEV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja0dyb3VwID0gdGhpcy5nZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKVxyXG4gICAgZXZlbnRDYWxsYmFja0dyb3VwLnB1c2goZXZlbnRDYWxsYmFjaylcclxuICAgIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudENhbGxiYWNrc1xyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgb2ZmKCkge1xyXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgICAgY2FzZSAwOlxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrTmFtZSA9ICh0eXBlb2YgZXZlbnRDYWxsYmFjayA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICA/IGV2ZW50Q2FsbGJhY2tcclxuICAgICAgICAgIDogdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKSB7XHJcbiAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1bZXZlbnRDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0pLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgKSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGVtaXQoZXZlbnROYW1lLCBldmVudERhdGEpIHtcclxuICAgIGxldCBfYXJndW1lbnRzID0gT2JqZWN0LnZhbHVlcyhhcmd1bWVudHMpXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja3MgPSBPYmplY3QuZW50cmllcyhcclxuICAgICAgdGhpcy5nZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICApXHJcbiAgICBmb3IobGV0IFtldmVudENhbGxiYWNrR3JvdXBOYW1lLCBldmVudENhbGxiYWNrR3JvdXBdIG9mIGV2ZW50Q2FsbGJhY2tzKSB7XHJcbiAgICAgIGZvcihsZXQgZXZlbnRDYWxsYmFjayBvZiBldmVudENhbGxiYWNrR3JvdXApIHtcclxuICAgICAgICBsZXQgYWRkaXRpb25hbEFyZ3VtZW50cyA9IF9hcmd1bWVudHMuc3BsaWNlKDIpIHx8IFtdXHJcbiAgICAgICAgZXZlbnRDYWxsYmFjayhldmVudERhdGEsIC4uLmFkZGl0aW9uYWxBcmd1bWVudHMpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IEV2ZW50c1xyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfcmVzcG9uc2VzKCkge1xyXG4gICAgdGhpcy5yZXNwb25zZXMgPSB0aGlzLnJlc3BvbnNlc1xyXG4gICAgICA/IHRoaXMucmVzcG9uc2VzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLnJlc3BvbnNlc1xyXG4gIH1cclxuICByZXNwb25zZShyZXNwb25zZU5hbWUsIHJlc3BvbnNlQ2FsbGJhY2spIHtcclxuICAgIGlmIChyZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdID0gcmVzcG9uc2VDYWxsYmFja1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZV1cclxuICAgIH1cclxuICB9XHJcbiAgcmVxdWVzdChyZXNwb25zZU5hbWUpIHtcclxuICAgIGlmICh0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSkge1xyXG4gICAgICB2YXIgX2FyZ3VtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykuc2xpY2UoMSlcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKC4uLl9hcmd1bWVudHMpXHJcbiAgICB9XHJcbiAgfVxyXG4gIG9mZihyZXNwb25zZU5hbWUpIHtcclxuICAgIGlmIChyZXNwb25zZU5hbWUpIHtcclxuICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmb3IgKHZhciBbX3Jlc3BvbnNlTmFtZV0gb2YgT2JqZWN0LmtleXModGhpcy5fcmVzcG9uc2VzKSkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbX3Jlc3BvbnNlTmFtZV1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgQ2hhbm5lbCBmcm9tICcuL0NoYW5uZWwvaW5kZXgnXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9jaGFubmVscygpIHtcclxuICAgIHRoaXMuY2hhbm5lbHMgPSB0aGlzLmNoYW5uZWxzXHJcbiAgICAgID8gdGhpcy5jaGFubmVsc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5jaGFubmVsc1xyXG4gIH1cclxuICBjaGFubmVsKGNoYW5uZWxOYW1lKSB7XHJcbiAgICB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0gPSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICAgICAgPyB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICAgICAgOiBuZXcgQ2hhbm5lbCgpXHJcbiAgICByZXR1cm4gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG4gIG9mZihjaGFubmVsTmFtZSkge1xyXG4gICAgZGVsZXRlIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBVVUlEKCkge1xyXG4gIHZhciB1dWlkID0gXCJcIiwgaSwgcmFuZG9tXHJcbiAgZm9yIChpID0gMDsgaSA8IDMyOyBpKyspIHtcclxuICAgIHJhbmRvbSA9IE1hdGgucmFuZG9tKCkgKiAxNiB8IDBcclxuXHJcbiAgICBpZiAoaSA9PSA4IHx8IGkgPT0gMTIgfHwgaSA9PSAxNiB8fCBpID09IDIwKSB7XHJcbiAgICAgIHV1aWQgKz0gXCItXCJcclxuICAgIH1cclxuICAgIHV1aWQgKz0gKGkgPT0gMTIgPyA0IDogKGkgPT0gMTYgPyAocmFuZG9tICYgMyB8IDgpIDogcmFuZG9tKSkudG9TdHJpbmcoMTYpXHJcbiAgfVxyXG4gIHJldHVybiB1dWlkXHJcbn1cclxuIiwiaW1wb3J0ICcuLi9TaGltcy9ldmVudHMuanMnXHJcbmltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xyXG5cclxuY2xhc3MgQmFzZSBleHRlbmRzIEV2ZW50cyB7XHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MsIGNvbmZpZ3VyYXRpb24pIHtcclxuICAgIHN1cGVyKClcclxuICAgIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uIHx8IHt9XHJcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzIHx8IHt9XHJcbiAgICB0aGlzLmFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKClcclxuICAgIHRoaXMuYWRkQ2xhc3NEZWZhdWx0UHJvcGVydGllcygpXHJcbiAgfVxyXG4gIGdldCBfdXVpZCgpIHtcclxuICAgIHRoaXMudXVpZCA9IHRoaXMudXVpZCB8fCBNVkMuVXRpbHMuVVVJRCgpXHJcbiAgICByZXR1cm4gdGhpcy51dWlkXHJcbiAgfVxyXG4gIGdldCBfbmFtZSgpIHsgcmV0dXJuIHRoaXMubmFtZSB9XHJcbiAgc2V0IF9uYW1lKG5hbWUpIHsgdGhpcy5uYW1lID0gbmFtZSB9XHJcbiAgZ2V0IF9zZXR0aW5ncygpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5nc1xyXG4gIH1cclxuICBzZXQgX3NldHRpbmdzKHNldHRpbmdzKSB7XHJcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcclxuICAgIGxldCBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzID0gdGhpcy5jbGFzc0RlZmF1bHRQcm9wZXJ0aWVzIHx8IFtdXHJcbiAgICBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzID0gY2xhc3NEZWZhdWx0UHJvcGVydGllcy5jb25jYXQodGhpcy5nZXRCaW5kYWJsZUNsYXNzUHJvcGVydGllc05hbWVzKCkpXHJcbiAgICBPYmplY3QuZW50cmllcyh0aGlzLnNldHRpbmdzKVxyXG4gICAgICAuZm9yRWFjaCgoW3NldHRpbmdLZXksIHNldHRpbmdWYWx1ZV0pID0+IHtcclxuICAgICAgICBpZihjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzLmluZGV4T2Yoc2V0dGluZ0tleSkgPT09IC0xKSB7XHJcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIFsnXycuY29uY2F0KHNldHRpbmdLZXkpXSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNbc2V0dGluZ0tleV0gfSxcclxuICAgICAgICAgICAgICBzZXQodmFsdWUpIHsgdGhpc1tzZXR0aW5nS2V5XSA9IHZhbHVlIH0sXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIClcclxuICAgICAgICAgIHRoaXNbJ18nLmNvbmNhdChzZXR0aW5nS2V5KV0gPSBzZXR0aW5nVmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgfVxyXG4gIGdldCBfY29uZmlndXJhdGlvbigpIHtcclxuICAgIHRoaXMuY29uZmlndXJhdGlvbiA9IHRoaXMuY29uZmlndXJhdGlvbiB8fCB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblxyXG4gIH1cclxuICBzZXQgX2NvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikge1xyXG4gICAgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvblxyXG4gIH1cclxuICBnZXQgX3VpRWxlbWVudFNldHRpbmdzKCkge1xyXG4gICAgdGhpcy51aUVsZW1lbnRTZXR0aW5ncyA9IHRoaXMudWlFbGVtZW50U2V0dGluZ3MgfHwge31cclxuICAgIHJldHVybiB0aGlzLnVpRWxlbWVudFNldHRpbmdzXHJcbiAgfVxyXG4gIHNldCBfdWlFbGVtZW50U2V0dGluZ3ModWlFbGVtZW50U2V0dGluZ3MpIHtcclxuICAgIHRoaXMudWlFbGVtZW50U2V0dGluZ3MgPSB1aUVsZW1lbnRTZXR0aW5nc1xyXG4gIH1cclxuICBnZXRCaW5kYWJsZUNsYXNzUHJvcGVydGllc05hbWVzKCkge1xyXG4gICAgcmV0dXJuICh0aGlzLmJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKVxyXG4gICAgICA/IHRoaXMuYmluZGFibGVDbGFzc1Byb3BlcnRpZXNcclxuICAgICAgICAucmVkdWNlKChfYmluZGFibGVDbGFzc1Byb3BlcnRpZXNOYW1lcywgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkgPT4ge1xyXG4gICAgICAgICAgX2JpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzTmFtZXMgPSBfYmluZGFibGVDbGFzc1Byb3BlcnRpZXNOYW1lcy5jb25jYXQoXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0QmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZXMoXHJcbiAgICAgICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICByZXR1cm4gX2JpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzTmFtZXNcclxuICAgICAgICB9LCBbXSlcclxuICAgICAgOiBbXVxyXG4gIH1cclxuICBnZXRCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lcyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSB7XHJcbiAgICBzd2l0Y2goYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgICBjYXNlICdkYXRhJzpcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJycpLFxyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ0V2ZW50cycpLFxyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ0NhbGxiYWNrcycpXHJcbiAgICAgICAgXVxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICBiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLmNvbmNhdCgncycpLFxyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ0V2ZW50cycpLFxyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ0NhbGxiYWNrcycpXHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG4gIH1cclxuICBjYXBpdGFsaXplUHJvcGVydHlOYW1lKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpIHtcclxuICAgIGlmKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUuc2xpY2UoMCwgMikgPT09ICd1aScpIHtcclxuICAgICAgcmV0dXJuIGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUucmVwbGFjZSgvXnVpLywgJ1VJJylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCBmaXJzdENoYXJhY3RlciA9IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKClcclxuICAgICAgcmV0dXJuIGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUucmVwbGFjZSgvXi4vLCBmaXJzdENoYXJhY3RlcilcclxuICAgIH1cclxuICB9XHJcbiAgYWRkQ2xhc3NEZWZhdWx0UHJvcGVydGllcygpIHtcclxuICAgIHRoaXMuY2xhc3NEZWZhdWx0UHJvcGVydGllc1xyXG4gICAgICAuZm9yRWFjaCgoY2xhc3NEZWZhdWx0UHJvcGVydHksIGNsYXNzRGVmYXVsdFByb3BlcnR5SW5kZXgpID0+IHtcclxuICAgICAgICBsZXQgY3VycmVudFByb3BlcnR5VmFsdWUgPSB0aGlzLnNldHRpbmdzW2NsYXNzRGVmYXVsdFByb3BlcnR5XSB8fFxyXG4gICAgICAgIHRoaXNbY2xhc3NEZWZhdWx0UHJvcGVydHldXHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICBjdXJyZW50UHJvcGVydHlWYWx1ZVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGNsYXNzRGVmYXVsdFByb3BlcnR5LCB7XHJcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIHRoaXNbJ18nLmNvbmNhdChjbGFzc0RlZmF1bHRQcm9wZXJ0eSldID0gY3VycmVudFByb3BlcnR5VmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBhZGRCaW5kYWJsZUNsYXNzUHJvcGVydGllcygpIHtcclxuICAgIGlmKHRoaXMuYmluZGFibGVDbGFzc1Byb3BlcnRpZXMpIHtcclxuICAgICAgdGhpcy5iaW5kYWJsZUNsYXNzUHJvcGVydGllc1xyXG4gICAgICAgIC5mb3JFYWNoKChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSA9PiB7XHJcbiAgICAgICAgICBsZXQgYmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kcyA9IHRoaXMuZ2V0QmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZXMoXHJcbiAgICAgICAgICAgIGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVcclxuICAgICAgICAgIClcclxuICAgICAgICAgIGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU1ldGhvZHNcclxuICAgICAgICAgICAgLmZvckVhY2goKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU1ldGhvZCwgYmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLmFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eShiaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2QpXHJcbiAgICAgICAgICAgICAgaWYoYmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kSW5kZXggPT09IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU1ldGhvZHMubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUsICdvbicpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBhZGRCaW5kYWJsZUNsYXNzUHJvcGVydHkoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgbGV0IGNvbnRleHQgPSB0aGlzXHJcbiAgICBsZXQgY2FwaXRhbGl6ZVByb3BlcnR5TmFtZSA9IHRoaXMuY2FwaXRhbGl6ZVByb3BlcnR5TmFtZShiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKVxyXG4gICAgbGV0IGFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUgPSAnYWRkJy5jb25jYXQoY2FwaXRhbGl6ZVByb3BlcnR5TmFtZSlcclxuICAgIGxldCByZW1vdmVCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lID0gJ3JlbW92ZScuY29uY2F0KGNhcGl0YWxpemVQcm9wZXJ0eU5hbWUpXHJcbiAgICBpZihiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lID09PSAndWlFbGVtZW50cycpIHtcclxuICAgICAgY29udGV4dC5fdWlFbGVtZW50U2V0dGluZ3MgPSB0aGlzW2JpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdXHJcbiAgICB9XHJcbiAgICBsZXQgY3VycmVudFByb3BlcnR5VmFsdWVzID1cclxuICAgICAgdGhpcy5zZXR0aW5nc1tiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXSB8fFxyXG4gICAgICB0aGlzW2JpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhcclxuICAgICAgdGhpcyxcclxuICAgICAge1xyXG4gICAgICAgIFtiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXToge1xyXG4gICAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgICB2YWx1ZTogY3VycmVudFByb3BlcnR5VmFsdWVzLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgWydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldOiB7XHJcbiAgICAgICAgICBnZXQoKSB7XHJcbiAgICAgICAgICAgIGNvbnRleHRbYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZV0gPSBjb250ZXh0W2JpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdIHx8IHt9XHJcbiAgICAgICAgICAgIHJldHVybiBjb250ZXh0W2JpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2V0KHZhbHVlcykge1xyXG4gICAgICAgICAgICBsZXQgX3ZhbHVlcyA9IE9iamVjdC5lbnRyaWVzKHZhbHVlcylcclxuICAgICAgICAgICAgX3ZhbHVlc1xyXG4gICAgICAgICAgICAgIC5mb3JFYWNoKChba2V5LCB2YWx1ZV0sIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2goYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICBjYXNlICd1aUVsZW1lbnRzJzpcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0Ll91aUVsZW1lbnRTZXR0aW5nc1trZXldID0gdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXHJcbiAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgW2tleV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0KCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNvbnRleHQuZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRleHQuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICBpZihpbmRleCA9PT0gX3ZhbHVlcy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICckZWxlbWVudCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0KCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoY29udGV4dC5lbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250ZXh0LmVsZW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldW2tleV0gPSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBbYWRkQmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZV06IHtcclxuICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBhcmd1bWVudHNbMV1cclxuICAgICAgICAgICAgICBjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldID0ge1xyXG4gICAgICAgICAgICAgICAgW2tleV06IHZhbHVlXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgIGxldCB2YWx1ZXMgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICAgICAgICBjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldID0gdmFsdWVzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yZXNldFRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSlcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHRcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIFtyZW1vdmVCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXToge1xyXG4gICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgICAgICAgIHN3aXRjaChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICd1aUVsZW1lbnRzJzpcclxuICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRleHRbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV1ba2V5XVxyXG4gICAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KCd1aUVsZW1lbnRTZXR0aW5ncycpXVtrZXldXHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpXVtrZXldXHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCl7XHJcbiAgICAgICAgICAgICAgT2JqZWN0LmtleXMoY29udGV4dFsnXycuY29uY2F0KGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpXSlcclxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgc3dpdGNoKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlICd1aUVsZW1lbnRzJzpcclxuICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldW2tleV1cclxuICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQoJ3VpRWxlbWVudFNldHRpbmdzJyldW2tleV1cclxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldW2tleV1cclxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yZXNldFRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSlcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHRcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9XHJcbiAgICApXHJcbiAgICBpZihjdXJyZW50UHJvcGVydHlWYWx1ZXMpIHtcclxuICAgICAgdGhpc1thZGRCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXShjdXJyZW50UHJvcGVydHlWYWx1ZXMpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICByZXNldFRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgcmV0dXJuIHRoaXNcclxuICAgICAgLnRvZ2dsZVRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSwgJ29mZicpXHJcbiAgICAgIC50b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUsICdvbicpXHJcbiAgfVxyXG4gIHRvZ2dsZVRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpIHtcclxuICAgIGlmKFxyXG4gICAgICB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ3MnKV0gJiZcclxuICAgICAgdGhpc1tjbGFzc1R5cGUuY29uY2F0KCdFdmVudHMnKV0gJiZcclxuICAgICAgdGhpc1tjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKV1cclxuICAgICkge1xyXG4gICAgICBPYmplY3QuZW50cmllcyh0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXSlcclxuICAgICAgICAuZm9yRWFjaCgoW2NsYXNzVHlwZUV2ZW50RGF0YSwgY2xhc3NUeXBlQ2FsbGJhY2tOYW1lXSkgPT4ge1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY2xhc3NUeXBlRXZlbnREYXRhID0gY2xhc3NUeXBlRXZlbnREYXRhLnNwbGl0KCcgJylcclxuICAgICAgICAgICAgbGV0IGNsYXNzVHlwZVRhcmdldE5hbWUgPSBjbGFzc1R5cGVFdmVudERhdGFbMF1cclxuICAgICAgICAgICAgbGV0IGNsYXNzVHlwZUV2ZW50TmFtZSA9IGNsYXNzVHlwZUV2ZW50RGF0YVsxXVxyXG4gICAgICAgICAgICBsZXQgY2xhc3NUeXBlVGFyZ2V0ID0gdGhpc1tjbGFzc1R5cGUuY29uY2F0KCdzJyldW2NsYXNzVHlwZVRhcmdldE5hbWVdXHJcbiAgICAgICAgICAgIGxldCBjbGFzc1R5cGVFdmVudENhbGxiYWNrID0gKGNsYXNzVHlwZSA9PT0gJ3VpRWxlbWVudCcpXHJcbiAgICAgICAgICAgICAgPyB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXVtjbGFzc1R5cGVDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICAgICAgOiB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXVtjbGFzc1R5cGVDYWxsYmFja05hbWVdLmJpbmQodGhpcylcclxuICAgICAgICAgICAgdGhpcy50b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnQoXHJcbiAgICAgICAgICAgICAgY2xhc3NUeXBlLFxyXG4gICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldCxcclxuICAgICAgICAgICAgICBjbGFzc1R5cGVFdmVudE5hbWUsXHJcbiAgICAgICAgICAgICAgY2xhc3NUeXBlRXZlbnRDYWxsYmFjayxcclxuICAgICAgICAgICAgICBtZXRob2RcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgfSBjYXRjaChlcnJvcikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXHJcbiAgICAgICAgICAgIGVycm9yXHJcbiAgICAgICAgICApIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgdG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50KFxyXG4gICAgY2xhc3NUeXBlLFxyXG4gICAgY2xhc3NUeXBlVGFyZ2V0LFxyXG4gICAgY2xhc3NUeXBlRXZlbnROYW1lLFxyXG4gICAgY2xhc3NUeXBlRXZlbnRDYWxsYmFjayxcclxuICAgIG1ldGhvZFxyXG4gICkge1xyXG4gICAgc3dpdGNoKG1ldGhvZCkge1xyXG4gICAgICBjYXNlICdvbic6XHJcbiAgICAgICAgc3dpdGNoKGNsYXNzVHlwZSkge1xyXG4gICAgICAgICAgY2FzZSAndWlFbGVtZW50JzpcclxuICAgICAgICAgICAgaWYoY2xhc3NUeXBlVGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuICAgICAgICAgICAgICBBcnJheS5mcm9tKGNsYXNzVHlwZVRhcmdldClcclxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKChfY2xhc3NUeXBlVGFyZ2V0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIF9jbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoY2xhc3NUeXBlVGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICBjbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnb2ZmJzpcclxuICAgICAgICBzd2l0Y2goY2xhc3NUeXBlKSB7XHJcbiAgICAgICAgICBjYXNlICd1aUVsZW1lbnQnOlxyXG4gICAgICAgICAgICBpZihjbGFzc1R5cGVUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xyXG4gICAgICAgICAgICAgIEFycmF5LmZyb20oY2xhc3NUeXBlVGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKF9jbGFzc1R5cGVUYXJnZXQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgX2NsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihjbGFzc1R5cGVUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY2xhc3NUeXBlVGFyZ2V0W21ldGhvZF0oY2xhc3NUeXBlRXZlbnROYW1lLCBjbGFzc1R5cGVFdmVudENhbGxiYWNrKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBCYXNlXHJcbiIsImltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNsYXNzIFNlcnZpY2UgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICdyZXNwb25zZVR5cGUnLFxuICAgICd0eXBlJyxcbiAgICAncGFyYW1ldGVycycsXG4gICAgJ3VybCcsXG4gICAgJ2hlYWRlcnMnLFxuICAgICdkYXRhJ1xuICBdIH1cbiAgZ2V0IF9kZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuZGVmYXVsdHMgfHwge1xuICAgIGNvbnRlbnRUeXBlOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ30sXG4gICAgcmVzcG9uc2VUeXBlOiAnanNvbicsXG4gIH0gfVxuICBnZXQgX2FzeW5jKCkge1xuICAgIHRoaXMuYXN5bmMgPSB0aGlzLmFzeW5jIHx8IHRydWVcbiAgICByZXR1cm4gdGhpcy5hc3luY1xuICB9XG4gIHNldCBfYXN5bmMoYXN5bmMpIHsgdGhpcy5hc3luYyA9IGFzeW5jIH1cbiAgZ2V0IF9yZXNwb25zZVR5cGVzKCkgeyByZXR1cm4gWycnLCAnYXJyYXlidWZmZXInLCAnYmxvYicsICdkb2N1bWVudCcsICdqc29uJywgJ3RleHQnXSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlKCkgeyByZXR1cm4gdGhpcy5yZXNwb25zZVR5cGUgfVxuICBzZXQgX3Jlc3BvbnNlVHlwZShyZXNwb25zZVR5cGUpIHtcbiAgICB0aGlzLl94aHIucmVzcG9uc2VUeXBlID0gdGhpcy5fcmVzcG9uc2VUeXBlcy5maW5kKFxuICAgICAgKHJlc3BvbnNlVHlwZUl0ZW0pID0+IHJlc3BvbnNlVHlwZUl0ZW0gPT09IHJlc3BvbnNlVHlwZVxuICAgICkgfHwgdGhpcy5fZGVmYXVsdHMucmVzcG9uc2VUeXBlXG4gIH1cbiAgZ2V0IF90eXBlKCkge1xuICAgIHRoaXMudHlwZSA9IHRoaXMudHlwZSB8fCB0cnVlXG4gICAgcmV0dXJuIHRoaXMudHlwZVxuICB9XG4gIHNldCBfdHlwZSh0eXBlKSB7IHRoaXMudHlwZSA9IHR5cGUgfVxuICBnZXQgX3BhcmFtZXRlcnMoKSB7XG4gICAgdGhpcy5wYXJhbWV0ZXJzID0gdGhpcy5wYXJhbWV0ZXJzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMucGFyYW1ldGVyc1xuICB9XG4gIHNldCBfcGFyYW1ldGVycyhwYXJhbWV0ZXJzKSB7IHRoaXMucGFyYW1ldGVycyA9IHBhcmFtZXRlcnMgfVxuICBnZXQgX3VybCgpIHsgcmV0dXJuIHRoaXMudXJsIH1cbiAgc2V0IF91cmwodXJsKSB7IHRoaXMudXJsID0gdXJsIH1cbiAgZ2V0IF9oZWFkZXJzKCkge1xuICAgIHRoaXMuaGVhZGVycyA9IHRoaXMuaGVhZGVycyB8fCBbdGhpcy5fZGVmYXVsdHMuY29udGVudFR5cGVdXG4gICAgcmV0dXJuIHRoaXMuaGVhZGVyc1xuICB9XG4gIHNldCBfaGVhZGVycyhoZWFkZXJzKSB7IHRoaXMuaGVhZGVycyA9IGhlYWRlcnMgfVxuICBnZXQgX2RhdGEoKSB7XG4gICAgdGhpcy5kYXRhID0gdGhpcy5kYXRhIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YVxuICB9XG4gIHNldCBfZGF0YShkYXRhKSB7IHRoaXMuZGF0YSA9IGRhdGEgfVxuICBnZXQgX3hocigpIHtcbiAgICB0aGlzLnhociA9ICh0aGlzLnhocilcbiAgICAgID8gdGhpcy54aHJcbiAgICAgIDogbmV3IFhNTEh0dHBSZXF1ZXN0KClcbiAgICByZXR1cm4gdGhpcy54aHJcbiAgfVxuICBzdHJpbmdQYXJhbWV0ZXJzKCkge1xuICAgIGxldCBwYXJhbWV0ZXJzID0gT2JqZWN0LmVudHJpZXModGhpcy5fcGFyYW1ldGVycylcbiAgICByZXR1cm4gKHBhcmFtZXRlcnMubGVuZ3RoKVxuICAgICAgPyBwYXJhbWV0ZXJzXG4gICAgICAgIC5yZWR1Y2UoXG4gICAgICAgICAgKFxuICAgICAgICAgICAgcGFyYW1ldGVyU3RyaW5nLFxuICAgICAgICAgICAgW3BhcmFtZXRlcktleSwgcGFyYW1ldGVyVmFsdWVdLFxuICAgICAgICAgICAgcGFyYW1ldGVySW5kZXhcbiAgICAgICAgICApID0+IHtcbiAgICAgICAgICAgIGxldCBjb25jYXRlbmF0b3IgPSAoXG4gICAgICAgICAgICAgIHBhcmFtZXRlckluZGV4ICE9PSBwYXJhbWV0ZXJzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICkgPyAnJidcbiAgICAgICAgICAgICAgOiAnJ1xuICAgICAgICAgICAgbGV0IGFzc2lnbm1lbnRPcGVyYXRvciA9ICc9J1xuICAgICAgICAgICAgcGFyYW1ldGVyU3RyaW5nID0gcGFyYW1ldGVyU3RyaW5nLmNvbmNhdChcbiAgICAgICAgICAgICAgcGFyYW1ldGVyS2V5LFxuICAgICAgICAgICAgICBhc3NpZ25tZW50T3BlcmF0b3IsXG4gICAgICAgICAgICAgIHBhcmFtZXRlclZhbHVlLFxuICAgICAgICAgICAgICBjb25jYXRlbmF0b3JcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIHJldHVybiBwYXJhbWV0ZXJTdHJpbmdcbiAgICAgICAgICB9LFxuICAgICAgICAgICc/J1xuICAgICAgICApXG4gICAgICA6ICcnXG4gIH1cbiAgcmVxdWVzdCgpIHtcbiAgICBsZXQgdHlwZSA9IHRoaXMuX3R5cGVcbiAgICBsZXQgdXJsID0gKE9iamVjdC5rZXlzKHRoaXMuX3BhcmFtZXRlcnMpLmxlbmd0aClcbiAgICAgID8gdGhpcy5fdXJsLmNvbmNhdChcbiAgICAgICAgdGhpcy5zdHJpbmdQYXJhbWV0ZXJzKClcbiAgICAgIClcbiAgICAgIDogdGhpcy5fdXJsXG4gICAgbGV0IGFzeW5jID0gdGhpcy5fYXN5bmNcbiAgICBsZXQgeGhyID0gdGhpcy5feGhyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHhoci5vbmxvYWQgPSByZXNvbHZlXG4gICAgICB4aHIub25lcnJvciA9IHJlamVjdFxuICAgICAgeGhyLm9wZW4odHlwZSwgdXJsLCBhc3luYylcbiAgICAgIHRoaXMuX2hlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICAgIGhlYWRlciA9IE9iamVjdC5lbnRyaWVzKGhlYWRlcilbMF1cbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgICB9KVxuICAgICAgaWYoT2JqZWN0LmtleXModGhpcy5fZGF0YSkubGVuZ3RoKSB7XG4gICAgICAgIHhoci5zZW5kKHRoaXMuX2RhdGEpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB4aHIuc2VuZCgpXG4gICAgICB9XG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgJ3hoclJlc29sdmUnLCB7XG4gICAgICAgICAgbmFtZTogJ3hoclJlc29sdmUnLFxuICAgICAgICAgIGRhdGE6IHJlc3BvbnNlLmN1cnJlbnRUYXJnZXQsXG4gICAgICAgIH0sXG4gICAgICAgIHRoaXNcbiAgICAgIClcbiAgICAgIHJldHVybiByZXNwb25zZVxuICAgIH0pLmNhdGNoKChlcnJvcikgPT4geyB0aHJvdyBlcnJvciB9KVxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBTZXJ2aWNlXG4iLCJpbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4LmpzJ1xuXG5jbGFzcyBNb2RlbCBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IHN0b3JhZ2VDb250YWluZXIoKSB7IHJldHVybiB7fSB9XG4gIGdldCBkZWZhdWx0SURBdHRyaWJ1dGUoKSB7IHJldHVybiAnX2lkJyB9XG4gIGdldCBiaW5kYWJsZUNsYXNzUHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAnc2VydmljZSdcbiAgXSB9XG4gIGdldCBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICdpZEF0dHJpYnV0ZScsXG4gICAgJ2xvY2FsU3RvcmFnZScsXG4gICAgJ2hpc3Rpb2dyYW0nLFxuICAgICdkZWZhdWx0cydcbiAgXSB9XG4gIGdldCBfaWRBdHRyaWJ1dGUoKSB7XG4gICAgdGhpcy5pZEF0dHJpYnV0ZSA9IHRoaXMuaWRBdHRyaWJ1dGUgfHwgdGhpcy5kZWZhdWx0SURBdHRyaWJ1dGVcbiAgICByZXR1cm4gdGhpcy5pZEF0dHJpYnV0ZVxuICB9XG4gIHNldCBfaWRBdHRyaWJ1dGUoaWRBdHRyaWJ1dGUpIHsgdGhpcy5pZEF0dHJpYnV0ZSA9IGlkQXR0cmlidXRlIH1cbiAgZ2V0IF9kZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuZGVmYXVsdHMgfVxuICBzZXQgX2RlZmF1bHRzKGRlZmF1bHRzKSB7XG4gICAgdGhpcy5kZWZhdWx0cyA9IGRlZmF1bHRzXG4gICAgdGhpcy5zZXQodGhpcy5kZWZhdWx0cylcbiAgfVxuICBnZXQgX2lzU2V0dGluZygpIHsgcmV0dXJuIHRoaXMuaXNTZXR0aW5nIH1cbiAgc2V0IF9pc1NldHRpbmcoaXNTZXR0aW5nKSB7IHRoaXMuaXNTZXR0aW5nID0gaXNTZXR0aW5nIH1cbiAgZ2V0IF9zaWxlbnQoKSB7XG4gICAgdGhpcy5zaWxlbnQgPSAodHlwZW9mIHRoaXMuc2lsZW50ID09PSAnYm9vbGVhbicpXG4gICAgICA/IHRoaXMuc2lsZW50XG4gICAgICA6IGZhbHNlXG4gICAgcmV0dXJuIHRoaXMuc2lsZW50XG4gIH1cbiAgc2V0IF9zaWxlbnQoc2lsZW50KSB7IHRoaXMuc2lsZW50ID0gc2lsZW50IH1cbiAgZ2V0IF9jaGFuZ2luZygpIHtcbiAgICB0aGlzLmNoYW5naW5nID0gdGhpcy5jaGFuZ2luZyB8fCB7fVxuICAgIHJldHVybiB0aGlzLmNoYW5naW5nXG4gIH1cbiAgZ2V0IF9sb2NhbFN0b3JhZ2UoKSB7IHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZSB9XG4gIHNldCBfbG9jYWxTdG9yYWdlKGxvY2FsU3RvcmFnZSkgeyB0aGlzLmxvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XG4gIGdldCBfaGlzdGlvZ3JhbSgpIHsgcmV0dXJuIHRoaXMuaGlzdGlvZ3JhbSB8fCB7XG4gICAgbGVuZ3RoOiAxXG4gIH0gfVxuICBzZXQgX2hpc3Rpb2dyYW0oaGlzdGlvZ3JhbSkge1xuICAgIHRoaXMuaGlzdGlvZ3JhbSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB0aGlzLl9oaXN0aW9ncmFtLFxuICAgICAgaGlzdGlvZ3JhbVxuICAgIClcbiAgfVxuICBnZXQgX2hpc3RvcnkoKSB7XG4gICAgdGhpcy5oaXN0b3J5ID0gdGhpcy5oaXN0b3J5IHx8IFtdXG4gICAgcmV0dXJuIHRoaXMuaGlzdG9yeVxuICB9XG4gIHNldCBfaGlzdG9yeShkYXRhKSB7XG4gICAgaWYoXG4gICAgICBPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGlmKHRoaXMuX2hpc3Rpb2dyYW0ubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudW5zaGlmdCh0aGlzLnBhcnNlKGRhdGEpKVxuICAgICAgICB0aGlzLl9oaXN0b3J5LnNwbGljZSh0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aClcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IF9kYXRhKCkge1xuICAgIHRoaXMuZGF0YSA9IHRoaXMuZGF0YSB8fCB0aGlzLnN0b3JhZ2VDb250YWluZXJcbiAgICByZXR1cm4gdGhpcy5kYXRhXG4gIH1cbiAgc2V0IF9kYXRhKGRhdGEpIHsgdGhpcy5kYXRhID0gZGF0YSB9XG4gIGdldCBkYigpIHsgcmV0dXJuIHRoaXMuX2RiIH1cbiAgZ2V0IF9kYigpIHtcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgfHwgSlNPTi5zdHJpbmdpZnkodGhpcy5zdG9yYWdlQ29udGFpbmVyKVxuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICBnZXQoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAge30sXG4gICAgICAgICAgdGhpcy5fZGF0YVxuICAgICAgICApXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFba2V5XVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBzZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHRoaXMuX2lzU2V0dGluZyA9IHRydWVcbiAgICAgICAgdmFyIF9hcmd1bWVudHMgPSBPYmplY3QuZW50cmllcyhhcmd1bWVudHNbMF0pXG4gICAgICAgIF9hcmd1bWVudHMuZm9yRWFjaCgoW2tleSwgdmFsdWVdLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGlmKGluZGV4ID09PSAoX2FyZ3VtZW50cy5sZW5ndGggLSAxKSkgdGhpcy5faXNTZXR0aW5nID0gZmFsc2VcbiAgICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBpZih0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgICB2YXIgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICAgIHZhciBzaWxlbnQgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmKGluZGV4ID09PSAoX2FyZ3VtZW50cy5sZW5ndGggLSAxKSkgdGhpcy5faXNTZXR0aW5nID0gZmFsc2VcbiAgICAgICAgICAgIHRoaXMuX3NpbGVudCA9IHNpbGVudFxuICAgICAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSlcbiAgICAgICAgICAgIHRoaXMuX3NpbGVudCA9IGZhbHNlXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAzOlxuICAgICAgICB2YXIga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHZhciB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICB2YXIgc2lsZW50ID0gYXJndW1lbnRzWzJdXG4gICAgICAgIHRoaXMuX3NpbGVudCA9IHNpbGVudFxuICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICB0aGlzLl9zaWxlbnQgPSBmYWxzZVxuICAgICAgICBicmVha1xuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0KCkge1xuICAgIHRoaXMuX2hpc3RvcnkgPSB0aGlzLnBhcnNlKClcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyh0aGlzLl9kYXRhKSkge1xuICAgICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0REIoKSB7XG4gICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICB2YXIgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBsZXQgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgZGJba2V5XSA9IHZhbHVlXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHRoaXMuX2RiID0gZGJcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0REIoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZGVsZXRlIHRoaXMuX2RiXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgZGVsZXRlIGRiW2tleV1cbiAgICAgICAgdGhpcy5fZGIgPSBkYlxuICAgICAgICBicmVha1xuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKSB7XG4gICAgaWYoIXRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXSkge1xuICAgICAgbGV0IGNvbnRleHQgPSB0aGlzXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhcbiAgICAgICAgdGhpcy5fZGF0YSxcbiAgICAgICAge1xuICAgICAgICAgIFsnXycuY29uY2F0KGtleSldOiB7XG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzW2tleV0gfSxcbiAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgICBjb250ZXh0Ll9jaGFuZ2luZ1trZXldID0gdmFsdWVcbiAgICAgICAgICAgICAgaWYoY29udGV4dC5sb2NhbFN0b3JhZ2UpIGNvbnRleHQuc2V0REIoa2V5LCB2YWx1ZSlcbiAgICAgICAgICAgICAgbGV0IHNldFZhbHVlRXZlbnROYW1lID0gWydzZXQnLCAnOicsIGtleV0uam9pbignJylcbiAgICAgICAgICAgICAgbGV0IHNldEV2ZW50TmFtZSA9ICdzZXQnXG4gICAgICAgICAgICAgIGlmKGNvbnRleHQuc2lsZW50ICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgICAgc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYoIWNvbnRleHQuX2lzU2V0dGluZykge1xuICAgICAgICAgICAgICAgIGlmKCFPYmplY3QudmFsdWVzKGNvbnRleHQuX2NoYW5naW5nKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgIGlmKGNvbnRleHQuc2lsZW50ICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICAgICAgICBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgICAgICAgICAgICAgICAge30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuX2RhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBpZihjb250ZXh0LnNpbGVudCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgICAgICAgc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0Ll9jaGFuZ2luZyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5fZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRleHQuY2hhbmdpbmdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKVxuICAgIH1cbiAgICB0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV0gPSB2YWx1ZVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXREYXRhUHJvcGVydHkoa2V5KSB7XG4gICAgbGV0IHVuc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3Vuc2V0JywgJzonLCBrZXldLmpvaW4oJycpXG4gICAgbGV0IHVuc2V0RXZlbnROYW1lID0gJ3Vuc2V0J1xuICAgIGxldCB1bnNldFZhbHVlID0gdGhpcy5fZGF0YVtrZXldXG4gICAgZGVsZXRlIHRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXVxuICAgIGRlbGV0ZSB0aGlzLl9kYXRhW2tleV1cbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldFZhbHVlRXZlbnROYW1lLFxuICAgICAge1xuICAgICAgICBuYW1lOiB1bnNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgdmFsdWU6IHVuc2V0VmFsdWUsXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0aGlzXG4gICAgKVxuICAgIHRoaXMuZW1pdChcbiAgICAgIHVuc2V0RXZlbnROYW1lLFxuICAgICAge1xuICAgICAgICBuYW1lOiB1bnNldEV2ZW50TmFtZSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiB1bnNldFZhbHVlLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdGhpc1xuICAgIClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHBhcnNlKGRhdGEpIHtcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLl9kYXRhIHx8IHRoaXMuc3RvcmFnZUNvbnRhaW5lclxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vZGVsXG4iLCJpbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4LmpzJ1xyXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vTW9kZWwvaW5kZXguanMnXHJcblxyXG5jbGFzcyBDb2xsZWN0aW9uIGV4dGVuZHMgQmFzZSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgfVxyXG4gIGdldCBzdG9yYWdlQ29udGFpbmVyKCkgeyByZXR1cm4gW10gfVxyXG4gIGdldCBkZWZhdWx0SURBdHRyaWJ1dGUoKSB7IHJldHVybiAnX2lkJyB9XHJcbiAgZ2V0IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xyXG4gICAgJ3NlcnZpY2UnXHJcbiAgXSB9XHJcbiAgZ2V0IGNsYXNzRGVmYXVsdFByb3BlcnRpZXMoKSB7IHJldHVybiBbXHJcbiAgICAnaWRBdHRyaWJ1dGUnLFxyXG4gICAgJ21vZGVsJyxcclxuICAgICdkZWZhdWx0cydcclxuICBdIH1cclxuICBnZXQgX2lkQXR0cmlidXRlKCkge1xyXG4gICAgdGhpcy5pZEF0dHJpYnV0ZSA9IHRoaXMuaWRBdHRyaWJ1dGUgfHwgdGhpcy5kZWZhdWx0SURBdHRyaWJ1dGVcclxuICAgIHJldHVybiB0aGlzLmlkQXR0cmlidXRlXHJcbiAgfVxyXG4gIHNldCBfaWRBdHRyaWJ1dGUoaWRBdHRyaWJ1dGUpIHsgdGhpcy5pZEF0dHJpYnV0ZSA9IGlkQXR0cmlidXRlIH1cclxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5kZWZhdWx0cyB9XHJcbiAgc2V0IF9kZWZhdWx0cyhkZWZhdWx0cykge1xyXG4gICAgdGhpcy5kZWZhdWx0cyA9IGRlZmF1bHRzXHJcbiAgICB0aGlzLnNldChkZWZhdWx0cylcclxuICB9XHJcbiAgZ2V0IF9tb2RlbHMoKSB7XHJcbiAgICB0aGlzLm1vZGVscyA9IHRoaXMubW9kZWxzIHx8IHRoaXMuc3RvcmFnZUNvbnRhaW5lclxyXG4gICAgcmV0dXJuIHRoaXMubW9kZWxzXHJcbiAgfVxyXG4gIHNldCBfbW9kZWxzKG1vZGVsc0RhdGEpIHsgdGhpcy5tb2RlbHMgPSBtb2RlbHNEYXRhIH1cclxuICBnZXQgX21vZGVsKCkgeyByZXR1cm4gdGhpcy5tb2RlbCB9XHJcbiAgc2V0IF9tb2RlbChtb2RlbCkgeyB0aGlzLm1vZGVsID0gbW9kZWwgfVxyXG4gIGdldCBfaXNTZXR0aW5nKCkgeyByZXR1cm4gdGhpcy5pc1NldHRpbmcgfVxyXG4gIHNldCBfaXNTZXR0aW5nKGlzU2V0dGluZykgeyB0aGlzLmlzU2V0dGluZyA9IGlzU2V0dGluZyB9XHJcbiAgZ2V0IF9sb2NhbFN0b3JhZ2UoKSB7IHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZSB9XHJcbiAgc2V0IF9sb2NhbFN0b3JhZ2UobG9jYWxTdG9yYWdlKSB7IHRoaXMubG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yYWdlIH1cclxuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGEgfVxyXG4gIGdldCBfZGF0YSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9tb2RlbHNcclxuICAgICAgLm1hcCgobW9kZWwpID0+IG1vZGVsLnBhcnNlKCkpXHJcbiAgfVxyXG4gIGdldCBkYigpIHsgcmV0dXJuIHRoaXMuX2RiIH1cclxuICBnZXQgX2RiKCkge1xyXG4gICAgbGV0IGRiID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5fbG9jYWxTdG9yYWdlLmVuZHBvaW50KSB8fCBKU09OLnN0cmluZ2lmeSh0aGlzLnN0b3JhZ2VDb250YWluZXIpXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkYilcclxuICB9XHJcbiAgc2V0IF9kYihkYikge1xyXG4gICAgZGIgPSBKU09OLnN0cmluZ2lmeShkYilcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuX2xvY2FsU3RvcmFnZS5lbmRwb2ludCwgZGIpXHJcbiAgfVxyXG4gIGdldE1vZGVsSW5kZXgobW9kZWxVVUlEKSB7XHJcbiAgICBsZXQgbW9kZWxJbmRleFxyXG4gICAgdGhpcy5fbW9kZWxzXHJcbiAgICAgIC5maW5kKChfbW9kZWwsIF9tb2RlbEluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYoX21vZGVsICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgX21vZGVsIGluc3RhbmNlb2YgTW9kZWwgJiZcclxuICAgICAgICAgICAgX21vZGVsLl91dWlkID09PSBtb2RlbFVVSURcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICBtb2RlbEluZGV4ID0gX21vZGVsSW5kZXhcclxuICAgICAgICAgICAgcmV0dXJuIF9tb2RlbFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIHJldHVybiBtb2RlbEluZGV4XHJcbiAgfVxyXG4gIHJlbW92ZU1vZGVsQnlJbmRleChtb2RlbEluZGV4KSB7XHJcbiAgICBsZXQgbW9kZWwgPSB0aGlzLl9tb2RlbHMuc3BsaWNlKG1vZGVsSW5kZXgsIDEsIG51bGwpXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdyZW1vdmUnLCB7XHJcbiAgICAgICAgbmFtZTogJ3JlbW92ZScsXHJcbiAgICAgIH0sXHJcbiAgICAgIG1vZGVsWzBdLFxyXG4gICAgICB0aGlzXHJcbiAgICApXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBhZGRNb2RlbChtb2RlbERhdGEpIHtcclxuICAgIGxldCBtb2RlbFxyXG4gICAgaWYobW9kZWxEYXRhIGluc3RhbmNlb2YgTW9kZWwpIHtcclxuICAgICAgbW9kZWwgPSBtb2RlbERhdGFcclxuICAgICAgbW9kZWwub24oXHJcbiAgICAgICAgJ3NldCcsXHJcbiAgICAgICAgKGV2ZW50LCBfbW9kZWwpID0+IHtcclxuICAgICAgICAgIHRoaXMuZW1pdChcclxuICAgICAgICAgICAgJ2NoYW5nZScsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBuYW1lOiAnY2hhbmdlJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICAgIClcclxuICAgICAgdGhpcy5fbW9kZWxzLnB1c2gobW9kZWwpXHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdhZGQnLFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogJ2FkZCcsXHJcbiAgICAgIH0sXHJcbiAgICAgIG1vZGVsLFxyXG4gICAgICB0aGlzXHJcbiAgICApXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBhZGQobW9kZWxEYXRhKSB7XHJcbiAgICB0aGlzLl9pc1NldHRpbmcgPSB0cnVlXHJcbiAgICBpZihBcnJheS5pc0FycmF5KG1vZGVsRGF0YSkpIHtcclxuICAgICAgbW9kZWxEYXRhXHJcbiAgICAgICAgLmZvckVhY2goKF9tb2RlbERhdGEpID0+IHtcclxuICAgICAgICAgIHRoaXMuYWRkTW9kZWwoX21vZGVsRGF0YSlcclxuICAgICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hZGRNb2RlbChtb2RlbERhdGEpXHJcbiAgICB9XHJcbiAgICBpZih0aGlzLl9sb2NhbFN0b3JhZ2UpIHRoaXMuX2RiID0gdGhpcy5fZGF0YVxyXG4gICAgdGhpcy5faXNTZXR0aW5nID0gZmFsc2VcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ2NoYW5nZScsIHtcclxuICAgICAgICBuYW1lOiAnY2hhbmdlJyxcclxuICAgICAgICBkYXRhOiB0aGlzLl9kYXRhLFxyXG4gICAgICB9LFxyXG4gICAgICB0aGlzXHJcbiAgICApXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICByZW1vdmUobW9kZWxEYXRhKSB7XHJcbiAgICB0aGlzLl9pc1NldHRpbmcgPSB0cnVlXHJcbiAgICBpZihcclxuICAgICAgIUFycmF5LmlzQXJyYXkobW9kZWxEYXRhKVxyXG4gICAgKSB7XHJcbiAgICAgIHZhciBtb2RlbEluZGV4ID0gdGhpcy5nZXRNb2RlbEluZGV4KG1vZGVsRGF0YS5fdXVpZClcclxuICAgICAgdGhpcy5yZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleClcclxuICAgIH0gZWxzZSBpZihBcnJheS5pc0FycmF5KG1vZGVsRGF0YSkpIHtcclxuICAgICAgbW9kZWxEYXRhXHJcbiAgICAgICAgLmZvckVhY2goKG1vZGVsKSA9PiB7XHJcbiAgICAgICAgICB2YXIgbW9kZWxJbmRleCA9IHRoaXMuZ2V0TW9kZWxJbmRleChtb2RlbC5fdXVpZClcclxuICAgICAgICAgIHRoaXMucmVtb3ZlTW9kZWxCeUluZGV4KG1vZGVsSW5kZXgpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIHRoaXMuX21vZGVscyA9IHRoaXMuX21vZGVsc1xyXG4gICAgICAuZmlsdGVyKChtb2RlbCkgPT4gbW9kZWwgIT09IG51bGwpXHJcbiAgICBpZih0aGlzLl9sb2NhbFN0b3JhZ2UpIHRoaXMuX2RiID0gdGhpcy5fZGF0YVxyXG5cclxuICAgIHRoaXMuX2lzU2V0dGluZyA9IGZhbHNlXHJcblxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAnY2hhbmdlJywge1xyXG4gICAgICAgIG5hbWU6ICdjaGFuZ2UnLFxyXG4gICAgICAgIGRhdGE6IHRoaXMuX2RhdGEsXHJcbiAgICAgIH0sXHJcbiAgICAgIHRoaXNcclxuICAgIClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHJlc2V0KCkge1xyXG4gICAgdGhpcy5yZW1vdmUodGhpcy5fbW9kZWxzKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcGFyc2UoZGF0YSkge1xyXG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5fZGF0YSB8fCB0aGlzLnN0b3JhZ2VDb250YWluZXJcclxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ29sbGVjdGlvblxyXG4iLCJpbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4LmpzJ1xuXG5jbGFzcyBWaWV3IGV4dGVuZHMgQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgYmluZGFibGVDbGFzc1Byb3BlcnRpZXMoKSB7IHJldHVybiBbXG4gICAgJ3VpRWxlbWVudCdcbiAgXSB9XG4gIGdldCBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICdlbGVtZW50TmFtZScsXG4gICAgJ2VsZW1lbnQnLFxuICAgICdhdHRyaWJ1dGVzJyxcbiAgICAndGVtcGxhdGVzJyxcbiAgICAnaW5zZXJ0J1xuICBdIH1cbiAgZ2V0IF9lbGVtZW50TmFtZSgpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQudGFnTmFtZSB9XG4gIHNldCBfZWxlbWVudE5hbWUoZWxlbWVudE5hbWUpIHtcbiAgICBpZighdGhpcy5fZWxlbWVudCkgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudE5hbWUpXG4gIH1cbiAgZ2V0IF9lbGVtZW50KCkgeyByZXR1cm4gdGhpcy5lbGVtZW50IH1cbiAgc2V0IF9lbGVtZW50KGVsZW1lbnQpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgdGhpcy5lbGVtZW50T2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmVsZW1lbnQsIHtcbiAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgfSlcbiAgfVxuICBnZXQgX2F0dHJpYnV0ZXMoKSB7XG4gICAgdGhpcy5hdHRyaWJ1dGVzID0gdGhpcy5lbGVtZW50LmF0dHJpYnV0ZXNcbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzXG4gIH1cbiAgc2V0IF9hdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHtcbiAgICBmb3IobGV0IFthdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhhdHRyaWJ1dGVzKSkge1xuICAgICAgaWYodHlwZW9mIGF0dHJpYnV0ZVZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVLZXkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgZWxlbWVudE9ic2VydmVyKCkge1xuICAgIHRoaXMuX2VsZW1lbnRPYnNlcnZlciA9IHRoaXMuX2VsZW1lbnRPYnNlcnZlciB8fCBuZXcgTXV0YXRpb25PYnNlcnZlcihcbiAgICAgIHRoaXMuZWxlbWVudE9ic2VydmUuYmluZCh0aGlzKVxuICAgIClcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudE9ic2VydmVyXG4gIH1cbiAgZ2V0IF9pbnNlcnQoKSB7XG4gICAgdGhpcy5pbnNlcnQgPSB0aGlzLmluc2VydCB8fCBudWxsXG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0XG4gIH1cbiAgc2V0IF9pbnNlcnQoaW5zZXJ0KSB7IHRoaXMuaW5zZXJ0ID0gaW5zZXJ0IH1cbiAgZ2V0IF90ZW1wbGF0ZXMoKSB7XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSB0aGlzLnRlbXBsYXRlcyB8fCB7fVxuICAgIHJldHVybiB0aGlzLnRlbXBsYXRlc1xuICB9XG4gIHNldCBfdGVtcGxhdGVzKHRlbXBsYXRlcykgeyB0aGlzLnRlbXBsYXRlcyA9IHRlbXBsYXRlcyB9XG4gIGVsZW1lbnRPYnNlcnZlKG11dGF0aW9uUmVjb3JkTGlzdCwgb2JzZXJ2ZXIpIHtcbiAgICBmb3IobGV0IFttdXRhdGlvblJlY29yZEluZGV4LCBtdXRhdGlvblJlY29yZF0gb2YgT2JqZWN0LmVudHJpZXMobXV0YXRpb25SZWNvcmRMaXN0KSkge1xuICAgICAgc3dpdGNoKG11dGF0aW9uUmVjb3JkLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnY2hpbGRMaXN0JzpcbiAgICAgICAgICBsZXQgbXV0YXRpb25SZWNvcmRDYXRlZ29yaWVzID0gWydhZGRlZE5vZGVzJywgJ3JlbW92ZWROb2RlcyddXG4gICAgICAgICAgdGhpcy5yZXNldFRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMoJ3VpRWxlbWVudCcpXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYXV0b0luc2VydCgpIHtcbiAgICBsZXQgaW5zZXJ0ID0gdGhpcy5pbnNlcnRcbiAgICBpbnNlcnQucGFyZW50Lmluc2VydEFkamFjZW50RWxlbWVudChcbiAgICAgIGluc2VydC5tZXRob2QsXG4gICAgICB0aGlzLl9lbGVtZW50XG4gICAgKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgYXV0b1JlbW92ZSgpIHtcbiAgICBpZihcbiAgICAgIHRoaXMuZWxlbWVudCAmJlxuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnRcbiAgICApIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBWaWV3XG4iLCJpbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4J1xuXG5jb25zdCBDb250cm9sbGVyID0gY2xhc3MgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBiaW5kYWJsZUNsYXNzUHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAnbW9kZWwnLFxuICAgICdjb2xsZWN0aW9uJyxcbiAgICAndmlldycsXG4gICAgJ2NvbnRyb2xsZXInLFxuICAgICdyb3V0ZXInXG4gIF0gfVxuICBnZXQgY2xhc3NEZWZhdWx0UHJvcGVydGllcygpIHsgcmV0dXJuIFtdIH1cbn1cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xsZXJcbiIsImltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNvbnN0IFJvdXRlciA9IGNsYXNzIGV4dGVuZHMgQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgICB0aGlzLmFkZFdpbmRvd0V2ZW50cygpXG4gIH1cbiAgZ2V0IGNsYXNzRGVmYXVsdFByb3BlcnRpZXMoKSB7IHJldHVybiBbXG4gICAgJ3Jvb3QnLFxuICAgICdoYXNoUm91dGluZycsXG4gICAgJ2NvbnRyb2xsZXInLFxuICAgICdyb3V0ZXMnXG4gIF0gfVxuICBnZXQgcHJvdG9jb2woKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgfVxuICBnZXQgaG9zdG5hbWUoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgfVxuICBnZXQgcG9ydCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wb3J0IH1cbiAgZ2V0IHBhdGhuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIH1cbiAgZ2V0IHBhdGgoKSB7XG4gICAgbGV0IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZVxuICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cChbJ14nLCB0aGlzLnJvb3RdLmpvaW4oJycpKSwgJycpXG4gICAgICAuc3BsaXQoJz8nKVxuICAgICAgLnNsaWNlKDAsIDEpXG4gICAgICBbMF1cbiAgICBsZXQgZnJhZ21lbnRzID0gKFxuICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMFxuICAgICkgPyBbXVxuICAgICAgOiAoXG4gICAgICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXlxcLy8pICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9cXC8/LylcbiAgICAgICAgKSA/IFsnLyddXG4gICAgICAgICAgOiBzdHJpbmdcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICByZXR1cm4ge1xuICAgICAgZnJhZ21lbnRzOiBmcmFnbWVudHMsXG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICB9XG4gIH1cbiAgZ2V0IGhhc2goKSB7XG4gICAgbGV0IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoXG4gICAgICAuc2xpY2UoMSlcbiAgICAgIC5zcGxpdCgnPycpXG4gICAgICAuc2xpY2UoMCwgMSlcbiAgICAgIFswXVxuICAgIGxldCBmcmFnbWVudHMgPSAoXG4gICAgICBzdHJpbmcubGVuZ3RoID09PSAwXG4gICAgKSA/IFtdXG4gICAgICA6IChcbiAgICAgICAgICBzdHJpbmcubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9eXFwvLykgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL1xcLz8vKVxuICAgICAgICApID8gWycvJ11cbiAgICAgICAgICA6IHN0cmluZ1xuICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAuc3BsaXQoJy8nKVxuICAgIHJldHVybiB7XG4gICAgICBmcmFnbWVudHM6IGZyYWdtZW50cyxcbiAgICAgIHN0cmluZzogc3RyaW5nLFxuICAgIH1cbiAgfVxuICBnZXQgcGFyYW1ldGVycygpIHtcbiAgICBsZXQgc3RyaW5nXG4gICAgbGV0IGRhdGFcbiAgICBpZih3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvXFw/LykpIHtcbiAgICAgIGxldCBwYXJhbWV0ZXJzID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICAgICAgLnNwbGl0KCc/JylcbiAgICAgICAgLnNsaWNlKC0xKVxuICAgICAgICAuam9pbignJylcbiAgICAgIHN0cmluZyA9IHBhcmFtZXRlcnNcbiAgICAgIGRhdGEgPSBwYXJhbWV0ZXJzXG4gICAgICAgIC5zcGxpdCgnJicpXG4gICAgICAgIC5yZWR1Y2UoKFxuICAgICAgICAgIF9wYXJhbWV0ZXJzLFxuICAgICAgICAgIHBhcmFtZXRlclxuICAgICAgICApID0+IHtcbiAgICAgICAgICBsZXQgcGFyYW1ldGVyRGF0YSA9IHBhcmFtZXRlci5zcGxpdCgnPScpXG4gICAgICAgICAgX3BhcmFtZXRlcnNbcGFyYW1ldGVyRGF0YVswXV0gPSBwYXJhbWV0ZXJEYXRhWzFdXG4gICAgICAgICAgcmV0dXJuIF9wYXJhbWV0ZXJzXG4gICAgICAgIH0sIHt9KVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHJpbmcgPSAnJ1xuICAgICAgZGF0YSA9IHt9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9XG4gIH1cbiAgZ2V0IF9yb290KCkgeyByZXR1cm4gdGhpcy5yb290IHx8ICcvJyB9XG4gIHNldCBfcm9vdChyb290KSB7IHRoaXMucm9vdCA9IHJvb3QgfVxuICBnZXQgX2hhc2hSb3V0aW5nKCkgeyByZXR1cm4gdGhpcy5oYXNoUm91dGluZyB8fCBmYWxzZSB9XG4gIHNldCBfaGFzaFJvdXRpbmcoaGFzaFJvdXRpbmcpIHsgdGhpcy5oYXNoUm91dGluZyA9IGhhc2hSb3V0aW5nIH1cbiAgZ2V0IF9yb3V0ZXMoKSB7IHJldHVybiB0aGlzLnJvdXRlcyB9XG4gIHNldCBfcm91dGVzKHJvdXRlcykgeyB0aGlzLnJvdXRlcyA9IHJvdXRlcyB9XG4gIGdldCBfY29udHJvbGxlcigpIHsgcmV0dXJuIHRoaXMuY29udHJvbGxlciB9XG4gIHNldCBfY29udHJvbGxlcihjb250cm9sbGVyKSB7IHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXIgfVxuICBnZXQgbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvb3Q6IHRoaXMucm9vdCxcbiAgICAgIHBhdGg6IHRoaXMucGF0aCxcbiAgICAgIGhhc2g6IHRoaXMuaGFzaCxcbiAgICAgIHBhcmFtZXRlcnM6IHRoaXMucGFyYW1ldGVycyxcbiAgICB9XG4gIH1cbiAgbWF0Y2hSb3V0ZShyb3V0ZUZyYWdtZW50cywgbG9jYXRpb25GcmFnbWVudHMpIHtcbiAgICBsZXQgcm91dGVNYXRjaGVzID0gbmV3IEFycmF5KClcbiAgICBpZihyb3V0ZUZyYWdtZW50cy5sZW5ndGggPT09IGxvY2F0aW9uRnJhZ21lbnRzLmxlbmd0aCkge1xuICAgICAgcm91dGVNYXRjaGVzID0gcm91dGVGcmFnbWVudHNcbiAgICAgICAgLnJlZHVjZSgoX3JvdXRlTWF0Y2hlcywgcm91dGVGcmFnbWVudCwgcm91dGVGcmFnbWVudEluZGV4KSA9PiB7XG4gICAgICAgICAgbGV0IGxvY2F0aW9uRnJhZ21lbnQgPSBsb2NhdGlvbkZyYWdtZW50c1tyb3V0ZUZyYWdtZW50SW5kZXhdXG4gICAgICAgICAgaWYocm91dGVGcmFnbWVudC5tYXRjaCgvXlxcOi8pKSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2godHJ1ZSlcbiAgICAgICAgICB9IGVsc2UgaWYocm91dGVGcmFnbWVudCA9PT0gbG9jYXRpb25GcmFnbWVudCkge1xuICAgICAgICAgICAgX3JvdXRlTWF0Y2hlcy5wdXNoKHRydWUpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaChmYWxzZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yb3V0ZU1hdGNoZXNcbiAgICAgICAgfSwgW10pXG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRlTWF0Y2hlcy5wdXNoKGZhbHNlKVxuICAgIH1cbiAgICByZXR1cm4gKHJvdXRlTWF0Y2hlcy5pbmRleE9mKGZhbHNlKSA9PT0gLTEpXG4gICAgICA/IHRydWVcbiAgICAgIDogZmFsc2VcbiAgfVxuICBnZXRSb3V0ZShsb2NhdGlvbikge1xuICAgIGxldCByb3V0ZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnJvdXRlcylcbiAgICAgIC5yZWR1Y2UoKFxuICAgICAgICBfcm91dGVzLFxuICAgICAgICBbcm91dGVOYW1lLCByb3V0ZVNldHRpbmdzXSkgPT4ge1xuICAgICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IChcbiAgICAgICAgICAgIHJvdXRlTmFtZS5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICAgIHJvdXRlTmFtZS5tYXRjaCgvXlxcLy8pXG4gICAgICAgICAgKSA/IFtyb3V0ZU5hbWVdXG4gICAgICAgICAgICA6IChyb3V0ZU5hbWUubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICA/IFsnJ11cbiAgICAgICAgICAgICAgOiByb3V0ZU5hbWVcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICAgICAgICByb3V0ZVNldHRpbmdzLmZyYWdtZW50cyA9IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgICAgX3JvdXRlc1tyb3V0ZUZyYWdtZW50cy5qb2luKCcvJyldID0gcm91dGVTZXR0aW5nc1xuICAgICAgICAgIHJldHVybiBfcm91dGVzXG4gICAgICAgIH0sXG4gICAgICAgIHt9XG4gICAgICApXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMocm91dGVzKVxuICAgICAgLmZpbmQoKHJvdXRlKSA9PiB7XG4gICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IHJvdXRlLmZyYWdtZW50c1xuICAgICAgICBsZXQgbG9jYXRpb25GcmFnbWVudHMgPSAodGhpcy5oYXNoUm91dGluZylcbiAgICAgICAgICA/IGxvY2F0aW9uLmhhc2guZnJhZ21lbnRzXG4gICAgICAgICAgOiBsb2NhdGlvbi5wYXRoLmZyYWdtZW50c1xuICAgICAgICBsZXQgbWF0Y2hSb3V0ZSA9IHRoaXMubWF0Y2hSb3V0ZShcbiAgICAgICAgICByb3V0ZUZyYWdtZW50cyxcbiAgICAgICAgICBsb2NhdGlvbkZyYWdtZW50cyxcbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gbWF0Y2hSb3V0ZSA9PT0gdHJ1ZVxuICAgICAgfSlcbiAgfVxuICBwb3BTdGF0ZShldmVudCkge1xuICAgIGxldCBsb2NhdGlvbiA9IHRoaXMubG9jYXRpb25cbiAgICBsZXQgcm91dGUgPSB0aGlzLmdldFJvdXRlKGxvY2F0aW9uKVxuICAgIGxldCByb3V0ZURhdGEgPSB7XG4gICAgICByb3V0ZTogcm91dGUsXG4gICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgfVxuICAgIGlmKHJvdXRlKSB7XG4gICAgICB0aGlzLmNvbnRyb2xsZXJbcm91dGUuY2FsbGJhY2tdKHJvdXRlRGF0YSlcbiAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJywge1xuICAgICAgICBuYW1lOiAnY2hhbmdlJyxcbiAgICAgICAgZGF0YTogcm91dGVEYXRhLFxuICAgICAgfSxcbiAgICAgIHRoaXMpXG4gICAgfVxuICB9XG4gIGFkZFdpbmRvd0V2ZW50cygpIHtcbiAgICB3aW5kb3cub24oJ3BvcHN0YXRlJywgdGhpcy5wb3BTdGF0ZS5iaW5kKHRoaXMpKVxuICB9XG4gIHJlbW92ZVdpbmRvd0V2ZW50cygpIHtcbiAgICB3aW5kb3cub2ZmKCdwb3BzdGF0ZScsIHRoaXMucG9wU3RhdGUuYmluZCh0aGlzKSlcbiAgfVxuICBuYXZpZ2F0ZShwYXRoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFJvdXRlclxuIiwiaW1wb3J0ICcuL1NoaW1zL2V2ZW50cydcbmltcG9ydCBFdmVudHMgZnJvbSAnLi9FdmVudHMvaW5kZXgnXG5pbXBvcnQgQ2hhbm5lbHMgZnJvbSAnLi9DaGFubmVscy9pbmRleCdcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vVXRpbHMvaW5kZXgnXG5pbXBvcnQgU2VydmljZSBmcm9tICcuL1NlcnZpY2UvaW5kZXgnXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi9Nb2RlbC9pbmRleCdcbmltcG9ydCBDb2xsZWN0aW9uIGZyb20gJy4vQ29sbGVjdGlvbi9pbmRleCdcbmltcG9ydCBWaWV3IGZyb20gJy4vVmlldy9pbmRleCdcbmltcG9ydCBDb250cm9sbGVyIGZyb20gJy4vQ29udHJvbGxlci9pbmRleCdcbmltcG9ydCBSb3V0ZXIgZnJvbSAnLi9Sb3V0ZXIvaW5kZXgnXG5jb25zdCBNVkMgPSB7XG4gIEV2ZW50cyxcbiAgQ2hhbm5lbHMsXG4gIFV0aWxzLFxuICBTZXJ2aWNlLFxuICBNb2RlbCxcbiAgQ29sbGVjdGlvbixcbiAgVmlldyxcbiAgQ29udHJvbGxlcixcbiAgUm91dGVyLFxufVxuZXhwb3J0IGRlZmF1bHQgTVZDXG4iXSwibmFtZXMiOlsiRXZlbnRUYXJnZXQiLCJwcm90b3R5cGUiLCJvbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJvZmYiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiRXZlbnRzIiwiY29uc3RydWN0b3IiLCJfZXZlbnRzIiwiZXZlbnRzIiwiZ2V0RXZlbnRDYWxsYmFja3MiLCJldmVudE5hbWUiLCJnZXRFdmVudENhbGxiYWNrTmFtZSIsImV2ZW50Q2FsbGJhY2siLCJuYW1lIiwibGVuZ3RoIiwiZ2V0RXZlbnRDYWxsYmFja0dyb3VwIiwiZXZlbnRDYWxsYmFja3MiLCJldmVudENhbGxiYWNrTmFtZSIsImV2ZW50Q2FsbGJhY2tHcm91cCIsInB1c2giLCJhcmd1bWVudHMiLCJPYmplY3QiLCJrZXlzIiwiZW1pdCIsImV2ZW50RGF0YSIsIl9hcmd1bWVudHMiLCJ2YWx1ZXMiLCJlbnRyaWVzIiwiZXZlbnRDYWxsYmFja0dyb3VwTmFtZSIsImFkZGl0aW9uYWxBcmd1bWVudHMiLCJzcGxpY2UiLCJfcmVzcG9uc2VzIiwicmVzcG9uc2VzIiwicmVzcG9uc2UiLCJyZXNwb25zZU5hbWUiLCJyZXNwb25zZUNhbGxiYWNrIiwicmVxdWVzdCIsIkFycmF5Iiwic2xpY2UiLCJjYWxsIiwiX3Jlc3BvbnNlTmFtZSIsIl9jaGFubmVscyIsImNoYW5uZWxzIiwiY2hhbm5lbCIsImNoYW5uZWxOYW1lIiwiQ2hhbm5lbCIsIlVVSUQiLCJ1dWlkIiwiaSIsInJhbmRvbSIsIk1hdGgiLCJ0b1N0cmluZyIsIkJhc2UiLCJzZXR0aW5ncyIsImNvbmZpZ3VyYXRpb24iLCJfY29uZmlndXJhdGlvbiIsIl9zZXR0aW5ncyIsImFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzIiwiYWRkQ2xhc3NEZWZhdWx0UHJvcGVydGllcyIsIl91dWlkIiwiTVZDIiwiVXRpbHMiLCJfbmFtZSIsImNsYXNzRGVmYXVsdFByb3BlcnRpZXMiLCJjb25jYXQiLCJnZXRCaW5kYWJsZUNsYXNzUHJvcGVydGllc05hbWVzIiwiZm9yRWFjaCIsInNldHRpbmdLZXkiLCJzZXR0aW5nVmFsdWUiLCJpbmRleE9mIiwiZGVmaW5lUHJvcGVydHkiLCJnZXQiLCJzZXQiLCJ2YWx1ZSIsIl91aUVsZW1lbnRTZXR0aW5ncyIsInVpRWxlbWVudFNldHRpbmdzIiwiYmluZGFibGVDbGFzc1Byb3BlcnRpZXMiLCJyZWR1Y2UiLCJfYmluZGFibGVDbGFzc1Byb3BlcnRpZXNOYW1lcyIsImJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUiLCJnZXRCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lcyIsImNhcGl0YWxpemVQcm9wZXJ0eU5hbWUiLCJyZXBsYWNlIiwiZmlyc3RDaGFyYWN0ZXIiLCJzdWJzdHJpbmciLCJ0b1VwcGVyQ2FzZSIsImNsYXNzRGVmYXVsdFByb3BlcnR5IiwiY2xhc3NEZWZhdWx0UHJvcGVydHlJbmRleCIsImN1cnJlbnRQcm9wZXJ0eVZhbHVlIiwid3JpdGFibGUiLCJiaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2RzIiwiYmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kIiwiYmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kSW5kZXgiLCJhZGRCaW5kYWJsZUNsYXNzUHJvcGVydHkiLCJ0b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzIiwiY29udGV4dCIsImFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUiLCJyZW1vdmVCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lIiwiY3VycmVudFByb3BlcnR5VmFsdWVzIiwiZGVmaW5lUHJvcGVydGllcyIsIl92YWx1ZXMiLCJpbmRleCIsImtleSIsImNvbmZpZ3VyYWJsZSIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwicmVzZXRUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzIiwiY2xhc3NUeXBlIiwibWV0aG9kIiwiY2xhc3NUeXBlRXZlbnREYXRhIiwiY2xhc3NUeXBlQ2FsbGJhY2tOYW1lIiwic3BsaXQiLCJjbGFzc1R5cGVUYXJnZXROYW1lIiwiY2xhc3NUeXBlRXZlbnROYW1lIiwiY2xhc3NUeXBlVGFyZ2V0IiwiY2xhc3NUeXBlRXZlbnRDYWxsYmFjayIsImJpbmQiLCJ0b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnQiLCJlcnJvciIsIlJlZmVyZW5jZUVycm9yIiwiTm9kZUxpc3QiLCJmcm9tIiwiX2NsYXNzVHlwZVRhcmdldCIsIkhUTUxFbGVtZW50IiwiU2VydmljZSIsIl9kZWZhdWx0cyIsImRlZmF1bHRzIiwiY29udGVudFR5cGUiLCJyZXNwb25zZVR5cGUiLCJfYXN5bmMiLCJhc3luYyIsIl9yZXNwb25zZVR5cGVzIiwiX3Jlc3BvbnNlVHlwZSIsIl94aHIiLCJmaW5kIiwicmVzcG9uc2VUeXBlSXRlbSIsIl90eXBlIiwidHlwZSIsIl9wYXJhbWV0ZXJzIiwicGFyYW1ldGVycyIsIl91cmwiLCJ1cmwiLCJfaGVhZGVycyIsImhlYWRlcnMiLCJfZGF0YSIsImRhdGEiLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsInN0cmluZ1BhcmFtZXRlcnMiLCJwYXJhbWV0ZXJTdHJpbmciLCJwYXJhbWV0ZXJJbmRleCIsInBhcmFtZXRlcktleSIsInBhcmFtZXRlclZhbHVlIiwiY29uY2F0ZW5hdG9yIiwiYXNzaWdubWVudE9wZXJhdG9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbmxvYWQiLCJvbmVycm9yIiwib3BlbiIsImhlYWRlciIsInNldFJlcXVlc3RIZWFkZXIiLCJzZW5kIiwidGhlbiIsImN1cnJlbnRUYXJnZXQiLCJjYXRjaCIsIk1vZGVsIiwic3RvcmFnZUNvbnRhaW5lciIsImRlZmF1bHRJREF0dHJpYnV0ZSIsIl9pZEF0dHJpYnV0ZSIsImlkQXR0cmlidXRlIiwiX2lzU2V0dGluZyIsImlzU2V0dGluZyIsIl9zaWxlbnQiLCJzaWxlbnQiLCJfY2hhbmdpbmciLCJjaGFuZ2luZyIsIl9sb2NhbFN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJfaGlzdGlvZ3JhbSIsImhpc3Rpb2dyYW0iLCJhc3NpZ24iLCJfaGlzdG9yeSIsImhpc3RvcnkiLCJ1bnNoaWZ0IiwicGFyc2UiLCJkYiIsIl9kYiIsImdldEl0ZW0iLCJlbmRwb2ludCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzZXRJdGVtIiwic2V0RGF0YVByb3BlcnR5IiwidW5zZXQiLCJ1bnNldERhdGFQcm9wZXJ0eSIsInNldERCIiwidW5zZXREQiIsInNldFZhbHVlRXZlbnROYW1lIiwiam9pbiIsInNldEV2ZW50TmFtZSIsInVuc2V0VmFsdWVFdmVudE5hbWUiLCJ1bnNldEV2ZW50TmFtZSIsInVuc2V0VmFsdWUiLCJDb2xsZWN0aW9uIiwiX21vZGVscyIsIm1vZGVscyIsIm1vZGVsc0RhdGEiLCJfbW9kZWwiLCJtb2RlbCIsIm1hcCIsImdldE1vZGVsSW5kZXgiLCJtb2RlbFVVSUQiLCJtb2RlbEluZGV4IiwiX21vZGVsSW5kZXgiLCJyZW1vdmVNb2RlbEJ5SW5kZXgiLCJhZGRNb2RlbCIsIm1vZGVsRGF0YSIsImV2ZW50IiwiYWRkIiwiaXNBcnJheSIsIl9tb2RlbERhdGEiLCJyZW1vdmUiLCJmaWx0ZXIiLCJyZXNldCIsIlZpZXciLCJfZWxlbWVudE5hbWUiLCJfZWxlbWVudCIsInRhZ05hbWUiLCJlbGVtZW50TmFtZSIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImVsZW1lbnRPYnNlcnZlciIsIm9ic2VydmUiLCJzdWJ0cmVlIiwiY2hpbGRMaXN0IiwiX2F0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJfZWxlbWVudE9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsImVsZW1lbnRPYnNlcnZlIiwiX2luc2VydCIsImluc2VydCIsIl90ZW1wbGF0ZXMiLCJ0ZW1wbGF0ZXMiLCJtdXRhdGlvblJlY29yZExpc3QiLCJvYnNlcnZlciIsIm11dGF0aW9uUmVjb3JkSW5kZXgiLCJtdXRhdGlvblJlY29yZCIsImF1dG9JbnNlcnQiLCJwYXJlbnQiLCJpbnNlcnRBZGphY2VudEVsZW1lbnQiLCJhdXRvUmVtb3ZlIiwicGFyZW50RWxlbWVudCIsInJlbW92ZUNoaWxkIiwiQ29udHJvbGxlciIsIlJvdXRlciIsImFkZFdpbmRvd0V2ZW50cyIsInByb3RvY29sIiwid2luZG93IiwibG9jYXRpb24iLCJob3N0bmFtZSIsInBvcnQiLCJwYXRobmFtZSIsInBhdGgiLCJzdHJpbmciLCJSZWdFeHAiLCJyb290IiwiZnJhZ21lbnRzIiwibWF0Y2giLCJoYXNoIiwiaHJlZiIsInBhcmFtZXRlciIsInBhcmFtZXRlckRhdGEiLCJfcm9vdCIsIl9oYXNoUm91dGluZyIsImhhc2hSb3V0aW5nIiwiX3JvdXRlcyIsInJvdXRlcyIsIl9jb250cm9sbGVyIiwiY29udHJvbGxlciIsIm1hdGNoUm91dGUiLCJyb3V0ZUZyYWdtZW50cyIsImxvY2F0aW9uRnJhZ21lbnRzIiwicm91dGVNYXRjaGVzIiwiX3JvdXRlTWF0Y2hlcyIsInJvdXRlRnJhZ21lbnQiLCJyb3V0ZUZyYWdtZW50SW5kZXgiLCJsb2NhdGlvbkZyYWdtZW50IiwiZ2V0Um91dGUiLCJyb3V0ZU5hbWUiLCJyb3V0ZVNldHRpbmdzIiwicm91dGUiLCJwb3BTdGF0ZSIsInJvdXRlRGF0YSIsImNhbGxiYWNrIiwicmVtb3ZlV2luZG93RXZlbnRzIiwibmF2aWdhdGUiLCJDaGFubmVscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0VBQUFBLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIsR0FBMkJGLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIsSUFBNEJGLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkUsZ0JBQTdFO0VBQ0FILFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkcsR0FBdEIsR0FBNEJKLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkcsR0FBdEIsSUFBNkJKLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkksbUJBQS9FOztFQ0RBLE1BQU1DLE1BQU4sQ0FBYTtFQUNYQyxFQUFBQSxXQUFXLEdBQUc7O0VBQ2QsTUFBSUMsT0FBSixHQUFjO0VBQ1osU0FBS0MsTUFBTCxHQUFjLEtBQUtBLE1BQUwsSUFBZSxFQUE3QjtFQUNBLFdBQU8sS0FBS0EsTUFBWjtFQUNEOztFQUNEQyxFQUFBQSxpQkFBaUIsQ0FBQ0MsU0FBRCxFQUFZO0VBQUUsV0FBTyxLQUFLSCxPQUFMLENBQWFHLFNBQWIsS0FBMkIsRUFBbEM7RUFBc0M7O0VBQ3JFQyxFQUFBQSxvQkFBb0IsQ0FBQ0MsYUFBRCxFQUFnQjtFQUNsQyxXQUFRQSxhQUFhLENBQUNDLElBQWQsQ0FBbUJDLE1BQXBCLEdBQ0hGLGFBQWEsQ0FBQ0MsSUFEWCxHQUVILG1CQUZKO0VBR0Q7O0VBQ0RFLEVBQUFBLHFCQUFxQixDQUFDQyxjQUFELEVBQWlCQyxpQkFBakIsRUFBb0M7RUFDdkQsV0FBT0QsY0FBYyxDQUFDQyxpQkFBRCxDQUFkLElBQXFDLEVBQTVDO0VBQ0Q7O0VBQ0RoQixFQUFBQSxFQUFF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
