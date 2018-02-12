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
    var currentEventIndex = Object.entries(currentEvents).map(function(currentEvent, currentEventIndex) {
      if(typeof callback === 'string' && callback === currentEvent[1].name) return currentEventIndex;
      if(typeof callback === 'function' && callback.name === currentEvent[1].name) return currentEventIndex;
    }.bind(this));
    for(var key = currentEventIndex.length; key > 0; key--) {
      currentEvents.splice(currentEventIndex[key], 1);
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
