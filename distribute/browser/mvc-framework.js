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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxpdGllcy91dWlkLmpzIiwiLi4vLi4vc291cmNlL01WQy9TZXJ2aWNlL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Nb2RlbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29sbGVjdGlvbi9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVmlldy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29udHJvbGxlci9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvUm91dGVyL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIkV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiA9IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lclxyXG5FdmVudFRhcmdldC5wcm90b3R5cGUub2ZmID0gRXZlbnRUYXJnZXQucHJvdG90eXBlLm9mZiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lclxyXG4iLCJjbGFzcyBFdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2V2ZW50cygpIHtcclxuICAgIHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMgfHwge31cclxuICAgIHJldHVybiB0aGlzLmV2ZW50c1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpIHsgcmV0dXJuIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdIHx8IHt9IH1cclxuICBnZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gKGV2ZW50Q2FsbGJhY2submFtZS5sZW5ndGgpXHJcbiAgICAgID8gZXZlbnRDYWxsYmFjay5uYW1lXHJcbiAgICAgIDogJ2Fub255bW91c0Z1bmN0aW9uJ1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKSB7XHJcbiAgICByZXR1cm4gZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdIHx8IFtdXHJcbiAgfVxyXG4gIG9uKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaykge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5nZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja05hbWUgPSB0aGlzLmdldEV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja0dyb3VwID0gdGhpcy5nZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKVxyXG4gICAgZXZlbnRDYWxsYmFja0dyb3VwLnB1c2goZXZlbnRDYWxsYmFjaylcclxuICAgIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudENhbGxiYWNrc1xyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgb2ZmKCkge1xyXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgICAgY2FzZSAwOlxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrTmFtZSA9ICh0eXBlb2YgZXZlbnRDYWxsYmFjayA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICA/IGV2ZW50Q2FsbGJhY2tcclxuICAgICAgICAgIDogdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKSB7XHJcbiAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1bZXZlbnRDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0pLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgKSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGVtaXQoKSB7XHJcbiAgICBsZXQgX2FyZ3VtZW50cyA9IEFycmF5LmZyb20oYXJndW1lbnRzKVxyXG4gICAgbGV0IGV2ZW50TmFtZSA9IF9hcmd1bWVudHMuc3BsaWNlKDAsIDEpWzBdXHJcbiAgICBsZXQgZXZlbnREYXRhID0gX2FyZ3VtZW50cy5zcGxpY2UoMCwgMSlbMF1cclxuICAgIGxldCBldmVudEFyZ3VtZW50cyA9IF9hcmd1bWVudHMuc3BsaWNlKDApXHJcbiAgICBPYmplY3QuZW50cmllcyh0aGlzLmdldEV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSkpXHJcbiAgICAgIC5mb3JFYWNoKChbZXZlbnRDYWxsYmFja0dyb3VwTmFtZSwgZXZlbnRDYWxsYmFja0dyb3VwXSkgPT4ge1xyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgICAgICAgLmZvckVhY2goKGV2ZW50Q2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgZXZlbnRDYWxsYmFjayhcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBldmVudE5hbWUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBldmVudERhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIC4uLmV2ZW50QXJndW1lbnRzXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBFdmVudHNcclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX3Jlc3BvbnNlcygpIHtcclxuICAgIHRoaXMucmVzcG9uc2VzID0gdGhpcy5yZXNwb25zZXNcclxuICAgICAgPyB0aGlzLnJlc3BvbnNlc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZiAocmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgICB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSA9IHJlc3BvbnNlQ2FsbGJhY2tcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VdXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlcXVlc3QocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZiAodGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0pIHtcclxuICAgICAgdmFyIF9hcmd1bWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLnNsaWNlKDEpXHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSguLi5fYXJndW1lbnRzKVxyXG4gICAgfVxyXG4gIH1cclxuICBvZmYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZiAocmVzcG9uc2VOYW1lKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yICh2YXIgW19yZXNwb25zZU5hbWVdIG9mIE9iamVjdC5rZXlzKHRoaXMuX3Jlc3BvbnNlcykpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW19yZXNwb25zZU5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IENoYW5uZWwgZnJvbSAnLi9DaGFubmVsL2luZGV4J1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfY2hhbm5lbHMoKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzID0gdGhpcy5jaGFubmVsc1xyXG4gICAgICA/IHRoaXMuY2hhbm5lbHNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbHNcclxuICB9XHJcbiAgY2hhbm5lbChjaGFubmVsTmFtZSkge1xyXG4gICAgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdID0gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgID8gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgIDogbmV3IENoYW5uZWwoKVxyXG4gICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxuICBvZmYoY2hhbm5lbE5hbWUpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVVVJRCgpIHtcclxuICB2YXIgdXVpZCA9IFwiXCIsIGksIHJhbmRvbVxyXG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSB7XHJcbiAgICByYW5kb20gPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwXHJcblxyXG4gICAgaWYgKGkgPT0gOCB8fCBpID09IDEyIHx8IGkgPT0gMTYgfHwgaSA9PSAyMCkge1xyXG4gICAgICB1dWlkICs9IFwiLVwiXHJcbiAgICB9XHJcbiAgICB1dWlkICs9IChpID09IDEyID8gNCA6IChpID09IDE2ID8gKHJhbmRvbSAmIDMgfCA4KSA6IHJhbmRvbSkpLnRvU3RyaW5nKDE2KVxyXG4gIH1cclxuICByZXR1cm4gdXVpZFxyXG59XHJcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4J1xuXG5jbGFzcyBTZXJ2aWNlIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAndXJsJyxcbiAgICAnbWV0aG9kJyxcbiAgICAnbW9kZScsXG4gICAgJ2NhY2hlJyxcbiAgICAnY3JlZGVudGlhbHMnLFxuICAgICdoZWFkZXJzJyxcbiAgICAncGFyYW1ldGVycycsXG4gICAgJ3JlZGlyZWN0JyxcbiAgICAncmVmZXJyZXItcG9saWN5JyxcbiAgICAnYm9keScsXG4gICAgJ2ZpbGVzJ1xuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCB1cmwoKSB7XG4gICAgaWYodGhpcy5wYXJhbWV0ZXJzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsLmNvbmNhdCh0aGlzLnF1ZXJ5U3RyaW5nKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsXG4gICAgfVxuICB9XG4gIHNldCB1cmwodXJsKSB7IHRoaXMuX3VybCA9IHVybCB9XG4gIGdldCBxdWVyeVN0cmluZygpIHtcbiAgICBsZXQgcXVlcnlTdHJpbmcgPSAnJ1xuICAgIGlmKHRoaXMucGFyYW1ldGVycykge1xuICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IE9iamVjdC5lbnRyaWVzKHRoaXMucGFyYW1ldGVycylcbiAgICAgICAgLnJlZHVjZSgocGFyYW1ldGVyU3RyaW5ncywgW3BhcmFtZXRlcktleSwgcGFyYW1ldGVyVmFsdWVdKSA9PiB7XG4gICAgICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IHBhcmFtZXRlcktleS5jb25jYXQoJz0nLCBwYXJhbWV0ZXJWYWx1ZSlcbiAgICAgICAgICBwYXJhbWV0ZXJTdHJpbmdzLnB1c2gocGFyYW1ldGVyU3RyaW5nKVxuICAgICAgICAgIHJldHVybiBwYXJhbWV0ZXJTdHJpbmdzXG4gICAgICAgIH0sIFtdKVxuICAgICAgICAgIC5qb2luKCcmJylcbiAgICAgIHF1ZXJ5U3RyaW5nID0gJz8nLmNvbmNhdChwYXJhbWV0ZXJTdHJpbmcpXG4gICAgfVxuICAgIHJldHVybiBxdWVyeVN0cmluZ1xuICB9XG4gIGdldCBtZXRob2QoKSB7IHJldHVybiB0aGlzLl9tZXRob2QgfVxuICBzZXQgbWV0aG9kKG1ldGhvZCkgeyB0aGlzLl9tZXRob2QgPSBtZXRob2QgfVxuICBnZXQgbW9kZSgpIHsgcmV0dXJuIHRoaXMuX21vZGUgfVxuICBzZXQgbW9kZShtb2RlKSB7IHRoaXMuX21vZGUgPSBtb2RlIH1cbiAgZ2V0IGNhY2hlKCkgeyByZXR1cm4gdGhpcy5fY2FjaGUgfVxuICBzZXQgY2FjaGUoY2FjaGUpIHsgdGhpcy5fY2FjaGUgPSBjYWNoZSB9XG4gIGdldCBjcmVkZW50aWFscygpIHsgcmV0dXJuIHRoaXMuX2NyZWRlbnRpYWxzIH1cbiAgc2V0IGNyZWRlbnRpYWxzKGNyZWRlbnRpYWxzKSB7IHRoaXMuX2NyZWRlbnRpYWxzID0gY3JlZGVudGlhbHMgfVxuICBnZXQgaGVhZGVycygpIHsgcmV0dXJuIHRoaXMuX2hlYWRlcnMgfVxuICBzZXQgaGVhZGVycyhoZWFkZXJzKSB7IHRoaXMuX2hlYWRlcnMgPSBoZWFkZXJzIH1cbiAgZ2V0IHJlZGlyZWN0KCkgeyByZXR1cm4gdGhpcy5fcmVkaXJlY3QgfVxuICBzZXQgcmVkaXJlY3QocmVkaXJlY3QpIHsgdGhpcy5fcmVkaXJlY3QgPSByZWRpcmVjdCB9XG4gIGdldCByZWZlcnJlclBvbGljeSgpIHsgcmV0dXJuIHRoaXMuX3JlZmVycmVyUG9saWN5IH1cbiAgc2V0IHJlZmVycmVyUG9saWN5KHJlZmVycmVyUG9saWN5KSB7IHRoaXMuX3JlZmVycmVyUG9saWN5ID0gcmVmZXJyZXJQb2xpY3kgfVxuICBnZXQgYm9keSgpIHsgcmV0dXJuIHRoaXMuX2JvZHkgfVxuICBzZXQgYm9keShib2R5KSB7IHRoaXMuX2JvZHkgPSBib2R5IH1cbiAgZ2V0IGZpbGVzKCkgeyByZXR1cm4gdGhpcy5fZmlsZXMgfVxuICBzZXQgZmlsZXMoZmlsZXMpIHsgdGhpcy5fZmlsZXMgPSBmaWxlcyB9XG4gIGdldCBwYXJhbWV0ZXJzKCkgeyByZXR1cm4gdGhpcy5fcGFyYW1ldGVycyB8fCBudWxsIH1cbiAgc2V0IHBhcmFtZXRlcnMocGFyYW1ldGVycykgeyB0aGlzLl9wYXJhbWV0ZXJzID0gcGFyYW1ldGVycyB9XG4gIGdldCBwcmV2aW91c0Fib3J0Q29udHJvbGxlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fcHJldmlvdXNBYm9ydENvbnRyb2xsZXJcbiAgfVxuICBzZXQgcHJldmlvdXNBYm9ydENvbnRyb2xsZXIocHJldmlvdXNBYm9ydENvbnRyb2xsZXIpIHsgdGhpcy5fcHJldmlvdXNBYm9ydENvbnRyb2xsZXIgPSBwcmV2aW91c0Fib3J0Q29udHJvbGxlciB9XG4gIGdldCBhYm9ydENvbnRyb2xsZXIoKSB7XG4gICAgaWYoIXRoaXMuX2Fib3J0Q29udHJvbGxlcikge1xuICAgICAgdGhpcy5wcmV2aW91c0Fib3J0Q29udHJvbGxlciA9IHRoaXMuX2Fib3J0Q29udHJvbGxlclxuICAgIH1cbiAgICB0aGlzLl9hYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKClcbiAgICByZXR1cm4gdGhpcy5fYWJvcnRDb250cm9sbGVyXG4gIH1cbiAgZ2V0IHJlc3BvbnNlKCkgeyByZXR1cm4gdGhpcy5fcmVzcG9uc2UgfVxuICBzZXQgcmVzcG9uc2UocmVzcG9uc2UpIHsgdGhpcy5fcmVzcG9uc2UgPSByZXNwb25zZSB9XG4gIGdldCByZXNwb25zZURhdGEoKSB7IHJldHVybiB0aGlzLl9yZXNwb25zZURhdGEgfVxuICBzZXQgcmVzcG9uc2VEYXRhKHJlc3BvbnNlRGF0YSkgeyB0aGlzLl9yZXNwb25zZURhdGEgPSByZXNwb25zZURhdGEgfVxuICBhYm9ydCgpIHtcbiAgICB0aGlzLmFib3J0Q29udHJvbGxlci5hYm9ydCgpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBmZXRjaCgpIHtcbiAgICBjb25zdCBmZXRjaE9wdGlvbnMgPSB0aGlzLnZhbGlkU2V0dGluZ3MucmVkdWNlKChfZmV0Y2hPcHRpb25zLCBmZXRjaE9wdGlvbk5hbWUpID0+IHtcbiAgICAgIGlmKHRoaXNbZmV0Y2hPcHRpb25OYW1lXSkgX2ZldGNoT3B0aW9uc1tmZXRjaE9wdGlvbk5hbWVdID0gdGhpc1tmZXRjaE9wdGlvbk5hbWVdXG4gICAgICByZXR1cm4gX2ZldGNoT3B0aW9uc1xuICAgIH0sIHt9KVxuICAgIGZldGNoT3B0aW9ucy5zaWduYWwgPSB0aGlzLmFib3J0Q29udHJvbGxlci5zaWduYWxcbiAgICBpZih0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyKSB0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyLmFib3J0KClcbiAgICByZXR1cm4gZmV0Y2godGhpcy51cmwsIGZldGNoT3B0aW9ucylcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICB0aGlzLnJlc3BvbnNlID0gcmVzcG9uc2VcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKVxuICAgICAgfSlcbiAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIGlmKFxuICAgICAgICAgIGRhdGEuY29kZSA+PSA0MDAgJiZcbiAgICAgICAgICBkYXRhLmNvZGUgPD0gNDk5XG4gICAgICAgICkge1xuICAgICAgICAgIHRocm93IGRhdGFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmVtaXQoXG4gICAgICAgICAgICAncmVhZHknLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgKVxuICAgICAgICAgIHJldHVybiBkYXRhXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgICAnZXJyb3InLFxuICAgICAgICAgIGVycm9yLFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuIGVycm9yXG4gICAgICB9KVxuICB9XG4gIGFzeW5jIGZldGNoU3luYygpIHtcbiAgICBjb25zdCBmZXRjaE9wdGlvbnMgPSB0aGlzLnZhbGlkU2V0dGluZ3MucmVkdWNlKChfZmV0Y2hPcHRpb25zLCBmZXRjaE9wdGlvbk5hbWUpID0+IHtcbiAgICAgIGlmKHRoaXNbZmV0Y2hPcHRpb25OYW1lXSkgX2ZldGNoT3B0aW9uc1tmZXRjaE9wdGlvbk5hbWVdID0gdGhpc1tmZXRjaE9wdGlvbk5hbWVdXG4gICAgICByZXR1cm4gX2ZldGNoT3B0aW9uc1xuICAgIH0sIHt9KVxuICAgIGZldGNoT3B0aW9ucy5zaWduYWwgPSB0aGlzLmFib3J0Q29udHJvbGxlci5zaWduYWxcbiAgICBpZih0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyKSB0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyLmFib3J0KClcbiAgICB0aGlzLnJlc3BvbnNlID0gIGF3YWl0IGZldGNoKHRoaXMudXJsLCBmZXRjaE9wdGlvbnMpXG4gICAgdGhpcy5yZXNwb25zZURhdGEgPSBhd2FpdCB0aGlzLnJlc3BvbnNlLmpzb24oKVxuICAgIGlmKFxuICAgICAgdGhpcy5yZXNwb25zZURhdGEuY29kZSA+PSA0MDAgJiZcbiAgICAgIHRoaXMucmVzcG9uc2VEYXRhLmNvZGUgPD0gNDk5XG4gICAgKSB7XG4gICAgICB0aGlzLmVtaXQoXG4gICAgICAgICdlcnJvcicsXG4gICAgICAgIHRoaXMucmVzcG9uc2VEYXRhLFxuICAgICAgICB0aGlzLFxuICAgICAgKVxuICAgICAgdGhyb3cgdGhpcy5yZXNwb25zZURhdGFcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAncmVhZHknLFxuICAgICAgICB0aGlzLnJlc3BvbnNlRGF0YSxcbiAgICAgICAgdGhpcyxcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucmVzcG9uc2VEYXRhXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFNlcnZpY2VcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4uL1V0aWxpdGllcy9pbmRleCdcblxuY29uc3QgTW9kZWwgPSBjbGFzcyBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy5lbWl0KFxuICAgICAgJ3JlYWR5JyxcbiAgICAgIHt9LFxuICAgICAgdGhpcyxcbiAgICApXG4gIH1cbiAgZ2V0IHV1aWQoKSB7XG4gICAgaWYoIXRoaXMuX3V1aWQpIHRoaXMuX3V1aWQgPSBVVUlEKClcbiAgICByZXR1cm4gdGhpcy5fdXVpZFxuICB9XG4gIGdldCB2YWxpZFNldHRpbmdzKCkgeyByZXR1cm4gW1xuICAgICdsb2NhbFN0b3JhZ2UnLFxuICAgICdkZWZhdWx0cycsXG4gICAgJ3NlcnZpY2VzJyxcbiAgICAnc2VydmljZUV2ZW50cycsXG4gICAgJ3NlcnZpY2VDYWxsYmFja3MnLFxuICBdIH1cbiAgZ2V0IGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXMoKSB7IHJldHVybiBbXG4gICAgJ3NlcnZpY2UnLFxuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gICAgdGhpcy5iaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzXG4gICAgICAuZm9yRWFjaCgoYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlKSA9PiB7XG4gICAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSwgJ29uJylcbiAgICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCBzZXJ2aWNlcygpIHtcbiAgICBpZighdGhpcy5fc2VydmljZXMpIHRoaXMuX3NlcnZpY2VzID0ge31cbiAgICByZXR1cm4gdGhpcy5fc2VydmljZXNcbiAgfVxuICBzZXQgc2VydmljZXMoc2VydmljZXMpIHsgdGhpcy5fc2VydmljZXMgPSBzZXJ2aWNlcyB9XG4gIGdldCBkYXRhKCkge1xuICAgIGlmKCF0aGlzLl9kYXRhKSB0aGlzLl9kYXRhID0ge31cbiAgICByZXR1cm4gdGhpcy5fZGF0YVxuICB9XG4gIGdldCBkZWZhdWx0cygpIHtcbiAgICBpZighdGhpcy5fZGVmYXVsdHMpIHRoaXMuX2RlZmF1bHRzID0ge31cbiAgICByZXR1cm4gdGhpcy5fZGVmYXVsdHNcbiAgfVxuICBzZXQgZGVmYXVsdHMoZGVmYXVsdHMpIHtcbiAgICBpZih0aGlzLmxvY2FsU3RvcmFnZS5zeW5jID09PSB0cnVlKSB7XG4gICAgICBpZihPYmplY3QuZW50cmllcyh0aGlzLmRiKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdHMgPSB0aGlzLmRiXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RlZmF1bHRzID0gZGVmYXVsdHNcbiAgICB9XG4gICAgdGhpcy5zZXQodGhpcy5kZWZhdWx0cylcbiAgfVxuICBnZXQgbG9jYWxTdG9yYWdlKCkgeyByZXR1cm4gdGhpcy5fbG9jYWxTdG9yYWdlIHx8IHt9IH1cbiAgc2V0IGxvY2FsU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHsgdGhpcy5fbG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yYWdlIH1cbiAgZ2V0IHN0b3JhZ2VDb250YWluZXIoKSB7IHJldHVybiB7fSB9XG4gIGdldCBkYigpIHsgcmV0dXJuIHRoaXMuX2RiIH1cbiAgZ2V0IF9kYigpIHtcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgfHwgSlNPTi5zdHJpbmdpZnkodGhpcy5zdG9yYWdlQ29udGFpbmVyKVxuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICByZXNldEV2ZW50cyhjbGFzc1R5cGUpIHtcbiAgICBbXG4gICAgICAnb2ZmJyxcbiAgICAgICdvbidcbiAgICBdLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICAgICAgdGhpcy50b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpXG4gICAgfSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZCkge1xuICAgIGNvbnN0IGJhc2VOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgncycpXG4gICAgY29uc3QgYmFzZUV2ZW50c05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdFdmVudHMnKVxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3NOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJylcbiAgICBjb25zdCBiYXNlID0gdGhpc1tiYXNlTmFtZV1cbiAgICBjb25zdCBiYXNlRXZlbnRzID0gdGhpc1tiYXNlRXZlbnRzTmFtZV1cbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzID0gdGhpc1tiYXNlQ2FsbGJhY2tzTmFtZV1cbiAgICBpZihcbiAgICAgIGJhc2UgJiZcbiAgICAgIGJhc2VFdmVudHMgJiZcbiAgICAgIGJhc2VDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKGJhc2VFdmVudHMpXG4gICAgICAgIC5mb3JFYWNoKChbYmFzZUV2ZW50RGF0YSwgYmFzZUNhbGxiYWNrTmFtZV0pID0+IHtcbiAgICAgICAgICBsZXQgW2Jhc2VUYXJnZXROYW1lLCBiYXNlRXZlbnROYW1lXSA9IGJhc2VFdmVudERhdGEuc3BsaXQoJyAnKVxuICAgICAgICAgIGxldCBiYXNlVGFyZ2V0ID0gYmFzZVtiYXNlVGFyZ2V0TmFtZV1cbiAgICAgICAgICBsZXQgYmFzZUNhbGxiYWNrID0gYmFzZUNhbGxiYWNrc1tiYXNlQ2FsbGJhY2tOYW1lXVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrICYmXG4gICAgICAgICAgICBiYXNlQ2FsbGJhY2submFtZS5zcGxpdCgnICcpLmxlbmd0aCA9PT0gMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZUNhbGxiYWNrID0gYmFzZUNhbGxiYWNrLmJpbmQodGhpcylcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldCAmJlxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBiYXNlVGFyZ2V0W21ldGhvZF0oYmFzZUV2ZW50TmFtZSwgYmFzZUNhbGxiYWNrKVxuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge31cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0REIoKSB7XG4gICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICB2YXIgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBsZXQgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgZGJba2V5XSA9IHZhbHVlXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHRoaXMuX2RiID0gZGJcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0REIoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZGVsZXRlIHRoaXMuX2RiXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgZGVsZXRlIGRiW2tleV1cbiAgICAgICAgdGhpcy5fZGIgPSBkYlxuICAgICAgICBicmVha1xuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlLCBzaWxlbnQpIHtcbiAgICBjb25zdCBjdXJyZW50RGF0YVByb3BlcnR5ID0gdGhpcy5kYXRhW2tleV1cbiAgICBpZighc2lsZW50KSB7XG4gICAgICB0aGlzLmVtaXQoJ2JlZm9yZVNldCcuY29uY2F0KCc6Jywga2V5KSwge1xuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgdmFsdWU6IHRoaXMuZ2V0KGtleSksXG4gICAgICB9LCB7XG4gICAgICAgIGtleToga2V5LFxuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICB9LCB0aGlzKVxuICAgIH1cbiAgICBpZighY3VycmVudERhdGFQcm9wZXJ0eSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcy5kYXRhLCB7XG4gICAgICAgIFsnXycuY29uY2F0KGtleSldOiB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBba2V5XToge1xuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNbJ18nLmNvbmNhdChrZXkpXSB9LFxuICAgICAgICAgIHNldCh2YWx1ZSkgeyB0aGlzWydfJy5jb25jYXQoa2V5KV0gPSB2YWx1ZSB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLmRhdGFba2V5XSA9IHZhbHVlXG4gICAgaWYoY3VycmVudERhdGFQcm9wZXJ0eSBpbnN0YW5jZW9mIE1vZGVsKSB7XG4gICAgICBjb25zdCBlbWl0ID0gKG5hbWUsIGRhdGEsIG1vZGVsKSA9PiB0aGlzLmVtaXQobmFtZSwgZGF0YSwgbW9kZWwpXG4gICAgICB0aGlzLmRhdGFba2V5XVxuICAgICAgICAub24oJ2JlZm9yZVNldCcsIHRoaXMuZW1pdChldmVudC5uYW1lLCBldmVudC5kYXRhLCBtb2RlbCkpXG4gICAgICAgIC5vbignc2V0JywgdGhpcy5lbWl0KGV2ZW50Lm5hbWUsIGV2ZW50LmRhdGEsIG1vZGVsKSlcbiAgICAgICAgLm9uKCdiZWZvcmVVbnNldCcsIHRoaXMuZW1pdChldmVudC5uYW1lLCBldmVudC5kYXRhLCBtb2RlbCkpXG4gICAgICAgIC5vbigndW5zZXQnLCB0aGlzLmVtaXQoZXZlbnQubmFtZSwgZXZlbnQuZGF0YSwgbW9kZWwpKVxuICAgIH1cbiAgICBpZighc2lsZW50KSB7XG4gICAgICB0aGlzLmVtaXQoJ3NldCcuY29uY2F0KCc6Jywga2V5KSwge1xuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgfSwgdGhpcylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldERhdGFQcm9wZXJ0eShrZXksIHNpbGVudCkge1xuICAgIGlmKCFzaWxlbnQpIHtcbiAgICAgIHRoaXMuZW1pdCgnYmVmb3JlVW5zZXQnLmNvbmNhdCgnOicsIGFyZ3VtZW50c1swXSksIHRoaXMpXG4gICAgfVxuICAgIGlmKHRoaXMuZGF0YVtrZXldKSB7XG4gICAgICBkZWxldGUgdGhpcy5kYXRhW2tleV1cbiAgICB9XG4gICAgaWYoIXNpbGVudCkge1xuICAgICAgdGhpcy5lbWl0KCd1bnNldCcuY29uY2F0KCc6JywgYXJndW1lbnRzWzBdKSwgdGhpcylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBnZXQoKSB7XG4gICAgaWYoYXJndW1lbnRzWzBdKSByZXR1cm4gdGhpcy5kYXRhW2FyZ3VtZW50c1swXV1cbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy5kYXRhKVxuICAgICAgLnJlZHVjZSgoX2RhdGEsIFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBfZGF0YVtrZXldID0gdmFsdWVcbiAgICAgICAgcmV0dXJuIF9kYXRhXG4gICAgICB9LCB7fSlcbiAgfVxuICBzZXQoKSB7XG4gICAgY29uc3QgX2FyZ3VtZW50cyA9IEFycmF5LmZyb20oYXJndW1lbnRzKVxuICAgIHZhciBrZXksIHZhbHVlLCBzaWxlbnRcbiAgICBpZihfYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAga2V5ID0gX2FyZ3VtZW50c1swXVxuICAgICAgdmFsdWUgPSBfYXJndW1lbnRzWzFdXG4gICAgICBzaWxlbnQgPSBfYXJndW1lbnRzWzJdXG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ2JlZm9yZVNldCcsIHRoaXMuZGF0YSwgT2JqZWN0LmFzc2lnbihcbiAgICAgICAge30sXG4gICAgICAgIHRoaXMuZGF0YSxcbiAgICAgICAge1xuICAgICAgICAgIFtrZXldOiB2YWx1ZSxcbiAgICAgICAgfSxcbiAgICAgICksIHRoaXMpXG4gICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlLCBzaWxlbnQpXG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ3NldCcsIHRoaXMuZGF0YSwgdGhpcylcbiAgICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KSB0aGlzLnNldERCKGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKVxuICAgIH0gZWxzZSBpZihfYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgaWYoXG4gICAgICAgIHR5cGVvZiBfYXJndW1lbnRzWzBdID09PSAnb2JqZWN0JyAmJlxuICAgICAgICB0eXBlb2YgX2FyZ3VtZW50c1sxXSA9PT0gJ2Jvb2xlYW4nXG4gICAgICApIHtcbiAgICAgICAgc2lsZW50ID0gX2FyZ3VtZW50c1sxXVxuICAgICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ2JlZm9yZVNldCcsIHRoaXMuZGF0YSwgT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICB7fSxcbiAgICAgICAgICB0aGlzLmRhdGEsXG4gICAgICAgICAgX2FyZ3VtZW50c1swXSxcbiAgICAgICAgKSwgdGhpcylcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoX2FyZ3VtZW50c1swXSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KVxuICAgICAgICB9KVxuICAgICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ3NldCcsIHRoaXMuZGF0YSwgdGhpcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgnYmVmb3JlU2V0JywgdGhpcy5kYXRhLCBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIHRoaXMuZGF0YSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBbX2FyZ3VtZW50c1swXV06IF9hcmd1bWVudHNbMV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgKSwgdGhpcylcbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoX2FyZ3VtZW50c1swXSwgX2FyZ3VtZW50c1sxXSlcbiAgICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCdzZXQnLCB0aGlzLmRhdGEsIHRoaXMpXG4gICAgICB9XG4gICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgdGhpcy5zZXREQihfYXJndW1lbnRzWzBdLCBfYXJndW1lbnRzWzFdKVxuICAgIH0gZWxzZSBpZihcbiAgICAgIF9hcmd1bWVudHMubGVuZ3RoID09PSAxICYmXG4gICAgICAhQXJyYXkuaXNBcnJheShfYXJndW1lbnRzWzBdKSAmJlxuICAgICAgdHlwZW9mIF9hcmd1bWVudHNbMF0gPT09ICdvYmplY3QnXG4gICAgKSB7XG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ2JlZm9yZVNldCcsIHRoaXMuZGF0YSwgT2JqZWN0LmFzc2lnbihcbiAgICAgICAge30sXG4gICAgICAgIHRoaXMuZGF0YSxcbiAgICAgICAgX2FyZ3VtZW50c1swXSxcbiAgICAgICksIHRoaXMpXG4gICAgICBPYmplY3QuZW50cmllcyhfYXJndW1lbnRzWzBdKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSlcbiAgICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHRoaXMuc2V0REIoa2V5LCB2YWx1ZSlcbiAgICAgIH0pXG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ3NldCcsIHRoaXMuZGF0YSwgdGhpcylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldCgpIHtcbiAgICBsZXQgc2lsZW50XG4gICAgaWYoXG4gICAgICBhcmd1bWVudHMubGVuZ3RoID09PSAyXG4gICAgKSB7XG4gICAgICBzaWxlbnQgPSBhcmd1bWVudHNbMV1cbiAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgnYmVmb3JlVW5zZXQnLCB0aGlzLmRhdGEsIHRoaXMpXG4gICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGFyZ3VtZW50c1swXSwgc2lsZW50KVxuICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCd1bnNldCcsIHRoaXMpXG4gICAgfSBlbHNlIGlmKFxuICAgICAgYXJndW1lbnRzLmxlbmd0aCA9PT0gMVxuICAgICkge1xuICAgICAgaWYodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHNpbGVudCA9IGFyZ3VtZW50c1swXVxuICAgICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ2JlZm9yZVVuc2V0JywgdGhpcy5kYXRhLCB0aGlzKVxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmRhdGEpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5LCBzaWxlbnQpXG4gICAgICAgIH0pXG4gICAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgndW5zZXQnLCB0aGlzKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ2JlZm9yZVVuc2V0JywgdGhpcy5kYXRhLCB0aGlzKVxuICAgICAgT2JqZWN0LmtleXModGhpcy5kYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICB9KVxuICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCd1bnNldCcsIHRoaXMpXG4gICAgfVxuICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KSB0aGlzLnVuc2V0REIoa2V5KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgcGFyc2UoZGF0YSA9IHRoaXMuZGF0YSkge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhkYXRhKS5yZWR1Y2UoKF9kYXRhLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgTW9kZWwpIHtcbiAgICAgICAgX2RhdGFba2V5XSA9IHZhbHVlLnBhcnNlKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9kYXRhW2tleV0gPSB2YWx1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIF9kYXRhXG4gICAgfSwge30pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW9kZWxcbiIsImltcG9ydCB7IFVVSUQgfSBmcm9tICcuLi9VdGlsaXRpZXMvaW5kZXguanMnXHJcbmltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xyXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vTW9kZWwvaW5kZXguanMnXHJcblxyXG5jbGFzcyBDb2xsZWN0aW9uIGV4dGVuZHMgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcclxuICAgIHN1cGVyKClcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xyXG4gIH1cclxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcclxuICAgICdpZEF0dHJpYnV0ZScsXHJcbiAgICAnbW9kZWwnLFxyXG4gICAgJ21vZGVsT3B0aW9ucycsXHJcbiAgICAnZGVmYXVsdHMnLFxyXG4gICAgJ3NlcnZpY2VzJyxcclxuICAgICdzZXJ2aWNlRXZlbnRzJyxcclxuICAgICdzZXJ2aWNlQ2FsbGJhY2tzJyxcclxuICAgICdsb2NhbFN0b3JhZ2UnXHJcbiAgXSB9XHJcbiAgZ2V0IGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXMoKSB7IHJldHVybiBbXHJcbiAgICAnc2VydmljZSdcclxuICBdIH1cclxuICBnZXQgc2V0dGluZ3MoKSB7IHJldHVybiB0aGlzLl9zZXR0aW5ncyB9XHJcbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XHJcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3MuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XHJcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cclxuICAgIH0pXHJcbiAgICB0aGlzLmJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXNcclxuICAgICAgLmZvckVhY2goKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSkgPT4ge1xyXG4gICAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSwgJ29uJylcclxuICAgICAgfSlcclxuICB9XHJcbiAgZ2V0IG9wdGlvbnMoKSB7XHJcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XHJcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xyXG4gIH1cclxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cclxuICBnZXQgc3RvcmFnZUNvbnRhaW5lcigpIHsgcmV0dXJuIFtdIH1cclxuICBnZXQgZGVmYXVsdElEQXR0cmlidXRlKCkgeyByZXR1cm4gJ19pZCcgfVxyXG4gIGdldCBkZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuX2RlZmF1bHRzIH1cclxuICBzZXQgZGVmYXVsdHMoZGVmYXVsdHMpIHtcclxuICAgIHRoaXMuX2RlZmF1bHRzID0gZGVmYXVsdHNcclxuICAgIHRoaXMuYWRkKGRlZmF1bHRzKVxyXG4gIH1cclxuICBnZXQgdXVpZCgpIHtcclxuICAgIGlmKCF0aGlzLl91dWlkKSB0aGlzLl91dWlkID0gVXRpbGl0aWVzLlVVSUQoKVxyXG4gICAgcmV0dXJuIHRoaXMuX3V1aWRcclxuICB9XHJcbiAgZ2V0IG1vZGVscygpIHtcclxuICAgIHRoaXMuX21vZGVscyA9IHRoaXMuX21vZGVscyB8fCB0aGlzLnN0b3JhZ2VDb250YWluZXJcclxuICAgIHJldHVybiB0aGlzLl9tb2RlbHNcclxuICB9XHJcbiAgc2V0IG1vZGVscyhtb2RlbHNEYXRhKSB7IHRoaXMuX21vZGVscyA9IG1vZGVsc0RhdGEgfVxyXG4gIGdldCBtb2RlbCgpIHsgcmV0dXJuIHRoaXMuX21vZGVsIH1cclxuICBzZXQgbW9kZWwobW9kZWwpIHsgdGhpcy5fbW9kZWwgPSBtb2RlbCB9XHJcbiAgZ2V0IGxvY2FsU3RvcmFnZSgpIHsgcmV0dXJuIHRoaXMuX2xvY2FsU3RvcmFnZSB9XHJcbiAgc2V0IGxvY2FsU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHsgdGhpcy5fbG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yYWdlIH1cclxuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGEgfVxyXG4gIGdldCBkYXRhKCkge1xyXG4gICAgY29uc3QgbW9kZWxzRXhpc3QgPSAoT2JqZWN0LmtleXModGhpcy5tb2RlbHMpLmxlbmd0aClcclxuICAgICAgPyB0cnVlXHJcbiAgICAgIDogZmFsc2VcclxuICAgIHJldHVybiAobW9kZWxzRXhpc3QpXHJcbiAgICAgID8gdGhpcy5tb2RlbHNcclxuICAgICAgICAubWFwKChtb2RlbCkgPT4gbW9kZWwucGFyc2UoKSlcclxuICAgICAgOiBbXVxyXG4gIH1cclxuICBnZXQgZGIoKSB7IHJldHVybiB0aGlzLl9kYiB9XHJcbiAgZ2V0IGRiKCkge1xyXG4gICAgbGV0IGRiID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHx8IEpTT04uc3RyaW5naWZ5KHRoaXMuc3RvcmFnZUNvbnRhaW5lcilcclxuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxyXG4gIH1cclxuICBzZXQgZGIoZGIpIHtcclxuICAgIGRiID0gSlNPTi5zdHJpbmdpZnkoZGIpXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCwgZGIpXHJcbiAgfVxyXG4gIHJlc2V0RXZlbnRzKGNsYXNzVHlwZSkge1xyXG4gICAgW1xyXG4gICAgICAnb2ZmJyxcclxuICAgICAgJ29uJ1xyXG4gICAgXS5mb3JFYWNoKChtZXRob2QpID0+IHtcclxuICAgICAgdGhpcy50b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgdG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKSB7XHJcbiAgICBjb25zdCBiYXNlTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ3MnKVxyXG4gICAgY29uc3QgYmFzZUV2ZW50c05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdFdmVudHMnKVxyXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrc05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKVxyXG4gICAgY29uc3QgYmFzZSA9IHRoaXNbYmFzZU5hbWVdXHJcbiAgICBjb25zdCBiYXNlRXZlbnRzID0gdGhpc1tiYXNlRXZlbnRzTmFtZV1cclxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3MgPSB0aGlzW2Jhc2VDYWxsYmFja3NOYW1lXVxyXG4gICAgaWYoXHJcbiAgICAgIGJhc2UgJiZcclxuICAgICAgYmFzZUV2ZW50cyAmJlxyXG4gICAgICBiYXNlQ2FsbGJhY2tzXHJcbiAgICApIHtcclxuICAgICAgT2JqZWN0LmVudHJpZXMoYmFzZUV2ZW50cylcclxuICAgICAgICAuZm9yRWFjaCgoW2Jhc2VFdmVudERhdGEsIGJhc2VDYWxsYmFja05hbWVdKSA9PiB7XHJcbiAgICAgICAgICBsZXQgW2Jhc2VUYXJnZXROYW1lLCBiYXNlRXZlbnROYW1lXSA9IGJhc2VFdmVudERhdGEuc3BsaXQoJyAnKVxyXG4gICAgICAgICAgbGV0IGJhc2VUYXJnZXQgPSBiYXNlW2Jhc2VUYXJnZXROYW1lXVxyXG4gICAgICAgICAgbGV0IGJhc2VDYWxsYmFjayA9IGJhc2VDYWxsYmFja3NbYmFzZUNhbGxiYWNrTmFtZV1cclxuICAgICAgICAgIGlmKFxyXG4gICAgICAgICAgICBiYXNlQ2FsbGJhY2sgJiZcclxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrLm5hbWUuc3BsaXQoJyAnKS5sZW5ndGggPT09IDFcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICBiYXNlQ2FsbGJhY2sgPSBiYXNlQ2FsbGJhY2suYmluZCh0aGlzKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIGJhc2VUYXJnZXROYW1lICYmXHJcbiAgICAgICAgICAgIGJhc2VFdmVudE5hbWUgJiZcclxuICAgICAgICAgICAgYmFzZVRhcmdldCAmJlxyXG4gICAgICAgICAgICBiYXNlQ2FsbGJhY2tcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIGJhc2VUYXJnZXRbbWV0aG9kXShiYXNlRXZlbnROYW1lLCBiYXNlQ2FsbGJhY2spXHJcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHt9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGdldE1vZGVsSW5kZXgobW9kZWxVVUlEKSB7XHJcbiAgICBsZXQgbW9kZWxJbmRleFxyXG4gICAgdGhpcy5fbW9kZWxzXHJcbiAgICAgIC5maW5kKChfbW9kZWwsIF9tb2RlbEluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYoX21vZGVsICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgX21vZGVsIGluc3RhbmNlb2YgTW9kZWwgJiZcclxuICAgICAgICAgICAgX21vZGVsLl91dWlkID09PSBtb2RlbFVVSURcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICBtb2RlbEluZGV4ID0gX21vZGVsSW5kZXhcclxuICAgICAgICAgICAgcmV0dXJuIF9tb2RlbFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIHJldHVybiBtb2RlbEluZGV4XHJcbiAgfVxyXG4gIHJlbW92ZU1vZGVsQnlJbmRleChtb2RlbEluZGV4KSB7XHJcbiAgICBsZXQgbW9kZWwgPSB0aGlzLl9tb2RlbHMuc3BsaWNlKG1vZGVsSW5kZXgsIDEsIG51bGwpXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdyZW1vdmU6bW9kZWwnLFxyXG4gICAgICBtb2RlbFswXS5wYXJzZSgpLFxyXG4gICAgICB0aGlzLFxyXG4gICAgICBtb2RlbFswXVxyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgYWRkTW9kZWwobW9kZWxEYXRhKSB7XHJcbiAgICBsZXQgbW9kZWxcclxuICAgIGlmKG1vZGVsRGF0YSBpbnN0YW5jZW9mIE1vZGVsKSB7XHJcbiAgICAgIG1vZGVsID0gbW9kZWxEYXRhXHJcbiAgICB9IGVsc2UgaWYoXHJcbiAgICAgIHRoaXMubW9kZWxcclxuICAgICkge1xyXG4gICAgICBjb25zdCBNb2RlbFByb3RvdHlwZSA9IHRoaXMubW9kZWxcclxuICAgICAgbW9kZWwgPSBuZXcgTW9kZWxQcm90b3R5cGUoe1xyXG4gICAgICAgIGRlZmF1bHRzOiBtb2RlbERhdGEsXHJcbiAgICAgIH0sIHRoaXMubW9kZWxPcHRpb25zKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbW9kZWwgPSBuZXcgTW9kZWwoe1xyXG4gICAgICAgIGRlZmF1bHRzOiBtb2RlbERhdGFcclxuICAgICAgfSlcclxuICAgIH1cclxuICAgIG1vZGVsLm9uKFxyXG4gICAgICAnc2V0JyxcclxuICAgICAgKGV2ZW50LCBfbW9kZWwpID0+IHRoaXMuZW1pdChcclxuICAgICAgICAnY2hhbmdlOm1vZGVsJyxcclxuICAgICAgICB0aGlzLnBhcnNlKCksXHJcbiAgICAgICAgdGhpcyxcclxuICAgICAgICBfbW9kZWwsXHJcbiAgICAgICksXHJcbiAgICApXHJcbiAgICB0aGlzLm1vZGVscy5wdXNoKG1vZGVsKVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAnYWRkJyxcclxuICAgICAgbW9kZWwucGFyc2UoKSxcclxuICAgICAgdGhpcyxcclxuICAgICAgbW9kZWxcclxuICAgIClcclxuICAgIHJldHVybiBtb2RlbFxyXG4gIH1cclxuICBhZGQobW9kZWxEYXRhKSB7XHJcbiAgICBpZihBcnJheS5pc0FycmF5KG1vZGVsRGF0YSkpIHtcclxuICAgICAgbW9kZWxEYXRhXHJcbiAgICAgICAgLmZvckVhY2goKG1vZGVsKSA9PiB0aGlzLmFkZE1vZGVsKG1vZGVsKSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYWRkTW9kZWwobW9kZWxEYXRhKVxyXG4gICAgfVxyXG4gICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIHRoaXMuZGIgPSB0aGlzLmRhdGFcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ2NoYW5nZScsXHJcbiAgICAgIHRoaXMucGFyc2UoKSxcclxuICAgICAgdGhpc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcmVtb3ZlKG1vZGVsRGF0YSkge1xyXG4gICAgaWYoXHJcbiAgICAgICFBcnJheS5pc0FycmF5KG1vZGVsRGF0YSkgJiZcclxuICAgICAgdHlwZW9mIG1vZGVsRGF0YSA9PT0gJ29iamVjdCdcclxuICAgICkge1xyXG4gICAgICB2YXIgbW9kZWxJbmRleCA9IHRoaXMuZ2V0TW9kZWxJbmRleChtb2RlbERhdGEudXVpZClcclxuICAgICAgdGhpcy5yZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleClcclxuICAgIH0gZWxzZSBpZihBcnJheS5pc0FycmF5KG1vZGVsRGF0YSkpIHtcclxuICAgICAgbW9kZWxEYXRhXHJcbiAgICAgICAgLmZvckVhY2goKG1vZGVsKSA9PiB7XHJcbiAgICAgICAgICB2YXIgbW9kZWxJbmRleCA9IHRoaXMuZ2V0TW9kZWxJbmRleChtb2RlbC51dWlkKVxyXG4gICAgICAgICAgdGhpcy5yZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgdGhpcy5tb2RlbHMgPSB0aGlzLm1vZGVsc1xyXG4gICAgICAuZmlsdGVyKChtb2RlbCkgPT4gbW9kZWwgIT09IG51bGwpXHJcbiAgICBpZih0aGlzLl9sb2NhbFN0b3JhZ2UpIHRoaXMuZGIgPSB0aGlzLmRhdGFcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ3JlbW92ZScsXHJcbiAgICAgIHRoaXMucGFyc2UoKSxcclxuICAgICAgdGhpc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLnJlbW92ZSh0aGlzLl9tb2RlbHMpXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBwYXJzZShkYXRhKSB7XHJcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLmRhdGEgfHwgdGhpcy5zdG9yYWdlQ29udGFpbmVyXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSlcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvbGxlY3Rpb25cclxuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXguanMnXG5cbmNsYXNzIFZpZXcgZXh0ZW5kcyBFdmVudHMge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICB9XG4gIGdldCB2YWxpZFNldHRpbmdzKCkgeyByZXR1cm4gW1xuICAgICdhdHRyaWJ1dGVzJyxcbiAgICAnZWxlbWVudE5hbWUnLFxuICAgICdlbGVtZW50JyxcbiAgICAnaW5zZXJ0JyxcbiAgICAndGVtcGxhdGUnLFxuICAgICd1aUVsZW1lbnRzJyxcbiAgICAndWlFbGVtZW50RXZlbnRzJyxcbiAgICAndWlFbGVtZW50Q2FsbGJhY2tzJyxcbiAgICAncmVuZGVyJ1xuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCBlbGVtZW50TmFtZSgpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnROYW1lIH1cbiAgc2V0IGVsZW1lbnROYW1lKGVsZW1lbnROYW1lKSB7IHRoaXMuX2VsZW1lbnROYW1lID0gZWxlbWVudE5hbWUgfVxuICBnZXQgZWxlbWVudCgpIHtcbiAgICBpZighdGhpcy5fZWxlbWVudCkge1xuICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5lbGVtZW50TmFtZSlcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuYXR0cmlidXRlcykuZm9yRWFjaCgoW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdKSA9PiB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpXG4gICAgICB9KVxuICAgICAgdGhpcy5lbGVtZW50T2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmVsZW1lbnQsIHtcbiAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRcbiAgfVxuICBnZXQgZWxlbWVudE9ic2VydmVyKCkge1xuICAgIHRoaXMuX2VsZW1lbnRPYnNlcnZlciA9IHRoaXMuX2VsZW1lbnRPYnNlcnZlciB8fCBuZXcgTXV0YXRpb25PYnNlcnZlcihcbiAgICAgIHRoaXMuZWxlbWVudE9ic2VydmUuYmluZCh0aGlzKVxuICAgIClcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudE9ic2VydmVyXG4gIH1cbiAgc2V0IGVsZW1lbnQoZWxlbWVudCkge1xuICAgIGlmKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnRcbiAgfVxuICBnZXQgYXR0cmlidXRlcygpIHsgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXMgfHwge30gfVxuICBzZXQgYXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7IHRoaXMuX2F0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzIH1cbiAgZ2V0IHRlbXBsYXRlKCkgeyByZXR1cm4gdGhpcy5fdGVtcGxhdGUgfVxuICBzZXQgdGVtcGxhdGUodGVtcGxhdGUpIHsgdGhpcy5fdGVtcGxhdGUgPSB0ZW1wbGF0ZSB9XG4gIGdldCB1aUVsZW1lbnRzKCkgeyByZXR1cm4gdGhpcy5fdWlFbGVtZW50cyB8fCB7fSB9XG4gIHNldCB1aUVsZW1lbnRzKHVpRWxlbWVudHMpIHtcbiAgICB0aGlzLl91aUVsZW1lbnRzID0gdWlFbGVtZW50c1xuICAgIC8vIHRoaXMudG9nZ2xlRXZlbnRzKClcbiAgfVxuICBnZXQgdWlFbGVtZW50RXZlbnRzKCkgeyByZXR1cm4gdGhpcy5fdWlFbGVtZW50RXZlbnRzIHx8IHt9IH1cbiAgc2V0IHVpRWxlbWVudEV2ZW50cyh1aUVsZW1lbnRFdmVudHMpIHtcbiAgICB0aGlzLl91aUVsZW1lbnRFdmVudHMgPSB1aUVsZW1lbnRFdmVudHNcbiAgICAvLyB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gIH1cbiAgZ2V0IHVpRWxlbWVudENhbGxiYWNrcygpIHsgcmV0dXJuIHRoaXMuX3VpRWxlbWVudENhbGxiYWNrcyB8fCB7fSB9XG4gIHNldCB1aUVsZW1lbnRDYWxsYmFja3ModWlFbGVtZW50Q2FsbGJhY2tzKSB7XG4gICAgdGhpcy5fdWlFbGVtZW50Q2FsbGJhY2tzID0gdWlFbGVtZW50Q2FsbGJhY2tzXG4gICAgT2JqZWN0LnZhbHVlcyh0aGlzLl91aUVsZW1lbnRDYWxsYmFja3MpXG4gICAgICAuZm9yRWFjaCgodWlFbGVtZW50Q2FsbGJhY2spID0+IHVpRWxlbWVudENhbGxiYWNrLmJpbmQodGhpcykpXG4gICAgLy8gdGhpcy50b2dnbGVFdmVudHMoKVxuICB9XG4gIGdldCB1aSgpIHtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpc1xuICAgIGlmKCF0aGlzLl91aSkge1xuICAgICAgdGhpcy5fdWkgPSBPYmplY3QuZW50cmllcyh0aGlzLnVpRWxlbWVudHMpLnJlZHVjZSgoX3VpLFt1aUVsZW1lbnROYW1lLCB1aUVsZW1lbnRRdWVyeV0pID0+IHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoX3VpLCB7XG4gICAgICAgICAgW3VpRWxlbWVudE5hbWVdOiB7XG4gICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgIGlmKHR5cGVvZiB1aUVsZW1lbnRRdWVyeSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBsZXQgcXVlcnlSZXN1bHRzID0gY29udGV4dC5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodWlFbGVtZW50UXVlcnkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIChxdWVyeVJlc3VsdHMubGVuZ3RoID4gMSkgPyBxdWVyeVJlc3VsdHMgOiBxdWVyeVJlc3VsdHMuaXRlbSgwKVxuICAgICAgICAgICAgICB9IGVsc2UgaWYoXG4gICAgICAgICAgICAgICAgdWlFbGVtZW50UXVlcnkgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxuICAgICAgICAgICAgICAgIHVpRWxlbWVudFF1ZXJ5IGluc3RhbmNlb2YgRG9jdW1lbnQgfHxcbiAgICAgICAgICAgICAgICB1aUVsZW1lbnRRdWVyeSBpbnN0YW5jZW9mIFdpbmRvd1xuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdWlFbGVtZW50UXVlcnlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBfdWlcbiAgICAgIH0sIHt9KVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcy5fdWksIHtcbiAgICAgICAgJyRlbGVtZW50Jzoge1xuICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGNvbnRleHQuZWxlbWVudCB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdWlcbiAgfVxuICByZXNldFVJKCkge1xuICAgIGRlbGV0ZSB0aGlzLl91aVxuICAgIHRoaXMudG9nZ2xlRXZlbnRzKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGVsZW1lbnRPYnNlcnZlKG11dGF0aW9uUmVjb3JkTGlzdCwgb2JzZXJ2ZXIpIHtcbiAgICBmb3IobGV0IFttdXRhdGlvblJlY29yZEluZGV4LCBtdXRhdGlvblJlY29yZF0gb2YgT2JqZWN0LmVudHJpZXMobXV0YXRpb25SZWNvcmRMaXN0KSkge1xuICAgICAgc3dpdGNoKG11dGF0aW9uUmVjb3JkLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnY2hpbGRMaXN0JzpcbiAgICAgICAgICBpZihtdXRhdGlvblJlY29yZC5hZGRlZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnModGhpcy51aSkpXG4gICAgICAgICAgICAvLyAuZm9yRWFjaCgoW3VpS2V5LCB1aVZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgLy8gICBjb25zdCB1aVZhbHVlR2V0ID0gdWlWYWx1ZS5nZXQoKVxuICAgICAgICAgICAgLy8gICBjb25zdCBhZGRlZFVJRWxlbWVudCA9IEFycmF5LmZyb20obXV0YXRpb25SZWNvcmQuYWRkZWROb2RlcykuZmluZCgoYWRkZWROb2RlKSA9PiB7XG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ2FkZGVkTm9kZScsIGFkZGVkTm9kZSlcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygndWlWYWx1ZUdldCcsIHVpVmFsdWVHZXQpXG4gICAgICAgICAgICAvLyAgICAgcmV0dXJuIGFkZGVkTm9kZSA9PT0gdWlWYWx1ZUdldFxuICAgICAgICAgICAgLy8gICB9KVxuICAgICAgICAgICAgLy8gICBpZihhZGRlZFVJRWxlbWVudCkge1xuICAgICAgICAgICAgLy8gICAgIHRoaXMudG9nZ2xlRXZlbnRzKHVpS2V5KVxuICAgICAgICAgICAgLy8gICB9XG4gICAgICAgICAgICAvLyB9KVxuICAgICAgICAgICAgdGhpcy50b2dnbGVFdmVudHMoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBiaW5kRXZlbnRUb0VsZW1lbnQoZWxlbWVudCwgbWV0aG9kLCBldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2tOYW1lKSB7XG4gICAgdHJ5IHtcbiAgICAgIHN3aXRjaChtZXRob2QpIHtcbiAgICAgICAgY2FzZSAnYWRkRXZlbnRMaXN0ZW5lcic6XG4gICAgICAgICAgdGhpcy51aUVsZW1lbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdID0gdGhpcy51aUVsZW1lbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdLy8gLmJpbmQodGhpcylcbiAgICAgICAgICBlbGVtZW50W21ldGhvZF0oZXZlbnROYW1lLCB0aGlzLnVpRWxlbWVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAncmVtb3ZlRXZlbnRMaXN0ZW5lcic6XG4gICAgICAgICAgZWxlbWVudFttZXRob2RdKGV2ZW50TmFtZSwgdGhpcy51aUVsZW1lbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdKVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfSBjYXRjaChlcnJvcikge31cbiAgfVxuICB0b2dnbGVFdmVudHModGFyZ2V0VUlFbGVtZW50TmFtZSA9IG51bGwpIHtcbiAgICB0aGlzLmlzVG9nZ2xpbmcgPSB0cnVlXG4gICAgY29uc3QgdWkgPSB0aGlzLnVpXG4gICAgY29uc3QgZXZlbnRCaW5kTWV0aG9kcyA9IFsncmVtb3ZlRXZlbnRMaXN0ZW5lcicsICdhZGRFdmVudExpc3RlbmVyJ11cbiAgICBpZighdGFyZ2V0VUlFbGVtZW50TmFtZSkge1xuICAgICAgZXZlbnRCaW5kTWV0aG9kcy5mb3JFYWNoKChldmVudEJpbmRNZXRob2QpID0+IHtcbiAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcy51aUVsZW1lbnRFdmVudHMpLmZvckVhY2goKFt1aUVsZW1lbnRFdmVudFNldHRpbmdzLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZV0pID0+IHtcbiAgICAgICAgICBsZXQgW3VpRWxlbWVudE5hbWUsIHVpRWxlbWVudEV2ZW50TmFtZV0gPSB1aUVsZW1lbnRFdmVudFNldHRpbmdzLnNwbGl0KCcgJylcbiAgICAgICAgICBpZih1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XG4gICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXS5mb3JFYWNoKCh1aUVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlFbGVtZW50LCBldmVudEJpbmRNZXRob2QsIHVpRWxlbWVudEV2ZW50TmFtZSwgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSBpZih1aVt1aUVsZW1lbnROYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlbdWlFbGVtZW50TmFtZV0sIGV2ZW50QmluZE1ldGhvZCwgdWlFbGVtZW50RXZlbnROYW1lLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBldmVudEJpbmRNZXRob2RzLmZvckVhY2goKGV2ZW50QmluZE1ldGhvZCkgPT4ge1xuICAgICAgICBjb25zdCB1aUVsZW1lbnRFdmVudHMgPSBPYmplY3QuZW50cmllcyh0aGlzLnVpRWxlbWVudEV2ZW50cykuZm9yRWFjaCgoW3VpRWxlbWVudEV2ZW50U2V0dGluZ3MsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGxldCBbdWlFbGVtZW50TmFtZSwgdWlFbGVtZW50RXZlbnROYW1lXSA9IHVpRWxlbWVudEV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxuICAgICAgICAgIGlmKHRhcmdldFVJRWxlbWVudE5hbWUgPT09IHVpRWxlbWVudE5hbWUpIHtcbiAgICAgICAgICAgIGlmKHVpW3VpRWxlbWVudE5hbWVdIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0uZm9yRWFjaCgodWlFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlFbGVtZW50LCBldmVudEJpbmRNZXRob2QsIHVpRWxlbWVudEV2ZW50TmFtZSwgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2UgaWYodWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICB0aGlzLmJpbmRFdmVudFRvRWxlbWVudCh1aVt1aUVsZW1lbnROYW1lXSwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuaXNUb2dnbGluZyA9IGZhbHNlXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdXRvSW5zZXJ0KCkge1xuICAgIGlmKHRoaXMuaW5zZXJ0KSB7XG4gICAgICBjb25zdCBwYXJlbnQgPSAodHlwZW9mIHRoaXMuaW5zZXJ0LnBhcmVudCA9PT0gJ3N0cmluZycpXG4gICAgICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmluc2VydC5wYXJlbnQpXG4gICAgICAgIDogKHRoaXMuaW5zZXJ0LnBhcmVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICAgID8gdGhpcy5pbnNlcnQucGFyZW50XG4gICAgICAgICAgOiBudWxsXG4gICAgICBjb25zdCBtZXRob2QgPSB0aGlzLmluc2VydC5tZXRob2RcbiAgICAgIHBhcmVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQobWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgYXV0b1JlbW92ZSgpIHtcbiAgICBpZih0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHJlbmRlcihkYXRhID0ge30pIHtcbiAgICBpZih0aGlzLnRlbXBsYXRlKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUoZGF0YSlcbiAgICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZVxuICAgIH1cbiAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgVmlld1xuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXgnXG5cbmNvbnN0IENvbnRyb2xsZXIgPSBjbGFzcyBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ21vZGVscycsXG4gICAgJ21vZGVsRXZlbnRzJyxcbiAgICAnbW9kZWxDYWxsYmFja3MnLFxuICAgICdjb2xsZWN0aW9ucycsXG4gICAgJ2NvbGxlY3Rpb25FdmVudHMnLFxuICAgICdjb2xsZWN0aW9uQ2FsbGJhY2tzJyxcbiAgICAndmlld3MnLFxuICAgICd2aWV3RXZlbnRzJyxcbiAgICAndmlld0NhbGxiYWNrcycsXG4gICAgJ2NvbnRyb2xsZXJzJyxcbiAgICAnY29udHJvbGxlckV2ZW50cycsXG4gICAgJ2NvbnRyb2xsZXJDYWxsYmFja3MnLFxuICAgICdyb3V0ZXJzJyxcbiAgICAncm91dGVyRXZlbnRzJyxcbiAgICAncm91dGVyQ2FsbGJhY2tzJyxcbiAgXSB9XG4gIGdldCBiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzKCkgeyByZXR1cm4gW1xuICAgICdtb2RlbCcsXG4gICAgJ3ZpZXcnLFxuICAgICdjb2xsZWN0aW9uJyxcbiAgICAnY29udHJvbGxlcicsXG4gICAgJ3JvdXRlcicsXG4gIF0gfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cbiAgZ2V0IHNldHRpbmdzKCkge1xuICAgIGlmKCF0aGlzLl9zZXR0aW5ncykgdGhpcy5fc2V0dGluZ3MgPSB7fVxuICAgIHJldHVybiB0aGlzLl9zZXR0aW5nc1xuICB9XG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3NcbiAgICAgIC5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgICAgaWYodGhpcy5zZXR0aW5nc1t2YWxpZFNldHRpbmddKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBbJ18nLmNvbmNhdCh2YWxpZFNldHRpbmcpXToge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtYmVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFt2YWxpZFNldHRpbmddOiB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpc1snXycuY29uY2F0KHZhbGlkU2V0dGluZyldIH0sXG4gICAgICAgICAgICAgICAgc2V0KHZhbHVlKSB7IHRoaXNbJ18nLmNvbmNhdCh2YWxpZFNldHRpbmcpXSA9IHZhbHVlIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKVxuICAgICAgICAgIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHRoaXMuc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIHRoaXMuYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlc1xuICAgICAgLmZvckVhY2goKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSkgPT4ge1xuICAgICAgICB0aGlzLnJlc2V0RXZlbnRzKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSlcbiAgICAgIH0pXG4gIH1cbiAgcmVzZXRFdmVudHMoY2xhc3NUeXBlKSB7XG4gICAgW1xuICAgICAgJ29mZicsXG4gICAgICAnb24nXG4gICAgXS5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB0b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpIHtcbiAgICBjb25zdCBiYXNlTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ3MnKVxuICAgIGNvbnN0IGJhc2VFdmVudHNOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJylcbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXG4gICAgY29uc3QgYmFzZSA9IHRoaXNbYmFzZU5hbWVdIHx8IHt9XG4gICAgY29uc3QgYmFzZUV2ZW50cyA9IHRoaXNbYmFzZUV2ZW50c05hbWVdIHx8IHt9XG4gICAgY29uc3QgYmFzZUNhbGxiYWNrcyA9IHRoaXNbYmFzZUNhbGxiYWNrc05hbWVdIHx8IHt9XG4gICAgaWYoXG4gICAgICBPYmplY3QudmFsdWVzKGJhc2UpLmxlbmd0aCAmJlxuICAgICAgT2JqZWN0LnZhbHVlcyhiYXNlRXZlbnRzKS5sZW5ndGggJiZcbiAgICAgIE9iamVjdC52YWx1ZXMoYmFzZUNhbGxiYWNrcykubGVuZ3RoXG4gICAgKSB7XG4gICAgICBPYmplY3QuZW50cmllcyhiYXNlRXZlbnRzKVxuICAgICAgICAuZm9yRWFjaCgoW2Jhc2VFdmVudERhdGEsIGJhc2VDYWxsYmFja05hbWVdKSA9PiB7XG4gICAgICAgICAgY29uc3QgW2Jhc2VUYXJnZXROYW1lLCBiYXNlRXZlbnROYW1lXSA9IGJhc2VFdmVudERhdGEuc3BsaXQoJyAnKVxuICAgICAgICAgIGNvbnN0IGJhc2VUYXJnZXROYW1lU3Vic3RyaW5nRmlyc3QgPSBiYXNlVGFyZ2V0TmFtZS5zdWJzdHJpbmcoMCwgMSlcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0xhc3QgPSBiYXNlVGFyZ2V0TmFtZS5zdWJzdHJpbmcoYmFzZVRhcmdldE5hbWUubGVuZ3RoIC0gMSlcbiAgICAgICAgICBsZXQgYmFzZVRhcmdldHMgPSBbXVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdGaXJzdCA9PT0gJ1snICYmXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0xhc3QgPT09ICddJ1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZVRhcmdldHMgPSBPYmplY3QuZW50cmllcyhiYXNlKVxuICAgICAgICAgICAgICAucmVkdWNlKChfYmFzZVRhcmdldHMsIFtiYXNlTmFtZSwgYmFzZVRhcmdldF0pID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmFzZVRhcmdldE5hbWVSZWdFeHBTdHJpbmcgPSBiYXNlVGFyZ2V0TmFtZS5zbGljZSgxLCAtMSlcbiAgICAgICAgICAgICAgICBsZXQgYmFzZVRhcmdldE5hbWVSZWdFeHAgPSBuZXcgUmVnRXhwKGJhc2VUYXJnZXROYW1lUmVnRXhwU3RyaW5nKVxuICAgICAgICAgICAgICAgIGlmKGJhc2VOYW1lLm1hdGNoKGJhc2VUYXJnZXROYW1lUmVnRXhwKSkge1xuICAgICAgICAgICAgICAgICAgX2Jhc2VUYXJnZXRzLnB1c2goYmFzZVRhcmdldClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9iYXNlVGFyZ2V0c1xuICAgICAgICAgICAgICB9LCBbXSlcbiAgICAgICAgICB9IGVsc2UgaWYoYmFzZVtiYXNlVGFyZ2V0TmFtZV0pIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzLnB1c2goYmFzZVtiYXNlVGFyZ2V0TmFtZV0pXG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBiYXNlRXZlbnRDYWxsYmFjayA9IGJhc2VDYWxsYmFja3NbYmFzZUNhbGxiYWNrTmFtZV1cbiAgICAgICAgICBpZihcbiAgICAgICAgICAgIGJhc2VFdmVudENhbGxiYWNrICYmXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFjay5uYW1lLnNwbGl0KCcgJykubGVuZ3RoID09PSAxXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFjayA9IGJhc2VFdmVudENhbGxiYWNrLmJpbmQodGhpcylcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldHMubGVuZ3RoICYmXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFja1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZVRhcmdldHNcbiAgICAgICAgICAgICAgLmZvckVhY2goKGJhc2VUYXJnZXQpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgc3dpdGNoKG1ldGhvZCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdvbic6XG4gICAgICAgICAgICAgICAgICAgICAgYmFzZVRhcmdldFttZXRob2RdKGJhc2VFdmVudE5hbWUsIGJhc2VFdmVudENhbGxiYWNrKVxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ29mZic6XG4gICAgICAgICAgICAgICAgICAgICAgYmFzZVRhcmdldFttZXRob2RdKGJhc2VFdmVudE5hbWUsIGJhc2VFdmVudENhbGxiYWNrKVxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3JcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleCdcblxuY29uc3QgUm91dGVyID0gY2xhc3MgZXh0ZW5kcyBFdmVudHMge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuYWRkV2luZG93RXZlbnRzKClcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAncm9vdCcsXG4gICAgJ2hhc2hSb3V0aW5nJyxcbiAgICAnY29udHJvbGxlcicsXG4gICAgJ3JvdXRlcydcbiAgXSB9XG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICB9KVxuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgcHJvdG9jb2woKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgfVxuICBnZXQgaG9zdG5hbWUoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgfVxuICBnZXQgcG9ydCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wb3J0IH1cbiAgZ2V0IHBhdGhuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIH1cbiAgZ2V0IHBhdGgoKSB7XG4gICAgbGV0IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZVxuICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cChbJ14nLCB0aGlzLnJvb3RdLmpvaW4oJycpKSwgJycpXG4gICAgICAuc3BsaXQoJz8nKVxuICAgICAgLnNsaWNlKDAsIDEpXG4gICAgICBbMF1cbiAgICBsZXQgZnJhZ21lbnRzID0gKFxuICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMFxuICAgICkgPyBbXVxuICAgICAgOiAoXG4gICAgICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXlxcLy8pICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9cXC8/LylcbiAgICAgICAgKSA/IFsnLyddXG4gICAgICAgICAgOiBzdHJpbmdcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICByZXR1cm4ge1xuICAgICAgZnJhZ21lbnRzOiBmcmFnbWVudHMsXG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICB9XG4gIH1cbiAgZ2V0IGhhc2goKSB7XG4gICAgbGV0IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoXG4gICAgICAuc2xpY2UoMSlcbiAgICAgIC5zcGxpdCgnPycpXG4gICAgICAuc2xpY2UoMCwgMSlcbiAgICAgIFswXVxuICAgIGxldCBmcmFnbWVudHMgPSAoXG4gICAgICBzdHJpbmcubGVuZ3RoID09PSAwXG4gICAgKSA/IFtdXG4gICAgICA6IChcbiAgICAgICAgICBzdHJpbmcubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9eXFwvLykgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL1xcLz8vKVxuICAgICAgICApID8gWycvJ11cbiAgICAgICAgICA6IHN0cmluZ1xuICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAuc3BsaXQoJy8nKVxuICAgIHJldHVybiB7XG4gICAgICBmcmFnbWVudHM6IGZyYWdtZW50cyxcbiAgICAgIHN0cmluZzogc3RyaW5nLFxuICAgIH1cbiAgfVxuICBnZXQgcGFyYW1ldGVycygpIHtcbiAgICBsZXQgc3RyaW5nXG4gICAgbGV0IGRhdGFcbiAgICBpZih3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvXFw/LykpIHtcbiAgICAgIGxldCBwYXJhbWV0ZXJzID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICAgICAgLnNwbGl0KCc/JylcbiAgICAgICAgLnNsaWNlKC0xKVxuICAgICAgICAuam9pbignJylcbiAgICAgIHN0cmluZyA9IHBhcmFtZXRlcnNcbiAgICAgIGRhdGEgPSBwYXJhbWV0ZXJzXG4gICAgICAgIC5zcGxpdCgnJicpXG4gICAgICAgIC5yZWR1Y2UoKFxuICAgICAgICAgIF9wYXJhbWV0ZXJzLFxuICAgICAgICAgIHBhcmFtZXRlclxuICAgICAgICApID0+IHtcbiAgICAgICAgICBsZXQgcGFyYW1ldGVyRGF0YSA9IHBhcmFtZXRlci5zcGxpdCgnPScpXG4gICAgICAgICAgX3BhcmFtZXRlcnNbcGFyYW1ldGVyRGF0YVswXV0gPSBwYXJhbWV0ZXJEYXRhWzFdXG4gICAgICAgICAgcmV0dXJuIF9wYXJhbWV0ZXJzXG4gICAgICAgIH0sIHt9KVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHJpbmcgPSAnJ1xuICAgICAgZGF0YSA9IHt9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9XG4gIH1cbiAgZ2V0IHJvb3QoKSB7IHJldHVybiB0aGlzLl9yb290IHx8ICcvJyB9XG4gIHNldCByb290KHJvb3QpIHsgdGhpcy5fcm9vdCA9IHJvb3QgfVxuICBnZXQgaGFzaFJvdXRpbmcoKSB7IHJldHVybiB0aGlzLl9oYXNoUm91dGluZyB8fCBmYWxzZSB9XG4gIHNldCBoYXNoUm91dGluZyhoYXNoUm91dGluZykgeyB0aGlzLl9oYXNoUm91dGluZyA9IGhhc2hSb3V0aW5nIH1cbiAgZ2V0IHJvdXRlcygpIHsgcmV0dXJuIHRoaXMuX3JvdXRlcyB9XG4gIHNldCByb3V0ZXMocm91dGVzKSB7IHRoaXMuX3JvdXRlcyA9IHJvdXRlcyB9XG4gIGdldCBjb250cm9sbGVyKCkgeyByZXR1cm4gdGhpcy5fY29udHJvbGxlciB9XG4gIHNldCBjb250cm9sbGVyKGNvbnRyb2xsZXIpIHsgdGhpcy5fY29udHJvbGxlciA9IGNvbnRyb2xsZXIgfVxuICBnZXQgbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvb3Q6IHRoaXMucm9vdCxcbiAgICAgIHBhdGg6IHRoaXMucGF0aCxcbiAgICAgIGhhc2g6IHRoaXMuaGFzaCxcbiAgICAgIHBhcmFtZXRlcnM6IHRoaXMucGFyYW1ldGVycyxcbiAgICB9XG4gIH1cbiAgbWF0Y2hSb3V0ZShyb3V0ZUZyYWdtZW50cywgbG9jYXRpb25GcmFnbWVudHMpIHtcbiAgICBsZXQgcm91dGVNYXRjaGVzID0gbmV3IEFycmF5KClcbiAgICBpZihyb3V0ZUZyYWdtZW50cy5sZW5ndGggPT09IGxvY2F0aW9uRnJhZ21lbnRzLmxlbmd0aCkge1xuICAgICAgcm91dGVNYXRjaGVzID0gcm91dGVGcmFnbWVudHNcbiAgICAgICAgLnJlZHVjZSgoX3JvdXRlTWF0Y2hlcywgcm91dGVGcmFnbWVudCwgcm91dGVGcmFnbWVudEluZGV4KSA9PiB7XG4gICAgICAgICAgbGV0IGxvY2F0aW9uRnJhZ21lbnQgPSBsb2NhdGlvbkZyYWdtZW50c1tyb3V0ZUZyYWdtZW50SW5kZXhdXG4gICAgICAgICAgaWYocm91dGVGcmFnbWVudC5tYXRjaCgvXlxcOi8pKSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2godHJ1ZSlcbiAgICAgICAgICB9IGVsc2UgaWYocm91dGVGcmFnbWVudCA9PT0gbG9jYXRpb25GcmFnbWVudCkge1xuICAgICAgICAgICAgX3JvdXRlTWF0Y2hlcy5wdXNoKHRydWUpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaChmYWxzZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yb3V0ZU1hdGNoZXNcbiAgICAgICAgfSwgW10pXG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRlTWF0Y2hlcy5wdXNoKGZhbHNlKVxuICAgIH1cbiAgICByZXR1cm4gKHJvdXRlTWF0Y2hlcy5pbmRleE9mKGZhbHNlKSA9PT0gLTEpXG4gICAgICA/IHRydWVcbiAgICAgIDogZmFsc2VcbiAgfVxuICBnZXRSb3V0ZShsb2NhdGlvbikge1xuICAgIGxldCByb3V0ZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnJvdXRlcylcbiAgICAgIC5yZWR1Y2UoKFxuICAgICAgICBfcm91dGVzLFxuICAgICAgICBbcm91dGVOYW1lLCByb3V0ZVNldHRpbmdzXSkgPT4ge1xuICAgICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IChcbiAgICAgICAgICAgIHJvdXRlTmFtZS5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICAgIHJvdXRlTmFtZS5tYXRjaCgvXlxcLy8pXG4gICAgICAgICAgKSA/IFtyb3V0ZU5hbWVdXG4gICAgICAgICAgICA6IChyb3V0ZU5hbWUubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICA/IFsnJ11cbiAgICAgICAgICAgICAgOiByb3V0ZU5hbWVcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICAgICAgICByb3V0ZVNldHRpbmdzLmZyYWdtZW50cyA9IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgICAgX3JvdXRlc1tyb3V0ZUZyYWdtZW50cy5qb2luKCcvJyldID0gcm91dGVTZXR0aW5nc1xuICAgICAgICAgIHJldHVybiBfcm91dGVzXG4gICAgICAgIH0sXG4gICAgICAgIHt9XG4gICAgICApXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMocm91dGVzKVxuICAgICAgLmZpbmQoKHJvdXRlKSA9PiB7XG4gICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IHJvdXRlLmZyYWdtZW50c1xuICAgICAgICBsZXQgbG9jYXRpb25GcmFnbWVudHMgPSAodGhpcy5oYXNoUm91dGluZylcbiAgICAgICAgICA/IGxvY2F0aW9uLmhhc2guZnJhZ21lbnRzXG4gICAgICAgICAgOiBsb2NhdGlvbi5wYXRoLmZyYWdtZW50c1xuICAgICAgICBsZXQgbWF0Y2hSb3V0ZSA9IHRoaXMubWF0Y2hSb3V0ZShcbiAgICAgICAgICByb3V0ZUZyYWdtZW50cyxcbiAgICAgICAgICBsb2NhdGlvbkZyYWdtZW50cyxcbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gbWF0Y2hSb3V0ZSA9PT0gdHJ1ZVxuICAgICAgfSlcbiAgfVxuICBwb3BTdGF0ZShldmVudCkge1xuICAgIGxldCBsb2NhdGlvbiA9IHRoaXMubG9jYXRpb25cbiAgICBsZXQgcm91dGUgPSB0aGlzLmdldFJvdXRlKGxvY2F0aW9uKVxuICAgIGxldCByb3V0ZURhdGEgPSB7XG4gICAgICByb3V0ZTogcm91dGUsXG4gICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgfVxuICAgIGlmKHJvdXRlKSB7XG4gICAgICB0aGlzLmNvbnRyb2xsZXJbcm91dGUuY2FsbGJhY2tdKHJvdXRlRGF0YSlcbiAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJywge1xuICAgICAgICBuYW1lOiAnY2hhbmdlJyxcbiAgICAgICAgZGF0YTogcm91dGVEYXRhLFxuICAgICAgfSxcbiAgICAgIHRoaXMpXG4gICAgfVxuICB9XG4gIGFkZFdpbmRvd0V2ZW50cygpIHtcbiAgICB3aW5kb3cub24oJ3BvcHN0YXRlJywgdGhpcy5wb3BTdGF0ZS5iaW5kKHRoaXMpKVxuICB9XG4gIHJlbW92ZVdpbmRvd0V2ZW50cygpIHtcbiAgICB3aW5kb3cub2ZmKCdwb3BzdGF0ZScsIHRoaXMucG9wU3RhdGUuYmluZCh0aGlzKSlcbiAgfVxuICBuYXZpZ2F0ZShwYXRoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFJvdXRlclxuIl0sIm5hbWVzIjpbIkV2ZW50VGFyZ2V0IiwicHJvdG90eXBlIiwib24iLCJhZGRFdmVudExpc3RlbmVyIiwib2ZmIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIkV2ZW50cyIsImNvbnN0cnVjdG9yIiwiX2V2ZW50cyIsImV2ZW50cyIsImdldEV2ZW50Q2FsbGJhY2tzIiwiZXZlbnROYW1lIiwiZ2V0RXZlbnRDYWxsYmFja05hbWUiLCJldmVudENhbGxiYWNrIiwibmFtZSIsImxlbmd0aCIsImdldEV2ZW50Q2FsbGJhY2tHcm91cCIsImV2ZW50Q2FsbGJhY2tzIiwiZXZlbnRDYWxsYmFja05hbWUiLCJldmVudENhbGxiYWNrR3JvdXAiLCJwdXNoIiwiYXJndW1lbnRzIiwiT2JqZWN0Iiwia2V5cyIsImVtaXQiLCJfYXJndW1lbnRzIiwiQXJyYXkiLCJmcm9tIiwic3BsaWNlIiwiZXZlbnREYXRhIiwiZXZlbnRBcmd1bWVudHMiLCJlbnRyaWVzIiwiZm9yRWFjaCIsImV2ZW50Q2FsbGJhY2tHcm91cE5hbWUiLCJkYXRhIiwiX3Jlc3BvbnNlcyIsInJlc3BvbnNlcyIsInJlc3BvbnNlIiwicmVzcG9uc2VOYW1lIiwicmVzcG9uc2VDYWxsYmFjayIsInJlcXVlc3QiLCJzbGljZSIsImNhbGwiLCJfcmVzcG9uc2VOYW1lIiwiX2NoYW5uZWxzIiwiY2hhbm5lbHMiLCJjaGFubmVsIiwiY2hhbm5lbE5hbWUiLCJDaGFubmVsIiwiVVVJRCIsInV1aWQiLCJpIiwicmFuZG9tIiwiTWF0aCIsInRvU3RyaW5nIiwiU2VydmljZSIsInNldHRpbmdzIiwib3B0aW9ucyIsInZhbGlkU2V0dGluZ3MiLCJfc2V0dGluZ3MiLCJ2YWxpZFNldHRpbmciLCJfb3B0aW9ucyIsInVybCIsInBhcmFtZXRlcnMiLCJfdXJsIiwiY29uY2F0IiwicXVlcnlTdHJpbmciLCJwYXJhbWV0ZXJTdHJpbmciLCJyZWR1Y2UiLCJwYXJhbWV0ZXJTdHJpbmdzIiwicGFyYW1ldGVyS2V5IiwicGFyYW1ldGVyVmFsdWUiLCJqb2luIiwibWV0aG9kIiwiX21ldGhvZCIsIm1vZGUiLCJfbW9kZSIsImNhY2hlIiwiX2NhY2hlIiwiY3JlZGVudGlhbHMiLCJfY3JlZGVudGlhbHMiLCJoZWFkZXJzIiwiX2hlYWRlcnMiLCJyZWRpcmVjdCIsIl9yZWRpcmVjdCIsInJlZmVycmVyUG9saWN5IiwiX3JlZmVycmVyUG9saWN5IiwiYm9keSIsIl9ib2R5IiwiZmlsZXMiLCJfZmlsZXMiLCJfcGFyYW1ldGVycyIsInByZXZpb3VzQWJvcnRDb250cm9sbGVyIiwiX3ByZXZpb3VzQWJvcnRDb250cm9sbGVyIiwiYWJvcnRDb250cm9sbGVyIiwiX2Fib3J0Q29udHJvbGxlciIsIkFib3J0Q29udHJvbGxlciIsIl9yZXNwb25zZSIsInJlc3BvbnNlRGF0YSIsIl9yZXNwb25zZURhdGEiLCJhYm9ydCIsImZldGNoIiwiZmV0Y2hPcHRpb25zIiwiX2ZldGNoT3B0aW9ucyIsImZldGNoT3B0aW9uTmFtZSIsInNpZ25hbCIsInRoZW4iLCJqc29uIiwiY29kZSIsImNhdGNoIiwiZXJyb3IiLCJmZXRjaFN5bmMiLCJNb2RlbCIsIl91dWlkIiwiYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlcyIsImJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSIsInRvZ2dsZUV2ZW50cyIsInNlcnZpY2VzIiwiX3NlcnZpY2VzIiwiX2RhdGEiLCJkZWZhdWx0cyIsIl9kZWZhdWx0cyIsImxvY2FsU3RvcmFnZSIsInN5bmMiLCJkYiIsInNldCIsIl9sb2NhbFN0b3JhZ2UiLCJzdG9yYWdlQ29udGFpbmVyIiwiX2RiIiwiZ2V0SXRlbSIsImVuZHBvaW50IiwiSlNPTiIsInN0cmluZ2lmeSIsInBhcnNlIiwic2V0SXRlbSIsInJlc2V0RXZlbnRzIiwiY2xhc3NUeXBlIiwiYmFzZU5hbWUiLCJiYXNlRXZlbnRzTmFtZSIsImJhc2VDYWxsYmFja3NOYW1lIiwiYmFzZSIsImJhc2VFdmVudHMiLCJiYXNlQ2FsbGJhY2tzIiwiYmFzZUV2ZW50RGF0YSIsImJhc2VDYWxsYmFja05hbWUiLCJiYXNlVGFyZ2V0TmFtZSIsImJhc2VFdmVudE5hbWUiLCJzcGxpdCIsImJhc2VUYXJnZXQiLCJiYXNlQ2FsbGJhY2siLCJiaW5kIiwic2V0REIiLCJrZXkiLCJ2YWx1ZSIsInVuc2V0REIiLCJzZXREYXRhUHJvcGVydHkiLCJzaWxlbnQiLCJjdXJyZW50RGF0YVByb3BlcnR5IiwiZ2V0IiwiZGVmaW5lUHJvcGVydGllcyIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiZW51bWVyYWJsZSIsImV2ZW50IiwibW9kZWwiLCJ1bnNldERhdGFQcm9wZXJ0eSIsImFzc2lnbiIsImlzQXJyYXkiLCJ1bnNldCIsIkNvbGxlY3Rpb24iLCJkZWZhdWx0SURBdHRyaWJ1dGUiLCJhZGQiLCJVdGlsaXRpZXMiLCJtb2RlbHMiLCJfbW9kZWxzIiwibW9kZWxzRGF0YSIsIl9tb2RlbCIsIm1vZGVsc0V4aXN0IiwibWFwIiwiZ2V0TW9kZWxJbmRleCIsIm1vZGVsVVVJRCIsIm1vZGVsSW5kZXgiLCJmaW5kIiwiX21vZGVsSW5kZXgiLCJyZW1vdmVNb2RlbEJ5SW5kZXgiLCJhZGRNb2RlbCIsIm1vZGVsRGF0YSIsIk1vZGVsUHJvdG90eXBlIiwibW9kZWxPcHRpb25zIiwicmVtb3ZlIiwiZmlsdGVyIiwicmVzZXQiLCJWaWV3IiwiZWxlbWVudE5hbWUiLCJfZWxlbWVudE5hbWUiLCJlbGVtZW50IiwiX2VsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJzZXRBdHRyaWJ1dGUiLCJlbGVtZW50T2JzZXJ2ZXIiLCJvYnNlcnZlIiwic3VidHJlZSIsImNoaWxkTGlzdCIsIl9lbGVtZW50T2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZWxlbWVudE9ic2VydmUiLCJIVE1MRWxlbWVudCIsIl9hdHRyaWJ1dGVzIiwidGVtcGxhdGUiLCJfdGVtcGxhdGUiLCJ1aUVsZW1lbnRzIiwiX3VpRWxlbWVudHMiLCJ1aUVsZW1lbnRFdmVudHMiLCJfdWlFbGVtZW50RXZlbnRzIiwidWlFbGVtZW50Q2FsbGJhY2tzIiwiX3VpRWxlbWVudENhbGxiYWNrcyIsInZhbHVlcyIsInVpRWxlbWVudENhbGxiYWNrIiwidWkiLCJjb250ZXh0IiwiX3VpIiwidWlFbGVtZW50TmFtZSIsInVpRWxlbWVudFF1ZXJ5IiwicXVlcnlSZXN1bHRzIiwicXVlcnlTZWxlY3RvckFsbCIsIml0ZW0iLCJEb2N1bWVudCIsIldpbmRvdyIsInJlc2V0VUkiLCJtdXRhdGlvblJlY29yZExpc3QiLCJvYnNlcnZlciIsIm11dGF0aW9uUmVjb3JkSW5kZXgiLCJtdXRhdGlvblJlY29yZCIsInR5cGUiLCJhZGRlZE5vZGVzIiwiYmluZEV2ZW50VG9FbGVtZW50IiwidGFyZ2V0VUlFbGVtZW50TmFtZSIsImlzVG9nZ2xpbmciLCJldmVudEJpbmRNZXRob2RzIiwiZXZlbnRCaW5kTWV0aG9kIiwidWlFbGVtZW50RXZlbnRTZXR0aW5ncyIsInVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lIiwidWlFbGVtZW50RXZlbnROYW1lIiwiTm9kZUxpc3QiLCJ1aUVsZW1lbnQiLCJhdXRvSW5zZXJ0IiwiaW5zZXJ0IiwicGFyZW50IiwicXVlcnlTZWxlY3RvciIsImluc2VydEFkamFjZW50RWxlbWVudCIsImF1dG9SZW1vdmUiLCJwYXJlbnRFbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJyZW5kZXIiLCJpbm5lckhUTUwiLCJDb250cm9sbGVyIiwiZW51bWJlcmFibGUiLCJiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0ZpcnN0Iiwic3Vic3RyaW5nIiwiYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0IiwiYmFzZVRhcmdldHMiLCJfYmFzZVRhcmdldHMiLCJiYXNlVGFyZ2V0TmFtZVJlZ0V4cFN0cmluZyIsImJhc2VUYXJnZXROYW1lUmVnRXhwIiwiUmVnRXhwIiwibWF0Y2giLCJiYXNlRXZlbnRDYWxsYmFjayIsIlJvdXRlciIsImFkZFdpbmRvd0V2ZW50cyIsInByb3RvY29sIiwid2luZG93IiwibG9jYXRpb24iLCJob3N0bmFtZSIsInBvcnQiLCJwYXRobmFtZSIsInBhdGgiLCJzdHJpbmciLCJyZXBsYWNlIiwicm9vdCIsImZyYWdtZW50cyIsImhhc2giLCJocmVmIiwicGFyYW1ldGVyIiwicGFyYW1ldGVyRGF0YSIsIl9yb290IiwiaGFzaFJvdXRpbmciLCJfaGFzaFJvdXRpbmciLCJyb3V0ZXMiLCJfcm91dGVzIiwiY29udHJvbGxlciIsIl9jb250cm9sbGVyIiwibWF0Y2hSb3V0ZSIsInJvdXRlRnJhZ21lbnRzIiwibG9jYXRpb25GcmFnbWVudHMiLCJyb3V0ZU1hdGNoZXMiLCJfcm91dGVNYXRjaGVzIiwicm91dGVGcmFnbWVudCIsInJvdXRlRnJhZ21lbnRJbmRleCIsImxvY2F0aW9uRnJhZ21lbnQiLCJpbmRleE9mIiwiZ2V0Um91dGUiLCJyb3V0ZU5hbWUiLCJyb3V0ZVNldHRpbmdzIiwicm91dGUiLCJwb3BTdGF0ZSIsInJvdXRlRGF0YSIsImNhbGxiYWNrIiwicmVtb3ZlV2luZG93RXZlbnRzIiwibmF2aWdhdGUiXSwibWFwcGluZ3MiOiI7Ozs7OztFQUFBQSxXQUFXLENBQUNDLFNBQVosQ0FBc0JDLEVBQXRCLEdBQTJCRixXQUFXLENBQUNDLFNBQVosQ0FBc0JD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
