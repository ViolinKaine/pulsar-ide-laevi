const LaeviLanguageClient = require("../base-client")

class TypeScriptLanguageClient extends LaeviLanguageClient {
  getGrammarScopes() {
    return ["source.js", "source.jsx", "source.ts", "source.tsx"]
  }

  getLanguageName() {
    return "TypeScript/JavaScript"
  }

  getServerName() {
    return "typescript-language-server"
  }

  startServerProcess(projectPath) {
    return super.spawn("typescript-language-server", ["--stdio"], { cwd: projectPath, env: process.env })
  }
}

module.exports = TypeScriptLanguageClient
