MVC.Events = class {
  constructor() {}
  get events() {
    this._events = (this._events)
      ? this._events
      : {}
    return this._events
  }
  set events(events) { this._events = events }
  get channels() {
    this._channels = (this._channels)
      ? this._channels
      : {}
    return this._channels
  }
  set channels(channels) { this._channels = channels }
  event(eventName) {
    this.events[eventName] = (this.events[eventName])
      ? this.events[eventName]
      : {}
    return this.events[eventName]
  }
  channel(channelName) {
    let channel = this.channel[channelName]
    channel = (channel)
      ? channel
      : Object.defineProperties(
        {},
        {
          request: {
            configurable: false,
            enumerable: true,
            value: (eventName, eventData) => {
              //
            },
            writable: false,
          },
          response: {
            configurable: false,
            enumerable: true,
            value: (eventName, eventCallback) => {
              //
            },
            writable: false,
          },
          off: {
            configurable: false,
            enumerable: true,
            value: (eventName, eventCallback) => {
              //
            },
            writable: false,
          }
        }
      )
    return channel
  }
  on(eventName, eventCallback) {
    let event = this.event(eventName)
    let eventCallbackName = eventCallback.prototype.constructor.name
    event[eventCallbackName] = (event[eventCallbackName])
      ? event[eventCallbackName]
      : []
    event[eventCallbackName].push(eventCallback)
  }
  off(eventName, eventCallback) {
    let event = this.event(eventName)
    if(eventCallback) {
      let eventCallbackName = eventCallback.prototype.constructor.name
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
