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
      return ['url', 'method', 'mode', 'cache', 'credentials', 'headers', 'parameters', 'redirect', 'referrerPolicy', 'body', 'files'];
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
        this.emit('ready', data, this);
        return data;
      }).catch(error => {
        this.emit('error', {
          message: error
        }, this);
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
      return ['localStorage', 'defaults', 'services', 'serviceEvents', 'serviceCallbacks', 'sockets', 'socketEvents', 'socketCallbacks'];
    }

    get bindableEventClassPropertyTypes() {
      return ['service', 'socket'];
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
      return Object.entries(this.data).reduce((_data, _ref4) => {
        var [key, value] = _ref4;
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
          Object.entries(_arguments[0]).forEach((_ref5) => {
            var [key, value] = _ref5;
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
        Object.entries(_arguments[0]).forEach((_ref6) => {
          var [key, value] = _ref6;
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
      return Object.entries(data).reduce((_data, _ref7) => {
        var [key, value] = _ref7;

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

    emptyElement(uiElement) {
      this.ui[uiElement].innerHTML = '';
      return this;
    }

    renderElementTextContent(uiElement, textContent) {
      if (this.ui[uiElement]) this.ui[uiElement].innerHTML = textContent;
      return this;
    }

    renderElementAttribute(uiElement, attributeName) {
      if (this.ui[uiElement]) this.ui[uiElement].removeAttribute(attributeName);
      return this;
    }

    renderElementAttribute(uiElement, attributeName, attributeValue) {
      if (this.ui[uiElement]) this.ui[uiElement].setAttribute(attributeName, attributeValue);
      return this;
    }

    renderElement(uiElement, insertMethod, element) {
      if (this.ui[uiElement]) this.ui[uiElement].insertAdjacentElement(insertMethod, element);
      return this;
    }

    render() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (this.template) {
        var template = this.template(data);
        this.element.innerHTML = template;
      }

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
      if (this.hashRouting) this.addWindowEvents();
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

    hashChange(event) {
      var location = this.location;
      var route = this.getRoute(location);
      var routeData = {
        route: route,
        location: location
      };

      if (route) {
        this.emit('change', routeData, this);
      }

      return this;
    }

    addWindowEvents() {
      window.on('hashchange', this.hashChange.bind(this));
      return this;
    }

    removeWindowEvents() {
      window.off('hashchange', this.hashChange.bind(this));
      return this;
    }

    navigate() {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : String();

      if (this.hashRouting) {
        if (url === '') url = '/';
        window.location.hash = url;
      } else {
        if (url === '') url = '/';
        window.location.href = url;
      }

      return this;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxpdGllcy91dWlkLmpzIiwiLi4vLi4vc291cmNlL01WQy9TZXJ2aWNlL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Nb2RlbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29sbGVjdGlvbi9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVmlldy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29udHJvbGxlci9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvUm91dGVyL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIkV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiA9IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lclxyXG5FdmVudFRhcmdldC5wcm90b3R5cGUub2ZmID0gRXZlbnRUYXJnZXQucHJvdG90eXBlLm9mZiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lclxyXG4iLCJjbGFzcyBFdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2V2ZW50cygpIHtcclxuICAgIHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMgfHwge31cclxuICAgIHJldHVybiB0aGlzLmV2ZW50c1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpIHsgcmV0dXJuIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdIHx8IHt9IH1cclxuICBnZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gKGV2ZW50Q2FsbGJhY2submFtZS5sZW5ndGgpXHJcbiAgICAgID8gZXZlbnRDYWxsYmFjay5uYW1lXHJcbiAgICAgIDogJ2Fub255bW91c0Z1bmN0aW9uJ1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKSB7XHJcbiAgICByZXR1cm4gZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdIHx8IFtdXHJcbiAgfVxyXG4gIG9uKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaykge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5nZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja05hbWUgPSB0aGlzLmdldEV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja0dyb3VwID0gdGhpcy5nZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKVxyXG4gICAgZXZlbnRDYWxsYmFja0dyb3VwLnB1c2goZXZlbnRDYWxsYmFjaylcclxuICAgIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudENhbGxiYWNrc1xyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgb2ZmKCkge1xyXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgICAgY2FzZSAwOlxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrTmFtZSA9ICh0eXBlb2YgZXZlbnRDYWxsYmFjayA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICA/IGV2ZW50Q2FsbGJhY2tcclxuICAgICAgICAgIDogdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKSB7XHJcbiAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1bZXZlbnRDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0pLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgKSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGVtaXQoKSB7XHJcbiAgICBsZXQgX2FyZ3VtZW50cyA9IEFycmF5LmZyb20oYXJndW1lbnRzKVxyXG4gICAgbGV0IGV2ZW50TmFtZSA9IF9hcmd1bWVudHMuc3BsaWNlKDAsIDEpWzBdXHJcbiAgICBsZXQgZXZlbnREYXRhID0gX2FyZ3VtZW50cy5zcGxpY2UoMCwgMSlbMF1cclxuICAgIGxldCBldmVudEFyZ3VtZW50cyA9IF9hcmd1bWVudHMuc3BsaWNlKDApXHJcbiAgICBPYmplY3QuZW50cmllcyh0aGlzLmdldEV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSkpXHJcbiAgICAgIC5mb3JFYWNoKChbZXZlbnRDYWxsYmFja0dyb3VwTmFtZSwgZXZlbnRDYWxsYmFja0dyb3VwXSkgPT4ge1xyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgICAgICAgLmZvckVhY2goKGV2ZW50Q2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgZXZlbnRDYWxsYmFjayhcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBldmVudE5hbWUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBldmVudERhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIC4uLmV2ZW50QXJndW1lbnRzXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBFdmVudHNcclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX3Jlc3BvbnNlcygpIHtcclxuICAgIHRoaXMucmVzcG9uc2VzID0gdGhpcy5yZXNwb25zZXNcclxuICAgICAgPyB0aGlzLnJlc3BvbnNlc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZiAocmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgICB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSA9IHJlc3BvbnNlQ2FsbGJhY2tcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VdXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlcXVlc3QocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZiAodGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0pIHtcclxuICAgICAgdmFyIF9hcmd1bWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLnNsaWNlKDEpXHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSguLi5fYXJndW1lbnRzKVxyXG4gICAgfVxyXG4gIH1cclxuICBvZmYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZiAocmVzcG9uc2VOYW1lKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yICh2YXIgW19yZXNwb25zZU5hbWVdIG9mIE9iamVjdC5rZXlzKHRoaXMuX3Jlc3BvbnNlcykpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW19yZXNwb25zZU5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IENoYW5uZWwgZnJvbSAnLi9DaGFubmVsL2luZGV4J1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfY2hhbm5lbHMoKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzID0gdGhpcy5jaGFubmVsc1xyXG4gICAgICA/IHRoaXMuY2hhbm5lbHNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbHNcclxuICB9XHJcbiAgY2hhbm5lbChjaGFubmVsTmFtZSkge1xyXG4gICAgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdID0gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgID8gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgIDogbmV3IENoYW5uZWwoKVxyXG4gICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxuICBvZmYoY2hhbm5lbE5hbWUpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVVVJRCgpIHtcclxuICB2YXIgdXVpZCA9IFwiXCIsIGksIHJhbmRvbVxyXG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSB7XHJcbiAgICByYW5kb20gPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwXHJcblxyXG4gICAgaWYgKGkgPT0gOCB8fCBpID09IDEyIHx8IGkgPT0gMTYgfHwgaSA9PSAyMCkge1xyXG4gICAgICB1dWlkICs9IFwiLVwiXHJcbiAgICB9XHJcbiAgICB1dWlkICs9IChpID09IDEyID8gNCA6IChpID09IDE2ID8gKHJhbmRvbSAmIDMgfCA4KSA6IHJhbmRvbSkpLnRvU3RyaW5nKDE2KVxyXG4gIH1cclxuICByZXR1cm4gdXVpZFxyXG59XHJcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4J1xuXG5jbGFzcyBTZXJ2aWNlIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAndXJsJyxcbiAgICAnbWV0aG9kJyxcbiAgICAnbW9kZScsXG4gICAgJ2NhY2hlJyxcbiAgICAnY3JlZGVudGlhbHMnLFxuICAgICdoZWFkZXJzJyxcbiAgICAncGFyYW1ldGVycycsXG4gICAgJ3JlZGlyZWN0JyxcbiAgICAncmVmZXJyZXJQb2xpY3knLFxuICAgICdib2R5JyxcbiAgICAnZmlsZXMnLFxuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCB1cmwoKSB7XG4gICAgaWYodGhpcy5wYXJhbWV0ZXJzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsLmNvbmNhdCh0aGlzLnF1ZXJ5U3RyaW5nKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsXG4gICAgfVxuICB9XG4gIHNldCB1cmwodXJsKSB7IHRoaXMuX3VybCA9IHVybCB9XG4gIGdldCBxdWVyeVN0cmluZygpIHtcbiAgICBsZXQgcXVlcnlTdHJpbmcgPSAnJ1xuICAgIGlmKHRoaXMucGFyYW1ldGVycykge1xuICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IE9iamVjdC5lbnRyaWVzKHRoaXMucGFyYW1ldGVycylcbiAgICAgICAgLnJlZHVjZSgocGFyYW1ldGVyU3RyaW5ncywgW3BhcmFtZXRlcktleSwgcGFyYW1ldGVyVmFsdWVdKSA9PiB7XG4gICAgICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IHBhcmFtZXRlcktleS5jb25jYXQoJz0nLCBwYXJhbWV0ZXJWYWx1ZSlcbiAgICAgICAgICBwYXJhbWV0ZXJTdHJpbmdzLnB1c2gocGFyYW1ldGVyU3RyaW5nKVxuICAgICAgICAgIHJldHVybiBwYXJhbWV0ZXJTdHJpbmdzXG4gICAgICAgIH0sIFtdKVxuICAgICAgICAgIC5qb2luKCcmJylcbiAgICAgIHF1ZXJ5U3RyaW5nID0gJz8nLmNvbmNhdChwYXJhbWV0ZXJTdHJpbmcpXG4gICAgfVxuICAgIHJldHVybiBxdWVyeVN0cmluZ1xuICB9XG4gIGdldCBtZXRob2QoKSB7IHJldHVybiB0aGlzLl9tZXRob2QgfVxuICBzZXQgbWV0aG9kKG1ldGhvZCkgeyB0aGlzLl9tZXRob2QgPSBtZXRob2QgfVxuICBnZXQgbW9kZSgpIHsgcmV0dXJuIHRoaXMuX21vZGUgfVxuICBzZXQgbW9kZShtb2RlKSB7IHRoaXMuX21vZGUgPSBtb2RlIH1cbiAgZ2V0IGNhY2hlKCkgeyByZXR1cm4gdGhpcy5fY2FjaGUgfVxuICBzZXQgY2FjaGUoY2FjaGUpIHsgdGhpcy5fY2FjaGUgPSBjYWNoZSB9XG4gIGdldCBjcmVkZW50aWFscygpIHsgcmV0dXJuIHRoaXMuX2NyZWRlbnRpYWxzIH1cbiAgc2V0IGNyZWRlbnRpYWxzKGNyZWRlbnRpYWxzKSB7IHRoaXMuX2NyZWRlbnRpYWxzID0gY3JlZGVudGlhbHMgfVxuICBnZXQgaGVhZGVycygpIHsgcmV0dXJuIHRoaXMuX2hlYWRlcnMgfVxuICBzZXQgaGVhZGVycyhoZWFkZXJzKSB7IHRoaXMuX2hlYWRlcnMgPSBoZWFkZXJzIH1cbiAgZ2V0IHJlZGlyZWN0KCkgeyByZXR1cm4gdGhpcy5fcmVkaXJlY3QgfVxuICBzZXQgcmVkaXJlY3QocmVkaXJlY3QpIHsgdGhpcy5fcmVkaXJlY3QgPSByZWRpcmVjdCB9XG4gIGdldCByZWZlcnJlclBvbGljeSgpIHsgcmV0dXJuIHRoaXMuX3JlZmVycmVyUG9saWN5IH1cbiAgc2V0IHJlZmVycmVyUG9saWN5KHJlZmVycmVyUG9saWN5KSB7IHRoaXMuX3JlZmVycmVyUG9saWN5ID0gcmVmZXJyZXJQb2xpY3kgfVxuICBnZXQgYm9keSgpIHsgcmV0dXJuIHRoaXMuX2JvZHkgfVxuICBzZXQgYm9keShib2R5KSB7IHRoaXMuX2JvZHkgPSBib2R5IH1cbiAgZ2V0IGZpbGVzKCkgeyByZXR1cm4gdGhpcy5fZmlsZXMgfVxuICBzZXQgZmlsZXMoZmlsZXMpIHsgdGhpcy5fZmlsZXMgPSBmaWxlcyB9XG4gIGdldCBwYXJhbWV0ZXJzKCkgeyByZXR1cm4gdGhpcy5fcGFyYW1ldGVycyB8fCBudWxsIH1cbiAgc2V0IHBhcmFtZXRlcnMocGFyYW1ldGVycykgeyB0aGlzLl9wYXJhbWV0ZXJzID0gcGFyYW1ldGVycyB9XG4gIGdldCBwcmV2aW91c0Fib3J0Q29udHJvbGxlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fcHJldmlvdXNBYm9ydENvbnRyb2xsZXJcbiAgfVxuICBzZXQgcHJldmlvdXNBYm9ydENvbnRyb2xsZXIocHJldmlvdXNBYm9ydENvbnRyb2xsZXIpIHsgdGhpcy5fcHJldmlvdXNBYm9ydENvbnRyb2xsZXIgPSBwcmV2aW91c0Fib3J0Q29udHJvbGxlciB9XG4gIGdldCBhYm9ydENvbnRyb2xsZXIoKSB7XG4gICAgaWYoIXRoaXMuX2Fib3J0Q29udHJvbGxlcikge1xuICAgICAgdGhpcy5wcmV2aW91c0Fib3J0Q29udHJvbGxlciA9IHRoaXMuX2Fib3J0Q29udHJvbGxlclxuICAgIH1cbiAgICB0aGlzLl9hYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKClcbiAgICByZXR1cm4gdGhpcy5fYWJvcnRDb250cm9sbGVyXG4gIH1cbiAgZ2V0IHJlc3BvbnNlKCkgeyByZXR1cm4gdGhpcy5fcmVzcG9uc2UgfVxuICBzZXQgcmVzcG9uc2UocmVzcG9uc2UpIHsgdGhpcy5fcmVzcG9uc2UgPSByZXNwb25zZSB9XG4gIGdldCByZXNwb25zZURhdGEoKSB7IHJldHVybiB0aGlzLl9yZXNwb25zZURhdGEgfVxuICBzZXQgcmVzcG9uc2VEYXRhKHJlc3BvbnNlRGF0YSkgeyB0aGlzLl9yZXNwb25zZURhdGEgPSByZXNwb25zZURhdGEgfVxuICBhYm9ydCgpIHtcbiAgICB0aGlzLmFib3J0Q29udHJvbGxlci5hYm9ydCgpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBmZXRjaCgpIHtcbiAgICBjb25zdCBmZXRjaE9wdGlvbnMgPSB0aGlzLnZhbGlkU2V0dGluZ3MucmVkdWNlKChfZmV0Y2hPcHRpb25zLCBmZXRjaE9wdGlvbk5hbWUpID0+IHtcbiAgICAgIGlmKHRoaXNbZmV0Y2hPcHRpb25OYW1lXSkgX2ZldGNoT3B0aW9uc1tmZXRjaE9wdGlvbk5hbWVdID0gdGhpc1tmZXRjaE9wdGlvbk5hbWVdXG4gICAgICByZXR1cm4gX2ZldGNoT3B0aW9uc1xuICAgIH0sIHt9KVxuICAgIGZldGNoT3B0aW9ucy5zaWduYWwgPSB0aGlzLmFib3J0Q29udHJvbGxlci5zaWduYWxcbiAgICBpZih0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyKSB0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyLmFib3J0KClcbiAgICByZXR1cm4gZmV0Y2godGhpcy51cmwsIGZldGNoT3B0aW9ucylcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICB0aGlzLnJlc3BvbnNlID0gcmVzcG9uc2VcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKVxuICAgICAgfSlcbiAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgICAncmVhZHknLFxuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gZGF0YVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAgICdlcnJvcicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3IsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0aGlzLFxuICAgICAgICApXG4gICAgICAgIHJldHVybiBlcnJvclxuICAgICAgfSlcbiAgfVxuICBhc3luYyBmZXRjaFN5bmMoKSB7XG4gICAgY29uc3QgZmV0Y2hPcHRpb25zID0gdGhpcy52YWxpZFNldHRpbmdzLnJlZHVjZSgoX2ZldGNoT3B0aW9ucywgZmV0Y2hPcHRpb25OYW1lKSA9PiB7XG4gICAgICBpZih0aGlzW2ZldGNoT3B0aW9uTmFtZV0pIF9mZXRjaE9wdGlvbnNbZmV0Y2hPcHRpb25OYW1lXSA9IHRoaXNbZmV0Y2hPcHRpb25OYW1lXVxuICAgICAgcmV0dXJuIF9mZXRjaE9wdGlvbnNcbiAgICB9LCB7fSlcbiAgICBmZXRjaE9wdGlvbnMuc2lnbmFsID0gdGhpcy5hYm9ydENvbnRyb2xsZXIuc2lnbmFsXG4gICAgaWYodGhpcy5wcmV2aW91c0Fib3J0Q29udHJvbGxlcikgdGhpcy5wcmV2aW91c0Fib3J0Q29udHJvbGxlci5hYm9ydCgpXG4gICAgdGhpcy5yZXNwb25zZSA9ICBhd2FpdCBmZXRjaCh0aGlzLnVybCwgZmV0Y2hPcHRpb25zKVxuICAgIHRoaXMucmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5yZXNwb25zZS5qc29uKClcbiAgICBpZihcbiAgICAgIHRoaXMucmVzcG9uc2VEYXRhLmNvZGUgPj0gNDAwICYmXG4gICAgICB0aGlzLnJlc3BvbnNlRGF0YS5jb2RlIDw9IDQ5OVxuICAgICkge1xuICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAnZXJyb3InLFxuICAgICAgICB0aGlzLnJlc3BvbnNlRGF0YSxcbiAgICAgICAgdGhpcyxcbiAgICAgIClcbiAgICAgIHRocm93IHRoaXMucmVzcG9uc2VEYXRhXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgJ3JlYWR5JyxcbiAgICAgICAgdGhpcy5yZXNwb25zZURhdGEsXG4gICAgICAgIHRoaXMsXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnJlc3BvbnNlRGF0YVxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBTZXJ2aWNlXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleC5qcydcbmltcG9ydCB7IFVVSUQgfSBmcm9tICcuLi9VdGlsaXRpZXMvaW5kZXgnXG5cbmNvbnN0IE1vZGVsID0gY2xhc3MgZXh0ZW5kcyBFdmVudHMge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuZW1pdChcbiAgICAgICdyZWFkeScsXG4gICAgICB7fSxcbiAgICAgIHRoaXMsXG4gICAgKVxuICB9XG4gIGdldCB1dWlkKCkge1xuICAgIGlmKCF0aGlzLl91dWlkKSB0aGlzLl91dWlkID0gVVVJRCgpXG4gICAgcmV0dXJuIHRoaXMuX3V1aWRcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAnbG9jYWxTdG9yYWdlJyxcbiAgICAnZGVmYXVsdHMnLFxuICAgICdzZXJ2aWNlcycsXG4gICAgJ3NlcnZpY2VFdmVudHMnLFxuICAgICdzZXJ2aWNlQ2FsbGJhY2tzJyxcbiAgICAnc29ja2V0cycsXG4gICAgJ3NvY2tldEV2ZW50cycsXG4gICAgJ3NvY2tldENhbGxiYWNrcycsXG4gIF0gfVxuICBnZXQgYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlcygpIHsgcmV0dXJuIFtcbiAgICAnc2VydmljZScsXG4gICAgJ3NvY2tldCcsXG4gIF0gfVxuICBnZXQgc2V0dGluZ3MoKSB7IHJldHVybiB0aGlzLl9zZXR0aW5ncyB9XG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3MuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XG4gICAgICBpZihzZXR0aW5nc1t2YWxpZFNldHRpbmddKSB0aGlzW3ZhbGlkU2V0dGluZ10gPSBzZXR0aW5nc1t2YWxpZFNldHRpbmddXG4gICAgfSlcbiAgICB0aGlzLmJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXNcbiAgICAgIC5mb3JFYWNoKChiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUpID0+IHtcbiAgICAgICAgdGhpcy50b2dnbGVFdmVudHMoYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlLCAnb24nKVxuICAgICAgfSlcbiAgfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cbiAgZ2V0IHNlcnZpY2VzKCkge1xuICAgIGlmKCF0aGlzLl9zZXJ2aWNlcykgdGhpcy5fc2VydmljZXMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9zZXJ2aWNlc1xuICB9XG4gIHNldCBzZXJ2aWNlcyhzZXJ2aWNlcykgeyB0aGlzLl9zZXJ2aWNlcyA9IHNlcnZpY2VzIH1cbiAgZ2V0IGRhdGEoKSB7XG4gICAgaWYoIXRoaXMuX2RhdGEpIHRoaXMuX2RhdGEgPSB7fVxuICAgIHJldHVybiB0aGlzLl9kYXRhXG4gIH1cbiAgZ2V0IGRlZmF1bHRzKCkge1xuICAgIGlmKCF0aGlzLl9kZWZhdWx0cykgdGhpcy5fZGVmYXVsdHMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9kZWZhdWx0c1xuICB9XG4gIHNldCBkZWZhdWx0cyhkZWZhdWx0cykge1xuICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlLnN5bmMgPT09IHRydWUpIHtcbiAgICAgIGlmKE9iamVjdC5lbnRyaWVzKHRoaXMuZGIpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLl9kZWZhdWx0cyA9IGRlZmF1bHRzXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9kZWZhdWx0cyA9IHRoaXMuZGJcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgIH1cbiAgICB0aGlzLnNldCh0aGlzLmRlZmF1bHRzKVxuICB9XG4gIGdldCBsb2NhbFN0b3JhZ2UoKSB7IHJldHVybiB0aGlzLl9sb2NhbFN0b3JhZ2UgfHwge30gfVxuICBzZXQgbG9jYWxTdG9yYWdlKGxvY2FsU3RvcmFnZSkgeyB0aGlzLl9sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UgfVxuICBnZXQgc3RvcmFnZUNvbnRhaW5lcigpIHsgcmV0dXJuIHt9IH1cbiAgZ2V0IGRiKCkgeyByZXR1cm4gdGhpcy5fZGIgfVxuICBnZXQgX2RiKCkge1xuICAgIGxldCBkYiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KSB8fCBKU09OLnN0cmluZ2lmeSh0aGlzLnN0b3JhZ2VDb250YWluZXIpXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGIpXG4gIH1cbiAgc2V0IF9kYihkYikge1xuICAgIGRiID0gSlNPTi5zdHJpbmdpZnkoZGIpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQsIGRiKVxuICB9XG4gIHJlc2V0RXZlbnRzKGNsYXNzVHlwZSkge1xuICAgIFtcbiAgICAgICdvZmYnLFxuICAgICAgJ29uJ1xuICAgIF0uZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZClcbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKSB7XG4gICAgY29uc3QgYmFzZU5hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdzJylcbiAgICBjb25zdCBiYXNlRXZlbnRzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrc05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKVxuICAgIGNvbnN0IGJhc2UgPSB0aGlzW2Jhc2VOYW1lXSB8fCB7fVxuICAgIGNvbnN0IGJhc2VFdmVudHMgPSB0aGlzW2Jhc2VFdmVudHNOYW1lXSB8fCB7fVxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3MgPSB0aGlzW2Jhc2VDYWxsYmFja3NOYW1lXSB8fCB7fVxuICAgIGlmKFxuICAgICAgT2JqZWN0LnZhbHVlcyhiYXNlKS5sZW5ndGggJiZcbiAgICAgIE9iamVjdC52YWx1ZXMoYmFzZUV2ZW50cykubGVuZ3RoICYmXG4gICAgICBPYmplY3QudmFsdWVzKGJhc2VDYWxsYmFja3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgT2JqZWN0LmVudHJpZXMoYmFzZUV2ZW50cylcbiAgICAgICAgLmZvckVhY2goKFtiYXNlRXZlbnREYXRhLCBiYXNlQ2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IFtiYXNlVGFyZ2V0TmFtZSwgYmFzZUV2ZW50TmFtZV0gPSBiYXNlRXZlbnREYXRhLnNwbGl0KCcgJylcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0ZpcnN0ID0gYmFzZVRhcmdldE5hbWUuc3Vic3RyaW5nKDAsIDEpXG4gICAgICAgICAgY29uc3QgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0ID0gYmFzZVRhcmdldE5hbWUuc3Vic3RyaW5nKGJhc2VUYXJnZXROYW1lLmxlbmd0aCAtIDEpXG4gICAgICAgICAgbGV0IGJhc2VUYXJnZXRzID0gW11cbiAgICAgICAgICBpZihcbiAgICAgICAgICAgIGJhc2VUYXJnZXROYW1lU3Vic3RyaW5nRmlyc3QgPT09ICdbJyAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0ID09PSAnXSdcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzID0gT2JqZWN0LmVudHJpZXMoYmFzZSlcbiAgICAgICAgICAgICAgLnJlZHVjZSgoX2Jhc2VUYXJnZXRzLCBbYmFzZU5hbWUsIGJhc2VUYXJnZXRdKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGJhc2VUYXJnZXROYW1lUmVnRXhwU3RyaW5nID0gYmFzZVRhcmdldE5hbWUuc2xpY2UoMSwgLTEpXG4gICAgICAgICAgICAgICAgbGV0IGJhc2VUYXJnZXROYW1lUmVnRXhwID0gbmV3IFJlZ0V4cChiYXNlVGFyZ2V0TmFtZVJlZ0V4cFN0cmluZylcbiAgICAgICAgICAgICAgICBpZihiYXNlTmFtZS5tYXRjaChiYXNlVGFyZ2V0TmFtZVJlZ0V4cCkpIHtcbiAgICAgICAgICAgICAgICAgIF9iYXNlVGFyZ2V0cy5wdXNoKGJhc2VUYXJnZXQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBfYmFzZVRhcmdldHNcbiAgICAgICAgICAgICAgfSwgW10pXG4gICAgICAgICAgfSBlbHNlIGlmKGJhc2VbYmFzZVRhcmdldE5hbWVdKSB7XG4gICAgICAgICAgICBiYXNlVGFyZ2V0cy5wdXNoKGJhc2VbYmFzZVRhcmdldE5hbWVdKVxuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgYmFzZUV2ZW50Q2FsbGJhY2sgPSBiYXNlQ2FsbGJhY2tzW2Jhc2VDYWxsYmFja05hbWVdXG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFjayAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2submFtZS5zcGxpdCgnICcpLmxlbmd0aCA9PT0gMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2sgPSBiYXNlRXZlbnRDYWxsYmFjay5iaW5kKHRoaXMpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWUgJiZcbiAgICAgICAgICAgIGJhc2VFdmVudE5hbWUgJiZcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzLmxlbmd0aCAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2tcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzXG4gICAgICAgICAgICAgIC5mb3JFYWNoKChiYXNlVGFyZ2V0KSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIHN3aXRjaChtZXRob2QpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnb24nOlxuICAgICAgICAgICAgICAgICAgICAgIGJhc2VUYXJnZXRbbWV0aG9kXShiYXNlRXZlbnROYW1lLCBiYXNlRXZlbnRDYWxsYmFjaylcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdvZmYnOlxuICAgICAgICAgICAgICAgICAgICAgIGJhc2VUYXJnZXRbbWV0aG9kXShiYXNlRXZlbnROYW1lLCBiYXNlRXZlbnRDYWxsYmFjaylcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREQigpIHtcbiAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHZhciBfYXJndW1lbnRzID0gT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKVxuICAgICAgICBfYXJndW1lbnRzLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGxldCB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgdGhpcy5fZGIgPSBkYlxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXREQigpIHtcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBkZWxldGUgdGhpcy5fZGJcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBkZWxldGUgZGJba2V5XVxuICAgICAgICB0aGlzLl9kYiA9IGRiXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUsIHNpbGVudCkge1xuICAgIGNvbnN0IGN1cnJlbnREYXRhUHJvcGVydHkgPSB0aGlzLmRhdGFba2V5XVxuICAgIGlmKCFzaWxlbnQpIHtcbiAgICAgIHRoaXMuZW1pdCgnYmVmb3JlU2V0Jy5jb25jYXQoJzonLCBrZXkpLCB7XG4gICAgICAgIGtleToga2V5LFxuICAgICAgICB2YWx1ZTogdGhpcy5nZXQoa2V5KSxcbiAgICAgIH0sIHtcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIH0sIHRoaXMpXG4gICAgfVxuICAgIGlmKCFjdXJyZW50RGF0YVByb3BlcnR5KSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLmRhdGEsIHtcbiAgICAgICAgWydfJy5jb25jYXQoa2V5KV06IHtcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIFtrZXldOiB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpc1snXycuY29uY2F0KGtleSldIH0sXG4gICAgICAgICAgc2V0KHZhbHVlKSB7IHRoaXNbJ18nLmNvbmNhdChrZXkpXSA9IHZhbHVlIH1cbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuZGF0YVtrZXldID0gdmFsdWVcbiAgICBpZihjdXJyZW50RGF0YVByb3BlcnR5IGluc3RhbmNlb2YgTW9kZWwpIHtcbiAgICAgIGNvbnN0IGVtaXQgPSAobmFtZSwgZGF0YSwgbW9kZWwpID0+IHRoaXMuZW1pdChuYW1lLCBkYXRhLCBtb2RlbClcbiAgICAgIHRoaXMuZGF0YVtrZXldXG4gICAgICAgIC5vbignYmVmb3JlU2V0JywgdGhpcy5lbWl0KGV2ZW50Lm5hbWUsIGV2ZW50LmRhdGEsIG1vZGVsKSlcbiAgICAgICAgLm9uKCdzZXQnLCB0aGlzLmVtaXQoZXZlbnQubmFtZSwgZXZlbnQuZGF0YSwgbW9kZWwpKVxuICAgICAgICAub24oJ2JlZm9yZVVuc2V0JywgdGhpcy5lbWl0KGV2ZW50Lm5hbWUsIGV2ZW50LmRhdGEsIG1vZGVsKSlcbiAgICAgICAgLm9uKCd1bnNldCcsIHRoaXMuZW1pdChldmVudC5uYW1lLCBldmVudC5kYXRhLCBtb2RlbCkpXG4gICAgfVxuICAgIGlmKCFzaWxlbnQpIHtcbiAgICAgIHRoaXMuZW1pdCgnc2V0Jy5jb25jYXQoJzonLCBrZXkpLCB7XG4gICAgICAgIGtleToga2V5LFxuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICB9LCB0aGlzKVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0RGF0YVByb3BlcnR5KGtleSwgc2lsZW50KSB7XG4gICAgaWYoIXNpbGVudCkge1xuICAgICAgdGhpcy5lbWl0KCdiZWZvcmVVbnNldCcuY29uY2F0KCc6JywgYXJndW1lbnRzWzBdKSwgdGhpcylcbiAgICB9XG4gICAgaWYodGhpcy5kYXRhW2tleV0pIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmRhdGFba2V5XVxuICAgIH1cbiAgICBpZighc2lsZW50KSB7XG4gICAgICB0aGlzLmVtaXQoJ3Vuc2V0Jy5jb25jYXQoJzonLCBhcmd1bWVudHNbMF0pLCB0aGlzKVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGdldCgpIHtcbiAgICBpZihhcmd1bWVudHNbMF0pIHJldHVybiB0aGlzLmRhdGFbYXJndW1lbnRzWzBdXVxuICAgIHJldHVybiBPYmplY3QuZW50cmllcyh0aGlzLmRhdGEpXG4gICAgICAucmVkdWNlKChfZGF0YSwgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIF9kYXRhW2tleV0gPSB2YWx1ZVxuICAgICAgICByZXR1cm4gX2RhdGFcbiAgICAgIH0sIHt9KVxuICB9XG4gIHNldCgpIHtcbiAgICBjb25zdCBfYXJndW1lbnRzID0gQXJyYXkuZnJvbShhcmd1bWVudHMpXG4gICAgdmFyIGtleSwgdmFsdWUsIHNpbGVudFxuICAgIGlmKF9hcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICBrZXkgPSBfYXJndW1lbnRzWzBdXG4gICAgICB2YWx1ZSA9IF9hcmd1bWVudHNbMV1cbiAgICAgIHNpbGVudCA9IF9hcmd1bWVudHNbMl1cbiAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgnYmVmb3JlU2V0JywgdGhpcy5kYXRhLCBPYmplY3QuYXNzaWduKFxuICAgICAgICB7fSxcbiAgICAgICAgdGhpcy5kYXRhLFxuICAgICAgICB7XG4gICAgICAgICAgW2tleV06IHZhbHVlLFxuICAgICAgICB9LFxuICAgICAgKSwgdGhpcylcbiAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUsIHNpbGVudClcbiAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgnc2V0JywgdGhpcy5kYXRhLCB0aGlzKVxuICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHRoaXMuc2V0REIoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pXG4gICAgfSBlbHNlIGlmKF9hcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICBpZihcbiAgICAgICAgdHlwZW9mIF9hcmd1bWVudHNbMF0gPT09ICdvYmplY3QnICYmXG4gICAgICAgIHR5cGVvZiBfYXJndW1lbnRzWzFdID09PSAnYm9vbGVhbidcbiAgICAgICkge1xuICAgICAgICBzaWxlbnQgPSBfYXJndW1lbnRzWzFdXG4gICAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgnYmVmb3JlU2V0JywgdGhpcy5kYXRhLCBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIHRoaXMuZGF0YSxcbiAgICAgICAgICBfYXJndW1lbnRzWzBdLFxuICAgICAgICApLCB0aGlzKVxuICAgICAgICBPYmplY3QuZW50cmllcyhfYXJndW1lbnRzWzBdKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlLCBzaWxlbnQpXG4gICAgICAgIH0pXG4gICAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgnc2V0JywgdGhpcy5kYXRhLCB0aGlzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCdiZWZvcmVTZXQnLCB0aGlzLmRhdGEsIE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAge30sXG4gICAgICAgICAgdGhpcy5kYXRhLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFtfYXJndW1lbnRzWzBdXTogX2FyZ3VtZW50c1sxXSxcbiAgICAgICAgICB9LFxuICAgICAgICApLCB0aGlzKVxuICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShfYXJndW1lbnRzWzBdLCBfYXJndW1lbnRzWzFdKVxuICAgICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ3NldCcsIHRoaXMuZGF0YSwgdGhpcylcbiAgICAgIH1cbiAgICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KSB0aGlzLnNldERCKF9hcmd1bWVudHNbMF0sIF9hcmd1bWVudHNbMV0pXG4gICAgfSBlbHNlIGlmKFxuICAgICAgX2FyZ3VtZW50cy5sZW5ndGggPT09IDEgJiZcbiAgICAgICFBcnJheS5pc0FycmF5KF9hcmd1bWVudHNbMF0pICYmXG4gICAgICB0eXBlb2YgX2FyZ3VtZW50c1swXSA9PT0gJ29iamVjdCdcbiAgICApIHtcbiAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgnYmVmb3JlU2V0JywgdGhpcy5kYXRhLCBPYmplY3QuYXNzaWduKFxuICAgICAgICB7fSxcbiAgICAgICAgdGhpcy5kYXRhLFxuICAgICAgICBfYXJndW1lbnRzWzBdLFxuICAgICAgKSwgdGhpcylcbiAgICAgIE9iamVjdC5lbnRyaWVzKF9hcmd1bWVudHNbMF0pLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgdGhpcy5zZXREQihrZXksIHZhbHVlKVxuICAgICAgfSlcbiAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgnc2V0JywgdGhpcy5kYXRhLCB0aGlzKVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0KCkge1xuICAgIGxldCBzaWxlbnRcbiAgICBpZihcbiAgICAgIGFyZ3VtZW50cy5sZW5ndGggPT09IDJcbiAgICApIHtcbiAgICAgIHNpbGVudCA9IGFyZ3VtZW50c1sxXVxuICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCdiZWZvcmVVbnNldCcsIHRoaXMuZGF0YSwgdGhpcylcbiAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoYXJndW1lbnRzWzBdLCBzaWxlbnQpXG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ3Vuc2V0JywgdGhpcylcbiAgICB9IGVsc2UgaWYoXG4gICAgICBhcmd1bWVudHMubGVuZ3RoID09PSAxXG4gICAgKSB7XG4gICAgICBpZih0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgc2lsZW50ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgnYmVmb3JlVW5zZXQnLCB0aGlzLmRhdGEsIHRoaXMpXG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuZGF0YSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXksIHNpbGVudClcbiAgICAgICAgfSlcbiAgICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCd1bnNldCcsIHRoaXMpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgnYmVmb3JlVW5zZXQnLCB0aGlzLmRhdGEsIHRoaXMpXG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmRhdGEpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgIH0pXG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ3Vuc2V0JywgdGhpcylcbiAgICB9XG4gICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHRoaXMudW5zZXREQihrZXkpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBwYXJzZShkYXRhID0gdGhpcy5kYXRhKSB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKGRhdGEpLnJlZHVjZSgoX2RhdGEsIFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgaWYodmFsdWUgaW5zdGFuY2VvZiBNb2RlbCkge1xuICAgICAgICBfZGF0YVtrZXldID0gdmFsdWUucGFyc2UoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2RhdGFba2V5XSA9IHZhbHVlXG4gICAgICB9XG4gICAgICByZXR1cm4gX2RhdGFcbiAgICB9LCB7fSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNb2RlbFxuIiwiaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4uL1V0aWxpdGllcy9pbmRleC5qcydcclxuaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXguanMnXHJcbmltcG9ydCBNb2RlbCBmcm9tICcuLi9Nb2RlbC9pbmRleC5qcydcclxuXHJcbmNsYXNzIENvbGxlY3Rpb24gZXh0ZW5kcyBFdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXHJcbiAgfVxyXG4gIGdldCB2YWxpZFNldHRpbmdzKCkgeyByZXR1cm4gW1xyXG4gICAgJ2lkQXR0cmlidXRlJyxcclxuICAgICdtb2RlbCcsXHJcbiAgICAnbW9kZWxPcHRpb25zJyxcclxuICAgICdkZWZhdWx0cycsXHJcbiAgICAnc2VydmljZXMnLFxyXG4gICAgJ3NlcnZpY2VFdmVudHMnLFxyXG4gICAgJ3NlcnZpY2VDYWxsYmFja3MnLFxyXG4gICAgJ2xvY2FsU3RvcmFnZSdcclxuICBdIH1cclxuICBnZXQgYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlcygpIHsgcmV0dXJuIFtcclxuICAgICdzZXJ2aWNlJ1xyXG4gIF0gfVxyXG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cclxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcclxuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcclxuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcclxuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxyXG4gICAgfSlcclxuICAgIHRoaXMuYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlc1xyXG4gICAgICAuZm9yRWFjaCgoYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlKSA9PiB7XHJcbiAgICAgICAgdGhpcy50b2dnbGVFdmVudHMoYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlLCAnb24nKVxyXG4gICAgICB9KVxyXG4gIH1cclxuICBnZXQgb3B0aW9ucygpIHtcclxuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cclxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXHJcbiAgfVxyXG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxyXG4gIGdldCBzdG9yYWdlQ29udGFpbmVyKCkgeyByZXR1cm4gW10gfVxyXG4gIGdldCBkZWZhdWx0SURBdHRyaWJ1dGUoKSB7IHJldHVybiAnX2lkJyB9XHJcbiAgZ2V0IGRlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5fZGVmYXVsdHMgfVxyXG4gIHNldCBkZWZhdWx0cyhkZWZhdWx0cykge1xyXG4gICAgdGhpcy5fZGVmYXVsdHMgPSBkZWZhdWx0c1xyXG4gICAgdGhpcy5hZGQoZGVmYXVsdHMpXHJcbiAgfVxyXG4gIGdldCB1dWlkKCkge1xyXG4gICAgaWYoIXRoaXMuX3V1aWQpIHRoaXMuX3V1aWQgPSBVdGlsaXRpZXMuVVVJRCgpXHJcbiAgICByZXR1cm4gdGhpcy5fdXVpZFxyXG4gIH1cclxuICBnZXQgbW9kZWxzKCkge1xyXG4gICAgdGhpcy5fbW9kZWxzID0gdGhpcy5fbW9kZWxzIHx8IHRoaXMuc3RvcmFnZUNvbnRhaW5lclxyXG4gICAgcmV0dXJuIHRoaXMuX21vZGVsc1xyXG4gIH1cclxuICBzZXQgbW9kZWxzKG1vZGVsc0RhdGEpIHsgdGhpcy5fbW9kZWxzID0gbW9kZWxzRGF0YSB9XHJcbiAgZ2V0IG1vZGVsKCkgeyByZXR1cm4gdGhpcy5fbW9kZWwgfVxyXG4gIHNldCBtb2RlbChtb2RlbCkgeyB0aGlzLl9tb2RlbCA9IG1vZGVsIH1cclxuICBnZXQgbG9jYWxTdG9yYWdlKCkgeyByZXR1cm4gdGhpcy5fbG9jYWxTdG9yYWdlIH1cclxuICBzZXQgbG9jYWxTdG9yYWdlKGxvY2FsU3RvcmFnZSkgeyB0aGlzLl9sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UgfVxyXG4gIGdldCBkYXRhKCkgeyByZXR1cm4gdGhpcy5fZGF0YSB9XHJcbiAgZ2V0IGRhdGEoKSB7XHJcbiAgICBjb25zdCBtb2RlbHNFeGlzdCA9IChPYmplY3Qua2V5cyh0aGlzLm1vZGVscykubGVuZ3RoKVxyXG4gICAgICA/IHRydWVcclxuICAgICAgOiBmYWxzZVxyXG4gICAgcmV0dXJuIChtb2RlbHNFeGlzdClcclxuICAgICAgPyB0aGlzLm1vZGVsc1xyXG4gICAgICAgIC5tYXAoKG1vZGVsKSA9PiBtb2RlbC5wYXJzZSgpKVxyXG4gICAgICA6IFtdXHJcbiAgfVxyXG4gIGdldCBkYigpIHsgcmV0dXJuIHRoaXMuX2RiIH1cclxuICBnZXQgZGIoKSB7XHJcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgfHwgSlNPTi5zdHJpbmdpZnkodGhpcy5zdG9yYWdlQ29udGFpbmVyKVxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGIpXHJcbiAgfVxyXG4gIHNldCBkYihkYikge1xyXG4gICAgZGIgPSBKU09OLnN0cmluZ2lmeShkYilcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcclxuICB9XHJcbiAgcmVzZXRFdmVudHMoY2xhc3NUeXBlKSB7XHJcbiAgICBbXHJcbiAgICAgICdvZmYnLFxyXG4gICAgICAnb24nXHJcbiAgICBdLmZvckVhY2goKG1ldGhvZCkgPT4ge1xyXG4gICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZClcclxuICAgIH0pXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICB0b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpIHtcclxuICAgIGNvbnN0IGJhc2VOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgncycpXHJcbiAgICBjb25zdCBiYXNlRXZlbnRzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXHJcbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXHJcbiAgICBjb25zdCBiYXNlID0gdGhpc1tiYXNlTmFtZV1cclxuICAgIGNvbnN0IGJhc2VFdmVudHMgPSB0aGlzW2Jhc2VFdmVudHNOYW1lXVxyXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrcyA9IHRoaXNbYmFzZUNhbGxiYWNrc05hbWVdXHJcbiAgICBpZihcclxuICAgICAgYmFzZSAmJlxyXG4gICAgICBiYXNlRXZlbnRzICYmXHJcbiAgICAgIGJhc2VDYWxsYmFja3NcclxuICAgICkge1xyXG4gICAgICBPYmplY3QuZW50cmllcyhiYXNlRXZlbnRzKVxyXG4gICAgICAgIC5mb3JFYWNoKChbYmFzZUV2ZW50RGF0YSwgYmFzZUNhbGxiYWNrTmFtZV0pID0+IHtcclxuICAgICAgICAgIGxldCBbYmFzZVRhcmdldE5hbWUsIGJhc2VFdmVudE5hbWVdID0gYmFzZUV2ZW50RGF0YS5zcGxpdCgnICcpXHJcbiAgICAgICAgICBsZXQgYmFzZVRhcmdldCA9IGJhc2VbYmFzZVRhcmdldE5hbWVdXHJcbiAgICAgICAgICBsZXQgYmFzZUNhbGxiYWNrID0gYmFzZUNhbGxiYWNrc1tiYXNlQ2FsbGJhY2tOYW1lXVxyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIGJhc2VDYWxsYmFjayAmJlxyXG4gICAgICAgICAgICBiYXNlQ2FsbGJhY2submFtZS5zcGxpdCgnICcpLmxlbmd0aCA9PT0gMVxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGJhc2VDYWxsYmFjayA9IGJhc2VDYWxsYmFjay5iaW5kKHRoaXMpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWUgJiZcclxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxyXG4gICAgICAgICAgICBiYXNlVGFyZ2V0ICYmXHJcbiAgICAgICAgICAgIGJhc2VDYWxsYmFja1xyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgYmFzZVRhcmdldFttZXRob2RdKGJhc2VFdmVudE5hbWUsIGJhc2VDYWxsYmFjaylcclxuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge31cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgZ2V0TW9kZWxJbmRleChtb2RlbFVVSUQpIHtcclxuICAgIGxldCBtb2RlbEluZGV4XHJcbiAgICB0aGlzLl9tb2RlbHNcclxuICAgICAgLmZpbmQoKF9tb2RlbCwgX21vZGVsSW5kZXgpID0+IHtcclxuICAgICAgICBpZihfbW9kZWwgIT09IG51bGwpIHtcclxuICAgICAgICAgIGlmKFxyXG4gICAgICAgICAgICBfbW9kZWwgaW5zdGFuY2VvZiBNb2RlbCAmJlxyXG4gICAgICAgICAgICBfbW9kZWwuX3V1aWQgPT09IG1vZGVsVVVJRFxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIG1vZGVsSW5kZXggPSBfbW9kZWxJbmRleFxyXG4gICAgICAgICAgICByZXR1cm4gX21vZGVsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgcmV0dXJuIG1vZGVsSW5kZXhcclxuICB9XHJcbiAgcmVtb3ZlTW9kZWxCeUluZGV4KG1vZGVsSW5kZXgpIHtcclxuICAgIGxldCBtb2RlbCA9IHRoaXMuX21vZGVscy5zcGxpY2UobW9kZWxJbmRleCwgMSwgbnVsbClcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ3JlbW92ZTptb2RlbCcsXHJcbiAgICAgIG1vZGVsWzBdLnBhcnNlKCksXHJcbiAgICAgIHRoaXMsXHJcbiAgICAgIG1vZGVsWzBdXHJcbiAgICApXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBhZGRNb2RlbChtb2RlbERhdGEpIHtcclxuICAgIGxldCBtb2RlbFxyXG4gICAgaWYobW9kZWxEYXRhIGluc3RhbmNlb2YgTW9kZWwpIHtcclxuICAgICAgbW9kZWwgPSBtb2RlbERhdGFcclxuICAgIH0gZWxzZSBpZihcclxuICAgICAgdGhpcy5tb2RlbFxyXG4gICAgKSB7XHJcbiAgICAgIGNvbnN0IE1vZGVsUHJvdG90eXBlID0gdGhpcy5tb2RlbFxyXG4gICAgICBtb2RlbCA9IG5ldyBNb2RlbFByb3RvdHlwZSh7XHJcbiAgICAgICAgZGVmYXVsdHM6IG1vZGVsRGF0YSxcclxuICAgICAgfSwgdGhpcy5tb2RlbE9wdGlvbnMpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtb2RlbCA9IG5ldyBNb2RlbCh7XHJcbiAgICAgICAgZGVmYXVsdHM6IG1vZGVsRGF0YVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgbW9kZWwub24oXHJcbiAgICAgICdzZXQnLFxyXG4gICAgICAoZXZlbnQsIF9tb2RlbCkgPT4gdGhpcy5lbWl0KFxyXG4gICAgICAgICdjaGFuZ2U6bW9kZWwnLFxyXG4gICAgICAgIHRoaXMucGFyc2UoKSxcclxuICAgICAgICB0aGlzLFxyXG4gICAgICAgIF9tb2RlbCxcclxuICAgICAgKSxcclxuICAgIClcclxuICAgIHRoaXMubW9kZWxzLnB1c2gobW9kZWwpXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdhZGQnLFxyXG4gICAgICBtb2RlbC5wYXJzZSgpLFxyXG4gICAgICB0aGlzLFxyXG4gICAgICBtb2RlbFxyXG4gICAgKVxyXG4gICAgcmV0dXJuIG1vZGVsXHJcbiAgfVxyXG4gIGFkZChtb2RlbERhdGEpIHtcclxuICAgIGlmKEFycmF5LmlzQXJyYXkobW9kZWxEYXRhKSkge1xyXG4gICAgICBtb2RlbERhdGFcclxuICAgICAgICAuZm9yRWFjaCgobW9kZWwpID0+IHRoaXMuYWRkTW9kZWwobW9kZWwpKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hZGRNb2RlbChtb2RlbERhdGEpXHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy5kYiA9IHRoaXMuZGF0YVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAnY2hhbmdlJyxcclxuICAgICAgdGhpcy5wYXJzZSgpLFxyXG4gICAgICB0aGlzXHJcbiAgICApXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICByZW1vdmUobW9kZWxEYXRhKSB7XHJcbiAgICBpZihcclxuICAgICAgIUFycmF5LmlzQXJyYXkobW9kZWxEYXRhKSAmJlxyXG4gICAgICB0eXBlb2YgbW9kZWxEYXRhID09PSAnb2JqZWN0J1xyXG4gICAgKSB7XHJcbiAgICAgIHZhciBtb2RlbEluZGV4ID0gdGhpcy5nZXRNb2RlbEluZGV4KG1vZGVsRGF0YS51dWlkKVxyXG4gICAgICB0aGlzLnJlbW92ZU1vZGVsQnlJbmRleChtb2RlbEluZGV4KVxyXG4gICAgfSBlbHNlIGlmKEFycmF5LmlzQXJyYXkobW9kZWxEYXRhKSkge1xyXG4gICAgICBtb2RlbERhdGFcclxuICAgICAgICAuZm9yRWFjaCgobW9kZWwpID0+IHtcclxuICAgICAgICAgIHZhciBtb2RlbEluZGV4ID0gdGhpcy5nZXRNb2RlbEluZGV4KG1vZGVsLnV1aWQpXHJcbiAgICAgICAgICB0aGlzLnJlbW92ZU1vZGVsQnlJbmRleChtb2RlbEluZGV4KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICB0aGlzLm1vZGVscyA9IHRoaXMubW9kZWxzXHJcbiAgICAgIC5maWx0ZXIoKG1vZGVsKSA9PiBtb2RlbCAhPT0gbnVsbClcclxuICAgIGlmKHRoaXMuX2xvY2FsU3RvcmFnZSkgdGhpcy5kYiA9IHRoaXMuZGF0YVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAncmVtb3ZlJyxcclxuICAgICAgdGhpcy5wYXJzZSgpLFxyXG4gICAgICB0aGlzXHJcbiAgICApXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICByZXNldCgpIHtcclxuICAgIHRoaXMucmVtb3ZlKHRoaXMuX21vZGVscylcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHBhcnNlKGRhdGEpIHtcclxuICAgIGRhdGEgPSBkYXRhIHx8IHRoaXMuZGF0YSB8fCB0aGlzLnN0b3JhZ2VDb250YWluZXJcclxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ29sbGVjdGlvblxyXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleC5qcydcblxuY2xhc3MgVmlldyBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ2F0dHJpYnV0ZXMnLFxuICAgICdlbGVtZW50TmFtZScsXG4gICAgJ2VsZW1lbnQnLFxuICAgICdpbnNlcnQnLFxuICAgICd0ZW1wbGF0ZScsXG4gICAgJ3VpRWxlbWVudHMnLFxuICAgICd1aUVsZW1lbnRFdmVudHMnLFxuICAgICd1aUVsZW1lbnRDYWxsYmFja3MnLFxuICAgICdyZW5kZXInXG4gIF0gfVxuICBnZXQgc2V0dGluZ3MoKSB7IHJldHVybiB0aGlzLl9zZXR0aW5ncyB9XG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3MuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XG4gICAgICBpZihzZXR0aW5nc1t2YWxpZFNldHRpbmddKSB0aGlzW3ZhbGlkU2V0dGluZ10gPSBzZXR0aW5nc1t2YWxpZFNldHRpbmddXG4gICAgfSlcbiAgfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cbiAgZ2V0IGVsZW1lbnROYW1lKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudE5hbWUgfVxuICBzZXQgZWxlbWVudE5hbWUoZWxlbWVudE5hbWUpIHsgdGhpcy5fZWxlbWVudE5hbWUgPSBlbGVtZW50TmFtZSB9XG4gIGdldCBlbGVtZW50KCkge1xuICAgIGlmKCF0aGlzLl9lbGVtZW50KSB7XG4gICAgICB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLmVsZW1lbnROYW1lKVxuICAgICAgT2JqZWN0LmVudHJpZXModGhpcy5hdHRyaWJ1dGVzKS5mb3JFYWNoKChbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0pID0+IHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSlcbiAgICAgIH0pXG4gICAgICB0aGlzLmVsZW1lbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudCwge1xuICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFxuICB9XG4gIGdldCBlbGVtZW50T2JzZXJ2ZXIoKSB7XG4gICAgdGhpcy5fZWxlbWVudE9ic2VydmVyID0gdGhpcy5fZWxlbWVudE9ic2VydmVyIHx8IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuICAgICAgdGhpcy5lbGVtZW50T2JzZXJ2ZS5iaW5kKHRoaXMpXG4gICAgKVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgfVxuICBzZXQgZWxlbWVudChlbGVtZW50KSB7XG4gICAgaWYoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gZWxlbWVudFxuICB9XG4gIGdldCBhdHRyaWJ1dGVzKCkgeyByZXR1cm4gdGhpcy5fYXR0cmlidXRlcyB8fCB7fSB9XG4gIHNldCBhdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHsgdGhpcy5fYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXMgfVxuICBnZXQgdGVtcGxhdGUoKSB7IHJldHVybiB0aGlzLl90ZW1wbGF0ZSB9XG4gIHNldCB0ZW1wbGF0ZSh0ZW1wbGF0ZSkgeyB0aGlzLl90ZW1wbGF0ZSA9IHRlbXBsYXRlIH1cbiAgZ2V0IHVpRWxlbWVudHMoKSB7IHJldHVybiB0aGlzLl91aUVsZW1lbnRzIHx8IHt9IH1cbiAgc2V0IHVpRWxlbWVudHModWlFbGVtZW50cykge1xuICAgIHRoaXMuX3VpRWxlbWVudHMgPSB1aUVsZW1lbnRzXG4gICAgLy8gdGhpcy50b2dnbGVFdmVudHMoKVxuICB9XG4gIGdldCB1aUVsZW1lbnRFdmVudHMoKSB7IHJldHVybiB0aGlzLl91aUVsZW1lbnRFdmVudHMgfHwge30gfVxuICBzZXQgdWlFbGVtZW50RXZlbnRzKHVpRWxlbWVudEV2ZW50cykge1xuICAgIHRoaXMuX3VpRWxlbWVudEV2ZW50cyA9IHVpRWxlbWVudEV2ZW50c1xuICAgIC8vIHRoaXMudG9nZ2xlRXZlbnRzKClcbiAgfVxuICBnZXQgdWlFbGVtZW50Q2FsbGJhY2tzKCkgeyByZXR1cm4gdGhpcy5fdWlFbGVtZW50Q2FsbGJhY2tzIHx8IHt9IH1cbiAgc2V0IHVpRWxlbWVudENhbGxiYWNrcyh1aUVsZW1lbnRDYWxsYmFja3MpIHtcbiAgICB0aGlzLl91aUVsZW1lbnRDYWxsYmFja3MgPSB1aUVsZW1lbnRDYWxsYmFja3NcbiAgICBPYmplY3QudmFsdWVzKHRoaXMuX3VpRWxlbWVudENhbGxiYWNrcylcbiAgICAgIC5mb3JFYWNoKCh1aUVsZW1lbnRDYWxsYmFjaykgPT4gdWlFbGVtZW50Q2FsbGJhY2suYmluZCh0aGlzKSlcbiAgICAvLyB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gIH1cbiAgZ2V0IHVpKCkge1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzXG4gICAgaWYoIXRoaXMuX3VpKSB7XG4gICAgICB0aGlzLl91aSA9IE9iamVjdC5lbnRyaWVzKHRoaXMudWlFbGVtZW50cykucmVkdWNlKChfdWksW3VpRWxlbWVudE5hbWUsIHVpRWxlbWVudFF1ZXJ5XSkgPT4ge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhfdWksIHtcbiAgICAgICAgICBbdWlFbGVtZW50TmFtZV06IHtcbiAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgaWYodHlwZW9mIHVpRWxlbWVudFF1ZXJ5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGxldCBxdWVyeVJlc3VsdHMgPSBjb250ZXh0LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh1aUVsZW1lbnRRdWVyeSlcbiAgICAgICAgICAgICAgICByZXR1cm4gKHF1ZXJ5UmVzdWx0cy5sZW5ndGggPiAxKSA/IHF1ZXJ5UmVzdWx0cyA6IHF1ZXJ5UmVzdWx0cy5pdGVtKDApXG4gICAgICAgICAgICAgIH0gZWxzZSBpZihcbiAgICAgICAgICAgICAgICB1aUVsZW1lbnRRdWVyeSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICAgICAgICAgICAgdWlFbGVtZW50UXVlcnkgaW5zdGFuY2VvZiBEb2N1bWVudCB8fFxuICAgICAgICAgICAgICAgIHVpRWxlbWVudFF1ZXJ5IGluc3RhbmNlb2YgV2luZG93XG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1aUVsZW1lbnRRdWVyeVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIF91aVxuICAgICAgfSwge30pXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLl91aSwge1xuICAgICAgICAnJGVsZW1lbnQnOiB7XG4gICAgICAgICAgZ2V0KCkgeyByZXR1cm4gY29udGV4dC5lbGVtZW50IH1cbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl91aVxuICB9XG4gIHJlc2V0VUkoKSB7XG4gICAgZGVsZXRlIHRoaXMuX3VpXG4gICAgdGhpcy50b2dnbGVFdmVudHMoKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZWxlbWVudE9ic2VydmUobXV0YXRpb25SZWNvcmRMaXN0LCBvYnNlcnZlcikge1xuICAgIGZvcihsZXQgW211dGF0aW9uUmVjb3JkSW5kZXgsIG11dGF0aW9uUmVjb3JkXSBvZiBPYmplY3QuZW50cmllcyhtdXRhdGlvblJlY29yZExpc3QpKSB7XG4gICAgICBzd2l0Y2gobXV0YXRpb25SZWNvcmQudHlwZSkge1xuICAgICAgICBjYXNlICdjaGlsZExpc3QnOlxuICAgICAgICAgIGlmKG11dGF0aW9uUmVjb3JkLmFkZGVkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyh0aGlzLnVpKSlcbiAgICAgICAgICAgIC8vIC5mb3JFYWNoKChbdWlLZXksIHVpVmFsdWVdKSA9PiB7XG4gICAgICAgICAgICAvLyAgIGNvbnN0IHVpVmFsdWVHZXQgPSB1aVZhbHVlLmdldCgpXG4gICAgICAgICAgICAvLyAgIGNvbnN0IGFkZGVkVUlFbGVtZW50ID0gQXJyYXkuZnJvbShtdXRhdGlvblJlY29yZC5hZGRlZE5vZGVzKS5maW5kKChhZGRlZE5vZGUpID0+IHtcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnYWRkZWROb2RlJywgYWRkZWROb2RlKVxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCd1aVZhbHVlR2V0JywgdWlWYWx1ZUdldClcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gYWRkZWROb2RlID09PSB1aVZhbHVlR2V0XG4gICAgICAgICAgICAvLyAgIH0pXG4gICAgICAgICAgICAvLyAgIGlmKGFkZGVkVUlFbGVtZW50KSB7XG4gICAgICAgICAgICAvLyAgICAgdGhpcy50b2dnbGVFdmVudHModWlLZXkpXG4gICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAgIC8vIH0pXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGJpbmRFdmVudFRvRWxlbWVudChlbGVtZW50LCBtZXRob2QsIGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFja05hbWUpIHtcbiAgICB0cnkge1xuICAgICAgc3dpdGNoKG1ldGhvZCkge1xuICAgICAgICBjYXNlICdhZGRFdmVudExpc3RlbmVyJzpcbiAgICAgICAgICB0aGlzLnVpRWxlbWVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gPSB0aGlzLnVpRWxlbWVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0vLyAuYmluZCh0aGlzKVxuICAgICAgICAgIGVsZW1lbnRbbWV0aG9kXShldmVudE5hbWUsIHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSlcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdyZW1vdmVFdmVudExpc3RlbmVyJzpcbiAgICAgICAgICBlbGVtZW50W21ldGhvZF0oZXZlbnROYW1lLCB0aGlzLnVpRWxlbWVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9IGNhdGNoKGVycm9yKSB7fVxuICB9XG4gIHRvZ2dsZUV2ZW50cyh0YXJnZXRVSUVsZW1lbnROYW1lID0gbnVsbCkge1xuICAgIHRoaXMuaXNUb2dnbGluZyA9IHRydWVcbiAgICBjb25zdCB1aSA9IHRoaXMudWlcbiAgICBjb25zdCBldmVudEJpbmRNZXRob2RzID0gWydyZW1vdmVFdmVudExpc3RlbmVyJywgJ2FkZEV2ZW50TGlzdGVuZXInXVxuICAgIGlmKCF0YXJnZXRVSUVsZW1lbnROYW1lKSB7XG4gICAgICBldmVudEJpbmRNZXRob2RzLmZvckVhY2goKGV2ZW50QmluZE1ldGhvZCkgPT4ge1xuICAgICAgICBPYmplY3QuZW50cmllcyh0aGlzLnVpRWxlbWVudEV2ZW50cykuZm9yRWFjaCgoW3VpRWxlbWVudEV2ZW50U2V0dGluZ3MsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGxldCBbdWlFbGVtZW50TmFtZSwgdWlFbGVtZW50RXZlbnROYW1lXSA9IHVpRWxlbWVudEV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxuICAgICAgICAgIGlmKHVpW3VpRWxlbWVudE5hbWVdIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgICAgICAgIHVpW3VpRWxlbWVudE5hbWVdLmZvckVhY2goKHVpRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmJpbmRFdmVudFRvRWxlbWVudCh1aUVsZW1lbnQsIGV2ZW50QmluZE1ldGhvZCwgdWlFbGVtZW50RXZlbnROYW1lLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIGlmKHVpW3VpRWxlbWVudE5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLmJpbmRFdmVudFRvRWxlbWVudCh1aVt1aUVsZW1lbnROYW1lXSwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGV2ZW50QmluZE1ldGhvZHMuZm9yRWFjaCgoZXZlbnRCaW5kTWV0aG9kKSA9PiB7XG4gICAgICAgIGNvbnN0IHVpRWxlbWVudEV2ZW50cyA9IE9iamVjdC5lbnRyaWVzKHRoaXMudWlFbGVtZW50RXZlbnRzKS5mb3JFYWNoKChbdWlFbGVtZW50RXZlbnRTZXR0aW5ncywgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWVdKSA9PiB7XG4gICAgICAgICAgbGV0IFt1aUVsZW1lbnROYW1lLCB1aUVsZW1lbnRFdmVudE5hbWVdID0gdWlFbGVtZW50RXZlbnRTZXR0aW5ncy5zcGxpdCgnICcpXG4gICAgICAgICAgaWYodGFyZ2V0VUlFbGVtZW50TmFtZSA9PT0gdWlFbGVtZW50TmFtZSkge1xuICAgICAgICAgICAgaWYodWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xuICAgICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXS5mb3JFYWNoKCh1aUVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRFdmVudFRvRWxlbWVudCh1aUVsZW1lbnQsIGV2ZW50QmluZE1ldGhvZCwgdWlFbGVtZW50RXZlbnROYW1lLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSBpZih1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50VG9FbGVtZW50KHVpW3VpRWxlbWVudE5hbWVdLCBldmVudEJpbmRNZXRob2QsIHVpRWxlbWVudEV2ZW50TmFtZSwgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5pc1RvZ2dsaW5nID0gZmFsc2VcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGF1dG9JbnNlcnQoKSB7XG4gICAgaWYodGhpcy5pbnNlcnQpIHtcbiAgICAgIGNvbnN0IHBhcmVudCA9ICh0eXBlb2YgdGhpcy5pbnNlcnQucGFyZW50ID09PSAnc3RyaW5nJylcbiAgICAgICAgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuaW5zZXJ0LnBhcmVudClcbiAgICAgICAgOiAodGhpcy5pbnNlcnQucGFyZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpXG4gICAgICAgICAgPyB0aGlzLmluc2VydC5wYXJlbnRcbiAgICAgICAgICA6IG51bGxcbiAgICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMuaW5zZXJ0Lm1ldGhvZFxuICAgICAgcGFyZW50Lmluc2VydEFkamFjZW50RWxlbWVudChtZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdXRvUmVtb3ZlKCkge1xuICAgIGlmKHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50KSB7XG4gICAgICB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZW1wdHlFbGVtZW50KHVpRWxlbWVudCkge1xuICAgIHRoaXMudWlbdWlFbGVtZW50XS5pbm5lckhUTUwgPSAnJ1xuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgcmVuZGVyRWxlbWVudFRleHRDb250ZW50KHVpRWxlbWVudCwgdGV4dENvbnRlbnQpIHtcbiAgICBpZih0aGlzLnVpW3VpRWxlbWVudF0pIHRoaXMudWlbdWlFbGVtZW50XS5pbm5lckhUTUwgPSB0ZXh0Q29udGVudFxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgcmVuZGVyRWxlbWVudEF0dHJpYnV0ZSh1aUVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUpIHtcbiAgICBpZih0aGlzLnVpW3VpRWxlbWVudF0pIHRoaXMudWlbdWlFbGVtZW50XS5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHJlbmRlckVsZW1lbnRBdHRyaWJ1dGUodWlFbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSkge1xuICAgIGlmKHRoaXMudWlbdWlFbGVtZW50XSkgdGhpcy51aVt1aUVsZW1lbnRdLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBhdHRyaWJ1dGVWYWx1ZSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHJlbmRlckVsZW1lbnQodWlFbGVtZW50LCBpbnNlcnRNZXRob2QsIGVsZW1lbnQpIHtcbiAgICBpZih0aGlzLnVpW3VpRWxlbWVudF0pIHRoaXMudWlbdWlFbGVtZW50XS5pbnNlcnRBZGphY2VudEVsZW1lbnQoaW5zZXJ0TWV0aG9kLCBlbGVtZW50KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgcmVuZGVyKGRhdGEgPSB7fSkge1xuICAgIGlmKHRoaXMudGVtcGxhdGUpIHtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZShkYXRhKVxuICAgICAgdGhpcy5lbGVtZW50LmlubmVySFRNTCA9IHRlbXBsYXRlXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFZpZXdcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4J1xuXG5jb25zdCBDb250cm9sbGVyID0gY2xhc3MgZXh0ZW5kcyBFdmVudHMge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICB9XG4gIGdldCB2YWxpZFNldHRpbmdzKCkgeyByZXR1cm4gW1xuICAgICdtb2RlbHMnLFxuICAgICdtb2RlbEV2ZW50cycsXG4gICAgJ21vZGVsQ2FsbGJhY2tzJyxcbiAgICAnY29sbGVjdGlvbnMnLFxuICAgICdjb2xsZWN0aW9uRXZlbnRzJyxcbiAgICAnY29sbGVjdGlvbkNhbGxiYWNrcycsXG4gICAgJ3ZpZXdzJyxcbiAgICAndmlld0V2ZW50cycsXG4gICAgJ3ZpZXdDYWxsYmFja3MnLFxuICAgICdjb250cm9sbGVycycsXG4gICAgJ2NvbnRyb2xsZXJFdmVudHMnLFxuICAgICdjb250cm9sbGVyQ2FsbGJhY2tzJyxcbiAgICAncm91dGVycycsXG4gICAgJ3JvdXRlckV2ZW50cycsXG4gICAgJ3JvdXRlckNhbGxiYWNrcycsXG4gIF0gfVxuICBnZXQgYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlcygpIHsgcmV0dXJuIFtcbiAgICAnbW9kZWwnLFxuICAgICd2aWV3JyxcbiAgICAnY29sbGVjdGlvbicsXG4gICAgJ2NvbnRyb2xsZXInLFxuICAgICdyb3V0ZXInLFxuICBdIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCBzZXR0aW5ncygpIHtcbiAgICBpZighdGhpcy5fc2V0dGluZ3MpIHRoaXMuX3NldHRpbmdzID0ge31cbiAgICByZXR1cm4gdGhpcy5fc2V0dGluZ3NcbiAgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzXG4gICAgICAuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XG4gICAgICAgIGlmKHRoaXMuc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgWydfJy5jb25jYXQodmFsaWRTZXR0aW5nKV06IHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWJlcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBbdmFsaWRTZXR0aW5nXToge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNbJ18nLmNvbmNhdCh2YWxpZFNldHRpbmcpXSB9LFxuICAgICAgICAgICAgICAgIHNldCh2YWx1ZSkgeyB0aGlzWydfJy5jb25jYXQodmFsaWRTZXR0aW5nKV0gPSB2YWx1ZSB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIClcbiAgICAgICAgICB0aGlzW3ZhbGlkU2V0dGluZ10gPSB0aGlzLnNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB0aGlzLmJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXNcbiAgICAgIC5mb3JFYWNoKChiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUpID0+IHtcbiAgICAgICAgdGhpcy5yZXNldEV2ZW50cyhiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUpXG4gICAgICB9KVxuICB9XG4gIHJlc2V0RXZlbnRzKGNsYXNzVHlwZSkge1xuICAgIFtcbiAgICAgICdvZmYnLFxuICAgICAgJ29uJ1xuICAgIF0uZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZClcbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKSB7XG4gICAgY29uc3QgYmFzZU5hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdzJylcbiAgICBjb25zdCBiYXNlRXZlbnRzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrc05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKVxuICAgIGNvbnN0IGJhc2UgPSB0aGlzW2Jhc2VOYW1lXSB8fCB7fVxuICAgIGNvbnN0IGJhc2VFdmVudHMgPSB0aGlzW2Jhc2VFdmVudHNOYW1lXSB8fCB7fVxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3MgPSB0aGlzW2Jhc2VDYWxsYmFja3NOYW1lXSB8fCB7fVxuICAgIGlmKFxuICAgICAgT2JqZWN0LnZhbHVlcyhiYXNlKS5sZW5ndGggJiZcbiAgICAgIE9iamVjdC52YWx1ZXMoYmFzZUV2ZW50cykubGVuZ3RoICYmXG4gICAgICBPYmplY3QudmFsdWVzKGJhc2VDYWxsYmFja3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgT2JqZWN0LmVudHJpZXMoYmFzZUV2ZW50cylcbiAgICAgICAgLmZvckVhY2goKFtiYXNlRXZlbnREYXRhLCBiYXNlQ2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IFtiYXNlVGFyZ2V0TmFtZSwgYmFzZUV2ZW50TmFtZV0gPSBiYXNlRXZlbnREYXRhLnNwbGl0KCcgJylcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0ZpcnN0ID0gYmFzZVRhcmdldE5hbWUuc3Vic3RyaW5nKDAsIDEpXG4gICAgICAgICAgY29uc3QgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0ID0gYmFzZVRhcmdldE5hbWUuc3Vic3RyaW5nKGJhc2VUYXJnZXROYW1lLmxlbmd0aCAtIDEpXG4gICAgICAgICAgbGV0IGJhc2VUYXJnZXRzID0gW11cbiAgICAgICAgICBpZihcbiAgICAgICAgICAgIGJhc2VUYXJnZXROYW1lU3Vic3RyaW5nRmlyc3QgPT09ICdbJyAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0ID09PSAnXSdcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzID0gT2JqZWN0LmVudHJpZXMoYmFzZSlcbiAgICAgICAgICAgICAgLnJlZHVjZSgoX2Jhc2VUYXJnZXRzLCBbYmFzZU5hbWUsIGJhc2VUYXJnZXRdKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGJhc2VUYXJnZXROYW1lUmVnRXhwU3RyaW5nID0gYmFzZVRhcmdldE5hbWUuc2xpY2UoMSwgLTEpXG4gICAgICAgICAgICAgICAgbGV0IGJhc2VUYXJnZXROYW1lUmVnRXhwID0gbmV3IFJlZ0V4cChiYXNlVGFyZ2V0TmFtZVJlZ0V4cFN0cmluZylcbiAgICAgICAgICAgICAgICBpZihiYXNlTmFtZS5tYXRjaChiYXNlVGFyZ2V0TmFtZVJlZ0V4cCkpIHtcbiAgICAgICAgICAgICAgICAgIF9iYXNlVGFyZ2V0cy5wdXNoKGJhc2VUYXJnZXQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBfYmFzZVRhcmdldHNcbiAgICAgICAgICAgICAgfSwgW10pXG4gICAgICAgICAgfSBlbHNlIGlmKGJhc2VbYmFzZVRhcmdldE5hbWVdKSB7XG4gICAgICAgICAgICBiYXNlVGFyZ2V0cy5wdXNoKGJhc2VbYmFzZVRhcmdldE5hbWVdKVxuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgYmFzZUV2ZW50Q2FsbGJhY2sgPSBiYXNlQ2FsbGJhY2tzW2Jhc2VDYWxsYmFja05hbWVdXG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFjayAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2submFtZS5zcGxpdCgnICcpLmxlbmd0aCA9PT0gMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2sgPSBiYXNlRXZlbnRDYWxsYmFjay5iaW5kKHRoaXMpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWUgJiZcbiAgICAgICAgICAgIGJhc2VFdmVudE5hbWUgJiZcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzLmxlbmd0aCAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2tcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzXG4gICAgICAgICAgICAgIC5mb3JFYWNoKChiYXNlVGFyZ2V0KSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIHN3aXRjaChtZXRob2QpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnb24nOlxuICAgICAgICAgICAgICAgICAgICAgIGJhc2VUYXJnZXRbbWV0aG9kXShiYXNlRXZlbnROYW1lLCBiYXNlRXZlbnRDYWxsYmFjaylcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdvZmYnOlxuICAgICAgICAgICAgICAgICAgICAgIGJhc2VUYXJnZXRbbWV0aG9kXShiYXNlRXZlbnROYW1lLCBiYXNlRXZlbnRDYWxsYmFjaylcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgQ29udHJvbGxlclxuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXgnXG5cbmNvbnN0IFJvdXRlciA9IGNsYXNzIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICBpZih0aGlzLmhhc2hSb3V0aW5nKSB0aGlzLmFkZFdpbmRvd0V2ZW50cygpXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ3Jvb3QnLFxuICAgICdoYXNoUm91dGluZycsXG4gICAgJ2NvbnRyb2xsZXInLFxuICAgICdyb3V0ZXMnXG4gIF0gfVxuICBnZXQgc2V0dGluZ3MoKSB7IHJldHVybiB0aGlzLl9zZXR0aW5ncyB9XG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3MuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XG4gICAgICBpZihzZXR0aW5nc1t2YWxpZFNldHRpbmddKSB0aGlzW3ZhbGlkU2V0dGluZ10gPSBzZXR0aW5nc1t2YWxpZFNldHRpbmddXG4gICAgfSlcbiAgfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cbiAgZ2V0IHByb3RvY29sKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnByb3RvY29sIH1cbiAgZ2V0IGhvc3RuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lIH1cbiAgZ2V0IHBvcnQoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucG9ydCB9XG4gIGdldCBwYXRobmFtZSgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSB9XG4gIGdldCBwYXRoKCkge1xuICAgIGxldCBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWVcbiAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoWydeJywgdGhpcy5yb290XS5qb2luKCcnKSksICcnKVxuICAgICAgLnNwbGl0KCc/JylcbiAgICAgIC5zbGljZSgwLCAxKVxuICAgICAgWzBdXG4gICAgbGV0IGZyYWdtZW50cyA9IChcbiAgICAgIHN0cmluZy5sZW5ndGggPT09IDBcbiAgICApID8gW11cbiAgICAgIDogKFxuICAgICAgICAgIHN0cmluZy5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL15cXC8vKSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXFwvPy8pXG4gICAgICAgICkgPyBbJy8nXVxuICAgICAgICAgIDogc3RyaW5nXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC8kLywgJycpXG4gICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgcmV0dXJuIHtcbiAgICAgIGZyYWdtZW50czogZnJhZ21lbnRzLFxuICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgfVxuICB9XG4gIGdldCBoYXNoKCkge1xuICAgIGxldCBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uaGFzaFxuICAgICAgLnNsaWNlKDEpXG4gICAgICAuc3BsaXQoJz8nKVxuICAgICAgLnNsaWNlKDAsIDEpXG4gICAgICBbMF1cbiAgICBsZXQgZnJhZ21lbnRzID0gKFxuICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMFxuICAgICkgPyBbXVxuICAgICAgOiAoXG4gICAgICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXlxcLy8pICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9cXC8/LylcbiAgICAgICAgKSA/IFsnLyddXG4gICAgICAgICAgOiBzdHJpbmdcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICByZXR1cm4ge1xuICAgICAgZnJhZ21lbnRzOiBmcmFnbWVudHMsXG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICB9XG4gIH1cbiAgZ2V0IHBhcmFtZXRlcnMoKSB7XG4gICAgbGV0IHN0cmluZ1xuICAgIGxldCBkYXRhXG4gICAgaWYod2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goL1xcPy8pKSB7XG4gICAgICBsZXQgcGFyYW1ldGVycyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgICAgIC5zcGxpdCgnPycpXG4gICAgICAgIC5zbGljZSgtMSlcbiAgICAgICAgLmpvaW4oJycpXG4gICAgICBzdHJpbmcgPSBwYXJhbWV0ZXJzXG4gICAgICBkYXRhID0gcGFyYW1ldGVyc1xuICAgICAgICAuc3BsaXQoJyYnKVxuICAgICAgICAucmVkdWNlKChcbiAgICAgICAgICBfcGFyYW1ldGVycyxcbiAgICAgICAgICBwYXJhbWV0ZXJcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgbGV0IHBhcmFtZXRlckRhdGEgPSBwYXJhbWV0ZXIuc3BsaXQoJz0nKVxuICAgICAgICAgIF9wYXJhbWV0ZXJzW3BhcmFtZXRlckRhdGFbMF1dID0gcGFyYW1ldGVyRGF0YVsxXVxuICAgICAgICAgIHJldHVybiBfcGFyYW1ldGVyc1xuICAgICAgICB9LCB7fSlcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyaW5nID0gJydcbiAgICAgIGRhdGEgPSB7fVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfVxuICB9XG4gIGdldCByb290KCkgeyByZXR1cm4gdGhpcy5fcm9vdCB8fCAnLycgfVxuICBzZXQgcm9vdChyb290KSB7IHRoaXMuX3Jvb3QgPSByb290IH1cbiAgZ2V0IGhhc2hSb3V0aW5nKCkgeyByZXR1cm4gdGhpcy5faGFzaFJvdXRpbmcgfHwgZmFsc2UgfVxuICBzZXQgaGFzaFJvdXRpbmcoaGFzaFJvdXRpbmcpIHsgdGhpcy5faGFzaFJvdXRpbmcgPSBoYXNoUm91dGluZyB9XG4gIGdldCByb3V0ZXMoKSB7IHJldHVybiB0aGlzLl9yb3V0ZXMgfVxuICBzZXQgcm91dGVzKHJvdXRlcykgeyB0aGlzLl9yb3V0ZXMgPSByb3V0ZXMgfVxuICBnZXQgY29udHJvbGxlcigpIHsgcmV0dXJuIHRoaXMuX2NvbnRyb2xsZXIgfVxuICBzZXQgY29udHJvbGxlcihjb250cm9sbGVyKSB7IHRoaXMuX2NvbnRyb2xsZXIgPSBjb250cm9sbGVyIH1cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICByb290OiB0aGlzLnJvb3QsXG4gICAgICBwYXRoOiB0aGlzLnBhdGgsXG4gICAgICBoYXNoOiB0aGlzLmhhc2gsXG4gICAgICBwYXJhbWV0ZXJzOiB0aGlzLnBhcmFtZXRlcnMsXG4gICAgfVxuICB9XG4gIG1hdGNoUm91dGUocm91dGVGcmFnbWVudHMsIGxvY2F0aW9uRnJhZ21lbnRzKSB7XG4gICAgbGV0IHJvdXRlTWF0Y2hlcyA9IG5ldyBBcnJheSgpXG4gICAgaWYocm91dGVGcmFnbWVudHMubGVuZ3RoID09PSBsb2NhdGlvbkZyYWdtZW50cy5sZW5ndGgpIHtcbiAgICAgIHJvdXRlTWF0Y2hlcyA9IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgIC5yZWR1Y2UoKF9yb3V0ZU1hdGNoZXMsIHJvdXRlRnJhZ21lbnQsIHJvdXRlRnJhZ21lbnRJbmRleCkgPT4ge1xuICAgICAgICAgIGxldCBsb2NhdGlvbkZyYWdtZW50ID0gbG9jYXRpb25GcmFnbWVudHNbcm91dGVGcmFnbWVudEluZGV4XVxuICAgICAgICAgIGlmKHJvdXRlRnJhZ21lbnQubWF0Y2goL15cXDovKSkge1xuICAgICAgICAgICAgX3JvdXRlTWF0Y2hlcy5wdXNoKHRydWUpXG4gICAgICAgICAgfSBlbHNlIGlmKHJvdXRlRnJhZ21lbnQgPT09IGxvY2F0aW9uRnJhZ21lbnQpIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaCh0cnVlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2goZmFsc2UpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcm91dGVNYXRjaGVzXG4gICAgICAgIH0sIFtdKVxuICAgIH0gZWxzZSB7XG4gICAgICByb3V0ZU1hdGNoZXMucHVzaChmYWxzZSlcbiAgICB9XG4gICAgcmV0dXJuIChyb3V0ZU1hdGNoZXMuaW5kZXhPZihmYWxzZSkgPT09IC0xKVxuICAgICAgPyB0cnVlXG4gICAgICA6IGZhbHNlXG4gIH1cbiAgZ2V0Um91dGUobG9jYXRpb24pIHtcbiAgICBsZXQgcm91dGVzID0gT2JqZWN0LmVudHJpZXModGhpcy5yb3V0ZXMpXG4gICAgICAucmVkdWNlKChcbiAgICAgICAgX3JvdXRlcyxcbiAgICAgICAgW3JvdXRlTmFtZSwgcm91dGVTZXR0aW5nc10pID0+IHtcbiAgICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSAoXG4gICAgICAgICAgICByb3V0ZU5hbWUubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgICByb3V0ZU5hbWUubWF0Y2goL15cXC8vKVxuICAgICAgICAgICkgPyBbcm91dGVOYW1lXVxuICAgICAgICAgICAgOiAocm91dGVOYW1lLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgPyBbJyddXG4gICAgICAgICAgICAgIDogcm91dGVOYW1lXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgICAgICAgcm91dGVTZXR0aW5ncy5mcmFnbWVudHMgPSByb3V0ZUZyYWdtZW50c1xuICAgICAgICAgIF9yb3V0ZXNbcm91dGVGcmFnbWVudHMuam9pbignLycpXSA9IHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICByZXR1cm4gX3JvdXRlc1xuICAgICAgICB9LFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHJvdXRlcylcbiAgICAgIC5maW5kKChyb3V0ZSkgPT4ge1xuICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSByb3V0ZS5mcmFnbWVudHNcbiAgICAgICAgbGV0IGxvY2F0aW9uRnJhZ21lbnRzID0gKHRoaXMuaGFzaFJvdXRpbmcpXG4gICAgICAgICAgPyBsb2NhdGlvbi5oYXNoLmZyYWdtZW50c1xuICAgICAgICAgIDogbG9jYXRpb24ucGF0aC5mcmFnbWVudHNcbiAgICAgICAgbGV0IG1hdGNoUm91dGUgPSB0aGlzLm1hdGNoUm91dGUoXG4gICAgICAgICAgcm91dGVGcmFnbWVudHMsXG4gICAgICAgICAgbG9jYXRpb25GcmFnbWVudHMsXG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuIG1hdGNoUm91dGUgPT09IHRydWVcbiAgICAgIH0pXG4gIH1cbiAgaGFzaENoYW5nZShldmVudCkge1xuICAgIGxldCBsb2NhdGlvbiA9IHRoaXMubG9jYXRpb25cbiAgICBsZXQgcm91dGUgPSB0aGlzLmdldFJvdXRlKGxvY2F0aW9uKVxuICAgIGxldCByb3V0ZURhdGEgPSB7XG4gICAgICByb3V0ZTogcm91dGUsXG4gICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgfVxuICAgIGlmKHJvdXRlKSB7XG4gICAgICB0aGlzLmVtaXQoXG4gICAgICAgICdjaGFuZ2UnLCBcbiAgICAgICAgcm91dGVEYXRhLFxuICAgICAgICB0aGlzXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgYWRkV2luZG93RXZlbnRzKCkge1xuICAgIHdpbmRvdy5vbignaGFzaGNoYW5nZScsIHRoaXMuaGFzaENoYW5nZS5iaW5kKHRoaXMpKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgcmVtb3ZlV2luZG93RXZlbnRzKCkge1xuICAgIHdpbmRvdy5vZmYoJ2hhc2hjaGFuZ2UnLCB0aGlzLmhhc2hDaGFuZ2UuYmluZCh0aGlzKSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIG5hdmlnYXRlKHVybCA9IFN0cmluZygpKSB7XG4gICAgaWYodGhpcy5oYXNoUm91dGluZykge1xuICAgICAgaWYodXJsID09PSAnJykgdXJsID0gJy8nXG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IHVybFxuICAgIH0gZWxzZSB7XG4gICAgICBpZih1cmwgPT09ICcnKSB1cmwgPSAnLydcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFJvdXRlclxuIl0sIm5hbWVzIjpbIkV2ZW50VGFyZ2V0IiwicHJvdG90eXBlIiwib24iLCJhZGRFdmVudExpc3RlbmVyIiwib2ZmIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIkV2ZW50cyIsImNvbnN0cnVjdG9yIiwiX2V2ZW50cyIsImV2ZW50cyIsImdldEV2ZW50Q2FsbGJhY2tzIiwiZXZlbnROYW1lIiwiZ2V0RXZlbnRDYWxsYmFja05hbWUiLCJldmVudENhbGxiYWNrIiwibmFtZSIsImxlbmd0aCIsImdldEV2ZW50Q2FsbGJhY2tHcm91cCIsImV2ZW50Q2FsbGJhY2tzIiwiZXZlbnRDYWxsYmFja05hbWUiLCJldmVudENhbGxiYWNrR3JvdXAiLCJwdXNoIiwiYXJndW1lbnRzIiwiT2JqZWN0Iiwia2V5cyIsImVtaXQiLCJfYXJndW1lbnRzIiwiQXJyYXkiLCJmcm9tIiwic3BsaWNlIiwiZXZlbnREYXRhIiwiZXZlbnRBcmd1bWVudHMiLCJlbnRyaWVzIiwiZm9yRWFjaCIsImV2ZW50Q2FsbGJhY2tHcm91cE5hbWUiLCJkYXRhIiwiX3Jlc3BvbnNlcyIsInJlc3BvbnNlcyIsInJlc3BvbnNlIiwicmVzcG9uc2VOYW1lIiwicmVzcG9uc2VDYWxsYmFjayIsInJlcXVlc3QiLCJzbGljZSIsImNhbGwiLCJfcmVzcG9uc2VOYW1lIiwiX2NoYW5uZWxzIiwiY2hhbm5lbHMiLCJjaGFubmVsIiwiY2hhbm5lbE5hbWUiLCJDaGFubmVsIiwiVVVJRCIsInV1aWQiLCJpIiwicmFuZG9tIiwiTWF0aCIsInRvU3RyaW5nIiwiU2VydmljZSIsInNldHRpbmdzIiwib3B0aW9ucyIsInZhbGlkU2V0dGluZ3MiLCJfc2V0dGluZ3MiLCJ2YWxpZFNldHRpbmciLCJfb3B0aW9ucyIsInVybCIsInBhcmFtZXRlcnMiLCJfdXJsIiwiY29uY2F0IiwicXVlcnlTdHJpbmciLCJwYXJhbWV0ZXJTdHJpbmciLCJyZWR1Y2UiLCJwYXJhbWV0ZXJTdHJpbmdzIiwicGFyYW1ldGVyS2V5IiwicGFyYW1ldGVyVmFsdWUiLCJqb2luIiwibWV0aG9kIiwiX21ldGhvZCIsIm1vZGUiLCJfbW9kZSIsImNhY2hlIiwiX2NhY2hlIiwiY3JlZGVudGlhbHMiLCJfY3JlZGVudGlhbHMiLCJoZWFkZXJzIiwiX2hlYWRlcnMiLCJyZWRpcmVjdCIsIl9yZWRpcmVjdCIsInJlZmVycmVyUG9saWN5IiwiX3JlZmVycmVyUG9saWN5IiwiYm9keSIsIl9ib2R5IiwiZmlsZXMiLCJfZmlsZXMiLCJfcGFyYW1ldGVycyIsInByZXZpb3VzQWJvcnRDb250cm9sbGVyIiwiX3ByZXZpb3VzQWJvcnRDb250cm9sbGVyIiwiYWJvcnRDb250cm9sbGVyIiwiX2Fib3J0Q29udHJvbGxlciIsIkFib3J0Q29udHJvbGxlciIsIl9yZXNwb25zZSIsInJlc3BvbnNlRGF0YSIsIl9yZXNwb25zZURhdGEiLCJhYm9ydCIsImZldGNoIiwiZmV0Y2hPcHRpb25zIiwiX2ZldGNoT3B0aW9ucyIsImZldGNoT3B0aW9uTmFtZSIsInNpZ25hbCIsInRoZW4iLCJqc29uIiwiY2F0Y2giLCJlcnJvciIsIm1lc3NhZ2UiLCJmZXRjaFN5bmMiLCJjb2RlIiwiTW9kZWwiLCJfdXVpZCIsImJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXMiLCJiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUiLCJ0b2dnbGVFdmVudHMiLCJzZXJ2aWNlcyIsIl9zZXJ2aWNlcyIsIl9kYXRhIiwiZGVmYXVsdHMiLCJfZGVmYXVsdHMiLCJsb2NhbFN0b3JhZ2UiLCJzeW5jIiwiZGIiLCJzZXQiLCJfbG9jYWxTdG9yYWdlIiwic3RvcmFnZUNvbnRhaW5lciIsIl9kYiIsImdldEl0ZW0iLCJlbmRwb2ludCIsIkpTT04iLCJzdHJpbmdpZnkiLCJwYXJzZSIsInNldEl0ZW0iLCJyZXNldEV2ZW50cyIsImNsYXNzVHlwZSIsImJhc2VOYW1lIiwiYmFzZUV2ZW50c05hbWUiLCJiYXNlQ2FsbGJhY2tzTmFtZSIsImJhc2UiLCJiYXNlRXZlbnRzIiwiYmFzZUNhbGxiYWNrcyIsInZhbHVlcyIsImJhc2VFdmVudERhdGEiLCJiYXNlQ2FsbGJhY2tOYW1lIiwiYmFzZVRhcmdldE5hbWUiLCJiYXNlRXZlbnROYW1lIiwic3BsaXQiLCJiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0ZpcnN0Iiwic3Vic3RyaW5nIiwiYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0IiwiYmFzZVRhcmdldHMiLCJfYmFzZVRhcmdldHMiLCJiYXNlVGFyZ2V0IiwiYmFzZVRhcmdldE5hbWVSZWdFeHBTdHJpbmciLCJiYXNlVGFyZ2V0TmFtZVJlZ0V4cCIsIlJlZ0V4cCIsIm1hdGNoIiwiYmFzZUV2ZW50Q2FsbGJhY2siLCJiaW5kIiwic2V0REIiLCJrZXkiLCJ2YWx1ZSIsInVuc2V0REIiLCJzZXREYXRhUHJvcGVydHkiLCJzaWxlbnQiLCJjdXJyZW50RGF0YVByb3BlcnR5IiwiZ2V0IiwiZGVmaW5lUHJvcGVydGllcyIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiZW51bWVyYWJsZSIsImV2ZW50IiwibW9kZWwiLCJ1bnNldERhdGFQcm9wZXJ0eSIsImFzc2lnbiIsImlzQXJyYXkiLCJ1bnNldCIsIkNvbGxlY3Rpb24iLCJkZWZhdWx0SURBdHRyaWJ1dGUiLCJhZGQiLCJVdGlsaXRpZXMiLCJtb2RlbHMiLCJfbW9kZWxzIiwibW9kZWxzRGF0YSIsIl9tb2RlbCIsIm1vZGVsc0V4aXN0IiwibWFwIiwiYmFzZUNhbGxiYWNrIiwiZ2V0TW9kZWxJbmRleCIsIm1vZGVsVVVJRCIsIm1vZGVsSW5kZXgiLCJmaW5kIiwiX21vZGVsSW5kZXgiLCJyZW1vdmVNb2RlbEJ5SW5kZXgiLCJhZGRNb2RlbCIsIm1vZGVsRGF0YSIsIk1vZGVsUHJvdG90eXBlIiwibW9kZWxPcHRpb25zIiwicmVtb3ZlIiwiZmlsdGVyIiwicmVzZXQiLCJWaWV3IiwiZWxlbWVudE5hbWUiLCJfZWxlbWVudE5hbWUiLCJlbGVtZW50IiwiX2VsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJzZXRBdHRyaWJ1dGUiLCJlbGVtZW50T2JzZXJ2ZXIiLCJvYnNlcnZlIiwic3VidHJlZSIsImNoaWxkTGlzdCIsIl9lbGVtZW50T2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZWxlbWVudE9ic2VydmUiLCJIVE1MRWxlbWVudCIsIl9hdHRyaWJ1dGVzIiwidGVtcGxhdGUiLCJfdGVtcGxhdGUiLCJ1aUVsZW1lbnRzIiwiX3VpRWxlbWVudHMiLCJ1aUVsZW1lbnRFdmVudHMiLCJfdWlFbGVtZW50RXZlbnRzIiwidWlFbGVtZW50Q2FsbGJhY2tzIiwiX3VpRWxlbWVudENhbGxiYWNrcyIsInVpRWxlbWVudENhbGxiYWNrIiwidWkiLCJjb250ZXh0IiwiX3VpIiwidWlFbGVtZW50TmFtZSIsInVpRWxlbWVudFF1ZXJ5IiwicXVlcnlSZXN1bHRzIiwicXVlcnlTZWxlY3RvckFsbCIsIml0ZW0iLCJEb2N1bWVudCIsIldpbmRvdyIsInJlc2V0VUkiLCJtdXRhdGlvblJlY29yZExpc3QiLCJvYnNlcnZlciIsIm11dGF0aW9uUmVjb3JkSW5kZXgiLCJtdXRhdGlvblJlY29yZCIsInR5cGUiLCJhZGRlZE5vZGVzIiwiYmluZEV2ZW50VG9FbGVtZW50IiwidGFyZ2V0VUlFbGVtZW50TmFtZSIsImlzVG9nZ2xpbmciLCJldmVudEJpbmRNZXRob2RzIiwiZXZlbnRCaW5kTWV0aG9kIiwidWlFbGVtZW50RXZlbnRTZXR0aW5ncyIsInVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lIiwidWlFbGVtZW50RXZlbnROYW1lIiwiTm9kZUxpc3QiLCJ1aUVsZW1lbnQiLCJhdXRvSW5zZXJ0IiwiaW5zZXJ0IiwicGFyZW50IiwicXVlcnlTZWxlY3RvciIsImluc2VydEFkamFjZW50RWxlbWVudCIsImF1dG9SZW1vdmUiLCJwYXJlbnRFbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJlbXB0eUVsZW1lbnQiLCJpbm5lckhUTUwiLCJyZW5kZXJFbGVtZW50VGV4dENvbnRlbnQiLCJ0ZXh0Q29udGVudCIsInJlbmRlckVsZW1lbnRBdHRyaWJ1dGUiLCJhdHRyaWJ1dGVOYW1lIiwicmVtb3ZlQXR0cmlidXRlIiwicmVuZGVyRWxlbWVudCIsImluc2VydE1ldGhvZCIsInJlbmRlciIsIkNvbnRyb2xsZXIiLCJlbnVtYmVyYWJsZSIsIlJvdXRlciIsImhhc2hSb3V0aW5nIiwiYWRkV2luZG93RXZlbnRzIiwicHJvdG9jb2wiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhvc3RuYW1lIiwicG9ydCIsInBhdGhuYW1lIiwicGF0aCIsInN0cmluZyIsInJlcGxhY2UiLCJyb290IiwiZnJhZ21lbnRzIiwiaGFzaCIsImhyZWYiLCJwYXJhbWV0ZXIiLCJwYXJhbWV0ZXJEYXRhIiwiX3Jvb3QiLCJfaGFzaFJvdXRpbmciLCJyb3V0ZXMiLCJfcm91dGVzIiwiY29udHJvbGxlciIsIl9jb250cm9sbGVyIiwibWF0Y2hSb3V0ZSIsInJvdXRlRnJhZ21lbnRzIiwibG9jYXRpb25GcmFnbWVudHMiLCJyb3V0ZU1hdGNoZXMiLCJfcm91dGVNYXRjaGVzIiwicm91dGVGcmFnbWVudCIsInJvdXRlRnJhZ21lbnRJbmRleCIsImxvY2F0aW9uRnJhZ21lbnQiLCJpbmRleE9mIiwiZ2V0Um91dGUiLCJyb3V0ZU5hbWUiLCJyb3V0ZVNldHRpbmdzIiwicm91dGUiLCJoYXNoQ2hhbmdlIiwicm91dGVEYXRhIiwicmVtb3ZlV2luZG93RXZlbnRzIiwibmF2aWdhdGUiLCJTdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7OztFQUFBQSxXQUFXLENBQUNDLFNBQVosQ0FBc0JDLEVBQXRCLEdBQTJCRixXQUFXLENBQUNDLFNBQVosQ0FBc0JDLEVBQXRCLElBQTRCRixXQUFXLENBQUNDLFNBQVosQ0FBc0JFLGdCQUE3RTtFQUNBSCxXQUFXLENBQUNDLFNBQVosQ0FBc0JHLEdBQXRCLEdBQTRCSixXQUFXLENBQUNDLFNBQVosQ0FBc0JHLEdBQXRCLElBQTZCSixXQUFXLENBQUNDLFNBQVosQ0FBc0JJLG1CQUEvRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQ0RBLE1BQU1DLE1BQU4sQ0FBYTtFQUNYQyxFQUFBQSxXQUFXLEdBQUc7O0VBQ2QsTUFBSUMsT0FBSixHQUFjO0VBQ1osU0FBS0MsTUFBTCxHQUFjLEtBQUtBLE1BQUwsSUFBZSxFQUE3QjtFQUNBLFdBQU8sS0FBS0EsTUFBWjtFQUNEOztFQUNEQyxFQUFBQSxpQkFBaUIsQ0FBQ0MsU0FBRCxFQUFZO0VBQUUsV0FBTyxLQUFLSCxPQUFMLENBQWFHLFNBQWIsS0FBMkIsRUFBbEM7RUFBc0M7O0VBQ3JFQyxFQUFBQSxvQkFBb0IsQ0FBQ0MsYUFBRCxFQUFnQjtFQUNsQyxXQUFRQSxhQUFhLENBQUNDLElBQWQsQ0FBbUJDLE1BQXBCLEdBQ0hGLGFBQWEsQ0FBQ0MsSUFEWCxHQUVILG1CQUZKO0VBR0Q7O0VBQ0RFLEVBQUFBLHFCQUFxQixDQUFDQyxjQUFELEVBQWlCQyxpQkFBakIsRUFBb0M7RUFDdkQsV0FBT0QsY0FBYyxDQUFDQyxpQkFBRCxDQUFkLElBQXFDLEVBQTVDO0VBQ0Q7O0VBQ0RoQixFQUFBQSxFQUFFLENBQUNTLFNBQUQsRUFBWUUsYUFBWixFQUEyQjtFQUMzQixRQUFJSSxjQUFjLEdBQUcsS0FBS1AsaUJBQUwsQ0FBdUJDLFNBQXZCLENBQXJCO0VBQ0EsUUFBSU8saUJBQWlCLEdBQUcsS0FBS04sb0JBQUwsQ0FBMEJDLGFBQTFCLENBQXhCO0VBQ0EsUUFBSU0sa0JBQWtCLEdBQUcsS0FBS0gscUJBQUwsQ0FBMkJDLGNBQTNCLEVBQTJDQyxpQkFBM0MsQ0FBekI7RUFDQUMsSUFBQUEsa0JBQWtCLENBQUNDLElBQW5CLENBQXdCUCxhQUF4QjtFQUNBSSxJQUFBQSxjQUFjLENBQUNDLGlCQUFELENBQWQsR0FBb0NDLGtCQUFwQztFQUNBLFNBQUtYLE9BQUwsQ0FBYUcsU0FBYixJQUEwQk0sY0FBMUI7RUFDQSxXQUFPLElBQVA7RUFDRDs7RUFDRGIsRUFBQUEsR0FBRyxHQUFHO0VBQ0osWUFBT2lCLFNBQVMsQ0FBQ04sTUFBakI7RUFDRSxXQUFLLENBQUw7RUFDRSxlQUFPLEtBQUtOLE1BQVo7RUFDQTs7RUFDRixXQUFLLENBQUw7RUFDRSxZQUFJRSxTQUFTLEdBQUdVLFNBQVMsQ0FBQyxDQUFELENBQXpCO0VBQ0EsZUFBTyxLQUFLYixPQUFMLENBQWFHLFNBQWIsQ0FBUDtFQUNBOztFQUNGLFdBQUssQ0FBTDtFQUNFLFlBQUlBLFNBQVMsR0FBR1UsU0FBUyxDQUFDLENBQUQsQ0FBekI7RUFDQSxZQUFJUixhQUFhLEdBQUdRLFNBQVMsQ0FBQyxDQUFELENBQTdCO0VBQ0EsWUFBSUgsaUJBQWlCLEdBQUksT0FBT0wsYUFBUCxLQUF5QixRQUExQixHQUNwQkEsYUFEb0IsR0FFcEIsS0FBS0Qsb0JBQUwsQ0FBMEJDLGFBQTFCLENBRko7O0VBR0EsWUFBRyxLQUFLTCxPQUFMLENBQWFHLFNBQWIsQ0FBSCxFQUE0QjtFQUMxQixpQkFBTyxLQUFLSCxPQUFMLENBQWFHLFNBQWIsRUFBd0JPLGlCQUF4QixDQUFQO0VBQ0EsY0FDRUksTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBS2YsT0FBTCxDQUFhRyxTQUFiLENBQVosRUFBcUNJLE1BQXJDLEtBQWdELENBRGxELEVBRUUsT0FBTyxLQUFLUCxPQUFMLENBQWFHLFNBQWIsQ0FBUDtFQUNIOztFQUNEO0VBcEJKOztFQXNCQSxXQUFPLElBQVA7RUFDRDs7RUFDRGEsRUFBQUEsSUFBSSxHQUFHO0VBQ0wsUUFBSUMsVUFBVSxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FBV04sU0FBWCxDQUFqQjs7RUFDQSxRQUFJVixTQUFTLEdBQUdjLFVBQVUsQ0FBQ0csTUFBWCxDQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixDQUF4QixDQUFoQjs7RUFDQSxRQUFJQyxTQUFTLEdBQUdKLFVBQVUsQ0FBQ0csTUFBWCxDQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixDQUF4QixDQUFoQjs7RUFDQSxRQUFJRSxjQUFjLEdBQUdMLFVBQVUsQ0FBQ0csTUFBWCxDQUFrQixDQUFsQixDQUFyQjs7RUFDQU4sSUFBQUEsTUFBTSxDQUFDUyxPQUFQLENBQWUsS0FBS3JCLGlCQUFMLENBQXVCQyxTQUF2QixDQUFmLEVBQ0dxQixPQURILENBQ1csVUFBa0Q7RUFBQSxVQUFqRCxDQUFDQyxzQkFBRCxFQUF5QmQsa0JBQXpCLENBQWlEO0VBQ3pEQSxNQUFBQSxrQkFBa0IsQ0FDZmEsT0FESCxDQUNZbkIsYUFBRCxJQUFtQjtFQUMxQkEsUUFBQUEsYUFBYSxNQUFiLFVBQ0U7RUFDRUMsVUFBQUEsSUFBSSxFQUFFSCxTQURSO0VBRUV1QixVQUFBQSxJQUFJLEVBQUVMO0VBRlIsU0FERiw0QkFLS0MsY0FMTDtFQU9ELE9BVEg7RUFVRCxLQVpIO0VBYUEsV0FBTyxJQUFQO0VBQ0Q7O0VBcEVVOztFQ0FFLGNBQU07RUFDbkJ2QixFQUFBQSxXQUFXLEdBQUc7O0VBQ2QsTUFBSTRCLFVBQUosR0FBaUI7RUFDZixTQUFLQyxTQUFMLEdBQWlCLEtBQUtBLFNBQUwsR0FDYixLQUFLQSxTQURRLEdBRWIsRUFGSjtFQUdBLFdBQU8sS0FBS0EsU0FBWjtFQUNEOztFQUNEQyxFQUFBQSxRQUFRLENBQUNDLFlBQUQsRUFBZUMsZ0JBQWYsRUFBaUM7RUFDdkMsUUFBSUEsZ0JBQUosRUFBc0I7RUFDcEIsV0FBS0osVUFBTCxDQUFnQkcsWUFBaEIsSUFBZ0NDLGdCQUFoQztFQUNELEtBRkQsTUFFTztFQUNMLGFBQU8sS0FBS0osVUFBTCxDQUFnQkUsUUFBaEIsQ0FBUDtFQUNEO0VBQ0Y7O0VBQ0RHLEVBQUFBLE9BQU8sQ0FBQ0YsWUFBRCxFQUFlO0VBQ3BCLFFBQUksS0FBS0gsVUFBTCxDQUFnQkcsWUFBaEIsQ0FBSixFQUFtQztFQUFBOztFQUNqQyxVQUFJYixVQUFVLEdBQUdDLEtBQUssQ0FBQ3pCLFNBQU4sQ0FBZ0J3QyxLQUFoQixDQUFzQkMsSUFBdEIsQ0FBMkJyQixTQUEzQixFQUFzQ29CLEtBQXRDLENBQTRDLENBQTVDLENBQWpCOztFQUNBLGFBQU8seUJBQUtOLFVBQUwsRUFBZ0JHLFlBQWhCLDZDQUFpQ2IsVUFBakMsRUFBUDtFQUNEO0VBQ0Y7O0VBQ0RyQixFQUFBQSxHQUFHLENBQUNrQyxZQUFELEVBQWU7RUFDaEIsUUFBSUEsWUFBSixFQUFrQjtFQUNoQixhQUFPLEtBQUtILFVBQUwsQ0FBZ0JHLFlBQWhCLENBQVA7RUFDRCxLQUZELE1BRU87RUFDTCxXQUFLLElBQUksQ0FBQ0ssYUFBRCxDQUFULElBQTRCckIsTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBS1ksVUFBakIsQ0FBNUIsRUFBMEQ7RUFDeEQsZUFBTyxLQUFLQSxVQUFMLENBQWdCUSxhQUFoQixDQUFQO0VBQ0Q7RUFDRjtFQUNGOztFQTdCa0I7O0VDQ04sWUFBTTtFQUNuQnBDLEVBQUFBLFdBQVcsR0FBRzs7RUFDZCxNQUFJcUMsU0FBSixHQUFnQjtFQUNkLFNBQUtDLFFBQUwsR0FBZ0IsS0FBS0EsUUFBTCxHQUNaLEtBQUtBLFFBRE8sR0FFWixFQUZKO0VBR0EsV0FBTyxLQUFLQSxRQUFaO0VBQ0Q7O0VBQ0RDLEVBQUFBLE9BQU8sQ0FBQ0MsV0FBRCxFQUFjO0VBQ25CLFNBQUtILFNBQUwsQ0FBZUcsV0FBZixJQUE4QixLQUFLSCxTQUFMLENBQWVHLFdBQWYsSUFDMUIsS0FBS0gsU0FBTCxDQUFlRyxXQUFmLENBRDBCLEdBRTFCLElBQUlDLE9BQUosRUFGSjtFQUdBLFdBQU8sS0FBS0osU0FBTCxDQUFlRyxXQUFmLENBQVA7RUFDRDs7RUFDRDNDLEVBQUFBLEdBQUcsQ0FBQzJDLFdBQUQsRUFBYztFQUNmLFdBQU8sS0FBS0gsU0FBTCxDQUFlRyxXQUFmLENBQVA7RUFDRDs7RUFoQmtCOztFQ0ROLFNBQVNFLElBQVQsR0FBZ0I7RUFDN0IsTUFBSUMsSUFBSSxHQUFHLEVBQVg7RUFBQSxNQUFlQyxDQUFmO0VBQUEsTUFBa0JDLE1BQWxCOztFQUNBLE9BQUtELENBQUMsR0FBRyxDQUFULEVBQVlBLENBQUMsR0FBRyxFQUFoQixFQUFvQkEsQ0FBQyxFQUFyQixFQUF5QjtFQUN2QkMsSUFBQUEsTUFBTSxHQUFHQyxJQUFJLENBQUNELE1BQUwsS0FBZ0IsRUFBaEIsR0FBcUIsQ0FBOUI7O0VBRUEsUUFBSUQsQ0FBQyxJQUFJLENBQUwsSUFBVUEsQ0FBQyxJQUFJLEVBQWYsSUFBcUJBLENBQUMsSUFBSSxFQUExQixJQUFnQ0EsQ0FBQyxJQUFJLEVBQXpDLEVBQTZDO0VBQzNDRCxNQUFBQSxJQUFJLElBQUksR0FBUjtFQUNEOztFQUNEQSxJQUFBQSxJQUFJLElBQUksQ0FBQ0MsQ0FBQyxJQUFJLEVBQUwsR0FBVSxDQUFWLEdBQWVBLENBQUMsSUFBSSxFQUFMLEdBQVdDLE1BQU0sR0FBRyxDQUFULEdBQWEsQ0FBeEIsR0FBNkJBLE1BQTdDLEVBQXNERSxRQUF0RCxDQUErRCxFQUEvRCxDQUFSO0VBQ0Q7O0VBQ0QsU0FBT0osSUFBUDtFQUNEOzs7Ozs7Ozs7RUNURCxNQUFNSyxPQUFOLFNBQXNCakQsTUFBdEIsQ0FBNkI7RUFDM0JDLEVBQUFBLFdBQVcsR0FBOEI7RUFBQSxRQUE3QmlELFFBQTZCLHVFQUFsQixFQUFrQjtFQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtFQUN2QyxVQUFNLEdBQUdwQyxTQUFUO0VBQ0EsU0FBS21DLFFBQUwsR0FBZ0JBLFFBQWhCO0VBQ0EsU0FBS0MsT0FBTCxHQUFlQSxPQUFmO0VBQ0Q7O0VBQ0QsTUFBSUMsYUFBSixHQUFvQjtFQUFFLFdBQU8sQ0FDM0IsS0FEMkIsRUFFM0IsUUFGMkIsRUFHM0IsTUFIMkIsRUFJM0IsT0FKMkIsRUFLM0IsYUFMMkIsRUFNM0IsU0FOMkIsRUFPM0IsWUFQMkIsRUFRM0IsVUFSMkIsRUFTM0IsZ0JBVDJCLEVBVTNCLE1BVjJCLEVBVzNCLE9BWDJCLENBQVA7RUFZbkI7O0VBQ0gsTUFBSUYsUUFBSixHQUFlO0VBQUUsV0FBTyxLQUFLRyxTQUFaO0VBQXVCOztFQUN4QyxNQUFJSCxRQUFKLENBQWFBLFFBQWIsRUFBdUI7RUFDckIsU0FBS0csU0FBTCxHQUFpQkgsUUFBakI7RUFDQSxTQUFLRSxhQUFMLENBQW1CMUIsT0FBbkIsQ0FBNEI0QixZQUFELElBQWtCO0VBQzNDLFVBQUdKLFFBQVEsQ0FBQ0ksWUFBRCxDQUFYLEVBQTJCLEtBQUtBLFlBQUwsSUFBcUJKLFFBQVEsQ0FBQ0ksWUFBRCxDQUE3QjtFQUM1QixLQUZEO0VBR0Q7O0VBQ0QsTUFBSUgsT0FBSixHQUFjO0VBQ1osUUFBRyxDQUFDLEtBQUtJLFFBQVQsRUFBbUIsS0FBS0EsUUFBTCxHQUFnQixFQUFoQjtFQUNuQixXQUFPLEtBQUtBLFFBQVo7RUFDRDs7RUFDRCxNQUFJSixPQUFKLENBQVlBLE9BQVosRUFBcUI7RUFBRSxTQUFLSSxRQUFMLEdBQWdCSixPQUFoQjtFQUF5Qjs7RUFDaEQsTUFBSUssR0FBSixHQUFVO0VBQ1IsUUFBRyxLQUFLQyxVQUFSLEVBQW9CO0VBQ2xCLGFBQU8sS0FBS0MsSUFBTCxDQUFVQyxNQUFWLENBQWlCLEtBQUtDLFdBQXRCLENBQVA7RUFDRCxLQUZELE1BRU87RUFDTCxhQUFPLEtBQUtGLElBQVo7RUFDRDtFQUNGOztFQUNELE1BQUlGLEdBQUosQ0FBUUEsR0FBUixFQUFhO0VBQUUsU0FBS0UsSUFBTCxHQUFZRixHQUFaO0VBQWlCOztFQUNoQyxNQUFJSSxXQUFKLEdBQWtCO0VBQ2hCLFFBQUlBLFdBQVcsR0FBRyxFQUFsQjs7RUFDQSxRQUFHLEtBQUtILFVBQVIsRUFBb0I7RUFDbEIsVUFBSUksZUFBZSxHQUFHN0MsTUFBTSxDQUFDUyxPQUFQLENBQWUsS0FBS2dDLFVBQXBCLEVBQ25CSyxNQURtQixDQUNaLENBQUNDLGdCQUFELFdBQXNEO0VBQUEsWUFBbkMsQ0FBQ0MsWUFBRCxFQUFlQyxjQUFmLENBQW1DO0VBQzVELFlBQUlKLGVBQWUsR0FBR0csWUFBWSxDQUFDTCxNQUFiLENBQW9CLEdBQXBCLEVBQXlCTSxjQUF6QixDQUF0QjtFQUNBRixRQUFBQSxnQkFBZ0IsQ0FBQ2pELElBQWpCLENBQXNCK0MsZUFBdEI7RUFDQSxlQUFPRSxnQkFBUDtFQUNELE9BTG1CLEVBS2pCLEVBTGlCLEVBTWpCRyxJQU5pQixDQU1aLEdBTlksQ0FBdEI7RUFPQU4sTUFBQUEsV0FBVyxHQUFHLElBQUlELE1BQUosQ0FBV0UsZUFBWCxDQUFkO0VBQ0Q7O0VBQ0QsV0FBT0QsV0FBUDtFQUNEOztFQUNELE1BQUlPLE1BQUosR0FBYTtFQUFFLFdBQU8sS0FBS0MsT0FBWjtFQUFxQjs7RUFDcEMsTUFBSUQsTUFBSixDQUFXQSxNQUFYLEVBQW1CO0VBQUUsU0FBS0MsT0FBTCxHQUFlRCxNQUFmO0VBQXVCOztFQUM1QyxNQUFJRSxJQUFKLEdBQVc7RUFBRSxXQUFPLEtBQUtDLEtBQVo7RUFBbUI7O0VBQ2hDLE1BQUlELElBQUosQ0FBU0EsSUFBVCxFQUFlO0VBQUUsU0FBS0MsS0FBTCxHQUFhRCxJQUFiO0VBQW1COztFQUNwQyxNQUFJRSxLQUFKLEdBQVk7RUFBRSxXQUFPLEtBQUtDLE1BQVo7RUFBb0I7O0VBQ2xDLE1BQUlELEtBQUosQ0FBVUEsS0FBVixFQUFpQjtFQUFFLFNBQUtDLE1BQUwsR0FBY0QsS0FBZDtFQUFxQjs7RUFDeEMsTUFBSUUsV0FBSixHQUFrQjtFQUFFLFdBQU8sS0FBS0MsWUFBWjtFQUEwQjs7RUFDOUMsTUFBSUQsV0FBSixDQUFnQkEsV0FBaEIsRUFBNkI7RUFBRSxTQUFLQyxZQUFMLEdBQW9CRCxXQUFwQjtFQUFpQzs7RUFDaEUsTUFBSUUsT0FBSixHQUFjO0VBQUUsV0FBTyxLQUFLQyxRQUFaO0VBQXNCOztFQUN0QyxNQUFJRCxPQUFKLENBQVlBLE9BQVosRUFBcUI7RUFBRSxTQUFLQyxRQUFMLEdBQWdCRCxPQUFoQjtFQUF5Qjs7RUFDaEQsTUFBSUUsUUFBSixHQUFlO0VBQUUsV0FBTyxLQUFLQyxTQUFaO0VBQXVCOztFQUN4QyxNQUFJRCxRQUFKLENBQWFBLFFBQWIsRUFBdUI7RUFBRSxTQUFLQyxTQUFMLEdBQWlCRCxRQUFqQjtFQUEyQjs7RUFDcEQsTUFBSUUsY0FBSixHQUFxQjtFQUFFLFdBQU8sS0FBS0MsZUFBWjtFQUE2Qjs7RUFDcEQsTUFBSUQsY0FBSixDQUFtQkEsY0FBbkIsRUFBbUM7RUFBRSxTQUFLQyxlQUFMLEdBQXVCRCxjQUF2QjtFQUF1Qzs7RUFDNUUsTUFBSUUsSUFBSixHQUFXO0VBQUUsV0FBTyxLQUFLQyxLQUFaO0VBQW1COztFQUNoQyxNQUFJRCxJQUFKLENBQVNBLElBQVQsRUFBZTtFQUFFLFNBQUtDLEtBQUwsR0FBYUQsSUFBYjtFQUFtQjs7RUFDcEMsTUFBSUUsS0FBSixHQUFZO0VBQUUsV0FBTyxLQUFLQyxNQUFaO0VBQW9COztFQUNsQyxNQUFJRCxLQUFKLENBQVVBLEtBQVYsRUFBaUI7RUFBRSxTQUFLQyxNQUFMLEdBQWNELEtBQWQ7RUFBcUI7O0VBQ3hDLE1BQUkxQixVQUFKLEdBQWlCO0VBQUUsV0FBTyxLQUFLNEIsV0FBTCxJQUFvQixJQUEzQjtFQUFpQzs7RUFDcEQsTUFBSTVCLFVBQUosQ0FBZUEsVUFBZixFQUEyQjtFQUFFLFNBQUs0QixXQUFMLEdBQW1CNUIsVUFBbkI7RUFBK0I7O0VBQzVELE1BQUk2Qix1QkFBSixHQUE4QjtFQUM1QixXQUFPLEtBQUtDLHdCQUFaO0VBQ0Q7O0VBQ0QsTUFBSUQsdUJBQUosQ0FBNEJBLHVCQUE1QixFQUFxRDtFQUFFLFNBQUtDLHdCQUFMLEdBQWdDRCx1QkFBaEM7RUFBeUQ7O0VBQ2hILE1BQUlFLGVBQUosR0FBc0I7RUFDcEIsUUFBRyxDQUFDLEtBQUtDLGdCQUFULEVBQTJCO0VBQ3pCLFdBQUtILHVCQUFMLEdBQStCLEtBQUtHLGdCQUFwQztFQUNEOztFQUNELFNBQUtBLGdCQUFMLEdBQXdCLElBQUlDLGVBQUosRUFBeEI7RUFDQSxXQUFPLEtBQUtELGdCQUFaO0VBQ0Q7O0VBQ0QsTUFBSTFELFFBQUosR0FBZTtFQUFFLFdBQU8sS0FBSzRELFNBQVo7RUFBdUI7O0VBQ3hDLE1BQUk1RCxRQUFKLENBQWFBLFFBQWIsRUFBdUI7RUFBRSxTQUFLNEQsU0FBTCxHQUFpQjVELFFBQWpCO0VBQTJCOztFQUNwRCxNQUFJNkQsWUFBSixHQUFtQjtFQUFFLFdBQU8sS0FBS0MsYUFBWjtFQUEyQjs7RUFDaEQsTUFBSUQsWUFBSixDQUFpQkEsWUFBakIsRUFBK0I7RUFBRSxTQUFLQyxhQUFMLEdBQXFCRCxZQUFyQjtFQUFtQzs7RUFDcEVFLEVBQUFBLEtBQUssR0FBRztFQUNOLFNBQUtOLGVBQUwsQ0FBcUJNLEtBQXJCO0VBQ0EsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0RDLEVBQUFBLEtBQUssR0FBRztFQUNOLFFBQU1DLFlBQVksR0FBRyxLQUFLNUMsYUFBTCxDQUFtQlUsTUFBbkIsQ0FBMEIsQ0FBQ21DLGFBQUQsRUFBZ0JDLGVBQWhCLEtBQW9DO0VBQ2pGLFVBQUcsS0FBS0EsZUFBTCxDQUFILEVBQTBCRCxhQUFhLENBQUNDLGVBQUQsQ0FBYixHQUFpQyxLQUFLQSxlQUFMLENBQWpDO0VBQzFCLGFBQU9ELGFBQVA7RUFDRCxLQUhvQixFQUdsQixFQUhrQixDQUFyQjtFQUlBRCxJQUFBQSxZQUFZLENBQUNHLE1BQWIsR0FBc0IsS0FBS1gsZUFBTCxDQUFxQlcsTUFBM0M7RUFDQSxRQUFHLEtBQUtiLHVCQUFSLEVBQWlDLEtBQUtBLHVCQUFMLENBQTZCUSxLQUE3QjtFQUNqQyxXQUFPQyxLQUFLLENBQUMsS0FBS3ZDLEdBQU4sRUFBV3dDLFlBQVgsQ0FBTCxDQUNKSSxJQURJLENBQ0VyRSxRQUFELElBQWM7RUFDbEIsV0FBS0EsUUFBTCxHQUFnQkEsUUFBaEI7RUFDQSxhQUFPQSxRQUFRLENBQUNzRSxJQUFULEVBQVA7RUFDRCxLQUpJLEVBS0pELElBTEksQ0FLRXhFLElBQUQsSUFBVTtFQUNkLFdBQUtWLElBQUwsQ0FDRSxPQURGLEVBRUVVLElBRkYsRUFHRSxJQUhGO0VBS0EsYUFBT0EsSUFBUDtFQUNELEtBWkksRUFhSjBFLEtBYkksQ0FhR0MsS0FBRCxJQUFXO0VBQ2hCLFdBQUtyRixJQUFMLENBQ0UsT0FERixFQUVFO0VBQ0VzRixRQUFBQSxPQUFPLEVBQUVEO0VBRFgsT0FGRixFQUtFLElBTEY7RUFPQSxhQUFPQSxLQUFQO0VBQ0QsS0F0QkksQ0FBUDtFQXVCRDs7RUFDS0UsRUFBQUEsU0FBTixHQUFrQjtFQUFBOztFQUFBO0VBQ2hCLFVBQU1ULFlBQVksR0FBRyxLQUFJLENBQUM1QyxhQUFMLENBQW1CVSxNQUFuQixDQUEwQixDQUFDbUMsYUFBRCxFQUFnQkMsZUFBaEIsS0FBb0M7RUFDakYsWUFBRyxLQUFJLENBQUNBLGVBQUQsQ0FBUCxFQUEwQkQsYUFBYSxDQUFDQyxlQUFELENBQWIsR0FBaUMsS0FBSSxDQUFDQSxlQUFELENBQXJDO0VBQzFCLGVBQU9ELGFBQVA7RUFDRCxPQUhvQixFQUdsQixFQUhrQixDQUFyQjs7RUFJQUQsTUFBQUEsWUFBWSxDQUFDRyxNQUFiLEdBQXNCLEtBQUksQ0FBQ1gsZUFBTCxDQUFxQlcsTUFBM0M7RUFDQSxVQUFHLEtBQUksQ0FBQ2IsdUJBQVIsRUFBaUMsS0FBSSxDQUFDQSx1QkFBTCxDQUE2QlEsS0FBN0I7RUFDakMsTUFBQSxLQUFJLENBQUMvRCxRQUFMLFNBQXVCZ0UsS0FBSyxDQUFDLEtBQUksQ0FBQ3ZDLEdBQU4sRUFBV3dDLFlBQVgsQ0FBNUI7RUFDQSxNQUFBLEtBQUksQ0FBQ0osWUFBTCxTQUEwQixLQUFJLENBQUM3RCxRQUFMLENBQWNzRSxJQUFkLEVBQTFCOztFQUNBLFVBQ0UsS0FBSSxDQUFDVCxZQUFMLENBQWtCYyxJQUFsQixJQUEwQixHQUExQixJQUNBLEtBQUksQ0FBQ2QsWUFBTCxDQUFrQmMsSUFBbEIsSUFBMEIsR0FGNUIsRUFHRTtFQUNBLFFBQUEsS0FBSSxDQUFDeEYsSUFBTCxDQUNFLE9BREYsRUFFRSxLQUFJLENBQUMwRSxZQUZQLEVBR0UsS0FIRjs7RUFLQSxjQUFNLEtBQUksQ0FBQ0EsWUFBWDtFQUNELE9BVkQsTUFVTztFQUNMLFFBQUEsS0FBSSxDQUFDMUUsSUFBTCxDQUNFLE9BREYsRUFFRSxLQUFJLENBQUMwRSxZQUZQLEVBR0UsS0FIRjtFQUtEOztFQUNELGFBQU8sS0FBSSxDQUFDQSxZQUFaO0VBMUJnQjtFQTJCakI7O0VBdEowQjs7RUNDN0IsSUFBTWUsS0FBSyxHQUFHLGNBQWMzRyxNQUFkLENBQXFCO0VBQ2pDQyxFQUFBQSxXQUFXLEdBQThCO0VBQUEsUUFBN0JpRCxRQUE2Qix1RUFBbEIsRUFBa0I7RUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7RUFDdkM7RUFDQSxTQUFLRCxRQUFMLEdBQWdCQSxRQUFoQjtFQUNBLFNBQUtDLE9BQUwsR0FBZUEsT0FBZjtFQUNBLFNBQUtqQyxJQUFMLENBQ0UsT0FERixFQUVFLEVBRkYsRUFHRSxJQUhGO0VBS0Q7O0VBQ0QsTUFBSTBCLElBQUosR0FBVztFQUNULFFBQUcsQ0FBQyxLQUFLZ0UsS0FBVCxFQUFnQixLQUFLQSxLQUFMLEdBQWFqRSxJQUFJLEVBQWpCO0VBQ2hCLFdBQU8sS0FBS2lFLEtBQVo7RUFDRDs7RUFDRCxNQUFJeEQsYUFBSixHQUFvQjtFQUFFLFdBQU8sQ0FDM0IsY0FEMkIsRUFFM0IsVUFGMkIsRUFHM0IsVUFIMkIsRUFJM0IsZUFKMkIsRUFLM0Isa0JBTDJCLEVBTTNCLFNBTjJCLEVBTzNCLGNBUDJCLEVBUTNCLGlCQVIyQixDQUFQO0VBU25COztFQUNILE1BQUl5RCwrQkFBSixHQUFzQztFQUFFLFdBQU8sQ0FDN0MsU0FENkMsRUFFN0MsUUFGNkMsQ0FBUDtFQUdyQzs7RUFDSCxNQUFJM0QsUUFBSixHQUFlO0VBQUUsV0FBTyxLQUFLRyxTQUFaO0VBQXVCOztFQUN4QyxNQUFJSCxRQUFKLENBQWFBLFFBQWIsRUFBdUI7RUFDckIsU0FBS0csU0FBTCxHQUFpQkgsUUFBakI7RUFDQSxTQUFLRSxhQUFMLENBQW1CMUIsT0FBbkIsQ0FBNEI0QixZQUFELElBQWtCO0VBQzNDLFVBQUdKLFFBQVEsQ0FBQ0ksWUFBRCxDQUFYLEVBQTJCLEtBQUtBLFlBQUwsSUFBcUJKLFFBQVEsQ0FBQ0ksWUFBRCxDQUE3QjtFQUM1QixLQUZEO0VBR0EsU0FBS3VELCtCQUFMLENBQ0duRixPQURILENBQ1lvRiw4QkFBRCxJQUFvQztFQUMzQyxXQUFLQyxZQUFMLENBQWtCRCw4QkFBbEIsRUFBa0QsSUFBbEQ7RUFDRCxLQUhIO0VBSUQ7O0VBQ0QsTUFBSTNELE9BQUosR0FBYztFQUNaLFFBQUcsQ0FBQyxLQUFLSSxRQUFULEVBQW1CLEtBQUtBLFFBQUwsR0FBZ0IsRUFBaEI7RUFDbkIsV0FBTyxLQUFLQSxRQUFaO0VBQ0Q7O0VBQ0QsTUFBSUosT0FBSixDQUFZQSxPQUFaLEVBQXFCO0VBQUUsU0FBS0ksUUFBTCxHQUFnQkosT0FBaEI7RUFBeUI7O0VBQ2hELE1BQUk2RCxRQUFKLEdBQWU7RUFDYixRQUFHLENBQUMsS0FBS0MsU0FBVCxFQUFvQixLQUFLQSxTQUFMLEdBQWlCLEVBQWpCO0VBQ3BCLFdBQU8sS0FBS0EsU0FBWjtFQUNEOztFQUNELE1BQUlELFFBQUosQ0FBYUEsUUFBYixFQUF1QjtFQUFFLFNBQUtDLFNBQUwsR0FBaUJELFFBQWpCO0VBQTJCOztFQUNwRCxNQUFJcEYsSUFBSixHQUFXO0VBQ1QsUUFBRyxDQUFDLEtBQUtzRixLQUFULEVBQWdCLEtBQUtBLEtBQUwsR0FBYSxFQUFiO0VBQ2hCLFdBQU8sS0FBS0EsS0FBWjtFQUNEOztFQUNELE1BQUlDLFFBQUosR0FBZTtFQUNiLFFBQUcsQ0FBQyxLQUFLQyxTQUFULEVBQW9CLEtBQUtBLFNBQUwsR0FBaUIsRUFBakI7RUFDcEIsV0FBTyxLQUFLQSxTQUFaO0VBQ0Q7O0VBQ0QsTUFBSUQsUUFBSixDQUFhQSxRQUFiLEVBQXVCO0VBQ3JCLFFBQUcsS0FBS0UsWUFBTCxDQUFrQkMsSUFBbEIsS0FBMkIsSUFBOUIsRUFBb0M7RUFDbEMsVUFBR3RHLE1BQU0sQ0FBQ1MsT0FBUCxDQUFlLEtBQUs4RixFQUFwQixFQUF3QjlHLE1BQXhCLEtBQW1DLENBQXRDLEVBQXlDO0VBQ3ZDLGFBQUsyRyxTQUFMLEdBQWlCRCxRQUFqQjtFQUNELE9BRkQsTUFFTztFQUNMLGFBQUtDLFNBQUwsR0FBaUIsS0FBS0csRUFBdEI7RUFDRDtFQUNGLEtBTkQsTUFNTztFQUNMLFdBQUtILFNBQUwsR0FBaUJELFFBQWpCO0VBQ0Q7O0VBQ0QsU0FBS0ssR0FBTCxDQUFTLEtBQUtMLFFBQWQ7RUFDRDs7RUFDRCxNQUFJRSxZQUFKLEdBQW1CO0VBQUUsV0FBTyxLQUFLSSxhQUFMLElBQXNCLEVBQTdCO0VBQWlDOztFQUN0RCxNQUFJSixZQUFKLENBQWlCQSxZQUFqQixFQUErQjtFQUFFLFNBQUtJLGFBQUwsR0FBcUJKLFlBQXJCO0VBQW1DOztFQUNwRSxNQUFJSyxnQkFBSixHQUF1QjtFQUFFLFdBQU8sRUFBUDtFQUFXOztFQUNwQyxNQUFJSCxFQUFKLEdBQVM7RUFBRSxXQUFPLEtBQUtJLEdBQVo7RUFBaUI7O0VBQzVCLE1BQUlBLEdBQUosR0FBVTtFQUNSLFFBQUlKLEVBQUUsR0FBR0YsWUFBWSxDQUFDTyxPQUFiLENBQXFCLEtBQUtQLFlBQUwsQ0FBa0JRLFFBQXZDLEtBQW9EQyxJQUFJLENBQUNDLFNBQUwsQ0FBZSxLQUFLTCxnQkFBcEIsQ0FBN0Q7RUFDQSxXQUFPSSxJQUFJLENBQUNFLEtBQUwsQ0FBV1QsRUFBWCxDQUFQO0VBQ0Q7O0VBQ0QsTUFBSUksR0FBSixDQUFRSixFQUFSLEVBQVk7RUFDVkEsSUFBQUEsRUFBRSxHQUFHTyxJQUFJLENBQUNDLFNBQUwsQ0FBZVIsRUFBZixDQUFMO0VBQ0FGLElBQUFBLFlBQVksQ0FBQ1ksT0FBYixDQUFxQixLQUFLWixZQUFMLENBQWtCUSxRQUF2QyxFQUFpRE4sRUFBakQ7RUFDRDs7RUFDRFcsRUFBQUEsV0FBVyxDQUFDQyxTQUFELEVBQVk7RUFDckIsS0FDRSxLQURGLEVBRUUsSUFGRixFQUdFekcsT0FIRixDQUdXeUMsTUFBRCxJQUFZO0VBQ3BCLFdBQUs0QyxZQUFMLENBQWtCb0IsU0FBbEIsRUFBNkJoRSxNQUE3QjtFQUNELEtBTEQ7RUFNQSxXQUFPLElBQVA7RUFDRDs7RUFDRDRDLEVBQUFBLFlBQVksQ0FBQ29CLFNBQUQsRUFBWWhFLE1BQVosRUFBb0I7RUFDOUIsUUFBTWlFLFFBQVEsR0FBR0QsU0FBUyxDQUFDeEUsTUFBVixDQUFpQixHQUFqQixDQUFqQjtFQUNBLFFBQU0wRSxjQUFjLEdBQUdGLFNBQVMsQ0FBQ3hFLE1BQVYsQ0FBaUIsUUFBakIsQ0FBdkI7RUFDQSxRQUFNMkUsaUJBQWlCLEdBQUdILFNBQVMsQ0FBQ3hFLE1BQVYsQ0FBaUIsV0FBakIsQ0FBMUI7RUFDQSxRQUFNNEUsSUFBSSxHQUFHLEtBQUtILFFBQUwsS0FBa0IsRUFBL0I7RUFDQSxRQUFNSSxVQUFVLEdBQUcsS0FBS0gsY0FBTCxLQUF3QixFQUEzQztFQUNBLFFBQU1JLGFBQWEsR0FBRyxLQUFLSCxpQkFBTCxLQUEyQixFQUFqRDs7RUFDQSxRQUNFdEgsTUFBTSxDQUFDMEgsTUFBUCxDQUFjSCxJQUFkLEVBQW9COUgsTUFBcEIsSUFDQU8sTUFBTSxDQUFDMEgsTUFBUCxDQUFjRixVQUFkLEVBQTBCL0gsTUFEMUIsSUFFQU8sTUFBTSxDQUFDMEgsTUFBUCxDQUFjRCxhQUFkLEVBQTZCaEksTUFIL0IsRUFJRTtFQUNBTyxNQUFBQSxNQUFNLENBQUNTLE9BQVAsQ0FBZStHLFVBQWYsRUFDRzlHLE9BREgsQ0FDVyxVQUF1QztFQUFBLFlBQXRDLENBQUNpSCxhQUFELEVBQWdCQyxnQkFBaEIsQ0FBc0M7RUFDOUMsWUFBTSxDQUFDQyxjQUFELEVBQWlCQyxhQUFqQixJQUFrQ0gsYUFBYSxDQUFDSSxLQUFkLENBQW9CLEdBQXBCLENBQXhDO0VBQ0EsWUFBTUMsNEJBQTRCLEdBQUdILGNBQWMsQ0FBQ0ksU0FBZixDQUF5QixDQUF6QixFQUE0QixDQUE1QixDQUFyQztFQUNBLFlBQU1DLDJCQUEyQixHQUFHTCxjQUFjLENBQUNJLFNBQWYsQ0FBeUJKLGNBQWMsQ0FBQ3BJLE1BQWYsR0FBd0IsQ0FBakQsQ0FBcEM7RUFDQSxZQUFJMEksV0FBVyxHQUFHLEVBQWxCOztFQUNBLFlBQ0VILDRCQUE0QixLQUFLLEdBQWpDLElBQ0FFLDJCQUEyQixLQUFLLEdBRmxDLEVBR0U7RUFDQUMsVUFBQUEsV0FBVyxHQUFHbkksTUFBTSxDQUFDUyxPQUFQLENBQWU4RyxJQUFmLEVBQ1h6RSxNQURXLENBQ0osQ0FBQ3NGLFlBQUQsWUFBMEM7RUFBQSxnQkFBM0IsQ0FBQ2hCLFFBQUQsRUFBV2lCLFVBQVgsQ0FBMkI7RUFDaEQsZ0JBQUlDLDBCQUEwQixHQUFHVCxjQUFjLENBQUMxRyxLQUFmLENBQXFCLENBQXJCLEVBQXdCLENBQUMsQ0FBekIsQ0FBakM7RUFDQSxnQkFBSW9ILG9CQUFvQixHQUFHLElBQUlDLE1BQUosQ0FBV0YsMEJBQVgsQ0FBM0I7O0VBQ0EsZ0JBQUdsQixRQUFRLENBQUNxQixLQUFULENBQWVGLG9CQUFmLENBQUgsRUFBeUM7RUFDdkNILGNBQUFBLFlBQVksQ0FBQ3RJLElBQWIsQ0FBa0J1SSxVQUFsQjtFQUNEOztFQUNELG1CQUFPRCxZQUFQO0VBQ0QsV0FSVyxFQVFULEVBUlMsQ0FBZDtFQVNELFNBYkQsTUFhTyxJQUFHYixJQUFJLENBQUNNLGNBQUQsQ0FBUCxFQUF5QjtFQUM5Qk0sVUFBQUEsV0FBVyxDQUFDckksSUFBWixDQUFpQnlILElBQUksQ0FBQ00sY0FBRCxDQUFyQjtFQUNEOztFQUNELFlBQUlhLGlCQUFpQixHQUFHakIsYUFBYSxDQUFDRyxnQkFBRCxDQUFyQzs7RUFDQSxZQUNFYyxpQkFBaUIsSUFDakJBLGlCQUFpQixDQUFDbEosSUFBbEIsQ0FBdUJ1SSxLQUF2QixDQUE2QixHQUE3QixFQUFrQ3RJLE1BQWxDLEtBQTZDLENBRi9DLEVBR0U7RUFDQWlKLFVBQUFBLGlCQUFpQixHQUFHQSxpQkFBaUIsQ0FBQ0MsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBcEI7RUFDRDs7RUFDRCxZQUNFZCxjQUFjLElBQ2RDLGFBREEsSUFFQUssV0FBVyxDQUFDMUksTUFGWixJQUdBaUosaUJBSkYsRUFLRTtFQUNBUCxVQUFBQSxXQUFXLENBQ1J6SCxPQURILENBQ1kySCxVQUFELElBQWdCO0VBQ3ZCLGdCQUFJO0VBQ0Ysc0JBQU9sRixNQUFQO0VBQ0UscUJBQUssSUFBTDtFQUNFa0Ysa0JBQUFBLFVBQVUsQ0FBQ2xGLE1BQUQsQ0FBVixDQUFtQjJFLGFBQW5CLEVBQWtDWSxpQkFBbEM7RUFDQTs7RUFDRixxQkFBSyxLQUFMO0VBQ0VMLGtCQUFBQSxVQUFVLENBQUNsRixNQUFELENBQVYsQ0FBbUIyRSxhQUFuQixFQUFrQ1ksaUJBQWxDO0VBQ0E7RUFOSjtFQVFELGFBVEQsQ0FTRSxPQUFNbkQsS0FBTixFQUFhO0VBQ2Isb0JBQU1BLEtBQU47RUFDRDtFQUNGLFdBZEg7RUFlRDtFQUNGLE9BbkRIO0VBb0REOztFQUNELFdBQU8sSUFBUDtFQUNEOztFQUNEcUQsRUFBQUEsS0FBSyxHQUFHO0VBQ04sUUFBSXJDLEVBQUUsR0FBRyxLQUFLSSxHQUFkOztFQUNBLFlBQU81RyxTQUFTLENBQUNOLE1BQWpCO0VBQ0UsV0FBSyxDQUFMO0VBQ0UsWUFBSVUsVUFBVSxHQUFHSCxNQUFNLENBQUNTLE9BQVAsQ0FBZVYsU0FBUyxDQUFDLENBQUQsQ0FBeEIsQ0FBakI7O0VBQ0FJLFFBQUFBLFVBQVUsQ0FBQ08sT0FBWCxDQUFtQixXQUFrQjtFQUFBLGNBQWpCLENBQUNtSSxHQUFELEVBQU1DLEtBQU4sQ0FBaUI7RUFDbkN2QyxVQUFBQSxFQUFFLENBQUNzQyxHQUFELENBQUYsR0FBVUMsS0FBVjtFQUNELFNBRkQ7O0VBR0E7O0VBQ0YsV0FBSyxDQUFMO0VBQ0UsWUFBSUQsSUFBRyxHQUFHOUksU0FBUyxDQUFDLENBQUQsQ0FBbkI7RUFDQSxZQUFJK0ksS0FBSyxHQUFHL0ksU0FBUyxDQUFDLENBQUQsQ0FBckI7RUFDQXdHLFFBQUFBLEVBQUUsQ0FBQ3NDLElBQUQsQ0FBRixHQUFVQyxLQUFWO0VBQ0E7RUFYSjs7RUFhQSxTQUFLbkMsR0FBTCxHQUFXSixFQUFYO0VBQ0EsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0R3QyxFQUFBQSxPQUFPLEdBQUc7RUFDUixZQUFPaEosU0FBUyxDQUFDTixNQUFqQjtFQUNFLFdBQUssQ0FBTDtFQUNFLGVBQU8sS0FBS2tILEdBQVo7RUFDQTs7RUFDRixXQUFLLENBQUw7RUFDRSxZQUFJSixFQUFFLEdBQUcsS0FBS0ksR0FBZDtFQUNBLFlBQUlrQyxLQUFHLEdBQUc5SSxTQUFTLENBQUMsQ0FBRCxDQUFuQjtFQUNBLGVBQU93RyxFQUFFLENBQUNzQyxLQUFELENBQVQ7RUFDQSxhQUFLbEMsR0FBTCxHQUFXSixFQUFYO0VBQ0E7RUFUSjs7RUFXQSxXQUFPLElBQVA7RUFDRDs7RUFDRHlDLEVBQUFBLGVBQWUsQ0FBQ0gsR0FBRCxFQUFNQyxLQUFOLEVBQWFHLE1BQWIsRUFBcUI7RUFDbEMsUUFBTUMsbUJBQW1CLEdBQUcsS0FBS3RJLElBQUwsQ0FBVWlJLEdBQVYsQ0FBNUI7O0VBQ0EsUUFBRyxDQUFDSSxNQUFKLEVBQVk7RUFDVixXQUFLL0ksSUFBTCxDQUFVLFlBQVl5QyxNQUFaLENBQW1CLEdBQW5CLEVBQXdCa0csR0FBeEIsQ0FBVixFQUF3QztFQUN0Q0EsUUFBQUEsR0FBRyxFQUFFQSxHQURpQztFQUV0Q0MsUUFBQUEsS0FBSyxFQUFFLEtBQUtLLEdBQUwsQ0FBU04sR0FBVDtFQUYrQixPQUF4QyxFQUdHO0VBQ0RBLFFBQUFBLEdBQUcsRUFBRUEsR0FESjtFQUVEQyxRQUFBQSxLQUFLLEVBQUVBO0VBRk4sT0FISCxFQU1HLElBTkg7RUFPRDs7RUFDRCxRQUFHLENBQUNJLG1CQUFKLEVBQXlCO0VBQ3ZCbEosTUFBQUEsTUFBTSxDQUFDb0osZ0JBQVAsQ0FBd0IsS0FBS3hJLElBQTdCLEVBQW1DO0VBQ2pDLFNBQUMsSUFBSStCLE1BQUosQ0FBV2tHLEdBQVgsQ0FBRCxHQUFtQjtFQUNqQlEsVUFBQUEsWUFBWSxFQUFFLElBREc7RUFFakJDLFVBQUFBLFFBQVEsRUFBRSxJQUZPO0VBR2pCQyxVQUFBQSxVQUFVLEVBQUU7RUFISyxTQURjO0VBTWpDLFNBQUNWLEdBQUQsR0FBTztFQUNMUSxVQUFBQSxZQUFZLEVBQUUsSUFEVDtFQUVMRSxVQUFBQSxVQUFVLEVBQUUsSUFGUDs7RUFHTEosVUFBQUEsR0FBRyxHQUFHO0VBQUUsbUJBQU8sS0FBSyxJQUFJeEcsTUFBSixDQUFXa0csR0FBWCxDQUFMLENBQVA7RUFBOEIsV0FIakM7O0VBSUxyQyxVQUFBQSxHQUFHLENBQUNzQyxLQUFELEVBQVE7RUFBRSxpQkFBSyxJQUFJbkcsTUFBSixDQUFXa0csR0FBWCxDQUFMLElBQXdCQyxLQUF4QjtFQUErQjs7RUFKdkM7RUFOMEIsT0FBbkM7RUFhRDs7RUFDRCxTQUFLbEksSUFBTCxDQUFVaUksR0FBVixJQUFpQkMsS0FBakI7O0VBQ0EsUUFBR0ksbUJBQW1CLFlBQVl2RCxLQUFsQyxFQUF5QztBQUN2QztFQUNBLFdBQUsvRSxJQUFMLENBQVVpSSxHQUFWLEVBQ0dqSyxFQURILENBQ00sV0FETixFQUNtQixLQUFLc0IsSUFBTCxDQUFVc0osS0FBSyxDQUFDaEssSUFBaEIsRUFBc0JnSyxLQUFLLENBQUM1SSxJQUE1QixFQUFrQzZJLEtBQWxDLENBRG5CLEVBRUc3SyxFQUZILENBRU0sS0FGTixFQUVhLEtBQUtzQixJQUFMLENBQVVzSixLQUFLLENBQUNoSyxJQUFoQixFQUFzQmdLLEtBQUssQ0FBQzVJLElBQTVCLEVBQWtDNkksS0FBbEMsQ0FGYixFQUdHN0ssRUFISCxDQUdNLGFBSE4sRUFHcUIsS0FBS3NCLElBQUwsQ0FBVXNKLEtBQUssQ0FBQ2hLLElBQWhCLEVBQXNCZ0ssS0FBSyxDQUFDNUksSUFBNUIsRUFBa0M2SSxLQUFsQyxDQUhyQixFQUlHN0ssRUFKSCxDQUlNLE9BSk4sRUFJZSxLQUFLc0IsSUFBTCxDQUFVc0osS0FBSyxDQUFDaEssSUFBaEIsRUFBc0JnSyxLQUFLLENBQUM1SSxJQUE1QixFQUFrQzZJLEtBQWxDLENBSmY7RUFLRDs7RUFDRCxRQUFHLENBQUNSLE1BQUosRUFBWTtFQUNWLFdBQUsvSSxJQUFMLENBQVUsTUFBTXlDLE1BQU4sQ0FBYSxHQUFiLEVBQWtCa0csR0FBbEIsQ0FBVixFQUFrQztFQUNoQ0EsUUFBQUEsR0FBRyxFQUFFQSxHQUQyQjtFQUVoQ0MsUUFBQUEsS0FBSyxFQUFFQTtFQUZ5QixPQUFsQyxFQUdHLElBSEg7RUFJRDs7RUFDRCxXQUFPLElBQVA7RUFDRDs7RUFDRFksRUFBQUEsaUJBQWlCLENBQUNiLEdBQUQsRUFBTUksTUFBTixFQUFjO0VBQzdCLFFBQUcsQ0FBQ0EsTUFBSixFQUFZO0VBQ1YsV0FBSy9JLElBQUwsQ0FBVSxjQUFjeUMsTUFBZCxDQUFxQixHQUFyQixFQUEwQjVDLFNBQVMsQ0FBQyxDQUFELENBQW5DLENBQVYsRUFBbUQsSUFBbkQ7RUFDRDs7RUFDRCxRQUFHLEtBQUthLElBQUwsQ0FBVWlJLEdBQVYsQ0FBSCxFQUFtQjtFQUNqQixhQUFPLEtBQUtqSSxJQUFMLENBQVVpSSxHQUFWLENBQVA7RUFDRDs7RUFDRCxRQUFHLENBQUNJLE1BQUosRUFBWTtFQUNWLFdBQUsvSSxJQUFMLENBQVUsUUFBUXlDLE1BQVIsQ0FBZSxHQUFmLEVBQW9CNUMsU0FBUyxDQUFDLENBQUQsQ0FBN0IsQ0FBVixFQUE2QyxJQUE3QztFQUNEOztFQUNELFdBQU8sSUFBUDtFQUNEOztFQUNEb0osRUFBQUEsR0FBRyxHQUFHO0VBQ0osUUFBR3BKLFNBQVMsQ0FBQyxDQUFELENBQVosRUFBaUIsT0FBTyxLQUFLYSxJQUFMLENBQVViLFNBQVMsQ0FBQyxDQUFELENBQW5CLENBQVA7RUFDakIsV0FBT0MsTUFBTSxDQUFDUyxPQUFQLENBQWUsS0FBS0csSUFBcEIsRUFDSmtDLE1BREksQ0FDRyxDQUFDb0QsS0FBRCxZQUF5QjtFQUFBLFVBQWpCLENBQUMyQyxHQUFELEVBQU1DLEtBQU4sQ0FBaUI7RUFDL0I1QyxNQUFBQSxLQUFLLENBQUMyQyxHQUFELENBQUwsR0FBYUMsS0FBYjtFQUNBLGFBQU81QyxLQUFQO0VBQ0QsS0FKSSxFQUlGLEVBSkUsQ0FBUDtFQUtEOztFQUNETSxFQUFBQSxHQUFHLEdBQUc7RUFDSixRQUFNckcsVUFBVSxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FBV04sU0FBWCxDQUFuQjs7RUFDQSxRQUFJOEksR0FBSixFQUFTQyxLQUFULEVBQWdCRyxNQUFoQjs7RUFDQSxRQUFHOUksVUFBVSxDQUFDVixNQUFYLEtBQXNCLENBQXpCLEVBQTRCO0VBQzFCb0osTUFBQUEsR0FBRyxHQUFHMUksVUFBVSxDQUFDLENBQUQsQ0FBaEI7RUFDQTJJLE1BQUFBLEtBQUssR0FBRzNJLFVBQVUsQ0FBQyxDQUFELENBQWxCO0VBQ0E4SSxNQUFBQSxNQUFNLEdBQUc5SSxVQUFVLENBQUMsQ0FBRCxDQUFuQjtFQUNBLFVBQUcsQ0FBQzhJLE1BQUosRUFBWSxLQUFLL0ksSUFBTCxDQUFVLFdBQVYsRUFBdUIsS0FBS1UsSUFBNUIsRUFBa0NaLE1BQU0sQ0FBQzJKLE1BQVAsQ0FDNUMsRUFENEMsRUFFNUMsS0FBSy9JLElBRnVDLEVBRzVDO0VBQ0UsU0FBQ2lJLEdBQUQsR0FBT0M7RUFEVCxPQUg0QyxDQUFsQyxFQU1ULElBTlM7RUFPWixXQUFLRSxlQUFMLENBQXFCSCxHQUFyQixFQUEwQkMsS0FBMUIsRUFBaUNHLE1BQWpDO0VBQ0EsVUFBRyxDQUFDQSxNQUFKLEVBQVksS0FBSy9JLElBQUwsQ0FBVSxLQUFWLEVBQWlCLEtBQUtVLElBQXRCLEVBQTRCLElBQTVCO0VBQ1osVUFBRyxLQUFLeUYsWUFBTCxDQUFrQlEsUUFBckIsRUFBK0IsS0FBSytCLEtBQUwsQ0FBVzdJLFNBQVMsQ0FBQyxDQUFELENBQXBCLEVBQXlCQSxTQUFTLENBQUMsQ0FBRCxDQUFsQztFQUNoQyxLQWRELE1BY08sSUFBR0ksVUFBVSxDQUFDVixNQUFYLEtBQXNCLENBQXpCLEVBQTRCO0VBQ2pDLFVBQ0UsT0FBT1UsVUFBVSxDQUFDLENBQUQsQ0FBakIsS0FBeUIsUUFBekIsSUFDQSxPQUFPQSxVQUFVLENBQUMsQ0FBRCxDQUFqQixLQUF5QixTQUYzQixFQUdFO0VBQ0E4SSxRQUFBQSxNQUFNLEdBQUc5SSxVQUFVLENBQUMsQ0FBRCxDQUFuQjtFQUNBLFlBQUcsQ0FBQzhJLE1BQUosRUFBWSxLQUFLL0ksSUFBTCxDQUFVLFdBQVYsRUFBdUIsS0FBS1UsSUFBNUIsRUFBa0NaLE1BQU0sQ0FBQzJKLE1BQVAsQ0FDNUMsRUFENEMsRUFFNUMsS0FBSy9JLElBRnVDLEVBRzVDVCxVQUFVLENBQUMsQ0FBRCxDQUhrQyxDQUFsQyxFQUlULElBSlM7RUFLWkgsUUFBQUEsTUFBTSxDQUFDUyxPQUFQLENBQWVOLFVBQVUsQ0FBQyxDQUFELENBQXpCLEVBQThCTyxPQUE5QixDQUFzQyxXQUFrQjtFQUFBLGNBQWpCLENBQUNtSSxHQUFELEVBQU1DLEtBQU4sQ0FBaUI7RUFDdEQsZUFBS0UsZUFBTCxDQUFxQkgsR0FBckIsRUFBMEJDLEtBQTFCLEVBQWlDRyxNQUFqQztFQUNELFNBRkQ7RUFHQSxZQUFHLENBQUNBLE1BQUosRUFBWSxLQUFLL0ksSUFBTCxDQUFVLEtBQVYsRUFBaUIsS0FBS1UsSUFBdEIsRUFBNEIsSUFBNUI7RUFDYixPQWRELE1BY087RUFDTCxZQUFHLENBQUNxSSxNQUFKLEVBQVksS0FBSy9JLElBQUwsQ0FBVSxXQUFWLEVBQXVCLEtBQUtVLElBQTVCLEVBQWtDWixNQUFNLENBQUMySixNQUFQLENBQzVDLEVBRDRDLEVBRTVDLEtBQUsvSSxJQUZ1QyxFQUc1QztFQUNFLFdBQUNULFVBQVUsQ0FBQyxDQUFELENBQVgsR0FBaUJBLFVBQVUsQ0FBQyxDQUFEO0VBRDdCLFNBSDRDLENBQWxDLEVBTVQsSUFOUztFQU9aLGFBQUs2SSxlQUFMLENBQXFCN0ksVUFBVSxDQUFDLENBQUQsQ0FBL0IsRUFBb0NBLFVBQVUsQ0FBQyxDQUFELENBQTlDO0VBQ0EsWUFBRyxDQUFDOEksTUFBSixFQUFZLEtBQUsvSSxJQUFMLENBQVUsS0FBVixFQUFpQixLQUFLVSxJQUF0QixFQUE0QixJQUE1QjtFQUNiOztFQUNELFVBQUcsS0FBS3lGLFlBQUwsQ0FBa0JRLFFBQXJCLEVBQStCLEtBQUsrQixLQUFMLENBQVd6SSxVQUFVLENBQUMsQ0FBRCxDQUFyQixFQUEwQkEsVUFBVSxDQUFDLENBQUQsQ0FBcEM7RUFDaEMsS0EzQk0sTUEyQkEsSUFDTEEsVUFBVSxDQUFDVixNQUFYLEtBQXNCLENBQXRCLElBQ0EsQ0FBQ1csS0FBSyxDQUFDd0osT0FBTixDQUFjekosVUFBVSxDQUFDLENBQUQsQ0FBeEIsQ0FERCxJQUVBLE9BQU9BLFVBQVUsQ0FBQyxDQUFELENBQWpCLEtBQXlCLFFBSHBCLEVBSUw7RUFDQSxVQUFHLENBQUM4SSxNQUFKLEVBQVksS0FBSy9JLElBQUwsQ0FBVSxXQUFWLEVBQXVCLEtBQUtVLElBQTVCLEVBQWtDWixNQUFNLENBQUMySixNQUFQLENBQzVDLEVBRDRDLEVBRTVDLEtBQUsvSSxJQUZ1QyxFQUc1Q1QsVUFBVSxDQUFDLENBQUQsQ0FIa0MsQ0FBbEMsRUFJVCxJQUpTO0VBS1pILE1BQUFBLE1BQU0sQ0FBQ1MsT0FBUCxDQUFlTixVQUFVLENBQUMsQ0FBRCxDQUF6QixFQUE4Qk8sT0FBOUIsQ0FBc0MsV0FBa0I7RUFBQSxZQUFqQixDQUFDbUksR0FBRCxFQUFNQyxLQUFOLENBQWlCO0VBQ3RELGFBQUtFLGVBQUwsQ0FBcUJILEdBQXJCLEVBQTBCQyxLQUExQjtFQUNBLFlBQUcsS0FBS3pDLFlBQUwsQ0FBa0JRLFFBQXJCLEVBQStCLEtBQUsrQixLQUFMLENBQVdDLEdBQVgsRUFBZ0JDLEtBQWhCO0VBQ2hDLE9BSEQ7RUFJQSxVQUFHLENBQUNHLE1BQUosRUFBWSxLQUFLL0ksSUFBTCxDQUFVLEtBQVYsRUFBaUIsS0FBS1UsSUFBdEIsRUFBNEIsSUFBNUI7RUFDYjs7RUFDRCxXQUFPLElBQVA7RUFDRDs7RUFDRGlKLEVBQUFBLEtBQUssR0FBRztFQUNOLFFBQUlaLE1BQUo7O0VBQ0EsUUFDRWxKLFNBQVMsQ0FBQ04sTUFBVixLQUFxQixDQUR2QixFQUVFO0VBQ0F3SixNQUFBQSxNQUFNLEdBQUdsSixTQUFTLENBQUMsQ0FBRCxDQUFsQjtFQUNBLFVBQUcsQ0FBQ2tKLE1BQUosRUFBWSxLQUFLL0ksSUFBTCxDQUFVLGFBQVYsRUFBeUIsS0FBS1UsSUFBOUIsRUFBb0MsSUFBcEM7RUFDWixXQUFLOEksaUJBQUwsQ0FBdUIzSixTQUFTLENBQUMsQ0FBRCxDQUFoQyxFQUFxQ2tKLE1BQXJDO0VBQ0EsVUFBRyxDQUFDQSxNQUFKLEVBQVksS0FBSy9JLElBQUwsQ0FBVSxPQUFWLEVBQW1CLElBQW5CO0VBQ2IsS0FQRCxNQU9PLElBQ0xILFNBQVMsQ0FBQ04sTUFBVixLQUFxQixDQURoQixFQUVMO0VBQ0EsVUFBRyxPQUFPTSxTQUFTLENBQUMsQ0FBRCxDQUFoQixLQUF3QixTQUEzQixFQUFzQztFQUNwQ2tKLFFBQUFBLE1BQU0sR0FBR2xKLFNBQVMsQ0FBQyxDQUFELENBQWxCO0VBQ0EsWUFBRyxDQUFDa0osTUFBSixFQUFZLEtBQUsvSSxJQUFMLENBQVUsYUFBVixFQUF5QixLQUFLVSxJQUE5QixFQUFvQyxJQUFwQztFQUNaWixRQUFBQSxNQUFNLENBQUNDLElBQVAsQ0FBWSxLQUFLVyxJQUFqQixFQUF1QkYsT0FBdkIsQ0FBZ0NtSSxHQUFELElBQVM7RUFDdEMsZUFBS2EsaUJBQUwsQ0FBdUJiLEdBQXZCLEVBQTRCSSxNQUE1QjtFQUNELFNBRkQ7RUFHQSxZQUFHLENBQUNBLE1BQUosRUFBWSxLQUFLL0ksSUFBTCxDQUFVLE9BQVYsRUFBbUIsSUFBbkI7RUFDYjtFQUNGLEtBWE0sTUFXQTtFQUNMLFVBQUcsQ0FBQytJLE1BQUosRUFBWSxLQUFLL0ksSUFBTCxDQUFVLGFBQVYsRUFBeUIsS0FBS1UsSUFBOUIsRUFBb0MsSUFBcEM7RUFDWlosTUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBS1csSUFBakIsRUFBdUJGLE9BQXZCLENBQWdDbUksR0FBRCxJQUFTO0VBQ3RDLGFBQUthLGlCQUFMLENBQXVCYixHQUF2QjtFQUNELE9BRkQ7RUFHQSxVQUFHLENBQUNJLE1BQUosRUFBWSxLQUFLL0ksSUFBTCxDQUFVLE9BQVYsRUFBbUIsSUFBbkI7RUFDYjs7RUFDRCxRQUFHLEtBQUttRyxZQUFMLENBQWtCUSxRQUFyQixFQUErQixLQUFLa0MsT0FBTCxDQUFhRixHQUFiO0VBQy9CLFdBQU8sSUFBUDtFQUNEOztFQUNEN0IsRUFBQUEsS0FBSyxHQUFtQjtFQUFBLFFBQWxCcEcsSUFBa0IsdUVBQVgsS0FBS0EsSUFBTTtFQUN0QixXQUFPWixNQUFNLENBQUNTLE9BQVAsQ0FBZUcsSUFBZixFQUFxQmtDLE1BQXJCLENBQTRCLENBQUNvRCxLQUFELFlBQXlCO0VBQUEsVUFBakIsQ0FBQzJDLEdBQUQsRUFBTUMsS0FBTixDQUFpQjs7RUFDMUQsVUFBR0EsS0FBSyxZQUFZbkQsS0FBcEIsRUFBMkI7RUFDekJPLFFBQUFBLEtBQUssQ0FBQzJDLEdBQUQsQ0FBTCxHQUFhQyxLQUFLLENBQUM5QixLQUFOLEVBQWI7RUFDRCxPQUZELE1BRU87RUFDTGQsUUFBQUEsS0FBSyxDQUFDMkMsR0FBRCxDQUFMLEdBQWFDLEtBQWI7RUFDRDs7RUFDRCxhQUFPNUMsS0FBUDtFQUNELEtBUE0sRUFPSixFQVBJLENBQVA7RUFRRDs7RUFsV2dDLENBQW5DOztFQ0NBLE1BQU00RCxVQUFOLFNBQXlCOUssTUFBekIsQ0FBZ0M7RUFDOUJDLEVBQUFBLFdBQVcsR0FBOEI7RUFBQSxRQUE3QmlELFFBQTZCLHVFQUFsQixFQUFrQjtFQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtFQUN2QztFQUNBLFNBQUtELFFBQUwsR0FBZ0JBLFFBQWhCO0VBQ0EsU0FBS0MsT0FBTCxHQUFlQSxPQUFmO0VBQ0Q7O0VBQ0QsTUFBSUMsYUFBSixHQUFvQjtFQUFFLFdBQU8sQ0FDM0IsYUFEMkIsRUFFM0IsT0FGMkIsRUFHM0IsY0FIMkIsRUFJM0IsVUFKMkIsRUFLM0IsVUFMMkIsRUFNM0IsZUFOMkIsRUFPM0Isa0JBUDJCLEVBUTNCLGNBUjJCLENBQVA7RUFTbkI7O0VBQ0gsTUFBSXlELCtCQUFKLEdBQXNDO0VBQUUsV0FBTyxDQUM3QyxTQUQ2QyxDQUFQO0VBRXJDOztFQUNILE1BQUkzRCxRQUFKLEdBQWU7RUFBRSxXQUFPLEtBQUtHLFNBQVo7RUFBdUI7O0VBQ3hDLE1BQUlILFFBQUosQ0FBYUEsUUFBYixFQUF1QjtFQUNyQixTQUFLRyxTQUFMLEdBQWlCSCxRQUFqQjtFQUNBLFNBQUtFLGFBQUwsQ0FBbUIxQixPQUFuQixDQUE0QjRCLFlBQUQsSUFBa0I7RUFDM0MsVUFBR0osUUFBUSxDQUFDSSxZQUFELENBQVgsRUFBMkIsS0FBS0EsWUFBTCxJQUFxQkosUUFBUSxDQUFDSSxZQUFELENBQTdCO0VBQzVCLEtBRkQ7RUFHQSxTQUFLdUQsK0JBQUwsQ0FDR25GLE9BREgsQ0FDWW9GLDhCQUFELElBQW9DO0VBQzNDLFdBQUtDLFlBQUwsQ0FBa0JELDhCQUFsQixFQUFrRCxJQUFsRDtFQUNELEtBSEg7RUFJRDs7RUFDRCxNQUFJM0QsT0FBSixHQUFjO0VBQ1osUUFBRyxDQUFDLEtBQUtJLFFBQVQsRUFBbUIsS0FBS0EsUUFBTCxHQUFnQixFQUFoQjtFQUNuQixXQUFPLEtBQUtBLFFBQVo7RUFDRDs7RUFDRCxNQUFJSixPQUFKLENBQVlBLE9BQVosRUFBcUI7RUFBRSxTQUFLSSxRQUFMLEdBQWdCSixPQUFoQjtFQUF5Qjs7RUFDaEQsTUFBSXVFLGdCQUFKLEdBQXVCO0VBQUUsV0FBTyxFQUFQO0VBQVc7O0VBQ3BDLE1BQUlxRCxrQkFBSixHQUF5QjtFQUFFLFdBQU8sS0FBUDtFQUFjOztFQUN6QyxNQUFJNUQsUUFBSixHQUFlO0VBQUUsV0FBTyxLQUFLQyxTQUFaO0VBQXVCOztFQUN4QyxNQUFJRCxRQUFKLENBQWFBLFFBQWIsRUFBdUI7RUFDckIsU0FBS0MsU0FBTCxHQUFpQkQsUUFBakI7RUFDQSxTQUFLNkQsR0FBTCxDQUFTN0QsUUFBVDtFQUNEOztFQUNELE1BQUl2RSxJQUFKLEdBQVc7RUFDVCxRQUFHLENBQUMsS0FBS2dFLEtBQVQsRUFBZ0IsS0FBS0EsS0FBTCxHQUFhcUUsU0FBUyxDQUFDdEksSUFBVixFQUFiO0VBQ2hCLFdBQU8sS0FBS2lFLEtBQVo7RUFDRDs7RUFDRCxNQUFJc0UsTUFBSixHQUFhO0VBQ1gsU0FBS0MsT0FBTCxHQUFlLEtBQUtBLE9BQUwsSUFBZ0IsS0FBS3pELGdCQUFwQztFQUNBLFdBQU8sS0FBS3lELE9BQVo7RUFDRDs7RUFDRCxNQUFJRCxNQUFKLENBQVdFLFVBQVgsRUFBdUI7RUFBRSxTQUFLRCxPQUFMLEdBQWVDLFVBQWY7RUFBMkI7O0VBQ3BELE1BQUlYLEtBQUosR0FBWTtFQUFFLFdBQU8sS0FBS1ksTUFBWjtFQUFvQjs7RUFDbEMsTUFBSVosS0FBSixDQUFVQSxLQUFWLEVBQWlCO0VBQUUsU0FBS1ksTUFBTCxHQUFjWixLQUFkO0VBQXFCOztFQUN4QyxNQUFJcEQsWUFBSixHQUFtQjtFQUFFLFdBQU8sS0FBS0ksYUFBWjtFQUEyQjs7RUFDaEQsTUFBSUosWUFBSixDQUFpQkEsWUFBakIsRUFBK0I7RUFBRSxTQUFLSSxhQUFMLEdBQXFCSixZQUFyQjtFQUFtQzs7RUFDcEUsTUFBSXpGLElBQUosR0FBVztFQUFFLFdBQU8sS0FBS3NGLEtBQVo7RUFBbUI7O0VBQ2hDLE1BQUl0RixJQUFKLEdBQVc7RUFDVCxRQUFNMEosV0FBVyxHQUFJdEssTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBS2lLLE1BQWpCLEVBQXlCekssTUFBMUIsR0FDaEIsSUFEZ0IsR0FFaEIsS0FGSjtFQUdBLFdBQVE2SyxXQUFELEdBQ0gsS0FBS0osTUFBTCxDQUNDSyxHQURELENBQ01kLEtBQUQsSUFBV0EsS0FBSyxDQUFDekMsS0FBTixFQURoQixDQURHLEdBR0gsRUFISjtFQUlEOztFQUNELE1BQUlULEVBQUosR0FBUztFQUFFLFdBQU8sS0FBS0ksR0FBWjtFQUFpQjs7RUFDNUIsTUFBSUosRUFBSixHQUFTO0VBQ1AsUUFBSUEsRUFBRSxHQUFHRixZQUFZLENBQUNPLE9BQWIsQ0FBcUIsS0FBS1AsWUFBTCxDQUFrQlEsUUFBdkMsS0FBb0RDLElBQUksQ0FBQ0MsU0FBTCxDQUFlLEtBQUtMLGdCQUFwQixDQUE3RDtFQUNBLFdBQU9JLElBQUksQ0FBQ0UsS0FBTCxDQUFXVCxFQUFYLENBQVA7RUFDRDs7RUFDRCxNQUFJQSxFQUFKLENBQU9BLEVBQVAsRUFBVztFQUNUQSxJQUFBQSxFQUFFLEdBQUdPLElBQUksQ0FBQ0MsU0FBTCxDQUFlUixFQUFmLENBQUw7RUFDQUYsSUFBQUEsWUFBWSxDQUFDWSxPQUFiLENBQXFCLEtBQUtaLFlBQUwsQ0FBa0JRLFFBQXZDLEVBQWlETixFQUFqRDtFQUNEOztFQUNEVyxFQUFBQSxXQUFXLENBQUNDLFNBQUQsRUFBWTtFQUNyQixLQUNFLEtBREYsRUFFRSxJQUZGLEVBR0V6RyxPQUhGLENBR1d5QyxNQUFELElBQVk7RUFDcEIsV0FBSzRDLFlBQUwsQ0FBa0JvQixTQUFsQixFQUE2QmhFLE1BQTdCO0VBQ0QsS0FMRDtFQU1BLFdBQU8sSUFBUDtFQUNEOztFQUNENEMsRUFBQUEsWUFBWSxDQUFDb0IsU0FBRCxFQUFZaEUsTUFBWixFQUFvQjtFQUM5QixRQUFNaUUsUUFBUSxHQUFHRCxTQUFTLENBQUN4RSxNQUFWLENBQWlCLEdBQWpCLENBQWpCO0VBQ0EsUUFBTTBFLGNBQWMsR0FBR0YsU0FBUyxDQUFDeEUsTUFBVixDQUFpQixRQUFqQixDQUF2QjtFQUNBLFFBQU0yRSxpQkFBaUIsR0FBR0gsU0FBUyxDQUFDeEUsTUFBVixDQUFpQixXQUFqQixDQUExQjtFQUNBLFFBQU00RSxJQUFJLEdBQUcsS0FBS0gsUUFBTCxDQUFiO0VBQ0EsUUFBTUksVUFBVSxHQUFHLEtBQUtILGNBQUwsQ0FBbkI7RUFDQSxRQUFNSSxhQUFhLEdBQUcsS0FBS0gsaUJBQUwsQ0FBdEI7O0VBQ0EsUUFDRUMsSUFBSSxJQUNKQyxVQURBLElBRUFDLGFBSEYsRUFJRTtFQUNBekgsTUFBQUEsTUFBTSxDQUFDUyxPQUFQLENBQWUrRyxVQUFmLEVBQ0c5RyxPQURILENBQ1csVUFBdUM7RUFBQSxZQUF0QyxDQUFDaUgsYUFBRCxFQUFnQkMsZ0JBQWhCLENBQXNDO0VBQzlDLFlBQUksQ0FBQ0MsY0FBRCxFQUFpQkMsYUFBakIsSUFBa0NILGFBQWEsQ0FBQ0ksS0FBZCxDQUFvQixHQUFwQixDQUF0QztFQUNBLFlBQUlNLFVBQVUsR0FBR2QsSUFBSSxDQUFDTSxjQUFELENBQXJCO0VBQ0EsWUFBSTJDLFlBQVksR0FBRy9DLGFBQWEsQ0FBQ0csZ0JBQUQsQ0FBaEM7O0VBQ0EsWUFDRTRDLFlBQVksSUFDWkEsWUFBWSxDQUFDaEwsSUFBYixDQUFrQnVJLEtBQWxCLENBQXdCLEdBQXhCLEVBQTZCdEksTUFBN0IsS0FBd0MsQ0FGMUMsRUFHRTtFQUNBK0ssVUFBQUEsWUFBWSxHQUFHQSxZQUFZLENBQUM3QixJQUFiLENBQWtCLElBQWxCLENBQWY7RUFDRDs7RUFDRCxZQUNFZCxjQUFjLElBQ2RDLGFBREEsSUFFQU8sVUFGQSxJQUdBbUMsWUFKRixFQUtFO0VBQ0EsY0FBSTtFQUNGbkMsWUFBQUEsVUFBVSxDQUFDbEYsTUFBRCxDQUFWLENBQW1CMkUsYUFBbkIsRUFBa0MwQyxZQUFsQztFQUNELFdBRkQsQ0FFRSxPQUFNakYsS0FBTixFQUFhO0VBQ2hCO0VBQ0YsT0FyQkg7RUFzQkQ7O0VBQ0QsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0RrRixFQUFBQSxhQUFhLENBQUNDLFNBQUQsRUFBWTtFQUN2QixRQUFJQyxVQUFKOztFQUNBLFNBQUtSLE9BQUwsQ0FDR1MsSUFESCxDQUNRLENBQUNQLE1BQUQsRUFBU1EsV0FBVCxLQUF5QjtFQUM3QixVQUFHUixNQUFNLEtBQUssSUFBZCxFQUFvQjtFQUNsQixZQUNFQSxNQUFNLFlBQVkxRSxLQUFsQixJQUNBMEUsTUFBTSxDQUFDekUsS0FBUCxLQUFpQjhFLFNBRm5CLEVBR0U7RUFDQUMsVUFBQUEsVUFBVSxHQUFHRSxXQUFiO0VBQ0EsaUJBQU9SLE1BQVA7RUFDRDtFQUNGO0VBQ0YsS0FYSDs7RUFZQSxXQUFPTSxVQUFQO0VBQ0Q7O0VBQ0RHLEVBQUFBLGtCQUFrQixDQUFDSCxVQUFELEVBQWE7RUFDN0IsUUFBSWxCLEtBQUssR0FBRyxLQUFLVSxPQUFMLENBQWE3SixNQUFiLENBQW9CcUssVUFBcEIsRUFBZ0MsQ0FBaEMsRUFBbUMsSUFBbkMsQ0FBWjs7RUFDQSxTQUFLekssSUFBTCxDQUNFLGNBREYsRUFFRXVKLEtBQUssQ0FBQyxDQUFELENBQUwsQ0FBU3pDLEtBQVQsRUFGRixFQUdFLElBSEYsRUFJRXlDLEtBQUssQ0FBQyxDQUFELENBSlA7RUFNQSxXQUFPLElBQVA7RUFDRDs7RUFDRHNCLEVBQUFBLFFBQVEsQ0FBQ0MsU0FBRCxFQUFZO0VBQ2xCLFFBQUl2QixLQUFKOztFQUNBLFFBQUd1QixTQUFTLFlBQVlyRixLQUF4QixFQUErQjtFQUM3QjhELE1BQUFBLEtBQUssR0FBR3VCLFNBQVI7RUFDRCxLQUZELE1BRU8sSUFDTCxLQUFLdkIsS0FEQSxFQUVMO0VBQ0EsVUFBTXdCLGNBQWMsR0FBRyxLQUFLeEIsS0FBNUI7RUFDQUEsTUFBQUEsS0FBSyxHQUFHLElBQUl3QixjQUFKLENBQW1CO0VBQ3pCOUUsUUFBQUEsUUFBUSxFQUFFNkU7RUFEZSxPQUFuQixFQUVMLEtBQUtFLFlBRkEsQ0FBUjtFQUdELEtBUE0sTUFPQTtFQUNMekIsTUFBQUEsS0FBSyxHQUFHLElBQUk5RCxLQUFKLENBQVU7RUFDaEJRLFFBQUFBLFFBQVEsRUFBRTZFO0VBRE0sT0FBVixDQUFSO0VBR0Q7O0VBQ0R2QixJQUFBQSxLQUFLLENBQUM3SyxFQUFOLENBQ0UsS0FERixFQUVFLENBQUM0SyxLQUFELEVBQVFhLE1BQVIsS0FBbUIsS0FBS25LLElBQUwsQ0FDakIsY0FEaUIsRUFFakIsS0FBSzhHLEtBQUwsRUFGaUIsRUFHakIsSUFIaUIsRUFJakJxRCxNQUppQixDQUZyQjtFQVNBLFNBQUtILE1BQUwsQ0FBWXBLLElBQVosQ0FBaUIySixLQUFqQjtFQUNBLFNBQUt2SixJQUFMLENBQ0UsS0FERixFQUVFdUosS0FBSyxDQUFDekMsS0FBTixFQUZGLEVBR0UsSUFIRixFQUlFeUMsS0FKRjtFQU1BLFdBQU9BLEtBQVA7RUFDRDs7RUFDRE8sRUFBQUEsR0FBRyxDQUFDZ0IsU0FBRCxFQUFZO0VBQ2IsUUFBRzVLLEtBQUssQ0FBQ3dKLE9BQU4sQ0FBY29CLFNBQWQsQ0FBSCxFQUE2QjtFQUMzQkEsTUFBQUEsU0FBUyxDQUNOdEssT0FESCxDQUNZK0ksS0FBRCxJQUFXLEtBQUtzQixRQUFMLENBQWN0QixLQUFkLENBRHRCO0VBRUQsS0FIRCxNQUdPO0VBQ0wsV0FBS3NCLFFBQUwsQ0FBY0MsU0FBZDtFQUNEOztFQUNELFFBQUcsS0FBSzNFLFlBQVIsRUFBc0IsS0FBS0UsRUFBTCxHQUFVLEtBQUszRixJQUFmO0VBQ3RCLFNBQUtWLElBQUwsQ0FDRSxRQURGLEVBRUUsS0FBSzhHLEtBQUwsRUFGRixFQUdFLElBSEY7RUFLQSxXQUFPLElBQVA7RUFDRDs7RUFDRG1FLEVBQUFBLE1BQU0sQ0FBQ0gsU0FBRCxFQUFZO0VBQ2hCLFFBQ0UsQ0FBQzVLLEtBQUssQ0FBQ3dKLE9BQU4sQ0FBY29CLFNBQWQsQ0FBRCxJQUNBLE9BQU9BLFNBQVAsS0FBcUIsUUFGdkIsRUFHRTtFQUNBLFVBQUlMLFVBQVUsR0FBRyxLQUFLRixhQUFMLENBQW1CTyxTQUFTLENBQUNwSixJQUE3QixDQUFqQjtFQUNBLFdBQUtrSixrQkFBTCxDQUF3QkgsVUFBeEI7RUFDRCxLQU5ELE1BTU8sSUFBR3ZLLEtBQUssQ0FBQ3dKLE9BQU4sQ0FBY29CLFNBQWQsQ0FBSCxFQUE2QjtFQUNsQ0EsTUFBQUEsU0FBUyxDQUNOdEssT0FESCxDQUNZK0ksS0FBRCxJQUFXO0VBQ2xCLFlBQUlrQixVQUFVLEdBQUcsS0FBS0YsYUFBTCxDQUFtQmhCLEtBQUssQ0FBQzdILElBQXpCLENBQWpCO0VBQ0EsYUFBS2tKLGtCQUFMLENBQXdCSCxVQUF4QjtFQUNELE9BSkg7RUFLRDs7RUFDRCxTQUFLVCxNQUFMLEdBQWMsS0FBS0EsTUFBTCxDQUNYa0IsTUFEVyxDQUNIM0IsS0FBRCxJQUFXQSxLQUFLLEtBQUssSUFEakIsQ0FBZDtFQUVBLFFBQUcsS0FBS2hELGFBQVIsRUFBdUIsS0FBS0YsRUFBTCxHQUFVLEtBQUszRixJQUFmO0VBQ3ZCLFNBQUtWLElBQUwsQ0FDRSxRQURGLEVBRUUsS0FBSzhHLEtBQUwsRUFGRixFQUdFLElBSEY7RUFLQSxXQUFPLElBQVA7RUFDRDs7RUFDRHFFLEVBQUFBLEtBQUssR0FBRztFQUNOLFNBQUtGLE1BQUwsQ0FBWSxLQUFLaEIsT0FBakI7RUFDQSxXQUFPLElBQVA7RUFDRDs7RUFDRG5ELEVBQUFBLEtBQUssQ0FBQ3BHLElBQUQsRUFBTztFQUNWQSxJQUFBQSxJQUFJLEdBQUdBLElBQUksSUFBSSxLQUFLQSxJQUFiLElBQXFCLEtBQUs4RixnQkFBakM7RUFDQSxXQUFPSSxJQUFJLENBQUNFLEtBQUwsQ0FBV0YsSUFBSSxDQUFDQyxTQUFMLENBQWVuRyxJQUFmLENBQVgsQ0FBUDtFQUNEOztFQWxPNkI7O0VDRmhDLE1BQU0wSyxJQUFOLFNBQW1CdE0sTUFBbkIsQ0FBMEI7RUFDeEJDLEVBQUFBLFdBQVcsR0FBOEI7RUFBQSxRQUE3QmlELFFBQTZCLHVFQUFsQixFQUFrQjtFQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtFQUN2QztFQUNBLFNBQUtELFFBQUwsR0FBZ0JBLFFBQWhCO0VBQ0EsU0FBS0MsT0FBTCxHQUFlQSxPQUFmO0VBQ0Q7O0VBQ0QsTUFBSUMsYUFBSixHQUFvQjtFQUFFLFdBQU8sQ0FDM0IsWUFEMkIsRUFFM0IsYUFGMkIsRUFHM0IsU0FIMkIsRUFJM0IsUUFKMkIsRUFLM0IsVUFMMkIsRUFNM0IsWUFOMkIsRUFPM0IsaUJBUDJCLEVBUTNCLG9CQVIyQixFQVMzQixRQVQyQixDQUFQO0VBVW5COztFQUNILE1BQUlGLFFBQUosR0FBZTtFQUFFLFdBQU8sS0FBS0csU0FBWjtFQUF1Qjs7RUFDeEMsTUFBSUgsUUFBSixDQUFhQSxRQUFiLEVBQXVCO0VBQ3JCLFNBQUtHLFNBQUwsR0FBaUJILFFBQWpCO0VBQ0EsU0FBS0UsYUFBTCxDQUFtQjFCLE9BQW5CLENBQTRCNEIsWUFBRCxJQUFrQjtFQUMzQyxVQUFHSixRQUFRLENBQUNJLFlBQUQsQ0FBWCxFQUEyQixLQUFLQSxZQUFMLElBQXFCSixRQUFRLENBQUNJLFlBQUQsQ0FBN0I7RUFDNUIsS0FGRDtFQUdEOztFQUNELE1BQUlILE9BQUosR0FBYztFQUNaLFFBQUcsQ0FBQyxLQUFLSSxRQUFULEVBQW1CLEtBQUtBLFFBQUwsR0FBZ0IsRUFBaEI7RUFDbkIsV0FBTyxLQUFLQSxRQUFaO0VBQ0Q7O0VBQ0QsTUFBSUosT0FBSixDQUFZQSxPQUFaLEVBQXFCO0VBQUUsU0FBS0ksUUFBTCxHQUFnQkosT0FBaEI7RUFBeUI7O0VBQ2hELE1BQUlvSixXQUFKLEdBQWtCO0VBQUUsV0FBTyxLQUFLQyxZQUFaO0VBQTBCOztFQUM5QyxNQUFJRCxXQUFKLENBQWdCQSxXQUFoQixFQUE2QjtFQUFFLFNBQUtDLFlBQUwsR0FBb0JELFdBQXBCO0VBQWlDOztFQUNoRSxNQUFJRSxPQUFKLEdBQWM7RUFDWixRQUFHLENBQUMsS0FBS0MsUUFBVCxFQUFtQjtFQUNqQixXQUFLQSxRQUFMLEdBQWdCQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsS0FBS0wsV0FBNUIsQ0FBaEI7RUFDQXZMLE1BQUFBLE1BQU0sQ0FBQ1MsT0FBUCxDQUFlLEtBQUtvTCxVQUFwQixFQUFnQ25MLE9BQWhDLENBQXdDLFVBQW9DO0VBQUEsWUFBbkMsQ0FBQ29MLFlBQUQsRUFBZUMsY0FBZixDQUFtQzs7RUFDMUUsYUFBS0wsUUFBTCxDQUFjTSxZQUFkLENBQTJCRixZQUEzQixFQUF5Q0MsY0FBekM7RUFDRCxPQUZEO0VBR0EsV0FBS0UsZUFBTCxDQUFxQkMsT0FBckIsQ0FBNkIsS0FBS1QsT0FBbEMsRUFBMkM7RUFDekNVLFFBQUFBLE9BQU8sRUFBRSxJQURnQztFQUV6Q0MsUUFBQUEsU0FBUyxFQUFFO0VBRjhCLE9BQTNDO0VBSUQ7O0VBQ0QsV0FBTyxLQUFLVixRQUFaO0VBQ0Q7O0VBQ0QsTUFBSU8sZUFBSixHQUFzQjtFQUNwQixTQUFLSSxnQkFBTCxHQUF3QixLQUFLQSxnQkFBTCxJQUF5QixJQUFJQyxnQkFBSixDQUMvQyxLQUFLQyxjQUFMLENBQW9CNUQsSUFBcEIsQ0FBeUIsSUFBekIsQ0FEK0MsQ0FBakQ7RUFHQSxXQUFPLEtBQUswRCxnQkFBWjtFQUNEOztFQUNELE1BQUlaLE9BQUosQ0FBWUEsT0FBWixFQUFxQjtFQUNuQixRQUFHQSxPQUFPLFlBQVllLFdBQXRCLEVBQW1DLEtBQUtkLFFBQUwsR0FBZ0JELE9BQWhCO0VBQ3BDOztFQUNELE1BQUlJLFVBQUosR0FBaUI7RUFBRSxXQUFPLEtBQUtZLFdBQUwsSUFBb0IsRUFBM0I7RUFBK0I7O0VBQ2xELE1BQUlaLFVBQUosQ0FBZUEsVUFBZixFQUEyQjtFQUFFLFNBQUtZLFdBQUwsR0FBbUJaLFVBQW5CO0VBQStCOztFQUM1RCxNQUFJYSxRQUFKLEdBQWU7RUFBRSxXQUFPLEtBQUtDLFNBQVo7RUFBdUI7O0VBQ3hDLE1BQUlELFFBQUosQ0FBYUEsUUFBYixFQUF1QjtFQUFFLFNBQUtDLFNBQUwsR0FBaUJELFFBQWpCO0VBQTJCOztFQUNwRCxNQUFJRSxVQUFKLEdBQWlCO0VBQUUsV0FBTyxLQUFLQyxXQUFMLElBQW9CLEVBQTNCO0VBQStCOztFQUNsRCxNQUFJRCxVQUFKLENBQWVBLFVBQWYsRUFBMkI7RUFDekIsU0FBS0MsV0FBTCxHQUFtQkQsVUFBbkIsQ0FEeUI7RUFHMUI7O0VBQ0QsTUFBSUUsZUFBSixHQUFzQjtFQUFFLFdBQU8sS0FBS0MsZ0JBQUwsSUFBeUIsRUFBaEM7RUFBb0M7O0VBQzVELE1BQUlELGVBQUosQ0FBb0JBLGVBQXBCLEVBQXFDO0VBQ25DLFNBQUtDLGdCQUFMLEdBQXdCRCxlQUF4QixDQURtQztFQUdwQzs7RUFDRCxNQUFJRSxrQkFBSixHQUF5QjtFQUFFLFdBQU8sS0FBS0MsbUJBQUwsSUFBNEIsRUFBbkM7RUFBdUM7O0VBQ2xFLE1BQUlELGtCQUFKLENBQXVCQSxrQkFBdkIsRUFBMkM7RUFDekMsU0FBS0MsbUJBQUwsR0FBMkJELGtCQUEzQjtFQUNBaE4sSUFBQUEsTUFBTSxDQUFDMEgsTUFBUCxDQUFjLEtBQUt1RixtQkFBbkIsRUFDR3ZNLE9BREgsQ0FDWXdNLGlCQUFELElBQXVCQSxpQkFBaUIsQ0FBQ3ZFLElBQWxCLENBQXVCLElBQXZCLENBRGxDLEVBRnlDO0VBSzFDOztFQUNELE1BQUl3RSxFQUFKLEdBQVM7RUFDUCxRQUFNQyxPQUFPLEdBQUcsSUFBaEI7O0VBQ0EsUUFBRyxDQUFDLEtBQUtDLEdBQVQsRUFBYztFQUNaLFdBQUtBLEdBQUwsR0FBV3JOLE1BQU0sQ0FBQ1MsT0FBUCxDQUFlLEtBQUttTSxVQUFwQixFQUFnQzlKLE1BQWhDLENBQXVDLENBQUN1SyxHQUFELFlBQXlDO0VBQUEsWUFBcEMsQ0FBQ0MsYUFBRCxFQUFnQkMsY0FBaEIsQ0FBb0M7RUFDekZ2TixRQUFBQSxNQUFNLENBQUNvSixnQkFBUCxDQUF3QmlFLEdBQXhCLEVBQTZCO0VBQzNCLFdBQUNDLGFBQUQsR0FBaUI7RUFDZm5FLFlBQUFBLEdBQUcsR0FBRztFQUNKLGtCQUFHLE9BQU9vRSxjQUFQLEtBQTBCLFFBQTdCLEVBQXVDO0VBQ3JDLG9CQUFJQyxZQUFZLEdBQUdKLE9BQU8sQ0FBQzNCLE9BQVIsQ0FBZ0JnQyxnQkFBaEIsQ0FBaUNGLGNBQWpDLENBQW5CO0VBQ0EsdUJBQVFDLFlBQVksQ0FBQy9OLE1BQWIsR0FBc0IsQ0FBdkIsR0FBNEIrTixZQUE1QixHQUEyQ0EsWUFBWSxDQUFDRSxJQUFiLENBQWtCLENBQWxCLENBQWxEO0VBQ0QsZUFIRCxNQUdPLElBQ0xILGNBQWMsWUFBWWYsV0FBMUIsSUFDQWUsY0FBYyxZQUFZSSxRQUQxQixJQUVBSixjQUFjLFlBQVlLLE1BSHJCLEVBSUw7RUFDQSx1QkFBT0wsY0FBUDtFQUNEO0VBQ0Y7O0VBWmM7RUFEVSxTQUE3QjtFQWdCQSxlQUFPRixHQUFQO0VBQ0QsT0FsQlUsRUFrQlIsRUFsQlEsQ0FBWDtFQW1CQXJOLE1BQUFBLE1BQU0sQ0FBQ29KLGdCQUFQLENBQXdCLEtBQUtpRSxHQUE3QixFQUFrQztFQUNoQyxvQkFBWTtFQUNWbEUsVUFBQUEsR0FBRyxHQUFHO0VBQUUsbUJBQU9pRSxPQUFPLENBQUMzQixPQUFmO0VBQXdCOztFQUR0QjtFQURvQixPQUFsQztFQUtEOztFQUNELFdBQU8sS0FBSzRCLEdBQVo7RUFDRDs7RUFDRFEsRUFBQUEsT0FBTyxHQUFHO0VBQ1IsV0FBTyxLQUFLUixHQUFaO0VBQ0EsU0FBS3RILFlBQUw7RUFDQSxXQUFPLElBQVA7RUFDRDs7RUFDRHdHLEVBQUFBLGNBQWMsQ0FBQ3VCLGtCQUFELEVBQXFCQyxRQUFyQixFQUErQjtFQUMzQyxTQUFJLElBQUksQ0FBQ0MsbUJBQUQsRUFBc0JDLGNBQXRCLENBQVIsSUFBaURqTyxNQUFNLENBQUNTLE9BQVAsQ0FBZXFOLGtCQUFmLENBQWpELEVBQXFGO0VBQ25GLGNBQU9HLGNBQWMsQ0FBQ0MsSUFBdEI7RUFDRSxhQUFLLFdBQUw7RUFDRSxjQUFHRCxjQUFjLENBQUNFLFVBQWYsQ0FBMEIxTyxNQUE3QixFQUFxQztFQUNuQztFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxpQkFBS3NHLFlBQUw7RUFDRDs7RUFDRDtFQWpCSjtFQW1CRDtFQUNGOztFQUNEcUksRUFBQUEsa0JBQWtCLENBQUMzQyxPQUFELEVBQVV0SSxNQUFWLEVBQWtCOUQsU0FBbEIsRUFBNkJPLGlCQUE3QixFQUFnRDtFQUNoRSxRQUFJO0VBQ0YsY0FBT3VELE1BQVA7RUFDRSxhQUFLLGtCQUFMO0VBQ0UsZUFBSzZKLGtCQUFMLENBQXdCcE4saUJBQXhCLElBQTZDLEtBQUtvTixrQkFBTCxDQUF3QnBOLGlCQUF4QixDQUE3QyxDQURGOztFQUVFNkwsVUFBQUEsT0FBTyxDQUFDdEksTUFBRCxDQUFQLENBQWdCOUQsU0FBaEIsRUFBMkIsS0FBSzJOLGtCQUFMLENBQXdCcE4saUJBQXhCLENBQTNCO0VBQ0E7O0VBQ0YsYUFBSyxxQkFBTDtFQUNFNkwsVUFBQUEsT0FBTyxDQUFDdEksTUFBRCxDQUFQLENBQWdCOUQsU0FBaEIsRUFBMkIsS0FBSzJOLGtCQUFMLENBQXdCcE4saUJBQXhCLENBQTNCO0VBQ0E7RUFQSjtFQVNELEtBVkQsQ0FVRSxPQUFNMkYsS0FBTixFQUFhO0VBQ2hCOztFQUNEUSxFQUFBQSxZQUFZLEdBQTZCO0VBQUEsUUFBNUJzSSxtQkFBNEIsdUVBQU4sSUFBTTtFQUN2QyxTQUFLQyxVQUFMLEdBQWtCLElBQWxCO0VBQ0EsUUFBTW5CLEVBQUUsR0FBRyxLQUFLQSxFQUFoQjtFQUNBLFFBQU1vQixnQkFBZ0IsR0FBRyxDQUFDLHFCQUFELEVBQXdCLGtCQUF4QixDQUF6Qjs7RUFDQSxRQUFHLENBQUNGLG1CQUFKLEVBQXlCO0VBQ3ZCRSxNQUFBQSxnQkFBZ0IsQ0FBQzdOLE9BQWpCLENBQTBCOE4sZUFBRCxJQUFxQjtFQUM1Q3hPLFFBQUFBLE1BQU0sQ0FBQ1MsT0FBUCxDQUFlLEtBQUtxTSxlQUFwQixFQUFxQ3BNLE9BQXJDLENBQTZDLFdBQTBEO0VBQUEsY0FBekQsQ0FBQytOLHNCQUFELEVBQXlCQywwQkFBekIsQ0FBeUQ7RUFDckcsY0FBSSxDQUFDcEIsYUFBRCxFQUFnQnFCLGtCQUFoQixJQUFzQ0Ysc0JBQXNCLENBQUMxRyxLQUF2QixDQUE2QixHQUE3QixDQUExQzs7RUFDQSxjQUFHb0YsRUFBRSxDQUFDRyxhQUFELENBQUYsWUFBNkJzQixRQUFoQyxFQUEwQztFQUN4Q3pCLFlBQUFBLEVBQUUsQ0FBQ0csYUFBRCxDQUFGLENBQWtCNU0sT0FBbEIsQ0FBMkJtTyxTQUFELElBQWU7RUFDdkMsbUJBQUtULGtCQUFMLENBQXdCUyxTQUF4QixFQUFtQ0wsZUFBbkMsRUFBb0RHLGtCQUFwRCxFQUF3RUQsMEJBQXhFO0VBQ0QsYUFGRDtFQUdELFdBSkQsTUFJTyxJQUFHdkIsRUFBRSxDQUFDRyxhQUFELENBQUwsRUFBc0I7RUFDM0IsaUJBQUtjLGtCQUFMLENBQXdCakIsRUFBRSxDQUFDRyxhQUFELENBQTFCLEVBQTJDa0IsZUFBM0MsRUFBNERHLGtCQUE1RCxFQUFnRkQsMEJBQWhGO0VBQ0Q7RUFDRixTQVREO0VBVUQsT0FYRDtFQVlELEtBYkQsTUFhTztFQUNMSCxNQUFBQSxnQkFBZ0IsQ0FBQzdOLE9BQWpCLENBQTBCOE4sZUFBRCxJQUFxQjtFQUM1QyxZQUFNMUIsZUFBZSxHQUFHOU0sTUFBTSxDQUFDUyxPQUFQLENBQWUsS0FBS3FNLGVBQXBCLEVBQXFDcE0sT0FBckMsQ0FBNkMsV0FBMEQ7RUFBQSxjQUF6RCxDQUFDK04sc0JBQUQsRUFBeUJDLDBCQUF6QixDQUF5RDtFQUM3SCxjQUFJLENBQUNwQixhQUFELEVBQWdCcUIsa0JBQWhCLElBQXNDRixzQkFBc0IsQ0FBQzFHLEtBQXZCLENBQTZCLEdBQTdCLENBQTFDOztFQUNBLGNBQUdzRyxtQkFBbUIsS0FBS2YsYUFBM0IsRUFBMEM7RUFDeEMsZ0JBQUdILEVBQUUsQ0FBQ0csYUFBRCxDQUFGLFlBQTZCc0IsUUFBaEMsRUFBMEM7RUFDeEN6QixjQUFBQSxFQUFFLENBQUNHLGFBQUQsQ0FBRixDQUFrQjVNLE9BQWxCLENBQTJCbU8sU0FBRCxJQUFlO0VBQ3ZDLHFCQUFLVCxrQkFBTCxDQUF3QlMsU0FBeEIsRUFBbUNMLGVBQW5DLEVBQW9ERyxrQkFBcEQsRUFBd0VELDBCQUF4RTtFQUNELGVBRkQ7RUFHRCxhQUpELE1BSU8sSUFBR3ZCLEVBQUUsQ0FBQ0csYUFBRCxDQUFGLFlBQTZCZCxXQUFoQyxFQUE2QztFQUNsRCxtQkFBSzRCLGtCQUFMLENBQXdCakIsRUFBRSxDQUFDRyxhQUFELENBQTFCLEVBQTJDa0IsZUFBM0MsRUFBNERHLGtCQUE1RCxFQUFnRkQsMEJBQWhGO0VBQ0Q7RUFDRjtFQUNGLFNBWHVCLENBQXhCO0VBWUQsT0FiRDtFQWNEOztFQUNELFNBQUtKLFVBQUwsR0FBa0IsS0FBbEI7RUFDQSxXQUFPLElBQVA7RUFDRDs7RUFDRFEsRUFBQUEsVUFBVSxHQUFHO0VBQ1gsUUFBRyxLQUFLQyxNQUFSLEVBQWdCO0VBQ2QsVUFBTUMsTUFBTSxHQUFJLE9BQU8sS0FBS0QsTUFBTCxDQUFZQyxNQUFuQixLQUE4QixRQUEvQixHQUNYckQsUUFBUSxDQUFDc0QsYUFBVCxDQUF1QixLQUFLRixNQUFMLENBQVlDLE1BQW5DLENBRFcsR0FFVixLQUFLRCxNQUFMLENBQVlDLE1BQVosWUFBOEJ4QyxXQUEvQixHQUNFLEtBQUt1QyxNQUFMLENBQVlDLE1BRGQsR0FFRSxJQUpOO0VBS0EsVUFBTTdMLE1BQU0sR0FBRyxLQUFLNEwsTUFBTCxDQUFZNUwsTUFBM0I7RUFDQTZMLE1BQUFBLE1BQU0sQ0FBQ0UscUJBQVAsQ0FBNkIvTCxNQUE3QixFQUFxQyxLQUFLc0ksT0FBMUM7RUFDRDs7RUFDRCxXQUFPLElBQVA7RUFDRDs7RUFDRDBELEVBQUFBLFVBQVUsR0FBRztFQUNYLFFBQUcsS0FBSzFELE9BQUwsQ0FBYTJELGFBQWhCLEVBQStCO0VBQzdCLFdBQUszRCxPQUFMLENBQWEyRCxhQUFiLENBQTJCQyxXQUEzQixDQUF1QyxLQUFLNUQsT0FBNUM7RUFDRDs7RUFDRCxXQUFPLElBQVA7RUFDRDs7RUFDRDZELEVBQUFBLFlBQVksQ0FBQ1QsU0FBRCxFQUFZO0VBQ3RCLFNBQUsxQixFQUFMLENBQVEwQixTQUFSLEVBQW1CVSxTQUFuQixHQUErQixFQUEvQjtFQUNBLFdBQU8sSUFBUDtFQUNEOztFQUNEQyxFQUFBQSx3QkFBd0IsQ0FBQ1gsU0FBRCxFQUFZWSxXQUFaLEVBQXlCO0VBQy9DLFFBQUcsS0FBS3RDLEVBQUwsQ0FBUTBCLFNBQVIsQ0FBSCxFQUF1QixLQUFLMUIsRUFBTCxDQUFRMEIsU0FBUixFQUFtQlUsU0FBbkIsR0FBK0JFLFdBQS9CO0VBQ3ZCLFdBQU8sSUFBUDtFQUNEOztFQUNEQyxFQUFBQSxzQkFBc0IsQ0FBQ2IsU0FBRCxFQUFZYyxhQUFaLEVBQTJCO0VBQy9DLFFBQUcsS0FBS3hDLEVBQUwsQ0FBUTBCLFNBQVIsQ0FBSCxFQUF1QixLQUFLMUIsRUFBTCxDQUFRMEIsU0FBUixFQUFtQmUsZUFBbkIsQ0FBbUNELGFBQW5DO0VBQ3ZCLFdBQU8sSUFBUDtFQUNEOztFQUNERCxFQUFBQSxzQkFBc0IsQ0FBQ2IsU0FBRCxFQUFZYyxhQUFaLEVBQTJCNUQsY0FBM0IsRUFBMkM7RUFDL0QsUUFBRyxLQUFLb0IsRUFBTCxDQUFRMEIsU0FBUixDQUFILEVBQXVCLEtBQUsxQixFQUFMLENBQVEwQixTQUFSLEVBQW1CN0MsWUFBbkIsQ0FBZ0MyRCxhQUFoQyxFQUErQzVELGNBQS9DO0VBQ3ZCLFdBQU8sSUFBUDtFQUNEOztFQUNEOEQsRUFBQUEsYUFBYSxDQUFDaEIsU0FBRCxFQUFZaUIsWUFBWixFQUEwQnJFLE9BQTFCLEVBQW1DO0VBQzlDLFFBQUcsS0FBSzBCLEVBQUwsQ0FBUTBCLFNBQVIsQ0FBSCxFQUF1QixLQUFLMUIsRUFBTCxDQUFRMEIsU0FBUixFQUFtQksscUJBQW5CLENBQXlDWSxZQUF6QyxFQUF1RHJFLE9BQXZEO0VBQ3ZCLFdBQU8sSUFBUDtFQUNEOztFQUNEc0UsRUFBQUEsTUFBTSxHQUFZO0VBQUEsUUFBWG5QLElBQVcsdUVBQUosRUFBSTs7RUFDaEIsUUFBRyxLQUFLOEwsUUFBUixFQUFrQjtFQUNoQixVQUFNQSxRQUFRLEdBQUcsS0FBS0EsUUFBTCxDQUFjOUwsSUFBZCxDQUFqQjtFQUNBLFdBQUs2SyxPQUFMLENBQWE4RCxTQUFiLEdBQXlCN0MsUUFBekI7RUFDRDs7RUFDRCxXQUFPLElBQVA7RUFDRDs7RUFqT3VCOztFQ0ExQixJQUFNc0QsVUFBVSxHQUFHLGNBQWNoUixNQUFkLENBQXFCO0VBQ3RDQyxFQUFBQSxXQUFXLEdBQThCO0VBQUEsUUFBN0JpRCxRQUE2Qix1RUFBbEIsRUFBa0I7RUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7RUFDdkM7RUFDQSxTQUFLRCxRQUFMLEdBQWdCQSxRQUFoQjtFQUNBLFNBQUtDLE9BQUwsR0FBZUEsT0FBZjtFQUNEOztFQUNELE1BQUlDLGFBQUosR0FBb0I7RUFBRSxXQUFPLENBQzNCLFFBRDJCLEVBRTNCLGFBRjJCLEVBRzNCLGdCQUgyQixFQUkzQixhQUoyQixFQUszQixrQkFMMkIsRUFNM0IscUJBTjJCLEVBTzNCLE9BUDJCLEVBUTNCLFlBUjJCLEVBUzNCLGVBVDJCLEVBVTNCLGFBVjJCLEVBVzNCLGtCQVgyQixFQVkzQixxQkFaMkIsRUFhM0IsU0FiMkIsRUFjM0IsY0FkMkIsRUFlM0IsaUJBZjJCLENBQVA7RUFnQm5COztFQUNILE1BQUl5RCwrQkFBSixHQUFzQztFQUFFLFdBQU8sQ0FDN0MsT0FENkMsRUFFN0MsTUFGNkMsRUFHN0MsWUFINkMsRUFJN0MsWUFKNkMsRUFLN0MsUUFMNkMsQ0FBUDtFQU1yQzs7RUFDSCxNQUFJMUQsT0FBSixHQUFjO0VBQ1osUUFBRyxDQUFDLEtBQUtJLFFBQVQsRUFBbUIsS0FBS0EsUUFBTCxHQUFnQixFQUFoQjtFQUNuQixXQUFPLEtBQUtBLFFBQVo7RUFDRDs7RUFDRCxNQUFJSixPQUFKLENBQVlBLE9BQVosRUFBcUI7RUFBRSxTQUFLSSxRQUFMLEdBQWdCSixPQUFoQjtFQUF5Qjs7RUFDaEQsTUFBSUQsUUFBSixHQUFlO0VBQ2IsUUFBRyxDQUFDLEtBQUtHLFNBQVQsRUFBb0IsS0FBS0EsU0FBTCxHQUFpQixFQUFqQjtFQUNwQixXQUFPLEtBQUtBLFNBQVo7RUFDRDs7RUFDRCxNQUFJSCxRQUFKLENBQWFBLFFBQWIsRUFBdUI7RUFDckIsU0FBS0csU0FBTCxHQUFpQkgsUUFBakI7RUFDQSxTQUFLRSxhQUFMLENBQ0cxQixPQURILENBQ1k0QixZQUFELElBQWtCO0VBQ3pCLFVBQUcsS0FBS0osUUFBTCxDQUFjSSxZQUFkLENBQUgsRUFBZ0M7RUFDOUJ0QyxRQUFBQSxNQUFNLENBQUNvSixnQkFBUCxDQUNFLElBREYsRUFFRTtFQUNFLFdBQUMsSUFBSXpHLE1BQUosQ0FBV0wsWUFBWCxDQUFELEdBQTRCO0VBQzFCK0csWUFBQUEsWUFBWSxFQUFFLElBRFk7RUFFMUJDLFlBQUFBLFFBQVEsRUFBRSxJQUZnQjtFQUcxQjJHLFlBQUFBLFdBQVcsRUFBRTtFQUhhLFdBRDlCO0VBTUUsV0FBQzNOLFlBQUQsR0FBZ0I7RUFDZCtHLFlBQUFBLFlBQVksRUFBRSxJQURBO0VBRWRFLFlBQUFBLFVBQVUsRUFBRSxJQUZFOztFQUdkSixZQUFBQSxHQUFHLEdBQUc7RUFBRSxxQkFBTyxLQUFLLElBQUl4RyxNQUFKLENBQVdMLFlBQVgsQ0FBTCxDQUFQO0VBQXVDLGFBSGpDOztFQUlka0UsWUFBQUEsR0FBRyxDQUFDc0MsS0FBRCxFQUFRO0VBQUUsbUJBQUssSUFBSW5HLE1BQUosQ0FBV0wsWUFBWCxDQUFMLElBQWlDd0csS0FBakM7RUFBd0M7O0VBSnZDO0VBTmxCLFNBRkY7RUFnQkEsYUFBS3hHLFlBQUwsSUFBcUIsS0FBS0osUUFBTCxDQUFjSSxZQUFkLENBQXJCO0VBQ0Q7RUFDRixLQXJCSDtFQXNCQSxTQUFLdUQsK0JBQUwsQ0FDR25GLE9BREgsQ0FDWW9GLDhCQUFELElBQW9DO0VBQzNDLFdBQUtvQixXQUFMLENBQWlCcEIsOEJBQWpCO0VBQ0QsS0FISDtFQUlEOztFQUNEb0IsRUFBQUEsV0FBVyxDQUFDQyxTQUFELEVBQVk7RUFDckIsS0FDRSxLQURGLEVBRUUsSUFGRixFQUdFekcsT0FIRixDQUdXeUMsTUFBRCxJQUFZO0VBQ3BCLFdBQUs0QyxZQUFMLENBQWtCb0IsU0FBbEIsRUFBNkJoRSxNQUE3QjtFQUNELEtBTEQ7RUFNQSxXQUFPLElBQVA7RUFDRDs7RUFDRDRDLEVBQUFBLFlBQVksQ0FBQ29CLFNBQUQsRUFBWWhFLE1BQVosRUFBb0I7RUFDOUIsUUFBTWlFLFFBQVEsR0FBR0QsU0FBUyxDQUFDeEUsTUFBVixDQUFpQixHQUFqQixDQUFqQjtFQUNBLFFBQU0wRSxjQUFjLEdBQUdGLFNBQVMsQ0FBQ3hFLE1BQVYsQ0FBaUIsUUFBakIsQ0FBdkI7RUFDQSxRQUFNMkUsaUJBQWlCLEdBQUdILFNBQVMsQ0FBQ3hFLE1BQVYsQ0FBaUIsV0FBakIsQ0FBMUI7RUFDQSxRQUFNNEUsSUFBSSxHQUFHLEtBQUtILFFBQUwsS0FBa0IsRUFBL0I7RUFDQSxRQUFNSSxVQUFVLEdBQUcsS0FBS0gsY0FBTCxLQUF3QixFQUEzQztFQUNBLFFBQU1JLGFBQWEsR0FBRyxLQUFLSCxpQkFBTCxLQUEyQixFQUFqRDs7RUFDQSxRQUNFdEgsTUFBTSxDQUFDMEgsTUFBUCxDQUFjSCxJQUFkLEVBQW9COUgsTUFBcEIsSUFDQU8sTUFBTSxDQUFDMEgsTUFBUCxDQUFjRixVQUFkLEVBQTBCL0gsTUFEMUIsSUFFQU8sTUFBTSxDQUFDMEgsTUFBUCxDQUFjRCxhQUFkLEVBQTZCaEksTUFIL0IsRUFJRTtFQUNBTyxNQUFBQSxNQUFNLENBQUNTLE9BQVAsQ0FBZStHLFVBQWYsRUFDRzlHLE9BREgsQ0FDVyxVQUF1QztFQUFBLFlBQXRDLENBQUNpSCxhQUFELEVBQWdCQyxnQkFBaEIsQ0FBc0M7RUFDOUMsWUFBTSxDQUFDQyxjQUFELEVBQWlCQyxhQUFqQixJQUFrQ0gsYUFBYSxDQUFDSSxLQUFkLENBQW9CLEdBQXBCLENBQXhDO0VBQ0EsWUFBTUMsNEJBQTRCLEdBQUdILGNBQWMsQ0FBQ0ksU0FBZixDQUF5QixDQUF6QixFQUE0QixDQUE1QixDQUFyQztFQUNBLFlBQU1DLDJCQUEyQixHQUFHTCxjQUFjLENBQUNJLFNBQWYsQ0FBeUJKLGNBQWMsQ0FBQ3BJLE1BQWYsR0FBd0IsQ0FBakQsQ0FBcEM7RUFDQSxZQUFJMEksV0FBVyxHQUFHLEVBQWxCOztFQUNBLFlBQ0VILDRCQUE0QixLQUFLLEdBQWpDLElBQ0FFLDJCQUEyQixLQUFLLEdBRmxDLEVBR0U7RUFDQUMsVUFBQUEsV0FBVyxHQUFHbkksTUFBTSxDQUFDUyxPQUFQLENBQWU4RyxJQUFmLEVBQ1h6RSxNQURXLENBQ0osQ0FBQ3NGLFlBQUQsWUFBMEM7RUFBQSxnQkFBM0IsQ0FBQ2hCLFFBQUQsRUFBV2lCLFVBQVgsQ0FBMkI7RUFDaEQsZ0JBQUlDLDBCQUEwQixHQUFHVCxjQUFjLENBQUMxRyxLQUFmLENBQXFCLENBQXJCLEVBQXdCLENBQUMsQ0FBekIsQ0FBakM7RUFDQSxnQkFBSW9ILG9CQUFvQixHQUFHLElBQUlDLE1BQUosQ0FBV0YsMEJBQVgsQ0FBM0I7O0VBQ0EsZ0JBQUdsQixRQUFRLENBQUNxQixLQUFULENBQWVGLG9CQUFmLENBQUgsRUFBeUM7RUFDdkNILGNBQUFBLFlBQVksQ0FBQ3RJLElBQWIsQ0FBa0J1SSxVQUFsQjtFQUNEOztFQUNELG1CQUFPRCxZQUFQO0VBQ0QsV0FSVyxFQVFULEVBUlMsQ0FBZDtFQVNELFNBYkQsTUFhTyxJQUFHYixJQUFJLENBQUNNLGNBQUQsQ0FBUCxFQUF5QjtFQUM5Qk0sVUFBQUEsV0FBVyxDQUFDckksSUFBWixDQUFpQnlILElBQUksQ0FBQ00sY0FBRCxDQUFyQjtFQUNEOztFQUNELFlBQUlhLGlCQUFpQixHQUFHakIsYUFBYSxDQUFDRyxnQkFBRCxDQUFyQzs7RUFDQSxZQUNFYyxpQkFBaUIsSUFDakJBLGlCQUFpQixDQUFDbEosSUFBbEIsQ0FBdUJ1SSxLQUF2QixDQUE2QixHQUE3QixFQUFrQ3RJLE1BQWxDLEtBQTZDLENBRi9DLEVBR0U7RUFDQWlKLFVBQUFBLGlCQUFpQixHQUFHQSxpQkFBaUIsQ0FBQ0MsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBcEI7RUFDRDs7RUFDRCxZQUNFZCxjQUFjLElBQ2RDLGFBREEsSUFFQUssV0FBVyxDQUFDMUksTUFGWixJQUdBaUosaUJBSkYsRUFLRTtFQUNBUCxVQUFBQSxXQUFXLENBQ1J6SCxPQURILENBQ1kySCxVQUFELElBQWdCO0VBQ3ZCLGdCQUFJO0VBQ0Ysc0JBQU9sRixNQUFQO0VBQ0UscUJBQUssSUFBTDtFQUNFa0Ysa0JBQUFBLFVBQVUsQ0FBQ2xGLE1BQUQsQ0FBVixDQUFtQjJFLGFBQW5CLEVBQWtDWSxpQkFBbEM7RUFDQTs7RUFDRixxQkFBSyxLQUFMO0VBQ0VMLGtCQUFBQSxVQUFVLENBQUNsRixNQUFELENBQVYsQ0FBbUIyRSxhQUFuQixFQUFrQ1ksaUJBQWxDO0VBQ0E7RUFOSjtFQVFELGFBVEQsQ0FTRSxPQUFNbkQsS0FBTixFQUFhO0VBQ2Isb0JBQU1BLEtBQU47RUFDRDtFQUNGLFdBZEg7RUFlRDtFQUNGLE9BbkRIO0VBb0REOztFQUNELFdBQU8sSUFBUDtFQUNEOztFQS9JcUMsQ0FBeEM7O0VDQUEsSUFBTTJLLE1BQU0sR0FBRyxjQUFjbFIsTUFBZCxDQUFxQjtFQUNsQ0MsRUFBQUEsV0FBVyxHQUE4QjtFQUFBLFFBQTdCaUQsUUFBNkIsdUVBQWxCLEVBQWtCO0VBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0VBQ3ZDO0VBQ0EsU0FBS0QsUUFBTCxHQUFnQkEsUUFBaEI7RUFDQSxTQUFLQyxPQUFMLEdBQWVBLE9BQWY7RUFDQSxRQUFHLEtBQUtnTyxXQUFSLEVBQXFCLEtBQUtDLGVBQUw7RUFDdEI7O0VBQ0QsTUFBSWhPLGFBQUosR0FBb0I7RUFBRSxXQUFPLENBQzNCLE1BRDJCLEVBRTNCLGFBRjJCLEVBRzNCLFlBSDJCLEVBSTNCLFFBSjJCLENBQVA7RUFLbkI7O0VBQ0gsTUFBSUYsUUFBSixHQUFlO0VBQUUsV0FBTyxLQUFLRyxTQUFaO0VBQXVCOztFQUN4QyxNQUFJSCxRQUFKLENBQWFBLFFBQWIsRUFBdUI7RUFDckIsU0FBS0csU0FBTCxHQUFpQkgsUUFBakI7RUFDQSxTQUFLRSxhQUFMLENBQW1CMUIsT0FBbkIsQ0FBNEI0QixZQUFELElBQWtCO0VBQzNDLFVBQUdKLFFBQVEsQ0FBQ0ksWUFBRCxDQUFYLEVBQTJCLEtBQUtBLFlBQUwsSUFBcUJKLFFBQVEsQ0FBQ0ksWUFBRCxDQUE3QjtFQUM1QixLQUZEO0VBR0Q7O0VBQ0QsTUFBSUgsT0FBSixHQUFjO0VBQ1osUUFBRyxDQUFDLEtBQUtJLFFBQVQsRUFBbUIsS0FBS0EsUUFBTCxHQUFnQixFQUFoQjtFQUNuQixXQUFPLEtBQUtBLFFBQVo7RUFDRDs7RUFDRCxNQUFJSixPQUFKLENBQVlBLE9BQVosRUFBcUI7RUFBRSxTQUFLSSxRQUFMLEdBQWdCSixPQUFoQjtFQUF5Qjs7RUFDaEQsTUFBSWtPLFFBQUosR0FBZTtFQUFFLFdBQU9DLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkYsUUFBdkI7RUFBaUM7O0VBQ2xELE1BQUlHLFFBQUosR0FBZTtFQUFFLFdBQU9GLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsUUFBdkI7RUFBaUM7O0VBQ2xELE1BQUlDLElBQUosR0FBVztFQUFFLFdBQU9ILE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkUsSUFBdkI7RUFBNkI7O0VBQzFDLE1BQUlDLFFBQUosR0FBZTtFQUFFLFdBQU9KLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkcsUUFBdkI7RUFBaUM7O0VBQ2xELE1BQUlDLElBQUosR0FBVztFQUNULFFBQUlDLE1BQU0sR0FBR04sTUFBTSxDQUFDQyxRQUFQLENBQWdCRyxRQUFoQixDQUNWRyxPQURVLENBQ0YsSUFBSXJJLE1BQUosQ0FBVyxDQUFDLEdBQUQsRUFBTSxLQUFLc0ksSUFBWCxFQUFpQjVOLElBQWpCLENBQXNCLEVBQXRCLENBQVgsQ0FERSxFQUNxQyxFQURyQyxFQUVWNkUsS0FGVSxDQUVKLEdBRkksRUFHVjVHLEtBSFUsQ0FHSixDQUhJLEVBR0QsQ0FIQyxFQUlWLENBSlUsQ0FBYjtFQUtBLFFBQUk0UCxTQUFTLEdBQ1hILE1BQU0sQ0FBQ25SLE1BQVAsS0FBa0IsQ0FESixHQUVaLEVBRlksR0FJVm1SLE1BQU0sQ0FBQ25SLE1BQVAsS0FBa0IsQ0FBbEIsSUFDQW1SLE1BQU0sQ0FBQ25JLEtBQVAsQ0FBYSxLQUFiLENBREEsSUFFQW1JLE1BQU0sQ0FBQ25JLEtBQVAsQ0FBYSxLQUFiLENBSEYsR0FJSSxDQUFDLEdBQUQsQ0FKSixHQUtJbUksTUFBTSxDQUNIQyxPQURILENBQ1csS0FEWCxFQUNrQixFQURsQixFQUVHQSxPQUZILENBRVcsS0FGWCxFQUVrQixFQUZsQixFQUdHOUksS0FISCxDQUdTLEdBSFQsQ0FSUjtFQVlBLFdBQU87RUFDTGdKLE1BQUFBLFNBQVMsRUFBRUEsU0FETjtFQUVMSCxNQUFBQSxNQUFNLEVBQUVBO0VBRkgsS0FBUDtFQUlEOztFQUNELE1BQUlJLElBQUosR0FBVztFQUNULFFBQUlKLE1BQU0sR0FBR04sTUFBTSxDQUFDQyxRQUFQLENBQWdCUyxJQUFoQixDQUNWN1AsS0FEVSxDQUNKLENBREksRUFFVjRHLEtBRlUsQ0FFSixHQUZJLEVBR1Y1RyxLQUhVLENBR0osQ0FISSxFQUdELENBSEMsRUFJVixDQUpVLENBQWI7RUFLQSxRQUFJNFAsU0FBUyxHQUNYSCxNQUFNLENBQUNuUixNQUFQLEtBQWtCLENBREosR0FFWixFQUZZLEdBSVZtUixNQUFNLENBQUNuUixNQUFQLEtBQWtCLENBQWxCLElBQ0FtUixNQUFNLENBQUNuSSxLQUFQLENBQWEsS0FBYixDQURBLElBRUFtSSxNQUFNLENBQUNuSSxLQUFQLENBQWEsS0FBYixDQUhGLEdBSUksQ0FBQyxHQUFELENBSkosR0FLSW1JLE1BQU0sQ0FDSEMsT0FESCxDQUNXLEtBRFgsRUFDa0IsRUFEbEIsRUFFR0EsT0FGSCxDQUVXLEtBRlgsRUFFa0IsRUFGbEIsRUFHRzlJLEtBSEgsQ0FHUyxHQUhULENBUlI7RUFZQSxXQUFPO0VBQ0xnSixNQUFBQSxTQUFTLEVBQUVBLFNBRE47RUFFTEgsTUFBQUEsTUFBTSxFQUFFQTtFQUZILEtBQVA7RUFJRDs7RUFDRCxNQUFJbk8sVUFBSixHQUFpQjtFQUNmLFFBQUltTyxNQUFKO0VBQ0EsUUFBSWhRLElBQUo7O0VBQ0EsUUFBRzBQLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQlUsSUFBaEIsQ0FBcUJ4SSxLQUFyQixDQUEyQixJQUEzQixDQUFILEVBQXFDO0VBQ25DLFVBQUloRyxVQUFVLEdBQUc2TixNQUFNLENBQUNDLFFBQVAsQ0FBZ0JVLElBQWhCLENBQ2RsSixLQURjLENBQ1IsR0FEUSxFQUVkNUcsS0FGYyxDQUVSLENBQUMsQ0FGTyxFQUdkK0IsSUFIYyxDQUdULEVBSFMsQ0FBakI7RUFJQTBOLE1BQUFBLE1BQU0sR0FBR25PLFVBQVQ7RUFDQTdCLE1BQUFBLElBQUksR0FBRzZCLFVBQVUsQ0FDZHNGLEtBREksQ0FDRSxHQURGLEVBRUpqRixNQUZJLENBRUcsQ0FDTnVCLFdBRE0sRUFFTjZNLFNBRk0sS0FHSDtFQUNILFlBQUlDLGFBQWEsR0FBR0QsU0FBUyxDQUFDbkosS0FBVixDQUFnQixHQUFoQixDQUFwQjtFQUNBMUQsUUFBQUEsV0FBVyxDQUFDOE0sYUFBYSxDQUFDLENBQUQsQ0FBZCxDQUFYLEdBQWdDQSxhQUFhLENBQUMsQ0FBRCxDQUE3QztFQUNBLGVBQU85TSxXQUFQO0VBQ0QsT0FUSSxFQVNGLEVBVEUsQ0FBUDtFQVVELEtBaEJELE1BZ0JPO0VBQ0x1TSxNQUFBQSxNQUFNLEdBQUcsRUFBVDtFQUNBaFEsTUFBQUEsSUFBSSxHQUFHLEVBQVA7RUFDRDs7RUFDRCxXQUFPO0VBQ0xnUSxNQUFBQSxNQUFNLEVBQUVBLE1BREg7RUFFTGhRLE1BQUFBLElBQUksRUFBRUE7RUFGRCxLQUFQO0VBSUQ7O0VBQ0QsTUFBSWtRLElBQUosR0FBVztFQUFFLFdBQU8sS0FBS00sS0FBTCxJQUFjLEdBQXJCO0VBQTBCOztFQUN2QyxNQUFJTixJQUFKLENBQVNBLElBQVQsRUFBZTtFQUFFLFNBQUtNLEtBQUwsR0FBYU4sSUFBYjtFQUFtQjs7RUFDcEMsTUFBSVgsV0FBSixHQUFrQjtFQUFFLFdBQU8sS0FBS2tCLFlBQUwsSUFBcUIsS0FBNUI7RUFBbUM7O0VBQ3ZELE1BQUlsQixXQUFKLENBQWdCQSxXQUFoQixFQUE2QjtFQUFFLFNBQUtrQixZQUFMLEdBQW9CbEIsV0FBcEI7RUFBaUM7O0VBQ2hFLE1BQUltQixNQUFKLEdBQWE7RUFBRSxXQUFPLEtBQUtDLE9BQVo7RUFBcUI7O0VBQ3BDLE1BQUlELE1BQUosQ0FBV0EsTUFBWCxFQUFtQjtFQUFFLFNBQUtDLE9BQUwsR0FBZUQsTUFBZjtFQUF1Qjs7RUFDNUMsTUFBSUUsVUFBSixHQUFpQjtFQUFFLFdBQU8sS0FBS0MsV0FBWjtFQUF5Qjs7RUFDNUMsTUFBSUQsVUFBSixDQUFlQSxVQUFmLEVBQTJCO0VBQUUsU0FBS0MsV0FBTCxHQUFtQkQsVUFBbkI7RUFBK0I7O0VBQzVELE1BQUlqQixRQUFKLEdBQWU7RUFDYixXQUFPO0VBQ0xPLE1BQUFBLElBQUksRUFBRSxLQUFLQSxJQUROO0VBRUxILE1BQUFBLElBQUksRUFBRSxLQUFLQSxJQUZOO0VBR0xLLE1BQUFBLElBQUksRUFBRSxLQUFLQSxJQUhOO0VBSUx2TyxNQUFBQSxVQUFVLEVBQUUsS0FBS0E7RUFKWixLQUFQO0VBTUQ7O0VBQ0RpUCxFQUFBQSxVQUFVLENBQUNDLGNBQUQsRUFBaUJDLGlCQUFqQixFQUFvQztFQUM1QyxRQUFJQyxZQUFZLEdBQUcsSUFBSXpSLEtBQUosRUFBbkI7O0VBQ0EsUUFBR3VSLGNBQWMsQ0FBQ2xTLE1BQWYsS0FBMEJtUyxpQkFBaUIsQ0FBQ25TLE1BQS9DLEVBQXVEO0VBQ3JEb1MsTUFBQUEsWUFBWSxHQUFHRixjQUFjLENBQzFCN08sTUFEWSxDQUNMLENBQUNnUCxhQUFELEVBQWdCQyxhQUFoQixFQUErQkMsa0JBQS9CLEtBQXNEO0VBQzVELFlBQUlDLGdCQUFnQixHQUFHTCxpQkFBaUIsQ0FBQ0ksa0JBQUQsQ0FBeEM7O0VBQ0EsWUFBR0QsYUFBYSxDQUFDdEosS0FBZCxDQUFvQixLQUFwQixDQUFILEVBQStCO0VBQzdCcUosVUFBQUEsYUFBYSxDQUFDaFMsSUFBZCxDQUFtQixJQUFuQjtFQUNELFNBRkQsTUFFTyxJQUFHaVMsYUFBYSxLQUFLRSxnQkFBckIsRUFBdUM7RUFDNUNILFVBQUFBLGFBQWEsQ0FBQ2hTLElBQWQsQ0FBbUIsSUFBbkI7RUFDRCxTQUZNLE1BRUE7RUFDTGdTLFVBQUFBLGFBQWEsQ0FBQ2hTLElBQWQsQ0FBbUIsS0FBbkI7RUFDRDs7RUFDRCxlQUFPZ1MsYUFBUDtFQUNELE9BWFksRUFXVixFQVhVLENBQWY7RUFZRCxLQWJELE1BYU87RUFDTEQsTUFBQUEsWUFBWSxDQUFDL1IsSUFBYixDQUFrQixLQUFsQjtFQUNEOztFQUNELFdBQVErUixZQUFZLENBQUNLLE9BQWIsQ0FBcUIsS0FBckIsTUFBZ0MsQ0FBQyxDQUFsQyxHQUNILElBREcsR0FFSCxLQUZKO0VBR0Q7O0VBQ0RDLEVBQUFBLFFBQVEsQ0FBQzVCLFFBQUQsRUFBVztFQUNqQixRQUFJZSxNQUFNLEdBQUd0UixNQUFNLENBQUNTLE9BQVAsQ0FBZSxLQUFLNlEsTUFBcEIsRUFDVnhPLE1BRFUsQ0FDSCxDQUNOeU8sT0FETSxXQUV5QjtFQUFBLFVBQS9CLENBQUNhLFNBQUQsRUFBWUMsYUFBWixDQUErQjtFQUM3QixVQUFJVixjQUFjLEdBQ2hCUyxTQUFTLENBQUMzUyxNQUFWLEtBQXFCLENBQXJCLElBQ0EyUyxTQUFTLENBQUMzSixLQUFWLENBQWdCLEtBQWhCLENBRm1CLEdBR2pCLENBQUMySixTQUFELENBSGlCLEdBSWhCQSxTQUFTLENBQUMzUyxNQUFWLEtBQXFCLENBQXRCLEdBQ0UsQ0FBQyxFQUFELENBREYsR0FFRTJTLFNBQVMsQ0FDTnZCLE9BREgsQ0FDVyxLQURYLEVBQ2tCLEVBRGxCLEVBRUdBLE9BRkgsQ0FFVyxLQUZYLEVBRWtCLEVBRmxCLEVBR0c5SSxLQUhILENBR1MsR0FIVCxDQU5OO0VBVUFzSyxNQUFBQSxhQUFhLENBQUN0QixTQUFkLEdBQTBCWSxjQUExQjtFQUNBSixNQUFBQSxPQUFPLENBQUNJLGNBQWMsQ0FBQ3pPLElBQWYsQ0FBb0IsR0FBcEIsQ0FBRCxDQUFQLEdBQW9DbVAsYUFBcEM7RUFDQSxhQUFPZCxPQUFQO0VBQ0QsS0FqQlEsRUFrQlQsRUFsQlMsQ0FBYjtFQW9CQSxXQUFPdlIsTUFBTSxDQUFDMEgsTUFBUCxDQUFjNEosTUFBZCxFQUNKMUcsSUFESSxDQUNFMEgsS0FBRCxJQUFXO0VBQ2YsVUFBSVgsY0FBYyxHQUFHVyxLQUFLLENBQUN2QixTQUEzQjtFQUNBLFVBQUlhLGlCQUFpQixHQUFJLEtBQUt6QixXQUFOLEdBQ3BCSSxRQUFRLENBQUNTLElBQVQsQ0FBY0QsU0FETSxHQUVwQlIsUUFBUSxDQUFDSSxJQUFULENBQWNJLFNBRmxCO0VBR0EsVUFBSVcsVUFBVSxHQUFHLEtBQUtBLFVBQUwsQ0FDZkMsY0FEZSxFQUVmQyxpQkFGZSxDQUFqQjtFQUlBLGFBQU9GLFVBQVUsS0FBSyxJQUF0QjtFQUNELEtBWEksQ0FBUDtFQVlEOztFQUNEYSxFQUFBQSxVQUFVLENBQUMvSSxLQUFELEVBQVE7RUFDaEIsUUFBSStHLFFBQVEsR0FBRyxLQUFLQSxRQUFwQjtFQUNBLFFBQUkrQixLQUFLLEdBQUcsS0FBS0gsUUFBTCxDQUFjNUIsUUFBZCxDQUFaO0VBQ0EsUUFBSWlDLFNBQVMsR0FBRztFQUNkRixNQUFBQSxLQUFLLEVBQUVBLEtBRE87RUFFZC9CLE1BQUFBLFFBQVEsRUFBRUE7RUFGSSxLQUFoQjs7RUFJQSxRQUFHK0IsS0FBSCxFQUFVO0VBQ1IsV0FBS3BTLElBQUwsQ0FDRSxRQURGLEVBRUVzUyxTQUZGLEVBR0UsSUFIRjtFQUtEOztFQUNELFdBQU8sSUFBUDtFQUNEOztFQUNEcEMsRUFBQUEsZUFBZSxHQUFHO0VBQ2hCRSxJQUFBQSxNQUFNLENBQUMxUixFQUFQLENBQVUsWUFBVixFQUF3QixLQUFLMlQsVUFBTCxDQUFnQjVKLElBQWhCLENBQXFCLElBQXJCLENBQXhCO0VBQ0EsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0Q4SixFQUFBQSxrQkFBa0IsR0FBRztFQUNuQm5DLElBQUFBLE1BQU0sQ0FBQ3hSLEdBQVAsQ0FBVyxZQUFYLEVBQXlCLEtBQUt5VCxVQUFMLENBQWdCNUosSUFBaEIsQ0FBcUIsSUFBckIsQ0FBekI7RUFDQSxXQUFPLElBQVA7RUFDRDs7RUFDRCtKLEVBQUFBLFFBQVEsR0FBaUI7RUFBQSxRQUFoQmxRLEdBQWdCLHVFQUFWbVEsTUFBTSxFQUFJOztFQUN2QixRQUFHLEtBQUt4QyxXQUFSLEVBQXFCO0VBQ25CLFVBQUczTixHQUFHLEtBQUssRUFBWCxFQUFlQSxHQUFHLEdBQUcsR0FBTjtFQUNmOE4sTUFBQUEsTUFBTSxDQUFDQyxRQUFQLENBQWdCUyxJQUFoQixHQUF1QnhPLEdBQXZCO0VBQ0QsS0FIRCxNQUdPO0VBQ0wsVUFBR0EsR0FBRyxLQUFLLEVBQVgsRUFBZUEsR0FBRyxHQUFHLEdBQU47RUFDZjhOLE1BQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQlUsSUFBaEIsR0FBdUJ6TyxHQUF2QjtFQUNEOztFQUNELFdBQU8sSUFBUDtFQUNEOztFQWhOaUMsQ0FBcEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9
