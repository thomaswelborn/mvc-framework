module.exports = function StringTransform(settings) {
  this.dashCaseToCamelCase = function(origin) {
    origin = origin
      .split($.lib.path.sep)
      .map((pathSegment, pathSegmentIndex) => {
        if(pathSegment) {
          pathSegment = pathSegment
          .split('-')
          .map((caseSegment, caseSegmentIndex) => {
            if(settings.options) {
              let caseSegmentCharacters = caseSegment.split('')
              switch(settings.options.first) {
                case 'upperCase':
                  caseSegmentCharacters[0] = caseSegmentCharacters[0]
                    .toUpperCase()
                break
                case 'lowerCase':
                  caseSegmentCharacters[0] = caseSegmentCharacters[0]
                    .toLowerCase()
                break
              }
              caseSegment = caseSegmentCharacters.join('')
            }
            return caseSegment
          })
          .join('')
        }
        return pathSegment
      })
      .join('.')
    return origin
  }
  this.camelCaseToDashCase = function(origin) {
    origin = origin
      .split($.lib.path.sep)
      .map((pathSegment, pathSegmentIndex) => {
        if(pathSegment) {
          pathSegment = pathSegment
            .split(/(?=[A-Z])/)
            .map((caseSegment, caseSegmentIndex) => {
              if(settings.options) {
                let characters = caseSegment.split('')
                characters[0] = characters[0].toLowerCase()
                caseSegment = characters.join('')
              }
              if(caseSegmentIndex) {
                caseSegment = '-'.concat(caseSegment)
              }
              return caseSegment
            })
            .join('')
          return pathSegment
        }
      })
      .join('.')
    return origin
  }
  let origin = settings.origin
  let from = settings.from
  let to = settings.to.split('')
  to[0] = to[0].toUpperCase()
  to = to.join('')
  let transformFunction = this[[from, 'To', to].join('')]
  try {
    origin = transformFunction(origin)
  } catch(err) {}
  return origin
}
