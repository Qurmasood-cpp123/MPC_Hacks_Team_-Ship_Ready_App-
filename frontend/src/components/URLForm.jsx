import { useState } from 'react'

const URLForm = ({ onSubmit, isLoading, defaultValue = '' }) => {
  const [repoUrl, setRepoUrl] = useState(defaultValue)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!repoUrl.trim()) return
    onSubmit({ repoUrl: repoUrl.trim() })
    setRepoUrl('')
  }

  return (
    <form onSubmit={handleSubmit} className='bg-surface/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex gap-3'>
      <input
        type='url'
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder='https://github.com/your-team/your-repo'
        required
        className='flex-1 bg-transparent text-ink font-mono text-sm px-4 py-3 placeholder:text-muted/50 focus:outline-none'
      />
      <button
        type='submit'
        disabled={isLoading || !repoUrl.trim()}
        className='bg-brand hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-surface font-bold text-base rounded-xl px-8 py-4 transition-all duration-150 flex items-center gap-2 whitespace-nowrap'
      >
        {isLoading ? (
          <>
            <span className='w-4 h-4 border-2 border-surface border-t-transparent rounded-full animate-spin' />
            Analyzing...
          </>
        ) : (
          'Run Audit'
        )}
      </button>
    </form>
  )
}

export default URLForm
