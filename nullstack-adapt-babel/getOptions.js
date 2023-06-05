// @ts-check
const path = require('path')
const { existsSync } = require('fs')

function getOptions(target, options) {
  const disk = !!options.disk
  const environment = options.environment
  const entry = existsSync(path.posix.join(process.cwd(), `${target}.ts`))
    ? `./${target}.ts`
    : `./${target}.js`
  const projectFolder = process.cwd()
  const configFolder = __dirname
  const buildFolder = '.' + environment
  const cache = !options.skipCache
  const name = options.name || ''
  const trace = !!options.trace
  return {
    target,
    disk,
    buildFolder,
    entry,
    environment,
    cache,
    name,
    trace,
    projectFolder,
    configFolder
  }
}

module.exports = function (...args) {
  const options = getOptions(...args)
  options.configFolder = path.dirname('nullstack/webpack.config.js')
  return options
}
