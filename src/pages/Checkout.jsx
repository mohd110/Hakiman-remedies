import { Link } from 'react-router-dom'
import { brand } from '../data/brand'
import { useCart } from '../lib/cart'
import { formatPrice, shortTitle } from '../lib/catalog'
import QtyStepper from '../components/QtyStepper'
import Icon from '../components/Icon'

// Prototype checkout. It never collects payment details and never claims an order was placed.
// In production this route is replaced by Shopify's hosted checkout (cart.checkoutUrl).
export default function Checkout() {
  const { items, subtotal, mrpTotal, setQty, remove, count } = useCart()
  const c = brand.contact

  const whatsappText = [
    'Hello Hakiman Remedies, I would like to order:',
    ...items.map((i) => `• ${i.product.title} × ${i.qty} — ${formatPrice(i.lineTotal)}`),
    `Subtotal: ${formatPrice(subtotal)}`,
  ].join('\n')

  if (!items.length) {
    return (
      <div className="page container checkout-empty">
        <h1>Your cart is empty</h1>
        <p>Add a remedy to your cart to continue.</p>
        <Link to="/shop" className="btn btn--primary">Explore the Collection</Link>
      </div>
    )
  }

  return (
    <div className="page container checkout">
      <div className="demo-banner" role="note">
        <strong>Demo checkout.</strong> This prototype is not connected to a payment provider. No payment details are collected and no order is placed here.
      </div>

      <div className="checkout__grid">
        <section className="checkout__summary" aria-labelledby="sum-title">
          <h1 id="sum-title">Order summary <span>({count} {count === 1 ? 'item' : 'items'})</span></h1>
          <ul className="cart-lines">
            {items.map((i) => (
              <li key={i.variantId} className="cart-line">
                <Link to={`/products/${i.product.handle}`} className="cart-line__img">
                  <img src={i.product.images[0]} alt={i.product.title} />
                </Link>
                <div className="cart-line__body">
                  <Link to={`/products/${i.product.handle}`} className="cart-line__title">{shortTitle(i.product)}</Link>
                  <div className="cart-line__unit">{formatPrice(i.variant.price)} each</div>
                  <div className="cart-line__row">
                    <QtyStepper value={i.qty} max={i.stock} onChange={(q) => setQty(i.variantId, q)} label={i.product.title} allowZero />
                    <button className="link-btn" onClick={() => remove(i.variantId)}>Remove</button>
                  </div>
                </div>
                <div className="cart-line__total">{formatPrice(i.lineTotal)}</div>
              </li>
            ))}
          </ul>
          <dl className="cart-totals">
            <div><dt>MRP total</dt><dd>{formatPrice(mrpTotal)}</dd></div>
            <div className="cart-totals__save"><dt>Discount</dt><dd>− {formatPrice(mrpTotal - subtotal)}</dd></div>
            <div className="cart-totals__grand"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
          </dl>
          <p className="fine">Shipping and taxes are calculated by the live checkout. Shipping is available within India only.</p>
        </section>

        <aside className="checkout__next">
          <h2>How to complete this order</h2>
          <div className="checkout__option">
            <h3>Secure online checkout</h3>
            <p>Once the store is connected to Shopify, this button sends you straight to the hosted checkout for contact details, shipping address and payment.</p>
            <button className="btn btn--primary btn--block" disabled aria-describedby="shopify-note">
              Continue to secure checkout
            </button>
            <p id="shopify-note" className="fine">Not available in this prototype — requires Shopify connection.</p>
          </div>
          <div className="checkout__option">
            <h3>Order by WhatsApp</h3>
            <p>Send this cart to Hakiman Remedies on WhatsApp ({c.phone}). Opens WhatsApp with the message prefilled; nothing is sent until you press send.</p>
            <a
              className="btn btn--outline btn--block"
              href={`https://wa.me/${c.whatsapp}?text=${encodeURIComponent(whatsappText)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="phone" size={18} /> Send order on WhatsApp
            </a>
          </div>
          <Link to="/shop" className="link-btn">← Continue shopping</Link>
        </aside>
      </div>
    </div>
  )
}
