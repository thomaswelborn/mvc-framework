class View extends Events {
  constructor(settings) {
    super();
    Object.assign(this, settings, { settings: settings });
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
    this.on('render', this.setUIElements.bind(this));
  }
  setUIElements() {
    this.ui = this.ui || {};
    Object.entries(this.uiElements).forEach(function(element) {
      this.ui[element[0]] = this.element.querySelectorAll(element[1]);
    }.bind(this));
    this.bindEvents(this.ui, this.uiEvents);
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
