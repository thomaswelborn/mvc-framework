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
});
