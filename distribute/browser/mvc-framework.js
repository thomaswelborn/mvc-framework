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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9TaGltcy9ldmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL0V2ZW50cy9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvQ2hhbm5lbC9pbmRleC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvQ2hhbm5lbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL3V1aWQuanMiLCIuLi8uLi9zb3VyY2UvTVZDL1NlcnZpY2UvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL01vZGVsL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Db2xsZWN0aW9uL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9WaWV3L2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Db250cm9sbGVyL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Sb3V0ZXIvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIkV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiA9IEV2ZW50VGFyZ2V0LnByb3RvdHlwZS5vbiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lclxyXG5FdmVudFRhcmdldC5wcm90b3R5cGUub2ZmID0gRXZlbnRUYXJnZXQucHJvdG90eXBlLm9mZiB8fCBFdmVudFRhcmdldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lclxyXG4iLCJjbGFzcyBFdmVudHMge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2V2ZW50cygpIHtcclxuICAgIHRoaXMuZXZlbnRzID0gdGhpcy5ldmVudHMgfHwge31cclxuICAgIHJldHVybiB0aGlzLmV2ZW50c1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpIHsgcmV0dXJuIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdIHx8IHt9IH1cclxuICBnZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gKGV2ZW50Q2FsbGJhY2submFtZS5sZW5ndGgpXHJcbiAgICAgID8gZXZlbnRDYWxsYmFjay5uYW1lXHJcbiAgICAgIDogJ2Fub255bW91c0Z1bmN0aW9uJ1xyXG4gIH1cclxuICBnZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKSB7XHJcbiAgICByZXR1cm4gZXZlbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdIHx8IFtdXHJcbiAgfVxyXG4gIG9uKGV2ZW50TmFtZSwgZXZlbnRDYWxsYmFjaykge1xyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gdGhpcy5nZXRFdmVudENhbGxiYWNrcyhldmVudE5hbWUpXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja05hbWUgPSB0aGlzLmdldEV2ZW50Q2FsbGJhY2tOYW1lKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBsZXQgZXZlbnRDYWxsYmFja0dyb3VwID0gdGhpcy5nZXRFdmVudENhbGxiYWNrR3JvdXAoZXZlbnRDYWxsYmFja3MsIGV2ZW50Q2FsbGJhY2tOYW1lKVxyXG4gICAgZXZlbnRDYWxsYmFja0dyb3VwLnB1c2goZXZlbnRDYWxsYmFjaylcclxuICAgIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudENhbGxiYWNrc1xyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgb2ZmKCkge1xyXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcclxuICAgICAgY2FzZSAwOlxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMTpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAyOlxyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFjayA9IGFyZ3VtZW50c1sxXVxyXG4gICAgICAgIHZhciBldmVudENhbGxiYWNrTmFtZSA9ICh0eXBlb2YgZXZlbnRDYWxsYmFjayA9PT0gJ3N0cmluZycpXHJcbiAgICAgICAgICA/IGV2ZW50Q2FsbGJhY2tcclxuICAgICAgICAgIDogdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgICAgIGlmKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKSB7XHJcbiAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1bZXZlbnRDYWxsYmFja05hbWVdXHJcbiAgICAgICAgICBpZihcclxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fZXZlbnRzW2V2ZW50TmFtZV0pLmxlbmd0aCA9PT0gMFxyXG4gICAgICAgICAgKSBkZWxldGUgdGhpcy5fZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGVtaXQoKSB7XHJcbiAgICBsZXQgX2FyZ3VtZW50cyA9IEFycmF5LmZyb20oYXJndW1lbnRzKVxyXG4gICAgbGV0IGV2ZW50TmFtZSA9IF9hcmd1bWVudHMuc3BsaWNlKDAsIDEpWzBdXHJcbiAgICBsZXQgZXZlbnREYXRhID0gX2FyZ3VtZW50cy5zcGxpY2UoMCwgMSlbMF1cclxuICAgIGxldCBldmVudEFyZ3VtZW50cyA9IF9hcmd1bWVudHMuc3BsaWNlKDApXHJcbiAgICBPYmplY3QuZW50cmllcyh0aGlzLmdldEV2ZW50Q2FsbGJhY2tzKGV2ZW50TmFtZSkpXHJcbiAgICAgIC5mb3JFYWNoKChbZXZlbnRDYWxsYmFja0dyb3VwTmFtZSwgZXZlbnRDYWxsYmFja0dyb3VwXSkgPT4ge1xyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2tHcm91cFxyXG4gICAgICAgICAgLmZvckVhY2goKGV2ZW50Q2FsbGJhY2spID0+IHtcclxuICAgICAgICAgICAgZXZlbnRDYWxsYmFjayhcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBldmVudE5hbWUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBldmVudERhdGFcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIC4uLmV2ZW50QXJndW1lbnRzXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBFdmVudHNcclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX3Jlc3BvbnNlcygpIHtcclxuICAgIHRoaXMucmVzcG9uc2VzID0gdGhpcy5yZXNwb25zZXNcclxuICAgICAgPyB0aGlzLnJlc3BvbnNlc1xyXG4gICAgICA6IHt9XHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZiAocmVzcG9uc2VDYWxsYmFjaykge1xyXG4gICAgICB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSA9IHJlc3BvbnNlQ2FsbGJhY2tcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VdXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlcXVlc3QocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZiAodGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0pIHtcclxuICAgICAgdmFyIF9hcmd1bWVudHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLnNsaWNlKDEpXHJcbiAgICAgIHJldHVybiB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXSguLi5fYXJndW1lbnRzKVxyXG4gICAgfVxyXG4gIH1cclxuICBvZmYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICBpZiAocmVzcG9uc2VOYW1lKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yICh2YXIgW19yZXNwb25zZU5hbWVdIG9mIE9iamVjdC5rZXlzKHRoaXMuX3Jlc3BvbnNlcykpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VzW19yZXNwb25zZU5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IENoYW5uZWwgZnJvbSAnLi9DaGFubmVsL2luZGV4J1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7fVxyXG4gIGdldCBfY2hhbm5lbHMoKSB7XHJcbiAgICB0aGlzLmNoYW5uZWxzID0gdGhpcy5jaGFubmVsc1xyXG4gICAgICA/IHRoaXMuY2hhbm5lbHNcclxuICAgICAgOiB7fVxyXG4gICAgcmV0dXJuIHRoaXMuY2hhbm5lbHNcclxuICB9XHJcbiAgY2hhbm5lbChjaGFubmVsTmFtZSkge1xyXG4gICAgdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdID0gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgID8gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgIDogbmV3IENoYW5uZWwoKVxyXG4gICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxuICBvZmYoY2hhbm5lbE5hbWUpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVVVJRCgpIHtcclxuICB2YXIgdXVpZCA9IFwiXCIsIGksIHJhbmRvbVxyXG4gIGZvciAoaSA9IDA7IGkgPCAzMjsgaSsrKSB7XHJcbiAgICByYW5kb20gPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwXHJcblxyXG4gICAgaWYgKGkgPT0gOCB8fCBpID09IDEyIHx8IGkgPT0gMTYgfHwgaSA9PSAyMCkge1xyXG4gICAgICB1dWlkICs9IFwiLVwiXHJcbiAgICB9XHJcbiAgICB1dWlkICs9IChpID09IDEyID8gNCA6IChpID09IDE2ID8gKHJhbmRvbSAmIDMgfCA4KSA6IHJhbmRvbSkpLnRvU3RyaW5nKDE2KVxyXG4gIH1cclxuICByZXR1cm4gdXVpZFxyXG59XHJcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4J1xuXG5jbGFzcyBTZXJ2aWNlIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCB2YWxpZFNldHRpbmdzKCkgeyByZXR1cm4gW1xuICAgICd1cmwnLFxuICAgICdtZXRob2QnLFxuICAgICdtb2RlJyxcbiAgICAnY2FjaGUnLFxuICAgICdjcmVkZW50aWFscycsXG4gICAgJ2hlYWRlcnMnLFxuICAgICdyZWRpcmVjdCcsXG4gICAgJ3JlZmVycmVyLXBvbGljeScsXG4gICAgJ2JvZHknLFxuICBdIH1cbiAgZ2V0IHNldHRpbmdzKCkgeyByZXR1cm4gdGhpcy5fc2V0dGluZ3MgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzLmZvckVhY2goKHZhbGlkU2V0dGluZykgPT4ge1xuICAgICAgaWYoc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkgdGhpc1t2YWxpZFNldHRpbmddID0gc2V0dGluZ3NbdmFsaWRTZXR0aW5nXVxuICAgIH0pXG4gIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCB1cmwoKSB7IHJldHVybiB0aGlzLl91cmwgfVxuICBzZXQgdXJsKHVybCkgeyB0aGlzLl91cmwgPSB1cmwgfVxuICBnZXQgbWV0aG9kKCkgeyByZXR1cm4gdGhpcy5fbWV0aG9kIH1cbiAgc2V0IG1vZGUobW9kZSkgeyB0aGlzLl9tb2RlID0gbW9kZSB9XG4gIGdldCBtb2RlKCkgeyByZXR1cm4gdGhpcy5fbW9kZSB9XG4gIHNldCBjYWNoZShjYWNoZSkgeyB0aGlzLl9jYWNoZSA9IGNhY2hlIH1cbiAgZ2V0IGNhY2hlKCkgeyByZXR1cm4gdGhpcy5fY2FjaGUgfVxuICBzZXQgY3JlZGVudGlhbHMoY3JlZGVudGlhbHMpIHsgdGhpcy5fY3JlZGVudGlhbHMgPSBjcmVkZW50aWFscyB9XG4gIGdldCBjcmVkZW50aWFscygpIHsgcmV0dXJuIHRoaXMuX2NyZWRlbnRpYWxzIH1cbiAgc2V0IGhlYWRlcnMoaGVhZGVycykgeyB0aGlzLl9oZWFkZXJzID0gaGVhZGVycyB9XG4gIGdldCBoZWFkZXJzKCkgeyByZXR1cm4gdGhpcy5faGVhZGVycyB9XG4gIHNldCByZWRpcmVjdChyZWRpcmVjdCkgeyB0aGlzLl9yZWRpcmVjdCA9IHJlZGlyZWN0IH1cbiAgZ2V0IHJlZGlyZWN0KCkgeyByZXR1cm4gdGhpcy5fcmVkaXJlY3QgfVxuICBzZXQgcmVmZXJyZXJQb2xpY3kocmVmZXJyZXJQb2xpY3kpIHsgdGhpcy5fcmVmZXJyZXJQb2xpY3kgPSByZWZlcnJlclBvbGljeSB9XG4gIGdldCByZWZlcnJlclBvbGljeSgpIHsgcmV0dXJuIHRoaXMuX3JlZmVycmVyUG9saWN5IH1cbiAgc2V0IGJvZHkoYm9keSkgeyB0aGlzLl9ib2R5ID0gYm9keSB9XG4gIGdldCBib2R5KCkgeyByZXR1cm4gdGhpcy5fYm9keSB9XG4gIGZldGNoKCkge1xuICAgIGNvbnN0IGZldGNoT3B0aW9ucyA9IHRoaXMudmFsaWRTZXR0aW5ncy5yZWR1Y2UoKF9mZXRjaE9wdGlvbnMsIFtmZXRjaE9wdGlvbk5hbWUsIGZldGNoT3B0aW9uVmFsdWVdKSA9PiB7XG4gICAgICBpZih0aGlzW2ZldGNoT3B0aW9uTmFtZV0pIF9mZXRjaE9wdGlvbnNbZmV0Y2hPcHRpb25OYW1lXSA9IGZldGNoT3B0aW9uVmFsdWVcbiAgICAgIHJldHVybiBfZmV0Y2hPcHRpb25zXG4gICAgfSwge30pXG4gICAgZmV0Y2godGhpcy51cmwsIGZldGNoT3B0aW9ucylcbiAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpXG4gICAgICB9KVxuICAgICAgLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCdyZWFkeScsIHtcbiAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFNlcnZpY2VcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xuXG5jb25zdCBNb2RlbCA9IGNsYXNzIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAnbG9jYWxTdG9yYWdlJyxcbiAgICAnZGVmYXVsdHMnLFxuICAgICdzZXJ2aWNlcycsXG4gICAgJ3NlcnZpY2VFdmVudHMnLFxuICAgICdzZXJ2aWNlQ2FsbGJhY2tzJyxcbiAgXSB9XG4gIGdldCBiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGVzKCkgeyByZXR1cm4gW1xuICAgICdzZXJ2aWNlJyxcbiAgXSB9XG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICB9KVxuICAgIHRoaXMuYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlc1xuICAgICAgLmZvckVhY2goKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZUV2ZW50cyhiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUsICdvbicpXG4gICAgICB9KVxuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgc2VydmljZXMoKSB7XG4gICAgaWYoIXRoaXMuX3NlcnZpY2VzKSB0aGlzLl9zZXJ2aWNlcyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX3NlcnZpY2VzXG4gIH1cbiAgc2V0IHNlcnZpY2VzKHNlcnZpY2VzKSB7IHRoaXMuX3NlcnZpY2VzID0gc2VydmljZXMgfVxuICBnZXQgZGF0YSgpIHtcbiAgICBpZighdGhpcy5fZGF0YSkgdGhpcy5fZGF0YSA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFcbiAgfVxuICBnZXQgZGVmYXVsdHMoKSB7XG4gICAgaWYoIXRoaXMuX2RlZmF1bHRzKSB0aGlzLl9kZWZhdWx0cyA9IHt9XG4gICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRzXG4gIH1cbiAgc2V0IGRlZmF1bHRzKGRlZmF1bHRzKSB7XG4gICAgdGhpcy5fZGVmYXVsdHMgPSBkZWZhdWx0c1xuICAgIHRoaXMuc2V0KHRoaXMuZGVmYXVsdHMpXG4gIH1cbiAgZ2V0IGxvY2FsU3RvcmFnZSgpIHsgcmV0dXJuIHRoaXMuX2xvY2FsU3RvcmFnZSB9XG4gIHNldCBsb2NhbFN0b3JhZ2UobG9jYWxTdG9yYWdlKSB7IHRoaXMuX2xvY2FsU3RvcmFnZSA9IGxvY2FsU3RvcmFnZSB9XG4gIGdldCBkYigpIHsgcmV0dXJuIHRoaXMuX2RiIH1cbiAgZ2V0IF9kYigpIHtcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCkgfHwgSlNPTi5zdHJpbmdpZnkodGhpcy5zdG9yYWdlQ29udGFpbmVyKVxuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxuICB9XG4gIHNldCBfZGIoZGIpIHtcbiAgICBkYiA9IEpTT04uc3RyaW5naWZ5KGRiKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlLmVuZHBvaW50LCBkYilcbiAgfVxuICByZXNldEV2ZW50cyhjbGFzc1R5cGUpIHtcbiAgICBbXG4gICAgICAnb2ZmJyxcbiAgICAgICdvbidcbiAgICBdLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICAgICAgdGhpcy50b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpXG4gICAgfSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZCkge1xuICAgIGNvbnN0IGJhc2VOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgncycpXG4gICAgY29uc3QgYmFzZUV2ZW50c05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdFdmVudHMnKVxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3NOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJylcbiAgICBjb25zdCBiYXNlID0gdGhpc1tiYXNlTmFtZV1cbiAgICBjb25zdCBiYXNlRXZlbnRzID0gdGhpc1tiYXNlRXZlbnRzTmFtZV1cbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzID0gdGhpc1tiYXNlQ2FsbGJhY2tzTmFtZV1cbiAgICBpZihcbiAgICAgIGJhc2UgJiZcbiAgICAgIGJhc2VFdmVudHMgJiZcbiAgICAgIGJhc2VDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKGJhc2VFdmVudHMpXG4gICAgICAgIC5mb3JFYWNoKChbYmFzZUV2ZW50RGF0YSwgYmFzZUNhbGxiYWNrTmFtZV0pID0+IHtcbiAgICAgICAgICBjb25zdCBbYmFzZVRhcmdldE5hbWUsIGJhc2VFdmVudE5hbWVdID0gYmFzZUV2ZW50RGF0YS5zcGxpdCgnICcpXG4gICAgICAgICAgY29uc3QgYmFzZVRhcmdldCA9IGJhc2VbYmFzZVRhcmdldE5hbWVdXG4gICAgICAgICAgY29uc3QgYmFzZUNhbGxiYWNrID0gYnNlQ2FsbGJhY2tzW2Jhc2VDYWxsYmFja05hbWVdXG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldCAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50Q2FsbGJhY2tcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNsYXNzVHlwZVRhcmdldFttZXRob2RdKGNsYXNzVHlwZUV2ZW50TmFtZSwgY2xhc3NUeXBlRXZlbnRDYWxsYmFjaylcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHt9XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHNldERCKCkge1xuICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgdmFyIF9hcmd1bWVudHMgPSBPYmplY3QuZW50cmllcyhhcmd1bWVudHNbMF0pXG4gICAgICAgIF9hcmd1bWVudHMuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgZGJba2V5XSA9IHZhbHVlXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDI6XG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgbGV0IHZhbHVlID0gYXJndW1lbnRzWzFdXG4gICAgICAgIGRiW2tleV0gPSB2YWx1ZVxuICAgICAgICBicmVha1xuICAgIH1cbiAgICB0aGlzLl9kYiA9IGRiXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldERCKCkge1xuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9kYlxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQgZGIgPSB0aGlzLl9kYlxuICAgICAgICBsZXQga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIGRlbGV0ZSBkYltrZXldXG4gICAgICAgIHRoaXMuX2RiID0gZGJcbiAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBzZXREYXRhUHJvcGVydHkoa2V5LCB2YWx1ZSkge1xuICAgIGlmKCF0aGlzLmRhdGFba2V5XSkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGhpcy5kYXRhLCB7XG4gICAgICAgIFsnXycuY29uY2F0KGtleSldOiB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBba2V5XToge1xuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNbJ18nLmNvbmNhdChrZXkpXSB9LFxuICAgICAgICAgIHNldCh2YWx1ZSkgeyB0aGlzWydfJy5jb25jYXQoa2V5KV0gPSB2YWx1ZSB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLmRhdGFba2V5XSA9IHZhbHVlXG4gICAgdGhpcy5lbWl0KCdzZXQnLmNvbmNhdCgnOicsIGtleSksIHtcbiAgICAgIGtleToga2V5LFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfSwgdGhpcylcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0RGF0YVByb3BlcnR5KGtleSkge1xuICAgIGlmKHRoaXMuZGF0YVtrZXldKSB7XG4gICAgICBkZWxldGUgdGhpcy5kYXRhW2tleV1cbiAgICB9XG4gICAgdGhpcy5lbWl0KCd1bnNldCcuY29uY2F0KCc6JywgYXJndW1lbnRzWzBdKSwgdGhpcylcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGdldCgpIHtcbiAgICBpZihhcmd1bWVudHNbMF0pIHJldHVybiB0aGlzLmRhdGFbYXJndW1lbnRzWzBdXVxuICAgIHJldHVybiBPYmplY3QuZW50cmllcyh0aGlzLmRhdGEpXG4gICAgICAucmVkdWNlKChfZGF0YSwgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIF9kYXRhW2tleV0gPSB2YWx1ZVxuICAgICAgICByZXR1cm4gX2RhdGFcbiAgICAgIH0sIHt9KVxuICB9XG4gIHNldCgpIHtcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShhcmd1bWVudHNbMF0sIGFyZ3VtZW50c1sxXSlcbiAgICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlKSB0aGlzLnNldERCKGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKVxuICAgIH0gZWxzZSBpZihcbiAgICAgIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiZcbiAgICAgICFBcnJheS5pc0FycmF5KGFyZ3VtZW50c1swXSkgJiZcbiAgICAgIHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdvYmplY3QnXG4gICAgKSB7XG4gICAgICBPYmplY3QuZW50cmllcyhhcmd1bWVudHNbMF0pLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy5zZXREQihrZXksIHZhbHVlKVxuICAgICAgfSlcbiAgICB9XG4gICAgdGhpcy5lbWl0KCdzZXQnLCB0aGlzLmRhdGEsIHRoaXMpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldCgpIHtcbiAgICBpZihhcmd1bWVudHNbMF0pIHtcbiAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoYXJndW1lbnRzWzBdKVxuICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIHRoaXMudW5zZXREQihrZXkpXG4gICAgfSBlbHNlIHtcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuZGF0YSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgICBpZih0aGlzLmxvY2FsU3RvcmFnZSkgdGhpcy51bnNldERCKGtleSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuZW1pdCgndW5zZXQnLCB0aGlzKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgcGFyc2UoZGF0YSA9IHRoaXMuZGF0YSkge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhkYXRhKS5yZWR1Y2UoKF9kYXRhLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgIGlmKHZhbHVlIGluc3RhbmNlb2YgTW9kZWwpIHtcbiAgICAgICAgX2RhdGFba2V5XSA9IHZhbHVlLnBhcnNlKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9kYXRhW2tleV0gPSB2YWx1ZVxuICAgICAgfVxuICAgICAgcmV0dXJuIF9kYXRhXG4gICAgfSwge30pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW9kZWxcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xyXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi4vTW9kZWwvaW5kZXguanMnXHJcblxyXG5jbGFzcyBDb2xsZWN0aW9uIGV4dGVuZHMgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcclxuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcclxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xyXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xyXG4gIH1cclxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcclxuICAgICdpZEF0dHJpYnV0ZScsXHJcbiAgICAnbW9kZWwnLFxyXG4gICAgJ2RlZmF1bHRzJyxcclxuICAgICdzZXJ2aWNlcycsXHJcbiAgICAnc2VydmljZUV2ZW50cycsXHJcbiAgICAnc2VydmljZUNhbGxiYWNrcycsXHJcbiAgXSB9XHJcbiAgZ2V0IGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXMoKSB7IHJldHVybiBbXHJcbiAgICAnc2VydmljZSdcclxuICBdIH1cclxuICBnZXQgc2V0dGluZ3MoKSB7IHJldHVybiB0aGlzLl9zZXR0aW5ncyB9XHJcbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XHJcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXHJcbiAgICB0aGlzLnZhbGlkU2V0dGluZ3MuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XHJcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cclxuICAgIH0pXHJcbiAgICB0aGlzLmJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXNcclxuICAgICAgLmZvckVhY2goKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSkgPT4ge1xyXG4gICAgICAgIHRoaXMudG9nZ2xlRXZlbnRzKGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSwgJ29uJylcclxuICAgICAgfSlcclxuICB9XHJcbiAgZ2V0IG9wdGlvbnMoKSB7XHJcbiAgICBpZighdGhpcy5fb3B0aW9ucykgdGhpcy5fb3B0aW9ucyA9IHt9XHJcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xyXG4gIH1cclxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7IHRoaXMuX29wdGlvbnMgPSBvcHRpb25zIH1cclxuICBnZXQgc3RvcmFnZUNvbnRhaW5lcigpIHsgcmV0dXJuIFtdIH1cclxuICBnZXQgZGVmYXVsdElEQXR0cmlidXRlKCkgeyByZXR1cm4gJ19pZCcgfVxyXG4gIGdldCBkZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuX2RlZmF1bHRzIH1cclxuICBzZXQgZGVmYXVsdHMoZGVmYXVsdHMpIHtcclxuICAgIHRoaXMuX2RlZmF1bHRzID0gZGVmYXVsdHNcclxuICAgIHRoaXMuYWRkKGRlZmF1bHRzKVxyXG4gIH1cclxuICBnZXQgbW9kZWxzKCkge1xyXG4gICAgdGhpcy5fbW9kZWxzID0gdGhpcy5fbW9kZWxzIHx8IHRoaXMuc3RvcmFnZUNvbnRhaW5lclxyXG4gICAgcmV0dXJuIHRoaXMuX21vZGVsc1xyXG4gIH1cclxuICBzZXQgbW9kZWxzKG1vZGVsc0RhdGEpIHsgdGhpcy5fbW9kZWxzID0gbW9kZWxzRGF0YSB9XHJcbiAgZ2V0IG1vZGVsKCkgeyByZXR1cm4gdGhpcy5fbW9kZWwgfVxyXG4gIHNldCBtb2RlbChtb2RlbCkgeyB0aGlzLl9tb2RlbCA9IG1vZGVsIH1cclxuICBnZXQgbG9jYWxTdG9yYWdlKCkgeyByZXR1cm4gdGhpcy5fbG9jYWxTdG9yYWdlIH1cclxuICBzZXQgbG9jYWxTdG9yYWdlKGxvY2FsU3RvcmFnZSkgeyB0aGlzLl9sb2NhbFN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2UgfVxyXG4gIGdldCBkYXRhKCkgeyByZXR1cm4gdGhpcy5fZGF0YSB9XHJcbiAgZ2V0IGRhdGEoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbW9kZWxzXHJcbiAgICAgIC5tYXAoKG1vZGVsKSA9PiBtb2RlbC5wYXJzZSgpKVxyXG4gIH1cclxuICBnZXQgZGIoKSB7IHJldHVybiB0aGlzLl9kYiB9XHJcbiAgZ2V0IGRiKCkge1xyXG4gICAgbGV0IGRiID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQpIHx8IEpTT04uc3RyaW5naWZ5KHRoaXMuc3RvcmFnZUNvbnRhaW5lcilcclxuICAgIHJldHVybiBKU09OLnBhcnNlKGRiKVxyXG4gIH1cclxuICBzZXQgZGIoZGIpIHtcclxuICAgIGRiID0gSlNPTi5zdHJpbmdpZnkoZGIpXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludCwgZGIpXHJcbiAgfVxyXG4gIHJlc2V0RXZlbnRzKGNsYXNzVHlwZSkge1xyXG4gICAgW1xyXG4gICAgICAnb2ZmJyxcclxuICAgICAgJ29uJ1xyXG4gICAgXS5mb3JFYWNoKChtZXRob2QpID0+IHtcclxuICAgICAgdGhpcy50b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpXHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgdG9nZ2xlRXZlbnRzKGNsYXNzVHlwZSwgbWV0aG9kKSB7XHJcbiAgICBjb25zdCBiYXNlTmFtZSA9IGNsYXNzVHlwZS5jb25jYXQoJ3MnKVxyXG4gICAgY29uc3QgYmFzZUV2ZW50c05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdFdmVudHMnKVxyXG4gICAgY29uc3QgYmFzZUNhbGxiYWNrc05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdDYWxsYmFja3MnKVxyXG4gICAgY29uc3QgYmFzZSA9IHRoaXNbYmFzZU5hbWVdXHJcbiAgICBjb25zdCBiYXNlRXZlbnRzID0gdGhpc1tiYXNlRXZlbnRzTmFtZV1cclxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3MgPSB0aGlzW2Jhc2VDYWxsYmFja3NOYW1lXVxyXG4gICAgaWYoXHJcbiAgICAgIGJhc2UgJiZcclxuICAgICAgYmFzZUV2ZW50cyAmJlxyXG4gICAgICBiYXNlQ2FsbGJhY2tzXHJcbiAgICApIHtcclxuICAgICAgT2JqZWN0LmVudHJpZXMoYmFzZUV2ZW50cylcclxuICAgICAgICAuZm9yRWFjaCgoW2Jhc2VFdmVudERhdGEsIGJhc2VDYWxsYmFja05hbWVdKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBbYmFzZVRhcmdldE5hbWUsIGJhc2VFdmVudE5hbWVdID0gYmFzZUV2ZW50RGF0YS5zcGxpdCgnICcpXHJcbiAgICAgICAgICBjb25zdCBiYXNlVGFyZ2V0ID0gYmFzZVtiYXNlVGFyZ2V0TmFtZV1cclxuICAgICAgICAgIGNvbnN0IGJhc2VDYWxsYmFjayA9IGJzZUNhbGxiYWNrc1tiYXNlQ2FsbGJhY2tOYW1lXVxyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIGJhc2VUYXJnZXROYW1lICYmXHJcbiAgICAgICAgICAgIGJhc2VFdmVudE5hbWUgJiZcclxuICAgICAgICAgICAgYmFzZVRhcmdldCAmJlxyXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFja1xyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgY2xhc3NUeXBlVGFyZ2V0W21ldGhvZF0oY2xhc3NUeXBlRXZlbnROYW1lLCBjbGFzc1R5cGVFdmVudENhbGxiYWNrKVxyXG4gICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7fVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBnZXRNb2RlbEluZGV4KG1vZGVsVVVJRCkge1xyXG4gICAgbGV0IG1vZGVsSW5kZXhcclxuICAgIHRoaXMuX21vZGVsc1xyXG4gICAgICAuZmluZCgoX21vZGVsLCBfbW9kZWxJbmRleCkgPT4ge1xyXG4gICAgICAgIGlmKF9tb2RlbCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIF9tb2RlbCBpbnN0YW5jZW9mIE1vZGVsICYmXHJcbiAgICAgICAgICAgIF9tb2RlbC5fdXVpZCA9PT0gbW9kZWxVVUlEXHJcbiAgICAgICAgICApIHtcclxuICAgICAgICAgICAgbW9kZWxJbmRleCA9IF9tb2RlbEluZGV4XHJcbiAgICAgICAgICAgIHJldHVybiBfbW9kZWxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gbW9kZWxJbmRleFxyXG4gIH1cclxuICByZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleCkge1xyXG4gICAgbGV0IG1vZGVsID0gdGhpcy5fbW9kZWxzLnNwbGljZShtb2RlbEluZGV4LCAxLCBudWxsKVxyXG4gICAgdGhpcy5lbWl0KFxyXG4gICAgICAncmVtb3ZlJyxcclxuICAgICAge30sXHJcbiAgICAgIG1vZGVsWzBdLFxyXG4gICAgICB0aGlzXHJcbiAgICApXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBhZGRNb2RlbChtb2RlbERhdGEpIHtcclxuICAgIGxldCBtb2RlbFxyXG4gICAgbGV0IHNvbWVNb2RlbCA9IG5ldyBNb2RlbCgpXHJcbiAgICBpZihtb2RlbERhdGEgaW5zdGFuY2VvZiBNb2RlbCkge1xyXG4gICAgICBtb2RlbCA9IG1vZGVsRGF0YVxyXG4gICAgfSBlbHNlIGlmKFxyXG4gICAgICB0aGlzLm1vZGVsXHJcbiAgICApIHtcclxuICAgICAgbW9kZWwgPSBuZXcgdGhpcy5tb2RlbCgpXHJcbiAgICAgIG1vZGVsLnNldChtb2RlbERhdGEpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtb2RlbCA9IG5ldyBNb2RlbCgpXHJcbiAgICAgIG1vZGVsLnNldChtb2RlbERhdGEpXHJcbiAgICB9XHJcbiAgICBtb2RlbC5vbihcclxuICAgICAgJ3NldCcsXHJcbiAgICAgIChldmVudCwgX21vZGVsKSA9PiB7XHJcbiAgICAgICAgdGhpcy5lbWl0KFxyXG4gICAgICAgICAgJ2NoYW5nZScsXHJcbiAgICAgICAgICB0aGlzLnBhcnNlKCksXHJcbiAgICAgICAgICB0aGlzLFxyXG4gICAgICAgIClcclxuICAgICAgfVxyXG4gICAgKVxyXG4gICAgdGhpcy5tb2RlbHMucHVzaChtb2RlbClcclxuICAgIHRoaXMuZW1pdChcclxuICAgICAgJ2FkZCcsXHJcbiAgICAgIG1vZGVsLnBhcnNlKCksXHJcbiAgICAgIG1vZGVsLFxyXG4gICAgICB0aGlzXHJcbiAgICApXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBhZGQobW9kZWxEYXRhKSB7XHJcbiAgICBpZihBcnJheS5pc0FycmF5KG1vZGVsRGF0YSkpIHtcclxuICAgICAgbW9kZWxEYXRhXHJcbiAgICAgICAgLmZvckVhY2goKG1vZGVsKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmFkZE1vZGVsKG1vZGVsKVxyXG4gICAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmFkZE1vZGVsKG1vZGVsRGF0YSlcclxuICAgIH1cclxuICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlKSB0aGlzLmRiID0gdGhpcy5kYXRhXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdjaGFuZ2UnLFxyXG4gICAgICB0aGlzLnBhcnNlKCksXHJcbiAgICAgIHRoaXNcclxuICAgIClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHJlbW92ZShtb2RlbERhdGEpIHtcclxuICAgIGlmKFxyXG4gICAgICAhQXJyYXkuaXNBcnJheShtb2RlbERhdGEpXHJcbiAgICApIHtcclxuICAgICAgdmFyIG1vZGVsSW5kZXggPSB0aGlzLmdldE1vZGVsSW5kZXgobW9kZWxEYXRhLl91dWlkKVxyXG4gICAgICB0aGlzLnJlbW92ZU1vZGVsQnlJbmRleChtb2RlbEluZGV4KVxyXG4gICAgfSBlbHNlIGlmKEFycmF5LmlzQXJyYXkobW9kZWxEYXRhKSkge1xyXG4gICAgICBtb2RlbERhdGFcclxuICAgICAgICAuZm9yRWFjaCgobW9kZWwpID0+IHtcclxuICAgICAgICAgIHZhciBtb2RlbEluZGV4ID0gdGhpcy5nZXRNb2RlbEluZGV4KG1vZGVsLl91dWlkKVxyXG4gICAgICAgICAgdGhpcy5yZW1vdmVNb2RlbEJ5SW5kZXgobW9kZWxJbmRleClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgdGhpcy5tb2RlbHMgPSB0aGlzLm1vZGVsc1xyXG4gICAgICAuZmlsdGVyKChtb2RlbCkgPT4gbW9kZWwgIT09IG51bGwpXHJcbiAgICBpZih0aGlzLl9sb2NhbFN0b3JhZ2UpIHRoaXMuZGIgPSB0aGlzLmRhdGFcclxuXHJcbiAgICB0aGlzLmVtaXQoXHJcbiAgICAgICdjaGFuZ2UnLFxyXG4gICAgICB0aGlzLnBhcnNlKCksXHJcbiAgICAgIHRoaXNcclxuICAgIClcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIHJlc2V0KCkge1xyXG4gICAgdGhpcy5yZW1vdmUodGhpcy5fbW9kZWxzKVxyXG4gICAgcmV0dXJuIHRoaXNcclxuICB9XHJcbiAgcGFyc2UoZGF0YSkge1xyXG4gICAgZGF0YSA9IGRhdGEgfHwgdGhpcy5kYXRhIHx8IHRoaXMuc3RvcmFnZUNvbnRhaW5lclxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb2xsZWN0aW9uXHJcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4LmpzJ1xuXG5jbGFzcyBWaWV3IGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAnYXR0cmlidXRlcycsXG4gICAgJ2VsZW1lbnROYW1lJyxcbiAgICAnZWxlbWVudCcsXG4gICAgJ2luc2VydCcsXG4gICAgJ3RlbXBsYXRlJyxcbiAgICAndWlFbGVtZW50cycsXG4gICAgJ3VpRWxlbWVudEV2ZW50cycsXG4gICAgJ3VpRWxlbWVudENhbGxiYWNrcycsXG4gICAgJ3JlbmRlcidcbiAgXSB9XG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICB9KVxuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgZWxlbWVudE5hbWUoKSB7IHJldHVybiB0aGlzLl9lbGVtZW50TmFtZSB9XG4gIHNldCBlbGVtZW50TmFtZShlbGVtZW50TmFtZSkgeyB0aGlzLl9lbGVtZW50TmFtZSA9IGVsZW1lbnROYW1lIH1cbiAgZ2V0IGVsZW1lbnQoKSB7XG4gICAgaWYoIXRoaXMuX2VsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMuZWxlbWVudE5hbWUpXG4gICAgICBPYmplY3QuZW50cmllcyh0aGlzLmF0dHJpYnV0ZXMpLmZvckVhY2goKFthdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlXSkgPT4ge1xuICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGVLZXksIGF0dHJpYnV0ZVZhbHVlKVxuICAgICAgfSlcbiAgICAgIHRoaXMuZWxlbWVudE9ic2VydmVyLm9ic2VydmUodGhpcy5lbGVtZW50LCB7XG4gICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50XG4gIH1cbiAgZ2V0IGVsZW1lbnRPYnNlcnZlcigpIHtcbiAgICB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgPSB0aGlzLl9lbGVtZW50T2JzZXJ2ZXIgfHwgbmV3IE11dGF0aW9uT2JzZXJ2ZXIoXG4gICAgICB0aGlzLmVsZW1lbnRPYnNlcnZlLmJpbmQodGhpcylcbiAgICApXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRPYnNlcnZlclxuICB9XG4gIHNldCBlbGVtZW50KGVsZW1lbnQpIHtcbiAgICBpZihlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHRoaXMuX2VsZW1lbnQgPSBlbGVtZW50XG4gIH1cbiAgZ2V0IGF0dHJpYnV0ZXMoKSB7IHJldHVybiB0aGlzLl9hdHRyaWJ1dGVzIHx8IHt9IH1cbiAgc2V0IGF0dHJpYnV0ZXMoYXR0cmlidXRlcykgeyB0aGlzLl9hdHRyaWJ1dGVzID0gYXR0cmlidXRlcyB9XG4gIGdldCB0ZW1wbGF0ZSgpIHsgcmV0dXJuIHRoaXMuX3RlbXBsYXRlIH1cbiAgc2V0IHRlbXBsYXRlKHRlbXBsYXRlKSB7IHRoaXMuX3RlbXBsYXRlID0gdGVtcGxhdGUgfVxuICBnZXQgdWlFbGVtZW50cygpIHsgcmV0dXJuIHRoaXMuX3VpRWxlbWVudHMgfHwge30gfVxuICBzZXQgdWlFbGVtZW50cyh1aUVsZW1lbnRzKSB7XG4gICAgdGhpcy5fdWlFbGVtZW50cyA9IHVpRWxlbWVudHNcbiAgICB0aGlzLnRvZ2dsZUV2ZW50cygpXG4gIH1cbiAgZ2V0IHVpRWxlbWVudEV2ZW50cygpIHsgcmV0dXJuIHRoaXMuX3VpRWxlbWVudEV2ZW50cyB8fCB7fSB9XG4gIHNldCB1aUVsZW1lbnRFdmVudHModWlFbGVtZW50RXZlbnRzKSB7XG4gICAgdGhpcy5fdWlFbGVtZW50RXZlbnRzID0gdWlFbGVtZW50RXZlbnRzXG4gICAgdGhpcy50b2dnbGVFdmVudHMoKVxuICB9XG4gIGdldCB1aUVsZW1lbnRDYWxsYmFja3MoKSB7IHJldHVybiB0aGlzLl91aUVsZW1lbnRDYWxsYmFja3MgfHwge30gfVxuICBzZXQgdWlFbGVtZW50Q2FsbGJhY2tzKHVpRWxlbWVudENhbGxiYWNrcykge1xuICAgIHRoaXMuX3VpRWxlbWVudENhbGxiYWNrcyA9IHVpRWxlbWVudENhbGxiYWNrc1xuICAgIHRoaXMudG9nZ2xlRXZlbnRzKClcbiAgfVxuICBnZXQgdWkoKSB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXNcbiAgICBpZighdGhpcy5fdWkpIHtcbiAgICAgIHRoaXMuX3VpID0gT2JqZWN0LmVudHJpZXModGhpcy51aUVsZW1lbnRzKS5yZWR1Y2UoKF91aSxbdWlFbGVtZW50TmFtZSwgdWlFbGVtZW50UXVlcnldKSA9PiB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKF91aSwge1xuICAgICAgICAgIFt1aUVsZW1lbnROYW1lXToge1xuICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICBpZih0eXBlb2YgdWlFbGVtZW50UXVlcnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgbGV0IHF1ZXJ5UmVzdWx0cyA9IGNvbnRleHQuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHVpRWxlbWVudFF1ZXJ5KVxuICAgICAgICAgICAgICAgIHJldHVybiAocXVlcnlSZXN1bHRzLmxlbmd0aCA+IDEpID8gcXVlcnlSZXN1bHRzIDogcXVlcnlSZXN1bHRzLml0ZW0oMClcbiAgICAgICAgICAgICAgfSBlbHNlIGlmKFxuICAgICAgICAgICAgICAgIHVpRWxlbWVudFF1ZXJ5IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHxcbiAgICAgICAgICAgICAgICB1aUVsZW1lbnRRdWVyeSBpbnN0YW5jZW9mIERvY3VtZW50IHx8XG4gICAgICAgICAgICAgICAgdWlFbGVtZW50UXVlcnkgaW5zdGFuY2VvZiBXaW5kb3dcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVpRWxlbWVudFF1ZXJ5XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gX3VpXG4gICAgICB9LCB7fSlcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMuX3VpLCB7XG4gICAgICAgICckZWxlbWVudCc6IHtcbiAgICAgICAgICBnZXQoKSB7IHJldHVybiBjb250ZXh0LmVsZW1lbnQgfVxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3VpXG4gIH1cbiAgZWxlbWVudE9ic2VydmUobXV0YXRpb25SZWNvcmRMaXN0LCBvYnNlcnZlcikge1xuICAgIGZvcihsZXQgW211dGF0aW9uUmVjb3JkSW5kZXgsIG11dGF0aW9uUmVjb3JkXSBvZiBPYmplY3QuZW50cmllcyhtdXRhdGlvblJlY29yZExpc3QpKSB7XG4gICAgICBzd2l0Y2gobXV0YXRpb25SZWNvcmQudHlwZSkge1xuICAgICAgICBjYXNlICdjaGlsZExpc3QnOlxuICAgICAgICAgIGlmKG11dGF0aW9uUmVjb3JkLmFkZGVkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyhPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyh0aGlzLnVpKSlcbiAgICAgICAgICAgIC5mb3JFYWNoKChbdWlLZXksIHVpVmFsdWVdKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHVpVmFsdWVHZXQgPSB1aVZhbHVlLmdldCgpXG4gICAgICAgICAgICAgIGNvbnN0IGFkZGVkVUlFbGVtZW50ID0gQXJyYXkuZnJvbShtdXRhdGlvblJlY29yZC5hZGRlZE5vZGVzKS5maW5kKChhZGRlZE5vZGUpID0+IGFkZGVkTm9kZSA9PT0gdWlWYWx1ZUdldClcbiAgICAgICAgICAgICAgaWYoYWRkZWRVSUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZUV2ZW50cyh1aUtleSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYmluZEV2ZW50VG9FbGVtZW50KGVsZW1lbnQsIG1ldGhvZCwgZXZlbnROYW1lLCBldmVudENhbGxiYWNrTmFtZSkge1xuICAgIHRyeSB7XG4gICAgICBzd2l0Y2gobWV0aG9kKSB7XG4gICAgICAgIGNhc2UgJ2FkZEV2ZW50TGlzdGVuZXInOlxuICAgICAgICAgIHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSA9IHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXS5iaW5kKHRoaXMpXG4gICAgICAgICAgZWxlbWVudFttZXRob2RdKGV2ZW50TmFtZSwgdGhpcy51aUVsZW1lbnRDYWxsYmFja3NbZXZlbnRDYWxsYmFja05hbWVdKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3JlbW92ZUV2ZW50TGlzdGVuZXInOlxuICAgICAgICAgIGVsZW1lbnRbbWV0aG9kXShldmVudE5hbWUsIHRoaXMudWlFbGVtZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSlcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH0gY2F0Y2goZXJyb3IpIHt9XG4gIH1cbiAgdG9nZ2xlRXZlbnRzKHRhcmdldFVJRWxlbWVudE5hbWUgPSBudWxsKSB7XG4gICAgdGhpcy5pc1RvZ2dsaW5nID0gdHJ1ZVxuICAgIGNvbnN0IHVpID0gdGhpcy51aVxuICAgIGNvbnN0IGV2ZW50QmluZE1ldGhvZHMgPSBbJ3JlbW92ZUV2ZW50TGlzdGVuZXInLCAnYWRkRXZlbnRMaXN0ZW5lciddXG4gICAgaWYoIXRhcmdldFVJRWxlbWVudE5hbWUpIHtcbiAgICAgIGV2ZW50QmluZE1ldGhvZHMuZm9yRWFjaCgoZXZlbnRCaW5kTWV0aG9kKSA9PiB7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMudWlFbGVtZW50RXZlbnRzKS5mb3JFYWNoKChbdWlFbGVtZW50RXZlbnRTZXR0aW5ncywgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWVdKSA9PiB7XG4gICAgICAgICAgbGV0IFt1aUVsZW1lbnROYW1lLCB1aUVsZW1lbnRFdmVudE5hbWVdID0gdWlFbGVtZW50RXZlbnRTZXR0aW5ncy5zcGxpdCgnICcpXG4gICAgICAgICAgaWYodWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xuICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0uZm9yRWFjaCgodWlFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50VG9FbGVtZW50KHVpRWxlbWVudCwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2UgaWYoXG4gICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIERvY3VtZW50IHx8XG4gICAgICAgICAgICB1aVt1aUVsZW1lbnROYW1lXSBpbnN0YW5jZW9mIFdpbmRvd1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlbdWlFbGVtZW50TmFtZV0sIGV2ZW50QmluZE1ldGhvZCwgdWlFbGVtZW50RXZlbnROYW1lLCB1aUVsZW1lbnRFdmVudENhbGxiYWNrTmFtZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBldmVudEJpbmRNZXRob2RzLmZvckVhY2goKGV2ZW50QmluZE1ldGhvZCkgPT4ge1xuICAgICAgICBjb25zdCB1aUVsZW1lbnRFdmVudHMgPSBPYmplY3QuZW50cmllcyh0aGlzLnVpRWxlbWVudEV2ZW50cykuZm9yRWFjaCgoW3VpRWxlbWVudEV2ZW50U2V0dGluZ3MsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lXSkgPT4ge1xuICAgICAgICAgIGxldCBbdWlFbGVtZW50TmFtZSwgdWlFbGVtZW50RXZlbnROYW1lXSA9IHVpRWxlbWVudEV2ZW50U2V0dGluZ3Muc3BsaXQoJyAnKVxuICAgICAgICAgIGlmKHRhcmdldFVJRWxlbWVudE5hbWUgPT09IHVpRWxlbWVudE5hbWUpIHtcbiAgICAgICAgICAgIGlmKHVpW3VpRWxlbWVudE5hbWVdIGluc3RhbmNlb2YgTm9kZUxpc3QpIHtcbiAgICAgICAgICAgICAgdWlbdWlFbGVtZW50TmFtZV0uZm9yRWFjaCgodWlFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnRUb0VsZW1lbnQodWlFbGVtZW50LCBldmVudEJpbmRNZXRob2QsIHVpRWxlbWVudEV2ZW50TmFtZSwgdWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUpXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IGVsc2UgaWYodWlbdWlFbGVtZW50TmFtZV0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICB0aGlzLmJpbmRFdmVudFRvRWxlbWVudCh1aVt1aUVsZW1lbnROYW1lXSwgZXZlbnRCaW5kTWV0aG9kLCB1aUVsZW1lbnRFdmVudE5hbWUsIHVpRWxlbWVudEV2ZW50Q2FsbGJhY2tOYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuaXNUb2dnbGluZyA9IGZhbHNlXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdXRvSW5zZXJ0KCkge1xuICAgIGlmKHRoaXMuaW5zZXJ0KSB7XG4gICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmluc2VydC5wYXJlbnRcbiAgICAgIGNvbnN0IG1ldGhvZCA9IHRoaXMuaW5zZXJ0Lm1ldGhvZFxuICAgICAgcGFyZW50Lmluc2VydEFkamFjZW50RWxlbWVudChtZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdXRvUmVtb3ZlKCkge1xuICAgIGlmKHRoaXMuZWxlbWVudC5wYXJlbnQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy5lbGVtZW50KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHJlbmRlcihkYXRhID0ge30pIHtcbiAgICBpZih0aGlzLnRlbXBsYXRlKSB7XG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGUoZGF0YSlcbiAgICAgIHRoaXMuZWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBWaWV3XG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleCdcblxuY29uc3QgQ29udHJvbGxlciA9IGNsYXNzIGV4dGVuZHMgRXZlbnRzIHtcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAnbW9kZWxzJyxcbiAgICAnbW9kZWxFdmVudHMnLFxuICAgICdtb2RlbENhbGxiYWNrcycsXG4gICAgJ2NvbGxlY3Rpb25zJyxcbiAgICAnY29sbGVjdGlvbkV2ZW50cycsXG4gICAgJ2NvbGxlY3Rpb25DYWxsYmFja3MnLFxuICAgICd2aWV3cycsXG4gICAgJ3ZpZXdFdmVudHMnLFxuICAgICd2aWV3Q2FsbGJhY2tzJyxcbiAgICAnY29udHJvbGxlcnMnLFxuICAgICdjb250cm9sbGVyRXZlbnRzJyxcbiAgICAnY29udHJvbGxlckNhbGxiYWNrcycsXG4gICAgJ3JvdXRlcnMnLFxuICAgICdyb3V0ZXJFdmVudHMnLFxuICAgICdyb3V0ZXJDYWxsYmFja3MnLFxuICBdIH1cbiAgZ2V0IGJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXMoKSB7IHJldHVybiBbXG4gICAgJ21vZGVsJyxcbiAgICAndmlldycsXG4gICAgJ2NvbnRyb2xsZXInLFxuICAgICdyb3V0ZXInLFxuICBdIH1cbiAgZ2V0IG9wdGlvbnMoKSB7XG4gICAgaWYoIXRoaXMuX29wdGlvbnMpIHRoaXMuX29wdGlvbnMgPSB7fVxuICAgIHJldHVybiB0aGlzLl9vcHRpb25zXG4gIH1cbiAgc2V0IG9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9ucyB9XG4gIGdldCBzZXR0aW5ncygpIHtcbiAgICBpZighdGhpcy5fc2V0dGluZ3MpIHRoaXMuX3NldHRpbmdzID0ge31cbiAgICByZXR1cm4gdGhpcy5fc2V0dGluZ3NcbiAgfVxuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3MpIHtcbiAgICB0aGlzLl9zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy52YWxpZFNldHRpbmdzXG4gICAgICAuZm9yRWFjaCgodmFsaWRTZXR0aW5nKSA9PiB7XG4gICAgICAgIGlmKHRoaXMuc2V0dGluZ3NbdmFsaWRTZXR0aW5nXSkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFxuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgWydfJy5jb25jYXQodmFsaWRTZXR0aW5nKV06IHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWJlcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBbdmFsaWRTZXR0aW5nXToge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGdldCgpIHsgcmV0dXJuIHRoaXNbJ18nLmNvbmNhdCh2YWxpZFNldHRpbmcpXSB9LFxuICAgICAgICAgICAgICAgIHNldCh2YWx1ZSkgeyB0aGlzWydfJy5jb25jYXQodmFsaWRTZXR0aW5nKV0gPSB2YWx1ZSB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIClcbiAgICAgICAgICB0aGlzW3ZhbGlkU2V0dGluZ10gPSB0aGlzLnNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB0aGlzLmJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZXNcbiAgICAgIC5mb3JFYWNoKChiaW5kYWJsZUV2ZW50Q2xhc3NQcm9wZXJ0eVR5cGUpID0+IHtcbiAgICAgICAgdGhpcy50b2dnbGVFdmVudHMoYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlLCAnb24nKVxuICAgICAgfSlcbiAgfVxuICByZXNldEV2ZW50cyhjbGFzc1R5cGUpIHtcbiAgICBbXG4gICAgICAnb2ZmJyxcbiAgICAgICdvbidcbiAgICBdLmZvckVhY2goKG1ldGhvZCkgPT4ge1xuICAgICAgdGhpcy50b2dnbGVFdmVudHMoY2xhc3NUeXBlLCBtZXRob2QpXG4gICAgfSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHRvZ2dsZUV2ZW50cyhjbGFzc1R5cGUsIG1ldGhvZCkge1xuICAgIGNvbnN0IGJhc2VOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgncycpXG4gICAgY29uc3QgYmFzZUV2ZW50c05hbWUgPSBjbGFzc1R5cGUuY29uY2F0KCdFdmVudHMnKVxuICAgIGNvbnN0IGJhc2VDYWxsYmFja3NOYW1lID0gY2xhc3NUeXBlLmNvbmNhdCgnQ2FsbGJhY2tzJylcbiAgICBjb25zdCBiYXNlID0gdGhpc1tiYXNlTmFtZV1cbiAgICBjb25zdCBiYXNlRXZlbnRzID0gdGhpc1tiYXNlRXZlbnRzTmFtZV1cbiAgICBjb25zdCBiYXNlQ2FsbGJhY2tzID0gdGhpc1tiYXNlQ2FsbGJhY2tzTmFtZV1cbiAgICBpZihcbiAgICAgIGJhc2UgJiZcbiAgICAgIGJhc2VFdmVudHMgJiZcbiAgICAgIGJhc2VDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIE9iamVjdC5lbnRyaWVzKGJhc2VFdmVudHMpXG4gICAgICAgIC5mb3JFYWNoKChbYmFzZUV2ZW50RGF0YSwgYmFzZUNhbGxiYWNrTmFtZV0pID0+IHtcbiAgICAgICAgICBjb25zdCBbYmFzZVRhcmdldE5hbWUsIGJhc2VFdmVudE5hbWVdID0gYmFzZUV2ZW50RGF0YS5zcGxpdCgnICcpXG4gICAgICAgICAgY29uc3QgYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdGaXJzdCA9IGJhc2VUYXJnZXROYW1lLnN1YnN0cmluZygwLCAxKVxuICAgICAgICAgIGNvbnN0IGJhc2VUYXJnZXROYW1lU3Vic3RyaW5nTGFzdCA9IGJhc2VUYXJnZXROYW1lLnN1YnN0cmluZyhiYXNlVGFyZ2V0TmFtZS5sZW5ndGggLSAxKVxuICAgICAgICAgIGxldCBiYXNlVGFyZ2V0cyA9IFtdXG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0ZpcnN0ID09PSAnWycgJiZcbiAgICAgICAgICAgIGJhc2VUYXJnZXROYW1lU3Vic3RyaW5nTGFzdCA9PT0gJ10nXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBiYXNlVGFyZ2V0cyA9IE9iamVjdC5lbnRyaWVzKGJhc2UpXG4gICAgICAgICAgICAgIC5yZWR1Y2UoKF9iYXNlVGFyZ2V0cywgW2Jhc2VOYW1lLCBiYXNlVGFyZ2V0XSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBiYXNlVGFyZ2V0TmFtZVJlZ0V4cFN0cmluZyA9IGJhc2VUYXJnZXROYW1lLnNsaWNlKDEsIC0xKVxuICAgICAgICAgICAgICAgIGxldCBiYXNlVGFyZ2V0TmFtZVJlZ0V4cCA9IG5ldyBSZWdFeHAoYmFzZVRhcmdldE5hbWVSZWdFeHBTdHJpbmcpXG4gICAgICAgICAgICAgICAgaWYoYmFzZU5hbWUubWF0Y2goYmFzZVRhcmdldE5hbWVSZWdFeHApKSB7XG4gICAgICAgICAgICAgICAgICBfYmFzZVRhcmdldHMucHVzaChiYXNlVGFyZ2V0KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gX2Jhc2VUYXJnZXRzXG4gICAgICAgICAgICAgIH0sIFtdKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiYXNlVGFyZ2V0cy5wdXNoKGJhc2VbYmFzZVRhcmdldE5hbWVdKVxuICAgICAgICAgIH1cbiAgICAgICAgICBiYXNlQ2FsbGJhY2tzW2Jhc2VDYWxsYmFja05hbWVdID0gYmFzZUNhbGxiYWNrc1tiYXNlQ2FsbGJhY2tOYW1lXS5iaW5kKHRoaXMpXG4gICAgICAgICAgY29uc3QgYmFzZUV2ZW50Q2FsbGJhY2sgPSBiYXNlQ2FsbGJhY2tzW2Jhc2VDYWxsYmFja05hbWVdXG4gICAgICAgICAgaWYoXG4gICAgICAgICAgICBiYXNlVGFyZ2V0TmFtZSAmJlxuICAgICAgICAgICAgYmFzZUV2ZW50TmFtZSAmJlxuICAgICAgICAgICAgYmFzZVRhcmdldHMubGVuZ3RoICYmXG4gICAgICAgICAgICBiYXNlRXZlbnRDYWxsYmFja1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgYmFzZVRhcmdldHNcbiAgICAgICAgICAgICAgLmZvckVhY2goKGJhc2VUYXJnZXQpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgc3dpdGNoKG1ldGhvZCkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdvbic6XG4gICAgICAgICAgICAgICAgICAgICAgYmFzZVRhcmdldFttZXRob2RdKGJhc2VFdmVudE5hbWUsIGJhc2VFdmVudENhbGxiYWNrKVxuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ29mZic6XG4gICAgICAgICAgICAgICAgICAgICAgYmFzZVRhcmdldFttZXRob2RdKGJhc2VFdmVudE5hbWUsIGJhc2VFdmVudENhbGxiYWNrLm5hbWUuc3BsaXQoJyAnKVsxXSlcbiAgICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHt9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyXG4iLCJpbXBvcnQgRXZlbnRzIGZyb20gJy4uL0V2ZW50cy9pbmRleCdcblxuY29uc3QgUm91dGVyID0gY2xhc3MgZXh0ZW5kcyBFdmVudHMge1xuICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuICAgIHRoaXMuYWRkU2V0dGluZ3MoKVxuICAgIHRoaXMuYWRkV2luZG93RXZlbnRzKClcbiAgfVxuICBnZXQgdmFsaWRTZXR0aW5ncygpIHsgcmV0dXJuIFtcbiAgICAncm9vdCcsXG4gICAgJ2hhc2hSb3V0aW5nJyxcbiAgICAnY29udHJvbGxlcicsXG4gICAgJ3JvdXRlcydcbiAgXSB9XG4gIGdldCBzZXR0aW5ncygpIHsgcmV0dXJuIHRoaXMuX3NldHRpbmdzIH1cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgdGhpcy5fc2V0dGluZ3MgPSBzZXR0aW5nc1xuICAgIHRoaXMudmFsaWRTZXR0aW5ncy5mb3JFYWNoKCh2YWxpZFNldHRpbmcpID0+IHtcbiAgICAgIGlmKHNldHRpbmdzW3ZhbGlkU2V0dGluZ10pIHRoaXNbdmFsaWRTZXR0aW5nXSA9IHNldHRpbmdzW3ZhbGlkU2V0dGluZ11cbiAgICB9KVxuICB9XG4gIGdldCBvcHRpb25zKCkge1xuICAgIGlmKCF0aGlzLl9vcHRpb25zKSB0aGlzLl9vcHRpb25zID0ge31cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uc1xuICB9XG4gIHNldCBvcHRpb25zKG9wdGlvbnMpIHsgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnMgfVxuICBnZXQgcHJvdG9jb2woKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgfVxuICBnZXQgaG9zdG5hbWUoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgfVxuICBnZXQgcG9ydCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wb3J0IH1cbiAgZ2V0IHBhdGhuYW1lKCkgeyByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lIH1cbiAgZ2V0IHBhdGgoKSB7XG4gICAgbGV0IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZVxuICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cChbJ14nLCB0aGlzLnJvb3RdLmpvaW4oJycpKSwgJycpXG4gICAgICAuc3BsaXQoJz8nKVxuICAgICAgLnNsaWNlKDAsIDEpXG4gICAgICBbMF1cbiAgICBsZXQgZnJhZ21lbnRzID0gKFxuICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMFxuICAgICkgPyBbXVxuICAgICAgOiAoXG4gICAgICAgICAgc3RyaW5nLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgICAgIHN0cmluZy5tYXRjaCgvXlxcLy8pICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9cXC8/LylcbiAgICAgICAgKSA/IFsnLyddXG4gICAgICAgICAgOiBzdHJpbmdcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJylcbiAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICByZXR1cm4ge1xuICAgICAgZnJhZ21lbnRzOiBmcmFnbWVudHMsXG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICB9XG4gIH1cbiAgZ2V0IGhhc2goKSB7XG4gICAgbGV0IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoXG4gICAgICAuc2xpY2UoMSlcbiAgICAgIC5zcGxpdCgnPycpXG4gICAgICAuc2xpY2UoMCwgMSlcbiAgICAgIFswXVxuICAgIGxldCBmcmFnbWVudHMgPSAoXG4gICAgICBzdHJpbmcubGVuZ3RoID09PSAwXG4gICAgKSA/IFtdXG4gICAgICA6IChcbiAgICAgICAgICBzdHJpbmcubGVuZ3RoID09PSAxICYmXG4gICAgICAgICAgc3RyaW5nLm1hdGNoKC9eXFwvLykgJiZcbiAgICAgICAgICBzdHJpbmcubWF0Y2goL1xcLz8vKVxuICAgICAgICApID8gWycvJ11cbiAgICAgICAgICA6IHN0cmluZ1xuICAgICAgICAgICAgICAucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAuc3BsaXQoJy8nKVxuICAgIHJldHVybiB7XG4gICAgICBmcmFnbWVudHM6IGZyYWdtZW50cyxcbiAgICAgIHN0cmluZzogc3RyaW5nLFxuICAgIH1cbiAgfVxuICBnZXQgcGFyYW1ldGVycygpIHtcbiAgICBsZXQgc3RyaW5nXG4gICAgbGV0IGRhdGFcbiAgICBpZih3aW5kb3cubG9jYXRpb24uaHJlZi5tYXRjaCgvXFw/LykpIHtcbiAgICAgIGxldCBwYXJhbWV0ZXJzID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICAgICAgLnNwbGl0KCc/JylcbiAgICAgICAgLnNsaWNlKC0xKVxuICAgICAgICAuam9pbignJylcbiAgICAgIHN0cmluZyA9IHBhcmFtZXRlcnNcbiAgICAgIGRhdGEgPSBwYXJhbWV0ZXJzXG4gICAgICAgIC5zcGxpdCgnJicpXG4gICAgICAgIC5yZWR1Y2UoKFxuICAgICAgICAgIF9wYXJhbWV0ZXJzLFxuICAgICAgICAgIHBhcmFtZXRlclxuICAgICAgICApID0+IHtcbiAgICAgICAgICBsZXQgcGFyYW1ldGVyRGF0YSA9IHBhcmFtZXRlci5zcGxpdCgnPScpXG4gICAgICAgICAgX3BhcmFtZXRlcnNbcGFyYW1ldGVyRGF0YVswXV0gPSBwYXJhbWV0ZXJEYXRhWzFdXG4gICAgICAgICAgcmV0dXJuIF9wYXJhbWV0ZXJzXG4gICAgICAgIH0sIHt9KVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHJpbmcgPSAnJ1xuICAgICAgZGF0YSA9IHt9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9XG4gIH1cbiAgZ2V0IF9yb290KCkgeyByZXR1cm4gdGhpcy5yb290IHx8ICcvJyB9XG4gIHNldCBfcm9vdChyb290KSB7IHRoaXMucm9vdCA9IHJvb3QgfVxuICBnZXQgX2hhc2hSb3V0aW5nKCkgeyByZXR1cm4gdGhpcy5oYXNoUm91dGluZyB8fCBmYWxzZSB9XG4gIHNldCBfaGFzaFJvdXRpbmcoaGFzaFJvdXRpbmcpIHsgdGhpcy5oYXNoUm91dGluZyA9IGhhc2hSb3V0aW5nIH1cbiAgZ2V0IF9yb3V0ZXMoKSB7IHJldHVybiB0aGlzLnJvdXRlcyB9XG4gIHNldCBfcm91dGVzKHJvdXRlcykgeyB0aGlzLnJvdXRlcyA9IHJvdXRlcyB9XG4gIGdldCBfY29udHJvbGxlcigpIHsgcmV0dXJuIHRoaXMuY29udHJvbGxlciB9XG4gIHNldCBfY29udHJvbGxlcihjb250cm9sbGVyKSB7IHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXIgfVxuICBnZXQgbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvb3Q6IHRoaXMucm9vdCxcbiAgICAgIHBhdGg6IHRoaXMucGF0aCxcbiAgICAgIGhhc2g6IHRoaXMuaGFzaCxcbiAgICAgIHBhcmFtZXRlcnM6IHRoaXMucGFyYW1ldGVycyxcbiAgICB9XG4gIH1cbiAgbWF0Y2hSb3V0ZShyb3V0ZUZyYWdtZW50cywgbG9jYXRpb25GcmFnbWVudHMpIHtcbiAgICBsZXQgcm91dGVNYXRjaGVzID0gbmV3IEFycmF5KClcbiAgICBpZihyb3V0ZUZyYWdtZW50cy5sZW5ndGggPT09IGxvY2F0aW9uRnJhZ21lbnRzLmxlbmd0aCkge1xuICAgICAgcm91dGVNYXRjaGVzID0gcm91dGVGcmFnbWVudHNcbiAgICAgICAgLnJlZHVjZSgoX3JvdXRlTWF0Y2hlcywgcm91dGVGcmFnbWVudCwgcm91dGVGcmFnbWVudEluZGV4KSA9PiB7XG4gICAgICAgICAgbGV0IGxvY2F0aW9uRnJhZ21lbnQgPSBsb2NhdGlvbkZyYWdtZW50c1tyb3V0ZUZyYWdtZW50SW5kZXhdXG4gICAgICAgICAgaWYocm91dGVGcmFnbWVudC5tYXRjaCgvXlxcOi8pKSB7XG4gICAgICAgICAgICBfcm91dGVNYXRjaGVzLnB1c2godHJ1ZSlcbiAgICAgICAgICB9IGVsc2UgaWYocm91dGVGcmFnbWVudCA9PT0gbG9jYXRpb25GcmFnbWVudCkge1xuICAgICAgICAgICAgX3JvdXRlTWF0Y2hlcy5wdXNoKHRydWUpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9yb3V0ZU1hdGNoZXMucHVzaChmYWxzZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIF9yb3V0ZU1hdGNoZXNcbiAgICAgICAgfSwgW10pXG4gICAgfSBlbHNlIHtcbiAgICAgIHJvdXRlTWF0Y2hlcy5wdXNoKGZhbHNlKVxuICAgIH1cbiAgICByZXR1cm4gKHJvdXRlTWF0Y2hlcy5pbmRleE9mKGZhbHNlKSA9PT0gLTEpXG4gICAgICA/IHRydWVcbiAgICAgIDogZmFsc2VcbiAgfVxuICBnZXRSb3V0ZShsb2NhdGlvbikge1xuICAgIGxldCByb3V0ZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnJvdXRlcylcbiAgICAgIC5yZWR1Y2UoKFxuICAgICAgICBfcm91dGVzLFxuICAgICAgICBbcm91dGVOYW1lLCByb3V0ZVNldHRpbmdzXSkgPT4ge1xuICAgICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IChcbiAgICAgICAgICAgIHJvdXRlTmFtZS5sZW5ndGggPT09IDEgJiZcbiAgICAgICAgICAgIHJvdXRlTmFtZS5tYXRjaCgvXlxcLy8pXG4gICAgICAgICAgKSA/IFtyb3V0ZU5hbWVdXG4gICAgICAgICAgICA6IChyb3V0ZU5hbWUubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICA/IFsnJ11cbiAgICAgICAgICAgICAgOiByb3V0ZU5hbWVcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwvJC8sICcnKVxuICAgICAgICAgICAgICAgICAgLnNwbGl0KCcvJylcbiAgICAgICAgICByb3V0ZVNldHRpbmdzLmZyYWdtZW50cyA9IHJvdXRlRnJhZ21lbnRzXG4gICAgICAgICAgX3JvdXRlc1tyb3V0ZUZyYWdtZW50cy5qb2luKCcvJyldID0gcm91dGVTZXR0aW5nc1xuICAgICAgICAgIHJldHVybiBfcm91dGVzXG4gICAgICAgIH0sXG4gICAgICAgIHt9XG4gICAgICApXG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXMocm91dGVzKVxuICAgICAgLmZpbmQoKHJvdXRlKSA9PiB7XG4gICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IHJvdXRlLmZyYWdtZW50c1xuICAgICAgICBsZXQgbG9jYXRpb25GcmFnbWVudHMgPSAodGhpcy5oYXNoUm91dGluZylcbiAgICAgICAgICA/IGxvY2F0aW9uLmhhc2guZnJhZ21lbnRzXG4gICAgICAgICAgOiBsb2NhdGlvbi5wYXRoLmZyYWdtZW50c1xuICAgICAgICBsZXQgbWF0Y2hSb3V0ZSA9IHRoaXMubWF0Y2hSb3V0ZShcbiAgICAgICAgICByb3V0ZUZyYWdtZW50cyxcbiAgICAgICAgICBsb2NhdGlvbkZyYWdtZW50cyxcbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gbWF0Y2hSb3V0ZSA9PT0gdHJ1ZVxuICAgICAgfSlcbiAgfVxuICBwb3BTdGF0ZShldmVudCkge1xuICAgIGxldCBsb2NhdGlvbiA9IHRoaXMubG9jYXRpb25cbiAgICBsZXQgcm91dGUgPSB0aGlzLmdldFJvdXRlKGxvY2F0aW9uKVxuICAgIGxldCByb3V0ZURhdGEgPSB7XG4gICAgICByb3V0ZTogcm91dGUsXG4gICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgfVxuICAgIGlmKHJvdXRlKSB7XG4gICAgICB0aGlzLmNvbnRyb2xsZXJbcm91dGUuY2FsbGJhY2tdKHJvdXRlRGF0YSlcbiAgICAgIHRoaXMuZW1pdCgnY2hhbmdlJywge1xuICAgICAgICBuYW1lOiAnY2hhbmdlJyxcbiAgICAgICAgZGF0YTogcm91dGVEYXRhLFxuICAgICAgfSxcbiAgICAgIHRoaXMpXG4gICAgfVxuICB9XG4gIGFkZFdpbmRvd0V2ZW50cygpIHtcbiAgICB3aW5kb3cub24oJ3BvcHN0YXRlJywgdGhpcy5wb3BTdGF0ZS5iaW5kKHRoaXMpKVxuICB9XG4gIHJlbW92ZVdpbmRvd0V2ZW50cygpIHtcbiAgICB3aW5kb3cub2ZmKCdwb3BzdGF0ZScsIHRoaXMucG9wU3RhdGUuYmluZCh0aGlzKSlcbiAgfVxuICBuYXZpZ2F0ZShwYXRoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRoXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFJvdXRlclxuIiwiaW1wb3J0ICcuL1NoaW1zL2V2ZW50cydcbmltcG9ydCBFdmVudHMgZnJvbSAnLi9FdmVudHMvaW5kZXgnXG5pbXBvcnQgQ2hhbm5lbHMgZnJvbSAnLi9DaGFubmVscy9pbmRleCdcbmltcG9ydCAqIGFzIFV0aWxzIGZyb20gJy4vVXRpbHMvaW5kZXgnXG5pbXBvcnQgU2VydmljZSBmcm9tICcuL1NlcnZpY2UvaW5kZXgnXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi9Nb2RlbC9pbmRleCdcbmltcG9ydCBDb2xsZWN0aW9uIGZyb20gJy4vQ29sbGVjdGlvbi9pbmRleCdcbmltcG9ydCBWaWV3IGZyb20gJy4vVmlldy9pbmRleCdcbmltcG9ydCBDb250cm9sbGVyIGZyb20gJy4vQ29udHJvbGxlci9pbmRleCdcbmltcG9ydCBSb3V0ZXIgZnJvbSAnLi9Sb3V0ZXIvaW5kZXgnXG5jb25zdCBNVkMgPSB7XG4gIEV2ZW50cyxcbiAgQ2hhbm5lbHMsXG4gIFV0aWxzLFxuICBTZXJ2aWNlLFxuICBNb2RlbCxcbiAgQ29sbGVjdGlvbixcbiAgVmlldyxcbiAgQ29udHJvbGxlcixcbiAgUm91dGVyLFxufVxuZXhwb3J0IGRlZmF1bHQgTVZDXG4iXSwibmFtZXMiOlsiRXZlbnRUYXJnZXQiLCJwcm90b3R5cGUiLCJvbiIsImFkZEV2ZW50TGlzdGVuZXIiLCJvZmYiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiRXZlbnRzIiwiY29uc3RydWN0b3IiLCJfZXZlbnRzIiwiZXZlbnRzIiwiZ2V0RXZlbnRDYWxsYmFja3MiLCJldmVudE5hbWUiLCJnZXRFdmVudENhbGxiYWNrTmFtZSIsImV2ZW50Q2FsbGJhY2siLCJuYW1lIiwibGVuZ3RoIiwiZ2V0RXZlbnRDYWxsYmFja0dyb3VwIiwiZXZlbnRDYWxsYmFja3MiLCJldmVudENhbGxiYWNrTmFtZSIsImV2ZW50Q2FsbGJhY2tHcm91cCIsInB1c2giLCJhcmd1bWVudHMiLCJPYmplY3QiLCJrZXlzIiwiZW1pdCIsIl9hcmd1bWVudHMiLCJBcnJheSIsImZyb20iLCJzcGxpY2UiLCJldmVudERhdGEiLCJldmVudEFyZ3VtZW50cyIsImVudHJpZXMiLCJmb3JFYWNoIiwiZXZlbnRDYWxsYmFja0dyb3VwTmFtZSIsImRhdGEiLCJfcmVzcG9uc2VzIiwicmVzcG9uc2VzIiwicmVzcG9uc2UiLCJyZXNwb25zZU5hbWUiLCJyZXNwb25zZUNhbGxiYWNrIiwicmVxdWVzdCIsInNsaWNlIiwiY2FsbCIsIl9yZXNwb25zZU5hbWUiLCJfY2hhbm5lbHMiLCJjaGFubmVscyIsImNoYW5uZWwiLCJjaGFubmVsTmFtZSIsIkNoYW5uZWwiLCJVVUlEIiwidXVpZCIsImkiLCJyYW5kb20iLCJNYXRoIiwidG9TdHJpbmciLCJTZXJ2aWNlIiwidmFsaWRTZXR0aW5ncyIsInNldHRpbmdzIiwiX3NldHRpbmdzIiwidmFsaWRTZXR0aW5nIiwib3B0aW9ucyIsIl9vcHRpb25zIiwidXJsIiwiX3VybCIsIm1ldGhvZCIsIl9tZXRob2QiLCJtb2RlIiwiX21vZGUiLCJjYWNoZSIsIl9jYWNoZSIsImNyZWRlbnRpYWxzIiwiX2NyZWRlbnRpYWxzIiwiaGVhZGVycyIsIl9oZWFkZXJzIiwicmVkaXJlY3QiLCJfcmVkaXJlY3QiLCJyZWZlcnJlclBvbGljeSIsIl9yZWZlcnJlclBvbGljeSIsImJvZHkiLCJfYm9keSIsImZldGNoIiwiZmV0Y2hPcHRpb25zIiwicmVkdWNlIiwiX2ZldGNoT3B0aW9ucyIsImZldGNoT3B0aW9uTmFtZSIsImZldGNoT3B0aW9uVmFsdWUiLCJ0aGVuIiwianNvbiIsIk1vZGVsIiwiYmluZGFibGVFdmVudENsYXNzUHJvcGVydHlUeXBlcyIsImJpbmRhYmxlRXZlbnRDbGFzc1Byb3BlcnR5VHlwZSIsInRvZ2dsZUV2ZW50cyIsInNlcnZpY2VzIiwiX3NlcnZpY2VzIiwiX2RhdGEiLCJkZWZhdWx0cyIsIl9kZWZhdWx0cyIsInNldCIsImxvY2FsU3RvcmFnZSIsIl9sb2NhbFN0b3JhZ2UiLCJkYiIsIl9kYiIsImdldEl0ZW0iLCJlbmRwb2ludCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzdG9yYWdlQ29udGFpbmVyIiwicGFyc2UiLCJzZXRJdGVtIiwicmVzZXRFdmVudHMiLCJjbGFzc1R5cGUiLCJiYXNlTmFtZSIsImNvbmNhdCIsImJhc2VFdmVudHNOYW1lIiwiYmFzZUNhbGxiYWNrc05hbWUiLCJiYXNlIiwiYmFzZUV2ZW50cyIsImJhc2VDYWxsYmFja3MiLCJiYXNlRXZlbnREYXRhIiwiYmFzZUNhbGxiYWNrTmFtZSIsImJhc2VUYXJnZXROYW1lIiwiYmFzZUV2ZW50TmFtZSIsInNwbGl0IiwiYmFzZVRhcmdldCIsImJhc2VDYWxsYmFjayIsImJzZUNhbGxiYWNrcyIsImJhc2VFdmVudENhbGxiYWNrIiwiY2xhc3NUeXBlVGFyZ2V0IiwiY2xhc3NUeXBlRXZlbnROYW1lIiwiY2xhc3NUeXBlRXZlbnRDYWxsYmFjayIsImVycm9yIiwic2V0REIiLCJrZXkiLCJ2YWx1ZSIsInVuc2V0REIiLCJzZXREYXRhUHJvcGVydHkiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJlbnVtZXJhYmxlIiwiZ2V0IiwidW5zZXREYXRhUHJvcGVydHkiLCJpc0FycmF5IiwidW5zZXQiLCJDb2xsZWN0aW9uIiwiZGVmYXVsdElEQXR0cmlidXRlIiwiYWRkIiwibW9kZWxzIiwiX21vZGVscyIsIm1vZGVsc0RhdGEiLCJtb2RlbCIsIl9tb2RlbCIsIm1hcCIsImdldE1vZGVsSW5kZXgiLCJtb2RlbFVVSUQiLCJtb2RlbEluZGV4IiwiZmluZCIsIl9tb2RlbEluZGV4IiwiX3V1aWQiLCJyZW1vdmVNb2RlbEJ5SW5kZXgiLCJhZGRNb2RlbCIsIm1vZGVsRGF0YSIsInNvbWVNb2RlbCIsImV2ZW50IiwicmVtb3ZlIiwiZmlsdGVyIiwicmVzZXQiLCJWaWV3IiwiZWxlbWVudE5hbWUiLCJfZWxlbWVudE5hbWUiLCJlbGVtZW50IiwiX2VsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJhdHRyaWJ1dGVzIiwiYXR0cmlidXRlS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJzZXRBdHRyaWJ1dGUiLCJlbGVtZW50T2JzZXJ2ZXIiLCJvYnNlcnZlIiwic3VidHJlZSIsImNoaWxkTGlzdCIsIl9lbGVtZW50T2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZWxlbWVudE9ic2VydmUiLCJiaW5kIiwiSFRNTEVsZW1lbnQiLCJfYXR0cmlidXRlcyIsInRlbXBsYXRlIiwiX3RlbXBsYXRlIiwidWlFbGVtZW50cyIsIl91aUVsZW1lbnRzIiwidWlFbGVtZW50RXZlbnRzIiwiX3VpRWxlbWVudEV2ZW50cyIsInVpRWxlbWVudENhbGxiYWNrcyIsIl91aUVsZW1lbnRDYWxsYmFja3MiLCJ1aSIsImNvbnRleHQiLCJfdWkiLCJ1aUVsZW1lbnROYW1lIiwidWlFbGVtZW50UXVlcnkiLCJxdWVyeVJlc3VsdHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiaXRlbSIsIkRvY3VtZW50IiwiV2luZG93IiwibXV0YXRpb25SZWNvcmRMaXN0Iiwib2JzZXJ2ZXIiLCJtdXRhdGlvblJlY29yZEluZGV4IiwibXV0YXRpb25SZWNvcmQiLCJ0eXBlIiwiYWRkZWROb2RlcyIsImdldE93blByb3BlcnR5RGVzY3JpcHRvcnMiLCJ1aUtleSIsInVpVmFsdWUiLCJ1aVZhbHVlR2V0IiwiYWRkZWRVSUVsZW1lbnQiLCJhZGRlZE5vZGUiLCJiaW5kRXZlbnRUb0VsZW1lbnQiLCJ0YXJnZXRVSUVsZW1lbnROYW1lIiwiaXNUb2dnbGluZyIsImV2ZW50QmluZE1ldGhvZHMiLCJldmVudEJpbmRNZXRob2QiLCJ1aUVsZW1lbnRFdmVudFNldHRpbmdzIiwidWlFbGVtZW50RXZlbnRDYWxsYmFja05hbWUiLCJ1aUVsZW1lbnRFdmVudE5hbWUiLCJOb2RlTGlzdCIsInVpRWxlbWVudCIsImF1dG9JbnNlcnQiLCJpbnNlcnQiLCJwYXJlbnQiLCJpbnNlcnRBZGphY2VudEVsZW1lbnQiLCJhdXRvUmVtb3ZlIiwicmVtb3ZlQ2hpbGQiLCJyZW5kZXIiLCJpbm5lckhUTUwiLCJDb250cm9sbGVyIiwiZW51bWJlcmFibGUiLCJiYXNlVGFyZ2V0TmFtZVN1YnN0cmluZ0ZpcnN0Iiwic3Vic3RyaW5nIiwiYmFzZVRhcmdldE5hbWVTdWJzdHJpbmdMYXN0IiwiYmFzZVRhcmdldHMiLCJfYmFzZVRhcmdldHMiLCJiYXNlVGFyZ2V0TmFtZVJlZ0V4cFN0cmluZyIsImJhc2VUYXJnZXROYW1lUmVnRXhwIiwiUmVnRXhwIiwibWF0Y2giLCJSb3V0ZXIiLCJhZGRTZXR0aW5ncyIsImFkZFdpbmRvd0V2ZW50cyIsInByb3RvY29sIiwid2luZG93IiwibG9jYXRpb24iLCJob3N0bmFtZSIsInBvcnQiLCJwYXRobmFtZSIsInBhdGgiLCJzdHJpbmciLCJyZXBsYWNlIiwicm9vdCIsImpvaW4iLCJmcmFnbWVudHMiLCJoYXNoIiwicGFyYW1ldGVycyIsImhyZWYiLCJfcGFyYW1ldGVycyIsInBhcmFtZXRlciIsInBhcmFtZXRlckRhdGEiLCJfcm9vdCIsIl9oYXNoUm91dGluZyIsImhhc2hSb3V0aW5nIiwiX3JvdXRlcyIsInJvdXRlcyIsIl9jb250cm9sbGVyIiwiY29udHJvbGxlciIsIm1hdGNoUm91dGUiLCJyb3V0ZUZyYWdtZW50cyIsImxvY2F0aW9uRnJhZ21lbnRzIiwicm91dGVNYXRjaGVzIiwiX3JvdXRlTWF0Y2hlcyIsInJvdXRlRnJhZ21lbnQiLCJyb3V0ZUZyYWdtZW50SW5kZXgiLCJsb2NhdGlvbkZyYWdtZW50IiwiaW5kZXhPZiIsImdldFJvdXRlIiwicm91dGVOYW1lIiwicm91dGVTZXR0aW5ncyIsInZhbHVlcyIsInJvdXRlIiwicG9wU3RhdGUiLCJyb3V0ZURhdGEiLCJjYWxsYmFjayIsInJlbW92ZVdpbmRvd0V2ZW50cyIsIm5hdmlnYXRlIiwiTVZDIiwiQ2hhbm5lbHMiLCJVdGlscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0VBQUFBLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIsR0FBMkJGLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkMsRUFBdEIsSUFBNEJGLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkUsZ0JBQTdFO0VBQ0FILFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkcsR0FBdEIsR0FBNEJKLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkcsR0FBdEIsSUFBNkJKLFdBQVcsQ0FBQ0MsU0FBWixDQUFzQkksbUJBQS9FOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VDREEsTUFBTUMsTUFBTixDQUFhO0VBQ1hDLEVBQUFBLFdBQVcsR0FBRzs7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
