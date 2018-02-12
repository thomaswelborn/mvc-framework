class Events {
  constructor() {
    this.events = {};
  }
  on(eventName, callback) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(callback);
  }
  off(eventName, callback) {
    var currentEvents = this.events[eventName];
    if(typeof currentEvents === 'undefined' || currentEvents.length === 0) return;
    var currentEventIndices = Object.entries(currentEvents).map(function(currentEvent, currentEventIndex) {
      if(
        (typeof callback === 'string' && callback === currentEvent[1].name) || 
        (typeof callback === 'function' && callback.name === currentEvent[1].name)
      ) return currentEventIndex;
    }.bind(this));
    for(var key = currentEventIndices.length; key > 0; key--) {
      currentEvents.splice(currentEventIndices[key - 1], 1);
    }
  }
  trigger(eventName, data) {
    try {
      this.events[eventName].forEach(function(callback) {
          callback(data);
      });
    } catch(error) {}
  }
}
