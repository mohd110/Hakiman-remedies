import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatPrice, searchProducts, CATEGORY_INFO } from '../lib/catalog'
import Icon from './Icon'

const SUGGESTIONS = ['Soap', 'Neem', 'Syrup', 'Capsules', 'Pashoya']

export default function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('')
  const input = useRef(null)
  const navigate = useNavigate()
  const results = searchProducts(q)

  useEffect(() => {
    if (!open) return
    setQ('')
    const t = setTimeout(() => input.current?.focus(), 50)
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.classList.add('no-scroll')
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('no-scroll')
    }
  }, [open, onClose])

  const submit = (e) => {
    e.preventDefault()
    if (!q.trim()) return
    onClose()
    navigate(`/shop?q=${encodeURIComponent(q.trim())}`)
  }

  if (!open) return null

  return (
    <div className="search" role="dialog" aria-modal="true" aria-label="Search products">
      <div className="search__panel">
        <form className="search__form" onSubmit={submit} role="search">
          <Icon name="search" size={24} />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search remedies, soaps, ingredients…"
            aria-label="Search"
          />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search">
            <Icon name="close" />
          </button>
        </form>

        {!q && (
          <div className="search__suggest">
            <span className="eyebrow">Try</span>
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chip" onClick={() => setQ(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {q && (
          <ul className="search__results" aria-live="polite">
            {results.length === 0 && <li className="search__empty">No products match “{q}”.</li>}
            {results.map((p) => (
              <li key={p.id}>
                <Link to={`/products/${p.handle}`} onClick={onClose} className="search__hit">
                  <img src={p.images[0]} alt="" loading="lazy" />
                  <span>
                    <strong>{p.title}</strong>
                    <small>{CATEGORY_INFO[p.category]?.label}</small>
                  </span>
                  <span className="search__price">{formatPrice(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="search__scrim" onClick={onClose} aria-label="Close search" tabIndex={-1} />
    </div>
  )
}
