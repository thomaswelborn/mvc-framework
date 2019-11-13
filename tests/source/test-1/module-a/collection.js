import Model from './model'
class Collection extends MVC.Collection {
  constructor() {
    super(...arguments)
  }
  get model() { return Model }
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
      let responseData = JSON.parse(event.data.response)
      this.add(responseData)
    },
  } }
  start() {
    this.services.get.request()
  }
}
export default Collection
