import { describe, expect, it } from "vitest"

import { splitReleases } from "../../lib/github/release-list"
import type { Release } from "../../lib/github/types"

function release(id: number, version: string): Release {
  return {
    id,
    tag: version,
    version,
    name: version,
    date: "",
    publishedAt: "",
    prerelease: false,
    body: "",
    url: "",
    sourceUrl: "",
    assets: [],
  }
}

describe("release list split", () => {
  it("picks the stable latest release and keeps the rest in order", () => {
    const releases = [
      release(3, "0.7.0-beta"),
      release(2, "0.6.0"),
      release(1, "0.5.0"),
    ]
    const { latest, previous } = splitReleases(releases, "0.6.0")

    expect(latest?.id).toBe(2)
    expect(previous.map(({ id }) => id)).toEqual([3, 1])
  })

  it("falls back to the newest release when the latest version is not listed", () => {
    const releases = [release(2, "0.6.0"), release(1, "0.5.0")]
    const { latest, previous } = splitReleases(releases, "0.4.0")

    expect(latest?.id).toBe(2)
    expect(previous.map(({ id }) => id)).toEqual([1])
  })

  it("has no latest release when nothing is published", () => {
    expect(splitReleases([], "0.6.0")).toEqual({
      latest: undefined,
      previous: [],
    })
  })
})
