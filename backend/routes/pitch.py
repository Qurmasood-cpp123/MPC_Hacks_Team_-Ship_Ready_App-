from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from backend.services.pitchService import streamPitch


router = APIRouter()


@router.post('/pitch')
async def generatePitch(analysis: dict):
  return StreamingResponse(
    streamPitch(analysis),
    media_type='text/plain'
  )