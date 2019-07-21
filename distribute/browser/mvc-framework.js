"use strict";

var MVC = MVC || {};
"use strict";

MVC.Constants = {};
MVC.CONST = MVC.Constants;
"use strict";

MVC.Constants.Events = {};
MVC.CONST.EV = MVC.Constants.Events;
"use strict";

MVC.Constants.Templates = {};
MVC.CONST.TMPL = MVC.Constants.Templates;
"use strict";

MVC.Utils = {};
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

MVC.Utils.isArray = function isArray(object) {
  return Array.isArray(object);
};

MVC.Utils.isObject = function isObject(object) {
  return !Array.isArray(object) ? _typeof(object) === 'object' : false;
};

MVC.Utils.isEqualType = function isEqualType(valueA, valueB) {
  return valueA === valueB;
};
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

MVC.Utils.typeOf = function typeOf(data) {
  switch (_typeof(data)) {
    case 'object':
      var _object;

      if (MVC.Utils.isArray(data)) {
        // Array
        return 'array';
      } else if (MVC.Utils.isObject(data)) {
        // Object
        return 'object';
      } else if (data === null) {
        // Null
        return 'null';
      }

      return _object;
      break;

    case 'string':
    case 'number':
    case 'boolean':
    case 'undefined':
    case 'function':
      return _typeof(data);
      break;
  }
};
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

