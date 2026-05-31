import { useState } from 'react'
import TypingTerminal from '../components/TypingTerminal'
import URLForm from '../components/URLForm'
import Results from '../components/Results'
import PitchDescription from '../components/PitchDescription'
import LoadingScreen from '../components/LoadingScreen'
import AboutUs from '../components/AboutUs'
import { postAnalyze } from '../api/analyze'

const TERMINAL_LINES = [
  { text: '$ shipready analyze github.com/hackteam/project-x', color: 'text-success' },
  { text: '', color: 'text-muted' },
  { text: '→ connecting to github api...', color: 'text-muted' },
  { text: '→ fetching repository file tree...', color: 'text-muted' },
  { text: '→ 47 files found across 9 directories', color: 'text-muted' },
  { text: '', color: 'text-muted' },
  { text: '[1/5] documentation check', color: 'text-ink' },
  { text: '  ✗  README.md not found', color: 'text-danger' },
  { text: '  ✗  no project description in repo metadata', color: 'text-danger' },
  { text: '  ✗  no usage examples or screenshots', color: 'text-danger' },
  { text: '  score: 0 / 20', color: 'text-danger' },
  { text: '', color: 'text-muted' },
  { text: '[2/5] security scan', color: 'text-ink' },
  { text: '  ✗  .env committed to main branch', color: 'text-danger' },
  { text: '  ✗  api key found in src/config.js line 14', color: 'text-danger' },
  { text: '  ⚠  hardcoded localhost URLs in 3 files', color: 'text-warn' },
  { text: '  ⚠  no .env.example provided', color: 'text-warn' },
  { text: '  score: 4 / 20', color: 'text-danger' },
  { text: '', color: 'text-muted' },
  { text: '[3/5] setup instructions', color: 'text-ink' },
  { text: '  ✗  no install steps found in any file', color: 'text-danger' },
  { text: '  ✗  missing start script in package.json', color: 'text-danger' },
  { text: '  ✓  node version specified in .nvmrc', color: 'text-success' },
  { text: '  score: 5 / 20', color: 'text-danger' },
  { text: '', color: 'text-muted' },
  { text: '[4/5] demo readiness', color: 'text-ink' },
  { text: '  ✗  demo link in README returns 404', color: 'text-danger' },
  { text: '  ✗  no video walkthrough or GIF', color: 'text-danger' },
  { text: '  ✓  vercel deployment detected', color: 'text-success' },
  { text: '  score: 7 / 20', color: 'text-warn' },
  { text: '', color: 'text-muted' },
  { text: '[5/5] presentation layer', color: 'text-ink' },
  { text: '  ✓  MIT license present', color: 'text-success' },
  { text: '  ⚠  no team members listed', color: 'text-warn' },
  { text: '  ✗  no logo, banner, or project icon', color: 'text-danger' },
  { text: '  score: 8 / 20', color: 'text-warn' },
  { text: '', color: 'text-muted' },
  { text: '──────────────────────────────────────', color: 'text-muted' },
  { text: 'final score: 24 / 100', color: 'text-danger' },
  { text: '✗  NOT READY FOR JUDGES', color: 'text-danger' },
  { text: '7 critical issues   3 warnings   3 passed', color: 'text-muted' },
]

const FEATURES = [
  {
    step: '01',
    title: 'Scan your repo',
    body: 'Paste a GitHub link and ShipReady fetches your project tree, scanning every file for missing README sections, exposed API keys, and weak setup instructions.',
  },
  {
    step: '02',
    title: 'See what\'s missing',
    body: 'Get a full breakdown of what judges will notice: documentation gaps, security issues, broken setup steps, and demo readiness. All flagged before you present.',
  },
  {
    step: '03',
    title: 'Get a judge-ready pitch',
    body: 'Generate a 60-second pitch using OpenAI, streamed live character by character. Built for the AI-assisted era. Vibe coders ship fast, we help them ship clean.',
  },
]


const MOCK_PITCH = 'ShipReady audited your repository and here is your 60-second pitch. You have built a tool that solves a real problem for thousands of hackathon participants every year. ShipReady scans your GitHub repo in seconds, flags missing README sections, exposed API keys, and broken setup steps, then generates a judge-ready pitch using OpenAI. Your security posture is strong and your UX scores are solid. To reach top marks, add a .env.example file, expand your setup instructions, and record a short demo video. Built for the AI-assisted era. Vibe coders ship fast, we help them ship clean.'

