import { UUID } from '../Utilities/index.js'
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
    'modelOptions',
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
  get uuid() {
    if(!this._uuid) this._uuid = Utilities.UUID()
    return this._uuid
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
    const modelsExist = (Object.keys(this.models).length)
      ? true
      : false
    return (modelsExist)
      ? this.models
        .map((model) => model.parse())
      : []
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
          let [baseTargetName, baseEventName] = baseEventData.split(' ')
          let baseTarget = base[baseTargetName]
          let baseCallback = baseCallbacks[baseCallbackName]
          if(
            baseCallback &&
            baseCallback.name.split(' ').length === 1
          ) {
            baseCallback = baseCallback.bind(this)
          }
          if(
            baseTargetName &&
            baseEventName &&
            baseTarget &&
            baseCallback
          ) {
            try {
              baseTarget[method](baseEventName, baseCallback)
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
    if(modelData instanceof Model) {
      model = modelData
    } else if(
      this.model
    ) {
      const ModelPrototype = this.model
      model = new ModelPrototype({
        defaults: modelData,
      }, this.modelOptions)
    } else {
      model = new Model({
        defaults: modelData
      })
    }
    model.on(
      'set',
      (event, _model) => this.emit(
        'change:model',
        this.parse(),
        this,
        _model,
      ),
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
        .forEach((model) => this.addModel(model))
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
      !Array.isArray(modelData) &&
      typeof modelData === 'object'
    ) {
      var modelIndex = this.getModelIndex(modelData.uuid)
      this.removeModelByIndex(modelIndex)
    } else if(Array.isArray(modelData)) {
      modelData
        .forEach((model) => {
          var modelIndex = this.getModelIndex(model.uuid)
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
