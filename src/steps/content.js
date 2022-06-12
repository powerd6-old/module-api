const fs = require('fs')
const log = require('loglevel')
const { loadDataFile } = require('./filehandler')

function getModuleBase (baseDirectory) {
  log.info('Loading base module...')

  const moduleData = loadDataFile(
    `${process.cwd()}/${baseDirectory}`,
    'module'
  )

  return moduleData
}

function loadAuthors (baseDirectory, authorsDirectory) {
  log.info('Loading module authors...')

  const authors = fs
    .readdirSync(`${process.cwd()}/${baseDirectory}/${authorsDirectory}`)
    .map((filename) => filename.split('.').slice(0, -1).join('.'))
    .map((filename) =>
      loadDataFile(
        `${process.cwd()}/${baseDirectory}/${authorsDirectory}`,
        filename
      )
    )

  return authors
}

function loadModuleContents (models, baseDirectory, contentDirectories) {
  log.info('Loading content...')

  const result = {}

  const contentTypes = Object.keys(models)

  contentTypes
    .filter((type) =>
      fs.existsSync(
        `${process.cwd()}/${baseDirectory}/${contentDirectories[type]}`
      )
    )
    .forEach((type) => {
      log.info(`Loading "${type}"`)
      const data = fs
        .readdirSync(
          `${process.cwd()}/${baseDirectory}/${contentDirectories[type]}`
        )
        .map((filename) => filename.split('.').slice(0, -1).join('.'))
        .map((filename) =>
          loadDataFile(
            `${process.cwd()}/${baseDirectory}/${contentDirectories[type]}`,
            filename
          )
        )
      result[type] = data
    })

  return result
}

function loadModule (source) {
  log.info('Building module...')

  const module = getModuleBase(source.directory)
  log.debug(module)

  module.authors = [
    ...module.authors,
    ...loadAuthors(source.directory, source.authors_directory)
  ]

  module.content = {
    ...module.content,
    ...loadModuleContents(
      module.models,
      source.directory,
      source.content_directories
    )
  }

  return module
}

module.exports = {
  loadModule
}
