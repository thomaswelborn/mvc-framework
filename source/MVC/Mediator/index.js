MVC.Mediator = class extends MVC.Model {
  constructor() {
    super(...arguments)
    this.on('set', (event) => {
      this.emit(
        this.name,
        {
          name: this.name,
          data: event.data
        },
        this
      )
    })
    return this
  }
}
