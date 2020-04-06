import Events from '../Events/index'

const Controller = class extends Events {
  constructor(settings = {}, options = {}) {
    super()
    this.settings = settings
    this.options = options
  }
  get validSettings() { return [
    'models',
    'modelEvents',
    'modelCallbacks',
    'collections',
    'collectionEvents',
    'collectionCallbacks',
    'views',
    'viewEvents',
    'viewCallbacks',
    'controllers',
    'controllerEvents',
    'controllerCallbacks',
    'routers',
    'routerEvents',
    'routerCallbacks',
  ] }
  get bindableEventClassPropertyTypes() { return [
    'model',
    'view',
    'collection',
    'controller',
    'router',
  ] }
  get options() {
    if(!this._options) this._options = {}
    return this._options
  }
  set options(options) { this._options = options }
  get settings() {
    if(!this._settings) this._settings = {}
    return this._settings
  }
  set settings(settings) {
    this._settings = settings
    this.validSettings
      .forEach((validSetting) => {
        if(this.settings[validSetting]) {
          Object.defineProperties(
            this,
            {
              ['_'.concat(validSetting)]: {
                configurable: true,
                writable: true,
                enumberable: false,
              },
              [validSetting]: {
                configurable: true,
                enumerable: true,
                get() { return this['_'.concat(validSetting)] },
                set(value) { this['_'.concat(validSetting)] = value },
              },
            }
          )
          this[validSetting] = this.settings[validSetting]
        }
      })
    this.bindableEventClassPropertyTypes
      .forEach((bindableEventClassPropertyType) => {
        this.toggleEvents(bindableEventClassPropertyType, 'on')
      })
  }
  resetEvents(classType) {
    [
      'off',
      'on'
    ].forEach((method) => {
      this.toggleEvents(classType, method)
    })
    return this
  }
  toggleEvents(classType, method) {
    const baseName = classType.concat('s')
    const baseEventsName = classType.concat('Events')
    const baseCallbacksName = classType.concat('Callbacks')
    const base = this[baseName]
    const baseEvents = this[baseEventsName]
    const baseCallbacks = this[baseCallbacksName]
    if(
      base &&
      baseEvents &&
      baseCallbacks
    ) {
      Object.entries(baseEvents)
        .forEach(([baseEventData, baseCallbackName]) => {
          const [baseTargetName, baseEventName] = baseEventData.split(' ')
          const baseTargetNameSubstringFirst = baseTargetName.substring(0, 1)
          const baseTargetNameSubstringLast = baseTargetName.substring(baseTargetName.length - 1)
          let baseTargets = []
          if(
            baseTargetNameSubstringFirst === '[' &&
            baseTargetNameSubstringLast === ']'
          ) {
            baseTargets = Object.entries(base)
              .reduce((_baseTargets, [baseName, baseTarget]) => {
                let baseTargetNameRegExpString = baseTargetName.slice(1, -1)
                let baseTargetNameRegExp = new RegExp(baseTargetNameRegExpString)
                if(baseName.match(baseTargetNameRegExp)) {
                  _baseTargets.push(baseTarget)
                }
                return _baseTargets
              }, [])
          } else {
            baseTargets.push(base[baseTargetName])
          }
          baseCallbacks[baseCallbackName] = baseCallbacks[baseCallbackName].bind(this)
          const baseEventCallback = baseCallbacks[baseCallbackName]
          if(
            baseTargetName &&
            baseEventName &&
            baseTargets.length &&
            baseEventCallback
          ) {
            baseTargets
              .forEach((baseTarget) => {
                try {
                  switch(method) {
                    case 'on':
                      baseTarget[method](baseEventName, baseEventCallback)
                      break
                    case 'off':
                      baseTarget[method](baseEventName, baseEventCallback.name.split(' ')[1])
                      break
                  }
                } catch(error) {}
              })
          }
        })
    }
    return this
  }
}
export default Controller
