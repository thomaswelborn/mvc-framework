MVC.Emitters.NavigateEmitter = class extends MVC.Emitter {
  constructor() {
    super(...arguments)
    this.addSettings()
    this.enable()
  }
  addSettings() {
    this._name = 'navigate'
    this._schema = {
      oldURL: String,
      newURL: String,
      currentRoute: String,
      currentController: String,
    }
  }
}
