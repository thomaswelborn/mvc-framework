MVC.View = class extends Events() {
  constructor() {
    super()
  }
  get elementName() { return this.element.tagName }
  set elementName(data) {
    if(!this.element) this.element = document.createElement(data)
  }
  get element() { return this._element }
  set element(data) {
    let element
    if(data instanceof HTMLElement) {
      element = data
    } else if(typeof data === 'string') {
      element = document.querySelector(data)
    }
    this._element = element
  }
  get ui() { return this._ui }
  set ui(data) {
    let ui = {}
    for(let [key, value] of data) {
      switch(key) {
        case '@':
          ui[key] = this.element
          break
        default:
          ui[key] = this.element.querySelectorAll(value)
          break;
      }
    }
    this._ui = ui
  }
  get events() { return this._events }
  set events(data) {
    for(let [key, value] of data) {
      let eventData = key.split[' ']
      let eventTarget = this[
        eventData[0].replace('@', '')
      ]
      let eventName = eventData[1]
      let eventCallback = this[
        value.replace('@', '')
      ]
      eventTarget.on(eventName, eventCallback)
    }
  }
  get callbacks() { return this._callbacks }
  set callbacks(data) { this._callbacks = data }
  get emitters() { return this._emitters }
  set emitters(data) { this._emitters = data }
}
