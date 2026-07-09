const DataFileBadge = () => (
  <div className="flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase text-white/50">
    <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#C8E500' }} aria-hidden="true" />
    DATA FILE
  </div>
)

const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="1.5"/>
    <path d="M10 8l6 4-6 4V8z" fill="white"/>
  </svg>
)

const tools = {
  left: ['After Effects', 'Rive', 'Photoshop', 'Blender', 'Figma', 'Premier Pro'],
  right: ['ChatGPT', 'Claude', 'Midjourney', 'Runway', 'Kling', 'CapCut'],
}

/* Inline QR code SVG */
const QRCode = () => (
  <svg viewBox="0 0 100 100" width="86" height="86" xmlns="http://www.w3.org/2000/svg" aria-label="QR code — Telegram @yadanix">
    <rect width="100" height="100" fill="white"/>
    {/* Top-left finder */}
    <rect x="5" y="5" width="28" height="28" rx="2" fill="none" stroke="#000" strokeWidth="3"/>
    <rect x="11" y="11" width="16" height="16" rx="1" fill="#000"/>
    {/* Top-right finder */}
    <rect x="67" y="5" width="28" height="28" rx="2" fill="none" stroke="#000" strokeWidth="3"/>
    <rect x="73" y="11" width="16" height="16" rx="1" fill="#000"/>
    {/* Bottom-left finder */}
    <rect x="5" y="67" width="28" height="28" rx="2" fill="none" stroke="#000" strokeWidth="3"/>
    <rect x="11" y="73" width="16" height="16" rx="1" fill="#000"/>
    {/* Data dots */}
    {[
      [40,5],[46,5],[52,5],[40,11],[52,11],[46,17],[40,23],[52,23],[46,29],
      [5,40],[11,40],[23,40],[40,40],[52,40],[58,40],[70,40],[82,40],[88,40],
      [5,46],[17,46],[40,46],[64,46],[76,46],[88,46],
      [5,52],[11,52],[29,52],[46,52],[58,52],[70,52],[82,52],
      [5,58],[23,58],[40,58],[52,58],[70,58],[88,58],
      [40,64],[52,64],[64,64],[76,64],[88,64],
      [46,70],[58,70],[70,70],[82,70],
      [40,76],[52,76],[76,76],[88,76],
      [40,82],[46,82],[58,82],[70,82],[82,82],[88,82],
    ].map(([x,y],i) => <rect key={i} x={x} y={y} width="5" height="5" fill="#000"/>)}
  </svg>
)

/* Video preview cards — mapped to MOTION_VIDEOS indices 1, 2, 3 */
const thumbs = [
  { src: '/assets/motion-thumb-01.png', label: 'PRODUCT MOTION 01', dur: '00:10', cat: 'PRODUCT',      videoIndex: 1 },
  { src: '/assets/motion-thumb-02.png', label: 'PRODUCT MOTION 02', dur: '00:05', cat: 'PRODUCT',      videoIndex: 2 },
  { src: '/assets/motion-thumb-03.png', label: 'STATUE MOTION',     dur: '00:15', cat: 'EXPERIMENTAL', videoIndex: 3 },
]

