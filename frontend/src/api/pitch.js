const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const postPitch = async (analysis) => {
  const res = await fetch(`${API_BASE_URL}/pitch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(analysis),
  })
  if (!res.ok) throw new Error(`/pitch failed: ${res.status}`)
  return res.text()
}
