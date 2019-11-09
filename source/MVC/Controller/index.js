import Utils from '../Utils/index'
import Base from '../Base/index'

const Controller = class extends Base {
  constructor() {
    super(...arguments)
    this.addProperties()
    return this
  }
  get bindableClassProperties() { return [
    'model',
    'view',
    'controller',
    'router'
  ] }
  get classSettingsProperties() { return [
    'models',
    'modelEvents',
    'modelCallbacks',
    'views',
    'viewEvents',
    'viewCallbacks',
    'controllers',
    'controllerEvents',
    'controllerCallbacks',
    'routers',
    'routerEvents',
    'routerCallbacks',
  ] }
}
export default Controller
