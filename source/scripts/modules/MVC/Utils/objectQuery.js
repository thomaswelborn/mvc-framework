MVC.Utils.objectQuery = function objectQuery(
  string,
  context
) {
  let stringData = MVC.Utils.objectQuery.parseNotation(string)
  if(stringData[0] === '@') stringData.splice(0, 1)
  context = (MVC.Utils.isObject(context))
    ? Object.entries(context)
    : context
  return stringData.reduce((properties, fragment, fragmentIndex, fragments) => {
    let _properties = []
    fragment = MVC.Utils.objectQuery.parseFragment(fragment)
    for(let [propertyKey, propertyValue] of properties) {
      if(propertyKey.match(fragment)) {
        if(fragmentIndex === fragments.length - 1) {
          _properties = _properties.concat([[propertyKey, propertyValue]])
        } else {
          _properties = _properties.concat(Object.entries(propertyValue))
        }
      }
    }
    properties = _properties
    return properties
  }, context)
  /*
  let stringData = MVC.Utils.objectQuery.parseNotation(string)
  if(stringData[0] === '@') stringData.splice(0, 1)
  let object = Object.entries(context)
    .reduce((properties, [propertyKey, propertyValue], propertyIndex, originalContext) => {
      properties = stringData.reduce((object, fragment, fragmentIndex, originalStringData) => {
        fragment = MVC.Utils.objectQuery.parseFragment(fragment)
        if(propertyKey.match(fragment)) {
          if(fragmentIndex === originalStringData.length - 1) {
            console.log('fragment', fragment)
            console.log('propertyValue', propertyValue)
            return propertyValue
          } else {
            console.log('fragment', fragment)
            console.log('propertyValue', propertyValue)
            return Object.entries(propertyValue)
          }
        }
      }, [])
      console.log('properties', '\n', properties)
      return properties
    }, [])
  console.log('object', object)
  */
  /*
  let stringData = MVC.Utils.objectQuery.parseNotation(string)
  if(stringData[0] === '@') stringData.splice(0, 1)
  stringData.reduce((object, fragment, fragmentIndex, originalStringData) => {
    console.log('-----', '\n', '-----', '\n')
    console.log('input', object)
    fragment = MVC.Utils.objectQuery.parseFragment(fragment)
    let properties = []
    object.forEach(([propertyKey, propertyValue]) => {
      if(propertyKey.match(fragment)) {
        if(fragmentIndex === originalStringData.length - 1) {
          // return propertyValue
          // console.log('propertyValue', propertyValue)
          properties.push(propertyValue)
        } else {
          // return Object.entries(propertyValue)
          // console.log('propertyValue', propertyValue)
          properties.push(Object.entries(propertyValue))
        }
      }
    })
    console.log('output', properties)
    return properties
  }, Object.entries(context))
  */
}
// Parse Notation
MVC.Utils.objectQuery.parseNotation = function parseNotation(string) {
  if(
    string.charAt(0) === '[' &&
    string.charAt(string.length - 1) == ']'
  ) {
    string = string
      .slice(1, -1)
      .split('][')
  } else {
    string = string
      .split('.')
  }
  return string
}
// Parse Fragments
MVC.Utils.objectQuery.parseFragment = function parseFragment(fragment) {
  if(
    fragment.charAt(0) === '/' &&
    fragment.charAt(fragment.length - 1) == '/'
  ) {
    fragment = fragment.slice(1, -1)
    fragment = new RegExp(fragment)
  }
  return fragment
}
