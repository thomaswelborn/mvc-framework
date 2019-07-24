MVC.View = class extends MVC.Base {
  constructor() {
    super(...arguments)
    this.addSettings()
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
  get _uiCallbacks() {
    this.uiCallbacks = (this.uiCallbacks)
      ? this.uiCallbacks
      : {}
    return this.uiCallbacks
  }
  set _uiCallbacks(uiCallbacks) {
    this.uiCallbacks = MVC.Utils.addPropertiesToTargetObject(
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
    this.observerCallbacks = MVC.Utils.addPropertiesToTargetObject(
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
    this.uiEmitters = MVC.Utils.addPropertiesToTargetObject(
      uiEmitters, this._uiEmitters
    )
  }
  get _observers() {
    this.observers = (this.observers)
      ? this.observers
      : {}
    return this.observers
  }
  set _observers(observers) {
    for(let [observerConfiguration, mutationSettings] of Object.entries(observers)) {
      let observerConfigurationData = observerConfiguration.split(' ')
      let observerName = observerConfigurationData[0]
      let observerTarget = (observerName.match('@', ''))
        ? MVC.Utils.objectQuery(
            observerName.replace('@', ''),
            this.ui
          )
        : document.querySelectorAll(observerName)
      let observerOptions = (observerConfigurationData[1])
        ? observerConfigurationData[1]
          .split(',')
          .reduce((accumulator, currentValue) => {
            accumulator[currentValue] = true
            return accumulator
          }, {})
        : {}
      let observer = new MVC.Observer({
        context: this,
        target: observerTarget,
        options: observerOptions,
        mutations: mutationSettings
      })
      this._observers[observerName] = observer
    }
  }
  set _insert(insert) {
    if(this.element.parentElement) this.remove()
    let insertMethod = insert.method
    let parentElement = document.querySelector(insert.element)
    parentElement.insertAdjacentElement(insertMethod, this.element)
  }
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
  addSettings() {
    if(Object.keys(this._settings).length) {
      if(this._settings.elementName) this._elementName = this._settings.elementName
      if(this._settings.element) this._element = this._settings.element
      if(this._settings.attributes) this._attributes = this._settings.attributes
      this._ui = this._settings.ui || {}
      if(this._settings.uiCallbacks) this._uiCallbacks = this._settings.uiCallbacks
      if(this._settings.observerCallbacks) this._observerCallbacks = this._settings.observerCallbacks
      if(this._settings.uiEmitters) this._uiEmitters = this._settings.uiEmitters
      if(this._settings.uiEvents) this._uiEvents = this._settings.uiEvents
      if(this._settings.observers) this._observers = this._settings.observers
      if(this._settings.templates) this._templates = this._settings.templates
      if(this._settings.insert) this._insert = this._settings.insert
    } else {
      this._elementName = 'div'
    }
  }
  remove() { this.element.parentElement.removeChild(this.element) }
}
