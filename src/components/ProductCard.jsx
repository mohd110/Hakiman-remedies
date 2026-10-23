import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../lib/cart'
import { CATEGORY_INFO, discount, formatPrice, summary } from '../lib/catalog'
import Icon from './Icon'

export default function ProductCard({ product, variant = 'default' }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const d = discount(product)
  const href = `/products/${product.handle}`

  const quickAdd = () => {
    add(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <article className={`card card--${variant}`}>
      <Link to={href} className="card__media" aria-label={product.title}>
        <img src={product.images[0]} alt={product.title} loading="lazy" decoding="async" />
        {product.images[1] && <img className="card__alt" src={product.images[1]} alt="" loading="lazy" decoding="async" />}
        <span className="card__badges">
          {d && <span className="badge">{d.percent}% off</span>}
          {product.badge && <span className="badge badge--gold">{product.badge}</span>}
        </span>
      </Link>
      <div className="card__body">
        <span className="card__cat">{CATEGORY_INFO[product.category]?.label}</span>
        <h3 className="card__title">
          <Link to={href}>{product.title}</Link>
        </h3>
        <p className="card__summary">{summary(product)}</p>
        <div className="card__foot">
          <div className="price">
            <span className="price__now">{formatPrice(product.price)}</span>
            {product.compareAtPrice && <s className="price__was">{formatPrice(product.compareAtPrice)}</s>}
          </div>
          <button className={`btn btn--small ${added ? 'btn--done' : 'btn--outline'}`} onClick={quickAdd} aria-label={`Quick add ${product.title} to cart`}>
            {added ? <><Icon name="check" size={16} /> Added</> : <><Icon name="plus" size={16} /> Quick Add</>}
          </button>
        </div>
        <Link to={href} className="card__more">
          View details <Icon name="arrow" size={14} />
        </Link>
      </div>
    </article>
  )
}
