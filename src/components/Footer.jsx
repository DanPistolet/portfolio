const Crosshair = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".4" aria-hidden="true">
    <circle cx="12" cy="12" r="8"/>
    <line x1="12" y1="2" x2="12" y2="6"/>
    <line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="2" y1="12" x2="6" y2="12"/>
    <line x1="18" y1="12" x2="22" y2="12"/>
  </svg>
)

const SoundOnIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
  </svg>
)

const SoundOffIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  </svg>
)

/* soundOn + onToggle come from App (which owns the AudioEngine) */
export default function Footer({ soundOn = false, onToggle }) {
  return (
    <footer
      className="anim-footer flex items-center justify-between shrink-0 overflow-hidden mobile-footer"
      style={{ height: 27, background: '#0A0A0A', borderTop: '1px solid #222' }}
      aria-label="Footer"
    >
      {/* Left section */}
      <div
        className="flex items-center gap-2 px-3 shrink-0"
        style={{ borderRight: '1px solid #222', height: '100%' }}
      >
        <Crosshair />
        <span className="font-mono text-white/40 text-[8px] tracking-widest uppercase whitespace-nowrap">
          Motion Designer / Visual Storyteller / AI Enthusiast
        </span>
        <Crosshair />
      </div>

      {/* Center: lime pill */}
      <div className="flex-1 flex items-center justify-center gap-3 overflow-hidden px-3">
        <Crosshair />
        <a
          href="https://t.me/yadanix"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono font-bold text-black text-[9px] tracking-wider px-4 py-0.5 hover:opacity-80 transition-opacity whitespace-nowrap cursor-pointer"
          style={{ background: '#C8E500', fontFamily: "'Noto Sans JP', sans-serif" }}
          aria-label="七転び八起き — Contact on Telegram"
        >
          七転び八起き
        </a>
        <Crosshair />
      </div>

      {/* Right section */}
      <div
        className="flex items-center gap-2 px-3 shrink-0"
        style={{ borderLeft: '1px solid #222', height: '100%' }}
      >
        {/* Audio toggle */}
        <button
          onClick={onToggle}
          aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
          aria-pressed={soundOn}
          className="flex items-center gap-1 font-mono text-[8px] tracking-widest uppercase whitespace-nowrap cursor-pointer"
          style={{
            border: `1px solid ${soundOn ? 'rgba(200,229,0,0.55)' : 'rgba(255,255,255,0.15)'}`,
            color:   soundOn ? '#C8E500' : 'rgba(255,255,255,0.35)',
            padding: '1px 6px',
            background: 'transparent',
            lineHeight: 1,
            height: 16,
            transition: 'border-color .2s, color .2s',
          }}
        >
          {soundOn ? <SoundOnIcon /> : <SoundOffIcon />}
          {soundOn ? 'SND ON' : 'SND OFF'}
        </button>

        <span className="font-mono text-white/40 text-[8px] tracking-widest uppercase whitespace-nowrap">MADE WITH PASSION</span>

        {/* Barcode */}
        <div className="flex items-end gap-[1px]" aria-hidden="true">
          {[3,1,4,1,2,1,3,1,2,4,1,3].map((w, i) => (
            <div key={i} style={{ width: w, height: 16, background: 'rgba(255,255,255,.25)' }} />
          ))}
        </div>
        <span className="font-mono text-white/40 text-[10px]">+</span>
        <span className="font-mono text-white/30 text-[11px]">✳</span>
      </div>
    </footer>
  )
}
