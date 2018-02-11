AutoSuggest.Controllers.SuggestionList = function(settings) {
  var template = AutoSuggest.Templates.SuggestionList;
  var model = AutoSuggest.Models.SuggestionList({
    name: 'suggestion-list',
    baseURL: 'https://api.datamuse/sug',
    data: {
      queryString: '',
      index: 0,
      focus: false,
      hide: true,
      results: [],
    },
  });
  var view = new View({
    elementName: 'div',
    attributes: {
      'data-view-id': model.get('name'),
      'focus': model.get('focus'),
      'hide': model.get('hide'),
    },
    model: model,
    template: template,
    uiElements: {
      '$suggestions': 'ul',
      '$suggestionItems': 'li',
    },
    uiEvents: {},
  });
  var controller = {
    view: view,
    model: model,
    template: template
  };
  return controller;
};
