document.addEventListener('DOMContentLoaded', function(event) {
  var subView = new View({
    name: 'sub-view',
    elementName: 'div',
    attributes: {
      'data-id': 'sub-view'
    },
  });
  var view = new View({
    elementName: 'div',
    attributes: {
      'data-id': 'sub-view'
    },
    elements: {
      'fieldset': 'div.fieldset',
      'input': 'input[type="text"]',
    },
    elementEvents: {
      '@input focus,blur': 'inputFocusBlur'
    },
    template: function() {
      var template = Array(
        '<div class="fieldset">',
          '<input type="text">',
        '</div>'
      ).join('');
      return document.createRange().createContextualFragment(template);
    },
    inputFocusBlur: function(event) { console.log('inputFocusBlur'); },
  });
  var bodyView = new View({
    element: document.querySelector('body'),
  });
  view.on('render', function onRender(event) { console.log('render'); });
  view.on('view:event', function() { console.log('view:event'); });
  bodyView.element.prepend(view.render().element);
  var model = new Model({
    data: {
      a: 1,
      b: 2,
      c: { d: 3 },
      e: [ {e: 4}, {f: 5}]
    },
  });
  model.on('set', function(data) { console.log('model', 'set', data); });
  model.on('set:c', function(data) { console.log('model', 'set:c', data); });
  model.set('c', {e: 3});
  model.set('b', 35);
  
  var controller = new Controller({
    views: {
      main: view,
      subView: subView,
    },
    viewEvents: {
      '@main view:event': function(event) { console.log('controller view:event'); }
    },
    models: {
      main: model,
    },
    modelEvents: {
      '@main set': 'mainSet',
      '@main set:a': 'mainSet'
    },
    mainSet: function(data) {
      console.log('controller', 'main model', 'set', data);
    },
    initialize: function() {
      console.log('controller, intialize');
    },
  });
  
  model.set('a', 100);
});
