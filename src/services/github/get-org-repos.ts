import * as types from '../../types'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const PER_PAGE = 100

export const getOrgRepos = async (org: string): Promise<types.GitHubRepo[]> => {
  if (!GITHUB_TOKEN) {
    throw new Error('Missing GITHUB_TOKEN env variable!')
  }

  let repos: types.GitHubRepo[] = []

  let page = 1
  for (;;) {
    const response = await fetch(
      `https://api.github.com/orgs/${org}/repos?` +
        new URLSearchParams({
          sort: 'updated',
          per_page: String(PER_PAGE),
          page: String(page)
        }),
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${GITHUB_TOKEN}`
        }
      }
    )

    if (response.status !== 200) {
      const error = (await response.json()) as { message: string }
      throw new Error(
        `Failed to get GitHub repos for org ${org}: ${error.message}`
      )
    }

    const data = (await response.json()) as types.GitHubOrgsReposResponse[]

    repos = [
      ...repos,
      ...data.map(({ archived, name, visibility }) => ({
        archived,
        owner: org,
        name,
        visibility
      }))
    ]

    if (data.length !== PER_PAGE) {
      break
    }

    page += 1
  }

  return repos
}
