const LaeviLanguageClient = require("../base-client")

class BashLanguageClient extends LaeviLanguageClient {
  getGrammarScopes() {
    return ["source.shell"]
  }

  getLanguageName() {
    return "Shell Script"
  }

  getServerName() {
    return "bash-language-server"
  }

  startServerProcess(projectPath) {
    return super.spawn("bash-language-server", ["start"], { cwd: projectPath, env: process.env })
  }
}

module.exports = BashLanguageClient
