const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const GITHUB_URL_PATTERN = /^https?:\/\/github\.com\/([^/\s]+)\/([^/\s#?]+?)(?:\.git)?(?:[/#?].*)?$/;

export const parseGitHubUrl = (url) => {
  const match = url.trim().match(GITHUB_URL_PATTERN);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
};

export const checkRepoExists = async (repoUrl) => {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) throw new Error('Invalid GitHub URL. Use https://github.com/owner/repo');

  const res = await fetch(
    `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
    { headers: { Accept: 'application/vnd.github+json' } }
  );

  if (res.status === 404)
    throw new Error(`Repository not found: github.com/${parsed.owner}/${parsed.repo}`);
  if (!res.ok)
    throw new Error('Could not reach GitHub. Check your connection and try again.');
};

export const postAnalyze = async ({ repoUrl, description = repoUrl }) => {
  const res = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repoUrl, description }),
  });
  if (!res.ok) throw new Error(`/analyze failed: ${res.status}`);
  return res.json();
};
