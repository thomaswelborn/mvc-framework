module.exports = {
  consoleLog: function() { console.log(...arguments[0]) },
  jsonStringify: function() { return JSON.stringify(arguments[0], null, 2) },
}
