import { useEffect, useRef, useState } from 'react'
import { CASES } from '../data/cases'

const LIME = '#C8E500'

/* ── Per-case presentation data ──────────────────────────────────── */
const VISUAL = {
  'casa-revive': {
    sys: 'SYS_CASA_REVIVE', build: 'BUILD 901', record: 'RECORD_001',
    sysLabel: '● DELIVERED', sysColor: '#22c55e', showOrbit: false,
    lastUpdate: '2026.08.08', revision: 'FINAL', verified: '✓ CLIENT APPROVED',
    tabs: ['HERO', 'ADS'],
    thumbs: [
      { g: 'linear-gradient(145deg,#2a2118,#120f0b)', t: 'HERO' },
      { g: 'linear-gradient(145deg,#342719,#17110b)', t: 'FILM' },
    ],
  },
  aura: {
    sys: 'SYS_AURA_CORE', build: 'BUILD 826', record: 'RECORD_001',
    sysLabel: '● ONLINE', sysColor: '#22c55e', showOrbit: true,
    lastUpdate: '2026.06.28', revision: 'R-03', verified: '✓ ACTIVE',
    tabs: ['HERO', 'UX', 'MOTION', 'BRAND'],
    thumbs: [
      { g: 'linear-gradient(145deg,#1c0840,#0d0a1a)', t: 'HERO'   },
      { g: 'linear-gradient(145deg,#200838,#130624)', t: 'UX'     },
      { g: 'linear-gradient(145deg,#0d0a22,#1a0d30)', t: 'MOTION' },
      { g: 'linear-gradient(145deg,#180b30,#0d0820)', t: 'BRAND'  },
    ],
  },
  sunny: {
    sys: 'SYS_SUNNY_CORE', build: 'BUILD 412', record: 'RECORD_002',
    sysLabel: '● COMPLETED', sysColor: '#22c55e', showOrbit: true, orbitSimple: true,
    lastUpdate: '2024.11.15', revision: 'R-07', verified: '✓ COMPLETE',
    tabs: ['HERO', '3D', 'MOTION', 'BRAND'],
    thumbs: [
      { g: 'linear-gradient(145deg,#2d1800,#1a0d00)', t: 'HERO'   },
      { g: 'linear-gradient(145deg,#201200,#291600)', t: '3D'     },
      { g: 'linear-gradient(145deg,#180a00,#251400)', t: 'MOTION' },
      { g: 'linear-gradient(145deg,#1a0e00,#1e1000)', t: 'BRAND'  },
    ],
  },
  motion: {
    sys: 'SYS_MOTION_CORE', build: 'BUILD 204', record: 'RECORD_003',
    sysLabel: '● ONGOING', sysColor: LIME, showOrbit: true, orbitSimple: true,
    lastUpdate: '2026.06.28', revision: 'R-11', verified: '● LIVE',
    tabs: ['HERO', 'VIDEOS', 'CAT', 'INFO'],
    thumbs: [
      { g: 'linear-gradient(145deg,#0b1d07,#070d04)', t: 'HERO'   },
      { g: 'linear-gradient(145deg,#0c1e08,#081508)', t: 'VIDS'   },
      { g: 'linear-gradient(145deg,#071206,#0d1a08)', t: 'CAT'    },
      { g: 'linear-gradient(145deg,#051005,#0a1806)', t: 'INFO'   },
    ],
  },
}

/* ── HUD corner brackets ─────────────────────────────────────────── */
function HudCorners({ size = 10, thick = 1.5, color, inset = -1 }) {
  const s = { position: 'absolute', width: size, height: size, zIndex: 2, borderColor: color, pointerEvents: 'none' }
  return (
    <>
      <div aria-hidden style={{ ...s, top: inset,    left: inset,  borderTop: `${thick}px solid`,    borderLeft: `${thick}px solid`   }} />
      <div aria-hidden style={{ ...s, top: inset,    right: inset, borderTop: `${thick}px solid`,    borderRight: `${thick}px solid`  }} />
      <div aria-hidden style={{ ...s, bottom: inset, left: inset,  borderBottom: `${thick}px solid`, borderLeft: `${thick}px solid`   }} />
      <div aria-hidden style={{ ...s, bottom: inset, right: inset, borderBottom: `${thick}px solid`, borderRight: `${thick}px solid`  }} />
    </>
  )
}

/* ── HUD toast ───────────────────────────────────────────────────── */
function HudToast({ visible }) {
  return (
    <div aria-live="polite" style={{
      position: 'absolute', bottom: 14, left: '50%', zIndex: 20,
      pointerEvents: 'none',
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 14px',
      background: '#0A0A0A',
      border: `1px solid ${LIME}55`,
      boxShadow: `0 0 18px rgba(200,229,0,0.15)`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(6px)',
      transition: 'opacity .22s ease, transform .22s ease',
      whiteSpace: 'nowrap',
    }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#ff7a00', flexShrink: 0 }} aria-hidden />
      <span style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
        CASE FILE NOT DEPLOYED YET
      </span>
    </div>
  )
}

/* ── Flickering HUD label ────────────────────────────────────────── */
function FlickerLabel({ children, style, delay = '0s' }) {
  return (
    <span style={{ ...style, animation: `cm-flicker 13s ease-in-out ${delay} infinite` }}>
      {children}
    </span>
  )
}

/* ── AURA orbit rings + particles ────────────────────────────────── */
function AuraOrbit({ accent, simple = false }) {
  if (simple) return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 1 }}>
      <div style={{ position: 'absolute', width: 230, height: 92, border: `1px solid ${accent}28`, borderRadius: '50%', animation: 'cm-orbit-cw 32s linear infinite' }}>
        <div style={{ position: 'absolute', top: -2.5, left: '50%', marginLeft: -2.5, width: 5, height: 5, borderRadius: '50%', background: accent, boxShadow: `0 0 8px ${accent}`, opacity: 0.55 }} />
      </div>
      <div style={{ position: 'absolute', width: '64%', height: 1, background: `linear-gradient(90deg,transparent,${accent}14 30%,${accent}20 50%,${accent}14 70%,transparent)` }} />
    </div>
  )
  const dots = [
    { top: '22%', left: '12%',  s: 3,   c: accent,                 d: '0s'   },
    { top: '72%', left: '16%',  s: 2,   c: LIME,                   d: '1.2s' },
    { top: '20%', right: '14%', s: 2.5, c: accent,                 d: '0.6s' },
    { top: '70%', right: '16%', s: 2,   c: LIME,                   d: '1.8s' },
    { top: '46%', left:  '6%',  s: 1.5, c: 'rgba(255,255,255,.5)', d: '0.3s' },
    { top: '45%', right: '7%',  s: 1.5, c: 'rgba(255,255,255,.4)', d: '1.5s' },
    { top: '35%', left: '28%',  s: 1,   c: accent,                 d: '2.2s' },
    { top: '62%', right: '28%', s: 1,   c: LIME,                   d: '0.9s' },
  ]
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 1 }}>
      <div style={{ position: 'absolute', width: 250, height: 105, border: `1px solid ${accent}44`, borderRadius: '50%', animation: 'cm-orbit-cw 24s linear infinite' }}>
        <div style={{ position: 'absolute', top: -3, left: '50%', marginLeft: -3, width: 6, height: 6, borderRadius: '50%', background: accent, boxShadow: `0 0 10px ${accent}` }} />
      </div>
      <div style={{ position: 'absolute', width: 190, height: 78, border: `1px solid ${LIME}28`, borderRadius: '50%', transform: 'rotate(-22deg)', animation: 'cm-orbit-ccw 17s linear infinite' }}>
        <div style={{ position: 'absolute', top: -2.5, left: '50%', marginLeft: -2.5, width: 5, height: 5, borderRadius: '50%', background: LIME, boxShadow: `0 0 7px ${LIME}` }} />
      </div>
      <div style={{ position: 'absolute', width: 135, height: 56, border: `1px solid ${accent}22`, borderRadius: '50%', animation: 'cm-orbit-cw 13s linear infinite' }}>
        <div style={{ position: 'absolute', top: -2, left: '50%', marginLeft: -2, width: 4, height: 4, borderRadius: '50%', background: accent, opacity: 0.6 }} />
      </div>
      <div style={{ position: 'absolute', width: '76%', height: 1, background: `linear-gradient(90deg,transparent,${accent}22 25%,${accent}30 50%,${accent}22 75%,transparent)` }} />
      <div style={{ position: 'absolute', height: '76%', width: 1, background: `linear-gradient(180deg,transparent,${accent}22 25%,${accent}30 50%,${accent}22 75%,transparent)` }} />
      {[
        { top: '14%', left: '14%' }, { top: '14%', right: '14%' },
        { bottom: '14%', left: '14%' }, { bottom: '14%', right: '14%' },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', ...pos, width: 10, height: 10,
          borderTop:    i < 2  ? `1px solid ${accent}40` : 'none',
          borderBottom: i >= 2 ? `1px solid ${accent}40` : 'none',
          borderLeft:  (i === 0 || i === 2) ? `1px solid ${accent}40` : 'none',
          borderRight: (i === 1 || i === 3) ? `1px solid ${accent}40` : 'none',
        }} />
      ))}
      {dots.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: p.top, left: p.left, right: p.right,
          width: p.s, height: p.s, borderRadius: '50%',
          background: p.c, boxShadow: `0 0 5px ${p.c}`,
          animation: `cm-particle-pulse 2.8s ease-in-out ${p.d} infinite`,
        }} />
      ))}
    </div>
  )
}

/* ── Ambient floating dust particles ─────────────────────────────── */
function FloatingParticles({ accent }) {
  const pts = [
    { left: '12%', delay: '0s',   dur: '8s'  },
    { left: '28%', delay: '2.4s', dur: '10s' },
    { left: '48%', delay: '1.1s', dur: '7s'  },
    { left: '63%', delay: '4.0s', dur: '9s'  },
    { left: '79%', delay: '0.7s', dur: '11s' },
    { left: '90%', delay: '5.5s', dur: '7.5s'},
  ]
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {pts.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          bottom: '6px',
          left: p.left,
          width: i % 3 === 0 ? 2 : 1.5,
          height: i % 3 === 0 ? 2 : 1.5,
          borderRadius: '50%',
          background: i % 2 === 0 ? accent : LIME,
          animation: `cm-float-up ${p.dur} ${p.delay} ease-in infinite`,
        }} />
      ))}
    </div>
  )
}

/* ── Motion Practice mini grid ───────────────────────────────────── */
function MotionPreview({ accent }) {
  const tiles = [
    { g: 'linear-gradient(135deg,#0a1a06,#112210)', t: 'TYPE'    },
    { g: 'linear-gradient(135deg,#10080a,#200b0e)', t: 'PRODUCT' },
    { g: 'linear-gradient(135deg,#08101a,#060e1a)', t: 'ADS'     },
    { g: 'linear-gradient(135deg,#100a00,#201400)', t: 'BRAND'   },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, width: '88%' }}>
      {tiles.map((t, i) => (
        <div key={i} style={{ height: 66, borderRadius: 1, background: t.g, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>{t.t}</span>
          <div style={{ position: 'absolute', bottom: 4, right: 5, width: 3, height: 3, borderRadius: '50%', background: accent, opacity: 0.7, animation: `cm-particle-pulse 2.8s ease-in-out ${i * 0.7}s infinite` }} aria-hidden />
        </div>
      ))}
    </div>
  )
}

