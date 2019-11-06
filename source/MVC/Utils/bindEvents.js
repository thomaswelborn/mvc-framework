import toggleEventsForTargetObjects from './toggleEventsForTargetObjects'
import toggleEventsForTargetViewObjects from './toggleEventsForTargetViewObjects'

const bindEventsToTargetViewObjects = function bindEventsToTargetViewObjects() {
  toggleEventsForTargetViewObjects('on', ...arguments)
}
const unbindEventsFromTargetViewObjects = function unbindEventsFromTargetViewObjects() {
  toggleEventsForTargetViewObjects('off', ...arguments)
}
const bindEventsToTargetObjects = function bindEventsToTargetObjects() {
  toggleEventsForTargetObjects('on', ...arguments)
}
const unbindEventsFromTargetObjects = function unbindEventsFromTargetObjects() {
  toggleEventsForTargetObjects('off', ...arguments)
}
export {
  bindEventsToTargetViewObjects,
  unbindEventsFromTargetViewObjects,
  bindEventsToTargetObjects,
  unbindEventsFromTargetObjects
}
