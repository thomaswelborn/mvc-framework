/*
Test 5
-----
Model data is array containing nested objects: 
 - Automatically generate Model for each nested object,
 - Get function parses array of Model objects as plain objects. 
*/
document.addEventListener('DOMContentLoaded', function(event) {
  
  // This should work as expected. 
  var model = new Model({
    data: [{ id: 1 },{ id: 2 },{ id: 3 },{ id: 4 },{ id: 5 }]
  });
  console.log('model', model.get());
  
  // This should not work as expected.
  // Array model data can only contain plain objects or Model objects
  var model2 = new Model({
    data: [0,1,2,3,4,5]
  });
  console.log('model2', model2.get());
  
  // This should work as expected
  var model3 = new Model({
    data: [{ id: 1 }, new Model({ data: { id: 2 } }), { id: 3 }]
  });
  console.log('model3', model3.get());
  
  // This should not work
  // Models will only be parsed when member of Model.data array
  var model4 = new Model({
    data: {
      'a': 'a',
      'b': 'b',
      'c': [1,2,3, new Model({ data: { id: 4 } })]
    }
  });
  console.log('model4', model4.get());
  
  // This will return Model data array index 1
  console.log('model.get(1)', model.get(1).get());
  model.on('set', function(data) { console.log('data', data); }); 
  model.get(1).set('id', 100);
  model.set(1, new Model({ data: { id: 1000 } }));
  console.log(model.get(1))
});
