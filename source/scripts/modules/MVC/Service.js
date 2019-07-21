MVC.Service = class extends MVC.Base {
  constructor() {
    super(...arguments)
    this.addSettings()
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
  addSettings() {
    if(Object.keys(this._settings).length) {
      if(this._settings.type) this._type = this._settings.type
      if(this._settings.url) this._url = this._settings.url
      if(this._settings.data) this._data = this._settings.data || null
      if(this._settings.headers) this._headers = this._settings.headers || [this._defaults.contentType]
      if(this._settings.responseType) this._responseType = this._settings.responseType
    }
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
