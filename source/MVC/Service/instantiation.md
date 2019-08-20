# MVC | Service

### Service GET Request
**Configuration**  
```
let service = new MVC.Service({
  responseType: 'json',
  type: 'GET',
  url: 'http://localhost:3000/api/project/5d44e2d50c590a0e7576d8b2',
}).enable()
  .request()
  .then((event) => {
    console.log(event.currentTarget.response)
  })
```

**Results**  
```
{
  "title": "Project 1",
  "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "tests": [
    {
      "title": "Test 1",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "evaluations": [
        "5d44def773075e0e1b386c16",
        "5d44e0991db1370e3f5f0144",
        "5d44e0991db1370e3f5f0143"
      ],
      "_id": "5d44e198e866ff0e48f016e2",
      "__v": 0
    }
  ],
  "_id": "5d44e2d50c590a0e7576d8b2",
  "__v": 0
}
```

### Service GET Request With Headers
