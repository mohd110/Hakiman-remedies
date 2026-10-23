import { useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { journal, publishedEntries } from '../data/journal'
import { formatPrice, getCategories, getProduct, getProducts, shortTitle } from '../lib/catalog'
import { useReveal } from '../lib/motion'
import Icon from '../components/Icon'

const PASHOYA = 'pashoya-pain-salt-joint-support-amp-amp-amp-amp-natural-body-detox-salt-250-g-'

export default function Learn() {
  const root = useRef(null)
  const [params] = useSearchParams()
  const preview = params.get('preview') === 'drafts'
  const entries = publishedEntries()
  const pashoya = getProduct(PASHOYA)
  useReveal(root)

  return (
    <div ref={root} className="page">
      <section className="page-hero page-hero--compact">
        <div className="container">
          <p className="eyebrow">Learn &amp; Explore</p>
          <h1>Insights, rituals, and remedies for a balanced lifestyle.</h1>
          <p className="page-hero__lede">Guides built from Hakiman’s published product information. Content on this website is for general information and educational purposes only and should not replace professional medical advice.</p>
        </div>
      </section>

      {/* Product guide by format */}
      <section className="section" id="guide">
        <div className="container">
          <header className="section-head" data-reveal>
            <p className="eyebrow">Product guide</p>
            <h2>Choosing by format</h2>
          </header>
          <div className="guide" data-reveal data-reveal-stagger>
            {getCategories().map((c) => (
              <article key={c.id} className="guide__row">
                <img src={c.cover} alt="" loading="lazy" />
                <div className="guide__head">
                  <h3>{c.label}</h3>
                  <p>{c.blurb}</p>
                </div>
                <ul className="guide__products">
                  {getProducts().filter((p) => p.category === c.id).map((p) => (
                    <li key={p.id}>
                      <Link to={`/products/${p.handle}`}>
                        <strong>{shortTitle(p)}</strong>
                        <span>{p.features.find((f) => /pack|capsules|ml/i.test(f)) || p.features[0]}</span>
                      </Link>
                      <span className="guide__price">{formatPrice(p.price)}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Ritual */}
      <section className="section section--sage" id="ritual">
        <div className="container ritual">
          <img data-reveal src={pashoya.highlights[2].image} alt={pashoya.highlights[2].title} loading="lazy" />
          <div data-reveal>
            <p className="eyebrow">Ritual</p>
            <h2>{pashoya.highlights[2].title}</h2>
            <ol className="ritual__steps">
              <li><span>1</span>Add 2–4 tablespoons of PASHOYA Pain Salt to warm water.</li>
              <li><span>2</span>Soak your feet or body for 15–20 minutes.</li>
              <li><span>3</span>Relax and enjoy the soothing experience.</li>
            </ol>
            <p className="fine">Directions as published on the <Link to={`/products/${PASHOYA}`}>PASHOYA product page</Link>.</p>
          </div>
        </div>
      </section>

      {/* Journal */}
      <section className="section" id="journal">
        <div className="container">
          <header className="section-head" data-reveal>
            <p className="eyebrow">Ayurvedic Journal</p>
            <h2>From the journal</h2>
          </header>
          {entries.length === 0 && (
            <div className="empty-state" data-reveal>
              <h3>No journal entries yet</h3>
              <p>New articles from Hakiman Remedies will appear here. Meanwhile, explore the ingredients behind each remedy.</p>
              <Link to="/ingredients" className="btn btn--outline">Explore Ingredients <Icon name="arrow" size={16} /></Link>
            </div>
          )}

          {preview && (
            <div className="note-card note-card--draft">
              <h3>Draft outlines — awaiting brand approval</h3>
              <p>Visible only in preview mode. These are topics, not articles; copy must be written and approved by Hakiman Remedies.</p>
              <ul>
                {journal.filter((e) => e.status === 'draft').map((e) => (
                  <li key={e.slug}><span className="demo-tag">draft</span> {e.title} <small>· {e.category}</small></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container note-card" data-reveal>
          <h2>Need personal guidance?</h2>
          <p>Our consultations focus on individual constitutions to provide holistic wellness guidance tailored to your needs.</p>
          <Link to="/contact" className="btn btn--primary">Book Consultation <Icon name="arrow" size={16} /></Link>
        </div>
      </section>
    </div>
  )
}
