import base64
import re
import httpx


GITHUB_REPO_PATTERN = r'^https://github\.com/([^/\s]+)/([^/\s]+?)(?:\.git)?/?$'


def parseGitHubRepoUrl(repoUrl: str) -> tuple[str, str]:
  match = re.match(GITHUB_REPO_PATTERN, repoUrl.strip())

  if not match:
    raise ValueError('Invalid GitHub repo URL. Use https://github.com/owner/repo')

  return match.group(1), match.group(2)


def buildFixesFromWarnings(warnings: list[str]) -> list[str]:
  fixes = []

  for warning in warnings:
    if 'Installation' in warning:
      fixes.append('Add an Installation section with exact commands for cloning, installing dependencies, and running the app.')
    elif 'Usage' in warning:
      fixes.append('Add a Usage section showing what the project does and how a judge can try it.')
    elif 'could not be fetched' in warning:
      fixes.append('Check that the GitHub repo is public and reachable, then retry the analysis.')
    elif warning == 'README.md is missing.':
      fixes.append('Add a README.md with project description, installation, usage, and demo instructions.')
    elif 'too short' in warning:
      fixes.append('Expand the README.md so judges can understand and run the project quickly.')

  return fixes


async def fetchDefaultBranch(client: httpx.AsyncClient, owner: str, repo: str) -> str:
  repoApiUrl = f'https://api.github.com/repos/{owner}/{repo}'
  response = await client.get(repoApiUrl)

  if response.status_code != 200:
    return 'main'

  repoData = response.json()
  return repoData.get('default_branch', 'main')


async def fetchReadmeFromApi(client: httpx.AsyncClient, owner: str, repo: str) -> str | None:
  apiUrl = f'https://api.github.com/repos/{owner}/{repo}/readme'
  response = await client.get(apiUrl)

  if response.status_code != 200:
    return None

  data = response.json()
  encodedContent = data.get('content')

  if not encodedContent:
    return None

  cleanedContent = encodedContent.replace('\n', '')
  decodedBytes = base64.b64decode(cleanedContent)

  return decodedBytes.decode('utf-8', errors='replace')


async def fetchReadmeFromRaw(
  client: httpx.AsyncClient,
  owner: str,
  repo: str,
  branch: str
) -> str | None:
  possibleNames = ['README.md', 'README.MD', 'readme.md']

  for name in possibleNames:
    rawUrl = f'https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{name}'
    response = await client.get(rawUrl)

    if response.status_code == 200 and response.text.strip():
      return response.text

  return None


async def fetchReadmeContent(repoUrl: str) -> str | None:
  owner, repo = parseGitHubRepoUrl(repoUrl)

  headers = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'ShipReady-Hackathon'
  }

  try:
    async with httpx.AsyncClient(
      timeout=8.0,
      follow_redirects=True,
      headers=headers
    ) as client:
      apiReadme = await fetchReadmeFromApi(client, owner, repo)

      if apiReadme:
        return apiReadme

      defaultBranch = await fetchDefaultBranch(client, owner, repo)
      rawReadme = await fetchReadmeFromRaw(client, owner, repo, defaultBranch)

      if rawReadme:
        return rawReadme

    return None

  except Exception:
    return None


async def checkReadme(repoUrl: str) -> dict:
  warnings = []
  signals = {
    'readmeExists': False,
    'readmeLength': 0,
    'hasInstallationSection': False,
    'hasUsageSection': False
  }

  readmeContent = await fetchReadmeContent(repoUrl)

  if readmeContent is None:
    warnings.append('README.md is missing or could not be fetched from GitHub.')
    return {
      'score': 0,
      'warnings': warnings,
      'fixes': buildFixesFromWarnings(warnings),
      'signals': signals
    }

  readmeLength = len(readmeContent)
  lowerReadme = readmeContent.lower()

  signals['readmeExists'] = True
  signals['readmeLength'] = readmeLength
  signals['hasInstallationSection'] = 'installation' in lowerReadme
  signals['hasUsageSection'] = 'usage' in lowerReadme

  score = 100 if readmeLength > 500 else 60

  if readmeLength <= 500:
    warnings.append('README.md exists but is too short for a judge-ready project.')

  if not signals['hasInstallationSection']:
    warnings.append('README.md is missing an Installation section.')

  if not signals['hasUsageSection']:
    warnings.append('README.md is missing a Usage section.')

  return {
    'score': score,
    'warnings': warnings,
    'fixes': buildFixesFromWarnings(warnings),
    'signals': signals
  }