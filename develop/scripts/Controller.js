class Controller extends Events {
  constructor(settings) {
    super();
    this.settings = settings;
    for(var key in this.settings) {
      this[key] = this.settings[key];
    }
    if(
      typeof this.views !== 'undefined' && 
      typeof this.viewEvents !== 'undefined'
    ) this.bindEvents(this.views, this.viewEvents);
    if(
      typeof this.models !== 'undefined' && 
      typeof this.modelEvents !== 'undefined'
    ) this.bindEvents(this.models, this.modelEvents);
  }
  bindEvents(target, events) {
    Object.entries(events).forEach(function(event) {
      event[0] = event[0].split(' ');
      var element = event[0][0].replace('@', '');
      var elementEvent = event[0][1];
      var elementEventCallback = event[1];
      target[element].on(elementEvent, this[elementEventCallback]);
    }.bind(this));
  }
}
