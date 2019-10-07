module.exports = async function Rollup(settings) {
  if(settings) {
    let plugins = {}
    Object.entries(settings.plugins)
      .forEach(([pluginName, pluginSettings]) => {
        switch(pluginName) {
          case 'babel':
            let babel = $.lib.rollupBabel(pluginSettings)
            plugins[pluginName] = babel
            break
          case 'sourcemaps':
            let sourcemaps = $.lib.rollupSourcemaps(pluginSettings)
            plugins[pluginName] = sourcemaps
            break
        }
      })
    settings.plugins = plugins
    settings.sourcemap = settings.sourcemap || false
    let rollupSettings = {
      input: settings.input,
      sourceMap: settings.sourceMap,
      plugins: settings.plugins,
      format: settings.format,
    }
    let sourceSettings = settings.fileName
    let sourcemapSettings = settings.sourcemaps || {}
    let task = $.lib.rollup(rollupSettings)
      .pipe($.lib.source(sourceSettings))
      .pipe($.lib.buffer())
      .pipe($.lib.dest(...settings.dest))
    return task
  } else {
    return $.lib.through2.obj()
  }
}
