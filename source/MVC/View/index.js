import Events from '../Events/index.js'

class View extends Events {
  constructor(settings = {}, options = {}) {
    super()
    this.settings = settings
    this.options = options
  }
  get validSettings() { return [
    'attributes',
    'elementName',
    'element',
    'insert',
    'template',
    'uiElements',
    'uiElementEvents',
    'uiElementCallbacks',
    'render'
  ] }
  get settings() { return this._settings }
  set settings(settings) {
    this._settings = settings
    this.validSettings.forEach((validSetting) => {
      if(settings[validSetting]) this[validSetting] = settings[validSetting]
    })
  }
  get options() {
    if(!this._options) this._options = {}
    return this._options
  }
  set options(options) { this._options = options }
  get elementName() { return this._elementName }
  set elementName(elementName) { this._elementName = elementName }
  get element() {
    if(!this._element) {
      this._element = document.createElement(this.elementName)
      Object.entries(this.attributes).forEach(([attributeKey, attributeValue]) => {
        this._element.setAttribute(attributeKey, attributeValue)
      })
      this.elementObserver.observe(this.element, {
        subtree: true,
        childList: true,
      })
    }
    return this._element
  }
  get elementObserver() {
    this._elementObserver = this._elementObserver || new MutationObserver(
      this.elementObserve.bind(this)
    )
    return this._elementObserver
  }
  set element(element) {
    if(element instanceof HTMLElement) this._element = element
  }
  get attributes() { return this._attributes || {} }
  set attributes(attributes) { this._attributes = attributes }
  get template() { return this._template }
  set template(template) { this._template = template }
  get uiElements() { return this._uiElements || {} }
  set uiElements(uiElements) {
    this._uiElements = uiElements
    // this.toggleEvents()
  }
  get uiElementEvents() { return this._uiElementEvents || {} }
  set uiElementEvents(uiElementEvents) {
    this._uiElementEvents = uiElementEvents
    // this.toggleEvents()
  }
  get uiElementCallbacks() { return this._uiElementCallbacks || {} }
  set uiElementCallbacks(uiElementCallbacks) {
    this._uiElementCallbacks = uiElementCallbacks
    Object.values(this._uiElementCallbacks)
      .forEach((uiElementCallback) => uiElementCallback.bind(this))
    // this.toggleEvents()
  }
  get ui() {
    const context = this
    if(!this._ui) {
      this._ui = Object.entries(this.uiElements).reduce((_ui,[uiElementName, uiElementQuery]) => {
        Object.defineProperties(_ui, {
          [uiElementName]: {
            get() {
              if(typeof uiElementQuery === 'string') {
                let queryResults = context.element.querySelectorAll(uiElementQuery)
                return (queryResults.length > 1) ? queryResults : queryResults.item(0)
              } else if(
                uiElementQuery instanceof HTMLElement ||
                uiElementQuery instanceof Document ||
                uiElementQuery instanceof Window
              ) {
                return uiElementQuery
              }
            }
          },
        })
        return _ui
      }, {})
      Object.defineProperties(this._ui, {
        '$element': {
          get() { return context.element }
        },
      })
    }
    return this._ui
  }
  resetUI() {
    delete this._ui
    this.toggleEvents()
    return this
  }
  elementObserve(mutationRecordList, observer) {
    for(let [mutationRecordIndex, mutationRecord] of Object.entries(mutationRecordList)) {
      switch(mutationRecord.type) {
        case 'childList':
          if(mutationRecord.addedNodes.length) {
            // Object.entries(Object.getOwnPropertyDescriptors(this.ui))
            // .forEach(([uiKey, uiValue]) => {
            //   const uiValueGet = uiValue.get()
            //   const addedUIElement = Array.from(mutationRecord.addedNodes).find((addedNode) => {
            //     console.log('addedNode', addedNode)
            //     console.log('uiValueGet', uiValueGet)
            //     return addedNode === uiValueGet
            //   })
            //   if(addedUIElement) {
            //     this.toggleEvents(uiKey)
            //   }
            // })
            this.toggleEvents()
          }
          break
      }
    }
  }
  bindEventToElement(element, method, eventName, eventCallbackName) {
    try {
      switch(method) {
        case 'addEventListener':
          this.uiElementCallbacks[eventCallbackName] = this.uiElementCallbacks[eventCallbackName]// .bind(this)
          element[method](eventName, this.uiElementCallbacks[eventCallbackName])
          break
        case 'removeEventListener':
          element[method](eventName, this.uiElementCallbacks[eventCallbackName])
          break
      }
    } catch(error) {}
  }
  toggleEvents(targetUIElementName = null) {
    this.isToggling = true
    const ui = this.ui
    const eventBindMethods = ['removeEventListener', 'addEventListener']
    if(!targetUIElementName) {
      eventBindMethods.forEach((eventBindMethod) => {
        Object.entries(this.uiElementEvents).forEach(([uiElementEventSettings, uiElementEventCallbackName]) => {
          let [uiElementName, uiElementEventName] = uiElementEventSettings.split(' ')
          if(ui[uiElementName] instanceof NodeList) {
            ui[uiElementName].forEach((uiElement) => {
              this.bindEventToElement(uiElement, eventBindMethod, uiElementEventName, uiElementEventCallbackName)
            })
          } else if(ui[uiElementName]) {
            this.bindEventToElement(ui[uiElementName], eventBindMethod, uiElementEventName, uiElementEventCallbackName)
          }
        })
      })
    } else {
      eventBindMethods.forEach((eventBindMethod) => {
        const uiElementEvents = Object.entries(this.uiElementEvents).forEach(([uiElementEventSettings, uiElementEventCallbackName]) => {
          let [uiElementName, uiElementEventName] = uiElementEventSettings.split(' ')
          if(targetUIElementName === uiElementName) {
            if(ui[uiElementName] instanceof NodeList) {
              ui[uiElementName].forEach((uiElement) => {
                this.bindEventToElement(uiElement, eventBindMethod, uiElementEventName, uiElementEventCallbackName)
              })
            } else if(ui[uiElementName] instanceof HTMLElement) {
              this.bindEventToElement(ui[uiElementName], eventBindMethod, uiElementEventName, uiElementEventCallbackName)
            }
          }
        })
      })
    }
    this.isToggling = false
    return this
  }
  autoInsert() {
    if(this.insert) {
      const parent = (typeof this.insert.parent === 'string')
        ? document.querySelector(this.insert.parent)
        : (this.insert.parent instanceof HTMLElement)
          ? this.insert.parent
          : null
      const method = this.insert.method
      parent.insertAdjacentElement(method, this.element)
    }
    return this
  }
  autoRemove() {
    if(this.element.parentElement) {
      this.element.parentElement.removeChild(this.element)
    }
    return this
  }
  renderElementTextContent(uiElement, textContent) {
    if(this.ui[uiElement]) this.ui[uiElement].innerHTML = textContent
    return this
  }
  renderElementAttribute(uiElement, attributeName) {
    if(this.ui[uiElement]) this.ui[uiElement].removeAttribute(attributeName)
    return this
  }
  renderElementAttribute(uiElement, attributeName, attributeValue) {
    if(this.ui[uiElement]) this.ui[uiElement].setAttribute(attributeName, attributeValue)
    return this
  }
  renderElement(uiElement, insertMethod, element) {
    if(this.ui[uiElement]) this.ui[uiElement].insertAdjacentElement(insertMethod, element)
    return this
  }
  render(data = {}) {
    if(this.template) {
      const template = this.template(data)
      this.element.innerHTML = template
    }
    return this
  }
}
export default View
