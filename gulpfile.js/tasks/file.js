module.exports = function(rootProcess, data) {
  let File = function(callback) {
    this.prettyprintSettings = {
      options: {
        indentSize: 2,
        outputTo: 'JSON',
        fullFunction: true,
      }
    }
    this.beautifySettings = {
      options: {
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: -1,
        preserve_newlines: false,
        keep_array_indentation: false,
        break_chained_methods: false,
        indent_scripts: 'normal',
        brace_style: 'collapse,preserve-inline',
        space_before_conditional: true,
        unescape_strings: false,
        jslint_happy: false,
        end_with_newline: false,
        wrap_line_length: 0,
        indent_inner_html: false,
        comma_first: false,
        e4x: false,
        indent_empty_lines: true
      },
    }
    for(let [packageName, packageSettings] of Object.entries(data)) {
      let fileData = require(
        $.lib.path.join(
          $.lib.path.relative(
            __dirname,
            $.basedir
          ),
          packageSettings.src
        )
      )
      this.prettyprintSettings.options.object = fileData
      fileData = Tasks.Subtasks.PrettyPrint(this.prettyprintSettings)
      this.beautifySettings.data = fileData
      fileData = Tasks.Subtasks.Beautify(this.beautifySettings)
      fileData = packageSettings.file.namespace.concat(' = ', fileData)
      let fileDest = $.lib.path.join(
        packageSettings.dest,
        packageSettings.file.name
      )
      $.lib.fs.writeFile(fileDest, fileData, () => console.log)
    }
    callback()
  }
  return File
}
