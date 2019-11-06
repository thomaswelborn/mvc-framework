import { isArray } from './is'
import objectQuery from './objectQuery'

const toggleEventsForTargetViewObjects = function toggleEventsForTargetViewObjects(
  toggleMethod,
  events,
  targetObjects,
  callbacks
) {
  Object.entries(events)
    .forEach((eventSettings, eventCallbackName) => {
      let eventData = eventSettings.split(' ')
      let eventTargetSettings = eventData[0]
      let eventName = eventData[1]
      let eventTargets = objectQuery(
        eventTargetSettings,
        targetObjects
      )
      eventTargets = (!isArray(eventTargets))
        ? [['@', eventTargets]]
        : eventTargets
      for(let [eventTargetName, eventTarget] of eventTargets) {
        let eventMethodName = (toggleMethod === 'on')
          ? 'addEventListener'
          : 'removeEventListener'
        let eventCallback = objectQuery(
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
    })
}
export default toggleEventsForTargetViewObjects
