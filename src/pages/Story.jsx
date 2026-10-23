import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { brand, story } from '../data/brand'
import { getProduct } from '../lib/catalog'
import { useReveal } from '../lib/motion'
import Icon from '../components/Icon'

export default function Story() {
  const root = useRef(null)
  useReveal(root)
  const haldi = getProduct('haldi-chandan-hand-made-soap-1')
  const neem = getProduct('neem-hand-made-soap')

  return (
    <div ref={root} className="page">
      <section className="page-hero">
        <div className="container page-hero__split">
          <div data-reveal>
            <p className="eyebrow">Our Story &amp; Heritage</p>
            <h1>{story.title}</h1>
            <p className="page-hero__lede">{story.lede}</p>
          </div>
          <img src={brand.emblem} alt="The Hakiman emblem" className="page-hero__emblem" width="500" height="500" />
        </div>
      </section>

      <section className="section">
        <div className="container story-cols">
          <figure className="story-cols__media">
            <img data-parallax src={haldi.images[0]} alt="Hakiman Haldi Chandan Hand Made Soap" loading="lazy" />
          </figure>
          <div className="prose" data-reveal>
            {story.paragraphs.map((p) => <p key={p}>{p}</p>)}
            <blockquote>“{story.quote}”</blockquote>
            <h3>{story.authentic.title}</h3>
            <p>{story.authentic.text}</p>
          </div>
        </div>
      </section>

      <section className="section section--sage">
        <div className="container">
          <header className="section-head" data-reveal>
            <p className="eyebrow">Philosophy</p>
            <h2>The Pillars of Our Philosophy</h2>
          </header>
          <div className="pillar-grid" data-reveal data-reveal-stagger>
            {story.pillars.map((p, i) => (
              <article key={p.title} className="pillar">
                <span className="pillar__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container promise">
          <img src={neem.images[2]} alt="Hakiman Neem Hand Made Soap" loading="lazy" />
          <div data-reveal>
            <p className="eyebrow">{story.promise.title}</p>
            <p className="promise__text">{story.promise.text}</p>
            <div className="hero__ctas">
              <Link to="/shop" className="btn btn--primary">Explore Our Remedies <Icon name="arrow" size={16} /></Link>
              <Link to="/contact" className="btn btn--ghost">Book Consultation</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
