MVC.Controller = class extends MVC.Base {
  constructor() {
    super(...arguments)
    this.addSettings()
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
  addSettings() {
    if(Object.keys(this._settings).length) {
      if(this.settings.emitters) this._emitters = this.settings.emitters
      if(this.settings.modelCallbacks) this._modelCallbacks = this.settings.modelCallbacks
      if(this.settings.viewCallbacks) this._viewCallbacks = this.settings.viewCallbacks
      if(this.settings.controllerCallbacks) this._controllerCallbacks = this.settings.controllerCallbacks
      if(this.settings.routerCallbacks) this._routerCallbacks = this.settings.routerCallbacks
      if(this.settings.models) this._models = this.settings.models
      if(this.settings.views) this._views = this.settings.views
      if(this.settings.controllers) this._controllers = this.settings.controllers
      if(this.settings.routers) this._routers = this.settings.routers
      if(this.settings.modelEvents) this._modelEvents = this.settings.modelEvents
      if(this.settings.viewEvents) this._viewEvents = this.settings.viewEvents
      if(this.settings.controllerEvents) this._controllerEvents = this.settings.controllerEvents
    }
  }
}
