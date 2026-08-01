function offsetToPoint(text, offset) {
  const before = text.slice(0, offset)
  const lines = before.split("\n")
  return [lines.length - 1, lines[lines.length - 1].length]
}

module.exports = {
  name: "JSON",
  scope: "file",
  lintsOnChange: true,
  grammarScopes: ["source.json"],
  lint(textEditor) {
    const text = textEditor.getText()
    if (text.trim() === "") return []

    try {
      JSON.parse(text)
      return []
    } catch (err) {
      const match = /position (\d+)/.exec(err.message)
      const offset = match ? Number(match[1]) : 0
      const [row, col] = offsetToPoint(text, offset)
      return [
        {
          severity: "error",
          location: {
            file: textEditor.getPath(),
            position: [
              [row, col],
              [row, col + 1],
            ],
          },
          excerpt: err.message,
        },
      ]
    }
  },
}
