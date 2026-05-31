from backend.services.readmeCheck import checkReadme
from backend.services.securityCheck import checkSecurity


SETUP_FILES = [
  'requirements.txt',
  'package.json',
  'pyproject.toml',
  'pipfile',
  'dockerfile',
  'docker-compose.yml'
]

DEPLOY_FILES = [
  'render.yaml',
  'vercel.json',
  'procfile',
  'netlify.toml'
]


def scoreSetup(readme: str | None, fileTree: list[str]) -> dict:
  warnings = []
  fixes = []
  lowerTree = [path.lower() for path in fileTree]
  lowerReadme = (readme or '').lower()

  hasDependencyFile = any(
    any(name in path for name in SETUP_FILES)
    for path in lowerTree
  )

  hasSetupCommands = (
    'pip install' in lowerReadme
    or 'npm install' in lowerReadme
    or 'npm run' in lowerReadme
    or 'python ' in lowerReadme
  )

  score = 100

  if not hasDependencyFile:
    score -= 35
    warnings.append('No dependency manifest found.')
    fixes.append('Add requirements.txt, package.json, or another dependency manifest.')

  if not hasSetupCommands:
    score -= 35
    warnings.append('The README has no clear setup commands.')
    fixes.append('Add exact setup commands so judges can run the project quickly.')

  return {
    'score': max(score, 0),
    'warnings': warnings,
    'fixes': fixes
  }


def scoreUx(readme: str | None, description: str, fileTree: list[str]) -> dict:
  warnings = []
  fixes = []
  lowerTree = [path.lower() for path in fileTree]
  lowerReadme = (readme or '').lower()

  hasFrontend = any(
    'frontend/' in path
    or path.endswith('.jsx')
    or path.endswith('.html')
    for path in lowerTree
  )

  descriptionIsClear = len(description.strip()) >= 40
  hasVisualCue = any(
    cue in lowerReadme
    for cue in ['screenshot', '.png', '.gif', 'demo']
  )

  score = 100

  if not hasFrontend:
    score -= 25
    warnings.append('No obvious frontend or UI files found.')
    fixes.append('If the project has a UI, keep the frontend code visible in the repo.')

  if not descriptionIsClear:
    score -= 25
    warnings.append('The project description is too short.')
    fixes.append('Write a sharper one-line value proposition.')

  if not hasVisualCue:
    score -= 15
    fixes.append('Add a screenshot, GIF, or demo image to help judges understand the project quickly.')

  return {
    'score': max(score, 0),
    'warnings': warnings,
    'fixes': fixes
  }


def scoreDemo(readme: str | None, fileTree: list[str]) -> dict:
  warnings = []
  fixes = []
  lowerTree = [path.lower() for path in fileTree]
  lowerReadme = (readme or '').lower()

  hasDeployFile = any(
    any(name in path for name in DEPLOY_FILES)
    for path in lowerTree
  )

  hasDemoSignal = (
    'demo' in lowerReadme
    or 'screenshot' in lowerReadme
    or 'https://' in lowerReadme
    or '.gif' in lowerReadme
    or '.png' in lowerReadme
  )

  score = 100

  if not hasDemoSignal:
    score -= 40
    warnings.append('No live demo link, screenshot, or demo media found.')
    fixes.append('Add a live demo link, screenshot, or GIF near the top of the README.')

  if not hasDeployFile:
    score -= 20
    fixes.append('Add deploy notes or deployment config so the project feels judge-ready.')

  return {
    'score': max(score, 0),
    'warnings': warnings,
    'fixes': fixes
  }


def calculateAggregate(scores: dict) -> int:
  return round(sum(scores.values()) / len(scores))


def scoreRepo(signals: dict, description: str) -> dict:
  readme = signals.get('readme')
  fileTree = signals.get('fileTree', [])
  codeSamples = signals.get('codeSamples', [])

  readmeResult = checkReadme(readme)
  securityResult = checkSecurity(readme, fileTree, codeSamples)
  setupResult = scoreSetup(readme, fileTree)
  uxResult = scoreUx(readme, description, fileTree)
  demoResult = scoreDemo(readme, fileTree)

  parts = {
    'readme': readmeResult,
    'security': securityResult,
    'setup': setupResult,
    'ux': uxResult,
    'demo': demoResult
  }

  scores = {
    key: value['score']
    for key, value in parts.items()
  }

  warnings = [
    warning
    for value in parts.values()
    for warning in value.get('warnings', [])
  ]

  fixes = [
    fix
    for value in parts.values()
    for fix in value.get('fixes', [])
  ]

  aggregateScore = calculateAggregate(scores)

  return {
    'scores': scores,
    'aggregateScore': aggregateScore,
    'readyForJudges': aggregateScore >= 75 and len(warnings) == 0,
    'warnings': warnings,
    'fixes': fixes,
    'signals': {
      'projectDescription': description,
      'repo': {
        'owner': signals.get('owner'),
        'name': signals.get('repo'),
        'branch': signals.get('branch')
      },
      'fileTreeProvided': signals.get('fileTreeProvided', False),
      'readme': readmeResult['signals'],
      'security': securityResult['signals']
    }
  }