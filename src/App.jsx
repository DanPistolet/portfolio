import { useEffect, useRef, useState, useCallback } from 'react'
import { AudioEngine }   from './audio/AudioEngine'
import LoadingScreen     from './components/LoadingScreen'
import HUDNotification   from './components/HUDNotification'
import CinematicLayer    from './components/CinematicLayer'
import SakuraLayer       from './components/SakuraLayer'
import CaseModal         from './components/CaseModal'
import TopNav            from './components/TopNav'
import HeroSection       from './components/HeroSection'
import MissionLog        from './components/MissionLog'
import IRLPortrait       from './components/IRLPortrait'
import MotionPractice    from './components/MotionPractice'
import Footer            from './components/Footer'

const PREF_KEY = 'dmySoundPref'

export default function App() {
  const [loaded,           setLoaded]           = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [soundOn,          setSoundOn]          = useState(false)
  const [modalCaseId,      setModalCaseId]      = useState(null)

  /* ── DOM refs ── */
  const appRef       = useRef(null)
  const cursorRef    = useRef(null)
  const cursorDotRef = useRef(null)
  const hudPulseRef  = useRef(null)   /* full-screen lime tint, screen blend */
  const hudFrameRef  = useRef(null)   /* viewport border that brightens on bass */
  const pos          = useRef({ x: -200, y: -200 })
  const raf          = useRef(null)

  /* ── audio ── */
  const bass      = useRef(0)         /* smoothed 0-1, shared with SakuraLayer */
  const engineRef = useRef(null)
  const soundOnRef = useRef(false)    /* readable inside RAF without closure staleness */

  const getEngine = useCallback(() => {
    if (!engineRef.current) engineRef.current = new AudioEngine()
    return engineRef.current
  }, [])

  const startAudio = useCallback(async () => {
    const eng = getEngine()
    const ok  = await eng.init()
    if (ok) { await eng.play(); setSoundOn(true); soundOnRef.current = true }
  }, [getEngine])

  const stopAudio = useCallback(() => {
    engineRef.current?.pause()
    setSoundOn(false)
    soundOnRef.current = false
  }, [])

  const toggleSound = useCallback(() => {
    if (soundOnRef.current) {
      stopAudio()
      localStorage.setItem(PREF_KEY, 'no')
    } else {
      startAudio()
      localStorage.setItem(PREF_KEY, 'yes')
    }
  }, [startAudio, stopAudio])

  /* ── post-loading: always show HUD notification, handle auto-resume ── */
  const handleLoaded = useCallback(() => {
    setLoaded(true)
    /* show the small status toast after the slide-up finishes */
    setTimeout(() => setShowNotification(true), 460)

    /* if user previously enabled audio, resume on first interaction */
    if (localStorage.getItem(PREF_KEY) === 'yes') {
      const resume = () => { startAudio(); window.removeEventListener('pointerdown', resume) }
      window.addEventListener('pointerdown', resume, { once: true })
    }
  }, [startAudio])

  /* ── main RAF: cursor lerp + audio-reactive effects ── */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

    /* Boot-up border reveal */
    if (!mq.matches) {
      appRef.current?.querySelectorAll('[data-reveal]')?.forEach((el, i) => {
        el.style.opacity = '0'
        setTimeout(() => { el.style.opacity = '1'; el.style.transition = 'opacity .3s' }, i * 80)
      })
    }

    const glow = cursorRef.current
    const dot  = cursorDotRef.current
    if (!glow || !dot) return

    const onMove = (e) => { pos.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('pointermove', onMove, { passive: true })

    let cx = -200, cy = -200

    const tick = () => {
      /* ── cursor lerp ── */
      cx += (pos.current.x - cx) * 0.12
      cy += (pos.current.y - cy) * 0.12
      glow.style.transform = `translate(${cx}px, ${cy}px)`
      dot.style.transform  = `translate(${pos.current.x}px, ${pos.current.y}px)`

      /* ── audio-reactive effects (only when not prefers-reduced-motion) ── */
      if (!mq.matches) {
        const playing = engineRef.current?.playing ?? false
        const raw     = playing ? (engineRef.current.getBassLevel() ?? 0) : 0

        /* smooth bass: 80% old + 20% new */
        bass.current = bass.current * 0.8 + raw * 0.2
        const b = bass.current

        if (playing) {
          /* ── cursor glow: larger + brighter with music ── */
          const size    = 380 + b * 40          /* 380–420 px vs default 340 */
          const opacity = 0.09 + b * 0.09       /* 9–18 % */
          glow.style.width      = size + 'px'
          glow.style.height     = size + 'px'
          glow.style.marginLeft = -(size / 2) + 'px'
          glow.style.marginTop  = -(size / 2) + 'px'
          glow.style.background = `radial-gradient(circle, rgba(200,229,0,${opacity.toFixed(3)}) 0%, transparent 70%)`

          /* ── HUD lime pulse: slow sine ambient + bass spike ── */
          const sine    = Math.sin(Date.now() / 2200) * 0.5 + 0.5   /* 0-1 at ~0.45 Hz */
          const ambient = 0.03 + sine * 0.025                         /* 3–5.5 % */
          const total   = Math.min(ambient + b * 0.055, 0.10)         /* cap at 10 % */
          if (hudPulseRef.current)
            hudPulseRef.current.style.background = `rgba(200,229,0,${total.toFixed(4)})`

          /* ── HUD viewport frame: lime border brightens on bass ── */
          const frameBrightness = 0.06 + b * 0.18                    /* 6–24 % */
          const frameGlow       = b * 0.08
          if (hudFrameRef.current)
            hudFrameRef.current.style.boxShadow =
              `inset 0 0 0 1px rgba(200,229,0,${frameBrightness.toFixed(3)}), ` +
              `inset 0 0 28px rgba(200,229,0,${frameGlow.toFixed(3)})`

        } else {
          /* restore defaults when music off */
          if (b < 0.002) {
            glow.style.width      = '340px'
            glow.style.height     = '340px'
            glow.style.marginLeft = '-170px'
            glow.style.marginTop  = '-170px'
            glow.style.background = 'radial-gradient(circle, rgba(200,229,0,0.07) 0%, transparent 70%)'
            if (hudPulseRef.current) hudPulseRef.current.style.background = 'rgba(200,229,0,0)'
            if (hudFrameRef.current) hudFrameRef.current.style.boxShadow  = 'none'
          }
        }
      }

      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf.current)
      engineRef.current?.destroy()
    }
  }, [])

  return (
    <div
      ref={appRef}
      className="flex flex-col"
      style={{ minHeight: '100vh', background: '#0A0A0A', cursor: 'none', overflowX: 'hidden', maxWidth: '100vw' }}
    >
      {!loaded          && <LoadingScreen onDone={handleLoaded} />}
      {showNotification && (
        <HUDNotification
          soundOn={soundOn}
          onDone={() => setShowNotification(false)}
        />
      )}

      {/* Atmospheric cinematic overlays (scanlines, grain, vscan, glitch) */}
      <CinematicLayer soundOn={soundOn} />

      {/* Viewport HUD frame — border brightens on bass */}
      <div
        ref={hudFrameRef}
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 6,
          pointerEvents: 'none',
          boxShadow: 'none',
        }}
      />

      {/* Bass-reactive lime tint overlay, screen blend */}
      <div
        ref={hudPulseRef}
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 7,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          background: 'rgba(200,229,0,0)',
        }}
      />

      {/* Sakura particles */}
      <SakuraLayer bassRef={bass} />

      {/* Cursor glow */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="desktop-cursor-glow"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 340, height: 340, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,229,0,0.07) 0%, transparent 70%)',
          transform: 'translate(-200px,-200px)',
          marginLeft: -170, marginTop: -170,
          pointerEvents: 'none', zIndex: 90000,
          willChange: 'transform',
        }}
      />
      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        aria-hidden="true"
        className="desktop-cursor-dot"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 6, height: 6, borderRadius: '50%',
          background: '#C8E500',
          transform: 'translate(-200px,-200px)',
          marginLeft: -3, marginTop: -3,
          pointerEvents: 'none', zIndex: 90001,
          willChange: 'transform',
          boxShadow: '0 0 6px rgba(200,229,0,0.8)',
        }}
      />

      {modalCaseId && (
        <CaseModal
          initialId={typeof modalCaseId === 'string' ? modalCaseId : modalCaseId.id}
          initialTab={typeof modalCaseId === 'object' ? modalCaseId.tab : undefined}
          initialVideoIndex={typeof modalCaseId === 'object' ? modalCaseId.videoIndex : undefined}
          onClose={() => setModalCaseId(null)}
        />
      )}

      <TopNav />
      <HeroSection />

      <div className="flex mobile-bottom-row" style={{ borderBottom: '1px solid #222', minHeight: 300 }}>
        <MissionLog    onOpenCase={setModalCaseId} />
        <IRLPortrait />
        <MotionPractice onOpenCase={setModalCaseId} />
      </div>

      <Footer soundOn={soundOn} onToggle={toggleSound} />
    </div>
  )
}
