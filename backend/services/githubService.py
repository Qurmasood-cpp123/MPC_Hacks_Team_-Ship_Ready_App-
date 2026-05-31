import base64
import re
from urllib.parse import quote

import httpx


GITHUB_REPO_PATTERN = r'^https?://github\.com/([^/\s]+)/([^/\s#?]+?)(?:\.git)?(?:[/#?].*)?$'

REQUEST_HEADERS = {
  'Accept': 'application/vnd.github+json',
  'User-Agent': 'ShipReady-Hackathon'
}

CODE_EXTENSIONS = ('.py', '.js', '.jsx', '.env')
IGNORED_PATH_PARTS = (
  'node_modules/', '.git/', 'dist/', 'build/', '__pycache__/',
  'examples/', 'docs/', 'test/', 'tests/', 'package-lock.json'
)

MAX_CODE_FILES = 12
MAX_FILE_SIZE = 50000


def parseGitHubRepoUrl(repoUrl: str) -> tuple[str, str]:
  match = re.match(GITHUB_REPO_PATTERN, repoUrl.strip())

  if not match:
    raise ValueError('Invalid GitHub repo URL. Use https://github.com/owner/repo')

  return match.group(1), match.group(2)


async def fetchDefaultBranch(client, owner, repo):
  response = await client.get(f'https://api.github.com/repos/{owner}/{repo}')

  if response.status_code != 200:
    return 'main'

  return response.json().get('default_branch', 'main')


async def fetchReadme(client, owner, repo, branch):
  apiUrl = f'https://api.github.com/repos/{owner}/{repo}/readme'
  response = await client.get(apiUrl)

  if response.status_code == 200:
    encoded = response.json().get('content')

    if encoded:
      return base64.b64decode(encoded.replace('\n', '')).decode('utf-8', errors='replace')

  for name in ['README.md', 'README.MD', 'readme.md']:
    rawUrl = f'https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{name}'
    rawResponse = await client.get(rawUrl)

    if rawResponse.status_code == 200 and rawResponse.text.strip():
      return rawResponse.text

  return None


async def fetchFileTree(client, owner, repo, branch):
  treeUrl = f'https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1'
  response = await client.get(treeUrl)

  if response.status_code != 200:
    return []

  return [
    {
      'path': entry.get('path', ''),
      'size': entry.get('size', 0)
    }
    for entry in response.json().get('tree', [])
    if entry.get('type') == 'blob'
  ]


def shouldScan(path, size):
  lowerPath = path.lower()

  if any(part in lowerPath for part in IGNORED_PATH_PARTS):
    return False

  if size and size > MAX_FILE_SIZE:
    return False

  return lowerPath.endswith(CODE_EXTENSIONS)


async def fetchRawFile(client, owner, repo, branch, path):
  rawUrl = f'https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{quote(path)}'
  response = await client.get(rawUrl)

  if response.status_code != 200:
    return None

  return response.text


async def fetchCodeSamples(client, owner, repo, branch, treeEntries):
  samples = []

  targets = [
    entry for entry in treeEntries
    if shouldScan(entry['path'], entry.get('size', 0))
  ][:MAX_CODE_FILES]

  for entry in targets:
    content = await fetchRawFile(client, owner, repo, branch, entry['path'])

    if content:
      samples.append({
        'path': entry['path'],
        'content': content[:MAX_FILE_SIZE]
      })

  return samples


async def fetchRepoSignals(repoUrl: str, providedFileTree: str | None = None) -> dict:
  owner, repo = parseGitHubRepoUrl(repoUrl)

  async with httpx.AsyncClient(
    timeout=8.0,
    follow_redirects=True,
    headers=REQUEST_HEADERS
  ) as client:
    branch = await fetchDefaultBranch(client, owner, repo)
    readme = await fetchReadme(client, owner, repo, branch)
    treeEntries = await fetchFileTree(client, owner, repo, branch)

    fileTree = [entry['path'] for entry in treeEntries]

    if not fileTree and providedFileTree:
      fileTree = [line.strip() for line in providedFileTree.splitlines() if line.strip()]
      treeEntries = [{'path': path, 'size': 0} for path in fileTree]

    codeSamples = await fetchCodeSamples(client, owner, repo, branch, treeEntries)

  return {
    'owner': owner,
    'repo': repo,
    'branch': branch,
    'readme': readme,
    'fileTree': fileTree,
    'fileTreeProvided': providedFileTree is not None,
    'codeSamples': codeSamples
  }