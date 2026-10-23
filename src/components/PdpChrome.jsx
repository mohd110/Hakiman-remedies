import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { brand } from '../data/brand'
import { PDP_LOGO } from '../data/pdp'
import { useCart } from '../lib/cart'
import { sx } from '../lib/sx'
import Icon from './Icon'
import SearchOverlay from './SearchOverlay'

// Announcement bar, header and footer from the product-page design. Product pages
// render these instead of the site-wide Header/Footer (see App.jsx).

const NAV = [
  { to: '/shop', label: 'Shop all' },
  { to: '/shop?category=Powder', label: 'Pain & joint care' },
  { to: '/our-story', label: 'Our heritage' },
  { to: '/learn', label: 'Journal' },
]

const MENU = [
  { to: '/shop', label: 'Shop' },
  { to: '/our-story', label: 'Our Story' },
  { to: '/ingredients', label: 'Explore Ingredients' },
  { to: '/learn', label: 'Learn' },
  { to: '/contact', label: 'Contact' },
]

const iconBtn = 'width: 44px; height: 44px; border: 0; background: transparent; color: #2B1A11; display: grid; place-items: center; cursor: pointer'

const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
)
const AccountIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
)
const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2z" /><path d="M9 8V6a3 3 0 016 0v2" /></svg>
)

export function PdpHeader({ m, announce, announceMobile }) {
  const { count, setOpen } = useCart()
  const [searchOpen, setSearchOpen] = useState(false)

  if (m) {
    return (
      <>
        <div style={sx('background: #3B2417; color: #FBEBD8; font-size: 12px; font-weight: 700; text-align: center; padding: 9px 12px')}>{announceMobile}</div>
        <header style={sx('display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; border-bottom: 1px solid #EAD6C0')}>
          <MobileMenu />
          <Link to="/" aria-label="The Hakiman — home" style={sx('display: block')}>
            <img src={PDP_LOGO} alt="Hakiman" style={sx('height: 42px; width: auto; display: block')} />
          </Link>
          <button aria-label={`Cart, ${count} items`} onClick={() => setOpen(true)} style={sx(iconBtn)}><CartIcon /></button>
        </header>
      </>
    )
  }

  return (
    <>
      <div style={sx('background: #3B2417; color: #FBEBD8; font-size: 13px; font-weight: 600; letter-spacing: 0.02em; padding: 10px 16px; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 28px; text-align: center')}>
        {announce.map((a, i) => <span key={a} style={i === 1 ? sx('color: #F5B98C') : undefined}>{a}</span>)}
      </div>
      <header style={sx('background: #FBF5EC; border-bottom: 1px solid #EAD6C0')}>
        <div style={sx('max-width: 1280px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap')}>
          <div style={sx('display: flex; align-items: center; gap: 36px; flex-wrap: wrap')}>
            <Link to="/" style={sx('display: flex; align-items: center; gap: 10px; text-decoration: none; color: #2B1A11')}>
              <img src={PDP_LOGO} alt="Hakiman, since 1943" style={sx('height: 56px; width: auto; display: block')} />
            </Link>
            <nav aria-label="Main" style={sx('display: flex; gap: 24px; font-size: 15px; font-weight: 600; flex-wrap: wrap')}>
              {NAV.map((n) => (
                <Link key={n.label} to={n.to} style={sx('text-decoration: none; color: #2B1A11')}>{n.label}</Link>
              ))}
            </nav>
          </div>
          <div style={sx('display: flex; align-items: center; gap: 6px')}>
            <button aria-label="Search" onClick={() => setSearchOpen(true)} style={sx(iconBtn)}><SearchIcon /></button>
            <Link to="/account" aria-label="Account" style={sx(iconBtn)}><AccountIcon /></Link>
            <button aria-label={`Cart, ${count} items`} onClick={() => setOpen(true)} style={sx(iconBtn)}><CartIcon /></button>
          </div>
        </div>
      </header>
      {/* Portalled out of .hk-pdp so the overlay keeps the site styles */}
      {createPortal(<SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />, document.body)}
    </>
  )
}

// Same drawer as the site header, so the mobile menu behaves identically on every page.
function MobileMenu() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.classList.toggle('no-scroll', open)
    return () => document.body.classList.remove('no-scroll')
  }, [open])

  return (
    <>
      <button aria-label="Menu" onClick={() => setOpen(true)} style={sx(iconBtn)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      {createPortal(<>
        <div className={`drawer-scrim ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} />
        <aside className={`mobile-nav ${open ? 'is-open' : ''}`} aria-label="Menu" aria-hidden={!open} inert={!open}>
          <div className="mobile-nav__head">
            <img src={brand.logo} alt="Hakiman — Since 1943" className="mobile-nav__logo" />
            <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu">
              <Icon name="close" />
            </button>
          </div>
          <Link to="/shop" className="btn btn--primary btn--block">Shop the Collection</Link>
          <nav className="mobile-nav__links">
            {MENU.map((n) => (
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
      </>, document.body)}
    </>
  )
}

export function PdpFooter({ m }) {
  return (
    <footer style={sx('background: #2B1A11; color: #E9D2B8')}>
      <div style={sx(`max-width: 1280px; margin: 0 auto; padding: ${m ? '40px 16px 112px' : '48px 24px 120px'}; display: flex; flex-wrap: wrap; gap: 32px; justify-content: space-between; font-size: 14px; line-height: 1.7`)}>
        <div style={sx('max-width: 360px')}><div style={sx("font-family: 'Marcellus', Georgia, serif; font-size: 24px; color: #FBEBD8")}>Hakiman</div><div>Unani &amp; Ayurvedic wellness, crafted with generations of healing wisdom.</div></div>
        <div><div style={sx('font-weight: 800; color: #FBEBD8')}>Visit</div><div>Shop No 2 UGF, Aishbagh Rd<br />Lucknow 226003</div></div>
        <div><div style={sx('font-weight: 800; color: #FBEBD8')}>Talk to us</div><div>+91 88811 16681 (call / WhatsApp)<br />hakimanremedies@gmail.com</div></div>
      </div>
    </footer>
  )
}
