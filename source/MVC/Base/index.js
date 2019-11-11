import { UID } from '../Utils/index'
import Events from '../Events/index'

class Base extends Events {
  constructor(settings, configuration) {
    super(...arguments)
    this.addClassDefaultProperties()
    this.addBindableClassProperties()
    this._settings = settings
    this._configuration = configuration
  }
  get uid() {
    this._uid = (this._uid)
    ? this._uid
    : UID()
    return this._uid
  }
  get _name() { return this.name }
  set _name(name) { this.name = name }
  get _settings() {
    this.settings = this.settings || {}
    return this.settings
  }
  set _settings(settings) {
     this.settings = settings || {}
     this.classDefaultProperties
       .forEach((classSetting) => {
         if(this.settings[classSetting]) {
           this['_'.concat(classSetting)] = this.settings[classSetting]
         }
       })
     return this
  }
  get _configuration() {
    this.configuration = this.configuration || {}
    return this.configuration
  }
  set _configuration(configuration) { this.configuration = configuration }
  get bindableClassPropertyExtensions() { return [
    '',
    'Events',
    'Callbacks'
  ] }
  get _uiElementSettings() {
    this.uiElementSettings = this.uiElementSettings || {}
    return this.uiElementSettings
  }
  set _uiElementSettings(uiElementSettings) {
    this.uiElementSettings = uiElementSettings
  }
  capitalizePropertyName(propertyName) {
    if(propertyName.slice(0, 2) === 'ui') {
      return propertyName.replace(/^ui/, 'UI')
    } else {
      let firstCharacter = propertyName.substring(0).toUpperCase()
      return propertyName.replace(/^./, firstCharacter)
    }
  }
  addClassDefaultProperties() {
    this.classDefaultProperties
      .forEach((classDefaultProperty) => {
        if(this[classDefaultProperty]) {
          let property = this[classDefaultProperty]
          Object.defineProperty(this, classDefaultProperty, {
            writable: true,
            value: property
          })
          this['_'.concat(classDefaultProperty)] = property
        }
      })
    return this
  }
  addBindableClassProperties() {
    if(this.bindableClassProperties) {
      this.bindableClassProperties
        .forEach((bindableClassPropertyName) => {
          this.bindableClassPropertyExtensions
            .forEach((propertyNameExtension) => {
              this.addBindableClassProperty(
                bindableClassPropertyName,
                propertyNameExtension
              )
            })
        })
    }
    return this
  }
  addBindableClassProperty(bindableClassPropertyName, propertyNameExtension) {
    let context = this
    let propertyName = bindableClassPropertyName.concat('s', propertyNameExtension)
    let capitalizePropertyName = this.capitalizePropertyName(propertyName)
    let addBindableClassPropertyName = 'add'.concat(capitalizePropertyName)
    let removeBindableClassPropertyName = 'remove'.concat(capitalizePropertyName)
    if(propertyName === 'uiElements') {
      context._uiElementSettings = this[propertyName]
    }
    let currentPropertyValues = this[propertyName]
    Object.defineProperties(
      this,
      {
        [propertyName]: {
          writable: true,
          value: currentPropertyValues,
        },
        ['_'.concat(propertyName)]: {
          get() {
            context[propertyName] = context[propertyName] || {}
            return context[propertyName]
          },
          set(values) {
            Object.entries(values)
              .forEach(([key, value]) => {
                switch(propertyName) {
                  case 'uiElements':
                    context._uiElementSettings[key] = value
                    context['_'.concat(propertyName)][key] = context.element.querySelectorAll(value)
                    break
                  default:
                    context['_'.concat(propertyName)][key] = value
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
              context['_'.concat(propertyName)] = {
                [key]: value
              }
            } else if(arguments.length === 1) {
              let values = arguments[0]
              context['_'.concat(propertyName)] = values
            }
            return context
          }
        },
        [removeBindableClassPropertyName]: {
          value: function() {
            if(arguments.length === 1) {
              let key = arguments[0]
              switch(propertyName) {
                case 'uiElements':
                  delete context['_'.concat(propertyName)][key]
                  delete context['_'.concat('uiElementSettings')][key]
                  break
                default:
                  delete context['_'.concat(propertyName)][key]
                  break
              }
            } else if(arguments.length === 0){
              Object.keys(context['_'.concat(propertyName)])
                .forEach((key) => {
                  switch(propertyName) {
                    case 'uiElements':
                      delete context['_'.concat(propertyName)][key]
                      delete context['_'.concat('uiElementSettings')][key]
                      break
                    default:
                      delete context['_'.concat(propertyName)][key]
                      break
                  }
                })
            }
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
            let classTypeEventCallback
            switch(method) {
              case 'on':
                switch(classType) {
                  case 'uiElement':
                    classTypeEventCallback = this[classType.concat('Callbacks')][classTypeCallbackName].bind(this)
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
                    classTypeEventCallback = this[classType.concat('Callbacks')][classTypeCallbackName]
                    classTypeTarget[method](classTypeEventName, classTypeEventCallback, this)
                    break
                }
                break
              case 'off':
                classTypeEventCallback = this[classType.concat('Callbacks')][classTypeCallbackName]
                switch(classType) {
                  case 'uiElement':
                    let classTypeEventCallbackNamespace = classTypeEventCallback.name.split(' ')[1]
                    if(classTypeTarget instanceof NodeList) {
                      Array.from(classTypeTarget)
                        .forEach((_classTypeTarget) => {
                          _classTypeTarget[method](classTypeEventName, classTypeEventCallbackNamespace)
                        })
                    } else if(classTypeTarget instanceof HTMLElement) {
                      classTypeTarget[method](classTypeEventName, classTypeEventCallbackNamespace)
                    }
                    break
                  default:
                    classTypeTarget[method](classTypeEventName, classTypeEventCallback, this)
                    break
                }
                break
            }
          } catch(error) { throw new ReferenceError(
            error
          ) }
        })
    }
    return this
  }
}
export default Base
