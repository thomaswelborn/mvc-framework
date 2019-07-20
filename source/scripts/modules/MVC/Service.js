MVC.Service = class extends MVC.Events {
  constructor(settings, options, configuration) {
    super()
    if(configuration) this._configuration = configuration
    if(options) this._options = options
    if(settings) this._settings = settings
  }
  get _defaults() { return this.defaults || {
    contentType: {'Content-Type': 'application/json'},
    responseType: 'json',
  } }
  get _options() { return this.options }
  set _options(options) { this.options = options }
  get _configuration() { return this.configuration }
  set _configuration(configuration) { this.configuration = configuration }
  get _settings() { return this.settings || {} }
  set _settings(settings) {
    this.settings = settings
    if(this.settings.type) this._type = this.settings.type
    if(this.settings.url) this._url = this.settings.url
    if(this.settings.data) this._data = this.settings.data || null
    if(this.settings.headers) this._headers = this.settings.headers || [this._defaults.contentType]
    if(this.settings.responseType) this._responseType = this.settings.responseType
  }
  get _responseTypes() { return ['', 'arraybuffer', 'blob', 'document', 'json', 'text'] }
  get _responseType() { return this.responseType }
  set _responseType(responseType) {
    this._xhr.responseType = this._responseTypes.find(
      (responseTypeItem) => responseTypeItem === responseType
    ) || this._defaults.responseType
  }
  get _type() { return this.type }
  set _type(type) { this.type = type }
  get _url() { return this.url }
  set _url(url) { this.url = url }
  get _headers() { return this.headers || [] }
  set _headers(headers) {
    this._headers.length = 0
    for(let header of headers) {
      this._xhr.setRequestHeader({header}[0], {header}[1])
      this._headers.push(header)
    }
  }
  get _xhr() {
    this.xhr = (this.xhr)
      ? this.xhr
      : new XMLHttpRequest()
    return this.xhr
  }
  newXHR() {
    return new Promise((resolve, reject) => {
      if(this._xhr.status === 200) this._xhr.abort()
      this._xhr.open(this._type, this._url)
      this._xhr.onload = resolve
      this._xhr.onerror = reject
      this._xhr.send(this._data)
    })
  }
}
