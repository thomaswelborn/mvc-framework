/*
  Test 1
  -----
  1. Model Class Event Binding
    a. Model.data setters trigger Model "change", "change:property" events.
  2. View Class Event Binding
    a. View.uiEvents callbacks bind to View.uiElements elements.
    b. View.uiEvents trigger View "ui:event" events.
  3. Controller Class Event Binding
    a. Controller.viewEvents bind to Controller.views objects. 
    b. Controller.modelEvents bind to Controller.models objects. 
    c. Controller.controllerEvents bind to Controller.controllers objects. 
    d. Controller.controllerEvents trigger Controller 'controller:event' events. 
*/
var $ = document.querySelectorAll.bind(document);

document.addEventListener('DOMContentLoaded', function(event) {
  var model = new Model({
    name: 'main',
    data: {
      a: 1,
      b: 2,
    },
  });
  model.on('change:a', function(event) {
    console.log('model', 'change:a', event);
  });
  model.set('a', 2);
  model.on('change', function(event) {
    console.log('model', 'change', event);
  });
  model.set('b', 3);
  var view = new View({
    name: 'main',
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
      console.log('view', 'onContainerClick', event);
    },
  });
  view.on('ui:event', function(event) {
    console.log('view', 'ui:event', event);
  });
  var controller = new Controller({
    models: { main: model },
    modelEvents: { '@main change': 'onMainModelChange' },
    views: { main: view },
    viewEvents: { '@main ui:event': 'onMainUIEvent' },
    onMainModelChange: function(event) {
      console.log('controller', 'onMainModelChange', event);
    },
    onMainUIEvent: function(event) {
      console.log('controller', 'onMainUIEvent', event);
    },
  });
  controller.models.main.set('a', 5);
  $('#application')[0].append(view.render().element);
  view.ui.$container[0].dispatchEvent(new Event('click'));
});
