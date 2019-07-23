module.exports = {
  consoleLog: function() { console.log(...arguments) },
  jsonStringify: function() { return JSON.stringify(arguments[0], null, 2) },
}
