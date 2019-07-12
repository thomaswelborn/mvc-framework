MVC.Controller = class extends MVC.Events {
  constructor(settings) {
    super()
    if(this.settings) this.settings = settings
  }
  get _settings() { return this.settings }
  set _settings(settings) {
    this.settings = settings
    if(this._settings.emitters) this._emitters = this._settings.emitters
    if(this._settings.callbacks) this._callbacks = this._settings.callbacks
    if(this._settings.models) this._models = this._settings.models
    if(this._settings.views) this._views = this._settings.views
    if(this._settings.controllers) this._controllers = this._settings.controllers
    if(this._settings.routers) this._routers = this._settings.routers
    if(this._settings.events) this._events = this._settings.events
  }
  get _emitters() { return this.emitters || {} }
  set _emitters(emitters) { this.emitters = emitters }
  get _callbacks() { return this.callbacks || {} }
  set _callbacks(callbacks) { this.callbacks = callbacks }
  get _models() { return this.models || {} }
  set _models(models) { this.models = models }
  get _views() { return this.views || {} }
  set _views(views) { this.views = views }
  get _controllers() { return this.controllers || {} }
  set _controllers(controllers) { this.controllers = controllers }
  get _routers() { return this.routers || {} }
  set _routers(routers) { this.routers = routers }
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
