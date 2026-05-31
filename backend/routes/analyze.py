from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException

from backend.services.githubService import fetchRepoSignals
from backend.services.scoringService import scoreRepo


router = APIRouter()


class AnalyzeRequest(BaseModel):
  repoUrl: str = Field(..., min_length=1)
  description: str = Field(default='', min_length=0)
  fileTree: str | None = None


@router.post('/analyze')
async def analyzeRepo(request: AnalyzeRequest):
  try:
    signals = await fetchRepoSignals(request.repoUrl, request.fileTree)
    return scoreRepo(signals, request.description)

  except ValueError as error:
    raise HTTPException(status_code=400, detail=str(error))

  except RuntimeError as error:
    raise HTTPException(status_code=503, detail=str(error))

  except Exception:
   raise HTTPException(status_code=500, detail='Unexpected error while analyzing repository.')