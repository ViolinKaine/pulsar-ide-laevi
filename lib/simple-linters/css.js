const postcssLess = require("postcss-less")
const postcssScss = require("postcss-scss")

// Biome handles plain CSS (see clients/biome.js) - it doesn't understand
// Less/Scss dialects, so those stay on postcss here.
function syntaxForScope(scopeName) {
  if (scopeName === "source.css.less") return postcssLess
  return postcssScss
}

module.exports = {
  name: "Less/Scss",
  scope: "file",
  lintsOnChange: true,
  grammarScopes: ["source.css.scss", "source.css.less"],
  lint(textEditor) {
    const code = textEditor.getText()
    const filePath = textEditor.getPath()
    if (code.trim() === "") return []

    try {
      const syntax = syntaxForScope(textEditor.getGrammar().scopeName)
      syntax.parse(code, { from: filePath || undefined })
      return []
    } catch (err) {
      const line = err.line || 1
      const column = err.column || 1
      return [
        {
          severity: "error",
          location: {
            file: filePath,
            position: [
              [line - 1, column - 1],
              [line - 1, column],
            ],
          },
          excerpt: err.reason || err.message,
        },
      ]
    }
  },
}