MVC.Utils.addPropertiesToTargetObject = function addPropertiesToTargetObject() {
  var targetObject;

  switch (arguments.length) {
    case 2:
      var properties = arguments[0];
      targetObject = arguments[1];

      for (var _i = 0, _Object$entries = Object.entries(properties); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            _propertyName = _Object$entries$_i[0],
            _propertyValue = _Object$entries$_i[1];

        targetObject[_propertyName] = _propertyValue;
      }

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
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

MVC.Utils.getObjectFromDotNotationString = function getObjectFromDotNotationString(string, context) {
  var object = string.split('.').reduce(function (accumulator, currentValue) {
    currentValue = currentValue[0] === '/' ? new RegExp(currentValue.replace(new RegExp('/', 'g'), '')) : currentValue;

    for (var _i = 0, _Object$entries = Object.entries(context); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          contextKey = _Object$entries$_i[0],
          contextValue = _Object$entries$_i[1];

      if (currentValue instanceof RegExp) {
        if (currentValue.test(contextKey)) {
          accumulator[contextKey] = contextValue;
        }
      } else {
        if (currentValue === contextKey) {
          accumulator[contextKey] = contextValue;
        }
      }
    }

    return accumulator;
  }, {});
  return object;
};
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

MVC.Utils.toggleEventsForTargetObjects = function toggleEventsForTargetObjects(toggleMethod, events, targetObjects, callbacks) {
  for (var _i = 0, _Object$entries = Object.entries(events); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        eventSettings = _Object$entries$_i[0],
        eventCallback = _Object$entries$_i[1];

    var eventData = eventSettings.split(' ');
    var eventTargetSettings = eventData[0];
    var eventName = eventData[1];
    var eventTargets = void 0;

    switch (eventTargetSettings[0] === '@') {
      case true:
        eventTargetSettings = eventTargetSettings.replace('@', '');
        eventTargets = eventTargetSettings ? this.getObjectFromDotNotationString(eventTargetSettings, targetObjects) : {
          0: targetObjects
        };
        break;

      case false:
        eventTargets = document.querySelectorAll(eventTargetSettings);
        break;
    }

    for (var _i2 = 0, _Object$entries2 = Object.entries(eventTargets); _i2 < _Object$entries2.length; _i2++) {
      var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
          eventTargetName = _Object$entries2$_i[0],
          eventTarget = _Object$entries2$_i[1];

      var eventTargetMethodName = toggleMethod === 'on' ? eventTarget instanceof HTMLElement ? 'addEventListener' : 'on' : eventTarget instanceof HTMLElement ? 'removeEventListener' : 'off';
      var eventCallbacks = eventCallback.match('@') ? this.getObjectFromDotNotationString(eventCallback.replace('@', ''), callbacks) : window[eventCallback];

      for (var _i3 = 0, _Object$values = Object.values(eventCallbacks); _i3 < _Object$values.length; _i3++) {
        var _eventCallback = _Object$values[_i3];
        eventTarget[eventTargetMethodName](eventName, _eventCallback);
      }
    }
  }
};

MVC.Utils.bindEventsToTargetObjects = function bindEventsToTargetObjects() {
  this.toggleEventsForTargetObjects.apply(this, ['on'].concat(Array.prototype.slice.call(arguments)));
};

MVC.Utils.unbindEventsFromTargetObjects = function unbindEventsFromTargetObjects() {
  this.toggleEventsForTargetObjects.apply(this, ['off'].concat(Array.prototype.slice.call(arguments)));
};
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

MVC.Utils.validateDataSchema = function validate(data, schema) {
  if (schema) {
    switch (MVC.Utils.typeOf(data)) {
      case 'array':
        var array = [];
        schema = MVC.Utils.typeOf(schema) === 'function' ? schema() : schema;

        if (MVC.Utils.isEqualType(MVC.Utils.typeOf(schema), MVC.Utils.typeOf(array))) {
          for (var _i = 0, _Object$entries = Object.entries(data); _i < _Object$entries.length; _i++) {
            var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
                arrayKey = _Object$entries$_i[0],
                arrayValue = _Object$entries$_i[1];

            array.push(this.validate(arrayValue));
          }
        }

        return array;
        break;

      case 'object':
        var object = {};
        schema = MVC.Utils.typeOf(schema) === 'function' ? schema() : schema;

        if (MVC.Utils.isEqualType(MVC.Utils.typeOf(schema), MVC.Utils.typeOf(object))) {
          for (var _i2 = 0, _Object$entries2 = Object.entries(data); _i2 < _Object$entries2.length; _i2++) {
            var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
                objectKey = _Object$entries2$_i[0],
                objectValue = _Object$entries2$_i[1];

            object[objectKey] = this.validate(objectValue, schema[objectKey]);
          }
        }

        return object;
        break;

      case 'string':
      case 'number':
      case 'boolean':
        schema = MVC.Utils.typeOf(schema) === 'function' ? schema() : schema;

        if (MVC.Utils.isEqualType(MVC.Utils.typeOf(schema), MVC.Utils.typeOf(data))) {
          return data;
        } else {
          throw MVC.CONST.TMPL;
        }

        break;

      case 'null':
        if (MVC.Utils.isEqualType(MVC.Utils.typeOf(schema), MVC.Utils.typeOf(data))) {
          return data;
        }

        break;

      case 'undefined':
        throw MVC.CONST.TMPL;
        break;

      case 'function':
        throw MVC.CONST.TMPL;
        break;
    }
  } else {
    throw MVC.CONST.TMPL;
  }
};
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

MVC.Events =
/*#__PURE__*/
function () {
  function _class() {
    _classCallCheck(this, _class);
  }

  _createClass(_class, [{
    key: "eventCallbacks",
    value: function eventCallbacks(eventName) {
      return this._events[eventName] || {};
    }
  }, {
    key: "eventCallbackName",
    value: function eventCallbackName(eventCallback) {
      return eventCallback.name.length ? eventCallback.name : 'anonymousFunction';
    }
  }, {
    key: "eventCallbackGroup",
    value: function eventCallbackGroup(eventCallbacks, eventCallbackName) {
      return eventCallbacks[eventCallbackName] || [];
    }
  }, {
    key: "on",
    value: function on(eventName, eventCallback) {
      var eventCallbacks = this.eventCallbacks(eventName);
      var eventCallbackName = this.eventCallbackName(eventCallback);
      var eventCallbackGroup = this.eventCallbackGroup(eventCallbacks, eventCallbackName);
      eventCallbackGroup.push(eventCallback);
      eventCallbacks[eventCallbackName] = eventCallbackGroup;
      this._events[eventName] = eventCallbacks;
    }
  }, {
    key: "off",
    value: function off() {
      switch (arguments.length) {
        case 1:
          var eventName = arguments[0];
          delete this._events[eventName];
          break;

        case 2:
          var eventName = arguments[0];
          var eventCallback = arguments[1];
          var eventCallbackName = this.eventCallbackName(eventCallback);
          delete this._events[eventName][eventCallbackName];
          break;
      }
    }
  }, {
    key: "emit",
    value: function emit(eventName, eventData) {
      var eventCallbacks = this.eventCallbacks(eventName);

      for (var _i = 0, _Object$entries = Object.entries(eventCallbacks); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            eventCallbackGroupName = _Object$entries$_i[0],
            eventCallbackGroup = _Object$entries$_i[1];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = eventCallbackGroup[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var eventCallback = _step.value;
            var additionalArguments = Object.values(arguments).splice(2);
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
    }
  }, {
    key: "_events",
    get: function get() {
      this.events = this.events ? this.events : {};
      return this.events;
    }
  }]);

  return _class;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

MVC.Channels =
/*#__PURE__*/
function () {
  function _class() {
    _classCallCheck(this, _class);
  }

  _createClass(_class, [{
    key: "channel",
    value: function channel(channelName) {
      this._channels[channelName] = this._channels[channelName] ? this._channels[channelName] : new MVC.Channels.Channel();
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
      return this.channels || {};
    }
  }]);

  return _class;
}();
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

MVC.Channels.Channel =
/*#__PURE__*/
function () {
  function _class() {
    _classCallCheck(this, _class);
  }

  _createClass(_class, [{
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
    value: function request(responseName, requestData) {
      if (this._responses[responseName]) {
        return this._responses[responseName](requestData);
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
      return this.responses || {};
    }
  }]);

  return _class;
}();
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

MVC.Base =
/*#__PURE__*/
function (_MVC$Events) {
  _inherits(_class, _MVC$Events);

  function _class(settings, options, configuration) {
    var _this;

    _classCallCheck(this, _class);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
    if (configuration) _this._configuration = configuration;
    if (options) _this._options = options;
    if (settings) _this._settings = settings;
    return _this;
  }

  _createClass(_class, [{
    key: "_configuration",
    get: function get() {
      this.configuration = this.configuration ? this.configuration : {};
      return this.configuration;
    },
    set: function set(configuration) {
      this.configuration = configuration;
    }
  }, {
    key: "_options",
    get: function get() {
      this.options = this.options ? this.options : {};
      return this.options;
    },
    set: function set(options) {
      this.options = options;
    }
  }, {
    key: "_settings",
    get: function get() {
      this.settings = this.settings ? this.settings : {};
      return this.settings;
    },
    set: function set(settings) {
      this.settings = settings;
    }
  }]);

  return _class;
}(MVC.Events);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

MVC.Observer =
/*#__PURE__*/
function (_MVC$Base) {
  _inherits(_class, _MVC$Base);

  function _class() {
    var _this;

    _classCallCheck(this, _class);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));

    _this.addSettings();

    _this._observer.observe(_this.target, _this.options);

    return _this;
  }

  _createClass(_class, [{
    key: "addSettings",
    value: function addSettings() {
      if (Object.keys(this._settings).length) {
        this._settings = settings;
        if (this._settings.context) this._context = this._settings.context;
        if (this._settings.target) this._target = this._settings.target instanceof NodeList ? this._settings.target[0] : this._settings.target;
        if (this._settings.options) this._options = this._settings.options;
        if (this._settings.mutations) this._mutations = this._settings.mutations;
      }
    }
  }, {
    key: "observerCallback",
    value: function observerCallback(mutationRecordList, observer) {
      var _this2 = this;

      var _loop = function _loop() {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            mutationRecordIndex = _Object$entries$_i[0],
            mutationRecord = _Object$entries$_i[1];

        switch (mutationRecord.type) {
          case 'childList':
            var mutationRecordCategories = ['addedNodes', 'removedNodes'];

            for (var _i2 = 0, _mutationRecordCatego = mutationRecordCategories; _i2 < _mutationRecordCatego.length; _i2++) {
              var mutationRecordCategory = _mutationRecordCatego[_i2];

              if (mutationRecord[mutationRecordCategory].length) {
                var _loop2 = function _loop2() {
                  var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i3], 2),
                      nodeIndex = _Object$entries2$_i[0],
                      node = _Object$entries2$_i[1];

                  var mutation = _this2.mutations.filter(function (_mutation) {
                    return _mutation.target === node;
                  })[0];

                  if (mutation) {
                    mutation.callback({
                      mutation: mutation,
                      mutationRecord: mutationRecord
                    });
                  }
                };

                for (var _i3 = 0, _Object$entries2 = Object.entries(mutationRecord[mutationRecordCategory]); _i3 < _Object$entries2.length; _i3++) {
                  _loop2();
                }
              }
            }

            break;

          case 'attributes':
            var mutation = _this2.mutations.filter(function (_mutation) {
              return _mutation.name === mutationRecord.type && _mutation.data === mutationRecord.attributeName;
            })[0];

            if (mutation) {
              mutation.callback({
                mutation: mutation,
                mutationRecord: mutationRecord
              });
            }

            break;
        }
      };

      for (var _i = 0, _Object$entries = Object.entries(mutationRecordList); _i < _Object$entries.length; _i++) {
        _loop();
      }
    }
  }, {
    key: "_context",
    get: function get() {
      return this.context;
    },
    set: function set(context) {
      this.context = context;
    }
  }, {
    key: "_target",
    get: function get() {
      return this.target;
    },
    set: function set(target) {
      this.target = target;
    }
  }, {
    key: "_options",
    get: function get() {
      return this.options;
    },
    set: function set(options) {
      this.options = options;
    }
  }, {
    key: "_observer",
    get: function get() {
      this.observer = this.observer ? this.observer : new MutationObserver(this.observerCallback.bind(this));
      return this.observer;
    }
  }, {
    key: "_mutations",
    get: function get() {
      this.mutations = this.mutations ? this.mutations : [];
      return this.mutations;
    },
    set: function set(mutations) {
      for (var _i4 = 0, _Object$entries3 = Object.entries(mutations); _i4 < _Object$entries3.length; _i4++) {
        var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i4], 2),
            mutationSettings = _Object$entries3$_i[0],
            mutationCallback = _Object$entries3$_i[1];

        var mutation = void 0;
        var mutationData = mutationSettings.split(' ');
        var mutationTarget = MVC.Utils.getObjectFromDotNotationString(mutationData[0].replace('@', ''), this.context.ui);
        var mutationEventName = mutationData[1];
        var mutationEventData = mutationData[2];
        mutationCallback = mutationCallback.match('@') ? this.context.observerCallbacks[mutationCallback.replace('@', '')] : typeof mutationCallback === 'string' ? MVC.Utils.getObjectFromDotNotationString(mutationCallback, window) : mutationCallback;
        mutation = {
          target: mutationTarget,
          name: mutationEventName,
          callback: mutationCallback
        };
        if (mutationEventData) mutation.data = mutationEventData;

        this._mutations.push(mutation);
      }
    }
  }]);

  return _class;
}(MVC.Base);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

