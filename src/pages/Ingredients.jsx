import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ingredientGroups, ingredientsNotPublished } from '../data/ingredients'
import { getProduct, shortTitle } from '../lib/catalog'
import { useReveal } from '../lib/motion'

const PASHOYA = 'pashoya-pain-salt-joint-support-amp-amp-amp-amp-natural-body-detox-salt-250-g-'
const GROUP_IMAGE = {
  minerals: () => getProduct(PASHOYA).images[1],
  oils: () => getProduct(PASHOYA).highlights[1].image,
  herbs: () => getProduct('cystorita-syrup').images[2],
  skin: () => getProduct('haldi-chandan-hand-made-soap-1').images[2],
}

export default function Ingredients() {
  const root = useRef(null)
  useReveal(root)

  return (
    <div ref={root} className="page">
      <section className="page-hero page-hero--compact">
        <div className="container">
          <p className="eyebrow">Explore Ingredients</p>
          <h1>What goes into a Hakiman remedy</h1>
          <p className="page-hero__lede">
            Every ingredient listed here is named on a Hakiman product page. Follow any ingredient to the products that contain it.
          </p>
        </div>
      </section>

      {ingredientGroups.map((g, gi) => {
        const img = GROUP_IMAGE[g.id]()
        return (
          <section key={g.id} className={`section ing ${gi % 2 ? 'ing--alt' : ''}`} id={g.id}>
            <div className="container ing__grid">
              <figure className="ing__media">
                <img data-parallax src={img} alt="" loading="lazy" />
              </figure>
              <div data-reveal>
                <p className="eyebrow">{g.intro}</p>
                <h2>{g.title}</h2>
                <blockquote className="ing__quote">“{g.mention}”</blockquote>
                <ul className="ing__list">
                  {g.items.map((it) => (
                    <li key={it.name}>
                      <span className="ing__name">{it.name}</span>
                      <span className="ing__in">
                        {it.products.map((h) => {
                          const p = getProduct(h)
                          return <Link key={h} to={`/products/${h}`}>{shortTitle(p)}</Link>
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )
      })}

      <section className="section">
        <div className="container note-card" data-reveal>
          <h2>Ingredient lists not yet published</h2>
          <p>The following products do not have a full ingredient list on the brand’s website yet, so none is shown here:</p>
          <ul>
            {ingredientsNotPublished.map((h) => (
              <li key={h}><Link to={`/products/${h}`}>{getProduct(h).title}</Link></li>
            ))}
          </ul>
          <p>For ingredient questions about these products, <Link to="/contact">contact Hakiman Remedies</Link>.</p>
        </div>
      </section>
    </div>
  )
}
