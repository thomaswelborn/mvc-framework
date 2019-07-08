MVC.Controller = class extends MVC.Events {
  constructor(settings) {
    super()
    if(this.settings) this.settings = settings
  }
  get settings() { return this._settings }
  set settings(settings) {
    this._settings = settings
    if(this.settings.models) this.models = models
    if(this.settings.views) this.views = views
    if(this.settings.controllers) this.controllers = controllers
    if(this.settings.routers) this.routers = routers
    if(this.settings.emitters) this.emitters = emitters
    if(this.settings.callbacks) this.callbacks = callbacks
    if(this.settings.events) this.events = events
  }
  get models() { return this._models }
  set models(models) { this._models = models }
  get views() { return this._views }
  set views(views) { this._views = views }
  get controllers() { return this._controllers }
  set controllers(controllers) { this._controllers = controllers }
  get routers() { return this._routers }
  set routers(routers) { this._routers = routers }
  get emitters() { return this._emitters }
  set emitters(emitters) { this._emitters = emitters }
  get callbacks() { return this._callbacks }
  set callbacks(callbacks) { this._callbacks = callbacks }
  get events() { return this._events }
  set events(events) {
    for(let [eventSettings, eventCallback] of Object.entries(events)) {
      let eventData = eventSettings.split(' ')
      let eventTarget = eventData[0].replace('@', '').split('.')
      let eventName = eventData[1]
      eventCallback = eventCallback.replace('@', '').split('.')
      this[eventTarget].on(eventName, eventCallback)
    }
  }
}
