Resume.Templates.Experience = function(data) {
  var template = Array(
    '<div data-class=fieldset data-id=experience>',
      '<div data-class=fieldset-label>Experience</div>',
      '<div data-class=field>',
        '<input type=text data-id=experience-label>',
      '</div>',
      '<div data-class=field>',
        '<label>Employer Name</label>',
        '<input type=text data-class=experience-employer>',
      '</div>',
      '<div data-class=field>',
        '<label>Job Title</label>',
        '<input type=text data-class=experience-title>',
      '</div>',
      '<div data-class=field>',
        '<label>Start Month/Year</label>',
        '<input type=text data-class=experience-start>',
      '</div>',
      '<div data-class=field>',
        '<label>End Month/Year</label>',
        '<input type=text data-class=experience-stop>',
      '</div>',
    '</div>'
  ).join('');
  return document.createRange().createContextualFragment(template);
};