MVC.Emitter =
/*#__PURE__*/
function (_MVC$Base) {
  _inherits(_class, _MVC$Base);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
  }

  _createClass(_class, [{
    key: "validate",
    value: function validate(data) {
      return MVC.Utils.validateDataSchema(data, this.schema);
    }
  }, {
    key: "_schema",
    get: function get() {
      return this.schema;
    },
    set: function set(schema) {
      this.schema = schema;
    }
  }]);

  return _class;
}(MVC.Base);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

MVC.Service =
/*#__PURE__*/
function (_MVC$Base) {
  _inherits(_class, _MVC$Base);

  function _class() {
    var _this;

    _classCallCheck(this, _class);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));

    _this.addSettings();

    return _this;
  }

  _createClass(_class, [{
    key: "addSettings",
    value: function addSettings() {
      if (Object.keys(this._settings).length) {
        if (this._settings.type) this._type = this._settings.type;
        if (this._settings.url) this._url = this._settings.url;
        if (this._settings.data) this._data = this._settings.data || null;
        if (this._settings.headers) this._headers = this._settings.headers || [this._defaults.contentType];
        if (this._settings.responseType) this._responseType = this._settings.responseType;
      }
    }
  }, {
    key: "newXHR",
    value: function newXHR() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (_this2._xhr.status === 200) _this2._xhr.abort();

        _this2._xhr.open(_this2._type, _this2._url);

        _this2._xhr.onload = resolve;
        _this2._xhr.onerror = reject;

        _this2._xhr.send(_this2._data);
      });
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
      this._headers.length = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = headers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var header = _step.value;

          this._xhr.setRequestHeader({
            header: header
          }[0], {
            header: header
          }[1]);

          this._headers.push(header);
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
  }, {
    key: "_xhr",
    get: function get() {
      this.xhr = this.xhr ? this.xhr : new XMLHttpRequest();
      return this.xhr;
    }
  }]);

  return _class;
}(MVC.Base);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

