export type LatestRelease = {
  version: string
  date: string
  publishedAt: string
  assets: ReleaseAsset[]
}

export type ReleaseAsset = {
  name: string
  url: string
  size: number
}

export type Release = {
  id: number
  tag: string
  version: string
  name: string
  date: string
  publishedAt: string
  prerelease: boolean
  body: string
  url: string
  sourceUrl: string
  assets: ReleaseAsset[]
}

export type GitHubContributor = {
  login: string
  name: string
  bio: string
  avatarUrl: string
  githubUrl: string
  contributions: number
  followers: number
}

export type GitHubContributorSummary = {
  login: string
  type: string
  avatarUrl: string
  githubUrl: string
  contributions: number
}
