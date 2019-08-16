MVC.Mediators.Navigate = class extends MVC.Mediator {
  constructor() {
    super(...arguments)
    this.addSettings()
    this.enable()
  }
  addSettings() {
    this._name = 'navigate'
    this._schema = {
      oldURL: {
        type: 'string',
      },
      newURL: {
        type: 'string',
      },
      currentRoute: {
        type: 'string',
      },
      currentController: {
        type: 'string',
      },
    }
  }
}
