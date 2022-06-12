const fs = require('fs')
const log = require('loglevel')
const YAML = require('yaml')

const readFileOptions = {
  encoding: 'utf8',
  flag: 'r'
}

function loadDataFile (directory, filename, extensions = ['json', 'yaml']) {
  log.debug(
    `Trying to get file ${directory}/${filename}.(${extensions.join('|')})`
  )

  let result

  const existingExtension = extensions.find((extension) =>
    fs.existsSync(`${directory}/${filename}.${extension}`)
  )

  if (existingExtension) {
    const existingFile = `${directory}/${filename}.${existingExtension}`
    log.debug(`Found file: "${existingFile}"`)

    switch (existingExtension) {
      case 'json':
        result = fs.readFileSync(existingFile, readFileOptions)
        break

      case 'yml':
      case 'yaml':
        result = YAML.parse(fs.readFileSync(existingFile, readFileOptions))
        break

      default:
        log.error(`Extension ${existingExtension} is not supported!`)
        break
    }
  }
  return result
}

function saveModule (module, destination) {
  const fileContents = JSON.stringify(module)

  const destinationDirectory = `${process.cwd()}/${destination.directory}`
  if (!fs.existsSync(destinationDirectory)) {
    fs.mkdirSync(destinationDirectory)
  }

  fs.writeFileSync(`${destinationDirectory}/module.json`, fileContents)
}

module.exports = {
  loadDataFile,
  saveModule
}
