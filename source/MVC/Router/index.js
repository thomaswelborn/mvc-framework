import { paramsToObject } from '../Utils/index'
import Base from '../Base/index'

const Router = class extends Base {
  constructor() {
    super(...arguments)
    this.addWindowEvents()
  }
  get classDefaultProperties() { return [
    'root',
    'hashRouting',
    'controller',
    'routes'
  ] }
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
  get _root() { return this.root || '/' }
  set _root(root) { this.root = root }
  get _hashRouting() { return this.hashRouting || false }
  set _hashRouting(hashRouting) { this.hashRouting = hashRouting }
  get _routeData() {}
  get _routeControllerData() {}
  get _routes() { return this.routes }
  set _routes(routes) { this.routes = routes }
  get _controller() { return this.controller }
  set _controller(controller) { this.controller = controller }
  get routeData() {
    return {
      root: this.root,
      protocol: this.protocol,
      hostname: this.hostname,
      port: this.port,
      pathname: this.pathname,
      path: this.path,
      hash: this.hash,
      parameters: this.parameters,
    }
  }
  matchRoute(routeFragments, currentRouteFragments) {
    let routeMatches = new Array()
    if(routeFragments.length === currentRouteFragments.length) {
      routeMatches = routeFragments
        .reduce((_routeMatches, routeFragment, routeFragmentIndex) => {
          let currentRouteFragment = currentRouteFragments[routeFragmentIndex]
          if(routeFragment.match(/^\:/)) {
            _routeMatches.push(true)
          } else if(routeFragment === currentRouteFragment) {
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
  getRoute(routeData) {
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
        let routeDataFragments = (this.hashRouting)
          ? routeData.hash.fragments
          : routeData.path.fragments
        let matchRoute = this.matchRoute(
          routeFragments,
          routeDataFragments,
        )
        return matchRoute === true
      })
  }
  popState(event) {
    let routeData = this.routeData
    let route = this.getRoute(routeData)
    if(route) {
      this.controller[route.callback](routeData)
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
