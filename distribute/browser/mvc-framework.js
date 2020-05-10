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
        this.emit('ready', data);
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
          var baseCallback = baseCallbacks[baseCallbackName];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxpdGllcy91dWlkLmpzIiwiLi4vLi4vc291cmNlL01WQy9TZXJ2aWNlL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Nb2RlbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29sbGVjdGlvbi9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVmlldy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29udHJvbGxlci9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvUm91dGVyL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJFdmVudFRhcmdldC5wcm90b3R5cGUub24gPSBFdmVudFRhcmdldC5wcm90b3R5cGUub24gfHwgRXZlbnRUYXJnZXQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXJcclxuRXZlbnRUYXJnZXQucHJvdG90eXBlLm9mZiA9IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vZmYgfHwgRXZlbnRUYXJnZXQucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXJcclxuIiwiY2xhc3MgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9ldmVudHMoKSB7XHJcbiAgICB0aGlzLmV2ZW50cyA9IHRoaXMuZXZlbnRzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5ldmVudHNcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKSB7IHJldHVybiB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSB8fCB7fSB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIChldmVudENhbGxiYWNrLm5hbWUubGVuZ3RoKVxyXG4gICAgICA/IGV2ZW50Q2FsbGJhY2submFtZVxyXG4gICAgICA6ICdhbm9ueW1vdXNGdW5jdGlvbidcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSkge1xyXG4gICAgcmV0dXJuIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSB8fCBbXVxyXG4gIH1cclxuICBvbihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tOYW1lID0gdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tHcm91cCA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSlcclxuICAgIGV2ZW50Q2FsbGJhY2tHcm91cC5wdXNoKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gPSBldmVudENhbGxiYWNrR3JvdXBcclxuICAgIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdID0gZXZlbnRDYWxsYmFja3NcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIG9mZigpIHtcclxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIGNhc2UgMDpcclxuICAgICAgICBkZWxldGUgdGhpcy5ldmVudHNcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2sgPSBhcmd1bWVudHNbMV1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFja05hbWUgPSAodHlwZW9mIGV2ZW50Q2FsbGJhY2sgPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgPyBldmVudENhbGxiYWNrXHJcbiAgICAgICAgICA6IHRoaXMuZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgICAgICBpZih0aGlzLl9ldmVudHNbZXZlbnROYW1lXSkge1xyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdW2V2ZW50Q2FsbGJhY2tOYW1lXVxyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKS5sZW5ndGggPT09IDBcclxuICAgICAgICAgICkgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBlbWl0KCkge1xyXG4gICAgbGV0IF9hcmd1bWVudHMgPSBBcnJheS5mcm9tKGFyZ3VtZW50cylcclxuICAgIGxldCBldmVudE5hbWUgPSBfYXJndW1lbnRzLnNwbGljZSgwLCAxKVswXVxyXG4gICAgbGV0IGV2ZW50RGF0YSA9IF9hcmd1bWVudHMuc3BsaWNlKDAsIDEpWzBdXHJcbiAgICBsZXQgZXZlbnRBcmd1bWVudHMgPSBfYXJndW1lbnRzLnNwbGljZSgwKVxyXG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5nZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpKVxyXG4gICAgICAuZm9yRWFjaCgoW2V2ZW50Q2FsbGJhY2tHcm91cE5hbWUsIGV2ZW50Q2FsbGJhY2tHcm91cF0pID0+IHtcclxuICAgICAgICBldmVudENhbGxiYWNrR3JvdXBcclxuICAgICAgICAgIC5mb3JFYWNoKChldmVudENhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgIGV2ZW50Q2FsbGJhY2soXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogZXZlbnROYW1lLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZXZlbnREYXRhXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAuLi5ldmVudEFyZ3VtZW50c1xyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRzXHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9yZXNwb25zZXMoKSB7XHJcbiAgICB0aGlzLnJlc3BvbnNlcyA9IHRoaXMucmVzcG9uc2VzXHJcbiAgICAgID8gdGhpcy5yZXNwb25zZXNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMucmVzcG9uc2VzXHJcbiAgfVxyXG4gIHJlc3BvbnNlKHJlc3BvbnNlTmFtZSwgcmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgaWYgKHJlc3BvbnNlQ2FsbGJhY2spIHtcclxuICAgICAgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0gPSByZXNwb25zZUNhbGxiYWNrXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlXVxyXG4gICAgfVxyXG4gIH1cclxuICByZXF1ZXN0KHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYgKHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKSB7XHJcbiAgICAgIHZhciBfYXJndW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5zbGljZSgxKVxyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0oLi4uX2FyZ3VtZW50cylcclxuICAgIH1cclxuICB9XHJcbiAgb2ZmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYgKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAodmFyIFtfcmVzcG9uc2VOYW1lXSBvZiBPYmplY3Qua2V5cyh0aGlzLl9yZXNwb25zZXMpKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tfcmVzcG9uc2VOYW1lXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBDaGFubmVsIGZyb20gJy4vQ2hhbm5lbC9pbmRleCdcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2NoYW5uZWxzKCkge1xyXG4gICAgdGhpcy5jaGFubmVscyA9IHRoaXMuY2hhbm5lbHNcclxuICAgICAgPyB0aGlzLmNoYW5uZWxzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmNoYW5uZWxzXHJcbiAgfVxyXG4gIGNoYW5uZWwoY2hhbm5lbE5hbWUpIHtcclxuICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXSA9IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA/IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA6IG5ldyBDaGFubmVsKClcclxuICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbiAgb2ZmKGNoYW5uZWxOYW1lKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFVVSUQoKSB7XHJcbiAgdmFyIHV1aWQgPSBcIlwiLCBpLCByYW5kb21cclxuICBmb3IgKGkgPSAwOyBpIDwgMzI7IGkrKykge1xyXG4gICAgcmFuZG9tID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMFxyXG5cclxuICAgIGlmIChpID09IDggfHwgaSA9PSAxMiB8fCBpID09IDE2IHx8IGkgPT0gMjApIHtcclxuICAgICAgdXVpZCArPSBcIi1cIlxyXG4gICAgfVxyXG4gICAgdXVpZCArPSAoaSA9PSAxMiA/IDQgOiAoaSA9PSAxNiA/IChyYW5kb20gJiAzIHwgOCkgOiByYW5kb20pKS50b1N0cmluZygxNilcclxuICB9XHJcbiAgcmV0dXJuIHV1aWRcclxufVxyXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleCdcblxuY2xhc3MgU2VydmljZSBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ3VybCcsXG4gICAgJ21ldGhvZCcsXG4gICAgJ21vZGUnLFxuICAgICdjYWNoZScsXG4gICAgJ2NyZWRlbnRpYWxzJyxcbiAgICAnaGVhZGVycycsXG4gICAgJ3BhcmFtZXRlcnMnLFxuICAgICdyZWRpcmVjdCcsXG4gICAgJ3JlZmVycmVyLXBvbGljeScsXG4gICAgJ2JvZHknLFxuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCB1cmwoKSB7XG4gICAgaWYodGhpcy5wYXJhbWV0ZXJzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsLmNvbmNhdCh0aGlzLnF1ZXJ5U3RyaW5nKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsXG4gICAgfVxuICB9XG4gIHNldCB1cmwodXJsKSB7IHRoaXMuX3VybCA9IHVybCB9XG4gIGdldCBxdWVyeVN0cmluZygpIHtcbiAgICBsZXQgcXVlcnlTdHJpbmcgPSAnJ1xuICAgIGlmKHRoaXMucGFyYW1ldGVycykge1xuICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IE9iamVjdC5lbnRyaWVzKHRoaXMucGFyYW1ldGVycylcbiAgICAgICAgLnJlZHVjZSgocGFyYW1ldGVyU3RyaW5ncywgW3BhcmFtZXRlcktleSwgcGFyYW1ldGVyVmFsdWVdKSA9PiB7XG4gICAgICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IHBhcmFtZXRlcktleS5jb25jYXQoJz0nLCBwYXJhbWV0ZXJWYWx1ZSlcbiAgICAgICAgICBwYXJhbWV0ZXJTdHJpbmdzLnB1c2gocGFyYW1ldGVyU3RyaW5nKVxuICAgICAgICAgIHJldHVybiBwYXJhbWV0ZXJTdHJpbmdzXG4gICAgICAgIH0sIFtdKVxuICAgICAgICAgIC5qb2luKCcmJylcbiAgICAgIHF1ZXJ5U3RyaW5nID0gJz8nLmNvbmNhdChwYXJhbWV0ZXJTdHJpbmcpXG4gICAgfVxuICAgIHJldHVybiBxdWVyeVN0cmluZ1xuICB9XG4gIGdldCBtZXRob2QoKSB7IHJldHVybiB0aGlzLl9tZXRob2QgfVxuICBzZXQgbWV0aG9kKG1ldGhvZCkgeyB0aGlzLl9tZXRob2QgPSBtZXRob2QgfVxuICBzZXQgbW9kZShtb2RlKSB7IHRoaXMuX21vZGUgPSBtb2RlIH1cbiAgZ2V0IG1vZGUoKSB7IHJldHVybiB0aGlzLl9tb2RlIH1cbiAgc2V0IGNhY2hlKGNhY2hlKSB7IHRoaXMuX2NhY2hlID0gY2FjaGUgfVxuICBnZXQgY2FjaGUoKSB7IHJldHVybiB0aGlzLl9jYWNoZSB9XG4gIHNldCBjcmVkZW50aWFscyhjcmVkZW50aWFscykgeyB0aGlzLl9jcmVkZW50aWFscyA9IGNyZWRlbnRpYWxzIH1cbiAgZ2V0IGNyZWRlbnRpYWxzKCkgeyByZXR1cm4gdGhpcy5fY3JlZGVudGlhbHMgfVxuICBzZXQgaGVhZGVycyhoZWFkZXJzKSB7IHRoaXMuX2hlYWRlcnMgPSBoZWFkZXJzIH1cbiAgZ2V0IGhlYWRlcnMoKSB7IHJldHVybiB0aGlzLl9oZWFkZXJzIH1cbiAgc2V0IHJlZGlyZWN0KHJlZGlyZWN0KSB7IHRoaXMuX3JlZGlyZWN0ID0gcmVkaXJlY3QgfVxuICBnZXQgcmVkaXJlY3QoKSB7IHJldHVybiB0aGlzLl9yZWRpcmVjdCB9XG4gIHNldCByZWZlcnJlclBvbGljeShyZWZlcnJlclBvbGljeSkgeyB0aGlzLl9yZWZlcnJlclBvbGljeSA9IHJlZmVycmVyUG9saWN5IH1cbiAgZ2V0IHJlZmVycmVyUG9saWN5KCkgeyByZXR1cm4gdGhpcy5fcmVmZXJyZXJQb2xpY3kgfVxuICBzZXQgYm9keShib2R5KSB7IHRoaXMuX2JvZHkgPSBib2R5IH1cbiAgZ2V0IGJvZHkoKSB7IHJldHVybiB0aGlzLl9ib2R5IH1cbiAgZ2V0IHBhcmFtZXRlcnMoKSB7IHJldHVybiB0aGlzLl9wYXJhbWV0ZXJzIHx8IG51bGwgfVxuICBzZXQgcGFyYW1ldGVycyhwYXJhbWV0ZXJzKSB7IHRoaXMuX3BhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzIH1cbiAgZ2V0IHByZXZpb3VzQWJvcnRDb250cm9sbGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9wcmV2aW91c0Fib3J0Q29udHJvbGxlclxuICB9XG4gIHNldCBwcmV2aW91c0Fib3J0Q29udHJvbGxlcihwcmV2aW91c0Fib3J0Q29udHJvbGxlcikgeyB0aGlzLl9wcmV2aW91c0Fib3J0Q29udHJvbGxlciA9IHByZXZpb3VzQWJvcnRDb250cm9sbGVyIH1cbiAgZ2V0IGFib3J0Q29udHJvbGxlcigpIHtcbiAgICBpZighdGhpcy5fYWJvcnRDb250cm9sbGVyKSB7XG4gICAgICB0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyID0gdGhpcy5fYWJvcnRDb250cm9sbGVyXG4gICAgfVxuICAgIHRoaXMuX2Fib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKVxuICAgIHJldHVybiB0aGlzLl9hYm9ydENvbnRyb2xsZXJcbiAgfVxuICBhYm9ydCgpIHtcbiAgICB0aGlzLmFib3J0Q29udHJvbGxlci5hYm9ydCgpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBmZXRjaCgpIHtcbiAgICBjb25zdCBmZXRjaE9wdGlvbnMgPSB0aGlzLnZhbGlkU2V0dGluZ3MucmVkdWNlKChfZmV0Y2hPcHRpb25zLCBmZXRjaE9wdGlvbk5hbWUpID0+IHtcbiAgICAgIGlmKHRoaXNbZmV0Y2hPcHRpb25OYW1lXSkgX2ZldGNoT3B0aW9uc1tmZXRjaE9wdGlvbk5hbWVdID0gdGhpc1tmZXRjaE9wdGlvbk5hbWVdXG4gICAgICByZXR1cm4gX2ZldGNoT3B0aW9uc1xuICAgIH0sIHt9KVxuICAgIGZldGNoT3B0aW9ucy5zaWduYWwgPSB0aGlzLmFib3J0Q29udHJvbGxlci5zaWduYWxcbiAgICBpZih0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyKSB0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyLmFib3J0KClcbiAgICByZXR1cm4gZmV0Y2godGhpcy51cmwsIGZldGNoT3B0aW9ucylcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpXG4gICAgICB9KVxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCdyZWFkeScsIGRhdGEpXG4gICAgICAgIHJldHVybiBkYXRhXG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6IGVycm9yLFxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCB7XG4gICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gZGF0YVxuICAgICAgfSlcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgU2VydmljZVxuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXguanMnXG5pbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi4vVXRpbGl0aWVzL2luZGV4J1xuXG5jb25zdCBNb2RlbCA9IGNsYXNzIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLmVtaXQoXG4gICAgICAncmVhZHknLFxuICAgICAge30sXG4gICAgICB0aGlzLFxuICAgIClcbiAgfVxuICBnZXQgdXVpZCgpIHtcbiAgICBpZighdGhpcy5fdXVpZCkgdGhpcy5fdXVpZCA9IFVVSUQoKVxuICAgIHJldHVybiB0aGlzLl91dWlkXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ2xvY2FsU3RvcmFnZScsXG4gICAgJ2RlZmF1bHRzJyxcbiAgICAnc2VydmljZXMnLFxuICAgICdzZXJ2aWNlRXZlbnRzJyxcbiAgICAnc2VydmljZUNhbGxiYWNrcycsXG4gIF0gfVxuICBnZXQgYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlcygpIHsgcmV0dXJuIFtcbiAgICAnc2VydmljZScsXG4gIF0gfVxuICBnZXQgc2V0dGluZ3MoKSB7IHJldHVybiB0aGlzLl9zZXR0aW5ncyB9XG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3MuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XG4gICAgICBpZihzZXR0aW5nc1t2YWxpZFNldHRpbmddKSB0aGlzW3ZhbGlkU2V0dGluZ10gPSBzZXR0aW5nc1t2YWxpZFNldHRpbmddXG4gICAgfSlcbiAgICB0aGlzLmJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXNcbiAgICAgIC5mb3JFYWNoKChiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUpID0+IHtcbiAgICAgICAgdGhpcy50b2dnbGVFdmVudHMoYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlLCAnb24nKVxuICAgICAgfSlcbiAgfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cbiAgZ2V0IHNlcnZpY2VzKCkge1xuICAgIGlmKCF0aGlzLl9zZXJ2aWNlcykgdGhpcy5fc2VydmljZXMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9zZXJ2aWNlc1xuICB9XG4gIHNldCBzZXJ2aWNlcyhzZXJ2aWNlcykgeyB0aGlzLl9zZXJ2aWNlcyA9IHNlcnZpY2VzIH1cbiAgZ2V0IGRhdGEoKSB7XG4gICAgaWYoIXRoaXMuX2RhdGEpIHRoaXMuX2RhdGEgPSB7fVxuICAgIHJldHVybiB0aGlzLl9kYXRhXG4gIH1cbiAgZ2V0IGRlZmF1bHRzKCkge1xuICAgIGlmKCF0aGlzLl9kZWZhdWx0cykgdGhpcy5fZGVmYXVsdHMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9kZWZhdWx0c1xuICB9XG4gIHNldCBkZWZhdWx0cyhkZWZhdWx0cykge1xuICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlLnN5bmMgPT09IHRydWUpIHtcbiAgICAgIGlmKE9iamVjdC5lbnRyaWVzKHRoaXMuZGIpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLl9kZWZhdWx0cyA9IGRlZmF1bHRzXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9kZWZhdWx0cyA9IHRoaXMuZGJcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgIH1cbiAgICB0aGlzLnNldCh0aGlzLmRlZmF1bHRzKVxuICB9XG4gIGdldCBsb2NhbFN0b3JhZ2UoKSB7IHJldHVybiB0aGlzLl9sb2NhbFN0b3JhZ2UgfHwge30gfVxuICBzZXQgbG9jYWxTdG9yYWdlKGxvY2FsU3RvcmFnZSkgeyB0aGlzLl9sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UgfVxuICBnZXQgc3RvcmFnZUNvbnRhaW5lcigpIHsgcmV0dXJuIHt9IH1cbiAgZ2V0IGRiKCkgeyByZXR1cm4gdGhpcy5fZGIgfVxuICBnZXQgX2RiKCkge1xuICAgIGxldCBkYiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KSB8fCBKU09OLnN0cmluZ2lmeSh0aGlzLnN0b3JhZ2VDb250YWluZXIpXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGIpXG4gIH1cbiAgc2V0IF9kYihkYikge1xuICAgIGRiID0gSlNPTi5zdHJpbmdpZnkoZGIpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQsIGRiKVxuICB9XG4gIHJlc2V0RXZlbnRzKGNsYXNzVHlwZSkge1xuICAgIFtcbiAgICAgICdvZmYnLFxuICAgICAgJ29uJ1xuICAgIF0uZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZClcbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKSB7XG4gICAgY29uc3QgYmFzZU5hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdzJylcbiAgICBjb25zdCBiYXNlRXZlbnRzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrc05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKVxuICAgIGNvbnN0IGJhc2UgPSB0aGlzW2Jhc2VOYW1lXVxuICAgIGNvbnN0IGJhc2VFdmVudHMgPSB0aGlzW2Jhc2VFdmVudHNOYW1lXVxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3MgPSB0aGlzW2Jhc2VDYWxsYmFja3NOYW1lXVxuICAgIGlmKFxuICAgICAgYmFzZSAmJlxuICAgICAgYmFzZUV2ZW50cyAmJlxuICAgICAgYmFzZUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgT2JqZWN0LmVudHJpZXMoYmFzZUV2ZW50cylcbiAgICAgICAgLmZvckVhY2goKFtiYXNlRXZlbnREYXRhLCBiYXNlQ2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IFtiYXNlVGFyZ2V0TmFtZSwgYmFzZUV2ZW50TmFtZV0gPSBiYXNlRXZlbnREYXRhLnNwbGl0KCcgJylcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0ID0gYmFzZVtiYXNlVGFyZ2V0TmFtZV1cbiAgICAgICAgICBjb25zdCBiYXNlQ2FsbGJhY2sgPSBiYXNlQ2FsbGJhY2tzW2Jhc2VDYWxsYmFja05hbWVdXG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldCAmJlxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBiYXNlVGFyZ2V0W21ldGhvZF0oYmFzZUV2ZW50TmFtZSwgYmFzZUNhbGxiYWNrKVxuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge31cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0REIoKSB7XG4gICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICB2YXIgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBsZXQgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgZGJba2V5XSA9IHZhbHVlXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHRoaXMuX2RiID0gZGJcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0REIoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZGVsZXRlIHRoaXMuX2RiXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgZGVsZXRlIGRiW2tleV1cbiAgICAgICAgdGhpcy5fZGIgPSBkYlxuICAgICAgICBicmVha1xuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlLCBzaWxlbnQpIHtcbiAgICBpZighdGhpcy5kYXRhW2tleV0pIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMuZGF0YSwge1xuICAgICAgICBbJ18nLmNvbmNhdChrZXkpXToge1xuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgW2tleV06IHtcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzWydfJy5jb25jYXQoa2V5KV0gfSxcbiAgICAgICAgICBzZXQodmFsdWUpIHsgdGhpc1snXycuY29uY2F0KGtleSldID0gdmFsdWUgfVxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5kYXRhW2tleV0gPSB2YWx1ZVxuICAgIGlmKFxuICAgICAgKFxuICAgICAgICB0eXBlb2Ygc2lsZW50ID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICBzaWxlbnQgPT09IGZhbHNlXG4gICAgICApIHx8XG4gICAgICB0eXBlb2Ygc2lsZW50ID09PSAndW5kZWZpbmVkJ1xuICAgICkge1xuICAgICAgdGhpcy5lbWl0KCdzZXQnLmNvbmNhdCgnOicsIGtleSksIHtcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgfSwgdGhpcylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldERhdGFQcm9wZXJ0eShrZXksIHNpbGVudCkge1xuICAgIGlmKHRoaXMuZGF0YVtrZXldKSB7XG4gICAgICBkZWxldGUgdGhpcy5kYXRhW2tleV1cbiAgICB9XG4gICAgaWYoXG4gICAgICAoXG4gICAgICAgIHR5cGVvZiBzaWxlbnQgPT09ICdib29sZWFuJyAmJlxuICAgICAgICBzaWxlbnQgPT09IGZhbHNlXG4gICAgICApIHx8XG4gICAgICB0eXBlb2Ygc2lsZW50ID09PSAndW5kZWZpbmVkJ1xuICAgICkge1xuICAgICAgdGhpcy5lbWl0KCd1bnNldCcuY29uY2F0KCc6JywgYXJndW1lbnRzWzBdKSwgdGhpcylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBnZXQoKSB7XG4gICAgaWYoYXJndW1lbnRzWzBdKSByZXR1cm4gdGhpcy5kYXRhW2FyZ3VtZW50c1swXV1cbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcy5kYXRhKVxuICAgICAgLnJlZHVjZSgoX2RhdGEsIFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBfZGF0YVtrZXldID0gdmFsdWVcbiAgICAgICAgcmV0dXJuIF9kYXRhXG4gICAgICB9LCB7fSlcbiAgfVxuICBzZXQoKSB7XG4gICAgbGV0IGtleSwgdmFsdWUsIHNpbGVudFxuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgIHNpbGVudCA9IGFyZ3VtZW50c1syXVxuICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KVxuICAgIH0gZWxzZSBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICBpZihcbiAgICAgICAgdHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgdHlwZW9mIGFyZ3VtZW50c1sxXSA9PT0gJ2Jvb2xlYW4nXG4gICAgICApIHtcbiAgICAgICAgc2lsZW50ID0gYXJndW1lbnRzWzFdXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pXG4gICAgICB9XG4gICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy5zZXREQihhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSlcbiAgICB9IGVsc2UgaWYoXG4gICAgICBhcmd1bWVudHMubGVuZ3RoID09PSAxICYmXG4gICAgICAhQXJyYXkuaXNBcnJheShhcmd1bWVudHNbMF0pICYmXG4gICAgICB0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnb2JqZWN0J1xuICAgICkge1xuICAgICAgT2JqZWN0LmVudHJpZXMoYXJndW1lbnRzWzBdKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSlcbiAgICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIHRoaXMuc2V0REIoa2V5LCB2YWx1ZSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuZW1pdCgnc2V0JywgdGhpcy5kYXRhLCB0aGlzKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXQoKSB7XG4gICAgbGV0IHNpbGVudFxuICAgIGlmKFxuICAgICAgYXJndW1lbnRzLmxlbmd0aCA9PT0gMlxuICAgICkge1xuICAgICAgc2lsZW50ID0gYXJndW1lbnRzWzFdXG4gICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGFyZ3VtZW50c1swXSwgc2lsZW50KVxuICAgIH0gZWxzZSBpZihcbiAgICAgIGFyZ3VtZW50cy5sZW5ndGggPT09IDFcbiAgICApIHtcbiAgICAgIGlmKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdib29sZWFuJykge1xuICAgICAgICBzaWxlbnQgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5kYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSwgc2lsZW50KVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBPYmplY3Qua2V5cyh0aGlzLmRhdGEpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICB0aGlzLnVuc2V0RGF0YVByb3BlcnR5KGtleSlcbiAgICAgIH0pXG4gICAgfVxuICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlKSB0aGlzLnVuc2V0REIoa2V5KVxuICAgIHRoaXMuZW1pdCgndW5zZXQnLCB0aGlzKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgcGFyc2UoZGF0YSA9IHRoaXMuZGF0YSkge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhkYXRhKS5yZWR1Y2UoKF9kYXRhLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgTW9kZWwpIHtcbiAgICAgICAgX2RhdGFba2V5XSA9IHZhbHVlLnBhcnNlKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9kYXRhW2tleV0gPSB2YWx1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIF9kYXRhXG4gICAgfSwge30pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW9kZWxcbiIsImltcG9ydCB7IFVVSUQgfSBmcm9tICcuLi9VdGlsaXRpZXMvaW5kZXguanMnXHJcbmltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xyXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vTW9kZWwvaW5kZXguanMnXHJcblxyXG5jbGFzcyBDb2xsZWN0aW9uIGV4dGVuZHMgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcclxuICAgIHN1cGVyKClcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xyXG4gIH1cclxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcclxuICAgICdpZEF0dHJpYnV0ZScsXHJcbiAgICAnbW9kZWwnLFxyXG4gICAgJ2RlZmF1bHRzJyxcclxuICAgICdzZXJ2aWNlcycsXHJcbiAgICAnc2VydmljZUV2ZW50cycsXHJcbiAgICAnc2VydmljZUNhbGxiYWNrcycsXHJcbiAgICAnbG9jYWxTdG9yYWdlJ1xyXG4gIF0gfVxyXG4gIGdldCBiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzKCkgeyByZXR1cm4gW1xyXG4gICAgJ3NlcnZpY2UnXHJcbiAgXSB9XHJcbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxyXG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xyXG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xyXG4gICAgICBpZihzZXR0aW5nc1t2YWxpZFNldHRpbmddKSB0aGlzW3ZhbGlkU2V0dGluZ10gPSBzZXR0aW5nc1t2YWxpZFNldHRpbmddXHJcbiAgICB9KVxyXG4gICAgdGhpcy5iaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzXHJcbiAgICAgIC5mb3JFYWNoKChiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUpID0+IHtcclxuICAgICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUsICdvbicpXHJcbiAgICAgIH0pXHJcbiAgfVxyXG4gIGdldCBvcHRpb25zKCkge1xyXG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxyXG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcclxuICB9XHJcbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XHJcbiAgZ2V0IHN0b3JhZ2VDb250YWluZXIoKSB7IHJldHVybiBbXSB9XHJcbiAgZ2V0IGRlZmF1bHRJREF0dHJpYnV0ZSgpIHsgcmV0dXJuICdfaWQnIH1cclxuICBnZXQgZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLl9kZWZhdWx0cyB9XHJcbiAgc2V0IGRlZmF1bHRzKGRlZmF1bHRzKSB7XHJcbiAgICB0aGlzLl9kZWZhdWx0cyA9IGRlZmF1bHRzXHJcbiAgICB0aGlzLmFkZChkZWZhdWx0cylcclxuICB9XHJcbiAgZ2V0IHV1aWQoKSB7XHJcbiAgICBpZighdGhpcy5fdXVpZCkgdGhpcy5fdXVpZCA9IFV0aWxpdGllcy5VVUlEKClcclxuICAgIHJldHVybiB0aGlzLl91dWlkXHJcbiAgfVxyXG4gIGdldCBtb2RlbHMoKSB7XHJcbiAgICB0aGlzLl9tb2RlbHMgPSB0aGlzLl9tb2RlbHMgfHwgdGhpcy5zdG9yYWdlQ29udGFpbmVyXHJcbiAgICByZXR1cm4gdGhpcy5fbW9kZWxzXHJcbiAgfVxyXG4gIHNldCBtb2RlbHMobW9kZWxzRGF0YSkgeyB0aGlzLl9tb2RlbHMgPSBtb2RlbHNEYXRhIH1cclxuICBnZXQgbW9kZWwoKSB7IHJldHVybiB0aGlzLl9tb2RlbCB9XHJcbiAgc2V0IG1vZGVsKG1vZGVsKSB7IHRoaXMuX21vZGVsID0gbW9kZWwgfVxyXG4gIGdldCBsb2NhbFN0b3JhZ2UoKSB7IHJldHVybiB0aGlzLl9sb2NhbFN0b3JhZ2UgfVxyXG4gIHNldCBsb2NhbFN0b3JhZ2UobG9jYWxTdG9yYWdlKSB7IHRoaXMuX2xvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XHJcbiAgZ2V0IGRhdGEoKSB7IHJldHVybiB0aGlzLl9kYXRhIH1cclxuICBnZXQgZGF0YSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9tb2RlbHNcclxuICAgICAgLm1hcCgobW9kZWwpID0+IG1vZGVsLnBhcnNlKCkpXHJcbiAgfVxyXG4gIGdldCBkYigpIHsgcmV0dXJuIHRoaXMuX2RiIH1cclxuICBnZXQgZGIoKSB7XHJcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgfHwgSlNPTi5zdHJpbmdpZnkodGhpcy5zdG9yYWdlQ29udGFpbmVyKVxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGIpXHJcbiAgfVxyXG4gIHNldCBkYihkYikge1xyXG4gICAgZGIgPSBKU09OLnN0cmluZ2lmeShkYilcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcclxuICB9XHJcbiAgcmVzZXRFdmVudHMoY2xhc3NUeXBlKSB7XHJcbiAgICBbXHJcbiAgICAgICdvZmYnLFxyXG4gICAgICAnb24nXHJcbiAgICBdLmZvckVhY2goKG1ldGhvZCkgPT4ge1xyXG4gICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZClcclxuICAgIH0pXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICB0b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpIHtcclxuICAgIGNvbnN0IGJhc2VOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgncycpXHJcbiAgICBjb25zdCBiYXNlRXZlbnRzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXHJcbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXHJcbiAgICBjb25zdCBiYXNlID0gdGhpc1tiYXNlTmFtZV1cclxuICAgIGNvbnN0IGJhc2VFdmVudHMgPSB0aGlzW2Jhc2VFdmVudHNOYW1lXVxyXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrcyA9IHRoaXNbYmFzZUNhbGxiYWNrc05hbWVdXHJcbiAgICBpZihcclxuICAgICAgYmFzZSAmJlxyXG4gICAgICBiYXNlRXZlbnRzICYmXHJcbiAgICAgIGJhc2VDYWxsYmFja3NcclxuICAgICkge1xyXG4gICAgICBPYmplY3QuZW50cmllcyhiYXNlRXZlbnRzKVxyXG4gICAgICAgIC5mb3JFYWNoKChbYmFzZUV2ZW50RGF0YSwgYmFzZUNhbGxiYWNrTmFtZV0pID0+IHtcclxuICAgICAgICAgIGNvbnN0IFtiYXNlVGFyZ2V0TmFtZSwgYmFzZUV2ZW50TmFtZV0gPSBiYXNlRXZlbnREYXRhLnNwbGl0KCcgJylcclxuICAgICAgICAgIGNvbnN0IGJhc2VUYXJnZXQgPSBiYXNlW2Jhc2VUYXJnZXROYW1lXVxyXG4gICAgICAgICAgY29uc3QgYmFzZUV2ZW50Q2FsbGJhY2sgPSBiYXNlQ2FsbGJhY2tzW2Jhc2VDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWUgJiZcclxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxyXG4gICAgICAgICAgICBiYXNlVGFyZ2V0ICYmXHJcbiAgICAgICAgICAgIGJhc2VFdmVudENhbGxiYWNrXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICBjbGFzc1R5cGVUYXJnZXRbbWV0aG9kXShjbGFzc1R5cGVFdmVudE5hbWUsIGNsYXNzVHlwZUV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHt9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGdldE1vZGVsSW5kZXgobW9kZWxVVUlEKSB7XHJcbiAgICBsZXQgbW9kZWxJbmRleFxyXG4gICAgdGhpcy5fbW9kZWxzXHJcbiAgICAgIC5maW5kKChfbW9kZWwsIF9tb2RlbEluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYoX21vZGVsICE9PSBudWxsKSB7XHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgX21vZGVsIGluc3RhbmNlb2YgTW9kZWwgJiZcclxuICAgICAgICAgICAgX21vZGVsLl91dWlkID09PSBtb2RlbFVVSURcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICBtb2RlbEluZGV4ID0gX21vZGVsSW5kZXhcclxuICAgICAgICAgICAgcmV0dXJuIF9tb2RlbFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIHJldHVybiBtb2RlbEluZGV4XHJcbiAgfVxyXG4gIHJlbW92ZU1vZGVsQnlJbmRleChtb2RlbEluZGV4KSB7XHJcbiAgICBsZXQgbW9kZWwgPSB0aGlzLl9tb2RlbHMuc3BsaWNlKG1vZGVsSW5kZXgsIDEsIG51bGwpXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdyZW1vdmU6bW9kZWwnLFxyXG4gICAgICBtb2RlbFswXS5wYXJzZSgpLFxyXG4gICAgICB0aGlzLFxyXG4gICAgICBtb2RlbFswXVxyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgYWRkTW9kZWwobW9kZWxEYXRhKSB7XHJcbiAgICBsZXQgbW9kZWxcclxuICAgIGxldCBzb21lTW9kZWwgPSBuZXcgTW9kZWwoKVxyXG4gICAgaWYobW9kZWxEYXRhIGluc3RhbmNlb2YgTW9kZWwpIHtcclxuICAgICAgbW9kZWwgPSBtb2RlbERhdGFcclxuICAgIH0gZWxzZSBpZihcclxuICAgICAgdGhpcy5tb2RlbFxyXG4gICAgKSB7XHJcbiAgICAgIG1vZGVsID0gbmV3IHRoaXMubW9kZWwoKVxyXG4gICAgICBtb2RlbC5zZXQobW9kZWxEYXRhKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbW9kZWwgPSBuZXcgTW9kZWwoKVxyXG4gICAgICBtb2RlbC5zZXQobW9kZWxEYXRhKVxyXG4gICAgfVxyXG4gICAgbW9kZWwub24oXHJcbiAgICAgICdzZXQnLFxyXG4gICAgICAoZXZlbnQsIF9tb2RlbCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZW1pdChcclxuICAgICAgICAgICdjaGFuZ2U6bW9kZWwnLFxyXG4gICAgICAgICAgdGhpcy5wYXJzZSgpLFxyXG4gICAgICAgICAgdGhpcyxcclxuICAgICAgICAgIG1vZGVsLFxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG4gICAgKVxyXG4gICAgdGhpcy5tb2RlbHMucHVzaChtb2RlbClcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ2FkZCcsXHJcbiAgICAgIG1vZGVsLnBhcnNlKCksXHJcbiAgICAgIHRoaXMsXHJcbiAgICAgIG1vZGVsXHJcbiAgICApXHJcbiAgICByZXR1cm4gbW9kZWxcclxuICB9XHJcbiAgYWRkKG1vZGVsRGF0YSkge1xyXG4gICAgaWYoQXJyYXkuaXNBcnJheShtb2RlbERhdGEpKSB7XHJcbiAgICAgIG1vZGVsRGF0YVxyXG4gICAgICAgIC5mb3JFYWNoKChtb2RlbCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5hZGRNb2RlbChtb2RlbClcclxuICAgICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hZGRNb2RlbChtb2RlbERhdGEpXHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy5kYiA9IHRoaXMuZGF0YVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAnY2hhbmdlJyxcclxuICAgICAgdGhpcy5wYXJzZSgpLFxyXG4gICAgICB0aGlzXHJcbiAgICApXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICByZW1vdmUobW9kZWxEYXRhKSB7XHJcbiAgICBpZihcclxuICAgICAgIUFycmF5LmlzQXJyYXkobW9kZWxEYXRhKSAmJlxyXG4gICAgICB0eXBlb2YgbW9kZWxEYXRhID09PSAnb2JqZWN0J1xyXG4gICAgKSB7XHJcbiAgICAgIHZhciBtb2RlbEluZGV4ID0gdGhpcy5nZXRNb2RlbEluZGV4KG1vZGVsRGF0YS51dWlkKVxyXG4gICAgICB0aGlzLnJlbW92ZU1vZGVsQnlJbmRleChtb2RlbEluZGV4KVxyXG4gICAgfSBlbHNlIGlmKEFycmF5LmlzQXJyYXkobW9kZWxEYXRhKSkge1xyXG4gICAgICBtb2RlbERhdGFcclxuICAgICAgICAuZm9yRWFjaCgobW9kZWwpID0+IHtcclxuICAgICAgICAgIHZhciBtb2RlbEluZGV4ID0gdGhpcy5nZXRNb2RlbEluZGV4KG1vZGVsLnV1aWQpXHJcbiAgICAgICAgICB0aGlzLnJlbW92ZU1vZGVsQnlJbmRleChtb2RlbEluZGV4KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICB0aGlzLm1vZGVscyA9IHRoaXMubW9kZWxzXHJcbiAgICAgIC5maWx0ZXIoKG1vZGVsKSA9PiBtb2RlbCAhPT0gbnVsbClcclxuICAgIGlmKHRoaXMuX2xvY2FsU3RvcmFnZSkgdGhpcy5kYiA9IHRoaXMuZGF0YVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAncmVtb3ZlJyxcclxuICAgICAgdGhpcy5wYXJzZSgpLFxyXG4gICAgICB0aGlzXHJcbiAgICApXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICByZXNldCgpIHtcclxuICAgIHRoaXMucmVtb3ZlKHRoaXMuX21vZGVscylcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHBhcnNlKGRhdGEpIHtcclxuICAgIGRhdGEgPSBkYXRhIHx8IHRoaXMuZGF0YSB8fCB0aGlzLnN0b3JhZ2VDb250YWluZXJcclxuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ29sbGVjdGlvblxyXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleC5qcydcblxuY2xhc3MgVmlldyBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ2F0dHJpYnV0ZXMnLFxuICAgICdlbGVtZW50TmFtZScsXG4gICAgJ2VsZW1lbnQnLFxuICAgICdpbnNlcnQnLFxuICAgICd0ZW1wbGF0ZScsXG4gICAgJ3VpRWxlbWVudHMnLFxuICAgICd1aUVsZW1lbnRFdmVudHMnLFxuICAgICd1aUVsZW1lbnRDYWxsYmFja3MnLFxuICAgICdyZW5kZXInXG4gIF0gfVxuICBnZXQgc2V0dGluZ3MoKSB7IHJldHVybiB0aGlzLl9zZXR0aW5ncyB9XG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3MuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XG4gICAgICBpZihzZXR0aW5nc1t2YWxpZFNldHRpbmddKSB0aGlzW3ZhbGlkU2V0dGluZ10gPSBzZXR0aW5nc1t2YWxpZFNldHRpbmddXG4gICAgfSlcbiAgfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cbiAgZ2V0IGVsZW1lbnROYW1lKCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudE5hbWUgfVxuICBzZXQgZWxlbWVudE5hbWUoZWxlbWVudE5hbWUpIHsgdGhpcy5fZWxlbWVudE5hbWUgPSBlbGVtZW50TmFtZSB9XG4gIGdldCBlbGVtZW50KCkge1xuICAgIGlmKCF0aGlzLl9lbGVtZW50KSB7XG4gICAgICB0aGlzLl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLmVsZW1lbnROYW1lKVxuICAgICAgT2JqZWN0LmVudHJpZXModGhpcy5hdHRyaWJ1dGVzKS5mb3JFYWNoKChbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0pID0+IHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSlcbiAgICAgIH0pXG4gICAgICB0aGlzLmVsZW1lbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudCwge1xuICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudFxuICB9XG4gIGdldCBlbGVtZW50T2JzZXJ2ZXIoKSB7XG4gICAgdGhpcy5fZWxlbWVudE9ic2VydmVyID0gdGhpcy5fZWxlbWVudE9ic2VydmVyIHx8IG5ldyBNdXRhdGlvbk9ic2VydmVyKFxuICAgICAgdGhpcy5lbGVtZW50T2JzZXJ2ZS5iaW5kKHRoaXMpXG4gICAgKVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50T2JzZXJ2ZXJcbiAgfVxuICBzZXQgZWxlbWVudChlbGVtZW50KSB7XG4gICAgaWYoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB0aGlzLl9lbGVtZW50ID0gZWxlbWVudFxuICB9XG4gIGdldCBhdHRyaWJ1dGVzKCkgeyByZXR1cm4gdGhpcy5fYXR0cmlidXRlcyB8fCB7fSB9XG4gIHNldCBhdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpIHsgdGhpcy5fYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXMgfVxuICBnZXQgdGVtcGxhdGUoKSB7IHJldHVybiB0aGlzLl90ZW1wbGF0ZSB9XG4gIHNldCB0ZW1wbGF0ZSh0ZW1wbGF0ZSkgeyB0aGlzLl90ZW1wbGF0ZSA9IHRlbXBsYXRlIH1cbiAgZ2V0IHVpRWxlbWVudHMoKSB7IHJldHVybiB0aGlzLl91aUVsZW1lbnRzIHx8IHt9IH1cbiAgc2V0IHVpRWxlbWVudHModWlFbGVtZW50cykge1xuICAgIHRoaXMuX3VpRWxlbWVudHMgPSB1aUVsZW1lbnRzXG4gICAgdGhpcy50b2dnbGVFdmVudHMoKVxuICB9XG4gIGdldCB1aUVsZW1lbnRFdmVudHMoKSB7IHJldHVybiB0aGlzLl91aUVsZW1lbnRFdmVudHMgfHwge30gfVxuICBzZXQgdWlFbGVtZW50RXZlbnRzKHVpRWxlbWVudEV2ZW50cykge1xuICAgIHRoaXMuX3VpRWxlbWVudEV2ZW50cyA9IHVpRWxlbWVudEV2ZW50c1xuICAgIHRoaXMudG9nZ2xlRXZlbnRzKClcbiAgfVxuICBnZXQgdWlFbGVtZW50Q2FsbGJhY2tzKCkgeyByZXR1cm4gdGhpcy5fdWlFbGVtZW50Q2FsbGJhY2tzIHx8IHt9IH1cbiAgc2V0IHVpRWxlbWVudENhbGxiYWNrcyh1aUVsZW1lbnRDYWxsYmFja3MpIHtcbiAgICB0aGlzLl91aUVsZW1lbnRDYWxsYmFja3MgPSB1aUVsZW1lbnRDYWxsYmFja3NcbiAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gIH1cbiAgZ2V0IHVpKCkge1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzXG4gICAgaWYoIXRoaXMuX3VpKSB7XG4gICAgICB0aGlzLl91aSA9IE9iamVjdC5lbnRyaWVzKHRoaXMudWlFbGVtZW50cykucmVkdWNlKChfdWksW3VpRWxlbWVudE5hbWUsIHVpRWxlbWVudFF1ZXJ5XSkgPT4ge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhfdWksIHtcbiAgICAgICAgICBbdWlFbGVtZW50TmFtZV06IHtcbiAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgaWYodHlwZW9mIHVpRWxlbWVudFF1ZXJ5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGxldCBxdWVyeVJlc3VsdHMgPSBjb250ZXh0LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCh1aUVsZW1lbnRRdWVyeSlcbiAgICAgICAgICAgICAgICByZXR1cm4gKHF1ZXJ5UmVzdWx0cy5sZW5ndGggPiAxKSA/IHF1ZXJ5UmVzdWx0cyA6IHF1ZXJ5UmVzdWx0cy5pdGVtKDApXG4gICAgICAgICAgICAgIH0gZWxzZSBpZihcbiAgICAgICAgICAgICAgICB1aUVsZW1lbnRRdWVyeSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICAgICAgICAgICAgdWlFbGVtZW50UXVlcnkgaW5zdGFuY2VvZiBEb2N1bWVudCB8fFxuICAgICAgICAgICAgICAgIHVpRWxlbWVudFF1ZXJ5IGluc3RhbmNlb2YgV2luZG93XG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1aUVsZW1lbnRRdWVyeVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIF91aVxuICAgICAgfSwge30pXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLl91aSwge1xuICAgICAgICAnJGVsZW1lbnQnOiB7XG4gICAgICAgICAgZ2V0KCkgeyByZXR1cm4gY29udGV4dC5lbGVtZW50IH1cbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl91aVxuICB9XG4gIGVsZW1lbnRPYnNlcnZlKG11dGF0aW9uUmVjb3JkTGlzdCwgb2JzZXJ2ZXIpIHtcbiAgICBmb3IobGV0IFttdXRhdGlvblJlY29yZEluZGV4LCBtdXRhdGlvblJlY29yZF0gb2YgT2JqZWN0LmVudHJpZXMobXV0YXRpb25SZWNvcmRMaXN0KSkge1xuICAgICAgc3dpdGNoKG11dGF0aW9uUmVjb3JkLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnY2hpbGRMaXN0JzpcbiAgICAgICAgICBpZihtdXRhdGlvblJlY29yZC5hZGRlZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnModGhpcy51aSkpXG4gICAgICAgICAgICAuZm9yRWFjaCgoW3VpS2V5LCB1aVZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCB1aVZhbHVlR2V0ID0gdWlWYWx1ZS5nZXQoKVxuICAgICAgICAgICAgICBjb25zdCBhZGRlZFVJRWxlbWVudCA9IEFycmF5LmZyb20obXV0YXRpb25SZWNvcmQuYWRkZWROb2RlcykuZmluZCgoYWRkZWROb2RlKSA9PiBhZGRlZE5vZGUgPT09IHVpVmFsdWVHZXQpXG4gICAgICAgICAgICAgIGlmKGFkZGVkVUlFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGVFdmVudHModWlLZXkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGJpbmRFdmVudFRvRWxlbWVudChlbGVtZW50LCBtZXRob2QsIGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFja05hbWUpIHtcbiAgICB0cnkge1xuICAgICAgc3dpdGNoKG1ldGhvZCkge1xuICAgICAgICBjYXNlICdhZGRFdmVudExpc3RlbmVyJzpcbiAgICAgICAgICB0aGlzLnVpRWxlbWVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gPSB0aGlzLnVpRWxlbWVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0uYmluZCh0aGlzKVxuICAgICAgICAgIGVsZW1lbnRbbWV0aG9kXShldmVudE5hbWUsIHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSlcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdyZW1vdmVFdmVudExpc3RlbmVyJzpcbiAgICAgICAgICBlbGVtZW50W21ldGhvZF0oZXZlbnROYW1lLCB0aGlzLnVpRWxlbWVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9IGNhdGNoKGVycm9yKSB7fVxuICB9XG4gIHRvZ2dsZUV2ZW50cyh0YXJnZXRVSUVsZW1lbnROYW1lID0gbnVsbCkge1xuICAgIHRoaXMuaXNUb2dnbGluZyA9IHRydWVcbiAgICBjb25zdCB1aSA9IHRoaXMudWlcbiAgICBjb25zdCBldmVudEJpbmRNZXRob2RzID0gWydyZW1vdmVFdmVudExpc3RlbmVyJywgJ2FkZEV2ZW50TGlzdGVuZXInXVxuICAgIGlmKCF0YXJnZXRVSUVsZW1lbnROYW1lKSB7XG4gICAgICBldmVudEJpbmRNZXRob2RzLmZvckVhY2goKGV2ZW50QmluZE1ldGhvZCkgPT4ge1xuICAgICAgICBPYmplY3QuZW50cmllcyh0aGlzLnVpRWxlbWVudEV2ZW50cykuZm9yRWFjaCgoW3VpRWxlbWVudEV2ZW50U2V0dGluZ3MsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGxldCBbdWlFbGVtZW50TmFtZSwgdWlFbGVtZW50RXZlbnROYW1lXSA9IHVpRWxlbWVudEV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxuICAgICAgICAgIGlmKHVpW3VpRWxlbWVudE5hbWVdIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgICAgICAgIHVpW3VpRWxlbWVudE5hbWVdLmZvckVhY2goKHVpRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmJpbmRFdmVudFRvRWxlbWVudCh1aUVsZW1lbnQsIGV2ZW50QmluZE1ldGhvZCwgdWlFbGVtZW50RXZlbnROYW1lLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIGlmKFxuICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxuICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBEb2N1bWVudCB8fFxuICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBXaW5kb3dcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50VG9FbGVtZW50KHVpW3VpRWxlbWVudE5hbWVdLCBldmVudEJpbmRNZXRob2QsIHVpRWxlbWVudEV2ZW50TmFtZSwgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnRCaW5kTWV0aG9kcy5mb3JFYWNoKChldmVudEJpbmRNZXRob2QpID0+IHtcbiAgICAgICAgY29uc3QgdWlFbGVtZW50RXZlbnRzID0gT2JqZWN0LmVudHJpZXModGhpcy51aUVsZW1lbnRFdmVudHMpLmZvckVhY2goKFt1aUVsZW1lbnRFdmVudFNldHRpbmdzLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZV0pID0+IHtcbiAgICAgICAgICBsZXQgW3VpRWxlbWVudE5hbWUsIHVpRWxlbWVudEV2ZW50TmFtZV0gPSB1aUVsZW1lbnRFdmVudFNldHRpbmdzLnNwbGl0KCcgJylcbiAgICAgICAgICBpZih0YXJnZXRVSUVsZW1lbnROYW1lID09PSB1aUVsZW1lbnROYW1lKSB7XG4gICAgICAgICAgICBpZih1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XG4gICAgICAgICAgICAgIHVpW3VpRWxlbWVudE5hbWVdLmZvckVhY2goKHVpRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50VG9FbGVtZW50KHVpRWxlbWVudCwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIGlmKHVpW3VpRWxlbWVudE5hbWVdIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlbdWlFbGVtZW50TmFtZV0sIGV2ZW50QmluZE1ldGhvZCwgdWlFbGVtZW50RXZlbnROYW1lLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLmlzVG9nZ2xpbmcgPSBmYWxzZVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgYXV0b0luc2VydCgpIHtcbiAgICBpZih0aGlzLmluc2VydCkge1xuICAgICAgY29uc3QgcGFyZW50ID0gKHR5cGVvZiB0aGlzLmluc2VydC5wYXJlbnQgPT09ICdzdHJpbmcnKVxuICAgICAgICA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5pbnNlcnQucGFyZW50KVxuICAgICAgICA6ICh0aGlzLmluc2VydC5wYXJlbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgICA/IHRoaXMuaW5zZXJ0LnBhcmVudFxuICAgICAgICAgIDogbnVsbFxuICAgICAgY29uc3QgbWV0aG9kID0gdGhpcy5pbnNlcnQubWV0aG9kXG4gICAgICBwYXJlbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KG1ldGhvZCwgdGhpcy5lbGVtZW50KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGF1dG9SZW1vdmUoKSB7XG4gICAgaWYodGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICByZW5kZXIoZGF0YSA9IHt9KSB7XG4gICAgaWYodGhpcy50ZW1wbGF0ZSkge1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlKGRhdGEpXG4gICAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGVcbiAgICB9XG4gICAgdGhpcy50b2dnbGVFdmVudHMoKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFZpZXdcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4J1xuXG5jb25zdCBDb250cm9sbGVyID0gY2xhc3MgZXh0ZW5kcyBFdmVudHMge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICB9XG4gIGdldCB2YWxpZFNldHRpbmdzKCkgeyByZXR1cm4gW1xuICAgICdtb2RlbHMnLFxuICAgICdtb2RlbEV2ZW50cycsXG4gICAgJ21vZGVsQ2FsbGJhY2tzJyxcbiAgICAnY29sbGVjdGlvbnMnLFxuICAgICdjb2xsZWN0aW9uRXZlbnRzJyxcbiAgICAnY29sbGVjdGlvbkNhbGxiYWNrcycsXG4gICAgJ3ZpZXdzJyxcbiAgICAndmlld0V2ZW50cycsXG4gICAgJ3ZpZXdDYWxsYmFja3MnLFxuICAgICdjb250cm9sbGVycycsXG4gICAgJ2NvbnRyb2xsZXJFdmVudHMnLFxuICAgICdjb250cm9sbGVyQ2FsbGJhY2tzJyxcbiAgICAncm91dGVycycsXG4gICAgJ3JvdXRlckV2ZW50cycsXG4gICAgJ3JvdXRlckNhbGxiYWNrcycsXG4gIF0gfVxuICBnZXQgYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlcygpIHsgcmV0dXJuIFtcbiAgICAnbW9kZWwnLFxuICAgICd2aWV3JyxcbiAgICAnY29sbGVjdGlvbicsXG4gICAgJ2NvbnRyb2xsZXInLFxuICAgICdyb3V0ZXInLFxuICBdIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCBzZXR0aW5ncygpIHtcbiAgICBpZighdGhpcy5fc2V0dGluZ3MpIHRoaXMuX3NldHRpbmdzID0ge31cbiAgICByZXR1cm4gdGhpcy5fc2V0dGluZ3NcbiAgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzXG4gICAgICAuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XG4gICAgICAgIGlmKHRoaXMuc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgWydfJy5jb25jYXQodmFsaWRTZXR0aW5nKV06IHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWJlcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBbdmFsaWRTZXR0aW5nXToge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNbJ18nLmNvbmNhdCh2YWxpZFNldHRpbmcpXSB9LFxuICAgICAgICAgICAgICAgIHNldCh2YWx1ZSkgeyB0aGlzWydfJy5jb25jYXQodmFsaWRTZXR0aW5nKV0gPSB2YWx1ZSB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIClcbiAgICAgICAgICB0aGlzW3ZhbGlkU2V0dGluZ10gPSB0aGlzLnNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB0aGlzLmJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXNcbiAgICAgIC5mb3JFYWNoKChiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUpID0+IHtcbiAgICAgICAgdGhpcy5yZXNldEV2ZW50cyhiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUpXG4gICAgICB9KVxuICB9XG4gIHJlc2V0RXZlbnRzKGNsYXNzVHlwZSkge1xuICAgIFtcbiAgICAgICdvZmYnLFxuICAgICAgJ29uJ1xuICAgIF0uZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZClcbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKSB7XG4gICAgY29uc3QgYmFzZU5hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdzJylcbiAgICBjb25zdCBiYXNlRXZlbnRzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrc05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKVxuICAgIGNvbnN0IGJhc2UgPSB0aGlzW2Jhc2VOYW1lXSB8fCB7fVxuICAgIGNvbnN0IGJhc2VFdmVudHMgPSB0aGlzW2Jhc2VFdmVudHNOYW1lXSB8fCB7fVxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3MgPSB0aGlzW2Jhc2VDYWxsYmFja3NOYW1lXSB8fCB7fVxuICAgIGlmKFxuICAgICAgT2JqZWN0LnZhbHVlcyhiYXNlKS5sZW5ndGggJiZcbiAgICAgIE9iamVjdC52YWx1ZXMoYmFzZUV2ZW50cykubGVuZ3RoICYmXG4gICAgICBPYmplY3QudmFsdWVzKGJhc2VDYWxsYmFja3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgT2JqZWN0LmVudHJpZXMoYmFzZUV2ZW50cylcbiAgICAgICAgLmZvckVhY2goKFtiYXNlRXZlbnREYXRhLCBiYXNlQ2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IFtiYXNlVGFyZ2V0TmFtZSwgYmFzZUV2ZW50TmFtZV0gPSBiYXNlRXZlbnREYXRhLnNwbGl0KCcgJylcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0ZpcnN0ID0gYmFzZVRhcmdldE5hbWUuc3Vic3RyaW5nKDAsIDEpXG4gICAgICAgICAgY29uc3QgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0ID0gYmFzZVRhcmdldE5hbWUuc3Vic3RyaW5nKGJhc2VUYXJnZXROYW1lLmxlbmd0aCAtIDEpXG4gICAgICAgICAgbGV0IGJhc2VUYXJnZXRzID0gW11cbiAgICAgICAgICBpZihcbiAgICAgICAgICAgIGJhc2VUYXJnZXROYW1lU3Vic3RyaW5nRmlyc3QgPT09ICdbJyAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0ID09PSAnXSdcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzID0gT2JqZWN0LmVudHJpZXMoYmFzZSlcbiAgICAgICAgICAgICAgLnJlZHVjZSgoX2Jhc2VUYXJnZXRzLCBbYmFzZU5hbWUsIGJhc2VUYXJnZXRdKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGJhc2VUYXJnZXROYW1lUmVnRXhwU3RyaW5nID0gYmFzZVRhcmdldE5hbWUuc2xpY2UoMSwgLTEpXG4gICAgICAgICAgICAgICAgbGV0IGJhc2VUYXJnZXROYW1lUmVnRXhwID0gbmV3IFJlZ0V4cChiYXNlVGFyZ2V0TmFtZVJlZ0V4cFN0cmluZylcbiAgICAgICAgICAgICAgICBpZihiYXNlTmFtZS5tYXRjaChiYXNlVGFyZ2V0TmFtZVJlZ0V4cCkpIHtcbiAgICAgICAgICAgICAgICAgIF9iYXNlVGFyZ2V0cy5wdXNoKGJhc2VUYXJnZXQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBfYmFzZVRhcmdldHNcbiAgICAgICAgICAgICAgfSwgW10pXG4gICAgICAgICAgfSBlbHNlIGlmKGJhc2VbYmFzZVRhcmdldE5hbWVdKSB7XG4gICAgICAgICAgICBiYXNlVGFyZ2V0cy5wdXNoKGJhc2VbYmFzZVRhcmdldE5hbWVdKVxuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgYmFzZUV2ZW50Q2FsbGJhY2sgPSBiYXNlQ2FsbGJhY2tzW2Jhc2VDYWxsYmFja05hbWVdXG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFjayAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2submFtZS5zcGxpdCgnICcpLmxlbmd0aCA9PT0gMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2sgPSBiYXNlRXZlbnRDYWxsYmFjay5iaW5kKHRoaXMpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWUgJiZcbiAgICAgICAgICAgIGJhc2VFdmVudE5hbWUgJiZcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzLmxlbmd0aCAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2tcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzXG4gICAgICAgICAgICAgIC5mb3JFYWNoKChiYXNlVGFyZ2V0KSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIHN3aXRjaChtZXRob2QpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnb24nOlxuICAgICAgICAgICAgICAgICAgICAgIGJhc2VUYXJnZXRbbWV0aG9kXShiYXNlRXZlbnROYW1lLCBiYXNlRXZlbnRDYWxsYmFjaylcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdvZmYnOlxuICAgICAgICAgICAgICAgICAgICAgIGJhc2VUYXJnZXRbbWV0aG9kXShiYXNlRXZlbnROYW1lLCBiYXNlRXZlbnRDYWxsYmFjaylcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgQ29udHJvbGxlclxuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXgnXG5cbmNvbnN0IFJvdXRlciA9IGNsYXNzIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLmFkZFNldHRpbmdzKClcbiAgICB0aGlzLmFkZFdpbmRvd0V2ZW50cygpXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ3Jvb3QnLFxuICAgICdoYXNoUm91dGluZycsXG4gICAgJ2NvbnRyb2xsZXInLFxuICAgICdyb3V0ZXMnXG4gIF0gfVxuICBnZXQgc2V0dGluZ3MoKSB7IHJldHVybiB0aGlzLl9zZXR0aW5ncyB9XG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3MuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XG4gICAgICBpZihzZXR0aW5nc1t2YWxpZFNldHRpbmddKSB0aGlzW3ZhbGlkU2V0dGluZ10gPSBzZXR0aW5nc1t2YWxpZFNldHRpbmddXG4gICAgfSlcbiAgfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cbiAgZ2V0IHByb3RvY29sKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnByb3RvY29sIH1cbiAgZ2V0IGhvc3RuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lIH1cbiAgZ2V0IHBvcnQoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucG9ydCB9XG4gIGdldCBwYXRobmFtZSgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSB9XG4gIGdldCBwYXRoKCkge1xuICAgIGxldCBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWVcbiAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoWydeJywgdGhpcy5yb290XS5qb2luKCcnKSksICcnKVxuICAgICAgLnNwbGl0KCc/JylcbiAgICAgIC5zbGljZSgwLCAxKVxuICAgICAgWzBdXG4gICAgbGV0IGZyYWdtZW50cyA9IChcbiAgICAgIHN0cmluZy5sZW5ndGggPT09IDBcbiAgICApID8gW11cbiAgICAgIDogKFxuICAgICAgICAgIHN0cmluZy5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL15cXC8vKSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXFwvPy8pXG4gICAgICAgICkgPyBbJy8nXVxuICAgICAgICAgIDogc3RyaW5nXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC8kLywgJycpXG4gICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgcmV0dXJuIHtcbiAgICAgIGZyYWdtZW50czogZnJhZ21lbnRzLFxuICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgfVxuICB9XG4gIGdldCBoYXNoKCkge1xuICAgIGxldCBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uaGFzaFxuICAgICAgLnNsaWNlKDEpXG4gICAgICAuc3BsaXQoJz8nKVxuICAgICAgLnNsaWNlKDAsIDEpXG4gICAgICBbMF1cbiAgICBsZXQgZnJhZ21lbnRzID0gKFxuICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMFxuICAgICkgPyBbXVxuICAgICAgOiAoXG4gICAgICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXlxcLy8pICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9cXC8/LylcbiAgICAgICAgKSA/IFsnLyddXG4gICAgICAgICAgOiBzdHJpbmdcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICByZXR1cm4ge1xuICAgICAgZnJhZ21lbnRzOiBmcmFnbWVudHMsXG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICB9XG4gIH1cbiAgZ2V0IHBhcmFtZXRlcnMoKSB7XG4gICAgbGV0IHN0cmluZ1xuICAgIGxldCBkYXRhXG4gICAgaWYod2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goL1xcPy8pKSB7XG4gICAgICBsZXQgcGFyYW1ldGVycyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgICAgIC5zcGxpdCgnPycpXG4gICAgICAgIC5zbGljZSgtMSlcbiAgICAgICAgLmpvaW4oJycpXG4gICAgICBzdHJpbmcgPSBwYXJhbWV0ZXJzXG4gICAgICBkYXRhID0gcGFyYW1ldGVyc1xuICAgICAgICAuc3BsaXQoJyYnKVxuICAgICAgICAucmVkdWNlKChcbiAgICAgICAgICBfcGFyYW1ldGVycyxcbiAgICAgICAgICBwYXJhbWV0ZXJcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgbGV0IHBhcmFtZXRlckRhdGEgPSBwYXJhbWV0ZXIuc3BsaXQoJz0nKVxuICAgICAgICAgIF9wYXJhbWV0ZXJzW3BhcmFtZXRlckRhdGFbMF1dID0gcGFyYW1ldGVyRGF0YVsxXVxuICAgICAgICAgIHJldHVybiBfcGFyYW1ldGVyc1xuICAgICAgICB9LCB7fSlcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyaW5nID0gJydcbiAgICAgIGRhdGEgPSB7fVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfVxuICB9XG4gIGdldCBfcm9vdCgpIHsgcmV0dXJuIHRoaXMucm9vdCB8fCAnLycgfVxuICBzZXQgX3Jvb3Qocm9vdCkgeyB0aGlzLnJvb3QgPSByb290IH1cbiAgZ2V0IF9oYXNoUm91dGluZygpIHsgcmV0dXJuIHRoaXMuaGFzaFJvdXRpbmcgfHwgZmFsc2UgfVxuICBzZXQgX2hhc2hSb3V0aW5nKGhhc2hSb3V0aW5nKSB7IHRoaXMuaGFzaFJvdXRpbmcgPSBoYXNoUm91dGluZyB9XG4gIGdldCBfcm91dGVzKCkgeyByZXR1cm4gdGhpcy5yb3V0ZXMgfVxuICBzZXQgX3JvdXRlcyhyb3V0ZXMpIHsgdGhpcy5yb3V0ZXMgPSByb3V0ZXMgfVxuICBnZXQgX2NvbnRyb2xsZXIoKSB7IHJldHVybiB0aGlzLmNvbnRyb2xsZXIgfVxuICBzZXQgX2NvbnRyb2xsZXIoY29udHJvbGxlcikgeyB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyIH1cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICByb290OiB0aGlzLnJvb3QsXG4gICAgICBwYXRoOiB0aGlzLnBhdGgsXG4gICAgICBoYXNoOiB0aGlzLmhhc2gsXG4gICAgICBwYXJhbWV0ZXJzOiB0aGlzLnBhcmFtZXRlcnMsXG4gICAgfVxuICB9XG4gIG1hdGNoUm91dGUocm91dGVGcmFnbWVudHMsIGxvY2F0aW9uRnJhZ21lbnRzKSB7XG4gICAgbGV0IHJvdXRlTWF0Y2hlcyA9IG5ldyBBcnJheSgpXG4gICAgaWYocm91dGVGcmFnbWVudHMubGVuZ3RoID09PSBsb2NhdGlvbkZyYWdtZW50cy5sZW5ndGgpIHtcbiAgICAgIHJvdXRlTWF0Y2hlcyA9IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgIC5yZWR1Y2UoKF9yb3V0ZU1hdGNoZXMsIHJvdXRlRnJhZ21lbnQsIHJvdXRlRnJhZ21lbnRJbmRleCkgPT4ge1xuICAgICAgICAgIGxldCBsb2NhdGlvbkZyYWdtZW50ID0gbG9jYXRpb25GcmFnbWVudHNbcm91dGVGcmFnbWVudEluZGV4XVxuICAgICAgICAgIGlmKHJvdXRlRnJhZ21lbnQubWF0Y2goL15cXDovKSkge1xuICAgICAgICAgICAgX3JvdXRlTWF0Y2hlcy5wdXNoKHRydWUpXG4gICAgICAgICAgfSBlbHNlIGlmKHJvdXRlRnJhZ21lbnQgPT09IGxvY2F0aW9uRnJhZ21lbnQpIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaCh0cnVlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2goZmFsc2UpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcm91dGVNYXRjaGVzXG4gICAgICAgIH0sIFtdKVxuICAgIH0gZWxzZSB7XG4gICAgICByb3V0ZU1hdGNoZXMucHVzaChmYWxzZSlcbiAgICB9XG4gICAgcmV0dXJuIChyb3V0ZU1hdGNoZXMuaW5kZXhPZihmYWxzZSkgPT09IC0xKVxuICAgICAgPyB0cnVlXG4gICAgICA6IGZhbHNlXG4gIH1cbiAgZ2V0Um91dGUobG9jYXRpb24pIHtcbiAgICBsZXQgcm91dGVzID0gT2JqZWN0LmVudHJpZXModGhpcy5yb3V0ZXMpXG4gICAgICAucmVkdWNlKChcbiAgICAgICAgX3JvdXRlcyxcbiAgICAgICAgW3JvdXRlTmFtZSwgcm91dGVTZXR0aW5nc10pID0+IHtcbiAgICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSAoXG4gICAgICAgICAgICByb3V0ZU5hbWUubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgICByb3V0ZU5hbWUubWF0Y2goL15cXC8vKVxuICAgICAgICAgICkgPyBbcm91dGVOYW1lXVxuICAgICAgICAgICAgOiAocm91dGVOYW1lLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgPyBbJyddXG4gICAgICAgICAgICAgIDogcm91dGVOYW1lXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgICAgICAgcm91dGVTZXR0aW5ncy5mcmFnbWVudHMgPSByb3V0ZUZyYWdtZW50c1xuICAgICAgICAgIF9yb3V0ZXNbcm91dGVGcmFnbWVudHMuam9pbignLycpXSA9IHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICByZXR1cm4gX3JvdXRlc1xuICAgICAgICB9LFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHJvdXRlcylcbiAgICAgIC5maW5kKChyb3V0ZSkgPT4ge1xuICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSByb3V0ZS5mcmFnbWVudHNcbiAgICAgICAgbGV0IGxvY2F0aW9uRnJhZ21lbnRzID0gKHRoaXMuaGFzaFJvdXRpbmcpXG4gICAgICAgICAgPyBsb2NhdGlvbi5oYXNoLmZyYWdtZW50c1xuICAgICAgICAgIDogbG9jYXRpb24ucGF0aC5mcmFnbWVudHNcbiAgICAgICAgbGV0IG1hdGNoUm91dGUgPSB0aGlzLm1hdGNoUm91dGUoXG4gICAgICAgICAgcm91dGVGcmFnbWVudHMsXG4gICAgICAgICAgbG9jYXRpb25GcmFnbWVudHMsXG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuIG1hdGNoUm91dGUgPT09IHRydWVcbiAgICAgIH0pXG4gIH1cbiAgcG9wU3RhdGUoZXZlbnQpIHtcbiAgICBsZXQgbG9jYXRpb24gPSB0aGlzLmxvY2F0aW9uXG4gICAgbGV0IHJvdXRlID0gdGhpcy5nZXRSb3V0ZShsb2NhdGlvbilcbiAgICBsZXQgcm91dGVEYXRhID0ge1xuICAgICAgcm91dGU6IHJvdXRlLFxuICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgIH1cbiAgICBpZihyb3V0ZSkge1xuICAgICAgdGhpcy5jb250cm9sbGVyW3JvdXRlLmNhbGxiYWNrXShyb3V0ZURhdGEpXG4gICAgICB0aGlzLmVtaXQoJ2NoYW5nZScsIHtcbiAgICAgICAgbmFtZTogJ2NoYW5nZScsXG4gICAgICAgIGRhdGE6IHJvdXRlRGF0YSxcbiAgICAgIH0sXG4gICAgICB0aGlzKVxuICAgIH1cbiAgfVxuICBhZGRXaW5kb3dFdmVudHMoKSB7XG4gICAgd2luZG93Lm9uKCdwb3BzdGF0ZScsIHRoaXMucG9wU3RhdGUuYmluZCh0aGlzKSlcbiAgfVxuICByZW1vdmVXaW5kb3dFdmVudHMoKSB7XG4gICAgd2luZG93Lm9mZigncG9wc3RhdGUnLCB0aGlzLnBvcFN0YXRlLmJpbmQodGhpcykpXG4gIH1cbiAgbmF2aWdhdGUocGF0aCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aFxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBSb3V0ZXJcbiIsImltcG9ydCAnLi9TaGltcy9ldmVudHMnXG5pbXBvcnQgRXZlbnRzIGZyb20gJy4vRXZlbnRzL2luZGV4J1xuaW1wb3J0IENoYW5uZWxzIGZyb20gJy4vQ2hhbm5lbHMvaW5kZXgnXG5pbXBvcnQgKiBhcyBVdGlsaXRpZXMgZnJvbSAnLi9VdGlsaXRpZXMvaW5kZXgnXG5pbXBvcnQgU2VydmljZSBmcm9tICcuL1NlcnZpY2UvaW5kZXgnXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi9Nb2RlbC9pbmRleCdcbmltcG9ydCBDb2xsZWN0aW9uIGZyb20gJy4vQ29sbGVjdGlvbi9pbmRleCdcbmltcG9ydCBWaWV3IGZyb20gJy4vVmlldy9pbmRleCdcbmltcG9ydCBDb250cm9sbGVyIGZyb20gJy4vQ29udHJvbGxlci9pbmRleCdcbmltcG9ydCBSb3V0ZXIgZnJvbSAnLi9Sb3V0ZXIvaW5kZXgnXG5jb25zdCBNVkMgPSB7XG4gIEV2ZW50cyxcbiAgQ2hhbm5lbHMsXG4gIFV0aWxpdGllcyxcbiAgU2VydmljZSxcbiAgTW9kZWwsXG4gIENvbGxlY3Rpb24sXG4gIFZpZXcsXG4gIENvbnRyb2xsZXIsXG4gIFJvdXRlcixcbn1cbmV4cG9ydCBkZWZhdWx0IE1WQ1xuIl0sIm5hbWVzIjpbIkV2ZW50VGFyZ2V0IiwicHJvdG90eXBlIiwib24iLCJhZGRFdmVudExpc3RlbmVyIiwib2ZmIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIkV2ZW50cyIsImNvbnN0cnVjdG9yIiwiX2V2ZW50cyIsImV2ZW50cyIsImdldEV2ZW50Q2FsbGJhY2tzIiwiZXZlbnROYW1lIiwiZ2V0RXZlbnRDYWxsYmFja05hbWUiLCJldmVudENhbGxiYWNrIiwibmFtZSIsImxlbmd0aCIsImdldEV2ZW50Q2FsbGJhY2tHcm91cCIsImV2ZW50Q2FsbGJhY2tzIiwiZXZlbnRDYWxsYmFja05hbWUiLCJldmVudENhbGxiYWNrR3JvdXAiLCJwdXNoIiwiYXJndW1lbnRzIiwiT2JqZWN0Iiwia2V5cyIsImVtaXQiLCJfYXJndW1lbnRzIiwiQXJyYXkiLCJmcm9tIiwic3BsaWNlIiwiZXZlbnREYXRhIiwiZXZlbnRBcmd1bWVudHMiLCJlbnRyaWVzIiwiZm9yRWFjaCIsImV2ZW50Q2FsbGJhY2tHcm91cE5hbWUiLCJkYXRhIiwiX3Jlc3BvbnNlcyIsInJlc3BvbnNlcyIsInJlc3BvbnNlIiwicmVzcG9uc2VOYW1lIiwicmVzcG9uc2VDYWxsYmFjayIsInJlcXVlc3QiLCJzbGljZSIsImNhbGwiLCJfcmVzcG9uc2VOYW1lIiwiX2NoYW5uZWxzIiwiY2hhbm5lbHMiLCJjaGFubmVsIiwiY2hhbm5lbE5hbWUiLCJDaGFubmVsIiwiVVVJRCIsInV1aWQiLCJpIiwicmFuZG9tIiwiTWF0aCIsInRvU3RyaW5nIiwiU2VydmljZSIsInNldHRpbmdzIiwib3B0aW9ucyIsInZhbGlkU2V0dGluZ3MiLCJfc2V0dGluZ3MiLCJ2YWxpZFNldHRpbmciLCJfb3B0aW9ucyIsInVybCIsInBhcmFtZXRlcnMiLCJfdXJsIiwiY29uY2F0IiwicXVlcnlTdHJpbmciLCJwYXJhbWV0ZXJTdHJpbmciLCJyZWR1Y2UiLCJwYXJhbWV0ZXJTdHJpbmdzIiwicGFyYW1ldGVyS2V5IiwicGFyYW1ldGVyVmFsdWUiLCJqb2luIiwibWV0aG9kIiwiX21ldGhvZCIsIm1vZGUiLCJfbW9kZSIsImNhY2hlIiwiX2NhY2hlIiwiY3JlZGVudGlhbHMiLCJfY3JlZGVudGlhbHMiLCJoZWFkZXJzIiwiX2hlYWRlcnMiLCJyZWRpcmVjdCIsIl9yZWRpcmVjdCIsInJlZmVycmVyUG9saWN5IiwiX3JlZmVycmVyUG9saWN5IiwiYm9keSIsIl9ib2R5IiwiX3BhcmFtZXRlcnMiLCJwcmV2aW91c0Fib3J0Q29udHJvbGxlciIsIl9wcmV2aW91c0Fib3J0Q29udHJvbGxlciIsImFib3J0Q29udHJvbGxlciIsIl9hYm9ydENvbnRyb2xsZXIiLCJBYm9ydENvbnRyb2xsZXIiLCJhYm9ydCIsImZldGNoIiwiZmV0Y2hPcHRpb25zIiwiX2ZldGNoT3B0aW9ucyIsImZldGNoT3B0aW9uTmFtZSIsInNpZ25hbCIsInRoZW4iLCJqc29uIiwiY2F0Y2giLCJlcnJvciIsInR5cGUiLCJtZXNzYWdlIiwiTW9kZWwiLCJfdXVpZCIsImJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXMiLCJiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUiLCJ0b2dnbGVFdmVudHMiLCJzZXJ2aWNlcyIsIl9zZXJ2aWNlcyIsIl9kYXRhIiwiZGVmYXVsdHMiLCJfZGVmYXVsdHMiLCJsb2NhbFN0b3JhZ2UiLCJzeW5jIiwiZGIiLCJzZXQiLCJfbG9jYWxTdG9yYWdlIiwic3RvcmFnZUNvbnRhaW5lciIsIl9kYiIsImdldEl0ZW0iLCJlbmRwb2ludCIsIkpTT04iLCJzdHJpbmdpZnkiLCJwYXJzZSIsInNldEl0ZW0iLCJyZXNldEV2ZW50cyIsImNsYXNzVHlwZSIsImJhc2VOYW1lIiwiYmFzZUV2ZW50c05hbWUiLCJiYXNlQ2FsbGJhY2tzTmFtZSIsImJhc2UiLCJiYXNlRXZlbnRzIiwiYmFzZUNhbGxiYWNrcyIsImJhc2VFdmVudERhdGEiLCJiYXNlQ2FsbGJhY2tOYW1lIiwiYmFzZVRhcmdldE5hbWUiLCJiYXNlRXZlbnROYW1lIiwic3BsaXQiLCJiYXNlVGFyZ2V0IiwiYmFzZUNhbGxiYWNrIiwic2V0REIiLCJrZXkiLCJ2YWx1ZSIsInVuc2V0REIiLCJzZXREYXRhUHJvcGVydHkiLCJzaWxlbnQiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJlbnVtZXJhYmxlIiwiZ2V0IiwidW5zZXREYXRhUHJvcGVydHkiLCJpc0FycmF5IiwidW5zZXQiLCJDb2xsZWN0aW9uIiwiZGVmYXVsdElEQXR0cmlidXRlIiwiYWRkIiwiVXRpbGl0aWVzIiwibW9kZWxzIiwiX21vZGVscyIsIm1vZGVsc0RhdGEiLCJtb2RlbCIsIl9tb2RlbCIsIm1hcCIsImJhc2VFdmVudENhbGxiYWNrIiwiY2xhc3NUeXBlVGFyZ2V0IiwiY2xhc3NUeXBlRXZlbnROYW1lIiwiY2xhc3NUeXBlRXZlbnRDYWxsYmFjayIsImdldE1vZGVsSW5kZXgiLCJtb2RlbFVVSUQiLCJtb2RlbEluZGV4IiwiZmluZCIsIl9tb2RlbEluZGV4IiwicmVtb3ZlTW9kZWxCeUluZGV4IiwiYWRkTW9kZWwiLCJtb2RlbERhdGEiLCJzb21lTW9kZWwiLCJldmVudCIsInJlbW92ZSIsImZpbHRlciIsInJlc2V0IiwiVmlldyIsImVsZW1lbnROYW1lIiwiX2VsZW1lbnROYW1lIiwiZWxlbWVudCIsIl9lbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZUtleSIsImF0dHJpYnV0ZVZhbHVlIiwic2V0QXR0cmlidXRlIiwiZWxlbWVudE9ic2VydmVyIiwib2JzZXJ2ZSIsInN1YnRyZWUiLCJjaGlsZExpc3QiLCJfZWxlbWVudE9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsImVsZW1lbnRPYnNlcnZlIiwiYmluZCIsIkhUTUxFbGVtZW50IiwiX2F0dHJpYnV0ZXMiLCJ0ZW1wbGF0ZSIsIl90ZW1wbGF0ZSIsInVpRWxlbWVudHMiLCJfdWlFbGVtZW50cyIsInVpRWxlbWVudEV2ZW50cyIsIl91aUVsZW1lbnRFdmVudHMiLCJ1aUVsZW1lbnRDYWxsYmFja3MiLCJfdWlFbGVtZW50Q2FsbGJhY2tzIiwidWkiLCJjb250ZXh0IiwiX3VpIiwidWlFbGVtZW50TmFtZSIsInVpRWxlbWVudFF1ZXJ5IiwicXVlcnlSZXN1bHRzIiwicXVlcnlTZWxlY3RvckFsbCIsIml0ZW0iLCJEb2N1bWVudCIsIldpbmRvdyIsIm11dGF0aW9uUmVjb3JkTGlzdCIsIm9ic2VydmVyIiwibXV0YXRpb25SZWNvcmRJbmRleCIsIm11dGF0aW9uUmVjb3JkIiwiYWRkZWROb2RlcyIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJ1aUtleSIsInVpVmFsdWUiLCJ1aVZhbHVlR2V0IiwiYWRkZWRVSUVsZW1lbnQiLCJhZGRlZE5vZGUiLCJiaW5kRXZlbnRUb0VsZW1lbnQiLCJ0YXJnZXRVSUVsZW1lbnROYW1lIiwiaXNUb2dnbGluZyIsImV2ZW50QmluZE1ldGhvZHMiLCJldmVudEJpbmRNZXRob2QiLCJ1aUVsZW1lbnRFdmVudFNldHRpbmdzIiwidWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUiLCJ1aUVsZW1lbnRFdmVudE5hbWUiLCJOb2RlTGlzdCIsInVpRWxlbWVudCIsImF1dG9JbnNlcnQiLCJpbnNlcnQiLCJwYXJlbnQiLCJxdWVyeVNlbGVjdG9yIiwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50IiwiYXV0b1JlbW92ZSIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsInJlbmRlciIsImlubmVySFRNTCIsIkNvbnRyb2xsZXIiLCJlbnVtYmVyYWJsZSIsInZhbHVlcyIsImJhc2VUYXJnZXROYW1lU3Vic3RyaW5nRmlyc3QiLCJzdWJzdHJpbmciLCJiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0xhc3QiLCJiYXNlVGFyZ2V0cyIsIl9iYXNlVGFyZ2V0cyIsImJhc2VUYXJnZXROYW1lUmVnRXhwU3RyaW5nIiwiYmFzZVRhcmdldE5hbWVSZWdFeHAiLCJSZWdFeHAiLCJtYXRjaCIsIlJvdXRlciIsImFkZFNldHRpbmdzIiwiYWRkV2luZG93RXZlbnRzIiwicHJvdG9jb2wiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhvc3RuYW1lIiwicG9ydCIsInBhdGhuYW1lIiwicGF0aCIsInN0cmluZyIsInJlcGxhY2UiLCJyb290IiwiZnJhZ21lbnRzIiwiaGFzaCIsImhyZWYiLCJwYXJhbWV0ZXIiLCJwYXJhbWV0ZXJEYXRhIiwiX3Jvb3QiLCJfaGFzaFJvdXRpbmciLCJoYXNoUm91dGluZyIsIl9yb3V0ZXMiLCJyb3V0ZXMiLCJfY29udHJvbGxlciIsImNvbnRyb2xsZXIiLCJtYXRjaFJvdXRlIiwicm91dGVGcmFnbWVudHMiLCJsb2NhdGlvbkZyYWdtZW50cyIsInJvdXRlTWF0Y2hlcyIsIl9yb3V0ZU1hdGNoZXMiLCJyb3V0ZUZyYWdtZW50Iiwicm91dGVGcmFnbWVudEluZGV4IiwibG9jYXRpb25GcmFnbWVudCIsImluZGV4T2YiLCJnZXRSb3V0ZSIsInJvdXRlTmFtZSIsInJvdXRlU2V0dGluZ3MiLCJyb3V0ZSIsInBvcFN0YXRlIiwicm91dGVEYXRhIiwiY2FsbGJhY2siLCJyZW1vdmVXaW5kb3dFdmVudHMiLCJuYXZpZ2F0ZSIsIk1WQyIsIkNoYW5uZWxzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7RUFBQUEsV0FBVyxDQUFDQyxTQUFaLENBQXNCQyxFQUF0QixHQUEyQkYsV0FBVyxDQUFDQyxTQUFaLENBQXNCQyxFQUF0QixJQUE0QkYsV0FBVyxDQUFDQyxTQUFaLENBQXNCRSxnQkFBN0U7RUFDQUgsV0FBVyxDQUFDQyxTQUFaLENBQXNCRyxHQUF0QixHQUE0QkosV0FBVyxDQUFDQyxTQUFaLENBQXNCRyxHQUF0QixJQUE2QkosV0FBVyxDQUFDQyxTQUFaLENBQXNCSSxtQkFBL0U7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUNEQSxNQUFNQyxNQUFOLENBQWE7RUFDWEMsRUFBQUEsV0FBVyxHQUFHOztFQUNkLE1BQUlDLE9BQUosR0FBYztFQUNaLFNBQUtDLE1BQUwsR0FBYyxLQUFLQSxNQUFMLElBQWUsRUFBN0I7RUFDQSxXQUFPLEtBQUtBLE1BQVo7RUFDRDs7RUFDREMsRUFBQUEsaUJBQWlCLENBQUNDLFNBQUQsRUFBWTtFQUFFLFdBQU8sS0FBS0gsT0FBTCxDQUFhRyxTQUFiLEtBQTJCLEVBQWxDO0VBQXNDOztFQUNyRUMsRUFBQUEsb0JBQW9CLENBQUNDLGFBQUQsRUFBZ0I7RUFDbEMsV0FBUUEsYUFBYSxDQUFDQyxJQUFkLENBQW1CQyxNQUFwQixHQUNIRixhQUFhLENBQUNDLElBRFgsR0FFSCxtQkFGSjtFQUdEOztFQUNERSxFQUFBQSxxQkFBcUIsQ0FBQ0MsY0FBRCxFQUFpQkMsaUJBQWpCLEVBQW9DO0VBQ3ZELFdB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
