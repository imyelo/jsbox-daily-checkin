const load = (path) => require(`../views/${path}`)()

const router = {
  render (path) {
    $ui.render(load(path))
  },
  push (path) {
    $ui.push(load(path))
  },
}

module.exports = router
