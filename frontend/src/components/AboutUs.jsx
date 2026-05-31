const TEAM = [
  {
    name: 'Thanh Hai (Ben)',
    role: 'UI / UX Design',
    description: 'Designed the full product experience from scratch. Dark terminal aesthetic, animated landing page, glass card system, and a 3-view demo flow that makes the product feel real the moment judges see it.',
    tag: 'UI',
  },
  {
    name: 'Nelson',
    role: 'Frontend + Integration',
    description: 'Built the results page and About Us page, then connected all the frontend routes to the backend so the full product actually works together.',
    tag: 'FE',
  },
  {
    name: 'Arley',
    role: 'Backend + Deployment',
    description: 'Built the FastAPI scoring pipeline and got everything live on Render. The reason the product works when you hit Get Score.',
    tag: 'API',
  },
  {
    name: 'Masood',
    role: 'AI / Prompts',
    description: 'Crafted the OpenAI pitch prompt and the local fallback template. The reason the 60-second pitch actually sounds good.',
    tag: 'AI',
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

    <div className='flex items-center gap-2'>
      <span className='w-2 h-2 rounded-full bg-success animate-pulse' />
      <span className='text-success text-xs font-mono'>Live at MPC Hacks 2026</span>
    </div>

  </div>
)

export default AboutUs
