AutoSuggest.Controllers.SuggestionList = function(settings) {
  var mainUIModel = new Model();
  var mainDataModel = new Model();
  var mainView = new View();
  return new Controller(Object.assign(settings || {}, {
    models: {
      'ui': mainUIModel,
      'data': mainDataModel,
    },
    views: {
      'main': mainView,
    },
    modelEvents: {},
    viewEvents: {},
    onMainInputValueChange: function() {},
    onKeyboardArrowVertical: function() {},
  }));
};
