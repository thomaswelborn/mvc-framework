MVC.View = class extends MVC.Events {
  constructor(settings, options, configuration) {
    super()
    if(configuration) this._configuration = configuration
    if(options) this._options = options
    if(settings) this._settings = settings
  }
  get _options() { return this.options }
  set _options(options) { this.options = options }
  get _configuration() { return this.configuration }
  set _configuration(configuration) { this.configuration = configuration }
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
      if(this.settings.observerCallbacks) this._observerCallbacks = this.settings.observerCallbacks
      if(this.settings.uiEmitters) this._uiEmitters = this.settings.uiEmitters
      if(this.settings.uiEvents) this._uiEvents = this.settings.uiEvents
      if(this.settings.observers) this._observers = this.settings.observers
      if(this.settings.templates) this._templates = this.settings.templates
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
  get _observerCallbacks() { return this.observerCallbacks || {} }
  set _observerCallbacks(observerCallbacks) { this.observerCallbacks = observerCallbacks }
  get _uiEmitters() { return this.uiEmitters || {} }
  set _uiEmitters(uiEmitters) { this.uiEmitters = emitters }
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
        ? MVC.Utils.getObjectFromDotNotationString(
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
      let observer = new MVC.Observers.Observer({
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
  remove() { this.element.parentElement.removeChild(this.element) }
}
