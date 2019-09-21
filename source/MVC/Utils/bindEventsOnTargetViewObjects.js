MVC.Utils.bindEventsToTargetViewObjects = function bindEventsToTargetViewObjects() {
  this.toggleEventsForTargetViewObjects('on', ...arguments)
}
MVC.Utils.unbindEventsFromTargetViewObjects = function unbindEventsFromTargetViewObjects() {
  this.toggleEventsForTargetViewObjects('off', ...arguments)
}