/* ── HUD metadata overlay ────────────────────────────────────────── */
function HudMeta({ visual, accent }) {
  const rows = [
    ['BUILD',       visual.build.replace('BUILD ', '')],
    ['LAST UPDATE', visual.lastUpdate],
    ['REVISION',    visual.revision],
    ['VERIFIED',    visual.verified],
  ]
  return (
    <div aria-hidden style={{ position: 'absolute', bottom: 42, right: 10, zIndex: 4, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
      {rows.map(([label, val]) => (
        <div key={label} style={{ display: 'flex', gap: 5, alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 6, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.16)' }}>{label}</span>
          <span style={{ fontFamily: 'monospace', fontSize: 6.5, letterSpacing: '0.06em', color: accent, opacity: 0.55 }}>{val}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Module names for loading sequence ───────────────────────────── */
const MODULE_NAMES = {
  HERO: 'HERO_MODULE', UX: 'UX_MODULE', '3D': 'RENDER_3D',
  MOTION: 'MOTION_PKG', BRAND: 'BRAND_ASSETS',
  VIDEOS: 'VIDEO_ARCHIVE', CAT: 'CATEGORY_INDEX', INFO: 'SYSTEM_INFO',
}

/* ── Motion Practice video dataset ──────────────────────────────── */
const MOTION_VIDEOS = [
  {
    id: 'mv-001', title: 'SUNNY BRAND MOTION',   cat: 'PRODUCT',
    dur: '00:19', year: '2024', status: 'READY',
    tools: ['After Effects', 'Blender'],
    src: '/assets/sunny-preview.mp4',
    thumb: null,
    accent: LIME,
  },
  {
    id: 'mv-002', title: 'PRODUCT MOTION 01',    cat: 'PRODUCT',
    dur: '00:10', year: '2025', status: 'READY',
    tools: ['After Effects', 'Blender'],
    src: '/assets/motion-product-01.mp4',
    thumb: '/assets/motion-thumb-01.png',
    accent: LIME,
  },
  {
    id: 'mv-003', title: 'PRODUCT MOTION 02',    cat: 'PRODUCT',
    dur: '00:05', year: '2025', status: 'READY',
    tools: ['After Effects'],
    src: '/assets/motion-product-02.mp4',
    thumb: '/assets/motion-thumb-02.png',
    accent: LIME,
  },
  {
    id: 'mv-004', title: 'STATUE MOTION',        cat: 'EXPERIMENTAL',
    dur: '00:15', year: '2025', status: 'READY',
    tools: ['After Effects', 'Blender'],
    src: '/assets/motion-product-03.mp4',
    thumb: '/assets/motion-thumb-03.png',
    accent: LIME,
  },
  {
    id: 'mv-005', title: 'TYPOGRAPHY REEL',      cat: 'TYPOGRAPHY',
    dur: '00:24', year: '2026', status: 'PENDING',
    tools: ['After Effects'],
    src: null, thumb: null, accent: LIME,
  },
  {
    id: 'mv-006', title: 'AD CONCEPT — 15SEC',   cat: 'ADS',
    dur: '00:15', year: '2026', status: 'PENDING',
    tools: ['After Effects', 'CapCut'],
    src: null, thumb: null, accent: LIME,
  },
]

const CAT_COLORS = {
  PRODUCT: '#C8E500', TYPOGRAPHY: '#A3C200', ADS: '#7BB800',
  UI: '#22c55e', EXPERIMENTAL: '#06b6d4',
}

/* ── UX slideshow with auto-cycle ───────────────────────────────── */
/* ── Aura UX showcase — real product screens ─────────────────────── */
function AuraUxShowcase({ accent }) {
  const [active,  setActive]  = useState(0)   /* 0 = landing  1 = mobile */
  const [fading,  setFading]  = useState(false)
  const [hov,     setHov]     = useState(-1)

  const screens = [
    { key: 'LANDING',  src: '/assets/aura-landing.png', label: 'AURA_LANDING_v1.fig',  title: 'Web Landing Page',     tag: 'WEB / DESKTOP' },
    { key: 'MOBILE',   src: '/assets/aura-mobile.png',  label: 'AURA_SPLASH_v4.fig',   title: 'Splash Screen Design', tag: 'MOBILE / iOS'  },
  ]

  const go = (i) => {
    if (i === active) return
    setFading(true)
    setTimeout(() => { setActive(i); setFading(false) }, 220)
  }

  /* Auto-cycle every 4s */
  useEffect(() => {
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => { setActive(s => (s + 1) % screens.length); setFading(false) }, 220)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  const s = screens[active]

  return (
    <div style={{ width: '93%', display: 'flex', flexDirection: 'column', gap: 5 }}>

      {/* Tab selector */}
      <div style={{ display: 'flex', gap: 4 }}>
        {screens.map((sc, i) => (
          <button key={i} onClick={() => go(i)}
            style={{ flex: 1, padding: '4px 0', border: `1px solid ${i === active ? `${accent}70` : `${accent}18`}`,
              background: i === active ? `${accent}12` : 'transparent',
              fontFamily: 'monospace', fontSize: 6, letterSpacing: '0.14em', textTransform: 'uppercase',
              color: i === active ? accent : `${accent}50`, cursor: 'pointer',
              transition: 'border-color .18s, background .18s, color .18s',
            }}
          >
            {sc.key}
          </button>
        ))}
      </div>

      {/* Image frame */}
      <div style={{ position: 'relative', width: '100%', borderRadius: 2, overflow: 'hidden',
        border: `1px solid ${accent}28`,
        boxShadow: `0 0 28px ${accent}14`,
      }}>
        {/* Image */}
        <img
          src={s.src} alt={s.title}
          style={{ width: '100%', display: 'block', objectFit: 'cover',
            opacity: fading ? 0 : 1,
            transition: 'opacity .22s ease',
          }}
          loading="lazy"
        />

        {/* Scanline overlay */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 3px)',
        }} />

        {/* Top HUD bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '4px 8px',
          background: 'linear-gradient(180deg,rgba(0,0,0,0.72) 0%,transparent 100%)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 3,
          pointerEvents: 'none',
        }}>
          <div style={{ fontFamily: 'monospace', fontSize: 5.5, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: `${accent}cc`, textShadow: `0 0 6px ${accent}60`,
            opacity: fading ? 0 : 1, transition: 'opacity .22s',
          }}>{s.label}</div>
          <div style={{ fontFamily: 'monospace', fontSize: 5.5, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
          }}>{s.tag}</div>
        </div>

        {/* Bottom HUD bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 8px 5px',
          background: 'linear-gradient(0deg,rgba(0,0,0,0.78) 0%,transparent 100%)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 3,
          pointerEvents: 'none',
        }}>
          <div style={{ fontFamily: 'monospace', fontSize: 6, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)',
            opacity: fading ? 0 : 1, transition: 'opacity .22s',
          }}>{s.title}</div>
          <div style={{ display: 'flex', gap: 4 }}>
            {screens.map((_, i) => (
              <div key={i} style={{ width: i === active ? 14 : 4, height: 2, borderRadius: 1,
                background: i === active ? accent : `${accent}30`,
                transition: 'width .3s, background .3s',
              }} />
            ))}
          </div>
        </div>

        {/* HUD corner brackets */}
        {[{top:5,left:5,bt:'borderTop',bl:'borderLeft'},{top:5,right:5,bt:'borderTop',bl:'borderRight'},{bottom:5,left:5,bt:'borderBottom',bl:'borderLeft'},{bottom:5,right:5,bt:'borderBottom',bl:'borderRight'}].map((p,i)=>(
          <div key={i} aria-hidden style={{ position:'absolute',...p, width:8, height:8, [p.bt]:`1px solid ${accent}55`, [p.bl]:`1px solid ${accent}55`, zIndex:4 }} />
        ))}

        {/* Accent glow at bottom */}
        <div aria-hidden style={{ position:'absolute', bottom:0, left:0, right:0, height:40, zIndex:2, pointerEvents:'none',
          background:`linear-gradient(0deg,${accent}12 0%,transparent 100%)`,
        }} />
      </div>

      {/* Info row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: accent, opacity: 0.6, animation: 'cm-dot-pulse 2.4s ease-in-out infinite' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 5.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: `${accent}70` }}>
            AURA · UI / UX DESIGN
          </span>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 5.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
          {String(active + 1).padStart(2,'0')} / {String(screens.length).padStart(2,'0')}
        </span>
      </div>
    </div>
  )
}

function UxSlideshow({ accent, tabKey }) {
  const screens = tabKey === '3D'
    ? [{ l:'3D RENDER',desc:'Hero product shot'},{l:'HERO SHOT',desc:'Final composition'},{l:'ROTATE',desc:'360° view'},{l:'FINAL',desc:'Delivery assets'}]
    : [{ l:'DASHBOARD',desc:'Main overview'},{l:'TRACKING',desc:'Mood history'},{l:'INSIGHTS',desc:'AI analysis'},{l:'SETTINGS',desc:'Preferences'}]

  const [slide,  setSlide]  = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    setSlide(0)
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => { setSlide(s => (s + 1) % screens.length); setFading(false) }, 280)
    }, 2600)
    return () => clearInterval(id)
  }, [tabKey])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, width: '90%' }}>
      {screens.map((s, i) => {
        const active = i === slide
        return (
          <div key={i} style={{
            height: 68, border: `1px solid ${active ? `${accent}55` : `${accent}12`}`,
            borderRadius: 2, background: active ? `${accent}09` : 'rgba(255,255,255,0.012)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative',
            transition: 'border-color .3s, background .3s',
            opacity: fading && active ? 0.3 : 1,
          }}>
            <div style={{ height: 9, background: active ? `${accent}14` : `${accent}07`, borderBottom: `1px solid ${active ? `${accent}18` : `${accent}07`}`, display: 'flex', alignItems: 'center', gap: 3, padding: '0 5px', flexShrink: 0 }}>
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: accent, opacity: active ? 0.7 : 0.18, transition: 'opacity .3s' }} />
              <div style={{ height: 2, width: active ? 22 : 14, background: active ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.05)', borderRadius: 1, transition: 'width .3s' }} />
            </div>
            <div style={{ flex: 1, padding: '4px 5px', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ height: 2, background: active ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)', borderRadius: 1, width: '72%', transition: 'background .3s' }} />
              <div style={{ height: 2, background: active ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)', borderRadius: 1, width: '55%' }} />
              <div style={{ height: 10, background: active ? `${accent}16` : `${accent}06`, borderRadius: 1, marginTop: 1, transition: 'background .3s' }} />
              <div style={{ height: 2, background: 'rgba(255,255,255,0.03)', borderRadius: 1, width: '80%' }} />
            </div>
            {active && <div aria-hidden style={{ position:'absolute', left:0, top:0, bottom:0, width:2, background: accent, opacity: 0.7 }} />}
            <div style={{ position:'absolute', bottom:2, right:4, fontFamily:'monospace', fontSize:5, letterSpacing:'0.1em', color: active ? `${accent}80` : `${accent}28`, textTransform:'uppercase', transition:'color .3s' }}>{s.l}</div>
          </div>
        )
      })}
      {/* Slide indicator */}
      <div style={{ gridColumn:'1/-1', display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:3 }}>
        <span style={{ fontFamily:'monospace', fontSize:6, letterSpacing:'0.14em', textTransform:'uppercase', color:`${accent}55` }}>
          {screens[slide].l} · {screens[slide].desc}
        </span>
        <div style={{ display:'flex', gap:3 }}>
          {screens.map((_,i) => <div key={i} style={{ width: i===slide?10:4, height:2, borderRadius:1, background: i===slide?accent:`${accent}28`, transition:'width .3s, background .3s' }} />)}
        </div>
      </div>
    </div>
  )
}

/* ── Inline video player ─────────────────────────────────────────── */
function VideoPlayer({ accent, c, label }) {
  const [phase,    setPhase]    = useState('idle')   /* 'idle' | 'playing' | 'ended' */
  const [current,  setCurrent]  = useState(0)        /* seconds */
  const [duration, setDuration] = useState(0)        /* seconds */
  const [scrubHov, setScrubHov] = useState(false)
  const videoRef   = useRef(null)
  const scrubRef   = useRef(null)
  const src = c.videoSrc ?? null

  /* Format seconds → MM:SS */
  const fmt = (s) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onMeta  = () => setDuration(v.duration || 0)
    const onTime  = () => setCurrent(v.currentTime)
    const onEnd   = () => { setPhase('ended'); setCurrent(0); v.currentTime = 0 }
    const onPlay  = () => setPhase('playing')
    const onPause = () => setPhase(p => p === 'ended' ? 'ended' : 'idle')
    v.addEventListener('loadedmetadata', onMeta)
    v.addEventListener('timeupdate',     onTime)
    v.addEventListener('ended',          onEnd)
    v.addEventListener('play',           onPlay)
    v.addEventListener('pause',          onPause)
    return () => {
      v.removeEventListener('loadedmetadata', onMeta)
      v.removeEventListener('timeupdate',     onTime)
      v.removeEventListener('ended',          onEnd)
      v.removeEventListener('play',           onPlay)
      v.removeEventListener('pause',          onPause)
    }
  }, [])

  const doPlay = () => {
    const v = videoRef.current
    if (!v || !src) return
    v.play()
  }
  const doReplay = () => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = 0
    v.play()
  }
  const doPause = () => videoRef.current?.pause()

  const scrubClick = (e) => {
    const v = videoRef.current
    if (!v || !duration) return
    const r = scrubRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
    v.currentTime = ratio * duration
  }

  const progress = duration > 0 ? current / duration : 0
  const isPlaying = phase === 'playing'
  const isEnded   = phase === 'ended'

  /* No-src placeholder */
  if (!src) return (
    <div style={{ width:'90%', aspectRatio:'16/9', border:`1px solid ${accent}18`, borderRadius:2, background:'#000', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, position:'relative' }}>
      <div style={{ width:38, height:38, border:`1px solid ${accent}30`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden><path d="M8 5v14l11-7z" fill={accent} opacity="0.3" /></svg>
      </div>
      <div style={{ fontFamily:'monospace', fontSize:6.5, letterSpacing:'0.16em', textTransform:'uppercase', color:`${accent}35` }}>{label} · NOT YET AVAILABLE</div>
      <div style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.12)' }}>MP4 FILE PENDING</div>
    </div>
  )

  return (
    <div style={{ width: c.videoAspect === '9/16' ? 'min(68%, 250px)' : '92%', display:'flex', flexDirection:'column', gap:0, maxHeight:'100%' }}>

      {/* ── Video frame ── */}
      <div style={{ width:'100%', aspectRatio: c.videoAspect ?? '16/9', border:`1px solid ${accent}28`, borderRadius:'2px 2px 0 0', overflow:'hidden', background:'#000', position:'relative', maxWidth:'100%' }}>

        {/* Video element — no native controls */}
        <video
          ref={videoRef} src={src} poster={c.videoPoster}
          style={{ width:'100%', height:'100%', objectFit:'contain', display:'block', maxWidth:'100%' }}
          playsInline preload="metadata"
          onContextMenu={e => e.preventDefault()}
        />

        {/* Scanline overlay */}
        <div aria-hidden style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none',
          backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.09) 2px,rgba(0,0,0,0.09) 3px)',
        }} />

        {/* Soft vignette */}
        <div aria-hidden style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none',
          background:'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }} />

        {/* Accent glow at bottom */}
        <div aria-hidden style={{ position:'absolute', bottom:0, left:0, right:0, height:32, zIndex:2, pointerEvents:'none',
          background:`linear-gradient(0deg, ${accent}14 0%, transparent 100%)`,
        }} />

        {/* HUD labels — top row */}
        <div aria-hidden style={{ position:'absolute', top:6, left:8, right:8, zIndex:4, pointerEvents:'none', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            <div style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.16em', textTransform:'uppercase', color:`${accent}90`,
              textShadow:`0 0 6px ${accent}55` }}>VIDEO STREAM</div>
            <div style={{ fontFamily:'monospace', fontSize:5, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)' }}>
              {isPlaying ? '● REC' : isEnded ? '■ STOPPED' : '◆ STANDBY'}
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:2, alignItems:'flex-end' }}>
            <div style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.32)' }}>FPS 60</div>
            <div style={{ fontFamily:'monospace', fontSize:5, letterSpacing:'0.12em', textTransform:'uppercase',
              color: isPlaying ? '#22c55e' : 'rgba(255,255,255,0.22)',
              textShadow: isPlaying ? '0 0 6px rgba(34,197,94,0.6)' : 'none',
              transition:'color .3s, text-shadow .3s',
            }}>SIGNAL OK</div>
          </div>
        </div>

        {/* PLAYBACK ACTIVE label — center-bottom, fades in when playing */}
        <div aria-hidden style={{ position:'absolute', bottom:10, left:0, right:0, zIndex:4, pointerEvents:'none',
          display:'flex', justifyContent:'center',
          opacity: isPlaying ? 1 : 0, transition:'opacity .4s',
        }}>
          <div style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.22em', textTransform:'uppercase',
            color: accent, textShadow:`0 0 8px ${accent}`, animation: isPlaying ? 'cm-flicker 6s ease-in-out infinite' : 'none' }}>
            PLAYBACK ACTIVE
          </div>
        </div>

        {/* HUD corner brackets */}
        {[{top:5,left:5,bt:'borderTop',bl:'borderLeft'},{top:5,right:5,bt:'borderTop',bl:'borderRight'},{bottom:5,left:5,bt:'borderBottom',bl:'borderLeft'},{bottom:5,right:5,bt:'borderBottom',bl:'borderRight'}].map((p,i)=>(
          <div key={i} aria-hidden style={{ position:'absolute', ...p, width:8, height:8, [p.bt]:`1px solid ${accent}50`, [p.bl]:`1px solid ${accent}50`, zIndex:5 }} />
        ))}

        {/* Center overlay: Play / Replay — fades out while playing */}
        <div style={{ position:'absolute', inset:0, zIndex:6, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:7,
          opacity: isPlaying ? 0 : 1,
          pointerEvents: isPlaying ? 'none' : 'auto',
          transition:'opacity .35s ease',
          background: isPlaying ? 'transparent' : 'rgba(0,0,0,0.28)',
        }}>
          <button
            onClick={isEnded ? doReplay : doPlay}
            aria-label={isEnded ? 'Replay video' : 'Play video preview'}
            style={{
              width:48, height:48, border:`1px solid ${accent}70`, borderRadius:'50%',
              display:'flex', alignItems:'center', justifyContent:'center',
              background:`rgba(0,0,0,0.6)`, backdropFilter:'blur(4px)',
              cursor:'pointer', transition:'border-color .2s, box-shadow .2s, transform .15s',
              boxShadow:`0 0 18px ${accent}22`,
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 0 24px ${accent}55`; e.currentTarget.style.transform='scale(1.08)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow=`0 0 18px ${accent}22`; e.currentTarget.style.transform='scale(1)' }}
          >
            {isEnded
              ? /* Replay icon */
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M1 4v6h6" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.51 15a9 9 0 1 0 .49-4.95L1 10" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              : /* Play icon */
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path d="M6 4l14 8-14 8V4z" fill={accent} opacity="0.9" /></svg>
            }
          </button>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
            <div style={{ fontFamily:'monospace', fontSize:7, letterSpacing:'0.18em', textTransform:'uppercase', color:`${accent}aa`,
              textShadow:`0 0 10px ${accent}55` }}>
              {isEnded ? 'REPLAY' : 'PLAY PREVIEW'}
            </div>
            {!isEnded && <div style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.22)' }}>
              SYS_{c.title.replace(/\s+/g,'_').toUpperCase()}_CORE
            </div>}
          </div>
        </div>

        {/* Click to pause while playing */}
        {isPlaying && (
          <div onClick={doPause} style={{ position:'absolute', inset:0, zIndex:7, cursor:'pointer' }} aria-label="Pause" role="button" />
        )}

      </div>{/* end video frame */}

      {/* ── HUD progress bar + controls ── */}
      <div style={{ border:`1px solid ${accent}18`, borderTop:'none', borderRadius:'0 0 2px 2px', background:'rgba(0,0,0,0.72)', padding:'5px 8px 5px 8px', display:'flex', flexDirection:'column', gap:4 }}>

        {/* Scrub bar */}
        <div
          ref={scrubRef}
          onClick={scrubClick}
          onMouseEnter={() => setScrubHov(true)}
          onMouseLeave={() => setScrubHov(false)}
          role="slider" aria-label="Seek video" aria-valuenow={Math.round(progress*100)} aria-valuemin={0} aria-valuemax={100}
          style={{ width:'100%', height: scrubHov ? 4 : 2, background:'rgba(255,255,255,0.08)', borderRadius:2, cursor:'pointer', position:'relative', overflow:'visible', transition:'height .15s' }}
        >
          {/* Buffered ghost track */}
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'100%', background:`${accent}10`, borderRadius:2 }} />
          {/* Progress fill */}
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:`${progress*100}%`, background:`linear-gradient(90deg,${accent}aa,${accent})`, borderRadius:2, boxShadow:`0 0 4px ${accent}55`, transition:'width .12s linear' }} />
          {/* Thumb dot */}
          <div style={{ position:'absolute', top:'50%', left:`${progress*100}%`, transform:'translate(-50%,-50%)',
            width: scrubHov ? 7 : 4, height: scrubHov ? 7 : 4, borderRadius:'50%',
            background:accent, boxShadow:`0 0 6px ${accent}`, transition:'width .15s, height .15s',
          }} />
        </div>

        {/* Status row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            {/* Status dot */}
            <div style={{ width:4, height:4, borderRadius:'50%',
              background: isPlaying ? '#22c55e' : isEnded ? accent : 'rgba(255,255,255,0.18)',
              boxShadow: isPlaying ? '0 0 5px rgba(34,197,94,0.8)' : 'none',
              transition:'background .3s, box-shadow .3s',
              flexShrink:0,
            }} />
            <span style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.12em', textTransform:'uppercase',
              color: isPlaying ? '#22c55e' : 'rgba(255,255,255,0.28)',
              transition:'color .3s',
            }}>
              {isPlaying ? 'PLAYING' : isEnded ? 'COMPLETE' : 'READY'}
            </span>
          </div>

          {/* Time display */}
          <span style={{ fontFamily:'monospace', fontSize:6.5, letterSpacing:'0.1em', color:`${accent}bb`,
            textShadow: isPlaying ? `0 0 6px ${accent}55` : 'none', transition:'text-shadow .3s',
          }}>
            {fmt(current)}&nbsp;<span style={{ color:'rgba(255,255,255,0.2)' }}>/</span>&nbsp;{fmt(duration)}
          </span>
        </div>

      </div>
    </div>
  )
}

/* ── HUD Lightbox (fullscreen render viewer) ─────────────────────── */
function HudLightbox({ renders, startIdx, accent, onClose }) {
  const [idx, setIdx] = useState(startIdx)
  const [fading, setFading] = useState(false)

  const go = (dir) => {
    setFading(true)
    setTimeout(() => { setIdx(i => (i + dir + renders.length) % renders.length); setFading(false) }, 180)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft')  go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const r = renders[idx]

  return (
    <div
      role="dialog" aria-modal aria-label="Render viewer"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position:'fixed', inset:0, zIndex:99999, background:'rgba(0,0,0,0.92)', backdropFilter:'blur(10px)',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10,
        animation:'cm-bd-in 0.18s ease both',
      }}
    >
      {/* Top HUD bar */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:36, borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 18px', zIndex:2 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:5, height:5, borderRadius:'50%', background:accent, boxShadow:`0 0 6px ${accent}` }} />
          <span style={{ fontFamily:'monospace', fontSize:7, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)' }}>
            RENDER VIEWER · {String(idx+1).padStart(2,'0')} / {String(renders.length).padStart(2,'0')}
          </span>
          <span style={{ fontFamily:'monospace', fontSize:6, letterSpacing:'0.12em', textTransform:'uppercase', color:`${accent}80` }}>{r.label}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <span style={{ fontFamily:'monospace', fontSize:6, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)' }}>ESC TO CLOSE</span>
          <button onClick={onClose} aria-label="Close viewer"
            style={{ width:24, height:24, border:'1px solid rgba(255,255,255,0.12)', borderRadius:1, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.4)', fontSize:14, transition:'border-color .15s, color .15s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=`${accent}70`;e.currentTarget.style.color=accent}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.12)';e.currentTarget.style.color='rgba(255,255,255,0.4)'}}
          >✕</button>
        </div>
      </div>

      {/* Image */}
      <div style={{ position:'relative', maxWidth:'82vw', maxHeight:'72vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
        {/* HUD corner brackets */}
        {[{top:0,left:0,bt:'borderTop',bl:'borderLeft'},{top:0,right:0,bt:'borderTop',bl:'borderRight'},{bottom:0,left:0,bt:'borderBottom',bl:'borderLeft'},{bottom:0,right:0,bt:'borderBottom',bl:'borderRight'}].map((p,i)=>(
          <div key={i} aria-hidden style={{ position:'absolute', ...p, width:14, height:14, [p.bt]:`1px solid ${accent}60`, [p.bl]:`1px solid ${accent}60`, zIndex:3, margin:6 }} />
        ))}
        <img
          src={r.src} alt={r.title}
          style={{ maxWidth:'82vw', maxHeight:'72vh', objectFit:'contain', borderRadius:1,
            opacity: fading ? 0 : 1, transition:'opacity .18s ease',
            boxShadow:`0 0 60px ${accent}18, 0 0 120px rgba(0,0,0,0.8)`,
          }}
        />
        {/* Scanline overlay */}
        <div aria-hidden style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)', pointerEvents:'none', zIndex:2 }} />
      </div>

      {/* Caption */}
      <div style={{ textAlign:'center' }}>
        <div style={{ fontFamily:'monospace', fontWeight:700, fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.72)' }}>{r.title}</div>
        <div style={{ fontFamily:'monospace', fontSize:7, letterSpacing:'0.12em', textTransform:'uppercase', color:`${accent}70`, marginTop:3 }}>{r.label}</div>
      </div>

      {/* Prev / Next */}
      <div style={{ display:'flex', gap:8 }}>
        {[[-1,'← PREV'], [1, 'NEXT →']].map(([dir, label]) => (
          <button key={dir} onClick={() => go(dir)} aria-label={label}
            style={{ padding:'5px 14px', border:`1px solid ${accent}40`, borderRadius:1, background:'transparent', cursor:'pointer', fontFamily:'monospace', fontSize:7, letterSpacing:'0.14em', textTransform:'uppercase', color:`${accent}80`, transition:'border-color .15s, color .15s, background .15s' }}
            onMouseEnter={e=>{e.currentTarget.style.background=`${accent}12`;e.currentTarget.style.borderColor=`${accent}90`;e.currentTarget.style.color=accent}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor=`${accent}40`;e.currentTarget.style.color=`${accent}80`}}
          >{label}</button>
        ))}
      </div>

      {/* Dot nav */}
      <div style={{ display:'flex', gap:6, marginTop:2 }}>
        {renders.map((_,i) => (
          <button key={i} onClick={() => { setFading(true); setTimeout(() => { setIdx(i); setFading(false) }, 180) }}
            aria-label={`View render ${i+1}`}
            style={{ width: i===idx?18:6, height:4, borderRadius:2, background: i===idx?accent:`${accent}30`, border:'none', cursor:'pointer', transition:'width .25s, background .2s', padding:0 }}
          />
        ))}
      </div>

      {/* Bottom HUD bar */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:28, borderTop:'1px solid rgba(255,255,255,0.06)', background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', gap:24 }}>
        {['← PREV RENDER','ESC · CLOSE','NEXT RENDER →'].map((t,i) => (
          <span key={i} style={{ fontFamily:'monospace', fontSize:6, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.18)' }}>{t}</span>
        ))}
      </div>
    </div>
  )
}

/* ── 3D render interactive gallery ──────────────────────────────── */
function RenderGallery({ c }) {
  const renders = c.renders ?? []
  const accent  = c.accentColor
  const [hov,   setHov]   = useState(-1)
  const [light, setLight] = useState(null)   /* index or null */

  if (!renders.length) return (
    <div style={{ fontFamily:'monospace', fontSize:7, color:'rgba(255,255,255,0.2)', letterSpacing:'0.14em', textTransform:'uppercase' }}>NO RENDERS AVAILABLE</div>
  )

  return (
    <>
      <div style={{ width:'94%', display:'grid', gridTemplateColumns: renders.length >= 3 ? '1fr 1fr 1fr' : '1fr 1fr', gap:5 }}>
        {renders.map((r, i) => (
          <div
            key={i}
            role="button" tabIndex={0} aria-label={`View ${r.title}`}
            onClick={() => setLight(i)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setLight(i) }}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(-1)}
            style={{ position:'relative', aspectRatio:'16/10', borderRadius:1, overflow:'hidden', cursor:'pointer',
              border: hov===i ? `1px solid ${accent}80` : '1px solid rgba(255,255,255,0.07)',
              boxShadow: hov===i ? `0 0 18px ${accent}30, inset 0 0 12px ${accent}08` : '0 0 0 transparent',
              transition:'border-color .2s, box-shadow .2s',
              background:'rgba(0,0,0,0.5)',
            }}
          >
            <img
              src={r.src} alt={r.title}
              style={{ width:'100%', height:'100%', objectFit:'cover', display:'block',
                transform: hov===i ? 'scale(1.06)' : 'scale(1)',
                transition:'transform .35s cubic-bezier(.34,1.56,.64,1)',
              }}
              loading="lazy"
            />
            {/* Scanlines */}
            <div aria-hidden style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 3px)', pointerEvents:'none', zIndex:1 }} />
            {/* Accent glow on hover */}
            <div aria-hidden style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 50% 100%,${accent}${hov===i?'22':'00'} 0%,transparent 70%)`, transition:'background .3s', pointerEvents:'none', zIndex:2 }} />
            {/* Filename label — slides up on hover */}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'14px 6px 4px 6px',
              background:'linear-gradient(0deg,rgba(0,0,0,0.82) 0%,transparent 100%)',
              transform: hov===i ? 'translateY(0)' : 'translateY(8px)',
              opacity: hov===i ? 1 : 0,
              transition:'opacity .22s, transform .22s',
              zIndex:3,
            }}>
              <div style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.12em', textTransform:'uppercase', color:`${accent}cc` }}>{r.label}</div>
              <div style={{ fontFamily:'monospace', fontSize:5, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginTop:1 }}>{r.title}</div>
            </div>
            {/* Corner brackets always visible */}
            {[{top:3,left:3,bt:'borderTop',bl:'borderLeft'},{top:3,right:3,bt:'borderTop',bl:'borderRight'},{bottom:3,left:3,bt:'borderBottom',bl:'borderLeft'},{bottom:3,right:3,bt:'borderBottom',bl:'borderRight'}].map((p,pi)=>(
              <div key={pi} aria-hidden style={{ position:'absolute', ...p, width:6, height:6, [p.bt]:`1px solid ${accent}${hov===i?'60':'25'}`, [p.bl]:`1px solid ${accent}${hov===i?'60':'25'}`, transition:'border-color .2s', zIndex:4 }} />
            ))}
            {/* Index badge */}
            <div style={{ position:'absolute', top:4, right:6, fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.12em', color:`${accent}55`, zIndex:4 }}>
              {String(i+1).padStart(2,'0')}
            </div>
          </div>
        ))}
      </div>

      {/* Instruction row */}
      <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
        <div style={{ width:3, height:3, borderRadius:'50%', background:accent, opacity:0.5 }} />
        <span style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)' }}>
          CLICK TO EXPAND · {renders.length} RENDER{renders.length>1?'S':''} ARCHIVED
        </span>
      </div>

      {/* Lightbox portal */}
      {light !== null && <HudLightbox renders={renders} startIdx={light} accent={accent} onClose={() => setLight(null)} />}
    </>
  )
}

