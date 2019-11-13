import Base from '../Base/index'

const Controller = class extends Base {
  constructor() {
    super(...arguments)
  }
  get bindableClassProperties() { return [
    'model',
    'collection',
    'view',
    'controller',
    'router'
  ] }
  get classDefaultProperties() { return [] }
}
export default Controller
