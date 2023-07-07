import fragment from './fragment'

const seed = Object.freeze([])

function normalize(child) {
  return child ?? false
}

let errors = {}

/**
 * 
 * @param {any} type Type of the node
 * @param {{__source: {
 *  fileName: string,
 *  lineNumber: number,
 *  columnNumber: number,
 * }}} props 
 * @param  {...any} children 
 * @returns 
 */
export default function element(type, props, ...children) {
  if (type === undefined) {
    const isProd = !window.document
    if (isProd) {
      throw new Error(`
 🚨 An undefined node exist on your application!
 🚨 Access this route on development mode to get the location!`)
    }
    const { fileName, lineNumber, columnNumber } = props.__source
    const msgError = `Undefined node at ${fileName}:${lineNumber}:${columnNumber}`
    if (!errors[msgError]) {
      errors[msgError] = 0
    }
    ++errors[msgError]
    if (errors[msgError] > 2) {
      console.error(msgError)
    }
    return {
      type: 'p',
      attributes: {
        style: 'background:#171717; color:#f44336; padding:10px;',
      },
      children: msgError
    }
  }
  children = seed.concat(...children).map(normalize)
  if (type === 'textarea') {
    children = [children.join('')]
  }
  const attributes = { ...props, children }
  if (type === 'style' && !attributes.html) {
    attributes.html = children.join('')
  }
  if (type === 'element') {
    type = attributes.tag || fragment
    delete attributes.tag
  }
  if (typeof type === 'function' && type.render !== undefined) {
    return { type, attributes, children: null }
  }
  return { type, attributes, children }
}