/* ── SUNNY brand guideline panel ─────────────────────────────────── */
function SunnyBrandPanel({ c }) {
  const accent  = c.accentColor   /* #FBBF24 warm yellow */
  const BL = { fontFamily:'monospace', fontSize:6, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', marginBottom:5 }

  const palette = [
    { name:'WARM', hex:'#FBBF24' }, { name:'GOLDEN', hex:'#F59E0B' },
    { name:'AMBER', hex:'#D97706' }, { name:'LIME', hex:'#84cc16' }, { name:'CREAM', hex:'#FEF9C3' },
  ]

  return (
    <div style={{ width:'94%', display:'flex', flexDirection:'column', gap:9, overflowY:'auto', maxHeight:'100%' }}>

      {/* Logo + wordmark */}
      <div>
        <div style={BL}>BRAND MARK</div>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', border:`1px solid ${accent}18`, borderRadius:1, background:'rgba(0,0,0,0.35)' }}>
          <img src="/assets/sunny-logo.png" alt="Sunny logo"
            style={{ height:34, objectFit:'contain', filter:`drop-shadow(0 0 8px ${accent}55)`, mixBlendMode:'screen' }}
            onError={e => { e.currentTarget.style.display='none' }}
          />
          <div>
            <div style={{ fontFamily:'monospace', fontWeight:900, fontSize:16, letterSpacing:'-0.01em', textTransform:'uppercase', color:accent, lineHeight:1 }}>SUNNY</div>
            <div style={{ fontFamily:'monospace', fontSize:6, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', marginTop:2 }}>BRAND DESIGN · 2024</div>
          </div>
          <div style={{ marginLeft:'auto', textAlign:'right' }}>
            <div style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.12em', textTransform:'uppercase', color:`${accent}50` }}>CASE 02</div>
            <div style={{ fontFamily:'monospace', fontSize:5, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)', marginTop:1 }}>BRAND ARCHIVE</div>
          </div>
        </div>
      </div>

      {/* Color palette */}
      <div>
        <div style={BL}>PRIMARY PALETTE</div>
        <div style={{ display:'flex', gap:3 }}>
          {palette.map(({name,hex}) => (
            <div key={name} style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
              <div style={{ height:22, background:hex, borderRadius:1, border:`1px solid rgba(255,255,255,0.06)` }} />
              <div style={{ fontFamily:'monospace', fontSize:4.5, color:'rgba(255,255,255,0.35)', textAlign:'center' }}>{name}</div>
              <div style={{ fontFamily:'monospace', fontSize:4, color:'rgba(255,255,255,0.18)', textAlign:'center' }}>{hex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <div style={BL}>TYPOGRAPHY</div>
        <div style={{ padding:'7px 10px', border:`1px solid rgba(255,255,255,0.05)`, borderRadius:1, background:'rgba(0,0,0,0.25)' }}>
          <div style={{ fontFamily:'monospace', fontWeight:900, fontSize:22, letterSpacing:'-0.02em', textTransform:'uppercase', lineHeight:1, color:accent }}>Aa</div>
          <div style={{ fontFamily:'monospace', fontSize:6.5, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginTop:4 }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
          <div style={{ fontFamily:'monospace', fontSize:6, color:'rgba(255,255,255,0.15)', marginTop:2 }}>abcdefghijklmnopqrstuvwxyz  ·  0–9  ·  !@#$</div>
          <div style={{ display:'flex', gap:8, marginTop:5 }}>
            {[['DISPLAY','900','36px'],['HEADING','700','18px'],['BODY','400','11px']].map(([role,w,sz])=>(
              <div key={role}>
                <div style={{ fontFamily:'monospace', fontWeight:Number(w), fontSize:5, color:`${accent}80`, letterSpacing:'0.1em', textTransform:'uppercase' }}>{role}</div>
                <div style={{ fontFamily:'monospace', fontSize:5, color:'rgba(255,255,255,0.2)', marginTop:1 }}>{sz} · {w}w</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logo variations */}
      <div>
        <div style={BL}>LOGO VARIATIONS</div>
        <div style={{ display:'flex', gap:4 }}>
          {[
            { label:'FULL COLOR', bg:'#0f0a00', filter:`drop-shadow(0 0 6px ${accent}50)` },
            { label:'REVERSED',   bg:'#FEF9C3', filter:'invert(1) drop-shadow(0 0 3px rgba(0,0,0,0.3))' },
            { label:'MONO',       bg:'#1a1a1a', filter:'grayscale(1) brightness(1.4)' },
          ].map(({label,bg,filter})=>(
            <div key={label} style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
              <div style={{ height:36, background:bg, borderRadius:1, border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <img src="/assets/sunny-logo.png" alt={`${label} logo`} style={{ height:24, objectFit:'contain', mixBlendMode:'screen', filter }} onError={e=>{e.currentTarget.style.display='none'}} />
              </div>
              <div style={{ fontFamily:'monospace', fontSize:4.5, color:'rgba(255,255,255,0.22)', textAlign:'center', letterSpacing:'0.1em' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand values row */}
      <div>
        <div style={BL}>BRAND VALUES</div>
        <div style={{ display:'flex', gap:3 }}>
          {['WARM','PLAYFUL','BOLD','FRESH'].map((v,i) => (
            <div key={v} style={{ flex:1, padding:'4px 0', textAlign:'center', border:`1px solid ${accent}${22+i*8}`, borderRadius:1, background:`${accent}0${i+2}` }}>
              <span style={{ fontFamily:'monospace', fontSize:5, letterSpacing:'0.12em', textTransform:'uppercase', color:`${accent}${60+i*10}` }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Generic brand panel (AURA / MOTION) ─────────────────────────── */
/* ── Aura brand guideline panel ──────────────────────────────────── */
function AuraBrandPanel({ c }) {
  const accent = '#8A5CFF'
  const BL = { fontFamily:'monospace', fontSize:6, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', marginBottom:5 }

  const palette = [
    { name:'PRIMARY', hex:'#8A5CFF' },
    { name:'LIGHT',   hex:'#A87CFF' },
    { name:'DARK',    hex:'#6D36D8' },
    { name:'LIME',    hex:'#D8FF00' },
    { name:'BG',      hex:'#0B081A' },
  ]

  return (
    <div style={{ width:'94%', display:'flex', flexDirection:'column', gap:9, overflowY:'auto', maxHeight:'100%' }}>

      {/* Brand mark */}
      <div>
        <div style={BL}>BRAND MARK</div>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', border:`1px solid ${accent}18`, borderRadius:1, background:'rgba(0,0,0,0.35)' }}>
          <img src="/assets/aura-logo.png" alt="Aura logo"
            style={{ height:34, objectFit:'contain', filter:`drop-shadow(0 0 8px ${accent}55)`, mixBlendMode:'screen' }}
            onError={e => { e.currentTarget.style.display='none' }}
          />
          <div>
            <div style={{ fontFamily:'monospace', fontWeight:900, fontSize:16, letterSpacing:'-0.01em', textTransform:'uppercase', color:accent, lineHeight:1 }}>AURA</div>
            <div style={{ fontFamily:'monospace', fontSize:6, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', marginTop:2 }}>AI WELLNESS APP · 2026</div>
          </div>
          <div style={{ marginLeft:'auto', textAlign:'right' }}>
            <div style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.12em', textTransform:'uppercase', color:`${accent}50` }}>CASE 01</div>
            <div style={{ fontFamily:'monospace', fontSize:5, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)', marginTop:1 }}>BRAND ARCHIVE</div>
          </div>
        </div>
      </div>

      {/* Primary palette */}
      <div>
        <div style={BL}>PRIMARY PALETTE</div>
        <div style={{ display:'flex', gap:3 }}>
          {palette.map(({ name, hex }) => (
            <div key={name} style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
              <div style={{ height:22, background:hex, borderRadius:1, border:'1px solid rgba(255,255,255,0.06)' }} />
              <div style={{ fontFamily:'monospace', fontSize:4.5, color:'rgba(255,255,255,0.35)', textAlign:'center' }}>{name}</div>
              <div style={{ fontFamily:'monospace', fontSize:4, color:'rgba(255,255,255,0.18)', textAlign:'center' }}>{hex}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <div style={BL}>TYPOGRAPHY</div>
        <div style={{ padding:'7px 10px', border:'1px solid rgba(255,255,255,0.05)', borderRadius:1, background:'rgba(0,0,0,0.25)' }}>
          <div style={{ fontFamily:'monospace', fontWeight:900, fontSize:22, letterSpacing:'-0.02em', textTransform:'uppercase', lineHeight:1, color:accent }}>Aa</div>
          <div style={{ fontFamily:'monospace', fontSize:6.5, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginTop:4 }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
          <div style={{ fontFamily:'monospace', fontSize:6, color:'rgba(255,255,255,0.15)', marginTop:2 }}>abcdefghijklmnopqrstuvwxyz  ·  0–9  ·  !@#$</div>
          <div style={{ display:'flex', gap:8, marginTop:5 }}>
            {[['DISPLAY','900','36px'],['HEADING','700','18px'],['BODY','400','11px']].map(([role,w,sz]) => (
              <div key={role}>
                <div style={{ fontFamily:'monospace', fontWeight:Number(w), fontSize:5, color:`${accent}80`, letterSpacing:'0.1em', textTransform:'uppercase' }}>{role}</div>
                <div style={{ fontFamily:'monospace', fontSize:5, color:'rgba(255,255,255,0.2)', marginTop:1 }}>{sz} · {w}w</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logo variations */}
      <div>
        <div style={BL}>LOGO VARIATIONS</div>
        <div style={{ display:'flex', gap:4 }}>
          {[
            { label:'FULL COLOR',  bg:'#0B081A', filter:`drop-shadow(0 0 6px ${accent}50)`,              blend:'screen' },
            { label:'MONOCHROME',  bg:'#1a1a1a', filter:'grayscale(1) brightness(1.6)',                  blend:'screen' },
            { label:'SYMBOL',      bg:'#0d0a1a', filter:`drop-shadow(0 0 10px ${accent}70) brightness(1.2)`, blend:'screen' },
          ].map(({ label, bg, filter, blend }) => (
            <div key={label} style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
              <div style={{ height:36, background:bg, borderRadius:1, border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <img src="/assets/aura-logo.png" alt={`${label} logo`}
                  style={{ height: label === 'SYMBOL' ? 28 : 22, objectFit:'contain', mixBlendMode:blend, filter }}
                  onError={e => { e.currentTarget.style.display='none' }}
                />
              </div>
              <div style={{ fontFamily:'monospace', fontSize:4.5, color:'rgba(255,255,255,0.22)', textAlign:'center', letterSpacing:'0.1em' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand values */}
      <div>
        <div style={BL}>BRAND VALUES</div>
        <div style={{ display:'flex', gap:3 }}>
          {[['CALM',0],['INTELLIGENT',8],['MINIMAL',16],['FUTURISTIC',24]].map(([v, offset]) => (
            <div key={v} style={{ flex:1, padding:'4px 0', textAlign:'center', border:`1px solid ${accent}${(22 + offset).toString(16)}`, borderRadius:1, background:`${accent}0${Math.floor(offset/8) + 2}` }}>
              <span style={{ fontFamily:'monospace', fontSize: v.length > 8 ? 4 : 5, letterSpacing:'0.1em', textTransform:'uppercase', color:`${accent}${(60 + offset).toString(16)}` }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

function BrandPanel({ c }) {
  if (c.id === 'sunny') return <SunnyBrandPanel c={c} />
  if (c.id === 'aura')  return <AuraBrandPanel  c={c} />

  const palettes = {
    aura:   [['PRIMARY','#8A3CF7'],['LIGHT','#B06EFF'],['DARK','#5B21A8'],['LIME','#C8E500'],['BG','#0d0a1a']],
    motion: [['LIME','#C8E500'],['MID','#A3C200'],['DARK','#6B8200'],['GREEN','#22c55e'],['BG','#070d04']],
  }
  const colors = palettes[c.id] ?? palettes.aura
  const BL = { fontFamily:'monospace', fontSize:6, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.22)', marginBottom:5 }

  return (
    <div style={{ width:'92%', display:'flex', flexDirection:'column', gap:10 }}>
      <div>
        <div style={BL}>COLOR PALETTE</div>
        <div style={{ display:'flex', gap:3 }}>
          {colors.map(([name,col],i) => (
            <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', gap:2 }}>
              <div style={{ height:20, background:col, borderRadius:1 }} />
              <div style={{ fontFamily:'monospace', fontSize:4.5, color:'rgba(255,255,255,0.2)', textAlign:'center' }}>{name}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={BL}>TYPOGRAPHY</div>
        <div style={{ fontFamily:'monospace', fontWeight:900, fontSize:18, letterSpacing:'-0.02em', textTransform:'uppercase', color:c.accentColor, opacity:0.82, lineHeight:1 }}>{c.title}</div>
        <div style={{ fontFamily:'monospace', fontSize:7, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginTop:3 }}>ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
        <div style={{ fontFamily:'monospace', fontSize:6.5, color:'rgba(255,255,255,0.14)', marginTop:1 }}>0123456789  /  !@#$%&</div>
      </div>
      <div>
        <div style={BL}>ICON STYLE</div>
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          {['○','◇','△','□','⬡'].map((shape,i) => (
            <div key={i} style={{ fontFamily:'monospace', fontSize:14, color:c.accentColor, opacity:0.4+i*0.12 }}>{shape}</div>
          ))}
          <span style={{ fontFamily:'monospace', fontSize:6, color:'rgba(255,255,255,0.18)', marginLeft:2 }}>GEOMETRIC / MINIMAL</span>
        </div>
      </div>
      <div>
        <div style={BL}>BRAND ELEMENTS</div>
        <div style={{ display:'flex', gap:5 }}>
          {['WORDMARK','ICON','LOCKUP'].map(el => (
            <div key={el} style={{ flex:1, height:22, border:`1px solid ${c.accentColor}20`, borderRadius:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontFamily:'monospace', fontSize:5, letterSpacing:'0.12em', textTransform:'uppercase', color:`${c.accentColor}45` }}>{el}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Motion HERO — terminal archive intro ────────────────────────── */
function MotionHero() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => (t + 1) % 4), 600)
    return () => clearInterval(id)
  }, [])
  const dots = '.'.repeat(tick)

  const lines = [
    { t: 0.0, text: '> INITIALIZING VIDEO_ARCHIVE.db',   col: `${LIME}70` },
    { t: 0.4, text: '> LOADING MOTION_INDEX…',            col: `${LIME}55` },
    { t: 0.8, text: '> 6 RECORDS FOUND',                  col: `${LIME}aa` },
    { t: 1.2, text: '> 1 STREAM_READY  ·  5 PENDING',    col: 'rgba(255,255,255,0.45)' },
    { t: 1.6, text: '> SYS_MOTION_CORE — BUILD 204',     col: 'rgba(255,255,255,0.28)' },
    { t: 2.0, text: '> ARCHIVE ONLINE',                   col: '#22c55e' },
  ]

  return (
    <div style={{ width:'94%', display:'flex', flexDirection:'column', gap:12, alignItems:'center' }}>
      {/* Archive logo / title block */}
      <div style={{ textAlign:'center', padding:'12px 0 6px' }}>
        <div style={{ fontFamily:'monospace', fontWeight:900, fontSize:10, letterSpacing:'0.38em', textTransform:'uppercase', color:`${LIME}22`, marginBottom:4 }}>MOTION PRACTICE</div>
        <div style={{ fontFamily:'monospace', fontWeight:900, fontSize:26, letterSpacing:'0.06em', textTransform:'uppercase', color:LIME, lineHeight:1, textShadow:`0 0 24px ${LIME}55` }}>VIDEO_ARCHIVE</div>
        <div style={{ fontFamily:'monospace', fontSize:7, letterSpacing:'0.26em', textTransform:'uppercase', color:`${LIME}60`, marginTop:6 }}>SYS_MOTION_CORE · BUILD 204</div>
      </div>

      {/* Terminal readout */}
      <div style={{ width:'100%', background:'rgba(0,0,0,0.55)', border:`1px solid ${LIME}22`, borderRadius:1, padding:'10px 12px', display:'flex', flexDirection:'column', gap:3 }}>
        <div style={{ fontFamily:'monospace', fontSize:6, letterSpacing:'0.12em', color:`${LIME}50`, marginBottom:4 }}>── ARCHIVE BOOT LOG ──</div>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily:'monospace', fontSize:7, letterSpacing:'0.1em', color: l.col, animation:`cm-section-in 0.3s ease ${l.t}s both` }}>
            {l.text}{i === lines.length - 1 ? dots : ''}
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display:'flex', gap:4, width:'100%' }}>
        {[['TOTAL','6 CLIPS'],['READY','1 STREAM'],['PENDING','5 FILES'],['DURATION','~02:07']].map(([k,v]) => (
          <div key={k} style={{ flex:1, padding:'5px 4px', border:`1px solid ${LIME}18`, borderRadius:1, background:`${LIME}04`, textAlign:'center' }}>
            <div style={{ fontFamily:'monospace', fontSize:4.5, letterSpacing:'0.16em', textTransform:'uppercase', color:`${LIME}50`, marginBottom:2 }}>{k}</div>
            <div style={{ fontFamily:'monospace', fontSize:7, fontWeight:700, letterSpacing:'0.08em', color:`${LIME}bb` }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Hint */}
      <div style={{ fontFamily:'monospace', fontSize:6, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.2)', textAlign:'center' }}>
        → SWITCH TO [VIDEOS] TO BROWSE THE ARCHIVE
      </div>
    </div>
  )
}

/* ── Motion VIDEO ARCHIVE — featured player + list ───────────────── */
function MotionVideoArchive({ initialIndex }) {
  const [active,   setActive]   = useState(() => {
    const i = Number(initialIndex)
    return (i >= 0 && i < MOTION_VIDEOS.length) ? i : 0
  })
  const [playing,  setPlaying]  = useState(false)
  const [current,  setCurrent]  = useState(0)
  const [duration, setDuration] = useState(0)
  const [scrubHov, setScrubHov] = useState(false)
  const [hovRow,   setHovRow]   = useState(-1)
  const videoRef = useRef(null)
  const scrubRef = useRef(null)

  const vid = MOTION_VIDEOS[active]

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`

  /* Pause when unmounting (tab switch / modal close) */
  useEffect(() => () => { videoRef.current?.pause() }, [])

  /* Re-bind events when active video changes */
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    setCurrent(0); setDuration(0); setPlaying(false)
    const onMeta  = () => setDuration(v.duration || 0)
    const onTime  = () => setCurrent(v.currentTime)
    const onEnd   = () => { setPlaying(false); setCurrent(0); if(v) v.currentTime = 0 }
    const onPlay  = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    v.addEventListener('loadedmetadata', onMeta)
    v.addEventListener('timeupdate',     onTime)
    v.addEventListener('ended',          onEnd)
    v.addEventListener('play',           onPlay)
    v.addEventListener('pause',          onPause)
    return () => {
      v.removeEventListener('loadedmetadata', onMeta)
      v.removeEventListener('timeupdate',     onTime)
      v.removeEventListener('ended',          onEnd)
      v.removeEventListener('play',           onPlay)
      v.removeEventListener('pause',          onPause)
    }
  }, [active])

  const selectVideo = (i) => {
    if (i === active) return
    videoRef.current?.pause()
    setActive(i)
  }

  const togglePlay = () => {
    const v = videoRef.current
    if (!v || !vid.src) return
    playing ? v.pause() : v.play()
  }

  const scrubClick = (e) => {
    const v = videoRef.current
    if (!v || !duration) return
    const r = scrubRef.current.getBoundingClientRect()
    v.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * duration
  }

  const progress = duration > 0 ? current / duration : 0
  const catColor = CAT_COLORS[vid.cat] ?? LIME

  return (
    <div style={{ width:'96%', display:'flex', flexDirection:'column', gap:4 }}>

      {/* ── Featured player ── */}
      <div style={{ position:'relative', width:'100%', aspectRatio:'16/9', borderRadius:'2px 2px 0 0', overflow:'hidden', border:`1px solid ${LIME}30`, background:'#050905' }}>

        {/* Video element */}
        {vid.src
          ? <video key={vid.id} ref={videoRef} src={vid.src} style={{ width:'100%', height:'100%', display:'block', objectFit:'cover' }}
              playsInline preload="metadata" onContextMenu={e => e.preventDefault()} />
          : <div style={{ width:'100%', aspectRatio:'16/9', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, background:'linear-gradient(145deg,#050d03,#0a1506)' }}>
              <div style={{ fontFamily:'monospace', fontSize:7, letterSpacing:'0.18em', textTransform:'uppercase', color:`${LIME}35` }}>FILE PENDING</div>
              <div style={{ fontFamily:'monospace', fontSize:6, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.15)' }}>{vid.title}.mp4</div>
            </div>
        }

        {/* Scanlines */}
        <div aria-hidden style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none',
          backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 3px)' }} />

        {/* Vignette */}
        <div aria-hidden style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none',
          background:'radial-gradient(ellipse at 50% 50%,transparent 50%,rgba(0,0,0,0.55) 100%)' }} />

        {/* HUD labels — top */}
        <div aria-hidden style={{ position:'absolute', top:6, left:8, right:8, zIndex:4, pointerEvents:'none', display:'flex', justifyContent:'space-between' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:1.5 }}>
            <div style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.16em', textTransform:'uppercase', color:`${LIME}90`, textShadow:`0 0 6px ${LIME}55` }}>VIDEO_ARCHIVE</div>
            <div style={{ fontFamily:'monospace', fontSize:5, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', animation:'cm-flicker 4s ease-in-out infinite' }}>SYS_MOTION_CORE</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:1.5, alignItems:'flex-end' }}>
            <div style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)' }}>FPS 60</div>
            <div style={{ fontFamily:'monospace', fontSize:5, letterSpacing:'0.12em', textTransform:'uppercase',
              color: playing ? '#22c55e' : `${LIME}40`,
              textShadow: playing ? '0 0 6px rgba(34,197,94,0.6)' : 'none',
              transition:'color .3s',
            }}>{playing ? 'PLAYBACK ACTIVE' : 'STREAM_READY'}</div>
          </div>
        </div>

        {/* Category badge */}
        <div aria-hidden style={{ position:'absolute', top:6, left:'50%', transform:'translateX(-50%)', zIndex:4, pointerEvents:'none' }}>
          <div style={{ fontFamily:'monospace', fontSize:5, letterSpacing:'0.18em', textTransform:'uppercase', color:catColor, background:'rgba(0,0,0,0.65)', padding:'2px 7px', border:`1px solid ${catColor}40` }}>
            {vid.cat}
          </div>
        </div>

        {/* HUD corners */}
        {[{top:5,left:5,bt:'borderTop',bl:'borderLeft'},{top:5,right:5,bt:'borderTop',bl:'borderRight'},{bottom:5,left:5,bt:'borderBottom',bl:'borderLeft'},{bottom:5,right:5,bt:'borderBottom',bl:'borderRight'}].map((p,i)=>(
          <div key={i} aria-hidden style={{ position:'absolute',...p,width:8,height:8,[p.bt]:`1px solid ${LIME}50`,[p.bl]:`1px solid ${LIME}50`,zIndex:5 }} />
        ))}

        {/* Center play/pause overlay — fades out while playing */}
        <div style={{ position:'absolute', inset:0, zIndex:6, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6,
          opacity: playing ? 0 : 1, pointerEvents: playing ? 'none' : 'auto',
          transition:'opacity .3s', background: playing ? 'transparent' : 'rgba(0,0,0,0.2)',
        }}>
          <button onClick={togglePlay} aria-label={vid.src ? 'Play video' : 'File not available'}
            style={{ width:44, height:44, border:`1px solid ${LIME}${vid.src?'65':'22'}`, borderRadius:'50%',
              display:'flex', alignItems:'center', justifyContent:'center',
              background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)',
              cursor: vid.src ? 'pointer' : 'default',
              boxShadow: vid.src ? `0 0 16px ${LIME}22` : 'none',
              transition:'box-shadow .2s',
            }}
            onMouseEnter={e=>{ if(vid.src){ e.currentTarget.style.boxShadow=`0 0 24px ${LIME}50` } }}
            onMouseLeave={e=>{ e.currentTarget.style.boxShadow = vid.src ? `0 0 16px ${LIME}22` : 'none' }}
          >
            {vid.src
              ? <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden><path d="M6 4l14 8-14 8V4z" fill={LIME} opacity=".9"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden><rect x="5" y="11" width="14" height="10" rx="2" stroke={LIME} strokeWidth="1.5" strokeOpacity="0.3"/><path d="M8 11V7a4 4 0 1 1 8 0v4" stroke={LIME} strokeWidth="1.5" strokeOpacity="0.3" strokeLinecap="round"/></svg>
            }
          </button>
          <div style={{ fontFamily:'monospace', fontSize:6.5, letterSpacing:'0.18em', textTransform:'uppercase', color:`${LIME}${vid.src?'90':'35'}`, textShadow: vid.src ? `0 0 8px ${LIME}55` : 'none' }}>
            {vid.src ? 'PLAY' : 'FILE PENDING'}
          </div>
        </div>

        {/* Click to pause while playing */}
        {playing && <div onClick={togglePlay} style={{ position:'absolute', inset:0, zIndex:7, cursor:'pointer' }} role="button" aria-label="Pause" />}
      </div>

      {/* ── Progress + controls bar ── */}
      <div style={{ border:`1px solid ${LIME}18`, borderTop:'none', background:'rgba(0,0,0,0.75)', padding:'4px 8px 5px', display:'flex', flexDirection:'column', gap:3 }}>
        {/* Scrub */}
        <div ref={scrubRef} onClick={scrubClick}
          onMouseEnter={()=>setScrubHov(true)} onMouseLeave={()=>setScrubHov(false)}
          style={{ width:'100%', height: scrubHov ? 4 : 2, background:'rgba(255,255,255,0.07)', borderRadius:2, cursor: vid.src ? 'pointer' : 'default', position:'relative', overflow:'visible', transition:'height .15s' }}>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:`${progress*100}%`, background:`linear-gradient(90deg,${LIME}88,${LIME})`, borderRadius:2, boxShadow:`0 0 4px ${LIME}55`, transition:'width .12s linear' }} />
          <div style={{ position:'absolute', top:'50%', left:`${progress*100}%`, transform:'translate(-50%,-50%)', width: scrubHov?7:4, height: scrubHov?7:4, borderRadius:'50%', background:LIME, transition:'width .15s,height .15s' }} />
        </div>
        {/* Status row */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <div style={{ width:4, height:4, borderRadius:'50%', background: playing?'#22c55e':`${LIME}35`, boxShadow: playing?'0 0 5px rgba(34,197,94,0.8)':'none', transition:'background .3s,box-shadow .3s' }} />
            <span style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.12em', textTransform:'uppercase', color: playing?'#22c55e':'rgba(255,255,255,0.28)', transition:'color .3s' }}>
              {playing ? 'PLAYING' : vid.src ? 'READY' : 'PENDING'}
            </span>
          </div>
          <span style={{ fontFamily:'monospace', fontSize:6.5, letterSpacing:'0.08em', color:`${LIME}bb`, textShadow: playing?`0 0 6px ${LIME}55`:'none', transition:'text-shadow .3s' }}>
            {fmt(current)}&nbsp;<span style={{ color:'rgba(255,255,255,0.18)' }}>/</span>&nbsp;{duration>0 ? fmt(duration) : vid.dur}
          </span>
        </div>
      </div>

      {/* ── Prev / Next nav bar ── */}
      <div className="mv-nav-bar" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', border:`1px solid ${LIME}18`, borderTop:'none', background:'rgba(0,0,0,0.6)', padding:'4px 8px' }}>
        <button
          onClick={() => selectVideo((active - 1 + MOTION_VIDEOS.length) % MOTION_VIDEOS.length)}
          aria-label="Previous video"
          style={{ display:'flex', alignItems:'center', gap:4, background:'transparent', border:`1px solid ${LIME}30`, padding:'3px 8px', cursor:'pointer', fontFamily:'monospace', fontSize:6, letterSpacing:'0.14em', textTransform:'uppercase', color:`${LIME}bb`, transition:'border-color .15s, color .15s' }}
          onTouchStart={e => { e.currentTarget.style.borderColor=`${LIME}80`; e.currentTarget.style.color=LIME }}
          onTouchEnd={e => { e.currentTarget.style.borderColor=`${LIME}30`; e.currentTarget.style.color=`${LIME}bb` }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden><path d="M6 1L2 4l4 3" stroke={LIME} strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
          PREV
        </button>
        <div style={{ fontFamily:'monospace', fontSize:6, letterSpacing:'0.14em', color:'rgba(255,255,255,0.3)' }}>
          {String(active + 1).padStart(2,'0')} <span style={{ color:'rgba(255,255,255,0.15)' }}>/</span> {String(MOTION_VIDEOS.length).padStart(2,'0')}
        </div>
        <button
          onClick={() => selectVideo((active + 1) % MOTION_VIDEOS.length)}
          aria-label="Next video"
          style={{ display:'flex', alignItems:'center', gap:4, background:'transparent', border:`1px solid ${LIME}30`, padding:'3px 8px', cursor:'pointer', fontFamily:'monospace', fontSize:6, letterSpacing:'0.14em', textTransform:'uppercase', color:`${LIME}bb`, transition:'border-color .15s, color .15s' }}
          onTouchStart={e => { e.currentTarget.style.borderColor=`${LIME}80`; e.currentTarget.style.color=LIME }}
          onTouchEnd={e => { e.currentTarget.style.borderColor=`${LIME}30`; e.currentTarget.style.color=`${LIME}bb` }}
        >
          NEXT
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden><path d="M2 1l4 3-4 3" stroke={LIME} strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* ── Video list ── */}
      <div style={{ display:'flex', flexDirection:'column', gap:2, marginTop:1 }}>
        <div style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.2em', textTransform:'uppercase', color:`${LIME}45`, marginBottom:1 }}>── ARCHIVE · {MOTION_VIDEOS.length} RECORDS ──</div>
        {MOTION_VIDEOS.map((v, i) => {
          const isActive = i === active
          const cc = CAT_COLORS[v.cat] ?? LIME
          return (
            <div key={v.id}
              role="button" tabIndex={0} aria-label={`Load ${v.title}`} aria-pressed={isActive}
              onClick={() => selectVideo(i)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') selectVideo(i) }}
              onMouseEnter={() => setHovRow(i)} onMouseLeave={() => setHovRow(-1)}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'5px 7px', borderRadius:1, cursor:'pointer',
                border:`1px solid ${isActive ? `${LIME}55` : hovRow===i ? `${LIME}22` : 'rgba(255,255,255,0.05)'}`,
                background: isActive ? `${LIME}09` : hovRow===i ? `${LIME}04` : 'transparent',
                transition:'border-color .15s, background .15s',
              }}
            >
              {/* Active indicator bar */}
              <div style={{ width:2, height:28, borderRadius:1, background: isActive ? LIME : 'transparent', flexShrink:0, boxShadow: isActive ? `0 0 5px ${LIME}` : 'none', transition:'background .15s' }} />

              {/* Thumbnail or number badge */}
              <div style={{ width:32, height:20, border:`1px solid ${isActive ? `${LIME}60` : 'rgba(255,255,255,0.08)'}`, borderRadius:1, flexShrink:0, overflow:'hidden', position:'relative', background:'rgba(0,0,0,0.5)', transition:'border-color .15s' }}>
                {v.thumb
                  ? <img src={v.thumb} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', opacity: isActive ? 1 : 0.45, transition:'opacity .15s' }} />
                  : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontFamily:'monospace', fontSize:5, color: isActive ? LIME : 'rgba(255,255,255,0.2)' }}>{String(i+1).padStart(2,'0')}</span>
                    </div>
                }
                {isActive && playing && (
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.45)' }}>
                    <div style={{ width:5, height:5, background:LIME, borderRadius:1, animation:'cm-dot-pulse 1.2s ease-in-out infinite' }} />
                  </div>
                )}
              </div>

              {/* Title + meta */}
              <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column', gap:1.5 }}>
                <div style={{ fontFamily:'monospace', fontSize:7.5, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color: isActive ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.45)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', transition:'color .15s' }}>
                  {v.title}
                </div>
                <div style={{ display:'flex', gap:5, alignItems:'center' }}>
                  <span style={{ fontFamily:'monospace', fontSize:5, letterSpacing:'0.1em', textTransform:'uppercase', color:cc, opacity: isActive ? 0.85 : 0.5 }}>{v.cat}</span>
                  <span style={{ fontFamily:'monospace', fontSize:5, color:'rgba(255,255,255,0.18)' }}>·</span>
                  <span style={{ fontFamily:'monospace', fontSize:5, letterSpacing:'0.08em', color:'rgba(255,255,255,0.22)' }}>{v.tools[0]}</span>
                  <span style={{ fontFamily:'monospace', fontSize:5, color:'rgba(255,255,255,0.18)' }}>·</span>
                  <span style={{ fontFamily:'monospace', fontSize:5, letterSpacing:'0.08em', color:'rgba(255,255,255,0.22)' }}>{v.year}</span>
                </div>
              </div>

              {/* Right: duration + status */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:2, flexShrink:0 }}>
                <span style={{ fontFamily:'monospace', fontSize:6.5, letterSpacing:'0.06em', color: isActive ? `${LIME}cc` : 'rgba(255,255,255,0.25)' }}>{v.dur}</span>
                <span style={{ fontFamily:'monospace', fontSize:4.5, letterSpacing:'0.12em', textTransform:'uppercase',
                  color: v.status === 'READY' ? '#22c55e' : 'rgba(255,255,255,0.2)',
                }}>{v.status}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Motion CATEGORIES ────────────────────────────────────────────── */
function MotionCategories() {
  const [active, setActive] = useState(null)

  const cats = Object.entries(
    MOTION_VIDEOS.reduce((acc, v) => { acc[v.cat] = (acc[v.cat]||[]).concat(v); return acc }, {})
  )

  const filtered = active ? MOTION_VIDEOS.filter(v => v.cat === active) : []

  return (
    <div style={{ width:'94%', display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ fontFamily:'monospace', fontSize:6, letterSpacing:'0.2em', textTransform:'uppercase', color:`${LIME}45` }}>── CATEGORY INDEX ──</div>

      {/* Category pills */}
      <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
        {cats.map(([cat, vids]) => {
          const cc = CAT_COLORS[cat] ?? LIME
          const isActive = active === cat
          return (
            <div key={cat}
              role="button" tabIndex={0} aria-pressed={isActive}
              onClick={() => setActive(isActive ? null : cat)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setActive(isActive ? null : cat) }}
              style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 10px', border:`1px solid ${isActive ? `${cc}60` : 'rgba(255,255,255,0.07)'}`, borderRadius:1, cursor:'pointer',
                background: isActive ? `${cc}0a` : 'rgba(0,0,0,0.25)', transition:'border-color .18s,background .18s',
              }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:cc, opacity: isActive ? 0.9 : 0.35, transition:'opacity .18s' }} />
                <span style={{ fontFamily:'monospace', fontSize:8, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.38)', transition:'color .18s' }}>{cat}</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontFamily:'monospace', fontSize:6, letterSpacing:'0.08em', color: isActive ? cc : 'rgba(255,255,255,0.25)' }}>
                  {vids.filter(v=>v.status==='READY').length}/{vids.length} READY
                </span>
                <span style={{ fontFamily:'monospace', fontSize:7, color: isActive ? cc : 'rgba(255,255,255,0.2)' }}>{isActive?'▾':'▸'}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Expanded video list for active category */}
      {active && (
        <div style={{ display:'flex', flexDirection:'column', gap:2, paddingLeft:4, borderLeft:`1px solid ${(CAT_COLORS[active]??LIME)}25`, animation:'cm-section-in 0.25s ease both' }}>
          {filtered.map(v => (
            <div key={v.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'4px 8px', background:'rgba(0,0,0,0.22)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:1 }}>
              <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
                <span style={{ fontFamily:'monospace', fontSize:7, letterSpacing:'0.06em', textTransform:'uppercase', color:'rgba(255,255,255,0.6)' }}>{v.title}</span>
                <span style={{ fontFamily:'monospace', fontSize:5, color:'rgba(255,255,255,0.22)' }}>{v.tools.join(' · ')} · {v.year}</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:1 }}>
                <span style={{ fontFamily:'monospace', fontSize:6, color:`${LIME}80` }}>{v.dur}</span>
                <span style={{ fontFamily:'monospace', fontSize:4.5, letterSpacing:'0.1em', textTransform:'uppercase', color: v.status==='READY'?'#22c55e':'rgba(255,255,255,0.2)' }}>{v.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!active && (
        <div style={{ fontFamily:'monospace', fontSize:6, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.18)', textAlign:'center', marginTop:4 }}>
          SELECT A CATEGORY TO EXPAND
        </div>
      )}
    </div>
  )
}

/* ── Motion INFO ──────────────────────────────────────────────────── */
function MotionInfo() {
  const tools = [
    ['After Effects', 'PRIMARY'],['Blender', 'PRIMARY'],['Premier Pro', 'SECONDARY'],
    ['CapCut', 'SECONDARY'],['Kling', 'AI'],['Runway', 'AI'],['ChatGPT', 'AI'],
  ]
  const workflow = [
    { step:'01', label:'CONCEPT', desc:'Idea / storyboard / reference gathering' },
    { step:'02', label:'DESIGN',  desc:'Figma / Blender — visual style frames' },
    { step:'03', label:'ANIMATE', desc:'After Effects — timing, curves, motion' },
    { step:'04', label:'RENDER',  desc:'Export / optimize / format for platform' },
    { step:'05', label:'PUBLISH', desc:'Social / portfolio / client delivery' },
  ]

  return (
    <div style={{ width:'94%', display:'flex', flexDirection:'column', gap:9 }}>
      {/* Purpose */}
      <div>
        <div style={{ fontFamily:'monospace', fontSize:6, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', marginBottom:5 }}>PURPOSE</div>
        <div style={{ fontFamily:'monospace', fontSize:7.5, lineHeight:1.6, color:'rgba(255,255,255,0.45)' }}>
          An ongoing archive of motion experiments — typography, product visuals, ads and brand storytelling. Each piece explores a different visual style, rhythm and technique.
        </div>
      </div>

      {/* Tools */}
      <div>
        <div style={{ fontFamily:'monospace', fontSize:6, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', marginBottom:5 }}>TOOLS / SOFTWARE</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
          {tools.map(([name, tier]) => (
            <div key={name} style={{ padding:'3px 8px', border:`1px solid ${tier==='AI'?'#06b6d4':tier==='PRIMARY'?`${LIME}40`:'rgba(255,255,255,0.1)'}`, borderRadius:1, display:'flex', alignItems:'center', gap:4 }}>
              <div style={{ width:3, height:3, borderRadius:'50%', background: tier==='AI'?'#06b6d4':tier==='PRIMARY'?LIME:'rgba(255,255,255,0.25)' }} />
              <span style={{ fontFamily:'monospace', fontSize:7, letterSpacing:'0.08em', textTransform:'uppercase', color: tier==='AI'?'#06b6d4':tier==='PRIMARY'?`${LIME}cc`:'rgba(255,255,255,0.35)' }}>{name}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:8, marginTop:5 }}>
          {[['●','PRIMARY',LIME],['●','AI','#06b6d4'],['●','SECONDARY','rgba(255,255,255,0.3)']].map(([dot,l,c])=>(
            <div key={l} style={{ display:'flex', alignItems:'center', gap:3 }}>
              <span style={{ fontSize:6, color:c }}>●</span>
              <span style={{ fontFamily:'monospace', fontSize:5, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.22)' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow */}
      <div>
        <div style={{ fontFamily:'monospace', fontSize:6, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', marginBottom:5 }}>WORKFLOW</div>
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {workflow.map((w, i) => (
            <div key={w.step} style={{ display:'flex', gap:8, alignItems:'flex-start', animation:`cm-section-in 0.3s ease ${i*0.06}s both` }}>
              <div style={{ fontFamily:'monospace', fontSize:6, color:`${LIME}50`, flexShrink:0, paddingTop:1 }}>{w.step}</div>
              <div style={{ width:1, alignSelf:'stretch', background:`${LIME}15`, flexShrink:0, marginTop:2 }} />
              <div>
                <div style={{ fontFamily:'monospace', fontSize:7, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:`${LIME}90` }}>{w.label}</div>
                <div style={{ fontFamily:'monospace', fontSize:6, color:'rgba(255,255,255,0.3)', marginTop:1 }}>{w.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Tab content router ───────────────────────────────────────────── */
/* ── Aura MOTION — cinematic ad video ────────────────────────────── */
function AuraMotionArchive() {
  const accent = '#8A3CF7'

  return (
    <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:0, position:'relative' }}>

      {/* HUD frame */}
      <div style={{ position:'relative', width:'100%', borderRadius:'2px 2px 0 0', overflow:'hidden', border:`1px solid ${accent}40`, boxShadow:`0 0 24px ${accent}14` }}>

        {/* Native video — controls for voiceover/music */}
        <video
          src="/assets/aura-cinematic-ad.mp4"
          controls
          playsInline
          preload="metadata"
          style={{ width:'100%', display:'block', maxWidth:'100%', background:'#000' }}
        />

        {/* HUD corner brackets */}
        {[{top:6,left:6,bt:'borderTop',bl:'borderLeft'},{top:6,right:6,bt:'borderTop',bl:'borderRight'},{bottom:6,left:6,bt:'borderBottom',bl:'borderLeft'},{bottom:6,right:6,bt:'borderBottom',bl:'borderRight'}].map((p,i)=>(
          <div key={i} aria-hidden style={{ position:'absolute', ...p, width:9, height:9, [p.bt]:`1px solid ${accent}55`, [p.bl]:`1px solid ${accent}55`, zIndex:5, pointerEvents:'none' }} />
        ))}

        {/* Top HUD label */}
        <div aria-hidden style={{ position:'absolute', top:8, left:10, right:10, zIndex:4, pointerEvents:'none', display:'flex', justifyContent:'space-between' }}>
          <div style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.16em', textTransform:'uppercase', color:`${accent}90`, textShadow:`0 0 6px ${accent}55` }}>SYS_AURA_MOTION</div>
          <div style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)' }}>BUILD 826</div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{ border:`1px solid ${accent}22`, borderTop:'none', borderRadius:'0 0 2px 2px', background:'rgba(0,0,0,0.72)', padding:'5px 10px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          <div style={{ width:4, height:4, borderRadius:'50%', background:`${accent}80`, flexShrink:0, animation:'cm-dot-pulse 2.4s ease-in-out infinite' }} />
          <span style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.12em', textTransform:'uppercase', color:`${accent}90` }}>AURA · CINEMATIC AD</span>
        </div>
        <span style={{ fontFamily:'monospace', fontSize:5.5, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.22)' }}>
          AURA-CINEMATIC-AD.MP4
        </span>
      </div>
    </div>
  )
}

function TabContent({ tabKey, c, initialVideoIndex }) {
  if (tabKey === 'BRAND') return <BrandPanel c={c} />
  if (tabKey === '3D')    return <RenderGallery c={c} />
  if (tabKey === 'UX' && c.id === 'aura') return <AuraUxShowcase accent={c.accentColor} />
  if (tabKey === 'UX')    return <UxSlideshow accent={c.accentColor} tabKey={tabKey} />
  if (tabKey === 'MOTION' && c.id === 'aura') return <AuraMotionArchive />
  if (tabKey === 'MOTION' || tabKey === 'ADS' || tabKey === 'PRODUCT')
    return <VideoPlayer accent={c.accentColor} c={c} label={tabKey} />
  /* Motion Practice archive tabs */
  if (c.id === 'motion' && tabKey === 'HERO')   return <MotionHero />
  if (c.id === 'motion' && tabKey === 'VIDEOS') return <MotionVideoArchive initialIndex={initialVideoIndex} />
  if (c.id === 'motion' && tabKey === 'CAT')    return <MotionCategories />
  if (c.id === 'motion' && tabKey === 'INFO')   return <MotionInfo />
  /* HERO / TYPE / default — with idle float animation */
  return c.logo
    ? <img src={c.logo.src} alt={c.logo.alt}
        style={{ maxWidth: c.logo.wide ? '90%' : '70%', maxHeight: 210, objectFit: 'contain', filter: `drop-shadow(0 0 28px ${c.logoGlow}) drop-shadow(0 0 60px ${c.logoGlow}55)`, mixBlendMode: 'screen', position: 'relative', zIndex: 1, animation: 'cm-hero-idle 8s ease-in-out infinite' }}
        onError={e => { e.currentTarget.style.opacity = '0' }}
      />
    : <MotionPreview accent={c.accentColor} />
}

/* ── Futuristic module loading overlay ───────────────────────────── */
function ModuleLoader({ phase, moduleName, accent }) {
  if (phase === 'idle') return null
  return (
    <div aria-hidden style={{
      position:'absolute', inset:0, zIndex:9,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4,
      background:'rgba(0,0,0,0.88)',
      opacity: phase === 'loading' ? 1 : 0,
      transition: phase === 'revealing' ? 'opacity 0.22s ease' : 'none',
      backdropFilter: 'blur(2px)',
    }}>
      <div style={{ fontFamily:'monospace', fontSize:7, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', animation:'cm-ldr-line 0.07s ease both' }}>LOADING MODULE...</div>
      <div style={{ fontFamily:'monospace', fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:accent, animation:'cm-ldr-line 0.07s ease 0.04s both' }}>{moduleName}.dll</div>
      <div style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'0.04em', color:accent, animation:'cm-ldr-bar 0.16s ease 0.06s both', overflow:'hidden', whiteSpace:'nowrap' }}>██████████</div>
      <div style={{ fontFamily:'monospace', fontSize:7, letterSpacing:'0.14em', textTransform:'uppercase', color:'#22c55e', animation:'cm-ldr-line 0.07s ease 0.18s both' }}>VERIFIED.</div>
      <div style={{ fontFamily:'monospace', fontSize:7, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', animation:'cm-ldr-line 0.07s ease 0.21s both' }}>OPENING...</div>
    </div>
  )
}

/* ── Thumbnail strip — clickable tabs ───────────────────────────── */
function ThumbStrip({ thumbs, accentColor, activeTab, onTabChange }) {
  return (
    <div style={{ width: 54, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', padding: '7px 5px', gap: 5, background: 'rgba(0,0,0,0.35)' }}>
      {thumbs.map((t, i) => {
        const active = i === activeTab
        return (
          <div
            key={i}
            role="button" tabIndex={0} aria-label={`${t.t} view`} aria-pressed={active}
            onClick={() => onTabChange(i)}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onTabChange(i) }}
            style={{
              width: '100%', height: 46, borderRadius: 1, flexShrink: 0,
              background: t.g,
              border: active ? `1px solid ${accentColor}90` : '1px solid rgba(255,255,255,0.04)',
              boxShadow: active ? `0 0 10px ${accentColor}22,inset 0 0 6px ${accentColor}08` : 'none',
              position: 'relative', overflow: 'hidden',
              cursor: 'pointer',
              transition: 'border-color .18s, box-shadow .18s, opacity .15s',
              opacity: active ? 1 : 0.6,
            }}
          >
            {active && <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: accentColor, boxShadow: `0 0 5px ${accentColor}` }} />}
            <div style={{ position: 'absolute', bottom: 3, left: 0, right: 0, textAlign: 'center', fontFamily: 'monospace', fontSize: 5, letterSpacing: '0.1em', color: active ? `${accentColor}cc` : 'rgba(255,255,255,0.18)' }}>{t.t}</div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Preview panel (left side) ───────────────────────────────────── */
function PreviewPanel({ c, visual, activeTab, onTabChange, initialVideoIndex }) {
  const mainRef    = useRef(null)
  const contentRef = useRef(null)
  const plxTarget  = useRef({ x: 0, y: 0 })
  const plxRaf     = useRef(null)

  /* Local tab state drives display; parent activeTab stays in sync after load */
  const [localTab,  setLocalTab]  = useState(activeTab)
  const [loadPhase, setLoadPhase] = useState('idle')   /* 'idle' | 'loading' | 'revealing' */
  const [pendingTab, setPendingTab] = useState(null)

  /* Sync when parent idx changes (case navigation resets to 0) */
  useEffect(() => { setLocalTab(activeTab); setLoadPhase('idle') }, [activeTab])

  /* Intercept tab clicks — run loading sequence */
  const handleTabClick = (i) => {
    if (i === localTab || loadPhase !== 'idle') return
    setPendingTab(i)
    setLoadPhase('loading')
    /* 230ms loading display → fade out → swap content */
    setTimeout(() => {
      setLoadPhase('revealing')
      setTimeout(() => {
        setLocalTab(i)
        onTabChange(i)
        setLoadPhase('idle')
        setPendingTab(null)
      }, 220)
    }, 230)
  }

  /* Rare micro-glitch */
  useEffect(() => {
    let t
    const schedule = () => {
      t = setTimeout(() => {
        const el = mainRef.current
        if (el) { el.classList.add('cm-preview-glitch'); setTimeout(() => el.classList.remove('cm-preview-glitch'), 300) }
        schedule()
      }, 9000 + Math.random() * 14000)
    }
    schedule()
    return () => clearTimeout(t)
  }, [c.id])

  /* Cursor parallax */
  useEffect(() => {
    let lx = 0, ly = 0
    const tick = () => {
      lx += (plxTarget.current.x - lx) * 0.055
      ly += (plxTarget.current.y - ly) * 0.055
      if (contentRef.current) contentRef.current.style.transform = `translate(${lx.toFixed(2)}px,${ly.toFixed(2)}px)`
      plxRaf.current = requestAnimationFrame(tick)
    }
    plxRaf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(plxRaf.current)
  }, [])

  const onMouseMove = (e) => {
    const r = mainRef.current?.getBoundingClientRect()
    if (!r) return
    plxTarget.current = {
      x: ((e.clientX - r.left) / r.width  - 0.5) * 10,
      y: ((e.clientY - r.top)  / r.height - 0.5) * 8,
    }
  }
  const onMouseLeave = () => { plxTarget.current = { x: 0, y: 0 } }

  const tabKey = visual.tabs?.[localTab] ?? 'HERO'
  const loaderModName = pendingTab !== null ? (MODULE_NAMES[visual.tabs?.[pendingTab]] ?? 'MODULE') : 'MODULE'

  return (
    <div className="cm-left" style={{
      width: '42%', flexShrink: 0,
      background: c.gradient,
      display: 'flex', flexDirection: 'row',
      position: 'relative', overflow: 'hidden',
      borderRight: '1px solid rgba(255,255,255,0.05)',
    }}>
      <ThumbStrip thumbs={visual.thumbs} accentColor={c.accentColor} activeTab={localTab} onTabChange={handleTabClick} />

      <div ref={mainRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

        {/* Drifting scanlines */}
        <div aria-hidden style={{
          position: 'absolute', top: '-8px', left: 0, right: 0, bottom: '-8px', pointerEvents: 'none', zIndex: 2,
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.075) 3px,rgba(0,0,0,0.075) 4px)',
          animation: 'cm-scan-drift 9s linear infinite',
        }} />

        {/* Sweep beam */}
        <div aria-hidden style={{
          position: 'absolute', left: 0, right: 0, height: 2, zIndex: 5, pointerEvents: 'none',
          background: `linear-gradient(90deg,transparent,${c.accentColor}55,${c.accentColor}99,${c.accentColor}55,transparent)`,
          animation: `cm-scan-sweep 11s cubic-bezier(0.4,0,0.6,1) ${c.id === 'aura' ? '0s' : c.id === 'sunny' ? '3.5s' : '7s'} infinite`,
          boxShadow: `0 0 6px ${c.accentColor}66`,
        }} />

        {/* HUD pulse border */}
        <div aria-hidden style={{
          position: 'absolute', inset: 2, border: `1px solid ${c.accentColor}`, pointerEvents: 'none', zIndex: 3,
          animation: 'cm-hud-border-pulse 4s ease-in-out infinite',
        }} />

        {/* Accent bloom */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: `radial-gradient(ellipse at 50% 38%,${c.logoGlow} 0%,transparent 62%)`,
          opacity: 0.55,
        }} />

        <HudCorners size={9} thick={1} color="rgba(255,255,255,0.18)" inset={6} />
        <FloatingParticles accent={c.accentColor} />
        {visual.showOrbit && <AuraOrbit accent={c.accentColor} simple={visual.orbitSimple ?? false} />}

        {/* Parallax content wrapper — stable ref, tab content keyed inside */}
        <div ref={contentRef} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 3, padding: '18px 14px', willChange: 'transform' }}>
          <div key={`${c.id}-${tabKey}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', animation: 'cm-tab-in 0.28s ease both' }}>
            <TabContent tabKey={tabKey} c={c} initialVideoIndex={initialVideoIndex} />
          </div>
        </div>

        {/* HUD metadata block */}
        <HudMeta visual={visual} accent={c.accentColor} />

        {/* Flickering HUD labels */}
        <div aria-hidden style={{ position: 'absolute', inset: 10, zIndex: 4, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: c.accentColor, boxShadow: `0 0 5px ${c.accentColor}`, animation: 'cm-dot-pulse 2.2s ease-in-out infinite' }} />
            <FlickerLabel delay="0s" style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)' }}>{visual.sys}</FlickerLabel>
          </div>
          <div style={{ position: 'absolute', top: 0, right: 0 }}>
            <FlickerLabel delay="3.7s" style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>{visual.build}</FlickerLabel>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0 }}>
            <FlickerLabel delay="7.1s" style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>{visual.record}</FlickerLabel>
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
            <FlickerLabel delay="2.0s" style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', color: visual.sysColor, fontWeight: 700 }}>{visual.sysLabel}</FlickerLabel>
          </div>
        </div>

        {/* Module loading overlay */}
        <ModuleLoader phase={loadPhase} moduleName={loaderModName} accent={c.accentColor} />

        {/* Bottom meta strip */}
        <div style={{ position: 'relative', zIndex: 4, flexShrink: 0, padding: '8px 13px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.52)' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)' }}>
            STATUS:&nbsp;<span style={{ color: c.status.color, fontWeight: 700 }}>{c.status.label}</span>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>
            {c.type} · {c.year}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Shared micro-styles ─────────────────────────────────────────── */
const SEC_LABEL = { fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.22em', textTransform: 'uppercase', color: `${LIME}65`, marginBottom: 5 }
const MONO_SM   = { fontFamily: 'monospace', fontSize: 10, lineHeight: 1.65, color: 'rgba(255,255,255,0.50)' }
const DIV_LINE  = { height: 1, background: '#1a1a1a', margin: '10px 0' }

/* Staged reveal: each section fades+slides in with a delay */
const reveal = (delay) => ({
  animation: `cm-section-in 0.45s ease ${delay} both`,
})

/* ── Right detail panel ──────────────────────────────────────────── */
function DetailPanel({ c, onBlockedLink }) {
  const s = c.sections ?? {}
  const [archPhase, setArchPhase] = useState('idle')  /* 'idle'|'connecting'|'opening' */

  const openArchive = () => {
    if (archPhase !== 'idle') return
    setArchPhase('connecting')
    setTimeout(() => setArchPhase('opening'), 200)
    setTimeout(() => {
      window.open(c.link, '_blank', 'noopener,noreferrer')
      setArchPhase('idle')
    }, 480)
  }
  return (
    <div className="cm-scroll cm-right" style={{ flex: 1, overflowY: 'auto', padding: '16px 22px 18px 18px', position: 'relative', zIndex: 2 }}>
      {/* Subtle grid */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.014) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.014) 1px,transparent 1px)', backgroundSize: '44px 44px' }} />
      {/* Left lime bar */}
      <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg,transparent 0%,${LIME} 18%,${LIME} 82%,transparent 100%)`, opacity: 0.32 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header: badge + title + subtitle ── */}
        <div style={reveal('0.20s')}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 8, border: `1px solid ${LIME}28`, padding: '2px 9px 2px 6px' }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: LIME, opacity: 0.6 }} />
            <span style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${LIME}70` }}>CASE {c.num}</span>
          </div>
          <h2 style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: 'clamp(22px,2.6vw,36px)', lineHeight: 0.92, letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#fff', textShadow: '0 0 30px rgba(255,255,255,0.07)', marginBottom: 6 }}>
            {c.title}
          </h2>
          <div style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: LIME, marginBottom: 10 }}>
            {c.subtitle}
          </div>
          <div style={{ height: 1, background: `linear-gradient(90deg,${LIME}45,rgba(255,255,255,0.04) 40%,transparent)`, marginBottom: 10 }} />
        </div>

        {/* ── OVERVIEW + KEY FEATURES + GOAL ── */}
        <div style={reveal('0.36s')}>
          {s.overview && (
            <div style={{ marginBottom: 8 }}>
              <div style={SEC_LABEL}>OVERVIEW</div>
              <p style={MONO_SM}>{s.overview}</p>
            </div>
          )}
          {s.keyFeatures?.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={SEC_LABEL}>KEY FEATURES</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 12px' }}>
                {s.keyFeatures.map(f => (
                  <div key={f} style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.42)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: c.accentColor, fontSize: 6 }}>▸</span>{f}
                  </div>
                ))}
              </div>
            </div>
          )}
          {s.goal && (
            <div style={{ marginBottom: 0 }}>
              <div style={SEC_LABEL}>GOAL</div>
              <p style={{ ...MONO_SM, fontStyle: 'italic', color: 'rgba(255,255,255,0.34)', fontSize: 9 }}>{s.goal}</p>
            </div>
          )}
          <div style={DIV_LINE} />
        </div>

        {/* ── SYSTEM INFO ── */}
        {c.sysInfo?.length > 0 && (
          <div style={{ ...reveal('0.52s'), marginBottom: 0 }}>
            <div style={SEC_LABEL}>SYSTEM INFO</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 0 }}>
              {c.sysInfo.map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', minWidth: 70, flexShrink: 0 }}>{f.label}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.06em', textTransform: 'uppercase', color: f.color ?? 'rgba(255,255,255,0.60)', fontWeight: f.color ? 700 : 400 }}>
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
            <div style={DIV_LINE} />
          </div>
        )}

        {/* ── PROCESS ── */}
        {c.progress?.length > 0 && (
          <div style={{ ...reveal('0.66s'), marginBottom: 0 }}>
            <div style={SEC_LABEL}>PROCESS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {c.progress.map(p => {
                const filled = '■'.repeat(p.fill)
                const empty  = '□'.repeat(10 - p.fill)
                return (
                  <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', minWidth: 78, flexShrink: 0 }}>{p.label}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.05em', color: c.accentColor }}>{filled}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.10)' }}>{empty}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.22)', marginLeft: 'auto', flexShrink: 0 }}>{p.fill * 10}%</span>
                  </div>
                )
              })}
            </div>
            <div style={DIV_LINE} />
          </div>
        )}

        {/* ── TOOLS + CTA ── */}
        <div style={reveal('0.80s')}>
          <div style={{ ...SEC_LABEL, marginBottom: 6 }}>TOOLS / SOFTWARE</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
            {c.tools.map(t => (
              <span key={t} style={{ fontFamily: 'monospace', fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.40)', border: '1px solid #1e1e1e', padding: '3px 9px' }}>{t}</span>
            ))}
          </div>

          {(() => {
            const isExternal = c.link?.startsWith('http')

            if (isExternal) return (
              <div style={{ position: 'relative' }}>
                {/* Terminal readout — slides up during sequence */}
                <div aria-hidden style={{
                  position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: 4,
                  background: 'rgba(0,0,0,0.88)', border: `1px solid ${LIME}28`,
                  padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 2,
                  opacity: archPhase !== 'idle' ? 1 : 0,
                  transform: archPhase !== 'idle' ? 'translateY(0)' : 'translateY(4px)',
                  transition: 'opacity .12s ease, transform .12s ease',
                  pointerEvents: 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily:'monospace', fontSize:7, color:`${LIME}80`, letterSpacing:'0.1em' }}>›</span>
                    <span style={{ fontFamily:'monospace', fontSize:7, letterSpacing:'0.14em', textTransform:'uppercase',
                      color: LIME, animation: archPhase === 'connecting' ? 'cm-flicker 0.15s ease infinite' : 'none',
                    }}>CONNECTING...</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6,
                    opacity: archPhase === 'opening' ? 1 : 0,
                    transition: 'opacity .1s ease',
                  }}>
                    <span style={{ fontFamily:'monospace', fontSize:7, color:`${LIME}80`, letterSpacing:'0.1em' }}>›</span>
                    <span style={{ fontFamily:'monospace', fontSize:7, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)' }}>
                      OPENING EXTERNAL ARCHIVE
                    </span>
                  </div>
                </div>

                {/* CTA button */}
                <button
                  onClick={openArchive}
                  disabled={archPhase !== 'idle'}
                  className={`cm-btn-primary${archPhase !== 'idle' ? ' cm-btn-launching' : ''}`}
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'11px 18px', boxSizing:'border-box', background: archPhase !== 'idle' ? `${LIME}cc` : LIME, color:'#000', fontFamily:'monospace', fontWeight:900, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', border:'none', cursor: archPhase !== 'idle' ? 'wait' : 'pointer', position:'relative', overflow:'hidden', transition:'background .15s' }}
                >
                  <span style={{ opacity: archPhase !== 'idle' ? 0.5 : 1, transition:'opacity .15s' }}>
                    {archPhase === 'idle' ? 'OPEN ARCHIVE' : archPhase === 'connecting' ? 'CONNECTING...' : 'OPENING...'}
                  </span>
                  <span className="cm-btn-arrow" style={{ fontSize:15, display:'inline-block', opacity: archPhase !== 'idle' ? 0.4 : 1, transition:'opacity .15s' }}>→</span>
                </button>
              </div>
            )

            if (c.link) return (
              <button onClick={onBlockedLink} className="cm-btn-primary"
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'11px 18px', boxSizing:'border-box', background: LIME, color:'#000', fontFamily:'monospace', fontWeight:900, fontSize:10, letterSpacing:'0.22em', textTransform:'uppercase', border:'none', cursor:'pointer', position:'relative', overflow:'hidden' }}
              >
                <span>OPEN ARCHIVE</span>
                <span className="cm-btn-arrow" style={{ fontSize:15, display:'inline-block' }}>→</span>
              </button>
            )

            return (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'11px 18px', boxSizing:'border-box', border:'1px solid #1e1e1e', fontFamily:'monospace', fontWeight:700, fontSize:9, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.13)' }}>
                <span>{c.linkLabel ?? 'COMING SOON'}</span>
                <span style={{ fontSize:7, letterSpacing:'0.1em', color:'rgba(255,255,255,0.07)' }}>{c.linkLabel ? 'FINAL MOTION BUILD' : 'NO EXTERNAL BUILD YET'}</span>
              </div>
            )
          })()}
        </div>

      </div>
    </div>
  )
}

/* ── Main modal ──────────────────────────────────────────────────── */
export default function CaseModal({ initialId, initialTab, initialVideoIndex, onClose }) {
  const [idx,       setIdx]      = useState(() => Math.max(0, CASES.findIndex(c => c.id === initialId)))
  const [activeTab, setActiveTab]= useState(() => {
    if (!initialTab) return 0
    const v = VISUAL[initialId] ?? VISUAL.aura
    const ti = (v.tabs ?? []).indexOf(initialTab)
    return ti >= 0 ? ti : 0
  })
  const [closing,   setClosing]  = useState(false)
  const [navPhase,  setNavPhase] = useState('idle')   // 'idle' | 'out' | 'in'
  const [navDir,    setNavDir]   = useState(0)
  const [toast,     setToast]    = useState(false)
  const toastTimer    = useRef(null)
  const closeRef      = useRef(false)
  const mountedRef    = useRef(false)   /* skip tab reset on first mount */

  const c      = CASES[idx]
  const visual = VISUAL[c.id] ?? VISUAL.aura
  const total  = CASES.length

  /* Reset tab when switching cases — skip initial mount so initialTab is respected */
  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return }
    setActiveTab(0)
  }, [idx])

  /* keyboard */
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape')     handleClose()
      if (e.key === 'ArrowLeft')  navigate(-1)
      if (e.key === 'ArrowRight') navigate(1)
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [idx, navPhase])

  const handleClose = () => {
    if (closeRef.current) return
    closeRef.current = true
    setClosing(true)
    setTimeout(onClose, 320)
  }

  const navigate = (dir) => {
    if (navPhase !== 'idle') return
    setNavDir(dir)
    setNavPhase('out')
    setTimeout(() => {
      setIdx(prev => (prev + dir + total) % total)
      setNavPhase('in')
      setTimeout(() => setNavPhase('idle'), 430)
    }, 230)
  }

  const showToast = () => {
    setToast(true)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(false), 2600)
  }

  const pad    = (n) => String(n).padStart(2, '0')
  const bodyClass = [
    'cm-body',
    navPhase === 'out' ? 'cm-nav-out'                              : '',
    navPhase === 'in'  ? (navDir > 0 ? 'cm-nav-in-r' : 'cm-nav-in-l') : '',
  ].filter(Boolean).join(' ')

  return (
    <>
      {/* Backdrop */}
      <div onClick={handleClose} style={{ position: 'fixed', inset: 0, zIndex: 49999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          animation: closing ? 'cm-bd-out .32s ease forwards' : 'cm-bd-in .32s ease forwards',
        }} />

        {/* Modal card */}
        <div
          role="dialog" aria-modal="true" aria-label={`Case file: ${c.title}`}
          onClick={e => e.stopPropagation()}
          style={{
            position: 'relative', zIndex: 1,
            width: 'min(98vw,1120px)', maxHeight: '92vh',
            display: 'flex', flexDirection: 'column',
            background: '#080808',
            border: '1px solid rgba(200,229,0,0.32)',
            overflow: 'hidden',
            boxShadow: '0 0 0 1px rgba(200,229,0,0.07),0 0 35px rgba(200,229,0,0.2),0 0 90px rgba(200,229,0,0.07),inset 0 1px 0 rgba(200,229,0,0.1),inset 0 0 50px rgba(200,229,0,0.025)',
            animation: closing ? 'cm-modal-out .32s ease forwards' : 'cm-modal-in .65s cubic-bezier(0.22,1,0.36,1) forwards',
          }}
        >
          {/* Global scanlines */}
          <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.012) 3px,rgba(255,255,255,0.012) 4px)' }} />

          {/* Outer HUD corners */}
          <HudCorners size={14} thick={1.5} color="rgba(200,229,0,0.6)" inset={-1} />

          {/* Toast */}
          <HudToast visible={toast} />

          {/* ── Header ── */}
          <div style={{ position: 'relative', zIndex: 5, display: 'flex', alignItems: 'center', padding: '7px 14px', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.6)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <div aria-hidden style={{ width: 7, height: 7, borderRadius: '50%', background: LIME, boxShadow: `0 0 7px ${LIME}`, flexShrink: 0, animation: 'cm-dot-pulse 2s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: LIME }}>CASE FILE</span>
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em' }}>{pad(idx + 1)} / {pad(total)}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em' }}>· {c.id.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', gap: 5 }}>
              {[-1, 1].map(dir => (
                <button key={dir} onClick={() => navigate(dir)} aria-label={dir < 0 ? 'Previous case' : 'Next case'}
                  className="cm-nav-btn"
                  style={{ width: 28, height: 28, background: 'transparent', border: '1px solid #2a2a2a', color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color .15s,color .15s,box-shadow .15s' }}
                >
                  {dir < 0 ? '←' : '→'}
                </button>
              ))}
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleClose} aria-label="Close case file"
                className="cm-close-btn"
                style={{ width: 28, height: 28, background: 'transparent', border: '1px solid #2a2a2a', color: 'rgba(255,255,255,0.4)', fontSize: 18, lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color .15s,color .15s' }}
              >×</button>
            </div>
          </div>

          {/* ── Body ── */}
          <div className={bodyClass} style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <PreviewPanel c={c} visual={visual} activeTab={activeTab} onTabChange={setActiveTab} initialVideoIndex={initialVideoIndex} />
            <DetailPanel  c={c} onBlockedLink={showToast} />
          </div>
        </div>
      </div>

      <style>{`
        /* ── Backdrop ── */
        @keyframes cm-bd-in  { from{opacity:0} to{opacity:1} }
        @keyframes cm-bd-out { from{opacity:1} to{opacity:0} }

        /* ── Modal open: clip-path scanline reveal + glitch ── */
        @keyframes cm-modal-in {
          0%   { opacity:0; transform:scale(0.97); clip-path:inset(48% 0 48% 0); }
          10%  { clip-path:inset(22% 0 32% 0); transform:scale(0.982) translateX(-3px); opacity:0.42; }
          22%  { clip-path:inset(4%  0  1% 0); transform:scale(0.993) translateX(2px);  opacity:0.78; }
          34%  { clip-path:inset(0   0  0  0); transform:scale(1.001);                  opacity:0.92; }
          50%  { transform:scale(1); }
          100% { opacity:1; transform:scale(1); clip-path:inset(0 0 0 0); }
        }
        @keyframes cm-modal-out {
          from { opacity:1; transform:scale(1); }
          to   { opacity:0; transform:scale(0.96); }
        }

        /* ── Navigation: glitch-out → slide-in ── */
        .cm-nav-out { animation: cm-nav-glitch-out 0.23s ease forwards !important; pointer-events:none; }
        .cm-nav-in-r { animation: cm-nav-in-r 0.43s cubic-bezier(0.22,1,0.36,1) forwards !important; }
        .cm-nav-in-l { animation: cm-nav-in-l 0.43s cubic-bezier(0.22,1,0.36,1) forwards !important; }

        @keyframes cm-nav-glitch-out {
          0%   { opacity:1; transform:none; clip-path:inset(0 0 0 0); }
          18%  { clip-path:inset(24% 0 42% 0); transform:translateX(-7px); opacity:0.65; }
          36%  { clip-path:inset(0   0  0  0); transform:translateX(5px);  opacity:0.55; }
          55%  { clip-path:inset(54% 0 12% 0); transform:translateX(-3px); opacity:0.35; }
          75%  { clip-path:inset(0   0  0  0); transform:none; opacity:0.15; }
          100% { opacity:0; clip-path:inset(0 0 0 0); }
        }
        @keyframes cm-nav-in-r {
          0%   { opacity:0; transform:translateX(24px); clip-path:inset(0 0 0 0); }
          18%  { clip-path:inset(0 28% 0 0); transform:translateX(10px); opacity:0.55; }
          38%  { clip-path:inset(0  0  0 0); transform:translateX(-3px); opacity:0.92; }
          100% { opacity:1; transform:none; }
        }
        @keyframes cm-nav-in-l {
          0%   { opacity:0; transform:translateX(-24px); clip-path:inset(0 0 0 0); }
          18%  { clip-path:inset(0 0 0 28%); transform:translateX(-10px); opacity:0.55; }
          38%  { clip-path:inset(0 0 0  0);  transform:translateX(3px);   opacity:0.92; }
          100% { opacity:1; transform:none; }
        }

        /* ── Preview scan effects ── */
        @keyframes cm-scan-drift {
          0%   { transform:translateY(0); }
          100% { transform:translateY(-4px); }
        }
        @keyframes cm-scan-sweep {
          0%,13.1%,100% { top:-2px; opacity:0; }
          1%             { top:-2px; opacity:0.9; }
          13%            { top:100%; opacity:0; }
        }
        @keyframes cm-hud-border-pulse {
          0%,100% { opacity:0.18; }
          50%     { opacity:0.42; }
        }

        /* ── Preview micro-glitch ── */
        @keyframes cm-preview-glitch-anim {
          0%,100% { clip-path:inset(0 0 0 0); transform:none; filter:none; }
          14%     { clip-path:inset(16% 0 52% 0); transform:translateX(-3px); filter:hue-rotate(15deg); }
          28%     { clip-path:inset(0   0  0  0); transform:translateX(2px);  filter:none; }
          42%     { clip-path:inset(58% 0 10% 0); transform:translateX(-1px); }
          56%     { clip-path:inset(0   0  0  0); transform:none; }
        }
        .cm-preview-glitch { animation: cm-preview-glitch-anim 0.3s ease forwards !important; }

        /* ── Orbit ── */
        @keyframes cm-orbit-cw  { from{transform:rotate(0deg)}    to{transform:rotate(360deg)}  }
        @keyframes cm-orbit-ccw { from{transform:rotate(0deg)}    to{transform:rotate(-360deg)} }

        /* ── Particles ── */
        @keyframes cm-particle-pulse {
          0%,100% { opacity:0.9; transform:scale(1); }
          50%     { opacity:0.28; transform:scale(0.55); }
        }

        /* ── Dot pulse ── */
        @keyframes cm-dot-pulse {
          0%,100% { opacity:1; }
          50%     { opacity:0.35; }
        }

        /* ── Label flicker ── */
        @keyframes cm-flicker {
          0%,100%        { opacity:1; }
          3.5%           { opacity:0.06; }
          4%             { opacity:0.9; }
          4.5%           { opacity:0.1; }
          5%             { opacity:1; }
        }

        /* ── Tab content crossfade ── */
        @keyframes cm-tab-in {
          from { opacity:0; transform:translateX(6px) scale(0.98); }
          to   { opacity:1; transform:translateX(0) scale(1); }
        }

        /* ── Section staged reveal ── */
        @keyframes cm-section-in {
          from { opacity:0; transform:translateY(7px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* ── Hero idle float ── */
        @keyframes cm-hero-idle {
          0%,100% { transform:translateY(0px) rotate(-0.3deg); }
          40%     { transform:translateY(-6px) rotate(0.4deg); }
          70%     { transform:translateY(-3px) rotate(-0.1deg); }
        }

        /* ── Module loader: text line appear ── */
        @keyframes cm-ldr-line {
          from { opacity:0; transform:translateX(-6px); }
          to   { opacity:1; transform:translateX(0); }
        }

        /* ── Module loader: progress bar fill ── */
        @keyframes cm-ldr-bar {
          from { clip-path:inset(0 100% 0 0); }
          to   { clip-path:inset(0 0% 0 0); }
        }

        /* ── Floating particles ── */
        @keyframes cm-float-up {
          0%   { transform:translateY(0) scale(1);    opacity:0; }
          12%  { opacity:0.38; }
          75%  { opacity:0.18; }
          100% { transform:translateY(-130px) scale(0.4); opacity:0; }
        }

        /* ── CTA button ── */
        .cm-btn-primary {
          position:relative; overflow:hidden;
          transition: box-shadow .2s ease, transform .12s ease !important;
        }
        .cm-btn-primary::before {
          content:'';
          position:absolute; inset:0;
          background:rgba(255,255,255,0);
          transition:background .15s;
        }
        /* Shimmer sweep on hover */
        .cm-btn-primary::after {
          content:'';
          position:absolute; top:0; left:-120%; width:60%; height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          pointer-events:none;
        }
        .cm-btn-primary:hover {
          box-shadow: 0 0 20px rgba(200,229,0,0.55), 0 0 50px rgba(200,229,0,0.22) !important;
        }
        .cm-btn-primary:hover::before { background:rgba(255,255,255,0.08); }
        .cm-btn-primary:hover::after  { animation: cm-btn-shimmer 0.55s ease forwards; }
        .cm-btn-primary:hover .cm-btn-arrow {
          animation: cm-arrow-bounce 0.75s ease-in-out infinite;
        }
        .cm-btn-primary:active {
          transform: scale(0.97) scaleY(0.93) !important;
          box-shadow: 0 0 36px rgba(200,229,0,0.95), inset 0 0 14px rgba(200,229,0,0.25) !important;
          transition: transform 0.07s, box-shadow 0.07s !important;
        }
        @keyframes cm-btn-shimmer {
          to { left:140%; }
        }
        @keyframes cm-arrow-bounce {
          0%,100% { transform:translateX(0); }
          50%     { transform:translateX(5px); }
        }

        /* ── Archive launch glitch ── */
        .cm-btn-launching {
          animation: cm-launch-glitch 0.12s ease infinite !important;
        }
        @keyframes cm-launch-glitch {
          0%   { transform:translateX(0)   skewX(0deg);   filter:brightness(1); }
          20%  { transform:translateX(-2px) skewX(-1.5deg); filter:brightness(1.3); }
          40%  { transform:translateX(2px)  skewX(1deg);   filter:brightness(0.85) hue-rotate(15deg); }
          60%  { transform:translateX(-1px) skewX(0.5deg); filter:brightness(1.1); }
          80%  { transform:translateX(1px)  skewX(-0.5deg); filter:brightness(1); }
          100% { transform:translateX(0)   skewX(0deg);   filter:brightness(1); }
        }

        /* ── Nav / close buttons ── */
        .cm-nav-btn:hover  { border-color:${LIME} !important; color:${LIME} !important; box-shadow:0 0 8px rgba(200,229,0,0.3); }
        .cm-close-btn:hover { border-color:#ff4444 !important; color:#ff4444 !important; }

        /* ── Scrollbar ── */
        .cm-scroll::-webkit-scrollbar       { width:3px; }
        .cm-scroll::-webkit-scrollbar-track { background:transparent; }
        .cm-scroll::-webkit-scrollbar-thumb { background:#252525; border-radius:2px; }

        /* ── Responsive ── */
        @media (max-width:600px) {
          .cm-body  { flex-direction:column !important; }
          .cm-left  { width:100% !important; height:200px; flex-shrink:0; }
          .cm-right { flex:1; min-height:0; padding:16px 18px !important; }
        }
      `}</style>
    </>
  )
}
