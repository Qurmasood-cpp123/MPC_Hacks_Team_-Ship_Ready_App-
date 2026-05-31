import asyncio
import json
import os

from openai import AsyncOpenAI

from backend.services.pitchPrompt import PITCH_SYSTEM_PROMPT


def getStrongestScore(scores: dict) -> str:
  if not scores:
    return 'overall readiness'

  strongestCategory = max(scores, key=scores.get)
  strongestValue = scores[strongestCategory]

  return f'{strongestCategory} at {strongestValue}/100'


def getWeakestScore(scores: dict) -> str:
  if not scores:
    return 'setup'

  weakestCategory = min(scores, key=scores.get)
  weakestValue = scores[weakestCategory]

  return f'{weakestCategory} at {weakestValue}/100'


def getReadinessText(analysis: dict) -> str:
  readiness = analysis.get('readiness')
  readyForJudges = analysis.get('readyForJudges', False)

  if readiness == 'ready':
    return 'ready for judges'

  if readiness == 'almost':
    return 'almost judge-ready'

  if readiness == 'not_ready':
    return 'not judge-ready yet'

  return 'ready for judges' if readyForJudges else 'not fully judge-ready yet'


def buildFallbackPitch(analysis: dict) -> str:
  scores = analysis.get('scores', {})
  aggregateScore = analysis.get('aggregateScore', 0)
  warnings = analysis.get('warnings', [])
  fixes = analysis.get('fixes', [])
  signals = analysis.get('signals', {})
  repo = signals.get('repo', {})

  projectName = repo.get('name') or 'this project'
  description = (
    signals.get('projectDescription')
    or analysis.get('description')
    or 'this hackathon project'
  )

  readinessText = getReadinessText(analysis)
  strongestScore = getStrongestScore(scores)
  weakestScore = getWeakestScore(scores)

  warningText = (
    warnings[0]
    if warnings
    else 'The main opportunity is adding one more layer of demo polish.'
  )

  fixText = (
    fixes[0]
    if fixes
    else 'The next step is to tighten the final demo experience.'
  )

  return (
    'AI-assisted teams can build fast, but speed creates a new problem: '
    'projects often reach judging before they are truly ready. '
    f'ShipReady audits {projectName}, a project described as: {description} '
    f'The repo scored {aggregateScore}/100, so ShipReady marks it as {readinessText}. '
    f'The strongest signal is {strongestScore}, while the weakest area is {weakestScore}. '
    f'The honest risk is this: {warningText} '
    f'ShipReady turns that risk into a clear next action: {fixText} '
    'For teams building in the AI-assisted development era, ShipReady helps them move fast, fix what matters, and ship clean.'
  )


async def streamFallbackPitch(analysis: dict):
  pitch = buildFallbackPitch(analysis)

  for word in pitch.split():
    yield f'{word} '
    await asyncio.sleep(0.015)


async def streamOpenAiPitch(analysis: dict):
  client = AsyncOpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

  stream = await client.responses.create(
    model=os.environ.get('OPENAI_MODEL', 'gpt-4o'),
    instructions=PITCH_SYSTEM_PROMPT,
    input=json.dumps(analysis),
    temperature=0.7,
    max_output_tokens=220,
    stream=True
  )

  async for event in stream:
    if event.type == 'response.output_text.delta':
      yield event.delta


async def streamPitch(analysis: dict):
  apiKey = os.environ.get('OPENAI_API_KEY')

  print(
    f'[ShipReady pitch] OPENAI_API_KEY present: {bool(apiKey)}',
    flush=True
  )

  if not apiKey:
    print(
      '[ShipReady pitch] Missing OPENAI_API_KEY. Using fallback pitch.',
      flush=True
    )

    async for chunk in streamFallbackPitch(analysis):
      yield chunk
    return

  try:
    print(
      '[ShipReady pitch] Calling OpenAI Responses API.',
      flush=True
    )

    async for chunk in streamOpenAiPitch(analysis):
      yield chunk

  except Exception as error:
    print(
      f'[ShipReady pitch] OpenAI call failed. Falling back. Error: {repr(error)}',
      flush=True
    )

    async for chunk in streamFallbackPitch(analysis):
      yield chunk