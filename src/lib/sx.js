// Turns a CSS declaration string into a React style object. The product page is
// built from an inline-styled design file; keeping its style strings verbatim
// means the page can be diffed against the design line by line.
const cache = new Map()

export function sx(css) {
  let style = cache.get(css)
  if (style) return style
  style = {}
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const prop = decl.slice(0, i).trim()
    const value = decl.slice(i + 1).trim()
    if (!prop || !value) continue
    style[prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value
  }
  cache.set(css, style)
  return style
}
