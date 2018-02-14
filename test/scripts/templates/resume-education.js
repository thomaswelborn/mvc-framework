Resume.Templates.Education = function() {
  var template = Array(
    '<div data-class=fieldset data-id=education>',
      '<div data-class=fieldset-label>Education</div>',
      '<div data-class=field>',
        '<label>Institution</label>',
        '<input type=text data-class=education-institution>',
      '</div>',
      '<div data-class=field>',
        '<label>Degree</label>',
        '<input type=text data-class=education-degree>',
      '</div>',
      '<div data-class=field>',
        '<label>Graduation Year</label>',
        '<input type=text data-class=education-graduation-year>',
      '</div>',
    '</div>'
  ).join('');
  return document.createRange().createContextualFragment(template);
};
