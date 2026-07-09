/* ── Barcode decoration ── */
const Barcode = () => {
  const bars = [3,1,4,1,2,1,3,1,2,4,1,2,1,3,1,2,4,1,3,1]
  return (
    <div className="flex items-end gap-[1.5px]" aria-hidden="true">
      {bars.map((w, i) => (
        <div key={i} style={{ width: w, height: 28, background: '#000', opacity: 0.85 }} />
      ))}
    </div>
  )
}

/* ── Target circle ── */
const Target = ({ size = 24, color = '#000' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="5"  stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="1.5" fill={color}/>
    <line x1="12" y1="2"  x2="12" y2="5"  stroke={color} strokeWidth="1.5"/>
    <line x1="12" y1="19" x2="12" y2="22" stroke={color} strokeWidth="1.5"/>
    <line x1="2"  y1="12" x2="5"  y2="12" stroke={color} strokeWidth="1.5"/>
    <line x1="19" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.5"/>
  </svg>
)

/* ── Gear icon ── */
const GearIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" aria-hidden="true">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
  </svg>
)

/* ── Compass rose ── */
const Compass = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
    <polygon points="12,6 13.5,11.5 12,10 10.5,11.5" fill="currentColor"/>
    <polygon points="12,18 10.5,12.5 12,14 13.5,12.5" fill="currentColor" opacity=".4"/>
  </svg>
)

/* ── Contact icons ── */
const EnvelopeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
)

const BehanceIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7.5 11.25c.69 0 1.25-.56 1.25-1.25S8.19 8.75 7.5 8.75H4.5v2.5h3zm.25 2.25H4.5v2.75h3.5c.83 0 1.5-.67 1.5-1.5s-.67-1.25-1.75-1.25zM0 6v12h9.25c2.07 0 3.75-1.68 3.75-3.75 0-1.2-.57-2.27-1.45-2.95.56-.6.95-1.38.95-2.3C12.5 7.12 10.88 6 9 6H0zM15.5 8.5h5.5V7h-5.5v1.5zm2.75 7.25c-1.1 0-2-.67-2.25-1.75h6.5c0-3-1.81-5-4.25-5s-4.25 2-4.25 4.75 1.81 4.75 4.25 4.75c1.87 0 3.31-.97 4-2.5h-2.12c-.37.53-1 .75-1.88.75z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
  </svg>
)

const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M12 22s-8-7.5-8-13a8 8 0 0116 0c0 5.5-8 13-8 13z"/>
    <circle cx="12" cy="9" r="2.5"/>
  </svg>
)

