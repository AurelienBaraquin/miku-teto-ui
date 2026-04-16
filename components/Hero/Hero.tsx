'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { useTheme } from '@/contexts/ThemeContext'
import styles from './Hero.module.css'

export default function Hero() {
  const { data } = useTheme()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const decoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
    tl.from(titleRef.current, { y: 120, opacity: 0, skewX: -20, duration: 1 })
      .from(subtitleRef.current, { x: -60, opacity: 0, duration: 0.6 }, '-=0.4')
      .from(ctaRef.current, { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(3)' }, '-=0.3')
      .from(decoRef.current, { opacity: 0, duration: 0.5 }, '-=0.5')
    return () => { tl.kill() }
  }, [])

  const scrollToBio = () => {
    document.querySelector('#bio')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className={`${styles.hero} scanlines`}>
      <div className={styles.bgSlash} aria-hidden="true" />
      <div className={styles.bgSlash2} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.sysLabel} aria-hidden="true">
          <span className={styles.sysLabelDot} />
          <span>{data.sysLabel}</span>
        </div>

        <h1 ref={titleRef} className={styles.title}>
          <span
            className={`glitch-text ${styles.titleMain}`}
            data-text={data.titleMain}
          >
            {data.titleMain}
          </span>
          <br />
          <span className={styles.titleSub}>{data.titleSub}</span>
        </h1>

        <div ref={subtitleRef} className={styles.subtitleBlock}>
          <div className={`trapeze ${styles.subtitleInner}`}>
            <span className={styles.subtitleText}>{data.subtitleText}</span>
          </div>
        </div>

        <button
          ref={ctaRef}
          id="hero-cta"
          className={styles.cta}
          onClick={scrollToBio}
          data-cursor="true"
        >
          <span className={styles.ctaText}>{data.ctaText}</span>
          <span className={styles.ctaArrow}>▶</span>
        </button>

        <div ref={decoRef} className={styles.statsRow}>
          {data.stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.mikuContainer}>
        <div className={styles.mikuGlow} aria-hidden="true" />
        <Image
          key={data.gifDance}
          src={data.gifDance}
          alt={`${data.name} dansant`}
          width={400}
          height={400}
          className={styles.mikuGif}
          priority
          unoptimized
        />
        <div className={styles.mikuFrame} aria-hidden="true">
          <span className={styles.mikuFrameLabel}>UNIT {data.name === 'MIKU' ? '01' : '02'} {'//'} ACTIVE</span>
        </div>
      </div>

      <div className={styles.stickerFloat}>
        <Image
          key={data.gifSticker}
          src={data.gifSticker}
          alt={`${data.name} sticker`}
          width={120}
          height={120}
          className={styles.sticker}
          unoptimized
        />
      </div>

      <div className={styles.scrollIndicator}>
        <span className={styles.scrollText}>SCROLL</span>
        <div className={styles.scrollLine} />
      </div>

      <div className={styles.cornerTL} aria-hidden="true">{data.cornerTL}</div>
      <div className={styles.cornerBR} aria-hidden="true">v{data.name === 'MIKU' ? '3.0.0' : '6.6.6'} {'//'} 2024</div>
    </section>
  )
}
