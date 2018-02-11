AutoSuggest.Templates.QueryString = function(data, view) {
  var template = Array(
    '<input type="text">',
    '<input type="submit" value="Submit">'
  ).join('');
  return document.createRange().createContextualFragment(template);
};
