# MVC | View

- [Instantiation](./instantiation.md)

**Description**  
The MVC View class provides methods for managing markup.

**Contents**  
[Settings](#settings)
[Properties - Getters/Setters](#properties---getterssetters)
  - [Element Key Map Getter](#element-key-map-getter)
  - [UI Key Map Getter](#ui-key-map-getter)
  - [Element Name Getter/Setter](#element-name-gettersetter)
  - [Element Getter/Setter](#element-gettersetter)
  - [Attributes Getter/Setter](#attributes-gettersetter)
  - [UI Getter/Setter](#ui-gettersetter)
  - [UI Events Getter/Setter](#ui-events-gettersetter)
  - [UI Callbacks Getter/Setter](#ui-callbacks-gettersetter)
  - [Observer Callbacks](#observer-callbacks)
  - [Element Observer Getter](#element-observer)
  - [Insert Getter/Setter](#insert-gettersetter)
  - [Enabled Getter/Setter](#enabled-gettersetter)
  - [Templates Getter/Setter](#templates-gettersetter)
[Methods - Interface](#methods---interface)
  - [Element Observe](#element-observe)
  - [Auto Insert](#auto-insert)
  - [Auto Remove](#auto-remove)
  - [Enable Element](#enable-element)
  - [Disable Element](#disable-element)
  - [Reset UI](#reset-ui)
  - [Enable UI](#enable-ui)
  - [Disable UI](#disable-ui)
  - [Enable UI Events](#enable-ui-events)
  - [Disable UI Events](#disable-ui-events)
  - [Enable Mediators](#enable-mediators)
  - [Disable Mediators](#disable-mediators)
  - [Enable](#enable)
  - [Disable](#disable)

## Settings
### Element Name
Type: `String`  
Required: `false`  

### Element
Type: `HTMLElement`  
Required: `false`  

### Attributes
Type: `Object`  
Required: `false`

### Templates
Type: `Object`  
Required: `false`

### UI
Type: `Object`  
Required: `false`

### UI Events
Type: `Object`  
Required: `false`

### UI Callbacks
Type: `Object`  
Required: `false`

### Insert
Type: `Object`  
Required: `false`

## Properties - Getters/Setters
### Element Key Map Getter
**Get Element Key Map Getter**  
Type: `Array`  
List of valid class element settings in their assignment order.  

### UI Key Map Getter
**Get UI Key Map Getter**  
Type: `Array`  
List of valid class UI settings in their assignment order.  

### Element Name Getter/Setter
**Set Element Name**  
Type: `String`  
String name of an HTML element, such as `div`, that becomes the class's `element` HTML Element.  The `document.createElement` method generates an `HTMLElement`.  

**Get Element Name**  
Type: `String`
Returns the class's `element.tagName` property.  

### Element Getter/Setter
**Set Element**  
Type: [`String`, `HTMLElement`, `Document`]  

**Get Element**  
Returns an `HTMLElement` representing the class.  

### Attributes Getter/Setter
**Set Attributes**  
Type: `Object`  
...
```
{
  [attributeName]: String,
}
```
*attributeName*  
Type: `String`  
Required: `true`  
Attribute Key/Value  to assign to class's `element.attributes`

**Get Attributes**  
Type: `Object`  
Returns the class `element.attributes` value.  

### UI Getter/Setter
**Set UI**  
Type: `Object`  
```
{
  [queryName]: [`String`, `HTMLElement`],
}
```
*Query Name*  
When a string is provided, a query is performed on the class's `element`. When an HTMLElement is provided it is directly assigned to key.  
Type: [`String`, `HTMLElement`]  

**Get UI**  
Type: `NodeList`  
Returns named Node List results from document query selection.  

### UI Events Getter/Setter
See [Event Binding](../Events/event-binding.md]).  
**Set UI Events**  
Type: `Object`  
UI Event/Callback binding configuration.  

**Get UI Events**  
Type: `Object`  
Returns an object describing UI Events.  

### UI Callbacks Getter/Setter
**Set UI Callbacks**  
Type: `Object`  
Named functions executed after defined events.  

**Get UI Callbacks**  
Type: `Object`  
Returns the named callback functions.  

### Observer Callbacks
**Set Observer Callbacks**  
Type: `Object`  
Named functions executed after defined events.  

**Get Observer Callbacks**  
Type: `Object`  
Returns the named callback functions.  

### Element Observer Getter
**Get Element Observer**  
Type: `Object`  
Returns Mutation Observer instance for the class's element.  

### Insert Getter/Setter
**Set Insert**  
Type: `Object`  
```
{
  element: [String, HTMLElement],
  method: ['beforebegin', 'afterbegin', 'beforeend', 'afterend'],
}
```
*Element*  
Required: `true`  
Query Selector string of document element or an HTML Element.  

*Method*  
Required: `true`  
String value of `document.insertAdjacentElement` `position` argument.  

**Get Insert**  
Type: `Object`  
Returns the `insert` settings.  

### Enabled Getter/Setter
**Set Enabled**  
Type: `Boolean`  
Sets `true` after the class's `enable` method is executed; sets `false` after `disable` method.  

**Get Enabled**  
Type: `Boolean`  
Returns the true/false `enabled` state.  

### Templates Getter/Setter
**Get Template**  

## Methods - Interface
### Element Observe
Iterates through a Mutation Record List and executes the class's `resetUI` method when Child Nodes are added/removed from the `element`. Resetting the UI after changes to the `element` markup ensures that the `ui` object always represents that current markup state.  

### Auto Insert
Automatically insert the class's `element` into the DOM using `insert` settings with the `element.insertAdjacentElement` method.  

### Auto Remove
Automatically remove the class's `element` instance in the DOM by executing `element.parentElement.removeChild`.  

### Enable Element
Applies the class's `elementName`, `element`, `attributes`, `templates`, `insert` properties.  

### Disable Element
Deletes the class's `elementName`, `element`, `attributes`, `templates`, `insert` properties.  

### Reset UI
Executes class's `disableUI` method followed by the `enableUI` method.  

### Enable UI
Sets the class's `ui` property and executes `enableUIEvents`.  

### Disable UI
Deletes the class's `ui` property and executes `disableUIEvents`.  

### Enable UI Events
Binds callback functions to the class.  

### Disable UI Events
Unbinds callback functions from the class.  

### Enable Mediators
Binds callback functions to target mediators.  

### Disable Mediators
Unbinds callback functions from target mediators.  

### Enable
Enables class by applying properties from class `settings` and executing other enable methods for `serviceEvents`, `dataEvents`, and `mediators`. After all able properties/methods are finished, the class's `enabled` property is set to `true`.  

### Disable
Disables all settings on the model by deleting properties and executing other disable methods for `serviceEvents`, `dataEvents`, and `mediators`. After all able properties/methods are finished, the class's `enabled` property is set to `false`.  
