# MVC | Validator
The MVC Validator class accepts a single `schema` argument containing `key`/`value` pairs that describe the class's `data` object properties and becomes a class property. `schema` keys match the class's `data` object keys, while `schema` values describe qualities of `data` object values.  A value may be `required` to exist, match a data `type`, or pass `evaluations` criteria to be considered valid. The class's `validate` method accepts a single `data` argument that is assigned to the class, then used to compare against the class's `schema` property.

Validation occurs after data is passed to the class's `validate` method.  

- [Constructor](#constructor)
- [Properties - Getters/Setters](#properties---getterssetters)
  - [Schema Getter/Setter](#schema-gettersetter)
  - [Results Getter/Setter](#results-gettersetter)
  - [Data Getter/Setter](#data-gettersetter)
- [Methods - Interface](#methods---interface)
  - [Validate](#validate)
  - [Required](#required)
  - [Type](#type)
  - [Evaluations](#evaluations)
  - [Evaluation Results](#evaluation-results)
  - [Compare Values](#compare-values)
  - [Compare Statements](#compare-statements)

### Constructor
**Arguments**  
`(schema)`  
*Schema*  
Type: `Object`  
Required: `true`  
```
{
  '[key]': {
    type: `string`, `number`, `function`, `object`, `array`, `boolean`, `null`,
    required: Boolean,
    evaluations: [
      {
         get _value() { return this.value.length },
         set _value(value) { this.value = value },
         comparison: {
           value: `MVC.CONST.Operators.Comparison`,
           statement: `MVC.CONST.Operators.Statement`,
         },
         comparator: [Number, String, Boolean],
         messages: {
           pass: String,
           fail: String,
         }
       }
    ]
  }
}
```

**Type**  
Type: `string`, `number`, `function`, `object`, `array`, `boolean`, `null`  
Required: `false`  

**Required**  
Type: `Boolean`
Required: `false`

**Evaluations.Evaluation**  
*Get Value*  
Type: `Getter Function`  
Required: `true`  
Returns value used to validate against `comparator`.  

*Set Value*  
Type: `Setter Function`  
Required: `true`  
Sets a property value to be used for comparison.  

*Comparison*  
Type: `String`  
Required: `true`  
> *Value*  
One of `MVC.CONST.Operators.Comparison` values representing value comparison operators.

> *Statement*  
One of `MVC.CONST.Operators.Statement` values representing statement comparison operators.  

*Comparator*  
Type: `String`, `Object`, `Number`, `Array`, `Function`, `Boolean`  
Required: `true`  
Property to compare with `value` and produce `results`.  

*Messages*  
> *Pass*  
Type: `String`  
Required: `false`  
Message to display when validation passes.  

> *Fail*  
Type: `String`  
Required: `false`  
Message to display when validation fails.  

## Properties - Getters/Setters
### Schema
See [Settings](#settings).  
**Schema Setter**  
Type: `Object`  
Sets the class's `schema` property.  

**Schema Getter**  
Type: `Object`  
Returns the class's `schema` property.  

### Results
**Results Setter**  
Type: `Object`  
Sets the class's `results` property after the `validate` method is complete.  

**Results Getter**  
Type: `Object`  
Returns the class's `results` property.  
```
{
  [key]: {
    key: String,
    value: `String`, `Object`, `Number`, `Array`, `Function`, `Boolean`,
    required: {
      value: Boolean,
      comparator: Boolean,
      result: Boolean,
      message: String
    },
    type: {
      value: string,
      comparator: string,
      result: Boolean,
      message: String
    },
    evaluations: {
      [pass|fail]: [
        {
          _value: `String`, `Object`, `Number`, `Array`, `Function`, `Boolean`,
          comparison: {
            value: `MVC.CONST.Operators.Comparison`,
            statement: `MVC.CONST.Operators.Statement`,
          },
          comparator: `String`, `Object`, `Number`, `Array`, `Function`, `Boolean`,
          messages: {
            pass: String,
            fail: String,
          },
          value: `String`, `Object`, `Number`, `Array`, `Function`, `Boolean`,
          results: {
            value: {
              result: Boolean,
              message: String
            },
            statement: {
              result: Boolean,
              message: String
            },
          }
        }
      ]
    }
  }
}
```

### Data
**Data Setter**  
Type: `Object`  
Sets the class's `data` property when the `validate` method starts.  

**Data Getter**  
Type: `Object`  
Returns the class's `data` property.  

## Methods - Interface
### Validate
Validates a `data` argument against the class's `schema` object.  
**Arguments**  
`(data)`  
*Data*  

**Return**  
Type: `Object`  

### Required
**Arguments**  
`(value, schemaSettings)`  
*value*  
Type: Boolean

**Return**  
Type: `Object`  
```
{
  value: Boolean,
  comparator: Boolean,
  result: Boolean,
  message: String
}
```

### Type
**Arguments**  
`(value, schemaSettings)`  
*value*  
Type: Boolean

**Return**  
Type: `Object`  
```
{
  value: string,
  comparator: string,
  result: Boolean,
  message: String,
}
```

### Evaluations
**Arguments**  
`(value, evaluations)`  
*Value*  
Type: `String`, `Object`, `Number`, `Array`, `Function`, `Boolean`   
Required: `true`  
Value to perform evaluations against.  

*Evaluations*  
Type: `Array`  
Required: `true`  
Array of evaluation settings.  

**Return**  
Array of return values from `compareValues` and `compareStatements`.  
```
[
  { compareValues },
  { compareStatements },
  ...
]
```

### Evaluation Results
**Arguments**  
`(evaluations)`  
*Evaluations*  
Type: `Array`  
Required: `true`  
Value returned from class's `evaluations` method.  

**Return**  
Type: `Object`  
```
{
  [pass|fail]: [
    {CompareValues},
    {CompareStatements},
  ],
}
```

### Compare Values
**Arguments**  
`(value, operator, comparator, messages)`  
*Value*  
Type: `String`, `Object`, `Number`, `Array`, `Function`, `Boolean`   
Required: `true`  
Value to perform evaluations against the `comparator` argument.  

*Operator*  
Type: MVC.CONST.Operators.Comparison  
Required: `true`  
Operator to use for comparison between `value` and `comparator` arguments.  

*Comparator*  
Type: `String`, `Object`, `Number`, `Array`, `Function`, `Boolean`   
Required: `true`  
Value to perform evaluations with `value` argument.  

*Messages*  
Type: `Object`  
Required: `true`  
Object with `pass` and `fail` text properties to assign based on evaluation results.  

**Return**  
Type: `Object`  
```
{
  result: Boolean,
  message: String
}
```

### Compare Statements
**Arguments**  
`(value, operator, comparator, messages)`  
*value*  
Type: `String`, `Object`, `Number`, `Array`, `Function`, `Boolean`  
Required: `true`  
Value to perform evaluations against the `comparator` argument.  

*Operator*  
Type: `MVC.CONST.Operators.Statement`  
Required: `true`  
Operator to use for comparison between `value` and `comparator` arguments.  

*Comparator*  
Type: `String`, `Object`, `Number`, `Array`, `Function`, `Boolean`   
Required: `true`  
Value to perform evaluations with `value` argument.  

*Messages*  
Type: `Object`  
Required: `true`  
Object with `pass` and `fail` text properties to assign based on evaluation results.  

**Return**  
Type: `Object`  
```
{
  result: Boolean,
  message: String
}
```
