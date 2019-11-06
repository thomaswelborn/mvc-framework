const Channel = class {
  constructor() {}
  get _responses() {
    this.responses = this.responses || this.responses
    return this.responses
  }
  response(responseName, responseCallback) {
    if(responseCallback) {
      this._responses[responseName] = responseCallback
    } else {
      return this._responses[response]
    }
  }
  request(responseName) {
    if(this._responses[responseName]) {
      let _arguments = Array.prototype.slice.call(arguments).slice(1)
      return this._responses[responseName](..._arguments)
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
export default Channel
