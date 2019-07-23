MVC.Utils.toggleEventsForTargetObjects = function toggleEventsForTargetObjects(
  toggleMethod,
  events,
  targetObjects,
  callbacks
) {
  for(let [eventSettings, eventCallbackName] of Object.entries(events)) {
    let eventData = eventSettings.split(' ')
    let eventTargetSettings = eventData[0]
    let eventName = eventData[1]
    let eventTargets = MVC.Utils.objectQuery(
      eventTargetSettings,
      targetObjects
    )
    for(let [eventTargetName, eventTarget] of eventTargets) {
      let eventMethodName = (toggleMethod === 'on')
      ? (eventTarget instanceof HTMLElement)
        ? 'addEventListener'
        : 'on'
      : (eventTarget instanceof HTMLElement)
        ? 'removeEventListener'
        : 'off'
      let eventCallback = MVC.Utils.objectQuery(
        eventCallbackName,
        callbacks
      )[0][1]
      eventTarget[eventMethodName](eventName, eventCallback)
    }
  }
}
MVC.Utils.bindEventsToTargetObjects = function bindEventsToTargetObjects() {
  this.toggleEventsForTargetObjects('on', ...arguments)
}
MVC.Utils.unbindEventsFromTargetObjects = function unbindEventsFromTargetObjects() {
  this.toggleEventsForTargetObjects('off', ...arguments)
}