MVC.Model =
/*#__PURE__*/
function (_MVC$Base) {
  _inherits(_class, _MVC$Base);

  function _class() {
    var _this;

    _classCallCheck(this, _class);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));

    _this.addSettings();

    return _this;
  }

  _createClass(_class, [{
    key: "addSettings",
    value: function addSettings() {
      if (Object.keys(this._settings).length) {
        if (this._settings.histiogram) this._histiogram = this._settings.histiogram;
        if (this._settings.data) this.set(this._settings.data);
        if (this._settings.dataCallbacks) this._dataCallbacks = this._settings.dataCallbacks;
        if (this._settings.dataEvents) this._dataEvents = this._settings.dataEvents;
        if (this._settings.defaults) this._defaults = this._settings.defaults;
      }
    }
  }, {
    key: "get",
    value: function get() {
      var property = arguments[0];
      return this._data['_'.concat(property)];
    }
  }, {
    key: "set",
    value: function set() {
      this._history = this.parse();

      switch (arguments.length) {
        case 1:
          for (var _i = 0, _Object$entries = Object.entries(arguments[0]); _i < _Object$entries.length; _i++) {
            var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
                _key = _Object$entries$_i[0],
                _value = _Object$entries$_i[1];

            this.setDataProperty(_key, _value);
          }

          break;

        case 2:
          var key = arguments[0];
          var value = arguments[1];
          this.setDataProperty(key, value);
          break;

        case 3:
          var key = arguments[0];
          var value = arguments[1];
          var silent = arguments[2];
          this.setDataProperty(key, value, silent);
          break;
      }
    }
  }, {
    key: "unset",
    value: function unset() {
      this._history = this.parse();

      switch (arguments.length) {
        case 0:
          for (var _i2 = 0, _Object$keys = Object.keys(this._data); _i2 < _Object$keys.length; _i2++) {
            var _key2 = _Object$keys[_i2];
            this.unsetDataProperty(_key2);
          }

          break;

        case 1:
          var key = arguments[0];
          this.unsetDataProperty(key);
          break;
      }
    }
  }, {
    key: "setDataProperty",
    value: function setDataProperty(key, value, silent) {
      if (!this._data['_'.concat(key)]) {
        var context = this;
        Object.defineProperties(this._data, _defineProperty({}, '_'.concat(key), {
          configurable: true,
          get: function get() {
            return this[key];
          },
          set: function set(value) {
            this[key] = value;
            var setValueEventName = ['set', ':', key].join('');
            var setEventName = 'set';

            if (!silent) {
              context.emit(setValueEventName, {
                name: setValueEventName,
                data: {
                  key: key,
                  value: value
                }
              }, context);
              context.emit(setEventName, {
                name: setEventName,
                data: {
                  key: key,
                  value: value
                }
              }, context);
            }
          }
        }));
      }

      this._data['_'.concat(key)] = value;
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
      });
      this.emit(unsetEventName, {
        name: unsetEventName,
        data: {
          key: key,
          value: unsetValue
        }
      });
    }
  }, {
    key: "parse",
    value: function parse(data) {
      data = data || this._data;
      return JSON.parse(JSON.stringify(Object.assign({}, data)));
    }
  }, {
    key: "_defaults",
    get: function get() {
      return this._defaults;
    },
    set: function set(defaults) {
      this.defaults = defaults;
      this.set(this.defaults);
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
      this.history = this.history ? this.history : [];
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
    key: "_data",
    get: function get() {
      this.data = this.data ? this.data : {};
      return this.data;
    }
  }, {
    key: "_dataEvents",
    set: function set(dataEvents) {
      MVC.Utils.bindEventsToTargetObjects(dataEvents, this, this.dataCallbacks);
    }
  }, {
    key: "_dataCallbacks",
    get: function get() {
      this.dataCallbacks = this.dataCallbacks ? this.dataCallbacks : {};
      return this.dataCallbacks;
    },
    set: function set(dataCallbacks) {
      this.dataCallbacks = MVC.Utils.addPropertiesToTargetObject(dataCallbacks, this._dataCallbacks);
    }
  }]);

  return _class;
}(MVC.Base);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

