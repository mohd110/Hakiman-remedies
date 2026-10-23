import { useRef, useState } from 'react'
import { brand, contactCopy } from '../data/brand'
import { useReveal } from '../lib/motion'
import Icon from '../components/Icon'

export default function Contact() {
  const root = useRef(null)
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [error, setError] = useState('')
  const c = brand.contact
  useReveal(root)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  // Mirrors the source site's contact form: it opens WhatsApp with a prefilled message.
  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !/^[+\d\s-]{8,}$/.test(form.phone.trim()) || !form.message.trim()) {
      setError('Please add your name, a valid phone number and a message.')
      return
    }
    setError('')
    const text = `Name: ${form.name}\nPhone: ${form.phone}\n\n${form.message}`
    window.open(`https://wa.me/${c.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  return (
    <div ref={root} className="page">
      <section className="page-hero page-hero--compact">
        <div className="container">
          <p className="eyebrow">{contactCopy.eyebrow}</p>
          <h1>{contactCopy.title}</h1>
          <p className="page-hero__lede">{contactCopy.lede}</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact">
          <div className="contact__cards" data-reveal data-reveal-stagger>
            <a className="contact__card" href={c.phoneHref}>
              <Icon name="phone" /> <span>Phone / WhatsApp</span> <strong>{c.phone}</strong>
            </a>
            <a className="contact__card" href={`mailto:${c.email}`}>
              <Icon name="mail" /> <span>Email</span> <strong>{c.email}</strong>
            </a>
            <div className="contact__card">
              <Icon name="pin" /> <span>Company Address</span> <strong>{c.address}</strong>
            </div>
            <div className="contact__card">
              <Icon name="clock" /> <span>Consultation Hours</span> <strong>{c.hours}</strong>
              <small>{c.hoursNote}</small>
            </div>
            <blockquote className="contact__quote">“{contactCopy.quote}”</blockquote>
          </div>

          <form className="contact__form" onSubmit={submit} noValidate data-reveal>
            <h2>{contactCopy.formTitle}</h2>
            <p>{contactCopy.formLede}</p>
            <label className="field-block">
              <span>Full Name *</span>
              <input value={form.name} onChange={set('name')} autoComplete="name" required />
            </label>
            <label className="field-block">
              <span>Phone Number *</span>
              <input value={form.phone} onChange={set('phone')} type="tel" autoComplete="tel" required />
            </label>
            <label className="field-block">
              <span>Message *</span>
              <textarea value={form.message} onChange={set('message')} rows={5} required />
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="btn btn--primary btn--block">Send on WhatsApp</button>
            <p className="fine">Opens WhatsApp with your message addressed to Hakiman Remedies ({c.phone}). Nothing is sent until you press send in WhatsApp.</p>
          </form>
        </div>
      </section>
    </div>
  )
}
