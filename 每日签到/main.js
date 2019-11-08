;(async () => {
  if ($app.env === $env.app) {
    require('./scripts/entry/ui')
    return
  }
  await require('./scripts/entry/auto')()
})()
