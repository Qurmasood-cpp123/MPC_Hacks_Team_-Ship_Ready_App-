import { useState, useEffect, useRef } from 'react'

// fires once when the element scrolls into view (or immediately if already visible)
const useInView = () => {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, inView]
}

const SCORE_KEYS = ['readme', 'security', 'setup', 'ux', 'demo'];
const SCORE_LABELS = { readme: 'README', security: 'Security', setup: 'Setup', ux: 'UX', demo: 'Demo' };
const CARD_DELAYS = ['delay-[0ms]', 'delay-[100ms]', 'delay-[200ms]', 'delay-[300ms]', 'delay-[400ms]'];

const scoreText = (s) => (s >= 70 ? 'text-success' : s >= 40 ? 'text-warn' : 'text-danger')
const scoreDot  = (s) => (s >= 70 ? 'bg-success'  : s >= 40 ? 'bg-warn'  : 'bg-danger')

const useCounter = (target, active) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) { setCount(0); return }
    let cur = 0
    const id = setInterval(() => {
      cur = Math.min(cur + 2, target)
      setCount(cur)
      if (cur >= target) clearInterval(id)
    }, 16)
    return () => clearInterval(id)
  }, [target, active])
  return count
}

const ScoreDots = ({ score }) => (
  <div className='flex gap-0.5 mt-1.5'>
    {Array.from({ length: 10 }).map((_, i) => (
      <div
        key={i}
        className={`h-0.5 flex-1 rounded-full transition-all duration-700 ${i < Math.round(score / 10) ? scoreDot(score) : 'bg-muted/30'}`}
      />
    ))}
  </div>
)

const ScoreCard = ({ label, score, delay, visible }) => {
  const count = useCounter(score, visible)
  return (
    <div className={`bg-surface rounded-lg px-4 py-2.5 transition-all duration-500 ease-out ${delay} ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}>
      <div className='flex items-center justify-between'>
        <span className='text-muted text-xs uppercase tracking-widest'>{label}</span>
        <span className={`text-xl font-bold tabular-nums ${scoreText(score)}`}>{count}</span>
      </div>
      <ScoreDots score={score} />
    </div>
  )
}

const Results = ({ result, isVisible }) => {
  const [breakdownRef, breakdownInView] = useInView()

  if (!result) return null

  const { scores, warnings, fixes } = result

  return (
    <div className={`flex flex-col gap-4 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

      <div ref={breakdownRef} className='bg-panel border border-white/10 rounded-2xl p-6'>
        <p className='text-muted text-xs uppercase tracking-widest mb-4'>Category breakdown</p>
        <div className='flex flex-col gap-2'>
          {SCORE_KEYS.map((key, i) => (
            <ScoreCard
              key={key}
              label={SCORE_LABELS[key]}
              score={scores[key]}
              delay={CARD_DELAYS[i]}
              visible={breakdownInView}
            />
          ))}
        </div>
      </div>

      {(warnings.length > 0 || fixes.length > 0) && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-500 delay-[600ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

          {warnings.length > 0 && (
            <div className='bg-panel border border-white/10 rounded-2xl p-6'>
              <p className='text-muted text-xs uppercase tracking-widest mb-4'>Warnings</p>
              <ul className='flex flex-col gap-2'>
                {warnings.map((w, i) => (
                  <li key={i} className='flex items-start gap-3 text-sm'>
                    <span className='text-warn mt-0.5 shrink-0'>⚠</span>
                    <span className='text-ink'>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {fixes.length > 0 && (
            <div className='bg-panel border border-white/10 rounded-2xl p-6'>
              <p className='text-muted text-xs uppercase tracking-widest mb-4'>Fix Board</p>
              <ul className='flex flex-col gap-3'>
                {fixes.map((f, i) => (
                  <li key={i} className='flex items-start gap-3'>
                    <span className='text-success mt-0.5 shrink-0'>→</span>
                    <p className='text-ink text-sm'>{f}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

    </div>
  )
}

export default Results
