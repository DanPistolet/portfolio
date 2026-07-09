const DataFileBadge = () => (
  <div className="flex items-center gap-1 font-mono text-[9px] tracking-widest uppercase text-white/50">
    <div className="w-1.5 h-1.5 rounded-full pulse-dot shrink-0" style={{ background: '#C8E500' }} aria-hidden="true" />
    DATA FILE
  </div>
)

/* Case logo with hover glow + scale */
function CaseLogo({ src, alt, glowColor = 'rgba(124,58,237,0.5)', blendMode = 'normal', wide = false }) {
  return (
    <div
      className="case-logo-wrap flex items-center justify-center"
      style={{ height: 80, width: '100%' }}
    >
      <img
        src={src}
        alt={alt}
        className="case-logo-img object-contain"
        style={{
          maxHeight: wide ? 80 : 72,
          maxWidth: wide ? '100%' : '95%',
          width: wide ? '100%' : undefined,
          mixBlendMode: blendMode,
          filter: 'drop-shadow(0 0 0px transparent)',
          transition: 'transform .3s cubic-bezier(.34,1.56,.64,1), filter .3s ease',
        }}
        onError={e => { e.currentTarget.style.display = 'none' }}
      />
      <style>{`
        .case-logo-wrap:hover .case-logo-img {
          transform: scale(1.12);
          filter: drop-shadow(0 0 14px ${glowColor});
        }
        .mission-case-card {
          border-radius: 1px;
          transition: background .2s;
        }
        .mission-case-card:hover {
          background: rgba(200,229,0,0.03);
        }
      `}</style>
    </div>
  )
}

const CASES = [
  {
    id: 'aura',
    num: 'CASE 01',
    title: 'AURA',
    sub: 'AI Career Assistant',
    tags: 'AI Motion / UI / Creative Direction',
    logo: { src: '/assets/aura-logo.png', alt: 'AURA project logo', glow: 'rgba(138,92,246,0.65)', blend: 'normal' },
    status: { label: 'IN PROGRESS', color: '#FF7A00' },
    type: 'UI / MOTION',
    year: '2026',
    link: null,
    linkLabel: 'ERROR',
    linkColor: '#ff4444',
  },
  {
    id: 'sunny',
    num: 'CASE 02',
    title: 'SUNNY',
    sub: 'Personal Project',
    tags: '3D / Visual / Motion',
    logo: { src: '/assets/sunny-logo.png', alt: 'Sunny project logo', glow: 'rgba(250,204,21,0.6)', blend: 'normal', wide: true },
    status: { label: 'COMPLETED', color: '#22c55e' },
    type: 'BRAND DESIGN',
    year: '2024',
    link: 'https://sunny.com',
    linkLabel: 'SUNNY.COM',
    linkColor: '#C8E500',
  },
]

export default function MissionLog({ onOpenCase }) {
  return (
    <div
      className="anim-mission flex flex-col panel-divider"
      style={{ width: '36%', background: '#0E0E0E' }}
      aria-label="Mission Log — Works and Case Files"
    >
      {/* Panel header */}
      <div
        className="flex items-center justify-between px-3 py-1 shrink-0"
        style={{ borderBottom: '1px solid #222' }}
      >
        <span className="font-mono font-bold text-[11px] tracking-widest uppercase" style={{ color: '#C8E500' }}>
          MISSION LOG
        </span>
        <DataFileBadge />
      </div>

      {/* Body */}
      <div className="flex flex-col px-3 pt-1.5 pb-0 gap-1 flex-1">

        <div className="font-mono font-bold text-[9px] tracking-widest uppercase shrink-0" style={{ color: '#C8E500' }}>
          WORKS / CASE FILES
        </div>

        {/* Two-column cases */}
        <div className="flex gap-3 flex-1 mobile-mission-cards">

          {CASES.map((c, ci) => (
            <div key={ci} className="contents">
            {ci === 1 && <div style={{ width: 1, background: '#222', flexShrink: 0 }} aria-hidden="true" />}
            <div
              className="flex flex-col flex-1 min-w-0 mission-case-card"
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              aria-label={`Open ${c.title} case file`}
              onClick={() => onOpenCase?.(c.id ?? c.title.toLowerCase())}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onOpenCase?.(c.id ?? c.title.toLowerCase()) }}
            >

              {/* Case number + title */}
              <div className="font-mono text-[9px] text-white/40 tracking-wider uppercase">{c.num}</div>
              <div className="font-mono font-bold text-white text-[12px] uppercase tracking-wide mt-0.5">{c.title}</div>
              <div className="font-mono text-white/60 text-[9px] mt-1">{c.sub}</div>
              <div className="font-mono text-white/40 text-[8px] mt-0.5 leading-tight">{c.tags}</div>

              {/* Logo */}
              <div className="flex items-center justify-center shrink-0 mt-1">
                <CaseLogo src={c.logo.src} alt={c.logo.alt} glowColor={c.logo.glow} blendMode={c.logo.blend} wide={c.logo.wide} />
              </div>

              {/* Meta */}
              <div className="space-y-px mt-1 shrink-0">
                <div className="font-mono text-[8px] uppercase tracking-wider whitespace-nowrap">
                  <span className="text-white/40">STATUS: </span>
                  <span className="font-bold" style={{ color: c.status.color }}>{c.status.label}</span>
                </div>
                <div className="font-mono text-[8px] uppercase tracking-wider whitespace-nowrap">
                  <span className="text-white/40">TYPE: </span>
                  <span className="text-white/70">{c.type}</span>
                </div>
                <div className="font-mono text-[8px] uppercase tracking-wider whitespace-nowrap">
                  <span className="text-white/40">YEAR: </span>
                  <span className="text-white/70">{c.year}</span>
                </div>
                <div className="font-mono text-[8px] uppercase tracking-wider whitespace-nowrap" style={{ color: 'rgba(200,229,0,0.65)' }}>
                  VIEW CASE →
                </div>
              </div>

            </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}
