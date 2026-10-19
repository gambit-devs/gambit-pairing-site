import { describe, expect, it } from "vitest"

import { GitHubDataError } from "../../lib/github/errors"
import {
  formatLongReleaseDate,
  normalizeDocTree,
  normalizeReleases,
} from "../../lib/github/normalize"

const releasePayload = {
  id: 7,
  tag_name: "v2.0.0-beta.1",
  name: "",
  published_at: "2026-03-03T12:00:00Z",
  prerelease: true,
  body: "  ## What's changed\n- Faster pairing  ",
  html_url:
    "https://github.com/gambit-devs/gambit-pairing/releases/tag/v2.0.0-beta.1",
  zipball_url:
    "https://api.github.com/repos/gambit-devs/gambit-pairing/zipball/v2.0.0-beta.1",
  assets: [
    {
      name: "gambit-pairing.exe",
      browser_download_url: "https://example.com/gambit-pairing.exe",
      size: 2048,
    },
  ],
}

describe("release list normalization", () => {
  it("keeps the fields the releases page renders", () => {
    expect(normalizeReleases([releasePayload])).toEqual([
      {
        id: 7,
        tag: "v2.0.0-beta.1",
        version: "2.0.0-beta.1",
        name: "v2.0.0-beta.1",
        date: "March 3rd, 2026",
        publishedAt: "2026-03-03T12:00:00Z",
        prerelease: true,
        body: "## What's changed\n- Faster pairing",
        url: "https://github.com/gambit-devs/gambit-pairing/releases/tag/v2.0.0-beta.1",
        sourceUrl:
          "https://api.github.com/repos/gambit-devs/gambit-pairing/zipball/v2.0.0-beta.1",
        assets: [
          {
            name: "gambit-pairing.exe",
            url: "https://example.com/gambit-pairing.exe",
            size: 2048,
          },
        ],
      },
    ])
  })

  it("treats missing notes as empty and rejects a payload that is not a list", () => {
    const [release] = normalizeReleases([
      { ...releasePayload, body: null, prerelease: false },
    ])

    expect(release.body).toBe("")
    expect(release.prerelease).toBe(false)
    expect(() => normalizeReleases({})).toThrow(GitHubDataError)
  })

  it("formats long dates with the year", () => {
    expect(formatLongReleaseDate("2024-01-23T00:00:00Z")).toBe(
      "January 23rd, 2024"
    )
  })
})

describe("documentation tree normalization", () => {
  it("keeps only markdown files from visible folders, sorted by path", () => {
    expect(
      normalizeDocTree({
        truncated: false,
        tree: [
          { path: "guide/setup.md", type: "blob" },
          { path: "README.md", type: "blob" },
          { path: "guide", type: "tree" },
          { path: "images/board.png", type: "blob" },
          { path: ".github/PULL_REQUEST_TEMPLATE.md", type: "blob" },
        ],
      })
    ).toEqual(["README.md", "guide/setup.md"])
  })

  it("fails loudly when GitHub truncates the tree", () => {
    expect(() => normalizeDocTree({ tree: [], truncated: true })).toThrow(
      "truncated"
    )
  })
})
