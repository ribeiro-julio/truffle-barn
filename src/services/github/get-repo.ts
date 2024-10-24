import * as types from '../../types'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN

export const getRepo = async (
  owner: string,
  repo: string
): Promise<types.GitHubRepo | null> => {
  if (!GITHUB_TOKEN) {
    throw new Error('Missing GITHUB_TOKEN env variable!')
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${GITHUB_TOKEN}`
      }
    }
  )

  if (response.status === 404) {
    return null
  }

  if (response.status !== 200) {
    const error = (await response.json()) as { message: string }
    throw new Error(
      `Failed to get the GitHub repo ${owner}/${repo}: ${error.message}`
    )
  }

  const { archived, name, visibility } =
    (await response.json()) as types.GitHubOrgsReposResponse

  return { archived, owner, name, visibility }
}
