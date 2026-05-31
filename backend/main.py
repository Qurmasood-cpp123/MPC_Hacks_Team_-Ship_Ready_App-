import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.analyze import router as analyzeRouter
from backend.routes.pitch import router as pitchRouter



app = FastAPI(title='ShipReady API')


allowedOrigins = os.getenv(
  'ALLOWED_ORIGINS',
  'http://localhost:5173'
).split(',')

app.add_middleware(
  CORSMiddleware,
  allow_origins=allowedOrigins,
  allow_credentials=True,
  allow_methods=['*'],
  allow_headers=['*']
)


@app.get('/health')
async def healthCheck():
  return {
    'status': 'ok',
    'service': 'ShipReady API'
  }


app.include_router(analyzeRouter)
app.include_router(pitchRouter)