import asyncio
import json
import os

from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

Pitch_System_Prompt="""
You are a ShipReady's pitch coach for hacakthon teams.

ShipReady helps teams audit a Github repo before presenting to the judges.
Your job is to turn a repository readiness analysis into a compelling 60-second demo pitch .

Write the pitch like a confident hackathon presenter, not a coporate marketer.

Rules:
1. Output only the pitch text.
2. Keep the pitch between 120 and 160 words.
3. Start with the problem in one strong sentence.
4. Explain what project does in plain language.
5. Mention the strongest score or signal from the analysis.
6. Mention one honest weakness or risk if warning exist.
7. End with a judging ready closing line.
8. Do not invent features, metrics, sponsors, users, integrations, or security claims.
9. If the repo is weak, frame the pitch as a readiness audit that found useful fixes.
10. If the repo is strong, frame the pitch as proof that the team is ready to demo and ship.
11. Preserve the ShipReady framing: built for the AI-assisted development era, where teams move fast and need to ship clean.

""" .strip()

def getStrongestScore(scores):
    if not scores:
        return 'Overall Readiness'
    
    strongestCategory=max(scores, key=scores.get)
    strongestValue=scores[strongestCategory]

    return f'{strongestCategory} at {strongestValue}/100'

def buildFallbackPitch(analysis):
    description=analysis.get('description','this project')
    scores=analysis.get('scores',{})
    aggregateScore=analysis.get('aggregateScore',0)
    readyforJudges=analysis.get('readyForJudges',True)
    warnings=analysis.get('warnings',[])
    fixes=analysis.get('fixes',[])

    readinessText='Ready for Judges' if readyforJudges else 'not ready for judges yet'
    strongestScore=getStrongestScore(scores)

    warningText=(
        warnings[0]
        if warnings
        else 'The main oppurtunity is adding one more layer of demo polish.'
    )

    fixText=(
        fixes[0]
        if fixes
        else 'The next stop is to tighten the final demo experience.'
    )

    return(
        'AI-assisted teams can build fast, but speed creates a new problem: '
        'projects often reach judging before they truly ready.'
        f'Ship Ready audits {description} and turns the repo into a clear readiness story.'
        f'The project scores {aggregateScore} out of 100, so ShipReady marks it as {readinessText}.'
        f'The strongest signal is {strongestScore}, which shows where the team already has the momemtum.'
        f'The honest risk is this: {warningText} '
        f'ShipReady does not just point out the issue; it gives the team a next action: {fixText} '
        'For teams building in the AI-assisted development era, ShipReady helps them move fast, fix what matters, and ship clean.'
    )

async def streamFallbackPitch(analysis):
    pitch=buildFallbackPitch(analysis)

    for word in pitch.split():
        yield f'{word} '
        await asyncio.sleep(0.015)

async def streamOpenAIPitch(analysis):
    client=AsyncOpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

    stream=await client.responses.create(
        model=os.environ.get('OPENAI_MODEL','gpt-4o'),
        instructions=Pitch_System_Prompt,
        input=json.dumps(analysis),
        temperature=0.7,
        max_output_tokens=220,
        stream=True
    )

    async for event in stream:
        if event.type == 'response.output_text.delta':
            yield event.delta
    
async def streamPitch(analysis):
    apikey=os.environ.get('OPENAI_API_KEY')
    if not apikey:
        async for chunk in streamFallbackPitch(analysis):
            yield chunk
        return
    
    try:
        async for chunk in streamOpenAIPitch(analysis):
            yield chunk
    except Exception:
        async for chunk in streamFallbackPitch(analysis):
            yield chunk

if __name__== '__main__':
    GoodRepoAnalysis={
        'github_repo_URL': 'https://github.com/Qurmasood-cpp123/MPC_Hacks_Team_-Ship_Ready_App-/tree/main/Good_Github_Repo',
        'description': 'A clean ShipReady demo repo with FastAPI backend,Vite React frontend, safe enviornment variable handling, and judge-friendly setup instructions.',
        'scores':{
            'README':94,
            'SECURITY':92,
            'SETUP':91,
            'UX':86,
            'DEMO':90
        },
        'aggregateScore':91,
        'readyForJudges':True,
        'warnings':[
            'Frontend is minimal and could use more product-specific interaction.'
        ],
        'fixes':[
            'Add a slightly richer demo interaction if time allows.'
        ]
    }
    BadRepoAnalysis={
        'github_repo_URL': 'https://github.com/Qurmasood-cpp123/MPC_Hacks_Team_-Ship_Ready_App-/tree/main/Bad_Github_Repo',
        'description':'A weak ShipReady demo repo with poor documentation, unsafe secret handling, missing setup instructions and low demo readiness.',
        'scores':{
            'README':18,
            'SECURITY':8,
            'SETUP':22,
            'UX':35,
            'DEMO':20
        },
        'aggregateScore': 21,
        'readyForJudges':False,
        'warnings': [
        'README is too vague for judges to run the project.',
        'Possible secrets are committed in source files.',
        'No clear environment variable template is provided.',
        'Setup instructions are incomplete.'
    ],
    'fixes': [
        'Replace the README with a clear project overview, setup steps, and demo script.',
        'Remove committed secrets and add a safe .env.example file.',
        'Add a .gitignore entry for .env files.',
        'Document how to run the app locally.'
        ]
    }

    async def printPitch(title,analysis):
        print(f'\n\n-----{title}------\n')

        async for chunk in streamPitch(analysis):
            print(chunk,end='',flush=True)
        
        print('\n')

    async def main():
        await printPitch('GOOD REPO PITCH', GoodRepoAnalysis)
        await printPitch('BAD REPO PITCH',BadRepoAnalysis)

        print('Done testing both repos.')
    

    asyncio.run(main())              

