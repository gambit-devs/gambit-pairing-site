import { describe, expect, it } from "vitest"

import type { LatestRelease } from "../../lib/github/types"
import {
  getDownloadOptions,
  getPlatformDownload,
} from "../../lib/site/downloads"

const release: LatestRelease = {
  version: "1.2.3",
  date: "January 23rd",
  publishedAt: "2024-01-23T00:00:00Z",
  assets: [
    {
      name: "GambitPairing-1.2.3-x64.msi",
      url: "https://example.com/gambit.msi",
      size: 52 * 1024 * 1024,
    },
    {
      name: "gambit-pairing-1.2.3-win64-portable.exe",
      url: "https://example.com/gambit-portable.exe",
      size: 51 * 1024 * 1024,
    },
    {
      name: "gambit-pairing-1.2.3-x86_64.AppImage",
      url: "https://example.com/gambit.AppImage",
      size: 60 * 1024 * 1024,
    },
  ],
}

describe("download option registry", () => {
  it("maps release assets to Windows install options", () => {
    const options = getDownloadOptions("windows", release)

    expect(options[0]).toMatchObject({
      name: "Windows x64 installer",
      status: "direct",
      installType: "MSI installer",
      size: "52.0 MB",
    })
    expect(options[1]).toMatchObject({
      name: "Windows x64 portable",
      status: "direct",
      installType: "Portable executable",
    })
    expect(options.some(({ recommended }) => recommended)).toBe(true)
  })

  it("keeps Linux distribution channels in the same option list", () => {
    const options = getDownloadOptions("linux", release)

    expect(options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "gambit-pairing-1.2.3-x86_64.AppImage",
          status: "direct",
        }),
        expect.objectContaining({
          name: "Build from source",
          status: "external",
        }),
        expect.objectContaining({
          name: "Python package",
          status: "external",
        }),
      ])
    )
  })

  it("keeps Python as a distinct download section", () => {
    const download = getPlatformDownload("python", release)

    expect(download).toMatchObject({
      label: "Python",
      command: "python3 -m pip install gambit-pairing",
      launchCommand: "gambit-pairing",
      requirements: ["Python 3.9 or newer", "pip"],
    })
    expect(download.options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Python package",
          status: "external",
          recommended: true,
        }),
        expect.objectContaining({
          name: "Build from source",
          status: "external",
        }),
      ])
    )
  })

  it("shows an accessible unavailable state when a platform asset is missing", () => {
    const options = getDownloadOptions("macos", release)
    const macBuild = options.find(({ id }) => id === "macos-unavailable")

    expect(macBuild).toMatchObject({
      name: "macOS native package",
      status: "unavailable",
      actionLabel: "Unavailable",
    })
  })
})
