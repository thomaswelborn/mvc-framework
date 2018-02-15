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
      }.bind(this));
    } catch(error) {}
  }
  bindEvents(targets, events) {
    Object.entries(events).forEach(function(event) {
      event[0] = event[0].split(' ');
      var eventKeys = event[0][0].split(',');
      var eventNames = event[0][1].split(',');
      var callback = event[1];
      Object.entries(eventKeys).forEach(function(eventKey) {
        eventKey = eventKey[1].replace('@', '');
        Object.entries(eventNames).forEach(function(eventName) {
          eventName = eventName[1]; 
          callback = (typeof callback === 'function') ? callback : this[callback];
          var triggerEventName = String.prototype.concat(this.constructor.name.toLowerCase(), ':', 'event');
          var eventListenerName = (typeof targets[eventKey].on !== 'undefined') ? 'on' : 'addEventListener';
          try {
            targets[eventKey][eventListenerName](eventName, function(event) {
              callback(event);
              this.trigger(triggerEventName, Object.assign(event, { data: this }));
            }.bind(this));
          } catch(error) {}
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }
}