MVC.View =
/*#__PURE__*/
function (_MVC$Base) {
  _inherits(_class, _MVC$Base);

  function _class() {
    var _this;

    _classCallCheck(this, _class);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));

    _this.addSettings();

    return _this;
  }

  _createClass(_class, [{
    key: "addSettings",
    value: function addSettings() {
      if (Object.keys(this._settings).length) {
        if (this._settings.elementName) this._elementName = this._settings.elementName;
        if (this._settings.element) this._element = this._settings.element;
        if (this._settings.attributes) this._attributes = this._settings.attributes;
        this._ui = this._settings.ui || {};
        if (this._settings.uiCallbacks) this._uiCallbacks = this._settings.uiCallbacks;
        if (this._settings.observerCallbacks) this._observerCallbacks = this._settings.observerCallbacks;
        if (this._settings.uiEmitters) this._uiEmitters = this._settings.uiEmitters;
        if (this._settings.uiEvents) this._uiEvents = this._settings.uiEvents;
        if (this._settings.observers) this._observers = this._settings.observers;
        if (this._settings.templates) this._templates = this._settings.templates;
        if (this._settings.insert) this._insert = this._settings.insert;
      } else {
        this._elementName = 'div';
      }
    }
  }, {
    key: "remove",
    value: function remove() {
      this.element.parentElement.removeChild(this.element);
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
      if (element instanceof HTMLElement) {
        this.element = element;
      } else if (typeof element === 'string') {
        this.element = document.querySelector(element);
      }
    }
  }, {
    key: "_attributes",
    get: function get() {
      return this._element.attributes;
    },
    set: function set(attributes) {
      for (var _i = 0, _Object$entries = Object.entries(attributes); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            attributeKey = _Object$entries$_i[0],
            attributeValue = _Object$entries$_i[1];

        if (typeof attributeValue === 'undefined') {
          this._element.removeAttribute(attributeKey);
        } else {
          this._element.setAttribute(attributeKey, attributeValue);
        }
      }

      this.attributes = this._element.attributes;
    }
  }, {
    key: "_ui",
    get: function get() {
      this.ui = this.ui ? this.ui : {};
      return this.ui;
    },
    set: function set(ui) {
      this._ui['$'] = this.element;

      for (var _i2 = 0, _Object$entries2 = Object.entries(ui); _i2 < _Object$entries2.length; _i2++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
            uiKey = _Object$entries2$_i[0],
            uiSelector = _Object$entries2$_i[1];

        if (typeof uiSelector === 'undefined') {
          delete this._ui[uiKey];
        } else {
          this._ui[uiKey] = this._element.querySelectorAll(uiSelector);
        }
      }
    }
  }, {
    key: "_uiEvents",
    set: function set(uiEvents) {
      MVC.Utils.bindEventsToTargetObjects(uiEvents, this.ui, this.uiCallbacks);
    }
  }, {
    key: "_uiCallbacks",
    get: function get() {
      return this.uiCallbacks || {};
    },
    set: function set(uiCallbacks) {
      this.uiCallbacks = uiCallbacks;
    }
  }, {
    key: "_observerCallbacks",
    get: function get() {
      return this.observerCallbacks || {};
    },
    set: function set(observerCallbacks) {
      this.observerCallbacks = observerCallbacks;
    }
  }, {
    key: "_uiEmitters",
    get: function get() {
      return this.uiEmitters || {};
    },
    set: function set(uiEmitters) {
      this.uiEmitters = emitters;
    }
  }, {
    key: "_observers",
    get: function get() {
      this.observers = this.observers ? this.observers : {};
      return this.observers;
    },
    set: function set(observers) {
      for (var _i3 = 0, _Object$entries3 = Object.entries(observers); _i3 < _Object$entries3.length; _i3++) {
        var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
            observerConfiguration = _Object$entries3$_i[0],
            mutationSettings = _Object$entries3$_i[1];

        var observerConfigurationData = observerConfiguration.split(' ');
        var observerName = observerConfigurationData[0];
        var observerTarget = observerName.match('@', '') ? MVC.Utils.getObjectFromDotNotationString(observerName.replace('@', ''), this.ui) : document.querySelectorAll(observerName);
        var observerOptions = observerConfigurationData[1] ? observerConfigurationData[1].split(',').reduce(function (accumulator, currentValue) {
          accumulator[currentValue] = true;
          return accumulator;
        }, {}) : {};
        var observer = new MVC.Observer({
          context: this,
          target: observerTarget,
          options: observerOptions,
          mutations: mutationSettings
        });
        this._observers[observerName] = observer;
      }
    }
  }, {
    key: "_insert",
    set: function set(insert) {
      if (this.element.parentElement) this.remove();
      var insertMethod = insert.method;
      var parentElement = document.querySelector(insert.element);
      parentElement.insertAdjacentElement(insertMethod, this.element);
    }
  }, {
    key: "_templates",
    get: function get() {
      this.templates = this.templates ? this.templates : {};
      return this.templates;
    },
    set: function set(templates) {
      for (var _i4 = 0, _Object$entries4 = Object.entries(templates); _i4 < _Object$entries4.length; _i4++) {
        var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2),
            templateName = _Object$entries4$_i[0],
            templateSettings = _Object$entries4$_i[1];

        this._templates[templateName] = templateSettings;
      }
    }
  }]);

  return _class;
}(MVC.Base);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

