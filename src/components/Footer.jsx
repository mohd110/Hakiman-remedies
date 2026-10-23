import { Link } from 'react-router-dom'
import { brand } from '../data/brand'
import { getCategories } from '../lib/catalog'
import Icon from './Icon'

export default function Footer() {
  const c = brand.contact
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src={brand.logo} alt="Hakiman — Since 1943" className="footer__logo" width="813" height="307" />
          <p>{brand.tagline}</p>
        </div>

        <nav aria-label="Shop">
          <h4>Shop</h4>
          <Link to="/shop">All Products</Link>
          {getCategories().map((cat) => (
            <Link key={cat.id} to={`/shop?category=${cat.id}`}>{cat.label}</Link>
          ))}
        </nav>

        <nav aria-label="Brand">
          <h4>The Hakiman</h4>
          <Link to="/our-story">Our Story</Link>
          <Link to="/ingredients">Explore Ingredients</Link>
          <Link to="/learn">Learn</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/account">My Account</Link>
        </nav>

        <nav aria-label="Support">
          <h4>Customer Care</h4>
          <Link to="/policies/shipping">Shipping Policy</Link>
          <Link to="/policies/refunds">Returns & Refunds</Link>
          <Link to="/policies/privacy">Privacy Policy</Link>
          <Link to="/policies/terms">Terms & Conditions</Link>
        </nav>

        <address className="footer__contact">
          <h4>Visit & Connect</h4>
          <p><Icon name="pin" size={16} /> {c.address}</p>
          <p><Icon name="phone" size={16} /> <a href={c.phoneHref}>{c.phone}</a></p>
          <p><Icon name="mail" size={16} /> <a href={`mailto:${c.email}`}>{c.email}</a></p>
          <p><Icon name="clock" size={16} /> Consultation Hours: {c.hours}</p>
        </address>
      </div>
      <div className="container footer__base">
        <span>© 2026 The Hakiman. All rights reserved.</span>
        <span>Prototype storefront · demo cart &amp; checkout</span>
      </div>
    </footer>
  )
}
