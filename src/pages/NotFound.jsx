import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page container checkout-empty">
      <p className="eyebrow">404</p>
      <h1>This page could not be found</h1>
      <p>The link may be outdated. Explore the collection instead.</p>
      <Link to="/shop" className="btn btn--primary">Shop all remedies</Link>
    </div>
  )
}