MVC.Controller =
/*#__PURE__*/
function (_MVC$Base) {
  _inherits(_class, _MVC$Base);

  function _class() {
    var _this;

    _classCallCheck(this, _class);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));

    _this.addSettings();

    return _this;
  }

  _createClass(_class, [{
    key: "addSettings",
    value: function addSettings() {
      if (Object.keys(this._settings).length) {
        if (this.settings.emitters) this._emitters = this.settings.emitters;
        if (this.settings.modelCallbacks) this._modelCallbacks = this.settings.modelCallbacks;
        if (this.settings.viewCallbacks) this._viewCallbacks = this.settings.viewCallbacks;
        if (this.settings.controllerCallbacks) this._controllerCallbacks = this.settings.controllerCallbacks;
        if (this.settings.routerCallbacks) this._routerCallbacks = this.settings.routerCallbacks;
        if (this.settings.models) this._models = this.settings.models;
        if (this.settings.views) this._views = this.settings.views;
        if (this.settings.controllers) this._controllers = this.settings.controllers;
        if (this.settings.routers) this._routers = this.settings.routers;
        if (this.settings.modelEvents) this._modelEvents = this.settings.modelEvents;
        if (this.settings.viewEvents) this._viewEvents = this.settings.viewEvents;
        if (this.settings.controllerEvents) this._controllerEvents = this.settings.controllerEvents;
      }
    }
  }, {
    key: "_emitters",
    get: function get() {
      this.emitters = this.emitters ? this.emitters : {};
      return this.emitters;
    },
    set: function set(emitters) {
      this.emitters = MVC.Utils.addPropertiesToTargetObject(emitters, this._emitters);
    }
  }, {
    key: "_modelCallbacks",
    get: function get() {
      this.modelCallbacks = this.modelCallbacks ? this.modelCallbacks : {};
      return this.modelCallbacks;
    },
    set: function set(modelCallbacks) {
      this.modelCallbacks = MVC.Utils.addPropertiesToTargetObject(modelCallbacks, this._modelCallbacks);
    }
  }, {
    key: "_viewCallbacks",
    get: function get() {
      this.viewCallbacks = this.viewCallbacks ? this.viewCallbacks : {};
      return this.viewCallbacks;
    },
    set: function set(viewCallbacks) {
      this.viewCallbacks = MVC.Utils.addPropertiesToTargetObject(viewCallbacks, this._viewCallbacks);
    }
  }, {
    key: "_controllerCallbacks",
    get: function get() {
      this.controllerCallbacks = this.controllerCallbacks ? this.controllerCallbacks : {};
      return this.controllerCallbacks;
    },
    set: function set(controllerCallbacks) {
      this.controllerCallbacks = MVC.Utils.addPropertiesToTargetObject(controllerCallbacks, this._controllerCallbacks);
    }
  }, {
    key: "_routerCallbacks",
    get: function get() {
      this.routerCallbacks = this.routerCallbacks ? this.routerCallbacks : {};
      return this.routerCallbacks;
    },
    set: function set(routerCallbacks) {
      this.routerCallbacks = MVC.Utils.addPropertiesToTargetObject(routerCallbacks, this._routerCallbacks);
    }
  }, {
    key: "_models",
    get: function get() {
      this.models = this.models ? this.models : {};
      return this.models;
    },
    set: function set(models) {
      this.models = MVC.Utils.addPropertiesToTargetObject(models, this._models);
    }
  }, {
    key: "_views",
    get: function get() {
      this.views = this.views ? this.views : {};
      return this.views;
    },
    set: function set(views) {
      this.views = MVC.Utils.addPropertiesToTargetObject(views, this._views);
    }
  }, {
    key: "_controllers",
    get: function get() {
      this.controllers = this.controllers ? this.controllers : {};
      return this.controllers;
    },
    set: function set(controllers) {
      this.controllers = MVC.Utils.addPropertiesToTargetObject(controllers, this._controllers);
    }
  }, {
    key: "_routers",
    get: function get() {
      this.routers = this.routers ? this.routers : {};
      return this.routers;
    },
    set: function set(routers) {
      this.routers = MVC.Utils.addPropertiesToTargetObject(routers, this._routers);
    }
  }, {
    key: "_modelEvents",
    set: function set(modelEvents) {
      MVC.Utils.bindEventsToTargetObjects(modelEvents, this._models, this._modelCallbacks);
    }
  }, {
    key: "_viewEvents",
    set: function set(viewEvents) {
      MVC.Utils.bindEventsToTargetObjects(viewEvents, this._views, this._viewCallbacks);
    }
  }, {
    key: "_controllerEvents",
    set: function set(controllerEvents) {
      MVC.Utils.bindEventsToTargetObjects(controllerEvents, this._controllers, this._controllerCallbacks);
    }
  }]);

  return _class;
}(MVC.Base);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

