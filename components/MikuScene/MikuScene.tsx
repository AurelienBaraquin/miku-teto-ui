'use client'

import { useRef, useEffect, Suspense, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { useTheme } from '@/contexts/ThemeContext'
import styles from './MikuScene.module.css'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Defer preload to avoid blocking initial render
if (typeof window !== 'undefined') {
  setTimeout(() => {
    useGLTF.preload('/models/miku.glb')
    useGLTF.preload('/models/teto.glb')
  }, 1000)
}

interface ScrollState { progress: number }

/* ─── MODEL ───────────────────────────────────── */
function CharacterModel({
  modelPath,
  scrollState,
}: {
  modelPath: string
  scrollState: React.MutableRefObject<ScrollState>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(modelPath)

  useEffect(() => {
    if (!scene) return
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 2.2 / maxDim

    scene.scale.setScalar(scale)
    scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  useFrame((state) => {
    if (!groupRef.current) return
    const { progress } = scrollState.current
    const targetY = progress * Math.PI * 4
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05)
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

/* ─── SCENE SETUP ─────────────────────────────── */
function SceneSetup({
  modelPath,
  scrollState,
}: {
  modelPath: string
  scrollState: React.MutableRefObject<ScrollState>
}) {
  const { camera } = useThree()
  const { data } = useTheme()

  // Derive colored lights from theme
  const primaryCol = data.primary
  const secondaryCol = data.secondary

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    ;(camera as THREE.PerspectiveCamera).fov = 40
    camera.position.set(0, 0.2, 5)
    camera.updateProjectionMatrix()
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[4, 8, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.001}
      />
      <pointLight position={[-3, 4, 3]} intensity={1.2} color={primaryCol} />
      <pointLight position={[3, 1, -3]} intensity={0.8} color={secondaryCol} />
      <pointLight position={[0, 6, 0]} intensity={0.5} color="#aaddff" />

      <Suspense fallback={null}>
        <CharacterModel modelPath={modelPath} scrollState={scrollState} />
        <ContactShadows
          opacity={0.5}
          scale={8}
          blur={1.5}
          far={5}
          resolution={256}
          color={primaryCol}
          position={[0, -1.8, 0]}
        />
        <Environment preset="city" />
      </Suspense>
    </>
  )
}

/* ─── MAIN EXPORT ─────────────────────────────── */
export default function MikuScene() {
  const { data } = useTheme()
  const sectionRef = useRef<HTMLElement>(null)
  const scrollState = useRef<ScrollState>({ progress: 0 })
  const prevProgress = useRef(0)
  const [modelLoaded, setModelLoaded] = useState(false)

  const dnaPhrasesOverride = data.dnaPhrasesOverride
  const modelPath = data.model3dPath

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Scrub scroll progress into scrollState ref (no re-render)
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          scrollState.current.progress = self.progress
          prevProgress.current = self.progress
        },
      })

      // Staggered entrance for data cards
      gsap.from(`.${styles.scrollTextItem}`, {
        x: -40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      })
    }, sectionRef)

    // Slight delay to let 3D scene initialize
    const t = setTimeout(() => setModelLoaded(true), 100)

    return () => {
      ctx.revert()
      clearTimeout(t)
    }
  }, [])

  // Theme-aware 3D data cards
  const dataCols = data.name === 'MIKU'
    ? [
        { label: 'VOICE SYNTHESIS',  value: 'Yamaha VOCALOID Engine — Concert-grade vocal synthesis at 44.1kHz processing rate.' },
        { label: 'DIMENSIONAL DATA', value: 'Height: 158cm — Weight: 42kg — Vocal range A3 to E5 — Tempo 70 to 150 BPM.' },
        { label: 'DEPLOYMENT DATE',  value: 'August 31, 2007 — First commercial Vocaloid unit with distinct personality matrix.' },
        { label: 'CULTURAL IMPACT',  value: 'Over 100,000 songs created — Performed in 40+ countries worldwide — Holographic concerts.' },
      ]
    : [
        { label: 'VOICE ENGINE',     value: 'UTAU Chimera Engine — Drill-wave synthesis, range D4 to D6, natural falsetto transitions.' },
        { label: 'DIMENSIONAL DATA', value: 'Height: 158cm — Weight: 47kg — Hair drills: ∞ — Bread consumed per loop: 1.' },
        { label: 'ORIGIN DATE',      value: 'April 1, 2008 — Born from an April Fool hoax that accidentally became a legend.' },
        { label: 'CHIMERA STATUS',   value: 'Unofficial VOCALOID • UTAU crossover unit — fan-adopted as cultural icon globally.' },
      ]

  const idCode = data.name === 'MIKU' ? 'MK-001 // GLB' : 'TT-002 // GLB'

  return (
    <section id="miku3d" ref={sectionRef} className={styles.section}>

      {/* Section header — sticky while scrolling */}
      <div className={styles.header}>
        <div className={styles.headerTag}>
          <span className={styles.tagDot} />
          <span className={styles.tagText}>{data.digital3dTag}</span>
        </div>
        <h2 className={styles.title}>
          <span className={styles.titleLine1}>{data.digital3dName.split(' ')[0]}</span>
          <span className={styles.titleLine2}>{data.digital3dName.split(' ').slice(1).join(' ')}</span>
        </h2>
        <p className={styles.subtitle}>↓ Scroll to rotate the model</p>
      </div>

      {/* 3D Canvas — sticky viewport fill */}
      <div className={styles.canvasWrapper}>

        {/* DNA helix text ring (pure CSS 3D) */}
        <div className={styles.dnaRing} aria-hidden="true">
          {dnaPhrasesOverride.map((phrase, i) => (
            <span
              key={`${phrase}-${i}`}
              className={styles.dnaWord}
              style={{
                '--dna-i': i,
                '--dna-n': dnaPhrasesOverride.length,
              } as React.CSSProperties}
            >
              {phrase}
            </span>
          ))}
        </div>

        {/* Loading state */}
        {!modelLoaded && (
          <div className={styles.loader}>
            <span className={styles.loaderText}>
              LOADING {data.name} UNIT...
            </span>
            <div className={styles.loaderBar}><div className={styles.loaderFill} /></div>
          </div>
        )}

        <Canvas
          dpr={[1, 1.2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true
            gl.shadowMap.type = THREE.PCFShadowMap
          }}
          className={styles.canvas}
          style={{ opacity: modelLoaded ? 1 : 0, transition: 'opacity 0.5s' }}
        >
          {/* Key: forces full remount when model path changes */}
          <SceneSetup key={modelPath} modelPath={modelPath} scrollState={scrollState} />
        </Canvas>

        {/* Corner labels */}
        <div className={styles.canvasCornerTL} aria-hidden="true">SCAN_ACTIVE</div>
        <div className={styles.canvasCornerBR} aria-hidden="true">{idCode}</div>

        {/* Vignette */}
        <div className={styles.vignette} aria-hidden="true" />
      </div>

      {/* Scroll-driven data cards */}
      <div className={styles.scrollTexts}>
        {dataCols.map((item) => (
          <div key={item.label} className={styles.scrollTextItem}>
            <span className={styles.scrollTextLabel}>{item.label}</span>
            <p className={styles.scrollTextValue}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Scroll hint line */}
      <div className={styles.scrollHint}>
        <div className={styles.scrollHintLine} />
        <span className={styles.scrollHintText}>SCROLL TO ROTATE MODEL</span>
        <div className={styles.scrollHintLine} />
      </div>
    </section>
  )
}
