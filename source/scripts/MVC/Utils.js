MVC.Utils = {
  getObjectFromDotNotationString: function(string, context) {
    return string
      .replace('@', '')
      .split('.')
      .reduce((accumulator, currentValue) => accumulator[currentValue], context)
  },
  toggleEventsForTargetObjects: function(toggleMethod, events, targetObjects, callbacks) {
    for(let [eventSettings, eventCallback] of Object.entries(events)) {
      let eventData = eventSettings.split(' ')
      let eventTargetName = eventData[0].replace('@', '')
      let eventTarget = targetObjects[eventTargetName]
      let eventMethodName = (eventTarget instanceof HTMLElement)
        ? (toggleMethod === 'on')
          ? 'addEventListener'
          : 'removeEventListener'
        : (toggleMethod === 'on')
          ? 'on'
          : 'off'
      let eventName = eventData[1]
      let eventCallbackName = eventCallback.replace('@', '')
      eventCallback = callbacks[eventCallbackName]
      eventTarget[eventMethodName](eventName, eventCallback)
    }
  },
  bindEventsToTargetObjects: function() {
    this.toggleEventsForTargetObjects('on', ...arguments)
  },
  unbindEventsFromTargetObjects: function() {
    this.toggleEventsForTargetObjects('off', ...arguments)
  },
  addPropertiesToTargetObject: function() {
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
  },
}
