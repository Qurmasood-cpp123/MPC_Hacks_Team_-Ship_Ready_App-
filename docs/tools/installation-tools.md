# Installation Tools

This document lists the tools needed to run ShipReady locally and deploy the MVP.

---

## Required tools

### Git

Used to clone the repository, create branches, and push changes.

Check installation:

```bash
git --version
```

---

### Python 3.11 or newer

Used for the FastAPI backend.

Check installation:

```bash
python --version
```

On Windows, this may also work:

```bash
py --version
```

---

### Node.js 18 or newer

Used for the React/Vite frontend.

Check installation:

```bash
node --version
npm --version
```

---

### Code editor

Recommended editors:

- Visual Studio Code
- Cursor
- JetBrains IDEs

---

## Backend setup

From the project root:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn backend.main:app --reload
```

Backend local URL:

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

## Frontend setup

From the `frontend/` folder:

```bash
npm install
npm run dev
```

Frontend local URL:

```txt
http://localhost:5173
```

---

## Deployment tools

### Render

Used for backend deployment.

Backend production URL:

```txt
https://mpc-hacks-team-ship-ready-app.onrender.com
```

Recommended start command:

```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

---

### Vercel

Used for frontend deployment.

Frontend production URL:

```txt
https://mpc-hacks-team-ship-ready-nzw9szxw3-the-asians.vercel.app
```

Recommended Vercel settings:

```txt
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

---

### Gumloop

Used for workflow automation.

Workflow:

```txt
Input repoUrl + description
→ POST to /analyze
→ return full analysis JSON
```

---

### OpenAI

Used by `/pitch` to generate a stronger pitch when `OPENAI_API_KEY` is available.

If OpenAI is unavailable, ShipReady uses its local fallback pitch generator.
