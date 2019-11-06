(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.MVC = factory());
}(this, (function () { 'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _AwaitValue(value) {
  this.wrapped = value;
}

function _AsyncGenerator(gen) {
  var front, back;

  function send(key, arg) {
    return new Promise(function (resolve, reject) {
      var request = {
        key: key,
        arg: arg,
        resolve: resolve,
        reject: reject,
        next: null
      };

      if (back) {
        back = back.next = request;
      } else {
        front = back = request;
        resume(key, arg);
      }
    });
  }

  function resume(key, arg) {
    try {
      var result = gen[key](arg);
      var value = result.value;
      var wrappedAwait = value instanceof _AwaitValue;
      Promise.resolve(wrappedAwait ? value.wrapped : value).then(function (arg) {
        if (wrappedAwait) {
          resume("next", arg);
          return;
        }

        settle(result.done ? "return" : "normal", arg);
      }, function (err) {
        resume("throw", err);
      });
    } catch (err) {
      settle("throw", err);
    }
  }

  function settle(type, value) {
    switch (type) {
      case "return":
        front.resolve({
          value: value,
          done: true
        });
        break;

      case "throw":
        front.reject(value);
        break;

      default:
        front.resolve({
          value: value,
          done: false
        });
        break;
    }

    front = front.next;

    if (front) {
      resume(front.key, front.arg);
    } else {
      back = null;
    }
  }

  this._invoke = send;

  if (typeof gen.return !== "function") {
    this.return = undefined;
  }
}

if (typeof Symbol === "function" && Symbol.asyncIterator) {
  _AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
    return this;
  };
}

_AsyncGenerator.prototype.next = function (arg) {
  return this._invoke("next", arg);
};

_AsyncGenerator.prototype.throw = function (arg) {
  return this._invoke("throw", arg);
};

_AsyncGenerator.prototype.return = function (arg) {
  return this._invoke("return", arg);
};

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
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

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var Events =
/*#__PURE__*/
function () {
  function Events() {
    _classCallCheck(this, Events);
  }

  _createClass(Events, [{
    key: "getEventCallbacks",
    value: function getEventCallbacks(eventName) {
      return this._events[eventName] || {};
    }
  }, {
    key: "getEventCallbackName",
    value: function getEventCallbackName(eventCallback) {
      return eventCallback.name.length ? eventCallback.name : 'anonymousFunction';
    }
  }, {
    key: "getEventCallbackGroup",
    value: function getEventCallbackGroup(eventCallbacks, eventCallbackName) {
      return eventCallbacks[eventCallbackName] || [];
    }
  }, {
    key: "on",
    value: function on(eventName, eventCallback) {
      var eventCallbacks = this.getEventCallbacks(eventName);
      var eventCallbackName = this.getEventCallbackName(eventCallback);
      var eventCallbackGroup = this.getEventCallbackGroup(eventCallbacks, eventCallbackName);
      eventCallbackGroup.push(eventCallback);
      eventCallbacks[eventCallbackName] = eventCallbackGroup;
      this._events[eventName] = eventCallbacks;
      return this;
    }
  }, {
    key: "off",
    value: function off() {
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
  }, {
    key: "emit",
    value: function emit(eventName, eventData) {
      var _arguments = Object.values(arguments);

      var eventCallbacks = Object.entries(this.getEventCallbacks(eventName));

      for (var _i = 0, _eventCallbacks = eventCallbacks; _i < _eventCallbacks.length; _i++) {
        var _eventCallbacks$_i = _slicedToArray(_eventCallbacks[_i], 2),
            eventCallbackGroupName = _eventCallbacks$_i[0],
            eventCallbackGroup = _eventCallbacks$_i[1];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = eventCallbackGroup[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var eventCallback = _step.value;
            var additionalArguments = _arguments.splice(2) || [];
            eventCallback.apply(void 0, [eventData].concat(_toConsumableArray(additionalArguments)));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      return this;
    }
  }, {
    key: "_events",
    get: function get() {
      this.events = this.events || {};
      return this.events;
    }
  }]);

  return Events;
}();

var Channel =
/*#__PURE__*/
function () {
  function Channel() {
    _classCallCheck(this, Channel);
  }

  _createClass(Channel, [{
    key: "response",
    value: function (_response) {
      function response(_x, _x2) {
        return _response.apply(this, arguments);
      }

      response.toString = function () {
        return _response.toString();
      };

      return response;
    }(function (responseName, responseCallback) {
      if (responseCallback) {
        this._responses[responseName] = responseCallback;
      } else {
        return this._responses[response];
      }
    })
  }, {
    key: "request",
    value: function request(responseName) {
      if (this._responses[responseName]) {
        var _this$_responses;

        var _arguments = Array.prototype.slice.call(arguments).slice(1);

        return (_this$_responses = this._responses)[responseName].apply(_this$_responses, _toConsumableArray(_arguments));
      }
    }
  }, {
    key: "off",
    value: function off(responseName) {
      if (responseName) {
        delete this._responses[responseName];
      } else {
        for (var _i = 0, _Object$keys = Object.keys(this._responses); _i < _Object$keys.length; _i++) {
          var _Object$keys$_i = _slicedToArray(_Object$keys[_i], 1),
              _responseName = _Object$keys$_i[0];

          delete this._responses[_responseName];
        }
      }
    }
  }, {
    key: "_responses",
    get: function get() {
      this.responses = this.responses || this.responses;
      return this.responses;
    }
  }]);

  return Channel;
}();

var Channels =
/*#__PURE__*/
function () {
  function Channels() {
    _classCallCheck(this, Channels);
  }

  _createClass(Channels, [{
    key: "channel",
    value: function channel(channelName) {
      this._channels[channelName] = this._channels[channelName] ? this._channels[channelName] : new Channel();
      return this._channels[channelName];
    }
  }, {
    key: "off",
    value: function off(channelName) {
      delete this._channels[channelName];
    }
  }, {
    key: "_channels",
    get: function get() {
      this.channels = this.channels || {};
      return this.channels;
    }
  }]);

  return Channels;
}();

var addPropertiesToObject = function addPropertiesToObject() {
  var targetObject;

  switch (arguments.length) {
    case 2:
      var properties = arguments[0];
      targetObject = arguments[1];
      Object.entries(properties).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            propertyName = _ref2[0],
            propertyValue = _ref2[1];

        targetObject[propertyName] = propertyValue;
      });
      break;

    case 3:
      var propertyName = arguments[0];
      var propertyValue = arguments[1];
      targetObject = arguments[2];
      targetObject[propertyName] = propertyValue;
      break;
  }

  return targetObject;
};

var isArray = function isArray(object) {
  return Array.isArray(object);
};

var isObject = function isObject(object) {
  return !Array.isArray(object) && object !== null ? _typeof(object) === 'object' : false;
};

var isHTMLElement = function isHTMLElement(object) {
  return object instanceof HTMLElement;
};

var parseNotation = function parseNotation(string) {
  if (string.charAt(0) === '[' && string.charAt(string.length - 1) == ']') {
    string = string.slice(1, -1).split('][');
  } else {
    string = string.split('.');
  }

  return string;
};

var parseFragment = function parseFragment(fragment) {
  if (fragment.charAt(0) === '/' && fragment.charAt(fragment.length - 1) == '/') {
    fragment = fragment.slice(1, -1);
    fragment = new RegExp('^'.concat(fragment, '$'));
  }

  return fragment;
};

var objectQuery = function objectQuery(string, context) {
  var stringData = parseNotation(string);
  if (stringData[0] === '@') stringData.splice(0, 1);
  if (!stringData.length) return context;
  context = isObject(context) ? Object.entries(context) : context;
  return stringData.reduce(function (object, fragment, fragmentIndex, fragments) {
    var properties = [];
    fragment = parseFragment(fragment);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = object[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _slicedToArray(_step.value, 2),
            propertyKey = _step$value[0],
            propertyValue = _step$value[1];

        if (propertyKey.match(fragment)) {
          if (fragmentIndex === fragments.length - 1) {
            properties = properties.concat([[propertyKey, propertyValue]]);
          } else {
            properties = properties.concat(Object.entries(propertyValue));
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    object = properties;
    return object;
  }, context);
};

var toggleEventsForTargetObjects = function toggleEventsForTargetObjects(toggleMethod, events, targetObjects, callbacks) {
  Object.entries(events).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        eventSettings = _ref2[0],
        eventCallbackName = _ref2[1];

    var eventData = eventSettings.split(' ');
    var eventTargetSettings = eventData[0];
    var eventName = eventData[1];
    var eventTargets = objectQuery(eventTargetSettings, targetObjects);
    eventTargets = !isArray(eventTargets) ? [['@', eventTargets]] : eventTargets;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = eventTargets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _slicedToArray(_step.value, 2),
            eventTargetName = _step$value[0],
            eventTarget = _step$value[1];

        var eventMethodName = toggleMethod === 'on' ? 'on' : 'off';
        var eventCallback = objectQuery(eventCallbackName, callbacks)[0][1];
        eventTarget[eventMethodName](eventName, eventCallback);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });
};

var toggleEventsForTargetViewObjects = function toggleEventsForTargetViewObjects(toggleMethod, events, targetObjects, callbacks) {
  Object.entries(events).forEach(function (eventSettings, eventCallbackName) {
    var eventData = eventSettings.split(' ');
    var eventTargetSettings = eventData[0];
    var eventName = eventData[1];
    var eventTargets = objectQuery(eventTargetSettings, targetObjects);
    eventTargets = !isArray(eventTargets) ? [['@', eventTargets]] : eventTargets;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = eventTargets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _step$value = _slicedToArray(_step.value, 2),
            eventTargetName = _step$value[0],
            eventTarget = _step$value[1];

        var eventMethodName = toggleMethod === 'on' ? 'addEventListener' : 'removeEventListener';
        var eventCallback = objectQuery(eventCallbackName, callbacks)[0][1];

        if (eventTarget instanceof NodeList) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = eventTarget[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _eventTarget = _step2.value;

              _eventTarget[eventMethodName](eventName, eventCallback);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        } else if (eventTarget instanceof HTMLElement) {
          eventTarget[eventMethodName](eventName, eventCallback);
        } else {
          eventTarget[eventMethodName](eventName, eventCallback);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });
};

var bindEventsToTargetViewObjects = function bindEventsToTargetViewObjects() {
  toggleEventsForTargetViewObjects.apply(void 0, ['on'].concat(Array.prototype.slice.call(arguments)));
};

var unbindEventsFromTargetViewObjects = function unbindEventsFromTargetViewObjects() {
  toggleEventsForTargetViewObjects.apply(void 0, ['off'].concat(Array.prototype.slice.call(arguments)));
};

var bindEventsToTargetObjects = function bindEventsToTargetObjects() {
  toggleEventsForTargetObjects.apply(void 0, ['on'].concat(Array.prototype.slice.call(arguments)));
};

var unbindEventsFromTargetObjects = function unbindEventsFromTargetObjects() {
  toggleEventsForTargetObjects.apply(void 0, ['off'].concat(Array.prototype.slice.call(arguments)));
};

var typeOf = function typeOf(data) {
  switch (_typeof(data)) {
    case 'object':
      var _object;

      if (isArray(data)) {
        // Array
        return 'array';
      } else if (isObject(data)) {
        // Object
        return 'object';
      } else if (data === null) {
        // Null
        return 'null';
      }

      return _object;

    case 'string':
    case 'number':
    case 'boolean':
    case 'undefined':
    case 'function':
      return _typeof(data);
      break;
  }
};

var paramsToObject = function paramsToObject(params) {
  var params = params.split('&');
  var object = {};
  params.forEach(function (paramData) {
    paramData = paramData.split('=');
    object[paramData[0]] = decodeURIComponent(paramData[1] || '');
  });
  return JSON.parse(JSON.stringify(object));
};

var UID = function UID() {
  var uuid = '',
      ii;

  for (ii = 0; ii < 32; ii += 1) {
    switch (ii) {
      case 8:
      case 20:
        uuid += '-';
        uuid += (Math.random() * 16 | 0).toString(16);
        break;

      case 12:
        uuid += '-';
        uuid += '4';
        break;

      case 16:
        uuid += '-';
        uuid += (Math.random() * 4 | 8).toString(16);
        break;

      default:
        uuid += (Math.random() * 16 | 0).toString(16);
    }
  }

  return uuid;
};

var _Utils;

var Utils = (_Utils = {
  addPropertiesToObject: addPropertiesToObject,
  bindEventsToTargetViewObjects: bindEventsToTargetViewObjects,
  unbindEventsFromTargetViewObjects: unbindEventsFromTargetViewObjects,
  bindEventsToTargetObjects: bindEventsToTargetObjects,
  unbindEventsFromTargetObjects: unbindEventsFromTargetObjects,
  isArray: isArray,
  isObject: isObject,
  typeOf: typeOf,
  isHTMLElement: isHTMLElement,
  objectQuery: objectQuery,
  paramsToObject: paramsToObject
}, _defineProperty(_Utils, "typeOf", typeOf), _defineProperty(_Utils, "uid", UID), _Utils);

var Base =
/*#__PURE__*/
function (_Events) {
  _inherits(Base, _Events);

  function Base(settings, configuration) {
    var _this;

    _classCallCheck(this, Base);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Base).call(this));
    if (settings) _this._settings = settings;
    if (configuration) _this._configuration = configuration;
    return _this;
  }

  _createClass(Base, [{
    key: "setProperties",
    value: function setProperties(settings, keyMap, switches) {
      var _this2 = this;

      switches = switches || {};
      var settingsCount = Object.keys(settings).length;
      var keyCount = 0;
      keyMap.some(function (key) {
        if (settings[key] !== undefined) {
          keyCount += 1;

          if (switches[key]) {
            switches[key](settings[key]);
          } else {
            _this2['_'.concat(key)] = settings[key];
          }
        }

        return keyCount === settingsCount ? true : false;
      });
      return this;
    }
  }, {
    key: "deleteProperties",
    value: function deleteProperties(settings, keyMap, switches) {
      var _this3 = this;

      switches = switches || {};
      var settingsCount = Object.keys(settings).length;
      var keyCount = 0;
      keyMap.some(function (key) {
        if (settings[key] !== undefined) {
          keyCount += 1;

          if (switches[key]) {
            switches[key](settings[key]);
          } else {
            delete _this3[key];
          }
        }

        return keyCount === settingsCount ? true : false;
      });
      return this;
    }
  }, {
    key: "uid",
    get: function get() {
      this._uid = this._uid ? this._uid : Utils.UID();
      return this._uid;
    }
  }, {
    key: "_name",
    get: function get() {
      return this.name;
    },
    set: function set(name) {
      this.name = name;
    }
  }, {
    key: "_configuration",
    get: function get() {
      this.configuration = this.configuration || {};
      return this.configuration;
    },
    set: function set(configuration) {
      this.configuration = configuration;
    }
  }, {
    key: "_settings",
    get: function get() {
      this.settings = this.settings || {};
      return this.settings;
    },
    set: function set(settings) {
      this.settings = Utils.addPropertiesToObject(settings, this._settings);
    }
  }]);

  return Base;
}(Events);

var Service =
/*#__PURE__*/
function (_Base) {
  _inherits(Service, _Base);

  function Service() {
    var _this;

    _classCallCheck(this, Service);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Service).apply(this, arguments));
    return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
  }

  _createClass(Service, [{
    key: "request",
    value: function request(data) {
      var _this2 = this;

      data = data || this.data || null;
      return new Promise(function (resolve, reject) {
        if (_this2._xhr.status === 200) _this2._xhr.abort();

        _this2._xhr.open(_this2.type, _this2.url);

        _this2._headers = _this2.settings.headers || [_this2._defaults.contentType];
        _this2._xhr.onload = resolve;
        _this2._xhr.onerror = reject;

        _this2._xhr.send(data);
      }).then(function (response) {
        _this2.emit('xhr:resolve', {
          name: 'xhr:resolve',
          data: response.currentTarget
        }, _this2);

        return response;
      })["catch"](function (error) {
        throw error;
      });
    }
  }, {
    key: "enable",
    value: function enable() {
      var settings = this.settings;

      if (!this.enabled && Object.keys(settings).length) {
        if (settings.type) this._type = settings.type;
        if (settings.url) this._url = settings.url;
        if (settings.data) this._data = settings.data || null;
        if (this.settings.responseType) this._responseType = this._settings.responseType;
        this._enabled = true;
      }

      return this;
    }
  }, {
    key: "disable",
    value: function disable() {
      var settings = this.settings;

      if (this.enabled && Object.keys(settings).length) {
        delete this._type;
        delete this._url;
        delete this._data;
        delete this._headers;
        delete this._responseType;
        this._enabled = false;
      }

      return this;
    }
  }, {
    key: "_defaults",
    get: function get() {
      return this.defaults || {
        contentType: {
          'Content-Type': 'application/json'
        },
        responseType: 'json'
      };
    }
  }, {
    key: "_responseTypes",
    get: function get() {
      return ['', 'arraybuffer', 'blob', 'document', 'json', 'text'];
    }
  }, {
    key: "_responseType",
    get: function get() {
      return this.responseType;
    },
    set: function set(responseType) {
      this._xhr.responseType = this._responseTypes.find(function (responseTypeItem) {
        return responseTypeItem === responseType;
      }) || this._defaults.responseType;
    }
  }, {
    key: "_type",
    get: function get() {
      return this.type;
    },
    set: function set(type) {
      this.type = type;
    }
  }, {
    key: "_url",
    get: function get() {
      return this.url;
    },
    set: function set(url) {
      this.url = url;
    }
  }, {
    key: "_headers",
    get: function get() {
      return this.headers || [];
    },
    set: function set(headers) {
      var _this3 = this;

      this._headers.length = 0;
      headers.forEach(function (header) {
        _this3._headers.push(header);

        header = Object.entries(header)[0];

        _this3._xhr.setRequestHeader(header[0], header[1]);
      });
    }
  }, {
    key: "_data",
    get: function get() {
      return this.data;
    },
    set: function set(data) {
      this.data = data;
    }
  }, {
    key: "_xhr",
    get: function get() {
      this.xhr = this.xhr ? this.xhr : new XMLHttpRequest();
      return this.xhr;
    }
  }, {
    key: "_enabled",
    get: function get() {
      return this.enabled || false;
    },
    set: function set(enabled) {
      this.enabled = enabled;
    }
  }]);

  return Service;
}(Base);

