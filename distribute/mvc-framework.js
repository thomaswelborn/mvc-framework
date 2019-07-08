var MVC = MVC || {}

MVC.Events = class {
  constructor() {
    this.events = {}
  }
  on(eventName, callback) {
    this.events[eventName] = this.events[eventName] || []
    this.events[eventName].push(callback)
  }
  off(eventName, callback) {
    var currentEvents = this.events[eventName]
    if(
      typeof currentEvents === 'undefined' ||
      currentEvents.length === 0
    ) return
    var currentEventIndices = Object.entries(currentEvents)
      .filter((currentEvent, currentEventIndex) => {
        return (
          (typeof callback === 'string' && callback === currentEvent[1].name) ||
          (typeof callback === 'function' && callback.name === currentEvent[1].name)
        )
      })
    for(var key = currentEventIndices.length; key > 0; key--) {
      currentEvents.splice(currentEventIndices[key - 1][0], 1)
    }
    if(currentEvents.length === 0) delete this.events[eventName]
  }
  emit(eventName, data) {
    try {
      this.events[eventName].forEach(function(callback) {
        callback(data)
      })
    } catch(error) {}
  }
}

MVC.AJAX = class {
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

MVC.Model = class extends Events {
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

MVC.View = class extends Events() {
  constructor() {
    super()
  }
  get elementName() { return this.element.tagName }
  set elementName(data) {
    if(!this.element) this.element = document.createElement(data)
  }
  get element() { return this._element }
  set element(data) {
    let element
    if(data instanceof HTMLElement) {
      element = data
    } else if(typeof data === 'string') {
      element = document.querySelector(data)
    }
    this._element = element
  }
  get ui() { return this._ui }
  set ui(data) {
    let ui = {}
    for(let [key, value] of data) {
      switch(key) {
        case '@':
          ui[key] = this.element
          break
        default:
          ui[key] = this.element.querySelectorAll(value)
          break;
      }
    }
    this._ui = ui
  }
  get events() { return this._events }
  set events(data) {
    for(let [key, value] of data) {
      let eventData = key.split[' ']
      let eventTarget = this[
        eventData[0].replace('@', '')
      ]
      let eventName = eventData[1]
      let eventCallback = this[
        value.replace('@', '')
      ]
      eventTarget.on(eventName, eventCallback)
    }
  }
  get callbacks() { return this._callbacks }
  set callbacks(data) { this._callbacks = data }
  get emitters() { return this._emitters }
  set emitters(data) { this._emitters = data }
}

MVC.Controller = class extends MVC.Events {
  constructor(settings) {
    super()
    if(this.settings) this.settings = settings
  }
  get settings() { return this._settings }
  set settings(settings) {
    this._settings = settings
    if(this.settings.models) this.models = models
    if(this.settings.views) this.views = views
    if(this.settings.controllers) this.controllers = controllers
    if(this.settings.routers) this.routers = routers
    if(this.settings.emitters) this.emitters = emitters
    if(this.settings.callbacks) this.callbacks = callbacks
    if(this.settings.events) this.events = events
  }
  get models() { return this._models }
  set models(models) { this._models = models }
  get views() { return this._views }
  set views(views) { this._views = views }
  get controllers() { return this._controllers }
  set controllers(controllers) { this._controllers = controllers }
  get routers() { return this._routers }
  set routers(routers) { this._routers = routers }
  get emitters() { return this._emitters }
  set emitters(emitters) { this._emitters = emitters }
  get callbacks() { return this._callbacks }
  set callbacks(callbacks) { this._callbacks = callbacks }
  get events() { return this._events }
  set events(events) {
    for(let [eventSettings, eventCallback] of Object.entries(events)) {
      let eventData = eventSettings.split(' ')
      let eventTarget = eventData[0].replace('@', '').split('.')
      let eventName = eventData[1]
      eventCallback = eventCallback.replace('@', '').split('.')
      this[eventTarget].on(eventName, eventCallback)
    }
  }
}

MVC.Router = class extends Events {
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
    window.addEventListener('hashchange', this.hashChange.bind(this));
    return;
  }
  getRoute() {
    return String(window.location.hash).split('#').pop();
  }
  hashChange(event) {
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
