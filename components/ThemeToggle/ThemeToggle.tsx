'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { useTheme } from '@/contexts/ThemeContext'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const btnRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    const overlay = overlayRef.current
    const btn = btnRef.current
    if (!overlay || !btn) return

    // Pulse the button
    gsap.fromTo(btn,
      { scale: 1 },
      { scale: 0.88, duration: 0.08, yoyo: true, repeat: 1, ease: 'power2.inOut' }
    )

    // Full-screen wipe transition
    gsap.timeline()
      .set(overlay, { display: 'block' })
      .fromTo(overlay,
        { clipPath: 'circle(0% at 50% 50%)' },
        { clipPath: 'circle(150% at 50% 50%)', duration: 0.55, ease: 'power3.in' }
      )
      .call(() => toggleTheme())
      .to(overlay,
        { clipPath: 'circle(0% at 50% 50%)', duration: 0.45, ease: 'power3.out' }
      )
      .set(overlay, { display: 'none' })
  }

  const nextTheme = theme === 'miku' ? 'TETO' : 'MIKU'
  const label = `Switch to ${nextTheme} theme`

  return (
    <>
      {/* Full-screen transition overlay */}
      <div
        ref={overlayRef}
        className={styles.transitionOverlay}
        aria-hidden="true"
        style={{ display: 'none' }}
        data-theme-next={nextTheme.toLowerCase()}
      />

      <button
        ref={btnRef}
        id="theme-toggle"
        className={styles.btn}
        onClick={handleClick}
        aria-label={label}
        title={label}
        data-cursor="true"
      >
        <Image
          src="/gifs/miku-teto-transition.gif"
          alt={label}
          width={64}
          height={64}
          className={styles.gif}
          unoptimized
          priority
        />
        <div className={styles.label}>
          <span className={styles.labelCurrent}>{theme.toUpperCase()}</span>
          <span className={styles.labelArrow}>→</span>
          <span className={styles.labelNext}>{nextTheme}</span>
        </div>
        {/* Pulse ring */}
        <div className={styles.ring} aria-hidden="true" />
      </button>
    </>
  )
}
