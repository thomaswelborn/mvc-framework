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

  class Service extends Base {
    constructor() {
      super(...arguments);
    }

    get classDefaultProperties() {
      return ['responseType', 'type', 'url', 'headers', 'data'];
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
      return new Promise((resolve, reject) => {
        if (this._xhr.status === 200) this._xhr.abort();

        this._xhr.open(this.type, this.url);

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
      return ['localStorage', 'histiogram', 'defaults'];
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
      return ['model', 'defaults'];
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
        if (_model.get(_model.idAttribute) === modelID) {
          modelIndex = _modelIndex;
          return _model;
        }
      });

      return modelIndex;
    }

    removeModelByIndex(modelIndex) {
      var model = this._models.splice(modelIndex, 1);

      this.emit('removeModel', {
        name: 'removeModel'
      }, model, this);
      return this;
    }

    addModel(modelData) {
      var model;

      if (modelData instanceof Model) {
        model = modelData;

        this._models.push(model);
      } else if (!Array.isArray(modelData) && typeof modelData !== null && typeof modelData === 'object') {
        model = new this.model();
        model.set(modelData);

        this._models.push(model);
      }

      this.emit('addModel', {
        name: 'addModel'
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

      if (typeof modelData === 'string' || typeof modelData === 'number') {
        this.removeModelByIndex(this.getModelIndex(modelData));
      } else if (modelData instanceof Model) {
        this.removeModelByIndex(this.getModelIndex(model[model.defaultIDAttribute]));
      } else if (Array.isArray(modelData)) {
        modelData.forEach(model => {
          if (typeof modelData === 'string' || typeof modelData === 'number') {
            this.removeModelByIndex(this.getModelIndex(modelData));
          } else if (modelData instanceof Model) {
            this.removeModelByIndex(this.getModelIndex(model[model.defaultIDAttribute]));
          }
        });
      }

      this._isSetting = false;
      this.emit('change', {
        name: 'change',
        data: this._data
      }, this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL3R5cGVPZi5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVXRpbHMvdWlkLmpzIiwiLi4vLi4vc291cmNlL01WQy9CYXNlL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9TZXJ2aWNlL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Nb2RlbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29sbGVjdGlvbi9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVmlldy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29udHJvbGxlci9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvUm91dGVyL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJFdmVudFRhcmdldC5wcm90b3R5cGUub24gPSBFdmVudFRhcmdldC5wcm90b3R5cGUub24gfHwgRXZlbnRUYXJnZXQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXJcclxuRXZlbnRUYXJnZXQucHJvdG90eXBlLm9mZiA9IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vZmYgfHwgRXZlbnRUYXJnZXQucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXJcclxuIiwiY2xhc3MgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9ldmVudHMoKSB7XHJcbiAgICB0aGlzLmV2ZW50cyA9IHRoaXMuZXZlbnRzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5ldmVudHNcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKSB7IHJldHVybiB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSB8fCB7fSB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIChldmVudENhbGxiYWNrLm5hbWUubGVuZ3RoKVxyXG4gICAgICA/IGV2ZW50Q2FsbGJhY2submFtZVxyXG4gICAgICA6ICdhbm9ueW1vdXNGdW5jdGlvbidcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSkge1xyXG4gICAgcmV0dXJuIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSB8fCBbXVxyXG4gIH1cclxuICBvbihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tOYW1lID0gdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tHcm91cCA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSlcclxuICAgIGV2ZW50Q2FsbGJhY2tHcm91cC5wdXNoKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gPSBldmVudENhbGxiYWNrR3JvdXBcclxuICAgIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdID0gZXZlbnRDYWxsYmFja3NcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIG9mZigpIHtcclxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIGNhc2UgMDpcclxuICAgICAgICBkZWxldGUgdGhpcy5ldmVudHNcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2sgPSBhcmd1bWVudHNbMV1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFja05hbWUgPSAodHlwZW9mIGV2ZW50Q2FsbGJhY2sgPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgPyBldmVudENhbGxiYWNrXHJcbiAgICAgICAgICA6IHRoaXMuZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgICAgICBpZih0aGlzLl9ldmVudHNbZXZlbnROYW1lXSkge1xyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdW2V2ZW50Q2FsbGJhY2tOYW1lXVxyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKS5sZW5ndGggPT09IDBcclxuICAgICAgICAgICkgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBlbWl0KGV2ZW50TmFtZSwgZXZlbnREYXRhKSB7XHJcbiAgICBsZXQgX2FyZ3VtZW50cyA9IE9iamVjdC52YWx1ZXMoYXJndW1lbnRzKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gT2JqZWN0LmVudHJpZXMoXHJcbiAgICAgIHRoaXMuZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgKVxyXG4gICAgZm9yKGxldCBbZXZlbnRDYWxsYmFja0dyb3VwTmFtZSwgZXZlbnRDYWxsYmFja0dyb3VwXSBvZiBldmVudENhbGxiYWNrcykge1xyXG4gICAgICBmb3IobGV0IGV2ZW50Q2FsbGJhY2sgb2YgZXZlbnRDYWxsYmFja0dyb3VwKSB7XHJcbiAgICAgICAgbGV0IGFkZGl0aW9uYWxBcmd1bWVudHMgPSBfYXJndW1lbnRzLnNwbGljZSgyKSB8fCBbXVxyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2soZXZlbnREYXRhLCAuLi5hZGRpdGlvbmFsQXJndW1lbnRzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBFdmVudHNcclxuIiwiY29uc3QgQ2hhbm5lbCA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9yZXNwb25zZXMoKSB7XHJcbiAgICB0aGlzLnJlc3BvbnNlcyA9IHRoaXMucmVzcG9uc2VzIHx8IHRoaXMucmVzcG9uc2VzXHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZihyZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdID0gcmVzcG9uc2VDYWxsYmFja1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZV1cclxuICAgIH1cclxuICB9XHJcbiAgcmVxdWVzdChyZXNwb25zZU5hbWUpIHtcclxuICAgIGlmKHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKSB7XHJcbiAgICAgIGxldCBfYXJndW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5zbGljZSgxKVxyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0oLi4uX2FyZ3VtZW50cylcclxuICAgIH1cclxuICB9XHJcbiAgb2ZmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yKGxldCBbcmVzcG9uc2VOYW1lXSBvZiBPYmplY3Qua2V5cyh0aGlzLl9yZXNwb25zZXMpKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQ2hhbm5lbFxyXG4iLCJpbXBvcnQgQ2hhbm5lbCBmcm9tICcuL0NoYW5uZWwvaW5kZXgnXHJcbmNvbnN0IENoYW5uZWxzID0gY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2NoYW5uZWxzKCkge1xyXG4gICAgdGhpcy5jaGFubmVscyA9IHRoaXMuY2hhbm5lbHMgfHwge31cclxuICAgIHJldHVybiB0aGlzLmNoYW5uZWxzXHJcbiAgfVxyXG4gIGNoYW5uZWwoY2hhbm5lbE5hbWUpIHtcclxuICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXSA9ICh0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0pXHJcbiAgICAgID8gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgIDogbmV3IENoYW5uZWwoKVxyXG4gICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxuICBvZmYoY2hhbm5lbE5hbWUpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQ2hhbm5lbHNcclxuIiwiY29uc3QgdHlwZU9mID0gZnVuY3Rpb24gdHlwZU9mKGRhdGEpIHtcclxuICBzd2l0Y2godHlwZW9mIGRhdGEpIHtcclxuICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgIGxldCBfb2JqZWN0XHJcbiAgICAgIGlmKFxyXG4gICAgICAgIEFycmF5LmlzQXJyYXkoZGF0YSlcclxuICAgICAgKSB7XHJcbiAgICAgICAgcmV0dXJuICdhcnJheSdcclxuICAgICAgfSBlbHNlIGlmKFxyXG4gICAgICAgIGRhdGEgIT09IG51bGxcclxuICAgICAgKSB7XHJcbiAgICAgICAgcmV0dXJuICdvYmplY3QnXHJcbiAgICAgIH0gZWxzZSBpZihcclxuICAgICAgICBkYXRhID09PSBudWxsXHJcbiAgICAgICkge1xyXG4gICAgICAgIHJldHVybiAnbnVsbCdcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gX29iamVjdFxyXG4gICAgY2FzZSAnc3RyaW5nJzpcclxuICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICBjYXNlICdib29sZWFuJzpcclxuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XHJcbiAgICBjYXNlICdmdW5jdGlvbic6XHJcbiAgICAgIHJldHVybiB0eXBlb2YgZGF0YVxyXG4gICAgICBicmVha1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCB0eXBlT2ZcclxuIiwiY29uc3QgVUlEID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciB1dWlkID0gJycsIGlpXHJcbiAgZm9yIChpaSA9IDA7IGlpIDwgMzI7IGlpICs9IDEpIHtcclxuICAgIHN3aXRjaCAoaWkpIHtcclxuICAgICAgY2FzZSA4OlxyXG4gICAgICBjYXNlIDIwOlxyXG4gICAgICAgIHV1aWQgKz0gJy0nO1xyXG4gICAgICAgIHV1aWQgKz0gKE1hdGgucmFuZG9tKCkgKiAxNiB8IDApLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMTI6XHJcbiAgICAgICAgdXVpZCArPSAnLSdcclxuICAgICAgICB1dWlkICs9ICc0J1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMTY6XHJcbiAgICAgICAgdXVpZCArPSAnLSdcclxuICAgICAgICB1dWlkICs9IChNYXRoLnJhbmRvbSgpICogNCB8IDgpLnRvU3RyaW5nKDE2KVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgdXVpZCArPSAoTWF0aC5yYW5kb20oKSAqIDE2IHwgMCkudG9TdHJpbmcoMTYpXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB1dWlkXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgVUlEXHJcbiIsImltcG9ydCB7IFVJRCB9IGZyb20gJy4uL1V0aWxzL2luZGV4J1xyXG5pbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleCdcclxuXHJcbmNsYXNzIEJhc2UgZXh0ZW5kcyBFdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzLCBjb25maWd1cmF0aW9uKSB7XHJcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXHJcbiAgICB0aGlzLmFkZENsYXNzRGVmYXVsdFByb3BlcnRpZXMoKVxyXG4gICAgdGhpcy5hZGRCaW5kYWJsZUNsYXNzUHJvcGVydGllcygpXHJcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgICB0aGlzLl9jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvblxyXG4gIH1cclxuICBnZXQgdWlkKCkge1xyXG4gICAgdGhpcy5fdWlkID0gKHRoaXMuX3VpZClcclxuICAgID8gdGhpcy5fdWlkXHJcbiAgICA6IFVJRCgpXHJcbiAgICByZXR1cm4gdGhpcy5fdWlkXHJcbiAgfVxyXG4gIGdldCBfbmFtZSgpIHsgcmV0dXJuIHRoaXMubmFtZSB9XHJcbiAgc2V0IF9uYW1lKG5hbWUpIHsgdGhpcy5uYW1lID0gbmFtZSB9XHJcbiAgZ2V0IF9zZXR0aW5ncygpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5nc1xyXG4gIH1cclxuICBzZXQgX3NldHRpbmdzKHNldHRpbmdzKSB7XHJcbiAgICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzIHx8IHt9XHJcbiAgICAgdGhpcy5jbGFzc0RlZmF1bHRQcm9wZXJ0aWVzXHJcbiAgICAgICAuZm9yRWFjaCgoY2xhc3NTZXR0aW5nKSA9PiB7XHJcbiAgICAgICAgIGlmKHRoaXMuc2V0dGluZ3NbY2xhc3NTZXR0aW5nXSkge1xyXG4gICAgICAgICAgIHRoaXNbJ18nLmNvbmNhdChjbGFzc1NldHRpbmcpXSA9IHRoaXMuc2V0dGluZ3NbY2xhc3NTZXR0aW5nXVxyXG4gICAgICAgICB9XHJcbiAgICAgICB9KVxyXG4gICAgIE9iamVjdC5rZXlzKHRoaXMuc2V0dGluZ3MpXHJcbiAgICAgICAuZm9yRWFjaCgoc2V0dGluZ0tleSkgPT4ge1xyXG4gICAgICAgICBpZih0aGlzLmNsYXNzRGVmYXVsdFByb3BlcnRpZXMuaW5kZXhPZihzZXR0aW5nS2V5KSA9PT0gLTEpIHtcclxuICAgICAgICAgICB0aGlzW3NldHRpbmdLZXldID0gdGhpcy5zZXR0aW5nc1tzZXR0aW5nS2V5XVxyXG4gICAgICAgICB9XHJcbiAgICAgICB9KVxyXG4gIH1cclxuICBnZXQgX2NvbmZpZ3VyYXRpb24oKSB7XHJcbiAgICB0aGlzLmNvbmZpZ3VyYXRpb24gPSB0aGlzLmNvbmZpZ3VyYXRpb24gfHwge31cclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25cclxuICB9XHJcbiAgc2V0IF9jb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHsgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbiB9XHJcbiAgZ2V0IF91aUVsZW1lbnRTZXR0aW5ncygpIHtcclxuICAgIHRoaXMudWlFbGVtZW50U2V0dGluZ3MgPSB0aGlzLnVpRWxlbWVudFNldHRpbmdzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy51aUVsZW1lbnRTZXR0aW5nc1xyXG4gIH1cclxuICBzZXQgX3VpRWxlbWVudFNldHRpbmdzKHVpRWxlbWVudFNldHRpbmdzKSB7XHJcbiAgICB0aGlzLnVpRWxlbWVudFNldHRpbmdzID0gdWlFbGVtZW50U2V0dGluZ3NcclxuICB9XHJcbiAgZ2V0QmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kcyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSB7XHJcbiAgICBzd2l0Y2goYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgICBjYXNlICdkYXRhJzpcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJycpLFxyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ0V2ZW50cycpLFxyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ0NhbGxiYWNrcycpXHJcbiAgICAgICAgXVxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICBiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLmNvbmNhdCgncycpLFxyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ0V2ZW50cycpLFxyXG4gICAgICAgICAgYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZS5jb25jYXQoJ0NhbGxiYWNrcycpXHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG4gIH1cclxuICBjYXBpdGFsaXplUHJvcGVydHlOYW1lKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpIHtcclxuICAgIGlmKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUuc2xpY2UoMCwgMikgPT09ICd1aScpIHtcclxuICAgICAgcmV0dXJuIGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUucmVwbGFjZSgvXnVpLywgJ1VJJylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxldCBmaXJzdENoYXJhY3RlciA9IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUuc3Vic3RyaW5nKDAsIDEpLnRvVXBwZXJDYXNlKClcclxuICAgICAgcmV0dXJuIGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUucmVwbGFjZSgvXi4vLCBmaXJzdENoYXJhY3RlcilcclxuICAgIH1cclxuICB9XHJcbiAgYWRkQ2xhc3NEZWZhdWx0UHJvcGVydGllcygpIHtcclxuICAgIHRoaXMuY2xhc3NEZWZhdWx0UHJvcGVydGllc1xyXG4gICAgICAuZm9yRWFjaCgoY2xhc3NEZWZhdWx0UHJvcGVydHksIGNsYXNzRGVmYXVsdFByb3BlcnR5SW5kZXgpID0+IHtcclxuICAgICAgICBpZih0aGlzW2NsYXNzRGVmYXVsdFByb3BlcnR5XSkge1xyXG4gICAgICAgICAgbGV0IHByb3BlcnR5ID0gdGhpc1tjbGFzc0RlZmF1bHRQcm9wZXJ0eV1cclxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBjbGFzc0RlZmF1bHRQcm9wZXJ0eSwge1xyXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmFsdWU6IHByb3BlcnR5XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgdGhpc1snXycuY29uY2F0KGNsYXNzRGVmYXVsdFByb3BlcnR5KV0gPSBwcm9wZXJ0eVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGFkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKCkge1xyXG4gICAgaWYodGhpcy5iaW5kYWJsZUNsYXNzUHJvcGVydGllcykge1xyXG4gICAgICB0aGlzLmJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzXHJcbiAgICAgICAgLmZvckVhY2goKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpID0+IHtcclxuICAgICAgICAgIGxldCBiaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2RzID0gdGhpcy5nZXRCaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2RzKFxyXG4gICAgICAgICAgICBiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICBiaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2RzXHJcbiAgICAgICAgICAgIC5mb3JFYWNoKChiaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2QsIGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU1ldGhvZEluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5hZGRCaW5kYWJsZUNsYXNzUHJvcGVydHkoYmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kKVxyXG4gICAgICAgICAgICAgIGlmKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU1ldGhvZEluZGV4ID09PSBiaW5kYWJsZUNsYXNzUHJvcGVydHlNZXRob2RzLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLCAnb24nKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgYWRkQmluZGFibGVDbGFzc1Byb3BlcnR5KGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpIHtcclxuICAgIGxldCBjb250ZXh0ID0gdGhpc1xyXG4gICAgbGV0IGNhcGl0YWxpemVQcm9wZXJ0eU5hbWUgPSB0aGlzLmNhcGl0YWxpemVQcm9wZXJ0eU5hbWUoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSlcclxuICAgIGxldCBhZGRCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lID0gJ2FkZCcuY29uY2F0KGNhcGl0YWxpemVQcm9wZXJ0eU5hbWUpXHJcbiAgICBsZXQgcmVtb3ZlQmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSA9ICdyZW1vdmUnLmNvbmNhdChjYXBpdGFsaXplUHJvcGVydHlOYW1lKVxyXG4gICAgaWYoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSA9PT0gJ3VpRWxlbWVudHMnKSB7XHJcbiAgICAgIGNvbnRleHQuX3VpRWxlbWVudFNldHRpbmdzID0gdGhpc1tiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXVxyXG4gICAgfVxyXG4gICAgbGV0IGN1cnJlbnRQcm9wZXJ0eVZhbHVlcyA9IHRoaXNbYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZV1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxyXG4gICAgICB0aGlzLFxyXG4gICAgICB7XHJcbiAgICAgICAgW2JpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdOiB7XHJcbiAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcclxuICAgICAgICAgIHZhbHVlOiBjdXJyZW50UHJvcGVydHlWYWx1ZXMsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV06IHtcclxuICAgICAgICAgIGdldCgpIHtcclxuICAgICAgICAgICAgY29udGV4dFtiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXSA9IGNvbnRleHRbYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZV0gfHwge31cclxuICAgICAgICAgICAgcmV0dXJuIGNvbnRleHRbYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZV1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzZXQodmFsdWVzKSB7XHJcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHZhbHVlcylcclxuICAgICAgICAgICAgICAuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2goYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICBjYXNlICd1aUVsZW1lbnRzJzpcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0Ll91aUVsZW1lbnRTZXR0aW5nc1trZXldID0gdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldW2tleV0gPSBjb250ZXh0LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh2YWx1ZSlcclxuICAgICAgICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV1ba2V5XSA9IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFthZGRCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lXToge1xyXG4gICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV0gPSB7XHJcbiAgICAgICAgICAgICAgICBba2V5XTogdmFsdWVcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgbGV0IHZhbHVlcyA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgICAgICAgIGNvbnRleHRbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV0gPSB2YWx1ZXNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlc2V0VGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKVxyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgW3JlbW92ZUJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdOiB7XHJcbiAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgICAgICAgc3dpdGNoKGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3VpRWxlbWVudHMnOlxyXG4gICAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dFsnXycuY29uY2F0KGJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUpXVtrZXldXHJcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQoJ3VpRWxlbWVudFNldHRpbmdzJyldW2tleV1cclxuICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldW2tleV1cclxuICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihhcmd1bWVudHMubGVuZ3RoID09PSAwKXtcclxuICAgICAgICAgICAgICBPYmplY3Qua2V5cyhjb250ZXh0WydfJy5jb25jYXQoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSldKVxyXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBzd2l0Y2goYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ3VpRWxlbWVudHMnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRleHRbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV1ba2V5XVxyXG4gICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRleHRbJ18nLmNvbmNhdCgndWlFbGVtZW50U2V0dGluZ3MnKV1ba2V5XVxyXG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGNvbnRleHRbJ18nLmNvbmNhdChiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKV1ba2V5XVxyXG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlc2V0VGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKVxyXG4gICAgICAgICAgICByZXR1cm4gY29udGV4dFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH1cclxuICAgIClcclxuICAgIGlmKGN1cnJlbnRQcm9wZXJ0eVZhbHVlcykge1xyXG4gICAgICB0aGlzW2FkZEJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWVdKGN1cnJlbnRQcm9wZXJ0eVZhbHVlcylcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHJlc2V0VGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lKSB7XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gICAgICAudG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhiaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lLCAnb2ZmJylcclxuICAgICAgLnRvZ2dsZVRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMoYmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSwgJ29uJylcclxuICB9XHJcbiAgdG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZCkge1xyXG4gICAgaWYoXHJcbiAgICAgIHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgncycpXSAmJlxyXG4gICAgICB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXSAmJlxyXG4gICAgICB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXVxyXG4gICAgKSB7XHJcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXNbY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJyldKVxyXG4gICAgICAgIC5mb3JFYWNoKChbY2xhc3NUeXBlRXZlbnREYXRhLCBjbGFzc1R5cGVDYWxsYmFja05hbWVdKSA9PiB7XHJcbiAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjbGFzc1R5cGVFdmVudERhdGEgPSBjbGFzc1R5cGVFdmVudERhdGEuc3BsaXQoJyAnKVxyXG4gICAgICAgICAgICBsZXQgY2xhc3NUeXBlVGFyZ2V0TmFtZSA9IGNsYXNzVHlwZUV2ZW50RGF0YVswXVxyXG4gICAgICAgICAgICBsZXQgY2xhc3NUeXBlRXZlbnROYW1lID0gY2xhc3NUeXBlRXZlbnREYXRhWzFdXHJcbiAgICAgICAgICAgIGxldCBjbGFzc1R5cGVUYXJnZXQgPSB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ3MnKV1bY2xhc3NUeXBlVGFyZ2V0TmFtZV1cclxuICAgICAgICAgICAgbGV0IGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2sgPSB0aGlzW2NsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXVtjbGFzc1R5cGVDYWxsYmFja05hbWVdLmJpbmQodGhpcylcclxuICAgICAgICAgICAgdGhpcy50b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnQoXHJcbiAgICAgICAgICAgICAgY2xhc3NUeXBlLFxyXG4gICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldCxcclxuICAgICAgICAgICAgICBjbGFzc1R5cGVFdmVudE5hbWUsXHJcbiAgICAgICAgICAgICAgY2xhc3NUeXBlRXZlbnRDYWxsYmFjayxcclxuICAgICAgICAgICAgICBtZXRob2RcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgfSBjYXRjaChlcnJvcikgeyB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXHJcbiAgICAgICAgICAgIGVycm9yXHJcbiAgICAgICAgICApIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgdG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50KFxyXG4gICAgY2xhc3NUeXBlLFxyXG4gICAgY2xhc3NUeXBlVGFyZ2V0LFxyXG4gICAgY2xhc3NUeXBlRXZlbnROYW1lLFxyXG4gICAgY2xhc3NUeXBlRXZlbnRDYWxsYmFjayxcclxuICAgIG1ldGhvZFxyXG4gICkge1xyXG4gICAgc3dpdGNoKG1ldGhvZCkge1xyXG4gICAgICBjYXNlICdvbic6XHJcbiAgICAgICAgc3dpdGNoKGNsYXNzVHlwZSkge1xyXG4gICAgICAgICAgY2FzZSAndWlFbGVtZW50JzpcclxuICAgICAgICAgICAgaWYoY2xhc3NUeXBlVGFyZ2V0IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcclxuICAgICAgICAgICAgICBBcnJheS5mcm9tKGNsYXNzVHlwZVRhcmdldClcclxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKChfY2xhc3NUeXBlVGFyZ2V0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIF9jbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoY2xhc3NUeXBlVGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICBjbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnb2ZmJzpcclxuICAgICAgICBzd2l0Y2goY2xhc3NUeXBlKSB7XHJcbiAgICAgICAgICBjYXNlICd1aUVsZW1lbnQnOlxyXG4gICAgICAgICAgICBpZihjbGFzc1R5cGVUYXJnZXQgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xyXG4gICAgICAgICAgICAgIEFycmF5LmZyb20oY2xhc3NUeXBlVGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKF9jbGFzc1R5cGVUYXJnZXQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgX2NsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihjbGFzc1R5cGVUYXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY2xhc3NUeXBlVGFyZ2V0W21ldGhvZF0oY2xhc3NUeXBlRXZlbnROYW1lLCBjbGFzc1R5cGVFdmVudENhbGxiYWNrKVxyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBCYXNlXHJcbiIsImltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNsYXNzIFNlcnZpY2UgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICdyZXNwb25zZVR5cGUnLFxuICAgICd0eXBlJyxcbiAgICAndXJsJyxcbiAgICAnaGVhZGVycycsXG4gICAgJ2RhdGEnXG4gIF0gfVxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5kZWZhdWx0cyB8fCB7XG4gICAgY29udGVudFR5cGU6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSxcbiAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgfSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlcygpIHsgcmV0dXJuIFsnJywgJ2FycmF5YnVmZmVyJywgJ2Jsb2InLCAnZG9jdW1lbnQnLCAnanNvbicsICd0ZXh0J10gfVxuICBnZXQgX3Jlc3BvbnNlVHlwZSgpIHsgcmV0dXJuIHRoaXMucmVzcG9uc2VUeXBlIH1cbiAgc2V0IF9yZXNwb25zZVR5cGUocmVzcG9uc2VUeXBlKSB7XG4gICAgdGhpcy5feGhyLnJlc3BvbnNlVHlwZSA9IHRoaXMuX3Jlc3BvbnNlVHlwZXMuZmluZChcbiAgICAgIChyZXNwb25zZVR5cGVJdGVtKSA9PiByZXNwb25zZVR5cGVJdGVtID09PSByZXNwb25zZVR5cGVcbiAgICApIHx8IHRoaXMuX2RlZmF1bHRzLnJlc3BvbnNlVHlwZVxuICB9XG4gIGdldCBfdHlwZSgpIHsgcmV0dXJuIHRoaXMudHlwZSB9XG4gIHNldCBfdHlwZSh0eXBlKSB7IHRoaXMudHlwZSA9IHR5cGUgfVxuICBnZXQgX3VybCgpIHsgcmV0dXJuIHRoaXMudXJsIH1cbiAgc2V0IF91cmwodXJsKSB7IHRoaXMudXJsID0gdXJsIH1cbiAgZ2V0IF9oZWFkZXJzKCkgeyByZXR1cm4gdGhpcy5oZWFkZXJzIHx8IFtdIH1cbiAgc2V0IF9oZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLl9oZWFkZXJzLmxlbmd0aCA9IDBcbiAgICBoZWFkZXJzLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgdGhpcy5faGVhZGVycy5wdXNoKGhlYWRlcilcbiAgICAgIGhlYWRlciA9IE9iamVjdC5lbnRyaWVzKGhlYWRlcilbMF1cbiAgICAgIHRoaXMuX3hoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgIH0pXG4gIH1cbiAgZ2V0IF9kYXRhKCkgeyByZXR1cm4gdGhpcy5kYXRhIH1cbiAgc2V0IF9kYXRhKGRhdGEpIHsgdGhpcy5kYXRhID0gZGF0YSB9XG4gIGdldCBfeGhyKCkge1xuICAgIHRoaXMueGhyID0gKHRoaXMueGhyKVxuICAgICAgPyB0aGlzLnhoclxuICAgICAgOiBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHJldHVybiB0aGlzLnhoclxuICB9XG4gIHJlcXVlc3QoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmKHRoaXMuX3hoci5zdGF0dXMgPT09IDIwMCkgdGhpcy5feGhyLmFib3J0KClcbiAgICAgIHRoaXMuX3hoci5vcGVuKHRoaXMudHlwZSwgdGhpcy51cmwpXG4gICAgICB0aGlzLl9oZWFkZXJzID0gdGhpcy5zZXR0aW5ncy5oZWFkZXJzIHx8IFt0aGlzLl9kZWZhdWx0cy5jb250ZW50VHlwZV1cbiAgICAgIHRoaXMuX3hoci5vbmxvYWQgPSByZXNvbHZlXG4gICAgICB0aGlzLl94aHIub25lcnJvciA9IHJlamVjdFxuICAgICAgdGhpcy5feGhyLnNlbmQodGhpcy5kYXRhKVxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICB0aGlzLmVtaXQoXG4gICAgICAgICd4aHJSZXNvbHZlJywge1xuICAgICAgICAgIG5hbWU6ICd4aHJSZXNvbHZlJyxcbiAgICAgICAgICBkYXRhOiByZXNwb25zZS5jdXJyZW50VGFyZ2V0LFxuICAgICAgICB9LFxuICAgICAgICB0aGlzXG4gICAgICApXG4gICAgICByZXR1cm4gcmVzcG9uc2VcbiAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHsgdGhyb3cgZXJyb3IgfSlcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgU2VydmljZVxuIiwiaW1wb3J0IEJhc2UgZnJvbSAnLi4vQmFzZS9pbmRleCdcblxuY2xhc3MgTW9kZWwgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBzdG9yYWdlQ29udGFpbmVyKCkgeyByZXR1cm4ge30gfVxuICBnZXQgZGVmYXVsdElEQXR0cmlidXRlKCkgeyByZXR1cm4gJ19pZCcgfVxuICBnZXQgYmluZGFibGVDbGFzc1Byb3BlcnRpZXMoKSB7IHJldHVybiBbXG4gICAgJ3NlcnZpY2UnXG4gIF0gfVxuICBnZXQgY2xhc3NEZWZhdWx0UHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAnbG9jYWxTdG9yYWdlJyxcbiAgICAnaGlzdGlvZ3JhbScsXG4gICAgJ2RlZmF1bHRzJ1xuICBdIH1cbiAgZ2V0IF9pZEF0dHJpYnV0ZSgpIHtcbiAgICB0aGlzLmlkQXR0cmlidXRlID0gdGhpcy5pZEF0dHJpYnV0ZSB8fCB0aGlzLmRlZmF1bHRJREF0dHJpYnV0ZVxuICAgIHJldHVybiB0aGlzLmlkQXR0cmlidXRlXG4gIH1cbiAgc2V0IF9pZEF0dHJpYnV0ZShpZEF0dHJpYnV0ZSkgeyB0aGlzLmlkQXR0cmlidXRlID0gaWRBdHRyaWJ1dGUgfVxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5kZWZhdWx0cyB9XG4gIHNldCBfZGVmYXVsdHMoZGVmYXVsdHMpIHtcbiAgICB0aGlzLmRlZmF1bHRzID0gZGVmYXVsdHNcbiAgICB0aGlzLnNldChkZWZhdWx0cylcbiAgfVxuICBnZXQgX2lzU2V0dGluZygpIHsgcmV0dXJuIHRoaXMuaXNTZXR0aW5nIH1cbiAgc2V0IF9pc1NldHRpbmcoaXNTZXR0aW5nKSB7IHRoaXMuaXNTZXR0aW5nID0gaXNTZXR0aW5nIH1cbiAgZ2V0IF9jaGFuZ2luZygpIHtcbiAgICB0aGlzLmNoYW5naW5nID0gdGhpcy5jaGFuZ2luZyB8fCB7fVxuICAgIHJldHVybiB0aGlzLmNoYW5naW5nXG4gIH1cbiAgZ2V0IF9sb2NhbFN0b3JhZ2UoKSB7IHJldHVybiB0aGlzLmxvY2FsU3RvcmFnZSB9XG4gIHNldCBfbG9jYWxTdG9yYWdlKGxvY2FsU3RvcmFnZSkgeyB0aGlzLmxvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XG4gIGdldCBfaGlzdGlvZ3JhbSgpIHsgcmV0dXJuIHRoaXMuaGlzdGlvZ3JhbSB8fCB7XG4gICAgbGVuZ3RoOiAxXG4gIH0gfVxuICBzZXQgX2hpc3Rpb2dyYW0oaGlzdGlvZ3JhbSkge1xuICAgIHRoaXMuaGlzdGlvZ3JhbSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB0aGlzLl9oaXN0aW9ncmFtLFxuICAgICAgaGlzdGlvZ3JhbVxuICAgIClcbiAgfVxuICBnZXQgX2hpc3RvcnkoKSB7XG4gICAgdGhpcy5oaXN0b3J5ID0gdGhpcy5oaXN0b3J5IHx8IFtdXG4gICAgcmV0dXJuIHRoaXMuaGlzdG9yeVxuICB9XG4gIHNldCBfaGlzdG9yeShkYXRhKSB7XG4gICAgaWYoXG4gICAgICBPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGlmKHRoaXMuX2hpc3Rpb2dyYW0ubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudW5zaGlmdCh0aGlzLnBhcnNlKGRhdGEpKVxuICAgICAgICB0aGlzLl9oaXN0b3J5LnNwbGljZSh0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aClcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IF9kYXRhKCkge1xuICAgIHRoaXMuZGF0YSA9IHRoaXMuZGF0YSB8fCB0aGlzLnN0b3JhZ2VDb250YWluZXJcbiAgICByZXR1cm4gdGhpcy5kYXRhXG4gIH1cbiAgc2V0IF9kYXRhKGRhdGEpIHsgdGhpcy5kYXRhID0gZGF0YSB9XG4gIGdldCBkYigpIHsgcmV0dXJuIHRoaXMuX2RiIH1cbiAgZ2V0IF9kYigpIHtcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgfHwgSlNPTi5zdHJpbmdpZnkodGhpcy5zdG9yYWdlQ29udGFpbmVyKVxuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICBnZXQoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YVtrZXldXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHNldCgpIHtcbiAgICB0aGlzLl9oaXN0b3J5ID0gdGhpcy5wYXJzZSgpXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdGhpcy5faXNTZXR0aW5nID0gdHJ1ZVxuICAgICAgICBsZXQgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgaWYoaW5kZXggPT09IChfYXJndW1lbnRzLmxlbmd0aCAtIDEpKSB0aGlzLl9pc1NldHRpbmcgPSBmYWxzZVxuICAgICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdmFyIHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpKSB7XG4gICAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREQigpIHtcbiAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHZhciBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGxldCB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgdGhpcy5fZGIgPSBkYlxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXREQigpIHtcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBkZWxldGUgdGhpcy5fZGJcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBkZWxldGUgZGJba2V5XVxuICAgICAgICB0aGlzLl9kYiA9IGRiXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpIHtcbiAgICBpZighdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldKSB7XG4gICAgICBsZXQgY29udGV4dCA9IHRoaXNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgICAgICB0aGlzLl9kYXRhLFxuICAgICAgICB7XG4gICAgICAgICAgWydfJy5jb25jYXQoa2V5KV06IHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNba2V5XSB9LFxuICAgICAgICAgICAgc2V0KHZhbHVlKSB7XG4gICAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgIGNvbnRleHQuX2NoYW5naW5nW2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgICBpZihjb250ZXh0LmxvY2FsU3RvcmFnZSkgY29udGV4dC5zZXREQihrZXksIHZhbHVlKVxuICAgICAgICAgICAgICBsZXQgc2V0VmFsdWVFdmVudE5hbWUgPSBbJ3NldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgICAgICAgICAgICBsZXQgc2V0RXZlbnROYW1lID0gJ3NldCdcbiAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgIHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHNldFZhbHVlRXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICBpZighY29udGV4dC5faXNTZXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgaWYoIU9iamVjdC52YWx1ZXMoY29udGV4dC5fY2hhbmdpbmcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgICAgICBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgZGF0YTogY29udGV4dC5fZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBjb250ZXh0LmVtaXQoXG4gICAgICAgICAgICAgICAgICAgIHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHNldEV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAgICAgICAgICAgICAge30sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0Ll9jaGFuZ2luZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuX2RhdGFcbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0LmNoYW5naW5nXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIClcbiAgICB9XG4gICAgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldID0gdmFsdWVcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0RGF0YVByb3BlcnR5KGtleSkge1xuICAgIGxldCB1bnNldFZhbHVlRXZlbnROYW1lID0gWyd1bnNldCcsICc6Jywga2V5XS5qb2luKCcnKVxuICAgIGxldCB1bnNldEV2ZW50TmFtZSA9ICd1bnNldCdcbiAgICBsZXQgdW5zZXRWYWx1ZSA9IHRoaXMuX2RhdGFba2V5XVxuICAgIGRlbGV0ZSB0aGlzLl9kYXRhWydfJy5jb25jYXQoa2V5KV1cbiAgICBkZWxldGUgdGhpcy5fZGF0YVtrZXldXG4gICAgdGhpcy5lbWl0KFxuICAgICAgdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiB1bnNldFZhbHVlLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdGhpc1xuICAgIClcbiAgICB0aGlzLmVtaXQoXG4gICAgICB1bnNldEV2ZW50TmFtZSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogdW5zZXRFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRoaXNcbiAgICApXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBwYXJzZShkYXRhKSB7XG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5fZGF0YSB8fCB0aGlzLnN0b3JhZ2VDb250YWluZXJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNb2RlbFxuIiwiaW1wb3J0IEJhc2UgZnJvbSAnLi4vQmFzZS9pbmRleCdcclxuaW1wb3J0IE1vZGVsIGZyb20gJy4uL01vZGVsL2luZGV4J1xyXG5cclxuY2xhc3MgQ29sbGVjdGlvbiBleHRlbmRzIEJhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxyXG4gIH1cclxuICBnZXQgc3RvcmFnZUNvbnRhaW5lcigpIHsgcmV0dXJuIFtdIH1cclxuICBnZXQgZGVmYXVsdElEQXR0cmlidXRlKCkgeyByZXR1cm4gJ19pZCcgfVxyXG4gIGdldCBiaW5kYWJsZUNsYXNzUHJvcGVydGllcygpIHsgcmV0dXJuIFtcclxuICAgICdzZXJ2aWNlJ1xyXG4gIF0gfVxyXG4gIGdldCBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xyXG4gICAgJ21vZGVsJyxcclxuICAgICdkZWZhdWx0cydcclxuICBdIH1cclxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5kZWZhdWx0cyB9XHJcbiAgc2V0IF9kZWZhdWx0cyhkZWZhdWx0cykge1xyXG4gICAgdGhpcy5kZWZhdWx0cyA9IGRlZmF1bHRzXHJcbiAgICB0aGlzLnNldChkZWZhdWx0cylcclxuICB9XHJcbiAgZ2V0IF9tb2RlbHMoKSB7XHJcbiAgICB0aGlzLm1vZGVscyA9IHRoaXMubW9kZWxzIHx8IHRoaXMuc3RvcmFnZUNvbnRhaW5lclxyXG4gICAgcmV0dXJuIHRoaXMubW9kZWxzXHJcbiAgfVxyXG4gIHNldCBfbW9kZWxzKG1vZGVsc0RhdGEpIHtcclxuICAgIHRoaXMubW9kZWxzID0gbW9kZWxzRGF0YVxyXG4gICAgICAubWFwKChtb2RlbERhdGEpID0+IHtcclxuICAgICAgICBsZXQgbW9kZWwgPSBuZXcgdGhpcy5tb2RlbCgpXHJcbiAgICAgICAgbW9kZWwuc2V0KG1vZGVsRGF0YSlcclxuICAgICAgICByZXR1cm4gbW9kZWxcclxuICAgICAgfSlcclxuICB9XHJcbiAgZ2V0IF9tb2RlbCgpIHsgcmV0dXJuIHRoaXMubW9kZWwgfVxyXG4gIHNldCBfbW9kZWwobW9kZWwpIHsgdGhpcy5tb2RlbCA9IG1vZGVsIH1cclxuICBnZXQgX2lzU2V0dGluZygpIHsgcmV0dXJuIHRoaXMuaXNTZXR0aW5nIH1cclxuICBzZXQgX2lzU2V0dGluZyhpc1NldHRpbmcpIHsgdGhpcy5pc1NldHRpbmcgPSBpc1NldHRpbmcgfVxyXG4gIGdldCBfbG9jYWxTdG9yYWdlKCkgeyByZXR1cm4gdGhpcy5sb2NhbFN0b3JhZ2UgfVxyXG4gIHNldCBfbG9jYWxTdG9yYWdlKGxvY2FsU3RvcmFnZSkgeyB0aGlzLmxvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XHJcbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9kYXRhIH1cclxuICBnZXQgX2RhdGEoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbW9kZWxzXHJcbiAgICAgIC5tYXAoKG1vZGVsKSA9PiBtb2RlbC5wYXJzZSgpKVxyXG4gIH1cclxuICBnZXQgZGIoKSB7IHJldHVybiB0aGlzLl9kYiB9XHJcbiAgZ2V0IF9kYigpIHtcclxuICAgIGxldCBkYiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuX2xvY2FsU3RvcmFnZS5lbmRwb2ludCkgfHwgSlNPTi5zdHJpbmdpZnkodGhpcy5zdG9yYWdlQ29udGFpbmVyKVxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGIpXHJcbiAgfVxyXG4gIHNldCBfZGIoZGIpIHtcclxuICAgIGRiID0gSlNPTi5zdHJpbmdpZnkoZGIpXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLl9sb2NhbFN0b3JhZ2UuZW5kcG9pbnQsIGRiKVxyXG4gIH1cclxuICBnZXRNb2RlbEluZGV4KG1vZGVsSUQpIHtcclxuICAgIGxldCBtb2RlbEluZGV4XHJcbiAgICB0aGlzLl9tb2RlbHNcclxuICAgICAgLmZpbmQoKF9tb2RlbCwgX21vZGVsSW5kZXgpID0+IHtcclxuICAgICAgICBpZihfbW9kZWwuZ2V0KF9tb2RlbC5pZEF0dHJpYnV0ZSkgPT09IG1vZGVsSUQpIHtcclxuICAgICAgICAgIG1vZGVsSW5kZXggPSBfbW9kZWxJbmRleFxyXG4gICAgICAgICAgcmV0dXJuIF9tb2RlbFxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIHJldHVybiBtb2RlbEluZGV4XHJcbiAgfVxyXG4gIHJlbW92ZU1vZGVsQnlJbmRleChtb2RlbEluZGV4KSB7XHJcbiAgICBsZXQgbW9kZWwgPSB0aGlzLl9tb2RlbHMuc3BsaWNlKG1vZGVsSW5kZXgsIDEpXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdyZW1vdmVNb2RlbCcsIHtcclxuICAgICAgICBuYW1lOiAncmVtb3ZlTW9kZWwnLFxyXG4gICAgICB9LFxyXG4gICAgICBtb2RlbCxcclxuICAgICAgdGhpc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgYWRkTW9kZWwobW9kZWxEYXRhKSB7XHJcbiAgICBsZXQgbW9kZWxcclxuICAgIGlmKG1vZGVsRGF0YSBpbnN0YW5jZW9mIE1vZGVsKSB7XHJcbiAgICAgIG1vZGVsID0gbW9kZWxEYXRhXHJcbiAgICAgIHRoaXMuX21vZGVscy5wdXNoKG1vZGVsKVxyXG4gICAgfSBlbHNlIGlmKFxyXG4gICAgICAhQXJyYXkuaXNBcnJheShtb2RlbERhdGEpICYmXHJcbiAgICAgIHR5cGVvZiBtb2RlbERhdGEgIT09IG51bGwgJiZcclxuICAgICAgdHlwZW9mIG1vZGVsRGF0YSA9PT0gJ29iamVjdCdcclxuICAgICkge1xyXG4gICAgICBtb2RlbCA9IG5ldyB0aGlzLm1vZGVsKClcclxuICAgICAgbW9kZWwuc2V0KG1vZGVsRGF0YSlcclxuICAgICAgdGhpcy5fbW9kZWxzLnB1c2gobW9kZWwpXHJcbiAgICB9XHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdhZGRNb2RlbCcsXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAnYWRkTW9kZWwnLFxyXG4gICAgICB9LFxyXG4gICAgICBtb2RlbCxcclxuICAgICAgdGhpc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgYWRkKG1vZGVsRGF0YSkge1xyXG4gICAgdGhpcy5faXNTZXR0aW5nID0gdHJ1ZVxyXG4gICAgaWYoQXJyYXkuaXNBcnJheShtb2RlbERhdGEpKSB7XHJcbiAgICAgIG1vZGVsRGF0YVxyXG4gICAgICAgIC5mb3JFYWNoKChfbW9kZWxEYXRhKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmFkZE1vZGVsKF9tb2RlbERhdGEpXHJcbiAgICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYWRkTW9kZWwobW9kZWxEYXRhKVxyXG4gICAgfVxyXG4gICAgaWYodGhpcy5fbG9jYWxTdG9yYWdlKSB0aGlzLl9kYiA9IHRoaXMuX2RhdGFcclxuICAgIHRoaXMuX2lzU2V0dGluZyA9IGZhbHNlXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdjaGFuZ2UnLCB7XHJcbiAgICAgICAgbmFtZTogJ2NoYW5nZScsXHJcbiAgICAgICAgZGF0YTogdGhpcy5fZGF0YSxcclxuICAgICAgfSxcclxuICAgICAgdGhpc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcmVtb3ZlKG1vZGVsRGF0YSkge1xyXG4gICAgdGhpcy5faXNTZXR0aW5nID0gdHJ1ZVxyXG4gICAgbGV0IG1vZGVsSW5kZXhcclxuICAgIGlmKFxyXG4gICAgICB0eXBlb2YgbW9kZWxEYXRhID09PSAnc3RyaW5nJyB8fFxyXG4gICAgICB0eXBlb2YgbW9kZWxEYXRhID09PSAnbnVtYmVyJ1xyXG4gICAgKSB7XHJcbiAgICAgIHRoaXMucmVtb3ZlTW9kZWxCeUluZGV4KFxyXG4gICAgICAgIHRoaXMuZ2V0TW9kZWxJbmRleChtb2RlbERhdGEpXHJcbiAgICAgIClcclxuICAgIH0gZWxzZSBpZihtb2RlbERhdGEgaW5zdGFuY2VvZiBNb2RlbCkge1xyXG4gICAgICB0aGlzLnJlbW92ZU1vZGVsQnlJbmRleChcclxuICAgICAgICB0aGlzLmdldE1vZGVsSW5kZXgoXHJcbiAgICAgICAgICBtb2RlbFttb2RlbC5kZWZhdWx0SURBdHRyaWJ1dGVdXHJcbiAgICAgICAgKVxyXG4gICAgICApXHJcbiAgICB9IGVsc2UgaWYoQXJyYXkuaXNBcnJheShtb2RlbERhdGEpKSB7XHJcbiAgICAgIG1vZGVsRGF0YVxyXG4gICAgICAgIC5mb3JFYWNoKChtb2RlbCkgPT4ge1xyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIHR5cGVvZiBtb2RlbERhdGEgPT09ICdzdHJpbmcnIHx8XHJcbiAgICAgICAgICAgIHR5cGVvZiBtb2RlbERhdGEgPT09ICdudW1iZXInXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVNb2RlbEJ5SW5kZXgoXHJcbiAgICAgICAgICAgICAgdGhpcy5nZXRNb2RlbEluZGV4KG1vZGVsRGF0YSlcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgfSBlbHNlIGlmKG1vZGVsRGF0YSBpbnN0YW5jZW9mIE1vZGVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlTW9kZWxCeUluZGV4KFxyXG4gICAgICAgICAgICAgIHRoaXMuZ2V0TW9kZWxJbmRleChcclxuICAgICAgICAgICAgICAgIG1vZGVsW21vZGVsLmRlZmF1bHRJREF0dHJpYnV0ZV1cclxuICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgdGhpcy5faXNTZXR0aW5nID0gZmFsc2VcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ2NoYW5nZScsIHtcclxuICAgICAgICBuYW1lOiAnY2hhbmdlJyxcclxuICAgICAgICBkYXRhOiB0aGlzLl9kYXRhLFxyXG4gICAgICB9LFxyXG4gICAgICB0aGlzXHJcbiAgICApXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBwYXJzZShkYXRhKSB7XHJcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLl9kYXRhIHx8IHRoaXMuc3RvcmFnZUNvbnRhaW5lclxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb2xsZWN0aW9uXHJcbiIsImltcG9ydCB7IHR5cGVPZiB9IGZyb20gJy4uL1V0aWxzL2luZGV4J1xuaW1wb3J0IEJhc2UgZnJvbSAnLi4vQmFzZS9pbmRleCdcblxuY2xhc3MgVmlldyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gIH1cbiAgZ2V0IGJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICd1aUVsZW1lbnQnXG4gIF0gfVxuICBnZXQgY2xhc3NEZWZhdWx0UHJvcGVydGllcygpIHsgcmV0dXJuIFtcbiAgICAnZWxlbWVudE5hbWUnLFxuICAgICdlbGVtZW50JyxcbiAgICAnYXR0cmlidXRlcycsXG4gICAgJ3RlbXBsYXRlcycsXG4gICAgJ2luc2VydCdcbiAgXSB9XG4gIGdldCBfZWxlbWVudE5hbWUoKSB7IHJldHVybiB0aGlzLl9lbGVtZW50LnRhZ05hbWUgfVxuICBzZXQgX2VsZW1lbnROYW1lKGVsZW1lbnROYW1lKSB7XG4gICAgaWYoIXRoaXMuX2VsZW1lbnQpIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnROYW1lKVxuICB9XG4gIGdldCBfZWxlbWVudCgpIHsgcmV0dXJuIHRoaXMuZWxlbWVudCB9XG4gIHNldCBfZWxlbWVudChlbGVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxuICAgIHRoaXMuZWxlbWVudE9ic2VydmVyLm9ic2VydmUodGhpcy5lbGVtZW50LCB7XG4gICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIH0pXG4gIH1cbiAgZ2V0IF9hdHRyaWJ1dGVzKCkge1xuICAgIHRoaXMuYXR0cmlidXRlcyA9IHRoaXMuZWxlbWVudC5hdHRyaWJ1dGVzXG4gICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1xuICB9XG4gIHNldCBfYXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgZm9yKGxldCBbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGVWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlS2V5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IGVsZW1lbnRPYnNlcnZlcigpIHtcbiAgICB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgPSB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgfHwgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoXG4gICAgICB0aGlzLmVsZW1lbnRPYnNlcnZlLmJpbmQodGhpcylcbiAgICApXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRPYnNlcnZlclxuICB9XG4gIGdldCBfaW5zZXJ0KCkge1xuICAgIHRoaXMuaW5zZXJ0ID0gdGhpcy5pbnNlcnQgfHwgbnVsbFxuICAgIHJldHVybiB0aGlzLmluc2VydFxuICB9XG4gIHNldCBfaW5zZXJ0KGluc2VydCkgeyB0aGlzLmluc2VydCA9IGluc2VydCB9XG4gIGdldCBfdGVtcGxhdGVzKCkge1xuICAgIHRoaXMudGVtcGxhdGVzID0gdGhpcy50ZW1wbGF0ZXMgfHwge31cbiAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZXNcbiAgfVxuICBzZXQgX3RlbXBsYXRlcyh0ZW1wbGF0ZXMpIHsgdGhpcy50ZW1wbGF0ZXMgPSB0ZW1wbGF0ZXMgfVxuICByZXNldFVJRWxlbWVudHMoKSB7XG4gICAgbGV0IHVpRWxlbWVudFNldHRpbmdzID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHt9LFxuICAgICAgdGhpcy5fdWlFbGVtZW50U2V0dGluZ3NcbiAgICApXG4gICAgdGhpcy50b2dnbGVUYXJnZXRCaW5kYWJsZUNsYXNzRXZlbnRzKCd1aUVsZW1lbnQnLCAnb2ZmJylcbiAgICB0aGlzLnJlbW92ZVVJRWxlbWVudHMoKVxuICAgIHRoaXMuYWRkVUlFbGVtZW50cyh1aUVsZW1lbnRTZXR0aW5ncylcbiAgICB0aGlzLnRvZ2dsZVRhcmdldEJpbmRhYmxlQ2xhc3NFdmVudHMoJ3VpRWxlbWVudCcsICdvbicpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBlbGVtZW50T2JzZXJ2ZShtdXRhdGlvblJlY29yZExpc3QsIG9ic2VydmVyKSB7XG4gICAgZm9yKGxldCBbbXV0YXRpb25SZWNvcmRJbmRleCwgbXV0YXRpb25SZWNvcmRdIG9mIE9iamVjdC5lbnRyaWVzKG11dGF0aW9uUmVjb3JkTGlzdCkpIHtcbiAgICAgIHN3aXRjaChtdXRhdGlvblJlY29yZC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2NoaWxkTGlzdCc6XG4gICAgICAgICAgbGV0IG11dGF0aW9uUmVjb3JkQ2F0ZWdvcmllcyA9IFsnYWRkZWROb2RlcycsICdyZW1vdmVkTm9kZXMnXVxuICAgICAgICAgIHRoaXMucmVzZXRVSUVsZW1lbnRzKClcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBhdXRvSW5zZXJ0KCkge1xuICAgIGlmKHRoaXMuaW5zZXJ0KSB7XG4gICAgICBsZXQgcGFyZW50RWxlbWVudFxuICAgICAgaWYodHlwZU9mKHRoaXMuaW5zZXJ0LmVsZW1lbnQpID09PSAnc3RyaW5nJykge1xuICAgICAgICBwYXJlbnRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLmluc2VydC5lbGVtZW50KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyZW50RWxlbWVudCA9IHRoaXMuaW5zZXJ0LmVsZW1lbnRcbiAgICAgIH1cbiAgICAgIGlmKFxuICAgICAgICBwYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcbiAgICAgICAgcGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIE5vZGVcbiAgICAgICkge1xuICAgICAgICBwYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCh0aGlzLmluc2VydC5tZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICAgIH0gZWxzZSBpZihwYXJlbnRFbGVtZW50IGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgICAgcGFyZW50RWxlbWVudFxuICAgICAgICAgIC5mb3JFYWNoKChfcGFyZW50RWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgX3BhcmVudEVsZW1lbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KHRoaXMuaW5zZXJ0Lm1ldGhvZCwgdGhpcy5lbGVtZW50KVxuICAgICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYocGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIGpRdWVyeSkge1xuICAgICAgICBwYXJlbnRFbGVtZW50XG4gICAgICAgICAgLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBlbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCh0aGlzLmluc2VydC5tZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGF1dG9SZW1vdmUoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLmVsZW1lbnQgJiZcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50XG4gICAgKSB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgVmlld1xuIiwiaW1wb3J0IEJhc2UgZnJvbSAnLi4vQmFzZS9pbmRleCdcblxuY29uc3QgQ29udHJvbGxlciA9IGNsYXNzIGV4dGVuZHMgQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgfVxuICBnZXQgYmluZGFibGVDbGFzc1Byb3BlcnRpZXMoKSB7IHJldHVybiBbXG4gICAgJ21vZGVsJyxcbiAgICAnY29sbGVjdGlvbicsXG4gICAgJ3ZpZXcnLFxuICAgICdjb250cm9sbGVyJyxcbiAgICAncm91dGVyJ1xuICBdIH1cbiAgZ2V0IGNsYXNzRGVmYXVsdFByb3BlcnRpZXMoKSB7IHJldHVybiBbXSB9XG59XG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyXG4iLCJpbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4J1xuXG5jb25zdCBSb3V0ZXIgPSBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gICAgdGhpcy5hZGRXaW5kb3dFdmVudHMoKVxuICB9XG4gIGdldCBjbGFzc0RlZmF1bHRQcm9wZXJ0aWVzKCkgeyByZXR1cm4gW1xuICAgICdyb290JyxcbiAgICAnaGFzaFJvdXRpbmcnLFxuICAgICdjb250cm9sbGVyJyxcbiAgICAncm91dGVzJ1xuICBdIH1cbiAgZ2V0IHByb3RvY29sKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnByb3RvY29sIH1cbiAgZ2V0IGhvc3RuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lIH1cbiAgZ2V0IHBvcnQoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucG9ydCB9XG4gIGdldCBwYXRobmFtZSgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSB9XG4gIGdldCBwYXRoKCkge1xuICAgIGxldCBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWVcbiAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoWydeJywgdGhpcy5yb290XS5qb2luKCcnKSksICcnKVxuICAgICAgLnNwbGl0KCc/JylcbiAgICAgIC5zbGljZSgwLCAxKVxuICAgICAgWzBdXG4gICAgbGV0IGZyYWdtZW50cyA9IChcbiAgICAgIHN0cmluZy5sZW5ndGggPT09IDBcbiAgICApID8gW11cbiAgICAgIDogKFxuICAgICAgICAgIHN0cmluZy5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL15cXC8vKSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXFwvPy8pXG4gICAgICAgICkgPyBbJy8nXVxuICAgICAgICAgIDogc3RyaW5nXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC8kLywgJycpXG4gICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgcmV0dXJuIHtcbiAgICAgIGZyYWdtZW50czogZnJhZ21lbnRzLFxuICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgfVxuICB9XG4gIGdldCBoYXNoKCkge1xuICAgIGxldCBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uaGFzaFxuICAgICAgLnNsaWNlKDEpXG4gICAgICAuc3BsaXQoJz8nKVxuICAgICAgLnNsaWNlKDAsIDEpXG4gICAgICBbMF1cbiAgICBsZXQgZnJhZ21lbnRzID0gKFxuICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMFxuICAgICkgPyBbXVxuICAgICAgOiAoXG4gICAgICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXlxcLy8pICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9cXC8/LylcbiAgICAgICAgKSA/IFsnLyddXG4gICAgICAgICAgOiBzdHJpbmdcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICByZXR1cm4ge1xuICAgICAgZnJhZ21lbnRzOiBmcmFnbWVudHMsXG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICB9XG4gIH1cbiAgZ2V0IHBhcmFtZXRlcnMoKSB7XG4gICAgbGV0IHN0cmluZ1xuICAgIGxldCBkYXRhXG4gICAgaWYod2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goL1xcPy8pKSB7XG4gICAgICBsZXQgcGFyYW1ldGVycyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgICAgIC5zcGxpdCgnPycpXG4gICAgICAgIC5zbGljZSgtMSlcbiAgICAgICAgLmpvaW4oJycpXG4gICAgICBzdHJpbmcgPSBwYXJhbWV0ZXJzXG4gICAgICBkYXRhID0gcGFyYW1ldGVyc1xuICAgICAgICAuc3BsaXQoJyYnKVxuICAgICAgICAucmVkdWNlKChcbiAgICAgICAgICBfcGFyYW1ldGVycyxcbiAgICAgICAgICBwYXJhbWV0ZXJcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgbGV0IHBhcmFtZXRlckRhdGEgPSBwYXJhbWV0ZXIuc3BsaXQoJz0nKVxuICAgICAgICAgIF9wYXJhbWV0ZXJzW3BhcmFtZXRlckRhdGFbMF1dID0gcGFyYW1ldGVyRGF0YVsxXVxuICAgICAgICAgIHJldHVybiBfcGFyYW1ldGVyc1xuICAgICAgICB9LCB7fSlcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyaW5nID0gJydcbiAgICAgIGRhdGEgPSB7fVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfVxuICB9XG4gIGdldCBfcm9vdCgpIHsgcmV0dXJuIHRoaXMucm9vdCB8fCAnLycgfVxuICBzZXQgX3Jvb3Qocm9vdCkgeyB0aGlzLnJvb3QgPSByb290IH1cbiAgZ2V0IF9oYXNoUm91dGluZygpIHsgcmV0dXJuIHRoaXMuaGFzaFJvdXRpbmcgfHwgZmFsc2UgfVxuICBzZXQgX2hhc2hSb3V0aW5nKGhhc2hSb3V0aW5nKSB7IHRoaXMuaGFzaFJvdXRpbmcgPSBoYXNoUm91dGluZyB9XG4gIGdldCBfcm91dGVzKCkgeyByZXR1cm4gdGhpcy5yb3V0ZXMgfVxuICBzZXQgX3JvdXRlcyhyb3V0ZXMpIHsgdGhpcy5yb3V0ZXMgPSByb3V0ZXMgfVxuICBnZXQgX2NvbnRyb2xsZXIoKSB7IHJldHVybiB0aGlzLmNvbnRyb2xsZXIgfVxuICBzZXQgX2NvbnRyb2xsZXIoY29udHJvbGxlcikgeyB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyIH1cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICByb290OiB0aGlzLnJvb3QsXG4gICAgICBwYXRoOiB0aGlzLnBhdGgsXG4gICAgICBoYXNoOiB0aGlzLmhhc2gsXG4gICAgICBwYXJhbWV0ZXJzOiB0aGlzLnBhcmFtZXRlcnMsXG4gICAgfVxuICB9XG4gIG1hdGNoUm91dGUocm91dGVGcmFnbWVudHMsIGxvY2F0aW9uRnJhZ21lbnRzKSB7XG4gICAgbGV0IHJvdXRlTWF0Y2hlcyA9IG5ldyBBcnJheSgpXG4gICAgaWYocm91dGVGcmFnbWVudHMubGVuZ3RoID09PSBsb2NhdGlvbkZyYWdtZW50cy5sZW5ndGgpIHtcbiAgICAgIHJvdXRlTWF0Y2hlcyA9IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgIC5yZWR1Y2UoKF9yb3V0ZU1hdGNoZXMsIHJvdXRlRnJhZ21lbnQsIHJvdXRlRnJhZ21lbnRJbmRleCkgPT4ge1xuICAgICAgICAgIGxldCBsb2NhdGlvbkZyYWdtZW50ID0gbG9jYXRpb25GcmFnbWVudHNbcm91dGVGcmFnbWVudEluZGV4XVxuICAgICAgICAgIGlmKHJvdXRlRnJhZ21lbnQubWF0Y2goL15cXDovKSkge1xuICAgICAgICAgICAgX3JvdXRlTWF0Y2hlcy5wdXNoKHRydWUpXG4gICAgICAgICAgfSBlbHNlIGlmKHJvdXRlRnJhZ21lbnQgPT09IGxvY2F0aW9uRnJhZ21lbnQpIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaCh0cnVlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2goZmFsc2UpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcm91dGVNYXRjaGVzXG4gICAgICAgIH0sIFtdKVxuICAgIH0gZWxzZSB7XG4gICAgICByb3V0ZU1hdGNoZXMucHVzaChmYWxzZSlcbiAgICB9XG4gICAgcmV0dXJuIChyb3V0ZU1hdGNoZXMuaW5kZXhPZihmYWxzZSkgPT09IC0xKVxuICAgICAgPyB0cnVlXG4gICAgICA6IGZhbHNlXG4gIH1cbiAgZ2V0Um91dGUobG9jYXRpb24pIHtcbiAgICBsZXQgcm91dGVzID0gT2JqZWN0LmVudHJpZXModGhpcy5yb3V0ZXMpXG4gICAgICAucmVkdWNlKChcbiAgICAgICAgX3JvdXRlcyxcbiAgICAgICAgW3JvdXRlTmFtZSwgcm91dGVTZXR0aW5nc10pID0+IHtcbiAgICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSAoXG4gICAgICAgICAgICByb3V0ZU5hbWUubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgICByb3V0ZU5hbWUubWF0Y2goL15cXC8vKVxuICAgICAgICAgICkgPyBbcm91dGVOYW1lXVxuICAgICAgICAgICAgOiAocm91dGVOYW1lLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgPyBbJyddXG4gICAgICAgICAgICAgIDogcm91dGVOYW1lXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgICAgICAgcm91dGVTZXR0aW5ncy5mcmFnbWVudHMgPSByb3V0ZUZyYWdtZW50c1xuICAgICAgICAgIF9yb3V0ZXNbcm91dGVGcmFnbWVudHMuam9pbignLycpXSA9IHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICByZXR1cm4gX3JvdXRlc1xuICAgICAgICB9LFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHJvdXRlcylcbiAgICAgIC5maW5kKChyb3V0ZSkgPT4ge1xuICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSByb3V0ZS5mcmFnbWVudHNcbiAgICAgICAgbGV0IGxvY2F0aW9uRnJhZ21lbnRzID0gKHRoaXMuaGFzaFJvdXRpbmcpXG4gICAgICAgICAgPyBsb2NhdGlvbi5oYXNoLmZyYWdtZW50c1xuICAgICAgICAgIDogbG9jYXRpb24ucGF0aC5mcmFnbWVudHNcbiAgICAgICAgbGV0IG1hdGNoUm91dGUgPSB0aGlzLm1hdGNoUm91dGUoXG4gICAgICAgICAgcm91dGVGcmFnbWVudHMsXG4gICAgICAgICAgbG9jYXRpb25GcmFnbWVudHMsXG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuIG1hdGNoUm91dGUgPT09IHRydWVcbiAgICAgIH0pXG4gIH1cbiAgcG9wU3RhdGUoZXZlbnQpIHtcbiAgICBsZXQgbG9jYXRpb24gPSB0aGlzLmxvY2F0aW9uXG4gICAgbGV0IHJvdXRlID0gdGhpcy5nZXRSb3V0ZShsb2NhdGlvbilcbiAgICBsZXQgcm91dGVEYXRhID0ge1xuICAgICAgcm91dGU6IHJvdXRlLFxuICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgIH1cbiAgICBpZihyb3V0ZSkge1xuICAgICAgdGhpcy5jb250cm9sbGVyW3JvdXRlLmNhbGxiYWNrXShyb3V0ZURhdGEpXG4gICAgICB0aGlzLmVtaXQoJ2NoYW5nZScsIHtcbiAgICAgICAgbmFtZTogJ2NoYW5nZScsXG4gICAgICAgIGRhdGE6IHJvdXRlRGF0YSxcbiAgICAgIH0sXG4gICAgICB0aGlzKVxuICAgIH1cbiAgfVxuICBhZGRXaW5kb3dFdmVudHMoKSB7XG4gICAgd2luZG93Lm9uKCdwb3BzdGF0ZScsIHRoaXMucG9wU3RhdGUuYmluZCh0aGlzKSlcbiAgfVxuICByZW1vdmVXaW5kb3dFdmVudHMoKSB7XG4gICAgd2luZG93Lm9mZigncG9wc3RhdGUnLCB0aGlzLnBvcFN0YXRlLmJpbmQodGhpcykpXG4gIH1cbiAgbmF2aWdhdGUocGF0aCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aFxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBSb3V0ZXJcbiIsImltcG9ydCAnLi9TaGltcy9ldmVudHMnXG5pbXBvcnQgRXZlbnRzIGZyb20gJy4vRXZlbnRzL2luZGV4J1xuaW1wb3J0IENoYW5uZWxzIGZyb20gJy4vQ2hhbm5lbHMvaW5kZXgnXG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL1V0aWxzL2luZGV4J1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi9TZXJ2aWNlL2luZGV4J1xuaW1wb3J0IE1vZGVsIGZyb20gJy4vTW9kZWwvaW5kZXgnXG5pbXBvcnQgQ29sbGVjdGlvbiBmcm9tICcuL0NvbGxlY3Rpb24vaW5kZXgnXG5pbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcvaW5kZXgnXG5pbXBvcnQgQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXIvaW5kZXgnXG5pbXBvcnQgUm91dGVyIGZyb20gJy4vUm91dGVyL2luZGV4J1xuY29uc3QgTVZDID0ge1xuICBFdmVudHMsXG4gIENoYW5uZWxzLFxuICBVdGlscyxcbiAgU2VydmljZSxcbiAgTW9kZWwsXG4gIENvbGxlY3Rpb24sXG4gIFZpZXcsXG4gIENvbnRyb2xsZXIsXG4gIFJvdXRlcixcbn1cbmV4cG9ydCBkZWZhdWx0IE1WQ1xuIl0sIm5hbWVzIjpbIkV2ZW50VGFyZ2V0IiwicHJvdG90eXBlIiwib24iLCJhZGRFdmVudExpc3RlbmVyIiwib2ZmIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIkV2ZW50cyIsImNvbnN0cnVjdG9yIiwiX2V2ZW50cyIsImV2ZW50cyIsImdldEV2ZW50Q2FsbGJhY2tzIiwiZXZlbnROYW1lIiwiZ2V0RXZlbnRDYWxsYmFja05hbWUiLCJldmVudENhbGxiYWNrIiwibmFtZSIsImxlbmd0aCIsImdldEV2ZW50Q2FsbGJhY2tHcm91cCIsImV2ZW50Q2FsbGJhY2tzIiwiZXZlbnRDYWxsYmFja05hbWUiLCJldmVudENhbGxiYWNrR3JvdXAiLCJwdXNoIiwiYXJndW1lbnRzIiwiT2JqZWN0Iiwia2V5cyIsImVtaXQiLCJldmVudERhdGEiLCJfYXJndW1lbnRzIiwidmFsdWVzIiwiZW50cmllcyIsImV2ZW50Q2FsbGJhY2tHcm91cE5hbWUiLCJhZGRpdGlvbmFsQXJndW1lbnRzIiwic3BsaWNlIiwiQ2hhbm5lbCIsIl9yZXNwb25zZXMiLCJyZXNwb25zZXMiLCJyZXNwb25zZSIsInJlc3BvbnNlTmFtZSIsInJlc3BvbnNlQ2FsbGJhY2siLCJyZXF1ZXN0IiwiQXJyYXkiLCJzbGljZSIsImNhbGwiLCJDaGFubmVscyIsIl9jaGFubmVscyIsImNoYW5uZWxzIiwiY2hhbm5lbCIsImNoYW5uZWxOYW1lIiwidHlwZU9mIiwiZGF0YSIsIl9vYmplY3QiLCJpc0FycmF5IiwiVUlEIiwidXVpZCIsImlpIiwiTWF0aCIsInJhbmRvbSIsInRvU3RyaW5nIiwiQmFzZSIsInNldHRpbmdzIiwiY29uZmlndXJhdGlvbiIsImFkZENsYXNzRGVmYXVsdFByb3BlcnRpZXMiLCJhZGRCaW5kYWJsZUNsYXNzUHJvcGVydGllcyIsIl9zZXR0aW5ncyIsIl9jb25maWd1cmF0aW9uIiwidWlkIiwiX3VpZCIsIl9uYW1lIiwiY2xhc3NEZWZhdWx0UHJvcGVydGllcyIsImZvckVhY2giLCJjbGFzc1NldHRpbmciLCJjb25jYXQiLCJzZXR0aW5nS2V5IiwiaW5kZXhPZiIsIl91aUVsZW1lbnRTZXR0aW5ncyIsInVpRWxlbWVudFNldHRpbmdzIiwiZ2V0QmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kcyIsImJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU5hbWUiLCJjYXBpdGFsaXplUHJvcGVydHlOYW1lIiwicmVwbGFjZSIsImZpcnN0Q2hhcmFjdGVyIiwic3Vic3RyaW5nIiwidG9VcHBlckNhc2UiLCJjbGFzc0RlZmF1bHRQcm9wZXJ0eSIsImNsYXNzRGVmYXVsdFByb3BlcnR5SW5kZXgiLCJwcm9wZXJ0eSIsImRlZmluZVByb3BlcnR5Iiwid3JpdGFibGUiLCJ2YWx1ZSIsImJpbmRhYmxlQ2xhc3NQcm9wZXJ0aWVzIiwiYmluZGFibGVDbGFzc1Byb3BlcnR5TWV0aG9kcyIsImJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU1ldGhvZCIsImJpbmRhYmxlQ2xhc3NQcm9wZXJ0eU1ldGhvZEluZGV4IiwiYWRkQmluZGFibGVDbGFzc1Byb3BlcnR5IiwidG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyIsImNvbnRleHQiLCJhZGRCaW5kYWJsZUNsYXNzUHJvcGVydHlOYW1lIiwicmVtb3ZlQmluZGFibGVDbGFzc1Byb3BlcnR5TmFtZSIsImN1cnJlbnRQcm9wZXJ0eVZhbHVlcyIsImRlZmluZVByb3BlcnRpZXMiLCJnZXQiLCJzZXQiLCJrZXkiLCJlbGVtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInJlc2V0VGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50cyIsImNsYXNzVHlwZSIsIm1ldGhvZCIsImNsYXNzVHlwZUV2ZW50RGF0YSIsImNsYXNzVHlwZUNhbGxiYWNrTmFtZSIsInNwbGl0IiwiY2xhc3NUeXBlVGFyZ2V0TmFtZSIsImNsYXNzVHlwZUV2ZW50TmFtZSIsImNsYXNzVHlwZVRhcmdldCIsImNsYXNzVHlwZUV2ZW50Q2FsbGJhY2siLCJiaW5kIiwidG9nZ2xlVGFyZ2V0QmluZGFibGVDbGFzc0V2ZW50IiwiZXJyb3IiLCJSZWZlcmVuY2VFcnJvciIsIk5vZGVMaXN0IiwiZnJvbSIsIl9jbGFzc1R5cGVUYXJnZXQiLCJIVE1MRWxlbWVudCIsIlNlcnZpY2UiLCJfZGVmYXVsdHMiLCJkZWZhdWx0cyIsImNvbnRlbnRUeXBlIiwicmVzcG9uc2VUeXBlIiwiX3Jlc3BvbnNlVHlwZXMiLCJfcmVzcG9uc2VUeXBlIiwiX3hociIsImZpbmQiLCJyZXNwb25zZVR5cGVJdGVtIiwiX3R5cGUiLCJ0eXBlIiwiX3VybCIsInVybCIsIl9oZWFkZXJzIiwiaGVhZGVycyIsImhlYWRlciIsInNldFJlcXVlc3RIZWFkZXIiLCJfZGF0YSIsInhociIsIlhNTEh0dHBSZXF1ZXN0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJzdGF0dXMiLCJhYm9ydCIsIm9wZW4iLCJvbmxvYWQiLCJvbmVycm9yIiwic2VuZCIsInRoZW4iLCJjdXJyZW50VGFyZ2V0IiwiY2F0Y2giLCJNb2RlbCIsInN0b3JhZ2VDb250YWluZXIiLCJkZWZhdWx0SURBdHRyaWJ1dGUiLCJfaWRBdHRyaWJ1dGUiLCJpZEF0dHJpYnV0ZSIsIl9pc1NldHRpbmciLCJpc1NldHRpbmciLCJfY2hhbmdpbmciLCJjaGFuZ2luZyIsIl9sb2NhbFN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJfaGlzdGlvZ3JhbSIsImhpc3Rpb2dyYW0iLCJhc3NpZ24iLCJfaGlzdG9yeSIsImhpc3RvcnkiLCJ1bnNoaWZ0IiwicGFyc2UiLCJkYiIsIl9kYiIsImdldEl0ZW0iLCJlbmRwb2ludCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzZXRJdGVtIiwiaW5kZXgiLCJzZXREYXRhUHJvcGVydHkiLCJ1bnNldCIsInVuc2V0RGF0YVByb3BlcnR5Iiwic2V0REIiLCJ1bnNldERCIiwiY29uZmlndXJhYmxlIiwic2V0VmFsdWVFdmVudE5hbWUiLCJqb2luIiwic2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZUV2ZW50TmFtZSIsInVuc2V0RXZlbnROYW1lIiwidW5zZXRWYWx1ZSIsIkNvbGxlY3Rpb24iLCJfbW9kZWxzIiwibW9kZWxzIiwibW9kZWxzRGF0YSIsIm1hcCIsIm1vZGVsRGF0YSIsIm1vZGVsIiwiX21vZGVsIiwiZ2V0TW9kZWxJbmRleCIsIm1vZGVsSUQiLCJtb2RlbEluZGV4IiwiX21vZGVsSW5kZXgiLCJyZW1vdmVNb2RlbEJ5SW5kZXgiLCJhZGRNb2RlbCIsImFkZCIsIl9tb2RlbERhdGEiLCJyZW1vdmUiLCJWaWV3IiwiX2VsZW1lbnROYW1lIiwiX2VsZW1lbnQiLCJ0YWdOYW1lIiwiZWxlbWVudE5hbWUiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJlbGVtZW50T2JzZXJ2ZXIiLCJvYnNlcnZlIiwic3VidHJlZSIsImNoaWxkTGlzdCIsIl9hdHRyaWJ1dGVzIiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZUtleSIsImF0dHJpYnV0ZVZhbHVlIiwicmVtb3ZlQXR0cmlidXRlIiwic2V0QXR0cmlidXRlIiwiX2VsZW1lbnRPYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJlbGVtZW50T2JzZXJ2ZSIsIl9pbnNlcnQiLCJpbnNlcnQiLCJfdGVtcGxhdGVzIiwidGVtcGxhdGVzIiwicmVzZXRVSUVsZW1lbnRzIiwicmVtb3ZlVUlFbGVtZW50cyIsImFkZFVJRWxlbWVudHMiLCJtdXRhdGlvblJlY29yZExpc3QiLCJvYnNlcnZlciIsIm11dGF0aW9uUmVjb3JkSW5kZXgiLCJtdXRhdGlvblJlY29yZCIsImF1dG9JbnNlcnQiLCJwYXJlbnRFbGVtZW50IiwiTm9kZSIsImluc2VydEFkamFjZW50RWxlbWVudCIsIl9wYXJlbnRFbGVtZW50IiwialF1ZXJ5IiwiZWFjaCIsImF1dG9SZW1vdmUiLCJyZW1vdmVDaGlsZCIsIkNvbnRyb2xsZXIiLCJSb3V0ZXIiLCJhZGRXaW5kb3dFdmVudHMiLCJwcm90b2NvbCIsIndpbmRvdyIsImxvY2F0aW9uIiwiaG9zdG5hbWUiLCJwb3J0IiwicGF0aG5hbWUiLCJwYXRoIiwic3RyaW5nIiwiUmVnRXhwIiwicm9vdCIsImZyYWdtZW50cyIsIm1hdGNoIiwiaGFzaCIsInBhcmFtZXRlcnMiLCJocmVmIiwicmVkdWNlIiwiX3BhcmFtZXRlcnMiLCJwYXJhbWV0ZXIiLCJwYXJhbWV0ZXJEYXRhIiwiX3Jvb3QiLCJfaGFzaFJvdXRpbmciLCJoYXNoUm91dGluZyIsIl9yb3V0ZXMiLCJyb3V0ZXMiLCJfY29udHJvbGxlciIsImNvbnRyb2xsZXIiLCJtYXRjaFJvdXRlIiwicm91dGVGcmFnbWVudHMiLCJsb2NhdGlvbkZyYWdtZW50cyIsInJvdXRlTWF0Y2hlcyIsIl9yb3V0ZU1hdGNoZXMiLCJyb3V0ZUZyYWdtZW50Iiwicm91dGVGcmFnbWVudEluZGV4IiwibG9jYXRpb25GcmFnbWVudCIsImdldFJvdXRlIiwicm91dGVOYW1lIiwicm91dGVTZXR0aW5ncyIsInJvdXRlIiwicG9wU3RhdGUiLCJldmVudCIsInJvdXRlRGF0YSIsImNhbGxiYWNrIiwicmVtb3ZlV2luZG93RXZlbnRzIiwibmF2aWdhdGUiLCJNVkMiLCJVdGlscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0VBQUFBLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIsR0FBMkJGLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIsSUFBNEJGLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkUsZ0JBQTdFO0VBQ0FILFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkcsR0FBdEIsR0FBNEJKLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkcsR0FBdEIsSUFBNkJKLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkksbUJBQS9FOztFQ0RBLE1BQU1DLE1BQU4sQ0FBYTtFQUNYQyxFQUFBQSxXQUFXLEdBQUc7O0VBQ2QsTUFBSUMsT0FBSixHQUFjO0VBQ1osU0FBS0MsTUFBTCxHQUFjLEtBQUtBLE1BQUwsSUFBZSxFQUE3QjtFQUNBLFdBQU8sS0FBS0EsTUFBWjtFQUNEOztFQUNEQyxFQUFBQSxpQkFBaUIsQ0FBQ0MsU0FBRCxFQUFZO0VBQUUsV0FBTyxLQUFLSCxPQUFMLENBQWFHLFNBQWIsS0FBMkIsRUFBbEM7RUFBc0M7O0VBQ3JFQyxFQUFBQSxvQkFBb0IsQ0FBQ0MsYUFBRCxFQUFnQjtFQUNsQyxXQUFRQSxhQUFhLENBQUNDLElBQWQsQ0FBbUJDLE1BQXBCLEdBQ0hGLGFBQWEsQ0FBQ0MsSUFEWCxHQUVILG1CQUZKO0VBR0Q7O0VBQ0RFLEVBQUFBLHFCQUFxQixDQUFDQyxjQUFELEVB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
