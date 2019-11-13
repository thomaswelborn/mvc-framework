import Collection from './collection'
import View from './view'
import Router from './router'
class Controller extends MVC.Controller {
  constructor() {
    super(...arguments)
  }
  get collections() { return {
    collection: new Collection()
  } }
  get collectionEvents() { return {
    'collection change': 'collectionChange',
    'collection addModel': 'collectionAddModel',
  } }
  get collectionCallbacks() { return {
    collectionChange: function collectionChange(event) {
      // console.log(event)
    },
    collectionAddModel: function collectionAddModel(event) {
      // console.log(event)
    },
  } }
  get views() { return {
    view: new View(),
  } }
  get viewEvents() { return {
    'view render': 'viewRender',
  } }
  get viewCallbacks() { return {
    viewRender: function viewRender(event, view) {
      // console.log(event, view)
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
      // console.log(event, router)
    },
  } }
  start() {
    this.collections.collection.start()
    // this.models.model.start()
    // this.views.view.render(this.models.model.get())
    // console.log(this)
  }
}
export default Controller
