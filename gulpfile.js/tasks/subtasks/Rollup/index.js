module.exports = async function(settings) {
  if(settings) {
    let optionsInput = $.lib.lodash.cloneDeep(
      settings.options.input
    )
    let optionsPlugins = $.lib.lodash.cloneDeep(
      settings.options.plugins
    )
    let optionsOutput = $.lib.lodash.cloneDeep(
      settings.options.output
    )
    if(optionsPlugins) {
      optionsPlugins = settings.options.plugins
        .reduce((_plugins, pluginSettings) => {
          let pluginName = pluginSettings[0]
          let pluginOptions = pluginSettings[1] || {}
          let plugin = (Object.keys(pluginOptions).length)
            ? $.lib[pluginName](pluginOptions)
            : $.lib[pluginName]()
          _plugins.push(
            plugin
          )
          return _plugins
        }, [])
    }
    let bundle = await $.lib.rollup.rollup({
      input: optionsInput,
      plugins: optionsPlugins
    })
    return await bundle.write(optionsOutput)
  } else {
    return $.lib.through2.obj()
  }
}
