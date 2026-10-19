import { describe, expect, it } from "vitest"

import {
  DOWNLOAD_PLATFORM_OPTIONS,
  PLATFORM_DETAILS,
  PLATFORM_OPTIONS,
  isPlatformSlug,
  platformDownloadPath,
} from "../../lib/site/platforms"

describe("platform registry", () => {
  it("keeps the public platform order and labels stable", () => {
    expect(PLATFORM_OPTIONS).toEqual([
      { label: "Windows", slug: "windows" },
      { label: "macOS", slug: "macos" },
      { label: "Linux", slug: "linux" },
    ])
  })

  it("adds Python as a download-page platform", () => {
    expect(DOWNLOAD_PLATFORM_OPTIONS).toEqual([
      { label: "Windows", slug: "windows" },
      { label: "macOS", slug: "macos" },
      { label: "Linux", slug: "linux" },
      { label: "Python", slug: "python" },
    ])
  })

  it("generates the same download paths used by the routes", () => {
    expect(platformDownloadPath("windows")).toBe("/download/windows")
    expect(platformDownloadPath("macos")).toBe("/download/macos")
    expect(platformDownloadPath("linux")).toBe("/download/linux")
    expect(platformDownloadPath("python")).toBe("/download/python")
  })

  it("validates only registered platform slugs", () => {
    expect(isPlatformSlug("windows")).toBe(true)
    expect(isPlatformSlug("python")).toBe(true)
    expect(isPlatformSlug("plan9")).toBe(false)
    expect(PLATFORM_DETAILS.windows.label).toBe("Windows")
    expect(PLATFORM_DETAILS.python.label).toBe("Python")
  })
})
