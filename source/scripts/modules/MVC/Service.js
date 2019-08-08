MVC.Service = class extends MVC.Base {
  constructor() {
    super(...arguments)
  }
  get _defaults() { return this.defaults || {
    contentType: {'Content-Type': 'application/json'},
    responseType: 'json',
  } }
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
    headers.forEach((header) => {
      this._headers.push(header)
      header = Object.entries(header)[0]
      this._xhr.setRequestHeader(header[0], header[1])
    })
  }
  get _data() { return this.data }
  set _data(data) { this.data = data }
  get _xhr() {
    this.xhr = (this.xhr)
      ? this.xhr
      : new XMLHttpRequest()
    return this.xhr
  }
  get _enabled() { return this.enabled || false }
  set _enabled(enabled) { this.enabled = enabled }
  request(data) {
    data = data || this.data || null
    return new Promise((resolve, reject) => {
      if(this._xhr.status === 200) this._xhr.abort()
      this._xhr.open(this.type, this.url)
      this._headers = this.settings.headers || [this._defaults.contentType]
      this._xhr.onload = resolve
      this._xhr.onerror = reject
      this._xhr.send(data)
    }).then((response) => {
      this.emit('xhr:resolve', {
        name: 'xhr:resolve',
        data: response.currentTarget,
      })
      return response
    })
  }
  enable() {
    let settings = this.settings
    if(
      !this.enabled &&
      Object.keys(settings).length
    ) {
      if(settings.type) this._type = settings.type
      if(settings.url) this._url = settings.url
      if(settings.data) this._data = settings.data || null
      if(this.settings.responseType) this._responseType = this._settings.responseType
      this._enabled = true
    }
    return this
  }
  disable() {
    let settings = this.settings
    if(
      this.enabled &&
      Object.keys(settings).length
    ) {
      delete this._type
      delete this._url
      delete this._data
      delete this._headers
      delete this._responseType
      this._enabled = false
    }
    return this
  }
}
