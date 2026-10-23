import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/motion'

// The brand's own reels from the source homepage ("Reels & Spotlights").
const REELS = ['Video-49432', 'Video-1938', 'Video-93220', 'Video-18525', 'Video-82012', 'Video-19780']

function Reel({ id }) {
  const ref = useRef(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!v.src) v.src = `/assets/reel/${id}.mp4`
          if (!prefersReducedMotion()) v.play().catch(() => {})
        } else {
          v.pause()
        }
      },
      { rootMargin: '200px 0px', threshold: 0.25 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [id])

  return (
    <div className="reel">
      <video ref={ref} muted loop playsInline preload="none" controls={prefersReducedMotion()} aria-label="Hakiman product reel" />
    </div>
  )
}

export default function ReelStrip() {
  return (
    <section className="section reels" aria-labelledby="reels-title">
      <div className="container">
        <header className="section-head" data-reveal>
          <p className="eyebrow">Live Showcase</p>
          <h2 id="reels-title">Reels &amp; Spotlights</h2>
        </header>
      </div>
      <div className="reels__track" tabIndex={0} aria-label="Scrollable reels">
        {REELS.map((id) => (
          <Reel key={id} id={id} />
        ))}
      </div>
    </section>
  )
}
