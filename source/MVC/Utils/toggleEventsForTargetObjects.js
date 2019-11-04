MVC.Utils.toggleEventsForTargetObjects = function toggleEventsForTargetObjects(
  toggleMethod,
  events,
  targetObjects,
  callbacks
) {
  Object.entries(events)
    .forEach(([eventSettings, eventCallbackName]) => {
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
          ? 'on'
          : 'off'
        let eventCallback = MVC.Utils.objectQuery(
          eventCallbackName,
          callbacks
        )[0][1]
        eventTarget[eventMethodName](eventName, eventCallback)
      }
    })
}
