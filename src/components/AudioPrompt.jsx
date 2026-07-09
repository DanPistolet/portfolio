import { useEffect, useState } from 'react'

/* ── HUD-style audio prompt — shown once after loading ─────────── */
export default function AudioPrompt({ onChoice }) {
  const [phase, setPhase] = useState('enter') // enter → idle → exit

  useEffect(() => {
    /* slight delay so loading-screen slide-up finishes first */
    const t = setTimeout(() => setPhase('idle'), 80)
    return () => clearTimeout(t)
  }, [])

  const choose = (yes) => {
    setPhase('exit')
    setTimeout(() => onChoice(yes), 380)
  }

  /* Opacity: 0 during transitions, 1 when settled in idle */
  const containerStyle = {
    position: 'fixed',
    bottom: 40, right: 20,
    zIndex: 9500,
    width: 256,
    background: '#0A0A0A',
    border: '1px solid #333',
    pointerEvents: 'all',
    opacity: phase === 'idle' ? 1 : 0,
    ...(phase === 'enter' && { animation: 'ap-enter 0.32s cubic-bezier(0.22,1,0.36,1) forwards' }),
    ...(phase === 'exit'  && { animation: 'ap-exit 0.38s ease-in forwards' }),
  }

  return (
    <>
      {/* ── Prompt card ── */}
      <div
        role="dialog"
        aria-label="Enable ambient audio"
        aria-modal="true"
        style={containerStyle}
      >
        {/* scanline overlay */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.025) 2px, rgba(255,255,255,0.025) 4px)',
        }} />

        {/* HUD corner brackets */}
        {[
          { top: -1, left: -1,   borderTop: '2px solid', borderLeft: '2px solid'  },
          { top: -1, right: -1,  borderTop: '2px solid', borderRight: '2px solid' },
          { bottom: -1, left: -1,  borderBottom: '2px solid', borderLeft: '2px solid'  },
          { bottom: -1, right: -1, borderBottom: '2px solid', borderRight: '2px solid' },
        ].map((s, i) => (
          <div key={i} aria-hidden="true" style={{
            position: 'absolute', width: 10, height: 10, zIndex: 2, pointerEvents: 'none',
            borderColor: '#C8E500', ...s,
          }} />
        ))}

        {/* ── Header ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 10px',
          borderBottom: '1px solid #222',
        }}>
          {/* pulse dot */}
          <div style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            background: '#C8E500',
            boxShadow: '0 0 6px rgba(200,229,0,0.7)',
            animation: 'ap-pulse 1.4s ease-in-out infinite',
          }} aria-hidden="true" />
          <span className="font-mono font-bold text-[10px] tracking-widest uppercase" style={{ color: '#C8E500' }}>
            AMBIENT AUDIO
          </span>
        </div>

        {/* ── Body ── */}
        <div style={{ position: 'relative', zIndex: 1, padding: '10px 12px 12px' }}>
          {/* status row */}
          <div className="font-mono text-[8px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 10 }}>
            STATUS: <span style={{ color: '#ff4444' }}>■ OFF</span>
          </div>

          <p className="font-mono text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 14 }}>
            Enable ambient audio?
          </p>

          {/* buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => choose(true)}
              className="font-mono font-bold text-[10px] tracking-widest uppercase cursor-pointer"
              style={{
                flex: 1, padding: '6px 0',
                background: '#C8E500', color: '#000',
                border: 'none',
                transition: 'opacity .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              YES
            </button>
            <button
              onClick={() => choose(false)}
              className="font-mono font-bold text-[10px] tracking-widest uppercase cursor-pointer"
              style={{
                flex: 1, padding: '6px 0',
                background: 'transparent', color: 'rgba(255,255,255,0.5)',
                border: '1px solid #333',
                transition: 'border-color .15s, color .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
            >
              NO
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ap-enter {
          0%   { opacity:0; transform: translateX(12px); clip-path: inset(0 0 30% 0); }
          30%  { clip-path: inset(0 0 0 0); }
          60%  { transform: translateX(-2px); }
          100% { opacity:1; transform: translateX(0); clip-path: inset(0 0 0 0); }
        }
        @keyframes ap-exit {
          0%   { opacity:1; clip-path: inset(0 0 0 0); }
          50%  { clip-path: inset(40% 0 0 0); opacity: 0.4; }
          100% { opacity:0; clip-path: inset(100% 0 0 0); }
        }
        @keyframes ap-pulse {
          0%,100% { opacity:1; box-shadow: 0 0 6px rgba(200,229,0,0.7); }
          50%     { opacity:0.4; box-shadow: 0 0 2px rgba(200,229,0,0.3); }
        }
      `}</style>
    </>
  )
}
