import { isDocPath } from "../docs/paths"
import { GitHubDataError } from "./errors"
import type {
  GitHubContributor,
  GitHubContributorSummary,
  LatestRelease,
  Release,
  ReleaseAsset,
} from "./types"

type RecordValue = Record<string, unknown>

function asRecord(value: unknown, label: string): RecordValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new GitHubDataError(`GitHub ${label} payload must be an object.`)
  }

  return value as RecordValue
}

function requiredString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new GitHubDataError(`GitHub payload is missing a valid ${field}.`)
  }

  return value.trim()
}

function requiredNumber(value: unknown, field: string) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new GitHubDataError(`GitHub payload is missing a valid ${field}.`)
  }

  return value
}

function optionalString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function normalizeReleaseAsset(value: unknown, index: number): ReleaseAsset {
  const asset = asRecord(value, `release asset at index ${index}`)

  return {
    name: requiredString(asset.name, `release asset ${index} name`),
    url: requiredString(
      asset.browser_download_url,
      `release asset ${index} download URL`
    ),
    size: requiredNumber(asset.size, `release asset ${index} size`),
  }
}

export function ordinal(day: number) {
  if (day % 100 >= 11 && day % 100 <= 13) return `${day}th`

  switch (day % 10) {
    case 1:
      return `${day}st`
    case 2:
      return `${day}nd`
    case 3:
      return `${day}rd`
    default:
      return `${day}th`
  }
}

function parseReleaseDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new GitHubDataError(
      "GitHub release published_at is not a valid date."
    )
  }

  return date
}

function formatReleaseMonth(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    timeZone: "UTC",
  }).format(date)
}

export function formatReleaseDate(value: string) {
  const date = parseReleaseDate(value)

  return `${formatReleaseMonth(date)} ${ordinal(date.getUTCDate())}`
}

export function formatLongReleaseDate(value: string) {
  const date = parseReleaseDate(value)

  return `${formatReleaseMonth(date)} ${ordinal(date.getUTCDate())}, ${date.getUTCFullYear()}`
}

export function normalizeRelease(value: unknown): LatestRelease {
  const release = asRecord(value, "release")
  const tagName = requiredString(release.tag_name, "release tag_name")
  const publishedAt = requiredString(
    release.published_at,
    "release published_at"
  )

  if (!Array.isArray(release.assets)) {
    throw new GitHubDataError("GitHub release assets must be an array.")
  }

  return {
    version: tagName.replace(/^v/i, ""),
    date: formatReleaseDate(publishedAt),
    publishedAt,
    assets: release.assets.map(normalizeReleaseAsset),
  }
}

function normalizeReleaseEntry(value: unknown, index: number): Release {
  const release = asRecord(value, `release at index ${index}`)
  const tag = requiredString(release.tag_name, `release ${index} tag_name`)
  const publishedAt = requiredString(
    release.published_at,
    `release ${index} published_at`
  )

  if (!Array.isArray(release.assets)) {
    throw new GitHubDataError(`GitHub release ${tag} assets must be an array.`)
  }

  return {
    id: requiredNumber(release.id, `release ${index} id`),
    tag,
    version: tag.replace(/^v/i, ""),
    name: optionalString(release.name) || tag,
    date: formatLongReleaseDate(publishedAt),
    publishedAt,
    prerelease: release.prerelease === true,
    body: optionalString(release.body),
    url: requiredString(release.html_url, `release ${index} page URL`),
    sourceUrl: requiredString(
      release.zipball_url,
      `release ${index} source archive URL`
    ),
    assets: release.assets.map(normalizeReleaseAsset),
  }
}

export function normalizeReleases(value: unknown): Release[] {
  if (!Array.isArray(value)) {
    throw new GitHubDataError("GitHub releases payload must be an array.")
  }

  return value.map(normalizeReleaseEntry)
}

export function normalizeDocTree(value: unknown): string[] {
  const tree = asRecord(value, "documentation tree")

  if (!Array.isArray(tree.tree)) {
    throw new GitHubDataError("GitHub documentation tree must list entries.")
  }

  if (tree.truncated === true) {
    throw new GitHubDataError("GitHub documentation tree was truncated.")
  }

  return tree.tree
    .map((entry, index) => {
      const item = asRecord(entry, `documentation entry at index ${index}`)
      const path = requiredString(
        item.path,
        `documentation entry ${index} path`
      )

      return item.type === "blob" && isDocPath(path) ? path : null
    })
    .filter((path): path is string => path !== null)
    .sort()
}

export function normalizeContributorSummaries(
  value: unknown
): GitHubContributorSummary[] {
  if (!Array.isArray(value)) {
    throw new GitHubDataError("GitHub contributors payload must be an array.")
  }

  const summaries = value
    .map((entry, index) => {
      const summary = asRecord(entry, `contributor at index ${index}`)
      const type = requiredString(
        summary.type,
        `contributor ${index} type`
      ).toLowerCase()

      if (type === "bot") return null

      return {
        login: requiredString(summary.login, `contributor ${index} login`),
        type,
        avatarUrl: requiredString(
          summary.avatar_url,
          `contributor ${index} avatar URL`
        ),
        githubUrl: requiredString(
          summary.html_url,
          `contributor ${index} profile URL`
        ),
        contributions: requiredNumber(
          summary.contributions,
          `contributor ${index} contributions`
        ),
      } satisfies GitHubContributorSummary
    })
    .filter((summary): summary is GitHubContributorSummary => summary !== null)
    .slice(0, 2)

  if (summaries.length < 2) {
    throw new GitHubDataError(
      "GitHub contributors payload did not contain two human contributors."
    )
  }

  return summaries
}

export function normalizeContributor(
  summary: GitHubContributorSummary,
  value: unknown
): GitHubContributor {
  const profile = asRecord(value, `profile for ${summary.login}`)
  const login = optionalString(profile.login) || summary.login
  const avatarUrl = optionalString(profile.avatar_url) || summary.avatarUrl
  const githubUrl = optionalString(profile.html_url) || summary.githubUrl

  if (!login || !avatarUrl || !githubUrl) {
    throw new GitHubDataError(
      `GitHub profile for ${summary.login} is missing identity fields.`
    )
  }

  return {
    login,
    name: optionalString(profile.name) || login,
    bio: optionalString(profile.bio),
    avatarUrl,
    githubUrl,
    contributions: summary.contributions,
    followers: requiredNumber(profile.followers, `profile ${login} followers`),
  }
}
