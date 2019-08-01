MVC.View = class extends MVC.Base {
  constructor() {
    super(...arguments)
    this.enable()
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
  get _ui() {
    this.ui = (this.ui)
      ? this.ui
      : {}
    return this.ui
  }
  set _ui(ui) {
    if(!this._ui['$element']) this._ui['$element'] = this.element
    for(let [uiKey, uiValue] of Object.entries(ui)) {
      if(uiValue instanceof HTMLElement) {
        this._ui[uiKey] = uiValue
      } else if(typeof uiValue === 'string') {
        this._ui[uiKey] = this._element.querySelectorAll(uiValue)
      }
    }
  }
  get _uiEvents() { return this.uiEvents }
  set _uiEvents(uiEvents) { this.uiEvents = uiEvents }
  get _uiCallbacks() {
    this.uiCallbacks = (this.uiCallbacks)
      ? this.uiCallbacks
      : {}
    return this.uiCallbacks
  }
  set _uiCallbacks(uiCallbacks) {
    this.uiCallbacks = MVC.Utils.addPropertiesToObject(
      uiCallbacks, this._uiCallbacks
    )
  }
  get _observerCallbacks() {
    this.observerCallbacks = (this.observerCallbacks)
      ? this.observerCallbacks
      : {}
    return this.observerCallbacks
  }
  set _observerCallbacks(observerCallbacks) {
    this.observerCallbacks = MVC.Utils.addPropertiesToObject(
      observerCallbacks, this._observerCallbacks
    )
  }
  get _uiEmitters() {
    this.uiEmitters = (this.uiEmitters)
      ? this.uiEmitters
      : {}
    return this.uiEmitters
  }
  set _uiEmitters(uiEmitters) {
    let _uiEmitters = {}
    uiEmitters.forEach((UIEmitter) => {
      let uiEmitter = new UIEmitter()
      _uiEmitters[uiEmitter.name] = uiEmitter
    })
    this.uiEmitters = MVC.Utils.addPropertiesToObject(
      _uiEmitters, this._uiEmitters
    )
  }
  get elementObserver() {
    this._elementObserver = (this._elementObserver)
      ? this._elementObserver
      : new MutationObserver(this.elementObserve.bind(this))
    return this._elementObserver
  }
  get _insert() { return this.insert }
  set _insert(insert) { this.insert = insert }
  get _enabled() { return this.enabled || false }
  set _enabled(enabled) { this.enabled = enabled }
  get _templates() {
    this.templates = (this.templates)
      ? this.templates
      : {}
    return this.templates
  }
  set _templates(templates) {
    for(let [templateName, templateSettings] of Object.entries(templates)) {
      this._templates[templateName] = templateSettings
    }
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
    return document.querySelectorAll(this.insert.element)
      .forEach((element) => {
        element.insertAdjacentElement(this.insert.method, this.element)
      })
  }
  autoRemove() {
    if(
      this.element &&
      this.element.parentElement
    ) this.element.parentElement.removeChild(this.element)
  }
  addElement(settings) {
    settings = settings || this.settings
    if(settings.elementName) this._elementName = settings.elementName
    if(settings.element) this._element = settings.element
    if(settings.attributes) this._attributes = settings.attributes
    if(settings.templates) this._templates = settings.templates
    if(settings.insert) this._insert = settings.insert
  }
  removeElement(settings) {
    settings = settings || this.settings
    if(
      this.element &&
      this.element.parentElement
    ) this.element.parentElement.removeChild(this.element)
    if(this.element) delete this.element
    if(this.attributes) delete this.attributes
    if(this.templates) delete this.templates
    if(this.insert) delete this.insert
  }
  resetUI() {
    this.removeUI()
    this.addUI()
  }
  addUI(settings) {
    settings = settings || this.settings
    if(settings.ui) this._ui = settings.ui
    if(settings.uiEmitters) this._uiEmitters = settings.uiEmitters
    if(settings.uiCallbacks) this._uiCallbacks = settings.uiCallbacks
    if(settings.uiEvents) {
      this._uiEvents = settings.uiEvents
      this.addUIEvents()
    }
  }
  removeUI(settings) {
    settings = settings || this.settings
    if(settings.uiEvents) {
      this.removeUIEvents()
      delete this._uiEvents
    }
    delete this.uiEvents
    delete this.ui
    delete this.uiCallbacks
  }
  addUIEvents() {
    if(
      this.uiEvents &&
      this.ui &&
      this.uiCallbacks
    ) {
      MVC.Utils.bindEventsToTargetObjects(
        this.uiEvents,
        this.ui,
        this.uiCallbacks
      )
    }
  }
  removeUIEvents() {
    if(
      this.uiEvents &&
      this.ui &&
      this.uiCallbacks
    ) {
      MVC.Utils.unbindEventsFromTargetObjects(
        this.uiEvents,
        this.ui,
        this.uiCallbacks
      )
    }
  }
  enable() {
    let settings = this.settings
    if(
      settings &&
      !this.enabled
    ) {
      this.addElement(settings)
      this.addUI(settings)
      this._enabled = true
    }
  }
  disable() {
    let settings = this.settings
    if(
      settings &&
      this.enabled
    ) {
      this.removeUI(settings)
      this.removeElement(settings)
      this._enabled = false
    }
  }
}
