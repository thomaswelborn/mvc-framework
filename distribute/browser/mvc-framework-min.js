"use strict";var MVC=MVC||{};function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function _iterableToArrayLimit(t,e){var n=[],r=!0,s=!1,i=void 0;try{for(var o,a=t[Symbol.iterator]();!(r=(o=a.next()).done)&&(n.push(o.value),!e||n.length!==e);r=!0);}catch(t){s=!0,i=t}finally{try{r||null==a.return||a.return()}finally{if(s)throw i}}return n}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _toConsumableArray(t){return _arrayWithoutHoles(t)||_iterableToArray(t)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}function _arrayWithoutHoles(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function _iterableToArrayLimit(t,e){var n=[],r=!0,s=!1,i=void 0;try{for(var o,a=t[Symbol.iterator]();!(r=(o=a.next()).done)&&(n.push(o.value),!e||n.length!==e);r=!0);}catch(t){s=!0,i=t}finally{try{r||null==a.return||a.return()}finally{if(s)throw i}}return n}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?_assertThisInitialized(t):e}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function _iterableToArrayLimit(t,e){var n=[],r=!0,s=!1,i=void 0;try{for(var o,a=t[Symbol.iterator]();!(r=(o=a.next()).done)&&(n.push(o.value),!e||n.length!==e);r=!0);}catch(t){s=!0,i=t}finally{try{r||null==a.return||a.return()}finally{if(s)throw i}}return n}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function _iterableToArrayLimit(t,e){var n=[],r=!0,s=!1,i=void 0;try{for(var o,a=t[Symbol.iterator]();!(r=(o=a.next()).done)&&(n.push(o.value),!e||n.length!==e);r=!0);}catch(t){s=!0,i=t}finally{try{r||null==a.return||a.return()}finally{if(s)throw i}}return n}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperty(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function _iterableToArrayLimit(t,e){var n=[],r=!0,s=!1,i=void 0;try{for(var o,a=t[Symbol.iterator]();!(r=(o=a.next()).done)&&(n.push(o.value),!e||n.length!==e);r=!0);}catch(t){s=!0,i=t}finally{try{r||null==a.return||a.return()}finally{if(s)throw i}}return n}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?_assertThisInitialized(t):e}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _slicedToArray(t,e){return _arrayWithHoles(t)||_iterableToArrayLimit(t,e)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function _iterableToArrayLimit(t,e){var n=[],r=!0,s=!1,i=void 0;try{for(var o,a=t[Symbol.iterator]();!(r=(o=a.next()).done)&&(n.push(o.value),!e||n.length!==e);r=!0);}catch(t){s=!0,i=t}finally{try{r||null==a.return||a.return()}finally{if(s)throw i}}return n}function _arrayWithHoles(t){if(Array.isArray(t))return t}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?_assertThisInitialized(t):e}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?_assertThisInitialized(t):e}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?_assertThisInitialized(t):e}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}MVC.Utils={getObjectFromDotNotationString:function(t,e){return t.split(".").reduce(function(t,n){n="/"===n[0]?new RegExp(n.replace(new RegExp("/","g"),"")):n;for(var r=0,s=Object.entries(e);r<s.length;r++){var i=_slicedToArray(s[r],2),o=i[0],a=i[1];n instanceof RegExp?n.test(o)&&(t[o]=a):n===o&&(t[o]=a)}return t},{})},toggleEventsForTargetObjects:function(t,e,n,r){for(var s=0,i=Object.entries(e);s<i.length;s++){var o=_slicedToArray(i[s],2),a=o[0],l=o[1],c=a.split(" "),u=c[0],h=c[1],f=void 0;switch("@"===u[0]){case!0:f=(u=u.replace("@",""))?this.getObjectFromDotNotationString(u,n):{0:n};break;case!1:f=document.querySelectorAll(u)}for(var y=0,_=Object.entries(f);y<_.length;y++)for(var b=_slicedToArray(_[y],2),p=(b[0],b[1]),g="on"===t?p instanceof HTMLElement?"addEventListener":"on":p instanceof HTMLElement?"removeEventListener":"off",v=l.match("@")?this.getObjectFromDotNotationString(l.replace("@",""),r):window[l],d=0,m=Object.values(v);d<m.length;d++){var C=m[d];p[g](h,C)}}},bindEventsToTargetObjects:function(){this.toggleEventsForTargetObjects.apply(this,["on"].concat(Array.prototype.slice.call(arguments)))},unbindEventsFromTargetObjects:function(){this.toggleEventsForTargetObjects.apply(this,["off"].concat(Array.prototype.slice.call(arguments)))},addPropertiesToTargetObject:function(){var t;switch(arguments.length){case 2:var e=arguments[0];t=arguments[1];for(var n=0,r=Object.entries(e);n<r.length;n++){var s=_slicedToArray(r[n],2),i=s[0],o=s[1];t[i]=o}break;case 3:var a=arguments[0],l=arguments[1];(t=arguments[2])[a]=l}return t}},MVC.Events=function(){function t(){_classCallCheck(this,t)}return _createClass(t,[{key:"eventCallbacks",value:function(t){return this._events[t]||{}}},{key:"eventCallbackName",value:function(t){return t.name.length?t.name:"anonymousFunction"}},{key:"eventCallbackGroup",value:function(t,e){return t[e]||[]}},{key:"on",value:function(t,e){var n=this.eventCallbacks(t),r=this.eventCallbackName(e),s=this.eventCallbackGroup(n,r);s.push(e),n[r]=s,this._events[t]=n}},{key:"off",value:function(){switch(arguments.length){case 1:var t=arguments[0];delete this._events[t];break;case 2:t=arguments[0];var e=arguments[1],n=this.eventCallbackName(e);delete this._events[t][n]}}},{key:"emit",value:function(t,e){for(var n=this.eventCallbacks(t),r=0,s=Object.entries(n);r<s.length;r++){var i=_slicedToArray(s[r],2),o=(i[0],i[1]),a=!0,l=!1,c=void 0;try{for(var u,h=o[Symbol.iterator]();!(a=(u=h.next()).done);a=!0){var f=u.value,y=Object.values(arguments).splice(2);f.apply(void 0,[e].concat(_toConsumableArray(y)))}}catch(t){l=!0,c=t}finally{try{a||null==h.return||h.return()}finally{if(l)throw c}}}}},{key:"_events",get:function(){return this.events=this.events?this.events:{},this.events}}]),t}(),MVC.Service=function(t){function e(t,n,r){var s;return _classCallCheck(this,e),(s=_possibleConstructorReturn(this,_getPrototypeOf(e).call(this)))._settings=r||{},s._type=t,s._url=n,s}return _inherits(e,t),_createClass(e,[{key:"newXHR",value:function(){var t=this;return new Promise(function(e,n){200===t._xhr.status&&t._xhr.abort(),t._xhr.open(t._type,t._url),t._xhr.onload=e,t._xhr.onerror=n,t._xhr.send(t._data)})}},{key:"_defaults",get:function(){return this.defaults||{contentType:{"Content-Type":"application/json"},responseType:"json"}}},{key:"_settings",get:function(){return this.settings||{}},set:function(t){this.settings=t||{},this._data=this.settings.data||null,this._headers=this._settings.headers||[this._defaults.contentType],this._responseType=this._settings.responseType}},{key:"_responseTypes",get:function(){return["","arraybuffer","blob","document","json","text"]}},{key:"_responseType",get:function(){return this.responseType},set:function(t){this._xhr.responseType=this._responseTypes.find(function(e){return e===t})||this._defaults.responseType}},{key:"_type",get:function(){return this.type},set:function(t){this.type=t}},{key:"_url",get:function(){return this.url},set:function(t){this.url=t}},{key:"_headers",get:function(){return this.headers||[]},set:function(t){this._headers.length=0;var e=!0,n=!1,r=void 0;try{for(var s,i=t[Symbol.iterator]();!(e=(s=i.next()).done);e=!0){var o=s.value;this._xhr.setRequestHeader({header:o}[0],{header:o}[1]),this._headers.push(o)}}catch(t){n=!0,r=t}finally{try{e||null==i.return||i.return()}finally{if(n)throw r}}}},{key:"_xhr",get:function(){return this.xhr=this.xhr?this.xhr:new XMLHttpRequest,this.xhr}}]),e}(MVC.Events),MVC.Channels=function(){function t(){_classCallCheck(this,t)}return _createClass(t,[{key:"channel",value:function(t){return this._channels[t]=this._channels[t]?this._channels[t]:new MVC.Channels.Channel,this._channels[t]}},{key:"off",value:function(t){delete this._channels[t]}},{key:"_channels",get:function(){return this.channels||{}}}]),t}(),MVC.Channels.Channel=function(){function t(){_classCallCheck(this,t)}return _createClass(t,[{key:"response",value:function(t){function e(e,n){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(t,e){if(!e)return this._responses[response];this._responses[t]=e})},{key:"request",value:function(t,e){if(this._responses[t])return this._responses[t](e)}},{key:"off",value:function(t){if(t)delete this._responses[t];else for(var e=0,n=Object.keys(this._responses);e<n.length;e++){var r=_slicedToArray(n[e],1)[0];delete this._responses[r]}}},{key:"_responses",get:function(){return this.responses||{}}}]),t}(),MVC.Observers=function(){return function t(){_classCallCheck(this,t)}}(),MVC.Observers.Observer=function(){function t(e){_classCallCheck(this,t),this._settings=e,this._observer.observe(this.target,this.options)}return _createClass(t,[{key:"observerCallback",value:function(t,e){for(var n=this,r=function(){var t=_slicedToArray(i[s],2),e=(t[0],t[1]);switch(e.type){case"childList":for(var r=0,o=["addedNodes","removedNodes"];r<o.length;r++){var a=o[r];if(e[a].length)for(var l=function(){var t=_slicedToArray(u[c],2),r=(t[0],t[1]),s=n.mutations.filter(function(t){return t.target===r})[0];s&&s.callback({mutation:s,mutationRecord:e})},c=0,u=Object.entries(e[a]);c<u.length;c++)l()}break;case"attributes":var h=n.mutations.filter(function(t){return t.name===e.type&&t.data===e.attributeName})[0];h&&h.callback({mutation:h,mutationRecord:e})}},s=0,i=Object.entries(t);s<i.length;s++)r()}},{key:"_settings",get:function(){return this.settings=this.settings?this.settings:{},this.settings},set:function(t){t&&(this.settings=t,this.settings.context&&(this._context=this.settings.context),this.settings.target&&(this._target=this.settings.target instanceof NodeList?this.settings.target[0]:this.settings.target),this.settings.options&&(this._options=this.settings.options),this.settings.mutations&&(this._mutations=this.settings.mutations))}},{key:"_context",get:function(){return this.context},set:function(t){this.context=t}},{key:"_target",get:function(){return this.target},set:function(t){this.target=t}},{key:"_options",get:function(){return this.options},set:function(t){this.options=t}},{key:"_observer",get:function(){return this.observer=this.observer?this.observer:new MutationObserver(this.observerCallback.bind(this)),this.observer}},{key:"_mutations",get:function(){return this.mutations=this.mutations?this.mutations:[],this.mutations},set:function(t){for(var e=0,n=Object.entries(t);e<n.length;e++){var r=_slicedToArray(n[e],2),s=r[0],i=r[1],o=void 0,a=s.split(" "),l=MVC.Utils.getObjectFromDotNotationString(a[0].replace("@",""),this.context.ui),c=a[1],u=a[2];o={target:l,name:c,callback:i=i.match("@")?this.context.observerCallbacks[i.replace("@","")]:"string"==typeof i?MVC.Utils.getObjectFromDotNotationString(i,window):i},u&&(o.data=u),this._mutations.push(o)}}}]),t}(),MVC.Model=function(t){function e(t){var n;return _classCallCheck(this,e),(n=_possibleConstructorReturn(this,_getPrototypeOf(e).call(this)))._settings=t,n}return _inherits(e,t),_createClass(e,[{key:"get",value:function(){var t=arguments[0];return this._data["_".concat(t)]}},{key:"set",value:function(){switch(this._history=this.parse(),arguments.length){case 1:for(var t=0,e=Object.entries(arguments[0]);t<e.length;t++){var n=_slicedToArray(e[t],2),r=n[0],s=n[1];this.setDataProperty(r,s)}break;case 2:var i=arguments[0],o=arguments[1];this.setDataProperty(i,o)}}},{key:"unset",value:function(){switch(this._history=this.parse(),arguments.length){case 0:for(var t=0,e=Object.keys(this._data);t<e.length;t++){var n=e[t];this.unsetDataProperty(n)}break;case 1:var r=arguments[0];this.unsetDataProperty(r)}}},{key:"setDataProperty",value:function(t,e){if(!this._data["_".concat(t)]){var n=this;Object.defineProperties(this._data,_defineProperty({},"_".concat(t),{configurable:!0,get:function(){return this[t]},set:function(e){this[t]=e;var r=["set",":",t].join("");n.emit(r,{name:r,data:{key:t,value:e}},n),n.emit("set",{name:"set",data:{key:t,value:e}},n)}}))}this._data["_".concat(t)]=e}},{key:"unsetDataProperty",value:function(t){var e=["unset",":",t].join(""),n=this._data[t];delete this._data["_".concat(t)],delete this._data[t],this.emit(e,{name:e,data:{key:t,value:n}}),this.emit("unset",{name:"unset",data:{key:t,value:n}})}},{key:"parse",value:function(t){return t=t||this._data,JSON.parse(JSON.stringify(Object.assign({},t)))}},{key:"_settings",get:function(){return this.settings||{}},set:function(t){t&&(this.settings=t,this.settings.histiogram&&(this._histiogram=this.settings.histiogram),this.settings.data&&this.set(this.settings.data),this.settings.dataCallbacks&&(this._dataCallbacks=this.settings.dataCallbacks),this.settings.dataEvents&&(this._dataEvents=this.settings.dataEvents))}},{key:"_histiogram",get:function(){return this.histiogram||{length:1}},set:function(t){this.histiogram=Object.assign(this._histiogram,t)}},{key:"_history",get:function(){return this.history=this.history?this.history:[],this.history},set:function(t){Object.keys(t).length&&this._histiogram.length&&(this._history.unshift(this.parse(t)),this._history.splice(this._histiogram.length))}},{key:"_data",get:function(){return this.data=this.data?this.data:{},this.data}},{key:"_dataEvents",set:function(t){MVC.Utils.bindEventsToTargetObjects(t,this,this.dataCallbacks)}},{key:"_dataCallbacks",get:function(){return this.dataCallbacks=this.dataCallbacks?this.dataCallbacks:{},this.dataCallbacks},set:function(t){this.dataCallbacks=MVC.Utils.addPropertiesToTargetObject(t,this._dataCallbacks)}}]),e}(MVC.Events),MVC.View=function(t){function e(t){var n;return _classCallCheck(this,e),(n=_possibleConstructorReturn(this,_getPrototypeOf(e).call(this)))._settings=t,n}return _inherits(e,t),_createClass(e,[{key:"remove",value:function(){this.element.parentElement.removeChild(this.element)}},{key:"_settings",get:function(){return this.settings=this.settings?this.settings:{},this.settings},set:function(t){t?(this.settings=t,this.settings.elementName&&(this._elementName=this.settings.elementName),this.settings.element&&(this._element=this.settings.element),this.settings.attributes&&(this._attributes=this.settings.attributes),this._ui=this.settings.ui||{},this.settings.uiCallbacks&&(this._uiCallbacks=this.settings.uiCallbacks),this.settings.observerCallbacks&&(this._observerCallbacks=this.settings.observerCallbacks),this.settings.uiEmitters&&(this._uiEmitters=this.settings.uiEmitters),this.settings.uiEvents&&(this._uiEvents=this.settings.uiEvents),this.settings.observers&&(this._observers=this.settings.observers),this.settings.template&&(this._template=this.settings.template),this.settings.insert&&(this._insert=this.settings.insert)):this._elementName="div"}},{key:"_elementName",get:function(){return this._element.tagName},set:function(t){this._element||(this._element=document.createElement(t))}},{key:"_element",get:function(){return this.element},set:function(t){t instanceof HTMLElement?this.element=t:"string"==typeof t&&(this.element=document.querySelector(t))}},{key:"_attributes",get:function(){return this._element.attributes},set:function(t){for(var e=0,n=Object.entries(t);e<n.length;e++){var r=_slicedToArray(n[e],2),s=r[0],i=r[1];void 0===i?this._element.removeAttribute(s):this._element.setAttribute(s,i)}this.attributes=this._element.attributes}},{key:"_ui",get:function(){return this.ui=this.ui?this.ui:{},this.ui},set:function(t){this._ui.$=this.element;for(var e=0,n=Object.entries(t);e<n.length;e++){var r=_slicedToArray(n[e],2),s=r[0],i=r[1];void 0===i?delete this._ui[s]:this._ui[s]=this._element.querySelectorAll(i)}}},{key:"_uiEvents",set:function(t){MVC.Utils.bindEventsToTargetObjects(t,this.ui,this.uiCallbacks)}},{key:"_uiCallbacks",get:function(){return this.uiCallbacks||{}},set:function(t){this.uiCallbacks=t}},{key:"_observerCallbacks",get:function(){return this.observerCallbacks||{}},set:function(t){this.observerCallbacks=t}},{key:"_uiEmitters",get:function(){return this.uiEmitters||{}},set:function(t){this.uiEmitters=emitters}},{key:"_observers",get:function(){return this.observers=this.observers?this.observers:{},this.observers},set:function(t){for(var e=0,n=Object.entries(t);e<n.length;e++){var r=_slicedToArray(n[e],2),s=r[0],i=r[1],o=s.split(" "),a=o[0],l=a.match("@","")?MVC.Utils.getObjectFromDotNotationString(a.replace("@",""),this.ui):document.querySelectorAll(a),c=o[1]?o[1].split(",").reduce(function(t,e){return t[e]=!0,t},{}):{},u=new MVC.Observers.Observer({context:this,target:l,options:c,mutations:i});this._observers[a]=u}}},{key:"_insert",set:function(t){this.element.parentElement&&this.remove();var e=t.method;document.querySelector(t.element).insertAdjacentElement(e,this.element)}}]),e}(MVC.Events),MVC.Controller=function(t){function e(t){var n;return _classCallCheck(this,e),n=_possibleConstructorReturn(this,_getPrototypeOf(e).call(this)),t&&(n._settings=t),n}return _inherits(e,t),_createClass(e,[{key:"_settings",get:function(){return this.settings=this.settings?this.settings:{},this.settings},set:function(t){this.settings=t,this._settings.emitters&&(this._emitters=this._settings.emitters),this._settings.modelCallbacks&&(this._modelCallbacks=this._settings.modelCallbacks),this._settings.viewCallbacks&&(this._viewCallbacks=this._settings.viewCallbacks),this._settings.controllerCallbacks&&(this._controllerCallbacks=this._settings.controllerCallbacks),this._settings.routerCallbacks&&(this._routerCallbacks=this._settings.routerCallbacks),this._settings.models&&(this._models=this._settings.models),this._settings.views&&(this._views=this._settings.views),this._settings.controllers&&(this._controllers=this._settings.controllers),this._settings.routers&&(this._routers=this._settings.routers),this._settings.modelEvents&&(this._modelEvents=this._settings.modelEvents),this._settings.viewEvents&&(this._viewEvents=this._settings.viewEvents),this._settings.controllerEvents&&(this._controllerEvents=this._settings.controllerEvents)}},{key:"_emitters",get:function(){return this.emitters=this.emitters?this.emitters:{},this.emitters},set:function(t){this.emitters=MVC.Utils.addPropertiesToTargetObject(t,this._emitters)}},{key:"_modelCallbacks",get:function(){return this.modelCallbacks=this.modelCallbacks?this.modelCallbacks:{},this.modelCallbacks},set:function(t){this.modelCallbacks=MVC.Utils.addPropertiesToTargetObject(t,this._modelCallbacks)}},{key:"_viewCallbacks",get:function(){return this.viewCallbacks=this.viewCallbacks?this.viewCallbacks:{},this.viewCallbacks},set:function(t){this.viewCallbacks=MVC.Utils.addPropertiesToTargetObject(t,this._viewCallbacks)}},{key:"_controllerCallbacks",get:function(){return this.controllerCallbacks=this.controllerCallbacks?this.controllerCallbacks:{},this.controllerCallbacks},set:function(t){this.controllerCallbacks=MVC.Utils.addPropertiesToTargetObject(t,this._controllerCallbacks)}},{key:"_routerCallbacks",get:function(){return this.routerCallbacks=this.routerCallbacks?this.routerCallbacks:{},this.routerCallbacks},set:function(t){this.routerCallbacks=MVC.Utils.addPropertiesToTargetObject(t,this._routerCallbacks)}},{key:"_models",get:function(){return this.models=this.models?this.models:{},this.models},set:function(t){this.models=MVC.Utils.addPropertiesToTargetObject(t,this._models)}},{key:"_views",get:function(){return this.views=this.views?this.views:{},this.views},set:function(t){this.views=MVC.Utils.addPropertiesToTargetObject(t,this._views)}},{key:"_controllers",get:function(){return this.controllers=this.controllers?this.controllers:{},this.controllers},set:function(t){this.controllers=MVC.Utils.addPropertiesToTargetObject(t,this._controllers)}},{key:"_routers",get:function(){return this.routers=this.routers?this.routers:{},this.routers},set:function(t){this.routers=MVC.Utils.addPropertiesToTargetObject(t,this._routers)}},{key:"_modelEvents",set:function(t){MVC.Utils.bindEventsToTargetObjects(t,this._models,this._modelCallbacks)}},{key:"_viewEvents",set:function(t){MVC.Utils.bindEventsToTargetObjects(t,this._views)}},{key:"_controllerEvents",set:function(t){MVC.Utils.bindEventsToTargetObjects(t,this._controllers,this._controllerCallbacks)}}]),e}(MVC.Events),MVC.Router=function(t){function e(t){var n;return _classCallCheck(this,e),n=_possibleConstructorReturn(this,_getPrototypeOf(e).call(this)),Object.assign(_assertThisInitialized(n),t,{settings:t}),n.setRoutes(n.routes,n.controllers),n.setEvents(),n.start(),"function"==typeof n.initialize&&n.initialize(),n}return _inherits(e,t),_createClass(e,[{key:"start",value:function(){""===this.getRoute()?this.navigate("/"):window.dispatchEvent(new Event("hashchange"))}},{key:"setRoutes",value:function(t,e){for(var n in t)this.routes[n]=e[t[n]]}},{key:"setEvents",value:function(){window.addEventListener("hashchange",this.hashChange.bind(this))}},{key:"getRoute",value:function(){return String(window.location.hash).split("#").pop()}},{key:"hashChange",value:function(t){var e=this.getRoute();try{this.routes[e](t),this.emit("navigate",this)}catch(t){}}},{key:"navigate",value:function(t){window.location.hash=t}}]),e}(MVC.Events);
//# sourceMappingURL=http://localhost:3000/.maps/browser/mvc-framework-min.js.map
