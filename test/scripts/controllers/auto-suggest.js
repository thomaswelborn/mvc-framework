AutoSuggest.Controllers.AutoSuggest = function(settings) {
  var $parentElement = settings.$parentElement || document.querySelector('body');
  var view = new View({
    elementName: 'div',
    attributes: {
      'data-view-id': 'auto-suggest'
    },
  });
  view.render();
  var queryStringController = AutoSuggest.Controllers.QueryString();
  var suggestionListController = AutoSuggest.Controllers.SuggestionList();
  var controller = new Controller(Object.assign(settings || {}, {
    $parentElement: $parentElement,
    views: {
      'main': view,
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
  $parentElement.innerHTML = '';
  $parentElement.append(controller.views.main.element);
  controller.views.main.element.append(
    queryStringController.views.main.element,
    suggestionListController.views.main.element
  );
  return controller;
};
