MVC.Utils.isArray = function isArray(object) { return Array.isArray(object) }
MVC.Utils.isObject = function isObject(object) {
  return (!Array.isArray(object))
    ? typeof object === 'object'
    : false
}
MVC.Utils.isEqualType = function isEqualType(valueA, valueB) { return valueA === valueB }
MVC.Utils.isHTMLElement = function isHTMLElement(object) {
  return object instanceof HTMLElement
}
