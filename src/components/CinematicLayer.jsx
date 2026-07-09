import { useEffect, useRef } from 'react'

/*
  CinematicLayer — ambient atmospheric overlays
  Handles: CRT scanlines · film grain · vertical sweep · RGB micro-glitch
  All effects respect prefers-reduced-motion and are disabled without sound.
*/
export default function CinematicLayer({ soundOn }) {
  const vScanRef  = useRef(null)
  const glitchRef = useRef(null)
  const turbRef   = useRef(null)   /* SVG feTurbulence for grain */

  const noMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ── Film grain: animate SVG noise seed @ ~10fps ─────────────── */
  useEffect(() => {
    if (!soundOn || noMotion) return
    const iv = setInterval(() => {
      turbRef.current?.setAttribute('seed', String(Math.floor(Math.random() * 800)))
    }, 100)
    return () => clearInterval(iv)
  }, [soundOn, noMotion])

  /* ── Vertical scan sweep: random 20–40 s ─────────────────────── */
  useEffect(() => {
    if (!soundOn || noMotion) return
    let timer
    const run = () => {
      const el = vScanRef.current
      if (!el) return
      /* reset then re-trigger so it always plays from scratch */
      el.style.animation = 'none'
      void el.offsetWidth          /* force reflow */
      el.style.animation = 'vscan 2.8s cubic-bezier(0.25,0.1,0.25,1) forwards'
      timer = setTimeout(run, 20_000 + Math.random() * 20_000)
    }
    timer = setTimeout(run, 4_000 + Math.random() * 8_000) /* first sweep */
    return () => clearTimeout(timer)
  }, [soundOn, noMotion])

  /* ── Micro RGB glitch: rare, 80–150 ms ───────────────────────── */
  useEffect(() => {
    if (!soundOn || noMotion) return
    let timer
    const doGlitch = () => {
      const el = glitchRef.current
      if (!el) return
      const half = 45 + Math.floor(Math.random() * 35)
      /* phase 1 — red offset */
      el.style.opacity   = '1'
      el.style.background = 'rgba(255,0,30,0.055)'
      el.style.transform = `translateX(${Math.random() > .5 ? 2 : -2}px)`
      /* phase 2 — blue offset */
      setTimeout(() => {
        el.style.background = 'rgba(0,100,255,0.045)'
        el.style.transform  = `translateX(${Math.random() > .5 ? -1 : 1}px)`
        /* clear */
        setTimeout(() => {
          el.style.opacity    = '0'
          el.style.transform  = 'none'
          timer = setTimeout(doGlitch, 15_000 + Math.random() * 15_000)
        }, half)
      }, half)
    }
    timer = setTimeout(doGlitch, 10_000 + Math.random() * 10_000)
    return () => clearTimeout(timer)
  }, [soundOn, noMotion])

  return (
    <>
      {/* ── CRT scanlines — static, always present, brighter with sound ── */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, zIndex: 9, pointerEvents: 'none', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-8px', left: 0, right: 0, bottom: '-8px',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.022) 3px, rgba(0,0,0,0.022) 4px)',
          animation: (soundOn && !noMotion) ? 'crt-scroll 7s linear infinite' : 'none',
          opacity: soundOn ? 1 : 0.6,
          transition: 'opacity 2s ease',
        }} />
      </div>

      {/* ── Film grain — SVG turbulence noise, visible only with sound ── */}
      {soundOn && !noMotion && (
        <svg
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0, width: '100%', height: '100%',
            zIndex: 9, pointerEvents: 'none',
            opacity: 0.014,
            mixBlendMode: 'overlay',
          }}
        >
          <filter id="cinematic-grain" x="0%" y="0%" width="100%" height="100%"
            colorInterpolationFilters="sRGB">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.72"
              numOctaves="4"
              seed="42"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#cinematic-grain)" />
        </svg>
      )}

      {/* ── Vertical scan sweep ─────────────────────────────────────────── */}
      <div
        ref={vScanRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, bottom: 0, left: 0,
          width: 3, zIndex: 15, pointerEvents: 'none',
          background: 'linear-gradient(180deg, transparent 0%, rgba(200,229,0,0.35) 15%, rgba(255,255,255,0.7) 50%, rgba(200,229,0,0.35) 85%, transparent 100%)',
          opacity: 0,
          filter: 'blur(0.5px)',
        }}
      />

      {/* ── RGB micro-glitch overlay ────────────────────────────────────── */}
      <div
        ref={glitchRef}
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 16,
          pointerEvents: 'none', opacity: 0,
          mixBlendMode: 'screen',
        }}
      />

      <style>{`
        /* Scanlines drift slowly downward */
        @keyframes crt-scroll {
          0%   { transform: translateY(0px); }
          100% { transform: translateY(-4px); }
        }
        /* Vertical beam sweeps left→right across viewport */
        @keyframes vscan {
          0%   { transform: translateX(-6px); opacity: 0; }
          4%   { opacity: 1; }
          96%  { opacity: 0.8; }
          100% { transform: translateX(calc(100vw + 6px)); opacity: 0; }
        }
      `}</style>
    </>
  )
}
