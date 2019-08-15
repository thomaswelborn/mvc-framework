MVC.Events = class {
  constructor() {}
  get _events() {
    this.events = (this.events)
      ? this.events
      : {}
    return this.events
  }
  getEventCallbacks(eventName) { return this._events[eventName] || {} }
  getEventCallbackName(eventCallback) {
    return (eventCallback.name.length)
      ? eventCallback.name
      : 'anonymousFunction'
  }
  getEventCallbackGroup(eventCallbacks, eventCallbackName) {
    return eventCallbacks[eventCallbackName] || []
  }
  on(eventName, eventCallback) {
    let eventCallbacks = this.getEventCallbacks(eventName)
    let eventCallbackName = this.getEventCallbackName(eventCallback)
    let eventCallbackGroup = this.getEventCallbackGroup(eventCallbacks, eventCallbackName)
    eventCallbackGroup.push(eventCallback)
    eventCallbacks[eventCallbackName] = eventCallbackGroup
    this._events[eventName] = eventCallbacks
    return this
  }
  off() {
    switch(arguments.length) {
      case 0:
        delete this._events
        break
      case 1:
        var eventName = arguments[0]
        delete this._events[eventName]
        break
      case 2:
        var eventName = arguments[0]
        var eventCallback = arguments[1]
        var eventCallbackName = (typeof eventCallback === 'string')
          ? eventCallback
          : this.getEventCallbackName(eventCallback)
        delete this._events[eventName][eventCallbackName]
        if(
          Object.keys(this._events[eventName]).length === 0
        ) delete this._events[eventName]
        break
    }
  }
  emit(eventName, eventData) {
    let _arguments = Object.values(arguments)
    let eventCallbacks = Object.entries(
      this.getEventCallbacks(eventName)
    )
    for(let [eventCallbackGroupName, eventCallbackGroup] of eventCallbacks) {
      for(let eventCallback of eventCallbackGroup) {
        let additionalArguments = _arguments.splice(2) || []
        eventCallback(eventData, ...additionalArguments)
      }
    }
  }
}
