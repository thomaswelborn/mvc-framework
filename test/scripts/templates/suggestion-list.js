AutoSuggest.Templates.SuggestionList = function(data) {
  var template = Array.prototype.concat(
    '<ul>',
    '</ul>'
  ).join('');
  return document.createRange().createContextualFragment(template);
};
