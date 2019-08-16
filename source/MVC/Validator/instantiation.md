# MVC | Validator Instantiation

- [Instantiate With Required Schema](#instantiate-with-required-schema)
  - [Data Matches Schema Required ](#data-matches-required-schema)
  - [Data Mismatches Required Schema](#data-matches-required-schema)
- [Instantiate With Type Schema](#instantiate-with-type-schema)
  - [Data Matches Type Schema](#data-matches-type-schema)
  - [Data Mismatches Type Schema](#data-mismatches-type-schema)
- [Instantiate with Evaluations Schema](#instantiate-with-evaluation-schema)
  - [Data Matches Single Evaluation](#data-matches-single-evaluation)
  - [Data Matches Multiple Evaluation Criteria](#data-matches-multiple-evaluation-criteria)

## Instantiate With Required Schema
### Data Matches Schema Required
**Configuration**  
```
let data = {
  a: 1,
  b: 2,
  c: 3,
}

let schema = {
  a: {
    required: true,
  },
  b: {
    required: true,
  },
  c: {
    required: true,
  }
}

let validator = new MVC.Validator(schema)

validator.validate(data)
```

**Results**  
```
console.log(validator.results)
-----
{
  "a": {
    "key": "a",
    "value": 1,
    "required": {
      "value": true,
      "comparator": true,
      "result": true,
      "message": "Value is defined."
    }
  },
  "b": {
    "key": "b",
    "value": 2,
    "required": {
      "value": true,
      "comparator": true,
      "result": true,
      "message": "Value is defined."
    }
  },
  "c": {
    "key": "c",
    "value": 3,
    "required": {
      "value": true,
      "comparator": true,
      "result": true,
      "message": "Value is defined."
    }
  }
}
```
### Data Mismatches Required Schema
**Configuration**  
```
let data = {
  a: 1,
  c: 3,
}

let schema = {
  a: {
    required: true,
  },
  b: {
    required: true,
  },
  c: {
    required: true,
  }
}

let validator = new MVC.Validator(schema)

validator.validate(data)
```

**Results**  
```
console.log(validator.results)
-----
{
  "a": {
    "key": "a",
    "value": 1,
    "required": {
      "value": true,
      "comparator": true,
      "result": true,
      "message": "Value is defined."
    }
  },
  "b": {
    "key": "b",
    "required": {
      "value": false,
      "comparator": true,
      "result": false,
      "message": "Value is not defined."
    }
  },
  "c": {
    "key": "c",
    "value": 3,
    "required": {
      "value": true,
      "comparator": true,
      "result": true,
      "message": "Value is defined."
    }
  }
}
```

## Instantiate With Type Schema
### Data Matches Type Schema
**Configuration**  
```
let data = {
  id: 13513513613,
  title: 'asdgsajjgklasdf asdf asdf asd fjklasdjgsalh.',
  ready: false,
}

let schema = {
  id: {
    type: 'number',
  },
  title: {
    type: 'string',
  },
  ready: {
    type: 'boolean',
  },
}

let validator = new MVC.Validator(schema)

validator.validate(data)
```

**Results**  
```
console.log(validator.results)
-----
{
  "id": {
    "key": "id",
    "value": 13513513613,
    "type": {
      "value": "number",
      "comparator": "number",
      "result": true,
      "message": "Valid Type."
    }
  },
  "title": {
    "key": "title",
    "value": "asdgsajjgklasdf asdf asdf asd fjklasdjgsalh.",
    "type": {
      "value": "string",
      "comparator": "string",
      "result": true,
      "message": "Valid Type."
    }
  },
  "ready": {
    "key": "ready",
    "value": false,
    "type": {
      "value": "boolean",
      "comparator": "boolean",
      "result": true,
      "message": "Valid Type."
    }
  }
}
```

### Data Mismatches Type Schema
**Configuration**  
```
let data = {
  id: 13513513613,
  title: 'asdgsajjgklasdf asdf asdf asd fjklasdjgsalh.',
  ready: false,
}

let schema = {
  id: {
    type: 'string',
  },
  title: {
    type: 'number',
  },
  ready: {
    type: 'boolean',
  },
}

let validator = new MVC.Validator(schema)

validator.validate(data)
```

**Results**  
```
console.log(validator.results)
-----
{
  "id": {
    "key": "id",
    "value": 13513513613,
    "type": {
      "value": "number",
      "comparator": "string",
      "result": false,
      "message": "Invalid Type."
    }
  },
  "title": {
    "key": "title",
    "value": "asdgsajjgklasdf asdf asdf asd fjklasdjgsalh.",
    "type": {
      "value": "string",
      "comparator": "number",
      "result": false,
      "message": "Invalid Type."
    }
  },
  "ready": {
    "key": "ready",
    "value": false,
    "type": {
      "value": "boolean",
      "comparator": "boolean",
      "result": true,
      "message": "Valid Type."
    }
  }
}
```

## Instantiate with Evaluations Schema
### Data Matches Single Evaluation
**Configuration**  
```
let data = {
  description: 'asdfjg fdgkjlh rytoihl fanmvc, fdkjwkjewj',
}

let schema = {
  description: {
    evaluations: [
      {
        get _value() { return this.value.length },
        set _value(value) { this.value = value },
        comparison: {
          value: MVC.CONST.Operators.Comparison.LTE,
        },
        comparator: 128,
        messages: {
          pass: "Value is less than 128 characters.",
          fail: "Value is greater than 128 characters.",
        }
      }
    ]
  }
}

let validator = new MVC.Validator(schema)
validator.validate(data)
```

**Results**  
```
console.log(validator.results)
-----
{
  "description": {
    "key": "description",
    "value": "asdfjg fdgkjlh rytoihl fanmvc, fdkjwkjewj",
    "evaluations": {
      "pass": [],
      "fail": [
        {
          "_value": 41,
          "comparison": {
            "value": "LTE"
          },
          "comparator": 128,
          "messages": {
            "fail": "Value is greater than 128 characters."
            "pass": "Value is less than or equal to 128 characters.",
          },
          "value": "asdfjg fdgkjlh rytoihl fanmvc, fdkjwkjewj",
          "results": {
            "value": {
              "result": false,
              "message": "Value is less than or equal to 128 characters."
            }
          }
        }
      ]
    }
  }
}
```

### Data Matches Multiple Evaluation Criteria
**Configuration**  
```
let data = {
  description: 'asdfjg fdgkjlh rytoihl fanmvc, fdkjwkjewj',
}

let schema = {
  description: {
    evaluations: [
      {
        get _value() { return this.value.length },
        set _value(value) { this.value = value },
        comparison: {
          value: MVC.CONST.Operators.Comparison.LTE,
        },
        comparator: 128,
        messages: {
          pass: "Value is less than or equal to 128 characters.",
          fail: "Value is greater than 128 characters.",
        }
      },
      {
        get _value() { return this.value.length },
        set _value(value) { this.value = value },
        comparison: {
          value: MVC.CONST.Operators.Comparison.GTE,
          statement: MVC.CONST.Operators.Statement.AND,
        },
        comparator: 64,
        messages: {
          pass: "Value is greater than or equal 64 characters.",
          fail: "Value is less than 64 characters.",
        }
      }
    ]
  }
}

let validator = new MVC.Validator(schema)
validator.validate(data)
```

**Results**  
```
{
  "description": {
    "key": "description",
    "value": "asdfjg fdgkjlh rytoihl fanmvc, fdkjwkjewj",
    "evaluations": {
      "pass": [
        {
          "_value": 41,
          "comparison": {
            "value": "LTE"
          },
          "comparator": 128,
          "value": "asdfjg fdgkjlh rytoihl fanmvc, fdkjwkjewj",
          "results": {
            "value": {
              "result": true,
              "message": "Value is less than or equal to 128 characters."
            }
          }
        }
      ],
      "fail": [
        {
          "_value": 41,
          "comparison": {
            "value": "GTE",
            "statement": "AND"
          },
          "comparator": 64,
          "value": "asdfjg fdgkjlh rytoihl fanmvc, fdkjwkjewj",
          "results": {
            "value": {
              "result": false,
              "message": "Value is less than 64 characters."
            },
            "statement": {
              "result": false,
              "message": "Value is less than 64 characters."
            }
          }
        }
      ]
    }
  }
}
```
