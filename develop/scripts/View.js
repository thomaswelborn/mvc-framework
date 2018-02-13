class View extends Events {
  constructor(settings) {
    super();
    this.settings = settings || {};
    for(var setting in this.settings) {
      this[setting] = this.settings[setting];
    }
    this.setElement();
    this.setEvents();
    try {
      this.initialize();
    } catch(error) {}
  }
  setElement() {
    if(typeof this.element === 'undefined') {
      this.element = document.createElement(this.elementName || 'div');
    } else if(typeof this.element === 'string') {
      this.element = document.querySelector(this.element); 
    }
    if(typeof this.attributes === 'object') this.setElementAttributes(this.element, this.attributes);
  }
  setElementAttributes(element, attributes) {
    for(var attribute in attributes) {
      element.setAttribute(attribute, attributes[attribute]);
    }
  }
  setEvents() {
    this.on('render', function() {
      this.setUIElements();
      this.setUIEvents();
    }.bind(this));
  }
  setUIElements() {
    this.ui = this.ui || {};
    if(typeof this.uiElements === 'object') {
      Object.entries(this.uiElements).forEach(function(element) {
        this.ui[element[0]] = this.element.querySelectorAll(element[1]);
      }.bind(this));
    }
  }
  setUIEvents() {
    if(typeof this.uiEvents === 'object') {
      Object.entries(this.uiEvents).forEach(function(uiEvent) {
        var uiEventKey = uiEvent[0].split(' ');
        var elementSelectors = uiEventKey[0].split(',');
        var elementActions = uiEventKey[1].split(',');
        elementSelectors.forEach(function(selector) {
          this.setUIEvent(selector, elementActions, uiEvent);
        }.bind(this));
      }.bind(this));
    }
  }
  setUIEvent(selector, elementActions, uiEvent) {
    var element;
    element = (selector.match('@')) ? this.ui[selector.replace('@', '')] : this.element.querySelectorAll(selector);
    element.forEach(function(elementInstance) {
      var elementCallback = (typeof uiEvent[1] === 'function') ? uiEvent[1].bind(this) : this[uiEvent[1]].bind(this);
      elementActions.forEach(function(elementAction) {
        elementInstance.addEventListener(elementAction, function(event) {
          elementCallback(event);
          this.trigger('ui:event', Object.assign(event, { data: this }));
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }
  render(data) {
    if(typeof this.template !== 'undefined') {
      this.element.innerHTML = '';
      this.element.append(this.template(data || {}));
    }
    this.trigger('render', this);
    return this;
  }
}
