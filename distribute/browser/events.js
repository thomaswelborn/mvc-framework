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