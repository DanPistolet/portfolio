import { useEffect, useState } from 'react'

/* ── Sequence config ───────────────────────────────────────────── */
const SEQ = [
  { text: 'INITIALIZING USER FILE...',   ok: true,  startAt: 0,    typeMs: 260 },
  { text: 'LOADING CASE FILES...',        ok: true,  startAt: 340,  typeMs: 230 },
  { text: 'VERIFYING MOTION ASSETS...',  ok: true,  startAt: 650,  typeMs: 260 },
  { text: 'AUTHENTICATING USER...',      ok: true,  startAt: 1000, typeMs: 220 },
  { text: 'ACCESS GRANTED',              ok: false, startAt: 1310, typeMs: 105, glitch: true, accent: true },
  { text: 'SYSTEM ONLINE',               ok: false, startAt: 1490, typeMs: 85,  accent: true },
]

const WELCOME_AT   = 1630
const EXIT_AT      = 1980
const EXIT_DUR     = 440   /* slide-up duration */

/* ── HUD corners ────────────────────────────────────────────────── */
const CORNERS = [
  { top: 14, left: 14,  borderTop: '1px solid', borderLeft: '1px solid'   },
  { top: 14, right: 14, borderTop: '1px solid', borderRight: '1px solid'  },
  { bottom: 14, left: 14,  borderBottom: '1px solid', borderLeft: '1px solid'  },
  { bottom: 14, right: 14, borderBottom: '1px solid', borderRight: '1px solid' },
]

/* ── Single terminal line ───────────────────────────────────────── */
function TermLine({ text, ok, startAt, typeMs, glitch: doGlitch, accent }) {
  const [phase, setPhase]   = useState('hidden') // hidden | typing | done
  const [chars, setChars]   = useState(0)
  const [showOk, setShowOk] = useState(false)
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setPhase('typing')
      const perChar = typeMs / text.length
      let i = 0
      const iv = setInterval(() => {
        i++
        setChars(i)
        if (i >= text.length) {
          clearInterval(iv)
          setPhase('done')
          if (doGlitch) {
            setGlitch(true)
            setTimeout(() => setGlitch(false), 115)
          }
          if (ok) setTimeout(() => setShowOk(true), 60)
        }
      }, perChar)
      return () => clearInterval(iv)
    }, startAt)
    return () => clearTimeout(t)
  }, [])

  if (phase === 'hidden') return null

  return (
    <div
      className="flex items-center font-mono text-[10px] tracking-wider uppercase select-none"
      style={{
        lineHeight: 1.85,
        color:     accent ? '#C8E500' : 'rgba(255,255,255,0.72)',
        animation: glitch ? 'ls-glitch 0.115s steps(3) forwards' : undefined,
      }}
    >
      {/* prompt */}
      <span className="mr-2 shrink-0" style={{ color: accent ? '#C8E500' : 'rgba(200,229,0,0.4)' }}>{'>'}</span>

      {/* typed text */}
      <span className="flex-1">
        {text.slice(0, chars)}
        {phase === 'typing' && (
          <span style={{ color: '#C8E500', animation: 'ls-blink 0.4s step-end infinite' }}>█</span>
        )}
      </span>

      {/* OK badge */}
      {showOk && (
        <span
          className="ml-4 font-bold text-[9px] tracking-[0.35em]"
          style={{ color: '#C8E500', animation: 'ls-ok-pop 0.14s ease forwards' }}
        >
          OK
        </span>
      )}
    </div>
  )
}

/* ── Progress bar ───────────────────────────────────────────────── */
function ProgressBar({ progress }) {
  return (
    <div>
      {/* labels */}
      <div className="flex justify-between mb-1.5">
        <span className="font-mono text-[8px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>
          LOADING
        </span>
        <span className="font-mono text-[8px] tracking-widest tabular-nums" style={{ color: '#C8E500' }}>
          {String(progress).padStart(3, '0')}%
        </span>
      </div>

      {/* track */}
      <div style={{ position: 'relative', height: 2, background: 'rgba(255,255,255,0.07)' }}>
        {/* fill */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: `${progress}%`,
          background: 'linear-gradient(90deg, rgba(200,229,0,0.45) 0%, #C8E500 100%)',
          boxShadow: '0 0 10px rgba(200,229,0,0.55)',
          transition: 'width 50ms linear',
        }} />
        {/* scanner dot */}
        {progress > 0 && progress < 100 && (
          <div style={{
            position: 'absolute', top: '50%',
            left: `${progress}%`,
            transform: 'translate(-50%, -50%)',
            width: 6, height: 6, borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 0 10px 3px rgba(200,229,0,0.95)',
            transition: 'left 50ms linear',
            zIndex: 2,
          }} />
        )}
      </div>

      {/* ticks */}
      <div className="flex justify-between mt-1">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{
            width: 1,
            height: i % 5 === 0 ? 5 : 3,
            background: i * 5 <= progress ? 'rgba(200,229,0,0.5)' : 'rgba(255,255,255,0.07)',
            transition: 'background 80ms',
          }} />
        ))}
      </div>
    </div>
  )
}

