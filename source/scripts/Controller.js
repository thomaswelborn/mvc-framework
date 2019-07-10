MVC.Controller = class extends MVC.Events {
  constructor(settings) {
    super()
    if(this.settings) this.settings = settings
  }
  get settings() { return this._settings }
  set settings(settings) {
    this._settings = settings
    if(this.settings.models) this._models = models
    if(this.settings.views) this._views = views
    if(this.settings.controllers) this._controllers = controllers
    if(this.settings.routers) this._routers = routers
    if(this.settings.emitters) this._emitters = emitters
    if(this.settings.callbacks) this._callbacks = callbacks
    if(this.settings.events) this._events = events
  }
  get _models() { return this.models || {} }
  set _models(models) { this.models = models }
  get _views() { return this.views || {} }
  set _views(views) { this.views = views }
  get _controllers() { return this.controllers || {} }
  set _controllers(controllers) { this.controllers = controllers }
  get _routers() { return this.routers || {} }
  set _routers(routers) { this.routers = routers }
  get _emitters() { return this.emitters || {} }
  set _emitters(emitters) { this.emitters = emitters }
  get _callbacks() { return this.callbacks || {} }
  set _callbacks(callbacks) { this.callbacks = callbacks }
  get _events() { return this.events || {} }
  set _events(events) {
    for(let [eventSettings, eventCallback] of Object.entries(events)) {
      let eventData = eventSettings.split(' ')
      let eventTarget = eventData[0].replace('@', '').split('.')
      let eventName = eventData[1]
      eventCallback = eventCallback.replace('@', '').split('.')
      this[eventTarget].on(eventName, eventCallback)
    }
  }
}
