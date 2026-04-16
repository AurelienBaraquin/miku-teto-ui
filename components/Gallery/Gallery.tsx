'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTheme } from '@/contexts/ThemeContext'
import styles from './Gallery.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export interface Track {
  id: string
  title: string
  artist: string
  year: string
  audioPath?: string
  coverColor: string
  accent: string
  rotation: number
}

interface TrackCardProps {
  track: Track
  index: number
  isActive: boolean
  onClick: () => void
}

function TrackCard({ track, index, isActive, onClick }: TrackCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      id={`track-card-${track.id}`}
      className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
      style={{
        '--card-color': track.coverColor,
        '--card-accent': track.accent,
        '--card-rotation': `${track.rotation}deg`,
      } as React.CSSProperties}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor="true"
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className={styles.cardBg} />

      <div className={styles.coverArt}>
        <div className={styles.coverPattern} aria-hidden="true" />
        <div className={styles.coverNum}>
          {String(index + 1).padStart(2, '0')}
        </div>
        {(isActive || isHovered) && (
          <div className={styles.playIcon}>▶</div>
        )}
      </div>

      <div className={styles.cardInfo}>
        <span className={styles.cardYear}>{track.year}</span>
        <h3 className={styles.cardTitle}>{track.title}</h3>
        <p className={styles.cardArtist}>{track.artist}</p>
        {track.audioPath ? (
          <span className={styles.audioReady}>♪ AUDIO READY</span>
        ) : (
          <span className={styles.audioMissing}>⬡ ADD AUDIO PATH</span>
        )}
      </div>

      <div className={styles.cornerCut} aria-hidden="true" />
      {isActive && <div className={styles.cardGlow} aria-hidden="true" />}
    </div>
  )
}

export default function Gallery() {
  const { data } = useTheme()
  const tracks = data.tracks
  const sectionRef = useRef<HTMLElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  // Bug fix: null = nothing selected, not 0
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef(0)
  const scrollStartRef = useRef(0)
  const didDragRef = useRef(false)

  // Reset selection when theme/tracks change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(null)
  }, [data.name])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 60, opacity: 0, duration: 0.8, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
      const cards = sliderRef.current?.querySelectorAll('[id^="track-card"]')
      if (cards) {
        gsap.from(cards, {
          y: 80, opacity: 0,
          rotation: (i) => tracks[i]?.rotation ?? 0,
          stagger: 0.1, duration: 0.6, ease: 'back.out(2)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 50%' },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [tracks])

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    didDragRef.current = false
    dragStartRef.current = e.clientX
    scrollStartRef.current = sliderRef.current?.scrollLeft ?? 0
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return
    const dx = e.clientX - dragStartRef.current
    if (Math.abs(dx) > 4) didDragRef.current = true
    sliderRef.current.scrollLeft = scrollStartRef.current - dx
  }

  const onMouseUp = () => { setIsDragging(false) }

  const navigate = (dir: 'prev' | 'next') => {
    const current = activeIndex ?? 0
    const newIndex = dir === 'next'
      ? Math.min(current + 1, tracks.length - 1)
      : Math.max(current - 1, 0)
    setActiveIndex(newIndex)
    const cardWidth = 300
    if (sliderRef.current) {
      gsap.to(sliderRef.current, {
        scrollLeft: newIndex * (cardWidth + 24),
        duration: 0.5,
        ease: 'power3.out',
      })
    }
  }

  const handleCardClick = (i: number) => {
    if (didDragRef.current) return
    setActiveIndex(prev => prev === i ? null : i)
  }

  const displayIndex = activeIndex ?? 0

  return (
    <section id="gallery" ref={sectionRef} className={styles.gallery}>
      <div className={styles.bgAccent} aria-hidden="true">
        {data.name === 'TETO' ? 'CHIMERA' : 'ARCHIVE'}
      </div>

      <div ref={titleRef} className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelBar} />
            <span className={styles.labelText}>MUSIC ARCHIVE</span>
          </div>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleLine}>
              {data.name === 'TETO' ? 'CHIMERA' : 'SOUND'}
            </span>
            <br />
            <span className={styles.titleLineSub}>
              {data.name === 'TETO' ? 'DATABASE' : 'DATABASE'}
            </span>
          </h2>
        </div>

        <div className={styles.controls}>
          <button
            id="gallery-prev"
            className={styles.controlBtn}
            onClick={() => navigate('prev')}
            disabled={displayIndex === 0}
            aria-label="Track précédent"
          >◀</button>
          <span className={styles.controlCount}>
            {String(displayIndex + 1).padStart(2, '0')} / {String(tracks.length).padStart(2, '0')}
          </span>
          <button
            id="gallery-next"
            className={styles.controlBtn}
            onClick={() => navigate('next')}
            disabled={displayIndex === tracks.length - 1}
            aria-label="Track suivant"
          >▶</button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className={`${styles.slider} ${isDragging ? styles.sliderDragging : ''}`}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        role="list"
        aria-label="Liste des tracks"
      >
        {tracks.map((track, i) => (
          <div key={track.id} className={styles.cardWrapper} role="listitem">
            <TrackCard
              track={track}
              index={i}
              isActive={i === activeIndex}
              onClick={() => handleCardClick(i)}
            />
          </div>
        ))}
      </div>

      {/* Active bar — only show when something is selected */}
      {activeIndex !== null && (
        <div className={styles.activeBar}>
          <div className={`trapeze ${styles.activeBarInner}`}>
            <span className={styles.activeBarLabel}>NOW PLAYING //</span>
            <span className={styles.activeBarTitle}>{tracks[activeIndex].title}</span>
            <span className={styles.activeBarYear}>{tracks[activeIndex].year}</span>
          </div>
        </div>
      )}

      <div className={styles.instructions}>
        <span>← DRAG TO BROWSE →</span>
        <span>{'//'} CLICK TO SELECT {'//'}</span>
        <span>AUDIO PATH: MANUALLY CONFIGURABLE</span>
      </div>
    </section>
  )
}
