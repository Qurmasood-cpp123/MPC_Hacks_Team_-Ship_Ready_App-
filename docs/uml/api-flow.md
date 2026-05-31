# ShipReady API Flow

This document explains the main API flows used by ShipReady.

---

## `/analyze` flow

```txt
User submits repoUrl + description
  |
  v
Frontend sends POST /analyze
  |
  v
FastAPI validates request body
  |
  v
githubService fetches repository signals
  |
  v
readmeCheck analyzes README
securityCheck checks obvious risk signals
scoringService calculates scores
  |
  v
Backend returns analysis JSON
```

---

## `/pitch` flow

```txt
Frontend receives /analyze result
  |
  v
Frontend sends full analysis JSON to POST /pitch
  |
  v
pitchService checks OPENAI_API_KEY
  |
  +--> If key exists:
  |       call OpenAI GPT-4o
  |       stream generated pitch text
  |
  +--> If key missing or OpenAI fails:
          stream local fallback pitch
```

---

## Gumloop flow

```txt
Gumloop Input Node
  |
  | repoUrl
  | description
  v
Gumloop HTTP Request Node
  |
  | POST https://mpc-hacks-team-ship-ready-app.onrender.com/analyze
  v
ShipReady Backend
  |
  v
Gumloop Output Node
  |
  v
Full analysis JSON
```

---

## `/analyze` request shape

```json
{
  "repoUrl": "https://github.com/owner/repo",
  "description": "Short project description",
  "fileTree": "optional pasted file tree"
}
```

---

## `/analyze` response shape

```json
{
  "scores": {
    "readme": 100,
    "security": 100,
    "setup": 100,
    "ux": 85,
    "demo": 80
  },
  "aggregateScore": 93,
  "readiness": "almost",
  "readyForJudges": false,
  "warnings": [
    "README.md is missing an Installation section."
  ],
  "fixes": [
    "Add an Installation section with exact setup commands."
  ],
  "signals": {
    "projectDescription": "A clean Python quickstart repo with clear setup instructions.",
    "repo": {
      "owner": "openai",
      "name": "openai-quickstart-python",
      "branch": "master"
    },
    "fileTreeProvided": false,
    "readme": {},
    "security": {}
  }
}
```

---

## `/pitch` request shape

The `/pitch` endpoint receives the full `/analyze` response.

```json
{
  "scores": {
    "readme": 100,
    "security": 100,
    "setup": 100,
    "ux": 85,
    "demo": 80
  },
  "aggregateScore": 93,
  "readiness": "almost",
  "readyForJudges": false,
  "warnings": [
    "README.md is missing an Installation section."
  ],
  "fixes": [
    "Add an Installation section with exact setup commands."
  ],
  "signals": {
    "projectDescription": "A clean Python quickstart repo with clear setup instructions.",
    "repo": {
      "owner": "openai",
      "name": "openai-quickstart-python",
      "branch": "master"
    }
  }
}
```

---

## Readiness logic

| Readiness | Meaning |
|---|---|
| `ready` | Strong score and no warnings |
| `almost` | Strong score with minor warnings, or moderate score with no warnings |
| `not_ready` | Low score or meaningful blockers |

---

## API safety notes

- `/analyze` does not require OpenAI.
- `/pitch` can use OpenAI, but has a fallback path.
- The frontend should not store API keys.
- Secrets must stay in backend environment variables.
