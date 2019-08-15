MVC.Mediators.Validate = class extends MVC.Mediator {
  constructor() {
    super(...arguments)
    this.addSettings()
    this.enable()
  }
  addSettings() {
    this._name = 'validate'
    this._schema = {
      data: {
        type: 'object',
      },
      results: {
        type: 'object',
      },
    }
  }
}