const LandingPage = () => {
  const [view, setView] = useState('landing')
  const [isExiting, setIsExiting] = useState(false)
  const [submittedUrl, setSubmittedUrl] = useState('')
  const [result, setResult] = useState(null)
  const [pitch, setPitch] = useState(null)

  const transitionTo = (nextView, onSwitch) => {
    setIsExiting(true)
    setTimeout(() => {
      if (onSwitch) onSwitch()
      setView(nextView)
      setIsExiting(false)
    }, 350)
  }

  const handleSubmit = async ({ repoUrl }) => {
    setSubmittedUrl(repoUrl)
    transitionTo('loading', () => {})

    // Run API call and 10s minimum timer in parallel — whichever takes longer wins
    const [data] = await Promise.all([
      postAnalyze({ repoUrl }).catch(() => null),
      new Promise(resolve => setTimeout(resolve, 10000)),
    ])

    if (!data) {
      transitionTo('error', () => {})
      return
    }

    setResult(data)
    setPitch(MOCK_PITCH)
    transitionTo('results', () => window.scrollTo({ top: 0, behavior: 'smooth' }))
  }

  const handleError = () => transitionTo('error', () => {})

  const handleReset = () => {
    transitionTo('landing', () => {
      setResult(null)
      setPitch(null)
      setSubmittedUrl('')
    })
  }

  return (
    <div className='min-h-screen bg-surface text-ink font-display flex flex-col'>

      {/* Nav — always visible */}
      <nav className='animate-fade-up flex items-center justify-between px-6 sm:px-16 py-4 sm:py-6 w-full shrink-0'>
        <a href='/' className='text-brand font-bold text-xl sm:text-2xl tracking-tight hover:opacity-80 transition-opacity duration-150'>
          ShipReady
        </a>
        <div className='flex items-center gap-6 sm:gap-8'>
          <button
            onClick={() => transitionTo('about')}
            className='text-muted text-sm sm:text-base hover:text-ink transition-colors duration-150'
          >
            About us
          </button>
          <div className='hidden sm:flex items-center gap-2 text-base select-none'>
            <span className='text-ink'>EN</span>
            <span className='text-muted/40'>/</span>
            <span className='text-muted/40 cursor-default'>FR</span>
          </div>
        </div>
      </nav>

      {/* Main area — terminal always runs behind all views */}
      <div className='relative flex-1'>

        {/* Terminal background — hidden on results view */}
        <div className={`absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-500 ${view === 'results' ? 'opacity-[0.06]' : 'opacity-[0.2]'}`}>
          <TypingTerminal lines={TERMINAL_LINES} speed={13} loop />
        </div>
        <div className={`absolute bottom-0 inset-x-0 h-48 bg-gradient-to-b from-transparent to-surface pointer-events-none z-[1] transition-opacity duration-500 ${view === 'results' ? 'opacity-0' : 'opacity-100'}`} />

        {/* View container — crossfades between landing / loading / results */}
        <div className={`relative z-10 transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>

          {/* ── LANDING VIEW ── */}
          {view === 'landing' && (
            <section className='px-6 sm:px-12 pb-20 sm:pb-32 max-w-7xl mx-auto'>

              {/* Headline */}
              <div className='animate-fade-up [animation-delay:200ms] absolute top-8 sm:top-16 inset-x-0 text-center px-6 sm:px-12'>
                <h1 className='animate-glow-settle [animation-delay:400ms] text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink mb-4 sm:mb-5 leading-tight'>
                  ShipReady
                </h1>
                <p className='text-muted text-base sm:text-lg max-w-xl mx-auto leading-relaxed'>
                  The pre-flight checklist every hackathon team needs the night before judging.
                </p>
              </div>

              {/* Feature cards + form */}
              <div className='animate-slide-up [animation-delay:100ms] pt-48 sm:pt-72'>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6'>
                  {FEATURES.map(({ step, title, body }) => (
                    <div key={step} className='flex flex-col gap-3 bg-surface/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-brand/40 hover:bg-surface/60 transition-all duration-200 cursor-default'>
                      <span className='text-brand font-mono text-base tracking-widest'>{step}</span>
                      <h3 className='text-ink font-semibold'>{title}</h3>
                      <p className='text-muted text-sm leading-relaxed'>{body}</p>
                    </div>
                  ))}
                </div>
                <URLForm onSubmit={handleSubmit} isLoading={false} />

                {/* Demo repo pills */}
                <div className='mt-4 flex items-center justify-center gap-3 flex-wrap'>
                  <span className='text-ink text-sm font-mono'>or try our demo:</span>
                  <button
                    onClick={() => handleSubmit({ repoUrl: 'https://github.com/tkisason/vulnapi' })}
                    className='text-sm font-mono text-danger border border-danger/30 rounded-lg px-4 py-1.5 hover:bg-danger/10 hover:border-danger/50 transition-all duration-150'
                  >
                    bad repo
                  </button>
                  <button
                    onClick={() => handleSubmit({ repoUrl: 'https://github.com/openai/openai-quickstart-python' })}
                    className='text-sm font-mono text-success border border-success/30 rounded-lg px-4 py-1.5 hover:bg-success/10 hover:border-success/50 transition-all duration-150'
                  >
                    good repo
                  </button>
                </div>
              </div>

            </section>
          )}

          {/* ── ABOUT VIEW ── */}
          {view === 'about' && (
            <AboutUs onBack={() => transitionTo('landing')} />
          )}

          {/* ── LOADING VIEW ── */}
          {view === 'loading' && (
            <LoadingScreen repoUrl={submittedUrl} />
          )}

          {/* ── RESULTS VIEW ── */}
          {view === 'results' && result && (
            <div className='animate-fade-up px-6 sm:px-12 pb-16 sm:pb-20 max-w-3xl mx-auto'>

              <button
                onClick={handleReset}
                className='flex items-center gap-2 text-muted text-sm hover:text-ink transition-colors duration-150 mb-6 mt-6'
              >
                ← Analyze another repo
              </button>

              {/* Big verdict banner */}
              <div className={`rounded-2xl p-5 sm:p-6 mb-6 flex items-center gap-4 sm:gap-5 border ${result.readyForJudges ? 'bg-success/10 border-success/25' : 'bg-danger/10 border-danger/25'}`}>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${result.readyForJudges ? 'bg-success/20' : 'bg-danger/20'}`}>
                  <span className={`text-xl font-bold ${result.readyForJudges ? 'text-success' : 'text-danger'}`}>
                    {result.readyForJudges ? '✓' : '✗'}
                  </span>
                </div>
                <div className='flex-1 min-w-0'>
                  <p className={`text-xl sm:text-2xl font-bold leading-tight ${result.readyForJudges ? 'text-success' : 'text-danger'}`}>
                    {result.readyForJudges ? 'Ready for Judges' : 'Not Ready for Judges'}
                  </p>
                  <p className='text-muted text-xs sm:text-sm mt-1 truncate'>
                    Score {result.aggregateScore} / 100 · {submittedUrl}
                  </p>
                </div>
                {result.readyForJudges && (
                  <span className='w-3 h-3 rounded-full bg-success animate-pulse shrink-0' />
                )}
              </div>

              <PitchDescription pitchText={pitch} isStreaming={false} onDone={() => {}} />

              <div className='mt-6'>
                <Results result={result} isVisible={true} />
              </div>

            </div>
          )}

          {/* ── ERROR VIEW ── */}
          {view === 'error' && (
            <div className='animate-fade-up flex flex-col items-center justify-center min-h-[70vh] gap-6 px-6 text-center'>
              <div className='w-16 h-16 rounded-lg bg-danger/10 border border-danger/25 flex items-center justify-center'>
                <span className='text-danger text-2xl font-bold'>✗</span>
              </div>
              <div>
                <p className='text-ink text-lg font-semibold mb-2'>Something went wrong</p>
                <p className='text-muted text-sm max-w-sm leading-relaxed'>
                  We couldn't analyze that repository. Make sure the URL is a valid public GitHub repo and try again.
                </p>
              </div>
              <button
                onClick={handleReset}
                className='bg-brand text-surface font-semibold text-sm rounded-lg px-6 py-3 hover:brightness-110 transition-all duration-150'
              >
                Try again
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}

export default LandingPage
