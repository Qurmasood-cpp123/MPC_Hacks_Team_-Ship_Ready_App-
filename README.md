# ShipReady

![Built at MPC Hacks 2026](https://img.shields.io/badge/Built%20at-MPC%20Hacks%202026-blue)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)
![AI](https://img.shields.io/badge/AI-OpenAI%20GPT--4o-412991)
![Automation](https://img.shields.io/badge/Automation-Gumloop-orange)

**ShipReady** helps hackathon teams check whether their GitHub repository is ready before presenting to judges.

Teams paste a GitHub repository URL and a short project description. ShipReady analyzes the repository, returns readiness scores, shows warnings and fixes, and generates a judge-ready pitch.

Built at **MPC Hacks 2026**, ShipReady is designed for the AI-assisted development era, where teams can build fast but still risk shipping unclear documentation, weak setup instructions, missing demo polish, or an unfocused pitch.

---

## Live MVP

- **Frontend:** https://mpc-hacks-team-ship-ready-app.vercel.app
- **Backend:** https://mpc-hacks-team-ship-ready-app.onrender.com
- **Health check:** https://mpc-hacks-team-ship-ready-app.onrender.com/health
- **Repository:** https://github.com/Qurmasood-cpp123/MPC_Hacks_Team_-Ship_Ready_App-
- **Gumloop workflow:** https://www.gumloop.com/pipeline?workbook_id=q2KD4LxiK1iJ4hNxJFipZf

---

## What ShipReady does

ShipReady follows a simple flow:

1. The user enters a GitHub repository URL.
2. The user adds a short project description.
3. ShipReady fetches public repository signals from GitHub.
4. ShipReady scores the project across five categories.
5. The dashboard displays warnings, fixes, and a readiness verdict.
6. The pitch generator turns the analysis into a 60-second demo pitch.
7. Gumloop can run the same repository audit as an automation workflow.

---

## Core features

- GitHub repository readiness audit
- README quality scoring
- Security hygiene checks
- Setup readiness checks
- UX clarity scoring
- Demo readiness scoring
- Three-state readiness verdict:
  - `ready`
  - `almost`
  - `not_ready`
- OpenAI-powered pitch generation
- Local fallback pitch generator if OpenAI is unavailable
- Gumloop workflow wrapper
- Render-hosted FastAPI backend
- Vercel-hosted React frontend

---

## Tech stack

### Frontend

- React
- Vite
- Tailwind CSS

### Backend

- Python
- FastAPI
- Uvicorn
- httpx
- OpenAI Python SDK

### AI and automation

- OpenAI GPT-4o for pitch generation
- Gumloop for workflow automation

### Deployment

- Vercel for the frontend
- Render for the backend

---

## Project structure

```txt
MPC_Hacks_Team_-Ship_Ready_App-/
├── backend/
│   ├── main.py
│   ├── routes/
│   │   ├── analyze.py
│   │   └── pitch.py
│   └── services/
│       ├── githubService.py
│       ├── readmeCheck.py
│       ├── scoringService.py
│       ├── securityCheck.py
│       ├── pitchPrompt.py
│       └── pitchService.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── uml/
│   │   ├── architecture.md
│   │   └── api-flow.md
│   └── tools/
│       ├── installation-tools.md
│       └── environment-variables.md
├── requirements.txt
└── README.md
```

---

## Installation

### Prerequisites

Install these tools before running ShipReady locally:

- Git
- Python 3.11 or newer
- Node.js 18 or newer
- npm
- A GitHub account for testing public repositories
- Optional: OpenAI API key for GPT pitch generation

---

### 1. Clone the repository

```bash
git clone https://github.com/Qurmasood-cpp123/MPC_Hacks_Team_-Ship_Ready_App-.git
cd MPC_Hacks_Team_-Ship_Ready_App-
```

---

### 2. Backend setup

Create and activate a Python virtual environment.

#### Windows PowerShell

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

#### macOS/Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Run the backend:

```bash
python -m uvicorn backend.main:app --reload
```

The backend should start at:

```txt
http://127.0.0.1:8000
```

Health check:

```txt
http://127.0.0.1:8000/health
```

Swagger docs:

```txt
http://127.0.0.1:8000/docs
```

---

### 3. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend should start at:

```txt
http://localhost:5173
```

Create `frontend/.env` if needed:

```txt
VITE_API_BASE_URL=http://localhost:8000
```

---

## Usage

### Use the web app

1. Open the frontend.
2. Paste a GitHub repository URL.
3. Enter a short project description.
4. Click the analyze button.
5. Review the scorecards, warnings, fixes, and readiness verdict.
6. Generate a pitch from the analysis.

Example repository URL:

```txt
https://github.com/openai/openai-quickstart-python
```

Example description:

```txt
A clean Python quickstart repo with clear setup instructions.
```

---

## API reference

### `GET /health`

Returns service status.

Example response:

```json
{
  "status": "ok",
  "service": "ShipReady API"
}
```

---

### `POST /analyze`

Analyzes a GitHub repository.

Request body:

```json
{
  "repoUrl": "https://github.com/owner/repo",
  "description": "Short project description",
  "fileTree": "optional pasted file tree"
}
```

Example request:

```bash
curl -X POST http://127.0.0.1:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repoUrl": "https://github.com/openai/openai-quickstart-python",
    "description": "A clean Python quickstart repo with clear setup instructions."
  }'
```

Example response shape:

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
  "warnings": [],
  "fixes": [],
  "signals": {}
}
```

---

### `POST /pitch`

Generates a 60-second pitch from the full `/analyze` response.

Request body:

```txt
The full /analyze response JSON.
```

Response:

```txt
Streaming pitch text.
```

If `OPENAI_API_KEY` is available, ShipReady uses OpenAI. If the key is missing or the OpenAI call fails, ShipReady uses a local fallback pitch template.

---

## Readiness verdict

ShipReady returns a three-state readiness verdict.

| Verdict | Meaning |
|---|---|
| `ready` | Strong score and no warnings |
| `almost` | Strong score with minor warnings, or moderate score with no warnings |
| `not_ready` | Low score or meaningful blockers |

The older `readyForJudges` boolean is kept for compatibility with earlier frontend code.

---

## Gumloop workflow

ShipReady includes a Gumloop workflow wrapper for the repository readiness audit.

Workflow:

```txt
Input repoUrl + description
→ POST to ShipReady /analyze
→ return the full analysis JSON
```

This allows the same readiness audit to run as an automation pipeline, not only from the web UI.

---

## Security notes

- Do not commit `.env` files.
- Do not hardcode API keys.
- Do not expose API keys in frontend code.
- Store secrets in local `.env` files or deployment environment variables.
- Use `.env.example` to document required variable names without exposing values.
- The security score is a lightweight heuristic check, not a full vulnerability scanner.
- ShipReady looks for obvious risk signals such as committed `.env` files or exposed key-like patterns.

---

## Deployment

### Backend on Render

Recommended Render settings:

```txt
Build Command:
pip install -r requirements.txt
```

```txt
Start Command:
python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

Environment variables:

```txt
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o
ALLOWED_ORIGINS=http://localhost:5173,https://mpc-hacks-team-ship-ready-nzw9szxw3-the-asians.vercel.app
```

---

### Frontend on Vercel

The team decided to deploy the frontend on **Vercel**.

Because this repository is a monorepo with `backend/` and `frontend/`, configure Vercel to deploy only the frontend folder.

Recommended Vercel settings:

```txt
Framework Preset:
Vite
```

```txt
Root Directory:
frontend
```

```txt
Build Command:
npm run build
```

```txt
Output Directory:
dist
```

Set the frontend environment variable in Vercel:

```txt
VITE_API_BASE_URL=https://mpc-hacks-team-ship-ready-app.onrender.com
```

After saving environment variables, redeploy the frontend so the deployed build receives the updated value.

---

## Documentation

Additional documentation is stored in:

```txt
docs/uml/
docs/tools/
```

Suggested reading:

- `docs/uml/architecture.md`
- `docs/uml/api-flow.md`
- `docs/tools/installation-tools.md`
- `docs/tools/environment-variables.md`

---

## Team

- **Yimoun** - Frontend and UX
- **Arley** - Backend, Render deployment, API integration
- **Masood** - AI prompts, Gumloop workflow, sample repositories
- **Ben** - Demo, QA, Devpost, README, presentation flow

---

## Status

ShipReady was built during MPC Hacks 2026 as a hackathon MVP. It is designed as a practical demo-readiness assistant for teams preparing to present under time pressure.
