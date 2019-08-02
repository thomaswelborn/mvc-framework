MVC.Router = class extends MVC.Base {
  constructor() {
    super(...arguments)
  }
  get route() {
    return String(window.location.hash).split('#').pop()
  }
  get _enabled() { return this.enabled || false }
  set _enabled(enabled) { this.enabled = enabled }
  get _routes() {
    this.routes = (this.routes)
      ? this.routes
      : {}
    return this.routes
  }
  set _routes(routes) {
    this.routes = MVC.Utils.addPropertiesToObject(
      routes, this._routes
    )
  }
  get _controller() {
    this.controller = (this.controller)
      ? this.controller
      : {}
    return this.controller
  }
  set _controller(controller) {
    this.controller = MVC.Utils.addPropertiesToObject(
      controller, this._controller
    )
  }
  enable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      this.enableRoutes(this.routes, this.controllers)
      this.enableEvents()
      this._enabled = true
    }
  }
  disable() {
    let settings = this.settings
    if(
      settings &&
      this.enabled
    ) {
      this.disableEvents()
      this.disableRoutes()
      this._enabled = false
    }
  }
  enableRoutes(routes, controllers) {
    if(settings.controllers) this._controllers = settings.controllers
    this._routes = settings.routes.map((route) => controllers[routes[route]])
    return
  }
  disableRoutes() {
    delete this._routes
    delete this._controllers
  }
  enableEvents() {
    window.addEventListener('hashchange', this.hashChange.bind(this))
  }
  disableEvents() {
    window.removeEventListener('hashchange', this.hashChange.bind(this))
  }
  hashChange(event) {
    var route = this.route
    try {
      this.routes[route](event)
      this.emit('navigate', this)
    } catch(error) {}
  }
  navigate(path) {
    window.location.hash = path
  }
}
