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
      this._configuration = configuration;
      this.addClassDefaultProperties();
      this.addBindableClassProperties();
      this._settings = settings;
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
                  Object.defineProperty(context['_'.concat(bindableClassPropertyName)], [key], {
                    configurable: true,

                    get() {
                      return context.element.querySelectorAll(value);
                    }

                  });
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

    stringParameters() {
      var parameters = Object.entries(this._parameters);
      return parameters.reduce((parameterString, _ref, parameterIndex) => {
        var [parameterKey, parameterValue] = _ref;
        var concatenator = parameterIndex !== parameters.length - 1 ? '&' : '';
        var assignmentOperator = '=';
        parameterString = parameterString.concat(parameterKey, assignmentOperator, parameterValue, concatenator);
        return parameterString;
      }, '?');
    }

    request() {
      var url = this._url.concat(this.stringParameters());

      return new Promise((resolve, reject) => {
        if (this._xhr.status === 200) this._xhr.abort();

        this._xhr.open(this.type, url);

        this._headers = this.settings.headers || [this._defaults.contentType];
        this._xhr.onload = resolve;
        this._xhr.onerror = reject;

        this._xhr.send(this.data);
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
      this.set(defaults);
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
                console.log('silent', context.silent);
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
                    console.log('silent', context.silent);
                    context.emit(setEventName, {
                      name: setEventName,
                      data: Object.assign({}, context._data)
                    }, context);
                  }
                } else {
                  if (context.silent !== true) {
                    console.log('silent', context.silent);
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
      console.log('unset');
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
      this.models = modelsData.map(modelData => {
        var model = new this.model();
        model.set(modelData);
        return model;
      });
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

    getModelIndex(modelID) {
      var modelIndex;

      this._models.find((_model, _modelIndex) => {
        if (_model !== null) {
          if (_model instanceof Model && _model.get(this._idAttribute) === modelID) {
            modelIndex = _modelIndex;
            return _model;
          } else if (_model[this._idAttribute] === modelID) {
            modelIndex = _modelIndex;
            return _model;
          }
        }
      });

      return modelIndex;
    }

    getModelID(model) {
      return model instanceof Model ? model.get(this._idAttribute) : model[this._idAttribute];
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
      } else if (typeof modelData !== null && typeof modelData === 'object') {
        model = new this.model();
        model.set(modelData);
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
        this.removeModelByIndex(this.getModelIndex(this.getModelID(modelData)));
      } else if (Array.isArray(modelData)) {
        modelData.map(model => {
          this.removeModelByIndex(this.getModelIndex(this.getModelID(model)));
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

  var MVC = {
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

  return MVC;

})));
