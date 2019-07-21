MVC.Emitter = class extends MVC.Base {
  constructor() {
    super(...arguments)
  }
  get _schema() { return this.schema }
  set _schema(schema) { this.schema = schema }
  validate(data) {
    return MVC.Utils.validateDataSchema(data, this.schema)
  }
}
