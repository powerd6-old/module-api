const log = require('loglevel')

const configuration = require('./steps/configuration')
const { loadModule } = require('./steps/content')
const { saveModule } = require('./steps/filehandler')

function buildModule () {
  log.setDefaultLevel('INFO')

  const { source, destination } = configuration.loadConfiguration()
  const module = loadModule(source)
  log.debug(module)
  log.info('Loading complete.')

  saveModule(module, destination)

  log.info('Completed!')
}

module.exports = {
  buildModule
}
