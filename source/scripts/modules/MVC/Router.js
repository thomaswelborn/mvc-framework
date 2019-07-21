MVC.Router = class extends MVC.Base {
  constructor() {
    super(...arguments)
    this.addSettings()
    this.setRoutes(this.routes, this.controllers)
    this.setEvents()
    this.start()
    if(typeof this.initialize === 'function') this.initialize()
  }
  addSettings() {
    if(this._settings) {
      if(this._settings.routes) this.routes = this._settings.routes
      if(this._settings.controllers) this.controllers = this._settings.controllers
    }
  }
  start() {
    var location = this.getRoute()
    if(location === '') {
      this.navigate('/')
    }else {
      window.dispatchEvent(new Event('hashchange'))
    }
  }
  setRoutes(routes, controllers) {
    for(var route in routes) {
      this.routes[route] = controllers[routes[route]]
    }
    return
  }
  setEvents() {
    window.addEventListener('hashchange', this.hashChange.bind(this))
    return
  }
  getRoute() {
    return String(window.location.hash).split('#').pop()
  }
  hashChange(event) {
    var route = this.getRoute()
    try {
      this.routes[route](event)
      this.emit('navigate', this)
    } catch(error) {}
  }
  navigate(path) {
    window.location.hash = path
  }
}
