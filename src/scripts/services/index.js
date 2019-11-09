const services = new Map()
services.set($l10n('XIAMI'), require('./xiami'))
services.set($l10n('V2EX'), require('./v2ex'))

module.exports = services
