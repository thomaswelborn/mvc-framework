
# Object Query
Utility accepts formatted `string` and `context` arguments then returns the target property/properties.  

- [Method](#method)
  - [Arguments](#arguments)
    - [Argument - string](#argument-string)
    - [Argument - context](#argument-context)
  - [Return Value](#return-value)
- [Example](#example)
  - [Example Context](#example-context)
  - [Example Query Methods](#example-query-methods)

## Method
```
objectQuery(
  string,
  context
) {
  ...
  return property|properties
}
```

### Arguments
#### Argument - string
Formatted string describing context path.  
##### Array Format
```
[@][S]
[@][R]
[@][S][R]
...
```
**`@` - Reference Context (required)**  
**`S` - Key String (optional)**  
**`R` - Regular Expression (optional)**  

###### Regular Expression
Supports some regular expressions.  
**Begins With**  
```
[/^(partial-)/]
```

**Ends With**  
```
[/(-string)$/]
```

**Begins With And Ends With**  
```
[/^(partial-)(.*?)(-series-a)$/]
```

**Within**  
```
[/(-partial-)/]
```

#### Argument - context
Object to query `string` against.  

### Return Value
Returns key/value pair or array of key/value pairs.  
- *property*  -  `[
  key, value
]`  
- *properties* - `[
  [
    key, value
  ],
  ...
]`  


## Example
### Example Context
```
let string = "
let context = {
  "a": {
    "b-1": {
      "c": 2
    },
    "b-2": {
      "c": 3
    },
    "b-3": {
      "c": 5
    }
  }
}
```

*Transformed Context*  
```
[
  ["a", {
    "b-1": {
      "c": 2
    },
    "b-2": {
      "c": 3
    },
    "b-3": {
      "c": 5
    }
  }]
]
```

**Object Query 1**  
```
string = "[@][a]"
MVC.Utils.objectQuery(string, context)
```
**Query Results 1**  
```
[
  ["a", {
    "b-1": {
      "c": 2
    },
    "b-2": {
      "c": 3
    },
    "b-3": {
      "c": 5
    }
  }]
]
```

**Object Query 2**  
```
string = "[@][a][b-1]"
MVC.Utils.objectQuery(string, context)
```
**Query Results 2**  
```
[
  ["b-1", {
    "c": 2
  }]
]
```

**Object Query 3**  
```
string = "[@][a][b-1][c]"
MVC.Utils.objectQuery(string, context)
```
**Query Results 3**  
```
[
  ["c": 2]
]
```

**Object Query 4**  
```
string = "[@][a][/^=b-/]"
MVC.Utils.objectQuery(string, context)
```
**Query Results 4**  
```
[
  ["b-1", {
    "c": 2
  }],
  ["b-2", {
    "c": 3
  }],
  ["b-3", {
    "c": 5
  }]
]
```

**Object Query 5**  
```
string = "[@][a][/^=b-/][c]"
MVC.Utils.objectQuery(string, context)
```
**Query Results 5**  
```
[
  ["c": 2],
  ["c": 3],
  ["c": 5]
]
```
