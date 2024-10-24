import { parseArgs } from 'node:util'

import * as scripts from './scripts'

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
      scripts.showHelp()
      process.exit(0)
    }

    if (values.organization) {
      await scripts.scanOrg(values.organization)
      process.exit(0)
    }

    if (values.repository) {
      const data = values.repository.split('/')
      if (data.length !== 2) {
        throw new Error(
          'Invalid repository argument!\nShould be in the format: owner/name'
        )
      }
      await scripts.scanRepo(data[0], data[1])
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
