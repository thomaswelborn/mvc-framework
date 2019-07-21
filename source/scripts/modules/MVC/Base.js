MVC.Base = class extends MVC.Events {
  constructor(settings, options, configuration) {
    super()
    if(configuration) this._configuration = configuration
    if(options) this._options = options
    if(settings) this._settings = settings
  }
  get _configuration() {
    this.configuration = (this.configuration)
      ? this.configuration
      : {}
    return this.configuration
  }
  set _configuration(configuration) { this.configuration = configuration }
  get _options() {
    this.options = (this.options)
      ? this.options
      : {}
    return this.options
  }
  set _options(options) { this.options = options }
  get _settings() {
    this.settings = (this.settings)
      ? this.settings
      : {}
    return this.settings
  }
  set _settings(settings) { this.settings = settings }
}
