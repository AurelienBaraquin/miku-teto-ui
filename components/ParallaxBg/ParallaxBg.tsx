'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import styles from './ParallaxBg.module.css'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  type: 'star' | 'note' | 'triangle' | 'bar'
  rotation: number
  rotationSpeed: number
  color: string
}

interface MousePos {
  x: number
  y: number
}

export default function ParallaxBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef<MousePos>({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  const { data } = useTheme()
  const primaryColor = data.primary
  const secondaryColor = data.secondary
  const COLORS = [primaryColor, secondaryColor, '#FFFFFF', primaryColor, primaryColor]
  const MUSIC_NOTES = ['♪', '♫', '♩', '♬', '♭']

  const createParticle = useCallback((w: number, h: number): Particle => {
    const types: Particle['type'][] = ['star', 'note', 'triangle', 'bar']
    const type = types[Math.floor(Math.random() * types.length)]
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: type === 'note' ? 14 + Math.random() * 10 : 2 + Math.random() * 8,
      opacity: 0.1 + Math.random() * 0.5,
      type,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryColor, secondaryColor])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      if (particlesRef.current.length === 0) {
        particlesRef.current = Array.from({ length: 80 }, () =>
          createParticle(canvas.width, canvas.height)
        )
      }
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouseMove)

    let noteIndex = 0

    const draw = () => {
      const { width, height } = canvas
      ctx.clearRect(0, 0, width, height)

      // Get RGB components internally to support opacity
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 207, 181'
      }
      
      const primaryRgb = hexToRgb(primaryColor)

      // Deep background grid
      ctx.strokeStyle = `rgba(${primaryRgb}, 0.04)`
      ctx.lineWidth = 1
      const gridSize = 60
      
      ctx.beginPath()
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
      }
      ctx.stroke()

      const mouse = mouseRef.current
      const centerX = width / 2
      const centerY = height / 2
      const parallaxX = (mouse.x - centerX) / centerX
      const parallaxY = (mouse.y - centerY) / centerY

      particlesRef.current.forEach((p, i) => {
        const depth = 0.5 + (i % 5) * 0.1
        const px = p.x + parallaxX * 20 * depth
        const py = p.y + parallaxY * 20 * depth

        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.translate(px, py)
        ctx.rotate((p.rotation * Math.PI) / 180)

        // Force particles color update if theme changes
        const pColor = (() => {
          if (p.color === '#00CFB5' || p.color === '#E60026') return primaryColor
          if (p.color === '#FF00FF' || p.color === '#FF8C00') return secondaryColor
          return p.color
        })()

        if (p.type === 'star') {
          ctx.fillStyle = pColor
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.type === 'note') {
          ctx.fillStyle = pColor
          ctx.font = `${p.size}px serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(MUSIC_NOTES[noteIndex % MUSIC_NOTES.length], 0, 0)
          if (i === 0) noteIndex++
        } else if (p.type === 'triangle') {
          ctx.strokeStyle = pColor
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(0, -p.size)
          ctx.lineTo(p.size * 0.866, p.size * 0.5)
          ctx.lineTo(-p.size * 0.866, p.size * 0.5)
          ctx.closePath()
          ctx.stroke()
        } else if (p.type === 'bar') {
          ctx.fillStyle = pColor
          ctx.fillRect(-p.size * 2, -1, p.size * 4, 2)
        }

        ctx.restore()

        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed

        if (p.x < -50) p.x = width + 50
        if (p.x > width + 50) p.x = -50
        if (p.y < -50) p.y = height + 50
        if (p.y > height + 50) p.y = -50
      })

      // Diagonal accent lines
      ctx.strokeStyle = `rgba(${primaryRgb}, 0.06)`
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let i = -3; i < 6; i++) {
        ctx.moveTo(i * 400 + parallaxX * 30, 0)
        ctx.lineTo(i * 400 + 200 + parallaxX * 30, height)
      }
      ctx.stroke()

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [createParticle, primaryColor, secondaryColor])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}
