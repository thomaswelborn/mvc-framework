MVC.Channels.Channel = class {
  constructor() {}
  get _responses() {
    this.responses = (this.responses)
      ? this.responses
      : {}
    return this.responses
  }
  response(responseName, responseCallback) {
    if(responseCallback) {
      this._responses[responseName] = responseCallback
    } else {
      return this._responses[response]
    }
  }
  request(responseName, requestData) {
    if(this._responses[responseName]) {
      return this._responses[responseName](requestData)
    }
  }
  off(responseName) {
    if(responseName) {
      delete this._responses[responseName]
    } else {
      for(let [responseName] of Object.keys(this._responses)) {
        delete this._responses[responseName]
      }
    }
  }
}
