var sampleData = {
  name: 'Some Name',
  entries: [1,2,3,4,5],
  obj: {
    a: 1,
    b: 2,
    c: 3
  }
};
var sampleTemplate = function(data) {
  var template = Array(
    '<div class="template">',
      '<div class="name">',
        data.name,
      '</div>',
      '<div class="entries">',
        data.entries.map(function(element){
          return '<span class="entry">Entry: ' + element + '</span>';
        }).join(''),
      '</div>',
      '<div class="obj">',
        Object.entries(data.obj).map(function(element) {
          return '<span>' + element[0] + ': ' + element[1] + '</span>';
        }).join(''),
      '</div>',
    '</div>'
  ).join('');
  return document.createRange().createContextualFragment(template);
};

var htmlFragment = sampleTemplate(sampleData);