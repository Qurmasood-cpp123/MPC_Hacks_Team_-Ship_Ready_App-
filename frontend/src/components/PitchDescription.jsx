import { useState, useEffect, useRef } from 'react'

const toLines = (text) =>
  text.split(/(?<=[.!?])\s+/).filter(Boolean).join('\n')

const PitchDescription = ({ pitchText, isStreaming, onDone }) => {
  const [revealed, setRevealed] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copied, setCopied] = useState(false)
  const intervalRef = useRef(null)
  const indexRef = useRef(0)
  const fullTextRef = useRef('')

  useEffect(() => {
    if (!pitchText) return

    fullTextRef.current = toLines(pitchText)

    if (intervalRef.current) clearInterval(intervalRef.current)
    indexRef.current = 0
    setRevealed('')
    setIsTyping(true)

    intervalRef.current = setInterval(() => {
      const step = Math.floor(Math.random() * 3) + 2
      const next = indexRef.current + step
      setRevealed(fullTextRef.current.slice(0, next))
      indexRef.current = next

      if (next >= fullTextRef.current.length) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setIsTyping(false)
        if (onDone) onDone()
      }
    }, 35)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [pitchText])

  const handleCopy = () => {
    if (!revealed) return
    navigator.clipboard.writeText(revealed)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='bg-panel border border-white/10 rounded-2xl p-6 min-h-32'>
      <div className='flex items-center justify-between mb-4'>
        <p className='text-muted text-xs uppercase tracking-widest font-mono'>
          60-second pitch
        </p>
        {revealed && !isTyping && (
          <button
            onClick={handleCopy}
            className='text-xs font-mono text-muted hover:text-ink transition-colors duration-150'
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>
      <p className='text-ink leading-relaxed whitespace-pre-wrap text-base'>
        {revealed || (
          <span className='text-muted/50'>
            Your pitch will appear here after analysis...
          </span>
        )}
        {(isTyping || isStreaming) && (
          <span className='animate-pulse text-brand'>▌</span>
        )}
      </p>
    </div>
  )
}

export default PitchDescription
