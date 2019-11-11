const typeOf = function typeOf(data) {
  switch(typeof data) {
    case 'object':
      let _object
      if(
        Array.isArray(data)
      ) {
        return 'array'
      } else if(
        data !== null
      ) {
        return 'object'
      } else if(
        data === null
      ) {
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
