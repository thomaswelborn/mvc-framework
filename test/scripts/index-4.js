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
  });
  view.on('render', function onRender(event) { console.log('render'); });
  document.querySelector('body').prepend(view.render().element);
  
});
