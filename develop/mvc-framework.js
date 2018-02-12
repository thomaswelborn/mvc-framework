class Events {
  constructor() {
    this.events = {};
  }
  on(eventName, callback) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(callback);
  }
  off(eventName, callback) {
    var currentEvents = this.events[eventName];
    if(typeof currentEvents === 'undefined' || currentEvents.length === 0) return;
    var currentEventIndex = Object.entries(currentEvents).map(function(currentEvent, currentEventIndex) {
      if(typeof callback === 'string' && callback === currentEvent[1].name) return currentEventIndex;
      if(typeof callback === 'function' && callback.name === currentEvent[1].name) return currentEventIndex;
    }.bind(this));
    for(var key = currentEventIndex.length; key > 0; key--) {
      currentEvents.splice(currentEventIndex[key], 1);
    }
  }
  trigger(eventName, data) {
    try {
      this.events[eventName].forEach(function(callback) {
          callback(data);
      });
    } catch(error) {}
  }
}
class AJAX {
  constructor(type, url, settings) {
    this.responseTypes = ['', 'arraybuffer', 'blob', 'document', 'json', 'text'];
    this.defaultContentType = {'Content-Type': 'application/json'};
    this.defaultResponseType = 'json';
    this.type = type;
    this.url = url;
    this.settings = settings || {};
    this.data = this.settings.data || null;
    return new Promise(function (resolve, reject) {
      this.xhr = new XMLHttpRequest();
      this.xhr.open(this.type, this.url);
      this.setResponseType(this.xhr, this.settings.responseType || this.defaultResponseType);
      this.setHeaders(this.xhr, this.settings.headers || [this.defaultContentType]);
      this.xhr.onload = resolve;
      this.xhr.onerror = reject;
      this.xhr.send(this.data);
    }.bind(this));
  }
  setResponseType(xhr, responseType) {
    xhr.responseType = this.responseTypes.find(function(element) {
      return element  === responseType;
    });
  }
  setHeaders(xhr, headers) {
    headers.forEach(function(header) {
      xhr.setRequestHeader(Object.keys(header)[0], Object.values(header)[0]);
    });
  }
}
class Model extends Events {
  constructor(settings) {
    super();
    this.settings = settings || {};
    this.data = {};
    this._data = this.settings.data;
    delete this.settings.data;
    this.setAll(this._data);
    for(var key in this.settings) {
      this[key] = this.settings[key];
    }
    try {
      this.initialize();
    } catch(error) {}
  }
  fetch(settings, url) {
    return new AJAX('GET', url || this.url, settings || {});
  }
  add(settings, url) {
    return new AJAX('POST', url || this.url, settings || {});
  }
  update(settings, url) {
    return new AJAX('PUT', url || this.url, settings || {});
  }
  remove(settings, url) {
    return new AJAX('DELETE', url || this.url, settings || {});
  }
  setAll(data) {
    for(var key in data) {
      this.set(key, data[key]);
    }
  }
  set(key, value) {
    if(typeof this.data[key] === 'undefined') {
      var _this = this;
      Object.defineProperty(this.data, key, {
        get() {
          return _this._data[key];
        },
        set(value) {
          var original = Object.assign({}, _this._data);
          _this._data[key] = value;
          _this.trigger('change', {
            original: original,
            data: _this._data,
          });
          _this.trigger(String.prototype.concat('change', ':', key), {
            original: original[key],
            data: _this._data[key],
          });
        },
      });
    } else {
      this.data[key] = value;
    }
  }
  unsetAll() {
    Object.entries(this._data).forEach(function(element) {
      this.unset(element[0]);
    }.bind(this));
  }
  unset(key) {
    if(typeof this.data[key] !== 'undefined') {
      delete this.data[key];
      delete this._data[key];
    }
  }
  get(key) {
    return (key) ? this.data[key] : this._data;
  }
}
class View extends Events {
  constructor(settings) {
    super();
    this.settings = settings || {};
    for(var setting in this.settings) {
      this[setting] = this.settings[setting];
    }
    this.setElement();
    this.setEvents();
    try {
      this.initialize();
    } catch(error) {}
  }
  setElement() {
    if(typeof this.element === 'undefined') {
      this.element = document.createElement(this.elementName || 'div');
    } else if(typeof this.element === 'string') {
      this.element = document.querySelector(this.element); 
    }
    if(typeof this.attributes === 'object') this.setElementAttributes(this.element, this.attributes);
  }
  setElementAttributes(element, attributes) {
    for(var attribute in attributes) {
      element.setAttribute(attribute, attributes[attribute]);
    }
  }
  setEvents() {
    this.on('render', function() {
      this.setUIElements();
      this.setUIEvents();
    }.bind(this));
  }
  setUIElements() {
    this.ui = this.ui || {};
    if(typeof this.uiElements === 'object') {
      Object.entries(this.uiElements).forEach(function(element) {
        this.ui[element[0]] = this.element.querySelectorAll(element[1]);
      }.bind(this));
    }
  }
  setUIEvents() {
    if(typeof this.uiEvents === 'object') {
      Object.entries(this.uiEvents).forEach(function(uiEvent) {
        var uiEventKey = uiEvent[0].split(' ');
        var elementSelectors = uiEventKey[0].split(',');
        var elementActions = uiEventKey[1].split(',');
        elementSelectors.forEach(function(selector) {
          this.setUIEvent(selector, elementActions, uiEvent);
        }.bind(this));
      }.bind(this));
    }
  }
  setUIEvent(selector, elementActions, uiEvent) {
    var element;
    element = (selector.match('@')) ? this.ui[selector.replace('@', '')] : this.element.querySelectorAll(selector);
    element.forEach(function(elementInstance) {
      var elementCallback = (typeof uiEvent[1] === 'function') ? uiEvent[1].bind(this) : this[uiEvent[1]].bind(this);
      elementActions.forEach(function(elementAction) {
        elementInstance.addEventListener(elementAction, elementCallback);
      }.bind(this));
    }.bind(this));
  }
  render(data) {
    if(typeof this.template !== 'undefined') {
      this.element.innerHTML = '';
      this.element.append(this.template(data || {}));
    }
    this.trigger('render', this);
    return this;
  }
}
class Controller extends Events {
  constructor(settings) {
    super();
    this.settings = settings;
    for(var key in this.settings) {
      this[key] = this.settings[key];
    }
    if(
      typeof this.views !== 'undefined' && 
      typeof this.viewEvents !== 'undefined'
    ) this.bindEvents(this.views, this.viewEvents);
    if(
      typeof this.models !== 'undefined' && 
      typeof this.modelEvents !== 'undefined'
    ) this.bindEvents(this.models, this.modelEvents);
    if(
      typeof this.controllers !== 'undefined' && 
      typeof this.controllerEvents !== 'undefined'
    ) this.bindEvents(this.controllers, this.controllerEvents);
  }
  bindEvents(target, events) {
    Object.entries(events).forEach(function(event) {
      event[0] = event[0].split(' ');
      var element = event[0][0].replace('@', '');
      var elementEvent = event[0][1];
      var elementEventCallback = event[1];
      target[element].on(elementEvent, this[elementEventCallback]);
    }.bind(this));
  }
}
class Router extends Events {
  constructor(settings) {
    super();
    this.settings = settings;
    for(var setting in this.settings) {
      this[setting] = this.settings[setting];
    }
    this.setRoutes(this.settings.routes, this.settings.controllers);
    this.setEvents();
    this.start();
    try {
      this.initialize();
    } catch(error) {}
  }
  start() {
    var location = this.getRoute();
    if(location === '') {
      window.location.hash = '/';
    }else {
      window.dispatchEvent(new Event('hashchange'));
    }
  }
  setRoutes(routes, controllers) {
    for(var route in routes) {
      this.routes[route] = controllers[routes[route]];
    }
    return;
  }
  setEvents() {
    window.addEventListener('hashchange', this.onHashChange.bind(this));
    return;
  }
  getRoute() {
    return String(window.location.hash).split('#').pop();
  }
  onHashChange(event) {
    var route = this.getRoute();
    try {
      this.routes[route](event);
      this.trigger('navigate', event);
    } catch(error) {}
  }
  navigate(path) {
    window.location.hash = path;
  }
}
