MVC.Validator = class {
  constructor(schema) {
    this._schema = schema
  }
  get _schema() { return this.schema }
  set _schema(schema) { this.schema = schema }
  get _results() { return this.results }
  set _results(results) { this.results = results }
  get _data() { return this.data }
  set _data(data) { this.data = data }
  validate(data) {
    this._data = data
    let validationSummary = {}
    Object.entries(this._schema)
      .forEach(([schemaKey, schemaSettings]) => {
        let validation = {}
        let value = data[schemaKey]
        validation.key = schemaKey
        if(schemaSettings.required) {
          validation.required = this.required(value, schemaSettings.required)
        }
        if(schemaSettings.type) {
          validation.type = this.type(value, schemaSettings.type)
        }
        if(schemaSettings.evaluations) {
          let validationEvaluations = this.evaluations(value, schemaSettings.evaluations)
          validation.evaluations = this.evaluationResults(validationEvaluations)
        }
        validationSummary[schemaKey] = validation
      })
    this._results = validationSummary
    return validationSummary
  }
  required(value, schemaSettings) {
    let validationSummary = {
      value: value,
    }
    let messages = Object.assign(
      {
        pass: 'Value is defined.',
        fail: 'Value is not defined.',
      },
      schemaSettings.messages
    )
    value = (value !== undefined)
    switch(MVC.Utils.typeOf(schemaSettings)) {
      case 'boolean':
        validationSummary.comparator = schemaSettings
        validationSummary.result = (value === schemaSettings)
        break
      case 'object':
        validationSummary.comparator = schemaSettings.value
        validationSummary.result = (value === schemaSettings.value)
        break
    }
    validationSummary.message = (validationSummary.result)
      ? messages.pass
      : messages.fail
    return validationSummary
  }
  type(value, schemaSettings) {
    let validationSummary = {
      value: value
    }
    let messages = Object.assign(
      {
        pass: 'Valid Type.',
        fail: 'Invalid Type.',
      },
      schemaSettings.messages
    )
    switch(MVC.Utils.typeOf(schemaSettings)) {
      case 'string':
        validationSummary.comparator
        validationSummary.result = (MVC.Utils.typeOf(value) === schemaSettings)
        break
      case 'object':
        validationSummary.result = (MVC.Utils.typeOf(value) === schemaSettings.value)
        break
    }
    validationSummary.message = (validationSummary.result)
      ? messages.pass
      : messages.fail
    return validationSummary
  }
  evaluations(value, evaluations) {
    return evaluations.reduce((_evaluations, evaluation, evaluationIndex) => {
      if(MVC.Utils.isArray(evaluation)) {
        _evaluations.push(
          ...this.evaluations(value, evaluation)
        )
      } else {
        evaluation.value = value
        let valueComparison = this.compareValues(
          evaluation.value,
          evaluation.comparison.value,
          evaluation.comparator,
          evaluation.messages
        )
        evaluation.results = evaluation.results || {}
        evaluation.results.value = valueComparison
        _evaluations.push(evaluation)
      }
      if(_evaluations.length > 1) {
        let currentEvaluation = _evaluations[evaluationIndex]
        if(currentEvaluation.comparison.statement) {
          let previousEvaluation = _evaluations[evaluationIndex - 1]
          let previousEvaluationComparisonValue = (currentEvaluation.results.statement)
            ? currentEvaluation.results.statement.result
            : currentEvaluation.results.value.result
          let statementComparison = this.compareStatements(
            previousEvaluationComparisonValue,
            currentEvaluation.comparison.statement,
            currentEvaluation.results.value.result,
            currentEvaluation.messages
          )
          currentEvaluation.results = currentEvaluation.results || {}
          currentEvaluation.results.statement = statementComparison
        }
      }
      return _evaluations
    }, [])
  }
  evaluationResults(evaluations) {
    let validationEvaluations = {
      pass: [],
      fail: [],
    }
    evaluations.forEach((evaluationValidation) => {
      if(evaluationValidation.results.statement) {
        if(evaluationValidation.results.statement.result === false) {
          validationEvaluations.fail.push(evaluationValidation)
        } else if(evaluationValidation.results.statement.result === true) {
          validationEvaluations.pass.push(evaluationValidation)
        }
      } else if(evaluationValidation.results.value) {
        if(evaluationValidation.results.value.result === false) {
          validationEvaluations.fail.push(evaluationValidation)
        } else if(evaluationValidation.results.value.result === true) {
          validationEvaluations.pass.push(evaluationValidation)
        }
      }
    })
    return validationEvaluations
  }
  compareValues(value, operator, comparator, messages) {
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
      result: evaluationResult,
      message: (evaluationResult)
        ? messages.pass
        : messages.fail
    }
  }
  compareStatements(value, operator, comparator, messages) {
    let evaluationResult
    switch(operator) {
      case MVC.CONST.Operators.Statement.AND:
        evaluationResult = value && comparator
        break
      case MVC.CONST.Operators.Statement.OR:
        evaluationResult = value || comparator
        break
    }
    return {
      result: evaluationResult,
      message: (evaluationResult)
        ? messages.pass
        : messages.fail
    }
  }
}
