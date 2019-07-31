MVC.Observer = class extends MVC.Base {
  constructor() {
    super(...arguments)
    this.enable()
  }
  get _connected() { return this.connected || false }
  set _connected(connected) { this.connected = connected }
  get observer() {
    this._observer = (this._observer)
      ? this._observer
      : new MutationObserver(this.observerCallback.bind(this))
    return this._observer
  }
  get _target() { return this.target }
  set _target(target) { this.target = target }
  get _options() { return this.options }
  set _options(options) {
    this.options = options
  }
  get _mutations() {
    this.mutations = (this.mutations)
      ? this.mutations
      : []
    return this.mutations
  }
  set _mutations(mutations) {
    for(let [mutationSettings, mutationCallback] of Object.entries(mutations.settings)) {
      let mutation
      let mutationData = mutationSettings.split(' ')
      let mutationTarget = MVC.Utils.objectQuery(mutationData[0], mutations.targets)[0][1]
      let mutationEventName = mutationData[1]
      mutationCallback = MVC.Utils.objectQuery(mutationCallback, mutations.callbacks)[0][1]
      mutation = {
        target: mutationTarget,
        name: mutationEventName,
        callback: mutationCallback,
      }
      this._mutations.push(mutation)
    }
  }
  enable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      if(settings.target) this._target = (settings.target instanceof NodeList)
        ? settings.target[0]
        : settings.target
      if(settings.options) this._options = settings.options
      if(settings.mutations) this._mutations = settings.mutations
      this._enabled = true
    }
  }
  disable() {
    let settings = this.settings
    if(
      settings &&
      this.enabled
    ) {
      if(this.target) delete this.target
      if(this.options) delete this.options
      if(this.mutations) delete this.mutations
      if(this.observeer) delete this.observer
      this._enabled = false
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
                this.mutations.forEach((_mutation) => {
                  if(mutationRecordCategory.match(new RegExp('^'.concat(_mutation.name)))) {
                    if(_mutation.target instanceof HTMLElement) {
                      if(_mutation.target === node) {
                        _mutation.callback({
                          mutation: _mutation,
                          mutationRecord: mutationRecord
                        })
                      }
                    } else if(_mutation.target instanceof NodeList) {
                      for(let _mutationTarget of _mutation.target) {
                        if(_mutationTarget === node) {
                          _mutationTarget.callback({
                            mutation: _mutation,
                            mutationRecord: mutationRecord
                          })
                        }
                      }
                    }
                  }
                })
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
  connect() {
    this.observer.observe(this.target, this.options)
    this._connected = true
  }
  disconnect() {
    this.observer.disconnect()
    this._connected = false
  }
}
