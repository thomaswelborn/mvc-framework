MVC.Observers.Observer = class {
  constructor(settings) {
    this._settings = settings
    this._observer.observe(this.target, this.options)
  }
  get _settings() {
    this.settings = (this.settings)
      ? this.settings
      : {}
    return this.settings
  }
  set _settings(settings) {
    if(settings) {
      this.settings = settings
      if(this.settings.context) this._context = this.settings.context
      if(this.settings.target) this._target = (this.settings.target instanceof NodeList)
        ? this.settings.target[0]
        : this.settings.target
      if(this.settings.options) this._options = this.settings.options
      if(this.settings.mutations) this._mutations = this.settings.mutations
    }
  }
  get _context() { return this.context }
  set _context(context) { this.context = context }
  get _target() { return this.target }
  set _target(target) { this.target = target }
  get _options() { return this.options }
  set _options(options) { this.options = options }
  get _observer() {
    this.observer = (this.observer)
      ? this.observer
      : new MutationObserver(this.observerCallback.bind(this))
    return this.observer
  }
  get _mutations() {
    this.mutations = (this.mutations)
      ? this.mutations
      : []
    return this.mutations
  }
  set _mutations(mutations) {
    for(let [mutationSettings, mutationCallback] of Object.entries(mutations)) {
      let mutation
      let mutationData = mutationSettings.split(' ')
      let mutationTarget = MVC.Utils.getObjectFromDotNotationString(
        mutationData[0].replace('@', ''),
        this.context.ui
      )
      let mutationEventName = mutationData[1]
      let mutationEventData = mutationData[2]
      mutationCallback = (mutationCallback.match('@'))
        ? this.context.observerCallbacks[mutationCallback.replace('@', '')]
        : (typeof mutationCallback === 'string')
          ? MVC.Utils.getObjectFromDotNotationString(mutationCallback, window)
          : mutationCallback
      mutation = {
        target: mutationTarget,
        name: mutationEventName,
        callback: mutationCallback,
      }
      if(mutationEventData) mutation.data = mutationEventData
      this._mutations.push(mutation)
    }
  }
  observerCallback(mutationRecordList, observer) {
    for(let [mutationRecordIndex, mutationRecord] of Object.entries(mutationRecordList)) {
      switch(mutationRecord.type) {
        case 'childList':
          let mutationRecordCategories = ['addedNodes', 'removedNodes']
          for(let mutationRecordCategory of mutationRecordCategories) {
            if(mutationRecord[mutationRecordCategory].length) {
              for(let [nodeIndex, node] of Object.entries(mutationRecord[mutationRecordCategory])) {
                let mutation = this.mutations.filter((_mutation) => _mutation.target === node)[0]
                if(mutation) {
                  mutation.callback({
                    mutation: mutation,
                    mutationRecord: mutationRecord,
                  })
                }
              }
            }
          }
          break
        case 'attributes':
          let mutation = this.mutations.filter((_mutation) => (
            _mutation.name === mutationRecord.type &&
            _mutation.data === mutationRecord.attributeName
          ))[0]
          if(mutation) {
            mutation.callback({
              mutation: mutation,
              mutationRecord: mutationRecord,
            })
          }
          break
      }
    }
  }
}
