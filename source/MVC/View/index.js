import Base from '../Base/index.js'

class View extends Base {
  constructor() {
    super(...arguments)
  }
  get bindableClassProperties() { return [
    'uiElement'
  ] }
  get classDefaultProperties() { return [
    'elementName',
    'element',
    'attributes',
    'templates',
    'insert'
  ] }
  get _elementName() { return this._element.tagName }
  set _elementName(elementName) {
    if(!this._element) this._element = document.createElement(elementName)
  }
  get _element() { return this.element }
  set _element(element) {
    this.element = element
    this.elementObserver.observe(this.element, {
      subtree: true,
      childList: true,
    })
  }
  get _attributes() {
    this.attributes = this.element.attributes
    return this.attributes
  }
  set _attributes(attributes) {
    for(let [attributeKey, attributeValue] of Object.entries(attributes)) {
      if(typeof attributeValue === 'undefined') {
        this._element.removeAttribute(attributeKey)
      } else {
        this._element.setAttribute(attributeKey, attributeValue)
      }
    }
  }
  get elementObserver() {
    this._elementObserver = this._elementObserver || new MutationObserver(
      this.elementObserve.bind(this)
    )
    return this._elementObserver
  }
  get _insert() {
    this.insert = this.insert || null
    return this.insert
  }
  set _insert(insert) { this.insert = insert }
  get _templates() {
    this.templates = this.templates || {}
    return this.templates
  }
  set _templates(templates) { this.templates = templates }
  resetUIElements() {
    let uiElementSettings = Object.assign(
      {},
      this._uiElementSettings
    )
    this.toggleTargetBindableClassEvents('uiElement', 'off')
    this.toggleTargetBindableClassEvents('uiElement', 'on')
    return this
  }
  elementObserve(mutationRecordList, observer) {
    for(let [mutationRecordIndex, mutationRecord] of Object.entries(mutationRecordList)) {
      switch(mutationRecord.type) {
        case 'childList':
          let mutationRecordCategories = ['addedNodes', 'removedNodes']
          this.resetUIElements()
          break
      }
    }
  }
  autoInsert() {
    let insert = this.insert
    insert.parent.insertAdjacentElement(
      insert.method,
      this._element
    )
    return this
  }
  autoRemove() {
    if(
      this.element &&
      this.element.parentElement
    ) this.element.parentElement.removeChild(this.element)
    return this
  }
}
export default View
