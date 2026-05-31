import re


SECRET_PATTERNS = [
  (r'sk-[a-zA-Z0-9_-]{20,}', 'an OpenAI-style API key'),
  (r'ghp_[a-zA-Z0-9]{20,}', 'a GitHub personal access token'),
  (r'AKIA[0-9A-Z]{16}', 'an AWS access key ID'),
  (r'(?i)(api[_-]?key|secret|password|token)\s*[:=]\s*[\'"][^\'"]{12,}[\'"]', 'a hardcoded credential')
]

IGNORED_SECURITY_PATH_PARTS = (
  'examples/',
  'docs/',
  'test/',
  'tests/',
  'node_modules/',
  'dist/',
  'build/',
  '__pycache__/'
)


def isIgnoredPath(path: str) -> bool:
  lowerPath = path.lower()
  return any(part in lowerPath for part in IGNORED_SECURITY_PATH_PARTS)


def isCommittedEnvFile(path: str) -> bool:
  lowerPath = path.lower()

  if isIgnoredPath(lowerPath):
    return False

  return lowerPath == '.env' or lowerPath.endswith('/.env')


def scanTextForSecrets(text: str | None) -> list[str]:
  found = []

  for pattern, label in SECRET_PATTERNS:
    if re.search(pattern, text or ''):
      found.append(label)

  return found


def checkSecurity(readme: str | None, fileTree: list[str], codeSamples: list[dict]) -> dict:
  warnings = []
  fixes = []
  score = 100

  lowerTree = [path.lower() for path in fileTree]

  signals = {
    'committedEnvFile': any(isCommittedEnvFile(path) for path in lowerTree),
    'hasEnvExample': any(path.endswith('.env.example') for path in lowerTree),
    'hasGitignore': any(path.endswith('.gitignore') for path in lowerTree),
    'exposedSecretLocations': []
  }

  if signals['committedEnvFile']:
    score -= 40
    warnings.append('A .env file appears to be committed to the repository.')
    fixes.append('Remove .env from git, add it to .gitignore, and commit a .env.example template instead.')

  if not signals['hasGitignore']:
    score -= 15
    warnings.append('No .gitignore file found.')
    fixes.append('Add a .gitignore file that excludes .env, virtual environments, node_modules, and build outputs.')

  if not signals['hasEnvExample'] and fileTree:
    score -= 10
    fixes.append('Add a .env.example so judges know which environment variables the project expects.')

  for sample in codeSamples:
    path = sample.get('path', 'unknown file')

    if isIgnoredPath(path):
      continue

    leaks = scanTextForSecrets(sample.get('content', ''))

    if leaks:
      score -= 50
      signals['exposedSecretLocations'].append(path)
      warnings.append(f'{path} appears to contain {leaks[0]}.')
      fixes.append(f'Remove the secret from {path}, move it to environment variables, and rotate the key.')
      break

  return {
    'score': max(score, 0),
    'warnings': warnings,
    'fixes': fixes,
    'signals': signals
  }