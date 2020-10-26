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

      return this;
    }

    addWindowEvents() {
      window.on('popstate', this.popState.bind(this));
      return this;
    }

    removeWindowEvents() {
      window.off('popstate', this.popState.bind(this));
      return this;
    }

    navigate(path) {
      if (this.hashRouting) {
        window.location.hash = path;
      } else {
        window.location.href = path;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxpdGllcy91dWlkLmpzIiwiLi4vLi4vc291cmNlL01WQy9TZXJ2aWNlL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Nb2RlbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29sbGVjdGlvbi9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVmlldy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29udHJvbGxlci9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvUm91dGVyL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIkV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiA9IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lclxyXG5FdmVudFRhcmdldC5wcm90b3R5cGUub2ZmID0gRXZlbnRUYXJnZXQucHJvdG90eXBlLm9mZiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lclxyXG4iLCJjbGFzcyBFdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2V2ZW50cygpIHtcclxuICAgIHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMgfHwge31cclxuICAgIHJldHVybiB0aGlzLmV2ZW50c1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpIHsgcmV0dXJuIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdIHx8IHt9IH1cclxuICBnZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gKGV2ZW50Q2FsbGJhY2submFtZS5sZW5ndGgpXHJcbiAgICAgID8gZXZlbnRDYWxsYmFjay5uYW1lXHJcbiAgICAgIDogJ2Fub255bW91c0Z1bmN0aW9uJ1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKSB7XHJcbiAgICByZXR1cm4gZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdIHx8IFtdXHJcbiAgfVxyXG4gIG9uKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaykge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5nZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja05hbWUgPSB0aGlzLmdldEV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja0dyb3VwID0gdGhpcy5nZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKVxyXG4gICAgZXZlbnRDYWxsYmFja0dyb3VwLnB1c2goZXZlbnRDYWxsYmFjaylcclxuICAgIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudENhbGxiYWNrc1xyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgb2ZmKCkge1xyXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgICAgY2FzZSAwOlxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrTmFtZSA9ICh0eXBlb2YgZXZlbnRDYWxsYmFjayA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICA/IGV2ZW50Q2FsbGJhY2tcclxuICAgICAgICAgIDogdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKSB7XHJcbiAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1bZXZlbnRDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0pLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgKSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGVtaXQoKSB7XHJcbiAgICBsZXQgX2FyZ3VtZW50cyA9IEFycmF5LmZyb20oYXJndW1lbnRzKVxyXG4gICAgbGV0IGV2ZW50TmFtZSA9IF9hcmd1bWVudHMuc3BsaWNlKDAsIDEpWzBdXHJcbiAgICBsZXQgZXZlbnREYXRhID0gX2FyZ3VtZW50cy5zcGxpY2UoMCwgMSlbMF1cclxuICAgIGxldCBldmVudEFyZ3VtZW50cyA9IF9hcmd1bWVudHMuc3BsaWNlKDApXHJcbiAgICBPYmplY3QuZW50cmllcyh0aGlzLmdldEV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSkpXHJcbiAgICAgIC5mb3JFYWNoKChbZXZlbnRDYWxsYmFja0dyb3VwTmFtZSwgZXZlbnRDYWxsYmFja0dyb3VwXSkgPT4ge1xyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgICAgICAgLmZvckVhY2goKGV2ZW50Q2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgZXZlbnRDYWxsYmFjayhcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBldmVudE5hbWUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBldmVudERhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIC4uLmV2ZW50QXJndW1lbnRzXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBFdmVudHNcclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX3Jlc3BvbnNlcygpIHtcclxuICAgIHRoaXMucmVzcG9uc2VzID0gdGhpcy5yZXNwb25zZXNcclxuICAgICAgPyB0aGlzLnJlc3BvbnNlc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZiAocmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgICB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSA9IHJlc3BvbnNlQ2FsbGJhY2tcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VdXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlcXVlc3QocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZiAodGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0pIHtcclxuICAgICAgdmFyIF9hcmd1bWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLnNsaWNlKDEpXHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSguLi5fYXJndW1lbnRzKVxyXG4gICAgfVxyXG4gIH1cclxuICBvZmYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZiAocmVzcG9uc2VOYW1lKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yICh2YXIgW19yZXNwb25zZU5hbWVdIG9mIE9iamVjdC5rZXlzKHRoaXMuX3Jlc3BvbnNlcykpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW19yZXNwb25zZU5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IENoYW5uZWwgZnJvbSAnLi9DaGFubmVsL2luZGV4J1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfY2hhbm5lbHMoKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzID0gdGhpcy5jaGFubmVsc1xyXG4gICAgICA/IHRoaXMuY2hhbm5lbHNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbHNcclxuICB9XHJcbiAgY2hhbm5lbChjaGFubmVsTmFtZSkge1xyXG4gICAgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdID0gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgID8gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgIDogbmV3IENoYW5uZWwoKVxyXG4gICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxuICBvZmYoY2hhbm5lbE5hbWUpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVVVJRCgpIHtcclxuICB2YXIgdXVpZCA9IFwiXCIsIGksIHJhbmRvbVxyXG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSB7XHJcbiAgICByYW5kb20gPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwXHJcblxyXG4gICAgaWYgKGkgPT0gOCB8fCBpID09IDEyIHx8IGkgPT0gMTYgfHwgaSA9PSAyMCkge1xyXG4gICAgICB1dWlkICs9IFwiLVwiXHJcbiAgICB9XHJcbiAgICB1dWlkICs9IChpID09IDEyID8gNCA6IChpID09IDE2ID8gKHJhbmRvbSAmIDMgfCA4KSA6IHJhbmRvbSkpLnRvU3RyaW5nKDE2KVxyXG4gIH1cclxuICByZXR1cm4gdXVpZFxyXG59XHJcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4J1xuXG5jbGFzcyBTZXJ2aWNlIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAndXJsJyxcbiAgICAnbWV0aG9kJyxcbiAgICAnbW9kZScsXG4gICAgJ2NhY2hlJyxcbiAgICAnY3JlZGVudGlhbHMnLFxuICAgICdoZWFkZXJzJyxcbiAgICAncGFyYW1ldGVycycsXG4gICAgJ3JlZGlyZWN0JyxcbiAgICAncmVmZXJyZXJQb2xpY3knLFxuICAgICdib2R5JyxcbiAgICAnZmlsZXMnLFxuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCB1cmwoKSB7XG4gICAgaWYodGhpcy5wYXJhbWV0ZXJzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsLmNvbmNhdCh0aGlzLnF1ZXJ5U3RyaW5nKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsXG4gICAgfVxuICB9XG4gIHNldCB1cmwodXJsKSB7IHRoaXMuX3VybCA9IHVybCB9XG4gIGdldCBxdWVyeVN0cmluZygpIHtcbiAgICBsZXQgcXVlcnlTdHJpbmcgPSAnJ1xuICAgIGlmKHRoaXMucGFyYW1ldGVycykge1xuICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IE9iamVjdC5lbnRyaWVzKHRoaXMucGFyYW1ldGVycylcbiAgICAgICAgLnJlZHVjZSgocGFyYW1ldGVyU3RyaW5ncywgW3BhcmFtZXRlcktleSwgcGFyYW1ldGVyVmFsdWVdKSA9PiB7XG4gICAgICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IHBhcmFtZXRlcktleS5jb25jYXQoJz0nLCBwYXJhbWV0ZXJWYWx1ZSlcbiAgICAgICAgICBwYXJhbWV0ZXJTdHJpbmdzLnB1c2gocGFyYW1ldGVyU3RyaW5nKVxuICAgICAgICAgIHJldHVybiBwYXJhbWV0ZXJTdHJpbmdzXG4gICAgICAgIH0sIFtdKVxuICAgICAgICAgIC5qb2luKCcmJylcbiAgICAgIHF1ZXJ5U3RyaW5nID0gJz8nLmNvbmNhdChwYXJhbWV0ZXJTdHJpbmcpXG4gICAgfVxuICAgIHJldHVybiBxdWVyeVN0cmluZ1xuICB9XG4gIGdldCBtZXRob2QoKSB7IHJldHVybiB0aGlzLl9tZXRob2QgfVxuICBzZXQgbWV0aG9kKG1ldGhvZCkgeyB0aGlzLl9tZXRob2QgPSBtZXRob2QgfVxuICBnZXQgbW9kZSgpIHsgcmV0dXJuIHRoaXMuX21vZGUgfVxuICBzZXQgbW9kZShtb2RlKSB7IHRoaXMuX21vZGUgPSBtb2RlIH1cbiAgZ2V0IGNhY2hlKCkgeyByZXR1cm4gdGhpcy5fY2FjaGUgfVxuICBzZXQgY2FjaGUoY2FjaGUpIHsgdGhpcy5fY2FjaGUgPSBjYWNoZSB9XG4gIGdldCBjcmVkZW50aWFscygpIHsgcmV0dXJuIHRoaXMuX2NyZWRlbnRpYWxzIH1cbiAgc2V0IGNyZWRlbnRpYWxzKGNyZWRlbnRpYWxzKSB7IHRoaXMuX2NyZWRlbnRpYWxzID0gY3JlZGVudGlhbHMgfVxuICBnZXQgaGVhZGVycygpIHsgcmV0dXJuIHRoaXMuX2hlYWRlcnMgfVxuICBzZXQgaGVhZGVycyhoZWFkZXJzKSB7IHRoaXMuX2hlYWRlcnMgPSBoZWFkZXJzIH1cbiAgZ2V0IHJlZGlyZWN0KCkgeyByZXR1cm4gdGhpcy5fcmVkaXJlY3QgfVxuICBzZXQgcmVkaXJlY3QocmVkaXJlY3QpIHsgdGhpcy5fcmVkaXJlY3QgPSByZWRpcmVjdCB9XG4gIGdldCByZWZlcnJlclBvbGljeSgpIHsgcmV0dXJuIHRoaXMuX3JlZmVycmVyUG9saWN5IH1cbiAgc2V0IHJlZmVycmVyUG9saWN5KHJlZmVycmVyUG9saWN5KSB7IHRoaXMuX3JlZmVycmVyUG9saWN5ID0gcmVmZXJyZXJQb2xpY3kgfVxuICBnZXQgYm9keSgpIHsgcmV0dXJuIHRoaXMuX2JvZHkgfVxuICBzZXQgYm9keShib2R5KSB7IHRoaXMuX2JvZHkgPSBib2R5IH1cbiAgZ2V0IGZpbGVzKCkgeyByZXR1cm4gdGhpcy5fZmlsZXMgfVxuICBzZXQgZmlsZXMoZmlsZXMpIHsgdGhpcy5fZmlsZXMgPSBmaWxlcyB9XG4gIGdldCBwYXJhbWV0ZXJzKCkgeyByZXR1cm4gdGhpcy5fcGFyYW1ldGVycyB8fCBudWxsIH1cbiAgc2V0IHBhcmFtZXRlcnMocGFyYW1ldGVycykgeyB0aGlzLl9wYXJhbWV0ZXJzID0gcGFyYW1ldGVycyB9XG4gIGdldCBwcmV2aW91c0Fib3J0Q29udHJvbGxlcigpIHtcbiAgICByZXR1cm4gdGhpcy5fcHJldmlvdXNBYm9ydENvbnRyb2xsZXJcbiAgfVxuICBzZXQgcHJldmlvdXNBYm9ydENvbnRyb2xsZXIocHJldmlvdXNBYm9ydENvbnRyb2xsZXIpIHsgdGhpcy5fcHJldmlvdXNBYm9ydENvbnRyb2xsZXIgPSBwcmV2aW91c0Fib3J0Q29udHJvbGxlciB9XG4gIGdldCBhYm9ydENvbnRyb2xsZXIoKSB7XG4gICAgaWYoIXRoaXMuX2Fib3J0Q29udHJvbGxlcikge1xuICAgICAgdGhpcy5wcmV2aW91c0Fib3J0Q29udHJvbGxlciA9IHRoaXMuX2Fib3J0Q29udHJvbGxlclxuICAgIH1cbiAgICB0aGlzLl9hYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKClcbiAgICByZXR1cm4gdGhpcy5fYWJvcnRDb250cm9sbGVyXG4gIH1cbiAgZ2V0IHJlc3BvbnNlKCkgeyByZXR1cm4gdGhpcy5fcmVzcG9uc2UgfVxuICBzZXQgcmVzcG9uc2UocmVzcG9uc2UpIHsgdGhpcy5fcmVzcG9uc2UgPSByZXNwb25zZSB9XG4gIGdldCByZXNwb25zZURhdGEoKSB7IHJldHVybiB0aGlzLl9yZXNwb25zZURhdGEgfVxuICBzZXQgcmVzcG9uc2VEYXRhKHJlc3BvbnNlRGF0YSkgeyB0aGlzLl9yZXNwb25zZURhdGEgPSByZXNwb25zZURhdGEgfVxuICBhYm9ydCgpIHtcbiAgICB0aGlzLmFib3J0Q29udHJvbGxlci5hYm9ydCgpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBmZXRjaCgpIHtcbiAgICBjb25zdCBmZXRjaE9wdGlvbnMgPSB0aGlzLnZhbGlkU2V0dGluZ3MucmVkdWNlKChfZmV0Y2hPcHRpb25zLCBmZXRjaE9wdGlvbk5hbWUpID0+IHtcbiAgICAgIGlmKHRoaXNbZmV0Y2hPcHRpb25OYW1lXSkgX2ZldGNoT3B0aW9uc1tmZXRjaE9wdGlvbk5hbWVdID0gdGhpc1tmZXRjaE9wdGlvbk5hbWVdXG4gICAgICByZXR1cm4gX2ZldGNoT3B0aW9uc1xuICAgIH0sIHt9KVxuICAgIGZldGNoT3B0aW9ucy5zaWduYWwgPSB0aGlzLmFib3J0Q29udHJvbGxlci5zaWduYWxcbiAgICBpZih0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyKSB0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyLmFib3J0KClcbiAgICByZXR1cm4gZmV0Y2godGhpcy51cmwsIGZldGNoT3B0aW9ucylcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICB0aGlzLnJlc3BvbnNlID0gcmVzcG9uc2VcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKVxuICAgICAgfSlcbiAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgICAncmVhZHknLFxuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gZGF0YVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAgICdlcnJvcicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWVzc2FnZTogZXJyb3IsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0aGlzLFxuICAgICAgICApXG4gICAgICAgIHJldHVybiBlcnJvclxuICAgICAgfSlcbiAgfVxuICBhc3luYyBmZXRjaFN5bmMoKSB7XG4gICAgY29uc3QgZmV0Y2hPcHRpb25zID0gdGhpcy52YWxpZFNldHRpbmdzLnJlZHVjZSgoX2ZldGNoT3B0aW9ucywgZmV0Y2hPcHRpb25OYW1lKSA9PiB7XG4gICAgICBpZih0aGlzW2ZldGNoT3B0aW9uTmFtZV0pIF9mZXRjaE9wdGlvbnNbZmV0Y2hPcHRpb25OYW1lXSA9IHRoaXNbZmV0Y2hPcHRpb25OYW1lXVxuICAgICAgcmV0dXJuIF9mZXRjaE9wdGlvbnNcbiAgICB9LCB7fSlcbiAgICBmZXRjaE9wdGlvbnMuc2lnbmFsID0gdGhpcy5hYm9ydENvbnRyb2xsZXIuc2lnbmFsXG4gICAgaWYodGhpcy5wcmV2aW91c0Fib3J0Q29udHJvbGxlcikgdGhpcy5wcmV2aW91c0Fib3J0Q29udHJvbGxlci5hYm9ydCgpXG4gICAgdGhpcy5yZXNwb25zZSA9ICBhd2FpdCBmZXRjaCh0aGlzLnVybCwgZmV0Y2hPcHRpb25zKVxuICAgIHRoaXMucmVzcG9uc2VEYXRhID0gYXdhaXQgdGhpcy5yZXNwb25zZS5qc29uKClcbiAgICBpZihcbiAgICAgIHRoaXMucmVzcG9uc2VEYXRhLmNvZGUgPj0gNDAwICYmXG4gICAgICB0aGlzLnJlc3BvbnNlRGF0YS5jb2RlIDw9IDQ5OVxuICAgICkge1xuICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAnZXJyb3InLFxuICAgICAgICB0aGlzLnJlc3BvbnNlRGF0YSxcbiAgICAgICAgdGhpcyxcbiAgICAgIClcbiAgICAgIHRocm93IHRoaXMucmVzcG9uc2VEYXRhXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgJ3JlYWR5JyxcbiAgICAgICAgdGhpcy5yZXNwb25zZURhdGEsXG4gICAgICAgIHRoaXMsXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzLnJlc3BvbnNlRGF0YVxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBTZXJ2aWNlXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleC5qcydcbmltcG9ydCB7IFVVSUQgfSBmcm9tICcuLi9VdGlsaXRpZXMvaW5kZXgnXG5cbmNvbnN0IE1vZGVsID0gY2xhc3MgZXh0ZW5kcyBFdmVudHMge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuZW1pdChcbiAgICAgICdyZWFkeScsXG4gICAgICB7fSxcbiAgICAgIHRoaXMsXG4gICAgKVxuICB9XG4gIGdldCB1dWlkKCkge1xuICAgIGlmKCF0aGlzLl91dWlkKSB0aGlzLl91dWlkID0gVVVJRCgpXG4gICAgcmV0dXJuIHRoaXMuX3V1aWRcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAnbG9jYWxTdG9yYWdlJyxcbiAgICAnZGVmYXVsdHMnLFxuICAgICdzZXJ2aWNlcycsXG4gICAgJ3NlcnZpY2VFdmVudHMnLFxuICAgICdzZXJ2aWNlQ2FsbGJhY2tzJyxcbiAgXSB9XG4gIGdldCBiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzKCkgeyByZXR1cm4gW1xuICAgICdzZXJ2aWNlJyxcbiAgXSB9XG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICB9KVxuICAgIHRoaXMuYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlc1xuICAgICAgLmZvckVhY2goKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUsICdvbicpXG4gICAgICB9KVxuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgc2VydmljZXMoKSB7XG4gICAgaWYoIXRoaXMuX3NlcnZpY2VzKSB0aGlzLl9zZXJ2aWNlcyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX3NlcnZpY2VzXG4gIH1cbiAgc2V0IHNlcnZpY2VzKHNlcnZpY2VzKSB7IHRoaXMuX3NlcnZpY2VzID0gc2VydmljZXMgfVxuICBnZXQgZGF0YSgpIHtcbiAgICBpZighdGhpcy5fZGF0YSkgdGhpcy5fZGF0YSA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFcbiAgfVxuICBnZXQgZGVmYXVsdHMoKSB7XG4gICAgaWYoIXRoaXMuX2RlZmF1bHRzKSB0aGlzLl9kZWZhdWx0cyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRzXG4gIH1cbiAgc2V0IGRlZmF1bHRzKGRlZmF1bHRzKSB7XG4gICAgaWYodGhpcy5sb2NhbFN0b3JhZ2Uuc3luYyA9PT0gdHJ1ZSkge1xuICAgICAgaWYoT2JqZWN0LmVudHJpZXModGhpcy5kYikubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRzID0gZGVmYXVsdHNcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRzID0gdGhpcy5kYlxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kZWZhdWx0cyA9IGRlZmF1bHRzXG4gICAgfVxuICAgIHRoaXMuc2V0KHRoaXMuZGVmYXVsdHMpXG4gIH1cbiAgZ2V0IGxvY2FsU3RvcmFnZSgpIHsgcmV0dXJuIHRoaXMuX2xvY2FsU3RvcmFnZSB8fCB7fSB9XG4gIHNldCBsb2NhbFN0b3JhZ2UobG9jYWxTdG9yYWdlKSB7IHRoaXMuX2xvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XG4gIGdldCBzdG9yYWdlQ29udGFpbmVyKCkgeyByZXR1cm4ge30gfVxuICBnZXQgZGIoKSB7IHJldHVybiB0aGlzLl9kYiB9XG4gIGdldCBfZGIoKSB7XG4gICAgbGV0IGRiID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHx8IEpTT04uc3RyaW5naWZ5KHRoaXMuc3RvcmFnZUNvbnRhaW5lcilcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkYilcbiAgfVxuICBzZXQgX2RiKGRiKSB7XG4gICAgZGIgPSBKU09OLnN0cmluZ2lmeShkYilcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCwgZGIpXG4gIH1cbiAgcmVzZXRFdmVudHMoY2xhc3NUeXBlKSB7XG4gICAgW1xuICAgICAgJ29mZicsXG4gICAgICAnb24nXG4gICAgXS5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB0b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpIHtcbiAgICBjb25zdCBiYXNlTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ3MnKVxuICAgIGNvbnN0IGJhc2VFdmVudHNOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJylcbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXG4gICAgY29uc3QgYmFzZSA9IHRoaXNbYmFzZU5hbWVdIHx8IHt9XG4gICAgY29uc3QgYmFzZUV2ZW50cyA9IHRoaXNbYmFzZUV2ZW50c05hbWVdIHx8IHt9XG4gICAgY29uc3QgYmFzZUNhbGxiYWNrcyA9IHRoaXNbYmFzZUNhbGxiYWNrc05hbWVdIHx8IHt9XG4gICAgaWYoXG4gICAgICBPYmplY3QudmFsdWVzKGJhc2UpLmxlbmd0aCAmJlxuICAgICAgT2JqZWN0LnZhbHVlcyhiYXNlRXZlbnRzKS5sZW5ndGggJiZcbiAgICAgIE9iamVjdC52YWx1ZXMoYmFzZUNhbGxiYWNrcykubGVuZ3RoXG4gICAgKSB7XG4gICAgICBPYmplY3QuZW50cmllcyhiYXNlRXZlbnRzKVxuICAgICAgICAuZm9yRWFjaCgoW2Jhc2VFdmVudERhdGEsIGJhc2VDYWxsYmFja05hbWVdKSA9PiB7XG4gICAgICAgICAgY29uc3QgW2Jhc2VUYXJnZXROYW1lLCBiYXNlRXZlbnROYW1lXSA9IGJhc2VFdmVudERhdGEuc3BsaXQoJyAnKVxuICAgICAgICAgIGNvbnN0IGJhc2VUYXJnZXROYW1lU3Vic3RyaW5nRmlyc3QgPSBiYXNlVGFyZ2V0TmFtZS5zdWJzdHJpbmcoMCwgMSlcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0xhc3QgPSBiYXNlVGFyZ2V0TmFtZS5zdWJzdHJpbmcoYmFzZVRhcmdldE5hbWUubGVuZ3RoIC0gMSlcbiAgICAgICAgICBsZXQgYmFzZVRhcmdldHMgPSBbXVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdGaXJzdCA9PT0gJ1snICYmXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0xhc3QgPT09ICddJ1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZVRhcmdldHMgPSBPYmplY3QuZW50cmllcyhiYXNlKVxuICAgICAgICAgICAgICAucmVkdWNlKChfYmFzZVRhcmdldHMsIFtiYXNlTmFtZSwgYmFzZVRhcmdldF0pID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmFzZVRhcmdldE5hbWVSZWdFeHBTdHJpbmcgPSBiYXNlVGFyZ2V0TmFtZS5zbGljZSgxLCAtMSlcbiAgICAgICAgICAgICAgICBsZXQgYmFzZVRhcmdldE5hbWVSZWdFeHAgPSBuZXcgUmVnRXhwKGJhc2VUYXJnZXROYW1lUmVnRXhwU3RyaW5nKVxuICAgICAgICAgICAgICAgIGlmKGJhc2VOYW1lLm1hdGNoKGJhc2VUYXJnZXROYW1lUmVnRXhwKSkge1xuICAgICAgICAgICAgICAgICAgX2Jhc2VUYXJnZXRzLnB1c2goYmFzZVRhcmdldClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9iYXNlVGFyZ2V0c1xuICAgICAgICAgICAgICB9LCBbXSlcbiAgICAgICAgICB9IGVsc2UgaWYoYmFzZVtiYXNlVGFyZ2V0TmFtZV0pIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzLnB1c2goYmFzZVtiYXNlVGFyZ2V0TmFtZV0pXG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBiYXNlRXZlbnRDYWxsYmFjayA9IGJhc2VDYWxsYmFja3NbYmFzZUNhbGxiYWNrTmFtZV1cbiAgICAgICAgICBpZihcbiAgICAgICAgICAgIGJhc2VFdmVudENhbGxiYWNrICYmXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFjay5uYW1lLnNwbGl0KCcgJykubGVuZ3RoID09PSAxXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFjayA9IGJhc2VFdmVudENhbGxiYWNrLmJpbmQodGhpcylcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldHMubGVuZ3RoICYmXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFja1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZVRhcmdldHNcbiAgICAgICAgICAgICAgLmZvckVhY2goKGJhc2VUYXJnZXQpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgc3dpdGNoKG1ldGhvZCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdvbic6XG4gICAgICAgICAgICAgICAgICAgICAgYmFzZVRhcmdldFttZXRob2RdKGJhc2VFdmVudE5hbWUsIGJhc2VFdmVudENhbGxiYWNrKVxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ29mZic6XG4gICAgICAgICAgICAgICAgICAgICAgYmFzZVRhcmdldFttZXRob2RdKGJhc2VFdmVudE5hbWUsIGJhc2VFdmVudENhbGxiYWNrKVxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3JcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHNldERCKCkge1xuICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdmFyIF9hcmd1bWVudHMgPSBPYmplY3QuZW50cmllcyhhcmd1bWVudHNbMF0pXG4gICAgICAgIF9hcmd1bWVudHMuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgZGJba2V5XSA9IHZhbHVlXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgbGV0IHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICBicmVha1xuICAgIH1cbiAgICB0aGlzLl9kYiA9IGRiXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldERCKCkge1xuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9kYlxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGRlbGV0ZSBkYltrZXldXG4gICAgICAgIHRoaXMuX2RiID0gZGJcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KSB7XG4gICAgY29uc3QgY3VycmVudERhdGFQcm9wZXJ0eSA9IHRoaXMuZGF0YVtrZXldXG4gICAgaWYoIXNpbGVudCkge1xuICAgICAgdGhpcy5lbWl0KCdiZWZvcmVTZXQnLmNvbmNhdCgnOicsIGtleSksIHtcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIHZhbHVlOiB0aGlzLmdldChrZXkpLFxuICAgICAgfSwge1xuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgfSwgdGhpcylcbiAgICB9XG4gICAgaWYoIWN1cnJlbnREYXRhUHJvcGVydHkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMuZGF0YSwge1xuICAgICAgICBbJ18nLmNvbmNhdChrZXkpXToge1xuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgW2tleV06IHtcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzWydfJy5jb25jYXQoa2V5KV0gfSxcbiAgICAgICAgICBzZXQodmFsdWUpIHsgdGhpc1snXycuY29uY2F0KGtleSldID0gdmFsdWUgfVxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5kYXRhW2tleV0gPSB2YWx1ZVxuICAgIGlmKGN1cnJlbnREYXRhUHJvcGVydHkgaW5zdGFuY2VvZiBNb2RlbCkge1xuICAgICAgY29uc3QgZW1pdCA9IChuYW1lLCBkYXRhLCBtb2RlbCkgPT4gdGhpcy5lbWl0KG5hbWUsIGRhdGEsIG1vZGVsKVxuICAgICAgdGhpcy5kYXRhW2tleV1cbiAgICAgICAgLm9uKCdiZWZvcmVTZXQnLCB0aGlzLmVtaXQoZXZlbnQubmFtZSwgZXZlbnQuZGF0YSwgbW9kZWwpKVxuICAgICAgICAub24oJ3NldCcsIHRoaXMuZW1pdChldmVudC5uYW1lLCBldmVudC5kYXRhLCBtb2RlbCkpXG4gICAgICAgIC5vbignYmVmb3JlVW5zZXQnLCB0aGlzLmVtaXQoZXZlbnQubmFtZSwgZXZlbnQuZGF0YSwgbW9kZWwpKVxuICAgICAgICAub24oJ3Vuc2V0JywgdGhpcy5lbWl0KGV2ZW50Lm5hbWUsIGV2ZW50LmRhdGEsIG1vZGVsKSlcbiAgICB9XG4gICAgaWYoIXNpbGVudCkge1xuICAgICAgdGhpcy5lbWl0KCdzZXQnLmNvbmNhdCgnOicsIGtleSksIHtcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIH0sIHRoaXMpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXREYXRhUHJvcGVydHkoa2V5LCBzaWxlbnQpIHtcbiAgICBpZighc2lsZW50KSB7XG4gICAgICB0aGlzLmVtaXQoJ2JlZm9yZVVuc2V0Jy5jb25jYXQoJzonLCBhcmd1bWVudHNbMF0pLCB0aGlzKVxuICAgIH1cbiAgICBpZih0aGlzLmRhdGFba2V5XSkge1xuICAgICAgZGVsZXRlIHRoaXMuZGF0YVtrZXldXG4gICAgfVxuICAgIGlmKCFzaWxlbnQpIHtcbiAgICAgIHRoaXMuZW1pdCgndW5zZXQnLmNvbmNhdCgnOicsIGFyZ3VtZW50c1swXSksIHRoaXMpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZ2V0KCkge1xuICAgIGlmKGFyZ3VtZW50c1swXSkgcmV0dXJuIHRoaXMuZGF0YVthcmd1bWVudHNbMF1dXG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHRoaXMuZGF0YSlcbiAgICAgIC5yZWR1Y2UoKF9kYXRhLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgX2RhdGFba2V5XSA9IHZhbHVlXG4gICAgICAgIHJldHVybiBfZGF0YVxuICAgICAgfSwge30pXG4gIH1cbiAgc2V0KCkge1xuICAgIGNvbnN0IF9hcmd1bWVudHMgPSBBcnJheS5mcm9tKGFyZ3VtZW50cylcbiAgICB2YXIga2V5LCB2YWx1ZSwgc2lsZW50XG4gICAgaWYoX2FyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIGtleSA9IF9hcmd1bWVudHNbMF1cbiAgICAgIHZhbHVlID0gX2FyZ3VtZW50c1sxXVxuICAgICAgc2lsZW50ID0gX2FyZ3VtZW50c1syXVxuICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCdiZWZvcmVTZXQnLCB0aGlzLmRhdGEsIE9iamVjdC5hc3NpZ24oXG4gICAgICAgIHt9LFxuICAgICAgICB0aGlzLmRhdGEsXG4gICAgICAgIHtcbiAgICAgICAgICBba2V5XTogdmFsdWUsXG4gICAgICAgIH0sXG4gICAgICApLCB0aGlzKVxuICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KVxuICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCdzZXQnLCB0aGlzLmRhdGEsIHRoaXMpXG4gICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgdGhpcy5zZXREQihhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSlcbiAgICB9IGVsc2UgaWYoX2FyZ3VtZW50cy5sZW5ndGggPT09IDIpIHtcbiAgICAgIGlmKFxuICAgICAgICB0eXBlb2YgX2FyZ3VtZW50c1swXSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgdHlwZW9mIF9hcmd1bWVudHNbMV0gPT09ICdib29sZWFuJ1xuICAgICAgKSB7XG4gICAgICAgIHNpbGVudCA9IF9hcmd1bWVudHNbMV1cbiAgICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCdiZWZvcmVTZXQnLCB0aGlzLmRhdGEsIE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAge30sXG4gICAgICAgICAgdGhpcy5kYXRhLFxuICAgICAgICAgIF9hcmd1bWVudHNbMF0sXG4gICAgICAgICksIHRoaXMpXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKF9hcmd1bWVudHNbMF0pLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUsIHNpbGVudClcbiAgICAgICAgfSlcbiAgICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCdzZXQnLCB0aGlzLmRhdGEsIHRoaXMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ2JlZm9yZVNldCcsIHRoaXMuZGF0YSwgT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICB7fSxcbiAgICAgICAgICB0aGlzLmRhdGEsXG4gICAgICAgICAge1xuICAgICAgICAgICAgW19hcmd1bWVudHNbMF1dOiBfYXJndW1lbnRzWzFdLFxuICAgICAgICAgIH0sXG4gICAgICAgICksIHRoaXMpXG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KF9hcmd1bWVudHNbMF0sIF9hcmd1bWVudHNbMV0pXG4gICAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgnc2V0JywgdGhpcy5kYXRhLCB0aGlzKVxuICAgICAgfVxuICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHRoaXMuc2V0REIoX2FyZ3VtZW50c1swXSwgX2FyZ3VtZW50c1sxXSlcbiAgICB9IGVsc2UgaWYoXG4gICAgICBfYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgIUFycmF5LmlzQXJyYXkoX2FyZ3VtZW50c1swXSkgJiZcbiAgICAgIHR5cGVvZiBfYXJndW1lbnRzWzBdID09PSAnb2JqZWN0J1xuICAgICkge1xuICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCdiZWZvcmVTZXQnLCB0aGlzLmRhdGEsIE9iamVjdC5hc3NpZ24oXG4gICAgICAgIHt9LFxuICAgICAgICB0aGlzLmRhdGEsXG4gICAgICAgIF9hcmd1bWVudHNbMF0sXG4gICAgICApLCB0aGlzKVxuICAgICAgT2JqZWN0LmVudHJpZXMoX2FyZ3VtZW50c1swXSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KSB0aGlzLnNldERCKGtleSwgdmFsdWUpXG4gICAgICB9KVxuICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCdzZXQnLCB0aGlzLmRhdGEsIHRoaXMpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXQoKSB7XG4gICAgbGV0IHNpbGVudFxuICAgIGlmKFxuICAgICAgYXJndW1lbnRzLmxlbmd0aCA9PT0gMlxuICAgICkge1xuICAgICAgc2lsZW50ID0gYXJndW1lbnRzWzFdXG4gICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ2JlZm9yZVVuc2V0JywgdGhpcy5kYXRhLCB0aGlzKVxuICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShhcmd1bWVudHNbMF0sIHNpbGVudClcbiAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgndW5zZXQnLCB0aGlzKVxuICAgIH0gZWxzZSBpZihcbiAgICAgIGFyZ3VtZW50cy5sZW5ndGggPT09IDFcbiAgICApIHtcbiAgICAgIGlmKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdib29sZWFuJykge1xuICAgICAgICBzaWxlbnQgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCdiZWZvcmVVbnNldCcsIHRoaXMuZGF0YSwgdGhpcylcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5kYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSwgc2lsZW50KVxuICAgICAgICB9KVxuICAgICAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ3Vuc2V0JywgdGhpcylcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCdiZWZvcmVVbnNldCcsIHRoaXMuZGF0YSwgdGhpcylcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZGF0YSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgfSlcbiAgICAgIGlmKCFzaWxlbnQpIHRoaXMuZW1pdCgndW5zZXQnLCB0aGlzKVxuICAgIH1cbiAgICBpZih0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgdGhpcy51bnNldERCKGtleSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHBhcnNlKGRhdGEgPSB0aGlzLmRhdGEpIHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMoZGF0YSkucmVkdWNlKChfZGF0YSwgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICBpZih2YWx1ZSBpbnN0YW5jZW9mIE1vZGVsKSB7XG4gICAgICAgIF9kYXRhW2tleV0gPSB2YWx1ZS5wYXJzZSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfZGF0YVtrZXldID0gdmFsdWVcbiAgICAgIH1cbiAgICAgIHJldHVybiBfZGF0YVxuICAgIH0sIHt9KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vZGVsXG4iLCJpbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi4vVXRpbGl0aWVzL2luZGV4LmpzJ1xyXG5pbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleC5qcydcclxuaW1wb3J0IE1vZGVsIGZyb20gJy4uL01vZGVsL2luZGV4LmpzJ1xyXG5cclxuY2xhc3MgQ29sbGVjdGlvbiBleHRlbmRzIEV2ZW50cyB7XHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICBzdXBlcigpXHJcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcclxuICB9XHJcbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXHJcbiAgICAnaWRBdHRyaWJ1dGUnLFxyXG4gICAgJ21vZGVsJyxcclxuICAgICdtb2RlbE9wdGlvbnMnLFxyXG4gICAgJ2RlZmF1bHRzJyxcclxuICAgICdzZXJ2aWNlcycsXHJcbiAgICAnc2VydmljZUV2ZW50cycsXHJcbiAgICAnc2VydmljZUNhbGxiYWNrcycsXHJcbiAgICAnbG9jYWxTdG9yYWdlJ1xyXG4gIF0gfVxyXG4gIGdldCBiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzKCkgeyByZXR1cm4gW1xyXG4gICAgJ3NlcnZpY2UnXHJcbiAgXSB9XHJcbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxyXG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xyXG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xyXG4gICAgICBpZihzZXR0aW5nc1t2YWxpZFNldHRpbmddKSB0aGlzW3ZhbGlkU2V0dGluZ10gPSBzZXR0aW5nc1t2YWxpZFNldHRpbmddXHJcbiAgICB9KVxyXG4gICAgdGhpcy5iaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzXHJcbiAgICAgIC5mb3JFYWNoKChiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUpID0+IHtcclxuICAgICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUsICdvbicpXHJcbiAgICAgIH0pXHJcbiAgfVxyXG4gIGdldCBvcHRpb25zKCkge1xyXG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxyXG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcclxuICB9XHJcbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XHJcbiAgZ2V0IHN0b3JhZ2VDb250YWluZXIoKSB7IHJldHVybiBbXSB9XHJcbiAgZ2V0IGRlZmF1bHRJREF0dHJpYnV0ZSgpIHsgcmV0dXJuICdfaWQnIH1cclxuICBnZXQgZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLl9kZWZhdWx0cyB9XHJcbiAgc2V0IGRlZmF1bHRzKGRlZmF1bHRzKSB7XHJcbiAgICB0aGlzLl9kZWZhdWx0cyA9IGRlZmF1bHRzXHJcbiAgICB0aGlzLmFkZChkZWZhdWx0cylcclxuICB9XHJcbiAgZ2V0IHV1aWQoKSB7XHJcbiAgICBpZighdGhpcy5fdXVpZCkgdGhpcy5fdXVpZCA9IFV0aWxpdGllcy5VVUlEKClcclxuICAgIHJldHVybiB0aGlzLl91dWlkXHJcbiAgfVxyXG4gIGdldCBtb2RlbHMoKSB7XHJcbiAgICB0aGlzLl9tb2RlbHMgPSB0aGlzLl9tb2RlbHMgfHwgdGhpcy5zdG9yYWdlQ29udGFpbmVyXHJcbiAgICByZXR1cm4gdGhpcy5fbW9kZWxzXHJcbiAgfVxyXG4gIHNldCBtb2RlbHMobW9kZWxzRGF0YSkgeyB0aGlzLl9tb2RlbHMgPSBtb2RlbHNEYXRhIH1cclxuICBnZXQgbW9kZWwoKSB7IHJldHVybiB0aGlzLl9tb2RlbCB9XHJcbiAgc2V0IG1vZGVsKG1vZGVsKSB7IHRoaXMuX21vZGVsID0gbW9kZWwgfVxyXG4gIGdldCBsb2NhbFN0b3JhZ2UoKSB7IHJldHVybiB0aGlzLl9sb2NhbFN0b3JhZ2UgfVxyXG4gIHNldCBsb2NhbFN0b3JhZ2UobG9jYWxTdG9yYWdlKSB7IHRoaXMuX2xvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XHJcbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9kYXRhIH1cclxuICBnZXQgZGF0YSgpIHtcclxuICAgIGNvbnN0IG1vZGVsc0V4aXN0ID0gKE9iamVjdC5rZXlzKHRoaXMubW9kZWxzKS5sZW5ndGgpXHJcbiAgICAgID8gdHJ1ZVxyXG4gICAgICA6IGZhbHNlXHJcbiAgICByZXR1cm4gKG1vZGVsc0V4aXN0KVxyXG4gICAgICA/IHRoaXMubW9kZWxzXHJcbiAgICAgICAgLm1hcCgobW9kZWwpID0+IG1vZGVsLnBhcnNlKCkpXHJcbiAgICAgIDogW11cclxuICB9XHJcbiAgZ2V0IGRiKCkgeyByZXR1cm4gdGhpcy5fZGIgfVxyXG4gIGdldCBkYigpIHtcclxuICAgIGxldCBkYiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KSB8fCBKU09OLnN0cmluZ2lmeSh0aGlzLnN0b3JhZ2VDb250YWluZXIpXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkYilcclxuICB9XHJcbiAgc2V0IGRiKGRiKSB7XHJcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQsIGRiKVxyXG4gIH1cclxuICByZXNldEV2ZW50cyhjbGFzc1R5cGUpIHtcclxuICAgIFtcclxuICAgICAgJ29mZicsXHJcbiAgICAgICdvbidcclxuICAgIF0uZm9yRWFjaCgobWV0aG9kKSA9PiB7XHJcbiAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKVxyXG4gICAgfSlcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZCkge1xyXG4gICAgY29uc3QgYmFzZU5hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdzJylcclxuICAgIGNvbnN0IGJhc2VFdmVudHNOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJylcclxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3NOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJylcclxuICAgIGNvbnN0IGJhc2UgPSB0aGlzW2Jhc2VOYW1lXVxyXG4gICAgY29uc3QgYmFzZUV2ZW50cyA9IHRoaXNbYmFzZUV2ZW50c05hbWVdXHJcbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzID0gdGhpc1tiYXNlQ2FsbGJhY2tzTmFtZV1cclxuICAgIGlmKFxyXG4gICAgICBiYXNlICYmXHJcbiAgICAgIGJhc2VFdmVudHMgJiZcclxuICAgICAgYmFzZUNhbGxiYWNrc1xyXG4gICAgKSB7XHJcbiAgICAgIE9iamVjdC5lbnRyaWVzKGJhc2VFdmVudHMpXHJcbiAgICAgICAgLmZvckVhY2goKFtiYXNlRXZlbnREYXRhLCBiYXNlQ2FsbGJhY2tOYW1lXSkgPT4ge1xyXG4gICAgICAgICAgbGV0IFtiYXNlVGFyZ2V0TmFtZSwgYmFzZUV2ZW50TmFtZV0gPSBiYXNlRXZlbnREYXRhLnNwbGl0KCcgJylcclxuICAgICAgICAgIGxldCBiYXNlVGFyZ2V0ID0gYmFzZVtiYXNlVGFyZ2V0TmFtZV1cclxuICAgICAgICAgIGxldCBiYXNlQ2FsbGJhY2sgPSBiYXNlQ2FsbGJhY2tzW2Jhc2VDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrICYmXHJcbiAgICAgICAgICAgIGJhc2VDYWxsYmFjay5uYW1lLnNwbGl0KCcgJykubGVuZ3RoID09PSAxXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrID0gYmFzZUNhbGxiYWNrLmJpbmQodGhpcylcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKFxyXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxyXG4gICAgICAgICAgICBiYXNlRXZlbnROYW1lICYmXHJcbiAgICAgICAgICAgIGJhc2VUYXJnZXQgJiZcclxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBiYXNlVGFyZ2V0W21ldGhvZF0oYmFzZUV2ZW50TmFtZSwgYmFzZUNhbGxiYWNrKVxyXG4gICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7fVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBnZXRNb2RlbEluZGV4KG1vZGVsVVVJRCkge1xyXG4gICAgbGV0IG1vZGVsSW5kZXhcclxuICAgIHRoaXMuX21vZGVsc1xyXG4gICAgICAuZmluZCgoX21vZGVsLCBfbW9kZWxJbmRleCkgPT4ge1xyXG4gICAgICAgIGlmKF9tb2RlbCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIF9tb2RlbCBpbnN0YW5jZW9mIE1vZGVsICYmXHJcbiAgICAgICAgICAgIF9tb2RlbC5fdXVpZCA9PT0gbW9kZWxVVUlEXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgbW9kZWxJbmRleCA9IF9tb2RlbEluZGV4XHJcbiAgICAgICAgICAgIHJldHVybiBfbW9kZWxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gbW9kZWxJbmRleFxyXG4gIH1cclxuICByZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleCkge1xyXG4gICAgbGV0IG1vZGVsID0gdGhpcy5fbW9kZWxzLnNwbGljZShtb2RlbEluZGV4LCAxLCBudWxsKVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAncmVtb3ZlOm1vZGVsJyxcclxuICAgICAgbW9kZWxbMF0ucGFyc2UoKSxcclxuICAgICAgdGhpcyxcclxuICAgICAgbW9kZWxbMF1cclxuICAgIClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGFkZE1vZGVsKG1vZGVsRGF0YSkge1xyXG4gICAgbGV0IG1vZGVsXHJcbiAgICBpZihtb2RlbERhdGEgaW5zdGFuY2VvZiBNb2RlbCkge1xyXG4gICAgICBtb2RlbCA9IG1vZGVsRGF0YVxyXG4gICAgfSBlbHNlIGlmKFxyXG4gICAgICB0aGlzLm1vZGVsXHJcbiAgICApIHtcclxuICAgICAgY29uc3QgTW9kZWxQcm90b3R5cGUgPSB0aGlzLm1vZGVsXHJcbiAgICAgIG1vZGVsID0gbmV3IE1vZGVsUHJvdG90eXBlKHtcclxuICAgICAgICBkZWZhdWx0czogbW9kZWxEYXRhLFxyXG4gICAgICB9LCB0aGlzLm1vZGVsT3B0aW9ucylcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG1vZGVsID0gbmV3IE1vZGVsKHtcclxuICAgICAgICBkZWZhdWx0czogbW9kZWxEYXRhXHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBtb2RlbC5vbihcclxuICAgICAgJ3NldCcsXHJcbiAgICAgIChldmVudCwgX21vZGVsKSA9PiB0aGlzLmVtaXQoXHJcbiAgICAgICAgJ2NoYW5nZTptb2RlbCcsXHJcbiAgICAgICAgdGhpcy5wYXJzZSgpLFxyXG4gICAgICAgIHRoaXMsXHJcbiAgICAgICAgX21vZGVsLFxyXG4gICAgICApLFxyXG4gICAgKVxyXG4gICAgdGhpcy5tb2RlbHMucHVzaChtb2RlbClcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ2FkZCcsXHJcbiAgICAgIG1vZGVsLnBhcnNlKCksXHJcbiAgICAgIHRoaXMsXHJcbiAgICAgIG1vZGVsXHJcbiAgICApXHJcbiAgICByZXR1cm4gbW9kZWxcclxuICB9XHJcbiAgYWRkKG1vZGVsRGF0YSkge1xyXG4gICAgaWYoQXJyYXkuaXNBcnJheShtb2RlbERhdGEpKSB7XHJcbiAgICAgIG1vZGVsRGF0YVxyXG4gICAgICAgIC5mb3JFYWNoKChtb2RlbCkgPT4gdGhpcy5hZGRNb2RlbChtb2RlbCkpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmFkZE1vZGVsKG1vZGVsRGF0YSlcclxuICAgIH1cclxuICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlKSB0aGlzLmRiID0gdGhpcy5kYXRhXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdjaGFuZ2UnLFxyXG4gICAgICB0aGlzLnBhcnNlKCksXHJcbiAgICAgIHRoaXNcclxuICAgIClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHJlbW92ZShtb2RlbERhdGEpIHtcclxuICAgIGlmKFxyXG4gICAgICAhQXJyYXkuaXNBcnJheShtb2RlbERhdGEpICYmXHJcbiAgICAgIHR5cGVvZiBtb2RlbERhdGEgPT09ICdvYmplY3QnXHJcbiAgICApIHtcclxuICAgICAgdmFyIG1vZGVsSW5kZXggPSB0aGlzLmdldE1vZGVsSW5kZXgobW9kZWxEYXRhLnV1aWQpXHJcbiAgICAgIHRoaXMucmVtb3ZlTW9kZWxCeUluZGV4KG1vZGVsSW5kZXgpXHJcbiAgICB9IGVsc2UgaWYoQXJyYXkuaXNBcnJheShtb2RlbERhdGEpKSB7XHJcbiAgICAgIG1vZGVsRGF0YVxyXG4gICAgICAgIC5mb3JFYWNoKChtb2RlbCkgPT4ge1xyXG4gICAgICAgICAgdmFyIG1vZGVsSW5kZXggPSB0aGlzLmdldE1vZGVsSW5kZXgobW9kZWwudXVpZClcclxuICAgICAgICAgIHRoaXMucmVtb3ZlTW9kZWxCeUluZGV4KG1vZGVsSW5kZXgpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIHRoaXMubW9kZWxzID0gdGhpcy5tb2RlbHNcclxuICAgICAgLmZpbHRlcigobW9kZWwpID0+IG1vZGVsICE9PSBudWxsKVxyXG4gICAgaWYodGhpcy5fbG9jYWxTdG9yYWdlKSB0aGlzLmRiID0gdGhpcy5kYXRhXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdyZW1vdmUnLFxyXG4gICAgICB0aGlzLnBhcnNlKCksXHJcbiAgICAgIHRoaXNcclxuICAgIClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHJlc2V0KCkge1xyXG4gICAgdGhpcy5yZW1vdmUodGhpcy5fbW9kZWxzKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcGFyc2UoZGF0YSkge1xyXG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5kYXRhIHx8IHRoaXMuc3RvcmFnZUNvbnRhaW5lclxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb2xsZWN0aW9uXHJcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xuXG5jbGFzcyBWaWV3IGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAnYXR0cmlidXRlcycsXG4gICAgJ2VsZW1lbnROYW1lJyxcbiAgICAnZWxlbWVudCcsXG4gICAgJ2luc2VydCcsXG4gICAgJ3RlbXBsYXRlJyxcbiAgICAndWlFbGVtZW50cycsXG4gICAgJ3VpRWxlbWVudEV2ZW50cycsXG4gICAgJ3VpRWxlbWVudENhbGxiYWNrcycsXG4gICAgJ3JlbmRlcidcbiAgXSB9XG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICB9KVxuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgZWxlbWVudE5hbWUoKSB7IHJldHVybiB0aGlzLl9lbGVtZW50TmFtZSB9XG4gIHNldCBlbGVtZW50TmFtZShlbGVtZW50TmFtZSkgeyB0aGlzLl9lbGVtZW50TmFtZSA9IGVsZW1lbnROYW1lIH1cbiAgZ2V0IGVsZW1lbnQoKSB7XG4gICAgaWYoIXRoaXMuX2VsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMuZWxlbWVudE5hbWUpXG4gICAgICBPYmplY3QuZW50cmllcyh0aGlzLmF0dHJpYnV0ZXMpLmZvckVhY2goKFthdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlXSkgPT4ge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKVxuICAgICAgfSlcbiAgICAgIHRoaXMuZWxlbWVudE9ic2VydmVyLm9ic2VydmUodGhpcy5lbGVtZW50LCB7XG4gICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50XG4gIH1cbiAgZ2V0IGVsZW1lbnRPYnNlcnZlcigpIHtcbiAgICB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgPSB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgfHwgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoXG4gICAgICB0aGlzLmVsZW1lbnRPYnNlcnZlLmJpbmQodGhpcylcbiAgICApXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRPYnNlcnZlclxuICB9XG4gIHNldCBlbGVtZW50KGVsZW1lbnQpIHtcbiAgICBpZihlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50XG4gIH1cbiAgZ2V0IGF0dHJpYnV0ZXMoKSB7IHJldHVybiB0aGlzLl9hdHRyaWJ1dGVzIHx8IHt9IH1cbiAgc2V0IGF0dHJpYnV0ZXMoYXR0cmlidXRlcykgeyB0aGlzLl9hdHRyaWJ1dGVzID0gYXR0cmlidXRlcyB9XG4gIGdldCB0ZW1wbGF0ZSgpIHsgcmV0dXJuIHRoaXMuX3RlbXBsYXRlIH1cbiAgc2V0IHRlbXBsYXRlKHRlbXBsYXRlKSB7IHRoaXMuX3RlbXBsYXRlID0gdGVtcGxhdGUgfVxuICBnZXQgdWlFbGVtZW50cygpIHsgcmV0dXJuIHRoaXMuX3VpRWxlbWVudHMgfHwge30gfVxuICBzZXQgdWlFbGVtZW50cyh1aUVsZW1lbnRzKSB7XG4gICAgdGhpcy5fdWlFbGVtZW50cyA9IHVpRWxlbWVudHNcbiAgICAvLyB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gIH1cbiAgZ2V0IHVpRWxlbWVudEV2ZW50cygpIHsgcmV0dXJuIHRoaXMuX3VpRWxlbWVudEV2ZW50cyB8fCB7fSB9XG4gIHNldCB1aUVsZW1lbnRFdmVudHModWlFbGVtZW50RXZlbnRzKSB7XG4gICAgdGhpcy5fdWlFbGVtZW50RXZlbnRzID0gdWlFbGVtZW50RXZlbnRzXG4gICAgLy8gdGhpcy50b2dnbGVFdmVudHMoKVxuICB9XG4gIGdldCB1aUVsZW1lbnRDYWxsYmFja3MoKSB7IHJldHVybiB0aGlzLl91aUVsZW1lbnRDYWxsYmFja3MgfHwge30gfVxuICBzZXQgdWlFbGVtZW50Q2FsbGJhY2tzKHVpRWxlbWVudENhbGxiYWNrcykge1xuICAgIHRoaXMuX3VpRWxlbWVudENhbGxiYWNrcyA9IHVpRWxlbWVudENhbGxiYWNrc1xuICAgIE9iamVjdC52YWx1ZXModGhpcy5fdWlFbGVtZW50Q2FsbGJhY2tzKVxuICAgICAgLmZvckVhY2goKHVpRWxlbWVudENhbGxiYWNrKSA9PiB1aUVsZW1lbnRDYWxsYmFjay5iaW5kKHRoaXMpKVxuICAgIC8vIHRoaXMudG9nZ2xlRXZlbnRzKClcbiAgfVxuICBnZXQgdWkoKSB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXNcbiAgICBpZighdGhpcy5fdWkpIHtcbiAgICAgIHRoaXMuX3VpID0gT2JqZWN0LmVudHJpZXModGhpcy51aUVsZW1lbnRzKS5yZWR1Y2UoKF91aSxbdWlFbGVtZW50TmFtZSwgdWlFbGVtZW50UXVlcnldKSA9PiB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKF91aSwge1xuICAgICAgICAgIFt1aUVsZW1lbnROYW1lXToge1xuICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICBpZih0eXBlb2YgdWlFbGVtZW50UXVlcnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5UmVzdWx0cyA9IGNvbnRleHQuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHVpRWxlbWVudFF1ZXJ5KVxuICAgICAgICAgICAgICAgIHJldHVybiAocXVlcnlSZXN1bHRzLmxlbmd0aCA+IDEpID8gcXVlcnlSZXN1bHRzIDogcXVlcnlSZXN1bHRzLml0ZW0oMClcbiAgICAgICAgICAgICAgfSBlbHNlIGlmKFxuICAgICAgICAgICAgICAgIHVpRWxlbWVudFF1ZXJ5IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcbiAgICAgICAgICAgICAgICB1aUVsZW1lbnRRdWVyeSBpbnN0YW5jZW9mIERvY3VtZW50IHx8XG4gICAgICAgICAgICAgICAgdWlFbGVtZW50UXVlcnkgaW5zdGFuY2VvZiBXaW5kb3dcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVpRWxlbWVudFF1ZXJ5XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gX3VpXG4gICAgICB9LCB7fSlcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMuX3VpLCB7XG4gICAgICAgICckZWxlbWVudCc6IHtcbiAgICAgICAgICBnZXQoKSB7IHJldHVybiBjb250ZXh0LmVsZW1lbnQgfVxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3VpXG4gIH1cbiAgcmVzZXRVSSgpIHtcbiAgICBkZWxldGUgdGhpcy5fdWlcbiAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBlbGVtZW50T2JzZXJ2ZShtdXRhdGlvblJlY29yZExpc3QsIG9ic2VydmVyKSB7XG4gICAgZm9yKGxldCBbbXV0YXRpb25SZWNvcmRJbmRleCwgbXV0YXRpb25SZWNvcmRdIG9mIE9iamVjdC5lbnRyaWVzKG11dGF0aW9uUmVjb3JkTGlzdCkpIHtcbiAgICAgIHN3aXRjaChtdXRhdGlvblJlY29yZC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2NoaWxkTGlzdCc6XG4gICAgICAgICAgaWYobXV0YXRpb25SZWNvcmQuYWRkZWROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHRoaXMudWkpKVxuICAgICAgICAgICAgLy8gLmZvckVhY2goKFt1aUtleSwgdWlWYWx1ZV0pID0+IHtcbiAgICAgICAgICAgIC8vICAgY29uc3QgdWlWYWx1ZUdldCA9IHVpVmFsdWUuZ2V0KClcbiAgICAgICAgICAgIC8vICAgY29uc3QgYWRkZWRVSUVsZW1lbnQgPSBBcnJheS5mcm9tKG11dGF0aW9uUmVjb3JkLmFkZGVkTm9kZXMpLmZpbmQoKGFkZGVkTm9kZSkgPT4ge1xuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdhZGRlZE5vZGUnLCBhZGRlZE5vZGUpXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ3VpVmFsdWVHZXQnLCB1aVZhbHVlR2V0KVxuICAgICAgICAgICAgLy8gICAgIHJldHVybiBhZGRlZE5vZGUgPT09IHVpVmFsdWVHZXRcbiAgICAgICAgICAgIC8vICAgfSlcbiAgICAgICAgICAgIC8vICAgaWYoYWRkZWRVSUVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vICAgICB0aGlzLnRvZ2dsZUV2ZW50cyh1aUtleSlcbiAgICAgICAgICAgIC8vICAgfVxuICAgICAgICAgICAgLy8gfSlcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKClcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYmluZEV2ZW50VG9FbGVtZW50KGVsZW1lbnQsIG1ldGhvZCwgZXZlbnROYW1lLCBldmVudENhbGxiYWNrTmFtZSkge1xuICAgIHRyeSB7XG4gICAgICBzd2l0Y2gobWV0aG9kKSB7XG4gICAgICAgIGNhc2UgJ2FkZEV2ZW50TGlzdGVuZXInOlxuICAgICAgICAgIHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXS8vIC5iaW5kKHRoaXMpXG4gICAgICAgICAgZWxlbWVudFttZXRob2RdKGV2ZW50TmFtZSwgdGhpcy51aUVsZW1lbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3JlbW92ZUV2ZW50TGlzdGVuZXInOlxuICAgICAgICAgIGVsZW1lbnRbbWV0aG9kXShldmVudE5hbWUsIHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSlcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH0gY2F0Y2goZXJyb3IpIHt9XG4gIH1cbiAgdG9nZ2xlRXZlbnRzKHRhcmdldFVJRWxlbWVudE5hbWUgPSBudWxsKSB7XG4gICAgdGhpcy5pc1RvZ2dsaW5nID0gdHJ1ZVxuICAgIGNvbnN0IHVpID0gdGhpcy51aVxuICAgIGNvbnN0IGV2ZW50QmluZE1ldGhvZHMgPSBbJ3JlbW92ZUV2ZW50TGlzdGVuZXInLCAnYWRkRXZlbnRMaXN0ZW5lciddXG4gICAgaWYoIXRhcmdldFVJRWxlbWVudE5hbWUpIHtcbiAgICAgIGV2ZW50QmluZE1ldGhvZHMuZm9yRWFjaCgoZXZlbnRCaW5kTWV0aG9kKSA9PiB7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMudWlFbGVtZW50RXZlbnRzKS5mb3JFYWNoKChbdWlFbGVtZW50RXZlbnRTZXR0aW5ncywgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWVdKSA9PiB7XG4gICAgICAgICAgbGV0IFt1aUVsZW1lbnROYW1lLCB1aUVsZW1lbnRFdmVudE5hbWVdID0gdWlFbGVtZW50RXZlbnRTZXR0aW5ncy5zcGxpdCgnICcpXG4gICAgICAgICAgaWYodWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xuICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0uZm9yRWFjaCgodWlFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50VG9FbGVtZW50KHVpRWxlbWVudCwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2UgaWYodWlbdWlFbGVtZW50TmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50VG9FbGVtZW50KHVpW3VpRWxlbWVudE5hbWVdLCBldmVudEJpbmRNZXRob2QsIHVpRWxlbWVudEV2ZW50TmFtZSwgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnRCaW5kTWV0aG9kcy5mb3JFYWNoKChldmVudEJpbmRNZXRob2QpID0+IHtcbiAgICAgICAgY29uc3QgdWlFbGVtZW50RXZlbnRzID0gT2JqZWN0LmVudHJpZXModGhpcy51aUVsZW1lbnRFdmVudHMpLmZvckVhY2goKFt1aUVsZW1lbnRFdmVudFNldHRpbmdzLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZV0pID0+IHtcbiAgICAgICAgICBsZXQgW3VpRWxlbWVudE5hbWUsIHVpRWxlbWVudEV2ZW50TmFtZV0gPSB1aUVsZW1lbnRFdmVudFNldHRpbmdzLnNwbGl0KCcgJylcbiAgICAgICAgICBpZih0YXJnZXRVSUVsZW1lbnROYW1lID09PSB1aUVsZW1lbnROYW1lKSB7XG4gICAgICAgICAgICBpZih1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XG4gICAgICAgICAgICAgIHVpW3VpRWxlbWVudE5hbWVdLmZvckVhY2goKHVpRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50VG9FbGVtZW50KHVpRWxlbWVudCwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIGlmKHVpW3VpRWxlbWVudE5hbWVdIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlbdWlFbGVtZW50TmFtZV0sIGV2ZW50QmluZE1ldGhvZCwgdWlFbGVtZW50RXZlbnROYW1lLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLmlzVG9nZ2xpbmcgPSBmYWxzZVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgYXV0b0luc2VydCgpIHtcbiAgICBpZih0aGlzLmluc2VydCkge1xuICAgICAgY29uc3QgcGFyZW50ID0gKHR5cGVvZiB0aGlzLmluc2VydC5wYXJlbnQgPT09ICdzdHJpbmcnKVxuICAgICAgICA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5pbnNlcnQucGFyZW50KVxuICAgICAgICA6ICh0aGlzLmluc2VydC5wYXJlbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgICA/IHRoaXMuaW5zZXJ0LnBhcmVudFxuICAgICAgICAgIDogbnVsbFxuICAgICAgY29uc3QgbWV0aG9kID0gdGhpcy5pbnNlcnQubWV0aG9kXG4gICAgICBwYXJlbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KG1ldGhvZCwgdGhpcy5lbGVtZW50KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGF1dG9SZW1vdmUoKSB7XG4gICAgaWYodGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICByZW5kZXIoZGF0YSA9IHt9KSB7XG4gICAgaWYodGhpcy50ZW1wbGF0ZSkge1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlKGRhdGEpXG4gICAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGVcbiAgICB9XG4gICAgdGhpcy50b2dnbGVFdmVudHMoKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFZpZXdcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4J1xuXG5jb25zdCBDb250cm9sbGVyID0gY2xhc3MgZXh0ZW5kcyBFdmVudHMge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICB9XG4gIGdldCB2YWxpZFNldHRpbmdzKCkgeyByZXR1cm4gW1xuICAgICdtb2RlbHMnLFxuICAgICdtb2RlbEV2ZW50cycsXG4gICAgJ21vZGVsQ2FsbGJhY2tzJyxcbiAgICAnY29sbGVjdGlvbnMnLFxuICAgICdjb2xsZWN0aW9uRXZlbnRzJyxcbiAgICAnY29sbGVjdGlvbkNhbGxiYWNrcycsXG4gICAgJ3ZpZXdzJyxcbiAgICAndmlld0V2ZW50cycsXG4gICAgJ3ZpZXdDYWxsYmFja3MnLFxuICAgICdjb250cm9sbGVycycsXG4gICAgJ2NvbnRyb2xsZXJFdmVudHMnLFxuICAgICdjb250cm9sbGVyQ2FsbGJhY2tzJyxcbiAgICAncm91dGVycycsXG4gICAgJ3JvdXRlckV2ZW50cycsXG4gICAgJ3JvdXRlckNhbGxiYWNrcycsXG4gIF0gfVxuICBnZXQgYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlcygpIHsgcmV0dXJuIFtcbiAgICAnbW9kZWwnLFxuICAgICd2aWV3JyxcbiAgICAnY29sbGVjdGlvbicsXG4gICAgJ2NvbnRyb2xsZXInLFxuICAgICdyb3V0ZXInLFxuICBdIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCBzZXR0aW5ncygpIHtcbiAgICBpZighdGhpcy5fc2V0dGluZ3MpIHRoaXMuX3NldHRpbmdzID0ge31cbiAgICByZXR1cm4gdGhpcy5fc2V0dGluZ3NcbiAgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzXG4gICAgICAuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XG4gICAgICAgIGlmKHRoaXMuc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgWydfJy5jb25jYXQodmFsaWRTZXR0aW5nKV06IHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWJlcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBbdmFsaWRTZXR0aW5nXToge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNbJ18nLmNvbmNhdCh2YWxpZFNldHRpbmcpXSB9LFxuICAgICAgICAgICAgICAgIHNldCh2YWx1ZSkgeyB0aGlzWydfJy5jb25jYXQodmFsaWRTZXR0aW5nKV0gPSB2YWx1ZSB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIClcbiAgICAgICAgICB0aGlzW3ZhbGlkU2V0dGluZ10gPSB0aGlzLnNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB0aGlzLmJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXNcbiAgICAgIC5mb3JFYWNoKChiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUpID0+IHtcbiAgICAgICAgdGhpcy5yZXNldEV2ZW50cyhiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUpXG4gICAgICB9KVxuICB9XG4gIHJlc2V0RXZlbnRzKGNsYXNzVHlwZSkge1xuICAgIFtcbiAgICAgICdvZmYnLFxuICAgICAgJ29uJ1xuICAgIF0uZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZClcbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKSB7XG4gICAgY29uc3QgYmFzZU5hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdzJylcbiAgICBjb25zdCBiYXNlRXZlbnRzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrc05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKVxuICAgIGNvbnN0IGJhc2UgPSB0aGlzW2Jhc2VOYW1lXSB8fCB7fVxuICAgIGNvbnN0IGJhc2VFdmVudHMgPSB0aGlzW2Jhc2VFdmVudHNOYW1lXSB8fCB7fVxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3MgPSB0aGlzW2Jhc2VDYWxsYmFja3NOYW1lXSB8fCB7fVxuICAgIGlmKFxuICAgICAgT2JqZWN0LnZhbHVlcyhiYXNlKS5sZW5ndGggJiZcbiAgICAgIE9iamVjdC52YWx1ZXMoYmFzZUV2ZW50cykubGVuZ3RoICYmXG4gICAgICBPYmplY3QudmFsdWVzKGJhc2VDYWxsYmFja3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgT2JqZWN0LmVudHJpZXMoYmFzZUV2ZW50cylcbiAgICAgICAgLmZvckVhY2goKFtiYXNlRXZlbnREYXRhLCBiYXNlQ2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IFtiYXNlVGFyZ2V0TmFtZSwgYmFzZUV2ZW50TmFtZV0gPSBiYXNlRXZlbnREYXRhLnNwbGl0KCcgJylcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0ZpcnN0ID0gYmFzZVRhcmdldE5hbWUuc3Vic3RyaW5nKDAsIDEpXG4gICAgICAgICAgY29uc3QgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0ID0gYmFzZVRhcmdldE5hbWUuc3Vic3RyaW5nKGJhc2VUYXJnZXROYW1lLmxlbmd0aCAtIDEpXG4gICAgICAgICAgbGV0IGJhc2VUYXJnZXRzID0gW11cbiAgICAgICAgICBpZihcbiAgICAgICAgICAgIGJhc2VUYXJnZXROYW1lU3Vic3RyaW5nRmlyc3QgPT09ICdbJyAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0ID09PSAnXSdcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzID0gT2JqZWN0LmVudHJpZXMoYmFzZSlcbiAgICAgICAgICAgICAgLnJlZHVjZSgoX2Jhc2VUYXJnZXRzLCBbYmFzZU5hbWUsIGJhc2VUYXJnZXRdKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGJhc2VUYXJnZXROYW1lUmVnRXhwU3RyaW5nID0gYmFzZVRhcmdldE5hbWUuc2xpY2UoMSwgLTEpXG4gICAgICAgICAgICAgICAgbGV0IGJhc2VUYXJnZXROYW1lUmVnRXhwID0gbmV3IFJlZ0V4cChiYXNlVGFyZ2V0TmFtZVJlZ0V4cFN0cmluZylcbiAgICAgICAgICAgICAgICBpZihiYXNlTmFtZS5tYXRjaChiYXNlVGFyZ2V0TmFtZVJlZ0V4cCkpIHtcbiAgICAgICAgICAgICAgICAgIF9iYXNlVGFyZ2V0cy5wdXNoKGJhc2VUYXJnZXQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBfYmFzZVRhcmdldHNcbiAgICAgICAgICAgICAgfSwgW10pXG4gICAgICAgICAgfSBlbHNlIGlmKGJhc2VbYmFzZVRhcmdldE5hbWVdKSB7XG4gICAgICAgICAgICBiYXNlVGFyZ2V0cy5wdXNoKGJhc2VbYmFzZVRhcmdldE5hbWVdKVxuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgYmFzZUV2ZW50Q2FsbGJhY2sgPSBiYXNlQ2FsbGJhY2tzW2Jhc2VDYWxsYmFja05hbWVdXG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFjayAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2submFtZS5zcGxpdCgnICcpLmxlbmd0aCA9PT0gMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2sgPSBiYXNlRXZlbnRDYWxsYmFjay5iaW5kKHRoaXMpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWUgJiZcbiAgICAgICAgICAgIGJhc2VFdmVudE5hbWUgJiZcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzLmxlbmd0aCAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2tcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzXG4gICAgICAgICAgICAgIC5mb3JFYWNoKChiYXNlVGFyZ2V0KSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIHN3aXRjaChtZXRob2QpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnb24nOlxuICAgICAgICAgICAgICAgICAgICAgIGJhc2VUYXJnZXRbbWV0aG9kXShiYXNlRXZlbnROYW1lLCBiYXNlRXZlbnRDYWxsYmFjaylcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdvZmYnOlxuICAgICAgICAgICAgICAgICAgICAgIGJhc2VUYXJnZXRbbWV0aG9kXShiYXNlRXZlbnROYW1lLCBiYXNlRXZlbnRDYWxsYmFjaylcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgQ29udHJvbGxlclxuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXgnXG5cbmNvbnN0IFJvdXRlciA9IGNsYXNzIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLmFkZFdpbmRvd0V2ZW50cygpXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ3Jvb3QnLFxuICAgICdoYXNoUm91dGluZycsXG4gICAgJ2NvbnRyb2xsZXInLFxuICAgICdyb3V0ZXMnXG4gIF0gfVxuICBnZXQgc2V0dGluZ3MoKSB7IHJldHVybiB0aGlzLl9zZXR0aW5ncyB9XG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3MuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XG4gICAgICBpZihzZXR0aW5nc1t2YWxpZFNldHRpbmddKSB0aGlzW3ZhbGlkU2V0dGluZ10gPSBzZXR0aW5nc1t2YWxpZFNldHRpbmddXG4gICAgfSlcbiAgfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cbiAgZ2V0IHByb3RvY29sKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnByb3RvY29sIH1cbiAgZ2V0IGhvc3RuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lIH1cbiAgZ2V0IHBvcnQoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucG9ydCB9XG4gIGdldCBwYXRobmFtZSgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSB9XG4gIGdldCBwYXRoKCkge1xuICAgIGxldCBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWVcbiAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoWydeJywgdGhpcy5yb290XS5qb2luKCcnKSksICcnKVxuICAgICAgLnNwbGl0KCc/JylcbiAgICAgIC5zbGljZSgwLCAxKVxuICAgICAgWzBdXG4gICAgbGV0IGZyYWdtZW50cyA9IChcbiAgICAgIHN0cmluZy5sZW5ndGggPT09IDBcbiAgICApID8gW11cbiAgICAgIDogKFxuICAgICAgICAgIHN0cmluZy5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL15cXC8vKSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXFwvPy8pXG4gICAgICAgICkgPyBbJy8nXVxuICAgICAgICAgIDogc3RyaW5nXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC8kLywgJycpXG4gICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgcmV0dXJuIHtcbiAgICAgIGZyYWdtZW50czogZnJhZ21lbnRzLFxuICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgfVxuICB9XG4gIGdldCBoYXNoKCkge1xuICAgIGxldCBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uaGFzaFxuICAgICAgLnNsaWNlKDEpXG4gICAgICAuc3BsaXQoJz8nKVxuICAgICAgLnNsaWNlKDAsIDEpXG4gICAgICBbMF1cbiAgICBsZXQgZnJhZ21lbnRzID0gKFxuICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMFxuICAgICkgPyBbXVxuICAgICAgOiAoXG4gICAgICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXlxcLy8pICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9cXC8/LylcbiAgICAgICAgKSA/IFsnLyddXG4gICAgICAgICAgOiBzdHJpbmdcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICByZXR1cm4ge1xuICAgICAgZnJhZ21lbnRzOiBmcmFnbWVudHMsXG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICB9XG4gIH1cbiAgZ2V0IHBhcmFtZXRlcnMoKSB7XG4gICAgbGV0IHN0cmluZ1xuICAgIGxldCBkYXRhXG4gICAgaWYod2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goL1xcPy8pKSB7XG4gICAgICBsZXQgcGFyYW1ldGVycyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgICAgIC5zcGxpdCgnPycpXG4gICAgICAgIC5zbGljZSgtMSlcbiAgICAgICAgLmpvaW4oJycpXG4gICAgICBzdHJpbmcgPSBwYXJhbWV0ZXJzXG4gICAgICBkYXRhID0gcGFyYW1ldGVyc1xuICAgICAgICAuc3BsaXQoJyYnKVxuICAgICAgICAucmVkdWNlKChcbiAgICAgICAgICBfcGFyYW1ldGVycyxcbiAgICAgICAgICBwYXJhbWV0ZXJcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgbGV0IHBhcmFtZXRlckRhdGEgPSBwYXJhbWV0ZXIuc3BsaXQoJz0nKVxuICAgICAgICAgIF9wYXJhbWV0ZXJzW3BhcmFtZXRlckRhdGFbMF1dID0gcGFyYW1ldGVyRGF0YVsxXVxuICAgICAgICAgIHJldHVybiBfcGFyYW1ldGVyc1xuICAgICAgICB9LCB7fSlcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyaW5nID0gJydcbiAgICAgIGRhdGEgPSB7fVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfVxuICB9XG4gIGdldCByb290KCkgeyByZXR1cm4gdGhpcy5fcm9vdCB8fCAnLycgfVxuICBzZXQgcm9vdChyb290KSB7IHRoaXMuX3Jvb3QgPSByb290IH1cbiAgZ2V0IGhhc2hSb3V0aW5nKCkgeyByZXR1cm4gdGhpcy5faGFzaFJvdXRpbmcgfHwgZmFsc2UgfVxuICBzZXQgaGFzaFJvdXRpbmcoaGFzaFJvdXRpbmcpIHsgdGhpcy5faGFzaFJvdXRpbmcgPSBoYXNoUm91dGluZyB9XG4gIGdldCByb3V0ZXMoKSB7IHJldHVybiB0aGlzLl9yb3V0ZXMgfVxuICBzZXQgcm91dGVzKHJvdXRlcykgeyB0aGlzLl9yb3V0ZXMgPSByb3V0ZXMgfVxuICBnZXQgY29udHJvbGxlcigpIHsgcmV0dXJuIHRoaXMuX2NvbnRyb2xsZXIgfVxuICBzZXQgY29udHJvbGxlcihjb250cm9sbGVyKSB7IHRoaXMuX2NvbnRyb2xsZXIgPSBjb250cm9sbGVyIH1cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICByb290OiB0aGlzLnJvb3QsXG4gICAgICBwYXRoOiB0aGlzLnBhdGgsXG4gICAgICBoYXNoOiB0aGlzLmhhc2gsXG4gICAgICBwYXJhbWV0ZXJzOiB0aGlzLnBhcmFtZXRlcnMsXG4gICAgfVxuICB9XG4gIG1hdGNoUm91dGUocm91dGVGcmFnbWVudHMsIGxvY2F0aW9uRnJhZ21lbnRzKSB7XG4gICAgbGV0IHJvdXRlTWF0Y2hlcyA9IG5ldyBBcnJheSgpXG4gICAgaWYocm91dGVGcmFnbWVudHMubGVuZ3RoID09PSBsb2NhdGlvbkZyYWdtZW50cy5sZW5ndGgpIHtcbiAgICAgIHJvdXRlTWF0Y2hlcyA9IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgIC5yZWR1Y2UoKF9yb3V0ZU1hdGNoZXMsIHJvdXRlRnJhZ21lbnQsIHJvdXRlRnJhZ21lbnRJbmRleCkgPT4ge1xuICAgICAgICAgIGxldCBsb2NhdGlvbkZyYWdtZW50ID0gbG9jYXRpb25GcmFnbWVudHNbcm91dGVGcmFnbWVudEluZGV4XVxuICAgICAgICAgIGlmKHJvdXRlRnJhZ21lbnQubWF0Y2goL15cXDovKSkge1xuICAgICAgICAgICAgX3JvdXRlTWF0Y2hlcy5wdXNoKHRydWUpXG4gICAgICAgICAgfSBlbHNlIGlmKHJvdXRlRnJhZ21lbnQgPT09IGxvY2F0aW9uRnJhZ21lbnQpIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaCh0cnVlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2goZmFsc2UpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcm91dGVNYXRjaGVzXG4gICAgICAgIH0sIFtdKVxuICAgIH0gZWxzZSB7XG4gICAgICByb3V0ZU1hdGNoZXMucHVzaChmYWxzZSlcbiAgICB9XG4gICAgcmV0dXJuIChyb3V0ZU1hdGNoZXMuaW5kZXhPZihmYWxzZSkgPT09IC0xKVxuICAgICAgPyB0cnVlXG4gICAgICA6IGZhbHNlXG4gIH1cbiAgZ2V0Um91dGUobG9jYXRpb24pIHtcbiAgICBsZXQgcm91dGVzID0gT2JqZWN0LmVudHJpZXModGhpcy5yb3V0ZXMpXG4gICAgICAucmVkdWNlKChcbiAgICAgICAgX3JvdXRlcyxcbiAgICAgICAgW3JvdXRlTmFtZSwgcm91dGVTZXR0aW5nc10pID0+IHtcbiAgICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSAoXG4gICAgICAgICAgICByb3V0ZU5hbWUubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgICByb3V0ZU5hbWUubWF0Y2goL15cXC8vKVxuICAgICAgICAgICkgPyBbcm91dGVOYW1lXVxuICAgICAgICAgICAgOiAocm91dGVOYW1lLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgPyBbJyddXG4gICAgICAgICAgICAgIDogcm91dGVOYW1lXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgICAgICAgcm91dGVTZXR0aW5ncy5mcmFnbWVudHMgPSByb3V0ZUZyYWdtZW50c1xuICAgICAgICAgIF9yb3V0ZXNbcm91dGVGcmFnbWVudHMuam9pbignLycpXSA9IHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICByZXR1cm4gX3JvdXRlc1xuICAgICAgICB9LFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHJvdXRlcylcbiAgICAgIC5maW5kKChyb3V0ZSkgPT4ge1xuICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSByb3V0ZS5mcmFnbWVudHNcbiAgICAgICAgbGV0IGxvY2F0aW9uRnJhZ21lbnRzID0gKHRoaXMuaGFzaFJvdXRpbmcpXG4gICAgICAgICAgPyBsb2NhdGlvbi5oYXNoLmZyYWdtZW50c1xuICAgICAgICAgIDogbG9jYXRpb24ucGF0aC5mcmFnbWVudHNcbiAgICAgICAgbGV0IG1hdGNoUm91dGUgPSB0aGlzLm1hdGNoUm91dGUoXG4gICAgICAgICAgcm91dGVGcmFnbWVudHMsXG4gICAgICAgICAgbG9jYXRpb25GcmFnbWVudHMsXG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuIG1hdGNoUm91dGUgPT09IHRydWVcbiAgICAgIH0pXG4gIH1cbiAgcG9wU3RhdGUoZXZlbnQpIHtcbiAgICBsZXQgbG9jYXRpb24gPSB0aGlzLmxvY2F0aW9uXG4gICAgbGV0IHJvdXRlID0gdGhpcy5nZXRSb3V0ZShsb2NhdGlvbilcbiAgICBsZXQgcm91dGVEYXRhID0ge1xuICAgICAgcm91dGU6IHJvdXRlLFxuICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgIH1cbiAgICBpZihyb3V0ZSkge1xuICAgICAgdGhpcy5jb250cm9sbGVyW3JvdXRlLmNhbGxiYWNrXShyb3V0ZURhdGEpXG4gICAgICB0aGlzLmVtaXQoXG4gICAgICAgICdjaGFuZ2UnLCBcbiAgICAgICAgcm91dGVEYXRhLFxuICAgICAgICB0aGlzXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgJ2Vycm9yJyxcbiAgICAgICAgcm91dGVEYXRhLFxuICAgICAgICB0aGlzXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgYWRkV2luZG93RXZlbnRzKCkge1xuICAgIHdpbmRvdy5vbigncG9wc3RhdGUnLCB0aGlzLnBvcFN0YXRlLmJpbmQodGhpcykpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICByZW1vdmVXaW5kb3dFdmVudHMoKSB7XG4gICAgd2luZG93Lm9mZigncG9wc3RhdGUnLCB0aGlzLnBvcFN0YXRlLmJpbmQodGhpcykpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBuYXZpZ2F0ZShwYXRoKSB7XG4gICAgaWYodGhpcy5oYXNoUm91dGluZykge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBwYXRoXG4gICAgfSBlbHNlIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aFxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBSb3V0ZXJcbiJdLCJuYW1lcyI6WyJFdmVudFRhcmdldCIsInByb3RvdHlwZSIsIm9uIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9mZiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJFdmVudHMiLCJjb25zdHJ1Y3RvciIsIl9ldmVudHMiLCJldmVudHMiLCJnZXRFdmVudENhbGxiYWNrcyIsImV2ZW50TmFtZSIsImdldEV2ZW50Q2FsbGJhY2tOYW1lIiwiZXZlbnRDYWxsYmFjayIsIm5hbWUiLCJsZW5ndGgiLCJnZXRFdmVudENhbGxiYWNrR3JvdXAiLCJldmVudENhbGxiYWNrcyIsImV2ZW50Q2FsbGJhY2tOYW1lIiwiZXZlbnRDYWxsYmFja0dyb3VwIiwicHVzaCIsImFyZ3VtZW50cyIsIk9iamVjdCIsImtleXMiLCJlbWl0IiwiX2FyZ3VtZW50cyIsIkFycmF5IiwiZnJvbSIsInNwbGljZSIsImV2ZW50RGF0YSIsImV2ZW50QXJndW1lbnRzIiwiZW50cmllcyIsImZvckVhY2giLCJldmVudENhbGxiYWNrR3JvdXBOYW1lIiwiZGF0YSIsIl9yZXNwb25zZXMiLCJyZXNwb25zZXMiLCJyZXNwb25zZSIsInJlc3BvbnNlTmFtZSIsInJlc3BvbnNlQ2FsbGJhY2siLCJyZXF1ZXN0Iiwic2xpY2UiLCJjYWxsIiwiX3Jlc3BvbnNlTmFtZSIsIl9jaGFubmVscyIsImNoYW5uZWxzIiwiY2hhbm5lbCIsImNoYW5uZWxOYW1lIiwiQ2hhbm5lbCIsIlVVSUQiLCJ1dWlkIiwiaSIsInJhbmRvbSIsIk1hdGgiLCJ0b1N0cmluZyIsIlNlcnZpY2UiLCJzZXR0aW5ncyIsIm9wdGlvbnMiLCJ2YWxpZFNldHRpbmdzIiwiX3NldHRpbmdzIiwidmFsaWRTZXR0aW5nIiwiX29wdGlvbnMiLCJ1cmwiLCJwYXJhbWV0ZXJzIiwiX3VybCIsImNvbmNhdCIsInF1ZXJ5U3RyaW5nIiwicGFyYW1ldGVyU3RyaW5nIiwicmVkdWNlIiwicGFyYW1ldGVyU3RyaW5ncyIsInBhcmFtZXRlcktleSIsInBhcmFtZXRlclZhbHVlIiwiam9pbiIsIm1ldGhvZCIsIl9tZXRob2QiLCJtb2RlIiwiX21vZGUiLCJjYWNoZSIsIl9jYWNoZSIsImNyZWRlbnRpYWxzIiwiX2NyZWRlbnRpYWxzIiwiaGVhZGVycyIsIl9oZWFkZXJzIiwicmVkaXJlY3QiLCJfcmVkaXJlY3QiLCJyZWZlcnJlclBvbGljeSIsIl9yZWZlcnJlclBvbGljeSIsImJvZHkiLCJfYm9keSIsImZpbGVzIiwiX2ZpbGVzIiwiX3BhcmFtZXRlcnMiLCJwcmV2aW91c0Fib3J0Q29udHJvbGxlciIsIl9wcmV2aW91c0Fib3J0Q29udHJvbGxlciIsImFib3J0Q29udHJvbGxlciIsIl9hYm9ydENvbnRyb2xsZXIiLCJBYm9ydENvbnRyb2xsZXIiLCJfcmVzcG9uc2UiLCJyZXNwb25zZURhdGEiLCJfcmVzcG9uc2VEYXRhIiwiYWJvcnQiLCJmZXRjaCIsImZldGNoT3B0aW9ucyIsIl9mZXRjaE9wdGlvbnMiLCJmZXRjaE9wdGlvbk5hbWUiLCJzaWduYWwiLCJ0aGVuIiwianNvbiIsImNhdGNoIiwiZXJyb3IiLCJtZXNzYWdlIiwiZmV0Y2hTeW5jIiwiY29kZSIsIk1vZGVsIiwiX3V1aWQiLCJiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzIiwiYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlIiwidG9nZ2xlRXZlbnRzIiwic2VydmljZXMiLCJfc2VydmljZXMiLCJfZGF0YSIsImRlZmF1bHRzIiwiX2RlZmF1bHRzIiwibG9jYWxTdG9yYWdlIiwic3luYyIsImRiIiwic2V0IiwiX2xvY2FsU3RvcmFnZSIsInN0b3JhZ2VDb250YWluZXIiLCJfZGIiLCJnZXRJdGVtIiwiZW5kcG9pbnQiLCJKU09OIiwic3RyaW5naWZ5IiwicGFyc2UiLCJzZXRJdGVtIiwicmVzZXRFdmVudHMiLCJjbGFzc1R5cGUiLCJiYXNlTmFtZSIsImJhc2VFdmVudHNOYW1lIiwiYmFzZUNhbGxiYWNrc05hbWUiLCJiYXNlIiwiYmFzZUV2ZW50cyIsImJhc2VDYWxsYmFja3MiLCJ2YWx1ZXMiLCJiYXNlRXZlbnREYXRhIiwiYmFzZUNhbGxiYWNrTmFtZSIsImJhc2VUYXJnZXROYW1lIiwiYmFzZUV2ZW50TmFtZSIsInNwbGl0IiwiYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdGaXJzdCIsInN1YnN0cmluZyIsImJhc2VUYXJnZXROYW1lU3Vic3RyaW5nTGFzdCIsImJhc2VUYXJnZXRzIiwiX2Jhc2VUYXJnZXRzIiwiYmFzZVRhcmdldCIsImJhc2VUYXJnZXROYW1lUmVnRXhwU3RyaW5nIiwiYmFzZVRhcmdldE5hbWVSZWdFeHAiLCJSZWdFeHAiLCJtYXRjaCIsImJhc2VFdmVudENhbGxiYWNrIiwiYmluZCIsInNldERCIiwia2V5IiwidmFsdWUiLCJ1bnNldERCIiwic2V0RGF0YVByb3BlcnR5Iiwic2lsZW50IiwiY3VycmVudERhdGFQcm9wZXJ0eSIsImdldCIsImRlZmluZVByb3BlcnRpZXMiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImVudW1lcmFibGUiLCJldmVudCIsIm1vZGVsIiwidW5zZXREYXRhUHJvcGVydHkiLCJhc3NpZ24iLCJpc0FycmF5IiwidW5zZXQiLCJDb2xsZWN0aW9uIiwiZGVmYXVsdElEQXR0cmlidXRlIiwiYWRkIiwiVXRpbGl0aWVzIiwibW9kZWxzIiwiX21vZGVscyIsIm1vZGVsc0RhdGEiLCJfbW9kZWwiLCJtb2RlbHNFeGlzdCIsIm1hcCIsImJhc2VDYWxsYmFjayIsImdldE1vZGVsSW5kZXgiLCJtb2RlbFVVSUQiLCJtb2RlbEluZGV4IiwiZmluZCIsIl9tb2RlbEluZGV4IiwicmVtb3ZlTW9kZWxCeUluZGV4IiwiYWRkTW9kZWwiLCJtb2RlbERhdGEiLCJNb2RlbFByb3RvdHlwZSIsIm1vZGVsT3B0aW9ucyIsInJlbW92ZSIsImZpbHRlciIsInJlc2V0IiwiVmlldyIsImVsZW1lbnROYW1lIiwiX2VsZW1lbnROYW1lIiwiZWxlbWVudCIsIl9lbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZUtleSIsImF0dHJpYnV0ZVZhbHVlIiwic2V0QXR0cmlidXRlIiwiZWxlbWVudE9ic2VydmVyIiwib2JzZXJ2ZSIsInN1YnRyZWUiLCJjaGlsZExpc3QiLCJfZWxlbWVudE9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsImVsZW1lbnRPYnNlcnZlIiwiSFRNTEVsZW1lbnQiLCJfYXR0cmlidXRlcyIsInRlbXBsYXRlIiwiX3RlbXBsYXRlIiwidWlFbGVtZW50cyIsIl91aUVsZW1lbnRzIiwidWlFbGVtZW50RXZlbnRzIiwiX3VpRWxlbWVudEV2ZW50cyIsInVpRWxlbWVudENhbGxiYWNrcyIsIl91aUVsZW1lbnRDYWxsYmFja3MiLCJ1aUVsZW1lbnRDYWxsYmFjayIsInVpIiwiY29udGV4dCIsIl91aSIsInVpRWxlbWVudE5hbWUiLCJ1aUVsZW1lbnRRdWVyeSIsInF1ZXJ5UmVzdWx0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpdGVtIiwiRG9jdW1lbnQiLCJXaW5kb3ciLCJyZXNldFVJIiwibXV0YXRpb25SZWNvcmRMaXN0Iiwib2JzZXJ2ZXIiLCJtdXRhdGlvblJlY29yZEluZGV4IiwibXV0YXRpb25SZWNvcmQiLCJ0eXBlIiwiYWRkZWROb2RlcyIsImJpbmRFdmVudFRvRWxlbWVudCIsInRhcmdldFVJRWxlbWVudE5hbWUiLCJpc1RvZ2dsaW5nIiwiZXZlbnRCaW5kTWV0aG9kcyIsImV2ZW50QmluZE1ldGhvZCIsInVpRWxlbWVudEV2ZW50U2V0dGluZ3MiLCJ1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSIsInVpRWxlbWVudEV2ZW50TmFtZSIsIk5vZGVMaXN0IiwidWlFbGVtZW50IiwiYXV0b0luc2VydCIsImluc2VydCIsInBhcmVudCIsInF1ZXJ5U2VsZWN0b3IiLCJpbnNlcnRBZGphY2VudEVsZW1lbnQiLCJhdXRvUmVtb3ZlIiwicGFyZW50RWxlbWVudCIsInJlbW92ZUNoaWxkIiwicmVuZGVyIiwiaW5uZXJIVE1MIiwiQ29udHJvbGxlciIsImVudW1iZXJhYmxlIiwiUm91dGVyIiwiYWRkV2luZG93RXZlbnRzIiwicHJvdG9jb2wiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhvc3RuYW1lIiwicG9ydCIsInBhdGhuYW1lIiwicGF0aCIsInN0cmluZyIsInJlcGxhY2UiLCJyb290IiwiZnJhZ21lbnRzIiwiaGFzaCIsImhyZWYiLCJwYXJhbWV0ZXIiLCJwYXJhbWV0ZXJEYXRhIiwiX3Jvb3QiLCJoYXNoUm91dGluZyIsIl9oYXNoUm91dGluZyIsInJvdXRlcyIsIl9yb3V0ZXMiLCJjb250cm9sbGVyIiwiX2NvbnRyb2xsZXIiLCJtYXRjaFJvdXRlIiwicm91dGVGcmFnbWVudHMiLCJsb2NhdGlvbkZyYWdtZW50cyIsInJvdXRlTWF0Y2hlcyIsIl9yb3V0ZU1hdGNoZXMiLCJyb3V0ZUZyYWdtZW50Iiwicm91dGVGcmFnbWVudEluZGV4IiwibG9jYXRpb25GcmFnbWVudCIsImluZGV4T2YiLCJnZXRSb3V0ZSIsInJvdXRlTmFtZSIsInJvdXRlU2V0dGluZ3MiLCJyb3V0ZSIsInBvcFN0YXRlIiwicm91dGVEYXRhIiwiY2FsbGJhY2siLCJyZW1vdmVXaW5kb3dFdmVudHMiLCJuYXZpZ2F0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0VBQUFBLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIsR0FBMkJGLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIsSUFBNEJGLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkUsZ0JBQTdFO0VBQ0FILFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkcsR0FBdEIsR0FBNEJKLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkcsR0FBdEIsSUFBNkJKLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkksbUJBQS9FOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VDREEsTUFBTUMsTUFBTixDQUFhO0VBQ1hDLEVBQUFBLFdBQVcsR0FBRzs7RUFDZCxNQUFJQyxPQUFKLEdBQWM7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
