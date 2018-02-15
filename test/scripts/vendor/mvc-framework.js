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
    var currentEventIndices = Object.entries(currentEvents).map(function(currentEvent, currentEventIndex) {
      if(
        (typeof callback === 'string' && callback === currentEvent[1].name) || 
        (typeof callback === 'function' && callback.name === currentEvent[1].name)
      ) return currentEventIndex;
    }.bind(this));
    for(var key = currentEventIndices.length; key > 0; key--) {
      currentEvents.splice(currentEventIndices[key - 1], 1);
    }
  }
  trigger(eventName, data) {
    try {
      this.events[eventName].forEach(function(callback) {
          callback(data);
      });
    } catch(error) {}
  }
  bindEvents(targets, events) {
    Object.entries(events).forEach(function(event) {
      event[0] = event[0].split(' ');
      var eventKeys = event[0][0].split(',');
      var eventNames = event[0][1].split(',');
      var callback = event[1];
      Object.entries(eventKeys).forEach(function(eventKey) {
        eventKey = eventKey[1].replace('@', '');
        Object.entries(eventNames).forEach(function(eventName) {
          eventName = eventName[1]; 
          callback = (typeof callback === 'function') ? callback : this[callback];
          try {
            if(typeof targets[eventKey].on === 'function') {
              targets[eventKey].on(eventName, callback);
            } else {
              targets[eventKey].forEach(function(target) {
                target.addEventListener(eventName, function() {
                  callback();
                });
              }.bind(this));
            }
          } catch(error) {}
        }.bind(this));
      }.bind(this));
    }.bind(this));
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
    Object.assign(this, settings, { settings: settings });
    this.data = {};
    this._data = this.settings.data;
    this.setAll(this._data);
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
    Object.assign(this, settings, { settings: settings });
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
    this.on('render', this.setUIElements.bind(this));
  }
  setUIElements() {
    this.ui = this.ui || {};
    Object.entries(this.uiElements).forEach(function(element) {
      this.ui[element[0]] = this.element.querySelectorAll(element[1]);
    }.bind(this));
    this.bindEvents(this.ui, this.uiEvents);
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
    Object.assign(this, settings, { settings: settings });
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
    try {
      this.initialize();
    } catch(error) {}
  }
}

class Router extends Events {
  constructor(settings) {
    super();
    Object.assign(this, settings, { settings: settings });
    this.setRoutes(this.routes, this.controllers);
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
