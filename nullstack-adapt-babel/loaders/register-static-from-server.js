// @ts-check
const parse = require('@babel/parser').parse
const traverse = require('@babel/traverse').default
const crypto = require('crypto')
const path = require('path')

function newHash(name) {
  return crypto.createHash('md5').update(name).digest('hex')
}

module.exports = function (source) {
  let hasClass = false
  const id = this.resourcePath.replace(this.rootContext, '')
  let klassName
  const methodNames = []
  let hashes = {}
  let imports = []
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx', 'typescript']
  })
  traverse(ast, {
    ImportDeclaration(path) {
      imports.push(path.node.source.extra.rawValue)
    },
    ClassDeclaration(path) {
      hasClass = true
      klassName = path.node.id.name
    },
    ClassMethod(path) {
      if (
        path.node.static &&
        path.node.async &&
        !path.node.key.name.startsWith('_')
      ) {
        methodNames.push(path.node.key.name)
        hashes[path.node.key.name] = newHash(path.node.key.name)
      }
    }
  })
  if (!hasClass) return source
  const klassHash = id
    .replace(path.sep, '')
    .split(path.sep)
    .join('__')
    .replace(/\.(njs|nts|jsx|tsx)$/, `___${klassName}`)

  const runtime_accept = `
$runtime.accept(
  module,
  '${id.split(path.sep).join('/')}',
  ${JSON.stringify(imports)},
  [
    {
      klass: ${klassName},
      initiate: [],
      hashes: ${JSON.stringify(hashes)}
    }
  ]
);`

  let newSource = `${source}
${klassName}.hash = "${klassHash}";
if (module.hot) {
  ${runtime_accept}
}
${methodNames
  .map(
    fn => `
$runtime.register(${klassName}, "${fn}");`
  )
  .join('\n')}
$runtime.register(${klassName});`

  return newSource
}
