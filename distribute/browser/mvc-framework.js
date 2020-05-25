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



  var Utilities$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    UUID: UUID
  });

  class Service extends Events {
    constructor() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      super(...arguments);
      this.settings = settings;
      this.options = options;
    }

    get validSettings() {
      return ['url', 'method', 'mode', 'cache', 'credentials', 'headers', 'parameters', 'redirect', 'referrer-policy', 'body'];
    }

    get settings() {
      return this._settings;
    }

    set settings(settings) {
      this._settings = settings;
      this.validSettings.forEach(validSetting => {
        if (settings[validSetting]) this[validSetting] = settings[validSetting];
      });
    }

    get options() {
      if (!this._options) this._options = {};
      return this._options;
    }

    set options(options) {
      this._options = options;
    }

    get url() {
      if (this.parameters) {
        return this._url.concat(this.queryString);
      } else {
        return this._url;
      }
    }

    set url(url) {
      this._url = url;
    }

    get queryString() {
      var queryString = '';

      if (this.parameters) {
        var parameterString = Object.entries(this.parameters).reduce((parameterStrings, _ref) => {
          var [parameterKey, parameterValue] = _ref;
          var parameterString = parameterKey.concat('=', parameterValue);
          parameterStrings.push(parameterString);
          return parameterStrings;
        }, []).join('&');
        queryString = '?'.concat(parameterString);
      }

      return queryString;
    }

    get method() {
      return this._method;
    }

    set method(method) {
      this._method = method;
    }

    set mode(mode) {
      this._mode = mode;
    }

    get mode() {
      return this._mode;
    }

    set cache(cache) {
      this._cache = cache;
    }

    get cache() {
      return this._cache;
    }

    set credentials(credentials) {
      this._credentials = credentials;
    }

    get credentials() {
      return this._credentials;
    }

    set headers(headers) {
      this._headers = headers;
    }

    get headers() {
      return this._headers;
    }

    set redirect(redirect) {
      this._redirect = redirect;
    }

    get redirect() {
      return this._redirect;
    }

    set referrerPolicy(referrerPolicy) {
      this._referrerPolicy = referrerPolicy;
    }

    get referrerPolicy() {
      return this._referrerPolicy;
    }

    set body(body) {
      this._body = body;
    }

    get body() {
      return this._body;
    }

    get parameters() {
      return this._parameters || null;
    }

    set parameters(parameters) {
      this._parameters = parameters;
    }

    get previousAbortController() {
      return this._previousAbortController;
    }

    set previousAbortController(previousAbortController) {
      this._previousAbortController = previousAbortController;
    }

    get abortController() {
      if (!this._abortController) {
        this.previousAbortController = this._abortController;
      }

      this._abortController = new AbortController();
      return this._abortController;
    }

    abort() {
      this.abortController.abort();
      return this;
    }

    fetch() {
      var fetchOptions = this.validSettings.reduce((_fetchOptions, fetchOptionName) => {
        if (this[fetchOptionName]) _fetchOptions[fetchOptionName] = this[fetchOptionName];
        return _fetchOptions;
      }, {});
      fetchOptions.signal = this.abortController.signal;
      if (this.previousAbortController) this.previousAbortController.abort();
      return fetch(this.url, fetchOptions).then(response => response.json()).then(data => {
        if (data.code >= 400 && data.code <= 499) {
          throw data;
        } else {
          this.emit('ready', data, this);
          return data;
        }
      }).catch(error => {
        this.emit('error', error, this);
        return error;
      });
    }

  }

  var Model = class extends Events {
    constructor() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      super();
      this.settings = settings;
      this.options = options;
      this.emit('ready', {}, this);
    }

    get uuid() {
      if (!this._uuid) this._uuid = UUID();
      return this._uuid;
    }

    get validSettings() {
      return ['localStorage', 'defaults', 'services', 'serviceEvents', 'serviceCallbacks'];
    }

    get bindableEventClassPropertyTypes() {
      return ['service'];
    }

    get settings() {
      return this._settings;
    }

    set settings(settings) {
      this._settings = settings;
      this.validSettings.forEach(validSetting => {
        if (settings[validSetting]) this[validSetting] = settings[validSetting];
      });
      this.bindableEventClassPropertyTypes.forEach(bindableEventClassPropertyType => {
        this.toggleEvents(bindableEventClassPropertyType, 'on');
      });
    }

    get options() {
      if (!this._options) this._options = {};
      return this._options;
    }

    set options(options) {
      this._options = options;
    }

    get services() {
      if (!this._services) this._services = {};
      return this._services;
    }

    set services(services) {
      this._services = services;
    }

    get data() {
      if (!this._data) this._data = {};
      return this._data;
    }

    get defaults() {
      if (!this._defaults) this._defaults = {};
      return this._defaults;
    }

    set defaults(defaults) {
      if (this.localStorage.sync === true) {
        if (Object.entries(this.db).length === 0) {
          this._defaults = defaults;
        } else {
          this._defaults = this.db;
        }
      } else {
        this._defaults = defaults;
      }

      this.set(this.defaults);
    }

    get localStorage() {
      return this._localStorage || {};
    }

    set localStorage(localStorage) {
      this._localStorage = localStorage;
    }

    get storageContainer() {
      return {};
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

    resetEvents(classType) {
      ['off', 'on'].forEach(method => {
        this.toggleEvents(classType, method);
      });
      return this;
    }

    toggleEvents(classType, method) {
      var baseName = classType.concat('s');
      var baseEventsName = classType.concat('Events');
      var baseCallbacksName = classType.concat('Callbacks');
      var base = this[baseName];
      var baseEvents = this[baseEventsName];
      var baseCallbacks = this[baseCallbacksName];

      if (base && baseEvents && baseCallbacks) {
        Object.entries(baseEvents).forEach((_ref) => {
          var [baseEventData, baseCallbackName] = _ref;
          var [baseTargetName, baseEventName] = baseEventData.split(' ');
          var baseTarget = base[baseTargetName];
          var baseCallback = baseCallbacks[baseCallbackName];

          if (baseCallback && baseCallback.name.split(' ').length === 1) {
            baseCallback = baseCallback.bind(this);
          }

          if (baseTargetName && baseEventName && baseTarget && baseCallback) {
            try {
              baseTarget[method](baseEventName, baseCallback);
            } catch (error) {}
          }
        });
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
          var _key = arguments[0];
          var value = arguments[1];
          db[_key] = value;
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
          var _key2 = arguments[0];
          delete db[_key2];
          this._db = db;
          break;
      }

      return this;
    }

    setDataProperty(key, value, silent) {
      var currentDataProperty = this.data[key];

      if (!silent && currentDataProperty !== value) {
        this.emit('beforeSet'.concat(':', key), {
          key: key,
          value: this.get(key)
        }, {
          key: key,
          value: value
        }, this);
      }

      if (!currentDataProperty) {
        Object.defineProperties(this.data, {
          ['_'.concat(key)]: {
            configurable: true,
            writable: true,
            enumerable: false
          },
          [key]: {
            configurable: true,
            enumerable: true,

            get() {
              return this['_'.concat(key)];
            },

            set(value) {
              this['_'.concat(key)] = value;
            }

          }
        });
      }

      this.data[key] = value;

      if (currentDataProperty instanceof Model) {

        this.data[key].on('beforeSet', this.emit(event.name, event.data, model)).on('set', this.emit(event.name, event.data, model)).on('beforeUnset', this.emit(event.name, event.data, model)).on('unset', this.emit(event.name, event.data, model));
      }

      if (!silent && currentDataProperty !== value) {
        this.emit('set'.concat(':', key), {
          key: key,
          value: value
        }, this);
      }

      return this;
    }

    unsetDataProperty(key, silent) {
      if (!silent) {
        this.emit('beforeUnset'.concat(':', arguments[0]), this);
      }

      if (this.data[key]) {
        delete this.data[key];
      }

      if (!silent) {
        this.emit('unset'.concat(':', arguments[0]), this);
      }

      return this;
    }

    get() {
      if (arguments[0]) return this.data[arguments[0]];
      return Object.entries(this.data).reduce((_data, _ref3) => {
        var [key, value] = _ref3;
        _data[key] = value;
        return _data;
      }, {});
    }

    set() {
      var _arguments = Array.from(arguments);

      var key, value, silent;

      if (_arguments.length === 3) {
        key = _arguments[0];
        value = _arguments[1];
        silent = _arguments[2];
        if (!silent) this.emit('beforeSet', this.data, Object.assign({}, this.data, {
          [key]: value
        }), this);
        this.setDataProperty(key, value, silent);
        if (!silent) this.emit('set', this.data, this);
        if (this.localStorage.endpoint) this.setDB(arguments[0], arguments[1]);
      } else if (_arguments.length === 2) {
        if (typeof _arguments[0] === 'object' && typeof _arguments[1] === 'boolean') {
          silent = _arguments[1];
          if (!silent) this.emit('beforeSet', this.data, Object.assign({}, this.data, _arguments[0]), this);
          Object.entries(_arguments[0]).forEach((_ref4) => {
            var [key, value] = _ref4;
            this.setDataProperty(key, value, silent);
          });
          if (!silent) this.emit('set', this.data, this);
        } else {
          if (!silent) this.emit('beforeSet', this.data, Object.assign({}, this.data, {
            [_arguments[0]]: _arguments[1]
          }), this);
          this.setDataProperty(_arguments[0], _arguments[1]);
          if (!silent) this.emit('set', this.data, this);
        }

        if (this.localStorage.endpoint) this.setDB(_arguments[0], _arguments[1]);
      } else if (_arguments.length === 1 && !Array.isArray(_arguments[0]) && typeof _arguments[0] === 'object') {
        if (!silent) this.emit('beforeSet', this.data, Object.assign({}, this.data, _arguments[0]), this);
        Object.entries(_arguments[0]).forEach((_ref5) => {
          var [key, value] = _ref5;
          this.setDataProperty(key, value);
          if (this.localStorage.endpoint) this.setDB(key, value);
        });
        if (!silent) this.emit('set', this.data, this);
      }

      return this;
    }

    unset() {
      var silent;

      if (arguments.length === 2) {
        silent = arguments[1];
        if (!silent) this.emit('beforeUnset', this.data, this);
        this.unsetDataProperty(arguments[0], silent);
        if (!silent) this.emit('unset', this);
      } else if (arguments.length === 1) {
        if (typeof arguments[0] === 'boolean') {
          silent = arguments[0];
          if (!silent) this.emit('beforeUnset', this.data, this);
          Object.keys(this.data).forEach(key => {
            this.unsetDataProperty(key, silent);
          });
          if (!silent) this.emit('unset', this);
        }
      } else {
        if (!silent) this.emit('beforeUnset', this.data, this);
        Object.keys(this.data).forEach(key => {
          this.unsetDataProperty(key);
        });
        if (!silent) this.emit('unset', this);
      }

      if (this.localStorage.endpoint) this.unsetDB(key);
      return this;
    }

    parse() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.data;
      return Object.entries(data).reduce((_data, _ref6) => {
        var [key, value] = _ref6;

        if (value instanceof Model) {
          _data[key] = value.parse();
        } else {
          _data[key] = value;
        }

        return _data;
      }, {});
    }

  };

  class Collection extends Events {
    constructor() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      super();
      this.settings = settings;
      this.options = options;
    }

    get validSettings() {
      return ['idAttribute', 'model', 'defaults', 'services', 'serviceEvents', 'serviceCallbacks', 'localStorage'];
    }

    get bindableEventClassPropertyTypes() {
      return ['service'];
    }

    get settings() {
      return this._settings;
    }

    set settings(settings) {
      this._settings = settings;
      this.validSettings.forEach(validSetting => {
        if (settings[validSetting]) this[validSetting] = settings[validSetting];
      });
      this.bindableEventClassPropertyTypes.forEach(bindableEventClassPropertyType => {
        this.toggleEvents(bindableEventClassPropertyType, 'on');
      });
    }

    get options() {
      if (!this._options) this._options = {};
      return this._options;
    }

    set options(options) {
      this._options = options;
    }

    get storageContainer() {
      return [];
    }

    get defaultIDAttribute() {
      return '_id';
    }

    get defaults() {
      return this._defaults;
    }

    set defaults(defaults) {
      this._defaults = defaults;
      this.add(defaults);
    }

    get uuid() {
      if (!this._uuid) this._uuid = Utilities.UUID();
      return this._uuid;
    }

    get models() {
      this._models = this._models || this.storageContainer;
      return this._models;
    }

    set models(modelsData) {
      this._models = modelsData;
    }

    get model() {
      return this._model;
    }

    set model(model) {
      this._model = model;
    }

    get localStorage() {
      return this._localStorage;
    }

    set localStorage(localStorage) {
      this._localStorage = localStorage;
    }

    get data() {
      return this._data;
    }

    get data() {
      var modelsExist = Object.keys(this.models).length ? true : false;
      return modelsExist ? this.models.map(model => model.parse()) : [];
    }

    get db() {
      return this._db;
    }

    get db() {
      var db = localStorage.getItem(this.localStorage.endpoint) || JSON.stringify(this.storageContainer);
      return JSON.parse(db);
    }

    set db(db) {
      db = JSON.stringify(db);
      localStorage.setItem(this.localStorage.endpoint, db);
    }

    resetEvents(classType) {
      ['off', 'on'].forEach(method => {
        this.toggleEvents(classType, method);
      });
      return this;
    }

    toggleEvents(classType, method) {
      var baseName = classType.concat('s');
      var baseEventsName = classType.concat('Events');
      var baseCallbacksName = classType.concat('Callbacks');
      var base = this[baseName];
      var baseEvents = this[baseEventsName];
      var baseCallbacks = this[baseCallbacksName];

      if (base && baseEvents && baseCallbacks) {
        Object.entries(baseEvents).forEach((_ref) => {
          var [baseEventData, baseCallbackName] = _ref;
          var [baseTargetName, baseEventName] = baseEventData.split(' ');
          var baseTarget = base[baseTargetName];
          var baseCallback = baseCallbacks[baseCallbackName];

          if (baseCallback && baseCallback.name.split(' ').length === 1) {
            baseCallback = baseCallback.bind(this);
          }

          if (baseTargetName && baseEventName && baseTarget && baseCallback) {
            try {
              baseTarget[method](baseEventName, baseCallback);
            } catch (error) {}
          }
        });
      }

      return this;
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

      this.emit('remove:model', model[0].parse(), this, model[0]);
      return this;
    }

    addModel(modelData) {
      var model;
      var someModel = new Model();

      if (modelData instanceof Model) {
        model = modelData;
      } else if (this.model) {
        model = new this.model();
        model.set(modelData);
      } else {
        model = new Model();
        model.set(modelData);
      }

      model.on('set', (event, _model) => {
        this.emit('change:model', this.parse(), this, model);
      });
      this.models.push(model);
      this.emit('add', model.parse(), this, model);
      return model;
    }

    add(modelData) {
      if (Array.isArray(modelData)) {
        modelData.forEach(model => {
          this.addModel(model);
        });
      } else {
        this.addModel(modelData);
      }

      if (this.localStorage) this.db = this.data;
      this.emit('change', this.parse(), this);
      return this;
    }

    remove(modelData) {
      if (!Array.isArray(modelData) && typeof modelData === 'object') {
        var modelIndex = this.getModelIndex(modelData.uuid);
        this.removeModelByIndex(modelIndex);
      } else if (Array.isArray(modelData)) {
        modelData.forEach(model => {
          var modelIndex = this.getModelIndex(model.uuid);
          this.removeModelByIndex(modelIndex);
        });
      }

      this.models = this.models.filter(model => model !== null);
      if (this._localStorage) this.db = this.data;
      this.emit('remove', this.parse(), this);
      return this;
    }

    reset() {
      this.remove(this._models);
      return this;
    }

    parse(data) {
      data = data || this.data || this.storageContainer;
      return JSON.parse(JSON.stringify(data));
    }

  }

  class View extends Events {
    constructor() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      super();
      this.settings = settings;
      this.options = options;
    }

    get validSettings() {
      return ['attributes', 'elementName', 'element', 'insert', 'template', 'uiElements', 'uiElementEvents', 'uiElementCallbacks', 'render'];
    }

    get settings() {
      return this._settings;
    }

    set settings(settings) {
      this._settings = settings;
      this.validSettings.forEach(validSetting => {
        if (settings[validSetting]) this[validSetting] = settings[validSetting];
      });
    }

    get options() {
      if (!this._options) this._options = {};
      return this._options;
    }

    set options(options) {
      this._options = options;
    }

    get elementName() {
      return this._elementName;
    }

    set elementName(elementName) {
      this._elementName = elementName;
    }

    get element() {
      if (!this._element) {
        this._element = document.createElement(this.elementName);
        Object.entries(this.attributes).forEach((_ref) => {
          var [attributeKey, attributeValue] = _ref;

          this._element.setAttribute(attributeKey, attributeValue);
        });
        this.elementObserver.observe(this.element, {
          subtree: true,
          childList: true
        });
      }

      return this._element;
    }

    get elementObserver() {
      this._elementObserver = this._elementObserver || new MutationObserver(this.elementObserve.bind(this));
      return this._elementObserver;
    }

    set element(element) {
      if (element instanceof HTMLElement) this._element = element;
    }

    get attributes() {
      return this._attributes || {};
    }

    set attributes(attributes) {
      this._attributes = attributes;
    }

    get template() {
      return this._template;
    }

    set template(template) {
      this._template = template;
    }

    get uiElements() {
      return this._uiElements || {};
    }

    set uiElements(uiElements) {
      this._uiElements = uiElements;
      this.toggleEvents();
    }

    get uiElementEvents() {
      return this._uiElementEvents || {};
    }

    set uiElementEvents(uiElementEvents) {
      this._uiElementEvents = uiElementEvents;
      this.toggleEvents();
    }

    get uiElementCallbacks() {
      return this._uiElementCallbacks || {};
    }

    set uiElementCallbacks(uiElementCallbacks) {
      this._uiElementCallbacks = uiElementCallbacks;
      this.toggleEvents();
    }

    get ui() {
      var context = this;

      if (!this._ui) {
        this._ui = Object.entries(this.uiElements).reduce((_ui, _ref2) => {
          var [uiElementName, uiElementQuery] = _ref2;
          Object.defineProperties(_ui, {
            [uiElementName]: {
              get() {
                if (typeof uiElementQuery === 'string') {
                  var queryResults = context.element.querySelectorAll(uiElementQuery);
                  return queryResults.length > 1 ? queryResults : queryResults.item(0);
                } else if (uiElementQuery instanceof HTMLElement || uiElementQuery instanceof Document || uiElementQuery instanceof Window) {
                  return uiElementQuery;
                }
              }

            }
          });
          return _ui;
        }, {});
        Object.defineProperties(this._ui, {
          '$element': {
            get() {
              return context.element;
            }

          }
        });
      }

      return this._ui;
    }

    elementObserve(mutationRecordList, observer) {
      for (var [mutationRecordIndex, mutationRecord] of Object.entries(mutationRecordList)) {
        switch (mutationRecord.type) {
          case 'childList':
            if (mutationRecord.addedNodes.length) {
              // Object.entries(Object.getOwnPropertyDescriptors(this.ui))
              // .forEach(([uiKey, uiValue]) => {
              //   const uiValueGet = uiValue.get()
              //   const addedUIElement = Array.from(mutationRecord.addedNodes).find((addedNode) => {
              //     console.log('addedNode', addedNode)
              //     console.log('uiValueGet', uiValueGet)
              //     return addedNode === uiValueGet
              //   })
              //   if(addedUIElement) {
              //     this.toggleEvents(uiKey)
              //   }
              // })
              this.toggleEvents();
            }

            break;
        }
      }
    }

    bindEventToElement(element, method, eventName, eventCallbackName) {
      try {
        switch (method) {
          case 'addEventListener':
            this.uiElementCallbacks[eventCallbackName] = this.uiElementCallbacks[eventCallbackName].bind(this);
            element[method](eventName, this.uiElementCallbacks[eventCallbackName]);
            break;

          case 'removeEventListener':
            element[method](eventName, this.uiElementCallbacks[eventCallbackName]);
            break;
        }
      } catch (error) {}
    }

    toggleEvents() {
      var targetUIElementName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.isToggling = true;
      var ui = this.ui;
      var eventBindMethods = ['removeEventListener', 'addEventListener'];

      if (!targetUIElementName) {
        eventBindMethods.forEach(eventBindMethod => {
          Object.entries(this.uiElementEvents).forEach((_ref3) => {
            var [uiElementEventSettings, uiElementEventCallbackName] = _ref3;
            var [uiElementName, uiElementEventName] = uiElementEventSettings.split(' ');

            if (ui[uiElementName] instanceof NodeList) {
              ui[uiElementName].forEach(uiElement => {
                this.bindEventToElement(uiElement, eventBindMethod, uiElementEventName, uiElementEventCallbackName);
              });
            } else if (ui[uiElementName] instanceof HTMLElement || ui[uiElementName] instanceof Document || ui[uiElementName] instanceof Window) {
              this.bindEventToElement(ui[uiElementName], eventBindMethod, uiElementEventName, uiElementEventCallbackName);
            }
          });
        });
      } else {
        eventBindMethods.forEach(eventBindMethod => {
          var uiElementEvents = Object.entries(this.uiElementEvents).forEach((_ref4) => {
            var [uiElementEventSettings, uiElementEventCallbackName] = _ref4;
            var [uiElementName, uiElementEventName] = uiElementEventSettings.split(' ');

            if (targetUIElementName === uiElementName) {
              if (ui[uiElementName] instanceof NodeList) {
                ui[uiElementName].forEach(uiElement => {
                  this.bindEventToElement(uiElement, eventBindMethod, uiElementEventName, uiElementEventCallbackName);
                });
              } else if (ui[uiElementName] instanceof HTMLElement) {
                this.bindEventToElement(ui[uiElementName], eventBindMethod, uiElementEventName, uiElementEventCallbackName);
              }
            }
          });
        });
      }

      this.isToggling = false;
      return this;
    }

    autoInsert() {
      if (this.insert) {
        var parent = typeof this.insert.parent === 'string' ? document.querySelector(this.insert.parent) : this.insert.parent instanceof HTMLElement ? this.insert.parent : null;
        var method = this.insert.method;
        parent.insertAdjacentElement(method, this.element);
      }

      return this;
    }

    autoRemove() {
      if (this.element.parentElement) {
        this.element.parentElement.removeChild(this.element);
      }

      return this;
    }

    render() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (this.template) {
        var template = this.template(data);
        this.element.innerHTML = template;
      }

      this.toggleEvents();
      return this;
    }

  }

  var Controller = class extends Events {
    constructor() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      super();
      this.settings = settings;
      this.options = options;
    }

    get validSettings() {
      return ['models', 'modelEvents', 'modelCallbacks', 'collections', 'collectionEvents', 'collectionCallbacks', 'views', 'viewEvents', 'viewCallbacks', 'controllers', 'controllerEvents', 'controllerCallbacks', 'routers', 'routerEvents', 'routerCallbacks'];
    }

    get bindableEventClassPropertyTypes() {
      return ['model', 'view', 'collection', 'controller', 'router'];
    }

    get options() {
      if (!this._options) this._options = {};
      return this._options;
    }

    set options(options) {
      this._options = options;
    }

    get settings() {
      if (!this._settings) this._settings = {};
      return this._settings;
    }

    set settings(settings) {
      this._settings = settings;
      this.validSettings.forEach(validSetting => {
        if (this.settings[validSetting]) {
          Object.defineProperties(this, {
            ['_'.concat(validSetting)]: {
              configurable: true,
              writable: true,
              enumberable: false
            },
            [validSetting]: {
              configurable: true,
              enumerable: true,

              get() {
                return this['_'.concat(validSetting)];
              },

              set(value) {
                this['_'.concat(validSetting)] = value;
              }

            }
          });
          this[validSetting] = this.settings[validSetting];
        }
      });
      this.bindableEventClassPropertyTypes.forEach(bindableEventClassPropertyType => {
        this.resetEvents(bindableEventClassPropertyType);
      });
    }

    resetEvents(classType) {
      ['off', 'on'].forEach(method => {
        this.toggleEvents(classType, method);
      });
      return this;
    }

    toggleEvents(classType, method) {
      var baseName = classType.concat('s');
      var baseEventsName = classType.concat('Events');
      var baseCallbacksName = classType.concat('Callbacks');
      var base = this[baseName] || {};
      var baseEvents = this[baseEventsName] || {};
      var baseCallbacks = this[baseCallbacksName] || {};

      if (Object.values(base).length && Object.values(baseEvents).length && Object.values(baseCallbacks).length) {
        Object.entries(baseEvents).forEach((_ref) => {
          var [baseEventData, baseCallbackName] = _ref;
          var [baseTargetName, baseEventName] = baseEventData.split(' ');
          var baseTargetNameSubstringFirst = baseTargetName.substring(0, 1);
          var baseTargetNameSubstringLast = baseTargetName.substring(baseTargetName.length - 1);
          var baseTargets = [];

          if (baseTargetNameSubstringFirst === '[' && baseTargetNameSubstringLast === ']') {
            baseTargets = Object.entries(base).reduce((_baseTargets, _ref2) => {
              var [baseName, baseTarget] = _ref2;
              var baseTargetNameRegExpString = baseTargetName.slice(1, -1);
              var baseTargetNameRegExp = new RegExp(baseTargetNameRegExpString);

              if (baseName.match(baseTargetNameRegExp)) {
                _baseTargets.push(baseTarget);
              }

              return _baseTargets;
            }, []);
          } else if (base[baseTargetName]) {
            baseTargets.push(base[baseTargetName]);
          }

          var baseEventCallback = baseCallbacks[baseCallbackName];

          if (baseEventCallback && baseEventCallback.name.split(' ').length === 1) {
            baseEventCallback = baseEventCallback.bind(this);
          }

          if (baseTargetName && baseEventName && baseTargets.length && baseEventCallback) {
            baseTargets.forEach(baseTarget => {
              try {
                switch (method) {
                  case 'on':
                    baseTarget[method](baseEventName, baseEventCallback);
                    break;

                  case 'off':
                    baseTarget[method](baseEventName, baseEventCallback);
                    break;
                }
              } catch (error) {
                throw error;
              }
            });
          }
        });
      }

      return this;
    }

  };

  var Router = class extends Events {
    constructor() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      super();
      this.settings = settings;
      this.options = options;
      this.addSettings();
      this.addWindowEvents();
    }

    get validSettings() {
      return ['root', 'hashRouting', 'controller', 'routes'];
    }

    get settings() {
      return this._settings;
    }

    set settings(settings) {
      this._settings = settings;
      this.validSettings.forEach(validSetting => {
        if (settings[validSetting]) this[validSetting] = settings[validSetting];
      });
    }

    get options() {
      if (!this._options) this._options = {};
      return this._options;
    }

    set options(options) {
      this._options = options;
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

    get root() {
      return this._root || '/';
    }

    set root(root) {
      this._root = root;
    }

    get hashRouting() {
      return this._hashRouting || false;
    }

    set hashRouting(hashRouting) {
      this._hashRouting = hashRouting;
    }

    get routes() {
      return this._routes;
    }

    set routes(routes) {
      this._routes = routes;
    }

    get controller() {
      return this._controller;
    }

    set controller(controller) {
      this._controller = controller;
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
    Utilities: Utilities$1,
    Service,
    Model,
    Collection,
    View,
    Controller,
    Router
  };

  return MVC;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxpdGllcy91dWlkLmpzIiwiLi4vLi4vc291cmNlL01WQy9TZXJ2aWNlL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Nb2RlbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29sbGVjdGlvbi9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVmlldy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29udHJvbGxlci9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvUm91dGVyL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJFdmVudFRhcmdldC5wcm90b3R5cGUub24gPSBFdmVudFRhcmdldC5wcm90b3R5cGUub24gfHwgRXZlbnRUYXJnZXQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXJcclxuRXZlbnRUYXJnZXQucHJvdG90eXBlLm9mZiA9IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vZmYgfHwgRXZlbnRUYXJnZXQucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXJcclxuIiwiY2xhc3MgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9ldmVudHMoKSB7XHJcbiAgICB0aGlzLmV2ZW50cyA9IHRoaXMuZXZlbnRzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5ldmVudHNcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKSB7IHJldHVybiB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSB8fCB7fSB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIChldmVudENhbGxiYWNrLm5hbWUubGVuZ3RoKVxyXG4gICAgICA/IGV2ZW50Q2FsbGJhY2submFtZVxyXG4gICAgICA6ICdhbm9ueW1vdXNGdW5jdGlvbidcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSkge1xyXG4gICAgcmV0dXJuIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSB8fCBbXVxyXG4gIH1cclxuICBvbihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tOYW1lID0gdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tHcm91cCA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSlcclxuICAgIGV2ZW50Q2FsbGJhY2tHcm91cC5wdXNoKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gPSBldmVudENhbGxiYWNrR3JvdXBcclxuICAgIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdID0gZXZlbnRDYWxsYmFja3NcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIG9mZigpIHtcclxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIGNhc2UgMDpcclxuICAgICAgICBkZWxldGUgdGhpcy5ldmVudHNcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2sgPSBhcmd1bWVudHNbMV1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFja05hbWUgPSAodHlwZW9mIGV2ZW50Q2FsbGJhY2sgPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgPyBldmVudENhbGxiYWNrXHJcbiAgICAgICAgICA6IHRoaXMuZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgICAgICBpZih0aGlzLl9ldmVudHNbZXZlbnROYW1lXSkge1xyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdW2V2ZW50Q2FsbGJhY2tOYW1lXVxyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKS5sZW5ndGggPT09IDBcclxuICAgICAgICAgICkgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBlbWl0KCkge1xyXG4gICAgbGV0IF9hcmd1bWVudHMgPSBBcnJheS5mcm9tKGFyZ3VtZW50cylcclxuICAgIGxldCBldmVudE5hbWUgPSBfYXJndW1lbnRzLnNwbGljZSgwLCAxKVswXVxyXG4gICAgbGV0IGV2ZW50RGF0YSA9IF9hcmd1bWVudHMuc3BsaWNlKDAsIDEpWzBdXHJcbiAgICBsZXQgZXZlbnRBcmd1bWVudHMgPSBfYXJndW1lbnRzLnNwbGljZSgwKVxyXG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5nZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpKVxyXG4gICAgICAuZm9yRWFjaCgoW2V2ZW50Q2FsbGJhY2tHcm91cE5hbWUsIGV2ZW50Q2FsbGJhY2tHcm91cF0pID0+IHtcclxuICAgICAgICBldmVudENhbGxiYWNrR3JvdXBcclxuICAgICAgICAgIC5mb3JFYWNoKChldmVudENhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgIGV2ZW50Q2FsbGJhY2soXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogZXZlbnROYW1lLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZXZlbnREYXRhXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAuLi5ldmVudEFyZ3VtZW50c1xyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRzXHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9yZXNwb25zZXMoKSB7XHJcbiAgICB0aGlzLnJlc3BvbnNlcyA9IHRoaXMucmVzcG9uc2VzXHJcbiAgICAgID8gdGhpcy5yZXNwb25zZXNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMucmVzcG9uc2VzXHJcbiAgfVxyXG4gIHJlc3BvbnNlKHJlc3BvbnNlTmFtZSwgcmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgaWYgKHJlc3BvbnNlQ2FsbGJhY2spIHtcclxuICAgICAgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0gPSByZXNwb25zZUNhbGxiYWNrXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlXVxyXG4gICAgfVxyXG4gIH1cclxuICByZXF1ZXN0KHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYgKHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKSB7XHJcbiAgICAgIHZhciBfYXJndW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5zbGljZSgxKVxyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0oLi4uX2FyZ3VtZW50cylcclxuICAgIH1cclxuICB9XHJcbiAgb2ZmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYgKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAodmFyIFtfcmVzcG9uc2VOYW1lXSBvZiBPYmplY3Qua2V5cyh0aGlzLl9yZXNwb25zZXMpKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tfcmVzcG9uc2VOYW1lXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBDaGFubmVsIGZyb20gJy4vQ2hhbm5lbC9pbmRleCdcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2NoYW5uZWxzKCkge1xyXG4gICAgdGhpcy5jaGFubmVscyA9IHRoaXMuY2hhbm5lbHNcclxuICAgICAgPyB0aGlzLmNoYW5uZWxzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmNoYW5uZWxzXHJcbiAgfVxyXG4gIGNoYW5uZWwoY2hhbm5lbE5hbWUpIHtcclxuICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXSA9IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA/IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA6IG5ldyBDaGFubmVsKClcclxuICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbiAgb2ZmKGNoYW5uZWxOYW1lKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFVVSUQoKSB7XHJcbiAgdmFyIHV1aWQgPSBcIlwiLCBpLCByYW5kb21cclxuICBmb3IgKGkgPSAwOyBpIDwgMzI7IGkrKykge1xyXG4gICAgcmFuZG9tID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMFxyXG5cclxuICAgIGlmIChpID09IDggfHwgaSA9PSAxMiB8fCBpID09IDE2IHx8IGkgPT0gMjApIHtcclxuICAgICAgdXVpZCArPSBcIi1cIlxyXG4gICAgfVxyXG4gICAgdXVpZCArPSAoaSA9PSAxMiA/IDQgOiAoaSA9PSAxNiA/IChyYW5kb20gJiAzIHwgOCkgOiByYW5kb20pKS50b1N0cmluZygxNilcclxuICB9XHJcbiAgcmV0dXJuIHV1aWRcclxufVxyXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleCdcblxuY2xhc3MgU2VydmljZSBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ3VybCcsXG4gICAgJ21ldGhvZCcsXG4gICAgJ21vZGUnLFxuICAgICdjYWNoZScsXG4gICAgJ2NyZWRlbnRpYWxzJyxcbiAgICAnaGVhZGVycycsXG4gICAgJ3BhcmFtZXRlcnMnLFxuICAgICdyZWRpcmVjdCcsXG4gICAgJ3JlZmVycmVyLXBvbGljeScsXG4gICAgJ2JvZHknLFxuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCB1cmwoKSB7XG4gICAgaWYodGhpcy5wYXJhbWV0ZXJzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsLmNvbmNhdCh0aGlzLnF1ZXJ5U3RyaW5nKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsXG4gICAgfVxuICB9XG4gIHNldCB1cmwodXJsKSB7IHRoaXMuX3VybCA9IHVybCB9XG4gIGdldCBxdWVyeVN0cmluZygpIHtcbiAgICBsZXQgcXVlcnlTdHJpbmcgPSAnJ1xuICAgIGlmKHRoaXMucGFyYW1ldGVycykge1xuICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IE9iamVjdC5lbnRyaWVzKHRoaXMucGFyYW1ldGVycylcbiAgICAgICAgLnJlZHVjZSgocGFyYW1ldGVyU3RyaW5ncywgW3BhcmFtZXRlcktleSwgcGFyYW1ldGVyVmFsdWVdKSA9PiB7XG4gICAgICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IHBhcmFtZXRlcktleS5jb25jYXQoJz0nLCBwYXJhbWV0ZXJWYWx1ZSlcbiAgICAgICAgICBwYXJhbWV0ZXJTdHJpbmdzLnB1c2gocGFyYW1ldGVyU3RyaW5nKVxuICAgICAgICAgIHJldHVybiBwYXJhbWV0ZXJTdHJpbmdzXG4gICAgICAgIH0sIFtdKVxuICAgICAgICAgIC5qb2luKCcmJylcbiAgICAgIHF1ZXJ5U3RyaW5nID0gJz8nLmNvbmNhdChwYXJhbWV0ZXJTdHJpbmcpXG4gICAgfVxuICAgIHJldHVybiBxdWVyeVN0cmluZ1xuICB9XG4gIGdldCBtZXRob2QoKSB7IHJldHVybiB0aGlzLl9tZXRob2QgfVxuICBzZXQgbWV0aG9kKG1ldGhvZCkgeyB0aGlzLl9tZXRob2QgPSBtZXRob2QgfVxuICBzZXQgbW9kZShtb2RlKSB7IHRoaXMuX21vZGUgPSBtb2RlIH1cbiAgZ2V0IG1vZGUoKSB7IHJldHVybiB0aGlzLl9tb2RlIH1cbiAgc2V0IGNhY2hlKGNhY2hlKSB7IHRoaXMuX2NhY2hlID0gY2FjaGUgfVxuICBnZXQgY2FjaGUoKSB7IHJldHVybiB0aGlzLl9jYWNoZSB9XG4gIHNldCBjcmVkZW50aWFscyhjcmVkZW50aWFscykgeyB0aGlzLl9jcmVkZW50aWFscyA9IGNyZWRlbnRpYWxzIH1cbiAgZ2V0IGNyZWRlbnRpYWxzKCkgeyByZXR1cm4gdGhpcy5fY3JlZGVudGlhbHMgfVxuICBzZXQgaGVhZGVycyhoZWFkZXJzKSB7IHRoaXMuX2hlYWRlcnMgPSBoZWFkZXJzIH1cbiAgZ2V0IGhlYWRlcnMoKSB7IHJldHVybiB0aGlzLl9oZWFkZXJzIH1cbiAgc2V0IHJlZGlyZWN0KHJlZGlyZWN0KSB7IHRoaXMuX3JlZGlyZWN0ID0gcmVkaXJlY3QgfVxuICBnZXQgcmVkaXJlY3QoKSB7IHJldHVybiB0aGlzLl9yZWRpcmVjdCB9XG4gIHNldCByZWZlcnJlclBvbGljeShyZWZlcnJlclBvbGljeSkgeyB0aGlzLl9yZWZlcnJlclBvbGljeSA9IHJlZmVycmVyUG9saWN5IH1cbiAgZ2V0IHJlZmVycmVyUG9saWN5KCkgeyByZXR1cm4gdGhpcy5fcmVmZXJyZXJQb2xpY3kgfVxuICBzZXQgYm9keShib2R5KSB7IHRoaXMuX2JvZHkgPSBib2R5IH1cbiAgZ2V0IGJvZHkoKSB7IHJldHVybiB0aGlzLl9ib2R5IH1cbiAgZ2V0IHBhcmFtZXRlcnMoKSB7IHJldHVybiB0aGlzLl9wYXJhbWV0ZXJzIHx8IG51bGwgfVxuICBzZXQgcGFyYW1ldGVycyhwYXJhbWV0ZXJzKSB7IHRoaXMuX3BhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzIH1cbiAgZ2V0IHByZXZpb3VzQWJvcnRDb250cm9sbGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9wcmV2aW91c0Fib3J0Q29udHJvbGxlclxuICB9XG4gIHNldCBwcmV2aW91c0Fib3J0Q29udHJvbGxlcihwcmV2aW91c0Fib3J0Q29udHJvbGxlcikgeyB0aGlzLl9wcmV2aW91c0Fib3J0Q29udHJvbGxlciA9IHByZXZpb3VzQWJvcnRDb250cm9sbGVyIH1cbiAgZ2V0IGFib3J0Q29udHJvbGxlcigpIHtcbiAgICBpZighdGhpcy5fYWJvcnRDb250cm9sbGVyKSB7XG4gICAgICB0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyID0gdGhpcy5fYWJvcnRDb250cm9sbGVyXG4gICAgfVxuICAgIHRoaXMuX2Fib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKVxuICAgIHJldHVybiB0aGlzLl9hYm9ydENvbnRyb2xsZXJcbiAgfVxuICBhYm9ydCgpIHtcbiAgICB0aGlzLmFib3J0Q29udHJvbGxlci5hYm9ydCgpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBmZXRjaCgpIHtcbiAgICBjb25zdCBmZXRjaE9wdGlvbnMgPSB0aGlzLnZhbGlkU2V0dGluZ3MucmVkdWNlKChfZmV0Y2hPcHRpb25zLCBmZXRjaE9wdGlvbk5hbWUpID0+IHtcbiAgICAgIGlmKHRoaXNbZmV0Y2hPcHRpb25OYW1lXSkgX2ZldGNoT3B0aW9uc1tmZXRjaE9wdGlvbk5hbWVdID0gdGhpc1tmZXRjaE9wdGlvbk5hbWVdXG4gICAgICByZXR1cm4gX2ZldGNoT3B0aW9uc1xuICAgIH0sIHt9KVxuICAgIGZldGNoT3B0aW9ucy5zaWduYWwgPSB0aGlzLmFib3J0Q29udHJvbGxlci5zaWduYWxcbiAgICBpZih0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyKSB0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyLmFib3J0KClcbiAgICByZXR1cm4gZmV0Y2godGhpcy51cmwsIGZldGNoT3B0aW9ucylcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgaWYoXG4gICAgICAgICAgZGF0YS5jb2RlID49IDQwMCAmJlxuICAgICAgICAgIGRhdGEuY29kZSA8PSA0OTlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhyb3cgZGF0YVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgICAgICdyZWFkeScsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICApXG4gICAgICAgICAgcmV0dXJuIGRhdGFcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAgICdlcnJvcicsXG4gICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gZXJyb3JcbiAgICAgIH0pXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFNlcnZpY2VcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4uL1V0aWxpdGllcy9pbmRleCdcblxuY29uc3QgTW9kZWwgPSBjbGFzcyBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy5lbWl0KFxuICAgICAgJ3JlYWR5JyxcbiAgICAgIHt9LFxuICAgICAgdGhpcyxcbiAgICApXG4gIH1cbiAgZ2V0IHV1aWQoKSB7XG4gICAgaWYoIXRoaXMuX3V1aWQpIHRoaXMuX3V1aWQgPSBVVUlEKClcbiAgICByZXR1cm4gdGhpcy5fdXVpZFxuICB9XG4gIGdldCB2YWxpZFNldHRpbmdzKCkgeyByZXR1cm4gW1xuICAgICdsb2NhbFN0b3JhZ2UnLFxuICAgICdkZWZhdWx0cycsXG4gICAgJ3NlcnZpY2VzJyxcbiAgICAnc2VydmljZUV2ZW50cycsXG4gICAgJ3NlcnZpY2VDYWxsYmFja3MnLFxuICBdIH1cbiAgZ2V0IGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXMoKSB7IHJldHVybiBbXG4gICAgJ3NlcnZpY2UnLFxuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gICAgdGhpcy5iaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzXG4gICAgICAuZm9yRWFjaCgoYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlKSA9PiB7XG4gICAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSwgJ29uJylcbiAgICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCBzZXJ2aWNlcygpIHtcbiAgICBpZighdGhpcy5fc2VydmljZXMpIHRoaXMuX3NlcnZpY2VzID0ge31cbiAgICByZXR1cm4gdGhpcy5fc2VydmljZXNcbiAgfVxuICBzZXQgc2VydmljZXMoc2VydmljZXMpIHsgdGhpcy5fc2VydmljZXMgPSBzZXJ2aWNlcyB9XG4gIGdldCBkYXRhKCkge1xuICAgIGlmKCF0aGlzLl9kYXRhKSB0aGlzLl9kYXRhID0ge31cbiAgICByZXR1cm4gdGhpcy5fZGF0YVxuICB9XG4gIGdldCBkZWZhdWx0cygpIHtcbiAgICBpZighdGhpcy5fZGVmYXVsdHMpIHRoaXMuX2RlZmF1bHRzID0ge31cbiAgICByZXR1cm4gdGhpcy5fZGVmYXVsdHNcbiAgfVxuICBzZXQgZGVmYXVsdHMoZGVmYXVsdHMpIHtcbiAgICBpZih0aGlzLmxvY2FsU3RvcmFnZS5zeW5jID09PSB0cnVlKSB7XG4gICAgICBpZihPYmplY3QuZW50cmllcyh0aGlzLmRiKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdHMgPSB0aGlzLmRiXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RlZmF1bHRzID0gZGVmYXVsdHNcbiAgICB9XG4gICAgdGhpcy5zZXQodGhpcy5kZWZhdWx0cylcbiAgfVxuICBnZXQgbG9jYWxTdG9yYWdlKCkgeyByZXR1cm4gdGhpcy5fbG9jYWxTdG9yYWdlIHx8IHt9IH1cbiAgc2V0IGxvY2FsU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHsgdGhpcy5fbG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yYWdlIH1cbiAgZ2V0IHN0b3JhZ2VDb250YWluZXIoKSB7IHJldHVybiB7fSB9XG4gIGdldCBkYigpIHsgcmV0dXJuIHRoaXMuX2RiIH1cbiAgZ2V0IF9kYigpIHtcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgfHwgSlNPTi5zdHJpbmdpZnkodGhpcy5zdG9yYWdlQ29udGFpbmVyKVxuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICByZXNldEV2ZW50cyhjbGFzc1R5cGUpIHtcbiAgICBbXG4gICAgICAnb2ZmJyxcbiAgICAgICdvbidcbiAgICBdLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICAgICAgdGhpcy50b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpXG4gICAgfSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZCkge1xuICAgIGNvbnN0IGJhc2VOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgncycpXG4gICAgY29uc3QgYmFzZUV2ZW50c05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdFdmVudHMnKVxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3NOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJylcbiAgICBjb25zdCBiYXNlID0gdGhpc1tiYXNlTmFtZV1cbiAgICBjb25zdCBiYXNlRXZlbnRzID0gdGhpc1tiYXNlRXZlbnRzTmFtZV1cbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzID0gdGhpc1tiYXNlQ2FsbGJhY2tzTmFtZV1cbiAgICBpZihcbiAgICAgIGJhc2UgJiZcbiAgICAgIGJhc2VFdmVudHMgJiZcbiAgICAgIGJhc2VDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKGJhc2VFdmVudHMpXG4gICAgICAgIC5mb3JFYWNoKChbYmFzZUV2ZW50RGF0YSwgYmFzZUNhbGxiYWNrTmFtZV0pID0+IHtcbiAgICAgICAgICBsZXQgW2Jhc2VUYXJnZXROYW1lLCBiYXNlRXZlbnROYW1lXSA9IGJhc2VFdmVudERhdGEuc3BsaXQoJyAnKVxuICAgICAgICAgIGxldCBiYXNlVGFyZ2V0ID0gYmFzZVtiYXNlVGFyZ2V0TmFtZV1cbiAgICAgICAgICBsZXQgYmFzZUNhbGxiYWNrID0gYmFzZUNhbGxiYWNrc1tiYXNlQ2FsbGJhY2tOYW1lXVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrICYmXG4gICAgICAgICAgICBiYXNlQ2FsbGJhY2submFtZS5zcGxpdCgnICcpLmxlbmd0aCA9PT0gMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZUNhbGxiYWNrID0gYmFzZUNhbGxiYWNrLmJpbmQodGhpcylcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldCAmJlxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBiYXNlVGFyZ2V0W21ldGhvZF0oYmFzZUV2ZW50TmFtZSwgYmFzZUNhbGxiYWNrKVxuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge31cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0REIoKSB7XG4gICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICB2YXIgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBsZXQgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgZGJba2V5XSA9IHZhbHVlXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHRoaXMuX2RiID0gZGJcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0REIoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZGVsZXRlIHRoaXMuX2RiXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgZGVsZXRlIGRiW2tleV1cbiAgICAgICAgdGhpcy5fZGIgPSBkYlxuICAgICAgICBicmVha1xuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlLCBzaWxlbnQpIHtcbiAgICBjb25zdCBjdXJyZW50RGF0YVByb3BlcnR5ID0gdGhpcy5kYXRhW2tleV1cbiAgICBpZihcbiAgICAgICFzaWxlbnQgJiZcbiAgICAgIGN1cnJlbnREYXRhUHJvcGVydHkgIT09IHZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLmVtaXQoJ2JlZm9yZVNldCcuY29uY2F0KCc6Jywga2V5KSwge1xuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgdmFsdWU6IHRoaXMuZ2V0KGtleSksXG4gICAgICB9LCB7XG4gICAgICAgIGtleToga2V5LFxuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICB9LCB0aGlzKVxuICAgIH1cbiAgICBpZighY3VycmVudERhdGFQcm9wZXJ0eSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcy5kYXRhLCB7XG4gICAgICAgIFsnXycuY29uY2F0KGtleSldOiB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBba2V5XToge1xuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNbJ18nLmNvbmNhdChrZXkpXSB9LFxuICAgICAgICAgIHNldCh2YWx1ZSkgeyB0aGlzWydfJy5jb25jYXQoa2V5KV0gPSB2YWx1ZSB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLmRhdGFba2V5XSA9IHZhbHVlXG4gICAgaWYoY3VycmVudERhdGFQcm9wZXJ0eSBpbnN0YW5jZW9mIE1vZGVsKSB7XG4gICAgICBjb25zdCBlbWl0ID0gKG5hbWUsIGRhdGEsIG1vZGVsKSA9PiB0aGlzLmVtaXQobmFtZSwgZGF0YSwgbW9kZWwpXG4gICAgICB0aGlzLmRhdGFba2V5XVxuICAgICAgICAub24oJ2JlZm9yZVNldCcsIHRoaXMuZW1pdChldmVudC5uYW1lLCBldmVudC5kYXRhLCBtb2RlbCkpXG4gICAgICAgIC5vbignc2V0JywgdGhpcy5lbWl0KGV2ZW50Lm5hbWUsIGV2ZW50LmRhdGEsIG1vZGVsKSlcbiAgICAgICAgLm9uKCdiZWZvcmVVbnNldCcsIHRoaXMuZW1pdChldmVudC5uYW1lLCBldmVudC5kYXRhLCBtb2RlbCkpXG4gICAgICAgIC5vbigndW5zZXQnLCB0aGlzLmVtaXQoZXZlbnQubmFtZSwgZXZlbnQuZGF0YSwgbW9kZWwpKVxuICAgIH1cbiAgICBpZihcbiAgICAgICFzaWxlbnQgJiZcbiAgICAgIGN1cnJlbnREYXRhUHJvcGVydHkgIT09IHZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLmVtaXQoJ3NldCcuY29uY2F0KCc6Jywga2V5KSwge1xuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgfSwgdGhpcylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldERhdGFQcm9wZXJ0eShrZXksIHNpbGVudCkge1xuICAgIGlmKCFzaWxlbnQpIHtcbiAgICAgIHRoaXMuZW1pdCgnYmVmb3JlVW5zZXQnLmNvbmNhdCgnOicsIGFyZ3VtZW50c1swXSksIHRoaXMpXG4gICAgfVxuICAgIGlmKHRoaXMuZGF0YVtrZXldKSB7XG4gICAgICBkZWxldGUgdGhpcy5kYXRhW2tleV1cbiAgICB9XG4gICAgaWYoIXNpbGVudCkge1xuICAgICAgdGhpcy5lbWl0KCd1bnNldCcuY29uY2F0KCc6JywgYXJndW1lbnRzWzBdKSwgdGhpcylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBnZXQoKSB7XG4gICAgaWYoYXJndW1lbnRzWzBdKSByZXR1cm4gdGhpcy5kYXRhW2FyZ3VtZW50c1swXV1cbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy5kYXRhKVxuICAgICAgLnJlZHVjZSgoX2RhdGEsIFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBfZGF0YVtrZXldID0gdmFsdWVcbiAgICAgICAgcmV0dXJuIF9kYXRhXG4gICAgICB9LCB7fSlcbiAgfVxuICBzZXQoKSB7XG4gICAgY29uc3QgX2FyZ3VtZW50cyA9IEFycmF5LmZyb20oYXJndW1lbnRzKVxuICAgIHZhciBrZXksIHZhbHVlLCBzaWxlbnRcbiAgICBpZihfYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAga2V5ID0gX2FyZ3VtZW50c1swXVxuICAgICAgdmFsdWUgPSBfYXJndW1lbnRzWzFdXG4gICAgICBzaWxlbnQgPSBfYXJndW1lbnRzWzJdXG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ2JlZm9yZVNldCcsIHRoaXMuZGF0YSwgT2JqZWN0LmFzc2lnbihcbiAgICAgICAge30sXG4gICAgICAgIHRoaXMuZGF0YSxcbiAgICAgICAge1xuICAgICAgICAgIFtrZXldOiB2YWx1ZSxcbiAgICAgICAgfSxcbiAgICAgICksIHRoaXMpXG4gICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlLCBzaWxlbnQpXG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ3NldCcsIHRoaXMuZGF0YSwgdGhpcylcbiAgICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KSB0aGlzLnNldERCKGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKVxuICAgIH0gZWxzZSBpZihfYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgaWYoXG4gICAgICAgIHR5cGVvZiBfYXJndW1lbnRzWzBdID09PSAnb2JqZWN0JyAmJlxuICAgICAgICB0eXBlb2YgX2FyZ3VtZW50c1sxXSA9PT0gJ2Jvb2xlYW4nXG4gICAgICApIHtcbiAgICAgICAgc2lsZW50ID0gX2FyZ3VtZW50c1sxXVxuICAgICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ2JlZm9yZVNldCcsIHRoaXMuZGF0YSwgT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICB7fSxcbiAgICAgICAgICB0aGlzLmRhdGEsXG4gICAgICAgICAgX2FyZ3VtZW50c1swXSxcbiAgICAgICAgKSwgdGhpcylcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoX2FyZ3VtZW50c1swXSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KVxuICAgICAgICB9KVxuICAgICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ3NldCcsIHRoaXMuZGF0YSwgdGhpcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgnYmVmb3JlU2V0JywgdGhpcy5kYXRhLCBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIHRoaXMuZGF0YSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBbX2FyZ3VtZW50c1swXV06IF9hcmd1bWVudHNbMV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgKSwgdGhpcylcbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoX2FyZ3VtZW50c1swXSwgX2FyZ3VtZW50c1sxXSlcbiAgICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCdzZXQnLCB0aGlzLmRhdGEsIHRoaXMpXG4gICAgICB9XG4gICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgdGhpcy5zZXREQihfYXJndW1lbnRzWzBdLCBfYXJndW1lbnRzWzFdKVxuICAgIH0gZWxzZSBpZihcbiAgICAgIF9hcmd1bWVudHMubGVuZ3RoID09PSAxICYmXG4gICAgICAhQXJyYXkuaXNBcnJheShfYXJndW1lbnRzWzBdKSAmJlxuICAgICAgdHlwZW9mIF9hcmd1bWVudHNbMF0gPT09ICdvYmplY3QnXG4gICAgKSB7XG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ2JlZm9yZVNldCcsIHRoaXMuZGF0YSwgT2JqZWN0LmFzc2lnbihcbiAgICAgICAge30sXG4gICAgICAgIHRoaXMuZGF0YSxcbiAgICAgICAgX2FyZ3VtZW50c1swXSxcbiAgICAgICksIHRoaXMpXG4gICAgICBPYmplY3QuZW50cmllcyhfYXJndW1lbnRzWzBdKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSlcbiAgICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHRoaXMuc2V0REIoa2V5LCB2YWx1ZSlcbiAgICAgIH0pXG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ3NldCcsIHRoaXMuZGF0YSwgdGhpcylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldCgpIHtcbiAgICBsZXQgc2lsZW50XG4gICAgaWYoXG4gICAgICBhcmd1bWVudHMubGVuZ3RoID09PSAyXG4gICAgKSB7XG4gICAgICBzaWxlbnQgPSBhcmd1bWVudHNbMV1cbiAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgnYmVmb3JlVW5zZXQnLCB0aGlzLmRhdGEsIHRoaXMpXG4gICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGFyZ3VtZW50c1swXSwgc2lsZW50KVxuICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCd1bnNldCcsIHRoaXMpXG4gICAgfSBlbHNlIGlmKFxuICAgICAgYXJndW1lbnRzLmxlbmd0aCA9PT0gMVxuICAgICkge1xuICAgICAgaWYodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHNpbGVudCA9IGFyZ3VtZW50c1swXVxuICAgICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ2JlZm9yZVVuc2V0JywgdGhpcy5kYXRhLCB0aGlzKVxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmRhdGEpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5LCBzaWxlbnQpXG4gICAgICAgIH0pXG4gICAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgndW5zZXQnLCB0aGlzKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ2JlZm9yZVVuc2V0JywgdGhpcy5kYXRhLCB0aGlzKVxuICAgICAgT2JqZWN0LmtleXModGhpcy5kYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICB9KVxuICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCd1bnNldCcsIHRoaXMpXG4gICAgfVxuICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KSB0aGlzLnVuc2V0REIoa2V5KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgcGFyc2UoZGF0YSA9IHRoaXMuZGF0YSkge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhkYXRhKS5yZWR1Y2UoKF9kYXRhLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgTW9kZWwpIHtcbiAgICAgICAgX2RhdGFba2V5XSA9IHZhbHVlLnBhcnNlKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9kYXRhW2tleV0gPSB2YWx1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIF9kYXRhXG4gICAgfSwge30pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW9kZWxcbiIsImltcG9ydCB7IFVVSUQgfSBmcm9tICcuLi9VdGlsaXRpZXMvaW5kZXguanMnXHJcbmltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xyXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vTW9kZWwvaW5kZXguanMnXHJcblxyXG5jbGFzcyBDb2xsZWN0aW9uIGV4dGVuZHMgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcclxuICAgIHN1cGVyKClcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xyXG4gIH1cclxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcclxuICAgICdpZEF0dHJpYnV0ZScsXHJcbiAgICAnbW9kZWwnLFxyXG4gICAgJ2RlZmF1bHRzJyxcclxuICAgICdzZXJ2aWNlcycsXHJcbiAgICAnc2VydmljZUV2ZW50cycsXHJcbiAgICAnc2VydmljZUNhbGxiYWNrcycsXHJcbiAgICAnbG9jYWxTdG9yYWdlJ1xyXG4gIF0gfVxyXG4gIGdldCBiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzKCkgeyByZXR1cm4gW1xyXG4gICAgJ3NlcnZpY2UnXHJcbiAgXSB9XHJcbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxyXG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xyXG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xyXG4gICAgICBpZihzZXR0aW5nc1t2YWxpZFNldHRpbmddKSB0aGlzW3ZhbGlkU2V0dGluZ10gPSBzZXR0aW5nc1t2YWxpZFNldHRpbmddXHJcbiAgICB9KVxyXG4gICAgdGhpcy5iaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzXHJcbiAgICAgIC5mb3JFYWNoKChiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUpID0+IHtcclxuICAgICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUsICdvbicpXHJcbiAgICAgIH0pXHJcbiAgfVxyXG4gIGdldCBvcHRpb25zKCkge1xyXG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxyXG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcclxuICB9XHJcbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XHJcbiAgZ2V0IHN0b3JhZ2VDb250YWluZXIoKSB7IHJldHVybiBbXSB9XHJcbiAgZ2V0IGRlZmF1bHRJREF0dHJpYnV0ZSgpIHsgcmV0dXJuICdfaWQnIH1cclxuICBnZXQgZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLl9kZWZhdWx0cyB9XHJcbiAgc2V0IGRlZmF1bHRzKGRlZmF1bHRzKSB7XHJcbiAgICB0aGlzLl9kZWZhdWx0cyA9IGRlZmF1bHRzXHJcbiAgICB0aGlzLmFkZChkZWZhdWx0cylcclxuICB9XHJcbiAgZ2V0IHV1aWQoKSB7XHJcbiAgICBpZighdGhpcy5fdXVpZCkgdGhpcy5fdXVpZCA9IFV0aWxpdGllcy5VVUlEKClcclxuICAgIHJldHVybiB0aGlzLl91dWlkXHJcbiAgfVxyXG4gIGdldCBtb2RlbHMoKSB7XHJcbiAgICB0aGlzLl9tb2RlbHMgPSB0aGlzLl9tb2RlbHMgfHwgdGhpcy5zdG9yYWdlQ29udGFpbmVyXHJcbiAgICByZXR1cm4gdGhpcy5fbW9kZWxzXHJcbiAgfVxyXG4gIHNldCBtb2RlbHMobW9kZWxzRGF0YSkgeyB0aGlzLl9tb2RlbHMgPSBtb2RlbHNEYXRhIH1cclxuICBnZXQgbW9kZWwoKSB7IHJldHVybiB0aGlzLl9tb2RlbCB9XHJcbiAgc2V0IG1vZGVsKG1vZGVsKSB7IHRoaXMuX21vZGVsID0gbW9kZWwgfVxyXG4gIGdldCBsb2NhbFN0b3JhZ2UoKSB7IHJldHVybiB0aGlzLl9sb2NhbFN0b3JhZ2UgfVxyXG4gIHNldCBsb2NhbFN0b3JhZ2UobG9jYWxTdG9yYWdlKSB7IHRoaXMuX2xvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XHJcbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9kYXRhIH1cclxuICBnZXQgZGF0YSgpIHtcclxuICAgIGNvbnN0IG1vZGVsc0V4aXN0ID0gKE9iamVjdC5rZXlzKHRoaXMubW9kZWxzKS5sZW5ndGgpXHJcbiAgICAgID8gdHJ1ZVxyXG4gICAgICA6IGZhbHNlXHJcbiAgICByZXR1cm4gKG1vZGVsc0V4aXN0KVxyXG4gICAgICA/IHRoaXMubW9kZWxzXHJcbiAgICAgICAgLm1hcCgobW9kZWwpID0+IG1vZGVsLnBhcnNlKCkpXHJcbiAgICAgIDogW11cclxuICB9XHJcbiAgZ2V0IGRiKCkgeyByZXR1cm4gdGhpcy5fZGIgfVxyXG4gIGdldCBkYigpIHtcclxuICAgIGxldCBkYiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KSB8fCBKU09OLnN0cmluZ2lmeSh0aGlzLnN0b3JhZ2VDb250YWluZXIpXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkYilcclxuICB9XHJcbiAgc2V0IGRiKGRiKSB7XHJcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQsIGRiKVxyXG4gIH1cclxuICByZXNldEV2ZW50cyhjbGFzc1R5cGUpIHtcclxuICAgIFtcclxuICAgICAgJ29mZicsXHJcbiAgICAgICdvbidcclxuICAgIF0uZm9yRWFjaCgobWV0aG9kKSA9PiB7XHJcbiAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKVxyXG4gICAgfSlcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZCkge1xyXG4gICAgY29uc3QgYmFzZU5hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdzJylcclxuICAgIGNvbnN0IGJhc2VFdmVudHNOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJylcclxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3NOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJylcclxuICAgIGNvbnN0IGJhc2UgPSB0aGlzW2Jhc2VOYW1lXVxyXG4gICAgY29uc3QgYmFzZUV2ZW50cyA9IHRoaXNbYmFzZUV2ZW50c05hbWVdXHJcbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzID0gdGhpc1tiYXNlQ2FsbGJhY2tzTmFtZV1cclxuICAgIGlmKFxyXG4gICAgICBiYXNlICYmXHJcbiAgICAgIGJhc2VFdmVudHMgJiZcclxuICAgICAgYmFzZUNhbGxiYWNrc1xyXG4gICAgKSB7XHJcbiAgICAgIE9iamVjdC5lbnRyaWVzKGJhc2VFdmVudHMpXHJcbiAgICAgICAgLmZvckVhY2goKFtiYXNlRXZlbnREYXRhLCBiYXNlQ2FsbGJhY2tOYW1lXSkgPT4ge1xyXG4gICAgICAgICAgbGV0IFtiYXNlVGFyZ2V0TmFtZSwgYmFzZUV2ZW50TmFtZV0gPSBiYXNlRXZlbnREYXRhLnNwbGl0KCcgJylcclxuICAgICAgICAgIGxldCBiYXNlVGFyZ2V0ID0gYmFzZVtiYXNlVGFyZ2V0TmFtZV1cclxuICAgICAgICAgIGxldCBiYXNlQ2FsbGJhY2sgPSBiYXNlQ2FsbGJhY2tzW2Jhc2VDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrICYmXHJcbiAgICAgICAgICAgIGJhc2VDYWxsYmFjay5uYW1lLnNwbGl0KCcgJykubGVuZ3RoID09PSAxXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrID0gYmFzZUNhbGxiYWNrLmJpbmQodGhpcylcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKFxyXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxyXG4gICAgICAgICAgICBiYXNlRXZlbnROYW1lICYmXHJcbiAgICAgICAgICAgIGJhc2VUYXJnZXQgJiZcclxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBiYXNlVGFyZ2V0W21ldGhvZF0oYmFzZUV2ZW50TmFtZSwgYmFzZUNhbGxiYWNrKVxyXG4gICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7fVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBnZXRNb2RlbEluZGV4KG1vZGVsVVVJRCkge1xyXG4gICAgbGV0IG1vZGVsSW5kZXhcclxuICAgIHRoaXMuX21vZGVsc1xyXG4gICAgICAuZmluZCgoX21vZGVsLCBfbW9kZWxJbmRleCkgPT4ge1xyXG4gICAgICAgIGlmKF9tb2RlbCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIF9tb2RlbCBpbnN0YW5jZW9mIE1vZGVsICYmXHJcbiAgICAgICAgICAgIF9tb2RlbC5fdXVpZCA9PT0gbW9kZWxVVUlEXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgbW9kZWxJbmRleCA9IF9tb2RlbEluZGV4XHJcbiAgICAgICAgICAgIHJldHVybiBfbW9kZWxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gbW9kZWxJbmRleFxyXG4gIH1cclxuICByZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleCkge1xyXG4gICAgbGV0IG1vZGVsID0gdGhpcy5fbW9kZWxzLnNwbGljZShtb2RlbEluZGV4LCAxLCBudWxsKVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAncmVtb3ZlOm1vZGVsJyxcclxuICAgICAgbW9kZWxbMF0ucGFyc2UoKSxcclxuICAgICAgdGhpcyxcclxuICAgICAgbW9kZWxbMF1cclxuICAgIClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGFkZE1vZGVsKG1vZGVsRGF0YSkge1xyXG4gICAgbGV0IG1vZGVsXHJcbiAgICBsZXQgc29tZU1vZGVsID0gbmV3IE1vZGVsKClcclxuICAgIGlmKG1vZGVsRGF0YSBpbnN0YW5jZW9mIE1vZGVsKSB7XHJcbiAgICAgIG1vZGVsID0gbW9kZWxEYXRhXHJcbiAgICB9IGVsc2UgaWYoXHJcbiAgICAgIHRoaXMubW9kZWxcclxuICAgICkge1xyXG4gICAgICBtb2RlbCA9IG5ldyB0aGlzLm1vZGVsKClcclxuICAgICAgbW9kZWwuc2V0KG1vZGVsRGF0YSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG1vZGVsID0gbmV3IE1vZGVsKClcclxuICAgICAgbW9kZWwuc2V0KG1vZGVsRGF0YSlcclxuICAgIH1cclxuICAgIG1vZGVsLm9uKFxyXG4gICAgICAnc2V0JyxcclxuICAgICAgKGV2ZW50LCBfbW9kZWwpID0+IHtcclxuICAgICAgICB0aGlzLmVtaXQoXHJcbiAgICAgICAgICAnY2hhbmdlOm1vZGVsJyxcclxuICAgICAgICAgIHRoaXMucGFyc2UoKSxcclxuICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICBtb2RlbCxcclxuICAgICAgICApXHJcbiAgICAgIH1cclxuICAgIClcclxuICAgIHRoaXMubW9kZWxzLnB1c2gobW9kZWwpXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdhZGQnLFxyXG4gICAgICBtb2RlbC5wYXJzZSgpLFxyXG4gICAgICB0aGlzLFxyXG4gICAgICBtb2RlbFxyXG4gICAgKVxyXG4gICAgcmV0dXJuIG1vZGVsXHJcbiAgfVxyXG4gIGFkZChtb2RlbERhdGEpIHtcclxuICAgIGlmKEFycmF5LmlzQXJyYXkobW9kZWxEYXRhKSkge1xyXG4gICAgICBtb2RlbERhdGFcclxuICAgICAgICAuZm9yRWFjaCgobW9kZWwpID0+IHtcclxuICAgICAgICAgIHRoaXMuYWRkTW9kZWwobW9kZWwpXHJcbiAgICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYWRkTW9kZWwobW9kZWxEYXRhKVxyXG4gICAgfVxyXG4gICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIHRoaXMuZGIgPSB0aGlzLmRhdGFcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ2NoYW5nZScsXHJcbiAgICAgIHRoaXMucGFyc2UoKSxcclxuICAgICAgdGhpc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcmVtb3ZlKG1vZGVsRGF0YSkge1xyXG4gICAgaWYoXHJcbiAgICAgICFBcnJheS5pc0FycmF5KG1vZGVsRGF0YSkgJiZcclxuICAgICAgdHlwZW9mIG1vZGVsRGF0YSA9PT0gJ29iamVjdCdcclxuICAgICkge1xyXG4gICAgICB2YXIgbW9kZWxJbmRleCA9IHRoaXMuZ2V0TW9kZWxJbmRleChtb2RlbERhdGEudXVpZClcclxuICAgICAgdGhpcy5yZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleClcclxuICAgIH0gZWxzZSBpZihBcnJheS5pc0FycmF5KG1vZGVsRGF0YSkpIHtcclxuICAgICAgbW9kZWxEYXRhXHJcbiAgICAgICAgLmZvckVhY2goKG1vZGVsKSA9PiB7XHJcbiAgICAgICAgICB2YXIgbW9kZWxJbmRleCA9IHRoaXMuZ2V0TW9kZWxJbmRleChtb2RlbC51dWlkKVxyXG4gICAgICAgICAgdGhpcy5yZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgdGhpcy5tb2RlbHMgPSB0aGlzLm1vZGVsc1xyXG4gICAgICAuZmlsdGVyKChtb2RlbCkgPT4gbW9kZWwgIT09IG51bGwpXHJcbiAgICBpZih0aGlzLl9sb2NhbFN0b3JhZ2UpIHRoaXMuZGIgPSB0aGlzLmRhdGFcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ3JlbW92ZScsXHJcbiAgICAgIHRoaXMucGFyc2UoKSxcclxuICAgICAgdGhpc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLnJlbW92ZSh0aGlzLl9tb2RlbHMpXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBwYXJzZShkYXRhKSB7XHJcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLmRhdGEgfHwgdGhpcy5zdG9yYWdlQ29udGFpbmVyXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSlcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvbGxlY3Rpb25cclxuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXguanMnXG5cbmNsYXNzIFZpZXcgZXh0ZW5kcyBFdmVudHMge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICB9XG4gIGdldCB2YWxpZFNldHRpbmdzKCkgeyByZXR1cm4gW1xuICAgICdhdHRyaWJ1dGVzJyxcbiAgICAnZWxlbWVudE5hbWUnLFxuICAgICdlbGVtZW50JyxcbiAgICAnaW5zZXJ0JyxcbiAgICAndGVtcGxhdGUnLFxuICAgICd1aUVsZW1lbnRzJyxcbiAgICAndWlFbGVtZW50RXZlbnRzJyxcbiAgICAndWlFbGVtZW50Q2FsbGJhY2tzJyxcbiAgICAncmVuZGVyJ1xuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCBlbGVtZW50TmFtZSgpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnROYW1lIH1cbiAgc2V0IGVsZW1lbnROYW1lKGVsZW1lbnROYW1lKSB7IHRoaXMuX2VsZW1lbnROYW1lID0gZWxlbWVudE5hbWUgfVxuICBnZXQgZWxlbWVudCgpIHtcbiAgICBpZighdGhpcy5fZWxlbWVudCkge1xuICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5lbGVtZW50TmFtZSlcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuYXR0cmlidXRlcykuZm9yRWFjaCgoW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdKSA9PiB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpXG4gICAgICB9KVxuICAgICAgdGhpcy5lbGVtZW50T2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmVsZW1lbnQsIHtcbiAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRcbiAgfVxuICBnZXQgZWxlbWVudE9ic2VydmVyKCkge1xuICAgIHRoaXMuX2VsZW1lbnRPYnNlcnZlciA9IHRoaXMuX2VsZW1lbnRPYnNlcnZlciB8fCBuZXcgTXV0YXRpb25PYnNlcnZlcihcbiAgICAgIHRoaXMuZWxlbWVudE9ic2VydmUuYmluZCh0aGlzKVxuICAgIClcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudE9ic2VydmVyXG4gIH1cbiAgc2V0IGVsZW1lbnQoZWxlbWVudCkge1xuICAgIGlmKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnRcbiAgfVxuICBnZXQgYXR0cmlidXRlcygpIHsgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXMgfHwge30gfVxuICBzZXQgYXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7IHRoaXMuX2F0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzIH1cbiAgZ2V0IHRlbXBsYXRlKCkgeyByZXR1cm4gdGhpcy5fdGVtcGxhdGUgfVxuICBzZXQgdGVtcGxhdGUodGVtcGxhdGUpIHsgdGhpcy5fdGVtcGxhdGUgPSB0ZW1wbGF0ZSB9XG4gIGdldCB1aUVsZW1lbnRzKCkgeyByZXR1cm4gdGhpcy5fdWlFbGVtZW50cyB8fCB7fSB9XG4gIHNldCB1aUVsZW1lbnRzKHVpRWxlbWVudHMpIHtcbiAgICB0aGlzLl91aUVsZW1lbnRzID0gdWlFbGVtZW50c1xuICAgIHRoaXMudG9nZ2xlRXZlbnRzKClcbiAgfVxuICBnZXQgdWlFbGVtZW50RXZlbnRzKCkgeyByZXR1cm4gdGhpcy5fdWlFbGVtZW50RXZlbnRzIHx8IHt9IH1cbiAgc2V0IHVpRWxlbWVudEV2ZW50cyh1aUVsZW1lbnRFdmVudHMpIHtcbiAgICB0aGlzLl91aUVsZW1lbnRFdmVudHMgPSB1aUVsZW1lbnRFdmVudHNcbiAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gIH1cbiAgZ2V0IHVpRWxlbWVudENhbGxiYWNrcygpIHsgcmV0dXJuIHRoaXMuX3VpRWxlbWVudENhbGxiYWNrcyB8fCB7fSB9XG4gIHNldCB1aUVsZW1lbnRDYWxsYmFja3ModWlFbGVtZW50Q2FsbGJhY2tzKSB7XG4gICAgdGhpcy5fdWlFbGVtZW50Q2FsbGJhY2tzID0gdWlFbGVtZW50Q2FsbGJhY2tzXG4gICAgdGhpcy50b2dnbGVFdmVudHMoKVxuICB9XG4gIGdldCB1aSgpIHtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpc1xuICAgIGlmKCF0aGlzLl91aSkge1xuICAgICAgdGhpcy5fdWkgPSBPYmplY3QuZW50cmllcyh0aGlzLnVpRWxlbWVudHMpLnJlZHVjZSgoX3VpLFt1aUVsZW1lbnROYW1lLCB1aUVsZW1lbnRRdWVyeV0pID0+IHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoX3VpLCB7XG4gICAgICAgICAgW3VpRWxlbWVudE5hbWVdOiB7XG4gICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgIGlmKHR5cGVvZiB1aUVsZW1lbnRRdWVyeSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBsZXQgcXVlcnlSZXN1bHRzID0gY29udGV4dC5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodWlFbGVtZW50UXVlcnkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIChxdWVyeVJlc3VsdHMubGVuZ3RoID4gMSkgPyBxdWVyeVJlc3VsdHMgOiBxdWVyeVJlc3VsdHMuaXRlbSgwKVxuICAgICAgICAgICAgICB9IGVsc2UgaWYoXG4gICAgICAgICAgICAgICAgdWlFbGVtZW50UXVlcnkgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxuICAgICAgICAgICAgICAgIHVpRWxlbWVudFF1ZXJ5IGluc3RhbmNlb2YgRG9jdW1lbnQgfHxcbiAgICAgICAgICAgICAgICB1aUVsZW1lbnRRdWVyeSBpbnN0YW5jZW9mIFdpbmRvd1xuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdWlFbGVtZW50UXVlcnlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBfdWlcbiAgICAgIH0sIHt9KVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcy5fdWksIHtcbiAgICAgICAgJyRlbGVtZW50Jzoge1xuICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGNvbnRleHQuZWxlbWVudCB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdWlcbiAgfVxuICBlbGVtZW50T2JzZXJ2ZShtdXRhdGlvblJlY29yZExpc3QsIG9ic2VydmVyKSB7XG4gICAgZm9yKGxldCBbbXV0YXRpb25SZWNvcmRJbmRleCwgbXV0YXRpb25SZWNvcmRdIG9mIE9iamVjdC5lbnRyaWVzKG11dGF0aW9uUmVjb3JkTGlzdCkpIHtcbiAgICAgIHN3aXRjaChtdXRhdGlvblJlY29yZC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2NoaWxkTGlzdCc6XG4gICAgICAgICAgaWYobXV0YXRpb25SZWNvcmQuYWRkZWROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHRoaXMudWkpKVxuICAgICAgICAgICAgLy8gLmZvckVhY2goKFt1aUtleSwgdWlWYWx1ZV0pID0+IHtcbiAgICAgICAgICAgIC8vICAgY29uc3QgdWlWYWx1ZUdldCA9IHVpVmFsdWUuZ2V0KClcbiAgICAgICAgICAgIC8vICAgY29uc3QgYWRkZWRVSUVsZW1lbnQgPSBBcnJheS5mcm9tKG11dGF0aW9uUmVjb3JkLmFkZGVkTm9kZXMpLmZpbmQoKGFkZGVkTm9kZSkgPT4ge1xuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdhZGRlZE5vZGUnLCBhZGRlZE5vZGUpXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ3VpVmFsdWVHZXQnLCB1aVZhbHVlR2V0KVxuICAgICAgICAgICAgLy8gICAgIHJldHVybiBhZGRlZE5vZGUgPT09IHVpVmFsdWVHZXRcbiAgICAgICAgICAgIC8vICAgfSlcbiAgICAgICAgICAgIC8vICAgaWYoYWRkZWRVSUVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vICAgICB0aGlzLnRvZ2dsZUV2ZW50cyh1aUtleSlcbiAgICAgICAgICAgIC8vICAgfVxuICAgICAgICAgICAgLy8gfSlcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKClcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYmluZEV2ZW50VG9FbGVtZW50KGVsZW1lbnQsIG1ldGhvZCwgZXZlbnROYW1lLCBldmVudENhbGxiYWNrTmFtZSkge1xuICAgIHRyeSB7XG4gICAgICBzd2l0Y2gobWV0aG9kKSB7XG4gICAgICAgIGNhc2UgJ2FkZEV2ZW50TGlzdGVuZXInOlxuICAgICAgICAgIHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXS5iaW5kKHRoaXMpXG4gICAgICAgICAgZWxlbWVudFttZXRob2RdKGV2ZW50TmFtZSwgdGhpcy51aUVsZW1lbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3JlbW92ZUV2ZW50TGlzdGVuZXInOlxuICAgICAgICAgIGVsZW1lbnRbbWV0aG9kXShldmVudE5hbWUsIHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSlcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH0gY2F0Y2goZXJyb3IpIHt9XG4gIH1cbiAgdG9nZ2xlRXZlbnRzKHRhcmdldFVJRWxlbWVudE5hbWUgPSBudWxsKSB7XG4gICAgdGhpcy5pc1RvZ2dsaW5nID0gdHJ1ZVxuICAgIGNvbnN0IHVpID0gdGhpcy51aVxuICAgIGNvbnN0IGV2ZW50QmluZE1ldGhvZHMgPSBbJ3JlbW92ZUV2ZW50TGlzdGVuZXInLCAnYWRkRXZlbnRMaXN0ZW5lciddXG4gICAgaWYoIXRhcmdldFVJRWxlbWVudE5hbWUpIHtcbiAgICAgIGV2ZW50QmluZE1ldGhvZHMuZm9yRWFjaCgoZXZlbnRCaW5kTWV0aG9kKSA9PiB7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMudWlFbGVtZW50RXZlbnRzKS5mb3JFYWNoKChbdWlFbGVtZW50RXZlbnRTZXR0aW5ncywgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWVdKSA9PiB7XG4gICAgICAgICAgbGV0IFt1aUVsZW1lbnROYW1lLCB1aUVsZW1lbnRFdmVudE5hbWVdID0gdWlFbGVtZW50RXZlbnRTZXR0aW5ncy5zcGxpdCgnICcpXG4gICAgICAgICAgaWYodWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xuICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0uZm9yRWFjaCgodWlFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50VG9FbGVtZW50KHVpRWxlbWVudCwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2UgaWYoXG4gICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIERvY3VtZW50IHx8XG4gICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIFdpbmRvd1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlbdWlFbGVtZW50TmFtZV0sIGV2ZW50QmluZE1ldGhvZCwgdWlFbGVtZW50RXZlbnROYW1lLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBldmVudEJpbmRNZXRob2RzLmZvckVhY2goKGV2ZW50QmluZE1ldGhvZCkgPT4ge1xuICAgICAgICBjb25zdCB1aUVsZW1lbnRFdmVudHMgPSBPYmplY3QuZW50cmllcyh0aGlzLnVpRWxlbWVudEV2ZW50cykuZm9yRWFjaCgoW3VpRWxlbWVudEV2ZW50U2V0dGluZ3MsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGxldCBbdWlFbGVtZW50TmFtZSwgdWlFbGVtZW50RXZlbnROYW1lXSA9IHVpRWxlbWVudEV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxuICAgICAgICAgIGlmKHRhcmdldFVJRWxlbWVudE5hbWUgPT09IHVpRWxlbWVudE5hbWUpIHtcbiAgICAgICAgICAgIGlmKHVpW3VpRWxlbWVudE5hbWVdIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0uZm9yRWFjaCgodWlFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlFbGVtZW50LCBldmVudEJpbmRNZXRob2QsIHVpRWxlbWVudEV2ZW50TmFtZSwgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2UgaWYodWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICB0aGlzLmJpbmRFdmVudFRvRWxlbWVudCh1aVt1aUVsZW1lbnROYW1lXSwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuaXNUb2dnbGluZyA9IGZhbHNlXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdXRvSW5zZXJ0KCkge1xuICAgIGlmKHRoaXMuaW5zZXJ0KSB7XG4gICAgICBjb25zdCBwYXJlbnQgPSAodHlwZW9mIHRoaXMuaW5zZXJ0LnBhcmVudCA9PT0gJ3N0cmluZycpXG4gICAgICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmluc2VydC5wYXJlbnQpXG4gICAgICAgIDogKHRoaXMuaW5zZXJ0LnBhcmVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICAgID8gdGhpcy5pbnNlcnQucGFyZW50XG4gICAgICAgICAgOiBudWxsXG4gICAgICBjb25zdCBtZXRob2QgPSB0aGlzLmluc2VydC5tZXRob2RcbiAgICAgIHBhcmVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQobWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgYXV0b1JlbW92ZSgpIHtcbiAgICBpZih0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHJlbmRlcihkYXRhID0ge30pIHtcbiAgICBpZih0aGlzLnRlbXBsYXRlKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUoZGF0YSlcbiAgICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZVxuICAgIH1cbiAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgVmlld1xuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXgnXG5cbmNvbnN0IENvbnRyb2xsZXIgPSBjbGFzcyBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ21vZGVscycsXG4gICAgJ21vZGVsRXZlbnRzJyxcbiAgICAnbW9kZWxDYWxsYmFja3MnLFxuICAgICdjb2xsZWN0aW9ucycsXG4gICAgJ2NvbGxlY3Rpb25FdmVudHMnLFxuICAgICdjb2xsZWN0aW9uQ2FsbGJhY2tzJyxcbiAgICAndmlld3MnLFxuICAgICd2aWV3RXZlbnRzJyxcbiAgICAndmlld0NhbGxiYWNrcycsXG4gICAgJ2NvbnRyb2xsZXJzJyxcbiAgICAnY29udHJvbGxlckV2ZW50cycsXG4gICAgJ2NvbnRyb2xsZXJDYWxsYmFja3MnLFxuICAgICdyb3V0ZXJzJyxcbiAgICAncm91dGVyRXZlbnRzJyxcbiAgICAncm91dGVyQ2FsbGJhY2tzJyxcbiAgXSB9XG4gIGdldCBiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzKCkgeyByZXR1cm4gW1xuICAgICdtb2RlbCcsXG4gICAgJ3ZpZXcnLFxuICAgICdjb2xsZWN0aW9uJyxcbiAgICAnY29udHJvbGxlcicsXG4gICAgJ3JvdXRlcicsXG4gIF0gfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cbiAgZ2V0IHNldHRpbmdzKCkge1xuICAgIGlmKCF0aGlzLl9zZXR0aW5ncykgdGhpcy5fc2V0dGluZ3MgPSB7fVxuICAgIHJldHVybiB0aGlzLl9zZXR0aW5nc1xuICB9XG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3NcbiAgICAgIC5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgICAgaWYodGhpcy5zZXR0aW5nc1t2YWxpZFNldHRpbmddKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBbJ18nLmNvbmNhdCh2YWxpZFNldHRpbmcpXToge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtYmVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFt2YWxpZFNldHRpbmddOiB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpc1snXycuY29uY2F0KHZhbGlkU2V0dGluZyldIH0sXG4gICAgICAgICAgICAgICAgc2V0KHZhbHVlKSB7IHRoaXNbJ18nLmNvbmNhdCh2YWxpZFNldHRpbmcpXSA9IHZhbHVlIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKVxuICAgICAgICAgIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHRoaXMuc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIHRoaXMuYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlc1xuICAgICAgLmZvckVhY2goKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSkgPT4ge1xuICAgICAgICB0aGlzLnJlc2V0RXZlbnRzKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSlcbiAgICAgIH0pXG4gIH1cbiAgcmVzZXRFdmVudHMoY2xhc3NUeXBlKSB7XG4gICAgW1xuICAgICAgJ29mZicsXG4gICAgICAnb24nXG4gICAgXS5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB0b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpIHtcbiAgICBjb25zdCBiYXNlTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ3MnKVxuICAgIGNvbnN0IGJhc2VFdmVudHNOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJylcbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXG4gICAgY29uc3QgYmFzZSA9IHRoaXNbYmFzZU5hbWVdIHx8IHt9XG4gICAgY29uc3QgYmFzZUV2ZW50cyA9IHRoaXNbYmFzZUV2ZW50c05hbWVdIHx8IHt9XG4gICAgY29uc3QgYmFzZUNhbGxiYWNrcyA9IHRoaXNbYmFzZUNhbGxiYWNrc05hbWVdIHx8IHt9XG4gICAgaWYoXG4gICAgICBPYmplY3QudmFsdWVzKGJhc2UpLmxlbmd0aCAmJlxuICAgICAgT2JqZWN0LnZhbHVlcyhiYXNlRXZlbnRzKS5sZW5ndGggJiZcbiAgICAgIE9iamVjdC52YWx1ZXMoYmFzZUNhbGxiYWNrcykubGVuZ3RoXG4gICAgKSB7XG4gICAgICBPYmplY3QuZW50cmllcyhiYXNlRXZlbnRzKVxuICAgICAgICAuZm9yRWFjaCgoW2Jhc2VFdmVudERhdGEsIGJhc2VDYWxsYmFja05hbWVdKSA9PiB7XG4gICAgICAgICAgY29uc3QgW2Jhc2VUYXJnZXROYW1lLCBiYXNlRXZlbnROYW1lXSA9IGJhc2VFdmVudERhdGEuc3BsaXQoJyAnKVxuICAgICAgICAgIGNvbnN0IGJhc2VUYXJnZXROYW1lU3Vic3RyaW5nRmlyc3QgPSBiYXNlVGFyZ2V0TmFtZS5zdWJzdHJpbmcoMCwgMSlcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0xhc3QgPSBiYXNlVGFyZ2V0TmFtZS5zdWJzdHJpbmcoYmFzZVRhcmdldE5hbWUubGVuZ3RoIC0gMSlcbiAgICAgICAgICBsZXQgYmFzZVRhcmdldHMgPSBbXVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdGaXJzdCA9PT0gJ1snICYmXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0xhc3QgPT09ICddJ1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZVRhcmdldHMgPSBPYmplY3QuZW50cmllcyhiYXNlKVxuICAgICAgICAgICAgICAucmVkdWNlKChfYmFzZVRhcmdldHMsIFtiYXNlTmFtZSwgYmFzZVRhcmdldF0pID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmFzZVRhcmdldE5hbWVSZWdFeHBTdHJpbmcgPSBiYXNlVGFyZ2V0TmFtZS5zbGljZSgxLCAtMSlcbiAgICAgICAgICAgICAgICBsZXQgYmFzZVRhcmdldE5hbWVSZWdFeHAgPSBuZXcgUmVnRXhwKGJhc2VUYXJnZXROYW1lUmVnRXhwU3RyaW5nKVxuICAgICAgICAgICAgICAgIGlmKGJhc2VOYW1lLm1hdGNoKGJhc2VUYXJnZXROYW1lUmVnRXhwKSkge1xuICAgICAgICAgICAgICAgICAgX2Jhc2VUYXJnZXRzLnB1c2goYmFzZVRhcmdldClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9iYXNlVGFyZ2V0c1xuICAgICAgICAgICAgICB9LCBbXSlcbiAgICAgICAgICB9IGVsc2UgaWYoYmFzZVtiYXNlVGFyZ2V0TmFtZV0pIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzLnB1c2goYmFzZVtiYXNlVGFyZ2V0TmFtZV0pXG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBiYXNlRXZlbnRDYWxsYmFjayA9IGJhc2VDYWxsYmFja3NbYmFzZUNhbGxiYWNrTmFtZV1cbiAgICAgICAgICBpZihcbiAgICAgICAgICAgIGJhc2VFdmVudENhbGxiYWNrICYmXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFjay5uYW1lLnNwbGl0KCcgJykubGVuZ3RoID09PSAxXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFjayA9IGJhc2VFdmVudENhbGxiYWNrLmJpbmQodGhpcylcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldHMubGVuZ3RoICYmXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFja1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZVRhcmdldHNcbiAgICAgICAgICAgICAgLmZvckVhY2goKGJhc2VUYXJnZXQpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgc3dpdGNoKG1ldGhvZCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdvbic6XG4gICAgICAgICAgICAgICAgICAgICAgYmFzZVRhcmdldFttZXRob2RdKGJhc2VFdmVudE5hbWUsIGJhc2VFdmVudENhbGxiYWNrKVxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ29mZic6XG4gICAgICAgICAgICAgICAgICAgICAgYmFzZVRhcmdldFttZXRob2RdKGJhc2VFdmVudE5hbWUsIGJhc2VFdmVudENhbGxiYWNrKVxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3JcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleCdcblxuY29uc3QgUm91dGVyID0gY2xhc3MgZXh0ZW5kcyBFdmVudHMge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuYWRkU2V0dGluZ3MoKVxuICAgIHRoaXMuYWRkV2luZG93RXZlbnRzKClcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAncm9vdCcsXG4gICAgJ2hhc2hSb3V0aW5nJyxcbiAgICAnY29udHJvbGxlcicsXG4gICAgJ3JvdXRlcydcbiAgXSB9XG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICB9KVxuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgcHJvdG9jb2woKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgfVxuICBnZXQgaG9zdG5hbWUoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgfVxuICBnZXQgcG9ydCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wb3J0IH1cbiAgZ2V0IHBhdGhuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIH1cbiAgZ2V0IHBhdGgoKSB7XG4gICAgbGV0IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZVxuICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cChbJ14nLCB0aGlzLnJvb3RdLmpvaW4oJycpKSwgJycpXG4gICAgICAuc3BsaXQoJz8nKVxuICAgICAgLnNsaWNlKDAsIDEpXG4gICAgICBbMF1cbiAgICBsZXQgZnJhZ21lbnRzID0gKFxuICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMFxuICAgICkgPyBbXVxuICAgICAgOiAoXG4gICAgICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXlxcLy8pICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9cXC8/LylcbiAgICAgICAgKSA/IFsnLyddXG4gICAgICAgICAgOiBzdHJpbmdcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICByZXR1cm4ge1xuICAgICAgZnJhZ21lbnRzOiBmcmFnbWVudHMsXG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICB9XG4gIH1cbiAgZ2V0IGhhc2goKSB7XG4gICAgbGV0IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoXG4gICAgICAuc2xpY2UoMSlcbiAgICAgIC5zcGxpdCgnPycpXG4gICAgICAuc2xpY2UoMCwgMSlcbiAgICAgIFswXVxuICAgIGxldCBmcmFnbWVudHMgPSAoXG4gICAgICBzdHJpbmcubGVuZ3RoID09PSAwXG4gICAgKSA/IFtdXG4gICAgICA6IChcbiAgICAgICAgICBzdHJpbmcubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9eXFwvLykgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL1xcLz8vKVxuICAgICAgICApID8gWycvJ11cbiAgICAgICAgICA6IHN0cmluZ1xuICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAuc3BsaXQoJy8nKVxuICAgIHJldHVybiB7XG4gICAgICBmcmFnbWVudHM6IGZyYWdtZW50cyxcbiAgICAgIHN0cmluZzogc3RyaW5nLFxuICAgIH1cbiAgfVxuICBnZXQgcGFyYW1ldGVycygpIHtcbiAgICBsZXQgc3RyaW5nXG4gICAgbGV0IGRhdGFcbiAgICBpZih3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvXFw/LykpIHtcbiAgICAgIGxldCBwYXJhbWV0ZXJzID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICAgICAgLnNwbGl0KCc/JylcbiAgICAgICAgLnNsaWNlKC0xKVxuICAgICAgICAuam9pbignJylcbiAgICAgIHN0cmluZyA9IHBhcmFtZXRlcnNcbiAgICAgIGRhdGEgPSBwYXJhbWV0ZXJzXG4gICAgICAgIC5zcGxpdCgnJicpXG4gICAgICAgIC5yZWR1Y2UoKFxuICAgICAgICAgIF9wYXJhbWV0ZXJzLFxuICAgICAgICAgIHBhcmFtZXRlclxuICAgICAgICApID0+IHtcbiAgICAgICAgICBsZXQgcGFyYW1ldGVyRGF0YSA9IHBhcmFtZXRlci5zcGxpdCgnPScpXG4gICAgICAgICAgX3BhcmFtZXRlcnNbcGFyYW1ldGVyRGF0YVswXV0gPSBwYXJhbWV0ZXJEYXRhWzFdXG4gICAgICAgICAgcmV0dXJuIF9wYXJhbWV0ZXJzXG4gICAgICAgIH0sIHt9KVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHJpbmcgPSAnJ1xuICAgICAgZGF0YSA9IHt9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9XG4gIH1cbiAgZ2V0IHJvb3QoKSB7IHJldHVybiB0aGlzLl9yb290IHx8ICcvJyB9XG4gIHNldCByb290KHJvb3QpIHsgdGhpcy5fcm9vdCA9IHJvb3QgfVxuICBnZXQgaGFzaFJvdXRpbmcoKSB7IHJldHVybiB0aGlzLl9oYXNoUm91dGluZyB8fCBmYWxzZSB9XG4gIHNldCBoYXNoUm91dGluZyhoYXNoUm91dGluZykgeyB0aGlzLl9oYXNoUm91dGluZyA9IGhhc2hSb3V0aW5nIH1cbiAgZ2V0IHJvdXRlcygpIHsgcmV0dXJuIHRoaXMuX3JvdXRlcyB9XG4gIHNldCByb3V0ZXMocm91dGVzKSB7IHRoaXMuX3JvdXRlcyA9IHJvdXRlcyB9XG4gIGdldCBjb250cm9sbGVyKCkgeyByZXR1cm4gdGhpcy5fY29udHJvbGxlciB9XG4gIHNldCBjb250cm9sbGVyKGNvbnRyb2xsZXIpIHsgdGhpcy5fY29udHJvbGxlciA9IGNvbnRyb2xsZXIgfVxuICBnZXQgbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvb3Q6IHRoaXMucm9vdCxcbiAgICAgIHBhdGg6IHRoaXMucGF0aCxcbiAgICAgIGhhc2g6IHRoaXMuaGFzaCxcbiAgICAgIHBhcmFtZXRlcnM6IHRoaXMucGFyYW1ldGVycyxcbiAgICB9XG4gIH1cbiAgbWF0Y2hSb3V0ZShyb3V0ZUZyYWdtZW50cywgbG9jYXRpb25GcmFnbWVudHMpIHtcbiAgICBsZXQgcm91dGVNYXRjaGVzID0gbmV3IEFycmF5KClcbiAgICBpZihyb3V0ZUZyYWdtZW50cy5sZW5ndGggPT09IGxvY2F0aW9uRnJhZ21lbnRzLmxlbmd0aCkge1xuICAgICAgcm91dGVNYXRjaGVzID0gcm91dGVGcmFnbWVudHNcbiAgICAgICAgLnJlZHVjZSgoX3JvdXRlTWF0Y2hlcywgcm91dGVGcmFnbWVudCwgcm91dGVGcmFnbWVudEluZGV4KSA9PiB7XG4gICAgICAgICAgbGV0IGxvY2F0aW9uRnJhZ21lbnQgPSBsb2NhdGlvbkZyYWdtZW50c1tyb3V0ZUZyYWdtZW50SW5kZXhdXG4gICAgICAgICAgaWYocm91dGVGcmFnbWVudC5tYXRjaCgvXlxcOi8pKSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2godHJ1ZSlcbiAgICAgICAgICB9IGVsc2UgaWYocm91dGVGcmFnbWVudCA9PT0gbG9jYXRpb25GcmFnbWVudCkge1xuICAgICAgICAgICAgX3JvdXRlTWF0Y2hlcy5wdXNoKHRydWUpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaChmYWxzZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yb3V0ZU1hdGNoZXNcbiAgICAgICAgfSwgW10pXG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRlTWF0Y2hlcy5wdXNoKGZhbHNlKVxuICAgIH1cbiAgICByZXR1cm4gKHJvdXRlTWF0Y2hlcy5pbmRleE9mKGZhbHNlKSA9PT0gLTEpXG4gICAgICA/IHRydWVcbiAgICAgIDogZmFsc2VcbiAgfVxuICBnZXRSb3V0ZShsb2NhdGlvbikge1xuICAgIGxldCByb3V0ZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnJvdXRlcylcbiAgICAgIC5yZWR1Y2UoKFxuICAgICAgICBfcm91dGVzLFxuICAgICAgICBbcm91dGVOYW1lLCByb3V0ZVNldHRpbmdzXSkgPT4ge1xuICAgICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IChcbiAgICAgICAgICAgIHJvdXRlTmFtZS5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICAgIHJvdXRlTmFtZS5tYXRjaCgvXlxcLy8pXG4gICAgICAgICAgKSA/IFtyb3V0ZU5hbWVdXG4gICAgICAgICAgICA6IChyb3V0ZU5hbWUubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICA/IFsnJ11cbiAgICAgICAgICAgICAgOiByb3V0ZU5hbWVcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICAgICAgICByb3V0ZVNldHRpbmdzLmZyYWdtZW50cyA9IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgICAgX3JvdXRlc1tyb3V0ZUZyYWdtZW50cy5qb2luKCcvJyldID0gcm91dGVTZXR0aW5nc1xuICAgICAgICAgIHJldHVybiBfcm91dGVzXG4gICAgICAgIH0sXG4gICAgICAgIHt9XG4gICAgICApXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMocm91dGVzKVxuICAgICAgLmZpbmQoKHJvdXRlKSA9PiB7XG4gICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IHJvdXRlLmZyYWdtZW50c1xuICAgICAgICBsZXQgbG9jYXRpb25GcmFnbWVudHMgPSAodGhpcy5oYXNoUm91dGluZylcbiAgICAgICAgICA/IGxvY2F0aW9uLmhhc2guZnJhZ21lbnRzXG4gICAgICAgICAgOiBsb2NhdGlvbi5wYXRoLmZyYWdtZW50c1xuICAgICAgICBsZXQgbWF0Y2hSb3V0ZSA9IHRoaXMubWF0Y2hSb3V0ZShcbiAgICAgICAgICByb3V0ZUZyYWdtZW50cyxcbiAgICAgICAgICBsb2NhdGlvbkZyYWdtZW50cyxcbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gbWF0Y2hSb3V0ZSA9PT0gdHJ1ZVxuICAgICAgfSlcbiAgfVxuICBwb3BTdGF0ZShldmVudCkge1xuICAgIGxldCBsb2NhdGlvbiA9IHRoaXMubG9jYXRpb25cbiAgICBsZXQgcm91dGUgPSB0aGlzLmdldFJvdXRlKGxvY2F0aW9uKVxuICAgIGxldCByb3V0ZURhdGEgPSB7XG4gICAgICByb3V0ZTogcm91dGUsXG4gICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgfVxuICAgIGlmKHJvdXRlKSB7XG4gICAgICB0aGlzLmNvbnRyb2xsZXJbcm91dGUuY2FsbGJhY2tdKHJvdXRlRGF0YSlcbiAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJywge1xuICAgICAgICBuYW1lOiAnY2hhbmdlJyxcbiAgICAgICAgZGF0YTogcm91dGVEYXRhLFxuICAgICAgfSxcbiAgICAgIHRoaXMpXG4gICAgfVxuICB9XG4gIGFkZFdpbmRvd0V2ZW50cygpIHtcbiAgICB3aW5kb3cub24oJ3BvcHN0YXRlJywgdGhpcy5wb3BTdGF0ZS5iaW5kKHRoaXMpKVxuICB9XG4gIHJlbW92ZVdpbmRvd0V2ZW50cygpIHtcbiAgICB3aW5kb3cub2ZmKCdwb3BzdGF0ZScsIHRoaXMucG9wU3RhdGUuYmluZCh0aGlzKSlcbiAgfVxuICBuYXZpZ2F0ZShwYXRoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFJvdXRlclxuIiwiaW1wb3J0ICcuL1NoaW1zL2V2ZW50cydcbmltcG9ydCBFdmVudHMgZnJvbSAnLi9FdmVudHMvaW5kZXgnXG5pbXBvcnQgQ2hhbm5lbHMgZnJvbSAnLi9DaGFubmVscy9pbmRleCdcbmltcG9ydCAqIGFzIFV0aWxpdGllcyBmcm9tICcuL1V0aWxpdGllcy9pbmRleCdcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4vU2VydmljZS9pbmRleCdcbmltcG9ydCBNb2RlbCBmcm9tICcuL01vZGVsL2luZGV4J1xuaW1wb3J0IENvbGxlY3Rpb24gZnJvbSAnLi9Db2xsZWN0aW9uL2luZGV4J1xuaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3L2luZGV4J1xuaW1wb3J0IENvbnRyb2xsZXIgZnJvbSAnLi9Db250cm9sbGVyL2luZGV4J1xuaW1wb3J0IFJvdXRlciBmcm9tICcuL1JvdXRlci9pbmRleCdcbmNvbnN0IE1WQyA9IHtcbiAgRXZlbnRzLFxuICBDaGFubmVscyxcbiAgVXRpbGl0aWVzLFxuICBTZXJ2aWNlLFxuICBNb2RlbCxcbiAgQ29sbGVjdGlvbixcbiAgVmlldyxcbiAgQ29udHJvbGxlcixcbiAgUm91dGVyLFxufVxuZXhwb3J0IGRlZmF1bHQgTVZDXG4iXSwibmFtZXMiOlsiRXZlbnRUYXJnZXQiLCJwcm90b3R5cGUiLCJvbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJvZmYiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiRXZlbnRzIiwiY29uc3RydWN0b3IiLCJfZXZlbnRzIiwiZXZlbnRzIiwiZ2V0RXZlbnRDYWxsYmFja3MiLCJldmVudE5hbWUiLCJnZXRFdmVudENhbGxiYWNrTmFtZSIsImV2ZW50Q2FsbGJhY2siLCJuYW1lIiwibGVuZ3RoIiwiZ2V0RXZlbnRDYWxsYmFja0dyb3VwIiwiZXZlbnRDYWxsYmFja3MiLCJldmVudENhbGxiYWNrTmFtZSIsImV2ZW50Q2FsbGJhY2tHcm91cCIsInB1c2giLCJhcmd1bWVudHMiLCJPYmplY3QiLCJrZXlzIiwiZW1pdCIsIl9hcmd1bWVudHMiLCJBcnJheSIsImZyb20iLCJzcGxpY2UiLCJldmVudERhdGEiLCJldmVudEFyZ3VtZW50cyIsImVudHJpZXMiLCJmb3JFYWNoIiwiZXZlbnRDYWxsYmFja0dyb3VwTmFtZSIsImRhdGEiLCJfcmVzcG9uc2VzIiwicmVzcG9uc2VzIiwicmVzcG9uc2UiLCJyZXNwb25zZU5hbWUiLCJyZXNwb25zZUNhbGxiYWNrIiwicmVxdWVzdCIsInNsaWNlIiwiY2FsbCIsIl9yZXNwb25zZU5hbWUiLCJfY2hhbm5lbHMiLCJjaGFubmVscyIsImNoYW5uZWwiLCJjaGFubmVsTmFtZSIsIkNoYW5uZWwiLCJVVUlEIiwidXVpZCIsImkiLCJyYW5kb20iLCJNYXRoIiwidG9TdHJpbmciLCJTZXJ2aWNlIiwic2V0dGluZ3MiLCJvcHRpb25zIiwidmFsaWRTZXR0aW5ncyIsIl9zZXR0aW5ncyIsInZhbGlkU2V0dGluZyIsIl9vcHRpb25zIiwidXJsIiwicGFyYW1ldGVycyIsIl91cmwiLCJjb25jYXQiLCJxdWVyeVN0cmluZyIsInBhcmFtZXRlclN0cmluZyIsInJlZHVjZSIsInBhcmFtZXRlclN0cmluZ3MiLCJwYXJhbWV0ZXJLZXkiLCJwYXJhbWV0ZXJWYWx1ZSIsImpvaW4iLCJtZXRob2QiLCJfbWV0aG9kIiwibW9kZSIsIl9tb2RlIiwiY2FjaGUiLCJfY2FjaGUiLCJjcmVkZW50aWFscyIsIl9jcmVkZW50aWFscyIsImhlYWRlcnMiLCJfaGVhZGVycyIsInJlZGlyZWN0IiwiX3JlZGlyZWN0IiwicmVmZXJyZXJQb2xpY3kiLCJfcmVmZXJyZXJQb2xpY3kiLCJib2R5IiwiX2JvZHkiLCJfcGFyYW1ldGVycyIsInByZXZpb3VzQWJvcnRDb250cm9sbGVyIiwiX3ByZXZpb3VzQWJvcnRDb250cm9sbGVyIiwiYWJvcnRDb250cm9sbGVyIiwiX2Fib3J0Q29udHJvbGxlciIsIkFib3J0Q29udHJvbGxlciIsImFib3J0IiwiZmV0Y2giLCJmZXRjaE9wdGlvbnMiLCJfZmV0Y2hPcHRpb25zIiwiZmV0Y2hPcHRpb25OYW1lIiwic2lnbmFsIiwidGhlbiIsImpzb24iLCJjb2RlIiwiY2F0Y2giLCJlcnJvciIsIk1vZGVsIiwiX3V1aWQiLCJiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzIiwiYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlIiwidG9nZ2xlRXZlbnRzIiwic2VydmljZXMiLCJfc2VydmljZXMiLCJfZGF0YSIsImRlZmF1bHRzIiwiX2RlZmF1bHRzIiwibG9jYWxTdG9yYWdlIiwic3luYyIsImRiIiwic2V0IiwiX2xvY2FsU3RvcmFnZSIsInN0b3JhZ2VDb250YWluZXIiLCJfZGIiLCJnZXRJdGVtIiwiZW5kcG9pbnQiLCJKU09OIiwic3RyaW5naWZ5IiwicGFyc2UiLCJzZXRJdGVtIiwicmVzZXRFdmVudHMiLCJjbGFzc1R5cGUiLCJiYXNlTmFtZSIsImJhc2VFdmVudHNOYW1lIiwiYmFzZUNhbGxiYWNrc05hbWUiLCJiYXNlIiwiYmFzZUV2ZW50cyIsImJhc2VDYWxsYmFja3MiLCJiYXNlRXZlbnREYXRhIiwiYmFzZUNhbGxiYWNrTmFtZSIsImJhc2VUYXJnZXROYW1lIiwiYmFzZUV2ZW50TmFtZSIsInNwbGl0IiwiYmFzZVRhcmdldCIsImJhc2VDYWxsYmFjayIsImJpbmQiLCJzZXREQiIsImtleSIsInZhbHVlIiwidW5zZXREQiIsInNldERhdGFQcm9wZXJ0eSIsInNpbGVudCIsImN1cnJlbnREYXRhUHJvcGVydHkiLCJnZXQiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJlbnVtZXJhYmxlIiwiZXZlbnQiLCJtb2RlbCIsInVuc2V0RGF0YVByb3BlcnR5IiwiYXNzaWduIiwiaXNBcnJheSIsInVuc2V0IiwiQ29sbGVjdGlvbiIsImRlZmF1bHRJREF0dHJpYnV0ZSIsImFkZCIsIlV0aWxpdGllcyIsIm1vZGVscyIsIl9tb2RlbHMiLCJtb2RlbHNEYXRhIiwiX21vZGVsIiwibW9kZWxzRXhpc3QiLCJtYXAiLCJnZXRNb2RlbEluZGV4IiwibW9kZWxVVUlEIiwibW9kZWxJbmRleCIsImZpbmQiLCJfbW9kZWxJbmRleCIsInJlbW92ZU1vZGVsQnlJbmRleCIsImFkZE1vZGVsIiwibW9kZWxEYXRhIiwic29tZU1vZGVsIiwicmVtb3ZlIiwiZmlsdGVyIiwicmVzZXQiLCJWaWV3IiwiZWxlbWVudE5hbWUiLCJfZWxlbWVudE5hbWUiLCJlbGVtZW50IiwiX2VsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJzZXRBdHRyaWJ1dGUiLCJlbGVtZW50T2JzZXJ2ZXIiLCJvYnNlcnZlIiwic3VidHJlZSIsImNoaWxkTGlzdCIsIl9lbGVtZW50T2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZWxlbWVudE9ic2VydmUiLCJIVE1MRWxlbWVudCIsIl9hdHRyaWJ1dGVzIiwidGVtcGxhdGUiLCJfdGVtcGxhdGUiLCJ1aUVsZW1lbnRzIiwiX3VpRWxlbWVudHMiLCJ1aUVsZW1lbnRFdmVudHMiLCJfdWlFbGVtZW50RXZlbnRzIiwidWlFbGVtZW50Q2FsbGJhY2tzIiwiX3VpRWxlbWVudENhbGxiYWNrcyIsInVpIiwiY29udGV4dCIsIl91aSIsInVpRWxlbWVudE5hbWUiLCJ1aUVsZW1lbnRRdWVyeSIsInF1ZXJ5UmVzdWx0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpdGVtIiwiRG9jdW1lbnQiLCJXaW5kb3ciLCJtdXRhdGlvblJlY29yZExpc3QiLCJvYnNlcnZlciIsIm11dGF0aW9uUmVjb3JkSW5kZXgiLCJtdXRhdGlvblJlY29yZCIsInR5cGUiLCJhZGRlZE5vZGVzIiwiYmluZEV2ZW50VG9FbGVtZW50IiwidGFyZ2V0VUlFbGVtZW50TmFtZSIsImlzVG9nZ2xpbmciLCJldmVudEJpbmRNZXRob2RzIiwiZXZlbnRCaW5kTWV0aG9kIiwidWlFbGVtZW50RXZlbnRTZXR0aW5ncyIsInVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lIiwidWlFbGVtZW50RXZlbnROYW1lIiwiTm9kZUxpc3QiLCJ1aUVsZW1lbnQiLCJhdXRvSW5zZXJ0IiwiaW5zZXJ0IiwicGFyZW50IiwicXVlcnlTZWxlY3RvciIsImluc2VydEFkamFjZW50RWxlbWVudCIsImF1dG9SZW1vdmUiLCJwYXJlbnRFbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJyZW5kZXIiLCJpbm5lckhUTUwiLCJDb250cm9sbGVyIiwiZW51bWJlcmFibGUiLCJ2YWx1ZXMiLCJiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0ZpcnN0Iiwic3Vic3RyaW5nIiwiYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0IiwiYmFzZVRhcmdldHMiLCJfYmFzZVRhcmdldHMiLCJiYXNlVGFyZ2V0TmFtZVJlZ0V4cFN0cmluZyIsImJhc2VUYXJnZXROYW1lUmVnRXhwIiwiUmVnRXhwIiwibWF0Y2giLCJiYXNlRXZlbnRDYWxsYmFjayIsIlJvdXRlciIsImFkZFNldHRpbmdzIiwiYWRkV2luZG93RXZlbnRzIiwicHJvdG9jb2wiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhvc3RuYW1lIiwicG9ydCIsInBhdGhuYW1lIiwicGF0aCIsInN0cmluZyIsInJlcGxhY2UiLCJyb290IiwiZnJhZ21lbnRzIiwiaGFzaCIsImhyZWYiLCJwYXJhbWV0ZXIiLCJwYXJhbWV0ZXJEYXRhIiwiX3Jvb3QiLCJoYXNoUm91dGluZyIsIl9oYXNoUm91dGluZyIsInJvdXRlcyIsIl9yb3V0ZXMiLCJjb250cm9sbGVyIiwiX2NvbnRyb2xsZXIiLCJtYXRjaFJvdXRlIiwicm91dGVGcmFnbWVudHMiLCJsb2NhdGlvbkZyYWdtZW50cyIsInJvdXRlTWF0Y2hlcyIsIl9yb3V0ZU1hdGNoZXMiLCJyb3V0ZUZyYWdtZW50Iiwicm91dGVGcmFnbWVudEluZGV4IiwibG9jYXRpb25GcmFnbWVudCIsImluZGV4T2YiLCJnZXRSb3V0ZSIsInJvdXRlTmFtZSIsInJvdXRlU2V0dGluZ3MiLCJyb3V0ZSIsInBvcFN0YXRlIiwicm91dGVEYXRhIiwiY2FsbGJhY2siLCJyZW1vdmVXaW5kb3dFdmVudHMiLCJuYXZpZ2F0ZSIsIk1WQyIsIkNoYW5uZWxzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7RUFBQUEsV0FBVyxDQUFDQyxTQUFaLENBQXNCQyxFQUF0QixHQUEyQkYsV0FBVyxDQUFDQyxTQUFaLENBQXNCQyxFQUF0QixJQUE0QkYsV0FBVyxDQUFDQyxTQUFaLENBQXNCRSxnQkFBN0U7RUFDQUgsV0FBVyxDQUFDQyxTQUFaLENBQXNCRyxHQUF0QixHQUE0QkosV0FBVyxDQUFDQyxTQUFaLENBQXNCRyxHQUF0QixJQUE2QkosV0FBVyxDQUFDQyxTQUFaLENBQXNCSSxtQkFBL0U7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUNEQSxNQUFNQyxNQUFOLENBQWE7RUFDWEMsRUFBQUEsV0FBVyxHQUFHOztFQUNkLE1BQUlDLE9BQUosR0FBYztFQUNaLFNBQUtDLE1BQUwsR0FBYyxLQUFLQSxNQUFMLElBQWUsRUFBN0I7RUFDQSxXQUFPLEtBQUtBLE1BQVo7RUFDRDs7RUFDREMsRUFBQUEsaUJBQWlCLENBQUNDLFNBQUQsRUFBWTtFQUFFLFdBQU8sS0FBS0gsT0FBTCxDQUFhRyxTQUFiLEtBQTJCLEVBQWxDO0VBQXNDOztFQUNyRUMsRUFBQUEsb0JBQW9CLENBQUNDLGFBQUQsRUFBZ0I7RUFDbEMsV0FBUUEsYUFBYSxDQUFDQyxJQUFkLENBQW1CQyxNQUFwQixHQUNIRixhQUFhLENBQUNDLElBRFgsR0FFSCxtQkFGSjtFQUdEOztFQUNERSxFQUFBQSxxQkFBcUIsQ0FBQ0MsY0FBRCxFQUFpQkMsaUJBQWpCLEVBQW9DO0VBQ3ZELFdBQU9ELGNBQWMsQ0FBQ0MsaUJBQUQsQ0FBZCxJQUFxQyxFQUE1QztFQUNEOztFQUNEaEIsRUFBQUEsRUFBRSxDQUFDUyxTQUFELEVBQVlFLGFBQVosRUFBMkI7RUFDM0IsUUFBSUksY0FBYyxHQUFHLEtBQUtQLGlC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
