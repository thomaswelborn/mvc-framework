import { isObject } from './is'

const parseNotation = function parseNotation(string) {
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

const parseFragment = function parseFragment(fragment) {
  if(
    fragment.charAt(0) === '/' &&
    fragment.charAt(fragment.length - 1) == '/'
  ) {
    fragment = fragment.slice(1, -1)
    fragment = new RegExp('^'.concat(fragment, '$'))
  }
  return fragment
}

const objectQuery = function objectQuery(
  string,
  context
) {
  let stringData = parseNotation(string)
  if(stringData[0] === '@') stringData.splice(0, 1)
  if(!stringData.length) return context
  context = (isObject(context))
    ? Object.entries(context)
    : context
  return stringData.reduce((object, fragment, fragmentIndex, fragments) => {
    let properties = []
    fragment = parseFragment(fragment)
    for(let [propertyKey, propertyValue] of object) {
      if(propertyKey.match(fragment)) {
        if(fragmentIndex === fragments.length - 1) {
          properties = properties.concat([[propertyKey, propertyValue]])
        } else {
          properties = properties.concat(Object.entries(propertyValue))
        }
      }
    }
    object = properties
    return object
  }, context)
}

export default objectQuery
