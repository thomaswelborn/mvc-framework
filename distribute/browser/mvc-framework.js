(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.MVC = {}));
}(this, (function (exports) { 'use strict';

  EventTarget.prototype.on = EventTarget.prototype.on || EventTarget.prototype.addEventListener;
  EventTarget.prototype.off = EventTarget.prototype.off || EventTarget.prototype.removeEventListener;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

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

  class index {
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



  var index$1 = /*#__PURE__*/Object.freeze({
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
      return ['url', 'method', 'mode', 'cache', 'credentials', 'headers', 'parameters', 'redirect', 'referrer-policy', 'body', 'files'];
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

    get mode() {
      return this._mode;
    }

    set mode(mode) {
      this._mode = mode;
    }

    get cache() {
      return this._cache;
    }

    set cache(cache) {
      this._cache = cache;
    }

    get credentials() {
      return this._credentials;
    }

    set credentials(credentials) {
      this._credentials = credentials;
    }

    get headers() {
      return this._headers;
    }

    set headers(headers) {
      this._headers = headers;
    }

    get redirect() {
      return this._redirect;
    }

    set redirect(redirect) {
      this._redirect = redirect;
    }

    get referrerPolicy() {
      return this._referrerPolicy;
    }

    set referrerPolicy(referrerPolicy) {
      this._referrerPolicy = referrerPolicy;
    }

    get body() {
      return this._body;
    }

    set body(body) {
      this._body = body;
    }

    get files() {
      return this._files;
    }

    set files(files) {
      this._files = files;
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

    get response() {
      return this._response;
    }

    set response(response) {
      this._response = response;
    }

    get responseData() {
      return this._responseData;
    }

    set responseData(responseData) {
      this._responseData = responseData;
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
      return fetch(this.url, fetchOptions).then(response => {
        this.response = response;
        return response.json();
      }).then(data => {
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

    fetchSync() {
      var _this = this;

      return _asyncToGenerator(function* () {
        var fetchOptions = _this.validSettings.reduce((_fetchOptions, fetchOptionName) => {
          if (_this[fetchOptionName]) _fetchOptions[fetchOptionName] = _this[fetchOptionName];
          return _fetchOptions;
        }, {});

        fetchOptions.signal = _this.abortController.signal;
        if (_this.previousAbortController) _this.previousAbortController.abort();
        _this.response = yield fetch(_this.url, fetchOptions);
        _this.responseData = yield _this.response.json();

        if (_this.responseData.code >= 400 && _this.responseData.code <= 499) {
          _this.emit('error', _this.responseData, _this);

          throw _this.responseData;
        } else {
          _this.emit('ready', _this.responseData, _this);
        }

        return _this.responseData;
      })();
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

      if (!silent) {
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

      if (!silent) {
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
      return ['idAttribute', 'model', 'modelOptions', 'defaults', 'services', 'serviceEvents', 'serviceCallbacks', 'localStorage'];
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

      if (modelData instanceof Model) {
        model = modelData;
      } else if (this.model) {
        var ModelPrototype = this.model;
        model = new ModelPrototype({
          defaults: modelData
        }, this.modelOptions);
      } else {
        model = new Model({
          defaults: modelData
        });
      }

      model.on('set', (event, _model) => this.emit('change:model', this.parse(), this, _model));
      this.models.push(model);
      this.emit('add', model.parse(), this, model);
      return model;
    }

    add(modelData) {
      if (Array.isArray(modelData)) {
        modelData.forEach(model => this.addModel(model));
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
      this._uiElements = uiElements; // this.toggleEvents()
    }

    get uiElementEvents() {
      return this._uiElementEvents || {};
    }

    set uiElementEvents(uiElementEvents) {
      this._uiElementEvents = uiElementEvents; // this.toggleEvents()
    }

    get uiElementCallbacks() {
      return this._uiElementCallbacks || {};
    }

    set uiElementCallbacks(uiElementCallbacks) {
      this._uiElementCallbacks = uiElementCallbacks;
      Object.values(this._uiElementCallbacks).forEach(uiElementCallback => uiElementCallback.bind(this)); // this.toggleEvents()
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

    resetUI() {
      delete this._ui;
      this.toggleEvents();
      return this;
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
            this.uiElementCallbacks[eventCallbackName] = this.uiElementCallbacks[eventCallbackName]; // .bind(this)

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
            } else if (ui[uiElementName]) {
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
        this.emit('change', routeData, this);
      } else {
        this.emit('error', routeData, this);
      }
    }

    addWindowEvents() {
      window.on('popstate', this.popState.bind(this));
    }

    removeWindowEvents() {
      window.off('popstate', this.popState.bind(this));
    }

    navigate(path) {
      if (this.hashRouting) {
        window.location.hash = path;
      } else {
        window.location.href = path;
      }
    }

  };

  exports.Channels = index;
  exports.Collection = Collection;
  exports.Controller = Controller;
  exports.Events = Events;
  exports.Model = Model;
  exports.Router = Router;
  exports.Service = Service;
  exports.Utilities = index$1;
  exports.View = View;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxpdGllcy91dWlkLmpzIiwiLi4vLi4vc291cmNlL01WQy9TZXJ2aWNlL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Nb2RlbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29sbGVjdGlvbi9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVmlldy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29udHJvbGxlci9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvUm91dGVyL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIkV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiA9IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lclxyXG5FdmVudFRhcmdldC5wcm90b3R5cGUub2ZmID0gRXZlbnRUYXJnZXQucHJvdG90eXBlLm9mZiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lclxyXG4iLCJjbGFzcyBFdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2V2ZW50cygpIHtcclxuICAgIHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMgfHwge31cclxuICAgIHJldHVybiB0aGlzLmV2ZW50c1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpIHsgcmV0dXJuIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdIHx8IHt9IH1cclxuICBnZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gKGV2ZW50Q2FsbGJhY2submFtZS5sZW5ndGgpXHJcbiAgICAgID8gZXZlbnRDYWxsYmFjay5uYW1lXHJcbiAgICAgIDogJ2Fub255bW91c0Z1bmN0aW9uJ1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKSB7XHJcbiAgICByZXR1cm4gZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdIHx8IFtdXHJcbiAgfVxyXG4gIG9uKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaykge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5nZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja05hbWUgPSB0aGlzLmdldEV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja0dyb3VwID0gdGhpcy5nZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKVxyXG4gICAgZXZlbnRDYWxsYmFja0dyb3VwLnB1c2goZXZlbnRDYWxsYmFjaylcclxuICAgIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudENhbGxiYWNrc1xyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgb2ZmKCkge1xyXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgICAgY2FzZSAwOlxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrTmFtZSA9ICh0eXBlb2YgZXZlbnRDYWxsYmFjayA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICA/IGV2ZW50Q2FsbGJhY2tcclxuICAgICAgICAgIDogdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKSB7XHJcbiAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1bZXZlbnRDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0pLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgKSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGVtaXQoKSB7XHJcbiAgICBsZXQgX2FyZ3VtZW50cyA9IEFycmF5LmZyb20oYXJndW1lbnRzKVxyXG4gICAgbGV0IGV2ZW50TmFtZSA9IF9hcmd1bWVudHMuc3BsaWNlKDAsIDEpWzBdXHJcbiAgICBsZXQgZXZlbnREYXRhID0gX2FyZ3VtZW50cy5zcGxpY2UoMCwgMSlbMF1cclxuICAgIGxldCBldmVudEFyZ3VtZW50cyA9IF9hcmd1bWVudHMuc3BsaWNlKDApXHJcbiAgICBPYmplY3QuZW50cmllcyh0aGlzLmdldEV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSkpXHJcbiAgICAgIC5mb3JFYWNoKChbZXZlbnRDYWxsYmFja0dyb3VwTmFtZSwgZXZlbnRDYWxsYmFja0dyb3VwXSkgPT4ge1xyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgICAgICAgLmZvckVhY2goKGV2ZW50Q2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgZXZlbnRDYWxsYmFjayhcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBldmVudE5hbWUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBldmVudERhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIC4uLmV2ZW50QXJndW1lbnRzXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBFdmVudHNcclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX3Jlc3BvbnNlcygpIHtcclxuICAgIHRoaXMucmVzcG9uc2VzID0gdGhpcy5yZXNwb25zZXNcclxuICAgICAgPyB0aGlzLnJlc3BvbnNlc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZiAocmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgICB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSA9IHJlc3BvbnNlQ2FsbGJhY2tcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VdXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlcXVlc3QocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZiAodGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0pIHtcclxuICAgICAgdmFyIF9hcmd1bWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLnNsaWNlKDEpXHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSguLi5fYXJndW1lbnRzKVxyXG4gICAgfVxyXG4gIH1cclxuICBvZmYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZiAocmVzcG9uc2VOYW1lKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yICh2YXIgW19yZXNwb25zZU5hbWVdIG9mIE9iamVjdC5rZXlzKHRoaXMuX3Jlc3BvbnNlcykpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW19yZXNwb25zZU5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IENoYW5uZWwgZnJvbSAnLi9DaGFubmVsL2luZGV4J1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfY2hhbm5lbHMoKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzID0gdGhpcy5jaGFubmVsc1xyXG4gICAgICA/IHRoaXMuY2hhbm5lbHNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbHNcclxuICB9XHJcbiAgY2hhbm5lbChjaGFubmVsTmFtZSkge1xyXG4gICAgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdID0gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgID8gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgIDogbmV3IENoYW5uZWwoKVxyXG4gICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxuICBvZmYoY2hhbm5lbE5hbWUpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVVVJRCgpIHtcclxuICB2YXIgdXVpZCA9IFwiXCIsIGksIHJhbmRvbVxyXG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSB7XHJcbiAgICByYW5kb20gPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwXHJcblxyXG4gICAgaWYgKGkgPT0gOCB8fCBpID09IDEyIHx8IGkgPT0gMTYgfHwgaSA9PSAyMCkge1xyXG4gICAgICB1dWlkICs9IFwiLVwiXHJcbiAgICB9XHJcbiAgICB1dWlkICs9IChpID09IDEyID8gNCA6IChpID09IDE2ID8gKHJhbmRvbSAmIDMgfCA4KSA6IHJhbmRvbSkpLnRvU3RyaW5nKDE2KVxyXG4gIH1cclxuICByZXR1cm4gdXVpZFxyXG59XHJcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4J1xuXG5jbGFzcyBTZXJ2aWNlIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAndXJsJyxcbiAgICAnbWV0aG9kJyxcbiAgICAnbW9kZScsXG4gICAgJ2NhY2hlJyxcbiAgICAnY3JlZGVudGlhbHMnLFxuICAgICdoZWFkZXJzJyxcbiAgICAncGFyYW1ldGVycycsXG4gICAgJ3JlZGlyZWN0JyxcbiAgICAncmVmZXJyZXItcG9saWN5JyxcbiAgICAnYm9keScsXG4gICAgJ2ZpbGVzJ1xuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCB1cmwoKSB7XG4gICAgaWYodGhpcy5wYXJhbWV0ZXJzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsLmNvbmNhdCh0aGlzLnF1ZXJ5U3RyaW5nKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsXG4gICAgfVxuICB9XG4gIHNldCB1cmwodXJsKSB7IHRoaXMuX3VybCA9IHVybCB9XG4gIGdldCBxdWVyeVN0cmluZygpIHtcbiAgICBsZXQgcXVlcnlTdHJpbmcgPSAnJ1xuICAgIGlmKHRoaXMucGFyYW1ldGVycykge1xuICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IE9iamVjdC5lbnRyaWVzKHRoaXMucGFyYW1ldGVycylcbiAgICAgICAgLnJlZHVjZSgocGFyYW1ldGVyU3RyaW5ncywgW3BhcmFtZXRlcktleSwgcGFyYW1ldGVyVmFsdWVdKSA9PiB7XG4gICAgICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IHBhcmFtZXRlcktleS5jb25jYXQoJz0nLCBwYXJhbWV0ZXJWYWx1ZSlcbiAgICAgICAgICBwYXJhbWV0ZXJTdHJpbmdzLnB1c2gocGFyYW1ldGVyU3RyaW5nKVxuICAgICAgICAgIHJldHVybiBwYXJhbWV0ZXJTdHJpbmdzXG4gICAgICAgIH0sIFtdKVxuICAgICAgICAgIC5qb2luKCcmJylcbiAgICAgIHF1ZXJ5U3RyaW5nID0gJz8nLmNvbmNhdChwYXJhbWV0ZXJTdHJpbmcpXG4gICAgfVxuICAgIHJldHVybiBxdWVyeVN0cmluZ1xuICB9XG4gIGdldCBtZXRob2QoKSB7IHJldHVybiB0aGlzLl9tZXRob2QgfVxuICBzZXQgbWV0aG9kKG1ldGhvZCkgeyB0aGlzLl9tZXRob2QgPSBtZXRob2QgfVxuICBnZXQgbW9kZSgpIHsgcmV0dXJuIHRoaXMuX21vZGUgfVxuICBzZXQgbW9kZShtb2RlKSB7IHRoaXMuX21vZGUgPSBtb2RlIH1cbiAgZ2V0IGNhY2hlKCkgeyByZXR1cm4gdGhpcy5fY2FjaGUgfVxuICBzZXQgY2FjaGUoY2FjaGUpIHsgdGhpcy5fY2FjaGUgPSBjYWNoZSB9XG4gIGdldCBjcmVkZW50aWFscygpIHsgcmV0dXJuIHRoaXMuX2NyZWRlbnRpYWxzIH1cbiAgc2V0IGNyZWRlbnRpYWxzKGNyZWRlbnRpYWxzKSB7IHRoaXMuX2NyZWRlbnRpYWxzID0gY3JlZGVudGlhbHMgfVxuICBnZXQgaGVhZGVycygpIHsgcmV0dXJuIHRoaXMuX2hlYWRlcnMgfVxuICBzZXQgaGVhZGVycyhoZWFkZXJzKSB7IHRoaXMuX2hlYWRlcnMgPSBoZWFkZXJzIH1cbiAgZ2V0IHJlZGlyZWN0KCkgeyByZXR1cm4gdGhpcy5fcmVkaXJlY3QgfVxuICBzZXQgcmVkaXJlY3QocmVkaXJlY3QpIHsgdGhpcy5fcmVkaXJlY3QgPSByZWRpcmVjdCB9XG4gIGdldCByZWZlcnJlclBvbGljeSgpIHsgcmV0dXJuIHRoaXMuX3JlZmVycmVyUG9saWN5IH1cbiAgc2V0IHJlZmVycmVyUG9saWN5KHJlZmVycmVyUG9saWN5KSB7IHRoaXMuX3JlZmVycmVyUG9saWN5ID0gcmVmZXJyZXJQb2xpY3kgfVxuICBnZXQgYm9keSgpIHsgcmV0dXJuIHRoaXMuX2JvZHkgfVxuICBzZXQgYm9keShib2R5KSB7IHRoaXMuX2JvZHkgPSBib2R5IH1cbiAgZ2V0IGZpbGVzKCkgeyByZXR1cm4gdGhpcy5fZmlsZXMgfVxuICBzZXQgZmlsZXMoZmlsZXMpIHsgdGhpcy5fZmlsZXMgPSBmaWxlcyB9XG4gIGdldCBwYXJhbWV0ZXJzKCkgeyByZXR1cm4gdGhpcy5fcGFyYW1ldGVycyB8fCBudWxsIH1cbiAgc2V0IHBhcmFtZXRlcnMocGFyYW1ldGVycykgeyB0aGlzLl9wYXJhbWV0ZXJzID0gcGFyYW1ldGVycyB9XG4gIGdldCBwcmV2aW91c0Fib3J0Q29udHJvbGxlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fcHJldmlvdXNBYm9ydENvbnRyb2xsZXJcbiAgfVxuICBzZXQgcHJldmlvdXNBYm9ydENvbnRyb2xsZXIocHJldmlvdXNBYm9ydENvbnRyb2xsZXIpIHsgdGhpcy5fcHJldmlvdXNBYm9ydENvbnRyb2xsZXIgPSBwcmV2aW91c0Fib3J0Q29udHJvbGxlciB9XG4gIGdldCBhYm9ydENvbnRyb2xsZXIoKSB7XG4gICAgaWYoIXRoaXMuX2Fib3J0Q29udHJvbGxlcikge1xuICAgICAgdGhpcy5wcmV2aW91c0Fib3J0Q29udHJvbGxlciA9IHRoaXMuX2Fib3J0Q29udHJvbGxlclxuICAgIH1cbiAgICB0aGlzLl9hYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKClcbiAgICByZXR1cm4gdGhpcy5fYWJvcnRDb250cm9sbGVyXG4gIH1cbiAgZ2V0IHJlc3BvbnNlKCkgeyByZXR1cm4gdGhpcy5fcmVzcG9uc2UgfVxuICBzZXQgcmVzcG9uc2UocmVzcG9uc2UpIHsgdGhpcy5fcmVzcG9uc2UgPSByZXNwb25zZSB9XG4gIGdldCByZXNwb25zZURhdGEoKSB7IHJldHVybiB0aGlzLl9yZXNwb25zZURhdGEgfVxuICBzZXQgcmVzcG9uc2VEYXRhKHJlc3BvbnNlRGF0YSkgeyB0aGlzLl9yZXNwb25zZURhdGEgPSByZXNwb25zZURhdGEgfVxuICBhYm9ydCgpIHtcbiAgICB0aGlzLmFib3J0Q29udHJvbGxlci5hYm9ydCgpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBmZXRjaCgpIHtcbiAgICBjb25zdCBmZXRjaE9wdGlvbnMgPSB0aGlzLnZhbGlkU2V0dGluZ3MucmVkdWNlKChfZmV0Y2hPcHRpb25zLCBmZXRjaE9wdGlvbk5hbWUpID0+IHtcbiAgICAgIGlmKHRoaXNbZmV0Y2hPcHRpb25OYW1lXSkgX2ZldGNoT3B0aW9uc1tmZXRjaE9wdGlvbk5hbWVdID0gdGhpc1tmZXRjaE9wdGlvbk5hbWVdXG4gICAgICByZXR1cm4gX2ZldGNoT3B0aW9uc1xuICAgIH0sIHt9KVxuICAgIGZldGNoT3B0aW9ucy5zaWduYWwgPSB0aGlzLmFib3J0Q29udHJvbGxlci5zaWduYWxcbiAgICBpZih0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyKSB0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyLmFib3J0KClcbiAgICByZXR1cm4gZmV0Y2godGhpcy51cmwsIGZldGNoT3B0aW9ucylcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICB0aGlzLnJlc3BvbnNlID0gcmVzcG9uc2VcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKVxuICAgICAgfSlcbiAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGlmKFxuICAgICAgICAgIGRhdGEuY29kZSA+PSA0MDAgJiZcbiAgICAgICAgICBkYXRhLmNvZGUgPD0gNDk5XG4gICAgICAgICkge1xuICAgICAgICAgIHRocm93IGRhdGFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVtaXQoXG4gICAgICAgICAgICAncmVhZHknLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgKVxuICAgICAgICAgIHJldHVybiBkYXRhXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgICAnZXJyb3InLFxuICAgICAgICAgIGVycm9yLFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuIGVycm9yXG4gICAgICB9KVxuICB9XG4gIGFzeW5jIGZldGNoU3luYygpIHtcbiAgICBjb25zdCBmZXRjaE9wdGlvbnMgPSB0aGlzLnZhbGlkU2V0dGluZ3MucmVkdWNlKChfZmV0Y2hPcHRpb25zLCBmZXRjaE9wdGlvbk5hbWUpID0+IHtcbiAgICAgIGlmKHRoaXNbZmV0Y2hPcHRpb25OYW1lXSkgX2ZldGNoT3B0aW9uc1tmZXRjaE9wdGlvbk5hbWVdID0gdGhpc1tmZXRjaE9wdGlvbk5hbWVdXG4gICAgICByZXR1cm4gX2ZldGNoT3B0aW9uc1xuICAgIH0sIHt9KVxuICAgIGZldGNoT3B0aW9ucy5zaWduYWwgPSB0aGlzLmFib3J0Q29udHJvbGxlci5zaWduYWxcbiAgICBpZih0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyKSB0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyLmFib3J0KClcbiAgICB0aGlzLnJlc3BvbnNlID0gIGF3YWl0IGZldGNoKHRoaXMudXJsLCBmZXRjaE9wdGlvbnMpXG4gICAgdGhpcy5yZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLnJlc3BvbnNlLmpzb24oKVxuICAgIGlmKFxuICAgICAgdGhpcy5yZXNwb25zZURhdGEuY29kZSA+PSA0MDAgJiZcbiAgICAgIHRoaXMucmVzcG9uc2VEYXRhLmNvZGUgPD0gNDk5XG4gICAgKSB7XG4gICAgICB0aGlzLmVtaXQoXG4gICAgICAgICdlcnJvcicsXG4gICAgICAgIHRoaXMucmVzcG9uc2VEYXRhLFxuICAgICAgICB0aGlzLFxuICAgICAgKVxuICAgICAgdGhyb3cgdGhpcy5yZXNwb25zZURhdGFcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAncmVhZHknLFxuICAgICAgICB0aGlzLnJlc3BvbnNlRGF0YSxcbiAgICAgICAgdGhpcyxcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucmVzcG9uc2VEYXRhXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFNlcnZpY2VcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4uL1V0aWxpdGllcy9pbmRleCdcblxuY29uc3QgTW9kZWwgPSBjbGFzcyBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy5lbWl0KFxuICAgICAgJ3JlYWR5JyxcbiAgICAgIHt9LFxuICAgICAgdGhpcyxcbiAgICApXG4gIH1cbiAgZ2V0IHV1aWQoKSB7XG4gICAgaWYoIXRoaXMuX3V1aWQpIHRoaXMuX3V1aWQgPSBVVUlEKClcbiAgICByZXR1cm4gdGhpcy5fdXVpZFxuICB9XG4gIGdldCB2YWxpZFNldHRpbmdzKCkgeyByZXR1cm4gW1xuICAgICdsb2NhbFN0b3JhZ2UnLFxuICAgICdkZWZhdWx0cycsXG4gICAgJ3NlcnZpY2VzJyxcbiAgICAnc2VydmljZUV2ZW50cycsXG4gICAgJ3NlcnZpY2VDYWxsYmFja3MnLFxuICBdIH1cbiAgZ2V0IGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXMoKSB7IHJldHVybiBbXG4gICAgJ3NlcnZpY2UnLFxuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gICAgdGhpcy5iaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzXG4gICAgICAuZm9yRWFjaCgoYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlKSA9PiB7XG4gICAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSwgJ29uJylcbiAgICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCBzZXJ2aWNlcygpIHtcbiAgICBpZighdGhpcy5fc2VydmljZXMpIHRoaXMuX3NlcnZpY2VzID0ge31cbiAgICByZXR1cm4gdGhpcy5fc2VydmljZXNcbiAgfVxuICBzZXQgc2VydmljZXMoc2VydmljZXMpIHsgdGhpcy5fc2VydmljZXMgPSBzZXJ2aWNlcyB9XG4gIGdldCBkYXRhKCkge1xuICAgIGlmKCF0aGlzLl9kYXRhKSB0aGlzLl9kYXRhID0ge31cbiAgICByZXR1cm4gdGhpcy5fZGF0YVxuICB9XG4gIGdldCBkZWZhdWx0cygpIHtcbiAgICBpZighdGhpcy5fZGVmYXVsdHMpIHRoaXMuX2RlZmF1bHRzID0ge31cbiAgICByZXR1cm4gdGhpcy5fZGVmYXVsdHNcbiAgfVxuICBzZXQgZGVmYXVsdHMoZGVmYXVsdHMpIHtcbiAgICBpZih0aGlzLmxvY2FsU3RvcmFnZS5zeW5jID09PSB0cnVlKSB7XG4gICAgICBpZihPYmplY3QuZW50cmllcyh0aGlzLmRiKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdHMgPSB0aGlzLmRiXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RlZmF1bHRzID0gZGVmYXVsdHNcbiAgICB9XG4gICAgdGhpcy5zZXQodGhpcy5kZWZhdWx0cylcbiAgfVxuICBnZXQgbG9jYWxTdG9yYWdlKCkgeyByZXR1cm4gdGhpcy5fbG9jYWxTdG9yYWdlIHx8IHt9IH1cbiAgc2V0IGxvY2FsU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHsgdGhpcy5fbG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yYWdlIH1cbiAgZ2V0IHN0b3JhZ2VDb250YWluZXIoKSB7IHJldHVybiB7fSB9XG4gIGdldCBkYigpIHsgcmV0dXJuIHRoaXMuX2RiIH1cbiAgZ2V0IF9kYigpIHtcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgfHwgSlNPTi5zdHJpbmdpZnkodGhpcy5zdG9yYWdlQ29udGFpbmVyKVxuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICByZXNldEV2ZW50cyhjbGFzc1R5cGUpIHtcbiAgICBbXG4gICAgICAnb2ZmJyxcbiAgICAgICdvbidcbiAgICBdLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICAgICAgdGhpcy50b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpXG4gICAgfSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZCkge1xuICAgIGNvbnN0IGJhc2VOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgncycpXG4gICAgY29uc3QgYmFzZUV2ZW50c05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdFdmVudHMnKVxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3NOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJylcbiAgICBjb25zdCBiYXNlID0gdGhpc1tiYXNlTmFtZV1cbiAgICBjb25zdCBiYXNlRXZlbnRzID0gdGhpc1tiYXNlRXZlbnRzTmFtZV1cbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzID0gdGhpc1tiYXNlQ2FsbGJhY2tzTmFtZV1cbiAgICBpZihcbiAgICAgIGJhc2UgJiZcbiAgICAgIGJhc2VFdmVudHMgJiZcbiAgICAgIGJhc2VDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKGJhc2VFdmVudHMpXG4gICAgICAgIC5mb3JFYWNoKChbYmFzZUV2ZW50RGF0YSwgYmFzZUNhbGxiYWNrTmFtZV0pID0+IHtcbiAgICAgICAgICBsZXQgW2Jhc2VUYXJnZXROYW1lLCBiYXNlRXZlbnROYW1lXSA9IGJhc2VFdmVudERhdGEuc3BsaXQoJyAnKVxuICAgICAgICAgIGxldCBiYXNlVGFyZ2V0ID0gYmFzZVtiYXNlVGFyZ2V0TmFtZV1cbiAgICAgICAgICBsZXQgYmFzZUNhbGxiYWNrID0gYmFzZUNhbGxiYWNrc1tiYXNlQ2FsbGJhY2tOYW1lXVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrICYmXG4gICAgICAgICAgICBiYXNlQ2FsbGJhY2submFtZS5zcGxpdCgnICcpLmxlbmd0aCA9PT0gMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZUNhbGxiYWNrID0gYmFzZUNhbGxiYWNrLmJpbmQodGhpcylcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldCAmJlxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBiYXNlVGFyZ2V0W21ldGhvZF0oYmFzZUV2ZW50TmFtZSwgYmFzZUNhbGxiYWNrKVxuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge31cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0REIoKSB7XG4gICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICB2YXIgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBsZXQgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgZGJba2V5XSA9IHZhbHVlXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHRoaXMuX2RiID0gZGJcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0REIoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZGVsZXRlIHRoaXMuX2RiXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgZGVsZXRlIGRiW2tleV1cbiAgICAgICAgdGhpcy5fZGIgPSBkYlxuICAgICAgICBicmVha1xuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlLCBzaWxlbnQpIHtcbiAgICBjb25zdCBjdXJyZW50RGF0YVByb3BlcnR5ID0gdGhpcy5kYXRhW2tleV1cbiAgICBpZighc2lsZW50KSB7XG4gICAgICB0aGlzLmVtaXQoJ2JlZm9yZVNldCcuY29uY2F0KCc6Jywga2V5KSwge1xuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgdmFsdWU6IHRoaXMuZ2V0KGtleSksXG4gICAgICB9LCB7XG4gICAgICAgIGtleToga2V5LFxuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICB9LCB0aGlzKVxuICAgIH1cbiAgICBpZighY3VycmVudERhdGFQcm9wZXJ0eSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcy5kYXRhLCB7XG4gICAgICAgIFsnXycuY29uY2F0KGtleSldOiB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBba2V5XToge1xuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNbJ18nLmNvbmNhdChrZXkpXSB9LFxuICAgICAgICAgIHNldCh2YWx1ZSkgeyB0aGlzWydfJy5jb25jYXQoa2V5KV0gPSB2YWx1ZSB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLmRhdGFba2V5XSA9IHZhbHVlXG4gICAgaWYoY3VycmVudERhdGFQcm9wZXJ0eSBpbnN0YW5jZW9mIE1vZGVsKSB7XG4gICAgICBjb25zdCBlbWl0ID0gKG5hbWUsIGRhdGEsIG1vZGVsKSA9PiB0aGlzLmVtaXQobmFtZSwgZGF0YSwgbW9kZWwpXG4gICAgICB0aGlzLmRhdGFba2V5XVxuICAgICAgICAub24oJ2JlZm9yZVNldCcsIHRoaXMuZW1pdChldmVudC5uYW1lLCBldmVudC5kYXRhLCBtb2RlbCkpXG4gICAgICAgIC5vbignc2V0JywgdGhpcy5lbWl0KGV2ZW50Lm5hbWUsIGV2ZW50LmRhdGEsIG1vZGVsKSlcbiAgICAgICAgLm9uKCdiZWZvcmVVbnNldCcsIHRoaXMuZW1pdChldmVudC5uYW1lLCBldmVudC5kYXRhLCBtb2RlbCkpXG4gICAgICAgIC5vbigndW5zZXQnLCB0aGlzLmVtaXQoZXZlbnQubmFtZSwgZXZlbnQuZGF0YSwgbW9kZWwpKVxuICAgIH1cbiAgICBpZighc2lsZW50KSB7XG4gICAgICB0aGlzLmVtaXQoJ3NldCcuY29uY2F0KCc6Jywga2V5KSwge1xuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgfSwgdGhpcylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldERhdGFQcm9wZXJ0eShrZXksIHNpbGVudCkge1xuICAgIGlmKCFzaWxlbnQpIHtcbiAgICAgIHRoaXMuZW1pdCgnYmVmb3JlVW5zZXQnLmNvbmNhdCgnOicsIGFyZ3VtZW50c1swXSksIHRoaXMpXG4gICAgfVxuICAgIGlmKHRoaXMuZGF0YVtrZXldKSB7XG4gICAgICBkZWxldGUgdGhpcy5kYXRhW2tleV1cbiAgICB9XG4gICAgaWYoIXNpbGVudCkge1xuICAgICAgdGhpcy5lbWl0KCd1bnNldCcuY29uY2F0KCc6JywgYXJndW1lbnRzWzBdKSwgdGhpcylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBnZXQoKSB7XG4gICAgaWYoYXJndW1lbnRzWzBdKSByZXR1cm4gdGhpcy5kYXRhW2FyZ3VtZW50c1swXV1cbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy5kYXRhKVxuICAgICAgLnJlZHVjZSgoX2RhdGEsIFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBfZGF0YVtrZXldID0gdmFsdWVcbiAgICAgICAgcmV0dXJuIF9kYXRhXG4gICAgICB9LCB7fSlcbiAgfVxuICBzZXQoKSB7XG4gICAgY29uc3QgX2FyZ3VtZW50cyA9IEFycmF5LmZyb20oYXJndW1lbnRzKVxuICAgIHZhciBrZXksIHZhbHVlLCBzaWxlbnRcbiAgICBpZihfYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAga2V5ID0gX2FyZ3VtZW50c1swXVxuICAgICAgdmFsdWUgPSBfYXJndW1lbnRzWzFdXG4gICAgICBzaWxlbnQgPSBfYXJndW1lbnRzWzJdXG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ2JlZm9yZVNldCcsIHRoaXMuZGF0YSwgT2JqZWN0LmFzc2lnbihcbiAgICAgICAge30sXG4gICAgICAgIHRoaXMuZGF0YSxcbiAgICAgICAge1xuICAgICAgICAgIFtrZXldOiB2YWx1ZSxcbiAgICAgICAgfSxcbiAgICAgICksIHRoaXMpXG4gICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlLCBzaWxlbnQpXG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ3NldCcsIHRoaXMuZGF0YSwgdGhpcylcbiAgICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KSB0aGlzLnNldERCKGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKVxuICAgIH0gZWxzZSBpZihfYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgaWYoXG4gICAgICAgIHR5cGVvZiBfYXJndW1lbnRzWzBdID09PSAnb2JqZWN0JyAmJlxuICAgICAgICB0eXBlb2YgX2FyZ3VtZW50c1sxXSA9PT0gJ2Jvb2xlYW4nXG4gICAgICApIHtcbiAgICAgICAgc2lsZW50ID0gX2FyZ3VtZW50c1sxXVxuICAgICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ2JlZm9yZVNldCcsIHRoaXMuZGF0YSwgT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICB7fSxcbiAgICAgICAgICB0aGlzLmRhdGEsXG4gICAgICAgICAgX2FyZ3VtZW50c1swXSxcbiAgICAgICAgKSwgdGhpcylcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoX2FyZ3VtZW50c1swXSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KVxuICAgICAgICB9KVxuICAgICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ3NldCcsIHRoaXMuZGF0YSwgdGhpcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgnYmVmb3JlU2V0JywgdGhpcy5kYXRhLCBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIHRoaXMuZGF0YSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBbX2FyZ3VtZW50c1swXV06IF9hcmd1bWVudHNbMV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgKSwgdGhpcylcbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoX2FyZ3VtZW50c1swXSwgX2FyZ3VtZW50c1sxXSlcbiAgICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCdzZXQnLCB0aGlzLmRhdGEsIHRoaXMpXG4gICAgICB9XG4gICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgdGhpcy5zZXREQihfYXJndW1lbnRzWzBdLCBfYXJndW1lbnRzWzFdKVxuICAgIH0gZWxzZSBpZihcbiAgICAgIF9hcmd1bWVudHMubGVuZ3RoID09PSAxICYmXG4gICAgICAhQXJyYXkuaXNBcnJheShfYXJndW1lbnRzWzBdKSAmJlxuICAgICAgdHlwZW9mIF9hcmd1bWVudHNbMF0gPT09ICdvYmplY3QnXG4gICAgKSB7XG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ2JlZm9yZVNldCcsIHRoaXMuZGF0YSwgT2JqZWN0LmFzc2lnbihcbiAgICAgICAge30sXG4gICAgICAgIHRoaXMuZGF0YSxcbiAgICAgICAgX2FyZ3VtZW50c1swXSxcbiAgICAgICksIHRoaXMpXG4gICAgICBPYmplY3QuZW50cmllcyhfYXJndW1lbnRzWzBdKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSlcbiAgICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHRoaXMuc2V0REIoa2V5LCB2YWx1ZSlcbiAgICAgIH0pXG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ3NldCcsIHRoaXMuZGF0YSwgdGhpcylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldCgpIHtcbiAgICBsZXQgc2lsZW50XG4gICAgaWYoXG4gICAgICBhcmd1bWVudHMubGVuZ3RoID09PSAyXG4gICAgKSB7XG4gICAgICBzaWxlbnQgPSBhcmd1bWVudHNbMV1cbiAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgnYmVmb3JlVW5zZXQnLCB0aGlzLmRhdGEsIHRoaXMpXG4gICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGFyZ3VtZW50c1swXSwgc2lsZW50KVxuICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCd1bnNldCcsIHRoaXMpXG4gICAgfSBlbHNlIGlmKFxuICAgICAgYXJndW1lbnRzLmxlbmd0aCA9PT0gMVxuICAgICkge1xuICAgICAgaWYodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHNpbGVudCA9IGFyZ3VtZW50c1swXVxuICAgICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ2JlZm9yZVVuc2V0JywgdGhpcy5kYXRhLCB0aGlzKVxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmRhdGEpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5LCBzaWxlbnQpXG4gICAgICAgIH0pXG4gICAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgndW5zZXQnLCB0aGlzKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ2JlZm9yZVVuc2V0JywgdGhpcy5kYXRhLCB0aGlzKVxuICAgICAgT2JqZWN0LmtleXModGhpcy5kYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICB9KVxuICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCd1bnNldCcsIHRoaXMpXG4gICAgfVxuICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KSB0aGlzLnVuc2V0REIoa2V5KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgcGFyc2UoZGF0YSA9IHRoaXMuZGF0YSkge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhkYXRhKS5yZWR1Y2UoKF9kYXRhLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgTW9kZWwpIHtcbiAgICAgICAgX2RhdGFba2V5XSA9IHZhbHVlLnBhcnNlKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9kYXRhW2tleV0gPSB2YWx1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIF9kYXRhXG4gICAgfSwge30pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW9kZWxcbiIsImltcG9ydCB7IFVVSUQgfSBmcm9tICcuLi9VdGlsaXRpZXMvaW5kZXguanMnXHJcbmltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xyXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vTW9kZWwvaW5kZXguanMnXHJcblxyXG5jbGFzcyBDb2xsZWN0aW9uIGV4dGVuZHMgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcclxuICAgIHN1cGVyKClcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xyXG4gIH1cclxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcclxuICAgICdpZEF0dHJpYnV0ZScsXHJcbiAgICAnbW9kZWwnLFxyXG4gICAgJ21vZGVsT3B0aW9ucycsXHJcbiAgICAnZGVmYXVsdHMnLFxyXG4gICAgJ3NlcnZpY2VzJyxcclxuICAgICdzZXJ2aWNlRXZlbnRzJyxcclxuICAgICdzZXJ2aWNlQ2FsbGJhY2tzJyxcclxuICAgICdsb2NhbFN0b3JhZ2UnXHJcbiAgXSB9XHJcbiAgZ2V0IGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXMoKSB7IHJldHVybiBbXHJcbiAgICAnc2VydmljZSdcclxuICBdIH1cclxuICBnZXQgc2V0dGluZ3MoKSB7IHJldHVybiB0aGlzLl9zZXR0aW5ncyB9XHJcbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XHJcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3MuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XHJcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cclxuICAgIH0pXHJcbiAgICB0aGlzLmJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXNcclxuICAgICAgLmZvckVhY2goKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSkgPT4ge1xyXG4gICAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSwgJ29uJylcclxuICAgICAgfSlcclxuICB9XHJcbiAgZ2V0IG9wdGlvbnMoKSB7XHJcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XHJcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xyXG4gIH1cclxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cclxuICBnZXQgc3RvcmFnZUNvbnRhaW5lcigpIHsgcmV0dXJuIFtdIH1cclxuICBnZXQgZGVmYXVsdElEQXR0cmlidXRlKCkgeyByZXR1cm4gJ19pZCcgfVxyXG4gIGdldCBkZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuX2RlZmF1bHRzIH1cclxuICBzZXQgZGVmYXVsdHMoZGVmYXVsdHMpIHtcclxuICAgIHRoaXMuX2RlZmF1bHRzID0gZGVmYXVsdHNcclxuICAgIHRoaXMuYWRkKGRlZmF1bHRzKVxyXG4gIH1cclxuICBnZXQgdXVpZCgpIHtcclxuICAgIGlmKCF0aGlzLl91dWlkKSB0aGlzLl91dWlkID0gVXRpbGl0aWVzLlVVSUQoKVxyXG4gICAgcmV0dXJuIHRoaXMuX3V1aWRcclxuICB9XHJcbiAgZ2V0IG1vZGVscygpIHtcclxuICAgIHRoaXMuX21vZGVscyA9IHRoaXMuX21vZGVscyB8fCB0aGlzLnN0b3JhZ2VDb250YWluZXJcclxuICAgIHJldHVybiB0aGlzLl9tb2RlbHNcclxuICB9XHJcbiAgc2V0IG1vZGVscyhtb2RlbHNEYXRhKSB7IHRoaXMuX21vZGVscyA9IG1vZGVsc0RhdGEgfVxyXG4gIGdldCBtb2RlbCgpIHsgcmV0dXJuIHRoaXMuX21vZGVsIH1cclxuICBzZXQgbW9kZWwobW9kZWwpIHsgdGhpcy5fbW9kZWwgPSBtb2RlbCB9XHJcbiAgZ2V0IGxvY2FsU3RvcmFnZSgpIHsgcmV0dXJuIHRoaXMuX2xvY2FsU3RvcmFnZSB9XHJcbiAgc2V0IGxvY2FsU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHsgdGhpcy5fbG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yYWdlIH1cclxuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGEgfVxyXG4gIGdldCBkYXRhKCkge1xyXG4gICAgY29uc3QgbW9kZWxzRXhpc3QgPSAoT2JqZWN0LmtleXModGhpcy5tb2RlbHMpLmxlbmd0aClcclxuICAgICAgPyB0cnVlXHJcbiAgICAgIDogZmFsc2VcclxuICAgIHJldHVybiAobW9kZWxzRXhpc3QpXHJcbiAgICAgID8gdGhpcy5tb2RlbHNcclxuICAgICAgICAubWFwKChtb2RlbCkgPT4gbW9kZWwucGFyc2UoKSlcclxuICAgICAgOiBbXVxyXG4gIH1cclxuICBnZXQgZGIoKSB7IHJldHVybiB0aGlzLl9kYiB9XHJcbiAgZ2V0IGRiKCkge1xyXG4gICAgbGV0IGRiID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHx8IEpTT04uc3RyaW5naWZ5KHRoaXMuc3RvcmFnZUNvbnRhaW5lcilcclxuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxyXG4gIH1cclxuICBzZXQgZGIoZGIpIHtcclxuICAgIGRiID0gSlNPTi5zdHJpbmdpZnkoZGIpXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCwgZGIpXHJcbiAgfVxyXG4gIHJlc2V0RXZlbnRzKGNsYXNzVHlwZSkge1xyXG4gICAgW1xyXG4gICAgICAnb2ZmJyxcclxuICAgICAgJ29uJ1xyXG4gICAgXS5mb3JFYWNoKChtZXRob2QpID0+IHtcclxuICAgICAgdGhpcy50b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgdG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKSB7XHJcbiAgICBjb25zdCBiYXNlTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ3MnKVxyXG4gICAgY29uc3QgYmFzZUV2ZW50c05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdFdmVudHMnKVxyXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrc05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKVxyXG4gICAgY29uc3QgYmFzZSA9IHRoaXNbYmFzZU5hbWVdXHJcbiAgICBjb25zdCBiYXNlRXZlbnRzID0gdGhpc1tiYXNlRXZlbnRzTmFtZV1cclxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3MgPSB0aGlzW2Jhc2VDYWxsYmFja3NOYW1lXVxyXG4gICAgaWYoXHJcbiAgICAgIGJhc2UgJiZcclxuICAgICAgYmFzZUV2ZW50cyAmJlxyXG4gICAgICBiYXNlQ2FsbGJhY2tzXHJcbiAgICApIHtcclxuICAgICAgT2JqZWN0LmVudHJpZXMoYmFzZUV2ZW50cylcclxuICAgICAgICAuZm9yRWFjaCgoW2Jhc2VFdmVudERhdGEsIGJhc2VDYWxsYmFja05hbWVdKSA9PiB7XHJcbiAgICAgICAgICBsZXQgW2Jhc2VUYXJnZXROYW1lLCBiYXNlRXZlbnROYW1lXSA9IGJhc2VFdmVudERhdGEuc3BsaXQoJyAnKVxyXG4gICAgICAgICAgbGV0IGJhc2VUYXJnZXQgPSBiYXNlW2Jhc2VUYXJnZXROYW1lXVxyXG4gICAgICAgICAgbGV0IGJhc2VDYWxsYmFjayA9IGJhc2VDYWxsYmFja3NbYmFzZUNhbGxiYWNrTmFtZV1cclxuICAgICAgICAgIGlmKFxyXG4gICAgICAgICAgICBiYXNlQ2FsbGJhY2sgJiZcclxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrLm5hbWUuc3BsaXQoJyAnKS5sZW5ndGggPT09IDFcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICBiYXNlQ2FsbGJhY2sgPSBiYXNlQ2FsbGJhY2suYmluZCh0aGlzKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIGJhc2VUYXJnZXROYW1lICYmXHJcbiAgICAgICAgICAgIGJhc2VFdmVudE5hbWUgJiZcclxuICAgICAgICAgICAgYmFzZVRhcmdldCAmJlxyXG4gICAgICAgICAgICBiYXNlQ2FsbGJhY2tcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIGJhc2VUYXJnZXRbbWV0aG9kXShiYXNlRXZlbnROYW1lLCBiYXNlQ2FsbGJhY2spXHJcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHt9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGdldE1vZGVsSW5kZXgobW9kZWxVVUlEKSB7XHJcbiAgICBsZXQgbW9kZWxJbmRleFxyXG4gICAgdGhpcy5fbW9kZWxzXHJcbiAgICAgIC5maW5kKChfbW9kZWwsIF9tb2RlbEluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYoX21vZGVsICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgX21vZGVsIGluc3RhbmNlb2YgTW9kZWwgJiZcclxuICAgICAgICAgICAgX21vZGVsLl91dWlkID09PSBtb2RlbFVVSURcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICBtb2RlbEluZGV4ID0gX21vZGVsSW5kZXhcclxuICAgICAgICAgICAgcmV0dXJuIF9tb2RlbFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIHJldHVybiBtb2RlbEluZGV4XHJcbiAgfVxyXG4gIHJlbW92ZU1vZGVsQnlJbmRleChtb2RlbEluZGV4KSB7XHJcbiAgICBsZXQgbW9kZWwgPSB0aGlzLl9tb2RlbHMuc3BsaWNlKG1vZGVsSW5kZXgsIDEsIG51bGwpXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdyZW1vdmU6bW9kZWwnLFxyXG4gICAgICBtb2RlbFswXS5wYXJzZSgpLFxyXG4gICAgICB0aGlzLFxyXG4gICAgICBtb2RlbFswXVxyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgYWRkTW9kZWwobW9kZWxEYXRhKSB7XHJcbiAgICBsZXQgbW9kZWxcclxuICAgIGlmKG1vZGVsRGF0YSBpbnN0YW5jZW9mIE1vZGVsKSB7XHJcbiAgICAgIG1vZGVsID0gbW9kZWxEYXRhXHJcbiAgICB9IGVsc2UgaWYoXHJcbiAgICAgIHRoaXMubW9kZWxcclxuICAgICkge1xyXG4gICAgICBjb25zdCBNb2RlbFByb3RvdHlwZSA9IHRoaXMubW9kZWxcclxuICAgICAgbW9kZWwgPSBuZXcgTW9kZWxQcm90b3R5cGUoe1xyXG4gICAgICAgIGRlZmF1bHRzOiBtb2RlbERhdGEsXHJcbiAgICAgIH0sIHRoaXMubW9kZWxPcHRpb25zKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbW9kZWwgPSBuZXcgTW9kZWwoe1xyXG4gICAgICAgIGRlZmF1bHRzOiBtb2RlbERhdGFcclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIG1vZGVsLm9uKFxyXG4gICAgICAnc2V0JyxcclxuICAgICAgKGV2ZW50LCBfbW9kZWwpID0+IHRoaXMuZW1pdChcclxuICAgICAgICAnY2hhbmdlOm1vZGVsJyxcclxuICAgICAgICB0aGlzLnBhcnNlKCksXHJcbiAgICAgICAgdGhpcyxcclxuICAgICAgICBfbW9kZWwsXHJcbiAgICAgICksXHJcbiAgICApXHJcbiAgICB0aGlzLm1vZGVscy5wdXNoKG1vZGVsKVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAnYWRkJyxcclxuICAgICAgbW9kZWwucGFyc2UoKSxcclxuICAgICAgdGhpcyxcclxuICAgICAgbW9kZWxcclxuICAgIClcclxuICAgIHJldHVybiBtb2RlbFxyXG4gIH1cclxuICBhZGQobW9kZWxEYXRhKSB7XHJcbiAgICBpZihBcnJheS5pc0FycmF5KG1vZGVsRGF0YSkpIHtcclxuICAgICAgbW9kZWxEYXRhXHJcbiAgICAgICAgLmZvckVhY2goKG1vZGVsKSA9PiB0aGlzLmFkZE1vZGVsKG1vZGVsKSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYWRkTW9kZWwobW9kZWxEYXRhKVxyXG4gICAgfVxyXG4gICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIHRoaXMuZGIgPSB0aGlzLmRhdGFcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ2NoYW5nZScsXHJcbiAgICAgIHRoaXMucGFyc2UoKSxcclxuICAgICAgdGhpc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcmVtb3ZlKG1vZGVsRGF0YSkge1xyXG4gICAgaWYoXHJcbiAgICAgICFBcnJheS5pc0FycmF5KG1vZGVsRGF0YSkgJiZcclxuICAgICAgdHlwZW9mIG1vZGVsRGF0YSA9PT0gJ29iamVjdCdcclxuICAgICkge1xyXG4gICAgICB2YXIgbW9kZWxJbmRleCA9IHRoaXMuZ2V0TW9kZWxJbmRleChtb2RlbERhdGEudXVpZClcclxuICAgICAgdGhpcy5yZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleClcclxuICAgIH0gZWxzZSBpZihBcnJheS5pc0FycmF5KG1vZGVsRGF0YSkpIHtcclxuICAgICAgbW9kZWxEYXRhXHJcbiAgICAgICAgLmZvckVhY2goKG1vZGVsKSA9PiB7XHJcbiAgICAgICAgICB2YXIgbW9kZWxJbmRleCA9IHRoaXMuZ2V0TW9kZWxJbmRleChtb2RlbC51dWlkKVxyXG4gICAgICAgICAgdGhpcy5yZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgdGhpcy5tb2RlbHMgPSB0aGlzLm1vZGVsc1xyXG4gICAgICAuZmlsdGVyKChtb2RlbCkgPT4gbW9kZWwgIT09IG51bGwpXHJcbiAgICBpZih0aGlzLl9sb2NhbFN0b3JhZ2UpIHRoaXMuZGIgPSB0aGlzLmRhdGFcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ3JlbW92ZScsXHJcbiAgICAgIHRoaXMucGFyc2UoKSxcclxuICAgICAgdGhpc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLnJlbW92ZSh0aGlzLl9tb2RlbHMpXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBwYXJzZShkYXRhKSB7XHJcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLmRhdGEgfHwgdGhpcy5zdG9yYWdlQ29udGFpbmVyXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSlcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvbGxlY3Rpb25cclxuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXguanMnXG5cbmNsYXNzIFZpZXcgZXh0ZW5kcyBFdmVudHMge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICB9XG4gIGdldCB2YWxpZFNldHRpbmdzKCkgeyByZXR1cm4gW1xuICAgICdhdHRyaWJ1dGVzJyxcbiAgICAnZWxlbWVudE5hbWUnLFxuICAgICdlbGVtZW50JyxcbiAgICAnaW5zZXJ0JyxcbiAgICAndGVtcGxhdGUnLFxuICAgICd1aUVsZW1lbnRzJyxcbiAgICAndWlFbGVtZW50RXZlbnRzJyxcbiAgICAndWlFbGVtZW50Q2FsbGJhY2tzJyxcbiAgICAncmVuZGVyJ1xuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCBlbGVtZW50TmFtZSgpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnROYW1lIH1cbiAgc2V0IGVsZW1lbnROYW1lKGVsZW1lbnROYW1lKSB7IHRoaXMuX2VsZW1lbnROYW1lID0gZWxlbWVudE5hbWUgfVxuICBnZXQgZWxlbWVudCgpIHtcbiAgICBpZighdGhpcy5fZWxlbWVudCkge1xuICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5lbGVtZW50TmFtZSlcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuYXR0cmlidXRlcykuZm9yRWFjaCgoW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdKSA9PiB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpXG4gICAgICB9KVxuICAgICAgdGhpcy5lbGVtZW50T2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmVsZW1lbnQsIHtcbiAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRcbiAgfVxuICBnZXQgZWxlbWVudE9ic2VydmVyKCkge1xuICAgIHRoaXMuX2VsZW1lbnRPYnNlcnZlciA9IHRoaXMuX2VsZW1lbnRPYnNlcnZlciB8fCBuZXcgTXV0YXRpb25PYnNlcnZlcihcbiAgICAgIHRoaXMuZWxlbWVudE9ic2VydmUuYmluZCh0aGlzKVxuICAgIClcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudE9ic2VydmVyXG4gIH1cbiAgc2V0IGVsZW1lbnQoZWxlbWVudCkge1xuICAgIGlmKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnRcbiAgfVxuICBnZXQgYXR0cmlidXRlcygpIHsgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXMgfHwge30gfVxuICBzZXQgYXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7IHRoaXMuX2F0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzIH1cbiAgZ2V0IHRlbXBsYXRlKCkgeyByZXR1cm4gdGhpcy5fdGVtcGxhdGUgfVxuICBzZXQgdGVtcGxhdGUodGVtcGxhdGUpIHsgdGhpcy5fdGVtcGxhdGUgPSB0ZW1wbGF0ZSB9XG4gIGdldCB1aUVsZW1lbnRzKCkgeyByZXR1cm4gdGhpcy5fdWlFbGVtZW50cyB8fCB7fSB9XG4gIHNldCB1aUVsZW1lbnRzKHVpRWxlbWVudHMpIHtcbiAgICB0aGlzLl91aUVsZW1lbnRzID0gdWlFbGVtZW50c1xuICAgIC8vIHRoaXMudG9nZ2xlRXZlbnRzKClcbiAgfVxuICBnZXQgdWlFbGVtZW50RXZlbnRzKCkgeyByZXR1cm4gdGhpcy5fdWlFbGVtZW50RXZlbnRzIHx8IHt9IH1cbiAgc2V0IHVpRWxlbWVudEV2ZW50cyh1aUVsZW1lbnRFdmVudHMpIHtcbiAgICB0aGlzLl91aUVsZW1lbnRFdmVudHMgPSB1aUVsZW1lbnRFdmVudHNcbiAgICAvLyB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gIH1cbiAgZ2V0IHVpRWxlbWVudENhbGxiYWNrcygpIHsgcmV0dXJuIHRoaXMuX3VpRWxlbWVudENhbGxiYWNrcyB8fCB7fSB9XG4gIHNldCB1aUVsZW1lbnRDYWxsYmFja3ModWlFbGVtZW50Q2FsbGJhY2tzKSB7XG4gICAgdGhpcy5fdWlFbGVtZW50Q2FsbGJhY2tzID0gdWlFbGVtZW50Q2FsbGJhY2tzXG4gICAgT2JqZWN0LnZhbHVlcyh0aGlzLl91aUVsZW1lbnRDYWxsYmFja3MpXG4gICAgICAuZm9yRWFjaCgodWlFbGVtZW50Q2FsbGJhY2spID0+IHVpRWxlbWVudENhbGxiYWNrLmJpbmQodGhpcykpXG4gICAgLy8gdGhpcy50b2dnbGVFdmVudHMoKVxuICB9XG4gIGdldCB1aSgpIHtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpc1xuICAgIGlmKCF0aGlzLl91aSkge1xuICAgICAgdGhpcy5fdWkgPSBPYmplY3QuZW50cmllcyh0aGlzLnVpRWxlbWVudHMpLnJlZHVjZSgoX3VpLFt1aUVsZW1lbnROYW1lLCB1aUVsZW1lbnRRdWVyeV0pID0+IHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoX3VpLCB7XG4gICAgICAgICAgW3VpRWxlbWVudE5hbWVdOiB7XG4gICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgIGlmKHR5cGVvZiB1aUVsZW1lbnRRdWVyeSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBsZXQgcXVlcnlSZXN1bHRzID0gY29udGV4dC5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodWlFbGVtZW50UXVlcnkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIChxdWVyeVJlc3VsdHMubGVuZ3RoID4gMSkgPyBxdWVyeVJlc3VsdHMgOiBxdWVyeVJlc3VsdHMuaXRlbSgwKVxuICAgICAgICAgICAgICB9IGVsc2UgaWYoXG4gICAgICAgICAgICAgICAgdWlFbGVtZW50UXVlcnkgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxuICAgICAgICAgICAgICAgIHVpRWxlbWVudFF1ZXJ5IGluc3RhbmNlb2YgRG9jdW1lbnQgfHxcbiAgICAgICAgICAgICAgICB1aUVsZW1lbnRRdWVyeSBpbnN0YW5jZW9mIFdpbmRvd1xuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdWlFbGVtZW50UXVlcnlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBfdWlcbiAgICAgIH0sIHt9KVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcy5fdWksIHtcbiAgICAgICAgJyRlbGVtZW50Jzoge1xuICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGNvbnRleHQuZWxlbWVudCB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdWlcbiAgfVxuICByZXNldFVJKCkge1xuICAgIGRlbGV0ZSB0aGlzLl91aVxuICAgIHRoaXMudG9nZ2xlRXZlbnRzKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGVsZW1lbnRPYnNlcnZlKG11dGF0aW9uUmVjb3JkTGlzdCwgb2JzZXJ2ZXIpIHtcbiAgICBmb3IobGV0IFttdXRhdGlvblJlY29yZEluZGV4LCBtdXRhdGlvblJlY29yZF0gb2YgT2JqZWN0LmVudHJpZXMobXV0YXRpb25SZWNvcmRMaXN0KSkge1xuICAgICAgc3dpdGNoKG11dGF0aW9uUmVjb3JkLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnY2hpbGRMaXN0JzpcbiAgICAgICAgICBpZihtdXRhdGlvblJlY29yZC5hZGRlZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnModGhpcy51aSkpXG4gICAgICAgICAgICAvLyAuZm9yRWFjaCgoW3VpS2V5LCB1aVZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgLy8gICBjb25zdCB1aVZhbHVlR2V0ID0gdWlWYWx1ZS5nZXQoKVxuICAgICAgICAgICAgLy8gICBjb25zdCBhZGRlZFVJRWxlbWVudCA9IEFycmF5LmZyb20obXV0YXRpb25SZWNvcmQuYWRkZWROb2RlcykuZmluZCgoYWRkZWROb2RlKSA9PiB7XG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ2FkZGVkTm9kZScsIGFkZGVkTm9kZSlcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygndWlWYWx1ZUdldCcsIHVpVmFsdWVHZXQpXG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIGFkZGVkTm9kZSA9PT0gdWlWYWx1ZUdldFxuICAgICAgICAgICAgLy8gICB9KVxuICAgICAgICAgICAgLy8gICBpZihhZGRlZFVJRWxlbWVudCkge1xuICAgICAgICAgICAgLy8gICAgIHRoaXMudG9nZ2xlRXZlbnRzKHVpS2V5KVxuICAgICAgICAgICAgLy8gICB9XG4gICAgICAgICAgICAvLyB9KVxuICAgICAgICAgICAgdGhpcy50b2dnbGVFdmVudHMoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBiaW5kRXZlbnRUb0VsZW1lbnQoZWxlbWVudCwgbWV0aG9kLCBldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2tOYW1lKSB7XG4gICAgdHJ5IHtcbiAgICAgIHN3aXRjaChtZXRob2QpIHtcbiAgICAgICAgY2FzZSAnYWRkRXZlbnRMaXN0ZW5lcic6XG4gICAgICAgICAgdGhpcy51aUVsZW1lbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdID0gdGhpcy51aUVsZW1lbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdLy8gLmJpbmQodGhpcylcbiAgICAgICAgICBlbGVtZW50W21ldGhvZF0oZXZlbnROYW1lLCB0aGlzLnVpRWxlbWVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAncmVtb3ZlRXZlbnRMaXN0ZW5lcic6XG4gICAgICAgICAgZWxlbWVudFttZXRob2RdKGV2ZW50TmFtZSwgdGhpcy51aUVsZW1lbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdKVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfSBjYXRjaChlcnJvcikge31cbiAgfVxuICB0b2dnbGVFdmVudHModGFyZ2V0VUlFbGVtZW50TmFtZSA9IG51bGwpIHtcbiAgICB0aGlzLmlzVG9nZ2xpbmcgPSB0cnVlXG4gICAgY29uc3QgdWkgPSB0aGlzLnVpXG4gICAgY29uc3QgZXZlbnRCaW5kTWV0aG9kcyA9IFsncmVtb3ZlRXZlbnRMaXN0ZW5lcicsICdhZGRFdmVudExpc3RlbmVyJ11cbiAgICBpZighdGFyZ2V0VUlFbGVtZW50TmFtZSkge1xuICAgICAgZXZlbnRCaW5kTWV0aG9kcy5mb3JFYWNoKChldmVudEJpbmRNZXRob2QpID0+IHtcbiAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcy51aUVsZW1lbnRFdmVudHMpLmZvckVhY2goKFt1aUVsZW1lbnRFdmVudFNldHRpbmdzLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZV0pID0+IHtcbiAgICAgICAgICBsZXQgW3VpRWxlbWVudE5hbWUsIHVpRWxlbWVudEV2ZW50TmFtZV0gPSB1aUVsZW1lbnRFdmVudFNldHRpbmdzLnNwbGl0KCcgJylcbiAgICAgICAgICBpZih1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XG4gICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXS5mb3JFYWNoKCh1aUVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlFbGVtZW50LCBldmVudEJpbmRNZXRob2QsIHVpRWxlbWVudEV2ZW50TmFtZSwgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSBpZih1aVt1aUVsZW1lbnROYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlbdWlFbGVtZW50TmFtZV0sIGV2ZW50QmluZE1ldGhvZCwgdWlFbGVtZW50RXZlbnROYW1lLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBldmVudEJpbmRNZXRob2RzLmZvckVhY2goKGV2ZW50QmluZE1ldGhvZCkgPT4ge1xuICAgICAgICBjb25zdCB1aUVsZW1lbnRFdmVudHMgPSBPYmplY3QuZW50cmllcyh0aGlzLnVpRWxlbWVudEV2ZW50cykuZm9yRWFjaCgoW3VpRWxlbWVudEV2ZW50U2V0dGluZ3MsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGxldCBbdWlFbGVtZW50TmFtZSwgdWlFbGVtZW50RXZlbnROYW1lXSA9IHVpRWxlbWVudEV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxuICAgICAgICAgIGlmKHRhcmdldFVJRWxlbWVudE5hbWUgPT09IHVpRWxlbWVudE5hbWUpIHtcbiAgICAgICAgICAgIGlmKHVpW3VpRWxlbWVudE5hbWVdIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0uZm9yRWFjaCgodWlFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlFbGVtZW50LCBldmVudEJpbmRNZXRob2QsIHVpRWxlbWVudEV2ZW50TmFtZSwgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2UgaWYodWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICB0aGlzLmJpbmRFdmVudFRvRWxlbWVudCh1aVt1aUVsZW1lbnROYW1lXSwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuaXNUb2dnbGluZyA9IGZhbHNlXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdXRvSW5zZXJ0KCkge1xuICAgIGlmKHRoaXMuaW5zZXJ0KSB7XG4gICAgICBjb25zdCBwYXJlbnQgPSAodHlwZW9mIHRoaXMuaW5zZXJ0LnBhcmVudCA9PT0gJ3N0cmluZycpXG4gICAgICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmluc2VydC5wYXJlbnQpXG4gICAgICAgIDogKHRoaXMuaW5zZXJ0LnBhcmVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICAgID8gdGhpcy5pbnNlcnQucGFyZW50XG4gICAgICAgICAgOiBudWxsXG4gICAgICBjb25zdCBtZXRob2QgPSB0aGlzLmluc2VydC5tZXRob2RcbiAgICAgIHBhcmVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQobWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgYXV0b1JlbW92ZSgpIHtcbiAgICBpZih0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHJlbmRlcihkYXRhID0ge30pIHtcbiAgICBpZih0aGlzLnRlbXBsYXRlKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUoZGF0YSlcbiAgICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZVxuICAgIH1cbiAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgVmlld1xuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXgnXG5cbmNvbnN0IENvbnRyb2xsZXIgPSBjbGFzcyBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ21vZGVscycsXG4gICAgJ21vZGVsRXZlbnRzJyxcbiAgICAnbW9kZWxDYWxsYmFja3MnLFxuICAgICdjb2xsZWN0aW9ucycsXG4gICAgJ2NvbGxlY3Rpb25FdmVudHMnLFxuICAgICdjb2xsZWN0aW9uQ2FsbGJhY2tzJyxcbiAgICAndmlld3MnLFxuICAgICd2aWV3RXZlbnRzJyxcbiAgICAndmlld0NhbGxiYWNrcycsXG4gICAgJ2NvbnRyb2xsZXJzJyxcbiAgICAnY29udHJvbGxlckV2ZW50cycsXG4gICAgJ2NvbnRyb2xsZXJDYWxsYmFja3MnLFxuICAgICdyb3V0ZXJzJyxcbiAgICAncm91dGVyRXZlbnRzJyxcbiAgICAncm91dGVyQ2FsbGJhY2tzJyxcbiAgXSB9XG4gIGdldCBiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzKCkgeyByZXR1cm4gW1xuICAgICdtb2RlbCcsXG4gICAgJ3ZpZXcnLFxuICAgICdjb2xsZWN0aW9uJyxcbiAgICAnY29udHJvbGxlcicsXG4gICAgJ3JvdXRlcicsXG4gIF0gfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cbiAgZ2V0IHNldHRpbmdzKCkge1xuICAgIGlmKCF0aGlzLl9zZXR0aW5ncykgdGhpcy5fc2V0dGluZ3MgPSB7fVxuICAgIHJldHVybiB0aGlzLl9zZXR0aW5nc1xuICB9XG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3NcbiAgICAgIC5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgICAgaWYodGhpcy5zZXR0aW5nc1t2YWxpZFNldHRpbmddKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBbJ18nLmNvbmNhdCh2YWxpZFNldHRpbmcpXToge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtYmVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFt2YWxpZFNldHRpbmddOiB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpc1snXycuY29uY2F0KHZhbGlkU2V0dGluZyldIH0sXG4gICAgICAgICAgICAgICAgc2V0KHZhbHVlKSB7IHRoaXNbJ18nLmNvbmNhdCh2YWxpZFNldHRpbmcpXSA9IHZhbHVlIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKVxuICAgICAgICAgIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHRoaXMuc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIHRoaXMuYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlc1xuICAgICAgLmZvckVhY2goKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSkgPT4ge1xuICAgICAgICB0aGlzLnJlc2V0RXZlbnRzKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSlcbiAgICAgIH0pXG4gIH1cbiAgcmVzZXRFdmVudHMoY2xhc3NUeXBlKSB7XG4gICAgW1xuICAgICAgJ29mZicsXG4gICAgICAnb24nXG4gICAgXS5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB0b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpIHtcbiAgICBjb25zdCBiYXNlTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ3MnKVxuICAgIGNvbnN0IGJhc2VFdmVudHNOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJylcbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXG4gICAgY29uc3QgYmFzZSA9IHRoaXNbYmFzZU5hbWVdIHx8IHt9XG4gICAgY29uc3QgYmFzZUV2ZW50cyA9IHRoaXNbYmFzZUV2ZW50c05hbWVdIHx8IHt9XG4gICAgY29uc3QgYmFzZUNhbGxiYWNrcyA9IHRoaXNbYmFzZUNhbGxiYWNrc05hbWVdIHx8IHt9XG4gICAgaWYoXG4gICAgICBPYmplY3QudmFsdWVzKGJhc2UpLmxlbmd0aCAmJlxuICAgICAgT2JqZWN0LnZhbHVlcyhiYXNlRXZlbnRzKS5sZW5ndGggJiZcbiAgICAgIE9iamVjdC52YWx1ZXMoYmFzZUNhbGxiYWNrcykubGVuZ3RoXG4gICAgKSB7XG4gICAgICBPYmplY3QuZW50cmllcyhiYXNlRXZlbnRzKVxuICAgICAgICAuZm9yRWFjaCgoW2Jhc2VFdmVudERhdGEsIGJhc2VDYWxsYmFja05hbWVdKSA9PiB7XG4gICAgICAgICAgY29uc3QgW2Jhc2VUYXJnZXROYW1lLCBiYXNlRXZlbnROYW1lXSA9IGJhc2VFdmVudERhdGEuc3BsaXQoJyAnKVxuICAgICAgICAgIGNvbnN0IGJhc2VUYXJnZXROYW1lU3Vic3RyaW5nRmlyc3QgPSBiYXNlVGFyZ2V0TmFtZS5zdWJzdHJpbmcoMCwgMSlcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0xhc3QgPSBiYXNlVGFyZ2V0TmFtZS5zdWJzdHJpbmcoYmFzZVRhcmdldE5hbWUubGVuZ3RoIC0gMSlcbiAgICAgICAgICBsZXQgYmFzZVRhcmdldHMgPSBbXVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdGaXJzdCA9PT0gJ1snICYmXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0xhc3QgPT09ICddJ1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZVRhcmdldHMgPSBPYmplY3QuZW50cmllcyhiYXNlKVxuICAgICAgICAgICAgICAucmVkdWNlKChfYmFzZVRhcmdldHMsIFtiYXNlTmFtZSwgYmFzZVRhcmdldF0pID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmFzZVRhcmdldE5hbWVSZWdFeHBTdHJpbmcgPSBiYXNlVGFyZ2V0TmFtZS5zbGljZSgxLCAtMSlcbiAgICAgICAgICAgICAgICBsZXQgYmFzZVRhcmdldE5hbWVSZWdFeHAgPSBuZXcgUmVnRXhwKGJhc2VUYXJnZXROYW1lUmVnRXhwU3RyaW5nKVxuICAgICAgICAgICAgICAgIGlmKGJhc2VOYW1lLm1hdGNoKGJhc2VUYXJnZXROYW1lUmVnRXhwKSkge1xuICAgICAgICAgICAgICAgICAgX2Jhc2VUYXJnZXRzLnB1c2goYmFzZVRhcmdldClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9iYXNlVGFyZ2V0c1xuICAgICAgICAgICAgICB9LCBbXSlcbiAgICAgICAgICB9IGVsc2UgaWYoYmFzZVtiYXNlVGFyZ2V0TmFtZV0pIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzLnB1c2goYmFzZVtiYXNlVGFyZ2V0TmFtZV0pXG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBiYXNlRXZlbnRDYWxsYmFjayA9IGJhc2VDYWxsYmFja3NbYmFzZUNhbGxiYWNrTmFtZV1cbiAgICAgICAgICBpZihcbiAgICAgICAgICAgIGJhc2VFdmVudENhbGxiYWNrICYmXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFjay5uYW1lLnNwbGl0KCcgJykubGVuZ3RoID09PSAxXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFjayA9IGJhc2VFdmVudENhbGxiYWNrLmJpbmQodGhpcylcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldHMubGVuZ3RoICYmXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFja1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZVRhcmdldHNcbiAgICAgICAgICAgICAgLmZvckVhY2goKGJhc2VUYXJnZXQpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgc3dpdGNoKG1ldGhvZCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdvbic6XG4gICAgICAgICAgICAgICAgICAgICAgYmFzZVRhcmdldFttZXRob2RdKGJhc2VFdmVudE5hbWUsIGJhc2VFdmVudENhbGxiYWNrKVxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ29mZic6XG4gICAgICAgICAgICAgICAgICAgICAgYmFzZVRhcmdldFttZXRob2RdKGJhc2VFdmVudE5hbWUsIGJhc2VFdmVudENhbGxiYWNrKVxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3JcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleCdcblxuY29uc3QgUm91dGVyID0gY2xhc3MgZXh0ZW5kcyBFdmVudHMge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuYWRkV2luZG93RXZlbnRzKClcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAncm9vdCcsXG4gICAgJ2hhc2hSb3V0aW5nJyxcbiAgICAnY29udHJvbGxlcicsXG4gICAgJ3JvdXRlcydcbiAgXSB9XG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICB9KVxuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgcHJvdG9jb2woKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgfVxuICBnZXQgaG9zdG5hbWUoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgfVxuICBnZXQgcG9ydCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wb3J0IH1cbiAgZ2V0IHBhdGhuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIH1cbiAgZ2V0IHBhdGgoKSB7XG4gICAgbGV0IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZVxuICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cChbJ14nLCB0aGlzLnJvb3RdLmpvaW4oJycpKSwgJycpXG4gICAgICAuc3BsaXQoJz8nKVxuICAgICAgLnNsaWNlKDAsIDEpXG4gICAgICBbMF1cbiAgICBsZXQgZnJhZ21lbnRzID0gKFxuICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMFxuICAgICkgPyBbXVxuICAgICAgOiAoXG4gICAgICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXlxcLy8pICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9cXC8/LylcbiAgICAgICAgKSA/IFsnLyddXG4gICAgICAgICAgOiBzdHJpbmdcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICByZXR1cm4ge1xuICAgICAgZnJhZ21lbnRzOiBmcmFnbWVudHMsXG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICB9XG4gIH1cbiAgZ2V0IGhhc2goKSB7XG4gICAgbGV0IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoXG4gICAgICAuc2xpY2UoMSlcbiAgICAgIC5zcGxpdCgnPycpXG4gICAgICAuc2xpY2UoMCwgMSlcbiAgICAgIFswXVxuICAgIGxldCBmcmFnbWVudHMgPSAoXG4gICAgICBzdHJpbmcubGVuZ3RoID09PSAwXG4gICAgKSA/IFtdXG4gICAgICA6IChcbiAgICAgICAgICBzdHJpbmcubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9eXFwvLykgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL1xcLz8vKVxuICAgICAgICApID8gWycvJ11cbiAgICAgICAgICA6IHN0cmluZ1xuICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAuc3BsaXQoJy8nKVxuICAgIHJldHVybiB7XG4gICAgICBmcmFnbWVudHM6IGZyYWdtZW50cyxcbiAgICAgIHN0cmluZzogc3RyaW5nLFxuICAgIH1cbiAgfVxuICBnZXQgcGFyYW1ldGVycygpIHtcbiAgICBsZXQgc3RyaW5nXG4gICAgbGV0IGRhdGFcbiAgICBpZih3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvXFw/LykpIHtcbiAgICAgIGxldCBwYXJhbWV0ZXJzID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICAgICAgLnNwbGl0KCc/JylcbiAgICAgICAgLnNsaWNlKC0xKVxuICAgICAgICAuam9pbignJylcbiAgICAgIHN0cmluZyA9IHBhcmFtZXRlcnNcbiAgICAgIGRhdGEgPSBwYXJhbWV0ZXJzXG4gICAgICAgIC5zcGxpdCgnJicpXG4gICAgICAgIC5yZWR1Y2UoKFxuICAgICAgICAgIF9wYXJhbWV0ZXJzLFxuICAgICAgICAgIHBhcmFtZXRlclxuICAgICAgICApID0+IHtcbiAgICAgICAgICBsZXQgcGFyYW1ldGVyRGF0YSA9IHBhcmFtZXRlci5zcGxpdCgnPScpXG4gICAgICAgICAgX3BhcmFtZXRlcnNbcGFyYW1ldGVyRGF0YVswXV0gPSBwYXJhbWV0ZXJEYXRhWzFdXG4gICAgICAgICAgcmV0dXJuIF9wYXJhbWV0ZXJzXG4gICAgICAgIH0sIHt9KVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHJpbmcgPSAnJ1xuICAgICAgZGF0YSA9IHt9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9XG4gIH1cbiAgZ2V0IHJvb3QoKSB7IHJldHVybiB0aGlzLl9yb290IHx8ICcvJyB9XG4gIHNldCByb290KHJvb3QpIHsgdGhpcy5fcm9vdCA9IHJvb3QgfVxuICBnZXQgaGFzaFJvdXRpbmcoKSB7IHJldHVybiB0aGlzLl9oYXNoUm91dGluZyB8fCBmYWxzZSB9XG4gIHNldCBoYXNoUm91dGluZyhoYXNoUm91dGluZykgeyB0aGlzLl9oYXNoUm91dGluZyA9IGhhc2hSb3V0aW5nIH1cbiAgZ2V0IHJvdXRlcygpIHsgcmV0dXJuIHRoaXMuX3JvdXRlcyB9XG4gIHNldCByb3V0ZXMocm91dGVzKSB7IHRoaXMuX3JvdXRlcyA9IHJvdXRlcyB9XG4gIGdldCBjb250cm9sbGVyKCkgeyByZXR1cm4gdGhpcy5fY29udHJvbGxlciB9XG4gIHNldCBjb250cm9sbGVyKGNvbnRyb2xsZXIpIHsgdGhpcy5fY29udHJvbGxlciA9IGNvbnRyb2xsZXIgfVxuICBnZXQgbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvb3Q6IHRoaXMucm9vdCxcbiAgICAgIHBhdGg6IHRoaXMucGF0aCxcbiAgICAgIGhhc2g6IHRoaXMuaGFzaCxcbiAgICAgIHBhcmFtZXRlcnM6IHRoaXMucGFyYW1ldGVycyxcbiAgICB9XG4gIH1cbiAgbWF0Y2hSb3V0ZShyb3V0ZUZyYWdtZW50cywgbG9jYXRpb25GcmFnbWVudHMpIHtcbiAgICBsZXQgcm91dGVNYXRjaGVzID0gbmV3IEFycmF5KClcbiAgICBpZihyb3V0ZUZyYWdtZW50cy5sZW5ndGggPT09IGxvY2F0aW9uRnJhZ21lbnRzLmxlbmd0aCkge1xuICAgICAgcm91dGVNYXRjaGVzID0gcm91dGVGcmFnbWVudHNcbiAgICAgICAgLnJlZHVjZSgoX3JvdXRlTWF0Y2hlcywgcm91dGVGcmFnbWVudCwgcm91dGVGcmFnbWVudEluZGV4KSA9PiB7XG4gICAgICAgICAgbGV0IGxvY2F0aW9uRnJhZ21lbnQgPSBsb2NhdGlvbkZyYWdtZW50c1tyb3V0ZUZyYWdtZW50SW5kZXhdXG4gICAgICAgICAgaWYocm91dGVGcmFnbWVudC5tYXRjaCgvXlxcOi8pKSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2godHJ1ZSlcbiAgICAgICAgICB9IGVsc2UgaWYocm91dGVGcmFnbWVudCA9PT0gbG9jYXRpb25GcmFnbWVudCkge1xuICAgICAgICAgICAgX3JvdXRlTWF0Y2hlcy5wdXNoKHRydWUpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaChmYWxzZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yb3V0ZU1hdGNoZXNcbiAgICAgICAgfSwgW10pXG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRlTWF0Y2hlcy5wdXNoKGZhbHNlKVxuICAgIH1cbiAgICByZXR1cm4gKHJvdXRlTWF0Y2hlcy5pbmRleE9mKGZhbHNlKSA9PT0gLTEpXG4gICAgICA/IHRydWVcbiAgICAgIDogZmFsc2VcbiAgfVxuICBnZXRSb3V0ZShsb2NhdGlvbikge1xuICAgIGxldCByb3V0ZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnJvdXRlcylcbiAgICAgIC5yZWR1Y2UoKFxuICAgICAgICBfcm91dGVzLFxuICAgICAgICBbcm91dGVOYW1lLCByb3V0ZVNldHRpbmdzXSkgPT4ge1xuICAgICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IChcbiAgICAgICAgICAgIHJvdXRlTmFtZS5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICAgIHJvdXRlTmFtZS5tYXRjaCgvXlxcLy8pXG4gICAgICAgICAgKSA/IFtyb3V0ZU5hbWVdXG4gICAgICAgICAgICA6IChyb3V0ZU5hbWUubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICA/IFsnJ11cbiAgICAgICAgICAgICAgOiByb3V0ZU5hbWVcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICAgICAgICByb3V0ZVNldHRpbmdzLmZyYWdtZW50cyA9IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgICAgX3JvdXRlc1tyb3V0ZUZyYWdtZW50cy5qb2luKCcvJyldID0gcm91dGVTZXR0aW5nc1xuICAgICAgICAgIHJldHVybiBfcm91dGVzXG4gICAgICAgIH0sXG4gICAgICAgIHt9XG4gICAgICApXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMocm91dGVzKVxuICAgICAgLmZpbmQoKHJvdXRlKSA9PiB7XG4gICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IHJvdXRlLmZyYWdtZW50c1xuICAgICAgICBsZXQgbG9jYXRpb25GcmFnbWVudHMgPSAodGhpcy5oYXNoUm91dGluZylcbiAgICAgICAgICA/IGxvY2F0aW9uLmhhc2guZnJhZ21lbnRzXG4gICAgICAgICAgOiBsb2NhdGlvbi5wYXRoLmZyYWdtZW50c1xuICAgICAgICBsZXQgbWF0Y2hSb3V0ZSA9IHRoaXMubWF0Y2hSb3V0ZShcbiAgICAgICAgICByb3V0ZUZyYWdtZW50cyxcbiAgICAgICAgICBsb2NhdGlvbkZyYWdtZW50cyxcbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gbWF0Y2hSb3V0ZSA9PT0gdHJ1ZVxuICAgICAgfSlcbiAgfVxuICBwb3BTdGF0ZShldmVudCkge1xuICAgIGxldCBsb2NhdGlvbiA9IHRoaXMubG9jYXRpb25cbiAgICBsZXQgcm91dGUgPSB0aGlzLmdldFJvdXRlKGxvY2F0aW9uKVxuICAgIGxldCByb3V0ZURhdGEgPSB7XG4gICAgICByb3V0ZTogcm91dGUsXG4gICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgfVxuICAgIGlmKHJvdXRlKSB7XG4gICAgICB0aGlzLmNvbnRyb2xsZXJbcm91dGUuY2FsbGJhY2tdKHJvdXRlRGF0YSlcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgJ2NoYW5nZScsIFxuICAgICAgICByb3V0ZURhdGEsXG4gICAgICAgIHRoaXNcbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAnZXJyb3InLFxuICAgICAgICByb3V0ZURhdGEsXG4gICAgICAgIHRoaXNcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgYWRkV2luZG93RXZlbnRzKCkge1xuICAgIHdpbmRvdy5vbigncG9wc3RhdGUnLCB0aGlzLnBvcFN0YXRlLmJpbmQodGhpcykpXG4gIH1cbiAgcmVtb3ZlV2luZG93RXZlbnRzKCkge1xuICAgIHdpbmRvdy5vZmYoJ3BvcHN0YXRlJywgdGhpcy5wb3BTdGF0ZS5iaW5kKHRoaXMpKVxuICB9XG4gIG5hdmlnYXRlKHBhdGgpIHtcbiAgICBpZih0aGlzLmhhc2hSb3V0aW5nKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHBhdGhcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoXG4gICAgfVxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBSb3V0ZXJcbiJdLCJuYW1lcyI6WyJFdmVudFRhcmdldCIsInByb3RvdHlwZSIsIm9uIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9mZiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJFdmVudHMiLCJjb25zdHJ1Y3RvciIsIl9ldmVudHMiLCJldmVudHMiLCJnZXRFdmVudENhbGxiYWNrcyIsImV2ZW50TmFtZSIsImdldEV2ZW50Q2FsbGJhY2tOYW1lIiwiZXZlbnRDYWxsYmFjayIsIm5hbWUiLCJsZW5ndGgiLCJnZXRFdmVudENhbGxiYWNrR3JvdXAiLCJldmVudENhbGxiYWNrcyIsImV2ZW50Q2FsbGJhY2tOYW1lIiwiZXZlbnRDYWxsYmFja0dyb3VwIiwicHVzaCIsImFyZ3VtZW50cyIsIk9iamVjdCIsImtleXMiLCJlbWl0IiwiX2FyZ3VtZW50cyIsIkFycmF5IiwiZnJvbSIsInNwbGljZSIsImV2ZW50RGF0YSIsImV2ZW50QXJndW1lbnRzIiwiZW50cmllcyIsImZvckVhY2giLCJldmVudENhbGxiYWNrR3JvdXBOYW1lIiwiZGF0YSIsIl9yZXNwb25zZXMiLCJyZXNwb25zZXMiLCJyZXNwb25zZSIsInJlc3BvbnNlTmFtZSIsInJlc3BvbnNlQ2FsbGJhY2siLCJyZXF1ZXN0Iiwic2xpY2UiLCJjYWxsIiwiX3Jlc3BvbnNlTmFtZSIsIl9jaGFubmVscyIsImNoYW5uZWxzIiwiY2hhbm5lbCIsImNoYW5uZWxOYW1lIiwiQ2hhbm5lbCIsIlVVSUQiLCJ1dWlkIiwiaSIsInJhbmRvbSIsIk1hdGgiLCJ0b1N0cmluZyIsIlNlcnZpY2UiLCJzZXR0aW5ncyIsIm9wdGlvbnMiLCJ2YWxpZFNldHRpbmdzIiwiX3NldHRpbmdzIiwidmFsaWRTZXR0aW5nIiwiX29wdGlvbnMiLCJ1cmwiLCJwYXJhbWV0ZXJzIiwiX3VybCIsImNvbmNhdCIsInF1ZXJ5U3RyaW5nIiwicGFyYW1ldGVyU3RyaW5nIiwicmVkdWNlIiwicGFyYW1ldGVyU3RyaW5ncyIsInBhcmFtZXRlcktleSIsInBhcmFtZXRlclZhbHVlIiwiam9pbiIsIm1ldGhvZCIsIl9tZXRob2QiLCJtb2RlIiwiX21vZGUiLCJjYWNoZSIsIl9jYWNoZSIsImNyZWRlbnRpYWxzIiwiX2NyZWRlbnRpYWxzIiwiaGVhZGVycyIsIl9oZWFkZXJzIiwicmVkaXJlY3QiLCJfcmVkaXJlY3QiLCJyZWZlcnJlclBvbGljeSIsIl9yZWZlcnJlclBvbGljeSIsImJvZHkiLCJfYm9keSIsImZpbGVzIiwiX2ZpbGVzIiwiX3BhcmFtZXRlcnMiLCJwcmV2aW91c0Fib3J0Q29udHJvbGxlciIsIl9wcmV2aW91c0Fib3J0Q29udHJvbGxlciIsImFib3J0Q29udHJvbGxlciIsIl9hYm9ydENvbnRyb2xsZXIiLCJBYm9ydENvbnRyb2xsZXIiLCJfcmVzcG9uc2UiLCJyZXNwb25zZURhdGEiLCJfcmVzcG9uc2VEYXRhIiwiYWJvcnQiLCJmZXRjaCIsImZldGNoT3B0aW9ucyIsIl9mZXRjaE9wdGlvbnMiLCJmZXRjaE9wdGlvbk5hbWUiLCJzaWduYWwiLCJ0aGVuIiwianNvbiIsImNvZGUiLCJjYXRjaCIsImVycm9yIiwiZmV0Y2hTeW5jIiwiTW9kZWwiLCJfdXVpZCIsImJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXMiLCJiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUiLCJ0b2dnbGVFdmVudHMiLCJzZXJ2aWNlcyIsIl9zZXJ2aWNlcyIsIl9kYXRhIiwiZGVmYXVsdHMiLCJfZGVmYXVsdHMiLCJsb2NhbFN0b3JhZ2UiLCJzeW5jIiwiZGIiLCJzZXQiLCJfbG9jYWxTdG9yYWdlIiwic3RvcmFnZUNvbnRhaW5lciIsIl9kYiIsImdldEl0ZW0iLCJlbmRwb2ludCIsIkpTT04iLCJzdHJpbmdpZnkiLCJwYXJzZSIsInNldEl0ZW0iLCJyZXNldEV2ZW50cyIsImNsYXNzVHlwZSIsImJhc2VOYW1lIiwiYmFzZUV2ZW50c05hbWUiLCJiYXNlQ2FsbGJhY2tzTmFtZSIsImJhc2UiLCJiYXNlRXZlbnRzIiwiYmFzZUNhbGxiYWNrcyIsImJhc2VFdmVudERhdGEiLCJiYXNlQ2FsbGJhY2tOYW1lIiwiYmFzZVRhcmdldE5hbWUiLCJiYXNlRXZlbnROYW1lIiwic3BsaXQiLCJiYXNlVGFyZ2V0IiwiYmFzZUNhbGxiYWNrIiwiYmluZCIsInNldERCIiwia2V5IiwidmFsdWUiLCJ1bnNldERCIiwic2V0RGF0YVByb3BlcnR5Iiwic2lsZW50IiwiY3VycmVudERhdGFQcm9wZXJ0eSIsImdldCIsImRlZmluZVByb3BlcnRpZXMiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImVudW1lcmFibGUiLCJldmVudCIsIm1vZGVsIiwidW5zZXREYXRhUHJvcGVydHkiLCJhc3NpZ24iLCJpc0FycmF5IiwidW5zZXQiLCJDb2xsZWN0aW9uIiwiZGVmYXVsdElEQXR0cmlidXRlIiwiYWRkIiwiVXRpbGl0aWVzIiwibW9kZWxzIiwiX21vZGVscyIsIm1vZGVsc0RhdGEiLCJfbW9kZWwiLCJtb2RlbHNFeGlzdCIsIm1hcCIsImdldE1vZGVsSW5kZXgiLCJtb2RlbFVVSUQiLCJtb2RlbEluZGV4IiwiZmluZCIsIl9tb2RlbEluZGV4IiwicmVtb3ZlTW9kZWxCeUluZGV4IiwiYWRkTW9kZWwiLCJtb2RlbERhdGEiLCJNb2RlbFByb3RvdHlwZSIsIm1vZGVsT3B0aW9ucyIsInJlbW92ZSIsImZpbHRlciIsInJlc2V0IiwiVmlldyIsImVsZW1lbnROYW1lIiwiX2VsZW1lbnROYW1lIiwiZWxlbWVudCIsIl9lbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZUtleSIsImF0dHJpYnV0ZVZhbHVlIiwic2V0QXR0cmlidXRlIiwiZWxlbWVudE9ic2VydmVyIiwib2JzZXJ2ZSIsInN1YnRyZWUiLCJjaGlsZExpc3QiLCJfZWxlbWVudE9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsImVsZW1lbnRPYnNlcnZlIiwiSFRNTEVsZW1lbnQiLCJfYXR0cmlidXRlcyIsInRlbXBsYXRlIiwiX3RlbXBsYXRlIiwidWlFbGVtZW50cyIsIl91aUVsZW1lbnRzIiwidWlFbGVtZW50RXZlbnRzIiwiX3VpRWxlbWVudEV2ZW50cyIsInVpRWxlbWVudENhbGxiYWNrcyIsIl91aUVsZW1lbnRDYWxsYmFja3MiLCJ2YWx1ZXMiLCJ1aUVsZW1lbnRDYWxsYmFjayIsInVpIiwiY29udGV4dCIsIl91aSIsInVpRWxlbWVudE5hbWUiLCJ1aUVsZW1lbnRRdWVyeSIsInF1ZXJ5UmVzdWx0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpdGVtIiwiRG9jdW1lbnQiLCJXaW5kb3ciLCJyZXNldFVJIiwibXV0YXRpb25SZWNvcmRMaXN0Iiwib2JzZXJ2ZXIiLCJtdXRhdGlvblJlY29yZEluZGV4IiwibXV0YXRpb25SZWNvcmQiLCJ0eXBlIiwiYWRkZWROb2RlcyIsImJpbmRFdmVudFRvRWxlbWVudCIsInRhcmdldFVJRWxlbWVudE5hbWUiLCJpc1RvZ2dsaW5nIiwiZXZlbnRCaW5kTWV0aG9kcyIsImV2ZW50QmluZE1ldGhvZCIsInVpRWxlbWVudEV2ZW50U2V0dGluZ3MiLCJ1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSIsInVpRWxlbWVudEV2ZW50TmFtZSIsIk5vZGVMaXN0IiwidWlFbGVtZW50IiwiYXV0b0luc2VydCIsImluc2VydCIsInBhcmVudCIsInF1ZXJ5U2VsZWN0b3IiLCJpbnNlcnRBZGphY2VudEVsZW1lbnQiLCJhdXRvUmVtb3ZlIiwicGFyZW50RWxlbWVudCIsInJlbW92ZUNoaWxkIiwicmVuZGVyIiwiaW5uZXJIVE1MIiwiQ29udHJvbGxlciIsImVudW1iZXJhYmxlIiwiYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdGaXJzdCIsInN1YnN0cmluZyIsImJhc2VUYXJnZXROYW1lU3Vic3RyaW5nTGFzdCIsImJhc2VUYXJnZXRzIiwiX2Jhc2VUYXJnZXRzIiwiYmFzZVRhcmdldE5hbWVSZWdFeHBTdHJpbmciLCJiYXNlVGFyZ2V0TmFtZVJlZ0V4cCIsIlJlZ0V4cCIsIm1hdGNoIiwiYmFzZUV2ZW50Q2FsbGJhY2siLCJSb3V0ZXIiLCJhZGRXaW5kb3dFdmVudHMiLCJwcm90b2NvbCIsIndpbmRvdyIsImxvY2F0aW9uIiwiaG9zdG5hbWUiLCJwb3J0IiwicGF0aG5hbWUiLCJwYXRoIiwic3RyaW5nIiwicmVwbGFjZSIsInJvb3QiLCJmcmFnbWVudHMiLCJoYXNoIiwiaHJlZiIsInBhcmFtZXRlciIsInBhcmFtZXRlckRhdGEiLCJfcm9vdCIsImhhc2hSb3V0aW5nIiwiX2hhc2hSb3V0aW5nIiwicm91dGVzIiwiX3JvdXRlcyIsImNvbnRyb2xsZXIiLCJfY29udHJvbGxlciIsIm1hdGNoUm91dGUiLCJyb3V0ZUZyYWdtZW50cyIsImxvY2F0aW9uRnJhZ21lbnRzIiwicm91dGVNYXRjaGVzIiwiX3JvdXRlTWF0Y2hlcyIsInJvdXRlRnJhZ21lbnQiLCJyb3V0ZUZyYWdtZW50SW5kZXgiLCJsb2NhdGlvbkZyYWdtZW50IiwiaW5kZXhPZiIsImdldFJvdXRlIiwicm91dGVOYW1lIiwicm91dGVTZXR0aW5ncyIsInJvdXRlIiwicG9wU3RhdGUiLCJyb3V0ZURhdGEiLCJjYWxsYmFjayIsInJlbW92ZVdpbmRvd0V2ZW50cyIsIm5hdmlnYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7RUFBQUEsV0FBVyxDQUFDQyxTQUFaLENBQXNCQyxFQUF0QixHQUEyQkYsV0FBVyxDQUFDQyxTQUFaLENBQXNCQyxFQUF0QixJQUE0QkYsV0FBVyxDQUFDQyxTQUFaLENBQXNCRSxnQkFBN0U7RUFDQUgsV0FBVyxDQUFDQyxTQUFaLENBQXNCRyxHQUF0QixHQUE0QkosV0FBVyxDQUFDQyxTQUFaLENBQXNCRyxHQUF0QixJQUE2QkosV0FBVyxDQUFDQyxTQUFaLENBQXNCSSxtQkFBL0U7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUNEQSxNQUFNQyxNQUFOLENBQWE7RUFDWEMsRUFBQUEsV0FBVyxHQUFHOztFQUNkLE1BQUlDLE9BQUosR0FBYztFQUNaLFNBQUtDLE1BQUwsR0FBYyxLQUFLQSxNQUFMLElBQWUsRUFBN0I7RUFDQSxXQUFPLEtBQUtBLE1BQVo7RUFDRDs7RUFDREMsRUFBQUEsaUJBQWlCLENBQUNDLFNBQUQsRUFBWTtFQUFFLFdBQU8sS0FBS0gsT0FBTCxDQUFhRyxTQUFiLEtBQTJCLEVBQWxDO0VBQXNDOztFQUNyRUMsRUFBQUEsb0JBQW9CLENBQUNDLGFBQUQsRUFBZ0I7RUFDbEMsV0FBUUEsYUFBYSxDQUFDQyxJQUFkLENBQW1CQyxNQUFwQixHQUNIRixhQUFhLENBQUNDLElBRFgsR0FFSCxtQkFGSjtFQUdEOztFQUNERSxFQUFBQSxxQkFBcUIsQ0FBQ0MsY0FBRCxFQUFpQkMsaUJBQWpCLEVBQW9DO0VBQ3ZELFdBQU9ELGNBQWMsQ0FBQ0MsaUJBQUQsQ0FBZCxJQUFxQyxFQUE1QztFQUNEOztFQUNEaEIsRUFBQUEsRUFBRSxDQUFDUyxTQUFELEVBQVlFLGFBQVosRUFBMkI7RUFDM0IsUUFBSUksY0FBYyxHQUFHLEtBQUtQLGlCQUFMLENBQXVCQyxTQUF2QixD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
