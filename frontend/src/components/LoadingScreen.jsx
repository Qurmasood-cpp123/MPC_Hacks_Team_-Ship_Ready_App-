import { useState, useEffect } from 'react'

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

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep(s => Math.min(s + 1, STEPS.length - 1))
    }, 650)
    return () => clearInterval(id)
  }, [])

  return (
    <div className='animate-fade-up flex flex-col items-center justify-center min-h-[70vh] px-6'>
      <div className='w-full max-w-sm'>

        {/* Repo label */}
        <p className='text-muted text-sm font-mono uppercase tracking-widest mb-2 text-center'>Analyzing</p>
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

      </div>
    </div>
  )
}

export default LoadingScreen
