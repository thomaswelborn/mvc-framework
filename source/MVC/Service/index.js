import Events from '../Events/index'

class Service extends Events {
  constructor(settings = {}, options = {}) {
    super(...arguments)
  }
  get validSettings() { return [
    'url',
    'method',
    'mode',
    'cache',
    'credentials',
    'headers',
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
  get url() { return this._url }
  set url(url) { this._url = url }
  get method() { return this._method }
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
  fetch() {
    const fetchOptions = this.validSettings.reduce((_fetchOptions, [fetchOptionName, fetchOptionValue]) => {
      if(this[fetchOptionName]) _fetchOptions[fetchOptionName] = fetchOptionValue
      return _fetchOptions
    }, {})
    fetch(this.url, fetchOptions)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        this.emit('ready', {
          data: data
        })
      })
    return this
  }
}
export default Service
