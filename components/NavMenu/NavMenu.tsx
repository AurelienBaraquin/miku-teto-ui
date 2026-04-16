'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useTheme } from '@/contexts/ThemeContext'
import styles from './NavMenu.module.css'

export default function NavMenu() {
  const { data } = useTheme()
  const [open, setOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLLIElement[]>([])
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return
    tlRef.current = gsap.timeline({ paused: true })
    tlRef.current
      .fromTo(overlay,
        { clipPath: 'polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)', pointerEvents: 'none' },
        { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', pointerEvents: 'all', duration: 0.5, ease: 'power4.inOut' }
      )
      .fromTo(itemsRef.current,
        { x: -80, opacity: 0, skewX: -20 },
        { x: 0, opacity: 1, skewX: 0, stagger: 0.08, duration: 0.4, ease: 'back.out(3)' },
        '-=0.2'
      )
    return () => { tlRef.current?.kill() }
  }, [])

  useEffect(() => {
    if (!tlRef.current) return
    if (open) tlRef.current.play()
    else tlRef.current.reverse()
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleNavClick = (href: string) => {
    setOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  const protocolName = `${data.name}_PROTOCOL`

  return (
    <>
      <button
        id="nav-toggle"
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        <span className={styles.triggerBar} />
        <span className={styles.triggerBar} />
        <span className={styles.triggerBar} />
        <span className={styles.triggerLabel}>MENU</span>
      </button>

      <div ref={overlayRef} className={styles.overlay} role="dialog" aria-modal="true" aria-label="Navigation">
        <div className={styles.cornerDeco} aria-hidden="true">
          <span className={styles.cornerText}>{protocolName}</span>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.list}>
            {data.navItems.map((item, i) => (
              <li
                key={item.label}
                ref={el => { if (el) itemsRef.current[i] = el }}
                className={styles.item}
              >
                <button
                  id={`nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={styles.link}
                  onClick={() => handleNavClick(item.href)}
                >
                  <span className={styles.linkNum}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.linkText}>{item.label}</span>
                  <span className={styles.linkArrow}>▶</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button
          id="nav-close"
          className={styles.close}
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        >
          ✕ CLOSE
        </button>

        <div className={styles.bottomDeco} aria-hidden="true">
          <div className={styles.statusLine}>
            <span>SYS STATUS</span>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>ONLINE</span>
          </div>
        </div>
      </div>
    </>
  )
}
