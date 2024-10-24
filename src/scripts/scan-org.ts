import { and, eq } from 'drizzle-orm'

import { db, schema } from '../db'
import * as github from '../services/github'
import * as trufflehog from '../services/trufflehog'

export const scanOrg = async (org: string) => {
  if (!(await github.orgExists(org))) {
    throw new Error(`The org ${org} does not exist!`)
  }

  const repos = await github.getOrgRepos(org)

  for (const repo of repos) {
    console.log(`Scanning repo ${repo.owner}/${repo.name}...`)

    const results = await trufflehog.scanRepo(repo)

    const dbRepo = await db.query.repo.findFirst({
      columns: { id: true },
      where: and(
        eq(schema.repo.owner, repo.owner),
        eq(schema.repo.name, repo.name)
      )
    })
    const dbSecrets = await db.query.secret.findMany()
    const dbOccurences = await db.query.occurrence.findMany({
      columns: { repoId: true, secretId: true, commit: true, url: true }
    })

    for (const { value, detector, commit, url } of results) {
      let dbSecret = dbSecrets.find(
        dbs => dbs.value === value && dbs.detector === detector
      )
      if (!dbSecret) {
        dbSecret = (
          await db
            .insert(schema.secret)
            .values([{ value, detector }])
            .returning()
        )[0]
        dbSecrets.push(dbSecret!)
      }
      if (
        !dbOccurences.find(
          dbo =>
            dbo.repoId === dbRepo!.id &&
            dbo.secretId === dbSecret.id &&
            dbo.commit === commit &&
            dbo.url === url
        )
      ) {
        await db
          .insert(schema.occurrence)
          .values([{ repoId: dbRepo!.id, secretId: dbSecret.id, commit, url }])
      }
    }
  }
}
