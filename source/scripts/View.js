MVC.View = class extends MVC.Events {
  constructor() {
    super()
  }
  get _elementName() { return this._element.tagName }
  set _elementName(elementName) {
    if(!this._element) this._element = document.createElement(elementName)
  }
  get _element() { return this.element }
  set _element(element) {
    if(element instanceof HTMLElement) {
      this.element = element
    } else if(typeof element === 'string') {
      this.element = document.querySelector(element)
    }
  }
  get _attributes() { return this.attributes || {} }
  set _attributes(attributes) {
    for(let [attributeKey, attributeValue] of Object.entries(attributes)) {
      this._element.setAttribute(attributeKey, attributeValue)
    }
    this.attributes = this._element.attributes
  }
  get _ui() { return this.ui || {} }
  set _ui(ui) {
    for(let [key, value] of ui) {
      switch(key) {
        case '@':
          this.ui[key] = this.element
          break
        default:
          this.ui[key] = this.element.querySelectorAll(value)
          break;
      }
    }
    this.ui = ui
  }
  get _events() { return this.events || {} }
  set _events(events) {
    for(let [eventKey, eventValue] of events) {
      let eventData = eventKey.split[' ']
      let eventTarget = this[
        eventData[0].replace('@', '')
      ]
      let eventName = eventData[1]
      let eventCallback = this[
        eventValue.replace('@', '')
      ]
      eventTarget.on(eventName, eventCallback)
    }
  }
  get _callbacks() { return this.callbacks || {} }
  set _callbacks(callbacks) { this.callbacks = callbacks }
  get _emitters() { return this.emitters || {} }
  set _emitters(emitters) { this.emitters = emitters }
}
