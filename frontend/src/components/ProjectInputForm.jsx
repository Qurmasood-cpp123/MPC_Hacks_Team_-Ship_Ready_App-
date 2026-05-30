import { useState } from 'react'

const ProjectInputForm = ({ onSubmit }) => {
  const [repoUrl, setRepoUrl] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ repoUrl: repoUrl.trim(), description: description.trim() })
  }

  const canSubmit = repoUrl.trim().length > 0

  return (
    <div className="bg-panel/90 backdrop-blur-md border border-muted/20 rounded-2xl p-8 w-full max-w-xl mx-auto shadow-2xl shadow-black/60">

      <h2 className="text-ink text-xl font-semibold mb-1">
        Audit your repo
      </h2>
      <p className="text-muted text-sm mb-6">
        Paste a GitHub link and describe your project. We handle the rest.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Repo URL */}
        <div className="flex flex-col gap-1.5">
          <label className="text-muted text-xs uppercase tracking-widest">
            GitHub repo URL
          </label>
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/your-team/your-repo"
            className="
              bg-surface border border-muted/30 rounded-lg
              px-4 py-3 font-mono text-sm text-ink
              placeholder:text-muted/50
              focus:outline-none focus:border-brand
              transition-colors duration-150
            "
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-muted text-xs uppercase tracking-widest">
            Project description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does your project do? Who is it for?"
            rows={3}
            className="
              bg-surface border border-muted/30 rounded-lg
              px-4 py-3 text-sm text-ink resize-none
              placeholder:text-muted/50
              focus:outline-none focus:border-brand
              transition-colors duration-150
            "
          />
        </div>

        {/* Submit */}
        <button
          type='submit'
          disabled={!canSubmit}
          className={`
            mt-1 py-3 rounded-lg font-semibold text-sm tracking-wide
            transition-all duration-150
            ${canSubmit
              ? 'bg-brand text-surface hover:brightness-110 cursor-pointer'
              : 'bg-muted/20 text-muted/50 cursor-not-allowed'
            }
          `}
        >
          Analyze →
        </button>

      </form>
    </div>
  )
}

export default ProjectInputForm
