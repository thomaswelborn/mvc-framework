MVC.Router = class extends MVC.Base {
  constructor() {
    super(...arguments)
    return this
  }
  get protocol() { return window.location.protocol }
  get hostname() { return window.location.hostname }
  get port() { return window.location.port }
  get path() { return window.location.pathname }
  get hash() {
    let href = window.location.href
    let hashIndex = href.indexOf('#')
    if(hashIndex > -1) {
      let paramIndex = href.indexOf('?')
      let sliceStart = hashIndex + 1
      let sliceStop
      if(paramIndex > -1) {
        sliceStop = (hashIndex > paramIndex)
          ? href.length
          : paramIndex
      } else {
        sliceStop = href.length
      }
      href = href.slice(sliceStart, sliceStop)
      if(href.length) {
        return href
      } else {
        return null
      }
    } else {
      return null
    }
  }
  get params() {
    let href = window.location.href
    let paramIndex = href.indexOf('?')
    if(paramIndex > -1) {
      let hashIndex = href.indexOf('#')
      let sliceStart = paramIndex + 1
      let sliceStop
      if(hashIndex > -1) {
        sliceStop = (paramIndex > hashIndex)
          ? href.length
          : hashIndex
      } else {
        sliceStop = href.length
      }
      href = href.slice(sliceStart, sliceStop)
      if(href.length) {
        return href
      } else {
        return null
      }
    } else {
      return null
    }
  }
  get _routeData() {
    let routeData = {
      location: {},
      controller: {},
    }
    let path = this.path.split('/').filter((fragment) => fragment.length)
    path = (path.length)
      ? path
      : ['/']
    let hash = this.hash
    let hashFragments = (hash)
      ? hash.split('/').filter((fragment) => fragment.length)
      : null
    let params = this.params
    let paramData = (params)
      ? MVC.Utils.paramsToObject(params)
      : null
    if(this.protocol) routeData.location.protocol = this.protocol
    if(this.hostname) routeData.location.hostname = this.hostname
    if(this.port) routeData.location.port = this.port
    if(this.path) routeData.location.path = this.path
    if(
      hash &&
      hashFragments
    ) {
      hashFragments = (hashFragments.length)
      ? hashFragments
      : ['/']
      routeData.location.hash = {
        path: hash,
        fragments: hashFragments,
      }
    }
    if(
      params &&
      paramData
    ) {
      routeData.location.params = {
        path: params,
        data: paramData,
      }
    }
    routeData.location.path = {
      name: this.path,
      fragments: path,
    }
    routeData.location.currentURL = this.currentURL
    let routeControllerData = this._routeControllerData
    routeData.location = Object.assign(
      routeData.location,
      routeControllerData.location
    )
    routeData.controller = routeControllerData.controller
    this.routeData = routeData
    return this.routeData
  }
  get _routeControllerData() {
    let routeData = {
      location: {},
    }
    Object.entries(this.routes)
      .forEach(([routePath, routeSettings]) => {
        let pathFragments = this.path.split('/').filter((fragment) => fragment.length)
        pathFragments = (pathFragments.length)
          ? pathFragments
          : ['/']
        let routeFragments = routePath.split('/').filter((fragment, fragmentIndex) => fragment.length)
        routeFragments = (routeFragments.length)
          ? routeFragments
          : ['/']
        if(
          pathFragments.length &&
          pathFragments.length === routeFragments.length
        ) {
          let match
          return routeFragments.filter((routeFragment, routeFragmentIndex) => {
            if(
              match === undefined ||
              match === true
            ) {
              if(routeFragment[0] === ':') {
                let currentIDKey = routeFragment.replace(':', '')
                if(
                  routeFragmentIndex === pathFragments.length - 1
                ) {
                  routeData.location.currentIDKey = currentIDKey
                }
                routeData.location[currentIDKey] = pathFragments[routeFragmentIndex]
                routeFragment = this.fragmentIDRegExp
              } else {
                routeFragment = routeFragment.replace(new RegExp('/', 'gi'), '\\\/')
                routeFragment = this.routeFragmentNameRegExp(routeFragment)
              }
              match = routeFragment.test(pathFragments[routeFragmentIndex])
              if(
                match === true &&
                routeFragmentIndex === pathFragments.length - 1
              ) {
                routeData.location.route = {
                  name: routePath,
                  fragments: routeFragments,
                }
                routeData.controller = routeSettings
                return routeSettings
              }
            }
          })[0]
        }
      })
    return routeData
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
  get _controller() { return this.controller }
  set _controller(controller) { this.controller = controller }
  get _previousURL() { return this.previousURL }
  set _previousURL(previousURL) { this.previousURL = previousURL }
  get _currentURL() { return this.currentURL }
  set _currentURL(currentURL) {
    if(this.currentURL) this._previousURL = this.currentURL
    this.currentURL = currentURL
  }
  get fragmentIDRegExp() { return new RegExp(/^([0-9A-Z\?\=\,\.\*\-\_\'\"\^\%\$\#\@\!\~\(\)\{\}\&\<\>\\\/])*$/, 'gi') }
  routeFragmentNameRegExp(fragment) {
    return new RegExp('^'.concat(fragment, '$'))
  }
  enable() {
    if(
      !this.enabled
    ) {
      this.enableEvents()
      this.enableRoutes()
      this._enabled = true
    }
    return this
  }
  disable() {
    if(
      this.enabled
    ) {
      this.disableEvents()
      this.disableRoutes()
      this._enabled = false
    }
    return this
  }
  enableRoutes() {
    if(this.settings.controller) this._controller = this.settings.controller
    this._routes = Object.entries(this.settings.routes).reduce(
      (
        _routes,
        [routePath, routeSettings],
        routeIndex,
        originalRoutes,
      ) => {
        _routes[routePath] = Object.assign(
          routeSettings,
          {
            callback: this.controller[routeSettings.callback].bind(this.controller),
          }
        )
        return _routes
      },
      {}
    )
    return this
  }
  disableRoutes() {
    delete this._routes
    delete this._controller
    return this
  }
  enableEvents() {
    window.addEventListener('hashchange', this.routeChange.bind(this))
    return this
  }
  disableEvents() {
    window.removeEventListener('hashchange', this.routeChange.bind(this))
    return this
  }
  routeChange() {
    this._currentURL = window.location.href
    let routeData = this._routeData
    if(routeData.controller) {
      if(this.previousURL) routeData.previousURL = this.previousURL
      this.emit(
        'navigate',
        routeData
      )
      routeData.controller.callback(routeData)
    }
    return this
  }
  navigate(path) {
    window.location.href = path
  }
}
