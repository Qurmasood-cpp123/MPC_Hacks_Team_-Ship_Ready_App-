const TEAM = [
  {
    name: 'Krish',
    role: 'Frontend / UX',
    description: 'Owns the React + Vite + Tailwind layer. Builds every screen the judges see.',
    tag: 'UI',
  },
  {
    name: 'Arley',
    role: 'Backend + Deployment',
    description: 'Owns FastAPI, the /analyze pipeline, and the Render deployment. Makes the backend actually ship.',
    tag: 'API',
  },
  {
    name: 'Masood',
    role: 'AI / Prompts',
    description: 'Owns the OpenAI pitch system prompt, the local fallback template, and the Gumloop pipeline.',
    tag: 'AI',
  },
  {
    name: 'Ben',
    role: 'Demo / QA',
    description: 'Owns the 3-minute demo script, Devpost submission, and all dry runs. The one the judges remember.',
    tag: 'QA',
  },
]

const AboutUs = ({ onBack }) => (
  <div className='animate-fade-up px-6 sm:px-12 pb-16 sm:pb-20 max-w-3xl mx-auto'>

    <button
      onClick={onBack}
      className='flex items-center gap-2 text-muted text-sm hover:text-ink transition-colors duration-150 mb-10 mt-6'
    >
      ← Back
    </button>

    <div className='mb-10'>
      <p className='text-brand font-mono text-xs uppercase tracking-widest mb-3'>Built at MPC Hacks 2026</p>
      <h2 className='text-3xl sm:text-4xl font-bold text-ink leading-tight mb-4'>
        Four people. One night.<br />Zero excuses.
      </h2>
      <p className='text-muted text-sm sm:text-base leading-relaxed max-w-xl'>
        ShipReady was built at Polytechnique Montréal during MPC Hacks 2026.
        The goal: give every hackathon team a pre-flight checklist before they face the judges.
        Vibe coders ship fast — we help them ship clean.
      </p>
    </div>

    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10'>
      {TEAM.map(({ name, role, description, tag }) => (
        <div
          key={name}
          className='flex flex-col gap-3 bg-surface/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-brand/30 transition-colors duration-200'
        >
          <div className='flex items-center justify-between'>
            <span className='text-ink font-semibold'>{name}</span>
            <span className='text-brand font-mono text-xs tracking-widest bg-brand/10 px-2 py-0.5 rounded-full'>
              {tag}
            </span>
          </div>
          <p className='text-brand text-xs font-mono uppercase tracking-widest'>{role}</p>
          <p className='text-muted text-sm leading-relaxed'>{description}</p>
        </div>
      ))}
    </div>

    <div className='border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
      <div>
        <p className='text-ink font-semibold text-sm mb-1'>Prize targets</p>
        <p className='text-muted text-xs leading-relaxed'>Overall · Gumloop sponsor · Nord Security cluster</p>
      </div>
      <div className='flex items-center gap-2 shrink-0'>
        <span className='w-2 h-2 rounded-full bg-success animate-pulse' />
        <span className='text-success text-xs font-mono'>Live at MPC Hacks 2026</span>
      </div>
    </div>

  </div>
)

export default AboutUs
