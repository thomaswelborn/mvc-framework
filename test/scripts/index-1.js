var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

document.addEventListener('DOMContentLoaded', function(event) {
  var view = new View({
    elementName: 'div',
    attributes: {
      'data-view-id': 'main'
    },
    uiElements: {
      '$container': '.container'
    },
    uiEvents: {
      '@$container click': 'onContainerClick'
    },
    template: function(data) {
      var template = new Array(
        '<div class="container">',
          '<span>', 'It\'s some container text.', '</span>',
        '</div>'
      ).join('');
      return document.createRange().createContextualFragment(template);
    },
    onContainerClick: function(event) {
      console.log('event', event);
    },
  });
  view.on('ui:event', function(event) {
    console.log(event.data);
  });
  $('#application').append(view.render().element);
});
