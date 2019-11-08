;(async () => {
  if ($app.env === $env.app) {
    require('./entry/ui')
    return
  }
  await require('./entry/auto')()
})()
