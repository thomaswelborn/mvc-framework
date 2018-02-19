# MVC Framework
Plain/Vanilla JavaScript MVC Pattern - Model, View, Controller pattern with Pub/Sub Events, AJAX class, and URL Hash Router. 

Classes
 * **Events**
 * **Model**
 * **View**
 * **Controller**
 * **Router**
 * **AJAX**


## Events

Manages named events and callbacks. Extension class for Model, View, Controller, and Router classes. Implementation of pub/sub pattern. 


### Events.on

```Events.on(eventName, callback)```

 * eventName - String
 * callback - Function

```
var events = new Events();

// Inline function
events.on('some:event', function someEvent(data) { console.log(data); }

// External function
function someOtherEvent(data) { console.log(data); };
events.on('some:other:event', someOtherEvent);

// Localized function
class SomeClass extends Events {
  constructor() {
    super();
    this.on('yet:another:event', this.onYetAnotherEvent.bind(this));
  }
  onYetAnotherEvent: function(data) {
    console.log(data);
  }
}

var someClass = new SomeClass();
someClass.on('more:event', function moreEvent(data) { console.log(data); });

// 

```


### Events.off

```Events.off(eventName, callback)```

 * eventName - String
 * callback - Function, String

```
events.off('some:event', someEvent);

events.off('some:other:event', someOtherEvent);

someClass.off('yet:another:event', someClass.yetAnotherEvent);

someClass.off('more:event', 'moreEvent');
```

Events.off removes events based on their callback function name, which can be provided by the callback function itself or a string name of the function. 


### Events.trigger

```Events.trigger(eventName, data)```

 * eventName - String
 * data - Any
 
```
events.on('trigger:me', function(data) { console.log(data); });
events.trigger('trigger:me', { name: 'trigger-test' });
// { name: 'trigger-test' }

events.on('another:trigger', function(data) {console.log(data); });
events.trigger('another:trigger', 42);
// 42
```



## Model

Model.url
Model.data
Model.fetch
Model.add
Model.update
Model.remove
Model.setAll
Model.set
Model.get
Model.unsetAll
Model.unset
Model.setProperty
Model.parse

## View

View.elementName
View.element
View.bindEvents
View.setElement
View.setElements
View.setElementAttributes
View.setEvents
View.render
View.bindEvents


## Controller

Controller.models
Controller.modelEvents
Controller.views
Controller.viewEvents
Controller.controllers
Controller.controllerEvents
Controller.bindEvents


## Router

Router
Router.start
Router.setRoute
Router.setEvents
Router.getRoute
Router.onHashChange
Router.navigate


## AJAX

AJAX
AJAX.setHeaders
AJAX.setReponseType







