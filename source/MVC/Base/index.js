import '../Shims/events.js'
import Events from '../Events/index.js'

class Base extends Events {
  constructor(settings, configuration) {
    super()
    this._configuration = configuration || {}
    this._settings = settings || {}
    this.addBindableClassProperties()
    this.addClassDefaultProperties()
  }
  get _uuid() {
    this.uuid = this.uuid || MVC.Utils.UUID()
    return this.uuid
  }
  get _name() { return this.name }
  set _name(name) { this.name = name }
  get _settings() {
    this.settings = this.settings || {}
    return this.settings
  }
  set _settings(settings) {
    this.settings = settings
    let classDefaultProperties = this.classDefaultProperties || []
    classDefaultProperties = classDefaultProperties.concat(this.getBindableClassPropertiesNames())
    Object.entries(this.settings)
      .forEach(([settingKey, settingValue]) => {
        if(classDefaultProperties.indexOf(settingKey) === -1) {
          Object.defineProperty(
            this,
            ['_'.concat(settingKey)],
            {
              get() { return this[settingKey] },
              set(value) { this[settingKey] = value },
            }
          )
          this['_'.concat(settingKey)] = settingValue
        }
      })
  }
  get _configuration() {
    this.configuration = this.configuration || {}
    return this.configuration
  }
  set _configuration(configuration) {
    this.configuration = configuration
  }
  get _uiElementSettings() {
    this.uiElementSettings = this.uiElementSettings || {}
    return this.uiElementSettings
  }
  set _uiElementSettings(uiElementSettings) {
    this.uiElementSettings = uiElementSettings
  }
  getBindableClassPropertiesNames() {
    return (this.bindableClassProperties)
      ? this.bindableClassProperties
        .reduce((_bindableClassPropertiesNames, bindableClassPropertyName) => {
          _bindableClassPropertiesNames = _bindableClassPropertiesNames.concat(
            this.getBindableClassPropertyNames(
              bindableClassPropertyName
            )
          )
          return _bindableClassPropertiesNames
        }, [])
      : []
  }
  getBindableClassPropertyNames(bindableClassPropertyName) {
    switch(bindableClassPropertyName) {
      case 'data':
        return [
          bindableClassPropertyName.concat(''),
          bindableClassPropertyName.concat('Events'),
          bindableClassPropertyName.concat('Callbacks')
        ]
      default:
        return [
          bindableClassPropertyName.concat('s'),
          bindableClassPropertyName.concat('Events'),
          bindableClassPropertyName.concat('Callbacks')
        ]
    }
  }
  capitalizePropertyName(bindableClassPropertyName) {
    if(bindableClassPropertyName.slice(0, 2) === 'ui') {
      return bindableClassPropertyName.replace(/^ui/, 'UI')
    } else {
      let firstCharacter = bindableClassPropertyName.substring(0, 1).toUpperCase()
      return bindableClassPropertyName.replace(/^./, firstCharacter)
    }
  }
  addClassDefaultProperties() {
    this.classDefaultProperties
      .forEach((classDefaultProperty, classDefaultPropertyIndex) => {
        let currentPropertyValue = this.settings[classDefaultProperty] ||
        this[classDefaultProperty]
        if(
          currentPropertyValue
        ) {
          Object.defineProperty(this, classDefaultProperty, {
            writable: true,
          })
          this['_'.concat(classDefaultProperty)] = currentPropertyValue
        }
      })
    return this
  }
  addBindableClassProperties() {
    if(this.bindableClassProperties) {
      this.bindableClassProperties
        .forEach((bindableClassPropertyName) => {
          let bindableClassPropertyMethods = this.getBindableClassPropertyNames(
            bindableClassPropertyName
          )
          bindableClassPropertyMethods
            .forEach((bindableClassPropertyMethod, bindableClassPropertyMethodIndex) => {
              this.addBindableClassProperty(bindableClassPropertyMethod)
              if(bindableClassPropertyMethodIndex === bindableClassPropertyMethods.length - 1) {
                this.toggleTargetBindableClassEvents(bindableClassPropertyName, 'on')
              }
            })
        })
    }
    return this
  }
  addBindableClassProperty(bindableClassPropertyName) {
    let context = this
    let capitalizePropertyName = this.capitalizePropertyName(bindableClassPropertyName)
    let addBindableClassPropertyName = 'add'.concat(capitalizePropertyName)
    let removeBindableClassPropertyName = 'remove'.concat(capitalizePropertyName)
    if(bindableClassPropertyName === 'uiElements') {
      context._uiElementSettings = this[bindableClassPropertyName]
    }
    let currentPropertyValues =
      this.settings[bindableClassPropertyName] ||
      this[bindableClassPropertyName]
    Object.defineProperties(
      this,
      {
        [bindableClassPropertyName]: {
          writable: true,
          value: currentPropertyValues,
        },
        ['_'.concat(bindableClassPropertyName)]: {
          get() {
            context[bindableClassPropertyName] = context[bindableClassPropertyName] || {}
            return context[bindableClassPropertyName]
          },
          set(values) {
            let _values = Object.entries(values)
            _values
              .forEach(([key, value], index) => {
                switch(bindableClassPropertyName) {
                  case 'uiElements':
                    context._uiElementSettings[key] = value
                    Object.defineProperty(
                      context['_'.concat(bindableClassPropertyName)],
                      [key],
                      {
                        configurable: true,
                        get() {
                          if(context.element) {
                            return context.element.querySelectorAll(value)
                          }
                        }
                      }
                    )
                    if(index === _values.length - 1) {
                      Object.defineProperty(
                        context['_'.concat(bindableClassPropertyName)],
                        '$element',
                        {
                          configurable: true,
                          get() {
                            if(context.element) {
                              return context.element
                            }
                          }
                        }
                      )
                    }
                    break
                  default:
                    context['_'.concat(bindableClassPropertyName)][key] = value
                    break
                }
              })
          },
        },
        [addBindableClassPropertyName]: {
          value: function() {
            if(arguments.length === 2) {
              let key = arguments[0]
              let value = arguments[1]
              context['_'.concat(bindableClassPropertyName)] = {
                [key]: value
              }
            } else if(arguments.length === 1) {
              let values = arguments[0]
              context['_'.concat(bindableClassPropertyName)] = values
            }
            this.resetTargetBindableClassEvents(bindableClassPropertyName)
            return context
          }
        },
        [removeBindableClassPropertyName]: {
          value: function() {
            if(arguments.length === 1) {
              let key = arguments[0]
              switch(bindableClassPropertyName) {
                case 'uiElements':
                  delete context['_'.concat(bindableClassPropertyName)][key]
                  delete context['_'.concat('uiElementSettings')][key]
                  break
                default:
                  delete context['_'.concat(bindableClassPropertyName)][key]
                  break
              }
            } else if(arguments.length === 0){
              Object.keys(context['_'.concat(bindableClassPropertyName)])
                .forEach((key) => {
                  switch(bindableClassPropertyName) {
                    case 'uiElements':
                      delete context['_'.concat(bindableClassPropertyName)][key]
                      delete context['_'.concat('uiElementSettings')][key]
                      break
                    default:
                      delete context['_'.concat(bindableClassPropertyName)][key]
                      break
                  }
                })
            }
            this.resetTargetBindableClassEvents(bindableClassPropertyName)
            return context
          }
        },
      }
    )
    if(currentPropertyValues) {
      this[addBindableClassPropertyName](currentPropertyValues)
    }
    return this
  }
  resetTargetBindableClassEvents(bindableClassPropertyName) {
    return this
      .toggleTargetBindableClassEvents(bindableClassPropertyName, 'off')
      .toggleTargetBindableClassEvents(bindableClassPropertyName, 'on')
  }
  toggleTargetBindableClassEvents(classType, method) {
    if(
      this[classType.concat('s')] &&
      this[classType.concat('Events')] &&
      this[classType.concat('Callbacks')]
    ) {
      Object.entries(this[classType.concat('Events')])
        .forEach(([classTypeEventData, classTypeCallbackName]) => {
          try {
            classTypeEventData = classTypeEventData.split(' ')
            let classTypeTargetName = classTypeEventData[0]
            let classTypeEventName = classTypeEventData[1]
            let classTypeTarget = this[classType.concat('s')][classTypeTargetName]
            let classTypeEventCallback = (classType === 'uiElement')
              ? this[classType.concat('Callbacks')][classTypeCallbackName]
              : this[classType.concat('Callbacks')][classTypeCallbackName].bind(this)
            this.toggleTargetBindableClassEvent(
              classType,
              classTypeTarget,
              classTypeEventName,
              classTypeEventCallback,
              method
            )
          } catch(error) { throw new ReferenceError(
            error
          ) }
        })
    }
    return this
  }
  toggleTargetBindableClassEvent(
    classType,
    classTypeTarget,
    classTypeEventName,
    classTypeEventCallback,
    method
  ) {
    switch(method) {
      case 'on':
        switch(classType) {
          case 'uiElement':
            if(classTypeTarget instanceof NodeList) {
              Array.from(classTypeTarget)
                .forEach((_classTypeTarget) => {
                  _classTypeTarget[method](classTypeEventName, classTypeEventCallback)
                })
            } else if(classTypeTarget instanceof HTMLElement) {
              classTypeTarget[method](classTypeEventName, classTypeEventCallback)
            }
            break
          default:
            classTypeTarget[method](classTypeEventName, classTypeEventCallback)
            break
        }
        break
      case 'off':
        switch(classType) {
          case 'uiElement':
            if(classTypeTarget instanceof NodeList) {
              Array.from(classTypeTarget)
                .forEach((_classTypeTarget) => {
                  _classTypeTarget[method](classTypeEventName, classTypeEventCallback)
                })
            } else if(classTypeTarget instanceof HTMLElement) {
              classTypeTarget[method](classTypeEventName, classTypeEventCallback)
            }
            break
          default:
            classTypeTarget[method](classTypeEventName, classTypeEventCallback)
            break
        }
        break
    }
  }
}
export default Base
