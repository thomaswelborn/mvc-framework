# MVC | Events - Instantiation

- [API](./api.md)

**Contents**  
+ [Examples](#examples)
  - [Example 1 - Single event with multiple callbacks](#example-1---single-event-with-multiple-callbacks)
  - [Example 2 - Multiple events with callbacks](#example-2---multiple-events-with-callbacks)
  - [Example 3 - Remove single event](#example-3---remove-single-event)
  - [Example 4 - Remove single event's callback](#example-4---remove-single-event's-callback)
  - [Example 5 - Remove all events](#example-5---remove-all-events)

## Examples
### Example 1 - Single event with multiple callbacks
**Instantiation**  
```
let events = new MVC.Events()
events.on('some-event-name', function someEventCallback(event) {
  console.log(event)
})
events.on('some-event-name', function someOtherEventCallback(event) {
  console.log(event)
})
events.emit('some-event-name', {
  name: 'some-event-name',
  data: {
    a: 1
  }
})
```

**Instance State**  
```
{
  "events": {
    "some-event-name": {
      "someEventCallback": [
      function someEventCallback(event) {
        console.log(event)
      }
      ],
      "someOtherEventCallback": [
        function someOtherEventCallback(event) {
          console.log(event)
        }
      ]
    }
  }
}
```

**Output**  
```
{
  "name": "some-event-name",
  "data": {
    "a": 1
  }
}
{
  "name": "some-event-name",
  "data": {
    "a": 1
  }
}
```

### Example 2 - Multiple events with callbacks
**Instantiation**    
```
events.on('some-other-event-name', function someOtherEventCallback(event) {
  console.log(event)
})
events.emit('some-other-event-name', {
  name: 'some-other-event-name',
  data: {
    b: 2
  }
})
```

**Instance State**  
```
{
  "events": {
    "some-event-name": {
      "someEventCallback": [
      function someEventCallback(event) {
        console.log(event)
      }
      ],
      "someOtherEventCallback": [
        function someOtherEventCallback(event) {
          console.log(event)
        }
      ]
    },
    "some-other-event-name": {
      "someOtherEventCallback": [
        function someEventCallback(event) {
          console.log(event)
        }
      ]
    }
  }
}
```

**Output**  
```
{
  "name": "some-other-event-name",
  "data": {
    "b": 1
  }
}
```

### Example 3 - Remove single event
```
events.off('some-other-event-name')
```

**Instance State**  
```
{
  "events": {
    "some-event-name": {
      "someEventCallback": [
        function someEventCallback(event) {
          console.log(event)
        }
      ],
      "someOtherEventCallback": [
        function someOtherEventCallback(event) {
          console.log(event)
        }
      ]
    }
  }
}
```

### Example 4 - Remove single event's callback
```
events.off('some-event-name', 'someOtherEventCallback')
```

**Instance State**  
```
{
  "events": {
    "some-event-name": {
      "someEventCallback": [
        function someEventCallback(event) {
          console.log(event)
        }
      ]
    }
  }
}
```

### Example 5 - Remove all events
```
events.off()
```

**Instance State**  
```
{}
```
