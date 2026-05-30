from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException

from backend.services.readmeCheck import checkReadme


router = APIRouter()


class AnalyzeRequest(BaseModel):
  repoUrl: str = Field(..., min_length=1)
  description: str = Field(..., min_length=1)
  fileTree: str | None = None


def calculateAggregateScore(scores: dict) -> int:
  total = sum(scores.values())
  return round(total / len(scores))


@router.post('/analyze')
async def analyzeRepo(request: AnalyzeRequest):
  try:
    readmeResult = await checkReadme(request.repoUrl)

    scores = {
      'readme': readmeResult['score'],
      'security': 75,
      'setup': 75,
      'ux': 75,
      'demo': 75
    }

    aggregateScore = calculateAggregateScore(scores)

    warnings = readmeResult['warnings']
    fixes = readmeResult['fixes']

    return {
      'scores': scores,
      'aggregateScore': aggregateScore,
      'readyForJudges': aggregateScore >= 75 and len(warnings) == 0,
      'warnings': warnings,
      'fixes': fixes,
      'signals': {
        'projectDescription': request.description,
        'fileTreeProvided': request.fileTree is not None,
        'readme': readmeResult['signals']
      }
    }

  except ValueError as error:
    raise HTTPException(status_code=400, detail=str(error))

  except RuntimeError as error:
    raise HTTPException(status_code=503, detail=str(error))

  except Exception:
    raise HTTPException(status_code=500, detail='Unexpected error while analyzing repository.')