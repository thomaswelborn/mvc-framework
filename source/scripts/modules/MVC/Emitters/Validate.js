MVC.Emitters.Validate = class extends MVC.Emitter {
  constructor() {
    super(...arguments)
    this.addSettings()
    this.enable()
  }
  addSettings() {
    this._name = 'validate'
    this._schema = {
      data: Object,
      results: Object,
    }
  }
}
