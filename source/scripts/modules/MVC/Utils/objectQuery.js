MVC.Utils.objectQuery = function objectQuery(
  string,
  context
) {
  let stringData = MVC.Utils.objectQuery.parseStringData(string, context)
  if(stringData[0].test('@')) {
    if(stringData.length === 1) {
      return [
        ['@', context]
      ]
    } else {
      stringData = stringData.slice(1)
      let _context = MVC.Utils.objectQuery.parseContext(stringData, context)
      return _context
    }
  } else {
    throw MVC.TMPL.ObjectQueryStringFormatInvalidRoot()
  }
}
MVC.Utils.objectQuery.parseContext = function(stringData, context) {
  context = (MVC.Utils.isObject(context))
    ? Object.entries(context)
    : context
  return stringData.reduce((properties, fragment, fragmentIndex, fragments) => {
    let _properties = []
    for(let [propertyKey, propertyValue] of properties) {
      if(fragment.test(propertyKey)) {
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
}
MVC.Utils.objectQuery.parseStringData = function(string, context) {
  let stringData = string
    .split('][')
    .map((fragment, fragmentIndex, fragments) => {
      if(fragmentIndex === 0) {
        fragment = (fragment[0] === '[')
          ? fragment.split('').slice(1).join('')
          : fragment
      }
      if(fragmentIndex === fragments.length - 1) {
        fragment = (fragment[fragment.length - 1] === ']')
          ? fragment.split('').slice(0, -1).join('')
          : fragment
      }
      let operator
      if(fragment[0] === '/') {
        fragment = fragment.split('')
        fragment.splice(0, 1)
        switch(fragment[fragment.length - 1]) {
          case '/':
            operator = 'i'
            break
          case ')':
            operator = fragment.splice(-3).slice(1).slice(0, -1)
            break
        }
        fragment.splice(-1)
        fragment = fragment.join('')
        fragment = new RegExp(fragment, operator)
      } else {
        operator = 'i'
        fragment = new RegExp('^'.concat(fragment, '$'), operator)
      }
      return fragment
    })
  return stringData
}
