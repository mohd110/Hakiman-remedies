import { useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCategories, getProducts, searchProducts } from '../lib/catalog'
import { useReveal } from '../lib/motion'
import ProductCard from '../components/ProductCard'
import Icon from '../components/Icon'

const SORTS = {
  featured: { label: 'Featured', fn: () => 0 },
  'price-asc': { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  'discount': { label: 'Biggest saving', fn: (a, b) => (b.compareAtPrice - b.price) - (a.compareAtPrice - a.price) },
  name: { label: 'Name A–Z', fn: (a, b) => a.title.localeCompare(b.title) },
}

export default function Shop() {
  const root = useRef(null)
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || 'all'
  const sort = SORTS[params.get('sort')] ? params.get('sort') : 'featured'
  const q = params.get('q') || ''
  const categories = getCategories()

  const list = useMemo(() => {
    let items = q ? searchProducts(q) : getProducts()
    if (category !== 'all') items = items.filter((p) => p.category === category)
    return [...items].sort(SORTS[sort].fn)
  }, [q, category, sort])

  const update = (key, value) => {
    const next = new URLSearchParams(params)
    if (!value || value === 'all' || (key === 'sort' && value === 'featured')) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  useReveal(root, [category, sort, q])

  return (
    <div ref={root} className="page">
      <section className="page-hero page-hero--compact">
        <div className="container">
          <p className="eyebrow">The Collection</p>
          <h1>Shop all remedies</h1>
          <p className="page-hero__lede">Herbal soaps, Ayurvedic syrups and capsules, and a mineral bath salt — every product as listed by The Hakiman.</p>
        </div>
      </section>

      <section className="container shop">
        <div className="shop__bar">
          <div className="chips" role="tablist" aria-label="Filter by category">
            <button role="tab" aria-selected={category === 'all'} className="chip" onClick={() => update('category', 'all')}>
              All
            </button>
            {categories.map((c) => (
              <button key={c.id} role="tab" aria-selected={category === c.id} className="chip" onClick={() => update('category', c.id)}>
                {c.label} <span>{c.count}</span>
              </button>
            ))}
          </div>
          <div className="shop__tools">
            <label className="field field--search">
              <Icon name="search" size={18} />
              <input
                type="search"
                value={q}
                onChange={(e) => update('q', e.target.value)}
                placeholder="Search the collection"
                aria-label="Search the collection"
              />
            </label>
            <label className="field field--select">
              <span className="sr-only">Sort by</span>
              <select value={sort} onChange={(e) => update('sort', e.target.value)}>
                {Object.entries(SORTS).map(([k, s]) => (
                  <option key={k} value={k}>{s.label}</option>
                ))}
              </select>
              <Icon name="chevron" size={16} />
            </label>
          </div>
        </div>

        <p className="shop__count" aria-live="polite">
          {list.length} {list.length === 1 ? 'product' : 'products'}
          {q && <> for “{q}”</>}
        </p>

        {list.length ? (
          <div className="product-grid">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Nothing matches yet</h2>
            <p>Try a different word, or clear your filters to see the full collection.</p>
            <button className="btn btn--outline" onClick={() => setParams({}, { replace: true })}>Clear filters</button>
          </div>
        )}
      </section>
    </div>
  )
}
