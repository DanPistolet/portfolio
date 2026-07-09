import { useEffect, useRef } from 'react'

/* ── petal factory ───────────────────────────────────────────────── */
function mkPetal(W, H, respawn = false) {
  const fromLeft = respawn && Math.random() < 0.3
  return {
    x:         fromLeft ? -12 : Math.random() * W,
    y:         fromLeft ? Math.random() * H * 0.7 : (respawn ? -12 : Math.random() * H),
    vx:        0.22 + Math.random() * 0.38,
    vy:        0.30 + Math.random() * 0.45,
    rotation:  Math.random() * Math.PI * 2,
    rotSpeed:  (Math.random() - 0.5) * 0.016,
    sway:      Math.random() * Math.PI * 2,
    swaySpeed: 0.003 + Math.random() * 0.006,
    swayAmp:   0.20 + Math.random() * 0.45,
    opacity:   0.22 + Math.random() * 0.28,
    size:      2.8 + Math.random() * 3.2,
  }
}

/* ── draw a simple curved leaf/petal ────────────────────────────── */
function drawPetal(ctx, p) {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)
  ctx.globalAlpha = p.opacity
  ctx.fillStyle = '#fff8fc'
  ctx.beginPath()
  ctx.moveTo(0, -p.size)
  ctx.quadraticCurveTo( p.size * 0.55,  0, 0,  p.size)
  ctx.quadraticCurveTo(-p.size * 0.55,  0, 0, -p.size)
  ctx.fill()
  ctx.restore()
}

/* bassRef: shared ref from App (0-1 smoothed bass level) */
export default function SakuraLayer({ bassRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const isMobile = window.innerWidth < 768
    const COUNT    = isMobile ? 5 : 10

    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width  = W
    canvas.height = H

    const petals = Array.from({ length: COUNT }, () => mkPetal(W, H))

    let raf
    const tick = () => {
      ctx.clearRect(0, 0, W, H)

      /* bass level from App's AudioEngine (0-1, already smoothed) */
      const b     = bassRef?.current ?? 0
      /* speed boost: max +12% when bass peaks */
      const boost = 1 + b * 0.12

      petals.forEach((p, i) => {
        p.sway     += p.swaySpeed
        p.x        += (p.vx + Math.sin(p.sway) * p.swayAmp) * boost
        p.y        += p.vy * boost
        p.rotation += p.rotSpeed

        if (p.y > H + 16 || p.x > W + 16) {
          petals[i] = mkPetal(W, H, true)
        }

        /* subtle opacity pulse on bass */
        const savedOpacity = p.opacity
        p.opacity = Math.min(p.opacity * (1 + b * 0.15), 0.65)
        drawPetal(ctx, p)
        p.opacity = savedOpacity
      })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onResize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = W
      canvas.height = H
    }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [bassRef])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        8,
        pointerEvents: 'none',
        mixBlendMode:  'screen',
      }}
    />
  )
}
