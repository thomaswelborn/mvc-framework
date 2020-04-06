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



  var Utils = /*#__PURE__*/Object.freeze({
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
      return ['url', 'method', 'mode', 'cache', 'credentials', 'headers', 'redirect', 'referrer-policy', 'body'];
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
      return this._url;
    }

    set url(url) {
      this._url = url;
    }

    get method() {
      return this._method;
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
      var fetchOptions = this.validSettings.reduce((_fetchOptions, _ref) => {
        var [fetchOptionName, fetchOptionValue] = _ref;
        if (this[fetchOptionName]) _fetchOptions[fetchOptionName] = fetchOptionValue;
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
      }).catch(() => {});
    }

  }

  var Model = class extends Events {
    constructor() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      super();
      this.settings = settings;
      this.options = options;
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
      this._defaults = defaults;
      this.set(this.defaults);
    }

    get localStorage() {
      return this._localStorage;
    }

    set localStorage(localStorage) {
      this._localStorage = localStorage;
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

    setDataProperty(key, value) {
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
      this.emit('set'.concat(':', key), {
        key: key,
        value: value
      }, this);
      return this;
    }

    unsetDataProperty(key) {
      if (this.data[key]) {
        delete this.data[key];
      }

      this.emit('unset'.concat(':', arguments[0]), this);
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
      if (arguments.length === 2) {
        this.setDataProperty(arguments[0], arguments[1]);
        if (this.localStorage) this.setDB(arguments[0], arguments[1]);
      } else if (arguments.length === 1 && !Array.isArray(arguments[0]) && typeof arguments[0] === 'object') {
        Object.entries(arguments[0]).forEach((_ref4) => {
          var [key, value] = _ref4;
          this.setDataProperty(key, value);
          if (this.localStorage) this.setDB(key, value);
        });
      }

      this.emit('set', this.data, this);
      return this;
    }

    unset() {
      if (arguments[0]) {
        this.unsetDataProperty(arguments[0]);
        if (this.localStorage) this.unsetDB(key);
      } else {
        Object.keys(this.data).forEach(key => {
          this.unsetDataProperty(key);
          if (this.localStorage) this.unsetDB(key);
        });
      }

      this.emit('unset', this);
      return this;
    }

    parse() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.data;
      return Object.entries(data).reduce((_data, _ref5) => {
        var [key, value] = _ref5;

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
      super(...arguments);
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

      this.emit('remove', {}, model[0], this);
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
        this.emit('change', model.parse(), model, this);
      });
      this.models.push(model);
      this.emit('add', model.parse(), model, this);
      this.emit('change', model.parse(), model, this);
      return this;
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
      return this;
    }

    remove(modelData) {
      if (!Array.isArray(modelData)) {
        var modelIndex = this.getModelIndex(modelData._uuid);
        this.removeModelByIndex(modelIndex);
      } else if (Array.isArray(modelData)) {
        modelData.forEach(model => {
          var modelIndex = this.getModelIndex(model._uuid);
          this.removeModelByIndex(modelIndex);
        });
      }

      this.models = this.models.filter(model => model !== null);
      if (this._localStorage) this.db = this.data;
      this.emit('change', null, null, this);
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
      if (this.element.parent) {
        this.element.parent.removeChild(this.element);
      }

      return this;
    }

    render() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (this.template) {
        var template = this.template(data);
        this.element.innerHTML = template;
        this.reset;
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
        this.toggleEvents(bindableEventClassPropertyType, 'on');
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
      var base = this[baseName];
      var baseEvents = this[baseEventsName];
      var baseCallbacks = this[baseCallbacksName];

      if (base && baseEvents && baseCallbacks) {
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
          } else {
            baseTargets.push(base[baseTargetName]);
          }

          baseCallbacks[baseCallbackName] = baseCallbacks[baseCallbackName].bind(this);
          var baseEventCallback = baseCallbacks[baseCallbackName];

          if (baseTargetName && baseEventName && baseTargets.length && baseEventCallback) {
            baseTargets.forEach(baseTarget => {
              try {
                switch (method) {
                  case 'on':
                    baseTarget[method](baseEventName, baseEventCallback);
                    break;

                  case 'off':
                    baseTarget[method](baseEventName, baseEventCallback.name.split(' ')[1]);
                    break;
                }
              } catch (error) {}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL3V1aWQuanMiLCIuLi8uLi9zb3VyY2UvTVZDL1NlcnZpY2UvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL01vZGVsL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Db2xsZWN0aW9uL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9WaWV3L2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Db250cm9sbGVyL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Sb3V0ZXIvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIkV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiA9IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lclxyXG5FdmVudFRhcmdldC5wcm90b3R5cGUub2ZmID0gRXZlbnRUYXJnZXQucHJvdG90eXBlLm9mZiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lclxyXG4iLCJjbGFzcyBFdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2V2ZW50cygpIHtcclxuICAgIHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMgfHwge31cclxuICAgIHJldHVybiB0aGlzLmV2ZW50c1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpIHsgcmV0dXJuIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdIHx8IHt9IH1cclxuICBnZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gKGV2ZW50Q2FsbGJhY2submFtZS5sZW5ndGgpXHJcbiAgICAgID8gZXZlbnRDYWxsYmFjay5uYW1lXHJcbiAgICAgIDogJ2Fub255bW91c0Z1bmN0aW9uJ1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKSB7XHJcbiAgICByZXR1cm4gZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdIHx8IFtdXHJcbiAgfVxyXG4gIG9uKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaykge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5nZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja05hbWUgPSB0aGlzLmdldEV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja0dyb3VwID0gdGhpcy5nZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKVxyXG4gICAgZXZlbnRDYWxsYmFja0dyb3VwLnB1c2goZXZlbnRDYWxsYmFjaylcclxuICAgIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudENhbGxiYWNrc1xyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgb2ZmKCkge1xyXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgICAgY2FzZSAwOlxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrTmFtZSA9ICh0eXBlb2YgZXZlbnRDYWxsYmFjayA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICA/IGV2ZW50Q2FsbGJhY2tcclxuICAgICAgICAgIDogdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKSB7XHJcbiAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1bZXZlbnRDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0pLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgKSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGVtaXQoKSB7XHJcbiAgICBsZXQgX2FyZ3VtZW50cyA9IEFycmF5LmZyb20oYXJndW1lbnRzKVxyXG4gICAgbGV0IGV2ZW50TmFtZSA9IF9hcmd1bWVudHMuc3BsaWNlKDAsIDEpWzBdXHJcbiAgICBsZXQgZXZlbnREYXRhID0gX2FyZ3VtZW50cy5zcGxpY2UoMCwgMSlbMF1cclxuICAgIGxldCBldmVudEFyZ3VtZW50cyA9IF9hcmd1bWVudHMuc3BsaWNlKDApXHJcbiAgICBPYmplY3QuZW50cmllcyh0aGlzLmdldEV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSkpXHJcbiAgICAgIC5mb3JFYWNoKChbZXZlbnRDYWxsYmFja0dyb3VwTmFtZSwgZXZlbnRDYWxsYmFja0dyb3VwXSkgPT4ge1xyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgICAgICAgLmZvckVhY2goKGV2ZW50Q2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgZXZlbnRDYWxsYmFjayhcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBldmVudE5hbWUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBldmVudERhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIC4uLmV2ZW50QXJndW1lbnRzXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBFdmVudHNcclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX3Jlc3BvbnNlcygpIHtcclxuICAgIHRoaXMucmVzcG9uc2VzID0gdGhpcy5yZXNwb25zZXNcclxuICAgICAgPyB0aGlzLnJlc3BvbnNlc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZiAocmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgICB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSA9IHJlc3BvbnNlQ2FsbGJhY2tcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VdXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlcXVlc3QocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZiAodGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0pIHtcclxuICAgICAgdmFyIF9hcmd1bWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLnNsaWNlKDEpXHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSguLi5fYXJndW1lbnRzKVxyXG4gICAgfVxyXG4gIH1cclxuICBvZmYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZiAocmVzcG9uc2VOYW1lKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yICh2YXIgW19yZXNwb25zZU5hbWVdIG9mIE9iamVjdC5rZXlzKHRoaXMuX3Jlc3BvbnNlcykpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW19yZXNwb25zZU5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IENoYW5uZWwgZnJvbSAnLi9DaGFubmVsL2luZGV4J1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfY2hhbm5lbHMoKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzID0gdGhpcy5jaGFubmVsc1xyXG4gICAgICA/IHRoaXMuY2hhbm5lbHNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbHNcclxuICB9XHJcbiAgY2hhbm5lbChjaGFubmVsTmFtZSkge1xyXG4gICAgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdID0gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgID8gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgIDogbmV3IENoYW5uZWwoKVxyXG4gICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxuICBvZmYoY2hhbm5lbE5hbWUpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVVVJRCgpIHtcclxuICB2YXIgdXVpZCA9IFwiXCIsIGksIHJhbmRvbVxyXG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSB7XHJcbiAgICByYW5kb20gPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwXHJcblxyXG4gICAgaWYgKGkgPT0gOCB8fCBpID09IDEyIHx8IGkgPT0gMTYgfHwgaSA9PSAyMCkge1xyXG4gICAgICB1dWlkICs9IFwiLVwiXHJcbiAgICB9XHJcbiAgICB1dWlkICs9IChpID09IDEyID8gNCA6IChpID09IDE2ID8gKHJhbmRvbSAmIDMgfCA4KSA6IHJhbmRvbSkpLnRvU3RyaW5nKDE2KVxyXG4gIH1cclxuICByZXR1cm4gdXVpZFxyXG59XHJcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4J1xuXG5jbGFzcyBTZXJ2aWNlIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAndXJsJyxcbiAgICAnbWV0aG9kJyxcbiAgICAnbW9kZScsXG4gICAgJ2NhY2hlJyxcbiAgICAnY3JlZGVudGlhbHMnLFxuICAgICdoZWFkZXJzJyxcbiAgICAncmVkaXJlY3QnLFxuICAgICdyZWZlcnJlci1wb2xpY3knLFxuICAgICdib2R5JyxcbiAgXSB9XG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICB9KVxuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgdXJsKCkgeyByZXR1cm4gdGhpcy5fdXJsIH1cbiAgc2V0IHVybCh1cmwpIHsgdGhpcy5fdXJsID0gdXJsIH1cbiAgZ2V0IG1ldGhvZCgpIHsgcmV0dXJuIHRoaXMuX21ldGhvZCB9XG4gIHNldCBtb2RlKG1vZGUpIHsgdGhpcy5fbW9kZSA9IG1vZGUgfVxuICBnZXQgbW9kZSgpIHsgcmV0dXJuIHRoaXMuX21vZGUgfVxuICBzZXQgY2FjaGUoY2FjaGUpIHsgdGhpcy5fY2FjaGUgPSBjYWNoZSB9XG4gIGdldCBjYWNoZSgpIHsgcmV0dXJuIHRoaXMuX2NhY2hlIH1cbiAgc2V0IGNyZWRlbnRpYWxzKGNyZWRlbnRpYWxzKSB7IHRoaXMuX2NyZWRlbnRpYWxzID0gY3JlZGVudGlhbHMgfVxuICBnZXQgY3JlZGVudGlhbHMoKSB7IHJldHVybiB0aGlzLl9jcmVkZW50aWFscyB9XG4gIHNldCBoZWFkZXJzKGhlYWRlcnMpIHsgdGhpcy5faGVhZGVycyA9IGhlYWRlcnMgfVxuICBnZXQgaGVhZGVycygpIHsgcmV0dXJuIHRoaXMuX2hlYWRlcnMgfVxuICBzZXQgcmVkaXJlY3QocmVkaXJlY3QpIHsgdGhpcy5fcmVkaXJlY3QgPSByZWRpcmVjdCB9XG4gIGdldCByZWRpcmVjdCgpIHsgcmV0dXJuIHRoaXMuX3JlZGlyZWN0IH1cbiAgc2V0IHJlZmVycmVyUG9saWN5KHJlZmVycmVyUG9saWN5KSB7IHRoaXMuX3JlZmVycmVyUG9saWN5ID0gcmVmZXJyZXJQb2xpY3kgfVxuICBnZXQgcmVmZXJyZXJQb2xpY3koKSB7IHJldHVybiB0aGlzLl9yZWZlcnJlclBvbGljeSB9XG4gIHNldCBib2R5KGJvZHkpIHsgdGhpcy5fYm9keSA9IGJvZHkgfVxuICBnZXQgYm9keSgpIHsgcmV0dXJuIHRoaXMuX2JvZHkgfVxuICBnZXQgcHJldmlvdXNBYm9ydENvbnRyb2xsZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ByZXZpb3VzQWJvcnRDb250cm9sbGVyXG4gIH1cbiAgc2V0IHByZXZpb3VzQWJvcnRDb250cm9sbGVyKHByZXZpb3VzQWJvcnRDb250cm9sbGVyKSB7IHRoaXMuX3ByZXZpb3VzQWJvcnRDb250cm9sbGVyID0gcHJldmlvdXNBYm9ydENvbnRyb2xsZXIgfVxuICBnZXQgYWJvcnRDb250cm9sbGVyKCkge1xuICAgIGlmKCF0aGlzLl9hYm9ydENvbnRyb2xsZXIpIHtcbiAgICAgIHRoaXMucHJldmlvdXNBYm9ydENvbnRyb2xsZXIgPSB0aGlzLl9hYm9ydENvbnRyb2xsZXJcbiAgICB9XG4gICAgdGhpcy5fYWJvcnRDb250cm9sbGVyID0gbmV3IEFib3J0Q29udHJvbGxlcigpXG4gICAgcmV0dXJuIHRoaXMuX2Fib3J0Q29udHJvbGxlclxuICB9XG4gIGFib3J0KCkge1xuICAgIHRoaXMuYWJvcnRDb250cm9sbGVyLmFib3J0KClcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGZldGNoKCkge1xuICAgIGNvbnN0IGZldGNoT3B0aW9ucyA9IHRoaXMudmFsaWRTZXR0aW5ncy5yZWR1Y2UoKF9mZXRjaE9wdGlvbnMsIFtmZXRjaE9wdGlvbk5hbWUsIGZldGNoT3B0aW9uVmFsdWVdKSA9PiB7XG4gICAgICBpZih0aGlzW2ZldGNoT3B0aW9uTmFtZV0pIF9mZXRjaE9wdGlvbnNbZmV0Y2hPcHRpb25OYW1lXSA9IGZldGNoT3B0aW9uVmFsdWVcbiAgICAgIHJldHVybiBfZmV0Y2hPcHRpb25zXG4gICAgfSwge30pXG4gICAgZmV0Y2hPcHRpb25zLnNpZ25hbCA9IHRoaXMuYWJvcnRDb250cm9sbGVyLnNpZ25hbFxuICAgIGlmKHRoaXMucHJldmlvdXNBYm9ydENvbnRyb2xsZXIpIHRoaXMucHJldmlvdXNBYm9ydENvbnRyb2xsZXIuYWJvcnQoKVxuICAgIHJldHVybiBmZXRjaCh0aGlzLnVybCwgZmV0Y2hPcHRpb25zKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKClcbiAgICAgIH0pXG4gICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ3JlYWR5Jywge1xuICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGRhdGFcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBcbiAgICAgIH0pXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFNlcnZpY2VcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xuXG5jb25zdCBNb2RlbCA9IGNsYXNzIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAnbG9jYWxTdG9yYWdlJyxcbiAgICAnZGVmYXVsdHMnLFxuICAgICdzZXJ2aWNlcycsXG4gICAgJ3NlcnZpY2VFdmVudHMnLFxuICAgICdzZXJ2aWNlQ2FsbGJhY2tzJyxcbiAgXSB9XG4gIGdldCBiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzKCkgeyByZXR1cm4gW1xuICAgICdzZXJ2aWNlJyxcbiAgXSB9XG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICB9KVxuICAgIHRoaXMuYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlc1xuICAgICAgLmZvckVhY2goKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUsICdvbicpXG4gICAgICB9KVxuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgc2VydmljZXMoKSB7XG4gICAgaWYoIXRoaXMuX3NlcnZpY2VzKSB0aGlzLl9zZXJ2aWNlcyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX3NlcnZpY2VzXG4gIH1cbiAgc2V0IHNlcnZpY2VzKHNlcnZpY2VzKSB7IHRoaXMuX3NlcnZpY2VzID0gc2VydmljZXMgfVxuICBnZXQgZGF0YSgpIHtcbiAgICBpZighdGhpcy5fZGF0YSkgdGhpcy5fZGF0YSA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFcbiAgfVxuICBnZXQgZGVmYXVsdHMoKSB7XG4gICAgaWYoIXRoaXMuX2RlZmF1bHRzKSB0aGlzLl9kZWZhdWx0cyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRzXG4gIH1cbiAgc2V0IGRlZmF1bHRzKGRlZmF1bHRzKSB7XG4gICAgdGhpcy5fZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgIHRoaXMuc2V0KHRoaXMuZGVmYXVsdHMpXG4gIH1cbiAgZ2V0IGxvY2FsU3RvcmFnZSgpIHsgcmV0dXJuIHRoaXMuX2xvY2FsU3RvcmFnZSB9XG4gIHNldCBsb2NhbFN0b3JhZ2UobG9jYWxTdG9yYWdlKSB7IHRoaXMuX2xvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XG4gIGdldCBkYigpIHsgcmV0dXJuIHRoaXMuX2RiIH1cbiAgZ2V0IF9kYigpIHtcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgfHwgSlNPTi5zdHJpbmdpZnkodGhpcy5zdG9yYWdlQ29udGFpbmVyKVxuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICByZXNldEV2ZW50cyhjbGFzc1R5cGUpIHtcbiAgICBbXG4gICAgICAnb2ZmJyxcbiAgICAgICdvbidcbiAgICBdLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICAgICAgdGhpcy50b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpXG4gICAgfSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZCkge1xuICAgIGNvbnN0IGJhc2VOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgncycpXG4gICAgY29uc3QgYmFzZUV2ZW50c05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdFdmVudHMnKVxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3NOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJylcbiAgICBjb25zdCBiYXNlID0gdGhpc1tiYXNlTmFtZV1cbiAgICBjb25zdCBiYXNlRXZlbnRzID0gdGhpc1tiYXNlRXZlbnRzTmFtZV1cbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzID0gdGhpc1tiYXNlQ2FsbGJhY2tzTmFtZV1cbiAgICBpZihcbiAgICAgIGJhc2UgJiZcbiAgICAgIGJhc2VFdmVudHMgJiZcbiAgICAgIGJhc2VDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKGJhc2VFdmVudHMpXG4gICAgICAgIC5mb3JFYWNoKChbYmFzZUV2ZW50RGF0YSwgYmFzZUNhbGxiYWNrTmFtZV0pID0+IHtcbiAgICAgICAgICBjb25zdCBbYmFzZVRhcmdldE5hbWUsIGJhc2VFdmVudE5hbWVdID0gYmFzZUV2ZW50RGF0YS5zcGxpdCgnICcpXG4gICAgICAgICAgY29uc3QgYmFzZVRhcmdldCA9IGJhc2VbYmFzZVRhcmdldE5hbWVdXG4gICAgICAgICAgY29uc3QgYmFzZUNhbGxiYWNrID0gYnNlQ2FsbGJhY2tzW2Jhc2VDYWxsYmFja05hbWVdXG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldCAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2tcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHt9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHNldERCKCkge1xuICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdmFyIF9hcmd1bWVudHMgPSBPYmplY3QuZW50cmllcyhhcmd1bWVudHNbMF0pXG4gICAgICAgIF9hcmd1bWVudHMuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgZGJba2V5XSA9IHZhbHVlXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgbGV0IHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICBicmVha1xuICAgIH1cbiAgICB0aGlzLl9kYiA9IGRiXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldERCKCkge1xuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9kYlxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGRlbGV0ZSBkYltrZXldXG4gICAgICAgIHRoaXMuX2RiID0gZGJcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSkge1xuICAgIGlmKCF0aGlzLmRhdGFba2V5XSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcy5kYXRhLCB7XG4gICAgICAgIFsnXycuY29uY2F0KGtleSldOiB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBba2V5XToge1xuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNbJ18nLmNvbmNhdChrZXkpXSB9LFxuICAgICAgICAgIHNldCh2YWx1ZSkgeyB0aGlzWydfJy5jb25jYXQoa2V5KV0gPSB2YWx1ZSB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLmRhdGFba2V5XSA9IHZhbHVlXG4gICAgdGhpcy5lbWl0KCdzZXQnLmNvbmNhdCgnOicsIGtleSksIHtcbiAgICAgIGtleToga2V5LFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfSwgdGhpcylcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0RGF0YVByb3BlcnR5KGtleSkge1xuICAgIGlmKHRoaXMuZGF0YVtrZXldKSB7XG4gICAgICBkZWxldGUgdGhpcy5kYXRhW2tleV1cbiAgICB9XG4gICAgdGhpcy5lbWl0KCd1bnNldCcuY29uY2F0KCc6JywgYXJndW1lbnRzWzBdKSwgdGhpcylcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGdldCgpIHtcbiAgICBpZihhcmd1bWVudHNbMF0pIHJldHVybiB0aGlzLmRhdGFbYXJndW1lbnRzWzBdXVxuICAgIHJldHVybiBPYmplY3QuZW50cmllcyh0aGlzLmRhdGEpXG4gICAgICAucmVkdWNlKChfZGF0YSwgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIF9kYXRhW2tleV0gPSB2YWx1ZVxuICAgICAgICByZXR1cm4gX2RhdGFcbiAgICAgIH0sIHt9KVxuICB9XG4gIHNldCgpIHtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSlcbiAgICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlKSB0aGlzLnNldERCKGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKVxuICAgIH0gZWxzZSBpZihcbiAgICAgIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiZcbiAgICAgICFBcnJheS5pc0FycmF5KGFyZ3VtZW50c1swXSkgJiZcbiAgICAgIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnXG4gICAgKSB7XG4gICAgICBPYmplY3QuZW50cmllcyhhcmd1bWVudHNbMF0pLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy5zZXREQihrZXksIHZhbHVlKVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5lbWl0KCdzZXQnLCB0aGlzLmRhdGEsIHRoaXMpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldCgpIHtcbiAgICBpZihhcmd1bWVudHNbMF0pIHtcbiAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoYXJndW1lbnRzWzBdKVxuICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIHRoaXMudW5zZXREQihrZXkpXG4gICAgfSBlbHNlIHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZGF0YSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy51bnNldERCKGtleSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuZW1pdCgndW5zZXQnLCB0aGlzKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgcGFyc2UoZGF0YSA9IHRoaXMuZGF0YSkge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhkYXRhKS5yZWR1Y2UoKF9kYXRhLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgTW9kZWwpIHtcbiAgICAgICAgX2RhdGFba2V5XSA9IHZhbHVlLnBhcnNlKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9kYXRhW2tleV0gPSB2YWx1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIF9kYXRhXG4gICAgfSwge30pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW9kZWxcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xyXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vTW9kZWwvaW5kZXguanMnXHJcblxyXG5jbGFzcyBDb2xsZWN0aW9uIGV4dGVuZHMgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xyXG4gIH1cclxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcclxuICAgICdpZEF0dHJpYnV0ZScsXHJcbiAgICAnbW9kZWwnLFxyXG4gICAgJ2RlZmF1bHRzJyxcclxuICAgICdzZXJ2aWNlcycsXHJcbiAgICAnc2VydmljZUV2ZW50cycsXHJcbiAgICAnc2VydmljZUNhbGxiYWNrcycsXHJcbiAgICAnbG9jYWxTdG9yYWdlJ1xyXG4gIF0gfVxyXG4gIGdldCBiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzKCkgeyByZXR1cm4gW1xyXG4gICAgJ3NlcnZpY2UnXHJcbiAgXSB9XHJcbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxyXG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xyXG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xyXG4gICAgICBpZihzZXR0aW5nc1t2YWxpZFNldHRpbmddKSB0aGlzW3ZhbGlkU2V0dGluZ10gPSBzZXR0aW5nc1t2YWxpZFNldHRpbmddXHJcbiAgICB9KVxyXG4gICAgdGhpcy5iaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzXHJcbiAgICAgIC5mb3JFYWNoKChiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUpID0+IHtcclxuICAgICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUsICdvbicpXHJcbiAgICAgIH0pXHJcbiAgfVxyXG4gIGdldCBvcHRpb25zKCkge1xyXG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxyXG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcclxuICB9XHJcbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XHJcbiAgZ2V0IHN0b3JhZ2VDb250YWluZXIoKSB7IHJldHVybiBbXSB9XHJcbiAgZ2V0IGRlZmF1bHRJREF0dHJpYnV0ZSgpIHsgcmV0dXJuICdfaWQnIH1cclxuICBnZXQgZGVmYXVsdHMoKSB7IHJldHVybiB0aGlzLl9kZWZhdWx0cyB9XHJcbiAgc2V0IGRlZmF1bHRzKGRlZmF1bHRzKSB7XHJcbiAgICB0aGlzLl9kZWZhdWx0cyA9IGRlZmF1bHRzXHJcbiAgICB0aGlzLmFkZChkZWZhdWx0cylcclxuICB9XHJcbiAgZ2V0IG1vZGVscygpIHtcclxuICAgIHRoaXMuX21vZGVscyA9IHRoaXMuX21vZGVscyB8fCB0aGlzLnN0b3JhZ2VDb250YWluZXJcclxuICAgIHJldHVybiB0aGlzLl9tb2RlbHNcclxuICB9XHJcbiAgc2V0IG1vZGVscyhtb2RlbHNEYXRhKSB7IHRoaXMuX21vZGVscyA9IG1vZGVsc0RhdGEgfVxyXG4gIGdldCBtb2RlbCgpIHsgcmV0dXJuIHRoaXMuX21vZGVsIH1cclxuICBzZXQgbW9kZWwobW9kZWwpIHsgdGhpcy5fbW9kZWwgPSBtb2RlbCB9XHJcbiAgZ2V0IGxvY2FsU3RvcmFnZSgpIHsgcmV0dXJuIHRoaXMuX2xvY2FsU3RvcmFnZSB9XHJcbiAgc2V0IGxvY2FsU3RvcmFnZShsb2NhbFN0b3JhZ2UpIHsgdGhpcy5fbG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yYWdlIH1cclxuICBnZXQgZGF0YSgpIHsgcmV0dXJuIHRoaXMuX2RhdGEgfVxyXG4gIGdldCBkYXRhKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX21vZGVsc1xyXG4gICAgICAubWFwKChtb2RlbCkgPT4gbW9kZWwucGFyc2UoKSlcclxuICB9XHJcbiAgZ2V0IGRiKCkgeyByZXR1cm4gdGhpcy5fZGIgfVxyXG4gIGdldCBkYigpIHtcclxuICAgIGxldCBkYiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50KSB8fCBKU09OLnN0cmluZ2lmeSh0aGlzLnN0b3JhZ2VDb250YWluZXIpXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShkYilcclxuICB9XHJcbiAgc2V0IGRiKGRiKSB7XHJcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQsIGRiKVxyXG4gIH1cclxuICByZXNldEV2ZW50cyhjbGFzc1R5cGUpIHtcclxuICAgIFtcclxuICAgICAgJ29mZicsXHJcbiAgICAgICdvbidcclxuICAgIF0uZm9yRWFjaCgobWV0aG9kKSA9PiB7XHJcbiAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKVxyXG4gICAgfSlcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZCkge1xyXG4gICAgY29uc3QgYmFzZU5hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdzJylcclxuICAgIGNvbnN0IGJhc2VFdmVudHNOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJylcclxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3NOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJylcclxuICAgIGNvbnN0IGJhc2UgPSB0aGlzW2Jhc2VOYW1lXVxyXG4gICAgY29uc3QgYmFzZUV2ZW50cyA9IHRoaXNbYmFzZUV2ZW50c05hbWVdXHJcbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzID0gdGhpc1tiYXNlQ2FsbGJhY2tzTmFtZV1cclxuICAgIGlmKFxyXG4gICAgICBiYXNlICYmXHJcbiAgICAgIGJhc2VFdmVudHMgJiZcclxuICAgICAgYmFzZUNhbGxiYWNrc1xyXG4gICAgKSB7XHJcbiAgICAgIE9iamVjdC5lbnRyaWVzKGJhc2VFdmVudHMpXHJcbiAgICAgICAgLmZvckVhY2goKFtiYXNlRXZlbnREYXRhLCBiYXNlQ2FsbGJhY2tOYW1lXSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgW2Jhc2VUYXJnZXROYW1lLCBiYXNlRXZlbnROYW1lXSA9IGJhc2VFdmVudERhdGEuc3BsaXQoJyAnKVxyXG4gICAgICAgICAgY29uc3QgYmFzZVRhcmdldCA9IGJhc2VbYmFzZVRhcmdldE5hbWVdXHJcbiAgICAgICAgICBjb25zdCBiYXNlRXZlbnRDYWxsYmFjayA9IGJhc2VDYWxsYmFja3NbYmFzZUNhbGxiYWNrTmFtZV1cclxuICAgICAgICAgIGlmKFxyXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxyXG4gICAgICAgICAgICBiYXNlRXZlbnROYW1lICYmXHJcbiAgICAgICAgICAgIGJhc2VUYXJnZXQgJiZcclxuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2tcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcclxuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge31cclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgZ2V0TW9kZWxJbmRleChtb2RlbFVVSUQpIHtcclxuICAgIGxldCBtb2RlbEluZGV4XHJcbiAgICB0aGlzLl9tb2RlbHNcclxuICAgICAgLmZpbmQoKF9tb2RlbCwgX21vZGVsSW5kZXgpID0+IHtcclxuICAgICAgICBpZihfbW9kZWwgIT09IG51bGwpIHtcclxuICAgICAgICAgIGlmKFxyXG4gICAgICAgICAgICBfbW9kZWwgaW5zdGFuY2VvZiBNb2RlbCAmJlxyXG4gICAgICAgICAgICBfbW9kZWwuX3V1aWQgPT09IG1vZGVsVVVJRFxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIG1vZGVsSW5kZXggPSBfbW9kZWxJbmRleFxyXG4gICAgICAgICAgICByZXR1cm4gX21vZGVsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgcmV0dXJuIG1vZGVsSW5kZXhcclxuICB9XHJcbiAgcmVtb3ZlTW9kZWxCeUluZGV4KG1vZGVsSW5kZXgpIHtcclxuICAgIGxldCBtb2RlbCA9IHRoaXMuX21vZGVscy5zcGxpY2UobW9kZWxJbmRleCwgMSwgbnVsbClcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ3JlbW92ZScsXHJcbiAgICAgIHt9LFxyXG4gICAgICBtb2RlbFswXSxcclxuICAgICAgdGhpc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgYWRkTW9kZWwobW9kZWxEYXRhKSB7XHJcbiAgICBsZXQgbW9kZWxcclxuICAgIGxldCBzb21lTW9kZWwgPSBuZXcgTW9kZWwoKVxyXG4gICAgaWYobW9kZWxEYXRhIGluc3RhbmNlb2YgTW9kZWwpIHtcclxuICAgICAgbW9kZWwgPSBtb2RlbERhdGFcclxuICAgIH0gZWxzZSBpZihcclxuICAgICAgdGhpcy5tb2RlbFxyXG4gICAgKSB7XHJcbiAgICAgIG1vZGVsID0gbmV3IHRoaXMubW9kZWwoKVxyXG4gICAgICBtb2RlbC5zZXQobW9kZWxEYXRhKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbW9kZWwgPSBuZXcgTW9kZWwoKVxyXG4gICAgICBtb2RlbC5zZXQobW9kZWxEYXRhKVxyXG4gICAgfVxyXG4gICAgbW9kZWwub24oXHJcbiAgICAgICdzZXQnLFxyXG4gICAgICAoZXZlbnQsIF9tb2RlbCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZW1pdChcclxuICAgICAgICAgICdjaGFuZ2UnLFxyXG4gICAgICAgICAgbW9kZWwucGFyc2UoKSxcclxuICAgICAgICAgIG1vZGVsLFxyXG4gICAgICAgICAgdGhpc1xyXG4gICAgICAgIClcclxuICAgICAgfVxyXG4gICAgKVxyXG4gICAgdGhpcy5tb2RlbHMucHVzaChtb2RlbClcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ2FkZCcsXHJcbiAgICAgIG1vZGVsLnBhcnNlKCksXHJcbiAgICAgIG1vZGVsLFxyXG4gICAgICB0aGlzXHJcbiAgICApXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdjaGFuZ2UnLFxyXG4gICAgICBtb2RlbC5wYXJzZSgpLFxyXG4gICAgICBtb2RlbCxcclxuICAgICAgdGhpc1xyXG4gICAgKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgYWRkKG1vZGVsRGF0YSkge1xyXG4gICAgaWYoQXJyYXkuaXNBcnJheShtb2RlbERhdGEpKSB7XHJcbiAgICAgIG1vZGVsRGF0YVxyXG4gICAgICAgIC5mb3JFYWNoKChtb2RlbCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5hZGRNb2RlbChtb2RlbClcclxuICAgICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hZGRNb2RlbChtb2RlbERhdGEpXHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy5kYiA9IHRoaXMuZGF0YVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcmVtb3ZlKG1vZGVsRGF0YSkge1xyXG4gICAgaWYoXHJcbiAgICAgICFBcnJheS5pc0FycmF5KG1vZGVsRGF0YSlcclxuICAgICkge1xyXG4gICAgICB2YXIgbW9kZWxJbmRleCA9IHRoaXMuZ2V0TW9kZWxJbmRleChtb2RlbERhdGEuX3V1aWQpXHJcbiAgICAgIHRoaXMucmVtb3ZlTW9kZWxCeUluZGV4KG1vZGVsSW5kZXgpXHJcbiAgICB9IGVsc2UgaWYoQXJyYXkuaXNBcnJheShtb2RlbERhdGEpKSB7XHJcbiAgICAgIG1vZGVsRGF0YVxyXG4gICAgICAgIC5mb3JFYWNoKChtb2RlbCkgPT4ge1xyXG4gICAgICAgICAgdmFyIG1vZGVsSW5kZXggPSB0aGlzLmdldE1vZGVsSW5kZXgobW9kZWwuX3V1aWQpXHJcbiAgICAgICAgICB0aGlzLnJlbW92ZU1vZGVsQnlJbmRleChtb2RlbEluZGV4KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICB0aGlzLm1vZGVscyA9IHRoaXMubW9kZWxzXHJcbiAgICAgIC5maWx0ZXIoKG1vZGVsKSA9PiBtb2RlbCAhPT0gbnVsbClcclxuICAgIGlmKHRoaXMuX2xvY2FsU3RvcmFnZSkgdGhpcy5kYiA9IHRoaXMuZGF0YVxyXG5cclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ2NoYW5nZScsXHJcbiAgICAgIG51bGwsXHJcbiAgICAgIG51bGwsXHJcbiAgICAgIHRoaXNcclxuICAgIClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHJlc2V0KCkge1xyXG4gICAgdGhpcy5yZW1vdmUodGhpcy5fbW9kZWxzKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcGFyc2UoZGF0YSkge1xyXG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5kYXRhIHx8IHRoaXMuc3RvcmFnZUNvbnRhaW5lclxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb2xsZWN0aW9uXHJcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xuXG5jbGFzcyBWaWV3IGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAnYXR0cmlidXRlcycsXG4gICAgJ2VsZW1lbnROYW1lJyxcbiAgICAnZWxlbWVudCcsXG4gICAgJ2luc2VydCcsXG4gICAgJ3RlbXBsYXRlJyxcbiAgICAndWlFbGVtZW50cycsXG4gICAgJ3VpRWxlbWVudEV2ZW50cycsXG4gICAgJ3VpRWxlbWVudENhbGxiYWNrcycsXG4gICAgJ3JlbmRlcidcbiAgXSB9XG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICB9KVxuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgZWxlbWVudE5hbWUoKSB7IHJldHVybiB0aGlzLl9lbGVtZW50TmFtZSB9XG4gIHNldCBlbGVtZW50TmFtZShlbGVtZW50TmFtZSkgeyB0aGlzLl9lbGVtZW50TmFtZSA9IGVsZW1lbnROYW1lIH1cbiAgZ2V0IGVsZW1lbnQoKSB7XG4gICAgaWYoIXRoaXMuX2VsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMuZWxlbWVudE5hbWUpXG4gICAgICBPYmplY3QuZW50cmllcyh0aGlzLmF0dHJpYnV0ZXMpLmZvckVhY2goKFthdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlXSkgPT4ge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKVxuICAgICAgfSlcbiAgICAgIHRoaXMuZWxlbWVudE9ic2VydmVyLm9ic2VydmUodGhpcy5lbGVtZW50LCB7XG4gICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50XG4gIH1cbiAgZ2V0IGVsZW1lbnRPYnNlcnZlcigpIHtcbiAgICB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgPSB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgfHwgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoXG4gICAgICB0aGlzLmVsZW1lbnRPYnNlcnZlLmJpbmQodGhpcylcbiAgICApXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRPYnNlcnZlclxuICB9XG4gIHNldCBlbGVtZW50KGVsZW1lbnQpIHtcbiAgICBpZihlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50XG4gIH1cbiAgZ2V0IGF0dHJpYnV0ZXMoKSB7IHJldHVybiB0aGlzLl9hdHRyaWJ1dGVzIHx8IHt9IH1cbiAgc2V0IGF0dHJpYnV0ZXMoYXR0cmlidXRlcykgeyB0aGlzLl9hdHRyaWJ1dGVzID0gYXR0cmlidXRlcyB9XG4gIGdldCB0ZW1wbGF0ZSgpIHsgcmV0dXJuIHRoaXMuX3RlbXBsYXRlIH1cbiAgc2V0IHRlbXBsYXRlKHRlbXBsYXRlKSB7IHRoaXMuX3RlbXBsYXRlID0gdGVtcGxhdGUgfVxuICBnZXQgdWlFbGVtZW50cygpIHsgcmV0dXJuIHRoaXMuX3VpRWxlbWVudHMgfHwge30gfVxuICBzZXQgdWlFbGVtZW50cyh1aUVsZW1lbnRzKSB7XG4gICAgdGhpcy5fdWlFbGVtZW50cyA9IHVpRWxlbWVudHNcbiAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gIH1cbiAgZ2V0IHVpRWxlbWVudEV2ZW50cygpIHsgcmV0dXJuIHRoaXMuX3VpRWxlbWVudEV2ZW50cyB8fCB7fSB9XG4gIHNldCB1aUVsZW1lbnRFdmVudHModWlFbGVtZW50RXZlbnRzKSB7XG4gICAgdGhpcy5fdWlFbGVtZW50RXZlbnRzID0gdWlFbGVtZW50RXZlbnRzXG4gICAgdGhpcy50b2dnbGVFdmVudHMoKVxuICB9XG4gIGdldCB1aUVsZW1lbnRDYWxsYmFja3MoKSB7IHJldHVybiB0aGlzLl91aUVsZW1lbnRDYWxsYmFja3MgfHwge30gfVxuICBzZXQgdWlFbGVtZW50Q2FsbGJhY2tzKHVpRWxlbWVudENhbGxiYWNrcykge1xuICAgIHRoaXMuX3VpRWxlbWVudENhbGxiYWNrcyA9IHVpRWxlbWVudENhbGxiYWNrc1xuICAgIHRoaXMudG9nZ2xlRXZlbnRzKClcbiAgfVxuICBnZXQgdWkoKSB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXNcbiAgICBpZighdGhpcy5fdWkpIHtcbiAgICAgIHRoaXMuX3VpID0gT2JqZWN0LmVudHJpZXModGhpcy51aUVsZW1lbnRzKS5yZWR1Y2UoKF91aSxbdWlFbGVtZW50TmFtZSwgdWlFbGVtZW50UXVlcnldKSA9PiB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKF91aSwge1xuICAgICAgICAgIFt1aUVsZW1lbnROYW1lXToge1xuICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICBpZih0eXBlb2YgdWlFbGVtZW50UXVlcnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5UmVzdWx0cyA9IGNvbnRleHQuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHVpRWxlbWVudFF1ZXJ5KVxuICAgICAgICAgICAgICAgIHJldHVybiAocXVlcnlSZXN1bHRzLmxlbmd0aCA+IDEpID8gcXVlcnlSZXN1bHRzIDogcXVlcnlSZXN1bHRzLml0ZW0oMClcbiAgICAgICAgICAgICAgfSBlbHNlIGlmKFxuICAgICAgICAgICAgICAgIHVpRWxlbWVudFF1ZXJ5IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcbiAgICAgICAgICAgICAgICB1aUVsZW1lbnRRdWVyeSBpbnN0YW5jZW9mIERvY3VtZW50IHx8XG4gICAgICAgICAgICAgICAgdWlFbGVtZW50UXVlcnkgaW5zdGFuY2VvZiBXaW5kb3dcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVpRWxlbWVudFF1ZXJ5XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gX3VpXG4gICAgICB9LCB7fSlcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMuX3VpLCB7XG4gICAgICAgICckZWxlbWVudCc6IHtcbiAgICAgICAgICBnZXQoKSB7IHJldHVybiBjb250ZXh0LmVsZW1lbnQgfVxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3VpXG4gIH1cbiAgZWxlbWVudE9ic2VydmUobXV0YXRpb25SZWNvcmRMaXN0LCBvYnNlcnZlcikge1xuICAgIGZvcihsZXQgW211dGF0aW9uUmVjb3JkSW5kZXgsIG11dGF0aW9uUmVjb3JkXSBvZiBPYmplY3QuZW50cmllcyhtdXRhdGlvblJlY29yZExpc3QpKSB7XG4gICAgICBzd2l0Y2gobXV0YXRpb25SZWNvcmQudHlwZSkge1xuICAgICAgICBjYXNlICdjaGlsZExpc3QnOlxuICAgICAgICAgIGlmKG11dGF0aW9uUmVjb3JkLmFkZGVkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyh0aGlzLnVpKSlcbiAgICAgICAgICAgIC5mb3JFYWNoKChbdWlLZXksIHVpVmFsdWVdKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHVpVmFsdWVHZXQgPSB1aVZhbHVlLmdldCgpXG4gICAgICAgICAgICAgIGNvbnN0IGFkZGVkVUlFbGVtZW50ID0gQXJyYXkuZnJvbShtdXRhdGlvblJlY29yZC5hZGRlZE5vZGVzKS5maW5kKChhZGRlZE5vZGUpID0+IGFkZGVkTm9kZSA9PT0gdWlWYWx1ZUdldClcbiAgICAgICAgICAgICAgaWYoYWRkZWRVSUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZUV2ZW50cyh1aUtleSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYmluZEV2ZW50VG9FbGVtZW50KGVsZW1lbnQsIG1ldGhvZCwgZXZlbnROYW1lLCBldmVudENhbGxiYWNrTmFtZSkge1xuICAgIHRyeSB7XG4gICAgICBzd2l0Y2gobWV0aG9kKSB7XG4gICAgICAgIGNhc2UgJ2FkZEV2ZW50TGlzdGVuZXInOlxuICAgICAgICAgIHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXS5iaW5kKHRoaXMpXG4gICAgICAgICAgZWxlbWVudFttZXRob2RdKGV2ZW50TmFtZSwgdGhpcy51aUVsZW1lbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3JlbW92ZUV2ZW50TGlzdGVuZXInOlxuICAgICAgICAgIGVsZW1lbnRbbWV0aG9kXShldmVudE5hbWUsIHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSlcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH0gY2F0Y2goZXJyb3IpIHt9XG4gIH1cbiAgdG9nZ2xlRXZlbnRzKHRhcmdldFVJRWxlbWVudE5hbWUgPSBudWxsKSB7XG4gICAgdGhpcy5pc1RvZ2dsaW5nID0gdHJ1ZVxuICAgIGNvbnN0IHVpID0gdGhpcy51aVxuICAgIGNvbnN0IGV2ZW50QmluZE1ldGhvZHMgPSBbJ3JlbW92ZUV2ZW50TGlzdGVuZXInLCAnYWRkRXZlbnRMaXN0ZW5lciddXG4gICAgaWYoIXRhcmdldFVJRWxlbWVudE5hbWUpIHtcbiAgICAgIGV2ZW50QmluZE1ldGhvZHMuZm9yRWFjaCgoZXZlbnRCaW5kTWV0aG9kKSA9PiB7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMudWlFbGVtZW50RXZlbnRzKS5mb3JFYWNoKChbdWlFbGVtZW50RXZlbnRTZXR0aW5ncywgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWVdKSA9PiB7XG4gICAgICAgICAgbGV0IFt1aUVsZW1lbnROYW1lLCB1aUVsZW1lbnRFdmVudE5hbWVdID0gdWlFbGVtZW50RXZlbnRTZXR0aW5ncy5zcGxpdCgnICcpXG4gICAgICAgICAgaWYodWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xuICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0uZm9yRWFjaCgodWlFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50VG9FbGVtZW50KHVpRWxlbWVudCwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2UgaWYoXG4gICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIERvY3VtZW50IHx8XG4gICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIFdpbmRvd1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlbdWlFbGVtZW50TmFtZV0sIGV2ZW50QmluZE1ldGhvZCwgdWlFbGVtZW50RXZlbnROYW1lLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBldmVudEJpbmRNZXRob2RzLmZvckVhY2goKGV2ZW50QmluZE1ldGhvZCkgPT4ge1xuICAgICAgICBjb25zdCB1aUVsZW1lbnRFdmVudHMgPSBPYmplY3QuZW50cmllcyh0aGlzLnVpRWxlbWVudEV2ZW50cykuZm9yRWFjaCgoW3VpRWxlbWVudEV2ZW50U2V0dGluZ3MsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGxldCBbdWlFbGVtZW50TmFtZSwgdWlFbGVtZW50RXZlbnROYW1lXSA9IHVpRWxlbWVudEV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxuICAgICAgICAgIGlmKHRhcmdldFVJRWxlbWVudE5hbWUgPT09IHVpRWxlbWVudE5hbWUpIHtcbiAgICAgICAgICAgIGlmKHVpW3VpRWxlbWVudE5hbWVdIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0uZm9yRWFjaCgodWlFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlFbGVtZW50LCBldmVudEJpbmRNZXRob2QsIHVpRWxlbWVudEV2ZW50TmFtZSwgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2UgaWYodWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICB0aGlzLmJpbmRFdmVudFRvRWxlbWVudCh1aVt1aUVsZW1lbnROYW1lXSwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuaXNUb2dnbGluZyA9IGZhbHNlXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdXRvSW5zZXJ0KCkge1xuICAgIGlmKHRoaXMuaW5zZXJ0KSB7XG4gICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmluc2VydC5wYXJlbnRcbiAgICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMuaW5zZXJ0Lm1ldGhvZFxuICAgICAgcGFyZW50Lmluc2VydEFkamFjZW50RWxlbWVudChtZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdXRvUmVtb3ZlKCkge1xuICAgIGlmKHRoaXMuZWxlbWVudC5wYXJlbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHJlbmRlcihkYXRhID0ge30pIHtcbiAgICBpZih0aGlzLnRlbXBsYXRlKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUoZGF0YSlcbiAgICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZVxuICAgICAgdGhpcy5yZXNldFxuICAgIH1cbiAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgVmlld1xuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXgnXG5cbmNvbnN0IENvbnRyb2xsZXIgPSBjbGFzcyBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ21vZGVscycsXG4gICAgJ21vZGVsRXZlbnRzJyxcbiAgICAnbW9kZWxDYWxsYmFja3MnLFxuICAgICdjb2xsZWN0aW9ucycsXG4gICAgJ2NvbGxlY3Rpb25FdmVudHMnLFxuICAgICdjb2xsZWN0aW9uQ2FsbGJhY2tzJyxcbiAgICAndmlld3MnLFxuICAgICd2aWV3RXZlbnRzJyxcbiAgICAndmlld0NhbGxiYWNrcycsXG4gICAgJ2NvbnRyb2xsZXJzJyxcbiAgICAnY29udHJvbGxlckV2ZW50cycsXG4gICAgJ2NvbnRyb2xsZXJDYWxsYmFja3MnLFxuICAgICdyb3V0ZXJzJyxcbiAgICAncm91dGVyRXZlbnRzJyxcbiAgICAncm91dGVyQ2FsbGJhY2tzJyxcbiAgXSB9XG4gIGdldCBiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzKCkgeyByZXR1cm4gW1xuICAgICdtb2RlbCcsXG4gICAgJ3ZpZXcnLFxuICAgICdjb2xsZWN0aW9uJyxcbiAgICAnY29udHJvbGxlcicsXG4gICAgJ3JvdXRlcicsXG4gIF0gfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cbiAgZ2V0IHNldHRpbmdzKCkge1xuICAgIGlmKCF0aGlzLl9zZXR0aW5ncykgdGhpcy5fc2V0dGluZ3MgPSB7fVxuICAgIHJldHVybiB0aGlzLl9zZXR0aW5nc1xuICB9XG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3NcbiAgICAgIC5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgICAgaWYodGhpcy5zZXR0aW5nc1t2YWxpZFNldHRpbmddKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBbJ18nLmNvbmNhdCh2YWxpZFNldHRpbmcpXToge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtYmVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFt2YWxpZFNldHRpbmddOiB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZ2V0KCkgeyByZXR1cm4gdGhpc1snXycuY29uY2F0KHZhbGlkU2V0dGluZyldIH0sXG4gICAgICAgICAgICAgICAgc2V0KHZhbHVlKSB7IHRoaXNbJ18nLmNvbmNhdCh2YWxpZFNldHRpbmcpXSA9IHZhbHVlIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9XG4gICAgICAgICAgKVxuICAgICAgICAgIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHRoaXMuc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIHRoaXMuYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlc1xuICAgICAgLmZvckVhY2goKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUsICdvbicpXG4gICAgICB9KVxuICB9XG4gIHJlc2V0RXZlbnRzKGNsYXNzVHlwZSkge1xuICAgIFtcbiAgICAgICdvZmYnLFxuICAgICAgJ29uJ1xuICAgIF0uZm9yRWFjaCgobWV0aG9kKSA9PiB7XG4gICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZClcbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgdG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKSB7XG4gICAgY29uc3QgYmFzZU5hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdzJylcbiAgICBjb25zdCBiYXNlRXZlbnRzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0V2ZW50cycpXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrc05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKVxuICAgIGNvbnN0IGJhc2UgPSB0aGlzW2Jhc2VOYW1lXVxuICAgIGNvbnN0IGJhc2VFdmVudHMgPSB0aGlzW2Jhc2VFdmVudHNOYW1lXVxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3MgPSB0aGlzW2Jhc2VDYWxsYmFja3NOYW1lXVxuICAgIGlmKFxuICAgICAgYmFzZSAmJlxuICAgICAgYmFzZUV2ZW50cyAmJlxuICAgICAgYmFzZUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgT2JqZWN0LmVudHJpZXMoYmFzZUV2ZW50cylcbiAgICAgICAgLmZvckVhY2goKFtiYXNlRXZlbnREYXRhLCBiYXNlQ2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IFtiYXNlVGFyZ2V0TmFtZSwgYmFzZUV2ZW50TmFtZV0gPSBiYXNlRXZlbnREYXRhLnNwbGl0KCcgJylcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0ZpcnN0ID0gYmFzZVRhcmdldE5hbWUuc3Vic3RyaW5nKDAsIDEpXG4gICAgICAgICAgY29uc3QgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0ID0gYmFzZVRhcmdldE5hbWUuc3Vic3RyaW5nKGJhc2VUYXJnZXROYW1lLmxlbmd0aCAtIDEpXG4gICAgICAgICAgbGV0IGJhc2VUYXJnZXRzID0gW11cbiAgICAgICAgICBpZihcbiAgICAgICAgICAgIGJhc2VUYXJnZXROYW1lU3Vic3RyaW5nRmlyc3QgPT09ICdbJyAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0ID09PSAnXSdcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzID0gT2JqZWN0LmVudHJpZXMoYmFzZSlcbiAgICAgICAgICAgICAgLnJlZHVjZSgoX2Jhc2VUYXJnZXRzLCBbYmFzZU5hbWUsIGJhc2VUYXJnZXRdKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGJhc2VUYXJnZXROYW1lUmVnRXhwU3RyaW5nID0gYmFzZVRhcmdldE5hbWUuc2xpY2UoMSwgLTEpXG4gICAgICAgICAgICAgICAgbGV0IGJhc2VUYXJnZXROYW1lUmVnRXhwID0gbmV3IFJlZ0V4cChiYXNlVGFyZ2V0TmFtZVJlZ0V4cFN0cmluZylcbiAgICAgICAgICAgICAgICBpZihiYXNlTmFtZS5tYXRjaChiYXNlVGFyZ2V0TmFtZVJlZ0V4cCkpIHtcbiAgICAgICAgICAgICAgICAgIF9iYXNlVGFyZ2V0cy5wdXNoKGJhc2VUYXJnZXQpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBfYmFzZVRhcmdldHNcbiAgICAgICAgICAgICAgfSwgW10pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzLnB1c2goYmFzZVtiYXNlVGFyZ2V0TmFtZV0pXG4gICAgICAgICAgfVxuICAgICAgICAgIGJhc2VDYWxsYmFja3NbYmFzZUNhbGxiYWNrTmFtZV0gPSBiYXNlQ2FsbGJhY2tzW2Jhc2VDYWxsYmFja05hbWVdLmJpbmQodGhpcylcbiAgICAgICAgICBjb25zdCBiYXNlRXZlbnRDYWxsYmFjayA9IGJhc2VDYWxsYmFja3NbYmFzZUNhbGxiYWNrTmFtZV1cbiAgICAgICAgICBpZihcbiAgICAgICAgICAgIGJhc2VUYXJnZXROYW1lICYmXG4gICAgICAgICAgICBiYXNlRXZlbnROYW1lICYmXG4gICAgICAgICAgICBiYXNlVGFyZ2V0cy5sZW5ndGggJiZcbiAgICAgICAgICAgIGJhc2VFdmVudENhbGxiYWNrXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBiYXNlVGFyZ2V0c1xuICAgICAgICAgICAgICAuZm9yRWFjaCgoYmFzZVRhcmdldCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBzd2l0Y2gobWV0aG9kKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ29uJzpcbiAgICAgICAgICAgICAgICAgICAgICBiYXNlVGFyZ2V0W21ldGhvZF0oYmFzZUV2ZW50TmFtZSwgYmFzZUV2ZW50Q2FsbGJhY2spXG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnb2ZmJzpcbiAgICAgICAgICAgICAgICAgICAgICBiYXNlVGFyZ2V0W21ldGhvZF0oYmFzZUV2ZW50TmFtZSwgYmFzZUV2ZW50Q2FsbGJhY2submFtZS5zcGxpdCgnICcpWzFdKVxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge31cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xsZXJcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4J1xuXG5jb25zdCBSb3V0ZXIgPSBjbGFzcyBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy5hZGRTZXR0aW5ncygpXG4gICAgdGhpcy5hZGRXaW5kb3dFdmVudHMoKVxuICB9XG4gIGdldCB2YWxpZFNldHRpbmdzKCkgeyByZXR1cm4gW1xuICAgICdyb290JyxcbiAgICAnaGFzaFJvdXRpbmcnLFxuICAgICdjb250cm9sbGVyJyxcbiAgICAncm91dGVzJ1xuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCBwcm90b2NvbCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCB9XG4gIGdldCBob3N0bmFtZSgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSB9XG4gIGdldCBwb3J0KCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBvcnQgfVxuICBnZXQgcGF0aG5hbWUoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgfVxuICBnZXQgcGF0aCgpIHtcbiAgICBsZXQgc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lXG4gICAgICAucmVwbGFjZShuZXcgUmVnRXhwKFsnXicsIHRoaXMucm9vdF0uam9pbignJykpLCAnJylcbiAgICAgIC5zcGxpdCgnPycpXG4gICAgICAuc2xpY2UoMCwgMSlcbiAgICAgIFswXVxuICAgIGxldCBmcmFnbWVudHMgPSAoXG4gICAgICBzdHJpbmcubGVuZ3RoID09PSAwXG4gICAgKSA/IFtdXG4gICAgICA6IChcbiAgICAgICAgICBzdHJpbmcubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9eXFwvLykgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL1xcLz8vKVxuICAgICAgICApID8gWycvJ11cbiAgICAgICAgICA6IHN0cmluZ1xuICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAuc3BsaXQoJy8nKVxuICAgIHJldHVybiB7XG4gICAgICBmcmFnbWVudHM6IGZyYWdtZW50cyxcbiAgICAgIHN0cmluZzogc3RyaW5nLFxuICAgIH1cbiAgfVxuICBnZXQgaGFzaCgpIHtcbiAgICBsZXQgc3RyaW5nID0gd2luZG93LmxvY2F0aW9uLmhhc2hcbiAgICAgIC5zbGljZSgxKVxuICAgICAgLnNwbGl0KCc/JylcbiAgICAgIC5zbGljZSgwLCAxKVxuICAgICAgWzBdXG4gICAgbGV0IGZyYWdtZW50cyA9IChcbiAgICAgIHN0cmluZy5sZW5ndGggPT09IDBcbiAgICApID8gW11cbiAgICAgIDogKFxuICAgICAgICAgIHN0cmluZy5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL15cXC8vKSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXFwvPy8pXG4gICAgICAgICkgPyBbJy8nXVxuICAgICAgICAgIDogc3RyaW5nXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC8kLywgJycpXG4gICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgcmV0dXJuIHtcbiAgICAgIGZyYWdtZW50czogZnJhZ21lbnRzLFxuICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgfVxuICB9XG4gIGdldCBwYXJhbWV0ZXJzKCkge1xuICAgIGxldCBzdHJpbmdcbiAgICBsZXQgZGF0YVxuICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKC9cXD8vKSkge1xuICAgICAgbGV0IHBhcmFtZXRlcnMgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgICAgICAuc3BsaXQoJz8nKVxuICAgICAgICAuc2xpY2UoLTEpXG4gICAgICAgIC5qb2luKCcnKVxuICAgICAgc3RyaW5nID0gcGFyYW1ldGVyc1xuICAgICAgZGF0YSA9IHBhcmFtZXRlcnNcbiAgICAgICAgLnNwbGl0KCcmJylcbiAgICAgICAgLnJlZHVjZSgoXG4gICAgICAgICAgX3BhcmFtZXRlcnMsXG4gICAgICAgICAgcGFyYW1ldGVyXG4gICAgICAgICkgPT4ge1xuICAgICAgICAgIGxldCBwYXJhbWV0ZXJEYXRhID0gcGFyYW1ldGVyLnNwbGl0KCc9JylcbiAgICAgICAgICBfcGFyYW1ldGVyc1twYXJhbWV0ZXJEYXRhWzBdXSA9IHBhcmFtZXRlckRhdGFbMV1cbiAgICAgICAgICByZXR1cm4gX3BhcmFtZXRlcnNcbiAgICAgICAgfSwge30pXG4gICAgfSBlbHNlIHtcbiAgICAgIHN0cmluZyA9ICcnXG4gICAgICBkYXRhID0ge31cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHN0cmluZzogc3RyaW5nLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH1cbiAgfVxuICBnZXQgX3Jvb3QoKSB7IHJldHVybiB0aGlzLnJvb3QgfHwgJy8nIH1cbiAgc2V0IF9yb290KHJvb3QpIHsgdGhpcy5yb290ID0gcm9vdCB9XG4gIGdldCBfaGFzaFJvdXRpbmcoKSB7IHJldHVybiB0aGlzLmhhc2hSb3V0aW5nIHx8IGZhbHNlIH1cbiAgc2V0IF9oYXNoUm91dGluZyhoYXNoUm91dGluZykgeyB0aGlzLmhhc2hSb3V0aW5nID0gaGFzaFJvdXRpbmcgfVxuICBnZXQgX3JvdXRlcygpIHsgcmV0dXJuIHRoaXMucm91dGVzIH1cbiAgc2V0IF9yb3V0ZXMocm91dGVzKSB7IHRoaXMucm91dGVzID0gcm91dGVzIH1cbiAgZ2V0IF9jb250cm9sbGVyKCkgeyByZXR1cm4gdGhpcy5jb250cm9sbGVyIH1cbiAgc2V0IF9jb250cm9sbGVyKGNvbnRyb2xsZXIpIHsgdGhpcy5jb250cm9sbGVyID0gY29udHJvbGxlciB9XG4gIGdldCBsb2NhdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcm9vdDogdGhpcy5yb290LFxuICAgICAgcGF0aDogdGhpcy5wYXRoLFxuICAgICAgaGFzaDogdGhpcy5oYXNoLFxuICAgICAgcGFyYW1ldGVyczogdGhpcy5wYXJhbWV0ZXJzLFxuICAgIH1cbiAgfVxuICBtYXRjaFJvdXRlKHJvdXRlRnJhZ21lbnRzLCBsb2NhdGlvbkZyYWdtZW50cykge1xuICAgIGxldCByb3V0ZU1hdGNoZXMgPSBuZXcgQXJyYXkoKVxuICAgIGlmKHJvdXRlRnJhZ21lbnRzLmxlbmd0aCA9PT0gbG9jYXRpb25GcmFnbWVudHMubGVuZ3RoKSB7XG4gICAgICByb3V0ZU1hdGNoZXMgPSByb3V0ZUZyYWdtZW50c1xuICAgICAgICAucmVkdWNlKChfcm91dGVNYXRjaGVzLCByb3V0ZUZyYWdtZW50LCByb3V0ZUZyYWdtZW50SW5kZXgpID0+IHtcbiAgICAgICAgICBsZXQgbG9jYXRpb25GcmFnbWVudCA9IGxvY2F0aW9uRnJhZ21lbnRzW3JvdXRlRnJhZ21lbnRJbmRleF1cbiAgICAgICAgICBpZihyb3V0ZUZyYWdtZW50Lm1hdGNoKC9eXFw6LykpIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaCh0cnVlKVxuICAgICAgICAgIH0gZWxzZSBpZihyb3V0ZUZyYWdtZW50ID09PSBsb2NhdGlvbkZyYWdtZW50KSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2godHJ1ZSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3JvdXRlTWF0Y2hlcy5wdXNoKGZhbHNlKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gX3JvdXRlTWF0Y2hlc1xuICAgICAgICB9LCBbXSlcbiAgICB9IGVsc2Uge1xuICAgICAgcm91dGVNYXRjaGVzLnB1c2goZmFsc2UpXG4gICAgfVxuICAgIHJldHVybiAocm91dGVNYXRjaGVzLmluZGV4T2YoZmFsc2UpID09PSAtMSlcbiAgICAgID8gdHJ1ZVxuICAgICAgOiBmYWxzZVxuICB9XG4gIGdldFJvdXRlKGxvY2F0aW9uKSB7XG4gICAgbGV0IHJvdXRlcyA9IE9iamVjdC5lbnRyaWVzKHRoaXMucm91dGVzKVxuICAgICAgLnJlZHVjZSgoXG4gICAgICAgIF9yb3V0ZXMsXG4gICAgICAgIFtyb3V0ZU5hbWUsIHJvdXRlU2V0dGluZ3NdKSA9PiB7XG4gICAgICAgICAgbGV0IHJvdXRlRnJhZ21lbnRzID0gKFxuICAgICAgICAgICAgcm91dGVOYW1lLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgICAgcm91dGVOYW1lLm1hdGNoKC9eXFwvLylcbiAgICAgICAgICApID8gW3JvdXRlTmFtZV1cbiAgICAgICAgICAgIDogKHJvdXRlTmFtZS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgID8gWycnXVxuICAgICAgICAgICAgICA6IHJvdXRlTmFtZVxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC8kLywgJycpXG4gICAgICAgICAgICAgICAgICAuc3BsaXQoJy8nKVxuICAgICAgICAgIHJvdXRlU2V0dGluZ3MuZnJhZ21lbnRzID0gcm91dGVGcmFnbWVudHNcbiAgICAgICAgICBfcm91dGVzW3JvdXRlRnJhZ21lbnRzLmpvaW4oJy8nKV0gPSByb3V0ZVNldHRpbmdzXG4gICAgICAgICAgcmV0dXJuIF9yb3V0ZXNcbiAgICAgICAgfSxcbiAgICAgICAge31cbiAgICAgIClcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhyb3V0ZXMpXG4gICAgICAuZmluZCgocm91dGUpID0+IHtcbiAgICAgICAgbGV0IHJvdXRlRnJhZ21lbnRzID0gcm91dGUuZnJhZ21lbnRzXG4gICAgICAgIGxldCBsb2NhdGlvbkZyYWdtZW50cyA9ICh0aGlzLmhhc2hSb3V0aW5nKVxuICAgICAgICAgID8gbG9jYXRpb24uaGFzaC5mcmFnbWVudHNcbiAgICAgICAgICA6IGxvY2F0aW9uLnBhdGguZnJhZ21lbnRzXG4gICAgICAgIGxldCBtYXRjaFJvdXRlID0gdGhpcy5tYXRjaFJvdXRlKFxuICAgICAgICAgIHJvdXRlRnJhZ21lbnRzLFxuICAgICAgICAgIGxvY2F0aW9uRnJhZ21lbnRzLFxuICAgICAgICApXG4gICAgICAgIHJldHVybiBtYXRjaFJvdXRlID09PSB0cnVlXG4gICAgICB9KVxuICB9XG4gIHBvcFN0YXRlKGV2ZW50KSB7XG4gICAgbGV0IGxvY2F0aW9uID0gdGhpcy5sb2NhdGlvblxuICAgIGxldCByb3V0ZSA9IHRoaXMuZ2V0Um91dGUobG9jYXRpb24pXG4gICAgbGV0IHJvdXRlRGF0YSA9IHtcbiAgICAgIHJvdXRlOiByb3V0ZSxcbiAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbixcbiAgICB9XG4gICAgaWYocm91dGUpIHtcbiAgICAgIHRoaXMuY29udHJvbGxlcltyb3V0ZS5jYWxsYmFja10ocm91dGVEYXRhKVxuICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnLCB7XG4gICAgICAgIG5hbWU6ICdjaGFuZ2UnLFxuICAgICAgICBkYXRhOiByb3V0ZURhdGEsXG4gICAgICB9LFxuICAgICAgdGhpcylcbiAgICB9XG4gIH1cbiAgYWRkV2luZG93RXZlbnRzKCkge1xuICAgIHdpbmRvdy5vbigncG9wc3RhdGUnLCB0aGlzLnBvcFN0YXRlLmJpbmQodGhpcykpXG4gIH1cbiAgcmVtb3ZlV2luZG93RXZlbnRzKCkge1xuICAgIHdpbmRvdy5vZmYoJ3BvcHN0YXRlJywgdGhpcy5wb3BTdGF0ZS5iaW5kKHRoaXMpKVxuICB9XG4gIG5hdmlnYXRlKHBhdGgpIHtcbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGhcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgUm91dGVyXG4iLCJpbXBvcnQgJy4vU2hpbXMvZXZlbnRzJ1xuaW1wb3J0IEV2ZW50cyBmcm9tICcuL0V2ZW50cy9pbmRleCdcbmltcG9ydCBDaGFubmVscyBmcm9tICcuL0NoYW5uZWxzL2luZGV4J1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi9VdGlscy9pbmRleCdcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4vU2VydmljZS9pbmRleCdcbmltcG9ydCBNb2RlbCBmcm9tICcuL01vZGVsL2luZGV4J1xuaW1wb3J0IENvbGxlY3Rpb24gZnJvbSAnLi9Db2xsZWN0aW9uL2luZGV4J1xuaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3L2luZGV4J1xuaW1wb3J0IENvbnRyb2xsZXIgZnJvbSAnLi9Db250cm9sbGVyL2luZGV4J1xuaW1wb3J0IFJvdXRlciBmcm9tICcuL1JvdXRlci9pbmRleCdcbmNvbnN0IE1WQyA9IHtcbiAgRXZlbnRzLFxuICBDaGFubmVscyxcbiAgVXRpbHMsXG4gIFNlcnZpY2UsXG4gIE1vZGVsLFxuICBDb2xsZWN0aW9uLFxuICBWaWV3LFxuICBDb250cm9sbGVyLFxuICBSb3V0ZXIsXG59XG5leHBvcnQgZGVmYXVsdCBNVkNcbiJdLCJuYW1lcyI6WyJFdmVudFRhcmdldCIsInByb3RvdHlwZSIsIm9uIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9mZiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJFdmVudHMiLCJjb25zdHJ1Y3RvciIsIl9ldmVudHMiLCJldmVudHMiLCJnZXRFdmVudENhbGxiYWNrcyIsImV2ZW50TmFtZSIsImdldEV2ZW50Q2FsbGJhY2tOYW1lIiwiZXZlbnRDYWxsYmFjayIsIm5hbWUiLCJsZW5ndGgiLCJnZXRFdmVudENhbGxiYWNrR3JvdXAiLCJldmVudENhbGxiYWNrcyIsImV2ZW50Q2FsbGJhY2tOYW1lIiwiZXZlbnRDYWxsYmFja0dyb3VwIiwicHVzaCIsImFyZ3VtZW50cyIsIk9iamVjdCIsImtleXMiLCJlbWl0IiwiX2FyZ3VtZW50cyIsIkFycmF5IiwiZnJvbSIsInNwbGljZSIsImV2ZW50RGF0YSIsImV2ZW50QXJndW1lbnRzIiwiZW50cmllcyIsImZvckVhY2giLCJldmVudENhbGxiYWNrR3JvdXBOYW1lIiwiZGF0YSIsIl9yZXNwb25zZXMiLCJyZXNwb25zZXMiLCJyZXNwb25zZSIsInJlc3BvbnNlTmFtZSIsInJlc3BvbnNlQ2FsbGJhY2siLCJyZXF1ZXN0Iiwic2xpY2UiLCJjYWxsIiwiX3Jlc3BvbnNlTmFtZSIsIl9jaGFubmVscyIsImNoYW5uZWxzIiwiY2hhbm5lbCIsImNoYW5uZWxOYW1lIiwiQ2hhbm5lbCIsIlVVSUQiLCJ1dWlkIiwiaSIsInJhbmRvbSIsIk1hdGgiLCJ0b1N0cmluZyIsIlNlcnZpY2UiLCJzZXR0aW5ncyIsIm9wdGlvbnMiLCJ2YWxpZFNldHRpbmdzIiwiX3NldHRpbmdzIiwidmFsaWRTZXR0aW5nIiwiX29wdGlvbnMiLCJ1cmwiLCJfdXJsIiwibWV0aG9kIiwiX21ldGhvZCIsIm1vZGUiLCJfbW9kZSIsImNhY2hlIiwiX2NhY2hlIiwiY3JlZGVudGlhbHMiLCJfY3JlZGVudGlhbHMiLCJoZWFkZXJzIiwiX2hlYWRlcnMiLCJyZWRpcmVjdCIsIl9yZWRpcmVjdCIsInJlZmVycmVyUG9saWN5IiwiX3JlZmVycmVyUG9saWN5IiwiYm9keSIsIl9ib2R5IiwicHJldmlvdXNBYm9ydENvbnRyb2xsZXIiLCJfcHJldmlvdXNBYm9ydENvbnRyb2xsZXIiLCJhYm9ydENvbnRyb2xsZXIiLCJfYWJvcnRDb250cm9sbGVyIiwiQWJvcnRDb250cm9sbGVyIiwiYWJvcnQiLCJmZXRjaCIsImZldGNoT3B0aW9ucyIsInJlZHVjZSIsIl9mZXRjaE9wdGlvbnMiLCJmZXRjaE9wdGlvbk5hbWUiLCJmZXRjaE9wdGlvblZhbHVlIiwic2lnbmFsIiwidGhlbiIsImpzb24iLCJjYXRjaCIsIk1vZGVsIiwiYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlcyIsImJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSIsInRvZ2dsZUV2ZW50cyIsInNlcnZpY2VzIiwiX3NlcnZpY2VzIiwiX2RhdGEiLCJkZWZhdWx0cyIsIl9kZWZhdWx0cyIsInNldCIsImxvY2FsU3RvcmFnZSIsIl9sb2NhbFN0b3JhZ2UiLCJkYiIsIl9kYiIsImdldEl0ZW0iLCJlbmRwb2ludCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzdG9yYWdlQ29udGFpbmVyIiwicGFyc2UiLCJzZXRJdGVtIiwicmVzZXRFdmVudHMiLCJjbGFzc1R5cGUiLCJiYXNlTmFtZSIsImNvbmNhdCIsImJhc2VFdmVudHNOYW1lIiwiYmFzZUNhbGxiYWNrc05hbWUiLCJiYXNlIiwiYmFzZUV2ZW50cyIsImJhc2VDYWxsYmFja3MiLCJiYXNlRXZlbnREYXRhIiwiYmFzZUNhbGxiYWNrTmFtZSIsImJhc2VUYXJnZXROYW1lIiwiYmFzZUV2ZW50TmFtZSIsInNwbGl0IiwiYmFzZVRhcmdldCIsImJhc2VDYWxsYmFjayIsImJzZUNhbGxiYWNrcyIsImJhc2VFdmVudENhbGxiYWNrIiwiY2xhc3NUeXBlVGFyZ2V0IiwiY2xhc3NUeXBlRXZlbnROYW1lIiwiY2xhc3NUeXBlRXZlbnRDYWxsYmFjayIsImVycm9yIiwic2V0REIiLCJrZXkiLCJ2YWx1ZSIsInVuc2V0REIiLCJzZXREYXRhUHJvcGVydHkiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJlbnVtZXJhYmxlIiwiZ2V0IiwidW5zZXREYXRhUHJvcGVydHkiLCJpc0FycmF5IiwidW5zZXQiLCJDb2xsZWN0aW9uIiwiZGVmYXVsdElEQXR0cmlidXRlIiwiYWRkIiwibW9kZWxzIiwiX21vZGVscyIsIm1vZGVsc0RhdGEiLCJtb2RlbCIsIl9tb2RlbCIsIm1hcCIsImdldE1vZGVsSW5kZXgiLCJtb2RlbFVVSUQiLCJtb2RlbEluZGV4IiwiZmluZCIsIl9tb2RlbEluZGV4IiwiX3V1aWQiLCJyZW1vdmVNb2RlbEJ5SW5kZXgiLCJhZGRNb2RlbCIsIm1vZGVsRGF0YSIsInNvbWVNb2RlbCIsImV2ZW50IiwicmVtb3ZlIiwiZmlsdGVyIiwicmVzZXQiLCJWaWV3IiwiZWxlbWVudE5hbWUiLCJfZWxlbWVudE5hbWUiLCJlbGVtZW50IiwiX2VsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJzZXRBdHRyaWJ1dGUiLCJlbGVtZW50T2JzZXJ2ZXIiLCJvYnNlcnZlIiwic3VidHJlZSIsImNoaWxkTGlzdCIsIl9lbGVtZW50T2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZWxlbWVudE9ic2VydmUiLCJiaW5kIiwiSFRNTEVsZW1lbnQiLCJfYXR0cmlidXRlcyIsInRlbXBsYXRlIiwiX3RlbXBsYXRlIiwidWlFbGVtZW50cyIsIl91aUVsZW1lbnRzIiwidWlFbGVtZW50RXZlbnRzIiwiX3VpRWxlbWVudEV2ZW50cyIsInVpRWxlbWVudENhbGxiYWNrcyIsIl91aUVsZW1lbnRDYWxsYmFja3MiLCJ1aSIsImNvbnRleHQiLCJfdWkiLCJ1aUVsZW1lbnROYW1lIiwidWlFbGVtZW50UXVlcnkiLCJxdWVyeVJlc3VsdHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaXRlbSIsIkRvY3VtZW50IiwiV2luZG93IiwibXV0YXRpb25SZWNvcmRMaXN0Iiwib2JzZXJ2ZXIiLCJtdXRhdGlvblJlY29yZEluZGV4IiwibXV0YXRpb25SZWNvcmQiLCJ0eXBlIiwiYWRkZWROb2RlcyIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJ1aUtleSIsInVpVmFsdWUiLCJ1aVZhbHVlR2V0IiwiYWRkZWRVSUVsZW1lbnQiLCJhZGRlZE5vZGUiLCJiaW5kRXZlbnRUb0VsZW1lbnQiLCJ0YXJnZXRVSUVsZW1lbnROYW1lIiwiaXNUb2dnbGluZyIsImV2ZW50QmluZE1ldGhvZHMiLCJldmVudEJpbmRNZXRob2QiLCJ1aUVsZW1lbnRFdmVudFNldHRpbmdzIiwidWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUiLCJ1aUVsZW1lbnRFdmVudE5hbWUiLCJOb2RlTGlzdCIsInVpRWxlbWVudCIsImF1dG9JbnNlcnQiLCJpbnNlcnQiLCJwYXJlbnQiLCJpbnNlcnRBZGphY2VudEVsZW1lbnQiLCJhdXRvUmVtb3ZlIiwicmVtb3ZlQ2hpbGQiLCJyZW5kZXIiLCJpbm5lckhUTUwiLCJDb250cm9sbGVyIiwiZW51bWJlcmFibGUiLCJiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0ZpcnN0Iiwic3Vic3RyaW5nIiwiYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0IiwiYmFzZVRhcmdldHMiLCJfYmFzZVRhcmdldHMiLCJiYXNlVGFyZ2V0TmFtZVJlZ0V4cFN0cmluZyIsImJhc2VUYXJnZXROYW1lUmVnRXhwIiwiUmVnRXhwIiwibWF0Y2giLCJSb3V0ZXIiLCJhZGRTZXR0aW5ncyIsImFkZFdpbmRvd0V2ZW50cyIsInByb3RvY29sIiwid2luZG93IiwibG9jYXRpb24iLCJob3N0bmFtZSIsInBvcnQiLCJwYXRobmFtZSIsInBhdGgiLCJzdHJpbmciLCJyZXBsYWNlIiwicm9vdCIsImpvaW4iLCJmcmFnbWVudHMiLCJoYXNoIiwicGFyYW1ldGVycyIsImhyZWYiLCJfcGFyYW1ldGVycyIsInBhcmFtZXRlciIsInBhcmFtZXRlckRhdGEiLCJfcm9vdCIsIl9oYXNoUm91dGluZyIsImhhc2hSb3V0aW5nIiwiX3JvdXRlcyIsInJvdXRlcyIsIl9jb250cm9sbGVyIiwiY29udHJvbGxlciIsIm1hdGNoUm91dGUiLCJyb3V0ZUZyYWdtZW50cyIsImxvY2F0aW9uRnJhZ21lbnRzIiwicm91dGVNYXRjaGVzIiwiX3JvdXRlTWF0Y2hlcyIsInJvdXRlRnJhZ21lbnQiLCJyb3V0ZUZyYWdtZW50SW5kZXgiLCJsb2NhdGlvbkZyYWdtZW50IiwiaW5kZXhPZiIsImdldFJvdXRlIiwicm91dGVOYW1lIiwicm91dGVTZXR0aW5ncyIsInZhbHVlcyIsInJvdXRlIiwicG9wU3RhdGUiLCJyb3V0ZURhdGEiLCJjYWxsYmFjayIsInJlbW92ZVdpbmRvd0V2ZW50cyIsIm5hdmlnYXRlIiwiTVZDIiwiQ2hhbm5lbHMiLCJVdGlscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0VBQUFBLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIsR0FBMkJGLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIsSUFBNEJGLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkUsZ0JBQTdFO0VBQ0FILFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkcsR0FBdEIsR0FBNEJKLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkcsR0FBdEIsSUFBNkJKLFdB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
