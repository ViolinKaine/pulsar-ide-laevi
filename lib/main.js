const BashLanguageClient = require("./clients/bash")
const YamlLanguageClient = require("./clients/yaml")
const TypeScriptLanguageClient = require("./clients/typescript")
const jsonLinter = require("./simple-linters/json")
const cssLinter = require("./simple-linters/css")
const status = require("./status")

const clients = [new BashLanguageClient(), new YamlLanguageClient(), new TypeScriptLanguageClient()]

module.exports = {
  activate() {
    clients.forEach((c) => c.activate())
    // JSON/CSS are synchronous linters, not servers - always ready once active.
    status.markActive(jsonLinter.name)
    status.markActive(cssLinter.name)
  },
  deactivate() {
    status.deactivate()
    return Promise.all(clients.map((c) => c.deactivate()))
  },
  consumeLinterV2(indieDelegate) {
    return clients.map((c) => c.consumeLinterV2(indieDelegate))
  },
  provideLinter() {
    return [jsonLinter, cssLinter]
  },
  consumeStatusBar(statusBarService) {
    status.activate(statusBarService)
  },
}
