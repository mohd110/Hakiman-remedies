import { Link } from 'react-router-dom'
import demo from '../data/demo/orders.json'
import { formatPrice, getProductById, shortTitle } from '../lib/catalog'

const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export default function Account() {
  const orders = demo.orders.map((o) => {
    const lines = o.lines.map((l) => {
      const product = getProductById(l.productId)
      return { ...l, product, total: product.price * l.qty }
    })
    return { ...o, lines, total: lines.reduce((n, l) => n + l.total, 0) }
  })

  return (
    <div className="page container account">
      <div className="demo-banner" role="note">
        <strong>Demo account.</strong> Sign-in requires a Shopify customer account connection. The orders below are sample data for testing the order-history layout — they are not real customers or real orders.
      </div>
      <h1>Order history</h1>
      <ul className="orders">
        {orders.map((o) => (
          <li key={o.id} className="order">
            <header className="order__head">
              <div>
                <strong>{o.id}</strong> <span className="demo-tag">demo</span>
                <small>{dateFmt.format(new Date(o.placedAt))}</small>
              </div>
              <span className={`status status--${o.status.toLowerCase()}`}>{o.status}</span>
            </header>
            <ul className="order__lines">
              {o.lines.map((l) => (
                <li key={l.productId}>
                  <img src={l.product.images[0]} alt="" loading="lazy" />
                  <Link to={`/products/${l.product.handle}`}>{shortTitle(l.product)}</Link>
                  <span>× {l.qty}</span>
                  <span>{formatPrice(l.total)}</span>
                </li>
              ))}
            </ul>
            <footer className="order__foot">Total (excl. shipping) <strong>{formatPrice(o.total)}</strong></footer>
          </li>
        ))}
      </ul>
    </div>
  )
}
