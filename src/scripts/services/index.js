const pProps = require('p-props')

class Service {
  constructor () {
    this.actions = new Map()
  }

  register (name, action) {
    this.actions.set(name, action)
  }

  async execute (name) {
    return await this.actions.get(name)()
  }

  async executeAll () {
    const messages = await pProps(this.actions, (action) => action())
    return Array.from(messages.entries()).map(([ name, message ]) => {
      return `${$l10n(name)} - ${message}`
    }).join('\n')
  }
}

const service = new Service()
service.register('XIAMI', require('./xiami'))
service.register('V2EX', require('./v2ex'))

module.exports = service
