const BashLanguageClient = require("./clients/bash")
const YamlLanguageClient = require("./clients/yaml")
const TypeScriptLanguageClient = require("./clients/typescript")
const BiomeLanguageClient = require("./clients/biome")
const PythonLanguageClient = require("./clients/python")
const cssLinter = require("./simple-linters/css")
const status = require("./status")

const clients = [
  new BashLanguageClient(),
  new YamlLanguageClient(),
  new TypeScriptLanguageClient(),
  new BiomeLanguageClient(),
  new PythonLanguageClient(),
]

module.exports = {
  activate() {
    clients.forEach((c) => c.activate())
    // Less/Scss is a synchronous linter, not a server - always ready once active.
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
    return [cssLinter]
  },
  provideOutlines() {
    // Returned as one merged provider, not an array of per-client providers -
    // atom-ide-outline's consumer expects a single object with getOutline
    // directly on it, not a list.
    return {
      name: "pulsar-ide-laevi",
      grammarScopes: clients.flatMap((c) => c.getGrammarScopes()),
      priority: 1,
      getOutline(editor) {
        const scope = editor.getGrammar().scopeName
        const client = clients.find((c) => c.getGrammarScopes().includes(scope))
        return client ? client.getOutline(editor) : null
      },
    }
  },
  consumeStatusBar(statusBarService) {
    status.activate(statusBarService)
  },
  provideDefinitions() {
    // Each client's own grammarScopes already filters it to the right files -
    // return one provider per client, same array pattern as provideLinter.
    return clients.map((c) => c.provideDefinitions())
  },
  provideFindReferences() {
    return clients.map((c) => c.provideFindReferences())
  },
}