var Model =
/*#__PURE__*/
function (_Base) {
  _inherits(Model, _Base);

  function Model() {
    var _this;

    _classCallCheck(this, Model);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Model).apply(this, arguments));
    return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
  }

  _createClass(Model, [{
    key: "get",
    value: function get() {
      switch (arguments.length) {
        case 0:
          return this._data;
          break;

        case 1:
          var key = arguments[0];
          return this._data[key];
          break;
      }
    }
  }, {
    key: "set",
    value: function set() {
      var _this2 = this;

      this._history = this.parse();

      switch (arguments.length) {
        case 1:
          this._isSetting = true;

          var _arguments = Object.entries(arguments[0]);

          _arguments.forEach(function (_ref, index) {
            var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                value = _ref2[1];

            if (index === _arguments.length - 1) _this2._isSetting = false;

            _this2.setDataProperty(key, value);
          });

          break;

        case 2:
          var key = arguments[0];
          var value = arguments[1];
          this.setDataProperty(key, value);
          break;
      }

      return this;
    }
  }, {
    key: "unset",
    value: function unset() {
      this._history = this.parse();

      switch (arguments.length) {
        case 0:
          for (var _i = 0, _Object$keys = Object.keys(this._data); _i < _Object$keys.length; _i++) {
            var _key = _Object$keys[_i];
            this.unsetDataProperty(_key);
          }

          break;

        case 1:
          var key = arguments[0];
          this.unsetDataProperty(key);
          break;
      }

      return this;
    }
  }, {
    key: "setDB",
    value: function setDB() {
      var db = this._db;

      switch (arguments.length) {
        case 1:
          var _arguments = Object.entries(arguments[0]);

          _arguments.forEach(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                key = _ref4[0],
                value = _ref4[1];

            db[key] = value;
          });

          break;

        case 2:
          var key = arguments[0];
          var value = arguments[1];
          db[key] = value;
          break;
      }

      this._db = db;
      return this;
    }
  }, {
    key: "unsetDB",
    value: function unsetDB() {
      switch (arguments.length) {
        case 0:
          delete this._db;
          break;

        case 1:
          var db = this._db;
          var key = arguments[0];
          delete db[key];
          this._db = db;
          break;
      }

      return this;
    }
  }, {
    key: "setDataProperty",
    value: function setDataProperty(key, value) {
      if (!this._data['_'.concat(key)]) {
        var context = this;
        Object.defineProperties(this._data, _defineProperty({}, '_'.concat(key), {
          configurable: true,
          get: function get() {
            return this[key];
          },
          set: function set(value) {
            var schema = context._settings.schema;

            if (schema && schema[key]) {
              this[key] = value;
              context._changing[key] = value;
              if (this.localStorage) context.setDB(key, value);
            } else if (!schema) {
              this[key] = value;
              context._changing[key] = value;
              if (this.localStorage) context.setDB(key, value);
            }

            var setValueEventName = ['set', ':', key].join('');
            var setEventName = 'set';
            context.emit(setValueEventName, {
              name: setValueEventName,
              data: {
                key: key,
                value: value
              }
            }, context);

            if (!context._isSetting) {
              if (!Object.values(context._changing).length) {
                context.emit(setEventName, {
                  name: setEventName,
                  data: context._data
                }, context);
              } else {
                context.emit(setEventName, {
                  name: setEventName,
                  data: Object.assign({}, context._changing, context._data)
                }, context);
              }

              delete context.changing;
            }
          }
        }));
      }

      this._data['_'.concat(key)] = value;
      return this;
    }
  }, {
    key: "unsetDataProperty",
    value: function unsetDataProperty(key) {
      var unsetValueEventName = ['unset', ':', key].join('');
      var unsetEventName = 'unset';
      var unsetValue = this._data[key];
      delete this._data['_'.concat(key)];
      delete this._data[key];
      this.emit(unsetValueEventName, {
        name: unsetValueEventName,
        data: {
          key: key,
          value: unsetValue
        }
      }, this);
      this.emit(unsetEventName, {
        name: unsetEventName,
        data: {
          key: key,
          value: unsetValue
        }
      }, this);
      return this;
    }
  }, {
    key: "setDefaults",
    value: function setDefaults() {
      var _defaults$$1 = {};
      if (this.defaults) Object.assign(_defaults$$1, this.defaults);
      if (this.localStorage) Object.assign(_defaults$$1, this._db);
      if (Object.keys(_defaults$$1)) this.set(_defaults$$1);
    }
  }, {
    key: "resetServiceEvents",
    value: function resetServiceEvents() {
      return this.disableServiceEvents().enableServiceEvents();
    }
  }, {
    key: "enableServiceEvents",
    value: function enableServiceEvents() {
      if (this.services && this.serviceEvents && this.serviceCallbacks) {
        Utils.bindEventsToTargetObjects(this.serviceEvents, this.services, this.serviceCallbacks);
      }
    }
  }, {
    key: "disableServiceEvents",
    value: function disableServiceEvents() {
      if (this.services && this.serviceEvents && this.serviceCallbacks) {
        Utils.unbindEventsFromTargetObjects(this.serviceEvents, this.services, this.serviceCallbacks);
      }
    }
  }, {
    key: "resetDataEvents",
    value: function resetDataEvents() {
      return this.disableDataEvents().enableDataEvents();
    }
  }, {
    key: "enableDataEvents",
    value: function enableDataEvents() {
      if (this.dataEvents && this.dataCallbacks) {
        Utils.bindEventsToTargetObjects(this.dataEvents, this, this.dataCallbacks);
      }
    }
  }, {
    key: "disableDataEvents",
    value: function disableDataEvents() {
      Utils.unbindEventsFromTargetObjects(this.dataEvents, this, this.dataCallbacks);
    }
  }, {
    key: "enable",
    value: function enable() {
      var settings = this.settings;

      if (!this.enabled) {
        this.setProperties(settings || {}, this.keyMap, {
          'data': function (value) {
            this.set(value);
          }.bind(this)
        });
        this.enableServiceEvents();
        this.enableDataEvents();
        this._enabled = true;
      }

      return this;
    }
  }, {
    key: "disable",
    value: function disable() {
      var settings = this.settings;

      if (this.enabled) {
        this.disableServiceEvents();
        this.disableDataEvents();
        this.deleteProperties(settings || {}, this.keyMap);
        this._enabled = false;
      }

      return this;
    }
  }, {
    key: "parse",
    value: function parse(data) {
      data = data || this._data || {};
      return JSON.parse(JSON.stringify(data));
    }
  }, {
    key: "keyMap",
    get: function get() {
      return ['name', 'schema', 'localStorage', 'histiogram', 'services', 'serviceCallbacks', 'serviceEvents', 'data', 'dataCallbacks', 'dataEvents', 'defaults'];
    }
  }, {
    key: "_schema",
    get: function get() {
      return this._schema;
    },
    set: function set(schema) {
      this.schema = schema;
    }
  }, {
    key: "_isSetting",
    get: function get() {
      return this.isSetting;
    },
    set: function set(isSetting) {
      this.isSetting = isSetting;
    }
  }, {
    key: "_changing",
    get: function get() {
      this.changing = this.changing || {};
      return this.changing;
    }
  }, {
    key: "_localStorage",
    get: function get() {
      return this.localStorage;
    },
    set: function set(localStorage) {
      this.localStorage = localStorage;
    }
  }, {
    key: "_defaults",
    get: function get() {
      return this.defaults;
    },
    set: function set(defaults) {
      this.defaults = defaults;
    }
  }, {
    key: "_histiogram",
    get: function get() {
      return this.histiogram || {
        length: 1
      };
    },
    set: function set(histiogram) {
      this.histiogram = Object.assign(this._histiogram, histiogram);
    }
  }, {
    key: "_history",
    get: function get() {
      this.history = this.history || [];
      return this.history;
    },
    set: function set(data) {
      if (Object.keys(data).length) {
        if (this._histiogram.length) {
          this._history.unshift(this.parse(data));

          this._history.splice(this._histiogram.length);
        }
      }
    }
  }, {
    key: "_db",
    get: function get() {
      var db = localStorage.getItem(this.localStorage.endpoint);
      this.db = db || '{}';
      return JSON.parse(this.db);
    },
    set: function set(db) {
      db = JSON.stringify(db);
      localStorage.setItem(this.localStorage.endpoint, db);
    }
  }, {
    key: "_data",
    get: function get() {
      this.data = this.data || {};
      return this.data;
    }
  }, {
    key: "_dataEvents",
    get: function get() {
      this.dataEvents = this.dataEvents || {};
      return this.dataEvents;
    },
    set: function set(dataEvents) {
      this.dataEvents = Utils.addPropertiesToObject(dataEvents, this._dataEvents);
    }
  }, {
    key: "_dataCallbacks",
    get: function get() {
      this.dataCallbacks = this.dataCallbacks || {};
      return this.dataCallbacks;
    },
    set: function set(dataCallbacks) {
      this.dataCallbacks = Utils.addPropertiesToObject(dataCallbacks, this._dataCallbacks);
    }
  }, {
    key: "_services",
    get: function get() {
      this.services = this.services || {};
      return this.services;
    },
    set: function set(services) {
      this.services = Utils.addPropertiesToObject(services, this._services);
    }
  }, {
    key: "_serviceEvents",
    get: function get() {
      this.serviceEvents = this.serviceEvents || {};
      return this.serviceEvents;
    },
    set: function set(serviceEvents) {
      this.serviceEvents = Utils.addPropertiesToObject(serviceEvents, this._serviceEvents);
    }
  }, {
    key: "_serviceCallbacks",
    get: function get() {
      this.serviceCallbacks = this.serviceCallbacks || {};
      return this.serviceCallbacks;
    },
    set: function set(serviceCallbacks) {
      this.serviceCallbacks = Utils.addPropertiesToObject(serviceCallbacks, this._serviceCallbacks);
    }
  }, {
    key: "_enabled",
    get: function get() {
      return this.enabled || false;
    },
    set: function set(enabled) {
      this.enabled = enabled;
    }
  }]);

  return Model;
}(Base);

var View =
/*#__PURE__*/
function (_Base) {
  _inherits(View, _Base);

  function View() {
    var _this;

    _classCallCheck(this, View);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(View).apply(this, arguments));

    _this.enable();

    return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
  }

  _createClass(View, [{
    key: "elementObserve",
    value: function elementObserve(mutationRecordList, observer) {
      for (var _i = 0, _Object$entries = Object.entries(mutationRecordList); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            mutationRecordIndex = _Object$entries$_i[0],
            mutationRecord = _Object$entries$_i[1];

        switch (mutationRecord.type) {
          case 'childList':
            var mutationRecordCategories = ['addedNodes', 'removedNodes'];

            for (var _i2 = 0, _mutationRecordCatego = mutationRecordCategories; _i2 < _mutationRecordCatego.length; _i2++) {
              var mutationRecordCategory = _mutationRecordCatego[_i2];

              if (mutationRecord[mutationRecordCategory].length) {
                this.resetUI();
              }
            }

            break;
        }
      }
    }
  }, {
    key: "autoInsert",
    value: function autoInsert() {
      var _this2 = this;

      if (this.insert) {
        var parentElement;

        if (Utils.typeOf(this.insert.element) === 'string') {
          parentElement = document.querySelectorAll(this.insert.element);
        } else {
          parentElement = this.insert.element;
        }

        if (parentElement instanceof HTMLElement || parentElement instanceof Node) {
          parentElement.insertAdjacentElement(this.insert.method, this.element);
        } else if (parentElement instanceof NodeList) {
          parentElement.forEach(function (_parentElement) {
            _parentElement.insertAdjacentElement(_this2.insert.method, _this2.element);
          });
        }
      }

      return this;
    }
  }, {
    key: "autoRemove",
    value: function autoRemove() {
      if (this.element && this.element.parentElement) this.element.parentElement.removeChild(this.element);
      return this;
    }
  }, {
    key: "enableElement",
    value: function enableElement() {
      return this.setProperties(this.settings || {}, this.elementKeyMap);
    }
  }, {
    key: "disableElement",
    value: function disableElement() {
      return this.deleteProperties(this.settings || {}, this.elementKeyMap);
    }
  }, {
    key: "resetUI",
    value: function resetUI() {
      return this.disableUI().enableUI();
    }
  }, {
    key: "enableUI",
    value: function enableUI() {
      return this.setProperties(this.settings || {}, this.uiKeyMap).enableUIEvents();
    }
  }, {
    key: "disableUI",
    value: function disableUI() {
      return this.disableUIEvents().deleteProperties(this.settings || {}, this.uiKeyMap);
    }
  }, {
    key: "enableUIEvents",
    value: function enableUIEvents() {
      if (this.uiEvents && this.ui && this.uiCallbacks) {
        Utils.bindEventsToTargetViewObjects(this.uiEvents, this.ui, this.uiCallbacks);
      }

      return this;
    }
  }, {
    key: "enableRenderers",
    value: function enableRenderers() {
      var _this3 = this;

      var settings = this.settings || {};
      Utils.objectQuery('[/^render.*?/]', settings).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            rendererName = _ref2[0],
            rendererFunction = _ref2[1];

        _this3[rendererName] = rendererFunction;
      });
      return this;
    }
  }, {
    key: "disableRenderers",
    value: function disableRenderers() {
      var _this4 = this;

      var settings = this.settings || {};
      Utils.objectQuery('[/^render.*?/]', settings).forEach(function (rendererName, rendererFunction) {
        delete _this4[rendererName];
      });
      return this;
    }
  }, {
    key: "disableUIEvents",
    value: function disableUIEvents() {
      if (this.uiEvents && this.ui && this.uiCallbacks) {
        Utils.unbindEventsFromTargetViewObjects(this.uiEvents, this.ui, this.uiCallbacks);
      }

      return this;
    }
  }, {
    key: "enable",
    value: function enable() {
      if (!this._enabled) {
        this.enableRenderers().enableElement().enableUI()._enabled = true;
      }

      return this;
    }
  }, {
    key: "disable",
    value: function disable() {
      if (this._enabled) {
        this.disableRenderers().disableUI().disableElement()._enabled = false;
      }

      return this;
    }
  }, {
    key: "elementKeyMap",
    get: function get() {
      return ['elementName', 'element', 'attributes', 'templates', 'insert'];
    }
  }, {
    key: "uiKeyMap",
    get: function get() {
      return ['ui', 'uiCallbacks', 'uiEvents'];
    }
  }, {
    key: "_elementName",
    get: function get() {
      return this._element.tagName;
    },
    set: function set(elementName) {
      if (!this._element) this._element = document.createElement(elementName);
    }
  }, {
    key: "_element",
    get: function get() {
      return this.element;
    },
    set: function set(element) {
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
  }, {
    key: "_attributes",
    get: function get() {
      return this._element.attributes;
    },
    set: function set(attributes) {
      for (var _i3 = 0, _Object$entries2 = Object.entries(attributes); _i3 < _Object$entries2.length; _i3++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i3], 2),
            attributeKey = _Object$entries2$_i[0],
            attributeValue = _Object$entries2$_i[1];

        if (typeof attributeValue === 'undefined') {
          this._element.removeAttribute(attributeKey);
        } else {
          this._element.setAttribute(attributeKey, attributeValue);
        }
      }
    }
  }, {
    key: "ui",
    get: function get() {
      return this._ui;
    }
  }, {
    key: "_ui",
    get: function get() {
      var _this5 = this;

      var ui = {};
      ui[':scope'] = this.element;
      Object.entries(this.uiElements).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            uiKey = _ref4[0],
            uiValue = _ref4[1];

        if (typeof uiValue === 'string') {
          var scopeRegExp = new RegExp(/^(\:scope(\W){0,}>{0,})/);
          uiValue = uiValue.replace(scopeRegExp, '');
          ui[uiKey] = _this5.element.querySelectorAll(uiValue);
        } else if (uiValue instanceof HTMLElement || uiValue instanceof Document) {
          ui[uiKey] = uiValue;
        }
      });
      return ui;
    },
    set: function set(ui) {
      this.uiElements = ui;
    }
  }, {
    key: "_uiEvents",
    get: function get() {
      return this.uiEvents;
    },
    set: function set(uiEvents) {
      this.uiEvents = uiEvents;
    }
  }, {
    key: "_uiCallbacks",
    get: function get() {
      this.uiCallbacks = this.uiCallbacks || {};
      return this.uiCallbacks;
    },
    set: function set(uiCallbacks) {
      this.uiCallbacks = Utils.addPropertiesToObject(uiCallbacks, this._uiCallbacks);
    }
  }, {
    key: "_observerCallbacks",
    get: function get() {
      this.observerCallbacks = this.observerCallbacks || {};
      return this.observerCallbacks;
    },
    set: function set(observerCallbacks) {
      this.observerCallbacks = Utils.addPropertiesToObject(observerCallbacks, this._observerCallbacks);
    }
  }, {
    key: "elementObserver",
    get: function get() {
      this._elementObserver = this._elementObserver || new MutationObserver(this.elementObserve.bind(this));
      return this._elementObserver;
    }
  }, {
    key: "_insert",
    get: function get() {
      return this.insert;
    },
    set: function set(insert) {
      this.insert = insert;
    }
  }, {
    key: "_enabled",
    get: function get() {
      return this.enabled || false;
    },
    set: function set(enabled) {
      this.enabled = enabled;
    }
  }, {
    key: "_templates",
    get: function get() {
      this.templates = this.templates || {};
      return this.templates;
    },
    set: function set(templates) {
      this.templates = Utils.addPropertiesToObject(templates, this._templates);
    }
  }]);

  return View;
}(Base);

var Controller =
/*#__PURE__*/
function (_Base) {
  _inherits(Controller, _Base);

  function Controller() {
    _classCallCheck(this, Controller);

    return _possibleConstructorReturn(this, _getPrototypeOf(Controller).apply(this, arguments));
  }

  _createClass(Controller, [{
    key: "resetModelEvents",
    value: function resetModelEvents() {
      return this.disableModelEvents().enableModelEvents();
    }
  }, {
    key: "enableModelEvents",
    value: function enableModelEvents() {
      if (this.modelEvents && this.models && this.modelCallbacks) {
        Utils.bindEventsToTargetObjects(this.modelEvents, this.models, this.modelCallbacks);
      }

      return this;
    }
  }, {
    key: "disableModelEvents",
    value: function disableModelEvents() {
      if (this.modelEvents && this.models && this.modelCallbacks) {
        Utils.unbindEventsFromTargetObjects(this.modelEvents, this.models, this.modelCallbacks);
      }

      return this;
    }
  }, {
    key: "resetViewEvents",
    value: function resetViewEvents() {
      return this.disableViewEvents().enableViewEvents();
    }
  }, {
    key: "enableViewEvents",
    value: function enableViewEvents() {
      if (this.viewEvents && this.views && this.viewCallbacks) {
        Utils.bindEventsToTargetObjects(this.viewEvents, this.views, this.viewCallbacks);
      }

      return this;
    }
  }, {
    key: "disableViewEvents",
    value: function disableViewEvents() {
      if (this.viewEvents && this.views && this.viewCallbacks) {
        Utils.unbindEventsFromTargetObjects(this.viewEvents, this.views, this.viewCallbacks);
      }

      return this;
    }
  }, {
    key: "resetControllerEvents",
    value: function resetControllerEvents() {
      return this.disableControllerEvents().enableControllerEvents();
    }
  }, {
    key: "enableControllerEvents",
    value: function enableControllerEvents() {
      if (this.controllerEvents && this.controllers && this.controllerCallbacks) {
        Utils.bindEventsToTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks);
      }

      return this;
    }
  }, {
    key: "disableControllerEvents",
    value: function disableControllerEvents() {
      if (this.controllerEvents && this.controllers && this.controllerCallbacks) {
        Utils.unbindEventsFromTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks);
      }

      return this;
    }
  }, {
    key: "resetRouterEvents",
    value: function resetRouterEvents() {
      return this.disableRouterEvents().enableRouterEvents();
    }
  }, {
    key: "enableRouterEvents",
    value: function enableRouterEvents() {
      if (this.routerEvents && this.routers && this.routerCallbacks) {
        Utils.bindEventsToTargetObjects(this.routerEvents, this.routers, this.routerCallbacks);
      }

      return this;
    }
  }, {
    key: "disableRouterEvents",
    value: function disableRouterEvents() {
      if (this.routerEvents && this.routers && this.routerCallbacks) {
        Utils.unbindEventsFromTargetObjects(this.routerEvents, this.routers, this.routerCallbacks);
      }

      return this;
    }
  }, {
    key: "enable",
    value: function enable() {
      var settings = this.settings || {};

      if (!this.enabled) {
        this.setProperties(settings || {}, this.keyMap);
        this.enableModelEvents();
        this.enableViewEvents();
        this.enableControllerEvents();
        this.enableRouterEvents();
        this._enabled = true;
      }

      return this;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.disable();
      this.enable();
      return this;
    }
  }, {
    key: "disable",
    value: function disable() {
      var settings = this.settings;

      if (this.enabled) {
        this.disableModelEvents();
        this.disableViewEvents();
        this.disableControllerEvents();
        this.disableRouterEvents();
        this.deleteProperties(settings || {}, this.keyMap);
        this._enabled = false;
      }

      return this;
    }
  }, {
    key: "keyMap",
    get: function get() {
      return ['modelCallbacks', 'viewCallbacks', 'controllerCallbacks', 'routerCallbacks', 'models', 'views', 'controllers', 'routers', 'modelEvents', 'viewEvents', 'controllerEvents', 'routerEvents'];
    }
  }, {
    key: "_modelCallbacks",
    get: function get() {
      this.modelCallbacks = this.modelCallbacks || {};
      return this.modelCallbacks;
    },
    set: function set(modelCallbacks) {
      this.modelCallbacks = Utils.addPropertiesToObject(modelCallbacks, this._modelCallbacks);
    }
  }, {
    key: "_viewCallbacks",
    get: function get() {
      this.viewCallbacks = this.viewCallbacks || {};
      return this.viewCallbacks;
    },
    set: function set(viewCallbacks) {
      this.viewCallbacks = Utils.addPropertiesToObject(viewCallbacks, this._viewCallbacks);
    }
  }, {
    key: "_controllerCallbacks",
    get: function get() {
      this.controllerCallbacks = this.controllerCallbacks || {};
      return this.controllerCallbacks;
    },
    set: function set(controllerCallbacks) {
      this.controllerCallbacks = Utils.addPropertiesToObject(controllerCallbacks, this._controllerCallbacks);
    }
  }, {
    key: "_models",
    get: function get() {
      this.models = this.models || {};
      return this.models;
    },
    set: function set(models) {
      this.models = Utils.addPropertiesToObject(models, this._models);
    }
  }, {
    key: "_views",
    get: function get() {
      this.views = this.views || {};
      return this.views;
    },
    set: function set(views) {
      this.views = Utils.addPropertiesToObject(views, this._views);
    }
  }, {
    key: "_controllers",
    get: function get() {
      this.controllers = this.controllers || {};
      return this.controllers;
    },
    set: function set(controllers) {
      this.controllers = Utils.addPropertiesToObject(controllers, this._controllers);
    }
  }, {
    key: "_routers",
    get: function get() {
      this.routers = this.routers || {};
      return this.routers;
    },
    set: function set(routers) {
      this.routers = Utils.addPropertiesToObject(routers, this._routers);
    }
  }, {
    key: "_routerEvents",
    get: function get() {
      this.routerEvents = this.routerEvents || {};
      return this.routerEvents;
    },
    set: function set(routerEvents) {
      this.routerEvents = Utils.addPropertiesToObject(routerEvents, this._routerEvents);
    }
  }, {
    key: "_routerCallbacks",
    get: function get() {
      this.routerCallbacks = this.routerCallbacks || {};
      return this.routerCallbacks;
    },
    set: function set(routerCallbacks) {
      this.routerCallbacks = Utils.addPropertiesToObject(routerCallbacks, this._routerCallbacks);
    }
  }, {
    key: "_modelEvents",
    get: function get() {
      this.modelEvents = this.modelEvents || {};
      return this.modelEvents;
    },
    set: function set(modelEvents) {
      this.modelEvents = Utils.addPropertiesToObject(modelEvents, this._modelEvents);
    }
  }, {
    key: "_viewEvents",
    get: function get() {
      this.viewEvents = this.viewEvents || {};
      return this.viewEvents;
    },
    set: function set(viewEvents) {
      this.viewEvents = Utils.addPropertiesToObject(viewEvents, this._viewEvents);
    }
  }, {
    key: "_controllerEvents",
    get: function get() {
      this.controllerEvents = this.controllerEvents || {};
      return this.controllerEvents;
    },
    set: function set(controllerEvents) {
      this.controllerEvents = Utils.addPropertiesToObject(controllerEvents, this._controllerEvents);
    }
  }, {
    key: "_enabled",
    get: function get() {
      return this.enabled || false;
    },
    set: function set(enabled) {
      this.enabled = enabled;
    }
  }]);

  return Controller;
}(Base);

