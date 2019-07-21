MVC.Utils.validateDataSchema = function validate(data, schema) {
  if(schema) {
    switch(MVC.Utils.typeOf(data)) {
      case 'array':
        let array = []
        schema = (MVC.Utils.typeOf(schema) === 'function')
          ? schema()
          : schema
        if(
          MVC.Utils.isEqualType(
            MVC.Utils.typeOf(schema),
            MVC.Utils.typeOf(array)
          )
        ) {
          for(let [arrayKey, arrayValue] of Object.entries(data)) {
            array.push(
              this.validate(arrayValue)
            )
          }
        }
        return array
        break
      case 'object':
        let object = {}
        schema = (MVC.Utils.typeOf(schema) === 'function')
          ? schema()
          : schema
        if(
          MVC.Utils.isEqualType(
            MVC.Utils.typeOf(schema),
            MVC.Utils.typeOf(object)
          )
        ) {
          for(let [objectKey, objectValue] of Object.entries(data)) {
            object[objectKey] = this.validate(objectValue, schema[objectKey])
          }
        }
        return object
        break
      case 'string':
      case 'number':
      case 'boolean':
        schema = (MVC.Utils.typeOf(schema) === 'function')
          ? schema()
          : schema
        if(
          MVC.Utils.isEqualType(
            MVC.Utils.typeOf(schema),
            MVC.Utils.typeOf(data)
          )
        ) {
          return data
        } else {
          throw MVC.CONST.TMPL
        }
        break
      case 'null':
        if(
          MVC.Utils.isEqualType(
            MVC.Utils.typeOf(schema),
            MVC.Utils.typeOf(data)
          )
        ) {
          return data
        }
        break
      case 'undefined':
        throw MVC.CONST.TMPL
        break
      case 'function':
        throw MVC.CONST.TMPL
        break
    }
  } else {
    throw MVC.CONST.TMPL
  }
}
