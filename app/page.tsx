'use client'

import dynamic from 'next/dynamic'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Hero from '@/components/Hero/Hero'
import Bio from '@/components/Bio/Bio'
import Gallery from '@/components/Gallery/Gallery'
import NavMenu from '@/components/NavMenu/NavMenu'
import InkBleed from '@/components/InkBleed/InkBleed'
import styles from './page.module.css'

if (typeof window !== 'undefined') {
  const origWarn = console.warn
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) return
    origWarn(...args)
  }
}

const CustomCursor = dynamic(() => import('@/components/Cursor/CustomCursor'), { ssr: false })
const ParallaxBg = dynamic(() => import('@/components/ParallaxBg/ParallaxBg'), { ssr: false })
const SmoothScroll = dynamic(() => import('@/components/SmoothScroll/SmoothScroll'), { ssr: false })
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle/ThemeToggle'), { ssr: false })
const MikuScene = dynamic(() => import('@/components/MikuScene/MikuScene'), {
  ssr: false,
  loading: () => (
    <div style={{
      minHeight: '200vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--clr-cyan)',
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      letterSpacing: '4px',
    }}>
      LOADING 3D MODEL...
    </div>
  ),
})

export default function Home() {
  return (
    <ThemeProvider>
      <SmoothScroll>
        <main className={styles.main}>
          {/* Global fixed elements */}
          <CustomCursor />
          <ParallaxBg />
          <NavMenu />
          <InkBleed />
          <ThemeToggle />

          {/* Sections */}
          <Hero />
          <Bio />
          <Gallery />
          <div id="miku3d-wrapper">
            <MikuScene />
          </div>

          {/* Footer */}
          <footer className={styles.footer}>
            <div className={`trapeze ${styles.footerInner}`}>
              <div className={styles.footerTop}>
                <FooterText />
                <div className={styles.footerStatus}>
                  <span className={styles.footerDot} />
                  <span>SYS ONLINE</span>
                </div>
              </div>
              <span className={styles.footerSub}>
                ALL SOUNDS & CHARACTERS © CRYPTON FUTURE MEDIA INC. / J.A.M.
              </span>
            </div>
          </footer>
        </main>
      </SmoothScroll>
    </ThemeProvider>
  )
}

// Tiny client component so footer text can read theme
function FooterText() {
  // This uses CSS vars which update automatically — no context needed here
  return (
    <span className={styles.footerText}>
      MIKU × TETO PROTOCOL // UNIT 01 & 02 // 初音ミク · 重音テト
    </span>
  )
}
