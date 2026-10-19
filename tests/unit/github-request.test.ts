import { afterEach, describe, expect, it, vi } from "vitest"

import { fetchGitHubJson } from "../../lib/github/request"

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("GitHub request boundary", () => {
  it("fails on non-success responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("rate limited", {
          status: 429,
          statusText: "Too Many Requests",
        })
      )
    )

    await expect(
      fetchGitHubJson("https://example.com", "release")
    ).rejects.toThrow(
      "GitHub release request failed with 429 Too Many Requests."
    )
  })

  it("fails when the response is not valid JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("not-json", {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      )
    )

    await expect(
      fetchGitHubJson("https://example.com", "contributors")
    ).rejects.toThrow("response was not valid JSON")
  })

  it("fails when a request exceeds its timeout", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url: string, options?: RequestInit) =>
          new Promise((_, reject) => {
            options?.signal?.addEventListener("abort", () => {
              reject(new DOMException("Aborted", "AbortError"))
            })
          })
      )
    )

    await expect(
      fetchGitHubJson("https://example.com", "release", { timeoutMs: 5 })
    ).rejects.toThrow("timed out after 5ms")
  })
})
