import Events from '../Events/index'

class Service extends Events {
  constructor(settings = {}, options = {}) {
    super(...arguments)
    this.settings = settings
    this.options = options
  }
  get validSettings() { return [
    'url',
    'method',
    'mode',
    'cache',
    'credentials',
    'headers',
    'parameters',
    'redirect',
    'referrer-policy',
    'body',
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
  get url() {
    if(this.parameters) {
      return this._url.concat(this.queryString)
    } else {
      return this._url
    }
  }
  set url(url) { this._url = url }
  get queryString() {
    let queryString = ''
    if(this.parameters) {
      let parameterString = Object.entries(this.parameters)
        .reduce((parameterStrings, [parameterKey, parameterValue]) => {
          let parameterString = parameterKey.concat('=', parameterValue)
          parameterStrings.push(parameterString)
          return parameterStrings
        }, [])
          .join('&')
      queryString = '?'.concat(parameterString)
    }
    return queryString
  }
  get method() { return this._method }
  set method(method) { this._method = method }
  set mode(mode) { this._mode = mode }
  get mode() { return this._mode }
  set cache(cache) { this._cache = cache }
  get cache() { return this._cache }
  set credentials(credentials) { this._credentials = credentials }
  get credentials() { return this._credentials }
  set headers(headers) { this._headers = headers }
  get headers() { return this._headers }
  set redirect(redirect) { this._redirect = redirect }
  get redirect() { return this._redirect }
  set referrerPolicy(referrerPolicy) { this._referrerPolicy = referrerPolicy }
  get referrerPolicy() { return this._referrerPolicy }
  set body(body) { this._body = body }
  get body() { return this._body }
  get parameters() { return this._parameters || null }
  set parameters(parameters) { this._parameters = parameters }
  get previousAbortController() {
    return this._previousAbortController
  }
  set previousAbortController(previousAbortController) { this._previousAbortController = previousAbortController }
  get abortController() {
    if(!this._abortController) {
      this.previousAbortController = this._abortController
    }
    this._abortController = new AbortController()
    return this._abortController
  }
  abort() {
    this.abortController.abort()
    return this
  }
  fetch() {
    const fetchOptions = this.validSettings.reduce((_fetchOptions, fetchOptionName) => {
      if(this[fetchOptionName]) _fetchOptions[fetchOptionName] = this[fetchOptionName]
      return _fetchOptions
    }, {})
    fetchOptions.signal = this.abortController.signal
    if(this.previousAbortController) this.previousAbortController.abort()
    return fetch(this.url, fetchOptions)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        this.emit('ready', data)
        return data
      })
      .catch((error) => {
        let data = {
          type: 'error',
          message: error,
        }
        this.emit('error', {
          data: data
        })
        return data
      })
  }
}
export default Service
