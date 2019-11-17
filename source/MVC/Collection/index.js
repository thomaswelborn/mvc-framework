import Base from '../Base/index.js'
import Model from '../Model/index.js'

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
    'idAttribute',
    'model',
    'defaults'
  ] }
  get _idAttribute() {
    this.idAttribute = this.idAttribute || this.defaultIDAttribute
    return this.idAttribute
  }
  set _idAttribute(idAttribute) { this.idAttribute = idAttribute }
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
        if(_model !== null) {
          if(
            _model instanceof Model &&
            _model.get(this._idAttribute) === modelID
          ) {
            modelIndex = _modelIndex
            return _model
          } else if(
            _model[this._idAttribute] === modelID
          ) {
            modelIndex = _modelIndex
            return _model
          }
        }
      })
    return modelIndex
  }
  getModelID(model) {
    return (model instanceof Model)
      ? model.get(this._idAttribute)
      : model[this._idAttribute]

  }
  removeModelByIndex(modelIndex) {
    let model = this._models.splice(modelIndex, 1, null)
    this.emit(
      'remove', {
        name: 'remove',
      },
      model[0],
      this
    )
    return this
  }
  addModel(modelData) {
    let model
    if(modelData instanceof Model) {
      model = modelData
      model.on(
        'set',
        (event, _model) => {
          this.emit(
            'change',
            {
              name: 'change',
            },
            this,
          )
        }
      )
      this._models.push(model)
    } else if(
      typeof modelData !== null &&
      typeof modelData === 'object'
    ) {
      model = new this.model()
      model.set(modelData)
      model.on(
        'set',
        (event, _model) => {
          this.emit(
            'change',
            {
              name: 'change',
            },
            this
          )
        }
      )
      this._models.push(model)
    }
    this.emit(
      'add',
      {
        name: 'add',
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
    if(
      !Array.isArray(modelData)
    ) {
      this.removeModelByIndex(
        this.getModelIndex(
          this.getModelID(modelData)
        )
      )
    } else if(Array.isArray(modelData)) {
      modelData
        .map((model) => {
          this.removeModelByIndex(
            this.getModelIndex(
              this.getModelID(model)
            )
          )
        })

    }
    this._models = this._models
      .filter((model) => model !== null)
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
  reset() {
    this.remove(this._models)
    return this
  }
  parse(data) {
    data = data || this._data || this.storageContainer
    return JSON.parse(JSON.stringify(data))
  }
}

export default Collection
