import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { brand } from '../data/brand'
import { useCart } from '../lib/cart'
import Icon from './Icon'
import SearchOverlay from './SearchOverlay'

const NAV = [
  { to: '/shop', label: 'Shop' },
  { to: '/our-story', label: 'Our Story' },
  { to: '/ingredients', label: 'Explore Ingredients' },
  { to: '/learn', label: 'Learn' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const { count, setOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [bump, setBump] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!count) return
    setBump(true)
    const t = setTimeout(() => setBump(false), 450)
    return () => clearTimeout(t)
  }, [count])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen)
  }, [menuOpen])

  return (
    <>
      <div className="announce" role="note">
        <span>Shipping across India</span>
        <span aria-hidden="true" className="announce__dot">✦</span>
        <span>Dispatched in 2–3 business days</span>
        <span aria-hidden="true" className="announce__dot hide-sm">✦</span>
        <span className="hide-sm">Consultations Sat – Sun, 9 AM – 2 PM</span>
      </div>

      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="site-header__inner">
          <button className="icon-btn show-md" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Icon name="menu" size={22} />
          </button>

          <Link to="/" className="site-header__logo" aria-label="The Hakiman — home">
            <img src={brand.logo} alt="Hakiman — Since 1943" width="813" height="307" />
          </Link>

          <nav className="site-nav hide-md" aria-label="Primary">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className="site-nav__link">
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header__actions">
            <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search products">
              <Icon name="search" />
            </button>
            <Link to="/account" className="icon-btn hide-sm" aria-label="Account">
              <Icon name="user" />
            </Link>
            <button className="icon-btn cart-btn" onClick={() => setOpen(true)} aria-label={`Open cart, ${count} items`}>
              <Icon name="bag" />
              <span className={`cart-btn__count ${bump ? 'is-bump' : ''}`} aria-hidden="true">
                {count}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer-scrim ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(false)} />
      <aside className={`mobile-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Menu" aria-hidden={!menuOpen} inert={!menuOpen}>
        <div className="mobile-nav__head">
          <img src={brand.logo} alt="Hakiman — Since 1943" className="mobile-nav__logo" />
          <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <Icon name="close" />
          </button>
        </div>
        <Link to="/shop" className="btn btn--primary btn--block">Shop the Collection</Link>
        <nav className="mobile-nav__links">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to}>
              {n.label}
              <Icon name="arrow" size={18} />
            </NavLink>
          ))}
          <NavLink to="/account">
            Account
            <Icon name="arrow" size={18} />
          </NavLink>
        </nav>
        <div className="mobile-nav__contact">
          <a href={brand.contact.phoneHref}>{brand.contact.phone}</a>
          <a href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a>
        </div>
      </aside>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
