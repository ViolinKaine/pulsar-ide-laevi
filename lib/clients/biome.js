const LaeviLanguageClient = require("../base-client")

class BiomeLanguageClient extends LaeviLanguageClient {
  getGrammarScopes() {
    return ["source.json", "source.css"]
  }

  getLanguageName() {
    return "CSS/JSON (Biome)"
  }

  getServerName() {
    return "biome"
  }

  startServerProcess(projectPath) {
    const biomeBin = require.resolve("@biomejs/biome/bin/biome")
    return super.spawn("node", [biomeBin, "lsp-proxy"], { cwd: projectPath, env: process.env })
  }
}

module.exports = BiomeLanguageClient