/* ── Cat mascot fallback SVG ── */
const CatMascotSVG = ({ size = 110 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" aria-label="Cat mascot logo">
    <rect width="120" height="120" fill="#fff"/>
    <polygon points="28,38 18,10 44,30" fill="#000"/>
    <polygon points="32,36 24,16 42,30" fill="#fff"/>
    <polygon points="92,38 102,10 76,30" fill="#000"/>
    <polygon points="88,36 96,16 78,30" fill="#fff"/>
    <ellipse cx="60" cy="68" rx="34" ry="32" fill="#000"/>
    <path d="M44 62 L38 55 L50 55 Z" fill="#fff"/>
    <path d="M76 62 L70 55 L82 55 Z" fill="#fff"/>
    <polygon points="60,74 57,71 63,71" fill="#fff"/>
    <line x1="35" y1="76" x2="55" y2="74" stroke="#fff" strokeWidth="1.5"/>
    <line x1="35" y1="80" x2="55" y2="78" stroke="#fff" strokeWidth="1.5"/>
    <line x1="65" y1="74" x2="85" y2="76" stroke="#fff" strokeWidth="1.5"/>
    <line x1="65" y1="78" x2="85" y2="80" stroke="#fff" strokeWidth="1.5"/>
    <ellipse cx="60" cy="68" rx="34" ry="32" stroke="#000" strokeWidth="2.5" fill="none"/>
  </svg>
)

const CONTACTS = [
  { icon: <EnvelopeIcon />, text: 'mooryoungyadanix@gmail.com',       href: 'mailto:mooryoungyadanix@gmail.com' },
  { icon: <BehanceIcon />,  text: 'behance.net/danpistolet',          href: 'https://behance.net/danpistolet' },
  { icon: <LinkedInIcon />, text: 'linkedin.com/in/danil-petrukhin',  href: 'https://www.linkedin.com/in/danil-petrukhin' },
  { icon: <PinIcon />,      text: 'Switzerland', sub: 'Open to Remote Work', href: null },
]

/* ═══════════════════════════════════════════
   ANIME PANEL — lime green, left column
══════════════════════════════════════════════ */
function AnimePanel() {
  return (
    <div
      className="anim-anime relative overflow-hidden shrink-0 self-stretch mobile-hero-anime"
      style={{ width: '36%', background: '#C8E500', minHeight: 440 }}
      aria-label="Character portrait panel"
    >
      <div className="scanline-el" />

      {/* Character — fills panel */}
      <img
        src="/assets/anime-character.png"
        alt="Daniel Moor-Young — anime character portrait"
        className="absolute inset-0 w-full h-full object-cover select-none"
        style={{ objectPosition: 'center 15%' }}
        draggable="false"
        onError={e => { e.currentTarget.style.display = 'none' }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════
   PROFILE PANEL — cream, right column, 2-col
══════════════════════════════════════════════ */
function ProfilePanel() {
  return (
    <div
      className="anim-profile relative flex-1 self-stretch mobile-hero-profile"
      style={{ background: '#EDE9D3' }}
      aria-label="Profile information panel"
    >
      {/* ── Content — fills the full panel height via flex ── */}
      <div
        className="flex flex-col px-4 pt-2 pb-3"
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* Badge row */}
        <div
          className="inline-flex self-start items-center gap-1.5 px-3 py-0.5 mb-2 shrink-0
                     font-mono font-bold text-[9px] tracking-widest uppercase text-white"
          style={{ background: '#1a1a1a' }}
        >
          USER PROFILE <span className="opacity-50">○</span> DATA FILE
        </div>

        {/* Two-column body — fills remaining height */}
        <div className="flex gap-6 flex-1 min-h-0">

          {/* LEFT — name / title / bio / contacts */}
          <div className="flex flex-col" style={{ flex: '0 0 62%' }}>
            <h1
              className="font-display text-black uppercase leading-none"
              style={{ fontSize: 'clamp(38px, 4.6vw, 64px)', letterSpacing: '-0.01em', lineHeight: 0.88 }}
            >
              DANIEL<br />MOOR-YOUNG
            </h1>

            <p
              className="font-mono font-bold uppercase tracking-[0.28em] mt-2 mb-2 shrink-0"
              style={{ color: '#6aaa18', fontSize: 11 }}
            >
              MOTION DESIGNER
            </p>

            <p
              className="font-mono text-black mb-3"
              style={{ fontSize: 'clamp(9px, 0.88vw, 11px)', lineHeight: 1.75, maxWidth: 400 }}
            >
              Creative Motion Designer with a background in graphic design and
              technical support. I create modern motion graphics, 2D animations
              and marketing creatives for digital products and social media.
              Passionate about visual storytelling, AI tools and continuous learning.
            </p>

            {/* Contact rows */}
            <div className="flex flex-col gap-2 shrink-0 mt-5">
              {CONTACTS.map(({ icon, text, sub, href }, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div
                    className="flex items-center justify-center border border-black/25 shrink-0 mt-px"
                    style={{ width: 20, height: 20, background: '#DDD9C2' }}
                    aria-hidden="true"
                  >
                    {icon}
                  </div>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="font-mono text-black hover:underline"
                      style={{ fontSize: 'clamp(9px, 0.82vw, 11px)', lineHeight: 1.4 }}
                    >
                      {text}
                    </a>
                  ) : (
                    <div style={{ lineHeight: 1.3 }}>
                      <div className="font-mono text-black" style={{ fontSize: 'clamp(9px, 0.82vw, 11px)' }}>{text}</div>
                      {sub && <div className="font-mono font-bold" style={{ fontSize: 9, color: '#6aab3a' }}>{sub}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — cat logo + HUD fill */}
          <div className="flex flex-col flex-1 min-w-0 relative">
            <div className="flex justify-end shrink-0" aria-hidden="true">
              <img
                src="/assets/cat-logo-light.png"
                alt=""
                width="168"
                height="168"
                className="object-contain"
                style={{ opacity: 0.85 }}
                onError={e => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextSibling.style.display = 'block'
                }}
              />
              <div style={{ display: 'none' }}><CatMascotSVG /></div>
            </div>
            {/* Subtle HUD fill — coordinates + crosshair */}
            <div className="absolute bottom-3 right-0 flex flex-col items-end gap-1.5 opacity-20 select-none" aria-hidden="true">
              <div className="font-mono text-black text-[8px] tracking-wider">46°57′N 7°26′E</div>
              <div className="font-mono text-black text-[8px] tracking-wider">SYS_OK · v2.4.1</div>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="13" stroke="black" strokeWidth="1"/>
                <circle cx="16" cy="16" r="5" stroke="black" strokeWidth="1"/>
                <line x1="16" y1="2" x2="16" y2="8" stroke="black" strokeWidth="1"/>
                <line x1="16" y1="24" x2="16" y2="30" stroke="black" strokeWidth="1"/>
                <line x1="2" y1="16" x2="8" y2="16" stroke="black" strokeWidth="1"/>
                <line x1="24" y1="16" x2="30" y2="16" stroke="black" strokeWidth="1"/>
                <circle cx="16" cy="16" r="1.5" fill="black"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   HERO SECTION
══════════════════════════════════════════════ */
export default function HeroSection() {
  return (
    <div
      className="flex w-full mobile-hero-grid"
      style={{ borderBottom: '1.5px solid #222', minHeight: 400 }}
    >
      <AnimePanel />
      <ProfilePanel />
    </div>
  )
}
