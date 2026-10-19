import "server-only"

import { cache } from "react"

import {
  normalizeContributor,
  normalizeContributorSummaries,
  normalizeRelease,
  normalizeReleases,
} from "./normalize"
import { fetchGitHubJson, GITHUB_API_BASE_URL } from "./request"
import type { GitHubContributor, LatestRelease, Release } from "./types"

const LATEST_RELEASE_API_URL = `${GITHUB_API_BASE_URL}/releases/latest`
const RELEASES_API_URL = `${GITHUB_API_BASE_URL}/releases?per_page=30`
const CONTRIBUTORS_API_URL = `${GITHUB_API_BASE_URL}/contributors?per_page=10`
export const getLatestRelease = cache(async (): Promise<LatestRelease> => {
  const payload = await fetchGitHubJson(
    LATEST_RELEASE_API_URL,
    "latest release"
  )

  return normalizeRelease(payload)
})

export const getReleases = cache(async (): Promise<Release[]> => {
  const payload = await fetchGitHubJson(RELEASES_API_URL, "releases")

  return normalizeReleases(payload)
})

const getContributors = cache(async (): Promise<GitHubContributor[]> => {
  const summaries = normalizeContributorSummaries(
    await fetchGitHubJson(CONTRIBUTORS_API_URL, "contributors")
  )

  return Promise.all(
    summaries.map(async (summary) => {
      const profile = await fetchGitHubJson(
        `https://api.github.com/users/${encodeURIComponent(summary.login)}`,
        `profile for ${summary.login}`
      )

      return normalizeContributor(summary, profile)
    })
  )
})

export const getHomeData = cache(async () => {
  const releasePromise = getLatestRelease()
  const contributorsPromise = getContributors()

  const [latestRelease, contributors] = await Promise.all([
    releasePromise,
    contributorsPromise,
  ])

  return { latestRelease, contributors }
})
