import fragment from './fragment'
import runtimeError from './runtimeError'

const seed = Object.freeze([])

function normalize(child) {
  return child ?? false
}

/**
 * @param {any} type Type of the node
 * @param {{__source: {
 *  fileName: string,
 *  lineNumber: number,
 *  columnNumber: number,
 * }}} props 
 * @param  {...any} children 
 */
export default function element(type, props, ...children) {
  if (type === undefined) {
    return runtimeError.add(props?.__source)
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
