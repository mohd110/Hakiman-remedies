import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Story from './pages/Story'
import Ingredients from './pages/Ingredients'
import Learn from './pages/Learn'
import Contact from './pages/Contact'
import Policy from './pages/Policy'
import Checkout from './pages/Checkout'
import Account from './pages/Account'
import NotFound from './pages/NotFound'
import { ScrollTrigger } from './lib/motion'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    // Layout changes between routes; let triggers re-measure after paint.
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [pathname])
  return null
}

export default function App() {
  // Product pages carry their own header and footer from the product-page design.
  const isProduct = useLocation().pathname.startsWith('/products/')
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollToTop />
      {!isProduct && <Header />}
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:handle" element={<Product />} />
          <Route path="/our-story" element={<Story />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/policies/:key" element={<Policy />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isProduct && <Footer />}
      <CartDrawer />
    </>
  )
}
