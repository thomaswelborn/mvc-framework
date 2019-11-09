import Utils from '../Utils/index'
import Base from '../Base/index'

class View extends Base {
  constructor() {
    super(...arguments)
  }
  get bindableClassProperties() { return [
    'uiElement'
  ] }
  get classSettingsProperties() { return [
    'elementName',
    'element',
    'attributes',
    'uiElements',
    'uiElementEvents',
    'uiElementCallbacks',
    'templates',
    'insert'
  ] }
  get _elementName() { return this._element.tagName }
  set _elementName(elementName) {
    if(!this._element) this._element = document.createElement(elementName)
  }
  get _element() { return this.element }
  set _element(element) {
    if(
      element instanceof HTMLElement ||
      element instanceof Document
    ) {
      this.element = element
    } else if(typeof element === 'string') {
      this.element = document.querySelector(element)
    }
    this.elementObserver.observe(this.element, {
      subtree: true,
      childList: true,
    })
  }
  get _attributes() { return this._element.attributes }
  set _attributes(attributes) {
    for(let [attributeKey, attributeValue] of Object.entries(attributes)) {
      if(typeof attributeValue === 'undefined') {
        this._element.removeAttribute(attributeKey)
      } else {
        this._element.setAttribute(attributeKey, attributeValue)
      }
    }
  }
  get _observerCallbacks() {
    this.observerCallbacks = this.observerCallbacks || {}
    return this.observerCallbacks
  }
  set _observerCallbacks(observerCallbacks) {
    this.observerCallbacks = Utils.addPropertiesToObject(
      observerCallbacks, this._observerCallbacks
    )
  }
  get elementObserver() {
    this._elementObserver = this._elementObserver || new MutationObserver(this.elementObserve.bind(this))
    return this._elementObserver
  }
  get _insert() { return this.insert }
  set _insert(insert) { this.insert = insert }
  get _templates() {
    this.templates = this.templates || {}
    return this.templates
  }
  set _templates(templates) {
    this.templates = Utils.addPropertiesToObject(
      templates, this._templates
    )
  }
  elementObserve(mutationRecordList, observer) {
    for(let [mutationRecordIndex, mutationRecord] of Object.entries(mutationRecordList)) {
      switch(mutationRecord.type) {
        case 'childList':
          let mutationRecordCategories = ['addedNodes', 'removedNodes']
          for(let mutationRecordCategory of mutationRecordCategories) {
            if(mutationRecord[mutationRecordCategory].length) {
              this.resetUI()
            }
          }
          break
      }
    }
  }
  autoInsert() {
    if(this.insert) {
      let parentElement
      if(Utils.typeOf(this.insert.element) === 'string') {
        parentElement = document.querySelectorAll(this.insert.element)
      } else {
        parentElement = this.insert.element
      }
      if(
        parentElement instanceof HTMLElement ||
        parentElement instanceof Node
      ) {
        parentElement.insertAdjacentElement(this.insert.method, this.element)
      } else if(parentElement instanceof NodeList) {
        parentElement
          .forEach((_parentElement) => {
            _parentElement.insertAdjacentElement(this.insert.method, this.element)
          })
      }
    }
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
