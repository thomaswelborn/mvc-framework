MVC.Emitter = class extends MVC.Model {
  constructor() {
    super(...arguments)
    this._name = this.settings.name
  }
  get _name() { return this.name }
  set _name(name) { this.name = name }
  get emission() {
    return {
      name: this.name,
      data: this.parse()
    }
  }
}
