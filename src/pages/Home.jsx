import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { brand, serviceFacts, story } from '../data/brand'
import { getCategories, getProduct, getProducts } from '../lib/catalog'
import { gsap, prefersReducedMotion, useReveal } from '../lib/motion'
import ProductCard from '../components/ProductCard'
import ReelStrip from '../components/ReelStrip'
import Icon from '../components/Icon'

const PASHOYA = 'pashoya-pain-salt-joint-support-amp-amp-amp-amp-natural-body-detox-salt-250-g-'

export default function Home() {
  const root = useRef(null)
  const products = getProducts()
  const categories = getCategories()
  const [filter, setFilter] = useState('all')
  const shown = useMemo(() => (filter === 'all' ? products : products.filter((p) => p.category === filter)), [filter, products])
  const pashoya = getProduct(PASHOYA)
  const neem = getProduct('neem-hand-made-soap')
  const syrup = getProduct('cystorita-syrup')
  const haldi = getProduct('haldi-chandan-hand-made-soap-1')

  useReveal(root)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero__line > span', { yPercent: 105, duration: 1.1, stagger: 0.1 })
        .from('.hero__lede, .hero__ctas', { y: 18, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.6')
        .from('.hero__frame', { clipPath: 'inset(100% 0 0 0)', duration: 1.3, stagger: 0.14, ease: 'expo.out' }, 0.15)
        .from('.hero__frame img', { scale: 1.25, duration: 1.6, stagger: 0.14, ease: 'expo.out' }, 0.15)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root}>
      {/* B. Hero */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">Ayurvedic &amp; Unani remedies · Lucknow</p>
            <h1 className="hero__title">
              <span className="hero__line"><span>A Legacy of</span></span>
              <span className="hero__line"><span><em>Herbal</em> Healing</span></span>
            </h1>
            <p className="hero__lede">{story.lede}</p>
            <div className="hero__ctas">
              <Link to="/shop" className="btn btn--primary btn--lg">
                Explore the Collection <Icon name="arrow" size={18} />
              </Link>
              <Link to="/our-story" className="btn btn--ghost btn--lg">Discover Our Story</Link>
            </div>
          </div>
          <div className="hero__art" aria-hidden="true">
            <figure className="hero__frame hero__frame--a"><img src={neem.images[1]} alt="" fetchPriority="high" /></figure>
            <figure className="hero__frame hero__frame--b"><img src={syrup.images[0]} alt="" /></figure>
            <figure className="hero__frame hero__frame--c"><img src={haldi.images[0]} alt="" /></figure>
            <img className="hero__seal" src={brand.emblem} alt="" />
          </div>
        </div>
      </section>

      {/* C. Educational discovery */}
      <section className="section discover">
        <div className="container">
          <header className="section-head" data-reveal>
            <p className="eyebrow">Begin here</p>
            <h2>Find your way through the apothecary</h2>
          </header>
          <div className="discover__grid" data-reveal data-reveal-stagger>
            <Link to="/shop" className="discover__tile">
              <span className="discover__num">01</span>
              <h3>Explore the collection</h3>
              <p>{products.length} remedies across soaps, syrups, capsules and a mineral bath salt.</p>
              <span className="discover__go">Shop all <Icon name="arrow" size={16} /></span>
            </Link>
            <Link to="/ingredients" className="discover__tile">
              <span className="discover__num">02</span>
              <h3>Understand the ingredients</h3>
              <p>From Neem and Chandan to Sajji Khar — see every published ingredient and where it is used.</p>
              <span className="discover__go">Ingredient index <Icon name="arrow" size={16} /></span>
            </Link>
            <Link to="/learn" className="discover__tile">
              <span className="discover__num">03</span>
              <h3>Choose by format</h3>
              <p>Not sure where to start? Compare each product type and how it fits into a daily routine.</p>
              <span className="discover__go">Product guide <Icon name="arrow" size={16} /></span>
            </Link>
            <Link to="/contact" className="discover__tile">
              <span className="discover__num">04</span>
              <h3>Speak with a Hakim</h3>
              <p>In-person consultations in Lucknow, {brand.contact.hours.replace(' | ', ', ')}.</p>
              <span className="discover__go">Book a consultation <Icon name="arrow" size={16} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* D. Shop by collection */}
      <section className="section collection" id="collection">
        <div className="container">
          <header className="section-head section-head--split" data-reveal>
            <div>
              <p className="eyebrow">Our Complete Range</p>
              <h2>Holistic essentials for daily well-being.</h2>
            </div>
            <div className="chips" role="tablist" aria-label="Filter by category">
              <button role="tab" aria-selected={filter === 'all'} className="chip" onClick={() => setFilter('all')}>
                All <span>{products.length}</span>
              </button>
              {categories.map((c) => (
                <button key={c.id} role="tab" aria-selected={filter === c.id} className="chip" onClick={() => setFilter(c.id)}>
                  {c.label} <span>{c.count}</span>
                </button>
              ))}
            </div>
          </header>
          <div className="product-grid product-grid--editorial">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="center" data-reveal>
            <Link to="/shop" className="btn btn--outline">View all products <Icon name="arrow" size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Featured ritual — the source homepage's own PASHOYA hero banner */}
      <section className="section feature">
        <div className="container">
          <Link to={`/products/${PASHOYA}`} className="feature__banner" data-reveal aria-label={`Shop ${pashoya.title}`}>
            <img src="/assets/hero1.webp" alt="PASHOYA Pain Salt — Natural Bath Ritual. Soak, Relax, Rejuvenate." loading="lazy" width="2172" height="724" />
          </Link>
          <div className="feature__steps" data-reveal data-reveal-stagger>
            <div>
              <span className="feature__k">Ritual</span>
              <p>{pashoya.usageInstructions}</p>
            </div>
            <div>
              <span className="feature__k">Inside</span>
              <p>{pashoya.ingredients}</p>
            </div>
            <div className="feature__cta">
              <span className="feature__k">{pashoya.badge}</span>
              <Link to={`/products/${PASHOYA}`} className="btn btn--primary">Shop PASHOYA <Icon name="arrow" size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* E. Brand story */}
      <section className="section story-band">
        <div className="container story-band__grid">
          <div className="story-band__media">
            <img data-parallax src={neem.images[0]} alt="Hakiman Neem Hand Made Soap" loading="lazy" />
          </div>
          <div className="story-band__copy" data-reveal>
            <p className="eyebrow eyebrow--light">Our Story &amp; Heritage</p>
            <h2>Treating every patron like family.</h2>
            <p>{story.paragraphs[0]}</p>
            <blockquote>“{story.quote}”</blockquote>
            <ul className="pillars" data-reveal-stagger>
              {story.pillars.map((p) => (
                <li key={p.title}>{p.title}</li>
              ))}
            </ul>
            <Link to="/our-story" className="btn btn--light">Discover Our Story <Icon name="arrow" size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Brand reels from the source site */}
      <ReelStrip />

      {/* F. Learn & explore */}
      <section className="section learn-teaser">
        <div className="container">
          <header className="section-head section-head--split" data-reveal>
            <div>
              <p className="eyebrow">Learn &amp; Explore</p>
              <h2>The Hakiman field notes</h2>
            </div>
            <Link to="/learn" className="btn btn--outline">Visit Learn <Icon name="arrow" size={16} /></Link>
          </header>
          <div className="mag" data-reveal data-reveal-stagger>
            <Link to="/learn#guide" className="mag__item mag__item--lead">
              <img src={pashoya.images[2]} alt="" loading="lazy" />
              <div>
                <span className="tag">Product guide</span>
                <h3>Soaps, syrups, capsules or a soak? Choosing by format</h3>
              </div>
            </Link>
            <Link to="/ingredients" className="mag__item">
              <img src={haldi.highlights[0].image} alt="" loading="lazy" />
              <div>
                <span className="tag">Ingredients</span>
                <h3>Haldi, Chandan, Neem and the botanicals in our soaps</h3>
              </div>
            </Link>
            <Link to="/learn#ritual" className="mag__item">
              <img src={pashoya.highlights[2].image} alt="" loading="lazy" />
              <div>
                <span className="tag">Ritual</span>
                <h3>Simple self-care in minutes: the PASHOYA soak</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* G. Trust */}
      <section className="section trust">
        <div className="container">
          <div className="trust__grid" data-reveal data-reveal-stagger>
            {serviceFacts.map((f) => (
              <div key={f.label} className="trust__item">
                <Icon name="leaf" size={22} />
                <h3>{f.label}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
          <div className="reviews-empty" data-reveal>
            <p className="eyebrow">Customer reviews</p>
            <h2>No reviews yet.</h2>
            <p>We only publish genuine reviews from verified customers. Tried a Hakiman remedy? Your experience will appear here once reviews open.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
