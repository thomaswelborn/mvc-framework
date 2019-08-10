MVC.Utils.validateDataSchema = function validateDataSchema(data, schema) {
  if(schema) {
    Object.entries(schema)
      .forEach(([schemaKey, schemaSettings]) => {
        let validation = {}
        let value = data[schemaKey]
        validation.key = schemaKey
        if(schemaSettings.required) {
          validation.required = MVC.Utils.validateDataSchema
            .required(value)
        }
        if(schemaSettings.type) {
          validation.type = MVC.Utils.validateDataSchema
            .type(value, schemaSettings.type)
        }
        if(schemaSettings.evaluations) {
          validation.evaluations = MVC.Utils.validateDataSchema
            .evaluations(value, schemaSettings.evaluations)
        }
        console.log(validation)
      })
  }
}

MVC.Utils.validateDataSchema.required = function required(value) {
  return (
    MVC.Utils.typeOf(value) !== 'undefined'
  ) ? true
    : false
}


MVC.Utils.validateDataSchema.type = function required(value, type) {
  return (
    MVC.Utils.isEqualType(
      value,
      type
    )
  )
}
MVC.Utils.validateDataSchema.evaluations = function required(value, evaluations) {
  return evaluations.reduce((_evaluations, evaluation, evaluationIndex) => {
    if(MVC.Utils.isArray(evaluation)) {
      _evaluations.push(
        ...MVC.Utils.validateDataSchema.evaluations(value, evaluation)
      )
    } else {
      evaluation.value = value
      let comparisonEvaluation = MVC.Utils.validateDataSchema.compareValues(
        evaluation.value, evaluation.comparison.value, evaluation.comparator
      )
      _evaluations.push(comparisonEvaluation)
    }
    return _evaluations
  }, [])
}

MVC.Utils.validateDataSchema.compareValues = function compareValues(value, operator, comparator) {
  let evaluationResult
  switch(operator) {
    case MVC.CONST.Operators.Comparison.EQ:
      evaluationResult = (value == comparator)
      break
    case MVC.CONST.Operators.Comparison.STEQ:
      evaluationResult = (value === comparator)
      break
    case MVC.CONST.Operators.Comparison.NOEQ:
      evaluationResult = (value != comparator)
      break
    case MVC.CONST.Operators.Comparison.STNOEQ:
      evaluationResult = (value !== comparator)
      break
    case MVC.CONST.Operators.Comparison.GT:
      evaluationResult = (value > comparator)
      break
    case MVC.CONST.Operators.Comparison.LT:
      evaluationResult = (value < comparator)
      break
    case MVC.CONST.Operators.Comparison.GTE:
      evaluationResult = (value >= comparator)
      break
    case MVC.CONST.Operators.Comparison.LTE:
      evaluationResult = (value <= comparator)
      break
  }
  return {
    value: value,
    operator: operator,
    comparator: comparator,
    result: evaluationResult,
  }
}

MVC.Utils.validateDataSchema.compareStatements = function compareStatements(value, operator, comparator) {
  let evaluationResult
  switch(operator) {
    case MVC.CONST.Operators.Statement.AND:
      evaluationResult = value && comparator
      break
    case MVC.CONST.Operators.Statement.OR:
      evaluationResult = value || comparator
      break
  }
  return evaluationResult
}
