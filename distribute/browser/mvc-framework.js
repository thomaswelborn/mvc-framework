"use strict";

var MVC = MVC || {};
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

MVC.Utils = {
  getObjectFromDotNotationString: function getObjectFromDotNotationString(string, context) {
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
  },
  toggleEventsForTargetObjects: function toggleEventsForTargetObjects(toggleMethod, events, targetObjects, callbacks) {
    for (var _i2 = 0, _Object$entries2 = Object.entries(events); _i2 < _Object$entries2.length; _i2++) {
      var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
          eventSettings = _Object$entries2$_i[0],
          eventCallback = _Object$entries2$_i[1];

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

      for (var _i3 = 0, _Object$entries3 = Object.entries(eventTargets); _i3 < _Object$entries3.length; _i3++) {
        var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
            eventTargetName = _Object$entries3$_i[0],
            eventTarget = _Object$entries3$_i[1];

        var eventTargetMethodName = toggleMethod === 'on' ? eventTarget instanceof HTMLElement ? 'addEventListener' : 'on' : eventTarget instanceof HTMLElement ? 'removeEventListener' : 'off';
        var eventCallbacks = eventCallback.match('@') ? this.getObjectFromDotNotationString(eventCallback.replace('@', ''), callbacks) : window[eventCallback];

        for (var _i4 = 0, _Object$values = Object.values(eventCallbacks); _i4 < _Object$values.length; _i4++) {
          var _eventCallback = _Object$values[_i4];
          eventTarget[eventTargetMethodName](eventName, _eventCallback);
        }
      }
    }
  },
  bindEventsToTargetObjects: function bindEventsToTargetObjects() {
    this.toggleEventsForTargetObjects.apply(this, ['on'].concat(Array.prototype.slice.call(arguments)));
  },
  unbindEventsFromTargetObjects: function unbindEventsFromTargetObjects() {
    this.toggleEventsForTargetObjects.apply(this, ['off'].concat(Array.prototype.slice.call(arguments)));
  },
  addPropertiesToTargetObject: function addPropertiesToTargetObject() {
    var targetObject;

    switch (arguments.length) {
      case 2:
        var properties = arguments[0];
        targetObject = arguments[1];

        for (var _i5 = 0, _Object$entries4 = Object.entries(properties); _i5 < _Object$entries4.length; _i5++) {
          var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i5], 2),
              _propertyName = _Object$entries4$_i[0],
              _propertyValue = _Object$entries4$_i[1];

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

MVC.Observers =
/*#__PURE__*/
function () {
  function _class() {
    _classCallCheck(this, _class);
  }

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

MVC.Observers.Observer =
/*#__PURE__*/
function () {
  function _class(settings) {
    _classCallCheck(this, _class);

    this._settings = settings;

    this._observer.observe(this.target, this.options);
  }

  _createClass(_class, [{
    key: "observerCallback",
    value: function observerCallback(mutationRecordList, observer) {
      var _this = this;

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

                  var mutation = _this.mutations.filter(function (_mutation) {
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
            var mutation = _this.mutations.filter(function (_mutation) {
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
    key: "_settings",
    get: function get() {
      this.settings = this.settings ? this.settings : {};
      return this.settings;
    },
    set: function set(settings) {
      if (settings) {
        this.settings = settings;
        if (this.settings.context) this._context = this.settings.context;
        if (this.settings.target) this._target = this.settings.target instanceof NodeList ? this.settings.target[0] : this.settings.target;
        if (this.settings.options) this._options = this.settings.options;
        if (this.settings.mutations) this._mutations = this.settings.mutations;
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
    value: function setDataProperty(key, value) {
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
    key: "_settings",
    get: function get() {
      return this.settings || {};
    },
    set: function set(settings) {
      if (settings) {
        this.settings = settings;
        if (this.settings.histiogram) this._histiogram = this.settings.histiogram;
        if (this.settings.data) this.set(this.settings.data);
        if (this.settings.dataCallbacks) this._dataCallbacks = this.settings.dataCallbacks;
        if (this.settings.dataEvents) this._dataEvents = this.settings.dataEvents;
      }
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

  function _class(settings) {
    var _this;

    _classCallCheck(this, _class);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
    _this._settings = settings;
    return _this;
  }

  _createClass(_class, [{
    key: "remove",
    value: function remove() {
      this.element.parentElement.removeChild(this.element);
    }
  }, {
    key: "_settings",
    get: function get() {
      this.settings = this.settings ? this.settings : {};
      return this.settings;
    },
    set: function set(settings) {
      if (settings) {
        this.settings = settings;
        if (this.settings.elementName) this._elementName = this.settings.elementName;
        if (this.settings.element) this._element = this.settings.element;
        if (this.settings.attributes) this._attributes = this.settings.attributes;
        this._ui = this.settings.ui || {};
        if (this.settings.uiCallbacks) this._uiCallbacks = this.settings.uiCallbacks;
        if (this.settings.observerCallbacks) this._observerCallbacks = this.settings.observerCallbacks;
        if (this.settings.uiEmitters) this._uiEmitters = this.settings.uiEmitters;
        if (this.settings.uiEvents) this._uiEvents = this.settings.uiEvents;
        if (this.settings.observers) this._observers = this.settings.observers;
        if (this.settings.template) this._template = this.settings.template;
        if (this.settings.insert) this._insert = this.settings.insert;
      } else {
        this._elementName = 'div';
      }
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
        }, {}) : {}; // if(observerOptions)  = observerOptions

        var observer = new MVC.Observers.Observer({
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
  }]);

  return _class;
}(MVC.Events);
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
function (_MVC$Events) {
  _inherits(_class, _MVC$Events);

  function _class(settings) {
    var _this;

    _classCallCheck(this, _class);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
    if (settings) _this._settings = settings;
    return _this;
  }

  _createClass(_class, [{
    key: "_settings",
    get: function get() {
      this.settings = this.settings ? this.settings : {};
      return this.settings;
    },
    set: function set(settings) {
      this.settings = settings;
      if (this._settings.emitters) this._emitters = this._settings.emitters;
      if (this._settings.modelCallbacks) this._modelCallbacks = this._settings.modelCallbacks;
      if (this._settings.viewCallbacks) this._viewCallbacks = this._settings.viewCallbacks;
      if (this._settings.controllerCallbacks) this._controllerCallbacks = this._settings.controllerCallbacks;
      if (this._settings.routerCallbacks) this._routerCallbacks = this._settings.routerCallbacks;
      if (this._settings.models) this._models = this._settings.models;
      if (this._settings.views) this._views = this._settings.views;
      if (this._settings.controllers) this._controllers = this._settings.controllers;
      if (this._settings.routers) this._routers = this._settings.routers;
      if (this._settings.modelEvents) this._modelEvents = this._settings.modelEvents;
      if (this._settings.viewEvents) this._viewEvents = this._settings.viewEvents;
      if (this._settings.controllerEvents) this._controllerEvents = this._settings.controllerEvents;
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
      MVC.Utils.bindEventsToTargetObjects(viewEvents, this._views);
    }
  }, {
    key: "_controllerEvents",
    set: function set(controllerEvents) {
      MVC.Utils.bindEventsToTargetObjects(controllerEvents, this._controllers, this._controllerCallbacks);
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
//# sourceMappingURL=http://localhost:3000/.maps/browser/mvc-framework.js.map
