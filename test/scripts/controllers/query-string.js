AutoSuggest.Controllers.QueryString = function(settings) {
  var template = AutoSuggest.Templates.QueryString;
  var uiModel = new Model({
    name: 'ui-query-string',
    data: {
      focus: false,
      visibility: true
    },
  });
  var dataModel = new Model({
    name: 'data-query-string',
    data: {
      value: '',
    }
  });
  var view = new View({
    elementName: 'div',
    attributes: {
      'data-view-id': 'query-string',
    },
    template: template,
    uiElements: {
      '$input': 'input[type="text"]',
      '$submit': 'input[type="submit"]',
    },
    uiEvents: {
      '@$input focus': 'onInputFocus',
      '@$input blur': 'onInputBlur',
      '@$input keyup': 'onInput',
      '@$submit click': 'onSubmitClick',
    },
    onInput: function(event) {
      switch(event.keyCode) {
        // Enter
        case 13: 
          this.trigger('onInputEnter', Object.assign(event, { data: this }));
          break;
        // Escape
        case 27:
          this.trigger('onInputEscape', Object.assign(event, { data: this }));
          break;
        // Arrow Up/Down
        case 38:
        case 40:
          this.trigger('onInputArrowVertical', Object.assign(event, { data: this }));
          break;
        // Default
        default:
          this.trigger('onInputCharacter', Object.assign(event, { data: this }));
          break;
      }
    },
    onInputFocus: function(event) {
      this.trigger('onInputFocus', Object.assign(event, { data: this }));
    },
    onInputBlur: function(event) {
      this.trigger('onInputBlur', Object.assign(event, { data: this }));
    },
    onSubmitClick: function(event) {
      this.trigger('onSubmitClick', Object.assign(event, { data: this }));
    },
  });
  
  var controller = {
    view: view,
    models: {
      data: dataModel,
      ui: uiModel,
    },
  };
  return controller;
};
