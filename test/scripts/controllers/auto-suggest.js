AutoSuggest.Controllers.AutoSuggest = function(settings) {
  var queryString = AutoSuggest.Controllers.QueryString();
  var suggestionList = AutoSuggest.Controllers.SuggestionList();
  
  var uiModel = new Model({
    name: 'auto-suggest',
    data: {}
  });
  
  var view = new View({
    elementName: 'div',
    attributes: {
      'data-view-id': 'auto-suggest'
    },
  });
  view.render().element.append(
    queryString.view.render().element, 
    suggestionList.view.render().element
  );

  var $parentElement = settings.$parentElement;
  $parentElement.prepend(view.element);
  
  var controller = Object.assign(settings || {}, {
    view: view,
    queryString: queryString,
    suggestionList: suggestionList,
  });
  
  return controller;
};
