import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/* keep useRef/gsap for the logo float animation only */
const CatMascotSVG = () => (
  <svg viewBox="0 0 120 120" fill="none" aria-label="Cat mascot" width="100%" height="100%">
    <rect width="120" height="120" fill="#0A0A0A"/>
    {/* Japanese kanji overlay (stylized) */}
    <text x="5" y="55" fontFamily="Noto Sans JP, sans-serif" fontSize="32" fontWeight="900" fill="white" opacity=".85">猫</text>
    <text x="72" y="55" fontFamily="Noto Sans JP, sans-serif" fontSize="32" fontWeight="900" fill="white" opacity=".85">森</text>
    <text x="5" y="110" fontFamily="Noto Sans JP, sans-serif" fontSize="32" fontWeight="900" fill="white" opacity=".85">者</text>
    <text x="72" y="110" fontFamily="Noto Sans JP, sans-serif" fontSize="32" fontWeight="900" fill="white" opacity=".85">番</text>
    {/* Ears */}
    <polygon points="32,52 22,28 46,44" fill="white"/>
    <polygon points="35,50 27,33 44,44" fill="#0A0A0A"/>
    <polygon points="88,52 98,28 74,44" fill="white"/>
    <polygon points="85,50 93,33 76,44" fill="#0A0A0A"/>
    {/* Head */}
    <ellipse cx="60" cy="75" rx="30" ry="28" fill="white"/>
    {/* Dark half */}
    <path d="M60 47 Q90 52 90 75 Q90 103 60 103 Z" fill="#1a1a1a"/>
    {/* Eyes */}
    <path d="M44 70 L38 63 L50 63 Z" fill="#0A0A0A"/>
    <path d="M76 70 L70 63 L82 63 Z" fill="white"/>
    {/* Nose */}
    <polygon points="60,80 57,77 63,77" fill="#0A0A0A"/>
    {/* Mouth */}
    <path d="M57 81 Q60 84 63 81" stroke="#0A0A0A" strokeWidth="1.2" fill="none"/>
    {/* Whiskers left */}
    <line x1="36" y1="79" x2="56" y2="77" stroke="#0A0A0A" strokeWidth="1.3"/>
    <line x1="36" y1="83" x2="56" y2="81" stroke="#0A0A0A" strokeWidth="1.3"/>
    {/* Whiskers right */}
    <line x1="64" y1="77" x2="84" y2="79" stroke="white" strokeWidth="1.3"/>
    <line x1="64" y1="81" x2="84" y2="83" stroke="white" strokeWidth="1.3"/>
    {/* Outline */}
    <ellipse cx="60" cy="75" rx="30" ry="28" stroke="white" strokeWidth="2.5" fill="none"/>
    {/* Glitch stripes */}
    <rect x="0" y="58" width="20" height="4" fill="white" opacity=".7"/>
    <rect x="95" y="72" width="25" height="3" fill="white" opacity=".5"/>
    <rect x="0" y="95" width="15" height="3" fill="white" opacity=".4"/>
    <rect x="100" y="90" width="20" height="4" fill="white" opacity=".6"/>
  </svg>
)

export default function IRLPortrait() {
  const logoRef = useRef(null)

  useEffect(() => {
    gsap.to(logoRef.current, { y: -5, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 })
  }, [])

  const colorBlocks = ['#FF4444', '#C8E500', '#4488FF']

  return (
    <div
      className="anim-irl flex flex-col panel-divider mobile-irl"
      style={{ width: '25%', background: '#0E0E0E' }}
      aria-label="IRL Portrait panel"
    >
      {/* Panel header — window style */}
      <div
        className="flex items-center justify-between px-2 py-0.5 shrink-0"
        style={{ borderBottom: '1px solid #222' }}
      >
        <span className="font-mono font-bold text-[10px] tracking-widest text-white uppercase whitespace-nowrap">
          IRL PORTRAIT
        </span>
        <div className="flex items-center gap-2">
          {/* Window controls */}
          <div className="flex gap-1" aria-hidden="true">
            <span className="font-mono text-white/30 text-[9px] cursor-pointer hover:text-white/70">_</span>
            <span className="font-mono text-white/30 text-[9px] cursor-pointer hover:text-white/70">□</span>
            <span className="font-mono text-white/30 text-[9px] cursor-pointer hover:text-white/70">×</span>
          </div>
          {/* YO badge */}
          <div
            className="font-mono font-bold text-black text-[9px] px-1.5 py-0.5 tracking-wider"
            style={{ background: '#C8E500' }}
            aria-label="YO badge"
          >
            YO
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* Left: color pixel blocks */}
        <div className="flex flex-col justify-center gap-1 px-2 shrink-0" aria-hidden="true">
          {colorBlocks.map((c, i) => (
            <div key={i} className="w-2.5 h-8" style={{ background: c }} />
          ))}
        </div>

        {/* Center: cat logo */}
        <div ref={logoRef} className="flex-1 flex items-center justify-center p-1">
          <div className="glitch-img w-full h-full" style={{ maxWidth: 260, maxHeight: 260 }}>
            <img
              src="/assets/cat-logo-dark.png"
              alt="Cat mascot logo"
              className="w-full h-full object-contain object-center"
              onError={e => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextSibling.style.display = 'block'
              }}
            />
            <div style={{ display: 'none', width: '100%', height: '100%' }}>
              <CatMascotSVG />
            </div>
          </div>
        </div>

        {/* Right: vertical progress bar */}
        <div className="flex flex-col items-center justify-center gap-1 px-2 shrink-0" aria-hidden="true">
          <div className="font-mono text-white/40 text-[9px]">+</div>
          <div className="font-mono text-white/40 text-[9px]">+</div>
          <div
            className="w-1.5 flex-1 max-h-24 rounded-sm overflow-hidden relative"
            style={{ background: '#222' }}
          >
            <div className="absolute bottom-0 left-0 right-0" style={{ height: '60%', background: '#C8E500' }} />
          </div>
        </div>

        {/* Scanline on portrait */}
        <div className="scanline-el" />
      </div>

      {/* Bottom: WIP sticker + heart button */}
      <div
        className="flex items-center justify-between px-2 py-0.5 shrink-0"
        style={{ borderTop: '1px solid #222' }}
      >
        {/* WIP sticker */}
        <div
          className="relative px-2.5 py-1 select-none overflow-hidden"
          style={{
            background: '#C8E500',
            border: '1.5px solid #000',
            transform: 'rotate(-1.5deg)',
          }}
          aria-label="WIP sticker"
        >
          <div className="diagonal-stripe absolute inset-0 opacity-20" aria-hidden="true" />
          <div className="relative font-mono font-bold text-black leading-tight" style={{ fontSize: 8 }}>
            <div>制作中</div>
            <div className="tracking-wider">WIP</div>
          </div>
        </div>

        {/* Heart counter */}
        <button
          className="flex items-center gap-1.5 px-3 py-1 font-mono font-bold text-white rounded-full cursor-pointer hover:bg-white/10 transition-colors"
          style={{ background: '#1a1a1a', border: '1px solid #333', fontSize: 10 }}
          aria-label="001 hearts"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          001
        </button>
      </div>
    </div>
  )
}
