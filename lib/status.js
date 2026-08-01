let tile = null
let item = null
const active = new Set()

function render() {
  if (!item) return
  item.textContent = active.size > 0 ? `LSP: ${[...active].sort().join(", ")}` : "LSP: none"
}

module.exports = {
  activate(statusBarService) {
    item = document.createElement("div")
    item.classList.add("inline-block")
    tile = statusBarService.addRightTile({ item, priority: 100 })
    render()
  },
  markActive(name) {
    active.add(name)
    render()
  },
  deactivate() {
    if (tile) tile.destroy()
    tile = null
    item = null
    active.clear()
  },
}
