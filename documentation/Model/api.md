# MVC | Model

- [Instantiation](./instantiation.md)

**Description**  
The MVC Model class provides methods to manage data. Model data can be get/set/unset, emitting events after individual  properties and an entire property is set.  When Local Storage is enabled, a representation of the class's `data` object is stored using get/set/clear methods.  When a Schema is enabled, properties assigned to the class's `data` object are validated against the schema's definitions.  Histiogram options are available to store the historical state of the currently enabled model.  

**Contents**  
- [Settings](#settings)
  - [Schema](#schema)
  - [Defaults](#defaults)
  - [Data](#data)
  - [Services](#services)
  - [Service Events](#service-events)
  - [Service Callbacks](#service-callbacks)
  - [Local Storage](#local-storage)
- [Properties - Getters/Setters](#properties---getterssetters)
  - [Key Map](#key-map)
  - [Validator Getter/Setter](#validator-gettersetter)
  - [Is Setting Getter/Setter](#is-setting-gettersetter)
  - [Changing Getter](#changing-getter)
  - [Local Storage Getter/Setter](#local-storage-gettersetter)
  - [Defaults Getter/Setter](#defaults-gettersetter)
  - [Histiogram Getter/Setter](#histiogram-gettersetter)
  - [History Getter/Setter](#history-gettersetter)
  - [DB Getter/Setter](#dB-gettersetter)
  - [Data Events Getter/Setter](#data-events-gettersetter)
  - [Data Callbacks Getter/Setter](#data-callbacks-gettersetter)
  - [Services Getter/Setter](#services-gettersetter)
  - [Service Events Getter/Setter](#service-events-gettersetter)
  - [Service Callbacks Getter/Setter](#service-callbacks-gettersetter)
  - [Enabled Getter/Setter](#enabled-gettersetter)
+ [Methods - Getters/Setters](#methods---gettersetters)
  - [Set DB](#set-db)
  - [Unset DB](#unset-db)
  - [Set Data Property](#set-data-property)
  - [Unset Data Property](#unset-data-property)
- [Methods - Interface](#methods---interface)
  - [Get](#get)
  - [Set](#set)
  - [Unset](#unset)
  - [Enable Service Events](#enable-service-events)
  - [Disable Service Events](#disable-service-events)
  - [Enable Data Events](#enable-data-events)
  - [Disable Data Events](#disable-data-events)
  - [Enable](#enable)
  - [Disable](#disable)
  - [Parse](#parse)

## Settings
### Schema
See [Validator Schema](../Validator/index.md#schema)

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

### Service Callbacks
Type: `Object`  
Required: `false`  

### Local Storage
Type: `Object`  
Required: `false`  

## Properties - Getters/Setters
### Key Map Getter
**Get Key Map**  
Type: `Array`  
List of valid class settings in their assignment order.  

### Validator Getter/Setter
**Set Validator**  
Type: `Object`  
Creates a [Validator](../validator/index.md) instance from the provided `schema` object.  

**Get Validator**  
Type: `Object`  
Returns a [Validator](../validator/index.md) instance.  

### Is Setting Getter/Setter
**Set Is Setting**  
Type: `Boolean`  
Value is true when class's `data` object is being set; otherwise false. This property is set by the class's methods.   

**Get Is Setting**  
Type: `Boolean`  
Returns the true/false `enabled` state.  This property is used to determine whether certain actions can be performed during set methods.   

### Changing Getter
**Get Changing**  
Type: `Object`  
Returns an object containing properties currently being set on the class's `data` object.

### Local Storage Getter/Setter
**Set Local Storage**  
Type: `Object`  
Defines class's `localStorage` property.  
```
{
  endpoint: String,
}
```
*Endpoint*  
Type: 'string'  
Required: `true`  
Unique string identifier indicating which key to perform Local Storage get/set/clear operations against.  

**Get Local Storage**  
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
  length: Number,
}
```
*Length*  
Type: 'number'  
Required: `true`  
Number indicating how many historical entries of class's `data` property to store in array for the currently enabled state. Defaults to `1`.  

**Get Histiogram**  
Type: `Object`  
Returns the class's `histiogram` property.  

### History Getter/Setter
**Set History**  
Type: `Object`  
Stores historical instances of the class's `data` value. It is configured with the class's `histiogram` value.  

**Get History**  
Type: `Array`  
Returns an array of the class `data` object's previous definitions.  

### DB Getter/Setter
**Set DB**  
Type: `Object`  
Stores current instance of the class's `data` value, stored as a LocalStorage property. It is configured with the class's `setDB` method.  

**Get DB**  
Type: `Object`  
Returns an object representing the class's `data` value, stored as a LocalStorage property.  

### Data Events Getter/Setter
See [Event Binding](../Events/event-binding.md]).  
**Set Data Events**  
Type: `Object`  
Data Event/Callback binding configuration.  

**Get Data Events**  
Type: `Object`  
Returns an object describing Data Events.  

### Data Callbacks Getter/Setter
See [Event Binding](../Events/event-binding.md]).  
**Set Data Callbacks**  
Type: `Object`  
Named functions executed after defined events.  

**Get Data Callbacks**  
Type: `Object`  
Returns the named callback functions.  

### Services Getter/Setter
See [Event Binding](../Events/event-binding.md]).  
**Set Services**  
Type: `Object`  
Sets named Services.  

**Get Services**  
Type: `Object`  
Returns named Services.  

### Service Events Getter/Setter
See [Event Binding](../Events/event-binding.md]).  
**Set Service Events**  
Type: `Object`  
Sets Service Event/Callback binding configuration.  

**Get Service Events**  
Type: `Object`  
Returns an object describing Service Events.  

### Service Callbacks Getter/Setter
See [Event Binding](../Events/event-binding.md]).  
**Set Service Event Callbacks**  
Type: `Object`  
Sets named functions that execute after class's `services` events.  

**Get Service Event Callbacks**  
Type: `Object`  
Returns an object describing Service Callbacks.

### Enabled Getter/Setter
**Set Enabled**  
Type: `Boolean`  
Value is true after the class's `enable` method is complete; otherwise returns false.  

**Get Enabled**  
Type: `Boolean`  
Returns `true`/`false` value indicating whether the class is currently enabled.  

## Methods - Getters/Setters

### Set DB
**Arguments**  
`(data)`  
*data*  
Type: `Object`  
Key/Value pairs previously set to the class's `data` object now assigned to the `db` object.  

`(key, value)`  
*key*  
Type: `String`  
Key name previously set to class's `data` object now assigned to the `db` object.  
*value*  
Type: `[String, Object, Array, Number, Boolean]`  
Value assigned to assigned `key` argument.  

### Unset DB
**Arguments**  
`()`  
*data*  
Type: `Object`  
When no argument is provided, all properties are deleted from the class's `db` object.  

`(key)`  
*key*  
Type: `String`  
When key is provided, the matching property on the class's `db` object is delted.  

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

### Enable
Enables class by applying properties from class `settings` and executing other enable methods for `serviceEvents`, `dataEvents`, and `mediators`. After all able properties/methods are finished, the class's `enabled` property is set to `true`.  

### Disable
Disables all settings on the model by deleting properties and executing other disable methods for `serviceEvents`, `dataEvents`, and `mediators`. After all able properties/methods are finished, the class's `enabled` property is set to `false`.  

### Parse
**Return**  
Type: `Object`  
Returns a JSON-formatted object representation of the class's `data` property.  
