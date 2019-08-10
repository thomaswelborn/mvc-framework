MVC.Controller = class extends MVC.Base {
  constructor() {
    super(...arguments)
  }
  get _emitterCallbacks() {
    this.emitterCallbacks = (this.emitterCallbacks)
      ? this.emitterCallbacks
      : {}
    return this.emitterCallbacks
  }
  set _emitterCallbacks(emitterCallbacks) {
    this.emitterCallbacks = MVC.Utils.addPropertiesToObject(
      emitterCallbacks, this._emitterCallbacks
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
  get _routerEvents() {
    this.routerEvents = (this.routerEvents)
      ? this.routerEvents
      : {}
    return this.routerEvents
  }
  set _routerEvents(routerEvents) {
    this.routerEvents = MVC.Utils.addPropertiesToObject(
      routerEvents, this._routerEvents
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
  get _emitterEvents() {
    this.emitterEvents = (this.emitterEvents)
      ? this.emitterEvents
      : {}
    return this.emitterEvents
  }
  set _emitterEvents(emitterEvents) {
    this.emitterEvents = MVC.Utils.addPropertiesToObject(
      emitterEvents, this._emitterEvents
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
  enableModelEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.modelEvents, this.models, this.modelCallbacks)
  }
  disableModelEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.modelEvents, this.models, this.modelCallbacks)
  }
  enableViewEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.viewEvents, this.views, this.viewCallbacks)
  }
  disableViewEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.viewEvents, this.views, this.viewCallbacks)
  }
  enableControllerEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks)
  }
  disableControllerEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks)
  }
  enableEmitterEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.emitterEvents, this.emitters, this.emitterCallbacks)
  }
  disableEmitterEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.emitterEvents, this.emitters, this.emitterCallbacks)
  }
  enableRouterEvents() {
    MVC.Utils.bindEventsToTargetObjects(this.routerEvents, this.routers, this.routerCallbacks)
  }
  disableRouterEvents() {
    MVC.Utils.unbindEventsFromTargetObjects(this.routerEvents, this.routers, this.routerCallbacks)
  }
  enable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      if(settings.modelCallbacks) this._modelCallbacks = settings.modelCallbacks
      if(settings.viewCallbacks) this._viewCallbacks = settings.viewCallbacks
      if(settings.controllerCallbacks) this._controllerCallbacks = settings.controllerCallbacks
      if(settings.emitterCallbacks) this._emitterCallbacks = settings.emitterCallbacks
      if(settings.routerCallbacks) this._routerCallbacks = settings.routerCallbacks
      if(settings.models) this._models = settings.models
      if(settings.views) this._views = settings.views
      if(settings.controllers) this._controllers = settings.controllers
      if(settings.emitters) this._emitters = settings.emitters
      if(settings.routers) this._routers = settings.routers
      if(settings.modelEvents) this._modelEvents = settings.modelEvents
      if(settings.viewEvents) this._viewEvents = settings.viewEvents
      if(settings.controllerEvents) this._controllerEvents = settings.controllerEvents
      if(settings.emitterEvents) this._emitterEvents = settings.emitterEvents
      if(settings.routerEvents) this._routerEvents = settings.routerEvents
      if(
        this.modelEvents &&
        this.models &&
        this.modelCallbacks
      ) {
        this.enableModelEvents()
      }
      if(
        this.viewEvents &&
        this.views &&
        this.viewCallbacks
      ) {
        this.enableViewEvents()
      }
      if(
        this.controllerEvents &&
        this.controllers &&
        this.controllerCallbacks
      ) {
        this.enableControllerEvents()
      }
      if(
        this.routerEvents &&
        this.routers &&
        this.routerCallbacks
      ) {
        this.enableRouterEvents()
      }
      if(
        this.emitterEvents &&
        this.emitters &&
        this.emitterCallbacks
      ) {
        this.enableEmitterEvents()
      }
      this._enabled = true
    }
  }
  reset() {
    this.disable()
    this.enable()
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
        this.disableModelEvents()
      }
      if(
        this.viewEvents &&
        this.views &&
        this.viewCallbacks
      ) {
        this.disableViewEvents()
      }
      if(
        this.controllerEvents &&
        this.controllers &&
        this.controllerCallbacks
      ) {
        this.disableControllerEvents()
      }}
      if(
        this.routerEvents &&
        this.routers &&
        this.routerCallbacks
      ) {
        this.disableRouterEvents()
      }
      if(
        this.emitterEvents &&
        this.emitters &&
        this.emitterCallbacks
      ) {
        this.disableEmitterEvents()
        delete this._modelCallbacks
        delete this._viewCallbacks
        delete this._controllerCallbacks
        delete this._emitterCallbacks
        delete this._routerCallbacks
        delete this._models
        delete this._views
        delete this._controllers
        delete this._emitters
        delete this._routers
        delete this._routerEvents
        delete this._modelEvents
        delete this._viewEvents
        delete this._controllerEvents
        delete this._emitterEvents
      this._enabled = false
    }
  }
}
