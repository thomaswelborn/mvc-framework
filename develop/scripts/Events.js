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
    var currentEventIndex = currentEvents.indexOf(callback);
    if(currentEventIndex >= 0) currentEvents.splice(currentEventIndex, 1);
  }
  trigger(eventName, data) {
    this.events[eventName].forEach(function(callback) {
      try {
        callback(data);
      } catch(error) {}
    });
  }
}