MVC.AJAX = class {
  constructor(type, url, settings) {
    this.responseTypes = ['', 'arraybuffer', 'blob', 'document', 'json', 'text'];
    this.defaultContentType = {'Content-Type': 'application/json'};
    this.defaultResponseType = 'json';
    this.type = type;
    this.url = url;
    this.settings = settings || {};
    this.data = this.settings.data || null;
    return new Promise(function (resolve, reject) {
      this.xhr = new XMLHttpRequest();
      this.xhr.open(this.type, this.url);
      this.setResponseType(this.xhr, this.settings.responseType || this.defaultResponseType);
      this.setHeaders(this.xhr, this.settings.headers || [this.defaultContentType]);
      this.xhr.onload = resolve;
      this.xhr.onerror = reject;
      this.xhr.send(this.data);
    }.bind(this));
  }
  setResponseType(xhr, responseType) {
    xhr.responseType = this.responseTypes.find(function(responseTypeItem) {
      return responseTypeItem === responseType;
    }) || '';
  }
  setHeaders(xhr, headers) {
    headers.forEach(function(header) {
      xhr.setRequestHeader(Object.keys(header)[0], Object.values(header)[0]);
    });
  }
}