export default function MotionPractice({ onOpenCase }) {
  return (
    <div
      className="anim-motion flex flex-col flex-1"
      style={{ background: '#0E0E0E' }}
      aria-label="Motion Practice panel"
    >
      {/* Panel header — click to open case modal */}
      <div
        className="flex items-center justify-between px-3 py-1 shrink-0 motion-header-btn"
        style={{ borderBottom: '1px solid #222', cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        aria-label="Open Motion Practice case file"
        onClick={() => onOpenCase?.('motion')}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onOpenCase?.('motion') }}
      >
        <span className="font-mono font-bold text-[11px] tracking-widest uppercase text-white">
          MOTION PRACTICE
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="font-mono motion-view-case" style={{ fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(200,229,0,0)', transition: 'color .2s' }}>
            VIEW CASE →
          </span>
          <DataFileBadge />
        </div>
      </div>
      <style>{`
        .motion-header-btn:hover .motion-view-case { color: rgba(200,229,0,0.65) !important; }
        .motion-header-btn:hover { background: rgba(200,229,0,0.025); }
      `}</style>

      {/* Video section — fixed height so divider is locked */}
      <div className="shrink-0" style={{ height: 112 }}>
        {/* Video thumbnails */}
        <div className="flex gap-2 px-3 pt-1 pb-0 mobile-motion-thumbs">
          {thumbs.map((t, i) => (
            <div
              key={i}
              className="video-thumb flex-1 relative overflow-hidden rounded-[2px] cursor-pointer group"
              style={{ height: 90, background: '#050d03' }}
              role="button"
              tabIndex={0}
              aria-label={`Open ${t.label} in Motion archive`}
              onClick={() => onOpenCase?.({ id: 'motion', tab: 'VIDEOS', videoIndex: t.videoIndex })}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onOpenCase?.({ id: 'motion', tab: 'VIDEOS', videoIndex: t.videoIndex }) }}
            >
              {/* Real thumbnail */}
              <img
                src={t.src}
                alt=""
                aria-hidden="true"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.72, transition: 'opacity .25s' }}
                className="group-hover:opacity-90"
              />

              {/* Scanlines */}
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
                backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.09) 2px,rgba(0,0,0,0.09) 3px)' }} />

              {/* Vignette */}
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at 50% 60%,transparent 35%,rgba(0,0,0,0.62) 100%)' }} />

              {/* HUD border frame — corners only */}
              {[
                { top: 3, left: 3,  borderTop: '1px solid rgba(200,229,0,0.35)', borderLeft:  '1px solid rgba(200,229,0,0.35)', width: 7, height: 7 },
                { top: 3, right: 3, borderTop: '1px solid rgba(200,229,0,0.35)', borderRight: '1px solid rgba(200,229,0,0.35)', width: 7, height: 7 },
                { bottom: 3, left: 3,  borderBottom: '1px solid rgba(200,229,0,0.35)', borderLeft:  '1px solid rgba(200,229,0,0.35)', width: 7, height: 7 },
                { bottom: 3, right: 3, borderBottom: '1px solid rgba(200,229,0,0.35)', borderRight: '1px solid rgba(200,229,0,0.35)', width: 7, height: 7 },
              ].map((s, ci) => (
                <div key={ci} aria-hidden="true" style={{ position: 'absolute', zIndex: 4, pointerEvents: 'none', transition: 'border-color .25s', ...s }}
                  className="group-hover:[border-color:rgba(200,229,0,0.7)!important]" />
              ))}

              {/* Bottom gradient bar */}
              <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5, pointerEvents: 'none',
                padding: '10px 6px 5px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.82))' }}>
                {/* bottom-left: title */}
                <span style={{ fontFamily: 'monospace', fontSize: 6.5, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.6)', lineHeight: 1, transition: 'color .25s' }}
                  className="group-hover:text-[rgba(255,255,255,0.88)]"
                >{t.label}</span>
                {/* bottom-right: duration */}
                <span style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.06em',
                  color: 'rgba(200,229,0,0.65)', transition: 'color .25s' }}
                  className="group-hover:text-[rgba(200,229,0,0.95)]"
                >{t.dur}</span>
              </div>

              {/* Hover border glow */}
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
                border: '1px solid rgba(200,229,0,0)', transition: 'border-color .25s, box-shadow .25s',
                boxShadow: 'none' }}
                className="group-hover:!border-[rgba(200,229,0,0.28)] group-hover:![box-shadow:inset_0_0_10px_rgba(200,229,0,0.06)]" />
            </div>
          ))}
        </div>

        {/* Open case button */}
        <div className="flex justify-center" style={{ paddingTop: 4 }}>
        <button
          className="text-white/40 hover:text-white transition-colors cursor-pointer"
          aria-label="Open Motion Practice case file"
          onClick={() => onOpenCase?.({ id: 'motion', tab: 'VIDEOS' })}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v8M8 12l4 4 4-4"/>
          </svg>
        </button>
        </div>
      </div>{/* end fixed-height video section */}

      {/* Bottom sub-panels */}
      <div className="flex flex-1 mobile-motion-bottom" style={{ borderTop: '1px solid #222' }}>

        {/* Tools / Software */}
        <div
          className="flex flex-col panel-divider flex-1"
          aria-label="Tools and Software"
        >
          <div
            className="flex items-center gap-1.5 px-3 py-0.5 shrink-0"
            style={{ borderBottom: '1px solid #222' }}
          >
            <span className="font-mono font-bold text-[9px] tracking-widest uppercase text-white">
              Tools / Software
            </span>
            <div className="flex items-center gap-1 font-mono text-[8px] text-white/30">
              <div className="w-1 h-1 rounded-full" style={{ background: '#C8E500' }} aria-hidden="true" />
              DATA FILE
            </div>
          </div>
          <div className="flex gap-5 px-3 py-2 flex-1 items-start content-start">
            <div className="flex flex-col gap-2">
              {tools.left.map(t => (
                <div key={t} className="font-mono text-white/70 text-[10px] hover:text-white transition-colors cursor-default whitespace-nowrap">{t}</div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {tools.right.map(t => (
                <div key={t} className="font-mono text-white/70 text-[10px] hover:text-white transition-colors cursor-default whitespace-nowrap">{t}</div>
              ))}
            </div>
          </div>
        </div>

        {/* QR */}
        <div className="flex flex-col overflow-hidden shrink-0 mobile-qr-panel" style={{ width: 168 }} aria-label="Contact QR code">
          <div
            className="flex items-center gap-1.5 px-2 py-0.5 shrink-0"
            style={{ borderBottom: '1px solid #222' }}
          >
            <span className="font-mono font-bold text-[9px] tracking-widest uppercase text-white">QR</span>
            <div className="flex items-center gap-1 font-mono text-[8px] text-white/30">
              <div className="w-1 h-1 rounded-full" style={{ background: '#C8E500' }} aria-hidden="true" />
              DATA FILE
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 p-2 flex-1">
            <div className="font-mono text-white text-[10px] text-center leading-snug shrink-0">
              Contact<br />me on<br />
              <span className="font-bold">Telegram</span>
            </div>
            <a
              href="https://t.me/yadanix"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Telegram @yadanix"
              className="qr-link block shrink-0"
              style={{ transition: 'transform .25s ease, filter .25s ease' }}
            >
              <QRCode />
              <style>{`.qr-link:hover { transform: scale(1.06); filter: drop-shadow(0 0 8px rgba(200,229,0,0.4)); }`}</style>
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
