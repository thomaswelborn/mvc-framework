MVC.Model = class extends MVC.Events {
  constructor(settings) {
    super()
  }
  get data() {
    this._data = (this._data)
    ? this._data
    : {}
  }
}
