import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CATEGORY_INFO, discount, formatPrice, getProduct, getProductById, getRelated, shortTitle, summary } from '../lib/catalog'
import { useCart } from '../lib/cart'
import { sx } from '../lib/sx'
import { PDP_MOBILE, useMediaQuery } from '../lib/useMediaQuery'
import { PASHOYA_ID, pashoya, shippingAccordion, storeFaqs } from '../data/pdp'
import { brand } from '../data/brand'
import { PdpFooter, PdpHeader } from '../components/PdpChrome'
import NotFound from './NotFound'
import '../styles/pdp.css'

// Product page, built from the PASHOYA design (desktop 1440 + mobile 390 artboards).
// PASHOYA gets the full design; every other product renders the same template
// from its own catalog fields, leaving out sections it has no content for.

const CTA = '#B9470C'
const MARCELLUS = "font-family: 'Marcellus', Georgia, serif; font-weight: 400"

/* ───────── Model ───────── */

function buildPage(product) {
  const d = discount(product)
  const price = formatPrice(product.price)
  const base = {
    price,
    mrp: product.compareAtPrice ? formatPrice(product.compareAtPrice) : null,
    save: d ? `Save ${formatPrice(d.save)}` : null,
    off: d ? `${d.percent}% OFF` : null,
  }

  if (product.id === PASHOYA_ID) {
    return {
      ...pashoya,
      ...base,
      featured: true,
      badge: 'Bestseller',
      crumbTo: '/shop?category=Powder',
      sizeNote: `${pashoya.size} · Inclusive of all taxes`,
      trust: [{ icon: 'lab', label: pashoya.trust[0] }, { icon: 'shield', label: pashoya.trust[1] }, { icon: 'truck', label: pashoya.trust[2] }],
      accordions: [...pashoya.accordions, shippingAccordion],
      highlights: [],
      crossSell: pashoya.crossSell.map(getProductById).filter(Boolean),
    }
  }

  const name = shortTitle(product)
  const label = CATEGORY_INFO[product.category]?.label
  return {
    ...base,
    featured: false,
    name,
    badge: product.badge,
    crumb: label,
    crumbTo: `/shop?category=${product.category}`,
    eyebrow: `${label} · Hakiman, Lucknow`,
    announce: ['Ships in 2–3 days · Delivered across India', d ? `${d.percent}% off — today ${price}` : `Today ${price}`, 'Consultations Sat – Sun, 9 AM – 2 PM'],
    rating: null,
    lead: summary(product),
    leadMobile: summary(product),
    sub: null,
    sizeNote: 'Inclusive of all taxes',
    bullets: product.features.slice(0, 4).map((f) => ({ strong: '', text: f })),
    bulletsMobile: product.features.slice(0, 3),
    mobileChip: null,
    gallery: product.images.map((src, i) => ({
      src,
      alt: `${product.title} — image ${i + 1} of ${product.images.length}`,
      fit: 'cover',
      pad: '0px',
      chip: '',
      label: `Show image ${i + 1}`,
    })),
    packs: null,
    trust: [{ icon: 'truck', label: 'Ships in 2–3 days' }, { icon: 'shield', label: 'Secure checkout' }, { icon: 'cash', label: '[Cash on delivery]' }],
    trustMobile: ['Ships in 2–3 days', 'Secure checkout', '[COD]'],
    accordions: [
      { title: 'Description', body: product.description },
      { title: 'Key features', list: product.features },
      ...(product.ingredients ? [{ title: "What's inside", body: [product.ingredients] }] : []),
      ...(product.usageInstructions ? [{ title: 'How to use', body: [product.usageInstructions] }] : []),
      shippingAccordion,
    ],
    benefits: product.highlights.slice(0, 4).map((h) => ({ icon: 'leaf', title: h.title, text: h.text })),
    highlights: product.highlights,
    faqs: storeFaqs,
    final: {
      image: product.images[0],
      cover: true,
      title: name,
      text: summary(product),
      perks: ['Ships in 2–3 days', '7-day help on damaged or wrong items'],
    },
    crossSellTitle: 'You may also like',
    crossSell: getRelated(product, 3),
  }
}

/* ───────── Icons (paths from the design file) ───────── */

const Check = ({ size = 20, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#2F7A4B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
)

const TRUST_PATHS = {
  lab: <path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3" />,
  shield: <><path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z" /><path d="M9 12l2 2 4-4" /></>,
  truck: <><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
  cash: <><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 9v.01M18 15v.01" /></>,
}

const BENEFIT_PATHS = {
  waves: <><path d="M4 14c3 0 4-3 8-3s5 3 8 3" /><path d="M4 18c3 0 4-3 8-3s5 3 8 3" /><path d="M12 3v5" /></>,
  target: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /></>,
  drop: <path d="M12 3c4 4 6 7 6 10a6 6 0 01-12 0c0-3 2-6 6-10z" />,
  moon: <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />,
  leaf: <><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" /><path d="M5 19 13 11" /></>,
}

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 11.5a8 8 0 01-11.8 7L4 20l1.5-4A8 8 0 1120 11.5z" /></svg>
)
const Play = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#2B1A11"><path d="M8 5v14l11-7z" /></svg>
)
const Plus = () => <span className="hk-plus" aria-hidden="true" style={sx('font-size: 22px; font-weight: 400; transition: transform .2s')}>+</span>

/* ───────── Shared bits ───────── */

const eyebrowStyle = (m, extra = '') =>
  sx(m
    ? `font-size: 11px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #8A3A0C; margin-bottom: 8px${extra}`
    : `font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #8A3A0C; margin-bottom: 12px${extra}`)

const h2Style = (m, size, extra = '') =>
  sx(`margin: 0; ${MARCELLUS}; font-size: ${m ? '28px' : size}; line-height: ${m ? '1.12' : '1.1'}${extra}`)

const sectionPad = (m, desktop) => (m ? '40px 16px' : desktop)

function whatsappHref(text) {
  return `https://wa.me/${brand.contact.whatsapp}?text=${encodeURIComponent(text)}`
}
const askHref = (name) => whatsappHref(`Hi Hakiman, I have a question about ${name}.`)

/* ───────── Desktop: above the fold ───────── */

