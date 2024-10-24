export type GitHubOrgsReposResponse = {
  archived: boolean
  name: string
  visibility: 'private' | 'public'
}

export type GitHubRepo = {
  owner: string
  name: string
  archived: boolean
  visibility: 'private' | 'public'
}
