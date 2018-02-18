class View extends Events {
  constructor(settings) {
    super();
    Object.assign(this, settings, { settings: settings });
    this.setElement();
    this.setEvents();
    if(typeof this.initialize === 'function') this.initialize();
  }
  setElement() {
    switch(typeof this.element) {
      case 'undefined': 
        this.element = document.createElement(this.elementName || 'div');
        break;
      case 'string': 
        this.element = document.querySelector(this.element); 
        break;
    }
    if(typeof this.attributes === 'object') this.setElementAttributes(this.element, this.attributes);
  }
  setElementAttributes(element, attributes) {
    for(var attribute in attributes) {
      element.setAttribute(attribute, attributes[attribute]);
    }
  }
  setEvents() {
    this.on('render', this.setElements.bind(this));
  }
  setElements() {
    this.elements = this.elements || {};
    Object.entries(this.elements).forEach(function(element) {
      this.elements[element[0]] = this.element.querySelectorAll(element[1]);
    }.bind(this));
    this.bindEvents(this.elements, this.elementEvents);
  }
  render(data) {
    this.element.innerHTML = '';
    if(typeof this.template === 'function') this.element.append(this.template(data || {}));
    this.trigger('render', this);
    return this;
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
          targets[eventKey].forEach(function(target) {
            target.addEventListener(eventName, function(event) {
              callback(event);
              this.trigger(triggerEventName, this);
            }.bind(this));
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }
}
