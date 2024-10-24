import { $, ShellError } from 'bun'

import * as types from '../../types'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const TRUFFLEHOG_PATH = './binaries/trufflehog'

export const scanRepo = async (
  owner: string,
  repo: string
): Promise<types.Secret[]> => {
  if (!GITHUB_TOKEN) {
    throw new Error('Missing GITHUB_TOKEN env variable!')
  }

  if (!Bun.file(TRUFFLEHOG_PATH).exists()) {
    throw new Error('Missing TruffleHog binary!')
  }

  try {
    // TODO: add --only-verified after --json
    const command =
      await $`${TRUFFLEHOG_PATH} github --json --no-update --force-skip-binaries --repo=https://github.com/${owner}/${repo} --token=${GITHUB_TOKEN}`.quiet()

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
          secret: RawV2 ?? Raw,
          detector: DetectorName,
          repoOwner: owner,
          repoName: repo,
          commit,
          link
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
      `Failed to run TruffleHog on repo ${owner}/${repo}: ${message}`
    )
  }
}
