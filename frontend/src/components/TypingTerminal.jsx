import { useState, useEffect } from 'react'

const skipAnimation = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const TypingTerminal = ({ lines = [], speed = 28, loop = false }) => {
  const totalChars = lines.reduce((sum, l) => sum + l.text.length, 0)
  const reduced = skipAnimation()

  const [typed, setTyped] = useState(reduced ? totalChars : 0)
  const done = typed >= totalChars

  useEffect(() => {
    if (reduced) {
      setTyped(totalChars)
      return
    }
    if (done) {
      if (!loop) return
      const t = setTimeout(() => setTyped(0), 1500)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setTyped(c => c + 1), speed)
    return () => clearTimeout(t)
  }, [typed, done, totalChars, speed, loop, reduced])

  // Slice each line's text based on how many total chars have been typed
  let remaining = typed
  const segments = lines.map(line => {
    const show = Math.min(remaining, line.text.length)
    remaining = Math.max(0, remaining - line.text.length)
    return { color: line.color, visible: line.text.slice(0, show), full: line.text }
  })

  // Cursor sits at the end of the currently-typing line, or last line when done
  const cursorAt = done
    ? segments.length - 1
    : segments.findIndex(s => s.visible.length < s.full.length)

  return (
    <div className="bg-panel rounded-lg overflow-hidden text-sm">

      {/* top bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-muted/20">
        <span className="w-3 h-3 rounded-full bg-danger" />
        <span className="w-3 h-3 rounded-full bg-warn" />
        <span className="w-3 h-3 rounded-full bg-success" />
        <span className="ml-3 text-muted text-xs font-mono tracking-wide">
          shipready
        </span>
      </div>

      {/* body */}
      <div className="p-4 font-mono leading-relaxed space-y-0.5 min-h-[5rem]">
        {segments.map((seg, i) => {
          const isCursor = i === cursorAt
          if (!seg.visible && !isCursor) return null
          return (
            <div key={i} className={seg.color ?? 'text-ink'}>
              {seg.visible}
              {isCursor && (
                <span className="animate-pulse text-muted">▋</span>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default TypingTerminal
