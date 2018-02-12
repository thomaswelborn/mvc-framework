AutoSuggest.Templates.QueryString = function(data) {
  var template = Array.prototype.concat(
    '<input type="text">',
    '<input type="submit" value="Query">'
  ).join('');
  return document.createRange().createContextualFragment(template);
};
