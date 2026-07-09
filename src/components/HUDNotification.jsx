import { useEffect, useState } from 'react'

/*
  HUDNotification — small top-right system status toast
  Auto-dismisses after `duration` ms. No user input required.
*/
export default function HUDNotification({ soundOn, onDone, duration = 2000 }) {
  const [phase, setPhase] = useState('enter') // enter → idle → exit

  useEffect(() => {
    /* enter → idle after animation (~320 ms) */
    const t1 = setTimeout(() => setPhase('idle'), 320)
    /* idle → exit after duration */
    const t2 = setTimeout(() => setPhase('exit'), duration)
    /* exit → unmount after exit animation (~380 ms) */
    const t3 = setTimeout(() => onDone?.(), duration + 380)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const containerStyle = {
    position: 'fixed',
    top: 52,          /* just below the nav bar */
    right: 12,
    zIndex: 9400,
    width: 224,
    background: '#0A0A0A',
    border: '1px solid #2a2a2a',
    pointerEvents: 'none',
    opacity: phase === 'idle' ? 1 : 0,
    ...(phase === 'enter' && { animation: 'hud-enter 0.32s cubic-bezier(0.22,1,0.36,1) forwards' }),
    ...(phase === 'exit'  && { animation: 'hud-exit  0.38s ease-in forwards' }),
  }

  return (
    <>
      <div aria-live="polite" aria-label="System status notification" style={containerStyle}>
        {/* scanline overlay */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.018) 2px, rgba(255,255,255,0.018) 4px)',
        }} />

        {/* HUD corner brackets */}
        {[
          { top: -1, left: -1,   borderTop: '1.5px solid', borderLeft: '1.5px solid'  },
          { top: -1, right: -1,  borderTop: '1.5px solid', borderRight: '1.5px solid' },
          { bottom: -1, left: -1,  borderBottom: '1.5px solid', borderLeft: '1.5px solid'  },
          { bottom: -1, right: -1, borderBottom: '1.5px solid', borderRight: '1.5px solid' },
        ].map((s, i) => (
          <div key={i} aria-hidden="true" style={{
            position: 'absolute', width: 8, height: 8, zIndex: 2,
            borderColor: 'rgba(200,229,0,0.45)', ...s,
          }} />
        ))}

        {/* Header */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 9px',
          borderBottom: '1px solid #1e1e1e',
        }}>
          <div style={{
            width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
            background: '#C8E500',
            boxShadow: '0 0 5px rgba(200,229,0,0.8)',
            animation: 'hud-blink 1.2s ease-in-out infinite',
          }} aria-hidden="true" />
          <span className="font-mono font-bold text-[9px] tracking-widest uppercase" style={{ color: '#C8E500' }}>
            SYSTEM READY
          </span>
        </div>

        {/* Body */}
        <div style={{ position: 'relative', zIndex: 1, padding: '8px 10px' }}>
          <div className="font-mono text-[8px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>
            AMBIENT AUDIO:&nbsp;
            <span style={{ color: soundOn ? '#C8E500' : '#ff4444', fontWeight: 700 }}>
              {soundOn ? 'ON' : 'OFF'}
            </span>
          </div>
          <div className="font-mono text-[9px] leading-snug" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {soundOn
              ? <><span style={{ color: 'rgba(200,229,0,0.7)' }}>♪</span> Tokyo Night Walk</>
              : <>Press <span className="font-bold" style={{ color: 'rgba(255,255,255,0.8)' }}>SOUND</span> to enable</>
            }
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hud-enter {
          0%   { opacity:0; transform:translateX(16px); clip-path:inset(0 0 40% 0); }
          35%  { clip-path:inset(0 0 0 0); }
          65%  { transform:translateX(-2px); }
          100% { opacity:1; transform:translateX(0); }
        }
        @keyframes hud-exit {
          0%   { opacity:1; clip-path:inset(0 0 0 0); }
          45%  { clip-path:inset(50% 0 0 0); opacity:0.3; }
          100% { opacity:0; clip-path:inset(100% 0 0 0); }
        }
        @keyframes hud-blink {
          0%,100% { opacity:1; } 50% { opacity:0.3; }
        }
      `}</style>
    </>
  )
}
