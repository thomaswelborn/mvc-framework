MVC.Events = class {
  constructor() {
    this.events = {}
  }
  on(eventName, callback) {
    this.events[eventName] = this.events[eventName] || []
    this.events[eventName].push(callback)
  }
  off(eventName, callback) {
    var currentEvents = this.events[eventName]
    if(
      typeof currentEvents === 'undefined' ||
      currentEvents.length === 0
    ) return
    var currentEventIndices = Object.entries(currentEvents)
      .filter((currentEvent, currentEventIndex) => {
        return (
          (typeof callback === 'string' && callback === currentEvent[1].name) ||
          (typeof callback === 'function' && callback.name === currentEvent[1].name)
        )
      })
    for(var key = currentEventIndices.length; key > 0; key--) {
      currentEvents.splice(currentEventIndices[key - 1][0], 1)
    }
    if(currentEvents.length === 0) delete this.events[eventName]
  }
  emit(eventName, data) {
    try {
      this.events[eventName].forEach(function(callback) {
        callback(data)
      })
    } catch(error) {}
  }
}
