```md
# Environment Variables

ShipReady uses environment variables for configuration and secrets.

Never commit real API keys to GitHub.

## Backend environment variables

Set these in Render or in a local `.env` file.

```txt
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o
ALLOWED_ORIGINS=http://localhost:5173,https://mpc-hacks-team-ship-ready-nzw9szxw3-the-asians.vercel.app