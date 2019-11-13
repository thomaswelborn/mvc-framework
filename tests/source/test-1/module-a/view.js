import Template from './template.ejs'
class View extends MVC.View {
  constructor() {
    super()
  }
  get elementName() { return 'section' }
  get attributes() { return {
    'class': 'meh',
  } }
  get uiElements() { return {
    'someClass': ':scope > .some-class',
  } }
  get uiElementEvents() { return {
    'someClass click': 'someClassClick',
  } }
  get uiElementCallbacks() { return {
    'someClassClick': function someClassClick(event) {
      // console.log(event)
    },
  } }
  get insert() { return {
    element: document.querySelector('body'),
    method: 'afterBegin'
  } }
  get templates() { return {
    template: Template
  } }
  render(data) {
    let templateString = this.templates.template(data)
    try {
      this.element.parentElement.removeChild(this.element)
    } catch(error) {}
    this.element.innerHTML = templateString
    this.autoInsert()
    this.emit('render', {
      name: 'render',
      data: {},
    }, this)
    return this
  }
}
export default View
