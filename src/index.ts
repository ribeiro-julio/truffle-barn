import { parseArgs } from 'node:util'

import * as github from './services/github'
import * as trufflehog from './services/trufflehog'
import * as types from './types'

const scanOrg = async (org: string) => {
  if (!(await github.orgExists(org))) {
    throw new Error(`The org ${org} does not exist!`)
  }

  const repos = await github.getOrgRepos(org)

  const secrets: types.Secret[] = []

  while (repos.length) {
    await Promise.all(
      repos.splice(0, 8).map(async r => {
        console.log(`Scanning repo ${r.owner}/${r.name}...`)

        const results = await trufflehog.scanRepo(r.owner, r.name)
        secrets.push(...results)
      })
    )
  }

  console.log(JSON.stringify(secrets, null, 2))
}

const scanRepo = async (repoOwner: string, repoName: string) => {
  const repo = await github.getRepo(repoOwner, repoName)
  if (!repo) {
    throw new Error(`The repo ${repoOwner}/${repoName} does not exist!`)
  }

  console.log(`Scanning repo ${repoOwner}/${repoName}...`)

  const secrets = await trufflehog.scanRepo(repoOwner, repoName)
  console.log(JSON.stringify(secrets, null, 2))
}

const showHelp = () => {
  console.log('Usage: truffle-barn [options]')
  console.log('Options:')
  console.log('  -r, --repository <owner/name> \tScan a single repository')
  console.log(
    '  -o, --organization <name> \t\tScan all repositories in an organization'
  )
  console.log('  -h, --help\t\t\t\tShow help')
}

if (import.meta.main) {
  try {
    const { values } = parseArgs({
      options: {
        help: { type: 'boolean', short: 'h' },
        organization: { type: 'string', short: 'o' },
        repository: { type: 'string', short: 'r' }
      }
    })

    if (values.help) {
      showHelp()
      process.exit(0)
    }

    if (values.organization) {
      await scanOrg(values.organization)
      process.exit(0)
    }

    if (values.repository) {
      const data = values.repository.split('/')
      if (data.length !== 2) {
        throw new Error(
          'Invalid repository argument!\nShould be in the format: owner/name'
        )
      }
      await scanRepo(data[0], data[1])
      process.exit(0)
    }
  } catch (error) {
    let message = String(error)
    if (error instanceof Error) {
      message = error.message
    }
    console.error(message)
    process.exit(1)
  }
}
