'use client'

import { useEffect, useRef } from 'react'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const followerPosRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const isHoveringRef = useRef(false)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
    }

    const onEnter = () => { isHoveringRef.current = true }
    const onLeave = () => { isHoveringRef.current = false }

    const interactables = document.querySelectorAll('a, button, [data-cursor]')
    interactables.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    window.addEventListener('mousemove', onMove)

    // Observe new interactables via MutationObserver
    const observer = new MutationObserver(() => {
      const newEls = document.querySelectorAll('a, button, [data-cursor]')
      newEls.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    const animate = () => {
      const { x, y } = posRef.current
      const fp = followerPosRef.current
      
      // Cursor snaps instantly
      cursor.style.transform = `translate(${x - 8}px, ${y - 8}px) ${isHoveringRef.current ? 'scale(0)' : 'scale(1)'}`

      // Follower lerps — faster for snappier feel
      fp.x += (x - fp.x) * 0.35
      fp.y += (y - fp.y) * 0.35
      follower.style.transform = `translate(${fp.x - 24}px, ${fp.y - 24}px) ${isHoveringRef.current ? 'scale(1.5) rotate(45deg)' : 'scale(1) rotate(0deg)'}`
      follower.style.borderColor = isHoveringRef.current ? 'var(--clr-magenta)' : 'var(--clr-cyan)'
      follower.style.boxShadow = isHoveringRef.current
        ? '0 0 12px var(--clr-magenta)'
        : '0 0 8px var(--clr-cyan)'

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* Triangle cursor */}
      <div ref={cursorRef} className={styles.cursor}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <polygon points="8,1 15,15 1,15" fill="var(--clr-cyan)" />
        </svg>
      </div>
      {/* Follower crosshair */}
      <div ref={followerRef} className={styles.follower}>
        <span className={styles.cross} />
      </div>
    </>
  )
}
