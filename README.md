# MPC_Hacks_Team_-Ship_Ready_App-
This is the MPC Hack Team 
# ShipReady

![Built at MPC Hacks 2026](https://img.shields.io/badge/Built%20at-MPC%20Hacks%202026-blue)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)
![AI](https://img.shields.io/badge/AI-OpenAI%20GPT--4o-412991)
![Automation](https://img.shields.io/badge/Automation-Gumloop-orange)
![License](https://img.shields.io/badge/License-MIT-green)

**ShipReady** helps hackathon teams check whether their GitHub repo is ready before they present to judges. Teams paste a GitHub repository URL and a short project description, then ShipReady returns readiness scores, warnings, fixes, and a judge-ready pitch.

Built at **MPC Hacks 2026**, ShipReady is designed for the AI-assisted development era: teams move fast, but rushed projects often miss setup instructions, security hygiene, demo polish, or a clear pitch. ShipReady turns those last-minute risks into a focused action plan.

---

## Live MVP

* **Frontend:** [https://mpc-hacks-team-ship-ready-nzw9szxw3-the-asians.vercel.app](https://mpc-hacks-team-ship-ready-nzw9szxw3-the-asians.vercel.app)
* **Backend:** [https://mpc-hacks-team-ship-ready-app.onrender.com](https://mpc-hacks-team-ship-ready-app.onrender.com)
* **Health check:** [https://mpc-hacks-team-ship-ready-app.onrender.com/health](https://mpc-hacks-team-ship-ready-app.onrender.com/health)
* **Repository:** [https://github.com/Qurmasood-cpp123/MPC_Hacks_Team_-Ship_Ready_App-](https://github.com/Qurmasood-cpp123/MPC_Hacks_Team_-Ship_Ready_App-)
* **Gumloop workflow:** [https://www.gumloop.com/pipeline?workbook_id=q2KD4LxiK1iJ4hNxJFipZf](https://www.gumloop.com/pipeline?workbook_id=q2KD4LxiK1iJ4hNxJFipZf)

---

## What ShipReady does

ShipReady follows a simple flow:

1. Paste a GitHub repository URL.
2. Add a short project description.
3. ShipReady analyzes the repo for readiness signals.
4. The dashboard displays five scorecards:

   * README quality
   * Security hygiene
   * Setup readiness
   * UX clarity
   * Demo readiness
5. ShipReady returns warnings and fixes.
6. The pitch generator turns the analysis into a 60-second demo pitch.
7. Gumloop can run the same repo-readiness audit as an automation workflow.

---

## Features

* **GitHub repo audit** using lightweight heuristic checks.
* **README scoring** based on presence, length, and missing sections.
* **Security hygiene checks** for obvious risky patterns such as committed `.env` files or exposed key-like strings.
* **Setup readiness checks** for dependency manifests and copy-pasteable setup commands.
* **UX and demo readiness scoring** based on visible frontend/demo signals.
* **Three-state readiness verdict**:

  * `ready`
  * `almost`
  * `not_ready`
* **OpenAI-powered pitch generation** using GPT-4o when an API key is available.
* **Local fallback pitch generator** so the demo still works if OpenAI is unavailable.
* **Gumloop workflow integration** for sponsor-friendly automation.
* **Render-hosted FastAPI backend** and Vite frontend.

---

## Tech stack

### Frontend

* React
* Vite
* Tailwind CSS

### Backend

* FastAPI
* Python
* httpx
* OpenAI Python SDK

### AI and automation

* OpenAI GPT-4o for pitch generation
* Gumloop workflow wrapper for repo-readiness automation

### Deployment

* Render for the backend
* Vercel or local Vite dev server for the frontend

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
│   └── tools/
├── requirements.txt
└── README.md
```

The `docs/` folder is reserved for diagrams and setup references:

* `docs/uml/` for UML diagrams and architecture sketches.
* `docs/tools/` for tool installation notes and environment setup references.

---

## Installation

### Prerequisites

Install these tools before running ShipReady locally:

* Git
* Python 3.11 or newer
* Node.js 18 or newer
* npm
* A GitHub account for testing public repositories
* Optional: OpenAI API key for GPT pitch generation

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

Create a backend environment file if needed:

```bash
cp .env.example .env
```

If `.env.example` does not exist yet, create one with variable names only:

```txt
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o
ALLOWED_ORIGINS=http://localhost:5173
```

Never commit real API keys.

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

Create a frontend `.env` file if needed:

```txt
VITE_API_BASE_URL=http://localhost:8000
```

---

## Usage

### Run a repository analysis

From the UI:

1. Open the frontend.
2. Paste a GitHub repository URL.
3. Enter a short project description.
4. Click the analyze button.
5. Review the scorecards, warnings, fixes, and readiness verdict.

Example repo URL:

```txt
https://github.com/openai/openai-quickstart-python
```

Example description:

```txt
A clean Python quickstart repo with clear setup instructions.
```

---

### Test `/analyze` directly

```bash
curl -X POST http://127.0.0.1:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "repoUrl": "https://github.com/openai/openai-quickstart-python",
    "description": "A clean Python quickstart repo with clear setup instructions."
  }'
```

Expected response shape:

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

### Generate a pitch

The `/pitch` endpoint receives the full `/analyze` result and returns streaming text.

```bash
curl -X POST http://127.0.0.1:8000/pitch \
  -H "Content-Type: application/json" \
  -d '{
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
    "warnings": ["README.md is missing an Installation section."],
    "fixes": ["Add an Installation section with exact setup commands."],
    "signals": {
      "projectDescription": "A clean Python quickstart repo with clear setup instructions.",
      "repo": {
        "owner": "openai",
        "name": "openai-quickstart-python",
        "branch": "master"
      }
    }
  }'
```

If `OPENAI_API_KEY` is available, ShipReady uses OpenAI. If the key is missing or the OpenAI call fails, ShipReady uses a local fallback pitch template.

---

## API reference

### `GET /health`

Returns service status.

```json
{
  "status": "ok",
  "service": "ShipReady API"
}
```

---

### `POST /analyze`

Request body:

```json
{
  "repoUrl": "https://github.com/owner/repo",
  "description": "Short project description",
  "fileTree": "optional pasted file tree"
}
```

Response body:

```json
{
  "scores": {
    "readme": 0,
    "security": 0,
    "setup": 0,
    "ux": 0,
    "demo": 0
  },
  "aggregateScore": 0,
  "readiness": "ready | almost | not_ready",
  "readyForJudges": false,
  "warnings": [],
  "fixes": [],
  "signals": {}
}
```

---

### `POST /pitch`

Request body:

```txt
The full /analyze response JSON.
```

Response:

```txt
Streaming text pitch.
```

---

## Readiness verdict

ShipReady returns a three-state readiness verdict:

| Verdict     | Meaning                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------- |
| `ready`     | The repo has a strong score and no warnings.                                                  |
| `almost`    | The repo is strong but still has minor warnings, or it has a moderate score with no warnings. |
| `not_ready` | The repo has a low score or meaningful blockers.                                              |

The older `readyForJudges` boolean is kept for compatibility with earlier frontend code.

---

## Gumloop workflow

ShipReady includes a Gumloop workflow wrapper for the repo-readiness audit.

Workflow idea:

```txt
Input repoUrl + description
→ POST to ShipReady /analyze
→ return the full analysis JSON
```

This allows the same readiness audit to run as an automation pipeline, not only from the web UI.

---

## Security notes

* Do not commit `.env` files.
* Do not hardcode API keys in backend or frontend code.
* Store secrets in local `.env` files and deployment environment variables.
* Use `.env.example` to document required variable names without exposing values.
* The security score is a lightweight heuristic check, not a full vulnerability scanner.
* ShipReady looks for obvious risk signals such as committed `.env` files or exposed key-like patterns.

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

Then update the Render backend CORS environment variable:

```txt
ALLOWED_ORIGINS=http://localhost:5173,https://mpc-hacks-team-ship-ready-nzw9szxw3-the-asians.vercel.app
```

Redeploy the backend after changing `ALLOWED_ORIGINS`.

---

## Planned documentation folders

Create these folders for final polish:

```bash
mkdir -p docs/uml docs/tools
```

Suggested files:

```txt
docs/uml/architecture.md
docs/uml/api-flow.md
docs/tools/installation-tools.md
docs/tools/environment-variables.md
```

Suggested UML diagrams:

* System architecture diagram
* API sequence diagram for `/analyze`
* API sequence diagram for `/pitch`
* Gumloop workflow diagram

---

## Team

* **Yimoun** — Frontend and UX
* **Arley** — Backend, Render deployment, API integration
* **Masood** — AI prompts, Gumloop workflow, sample repositories
* **Ben** — Demo, QA, Devpost, README, presentation flow

---

## License

This project is licensed under the MIT License.

---

## Status

ShipReady was built during MPC Hacks 2026 as a hackathon project. It is designed as a fast, practical demo-readiness assistant for teams preparing to present under pressure.
