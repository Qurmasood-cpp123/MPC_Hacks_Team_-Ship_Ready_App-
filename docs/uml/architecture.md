# ShipReady Architecture

ShipReady is a hackathon readiness assistant that connects a React frontend, a FastAPI backend, GitHub repository analysis, OpenAI pitch generation, and Gumloop automation.

---

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
  | Fetch public repo metadata, README, file tree, and code samples
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
```

---

## Main components

### User

The user enters a GitHub repository URL and a short project description.

### Vercel frontend

The frontend is built with React, Vite, and Tailwind CSS.

It lets the user:

- enter repo information
- view readiness scores
- read warnings and fixes
- generate a pitch
- copy or rehearse the pitch

### Render backend

The backend is built with FastAPI and deployed on Render.

It exposes:

- `GET /health`
- `POST /analyze`
- `POST /pitch`

### GitHub repository analysis

The backend fetches public repository signals from GitHub, including:

- repository owner
- repository name
- default branch
- README content
- file tree
- selected code samples

### Scoring services

ShipReady scores five categories:

- README
- Security
- Setup
- UX
- Demo

These scores are combined into an aggregate score and a three-state readiness verdict:

- `ready`
- `almost`
- `not_ready`

### Pitch service

The pitch service uses OpenAI GPT-4o when `OPENAI_API_KEY` is available.

If OpenAI is unavailable, ShipReady falls back to a local pitch template so the demo still works.

### Gumloop workflow

The Gumloop workflow wraps the `/analyze` endpoint.

This allows ShipReady to run as an automation pipeline:

```txt
Input repoUrl + description
→ Call /analyze
→ Return readiness JSON
```

---

## Deployment architecture

```txt
Vercel
  |
  | hosts frontend
  v
React + Vite UI
  |
  | calls backend API
  v
Render
  |
  | hosts FastAPI backend
  v
GitHub + OpenAI + Gumloop
```

---

## Design principle

ShipReady is designed to be useful even when external AI services fail.

The core repository analysis works without OpenAI. The pitch generator uses OpenAI when available, but fallback pitch generation keeps the MVP demo-safe.
