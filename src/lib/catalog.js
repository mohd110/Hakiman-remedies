// Catalog data layer. The UI only talks to these functions, so the local JSON
// snapshot can later be swapped for Shopify Storefront API calls without touching components.
import products from '../data/products.json'
import inventory from '../data/demo/inventory.json'

// Display order follows the source homepage "Our Complete Range" grid.
const SOURCE_ORDER = ['hk-24', 'hk-23', 'hk-22', 'hk-21', 'hk-13', 'hk-12', 'hk-11', 'hk-10']

const catalog = [...products].sort((a, b) => SOURCE_ORDER.indexOf(a.id) - SOURCE_ORDER.indexOf(b.id))

// Category descriptors describe the product format only — no health claims.
export const CATEGORY_INFO = {
  Soap: { label: 'Hand Made Soaps', blurb: 'Herbal soaps for everyday bathing.' },
  Syrup: { label: 'Syrups', blurb: 'Ayurvedic herbal formulations in syrup form.' },
  Tablet: { label: 'Capsules', blurb: 'Ayurvedic formulations, 30 capsules per pack.' },
  Powder: { label: 'Bath Salt', blurb: 'A mineral bath and foot soak blend.' },
}

export function getProducts() {
  return catalog
}

export function getProduct(handle) {
  return catalog.find((p) => p.handle === handle) || null
}

export function getProductById(id) {
  return catalog.find((p) => p.id === id) || null
}

export function getCategories() {
  const counts = {}
  for (const p of catalog) counts[p.category] = (counts[p.category] || 0) + 1
  return Object.keys(CATEGORY_INFO)
    .filter((c) => counts[c])
    .map((c) => ({ id: c, count: counts[c], ...CATEGORY_INFO[c], cover: catalog.find((p) => p.category === c).images[0] }))
}

export function getRelated(product, limit = 4) {
  const same = catalog.filter((p) => p.id !== product.id && p.category === product.category)
  const rest = catalog.filter((p) => p.id !== product.id && p.category !== product.category)
  return [...same, ...rest].slice(0, limit)
}

export function searchProducts(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return catalog.filter((p) =>
    [p.title, p.category, CATEGORY_INFO[p.category]?.label, p.ingredients, ...p.features, ...p.description]
      .filter(Boolean)
      .some((s) => s.toLowerCase().includes(q)),
  )
}

// Demo-only stock, kept apart from the real catalog fields.
export function getDemoStock(id) {
  return inventory.stock[id] ?? 0
}

export function shortTitle(p) {
  // Source cards use the full title; for the long PASHOYA title keep the part before the dash for tight UI.
  return p.title.split(' – ')[0]
}

export function summary(p) {
  return p.description[0]?.split('. ')[0].replace(/\.$/, '') + '.'
}

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
export const formatPrice = (n) => inr.format(n)

export function discount(p) {
  if (!p.compareAtPrice || p.compareAtPrice <= p.price) return null
  return {
    percent: Math.round((1 - p.price / p.compareAtPrice) * 100),
    save: p.compareAtPrice - p.price,
  }
}
