export type TruffleHogScanResult = {
  SourceMetadata: {
    Data: { Github: { link: string; commit: string } }
  }
  DetectorName: string
  Raw: string
  RawV2: string
}

export type Secret = {
  secret: string
  detector: string
  repoOwner: string
  repoName: string
  commit: string
  link: string
}
