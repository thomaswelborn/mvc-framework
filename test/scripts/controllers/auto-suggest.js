AutoSuggest.Controllers.AutoSuggest = function(settings) {
  var $parentElement = settings.$parentElement || document.querySelector('body');
  var mainView = new View({
    elementName: 'div',
    attributes: {
      'data-view-id': 'auto-suggest'
    },
  });
  var queryStringController = AutoSuggest.Controllers.QueryString();
  var suggestionListController = AutoSuggest.Controllers.SuggestionList();
  var controller = new Controller(Object.assign(settings || {}, {
    $parentElement: $parentElement,
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
  }));
  controller.views.main.render();
  $parentElement.innerHTML = '';
  $parentElement.append(controller.views.main.element);
  return controller;
};
