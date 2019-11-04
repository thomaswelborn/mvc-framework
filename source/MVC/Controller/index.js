MVC.Controller = class extends MVC.Base {
  constructor() {
    super(...arguments)
  }
  get keyMap() { return [
    'modelCallbacks',
    'viewCallbacks',
    'controllerCallbacks',
    'routerCallbacks',
    'models',
    'views',
    'controllers',
    'routers',
    'modelEvents',
    'viewEvents',
    'controllerEvents',
    'routerEvents'
  ] }
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
  resetModelEvents() {
    return this
      .disableModelEvents()
      .enableModelEvents()
  }
  enableModelEvents() {
    if(
      this.modelEvents &&
      this.models &&
      this.modelCallbacks
    ) {
      MVC.Utils.bindEventsToTargetObjects(this.modelEvents, this.models, this.modelCallbacks)
    }
    return this
  }
  disableModelEvents() {
    if(
      this.modelEvents &&
      this.models &&
      this.modelCallbacks
    ) {
      MVC.Utils.unbindEventsFromTargetObjects(this.modelEvents, this.models, this.modelCallbacks)
    }
    return this
  }
  resetViewEvents() {
    return this
      .disableViewEvents()
      .enableViewEvents()
  }
  enableViewEvents() {
    if(
      this.viewEvents &&
      this.views &&
      this.viewCallbacks
    ) {
      MVC.Utils.bindEventsToTargetObjects(this.viewEvents, this.views, this.viewCallbacks)
    }
    return this
  }
  disableViewEvents() {
    if(
      this.viewEvents &&
      this.views &&
      this.viewCallbacks
    ) {
      MVC.Utils.unbindEventsFromTargetObjects(this.viewEvents, this.views, this.viewCallbacks)
    }
    return this
  }
  resetControllerEvents() {
    return this
      .disableControllerEvents()
      .enableControllerEvents()
  }
  enableControllerEvents() {
    if(
      this.controllerEvents &&
      this.controllers &&
      this.controllerCallbacks
    ) {
      MVC.Utils.bindEventsToTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks)
    }
    return this
  }
  disableControllerEvents() {
    if(
      this.controllerEvents &&
      this.controllers &&
      this.controllerCallbacks
    ) {
      MVC.Utils.unbindEventsFromTargetObjects(this.controllerEvents, this.controllers, this.controllerCallbacks)
    }
    return this
  }
  resetRouterEvents() {
    return this
      .disableRouterEvents()
      .enableRouterEvents()
  }
  enableRouterEvents() {
    if(
      this.routerEvents &&
      this.routers &&
      this.routerCallbacks
    ) {
      MVC.Utils.bindEventsToTargetObjects(this.routerEvents, this.routers, this.routerCallbacks)
    }
    return this
  }
  disableRouterEvents() {
    if(
      this.routerEvents &&
      this.routers &&
      this.routerCallbacks
    ) {
      MVC.Utils.unbindEventsFromTargetObjects(this.routerEvents, this.routers, this.routerCallbacks)
    }
    return this
  }
  enable() {
    let settings = this.settings || {}
    if(
      !this.enabled
    ) {
      this.setProperties(settings || {}, this.keyMap)
      this.enableModelEvents()
      this.enableViewEvents()
      this.enableControllerEvents()
      this.enableRouterEvents()
      this._enabled = true
    }
    return this
  }
  reset() {
    this.disable()
    this.enable()
    return this
  }
  disable() {
    let settings = this.settings
    if(
      this.enabled
    ) {
      this.disableModelEvents()
      this.disableViewEvents()
      this.disableControllerEvents()
      this.disableRouterEvents()
      this.deleteProperties(settings || {}, this.keyMap)
      this._enabled = false
    }
    return this
  }
}
