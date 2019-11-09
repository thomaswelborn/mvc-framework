import Utils from '../Utils/index'
import Events from '../Events/index'

class Base extends Events {
  constructor(settings, configuration) {
    super(...arguments)
    this._settings = settings
    this._configuration = configuration
    this.addProperties()
  }
  get uid() {
    this._uid = (this._uid)
    ? this._uid
    : Utils.UID()
    return this._uid
  }
  get _name() { return this.name }
  set _name(name) { this.name = name }
  get _configuration() {
    this.configuration = this.configuration || {}
    return this.configuration
  }
  set _configuration(configuration) { this.configuration = configuration }
  get _settings() {
    this.settings = this.settings || {}
    return this.settings
  }
  set _settings(settings) {
     this.settings = settings || {}
     this.classSettingsProperties
       .forEach((classSetting) => {
         if(this.settings[classSetting]) {
           this['_'.concat(classSetting)] = this.settings[classSetting]
         } else if(this[classSetting]) {
           this['_'.concat(classSetting)] = this[classSetting]
         }
       })
  }
  addProperties() {
    if(this.bindableClassProperties) {
      this.bindableClassProperties
        .forEach((bindableClassPropertyName) => {
          this
            .addProperty(bindableClassPropertyName)
            .addPropertyCallbacks(bindableClassPropertyName)
            .addPropertyEvents(bindableClassPropertyName)
            .resetTargetClassEvents(bindableClassPropertyName)
        })
    }
    return this
  }
  addProperty(bindableClassPropertyName) {
    let context = this
    let propertyName = bindableClassPropertyName.concat('s')
    let capitalizePropertyName = propertyName.split('')
      .map((character, characterIndex) => {
        return (characterIndex === 0)
          ? character.toUpperCase()
          : character
      }).join('')
    let addPropertyMethodName = 'add'.concat(capitalizePropertyName)
    let removePropertyMethodName = 'remove'.concat(capitalizePropertyName)
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
              .forEach(([valueName, value]) => {
                context['_'.concat(propertyName)][valueName] = value
              })
            this.resetTargetClassEvents(bindableClassPropertyName)
          },
        },
        [addPropertyMethodName]: {
          value: function(values) {
            context['_'.concat(propertyName)] = values
          }
        },
        [removePropertyMethodName]: {
          value: function() {
            if(arguments[0]) {
              let name = arguments[0]
              delete context['_'.concat(propertyName)][name]
            } else {
              Object.keys(context['_'.concat(propertyName)])
                .forEach((propertyKey) => {
                  delete context['_'.concat(propertyName)][propertyKey]
                })
            }
          }
        },
      }
    )
    return this
  }
  addPropertyCallbacks(bindableClassPropertyName) {
    let context = this
    let propertyName = bindableClassPropertyName.concat('s')
    let propertyCallbacksName = bindableClassPropertyName.concat('Callbacks')
    let capitalizePropertyCallbacksName = propertyCallbacksName.split('')
      .map((character, characterIndex) => {
        return (characterIndex === 0)
          ? character.toUpperCase()
          : character
      }).join('')
    let addPropertyCallbacksName = 'add'.concat(capitalizePropertyCallbacksName)
    let removePropertyCallbacksName = 'remove'.concat(capitalizePropertyCallbacksName)
    let currentPropertyCallbackValues = this[propertyCallbacksName]
    Object.defineProperties(
      this,
      {
        [propertyCallbacksName]: {
          writable: true,
          value: currentPropertyCallbackValues,
        },
        ['_'.concat(propertyCallbacksName)]: {
          get() {
            context[propertyCallbacksName] = context[propertyCallbacksName] || {}
            return context[propertyCallbacksName]
          },
          set(values) {
            Object.entries(values)
              .forEach(([valueName, value]) => {
                context['_'.concat(propertyCallbacksName)][valueName] = value.bind(context)
              })
            this.resetTargetClassEvents(bindableClassPropertyName)
          },
        },
        [addPropertyCallbacksName]: {
          value: function(values) {
            context['_'.concat(propertyCallbacksName)] = values
          }
        },
        [removePropertyCallbacksName]: {
          value: function() {
            if(arguments[0]) {
              let name = arguments[0]
              delete context['_'.concat(propertyCallbacksName)][name]
            } else {
              Object.keys(context['_'.concat(propertyCallbacksName)])
                .forEach((propertyKey) => {
                  delete context['_'.concat(propertyCallbacksName)][propertyKey]
                })
            }
          }
        },
      }
    )
    return this
  }
  addPropertyEvents(bindableClassPropertyName) {
    let context = this
    let propertyName = bindableClassPropertyName.concat('s')
    let propertyEventsName = bindableClassPropertyName.concat('Events')
    let capitalizePropertyEventsName = propertyEventsName.split('')
      .map((character, characterIndex) => {
        return (characterIndex === 0)
          ? character.toUpperCase()
          : character
      }).join('')
    let addPropertyEventsName = 'add'.concat(capitalizePropertyEventsName)
    let removePropertyEventsName = 'remove'.concat(capitalizePropertyEventsName)
    let currentPropertyEventValues = this[propertyEventsName]
    Object.defineProperties(
      this,
      {
        [propertyEventsName]: {
          writable: true,
          value: currentPropertyEventValues
        },
        ['_'.concat(propertyEventsName)]: {
          get() {
            context[propertyEventsName] = context[propertyEventsName] || {}
            return context[propertyEventsName]
          },
          set(values) {
            Object.entries(values)
              .forEach(([valueName, value]) => {
                context['_'.concat(propertyEventsName)][valueName] = value
              })
            this.resetTargetClassEvents(bindableClassPropertyName)
          },
        },
        [addPropertyEventsName]: {
          value: function(values) {
            context['_'.concat(propertyEventsName)] = values
          }
        },
        [removePropertyEventsName]: {
          value: function() {
            if(arguments[0]) {
              let name = arguments[0]
              delete context['_'.concat(propertyEventsName)][name]
            } else {
              Object.keys(context['_'.concat(propertyEventsName)])
                .forEach((propertyKey) => {
                  delete context['_'.concat(propertyEventsName)][propertyKey]
                })
            }
          }
        },
      }
    )
    return this
  }
  resetTargetClassEvents(bindableClassPropertyName) {
    return this
      .toggleTargetClassEvents(bindableClassPropertyName, 'off')
      .toggleTargetClassEvents(bindableClassPropertyName, 'on')
  }
  toggleTargetClassEvents(classType, method) {
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
                    classTypeTarget[method](classTypeEventName, classTypeEventCallback)
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
                    classTypeTarget[method](classTypeEventName, classTypeEventCallbackNamespace)
                    break
                  default:
                    classTypeTarget[method](classTypeEventName, classTypeEventCallback, this)
                    break
                }
                break
            }
          } catch(error) { throw new ReferenceError(
            DemoProject.Base.Constants.Errors.CLASS_EVENT_BINDING_FAIL
          ) }
        })
    }
    return this
  }
}
export default Base
