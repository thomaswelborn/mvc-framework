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
    if(
      typeof currentEvents === 'undefined' || 
      currentEvents.length === 0
    ) return;
    var currentEventIndices = Object.entries(currentEvents).filter(function(currentEvent, currentEventIndex) {
      return (
        (typeof callback === 'string' && callback === currentEvent[1].name) || 
        (typeof callback === 'function' && callback.name === currentEvent[1].name)
      );
    }.bind(this));
    for(var key = currentEventIndices.length; key > 0; key--) {
      currentEvents.splice(currentEventIndices[key - 1][0], 1);
    }
    if(currentEvents.length === 0) delete this.events[eventName];
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
    xhr.responseType = this.responseTypes.find(function(responseTypeItem) {
      return responseTypeItem === responseType;
    }) || '';
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
    if(typeof this.data === 'object') this.setAll(this.data);
    if(typeof this.initialize === 'function') this.initialize();
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
    if(typeof data === 'object') {
      this.data = eval(Array('new', ' ', data.constructor.name, '()').join(''));
      this._data = data;
      if(Array.isArray(data)) {
        for(var key in data) {
          if(data[key].constructor.name !== 'Model') {
            data[key] = new Model({
              data: data[key]
            });
            data[key].on('set', function(data) {
              this.trigger('set', data);
            }.bind(this));
          }
          this.set(this.data.length, data[key]);
        }
      } else {
        for(var key in data) {
          this.set(key, data[key]);
        }
      }
    } 
  }
  set(key, value) {
    if(typeof this.data[key] === 'undefined') this.setProperty(this, key, value);
    if(
      typeof key === 'number' && 
      value.constructor.name !== 'Model'
    ) value = new Model({ data: value });
    this.data[key] = value;
  }
  setProperty(context, key, value) {
    Object.defineProperty(context.data, key, {
      get() {
        return context._data[key];
      },
      set(value) {
        var original = Object.assign({}, context._data);
        context._data[key] = value;
        context.trigger('set', {
          original: original,
          current: context._data,
        });
        context.trigger(String.prototype.concat('set', ':', key), {
          original: original[key],
          current: context._data[key],
        });
      },
    });
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
      this.trigger(String.prototype.concat('unset', ':', key), this._data);
    }
  }
  get(key) {
    if(key) return this.data[key];
    return this._data;
  }
  parse() {
    var data = eval(Array('new', ' ', this.data.constructor.name, '()').join(''));
    for(var key in this._data) {
      if(this._data[key] instanceof Model) {
        data[key] = this._data[key].parse();
      } else {
        data[key] = this._data[key];
      }
    }
    return JSON.parse(JSON.stringify(data));
  }
}

class View extends Events {
  constructor(settings) {
    super();
    Object.assign(this, settings, { settings: settings });
    this.setElement();
    this.setEvents();
    if(typeof this.initialize === 'function') this.initialize();
  }
  setElement() {
    switch(typeof this.element) {
      case 'undefined': 
        this.element = document.createElement(this.elementName || 'div');
        break;
      case 'string': 
        this.element = document.querySelector(this.element); 
        break;
    }
    if(typeof this.attributes === 'object') this.setElementAttributes(this.element, this.attributes);
  }
  setElementAttributes(element, attributes) {
    for(var attribute in attributes) {
      element.setAttribute(attribute, attributes[attribute]);
    }
  }
  setEvents() {
    this.on('render', this.setElements.bind(this));
  }
  setElements() {
    this.elements = this.elements || {};
    Object.entries(this.elements).forEach(function(element) {
      this.elements[element[0]] = this.element.querySelectorAll(element[1]);
    }.bind(this));
    this.bindEvents(this.elements, this.elementEvents);
  }
  render(data) {
    this.element.innerHTML = '';
    if(typeof this.template === 'function') this.element.append(this.template(data || {}));
    this.trigger('render', this);
    return this;
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
          var triggerEventName = String.prototype.concat(this.constructor.name.toLowerCase(), ':', 'event');
          targets[eventKey].forEach(function(target) {
            target.addEventListener(eventName, function(event) {
              callback(event);
              this.trigger(triggerEventName, this);
            }.bind(this));
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }.bind(this));
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
    if(typeof this.initialize === 'function') this.initialize();
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
          var triggerEventName = String.prototype.concat(this.constructor.name.toLowerCase(), ':', 'event');
          targets[eventKey].on(eventName, function(event) {
            callback(event);
            this.trigger(triggerEventName, this);
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }
}

class Router extends Events {
  constructor(settings) {
    super();
    Object.assign(this, settings, { settings: settings });
    this.setRoutes(this.routes, this.controllers);
    this.setEvents();
    this.start();
    if(typeof this.initialize === 'function') this.initialize();
  }
  start() {
    var location = this.getRoute();
    if(location === '') {
      this.navigate('/');
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
      this.trigger('navigate', this);
    } catch(error) {}
  }
  navigate(path) {
    window.location.hash = path;
  }
}