MVC.Events = class {
  constructor() {}
  get events() {
    this._events = (this._events)
      ? this._events
      : {}
    return this._events
  }
  event(eventName) {
    this.events[eventName] = (this.events[eventName])
      ? this.events[eventName]
      : {}
    return this.events[eventName]
  }
  on(eventName, eventCallback) {
    let event = this.event(eventName)
    let eventCallbackName = eventCallback.constructor.name
    event[eventCallbackName] = (event[eventCallbackName])
      ? event[eventCallbackName]
      : []
    event[eventCallbackName].push(eventCallback)
  }
  off(eventName, eventCallback) {
    let event = this.event(eventName)
    if(eventCallback) {
      let eventCallbackName = eventCallback.constructor.name
      delete this.events[eventName][eventCallbackName]
    } else {
      delete this.events[eventName]
    }
  }
  emit(eventName, eventData) {
    let event = this.event(eventName)
    for(let [callbackName, callbacks] of Object.entries(event)) {
      for(let callback of callbacks) {
        callback(eventData)
      }
    }
  }
}
