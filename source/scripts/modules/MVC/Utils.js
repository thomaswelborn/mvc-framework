MVC.Utils = {
  getObjectFromDotNotationString: function(
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
  },
  toggleEventsForTargetObjects(
    toggleMethod,
    events,
    targetObjects,
    callbacks
  ) {
    for(let [eventSettings, eventCallback] of Object.entries(events)) {
      let eventData = eventSettings.split(' ')
      let eventTargetSettings = eventData[0]
      let eventName = eventData[1]
      let eventTargets
      switch(eventTargetSettings[0] === '@') {
        case true:
          eventTargetSettings = eventTargetSettings.replace('@', '')
          eventTargets = (eventTargetSettings)
            ? this.getObjectFromDotNotationString(
              eventTargetSettings,
              targetObjects
            )
            : {
              0: targetObjects,
            }
          break
        case false:
          eventTargets = document.querySelectorAll(eventTargetSettings)
          break
      }
      for(let [eventTargetName, eventTarget] of Object.entries(eventTargets)) {
        let eventTargetMethodName = (toggleMethod === 'on')
          ? (eventTarget instanceof HTMLElement)
            ? 'addEventListener'
            : 'on'
          : (eventTarget instanceof HTMLElement)
            ? 'removeEventListener'
            : 'off'
        let eventCallbacks = (eventCallback.match('@'))
          ? this.getObjectFromDotNotationString(
            eventCallback.replace('@', ''),
            callbacks
          )
          : window[eventCallback]
        for(let eventCallback of Object.values(eventCallbacks)) {
          eventTarget[eventTargetMethodName](eventName, eventCallback)
        }
      }
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