MVC.Router =
/*#__PURE__*/
function (_MVC$Base) {
  _inherits(_class, _MVC$Base);

  function _class() {
    var _this;

    _classCallCheck(this, _class);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));

    _this.addSettings();

    _this.setRoutes(_this.routes, _this.controllers);

    _this.setEvents();

    _this.start();

    if (typeof _this.initialize === 'function') _this.initialize();
    return _this;
  }

  _createClass(_class, [{
    key: "addSettings",
    value: function addSettings() {
      if (this._settings) {
        if (this._settings.routes) this.routes = this._settings.routes;
        if (this._settings.controllers) this.controllers = this._settings.controllers;
      }
    }
  }, {
    key: "start",
    value: function start() {
      var location = this.getRoute();

      if (location === '') {
        this.navigate('/');
      } else {
        window.dispatchEvent(new Event('hashchange'));
      }
    }
  }, {
    key: "setRoutes",
    value: function setRoutes(routes, controllers) {
      for (var route in routes) {
        this.routes[route] = controllers[routes[route]];
      }

      return;
    }
  }, {
    key: "setEvents",
    value: function setEvents() {
      window.addEventListener('hashchange', this.hashChange.bind(this));
      return;
    }
  }, {
    key: "getRoute",
    value: function getRoute() {
      return String(window.location.hash).split('#').pop();
    }
  }, {
    key: "hashChange",
    value: function hashChange(event) {
      var route = this.getRoute();

      try {
        this.routes[route](event);
        this.emit('navigate', this);
      } catch (error) {}
    }
  }, {
    key: "navigate",
    value: function navigate(path) {
      window.location.hash = path;
    }
  }]);

  return _class;
}(MVC.Base);
//# sourceMappingURL=http://localhost:3000/.maps/browser/mvc-framework.js.map
