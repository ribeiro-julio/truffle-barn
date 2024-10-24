import { $, ShellError } from 'bun'

import { env } from '../../env'
import * as types from '../../types'

export const scanRepo = async (
  repo: types.GitHubRepo
): Promise<types.Secret[]> => {
  if (!env.GITHUB_TOKEN) {
    throw new Error('Missing GITHUB_TOKEN env variable!')
  }

  if (!env.TRUFFLEHOG_PATH) {
    throw new Error('Missing TRUFFLEHOG_PATH env variable!')
  }

  if (!Bun.file(env.TRUFFLEHOG_PATH).exists()) {
    throw new Error('Missing TruffleHog binary!')
  }

  try {
    const command =
      await $`${env.TRUFFLEHOG_PATH} github --json --only-verified --no-update --force-skip-binaries --repo=https://github.com/${repo.owner}/${repo.name} --token=${env.GITHUB_TOKEN}`.quiet()

    const output = command.stdout.toString().trim()

    if (output) {
      const results = JSON.parse(
        `[${output.split('\n').join(',')}]`
      ) as types.TruffleHogScanResult[]

      return results.map(
        ({
          SourceMetadata: {
            Data: {
              Github: { commit, link }
            }
          },
          DetectorName,
          Raw,
          RawV2
        }) => ({
          value: RawV2 !== '' ? RawV2 : Raw,
          detector: DetectorName,
          repo,
          commit,
          url: link
        })
      )
    }

    return []
  } catch (error: unknown) {
    let message = String(error)
    if (error instanceof ShellError) {
      message = error.stdout.toString()
    }
    throw new Error(
      `Failed to run TruffleHog on repo ${repo.owner}/${repo.name}: ${message}`
    )
  }
}
