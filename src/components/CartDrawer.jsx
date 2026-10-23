import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../lib/cart'
import { formatPrice, shortTitle } from '../lib/catalog'
import Icon from './Icon'
import QtyStepper from './QtyStepper'

export default function CartDrawer() {
  const { items, open, setOpen, subtotal, mrpTotal, count, setQty, remove } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) return
    document.body.classList.add('no-scroll')
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('no-scroll')
      window.removeEventListener('keydown', onKey)
    }
  }, [open, setOpen])

  const savings = mrpTotal - subtotal

  return (
    <>
      <div className={`drawer-scrim ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} />
      <aside
        className={`cart-drawer ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!open}
        inert={!open}
      >
        <header className="cart-drawer__head">
          <h2>
            Your Cart <span>({count})</span>
          </h2>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close cart">
            <Icon name="close" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cart-empty">
            <img src="/assets/fab.png" alt="" width="96" height="96" />
            <p className="cart-empty__title">Your cart is empty</p>
            <p>Browse the collection and add a remedy to begin.</p>
            <Link to="/shop" className="btn btn--primary" onClick={() => setOpen(false)}>
              Explore the Collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart-lines">
              {items.map((i) => (
                <li key={i.variantId} className="cart-line">
                  <Link to={`/products/${i.product.handle}`} onClick={() => setOpen(false)} className="cart-line__img">
                    <img src={i.product.images[0]} alt={i.product.title} />
                  </Link>
                  <div className="cart-line__body">
                    <Link to={`/products/${i.product.handle}`} onClick={() => setOpen(false)} className="cart-line__title">
                      {shortTitle(i.product)}
                    </Link>
                    <div className="cart-line__unit">
                      {formatPrice(i.variant.price)}
                      {i.variant.compareAtPrice && <s>{formatPrice(i.variant.compareAtPrice)}</s>}
                    </div>
                    <div className="cart-line__row">
                      <QtyStepper
                        value={i.qty}
                        max={i.stock}
                        onChange={(q) => setQty(i.variantId, q)}
                        label={i.product.title}
                        allowZero
                      />
                      <button className="link-btn" onClick={() => remove(i.variantId)}>
                        Remove
                      </button>
                    </div>
                    {i.qty >= i.stock && <p className="cart-line__note">Maximum demo stock reached</p>}
                  </div>
                  <div className="cart-line__total">{formatPrice(i.lineTotal)}</div>
                </li>
              ))}
            </ul>

            <footer className="cart-drawer__foot">
              <dl className="cart-totals">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotal)}</dd>
                </div>
                {savings > 0 && (
                  <div className="cart-totals__save">
                    <dt>You save on MRP</dt>
                    <dd>{formatPrice(savings)}</dd>
                  </div>
                )}
              </dl>
              <p className="cart-drawer__fine">Shipping and taxes are calculated at checkout.</p>
              <button
                className="btn btn--primary btn--block"
                onClick={() => {
                  setOpen(false)
                  navigate('/checkout')
                }}
              >
                Checkout · {formatPrice(subtotal)}
              </button>
              <button className="btn btn--ghost btn--block" onClick={() => setOpen(false)}>
                Continue shopping
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}
