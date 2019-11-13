import Base from '../Base/index'

class Service extends Base {
  constructor() {
    super(...arguments)
  }
  get classDefaultProperties() { return [
    'responseType',
    'type',
    'url',
    'headers',
    'data'
  ] }
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
  request() {
    return new Promise((resolve, reject) => {
      if(this._xhr.status === 200) this._xhr.abort()
      this._xhr.open(this.type, this.url)
      this._headers = this.settings.headers || [this._defaults.contentType]
      this._xhr.onload = resolve
      this._xhr.onerror = reject
      this._xhr.send(this.data)
    }).then((response) => {
      this.emit(
        'xhrResolve', {
          name: 'xhrResolve',
          data: response.currentTarget,
        },
        this
      )
      return response
    }).catch((error) => { throw error })
  }
}
export default Service
