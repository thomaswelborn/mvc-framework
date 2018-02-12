AutoSuggest.Controllers.SuggestionList = function(settings) {
  var uiModel = new Model();
  var dataModel = new Model();
  var view = new View({
    elementName: 'div',
    attributes: {
      'data-view-id': 'suggestion-list',
    },
    template: AutoSuggest.Templates.SuggestionList,
  });
  view.render();
  return new Controller(Object.assign(settings || {}, {
    models: {
      'ui': uiModel,
      'data': dataModel,
    },
    views: {
      'main': view,
    },
    modelEvents: {},
    viewEvents: {},
    onMainInputValueChange: function() {},
    onKeyboardArrowVertical: function() {},
  }));
};
