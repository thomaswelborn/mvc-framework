MVC.View = class extends MVC.Base {
  constructor() {
    super(...arguments)
    return this
  }
  get elementKeyMap() { return [
    'elementName',
    'element',
    'attributes',
    'templates',
    'insert'
  ] }
  get uiKeyMap() { return [
    'ui',
    'uiCallbacks',
    'uiEvents'
  ] }
  get _mediators() {
    this.mediators = (this.mediators)
      ? this.mediators
      : {}
    return this.mediators
  }
  set _mediators(mediators) {
    this.mediators = MVC.Utils.addPropertiesToObject(
      mediators, this._mediators
    )
  }
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
  get _ui() {
    this.ui = (this.ui)
      ? this.ui
      : {}
    return this.ui
  }
  set _ui(ui) {
    if(!this._ui[':scope']) this._ui[':scope'] = this.element
    for(let [uiKey, uiValue] of Object.entries(ui)) {
      if(typeof uiValue === 'string') {
        this._ui[uiKey] = this._element.querySelectorAll(uiValue)
      } else if(
        uiValue instanceof HTMLElement ||
        uiValue instanceof Document
      ) {
        this._ui[uiKey] = uiValue
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
    this.templates = MVC.Utils.addPropertiesToObject(
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
      if(MVC.Utils.typeOf(this.insert.element) === 'string') {
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
  enableElement() {
    this.setProperties(this.settings || {}, this.elementKeyMap)
    return this
  }
  disableElement() {
    this.deleteProperties(this.settings || {}, this.elementKeyMap)
    return this
  }
  resetUI() {
    this.disableUI()
    this.enableUI()
    return this
  }
  enableUI() {
    this.setProperties(this.settings || {}, this.uiKeyMap)
    this.enableUIEvents()
    return this
  }
  disableUI() {
    this.disableUIEvents()
    this.deleteProperties(this.settings || {}, this.uiKeyMap)
    return this
  }
  enableUIEvents() {
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
    return this
  }
  enableRenderers() {
    MVC.Utils.objectQuery(
      '[/^render.*?/]',
      this.settings
    ).forEach(([rendererName, rendererFunction]) => {
      this[rendererName] = rendererFunction
    })
    return this
  }
  disableRenderers() {
    MVC.Utils.objectQuery(
      '[/^render.*?/]',
      this.settings
    ).forEach((rendererName, rendererFunction) => {
      delete this[rendererName]
    })
    return this
  }
  disableUIEvents() {
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
    return this
  }
  enable() {
    if(
      !this._enabled
    ) {
      this.enableRenderers()
      if(this.settings.mediators) this._mediators = this.settings.mediators
      this.enableElement()
      this.enableUI()
      this._enabled = true
    }
    return this
  }
  disable() {
    if(
      this._enabled
    ) {
      this.disableRenderers()
      this.disableUI()
      this.disableElement()
      delete this._mediators
      this._enabled = false
    }
    return this
  }
}
