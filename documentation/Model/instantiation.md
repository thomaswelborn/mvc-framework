# MVC | Model - Instantiation

- [API](./api.md)

**Contents**  
+ [Instantiate With Settings and Configuration Arguments](#instantiate-with-settings-and-configuration-arguments)
  - [Model Class Definition](#model-class-definition)
  - [Model Class Instance Output](#model-class-instance-output)
+ [Instantiate By Extending Classes](#instantiate-by-extending-classes)
  - [Extended Model Class Definition](#extended-model-class-definition)
  - [Extended Model Class Instantiation](#extended-model-class-instantiation)
  - [Extended Model Instance Output](#extended-model-instance-output)

## Instantiate With Settings and Configuration Arguments
### Model Class Definition
```
let model = new MVC.Model({
  schema: {
    id: {
      type: 'number',
      required: true,
    },
    userId: {
      type: 'number',
      required: true,
      },
    title: {
      type: 'string',
      required: true,
    },
    completed: {
      type: 'boolean',
      required: true,
    },
  },
  services: {
    get: new MVC.Service({
      type: 'GET',
      url: 'https://jsonplaceholder.typicode.com/todos/1',
    }).enable()
  },
}).enable()
  .on('validate', (event) => {
    Object.entries(event.data.results)
      .forEach(([resultKey, resultValue]) => {
        console.log('\n', resultValue.key, '\n', '-----', '\n')
        console.log('\n', resultValue.required.value, '\n', '-----')
        console.log(resultValue.type.message)
        console.log(resultValue.required.message)
      })
  })
model.services.get.request().then((event) => {
  console.log(event)
  let data = JSON.parse(event.currentTarget.response)
  model.set(data)
})
```

### Model Class Instance Output
```
id
-----
1
-----
Valid Type.
Value is defined.

userId
-----
1
-----
Valid Type.
Value is defined.

title
-----
delectus aut autem
-----
Valid Type.
Value is defined.

completed
-----
false
-----
Valid Type.
Value is defined.
```

## Instantiate By Extending Classes
### Extended Model Class Definition
```
let ModelClass = class extends MVC.Model {
  constructor() {
    super(...arguments)
    this
      .addSchema()
      .addServices()
      .enable()
  }
  addSchema() {
    let schema = {
      id: {
        type: 'number',
        required: true,
      },
      userId: {
        type: 'number',
        required: true,
        },
      title: {
        type: 'string',
        required: true,
      },
      completed: {
        type: 'boolean',
        required: true,
      },
    }
    this._settings = {
      schema: schema,
    }
    return this
  }
  addServices() {
    let services = {
      get: new MVC.Service({
        type: 'GET',
        url: 'https://jsonplaceholder.typicode.com/todos/1'
      }).enable()
    }
    let serviceCallbacks = {
      getXHRResolve: function getXHRResolve(event) {
        let data = JSON.parse(event.data.response)
        console.log(typeof data)
        this.set(data)
        console.log(data)
      }.bind(this)
    }
    let serviceEvents = {
      '[get] xhr:resolve': '[getXHRResolve]'
    }
    this._settings = {
      services: services,
      serviceCallbacks: serviceCallbacks,
      serviceEvents: serviceEvents,
    }
    return this
  }
  start() {
    this.services.get.request()
    return this
  }
}
```

### Extended Model Class Instantiation
```
let model = new ModelClass()
model.on('validate', (event) => {
  Object.entries(event.data.results)
    .forEach(([resultKey, resultValue]) => {
      console.log('\n', resultValue.key, '\n', '-----', '\n')
      console.log('\n', resultValue.required.value, '\n', '-----')
      console.log(resultValue.type.message)
      console.log(resultValue.required.message)
    })
})
model.start()
```

### Extended Model Instance Output
```
id
-----
1
-----
Valid Type.
Value is defined.

userId
-----
1
-----
Valid Type.
Value is defined.

title
-----
delectus aut autem
-----
Valid Type.
Value is defined.

completed
-----
false
-----
Valid Type.
Value is defined.
```
