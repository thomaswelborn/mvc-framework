import Events from '../Events/index.js'
import Model from '../Model/index.js'

class Collection extends Events {
  constructor(settings = {}, options = {}) {
    super()
    this.settings = settings
    this.options = options
  }
  get validSettings() { return [
    'idAttribute',
    'model',
    'defaults',
    'services',
    'serviceEvents',
    'serviceCallbacks',
    'localStorage'
  ] }
  get bindableEventClassPropertyTypes() { return [
    'service'
  ] }
  get settings() { return this._settings }
  set settings(settings) {
    this._settings = settings
    this.validSettings.forEach((validSetting) => {
      if(settings[validSetting]) this[validSetting] = settings[validSetting]
    })
    this.bindableEventClassPropertyTypes
      .forEach((bindableEventClassPropertyType) => {
        this.toggleEvents(bindableEventClassPropertyType, 'on')
      })
  }
  get options() {
    if(!this._options) this._options = {}
    return this._options
  }
  set options(options) { this._options = options }
  get storageContainer() { return [] }
  get defaultIDAttribute() { return '_id' }
  get defaults() { return this._defaults }
  set defaults(defaults) {
    this._defaults = defaults
    this.add(defaults)
  }
  get models() {
    this._models = this._models || this.storageContainer
    return this._models
  }
  set models(modelsData) { this._models = modelsData }
  get model() { return this._model }
  set model(model) { this._model = model }
  get localStorage() { return this._localStorage }
  set localStorage(localStorage) { this._localStorage = localStorage }
  get data() { return this._data }
  get data() {
    return this._models
      .map((model) => model.parse())
  }
  get db() { return this._db }
  get db() {
    let db = localStorage.getItem(this.localStorage.endpoint) || JSON.stringify(this.storageContainer)
    return JSON.parse(db)
  }
  set db(db) {
    db = JSON.stringify(db)
    localStorage.setItem(this.localStorage.endpoint, db)
  }
  resetEvents(classType) {
    [
      'off',
      'on'
    ].forEach((method) => {
      this.toggleEvents(classType, method)
    })
    return this
  }
  toggleEvents(classType, method) {
    const baseName = classType.concat('s')
    const baseEventsName = classType.concat('Events')
    const baseCallbacksName = classType.concat('Callbacks')
    const base = this[baseName]
    const baseEvents = this[baseEventsName]
    const baseCallbacks = this[baseCallbacksName]
    if(
      base &&
      baseEvents &&
      baseCallbacks
    ) {
      Object.entries(baseEvents)
        .forEach(([baseEventData, baseCallbackName]) => {
          const [baseTargetName, baseEventName] = baseEventData.split(' ')
          const baseTarget = base[baseTargetName]
          const baseEventCallback = baseCallbacks[baseCallbackName]
          if(
            baseTargetName &&
            baseEventName &&
            baseTarget &&
            baseEventCallback
          ) {
            try {
              classTypeTarget[method](classTypeEventName, classTypeEventCallback)
            } catch(error) {}
          }
        })
    }
    return this
  }
  getModelIndex(modelUUID) {
    let modelIndex
    this._models
      .find((_model, _modelIndex) => {
        if(_model !== null) {
          if(
            _model instanceof Model &&
            _model._uuid === modelUUID
          ) {
            modelIndex = _modelIndex
            return _model
          }
        }
      })
    return modelIndex
  }
  removeModelByIndex(modelIndex) {
    let model = this._models.splice(modelIndex, 1, null)
    this.emit(
      'remove:model',
      model[0].parse(),
      this,
      model[0]
    )
    return this
  }
  addModel(modelData) {
    let model
    let someModel = new Model()
    if(modelData instanceof Model) {
      model = modelData
    } else if(
      this.model
    ) {
      model = new this.model()
      model.set(modelData)
    } else {
      model = new Model()
      model.set(modelData)
    }
    model.on(
      'set',
      (event, _model) => {
        this.emit(
          'change:model',
          this.parse(),
          this,
          model,
        )
      }
    )
    this.models.push(model)
    this.emit(
      'add',
      model.parse(),
      this,
      model
    )
    return model
  }
  add(modelData) {
    if(Array.isArray(modelData)) {
      modelData
        .forEach((model) => {
          this.addModel(model)
        })
    } else {
      this.addModel(modelData)
    }
    if(this.localStorage) this.db = this.data
    this.emit(
      'change',
      this.parse(),
      this
    )
    return this
  }
  remove(modelData) {
    if(
      !Array.isArray(modelData)
    ) {
      var modelIndex = this.getModelIndex(modelData._uuid)
      this.removeModelByIndex(modelIndex)
    } else if(Array.isArray(modelData)) {
      modelData
        .forEach((model) => {
          var modelIndex = this.getModelIndex(model._uuid)
          this.removeModelByIndex(modelIndex)
        })
    }
    this.models = this.models
      .filter((model) => model !== null)
    if(this._localStorage) this.db = this.data
    this.emit(
      'remove',
      this.parse(),
      this
    )
    return this
  }
  reset() {
    this.remove(this._models)
    return this
  }
  parse(data) {
    data = data || this.data || this.storageContainer
    return JSON.parse(JSON.stringify(data))
  }
}

export default Collection
