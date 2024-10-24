const GITHUB_TOKEN = process.env.GITHUB_TOKEN

export const orgExists = async (org: string): Promise<boolean> => {
  if (!GITHUB_TOKEN) {
    throw new Error('Missing GITHUB_TOKEN env variable!')
  }

  const response = await fetch(`https://api.github.com/orgs/${org}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`
    }
  })

  if (response.status === 404) {
    return false
  }

  if (response.status !== 200) {
    const error = (await response.json()) as { message: string }
    throw new Error(`Failed to get the GitHub org ${org}: ${error.message}`)
  }

  return true
}
