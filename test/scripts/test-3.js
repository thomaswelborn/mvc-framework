/*
Test 3
-----

*/
document.addEventListener('DOMContentLoaded', function(event) {
  var controller = function(settings) {
    return new Controller({
      settings: settings || {},
      models: {
        main1: new Model({ data: { a: 10 } }),
        main2: new Model({ data: { a: 20 } }),
      },
      views: {
        main1: new View({
          uiElements: {
            'input': 'input[type="text"]'
          },
          uiEvents: {
            '@input focus': 'inputFocus'
          },
          template: function() {
            var template = Array(
              '<div>', '<input type="text">', '</div>'
            ).join('');
            return document.createRange().createContextualFragment(template);
          },
          inputFocus: function(event) { console.log('event', event); },
        }),
      },
      modelEvents: {
        '@main1,@main2 change': 'mainChange',
      },
      viewEvents: {
        '@main1 ui:event': 'mainUIEvent',
      },
      mainChange: function(event) { console.log('input', event); },
      mainUIEvent: function(event) { console.log('ui:event', event); },
      initialize: function() {
        this.models.main1.set('a', 20);
        this.models.main2.set('a', 30);
        document.querySelector('body').prepend(this.views.main1.render().element);
      },
    })
  };
  var router = new Router({
    routes: {
      '/': 'index',
      '/barnacle': 'barnacle'
    },
    controllers: {
      'index': controller,
      'barnacle': function(event) {
        console.log(event);
      }
    },
  });
});


