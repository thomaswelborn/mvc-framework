import { isArray, isObject } from './is'
const typeOf = function typeOf(data) {
  switch(typeof data) {
    case 'object':
      let _object
      if(isArray(data)) {
        // Array
        return 'array'
      } else if(
        isObject(data)
      ) {
        // Object
        return 'object'
      } else if(
        data === null
      ) {
        // Null
        return 'null'
      }
      return _object
    case 'string':
    case 'number':
    case 'boolean':
    case 'undefined':
    case 'function':
      return typeof data
      break
  }
}
export default typeOf
