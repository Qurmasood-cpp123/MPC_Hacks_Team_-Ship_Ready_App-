# ShipReady Architecture

ShipReady is a hackathon readiness assistant that connects a React frontend, a FastAPI backend, GitHub repository analysis, OpenAI pitch generation, and Gumloop automation.

## High-level architecture

```txt
User
  |
  v
Vercel Frontend
  |
  | POST /analyze
  v
Render FastAPI Backend
  |
  | Fetch repo metadata, README, file tree, and code samples
  v
GitHub Public Repository
  |
  v
Scoring Services
  |
  | README score
  | Security score
  | Setup score
  | UX score
  | Demo score
  v
/analyze JSON Response
  |
  | POST /pitch
  v
OpenAI GPT-4o Pitch Generator
  |
  v
Judge-ready pitch text