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