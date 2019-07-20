MVC.Controller = class extends MVC.Events {
  constructor(settings, options, configuration) {
    super()
    if(configuration) this._configuration = configuration
    if(options) this._options = options
    if(settings) this._settings = settings
  }
  get _configuration() { return this.configuration }
  set _configuration(configuration) { this.configuration = configuration }
  get _options() { return this.options }
  set _options(options) { this.options = options }
  get _settings() {
    this.settings = (this.settings)
      ? this.settings
      : {}
    return this.settings
  }
  set _settings(settings) {
    this.settings = settings
    if(this._settings.emitters) this._emitters = this._settings.emitters
    if(this._settings.modelCallbacks) this._modelCallbacks = this._settings.modelCallbacks
    if(this._settings.viewCallbacks) this._viewCallbacks = this._settings.viewCallbacks
    if(this._settings.controllerCallbacks) this._controllerCallbacks = this._settings.controllerCallbacks
    if(this._settings.routerCallbacks) this._routerCallbacks = this._settings.routerCallbacks
    if(this._settings.models) this._models = this._settings.models
    if(this._settings.views) this._views = this._settings.views
    if(this._settings.controllers) this._controllers = this._settings.controllers
    if(this._settings.routers) this._routers = this._settings.routers
    if(this._settings.modelEvents) this._modelEvents = this._settings.modelEvents
    if(this._settings.viewEvents) this._viewEvents = this._settings.viewEvents
    if(this._settings.controllerEvents) this._controllerEvents = this._settings.controllerEvents
  }
  get _emitters() {
    this.emitters = (this.emitters)
      ? this.emitters
      : {}
    return this.emitters
  }
  set _emitters(emitters) {
    this.emitters = MVC.Utils.addPropertiesToTargetObject(
      emitters, this._emitters
    )
  }
  get _modelCallbacks() {
    this.modelCallbacks = (this.modelCallbacks)
      ? this.modelCallbacks
      : {}
    return this.modelCallbacks
  }
  set _modelCallbacks(modelCallbacks) {
    this.modelCallbacks = MVC.Utils.addPropertiesToTargetObject(
      modelCallbacks, this._modelCallbacks
    )
  }
  get _viewCallbacks() {
    this.viewCallbacks = (this.viewCallbacks)
      ? this.viewCallbacks
      : {}
    return this.viewCallbacks
  }
  set _viewCallbacks(viewCallbacks) {
    this.viewCallbacks = MVC.Utils.addPropertiesToTargetObject(
      viewCallbacks, this._viewCallbacks
    )
  }
  get _controllerCallbacks() {
    this.controllerCallbacks = (this.controllerCallbacks)
      ? this.controllerCallbacks
      : {}
    return this.controllerCallbacks
  }
  set _controllerCallbacks(controllerCallbacks) {
    this.controllerCallbacks = MVC.Utils.addPropertiesToTargetObject(
      controllerCallbacks, this._controllerCallbacks
    )
  }
  get _routerCallbacks() {
    this.routerCallbacks = (this.routerCallbacks)
      ? this.routerCallbacks
      : {}
    return this.routerCallbacks
  }
  set _routerCallbacks(routerCallbacks) {
    this.routerCallbacks = MVC.Utils.addPropertiesToTargetObject(
      routerCallbacks, this._routerCallbacks
    )
  }
  get _models() {
    this.models = (this.models)
      ? this.models
      : {}
    return this.models
  }
  set _models(models) {
    this.models = MVC.Utils.addPropertiesToTargetObject(
      models, this._models
    )
  }
  get _views() {
    this.views = (this.views)
      ? this.views
      : {}
    return this.views
  }
  set _views(views) {
    this.views = MVC.Utils.addPropertiesToTargetObject(
      views, this._views
    )
  }
  get _controllers() {
    this.controllers = (this.controllers)
      ? this.controllers
      : {}
    return this.controllers
  }
  set _controllers(controllers) {
    this.controllers = MVC.Utils.addPropertiesToTargetObject(
      controllers, this._controllers
    )
  }
  get _routers() {
    this.routers = (this.routers)
      ? this.routers
      : {}
    return this.routers
  }
  set _routers(routers) {
    this.routers = MVC.Utils.addPropertiesToTargetObject(
      routers, this._routers
    )
  }
  set _modelEvents(modelEvents) {
    MVC.Utils.bindEventsToTargetObjects(modelEvents, this._models, this._modelCallbacks)
  }
  set _viewEvents(viewEvents) {
    MVC.Utils.bindEventsToTargetObjects(viewEvents, this._views, this._viewCallbacks)
  }
  set _controllerEvents(controllerEvents) {
    MVC.Utils.bindEventsToTargetObjects(controllerEvents, this._controllers, this._controllerCallbacks)
  }
}
