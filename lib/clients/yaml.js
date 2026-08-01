const LaeviLanguageClient = require("../base-client")

class YamlLanguageClient extends LaeviLanguageClient {
  getGrammarScopes() {
    return ["source.yaml"]
  }

  getLanguageName() {
    return "YAML"
  }

  getServerName() {
    return "yaml-language-server"
  }

  startServerProcess(projectPath) {
    return super.spawn("yaml-language-server", ["--stdio"], { cwd: projectPath, env: process.env })
  }
}

module.exports = YamlLanguageClient
