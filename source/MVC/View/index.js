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
  get ui() { return this._ui }
  get _ui() {
    let ui = {}
    ui[':scope'] = this.element
    Object.entries(this.uiElements)
      .forEach(([uiKey, uiValue]) => {
        if(typeof uiValue === 'string') {
          let scopeRegExp = new RegExp(/^(\:scope(\W){0,}>{0,})/)
          uiValue = uiValue.replace(scopeRegExp, '')
          ui[uiKey] = this.element.querySelectorAll(uiValue)
        } else if(
          uiValue instanceof HTMLElement ||
          uiValue instanceof Document
        ) {
          ui[uiKey] = uiValue
        }
      })
    return ui
  }
  set _ui(ui) { this.uiElements = ui }
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
    return this.setProperties(this.settings || {}, this.elementKeyMap)
  }
  disableElement() {
    return this.deleteProperties(this.settings || {}, this.elementKeyMap)
  }
  resetUI() {
    return this
      .disableUI()
      .enableUI()
  }
  enableUI() {
    return this
      .setProperties(this.settings || {}, this.uiKeyMap)
      .enableUIEvents()
  }
  disableUI() {
    return this
      .disableUIEvents()
      .deleteProperties(this.settings || {}, this.uiKeyMap)
  }
  enableUIEvents() {
    if(
      this.uiEvents &&
      this.ui &&
      this.uiCallbacks
    ) {
      MVC.Utils.bindEventsToTargetViewObjects(
        this.uiEvents,
        this.ui,
        this.uiCallbacks
      )
    }
    return this
  }
  enableRenderers() {
    let settings = this.settings || {}
    MVC.Utils.objectQuery(
      '[/^render.*?/]',
      settings
    ).forEach(([rendererName, rendererFunction]) => {
      this[rendererName] = rendererFunction
    })
    return this
  }
  disableRenderers() {
    let settings = this.settings || {}
    MVC.Utils.objectQuery(
      '[/^render.*?/]',
      settings
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
      MVC.Utils.unbindEventsFromTargetViewObjects(
        this.uiEvents,
        this.ui,
        this.uiCallbacks
      )
    }
    return this
  }
  enable() {
    let settings = this.settings || {}
    if(
      !this._enabled
    ) {
      if(settings.mediators)
        this._mediators = settings.mediators
      this
        .enableRenderers()
        .enableElement()
        .enableUI()
        ._enabled = true
    }
    return this
  }
  disable() {
    if(
      this._enabled
    ) {
      this
        .disableRenderers()
        .disableUI()
        .disableElement()
        ._enabled = false
      delete this._mediators
    }
    return this
  }
}
