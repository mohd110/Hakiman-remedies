import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Scroll reveals for everything marked [data-reveal] inside `scope`.
// Content is visible by default; motion is only layered on when allowed.
export function useReveal(scope, deps = []) {
  useLayoutEffect(() => {
    if (!scope.current || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        const stagger = el.hasAttribute('data-reveal-stagger')
        gsap.from(stagger ? el.children : el, {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: stagger ? 0.08 : 0,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
      })
      gsap.utils.toArray('[data-parallax]').forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.12 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
        )
      })
    }, scope)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export { gsap, ScrollTrigger }
