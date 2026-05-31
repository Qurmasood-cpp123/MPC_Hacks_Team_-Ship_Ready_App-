# Environment Variables

ShipReady uses environment variables for configuration and secrets.

Never commit real API keys to GitHub.

---

## Backend environment variables

Set these in Render or in a local backend `.env` file.

```txt
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o
ALLOWED_ORIGINS=http://localhost:5173,https://mpc-hacks-team-ship-ready-nzw9szxw3-the-asians.vercel.app
```

---

## `OPENAI_API_KEY`

Used by `/pitch` to generate a GPT-powered pitch.

If this variable is missing or invalid, ShipReady falls back to a local pitch template.

Do not expose this key in:

- GitHub commits
- frontend code
- README screenshots
- Devpost screenshots
- public chat messages
- demo recordings

---

## `OPENAI_MODEL`

Recommended value:

```txt
gpt-4o
```

This controls which OpenAI model the pitch service uses.

---

## `ALLOWED_ORIGINS`

Comma-separated list of frontend URLs allowed to call the backend.

Recommended value:

```txt
http://localhost:5173,https://mpc-hacks-team-ship-ready-nzw9szxw3-the-asians.vercel.app
```

Do not create duplicate `ALLOWED_ORIGINS` variables in Render. Keep one key with all allowed origins in the same value.

---

## Frontend environment variables

Set this in Vercel or in `frontend/.env`.

```txt
VITE_API_BASE_URL=https://mpc-hacks-team-ship-ready-app.onrender.com
```

This tells the Vercel frontend where to send API requests.

---

## Local frontend example

Create `frontend/.env`:

```txt
VITE_API_BASE_URL=http://localhost:8000
```

---

## Production frontend example

In Vercel, set:

```txt
VITE_API_BASE_URL=https://mpc-hacks-team-ship-ready-app.onrender.com
```

Then redeploy the frontend.

---

## Security checklist

Before pushing code, confirm:

- No `.env` file is committed.
- No real API key appears in source code.
- No secret appears in screenshots.
- `.gitignore` excludes `.env`.
- Environment variable names are documented without exposing values.
- Frontend calls the ShipReady backend, not OpenAI directly.
