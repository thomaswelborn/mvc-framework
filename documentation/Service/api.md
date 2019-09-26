# MVC | Service

- [Instantiation](./instantiation.md)

**Contents**  
- [Settings](#settings)
  - [Defaults](#defaults)
  - [Response Type](#response-type)
  - [Type](#type)
  - [URL](#url)
  - [Headers](#headers)
  - [Data](#data)
- [Properties - Getters/Setters](#properties---gettersetter)
  - [Defaults - Getter](#defaults---getter)
  - [Response Types - Getter](#response-types---getter)
  - [Response Type - Getter/Setter](#response-type---gettersetter)
  - [Response URL - Getter/Setter](#response-url---gettersetter)
  - [Heaaders - Getter/Setter](#heaaders---gettersetter)
  - [Data - Getter/Setter](#data---gettersetter)
  - [XHR - Getter/Setter](#xhr---gettersetter)
  - [XHR - Getter](#xhr---getter)
  - [Enabled - Getter/Setter](#enabled---gettersetter)
- [Methods - Interface](#methods---interface)
  - [Request](#request)
  - [Enable](#enable)
  - [Disable](#disable)

## Settings
### Defaults
Type: `Object`  
Required: `false`  

### Response Type
Type: `arraybuffer`, `blob`, `document`, `json`, `text`  
Required: `false`  

### Type
Type: `GET`, `SET`, `DELETE`, `PUT`  
Required: `false`  

### URL
Type: `String`  
Required: `false`  

### Headers
Type: `Array`  
Required: `false`  
```
[
  { headerName: 'header-settings'},
]
```
*Header Name*  
Type: `String`  
Required: `true`  

*Header Settings*  
Type: `Object`  
Required: `true`  

### Data
Type: `Object`  
Required: `false`  


## Properties - Getter/Setter
### Defaults - Getter
**Get Defaults**  
Default values are overridden by provided `headers` and `responseType` settings.  
Type: `Object`  
```
{
  contentType: {'Content-Type': 'application/json'},
  responseType: 'json',
}
```
*Content Type*  
Default header to perform requests with.  

*Response Type*  
Default XHR Response Type.  

### Response Types - Getter
Type: Array  
Returns an array of valid response types: `arraybuffer`, `blob`, `document`, `json`, `text`.  

### Response Type - Getter/Setter
*Response Type Setter*  
Type: `String`  
Sets the XHR Request `responseType` option when it matches one of the class's `responseTypes` values.  

*Response Type Getter*  
Type: `String`  
Returns provided value that matches `responseTypes`.  

### URL - Getter/Setter
*URL - Setter*  
Type: `String`  
Sets the URL used by the class's `xhr` property when performing requests.  

*URL - Getter*  
Type: `String`  
Returns the URL used by the class's `xhr` property.  

### Heaaders - Getter/Setter
*Headers Setter*  
Type: `Object`  
Pushes provided Header Name/Header Value in an array and sets the values with XHR's `setRequestHeader` method.  
```
{
  'Header-Name': 'Header-Value'
}
```

*Headers Getter*  
Returns an array of Key/Value pairs that represent an XHR request's Header Name and Header Value.  
Type: `Array`  


### Data - Getter/Setter
### XHR - Getter
Returns a Promise where the a newly-formed XMLHttpRequest using the class's `responseType`, `url`, and `headers` properties.  

### Enabled Getter/Setter
**Set Enabled**  
Type: `Boolean`  
Sets `true` after the class's `enable` method is executed; sets `false` after `disable` method.  

**Get Enabled**  
Type: `Boolean`  
Returns the true/false `enabled` state.  

## Method - Interface
### Request
**Arguments**  
`()`  
`(data)`  
*Undefined*  
When there are no arguments, the request is performed without data.  

*Data*  
Type: `Object`  
Required: `false`  
When provided, the object is passed to the XHR's `request` method.  

### Enable
Sets the class's `type`, `url`, `data`, and `responseType` from provided settings.  

### Disable
Deletes previously enabled properties.  
