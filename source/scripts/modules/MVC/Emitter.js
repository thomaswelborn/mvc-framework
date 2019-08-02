MVC.Emitter = class extends MVC.Model {
  constructor() {
    super(...arguments)
    if(this.settings) {
      if(this.settings.name) this._name = this.settings.name
    }
  }
  get _name() { return this.name }
  set _name(name) { this.name = name }
  emission() {
    this.emit(
      this.name,
      {
        name: this.name,
        data: this.parse()
      }
    )
  }
}
