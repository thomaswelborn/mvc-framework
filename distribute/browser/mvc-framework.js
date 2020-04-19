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
      return fetch(this.url, fetchOptions).then(response => {
        return response.json();
      }).then(data => {
        this.emit('ready', {
          data: data
        });
        return data;
      }).catch(error => {
        var data = {
          type: 'error',
          message: error
        };
        this.emit('error', {
          data: data
        });
        return data;
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
          var baseCallback = bseCallbacks[baseCallbackName];

          if (baseTargetName && baseEventName && baseTarget && baseEventCallback) {
            try {
              classTypeTarget[method](classTypeEventName, classTypeEventCallback);
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
      if (!this.data[key]) {
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

      if (typeof silent === 'undefined' || silent === false || typeof silent === 'undefined') {
        this.emit('set'.concat(':', key), {
          key: key,
          value: value
        }, this);
      }

      return this;
    }

    unsetDataProperty(key, silent) {
      if (this.data[key]) {
        delete this.data[key];
      }

      if (typeof silent === 'boolean' && silent === false || typeof silent === 'undefined') {
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
      var key, value, silent;

      if (arguments.length === 3) {
        key = arguments[0];
        value = arguments[1];
        silent = arguments[2];
        this.setDataProperty(key, value, silent);
      } else if (arguments.length === 2) {
        if (typeof arguments[0] === 'string' && typeof arguments[1] === 'boolean') {
          silent = arguments[1];
          Object.entries(arguments[0]).forEach((_ref4) => {
            var [key, value] = _ref4;
            this.setDataProperty(key, value, silent);
          });
        } else {
          this.setDataProperty(arguments[0], arguments[1]);
        }

        if (this.localStorage) this.setDB(arguments[0], arguments[1]);
      } else if (arguments.length === 1 && !Array.isArray(arguments[0]) && typeof arguments[0] === 'object') {
        Object.entries(arguments[0]).forEach((_ref5) => {
          var [key, value] = _ref5;
          this.setDataProperty(key, value);
          if (this.localStorage) this.setDB(key, value);
        });
      }

      this.emit('set', this.data, this);
      return this;
    }

    unset() {
      var silent;

      if (arguments.length === 2) {
        silent = arguments[1];
        this.unsetDataProperty(arguments[0], silent);
      } else if (arguments.length === 1) {
        if (typeof arguments[0] === 'boolean') {
          silent = arguments[0];
          Object.keys(this.data).forEach(key => {
            this.unsetDataProperty(key, silent);
          });
        }
      } else {
        Object.keys(this.data).forEach(key => {
          this.unsetDataProperty(key);
        });
      }

      if (this.localStorage) this.unsetDB(key);
      this.emit('unset', this);
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
      return this._models.map(model => model.parse());
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
          var baseEventCallback = baseCallbacks[baseCallbackName];

          if (baseTargetName && baseEventName && baseTarget && baseEventCallback) {
            try {
              classTypeTarget[method](classTypeEventName, classTypeEventCallback);
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
      var _this = this;

      var _loop = function _loop(mutationRecordIndex, mutationRecord) {
        switch (mutationRecord.type) {
          case 'childList':
            if (mutationRecord.addedNodes.length) {
              Object.entries(Object.getOwnPropertyDescriptors(_this.ui)).forEach((_ref3) => {
                var [uiKey, uiValue] = _ref3;
                var uiValueGet = uiValue.get();
                var addedUIElement = Array.from(mutationRecord.addedNodes).find(addedNode => addedNode === uiValueGet);

                if (addedUIElement) {
                  _this.toggleEvents(uiKey);
                }
              });
            }

            break;
        }
      };

      for (var [mutationRecordIndex, mutationRecord] of Object.entries(mutationRecordList)) {
        _loop(mutationRecordIndex, mutationRecord);
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
          Object.entries(this.uiElementEvents).forEach((_ref4) => {
            var [uiElementEventSettings, uiElementEventCallbackName] = _ref4;
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
          var uiElementEvents = Object.entries(this.uiElementEvents).forEach((_ref5) => {
            var [uiElementEventSettings, uiElementEventCallbackName] = _ref5;
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
        var parent = this.insert.parent;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxpdGllcy91dWlkLmpzIiwiLi4vLi4vc291cmNlL01WQy9TZXJ2aWNlL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Nb2RlbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29sbGVjdGlvbi9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVmlldy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29udHJvbGxlci9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvUm91dGVyL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJFdmVudFRhcmdldC5wcm90b3R5cGUub24gPSBFdmVudFRhcmdldC5wcm90b3R5cGUub24gfHwgRXZlbnRUYXJnZXQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXJcclxuRXZlbnRUYXJnZXQucHJvdG90eXBlLm9mZiA9IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vZmYgfHwgRXZlbnRUYXJnZXQucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXJcclxuIiwiY2xhc3MgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9ldmVudHMoKSB7XHJcbiAgICB0aGlzLmV2ZW50cyA9IHRoaXMuZXZlbnRzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5ldmVudHNcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKSB7IHJldHVybiB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSB8fCB7fSB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIChldmVudENhbGxiYWNrLm5hbWUubGVuZ3RoKVxyXG4gICAgICA/IGV2ZW50Q2FsbGJhY2submFtZVxyXG4gICAgICA6ICdhbm9ueW1vdXNGdW5jdGlvbidcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSkge1xyXG4gICAgcmV0dXJuIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSB8fCBbXVxyXG4gIH1cclxuICBvbihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tOYW1lID0gdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tHcm91cCA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSlcclxuICAgIGV2ZW50Q2FsbGJhY2tHcm91cC5wdXNoKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gPSBldmVudENhbGxiYWNrR3JvdXBcclxuICAgIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdID0gZXZlbnRDYWxsYmFja3NcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIG9mZigpIHtcclxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIGNhc2UgMDpcclxuICAgICAgICBkZWxldGUgdGhpcy5ldmVudHNcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2sgPSBhcmd1bWVudHNbMV1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFja05hbWUgPSAodHlwZW9mIGV2ZW50Q2FsbGJhY2sgPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgPyBldmVudENhbGxiYWNrXHJcbiAgICAgICAgICA6IHRoaXMuZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgICAgICBpZih0aGlzLl9ldmVudHNbZXZlbnROYW1lXSkge1xyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdW2V2ZW50Q2FsbGJhY2tOYW1lXVxyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKS5sZW5ndGggPT09IDBcclxuICAgICAgICAgICkgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBlbWl0KCkge1xyXG4gICAgbGV0IF9hcmd1bWVudHMgPSBBcnJheS5mcm9tKGFyZ3VtZW50cylcclxuICAgIGxldCBldmVudE5hbWUgPSBfYXJndW1lbnRzLnNwbGljZSgwLCAxKVswXVxyXG4gICAgbGV0IGV2ZW50RGF0YSA9IF9hcmd1bWVudHMuc3BsaWNlKDAsIDEpWzBdXHJcbiAgICBsZXQgZXZlbnRBcmd1bWVudHMgPSBfYXJndW1lbnRzLnNwbGljZSgwKVxyXG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5nZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpKVxyXG4gICAgICAuZm9yRWFjaCgoW2V2ZW50Q2FsbGJhY2tHcm91cE5hbWUsIGV2ZW50Q2FsbGJhY2tHcm91cF0pID0+IHtcclxuICAgICAgICBldmVudENhbGxiYWNrR3JvdXBcclxuICAgICAgICAgIC5mb3JFYWNoKChldmVudENhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgIGV2ZW50Q2FsbGJhY2soXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogZXZlbnROYW1lLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZXZlbnREYXRhXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAuLi5ldmVudEFyZ3VtZW50c1xyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRzXHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9yZXNwb25zZXMoKSB7XHJcbiAgICB0aGlzLnJlc3BvbnNlcyA9IHRoaXMucmVzcG9uc2VzXHJcbiAgICAgID8gdGhpcy5yZXNwb25zZXNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMucmVzcG9uc2VzXHJcbiAgfVxyXG4gIHJlc3BvbnNlKHJlc3BvbnNlTmFtZSwgcmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgaWYgKHJlc3BvbnNlQ2FsbGJhY2spIHtcclxuICAgICAgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0gPSByZXNwb25zZUNhbGxiYWNrXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlXVxyXG4gICAgfVxyXG4gIH1cclxuICByZXF1ZXN0KHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYgKHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKSB7XHJcbiAgICAgIHZhciBfYXJndW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5zbGljZSgxKVxyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0oLi4uX2FyZ3VtZW50cylcclxuICAgIH1cclxuICB9XHJcbiAgb2ZmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYgKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAodmFyIFtfcmVzcG9uc2VOYW1lXSBvZiBPYmplY3Qua2V5cyh0aGlzLl9yZXNwb25zZXMpKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tfcmVzcG9uc2VOYW1lXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBDaGFubmVsIGZyb20gJy4vQ2hhbm5lbC9pbmRleCdcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2NoYW5uZWxzKCkge1xyXG4gICAgdGhpcy5jaGFubmVscyA9IHRoaXMuY2hhbm5lbHNcclxuICAgICAgPyB0aGlzLmNoYW5uZWxzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmNoYW5uZWxzXHJcbiAgfVxyXG4gIGNoYW5uZWwoY2hhbm5lbE5hbWUpIHtcclxuICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXSA9IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA/IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA6IG5ldyBDaGFubmVsKClcclxuICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbiAgb2ZmKGNoYW5uZWxOYW1lKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFVVSUQoKSB7XHJcbiAgdmFyIHV1aWQgPSBcIlwiLCBpLCByYW5kb21cclxuICBmb3IgKGkgPSAwOyBpIDwgMzI7IGkrKykge1xyXG4gICAgcmFuZG9tID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMFxyXG5cclxuICAgIGlmIChpID09IDggfHwgaSA9PSAxMiB8fCBpID09IDE2IHx8IGkgPT0gMjApIHtcclxuICAgICAgdXVpZCArPSBcIi1cIlxyXG4gICAgfVxyXG4gICAgdXVpZCArPSAoaSA9PSAxMiA/IDQgOiAoaSA9PSAxNiA/IChyYW5kb20gJiAzIHwgOCkgOiByYW5kb20pKS50b1N0cmluZygxNilcclxuICB9XHJcbiAgcmV0dXJuIHV1aWRcclxufVxyXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleCdcblxuY2xhc3MgU2VydmljZSBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ3VybCcsXG4gICAgJ21ldGhvZCcsXG4gICAgJ21vZGUnLFxuICAgICdjYWNoZScsXG4gICAgJ2NyZWRlbnRpYWxzJyxcbiAgICAnaGVhZGVycycsXG4gICAgJ3BhcmFtZXRlcnMnLFxuICAgICdyZWRpcmVjdCcsXG4gICAgJ3JlZmVycmVyLXBvbGljeScsXG4gICAgJ2JvZHknLFxuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCB1cmwoKSB7XG4gICAgaWYodGhpcy5wYXJhbWV0ZXJzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsLmNvbmNhdCh0aGlzLnF1ZXJ5U3RyaW5nKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsXG4gICAgfVxuICB9XG4gIHNldCB1cmwodXJsKSB7IHRoaXMuX3VybCA9IHVybCB9XG4gIGdldCBxdWVyeVN0cmluZygpIHtcbiAgICBsZXQgcXVlcnlTdHJpbmcgPSAnJ1xuICAgIGlmKHRoaXMucGFyYW1ldGVycykge1xuICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IE9iamVjdC5lbnRyaWVzKHRoaXMucGFyYW1ldGVycylcbiAgICAgICAgLnJlZHVjZSgocGFyYW1ldGVyU3RyaW5ncywgW3BhcmFtZXRlcktleSwgcGFyYW1ldGVyVmFsdWVdKSA9PiB7XG4gICAgICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IHBhcmFtZXRlcktleS5jb25jYXQoJz0nLCBwYXJhbWV0ZXJWYWx1ZSlcbiAgICAgICAgICBwYXJhbWV0ZXJTdHJpbmdzLnB1c2gocGFyYW1ldGVyU3RyaW5nKVxuICAgICAgICAgIHJldHVybiBwYXJhbWV0ZXJTdHJpbmdzXG4gICAgICAgIH0sIFtdKVxuICAgICAgICAgIC5qb2luKCcmJylcbiAgICAgIHF1ZXJ5U3RyaW5nID0gJz8nLmNvbmNhdChwYXJhbWV0ZXJTdHJpbmcpXG4gICAgfVxuICAgIHJldHVybiBxdWVyeVN0cmluZ1xuICB9XG4gIGdldCBtZXRob2QoKSB7IHJldHVybiB0aGlzLl9tZXRob2QgfVxuICBzZXQgbWV0aG9kKG1ldGhvZCkgeyB0aGlzLl9tZXRob2QgPSBtZXRob2QgfVxuICBzZXQgbW9kZShtb2RlKSB7IHRoaXMuX21vZGUgPSBtb2RlIH1cbiAgZ2V0IG1vZGUoKSB7IHJldHVybiB0aGlzLl9tb2RlIH1cbiAgc2V0IGNhY2hlKGNhY2hlKSB7IHRoaXMuX2NhY2hlID0gY2FjaGUgfVxuICBnZXQgY2FjaGUoKSB7IHJldHVybiB0aGlzLl9jYWNoZSB9XG4gIHNldCBjcmVkZW50aWFscyhjcmVkZW50aWFscykgeyB0aGlzLl9jcmVkZW50aWFscyA9IGNyZWRlbnRpYWxzIH1cbiAgZ2V0IGNyZWRlbnRpYWxzKCkgeyByZXR1cm4gdGhpcy5fY3JlZGVudGlhbHMgfVxuICBzZXQgaGVhZGVycyhoZWFkZXJzKSB7IHRoaXMuX2hlYWRlcnMgPSBoZWFkZXJzIH1cbiAgZ2V0IGhlYWRlcnMoKSB7IHJldHVybiB0aGlzLl9oZWFkZXJzIH1cbiAgc2V0IHJlZGlyZWN0KHJlZGlyZWN0KSB7IHRoaXMuX3JlZGlyZWN0ID0gcmVkaXJlY3QgfVxuICBnZXQgcmVkaXJlY3QoKSB7IHJldHVybiB0aGlzLl9yZWRpcmVjdCB9XG4gIHNldCByZWZlcnJlclBvbGljeShyZWZlcnJlclBvbGljeSkgeyB0aGlzLl9yZWZlcnJlclBvbGljeSA9IHJlZmVycmVyUG9saWN5IH1cbiAgZ2V0IHJlZmVycmVyUG9saWN5KCkgeyByZXR1cm4gdGhpcy5fcmVmZXJyZXJQb2xpY3kgfVxuICBzZXQgYm9keShib2R5KSB7IHRoaXMuX2JvZHkgPSBib2R5IH1cbiAgZ2V0IGJvZHkoKSB7IHJldHVybiB0aGlzLl9ib2R5IH1cbiAgZ2V0IHBhcmFtZXRlcnMoKSB7IHJldHVybiB0aGlzLl9wYXJhbWV0ZXJzIHx8IG51bGwgfVxuICBzZXQgcGFyYW1ldGVycyhwYXJhbWV0ZXJzKSB7IHRoaXMuX3BhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzIH1cbiAgZ2V0IHByZXZpb3VzQWJvcnRDb250cm9sbGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9wcmV2aW91c0Fib3J0Q29udHJvbGxlclxuICB9XG4gIHNldCBwcmV2aW91c0Fib3J0Q29udHJvbGxlcihwcmV2aW91c0Fib3J0Q29udHJvbGxlcikgeyB0aGlzLl9wcmV2aW91c0Fib3J0Q29udHJvbGxlciA9IHByZXZpb3VzQWJvcnRDb250cm9sbGVyIH1cbiAgZ2V0IGFib3J0Q29udHJvbGxlcigpIHtcbiAgICBpZighdGhpcy5fYWJvcnRDb250cm9sbGVyKSB7XG4gICAgICB0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyID0gdGhpcy5fYWJvcnRDb250cm9sbGVyXG4gICAgfVxuICAgIHRoaXMuX2Fib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKVxuICAgIHJldHVybiB0aGlzLl9hYm9ydENvbnRyb2xsZXJcbiAgfVxuICBhYm9ydCgpIHtcbiAgICB0aGlzLmFib3J0Q29udHJvbGxlci5hYm9ydCgpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBmZXRjaCgpIHtcbiAgICBjb25zdCBmZXRjaE9wdGlvbnMgPSB0aGlzLnZhbGlkU2V0dGluZ3MucmVkdWNlKChfZmV0Y2hPcHRpb25zLCBmZXRjaE9wdGlvbk5hbWUpID0+IHtcbiAgICAgIGlmKHRoaXNbZmV0Y2hPcHRpb25OYW1lXSkgX2ZldGNoT3B0aW9uc1tmZXRjaE9wdGlvbk5hbWVdID0gdGhpc1tmZXRjaE9wdGlvbk5hbWVdXG4gICAgICByZXR1cm4gX2ZldGNoT3B0aW9uc1xuICAgIH0sIHt9KVxuICAgIGZldGNoT3B0aW9ucy5zaWduYWwgPSB0aGlzLmFib3J0Q29udHJvbGxlci5zaWduYWxcbiAgICBpZih0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyKSB0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyLmFib3J0KClcbiAgICByZXR1cm4gZmV0Y2godGhpcy51cmwsIGZldGNoT3B0aW9ucylcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpXG4gICAgICB9KVxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCdyZWFkeScsIHtcbiAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBkYXRhXG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCB7XG4gICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gZGF0YVxuICAgICAgfSlcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgU2VydmljZVxuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXguanMnXG5pbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi4vVXRpbGl0aWVzL2luZGV4J1xuXG5jb25zdCBNb2RlbCA9IGNsYXNzIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLmVtaXQoXG4gICAgICAncmVhZHknLFxuICAgICAge30sXG4gICAgICB0aGlzLFxuICAgIClcbiAgfVxuICBnZXQgdXVpZCgpIHtcbiAgICBpZighdGhpcy5fdXVpZCkgdGhpcy5fdXVpZCA9IFVVSUQoKVxuICAgIHJldHVybiB0aGlzLl91dWlkXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ2xvY2FsU3RvcmFnZScsXG4gICAgJ2RlZmF1bHRzJyxcbiAgICAnc2VydmljZXMnLFxuICAgICdzZXJ2aWNlRXZlbnRzJyxcbiAgICAnc2VydmljZUNhbGxiYWNrcycsXG4gIF0gfVxuICBnZXQgYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlcygpIHsgcmV0dXJuIFtcbiAgICAnc2VydmljZScsXG4gIF0gfVxuICBnZXQgc2V0dGluZ3MoKSB7IHJldHVybiB0aGlzLl9zZXR0aW5ncyB9XG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3MuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XG4gICAgICBpZihzZXR0aW5nc1t2YWxpZFNldHRpbmddKSB0aGlzW3ZhbGlkU2V0dGluZ10gPSBzZXR0aW5nc1t2YWxpZFNldHRpbmddXG4gICAgfSlcbiAgICB0aGlzLmJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXNcbiAgICAgIC5mb3JFYWNoKChiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUpID0+IHtcbiAgICAgICAgdGhpcy50b2dnbGVFdmVudHMoYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlLCAnb24nKVxuICAgICAgfSlcbiAgfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cbiAgZ2V0IHNlcnZpY2VzKCkge1xuICAgIGlmKCF0aGlzLl9zZXJ2aWNlcykgdGhpcy5fc2VydmljZXMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9zZXJ2aWNlc1xuICB9XG4gIHNldCBzZXJ2aWNlcyhzZXJ2aWNlcykgeyB0aGlzLl9zZXJ2aWNlcyA9IHNlcnZpY2VzIH1cbiAgZ2V0IGRhdGEoKSB7XG4gICAgaWYoIXRoaXMuX2RhdGEpIHRoaXMuX2RhdGEgPSB7fVxuICAgIHJldHVybiB0aGlzLl9kYXRhXG4gIH1cbiAgZ2V0IGRlZmF1bHRzKCkge1xuICAgIGlmKCF0aGlzLl9kZWZhdWx0cykgdGhpcy5fZGVmYXVsdHMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9kZWZhdWx0c1xuICB9XG4gIHNldCBkZWZhdWx0cyhkZWZhdWx0cykge1xuICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlLnN5bmMgPT09IHRydWUpIHtcbiAgICAgIGlmKE9iamVjdC5lbnRyaWVzKHRoaXMuZGIpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLl9kZWZhdWx0cyA9IGRlZmF1bHRzXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9kZWZhdWx0cyA9IHRoaXMuZGJcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgIH1cbiAgICB0aGlzLnNldCh0aGlzLmRlZmF1bHRzKVxuICB9XG4gIGdldCBsb2NhbFN0b3JhZ2UoKSB7IHJldHVybiB0aGlzLl9sb2NhbFN0b3JhZ2UgfHwge30gfVxuICBzZXQgbG9jYWxTdG9yYWdlKGxvY2FsU3RvcmFnZSkgeyB0aGlzLl9sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UgfVxuICBnZXQgc3RvcmFnZUNvbnRhaW5lcigpIHsgcmV0dXJuIHt9IH1cbiAgZ2V0IGRiKCkgeyByZXR1cm4gdGhpcy5fZGIgfVxuICBnZXQgX2RiKCkge1xuICAgIGxldCBkYiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KSB8fCBKU09OLnN0cmluZ2lmeSh0aGlzLnN0b3JhZ2VDb250YWluZXIpXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGIpXG4gIH1cbiAgc2V0IF9kYihkYikge1xuICAgIGRiID0gSlNPTi5zdHJpbmdpZnkoZGIpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQsIGRiKVxuICB9XG4gIHJlc2V0RXZlbnRzKGNsYXNzVHlwZSkge1xuICAgIFtcbiAgICAgICdvZmYnLFxuICAgICAgJ29uJ1xuICAgIF0uZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZClcbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKSB7XG4gICAgY29uc3QgYmFzZU5hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdzJylcbiAgICBjb25zdCBiYXNlRXZlbnRzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrc05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKVxuICAgIGNvbnN0IGJhc2UgPSB0aGlzW2Jhc2VOYW1lXVxuICAgIGNvbnN0IGJhc2VFdmVudHMgPSB0aGlzW2Jhc2VFdmVudHNOYW1lXVxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3MgPSB0aGlzW2Jhc2VDYWxsYmFja3NOYW1lXVxuICAgIGlmKFxuICAgICAgYmFzZSAmJlxuICAgICAgYmFzZUV2ZW50cyAmJlxuICAgICAgYmFzZUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgT2JqZWN0LmVudHJpZXMoYmFzZUV2ZW50cylcbiAgICAgICAgLmZvckVhY2goKFtiYXNlRXZlbnREYXRhLCBiYXNlQ2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IFtiYXNlVGFyZ2V0TmFtZSwgYmFzZUV2ZW50TmFtZV0gPSBiYXNlRXZlbnREYXRhLnNwbGl0KCcgJylcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0ID0gYmFzZVtiYXNlVGFyZ2V0TmFtZV1cbiAgICAgICAgICBjb25zdCBiYXNlQ2FsbGJhY2sgPSBic2VDYWxsYmFja3NbYmFzZUNhbGxiYWNrTmFtZV1cbiAgICAgICAgICBpZihcbiAgICAgICAgICAgIGJhc2VUYXJnZXROYW1lICYmXG4gICAgICAgICAgICBiYXNlRXZlbnROYW1lICYmXG4gICAgICAgICAgICBiYXNlVGFyZ2V0ICYmXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFja1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgY2xhc3NUeXBlVGFyZ2V0W21ldGhvZF0oY2xhc3NUeXBlRXZlbnROYW1lLCBjbGFzc1R5cGVFdmVudENhbGxiYWNrKVxuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge31cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0REIoKSB7XG4gICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICB2YXIgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBsZXQgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgZGJba2V5XSA9IHZhbHVlXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHRoaXMuX2RiID0gZGJcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0REIoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZGVsZXRlIHRoaXMuX2RiXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgZGVsZXRlIGRiW2tleV1cbiAgICAgICAgdGhpcy5fZGIgPSBkYlxuICAgICAgICBicmVha1xuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlLCBzaWxlbnQpIHtcbiAgICBpZighdGhpcy5kYXRhW2tleV0pIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMuZGF0YSwge1xuICAgICAgICBbJ18nLmNvbmNhdChrZXkpXToge1xuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgW2tleV06IHtcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzWydfJy5jb25jYXQoa2V5KV0gfSxcbiAgICAgICAgICBzZXQodmFsdWUpIHsgdGhpc1snXycuY29uY2F0KGtleSldID0gdmFsdWUgfVxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5kYXRhW2tleV0gPSB2YWx1ZVxuICAgIGlmKFxuICAgICAgKFxuICAgICAgICB0eXBlb2Ygc2lsZW50ID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICBzaWxlbnQgPT09IGZhbHNlXG4gICAgICApIHx8XG4gICAgICB0eXBlb2Ygc2lsZW50ID09PSAndW5kZWZpbmVkJ1xuICAgICkge1xuICAgICAgdGhpcy5lbWl0KCdzZXQnLmNvbmNhdCgnOicsIGtleSksIHtcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgfSwgdGhpcylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldERhdGFQcm9wZXJ0eShrZXksIHNpbGVudCkge1xuICAgIGlmKHRoaXMuZGF0YVtrZXldKSB7XG4gICAgICBkZWxldGUgdGhpcy5kYXRhW2tleV1cbiAgICB9XG4gICAgaWYoXG4gICAgICAoXG4gICAgICAgIHR5cGVvZiBzaWxlbnQgPT09ICdib29sZWFuJyAmJlxuICAgICAgICBzaWxlbnQgPT09IGZhbHNlXG4gICAgICApIHx8XG4gICAgICB0eXBlb2Ygc2lsZW50ID09PSAndW5kZWZpbmVkJ1xuICAgICkge1xuICAgICAgdGhpcy5lbWl0KCd1bnNldCcuY29uY2F0KCc6JywgYXJndW1lbnRzWzBdKSwgdGhpcylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBnZXQoKSB7XG4gICAgaWYoYXJndW1lbnRzWzBdKSByZXR1cm4gdGhpcy5kYXRhW2FyZ3VtZW50c1swXV1cbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy5kYXRhKVxuICAgICAgLnJlZHVjZSgoX2RhdGEsIFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBfZGF0YVtrZXldID0gdmFsdWVcbiAgICAgICAgcmV0dXJuIF9kYXRhXG4gICAgICB9LCB7fSlcbiAgfVxuICBzZXQoKSB7XG4gICAgbGV0IGtleSwgdmFsdWUsIHNpbGVudFxuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgIHNpbGVudCA9IGFyZ3VtZW50c1syXVxuICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KVxuICAgIH0gZWxzZSBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICBpZihcbiAgICAgICAgdHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgdHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ2Jvb2xlYW4nXG4gICAgICApIHtcbiAgICAgICAgc2lsZW50ID0gYXJndW1lbnRzWzFdXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pXG4gICAgICB9XG4gICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy5zZXREQihhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSlcbiAgICB9IGVsc2UgaWYoXG4gICAgICBhcmd1bWVudHMubGVuZ3RoID09PSAxICYmXG4gICAgICAhQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMF0pICYmXG4gICAgICB0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnb2JqZWN0J1xuICAgICkge1xuICAgICAgT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSlcbiAgICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIHRoaXMuc2V0REIoa2V5LCB2YWx1ZSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuZW1pdCgnc2V0JywgdGhpcy5kYXRhLCB0aGlzKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXQoKSB7XG4gICAgbGV0IHNpbGVudFxuICAgIGlmKFxuICAgICAgYXJndW1lbnRzLmxlbmd0aCA9PT0gMlxuICAgICkge1xuICAgICAgc2lsZW50ID0gYXJndW1lbnRzWzFdXG4gICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGFyZ3VtZW50c1swXSwgc2lsZW50KVxuICAgIH0gZWxzZSBpZihcbiAgICAgIGFyZ3VtZW50cy5sZW5ndGggPT09IDFcbiAgICApIHtcbiAgICAgIGlmKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdib29sZWFuJykge1xuICAgICAgICBzaWxlbnQgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5kYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSwgc2lsZW50KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmRhdGEpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlKSB0aGlzLnVuc2V0REIoa2V5KVxuICAgIHRoaXMuZW1pdCgndW5zZXQnLCB0aGlzKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgcGFyc2UoZGF0YSA9IHRoaXMuZGF0YSkge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhkYXRhKS5yZWR1Y2UoKF9kYXRhLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgTW9kZWwpIHtcbiAgICAgICAgX2RhdGFba2V5XSA9IHZhbHVlLnBhcnNlKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9kYXRhW2tleV0gPSB2YWx1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIF9kYXRhXG4gICAgfSwge30pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW9kZWxcbiIsImltcG9ydCB7IFVVSUQgfSBmcm9tICcuLi9VdGlsaXRpZXMvaW5kZXguanMnXHJcbmltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xyXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vTW9kZWwvaW5kZXguanMnXHJcblxyXG5jbGFzcyBDb2xsZWN0aW9uIGV4dGVuZHMgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcclxuICAgIHN1cGVyKClcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xyXG4gIH1cclxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcclxuICAgICdpZEF0dHJpYnV0ZScsXHJcbiAgICAnbW9kZWwnLFxyXG4gICAgJ2RlZmF1bHRzJyxcclxuICAgICdzZXJ2aWNlcycsXHJcbiAgICAnc2VydmljZUV2ZW50cycsXHJcbiAgICAnc2VydmljZUNhbGxiYWNrcycsXHJcbiAgICAnbG9jYWxTdG9yYWdlJ1xyXG4gIF0gfVxyXG4gIGdldCBiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzKCkgeyByZXR1cm4gW1xyXG4gICAgJ3NlcnZpY2UnXHJcbiAgXSB9XHJcbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxyXG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xyXG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xyXG4gICAgICBpZihzZXR0aW5nc1t2YWxpZFNldHRpbmddKSB0aGlzW3ZhbGlkU2V0dGluZ10gPSBzZXR0aW5nc1t2YWxpZFNldHRpbmddXHJcbiAgICB9KVxyXG4gICAgdGhpcy5iaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzXHJcbiAgICAgIC5mb3JFYWNoKChiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUpID0+IHtcclxuICAgICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUsICdvbicpXHJcbiAgICAgIH0pXHJcbiAgfVxyXG4gIGdldCBvcHRpb25zKCkge1xyXG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxyXG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcclxuICB9XHJcbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XHJcbiAgZ2V0IHN0b3JhZ2VDb250YWluZXIoKSB7IHJldHVybiBbXSB9XHJcbiAgZ2V0IGRlZmF1bHRJREF0dHJpYnV0ZSgpIHsgcmV0dXJuICdfaWQnIH1cclxuICBnZXQgZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLl9kZWZhdWx0cyB9XHJcbiAgc2V0IGRlZmF1bHRzKGRlZmF1bHRzKSB7XHJcbiAgICB0aGlzLl9kZWZhdWx0cyA9IGRlZmF1bHRzXHJcbiAgICB0aGlzLmFkZChkZWZhdWx0cylcclxuICB9XHJcbiAgZ2V0IHV1aWQoKSB7XHJcbiAgICBpZighdGhpcy5fdXVpZCkgdGhpcy5fdXVpZCA9IFV0aWxpdGllcy5VVUlEKClcclxuICAgIHJldHVybiB0aGlzLl91dWlkXHJcbiAgfVxyXG4gIGdldCBtb2RlbHMoKSB7XHJcbiAgICB0aGlzLl9tb2RlbHMgPSB0aGlzLl9tb2RlbHMgfHwgdGhpcy5zdG9yYWdlQ29udGFpbmVyXHJcbiAgICByZXR1cm4gdGhpcy5fbW9kZWxzXHJcbiAgfVxyXG4gIHNldCBtb2RlbHMobW9kZWxzRGF0YSkgeyB0aGlzLl9tb2RlbHMgPSBtb2RlbHNEYXRhIH1cclxuICBnZXQgbW9kZWwoKSB7IHJldHVybiB0aGlzLl9tb2RlbCB9XHJcbiAgc2V0IG1vZGVsKG1vZGVsKSB7IHRoaXMuX21vZGVsID0gbW9kZWwgfVxyXG4gIGdldCBsb2NhbFN0b3JhZ2UoKSB7IHJldHVybiB0aGlzLl9sb2NhbFN0b3JhZ2UgfVxyXG4gIHNldCBsb2NhbFN0b3JhZ2UobG9jYWxTdG9yYWdlKSB7IHRoaXMuX2xvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XHJcbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9kYXRhIH1cclxuICBnZXQgZGF0YSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9tb2RlbHNcclxuICAgICAgLm1hcCgobW9kZWwpID0+IG1vZGVsLnBhcnNlKCkpXHJcbiAgfVxyXG4gIGdldCBkYigpIHsgcmV0dXJuIHRoaXMuX2RiIH1cclxuICBnZXQgZGIoKSB7XHJcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgfHwgSlNPTi5zdHJpbmdpZnkodGhpcy5zdG9yYWdlQ29udGFpbmVyKVxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGIpXHJcbiAgfVxyXG4gIHNldCBkYihkYikge1xyXG4gICAgZGIgPSBKU09OLnN0cmluZ2lmeShkYilcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcclxuICB9XHJcbiAgcmVzZXRFdmVudHMoY2xhc3NUeXBlKSB7XHJcbiAgICBbXHJcbiAgICAgICdvZmYnLFxyXG4gICAgICAnb24nXHJcbiAgICBdLmZvckVhY2goKG1ldGhvZCkgPT4ge1xyXG4gICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZClcclxuICAgIH0pXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICB0b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpIHtcclxuICAgIGNvbnN0IGJhc2VOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgncycpXHJcbiAgICBjb25zdCBiYXNlRXZlbnRzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXHJcbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXHJcbiAgICBjb25zdCBiYXNlID0gdGhpc1tiYXNlTmFtZV1cclxuICAgIGNvbnN0IGJhc2VFdmVudHMgPSB0aGlzW2Jhc2VFdmVudHNOYW1lXVxyXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrcyA9IHRoaXNbYmFzZUNhbGxiYWNrc05hbWVdXHJcbiAgICBpZihcclxuICAgICAgYmFzZSAmJlxyXG4gICAgICBiYXNlRXZlbnRzICYmXHJcbiAgICAgIGJhc2VDYWxsYmFja3NcclxuICAgICkge1xyXG4gICAgICBPYmplY3QuZW50cmllcyhiYXNlRXZlbnRzKVxyXG4gICAgICAgIC5mb3JFYWNoKChbYmFzZUV2ZW50RGF0YSwgYmFzZUNhbGxiYWNrTmFtZV0pID0+IHtcclxuICAgICAgICAgIGNvbnN0IFtiYXNlVGFyZ2V0TmFtZSwgYmFzZUV2ZW50TmFtZV0gPSBiYXNlRXZlbnREYXRhLnNwbGl0KCcgJylcclxuICAgICAgICAgIGNvbnN0IGJhc2VUYXJnZXQgPSBiYXNlW2Jhc2VUYXJnZXROYW1lXVxyXG4gICAgICAgICAgY29uc3QgYmFzZUV2ZW50Q2FsbGJhY2sgPSBiYXNlQ2FsbGJhY2tzW2Jhc2VDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWUgJiZcclxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxyXG4gICAgICAgICAgICBiYXNlVGFyZ2V0ICYmXHJcbiAgICAgICAgICAgIGJhc2VFdmVudENhbGxiYWNrXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBjbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHt9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGdldE1vZGVsSW5kZXgobW9kZWxVVUlEKSB7XHJcbiAgICBsZXQgbW9kZWxJbmRleFxyXG4gICAgdGhpcy5fbW9kZWxzXHJcbiAgICAgIC5maW5kKChfbW9kZWwsIF9tb2RlbEluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYoX21vZGVsICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgX21vZGVsIGluc3RhbmNlb2YgTW9kZWwgJiZcclxuICAgICAgICAgICAgX21vZGVsLl91dWlkID09PSBtb2RlbFVVSURcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICBtb2RlbEluZGV4ID0gX21vZGVsSW5kZXhcclxuICAgICAgICAgICAgcmV0dXJuIF9tb2RlbFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIHJldHVybiBtb2RlbEluZGV4XHJcbiAgfVxyXG4gIHJlbW92ZU1vZGVsQnlJbmRleChtb2RlbEluZGV4KSB7XHJcbiAgICBsZXQgbW9kZWwgPSB0aGlzLl9tb2RlbHMuc3BsaWNlKG1vZGVsSW5kZXgsIDEsIG51bGwpXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdyZW1vdmU6bW9kZWwnLFxyXG4gICAgICBtb2RlbFswXS5wYXJzZSgpLFxyXG4gICAgICB0aGlzLFxyXG4gICAgICBtb2RlbFswXVxyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgYWRkTW9kZWwobW9kZWxEYXRhKSB7XHJcbiAgICBsZXQgbW9kZWxcclxuICAgIGxldCBzb21lTW9kZWwgPSBuZXcgTW9kZWwoKVxyXG4gICAgaWYobW9kZWxEYXRhIGluc3RhbmNlb2YgTW9kZWwpIHtcclxuICAgICAgbW9kZWwgPSBtb2RlbERhdGFcclxuICAgIH0gZWxzZSBpZihcclxuICAgICAgdGhpcy5tb2RlbFxyXG4gICAgKSB7XHJcbiAgICAgIG1vZGVsID0gbmV3IHRoaXMubW9kZWwoKVxyXG4gICAgICBtb2RlbC5zZXQobW9kZWxEYXRhKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbW9kZWwgPSBuZXcgTW9kZWwoKVxyXG4gICAgICBtb2RlbC5zZXQobW9kZWxEYXRhKVxyXG4gICAgfVxyXG4gICAgbW9kZWwub24oXHJcbiAgICAgICdzZXQnLFxyXG4gICAgICAoZXZlbnQsIF9tb2RlbCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZW1pdChcclxuICAgICAgICAgICdjaGFuZ2U6bW9kZWwnLFxyXG4gICAgICAgICAgdGhpcy5wYXJzZSgpLFxyXG4gICAgICAgICAgdGhpcyxcclxuICAgICAgICAgIG1vZGVsLFxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG4gICAgKVxyXG4gICAgdGhpcy5tb2RlbHMucHVzaChtb2RlbClcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ2FkZCcsXHJcbiAgICAgIG1vZGVsLnBhcnNlKCksXHJcbiAgICAgIHRoaXMsXHJcbiAgICAgIG1vZGVsXHJcbiAgICApXHJcbiAgICByZXR1cm4gbW9kZWxcclxuICB9XHJcbiAgYWRkKG1vZGVsRGF0YSkge1xyXG4gICAgaWYoQXJyYXkuaXNBcnJheShtb2RlbERhdGEpKSB7XHJcbiAgICAgIG1vZGVsRGF0YVxyXG4gICAgICAgIC5mb3JFYWNoKChtb2RlbCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5hZGRNb2RlbChtb2RlbClcclxuICAgICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hZGRNb2RlbChtb2RlbERhdGEpXHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy5kYiA9IHRoaXMuZGF0YVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAnY2hhbmdlJyxcclxuICAgICAgdGhpcy5wYXJzZSgpLFxyXG4gICAgICB0aGlzXHJcbiAgICApXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICByZW1vdmUobW9kZWxEYXRhKSB7XHJcbiAgICBpZihcclxuICAgICAgIUFycmF5LmlzQXJyYXkobW9kZWxEYXRhKSAmJlxyXG4gICAgICB0eXBlb2YgbW9kZWxEYXRhID09PSAnb2JqZWN0J1xyXG4gICAgKSB7XHJcbiAgICAgIHZhciBtb2RlbEluZGV4ID0gdGhpcy5nZXRNb2RlbEluZGV4KG1vZGVsRGF0YS51dWlkKVxyXG4gICAgICB0aGlzLnJlbW92ZU1vZGVsQnlJbmRleChtb2RlbEluZGV4KVxyXG4gICAgfSBlbHNlIGlmKEFycmF5LmlzQXJyYXkobW9kZWxEYXRhKSkge1xyXG4gICAgICBtb2RlbERhdGFcclxuICAgICAgICAuZm9yRWFjaCgobW9kZWwpID0+IHtcclxuICAgICAgICAgIHZhciBtb2RlbEluZGV4ID0gdGhpcy5nZXRNb2RlbEluZGV4KG1vZGVsLnV1aWQpXHJcbiAgICAgICAgICB0aGlzLnJlbW92ZU1vZGVsQnlJbmRleChtb2RlbEluZGV4KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICB0aGlzLm1vZGVscyA9IHRoaXMubW9kZWxzXHJcbiAgICAgIC5maWx0ZXIoKG1vZGVsKSA9PiBtb2RlbCAhPT0gbnVsbClcclxuICAgIGlmKHRoaXMuX2xvY2FsU3RvcmFnZSkgdGhpcy5kYiA9IHRoaXMuZGF0YVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAncmVtb3ZlJyxcclxuICAgICAgdGhpcy5wYXJzZSgpLFxyXG4gICAgICB0aGlzXHJcbiAgICApXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICByZXNldCgpIHtcclxuICAgIHRoaXMucmVtb3ZlKHRoaXMuX21vZGVscylcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHBhcnNlKGRhdGEpIHtcclxuICAgIGRhdGEgPSBkYXRhIHx8IHRoaXMuZGF0YSB8fCB0aGlzLnN0b3JhZ2VDb250YWluZXJcclxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ29sbGVjdGlvblxyXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleC5qcydcblxuY2xhc3MgVmlldyBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ2F0dHJpYnV0ZXMnLFxuICAgICdlbGVtZW50TmFtZScsXG4gICAgJ2VsZW1lbnQnLFxuICAgICdpbnNlcnQnLFxuICAgICd0ZW1wbGF0ZScsXG4gICAgJ3VpRWxlbWVudHMnLFxuICAgICd1aUVsZW1lbnRFdmVudHMnLFxuICAgICd1aUVsZW1lbnRDYWxsYmFja3MnLFxuICAgICdyZW5kZXInXG4gIF0gfVxuICBnZXQgc2V0dGluZ3MoKSB7IHJldHVybiB0aGlzLl9zZXR0aW5ncyB9XG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3MuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XG4gICAgICBpZihzZXR0aW5nc1t2YWxpZFNldHRpbmddKSB0aGlzW3ZhbGlkU2V0dGluZ10gPSBzZXR0aW5nc1t2YWxpZFNldHRpbmddXG4gICAgfSlcbiAgfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cbiAgZ2V0IGVsZW1lbnROYW1lKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudE5hbWUgfVxuICBzZXQgZWxlbWVudE5hbWUoZWxlbWVudE5hbWUpIHsgdGhpcy5fZWxlbWVudE5hbWUgPSBlbGVtZW50TmFtZSB9XG4gIGdldCBlbGVtZW50KCkge1xuICAgIGlmKCF0aGlzLl9lbGVtZW50KSB7XG4gICAgICB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLmVsZW1lbnROYW1lKVxuICAgICAgT2JqZWN0LmVudHJpZXModGhpcy5hdHRyaWJ1dGVzKS5mb3JFYWNoKChbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0pID0+IHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSlcbiAgICAgIH0pXG4gICAgICB0aGlzLmVsZW1lbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudCwge1xuICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFxuICB9XG4gIGdldCBlbGVtZW50T2JzZXJ2ZXIoKSB7XG4gICAgdGhpcy5fZWxlbWVudE9ic2VydmVyID0gdGhpcy5fZWxlbWVudE9ic2VydmVyIHx8IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuICAgICAgdGhpcy5lbGVtZW50T2JzZXJ2ZS5iaW5kKHRoaXMpXG4gICAgKVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgfVxuICBzZXQgZWxlbWVudChlbGVtZW50KSB7XG4gICAgaWYoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gZWxlbWVudFxuICB9XG4gIGdldCBhdHRyaWJ1dGVzKCkgeyByZXR1cm4gdGhpcy5fYXR0cmlidXRlcyB8fCB7fSB9XG4gIHNldCBhdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHsgdGhpcy5fYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXMgfVxuICBnZXQgdGVtcGxhdGUoKSB7IHJldHVybiB0aGlzLl90ZW1wbGF0ZSB9XG4gIHNldCB0ZW1wbGF0ZSh0ZW1wbGF0ZSkgeyB0aGlzLl90ZW1wbGF0ZSA9IHRlbXBsYXRlIH1cbiAgZ2V0IHVpRWxlbWVudHMoKSB7IHJldHVybiB0aGlzLl91aUVsZW1lbnRzIHx8IHt9IH1cbiAgc2V0IHVpRWxlbWVudHModWlFbGVtZW50cykge1xuICAgIHRoaXMuX3VpRWxlbWVudHMgPSB1aUVsZW1lbnRzXG4gICAgdGhpcy50b2dnbGVFdmVudHMoKVxuICB9XG4gIGdldCB1aUVsZW1lbnRFdmVudHMoKSB7IHJldHVybiB0aGlzLl91aUVsZW1lbnRFdmVudHMgfHwge30gfVxuICBzZXQgdWlFbGVtZW50RXZlbnRzKHVpRWxlbWVudEV2ZW50cykge1xuICAgIHRoaXMuX3VpRWxlbWVudEV2ZW50cyA9IHVpRWxlbWVudEV2ZW50c1xuICAgIHRoaXMudG9nZ2xlRXZlbnRzKClcbiAgfVxuICBnZXQgdWlFbGVtZW50Q2FsbGJhY2tzKCkgeyByZXR1cm4gdGhpcy5fdWlFbGVtZW50Q2FsbGJhY2tzIHx8IHt9IH1cbiAgc2V0IHVpRWxlbWVudENhbGxiYWNrcyh1aUVsZW1lbnRDYWxsYmFja3MpIHtcbiAgICB0aGlzLl91aUVsZW1lbnRDYWxsYmFja3MgPSB1aUVsZW1lbnRDYWxsYmFja3NcbiAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gIH1cbiAgZ2V0IHVpKCkge1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzXG4gICAgaWYoIXRoaXMuX3VpKSB7XG4gICAgICB0aGlzLl91aSA9IE9iamVjdC5lbnRyaWVzKHRoaXMudWlFbGVtZW50cykucmVkdWNlKChfdWksW3VpRWxlbWVudE5hbWUsIHVpRWxlbWVudFF1ZXJ5XSkgPT4ge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhfdWksIHtcbiAgICAgICAgICBbdWlFbGVtZW50TmFtZV06IHtcbiAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgaWYodHlwZW9mIHVpRWxlbWVudFF1ZXJ5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGxldCBxdWVyeVJlc3VsdHMgPSBjb250ZXh0LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh1aUVsZW1lbnRRdWVyeSlcbiAgICAgICAgICAgICAgICByZXR1cm4gKHF1ZXJ5UmVzdWx0cy5sZW5ndGggPiAxKSA/IHF1ZXJ5UmVzdWx0cyA6IHF1ZXJ5UmVzdWx0cy5pdGVtKDApXG4gICAgICAgICAgICAgIH0gZWxzZSBpZihcbiAgICAgICAgICAgICAgICB1aUVsZW1lbnRRdWVyeSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICAgICAgICAgICAgdWlFbGVtZW50UXVlcnkgaW5zdGFuY2VvZiBEb2N1bWVudCB8fFxuICAgICAgICAgICAgICAgIHVpRWxlbWVudFF1ZXJ5IGluc3RhbmNlb2YgV2luZG93XG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1aUVsZW1lbnRRdWVyeVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIF91aVxuICAgICAgfSwge30pXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLl91aSwge1xuICAgICAgICAnJGVsZW1lbnQnOiB7XG4gICAgICAgICAgZ2V0KCkgeyByZXR1cm4gY29udGV4dC5lbGVtZW50IH1cbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl91aVxuICB9XG4gIGVsZW1lbnRPYnNlcnZlKG11dGF0aW9uUmVjb3JkTGlzdCwgb2JzZXJ2ZXIpIHtcbiAgICBmb3IobGV0IFttdXRhdGlvblJlY29yZEluZGV4LCBtdXRhdGlvblJlY29yZF0gb2YgT2JqZWN0LmVudHJpZXMobXV0YXRpb25SZWNvcmRMaXN0KSkge1xuICAgICAgc3dpdGNoKG11dGF0aW9uUmVjb3JkLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnY2hpbGRMaXN0JzpcbiAgICAgICAgICBpZihtdXRhdGlvblJlY29yZC5hZGRlZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnModGhpcy51aSkpXG4gICAgICAgICAgICAuZm9yRWFjaCgoW3VpS2V5LCB1aVZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB1aVZhbHVlR2V0ID0gdWlWYWx1ZS5nZXQoKVxuICAgICAgICAgICAgICBjb25zdCBhZGRlZFVJRWxlbWVudCA9IEFycmF5LmZyb20obXV0YXRpb25SZWNvcmQuYWRkZWROb2RlcykuZmluZCgoYWRkZWROb2RlKSA9PiBhZGRlZE5vZGUgPT09IHVpVmFsdWVHZXQpXG4gICAgICAgICAgICAgIGlmKGFkZGVkVUlFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVFdmVudHModWlLZXkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGJpbmRFdmVudFRvRWxlbWVudChlbGVtZW50LCBtZXRob2QsIGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFja05hbWUpIHtcbiAgICB0cnkge1xuICAgICAgc3dpdGNoKG1ldGhvZCkge1xuICAgICAgICBjYXNlICdhZGRFdmVudExpc3RlbmVyJzpcbiAgICAgICAgICB0aGlzLnVpRWxlbWVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gPSB0aGlzLnVpRWxlbWVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0uYmluZCh0aGlzKVxuICAgICAgICAgIGVsZW1lbnRbbWV0aG9kXShldmVudE5hbWUsIHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSlcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdyZW1vdmVFdmVudExpc3RlbmVyJzpcbiAgICAgICAgICBlbGVtZW50W21ldGhvZF0oZXZlbnROYW1lLCB0aGlzLnVpRWxlbWVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9IGNhdGNoKGVycm9yKSB7fVxuICB9XG4gIHRvZ2dsZUV2ZW50cyh0YXJnZXRVSUVsZW1lbnROYW1lID0gbnVsbCkge1xuICAgIHRoaXMuaXNUb2dnbGluZyA9IHRydWVcbiAgICBjb25zdCB1aSA9IHRoaXMudWlcbiAgICBjb25zdCBldmVudEJpbmRNZXRob2RzID0gWydyZW1vdmVFdmVudExpc3RlbmVyJywgJ2FkZEV2ZW50TGlzdGVuZXInXVxuICAgIGlmKCF0YXJnZXRVSUVsZW1lbnROYW1lKSB7XG4gICAgICBldmVudEJpbmRNZXRob2RzLmZvckVhY2goKGV2ZW50QmluZE1ldGhvZCkgPT4ge1xuICAgICAgICBPYmplY3QuZW50cmllcyh0aGlzLnVpRWxlbWVudEV2ZW50cykuZm9yRWFjaCgoW3VpRWxlbWVudEV2ZW50U2V0dGluZ3MsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGxldCBbdWlFbGVtZW50TmFtZSwgdWlFbGVtZW50RXZlbnROYW1lXSA9IHVpRWxlbWVudEV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxuICAgICAgICAgIGlmKHVpW3VpRWxlbWVudE5hbWVdIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgICAgICAgIHVpW3VpRWxlbWVudE5hbWVdLmZvckVhY2goKHVpRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmJpbmRFdmVudFRvRWxlbWVudCh1aUVsZW1lbnQsIGV2ZW50QmluZE1ldGhvZCwgdWlFbGVtZW50RXZlbnROYW1lLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIGlmKFxuICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxuICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBEb2N1bWVudCB8fFxuICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBXaW5kb3dcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50VG9FbGVtZW50KHVpW3VpRWxlbWVudE5hbWVdLCBldmVudEJpbmRNZXRob2QsIHVpRWxlbWVudEV2ZW50TmFtZSwgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnRCaW5kTWV0aG9kcy5mb3JFYWNoKChldmVudEJpbmRNZXRob2QpID0+IHtcbiAgICAgICAgY29uc3QgdWlFbGVtZW50RXZlbnRzID0gT2JqZWN0LmVudHJpZXModGhpcy51aUVsZW1lbnRFdmVudHMpLmZvckVhY2goKFt1aUVsZW1lbnRFdmVudFNldHRpbmdzLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZV0pID0+IHtcbiAgICAgICAgICBsZXQgW3VpRWxlbWVudE5hbWUsIHVpRWxlbWVudEV2ZW50TmFtZV0gPSB1aUVsZW1lbnRFdmVudFNldHRpbmdzLnNwbGl0KCcgJylcbiAgICAgICAgICBpZih0YXJnZXRVSUVsZW1lbnROYW1lID09PSB1aUVsZW1lbnROYW1lKSB7XG4gICAgICAgICAgICBpZih1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XG4gICAgICAgICAgICAgIHVpW3VpRWxlbWVudE5hbWVdLmZvckVhY2goKHVpRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50VG9FbGVtZW50KHVpRWxlbWVudCwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIGlmKHVpW3VpRWxlbWVudE5hbWVdIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlbdWlFbGVtZW50TmFtZV0sIGV2ZW50QmluZE1ldGhvZCwgdWlFbGVtZW50RXZlbnROYW1lLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLmlzVG9nZ2xpbmcgPSBmYWxzZVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgYXV0b0luc2VydCgpIHtcbiAgICBpZih0aGlzLmluc2VydCkge1xuICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5pbnNlcnQucGFyZW50XG4gICAgICBjb25zdCBtZXRob2QgPSB0aGlzLmluc2VydC5tZXRob2RcbiAgICAgIHBhcmVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQobWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgYXV0b1JlbW92ZSgpIHtcbiAgICBpZih0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHJlbmRlcihkYXRhID0ge30pIHtcbiAgICBpZih0aGlzLnRlbXBsYXRlKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUoZGF0YSlcbiAgICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZVxuICAgIH1cbiAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgVmlld1xuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXgnXG5cbmNvbnN0IENvbnRyb2xsZXIgPSBjbGFzcyBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ21vZGVscycsXG4gICAgJ21vZGVsRXZlbnRzJyxcbiAgICAnbW9kZWxDYWxsYmFja3MnLFxuICAgICdjb2xsZWN0aW9ucycsXG4gICAgJ2NvbGxlY3Rpb25FdmVudHMnLFxuICAgICdjb2xsZWN0aW9uQ2FsbGJhY2tzJyxcbiAgICAndmlld3MnLFxuICAgICd2aWV3RXZlbnRzJyxcbiAgICAndmlld0NhbGxiYWNrcycsXG4gICAgJ2NvbnRyb2xsZXJzJyxcbiAgICAnY29udHJvbGxlckV2ZW50cycsXG4gICAgJ2NvbnRyb2xsZXJDYWxsYmFja3MnLFxuICAgICdyb3V0ZXJzJyxcbiAgICAncm91dGVyRXZlbnRzJyxcbiAgICAncm91dGVyQ2FsbGJhY2tzJyxcbiAgXSB9XG4gIGdldCBiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzKCkgeyByZXR1cm4gW1xuICAgICdtb2RlbCcsXG4gICAgJ3ZpZXcnLFxuICAgICdjb2xsZWN0aW9uJyxcbiAgICAnY29udHJvbGxlcicsXG4gICAgJ3JvdXRlcicsXG4gIF0gfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cbiAgZ2V0IHNldHRpbmdzKCkge1xuICAgIGlmKCF0aGlzLl9zZXR0aW5ncykgdGhpcy5fc2V0dGluZ3MgPSB7fVxuICAgIHJldHVybiB0aGlzLl9zZXR0aW5nc1xuICB9XG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3NcbiAgICAgIC5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgICAgaWYodGhpcy5zZXR0aW5nc1t2YWxpZFNldHRpbmddKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBbJ18nLmNvbmNhdCh2YWxpZFNldHRpbmcpXToge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtYmVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFt2YWxpZFNldHRpbmddOiB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpc1snXycuY29uY2F0KHZhbGlkU2V0dGluZyldIH0sXG4gICAgICAgICAgICAgICAgc2V0KHZhbHVlKSB7IHRoaXNbJ18nLmNvbmNhdCh2YWxpZFNldHRpbmcpXSA9IHZhbHVlIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKVxuICAgICAgICAgIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHRoaXMuc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIHRoaXMuYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlc1xuICAgICAgLmZvckVhY2goKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSkgPT4ge1xuICAgICAgICB0aGlzLnJlc2V0RXZlbnRzKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSlcbiAgICAgIH0pXG4gIH1cbiAgcmVzZXRFdmVudHMoY2xhc3NUeXBlKSB7XG4gICAgW1xuICAgICAgJ29mZicsXG4gICAgICAnb24nXG4gICAgXS5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB0b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpIHtcbiAgICBjb25zdCBiYXNlTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ3MnKVxuICAgIGNvbnN0IGJhc2VFdmVudHNOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJylcbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXG4gICAgY29uc3QgYmFzZSA9IHRoaXNbYmFzZU5hbWVdIHx8IHt9XG4gICAgY29uc3QgYmFzZUV2ZW50cyA9IHRoaXNbYmFzZUV2ZW50c05hbWVdIHx8IHt9XG4gICAgY29uc3QgYmFzZUNhbGxiYWNrcyA9IHRoaXNbYmFzZUNhbGxiYWNrc05hbWVdIHx8IHt9XG4gICAgaWYoXG4gICAgICBPYmplY3QudmFsdWVzKGJhc2UpLmxlbmd0aCAmJlxuICAgICAgT2JqZWN0LnZhbHVlcyhiYXNlRXZlbnRzKS5sZW5ndGggJiZcbiAgICAgIE9iamVjdC52YWx1ZXMoYmFzZUNhbGxiYWNrcykubGVuZ3RoXG4gICAgKSB7XG4gICAgICBPYmplY3QuZW50cmllcyhiYXNlRXZlbnRzKVxuICAgICAgICAuZm9yRWFjaCgoW2Jhc2VFdmVudERhdGEsIGJhc2VDYWxsYmFja05hbWVdKSA9PiB7XG4gICAgICAgICAgY29uc3QgW2Jhc2VUYXJnZXROYW1lLCBiYXNlRXZlbnROYW1lXSA9IGJhc2VFdmVudERhdGEuc3BsaXQoJyAnKVxuICAgICAgICAgIGNvbnN0IGJhc2VUYXJnZXROYW1lU3Vic3RyaW5nRmlyc3QgPSBiYXNlVGFyZ2V0TmFtZS5zdWJzdHJpbmcoMCwgMSlcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0xhc3QgPSBiYXNlVGFyZ2V0TmFtZS5zdWJzdHJpbmcoYmFzZVRhcmdldE5hbWUubGVuZ3RoIC0gMSlcbiAgICAgICAgICBsZXQgYmFzZVRhcmdldHMgPSBbXVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdGaXJzdCA9PT0gJ1snICYmXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0xhc3QgPT09ICddJ1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZVRhcmdldHMgPSBPYmplY3QuZW50cmllcyhiYXNlKVxuICAgICAgICAgICAgICAucmVkdWNlKChfYmFzZVRhcmdldHMsIFtiYXNlTmFtZSwgYmFzZVRhcmdldF0pID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmFzZVRhcmdldE5hbWVSZWdFeHBTdHJpbmcgPSBiYXNlVGFyZ2V0TmFtZS5zbGljZSgxLCAtMSlcbiAgICAgICAgICAgICAgICBsZXQgYmFzZVRhcmdldE5hbWVSZWdFeHAgPSBuZXcgUmVnRXhwKGJhc2VUYXJnZXROYW1lUmVnRXhwU3RyaW5nKVxuICAgICAgICAgICAgICAgIGlmKGJhc2VOYW1lLm1hdGNoKGJhc2VUYXJnZXROYW1lUmVnRXhwKSkge1xuICAgICAgICAgICAgICAgICAgX2Jhc2VUYXJnZXRzLnB1c2goYmFzZVRhcmdldClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9iYXNlVGFyZ2V0c1xuICAgICAgICAgICAgICB9LCBbXSlcbiAgICAgICAgICB9IGVsc2UgaWYoYmFzZVtiYXNlVGFyZ2V0TmFtZV0pIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzLnB1c2goYmFzZVtiYXNlVGFyZ2V0TmFtZV0pXG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBiYXNlRXZlbnRDYWxsYmFjayA9IGJhc2VDYWxsYmFja3NbYmFzZUNhbGxiYWNrTmFtZV1cbiAgICAgICAgICBpZihcbiAgICAgICAgICAgIGJhc2VFdmVudENhbGxiYWNrICYmXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFjay5uYW1lLnNwbGl0KCcgJykubGVuZ3RoID09PSAxXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFjayA9IGJhc2VFdmVudENhbGxiYWNrLmJpbmQodGhpcylcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldHMubGVuZ3RoICYmXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFja1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZVRhcmdldHNcbiAgICAgICAgICAgICAgLmZvckVhY2goKGJhc2VUYXJnZXQpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgc3dpdGNoKG1ldGhvZCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdvbic6XG4gICAgICAgICAgICAgICAgICAgICAgYmFzZVRhcmdldFttZXRob2RdKGJhc2VFdmVudE5hbWUsIGJhc2VFdmVudENhbGxiYWNrKVxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ29mZic6XG4gICAgICAgICAgICAgICAgICAgICAgYmFzZVRhcmdldFttZXRob2RdKGJhc2VFdmVudE5hbWUsIGJhc2VFdmVudENhbGxiYWNrKVxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3JcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleCdcblxuY29uc3QgUm91dGVyID0gY2xhc3MgZXh0ZW5kcyBFdmVudHMge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuYWRkU2V0dGluZ3MoKVxuICAgIHRoaXMuYWRkV2luZG93RXZlbnRzKClcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAncm9vdCcsXG4gICAgJ2hhc2hSb3V0aW5nJyxcbiAgICAnY29udHJvbGxlcicsXG4gICAgJ3JvdXRlcydcbiAgXSB9XG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICB9KVxuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgcHJvdG9jb2woKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgfVxuICBnZXQgaG9zdG5hbWUoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgfVxuICBnZXQgcG9ydCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wb3J0IH1cbiAgZ2V0IHBhdGhuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIH1cbiAgZ2V0IHBhdGgoKSB7XG4gICAgbGV0IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZVxuICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cChbJ14nLCB0aGlzLnJvb3RdLmpvaW4oJycpKSwgJycpXG4gICAgICAuc3BsaXQoJz8nKVxuICAgICAgLnNsaWNlKDAsIDEpXG4gICAgICBbMF1cbiAgICBsZXQgZnJhZ21lbnRzID0gKFxuICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMFxuICAgICkgPyBbXVxuICAgICAgOiAoXG4gICAgICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXlxcLy8pICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9cXC8/LylcbiAgICAgICAgKSA/IFsnLyddXG4gICAgICAgICAgOiBzdHJpbmdcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICByZXR1cm4ge1xuICAgICAgZnJhZ21lbnRzOiBmcmFnbWVudHMsXG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICB9XG4gIH1cbiAgZ2V0IGhhc2goKSB7XG4gICAgbGV0IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoXG4gICAgICAuc2xpY2UoMSlcbiAgICAgIC5zcGxpdCgnPycpXG4gICAgICAuc2xpY2UoMCwgMSlcbiAgICAgIFswXVxuICAgIGxldCBmcmFnbWVudHMgPSAoXG4gICAgICBzdHJpbmcubGVuZ3RoID09PSAwXG4gICAgKSA/IFtdXG4gICAgICA6IChcbiAgICAgICAgICBzdHJpbmcubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9eXFwvLykgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL1xcLz8vKVxuICAgICAgICApID8gWycvJ11cbiAgICAgICAgICA6IHN0cmluZ1xuICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAuc3BsaXQoJy8nKVxuICAgIHJldHVybiB7XG4gICAgICBmcmFnbWVudHM6IGZyYWdtZW50cyxcbiAgICAgIHN0cmluZzogc3RyaW5nLFxuICAgIH1cbiAgfVxuICBnZXQgcGFyYW1ldGVycygpIHtcbiAgICBsZXQgc3RyaW5nXG4gICAgbGV0IGRhdGFcbiAgICBpZih3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvXFw/LykpIHtcbiAgICAgIGxldCBwYXJhbWV0ZXJzID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICAgICAgLnNwbGl0KCc/JylcbiAgICAgICAgLnNsaWNlKC0xKVxuICAgICAgICAuam9pbignJylcbiAgICAgIHN0cmluZyA9IHBhcmFtZXRlcnNcbiAgICAgIGRhdGEgPSBwYXJhbWV0ZXJzXG4gICAgICAgIC5zcGxpdCgnJicpXG4gICAgICAgIC5yZWR1Y2UoKFxuICAgICAgICAgIF9wYXJhbWV0ZXJzLFxuICAgICAgICAgIHBhcmFtZXRlclxuICAgICAgICApID0+IHtcbiAgICAgICAgICBsZXQgcGFyYW1ldGVyRGF0YSA9IHBhcmFtZXRlci5zcGxpdCgnPScpXG4gICAgICAgICAgX3BhcmFtZXRlcnNbcGFyYW1ldGVyRGF0YVswXV0gPSBwYXJhbWV0ZXJEYXRhWzFdXG4gICAgICAgICAgcmV0dXJuIF9wYXJhbWV0ZXJzXG4gICAgICAgIH0sIHt9KVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHJpbmcgPSAnJ1xuICAgICAgZGF0YSA9IHt9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9XG4gIH1cbiAgZ2V0IF9yb290KCkgeyByZXR1cm4gdGhpcy5yb290IHx8ICcvJyB9XG4gIHNldCBfcm9vdChyb290KSB7IHRoaXMucm9vdCA9IHJvb3QgfVxuICBnZXQgX2hhc2hSb3V0aW5nKCkgeyByZXR1cm4gdGhpcy5oYXNoUm91dGluZyB8fCBmYWxzZSB9XG4gIHNldCBfaGFzaFJvdXRpbmcoaGFzaFJvdXRpbmcpIHsgdGhpcy5oYXNoUm91dGluZyA9IGhhc2hSb3V0aW5nIH1cbiAgZ2V0IF9yb3V0ZXMoKSB7IHJldHVybiB0aGlzLnJvdXRlcyB9XG4gIHNldCBfcm91dGVzKHJvdXRlcykgeyB0aGlzLnJvdXRlcyA9IHJvdXRlcyB9XG4gIGdldCBfY29udHJvbGxlcigpIHsgcmV0dXJuIHRoaXMuY29udHJvbGxlciB9XG4gIHNldCBfY29udHJvbGxlcihjb250cm9sbGVyKSB7IHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXIgfVxuICBnZXQgbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvb3Q6IHRoaXMucm9vdCxcbiAgICAgIHBhdGg6IHRoaXMucGF0aCxcbiAgICAgIGhhc2g6IHRoaXMuaGFzaCxcbiAgICAgIHBhcmFtZXRlcnM6IHRoaXMucGFyYW1ldGVycyxcbiAgICB9XG4gIH1cbiAgbWF0Y2hSb3V0ZShyb3V0ZUZyYWdtZW50cywgbG9jYXRpb25GcmFnbWVudHMpIHtcbiAgICBsZXQgcm91dGVNYXRjaGVzID0gbmV3IEFycmF5KClcbiAgICBpZihyb3V0ZUZyYWdtZW50cy5sZW5ndGggPT09IGxvY2F0aW9uRnJhZ21lbnRzLmxlbmd0aCkge1xuICAgICAgcm91dGVNYXRjaGVzID0gcm91dGVGcmFnbWVudHNcbiAgICAgICAgLnJlZHVjZSgoX3JvdXRlTWF0Y2hlcywgcm91dGVGcmFnbWVudCwgcm91dGVGcmFnbWVudEluZGV4KSA9PiB7XG4gICAgICAgICAgbGV0IGxvY2F0aW9uRnJhZ21lbnQgPSBsb2NhdGlvbkZyYWdtZW50c1tyb3V0ZUZyYWdtZW50SW5kZXhdXG4gICAgICAgICAgaWYocm91dGVGcmFnbWVudC5tYXRjaCgvXlxcOi8pKSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2godHJ1ZSlcbiAgICAgICAgICB9IGVsc2UgaWYocm91dGVGcmFnbWVudCA9PT0gbG9jYXRpb25GcmFnbWVudCkge1xuICAgICAgICAgICAgX3JvdXRlTWF0Y2hlcy5wdXNoKHRydWUpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaChmYWxzZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yb3V0ZU1hdGNoZXNcbiAgICAgICAgfSwgW10pXG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRlTWF0Y2hlcy5wdXNoKGZhbHNlKVxuICAgIH1cbiAgICByZXR1cm4gKHJvdXRlTWF0Y2hlcy5pbmRleE9mKGZhbHNlKSA9PT0gLTEpXG4gICAgICA/IHRydWVcbiAgICAgIDogZmFsc2VcbiAgfVxuICBnZXRSb3V0ZShsb2NhdGlvbikge1xuICAgIGxldCByb3V0ZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnJvdXRlcylcbiAgICAgIC5yZWR1Y2UoKFxuICAgICAgICBfcm91dGVzLFxuICAgICAgICBbcm91dGVOYW1lLCByb3V0ZVNldHRpbmdzXSkgPT4ge1xuICAgICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IChcbiAgICAgICAgICAgIHJvdXRlTmFtZS5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICAgIHJvdXRlTmFtZS5tYXRjaCgvXlxcLy8pXG4gICAgICAgICAgKSA/IFtyb3V0ZU5hbWVdXG4gICAgICAgICAgICA6IChyb3V0ZU5hbWUubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICA/IFsnJ11cbiAgICAgICAgICAgICAgOiByb3V0ZU5hbWVcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICAgICAgICByb3V0ZVNldHRpbmdzLmZyYWdtZW50cyA9IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgICAgX3JvdXRlc1tyb3V0ZUZyYWdtZW50cy5qb2luKCcvJyldID0gcm91dGVTZXR0aW5nc1xuICAgICAgICAgIHJldHVybiBfcm91dGVzXG4gICAgICAgIH0sXG4gICAgICAgIHt9XG4gICAgICApXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMocm91dGVzKVxuICAgICAgLmZpbmQoKHJvdXRlKSA9PiB7XG4gICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IHJvdXRlLmZyYWdtZW50c1xuICAgICAgICBsZXQgbG9jYXRpb25GcmFnbWVudHMgPSAodGhpcy5oYXNoUm91dGluZylcbiAgICAgICAgICA/IGxvY2F0aW9uLmhhc2guZnJhZ21lbnRzXG4gICAgICAgICAgOiBsb2NhdGlvbi5wYXRoLmZyYWdtZW50c1xuICAgICAgICBsZXQgbWF0Y2hSb3V0ZSA9IHRoaXMubWF0Y2hSb3V0ZShcbiAgICAgICAgICByb3V0ZUZyYWdtZW50cyxcbiAgICAgICAgICBsb2NhdGlvbkZyYWdtZW50cyxcbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gbWF0Y2hSb3V0ZSA9PT0gdHJ1ZVxuICAgICAgfSlcbiAgfVxuICBwb3BTdGF0ZShldmVudCkge1xuICAgIGxldCBsb2NhdGlvbiA9IHRoaXMubG9jYXRpb25cbiAgICBsZXQgcm91dGUgPSB0aGlzLmdldFJvdXRlKGxvY2F0aW9uKVxuICAgIGxldCByb3V0ZURhdGEgPSB7XG4gICAgICByb3V0ZTogcm91dGUsXG4gICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgfVxuICAgIGlmKHJvdXRlKSB7XG4gICAgICB0aGlzLmNvbnRyb2xsZXJbcm91dGUuY2FsbGJhY2tdKHJvdXRlRGF0YSlcbiAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJywge1xuICAgICAgICBuYW1lOiAnY2hhbmdlJyxcbiAgICAgICAgZGF0YTogcm91dGVEYXRhLFxuICAgICAgfSxcbiAgICAgIHRoaXMpXG4gICAgfVxuICB9XG4gIGFkZFdpbmRvd0V2ZW50cygpIHtcbiAgICB3aW5kb3cub24oJ3BvcHN0YXRlJywgdGhpcy5wb3BTdGF0ZS5iaW5kKHRoaXMpKVxuICB9XG4gIHJlbW92ZVdpbmRvd0V2ZW50cygpIHtcbiAgICB3aW5kb3cub2ZmKCdwb3BzdGF0ZScsIHRoaXMucG9wU3RhdGUuYmluZCh0aGlzKSlcbiAgfVxuICBuYXZpZ2F0ZShwYXRoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFJvdXRlclxuIiwiaW1wb3J0ICcuL1NoaW1zL2V2ZW50cydcbmltcG9ydCBFdmVudHMgZnJvbSAnLi9FdmVudHMvaW5kZXgnXG5pbXBvcnQgQ2hhbm5lbHMgZnJvbSAnLi9DaGFubmVscy9pbmRleCdcbmltcG9ydCAqIGFzIFV0aWxpdGllcyBmcm9tICcuL1V0aWxpdGllcy9pbmRleCdcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4vU2VydmljZS9pbmRleCdcbmltcG9ydCBNb2RlbCBmcm9tICcuL01vZGVsL2luZGV4J1xuaW1wb3J0IENvbGxlY3Rpb24gZnJvbSAnLi9Db2xsZWN0aW9uL2luZGV4J1xuaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3L2luZGV4J1xuaW1wb3J0IENvbnRyb2xsZXIgZnJvbSAnLi9Db250cm9sbGVyL2luZGV4J1xuaW1wb3J0IFJvdXRlciBmcm9tICcuL1JvdXRlci9pbmRleCdcbmNvbnN0IE1WQyA9IHtcbiAgRXZlbnRzLFxuICBDaGFubmVscyxcbiAgVXRpbGl0aWVzLFxuICBTZXJ2aWNlLFxuICBNb2RlbCxcbiAgQ29sbGVjdGlvbixcbiAgVmlldyxcbiAgQ29udHJvbGxlcixcbiAgUm91dGVyLFxufVxuZXhwb3J0IGRlZmF1bHQgTVZDXG4iXSwibmFtZXMiOlsiRXZlbnRUYXJnZXQiLCJwcm90b3R5cGUiLCJvbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJvZmYiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiRXZlbnRzIiwiY29uc3RydWN0b3IiLCJfZXZlbnRzIiwiZXZlbnRzIiwiZ2V0RXZlbnRDYWxsYmFja3MiLCJldmVudE5hbWUiLCJnZXRFdmVudENhbGxiYWNrTmFtZSIsImV2ZW50Q2FsbGJhY2siLCJuYW1lIiwibGVuZ3RoIiwiZ2V0RXZlbnRDYWxsYmFja0dyb3VwIiwiZXZlbnRDYWxsYmFja3MiLCJldmVudENhbGxiYWNrTmFtZSIsImV2ZW50Q2FsbGJhY2tHcm91cCIsInB1c2giLCJhcmd1bWVudHMiLCJPYmplY3QiLCJrZXlzIiwiZW1pdCIsIl9hcmd1bWVudHMiLCJBcnJheSIsImZyb20iLCJzcGxpY2UiLCJldmVudERhdGEiLCJldmVudEFyZ3VtZW50cyIsImVudHJpZXMiLCJmb3JFYWNoIiwiZXZlbnRDYWxsYmFja0dyb3VwTmFtZSIsImRhdGEiLCJfcmVzcG9uc2VzIiwicmVzcG9uc2VzIiwicmVzcG9uc2UiLCJyZXNwb25zZU5hbWUiLCJyZXNwb25zZUNhbGxiYWNrIiwicmVxdWVzdCIsInNsaWNlIiwiY2FsbCIsIl9yZXNwb25zZU5hbWUiLCJfY2hhbm5lbHMiLCJjaGFubmVscyIsImNoYW5uZWwiLCJjaGFubmVsTmFtZSIsIkNoYW5uZWwiLCJVVUlEIiwidXVpZCIsImkiLCJyYW5kb20iLCJNYXRoIiwidG9TdHJpbmciLCJTZXJ2aWNlIiwic2V0dGluZ3MiLCJvcHRpb25zIiwidmFsaWRTZXR0aW5ncyIsIl9zZXR0aW5ncyIsInZhbGlkU2V0dGluZyIsIl9vcHRpb25zIiwidXJsIiwicGFyYW1ldGVycyIsIl91cmwiLCJjb25jYXQiLCJxdWVyeVN0cmluZyIsInBhcmFtZXRlclN0cmluZyIsInJlZHVjZSIsInBhcmFtZXRlclN0cmluZ3MiLCJwYXJhbWV0ZXJLZXkiLCJwYXJhbWV0ZXJWYWx1ZSIsImpvaW4iLCJtZXRob2QiLCJfbWV0aG9kIiwibW9kZSIsIl9tb2RlIiwiY2FjaGUiLCJfY2FjaGUiLCJjcmVkZW50aWFscyIsIl9jcmVkZW50aWFscyIsImhlYWRlcnMiLCJfaGVhZGVycyIsInJlZGlyZWN0IiwiX3JlZGlyZWN0IiwicmVmZXJyZXJQb2xpY3kiLCJfcmVmZXJyZXJQb2xpY3kiLCJib2R5IiwiX2JvZHkiLCJfcGFyYW1ldGVycyIsInByZXZpb3VzQWJvcnRDb250cm9sbGVyIiwiX3ByZXZpb3VzQWJvcnRDb250cm9sbGVyIiwiYWJvcnRDb250cm9sbGVyIiwiX2Fib3J0Q29udHJvbGxlciIsIkFib3J0Q29udHJvbGxlciIsImFib3J0IiwiZmV0Y2giLCJmZXRjaE9wdGlvbnMiLCJfZmV0Y2hPcHRpb25zIiwiZmV0Y2hPcHRpb25OYW1lIiwic2lnbmFsIiwidGhlbiIsImpzb24iLCJjYXRjaCIsImVycm9yIiwidHlwZSIsIm1lc3NhZ2UiLCJNb2RlbCIsIl91dWlkIiwiYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlcyIsImJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSIsInRvZ2dsZUV2ZW50cyIsInNlcnZpY2VzIiwiX3NlcnZpY2VzIiwiX2RhdGEiLCJkZWZhdWx0cyIsIl9kZWZhdWx0cyIsImxvY2FsU3RvcmFnZSIsInN5bmMiLCJkYiIsInNldCIsIl9sb2NhbFN0b3JhZ2UiLCJzdG9yYWdlQ29udGFpbmVyIiwiX2RiIiwiZ2V0SXRlbSIsImVuZHBvaW50IiwiSlNPTiIsInN0cmluZ2lmeSIsInBhcnNlIiwic2V0SXRlbSIsInJlc2V0RXZlbnRzIiwiY2xhc3NUeXBlIiwiYmFzZU5hbWUiLCJiYXNlRXZlbnRzTmFtZSIsImJhc2VDYWxsYmFja3NOYW1lIiwiYmFzZSIsImJhc2VFdmVudHMiLCJiYXNlQ2FsbGJhY2tzIiwiYmFzZUV2ZW50RGF0YSIsImJhc2VDYWxsYmFja05hbWUiLCJiYXNlVGFyZ2V0TmFtZSIsImJhc2VFdmVudE5hbWUiLCJzcGxpdCIsImJhc2VUYXJnZXQiLCJiYXNlQ2FsbGJhY2siLCJic2VDYWxsYmFja3MiLCJiYXNlRXZlbnRDYWxsYmFjayIsImNsYXNzVHlwZVRhcmdldCIsImNsYXNzVHlwZUV2ZW50TmFtZSIsImNsYXNzVHlwZUV2ZW50Q2FsbGJhY2siLCJzZXREQiIsImtleSIsInZhbHVlIiwidW5zZXREQiIsInNldERhdGFQcm9wZXJ0eSIsInNpbGVudCIsImRlZmluZVByb3BlcnRpZXMiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImVudW1lcmFibGUiLCJnZXQiLCJ1bnNldERhdGFQcm9wZXJ0eSIsImlzQXJyYXkiLCJ1bnNldCIsIkNvbGxlY3Rpb24iLCJkZWZhdWx0SURBdHRyaWJ1dGUiLCJhZGQiLCJVdGlsaXRpZXMiLCJtb2RlbHMiLCJfbW9kZWxzIiwibW9kZWxzRGF0YSIsIm1vZGVsIiwiX21vZGVsIiwibWFwIiwiZ2V0TW9kZWxJbmRleCIsIm1vZGVsVVVJRCIsIm1vZGVsSW5kZXgiLCJmaW5kIiwiX21vZGVsSW5kZXgiLCJyZW1vdmVNb2RlbEJ5SW5kZXgiLCJhZGRNb2RlbCIsIm1vZGVsRGF0YSIsInNvbWVNb2RlbCIsImV2ZW50IiwicmVtb3ZlIiwiZmlsdGVyIiwicmVzZXQiLCJWaWV3IiwiZWxlbWVudE5hbWUiLCJfZWxlbWVudE5hbWUiLCJlbGVtZW50IiwiX2VsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJzZXRBdHRyaWJ1dGUiLCJlbGVtZW50T2JzZXJ2ZXIiLCJvYnNlcnZlIiwic3VidHJlZSIsImNoaWxkTGlzdCIsIl9lbGVtZW50T2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZWxlbWVudE9ic2VydmUiLCJiaW5kIiwiSFRNTEVsZW1lbnQiLCJfYXR0cmlidXRlcyIsInRlbXBsYXRlIiwiX3RlbXBsYXRlIiwidWlFbGVtZW50cyIsIl91aUVsZW1lbnRzIiwidWlFbGVtZW50RXZlbnRzIiwiX3VpRWxlbWVudEV2ZW50cyIsInVpRWxlbWVudENhbGxiYWNrcyIsIl91aUVsZW1lbnRDYWxsYmFja3MiLCJ1aSIsImNvbnRleHQiLCJfdWkiLCJ1aUVsZW1lbnROYW1lIiwidWlFbGVtZW50UXVlcnkiLCJxdWVyeVJlc3VsdHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaXRlbSIsIkRvY3VtZW50IiwiV2luZG93IiwibXV0YXRpb25SZWNvcmRMaXN0Iiwib2JzZXJ2ZXIiLCJtdXRhdGlvblJlY29yZEluZGV4IiwibXV0YXRpb25SZWNvcmQiLCJhZGRlZE5vZGVzIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyIsInVpS2V5IiwidWlWYWx1ZSIsInVpVmFsdWVHZXQiLCJhZGRlZFVJRWxlbWVudCIsImFkZGVkTm9kZSIsImJpbmRFdmVudFRvRWxlbWVudCIsInRhcmdldFVJRWxlbWVudE5hbWUiLCJpc1RvZ2dsaW5nIiwiZXZlbnRCaW5kTWV0aG9kcyIsImV2ZW50QmluZE1ldGhvZCIsInVpRWxlbWVudEV2ZW50U2V0dGluZ3MiLCJ1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSIsInVpRWxlbWVudEV2ZW50TmFtZSIsIk5vZGVMaXN0IiwidWlFbGVtZW50IiwiYXV0b0luc2VydCIsImluc2VydCIsInBhcmVudCIsImluc2VydEFkamFjZW50RWxlbWVudCIsImF1dG9SZW1vdmUiLCJwYXJlbnRFbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJyZW5kZXIiLCJpbm5lckhUTUwiLCJDb250cm9sbGVyIiwiZW51bWJlcmFibGUiLCJ2YWx1ZXMiLCJiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0ZpcnN0Iiwic3Vic3RyaW5nIiwiYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0IiwiYmFzZVRhcmdldHMiLCJfYmFzZVRhcmdldHMiLCJiYXNlVGFyZ2V0TmFtZVJlZ0V4cFN0cmluZyIsImJhc2VUYXJnZXROYW1lUmVnRXhwIiwiUmVnRXhwIiwibWF0Y2giLCJSb3V0ZXIiLCJhZGRTZXR0aW5ncyIsImFkZFdpbmRvd0V2ZW50cyIsInByb3RvY29sIiwid2luZG93IiwibG9jYXRpb24iLCJob3N0bmFtZSIsInBvcnQiLCJwYXRobmFtZSIsInBhdGgiLCJzdHJpbmciLCJyZXBsYWNlIiwicm9vdCIsImZyYWdtZW50cyIsImhhc2giLCJocmVmIiwicGFyYW1ldGVyIiwicGFyYW1ldGVyRGF0YSIsIl9yb290IiwiX2hhc2hSb3V0aW5nIiwiaGFzaFJvdXRpbmciLCJfcm91dGVzIiwicm91dGVzIiwiX2NvbnRyb2xsZXIiLCJjb250cm9sbGVyIiwibWF0Y2hSb3V0ZSIsInJvdXRlRnJhZ21lbnRzIiwibG9jYXRpb25GcmFnbWVudHMiLCJyb3V0ZU1hdGNoZXMiLCJfcm91dGVNYXRjaGVzIiwicm91dGVGcmFnbWVudCIsInJvdXRlRnJhZ21lbnRJbmRleCIsImxvY2F0aW9uRnJhZ21lbnQiLCJpbmRleE9mIiwiZ2V0Um91dGUiLCJyb3V0ZU5hbWUiLCJyb3V0ZVNldHRpbmdzIiwicm91dGUiLCJwb3BTdGF0ZSIsInJvdXRlRGF0YSIsImNhbGxiYWNrIiwicmVtb3ZlV2luZG93RXZlbnRzIiwibmF2aWdhdGUiLCJNVkMiLCJDaGFubmVscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0VBQUFBLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIsR0FBMkJGLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIsSUFBNEJGLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkUsZ0JBQTdFO0VBQ0FILFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkcsR0FBdEIsR0FBNEJKLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkcsR0FBdEIsSUFBNkJKLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkksbUJBQS9FOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VDREEsTUFBTUMsTUFBTixDQUFhO0VBQ1hDLEVBQUFBLFdBQVcsR0FBRzs7RUFDZCxNQUFJQyxPQUFKLEdBQWM7RUFDWixTQUFLQyxNQUFMLEdBQWMsS0FBS0EsTUFBTCxJQUFlLEVBQTdCO0VBQ0EsV0FBTyxLQUFLQSxNQUFaO0VBQ0Q7O0VBQ0RDLEVBQUFBLGlCQUFpQixDQUFDQyxTQUFELEVBQVk7RUFBRSxXQUFPLEtBQUtILE9BQUwsQ0FBYUcsU0FBYixLQUEyQixFQUFsQztFQUFzQzs7RUFDckVDLEVBQUFBLG9CQUFvQixDQUFDQyxhQUFELEVBQWdCO0VBQ2xDLFdBQVFBLGFBQWEsQ0FBQ0MsSUFBZCxDQUFtQkMsTUFBcEIsR0FDSEYsYUFBYSxDQUFDQyxJQURYLEdBRUgsbUJBRko7RUFHRDs7RUFDREUsRUFBQUEscUJBQXFCLENBQUNDLGNBQUQsRUFBaUJDLGlCQUFqQixFQUFvQztFQUN2RCxXQUFPRCxjQUFjLENBQUNDLGlCQUFELENBQWQsSUFBcUMsRUFBNUM7RUFDRDs7RUFDRGhCLEVBQUFBLEVBQUUsQ0FBQ1MsU0FBRCxFQUFZRSxhQUFaLEVBQTJCO0VBQzNCLFFBQUlJLGNBQWMsR0FBRyxLQUFLUCxpQkFBTCxDQUF1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
