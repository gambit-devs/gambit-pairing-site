import { describe, expect, it } from "vitest"

import type { LatestRelease, ReleaseAsset } from "../../lib/github/types"
import {
  getDownloadOptions,
  getPlatformDownload,
  type DownloadOption,
} from "../../lib/site/downloads"

const MEGABYTE = 1024 * 1024

function asset(name: string, size: number): ReleaseAsset {
  return { name, url: `https://example.com/${name}`, size }
}

// The assets .github/workflows/build-release.yml publishes for any version.
// Velopack update packages, feed files and checksums are included so the tests
// show that none of them is offered as a download.
function releaseFor(version: string): LatestRelease {
  return {
    version,
    date: "January 23rd",
    publishedAt: "2026-01-23T00:00:00Z",
    assets: [
      asset("GambitPairing-win-Setup.exe", 52 * MEGABYTE),
      asset("GambitPairing-win-Portable.zip", 52 * MEGABYTE),
      asset(`GambitPairing-${version}-full.nupkg`, 50 * MEGABYTE),
      asset("RELEASES", 1024),
      asset("releases.win.json", 2048),
      asset(
        `gambit-pairing-${version}-windows-x64-portable.zip`,
        51 * MEGABYTE
      ),
      asset(`gambit-pairing-${version}-windows-x64-portable.zip.sha256`, 96),
      asset("GambitPairing.AppImage", 60 * MEGABYTE),
      asset(`GambitPairing-${version}-linux-full.nupkg`, 58 * MEGABYTE),
      asset("RELEASES-linux", 1024),
      asset("releases.linux.json", 2048),
      asset(`gambit-pairing-${version}-linux-x86_64.tar.gz`, 55 * MEGABYTE),
      asset(`gambit-pairing-${version}-linux-x86_64.tar.gz.sha256`, 96),
      asset(`gambit-pairing-${version}-macos-arm64.tar.gz`, 50 * MEGABYTE),
      asset(`gambit-pairing-${version}-macos-arm64.tar.gz.sha256`, 96),
    ],
  }
}

const VERSION = "1.4.0"
const release = releaseFor(VERSION)

function assetNames(options: DownloadOption[]) {
  return options.flatMap(({ assetName }) => (assetName ? [assetName] : []))
}

describe("download option registry", () => {
  it("offers the Windows installer and portable archive only", () => {
    const options = getDownloadOptions("windows", release)

    expect(options).toEqual([
      expect.objectContaining({
        name: "Windows x64 installer",
        status: "direct",
        installType: "Setup installer",
        assetName: "GambitPairing-win-Setup.exe",
        size: "52.0 MB",
        recommended: true,
      }),
      expect.objectContaining({
        name: "Windows x64 portable",
        status: "direct",
        installType: "ZIP archive",
        assetName: `gambit-pairing-${VERSION}-windows-x64-portable.zip`,
      }),
    ])
  })

  it("offers the Linux AppImage and archive beside the Python package", () => {
    const options = getDownloadOptions("linux", release)

    expect(assetNames(options)).toEqual([
      "GambitPairing.AppImage",
      `gambit-pairing-${VERSION}-linux-x86_64.tar.gz`,
    ])
    expect(options[0]).toMatchObject({ recommended: true })
    expect(options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Python package",
          status: "external",
        }),
        expect.objectContaining({
          name: "Build from source",
          status: "external",
        }),
      ])
    )
  })

  it("offers the macOS archive", () => {
    const options = getDownloadOptions("macos", release)

    expect(options[0]).toMatchObject({
      name: "macOS Apple silicon archive",
      status: "direct",
      assetName: `gambit-pairing-${VERSION}-macos-arm64.tar.gz`,
      recommended: true,
    })
    expect(assetNames(options)).toEqual([
      `gambit-pairing-${VERSION}-macos-arm64.tar.gz`,
    ])
  })

  it("finds the same files for any release version", () => {
    for (const version of ["0.8.0", "1.4.0", "12.10.3"]) {
      const current = releaseFor(version)

      expect(assetNames(getDownloadOptions("windows", current))).toEqual([
        "GambitPairing-win-Setup.exe",
        `gambit-pairing-${version}-windows-x64-portable.zip`,
      ])
      expect(assetNames(getDownloadOptions("linux", current))).toEqual([
        "GambitPairing.AppImage",
        `gambit-pairing-${version}-linux-x86_64.tar.gz`,
      ])
      expect(assetNames(getDownloadOptions("macos", current))).toEqual([
        `gambit-pairing-${version}-macos-arm64.tar.gz`,
      ])
    }
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
    const options = getDownloadOptions("macos", { ...release, assets: [] })
    const macBuild = options.find(({ id }) => id === "macos-unavailable")

    expect(macBuild).toMatchObject({
      name: "macOS native package",
      status: "unavailable",
      actionLabel: "Unavailable",
    })
  })
})
