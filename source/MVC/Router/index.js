import Events from '../Events/index'

const Router = class extends Events {
  constructor(settings = {}, options = {}) {
    super()
    this.settings = settings
    this.options = options
    this.addWindowEvents()
  }
  get validSettings() { return [
    'root',
    'hashRouting',
    'controller',
    'routes'
  ] }
  get settings() { return this._settings }
  set settings(settings) {
    this._settings = settings
    this.validSettings.forEach((validSetting) => {
      if(settings[validSetting]) this[validSetting] = settings[validSetting]
    })
  }
  get options() {
    if(!this._options) this._options = {}
    return this._options
  }
  set options(options) { this._options = options }
  get protocol() { return window.location.protocol }
  get hostname() { return window.location.hostname }
  get port() { return window.location.port }
  get pathname() { return window.location.pathname }
  get path() {
    let string = window.location.pathname
      .replace(new RegExp(['^', this.root].join('')), '')
      .split('?')
      .slice(0, 1)
      [0]
    let fragments = (
      string.length === 0
    ) ? []
      : (
          string.length === 1 &&
          string.match(/^\//) &&
          string.match(/\/?/)
        ) ? ['/']
          : string
              .replace(/^\//, '')
              .replace(/\/$/, '')
              .split('/')
    return {
      fragments: fragments,
      string: string,
    }
  }
  get hash() {
    let string = window.location.hash
      .slice(1)
      .split('?')
      .slice(0, 1)
      [0]
    let fragments = (
      string.length === 0
    ) ? []
      : (
          string.length === 1 &&
          string.match(/^\//) &&
          string.match(/\/?/)
        ) ? ['/']
          : string
              .replace(/^\//, '')
              .replace(/\/$/, '')
              .split('/')
    return {
      fragments: fragments,
      string: string,
    }
  }
  get parameters() {
    let string
    let data
    if(window.location.href.match(/\?/)) {
      let parameters = window.location.href
        .split('?')
        .slice(-1)
        .join('')
      string = parameters
      data = parameters
        .split('&')
        .reduce((
          _parameters,
          parameter
        ) => {
          let parameterData = parameter.split('=')
          _parameters[parameterData[0]] = parameterData[1]
          return _parameters
        }, {})
    } else {
      string = ''
      data = {}
    }
    return {
      string: string,
      data: data
    }
  }
  get root() { return this._root || '/' }
  set root(root) { this._root = root }
  get hashRouting() { return this._hashRouting || false }
  set hashRouting(hashRouting) { this._hashRouting = hashRouting }
  get routes() { return this._routes }
  set routes(routes) { this._routes = routes }
  get controller() { return this._controller }
  set controller(controller) { this._controller = controller }
  get location() {
    return {
      root: this.root,
      path: this.path,
      hash: this.hash,
      parameters: this.parameters,
    }
  }
  matchRoute(routeFragments, locationFragments) {
    let routeMatches = new Array()
    if(routeFragments.length === locationFragments.length) {
      routeMatches = routeFragments
        .reduce((_routeMatches, routeFragment, routeFragmentIndex) => {
          let locationFragment = locationFragments[routeFragmentIndex]
          if(routeFragment.match(/^\:/)) {
            _routeMatches.push(true)
          } else if(routeFragment === locationFragment) {
            _routeMatches.push(true)
          } else {
            _routeMatches.push(false)
          }
          return _routeMatches
        }, [])
    } else {
      routeMatches.push(false)
    }
    return (routeMatches.indexOf(false) === -1)
      ? true
      : false
  }
  getRoute(location) {
    let routes = Object.entries(this.routes)
      .reduce((
        _routes,
        [routeName, routeSettings]) => {
          let routeFragments = (
            routeName.length === 1 &&
            routeName.match(/^\//)
          ) ? [routeName]
            : (routeName.length === 0)
              ? ['']
              : routeName
                  .replace(/^\//, '')
                  .replace(/\/$/, '')
                  .split('/')
          routeSettings.fragments = routeFragments
          _routes[routeFragments.join('/')] = routeSettings
          return _routes
        },
        {}
      )
    return Object.values(routes)
      .find((route) => {
        let routeFragments = route.fragments
        let locationFragments = (this.hashRouting)
          ? location.hash.fragments
          : location.path.fragments
        let matchRoute = this.matchRoute(
          routeFragments,
          locationFragments,
        )
        return matchRoute === true
      })
  }
  popState(event) {
    let location = this.location
    let route = this.getRoute(location)
    let routeData = {
      route: route,
      location: location,
    }
    if(route) {
      this.controller[route.callback](routeData)
      this.emit('change', {
        name: 'change',
        data: routeData,
      },
      this)
    }
  }
  addWindowEvents() {
    window.on('popstate', this.popState.bind(this))
  }
  removeWindowEvents() {
    window.off('popstate', this.popState.bind(this))
  }
  navigate(path) {
    window.location.href = path
  }
}
export default Router