var Router =
/*#__PURE__*/
function (_Base) {
  _inherits(Router, _Base);

  function Router() {
    var _this;

    _classCallCheck(this, Router);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Router).apply(this, arguments));
    return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
  }

  _createClass(Router, [{
    key: "routeFragmentNameRegExp",
    value: function routeFragmentNameRegExp(fragment) {
      return new RegExp('^'.concat(fragment, '$'));
    }
  }, {
    key: "enable",
    value: function enable() {
      if (!this.enabled) {
        this.enableEvents();
        this.enableRoutes();
        this._enabled = true;
      }

      return this;
    }
  }, {
    key: "disable",
    value: function disable() {
      if (this.enabled) {
        this.disableEvents();
        this.disableRoutes();
        this._enabled = false;
      }

      return this;
    }
  }, {
    key: "enableRoutes",
    value: function enableRoutes() {
      var _this2 = this;

      if (this.settings.controller) this._controller = this.settings.controller;
      this._routes = Object.entries(this.settings.routes).reduce(function (_routes, _ref, routeIndex, originalRoutes) {
        var _ref2 = _slicedToArray(_ref, 2),
            routePath = _ref2[0],
            routeSettings = _ref2[1];

        _routes[routePath] = Object.assign(routeSettings, {
          callback: _this2.controller[routeSettings.callback].bind(_this2.controller)
        });
        return _routes;
      }, {});
      return this;
    }
  }, {
    key: "disableRoutes",
    value: function disableRoutes() {
      delete this._routes;
      delete this._controller;
      return this;
    }
  }, {
    key: "enableEvents",
    value: function enableEvents() {
      window.addEventListener('hashchange', this.routeChange.bind(this));
      return this;
    }
  }, {
    key: "disableEvents",
    value: function disableEvents() {
      window.removeEventListener('hashchange', this.routeChange.bind(this));
      return this;
    }
  }, {
    key: "routeChange",
    value: function routeChange() {
      this._currentURL = window.location.href;
      var routeData = this._routeData;

      if (routeData.controller) {
        if (this.previousURL) routeData.previousURL = this.previousURL;
        this.emit('navigate', routeData);
        routeData.controller.callback(routeData);
      }

      return this;
    }
  }, {
    key: "navigate",
    value: function navigate(path) {
      window.location.href = path;
    }
  }, {
    key: "protocol",
    get: function get() {
      return window.location.protocol;
    }
  }, {
    key: "hostname",
    get: function get() {
      return window.location.hostname;
    }
  }, {
    key: "port",
    get: function get() {
      return window.location.port;
    }
  }, {
    key: "path",
    get: function get() {
      return window.location.pathname;
    }
  }, {
    key: "hash",
    get: function get() {
      var href = window.location.href;
      var hashIndex = href.indexOf('#');

      if (hashIndex > -1) {
        var paramIndex = href.indexOf('?');
        var sliceStart = hashIndex + 1;
        var sliceStop;

        if (paramIndex > -1) {
          sliceStop = hashIndex > paramIndex ? href.length : paramIndex;
        } else {
          sliceStop = href.length;
        }

        href = href.slice(sliceStart, sliceStop);

        if (href.length) {
          return href;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  }, {
    key: "params",
    get: function get() {
      var href = window.location.href;
      var paramIndex = href.indexOf('?');

      if (paramIndex > -1) {
        var hashIndex = href.indexOf('#');
        var sliceStart = paramIndex + 1;
        var sliceStop;

        if (hashIndex > -1) {
          sliceStop = paramIndex > hashIndex ? href.length : hashIndex;
        } else {
          sliceStop = href.length;
        }

        href = href.slice(sliceStart, sliceStop);

        if (href.length) {
          return href;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  }, {
    key: "_routeData",
    get: function get() {
      var routeData = {
        location: {},
        controller: {}
      };
      var path = this.path.split('/').filter(function (fragment) {
        return fragment.length;
      });
      path = path.length ? path : ['/'];
      var hash = this.hash;
      var hashFragments = hash ? hash.split('/').filter(function (fragment) {
        return fragment.length;
      }) : null;
      var params = this.params;
      var paramData = params ? Utils.paramsToObject(params) : null;
      if (this.protocol) routeData.location.protocol = this.protocol;
      if (this.hostname) routeData.location.hostname = this.hostname;
      if (this.port) routeData.location.port = this.port;
      if (this.path) routeData.location.path = this.path;

      if (hash && hashFragments) {
        hashFragments = hashFragments.length ? hashFragments : ['/'];
        routeData.location.hash = {
          path: hash,
          fragments: hashFragments
        };
      }

      if (params && paramData) {
        routeData.location.params = {
          path: params,
          data: paramData
        };
      }

      routeData.location.path = {
        name: this.path,
        fragments: path
      };
      routeData.location.currentURL = this.currentURL;
      var routeControllerData = this._routeControllerData;
      routeData.location = Object.assign(routeData.location, routeControllerData.location);
      routeData.controller = routeControllerData.controller;
      this.routeData = routeData;
      return this.routeData;
    }
  }, {
    key: "_routeControllerData",
    get: function get() {
      var _this3 = this;

      var routeData = {
        location: {}
      };
      Object.entries(this.routes).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            routePath = _ref4[0],
            routeSettings = _ref4[1];

        var pathFragments = _this3.path.split('/').filter(function (fragment) {
          return fragment.length;
        });

        pathFragments = pathFragments.length ? pathFragments : ['/'];
        var routeFragments = routePath.split('/').filter(function (fragment, fragmentIndex) {
          return fragment.length;
        });
        routeFragments = routeFragments.length ? routeFragments : ['/'];

        if (pathFragments.length && pathFragments.length === routeFragments.length) {
          var match;
          return routeFragments.filter(function (routeFragment, routeFragmentIndex) {
            if (match === undefined || match === true) {
              if (routeFragment[0] === ':') {
                var currentIDKey = routeFragment.replace(':', '');

                if (routeFragmentIndex === pathFragments.length - 1) {
                  routeData.location.currentIDKey = currentIDKey;
                }

                routeData.location[currentIDKey] = pathFragments[routeFragmentIndex];
                routeFragment = _this3.fragmentIDRegExp;
              } else {
                routeFragment = routeFragment.replace(new RegExp('/', 'gi'), '\\\/');
                routeFragment = _this3.routeFragmentNameRegExp(routeFragment);
              }

              match = routeFragment.test(pathFragments[routeFragmentIndex]);

              if (match === true && routeFragmentIndex === pathFragments.length - 1) {
                routeData.location.route = {
                  name: routePath,
                  fragments: routeFragments
                };
                routeData.controller = routeSettings;
                return routeSettings;
              }
            }
          })[0];
        }
      });
      return routeData;
    }
  }, {
    key: "_enabled",
    get: function get() {
      return this.enabled || false;
    },
    set: function set(enabled) {
      this.enabled = enabled;
    }
  }, {
    key: "_routes",
    get: function get() {
      this.routes = this.routes || {};
      return this.routes;
    },
    set: function set(routes) {
      this.routes = Utils.addPropertiesToObject(routes, this._routes);
    }
  }, {
    key: "_controller",
    get: function get() {
      return this.controller;
    },
    set: function set(controller) {
      this.controller = controller;
    }
  }, {
    key: "_previousURL",
    get: function get() {
      return this.previousURL;
    },
    set: function set(previousURL) {
      this.previousURL = previousURL;
    }
  }, {
    key: "_currentURL",
    get: function get() {
      return this.currentURL;
    },
    set: function set(currentURL) {
      if (this.currentURL) this._previousURL = this.currentURL;
      this.currentURL = currentURL;
    }
  }, {
    key: "fragmentIDRegExp",
    get: function get() {
      return new RegExp(/^([0-9A-Z\?\=\,\.\*\-\_\'\"\^\%\$\#\@\!\~\(\)\{\}\&\<\>\\\/])*$/, 'gi');
    }
  }]);

  return Router;
}(Base);

var MVC = {
  Events: Events,
  Channels: Channels,
  Utils: Utils,
  Service: Service,
  Model: Model,
  View: View,
  Controller: Controller,
  Router: Router
};

return MVC;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXZjLWZyYW1ld29yay5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc291cmNlL01WQy9FdmVudHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL0NoYW5uZWxzL0NoYW5uZWwvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL0NoYW5uZWxzL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9VdGlscy9hZGRQcm9wZXJ0aWVzVG9PYmplY3QuanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL2lzLmpzIiwiLi4vLi4vc291cmNlL01WQy9VdGlscy9vYmplY3RRdWVyeS5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVXRpbHMvdG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cy5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVXRpbHMvdG9nZ2xlRXZlbnRzRm9yVGFyZ2V0Vmlld09iamVjdHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL2JpbmRFdmVudHMuanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL3R5cGVPZi5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVXRpbHMvcGFyYW1zVG9PYmplY3QuanMiLCIuLi8uLi9zb3VyY2UvTVZDL1V0aWxzL3VpZC5qcyIsIi4uLy4uL3NvdXJjZS9NVkMvVXRpbHMvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL0Jhc2UvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL1NlcnZpY2UvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL01vZGVsL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9WaWV3L2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Db250cm9sbGVyL2luZGV4LmpzIiwiLi4vLi4vc291cmNlL01WQy9Sb3V0ZXIvaW5kZXguanMiLCIuLi8uLi9zb3VyY2UvTVZDL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEV2ZW50cyA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9ldmVudHMoKSB7XHJcbiAgICB0aGlzLmV2ZW50cyA9IHRoaXMuZXZlbnRzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5ldmVudHNcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKSB7IHJldHVybiB0aGlzLl9ldmVudHNbZXZlbnROYW1lXSB8fCB7fSB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIChldmVudENhbGxiYWNrLm5hbWUubGVuZ3RoKVxyXG4gICAgICA/IGV2ZW50Q2FsbGJhY2submFtZVxyXG4gICAgICA6ICdhbm9ueW1vdXNGdW5jdGlvbidcclxuICB9XHJcbiAgZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSkge1xyXG4gICAgcmV0dXJuIGV2ZW50Q2FsbGJhY2tzW2V2ZW50Q2FsbGJhY2tOYW1lXSB8fCBbXVxyXG4gIH1cclxuICBvbihldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spIHtcclxuICAgIGxldCBldmVudENhbGxiYWNrcyA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tOYW1lID0gdGhpcy5nZXRFdmVudENhbGxiYWNrTmFtZShldmVudENhbGxiYWNrKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tHcm91cCA9IHRoaXMuZ2V0RXZlbnRDYWxsYmFja0dyb3VwKGV2ZW50Q2FsbGJhY2tzLCBldmVudENhbGxiYWNrTmFtZSlcclxuICAgIGV2ZW50Q2FsbGJhY2tHcm91cC5wdXNoKGV2ZW50Q2FsbGJhY2spXHJcbiAgICBldmVudENhbGxiYWNrc1tldmVudENhbGxiYWNrTmFtZV0gPSBldmVudENhbGxiYWNrR3JvdXBcclxuICAgIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdID0gZXZlbnRDYWxsYmFja3NcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIG9mZigpIHtcclxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XHJcbiAgICAgIGNhc2UgMDpcclxuICAgICAgICBkZWxldGUgdGhpcy5ldmVudHNcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDE6XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbZXZlbnROYW1lXVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgMjpcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdXHJcbiAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2sgPSBhcmd1bWVudHNbMV1cclxuICAgICAgICB2YXIgZXZlbnRDYWxsYmFja05hbWUgPSAodHlwZW9mIGV2ZW50Q2FsbGJhY2sgPT09ICdzdHJpbmcnKVxyXG4gICAgICAgICAgPyBldmVudENhbGxiYWNrXHJcbiAgICAgICAgICA6IHRoaXMuZ2V0RXZlbnRDYWxsYmFja05hbWUoZXZlbnRDYWxsYmFjaylcclxuICAgICAgICBpZih0aGlzLl9ldmVudHNbZXZlbnROYW1lXSkge1xyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdW2V2ZW50Q2FsbGJhY2tOYW1lXVxyXG4gICAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX2V2ZW50c1tldmVudE5hbWVdKS5sZW5ndGggPT09IDBcclxuICAgICAgICAgICkgZGVsZXRlIHRoaXMuX2V2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxuICBlbWl0KGV2ZW50TmFtZSwgZXZlbnREYXRhKSB7XHJcbiAgICBsZXQgX2FyZ3VtZW50cyA9IE9iamVjdC52YWx1ZXMoYXJndW1lbnRzKVxyXG4gICAgbGV0IGV2ZW50Q2FsbGJhY2tzID0gT2JqZWN0LmVudHJpZXMoXHJcbiAgICAgIHRoaXMuZ2V0RXZlbnRDYWxsYmFja3MoZXZlbnROYW1lKVxyXG4gICAgKVxyXG4gICAgZm9yKGxldCBbZXZlbnRDYWxsYmFja0dyb3VwTmFtZSwgZXZlbnRDYWxsYmFja0dyb3VwXSBvZiBldmVudENhbGxiYWNrcykge1xyXG4gICAgICBmb3IobGV0IGV2ZW50Q2FsbGJhY2sgb2YgZXZlbnRDYWxsYmFja0dyb3VwKSB7XHJcbiAgICAgICAgbGV0IGFkZGl0aW9uYWxBcmd1bWVudHMgPSBfYXJndW1lbnRzLnNwbGljZSgyKSB8fCBbXVxyXG4gICAgICAgIGV2ZW50Q2FsbGJhY2soZXZlbnREYXRhLCAuLi5hZGRpdGlvbmFsQXJndW1lbnRzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBFdmVudHNcclxuIiwiY29uc3QgQ2hhbm5lbCA9IGNsYXNzIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0IF9yZXNwb25zZXMoKSB7XHJcbiAgICB0aGlzLnJlc3BvbnNlcyA9IHRoaXMucmVzcG9uc2VzIHx8IHRoaXMucmVzcG9uc2VzXHJcbiAgICByZXR1cm4gdGhpcy5yZXNwb25zZXNcclxuICB9XHJcbiAgcmVzcG9uc2UocmVzcG9uc2VOYW1lLCByZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICBpZihyZXNwb25zZUNhbGxiYWNrKSB7XHJcbiAgICAgIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdID0gcmVzcG9uc2VDYWxsYmFja1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZV1cclxuICAgIH1cclxuICB9XHJcbiAgcmVxdWVzdChyZXNwb25zZU5hbWUpIHtcclxuICAgIGlmKHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdKSB7XHJcbiAgICAgIGxldCBfYXJndW1lbnRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5zbGljZSgxKVxyXG4gICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2VzW3Jlc3BvbnNlTmFtZV0oLi4uX2FyZ3VtZW50cylcclxuICAgIH1cclxuICB9XHJcbiAgb2ZmKHJlc3BvbnNlTmFtZSkge1xyXG4gICAgaWYocmVzcG9uc2VOYW1lKSB7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZXNbcmVzcG9uc2VOYW1lXVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yKGxldCBbcmVzcG9uc2VOYW1lXSBvZiBPYmplY3Qua2V5cyh0aGlzLl9yZXNwb25zZXMpKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlc1tyZXNwb25zZU5hbWVdXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQ2hhbm5lbFxyXG4iLCJpbXBvcnQgQ2hhbm5lbCBmcm9tICcuL0NoYW5uZWwvaW5kZXgnXHJcbmNvbnN0IENoYW5uZWxzID0gY2xhc3Mge1xyXG4gIGNvbnN0cnVjdG9yKCkge31cclxuICBnZXQgX2NoYW5uZWxzKCkge1xyXG4gICAgdGhpcy5jaGFubmVscyA9IHRoaXMuY2hhbm5lbHMgfHwge31cclxuICAgIHJldHVybiB0aGlzLmNoYW5uZWxzXHJcbiAgfVxyXG4gIGNoYW5uZWwoY2hhbm5lbE5hbWUpIHtcclxuICAgIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXSA9ICh0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV0pXHJcbiAgICAgID8gdGhpcy5fY2hhbm5lbHNbY2hhbm5lbE5hbWVdXHJcbiAgICAgIDogbmV3IENoYW5uZWwoKVxyXG4gICAgcmV0dXJuIHRoaXMuX2NoYW5uZWxzW2NoYW5uZWxOYW1lXVxyXG4gIH1cclxuICBvZmYoY2hhbm5lbE5hbWUpIHtcclxuICAgIGRlbGV0ZSB0aGlzLl9jaGFubmVsc1tjaGFubmVsTmFtZV1cclxuICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQ2hhbm5lbHNcclxuIiwiY29uc3QgYWRkUHJvcGVydGllc1RvT2JqZWN0ID0gZnVuY3Rpb24gYWRkUHJvcGVydGllc1RvT2JqZWN0KCkge1xyXG4gIGxldCB0YXJnZXRPYmplY3RcclxuICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xyXG4gICAgY2FzZSAyOlxyXG4gICAgICBsZXQgcHJvcGVydGllcyA9IGFyZ3VtZW50c1swXVxyXG4gICAgICB0YXJnZXRPYmplY3QgPSBhcmd1bWVudHNbMV1cclxuICAgICAgT2JqZWN0LmVudHJpZXMocHJvcGVydGllcylcclxuICAgICAgICAuZm9yRWFjaCgoW3Byb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZV0pID0+IHtcclxuICAgICAgICAgIHRhcmdldE9iamVjdFtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZVxyXG4gICAgICAgIH0pXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlIDM6XHJcbiAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBhcmd1bWVudHNbMF1cclxuICAgICAgbGV0IHByb3BlcnR5VmFsdWUgPSBhcmd1bWVudHNbMV1cclxuICAgICAgdGFyZ2V0T2JqZWN0ID0gYXJndW1lbnRzWzJdXHJcbiAgICAgIHRhcmdldE9iamVjdFtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZVxyXG4gICAgICBicmVha1xyXG4gIH1cclxuICByZXR1cm4gdGFyZ2V0T2JqZWN0XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgYWRkUHJvcGVydGllc1RvT2JqZWN0XHJcbiIsImNvbnN0IGlzQXJyYXkgPSBmdW5jdGlvbiBpc0FycmF5KG9iamVjdCkgeyByZXR1cm4gQXJyYXkuaXNBcnJheShvYmplY3QpIH1cclxuY29uc3QgaXNPYmplY3QgPSBmdW5jdGlvbiBpc09iamVjdChvYmplY3QpIHtcclxuICByZXR1cm4gKFxyXG4gICAgIUFycmF5LmlzQXJyYXkob2JqZWN0KSAmJlxyXG4gICAgb2JqZWN0ICE9PSBudWxsXHJcbiAgKSA/IHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnXHJcbiAgICA6IGZhbHNlXHJcbn1cclxuY29uc3QgaXNIVE1MRWxlbWVudCA9IGZ1bmN0aW9uIGlzSFRNTEVsZW1lbnQob2JqZWN0KSB7XHJcbiAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XHJcbn1cclxuZXhwb3J0IHtcclxuICBpc0FycmF5LFxyXG4gIGlzT2JqZWN0LFxyXG4gIGlzSFRNTEVsZW1lbnQsXHJcbn1cclxuIiwiaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tICcuL2lzJ1xyXG5cclxuY29uc3QgcGFyc2VOb3RhdGlvbiA9IGZ1bmN0aW9uIHBhcnNlTm90YXRpb24oc3RyaW5nKSB7XHJcbiAgaWYoXHJcbiAgICBzdHJpbmcuY2hhckF0KDApID09PSAnWycgJiZcclxuICAgIHN0cmluZy5jaGFyQXQoc3RyaW5nLmxlbmd0aCAtIDEpID09ICddJ1xyXG4gICkge1xyXG4gICAgc3RyaW5nID0gc3RyaW5nXHJcbiAgICAgIC5zbGljZSgxLCAtMSlcclxuICAgICAgLnNwbGl0KCddWycpXHJcbiAgfSBlbHNlIHtcclxuICAgIHN0cmluZyA9IHN0cmluZ1xyXG4gICAgICAuc3BsaXQoJy4nKVxyXG4gIH1cclxuICByZXR1cm4gc3RyaW5nXHJcbn1cclxuXHJcbmNvbnN0IHBhcnNlRnJhZ21lbnQgPSBmdW5jdGlvbiBwYXJzZUZyYWdtZW50KGZyYWdtZW50KSB7XHJcbiAgaWYoXHJcbiAgICBmcmFnbWVudC5jaGFyQXQoMCkgPT09ICcvJyAmJlxyXG4gICAgZnJhZ21lbnQuY2hhckF0KGZyYWdtZW50Lmxlbmd0aCAtIDEpID09ICcvJ1xyXG4gICkge1xyXG4gICAgZnJhZ21lbnQgPSBmcmFnbWVudC5zbGljZSgxLCAtMSlcclxuICAgIGZyYWdtZW50ID0gbmV3IFJlZ0V4cCgnXicuY29uY2F0KGZyYWdtZW50LCAnJCcpKVxyXG4gIH1cclxuICByZXR1cm4gZnJhZ21lbnRcclxufVxyXG5cclxuY29uc3Qgb2JqZWN0UXVlcnkgPSBmdW5jdGlvbiBvYmplY3RRdWVyeShcclxuICBzdHJpbmcsXHJcbiAgY29udGV4dFxyXG4pIHtcclxuICBsZXQgc3RyaW5nRGF0YSA9IHBhcnNlTm90YXRpb24oc3RyaW5nKVxyXG4gIGlmKHN0cmluZ0RhdGFbMF0gPT09ICdAJykgc3RyaW5nRGF0YS5zcGxpY2UoMCwgMSlcclxuICBpZighc3RyaW5nRGF0YS5sZW5ndGgpIHJldHVybiBjb250ZXh0XHJcbiAgY29udGV4dCA9IChpc09iamVjdChjb250ZXh0KSlcclxuICAgID8gT2JqZWN0LmVudHJpZXMoY29udGV4dClcclxuICAgIDogY29udGV4dFxyXG4gIHJldHVybiBzdHJpbmdEYXRhLnJlZHVjZSgob2JqZWN0LCBmcmFnbWVudCwgZnJhZ21lbnRJbmRleCwgZnJhZ21lbnRzKSA9PiB7XHJcbiAgICBsZXQgcHJvcGVydGllcyA9IFtdXHJcbiAgICBmcmFnbWVudCA9IHBhcnNlRnJhZ21lbnQoZnJhZ21lbnQpXHJcbiAgICBmb3IobGV0IFtwcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV0gb2Ygb2JqZWN0KSB7XHJcbiAgICAgIGlmKHByb3BlcnR5S2V5Lm1hdGNoKGZyYWdtZW50KSkge1xyXG4gICAgICAgIGlmKGZyYWdtZW50SW5kZXggPT09IGZyYWdtZW50cy5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoW1twcm9wZXJ0eUtleSwgcHJvcGVydHlWYWx1ZV1dKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBwcm9wZXJ0aWVzID0gcHJvcGVydGllcy5jb25jYXQoT2JqZWN0LmVudHJpZXMocHJvcGVydHlWYWx1ZSkpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBvYmplY3QgPSBwcm9wZXJ0aWVzXHJcbiAgICByZXR1cm4gb2JqZWN0XHJcbiAgfSwgY29udGV4dClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgb2JqZWN0UXVlcnlcclxuIiwiaW1wb3J0IG9iamVjdFF1ZXJ5IGZyb20gJy4vb2JqZWN0UXVlcnknXHJcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuL2lzJ1xyXG5cclxuY29uc3QgdG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIHRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMoXHJcbiAgdG9nZ2xlTWV0aG9kLFxyXG4gIGV2ZW50cyxcclxuICB0YXJnZXRPYmplY3RzLFxyXG4gIGNhbGxiYWNrc1xyXG4pIHtcclxuICBPYmplY3QuZW50cmllcyhldmVudHMpXHJcbiAgICAuZm9yRWFjaCgoW2V2ZW50U2V0dGluZ3MsIGV2ZW50Q2FsbGJhY2tOYW1lXSkgPT4ge1xyXG4gICAgICBsZXQgZXZlbnREYXRhID0gZXZlbnRTZXR0aW5ncy5zcGxpdCgnICcpXHJcbiAgICAgIGxldCBldmVudFRhcmdldFNldHRpbmdzID0gZXZlbnREYXRhWzBdXHJcbiAgICAgIGxldCBldmVudE5hbWUgPSBldmVudERhdGFbMV1cclxuICAgICAgbGV0IGV2ZW50VGFyZ2V0cyA9IG9iamVjdFF1ZXJ5KFxyXG4gICAgICAgIGV2ZW50VGFyZ2V0U2V0dGluZ3MsXHJcbiAgICAgICAgdGFyZ2V0T2JqZWN0c1xyXG4gICAgICApXHJcbiAgICAgIGV2ZW50VGFyZ2V0cyA9ICghaXNBcnJheShldmVudFRhcmdldHMpKVxyXG4gICAgICAgID8gW1snQCcsIGV2ZW50VGFyZ2V0c11dXHJcbiAgICAgICAgOiBldmVudFRhcmdldHNcclxuICAgICAgZm9yKGxldCBbZXZlbnRUYXJnZXROYW1lLCBldmVudFRhcmdldF0gb2YgZXZlbnRUYXJnZXRzKSB7XHJcbiAgICAgICAgbGV0IGV2ZW50TWV0aG9kTmFtZSA9ICh0b2dnbGVNZXRob2QgPT09ICdvbicpXHJcbiAgICAgICAgICA/ICdvbidcclxuICAgICAgICAgIDogJ29mZidcclxuICAgICAgICBsZXQgZXZlbnRDYWxsYmFjayA9IG9iamVjdFF1ZXJ5KFxyXG4gICAgICAgICAgZXZlbnRDYWxsYmFja05hbWUsXHJcbiAgICAgICAgICBjYWxsYmFja3NcclxuICAgICAgICApWzBdWzFdXHJcbiAgICAgICAgZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgdG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0c1xyXG4iLCJpbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi9pcydcclxuaW1wb3J0IG9iamVjdFF1ZXJ5IGZyb20gJy4vb2JqZWN0UXVlcnknXHJcblxyXG5jb25zdCB0b2dnbGVFdmVudHNGb3JUYXJnZXRWaWV3T2JqZWN0cyA9IGZ1bmN0aW9uIHRvZ2dsZUV2ZW50c0ZvclRhcmdldFZpZXdPYmplY3RzKFxyXG4gIHRvZ2dsZU1ldGhvZCxcclxuICBldmVudHMsXHJcbiAgdGFyZ2V0T2JqZWN0cyxcclxuICBjYWxsYmFja3NcclxuKSB7XHJcbiAgT2JqZWN0LmVudHJpZXMoZXZlbnRzKVxyXG4gICAgLmZvckVhY2goKGV2ZW50U2V0dGluZ3MsIGV2ZW50Q2FsbGJhY2tOYW1lKSA9PiB7XHJcbiAgICAgIGxldCBldmVudERhdGEgPSBldmVudFNldHRpbmdzLnNwbGl0KCcgJylcclxuICAgICAgbGV0IGV2ZW50VGFyZ2V0U2V0dGluZ3MgPSBldmVudERhdGFbMF1cclxuICAgICAgbGV0IGV2ZW50TmFtZSA9IGV2ZW50RGF0YVsxXVxyXG4gICAgICBsZXQgZXZlbnRUYXJnZXRzID0gb2JqZWN0UXVlcnkoXHJcbiAgICAgICAgZXZlbnRUYXJnZXRTZXR0aW5ncyxcclxuICAgICAgICB0YXJnZXRPYmplY3RzXHJcbiAgICAgIClcclxuICAgICAgZXZlbnRUYXJnZXRzID0gKCFpc0FycmF5KGV2ZW50VGFyZ2V0cykpXHJcbiAgICAgICAgPyBbWydAJywgZXZlbnRUYXJnZXRzXV1cclxuICAgICAgICA6IGV2ZW50VGFyZ2V0c1xyXG4gICAgICBmb3IobGV0IFtldmVudFRhcmdldE5hbWUsIGV2ZW50VGFyZ2V0XSBvZiBldmVudFRhcmdldHMpIHtcclxuICAgICAgICBsZXQgZXZlbnRNZXRob2ROYW1lID0gKHRvZ2dsZU1ldGhvZCA9PT0gJ29uJylcclxuICAgICAgICAgID8gJ2FkZEV2ZW50TGlzdGVuZXInXHJcbiAgICAgICAgICA6ICdyZW1vdmVFdmVudExpc3RlbmVyJ1xyXG4gICAgICAgIGxldCBldmVudENhbGxiYWNrID0gb2JqZWN0UXVlcnkoXHJcbiAgICAgICAgICBldmVudENhbGxiYWNrTmFtZSxcclxuICAgICAgICAgIGNhbGxiYWNrc1xyXG4gICAgICAgIClbMF1bMV1cclxuICAgICAgICBpZihldmVudFRhcmdldCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XHJcbiAgICAgICAgICBmb3IobGV0IF9ldmVudFRhcmdldCBvZiBldmVudFRhcmdldCkge1xyXG4gICAgICAgICAgICBfZXZlbnRUYXJnZXRbZXZlbnRNZXRob2ROYW1lXShldmVudE5hbWUsIGV2ZW50Q2FsbGJhY2spXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmKGV2ZW50VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0W2V2ZW50TWV0aG9kTmFtZV0oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGV2ZW50VGFyZ2V0W2V2ZW50TWV0aG9kTmFtZV0oZXZlbnROYW1lLCBldmVudENhbGxiYWNrKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5leHBvcnQgZGVmYXVsdCB0b2dnbGVFdmVudHNGb3JUYXJnZXRWaWV3T2JqZWN0c1xyXG4iLCJpbXBvcnQgdG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cyBmcm9tICcuL3RvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMnXHJcbmltcG9ydCB0b2dnbGVFdmVudHNGb3JUYXJnZXRWaWV3T2JqZWN0cyBmcm9tICcuL3RvZ2dsZUV2ZW50c0ZvclRhcmdldFZpZXdPYmplY3RzJ1xyXG5cclxuY29uc3QgYmluZEV2ZW50c1RvVGFyZ2V0Vmlld09iamVjdHMgPSBmdW5jdGlvbiBiaW5kRXZlbnRzVG9UYXJnZXRWaWV3T2JqZWN0cygpIHtcclxuICB0b2dnbGVFdmVudHNGb3JUYXJnZXRWaWV3T2JqZWN0cygnb24nLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuY29uc3QgdW5iaW5kRXZlbnRzRnJvbVRhcmdldFZpZXdPYmplY3RzID0gZnVuY3Rpb24gdW5iaW5kRXZlbnRzRnJvbVRhcmdldFZpZXdPYmplY3RzKCkge1xyXG4gIHRvZ2dsZUV2ZW50c0ZvclRhcmdldFZpZXdPYmplY3RzKCdvZmYnLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuY29uc3QgYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyA9IGZ1bmN0aW9uIGJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMoKSB7XHJcbiAgdG9nZ2xlRXZlbnRzRm9yVGFyZ2V0T2JqZWN0cygnb24nLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuY29uc3QgdW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHMgPSBmdW5jdGlvbiB1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cygpIHtcclxuICB0b2dnbGVFdmVudHNGb3JUYXJnZXRPYmplY3RzKCdvZmYnLCAuLi5hcmd1bWVudHMpXHJcbn1cclxuZXhwb3J0IHtcclxuICBiaW5kRXZlbnRzVG9UYXJnZXRWaWV3T2JqZWN0cyxcclxuICB1bmJpbmRFdmVudHNGcm9tVGFyZ2V0Vmlld09iamVjdHMsXHJcbiAgYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyxcclxuICB1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0c1xyXG59XHJcbiIsImltcG9ydCB7IGlzQXJyYXksIGlzT2JqZWN0IH0gZnJvbSAnLi9pcydcclxuY29uc3QgdHlwZU9mID0gZnVuY3Rpb24gdHlwZU9mKGRhdGEpIHtcclxuICBzd2l0Y2godHlwZW9mIGRhdGEpIHtcclxuICAgIGNhc2UgJ29iamVjdCc6XHJcbiAgICAgIGxldCBfb2JqZWN0XHJcbiAgICAgIGlmKGlzQXJyYXkoZGF0YSkpIHtcclxuICAgICAgICAvLyBBcnJheVxyXG4gICAgICAgIHJldHVybiAnYXJyYXknXHJcbiAgICAgIH0gZWxzZSBpZihcclxuICAgICAgICBpc09iamVjdChkYXRhKVxyXG4gICAgICApIHtcclxuICAgICAgICAvLyBPYmplY3RcclxuICAgICAgICByZXR1cm4gJ29iamVjdCdcclxuICAgICAgfSBlbHNlIGlmKFxyXG4gICAgICAgIGRhdGEgPT09IG51bGxcclxuICAgICAgKSB7XHJcbiAgICAgICAgLy8gTnVsbFxyXG4gICAgICAgIHJldHVybiAnbnVsbCdcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gX29iamVjdFxyXG4gICAgY2FzZSAnc3RyaW5nJzpcclxuICAgIGNhc2UgJ251bWJlcic6XHJcbiAgICBjYXNlICdib29sZWFuJzpcclxuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XHJcbiAgICBjYXNlICdmdW5jdGlvbic6XHJcbiAgICAgIHJldHVybiB0eXBlb2YgZGF0YVxyXG4gICAgICBicmVha1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCB0eXBlT2ZcclxuIiwiY29uc3QgcGFyYW1zVG9PYmplY3QgPSBmdW5jdGlvbiBwYXJhbXNUb09iamVjdChwYXJhbXMpIHtcclxuICAgIHZhciBwYXJhbXMgPSBwYXJhbXMuc3BsaXQoJyYnKVxyXG4gICAgdmFyIG9iamVjdCA9IHt9XHJcbiAgICBwYXJhbXMuZm9yRWFjaCgocGFyYW1EYXRhKSA9PiB7XHJcbiAgICAgIHBhcmFtRGF0YSA9IHBhcmFtRGF0YS5zcGxpdCgnPScpXHJcbiAgICAgIG9iamVjdFtwYXJhbURhdGFbMF1dID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhcmFtRGF0YVsxXSB8fCAnJylcclxuICAgIH0pXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmplY3QpKVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IHBhcmFtc1RvT2JqZWN0XHJcbiIsImNvbnN0IFVJRCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgdXVpZCA9ICcnLCBpaVxyXG4gIGZvciAoaWkgPSAwOyBpaSA8IDMyOyBpaSArPSAxKSB7XHJcbiAgICBzd2l0Y2ggKGlpKSB7XHJcbiAgICAgIGNhc2UgODpcclxuICAgICAgY2FzZSAyMDpcclxuICAgICAgICB1dWlkICs9ICctJztcclxuICAgICAgICB1dWlkICs9IChNYXRoLnJhbmRvbSgpICogMTYgfCAwKS50b1N0cmluZygxNilcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDEyOlxyXG4gICAgICAgIHV1aWQgKz0gJy0nXHJcbiAgICAgICAgdXVpZCArPSAnNCdcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlIDE2OlxyXG4gICAgICAgIHV1aWQgKz0gJy0nXHJcbiAgICAgICAgdXVpZCArPSAoTWF0aC5yYW5kb20oKSAqIDQgfCA4KS50b1N0cmluZygxNilcclxuICAgICAgICBicmVha1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHV1aWQgKz0gKE1hdGgucmFuZG9tKCkgKiAxNiB8IDApLnRvU3RyaW5nKDE2KVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdXVpZFxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFVJRFxyXG4iLCJpbXBvcnQgYWRkUHJvcGVydGllc1RvT2JqZWN0IGZyb20gJy4vYWRkUHJvcGVydGllc1RvT2JqZWN0J1xyXG5pbXBvcnQge1xyXG4gIGJpbmRFdmVudHNUb1RhcmdldFZpZXdPYmplY3RzLFxyXG4gIHVuYmluZEV2ZW50c0Zyb21UYXJnZXRWaWV3T2JqZWN0cyxcclxuICBiaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzLFxyXG4gIHVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzXHJcbn0gZnJvbSAnLi9iaW5kRXZlbnRzJ1xyXG5pbXBvcnQgdHlwZU9mIGZyb20gJy4vdHlwZU9mJ1xyXG5pbXBvcnQge1xyXG4gIGlzQXJyYXksXHJcbiAgaXNPYmplY3QsXHJcbiAgaXNIVE1MRWxlbWVudFxyXG59IGZyb20gJy4vaXMnXHJcbmltcG9ydCBvYmplY3RRdWVyeSBmcm9tICcuL29iamVjdFF1ZXJ5J1xyXG5pbXBvcnQgcGFyYW1zVG9PYmplY3QgZnJvbSAnLi9wYXJhbXNUb09iamVjdCdcclxuaW1wb3J0IHVpZCBmcm9tICcuL3VpZCdcclxuY29uc3QgVXRpbHMgPSB7XHJcbiAgYWRkUHJvcGVydGllc1RvT2JqZWN0LFxyXG4gIGJpbmRFdmVudHNUb1RhcmdldFZpZXdPYmplY3RzLFxyXG4gIHVuYmluZEV2ZW50c0Zyb21UYXJnZXRWaWV3T2JqZWN0cyxcclxuICBiaW5kRXZlbnRzVG9UYXJnZXRPYmplY3RzLFxyXG4gIHVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzLFxyXG4gIGlzQXJyYXksXHJcbiAgaXNPYmplY3QsXHJcbiAgdHlwZU9mLFxyXG4gIGlzSFRNTEVsZW1lbnQsXHJcbiAgb2JqZWN0UXVlcnksXHJcbiAgcGFyYW1zVG9PYmplY3QsXHJcbiAgdHlwZU9mLFxyXG4gIHVpZCxcclxufVxyXG5leHBvcnQgZGVmYXVsdCBVdGlsc1xyXG4iLCJpbXBvcnQgVXRpbHMgZnJvbSAnLi4vVXRpbHMvaW5kZXgnXHJcbmltcG9ydCBFdmVudHMgZnJvbSAnLi4vRXZlbnRzL2luZGV4J1xyXG5cclxuY29uc3QgQmFzZSA9IGNsYXNzIGV4dGVuZHMgRXZlbnRzIHtcclxuICBjb25zdHJ1Y3RvcihzZXR0aW5ncywgY29uZmlndXJhdGlvbikge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgaWYoc2V0dGluZ3MpIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3NcclxuICAgIGlmKGNvbmZpZ3VyYXRpb24pIHRoaXMuX2NvbmZpZ3VyYXRpb24gPSBjb25maWd1cmF0aW9uXHJcbiAgfVxyXG4gIGdldCB1aWQoKSB7XHJcbiAgICB0aGlzLl91aWQgPSAodGhpcy5fdWlkKVxyXG4gICAgPyB0aGlzLl91aWRcclxuICAgIDogVXRpbHMuVUlEKClcclxuICAgIHJldHVybiB0aGlzLl91aWRcclxuICB9XHJcbiAgZ2V0IF9uYW1lKCkgeyByZXR1cm4gdGhpcy5uYW1lIH1cclxuICBzZXQgX25hbWUobmFtZSkgeyB0aGlzLm5hbWUgPSBuYW1lIH1cclxuICBnZXQgX2NvbmZpZ3VyYXRpb24oKSB7XHJcbiAgICB0aGlzLmNvbmZpZ3VyYXRpb24gPSB0aGlzLmNvbmZpZ3VyYXRpb24gfHwge31cclxuICAgIHJldHVybiB0aGlzLmNvbmZpZ3VyYXRpb25cclxuICB9XHJcbiAgc2V0IF9jb25maWd1cmF0aW9uKGNvbmZpZ3VyYXRpb24pIHsgdGhpcy5jb25maWd1cmF0aW9uID0gY29uZmlndXJhdGlvbiB9XHJcbiAgZ2V0IF9zZXR0aW5ncygpIHtcclxuICAgIHRoaXMuc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzIHx8IHt9XHJcbiAgICByZXR1cm4gdGhpcy5zZXR0aW5nc1xyXG4gIH1cclxuICBzZXQgX3NldHRpbmdzKHNldHRpbmdzKSB7XHJcbiAgICB0aGlzLnNldHRpbmdzID0gVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxyXG4gICAgICBzZXR0aW5ncywgdGhpcy5fc2V0dGluZ3NcclxuICAgIClcclxuICB9XHJcbiAgc2V0UHJvcGVydGllcyhzZXR0aW5ncywga2V5TWFwLCBzd2l0Y2hlcykge1xyXG4gICAgc3dpdGNoZXMgPSBzd2l0Y2hlcyB8fCB7fVxyXG4gICAgbGV0IHNldHRpbmdzQ291bnQgPSBPYmplY3Qua2V5cyhzZXR0aW5ncykubGVuZ3RoXHJcbiAgICBsZXQga2V5Q291bnQgPSAwXHJcbiAgICBrZXlNYXBcclxuICAgICAgLnNvbWUoKGtleSkgPT4ge1xyXG4gICAgICAgIGlmKHNldHRpbmdzW2tleV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAga2V5Q291bnQgKz0gMVxyXG4gICAgICAgICAgaWYoc3dpdGNoZXNba2V5XSkge1xyXG4gICAgICAgICAgICBzd2l0Y2hlc1trZXldKHNldHRpbmdzW2tleV0pXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzWydfJy5jb25jYXQoa2V5KV0gPSBzZXR0aW5nc1trZXldXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoa2V5Q291bnQgPT09IHNldHRpbmdzQ291bnQpXHJcbiAgICAgICAgICA/IHRydWVcclxuICAgICAgICAgIDogZmFsc2VcclxuICAgICAgfSlcclxuICAgIHJldHVybiB0aGlzXHJcbiAgfVxyXG4gIGRlbGV0ZVByb3BlcnRpZXMoc2V0dGluZ3MsIGtleU1hcCwgc3dpdGNoZXMpIHtcclxuICAgIHN3aXRjaGVzID0gc3dpdGNoZXMgfHwge31cclxuICAgIGxldCBzZXR0aW5nc0NvdW50ID0gT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxyXG4gICAgbGV0IGtleUNvdW50ID0gMFxyXG4gICAga2V5TWFwXHJcbiAgICAgIC5zb21lKChrZXkpID0+IHtcclxuICAgICAgICBpZihzZXR0aW5nc1trZXldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGtleUNvdW50ICs9IDFcclxuICAgICAgICAgIGlmKHN3aXRjaGVzW2tleV0pIHtcclxuICAgICAgICAgICAgc3dpdGNoZXNba2V5XShzZXR0aW5nc1trZXldKVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXNba2V5XVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKGtleUNvdW50ID09PSBzZXR0aW5nc0NvdW50KVxyXG4gICAgICAgICAgPyB0cnVlXHJcbiAgICAgICAgICA6IGZhbHNlXHJcbiAgICAgIH0pXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBCYXNlXHJcbiIsImltcG9ydCBVdGlscyBmcm9tICcuLi9VdGlscy9pbmRleCdcbmltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNvbnN0IFNlcnZpY2UgPSBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBnZXQgX2RlZmF1bHRzKCkgeyByZXR1cm4gdGhpcy5kZWZhdWx0cyB8fCB7XG4gICAgY29udGVudFR5cGU6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfSxcbiAgICByZXNwb25zZVR5cGU6ICdqc29uJyxcbiAgfSB9XG4gIGdldCBfcmVzcG9uc2VUeXBlcygpIHsgcmV0dXJuIFsnJywgJ2FycmF5YnVmZmVyJywgJ2Jsb2InLCAnZG9jdW1lbnQnLCAnanNvbicsICd0ZXh0J10gfVxuICBnZXQgX3Jlc3BvbnNlVHlwZSgpIHsgcmV0dXJuIHRoaXMucmVzcG9uc2VUeXBlIH1cbiAgc2V0IF9yZXNwb25zZVR5cGUocmVzcG9uc2VUeXBlKSB7XG4gICAgdGhpcy5feGhyLnJlc3BvbnNlVHlwZSA9IHRoaXMuX3Jlc3BvbnNlVHlwZXMuZmluZChcbiAgICAgIChyZXNwb25zZVR5cGVJdGVtKSA9PiByZXNwb25zZVR5cGVJdGVtID09PSByZXNwb25zZVR5cGVcbiAgICApIHx8IHRoaXMuX2RlZmF1bHRzLnJlc3BvbnNlVHlwZVxuICB9XG4gIGdldCBfdHlwZSgpIHsgcmV0dXJuIHRoaXMudHlwZSB9XG4gIHNldCBfdHlwZSh0eXBlKSB7IHRoaXMudHlwZSA9IHR5cGUgfVxuICBnZXQgX3VybCgpIHsgcmV0dXJuIHRoaXMudXJsIH1cbiAgc2V0IF91cmwodXJsKSB7IHRoaXMudXJsID0gdXJsIH1cbiAgZ2V0IF9oZWFkZXJzKCkgeyByZXR1cm4gdGhpcy5oZWFkZXJzIHx8IFtdIH1cbiAgc2V0IF9oZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLl9oZWFkZXJzLmxlbmd0aCA9IDBcbiAgICBoZWFkZXJzLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgdGhpcy5faGVhZGVycy5wdXNoKGhlYWRlcilcbiAgICAgIGhlYWRlciA9IE9iamVjdC5lbnRyaWVzKGhlYWRlcilbMF1cbiAgICAgIHRoaXMuX3hoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgIH0pXG4gIH1cbiAgZ2V0IF9kYXRhKCkgeyByZXR1cm4gdGhpcy5kYXRhIH1cbiAgc2V0IF9kYXRhKGRhdGEpIHsgdGhpcy5kYXRhID0gZGF0YSB9XG4gIGdldCBfeGhyKCkge1xuICAgIHRoaXMueGhyID0gKHRoaXMueGhyKVxuICAgICAgPyB0aGlzLnhoclxuICAgICAgOiBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgIHJldHVybiB0aGlzLnhoclxuICB9XG4gIGdldCBfZW5hYmxlZCgpIHsgcmV0dXJuIHRoaXMuZW5hYmxlZCB8fCBmYWxzZSB9XG4gIHNldCBfZW5hYmxlZChlbmFibGVkKSB7IHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQgfVxuICByZXF1ZXN0KGRhdGEpIHtcbiAgICBkYXRhID0gZGF0YSB8fCB0aGlzLmRhdGEgfHwgbnVsbFxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZih0aGlzLl94aHIuc3RhdHVzID09PSAyMDApIHRoaXMuX3hoci5hYm9ydCgpXG4gICAgICB0aGlzLl94aHIub3Blbih0aGlzLnR5cGUsIHRoaXMudXJsKVxuICAgICAgdGhpcy5faGVhZGVycyA9IHRoaXMuc2V0dGluZ3MuaGVhZGVycyB8fCBbdGhpcy5fZGVmYXVsdHMuY29udGVudFR5cGVdXG4gICAgICB0aGlzLl94aHIub25sb2FkID0gcmVzb2x2ZVxuICAgICAgdGhpcy5feGhyLm9uZXJyb3IgPSByZWplY3RcbiAgICAgIHRoaXMuX3hoci5zZW5kKGRhdGEpXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgJ3hocjpyZXNvbHZlJywge1xuICAgICAgICAgIG5hbWU6ICd4aHI6cmVzb2x2ZScsXG4gICAgICAgICAgZGF0YTogcmVzcG9uc2UuY3VycmVudFRhcmdldCxcbiAgICAgICAgfSxcbiAgICAgICAgdGhpc1xuICAgICAgKVxuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfSkuY2F0Y2goKGVycm9yKSA9PiB7IHRocm93IGVycm9yIH0pXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgICF0aGlzLmVuYWJsZWQgJiZcbiAgICAgIE9iamVjdC5rZXlzKHNldHRpbmdzKS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGlmKHNldHRpbmdzLnR5cGUpIHRoaXMuX3R5cGUgPSBzZXR0aW5ncy50eXBlXG4gICAgICBpZihzZXR0aW5ncy51cmwpIHRoaXMuX3VybCA9IHNldHRpbmdzLnVybFxuICAgICAgaWYoc2V0dGluZ3MuZGF0YSkgdGhpcy5fZGF0YSA9IHNldHRpbmdzLmRhdGEgfHwgbnVsbFxuICAgICAgaWYodGhpcy5zZXR0aW5ncy5yZXNwb25zZVR5cGUpIHRoaXMuX3Jlc3BvbnNlVHlwZSA9IHRoaXMuX3NldHRpbmdzLnJlc3BvbnNlVHlwZVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgIHRoaXMuZW5hYmxlZCAmJlxuICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MpLmxlbmd0aFxuICAgICkge1xuICAgICAgZGVsZXRlIHRoaXMuX3R5cGVcbiAgICAgIGRlbGV0ZSB0aGlzLl91cmxcbiAgICAgIGRlbGV0ZSB0aGlzLl9kYXRhXG4gICAgICBkZWxldGUgdGhpcy5faGVhZGVyc1xuICAgICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlVHlwZVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IFNlcnZpY2VcbiIsImltcG9ydCBVdGlscyBmcm9tICcuLi9VdGlscy9pbmRleCdcbmltcG9ydCBCYXNlIGZyb20gJy4uL0Jhc2UvaW5kZXgnXG5cbmNvbnN0IE1vZGVsID0gY2xhc3MgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZ2V0IGtleU1hcCgpIHsgcmV0dXJuIFtcbiAgICAnbmFtZScsXG4gICAgJ3NjaGVtYScsXG4gICAgJ2xvY2FsU3RvcmFnZScsXG4gICAgJ2hpc3Rpb2dyYW0nLFxuICAgICdzZXJ2aWNlcycsXG4gICAgJ3NlcnZpY2VDYWxsYmFja3MnLFxuICAgICdzZXJ2aWNlRXZlbnRzJyxcbiAgICAnZGF0YScsXG4gICAgJ2RhdGFDYWxsYmFja3MnLFxuICAgICdkYXRhRXZlbnRzJyxcbiAgICAnZGVmYXVsdHMnXG4gIF0gfVxuICBnZXQgX3NjaGVtYSgpIHsgcmV0dXJuIHRoaXMuX3NjaGVtYSB9XG4gIHNldCBfc2NoZW1hKHNjaGVtYSkgeyB0aGlzLnNjaGVtYSA9IHNjaGVtYSB9XG4gIGdldCBfaXNTZXR0aW5nKCkgeyByZXR1cm4gdGhpcy5pc1NldHRpbmcgfVxuICBzZXQgX2lzU2V0dGluZyhpc1NldHRpbmcpIHsgdGhpcy5pc1NldHRpbmcgPSBpc1NldHRpbmcgfVxuICBnZXQgX2NoYW5naW5nKCkge1xuICAgIHRoaXMuY2hhbmdpbmcgPSB0aGlzLmNoYW5naW5nIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMuY2hhbmdpbmdcbiAgfVxuICBnZXQgX2xvY2FsU3RvcmFnZSgpIHsgcmV0dXJuIHRoaXMubG9jYWxTdG9yYWdlIH1cbiAgc2V0IF9sb2NhbFN0b3JhZ2UobG9jYWxTdG9yYWdlKSB7IHRoaXMubG9jYWxTdG9yYWdlID0gbG9jYWxTdG9yYWdlIH1cbiAgZ2V0IF9kZWZhdWx0cygpIHsgcmV0dXJuIHRoaXMuZGVmYXVsdHMgfVxuICBzZXQgX2RlZmF1bHRzKGRlZmF1bHRzKSB7IHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0cyB9XG4gIGdldCBfaGlzdGlvZ3JhbSgpIHsgcmV0dXJuIHRoaXMuaGlzdGlvZ3JhbSB8fCB7XG4gICAgbGVuZ3RoOiAxXG4gIH0gfVxuICBzZXQgX2hpc3Rpb2dyYW0oaGlzdGlvZ3JhbSkge1xuICAgIHRoaXMuaGlzdGlvZ3JhbSA9IE9iamVjdC5hc3NpZ24oXG4gICAgICB0aGlzLl9oaXN0aW9ncmFtLFxuICAgICAgaGlzdGlvZ3JhbVxuICAgIClcbiAgfVxuICBnZXQgX2hpc3RvcnkoKSB7XG4gICAgdGhpcy5oaXN0b3J5ID0gdGhpcy5oaXN0b3J5IHx8IFtdXG4gICAgcmV0dXJuIHRoaXMuaGlzdG9yeVxuICB9XG4gIHNldCBfaGlzdG9yeShkYXRhKSB7XG4gICAgaWYoXG4gICAgICBPYmplY3Qua2V5cyhkYXRhKS5sZW5ndGhcbiAgICApIHtcbiAgICAgIGlmKHRoaXMuX2hpc3Rpb2dyYW0ubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuX2hpc3RvcnkudW5zaGlmdCh0aGlzLnBhcnNlKGRhdGEpKVxuICAgICAgICB0aGlzLl9oaXN0b3J5LnNwbGljZSh0aGlzLl9oaXN0aW9ncmFtLmxlbmd0aClcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IF9kYigpIHtcbiAgICBsZXQgZGIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZS5lbmRwb2ludClcbiAgICB0aGlzLmRiID0gZGIgfHwgJ3t9J1xuICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMuZGIpXG4gIH1cbiAgc2V0IF9kYihkYikge1xuICAgIGRiID0gSlNPTi5zdHJpbmdpZnkoZGIpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2UuZW5kcG9pbnQsIGRiKVxuICB9XG4gIGdldCBfZGF0YSgpIHtcbiAgICB0aGlzLmRhdGEgPSAgdGhpcy5kYXRhIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMuZGF0YVxuICB9XG4gIGdldCBfZGF0YUV2ZW50cygpIHtcbiAgICB0aGlzLmRhdGFFdmVudHMgPSB0aGlzLmRhdGFFdmVudHMgfHwge31cbiAgICByZXR1cm4gdGhpcy5kYXRhRXZlbnRzXG4gIH1cbiAgc2V0IF9kYXRhRXZlbnRzKGRhdGFFdmVudHMpIHtcbiAgICB0aGlzLmRhdGFFdmVudHMgPSBVdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBkYXRhRXZlbnRzLCB0aGlzLl9kYXRhRXZlbnRzXG4gICAgKVxuICB9XG4gIGdldCBfZGF0YUNhbGxiYWNrcygpIHtcbiAgICB0aGlzLmRhdGFDYWxsYmFja3MgPSB0aGlzLmRhdGFDYWxsYmFja3MgfHwge31cbiAgICByZXR1cm4gdGhpcy5kYXRhQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9kYXRhQ2FsbGJhY2tzKGRhdGFDYWxsYmFja3MpIHtcbiAgICB0aGlzLmRhdGFDYWxsYmFja3MgPSBVdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBkYXRhQ2FsbGJhY2tzLCB0aGlzLl9kYXRhQ2FsbGJhY2tzXG4gICAgKVxuICB9XG4gIGdldCBfc2VydmljZXMoKSB7XG4gICAgdGhpcy5zZXJ2aWNlcyA9ICB0aGlzLnNlcnZpY2VzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZXNcbiAgfVxuICBzZXQgX3NlcnZpY2VzKHNlcnZpY2VzKSB7XG4gICAgdGhpcy5zZXJ2aWNlcyA9IFV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHNlcnZpY2VzLCB0aGlzLl9zZXJ2aWNlc1xuICAgIClcbiAgfVxuICBnZXQgX3NlcnZpY2VFdmVudHMoKSB7XG4gICAgdGhpcy5zZXJ2aWNlRXZlbnRzID0gdGhpcy5zZXJ2aWNlRXZlbnRzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZUV2ZW50c1xuICB9XG4gIHNldCBfc2VydmljZUV2ZW50cyhzZXJ2aWNlRXZlbnRzKSB7XG4gICAgdGhpcy5zZXJ2aWNlRXZlbnRzID0gVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgc2VydmljZUV2ZW50cywgdGhpcy5fc2VydmljZUV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX3NlcnZpY2VDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzID0gdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICB9XG4gIHNldCBfc2VydmljZUNhbGxiYWNrcyhzZXJ2aWNlQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5zZXJ2aWNlQ2FsbGJhY2tzID0gVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgc2VydmljZUNhbGxiYWNrcywgdGhpcy5fc2VydmljZUNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZ2V0KCkge1xuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGFba2V5XVxuICAgICAgICBicmVha1xuICAgIH1cbiAgfVxuICBzZXQoKSB7XG4gICAgdGhpcy5faGlzdG9yeSA9IHRoaXMucGFyc2UoKVxuICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHRoaXMuX2lzU2V0dGluZyA9IHRydWVcbiAgICAgICAgbGV0IF9hcmd1bWVudHMgPSBPYmplY3QuZW50cmllcyhhcmd1bWVudHNbMF0pXG4gICAgICAgIF9hcmd1bWVudHMuZm9yRWFjaCgoW2tleSwgdmFsdWVdLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGlmKGluZGV4ID09PSAoX2FyZ3VtZW50cy5sZW5ndGggLSAxKSkgdGhpcy5faXNTZXR0aW5nID0gZmFsc2VcbiAgICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSAyOlxuICAgICAgICB2YXIga2V5ID0gYXJndW1lbnRzWzBdXG4gICAgICAgIHZhciB2YWx1ZSA9IGFyZ3VtZW50c1sxXVxuICAgICAgICB0aGlzLnNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKVxuICAgICAgICBicmVha1xuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0KCkge1xuICAgIHRoaXMuX2hpc3RvcnkgPSB0aGlzLnBhcnNlKClcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICBmb3IobGV0IGtleSBvZiBPYmplY3Qua2V5cyh0aGlzLl9kYXRhKSkge1xuICAgICAgICAgIHRoaXMudW5zZXREYXRhUHJvcGVydHkoa2V5KVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgdGhpcy51bnNldERhdGFQcm9wZXJ0eShrZXkpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0REIoKSB7XG4gICAgbGV0IGRiID0gdGhpcy5fZGJcbiAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICB2YXIgX2FyZ3VtZW50cyA9IE9iamVjdC5lbnRyaWVzKGFyZ3VtZW50c1swXSlcbiAgICAgICAgX2FyZ3VtZW50cy5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICBkYltrZXldID0gdmFsdWVcbiAgICAgICAgfSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgbGV0IGtleSA9IGFyZ3VtZW50c1swXVxuICAgICAgICBsZXQgdmFsdWUgPSBhcmd1bWVudHNbMV1cbiAgICAgICAgZGJba2V5XSA9IHZhbHVlXG4gICAgICAgIGJyZWFrXG4gICAgfVxuICAgIHRoaXMuX2RiID0gZGJcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVuc2V0REIoKSB7XG4gICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgZGVsZXRlIHRoaXMuX2RiXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGxldCBkYiA9IHRoaXMuX2RiXG4gICAgICAgIGxldCBrZXkgPSBhcmd1bWVudHNbMF1cbiAgICAgICAgZGVsZXRlIGRiW2tleV1cbiAgICAgICAgdGhpcy5fZGIgPSBkYlxuICAgICAgICBicmVha1xuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHNldERhdGFQcm9wZXJ0eShrZXksIHZhbHVlKSB7XG4gICAgaWYoIXRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXSkge1xuICAgICAgbGV0IGNvbnRleHQgPSB0aGlzXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhcbiAgICAgICAgdGhpcy5fZGF0YSxcbiAgICAgICAge1xuICAgICAgICAgIFsnXycuY29uY2F0KGtleSldOiB7XG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQoKSB7IHJldHVybiB0aGlzW2tleV0gfSxcbiAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICBsZXQgc2NoZW1hID0gY29udGV4dC5fc2V0dGluZ3Muc2NoZW1hXG4gICAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICAgIHNjaGVtYSAmJlxuICAgICAgICAgICAgICAgIHNjaGVtYVtrZXldXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgY29udGV4dC5fY2hhbmdpbmdba2V5XSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIGNvbnRleHQuc2V0REIoa2V5LCB2YWx1ZSlcbiAgICAgICAgICAgICAgfSBlbHNlIGlmKCFzY2hlbWEpIHtcbiAgICAgICAgICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgICAgIGNvbnRleHQuX2NoYW5naW5nW2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgICAgIGlmKHRoaXMubG9jYWxTdG9yYWdlKSBjb250ZXh0LnNldERCKGtleSwgdmFsdWUpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgbGV0IHNldFZhbHVlRXZlbnROYW1lID0gWydzZXQnLCAnOicsIGtleV0uam9pbignJylcbiAgICAgICAgICAgICAgbGV0IHNldEV2ZW50TmFtZSA9ICdzZXQnXG4gICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICBzZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBzZXRWYWx1ZUV2ZW50TmFtZSxcbiAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb250ZXh0XG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgaWYoIWNvbnRleHQuX2lzU2V0dGluZykge1xuICAgICAgICAgICAgICAgIGlmKCFPYmplY3QudmFsdWVzKGNvbnRleHQuX2NoYW5naW5nKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnRleHQuZW1pdChcbiAgICAgICAgICAgICAgICAgICAgc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgbmFtZTogc2V0RXZlbnROYW1lLFxuICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGNvbnRleHQuX2RhdGEsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHRcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgY29udGV4dC5lbWl0KFxuICAgICAgICAgICAgICAgICAgICBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzZXRFdmVudE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgZGF0YTogT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5fY2hhbmdpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0Ll9kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dFxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWxldGUgY29udGV4dC5jaGFuZ2luZ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApXG4gICAgfVxuICAgIHRoaXMuX2RhdGFbJ18nLmNvbmNhdChrZXkpXSA9IHZhbHVlXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICB1bnNldERhdGFQcm9wZXJ0eShrZXkpIHtcbiAgICBsZXQgdW5zZXRWYWx1ZUV2ZW50TmFtZSA9IFsndW5zZXQnLCAnOicsIGtleV0uam9pbignJylcbiAgICBsZXQgdW5zZXRFdmVudE5hbWUgPSAndW5zZXQnXG4gICAgbGV0IHVuc2V0VmFsdWUgPSB0aGlzLl9kYXRhW2tleV1cbiAgICBkZWxldGUgdGhpcy5fZGF0YVsnXycuY29uY2F0KGtleSldXG4gICAgZGVsZXRlIHRoaXMuX2RhdGFba2V5XVxuICAgIHRoaXMuZW1pdChcbiAgICAgIHVuc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IHVuc2V0VmFsdWVFdmVudE5hbWUsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogdW5zZXRWYWx1ZSxcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHRoaXNcbiAgICApXG4gICAgdGhpcy5lbWl0KFxuICAgICAgdW5zZXRFdmVudE5hbWUsXG4gICAgICB7XG4gICAgICAgIG5hbWU6IHVuc2V0RXZlbnROYW1lLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgdmFsdWU6IHVuc2V0VmFsdWUsXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0aGlzXG4gICAgKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgc2V0RGVmYXVsdHMoKSB7XG4gICAgbGV0IF9kZWZhdWx0cyA9IHt9XG4gICAgaWYodGhpcy5kZWZhdWx0cykgT2JqZWN0LmFzc2lnbihfZGVmYXVsdHMsIHRoaXMuZGVmYXVsdHMpXG4gICAgaWYodGhpcy5sb2NhbFN0b3JhZ2UpIE9iamVjdC5hc3NpZ24oX2RlZmF1bHRzLCB0aGlzLl9kYilcbiAgICBpZihPYmplY3Qua2V5cyhfZGVmYXVsdHMpKSB0aGlzLnNldChfZGVmYXVsdHMpXG4gIH1cbiAgcmVzZXRTZXJ2aWNlRXZlbnRzKCkge1xuICAgIHJldHVybiB0aGlzXG4gICAgICAuZGlzYWJsZVNlcnZpY2VFdmVudHMoKVxuICAgICAgLmVuYWJsZVNlcnZpY2VFdmVudHMoKVxuICB9XG4gIGVuYWJsZVNlcnZpY2VFdmVudHMoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLnNlcnZpY2VzICYmXG4gICAgICB0aGlzLnNlcnZpY2VFdmVudHMgJiZcbiAgICAgIHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLnNlcnZpY2VFdmVudHMsIHRoaXMuc2VydmljZXMsIHRoaXMuc2VydmljZUNhbGxiYWNrcylcbiAgICB9XG4gIH1cbiAgZGlzYWJsZVNlcnZpY2VFdmVudHMoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLnNlcnZpY2VzICYmXG4gICAgICB0aGlzLnNlcnZpY2VFdmVudHMgJiZcbiAgICAgIHRoaXMuc2VydmljZUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5zZXJ2aWNlRXZlbnRzLCB0aGlzLnNlcnZpY2VzLCB0aGlzLnNlcnZpY2VDYWxsYmFja3MpXG4gICAgfVxuICB9XG4gIHJlc2V0RGF0YUV2ZW50cygpIHtcbiAgICByZXR1cm4gdGhpc1xuICAgICAgLmRpc2FibGVEYXRhRXZlbnRzKClcbiAgICAgIC5lbmFibGVEYXRhRXZlbnRzKClcbiAgfVxuICBlbmFibGVEYXRhRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5kYXRhRXZlbnRzICYmXG4gICAgICB0aGlzLmRhdGFDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIFV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5kYXRhRXZlbnRzLCB0aGlzLCB0aGlzLmRhdGFDYWxsYmFja3MpXG4gICAgfVxuICB9XG4gIGRpc2FibGVEYXRhRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5kYXRhRXZlbnRzICYmXG4gICAgICB0aGlzLmRhdGFDYWxsYmFja3NcbiAgICApIHtcbiAgICB9XG4gICAgVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy5kYXRhRXZlbnRzLCB0aGlzLCB0aGlzLmRhdGFDYWxsYmFja3MpXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3NcbiAgICBpZihcbiAgICAgICF0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0UHJvcGVydGllcyhzZXR0aW5ncyB8fCB7fSwgdGhpcy5rZXlNYXAsIHtcbiAgICAgICAgJ2RhdGEnOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIHRoaXMuc2V0KHZhbHVlKVxuICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgIH0pXG4gICAgICB0aGlzLmVuYWJsZVNlcnZpY2VFdmVudHMoKVxuICAgICAgdGhpcy5lbmFibGVEYXRhRXZlbnRzKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0cnVlXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICB0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZGlzYWJsZVNlcnZpY2VFdmVudHMoKVxuICAgICAgdGhpcy5kaXNhYmxlRGF0YUV2ZW50cygpXG4gICAgICB0aGlzLmRlbGV0ZVByb3BlcnRpZXMoc2V0dGluZ3MgfHwge30sIHRoaXMua2V5TWFwKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgcGFyc2UoZGF0YSkge1xuICAgIGRhdGEgPSBkYXRhIHx8IHRoaXMuX2RhdGEgfHwge31cbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNb2RlbFxuIiwiaW1wb3J0IFV0aWxzIGZyb20gJy4uL1V0aWxzL2luZGV4J1xuaW1wb3J0IEJhc2UgZnJvbSAnLi4vQmFzZS9pbmRleCdcblxuY29uc3QgVmlldyA9IGNsYXNzIGV4dGVuZHMgQmFzZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKC4uLmFyZ3VtZW50cylcbiAgICB0aGlzLmVuYWJsZSgpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBnZXQgZWxlbWVudEtleU1hcCgpIHsgcmV0dXJuIFtcbiAgICAnZWxlbWVudE5hbWUnLFxuICAgICdlbGVtZW50JyxcbiAgICAnYXR0cmlidXRlcycsXG4gICAgJ3RlbXBsYXRlcycsXG4gICAgJ2luc2VydCdcbiAgXSB9XG4gIGdldCB1aUtleU1hcCgpIHsgcmV0dXJuIFtcbiAgICAndWknLFxuICAgICd1aUNhbGxiYWNrcycsXG4gICAgJ3VpRXZlbnRzJ1xuICBdIH1cbiAgZ2V0IF9lbGVtZW50TmFtZSgpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQudGFnTmFtZSB9XG4gIHNldCBfZWxlbWVudE5hbWUoZWxlbWVudE5hbWUpIHtcbiAgICBpZighdGhpcy5fZWxlbWVudCkgdGhpcy5fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudE5hbWUpXG4gIH1cbiAgZ2V0IF9lbGVtZW50KCkgeyByZXR1cm4gdGhpcy5lbGVtZW50IH1cbiAgc2V0IF9lbGVtZW50KGVsZW1lbnQpIHtcbiAgICBpZihcbiAgICAgIGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxuICAgICAgZWxlbWVudCBpbnN0YW5jZW9mIERvY3VtZW50XG4gICAgKSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgfSBlbHNlIGlmKHR5cGVvZiBlbGVtZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtZW50KVxuICAgIH1cbiAgICB0aGlzLmVsZW1lbnRPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudCwge1xuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICB9KVxuICB9XG4gIGdldCBfYXR0cmlidXRlcygpIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQuYXR0cmlidXRlcyB9XG4gIHNldCBfYXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XG4gICAgZm9yKGxldCBbYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoYXR0cmlidXRlcykpIHtcbiAgICAgIGlmKHR5cGVvZiBhdHRyaWJ1dGVWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlS2V5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlS2V5LCBhdHRyaWJ1dGVWYWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZ2V0IHVpKCkgeyByZXR1cm4gdGhpcy5fdWkgfVxuICBnZXQgX3VpKCkge1xuICAgIGxldCB1aSA9IHt9XG4gICAgdWlbJzpzY29wZSddID0gdGhpcy5lbGVtZW50XG4gICAgT2JqZWN0LmVudHJpZXModGhpcy51aUVsZW1lbnRzKVxuICAgICAgLmZvckVhY2goKFt1aUtleSwgdWlWYWx1ZV0pID0+IHtcbiAgICAgICAgaWYodHlwZW9mIHVpVmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgbGV0IHNjb3BlUmVnRXhwID0gbmV3IFJlZ0V4cCgvXihcXDpzY29wZShcXFcpezAsfT57MCx9KS8pXG4gICAgICAgICAgdWlWYWx1ZSA9IHVpVmFsdWUucmVwbGFjZShzY29wZVJlZ0V4cCwgJycpXG4gICAgICAgICAgdWlbdWlLZXldID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodWlWYWx1ZSlcbiAgICAgICAgfSBlbHNlIGlmKFxuICAgICAgICAgIHVpVmFsdWUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCB8fFxuICAgICAgICAgIHVpVmFsdWUgaW5zdGFuY2VvZiBEb2N1bWVudFxuICAgICAgICApIHtcbiAgICAgICAgICB1aVt1aUtleV0gPSB1aVZhbHVlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgcmV0dXJuIHVpXG4gIH1cbiAgc2V0IF91aSh1aSkgeyB0aGlzLnVpRWxlbWVudHMgPSB1aSB9XG4gIGdldCBfdWlFdmVudHMoKSB7IHJldHVybiB0aGlzLnVpRXZlbnRzIH1cbiAgc2V0IF91aUV2ZW50cyh1aUV2ZW50cykgeyB0aGlzLnVpRXZlbnRzID0gdWlFdmVudHMgfVxuICBnZXQgX3VpQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMudWlDYWxsYmFja3MgPSB0aGlzLnVpQ2FsbGJhY2tzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMudWlDYWxsYmFja3NcbiAgfVxuICBzZXQgX3VpQ2FsbGJhY2tzKHVpQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy51aUNhbGxiYWNrcyA9IFV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHVpQ2FsbGJhY2tzLCB0aGlzLl91aUNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX29ic2VydmVyQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3MgPSB0aGlzLm9ic2VydmVyQ2FsbGJhY2tzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMub2JzZXJ2ZXJDYWxsYmFja3NcbiAgfVxuICBzZXQgX29ic2VydmVyQ2FsbGJhY2tzKG9ic2VydmVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5vYnNlcnZlckNhbGxiYWNrcyA9IFV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG9ic2VydmVyQ2FsbGJhY2tzLCB0aGlzLl9vYnNlcnZlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgZWxlbWVudE9ic2VydmVyKCkge1xuICAgIHRoaXMuX2VsZW1lbnRPYnNlcnZlciA9IHRoaXMuX2VsZW1lbnRPYnNlcnZlciB8fCBuZXcgTXV0YXRpb25PYnNlcnZlcih0aGlzLmVsZW1lbnRPYnNlcnZlLmJpbmQodGhpcykpXG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRPYnNlcnZlclxuICB9XG4gIGdldCBfaW5zZXJ0KCkgeyByZXR1cm4gdGhpcy5pbnNlcnQgfVxuICBzZXQgX2luc2VydChpbnNlcnQpIHsgdGhpcy5pbnNlcnQgPSBpbnNlcnQgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgZ2V0IF90ZW1wbGF0ZXMoKSB7XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSB0aGlzLnRlbXBsYXRlcyB8fCB7fVxuICAgIHJldHVybiB0aGlzLnRlbXBsYXRlc1xuICB9XG4gIHNldCBfdGVtcGxhdGVzKHRlbXBsYXRlcykge1xuICAgIHRoaXMudGVtcGxhdGVzID0gVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdGVtcGxhdGVzLCB0aGlzLl90ZW1wbGF0ZXNcbiAgICApXG4gIH1cbiAgZWxlbWVudE9ic2VydmUobXV0YXRpb25SZWNvcmRMaXN0LCBvYnNlcnZlcikge1xuICAgIGZvcihsZXQgW211dGF0aW9uUmVjb3JkSW5kZXgsIG11dGF0aW9uUmVjb3JkXSBvZiBPYmplY3QuZW50cmllcyhtdXRhdGlvblJlY29yZExpc3QpKSB7XG4gICAgICBzd2l0Y2gobXV0YXRpb25SZWNvcmQudHlwZSkge1xuICAgICAgICBjYXNlICdjaGlsZExpc3QnOlxuICAgICAgICAgIGxldCBtdXRhdGlvblJlY29yZENhdGVnb3JpZXMgPSBbJ2FkZGVkTm9kZXMnLCAncmVtb3ZlZE5vZGVzJ11cbiAgICAgICAgICBmb3IobGV0IG11dGF0aW9uUmVjb3JkQ2F0ZWdvcnkgb2YgbXV0YXRpb25SZWNvcmRDYXRlZ29yaWVzKSB7XG4gICAgICAgICAgICBpZihtdXRhdGlvblJlY29yZFttdXRhdGlvblJlY29yZENhdGVnb3J5XS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgdGhpcy5yZXNldFVJKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgYXV0b0luc2VydCgpIHtcbiAgICBpZih0aGlzLmluc2VydCkge1xuICAgICAgbGV0IHBhcmVudEVsZW1lbnRcbiAgICAgIGlmKFV0aWxzLnR5cGVPZih0aGlzLmluc2VydC5lbGVtZW50KSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcGFyZW50RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5pbnNlcnQuZWxlbWVudClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcmVudEVsZW1lbnQgPSB0aGlzLmluc2VydC5lbGVtZW50XG4gICAgICB9XG4gICAgICBpZihcbiAgICAgICAgcGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IHx8XG4gICAgICAgIHBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlXG4gICAgICApIHtcbiAgICAgICAgcGFyZW50RWxlbWVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQodGhpcy5pbnNlcnQubWV0aG9kLCB0aGlzLmVsZW1lbnQpXG4gICAgICB9IGVsc2UgaWYocGFyZW50RWxlbWVudCBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XG4gICAgICAgIHBhcmVudEVsZW1lbnRcbiAgICAgICAgICAuZm9yRWFjaCgoX3BhcmVudEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIF9wYXJlbnRFbGVtZW50Lmluc2VydEFkamFjZW50RWxlbWVudCh0aGlzLmluc2VydC5tZXRob2QsIHRoaXMuZWxlbWVudClcbiAgICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGF1dG9SZW1vdmUoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLmVsZW1lbnQgJiZcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnRFbGVtZW50XG4gICAgKSB0aGlzLmVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBlbmFibGVFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLnNldFByb3BlcnRpZXModGhpcy5zZXR0aW5ncyB8fCB7fSwgdGhpcy5lbGVtZW50S2V5TWFwKVxuICB9XG4gIGRpc2FibGVFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmRlbGV0ZVByb3BlcnRpZXModGhpcy5zZXR0aW5ncyB8fCB7fSwgdGhpcy5lbGVtZW50S2V5TWFwKVxuICB9XG4gIHJlc2V0VUkoKSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgICAgIC5kaXNhYmxlVUkoKVxuICAgICAgLmVuYWJsZVVJKClcbiAgfVxuICBlbmFibGVVSSgpIHtcbiAgICByZXR1cm4gdGhpc1xuICAgICAgLnNldFByb3BlcnRpZXModGhpcy5zZXR0aW5ncyB8fCB7fSwgdGhpcy51aUtleU1hcClcbiAgICAgIC5lbmFibGVVSUV2ZW50cygpXG4gIH1cbiAgZGlzYWJsZVVJKCkge1xuICAgIHJldHVybiB0aGlzXG4gICAgICAuZGlzYWJsZVVJRXZlbnRzKClcbiAgICAgIC5kZWxldGVQcm9wZXJ0aWVzKHRoaXMuc2V0dGluZ3MgfHwge30sIHRoaXMudWlLZXlNYXApXG4gIH1cbiAgZW5hYmxlVUlFdmVudHMoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLnVpRXZlbnRzICYmXG4gICAgICB0aGlzLnVpICYmXG4gICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgKSB7XG4gICAgICBVdGlscy5iaW5kRXZlbnRzVG9UYXJnZXRWaWV3T2JqZWN0cyhcbiAgICAgICAgdGhpcy51aUV2ZW50cyxcbiAgICAgICAgdGhpcy51aSxcbiAgICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGVuYWJsZVJlbmRlcmVycygpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzIHx8IHt9XG4gICAgVXRpbHMub2JqZWN0UXVlcnkoXG4gICAgICAnWy9ecmVuZGVyLio/L10nLFxuICAgICAgc2V0dGluZ3NcbiAgICApLmZvckVhY2goKFtyZW5kZXJlck5hbWUsIHJlbmRlcmVyRnVuY3Rpb25dKSA9PiB7XG4gICAgICB0aGlzW3JlbmRlcmVyTmFtZV0gPSByZW5kZXJlckZ1bmN0aW9uXG4gICAgfSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGVSZW5kZXJlcnMoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5ncyB8fCB7fVxuICAgIFV0aWxzLm9iamVjdFF1ZXJ5KFxuICAgICAgJ1svXnJlbmRlci4qPy9dJyxcbiAgICAgIHNldHRpbmdzXG4gICAgKS5mb3JFYWNoKChyZW5kZXJlck5hbWUsIHJlbmRlcmVyRnVuY3Rpb24pID0+IHtcbiAgICAgIGRlbGV0ZSB0aGlzW3JlbmRlcmVyTmFtZV1cbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZGlzYWJsZVVJRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy51aUV2ZW50cyAmJlxuICAgICAgdGhpcy51aSAmJlxuICAgICAgdGhpcy51aUNhbGxiYWNrc1xuICAgICkge1xuICAgICAgVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldFZpZXdPYmplY3RzKFxuICAgICAgICB0aGlzLnVpRXZlbnRzLFxuICAgICAgICB0aGlzLnVpLFxuICAgICAgICB0aGlzLnVpQ2FsbGJhY2tzXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGxldCBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3MgfHwge31cbiAgICBpZihcbiAgICAgICF0aGlzLl9lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzXG4gICAgICAgIC5lbmFibGVSZW5kZXJlcnMoKVxuICAgICAgICAuZW5hYmxlRWxlbWVudCgpXG4gICAgICAgIC5lbmFibGVVSSgpXG4gICAgICAgIC5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5fZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpc1xuICAgICAgICAuZGlzYWJsZVJlbmRlcmVycygpXG4gICAgICAgIC5kaXNhYmxlVUkoKVxuICAgICAgICAuZGlzYWJsZUVsZW1lbnQoKVxuICAgICAgICAuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBWaWV3XG4iLCJpbXBvcnQgVXRpbHMgZnJvbSAnLi4vVXRpbHMvaW5kZXgnXG5pbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4J1xuXG5jb25zdCBDb250cm9sbGVyID0gY2xhc3MgZXh0ZW5kcyBCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoLi4uYXJndW1lbnRzKVxuICB9XG4gIGdldCBrZXlNYXAoKSB7IHJldHVybiBbXG4gICAgJ21vZGVsQ2FsbGJhY2tzJyxcbiAgICAndmlld0NhbGxiYWNrcycsXG4gICAgJ2NvbnRyb2xsZXJDYWxsYmFja3MnLFxuICAgICdyb3V0ZXJDYWxsYmFja3MnLFxuICAgICdtb2RlbHMnLFxuICAgICd2aWV3cycsXG4gICAgJ2NvbnRyb2xsZXJzJyxcbiAgICAncm91dGVycycsXG4gICAgJ21vZGVsRXZlbnRzJyxcbiAgICAndmlld0V2ZW50cycsXG4gICAgJ2NvbnRyb2xsZXJFdmVudHMnLFxuICAgICdyb3V0ZXJFdmVudHMnXG4gIF0gfVxuICBnZXQgX21vZGVsQ2FsbGJhY2tzKCkge1xuICAgIHRoaXMubW9kZWxDYWxsYmFja3MgPSB0aGlzLm1vZGVsQ2FsbGJhY2tzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgfVxuICBzZXQgX21vZGVsQ2FsbGJhY2tzKG1vZGVsQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5tb2RlbENhbGxiYWNrcyA9IFV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG1vZGVsQ2FsbGJhY2tzLCB0aGlzLl9tb2RlbENhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX3ZpZXdDYWxsYmFja3MoKSB7XG4gICAgdGhpcy52aWV3Q2FsbGJhY2tzID0gdGhpcy52aWV3Q2FsbGJhY2tzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMudmlld0NhbGxiYWNrc1xuICB9XG4gIHNldCBfdmlld0NhbGxiYWNrcyh2aWV3Q2FsbGJhY2tzKSB7XG4gICAgdGhpcy52aWV3Q2FsbGJhY2tzID0gVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld0NhbGxiYWNrcywgdGhpcy5fdmlld0NhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXJDYWxsYmFja3MoKSB7XG4gICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzID0gdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICB9XG4gIHNldCBfY29udHJvbGxlckNhbGxiYWNrcyhjb250cm9sbGVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzID0gVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlckNhbGxiYWNrcywgdGhpcy5fY29udHJvbGxlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVscygpIHtcbiAgICB0aGlzLm1vZGVscyA9IHRoaXMubW9kZWxzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMubW9kZWxzXG4gIH1cbiAgc2V0IF9tb2RlbHMobW9kZWxzKSB7XG4gICAgdGhpcy5tb2RlbHMgPSBVdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICBtb2RlbHMsIHRoaXMuX21vZGVsc1xuICAgIClcbiAgfVxuICBnZXQgX3ZpZXdzKCkge1xuICAgIHRoaXMudmlld3MgPSB0aGlzLnZpZXdzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMudmlld3NcbiAgfVxuICBzZXQgX3ZpZXdzKHZpZXdzKSB7XG4gICAgdGhpcy52aWV3cyA9IFV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHZpZXdzLCB0aGlzLl92aWV3c1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXJzKCkge1xuICAgIHRoaXMuY29udHJvbGxlcnMgPSB0aGlzLmNvbnRyb2xsZXJzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlcnNcbiAgfVxuICBzZXQgX2NvbnRyb2xsZXJzKGNvbnRyb2xsZXJzKSB7XG4gICAgdGhpcy5jb250cm9sbGVycyA9IFV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIGNvbnRyb2xsZXJzLCB0aGlzLl9jb250cm9sbGVyc1xuICAgIClcbiAgfVxuICBnZXQgX3JvdXRlcnMoKSB7XG4gICAgdGhpcy5yb3V0ZXJzID0gdGhpcy5yb3V0ZXJzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVyc1xuICB9XG4gIHNldCBfcm91dGVycyhyb3V0ZXJzKSB7XG4gICAgdGhpcy5yb3V0ZXJzID0gVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgcm91dGVycywgdGhpcy5fcm91dGVyc1xuICAgIClcbiAgfVxuICBnZXQgX3JvdXRlckV2ZW50cygpIHtcbiAgICB0aGlzLnJvdXRlckV2ZW50cyA9IHRoaXMucm91dGVyRXZlbnRzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVyRXZlbnRzXG4gIH1cbiAgc2V0IF9yb3V0ZXJFdmVudHMocm91dGVyRXZlbnRzKSB7XG4gICAgdGhpcy5yb3V0ZXJFdmVudHMgPSBVdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXJFdmVudHMsIHRoaXMuX3JvdXRlckV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX3JvdXRlckNhbGxiYWNrcygpIHtcbiAgICB0aGlzLnJvdXRlckNhbGxiYWNrcyA9IHRoaXMucm91dGVyQ2FsbGJhY2tzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMucm91dGVyQ2FsbGJhY2tzXG4gIH1cbiAgc2V0IF9yb3V0ZXJDYWxsYmFja3Mocm91dGVyQ2FsbGJhY2tzKSB7XG4gICAgdGhpcy5yb3V0ZXJDYWxsYmFja3MgPSBVdGlscy5hZGRQcm9wZXJ0aWVzVG9PYmplY3QoXG4gICAgICByb3V0ZXJDYWxsYmFja3MsIHRoaXMuX3JvdXRlckNhbGxiYWNrc1xuICAgIClcbiAgfVxuICBnZXQgX21vZGVsRXZlbnRzKCkge1xuICAgIHRoaXMubW9kZWxFdmVudHMgPSB0aGlzLm1vZGVsRXZlbnRzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMubW9kZWxFdmVudHNcbiAgfVxuICBzZXQgX21vZGVsRXZlbnRzKG1vZGVsRXZlbnRzKSB7XG4gICAgdGhpcy5tb2RlbEV2ZW50cyA9IFV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIG1vZGVsRXZlbnRzLCB0aGlzLl9tb2RlbEV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX3ZpZXdFdmVudHMoKSB7XG4gICAgdGhpcy52aWV3RXZlbnRzID0gdGhpcy52aWV3RXZlbnRzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMudmlld0V2ZW50c1xuICB9XG4gIHNldCBfdmlld0V2ZW50cyh2aWV3RXZlbnRzKSB7XG4gICAgdGhpcy52aWV3RXZlbnRzID0gVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgdmlld0V2ZW50cywgdGhpcy5fdmlld0V2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2NvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgdGhpcy5jb250cm9sbGVyRXZlbnRzID0gdGhpcy5jb250cm9sbGVyRXZlbnRzIHx8IHt9XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlckV2ZW50c1xuICB9XG4gIHNldCBfY29udHJvbGxlckV2ZW50cyhjb250cm9sbGVyRXZlbnRzKSB7XG4gICAgdGhpcy5jb250cm9sbGVyRXZlbnRzID0gVXRpbHMuYWRkUHJvcGVydGllc1RvT2JqZWN0KFxuICAgICAgY29udHJvbGxlckV2ZW50cywgdGhpcy5fY29udHJvbGxlckV2ZW50c1xuICAgIClcbiAgfVxuICBnZXQgX2VuYWJsZWQoKSB7IHJldHVybiB0aGlzLmVuYWJsZWQgfHwgZmFsc2UgfVxuICBzZXQgX2VuYWJsZWQoZW5hYmxlZCkgeyB0aGlzLmVuYWJsZWQgPSBlbmFibGVkIH1cbiAgcmVzZXRNb2RlbEV2ZW50cygpIHtcbiAgICByZXR1cm4gdGhpc1xuICAgICAgLmRpc2FibGVNb2RlbEV2ZW50cygpXG4gICAgICAuZW5hYmxlTW9kZWxFdmVudHMoKVxuICB9XG4gIGVuYWJsZU1vZGVsRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5tb2RlbEV2ZW50cyAmJlxuICAgICAgdGhpcy5tb2RlbHMgJiZcbiAgICAgIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIFV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5tb2RlbEV2ZW50cywgdGhpcy5tb2RlbHMsIHRoaXMubW9kZWxDYWxsYmFja3MpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZGlzYWJsZU1vZGVsRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5tb2RlbEV2ZW50cyAmJlxuICAgICAgdGhpcy5tb2RlbHMgJiZcbiAgICAgIHRoaXMubW9kZWxDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIFV0aWxzLnVuYmluZEV2ZW50c0Zyb21UYXJnZXRPYmplY3RzKHRoaXMubW9kZWxFdmVudHMsIHRoaXMubW9kZWxzLCB0aGlzLm1vZGVsQ2FsbGJhY2tzKVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHJlc2V0Vmlld0V2ZW50cygpIHtcbiAgICByZXR1cm4gdGhpc1xuICAgICAgLmRpc2FibGVWaWV3RXZlbnRzKClcbiAgICAgIC5lbmFibGVWaWV3RXZlbnRzKClcbiAgfVxuICBlbmFibGVWaWV3RXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy52aWV3RXZlbnRzICYmXG4gICAgICB0aGlzLnZpZXdzICYmXG4gICAgICB0aGlzLnZpZXdDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIFV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy52aWV3RXZlbnRzLCB0aGlzLnZpZXdzLCB0aGlzLnZpZXdDYWxsYmFja3MpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZGlzYWJsZVZpZXdFdmVudHMoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLnZpZXdFdmVudHMgJiZcbiAgICAgIHRoaXMudmlld3MgJiZcbiAgICAgIHRoaXMudmlld0NhbGxiYWNrc1xuICAgICkge1xuICAgICAgVXRpbHMudW5iaW5kRXZlbnRzRnJvbVRhcmdldE9iamVjdHModGhpcy52aWV3RXZlbnRzLCB0aGlzLnZpZXdzLCB0aGlzLnZpZXdDYWxsYmFja3MpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgcmVzZXRDb250cm9sbGVyRXZlbnRzKCkge1xuICAgIHJldHVybiB0aGlzXG4gICAgICAuZGlzYWJsZUNvbnRyb2xsZXJFdmVudHMoKVxuICAgICAgLmVuYWJsZUNvbnRyb2xsZXJFdmVudHMoKVxuICB9XG4gIGVuYWJsZUNvbnRyb2xsZXJFdmVudHMoKSB7XG4gICAgaWYoXG4gICAgICB0aGlzLmNvbnRyb2xsZXJFdmVudHMgJiZcbiAgICAgIHRoaXMuY29udHJvbGxlcnMgJiZcbiAgICAgIHRoaXMuY29udHJvbGxlckNhbGxiYWNrc1xuICAgICkge1xuICAgICAgVXRpbHMuYmluZEV2ZW50c1RvVGFyZ2V0T2JqZWN0cyh0aGlzLmNvbnRyb2xsZXJFdmVudHMsIHRoaXMuY29udHJvbGxlcnMsIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBkaXNhYmxlQ29udHJvbGxlckV2ZW50cygpIHtcbiAgICBpZihcbiAgICAgIHRoaXMuY29udHJvbGxlckV2ZW50cyAmJlxuICAgICAgdGhpcy5jb250cm9sbGVycyAmJlxuICAgICAgdGhpcy5jb250cm9sbGVyQ2FsbGJhY2tzXG4gICAgKSB7XG4gICAgICBVdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyh0aGlzLmNvbnRyb2xsZXJFdmVudHMsIHRoaXMuY29udHJvbGxlcnMsIHRoaXMuY29udHJvbGxlckNhbGxiYWNrcylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICByZXNldFJvdXRlckV2ZW50cygpIHtcbiAgICByZXR1cm4gdGhpc1xuICAgICAgLmRpc2FibGVSb3V0ZXJFdmVudHMoKVxuICAgICAgLmVuYWJsZVJvdXRlckV2ZW50cygpXG4gIH1cbiAgZW5hYmxlUm91dGVyRXZlbnRzKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5yb3V0ZXJFdmVudHMgJiZcbiAgICAgIHRoaXMucm91dGVycyAmJlxuICAgICAgdGhpcy5yb3V0ZXJDYWxsYmFja3NcbiAgICApIHtcbiAgICAgIFV0aWxzLmJpbmRFdmVudHNUb1RhcmdldE9iamVjdHModGhpcy5yb3V0ZXJFdmVudHMsIHRoaXMucm91dGVycywgdGhpcy5yb3V0ZXJDYWxsYmFja3MpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZGlzYWJsZVJvdXRlckV2ZW50cygpIHtcbiAgICBpZihcbiAgICAgIHRoaXMucm91dGVyRXZlbnRzICYmXG4gICAgICB0aGlzLnJvdXRlcnMgJiZcbiAgICAgIHRoaXMucm91dGVyQ2FsbGJhY2tzXG4gICAgKSB7XG4gICAgICBVdGlscy51bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyh0aGlzLnJvdXRlckV2ZW50cywgdGhpcy5yb3V0ZXJzLCB0aGlzLnJvdXRlckNhbGxiYWNrcylcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBlbmFibGUoKSB7XG4gICAgbGV0IHNldHRpbmdzID0gdGhpcy5zZXR0aW5ncyB8fCB7fVxuICAgIGlmKFxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5zZXRQcm9wZXJ0aWVzKHNldHRpbmdzIHx8IHt9LCB0aGlzLmtleU1hcClcbiAgICAgIHRoaXMuZW5hYmxlTW9kZWxFdmVudHMoKVxuICAgICAgdGhpcy5lbmFibGVWaWV3RXZlbnRzKClcbiAgICAgIHRoaXMuZW5hYmxlQ29udHJvbGxlckV2ZW50cygpXG4gICAgICB0aGlzLmVuYWJsZVJvdXRlckV2ZW50cygpXG4gICAgICB0aGlzLl9lbmFibGVkID0gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMuZGlzYWJsZSgpXG4gICAgdGhpcy5lbmFibGUoKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZGlzYWJsZSgpIHtcbiAgICBsZXQgc2V0dGluZ3MgPSB0aGlzLnNldHRpbmdzXG4gICAgaWYoXG4gICAgICB0aGlzLmVuYWJsZWRcbiAgICApIHtcbiAgICAgIHRoaXMuZGlzYWJsZU1vZGVsRXZlbnRzKClcbiAgICAgIHRoaXMuZGlzYWJsZVZpZXdFdmVudHMoKVxuICAgICAgdGhpcy5kaXNhYmxlQ29udHJvbGxlckV2ZW50cygpXG4gICAgICB0aGlzLmRpc2FibGVSb3V0ZXJFdmVudHMoKVxuICAgICAgdGhpcy5kZWxldGVQcm9wZXJ0aWVzKHNldHRpbmdzIHx8IHt9LCB0aGlzLmtleU1hcClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyXG4iLCJpbXBvcnQgVXRpbHMgZnJvbSAnLi4vVXRpbHMvaW5kZXgnXG5pbXBvcnQgQmFzZSBmcm9tICcuLi9CYXNlL2luZGV4J1xuXG5jb25zdCBSb3V0ZXIgPSBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBnZXQgcHJvdG9jb2woKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgfVxuICBnZXQgaG9zdG5hbWUoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgfVxuICBnZXQgcG9ydCgpIHsgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wb3J0IH1cbiAgZ2V0IHBhdGgoKSB7IHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgfVxuICBnZXQgaGFzaCgpIHtcbiAgICBsZXQgaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgbGV0IGhhc2hJbmRleCA9IGhyZWYuaW5kZXhPZignIycpXG4gICAgaWYoaGFzaEluZGV4ID4gLTEpIHtcbiAgICAgIGxldCBwYXJhbUluZGV4ID0gaHJlZi5pbmRleE9mKCc/JylcbiAgICAgIGxldCBzbGljZVN0YXJ0ID0gaGFzaEluZGV4ICsgMVxuICAgICAgbGV0IHNsaWNlU3RvcFxuICAgICAgaWYocGFyYW1JbmRleCA+IC0xKSB7XG4gICAgICAgIHNsaWNlU3RvcCA9IChoYXNoSW5kZXggPiBwYXJhbUluZGV4KVxuICAgICAgICAgID8gaHJlZi5sZW5ndGhcbiAgICAgICAgICA6IHBhcmFtSW5kZXhcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNsaWNlU3RvcCA9IGhyZWYubGVuZ3RoXG4gICAgICB9XG4gICAgICBocmVmID0gaHJlZi5zbGljZShzbGljZVN0YXJ0LCBzbGljZVN0b3ApXG4gICAgICBpZihocmVmLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gaHJlZlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbiAgZ2V0IHBhcmFtcygpIHtcbiAgICBsZXQgaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgbGV0IHBhcmFtSW5kZXggPSBocmVmLmluZGV4T2YoJz8nKVxuICAgIGlmKHBhcmFtSW5kZXggPiAtMSkge1xuICAgICAgbGV0IGhhc2hJbmRleCA9IGhyZWYuaW5kZXhPZignIycpXG4gICAgICBsZXQgc2xpY2VTdGFydCA9IHBhcmFtSW5kZXggKyAxXG4gICAgICBsZXQgc2xpY2VTdG9wXG4gICAgICBpZihoYXNoSW5kZXggPiAtMSkge1xuICAgICAgICBzbGljZVN0b3AgPSAocGFyYW1JbmRleCA+IGhhc2hJbmRleClcbiAgICAgICAgICA/IGhyZWYubGVuZ3RoXG4gICAgICAgICAgOiBoYXNoSW5kZXhcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNsaWNlU3RvcCA9IGhyZWYubGVuZ3RoXG4gICAgICB9XG4gICAgICBocmVmID0gaHJlZi5zbGljZShzbGljZVN0YXJ0LCBzbGljZVN0b3ApXG4gICAgICBpZihocmVmLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gaHJlZlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbiAgZ2V0IF9yb3V0ZURhdGEoKSB7XG4gICAgbGV0IHJvdXRlRGF0YSA9IHtcbiAgICAgIGxvY2F0aW9uOiB7fSxcbiAgICAgIGNvbnRyb2xsZXI6IHt9LFxuICAgIH1cbiAgICBsZXQgcGF0aCA9IHRoaXMucGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICBwYXRoID0gKHBhdGgubGVuZ3RoKVxuICAgICAgPyBwYXRoXG4gICAgICA6IFsnLyddXG4gICAgbGV0IGhhc2ggPSB0aGlzLmhhc2hcbiAgICBsZXQgaGFzaEZyYWdtZW50cyA9IChoYXNoKVxuICAgICAgPyBoYXNoLnNwbGl0KCcvJykuZmlsdGVyKChmcmFnbWVudCkgPT4gZnJhZ21lbnQubGVuZ3RoKVxuICAgICAgOiBudWxsXG4gICAgbGV0IHBhcmFtcyA9IHRoaXMucGFyYW1zXG4gICAgbGV0IHBhcmFtRGF0YSA9IChwYXJhbXMpXG4gICAgICA/IFV0aWxzLnBhcmFtc1RvT2JqZWN0KHBhcmFtcylcbiAgICAgIDogbnVsbFxuICAgIGlmKHRoaXMucHJvdG9jb2wpIHJvdXRlRGF0YS5sb2NhdGlvbi5wcm90b2NvbCA9IHRoaXMucHJvdG9jb2xcbiAgICBpZih0aGlzLmhvc3RuYW1lKSByb3V0ZURhdGEubG9jYXRpb24uaG9zdG5hbWUgPSB0aGlzLmhvc3RuYW1lXG4gICAgaWYodGhpcy5wb3J0KSByb3V0ZURhdGEubG9jYXRpb24ucG9ydCA9IHRoaXMucG9ydFxuICAgIGlmKHRoaXMucGF0aCkgcm91dGVEYXRhLmxvY2F0aW9uLnBhdGggPSB0aGlzLnBhdGhcbiAgICBpZihcbiAgICAgIGhhc2ggJiZcbiAgICAgIGhhc2hGcmFnbWVudHNcbiAgICApIHtcbiAgICAgIGhhc2hGcmFnbWVudHMgPSAoaGFzaEZyYWdtZW50cy5sZW5ndGgpXG4gICAgICAgID8gaGFzaEZyYWdtZW50c1xuICAgICAgICA6IFsnLyddXG4gICAgICByb3V0ZURhdGEubG9jYXRpb24uaGFzaCA9IHtcbiAgICAgICAgcGF0aDogaGFzaCxcbiAgICAgICAgZnJhZ21lbnRzOiBoYXNoRnJhZ21lbnRzLFxuICAgICAgfVxuICAgIH1cbiAgICBpZihcbiAgICAgIHBhcmFtcyAmJlxuICAgICAgcGFyYW1EYXRhXG4gICAgKSB7XG4gICAgICByb3V0ZURhdGEubG9jYXRpb24ucGFyYW1zID0ge1xuICAgICAgICBwYXRoOiBwYXJhbXMsXG4gICAgICAgIGRhdGE6IHBhcmFtRGF0YSxcbiAgICAgIH1cbiAgICB9XG4gICAgcm91dGVEYXRhLmxvY2F0aW9uLnBhdGggPSB7XG4gICAgICBuYW1lOiB0aGlzLnBhdGgsXG4gICAgICBmcmFnbWVudHM6IHBhdGgsXG4gICAgfVxuICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5jdXJyZW50VVJMID0gdGhpcy5jdXJyZW50VVJMXG4gICAgbGV0IHJvdXRlQ29udHJvbGxlckRhdGEgPSB0aGlzLl9yb3V0ZUNvbnRyb2xsZXJEYXRhXG4gICAgcm91dGVEYXRhLmxvY2F0aW9uID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbixcbiAgICAgIHJvdXRlQ29udHJvbGxlckRhdGEubG9jYXRpb25cbiAgICApXG4gICAgcm91dGVEYXRhLmNvbnRyb2xsZXIgPSByb3V0ZUNvbnRyb2xsZXJEYXRhLmNvbnRyb2xsZXJcbiAgICB0aGlzLnJvdXRlRGF0YSA9IHJvdXRlRGF0YVxuICAgIHJldHVybiB0aGlzLnJvdXRlRGF0YVxuICB9XG4gIGdldCBfcm91dGVDb250cm9sbGVyRGF0YSgpIHtcbiAgICBsZXQgcm91dGVEYXRhID0ge1xuICAgICAgbG9jYXRpb246IHt9LFxuICAgIH1cbiAgICBPYmplY3QuZW50cmllcyh0aGlzLnJvdXRlcylcbiAgICAgIC5mb3JFYWNoKChbcm91dGVQYXRoLCByb3V0ZVNldHRpbmdzXSkgPT4ge1xuICAgICAgICBsZXQgcGF0aEZyYWdtZW50cyA9IHRoaXMucGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgICAgcGF0aEZyYWdtZW50cyA9IChwYXRoRnJhZ21lbnRzLmxlbmd0aClcbiAgICAgICAgICA/IHBhdGhGcmFnbWVudHNcbiAgICAgICAgICA6IFsnLyddXG4gICAgICAgIGxldCByb3V0ZUZyYWdtZW50cyA9IHJvdXRlUGF0aC5zcGxpdCgnLycpLmZpbHRlcigoZnJhZ21lbnQsIGZyYWdtZW50SW5kZXgpID0+IGZyYWdtZW50Lmxlbmd0aClcbiAgICAgICAgcm91dGVGcmFnbWVudHMgPSAocm91dGVGcmFnbWVudHMubGVuZ3RoKVxuICAgICAgICAgID8gcm91dGVGcmFnbWVudHNcbiAgICAgICAgICA6IFsnLyddXG4gICAgICAgIGlmKFxuICAgICAgICAgIHBhdGhGcmFnbWVudHMubGVuZ3RoICYmXG4gICAgICAgICAgcGF0aEZyYWdtZW50cy5sZW5ndGggPT09IHJvdXRlRnJhZ21lbnRzLmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICBsZXQgbWF0Y2hcbiAgICAgICAgICByZXR1cm4gcm91dGVGcmFnbWVudHMuZmlsdGVyKChyb3V0ZUZyYWdtZW50LCByb3V0ZUZyYWdtZW50SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICBtYXRjaCA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICAgICAgICAgIG1hdGNoID09PSB0cnVlXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgaWYocm91dGVGcmFnbWVudFswXSA9PT0gJzonKSB7XG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRJREtleSA9IHJvdXRlRnJhZ21lbnQucmVwbGFjZSgnOicsICcnKVxuICAgICAgICAgICAgICAgIGlmKFxuICAgICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudEluZGV4ID09PSBwYXRoRnJhZ21lbnRzLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgIHJvdXRlRGF0YS5sb2NhdGlvbi5jdXJyZW50SURLZXkgPSBjdXJyZW50SURLZXlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcm91dGVEYXRhLmxvY2F0aW9uW2N1cnJlbnRJREtleV0gPSBwYXRoRnJhZ21lbnRzW3JvdXRlRnJhZ21lbnRJbmRleF1cbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50ID0gdGhpcy5mcmFnbWVudElEUmVnRXhwXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcm91dGVGcmFnbWVudCA9IHJvdXRlRnJhZ21lbnQucmVwbGFjZShuZXcgUmVnRXhwKCcvJywgJ2dpJyksICdcXFxcXFwvJylcbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50ID0gdGhpcy5yb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cChyb3V0ZUZyYWdtZW50KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG1hdGNoID0gcm91dGVGcmFnbWVudC50ZXN0KHBhdGhGcmFnbWVudHNbcm91dGVGcmFnbWVudEluZGV4XSlcbiAgICAgICAgICAgICAgaWYoXG4gICAgICAgICAgICAgICAgbWF0Y2ggPT09IHRydWUgJiZcbiAgICAgICAgICAgICAgICByb3V0ZUZyYWdtZW50SW5kZXggPT09IHBhdGhGcmFnbWVudHMubGVuZ3RoIC0gMVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByb3V0ZURhdGEubG9jYXRpb24ucm91dGUgPSB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiByb3V0ZVBhdGgsXG4gICAgICAgICAgICAgICAgICBmcmFnbWVudHM6IHJvdXRlRnJhZ21lbnRzLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByb3V0ZURhdGEuY29udHJvbGxlciA9IHJvdXRlU2V0dGluZ3NcbiAgICAgICAgICAgICAgICByZXR1cm4gcm91dGVTZXR0aW5nc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlbMF1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICByZXR1cm4gcm91dGVEYXRhXG4gIH1cbiAgZ2V0IF9lbmFibGVkKCkgeyByZXR1cm4gdGhpcy5lbmFibGVkIHx8IGZhbHNlIH1cbiAgc2V0IF9lbmFibGVkKGVuYWJsZWQpIHsgdGhpcy5lbmFibGVkID0gZW5hYmxlZCB9XG4gIGdldCBfcm91dGVzKCkge1xuICAgIHRoaXMucm91dGVzID0gdGhpcy5yb3V0ZXMgfHwge31cbiAgICByZXR1cm4gdGhpcy5yb3V0ZXNcbiAgfVxuICBzZXQgX3JvdXRlcyhyb3V0ZXMpIHtcbiAgICB0aGlzLnJvdXRlcyA9IFV0aWxzLmFkZFByb3BlcnRpZXNUb09iamVjdChcbiAgICAgIHJvdXRlcywgdGhpcy5fcm91dGVzXG4gICAgKVxuICB9XG4gIGdldCBfY29udHJvbGxlcigpIHsgcmV0dXJuIHRoaXMuY29udHJvbGxlciB9XG4gIHNldCBfY29udHJvbGxlcihjb250cm9sbGVyKSB7IHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXIgfVxuICBnZXQgX3ByZXZpb3VzVVJMKCkgeyByZXR1cm4gdGhpcy5wcmV2aW91c1VSTCB9XG4gIHNldCBfcHJldmlvdXNVUkwocHJldmlvdXNVUkwpIHsgdGhpcy5wcmV2aW91c1VSTCA9IHByZXZpb3VzVVJMIH1cbiAgZ2V0IF9jdXJyZW50VVJMKCkgeyByZXR1cm4gdGhpcy5jdXJyZW50VVJMIH1cbiAgc2V0IF9jdXJyZW50VVJMKGN1cnJlbnRVUkwpIHtcbiAgICBpZih0aGlzLmN1cnJlbnRVUkwpIHRoaXMuX3ByZXZpb3VzVVJMID0gdGhpcy5jdXJyZW50VVJMXG4gICAgdGhpcy5jdXJyZW50VVJMID0gY3VycmVudFVSTFxuICB9XG4gIGdldCBmcmFnbWVudElEUmVnRXhwKCkgeyByZXR1cm4gbmV3IFJlZ0V4cCgvXihbMC05QS1aXFw/XFw9XFwsXFwuXFwqXFwtXFxfXFwnXFxcIlxcXlxcJVxcJFxcI1xcQFxcIVxcflxcKFxcKVxce1xcfVxcJlxcPFxcPlxcXFxcXC9dKSokLywgJ2dpJykgfVxuICByb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cChmcmFnbWVudCkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKCdeJy5jb25jYXQoZnJhZ21lbnQsICckJykpXG4gIH1cbiAgZW5hYmxlKCkge1xuICAgIGlmKFxuICAgICAgIXRoaXMuZW5hYmxlZFxuICAgICkge1xuICAgICAgdGhpcy5lbmFibGVFdmVudHMoKVxuICAgICAgdGhpcy5lbmFibGVSb3V0ZXMoKVxuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRydWVcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBkaXNhYmxlKCkge1xuICAgIGlmKFxuICAgICAgdGhpcy5lbmFibGVkXG4gICAgKSB7XG4gICAgICB0aGlzLmRpc2FibGVFdmVudHMoKVxuICAgICAgdGhpcy5kaXNhYmxlUm91dGVzKClcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGVuYWJsZVJvdXRlcygpIHtcbiAgICBpZih0aGlzLnNldHRpbmdzLmNvbnRyb2xsZXIpIHRoaXMuX2NvbnRyb2xsZXIgPSB0aGlzLnNldHRpbmdzLmNvbnRyb2xsZXJcbiAgICB0aGlzLl9yb3V0ZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnNldHRpbmdzLnJvdXRlcykucmVkdWNlKFxuICAgICAgKFxuICAgICAgICBfcm91dGVzLFxuICAgICAgICBbcm91dGVQYXRoLCByb3V0ZVNldHRpbmdzXSxcbiAgICAgICAgcm91dGVJbmRleCxcbiAgICAgICAgb3JpZ2luYWxSb3V0ZXMsXG4gICAgICApID0+IHtcbiAgICAgICAgX3JvdXRlc1tyb3V0ZVBhdGhdID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICByb3V0ZVNldHRpbmdzLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGNhbGxiYWNrOiB0aGlzLmNvbnRyb2xsZXJbcm91dGVTZXR0aW5ncy5jYWxsYmFja10uYmluZCh0aGlzLmNvbnRyb2xsZXIpLFxuICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgICAgICByZXR1cm4gX3JvdXRlc1xuICAgICAgfSxcbiAgICAgIHt9XG4gICAgKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgZGlzYWJsZVJvdXRlcygpIHtcbiAgICBkZWxldGUgdGhpcy5fcm91dGVzXG4gICAgZGVsZXRlIHRoaXMuX2NvbnRyb2xsZXJcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGVuYWJsZUV2ZW50cygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIHRoaXMucm91dGVDaGFuZ2UuYmluZCh0aGlzKSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRpc2FibGVFdmVudHMoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aGlzLnJvdXRlQ2hhbmdlLmJpbmQodGhpcykpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICByb3V0ZUNoYW5nZSgpIHtcbiAgICB0aGlzLl9jdXJyZW50VVJMID0gd2luZG93LmxvY2F0aW9uLmhyZWZcbiAgICBsZXQgcm91dGVEYXRhID0gdGhpcy5fcm91dGVEYXRhXG4gICAgaWYocm91dGVEYXRhLmNvbnRyb2xsZXIpIHtcbiAgICAgIGlmKHRoaXMucHJldmlvdXNVUkwpIHJvdXRlRGF0YS5wcmV2aW91c1VSTCA9IHRoaXMucHJldmlvdXNVUkxcbiAgICAgIHRoaXMuZW1pdChcbiAgICAgICAgJ25hdmlnYXRlJyxcbiAgICAgICAgcm91dGVEYXRhXG4gICAgICApXG4gICAgICByb3V0ZURhdGEuY29udHJvbGxlci5jYWxsYmFjayhyb3V0ZURhdGEpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cbiAgbmF2aWdhdGUocGF0aCkge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aFxuICB9XG59XG5leHBvcnQgZGVmYXVsdCBSb3V0ZXJcbiIsImltcG9ydCBFdmVudHMgZnJvbSAnLi9FdmVudHMvaW5kZXgnXG5pbXBvcnQgQ2hhbm5lbHMgZnJvbSAnLi9DaGFubmVscy9pbmRleCdcbmltcG9ydCBVdGlscyBmcm9tICcuL1V0aWxzL2luZGV4J1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi9TZXJ2aWNlL2luZGV4J1xuaW1wb3J0IE1vZGVsIGZyb20gJy4vTW9kZWwvaW5kZXgnXG5pbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcvaW5kZXgnXG5pbXBvcnQgQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXIvaW5kZXgnXG5pbXBvcnQgUm91dGVyIGZyb20gJy4vUm91dGVyL2luZGV4J1xuY29uc3QgTVZDID0ge1xuICBFdmVudHMsXG4gIENoYW5uZWxzLFxuICBVdGlscyxcbiAgU2VydmljZSxcbiAgTW9kZWwsXG4gIFZpZXcsXG4gIENvbnRyb2xsZXIsXG4gIFJvdXRlcixcbn1cbmV4cG9ydCBkZWZhdWx0IE1WQ1xuIl0sIm5hbWVzIjpbIkV2ZW50cyIsImV2ZW50TmFtZSIsIl9ldmVudHMiLCJldmVudENhbGxiYWNrIiwibmFtZSIsImxlbmd0aCIsImV2ZW50Q2FsbGJhY2tzIiwiZXZlbnRDYWxsYmFja05hbWUiLCJnZXRFdmVudENhbGxiYWNrcyIsImdldEV2ZW50Q2FsbGJhY2tOYW1lIiwiZXZlbnRDYWxsYmFja0dyb3VwIiwiZ2V0RXZlbnRDYWxsYmFja0dyb3VwIiwicHVzaCIsImFyZ3VtZW50cyIsImV2ZW50cyIsIk9iamVjdCIsImtleXMiLCJldmVudERhdGEiLCJfYXJndW1lbnRzIiwidmFsdWVzIiwiZW50cmllcyIsImV2ZW50Q2FsbGJhY2tHcm91cE5hbWUiLCJhZGRpdGlvbmFsQXJndW1lbnRzIiwic3BsaWNlIiwiQ2hhbm5lbCIsInJlc3BvbnNlTmFtZSIsInJlc3BvbnNlQ2FsbGJhY2siLCJfcmVzcG9uc2VzIiwicmVzcG9uc2UiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsInJlc3BvbnNlcyIsIkNoYW5uZWxzIiwiY2hhbm5lbE5hbWUiLCJfY2hhbm5lbHMiLCJjaGFubmVscyIsImFkZFByb3BlcnRpZXNUb09iamVjdCIsInRhcmdldE9iamVjdCIsInByb3BlcnRpZXMiLCJmb3JFYWNoIiwicHJvcGVydHlOYW1lIiwicHJvcGVydHlWYWx1ZSIsImlzQXJyYXkiLCJvYmplY3QiLCJpc09iamVjdCIsImlzSFRNTEVsZW1lbnQiLCJIVE1MRWxlbWVudCIsInBhcnNlTm90YXRpb24iLCJzdHJpbmciLCJjaGFyQXQiLCJzcGxpdCIsInBhcnNlRnJhZ21lbnQiLCJmcmFnbWVudCIsIlJlZ0V4cCIsImNvbmNhdCIsIm9iamVjdFF1ZXJ5IiwiY29udGV4dCIsInN0cmluZ0RhdGEiLCJyZWR1Y2UiLCJmcmFnbWVudEluZGV4IiwiZnJhZ21lbnRzIiwicHJvcGVydHlLZXkiLCJtYXRjaCIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldE9iamVjdHMiLCJ0b2dnbGVNZXRob2QiLCJ0YXJnZXRPYmplY3RzIiwiY2FsbGJhY2tzIiwiZXZlbnRTZXR0aW5ncyIsImV2ZW50VGFyZ2V0U2V0dGluZ3MiLCJldmVudFRhcmdldHMiLCJldmVudFRhcmdldE5hbWUiLCJldmVudFRhcmdldCIsImV2ZW50TWV0aG9kTmFtZSIsInRvZ2dsZUV2ZW50c0ZvclRhcmdldFZpZXdPYmplY3RzIiwiTm9kZUxpc3QiLCJfZXZlbnRUYXJnZXQiLCJiaW5kRXZlbnRzVG9UYXJnZXRWaWV3T2JqZWN0cyIsInVuYmluZEV2ZW50c0Zyb21UYXJnZXRWaWV3T2JqZWN0cyIsImJpbmRFdmVudHNUb1RhcmdldE9iamVjdHMiLCJ1bmJpbmRFdmVudHNGcm9tVGFyZ2V0T2JqZWN0cyIsInR5cGVPZiIsImRhdGEiLCJfb2JqZWN0IiwicGFyYW1zVG9PYmplY3QiLCJwYXJhbXMiLCJwYXJhbURhdGEiLCJkZWNvZGVVUklDb21wb25lbnQiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJVSUQiLCJ1dWlkIiwiaWkiLCJNYXRoIiwicmFuZG9tIiwidG9TdHJpbmciLCJVdGlscyIsInVpZCIsIkJhc2UiLCJzZXR0aW5ncyIsImNvbmZpZ3VyYXRpb24iLCJfc2V0dGluZ3MiLCJfY29uZmlndXJhdGlvbiIsImtleU1hcCIsInN3aXRjaGVzIiwic2V0dGluZ3NDb3VudCIsImtleUNvdW50Iiwic29tZSIsImtleSIsInVuZGVmaW5lZCIsIl91aWQiLCJTZXJ2aWNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJfeGhyIiwic3RhdHVzIiwiYWJvcnQiLCJvcGVuIiwidHlwZSIsInVybCIsIl9oZWFkZXJzIiwiaGVhZGVycyIsIl9kZWZhdWx0cyIsImNvbnRlbnRUeXBlIiwib25sb2FkIiwib25lcnJvciIsInNlbmQiLCJ0aGVuIiwiZW1pdCIsImN1cnJlbnRUYXJnZXQiLCJlcnJvciIsImVuYWJsZWQiLCJfdHlwZSIsIl91cmwiLCJfZGF0YSIsInJlc3BvbnNlVHlwZSIsIl9yZXNwb25zZVR5cGUiLCJfZW5hYmxlZCIsImRlZmF1bHRzIiwiX3Jlc3BvbnNlVHlwZXMiLCJmaW5kIiwicmVzcG9uc2VUeXBlSXRlbSIsImhlYWRlciIsInNldFJlcXVlc3RIZWFkZXIiLCJ4aHIiLCJYTUxIdHRwUmVxdWVzdCIsIk1vZGVsIiwiX2hpc3RvcnkiLCJfaXNTZXR0aW5nIiwiaW5kZXgiLCJ2YWx1ZSIsInNldERhdGFQcm9wZXJ0eSIsInVuc2V0RGF0YVByb3BlcnR5IiwiZGIiLCJfZGIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiY29uZmlndXJhYmxlIiwiZ2V0Iiwic2V0Iiwic2NoZW1hIiwiX2NoYW5naW5nIiwibG9jYWxTdG9yYWdlIiwic2V0REIiLCJzZXRWYWx1ZUV2ZW50TmFtZSIsImpvaW4iLCJzZXRFdmVudE5hbWUiLCJhc3NpZ24iLCJjaGFuZ2luZyIsInVuc2V0VmFsdWVFdmVudE5hbWUiLCJ1bnNldEV2ZW50TmFtZSIsInVuc2V0VmFsdWUiLCJkaXNhYmxlU2VydmljZUV2ZW50cyIsImVuYWJsZVNlcnZpY2VFdmVudHMiLCJzZXJ2aWNlcyIsInNlcnZpY2VFdmVudHMiLCJzZXJ2aWNlQ2FsbGJhY2tzIiwiZGlzYWJsZURhdGFFdmVudHMiLCJlbmFibGVEYXRhRXZlbnRzIiwiZGF0YUV2ZW50cyIsImRhdGFDYWxsYmFja3MiLCJzZXRQcm9wZXJ0aWVzIiwiYmluZCIsImRlbGV0ZVByb3BlcnRpZXMiLCJfc2NoZW1hIiwiaXNTZXR0aW5nIiwiaGlzdGlvZ3JhbSIsIl9oaXN0aW9ncmFtIiwiaGlzdG9yeSIsInVuc2hpZnQiLCJnZXRJdGVtIiwiZW5kcG9pbnQiLCJzZXRJdGVtIiwiX2RhdGFFdmVudHMiLCJfZGF0YUNhbGxiYWNrcyIsIl9zZXJ2aWNlcyIsIl9zZXJ2aWNlRXZlbnRzIiwiX3NlcnZpY2VDYWxsYmFja3MiLCJWaWV3IiwiZW5hYmxlIiwibXV0YXRpb25SZWNvcmRMaXN0Iiwib2JzZXJ2ZXIiLCJtdXRhdGlvblJlY29yZEluZGV4IiwibXV0YXRpb25SZWNvcmQiLCJtdXRhdGlvblJlY29yZENhdGVnb3JpZXMiLCJtdXRhdGlvblJlY29yZENhdGVnb3J5IiwicmVzZXRVSSIsImluc2VydCIsInBhcmVudEVsZW1lbnQiLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiTm9kZSIsImluc2VydEFkamFjZW50RWxlbWVudCIsIm1ldGhvZCIsIl9wYXJlbnRFbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJlbGVtZW50S2V5TWFwIiwiZGlzYWJsZVVJIiwiZW5hYmxlVUkiLCJ1aUtleU1hcCIsImVuYWJsZVVJRXZlbnRzIiwiZGlzYWJsZVVJRXZlbnRzIiwidWlFdmVudHMiLCJ1aSIsInVpQ2FsbGJhY2tzIiwicmVuZGVyZXJOYW1lIiwicmVuZGVyZXJGdW5jdGlvbiIsImVuYWJsZVJlbmRlcmVycyIsImVuYWJsZUVsZW1lbnQiLCJkaXNhYmxlUmVuZGVyZXJzIiwiZGlzYWJsZUVsZW1lbnQiLCJfZWxlbWVudCIsInRhZ05hbWUiLCJlbGVtZW50TmFtZSIsImNyZWF0ZUVsZW1lbnQiLCJEb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJlbGVtZW50T2JzZXJ2ZXIiLCJvYnNlcnZlIiwic3VidHJlZSIsImNoaWxkTGlzdCIsImF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVLZXkiLCJhdHRyaWJ1dGVWYWx1ZSIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsIl91aSIsInVpRWxlbWVudHMiLCJ1aUtleSIsInVpVmFsdWUiLCJzY29wZVJlZ0V4cCIsInJlcGxhY2UiLCJfdWlDYWxsYmFja3MiLCJvYnNlcnZlckNhbGxiYWNrcyIsIl9vYnNlcnZlckNhbGxiYWNrcyIsIl9lbGVtZW50T2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwiZWxlbWVudE9ic2VydmUiLCJ0ZW1wbGF0ZXMiLCJfdGVtcGxhdGVzIiwiQ29udHJvbGxlciIsImRpc2FibGVNb2RlbEV2ZW50cyIsImVuYWJsZU1vZGVsRXZlbnRzIiwibW9kZWxFdmVudHMiLCJtb2RlbHMiLCJtb2RlbENhbGxiYWNrcyIsImRpc2FibGVWaWV3RXZlbnRzIiwiZW5hYmxlVmlld0V2ZW50cyIsInZpZXdFdmVudHMiLCJ2aWV3cyIsInZpZXdDYWxsYmFja3MiLCJkaXNhYmxlQ29udHJvbGxlckV2ZW50cyIsImVuYWJsZUNvbnRyb2xsZXJFdmVudHMiLCJjb250cm9sbGVyRXZlbnRzIiwiY29udHJvbGxlcnMiLCJjb250cm9sbGVyQ2FsbGJhY2tzIiwiZGlzYWJsZVJvdXRlckV2ZW50cyIsImVuYWJsZVJvdXRlckV2ZW50cyIsInJvdXRlckV2ZW50cyIsInJvdXRlcnMiLCJyb3V0ZXJDYWxsYmFja3MiLCJkaXNhYmxlIiwiX21vZGVsQ2FsbGJhY2tzIiwiX3ZpZXdDYWxsYmFja3MiLCJfY29udHJvbGxlckNhbGxiYWNrcyIsIl9tb2RlbHMiLCJfdmlld3MiLCJfY29udHJvbGxlcnMiLCJfcm91dGVycyIsIl9yb3V0ZXJFdmVudHMiLCJfcm91dGVyQ2FsbGJhY2tzIiwiX21vZGVsRXZlbnRzIiwiX3ZpZXdFdmVudHMiLCJfY29udHJvbGxlckV2ZW50cyIsIlJvdXRlciIsImVuYWJsZUV2ZW50cyIsImVuYWJsZVJvdXRlcyIsImRpc2FibGVFdmVudHMiLCJkaXNhYmxlUm91dGVzIiwiY29udHJvbGxlciIsIl9jb250cm9sbGVyIiwiX3JvdXRlcyIsInJvdXRlcyIsInJvdXRlSW5kZXgiLCJvcmlnaW5hbFJvdXRlcyIsInJvdXRlUGF0aCIsInJvdXRlU2V0dGluZ3MiLCJjYWxsYmFjayIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJyb3V0ZUNoYW5nZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJfY3VycmVudFVSTCIsImxvY2F0aW9uIiwiaHJlZiIsInJvdXRlRGF0YSIsIl9yb3V0ZURhdGEiLCJwcmV2aW91c1VSTCIsInBhdGgiLCJwcm90b2NvbCIsImhvc3RuYW1lIiwicG9ydCIsInBhdGhuYW1lIiwiaGFzaEluZGV4IiwiaW5kZXhPZiIsInBhcmFtSW5kZXgiLCJzbGljZVN0YXJ0Iiwic2xpY2VTdG9wIiwiZmlsdGVyIiwiaGFzaCIsImhhc2hGcmFnbWVudHMiLCJjdXJyZW50VVJMIiwicm91dGVDb250cm9sbGVyRGF0YSIsIl9yb3V0ZUNvbnRyb2xsZXJEYXRhIiwicGF0aEZyYWdtZW50cyIsInJvdXRlRnJhZ21lbnRzIiwicm91dGVGcmFnbWVudCIsInJvdXRlRnJhZ21lbnRJbmRleCIsImN1cnJlbnRJREtleSIsImZyYWdtZW50SURSZWdFeHAiLCJyb3V0ZUZyYWdtZW50TmFtZVJlZ0V4cCIsInRlc3QiLCJyb3V0ZSIsIl9wcmV2aW91c1VSTCIsIk1WQyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTUEsTUFBTTs7QUFBQTtvQkFDSTs7Ozs7O3NDQUtJQyxTQU5SLEVBTW1CO2FBQVMsS0FBS0MsT0FBTCxDQUFhRCxTQUFiLEtBQTJCLEVBQWxDOzs7O3lDQUNWRSxhQVBYLEVBTzBCO2FBQzFCQSxhQUFhLENBQUNDLElBQWQsQ0FBbUJDLE1BQXBCLEdBQ0hGLGFBQWEsQ0FBQ0MsSUFEWCxHQUVILG1CQUZKOzs7OzBDQUlvQkUsY0FaWixFQVk0QkMsaUJBWjVCLEVBWStDO2FBQ2hERCxjQUFjLENBQUNDLGlCQUFELENBQWQsSUFBcUMsRUFBNUM7Ozs7dUJBRUNOLFNBZk8sRUFlSUUsYUFmSixFQWVtQjtVQUN2QkcsY0FBYyxHQUFHLEtBQUtFLGlCQUFMLENBQXVCUCxTQUF2QixDQUFyQjtVQUNJTSxpQkFBaUIsR0FBRyxLQUFLRSxvQkFBTCxDQUEwQk4sYUFBMUIsQ0FBeEI7VUFDSU8sa0JBQWtCLEdBQUcsS0FBS0MscUJBQUwsQ0FBMkJMLGNBQTNCLEVBQTJDQyxpQkFBM0MsQ0FBekI7TUFDQUcsa0JBQWtCLENBQUNFLElBQW5CLENBQXdCVCxhQUF4QjtNQUNBRyxjQUFjLENBQUNDLGlCQUFELENBQWQsR0FBb0NHLGtCQUFwQztXQUNLUixPQUFMLENBQWFELFNBQWIsSUFBMEJLLGNBQTFCO2FBQ08sSUFBUDs7OzswQkFFSTtj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
