# MVC | Events
**Description**  
The Events class manages Events and Event Callback functions. It uses `on` and `off` methods to toggle event availability, and the `emit` method to broadcast an event name with associated event data.  

**Contents**  
- [Constructor]()
- [Properties - Getters/Setters](#properties---getterssetters)
  - [Get Events](#get-events)
- [Methods - Getters](#methods---getters)
  - [Get Event Callbacks](#get-event-callbacks)
  - [Get Event Callback Name](#get-event-callback-name)
  - [Get Event Callback Group](#get-event-callback-group)
- [Methods - Interface](#methods---interface)
  - [On](#on)
  - [Off](#off)
  - [Emit](#emit)
- [Examples](#examples)
  - [A.1 - Model On (Single Named Function)](#a1---model-on-single-named-function)
  - [A.2 - Model On (Multiple Named Functions)](#a2---model-on-multiple-named-functions)
  - [A.3 - Model On (Single Anonymous Function)](#a3---model-on-single-anonymous-function)
  - [A.4 - Model On (Multiple Anonymous Functions)](#a4---model-on-multiple-anonymous-functions)
  - [B.1 - Model Emit (Model Emits Data)](#b1---model-emit-model-emits-data)
  - [B.2 - Model Emit (Model Emits)](#b2---model-emit-model-emits)
  - [B.3 - Model Emit (Model Emits Data, Additional Arguments)](#b3---model-emit-model-emits-data-additional-arguments)
  - [C.1 - Model Off (Model Named Events Off)](#c1---model-off-model-named-events-off)
  - [C.1 - Model Off (Model Anonymous Events Off)](#c1---model-off-model-anonymous-events-off)


## Constructor
The class's constructor accepts no arguments.  

## Properties - Getters/Setters

### Get Events
**Return**  
Type: `Object`  
Class's `events` value where property keys represent an event name, and property values represent groups of same-named event callbacks assigned to the event.  

```
{
  eventName: {
    eventCallbackNameA: [
      function eventCallbackNameA(event) { ... }
    ],
    eventCallbackNameB: [
      function eventCallbackNameB(event) { ... }
    ]
  }
}
```

## Methods - Getters

### Get Event Callbacks
**Arguments**  
`(eventName)`

*Event Name*  
Type: `String`  
References a property key of the class's `events` property.  

**Return**  
Type: `Object`  
Key/Value pairs where callback function names are assigned to arrays of same-named callback functions.  

```
{
  eventCallbackName: [
    function eventCallbackName(event) { ... }
  ]
}
```


### Get Event Callback Name
**Arguments**  
`(eventCallback)`  

*Event Callback*  
Type: `Function`  
Event Callback from which to determine the function's name.  

**Return**  
Type: `String`  
Returns the `eventCallback.name` value if it exists; otherwise returns the name 'anonymousFunction`.   

`"eventName"`  
`"anonymousFunction"`


### Get Event Callback Group
**Arguments**  
`(eventCallbacks, eventCallbackName)`

*Event Callbacks*  
Type: `Object`  
Key/Value pairs of event callback function names with arrays of event callback functions.  

*Event Callback Name*  
Type: `String`  
References key from `eventCallbacks` argument.  

**Return**  
Type:  `Array`  
Collection of same-named callback functions.  


## Methods - Interface

### On
**Arguments**  
`(eventName, eventCallback)`  

*Event Name*  
Type: `String`  
Define an event name to reference event callbacks against. Once an event name is defined as a property key for the class's `events` property, one or more event callbacks can be assigned.

*Event Callback*  
Type: `Function`  
Event callbacks are organized by event callback names, and each event may have more than one event callback with the same name assigned to it.  


### Off
**Arguments**  
`()`  
`(eventName)`  
`(eventName, eventCallback)`  

*undefined*  
When no arguments are provided, all events are removed from the class instance.

*Event Name*  
Type: `String`  
Required:: `false`  
Specify an event name to disable event callbacks.  When only the `eventName` argument is provided, all event callbacks associated with the name are disabled.

*Event Callback*  
Type: `Function, String`  
Required:: `false`  
Specify an event callback function associated with the provided event name to disable only those callbacks that share the same function name. Alternately provide the name of the callback function as a string.  


### Emit
**Arguments**  
`(eventName, eventData)`  
`(eventName, eventData, ...additionalArguments)`  

*Event Name*  
Type: `String`  
Required:: `true`  
Provide an event name identifying xoccurrence of the emitted event. All event callbacks associated with the provided event name are called.  

*Event Data*  
Type: `Array`, `Object`, `Number`, `String`, `Boolean`, `null`  
Required:: `true`  
Provide event data associated with the event.  

*Additional Arguments*  
Type: `Array`, `Object`, `Number`, `String`, `Boolean`, `Function`, `null`  
Required:: `false`  
Provide additional arguments that are passed to the event callback function.



## Examples
### A.1 - Model On (Single Named Function)
**Configuration**  
```
let model = new MVC.Events()
```
...
```
model.on(
  'event:name',
  function eventCallbackName(event) {
    console.log('first named callback')
    if(event) console.log(event)
    if(arguments.length > 2) console.log(arguments.slice(2))
  }
)
```
**Result**  
```
console.log(model.events)
-----
{
  "event:name": {
    "eventCallbackName": [
      function eventCallbackName(event) { ... }
    ]
  }
}
```
### A.2 - Model On (Multiple Named Functions)
**Configuration**  
```
model.on(
  'event:name',
  function eventCallbackName(event) {
    console.log( 'second named callback')
    if(event) console.log(event)
    if(arguments.length > 2) console.log(arguments.slice(2))
  }
)
```
**Result**  
```
console.log(model.events)
-----
{
  "event:name": {
    "eventCallbackName": [
      function eventCallbackName(event) { ... },
      function eventCallbackName(event) { ... }
    ]
  }
}
```
### A.3 - Model On (Single Anonymous Function)
**Configuration**  
```
model.on(
  'event:name',
  (event) => {
    console.log('first anonymous callback')
    if(event) console.log(event)
    if(arguments.length > 2) console.log(arguments.slice(2))
  }
)
```
**Result**  
```
console.log(model.events)
-----
{
  "event:name": {
    "eventCallbackName": [
      function eventCallbackName(event) { ... },
      function eventCallbackName(event) { ... }
    ],
    "anonymousFunction": [
      (event) => { ... }
    ]
  }
}
```
### A.4 - Model On (Multiple Anonymous Functions)
**Configuration**  
```
model.on(
  'event:name',
  function(event) {
    console.log('\n', 'second anonymous callback', '\n', event)
  }
)
```
**Result**  
```
console.log(model.events)
-----
{
  "event:name": {
    "eventCallbackName": [
      function eventCallbackName(event) { ... },
      function eventCallbackName(event) { ... }
    ],
    "anonymousFunction": [
      (event) => { ... },
      function(event) { ... }
    ]
  }
}
```



### B.1 - Model Emit (Model Emits Data)
**Configuration**  
```
model.emit('event:name', {
  a: 1
})
```
**Result**  
```
first named callback
{ a: 1 }

second named callback
{ a: 1 }

first anonymous callback
{ a: 1 }

second anonymous callback
{ a: 1 }
```

### B.2 - Model Emit (Model Emits)
**Configuration**  
```
model.emit('event:name')
```
**Result**  
```
first named callback

second named callback

first anonymous callback

second anonymous callback
```

### B.3 - Model Emit (Model Emits Data, Additional Arguments)
**Configuration**  
```
model.emit('event:name', { a: 1 }, 'stringData', 32523523, { ced: 5.714}, [1, 2, 3])
```
**Result**  
```
first named callback
{ a: 1 }
'stringData', 32523523, { ced: 5.714}, [1, 2, 3]

second named callback
{ a: 1 }
'stringData', 32523523, { ced: 5.714}, [1, 2, 3]

first anonymous callback
{ a: 1 }
'stringData', 32523523, { ced: 5.714}, [1, 2, 3]

second anonymous callback
{ a: 1 }
'stringData', 32523523, { ced: 5.714}, [1, 2, 3]
```


### C.1 - Model Off (Model Named Events Off)
**Configuration**  
```
model.off('event:name', function eventCallbackName(event) { ... })
```
...
```
model.off('event:name', 'eventCallbackName')
```
**Result**  
```
{
  "event:name": {
    "anonymousFunction": [
      (event) => { ... },
      function(event) { ... }
    ]
  }
}
```

### C.1 - Model Off (Model Anonymous Events Off)
**Configuration**  
```
model.off('event:name', 'anonymousFunction')
```
**Result**  
```
{}
```