/* ── Main component ─────────────────────────────────────────────── */
export default function LoadingScreen({ onDone }) {
  const [progress,    setProgress]    = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)
  const [exiting,     setExiting]     = useState(false)

  /* progress animation */
  useEffect(() => {
    const start = performance.now()
    const dur   = EXIT_AT - 80
    let raf
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1)
      const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t   /* ease-in-out */
      setProgress(Math.round(e * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  /* welcome */
  useEffect(() => {
    const t = setTimeout(() => setShowWelcome(true), WELCOME_AT)
    return () => clearTimeout(t)
  }, [])

  /* exit */
  useEffect(() => {
    const t = setTimeout(() => {
      setExiting(true)
      setTimeout(onDone, EXIT_DUR)
    }, EXIT_AT)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      aria-live="assertive"
      aria-label="Loading portfolio"
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        animation: exiting ? `ls-slide-up ${EXIT_DUR}ms cubic-bezier(0.4,0,1,1) forwards` : undefined,
      }}
    >
      {/* Scanline overlay */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.14) 2px, rgba(0,0,0,0.14) 4px)',
      }} />

      {/* Sweeping scan line */}
      <div aria-hidden="true" style={{
        position: 'absolute', left: 0, right: 0, height: 1, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(90deg, transparent 0%, rgba(200,229,0,0.6) 30%, rgba(200,229,0,0.85) 50%, rgba(200,229,0,0.6) 70%, transparent 100%)',
        animation: 'ls-sweep 2.8s ease-in-out infinite',
      }} />

      {/* HUD corners */}
      {CORNERS.map((style, i) => (
        <div key={i} aria-hidden="true" style={{
          position: 'absolute', width: 22, height: 22, zIndex: 2, pointerEvents: 'none',
          borderColor: 'rgba(200,229,0,0.28)', ...style,
        }} />
      ))}

      {/* Top HUD bar */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '7px 22px',
        borderBottom: '1px solid rgba(200,229,0,0.07)',
      }}>
        <span className="font-mono text-[8px] tracking-[0.4em] uppercase" style={{ color: 'rgba(200,229,0,0.28)' }}>
          SYS v2.4.1
        </span>
        <span className="font-mono text-[8px] tracking-[0.3em] uppercase" style={{ color: 'rgba(200,229,0,0.28)' }}>
          DMY PORTFOLIO · 2026
        </span>
      </div>

      {/* Bottom HUD bar */}
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '7px 22px',
        borderTop: '1px solid rgba(200,229,0,0.07)',
      }}>
        <span className="font-mono text-[8px] tracking-widest" style={{ color: 'rgba(200,229,0,0.22)' }}>
          46°57′N 7°26′E
        </span>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              width: 3, height: 3,
              background: 'rgba(200,229,0,0.32)',
              animation: `ls-flicker ${0.55 + i * 0.14}s step-end infinite`,
              animationDelay: `${i * 0.09}s`,
            }} />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 3, width: '100%', maxWidth: 460, padding: '0 36px' }}>

        {/* Ident */}
        <div className="font-mono text-[9px] tracking-[0.42em] uppercase select-none" style={{ color: 'rgba(200,229,0,0.38)', marginBottom: 22 }}>
          [ BOOT SEQUENCE · MOTION DESIGNER ]
        </div>

        {/* Terminal lines */}
        <div style={{ marginBottom: 22 }}>
          {SEQ.map((item, i) => <TermLine key={i} {...item} />)}
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 0 }}>
          <ProgressBar progress={progress} />
        </div>

        {/* Welcome message */}
        {showWelcome && (
          <div style={{
            marginTop: 26,
            paddingTop: 22,
            borderTop: '1px solid rgba(200,229,0,0.14)',
            animation: 'ls-fadein 0.32s ease forwards',
          }}>
            <div className="font-mono text-[9px] tracking-[0.45em] uppercase select-none" style={{ color: 'rgba(255,255,255,0.32)', marginBottom: 3 }}>
              WELCOME BACK,
            </div>
            <div className="font-mono font-bold text-[9px] tracking-[0.45em] uppercase select-none" style={{ color: 'rgba(200,229,0,0.55)', marginBottom: 14 }}>
              DESIGNER.
            </div>
            <div className="font-display uppercase select-none" style={{
              fontSize: 'clamp(26px, 4.5vw, 42px)',
              letterSpacing: '-0.01em',
              lineHeight: 0.9,
              color: '#fff',
            }}>
              DANIEL<br />
              <span style={{ color: '#C8E500' }}>MOOR-YOUNG</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes ls-blink   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes ls-ok-pop  { from{opacity:0;transform:translateX(-4px) scale(0.85)} to{opacity:1;transform:translateX(0) scale(1)} }
        @keyframes ls-fadein  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ls-flicker { 0%,100%{opacity:0.32} 33%{opacity:1} 66%{opacity:0.08} }

        /* Sweeping horizontal light across the screen */
        @keyframes ls-sweep {
          0%   { top: -2px;   opacity: 0; }
          4%   { opacity: 1; }
          96%  { opacity: 0.5; }
          100% { top: 100%;  opacity: 0; }
        }

        /* Slide-up exit — loading screen rises off the top */
        @keyframes ls-slide-up {
          0%   { transform: translateY(0);     }
          100% { transform: translateY(-102%); }
        }

        /* ACCESS GRANTED glitch — short, horizontal, no aggressive flash */
        @keyframes ls-glitch {
          0%   { transform: translateX(0);    clip-path: inset(0 0 0 0);      filter: none; }
          25%  { transform: translateX(-5px); clip-path: inset(18% 0 28% 0);  filter: brightness(1.6) saturate(1.4); }
          55%  { transform: translateX(4px);  clip-path: inset(42% 0 12% 0);  filter: brightness(1.3); }
          80%  { transform: translateX(-2px); clip-path: inset(5% 0 60% 0);   }
          100% { transform: translateX(0);    clip-path: inset(0 0 0 0);      filter: none; }
        }
      `}</style>
    </div>
  )
}
