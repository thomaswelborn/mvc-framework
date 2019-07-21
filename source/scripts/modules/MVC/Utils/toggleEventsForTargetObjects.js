MVC.Utils.toggleEventsForTargetObjects = function toggleEventsForTargetObjects(
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
}
MVC.Utils.bindEventsToTargetObjects = function bindEventsToTargetObjects() {
  this.toggleEventsForTargetObjects('on', ...arguments)
}
MVC.Utils.unbindEventsFromTargetObjects = function unbindEventsFromTargetObjects() {
  this.toggleEventsForTargetObjects('off', ...arguments)
}
