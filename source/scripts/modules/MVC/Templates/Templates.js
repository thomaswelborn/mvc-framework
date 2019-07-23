MVC.Templates = {
  ObjectQueryStringFormatInvalidRoot: function ObjectQueryStringFormatInvalid(data) {
    return [
      'Object Query "string" property must be formatted to first include "[@]".'
    ].join('\n')
  },
  DataSchemaMismatch: function DataSchemaMismatch(data) {
    return [
      `Data and Schema properties do not match.`
    ].join('\n')
  },
  DataFunctionInvalid: function DataFunctionInvalid(data) {
    [
      `Model Data property type "Function" is not valid.`
    ].join('\n')
  },
  DataUndefined: function DataUndefined(data) {
    [
      `Model Data property undefined.`
    ].join('\n')
  },
  SchemaUndefined: function SchemaUndefined(data) {
    [
      `Model "Schema" undefined.`
    ].join('\n')
  },
}
MVC.TMPL = MVC.Templates
