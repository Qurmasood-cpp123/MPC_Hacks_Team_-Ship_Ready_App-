```md
# ShipReady API Flow

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