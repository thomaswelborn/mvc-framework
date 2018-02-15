document.addEventListener('DOMContentLoaded', function(event) {
  var controller = new Controller({
    models: {
      main1: new Model({ data: { a: 10 } }),
      main2: new Model({ data: { a: 20 } }),
    },
    modelEvents: {
      '@main1,@main2 change': 'mainChange',
    },
    mainChange: function(event) { console.log(event); }
  });
  /*
  controller.models.main1.set('a', 20);
  controller.models.main2.set('a', 30);
  */
  console.log(controller);
  
});


