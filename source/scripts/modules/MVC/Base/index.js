MVC.Base = class extends MVC.Events {
  constructor(settings, configuration) {
    super()
    if(configuration) this._configuration = configuration
    if(settings) this._settings = settings
  }
  get _configuration() {
    this.configuration = (this.configuration)
      ? this.configuration
      : {}
    return this.configuration
  }
  set _configuration(configuration) { this.configuration = configuration }
  get _settings() {
    this.settings = (this.settings)
      ? this.settings
      : {}
    return this.settings
  }
  set _settings(settings) {
    this.settings = MVC.Utils.addPropertiesToObject(
      settings, this._settings
    )
  }
  get _mediators() {
    this.mediators = (this.mediators)
      ? this.mediators
      : {}
    return this.mediators
  }
  set _mediators(mediators) {
    this.mediators = MVC.Utils.addPropertiesToObject(
      mediators, this._mediators
    )
  }
}
