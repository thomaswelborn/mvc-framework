const isArray = function isArray(object) { return Array.isArray(object) }
const isObject = function isObject(object) {
  return (
    !Array.isArray(object) &&
    object !== null
  ) ? typeof object === 'object'
    : false
}
const isHTMLElement = function isHTMLElement(object) {
  return object instanceof HTMLElement
}
export {
  isArray,
  isObject,
  isHTMLElement,
}
