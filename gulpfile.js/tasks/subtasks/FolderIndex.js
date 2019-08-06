const $handlebars = require('handlebars')
let FolderIndex = class {
  constructor(configuration) {
    this._configuration = configuration
  }
  get defaults() {
    return {
      recursive: false,
      ignoreFiles: [
        'index.js'
      ],
      template: "module.exports = { {{#each imports}} '{{name}}': require('{{path}}'), {{/each}} }",
      file: {
        name: 'index',
        extension: '.js',
      }
    }
  }
  get _configuration() { return this.configuration }
  set _configuration(configuration) {
    this.configuration = configuration
    if(this.configuration.src) this._src = this.configuration.src
    if(this.configuration.options.recursive) this._recursive = this.configuration.options.recursive
    if(this.configuration.options.ignoreFiles) this._ignoreFiles = this.configuration.options.ignoreFiles
    if(this.configuration.options.ignoreFolders) this._ignoreFolders = this.configuration.options.ignoreFolders
    if(this.configuration.options.template) this._template = this.configuration.options.template
    if(this.configuration.options.file) this._file = this.configuration.options.file
  }
  get _src() { return this.src }
  set _src(src) { this.src = src }
  get _recursive() { return this.recursive }
  set _recursive(recursive) { this.recursive = recursive }
  get _ignoreFiles() { return this.ignoreFiles }
  set _ignoreFiles(ignoreFiles) { this.ignoreFiles = ignoreFiles }
  get _ignoreFolders() { return this.ignoreFolders }
  set _ignoreFolders(ignoreFolders) { this.ignoreFolders = ignoreFolders }
  get _template() {
    return $handlebars.compile(this.template)
  }
  set _template(template) { this.template = template }
  get _file() { return this.file }
  set _file(file) { this.file = file }
  index() {
    for(let src of this.src) {
      let folder = $.lib.fs.readdirSync(
        src,
        {
          withFileTypes: true
        }
      )
      let nodes = []
      folder.forEach((node) => {
        let file = {}
        let fileName = ''
        let filePath = ''
        if(node.isDirectory()) {
          if(this.recursive) {
            let recursiveSource = $.lib.path.join(src, node.name)
            let recursiveFolderData = {
              src: [
                recursiveSource
              ],
              options: this.configuration.options
            }
            let folderIndex = new Tasks.Subtasks.FolderIndex(recursiveFolderData)
            folderIndex.index()
          }
          fileName = node.name
          filePath = '.'.concat('/', fileName)
        } if(node.isFile()) {
          let fileData = node.name.split('.')
          let fileExtension = fileData[1]
          fileName = fileData[0]
          filePath = '.'.concat('/', fileName, '.', fileExtension)
        }
        let ignore = false
        if(this.ignoreFiles) {
          this.ignoreFiles.forEach((ignoreFile) => {
            if(ignoreFile === node.name) {
              ignore = true
            }
          })
        }
        if(this.ignoreFolders) {
          this.ignoreFolders.forEach((ignoreFolder) => {
            if(ignoreFolder === src) {
              ignore = true
            }
          })
        }
        if(!ignore) {
          file.name = fileName
          file.path = filePath
          nodes.push(file)
        }
      })
      let fileData = this._template(nodes)
      let fileDestination = $.lib.path.join(src, this.file.name.concat(
        this.file.extension
      ))
      $.lib.fs.writeFileSync(fileDestination, fileData)
    }
  }
}

module.exports = FolderIndex
