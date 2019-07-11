"use strict";

var MVC = MVC || {};
"use strict";

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
            eventCallback(eventData);
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
      return this.events || {};
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

MVC.Service =
/*#__PURE__*/
function (_MVC$Events) {
  _inherits(_class, _MVC$Events);

  function _class(type, url, settings) {
    var _this;

    _classCallCheck(this, _class);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
    _this._settings = settings || {};
    _this._type = type;
    _this._url = url;
    return _this;
  }

  _createClass(_class, [{
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
    key: "_settings",
    get: function get() {
      return this.settings || {};
    },
    set: function set(settings) {
      this.settings = settings || {};
      this._data = this.settings.data || null;
      this._headers = this._settings.headers || [this._defaults.contentType];
      this._responseType = this._settings.responseType;
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
}(MVC.Events);
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
function (_MVC$Events) {
  _inherits(_class, _MVC$Events);

  function _class(settings) {
    var _this;

    _classCallCheck(this, _class);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
    _this._settings = settings;
    return _this;
  }

  _createClass(_class, [{
    key: "set",
    value: function set() {
      this._history = this._data;

      switch (arguments.length) {
        case 1:
          for (var _i = 0, _Object$entries = Object.entries(arguments[0]); _i < _Object$entries.length; _i++) {
            var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
                _key = _Object$entries$_i[0],
                _value = _Object$entries$_i[1];

            if (!this._data['_'.concat(_key)]) this.addDataProperty(_key, _value);
            this._data['_'.concat(_key)] = _value;
          }

          break;

        case 2:
          var key = arguments[0];
          var value = arguments[1];
          if (!this._data['_'.concat(key)]) this.addDataProperty(key, value);
          this._data['_'.concat(key)] = value;
          break;
      }
    }
  }, {
    key: "unset",
    value: function unset() {
      this._history = this._data;

      switch (arguments.length) {
        case 0:
          for (var _i2 = 0, _Object$keys = Object.keys(this._data); _i2 < _Object$keys.length; _i2++) {
            var _key2 = _Object$keys[_i2];
            delete this._data['_'.concat(_key2)];
            delete this._data[_key2];
          }

          break;

        case 1:
          var key = arguments[0];
          delete this._data['_'.concat(key)];
          delete this._data[key];
          break;
      }
    }
  }, {
    key: "addDataProperty",
    value: function addDataProperty(key, value) {
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
          context.emit(setValueEventName, {
            name: setValueEventName,
            key: key,
            value: value
          });
          context.emit(setEventName, {
            name: setEventName,
            key: key,
            value: value
          });
        }
      }));
    }
  }, {
    key: "parse",
    value: function parse(data) {
      data = data || this._data;
      return JSON.parse(JSON.stringify(data));
    }
  }, {
    key: "_settings",
    get: function get() {
      return this.settings || {};
    },
    set: function set(settings) {
      if (this.settings.histiogram) this._histiogram = this.settings.histiogram;
      if (this.settings.data) this._data = this.settings.data;
    }
  }, {
    key: "_histiogram",
    get: function get() {
      return this.histiogram || {
        length: 1
      };
    },
    set: function set(histiogram) {
      this.histiogram = Object.assign(this.histiogram, histiogram);
    }
  }, {
    key: "_history",
    get: function get() {
      return this.history || [];
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
      return this.data || {};
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

MVC.View =
/*#__PURE__*/
function (_MVC$Events) {
  _inherits(_class, _MVC$Events);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
  }

  _createClass(_class, [{
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
      return this.attributes || {};
    },
    set: function set(attributes) {
      for (var _i = 0, _Object$entries = Object.entries(attributes); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            attributeKey = _Object$entries$_i[0],
            attributeValue = _Object$entries$_i[1];

        this._element.setAttribute(attributeKey, attributeValue);
      }

      this.attributes = this._element.attributes;
    }
  }, {
    key: "_ui",
    get: function get() {
      return this.ui || {};
    },
    set: function set(ui) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = ui[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2),
              key = _step$value[0],
              value = _step$value[1];

          switch (key) {
            case '@':
              this.ui[key] = this.element;
              break;

            default:
              this.ui[key] = this.element.querySelectorAll(value);
              break;
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

      this.ui = ui;
    }
  }, {
    key: "_events",
    get: function get() {
      return this.events || {};
    },
    set: function set(events) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = events[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _step2$value = _slicedToArray(_step2.value, 2),
              eventKey = _step2$value[0],
              eventValue = _step2$value[1];

          var eventData = eventKey.split[' '];
          var eventTarget = this[eventData[0].replace('@', '')];
          var eventName = eventData[1];
          var eventCallback = this[eventValue.replace('@', '')];
          eventTarget.on(eventName, eventCallback);
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
    }
  }, {
    key: "_callbacks",
    get: function get() {
      return this.callbacks || {};
    },
    set: function set(callbacks) {
      this.callbacks = callbacks;
    }
  }, {
    key: "_emitters",
    get: function get() {
      return this.emitters || {};
    },
    set: function set(emitters) {
      this.emitters = emitters;
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

MVC.Controller =
/*#__PURE__*/
function (_MVC$Events) {
  _inherits(_class, _MVC$Events);

  function _class(settings) {
    var _this;

    _classCallCheck(this, _class);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
    if (_this.settings) _this.settings = settings;
    return _this;
  }

  _createClass(_class, [{
    key: "_settings",
    get: function get() {
      return this.settings;
    },
    set: function set(settings) {
      this.settings = settings;
      if (this._settings.emitters) this._emitters = this._settings.emitters;
      if (this._settings.callbacks) this._callbacks = this._settings.callbacks;
      if (this._settings.models) this._models = this._settings.models;
      if (this._settings.views) this._views = this._settings.views;
      if (this._settings.controllers) this._controllers = this._settings.controllers;
      if (this._settings.routers) this._routers = this._settings.routers;
      if (this._settings.events) this._events = this._settings.events;
    }
  }, {
    key: "_emitters",
    get: function get() {
      return this.emitters || {};
    },
    set: function set(emitters) {
      this.emitters = emitters;
    }
  }, {
    key: "_callbacks",
    get: function get() {
      return this.callbacks || {};
    },
    set: function set(callbacks) {
      this.callbacks = callbacks;
    }
  }, {
    key: "_models",
    get: function get() {
      return this.models || {};
    },
    set: function set(models) {
      this.models = models;
    }
  }, {
    key: "_views",
    get: function get() {
      return this.views || {};
    },
    set: function set(views) {
      this.views = views;
    }
  }, {
    key: "_controllers",
    get: function get() {
      return this.controllers || {};
    },
    set: function set(controllers) {
      this.controllers = controllers;
    }
  }, {
    key: "_routers",
    get: function get() {
      return this.routers || {};
    },
    set: function set(routers) {
      this.routers = routers;
    }
  }, {
    key: "_events",
    get: function get() {
      return this.events || {};
    },
    set: function set(events) {
      for (var _i = 0, _Object$entries = Object.entries(events); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            eventSettings = _Object$entries$_i[0],
            eventCallback = _Object$entries$_i[1];

        var eventData = eventSettings.split(' ');
        var eventTarget = eventData[0].replace('@', '').split('.');
        var eventName = eventData[1];
        eventCallback = eventCallback.replace('@', '').split('.');
        this[eventTarget].on(eventName, eventCallback);
      }
    }
  }]);

  return _class;
}(MVC.Events);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

MVC.Router =
/*#__PURE__*/
function (_MVC$Events) {
  _inherits(_class, _MVC$Events);

  function _class(settings) {
    var _this;

    _classCallCheck(this, _class);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
    Object.assign(_assertThisInitialized(_this), settings, {
      settings: settings
    });

    _this.setRoutes(_this.routes, _this.controllers);

    _this.setEvents();

    _this.start();

    if (typeof _this.initialize === 'function') _this.initialize();
    return _this;
  }

  _createClass(_class, [{
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
}(MVC.Events);
//# sourceMappingURL=http://localhost:3000/.maps/scripts/mvc-framework.js.map
