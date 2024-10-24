export type GitHubOrgsReposResponse = {
  archived: boolean
  name: string
  visibility: 'private' | 'public'
}

export type GitHubRepo = {
  archived: boolean
  owner: string
  name: string
  visibility: 'private' | 'public'
}
