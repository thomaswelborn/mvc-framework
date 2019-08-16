MVC.Utils.isArray = function isArray(object) { return Array.isArray(object) }
MVC.Utils.isObject = function isObject(object) {
  return (
    !Array.isArray(object) &&
    object !== null
  ) ? typeof object === 'object'
    : false
}
MVC.Utils.typeOf = function typeOf(value) {
  return (typeof valueA === 'object')
    ? (MVC.Utils.isObject(valueA))
      ? 'object'
      : (MVC.Utils.isArray(valueA))
        ? 'array'
        : (valueA === null)
          ? 'null'
          : undefined
    : typeof value
}
MVC.Utils.isHTMLElement = function isHTMLElement(object) {
  return object instanceof HTMLElement
}
