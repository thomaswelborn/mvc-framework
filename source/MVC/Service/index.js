import Base from '../Base/index'

class Service extends Base {
  constructor() {
    super(...arguments)
  }
  get classDefaultProperties() { return [
    'responseType',
    'type',
    'parameters',
    'url',
    'headers',
    'data'
  ] }
  get _defaults() { return this.defaults || {
    contentType: {'Content-Type': 'application/json'},
    responseType: 'json',
  } }
  get _async() {
    this.async = this.async || true
    return this.async
  }
  set _async(async) { this.async = async }
  get _responseTypes() { return ['', 'arraybuffer', 'blob', 'document', 'json', 'text'] }
  get _responseType() { return this.responseType }
  set _responseType(responseType) {
    this._xhr.responseType = this._responseTypes.find(
      (responseTypeItem) => responseTypeItem === responseType
    ) || this._defaults.responseType
  }
  get _type() {
    this.type = this.type || true
    return this.type
  }
  set _type(type) { this.type = type }
  get _parameters() {
    this.parameters = this.parameters || {}
    return this.parameters
  }
  set _parameters(parameters) { this.parameters = parameters }
  get _url() { return this.url }
  set _url(url) { this.url = url }
  get _headers() {
    this.headers = this.headers || [this._defaults.contentType]
    return this.headers
  }
  set _headers(headers) { this.headers = headers }
  get _data() {
    this.data = this.data || {}
    return this.data
  }
  set _data(data) { this.data = data }
  get _xhr() {
    this.xhr = (this.xhr)
      ? this.xhr
      : new XMLHttpRequest()
    return this.xhr
  }
  stringParameters() {
    let parameters = Object.entries(this._parameters)
    return (parameters.length)
      ? parameters
        .reduce(
          (
            parameterString,
            [parameterKey, parameterValue],
            parameterIndex
          ) => {
            let concatenator = (
              parameterIndex !== parameters.length - 1
            ) ? '&'
              : ''
            let assignmentOperator = '='
            parameterString = parameterString.concat(
              parameterKey,
              assignmentOperator,
              parameterValue,
              concatenator
            )
            return parameterString
          },
          '?'
        )
      : ''
  }
  request() {
    let type = this._type
    let url = (Object.keys(this._parameters).length)
      ? this._url.concat(
        this.stringParameters()
      )
      : this._url
    let async = this._async
    let xhr = this._xhr
    return new Promise((resolve, reject) => {
      xhr.onload = resolve
      xhr.onerror = reject
      xhr.open(type, url, async)
      this._headers.forEach((header) => {
        header = Object.entries(header)[0]
        xhr.setRequestHeader(header[0], header[1])
      })
      if(Object.keys(this._data).length) {
        xhr.send(this._data)
      } else {
        xhr.send()
      }
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
