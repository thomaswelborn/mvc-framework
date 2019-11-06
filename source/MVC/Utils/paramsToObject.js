const paramsToObject = function paramsToObject(params) {
    var params = params.split('&')
    var object = {}
    params.forEach((paramData) => {
      paramData = paramData.split('=')
      object[paramData[0]] = decodeURIComponent(paramData[1] || '')
    })
    return JSON.parse(JSON.stringify(object))
}
export default paramsToObject
