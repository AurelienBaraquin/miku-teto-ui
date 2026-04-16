'use client'

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react'

export type Theme = 'miku' | 'teto'

export interface ThemeData {
  name: string
  // Colors (applied via CSS variable override on <html>)
  primary: string
  primaryDim: string
  secondary: string
  secondaryDim: string
  // Content
  sysLabel: string
  titleMain: string
  titleSub: string
  subtitleText: string
  ctaText: string
  stats: { label: string; value: string }[]
  cornerTL: string
  // Bio
  bioUnit: string
  bioName1: string
  bioName2: string
  bioKanji: string
  bioNameEn: string
  bioIdCode: string
  bioDesc: string
  bioSpecs: { id: string; label: string; value: string }[]
  // GIFs
  gifDance: string
  gifSticker: string
  gifHaircopter: string
  gifMaid: string
  // Gallery
  tracks: import('../components/Gallery/Gallery').Track[]
  archiveTitle: string
  // Nav
  navItems: { label: string; href: string }[]
  // 3D section
  digital3dTag: string
  digital3dName: string
  model3dPath: string
  dnaPhrasesOverride: string[]
}

import type { Track } from '../components/Gallery/Gallery'

const MIKU_TRACKS: Track[] = [
  { id: 'melt', title: 'MELT', artist: 'Hatsune Miku', year: '2007', audioPath: '', coverColor: '#FF3366', accent: '#FF88AA', rotation: -4 },
  { id: 'world-is-mine', title: 'WORLD IS MINE', artist: 'Hatsune Miku', year: '2008', audioPath: '', coverColor: '#9B59B6', accent: '#E056EF', rotation: 3 },
  { id: 'rolling-girl', title: 'ROLLING GIRL', artist: 'Hatsune Miku', year: '2010', audioPath: '', coverColor: '#2C3E50', accent: '#00CFB5', rotation: -2 },
  { id: 'double-lariat', title: 'DOUBLE LARIAT', artist: 'Hatsune Miku', year: '2009', audioPath: '', coverColor: '#E67E22', accent: '#F39C12', rotation: 5 },
  { id: 'tell-your-world', title: 'TELL YOUR WORLD', artist: 'Hatsune Miku', year: '2011', audioPath: '', coverColor: '#1ABC9C', accent: '#00CFB5', rotation: -3 },
  { id: 'levan-polkka', title: 'LEVAN POLKKA', artist: 'Hatsune Miku', year: '2007', audioPath: '', coverColor: '#27AE60', accent: '#2ECC71', rotation: 2 },
]

const TETO_TRACKS: Track[] = [
  { id: 'kasane-territory', title: 'KASANE TERRITORY', artist: 'Kasane Teto', year: '2008', audioPath: '', coverColor: '#8B0000', accent: '#FF3355', rotation: -4 },
  { id: 'toeto', title: 'TOETO', artist: 'Kasane Teto', year: '2009', audioPath: '', coverColor: '#C0392B', accent: '#FF6B6B', rotation: 3 },
  { id: 'error', title: 'ERROR', artist: 'Kasane Teto', year: '2010', audioPath: '', coverColor: '#2C2C2C', accent: '#E74C3C', rotation: -2 },
  { id: 'abandon', title: 'ABANDON', artist: 'Kasane Teto', year: '2011', audioPath: '', coverColor: '#4A1A2A', accent: '#FF4488', rotation: 5 },
  { id: 'sin-and-punishment', title: 'SIN & PUNISHMENT', artist: 'Kasane Teto', year: '2012', audioPath: '', coverColor: '#1A0A0A', accent: '#CC0033', rotation: -3 },
  { id: 'fukkireta', title: 'FUKKIRETA', artist: 'Kasane Teto', year: '2010', audioPath: '', coverColor: '#7D1535', accent: '#FF2222', rotation: 2 },
]

