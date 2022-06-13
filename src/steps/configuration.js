const log = require('loglevel')
const { loadDataFile } = require('./filehandler')

const defaultConfiguration = {
  destination: {
    directory: 'dist'
  },
  source: {
    directory: 'module',
    authors_directory: 'author',
    content_directories: {}
  }
}

function loadConfiguration () {
  log.info('Loading configuration...')

  let result

  const data = loadDataFile(process.cwd(), '.powerd6')

  if (!data) {
    log.info('No configuration file found, using defaults...')
    result = defaultConfiguration
  } else {
    const jsonData = JSON.parse(data)
    result = {
      ...defaultConfiguration,
      ...jsonData
    }
  }
  log.log('Configuration loaded!')
  log.debug(result)
  return result
}

module.exports = {
  defaultConfiguration,
  loadConfiguration
}
