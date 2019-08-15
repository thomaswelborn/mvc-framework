# MVC | Model
- [Settings](#settings)
  - [Schema](#schema)
  - [Defaults](#defaults)
  - [Data](#data)
  - [Services](#services)
  - [Service Events](#service-events)
  - [Service Callbacks](#service-callbacks)
  - [Local Storage](#local-storage)
- [Properties - Getters/Setters](#properties---getterssetters)
  - [Validator Getter/Setter](#validator-gettersetter)
  - [Is Setting Getter/Setter](#is-setting-gettersetter)
  - [Get Changing Getter/Setter](#get-changing)
  - [Local Storage Getter/Setter](#local-storage-gettersetter)
  - [Defaults Getter/Setter](#defaults-gettersetter)
  - [Histiogram Getter/Setter](#histiogram-gettersetter)
  - [History Getter/Setter](#history-gettersetter)
  - [DB Getter/Setter](#dB-gettersetter)
  - [Data Events Getter/Setter](#data-events-gettersetter)
  - [Data Callbacks Getter/Setter](#data-callbacks-gettersetter)
  - [Services Getter/Setter](#services-gettersetter)
  - [Service Events Getter/Setter](#service-events-gettersetter)
  - [Service Event Callbacks Getter/Setter](#service-event-callbacks-gettersetter)
  - [Enabled Getter/Setter](#enabled-gettersetter)
- [Methods - Getters/Setters](#methods---getterssetters)
  - [Set DB](#set-db)
  - [Unset DB](#unset-db)
  - [Set Data Property](#set-data-property)
  - [Unset Data Property](#unset-data-property)
  - [Set Defaults](#set-defaults)

- [Methods - Interface](#methods---interface)
  - [Get](#get)
  - [Set](#set)
  - [Unset](#unset)
  - [Enable Service Events](#enable-service-events)
  - [Disable Service Events](#disable-service-events)
  - [Enable Data Events](#enable-data-events)
  - [Disable Data Events](#disable-data-events)
  - [Enable Mediators](#enable-mediators)
  - [Disable Mediators](#disable-mediators)
  - [Enable](#enable)
  - [Disable](#disable)
  - [Parse](#parse)

## Settings
### Schema
Type: `Object`  
Required: `false`  

### Defaults
Type: `Object`  
Required: `false`

### Data
Type: `Object`  
Required: `false`  

### Services
Type: `Object`  
Required: `false`  

### Service Events
Type: `Object`  
Required: `false`  
Service Event definitions.  

### Service Callbacks
Type: `Object`  
Required: `false`  
Service Event Callback definitions.  

### Local Storage
Type: `Object`  
Required: `false`  

## Properties - Getters/Setters
### Validator Getter/Setter
### Is Setting Getter/Setter
### Get Changing
### Local Storage Getter/Setter
**Set**  
Type: `Object`  
Defines class's `localStorage` property.  
```
{
  endpoint: '/ui',
}
```
*Endpoint*  
Type: 'string'  
Required: `true`  
Unique string identifier indicating which key to perform Local Storage get/set/clear operations against.  

**Get**  
Type: `Object`  
Returns the class's `localStorage` property.  

### Defaults Getter/Setter
**Set Defaults**  
Type: `Object`  
Defaults that are applied to the class's `data` property in absence of defined values.  

**Get Defaults**  
Type: `Object`  
Returns the class's `defaults` property.  

### Histiogram Getter/Setter
**Set Histiogram**  
Type: `Object`  
Defines class's `histiogram` property.  
```
{
  length: 1,
}
```
*Length*  
Type: 'number'  
Required: `true`  
Number indicating how many historical entries of class's `data` property to store in array for the currently enabled state.  

**Get Histiogram**  
Type: `Object`  
Returns the class's `histiogram` property.  

### History Getter/Setter
**Set History**  
Type: `Object`  
Stores historical instances of the class's `data` value. It is configured with the class's `histiogram` value.  
**Get History**  

### DB Getter/Setter
**Set DB**  
Type: `Object`  
Sets a Local Storage item using the class's `localStorage` property.  
**Get DB**  
Type: `Object`  
Returns a Local Storage Item using the class's `localStorage property.  
`
### Data Events Getter/Setter
**Set Data Events**  
Type: `Object`  



### Data Callbacks Getter/Setter

### Services Getter/Setter

### Service Events Getter/Setter

### Service Event Callbacks Getter/Setter

### Enabled Getter/Setter
## Methods - Getters/Setters
### Set DB
### Unset DB
### Set Data Property
Defines Getter/Setter properties on the class's `data` object. When the provided property key already exists, it assign the provided property.  

When the class's `schema` property is provided, the class's `data` property is validated against the schema's settings. When the class's `schema` property is present and a `key`/`value` arguments are provided that do not match a validator's property, the provided arguments are not set.  

The class's `isSetting` property is used to determine when all provided properties are set. While the class's `data` object is setting, it's `changing` object is defined to retain the `key`/`value` pairs until finished setting.  

After the class's `data` object is updated with provided `key`/`value` arguments, two emissions are executed: an emission describing the set `key`/`value` pair, and an emission describing a completed set of *all* provided key/value pairs.

When the class's `localStorage` property is present, the class's `setDB` method is called to store the new properties.  

**Arguments**  
`(key, value)`  
*Key*  
Type: `String`  
Name of getter/setter key to define on class's `data` object.  

*Value*  
Type: `[Array, String, Number, Object, Boolean]`  
Name of getter/setter key to define on class's `data` object.  

### Unset Data Property
**Arguments**  
`(key)`  
Type: `String`  
Required: `true`  
Deletes the getter/setter methods on the class's data property and emits `unset:key` and `unset` events.  

### Set Defaults
When present, sets the class's `defaults` and `localStorage` properties to the `data` object.  

## Methods - Interface
### Get
Returns either the class's `data` object or a single `data` object property.  
**Arguments**  
`()`  
*undefined*  
Type: `String`  
Returns the class's `data` property.  

`(key)`  
*key*  
Type: `[String, Object, Array, Number, Boolean]`  
Returns a property of the class's `data` object that matches `key` argument.  

### Set
Assigns either all provided `data` argument's properties, or a single `key`/`value` pair describing a property, to the class's `data` object.  

When the `data` argument is provided, the class's `isSetting` property is `true` until all the arguments are set.  

After the class's `data` object is set with the provided `data` or `key`/`value` pair arguments, if a `validator` is present the new data object will be validated. An emission occurs describing the validation results.  

**Arguments**  
`(data)`  
*data*  
Type: `Object`  
Key/Value pairs assigned to the class's `data` property.  

`(key, value)`  
*key*  
Type: `String`  
Key name assigned to class's `data` property for defining `value` argument.  
*value*  
Type: `[String, Object, Array, Number, Boolean]`  
Value assigned to assigned `key` argument.  

### Unset
Unsets either all the class's `data` object properties, or a single provided key. After properties are unset from the class's `data` object, there are two emissions: a single `unset` emission after all properties are complete, and `unset:key` emissions for each property unset.  

**Arguments**  
`()`  
*undefined*  
When no argument is provided, all properties are deleted from the class's `data` object.  

`(key)`  
*key*  
When key is provided, the matching property on the class's `data` object is delted.

### Enable Service Events
Binds callback functions to target services.  

### Disable Service Events
Unbinds callback functions from target services.  

### Enable Data Events
Binds callback functions to the class.  

### Disable Data Events
Unbinds callback functions from the class.  

### Enable Mediators
Binds callback functions to target mediators.  

### Disable Mediators
Unbinds callback functions from target mediators.  

### Enable
Enables class by applying properties from class constructor's `settings` argument and executing other enable methods for `serviceEvents`, `dataEvents`, and `mediators`.  

### Disable
Disables all settings on the model by deleting properties and executing other disable methods for `serviceEvents`, `dataEvents`, and `mediators`.  

### Parse
**Return**  
Type: `Object`  
Returns a JSON-formatted object representation of the class's `data` property.  
