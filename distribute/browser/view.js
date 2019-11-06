"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("./Events/index"));

var _index2 = _interopRequireDefault(require("./Channels/index"));

var _index3 = _interopRequireDefault(require("./Utils/index"));

var _index4 = _interopRequireDefault(require("./Service/index"));

var _index5 = _interopRequireDefault(require("./Model/index"));

var _index6 = _interopRequireDefault(require("./View/index"));

var _index7 = _interopRequireDefault(require("./Controller/index"));

var _index8 = _interopRequireDefault(require("./Router/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MVC = {
  Events: _index.default,
  Channels: _index2.default,
  Utils: _index3.default,
  Service: _index4.default,
  Model: _index5.default,
  View: _index6.default,
  Controller: _index7.default,
  Router: _index8.default
};
var _default = MVC;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var Events = class {
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

  emit(eventName, eventData) {
    var _arguments = Object.values(arguments);

    var eventCallbacks = Object.entries(this.getEventCallbacks(eventName));

    for (var [eventCallbackGroupName, eventCallbackGroup] of eventCallbacks) {
      for (var eventCallback of eventCallbackGroup) {
        var additionalArguments = _arguments.splice(2) || [];
        eventCallback(eventData, ...additionalArguments);
      }
    }

    return this;
  }

};
var _default = Events;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _index = _interopRequireDefault(require("../Utils/index"));

var _index2 = _interopRequireDefault(require("../Base/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var View = class extends _index2.default {
  constructor() {
    super(...arguments);
    this.enable();
    return this;
  }

  get elementKeyMap() {
    return ['elementName', 'element', 'attributes', 'templates', 'insert'];
  }

  get uiKeyMap() {
    return ['ui', 'uiCallbacks', 'uiEvents'];
  }

  get _elementName() {
    return this._element.tagName;
  }

  set _elementName(elementName) {
    if (!this._element) this._element = document.createElement(elementName);
  }

  get _element() {
    return this.element;
  }

  set _element(element) {
    if (element instanceof HTMLElement || element instanceof Document) {
      this.element = element;
    } else if (typeof element === 'string') {
      this.element = document.querySelector(element);
    }

    this.elementObserver.observe(this.element, {
      subtree: true,
      childList: true
    });
  }

  get _attributes() {
    return this._element.attributes;
  }

  set _attributes(attributes) {
    for (var [attributeKey, attributeValue] of Object.entries(attributes)) {
      if (typeof attributeValue === 'undefined') {
        this._element.removeAttribute(attributeKey);
      } else {
        this._element.setAttribute(attributeKey, attributeValue);
      }
    }
  }

  get ui() {
    return this._ui;
  }

  get _ui() {
    var ui = {};
    ui[':scope'] = this.element;
    Object.entries(this.uiElements).forEach((_ref) => {
      var [uiKey, uiValue] = _ref;

      if (typeof uiValue === 'string') {
        var scopeRegExp = new RegExp(/^(\:scope(\W){0,}>{0,})/);
        uiValue = uiValue.replace(scopeRegExp, '');
        ui[uiKey] = this.element.querySelectorAll(uiValue);
      } else if (uiValue instanceof HTMLElement || uiValue instanceof Document) {
        ui[uiKey] = uiValue;
      }
    });
    return ui;
  }

  set _ui(ui) {
    this.uiElements = ui;
  }

  get _uiEvents() {
    return this.uiEvents;
  }

  set _uiEvents(uiEvents) {
    this.uiEvents = uiEvents;
  }

  get _uiCallbacks() {
    this.uiCallbacks = this.uiCallbacks || {};
    return this.uiCallbacks;
  }

  set _uiCallbacks(uiCallbacks) {
    this.uiCallbacks = _index.default.addPropertiesToObject(uiCallbacks, this._uiCallbacks);
  }

  get _observerCallbacks() {
    this.observerCallbacks = this.observerCallbacks || {};
    return this.observerCallbacks;
  }

  set _observerCallbacks(observerCallbacks) {
    this.observerCallbacks = _index.default.addPropertiesToObject(observerCallbacks, this._observerCallbacks);
  }

  get elementObserver() {
    this._elementObserver = this._elementObserver || new MutationObserver(this.elementObserve.bind(this));
    return this._elementObserver;
  }

  get _insert() {
    return this.insert;
  }

  set _insert(insert) {
    this.insert = insert;
  }

  get _enabled() {
    return this.enabled || false;
  }

  set _enabled(enabled) {
    this.enabled = enabled;
  }

  get _templates() {
    this.templates = this.templates || {};
    return this.templates;
  }

  set _templates(templates) {
    this.templates = _index.default.addPropertiesToObject(templates, this._templates);
  }

  elementObserve(mutationRecordList, observer) {
    for (var [mutationRecordIndex, mutationRecord] of Object.entries(mutationRecordList)) {
      switch (mutationRecord.type) {
        case 'childList':
          var mutationRecordCategories = ['addedNodes', 'removedNodes'];

          for (var mutationRecordCategory of mutationRecordCategories) {
            if (mutationRecord[mutationRecordCategory].length) {
              this.resetUI();
            }
          }

          break;
      }
    }
  }

  autoInsert() {
    if (this.insert) {
      var parentElement;

      if (_index.default.typeOf(this.insert.element) === 'string') {
        parentElement = document.querySelectorAll(this.insert.element);
      } else {
        parentElement = this.insert.element;
      }

      if (parentElement instanceof HTMLElement || parentElement instanceof Node) {
        parentElement.insertAdjacentElement(this.insert.method, this.element);
      } else if (parentElement instanceof NodeList) {
        parentElement.forEach(_parentElement => {
          _parentElement.insertAdjacentElement(this.insert.method, this.element);
        });
      }
    }

    return this;
  }

  autoRemove() {
    if (this.element && this.element.parentElement) this.element.parentElement.removeChild(this.element);
    return this;
  }

  enableElement() {
    return this.setProperties(this.settings || {}, this.elementKeyMap);
  }

  disableElement() {
    return this.deleteProperties(this.settings || {}, this.elementKeyMap);
  }

  resetUI() {
    return this.disableUI().enableUI();
  }

  enableUI() {
    return this.setProperties(this.settings || {}, this.uiKeyMap).enableUIEvents();
  }

  disableUI() {
    return this.disableUIEvents().deleteProperties(this.settings || {}, this.uiKeyMap);
  }

  enableUIEvents() {
    if (this.uiEvents && this.ui && this.uiCallbacks) {
      _index.default.bindEventsToTargetViewObjects(this.uiEvents, this.ui, this.uiCallbacks);
    }

    return this;
  }

  enableRenderers() {
    var settings = this.settings || {};

    _index.default.objectQuery('[/^render.*?/]', settings).forEach((_ref2) => {
      var [rendererName, rendererFunction] = _ref2;
      this[rendererName] = rendererFunction;
    });

    return this;
  }

  disableRenderers() {
    var settings = this.settings || {};

    _index.default.objectQuery('[/^render.*?/]', settings).forEach((rendererName, rendererFunction) => {
      delete this[rendererName];
    });

    return this;
  }

  disableUIEvents() {
    if (this.uiEvents && this.ui && this.uiCallbacks) {
      _index.default.unbindEventsFromTargetViewObjects(this.uiEvents, this.ui, this.uiCallbacks);
    }

    return this;
  }

  enable() {
    var settings = this.settings || {};

    if (!this._enabled) {
      this.enableRenderers().enableElement().enableUI()._enabled = true;
    }

    return this;
  }

  disable() {
    if (this._enabled) {
      this.disableRenderers().disableUI().disableElement()._enabled = false;
    }

    return this;
  }

};
var _default = View;
exports.default = _default;