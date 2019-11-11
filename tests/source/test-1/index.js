// import Model from './module-a/model'
// import View from './module-a/view'
// let model = new Model({
//   localStorage: {
//     endpoint: '/test-1',
//   },
//   defaults: {
//     a: 3,
//     b: 2,
//     c: 1,
//   },
// })
// // model.on('set', (event, model) => console.log(model.db) )
// // model.on('set:a', (event, model) => console.log(model.db) )
// // model.on('set:b', (event, model) => console.log(model.db) )
// // model.on('set:c', (event, model) => console.log(model.db) )
// model.set({
//   a: 1,
//   b: 2,
//   c: 3,
// })
// let view = new View()
// view.render(model.get())
import Controller from './module-a/controller'
let controller = new Controller()
controller.start()
