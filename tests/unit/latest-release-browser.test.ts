import { afterEach, describe, expect, it, vi } from "vitest"

import { fetchLatestRelease } from "../../lib/github/latest-release-browser"
import { LATEST_RELEASE_API_URL } from "../../lib/site/config"

const payload = {
  tag_name: "v1.4.0",
  published_at: "2026-02-01T00:00:00Z",
  assets: [
    {
      name: "GambitPairing-win-Setup.exe",
      browser_download_url: "https://example.com/GambitPairing-win-Setup.exe",
      size: 52 * 1024 * 1024,
    },
  ],
}

describe("fetchLatestRelease", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("normalizes the newest release from the GitHub API", async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify(payload), {
          headers: { "Content-Type": "application/json" },
        })
    )
    vi.stubGlobal("fetch", fetchMock)

    const release = await fetchLatestRelease(new AbortController().signal)

    expect(fetchMock).toHaveBeenCalledWith(
      LATEST_RELEASE_API_URL,
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    )
    expect(release).toEqual({
      version: "1.4.0",
      date: "February 1st",
      publishedAt: "2026-02-01T00:00:00Z",
      assets: [
        {
          name: "GambitPairing-win-Setup.exe",
          url: "https://example.com/GambitPairing-win-Setup.exe",
          size: 52 * 1024 * 1024,
        },
      ],
    })
  })

  it("rejects when GitHub does not answer successfully", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("rate limited", { status: 403 }))
    )

    await expect(
      fetchLatestRelease(new AbortController().signal)
    ).rejects.toThrow("403")
  })
})
