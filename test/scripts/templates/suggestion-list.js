AutoSuggest.Templates.SuggestionList = function(data) {
  var template = Array(
    '<ul>',
    '</ul>'
  ).join('');
  return document.createRange().createContextualFragment(template);
};
