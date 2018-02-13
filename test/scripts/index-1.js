/*
  Test 1
  -----
  + Model Class Event Binding
    - Model.data property edits trigger Model "change", "change:property" events.
  + View Class Event Binding
    - View.uiEvents callbacks bind to View.uiElement elements.
    - View.uiEvents trigger View "ui:event" events.
  + Controller Class Event Binding
    - Controller.viewEvents bind to Controller.views objects.
    - Controller.modelEvents bind to Controller.models objects.
    - Controller.controllerEvents bind to Controller.controllers objects. 
    - viewEvents, modelEvents, and controllerEvents trigger custom Controller events. 
*/
var $ = document.querySelectorAll.bind(document);

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
          '<span>', 'That\'s some container text.', '</span>',
        '</div>'
      ).join('');
      return document.createRange().createContextualFragment(template);
    },
    onContainerClick: function(event) {
      console.log('view', 'event', event);
    },
  });
  view.on('ui:event', function(event) {
    console.log('view', 'ui:event', event);
  });
  $('#application')[0].append(view.render().element);
});
