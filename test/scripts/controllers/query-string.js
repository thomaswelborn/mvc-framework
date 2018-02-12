AutoSuggest.Controllers.QueryString = function(settings) {
  var uiModel = new Model({
    name: 'ui-query-string',
    data: {
      focus: false,
      show: true,
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
      'data-view-id': 'query-string'
    },
    uiElements: {
      'input': 'input[type="text"]',
      'submit': 'input[type="submit"]',
    },
    uiEvents: {
      '@input focus': 'onInputFocus',
      '@input blur': 'onInputBlur',
      '@input keyup': 'onInputKeyUp',
    },
    template: AutoSuggest.Templates.QueryString,
    onInputKeyUp: function(event) {},
    onInputFocus: function(event) {},
    onInputBlur: function(event) {},
  });
  return new Controller(Object.assign(settings || {}, {
    models: {
      'ui': uiModel,
      'data': dataModel,
    },
    views: {
      'main': view,
    },
    viewEvents: {
      '@main input:focus': 'onMainInputFocus',
      '@main input:blur': 'onMainInputBlur',
      '@main input:value:change': 'onMainInputvalueChange',
      '@main input:arrow:vertical': 'onMainInputArrowVertical',
    },
    onMainInputValueChange: function() {},
    onMainInputArrowVertical: function() {},
    onMainInputFocus: function() {},
    onMainInputBlur: function() {},
  }));
};
