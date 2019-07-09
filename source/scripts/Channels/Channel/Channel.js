MVC.Channels.Channel = class {
  constructor() {}
  get responses() {
    this._responses = (this._responses)
      ? this._responses
      : {}
    return this._responses
  }
  response(responseName, responseCallback) {
    if(responseCallback) {
      this.responses[responseName] = responseCallback
    } else {
      return this.responses[response]
    }
  }
  request(responseName, requestData) {
    if(this.responses[responseName]) {
      return this.responses[responseName](requestData)
    }
  }
  off(responseName) {
    if(responseName) {
      delete this.responses[responseName]
    } else {
      for(let [responseName] of Object.keys(this.responses)) {
        delete this.responses[responseName]
      }
    }
  }
}
