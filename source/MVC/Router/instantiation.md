# MVC | Router Instantiation
- [Server Location](#server-location)
  - [Server Location - Single Page Application With Server Redirects To Index](#server-location---single-page-application-with-server-redirects-to-index)
- [Hash Location](#hash-location)  
  - [Hash Location - Single Page Application](#hash-location---single-page-application)

## Server Location
### Server Location - Single Page Application With Server Redirects to Index
**Configuration**  
```
let navigateEventData
var router = new MVC.Router({
  routes: {
    "/": {
      "title": "Index Route",
      "callback": "index",
      "location": "/"
    },
    "/route-a": {
      "title": "Route A",
      "callback": "route-a",
      "location": "/route-a"
    },
    "/route-b": {
      "title": "Route B",
      "callback": "route-b",
      "location": "/route-b"
    }
  },
  controller: {
    'index': function (event) {
      console.log(event.name, event.data)
      navigateEventData = event.data
    },
    'route-a': function (event) {
      console.log(event.name, event.data)
      navigateEventData = event.data
    },
    'route-b': function (event) {
      console.log(event.name, event.data)
      navigateEventData = event.data
    },
    'route-c': function (event) {
      console.log(event.name, event.data)
      navigateEventData = event.data
    },
  }
}).enable()
  .routeChange()
```

**Results**  
*Index*  
```
{
  "location": {
    "protocol": "http:",
    "hostname": "localhost",
    "port": "8000",
    "path": {
      "name": "/",
      "fragments": [
        "/"
      ]
    },
    "currentURL": "http://localhost:8000/",
    "route": {
      "name": "/",
      "fragments": [
        "/"
      ]
    }
  },
  "controller": {
    "title": "Index Route",
    "location": "/"
  }
}
```

*Route A*  
```
{
  "location": {
    "protocol": "http:",
    "hostname": "localhost",
    "port": "8000",
    "path": {
      "name": "/route-a",
      "fragments": [
        "route-a"
      ]
    },
    "currentURL": "http://localhost:8000/route-a",
    "route": {
      "name": "/route-a",
      "fragments": [
        "route-a"
      ]
    }
  },
  "controller": {
    "title": "Route A",
    "location": "/route-a"
  }
}
```

*Route B*  
```
{
  "location": {
    "protocol": "http:",
    "hostname": "localhost",
    "port": "8000",
    "path": {
      "name": "/route-b",
      "fragments": [
        "route-b"
      ]
    },
    "currentURL": "http://localhost:8000/route-b",
    "route": {
      "name": "/route-b",
      "fragments": [
        "route-b"
      ]
    }
  },
  "controller": {
    "title": "Route B",
    "location": "/route-b"
  }
}
```


*Route C*  
```
{
  "location": {
    "protocol": "http:",
    "hostname": "localhost",
    "port": "8000",
    "path": {
      "name": "/route-c",
      "fragments": [
        "route-c"
      ]
    },
    "currentURL": "http://localhost:8000/route-c",
    "route": {
      "name": "/route-c",
      "fragments": [
        "route-c"
      ]
    }
  },
  "controller": {
    "title": "Route C",
    "location": "/route-c"
  }
}
```

## Hash Location
### Hash Location - Single Page Application

**Configuration**  
```
var router = new MVC.Router({
  routes: {
    '/': {
      title: 'Index',
      callback: 'index'
    },
    '/projects': {
      title: 'Projects',
      callback: 'projects'
    },
    '/projects/:prid': {
      title: 'Project',
      callback: 'project'
    },
    '/projects/:prid/tests': {
      title: 'Tests',
      callback: 'tests'
    },
    '/projects/:prid/tests/:tsid': {
      title: 'Test',
      callback: 'test'
      },
    '/projects/:prid/tests/:tsid/evaluations': {
      title: 'Evaluations',
      callback: 'evaluations'
    },
    '/projects/:prid/tests/:tsid/evaluations/:evid': {
      title: 'Evaluation',
      callback: 'evaluation'
    },
  },
  controller: {
    index: function(event) {
      currentRouteData = event.data
    },
    projects: function(event) {
      currentRouteData = event.data
    },
    project: function(event) {
      currentRouteData = event.data
    },
    tests: function(event) {
      currentRouteData = event.data
    },
    test: function(event) {
      currentRouteData = event.data
    },
    evaluations: function(event) {
      currentRouteData = event.data
    },
    evaluation: function(event) {
      currentRouteData = event.data
    },
  }
}).enable()
  .routeChange()
```

**Result A**  
```
{
  "location": {
    "protocol": "http:",
    "hostname": "localhost",
    "port": "8000",
    "path": {
      "name": "/",
      "fragments": [
        "/"
      ]
    },
    "currentURL": "http://localhost:8000/",
    "route": {
      "name": "/",
      "fragments": [
        "/"
      ]
    }
  },
  "controller": {
    "title": "Index"
  }
}
```


**Result B**  
```
{
  "location": {
    "protocol": "http:",
    "hostname": "localhost",
    "port": "8000",
    "path": {
      "name": "/projects",
      "fragments": [
        "projects"
      ]
    },
    "currentURL": "http://localhost:8000/projects",
    "route": {
      "name": "/projects",
      "fragments": [
        "projects"
      ]
    }
  },
  "controller": {
    "title": "Projects"
  }
}
```

**Result C**  
```
{
  "location": {
    "protocol": "http:",
    "hostname": "localhost",
    "port": "8000",
    "path": {
      "name": "/projects/325235235",
      "fragments": [
        "projects",
        "325235235"
      ]
    },
    "currentURL": "http://localhost:8000/projects/325235235",
    "currentIDKey": "prid",
    "prid": "325235235",
    "route": {
      "name": "/projects/:prid",
      "fragments": [
        "projects",
        ":prid"
      ]
    }
  },
  "controller": {
    "title": "Project"
  }
}
```

**Result D**  
```
{
  "location": {
    "protocol": "http:",
    "hostname": "localhost",
    "port": "8000",
    "path": {
      "name": "/projects/325235235/tests",
      "fragments": [
        "projects",
        "325235235",
        "tests"
      ]
    },
    "currentURL": "http://localhost:8000/projects/325235235/tests",
    "prid": "325235235",
    "route": {
      "name": "/projects/:prid/tests",
      "fragments": [
        "projects",
        ":prid",
        "tests"
      ]
    }
  },
  "controller": {
    "title": "Tests"
  }
}
```

**Result E**  
```
{
  "location": {
    "protocol": "http:",
    "hostname": "localhost",
    "port": "8000",
    "path": {
      "name": "/projects/325235235/tests/2352462462",
      "fragments": [
        "projects",
        "325235235",
        "tests",
        "2352462462"
      ]
    },
    "currentURL": "http://localhost:8000/projects/325235235/tests/2352462462",
    "prid": "325235235",
    "currentIDKey": "tsid",
    "tsid": "2352462462",
    "route": {
      "name": "/projects/:prid/tests/:tsid",
      "fragments": [
        "projects",
        ":prid",
        "tests",
        ":tsid"
      ]
    }
  },
  "controller": {
    "title": "Test"
  }
}
```

**Result F**  
```
{
  "location": {
    "protocol": "http:",
    "hostname": "localhost",
    "port": "8000",
    "path": {
      "name": "/projects/325235235/tests/2352462462/evaluations",
      "fragments": [
        "projects",
        "325235235",
        "tests",
        "2352462462",
        "evaluations"
      ]
    },
    "currentURL": "http://localhost:8000/projects/325235235/tests/2352462462/evaluations",
    "prid": "325235235",
    "tsid": "2352462462",
    "route": {
      "name": "/projects/:prid/tests/:tsid/evaluations",
      "fragments": [
        "projects",
        ":prid",
        "tests",
        ":tsid",
        "evaluations"
      ]
    }
  },
  "controller": {
    "title": "Evaluations"
  }
}
```

**Result G**  
```
{
  "location": {
    "protocol": "http:",
    "hostname": "localhost",
    "port": "8000",
    "path": {
      "name": "/projects/325235235/tests/2352462462/evaluations/32624634634",
      "fragments": [
        "projects",
        "325235235",
        "tests",
        "2352462462",
        "evaluations",
        "32624634634"
      ]
    },
    "currentURL": "http://localhost:8000/projects/325235235/tests/2352462462/evaluations/32624634634",
    "prid": "325235235",
    "tsid": "2352462462",
    "currentIDKey": "evid",
    "evid": "32624634634",
    "route": {
      "name": "/projects/:prid/tests/:tsid/evaluations/:evid",
      "fragments": [
        "projects",
        ":prid",
        "tests",
        ":tsid",
        "evaluations",
        ":evid"
      ]
    }
  },
  "controller": {
    "title": "Evaluation"
  }
}
```