function DesktopGallery({ page }) {
  const [img, setImg] = useState(0)
  const main = page.gallery[img] || page.gallery[0]
  return (
    <div style={sx('flex: 1 1 520px; min-width: 0; display: flex; flex-direction: column; gap: 14px')}>
      <div style={sx('position: relative; aspect-ratio: 1 / 1; border-radius: 20px; overflow: hidden; background: #F7E1C8')}>
        <img src={main.src} alt={main.alt} style={sx(`width: 100%; height: 100%; object-fit: ${main.fit}; padding: ${main.pad}; box-sizing: border-box; display: block`)} />
        <div style={sx('position: absolute; top: 18px; left: 18px; display: flex; gap: 8px; flex-wrap: wrap')}>
          {page.badge && <span style={sx('background: #3B2417; color: #FBEBD8; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 7px 12px; border-radius: 999px')}>{page.badge}</span>}
          {page.off && <span style={sx('background: #FFFFFF; color: #8A3A0C; font-size: 12px; font-weight: 800; padding: 7px 12px; border-radius: 999px')}>{page.off}</span>}
        </div>
        {main.chip && (
          <div style={sx('position: absolute; left: 18px; right: 18px; bottom: 18px; display: flex; justify-content: center')}>
            <span style={sx('background: rgba(255,255,255,0.94); color: #2B1A11; font-size: 14px; font-weight: 600; padding: 10px 16px; border-radius: 12px; text-align: center')}>{main.chip}</span>
          </div>
        )}
      </div>
      {page.gallery.length > 1 && (
        <div style={sx('display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 10px')}>
          {page.gallery.map((g, i) => (
            <button key={g.src} aria-label={g.label} aria-pressed={i === img} onClick={() => setImg(i)} style={sx(`padding: 0; border: 2px solid ${i === img ? '#2B1A11' : 'transparent'}; border-radius: 12px; overflow: hidden; background: #F7E1C8; aspect-ratio: 1 / 1; cursor: pointer`)}>
              <img src={g.src} alt="" loading="lazy" style={sx(`width: 100%; height: 100%; object-fit: ${g.fit}; display: block`)} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Bundles({ page, pack, setPack }) {
  return (
    <fieldset style={sx('border: 0; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px')}>
      <legend style={sx('font-size: 13px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #6A5244; margin-bottom: 10px; padding: 0')}>Choose your pack</legend>
      {page.packs.map((b) => {
        const on = b.id === pack
        const border = on ? '#B9470C' : '#E2C8AC'
        return (
          <button key={b.id} onClick={() => setPack(b.id)} aria-pressed={on} style={sx(`position: relative; display: flex; align-items: center; gap: 14px; text-align: left; width: 100%; padding: 16px 18px; border-radius: 14px; border: 2px solid ${border}; background: ${on ? '#FFF4EA' : '#FFFFFF'}; cursor: pointer; font-family: inherit; color: #2B1A11`)}>
            <span aria-hidden="true" style={sx(`width: 20px; height: 20px; border-radius: 50%; border: 2px solid ${border}; display: grid; place-items: center; flex: none; background: #FFFFFF`)}><span style={sx(`width: 10px; height: 10px; border-radius: 50%; background: ${on ? '#B9470C' : 'transparent'}`)} /></span>
            <span style={sx('flex: 1; display: flex; flex-direction: column; gap: 2px')}>
              <span style={sx('font-size: 16px; font-weight: 800')}>{b.title}</span>
              <span style={sx('font-size: 13px; color: #6A5244')}>{b.sub}</span>
            </span>
            <span style={sx('display: flex; flex-direction: column; align-items: flex-end; gap: 2px')}>
              <span style={sx('font-size: 17px; font-weight: 800')}>{b.price}</span>
              <span style={sx('font-size: 13px; color: #6A5244; text-decoration: line-through')}>{b.mrp}</span>
            </span>
            {b.tag && <span style={sx('position: absolute; top: -11px; right: 16px; background: #B9470C; color: #FFFFFF; font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; padding: 4px 10px; border-radius: 999px')}>{b.tag}</span>}
          </button>
        )
      })}
    </fieldset>
  )
}

function Delivery() {
  const [pin, setPin] = useState('')
  const [msg, setMsg] = useState('')
  const check = () => {
    setMsg(/^\d{6}$/.test(pin.trim())
      ? 'We deliver across India — dispatched in 2–3 business days, usually with you in 5–7.'
      : 'Please enter a 6-digit pincode.')
  }
  return (
    <div style={sx('display: flex; flex-direction: column; gap: 10px; padding: 16px 18px; border-radius: 14px; background: #FFFFFF; border: 1px solid #EAD6C0')}>
      <div style={sx('display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600')}>
        <span aria-hidden="true" style={sx('width: 9px; height: 9px; border-radius: 50%; background: #2F7A4B')} />
        In stock · Dispatched in 2–3 business days, delivered in 5–7
      </div>
      <form onSubmit={(e) => { e.preventDefault(); check() }} style={sx('display: flex; gap: 8px; flex-wrap: wrap; align-items: flex-end; margin: 0')}>
        <label style={sx('display: flex; flex-direction: column; gap: 4px; font-size: 12px; font-weight: 700; color: #6A5244; flex: 1 1 160px')}>Check delivery to your pincode
          <input type="text" inputMode="numeric" maxLength={6} placeholder="e.g. 226003" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} style={sx('height: 44px; border-radius: 10px; border: 1.5px solid #D9BFA3; padding: 0 12px; font-family: inherit; font-size: 15px; color: #2B1A11; background: #FBF5EC')} />
        </label>
        <button type="submit" style={sx('height: 44px; padding: 0 18px; border-radius: 10px; border: 0; background: #3B2417; color: #FBEBD8; font-family: inherit; font-weight: 700; font-size: 14px; cursor: pointer')}>Check</button>
      </form>
      {msg && <div role="status" style={sx('font-size: 13px; color: #4E3A2E')}>{msg}</div>}
    </div>
  )
}

function Accordions({ items, m }) {
  return (
    <div style={sx('border-top: 1px solid #EAD6C0')}>
      {items.map((a) => (
        <details key={a.title} style={sx('border-bottom: 1px solid #EAD6C0')}>
          <summary style={sx(`display: flex; justify-content: space-between; align-items: center; padding: 16px 2px; font-size: ${m ? '15px' : '16px'}; font-weight: 700; min-height: 24px`)}>{a.title}<Plus /></summary>
          {a.body?.map((p) => <p key={p} style={sx('margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #6A5244')}>{p}</p>)}
          {a.list && (
            <ul style={sx('margin: 0 0 16px; padding-left: 18px; font-size: 15px; line-height: 1.6; color: #6A5244')}>
              {a.list.map((f) => <li key={f}>{f}</li>)}
            </ul>
          )}
        </details>
      ))}
    </div>
  )
}

function DesktopTop({ page, buy }) {
  const { pack, setPack, qty, setQty, selPrice, addToCart, buyNow, added } = buy
  return (
    <section style={sx('max-width: 1280px; margin: 0 auto; padding: 20px 24px 56px; display: flex; flex-wrap: wrap; gap: 48px; width: 100%; box-sizing: border-box')}>
      <DesktopGallery page={page} />

      <div style={sx('flex: 1 1 440px; min-width: 0; display: flex; flex-direction: column; gap: 18px')}>
        <div style={sx('display: flex; flex-direction: column; gap: 10px')}>
          <div style={sx('font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #8A3A0C')}>{page.eyebrow}</div>
          <h1 style={sx(`margin: 0; ${MARCELLUS}; font-size: 44px; line-height: 1.08; letter-spacing: -0.01em`)}>{page.name}</h1>
          {page.rating && (
            <a href="#reviews" style={sx('display: inline-flex; align-items: center; gap: 8px; font-size: 14px; color: #6A5244; text-decoration: none')}>
              <span aria-hidden="true" style={sx('color: #D9822B; letter-spacing: 2px; font-size: 16px')}>★★★★★</span>
              <span>{page.rating}</span>
            </a>
          )}
        </div>
        <p style={sx('margin: 0; font-size: 21px; line-height: 1.4; font-weight: 600')}>{page.lead}</p>
        {page.sub && <p style={sx('margin: 0; font-size: 16px; line-height: 1.55; color: #6A5244')}>{page.sub}</p>}

        <div style={sx('display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; padding-top: 4px')}>
          <span style={sx('font-size: 36px; font-weight: 800; letter-spacing: -0.02em')}>{page.price}</span>
          {page.mrp && <span style={sx('font-size: 18px; color: #6A5244; text-decoration: line-through')}>{page.mrp}</span>}
          {page.save && <span style={sx('background: #FCE3CF; color: #8A3A0C; font-size: 13px; font-weight: 800; padding: 5px 10px; border-radius: 8px')}>{page.save}</span>}
          <span style={sx('font-size: 13px; color: #6A5244')}>{page.sizeNote}</span>
        </div>

        <ul style={sx('margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 15px; line-height: 1.45')}>
          {page.bullets.map((b) => (
            <li key={b.strong + b.text} style={sx('display: flex; gap: 10px; align-items: flex-start')}>
              <Check style={sx('flex: none; margin-top: 1px')} />
              <span>{b.strong && <strong>{b.strong}</strong>}{b.text}</span>
            </li>
          ))}
        </ul>

        {page.packs && <Bundles page={page} pack={pack} setPack={setPack} />}

        <div style={sx('display: flex; gap: 12px; flex-wrap: wrap')}>
          <div style={sx('display: flex; align-items: center; border: 1.5px solid #D9BFA3; border-radius: 14px; background: #FFFFFF')}>
            <button aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))} style={sx('width: 48px; height: 56px; border: 0; background: transparent; font-size: 22px; color: #2B1A11; cursor: pointer')}>−</button>
            <span aria-live="polite" style={sx('min-width: 28px; text-align: center; font-weight: 800; font-size: 17px')}>{qty}</span>
            <button aria-label="Increase quantity" onClick={() => setQty(Math.min(9, qty + 1))} style={sx('width: 48px; height: 56px; border: 0; background: transparent; font-size: 22px; color: #2B1A11; cursor: pointer')}>+</button>
          </div>
          <button onClick={addToCart} style={sx('flex: 1 1 160px; height: 58px; border-radius: 14px; border: 2px solid #2B1A11; background: #FFFFFF; color: #2B1A11; font-family: inherit; font-size: 16px; font-weight: 800; cursor: pointer')}>{added ? 'Added to cart' : 'Add to cart'}</button>
        </div>
        <button data-hk-cta onClick={buyNow} style={sx(`height: 62px; border-radius: 14px; border: 0; background: ${CTA}; color: #FFFFFF; font-family: inherit; font-size: 18px; font-weight: 800; letter-spacing: 0.01em; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px`)}>Buy now · <span>{selPrice}</span> <ArrowRight /></button>

        <a href={askHref(page.name)} target="_blank" rel="noreferrer" style={sx('display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 48px; border-radius: 14px; background: #E6F3EA; color: #1E5B36; font-size: 15px; font-weight: 700; text-decoration: none; padding: 0 16px')}>
          <WhatsAppIcon />
          Not sure it's right for you? Ask our Hakim on WhatsApp
        </a>

        <Delivery />

        <div style={sx('display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px')}>
          {page.trust.map((t) => (
            <div key={t.label} style={sx('display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; font-size: 13px; font-weight: 600; padding: 12px 6px; border-radius: 12px; background: #F7E9D9')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A3A0C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{TRUST_PATHS[t.icon]}</svg>{t.label}
            </div>
          ))}
        </div>

        <Accordions items={page.accordions} />
      </div>
    </section>
  )
}

/* ───────── Mobile: first screens ───────── */

function MobileGallery({ page }) {
  const track = useRef(null)
  const [active, setActive] = useState(0)
  const onScroll = () => {
    const el = track.current
    const slide = el?.firstElementChild
    if (!slide) return
    setActive(Math.round(el.scrollLeft / (slide.offsetWidth + 10)))
  }
  return (
    <>
      <div ref={track} className="hk-swipe" onScroll={onScroll} aria-label="Product images" style={sx('display: flex; gap: 10px; padding: 12px 16px 0 16px; overflow-x: auto')}>
        {page.gallery.map((g, i) => {
          const first = i === 0
          const pad = first ? g.padMobile || g.pad : '0px'
          return (
            <div key={g.src} style={sx(`flex: none; width: min(calc(100vw - 70px), 420px); aspect-ratio: 1 / 1; border-radius: 18px; background: ${g.fit === 'contain' ? '#F7E1C8' : '#E9D2B8'}; position: relative; overflow: hidden`)}>
              <img src={g.src} alt={g.alt} loading={first ? 'eager' : 'lazy'} style={sx(`width: 100%; height: 100%; object-fit: ${g.fit}; padding: ${pad}; box-sizing: border-box; display: block`)} />
              {first && page.badge && <span style={sx('position: absolute; top: 12px; left: 12px; background: #3B2417; color: #FBEBD8; font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; padding: 6px 10px; border-radius: 999px')}>{page.badge}</span>}
              {first && page.mobileChip && <span style={sx('position: absolute; bottom: 12px; left: 12px; right: 12px; background: rgba(255,255,255,0.94); border-radius: 10px; padding: 8px 10px; font-size: 12px; font-weight: 700; text-align: center')}>{page.mobileChip}</span>}
            </div>
          )
        })}
      </div>
      {page.gallery.length > 1 && (
        <div aria-hidden="true" style={sx('display: flex; justify-content: center; gap: 6px; padding: 10px 0 4px')}>
          {page.gallery.map((g, i) => (
            <span key={g.src} style={sx(`width: ${i === active ? '18px' : '6px'}; height: 6px; border-radius: 3px; background: ${i === active ? '#2B1A11' : '#D9BFA3'}; transition: width .2s`)} />
          ))}
        </div>
      )}
    </>
  )
}

function MobileTop({ page, buy }) {
  const { pack, setPack, selPrice, buyNow } = buy
  return (
    <>
      <MobileGallery page={page} />
      <div style={sx('padding: 8px 16px 0; display: flex; flex-direction: column; gap: 12px')}>
        {page.ratingMobile && (
          <a href="#reviews" style={sx('font-size: 13px; color: #6A5244; text-decoration: none')}><span aria-hidden="true" style={sx('color: #D9822B; letter-spacing: 2px')}>★★★★★</span> {page.ratingMobile}</a>
        )}
        <h1 style={sx(`margin: 0; ${MARCELLUS}; font-size: 32px; line-height: 1.1`)}>{page.name}</h1>
        <p style={sx('margin: 0; font-size: 17px; line-height: 1.4; font-weight: 600')}>{page.leadMobile}</p>
        <div style={sx('display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap')}>
          <span style={sx('font-size: 28px; font-weight: 800')}>{page.price}</span>
          {page.mrp && <span style={sx('font-size: 16px; color: #6A5244; text-decoration: line-through')}>{page.mrp}</span>}
          {page.save && <span style={sx('background: #FCE3CF; color: #8A3A0C; font-size: 12px; font-weight: 800; padding: 4px 8px; border-radius: 8px')}>{page.save}</span>}
        </div>

        <ul style={sx('margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 14px; line-height: 1.4')}>
          {page.bulletsMobile.map((b) => (
            <li key={b} style={sx('display: flex; gap: 8px')}><Check size={18} style={sx('flex: none')} />{b}</li>
          ))}
        </ul>

        {page.packs && (
          <div role="radiogroup" aria-label="Choose your pack" style={sx('display: flex; flex-direction: column; gap: 8px; padding-top: 4px')}>
            {page.packs.map((b) => {
              const on = b.id === pack
              return (
                <button key={b.id} role="radio" aria-checked={on} onClick={() => setPack(b.id)} style={sx(`position: relative; display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px; border: ${on ? '2px solid #B9470C' : '1.5px solid #E2C8AC'}; background: ${on ? '#FFF4EA' : '#FFFFFF'}; width: 100%; text-align: left; font-family: inherit; font-size: 16px; color: #2B1A11; cursor: pointer`)}>
                  <span aria-hidden="true" style={sx(`width: 18px; height: 18px; border-radius: 50%; border: 2px solid ${on ? '#B9470C' : '#E2C8AC'}; display: grid; place-items: center; flex: none`)}>{on && <span style={sx('width: 9px; height: 9px; border-radius: 50%; background: #B9470C')} />}</span>
                  {b.subMobile
                    ? <span style={sx('flex: 1')}><span style={sx('display: block; font-weight: 800; font-size: 15px')}>{b.title}</span><span style={sx('font-size: 12px; color: #6A5244')}>{b.subMobile}</span></span>
                    : <span style={sx('flex: 1; font-weight: 800; font-size: 15px')}>{b.title}</span>}
                  <span style={sx('font-weight: 800')}>{b.price}</span>
                  {b.tagMobile && <span style={sx('position: absolute; top: -10px; right: 12px; background: #B9470C; color: #FFFFFF; font-size: 10px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; padding: 3px 8px; border-radius: 999px')}>{b.tagMobile}</span>}
                </button>
              )
            })}
          </div>
        )}

        <button data-hk-cta onClick={buyNow} style={sx(`height: 56px; border-radius: 14px; border: 0; background: ${CTA}; color: #FFFFFF; font-family: inherit; font-size: 17px; font-weight: 800; cursor: pointer`)}>Buy now · {selPrice}</button>
        <a href={askHref(page.name)} target="_blank" rel="noreferrer" style={sx('display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 46px; border-radius: 12px; background: #E6F3EA; color: #1E5B36; font-size: 14px; font-weight: 700; text-decoration: none')}>Ask our Hakim on WhatsApp</a>

        <div style={sx('display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; font-size: 12px; font-weight: 700; text-align: center')}>
          {page.trustMobile.map((t) => <div key={t} style={sx('background: #F7E9D9; border-radius: 10px; padding: 10px 4px')}>{t}</div>)}
        </div>
      </div>
    </>
  )
}

function MobileWhenToUse({ page }) {
  const [all, setAll] = useState(false)
  const items = all ? page.indications : page.mobileIndications.map((n) => page.indications.find((it) => it.n === n))
  return (
    <section style={sx('padding: 40px 16px 0')}>
      <div style={eyebrowStyle(true)}>Indications · When to use</div>
      <h2 style={sx(`margin: 0 0 18px; ${MARCELLUS}; font-size: 28px; line-height: 1.12`)}>Reach for PASHOYA when your body tells you it's had enough.</h2>
      <div style={sx('display: flex; flex-direction: column; gap: 10px')}>
        {items.map((it, i) => (
          <div key={it.n} style={sx('background: #FFFFFF; border: 1px solid #EAD6C0; border-radius: 14px; padding: 16px; display: flex; gap: 14px')}>
            {/* The mobile design numbers cards by position, not by their desktop number */}
            <span style={sx("font-family: 'Marcellus', Georgia, serif; font-size: 24px; color: #E8641B; line-height: 1")}>{String(i + 1).padStart(2, '0')}</span>
            <div>
              <div style={sx('font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #8A3A0C')}>{it.when}</div>
              <div style={sx('font-weight: 800; font-size: 16px; margin-top: 2px')}>{it.title}</div>
              <div style={sx('font-size: 13px; color: #6A5244; margin-top: 4px; line-height: 1.5')}>{it.bodyMobile || it.body}</div>
            </div>
          </div>
        ))}
        <button onClick={() => setAll(!all)} aria-expanded={all} style={sx('display: flex; align-items: center; justify-content: center; min-height: 46px; border-radius: 12px; border: 1.5px solid #2B1A11; background: transparent; color: #2B1A11; font-family: inherit; font-weight: 800; font-size: 14px; cursor: pointer')}>
          {all ? 'Show fewer' : `See all ${page.indications.length} moments`}
        </button>
      </div>
      <div style={sx('margin-top: 14px; background: #FFF7EC; border: 1.5px solid #E2C8AC; border-radius: 14px; padding: 16px')}>
        <div style={sx('font-weight: 800; font-size: 15px; margin-bottom: 6px')}>Check first</div>
        <div style={sx('font-size: 13px; line-height: 1.55; color: #4E3A2E')}>{page.checkFirstMobile}</div>
      </div>
    </section>
  )
}

function MobileHowToUse({ page }) {
  return (
    <section style={sx('padding: 36px 16px 0')}>
      <h2 style={sx(`margin: 0 0 14px; ${MARCELLUS}; font-size: 26px`)}>Simple self-care in 20 minutes</h2>
      <div style={sx('display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; text-align: center')}>
        {page.stepsMobile.map((s) => (
          <div key={s.big} style={sx('background: #F7E1C8; border-radius: 12px; padding: 14px 6px')}>
            <div style={sx("font-family: 'Marcellus', Georgia, serif; font-size: 22px")}>{s.big}</div>
            <div style={sx('font-size: 12px; font-weight: 700; margin-top: 4px')}>{s.small}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───────── Sections below the fold ───────── */

function BenefitStrip({ page, m }) {
  if (!page.benefits.length) return null
  return (
    <section style={sx(`background: #F7E1C8${m ? '; margin-top: 40px' : ''}`)}>
      <div style={sx(`max-width: 1280px; margin: 0 auto; padding: ${m ? '28px 16px' : '36px 24px'}; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: ${m ? '18px' : '24px'}`)}>
        {page.benefits.map((b) => (
          <div key={b.title} style={sx('display: flex; gap: 14px; align-items: flex-start')}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8A3A0C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={sx('flex: none')}>{BENEFIT_PATHS[b.icon]}</svg>
            <div><div style={sx('font-weight: 800; font-size: 16px')}>{b.title}</div><div style={sx('font-size: 14px; color: #6A5244; margin-top: 4px; line-height: 1.5')}>{b.text}</div></div>
          </div>
        ))}
      </div>
    </section>
  )
}

function WhenToUse({ page, buyNow }) {
  return (
    <section id="when-to-use" style={sx('max-width: 1280px; margin: 0 auto; padding: 96px 24px 40px; width: 100%; box-sizing: border-box')}>
      <div style={sx('display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 40px')}>
        <div style={sx('max-width: 680px')}>
          <div style={eyebrowStyle(false)}>Indications · When to use</div>
          <h2 style={h2Style(false, '46px')}>Reach for PASHOYA when your body tells you it's had enough.</h2>
        </div>
        <p style={sx('margin: 0; max-width: 380px; font-size: 16px; line-height: 1.6; color: #6A5244')}>Find your moment below. If more than one sounds like you, make it a daily evening soak.</p>
      </div>

      <div style={sx('display: flex; flex-wrap: wrap; border-radius: 24px; overflow: hidden; background: #3B2417; color: #FBEBD8; margin-bottom: 16px')}>
        <div style={sx('flex: 1 1 380px; min-height: 300px; position: relative; background: #E9D2B8')}>
          <img src="/assets/pdp/foot-soak.webp" alt="Feet soaking in warm water as PASHOYA salt is spooned in" loading="lazy" style={sx('width: 100%; height: 100%; object-fit: cover; display: block; position: absolute; inset: 0')} />
        </div>
        <div style={sx('flex: 1.6 1 480px; padding: 36px 36px 32px; display: flex; flex-direction: column; gap: 24px')}>
          <div>
            <div style={sx('font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #F5B98C')}>A typical day</div>
            <h3 style={sx(`margin: 8px 0 0; ${MARCELLUS}; font-size: 32px; line-height: 1.15`)}>Your feet carry you all day. Give them 20 minutes back.</h3>
          </div>
          <div style={sx('display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0; position: relative')}>
            {page.day.map((s, i) => {
              const last = i === page.day.length - 1
              const edge = i === 0 ? 'padding-right: 10px' : `${last ? '' : 'padding-right: 10px; '}border-left: 1px dashed rgba(251,235,216,0.35); padding-left: 12px`
              return (
                <div key={s.time} style={sx(`display: flex; flex-direction: column; gap: 10px; ${edge}`)}>
                  <span style={sx(`width: 14px; height: 14px; border-radius: 50%; ${s.dot}`)} />
                  <div style={sx('font-size: 13px; font-weight: 800; color: #F5B98C')}>{s.time}</div>
                  <div style={sx(`font-size: 14px; line-height: 1.4${s.bold ? '; font-weight: 700' : ''}`)}>{s.text}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={sx('display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 16px')}>
        {page.indications.map((it) => (
          <article key={it.n} style={sx('background: #FFFFFF; border: 1px solid #EAD6C0; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column')}>
            <div style={sx(`position: relative; height: 168px; background: ${it.tint}; display: grid; place-items: center`)}>
              <img src={it.icon} alt="" style={sx('width: 112px; height: 112px; display: block')} />
              <span style={sx("position: absolute; top: 14px; left: 16px; font-family: 'Marcellus', Georgia, serif; font-size: 26px; color: #8A3A0C; line-height: 1")}>{it.n}</span>
              <span style={sx('position: absolute; top: 12px; right: 12px; font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #FBEBD8; background: #3B2417; padding: 6px 10px; border-radius: 999px')}>{it.when}</span>
            </div>
            <div style={sx('padding: 20px 22px 22px; display: flex; flex-direction: column; gap: 10px; flex: 1')}>
              <h3 style={sx('margin: 0; font-size: 19px; font-weight: 800; line-height: 1.3')}>{it.title}</h3>
              <p style={sx('margin: 0; font-size: 14px; line-height: 1.55; color: #6A5244; flex: 1')}>{it.body}</p>
              <div style={sx('display: flex; align-items: center; gap: 8px; background: #FBF1E6; border-radius: 10px; padding: 10px 12px; font-size: 13px; font-weight: 700; color: #2B1A11')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A3A0C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3c4 4 6 7 6 10a6 6 0 01-12 0c0-3 2-6 6-10z" /></svg>{it.soak}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div style={sx('display: flex; flex-wrap: wrap; gap: 16px; margin-top: 16px')}>
        <div style={sx('flex: 2 1 520px; background: #3B2417; color: #FBEBD8; border-radius: 18px; padding: 28px; display: flex; flex-direction: column; gap: 18px')}>
          <h3 style={sx(`margin: 0; ${MARCELLUS}; font-size: 26px`)}>How often?</h3>
          <div style={sx('display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 18px')}>
            {page.often.map((o) => (
              <div key={o.label}><div style={sx('font-size: 13px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #F5B98C')}>{o.label}</div><div style={sx('font-size: 15px; line-height: 1.5; margin-top: 6px')}>{o.text}</div></div>
            ))}
          </div>
        </div>
        <div style={sx('flex: 1 1 320px; background: #FFF7EC; border: 1.5px solid #E2C8AC; border-radius: 18px; padding: 28px; display: flex; flex-direction: column; gap: 12px')}>
          <div style={sx('display: flex; align-items: center; gap: 10px')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8A3A0C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l9 16H3z" /><path d="M12 10v4M12 17h.01" /></svg>
            <h3 style={sx('margin: 0; font-size: 18px; font-weight: 800')}>Check first</h3>
          </div>
          <ul style={sx('margin: 0; padding-left: 18px; font-size: 14px; line-height: 1.6; color: #4E3A2E; display: flex; flex-direction: column; gap: 4px')}>
            {page.checkFirst.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      </div>

      <div style={sx('display: flex; justify-content: center; margin-top: 36px')}>
        <button data-hk-cta onClick={buyNow} style={sx(`height: 58px; padding: 0 36px; border-radius: 14px; border: 0; background: ${CTA}; color: #FFFFFF; font-family: inherit; font-size: 17px; font-weight: 800; cursor: pointer`)}>Buy now · {page.price}</button>
      </div>
    </section>
  )
}

function Reels({ page, m }) {
  return (
    <section style={sx(`max-width: 1280px; margin: 0 auto; padding: ${m ? '40px 16px 0' : '72px 24px 40px'}; width: 100%; box-sizing: border-box`)}>
      <div style={eyebrowStyle(m)}>Watch the ritual</div>
      <h2 style={h2Style(m, '40px', `; margin-bottom: ${m ? '18px' : '28px'}`)}>Real people, real evening soaks</h2>
      <div className={m ? 'hk-swipe' : undefined} style={sx(m ? 'display: flex; gap: 12px; overflow-x: auto; margin: 0 -16px; padding: 0 16px' : 'display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px')}>
        {page.reels.map((r) => (
          <div key={r.caption} style={sx(`position: relative; aspect-ratio: 9 / 14; border-radius: 18px; overflow: hidden; background: ${r.contain ? '#F7E1C8' : '#E9D2B8'}${m ? '; flex: none; width: 220px' : ''}`)}>
            <img src={r.src} alt={r.alt} loading="lazy" style={sx(r.contain ? 'width: 100%; height: 100%; object-fit: contain; padding: 40px; box-sizing: border-box; display: block' : 'width: 100%; height: 100%; object-fit: cover; display: block')} />
            <span style={sx('position: absolute; left: 14px; bottom: 14px; right: 14px; background: rgba(255,255,255,0.94); border-radius: 12px; padding: 10px 12px; font-size: 13px; font-weight: 600')}>{r.caption}</span>
            <span aria-hidden="true" style={sx('position: absolute; top: 50%; left: 50%; width: 56px; height: 56px; margin: -28px 0 0 -28px; border-radius: 50%; background: rgba(255,255,255,0.92); display: grid; place-items: center')}><Play /></span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Ingredients({ page, m }) {
  return (
    <section style={sx(`background: #FFFFFF; border-top: 1px solid #EAD6C0; border-bottom: 1px solid #EAD6C0${m ? '; margin-top: 40px' : ''}`)}>
      <div style={sx(`max-width: 1280px; margin: 0 auto; padding: ${sectionPad(m, '88px 24px')}`)}>
        <div style={sx(`display: flex; flex-wrap: wrap; justify-content: space-between; gap: ${m ? '14px' : '24px'}; align-items: flex-end; margin-bottom: ${m ? '20px' : '36px'}`)}>
          <div style={sx('max-width: 640px')}>
            <div style={eyebrowStyle(m)}>What's inside · Why it works</div>
            <h2 style={h2Style(m, '44px')}>Four mineral salts. Six essential oils. Nothing filler.</h2>
          </div>
          <p style={sx(`margin: 0; max-width: 400px; font-size: ${m ? '15px' : '16px'}; line-height: 1.6; color: #6A5244`)}>Plain Epsom salt only relaxes. PASHOYA pairs it with traditional Unani khar salts and an aromatherapy blend, so one soak works on muscles, joints and mind together.</p>
        </div>
        <div style={sx(m ? 'display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px' : 'display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px')}>
          {page.minerals.map((x) => (
            <article key={x.name} style={sx('border-radius: 18px; overflow: hidden; background: #FBF5EC; border: 1px solid #EAD6C0; display: flex; flex-direction: column')}>
              <img src={x.src} alt={x.name} loading="lazy" style={sx('width: 100%; aspect-ratio: 4 / 3; object-fit: cover; display: block')} />
              <div style={sx(m ? 'padding: 12px 12px 14px; display: flex; flex-direction: column; gap: 4px' : 'padding: 18px 20px 22px; display: flex; flex-direction: column; gap: 6px')}>
                <div style={sx(`font-size: ${m ? '10px' : '12px'}; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #8A3A0C`)}>{x.role}</div>
                <h3 style={sx(`margin: 0; font-size: ${m ? '16px' : '19px'}; font-weight: 800`)}>{x.name}</h3>
                <p style={sx(`margin: 0; font-size: ${m ? '13px' : '14px'}; line-height: 1.55; color: #6A5244`)}>{x.body}</p>
              </div>
            </article>
          ))}
        </div>
        <div style={sx(`margin-top: ${m ? '10px' : '16px'}; display: flex; flex-wrap: wrap; gap: ${m ? '10px' : '16px'}; align-items: stretch`)}>
          <div style={sx(`flex: 1 1 360px; border-radius: 18px; overflow: hidden; min-height: ${m ? '200px' : '240px'}; background: #F7E1C8`)}><img src="/assets/pdp/essential-oils.webp" alt="Bottles of essential oils" loading="lazy" style={sx(`width: 100%; height: 100%; object-fit: cover; display: block${m ? '; min-height: 200px' : ''}`)} /></div>
          <div style={sx(`flex: 2 1 520px; border-radius: 18px; background: #F7E1C8; padding: ${m ? '20px' : '28px'}; display: grid; grid-template-columns: ${m ? 'repeat(2, minmax(0, 1fr))' : 'repeat(auto-fit, minmax(200px, 1fr))'}; gap: ${m ? '14px 16px' : '18px 24px'}; align-content: center`)}>
            {page.oils.map((o) => (
              <div key={o.name}><div style={sx(`font-size: ${m ? '15px' : '16px'}; font-weight: 800`)}>{o.name}</div><div style={sx(`font-size: ${m ? '13px' : '14px'}; color: #6A5244; margin-top: 3px; line-height: 1.5`)}>{o.body}</div></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function HowToUse({ page }) {
  return (
    <section style={sx('max-width: 1280px; margin: 0 auto; padding: 88px 24px; display: flex; flex-wrap: wrap; gap: 48px; align-items: center; width: 100%; box-sizing: border-box')}>
      <div style={sx('flex: 1 1 420px; border-radius: 22px; overflow: hidden; aspect-ratio: 4 / 3; background: #E9D2B8')}><img src="/assets/pdp/foot-soak.webp" alt="A wooden spoon adding PASHOYA salt to a warm foot soak" loading="lazy" style={sx('width: 100%; height: 100%; object-fit: cover; display: block')} /></div>
      <div style={sx('flex: 1 1 420px; display: flex; flex-direction: column; gap: 24px')}>
        <div>
          <div style={eyebrowStyle(false)}>How to use</div>
          <h2 style={h2Style(false, '42px')}>Simple self-care in 20 minutes</h2>
        </div>
        <ol style={sx('margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 18px')}>
          {page.steps.map((s, i) => (
            <li key={s.title} style={sx('display: flex; gap: 18px')}>
              <span style={sx('flex: none; width: 44px; height: 44px; border-radius: 50%; background: #3B2417; color: #FBEBD8; display: grid; place-items: center; font-weight: 800')}>{i + 1}</span>
              <div><div style={sx('font-size: 18px; font-weight: 800')}>{s.title}</div><div style={sx('font-size: 15px; color: #6A5244; margin-top: 4px; line-height: 1.5')}>{s.text}</div></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Compare({ page, m }) {
  return (
    <section style={sx(`background: #F7E1C8${m ? '; margin-top: 0' : ''}`)}>
      <div style={sx(`max-width: 1080px; margin: 0 auto; padding: ${sectionPad(m, '88px 24px')}`)}>
        <div style={sx(`text-align: center; margin-bottom: ${m ? '20px' : '36px'}`)}>
          <div style={eyebrowStyle(m)}>Compare</div>
          <h2 style={h2Style(m, '42px')}>Why a soak, not another tablet or tube?</h2>
        </div>
        <div style={sx('overflow-x: auto; border-radius: 18px; background: #FFFFFF; border: 1px solid #EAD6C0')}>
          <table style={sx('width: 100%; min-width: 640px; border-collapse: collapse; font-size: 15px')}>
            <thead>
              <tr>
                <th scope="col" style={sx('text-align: left; padding: 18px 20px; font-size: 13px; color: #6A5244; font-weight: 700')}><span style={sx('position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)')}>Feature</span></th>
                <th scope="col" style={sx('padding: 18px 12px; background: #3B2417; color: #FBEBD8; font-size: 15px; font-weight: 800')}>PASHOYA</th>
                {page.compareCols.map((c) => <th key={c} scope="col" style={sx('padding: 18px 12px; font-size: 14px; font-weight: 700; color: #4E3A2E')}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {page.compare.map((r) => (
                <tr key={r.label} style={sx('border-top: 1px solid #F0E1D0')}>
                  <th scope="row" style={sx('text-align: left; padding: 16px 20px; font-weight: 700')}>{r.label}</th>
                  <td style={sx('text-align: center; padding: 16px 12px; background: #FCF1E6; font-weight: 800; color: #1E5B36')}>{r.a}</td>
                  <td style={sx('text-align: center; padding: 16px 12px; color: #6A5244')}>{r.b}</td>
                  <td style={sx('text-align: center; padding: 16px 12px; color: #6A5244')}>{r.c}</td>
                  <td style={sx('text-align: center; padding: 16px 12px; color: #6A5244')}>{r.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

const STAT_TONES = {
  dark: ['background: #3B2417; color: #FBEBD8; border-radius: 18px', 'color: #F2D7BE'],
  light: ['background: #FFFFFF; border: 1px solid #EAD6C0; border-radius: 18px', 'color: #6A5244'],
  accent: ['background: #E8641B; color: #2B1A11; border-radius: 18px', 'font-weight: 600'],
}

function Heritage({ page, m }) {
  const h = page.heritage
  return (
    <section id="heritage" style={sx(`max-width: 1280px; margin: 0 auto; padding: ${sectionPad(m, '96px 24px')}; display: flex; flex-wrap: wrap; gap: ${m ? '28px' : '48px'}; align-items: center; width: 100%; box-sizing: border-box`)}>
      <div style={sx(`flex: 1 1 460px; min-width: 0; display: flex; flex-direction: column; gap: ${m ? '16px' : '20px'}`)}>
        <img src="/assets/pdp/logo-stacked.webp" alt="Hakiman logo" loading="lazy" style={sx(`width: ${m ? '96px' : '120px'}; height: auto; display: block`)} />
        <h2 style={h2Style(m, '44px')}>{h.title}</h2>
        <p style={sx(`margin: 0; font-size: ${m ? '15px' : '17px'}; line-height: 1.65; color: #4E3A2E`)}>{h.text}</p>
        <blockquote style={sx(`margin: 0; padding: ${m ? '16px 18px' : '20px 24px'}; border-radius: 16px; background: #FFFFFF; border: 1px solid #EAD6C0; font-family: 'Marcellus', Georgia, serif; font-size: ${m ? '18px' : '21px'}; line-height: 1.45`)}>{h.quote}<footer style={sx("font-family: 'Manrope', sans-serif; font-size: 14px; color: #6A5244; margin-top: 10px")}>{h.cite}</footer></blockquote>
      </div>
      <div style={sx(`flex: 1 1 420px; min-width: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: ${m ? '10px' : '14px'}`)}>
        {h.stats.map((s) => {
          const [box, small] = STAT_TONES[s.tone]
          return (
            <div key={s.big} style={sx(`${box}; padding: ${m ? '18px' : '26px'}`)}>
              <div style={sx(`font-family: 'Marcellus', Georgia, serif; font-size: ${m ? '34px' : '44px'}`)}>{s.big}</div>
              <div style={sx(`font-size: ${m ? '13px' : '14px'}; margin-top: 6px; ${small}`)}>{s.text}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function Reviews({ page, m }) {
  return (
    <section id="reviews" style={sx('background: #FFFFFF; border-top: 1px solid #EAD6C0')}>
      <div style={sx(`max-width: 1280px; margin: 0 auto; padding: ${sectionPad(m, '88px 24px')}`)}>
        <div style={sx(`display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: ${m ? '16px' : '24px'}; margin-bottom: ${m ? '20px' : '32px'}`)}>
          <div>
            <div style={eyebrowStyle(m)}>Reviews</div>
            <h2 style={h2Style(m, '42px')}>What soakers are saying</h2>
          </div>
          <div style={sx('display: flex; align-items: center; gap: 16px; flex-wrap: wrap')}>
            <div style={sx(`font-family: 'Marcellus', Georgia, serif; font-size: ${m ? '40px' : '52px'}; line-height: 1`)}>{page.reviewScore}</div>
            <div><div aria-hidden="true" style={sx('color: #D9822B; letter-spacing: 3px; font-size: 18px')}>★★★★★</div><div style={sx('font-size: 14px; color: #6A5244')}>{page.reviewCount}</div></div>
            <a href={whatsappHref(`Hi Hakiman, I'd like to share a review of ${page.name}.`)} target="_blank" rel="noreferrer" style={sx('display: inline-flex; align-items: center; height: 48px; box-sizing: border-box; padding: 0 20px; border-radius: 12px; border: 2px solid #2B1A11; background: #FFFFFF; font-weight: 800; font-size: 14px; cursor: pointer; color: #2B1A11; text-decoration: none')}>Write a review</a>
          </div>
        </div>
        <div style={sx('display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px')}>
          {page.reviews.map((rv) => (
            <article key={rv.head} style={sx('background: #FBF5EC; border: 1px solid #EAD6C0; border-radius: 18px; padding: 24px; display: flex; flex-direction: column; gap: 12px')}>
              <div aria-hidden="true" style={sx('color: #D9822B; letter-spacing: 2px')}>★★★★★</div>
              <h3 style={sx('margin: 0; font-size: 17px; font-weight: 800; line-height: 1.35')}>{rv.head}</h3>
              <p style={sx('margin: 0; font-size: 14px; line-height: 1.6; color: #6A5244; flex: 1')}>{rv.body}</p>
              <div style={sx('display: flex; justify-content: space-between; font-size: 13px; color: #6A5244')}><span style={sx('font-weight: 700; color: #2B1A11')}>{rv.who}</span><span>Verified buyer</span></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Highlights({ page, m }) {
  if (!page.highlights.length) return null
  return (
    <section style={sx(`max-width: 1280px; margin: 0 auto; padding: ${sectionPad(m, '88px 24px 40px')}; width: 100%; box-sizing: border-box`)}>
      <div style={eyebrowStyle(m)}>A closer look</div>
      <h2 style={h2Style(m, '42px', `; margin-bottom: ${m ? '18px' : '28px'}`)}>{page.name}</h2>
      <div style={sx(`display: flex; flex-direction: column; gap: ${m ? '10px' : '16px'}`)}>
        {page.highlights.map((h) => (
          <img key={h.image} src={h.image} alt={`${h.title} — ${h.text}`} loading="lazy" style={sx(`width: 100%; height: auto; display: block; border-radius: ${m ? '14px' : '22px'}; background: #F7E1C8`)} />
        ))}
      </div>
    </section>
  )
}

function Faq({ page, m }) {
  return (
    <section style={sx(`max-width: 920px; margin: 0 auto; padding: ${sectionPad(m, '88px 24px')}; width: 100%; box-sizing: border-box`)}>
      <div style={eyebrowStyle(m, '; text-align: center')}>Questions</div>
      <h2 style={h2Style(m, '42px', `; margin-bottom: ${m ? '20px' : '32px'}; text-align: center`)}>Before you order</h2>
      <div style={sx('border-top: 1px solid #E2C8AC')}>
        {page.faqs.map((f) => (
          <details key={f.q} style={sx('border-bottom: 1px solid #E2C8AC')}>
            <summary style={sx(`display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: ${m ? '16px 2px' : '20px 4px'}; font-size: ${m ? '16px' : '17px'}; font-weight: 700`)}>{f.q}<span className="hk-plus" aria-hidden="true" style={sx('font-size: 24px; font-weight: 400; transition: transform .2s')}>+</span></summary>
            <p style={sx(`margin: 0 0 ${m ? '16px' : '20px'}; padding: 0 4px; font-size: 15px; line-height: 1.65; color: #6A5244`)}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function FinalOffer({ page, m, buyNow }) {
  const f = page.final
  return (
    <section style={sx(m ? 'padding: 0 16px 56px' : 'padding: 0 24px 96px')}>
      <div style={sx(`max-width: 1180px; margin: 0 auto; background: #3B2417; color: #FBEBD8; border-radius: ${m ? '22px' : '28px'}; overflow: hidden; display: flex; flex-wrap: wrap; align-items: center`)}>
        <div style={sx(`flex: 1 1 360px; background: #F7E1C8; display: grid; place-items: center; padding: ${m ? '28px' : '40px'}; min-height: ${m ? '240px' : '340px'}; box-sizing: border-box`)}>
          <img src={f.image} alt={page.name} loading="lazy" style={sx(`width: 100%; max-width: 320px; height: auto; display: block${f.cover ? '; border-radius: 16px' : ''}`)} />
        </div>
        <div style={sx(`flex: 1.4 1 420px; min-width: 0; padding: ${m ? '28px 22px' : '48px'}; display: flex; flex-direction: column; gap: 18px`)}>
          <h2 style={sx(`margin: 0; ${MARCELLUS}; font-size: ${m ? '28px' : '40px'}; line-height: 1.12`)}>{f.title}</h2>
          <p style={sx(`margin: 0; font-size: ${m ? '15px' : '16px'}; line-height: 1.6; color: #F2D7BE`)}>{f.text}</p>
          <div style={sx('display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap')}>
            <span style={sx(`font-size: ${m ? '28px' : '34px'}; font-weight: 800`)}>{page.price}</span>
            {page.mrp && <span style={sx('font-size: 17px; text-decoration: line-through; color: #D9BFA3')}>{page.mrp}</span>}
            {page.off && <span style={sx('font-size: 14px; font-weight: 800; color: #F5B98C')}>{page.off.replace('OFF', 'off')}</span>}
          </div>
          <button data-hk-cta onClick={buyNow} style={sx('height: 60px; max-width: 360px; border-radius: 14px; border: 0; background: #FBEBD8; color: #3B2417; font-family: inherit; font-size: 18px; font-weight: 800; cursor: pointer')}>Buy now</button>
          <div style={sx('display: flex; flex-wrap: wrap; gap: 8px 22px; font-size: 13px; color: #F2D7BE')}>
            {f.perks.map((p) => <span key={p}>{p}</span>)}
          </div>
        </div>
      </div>
    </section>
  )
}

function CrossSell({ page, m }) {
  const { add } = useCart()
  if (!page.crossSell.length) return null
  return (
    <section style={sx(`max-width: 1280px; margin: 0 auto; padding: ${m ? '0 16px 56px' : '0 24px 96px'}; width: 100%; box-sizing: border-box`)}>
      <h2 style={sx(`margin: 0 0 ${m ? '16px' : '24px'}; ${MARCELLUS}; font-size: ${m ? '24px' : '32px'}`)}>{page.crossSellTitle}</h2>
      <div style={sx('display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px')}>
        {page.crossSell.map((p) => {
          const name = shortTitle(p)
          return (
            <div key={p.id} style={sx('display: flex; gap: 16px; align-items: center; background: #FFFFFF; border: 1px solid #EAD6C0; border-radius: 18px; padding: 16px')}>
              <Link to={`/products/${p.handle}`} tabIndex={-1} aria-hidden="true" style={sx('flex: none; display: block')}>
                <img src={p.images[0]} alt="" loading="lazy" style={sx('width: 88px; height: 88px; border-radius: 12px; background: #F7E1C8; object-fit: cover; display: block')} />
              </Link>
              <div style={sx('flex: 1; min-width: 0')}>
                <Link to={`/products/${p.handle}`} style={sx('display: block; font-weight: 800; color: #2B1A11; text-decoration: none')}>{name}</Link>
                <div style={sx('font-size: 14px; margin-top: 4px')}><strong>{formatPrice(p.price)}</strong> {p.compareAtPrice && <span style={sx('text-decoration: line-through; color: #6A5244')}>{formatPrice(p.compareAtPrice)}</span>}</div>
              </div>
              <button aria-label={`Add ${name} to cart`} onClick={() => add(p, 1)} style={sx('width: 44px; height: 44px; flex: none; border-radius: 12px; border: 0; background: #3B2417; color: #FBEBD8; font-size: 22px; cursor: pointer')}>+</button>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// Shown only while none of the page's own Buy now buttons (data-hk-cta) or the
// footer are on screen, so it never sits on top of the buy box.
function useStickyBarVisible(root) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const els = [...(root.current?.querySelectorAll('[data-hk-cta], :scope > footer') ?? [])]
    if (!els.length) return
    let frame = 0
    const check = () => {
      frame = 0
      const rects = els.map((el) => el.getBoundingClientRect())
      const onScreen = rects.some((r) => r.bottom > 0 && r.top < window.innerHeight)
      // Only once the visitor has scrolled past the first buy button
      setShow(!onScreen && rects[0].bottom < 0)
    }
    const onScroll = () => { frame ||= requestAnimationFrame(check) }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [root])
  return show
}

const hidden = (show, offset) => show
  ? 'transform: translateY(0); opacity: 1; visibility: visible; transition: transform 0.35s ease, opacity 0.35s ease, visibility 0s'
  : `transform: translateY(${offset}); opacity: 0; visibility: hidden; transition: transform 0.35s ease, opacity 0.35s ease, visibility 0s 0.35s`

function StickyBar({ page, m, sel, selPrice, buyNow, show }) {
  if (m) {
    const line = sel ? `${sel.title} · ${sel.price}` : `${page.name} · ${page.price}`
    return (
      <div aria-hidden={!show} style={sx(`position: fixed; left: 0; right: 0; bottom: 0; z-index: 20; background: #FFFFFF; border-top: 1px solid #E2C8AC; box-shadow: 0 -8px 24px rgba(43,26,17,0.12); padding: 10px 16px max(18px, env(safe-area-inset-bottom)); display: flex; align-items: center; gap: 12px; ${hidden(show, '110%')}`)}>
        <div style={sx('flex: 1; min-width: 0')}>
          <div style={sx('font-weight: 800; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis')}>{line}</div>
          <div style={sx('font-size: 12px; color: #6A5244')}>Ships in 2–3 days</div>
        </div>
        <button onClick={buyNow} style={sx(`height: 50px; padding: 0 26px; border-radius: 12px; border: 0; background: ${CTA}; color: #FFFFFF; font-family: inherit; font-size: 16px; font-weight: 800; cursor: pointer; flex: none`)}>Buy now</button>
      </div>
    )
  }
  return (
    <div style={sx('position: sticky; bottom: 16px; z-index: 5; display: flex; justify-content: center; padding: 0 16px; margin-top: -96px; margin-bottom: 16px; pointer-events: none')}>
      <div aria-hidden={!show} style={sx(`pointer-events: ${show ? 'auto' : 'none'}; display: flex; align-items: center; gap: 14px; background: #FFFFFF; border: 1px solid #E2C8AC; border-radius: 18px; padding: 10px 10px 10px 12px; box-shadow: 0 12px 32px rgba(43,26,17,0.18); max-width: 620px; width: 100%; box-sizing: border-box; flex-wrap: wrap; ${hidden(show, '24px')}`)}>
        <img src={page.featured ? '/assets/pdp/pashoya-jar.webp' : page.gallery[0].src} alt="" style={sx(`width: 48px; height: 48px; object-fit: ${page.featured ? 'contain' : 'cover'}; border-radius: 10px; background: #F7E1C8; padding: ${page.featured ? '4px' : '0'}; box-sizing: border-box`)} />
        <div style={sx('flex: 1 1 140px; min-width: 0')}>
          <div style={sx('font-weight: 800; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis')}>{page.name}</div>
          <div style={sx('font-size: 13px; color: #6A5244')}>{sel ? `${sel.title} · ${page.size} each` : page.sizeNote}</div>
        </div>
        <div style={sx('font-weight: 800; font-size: 17px')}>{selPrice}</div>
        <button onClick={buyNow} style={sx(`height: 50px; padding: 0 24px; border-radius: 12px; border: 0; background: ${CTA}; color: #FFFFFF; font-family: inherit; font-size: 16px; font-weight: 800; cursor: pointer`)}>Buy now</button>
      </div>
    </div>
  )
}

/* ───────── Page ───────── */

export default function Product() {
  const { handle } = useParams()
  const product = getProduct(handle)
  if (!product) return <NotFound />
  // Keyed so gallery, pack and quantity reset when moving between products.
  return <ProductPage key={product.id} product={product} />
}

function ProductPage({ product }) {
  const m = useMediaQuery(PDP_MOBILE)
  const navigate = useNavigate()
  const { add } = useCart()
  const page = buildPage(product)
  const [pack, setPack] = useState(page.defaultPack ?? null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const root = useRef(null)
  const barShown = useStickyBarVisible(root)

  useEffect(() => {
    document.title = `${page.name} | The Hakiman`
    return () => { document.title = 'The Hakiman — Ayurvedic & Unani Remedies' }
  }, [page.name])

  const sel = page.packs?.find((p) => p.id === pack) || null
  // Pack prices come from the design (some are still placeholders); the cart
  // itself always charges the catalog price per jar.
  const selPrice = sel ? sel.price : formatPrice(product.price * qty)
  const units = (sel ? sel.jars : 1) * qty

  const addToCart = () => {
    add(product, units)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }
  const buyNow = () => {
    // The mobile design has no quantity stepper, so a mobile buy is one pack.
    add(product, sel ? sel.jars * (m ? 1 : qty) : m ? 1 : qty, { openDrawer: false })
    navigate('/checkout')
  }
  const buy = { pack, setPack, qty, setQty, selPrice: m && !sel ? page.price : selPrice, addToCart, buyNow, added }

  return (
    <div ref={root} className="hk-pdp" style={sx("font-family: 'Manrope', system-ui, sans-serif; color: #2B1A11; background: #FBF5EC; min-height: 100%; display: flex; flex-direction: column")}>
      <PdpHeader m={m} announce={page.announce} />

      <div style={sx('flex: 1')}>
        {!m && (
          <nav aria-label="Breadcrumb" style={sx('max-width: 1280px; margin: 0 auto; padding: 16px 24px 0; font-size: 13px; color: #6A5244; width: 100%; box-sizing: border-box')}>
            <Link to="/" style={sx('color: #6A5244; text-decoration: none')}>Home</Link> <span aria-hidden="true">/</span> <Link to={page.crumbTo} style={sx('color: #6A5244; text-decoration: none')}>{page.crumb}</Link> <span aria-hidden="true">/</span> <span aria-current="page" style={sx('color: #2B1A11; font-weight: 600')}>{page.name}</span>
          </nav>
        )}

        {m ? (
          <>
            <MobileTop page={page} buy={buy} />
            {page.featured ? (
              <>
                <MobileWhenToUse page={page} />
                <MobileHowToUse page={page} />
                <Reels page={page} m />
                <Ingredients page={page} m />
                <Compare page={page} m />
                <Heritage page={page} m />
                <Reviews page={page} m />
              </>
            ) : (
              <>
                <div style={sx('padding: 28px 16px 0')}><Accordions items={page.accordions} m /></div>
                <BenefitStrip page={page} m />
                <Highlights page={page} m />
              </>
            )}
            <Faq page={page} m />
            <FinalOffer page={page} m buyNow={buyNow} />
            <CrossSell page={page} m />
          </>
        ) : (
          <>
            <DesktopTop page={page} buy={buy} />
            <BenefitStrip page={page} />
            {page.featured ? (
              <>
                <WhenToUse page={page} buyNow={buyNow} />
                <Reels page={page} />
                <Ingredients page={page} />
                <HowToUse page={page} />
                <Compare page={page} />
                <Heritage page={page} />
                <Reviews page={page} />
              </>
            ) : (
              <Highlights page={page} />
            )}
            <Faq page={page} />
            <FinalOffer page={page} buyNow={buyNow} />
            <CrossSell page={page} />
          </>
        )}
      </div>

      <PdpFooter m={m} />
      <StickyBar page={page} m={m} sel={sel} selPrice={buy.selPrice} buyNow={buyNow} show={barShown} />
    </div>
  )
}
