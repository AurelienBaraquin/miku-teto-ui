'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './InkBleed.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const SECTIONS = ['#hero', '#bio', '#gallery', '#miku3d-wrapper']

export default function InkBleed() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)

  const triggerBleed = () => {
    const overlay = overlayRef.current
    if (!overlay || isAnimatingRef.current) return

    isAnimatingRef.current = true
    const tl = gsap.timeline({
      onComplete: () => { isAnimatingRef.current = false }
    })

    // Faster, less screen-covering: a swept stripe rather than full-screen fill
    tl.set(overlay, { display: 'block' })
      .fromTo(overlay,
        { clipPath: 'polygon(0% 45%, 0% 45%, 0% 55%, 0% 55%)' },
        {
          clipPath: 'polygon(0% 42%, 100% 44%, 100% 56%, 0% 58%)',
          duration: 0.22,
          ease: 'power3.in',
        }
      )
      .to(overlay,
        {
          clipPath: 'polygon(0% 42%, 110% 44%, 110% 56%, 0% 58%)',
          duration: 0.18,
          ease: 'none',
        }
      )
      .to(overlay,
        {
          clipPath: 'polygon(100% 42%, 110% 44%, 110% 56%, 100% 58%)',
          duration: 0.22,
          ease: 'power3.out',
        }
      )
      .set(overlay, { display: 'none' })
  }

  useEffect(() => {
    let lastSection = ''

    const triggers = SECTIONS.map(sectionId => {
      return ScrollTrigger.create({
        trigger: sectionId,
        start: 'top 45%',
        onEnter: () => {
          if (sectionId !== lastSection) {
            lastSection = sectionId
            triggerBleed()
          }
        },
        onEnterBack: () => {
          if (sectionId !== lastSection) {
            lastSection = sectionId
            triggerBleed()
          }
        },
      })
    })

    return () => {
      triggers.forEach(t => t.kill())
    }
  }, [])

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      aria-hidden="true"
      style={{ display: 'none' }}
    />
  )
}
