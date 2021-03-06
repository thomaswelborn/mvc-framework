class Model extends MVC.Model {
  constructor() {
    super(...arguments)
  }
  get idAttribute() { return 'id' }
  get services() { return {
    get: new MVC.Service({
      type: 'GET',
      url: 'https://jsonplaceholder.typicode.com/albums',
    })
  } }
  get serviceEvents() { return {
    'get xhrResolve': 'getXHRResolve',
  } }
  get serviceCallbacks() { return {
    getXHRResolve: function getXHRResolve(event) {
      // 
    },
  } }
  start() {
    this.services.get.request()
  }
}
export default Model
