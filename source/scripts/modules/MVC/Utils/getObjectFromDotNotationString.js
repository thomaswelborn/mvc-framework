MVC.Utils.getObjectFromDotNotationString = function getObjectFromDotNotationString(
  string,
  context
) {
  let object = string
    .split('.')
    .reduce(
      (accumulator, currentValue) => {
        currentValue = (currentValue[0] === '/')
          ? new RegExp(currentValue.replace(new RegExp('/', 'g'), ''))
          : currentValue
        for(let [contextKey, contextValue] of Object.entries(context)) {
          if(currentValue instanceof RegExp) {
            if(currentValue.test(contextKey)) {
              accumulator[contextKey] = contextValue
            }
          } else {
            if(currentValue === contextKey) {
              accumulator[contextKey] = contextValue
            }
          }
        }
        return accumulator
      }, {})
  return object
}
