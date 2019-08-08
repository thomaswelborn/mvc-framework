MVC.Router = class extends MVC.Base {
  constructor() {
    super(...arguments)
  }
  get route() {
    if(this._hash) {
      return String(window.location.hash).split('#').pop()
    } else {
      return String(window.location.pathname)
    }
  }
  get _hash() { return this.hash }
  set _hash(hash) { this.hash = hash }
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
  get _controller() { return this.controller }
  set _controller(controller) { this.controller = controller }
  get _previousURL() { return this.previousURL }
  set _previousURL(previousURL) { this.previousURL = previousURL }
  get _currentURL() { return this.currentURL }
  set _currentURL(currentURL) { this.currentURL = currentURL }
  get fragmentIDRegExp() { return new RegExp(/^([0-9A-Z\?\=\,\.\*\-\_\'\"\^\%\$\#\@\!\~\(\)\{\}\&\<\>\\\/])*$/, 'gi') }
  fragmentNameRegExp(fragment) { return new RegExp('^'.concat(fragment, '$')) }
  enable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      this._hash = (typeof this.settings.hash === 'boolean')
        ? this.settings.hash
        : true
      this.enableEmitters()
      this.enableEvents()
      this.enableRoutes()
      this.routeChange()
      this._enabled = true
    }
  }
  disable() {
    let settings = this.settings
    if(
      settings &&
      this.enabled
    ) {
      delete this._hash
      this.disableEvents()
      this.disableRoutes()
      this.disableEmitters()
      this._enabled = false
    }
  }
  enableRoutes() {
    if(this.settings.controller) this._controller = this.settings.controller
    this._routes = Object.entries(this.settings.routes).reduce(
      (
        _routes,
        [routePath, routeCallback],
        routeIndex,
        originalRoutes,
      ) => {
        _routes[routePath] = this.controller[routeCallback].bind(this.controller)
        return _routes
      },
      {}
    )
    return
  }
  enableEmitters() {
    this._emitters = {
      navigateEmitter: new MVC.Emitters.NavigateEmitter(),
    }
  }
  disableEmitters() {
    delete this._emitters.navigateEmitter
  }
  disableRoutes() {
    delete this._routes
    delete this._controller
  }
  enableEvents() {
    window.addEventListener('hashchange', this.routeChange.bind(this))
  }
  disableEvents() {
    window.removeEventListener('hashchange', this.routeChange.bind(this))
  }
  routeChange() {
    let route = this.route.split('/').filter((fragment) => fragment.length)
    route = (route.length)
      ? route
      : ['/']
    let routeControllerData = Object.entries(this.routes)
      .filter(([routerPath, routerController]) => {
        routerPath = routerPath.split('/').filter((fragment) => fragment.length)
        routerPath = (routerPath.length)
          ? routerPath
          : ['/']
        if(
          route.length &&
          route.length === routerPath.length
        ) {
          routerPath
          let match
          return routerPath.filter((fragment, fragmentIndex) => {
            if(
              match === undefined ||
              match === true
            ) {
              if(fragment[0] === ':') {
                fragment = this.fragmentIDRegExp
              } else {
                fragment = fragment.replace(new RegExp('/', 'gi'), '\\\/')
                fragment = this.fragmentNameRegExp(fragment)
              }
              match = fragment.test(route[fragmentIndex])
              if(
                match === true &&
                fragmentIndex === route.length - 1
              ) {
                return routerController
              }
            }
          })[0]
        }
      })[0]
    try {
      if(this.currentURL) this._previousURL = this.currentURL
      this._currentURL = window.location.href
      let routeControllerName = routeControllerData[0]
      let routeController = routeControllerData[1]
      let navigateEmitter = this.emitters.navigateEmitter
      let navigateEmitterData = {
        currentURL: this.currentURL,
        previousURL: this.previousURL,
        currentRoute: this.route,
        currentController: routeController.name
      }
      navigateEmitter.set(navigateEmitterData)
      this.emit(
        navigateEmitter.name,
        navigateEmitter.emission()
      )
      routeController(navigateEmitter.emission())
    } catch(error) {
      throw error
    }
  }
  navigate(path) {
    window.location.hash = path
  }
}
