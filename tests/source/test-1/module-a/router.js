class Router extends MVC.Router {
  constructor() {
    super(...arguments)
  }
  get hashRouting() { return true }
  get root() { return '/test-1/' }
  get routes() { return {
    "/": {
      "name": "/",
      "callback": "index",
    },
    "/route-a": {
      "name": "/route-a",
      "callback": "route-a",
    },
    "/route-b": {
      "name": "/route-b",
      "callback": "route-b",
    },
    "/route-b/:id/edit": {
      "name": "/route-b/:id/edit",
      "callback": "route-b-id-edit",
    }
  } }
  get controller() { return {
    'index': function(route) {
      // console.log('route', route)
    },
    'route-a': function(route) {
      // console.log('route', route)
    },
    'route-b': function(route) {
      // console.log('route', route)
    },
    'route-b-id-edit': function(route) {
      // console.log('route', route)
    },
  } }
}
export default Router
