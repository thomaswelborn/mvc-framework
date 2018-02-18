/*
Test 5
-----
Model data is array containing nested objects: 
 - Automatically generate Model for each nested object,
 - "Get" function parses array of Model objects as plain objects. 
 - Recognize instances of Model.
 - Trigger "set" events for both Model.data array and object changes. 
 - Always use "set" and "setAll" to define Model.data.
 - Always use "get" to retrieve Model.data definition. 
 - SetAll function complete replaces existing Model.data. 
 
*/
document.addEventListener('DOMContentLoaded', function(event) {
  
  // Model.data array of objects become Model instances. 
  var model = new Model({
    data: [{ id: 1 },{ id: 2 },{ id: 3 },{ id: 4 },{ id: 5 }]
  });
  console.log('model', model.get());
  console.log('model', model.parse());
  
  // Model.data array can only contain plain objects or Model objects
  var model2 = new Model({
    data: [0,1,2,3,4,5]
  });
  // console.log('model2', model2.get());
  
  // Model.data arrays may contain Model instances. 
  var model3 = new Model({
    data: [{ id: 1 }, new Model({ data: { id: 2 } }), { id: 3 }]
  });
  // console.log('model3', model3.get());
  
  // Nested models will only be parsed when member of Model.data array
  var model4 = new Model({
    data: {
      'a': 'a',
      'b': 'b',
      'c': [1,2,3, new Model({ data: { id: 4 } })]
    }
  });
  // console.log('model4', model4.get());
  
  // Model.set function sets array index with Model instances. 
  // model.on('set', function(data) { console.log('data', data); }); 
  // model.set('id', 100);
  // console.log(model.get(1));
  // model.set(1, new Model({ data: {bark:'bark'} }));
  // model.set(1, { data: {bark:'bark'} });
  // console.log(model.get(1).get());
});
