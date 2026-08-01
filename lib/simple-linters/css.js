const postcss = require("postcss")
const postcssLess = require("postcss-less")
const postcssScss = require("postcss-scss")

function syntaxForScope(scopeName) {
  if (scopeName === "source.css.less") return postcssLess
  if (scopeName === "source.css.scss") return postcssScss
  return undefined
}

module.exports = {
  name: "CSS",
  scope: "file",
  lintsOnChange: true,
  grammarScopes: ["source.css", "source.css.scss", "source.css.less"],
  lint(textEditor) {
    const code = textEditor.getText()
    const filePath = textEditor.getPath()
    if (code.trim() === "") return []

    try {
      const syntax = syntaxForScope(textEditor.getGrammar().scopeName)
      const parse = syntax ? syntax.parse : postcss.parse
      parse(code, { from: filePath || undefined })
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
