MVC.Utils.toggleEventsForTargetViewObjects = function toggleEventsForTargetViewObjects(
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
    eventTargets = (!MVC.Utils.isArray(eventTargets))
      ? [['@', eventTargets]]
      : eventTargets
    for(let [eventTargetName, eventTarget] of eventTargets) {
      let eventMethodName = (toggleMethod === 'on')
        ? 'addEventListener'
        : 'removeEventListener'
      let eventCallback = MVC.Utils.objectQuery(
        eventCallbackName,
        callbacks
      )[0][1]
      if(eventTarget instanceof NodeList) {
        for(let _eventTarget of eventTarget) {
          _eventTarget[eventMethodName](eventName, eventCallback)
        }
      } else if(eventTarget instanceof HTMLElement) {
        eventTarget[eventMethodName](eventName, eventCallback)
        } else {
        eventTarget[eventMethodName](eventName, eventCallback)
      }
    }
  }
}
