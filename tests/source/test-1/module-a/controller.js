import Model from './model'
import View from './view'
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
  start() {
    this.views.view.render(this.models.model.get())
  }
}
export default Controller
