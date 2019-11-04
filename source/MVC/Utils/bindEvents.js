MVC.Utils.bindEventsToTargetViewObjects = function bindEventsToTargetViewObjects() {
  this.toggleEventsForTargetViewObjects('on', ...arguments)
}
MVC.Utils.unbindEventsFromTargetViewObjects = function unbindEventsFromTargetViewObjects() {
  this.toggleEventsForTargetViewObjects('off', ...arguments)
}
MVC.Utils.bindEventsToTargetObjects = function bindEventsToTargetObjects() {
  this.toggleEventsForTargetObjects('on', ...arguments)
}
MVC.Utils.unbindEventsFromTargetObjects = function unbindEventsFromTargetObjects() {
  this.toggleEventsForTargetObjects('off', ...arguments)
}
