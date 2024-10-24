import { and, eq } from 'drizzle-orm'

import { db, schema } from '../../db'
import { env } from '../../env'
import * as types from '../../types'

export const getRepo = async (
  owner: string,
  repo: string
): Promise<types.GitHubRepo | null> => {
  if (!env.GITHUB_TOKEN) {
    throw new Error('Missing GITHUB_TOKEN env variable!')
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${env.GITHUB_TOKEN}`
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

  if (
    !(await db.query.repo.findFirst({
      where: and(eq(schema.repo.owner, owner), eq(schema.repo.name, name))
    }))
  ) {
    await db.insert(schema.repo).values([{ archived, owner, name, visibility }])
  }

  return { archived, owner, name, visibility }
}
