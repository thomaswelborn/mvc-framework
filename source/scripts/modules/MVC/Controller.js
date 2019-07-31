MVC.Controller = class extends MVC.Base {
  constructor() {
    super(...arguments)
    this.enable()
  }
  get _emitters() {
    this.emitters = (this.emitters)
      ? this.emitters
      : {}
    return this.emitters
  }
  set _emitters(emitters) {
    this.emitters = MVC.Utils.addPropertiesToObject(
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
    this.modelCallbacks = MVC.Utils.addPropertiesToObject(
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
    this.viewCallbacks = MVC.Utils.addPropertiesToObject(
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
    this.controllerCallbacks = MVC.Utils.addPropertiesToObject(
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
    this.routerCallbacks = MVC.Utils.addPropertiesToObject(
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
    this.models = MVC.Utils.addPropertiesToObject(
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
    this.views = MVC.Utils.addPropertiesToObject(
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
    this.controllers = MVC.Utils.addPropertiesToObject(
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
    this.routers = MVC.Utils.addPropertiesToObject(
      routers, this._routers
    )
  }
  get _modelEvents() {
    this.modelEvents = (this.modelEvents)
      ? this.modelEvents
      : {}
    return this.modelEvents
  }
  set _modelEvents(modelEvents) {
    this.modelEvents = MVC.Utils.addPropertiesToObject(
      modelEvents, this._modelEvents
    )
  }
  get _viewEvents() {
    this.viewEvents = (this.viewEvents)
      ? this.viewEvents
      : {}
    return this.viewEvents
  }
  set _viewEvents(viewEvents) {
    this.viewEvents = MVC.Utils.addPropertiesToObject(
      viewEvents, this._viewEvents
    )
  }
  get _controllerEvents() {
    this.controllerEvents = (this.controllerEvents)
      ? this.controllerEvents
      : {}
    return this.controllerEvents
  }
  set _controllerEvents(controllerEvents) {
    this.controllerEvents = MVC.Utils.addPropertiesToObject(
      controllerEvents, this._controllerEvents
    )
  }
  get _enabled() { return this.enabled || false }
  set _enabled(enabled) { this.enabled = enabled }
  addModelEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.modelEvents, this.models, this.modelCallbacks)
  }
  removeModelEvents() {
    MVC.Utils.unbindEventsToTargetObjects(this.modelEvents, this.models, this.modelCallbacks)
  }
  addViewEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.viewEvents, this.views, this.viewCallbacks)
  }
  removeViewEvents() {
    MVC.Utils.unbindEventsToTargetObjects(this.viewEvents, this.views, this.viewCallbacks)
  }
  addControllerEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks)
  }
  removeControllerEvents() {
    MVC.Utils.unbindEventsToTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks)
  }
  enable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      if(settings.emitters) this._emitters = settings.emitters
      if(settings.modelCallbacks) this._modelCallbacks = settings.modelCallbacks
      if(settings.viewCallbacks) this._viewCallbacks = settings.viewCallbacks
      if(settings.controllerCallbacks) this._controllerCallbacks = settings.controllerCallbacks
      if(settings.routerCallbacks) this._routerCallbacks = settings.routerCallbacks
      if(settings.models) this._models = settings.models
      if(settings.views) this._views = settings.views
      if(settings.controllers) this._controllers = settings.controllers
      if(settings.routers) this._routers = settings.routers
      if(settings.modelEvents) this._modelEvents = settings.modelEvents
      if(settings.viewEvents) this._viewEvents = settings.viewEvents
      if(settings.controllerEvents) this._controllerEvents = settings.controllerEvents
      if(
        this.modelEvents &&
        this.models &&
        this.modelCallbacks
      ) {
        this.addModelEvents()
      }
      if(
        this.viewEvents &&
        this.views &&
        this.viewCallbacks
      ) {
        this.addViewEvents()
      }
      if(
        this.controllerEvents &&
        this.controllers &&
        this.controllerCallbacks
      ) {
        this.addControllerEvents()
      }
      this._enabled = true
    }
  }
  disable() {
    let settings = this.settings
    if(
      settings &&
      this.enabled
    ) {
      if(
        this.modelEvents &&
        this.models &&
        this.modelCallbacks
      ) {
        this.removeModelEvents()
      }
      if(
        this.viewEvents &&
        this.views &&
        this.viewCallbacks
      ) {
        this.removeViewEvents()
      }
      if(
        this.controllerEvents &&
        this.controllers &&
        this.controllerCallbacks
      ) {
        this.removeControllerEvents()
      }
      delete this._emitters
      delete this._modelCallbacks
      delete this._viewCallbacks
      delete this._controllerCallbacks
      delete this._routerCallbacks
      delete this._models
      delete this._views
      delete this._controllers
      delete this._routers
      delete this._modelEvents
      delete this._viewEvents
      delete this._controllerEvents
      this._enabled = false
    }
  }
}
