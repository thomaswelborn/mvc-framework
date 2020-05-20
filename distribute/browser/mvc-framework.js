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
        var emit = (name, data, model) => this.emit(name, data, model);

        this.data[key].off('set', emit).off('unset', emit).on('set', (event, model) => emit(event.name, event.data, model)).on('unset', (event, model) => emit(event.name, event.data, model));
      }

      if (typeof silent === 'undefined' || silent === false && currentDataProperty !== value) {
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
      var _arguments = Array.from(arguments);

      var key, value, silent;

      if (_arguments.length === 3) {
        key = _arguments[0];
        value = _arguments[1];
        silent = _arguments[2];
        this.setDataProperty(key, value, silent);
        if (this.localStorage.endpoint) this.setDB(arguments[0], arguments[1]);
      } else if (_arguments.length === 2) {
        if (typeof _arguments[0] === 'object' && typeof _arguments[1] === 'boolean') {
          silent = _arguments[1];
          Object.entries(arguments[0]).forEach((_ref4) => {
            var [key, value] = _ref4;
            this.setDataProperty(key, value, silent);
          });
        } else {
          this.setDataProperty(_arguments[0], _arguments[1]);
        }

        if (this.localStorage.endpoint) this.setDB(_arguments[0], _arguments[1]);
      } else if (_arguments.length === 1 && !Array.isArray(_arguments[0]) && typeof _arguments[0] === 'object') {
        Object.entries(_arguments[0]).forEach((_ref5) => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxpdGllcy91dWlkLmpzIiwiLi4vLi4vc291cmNlL01WQy9TZXJ2aWNlL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Nb2RlbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29sbGVjdGlvbi9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVmlldy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ29udHJvbGxlci9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvUm91dGVyL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJFdmVudFRhcmdldC5wcm90b3R5cGUub24gPSBFdmVudFRhcmdldC5wcm90b3R5cGUub24gfHwgRXZlbnRUYXJnZXQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXJcclxuRXZlbnRUYXJnZXQucHJvdG90eXBlLm9mZiA9IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vZmYgfHwgRXZlbnRUYXJnZXQucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXJcclxuIiwiY2xhc3MgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9ldmVudHMoKSB7XHJcbiAgICB0aGlzLmV2ZW50cyA9IHRoaXMuZXZlbnRzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5ldmVudHNcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKSB7IHJldHVybiB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSB8fCB7fSB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIChldmVudENhbGxiYWNrLm5hbWUubGVuZ3RoKVxyXG4gICAgICA/IGV2ZW50Q2FsbGJhY2submFtZVxyXG4gICAgICA6ICdhbm9ueW1vdXNGdW5jdGlvbidcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSkge1xyXG4gICAgcmV0dXJuIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSB8fCBbXVxyXG4gIH1cclxuICBvbihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tOYW1lID0gdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tHcm91cCA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSlcclxuICAgIGV2ZW50Q2FsbGJhY2tHcm91cC5wdXNoKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gPSBldmVudENhbGxiYWNrR3JvdXBcclxuICAgIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdID0gZXZlbnRDYWxsYmFja3NcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIG9mZigpIHtcclxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIGNhc2UgMDpcclxuICAgICAgICBkZWxldGUgdGhpcy5ldmVudHNcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2sgPSBhcmd1bWVudHNbMV1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFja05hbWUgPSAodHlwZW9mIGV2ZW50Q2FsbGJhY2sgPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgPyBldmVudENhbGxiYWNrXHJcbiAgICAgICAgICA6IHRoaXMuZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgICAgICBpZih0aGlzLl9ldmVudHNbZXZlbnROYW1lXSkge1xyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdW2V2ZW50Q2FsbGJhY2tOYW1lXVxyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKS5sZW5ndGggPT09IDBcclxuICAgICAgICAgICkgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBlbWl0KCkge1xyXG4gICAgbGV0IF9hcmd1bWVudHMgPSBBcnJheS5mcm9tKGFyZ3VtZW50cylcclxuICAgIGxldCBldmVudE5hbWUgPSBfYXJndW1lbnRzLnNwbGljZSgwLCAxKVswXVxyXG4gICAgbGV0IGV2ZW50RGF0YSA9IF9hcmd1bWVudHMuc3BsaWNlKDAsIDEpWzBdXHJcbiAgICBsZXQgZXZlbnRBcmd1bWVudHMgPSBfYXJndW1lbnRzLnNwbGljZSgwKVxyXG4gICAgT2JqZWN0LmVudHJpZXModGhpcy5nZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpKVxyXG4gICAgICAuZm9yRWFjaCgoW2V2ZW50Q2FsbGJhY2tHcm91cE5hbWUsIGV2ZW50Q2FsbGJhY2tHcm91cF0pID0+IHtcclxuICAgICAgICBldmVudENhbGxiYWNrR3JvdXBcclxuICAgICAgICAgIC5mb3JFYWNoKChldmVudENhbGxiYWNrKSA9PiB7XHJcbiAgICAgICAgICAgIGV2ZW50Q2FsbGJhY2soXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogZXZlbnROYW1lLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogZXZlbnREYXRhXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAuLi5ldmVudEFyZ3VtZW50c1xyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgRXZlbnRzXHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9yZXNwb25zZXMoKSB7XHJcbiAgICB0aGlzLnJlc3BvbnNlcyA9IHRoaXMucmVzcG9uc2VzXHJcbiAgICAgID8gdGhpcy5yZXNwb25zZXNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMucmVzcG9uc2VzXHJcbiAgfVxyXG4gIHJlc3BvbnNlKHJlc3BvbnNlTmFtZSwgcmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgaWYgKHJlc3BvbnNlQ2FsbGJhY2spIHtcclxuICAgICAgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0gPSByZXNwb25zZUNhbGxiYWNrXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlXVxyXG4gICAgfVxyXG4gIH1cclxuICByZXF1ZXN0KHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYgKHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKSB7XHJcbiAgICAgIHZhciBfYXJndW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5zbGljZSgxKVxyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0oLi4uX2FyZ3VtZW50cylcclxuICAgIH1cclxuICB9XHJcbiAgb2ZmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYgKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZvciAodmFyIFtfcmVzcG9uc2VOYW1lXSBvZiBPYmplY3Qua2V5cyh0aGlzLl9yZXNwb25zZXMpKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tfcmVzcG9uc2VOYW1lXVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBDaGFubmVsIGZyb20gJy4vQ2hhbm5lbC9pbmRleCdcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2NoYW5uZWxzKCkge1xyXG4gICAgdGhpcy5jaGFubmVscyA9IHRoaXMuY2hhbm5lbHNcclxuICAgICAgPyB0aGlzLmNoYW5uZWxzXHJcbiAgICAgIDoge31cclxuICAgIHJldHVybiB0aGlzLmNoYW5uZWxzXHJcbiAgfVxyXG4gIGNoYW5uZWwoY2hhbm5lbE5hbWUpIHtcclxuICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXSA9IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA/IHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gICAgICA6IG5ldyBDaGFubmVsKClcclxuICAgIHJldHVybiB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbiAgb2ZmKGNoYW5uZWxOYW1lKSB7XHJcbiAgICBkZWxldGUgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgfVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFVVSUQoKSB7XHJcbiAgdmFyIHV1aWQgPSBcIlwiLCBpLCByYW5kb21cclxuICBmb3IgKGkgPSAwOyBpIDwgMzI7IGkrKykge1xyXG4gICAgcmFuZG9tID0gTWF0aC5yYW5kb20oKSAqIDE2IHwgMFxyXG5cclxuICAgIGlmIChpID09IDggfHwgaSA9PSAxMiB8fCBpID09IDE2IHx8IGkgPT0gMjApIHtcclxuICAgICAgdXVpZCArPSBcIi1cIlxyXG4gICAgfVxyXG4gICAgdXVpZCArPSAoaSA9PSAxMiA/IDQgOiAoaSA9PSAxNiA/IChyYW5kb20gJiAzIHwgOCkgOiByYW5kb20pKS50b1N0cmluZygxNilcclxuICB9XHJcbiAgcmV0dXJuIHV1aWRcclxufVxyXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleCdcblxuY2xhc3MgU2VydmljZSBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ3VybCcsXG4gICAgJ21ldGhvZCcsXG4gICAgJ21vZGUnLFxuICAgICdjYWNoZScsXG4gICAgJ2NyZWRlbnRpYWxzJyxcbiAgICAnaGVhZGVycycsXG4gICAgJ3BhcmFtZXRlcnMnLFxuICAgICdyZWRpcmVjdCcsXG4gICAgJ3JlZmVycmVyLXBvbGljeScsXG4gICAgJ2JvZHknLFxuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCB1cmwoKSB7XG4gICAgaWYodGhpcy5wYXJhbWV0ZXJzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsLmNvbmNhdCh0aGlzLnF1ZXJ5U3RyaW5nKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXJsXG4gICAgfVxuICB9XG4gIHNldCB1cmwodXJsKSB7IHRoaXMuX3VybCA9IHVybCB9XG4gIGdldCBxdWVyeVN0cmluZygpIHtcbiAgICBsZXQgcXVlcnlTdHJpbmcgPSAnJ1xuICAgIGlmKHRoaXMucGFyYW1ldGVycykge1xuICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IE9iamVjdC5lbnRyaWVzKHRoaXMucGFyYW1ldGVycylcbiAgICAgICAgLnJlZHVjZSgocGFyYW1ldGVyU3RyaW5ncywgW3BhcmFtZXRlcktleSwgcGFyYW1ldGVyVmFsdWVdKSA9PiB7XG4gICAgICAgICAgbGV0IHBhcmFtZXRlclN0cmluZyA9IHBhcmFtZXRlcktleS5jb25jYXQoJz0nLCBwYXJhbWV0ZXJWYWx1ZSlcbiAgICAgICAgICBwYXJhbWV0ZXJTdHJpbmdzLnB1c2gocGFyYW1ldGVyU3RyaW5nKVxuICAgICAgICAgIHJldHVybiBwYXJhbWV0ZXJTdHJpbmdzXG4gICAgICAgIH0sIFtdKVxuICAgICAgICAgIC5qb2luKCcmJylcbiAgICAgIHF1ZXJ5U3RyaW5nID0gJz8nLmNvbmNhdChwYXJhbWV0ZXJTdHJpbmcpXG4gICAgfVxuICAgIHJldHVybiBxdWVyeVN0cmluZ1xuICB9XG4gIGdldCBtZXRob2QoKSB7IHJldHVybiB0aGlzLl9tZXRob2QgfVxuICBzZXQgbWV0aG9kKG1ldGhvZCkgeyB0aGlzLl9tZXRob2QgPSBtZXRob2QgfVxuICBzZXQgbW9kZShtb2RlKSB7IHRoaXMuX21vZGUgPSBtb2RlIH1cbiAgZ2V0IG1vZGUoKSB7IHJldHVybiB0aGlzLl9tb2RlIH1cbiAgc2V0IGNhY2hlKGNhY2hlKSB7IHRoaXMuX2NhY2hlID0gY2FjaGUgfVxuICBnZXQgY2FjaGUoKSB7IHJldHVybiB0aGlzLl9jYWNoZSB9XG4gIHNldCBjcmVkZW50aWFscyhjcmVkZW50aWFscykgeyB0aGlzLl9jcmVkZW50aWFscyA9IGNyZWRlbnRpYWxzIH1cbiAgZ2V0IGNyZWRlbnRpYWxzKCkgeyByZXR1cm4gdGhpcy5fY3JlZGVudGlhbHMgfVxuICBzZXQgaGVhZGVycyhoZWFkZXJzKSB7IHRoaXMuX2hlYWRlcnMgPSBoZWFkZXJzIH1cbiAgZ2V0IGhlYWRlcnMoKSB7IHJldHVybiB0aGlzLl9oZWFkZXJzIH1cbiAgc2V0IHJlZGlyZWN0KHJlZGlyZWN0KSB7IHRoaXMuX3JlZGlyZWN0ID0gcmVkaXJlY3QgfVxuICBnZXQgcmVkaXJlY3QoKSB7IHJldHVybiB0aGlzLl9yZWRpcmVjdCB9XG4gIHNldCByZWZlcnJlclBvbGljeShyZWZlcnJlclBvbGljeSkgeyB0aGlzLl9yZWZlcnJlclBvbGljeSA9IHJlZmVycmVyUG9saWN5IH1cbiAgZ2V0IHJlZmVycmVyUG9saWN5KCkgeyByZXR1cm4gdGhpcy5fcmVmZXJyZXJQb2xpY3kgfVxuICBzZXQgYm9keShib2R5KSB7IHRoaXMuX2JvZHkgPSBib2R5IH1cbiAgZ2V0IGJvZHkoKSB7IHJldHVybiB0aGlzLl9ib2R5IH1cbiAgZ2V0IHBhcmFtZXRlcnMoKSB7IHJldHVybiB0aGlzLl9wYXJhbWV0ZXJzIHx8IG51bGwgfVxuICBzZXQgcGFyYW1ldGVycyhwYXJhbWV0ZXJzKSB7IHRoaXMuX3BhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzIH1cbiAgZ2V0IHByZXZpb3VzQWJvcnRDb250cm9sbGVyKCkge1xuICAgIHJldHVybiB0aGlzLl9wcmV2aW91c0Fib3J0Q29udHJvbGxlclxuICB9XG4gIHNldCBwcmV2aW91c0Fib3J0Q29udHJvbGxlcihwcmV2aW91c0Fib3J0Q29udHJvbGxlcikgeyB0aGlzLl9wcmV2aW91c0Fib3J0Q29udHJvbGxlciA9IHByZXZpb3VzQWJvcnRDb250cm9sbGVyIH1cbiAgZ2V0IGFib3J0Q29udHJvbGxlcigpIHtcbiAgICBpZighdGhpcy5fYWJvcnRDb250cm9sbGVyKSB7XG4gICAgICB0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyID0gdGhpcy5fYWJvcnRDb250cm9sbGVyXG4gICAgfVxuICAgIHRoaXMuX2Fib3J0Q29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKVxuICAgIHJldHVybiB0aGlzLl9hYm9ydENvbnRyb2xsZXJcbiAgfVxuICBhYm9ydCgpIHtcbiAgICB0aGlzLmFib3J0Q29udHJvbGxlci5hYm9ydCgpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBmZXRjaCgpIHtcbiAgICBjb25zdCBmZXRjaE9wdGlvbnMgPSB0aGlzLnZhbGlkU2V0dGluZ3MucmVkdWNlKChfZmV0Y2hPcHRpb25zLCBmZXRjaE9wdGlvbk5hbWUpID0+IHtcbiAgICAgIGlmKHRoaXNbZmV0Y2hPcHRpb25OYW1lXSkgX2ZldGNoT3B0aW9uc1tmZXRjaE9wdGlvbk5hbWVdID0gdGhpc1tmZXRjaE9wdGlvbk5hbWVdXG4gICAgICByZXR1cm4gX2ZldGNoT3B0aW9uc1xuICAgIH0sIHt9KVxuICAgIGZldGNoT3B0aW9ucy5zaWduYWwgPSB0aGlzLmFib3J0Q29udHJvbGxlci5zaWduYWxcbiAgICBpZih0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyKSB0aGlzLnByZXZpb3VzQWJvcnRDb250cm9sbGVyLmFib3J0KClcbiAgICByZXR1cm4gZmV0Y2godGhpcy51cmwsIGZldGNoT3B0aW9ucylcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgaWYoXG4gICAgICAgICAgZGF0YS5jb2RlID49IDQwMCAmJlxuICAgICAgICAgIGRhdGEuY29kZSA8PSA0OTlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhyb3cgZGF0YVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgICAgICdyZWFkeScsXG4gICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICApXG4gICAgICAgICAgcmV0dXJuIGRhdGFcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KFxuICAgICAgICAgICdlcnJvcicsXG4gICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gZXJyb3JcbiAgICAgIH0pXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFNlcnZpY2VcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xuaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4uL1V0aWxpdGllcy9pbmRleCdcblxuY29uc3QgTW9kZWwgPSBjbGFzcyBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy5lbWl0KFxuICAgICAgJ3JlYWR5JyxcbiAgICAgIHt9LFxuICAgICAgdGhpcyxcbiAgICApXG4gIH1cbiAgZ2V0IHV1aWQoKSB7XG4gICAgaWYoIXRoaXMuX3V1aWQpIHRoaXMuX3V1aWQgPSBVVUlEKClcbiAgICByZXR1cm4gdGhpcy5fdXVpZFxuICB9XG4gIGdldCB2YWxpZFNldHRpbmdzKCkgeyByZXR1cm4gW1xuICAgICdsb2NhbFN0b3JhZ2UnLFxuICAgICdkZWZhdWx0cycsXG4gICAgJ3NlcnZpY2VzJyxcbiAgICAnc2VydmljZUV2ZW50cycsXG4gICAgJ3NlcnZpY2VDYWxsYmFja3MnLFxuICBdIH1cbiAgZ2V0IGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXMoKSB7IHJldHVybiBbXG4gICAgJ3NlcnZpY2UnLFxuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gICAgdGhpcy5iaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzXG4gICAgICAuZm9yRWFjaCgoYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlKSA9PiB7XG4gICAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSwgJ29uJylcbiAgICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCBzZXJ2aWNlcygpIHtcbiAgICBpZighdGhpcy5fc2VydmljZXMpIHRoaXMuX3NlcnZpY2VzID0ge31cbiAgICByZXR1cm4gdGhpcy5fc2VydmljZXNcbiAgfVxuICBzZXQgc2VydmljZXMoc2VydmljZXMpIHsgdGhpcy5fc2VydmljZXMgPSBzZXJ2aWNlcyB9XG4gIGdldCBkYXRhKCkge1xuICAgIGlmKCF0aGlzLl9kYXRhKSB0aGlzLl9kYXRhID0ge31cbiAgICByZXR1cm4gdGhpcy5fZGF0YVxuICB9XG4gIGdldCBkZWZhdWx0cygpIHtcbiAgICBpZighdGhpcy5fZGVmYXVsdHMpIHRoaXMuX2RlZmF1bHRzID0ge31cbiAgICByZXR1cm4gdGhpcy5fZGVmYXVsdHNcbiAgfVxuICBzZXQgZGVmYXVsdHMoZGVmYXVsdHMpIHtcbiAgICBpZih0aGlzLmxvY2FsU3RvcmFnZS5zeW5jID09PSB0cnVlKSB7XG4gICAgICBpZihPYmplY3QuZW50cmllcyh0aGlzLmRiKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZGVmYXVsdHMgPSB0aGlzLmRiXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2RlZmF1bHRzID0gZGVmYXVsdHNcbiAgICB9XG4gICAgdGhpcy5zZXQodGhpcy5kZWZhdWx0cylcbiAgfVxuICBnZXQgbG9jYWxTdG9yYWdlKCkgeyByZXR1cm4gdGhpcy5fbG9jYWxTdG9yYWdlIHx8IHt9IH1cbiAgc2V0IGxvY2FsU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHsgdGhpcy5fbG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yYWdlIH1cbiAgZ2V0IHN0b3JhZ2VDb250YWluZXIoKSB7IHJldHVybiB7fSB9XG4gIGdldCBkYigpIHsgcmV0dXJuIHRoaXMuX2RiIH1cbiAgZ2V0IF9kYigpIHtcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgfHwgSlNPTi5zdHJpbmdpZnkodGhpcy5zdG9yYWdlQ29udGFpbmVyKVxuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICByZXNldEV2ZW50cyhjbGFzc1R5cGUpIHtcbiAgICBbXG4gICAgICAnb2ZmJyxcbiAgICAgICdvbidcbiAgICBdLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICAgICAgdGhpcy50b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpXG4gICAgfSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZCkge1xuICAgIGNvbnN0IGJhc2VOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgncycpXG4gICAgY29uc3QgYmFzZUV2ZW50c05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdFdmVudHMnKVxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3NOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJylcbiAgICBjb25zdCBiYXNlID0gdGhpc1tiYXNlTmFtZV1cbiAgICBjb25zdCBiYXNlRXZlbnRzID0gdGhpc1tiYXNlRXZlbnRzTmFtZV1cbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzID0gdGhpc1tiYXNlQ2FsbGJhY2tzTmFtZV1cbiAgICBpZihcbiAgICAgIGJhc2UgJiZcbiAgICAgIGJhc2VFdmVudHMgJiZcbiAgICAgIGJhc2VDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKGJhc2VFdmVudHMpXG4gICAgICAgIC5mb3JFYWNoKChbYmFzZUV2ZW50RGF0YSwgYmFzZUNhbGxiYWNrTmFtZV0pID0+IHtcbiAgICAgICAgICBsZXQgW2Jhc2VUYXJnZXROYW1lLCBiYXNlRXZlbnROYW1lXSA9IGJhc2VFdmVudERhdGEuc3BsaXQoJyAnKVxuICAgICAgICAgIGxldCBiYXNlVGFyZ2V0ID0gYmFzZVtiYXNlVGFyZ2V0TmFtZV1cbiAgICAgICAgICBsZXQgYmFzZUNhbGxiYWNrID0gYmFzZUNhbGxiYWNrc1tiYXNlQ2FsbGJhY2tOYW1lXVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrICYmXG4gICAgICAgICAgICBiYXNlQ2FsbGJhY2submFtZS5zcGxpdCgnICcpLmxlbmd0aCA9PT0gMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZUNhbGxiYWNrID0gYmFzZUNhbGxiYWNrLmJpbmQodGhpcylcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldCAmJlxuICAgICAgICAgICAgYmFzZUNhbGxiYWNrXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBiYXNlVGFyZ2V0W21ldGhvZF0oYmFzZUV2ZW50TmFtZSwgYmFzZUNhbGxiYWNrKVxuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge31cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0REIoKSB7XG4gICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICB2YXIgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBsZXQgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgZGJba2V5XSA9IHZhbHVlXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHRoaXMuX2RiID0gZGJcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0REIoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZGVsZXRlIHRoaXMuX2RiXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgZGVsZXRlIGRiW2tleV1cbiAgICAgICAgdGhpcy5fZGIgPSBkYlxuICAgICAgICBicmVha1xuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlLCBzaWxlbnQpIHtcbiAgICBjb25zdCBjdXJyZW50RGF0YVByb3BlcnR5ID0gdGhpcy5kYXRhW2tleV1cbiAgICBpZighY3VycmVudERhdGFQcm9wZXJ0eSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcy5kYXRhLCB7XG4gICAgICAgIFsnXycuY29uY2F0KGtleSldOiB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBba2V5XToge1xuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNbJ18nLmNvbmNhdChrZXkpXSB9LFxuICAgICAgICAgIHNldCh2YWx1ZSkgeyB0aGlzWydfJy5jb25jYXQoa2V5KV0gPSB2YWx1ZSB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLmRhdGFba2V5XSA9IHZhbHVlXG4gICAgaWYoY3VycmVudERhdGFQcm9wZXJ0eSBpbnN0YW5jZW9mIE1vZGVsKSB7XG4gICAgICBjb25zdCBlbWl0ID0gKG5hbWUsIGRhdGEgLG1vZGVsKSA9PiB0aGlzLmVtaXQobmFtZSwgZGF0YSwgbW9kZWwpXG4gICAgICB0aGlzLmRhdGFba2V5XVxuICAgICAgICAub2ZmKCdzZXQnLCBlbWl0KVxuICAgICAgICAub2ZmKCd1bnNldCcsIGVtaXQpXG4gICAgICAgIC5vbignc2V0JywgKGV2ZW50LCBtb2RlbCkgPT4gZW1pdChldmVudC5uYW1lLCBldmVudC5kYXRhLCBtb2RlbCkpXG4gICAgICAgIC5vbigndW5zZXQnLCAoZXZlbnQsIG1vZGVsKSA9PiBlbWl0KGV2ZW50Lm5hbWUsIGV2ZW50LmRhdGEsIG1vZGVsKSlcbiAgICB9XG4gICAgaWYoXG4gICAgICB0eXBlb2Ygc2lsZW50ID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgc2lsZW50ID09PSBmYWxzZSAmJlxuICAgICAgY3VycmVudERhdGFQcm9wZXJ0eSAhPT0gdmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuZW1pdCgnc2V0Jy5jb25jYXQoJzonLCBrZXkpLCB7XG4gICAgICAgIGtleToga2V5LFxuICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgIH0sIHRoaXMpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdW5zZXREYXRhUHJvcGVydHkoa2V5LCBzaWxlbnQpIHtcbiAgICBpZih0aGlzLmRhdGFba2V5XSkge1xuICAgICAgZGVsZXRlIHRoaXMuZGF0YVtrZXldXG4gICAgfVxuICAgIGlmKFxuICAgICAgKFxuICAgICAgICB0eXBlb2Ygc2lsZW50ID09PSAnYm9vbGVhbicgJiZcbiAgICAgICAgc2lsZW50ID09PSBmYWxzZVxuICAgICAgKSB8fFxuICAgICAgdHlwZW9mIHNpbGVudCA9PT0gJ3VuZGVmaW5lZCdcbiAgICApIHtcbiAgICAgIHRoaXMuZW1pdCgndW5zZXQnLmNvbmNhdCgnOicsIGFyZ3VtZW50c1swXSksIHRoaXMpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZ2V0KCkge1xuICAgIGlmKGFyZ3VtZW50c1swXSkgcmV0dXJuIHRoaXMuZGF0YVthcmd1bWVudHNbMF1dXG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHRoaXMuZGF0YSlcbiAgICAgIC5yZWR1Y2UoKF9kYXRhLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgX2RhdGFba2V5XSA9IHZhbHVlXG4gICAgICAgIHJldHVybiBfZGF0YVxuICAgICAgfSwge30pXG4gIH1cbiAgc2V0KCkge1xuICAgIGNvbnN0IF9hcmd1bWVudHMgPSBBcnJheS5mcm9tKGFyZ3VtZW50cylcbiAgICB2YXIga2V5LCB2YWx1ZSwgc2lsZW50XG4gICAgaWYoX2FyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIGtleSA9IF9hcmd1bWVudHNbMF1cbiAgICAgIHZhbHVlID0gX2FyZ3VtZW50c1sxXVxuICAgICAgc2lsZW50ID0gX2FyZ3VtZW50c1syXVxuICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KVxuICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHRoaXMuc2V0REIoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pXG4gICAgfSBlbHNlIGlmKF9hcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICBpZihcbiAgICAgICAgdHlwZW9mIF9hcmd1bWVudHNbMF0gPT09ICdvYmplY3QnICYmXG4gICAgICAgIHR5cGVvZiBfYXJndW1lbnRzWzFdID09PSAnYm9vbGVhbidcbiAgICAgICkge1xuICAgICAgICBzaWxlbnQgPSBfYXJndW1lbnRzWzFdXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSkuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSwgc2lsZW50KVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXREYXRhUHJvcGVydHkoX2FyZ3VtZW50c1swXSwgX2FyZ3VtZW50c1sxXSlcbiAgICAgIH1cbiAgICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KSB0aGlzLnNldERCKF9hcmd1bWVudHNbMF0sIF9hcmd1bWVudHNbMV0pXG4gICAgfSBlbHNlIGlmKFxuICAgICAgX2FyZ3VtZW50cy5sZW5ndGggPT09IDEgJiZcbiAgICAgICFBcnJheS5pc0FycmF5KF9hcmd1bWVudHNbMF0pICYmXG4gICAgICB0eXBlb2YgX2FyZ3VtZW50c1swXSA9PT0gJ29iamVjdCdcbiAgICApIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKF9hcmd1bWVudHNbMF0pLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgdGhpcy5zZXREQihrZXksIHZhbHVlKVxuICAgICAgfSlcbiAgICB9XG4gICAgaWYoIXNpbGVudCkgdGhpcy5lbWl0KCdzZXQnLCB0aGlzLmRhdGEsIHRoaXMpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldCgpIHtcbiAgICBsZXQgc2lsZW50XG4gICAgaWYoXG4gICAgICBhcmd1bWVudHMubGVuZ3RoID09PSAyXG4gICAgKSB7XG4gICAgICBzaWxlbnQgPSBhcmd1bWVudHNbMV1cbiAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoYXJndW1lbnRzWzBdLCBzaWxlbnQpXG4gICAgfSBlbHNlIGlmKFxuICAgICAgYXJndW1lbnRzLmxlbmd0aCA9PT0gMVxuICAgICkge1xuICAgICAgaWYodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHNpbGVudCA9IGFyZ3VtZW50c1swXVxuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLmRhdGEpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5LCBzaWxlbnQpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZGF0YSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgfSlcbiAgICB9XG4gICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHRoaXMudW5zZXREQihrZXkpXG4gICAgdGhpcy5lbWl0KCd1bnNldCcsIHRoaXMpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBwYXJzZShkYXRhID0gdGhpcy5kYXRhKSB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKGRhdGEpLnJlZHVjZSgoX2RhdGEsIFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgaWYodmFsdWUgaW5zdGFuY2VvZiBNb2RlbCkge1xuICAgICAgICBfZGF0YVtrZXldID0gdmFsdWUucGFyc2UoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2RhdGFba2V5XSA9IHZhbHVlXG4gICAgICB9XG4gICAgICByZXR1cm4gX2RhdGFcbiAgICB9LCB7fSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNb2RlbFxuIiwiaW1wb3J0IHsgVVVJRCB9IGZyb20gJy4uL1V0aWxpdGllcy9pbmRleC5qcydcclxuaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXguanMnXHJcbmltcG9ydCBNb2RlbCBmcm9tICcuLi9Nb2RlbC9pbmRleC5qcydcclxuXHJcbmNsYXNzIENvbGxlY3Rpb24gZXh0ZW5kcyBFdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXHJcbiAgfVxyXG4gIGdldCB2YWxpZFNldHRpbmdzKCkgeyByZXR1cm4gW1xyXG4gICAgJ2lkQXR0cmlidXRlJyxcclxuICAgICdtb2RlbCcsXHJcbiAgICAnZGVmYXVsdHMnLFxyXG4gICAgJ3NlcnZpY2VzJyxcclxuICAgICdzZXJ2aWNlRXZlbnRzJyxcclxuICAgICdzZXJ2aWNlQ2FsbGJhY2tzJyxcclxuICAgICdsb2NhbFN0b3JhZ2UnXHJcbiAgXSB9XHJcbiAgZ2V0IGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXMoKSB7IHJldHVybiBbXHJcbiAgICAnc2VydmljZSdcclxuICBdIH1cclxuICBnZXQgc2V0dGluZ3MoKSB7IHJldHVybiB0aGlzLl9zZXR0aW5ncyB9XHJcbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XHJcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3MuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XHJcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cclxuICAgIH0pXHJcbiAgICB0aGlzLmJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXNcclxuICAgICAgLmZvckVhY2goKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSkgPT4ge1xyXG4gICAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSwgJ29uJylcclxuICAgICAgfSlcclxuICB9XHJcbiAgZ2V0IG9wdGlvbnMoKSB7XHJcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XHJcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xyXG4gIH1cclxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cclxuICBnZXQgc3RvcmFnZUNvbnRhaW5lcigpIHsgcmV0dXJuIFtdIH1cclxuICBnZXQgZGVmYXVsdElEQXR0cmlidXRlKCkgeyByZXR1cm4gJ19pZCcgfVxyXG4gIGdldCBkZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuX2RlZmF1bHRzIH1cclxuICBzZXQgZGVmYXVsdHMoZGVmYXVsdHMpIHtcclxuICAgIHRoaXMuX2RlZmF1bHRzID0gZGVmYXVsdHNcclxuICAgIHRoaXMuYWRkKGRlZmF1bHRzKVxyXG4gIH1cclxuICBnZXQgdXVpZCgpIHtcclxuICAgIGlmKCF0aGlzLl91dWlkKSB0aGlzLl91dWlkID0gVXRpbGl0aWVzLlVVSUQoKVxyXG4gICAgcmV0dXJuIHRoaXMuX3V1aWRcclxuICB9XHJcbiAgZ2V0IG1vZGVscygpIHtcclxuICAgIHRoaXMuX21vZGVscyA9IHRoaXMuX21vZGVscyB8fCB0aGlzLnN0b3JhZ2VDb250YWluZXJcclxuICAgIHJldHVybiB0aGlzLl9tb2RlbHNcclxuICB9XHJcbiAgc2V0IG1vZGVscyhtb2RlbHNEYXRhKSB7IHRoaXMuX21vZGVscyA9IG1vZGVsc0RhdGEgfVxyXG4gIGdldCBtb2RlbCgpIHsgcmV0dXJuIHRoaXMuX21vZGVsIH1cclxuICBzZXQgbW9kZWwobW9kZWwpIHsgdGhpcy5fbW9kZWwgPSBtb2RlbCB9XHJcbiAgZ2V0IGxvY2FsU3RvcmFnZSgpIHsgcmV0dXJuIHRoaXMuX2xvY2FsU3RvcmFnZSB9XHJcbiAgc2V0IGxvY2FsU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHsgdGhpcy5fbG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yYWdlIH1cclxuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGEgfVxyXG4gIGdldCBkYXRhKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX21vZGVsc1xyXG4gICAgICAubWFwKChtb2RlbCkgPT4gbW9kZWwucGFyc2UoKSlcclxuICB9XHJcbiAgZ2V0IGRiKCkgeyByZXR1cm4gdGhpcy5fZGIgfVxyXG4gIGdldCBkYigpIHtcclxuICAgIGxldCBkYiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KSB8fCBKU09OLnN0cmluZ2lmeSh0aGlzLnN0b3JhZ2VDb250YWluZXIpXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkYilcclxuICB9XHJcbiAgc2V0IGRiKGRiKSB7XHJcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQsIGRiKVxyXG4gIH1cclxuICByZXNldEV2ZW50cyhjbGFzc1R5cGUpIHtcclxuICAgIFtcclxuICAgICAgJ29mZicsXHJcbiAgICAgICdvbidcclxuICAgIF0uZm9yRWFjaCgobWV0aG9kKSA9PiB7XHJcbiAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKVxyXG4gICAgfSlcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZCkge1xyXG4gICAgY29uc3QgYmFzZU5hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdzJylcclxuICAgIGNvbnN0IGJhc2VFdmVudHNOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJylcclxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3NOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJylcclxuICAgIGNvbnN0IGJhc2UgPSB0aGlzW2Jhc2VOYW1lXVxyXG4gICAgY29uc3QgYmFzZUV2ZW50cyA9IHRoaXNbYmFzZUV2ZW50c05hbWVdXHJcbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzID0gdGhpc1tiYXNlQ2FsbGJhY2tzTmFtZV1cclxuICAgIGlmKFxyXG4gICAgICBiYXNlICYmXHJcbiAgICAgIGJhc2VFdmVudHMgJiZcclxuICAgICAgYmFzZUNhbGxiYWNrc1xyXG4gICAgKSB7XHJcbiAgICAgIE9iamVjdC5lbnRyaWVzKGJhc2VFdmVudHMpXHJcbiAgICAgICAgLmZvckVhY2goKFtiYXNlRXZlbnREYXRhLCBiYXNlQ2FsbGJhY2tOYW1lXSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgW2Jhc2VUYXJnZXROYW1lLCBiYXNlRXZlbnROYW1lXSA9IGJhc2VFdmVudERhdGEuc3BsaXQoJyAnKVxyXG4gICAgICAgICAgY29uc3QgYmFzZVRhcmdldCA9IGJhc2VbYmFzZVRhcmdldE5hbWVdXHJcbiAgICAgICAgICBjb25zdCBiYXNlRXZlbnRDYWxsYmFjayA9IGJhc2VDYWxsYmFja3NbYmFzZUNhbGxiYWNrTmFtZV1cclxuICAgICAgICAgIGlmKFxyXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxyXG4gICAgICAgICAgICBiYXNlRXZlbnROYW1lICYmXHJcbiAgICAgICAgICAgIGJhc2VUYXJnZXQgJiZcclxuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2tcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge31cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgZ2V0TW9kZWxJbmRleChtb2RlbFVVSUQpIHtcclxuICAgIGxldCBtb2RlbEluZGV4XHJcbiAgICB0aGlzLl9tb2RlbHNcclxuICAgICAgLmZpbmQoKF9tb2RlbCwgX21vZGVsSW5kZXgpID0+IHtcclxuICAgICAgICBpZihfbW9kZWwgIT09IG51bGwpIHtcclxuICAgICAgICAgIGlmKFxyXG4gICAgICAgICAgICBfbW9kZWwgaW5zdGFuY2VvZiBNb2RlbCAmJlxyXG4gICAgICAgICAgICBfbW9kZWwuX3V1aWQgPT09IG1vZGVsVVVJRFxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIG1vZGVsSW5kZXggPSBfbW9kZWxJbmRleFxyXG4gICAgICAgICAgICByZXR1cm4gX21vZGVsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgcmV0dXJuIG1vZGVsSW5kZXhcclxuICB9XHJcbiAgcmVtb3ZlTW9kZWxCeUluZGV4KG1vZGVsSW5kZXgpIHtcclxuICAgIGxldCBtb2RlbCA9IHRoaXMuX21vZGVscy5zcGxpY2UobW9kZWxJbmRleCwgMSwgbnVsbClcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ3JlbW92ZTptb2RlbCcsXHJcbiAgICAgIG1vZGVsWzBdLnBhcnNlKCksXHJcbiAgICAgIHRoaXMsXHJcbiAgICAgIG1vZGVsWzBdXHJcbiAgICApXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBhZGRNb2RlbChtb2RlbERhdGEpIHtcclxuICAgIGxldCBtb2RlbFxyXG4gICAgbGV0IHNvbWVNb2RlbCA9IG5ldyBNb2RlbCgpXHJcbiAgICBpZihtb2RlbERhdGEgaW5zdGFuY2VvZiBNb2RlbCkge1xyXG4gICAgICBtb2RlbCA9IG1vZGVsRGF0YVxyXG4gICAgfSBlbHNlIGlmKFxyXG4gICAgICB0aGlzLm1vZGVsXHJcbiAgICApIHtcclxuICAgICAgbW9kZWwgPSBuZXcgdGhpcy5tb2RlbCgpXHJcbiAgICAgIG1vZGVsLnNldChtb2RlbERhdGEpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtb2RlbCA9IG5ldyBNb2RlbCgpXHJcbiAgICAgIG1vZGVsLnNldChtb2RlbERhdGEpXHJcbiAgICB9XHJcbiAgICBtb2RlbC5vbihcclxuICAgICAgJ3NldCcsXHJcbiAgICAgIChldmVudCwgX21vZGVsKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbWl0KFxyXG4gICAgICAgICAgJ2NoYW5nZTptb2RlbCcsXHJcbiAgICAgICAgICB0aGlzLnBhcnNlKCksXHJcbiAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgbW9kZWwsXHJcbiAgICAgICAgKVxyXG4gICAgICB9XHJcbiAgICApXHJcbiAgICB0aGlzLm1vZGVscy5wdXNoKG1vZGVsKVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAnYWRkJyxcclxuICAgICAgbW9kZWwucGFyc2UoKSxcclxuICAgICAgdGhpcyxcclxuICAgICAgbW9kZWxcclxuICAgIClcclxuICAgIHJldHVybiBtb2RlbFxyXG4gIH1cclxuICBhZGQobW9kZWxEYXRhKSB7XHJcbiAgICBpZihBcnJheS5pc0FycmF5KG1vZGVsRGF0YSkpIHtcclxuICAgICAgbW9kZWxEYXRhXHJcbiAgICAgICAgLmZvckVhY2goKG1vZGVsKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmFkZE1vZGVsKG1vZGVsKVxyXG4gICAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmFkZE1vZGVsKG1vZGVsRGF0YSlcclxuICAgIH1cclxuICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlKSB0aGlzLmRiID0gdGhpcy5kYXRhXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdjaGFuZ2UnLFxyXG4gICAgICB0aGlzLnBhcnNlKCksXHJcbiAgICAgIHRoaXNcclxuICAgIClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHJlbW92ZShtb2RlbERhdGEpIHtcclxuICAgIGlmKFxyXG4gICAgICAhQXJyYXkuaXNBcnJheShtb2RlbERhdGEpICYmXHJcbiAgICAgIHR5cGVvZiBtb2RlbERhdGEgPT09ICdvYmplY3QnXHJcbiAgICApIHtcclxuICAgICAgdmFyIG1vZGVsSW5kZXggPSB0aGlzLmdldE1vZGVsSW5kZXgobW9kZWxEYXRhLnV1aWQpXHJcbiAgICAgIHRoaXMucmVtb3ZlTW9kZWxCeUluZGV4KG1vZGVsSW5kZXgpXHJcbiAgICB9IGVsc2UgaWYoQXJyYXkuaXNBcnJheShtb2RlbERhdGEpKSB7XHJcbiAgICAgIG1vZGVsRGF0YVxyXG4gICAgICAgIC5mb3JFYWNoKChtb2RlbCkgPT4ge1xyXG4gICAgICAgICAgdmFyIG1vZGVsSW5kZXggPSB0aGlzLmdldE1vZGVsSW5kZXgobW9kZWwudXVpZClcclxuICAgICAgICAgIHRoaXMucmVtb3ZlTW9kZWxCeUluZGV4KG1vZGVsSW5kZXgpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuICAgIHRoaXMubW9kZWxzID0gdGhpcy5tb2RlbHNcclxuICAgICAgLmZpbHRlcigobW9kZWwpID0+IG1vZGVsICE9PSBudWxsKVxyXG4gICAgaWYodGhpcy5fbG9jYWxTdG9yYWdlKSB0aGlzLmRiID0gdGhpcy5kYXRhXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdyZW1vdmUnLFxyXG4gICAgICB0aGlzLnBhcnNlKCksXHJcbiAgICAgIHRoaXNcclxuICAgIClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHJlc2V0KCkge1xyXG4gICAgdGhpcy5yZW1vdmUodGhpcy5fbW9kZWxzKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcGFyc2UoZGF0YSkge1xyXG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5kYXRhIHx8IHRoaXMuc3RvcmFnZUNvbnRhaW5lclxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb2xsZWN0aW9uXHJcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xuXG5jbGFzcyBWaWV3IGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAnYXR0cmlidXRlcycsXG4gICAgJ2VsZW1lbnROYW1lJyxcbiAgICAnZWxlbWVudCcsXG4gICAgJ2luc2VydCcsXG4gICAgJ3RlbXBsYXRlJyxcbiAgICAndWlFbGVtZW50cycsXG4gICAgJ3VpRWxlbWVudEV2ZW50cycsXG4gICAgJ3VpRWxlbWVudENhbGxiYWNrcycsXG4gICAgJ3JlbmRlcidcbiAgXSB9XG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICB9KVxuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgZWxlbWVudE5hbWUoKSB7IHJldHVybiB0aGlzLl9lbGVtZW50TmFtZSB9XG4gIHNldCBlbGVtZW50TmFtZShlbGVtZW50TmFtZSkgeyB0aGlzLl9lbGVtZW50TmFtZSA9IGVsZW1lbnROYW1lIH1cbiAgZ2V0IGVsZW1lbnQoKSB7XG4gICAgaWYoIXRoaXMuX2VsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMuZWxlbWVudE5hbWUpXG4gICAgICBPYmplY3QuZW50cmllcyh0aGlzLmF0dHJpYnV0ZXMpLmZvckVhY2goKFthdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlXSkgPT4ge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKVxuICAgICAgfSlcbiAgICAgIHRoaXMuZWxlbWVudE9ic2VydmVyLm9ic2VydmUodGhpcy5lbGVtZW50LCB7XG4gICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50XG4gIH1cbiAgZ2V0IGVsZW1lbnRPYnNlcnZlcigpIHtcbiAgICB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgPSB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgfHwgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoXG4gICAgICB0aGlzLmVsZW1lbnRPYnNlcnZlLmJpbmQodGhpcylcbiAgICApXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRPYnNlcnZlclxuICB9XG4gIHNldCBlbGVtZW50KGVsZW1lbnQpIHtcbiAgICBpZihlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50XG4gIH1cbiAgZ2V0IGF0dHJpYnV0ZXMoKSB7IHJldHVybiB0aGlzLl9hdHRyaWJ1dGVzIHx8IHt9IH1cbiAgc2V0IGF0dHJpYnV0ZXMoYXR0cmlidXRlcykgeyB0aGlzLl9hdHRyaWJ1dGVzID0gYXR0cmlidXRlcyB9XG4gIGdldCB0ZW1wbGF0ZSgpIHsgcmV0dXJuIHRoaXMuX3RlbXBsYXRlIH1cbiAgc2V0IHRlbXBsYXRlKHRlbXBsYXRlKSB7IHRoaXMuX3RlbXBsYXRlID0gdGVtcGxhdGUgfVxuICBnZXQgdWlFbGVtZW50cygpIHsgcmV0dXJuIHRoaXMuX3VpRWxlbWVudHMgfHwge30gfVxuICBzZXQgdWlFbGVtZW50cyh1aUVsZW1lbnRzKSB7XG4gICAgdGhpcy5fdWlFbGVtZW50cyA9IHVpRWxlbWVudHNcbiAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gIH1cbiAgZ2V0IHVpRWxlbWVudEV2ZW50cygpIHsgcmV0dXJuIHRoaXMuX3VpRWxlbWVudEV2ZW50cyB8fCB7fSB9XG4gIHNldCB1aUVsZW1lbnRFdmVudHModWlFbGVtZW50RXZlbnRzKSB7XG4gICAgdGhpcy5fdWlFbGVtZW50RXZlbnRzID0gdWlFbGVtZW50RXZlbnRzXG4gICAgdGhpcy50b2dnbGVFdmVudHMoKVxuICB9XG4gIGdldCB1aUVsZW1lbnRDYWxsYmFja3MoKSB7IHJldHVybiB0aGlzLl91aUVsZW1lbnRDYWxsYmFja3MgfHwge30gfVxuICBzZXQgdWlFbGVtZW50Q2FsbGJhY2tzKHVpRWxlbWVudENhbGxiYWNrcykge1xuICAgIHRoaXMuX3VpRWxlbWVudENhbGxiYWNrcyA9IHVpRWxlbWVudENhbGxiYWNrc1xuICAgIHRoaXMudG9nZ2xlRXZlbnRzKClcbiAgfVxuICBnZXQgdWkoKSB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXNcbiAgICBpZighdGhpcy5fdWkpIHtcbiAgICAgIHRoaXMuX3VpID0gT2JqZWN0LmVudHJpZXModGhpcy51aUVsZW1lbnRzKS5yZWR1Y2UoKF91aSxbdWlFbGVtZW50TmFtZSwgdWlFbGVtZW50UXVlcnldKSA9PiB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKF91aSwge1xuICAgICAgICAgIFt1aUVsZW1lbnROYW1lXToge1xuICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICBpZih0eXBlb2YgdWlFbGVtZW50UXVlcnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5UmVzdWx0cyA9IGNvbnRleHQuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHVpRWxlbWVudFF1ZXJ5KVxuICAgICAgICAgICAgICAgIHJldHVybiAocXVlcnlSZXN1bHRzLmxlbmd0aCA+IDEpID8gcXVlcnlSZXN1bHRzIDogcXVlcnlSZXN1bHRzLml0ZW0oMClcbiAgICAgICAgICAgICAgfSBlbHNlIGlmKFxuICAgICAgICAgICAgICAgIHVpRWxlbWVudFF1ZXJ5IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcbiAgICAgICAgICAgICAgICB1aUVsZW1lbnRRdWVyeSBpbnN0YW5jZW9mIERvY3VtZW50IHx8XG4gICAgICAgICAgICAgICAgdWlFbGVtZW50UXVlcnkgaW5zdGFuY2VvZiBXaW5kb3dcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVpRWxlbWVudFF1ZXJ5XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gX3VpXG4gICAgICB9LCB7fSlcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMuX3VpLCB7XG4gICAgICAgICckZWxlbWVudCc6IHtcbiAgICAgICAgICBnZXQoKSB7IHJldHVybiBjb250ZXh0LmVsZW1lbnQgfVxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3VpXG4gIH1cbiAgZWxlbWVudE9ic2VydmUobXV0YXRpb25SZWNvcmRMaXN0LCBvYnNlcnZlcikge1xuICAgIGZvcihsZXQgW211dGF0aW9uUmVjb3JkSW5kZXgsIG11dGF0aW9uUmVjb3JkXSBvZiBPYmplY3QuZW50cmllcyhtdXRhdGlvblJlY29yZExpc3QpKSB7XG4gICAgICBzd2l0Y2gobXV0YXRpb25SZWNvcmQudHlwZSkge1xuICAgICAgICBjYXNlICdjaGlsZExpc3QnOlxuICAgICAgICAgIGlmKG11dGF0aW9uUmVjb3JkLmFkZGVkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyh0aGlzLnVpKSlcbiAgICAgICAgICAgIC8vIC5mb3JFYWNoKChbdWlLZXksIHVpVmFsdWVdKSA9PiB7XG4gICAgICAgICAgICAvLyAgIGNvbnN0IHVpVmFsdWVHZXQgPSB1aVZhbHVlLmdldCgpXG4gICAgICAgICAgICAvLyAgIGNvbnN0IGFkZGVkVUlFbGVtZW50ID0gQXJyYXkuZnJvbShtdXRhdGlvblJlY29yZC5hZGRlZE5vZGVzKS5maW5kKChhZGRlZE5vZGUpID0+IHtcbiAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnYWRkZWROb2RlJywgYWRkZWROb2RlKVxuICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCd1aVZhbHVlR2V0JywgdWlWYWx1ZUdldClcbiAgICAgICAgICAgIC8vICAgICByZXR1cm4gYWRkZWROb2RlID09PSB1aVZhbHVlR2V0XG4gICAgICAgICAgICAvLyAgIH0pXG4gICAgICAgICAgICAvLyAgIGlmKGFkZGVkVUlFbGVtZW50KSB7XG4gICAgICAgICAgICAvLyAgICAgdGhpcy50b2dnbGVFdmVudHModWlLZXkpXG4gICAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAgIC8vIH0pXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICB9XG4gIGJpbmRFdmVudFRvRWxlbWVudChlbGVtZW50LCBtZXRob2QsIGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFja05hbWUpIHtcbiAgICB0cnkge1xuICAgICAgc3dpdGNoKG1ldGhvZCkge1xuICAgICAgICBjYXNlICdhZGRFdmVudExpc3RlbmVyJzpcbiAgICAgICAgICB0aGlzLnVpRWxlbWVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gPSB0aGlzLnVpRWxlbWVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0uYmluZCh0aGlzKVxuICAgICAgICAgIGVsZW1lbnRbbWV0aG9kXShldmVudE5hbWUsIHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSlcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdyZW1vdmVFdmVudExpc3RlbmVyJzpcbiAgICAgICAgICBlbGVtZW50W21ldGhvZF0oZXZlbnROYW1lLCB0aGlzLnVpRWxlbWVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9IGNhdGNoKGVycm9yKSB7fVxuICB9XG4gIHRvZ2dsZUV2ZW50cyh0YXJnZXRVSUVsZW1lbnROYW1lID0gbnVsbCkge1xuICAgIHRoaXMuaXNUb2dnbGluZyA9IHRydWVcbiAgICBjb25zdCB1aSA9IHRoaXMudWlcbiAgICBjb25zdCBldmVudEJpbmRNZXRob2RzID0gWydyZW1vdmVFdmVudExpc3RlbmVyJywgJ2FkZEV2ZW50TGlzdGVuZXInXVxuICAgIGlmKCF0YXJnZXRVSUVsZW1lbnROYW1lKSB7XG4gICAgICBldmVudEJpbmRNZXRob2RzLmZvckVhY2goKGV2ZW50QmluZE1ldGhvZCkgPT4ge1xuICAgICAgICBPYmplY3QuZW50cmllcyh0aGlzLnVpRWxlbWVudEV2ZW50cykuZm9yRWFjaCgoW3VpRWxlbWVudEV2ZW50U2V0dGluZ3MsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGxldCBbdWlFbGVtZW50TmFtZSwgdWlFbGVtZW50RXZlbnROYW1lXSA9IHVpRWxlbWVudEV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxuICAgICAgICAgIGlmKHVpW3VpRWxlbWVudE5hbWVdIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgICAgICAgIHVpW3VpRWxlbWVudE5hbWVdLmZvckVhY2goKHVpRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmJpbmRFdmVudFRvRWxlbWVudCh1aUVsZW1lbnQsIGV2ZW50QmluZE1ldGhvZCwgdWlFbGVtZW50RXZlbnROYW1lLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIGlmKFxuICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxuICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBEb2N1bWVudCB8fFxuICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBXaW5kb3dcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50VG9FbGVtZW50KHVpW3VpRWxlbWVudE5hbWVdLCBldmVudEJpbmRNZXRob2QsIHVpRWxlbWVudEV2ZW50TmFtZSwgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnRCaW5kTWV0aG9kcy5mb3JFYWNoKChldmVudEJpbmRNZXRob2QpID0+IHtcbiAgICAgICAgY29uc3QgdWlFbGVtZW50RXZlbnRzID0gT2JqZWN0LmVudHJpZXModGhpcy51aUVsZW1lbnRFdmVudHMpLmZvckVhY2goKFt1aUVsZW1lbnRFdmVudFNldHRpbmdzLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZV0pID0+IHtcbiAgICAgICAgICBsZXQgW3VpRWxlbWVudE5hbWUsIHVpRWxlbWVudEV2ZW50TmFtZV0gPSB1aUVsZW1lbnRFdmVudFNldHRpbmdzLnNwbGl0KCcgJylcbiAgICAgICAgICBpZih0YXJnZXRVSUVsZW1lbnROYW1lID09PSB1aUVsZW1lbnROYW1lKSB7XG4gICAgICAgICAgICBpZih1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XG4gICAgICAgICAgICAgIHVpW3VpRWxlbWVudE5hbWVdLmZvckVhY2goKHVpRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50VG9FbGVtZW50KHVpRWxlbWVudCwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIGlmKHVpW3VpRWxlbWVudE5hbWVdIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlbdWlFbGVtZW50TmFtZV0sIGV2ZW50QmluZE1ldGhvZCwgdWlFbGVtZW50RXZlbnROYW1lLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLmlzVG9nZ2xpbmcgPSBmYWxzZVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgYXV0b0luc2VydCgpIHtcbiAgICBpZih0aGlzLmluc2VydCkge1xuICAgICAgY29uc3QgcGFyZW50ID0gKHR5cGVvZiB0aGlzLmluc2VydC5wYXJlbnQgPT09ICdzdHJpbmcnKVxuICAgICAgICA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5pbnNlcnQucGFyZW50KVxuICAgICAgICA6ICh0aGlzLmluc2VydC5wYXJlbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudClcbiAgICAgICAgICA/IHRoaXMuaW5zZXJ0LnBhcmVudFxuICAgICAgICAgIDogbnVsbFxuICAgICAgY29uc3QgbWV0aG9kID0gdGhpcy5pbnNlcnQubWV0aG9kXG4gICAgICBwYXJlbnQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KG1ldGhvZCwgdGhpcy5lbGVtZW50KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGF1dG9SZW1vdmUoKSB7XG4gICAgaWYodGhpcy5lbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICByZW5kZXIoZGF0YSA9IHt9KSB7XG4gICAgaWYodGhpcy50ZW1wbGF0ZSkge1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlKGRhdGEpXG4gICAgICB0aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGVcbiAgICB9XG4gICAgdGhpcy50b2dnbGVFdmVudHMoKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFZpZXdcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4J1xuXG5jb25zdCBDb250cm9sbGVyID0gY2xhc3MgZXh0ZW5kcyBFdmVudHMge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICB9XG4gIGdldCB2YWxpZFNldHRpbmdzKCkgeyByZXR1cm4gW1xuICAgICdtb2RlbHMnLFxuICAgICdtb2RlbEV2ZW50cycsXG4gICAgJ21vZGVsQ2FsbGJhY2tzJyxcbiAgICAnY29sbGVjdGlvbnMnLFxuICAgICdjb2xsZWN0aW9uRXZlbnRzJyxcbiAgICAnY29sbGVjdGlvbkNhbGxiYWNrcycsXG4gICAgJ3ZpZXdzJyxcbiAgICAndmlld0V2ZW50cycsXG4gICAgJ3ZpZXdDYWxsYmFja3MnLFxuICAgICdjb250cm9sbGVycycsXG4gICAgJ2NvbnRyb2xsZXJFdmVudHMnLFxuICAgICdjb250cm9sbGVyQ2FsbGJhY2tzJyxcbiAgICAncm91dGVycycsXG4gICAgJ3JvdXRlckV2ZW50cycsXG4gICAgJ3JvdXRlckNhbGxiYWNrcycsXG4gIF0gfVxuICBnZXQgYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlcygpIHsgcmV0dXJuIFtcbiAgICAnbW9kZWwnLFxuICAgICd2aWV3JyxcbiAgICAnY29sbGVjdGlvbicsXG4gICAgJ2NvbnRyb2xsZXInLFxuICAgICdyb3V0ZXInLFxuICBdIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCBzZXR0aW5ncygpIHtcbiAgICBpZighdGhpcy5fc2V0dGluZ3MpIHRoaXMuX3NldHRpbmdzID0ge31cbiAgICByZXR1cm4gdGhpcy5fc2V0dGluZ3NcbiAgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzXG4gICAgICAuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XG4gICAgICAgIGlmKHRoaXMuc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgWydfJy5jb25jYXQodmFsaWRTZXR0aW5nKV06IHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWJlcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBbdmFsaWRTZXR0aW5nXToge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNbJ18nLmNvbmNhdCh2YWxpZFNldHRpbmcpXSB9LFxuICAgICAgICAgICAgICAgIHNldCh2YWx1ZSkgeyB0aGlzWydfJy5jb25jYXQodmFsaWRTZXR0aW5nKV0gPSB2YWx1ZSB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIClcbiAgICAgICAgICB0aGlzW3ZhbGlkU2V0dGluZ10gPSB0aGlzLnNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB0aGlzLmJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXNcbiAgICAgIC5mb3JFYWNoKChiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUpID0+IHtcbiAgICAgICAgdGhpcy5yZXNldEV2ZW50cyhiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUpXG4gICAgICB9KVxuICB9XG4gIHJlc2V0RXZlbnRzKGNsYXNzVHlwZSkge1xuICAgIFtcbiAgICAgICdvZmYnLFxuICAgICAgJ29uJ1xuICAgIF0uZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZClcbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKSB7XG4gICAgY29uc3QgYmFzZU5hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdzJylcbiAgICBjb25zdCBiYXNlRXZlbnRzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrc05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKVxuICAgIGNvbnN0IGJhc2UgPSB0aGlzW2Jhc2VOYW1lXSB8fCB7fVxuICAgIGNvbnN0IGJhc2VFdmVudHMgPSB0aGlzW2Jhc2VFdmVudHNOYW1lXSB8fCB7fVxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3MgPSB0aGlzW2Jhc2VDYWxsYmFja3NOYW1lXSB8fCB7fVxuICAgIGlmKFxuICAgICAgT2JqZWN0LnZhbHVlcyhiYXNlKS5sZW5ndGggJiZcbiAgICAgIE9iamVjdC52YWx1ZXMoYmFzZUV2ZW50cykubGVuZ3RoICYmXG4gICAgICBPYmplY3QudmFsdWVzKGJhc2VDYWxsYmFja3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgT2JqZWN0LmVudHJpZXMoYmFzZUV2ZW50cylcbiAgICAgICAgLmZvckVhY2goKFtiYXNlRXZlbnREYXRhLCBiYXNlQ2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IFtiYXNlVGFyZ2V0TmFtZSwgYmFzZUV2ZW50TmFtZV0gPSBiYXNlRXZlbnREYXRhLnNwbGl0KCcgJylcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0ZpcnN0ID0gYmFzZVRhcmdldE5hbWUuc3Vic3RyaW5nKDAsIDEpXG4gICAgICAgICAgY29uc3QgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0ID0gYmFzZVRhcmdldE5hbWUuc3Vic3RyaW5nKGJhc2VUYXJnZXROYW1lLmxlbmd0aCAtIDEpXG4gICAgICAgICAgbGV0IGJhc2VUYXJnZXRzID0gW11cbiAgICAgICAgICBpZihcbiAgICAgICAgICAgIGJhc2VUYXJnZXROYW1lU3Vic3RyaW5nRmlyc3QgPT09ICdbJyAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0ID09PSAnXSdcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzID0gT2JqZWN0LmVudHJpZXMoYmFzZSlcbiAgICAgICAgICAgICAgLnJlZHVjZSgoX2Jhc2VUYXJnZXRzLCBbYmFzZU5hbWUsIGJhc2VUYXJnZXRdKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGJhc2VUYXJnZXROYW1lUmVnRXhwU3RyaW5nID0gYmFzZVRhcmdldE5hbWUuc2xpY2UoMSwgLTEpXG4gICAgICAgICAgICAgICAgbGV0IGJhc2VUYXJnZXROYW1lUmVnRXhwID0gbmV3IFJlZ0V4cChiYXNlVGFyZ2V0TmFtZVJlZ0V4cFN0cmluZylcbiAgICAgICAgICAgICAgICBpZihiYXNlTmFtZS5tYXRjaChiYXNlVGFyZ2V0TmFtZVJlZ0V4cCkpIHtcbiAgICAgICAgICAgICAgICAgIF9iYXNlVGFyZ2V0cy5wdXNoKGJhc2VUYXJnZXQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBfYmFzZVRhcmdldHNcbiAgICAgICAgICAgICAgfSwgW10pXG4gICAgICAgICAgfSBlbHNlIGlmKGJhc2VbYmFzZVRhcmdldE5hbWVdKSB7XG4gICAgICAgICAgICBiYXNlVGFyZ2V0cy5wdXNoKGJhc2VbYmFzZVRhcmdldE5hbWVdKVxuICAgICAgICAgIH1cbiAgICAgICAgICBsZXQgYmFzZUV2ZW50Q2FsbGJhY2sgPSBiYXNlQ2FsbGJhY2tzW2Jhc2VDYWxsYmFja05hbWVdXG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFjayAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2submFtZS5zcGxpdCgnICcpLmxlbmd0aCA9PT0gMVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2sgPSBiYXNlRXZlbnRDYWxsYmFjay5iaW5kKHRoaXMpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWUgJiZcbiAgICAgICAgICAgIGJhc2VFdmVudE5hbWUgJiZcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzLmxlbmd0aCAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2tcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzXG4gICAgICAgICAgICAgIC5mb3JFYWNoKChiYXNlVGFyZ2V0KSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIHN3aXRjaChtZXRob2QpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnb24nOlxuICAgICAgICAgICAgICAgICAgICAgIGJhc2VUYXJnZXRbbWV0aG9kXShiYXNlRXZlbnROYW1lLCBiYXNlRXZlbnRDYWxsYmFjaylcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdvZmYnOlxuICAgICAgICAgICAgICAgICAgICAgIGJhc2VUYXJnZXRbbWV0aG9kXShiYXNlRXZlbnROYW1lLCBiYXNlRXZlbnRDYWxsYmFjaylcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgQ29udHJvbGxlclxuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXgnXG5cbmNvbnN0IFJvdXRlciA9IGNsYXNzIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLmFkZFNldHRpbmdzKClcbiAgICB0aGlzLmFkZFdpbmRvd0V2ZW50cygpXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ3Jvb3QnLFxuICAgICdoYXNoUm91dGluZycsXG4gICAgJ2NvbnRyb2xsZXInLFxuICAgICdyb3V0ZXMnXG4gIF0gfVxuICBnZXQgc2V0dGluZ3MoKSB7IHJldHVybiB0aGlzLl9zZXR0aW5ncyB9XG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3MuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XG4gICAgICBpZihzZXR0aW5nc1t2YWxpZFNldHRpbmddKSB0aGlzW3ZhbGlkU2V0dGluZ10gPSBzZXR0aW5nc1t2YWxpZFNldHRpbmddXG4gICAgfSlcbiAgfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cbiAgZ2V0IHByb3RvY29sKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnByb3RvY29sIH1cbiAgZ2V0IGhvc3RuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lIH1cbiAgZ2V0IHBvcnQoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucG9ydCB9XG4gIGdldCBwYXRobmFtZSgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSB9XG4gIGdldCBwYXRoKCkge1xuICAgIGxldCBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWVcbiAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoWydeJywgdGhpcy5yb290XS5qb2luKCcnKSksICcnKVxuICAgICAgLnNwbGl0KCc/JylcbiAgICAgIC5zbGljZSgwLCAxKVxuICAgICAgWzBdXG4gICAgbGV0IGZyYWdtZW50cyA9IChcbiAgICAgIHN0cmluZy5sZW5ndGggPT09IDBcbiAgICApID8gW11cbiAgICAgIDogKFxuICAgICAgICAgIHN0cmluZy5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL15cXC8vKSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXFwvPy8pXG4gICAgICAgICkgPyBbJy8nXVxuICAgICAgICAgIDogc3RyaW5nXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC8kLywgJycpXG4gICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgcmV0dXJuIHtcbiAgICAgIGZyYWdtZW50czogZnJhZ21lbnRzLFxuICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgfVxuICB9XG4gIGdldCBoYXNoKCkge1xuICAgIGxldCBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uaGFzaFxuICAgICAgLnNsaWNlKDEpXG4gICAgICAuc3BsaXQoJz8nKVxuICAgICAgLnNsaWNlKDAsIDEpXG4gICAgICBbMF1cbiAgICBsZXQgZnJhZ21lbnRzID0gKFxuICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMFxuICAgICkgPyBbXVxuICAgICAgOiAoXG4gICAgICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXlxcLy8pICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9cXC8/LylcbiAgICAgICAgKSA/IFsnLyddXG4gICAgICAgICAgOiBzdHJpbmdcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICByZXR1cm4ge1xuICAgICAgZnJhZ21lbnRzOiBmcmFnbWVudHMsXG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICB9XG4gIH1cbiAgZ2V0IHBhcmFtZXRlcnMoKSB7XG4gICAgbGV0IHN0cmluZ1xuICAgIGxldCBkYXRhXG4gICAgaWYod2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goL1xcPy8pKSB7XG4gICAgICBsZXQgcGFyYW1ldGVycyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgICAgIC5zcGxpdCgnPycpXG4gICAgICAgIC5zbGljZSgtMSlcbiAgICAgICAgLmpvaW4oJycpXG4gICAgICBzdHJpbmcgPSBwYXJhbWV0ZXJzXG4gICAgICBkYXRhID0gcGFyYW1ldGVyc1xuICAgICAgICAuc3BsaXQoJyYnKVxuICAgICAgICAucmVkdWNlKChcbiAgICAgICAgICBfcGFyYW1ldGVycyxcbiAgICAgICAgICBwYXJhbWV0ZXJcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgbGV0IHBhcmFtZXRlckRhdGEgPSBwYXJhbWV0ZXIuc3BsaXQoJz0nKVxuICAgICAgICAgIF9wYXJhbWV0ZXJzW3BhcmFtZXRlckRhdGFbMF1dID0gcGFyYW1ldGVyRGF0YVsxXVxuICAgICAgICAgIHJldHVybiBfcGFyYW1ldGVyc1xuICAgICAgICB9LCB7fSlcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyaW5nID0gJydcbiAgICAgIGRhdGEgPSB7fVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfVxuICB9XG4gIGdldCBfcm9vdCgpIHsgcmV0dXJuIHRoaXMucm9vdCB8fCAnLycgfVxuICBzZXQgX3Jvb3Qocm9vdCkgeyB0aGlzLnJvb3QgPSByb290IH1cbiAgZ2V0IF9oYXNoUm91dGluZygpIHsgcmV0dXJuIHRoaXMuaGFzaFJvdXRpbmcgfHwgZmFsc2UgfVxuICBzZXQgX2hhc2hSb3V0aW5nKGhhc2hSb3V0aW5nKSB7IHRoaXMuaGFzaFJvdXRpbmcgPSBoYXNoUm91dGluZyB9XG4gIGdldCBfcm91dGVzKCkgeyByZXR1cm4gdGhpcy5yb3V0ZXMgfVxuICBzZXQgX3JvdXRlcyhyb3V0ZXMpIHsgdGhpcy5yb3V0ZXMgPSByb3V0ZXMgfVxuICBnZXQgX2NvbnRyb2xsZXIoKSB7IHJldHVybiB0aGlzLmNvbnRyb2xsZXIgfVxuICBzZXQgX2NvbnRyb2xsZXIoY29udHJvbGxlcikgeyB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyIH1cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICByb290OiB0aGlzLnJvb3QsXG4gICAgICBwYXRoOiB0aGlzLnBhdGgsXG4gICAgICBoYXNoOiB0aGlzLmhhc2gsXG4gICAgICBwYXJhbWV0ZXJzOiB0aGlzLnBhcmFtZXRlcnMsXG4gICAgfVxuICB9XG4gIG1hdGNoUm91dGUocm91dGVGcmFnbWVudHMsIGxvY2F0aW9uRnJhZ21lbnRzKSB7XG4gICAgbGV0IHJvdXRlTWF0Y2hlcyA9IG5ldyBBcnJheSgpXG4gICAgaWYocm91dGVGcmFnbWVudHMubGVuZ3RoID09PSBsb2NhdGlvbkZyYWdtZW50cy5sZW5ndGgpIHtcbiAgICAgIHJvdXRlTWF0Y2hlcyA9IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgIC5yZWR1Y2UoKF9yb3V0ZU1hdGNoZXMsIHJvdXRlRnJhZ21lbnQsIHJvdXRlRnJhZ21lbnRJbmRleCkgPT4ge1xuICAgICAgICAgIGxldCBsb2NhdGlvbkZyYWdtZW50ID0gbG9jYXRpb25GcmFnbWVudHNbcm91dGVGcmFnbWVudEluZGV4XVxuICAgICAgICAgIGlmKHJvdXRlRnJhZ21lbnQubWF0Y2goL15cXDovKSkge1xuICAgICAgICAgICAgX3JvdXRlTWF0Y2hlcy5wdXNoKHRydWUpXG4gICAgICAgICAgfSBlbHNlIGlmKHJvdXRlRnJhZ21lbnQgPT09IGxvY2F0aW9uRnJhZ21lbnQpIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaCh0cnVlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2goZmFsc2UpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcm91dGVNYXRjaGVzXG4gICAgICAgIH0sIFtdKVxuICAgIH0gZWxzZSB7XG4gICAgICByb3V0ZU1hdGNoZXMucHVzaChmYWxzZSlcbiAgICB9XG4gICAgcmV0dXJuIChyb3V0ZU1hdGNoZXMuaW5kZXhPZihmYWxzZSkgPT09IC0xKVxuICAgICAgPyB0cnVlXG4gICAgICA6IGZhbHNlXG4gIH1cbiAgZ2V0Um91dGUobG9jYXRpb24pIHtcbiAgICBsZXQgcm91dGVzID0gT2JqZWN0LmVudHJpZXModGhpcy5yb3V0ZXMpXG4gICAgICAucmVkdWNlKChcbiAgICAgICAgX3JvdXRlcyxcbiAgICAgICAgW3JvdXRlTmFtZSwgcm91dGVTZXR0aW5nc10pID0+IHtcbiAgICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSAoXG4gICAgICAgICAgICByb3V0ZU5hbWUubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgICByb3V0ZU5hbWUubWF0Y2goL15cXC8vKVxuICAgICAgICAgICkgPyBbcm91dGVOYW1lXVxuICAgICAgICAgICAgOiAocm91dGVOYW1lLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgPyBbJyddXG4gICAgICAgICAgICAgIDogcm91dGVOYW1lXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgICAgICAgcm91dGVTZXR0aW5ncy5mcmFnbWVudHMgPSByb3V0ZUZyYWdtZW50c1xuICAgICAgICAgIF9yb3V0ZXNbcm91dGVGcmFnbWVudHMuam9pbignLycpXSA9IHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICByZXR1cm4gX3JvdXRlc1xuICAgICAgICB9LFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHJvdXRlcylcbiAgICAgIC5maW5kKChyb3V0ZSkgPT4ge1xuICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSByb3V0ZS5mcmFnbWVudHNcbiAgICAgICAgbGV0IGxvY2F0aW9uRnJhZ21lbnRzID0gKHRoaXMuaGFzaFJvdXRpbmcpXG4gICAgICAgICAgPyBsb2NhdGlvbi5oYXNoLmZyYWdtZW50c1xuICAgICAgICAgIDogbG9jYXRpb24ucGF0aC5mcmFnbWVudHNcbiAgICAgICAgbGV0IG1hdGNoUm91dGUgPSB0aGlzLm1hdGNoUm91dGUoXG4gICAgICAgICAgcm91dGVGcmFnbWVudHMsXG4gICAgICAgICAgbG9jYXRpb25GcmFnbWVudHMsXG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuIG1hdGNoUm91dGUgPT09IHRydWVcbiAgICAgIH0pXG4gIH1cbiAgcG9wU3RhdGUoZXZlbnQpIHtcbiAgICBsZXQgbG9jYXRpb24gPSB0aGlzLmxvY2F0aW9uXG4gICAgbGV0IHJvdXRlID0gdGhpcy5nZXRSb3V0ZShsb2NhdGlvbilcbiAgICBsZXQgcm91dGVEYXRhID0ge1xuICAgICAgcm91dGU6IHJvdXRlLFxuICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgIH1cbiAgICBpZihyb3V0ZSkge1xuICAgICAgdGhpcy5jb250cm9sbGVyW3JvdXRlLmNhbGxiYWNrXShyb3V0ZURhdGEpXG4gICAgICB0aGlzLmVtaXQoJ2NoYW5nZScsIHtcbiAgICAgICAgbmFtZTogJ2NoYW5nZScsXG4gICAgICAgIGRhdGE6IHJvdXRlRGF0YSxcbiAgICAgIH0sXG4gICAgICB0aGlzKVxuICAgIH1cbiAgfVxuICBhZGRXaW5kb3dFdmVudHMoKSB7XG4gICAgd2luZG93Lm9uKCdwb3BzdGF0ZScsIHRoaXMucG9wU3RhdGUuYmluZCh0aGlzKSlcbiAgfVxuICByZW1vdmVXaW5kb3dFdmVudHMoKSB7XG4gICAgd2luZG93Lm9mZigncG9wc3RhdGUnLCB0aGlzLnBvcFN0YXRlLmJpbmQodGhpcykpXG4gIH1cbiAgbmF2aWdhdGUocGF0aCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aFxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBSb3V0ZXJcbiIsImltcG9ydCAnLi9TaGltcy9ldmVudHMnXG5pbXBvcnQgRXZlbnRzIGZyb20gJy4vRXZlbnRzL2luZGV4J1xuaW1wb3J0IENoYW5uZWxzIGZyb20gJy4vQ2hhbm5lbHMvaW5kZXgnXG5pbXBvcnQgKiBhcyBVdGlsaXRpZXMgZnJvbSAnLi9VdGlsaXRpZXMvaW5kZXgnXG5pbXBvcnQgU2VydmljZSBmcm9tICcuL1NlcnZpY2UvaW5kZXgnXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi9Nb2RlbC9pbmRleCdcbmltcG9ydCBDb2xsZWN0aW9uIGZyb20gJy4vQ29sbGVjdGlvbi9pbmRleCdcbmltcG9ydCBWaWV3IGZyb20gJy4vVmlldy9pbmRleCdcbmltcG9ydCBDb250cm9sbGVyIGZyb20gJy4vQ29udHJvbGxlci9pbmRleCdcbmltcG9ydCBSb3V0ZXIgZnJvbSAnLi9Sb3V0ZXIvaW5kZXgnXG5jb25zdCBNVkMgPSB7XG4gIEV2ZW50cyxcbiAgQ2hhbm5lbHMsXG4gIFV0aWxpdGllcyxcbiAgU2VydmljZSxcbiAgTW9kZWwsXG4gIENvbGxlY3Rpb24sXG4gIFZpZXcsXG4gIENvbnRyb2xsZXIsXG4gIFJvdXRlcixcbn1cbmV4cG9ydCBkZWZhdWx0IE1WQ1xuIl0sIm5hbWVzIjpbIkV2ZW50VGFyZ2V0IiwicHJvdG90eXBlIiwib24iLCJhZGRFdmVudExpc3RlbmVyIiwib2ZmIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIkV2ZW50cyIsImNvbnN0cnVjdG9yIiwiX2V2ZW50cyIsImV2ZW50cyIsImdldEV2ZW50Q2FsbGJhY2tzIiwiZXZlbnROYW1lIiwiZ2V0RXZlbnRDYWxsYmFja05hbWUiLCJldmVudENhbGxiYWNrIiwibmFtZSIsImxlbmd0aCIsImdldEV2ZW50Q2FsbGJhY2tHcm91cCIsImV2ZW50Q2FsbGJhY2tzIiwiZXZlbnRDYWxsYmFja05hbWUiLCJldmVudENhbGxiYWNrR3JvdXAiLCJwdXNoIiwiYXJndW1lbnRzIiwiT2JqZWN0Iiwia2V5cyIsImVtaXQiLCJfYXJndW1lbnRzIiwiQXJyYXkiLCJmcm9tIiwic3BsaWNlIiwiZXZlbnREYXRhIiwiZXZlbnRBcmd1bWVudHMiLCJlbnRyaWVzIiwiZm9yRWFjaCIsImV2ZW50Q2FsbGJhY2tHcm91cE5hbWUiLCJkYXRhIiwiX3Jlc3BvbnNlcyIsInJlc3BvbnNlcyIsInJlc3BvbnNlIiwicmVzcG9uc2VOYW1lIiwicmVzcG9uc2VDYWxsYmFjayIsInJlcXVlc3QiLCJzbGljZSIsImNhbGwiLCJfcmVzcG9uc2VOYW1lIiwiX2NoYW5uZWxzIiwiY2hhbm5lbHMiLCJjaGFubmVsIiwiY2hhbm5lbE5hbWUiLCJDaGFubmVsIiwiVVVJRCIsInV1aWQiLCJpIiwicmFuZG9tIiwiTWF0aCIsInRvU3RyaW5nIiwiU2VydmljZSIsInNldHRpbmdzIiwib3B0aW9ucyIsInZhbGlkU2V0dGluZ3MiLCJfc2V0dGluZ3MiLCJ2YWxpZFNldHRpbmciLCJfb3B0aW9ucyIsInVybCIsInBhcmFtZXRlcnMiLCJfdXJsIiwiY29uY2F0IiwicXVlcnlTdHJpbmciLCJwYXJhbWV0ZXJTdHJpbmciLCJyZWR1Y2UiLCJwYXJhbWV0ZXJTdHJpbmdzIiwicGFyYW1ldGVyS2V5IiwicGFyYW1ldGVyVmFsdWUiLCJqb2luIiwibWV0aG9kIiwiX21ldGhvZCIsIm1vZGUiLCJfbW9kZSIsImNhY2hlIiwiX2NhY2hlIiwiY3JlZGVudGlhbHMiLCJfY3JlZGVudGlhbHMiLCJoZWFkZXJzIiwiX2hlYWRlcnMiLCJyZWRpcmVjdCIsIl9yZWRpcmVjdCIsInJlZmVycmVyUG9saWN5IiwiX3JlZmVycmVyUG9saWN5IiwiYm9keSIsIl9ib2R5IiwiX3BhcmFtZXRlcnMiLCJwcmV2aW91c0Fib3J0Q29udHJvbGxlciIsIl9wcmV2aW91c0Fib3J0Q29udHJvbGxlciIsImFib3J0Q29udHJvbGxlciIsIl9hYm9ydENvbnRyb2xsZXIiLCJBYm9ydENvbnRyb2xsZXIiLCJhYm9ydCIsImZldGNoIiwiZmV0Y2hPcHRpb25zIiwiX2ZldGNoT3B0aW9ucyIsImZldGNoT3B0aW9uTmFtZSIsInNpZ25hbCIsInRoZW4iLCJqc29uIiwiY29kZSIsImNhdGNoIiwiZXJyb3IiLCJNb2RlbCIsIl91dWlkIiwiYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlcyIsImJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSIsInRvZ2dsZUV2ZW50cyIsInNlcnZpY2VzIiwiX3NlcnZpY2VzIiwiX2RhdGEiLCJkZWZhdWx0cyIsIl9kZWZhdWx0cyIsImxvY2FsU3RvcmFnZSIsInN5bmMiLCJkYiIsInNldCIsIl9sb2NhbFN0b3JhZ2UiLCJzdG9yYWdlQ29udGFpbmVyIiwiX2RiIiwiZ2V0SXRlbSIsImVuZHBvaW50IiwiSlNPTiIsInN0cmluZ2lmeSIsInBhcnNlIiwic2V0SXRlbSIsInJlc2V0RXZlbnRzIiwiY2xhc3NUeXBlIiwiYmFzZU5hbWUiLCJiYXNlRXZlbnRzTmFtZSIsImJhc2VDYWxsYmFja3NOYW1lIiwiYmFzZSIsImJhc2VFdmVudHMiLCJiYXNlQ2FsbGJhY2tzIiwiYmFzZUV2ZW50RGF0YSIsImJhc2VDYWxsYmFja05hbWUiLCJiYXNlVGFyZ2V0TmFtZSIsImJhc2VFdmVudE5hbWUiLCJzcGxpdCIsImJhc2VUYXJnZXQiLCJiYXNlQ2FsbGJhY2siLCJiaW5kIiwic2V0REIiLCJrZXkiLCJ2YWx1ZSIsInVuc2V0REIiLCJzZXREYXRhUHJvcGVydHkiLCJzaWxlbnQiLCJjdXJyZW50RGF0YVByb3BlcnR5IiwiZGVmaW5lUHJvcGVydGllcyIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiZW51bWVyYWJsZSIsImdldCIsIm1vZGVsIiwiZXZlbnQiLCJ1bnNldERhdGFQcm9wZXJ0eSIsImlzQXJyYXkiLCJ1bnNldCIsIkNvbGxlY3Rpb24iLCJkZWZhdWx0SURBdHRyaWJ1dGUiLCJhZGQiLCJVdGlsaXRpZXMiLCJtb2RlbHMiLCJfbW9kZWxzIiwibW9kZWxzRGF0YSIsIl9tb2RlbCIsIm1hcCIsImJhc2VFdmVudENhbGxiYWNrIiwiY2xhc3NUeXBlVGFyZ2V0IiwiY2xhc3NUeXBlRXZlbnROYW1lIiwiY2xhc3NUeXBlRXZlbnRDYWxsYmFjayIsImdldE1vZGVsSW5kZXgiLCJtb2RlbFVVSUQiLCJtb2RlbEluZGV4IiwiZmluZCIsIl9tb2RlbEluZGV4IiwicmVtb3ZlTW9kZWxCeUluZGV4IiwiYWRkTW9kZWwiLCJtb2RlbERhdGEiLCJzb21lTW9kZWwiLCJyZW1vdmUiLCJmaWx0ZXIiLCJyZXNldCIsIlZpZXciLCJlbGVtZW50TmFtZSIsIl9lbGVtZW50TmFtZSIsImVsZW1lbnQiLCJfZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVLZXkiLCJhdHRyaWJ1dGVWYWx1ZSIsInNldEF0dHJpYnV0ZSIsImVsZW1lbnRPYnNlcnZlciIsIm9ic2VydmUiLCJzdWJ0cmVlIiwiY2hpbGRMaXN0IiwiX2VsZW1lbnRPYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJlbGVtZW50T2JzZXJ2ZSIsIkhUTUxFbGVtZW50IiwiX2F0dHJpYnV0ZXMiLCJ0ZW1wbGF0ZSIsIl90ZW1wbGF0ZSIsInVpRWxlbWVudHMiLCJfdWlFbGVtZW50cyIsInVpRWxlbWVudEV2ZW50cyIsIl91aUVsZW1lbnRFdmVudHMiLCJ1aUVsZW1lbnRDYWxsYmFja3MiLCJfdWlFbGVtZW50Q2FsbGJhY2tzIiwidWkiLCJjb250ZXh0IiwiX3VpIiwidWlFbGVtZW50TmFtZSIsInVpRWxlbWVudFF1ZXJ5IiwicXVlcnlSZXN1bHRzIiwicXVlcnlTZWxlY3RvckFsbCIsIml0ZW0iLCJEb2N1bWVudCIsIldpbmRvdyIsIm11dGF0aW9uUmVjb3JkTGlzdCIsIm9ic2VydmVyIiwibXV0YXRpb25SZWNvcmRJbmRleCIsIm11dGF0aW9uUmVjb3JkIiwidHlwZSIsImFkZGVkTm9kZXMiLCJiaW5kRXZlbnRUb0VsZW1lbnQiLCJ0YXJnZXRVSUVsZW1lbnROYW1lIiwiaXNUb2dnbGluZyIsImV2ZW50QmluZE1ldGhvZHMiLCJldmVudEJpbmRNZXRob2QiLCJ1aUVsZW1lbnRFdmVudFNldHRpbmdzIiwidWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUiLCJ1aUVsZW1lbnRFdmVudE5hbWUiLCJOb2RlTGlzdCIsInVpRWxlbWVudCIsImF1dG9JbnNlcnQiLCJpbnNlcnQiLCJwYXJlbnQiLCJxdWVyeVNlbGVjdG9yIiwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50IiwiYXV0b1JlbW92ZSIsInBhcmVudEVsZW1lbnQiLCJyZW1vdmVDaGlsZCIsInJlbmRlciIsImlubmVySFRNTCIsIkNvbnRyb2xsZXIiLCJlbnVtYmVyYWJsZSIsInZhbHVlcyIsImJhc2VUYXJnZXROYW1lU3Vic3RyaW5nRmlyc3QiLCJzdWJzdHJpbmciLCJiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0xhc3QiLCJiYXNlVGFyZ2V0cyIsIl9iYXNlVGFyZ2V0cyIsImJhc2VUYXJnZXROYW1lUmVnRXhwU3RyaW5nIiwiYmFzZVRhcmdldE5hbWVSZWdFeHAiLCJSZWdFeHAiLCJtYXRjaCIsIlJvdXRlciIsImFkZFNldHRpbmdzIiwiYWRkV2luZG93RXZlbnRzIiwicHJvdG9jb2wiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhvc3RuYW1lIiwicG9ydCIsInBhdGhuYW1lIiwicGF0aCIsInN0cmluZyIsInJlcGxhY2UiLCJyb290IiwiZnJhZ21lbnRzIiwiaGFzaCIsImhyZWYiLCJwYXJhbWV0ZXIiLCJwYXJhbWV0ZXJEYXRhIiwiX3Jvb3QiLCJfaGFzaFJvdXRpbmciLCJoYXNoUm91dGluZyIsIl9yb3V0ZXMiLCJyb3V0ZXMiLCJfY29udHJvbGxlciIsImNvbnRyb2xsZXIiLCJtYXRjaFJvdXRlIiwicm91dGVGcmFnbWVudHMiLCJsb2NhdGlvbkZyYWdtZW50cyIsInJvdXRlTWF0Y2hlcyIsIl9yb3V0ZU1hdGNoZXMiLCJyb3V0ZUZyYWdtZW50Iiwicm91dGVGcmFnbWVudEluZGV4IiwibG9jYXRpb25GcmFnbWVudCIsImluZGV4T2YiLCJnZXRSb3V0ZSIsInJvdXRlTmFtZSIsInJvdXRlU2V0dGluZ3MiLCJyb3V0ZSIsInBvcFN0YXRlIiwicm91dGVEYXRhIiwiY2FsbGJhY2siLCJyZW1vdmVXaW5kb3dFdmVudHMiLCJuYXZpZ2F0ZSIsIk1WQyIsIkNoYW5uZWxzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7RUFBQUEsV0FBVyxDQUFDQyxTQUFaLENBQXNCQyxFQUF0QixHQUEyQkYsV0FBVyxDQUFDQyxTQUFaLENBQXNCQyxFQUF0QixJQUE0QkYsV0FBVyxDQUFDQyxTQUFaLENBQXNCRSxnQkFBN0U7RUFDQUgsV0FBVyxDQUFDQyxTQUFaLENBQXNCRyxHQUF0QixHQUE0QkosV0FBVyxDQUFDQyxTQUFaLENBQXNCRyxHQUF0QixJQUE2QkosV0FBVyxDQUFDQyxTQUFaLENBQXNCSSxtQkFBL0U7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUNEQSxNQUFNQyxNQUFOLENBQWE7RUFDWEMsRUFBQUEsV0FBVyxHQUFHOztFQUNkLE1BQUlDLE9BQUosR0FBYztFQUNaLFNBQUtDLE1BQUwsR0FBYyxLQUFLQSxNQUFMLElBQWUsRUFBN0I7RUFDQSxXQUFPLEtBQUtBLE1BQVo7RUFDRDs7RUFDREMsRUFBQUEsaUJBQWlCLENBQUNDLFNBQUQsRUFBWTtFQUFFLFdBQU8sS0FBS0gsT0FBTCxDQUFhRyxTQUFiLEtBQTJCLEVBQWxDO0VBQXNDOztFQUNyRUMsRUFBQUEsb0JBQW9CLENBQUNDLGFBQUQsRUFBZ0I7RUFDbEMsV0FBUUEsYUFBYSxDQUFDQyxJQUFkLENBQW1CQyxNQUFw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
