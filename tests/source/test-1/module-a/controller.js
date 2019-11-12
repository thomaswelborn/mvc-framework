import Model from './model'
import View from './view'
import Router from './router'
class Controller extends MVC.Controller {
  constructor() {
    super(...arguments)
  }
  get models() { return {
    model: new Model({
      defaults: {
        a: 1,
        b: 2,
        c: 3,
      },
    })
  } }
  get views() { return {
    view: new View(),
  } }
  get viewEvents() { return {
    'view render': 'viewRender',
  } }
  get viewCallbacks() { return {
    viewRender: function viewRender(event, view) {
      console.log(event, view)
    },
  } }
  get routers() { return {
    router: new Router(),
  } }
  get routerEvents() { return {
    'router change': 'routerNavigate',
  } }
  get routerCallbacks() { return {
    'routerNavigate': function routerNavigate(event, router) {
      console.log(event, router)
    },
  } }
  start() {
    this.views.view.render(this.models.model.get())
    // console.log(this)
  }
}
export default Controller
