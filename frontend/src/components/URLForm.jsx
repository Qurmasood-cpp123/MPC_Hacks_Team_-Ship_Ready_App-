import { useState } from 'react';

const URLForm = ({ onSubmit, isLoading }) => {
  const [repoUrl, setRepoUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    onSubmit({ repoUrl: repoUrl.trim() });
    setRepoUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className='bg-gray-900 rounded-xl p-6 flex gap-3'>
      <input
        type='url'
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder='https://github.com/your-team/your-repo'
        required
        className='flex-1 bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-green-400 transition-colors'
      />
      <button
        type='submit'
        disabled={isLoading || !repoUrl.trim()}
        className='bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg px-6 py-3 transition-colors flex items-center gap-2 whitespace-nowrap'
      >
        {isLoading ? (
          <>
            <span className='w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin' />
            Analyzing…
          </>
        ) : (
          'Get Score →'
        )}
      </button>
    </form>
  );
};

export default URLForm;
