import type { GitHubRepo } from './github'

export type TruffleHogScanResult = {
  SourceMetadata: {
    Data: { Github: { link: string; commit: string } }
  }
  DetectorName: string
  Raw: string
  RawV2: string
}

export type Secret = {
  value: string
  detector: string
  repo: GitHubRepo
  commit: string
  url: string
}
