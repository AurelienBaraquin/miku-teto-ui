'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTheme } from '@/contexts/ThemeContext'
import styles from './Bio.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Bio() {
  const { data } = useTheme()
  const sectionRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const specsRef = useRef<HTMLDivElement[]>([])
  const mikuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(panelRef.current, {
        x: -100, opacity: 0, duration: 0.8, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
      gsap.from(specsRef.current, {
        y: 40, opacity: 0, stagger: 0.07, duration: 0.5, ease: 'back.out(2)',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
      })
      gsap.from(mikuRef.current, {
        x: 100, opacity: 0, duration: 0.8, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="bio" ref={sectionRef} className={styles.bio}>
      <div className={styles.bgDeco} aria-hidden="true">
        <span className={styles.bgText}>{data.bioName1.slice(0, 6)}</span>
      </div>

      <div className={styles.inner}>
        {/* Left panel */}
        <div ref={panelRef} className={styles.leftPanel}>
          <div className={styles.sectionLabel}>
            <span className={styles.labelBar} />
            <span className={styles.labelText}>{data.bioUnit}</span>
          </div>

          <h2 className={styles.sectionTitle}>
            <span className={styles.titleLine1}>{data.bioName1}</span>
            <br />
            <span className={styles.titleLine2}>{data.bioName2}</span>
          </h2>

          <div className={`trapeze ${styles.descBox}`}>
            <p className={styles.desc}>{data.bioDesc}</p>
          </div>

          <div className={styles.specsGrid}>
            {data.bioSpecs.map((spec, i) => (
              <div
                key={spec.id}
                id={`spec-${spec.id}`}
                ref={el => { if (el) specsRef.current[i] = el }}
                className={styles.specItem}
              >
                <span className={styles.specLabel}>{spec.label}</span>
                <span className={styles.specValue}>{spec.value}</span>
                {spec.id === 'status' && (
                  <span className={styles.statusBadge}>●</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div ref={mikuRef} className={styles.rightPanel}>
          <div className={`trapeze-reverse ${styles.imageFrame}`}>
            <div className={styles.imageFrameInner}>
              <Image
                key={data.gifHaircopter}
                src={data.gifHaircopter}
                alt={data.bioNameEn}
                width={350}
                height={420}
                className={styles.mikuImg}
                unoptimized
              />
            </div>
          </div>

          <div className={styles.idCard}>
            <div className={styles.idCardHeader}>
              <span className={styles.idCardLabel}>IDENTIFICATION</span>
              <span className={styles.idCardCode}>{data.bioIdCode}</span>
            </div>
            <div className={styles.idCardBody}>
              <span className={styles.idName}>{data.bioKanji}</span>
              <span className={styles.idNameEn}>{data.bioNameEn}</span>
            </div>
          </div>

          <div className={styles.maidFloat}>
            <Image
              key={data.gifMaid}
              src={data.gifMaid}
              alt={`${data.name} maid`}
              width={120}
              height={120}
              className={styles.maidGif}
              unoptimized
            />
          </div>

          <div className={styles.decoLines} aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={styles.decoLine} style={{ top: `${15 + i * 18}%` }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
