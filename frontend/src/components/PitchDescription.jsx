import { useState, useEffect, useRef } from 'react'

const toLines = (text) =>
  text.split(/(?<=[.!?])\s+/).filter(Boolean).join('\n')

const PitchDescription = ({ pitchText, isStreaming, onDone, audioUrl }) => {
  const [revealed, setRevealed] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)
  const indexRef = useRef(0)
  const fullTextRef = useRef('')
  const audioRef = useRef(null)

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

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
  }

  return (
    <div className='bg-panel border border-white/10 rounded-2xl p-6 min-h-32'>
      <div className='flex items-center justify-between mb-4'>
        <p className='text-muted text-xs uppercase tracking-widest font-mono'>
          60-second pitch
        </p>
        <div className='flex items-center gap-4'>
          {audioUrl && revealed && !isTyping && (
            <button
              onClick={togglePlay}
              className='flex items-center gap-1.5 text-xs font-mono text-brand hover:brightness-125 transition-all duration-150'
            >
              {isPlaying ? '❚❚ Pause' : '▶ Listen'}
            </button>
          )}
          {revealed && !isTyping && (
            <button
              onClick={handleCopy}
              className='text-xs font-mono text-muted hover:text-ink transition-colors duration-150'
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          )}
        </div>
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

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </div>
  )
}

export default PitchDescription
