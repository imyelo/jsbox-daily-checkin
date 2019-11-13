const services = require('../services/index')

const auto = async () => {
  const results = await services.executeAll()
  $intents.finish(results)
}

module.exports = auto
