import Base from '../Base/index'
import Model from '../Model/index'

class Collection extends Base {
  constructor() {
    super(...arguments)
  }
  get storageContainer() { return [] }
  get defaultIDAttribute() { return '_id' }
  get bindableClassProperties() { return [
    'service'
  ] }
  get classDefaultProperties() { return [
    'model',
    'defaults'
  ] }
  get _defaults() { return this.defaults }
  set _defaults(defaults) {
    this.defaults = defaults
    this.set(defaults)
  }
  get _models() {
    this.models = this.models || this.storageContainer
    return this.models
  }
  set _models(modelsData) {
    this.models = modelsData
      .map((modelData) => {
        let model = new this.model()
        model.set(modelData)
        return model
      })
  }
  get _model() { return this.model }
  set _model(model) { this.model = model }
  get _isSetting() { return this.isSetting }
  set _isSetting(isSetting) { this.isSetting = isSetting }
  get _localStorage() { return this.localStorage }
  set _localStorage(localStorage) { this.localStorage = localStorage }
  get data() { return this._data }
  get _data() {
    return this._models
      .map((model) => model.parse())
  }
  get db() { return this._db }
  get _db() {
    let db = localStorage.getItem(this._localStorage.endpoint) || JSON.stringify(this.storageContainer)
    return JSON.parse(db)
  }
  set _db(db) {
    db = JSON.stringify(db)
    localStorage.setItem(this._localStorage.endpoint, db)
  }
  getModelIndex(modelID) {
    let modelIndex
    this._models
      .find((_model, _modelIndex) => {
        if(_model.get(_model.idAttribute) === modelID) {
          modelIndex = _modelIndex
          return _model
        }
      })
    return modelIndex
  }
  removeModelByIndex(modelIndex) {
    let model = this._models.splice(modelIndex, 1)
    this.emit(
      'removeModel', {
        name: 'removeModel',
      },
      model,
      this
    )
    return this
  }
  addModel(modelData) {
    let model
    if(modelData instanceof Model) {
      model = modelData
      this._models.push(model)
    } else if(
      !Array.isArray(modelData) &&
      typeof modelData !== null &&
      typeof modelData === 'object'
    ) {
      model = new this.model()
      model.set(modelData)
      this._models.push(model)
    }
    this.emit(
      'addModel',
      {
        name: 'addModel',
      },
      model,
      this
    )
    return this
  }
  add(modelData) {
    this._isSetting = true
    if(Array.isArray(modelData)) {
      modelData
        .forEach((_modelData) => {
          this.addModel(_modelData)
        })
    } else {
      this.addModel(modelData)
    }
    if(this._localStorage) this._db = this._data
    this._isSetting = false
    this.emit(
      'change', {
        name: 'change',
        data: this._data,
      },
      this
    )
    return this
  }
  remove(modelData) {
    this._isSetting = true
    let modelIndex
    if(
      typeof modelData === 'string' ||
      typeof modelData === 'number'
    ) {
      this.removeModelByIndex(
        this.getModelIndex(modelData)
      )
    } else if(modelData instanceof Model) {
      this.removeModelByIndex(
        this.getModelIndex(
          model[model.defaultIDAttribute]
        )
      )
    } else if(Array.isArray(modelData)) {
      modelData
        .forEach((model) => {
          if(
            typeof modelData === 'string' ||
            typeof modelData === 'number'
          ) {
            this.removeModelByIndex(
              this.getModelIndex(modelData)
            )
          } else if(modelData instanceof Model) {
            this.removeModelByIndex(
              this.getModelIndex(
                model[model.defaultIDAttribute]
              )
            )
          }
        })
    }
    this._isSetting = false
    this.emit(
      'change', {
        name: 'change',
        data: this._data,
      },
      this
    )
    return this
  }
  parse(data) {
    data = data || this._data || this.storageContainer
    return JSON.parse(JSON.stringify(data))
  }
}

export default Collection
