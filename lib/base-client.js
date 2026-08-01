const path = require("path")
const { AutoLanguageClient } = require("@savetheclocktower/atom-languageclient")
const status = require("./status")

// Files outside any project folder normally never get an LSP connection -
// fall back to the file's own directory when no project path matches.
class LaeviLanguageClient extends AutoLanguageClient {
  determineProjectPath(textEditor) {
    const projectPath = super.determineProjectPath(textEditor)
    if (projectPath != null) return projectPath
    const filePath = textEditor.getPath()
    if (!filePath) return null
    return path.dirname(filePath)
  }

  getPackageName() {
    return "pulsar-ide-laevi"
  }

  // Marks the status-bar tile the moment this client's server process
  // spawns, regardless of which subclass's startServerProcess calls it.
  spawn(...args) {
    status.markActive(this.getLanguageName())
    return super.spawn(...args)
  }
}

module.exports = LaeviLanguageClient
