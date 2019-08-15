# MVC | Event Binding

- [Event Binding](#event-binding)
  - [Event Binding Format](#event-binding-format)
 - [Model Event Binding](#model-event-binding)
   - [Model Data Events](#model-data-events)
   - [Model Service Events](#model-service-events)
 - [View Event Binding](#view-event-binding)
   - [UI Events](#ui-events)
 - [Controller Event Binding](#controller-event-binding)
   - [Model Events](#model-events)
   - [View Events](#view-events)
   - [Controller Events](#controller-events)
   - [Mediator Events](#mediator-events)

## Event Binding
Bind Event Callbacks to Event Targets with definitions from an Events object.  
Models, Views, and Controllers each use different types of Events.  
```
+ Model
  - Data Events
  - Service Events
+ View
  - UI Events
+ Controller
  - Model Events
  - View Events
  - Controller Events
  - Mediator Events
```

### Event Binding Format
```
{
  events: {
    '[eventTarget] event:name': '[eventNameCallback]'
  },
  eventTargets: {
    eventTarget: EventTargetClass
  },
  eventCallbacks: {
    eventNameCallback: function eventNameCallback(event) {
      ...
    }.bind(this),
  },
}
```

#### Events
```
'[eventTarget] event:name': '[eventNameCallback]'
```

#### Event Data
`[eventTarget] event:name`  
Define an Event Target from `eventTargets` by surrounding it's name in brackets.  
`event:name`  
Define an Event Name that emits from the Event Target.  

*Event Callback Data*  
Define an Event Callback from `eventCallbacks` by surrounding it's name in brackets.  

## Model Event Binding
### Model Data Events
The Model class is the Event Target for Data Events. When the model's `data` property changes it emits `set` and `set:value` events that can be captured on the Model Class. `[@]` notation refers to the Model class.  
```
{
  dataEvents: {
    '[@] set': '[dataSetCallback]',
    '[@] set:value': '[dataSetValueCallback]'
  },
  dataCallbacks: {
    dataSetCallback: function dataSetCallback(event) {},
    dataSetValueCallback: function dataSetValueCallback(event) {},
  }
}
```

### Model Service Events
Model Service Targets are Service Class instances.  Service class instances emit `xhr:resolve` events after completing an XHR request.  
```
{
  services: {
    serviceName: new MVC.Service({
      type: 'GET',
      url: 'http://localhost:3000/api',
    }).enable().request()
  },
  serviceEvents: {
    '[serviceName] xhr:resolve' '[serviceNameXHRResolve]',
  },
  serviceCallbacks: {
    serviceNameXHRResolve: function serviceNameXHRResolve(event) {
      let responseData = JSON.parse(event.currentTarget.response)
      this.set(responseData)
    }.bind(this)
  }
}
```

## View Event Binding
### UI Events
View UI Targets are Document Query Node Lists of elements in the View's template. `ui` property keys describe a name for the query value.  
```
{
  ui: {
    'body': document.querySelector('body'),
    'navigationButtons': 'nav > buttons',
    'formInput': '.form input',
  },
  uiEvents: {
    '[formInput] input': '[formInputInput]',
    '[navigationButtons] click': '[navigationButtonClick]',
  },
  uiCallbacks: {
    formInputInput: function formInputInput(event) {},
    navigationButtonClick: function navigationButtonClick(event) {}.bind(this),
  },
}
```

## Controller Event Binding
### Model Events
```
{
  models: {
    someModel: new MVC.Model({
      schema: {
        _id: {
          type: 'string',
          required: true,
        }
      },
    }).enable().set('_id', '34y45wy467456q'),
  },
  modelEvents: {
    '[someModel] set': '[someModelSet]',
    '[someModel] set:_id': '[someModelSetID]',
    '[someModel] validate:': '[someModelValidate]',
  },
  modelCallbacks: {
    someModelSet: function someModelSet(event) {}.bind(this),
    someModelSetID: function someModelSetID(event) {}.bind(this),
    someModelValidate: function someModelValidate(event) {}.bind(this),
  },
}
```
### View Events
```
{
  views: {
    someView: new MVC.View({
      elementName: 'div',
      templates: {
        template: `<button data-id="${data.id}">${data.id}</button>`
      },
      ui: {
        button: 'button',
      },
      uiEvents: {
        '[button] click': 'buttonClick'
      },
      uiCallbacks: {
        buttonClick: function buttonClick(event) {
          console.log(event.currentTarget.getAttribute('data-id'))
        }.bind(this),
      },
      render: function(data) {
        let template = this.templates.template(data)
        this.view.appenChild(template)
        return this
      },
    }).enbale().render({ _id: '11111111' }),
  },
  viewEvents: {
    '[someView] custom:event': '[someViewCustomEvent]'
  },
  viewCallbacks: {
    someViewCustomEvent: function someViewCustomEvent(event) {}.bind(this),
  },
}
```
### Controller Events
```
{
  controllers: {
    someController: new MVC.Controller(),
  },
  controllerEvents: {
    '[someController] custom:event': '[someControllerCustomEvent]'
  },
  controllerCallbacks: {
    someControllerCustomEvent: function someControllerCustomEvent(event) {}.bind(this),
  },
}
```
### Mediator Events
```
{
  mediators: {
    someMediator: new MVC.Mediator({
      name: 'event:name',
      schema: {
        id: {
          type: 'string',
          required: true,
        }
      },
    })
  },
  mediatorEvents: {
    '[someMediator] event:name': '[someMediatorEventName]'
  },
  mediatorCallbacks: {
    someMediatorEventName: function someMediatorEventName() {}.bind(this),
  },
}
```
