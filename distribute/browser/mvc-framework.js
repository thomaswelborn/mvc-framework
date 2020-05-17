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
          this.emit('ready', data);
          return data;
        }
      }).catch(error => {
        this.emit('error', error);
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

      if (this.data[key] instanceof Model) {
        this.data[key].on('set', (event, model) => this.emit(event.name, event.data, model)).on('unset', (event, model) => this.emit(event.name, event.data, model));
      }

      if (typeof silent === 'undefined' || silent === false) {
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
        if (this.localStorage.endpoint) this.setDB(arguments[0], arguments[1]);
      } else if (arguments.length === 2) {
        if (typeof arguments[0] === 'object' && typeof arguments[1] === 'boolean') {
          silent = arguments[1];
          Object.entries(arguments[0]).forEach((_ref4) => {
            var [key, value] = _ref4;
            this.setDataProperty(key, value, silent);
          });
        } else {
          this.setDataProperty(arguments[0], arguments[1]);
        }

        if (this.localStorage.endpoint) this.setDB(arguments[0], arguments[1]);
      } else if (arguments.length === 1 && !Array.isArray(arguments[0]) && typeof arguments[0] === 'object') {
        Object.entries(arguments[0]).forEach((_ref5) => {
          var [key, value] = _ref5;
          this.setDataProperty(key, value);
          if (this.localStorage.endpoint) this.setDB(key, value);
        });
      }

      if (!silent) this.emit('set', this.data, this);
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

      if (this.localStorage.endpoint) this.unsetDB(key);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxpdGllcy91dWlkLmpzIiwiLi4vLi4vc291cmNlL01WQy9TZXJ2aWNlL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Nb2RlbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29sbGVjdGlvbi9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVmlldy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29udHJvbGxlci9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvUm91dGVyL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJFdmVudFRhcmdldC5wcm90b3R5cGUub24gPSBFdmVudFRhcmdldC5wcm90b3R5cGUub24gfHwgRXZlbnRUYXJnZXQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXJcclxuRXZlbnRUYXJnZXQucHJvdG90eXBlLm9mZiA9IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vZmYgfHwgRXZlbnRUYXJnZXQucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXJcclxuIiwiY2xhc3MgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9ldmVudHMoKSB7XHJcbiAgICB0aGlzLmV2ZW50cyA9IHRoaXMuZXZlbnRzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5ldmVudHNcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKSB7IHJldHVybiB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSB8fCB7fSB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIChldmVudENhbGxiYWNrLm5hbWUubGVuZ3RoKVxyXG4gICAgICA/IGV2ZW50Q2FsbGJhY2submFtZVxyXG4gICAgICA6ICdhbm9ueW1vdXNGdW5jdGlvbidcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSkge1xyXG4gICAgcmV0dXJuIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSB8fCBbXVxyXG4gIH1cclxuICBvbihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tOYW1lID0gdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tHcm91cCA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSlcclxuICAgIGV2ZW50Q2FsbGJhY2tHcm91cC5wdXNoKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gPSBldmVudENhbGxiYWNrR3JvdXBcclxuICAgIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdID0gZXZlbnRDYWxsYmFja3NcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIG9mZigpIHtcclxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIGNhc2UgMDpcclxuICAgICAgICBkZWxldGUgdGhpcy5ldmVudHNcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2sgPSBhcmd1bWVudHNbMV1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFja05hbWUgPSAodHlwZW9mIGV2ZW50Q2FsbGJhY2sgPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgPyBldmVudENhbGxiYWNrXHJcbiAgICAgICAgICA6IHRoaXMuZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgICAgICBpZih0aGlzLl9ldmVudHNbZXZlbnROYW1lXSkge1xyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdW2V2ZW50Q2FsbGJhY2tOYW1lXVxyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKS5sZW5ndGggPT09IDBcclxuICAgICAgICAgICkgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBlbWl0KCkge1xyXG4gICAgbGV0IF9hcmd1bWVudHMgPSBBcnJheS5mcm9tKGFyZ3VtZW50cylcclxuICAgIGxldCBldmVudE5hbWUgPSBfYXJndW1lbnRzLnNwbGljZSgwLCAxKVswXVxyXG4gICAgbGV0IGV2ZW50RGF0YSA9IF9hcmd1bWVudHMuc3BsaWNlKDAsIDEpWzBdXHJcbiAgICBsZXQgZXZlbnRBcmd1bWVudHMgPSBfYXJndW1lbnRzLnNwbGljZSgwKVxyXG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5nZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpKVxyXG4gICAgICAuZm9yRWFjaCgoW2V2ZW50Q2FsbGJhY2tHcm91cE5hbWUsIGV2ZW50Q2FsbGJhY2tHcm91cF0pID0+IHtcclxuICAgICAgICBldmVudENhbGxiYWNrR3JvdXBcclxuICAgICAgICAgIC5mb3JFYWNoKChldmVudENhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgIGV2ZW50Q2FsbGJhY2soXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogZXZlbnROYW1lLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZXZlbnREYXRhXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAuLi5ldmVudEFyZ3VtZW50c1xyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRzXHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9yZXNwb25zZXMoKSB7XHJcbiAgICB0aGlzLnJlc3BvbnNlcyA9IHRoaXMucmVzcG9uc2VzXHJcbiAgICAgID8gdGhpcy5yZXNwb25zZXNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMucmVzcG9uc2VzXHJcbiAgfVxyXG4gIHJlc3BvbnNlKHJlc3BvbnNlTmFtZSwgcmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgaWYgKHJlc3BvbnNlQ2FsbGJhY2spIHtcclxuICAgICAgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0gPSByZXNwb25zZUNhbGxiYWNrXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlXVxyXG4gICAgfVxyXG4gIH1cclxuICByZXF1ZXN0KHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYgKHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKSB7XHJcbiAgICAgIHZhciBfYXJndW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5zbGljZSgxKVxyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0oLi4uX2FyZ3VtZW50cylcclxuICAgIH1cclxuICB9XHJcbiAgb2ZmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYgKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAodmFyIFtfcmVzcG9uc2VOYW1lXSBvZiBPYmplY3Qua2V5cyh0aGlzLl9yZXNwb25zZXMpKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tfcmVzcG9uc2VOYW1lXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBDaGFubmVsIGZyb20gJy4vQ2hhbm5lbC9pbmRleCdcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2NoYW5uZWxzKCkge1xyXG4gICAgdGhpcy5jaGFubmVscyA9IHRoaXMuY2hhbm5lbHNcclxuICAgICAgPyB0aGlzLmNoYW5uZWxzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmNoYW5uZWxzXHJcbiAgfVxyXG4gIGNoYW5uZWwoY2hhbm5lbE5hbWUpIHtcclxuICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXSA9IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA/IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA6IG5ldyBDaGFubmVsKClcclxuICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbiAgb2ZmKGNoYW5uZWxOYW1lKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFVVSUQoKSB7XHJcbiAgdmFyIHV1aWQgPSBcIlwiLCBpLCByYW5kb21cclxuICBmb3IgKGkgPSAwOyBpIDwgMzI7IGkrKykge1xyXG4gICAgcmFuZG9tID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMFxyXG5cclxuICAgIGlmIChpID09IDggfHwgaSA9PSAxMiB8fCBpID09IDE2IHx8IGkgPT0gMjApIHtcclxuICAgICAgdXVpZCArPSBcIi1cIlxyXG4gICAgfVxyXG4gICAgdXVpZCArPSAoaSA9PSAxMiA/IDQgOiAoaSA9PSAxNiA/IChyYW5kb20gJiAzIHwgOCkgOiByYW5kb20pKS50b1N0cmluZygxNilcclxuICB9XHJcbiAgcmV0dXJuIHV1aWRcclxufVxyXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleCdcblxuY2xhc3MgU2VydmljZSBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ3VybCcsXG4gICAgJ21ldGhvZCcsXG4gICAgJ21vZGUnLFxuICAgICdjYWNoZScsXG4gICAgJ2NyZWRlbnRpYWxzJyxcbiAgICAnaGVhZGVycycsXG4gICAgJ3BhcmFtZXRlcnMnLFxuICAgICdyZWRpcmVjdCcsXG4gICAgJ3JlZmVycmVyLXBvbGljeScsXG4gICAgJ2JvZHknLFxuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCB1cmwoKSB7XG4gICAgaWYodGhpcy5wYXJhbWV0ZXJzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsLmNvbmNhdCh0aGlzLnF1ZXJ5U3RyaW5nKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsXG4gICAgfVxuICB9XG4gIHNldCB1cmwodXJsKSB7IHRoaXMuX3VybCA9IHVybCB9XG4gIGdldCBxdWVyeVN0cmluZygpIHtcbiAgICBsZXQgcXVlcnlTdHJpbmcgPSAnJ1xuICAgIGlmKHRoaXMucGFyYW1ldGVycykge1xuICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IE9iamVjdC5lbnRyaWVzKHRoaXMucGFyYW1ldGVycylcbiAgICAgICAgLnJlZHVjZSgocGFyYW1ldGVyU3RyaW5ncywgW3BhcmFtZXRlcktleSwgcGFyYW1ldGVyVmFsdWVdKSA9PiB7XG4gICAgICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IHBhcmFtZXRlcktleS5jb25jYXQoJz0nLCBwYXJhbWV0ZXJWYWx1ZSlcbiAgICAgICAgICBwYXJhbWV0ZXJTdHJpbmdzLnB1c2gocGFyYW1ldGVyU3RyaW5nKVxuICAgICAgICAgIHJldHVybiBwYXJhbWV0ZXJTdHJpbmdzXG4gICAgICAgIH0sIFtdKVxuICAgICAgICAgIC5qb2luKCcmJylcbiAgICAgIHF1ZXJ5U3RyaW5nID0gJz8nLmNvbmNhdChwYXJhbWV0ZXJTdHJpbmcpXG4gICAgfVxuICAgIHJldHVybiBxdWVyeVN0cmluZ1xuICB9XG4gIGdldCBtZXRob2QoKSB7IHJldHVybiB0aGlzLl9tZXRob2QgfVxuICBzZXQgbWV0aG9kKG1ldGhvZCkgeyB0aGlzLl9tZXRob2QgPSBtZXRob2QgfVxuICBzZXQgbW9kZShtb2RlKSB7IHRoaXMuX21vZGUgPSBtb2RlIH1cbiAgZ2V0IG1vZGUoKSB7IHJldHVybiB0aGlzLl9tb2RlIH1cbiAgc2V0IGNhY2hlKGNhY2hlKSB7IHRoaXMuX2NhY2hlID0gY2FjaGUgfVxuICBnZXQgY2FjaGUoKSB7IHJldHVybiB0aGlzLl9jYWNoZSB9XG4gIHNldCBjcmVkZW50aWFscyhjcmVkZW50aWFscykgeyB0aGlzLl9jcmVkZW50aWFscyA9IGNyZWRlbnRpYWxzIH1cbiAgZ2V0IGNyZWRlbnRpYWxzKCkgeyByZXR1cm4gdGhpcy5fY3JlZGVudGlhbHMgfVxuICBzZXQgaGVhZGVycyhoZWFkZXJzKSB7IHRoaXMuX2hlYWRlcnMgPSBoZWFkZXJzIH1cbiAgZ2V0IGhlYWRlcnMoKSB7IHJldHVybiB0aGlzLl9oZWFkZXJzIH1cbiAgc2V0IHJlZGlyZWN0KHJlZGlyZWN0KSB7IHRoaXMuX3JlZGlyZWN0ID0gcmVkaXJlY3QgfVxuICBnZXQgcmVkaXJlY3QoKSB7IHJldHVybiB0aGlzLl9yZWRpcmVjdCB9XG4gIHNldCByZWZlcnJlclBvbGljeShyZWZlcnJlclBvbGljeSkgeyB0aGlzLl9yZWZlcnJlclBvbGljeSA9IHJlZmVycmVyUG9saWN5IH1cbiAgZ2V0IHJlZmVycmVyUG9saWN5KCkgeyByZXR1cm4gdGhpcy5fcmVmZXJyZXJQb2xpY3kgfVxuICBzZXQgYm9keShib2R5KSB7IHRoaXMuX2JvZHkgPSBib2R5IH1cbiAgZ2V0IGJvZHkoKSB7IHJldHVybiB0aGlzLl9ib2R5IH1cbiAgZ2V0IHBhcmFtZXRlcnMoKSB7IHJldHVybiB0aGlzLl9wYXJhbWV0ZXJzIHx8IG51bGwgfVxuICBzZXQgcGFyYW1ldGVycyhwYXJhbWV0ZXJzKSB7IHRoaXMuX3BhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzIH1cbiAgZ2V0IHByZXZpb3VzQWJvcnRDb250cm9sbGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9wcmV2aW91c0Fib3J0Q29udHJvbGxlclxuICB9XG4gIHNldCBwcmV2aW91c0Fib3J0Q29udHJvbGxlcihwcmV2aW91c0Fib3J0Q29udHJvbGxlcikgeyB0aGlzLl9wcmV2aW91c0Fib3J0Q29udHJvbGxlciA9IHByZXZpb3VzQWJvcnRDb250cm9sbGVyIH1cbiAgZ2V0IGFib3J0Q29udHJvbGxlcigpIHtcbiAgICBpZighdGhpcy5fYWJvcnRDb250cm9sbGVyKSB7XG4gICAgICB0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyID0gdGhpcy5fYWJvcnRDb250cm9sbGVyXG4gICAgfVxuICAgIHRoaXMuX2Fib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKVxuICAgIHJldHVybiB0aGlzLl9hYm9ydENvbnRyb2xsZXJcbiAgfVxuICBhYm9ydCgpIHtcbiAgICB0aGlzLmFib3J0Q29udHJvbGxlci5hYm9ydCgpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBmZXRjaCgpIHtcbiAgICBjb25zdCBmZXRjaE9wdGlvbnMgPSB0aGlzLnZhbGlkU2V0dGluZ3MucmVkdWNlKChfZmV0Y2hPcHRpb25zLCBmZXRjaE9wdGlvbk5hbWUpID0+IHtcbiAgICAgIGlmKHRoaXNbZmV0Y2hPcHRpb25OYW1lXSkgX2ZldGNoT3B0aW9uc1tmZXRjaE9wdGlvbk5hbWVdID0gdGhpc1tmZXRjaE9wdGlvbk5hbWVdXG4gICAgICByZXR1cm4gX2ZldGNoT3B0aW9uc1xuICAgIH0sIHt9KVxuICAgIGZldGNoT3B0aW9ucy5zaWduYWwgPSB0aGlzLmFib3J0Q29udHJvbGxlci5zaWduYWxcbiAgICBpZih0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyKSB0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyLmFib3J0KClcbiAgICByZXR1cm4gZmV0Y2godGhpcy51cmwsIGZldGNoT3B0aW9ucylcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgaWYoXG4gICAgICAgICAgZGF0YS5jb2RlID49IDQwMCAmJlxuICAgICAgICAgIGRhdGEuY29kZSA8PSA0OTlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhyb3cgZGF0YVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZW1pdCgncmVhZHknLCBkYXRhKVxuICAgICAgICAgIHJldHVybiBkYXRhXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlcnJvcilcbiAgICAgICAgcmV0dXJuIGVycm9yXG4gICAgICB9KVxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBTZXJ2aWNlXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleC5qcydcbmltcG9ydCB7IFVVSUQgfSBmcm9tICcuLi9VdGlsaXRpZXMvaW5kZXgnXG5cbmNvbnN0IE1vZGVsID0gY2xhc3MgZXh0ZW5kcyBFdmVudHMge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuZW1pdChcbiAgICAgICdyZWFkeScsXG4gICAgICB7fSxcbiAgICAgIHRoaXMsXG4gICAgKVxuICB9XG4gIGdldCB1dWlkKCkge1xuICAgIGlmKCF0aGlzLl91dWlkKSB0aGlzLl91dWlkID0gVVVJRCgpXG4gICAgcmV0dXJuIHRoaXMuX3V1aWRcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAnbG9jYWxTdG9yYWdlJyxcbiAgICAnZGVmYXVsdHMnLFxuICAgICdzZXJ2aWNlcycsXG4gICAgJ3NlcnZpY2VFdmVudHMnLFxuICAgICdzZXJ2aWNlQ2FsbGJhY2tzJyxcbiAgXSB9XG4gIGdldCBiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzKCkgeyByZXR1cm4gW1xuICAgICdzZXJ2aWNlJyxcbiAgXSB9XG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICB9KVxuICAgIHRoaXMuYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlc1xuICAgICAgLmZvckVhY2goKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUsICdvbicpXG4gICAgICB9KVxuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgc2VydmljZXMoKSB7XG4gICAgaWYoIXRoaXMuX3NlcnZpY2VzKSB0aGlzLl9zZXJ2aWNlcyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX3NlcnZpY2VzXG4gIH1cbiAgc2V0IHNlcnZpY2VzKHNlcnZpY2VzKSB7IHRoaXMuX3NlcnZpY2VzID0gc2VydmljZXMgfVxuICBnZXQgZGF0YSgpIHtcbiAgICBpZighdGhpcy5fZGF0YSkgdGhpcy5fZGF0YSA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFcbiAgfVxuICBnZXQgZGVmYXVsdHMoKSB7XG4gICAgaWYoIXRoaXMuX2RlZmF1bHRzKSB0aGlzLl9kZWZhdWx0cyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRzXG4gIH1cbiAgc2V0IGRlZmF1bHRzKGRlZmF1bHRzKSB7XG4gICAgaWYodGhpcy5sb2NhbFN0b3JhZ2Uuc3luYyA9PT0gdHJ1ZSkge1xuICAgICAgaWYoT2JqZWN0LmVudHJpZXModGhpcy5kYikubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRzID0gZGVmYXVsdHNcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRzID0gdGhpcy5kYlxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9kZWZhdWx0cyA9IGRlZmF1bHRzXG4gICAgfVxuICAgIHRoaXMuc2V0KHRoaXMuZGVmYXVsdHMpXG4gIH1cbiAgZ2V0IGxvY2FsU3RvcmFnZSgpIHsgcmV0dXJuIHRoaXMuX2xvY2FsU3RvcmFnZSB8fCB7fSB9XG4gIHNldCBsb2NhbFN0b3JhZ2UobG9jYWxTdG9yYWdlKSB7IHRoaXMuX2xvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XG4gIGdldCBzdG9yYWdlQ29udGFpbmVyKCkgeyByZXR1cm4ge30gfVxuICBnZXQgZGIoKSB7IHJldHVybiB0aGlzLl9kYiB9XG4gIGdldCBfZGIoKSB7XG4gICAgbGV0IGRiID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHx8IEpTT04uc3RyaW5naWZ5KHRoaXMuc3RvcmFnZUNvbnRhaW5lcilcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkYilcbiAgfVxuICBzZXQgX2RiKGRiKSB7XG4gICAgZGIgPSBKU09OLnN0cmluZ2lmeShkYilcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCwgZGIpXG4gIH1cbiAgcmVzZXRFdmVudHMoY2xhc3NUeXBlKSB7XG4gICAgW1xuICAgICAgJ29mZicsXG4gICAgICAnb24nXG4gICAgXS5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB0b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpIHtcbiAgICBjb25zdCBiYXNlTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ3MnKVxuICAgIGNvbnN0IGJhc2VFdmVudHNOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJylcbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXG4gICAgY29uc3QgYmFzZSA9IHRoaXNbYmFzZU5hbWVdXG4gICAgY29uc3QgYmFzZUV2ZW50cyA9IHRoaXNbYmFzZUV2ZW50c05hbWVdXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrcyA9IHRoaXNbYmFzZUNhbGxiYWNrc05hbWVdXG4gICAgaWYoXG4gICAgICBiYXNlICYmXG4gICAgICBiYXNlRXZlbnRzICYmXG4gICAgICBiYXNlQ2FsbGJhY2tzXG4gICAgKSB7XG4gICAgICBPYmplY3QuZW50cmllcyhiYXNlRXZlbnRzKVxuICAgICAgICAuZm9yRWFjaCgoW2Jhc2VFdmVudERhdGEsIGJhc2VDYWxsYmFja05hbWVdKSA9PiB7XG4gICAgICAgICAgbGV0IFtiYXNlVGFyZ2V0TmFtZSwgYmFzZUV2ZW50TmFtZV0gPSBiYXNlRXZlbnREYXRhLnNwbGl0KCcgJylcbiAgICAgICAgICBsZXQgYmFzZVRhcmdldCA9IGJhc2VbYmFzZVRhcmdldE5hbWVdXG4gICAgICAgICAgbGV0IGJhc2VDYWxsYmFjayA9IGJhc2VDYWxsYmFja3NbYmFzZUNhbGxiYWNrTmFtZV1cbiAgICAgICAgICBpZihcbiAgICAgICAgICAgIGJhc2VDYWxsYmFjayAmJlxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrLm5hbWUuc3BsaXQoJyAnKS5sZW5ndGggPT09IDFcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJhc2VDYWxsYmFjayA9IGJhc2VDYWxsYmFjay5iaW5kKHRoaXMpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWUgJiZcbiAgICAgICAgICAgIGJhc2VFdmVudE5hbWUgJiZcbiAgICAgICAgICAgIGJhc2VUYXJnZXQgJiZcbiAgICAgICAgICAgIGJhc2VDYWxsYmFja1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgYmFzZVRhcmdldFttZXRob2RdKGJhc2VFdmVudE5hbWUsIGJhc2VDYWxsYmFjaylcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHt9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHNldERCKCkge1xuICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdmFyIF9hcmd1bWVudHMgPSBPYmplY3QuZW50cmllcyhhcmd1bWVudHNbMF0pXG4gICAgICAgIF9hcmd1bWVudHMuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgZGJba2V5XSA9IHZhbHVlXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgbGV0IHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICBicmVha1xuICAgIH1cbiAgICB0aGlzLl9kYiA9IGRiXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldERCKCkge1xuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9kYlxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGRlbGV0ZSBkYltrZXldXG4gICAgICAgIHRoaXMuX2RiID0gZGJcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KSB7XG4gICAgaWYoIXRoaXMuZGF0YVtrZXldKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLmRhdGEsIHtcbiAgICAgICAgWydfJy5jb25jYXQoa2V5KV06IHtcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIFtrZXldOiB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpc1snXycuY29uY2F0KGtleSldIH0sXG4gICAgICAgICAgc2V0KHZhbHVlKSB7IHRoaXNbJ18nLmNvbmNhdChrZXkpXSA9IHZhbHVlIH1cbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuZGF0YVtrZXldID0gdmFsdWVcbiAgICBpZih0aGlzLmRhdGFba2V5XSBpbnN0YW5jZW9mIE1vZGVsKSB7XG4gICAgICB0aGlzLmRhdGFba2V5XVxuICAgICAgICAub24oJ3NldCcsIChldmVudCwgbW9kZWwpID0+IHRoaXMuZW1pdChldmVudC5uYW1lLCBldmVudC5kYXRhLCBtb2RlbCkpXG4gICAgICAgIC5vbigndW5zZXQnLCAoZXZlbnQsIG1vZGVsKSA9PiB0aGlzLmVtaXQoZXZlbnQubmFtZSwgZXZlbnQuZGF0YSwgbW9kZWwpKVxuICAgIH1cbiAgICBpZihcbiAgICAgIHR5cGVvZiBzaWxlbnQgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICBzaWxlbnQgPT09IGZhbHNlXG4gICAgKSB7XG4gICAgICB0aGlzLmVtaXQoJ3NldCcuY29uY2F0KCc6Jywga2V5KSwge1xuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICB9LCB0aGlzKVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0RGF0YVByb3BlcnR5KGtleSwgc2lsZW50KSB7XG4gICAgaWYodGhpcy5kYXRhW2tleV0pIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmRhdGFba2V5XVxuICAgIH1cbiAgICBpZihcbiAgICAgIChcbiAgICAgICAgdHlwZW9mIHNpbGVudCA9PT0gJ2Jvb2xlYW4nICYmXG4gICAgICAgIHNpbGVudCA9PT0gZmFsc2VcbiAgICAgICkgfHxcbiAgICAgIHR5cGVvZiBzaWxlbnQgPT09ICd1bmRlZmluZWQnXG4gICAgKSB7XG4gICAgICB0aGlzLmVtaXQoJ3Vuc2V0Jy5jb25jYXQoJzonLCBhcmd1bWVudHNbMF0pLCB0aGlzKVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGdldCgpIHtcbiAgICBpZihhcmd1bWVudHNbMF0pIHJldHVybiB0aGlzLmRhdGFbYXJndW1lbnRzWzBdXVxuICAgIHJldHVybiBPYmplY3QuZW50cmllcyh0aGlzLmRhdGEpXG4gICAgICAucmVkdWNlKChfZGF0YSwgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIF9kYXRhW2tleV0gPSB2YWx1ZVxuICAgICAgICByZXR1cm4gX2RhdGFcbiAgICAgIH0sIHt9KVxuICB9XG4gIHNldCgpIHtcbiAgICBsZXQga2V5LCB2YWx1ZSwgc2lsZW50XG4gICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgc2lsZW50ID0gYXJndW1lbnRzWzJdXG4gICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlLCBzaWxlbnQpXG4gICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgdGhpcy5zZXREQihhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSlcbiAgICB9IGVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgaWYoXG4gICAgICAgIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnICYmXG4gICAgICAgIHR5cGVvZiBhcmd1bWVudHNbMV0gPT09ICdib29sZWFuJ1xuICAgICAgKSB7XG4gICAgICAgIHNpbGVudCA9IGFyZ3VtZW50c1sxXVxuICAgICAgICBPYmplY3QuZW50cmllcyhhcmd1bWVudHNbMF0pLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUsIHNpbGVudClcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKVxuICAgICAgfVxuICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHRoaXMuc2V0REIoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pXG4gICAgfSBlbHNlIGlmKFxuICAgICAgYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgIUFycmF5LmlzQXJyYXkoYXJndW1lbnRzWzBdKSAmJlxuICAgICAgdHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ29iamVjdCdcbiAgICApIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0RGF0YVByb3BlcnR5KGtleSwgdmFsdWUpXG4gICAgICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KSB0aGlzLnNldERCKGtleSwgdmFsdWUpXG4gICAgICB9KVxuICAgIH1cbiAgICBpZighc2lsZW50KSB0aGlzLmVtaXQoJ3NldCcsIHRoaXMuZGF0YSwgdGhpcylcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0KCkge1xuICAgIGxldCBzaWxlbnRcbiAgICBpZihcbiAgICAgIGFyZ3VtZW50cy5sZW5ndGggPT09IDJcbiAgICApIHtcbiAgICAgIHNpbGVudCA9IGFyZ3VtZW50c1sxXVxuICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShhcmd1bWVudHNbMF0sIHNpbGVudClcbiAgICB9IGVsc2UgaWYoXG4gICAgICBhcmd1bWVudHMubGVuZ3RoID09PSAxXG4gICAgKSB7XG4gICAgICBpZih0eXBlb2YgYXJndW1lbnRzWzBdID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgc2lsZW50ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuZGF0YSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXksIHNpbGVudClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5kYXRhKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICB9KVxuICAgIH1cbiAgICBpZih0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgdGhpcy51bnNldERCKGtleSlcbiAgICB0aGlzLmVtaXQoJ3Vuc2V0JywgdGhpcylcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHBhcnNlKGRhdGEgPSB0aGlzLmRhdGEpIHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMoZGF0YSkucmVkdWNlKChfZGF0YSwgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICBpZih2YWx1ZSBpbnN0YW5jZW9mIE1vZGVsKSB7XG4gICAgICAgIF9kYXRhW2tleV0gPSB2YWx1ZS5wYXJzZSgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfZGF0YVtrZXldID0gdmFsdWVcbiAgICAgIH1cbiAgICAgIHJldHVybiBfZGF0YVxuICAgIH0sIHt9KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vZGVsXG4iLCJpbXBvcnQgeyBVVUlEIH0gZnJvbSAnLi4vVXRpbGl0aWVzL2luZGV4LmpzJ1xyXG5pbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleC5qcydcclxuaW1wb3J0IE1vZGVsIGZyb20gJy4uL01vZGVsL2luZGV4LmpzJ1xyXG5cclxuY2xhc3MgQ29sbGVjdGlvbiBleHRlbmRzIEV2ZW50cyB7XHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICBzdXBlcigpXHJcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcclxuICB9XHJcbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXHJcbiAgICAnaWRBdHRyaWJ1dGUnLFxyXG4gICAgJ21vZGVsJyxcclxuICAgICdkZWZhdWx0cycsXHJcbiAgICAnc2VydmljZXMnLFxyXG4gICAgJ3NlcnZpY2VFdmVudHMnLFxyXG4gICAgJ3NlcnZpY2VDYWxsYmFja3MnLFxyXG4gICAgJ2xvY2FsU3RvcmFnZSdcclxuICBdIH1cclxuICBnZXQgYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlcygpIHsgcmV0dXJuIFtcclxuICAgICdzZXJ2aWNlJ1xyXG4gIF0gfVxyXG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cclxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcclxuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcclxuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcclxuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxyXG4gICAgfSlcclxuICAgIHRoaXMuYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlc1xyXG4gICAgICAuZm9yRWFjaCgoYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlKSA9PiB7XHJcbiAgICAgICAgdGhpcy50b2dnbGVFdmVudHMoYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlLCAnb24nKVxyXG4gICAgICB9KVxyXG4gIH1cclxuICBnZXQgb3B0aW9ucygpIHtcclxuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cclxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXHJcbiAgfVxyXG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxyXG4gIGdldCBzdG9yYWdlQ29udGFpbmVyKCkgeyByZXR1cm4gW10gfVxyXG4gIGdldCBkZWZhdWx0SURBdHRyaWJ1dGUoKSB7IHJldHVybiAnX2lkJyB9XHJcbiAgZ2V0IGRlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5fZGVmYXVsdHMgfVxyXG4gIHNldCBkZWZhdWx0cyhkZWZhdWx0cykge1xyXG4gICAgdGhpcy5fZGVmYXVsdHMgPSBkZWZhdWx0c1xyXG4gICAgdGhpcy5hZGQoZGVmYXVsdHMpXHJcbiAgfVxyXG4gIGdldCB1dWlkKCkge1xyXG4gICAgaWYoIXRoaXMuX3V1aWQpIHRoaXMuX3V1aWQgPSBVdGlsaXRpZXMuVVVJRCgpXHJcbiAgICByZXR1cm4gdGhpcy5fdXVpZFxyXG4gIH1cclxuICBnZXQgbW9kZWxzKCkge1xyXG4gICAgdGhpcy5fbW9kZWxzID0gdGhpcy5fbW9kZWxzIHx8IHRoaXMuc3RvcmFnZUNvbnRhaW5lclxyXG4gICAgcmV0dXJuIHRoaXMuX21vZGVsc1xyXG4gIH1cclxuICBzZXQgbW9kZWxzKG1vZGVsc0RhdGEpIHsgdGhpcy5fbW9kZWxzID0gbW9kZWxzRGF0YSB9XHJcbiAgZ2V0IG1vZGVsKCkgeyByZXR1cm4gdGhpcy5fbW9kZWwgfVxyXG4gIHNldCBtb2RlbChtb2RlbCkgeyB0aGlzLl9tb2RlbCA9IG1vZGVsIH1cclxuICBnZXQgbG9jYWxTdG9yYWdlKCkgeyByZXR1cm4gdGhpcy5fbG9jYWxTdG9yYWdlIH1cclxuICBzZXQgbG9jYWxTdG9yYWdlKGxvY2FsU3RvcmFnZSkgeyB0aGlzLl9sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UgfVxyXG4gIGdldCBkYXRhKCkgeyByZXR1cm4gdGhpcy5fZGF0YSB9XHJcbiAgZ2V0IGRhdGEoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbW9kZWxzXHJcbiAgICAgIC5tYXAoKG1vZGVsKSA9PiBtb2RlbC5wYXJzZSgpKVxyXG4gIH1cclxuICBnZXQgZGIoKSB7IHJldHVybiB0aGlzLl9kYiB9XHJcbiAgZ2V0IGRiKCkge1xyXG4gICAgbGV0IGRiID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHx8IEpTT04uc3RyaW5naWZ5KHRoaXMuc3RvcmFnZUNvbnRhaW5lcilcclxuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxyXG4gIH1cclxuICBzZXQgZGIoZGIpIHtcclxuICAgIGRiID0gSlNPTi5zdHJpbmdpZnkoZGIpXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCwgZGIpXHJcbiAgfVxyXG4gIHJlc2V0RXZlbnRzKGNsYXNzVHlwZSkge1xyXG4gICAgW1xyXG4gICAgICAnb2ZmJyxcclxuICAgICAgJ29uJ1xyXG4gICAgXS5mb3JFYWNoKChtZXRob2QpID0+IHtcclxuICAgICAgdGhpcy50b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgdG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKSB7XHJcbiAgICBjb25zdCBiYXNlTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ3MnKVxyXG4gICAgY29uc3QgYmFzZUV2ZW50c05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdFdmVudHMnKVxyXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrc05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKVxyXG4gICAgY29uc3QgYmFzZSA9IHRoaXNbYmFzZU5hbWVdXHJcbiAgICBjb25zdCBiYXNlRXZlbnRzID0gdGhpc1tiYXNlRXZlbnRzTmFtZV1cclxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3MgPSB0aGlzW2Jhc2VDYWxsYmFja3NOYW1lXVxyXG4gICAgaWYoXHJcbiAgICAgIGJhc2UgJiZcclxuICAgICAgYmFzZUV2ZW50cyAmJlxyXG4gICAgICBiYXNlQ2FsbGJhY2tzXHJcbiAgICApIHtcclxuICAgICAgT2JqZWN0LmVudHJpZXMoYmFzZUV2ZW50cylcclxuICAgICAgICAuZm9yRWFjaCgoW2Jhc2VFdmVudERhdGEsIGJhc2VDYWxsYmFja05hbWVdKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBbYmFzZVRhcmdldE5hbWUsIGJhc2VFdmVudE5hbWVdID0gYmFzZUV2ZW50RGF0YS5zcGxpdCgnICcpXHJcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0ID0gYmFzZVtiYXNlVGFyZ2V0TmFtZV1cclxuICAgICAgICAgIGNvbnN0IGJhc2VFdmVudENhbGxiYWNrID0gYmFzZUNhbGxiYWNrc1tiYXNlQ2FsbGJhY2tOYW1lXVxyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIGJhc2VUYXJnZXROYW1lICYmXHJcbiAgICAgICAgICAgIGJhc2VFdmVudE5hbWUgJiZcclxuICAgICAgICAgICAgYmFzZVRhcmdldCAmJlxyXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFja1xyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgY2xhc3NUeXBlVGFyZ2V0W21ldGhvZF0oY2xhc3NUeXBlRXZlbnROYW1lLCBjbGFzc1R5cGVFdmVudENhbGxiYWNrKVxyXG4gICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7fVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBnZXRNb2RlbEluZGV4KG1vZGVsVVVJRCkge1xyXG4gICAgbGV0IG1vZGVsSW5kZXhcclxuICAgIHRoaXMuX21vZGVsc1xyXG4gICAgICAuZmluZCgoX21vZGVsLCBfbW9kZWxJbmRleCkgPT4ge1xyXG4gICAgICAgIGlmKF9tb2RlbCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIF9tb2RlbCBpbnN0YW5jZW9mIE1vZGVsICYmXHJcbiAgICAgICAgICAgIF9tb2RlbC5fdXVpZCA9PT0gbW9kZWxVVUlEXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgbW9kZWxJbmRleCA9IF9tb2RlbEluZGV4XHJcbiAgICAgICAgICAgIHJldHVybiBfbW9kZWxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gbW9kZWxJbmRleFxyXG4gIH1cclxuICByZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleCkge1xyXG4gICAgbGV0IG1vZGVsID0gdGhpcy5fbW9kZWxzLnNwbGljZShtb2RlbEluZGV4LCAxLCBudWxsKVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAncmVtb3ZlOm1vZGVsJyxcclxuICAgICAgbW9kZWxbMF0ucGFyc2UoKSxcclxuICAgICAgdGhpcyxcclxuICAgICAgbW9kZWxbMF1cclxuICAgIClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGFkZE1vZGVsKG1vZGVsRGF0YSkge1xyXG4gICAgbGV0IG1vZGVsXHJcbiAgICBsZXQgc29tZU1vZGVsID0gbmV3IE1vZGVsKClcclxuICAgIGlmKG1vZGVsRGF0YSBpbnN0YW5jZW9mIE1vZGVsKSB7XHJcbiAgICAgIG1vZGVsID0gbW9kZWxEYXRhXHJcbiAgICB9IGVsc2UgaWYoXHJcbiAgICAgIHRoaXMubW9kZWxcclxuICAgICkge1xyXG4gICAgICBtb2RlbCA9IG5ldyB0aGlzLm1vZGVsKClcclxuICAgICAgbW9kZWwuc2V0KG1vZGVsRGF0YSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG1vZGVsID0gbmV3IE1vZGVsKClcclxuICAgICAgbW9kZWwuc2V0KG1vZGVsRGF0YSlcclxuICAgIH1cclxuICAgIG1vZGVsLm9uKFxyXG4gICAgICAnc2V0JyxcclxuICAgICAgKGV2ZW50LCBfbW9kZWwpID0+IHtcclxuICAgICAgICB0aGlzLmVtaXQoXHJcbiAgICAgICAgICAnY2hhbmdlOm1vZGVsJyxcclxuICAgICAgICAgIHRoaXMucGFyc2UoKSxcclxuICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICBtb2RlbCxcclxuICAgICAgICApXHJcbiAgICAgIH1cclxuICAgIClcclxuICAgIHRoaXMubW9kZWxzLnB1c2gobW9kZWwpXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdhZGQnLFxyXG4gICAgICBtb2RlbC5wYXJzZSgpLFxyXG4gICAgICB0aGlzLFxyXG4gICAgICBtb2RlbFxyXG4gICAgKVxyXG4gICAgcmV0dXJuIG1vZGVsXHJcbiAgfVxyXG4gIGFkZChtb2RlbERhdGEpIHtcclxuICAgIGlmKEFycmF5LmlzQXJyYXkobW9kZWxEYXRhKSkge1xyXG4gICAgICBtb2RlbERhdGFcclxuICAgICAgICAuZm9yRWFjaCgobW9kZWwpID0+IHtcclxuICAgICAgICAgIHRoaXMuYWRkTW9kZWwobW9kZWwpXHJcbiAgICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYWRkTW9kZWwobW9kZWxEYXRhKVxyXG4gICAgfVxyXG4gICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIHRoaXMuZGIgPSB0aGlzLmRhdGFcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ2NoYW5nZScsXHJcbiAgICAgIHRoaXMucGFyc2UoKSxcclxuICAgICAgdGhpc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcmVtb3ZlKG1vZGVsRGF0YSkge1xyXG4gICAgaWYoXHJcbiAgICAgICFBcnJheS5pc0FycmF5KG1vZGVsRGF0YSkgJiZcclxuICAgICAgdHlwZW9mIG1vZGVsRGF0YSA9PT0gJ29iamVjdCdcclxuICAgICkge1xyXG4gICAgICB2YXIgbW9kZWxJbmRleCA9IHRoaXMuZ2V0TW9kZWxJbmRleChtb2RlbERhdGEudXVpZClcclxuICAgICAgdGhpcy5yZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleClcclxuICAgIH0gZWxzZSBpZihBcnJheS5pc0FycmF5KG1vZGVsRGF0YSkpIHtcclxuICAgICAgbW9kZWxEYXRhXHJcbiAgICAgICAgLmZvckVhY2goKG1vZGVsKSA9PiB7XHJcbiAgICAgICAgICB2YXIgbW9kZWxJbmRleCA9IHRoaXMuZ2V0TW9kZWxJbmRleChtb2RlbC51dWlkKVxyXG4gICAgICAgICAgdGhpcy5yZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgdGhpcy5tb2RlbHMgPSB0aGlzLm1vZGVsc1xyXG4gICAgICAuZmlsdGVyKChtb2RlbCkgPT4gbW9kZWwgIT09IG51bGwpXHJcbiAgICBpZih0aGlzLl9sb2NhbFN0b3JhZ2UpIHRoaXMuZGIgPSB0aGlzLmRhdGFcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ3JlbW92ZScsXHJcbiAgICAgIHRoaXMucGFyc2UoKSxcclxuICAgICAgdGhpc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLnJlbW92ZSh0aGlzLl9tb2RlbHMpXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBwYXJzZShkYXRhKSB7XHJcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLmRhdGEgfHwgdGhpcy5zdG9yYWdlQ29udGFpbmVyXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSlcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvbGxlY3Rpb25cclxuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXguanMnXG5cbmNsYXNzIFZpZXcgZXh0ZW5kcyBFdmVudHMge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICB9XG4gIGdldCB2YWxpZFNldHRpbmdzKCkgeyByZXR1cm4gW1xuICAgICdhdHRyaWJ1dGVzJyxcbiAgICAnZWxlbWVudE5hbWUnLFxuICAgICdlbGVtZW50JyxcbiAgICAnaW5zZXJ0JyxcbiAgICAndGVtcGxhdGUnLFxuICAgICd1aUVsZW1lbnRzJyxcbiAgICAndWlFbGVtZW50RXZlbnRzJyxcbiAgICAndWlFbGVtZW50Q2FsbGJhY2tzJyxcbiAgICAncmVuZGVyJ1xuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCBlbGVtZW50TmFtZSgpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnROYW1lIH1cbiAgc2V0IGVsZW1lbnROYW1lKGVsZW1lbnROYW1lKSB7IHRoaXMuX2VsZW1lbnROYW1lID0gZWxlbWVudE5hbWUgfVxuICBnZXQgZWxlbWVudCgpIHtcbiAgICBpZighdGhpcy5fZWxlbWVudCkge1xuICAgICAgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5lbGVtZW50TmFtZSlcbiAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuYXR0cmlidXRlcykuZm9yRWFjaCgoW2F0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWVdKSA9PiB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZUtleSwgYXR0cmlidXRlVmFsdWUpXG4gICAgICB9KVxuICAgICAgdGhpcy5lbGVtZW50T2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmVsZW1lbnQsIHtcbiAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRcbiAgfVxuICBnZXQgZWxlbWVudE9ic2VydmVyKCkge1xuICAgIHRoaXMuX2VsZW1lbnRPYnNlcnZlciA9IHRoaXMuX2VsZW1lbnRPYnNlcnZlciB8fCBuZXcgTXV0YXRpb25PYnNlcnZlcihcbiAgICAgIHRoaXMuZWxlbWVudE9ic2VydmUuYmluZCh0aGlzKVxuICAgIClcbiAgICByZXR1cm4gdGhpcy5fZWxlbWVudE9ic2VydmVyXG4gIH1cbiAgc2V0IGVsZW1lbnQoZWxlbWVudCkge1xuICAgIGlmKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnRcbiAgfVxuICBnZXQgYXR0cmlidXRlcygpIHsgcmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXMgfHwge30gfVxuICBzZXQgYXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7IHRoaXMuX2F0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzIH1cbiAgZ2V0IHRlbXBsYXRlKCkgeyByZXR1cm4gdGhpcy5fdGVtcGxhdGUgfVxuICBzZXQgdGVtcGxhdGUodGVtcGxhdGUpIHsgdGhpcy5fdGVtcGxhdGUgPSB0ZW1wbGF0ZSB9XG4gIGdldCB1aUVsZW1lbnRzKCkgeyByZXR1cm4gdGhpcy5fdWlFbGVtZW50cyB8fCB7fSB9XG4gIHNldCB1aUVsZW1lbnRzKHVpRWxlbWVudHMpIHtcbiAgICB0aGlzLl91aUVsZW1lbnRzID0gdWlFbGVtZW50c1xuICAgIHRoaXMudG9nZ2xlRXZlbnRzKClcbiAgfVxuICBnZXQgdWlFbGVtZW50RXZlbnRzKCkgeyByZXR1cm4gdGhpcy5fdWlFbGVtZW50RXZlbnRzIHx8IHt9IH1cbiAgc2V0IHVpRWxlbWVudEV2ZW50cyh1aUVsZW1lbnRFdmVudHMpIHtcbiAgICB0aGlzLl91aUVsZW1lbnRFdmVudHMgPSB1aUVsZW1lbnRFdmVudHNcbiAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gIH1cbiAgZ2V0IHVpRWxlbWVudENhbGxiYWNrcygpIHsgcmV0dXJuIHRoaXMuX3VpRWxlbWVudENhbGxiYWNrcyB8fCB7fSB9XG4gIHNldCB1aUVsZW1lbnRDYWxsYmFja3ModWlFbGVtZW50Q2FsbGJhY2tzKSB7XG4gICAgdGhpcy5fdWlFbGVtZW50Q2FsbGJhY2tzID0gdWlFbGVtZW50Q2FsbGJhY2tzXG4gICAgdGhpcy50b2dnbGVFdmVudHMoKVxuICB9XG4gIGdldCB1aSgpIHtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpc1xuICAgIGlmKCF0aGlzLl91aSkge1xuICAgICAgdGhpcy5fdWkgPSBPYmplY3QuZW50cmllcyh0aGlzLnVpRWxlbWVudHMpLnJlZHVjZSgoX3VpLFt1aUVsZW1lbnROYW1lLCB1aUVsZW1lbnRRdWVyeV0pID0+IHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoX3VpLCB7XG4gICAgICAgICAgW3VpRWxlbWVudE5hbWVdOiB7XG4gICAgICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICAgIGlmKHR5cGVvZiB1aUVsZW1lbnRRdWVyeSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBsZXQgcXVlcnlSZXN1bHRzID0gY29udGV4dC5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodWlFbGVtZW50UXVlcnkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIChxdWVyeVJlc3VsdHMubGVuZ3RoID4gMSkgPyBxdWVyeVJlc3VsdHMgOiBxdWVyeVJlc3VsdHMuaXRlbSgwKVxuICAgICAgICAgICAgICB9IGVsc2UgaWYoXG4gICAgICAgICAgICAgICAgdWlFbGVtZW50UXVlcnkgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxuICAgICAgICAgICAgICAgIHVpRWxlbWVudFF1ZXJ5IGluc3RhbmNlb2YgRG9jdW1lbnQgfHxcbiAgICAgICAgICAgICAgICB1aUVsZW1lbnRRdWVyeSBpbnN0YW5jZW9mIFdpbmRvd1xuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdWlFbGVtZW50UXVlcnlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBfdWlcbiAgICAgIH0sIHt9KVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcy5fdWksIHtcbiAgICAgICAgJyRlbGVtZW50Jzoge1xuICAgICAgICAgIGdldCgpIHsgcmV0dXJuIGNvbnRleHQuZWxlbWVudCB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fdWlcbiAgfVxuICBlbGVtZW50T2JzZXJ2ZShtdXRhdGlvblJlY29yZExpc3QsIG9ic2VydmVyKSB7XG4gICAgZm9yKGxldCBbbXV0YXRpb25SZWNvcmRJbmRleCwgbXV0YXRpb25SZWNvcmRdIG9mIE9iamVjdC5lbnRyaWVzKG11dGF0aW9uUmVjb3JkTGlzdCkpIHtcbiAgICAgIHN3aXRjaChtdXRhdGlvblJlY29yZC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2NoaWxkTGlzdCc6XG4gICAgICAgICAgaWYobXV0YXRpb25SZWNvcmQuYWRkZWROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIE9iamVjdC5lbnRyaWVzKE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHRoaXMudWkpKVxuICAgICAgICAgICAgLy8gLmZvckVhY2goKFt1aUtleSwgdWlWYWx1ZV0pID0+IHtcbiAgICAgICAgICAgIC8vICAgY29uc3QgdWlWYWx1ZUdldCA9IHVpVmFsdWUuZ2V0KClcbiAgICAgICAgICAgIC8vICAgY29uc3QgYWRkZWRVSUVsZW1lbnQgPSBBcnJheS5mcm9tKG11dGF0aW9uUmVjb3JkLmFkZGVkTm9kZXMpLmZpbmQoKGFkZGVkTm9kZSkgPT4ge1xuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdhZGRlZE5vZGUnLCBhZGRlZE5vZGUpXG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ3VpVmFsdWVHZXQnLCB1aVZhbHVlR2V0KVxuICAgICAgICAgICAgLy8gICAgIHJldHVybiBhZGRlZE5vZGUgPT09IHVpVmFsdWVHZXRcbiAgICAgICAgICAgIC8vICAgfSlcbiAgICAgICAgICAgIC8vICAgaWYoYWRkZWRVSUVsZW1lbnQpIHtcbiAgICAgICAgICAgIC8vICAgICB0aGlzLnRvZ2dsZUV2ZW50cyh1aUtleSlcbiAgICAgICAgICAgIC8vICAgfVxuICAgICAgICAgICAgLy8gfSlcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKClcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYmluZEV2ZW50VG9FbGVtZW50KGVsZW1lbnQsIG1ldGhvZCwgZXZlbnROYW1lLCBldmVudENhbGxiYWNrTmFtZSkge1xuICAgIHRyeSB7XG4gICAgICBzd2l0Y2gobWV0aG9kKSB7XG4gICAgICAgIGNhc2UgJ2FkZEV2ZW50TGlzdGVuZXInOlxuICAgICAgICAgIHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXS5iaW5kKHRoaXMpXG4gICAgICAgICAgZWxlbWVudFttZXRob2RdKGV2ZW50TmFtZSwgdGhpcy51aUVsZW1lbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3JlbW92ZUV2ZW50TGlzdGVuZXInOlxuICAgICAgICAgIGVsZW1lbnRbbWV0aG9kXShldmVudE5hbWUsIHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSlcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH0gY2F0Y2goZXJyb3IpIHt9XG4gIH1cbiAgdG9nZ2xlRXZlbnRzKHRhcmdldFVJRWxlbWVudE5hbWUgPSBudWxsKSB7XG4gICAgdGhpcy5pc1RvZ2dsaW5nID0gdHJ1ZVxuICAgIGNvbnN0IHVpID0gdGhpcy51aVxuICAgIGNvbnN0IGV2ZW50QmluZE1ldGhvZHMgPSBbJ3JlbW92ZUV2ZW50TGlzdGVuZXInLCAnYWRkRXZlbnRMaXN0ZW5lciddXG4gICAgaWYoIXRhcmdldFVJRWxlbWVudE5hbWUpIHtcbiAgICAgIGV2ZW50QmluZE1ldGhvZHMuZm9yRWFjaCgoZXZlbnRCaW5kTWV0aG9kKSA9PiB7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMudWlFbGVtZW50RXZlbnRzKS5mb3JFYWNoKChbdWlFbGVtZW50RXZlbnRTZXR0aW5ncywgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWVdKSA9PiB7XG4gICAgICAgICAgbGV0IFt1aUVsZW1lbnROYW1lLCB1aUVsZW1lbnRFdmVudE5hbWVdID0gdWlFbGVtZW50RXZlbnRTZXR0aW5ncy5zcGxpdCgnICcpXG4gICAgICAgICAgaWYodWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xuICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0uZm9yRWFjaCgodWlFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50VG9FbGVtZW50KHVpRWxlbWVudCwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2UgaWYoXG4gICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIERvY3VtZW50IHx8XG4gICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIFdpbmRvd1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlbdWlFbGVtZW50TmFtZV0sIGV2ZW50QmluZE1ldGhvZCwgdWlFbGVtZW50RXZlbnROYW1lLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBldmVudEJpbmRNZXRob2RzLmZvckVhY2goKGV2ZW50QmluZE1ldGhvZCkgPT4ge1xuICAgICAgICBjb25zdCB1aUVsZW1lbnRFdmVudHMgPSBPYmplY3QuZW50cmllcyh0aGlzLnVpRWxlbWVudEV2ZW50cykuZm9yRWFjaCgoW3VpRWxlbWVudEV2ZW50U2V0dGluZ3MsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGxldCBbdWlFbGVtZW50TmFtZSwgdWlFbGVtZW50RXZlbnROYW1lXSA9IHVpRWxlbWVudEV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxuICAgICAgICAgIGlmKHRhcmdldFVJRWxlbWVudE5hbWUgPT09IHVpRWxlbWVudE5hbWUpIHtcbiAgICAgICAgICAgIGlmKHVpW3VpRWxlbWVudE5hbWVdIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0uZm9yRWFjaCgodWlFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlFbGVtZW50LCBldmVudEJpbmRNZXRob2QsIHVpRWxlbWVudEV2ZW50TmFtZSwgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2UgaWYodWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICB0aGlzLmJpbmRFdmVudFRvRWxlbWVudCh1aVt1aUVsZW1lbnROYW1lXSwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuaXNUb2dnbGluZyA9IGZhbHNlXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdXRvSW5zZXJ0KCkge1xuICAgIGlmKHRoaXMuaW5zZXJ0KSB7XG4gICAgICBjb25zdCBwYXJlbnQgPSAodHlwZW9mIHRoaXMuaW5zZXJ0LnBhcmVudCA9PT0gJ3N0cmluZycpXG4gICAgICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmluc2VydC5wYXJlbnQpXG4gICAgICAgIDogKHRoaXMuaW5zZXJ0LnBhcmVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KVxuICAgICAgICAgID8gdGhpcy5pbnNlcnQucGFyZW50XG4gICAgICAgICAgOiBudWxsXG4gICAgICBjb25zdCBtZXRob2QgPSB0aGlzLmluc2VydC5tZXRob2RcbiAgICAgIHBhcmVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQobWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgYXV0b1JlbW92ZSgpIHtcbiAgICBpZih0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgdGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHJlbmRlcihkYXRhID0ge30pIHtcbiAgICBpZih0aGlzLnRlbXBsYXRlKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUoZGF0YSlcbiAgICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZVxuICAgIH1cbiAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgVmlld1xuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXgnXG5cbmNvbnN0IENvbnRyb2xsZXIgPSBjbGFzcyBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ21vZGVscycsXG4gICAgJ21vZGVsRXZlbnRzJyxcbiAgICAnbW9kZWxDYWxsYmFja3MnLFxuICAgICdjb2xsZWN0aW9ucycsXG4gICAgJ2NvbGxlY3Rpb25FdmVudHMnLFxuICAgICdjb2xsZWN0aW9uQ2FsbGJhY2tzJyxcbiAgICAndmlld3MnLFxuICAgICd2aWV3RXZlbnRzJyxcbiAgICAndmlld0NhbGxiYWNrcycsXG4gICAgJ2NvbnRyb2xsZXJzJyxcbiAgICAnY29udHJvbGxlckV2ZW50cycsXG4gICAgJ2NvbnRyb2xsZXJDYWxsYmFja3MnLFxuICAgICdyb3V0ZXJzJyxcbiAgICAncm91dGVyRXZlbnRzJyxcbiAgICAncm91dGVyQ2FsbGJhY2tzJyxcbiAgXSB9XG4gIGdldCBiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzKCkgeyByZXR1cm4gW1xuICAgICdtb2RlbCcsXG4gICAgJ3ZpZXcnLFxuICAgICdjb2xsZWN0aW9uJyxcbiAgICAnY29udHJvbGxlcicsXG4gICAgJ3JvdXRlcicsXG4gIF0gfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cbiAgZ2V0IHNldHRpbmdzKCkge1xuICAgIGlmKCF0aGlzLl9zZXR0aW5ncykgdGhpcy5fc2V0dGluZ3MgPSB7fVxuICAgIHJldHVybiB0aGlzLl9zZXR0aW5nc1xuICB9XG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3NcbiAgICAgIC5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgICAgaWYodGhpcy5zZXR0aW5nc1t2YWxpZFNldHRpbmddKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBbJ18nLmNvbmNhdCh2YWxpZFNldHRpbmcpXToge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtYmVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFt2YWxpZFNldHRpbmddOiB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpc1snXycuY29uY2F0KHZhbGlkU2V0dGluZyldIH0sXG4gICAgICAgICAgICAgICAgc2V0KHZhbHVlKSB7IHRoaXNbJ18nLmNvbmNhdCh2YWxpZFNldHRpbmcpXSA9IHZhbHVlIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKVxuICAgICAgICAgIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHRoaXMuc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIHRoaXMuYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlc1xuICAgICAgLmZvckVhY2goKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSkgPT4ge1xuICAgICAgICB0aGlzLnJlc2V0RXZlbnRzKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSlcbiAgICAgIH0pXG4gIH1cbiAgcmVzZXRFdmVudHMoY2xhc3NUeXBlKSB7XG4gICAgW1xuICAgICAgJ29mZicsXG4gICAgICAnb24nXG4gICAgXS5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB0b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpIHtcbiAgICBjb25zdCBiYXNlTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ3MnKVxuICAgIGNvbnN0IGJhc2VFdmVudHNOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJylcbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXG4gICAgY29uc3QgYmFzZSA9IHRoaXNbYmFzZU5hbWVdIHx8IHt9XG4gICAgY29uc3QgYmFzZUV2ZW50cyA9IHRoaXNbYmFzZUV2ZW50c05hbWVdIHx8IHt9XG4gICAgY29uc3QgYmFzZUNhbGxiYWNrcyA9IHRoaXNbYmFzZUNhbGxiYWNrc05hbWVdIHx8IHt9XG4gICAgaWYoXG4gICAgICBPYmplY3QudmFsdWVzKGJhc2UpLmxlbmd0aCAmJlxuICAgICAgT2JqZWN0LnZhbHVlcyhiYXNlRXZlbnRzKS5sZW5ndGggJiZcbiAgICAgIE9iamVjdC52YWx1ZXMoYmFzZUNhbGxiYWNrcykubGVuZ3RoXG4gICAgKSB7XG4gICAgICBPYmplY3QuZW50cmllcyhiYXNlRXZlbnRzKVxuICAgICAgICAuZm9yRWFjaCgoW2Jhc2VFdmVudERhdGEsIGJhc2VDYWxsYmFja05hbWVdKSA9PiB7XG4gICAgICAgICAgY29uc3QgW2Jhc2VUYXJnZXROYW1lLCBiYXNlRXZlbnROYW1lXSA9IGJhc2VFdmVudERhdGEuc3BsaXQoJyAnKVxuICAgICAgICAgIGNvbnN0IGJhc2VUYXJnZXROYW1lU3Vic3RyaW5nRmlyc3QgPSBiYXNlVGFyZ2V0TmFtZS5zdWJzdHJpbmcoMCwgMSlcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0xhc3QgPSBiYXNlVGFyZ2V0TmFtZS5zdWJzdHJpbmcoYmFzZVRhcmdldE5hbWUubGVuZ3RoIC0gMSlcbiAgICAgICAgICBsZXQgYmFzZVRhcmdldHMgPSBbXVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdGaXJzdCA9PT0gJ1snICYmXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0xhc3QgPT09ICddJ1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZVRhcmdldHMgPSBPYmplY3QuZW50cmllcyhiYXNlKVxuICAgICAgICAgICAgICAucmVkdWNlKChfYmFzZVRhcmdldHMsIFtiYXNlTmFtZSwgYmFzZVRhcmdldF0pID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmFzZVRhcmdldE5hbWVSZWdFeHBTdHJpbmcgPSBiYXNlVGFyZ2V0TmFtZS5zbGljZSgxLCAtMSlcbiAgICAgICAgICAgICAgICBsZXQgYmFzZVRhcmdldE5hbWVSZWdFeHAgPSBuZXcgUmVnRXhwKGJhc2VUYXJnZXROYW1lUmVnRXhwU3RyaW5nKVxuICAgICAgICAgICAgICAgIGlmKGJhc2VOYW1lLm1hdGNoKGJhc2VUYXJnZXROYW1lUmVnRXhwKSkge1xuICAgICAgICAgICAgICAgICAgX2Jhc2VUYXJnZXRzLnB1c2goYmFzZVRhcmdldClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9iYXNlVGFyZ2V0c1xuICAgICAgICAgICAgICB9LCBbXSlcbiAgICAgICAgICB9IGVsc2UgaWYoYmFzZVtiYXNlVGFyZ2V0TmFtZV0pIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzLnB1c2goYmFzZVtiYXNlVGFyZ2V0TmFtZV0pXG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBiYXNlRXZlbnRDYWxsYmFjayA9IGJhc2VDYWxsYmFja3NbYmFzZUNhbGxiYWNrTmFtZV1cbiAgICAgICAgICBpZihcbiAgICAgICAgICAgIGJhc2VFdmVudENhbGxiYWNrICYmXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFjay5uYW1lLnNwbGl0KCcgJykubGVuZ3RoID09PSAxXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFjayA9IGJhc2VFdmVudENhbGxiYWNrLmJpbmQodGhpcylcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldHMubGVuZ3RoICYmXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFja1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZVRhcmdldHNcbiAgICAgICAgICAgICAgLmZvckVhY2goKGJhc2VUYXJnZXQpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgc3dpdGNoKG1ldGhvZCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdvbic6XG4gICAgICAgICAgICAgICAgICAgICAgYmFzZVRhcmdldFttZXRob2RdKGJhc2VFdmVudE5hbWUsIGJhc2VFdmVudENhbGxiYWNrKVxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ29mZic6XG4gICAgICAgICAgICAgICAgICAgICAgYmFzZVRhcmdldFttZXRob2RdKGJhc2VFdmVudE5hbWUsIGJhc2VFdmVudENhbGxiYWNrKVxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3JcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleCdcblxuY29uc3QgUm91dGVyID0gY2xhc3MgZXh0ZW5kcyBFdmVudHMge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuYWRkU2V0dGluZ3MoKVxuICAgIHRoaXMuYWRkV2luZG93RXZlbnRzKClcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAncm9vdCcsXG4gICAgJ2hhc2hSb3V0aW5nJyxcbiAgICAnY29udHJvbGxlcicsXG4gICAgJ3JvdXRlcydcbiAgXSB9XG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICB9KVxuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgcHJvdG9jb2woKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgfVxuICBnZXQgaG9zdG5hbWUoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgfVxuICBnZXQgcG9ydCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wb3J0IH1cbiAgZ2V0IHBhdGhuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIH1cbiAgZ2V0IHBhdGgoKSB7XG4gICAgbGV0IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZVxuICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cChbJ14nLCB0aGlzLnJvb3RdLmpvaW4oJycpKSwgJycpXG4gICAgICAuc3BsaXQoJz8nKVxuICAgICAgLnNsaWNlKDAsIDEpXG4gICAgICBbMF1cbiAgICBsZXQgZnJhZ21lbnRzID0gKFxuICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMFxuICAgICkgPyBbXVxuICAgICAgOiAoXG4gICAgICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXlxcLy8pICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9cXC8/LylcbiAgICAgICAgKSA/IFsnLyddXG4gICAgICAgICAgOiBzdHJpbmdcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICByZXR1cm4ge1xuICAgICAgZnJhZ21lbnRzOiBmcmFnbWVudHMsXG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICB9XG4gIH1cbiAgZ2V0IGhhc2goKSB7XG4gICAgbGV0IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoXG4gICAgICAuc2xpY2UoMSlcbiAgICAgIC5zcGxpdCgnPycpXG4gICAgICAuc2xpY2UoMCwgMSlcbiAgICAgIFswXVxuICAgIGxldCBmcmFnbWVudHMgPSAoXG4gICAgICBzdHJpbmcubGVuZ3RoID09PSAwXG4gICAgKSA/IFtdXG4gICAgICA6IChcbiAgICAgICAgICBzdHJpbmcubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9eXFwvLykgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL1xcLz8vKVxuICAgICAgICApID8gWycvJ11cbiAgICAgICAgICA6IHN0cmluZ1xuICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAuc3BsaXQoJy8nKVxuICAgIHJldHVybiB7XG4gICAgICBmcmFnbWVudHM6IGZyYWdtZW50cyxcbiAgICAgIHN0cmluZzogc3RyaW5nLFxuICAgIH1cbiAgfVxuICBnZXQgcGFyYW1ldGVycygpIHtcbiAgICBsZXQgc3RyaW5nXG4gICAgbGV0IGRhdGFcbiAgICBpZih3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvXFw/LykpIHtcbiAgICAgIGxldCBwYXJhbWV0ZXJzID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICAgICAgLnNwbGl0KCc/JylcbiAgICAgICAgLnNsaWNlKC0xKVxuICAgICAgICAuam9pbignJylcbiAgICAgIHN0cmluZyA9IHBhcmFtZXRlcnNcbiAgICAgIGRhdGEgPSBwYXJhbWV0ZXJzXG4gICAgICAgIC5zcGxpdCgnJicpXG4gICAgICAgIC5yZWR1Y2UoKFxuICAgICAgICAgIF9wYXJhbWV0ZXJzLFxuICAgICAgICAgIHBhcmFtZXRlclxuICAgICAgICApID0+IHtcbiAgICAgICAgICBsZXQgcGFyYW1ldGVyRGF0YSA9IHBhcmFtZXRlci5zcGxpdCgnPScpXG4gICAgICAgICAgX3BhcmFtZXRlcnNbcGFyYW1ldGVyRGF0YVswXV0gPSBwYXJhbWV0ZXJEYXRhWzFdXG4gICAgICAgICAgcmV0dXJuIF9wYXJhbWV0ZXJzXG4gICAgICAgIH0sIHt9KVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHJpbmcgPSAnJ1xuICAgICAgZGF0YSA9IHt9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9XG4gIH1cbiAgZ2V0IF9yb290KCkgeyByZXR1cm4gdGhpcy5yb290IHx8ICcvJyB9XG4gIHNldCBfcm9vdChyb290KSB7IHRoaXMucm9vdCA9IHJvb3QgfVxuICBnZXQgX2hhc2hSb3V0aW5nKCkgeyByZXR1cm4gdGhpcy5oYXNoUm91dGluZyB8fCBmYWxzZSB9XG4gIHNldCBfaGFzaFJvdXRpbmcoaGFzaFJvdXRpbmcpIHsgdGhpcy5oYXNoUm91dGluZyA9IGhhc2hSb3V0aW5nIH1cbiAgZ2V0IF9yb3V0ZXMoKSB7IHJldHVybiB0aGlzLnJvdXRlcyB9XG4gIHNldCBfcm91dGVzKHJvdXRlcykgeyB0aGlzLnJvdXRlcyA9IHJvdXRlcyB9XG4gIGdldCBfY29udHJvbGxlcigpIHsgcmV0dXJuIHRoaXMuY29udHJvbGxlciB9XG4gIHNldCBfY29udHJvbGxlcihjb250cm9sbGVyKSB7IHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXIgfVxuICBnZXQgbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvb3Q6IHRoaXMucm9vdCxcbiAgICAgIHBhdGg6IHRoaXMucGF0aCxcbiAgICAgIGhhc2g6IHRoaXMuaGFzaCxcbiAgICAgIHBhcmFtZXRlcnM6IHRoaXMucGFyYW1ldGVycyxcbiAgICB9XG4gIH1cbiAgbWF0Y2hSb3V0ZShyb3V0ZUZyYWdtZW50cywgbG9jYXRpb25GcmFnbWVudHMpIHtcbiAgICBsZXQgcm91dGVNYXRjaGVzID0gbmV3IEFycmF5KClcbiAgICBpZihyb3V0ZUZyYWdtZW50cy5sZW5ndGggPT09IGxvY2F0aW9uRnJhZ21lbnRzLmxlbmd0aCkge1xuICAgICAgcm91dGVNYXRjaGVzID0gcm91dGVGcmFnbWVudHNcbiAgICAgICAgLnJlZHVjZSgoX3JvdXRlTWF0Y2hlcywgcm91dGVGcmFnbWVudCwgcm91dGVGcmFnbWVudEluZGV4KSA9PiB7XG4gICAgICAgICAgbGV0IGxvY2F0aW9uRnJhZ21lbnQgPSBsb2NhdGlvbkZyYWdtZW50c1tyb3V0ZUZyYWdtZW50SW5kZXhdXG4gICAgICAgICAgaWYocm91dGVGcmFnbWVudC5tYXRjaCgvXlxcOi8pKSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2godHJ1ZSlcbiAgICAgICAgICB9IGVsc2UgaWYocm91dGVGcmFnbWVudCA9PT0gbG9jYXRpb25GcmFnbWVudCkge1xuICAgICAgICAgICAgX3JvdXRlTWF0Y2hlcy5wdXNoKHRydWUpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaChmYWxzZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yb3V0ZU1hdGNoZXNcbiAgICAgICAgfSwgW10pXG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRlTWF0Y2hlcy5wdXNoKGZhbHNlKVxuICAgIH1cbiAgICByZXR1cm4gKHJvdXRlTWF0Y2hlcy5pbmRleE9mKGZhbHNlKSA9PT0gLTEpXG4gICAgICA/IHRydWVcbiAgICAgIDogZmFsc2VcbiAgfVxuICBnZXRSb3V0ZShsb2NhdGlvbikge1xuICAgIGxldCByb3V0ZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnJvdXRlcylcbiAgICAgIC5yZWR1Y2UoKFxuICAgICAgICBfcm91dGVzLFxuICAgICAgICBbcm91dGVOYW1lLCByb3V0ZVNldHRpbmdzXSkgPT4ge1xuICAgICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IChcbiAgICAgICAgICAgIHJvdXRlTmFtZS5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICAgIHJvdXRlTmFtZS5tYXRjaCgvXlxcLy8pXG4gICAgICAgICAgKSA/IFtyb3V0ZU5hbWVdXG4gICAgICAgICAgICA6IChyb3V0ZU5hbWUubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICA/IFsnJ11cbiAgICAgICAgICAgICAgOiByb3V0ZU5hbWVcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICAgICAgICByb3V0ZVNldHRpbmdzLmZyYWdtZW50cyA9IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgICAgX3JvdXRlc1tyb3V0ZUZyYWdtZW50cy5qb2luKCcvJyldID0gcm91dGVTZXR0aW5nc1xuICAgICAgICAgIHJldHVybiBfcm91dGVzXG4gICAgICAgIH0sXG4gICAgICAgIHt9XG4gICAgICApXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMocm91dGVzKVxuICAgICAgLmZpbmQoKHJvdXRlKSA9PiB7XG4gICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IHJvdXRlLmZyYWdtZW50c1xuICAgICAgICBsZXQgbG9jYXRpb25GcmFnbWVudHMgPSAodGhpcy5oYXNoUm91dGluZylcbiAgICAgICAgICA/IGxvY2F0aW9uLmhhc2guZnJhZ21lbnRzXG4gICAgICAgICAgOiBsb2NhdGlvbi5wYXRoLmZyYWdtZW50c1xuICAgICAgICBsZXQgbWF0Y2hSb3V0ZSA9IHRoaXMubWF0Y2hSb3V0ZShcbiAgICAgICAgICByb3V0ZUZyYWdtZW50cyxcbiAgICAgICAgICBsb2NhdGlvbkZyYWdtZW50cyxcbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gbWF0Y2hSb3V0ZSA9PT0gdHJ1ZVxuICAgICAgfSlcbiAgfVxuICBwb3BTdGF0ZShldmVudCkge1xuICAgIGxldCBsb2NhdGlvbiA9IHRoaXMubG9jYXRpb25cbiAgICBsZXQgcm91dGUgPSB0aGlzLmdldFJvdXRlKGxvY2F0aW9uKVxuICAgIGxldCByb3V0ZURhdGEgPSB7XG4gICAgICByb3V0ZTogcm91dGUsXG4gICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgfVxuICAgIGlmKHJvdXRlKSB7XG4gICAgICB0aGlzLmNvbnRyb2xsZXJbcm91dGUuY2FsbGJhY2tdKHJvdXRlRGF0YSlcbiAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJywge1xuICAgICAgICBuYW1lOiAnY2hhbmdlJyxcbiAgICAgICAgZGF0YTogcm91dGVEYXRhLFxuICAgICAgfSxcbiAgICAgIHRoaXMpXG4gICAgfVxuICB9XG4gIGFkZFdpbmRvd0V2ZW50cygpIHtcbiAgICB3aW5kb3cub24oJ3BvcHN0YXRlJywgdGhpcy5wb3BTdGF0ZS5iaW5kKHRoaXMpKVxuICB9XG4gIHJlbW92ZVdpbmRvd0V2ZW50cygpIHtcbiAgICB3aW5kb3cub2ZmKCdwb3BzdGF0ZScsIHRoaXMucG9wU3RhdGUuYmluZCh0aGlzKSlcbiAgfVxuICBuYXZpZ2F0ZShwYXRoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFJvdXRlclxuIiwiaW1wb3J0ICcuL1NoaW1zL2V2ZW50cydcbmltcG9ydCBFdmVudHMgZnJvbSAnLi9FdmVudHMvaW5kZXgnXG5pbXBvcnQgQ2hhbm5lbHMgZnJvbSAnLi9DaGFubmVscy9pbmRleCdcbmltcG9ydCAqIGFzIFV0aWxpdGllcyBmcm9tICcuL1V0aWxpdGllcy9pbmRleCdcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4vU2VydmljZS9pbmRleCdcbmltcG9ydCBNb2RlbCBmcm9tICcuL01vZGVsL2luZGV4J1xuaW1wb3J0IENvbGxlY3Rpb24gZnJvbSAnLi9Db2xsZWN0aW9uL2luZGV4J1xuaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3L2luZGV4J1xuaW1wb3J0IENvbnRyb2xsZXIgZnJvbSAnLi9Db250cm9sbGVyL2luZGV4J1xuaW1wb3J0IFJvdXRlciBmcm9tICcuL1JvdXRlci9pbmRleCdcbmNvbnN0IE1WQyA9IHtcbiAgRXZlbnRzLFxuICBDaGFubmVscyxcbiAgVXRpbGl0aWVzLFxuICBTZXJ2aWNlLFxuICBNb2RlbCxcbiAgQ29sbGVjdGlvbixcbiAgVmlldyxcbiAgQ29udHJvbGxlcixcbiAgUm91dGVyLFxufVxuZXhwb3J0IGRlZmF1bHQgTVZDXG4iXSwibmFtZXMiOlsiRXZlbnRUYXJnZXQiLCJwcm90b3R5cGUiLCJvbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJvZmYiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiRXZlbnRzIiwiY29uc3RydWN0b3IiLCJfZXZlbnRzIiwiZXZlbnRzIiwiZ2V0RXZlbnRDYWxsYmFja3MiLCJldmVudE5hbWUiLCJnZXRFdmVudENhbGxiYWNrTmFtZSIsImV2ZW50Q2FsbGJhY2siLCJuYW1lIiwibGVuZ3RoIiwiZ2V0RXZlbnRDYWxsYmFja0dyb3VwIiwiZXZlbnRDYWxsYmFja3MiLCJldmVudENhbGxiYWNrTmFtZSIsImV2ZW50Q2FsbGJhY2tHcm91cCIsInB1c2giLCJhcmd1bWVudHMiLCJPYmplY3QiLCJrZXlzIiwiZW1pdCIsIl9hcmd1bWVudHMiLCJBcnJheSIsImZyb20iLCJzcGxpY2UiLCJldmVudERhdGEiLCJldmVudEFyZ3VtZW50cyIsImVudHJpZXMiLCJmb3JFYWNoIiwiZXZlbnRDYWxsYmFja0dyb3VwTmFtZSIsImRhdGEiLCJfcmVzcG9uc2VzIiwicmVzcG9uc2VzIiwicmVzcG9uc2UiLCJyZXNwb25zZU5hbWUiLCJyZXNwb25zZUNhbGxiYWNrIiwicmVxdWVzdCIsInNsaWNlIiwiY2FsbCIsIl9yZXNwb25zZU5hbWUiLCJfY2hhbm5lbHMiLCJjaGFubmVscyIsImNoYW5uZWwiLCJjaGFubmVsTmFtZSIsIkNoYW5uZWwiLCJVVUlEIiwidXVpZCIsImkiLCJyYW5kb20iLCJNYXRoIiwidG9TdHJpbmciLCJTZXJ2aWNlIiwic2V0dGluZ3MiLCJvcHRpb25zIiwidmFsaWRTZXR0aW5ncyIsIl9zZXR0aW5ncyIsInZhbGlkU2V0dGluZyIsIl9vcHRpb25zIiwidXJsIiwicGFyYW1ldGVycyIsIl91cmwiLCJjb25jYXQiLCJxdWVyeVN0cmluZyIsInBhcmFtZXRlclN0cmluZyIsInJlZHVjZSIsInBhcmFtZXRlclN0cmluZ3MiLCJwYXJhbWV0ZXJLZXkiLCJwYXJhbWV0ZXJWYWx1ZSIsImpvaW4iLCJtZXRob2QiLCJfbWV0aG9kIiwibW9kZSIsIl9tb2RlIiwiY2FjaGUiLCJfY2FjaGUiLCJjcmVkZW50aWFscyIsIl9jcmVkZW50aWFscyIsImhlYWRlcnMiLCJfaGVhZGVycyIsInJlZGlyZWN0IiwiX3JlZGlyZWN0IiwicmVmZXJyZXJQb2xpY3kiLCJfcmVmZXJyZXJQb2xpY3kiLCJib2R5IiwiX2JvZHkiLCJfcGFyYW1ldGVycyIsInByZXZpb3VzQWJvcnRDb250cm9sbGVyIiwiX3ByZXZpb3VzQWJvcnRDb250cm9sbGVyIiwiYWJvcnRDb250cm9sbGVyIiwiX2Fib3J0Q29udHJvbGxlciIsIkFib3J0Q29udHJvbGxlciIsImFib3J0IiwiZmV0Y2giLCJmZXRjaE9wdGlvbnMiLCJfZmV0Y2hPcHRpb25zIiwiZmV0Y2hPcHRpb25OYW1lIiwic2lnbmFsIiwidGhlbiIsImpzb24iLCJjb2RlIiwiY2F0Y2giLCJlcnJvciIsIk1vZGVsIiwiX3V1aWQiLCJiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzIiwiYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlIiwidG9nZ2xlRXZlbnRzIiwic2VydmljZXMiLCJfc2VydmljZXMiLCJfZGF0YSIsImRlZmF1bHRzIiwiX2RlZmF1bHRzIiwibG9jYWxTdG9yYWdlIiwic3luYyIsImRiIiwic2V0IiwiX2xvY2FsU3RvcmFnZSIsInN0b3JhZ2VDb250YWluZXIiLCJfZGIiLCJnZXRJdGVtIiwiZW5kcG9pbnQiLCJKU09OIiwic3RyaW5naWZ5IiwicGFyc2UiLCJzZXRJdGVtIiwicmVzZXRFdmVudHMiLCJjbGFzc1R5cGUiLCJiYXNlTmFtZSIsImJhc2VFdmVudHNOYW1lIiwiYmFzZUNhbGxiYWNrc05hbWUiLCJiYXNlIiwiYmFzZUV2ZW50cyIsImJhc2VDYWxsYmFja3MiLCJiYXNlRXZlbnREYXRhIiwiYmFzZUNhbGxiYWNrTmFtZSIsImJhc2VUYXJnZXROYW1lIiwiYmFzZUV2ZW50TmFtZSIsInNwbGl0IiwiYmFzZVRhcmdldCIsImJhc2VDYWxsYmFjayIsImJpbmQiLCJzZXREQiIsImtleSIsInZhbHVlIiwidW5zZXREQiIsInNldERhdGFQcm9wZXJ0eSIsInNpbGVudCIsImRlZmluZVByb3BlcnRpZXMiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImVudW1lcmFibGUiLCJnZXQiLCJldmVudCIsIm1vZGVsIiwidW5zZXREYXRhUHJvcGVydHkiLCJpc0FycmF5IiwidW5zZXQiLCJDb2xsZWN0aW9uIiwiZGVmYXVsdElEQXR0cmlidXRlIiwiYWRkIiwiVXRpbGl0aWVzIiwibW9kZWxzIiwiX21vZGVscyIsIm1vZGVsc0RhdGEiLCJfbW9kZWwiLCJtYXAiLCJiYXNlRXZlbnRDYWxsYmFjayIsImNsYXNzVHlwZVRhcmdldCIsImNsYXNzVHlwZUV2ZW50TmFtZSIsImNsYXNzVHlwZUV2ZW50Q2FsbGJhY2siLCJnZXRNb2RlbEluZGV4IiwibW9kZWxVVUlEIiwibW9kZWxJbmRleCIsImZpbmQiLCJfbW9kZWxJbmRleCIsInJlbW92ZU1vZGVsQnlJbmRleCIsImFkZE1vZGVsIiwibW9kZWxEYXRhIiwic29tZU1vZGVsIiwicmVtb3ZlIiwiZmlsdGVyIiwicmVzZXQiLCJWaWV3IiwiZWxlbWVudE5hbWUiLCJfZWxlbWVudE5hbWUiLCJlbGVtZW50IiwiX2VsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJzZXRBdHRyaWJ1dGUiLCJlbGVtZW50T2JzZXJ2ZXIiLCJvYnNlcnZlIiwic3VidHJlZSIsImNoaWxkTGlzdCIsIl9lbGVtZW50T2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZWxlbWVudE9ic2VydmUiLCJIVE1MRWxlbWVudCIsIl9hdHRyaWJ1dGVzIiwidGVtcGxhdGUiLCJfdGVtcGxhdGUiLCJ1aUVsZW1lbnRzIiwiX3VpRWxlbWVudHMiLCJ1aUVsZW1lbnRFdmVudHMiLCJfdWlFbGVtZW50RXZlbnRzIiwidWlFbGVtZW50Q2FsbGJhY2tzIiwiX3VpRWxlbWVudENhbGxiYWNrcyIsInVpIiwiY29udGV4dCIsIl91aSIsInVpRWxlbWVudE5hbWUiLCJ1aUVsZW1lbnRRdWVyeSIsInF1ZXJ5UmVzdWx0cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJpdGVtIiwiRG9jdW1lbnQiLCJXaW5kb3ciLCJtdXRhdGlvblJlY29yZExpc3QiLCJvYnNlcnZlciIsIm11dGF0aW9uUmVjb3JkSW5kZXgiLCJtdXRhdGlvblJlY29yZCIsInR5cGUiLCJhZGRlZE5vZGVzIiwiYmluZEV2ZW50VG9FbGVtZW50IiwidGFyZ2V0VUlFbGVtZW50TmFtZSIsImlzVG9nZ2xpbmciLCJldmVudEJpbmRNZXRob2RzIiwiZXZlbnRCaW5kTWV0aG9kIiwidWlFbGVtZW50RXZlbnRTZXR0aW5ncyIsInVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lIiwidWlFbGVtZW50RXZlbnROYW1lIiwiTm9kZUxpc3QiLCJ1aUVsZW1lbnQiLCJhdXRvSW5zZXJ0IiwiaW5zZXJ0IiwicGFyZW50IiwicXVlcnlTZWxlY3RvciIsImluc2VydEFkamFjZW50RWxlbWVudCIsImF1dG9SZW1vdmUiLCJwYXJlbnRFbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJyZW5kZXIiLCJpbm5lckhUTUwiLCJDb250cm9sbGVyIiwiZW51bWJlcmFibGUiLCJ2YWx1ZXMiLCJiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0ZpcnN0Iiwic3Vic3RyaW5nIiwiYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0IiwiYmFzZVRhcmdldHMiLCJfYmFzZVRhcmdldHMiLCJiYXNlVGFyZ2V0TmFtZVJlZ0V4cFN0cmluZyIsImJhc2VUYXJnZXROYW1lUmVnRXhwIiwiUmVnRXhwIiwibWF0Y2giLCJSb3V0ZXIiLCJhZGRTZXR0aW5ncyIsImFkZFdpbmRvd0V2ZW50cyIsInByb3RvY29sIiwid2luZG93IiwibG9jYXRpb24iLCJob3N0bmFtZSIsInBvcnQiLCJwYXRobmFtZSIsInBhdGgiLCJzdHJpbmciLCJyZXBsYWNlIiwicm9vdCIsImZyYWdtZW50cyIsImhhc2giLCJocmVmIiwicGFyYW1ldGVyIiwicGFyYW1ldGVyRGF0YSIsIl9yb290IiwiX2hhc2hSb3V0aW5nIiwiaGFzaFJvdXRpbmciLCJfcm91dGVzIiwicm91dGVzIiwiX2NvbnRyb2xsZXIiLCJjb250cm9sbGVyIiwibWF0Y2hSb3V0ZSIsInJvdXRlRnJhZ21lbnRzIiwibG9jYXRpb25GcmFnbWVudHMiLCJyb3V0ZU1hdGNoZXMiLCJfcm91dGVNYXRjaGVzIiwicm91dGVGcmFnbWVudCIsInJvdXRlRnJhZ21lbnRJbmRleCIsImxvY2F0aW9uRnJhZ21lbnQiLCJpbmRleE9mIiwiZ2V0Um91dGUiLCJyb3V0ZU5hbWUiLCJyb3V0ZVNldHRpbmdzIiwicm91dGUiLCJwb3BTdGF0ZSIsInJvdXRlRGF0YSIsImNhbGxiYWNrIiwicmVtb3ZlV2luZG93RXZlbnRzIiwibmF2aWdhdGUiLCJNVkMiLCJDaGFubmVscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0VBQUFBLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIsR0FBMkJGLFdB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
