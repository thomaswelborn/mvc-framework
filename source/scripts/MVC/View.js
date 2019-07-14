MVC.View = class extends MVC.Events {
  constructor(settings) {
    super()
    this._settings = settings
  }
  get _settings() {
    this.settings = (this.settings)
      ? this.settings
      : {}
    return this.settings
  }
  set _settings(settings) {
    if(settings) {
      this.settings = settings
      if(this.settings.elementName) this._elementName = this.settings.elementName
      if(this.settings.element) this._element = this.settings.element
      if(this.settings.attributes) this._attributes = this.settings.attributes
      this._ui = this.settings.ui || {}
      if(this.settings.uiCallbacks) this._uiCallbacks = this.settings.uiCallbacks
      if(this.settings.uiEmitters) this._uiEmitters = this.settings.uiEmitters
      if(this.settings.uiEvents) this._uiEvents = this.settings.uiEvents
      if(this.settings.template) this._template = this.settings.template
      if(this.settings.insert) this._insert = this.settings.insert
    } else {
      this._elementName = 'div'
    }
  }
  get _elementName() { return this._element.tagName }
  set _elementName(elementName) {
    if(!this._element) this._element = document.createElement(elementName)
  }
  get _element() { return this.element }
  set _element(element) {
    if(element instanceof HTMLElement) {
      this.element = element
    } else if(typeof element === 'string') {
      this.element = document.querySelector(element)
    }
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
    this.attributes = this._element.attributes
  }
  get _ui() {
    this.ui = (this.ui)
      ? this.ui
      : {}
    return this.ui
  }
  set _ui(ui) {
    this._ui['$'] = this.element
    for(let [uiKey, uiSelector] of Object.entries(ui)) {
      if(typeof uiSelector === 'undefined') {
        delete this._ui[uiKey]
      } else {
        this._ui[uiKey] = this._element.querySelectorAll(uiSelector)
      }
    }
  }
  set _uiEvents(uiEvents) {
    MVC.Utils.bindEventsToTargetObjects(uiEvents, this.ui, this.uiCallbacks)
  }
  get _uiCallbacks() { return this.uiCallbacks || {} }
  set _uiCallbacks(uiCallbacks) { this.uiCallbacks = uiCallbacks }
  get _uiEmitters() { return this.uiEmitters || {} }
  set _uiEmitters(uiEmitters) { this.uiEmitters = emitters }
  set _insert(insert) {
    if(this.element.parentElement) {
      this.element.parentElement.removeChild(this.element)
    }
    let insertMethod = insert.method
    let parentElement = document.querySelector(insert.element)
    parentElement.insertAdjacentElement(insertMethod, this.element)
  }
}
