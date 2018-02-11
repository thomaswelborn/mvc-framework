AutoSuggest.Templates.QueryString = function(data) {
  var template = Array(
    '<input type="text">',
    '<input type="submit" value="Query">'
  ).join('');
  return document.createRange().createContextualFragment(template);
};
