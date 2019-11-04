module.exports = async function(settings) {
  if(settings) {
    let optionsInput = $.lib.lodash.cloneDeep(
      settings.options.input
    )
    let optionsOutput = $.lib.lodash.cloneDeep(
      settings.options.output
    )
    if(optionsInput.plugins) {
      optionsInput.plugins = settings.options.input.plugins
        .reduce((_plugins, pluginSettings) => {
          let pluginName = pluginSettings[0]
          let pluginOptions = pluginSettings[1]
          _plugins.push(
            $.lib[pluginName](pluginOptions)
          )
          return _plugins
        }, [])
    }
    let bundle = await $.lib.rollup.rollup(optionsInput)
    return await bundle.write(optionsOutput)
  } else {
    return $.lib.through2.obj()
  }
}
