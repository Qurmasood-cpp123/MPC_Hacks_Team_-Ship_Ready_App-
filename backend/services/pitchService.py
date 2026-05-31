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