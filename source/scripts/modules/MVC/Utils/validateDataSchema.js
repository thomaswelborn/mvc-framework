MVC.Utils.validateDataSchema = function validateDataSchema(data, schema) {
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
          console.log(schema.name)
          for(let [arrayKey, arrayValue] of Object.entries(data)) {
            array.push(
              this.validateDataSchema(arrayValue)
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
          console.log(schema.name)
          for(let [objectKey, objectValue] of Object.entries(data)) {
            object[objectKey] = this.validateDataSchema(objectValue, schema[objectKey])
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
          console.log(schema.name)
          return data
        } else {
          throw MVC.TMPL
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
        throw MVC.TMPL
        break
      case 'function':
        throw MVC.TMPL
        break
    }
  } else {
    throw MVC.TMPL
  }
}
