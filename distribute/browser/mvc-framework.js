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
      super(...arguments);
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

    fetch() {
      var fetchOptions = this.validSettings.reduce((_fetchOptions, _ref) => {
        var [fetchOptionName, fetchOptionValue] = _ref;
        if (this[fetchOptionName]) _fetchOptions[fetchOptionName] = fetchOptionValue;
        return _fetchOptions;
      }, {});
      fetch(this.url, fetchOptions).then(response => {
        return response.json();
      }).then(data => {
        this.emit('ready', {
          data: data
        });
      });
      return this;
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
      return ['idAttribute', 'model', 'defaults', 'services', 'serviceEvents', 'serviceCallbacks'];
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
        this.emit('change', this.parse(), this);
      });
      this.models.push(model);
      this.emit('add', model.parse(), model, this);
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
      this.emit('change', this.parse(), this);
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
      this.emit('change', this.parse(), this);
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
      return ['model', 'view', 'controller', 'router'];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL3V1aWQuanMiLCIuLi8uLi9zb3VyY2UvTVZDL1NlcnZpY2UvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL01vZGVsL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Db2xsZWN0aW9uL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9WaWV3L2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Db250cm9sbGVyL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Sb3V0ZXIvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIkV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiA9IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lclxyXG5FdmVudFRhcmdldC5wcm90b3R5cGUub2ZmID0gRXZlbnRUYXJnZXQucHJvdG90eXBlLm9mZiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lclxyXG4iLCJjbGFzcyBFdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2V2ZW50cygpIHtcclxuICAgIHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMgfHwge31cclxuICAgIHJldHVybiB0aGlzLmV2ZW50c1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpIHsgcmV0dXJuIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdIHx8IHt9IH1cclxuICBnZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gKGV2ZW50Q2FsbGJhY2submFtZS5sZW5ndGgpXHJcbiAgICAgID8gZXZlbnRDYWxsYmFjay5uYW1lXHJcbiAgICAgIDogJ2Fub255bW91c0Z1bmN0aW9uJ1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKSB7XHJcbiAgICByZXR1cm4gZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdIHx8IFtdXHJcbiAgfVxyXG4gIG9uKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaykge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5nZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja05hbWUgPSB0aGlzLmdldEV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja0dyb3VwID0gdGhpcy5nZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKVxyXG4gICAgZXZlbnRDYWxsYmFja0dyb3VwLnB1c2goZXZlbnRDYWxsYmFjaylcclxuICAgIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudENhbGxiYWNrc1xyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgb2ZmKCkge1xyXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgICAgY2FzZSAwOlxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrTmFtZSA9ICh0eXBlb2YgZXZlbnRDYWxsYmFjayA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICA/IGV2ZW50Q2FsbGJhY2tcclxuICAgICAgICAgIDogdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKSB7XHJcbiAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1bZXZlbnRDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0pLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgKSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGVtaXQoKSB7XHJcbiAgICBsZXQgX2FyZ3VtZW50cyA9IEFycmF5LmZyb20oYXJndW1lbnRzKVxyXG4gICAgbGV0IGV2ZW50TmFtZSA9IF9hcmd1bWVudHMuc3BsaWNlKDAsIDEpWzBdXHJcbiAgICBsZXQgZXZlbnREYXRhID0gX2FyZ3VtZW50cy5zcGxpY2UoMCwgMSlbMF1cclxuICAgIGxldCBldmVudEFyZ3VtZW50cyA9IF9hcmd1bWVudHMuc3BsaWNlKDApXHJcbiAgICBPYmplY3QuZW50cmllcyh0aGlzLmdldEV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSkpXHJcbiAgICAgIC5mb3JFYWNoKChbZXZlbnRDYWxsYmFja0dyb3VwTmFtZSwgZXZlbnRDYWxsYmFja0dyb3VwXSkgPT4ge1xyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgICAgICAgLmZvckVhY2goKGV2ZW50Q2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgZXZlbnRDYWxsYmFjayhcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBldmVudE5hbWUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBldmVudERhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIC4uLmV2ZW50QXJndW1lbnRzXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBFdmVudHNcclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX3Jlc3BvbnNlcygpIHtcclxuICAgIHRoaXMucmVzcG9uc2VzID0gdGhpcy5yZXNwb25zZXNcclxuICAgICAgPyB0aGlzLnJlc3BvbnNlc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZiAocmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgICB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSA9IHJlc3BvbnNlQ2FsbGJhY2tcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VdXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlcXVlc3QocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZiAodGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0pIHtcclxuICAgICAgdmFyIF9hcmd1bWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLnNsaWNlKDEpXHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSguLi5fYXJndW1lbnRzKVxyXG4gICAgfVxyXG4gIH1cclxuICBvZmYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZiAocmVzcG9uc2VOYW1lKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yICh2YXIgW19yZXNwb25zZU5hbWVdIG9mIE9iamVjdC5rZXlzKHRoaXMuX3Jlc3BvbnNlcykpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW19yZXNwb25zZU5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IENoYW5uZWwgZnJvbSAnLi9DaGFubmVsL2luZGV4J1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfY2hhbm5lbHMoKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzID0gdGhpcy5jaGFubmVsc1xyXG4gICAgICA/IHRoaXMuY2hhbm5lbHNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbHNcclxuICB9XHJcbiAgY2hhbm5lbChjaGFubmVsTmFtZSkge1xyXG4gICAgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdID0gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgID8gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgIDogbmV3IENoYW5uZWwoKVxyXG4gICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxuICBvZmYoY2hhbm5lbE5hbWUpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVVVJRCgpIHtcclxuICB2YXIgdXVpZCA9IFwiXCIsIGksIHJhbmRvbVxyXG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSB7XHJcbiAgICByYW5kb20gPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwXHJcblxyXG4gICAgaWYgKGkgPT0gOCB8fCBpID09IDEyIHx8IGkgPT0gMTYgfHwgaSA9PSAyMCkge1xyXG4gICAgICB1dWlkICs9IFwiLVwiXHJcbiAgICB9XHJcbiAgICB1dWlkICs9IChpID09IDEyID8gNCA6IChpID09IDE2ID8gKHJhbmRvbSAmIDMgfCA4KSA6IHJhbmRvbSkpLnRvU3RyaW5nKDE2KVxyXG4gIH1cclxuICByZXR1cm4gdXVpZFxyXG59XHJcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4J1xuXG5jbGFzcyBTZXJ2aWNlIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCB2YWxpZFNldHRpbmdzKCkgeyByZXR1cm4gW1xuICAgICd1cmwnLFxuICAgICdtZXRob2QnLFxuICAgICdtb2RlJyxcbiAgICAnY2FjaGUnLFxuICAgICdjcmVkZW50aWFscycsXG4gICAgJ2hlYWRlcnMnLFxuICAgICdyZWRpcmVjdCcsXG4gICAgJ3JlZmVycmVyLXBvbGljeScsXG4gICAgJ2JvZHknLFxuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCB1cmwoKSB7IHJldHVybiB0aGlzLl91cmwgfVxuICBzZXQgdXJsKHVybCkgeyB0aGlzLl91cmwgPSB1cmwgfVxuICBnZXQgbWV0aG9kKCkgeyByZXR1cm4gdGhpcy5fbWV0aG9kIH1cbiAgc2V0IG1vZGUobW9kZSkgeyB0aGlzLl9tb2RlID0gbW9kZSB9XG4gIGdldCBtb2RlKCkgeyByZXR1cm4gdGhpcy5fbW9kZSB9XG4gIHNldCBjYWNoZShjYWNoZSkgeyB0aGlzLl9jYWNoZSA9IGNhY2hlIH1cbiAgZ2V0IGNhY2hlKCkgeyByZXR1cm4gdGhpcy5fY2FjaGUgfVxuICBzZXQgY3JlZGVudGlhbHMoY3JlZGVudGlhbHMpIHsgdGhpcy5fY3JlZGVudGlhbHMgPSBjcmVkZW50aWFscyB9XG4gIGdldCBjcmVkZW50aWFscygpIHsgcmV0dXJuIHRoaXMuX2NyZWRlbnRpYWxzIH1cbiAgc2V0IGhlYWRlcnMoaGVhZGVycykgeyB0aGlzLl9oZWFkZXJzID0gaGVhZGVycyB9XG4gIGdldCBoZWFkZXJzKCkgeyByZXR1cm4gdGhpcy5faGVhZGVycyB9XG4gIHNldCByZWRpcmVjdChyZWRpcmVjdCkgeyB0aGlzLl9yZWRpcmVjdCA9IHJlZGlyZWN0IH1cbiAgZ2V0IHJlZGlyZWN0KCkgeyByZXR1cm4gdGhpcy5fcmVkaXJlY3QgfVxuICBzZXQgcmVmZXJyZXJQb2xpY3kocmVmZXJyZXJQb2xpY3kpIHsgdGhpcy5fcmVmZXJyZXJQb2xpY3kgPSByZWZlcnJlclBvbGljeSB9XG4gIGdldCByZWZlcnJlclBvbGljeSgpIHsgcmV0dXJuIHRoaXMuX3JlZmVycmVyUG9saWN5IH1cbiAgc2V0IGJvZHkoYm9keSkgeyB0aGlzLl9ib2R5ID0gYm9keSB9XG4gIGdldCBib2R5KCkgeyByZXR1cm4gdGhpcy5fYm9keSB9XG4gIGZldGNoKCkge1xuICAgIGNvbnN0IGZldGNoT3B0aW9ucyA9IHRoaXMudmFsaWRTZXR0aW5ncy5yZWR1Y2UoKF9mZXRjaE9wdGlvbnMsIFtmZXRjaE9wdGlvbk5hbWUsIGZldGNoT3B0aW9uVmFsdWVdKSA9PiB7XG4gICAgICBpZih0aGlzW2ZldGNoT3B0aW9uTmFtZV0pIF9mZXRjaE9wdGlvbnNbZmV0Y2hPcHRpb25OYW1lXSA9IGZldGNoT3B0aW9uVmFsdWVcbiAgICAgIHJldHVybiBfZmV0Y2hPcHRpb25zXG4gICAgfSwge30pXG4gICAgZmV0Y2godGhpcy51cmwsIGZldGNoT3B0aW9ucylcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpXG4gICAgICB9KVxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCdyZWFkeScsIHtcbiAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFNlcnZpY2VcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xuXG5jb25zdCBNb2RlbCA9IGNsYXNzIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAnbG9jYWxTdG9yYWdlJyxcbiAgICAnZGVmYXVsdHMnLFxuICAgICdzZXJ2aWNlcycsXG4gICAgJ3NlcnZpY2VFdmVudHMnLFxuICAgICdzZXJ2aWNlQ2FsbGJhY2tzJyxcbiAgXSB9XG4gIGdldCBiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzKCkgeyByZXR1cm4gW1xuICAgICdzZXJ2aWNlJyxcbiAgXSB9XG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICB9KVxuICAgIHRoaXMuYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlc1xuICAgICAgLmZvckVhY2goKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUsICdvbicpXG4gICAgICB9KVxuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgc2VydmljZXMoKSB7XG4gICAgaWYoIXRoaXMuX3NlcnZpY2VzKSB0aGlzLl9zZXJ2aWNlcyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX3NlcnZpY2VzXG4gIH1cbiAgc2V0IHNlcnZpY2VzKHNlcnZpY2VzKSB7IHRoaXMuX3NlcnZpY2VzID0gc2VydmljZXMgfVxuICBnZXQgZGF0YSgpIHtcbiAgICBpZighdGhpcy5fZGF0YSkgdGhpcy5fZGF0YSA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFcbiAgfVxuICBnZXQgZGVmYXVsdHMoKSB7XG4gICAgaWYoIXRoaXMuX2RlZmF1bHRzKSB0aGlzLl9kZWZhdWx0cyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRzXG4gIH1cbiAgc2V0IGRlZmF1bHRzKGRlZmF1bHRzKSB7XG4gICAgdGhpcy5fZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgIHRoaXMuc2V0KHRoaXMuZGVmYXVsdHMpXG4gIH1cbiAgZ2V0IGxvY2FsU3RvcmFnZSgpIHsgcmV0dXJuIHRoaXMuX2xvY2FsU3RvcmFnZSB9XG4gIHNldCBsb2NhbFN0b3JhZ2UobG9jYWxTdG9yYWdlKSB7IHRoaXMuX2xvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XG4gIGdldCBkYigpIHsgcmV0dXJuIHRoaXMuX2RiIH1cbiAgZ2V0IF9kYigpIHtcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgfHwgSlNPTi5zdHJpbmdpZnkodGhpcy5zdG9yYWdlQ29udGFpbmVyKVxuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICByZXNldEV2ZW50cyhjbGFzc1R5cGUpIHtcbiAgICBbXG4gICAgICAnb2ZmJyxcbiAgICAgICdvbidcbiAgICBdLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICAgICAgdGhpcy50b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpXG4gICAgfSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZCkge1xuICAgIGNvbnN0IGJhc2VOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgncycpXG4gICAgY29uc3QgYmFzZUV2ZW50c05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdFdmVudHMnKVxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3NOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJylcbiAgICBjb25zdCBiYXNlID0gdGhpc1tiYXNlTmFtZV1cbiAgICBjb25zdCBiYXNlRXZlbnRzID0gdGhpc1tiYXNlRXZlbnRzTmFtZV1cbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzID0gdGhpc1tiYXNlQ2FsbGJhY2tzTmFtZV1cbiAgICBpZihcbiAgICAgIGJhc2UgJiZcbiAgICAgIGJhc2VFdmVudHMgJiZcbiAgICAgIGJhc2VDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKGJhc2VFdmVudHMpXG4gICAgICAgIC5mb3JFYWNoKChbYmFzZUV2ZW50RGF0YSwgYmFzZUNhbGxiYWNrTmFtZV0pID0+IHtcbiAgICAgICAgICBjb25zdCBbYmFzZVRhcmdldE5hbWUsIGJhc2VFdmVudE5hbWVdID0gYmFzZUV2ZW50RGF0YS5zcGxpdCgnICcpXG4gICAgICAgICAgY29uc3QgYmFzZVRhcmdldCA9IGJhc2VbYmFzZVRhcmdldE5hbWVdXG4gICAgICAgICAgY29uc3QgYmFzZUNhbGxiYWNrID0gYnNlQ2FsbGJhY2tzW2Jhc2VDYWxsYmFja05hbWVdXG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldCAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2tcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHt9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHNldERCKCkge1xuICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdmFyIF9hcmd1bWVudHMgPSBPYmplY3QuZW50cmllcyhhcmd1bWVudHNbMF0pXG4gICAgICAgIF9hcmd1bWVudHMuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgZGJba2V5XSA9IHZhbHVlXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgbGV0IHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICBicmVha1xuICAgIH1cbiAgICB0aGlzLl9kYiA9IGRiXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldERCKCkge1xuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9kYlxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGRlbGV0ZSBkYltrZXldXG4gICAgICAgIHRoaXMuX2RiID0gZGJcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSkge1xuICAgIGlmKCF0aGlzLmRhdGFba2V5XSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcy5kYXRhLCB7XG4gICAgICAgIFsnXycuY29uY2F0KGtleSldOiB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBba2V5XToge1xuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNbJ18nLmNvbmNhdChrZXkpXSB9LFxuICAgICAgICAgIHNldCh2YWx1ZSkgeyB0aGlzWydfJy5jb25jYXQoa2V5KV0gPSB2YWx1ZSB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLmRhdGFba2V5XSA9IHZhbHVlXG4gICAgdGhpcy5lbWl0KCdzZXQnLmNvbmNhdCgnOicsIGtleSksIHtcbiAgICAgIGtleToga2V5LFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfSwgdGhpcylcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0RGF0YVByb3BlcnR5KGtleSkge1xuICAgIGlmKHRoaXMuZGF0YVtrZXldKSB7XG4gICAgICBkZWxldGUgdGhpcy5kYXRhW2tleV1cbiAgICB9XG4gICAgdGhpcy5lbWl0KCd1bnNldCcuY29uY2F0KCc6JywgYXJndW1lbnRzWzBdKSwgdGhpcylcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGdldCgpIHtcbiAgICBpZihhcmd1bWVudHNbMF0pIHJldHVybiB0aGlzLmRhdGFbYXJndW1lbnRzWzBdXVxuICAgIHJldHVybiBPYmplY3QuZW50cmllcyh0aGlzLmRhdGEpXG4gICAgICAucmVkdWNlKChfZGF0YSwgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIF9kYXRhW2tleV0gPSB2YWx1ZVxuICAgICAgICByZXR1cm4gX2RhdGFcbiAgICAgIH0sIHt9KVxuICB9XG4gIHNldCgpIHtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSlcbiAgICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlKSB0aGlzLnNldERCKGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKVxuICAgIH0gZWxzZSBpZihcbiAgICAgIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiZcbiAgICAgICFBcnJheS5pc0FycmF5KGFyZ3VtZW50c1swXSkgJiZcbiAgICAgIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnXG4gICAgKSB7XG4gICAgICBPYmplY3QuZW50cmllcyhhcmd1bWVudHNbMF0pLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy5zZXREQihrZXksIHZhbHVlKVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5lbWl0KCdzZXQnLCB0aGlzLmRhdGEsIHRoaXMpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldCgpIHtcbiAgICBpZihhcmd1bWVudHNbMF0pIHtcbiAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoYXJndW1lbnRzWzBdKVxuICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIHRoaXMudW5zZXREQihrZXkpXG4gICAgfSBlbHNlIHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZGF0YSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy51bnNldERCKGtleSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuZW1pdCgndW5zZXQnLCB0aGlzKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgcGFyc2UoZGF0YSA9IHRoaXMuZGF0YSkge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhkYXRhKS5yZWR1Y2UoKF9kYXRhLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgTW9kZWwpIHtcbiAgICAgICAgX2RhdGFba2V5XSA9IHZhbHVlLnBhcnNlKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9kYXRhW2tleV0gPSB2YWx1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIF9kYXRhXG4gICAgfSwge30pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW9kZWxcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xyXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vTW9kZWwvaW5kZXguanMnXHJcblxyXG5jbGFzcyBDb2xsZWN0aW9uIGV4dGVuZHMgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xyXG4gIH1cclxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcclxuICAgICdpZEF0dHJpYnV0ZScsXHJcbiAgICAnbW9kZWwnLFxyXG4gICAgJ2RlZmF1bHRzJyxcclxuICAgICdzZXJ2aWNlcycsXHJcbiAgICAnc2VydmljZUV2ZW50cycsXHJcbiAgICAnc2VydmljZUNhbGxiYWNrcycsXHJcbiAgXSB9XHJcbiAgZ2V0IGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXMoKSB7IHJldHVybiBbXHJcbiAgICAnc2VydmljZSdcclxuICBdIH1cclxuICBnZXQgc2V0dGluZ3MoKSB7IHJldHVybiB0aGlzLl9zZXR0aW5ncyB9XHJcbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XHJcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3MuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XHJcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cclxuICAgIH0pXHJcbiAgICB0aGlzLmJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXNcclxuICAgICAgLmZvckVhY2goKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSkgPT4ge1xyXG4gICAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSwgJ29uJylcclxuICAgICAgfSlcclxuICB9XHJcbiAgZ2V0IG9wdGlvbnMoKSB7XHJcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XHJcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xyXG4gIH1cclxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cclxuICBnZXQgc3RvcmFnZUNvbnRhaW5lcigpIHsgcmV0dXJuIFtdIH1cclxuICBnZXQgZGVmYXVsdElEQXR0cmlidXRlKCkgeyByZXR1cm4gJ19pZCcgfVxyXG4gIGdldCBkZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuX2RlZmF1bHRzIH1cclxuICBzZXQgZGVmYXVsdHMoZGVmYXVsdHMpIHtcclxuICAgIHRoaXMuX2RlZmF1bHRzID0gZGVmYXVsdHNcclxuICAgIHRoaXMuYWRkKGRlZmF1bHRzKVxyXG4gIH1cclxuICBnZXQgbW9kZWxzKCkge1xyXG4gICAgdGhpcy5fbW9kZWxzID0gdGhpcy5fbW9kZWxzIHx8IHRoaXMuc3RvcmFnZUNvbnRhaW5lclxyXG4gICAgcmV0dXJuIHRoaXMuX21vZGVsc1xyXG4gIH1cclxuICBzZXQgbW9kZWxzKG1vZGVsc0RhdGEpIHsgdGhpcy5fbW9kZWxzID0gbW9kZWxzRGF0YSB9XHJcbiAgZ2V0IG1vZGVsKCkgeyByZXR1cm4gdGhpcy5fbW9kZWwgfVxyXG4gIHNldCBtb2RlbChtb2RlbCkgeyB0aGlzLl9tb2RlbCA9IG1vZGVsIH1cclxuICBnZXQgbG9jYWxTdG9yYWdlKCkgeyByZXR1cm4gdGhpcy5fbG9jYWxTdG9yYWdlIH1cclxuICBzZXQgbG9jYWxTdG9yYWdlKGxvY2FsU3RvcmFnZSkgeyB0aGlzLl9sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UgfVxyXG4gIGdldCBkYXRhKCkgeyByZXR1cm4gdGhpcy5fZGF0YSB9XHJcbiAgZ2V0IGRhdGEoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbW9kZWxzXHJcbiAgICAgIC5tYXAoKG1vZGVsKSA9PiBtb2RlbC5wYXJzZSgpKVxyXG4gIH1cclxuICBnZXQgZGIoKSB7IHJldHVybiB0aGlzLl9kYiB9XHJcbiAgZ2V0IGRiKCkge1xyXG4gICAgbGV0IGRiID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHx8IEpTT04uc3RyaW5naWZ5KHRoaXMuc3RvcmFnZUNvbnRhaW5lcilcclxuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxyXG4gIH1cclxuICBzZXQgZGIoZGIpIHtcclxuICAgIGRiID0gSlNPTi5zdHJpbmdpZnkoZGIpXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCwgZGIpXHJcbiAgfVxyXG4gIHJlc2V0RXZlbnRzKGNsYXNzVHlwZSkge1xyXG4gICAgW1xyXG4gICAgICAnb2ZmJyxcclxuICAgICAgJ29uJ1xyXG4gICAgXS5mb3JFYWNoKChtZXRob2QpID0+IHtcclxuICAgICAgdGhpcy50b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgdG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKSB7XHJcbiAgICBjb25zdCBiYXNlTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ3MnKVxyXG4gICAgY29uc3QgYmFzZUV2ZW50c05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdFdmVudHMnKVxyXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrc05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKVxyXG4gICAgY29uc3QgYmFzZSA9IHRoaXNbYmFzZU5hbWVdXHJcbiAgICBjb25zdCBiYXNlRXZlbnRzID0gdGhpc1tiYXNlRXZlbnRzTmFtZV1cclxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3MgPSB0aGlzW2Jhc2VDYWxsYmFja3NOYW1lXVxyXG4gICAgaWYoXHJcbiAgICAgIGJhc2UgJiZcclxuICAgICAgYmFzZUV2ZW50cyAmJlxyXG4gICAgICBiYXNlQ2FsbGJhY2tzXHJcbiAgICApIHtcclxuICAgICAgT2JqZWN0LmVudHJpZXMoYmFzZUV2ZW50cylcclxuICAgICAgICAuZm9yRWFjaCgoW2Jhc2VFdmVudERhdGEsIGJhc2VDYWxsYmFja05hbWVdKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBbYmFzZVRhcmdldE5hbWUsIGJhc2VFdmVudE5hbWVdID0gYmFzZUV2ZW50RGF0YS5zcGxpdCgnICcpXHJcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0ID0gYmFzZVtiYXNlVGFyZ2V0TmFtZV1cclxuICAgICAgICAgIGNvbnN0IGJhc2VDYWxsYmFjayA9IGJzZUNhbGxiYWNrc1tiYXNlQ2FsbGJhY2tOYW1lXVxyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIGJhc2VUYXJnZXROYW1lICYmXHJcbiAgICAgICAgICAgIGJhc2VFdmVudE5hbWUgJiZcclxuICAgICAgICAgICAgYmFzZVRhcmdldCAmJlxyXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFja1xyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgY2xhc3NUeXBlVGFyZ2V0W21ldGhvZF0oY2xhc3NUeXBlRXZlbnROYW1lLCBjbGFzc1R5cGVFdmVudENhbGxiYWNrKVxyXG4gICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7fVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBnZXRNb2RlbEluZGV4KG1vZGVsVVVJRCkge1xyXG4gICAgbGV0IG1vZGVsSW5kZXhcclxuICAgIHRoaXMuX21vZGVsc1xyXG4gICAgICAuZmluZCgoX21vZGVsLCBfbW9kZWxJbmRleCkgPT4ge1xyXG4gICAgICAgIGlmKF9tb2RlbCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIF9tb2RlbCBpbnN0YW5jZW9mIE1vZGVsICYmXHJcbiAgICAgICAgICAgIF9tb2RlbC5fdXVpZCA9PT0gbW9kZWxVVUlEXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgbW9kZWxJbmRleCA9IF9tb2RlbEluZGV4XHJcbiAgICAgICAgICAgIHJldHVybiBfbW9kZWxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gbW9kZWxJbmRleFxyXG4gIH1cclxuICByZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleCkge1xyXG4gICAgbGV0IG1vZGVsID0gdGhpcy5fbW9kZWxzLnNwbGljZShtb2RlbEluZGV4LCAxLCBudWxsKVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAncmVtb3ZlJyxcclxuICAgICAge30sXHJcbiAgICAgIG1vZGVsWzBdLFxyXG4gICAgICB0aGlzXHJcbiAgICApXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBhZGRNb2RlbChtb2RlbERhdGEpIHtcclxuICAgIGxldCBtb2RlbFxyXG4gICAgbGV0IHNvbWVNb2RlbCA9IG5ldyBNb2RlbCgpXHJcbiAgICBpZihtb2RlbERhdGEgaW5zdGFuY2VvZiBNb2RlbCkge1xyXG4gICAgICBtb2RlbCA9IG1vZGVsRGF0YVxyXG4gICAgfSBlbHNlIGlmKFxyXG4gICAgICB0aGlzLm1vZGVsXHJcbiAgICApIHtcclxuICAgICAgbW9kZWwgPSBuZXcgdGhpcy5tb2RlbCgpXHJcbiAgICAgIG1vZGVsLnNldChtb2RlbERhdGEpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtb2RlbCA9IG5ldyBNb2RlbCgpXHJcbiAgICAgIG1vZGVsLnNldChtb2RlbERhdGEpXHJcbiAgICB9XHJcbiAgICBtb2RlbC5vbihcclxuICAgICAgJ3NldCcsXHJcbiAgICAgIChldmVudCwgX21vZGVsKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbWl0KFxyXG4gICAgICAgICAgJ2NoYW5nZScsXHJcbiAgICAgICAgICB0aGlzLnBhcnNlKCksXHJcbiAgICAgICAgICB0aGlzLFxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG4gICAgKVxyXG4gICAgdGhpcy5tb2RlbHMucHVzaChtb2RlbClcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ2FkZCcsXHJcbiAgICAgIG1vZGVsLnBhcnNlKCksXHJcbiAgICAgIG1vZGVsLFxyXG4gICAgICB0aGlzXHJcbiAgICApXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBhZGQobW9kZWxEYXRhKSB7XHJcbiAgICBpZihBcnJheS5pc0FycmF5KG1vZGVsRGF0YSkpIHtcclxuICAgICAgbW9kZWxEYXRhXHJcbiAgICAgICAgLmZvckVhY2goKG1vZGVsKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmFkZE1vZGVsKG1vZGVsKVxyXG4gICAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmFkZE1vZGVsKG1vZGVsRGF0YSlcclxuICAgIH1cclxuICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlKSB0aGlzLmRiID0gdGhpcy5kYXRhXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdjaGFuZ2UnLFxyXG4gICAgICB0aGlzLnBhcnNlKCksXHJcbiAgICAgIHRoaXNcclxuICAgIClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHJlbW92ZShtb2RlbERhdGEpIHtcclxuICAgIGlmKFxyXG4gICAgICAhQXJyYXkuaXNBcnJheShtb2RlbERhdGEpXHJcbiAgICApIHtcclxuICAgICAgdmFyIG1vZGVsSW5kZXggPSB0aGlzLmdldE1vZGVsSW5kZXgobW9kZWxEYXRhLl91dWlkKVxyXG4gICAgICB0aGlzLnJlbW92ZU1vZGVsQnlJbmRleChtb2RlbEluZGV4KVxyXG4gICAgfSBlbHNlIGlmKEFycmF5LmlzQXJyYXkobW9kZWxEYXRhKSkge1xyXG4gICAgICBtb2RlbERhdGFcclxuICAgICAgICAuZm9yRWFjaCgobW9kZWwpID0+IHtcclxuICAgICAgICAgIHZhciBtb2RlbEluZGV4ID0gdGhpcy5nZXRNb2RlbEluZGV4KG1vZGVsLl91dWlkKVxyXG4gICAgICAgICAgdGhpcy5yZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgdGhpcy5tb2RlbHMgPSB0aGlzLm1vZGVsc1xyXG4gICAgICAuZmlsdGVyKChtb2RlbCkgPT4gbW9kZWwgIT09IG51bGwpXHJcbiAgICBpZih0aGlzLl9sb2NhbFN0b3JhZ2UpIHRoaXMuZGIgPSB0aGlzLmRhdGFcclxuXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdjaGFuZ2UnLFxyXG4gICAgICB0aGlzLnBhcnNlKCksXHJcbiAgICAgIHRoaXNcclxuICAgIClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHJlc2V0KCkge1xyXG4gICAgdGhpcy5yZW1vdmUodGhpcy5fbW9kZWxzKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcGFyc2UoZGF0YSkge1xyXG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5kYXRhIHx8IHRoaXMuc3RvcmFnZUNvbnRhaW5lclxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb2xsZWN0aW9uXHJcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xuXG5jbGFzcyBWaWV3IGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAnYXR0cmlidXRlcycsXG4gICAgJ2VsZW1lbnROYW1lJyxcbiAgICAnZWxlbWVudCcsXG4gICAgJ2luc2VydCcsXG4gICAgJ3RlbXBsYXRlJyxcbiAgICAndWlFbGVtZW50cycsXG4gICAgJ3VpRWxlbWVudEV2ZW50cycsXG4gICAgJ3VpRWxlbWVudENhbGxiYWNrcycsXG4gICAgJ3JlbmRlcidcbiAgXSB9XG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICB9KVxuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgZWxlbWVudE5hbWUoKSB7IHJldHVybiB0aGlzLl9lbGVtZW50TmFtZSB9XG4gIHNldCBlbGVtZW50TmFtZShlbGVtZW50TmFtZSkgeyB0aGlzLl9lbGVtZW50TmFtZSA9IGVsZW1lbnROYW1lIH1cbiAgZ2V0IGVsZW1lbnQoKSB7XG4gICAgaWYoIXRoaXMuX2VsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMuZWxlbWVudE5hbWUpXG4gICAgICBPYmplY3QuZW50cmllcyh0aGlzLmF0dHJpYnV0ZXMpLmZvckVhY2goKFthdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlXSkgPT4ge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKVxuICAgICAgfSlcbiAgICAgIHRoaXMuZWxlbWVudE9ic2VydmVyLm9ic2VydmUodGhpcy5lbGVtZW50LCB7XG4gICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50XG4gIH1cbiAgZ2V0IGVsZW1lbnRPYnNlcnZlcigpIHtcbiAgICB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgPSB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgfHwgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoXG4gICAgICB0aGlzLmVsZW1lbnRPYnNlcnZlLmJpbmQodGhpcylcbiAgICApXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRPYnNlcnZlclxuICB9XG4gIHNldCBlbGVtZW50KGVsZW1lbnQpIHtcbiAgICBpZihlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50XG4gIH1cbiAgZ2V0IGF0dHJpYnV0ZXMoKSB7IHJldHVybiB0aGlzLl9hdHRyaWJ1dGVzIHx8IHt9IH1cbiAgc2V0IGF0dHJpYnV0ZXMoYXR0cmlidXRlcykgeyB0aGlzLl9hdHRyaWJ1dGVzID0gYXR0cmlidXRlcyB9XG4gIGdldCB0ZW1wbGF0ZSgpIHsgcmV0dXJuIHRoaXMuX3RlbXBsYXRlIH1cbiAgc2V0IHRlbXBsYXRlKHRlbXBsYXRlKSB7IHRoaXMuX3RlbXBsYXRlID0gdGVtcGxhdGUgfVxuICBnZXQgdWlFbGVtZW50cygpIHsgcmV0dXJuIHRoaXMuX3VpRWxlbWVudHMgfHwge30gfVxuICBzZXQgdWlFbGVtZW50cyh1aUVsZW1lbnRzKSB7XG4gICAgdGhpcy5fdWlFbGVtZW50cyA9IHVpRWxlbWVudHNcbiAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gIH1cbiAgZ2V0IHVpRWxlbWVudEV2ZW50cygpIHsgcmV0dXJuIHRoaXMuX3VpRWxlbWVudEV2ZW50cyB8fCB7fSB9XG4gIHNldCB1aUVsZW1lbnRFdmVudHModWlFbGVtZW50RXZlbnRzKSB7XG4gICAgdGhpcy5fdWlFbGVtZW50RXZlbnRzID0gdWlFbGVtZW50RXZlbnRzXG4gICAgdGhpcy50b2dnbGVFdmVudHMoKVxuICB9XG4gIGdldCB1aUVsZW1lbnRDYWxsYmFja3MoKSB7IHJldHVybiB0aGlzLl91aUVsZW1lbnRDYWxsYmFja3MgfHwge30gfVxuICBzZXQgdWlFbGVtZW50Q2FsbGJhY2tzKHVpRWxlbWVudENhbGxiYWNrcykge1xuICAgIHRoaXMuX3VpRWxlbWVudENhbGxiYWNrcyA9IHVpRWxlbWVudENhbGxiYWNrc1xuICAgIHRoaXMudG9nZ2xlRXZlbnRzKClcbiAgfVxuICBnZXQgdWkoKSB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXNcbiAgICBpZighdGhpcy5fdWkpIHtcbiAgICAgIHRoaXMuX3VpID0gT2JqZWN0LmVudHJpZXModGhpcy51aUVsZW1lbnRzKS5yZWR1Y2UoKF91aSxbdWlFbGVtZW50TmFtZSwgdWlFbGVtZW50UXVlcnldKSA9PiB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKF91aSwge1xuICAgICAgICAgIFt1aUVsZW1lbnROYW1lXToge1xuICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICBpZih0eXBlb2YgdWlFbGVtZW50UXVlcnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5UmVzdWx0cyA9IGNvbnRleHQuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHVpRWxlbWVudFF1ZXJ5KVxuICAgICAgICAgICAgICAgIHJldHVybiAocXVlcnlSZXN1bHRzLmxlbmd0aCA+IDEpID8gcXVlcnlSZXN1bHRzIDogcXVlcnlSZXN1bHRzLml0ZW0oMClcbiAgICAgICAgICAgICAgfSBlbHNlIGlmKFxuICAgICAgICAgICAgICAgIHVpRWxlbWVudFF1ZXJ5IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcbiAgICAgICAgICAgICAgICB1aUVsZW1lbnRRdWVyeSBpbnN0YW5jZW9mIERvY3VtZW50IHx8XG4gICAgICAgICAgICAgICAgdWlFbGVtZW50UXVlcnkgaW5zdGFuY2VvZiBXaW5kb3dcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVpRWxlbWVudFF1ZXJ5XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gX3VpXG4gICAgICB9LCB7fSlcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMuX3VpLCB7XG4gICAgICAgICckZWxlbWVudCc6IHtcbiAgICAgICAgICBnZXQoKSB7IHJldHVybiBjb250ZXh0LmVsZW1lbnQgfVxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3VpXG4gIH1cbiAgZWxlbWVudE9ic2VydmUobXV0YXRpb25SZWNvcmRMaXN0LCBvYnNlcnZlcikge1xuICAgIGZvcihsZXQgW211dGF0aW9uUmVjb3JkSW5kZXgsIG11dGF0aW9uUmVjb3JkXSBvZiBPYmplY3QuZW50cmllcyhtdXRhdGlvblJlY29yZExpc3QpKSB7XG4gICAgICBzd2l0Y2gobXV0YXRpb25SZWNvcmQudHlwZSkge1xuICAgICAgICBjYXNlICdjaGlsZExpc3QnOlxuICAgICAgICAgIGlmKG11dGF0aW9uUmVjb3JkLmFkZGVkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyh0aGlzLnVpKSlcbiAgICAgICAgICAgIC5mb3JFYWNoKChbdWlLZXksIHVpVmFsdWVdKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHVpVmFsdWVHZXQgPSB1aVZhbHVlLmdldCgpXG4gICAgICAgICAgICAgIGNvbnN0IGFkZGVkVUlFbGVtZW50ID0gQXJyYXkuZnJvbShtdXRhdGlvblJlY29yZC5hZGRlZE5vZGVzKS5maW5kKChhZGRlZE5vZGUpID0+IGFkZGVkTm9kZSA9PT0gdWlWYWx1ZUdldClcbiAgICAgICAgICAgICAgaWYoYWRkZWRVSUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZUV2ZW50cyh1aUtleSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYmluZEV2ZW50VG9FbGVtZW50KGVsZW1lbnQsIG1ldGhvZCwgZXZlbnROYW1lLCBldmVudENhbGxiYWNrTmFtZSkge1xuICAgIHRyeSB7XG4gICAgICBzd2l0Y2gobWV0aG9kKSB7XG4gICAgICAgIGNhc2UgJ2FkZEV2ZW50TGlzdGVuZXInOlxuICAgICAgICAgIHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXS5iaW5kKHRoaXMpXG4gICAgICAgICAgZWxlbWVudFttZXRob2RdKGV2ZW50TmFtZSwgdGhpcy51aUVsZW1lbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3JlbW92ZUV2ZW50TGlzdGVuZXInOlxuICAgICAgICAgIGVsZW1lbnRbbWV0aG9kXShldmVudE5hbWUsIHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSlcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH0gY2F0Y2goZXJyb3IpIHt9XG4gIH1cbiAgdG9nZ2xlRXZlbnRzKHRhcmdldFVJRWxlbWVudE5hbWUgPSBudWxsKSB7XG4gICAgdGhpcy5pc1RvZ2dsaW5nID0gdHJ1ZVxuICAgIGNvbnN0IHVpID0gdGhpcy51aVxuICAgIGNvbnN0IGV2ZW50QmluZE1ldGhvZHMgPSBbJ3JlbW92ZUV2ZW50TGlzdGVuZXInLCAnYWRkRXZlbnRMaXN0ZW5lciddXG4gICAgaWYoIXRhcmdldFVJRWxlbWVudE5hbWUpIHtcbiAgICAgIGV2ZW50QmluZE1ldGhvZHMuZm9yRWFjaCgoZXZlbnRCaW5kTWV0aG9kKSA9PiB7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMudWlFbGVtZW50RXZlbnRzKS5mb3JFYWNoKChbdWlFbGVtZW50RXZlbnRTZXR0aW5ncywgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWVdKSA9PiB7XG4gICAgICAgICAgbGV0IFt1aUVsZW1lbnROYW1lLCB1aUVsZW1lbnRFdmVudE5hbWVdID0gdWlFbGVtZW50RXZlbnRTZXR0aW5ncy5zcGxpdCgnICcpXG4gICAgICAgICAgaWYodWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xuICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0uZm9yRWFjaCgodWlFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50VG9FbGVtZW50KHVpRWxlbWVudCwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2UgaWYoXG4gICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIERvY3VtZW50IHx8XG4gICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIFdpbmRvd1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlbdWlFbGVtZW50TmFtZV0sIGV2ZW50QmluZE1ldGhvZCwgdWlFbGVtZW50RXZlbnROYW1lLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBldmVudEJpbmRNZXRob2RzLmZvckVhY2goKGV2ZW50QmluZE1ldGhvZCkgPT4ge1xuICAgICAgICBjb25zdCB1aUVsZW1lbnRFdmVudHMgPSBPYmplY3QuZW50cmllcyh0aGlzLnVpRWxlbWVudEV2ZW50cykuZm9yRWFjaCgoW3VpRWxlbWVudEV2ZW50U2V0dGluZ3MsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGxldCBbdWlFbGVtZW50TmFtZSwgdWlFbGVtZW50RXZlbnROYW1lXSA9IHVpRWxlbWVudEV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxuICAgICAgICAgIGlmKHRhcmdldFVJRWxlbWVudE5hbWUgPT09IHVpRWxlbWVudE5hbWUpIHtcbiAgICAgICAgICAgIGlmKHVpW3VpRWxlbWVudE5hbWVdIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0uZm9yRWFjaCgodWlFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlFbGVtZW50LCBldmVudEJpbmRNZXRob2QsIHVpRWxlbWVudEV2ZW50TmFtZSwgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2UgaWYodWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICB0aGlzLmJpbmRFdmVudFRvRWxlbWVudCh1aVt1aUVsZW1lbnROYW1lXSwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuaXNUb2dnbGluZyA9IGZhbHNlXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdXRvSW5zZXJ0KCkge1xuICAgIGlmKHRoaXMuaW5zZXJ0KSB7XG4gICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmluc2VydC5wYXJlbnRcbiAgICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMuaW5zZXJ0Lm1ldGhvZFxuICAgICAgcGFyZW50Lmluc2VydEFkamFjZW50RWxlbWVudChtZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdXRvUmVtb3ZlKCkge1xuICAgIGlmKHRoaXMuZWxlbWVudC5wYXJlbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHJlbmRlcihkYXRhID0ge30pIHtcbiAgICBpZih0aGlzLnRlbXBsYXRlKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUoZGF0YSlcbiAgICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZVxuICAgICAgdGhpcy5yZXNldFxuICAgIH1cbiAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgVmlld1xuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXgnXG5cbmNvbnN0IENvbnRyb2xsZXIgPSBjbGFzcyBleHRlbmRzIEV2ZW50cyB7XG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ21vZGVscycsXG4gICAgJ21vZGVsRXZlbnRzJyxcbiAgICAnbW9kZWxDYWxsYmFja3MnLFxuICAgICdjb2xsZWN0aW9ucycsXG4gICAgJ2NvbGxlY3Rpb25FdmVudHMnLFxuICAgICdjb2xsZWN0aW9uQ2FsbGJhY2tzJyxcbiAgICAndmlld3MnLFxuICAgICd2aWV3RXZlbnRzJyxcbiAgICAndmlld0NhbGxiYWNrcycsXG4gICAgJ2NvbnRyb2xsZXJzJyxcbiAgICAnY29udHJvbGxlckV2ZW50cycsXG4gICAgJ2NvbnRyb2xsZXJDYWxsYmFja3MnLFxuICAgICdyb3V0ZXJzJyxcbiAgICAncm91dGVyRXZlbnRzJyxcbiAgICAncm91dGVyQ2FsbGJhY2tzJyxcbiAgXSB9XG4gIGdldCBiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzKCkgeyByZXR1cm4gW1xuICAgICdtb2RlbCcsXG4gICAgJ3ZpZXcnLFxuICAgICdjb250cm9sbGVyJyxcbiAgICAncm91dGVyJyxcbiAgXSB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgc2V0dGluZ3MoKSB7XG4gICAgaWYoIXRoaXMuX3NldHRpbmdzKSB0aGlzLl9zZXR0aW5ncyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX3NldHRpbmdzXG4gIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5nc1xuICAgICAgLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgICBpZih0aGlzLnNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhcbiAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFsnXycuY29uY2F0KHZhbGlkU2V0dGluZyldOiB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudW1iZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgW3ZhbGlkU2V0dGluZ106IHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzWydfJy5jb25jYXQodmFsaWRTZXR0aW5nKV0gfSxcbiAgICAgICAgICAgICAgICBzZXQodmFsdWUpIHsgdGhpc1snXycuY29uY2F0KHZhbGlkU2V0dGluZyldID0gdmFsdWUgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApXG4gICAgICAgICAgdGhpc1t2YWxpZFNldHRpbmddID0gdGhpcy5zZXR0aW5nc1t2YWxpZFNldHRpbmddXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgdGhpcy5iaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzXG4gICAgICAuZm9yRWFjaCgoYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlKSA9PiB7XG4gICAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSwgJ29uJylcbiAgICAgIH0pXG4gIH1cbiAgcmVzZXRFdmVudHMoY2xhc3NUeXBlKSB7XG4gICAgW1xuICAgICAgJ29mZicsXG4gICAgICAnb24nXG4gICAgXS5mb3JFYWNoKChtZXRob2QpID0+IHtcbiAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKVxuICAgIH0pXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB0b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpIHtcbiAgICBjb25zdCBiYXNlTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ3MnKVxuICAgIGNvbnN0IGJhc2VFdmVudHNOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnRXZlbnRzJylcbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ0NhbGxiYWNrcycpXG4gICAgY29uc3QgYmFzZSA9IHRoaXNbYmFzZU5hbWVdXG4gICAgY29uc3QgYmFzZUV2ZW50cyA9IHRoaXNbYmFzZUV2ZW50c05hbWVdXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrcyA9IHRoaXNbYmFzZUNhbGxiYWNrc05hbWVdXG4gICAgaWYoXG4gICAgICBiYXNlICYmXG4gICAgICBiYXNlRXZlbnRzICYmXG4gICAgICBiYXNlQ2FsbGJhY2tzXG4gICAgKSB7XG4gICAgICBPYmplY3QuZW50cmllcyhiYXNlRXZlbnRzKVxuICAgICAgICAuZm9yRWFjaCgoW2Jhc2VFdmVudERhdGEsIGJhc2VDYWxsYmFja05hbWVdKSA9PiB7XG4gICAgICAgICAgY29uc3QgW2Jhc2VUYXJnZXROYW1lLCBiYXNlRXZlbnROYW1lXSA9IGJhc2VFdmVudERhdGEuc3BsaXQoJyAnKVxuICAgICAgICAgIGNvbnN0IGJhc2VUYXJnZXROYW1lU3Vic3RyaW5nRmlyc3QgPSBiYXNlVGFyZ2V0TmFtZS5zdWJzdHJpbmcoMCwgMSlcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0xhc3QgPSBiYXNlVGFyZ2V0TmFtZS5zdWJzdHJpbmcoYmFzZVRhcmdldE5hbWUubGVuZ3RoIC0gMSlcbiAgICAgICAgICBsZXQgYmFzZVRhcmdldHMgPSBbXVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdGaXJzdCA9PT0gJ1snICYmXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0xhc3QgPT09ICddJ1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZVRhcmdldHMgPSBPYmplY3QuZW50cmllcyhiYXNlKVxuICAgICAgICAgICAgICAucmVkdWNlKChfYmFzZVRhcmdldHMsIFtiYXNlTmFtZSwgYmFzZVRhcmdldF0pID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYmFzZVRhcmdldE5hbWVSZWdFeHBTdHJpbmcgPSBiYXNlVGFyZ2V0TmFtZS5zbGljZSgxLCAtMSlcbiAgICAgICAgICAgICAgICBsZXQgYmFzZVRhcmdldE5hbWVSZWdFeHAgPSBuZXcgUmVnRXhwKGJhc2VUYXJnZXROYW1lUmVnRXhwU3RyaW5nKVxuICAgICAgICAgICAgICAgIGlmKGJhc2VOYW1lLm1hdGNoKGJhc2VUYXJnZXROYW1lUmVnRXhwKSkge1xuICAgICAgICAgICAgICAgICAgX2Jhc2VUYXJnZXRzLnB1c2goYmFzZVRhcmdldClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9iYXNlVGFyZ2V0c1xuICAgICAgICAgICAgICB9LCBbXSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmFzZVRhcmdldHMucHVzaChiYXNlW2Jhc2VUYXJnZXROYW1lXSlcbiAgICAgICAgICB9XG4gICAgICAgICAgYmFzZUNhbGxiYWNrc1tiYXNlQ2FsbGJhY2tOYW1lXSA9IGJhc2VDYWxsYmFja3NbYmFzZUNhbGxiYWNrTmFtZV0uYmluZCh0aGlzKVxuICAgICAgICAgIGNvbnN0IGJhc2VFdmVudENhbGxiYWNrID0gYmFzZUNhbGxiYWNrc1tiYXNlQ2FsbGJhY2tOYW1lXVxuICAgICAgICAgIGlmKFxuICAgICAgICAgICAgYmFzZVRhcmdldE5hbWUgJiZcbiAgICAgICAgICAgIGJhc2VFdmVudE5hbWUgJiZcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzLmxlbmd0aCAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2tcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGJhc2VUYXJnZXRzXG4gICAgICAgICAgICAgIC5mb3JFYWNoKChiYXNlVGFyZ2V0KSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIHN3aXRjaChtZXRob2QpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnb24nOlxuICAgICAgICAgICAgICAgICAgICAgIGJhc2VUYXJnZXRbbWV0aG9kXShiYXNlRXZlbnROYW1lLCBiYXNlRXZlbnRDYWxsYmFjaylcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdvZmYnOlxuICAgICAgICAgICAgICAgICAgICAgIGJhc2VUYXJnZXRbbWV0aG9kXShiYXNlRXZlbnROYW1lLCBiYXNlRXZlbnRDYWxsYmFjay5uYW1lLnNwbGl0KCcgJylbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7fVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgQ29udHJvbGxlclxuIiwiaW1wb3J0IEV2ZW50cyBmcm9tICcuLi9FdmVudHMvaW5kZXgnXG5cbmNvbnN0IFJvdXRlciA9IGNsYXNzIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgICB0aGlzLmFkZFNldHRpbmdzKClcbiAgICB0aGlzLmFkZFdpbmRvd0V2ZW50cygpXG4gIH1cbiAgZ2V0IHZhbGlkU2V0dGluZ3MoKSB7IHJldHVybiBbXG4gICAgJ3Jvb3QnLFxuICAgICdoYXNoUm91dGluZycsXG4gICAgJ2NvbnRyb2xsZXInLFxuICAgICdyb3V0ZXMnXG4gIF0gfVxuICBnZXQgc2V0dGluZ3MoKSB7IHJldHVybiB0aGlzLl9zZXR0aW5ncyB9XG4gIHNldCBzZXR0aW5ncyhzZXR0aW5ncykge1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3MuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XG4gICAgICBpZihzZXR0aW5nc1t2YWxpZFNldHRpbmddKSB0aGlzW3ZhbGlkU2V0dGluZ10gPSBzZXR0aW5nc1t2YWxpZFNldHRpbmddXG4gICAgfSlcbiAgfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnNcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cbiAgZ2V0IHByb3RvY29sKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnByb3RvY29sIH1cbiAgZ2V0IGhvc3RuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lIH1cbiAgZ2V0IHBvcnQoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucG9ydCB9XG4gIGdldCBwYXRobmFtZSgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSB9XG4gIGdldCBwYXRoKCkge1xuICAgIGxldCBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWVcbiAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoWydeJywgdGhpcy5yb290XS5qb2luKCcnKSksICcnKVxuICAgICAgLnNwbGl0KCc/JylcbiAgICAgIC5zbGljZSgwLCAxKVxuICAgICAgWzBdXG4gICAgbGV0IGZyYWdtZW50cyA9IChcbiAgICAgIHN0cmluZy5sZW5ndGggPT09IDBcbiAgICApID8gW11cbiAgICAgIDogKFxuICAgICAgICAgIHN0cmluZy5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL15cXC8vKSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXFwvPy8pXG4gICAgICAgICkgPyBbJy8nXVxuICAgICAgICAgIDogc3RyaW5nXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC8kLywgJycpXG4gICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgcmV0dXJuIHtcbiAgICAgIGZyYWdtZW50czogZnJhZ21lbnRzLFxuICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgfVxuICB9XG4gIGdldCBoYXNoKCkge1xuICAgIGxldCBzdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uaGFzaFxuICAgICAgLnNsaWNlKDEpXG4gICAgICAuc3BsaXQoJz8nKVxuICAgICAgLnNsaWNlKDAsIDEpXG4gICAgICBbMF1cbiAgICBsZXQgZnJhZ21lbnRzID0gKFxuICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMFxuICAgICkgPyBbXVxuICAgICAgOiAoXG4gICAgICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXlxcLy8pICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9cXC8/LylcbiAgICAgICAgKSA/IFsnLyddXG4gICAgICAgICAgOiBzdHJpbmdcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICByZXR1cm4ge1xuICAgICAgZnJhZ21lbnRzOiBmcmFnbWVudHMsXG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICB9XG4gIH1cbiAgZ2V0IHBhcmFtZXRlcnMoKSB7XG4gICAgbGV0IHN0cmluZ1xuICAgIGxldCBkYXRhXG4gICAgaWYod2luZG93LmxvY2F0aW9uLmhyZWYubWF0Y2goL1xcPy8pKSB7XG4gICAgICBsZXQgcGFyYW1ldGVycyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgICAgIC5zcGxpdCgnPycpXG4gICAgICAgIC5zbGljZSgtMSlcbiAgICAgICAgLmpvaW4oJycpXG4gICAgICBzdHJpbmcgPSBwYXJhbWV0ZXJzXG4gICAgICBkYXRhID0gcGFyYW1ldGVyc1xuICAgICAgICAuc3BsaXQoJyYnKVxuICAgICAgICAucmVkdWNlKChcbiAgICAgICAgICBfcGFyYW1ldGVycyxcbiAgICAgICAgICBwYXJhbWV0ZXJcbiAgICAgICAgKSA9PiB7XG4gICAgICAgICAgbGV0IHBhcmFtZXRlckRhdGEgPSBwYXJhbWV0ZXIuc3BsaXQoJz0nKVxuICAgICAgICAgIF9wYXJhbWV0ZXJzW3BhcmFtZXRlckRhdGFbMF1dID0gcGFyYW1ldGVyRGF0YVsxXVxuICAgICAgICAgIHJldHVybiBfcGFyYW1ldGVyc1xuICAgICAgICB9LCB7fSlcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyaW5nID0gJydcbiAgICAgIGRhdGEgPSB7fVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfVxuICB9XG4gIGdldCBfcm9vdCgpIHsgcmV0dXJuIHRoaXMucm9vdCB8fCAnLycgfVxuICBzZXQgX3Jvb3Qocm9vdCkgeyB0aGlzLnJvb3QgPSByb290IH1cbiAgZ2V0IF9oYXNoUm91dGluZygpIHsgcmV0dXJuIHRoaXMuaGFzaFJvdXRpbmcgfHwgZmFsc2UgfVxuICBzZXQgX2hhc2hSb3V0aW5nKGhhc2hSb3V0aW5nKSB7IHRoaXMuaGFzaFJvdXRpbmcgPSBoYXNoUm91dGluZyB9XG4gIGdldCBfcm91dGVzKCkgeyByZXR1cm4gdGhpcy5yb3V0ZXMgfVxuICBzZXQgX3JvdXRlcyhyb3V0ZXMpIHsgdGhpcy5yb3V0ZXMgPSByb3V0ZXMgfVxuICBnZXQgX2NvbnRyb2xsZXIoKSB7IHJldHVybiB0aGlzLmNvbnRyb2xsZXIgfVxuICBzZXQgX2NvbnRyb2xsZXIoY29udHJvbGxlcikgeyB0aGlzLmNvbnRyb2xsZXIgPSBjb250cm9sbGVyIH1cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICByb290OiB0aGlzLnJvb3QsXG4gICAgICBwYXRoOiB0aGlzLnBhdGgsXG4gICAgICBoYXNoOiB0aGlzLmhhc2gsXG4gICAgICBwYXJhbWV0ZXJzOiB0aGlzLnBhcmFtZXRlcnMsXG4gICAgfVxuICB9XG4gIG1hdGNoUm91dGUocm91dGVGcmFnbWVudHMsIGxvY2F0aW9uRnJhZ21lbnRzKSB7XG4gICAgbGV0IHJvdXRlTWF0Y2hlcyA9IG5ldyBBcnJheSgpXG4gICAgaWYocm91dGVGcmFnbWVudHMubGVuZ3RoID09PSBsb2NhdGlvbkZyYWdtZW50cy5sZW5ndGgpIHtcbiAgICAgIHJvdXRlTWF0Y2hlcyA9IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgIC5yZWR1Y2UoKF9yb3V0ZU1hdGNoZXMsIHJvdXRlRnJhZ21lbnQsIHJvdXRlRnJhZ21lbnRJbmRleCkgPT4ge1xuICAgICAgICAgIGxldCBsb2NhdGlvbkZyYWdtZW50ID0gbG9jYXRpb25GcmFnbWVudHNbcm91dGVGcmFnbWVudEluZGV4XVxuICAgICAgICAgIGlmKHJvdXRlRnJhZ21lbnQubWF0Y2goL15cXDovKSkge1xuICAgICAgICAgICAgX3JvdXRlTWF0Y2hlcy5wdXNoKHRydWUpXG4gICAgICAgICAgfSBlbHNlIGlmKHJvdXRlRnJhZ21lbnQgPT09IGxvY2F0aW9uRnJhZ21lbnQpIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaCh0cnVlKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2goZmFsc2UpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBfcm91dGVNYXRjaGVzXG4gICAgICAgIH0sIFtdKVxuICAgIH0gZWxzZSB7XG4gICAgICByb3V0ZU1hdGNoZXMucHVzaChmYWxzZSlcbiAgICB9XG4gICAgcmV0dXJuIChyb3V0ZU1hdGNoZXMuaW5kZXhPZihmYWxzZSkgPT09IC0xKVxuICAgICAgPyB0cnVlXG4gICAgICA6IGZhbHNlXG4gIH1cbiAgZ2V0Um91dGUobG9jYXRpb24pIHtcbiAgICBsZXQgcm91dGVzID0gT2JqZWN0LmVudHJpZXModGhpcy5yb3V0ZXMpXG4gICAgICAucmVkdWNlKChcbiAgICAgICAgX3JvdXRlcyxcbiAgICAgICAgW3JvdXRlTmFtZSwgcm91dGVTZXR0aW5nc10pID0+IHtcbiAgICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSAoXG4gICAgICAgICAgICByb3V0ZU5hbWUubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgICByb3V0ZU5hbWUubWF0Y2goL15cXC8vKVxuICAgICAgICAgICkgPyBbcm91dGVOYW1lXVxuICAgICAgICAgICAgOiAocm91dGVOYW1lLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgPyBbJyddXG4gICAgICAgICAgICAgIDogcm91dGVOYW1lXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgICAgICAgcm91dGVTZXR0aW5ncy5mcmFnbWVudHMgPSByb3V0ZUZyYWdtZW50c1xuICAgICAgICAgIF9yb3V0ZXNbcm91dGVGcmFnbWVudHMuam9pbignLycpXSA9IHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICByZXR1cm4gX3JvdXRlc1xuICAgICAgICB9LFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHJvdXRlcylcbiAgICAgIC5maW5kKChyb3V0ZSkgPT4ge1xuICAgICAgICBsZXQgcm91dGVGcmFnbWVudHMgPSByb3V0ZS5mcmFnbWVudHNcbiAgICAgICAgbGV0IGxvY2F0aW9uRnJhZ21lbnRzID0gKHRoaXMuaGFzaFJvdXRpbmcpXG4gICAgICAgICAgPyBsb2NhdGlvbi5oYXNoLmZyYWdtZW50c1xuICAgICAgICAgIDogbG9jYXRpb24ucGF0aC5mcmFnbWVudHNcbiAgICAgICAgbGV0IG1hdGNoUm91dGUgPSB0aGlzLm1hdGNoUm91dGUoXG4gICAgICAgICAgcm91dGVGcmFnbWVudHMsXG4gICAgICAgICAgbG9jYXRpb25GcmFnbWVudHMsXG4gICAgICAgIClcbiAgICAgICAgcmV0dXJuIG1hdGNoUm91dGUgPT09IHRydWVcbiAgICAgIH0pXG4gIH1cbiAgcG9wU3RhdGUoZXZlbnQpIHtcbiAgICBsZXQgbG9jYXRpb24gPSB0aGlzLmxvY2F0aW9uXG4gICAgbGV0IHJvdXRlID0gdGhpcy5nZXRSb3V0ZShsb2NhdGlvbilcbiAgICBsZXQgcm91dGVEYXRhID0ge1xuICAgICAgcm91dGU6IHJvdXRlLFxuICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgIH1cbiAgICBpZihyb3V0ZSkge1xuICAgICAgdGhpcy5jb250cm9sbGVyW3JvdXRlLmNhbGxiYWNrXShyb3V0ZURhdGEpXG4gICAgICB0aGlzLmVtaXQoJ2NoYW5nZScsIHtcbiAgICAgICAgbmFtZTogJ2NoYW5nZScsXG4gICAgICAgIGRhdGE6IHJvdXRlRGF0YSxcbiAgICAgIH0sXG4gICAgICB0aGlzKVxuICAgIH1cbiAgfVxuICBhZGRXaW5kb3dFdmVudHMoKSB7XG4gICAgd2luZG93Lm9uKCdwb3BzdGF0ZScsIHRoaXMucG9wU3RhdGUuYmluZCh0aGlzKSlcbiAgfVxuICByZW1vdmVXaW5kb3dFdmVudHMoKSB7XG4gICAgd2luZG93Lm9mZigncG9wc3RhdGUnLCB0aGlzLnBvcFN0YXRlLmJpbmQodGhpcykpXG4gIH1cbiAgbmF2aWdhdGUocGF0aCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aFxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBSb3V0ZXJcbiIsImltcG9ydCAnLi9TaGltcy9ldmVudHMnXG5pbXBvcnQgRXZlbnRzIGZyb20gJy4vRXZlbnRzL2luZGV4J1xuaW1wb3J0IENoYW5uZWxzIGZyb20gJy4vQ2hhbm5lbHMvaW5kZXgnXG5pbXBvcnQgKiBhcyBVdGlscyBmcm9tICcuL1V0aWxzL2luZGV4J1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi9TZXJ2aWNlL2luZGV4J1xuaW1wb3J0IE1vZGVsIGZyb20gJy4vTW9kZWwvaW5kZXgnXG5pbXBvcnQgQ29sbGVjdGlvbiBmcm9tICcuL0NvbGxlY3Rpb24vaW5kZXgnXG5pbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcvaW5kZXgnXG5pbXBvcnQgQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXIvaW5kZXgnXG5pbXBvcnQgUm91dGVyIGZyb20gJy4vUm91dGVyL2luZGV4J1xuY29uc3QgTVZDID0ge1xuICBFdmVudHMsXG4gIENoYW5uZWxzLFxuICBVdGlscyxcbiAgU2VydmljZSxcbiAgTW9kZWwsXG4gIENvbGxlY3Rpb24sXG4gIFZpZXcsXG4gIENvbnRyb2xsZXIsXG4gIFJvdXRlcixcbn1cbmV4cG9ydCBkZWZhdWx0IE1WQ1xuIl0sIm5hbWVzIjpbIkV2ZW50VGFyZ2V0IiwicHJvdG90eXBlIiwib24iLCJhZGRFdmVudExpc3RlbmVyIiwib2ZmIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIkV2ZW50cyIsImNvbnN0cnVjdG9yIiwiX2V2ZW50cyIsImV2ZW50cyIsImdldEV2ZW50Q2FsbGJhY2tzIiwiZXZlbnROYW1lIiwiZ2V0RXZlbnRDYWxsYmFja05hbWUiLCJldmVudENhbGxiYWNrIiwibmFtZSIsImxlbmd0aCIsImdldEV2ZW50Q2FsbGJhY2tHcm91cCIsImV2ZW50Q2FsbGJhY2tzIiwiZXZlbnRDYWxsYmFja05hbWUiLCJldmVudENhbGxiYWNrR3JvdXAiLCJwdXNoIiwiYXJndW1lbnRzIiwiT2JqZWN0Iiwia2V5cyIsImVtaXQiLCJfYXJndW1lbnRzIiwiQXJyYXkiLCJmcm9tIiwic3BsaWNlIiwiZXZlbnREYXRhIiwiZXZlbnRBcmd1bWVudHMiLCJlbnRyaWVzIiwiZm9yRWFjaCIsImV2ZW50Q2FsbGJhY2tHcm91cE5hbWUiLCJkYXRhIiwiX3Jlc3BvbnNlcyIsInJlc3BvbnNlcyIsInJlc3BvbnNlIiwicmVzcG9uc2VOYW1lIiwicmVzcG9uc2VDYWxsYmFjayIsInJlcXVlc3QiLCJzbGljZSIsImNhbGwiLCJfcmVzcG9uc2VOYW1lIiwiX2NoYW5uZWxzIiwiY2hhbm5lbHMiLCJjaGFubmVsIiwiY2hhbm5lbE5hbWUiLCJDaGFubmVsIiwiVVVJRCIsInV1aWQiLCJpIiwicmFuZG9tIiwiTWF0aCIsInRvU3RyaW5nIiwiU2VydmljZSIsInZhbGlkU2V0dGluZ3MiLCJzZXR0aW5ncyIsIl9zZXR0aW5ncyIsInZhbGlkU2V0dGluZyIsIm9wdGlvbnMiLCJfb3B0aW9ucyIsInVybCIsIl91cmwiLCJtZXRob2QiLCJfbWV0aG9kIiwibW9kZSIsIl9tb2RlIiwiY2FjaGUiLCJfY2FjaGUiLCJjcmVkZW50aWFscyIsIl9jcmVkZW50aWFscyIsImhlYWRlcnMiLCJfaGVhZGVycyIsInJlZGlyZWN0IiwiX3JlZGlyZWN0IiwicmVmZXJyZXJQb2xpY3kiLCJfcmVmZXJyZXJQb2xpY3kiLCJib2R5IiwiX2JvZHkiLCJmZXRjaCIsImZldGNoT3B0aW9ucyIsInJlZHVjZSIsIl9mZXRjaE9wdGlvbnMiLCJmZXRjaE9wdGlvbk5hbWUiLCJmZXRjaE9wdGlvblZhbHVlIiwidGhlbiIsImpzb24iLCJNb2RlbCIsImJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXMiLCJiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUiLCJ0b2dnbGVFdmVudHMiLCJzZXJ2aWNlcyIsIl9zZXJ2aWNlcyIsIl9kYXRhIiwiZGVmYXVsdHMiLCJfZGVmYXVsdHMiLCJzZXQiLCJsb2NhbFN0b3JhZ2UiLCJfbG9jYWxTdG9yYWdlIiwiZGIiLCJfZGIiLCJnZXRJdGVtIiwiZW5kcG9pbnQiLCJKU09OIiwic3RyaW5naWZ5Iiwic3RvcmFnZUNvbnRhaW5lciIsInBhcnNlIiwic2V0SXRlbSIsInJlc2V0RXZlbnRzIiwiY2xhc3NUeXBlIiwiYmFzZU5hbWUiLCJjb25jYXQiLCJiYXNlRXZlbnRzTmFtZSIsImJhc2VDYWxsYmFja3NOYW1lIiwiYmFzZSIsImJhc2VFdmVudHMiLCJiYXNlQ2FsbGJhY2tzIiwiYmFzZUV2ZW50RGF0YSIsImJhc2VDYWxsYmFja05hbWUiLCJiYXNlVGFyZ2V0TmFtZSIsImJhc2VFdmVudE5hbWUiLCJzcGxpdCIsImJhc2VUYXJnZXQiLCJiYXNlQ2FsbGJhY2siLCJic2VDYWxsYmFja3MiLCJiYXNlRXZlbnRDYWxsYmFjayIsImNsYXNzVHlwZVRhcmdldCIsImNsYXNzVHlwZUV2ZW50TmFtZSIsImNsYXNzVHlwZUV2ZW50Q2FsbGJhY2siLCJlcnJvciIsInNldERCIiwia2V5IiwidmFsdWUiLCJ1bnNldERCIiwic2V0RGF0YVByb3BlcnR5IiwiZGVmaW5lUHJvcGVydGllcyIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiZW51bWVyYWJsZSIsImdldCIsInVuc2V0RGF0YVByb3BlcnR5IiwiaXNBcnJheSIsInVuc2V0IiwiQ29sbGVjdGlvbiIsImRlZmF1bHRJREF0dHJpYnV0ZSIsImFkZCIsIm1vZGVscyIsIl9tb2RlbHMiLCJtb2RlbHNEYXRhIiwibW9kZWwiLCJfbW9kZWwiLCJtYXAiLCJnZXRNb2RlbEluZGV4IiwibW9kZWxVVUlEIiwibW9kZWxJbmRleCIsImZpbmQiLCJfbW9kZWxJbmRleCIsIl91dWlkIiwicmVtb3ZlTW9kZWxCeUluZGV4IiwiYWRkTW9kZWwiLCJtb2RlbERhdGEiLCJzb21lTW9kZWwiLCJldmVudCIsInJlbW92ZSIsImZpbHRlciIsInJlc2V0IiwiVmlldyIsImVsZW1lbnROYW1lIiwiX2VsZW1lbnROYW1lIiwiZWxlbWVudCIsIl9lbGVtZW50IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYXR0cmlidXRlcyIsImF0dHJpYnV0ZUtleSIsImF0dHJpYnV0ZVZhbHVlIiwic2V0QXR0cmlidXRlIiwiZWxlbWVudE9ic2VydmVyIiwib2JzZXJ2ZSIsInN1YnRyZWUiLCJjaGlsZExpc3QiLCJfZWxlbWVudE9ic2VydmVyIiwiTXV0YXRpb25PYnNlcnZlciIsImVsZW1lbnRPYnNlcnZlIiwiYmluZCIsIkhUTUxFbGVtZW50IiwiX2F0dHJpYnV0ZXMiLCJ0ZW1wbGF0ZSIsIl90ZW1wbGF0ZSIsInVpRWxlbWVudHMiLCJfdWlFbGVtZW50cyIsInVpRWxlbWVudEV2ZW50cyIsIl91aUVsZW1lbnRFdmVudHMiLCJ1aUVsZW1lbnRDYWxsYmFja3MiLCJfdWlFbGVtZW50Q2FsbGJhY2tzIiwidWkiLCJjb250ZXh0IiwiX3VpIiwidWlFbGVtZW50TmFtZSIsInVpRWxlbWVudFF1ZXJ5IiwicXVlcnlSZXN1bHRzIiwicXVlcnlTZWxlY3RvckFsbCIsIml0ZW0iLCJEb2N1bWVudCIsIldpbmRvdyIsIm11dGF0aW9uUmVjb3JkTGlzdCIsIm9ic2VydmVyIiwibXV0YXRpb25SZWNvcmRJbmRleCIsIm11dGF0aW9uUmVjb3JkIiwidHlwZSIsImFkZGVkTm9kZXMiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwidWlLZXkiLCJ1aVZhbHVlIiwidWlWYWx1ZUdldCIsImFkZGVkVUlFbGVtZW50IiwiYWRkZWROb2RlIiwiYmluZEV2ZW50VG9FbGVtZW50IiwidGFyZ2V0VUlFbGVtZW50TmFtZSIsImlzVG9nZ2xpbmciLCJldmVudEJpbmRNZXRob2RzIiwiZXZlbnRCaW5kTWV0aG9kIiwidWlFbGVtZW50RXZlbnRTZXR0aW5ncyIsInVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lIiwidWlFbGVtZW50RXZlbnROYW1lIiwiTm9kZUxpc3QiLCJ1aUVsZW1lbnQiLCJhdXRvSW5zZXJ0IiwiaW5zZXJ0IiwicGFyZW50IiwiaW5zZXJ0QWRqYWNlbnRFbGVtZW50IiwiYXV0b1JlbW92ZSIsInJlbW92ZUNoaWxkIiwicmVuZGVyIiwiaW5uZXJIVE1MIiwiQ29udHJvbGxlciIsImVudW1iZXJhYmxlIiwiYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdGaXJzdCIsInN1YnN0cmluZyIsImJhc2VUYXJnZXROYW1lU3Vic3RyaW5nTGFzdCIsImJhc2VUYXJnZXRzIiwiX2Jhc2VUYXJnZXRzIiwiYmFzZVRhcmdldE5hbWVSZWdFeHBTdHJpbmciLCJiYXNlVGFyZ2V0TmFtZVJlZ0V4cCIsIlJlZ0V4cCIsIm1hdGNoIiwiUm91dGVyIiwiYWRkU2V0dGluZ3MiLCJhZGRXaW5kb3dFdmVudHMiLCJwcm90b2NvbCIsIndpbmRvdyIsImxvY2F0aW9uIiwiaG9zdG5hbWUiLCJwb3J0IiwicGF0aG5hbWUiLCJwYXRoIiwic3RyaW5nIiwicmVwbGFjZSIsInJvb3QiLCJqb2luIiwiZnJhZ21lbnRzIiwiaGFzaCIsInBhcmFtZXRlcnMiLCJocmVmIiwiX3BhcmFtZXRlcnMiLCJwYXJhbWV0ZXIiLCJwYXJhbWV0ZXJEYXRhIiwiX3Jvb3QiLCJfaGFzaFJvdXRpbmciLCJoYXNoUm91dGluZyIsIl9yb3V0ZXMiLCJyb3V0ZXMiLCJfY29udHJvbGxlciIsImNvbnRyb2xsZXIiLCJtYXRjaFJvdXRlIiwicm91dGVGcmFnbWVudHMiLCJsb2NhdGlvbkZyYWdtZW50cyIsInJvdXRlTWF0Y2hlcyIsIl9yb3V0ZU1hdGNoZXMiLCJyb3V0ZUZyYWdtZW50Iiwicm91dGVGcmFnbWVudEluZGV4IiwibG9jYXRpb25GcmFnbWVudCIsImluZGV4T2YiLCJnZXRSb3V0ZSIsInJvdXRlTmFtZSIsInJvdXRlU2V0dGluZ3MiLCJ2YWx1ZXMiLCJyb3V0ZSIsInBvcFN0YXRlIiwicm91dGVEYXRhIiwiY2FsbGJhY2siLCJyZW1vdmVXaW5kb3dFdmVudHMiLCJuYXZpZ2F0ZSIsIk1WQyIsIkNoYW5uZWxzIiwiVXRpbHMiXSwibWFwcGluZ3MiOiI7Ozs7OztFQUFBQSxXQUFXLENBQUNDLFNBQVosQ0FBc0JDLEVBQXRCLEdBQTJCRixXQUFXLENBQUNDLFNBQVosQ0FBc0JDLEVBQXRCLElBQTRCRixXQUFXLENBQUNDLFNBQVosQ0FBc0JFLGdCQUE3RTtFQUNBSCxXQUFXLENBQUNDLFNBQVosQ0FBc0JHLEdBQXRCLEdBQTRCSixXQUFXLENBQUNDLFNBQVosQ0FBc0JHLEdBQXRCLElBQTZCSixXQUFXLENBQUNDLFNBQVosQ0FBc0JJLG1CQUEvRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQ0RBLE1BQU1DLE1BQU4sQ0FBYTtFQUNYQyxFQUFBQSxXQUFXLEdBQUc7O0VBQ2QsTUFBSUMsT0FBSixHQUFjO0VBQ1osU0FBS0MsTUFBTCxHQUFjLEtBQUtBLE1BQUwsSUFBZSxFQUE3QjtFQUNBLFdBQU8sS0FBS0EsTUFBWjtFQUNEOztFQUNEQyxFQUFBQSxpQkFBaUIsQ0FBQ0MsU0FBRCxFQUFZO0VBQUUsV0FBTyxLQUFLSCxPQUFMLENBQWFHLFNBQWIsS0FBMkIsRUFBbEM7RUFBc0M7O0VBQ3JFQyxFQUFBQSxvQkFBb0IsQ0FBQ0MsYUFBRCxFQUFnQjtFQUNsQyxXQUFRQSxhQUFhLENBQUNDLElBQWQsQ0FBbUJDLE1BQXBCLEdBQ0hGLGFBQWEsQ0FBQ0MsSUFEWCxHQUVILG1CQUZKO0VBR0Q7O0VBQ0RFLEVBQUFBLHFCQUFxQixDQUFDQyxjQUFELEVBQWlCQyxpQkFBakIsRUFBb0M7RUFDdkQsV0FBT0QsY0FBYyxDQUFDQyxpQkFBRCxDQUFkLElBQXFDLEVBQTVDO0VBQ0Q7O0VBQ0RoQixFQUFBQSxFQUFFLENBQUNTLFNBQUQsRUFBWUUsYUFBWixFQUEyQjtFQUMzQixRQUFJSSxjQUFjLEdBQUcsS0FBS1AsaUJBQUwsQ0FBdUJDLFNBQXZCLENBQXJCO0VBQ0EsUUFBSU8saUJBQWlCLEdBQUcsS0FBS04sb0JBQUwsQ0FBMEJDLGFBQTFCLENBQXhCO0VBQ0EsUUFBSU0sa0JBQWtCLEdBQUcsS0FBS0gscUJBQUwsQ0FBMkJDLGNBQTNCLEVBQTJDQyxpQkFBM0MsQ0FBekI7RUFDQUMsSUFBQUEsa0JBQWtCLENBQUNDLElBQW5CLENBQXdCUCxhQUF4QjtFQUNBSSxJQUFBQSxjQUFjLENBQUNDLGlCQUFELENBQWQsR0FBb0NDLGtCQUFwQztFQUNBLFNBQUtYLE9BQUwsQ0FBYUcsU0FBYixJQUEwQk0sY0FBMUI7RUFDQSxXQUFPLElBQVA7RUFDRDs7RUFDRGIsRUFBQUEsR0FBRyxHQUFHO0VBQ0osWUFBT2lCLFNBQVMsQ0FBQ04sTUFBakI7RUFDRSxXQUFLLENBQUw7RUFDRSxlQUFPLEtBQUtOLE1BQVo7RUFDQTs7RUFDRixXQUFLLENBQUw7RUFDRSxZQUFJRSxTQUFTLEdBQUdVLFNBQVMsQ0FBQyxDQUFELENBQXpCO0VBQ0EsZUFBTyxLQUFLYixPQUFMLENBQWFHLFNBQWIsQ0FBUDtFQUNBOztFQUNGLFdBQUssQ0FBTDtFQUNFLFlBQUlBLFNBQVMsR0FBR1UsU0FBUyxDQUFDLENBQUQsQ0FBekI7RUFDQSxZQUFJUixhQUFhLEdBQUdRLFNBQVMsQ0FBQyxDQUFELENBQTdCO0VBQ0EsWUFBSUgsaUJBQWlCLEdBQUksT0FBT0wsYUFBUCxLQUF5QixRQUExQixHQUNwQkEsYUFEb0IsR0FFcEIsS0FBS0Qsb0JBQUwsQ0FBMEJDLGFBQTFCLENBRko7O0VBR0EsWUFBRyxLQUFLTCxPQUFMLENBQWFHLFNBQWIsQ0FBSCxFQUE0QjtFQUMxQixpQkFBTyxLQUFLSCxPQUFMLENBQWFHLFNBQWIsRUFBd0JPLGlCQUF4QixDQUFQO0VBQ0EsY0FDRUksTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBS2YsT0FBTCxDQUFhRyxTQUFiLENBQVosRUFBcUNJLE1BQXJDLEtBQWdELENBRGxELEVBRUUsT0FBTyxLQUFLUCxPQUFMLENBQWFHLFNBQWIsQ0FBUDtFQUNIOztFQUNEO0VBcEJKOztFQXNCQSxXQUFPLElBQVA7RUFDRDs7RUFDRGEsRUFBQUEsSUFBSSxHQUFHO0VBQ0wsUUFBSUMsVUFBVSxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FBV04sU0FBWCxDQUFqQjs7RUFDQSxRQUFJVixTQUFTLEdBQUdjLFVBQVUsQ0FBQ0csTUFBWCxDQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixDQUF4QixDQUFoQjs7RUFDQSxRQUFJQyxTQUFTLEdBQUdKLFVBQVUsQ0FBQ0csTUFBWCxDQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixDQUF4QixDQUFoQjs7RUFDQSxRQUFJRSxjQUFjLEdBQUdMLFVBQVUsQ0FBQ0csTUFBWCxDQUFrQixDQUFsQixDQUFyQjs7RUFDQU4sSUFBQUEsTUFBTSxDQUFDUyxPQUFQLENBQWUsS0FBS3JCLGlCQUFMLENBQXVCQyxTQUF2QixDQUFmLEVBQ0dxQixPQURILENBQ1csVUFBa0Q7RUFBQSxVQUFqRCxDQUFDQyxzQkFBRCxFQUF5QmQsa0JBQXpCLENBQWlEO0VBQ3pEQSxNQUFBQSxrQkFBa0IsQ0FDZmEsT0FESCxDQUNZbkIsYUFBRCxJQUFtQjtFQUMxQkEsUUFBQUEsYUFBYSxNQUFiLFVBQ0U7RUFDRUMsVUFBQUEsSUFBSSxFQUFFSCxTQURSO0VBRUV1QixVQUFBQSxJQUFJLEVBQUVMO0VBRlIsU0FERiw0QkFLS0MsY0FMTDtFQU9ELE9BVEg7RUFVRCxLQVpIO0VBYUEsV0FBTyxJQUFQO0VBQ0Q7O0VBcEVVOztFQ0FFLGNBQU07RUFDbkJ2QixFQUFBQSxXQUFXLEdBQUc7O0VBQ2QsTUFBSTRCLFVBQUosR0FBaUI7RUFDZixTQUFLQyxTQUFMLEdBQWlCLEtBQUtBLFNBQUwsR0FDYixLQUFLQSxTQURRLEdBRWIsRUFGSjtFQUdBLFdBQU8sS0FBS0EsU0FBWjtFQUNEOztFQUNEQyxFQUFBQSxRQUFRLENBQUNDLFlBQUQsRUFBZUMsZ0JBQWYsRUFBaUM7RUFDdkMsUUFBSUEsZ0JBQUosRUFBc0I7RUFDcEIsV0FBS0osVUFBTCxDQUFnQkcsWUFBaEIsSUFBZ0NDLGdCQUFoQztFQUNELEtBRkQsTUFFTztFQUNMLGFBQU8sS0FBS0osVUFBTCxDQUFnQkUsUUFBaEIsQ0FBUDtFQUNEO0VBQ0Y7O0VBQ0RHLEVBQUFBLE9BQU8sQ0FBQ0YsWUFBRCxFQUFlO0VBQ3BCLFFBQUksS0FBS0gsVUFBTCxDQUFnQkcsWUFBaEIsQ0FBSixFQUFtQztFQUFBOztFQUNqQyxVQUFJYixVQUFVLEdBQUdDLEtBQUssQ0FBQ3pCLFNBQU4sQ0FBZ0J3QyxLQUFoQixDQUFzQkMsSUFBdEIsQ0FBMkJyQixTQUEzQixFQUFzQ29CLEtBQXRDLENBQTRDLENBQTVDLENBQWpCOztFQUNBLGFBQU8seUJBQUtOLFVBQUwsRUFBZ0JHLFlBQWhCLDZDQUFpQ2IsVUFBakMsRUFBUDtFQUNEO0VBQ0Y7O0VBQ0RyQixFQUFBQSxHQUFHLENBQUNrQyxZQUFELEVBQWU7RUFDaEIsUUFBSUEsWUFBSixFQUFrQjtFQUNoQixhQUFPLEtBQUtILFVBQUwsQ0FBZ0JHLFlBQWhCLENBQVA7RUFDRCxLQUZELE1BRU87RUFDTCxXQUFLLElBQUksQ0FBQ0ssYUFBRCxDQUFULElBQTRCckIsTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBS1ksVUFBakIsQ0FBNUIsRUFBMEQ7RUFDeEQsZUFBTyxLQUFLQSxVQUFMLENBQWdCUSxhQUFoQixDQUFQO0VBQ0Q7RUFDRjtFQUNGOztFQTdCa0I7O0VDQ04sZUFBTTtFQUNuQnBDLEVBQUFBLFdBQVcsR0FBRzs7RUFDZCxNQUFJcUMsU0FBSixHQUFnQjtFQUNkLFNBQUtDLFFBQUwsR0FBZ0IsS0FBS0EsUUFBTCxHQUNaLEtBQUtBLFFBRE8sR0FFWixFQUZKO0VBR0EsV0FBTyxLQUFLQSxRQUFaO0VBQ0Q7O0VBQ0RDLEVBQUFBLE9BQU8sQ0FBQ0MsV0FBRCxFQUFjO0VBQ25CLFNBQUtILFNBQUwsQ0FBZUcsV0FBZixJQUE4QixLQUFLSCxTQUFMLENBQWVHLFdBQWYsSUFDMUIsS0FBS0gsU0FBTCxDQUFlRyxXQUFmLENBRDBCLEdBRTFCLElBQUlDLE9BQUosRUFGSjtFQUdBLFdBQU8sS0FBS0osU0FBTCxDQUFlRyxXQUFmLENBQVA7RUFDRDs7RUFDRDNDLEVBQUFBLEdBQUcsQ0FBQzJDLFdBQUQsRUFBYztFQUNmLFdBQU8sS0FBS0gsU0FBTCxDQUFlRyxXQUFmLENBQVA7RUFDRDs7RUFoQmtCOztFQ0ROLFNBQVNFLElBQVQsR0FBZ0I7RUFDN0IsTUFBSUMsSUFBSSxHQUFHLEVBQVg7RUFBQSxNQUFlQyxDQUFmO0VBQUEsTUFBa0JDLE1BQWxCOztFQUNBLE9BQUtELENBQUMsR0FBRyxDQUFULEVBQVlBLENBQUMsR0FBRyxFQUFoQixFQUFvQkEsQ0FBQyxFQUFyQixFQUF5QjtFQUN2QkMsSUFBQUEsTUFBTSxHQUFHQyxJQUFJLENBQUNELE1BQUwsS0FBZ0IsRUFBaEIsR0FBcUIsQ0FBOUI7O0VBRUEsUUFBSUQsQ0FBQyxJQUFJLENBQUwsSUFBVUEsQ0FBQyxJQUFJLEVBQWYsSUFBcUJBLENBQUMsSUFBSSxFQUExQixJQUFnQ0EsQ0FBQyxJQUFJLEVBQXpDLEVBQTZDO0VBQzNDRCxNQUFBQSxJQUFJLElBQUksR0FBUjtFQUNEOztFQUNEQSxJQUFBQSxJQUFJLElBQUksQ0FBQ0MsQ0FBQyxJQUFJLEVBQUwsR0FBVSxDQUFWLEdBQWVBLENBQUMsSUFBSSxFQUFMLEdBQVdDLE1BQU0sR0FBRyxDQUFULEdBQWEsQ0FBeEIsR0FBNkJBLE1BQTdDLEVBQXNERSxRQUF0RCxDQUErRCxFQUEvRCxDQUFSO0VBQ0Q7O0VBQ0QsU0FBT0osSUFBUDtFQUNEOzs7Ozs7Ozs7RUNURCxNQUFNSyxPQUFOLFNBQXNCakQsTUFBdEIsQ0FBNkI7RUFDM0JDLEVBQUFBLFdBQVcsR0FBOEI7QUFBQSxFQUN2QyxVQUFNLEdBQUdjLFNBQVQ7RUFDRDs7RUFDRCxNQUFJbUMsYUFBSixHQUFvQjtFQUFFLFdBQU8sQ0FDM0IsS0FEMkIsRUFFM0IsUUFGMkIsRUFHM0IsTUFIMkIsRUFJM0IsT0FKMkIsRUFLM0IsYUFMMkIsRUFNM0IsU0FOMkIsRUFPM0IsVUFQMkIsRUFRM0IsaUJBUjJCLEVBUzNCLE1BVDJCLENBQVA7RUFVbkI7O0VBQ0gsTUFBSUMsUUFBSixHQUFlO0VBQUUsV0FBTyxLQUFLQyxTQUFaO0VBQXVCOztFQUN4QyxNQUFJRCxRQUFKLENBQWFBLFFBQWIsRUFBdUI7RUFDckIsU0FBS0MsU0FBTCxHQUFpQkQsUUFBakI7RUFDQSxTQUFLRCxhQUFMLENBQW1CeEIsT0FBbkIsQ0FBNEIyQixZQUFELElBQWtCO0VBQzNDLFVBQUdGLFFBQVEsQ0FBQ0UsWUFBRCxDQUFYLEVBQTJCLEtBQUtBLFlBQUwsSUFBcUJGLFFBQVEsQ0FBQ0UsWUFBRCxDQUE3QjtFQUM1QixLQUZEO0VBR0Q7O0VBQ0QsTUFBSUMsT0FBSixHQUFjO0VBQ1osUUFBRyxDQUFDLEtBQUtDLFFBQVQsRUFBbUIsS0FBS0EsUUFBTCxHQUFnQixFQUFoQjtFQUNuQixXQUFPLEtBQUtBLFFBQVo7RUFDRDs7RUFDRCxNQUFJRCxPQUFKLENBQVlBLE9BQVosRUFBcUI7RUFBRSxTQUFLQyxRQUFMLEdBQWdCRCxPQUFoQjtFQUF5Qjs7RUFDaEQsTUFBSUUsR0FBSixHQUFVO0VBQUUsV0FBTyxLQUFLQyxJQUFaO0VBQWtCOztFQUM5QixNQUFJRCxHQUFKLENBQVFBLEdBQVIsRUFBYTtFQUFFLFNBQUtDLElBQUwsR0FBWUQsR0FBWjtFQUFpQjs7RUFDaEMsTUFBSUUsTUFBSixHQUFhO0VBQUUsV0FBTyxLQUFLQyxPQUFaO0VBQXFCOztFQUNwQyxNQUFJQyxJQUFKLENBQVNBLElBQVQsRUFBZTtFQUFFLFNBQUtDLEtBQUwsR0FBYUQsSUFBYjtFQUFtQjs7RUFDcEMsTUFBSUEsSUFBSixHQUFXO0VBQUUsV0FBTyxLQUFLQyxLQUFaO0VBQW1COztFQUNoQyxNQUFJQyxLQUFKLENBQVVBLEtBQVYsRUFBaUI7RUFBRSxTQUFLQyxNQUFMLEdBQWNELEtBQWQ7RUFBcUI7O0VBQ3hDLE1BQUlBLEtBQUosR0FBWTtFQUFFLFdBQU8sS0FBS0MsTUFBWjtFQUFvQjs7RUFDbEMsTUFBSUMsV0FBSixDQUFnQkEsV0FBaEIsRUFBNkI7RUFBRSxTQUFLQyxZQUFMLEdBQW9CRCxXQUFwQjtFQUFpQzs7RUFDaEUsTUFBSUEsV0FBSixHQUFrQjtFQUFFLFdBQU8sS0FBS0MsWUFBWjtFQUEwQjs7RUFDOUMsTUFBSUMsT0FBSixDQUFZQSxPQUFaLEVBQXFCO0VBQUUsU0FBS0MsUUFBTCxHQUFnQkQsT0FBaEI7RUFBeUI7O0VBQ2hELE1BQUlBLE9BQUosR0FBYztFQUFFLFdBQU8sS0FBS0MsUUFBWjtFQUFzQjs7RUFDdEMsTUFBSUMsUUFBSixDQUFhQSxRQUFiLEVBQXVCO0VBQUUsU0FBS0MsU0FBTCxHQUFpQkQsUUFBakI7RUFBMkI7O0VBQ3BELE1BQUlBLFFBQUosR0FBZTtFQUFFLFdBQU8sS0FBS0MsU0FBWjtFQUF1Qjs7RUFDeEMsTUFBSUMsY0FBSixDQUFtQkEsY0FBbkIsRUFBbUM7RUFBRSxTQUFLQyxlQUFMLEdBQXVCRCxjQUF2QjtFQUF1Qzs7RUFDNUUsTUFBSUEsY0FBSixHQUFxQjtFQUFFLFdBQU8sS0FBS0MsZUFBWjtFQUE2Qjs7RUFDcEQsTUFBSUMsSUFBSixDQUFTQSxJQUFULEVBQWU7RUFBRSxTQUFLQyxLQUFMLEdBQWFELElBQWI7RUFBbUI7O0VBQ3BDLE1BQUlBLElBQUosR0FBVztFQUFFLFdBQU8sS0FBS0MsS0FBWjtFQUFtQjs7RUFDaENDLEVBQUFBLEtBQUssR0FBRztFQUNOLFFBQU1DLFlBQVksR0FBRyxLQUFLekIsYUFBTCxDQUFtQjBCLE1BQW5CLENBQTBCLENBQUNDLGFBQUQsV0FBd0Q7RUFBQSxVQUF4QyxDQUFDQyxlQUFELEVBQWtCQyxnQkFBbEIsQ0FBd0M7RUFDckcsVUFBRyxLQUFLRCxlQUFMLENBQUgsRUFBMEJELGFBQWEsQ0FBQ0MsZUFBRCxDQUFiLEdBQWlDQyxnQkFBakM7RUFDMUIsYUFBT0YsYUFBUDtFQUNELEtBSG9CLEVBR2xCLEVBSGtCLENBQXJCO0VBSUFILElBQUFBLEtBQUssQ0FBQyxLQUFLbEIsR0FBTixFQUFXbUIsWUFBWCxDQUFMLENBQ0dLLElBREgsQ0FDU2pELFFBQUQsSUFBYztFQUNsQixhQUFPQSxRQUFRLENBQUNrRCxJQUFULEVBQVA7RUFDRCxLQUhILEVBSUdELElBSkgsQ0FJU3BELElBQUQsSUFBVTtFQUNkLFdBQUtWLElBQUwsQ0FBVSxPQUFWLEVBQW1CO0VBQ2pCVSxRQUFBQSxJQUFJLEVBQUVBO0VBRFcsT0FBbkI7RUFHRCxLQVJIO0VBU0EsV0FBTyxJQUFQO0VBQ0Q7O0VBM0QwQjs7RUNBN0IsSUFBTXNELEtBQUssR0FBRyxjQUFjbEYsTUFBZCxDQUFxQjtFQUNqQ0MsRUFBQUEsV0FBVyxHQUE4QjtFQUFBLFFBQTdCa0QsUUFBNkIsdUVBQWxCLEVBQWtCO0VBQUEsUUFBZEcsT0FBYyx1RUFBSixFQUFJO0VBQ3ZDO0VBQ0EsU0FBS0gsUUFBTCxHQUFnQkEsUUFBaEI7RUFDQSxTQUFLRyxPQUFMLEdBQWVBLE9BQWY7RUFDRDs7RUFDRCxNQUFJSixhQUFKLEdBQW9CO0VBQUUsV0FBTyxDQUMzQixjQUQyQixFQUUzQixVQUYyQixFQUczQixVQUgyQixFQUkzQixlQUoyQixFQUszQixrQkFMMkIsQ0FBUDtFQU1uQjs7RUFDSCxNQUFJaUMsK0JBQUosR0FBc0M7RUFBRSxXQUFPLENBQzdDLFNBRDZDLENBQVA7RUFFckM7O0VBQ0gsTUFBSWhDLFFBQUosR0FBZTtFQUFFLFdBQU8sS0FBS0MsU0FBWjtFQUF1Qjs7RUFDeEMsTUFBSUQsUUFBSixDQUFhQSxRQUFiLEVBQXVCO0VBQ3JCLFNBQUtDLFNBQUwsR0FBaUJELFFBQWpCO0VBQ0EsU0FBS0QsYUFBTCxDQUFtQnhCLE9BQW5CLENBQTRCMkIsWUFBRCxJQUFrQjtFQUMzQyxVQUFHRixRQUFRLENBQUNFLFlBQUQsQ0FBWCxFQUEyQixLQUFLQSxZQUFMLElBQXFCRixRQUFRLENBQUNFLFlBQUQsQ0FBN0I7RUFDNUIsS0FGRDtFQUdBLFNBQUs4QiwrQkFBTCxDQUNHekQsT0FESCxDQUNZMEQsOEJBQUQsSUFBb0M7RUFDM0MsV0FBS0MsWUFBTCxDQUFrQkQsOEJBQWxCLEVBQWtELElBQWxEO0VBQ0QsS0FISDtFQUlEOztFQUNELE1BQUk5QixPQUFKLEdBQWM7RUFDWixRQUFHLENBQUMsS0FBS0MsUUFBVCxFQUFtQixLQUFLQSxRQUFMLEdBQWdCLEVBQWhCO0VBQ25CLFdBQU8sS0FBS0EsUUFBWjtFQUNEOztFQUNELE1BQUlELE9BQUosQ0FBWUEsT0FBWixFQUFxQjtFQUFFLFNBQUtDLFFBQUwsR0FBZ0JELE9BQWhCO0VBQXlCOztFQUNoRCxNQUFJZ0MsUUFBSixHQUFlO0VBQ2IsUUFBRyxDQUFDLEtBQUtDLFNBQVQsRUFBb0IsS0FBS0EsU0FBTCxHQUFpQixFQUFqQjtFQUNwQixXQUFPLEtBQUtBLFNBQVo7RUFDRDs7RUFDRCxNQUFJRCxRQUFKLENBQWFBLFFBQWIsRUFBdUI7RUFBRSxTQUFLQyxTQUFMLEdBQWlCRCxRQUFqQjtFQUEyQjs7RUFDcEQsTUFBSTFELElBQUosR0FBVztFQUNULFFBQUcsQ0FBQyxLQUFLNEQsS0FBVCxFQUFnQixLQUFLQSxLQUFMLEdBQWEsRUFBYjtFQUNoQixXQUFPLEtBQUtBLEtBQVo7RUFDRDs7RUFDRCxNQUFJQyxRQUFKLEdBQWU7RUFDYixRQUFHLENBQUMsS0FBS0MsU0FBVCxFQUFvQixLQUFLQSxTQUFMLEdBQWlCLEVBQWpCO0VBQ3BCLFdBQU8sS0FBS0EsU0FBWjtFQUNEOztFQUNELE1BQUlELFFBQUosQ0FBYUEsUUFBYixFQUF1QjtFQUNyQixTQUFLQyxTQUFMLEdBQWlCRCxRQUFqQjtFQUNBLFNBQUtFLEdBQUwsQ0FBUyxLQUFLRixRQUFkO0VBQ0Q7O0VBQ0QsTUFBSUcsWUFBSixHQUFtQjtFQUFFLFdBQU8sS0FBS0MsYUFBWjtFQUEyQjs7RUFDaEQsTUFBSUQsWUFBSixDQUFpQkEsWUFBakIsRUFBK0I7RUFBRSxTQUFLQyxhQUFMLEdBQXFCRCxZQUFyQjtFQUFtQzs7RUFDcEUsTUFBSUUsRUFBSixHQUFTO0VBQUUsV0FBTyxLQUFLQyxHQUFaO0VBQWlCOztFQUM1QixNQUFJQSxHQUFKLEdBQVU7RUFDUixRQUFJRCxFQUFFLEdBQUdGLFlBQVksQ0FBQ0ksT0FBYixDQUFxQixLQUFLSixZQUFMLENBQWtCSyxRQUF2QyxLQUFvREMsSUFBSSxDQUFDQyxTQUFMLENBQWUsS0FBS0MsZ0JBQXBCLENBQTdEO0VBQ0EsV0FBT0YsSUFBSSxDQUFDRyxLQUFMLENBQVdQLEVBQVgsQ0FBUDtFQUNEOztFQUNELE1BQUlDLEdBQUosQ0FBUUQsRUFBUixFQUFZO0VBQ1ZBLElBQUFBLEVBQUUsR0FBR0ksSUFBSSxDQUFDQyxTQUFMLENBQWVMLEVBQWYsQ0FBTDtFQUNBRixJQUFBQSxZQUFZLENBQUNVLE9BQWIsQ0FBcUIsS0FBS1YsWUFBTCxDQUFrQkssUUFBdkMsRUFBaURILEVBQWpEO0VBQ0Q7O0VBQ0RTLEVBQUFBLFdBQVcsQ0FBQ0MsU0FBRCxFQUFZO0VBQ3JCLEtBQ0UsS0FERixFQUVFLElBRkYsRUFHRTlFLE9BSEYsQ0FHV2dDLE1BQUQsSUFBWTtFQUNwQixXQUFLMkIsWUFBTCxDQUFrQm1CLFNBQWxCLEVBQTZCOUMsTUFBN0I7RUFDRCxLQUxEO0VBTUEsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0QyQixFQUFBQSxZQUFZLENBQUNtQixTQUFELEVBQVk5QyxNQUFaLEVBQW9CO0VBQzlCLFFBQU0rQyxRQUFRLEdBQUdELFNBQVMsQ0FBQ0UsTUFBVixDQUFpQixHQUFqQixDQUFqQjtFQUNBLFFBQU1DLGNBQWMsR0FBR0gsU0FBUyxDQUFDRSxNQUFWLENBQWlCLFFBQWpCLENBQXZCO0VBQ0EsUUFBTUUsaUJBQWlCLEdBQUdKLFNBQVMsQ0FBQ0UsTUFBVixDQUFpQixXQUFqQixDQUExQjtFQUNBLFFBQU1HLElBQUksR0FBRyxLQUFLSixRQUFMLENBQWI7RUFDQSxRQUFNSyxVQUFVLEdBQUcsS0FBS0gsY0FBTCxDQUFuQjtFQUNBLFFBQU1JLGFBQWEsR0FBRyxLQUFLSCxpQkFBTCxDQUF0Qjs7RUFDQSxRQUNFQyxJQUFJLElBQ0pDLFVBREEsSUFFQUMsYUFIRixFQUlFO0VBQ0EvRixNQUFBQSxNQUFNLENBQUNTLE9BQVAsQ0FBZXFGLFVBQWYsRUFDR3BGLE9BREgsQ0FDVyxVQUF1QztFQUFBLFlBQXRDLENBQUNzRixhQUFELEVBQWdCQyxnQkFBaEIsQ0FBc0M7RUFDOUMsWUFBTSxDQUFDQyxjQUFELEVBQWlCQyxhQUFqQixJQUFrQ0gsYUFBYSxDQUFDSSxLQUFkLENBQW9CLEdBQXBCLENBQXhDO0VBQ0EsWUFBTUMsVUFBVSxHQUFHUixJQUFJLENBQUNLLGNBQUQsQ0FBdkI7RUFDQSxZQUFNSSxZQUFZLEdBQUdDLFlBQVksQ0FBQ04sZ0JBQUQsQ0FBakM7O0VBQ0EsWUFDRUMsY0FBYyxJQUNkQyxhQURBLElBRUFFLFVBRkEsSUFHQUcsaUJBSkYsRUFLRTtFQUNBLGNBQUk7RUFDRkMsWUFBQUEsZUFBZSxDQUFDL0QsTUFBRCxDQUFmLENBQXdCZ0Usa0JBQXhCLEVBQTRDQyxzQkFBNUM7RUFDRCxXQUZELENBRUUsT0FBTUMsS0FBTixFQUFhO0VBQ2hCO0VBQ0YsT0FmSDtFQWdCRDs7RUFDRCxXQUFPLElBQVA7RUFDRDs7RUFDREMsRUFBQUEsS0FBSyxHQUFHO0VBQ04sUUFBSS9CLEVBQUUsR0FBRyxLQUFLQyxHQUFkOztFQUNBLFlBQU9oRixTQUFTLENBQUNOLE1BQWpCO0VBQ0UsV0FBSyxDQUFMO0VBQ0UsWUFBSVUsVUFBVSxHQUFHSCxNQUFNLENBQUNTLE9BQVAsQ0FBZVYsU0FBUyxDQUFDLENBQUQsQ0FBeEIsQ0FBakI7O0VBQ0FJLFFBQUFBLFVBQVUsQ0FBQ08sT0FBWCxDQUFtQixXQUFrQjtFQUFBLGNBQWpCLENBQUNvRyxHQUFELEVBQU1DLEtBQU4sQ0FBaUI7RUFDbkNqQyxVQUFBQSxFQUFFLENBQUNnQyxHQUFELENBQUYsR0FBVUMsS0FBVjtFQUNELFNBRkQ7O0VBR0E7O0VBQ0YsV0FBSyxDQUFMO0VBQ0UsWUFBSUQsSUFBRyxHQUFHL0csU0FBUyxDQUFDLENBQUQsQ0FBbkI7RUFDQSxZQUFJZ0gsS0FBSyxHQUFHaEgsU0FBUyxDQUFDLENBQUQsQ0FBckI7RUFDQStFLFFBQUFBLEVBQUUsQ0FBQ2dDLElBQUQsQ0FBRixHQUFVQyxLQUFWO0VBQ0E7RUFYSjs7RUFhQSxTQUFLaEMsR0FBTCxHQUFXRCxFQUFYO0VBQ0EsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0RrQyxFQUFBQSxPQUFPLEdBQUc7RUFDUixZQUFPakgsU0FBUyxDQUFDTixNQUFqQjtFQUNFLFdBQUssQ0FBTDtFQUNFLGVBQU8sS0FBS3NGLEdBQVo7RUFDQTs7RUFDRixXQUFLLENBQUw7RUFDRSxZQUFJRCxFQUFFLEdBQUcsS0FBS0MsR0FBZDtFQUNBLFlBQUkrQixLQUFHLEdBQUcvRyxTQUFTLENBQUMsQ0FBRCxDQUFuQjtFQUNBLGVBQU8rRSxFQUFFLENBQUNnQyxLQUFELENBQVQ7RUFDQSxhQUFLL0IsR0FBTCxHQUFXRCxFQUFYO0VBQ0E7RUFUSjs7RUFXQSxXQUFPLElBQVA7RUFDRDs7RUFDRG1DLEVBQUFBLGVBQWUsQ0FBQ0gsR0FBRCxFQUFNQyxLQUFOLEVBQWE7RUFDMUIsUUFBRyxDQUFDLEtBQUtuRyxJQUFMLENBQVVrRyxHQUFWLENBQUosRUFBb0I7RUFDbEI5RyxNQUFBQSxNQUFNLENBQUNrSCxnQkFBUCxDQUF3QixLQUFLdEcsSUFBN0IsRUFBbUM7RUFDakMsU0FBQyxJQUFJOEUsTUFBSixDQUFXb0IsR0FBWCxDQUFELEdBQW1CO0VBQ2pCSyxVQUFBQSxZQUFZLEVBQUUsSUFERztFQUVqQkMsVUFBQUEsUUFBUSxFQUFFLElBRk87RUFHakJDLFVBQUFBLFVBQVUsRUFBRTtFQUhLLFNBRGM7RUFNakMsU0FBQ1AsR0FBRCxHQUFPO0VBQ0xLLFVBQUFBLFlBQVksRUFBRSxJQURUO0VBRUxFLFVBQUFBLFVBQVUsRUFBRSxJQUZQOztFQUdMQyxVQUFBQSxHQUFHLEdBQUc7RUFBRSxtQkFBTyxLQUFLLElBQUk1QixNQUFKLENBQVdvQixHQUFYLENBQUwsQ0FBUDtFQUE4QixXQUhqQzs7RUFJTG5DLFVBQUFBLEdBQUcsQ0FBQ29DLEtBQUQsRUFBUTtFQUFFLGlCQUFLLElBQUlyQixNQUFKLENBQVdvQixHQUFYLENBQUwsSUFBd0JDLEtBQXhCO0VBQStCOztFQUp2QztFQU4wQixPQUFuQztFQWFEOztFQUNELFNBQUtuRyxJQUFMLENBQVVrRyxHQUFWLElBQWlCQyxLQUFqQjtFQUNBLFNBQUs3RyxJQUFMLENBQVUsTUFBTXdGLE1BQU4sQ0FBYSxHQUFiLEVBQWtCb0IsR0FBbEIsQ0FBVixFQUFrQztFQUNoQ0EsTUFBQUEsR0FBRyxFQUFFQSxHQUQyQjtFQUVoQ0MsTUFBQUEsS0FBSyxFQUFFQTtFQUZ5QixLQUFsQyxFQUdHLElBSEg7RUFJQSxXQUFPLElBQVA7RUFDRDs7RUFDRFEsRUFBQUEsaUJBQWlCLENBQUNULEdBQUQsRUFBTTtFQUNyQixRQUFHLEtBQUtsRyxJQUFMLENBQVVrRyxHQUFWLENBQUgsRUFBbUI7RUFDakIsYUFBTyxLQUFLbEcsSUFBTCxDQUFVa0csR0FBVixDQUFQO0VBQ0Q7O0VBQ0QsU0FBSzVHLElBQUwsQ0FBVSxRQUFRd0YsTUFBUixDQUFlLEdBQWYsRUFBb0IzRixTQUFTLENBQUMsQ0FBRCxDQUE3QixDQUFWLEVBQTZDLElBQTdDO0VBQ0EsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0R1SCxFQUFBQSxHQUFHLEdBQUc7RUFDSixRQUFHdkgsU0FBUyxDQUFDLENBQUQsQ0FBWixFQUFpQixPQUFPLEtBQUthLElBQUwsQ0FBVWIsU0FBUyxDQUFDLENBQUQsQ0FBbkIsQ0FBUDtFQUNqQixXQUFPQyxNQUFNLENBQUNTLE9BQVAsQ0FBZSxLQUFLRyxJQUFwQixFQUNKZ0QsTUFESSxDQUNHLENBQUNZLEtBQUQsWUFBeUI7RUFBQSxVQUFqQixDQUFDc0MsR0FBRCxFQUFNQyxLQUFOLENBQWlCO0VBQy9CdkMsTUFBQUEsS0FBSyxDQUFDc0MsR0FBRCxDQUFMLEdBQWFDLEtBQWI7RUFDQSxhQUFPdkMsS0FBUDtFQUNELEtBSkksRUFJRixFQUpFLENBQVA7RUFLRDs7RUFDREcsRUFBQUEsR0FBRyxHQUFHO0VBQ0osUUFBRzVFLFNBQVMsQ0FBQ04sTUFBVixLQUFxQixDQUF4QixFQUEyQjtFQUN6QixXQUFLd0gsZUFBTCxDQUFxQmxILFNBQVMsQ0FBQyxDQUFELENBQTlCLEVBQW1DQSxTQUFTLENBQUMsQ0FBRCxDQUE1QztFQUNBLFVBQUcsS0FBSzZFLFlBQVIsRUFBc0IsS0FBS2lDLEtBQUwsQ0FBVzlHLFNBQVMsQ0FBQyxDQUFELENBQXBCLEVBQXlCQSxTQUFTLENBQUMsQ0FBRCxDQUFsQztFQUN2QixLQUhELE1BR08sSUFDTEEsU0FBUyxDQUFDTixNQUFWLEtBQXFCLENBQXJCLElBQ0EsQ0FBQ1csS0FBSyxDQUFDb0gsT0FBTixDQUFjekgsU0FBUyxDQUFDLENBQUQsQ0FBdkIsQ0FERCxJQUVBLE9BQU9BLFNBQVMsQ0FBQyxDQUFELENBQWhCLEtBQXdCLFFBSG5CLEVBSUw7RUFDQUMsTUFBQUEsTUFBTSxDQUFDUyxPQUFQLENBQWVWLFNBQVMsQ0FBQyxDQUFELENBQXhCLEVBQTZCVyxPQUE3QixDQUFxQyxXQUFrQjtFQUFBLFlBQWpCLENBQUNvRyxHQUFELEVBQU1DLEtBQU4sQ0FBaUI7RUFDckQsYUFBS0UsZUFBTCxDQUFxQkgsR0FBckIsRUFBMEJDLEtBQTFCO0VBQ0EsWUFBRyxLQUFLbkMsWUFBUixFQUFzQixLQUFLaUMsS0FBTCxDQUFXQyxHQUFYLEVBQWdCQyxLQUFoQjtFQUN2QixPQUhEO0VBSUQ7O0VBQ0QsU0FBSzdHLElBQUwsQ0FBVSxLQUFWLEVBQWlCLEtBQUtVLElBQXRCLEVBQTRCLElBQTVCO0VBQ0EsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0Q2RyxFQUFBQSxLQUFLLEdBQUc7RUFDTixRQUFHMUgsU0FBUyxDQUFDLENBQUQsQ0FBWixFQUFpQjtFQUNmLFdBQUt3SCxpQkFBTCxDQUF1QnhILFNBQVMsQ0FBQyxDQUFELENBQWhDO0VBQ0EsVUFBRyxLQUFLNkUsWUFBUixFQUFzQixLQUFLb0MsT0FBTCxDQUFhRixHQUFiO0VBQ3ZCLEtBSEQsTUFHTztFQUNMOUcsTUFBQUEsTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBS1csSUFBakIsRUFBdUJGLE9BQXZCLENBQWdDb0csR0FBRCxJQUFTO0VBQ3RDLGFBQUtTLGlCQUFMLENBQXVCVCxHQUF2QjtFQUNBLFlBQUcsS0FBS2xDLFlBQVIsRUFBc0IsS0FBS29DLE9BQUwsQ0FBYUYsR0FBYjtFQUN2QixPQUhEO0VBSUQ7O0VBQ0QsU0FBSzVHLElBQUwsQ0FBVSxPQUFWLEVBQW1CLElBQW5CO0VBQ0EsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0RtRixFQUFBQSxLQUFLLEdBQW1CO0VBQUEsUUFBbEJ6RSxJQUFrQix1RUFBWCxLQUFLQSxJQUFNO0VBQ3RCLFdBQU9aLE1BQU0sQ0FBQ1MsT0FBUCxDQUFlRyxJQUFmLEVBQXFCZ0QsTUFBckIsQ0FBNEIsQ0FBQ1ksS0FBRCxZQUF5QjtFQUFBLFVBQWpCLENBQUNzQyxHQUFELEVBQU1DLEtBQU4sQ0FBaUI7O0VBQzFELFVBQUdBLEtBQUssWUFBWTdDLEtBQXBCLEVBQTJCO0VBQ3pCTSxRQUFBQSxLQUFLLENBQUNzQyxHQUFELENBQUwsR0FBYUMsS0FBSyxDQUFDMUIsS0FBTixFQUFiO0VBQ0QsT0FGRCxNQUVPO0VBQ0xiLFFBQUFBLEtBQUssQ0FBQ3NDLEdBQUQsQ0FBTCxHQUFhQyxLQUFiO0VBQ0Q7O0VBQ0QsYUFBT3ZDLEtBQVA7RUFDRCxLQVBNLEVBT0osRUFQSSxDQUFQO0VBUUQ7O0VBak5nQyxDQUFuQzs7RUNDQSxNQUFNa0QsVUFBTixTQUF5QjFJLE1BQXpCLENBQWdDO0VBQzlCQyxFQUFBQSxXQUFXLEdBQThCO0VBQUEsUUFBN0JrRCxRQUE2Qix1RUFBbEIsRUFBa0I7RUFBQSxRQUFkRyxPQUFjLHVFQUFKLEVBQUk7RUFDdkMsVUFBTSxHQUFHdkMsU0FBVDtFQUNBLFNBQUtvQyxRQUFMLEdBQWdCQSxRQUFoQjtFQUNBLFNBQUtHLE9BQUwsR0FBZUEsT0FBZjtFQUNEOztFQUNELE1BQUlKLGFBQUosR0FBb0I7RUFBRSxXQUFPLENBQzNCLGFBRDJCLEVBRTNCLE9BRjJCLEVBRzNCLFVBSDJCLEVBSTNCLFVBSjJCLEVBSzNCLGVBTDJCLEVBTTNCLGtCQU4yQixDQUFQO0VBT25COztFQUNILE1BQUlpQywrQkFBSixHQUFzQztFQUFFLFdBQU8sQ0FDN0MsU0FENkMsQ0FBUDtFQUVyQzs7RUFDSCxNQUFJaEMsUUFBSixHQUFlO0VBQUUsV0FBTyxLQUFLQyxTQUFaO0VBQXVCOztFQUN4QyxNQUFJRCxRQUFKLENBQWFBLFFBQWIsRUFBdUI7RUFDckIsU0FBS0MsU0FBTCxHQUFpQkQsUUFBakI7RUFDQSxTQUFLRCxhQUFMLENBQW1CeEIsT0FBbkIsQ0FBNEIyQixZQUFELElBQWtCO0VBQzNDLFVBQUdGLFFBQVEsQ0FBQ0UsWUFBRCxDQUFYLEVBQTJCLEtBQUtBLFlBQUwsSUFBcUJGLFFBQVEsQ0FBQ0UsWUFBRCxDQUE3QjtFQUM1QixLQUZEO0VBR0EsU0FBSzhCLCtCQUFMLENBQ0d6RCxPQURILENBQ1kwRCw4QkFBRCxJQUFvQztFQUMzQyxXQUFLQyxZQUFMLENBQWtCRCw4QkFBbEIsRUFBa0QsSUFBbEQ7RUFDRCxLQUhIO0VBSUQ7O0VBQ0QsTUFBSTlCLE9BQUosR0FBYztFQUNaLFFBQUcsQ0FBQyxLQUFLQyxRQUFULEVBQW1CLEtBQUtBLFFBQUwsR0FBZ0IsRUFBaEI7RUFDbkIsV0FBTyxLQUFLQSxRQUFaO0VBQ0Q7O0VBQ0QsTUFBSUQsT0FBSixDQUFZQSxPQUFaLEVBQXFCO0VBQUUsU0FBS0MsUUFBTCxHQUFnQkQsT0FBaEI7RUFBeUI7O0VBQ2hELE1BQUk4QyxnQkFBSixHQUF1QjtFQUFFLFdBQU8sRUFBUDtFQUFXOztFQUNwQyxNQUFJdUMsa0JBQUosR0FBeUI7RUFBRSxXQUFPLEtBQVA7RUFBYzs7RUFDekMsTUFBSWxELFFBQUosR0FBZTtFQUFFLFdBQU8sS0FBS0MsU0FBWjtFQUF1Qjs7RUFDeEMsTUFBSUQsUUFBSixDQUFhQSxRQUFiLEVBQXVCO0VBQ3JCLFNBQUtDLFNBQUwsR0FBaUJELFFBQWpCO0VBQ0EsU0FBS21ELEdBQUwsQ0FBU25ELFFBQVQ7RUFDRDs7RUFDRCxNQUFJb0QsTUFBSixHQUFhO0VBQ1gsU0FBS0MsT0FBTCxHQUFlLEtBQUtBLE9BQUwsSUFBZ0IsS0FBSzFDLGdCQUFwQztFQUNBLFdBQU8sS0FBSzBDLE9BQVo7RUFDRDs7RUFDRCxNQUFJRCxNQUFKLENBQVdFLFVBQVgsRUFBdUI7RUFBRSxTQUFLRCxPQUFMLEdBQWVDLFVBQWY7RUFBMkI7O0VBQ3BELE1BQUlDLEtBQUosR0FBWTtFQUFFLFdBQU8sS0FBS0MsTUFBWjtFQUFvQjs7RUFDbEMsTUFBSUQsS0FBSixDQUFVQSxLQUFWLEVBQWlCO0VBQUUsU0FBS0MsTUFBTCxHQUFjRCxLQUFkO0VBQXFCOztFQUN4QyxNQUFJcEQsWUFBSixHQUFtQjtFQUFFLFdBQU8sS0FBS0MsYUFBWjtFQUEyQjs7RUFDaEQsTUFBSUQsWUFBSixDQUFpQkEsWUFBakIsRUFBK0I7RUFBRSxTQUFLQyxhQUFMLEdBQXFCRCxZQUFyQjtFQUFtQzs7RUFDcEUsTUFBSWhFLElBQUosR0FBVztFQUFFLFdBQU8sS0FBSzRELEtBQVo7RUFBbUI7O0VBQ2hDLE1BQUk1RCxJQUFKLEdBQVc7RUFDVCxXQUFPLEtBQUtrSCxPQUFMLENBQ0pJLEdBREksQ0FDQ0YsS0FBRCxJQUFXQSxLQUFLLENBQUMzQyxLQUFOLEVBRFgsQ0FBUDtFQUVEOztFQUNELE1BQUlQLEVBQUosR0FBUztFQUFFLFdBQU8sS0FBS0MsR0FBWjtFQUFpQjs7RUFDNUIsTUFBSUQsRUFBSixHQUFTO0VBQ1AsUUFBSUEsRUFBRSxHQUFHRixZQUFZLENBQUNJLE9BQWIsQ0FBcUIsS0FBS0osWUFBTCxDQUFrQkssUUFBdkMsS0FBb0RDLElBQUksQ0FBQ0MsU0FBTCxDQUFlLEtBQUtDLGdCQUFwQixDQUE3RDtFQUNBLFdBQU9GLElBQUksQ0FBQ0csS0FBTCxDQUFXUCxFQUFYLENBQVA7RUFDRDs7RUFDRCxNQUFJQSxFQUFKLENBQU9BLEVBQVAsRUFBVztFQUNUQSxJQUFBQSxFQUFFLEdBQUdJLElBQUksQ0FBQ0MsU0FBTCxDQUFlTCxFQUFmLENBQUw7RUFDQUYsSUFBQUEsWUFBWSxDQUFDVSxPQUFiLENBQXFCLEtBQUtWLFlBQUwsQ0FBa0JLLFFBQXZDLEVBQWlESCxFQUFqRDtFQUNEOztFQUNEUyxFQUFBQSxXQUFXLENBQUNDLFNBQUQsRUFBWTtFQUNyQixLQUNFLEtBREYsRUFFRSxJQUZGLEVBR0U5RSxPQUhGLENBR1dnQyxNQUFELElBQVk7RUFDcEIsV0FBSzJCLFlBQUwsQ0FBa0JtQixTQUFsQixFQUE2QjlDLE1BQTdCO0VBQ0QsS0FMRDtFQU1BLFdBQU8sSUFBUDtFQUNEOztFQUNEMkIsRUFBQUEsWUFBWSxDQUFDbUIsU0FBRCxFQUFZOUMsTUFBWixFQUFvQjtFQUM5QixRQUFNK0MsUUFBUSxHQUFHRCxTQUFTLENBQUNFLE1BQVYsQ0FBaUIsR0FBakIsQ0FBakI7RUFDQSxRQUFNQyxjQUFjLEdBQUdILFNBQVMsQ0FBQ0UsTUFBVixDQUFpQixRQUFqQixDQUF2QjtFQUNBLFFBQU1FLGlCQUFpQixHQUFHSixTQUFTLENBQUNFLE1BQVYsQ0FBaUIsV0FBakIsQ0FBMUI7RUFDQSxRQUFNRyxJQUFJLEdBQUcsS0FBS0osUUFBTCxDQUFiO0VBQ0EsUUFBTUssVUFBVSxHQUFHLEtBQUtILGNBQUwsQ0FBbkI7RUFDQSxRQUFNSSxhQUFhLEdBQUcsS0FBS0gsaUJBQUwsQ0FBdEI7O0VBQ0EsUUFDRUMsSUFBSSxJQUNKQyxVQURBLElBRUFDLGFBSEYsRUFJRTtFQUNBL0YsTUFBQUEsTUFBTSxDQUFDUyxPQUFQLENBQWVxRixVQUFmLEVBQ0dwRixPQURILENBQ1csVUFBdUM7RUFBQSxZQUF0QyxDQUFDc0YsYUFBRCxFQUFnQkMsZ0JBQWhCLENBQXNDO0VBQzlDLFlBQU0sQ0FBQ0MsY0FBRCxFQUFpQkMsYUFBakIsSUFBa0NILGFBQWEsQ0FBQ0ksS0FBZCxDQUFvQixHQUFwQixDQUF4QztFQUNBLFlBQU1DLFVBQVUsR0FBR1IsSUFBSSxDQUFDSyxjQUFELENBQXZCO0VBQ0EsWUFBTUksWUFBWSxHQUFHQyxZQUFZLENBQUNOLGdCQUFELENBQWpDOztFQUNBLFlBQ0VDLGNBQWMsSUFDZEMsYUFEQSxJQUVBRSxVQUZBLElBR0FHLGlCQUpGLEVBS0U7RUFDQSxjQUFJO0VBQ0ZDLFlBQUFBLGVBQWUsQ0FBQy9ELE1BQUQsQ0FBZixDQUF3QmdFLGtCQUF4QixFQUE0Q0Msc0JBQTVDO0VBQ0QsV0FGRCxDQUVFLE9BQU1DLEtBQU4sRUFBYTtFQUNoQjtFQUNGLE9BZkg7RUFnQkQ7O0VBQ0QsV0FBTyxJQUFQO0VBQ0Q7O0VBQ0R1QixFQUFBQSxhQUFhLENBQUNDLFNBQUQsRUFBWTtFQUN2QixRQUFJQyxVQUFKOztFQUNBLFNBQUtQLE9BQUwsQ0FDR1EsSUFESCxDQUNRLENBQUNMLE1BQUQsRUFBU00sV0FBVCxLQUF5QjtFQUM3QixVQUFHTixNQUFNLEtBQUssSUFBZCxFQUFvQjtFQUNsQixZQUNFQSxNQUFNLFlBQVkvRCxLQUFsQixJQUNBK0QsTUFBTSxDQUFDTyxLQUFQLEtBQWlCSixTQUZuQixFQUdFO0VBQ0FDLFVBQUFBLFVBQVUsR0FBR0UsV0FBYjtFQUNBLGlCQUFPTixNQUFQO0VBQ0Q7RUFDRjtFQUNGLEtBWEg7O0VBWUEsV0FBT0ksVUFBUDtFQUNEOztFQUNESSxFQUFBQSxrQkFBa0IsQ0FBQ0osVUFBRCxFQUFhO0VBQzdCLFFBQUlMLEtBQUssR0FBRyxLQUFLRixPQUFMLENBQWF4SCxNQUFiLENBQW9CK0gsVUFBcEIsRUFBZ0MsQ0FBaEMsRUFBbUMsSUFBbkMsQ0FBWjs7RUFDQSxTQUFLbkksSUFBTCxDQUNFLFFBREYsRUFFRSxFQUZGLEVBR0U4SCxLQUFLLENBQUMsQ0FBRCxDQUhQLEVBSUUsSUFKRjtFQU1BLFdBQU8sSUFBUDtFQUNEOztFQUNEVSxFQUFBQSxRQUFRLENBQUNDLFNBQUQsRUFBWTtFQUNsQixRQUFJWCxLQUFKO0VBQ0EsUUFBSVksU0FBUyxHQUFHLElBQUkxRSxLQUFKLEVBQWhCOztFQUNBLFFBQUd5RSxTQUFTLFlBQVl6RSxLQUF4QixFQUErQjtFQUM3QjhELE1BQUFBLEtBQUssR0FBR1csU0FBUjtFQUNELEtBRkQsTUFFTyxJQUNMLEtBQUtYLEtBREEsRUFFTDtFQUNBQSxNQUFBQSxLQUFLLEdBQUcsSUFBSSxLQUFLQSxLQUFULEVBQVI7RUFDQUEsTUFBQUEsS0FBSyxDQUFDckQsR0FBTixDQUFVZ0UsU0FBVjtFQUNELEtBTE0sTUFLQTtFQUNMWCxNQUFBQSxLQUFLLEdBQUcsSUFBSTlELEtBQUosRUFBUjtFQUNBOEQsTUFBQUEsS0FBSyxDQUFDckQsR0FBTixDQUFVZ0UsU0FBVjtFQUNEOztFQUNEWCxJQUFBQSxLQUFLLENBQUNwSixFQUFOLENBQ0UsS0FERixFQUVFLENBQUNpSyxLQUFELEVBQVFaLE1BQVIsS0FBbUI7RUFDakIsV0FBSy9ILElBQUwsQ0FDRSxRQURGLEVBRUUsS0FBS21GLEtBQUwsRUFGRixFQUdFLElBSEY7RUFLRCxLQVJIO0VBVUEsU0FBS3dDLE1BQUwsQ0FBWS9ILElBQVosQ0FBaUJrSSxLQUFqQjtFQUNBLFNBQUs5SCxJQUFMLENBQ0UsS0FERixFQUVFOEgsS0FBSyxDQUFDM0MsS0FBTixFQUZGLEVBR0UyQyxLQUhGLEVBSUUsSUFKRjtFQU1BLFdBQU8sSUFBUDtFQUNEOztFQUNESixFQUFBQSxHQUFHLENBQUNlLFNBQUQsRUFBWTtFQUNiLFFBQUd2SSxLQUFLLENBQUNvSCxPQUFOLENBQWNtQixTQUFkLENBQUgsRUFBNkI7RUFDM0JBLE1BQUFBLFNBQVMsQ0FDTmpJLE9BREgsQ0FDWXNILEtBQUQsSUFBVztFQUNsQixhQUFLVSxRQUFMLENBQWNWLEtBQWQ7RUFDRCxPQUhIO0VBSUQsS0FMRCxNQUtPO0VBQ0wsV0FBS1UsUUFBTCxDQUFjQyxTQUFkO0VBQ0Q7O0VBQ0QsUUFBRyxLQUFLL0QsWUFBUixFQUFzQixLQUFLRSxFQUFMLEdBQVUsS0FBS2xFLElBQWY7RUFDdEIsU0FBS1YsSUFBTCxDQUNFLFFBREYsRUFFRSxLQUFLbUYsS0FBTCxFQUZGLEVBR0UsSUFIRjtFQUtBLFdBQU8sSUFBUDtFQUNEOztFQUNEeUQsRUFBQUEsTUFBTSxDQUFDSCxTQUFELEVBQVk7RUFDaEIsUUFDRSxDQUFDdkksS0FBSyxDQUFDb0gsT0FBTixDQUFjbUIsU0FBZCxDQURILEVBRUU7RUFDQSxVQUFJTixVQUFVLEdBQUcsS0FBS0YsYUFBTCxDQUFtQlEsU0FBUyxDQUFDSCxLQUE3QixDQUFqQjtFQUNBLFdBQUtDLGtCQUFMLENBQXdCSixVQUF4QjtFQUNELEtBTEQsTUFLTyxJQUFHakksS0FBSyxDQUFDb0gsT0FBTixDQUFjbUIsU0FBZCxDQUFILEVBQTZCO0VBQ2xDQSxNQUFBQSxTQUFTLENBQ05qSSxPQURILENBQ1lzSCxLQUFELElBQVc7RUFDbEIsWUFBSUssVUFBVSxHQUFHLEtBQUtGLGFBQUwsQ0FBbUJILEtBQUssQ0FBQ1EsS0FBekIsQ0FBakI7RUFDQSxhQUFLQyxrQkFBTCxDQUF3QkosVUFBeEI7RUFDRCxPQUpIO0VBS0Q7O0VBQ0QsU0FBS1IsTUFBTCxHQUFjLEtBQUtBLE1BQUwsQ0FDWGtCLE1BRFcsQ0FDSGYsS0FBRCxJQUFXQSxLQUFLLEtBQUssSUFEakIsQ0FBZDtFQUVBLFFBQUcsS0FBS25ELGFBQVIsRUFBdUIsS0FBS0MsRUFBTCxHQUFVLEtBQUtsRSxJQUFmO0VBRXZCLFNBQUtWLElBQUwsQ0FDRSxRQURGLEVBRUUsS0FBS21GLEtBQUwsRUFGRixFQUdFLElBSEY7RUFLQSxXQUFPLElBQVA7RUFDRDs7RUFDRDJELEVBQUFBLEtBQUssR0FBRztFQUNOLFNBQUtGLE1BQUwsQ0FBWSxLQUFLaEIsT0FBakI7RUFDQSxXQUFPLElBQVA7RUFDRDs7RUFDRHpDLEVBQUFBLEtBQUssQ0FBQ3pFLElBQUQsRUFBTztFQUNWQSxJQUFBQSxJQUFJLEdBQUdBLElBQUksSUFBSSxLQUFLQSxJQUFiLElBQXFCLEtBQUt3RSxnQkFBakM7RUFDQSxXQUFPRixJQUFJLENBQUNHLEtBQUwsQ0FBV0gsSUFBSSxDQUFDQyxTQUFMLENBQWV2RSxJQUFmLENBQVgsQ0FBUDtFQUNEOztFQWxONkI7O0VDRGhDLE1BQU1xSSxJQUFOLFNBQW1CakssTUFBbkIsQ0FBMEI7RUFDeEJDLEVBQUFBLFdBQVcsR0FBOEI7RUFBQSxRQUE3QmtELFFBQTZCLHVFQUFsQixFQUFrQjtFQUFBLFFBQWRHLE9BQWMsdUVBQUosRUFBSTtFQUN2QztFQUNBLFNBQUtILFFBQUwsR0FBZ0JBLFFBQWhCO0VBQ0EsU0FBS0csT0FBTCxHQUFlQSxPQUFmO0VBQ0Q7O0VBQ0QsTUFBSUosYUFBSixHQUFvQjtFQUFFLFdBQU8sQ0FDM0IsWUFEMkIsRUFFM0IsYUFGMkIsRUFHM0IsU0FIMkIsRUFJM0IsUUFKMkIsRUFLM0IsVUFMMkIsRUFNM0IsWUFOMkIsRUFPM0IsaUJBUDJCLEVBUTNCLG9CQVIyQixFQVMzQixRQVQyQixDQUFQO0VBVW5COztFQUNILE1BQUlDLFFBQUosR0FBZTtFQUFFLFdBQU8sS0FBS0MsU0FBWjtFQUF1Qjs7RUFDeEMsTUFBSUQsUUFBSixDQUFhQSxRQUFiLEVBQXVCO0VBQ3JCLFNBQUtDLFNBQUwsR0FBaUJELFFBQWpCO0VBQ0EsU0FBS0QsYUFBTCxDQUFtQnhCLE9BQW5CLENBQTRCMkIsWUFBRCxJQUFrQjtFQUMzQyxVQUFHRixRQUFRLENBQUNFLFlBQUQsQ0FBWCxFQUEyQixLQUFLQSxZQUFMLElBQXFCRixRQUFRLENBQUNFLFlBQUQsQ0FBN0I7RUFDNUIsS0FGRDtFQUdEOztFQUNELE1BQUlDLE9BQUosR0FBYztFQUNaLFFBQUcsQ0FBQyxLQUFLQyxRQUFULEVBQW1CLEtBQUtBLFFBQUwsR0FBZ0IsRUFBaEI7RUFDbkIsV0FBTyxLQUFLQSxRQUFaO0VBQ0Q7O0VBQ0QsTUFBSUQsT0FBSixDQUFZQSxPQUFaLEVBQXFCO0VBQUUsU0FBS0MsUUFBTCxHQUFnQkQsT0FBaEI7RUFBeUI7O0VBQ2hELE1BQUk0RyxXQUFKLEdBQWtCO0VBQUUsV0FBTyxLQUFLQyxZQUFaO0VBQTBCOztFQUM5QyxNQUFJRCxXQUFKLENBQWdCQSxXQUFoQixFQUE2QjtFQUFFLFNBQUtDLFlBQUwsR0FBb0JELFdBQXBCO0VBQWlDOztFQUNoRSxNQUFJRSxPQUFKLEdBQWM7RUFDWixRQUFHLENBQUMsS0FBS0MsUUFBVCxFQUFtQjtFQUNqQixXQUFLQSxRQUFMLEdBQWdCQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsS0FBS0wsV0FBNUIsQ0FBaEI7RUFDQWxKLE1BQUFBLE1BQU0sQ0FBQ1MsT0FBUCxDQUFlLEtBQUsrSSxVQUFwQixFQUFnQzlJLE9BQWhDLENBQXdDLFVBQW9DO0VBQUEsWUFBbkMsQ0FBQytJLFlBQUQsRUFBZUMsY0FBZixDQUFtQzs7RUFDMUUsYUFBS0wsUUFBTCxDQUFjTSxZQUFkLENBQTJCRixZQUEzQixFQUF5Q0MsY0FBekM7RUFDRCxPQUZEO0VBR0EsV0FBS0UsZUFBTCxDQUFxQkMsT0FBckIsQ0FBNkIsS0FBS1QsT0FBbEMsRUFBMkM7RUFDekNVLFFBQUFBLE9BQU8sRUFBRSxJQURnQztFQUV6Q0MsUUFBQUEsU0FBUyxFQUFFO0VBRjhCLE9BQTNDO0VBSUQ7O0VBQ0QsV0FBTyxLQUFLVixRQUFaO0VBQ0Q7O0VBQ0QsTUFBSU8sZUFBSixHQUFzQjtFQUNwQixTQUFLSSxnQkFBTCxHQUF3QixLQUFLQSxnQkFBTCxJQUF5QixJQUFJQyxnQkFBSixDQUMvQyxLQUFLQyxjQUFMLENBQW9CQyxJQUFwQixDQUF5QixJQUF6QixDQUQrQyxDQUFqRDtFQUdBLFdBQU8sS0FBS0gsZ0JBQVo7RUFDRDs7RUFDRCxNQUFJWixPQUFKLENBQVlBLE9BQVosRUFBcUI7RUFDbkIsUUFBR0EsT0FBTyxZQUFZZ0IsV0FBdEIsRUFBbUMsS0FBS2YsUUFBTCxHQUFnQkQsT0FBaEI7RUFDcEM7O0VBQ0QsTUFBSUksVUFBSixHQUFpQjtFQUFFLFdBQU8sS0FBS2EsV0FBTCxJQUFvQixFQUEzQjtFQUErQjs7RUFDbEQsTUFBSWIsVUFBSixDQUFlQSxVQUFmLEVBQTJCO0VBQUUsU0FBS2EsV0FBTCxHQUFtQmIsVUFBbkI7RUFBK0I7O0VBQzVELE1BQUljLFFBQUosR0FBZTtFQUFFLFdBQU8sS0FBS0MsU0FBWjtFQUF1Qjs7RUFDeEMsTUFBSUQsUUFBSixDQUFhQSxRQUFiLEVBQXVCO0VBQUUsU0FBS0MsU0FBTCxHQUFpQkQsUUFBakI7RUFBMkI7O0VBQ3BELE1BQUlFLFVBQUosR0FBaUI7RUFBRSxXQUFPLEtBQUtDLFdBQUwsSUFBb0IsRUFBM0I7RUFBK0I7O0VBQ2xELE1BQUlELFVBQUosQ0FBZUEsVUFBZixFQUEyQjtFQUN6QixTQUFLQyxXQUFMLEdBQW1CRCxVQUFuQjtFQUNBLFNBQUtuRyxZQUFMO0VBQ0Q7O0VBQ0QsTUFBSXFHLGVBQUosR0FBc0I7RUFBRSxXQUFPLEtBQUtDLGdCQUFMLElBQXlCLEVBQWhDO0VBQW9DOztFQUM1RCxNQUFJRCxlQUFKLENBQW9CQSxlQUFwQixFQUFxQztFQUNuQyxTQUFLQyxnQkFBTCxHQUF3QkQsZUFBeEI7RUFDQSxTQUFLckcsWUFBTDtFQUNEOztFQUNELE1BQUl1RyxrQkFBSixHQUF5QjtFQUFFLFdBQU8sS0FBS0MsbUJBQUwsSUFBNEIsRUFBbkM7RUFBdUM7O0VBQ2xFLE1BQUlELGtCQUFKLENBQXVCQSxrQkFBdkIsRUFBMkM7RUFDekMsU0FBS0MsbUJBQUwsR0FBMkJELGtCQUEzQjtFQUNBLFNBQUt2RyxZQUFMO0VBQ0Q7O0VBQ0QsTUFBSXlHLEVBQUosR0FBUztFQUNQLFFBQU1DLE9BQU8sR0FBRyxJQUFoQjs7RUFDQSxRQUFHLENBQUMsS0FBS0MsR0FBVCxFQUFjO0VBQ1osV0FBS0EsR0FBTCxHQUFXaEwsTUFBTSxDQUFDUyxPQUFQLENBQWUsS0FBSytKLFVBQXBCLEVBQWdDNUcsTUFBaEMsQ0FBdUMsQ0FBQ29ILEdBQUQsWUFBeUM7RUFBQSxZQUFwQyxDQUFDQyxhQUFELEVBQWdCQyxjQUFoQixDQUFvQztFQUN6RmxMLFFBQUFBLE1BQU0sQ0FBQ2tILGdCQUFQLENBQXdCOEQsR0FBeEIsRUFBNkI7RUFDM0IsV0FBQ0MsYUFBRCxHQUFpQjtFQUNmM0QsWUFBQUEsR0FBRyxHQUFHO0VBQ0osa0JBQUcsT0FBTzRELGNBQVAsS0FBMEIsUUFBN0IsRUFBdUM7RUFDckMsb0JBQUlDLFlBQVksR0FBR0osT0FBTyxDQUFDM0IsT0FBUixDQUFnQmdDLGdCQUFoQixDQUFpQ0YsY0FBakMsQ0FBbkI7RUFDQSx1QkFBUUMsWUFBWSxDQUFDMUwsTUFBYixHQUFzQixDQUF2QixHQUE0QjBMLFlBQTVCLEdBQTJDQSxZQUFZLENBQUNFLElBQWIsQ0FBa0IsQ0FBbEIsQ0FBbEQ7RUFDRCxlQUhELE1BR08sSUFDTEgsY0FBYyxZQUFZZCxXQUExQixJQUNBYyxjQUFjLFlBQVlJLFFBRDFCLElBRUFKLGNBQWMsWUFBWUssTUFIckIsRUFJTDtFQUNBLHVCQUFPTCxjQUFQO0VBQ0Q7RUFDRjs7RUFaYztFQURVLFNBQTdCO0VBZ0JBLGVBQU9GLEdBQVA7RUFDRCxPQWxCVSxFQWtCUixFQWxCUSxDQUFYO0VBbUJBaEwsTUFBQUEsTUFBTSxDQUFDa0gsZ0JBQVAsQ0FBd0IsS0FBSzhELEdBQTdCLEVBQWtDO0VBQ2hDLG9CQUFZO0VBQ1YxRCxVQUFBQSxHQUFHLEdBQUc7RUFBRSxtQkFBT3lELE9BQU8sQ0FBQzNCLE9BQWY7RUFBd0I7O0VBRHRCO0VBRG9CLE9BQWxDO0VBS0Q7O0VBQ0QsV0FBTyxLQUFLNEIsR0FBWjtFQUNEOztFQUNEZCxFQUFBQSxjQUFjLENBQUNzQixrQkFBRCxFQUFxQkMsUUFBckIsRUFBK0I7RUFBQTs7RUFBQSwrQkFDbENDLG1CQURrQyxFQUNiQyxjQURhO0VBRXpDLGNBQU9BLGNBQWMsQ0FBQ0MsSUFBdEI7RUFDRSxhQUFLLFdBQUw7RUFDRSxjQUFHRCxjQUFjLENBQUNFLFVBQWYsQ0FBMEJwTSxNQUE3QixFQUFxQztFQUNuQ08sWUFBQUEsTUFBTSxDQUFDUyxPQUFQLENBQWVULE1BQU0sQ0FBQzhMLHlCQUFQLENBQWlDLEtBQUksQ0FBQ2hCLEVBQXRDLENBQWYsRUFDQ3BLLE9BREQsQ0FDUyxXQUFzQjtFQUFBLGtCQUFyQixDQUFDcUwsS0FBRCxFQUFRQyxPQUFSLENBQXFCO0VBQzdCLGtCQUFNQyxVQUFVLEdBQUdELE9BQU8sQ0FBQzFFLEdBQVIsRUFBbkI7RUFDQSxrQkFBTTRFLGNBQWMsR0FBRzlMLEtBQUssQ0FBQ0MsSUFBTixDQUFXc0wsY0FBYyxDQUFDRSxVQUExQixFQUFzQ3ZELElBQXRDLENBQTRDNkQsU0FBRCxJQUFlQSxTQUFTLEtBQUtGLFVBQXhFLENBQXZCOztFQUNBLGtCQUFHQyxjQUFILEVBQW1CO0VBQ2pCLGdCQUFBLEtBQUksQ0FBQzdILFlBQUwsQ0FBa0IwSCxLQUFsQjtFQUNEO0VBQ0YsYUFQRDtFQVFEOztFQUNEO0VBWko7RUFGeUM7O0VBQzNDLFNBQUksSUFBSSxDQUFDTCxtQkFBRCxFQUFzQkMsY0FBdEIsQ0FBUixJQUFpRDNMLE1BQU0sQ0FBQ1MsT0FBUCxDQUFlK0ssa0JBQWYsQ0FBakQsRUFBcUY7RUFBQSxZQUE1RUUsbUJBQTRFLEVBQXZEQyxjQUF1RDtFQWVwRjtFQUNGOztFQUNEUyxFQUFBQSxrQkFBa0IsQ0FBQ2hELE9BQUQsRUFBVTFHLE1BQVYsRUFBa0JyRCxTQUFsQixFQUE2Qk8saUJBQTdCLEVBQWdEO0VBQ2hFLFFBQUk7RUFDRixjQUFPOEMsTUFBUDtFQUNFLGFBQUssa0JBQUw7RUFDRSxlQUFLa0ksa0JBQUwsQ0FBd0JoTCxpQkFBeEIsSUFBNkMsS0FBS2dMLGtCQUFMLENBQXdCaEwsaUJBQXhCLEVBQTJDdUssSUFBM0MsQ0FBZ0QsSUFBaEQsQ0FBN0M7RUFDQWYsVUFBQUEsT0FBTyxDQUFDMUcsTUFBRCxDQUFQLENBQWdCckQsU0FBaEIsRUFBMkIsS0FBS3VMLGtCQUFMLENBQXdCaEwsaUJBQXhCLENBQTNCO0VBQ0E7O0VBQ0YsYUFBSyxxQkFBTDtFQUNFd0osVUFBQUEsT0FBTyxDQUFDMUcsTUFBRCxDQUFQLENBQWdCckQsU0FBaEIsRUFBMkIsS0FBS3VMLGtCQUFMLENBQXdCaEwsaUJBQXhCLENBQTNCO0VBQ0E7RUFQSjtFQVNELEtBVkQsQ0FVRSxPQUFNZ0gsS0FBTixFQUFhO0VBQ2hCOztFQUNEdkMsRUFBQUEsWUFBWSxHQUE2QjtFQUFBLFFBQTVCZ0ksbUJBQTRCLHVFQUFOLElBQU07RUFDdkMsU0FBS0MsVUFBTCxHQUFrQixJQUFsQjtFQUNBLFFBQU14QixFQUFFLEdBQUcsS0FBS0EsRUFBaEI7RUFDQSxRQUFNeUIsZ0JBQWdCLEdBQUcsQ0FBQyxxQkFBRCxFQUF3QixrQkFBeEIsQ0FBekI7O0VBQ0EsUUFBRyxDQUFDRixtQkFBSixFQUF5QjtFQUN2QkUsTUFBQUEsZ0JBQWdCLENBQUM3TCxPQUFqQixDQUEwQjhMLGVBQUQsSUFBcUI7RUFDNUN4TSxRQUFBQSxNQUFNLENBQUNTLE9BQVAsQ0FBZSxLQUFLaUssZUFBcEIsRUFBcUNoSyxPQUFyQyxDQUE2QyxXQUEwRDtFQUFBLGNBQXpELENBQUMrTCxzQkFBRCxFQUF5QkMsMEJBQXpCLENBQXlEO0VBQ3JHLGNBQUksQ0FBQ3pCLGFBQUQsRUFBZ0IwQixrQkFBaEIsSUFBc0NGLHNCQUFzQixDQUFDckcsS0FBdkIsQ0FBNkIsR0FBN0IsQ0FBMUM7O0VBQ0EsY0FBRzBFLEVBQUUsQ0FBQ0csYUFBRCxDQUFGLFlBQTZCMkIsUUFBaEMsRUFBMEM7RUFDeEM5QixZQUFBQSxFQUFFLENBQUNHLGFBQUQsQ0FBRixDQUFrQnZLLE9BQWxCLENBQTJCbU0sU0FBRCxJQUFlO0VBQ3ZDLG1CQUFLVCxrQkFBTCxDQUF3QlMsU0FBeEIsRUFBbUNMLGVBQW5DLEVBQW9ERyxrQkFBcEQsRUFBd0VELDBCQUF4RTtFQUNELGFBRkQ7RUFHRCxXQUpELE1BSU8sSUFDTDVCLEVBQUUsQ0FBQ0csYUFBRCxDQUFGLFlBQTZCYixXQUE3QixJQUNBVSxFQUFFLENBQUNHLGFBQUQsQ0FBRixZQUE2QkssUUFEN0IsSUFFQVIsRUFBRSxDQUFDRyxhQUFELENBQUYsWUFBNkJNLE1BSHhCLEVBSUw7RUFDQSxpQkFBS2Esa0JBQUwsQ0FBd0J0QixFQUFFLENBQUNHLGFBQUQsQ0FBMUIsRUFBMkN1QixlQUEzQyxFQUE0REcsa0JBQTVELEVBQWdGRCwwQkFBaEY7RUFDRDtFQUNGLFNBYkQ7RUFjRCxPQWZEO0VBZ0JELEtBakJELE1BaUJPO0VBQ0xILE1BQUFBLGdCQUFnQixDQUFDN0wsT0FBakIsQ0FBMEI4TCxlQUFELElBQXFCO0VBQzVDLFlBQU05QixlQUFlLEdBQUcxSyxNQUFNLENBQUNTLE9BQVAsQ0FBZSxLQUFLaUssZUFBcEIsRUFBcUNoSyxPQUFyQyxDQUE2QyxXQUEwRDtFQUFBLGNBQXpELENBQUMrTCxzQkFBRCxFQUF5QkMsMEJBQXpCLENBQXlEO0VBQzdILGNBQUksQ0FBQ3pCLGFBQUQsRUFBZ0IwQixrQkFBaEIsSUFBc0NGLHNCQUFzQixDQUFDckcsS0FBdkIsQ0FBNkIsR0FBN0IsQ0FBMUM7O0VBQ0EsY0FBR2lHLG1CQUFtQixLQUFLcEIsYUFBM0IsRUFBMEM7RUFDeEMsZ0JBQUdILEVBQUUsQ0FBQ0csYUFBRCxDQUFGLFlBQTZCMkIsUUFBaEMsRUFBMEM7RUFDeEM5QixjQUFBQSxFQUFFLENBQUNHLGFBQUQsQ0FBRixDQUFrQnZLLE9BQWxCLENBQTJCbU0sU0FBRCxJQUFlO0VBQ3ZDLHFCQUFLVCxrQkFBTCxDQUF3QlMsU0FBeEIsRUFBbUNMLGVBQW5DLEVBQW9ERyxrQkFBcEQsRUFBd0VELDBCQUF4RTtFQUNELGVBRkQ7RUFHRCxhQUpELE1BSU8sSUFBRzVCLEVBQUUsQ0FBQ0csYUFBRCxDQUFGLFlBQTZCYixXQUFoQyxFQUE2QztFQUNsRCxtQkFBS2dDLGtCQUFMLENBQXdCdEIsRUFBRSxDQUFDRyxhQUFELENBQTFCLEVBQTJDdUIsZUFBM0MsRUFBNERHLGtCQUE1RCxFQUFnRkQsMEJBQWhGO0VBQ0Q7RUFDRjtFQUNGLFNBWHVCLENBQXhCO0VBWUQsT0FiRDtFQWNEOztFQUNELFNBQUtKLFVBQUwsR0FBa0IsS0FBbEI7RUFDQSxXQUFPLElBQVA7RUFDRDs7RUFDRFEsRUFBQUEsVUFBVSxHQUFHO0VBQ1gsUUFBRyxLQUFLQyxNQUFSLEVBQWdCO0VBQ2QsVUFBTUMsTUFBTSxHQUFHLEtBQUtELE1BQUwsQ0FBWUMsTUFBM0I7RUFDQSxVQUFNdEssTUFBTSxHQUFHLEtBQUtxSyxNQUFMLENBQVlySyxNQUEzQjtFQUNBc0ssTUFBQUEsTUFBTSxDQUFDQyxxQkFBUCxDQUE2QnZLLE1BQTdCLEVBQXFDLEtBQUswRyxPQUExQztFQUNEOztFQUNELFdBQU8sSUFBUDtFQUNEOztFQUNEOEQsRUFBQUEsVUFBVSxHQUFHO0VBQ1gsUUFBRyxLQUFLOUQsT0FBTCxDQUFhNEQsTUFBaEIsRUFBd0I7RUFDdEIsV0FBSzVELE9BQUwsQ0FBYTRELE1BQWIsQ0FBb0JHLFdBQXBCLENBQWdDLEtBQUsvRCxPQUFyQztFQUNEOztFQUNELFdBQU8sSUFBUDtFQUNEOztFQUNEZ0UsRUFBQUEsTUFBTSxHQUFZO0VBQUEsUUFBWHhNLElBQVcsdUVBQUosRUFBSTs7RUFDaEIsUUFBRyxLQUFLMEosUUFBUixFQUFrQjtFQUNoQixVQUFNQSxRQUFRLEdBQUcsS0FBS0EsUUFBTCxDQUFjMUosSUFBZCxDQUFqQjtFQUNBLFdBQUt3SSxPQUFMLENBQWFpRSxTQUFiLEdBQXlCL0MsUUFBekI7RUFDQSxXQUFLdEIsS0FBTDtFQUNEOztFQUNELFNBQUszRSxZQUFMO0VBQ0EsV0FBTyxJQUFQO0VBQ0Q7O0VBbk11Qjs7RUNBMUIsSUFBTWlKLFVBQVUsR0FBRyxjQUFjdE8sTUFBZCxDQUFxQjtFQUN0Q0MsRUFBQUEsV0FBVyxHQUE4QjtFQUFBLFFBQTdCa0QsUUFBNkIsdUVBQWxCLEVBQWtCO0VBQUEsUUFBZEcsT0FBYyx1RUFBSixFQUFJO0VBQ3ZDO0VBQ0EsU0FBS0gsUUFBTCxHQUFnQkEsUUFBaEI7RUFDQSxTQUFLRyxPQUFMLEdBQWVBLE9BQWY7RUFDRDs7RUFDRCxNQUFJSixhQUFKLEdBQW9CO0VBQUUsV0FBTyxDQUMzQixRQUQyQixFQUUzQixhQUYyQixFQUczQixnQkFIMkIsRUFJM0IsYUFKMkIsRUFLM0Isa0JBTDJCLEVBTTNCLHFCQU4yQixFQU8zQixPQVAyQixFQVEzQixZQVIyQixFQVMzQixlQVQyQixFQVUzQixhQVYyQixFQVczQixrQkFYMkIsRUFZM0IscUJBWjJCLEVBYTNCLFNBYjJCLEVBYzNCLGNBZDJCLEVBZTNCLGlCQWYyQixDQUFQO0VBZ0JuQjs7RUFDSCxNQUFJaUMsK0JBQUosR0FBc0M7RUFBRSxXQUFPLENBQzdDLE9BRDZDLEVBRTdDLE1BRjZDLEVBRzdDLFlBSDZDLEVBSTdDLFFBSjZDLENBQVA7RUFLckM7O0VBQ0gsTUFBSTdCLE9BQUosR0FBYztFQUNaLFFBQUcsQ0FBQyxLQUFLQyxRQUFULEVBQW1CLEtBQUtBLFFBQUwsR0FBZ0IsRUFBaEI7RUFDbkIsV0FBTyxLQUFLQSxRQUFaO0VBQ0Q7O0VBQ0QsTUFBSUQsT0FBSixDQUFZQSxPQUFaLEVBQXFCO0VBQUUsU0FBS0MsUUFBTCxHQUFnQkQsT0FBaEI7RUFBeUI7O0VBQ2hELE1BQUlILFFBQUosR0FBZTtFQUNiLFFBQUcsQ0FBQyxLQUFLQyxTQUFULEVBQW9CLEtBQUtBLFNBQUwsR0FBaUIsRUFBakI7RUFDcEIsV0FBTyxLQUFLQSxTQUFaO0VBQ0Q7O0VBQ0QsTUFBSUQsUUFBSixDQUFhQSxRQUFiLEVBQXVCO0VBQ3JCLFNBQUtDLFNBQUwsR0FBaUJELFFBQWpCO0VBQ0EsU0FBS0QsYUFBTCxDQUNHeEIsT0FESCxDQUNZMkIsWUFBRCxJQUFrQjtFQUN6QixVQUFHLEtBQUtGLFFBQUwsQ0FBY0UsWUFBZCxDQUFILEVBQWdDO0VBQzlCckMsUUFBQUEsTUFBTSxDQUFDa0gsZ0JBQVAsQ0FDRSxJQURGLEVBRUU7RUFDRSxXQUFDLElBQUl4QixNQUFKLENBQVdyRCxZQUFYLENBQUQsR0FBNEI7RUFDMUI4RSxZQUFBQSxZQUFZLEVBQUUsSUFEWTtFQUUxQkMsWUFBQUEsUUFBUSxFQUFFLElBRmdCO0VBRzFCbUcsWUFBQUEsV0FBVyxFQUFFO0VBSGEsV0FEOUI7RUFNRSxXQUFDbEwsWUFBRCxHQUFnQjtFQUNkOEUsWUFBQUEsWUFBWSxFQUFFLElBREE7RUFFZEUsWUFBQUEsVUFBVSxFQUFFLElBRkU7O0VBR2RDLFlBQUFBLEdBQUcsR0FBRztFQUFFLHFCQUFPLEtBQUssSUFBSTVCLE1BQUosQ0FBV3JELFlBQVgsQ0FBTCxDQUFQO0VBQXVDLGFBSGpDOztFQUlkc0MsWUFBQUEsR0FBRyxDQUFDb0MsS0FBRCxFQUFRO0VBQUUsbUJBQUssSUFBSXJCLE1BQUosQ0FBV3JELFlBQVgsQ0FBTCxJQUFpQzBFLEtBQWpDO0VBQXdDOztFQUp2QztFQU5sQixTQUZGO0VBZ0JBLGFBQUsxRSxZQUFMLElBQXFCLEtBQUtGLFFBQUwsQ0FBY0UsWUFBZCxDQUFyQjtFQUNEO0VBQ0YsS0FyQkg7RUFzQkEsU0FBSzhCLCtCQUFMLENBQ0d6RCxPQURILENBQ1kwRCw4QkFBRCxJQUFvQztFQUMzQyxXQUFLQyxZQUFMLENBQWtCRCw4QkFBbEIsRUFBa0QsSUFBbEQ7RUFDRCxLQUhIO0VBSUQ7O0VBQ0RtQixFQUFBQSxXQUFXLENBQUNDLFNBQUQsRUFBWTtFQUNyQixLQUNFLEtBREYsRUFFRSxJQUZGLEVBR0U5RSxPQUhGLENBR1dnQyxNQUFELElBQVk7RUFDcEIsV0FBSzJCLFlBQUwsQ0FBa0JtQixTQUFsQixFQUE2QjlDLE1BQTdCO0VBQ0QsS0FMRDtFQU1BLFdBQU8sSUFBUDtFQUNEOztFQUNEMkIsRUFBQUEsWUFBWSxDQUFDbUIsU0FBRCxFQUFZOUMsTUFBWixFQUFvQjtFQUM5QixRQUFNK0MsUUFBUSxHQUFHRCxTQUFTLENBQUNFLE1BQVYsQ0FBaUIsR0FBakIsQ0FBakI7RUFDQSxRQUFNQyxjQUFjLEdBQUdILFNBQVMsQ0FBQ0UsTUFBVixDQUFpQixRQUFqQixDQUF2QjtFQUNBLFFBQU1FLGlCQUFpQixHQUFHSixTQUFTLENBQUNFLE1BQVYsQ0FBaUIsV0FBakIsQ0FBMUI7RUFDQSxRQUFNRyxJQUFJLEdBQUcsS0FBS0osUUFBTCxDQUFiO0VBQ0EsUUFBTUssVUFBVSxHQUFHLEtBQUtILGNBQUwsQ0FBbkI7RUFDQSxRQUFNSSxhQUFhLEdBQUcsS0FBS0gsaUJBQUwsQ0FBdEI7O0VBQ0EsUUFDRUMsSUFBSSxJQUNKQyxVQURBLElBRUFDLGFBSEYsRUFJRTtFQUNBL0YsTUFBQUEsTUFBTSxDQUFDUyxPQUFQLENBQWVxRixVQUFmLEVBQ0dwRixPQURILENBQ1csVUFBdUM7RUFBQSxZQUF0QyxDQUFDc0YsYUFBRCxFQUFnQkMsZ0JBQWhCLENBQXNDO0VBQzlDLFlBQU0sQ0FBQ0MsY0FBRCxFQUFpQkMsYUFBakIsSUFBa0NILGFBQWEsQ0FBQ0ksS0FBZCxDQUFvQixHQUFwQixDQUF4QztFQUNBLFlBQU1vSCw0QkFBNEIsR0FBR3RILGNBQWMsQ0FBQ3VILFNBQWYsQ0FBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsQ0FBckM7RUFDQSxZQUFNQywyQkFBMkIsR0FBR3hILGNBQWMsQ0FBQ3VILFNBQWYsQ0FBeUJ2SCxjQUFjLENBQUN6RyxNQUFmLEdBQXdCLENBQWpELENBQXBDO0VBQ0EsWUFBSWtPLFdBQVcsR0FBRyxFQUFsQjs7RUFDQSxZQUNFSCw0QkFBNEIsS0FBSyxHQUFqQyxJQUNBRSwyQkFBMkIsS0FBSyxHQUZsQyxFQUdFO0VBQ0FDLFVBQUFBLFdBQVcsR0FBRzNOLE1BQU0sQ0FBQ1MsT0FBUCxDQUFlb0YsSUFBZixFQUNYakMsTUFEVyxDQUNKLENBQUNnSyxZQUFELFlBQTBDO0VBQUEsZ0JBQTNCLENBQUNuSSxRQUFELEVBQVdZLFVBQVgsQ0FBMkI7RUFDaEQsZ0JBQUl3SCwwQkFBMEIsR0FBRzNILGNBQWMsQ0FBQy9FLEtBQWYsQ0FBcUIsQ0FBckIsRUFBd0IsQ0FBQyxDQUF6QixDQUFqQztFQUNBLGdCQUFJMk0sb0JBQW9CLEdBQUcsSUFBSUMsTUFBSixDQUFXRiwwQkFBWCxDQUEzQjs7RUFDQSxnQkFBR3BJLFFBQVEsQ0FBQ3VJLEtBQVQsQ0FBZUYsb0JBQWYsQ0FBSCxFQUF5QztFQUN2Q0YsY0FBQUEsWUFBWSxDQUFDOU4sSUFBYixDQUFrQnVHLFVBQWxCO0VBQ0Q7O0VBQ0QsbUJBQU91SCxZQUFQO0VBQ0QsV0FSVyxFQVFULEVBUlMsQ0FBZDtFQVNELFNBYkQsTUFhTztFQUNMRCxVQUFBQSxXQUFXLENBQUM3TixJQUFaLENBQWlCK0YsSUFBSSxDQUFDSyxjQUFELENBQXJCO0VBQ0Q7O0VBQ0RILFFBQUFBLGFBQWEsQ0FBQ0UsZ0JBQUQsQ0FBYixHQUFrQ0YsYUFBYSxDQUFDRSxnQkFBRCxDQUFiLENBQWdDa0UsSUFBaEMsQ0FBcUMsSUFBckMsQ0FBbEM7RUFDQSxZQUFNM0QsaUJBQWlCLEdBQUdULGFBQWEsQ0FBQ0UsZ0JBQUQsQ0FBdkM7O0VBQ0EsWUFDRUMsY0FBYyxJQUNkQyxhQURBLElBRUF3SCxXQUFXLENBQUNsTyxNQUZaLElBR0ErRyxpQkFKRixFQUtFO0VBQ0FtSCxVQUFBQSxXQUFXLENBQ1JqTixPQURILENBQ1kyRixVQUFELElBQWdCO0VBQ3ZCLGdCQUFJO0VBQ0Ysc0JBQU8zRCxNQUFQO0VBQ0UscUJBQUssSUFBTDtFQUNFMkQsa0JBQUFBLFVBQVUsQ0FBQzNELE1BQUQsQ0FBVixDQUFtQnlELGFBQW5CLEVBQWtDSyxpQkFBbEM7RUFDQTs7RUFDRixxQkFBSyxLQUFMO0VBQ0VILGtCQUFBQSxVQUFVLENBQUMzRCxNQUFELENBQVYsQ0FBbUJ5RCxhQUFuQixFQUFrQ0ssaUJBQWlCLENBQUNoSCxJQUFsQixDQUF1QjRHLEtBQXZCLENBQTZCLEdBQTdCLEVBQWtDLENBQWxDLENBQWxDO0VBQ0E7RUFOSjtFQVFELGFBVEQsQ0FTRSxPQUFNUSxLQUFOLEVBQWE7RUFDaEIsV0FaSDtFQWFEO0VBQ0YsT0E1Q0g7RUE2Q0Q7O0VBQ0QsV0FBTyxJQUFQO0VBQ0Q7O0VBdklxQyxDQUF4Qzs7RUNBQSxJQUFNcUgsTUFBTSxHQUFHLGNBQWNqUCxNQUFkLENBQXFCO0VBQ2xDQyxFQUFBQSxXQUFXLEdBQThCO0VBQUEsUUFBN0JrRCxRQUE2Qix1RUFBbEIsRUFBa0I7RUFBQSxRQUFkRyxPQUFjLHVFQUFKLEVBQUk7RUFDdkM7RUFDQSxTQUFLSCxRQUFMLEdBQWdCQSxRQUFoQjtFQUNBLFNBQUtHLE9BQUwsR0FBZUEsT0FBZjtFQUNBLFNBQUs0TCxXQUFMO0VBQ0EsU0FBS0MsZUFBTDtFQUNEOztFQUNELE1BQUlqTSxhQUFKLEdBQW9CO0VBQUUsV0FBTyxDQUMzQixNQUQyQixFQUUzQixhQUYyQixFQUczQixZQUgyQixFQUkzQixRQUoyQixDQUFQO0VBS25COztFQUNILE1BQUlDLFFBQUosR0FBZTtFQUFFLFdBQU8sS0FBS0MsU0FBWjtFQUF1Qjs7RUFDeEMsTUFBSUQsUUFBSixDQUFhQSxRQUFiLEVBQXVCO0VBQ3JCLFNBQUtDLFNBQUwsR0FBaUJELFFBQWpCO0VBQ0EsU0FBS0QsYUFBTCxDQUFtQnhCLE9BQW5CLENBQTRCMkIsWUFBRCxJQUFrQjtFQUMzQyxVQUFHRixRQUFRLENBQUNFLFlBQUQsQ0FBWCxFQUEyQixLQUFLQSxZQUFMLElBQXFCRixRQUFRLENBQUNFLFlBQUQsQ0FBN0I7RUFDNUIsS0FGRDtFQUdEOztFQUNELE1BQUlDLE9BQUosR0FBYztFQUNaLFFBQUcsQ0FBQyxLQUFLQyxRQUFULEVBQW1CLEtBQUtBLFFBQUwsR0FBZ0IsRUFBaEI7RUFDbkIsV0FBTyxLQUFLQSxRQUFaO0VBQ0Q7O0VBQ0QsTUFBSUQsT0FBSixDQUFZQSxPQUFaLEVBQXFCO0VBQUUsU0FBS0MsUUFBTCxHQUFnQkQsT0FBaEI7RUFBeUI7O0VBQ2hELE1BQUk4TCxRQUFKLEdBQWU7RUFBRSxXQUFPQyxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JGLFFBQXZCO0VBQWlDOztFQUNsRCxNQUFJRyxRQUFKLEdBQWU7RUFBRSxXQUFPRixNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLFFBQXZCO0VBQWlDOztFQUNsRCxNQUFJQyxJQUFKLEdBQVc7RUFBRSxXQUFPSCxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JFLElBQXZCO0VBQTZCOztFQUMxQyxNQUFJQyxRQUFKLEdBQWU7RUFBRSxXQUFPSixNQUFNLENBQUNDLFFBQVAsQ0FBZ0JHLFFBQXZCO0VBQWlDOztFQUNsRCxNQUFJQyxJQUFKLEdBQVc7RUFDVCxRQUFJQyxNQUFNLEdBQUdOLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkcsUUFBaEIsQ0FDVkcsT0FEVSxDQUNGLElBQUliLE1BQUosQ0FBVyxDQUFDLEdBQUQsRUFBTSxLQUFLYyxJQUFYLEVBQWlCQyxJQUFqQixDQUFzQixFQUF0QixDQUFYLENBREUsRUFDcUMsRUFEckMsRUFFVjFJLEtBRlUsQ0FFSixHQUZJLEVBR1ZqRixLQUhVLENBR0osQ0FISSxFQUdELENBSEMsRUFJVixDQUpVLENBQWI7RUFLQSxRQUFJNE4sU0FBUyxHQUNYSixNQUFNLENBQUNsUCxNQUFQLEtBQWtCLENBREosR0FFWixFQUZZLEdBSVZrUCxNQUFNLENBQUNsUCxNQUFQLEtBQWtCLENBQWxCLElBQ0FrUCxNQUFNLENBQUNYLEtBQVAsQ0FBYSxLQUFiLENBREEsSUFFQVcsTUFBTSxDQUFDWCxLQUFQLENBQWEsS0FBYixDQUhGLEdBSUksQ0FBQyxHQUFELENBSkosR0FLSVcsTUFBTSxDQUNIQyxPQURILENBQ1csS0FEWCxFQUNrQixFQURsQixFQUVHQSxPQUZILENBRVcsS0FGWCxFQUVrQixFQUZsQixFQUdHeEksS0FISCxDQUdTLEdBSFQsQ0FSUjtFQVlBLFdBQU87RUFDTDJJLE1BQUFBLFNBQVMsRUFBRUEsU0FETjtFQUVMSixNQUFBQSxNQUFNLEVBQUVBO0VBRkgsS0FBUDtFQUlEOztFQUNELE1BQUlLLElBQUosR0FBVztFQUNULFFBQUlMLE1BQU0sR0FBR04sTUFBTSxDQUFDQyxRQUFQLENBQWdCVSxJQUFoQixDQUNWN04sS0FEVSxDQUNKLENBREksRUFFVmlGLEtBRlUsQ0FFSixHQUZJLEVBR1ZqRixLQUhVLENBR0osQ0FISSxFQUdELENBSEMsRUFJVixDQUpVLENBQWI7RUFLQSxRQUFJNE4sU0FBUyxHQUNYSixNQUFNLENBQUNsUCxNQUFQLEtBQWtCLENBREosR0FFWixFQUZZLEdBSVZrUCxNQUFNLENBQUNsUCxNQUFQLEtBQWtCLENBQWxCLElBQ0FrUCxNQUFNLENBQUNYLEtBQVAsQ0FBYSxLQUFiLENBREEsSUFFQVcsTUFBTSxDQUFDWCxLQUFQLENBQWEsS0FBYixDQUhGLEdBSUksQ0FBQyxHQUFELENBSkosR0FLSVcsTUFBTSxDQUNIQyxPQURILENBQ1csS0FEWCxFQUNrQixFQURsQixFQUVHQSxPQUZILENBRVcsS0FGWCxFQUVrQixFQUZsQixFQUdHeEksS0FISCxDQUdTLEdBSFQsQ0FSUjtFQVlBLFdBQU87RUFDTDJJLE1BQUFBLFNBQVMsRUFBRUEsU0FETjtFQUVMSixNQUFBQSxNQUFNLEVBQUVBO0VBRkgsS0FBUDtFQUlEOztFQUNELE1BQUlNLFVBQUosR0FBaUI7RUFDZixRQUFJTixNQUFKO0VBQ0EsUUFBSS9OLElBQUo7O0VBQ0EsUUFBR3lOLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQlksSUFBaEIsQ0FBcUJsQixLQUFyQixDQUEyQixJQUEzQixDQUFILEVBQXFDO0VBQ25DLFVBQUlpQixVQUFVLEdBQUdaLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQlksSUFBaEIsQ0FDZDlJLEtBRGMsQ0FDUixHQURRLEVBRWRqRixLQUZjLENBRVIsQ0FBQyxDQUZPLEVBR2QyTixJQUhjLENBR1QsRUFIUyxDQUFqQjtFQUlBSCxNQUFBQSxNQUFNLEdBQUdNLFVBQVQ7RUFDQXJPLE1BQUFBLElBQUksR0FBR3FPLFVBQVUsQ0FDZDdJLEtBREksQ0FDRSxHQURGLEVBRUp4QyxNQUZJLENBRUcsQ0FDTnVMLFdBRE0sRUFFTkMsU0FGTSxLQUdIO0VBQ0gsWUFBSUMsYUFBYSxHQUFHRCxTQUFTLENBQUNoSixLQUFWLENBQWdCLEdBQWhCLENBQXBCO0VBQ0ErSSxRQUFBQSxXQUFXLENBQUNFLGFBQWEsQ0FBQyxDQUFELENBQWQsQ0FBWCxHQUFnQ0EsYUFBYSxDQUFDLENBQUQsQ0FBN0M7RUFDQSxlQUFPRixXQUFQO0VBQ0QsT0FUSSxFQVNGLEVBVEUsQ0FBUDtFQVVELEtBaEJELE1BZ0JPO0VBQ0xSLE1BQUFBLE1BQU0sR0FBRyxFQUFUO0VBQ0EvTixNQUFBQSxJQUFJLEdBQUcsRUFBUDtFQUNEOztFQUNELFdBQU87RUFDTCtOLE1BQUFBLE1BQU0sRUFBRUEsTUFESDtFQUVML04sTUFBQUEsSUFBSSxFQUFFQTtFQUZELEtBQVA7RUFJRDs7RUFDRCxNQUFJME8sS0FBSixHQUFZO0VBQUUsV0FBTyxLQUFLVCxJQUFMLElBQWEsR0FBcEI7RUFBeUI7O0VBQ3ZDLE1BQUlTLEtBQUosQ0FBVVQsSUFBVixFQUFnQjtFQUFFLFNBQUtBLElBQUwsR0FBWUEsSUFBWjtFQUFrQjs7RUFDcEMsTUFBSVUsWUFBSixHQUFtQjtFQUFFLFdBQU8sS0FBS0MsV0FBTCxJQUFvQixLQUEzQjtFQUFrQzs7RUFDdkQsTUFBSUQsWUFBSixDQUFpQkMsV0FBakIsRUFBOEI7RUFBRSxTQUFLQSxXQUFMLEdBQW1CQSxXQUFuQjtFQUFnQzs7RUFDaEUsTUFBSUMsT0FBSixHQUFjO0VBQUUsV0FBTyxLQUFLQyxNQUFaO0VBQW9COztFQUNwQyxNQUFJRCxPQUFKLENBQVlDLE1BQVosRUFBb0I7RUFBRSxTQUFLQSxNQUFMLEdBQWNBLE1BQWQ7RUFBc0I7O0VBQzVDLE1BQUlDLFdBQUosR0FBa0I7RUFBRSxXQUFPLEtBQUtDLFVBQVo7RUFBd0I7O0VBQzVDLE1BQUlELFdBQUosQ0FBZ0JDLFVBQWhCLEVBQTRCO0VBQUUsU0FBS0EsVUFBTCxHQUFrQkEsVUFBbEI7RUFBOEI7O0VBQzVELE1BQUl0QixRQUFKLEdBQWU7RUFDYixXQUFPO0VBQ0xPLE1BQUFBLElBQUksRUFBRSxLQUFLQSxJQUROO0VBRUxILE1BQUFBLElBQUksRUFBRSxLQUFLQSxJQUZOO0VBR0xNLE1BQUFBLElBQUksRUFBRSxLQUFLQSxJQUhOO0VBSUxDLE1BQUFBLFVBQVUsRUFBRSxLQUFLQTtFQUpaLEtBQVA7RUFNRDs7RUFDRFksRUFBQUEsVUFBVSxDQUFDQyxjQUFELEVBQWlCQyxpQkFBakIsRUFBb0M7RUFDNUMsUUFBSUMsWUFBWSxHQUFHLElBQUk1UCxLQUFKLEVBQW5COztFQUNBLFFBQUcwUCxjQUFjLENBQUNyUSxNQUFmLEtBQTBCc1EsaUJBQWlCLENBQUN0USxNQUEvQyxFQUF1RDtFQUNyRHVRLE1BQUFBLFlBQVksR0FBR0YsY0FBYyxDQUMxQmxNLE1BRFksQ0FDTCxDQUFDcU0sYUFBRCxFQUFnQkMsYUFBaEIsRUFBK0JDLGtCQUEvQixLQUFzRDtFQUM1RCxZQUFJQyxnQkFBZ0IsR0FBR0wsaUJBQWlCLENBQUNJLGtCQUFELENBQXhDOztFQUNBLFlBQUdELGFBQWEsQ0FBQ2xDLEtBQWQsQ0FBb0IsS0FBcEIsQ0FBSCxFQUErQjtFQUM3QmlDLFVBQUFBLGFBQWEsQ0FBQ25RLElBQWQsQ0FBbUIsSUFBbkI7RUFDRCxTQUZELE1BRU8sSUFBR29RLGFBQWEsS0FBS0UsZ0JBQXJCLEVBQXVDO0VBQzVDSCxVQUFBQSxhQUFhLENBQUNuUSxJQUFkLENBQW1CLElBQW5CO0VBQ0QsU0FGTSxNQUVBO0VBQ0xtUSxVQUFBQSxhQUFhLENBQUNuUSxJQUFkLENBQW1CLEtBQW5CO0VBQ0Q7O0VBQ0QsZUFBT21RLGFBQVA7RUFDRCxPQVhZLEVBV1YsRUFYVSxDQUFmO0VBWUQsS0FiRCxNQWFPO0VBQ0xELE1BQUFBLFlBQVksQ0FBQ2xRLElBQWIsQ0FBa0IsS0FBbEI7RUFDRDs7RUFDRCxXQUFRa1EsWUFBWSxDQUFDSyxPQUFiLENBQXFCLEtBQXJCLE1BQWdDLENBQUMsQ0FBbEMsR0FDSCxJQURHLEdBRUgsS0FGSjtFQUdEOztFQUNEQyxFQUFBQSxRQUFRLENBQUNoQyxRQUFELEVBQVc7RUFDakIsUUFBSW9CLE1BQU0sR0FBRzFQLE1BQU0sQ0FBQ1MsT0FBUCxDQUFlLEtBQUtpUCxNQUFwQixFQUNWOUwsTUFEVSxDQUNILENBQ042TCxPQURNLFdBRXlCO0VBQUEsVUFBL0IsQ0FBQ2MsU0FBRCxFQUFZQyxhQUFaLENBQStCO0VBQzdCLFVBQUlWLGNBQWMsR0FDaEJTLFNBQVMsQ0FBQzlRLE1BQVYsS0FBcUIsQ0FBckIsSUFDQThRLFNBQVMsQ0FBQ3ZDLEtBQVYsQ0FBZ0IsS0FBaEIsQ0FGbUIsR0FHakIsQ0FBQ3VDLFNBQUQsQ0FIaUIsR0FJaEJBLFNBQVMsQ0FBQzlRLE1BQVYsS0FBcUIsQ0FBdEIsR0FDRSxDQUFDLEVBQUQsQ0FERixHQUVFOFEsU0FBUyxDQUNOM0IsT0FESCxDQUNXLEtBRFgsRUFDa0IsRUFEbEIsRUFFR0EsT0FGSCxDQUVXLEtBRlgsRUFFa0IsRUFGbEIsRUFHR3hJLEtBSEgsQ0FHUyxHQUhULENBTk47RUFVQW9LLE1BQUFBLGFBQWEsQ0FBQ3pCLFNBQWQsR0FBMEJlLGNBQTFCO0VBQ0FMLE1BQUFBLE9BQU8sQ0FBQ0ssY0FBYyxDQUFDaEIsSUFBZixDQUFvQixHQUFwQixDQUFELENBQVAsR0FBb0MwQixhQUFwQztFQUNBLGFBQU9mLE9BQVA7RUFDRCxLQWpCUSxFQWtCVCxFQWxCUyxDQUFiO0VBb0JBLFdBQU96UCxNQUFNLENBQUN5USxNQUFQLENBQWNmLE1BQWQsRUFDSnBILElBREksQ0FDRW9JLEtBQUQsSUFBVztFQUNmLFVBQUlaLGNBQWMsR0FBR1ksS0FBSyxDQUFDM0IsU0FBM0I7RUFDQSxVQUFJZ0IsaUJBQWlCLEdBQUksS0FBS1AsV0FBTixHQUNwQmxCLFFBQVEsQ0FBQ1UsSUFBVCxDQUFjRCxTQURNLEdBRXBCVCxRQUFRLENBQUNJLElBQVQsQ0FBY0ssU0FGbEI7RUFHQSxVQUFJYyxVQUFVLEdBQUcsS0FBS0EsVUFBTCxDQUNmQyxjQURlLEVBRWZDLGlCQUZlLENBQWpCO0VBSUEsYUFBT0YsVUFBVSxLQUFLLElBQXRCO0VBQ0QsS0FYSSxDQUFQO0VBWUQ7O0VBQ0RjLEVBQUFBLFFBQVEsQ0FBQzlILEtBQUQsRUFBUTtFQUNkLFFBQUl5RixRQUFRLEdBQUcsS0FBS0EsUUFBcEI7RUFDQSxRQUFJb0MsS0FBSyxHQUFHLEtBQUtKLFFBQUwsQ0FBY2hDLFFBQWQsQ0FBWjtFQUNBLFFBQUlzQyxTQUFTLEdBQUc7RUFDZEYsTUFBQUEsS0FBSyxFQUFFQSxLQURPO0VBRWRwQyxNQUFBQSxRQUFRLEVBQUVBO0VBRkksS0FBaEI7O0VBSUEsUUFBR29DLEtBQUgsRUFBVTtFQUNSLFdBQUtkLFVBQUwsQ0FBZ0JjLEtBQUssQ0FBQ0csUUFBdEIsRUFBZ0NELFNBQWhDO0VBQ0EsV0FBSzFRLElBQUwsQ0FBVSxRQUFWLEVBQW9CO0VBQ2xCVixRQUFBQSxJQUFJLEVBQUUsUUFEWTtFQUVsQm9CLFFBQUFBLElBQUksRUFBRWdRO0VBRlksT0FBcEIsRUFJQSxJQUpBO0VBS0Q7RUFDRjs7RUFDRHpDLEVBQUFBLGVBQWUsR0FBRztFQUNoQkUsSUFBQUEsTUFBTSxDQUFDelAsRUFBUCxDQUFVLFVBQVYsRUFBc0IsS0FBSytSLFFBQUwsQ0FBY3hHLElBQWQsQ0FBbUIsSUFBbkIsQ0FBdEI7RUFDRDs7RUFDRDJHLEVBQUFBLGtCQUFrQixHQUFHO0VBQ25CekMsSUFBQUEsTUFBTSxDQUFDdlAsR0FBUCxDQUFXLFVBQVgsRUFBdUIsS0FBSzZSLFFBQUwsQ0FBY3hHLElBQWQsQ0FBbUIsSUFBbkIsQ0FBdkI7RUFDRDs7RUFDRDRHLEVBQUFBLFFBQVEsQ0FBQ3JDLElBQUQsRUFBTztFQUNiTCxJQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JZLElBQWhCLEdBQXVCUixJQUF2QjtFQUNEOztFQXhNaUMsQ0FBcEM7O0VDUUEsSUFBTXNDLEdBQUcsR0FBRztFQUNWaFMsRUFBQUEsTUFEVTtFQUVWaVMsRUFBQUEsUUFGVTtFQUdWQyxFQUFBQSxLQUhVO0VBSVZqUCxFQUFBQSxPQUpVO0VBS1ZpQyxFQUFBQSxLQUxVO0VBTVZ3RCxFQUFBQSxVQU5VO0VBT1Z1QixFQUFBQSxJQVBVO0VBUVZxRSxFQUFBQSxVQVJVO0VBU1ZXLEVBQUFBO0VBVFUsQ0FBWjs7Ozs7Ozs7In0=
