import type { Release } from "./types"

export function splitReleases(releases: Release[], latestVersion: string) {
  const latest: Release | undefined =
    releases.find((release) => release.version === latestVersion) ?? releases[0]

  return {
    latest,
    previous: releases.filter((release) => release !== latest),
  }
}
