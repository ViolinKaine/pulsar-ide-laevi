const LaeviLanguageClient = require("../base-client")

class PythonLanguageClient extends LaeviLanguageClient {
  getGrammarScopes() {
    return ["source.python"]
  }

  getLanguageName() {
    return "Python"
  }

  getServerName() {
    return "pylsp"
  }

  startServerProcess(projectPath) {
    return super.spawn("python3", ["-m", "pylsp"], { cwd: projectPath, env: process.env })
  }
}

module.exports = PythonLanguageClient
