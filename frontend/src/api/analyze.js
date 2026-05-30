const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const postAnalyze = async ({ repoUrl, description = repoUrl }) => {
  const res = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repoUrl, description }),
  });
  if (!res.ok) throw new Error(`/analyze failed: ${res.status}`);
  return res.json();
};
