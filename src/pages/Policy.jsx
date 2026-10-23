import { Link, NavLink, useParams } from 'react-router-dom'
import policies from '../data/policies.json'
import NotFound from './NotFound'

const LABELS = { shipping: 'Shipping', refunds: 'Returns & Refunds', privacy: 'Privacy', terms: 'Terms' }

export default function Policy() {
  const { key } = useParams()
  const doc = policies[key]
  if (!doc) return <NotFound />

  return (
    <div className="page">
      <section className="page-hero page-hero--compact">
        <div className="container">
          <p className="eyebrow">{doc.eyebrow}</p>
          <h1>{doc.title}</h1>
          <p className="page-hero__lede">{doc.intro}</p>
          <p className="fine">{doc.updated}</p>
        </div>
      </section>
      <section className="container policy">
        <nav className="policy__nav" aria-label="Policies">
          {Object.keys(policies).map((k) => (
            <NavLink key={k} to={`/policies/${k}`}>{LABELS[k]}</NavLink>
          ))}
        </nav>
        <article className="prose policy__body">
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p) => {
                const [lead, ...rest] = p.split(': ')
                return rest.length && lead.length < 40 ? (
                  <p key={p}><strong>{lead}:</strong> {rest.join(': ')}</p>
                ) : (
                  <p key={p}>{p}</p>
                )
              })}
            </section>
          ))}
          <p className="fine">Questions? <Link to="/contact">Contact Hakiman Remedies</Link>.</p>
        </article>
      </section>
    </div>
  )
}
