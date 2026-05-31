import { useState, useEffect } from 'react'

// hand-built animated SVG ring — no charting library
const RADIUS = 52
const STROKE = 8
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const ringColor = (s) => (s >= 70 ? 'text-success' : s >= 40 ? 'text-warn' : 'text-danger')

const ScoreRing = ({ score = 0, size = 128 }) => {
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    // small delay so the ring animates in after mount
    const start = setTimeout(() => setAnimated(score), 150)
    return () => clearTimeout(start)
  }, [score])

  // count-up number synced roughly with the ring sweep
  const [count, setCount] = useState(0)
  useEffect(() => {
    let cur = 0
    const id = setInterval(() => {
      cur = Math.min(cur + 2, score)
      setCount(cur)
      if (cur >= score) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [score])

  const offset = CIRCUMFERENCE * (1 - animated / 100)
  const color = ringColor(score)

  return (
    <div className='relative shrink-0' style={{ width: size, height: size }}>
      <svg className='-rotate-90' width={size} height={size} viewBox='0 0 120 120'>
        {/* track */}
        <circle
          cx='60'
          cy='60'
          r={RADIUS}
          fill='none'
          strokeWidth={STROKE}
          className='stroke-muted/20'
        />
        {/* progress */}
        <circle
          cx='60'
          cy='60'
          r={RADIUS}
          fill='none'
          strokeWidth={STROKE}
          strokeLinecap='round'
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className={`${color} stroke-current transition-[stroke-dashoffset] duration-[1200ms] ease-out`}
        />
      </svg>
      {/* center label */}
      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        <span className={`text-3xl font-bold tabular-nums leading-none ${color}`}>{count}</span>
        <span className='text-muted text-[10px] font-mono tracking-widest mt-0.5'>/ 100</span>
      </div>
    </div>
  )
}

export default ScoreRing
