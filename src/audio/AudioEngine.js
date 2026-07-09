/* ─────────────────────────────────────────────────────────────────
   AudioEngine — Web Audio API wrapper
   Handles: load, play, pause, fade in/out, bass analysis
───────────────────────────────────────────────────────────────── */

const TARGET_VOLUME = 0.25
const FADE_DURATION = 1.0   /* seconds */

export class AudioEngine {
  constructor() {
    this.ctx      = null
    this.source   = null
    this.gain     = null
    this.analyser = null
    this.buffer   = null
    this._ready   = false
    this._playing = false
    this._stopping = false
  }

  get playing() { return this._playing }

  /* Call once, after a user gesture */
  async init() {
    if (this._ready) return true
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return false

      this.ctx      = new Ctx()
      this.gain     = this.ctx.createGain()
      this.gain.gain.value = 0

      this.analyser = this.ctx.createAnalyser()
      this.analyser.fftSize              = 64
      this.analyser.smoothingTimeConstant = 0.82

      this.gain.connect(this.analyser)
      this.analyser.connect(this.ctx.destination)

      const resp   = await fetch('/assets/audio/ambient.mp3')
      const ab     = await resp.arrayBuffer()
      this.buffer  = await this.ctx.decodeAudioData(ab)
      this._ready  = true
      return true
    } catch (e) {
      console.warn('[AudioEngine] init failed:', e.message)
      return false
    }
  }

  /* Fade in and start looping */
  async play() {
    if (!this._ready || this._playing) return
    if (this.ctx.state === 'suspended') await this.ctx.resume()

    this._stopping = false
    this.source = this.ctx.createBufferSource()
    this.source.buffer = this.buffer
    this.source.loop   = true
    this.source.connect(this.gain)
    this.source.start(0)
    this._playing = true

    const now = this.ctx.currentTime
    this.gain.gain.cancelScheduledValues(now)
    this.gain.gain.setValueAtTime(0, now)
    this.gain.gain.linearRampToValueAtTime(TARGET_VOLUME, now + FADE_DURATION)
  }

  /* Fade out and stop */
  pause() {
    if (!this._playing || this._stopping) return
    this._stopping = true

    const now = this.ctx.currentTime
    this.gain.gain.cancelScheduledValues(now)
    this.gain.gain.setValueAtTime(this.gain.gain.value, now)
    this.gain.gain.linearRampToValueAtTime(0, now + FADE_DURATION)

    setTimeout(() => {
      if (this.source) {
        try { this.source.stop() } catch (_) {}
        this.source = null
      }
      this._playing  = false
      this._stopping = false
    }, (FADE_DURATION + 0.05) * 1000)
  }

  /* Returns smoothed bass energy 0–1 */
  getBassLevel() {
    if (!this.analyser || !this._playing) return 0
    const buf = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteFrequencyData(buf)
    /* average first 6 bins (~bass band) */
    const avg = (buf[0] + buf[1] + buf[2] + buf[3] + buf[4] + buf[5]) / 6
    return avg / 255
  }

  destroy() {
    this.pause()
    setTimeout(() => { try { this.ctx?.close() } catch (_) {} }, 1200)
  }
}
