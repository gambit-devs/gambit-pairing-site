import { describe, expect, it } from "vitest"

import { GitHubDataError } from "../../lib/github/errors"
import {
  formatReleaseDate,
  normalizeContributor,
  normalizeContributorSummaries,
  normalizeRelease,
  ordinal,
} from "../../lib/github/normalize"

describe("GitHub payload normalization", () => {
  it("normalizes release versions, UTC dates, and assets", () => {
    expect(
      normalizeRelease({
        tag_name: "v1.2.3",
        published_at: "2024-01-23T23:00:00-08:00",
        assets: [
          {
            name: "gambit-pairing.exe",
            browser_download_url: "https://example.com/gambit-pairing.exe",
            size: 42,
          },
        ],
      })
    ).toEqual({
      version: "1.2.3",
      date: "January 24th",
      publishedAt: "2024-01-23T23:00:00-08:00",
      assets: [
        {
          name: "gambit-pairing.exe",
          url: "https://example.com/gambit-pairing.exe",
          size: 42,
        },
      ],
    })
  })

  it("formats ordinal dates without teen suffix errors", () => {
    expect(ordinal(1)).toBe("1st")
    expect(ordinal(2)).toBe("2nd")
    expect(ordinal(3)).toBe("3rd")
    expect(ordinal(11)).toBe("11th")
    expect(ordinal(22)).toBe("22nd")
    expect(formatReleaseDate("2024-01-23T00:00:00Z")).toBe("January 23rd")
  })

  it("rejects malformed release payloads instead of using a fallback", () => {
    expect(() => normalizeRelease({ tag_name: "v1.0.0" })).toThrow(
      GitHubDataError
    )
    expect(() =>
      normalizeRelease({
        tag_name: "v1.0.0",
        published_at: "not-a-date",
        assets: [],
      })
    ).toThrow("valid date")
  })

  it("filters bots and normalizes the first two human contributors", () => {
    const summaries = normalizeContributorSummaries([
      {
        login: "automation",
        type: "Bot",
        avatar_url: "https://example.com/bot.png",
        html_url: "https://github.com/automation",
        contributions: 100,
      },
      {
        login: "alice",
        type: "User",
        avatar_url: "https://example.com/alice.png",
        html_url: "https://github.com/alice",
        contributions: 10,
      },
      {
        login: "bob",
        type: "User",
        avatar_url: "https://example.com/bob.png",
        html_url: "https://github.com/bob",
        contributions: 8,
      },
    ])

    expect(summaries.map(({ login }) => login)).toEqual(["alice", "bob"])
    expect(
      normalizeContributor(summaries[0], {
        login: "alice",
        name: "Alice Example",
        bio: "Chess organizer",
        avatar_url: "https://example.com/alice-profile.png",
        html_url: "https://github.com/alice",
        followers: 12,
      })
    ).toMatchObject({
      login: "alice",
      name: "Alice Example",
      bio: "Chess organizer",
      contributions: 10,
      followers: 12,
    })
  })

  it("requires two valid human contributors", () => {
    expect(() => normalizeContributorSummaries([])).toThrow(
      "two human contributors"
    )
  })
})
