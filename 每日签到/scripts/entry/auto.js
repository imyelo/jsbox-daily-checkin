const services = require('../services/index')
const Queue = require('../utils/queue')

const auto = async () => {
  const queue = new Queue()
  let results = []
  services.forEach((action, title) => {
    queue.add(async () => {
      results.push(`${title} - ${await action()}`)
    })
  })
  await queue.done()
  results = results.join('\n')
  console.log(results)
  $intents.finish(results)
}

module.exports = auto
