const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <ellipse cx="12" cy="12" rx="4" ry="10"/>
    <path d="M2 12h20"/>
  </svg>
)

const DiamondIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <polygon points="12,2 22,12 12,22 2,12"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <line x1="12" y1="2" x2="12" y2="22"/>
    <line x1="4.9" y1="4.9" x2="19.1" y2="19.1"/>
    <line x1="19.1" y1="4.9" x2="4.9" y2="19.1"/>
  </svg>
)

export default function TopNav() {
  return (
    <nav
      className="anim-nav flex items-center justify-between px-3 shrink-0 mobile-topnav"
      style={{ background: '#C8E500', height: 44, borderBottom: '1.5px solid #000' }}
      aria-label="Main navigation"
    >
      {/* Left brand */}
      <div className="flex items-center gap-2">
        <GlobeIcon />
        <span className="font-mono font-bold text-[10px] leading-tight tracking-widest uppercase">
          MOTION<br />DESIGNER
        </span>
      </div>

      {/* Center symbols */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 font-mono text-sm tracking-widest select-none" aria-hidden="true">
        <span>⊙</span>
        <span className="opacity-50">/</span>
        <span>✳</span>
        <span className="opacity-50">/</span>
        <span>□</span>
      </div>

      {/* Down arrow pointer (center-bottom) */}
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-[10px] z-10" aria-hidden="true">
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M5 1v8M1 6l4 3 4-3" stroke="#C8E500" strokeWidth="1.2" fill="none"/>
        </svg>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2">
        {/* Warning badge */}
        <div
          className="flex items-center gap-1.5 border border-black px-2 py-0.5"
          style={{ background: '#C8E500' }}
          aria-label="Creative Thinking Inside — Motion Designer — Handle With Respect"
        >
          <div className="flex items-center justify-center border border-black w-5 h-5 shrink-0">
            <span className="font-mono font-black text-[10px] leading-none">!</span>
          </div>
          <div className="font-mono text-[8px] leading-tight uppercase tracking-wider">
            <div className="font-bold">Creative Thinking Inside</div>
            <div>Motion Designer</div>
            <div>Handle With Respect</div>
          </div>
        </div>

        <DiamondIcon />

        <span className="font-mono text-[10px] font-bold tracking-wider">v1.0</span>
      </div>
    </nav>
  )
}
