MVC.Utils.addPropertiesToTargetObject = function addPropertiesToTargetObject() {
  let targetObject
  switch(arguments.length) {
    case 2:
      let properties = arguments[0]
      targetObject = arguments[1]
      for(let [propertyName, propertyValue] of Object.entries(properties)) {
        targetObject[propertyName] = propertyValue
      }
      break
    case 3:
      let propertyName = arguments[0]
      let propertyValue = arguments[1]
      targetObject = arguments[2]
      targetObject[propertyName] = propertyValue
      break
  }
  return targetObject
}
