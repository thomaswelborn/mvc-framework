AutoSuggest.Controllers.AutoSuggest = function(settings) {
  var mainUIModel = new Model();
  var mainDataModel = new Model();
  var mainView = new View();
  var queryStringController = AutoSuggest.Controllers.QueryString();
  var suggestionListController = AutoSuggest.Controllers.SuggestionList();
  
  return new Controller(Object.assign(settings || {}, {
    models: {
      'mainUI': mainUIModel,
      'mainData': mainDataModel,
    },
    views: {
      'main': mainView,
    },
    controllers: {
      'queryString': queryStringController,
      'suggestionList': suggestionListController,
    },
    controllerEvents: {
      '@queryString change:value': 'onQueryStringChangeValue',
      '@suggestionList change:index': 'onSuggestionListChangeIndex',
    },
    onQueryStringChangeValue: function() {},
    onSuggestionListChangeIndex: function() {},
  });
};
