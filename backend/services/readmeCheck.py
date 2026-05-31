def buildFixesFromWarnings(warnings: list[str]) -> list[str]:
  fixes = []

  for warning in warnings:
    if 'Installation' in warning:
      fixes.append('Add an Installation section with exact setup commands.')
    elif 'Usage' in warning:
      fixes.append('Add a Usage section showing how to run or demo the project.')
    elif 'missing or could not be fetched' in warning:
      fixes.append('Add a README.md with description, installation, usage, and demo instructions.')
    elif 'too short' in warning:
      fixes.append('Expand the README.md so judges can quickly understand and run the project.')

  return fixes


def checkReadme(readmeContent: str | None) -> dict:
  warnings = []
  signals = {
    'readmeExists': False,
    'readmeLength': 0,
    'hasInstallationSection': False,
    'hasUsageSection': False
  }

  if not readmeContent:
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