export const THEMES: Record<Theme, ThemeData> = {
  miku: {
    name: 'MIKU',
    primary: '#00CFB5',
    primaryDim: '#00876E',
    secondary: '#FF00FF',
    secondaryDim: '#AA00AA',
    sysLabel: 'SYS:BOOT // HATSUNE MIKU UNIT 01',
    titleMain: 'MIKU',
    titleSub: 'PROTOCOL',
    subtitleText: 'DIGITAL DIVA // VOCALOID UNIT // VERSION 3.0.0',
    ctaText: 'ACCESS UNIT',
    stats: [
      { label: 'MODEL', value: 'CV01' },
      { label: 'RANGE', value: 'A3–E5' },
      { label: 'TEMPO', value: '70–150BPM' },
      { label: 'STATUS', value: 'ONLINE' },
    ],
    cornerTL: 'MIKU_PROTOCOL',
    bioUnit: 'UNIT 01 SPECS',
    bioName1: 'HATSUNE',
    bioName2: 'MIKU',
    bioKanji: '初音ミク',
    bioNameEn: 'HATSUNE MIKU',
    bioIdCode: 'MK-001',
    bioDesc: 'Hatsune Miku est une Vocaloid déployée par Crypton Future Media. Ce modèle de synthèse vocale repousse les limites de la créativité humaine — une IA chanteuse dont la voix résonne dans des stades entiers.',
    bioSpecs: [
      { id: 'height', label: 'HEIGHT', value: '158cm' },
      { id: 'weight', label: 'WEIGHT', value: '42kg' },
      { id: 'vocal', label: 'VOCAL ENGINE', value: 'VOCALOID 3' },
      { id: 'range', label: 'VOCAL RANGE', value: 'A3 → E5' },
      { id: 'model', label: 'MODEL ID', value: 'CV-01' },
      { id: 'status', label: 'SYS STATUS', value: 'ONLINE' },
      { id: 'developer', label: 'DEVELOPER', value: 'CRYPTON' },
      { id: 'release', label: 'RELEASE DATE', value: '2007.08.31' },
    ],
    gifDance: '/gifs/miku-dance.gif',
    gifSticker: '/gifs/miku-animation-sticker.gif',
    gifHaircopter: '/gifs/miku-haircopter.gif',
    gifMaid: '/gifs/miku-maid-blush.gif',
    tracks: MIKU_TRACKS,
    archiveTitle: 'SOUND DATABASE',
    navItems: [
      { label: 'PROTOCOL', href: '#hero' },
      { label: 'UNIT 01', href: '#bio' },
      { label: 'SOUND DB', href: '#gallery' },
      { label: '3D SCAN', href: '#miku3d-wrapper' },
    ],
    digital3dTag: '3D RENDERING // UNIT 01 FULL BODY SCAN',
    digital3dName: 'DIGITAL INCARNATION',
    model3dPath: '/models/miku.glb',
    dnaPhrasesOverride: [
      'VOCALOID', 'DIGITAL DIVA', '初音ミク', 'PROTOCOL 01',
      'SYNTHESIZER', 'CRYPTON', 'HATSUNE', 'FUTURE MEDIA',
      'CV-01', 'VIRTUAL IDOL', 'SOUND UNIT', '39 ミク',
      'INFINITE VOICE', 'DIGITAL SOUL',
    ],
  },
  teto: {
    name: 'TETO',
    primary: '#E60026',
    primaryDim: '#8B0000',
    secondary: '#FF8C00',
    secondaryDim: '#AA5500',
    sysLabel: 'SYS:BOOT // KASANE TETO UNIT 02',
    titleMain: 'TETO',
    titleSub: 'PROTOCOL',
    subtitleText: 'CHIMERA DIVA // UTAU UNIT // VERSION 6.6.6',
    ctaText: 'ACCESS UNIT',
    stats: [
      { label: 'MODEL', value: 'TT-02' },
      { label: 'RANGE', value: 'D4–D6' },
      { label: 'LOOPS', value: '∞ BREAD' },
      { label: 'STATUS', value: 'ACTIVE' },
    ],
    cornerTL: 'TETO_PROTOCOL',
    bioUnit: 'UNIT 02 SPECS',
    bioName1: 'KASANE',
    bioName2: 'TETO',
    bioKanji: '重音テト',
    bioNameEn: 'KASANE TETO',
    bioIdCode: 'TT-002',
    bioDesc: 'Kasane Teto est une UTAU chimère née d\'un canular du 1er avril 2008. Voix en vrille de drill, âme de feu — cette unité illégitime a conquis internet à la force de son pain de campagne.',
    bioSpecs: [
      { id: 'height', label: 'HEIGHT', value: '158cm' },
      { id: 'weight', label: 'WEIGHT', value: '47kg' },
      { id: 'vocal', label: 'VOCAL ENGINE', value: 'UTAU' },
      { id: 'range', label: 'VOCAL RANGE', value: 'D4 → D6' },
      { id: 'model', label: 'MODEL ID', value: 'TT-02' },
      { id: 'status', label: 'SYS STATUS', value: 'ACTIVE' },
      { id: 'developer', label: 'DEVELOPER', value: 'J.A.M.' },
      { id: 'release', label: 'RELEASE DATE', value: '2008.04.01' },
    ],
    gifDance: '/gifs/teto-dance.gif',
    gifSticker: '/gifs/teto-animation-sticker.gif',
    gifHaircopter: '/gifs/teto-haircopter.gif',
    gifMaid: '/gifs/teto-maid-blush.gif',
    tracks: TETO_TRACKS,
    archiveTitle: 'CHIMERA DATABASE',
    navItems: [
      { label: 'PROTOCOL', href: '#hero' },
      { label: 'UNIT 02', href: '#bio' },
      { label: 'CHIMERA DB', href: '#gallery' },
      { label: '3D SCAN', href: '#miku3d-wrapper' },
    ],
    digital3dTag: '3D RENDERING // UNIT 02 FULL BODY SCAN',
    digital3dName: 'CHIMERA INCARNATION',
    model3dPath: '/models/teto.glb',
    dnaPhrasesOverride: [
      'UTAU', 'CHIMERA DIVA', '重音テト', 'PROTOCOL 02',
      'KASANE', 'J.A.M.', 'TETO', 'APRIL FOOL',
      'TT-02', 'DRILL IDOL', 'PAIN UNIT', '테토 ミク',
      'BREAD LOOP', 'CHIMERA SOUL',
    ],
  },
}

interface ThemeContextValue {
  theme: Theme
  data: ThemeData
  toggleTheme: () => void
  transitionRef: React.MutableRefObject<(() => void) | null>
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('miku')
  // Holds a callback InkBleed can register so the toggle can trigger it
  const transitionRef = useRef<(() => void) | null>(null)

  const toggleTheme = useCallback(() => {
    const next: Theme = theme === 'miku' ? 'teto' : 'miku'
    const data = THEMES[next]

    // Fire the InkBleed flash
    transitionRef.current?.()

    // Apply CSS custom properties on <html> for instant global recolor
    const root = document.documentElement
    root.setAttribute('data-theme', next)
    root.style.setProperty('--clr-cyan', data.primary)
    root.style.setProperty('--clr-cyan-dim', data.primaryDim)
    root.style.setProperty('--clr-magenta', data.secondary)
    root.style.setProperty('--clr-magenta-dim', data.secondaryDim)

    setTheme(next)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, data: THEMES[theme], toggleTheme, transitionRef }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
