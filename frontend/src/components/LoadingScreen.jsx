import { useState, useEffect, useRef } from 'react'

const SLOW_NOTES = [
  'our AI is reading every line of your repo...',
  'the algorithm is judging your code so humans don\'t have to...',
  'scanning for secrets you forgot to hide...',
  'your future judges would have caught this anyway...',
  'this is the part where the magic happens...',
]

const STEPS = [
  'Connecting to GitHub API',
  'Fetching repository file tree',
  'Reading README and documentation',
  'Scanning for exposed credentials',
  'Checking setup instructions',
  'Evaluating demo readiness',
  'Analyzing documentation coverage',
  'Running security heuristics',
  'Reviewing presentation layer',
  'Calculating aggregate score',
  'Generating your 60-second pitch',
]

const LoadingScreen = ({ repoUrl }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [showSlowNote, setShowSlowNote] = useState(false)
  const slowNote = useRef(SLOW_NOTES[Math.floor(Math.random() * SLOW_NOTES.length)])

  useEffect(() => {
    const stepId = setInterval(() => {
      setActiveStep(s => Math.min(s + 1, STEPS.length - 1))
    }, 650)
    const slowId = setTimeout(() => setShowSlowNote(true), 5000)
    return () => {
      clearInterval(stepId)
      clearTimeout(slowId)
    }
  }, [])

  return (
    <div className='animate-fade-up flex flex-col items-center justify-center min-h-[70vh] px-6'>
      <div className='w-full max-w-sm'>

        {/* Repo label */}
        <p className='animate-float text-muted text-sm font-mono uppercase tracking-widest mb-2 text-center'>Analyzing</p>
        <p className='text-ink font-mono text-base mb-8 truncate text-center'>{repoUrl}</p>

        {/* Step list */}
        <div className='bg-surface/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col gap-3'>
          {STEPS.slice(0, activeStep + 1).map((step, i) => {
            const done = i < activeStep
            const current = i === activeStep
            return (
              <div key={i} className='animate-fade-up flex items-center gap-3 font-mono text-sm'>
                <span className='w-4 shrink-0 flex items-center justify-center'>
                  {done && <span className='text-success text-base'>✓</span>}
                  {current && (
                    <span className='w-3 h-3 border border-brand border-t-transparent rounded-full animate-spin inline-block' />
                  )}
                </span>
                <span className={done ? 'text-muted' : 'text-ink'}>
                  {step}
                </span>
              </div>
            )
          })}
        </div>

        {showSlowNote && (
          <p className='animate-fade-up text-ink text-sm font-mono mt-6 text-center'>
            {slowNote.current}
          </p>
        )}

      </div>
    </div>
  )
}

export default LoadingScreen
