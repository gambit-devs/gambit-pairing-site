import type { LatestRelease, ReleaseAsset } from "@/lib/github/types"

import {
  DOCUMENTATION_URL,
  ISSUES_URL,
  LATEST_RELEASE_URL,
  PYPI_URL,
  RELEASES_URL,
  REPOSITORY_URL,
} from "./config"
import type { PlatformSlug } from "./platforms"

type DownloadOptionStatus = "direct" | "external" | "unavailable"

export type DownloadOption = {
  id: string
  name: string
  description: string
  installType: string
  architecture: string
  size: string
  status: DownloadOptionStatus
  actionLabel: string
  actionUrl?: string
  assetName?: string
  recommended?: boolean
}

type DownloadLink = {
  label: string
  href: string
  external?: boolean
  icon: "github" | "history" | "code" | "notes" | "issue"
}

type PlatformDownload = {
  label: string
  description: string
  requirements: string[]
  installation: string
  command?: string
  launchCommand?: string
  notice?: string
  options: DownloadOption[]
}

type NativePlatform = "windows" | "macos" | "linux"

type NativePackage = {
  id: string
  pattern: RegExp
  name: string
  description: string
  installType: string
  architecture: string
}

const UNKNOWN_VALUE = "—"
const PYTHON_REQUIREMENT = "Python 3.9 or newer"
const PYTHON_INSTALL_COMMAND = "python3 -m pip install gambit-pairing"
const PYTHON_LAUNCH_COMMAND = "gambit-pairing"

// Files published by .github/workflows/build-release.yml. Velopack names come
// from PackId "GambitPairing" on the "win" and "linux" channels; archives use
// "gambit-pairing-<version>-<artifact>". Every other release asset, including
// update packages, feed files, checksums and RELEASES, is deliberately omitted.
const NATIVE_PACKAGES: Record<NativePlatform, NativePackage[]> = {
  windows: [
    {
      id: "windows-installer",
      pattern: /^GambitPairing-win-Setup\.exe$/,
      name: "Windows x64 installer",
      description: "Recommended for most Windows users.",
      installType: "Setup installer",
      architecture: "x86_64",
    },
    {
      id: "windows-portable",
      pattern: /^gambit-pairing-.+-windows-x64-portable\.zip$/,
      name: "Windows x64 portable",
      description:
        "Extract the archive and run Gambit Pairing without installing it.",
      installType: "ZIP archive",
      architecture: "x86_64",
    },
  ],
  macos: [
    {
      id: "macos-archive",
      pattern: /^gambit-pairing-.+-macos-arm64\.tar\.gz$/,
      name: "macOS Apple silicon archive",
      description:
        "Extract the archive and run gambit-pairing from the extracted folder.",
      installType: "tar.gz archive",
      architecture: "arm64",
    },
  ],
  linux: [
    {
      id: "linux-appimage",
      pattern: /^GambitPairing\.AppImage$/,
      name: "Linux x86_64 AppImage",
      description:
        "A single file that runs without installation. Mark it executable first.",
      installType: "AppImage",
      architecture: "x86_64",
    },
    {
      id: "linux-archive",
      pattern: /^gambit-pairing-.+-linux-x86_64\.tar\.gz$/,
      name: "Linux x86_64 archive",
      description:
        "Extract the archive and run gambit-pairing from the extracted folder.",
      installType: "tar.gz archive",
      architecture: "x86_64",
    },
  ],
}

export const RELEASE_LINKS: DownloadLink[] = [
  {
    label: "Release notes",
    href: LATEST_RELEASE_URL,
    external: true,
    icon: "notes",
  },
  {
    label: "Previous releases",
    href: RELEASES_URL,
    external: true,
    icon: "history",
  },
]

export const OPEN_SOURCE_LINKS: DownloadLink[] = [
  {
    label: "Source code",
    href: REPOSITORY_URL,
    external: true,
    icon: "github",
  },
  {
    label: "Build instructions",
    href: DOCUMENTATION_URL,
    external: true,
    icon: "code",
  },
  {
    label: "Report an issue",
    href: ISSUES_URL,
    external: true,
    icon: "issue",
  },
]

function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return UNKNOWN_VALUE

  const megabytes = bytes / 1024 / 1024

  if (megabytes < 1) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`
  }

  return `${megabytes.toFixed(megabytes >= 100 ? 0 : 1)} MB`
}

function directOption({
  asset,
  id,
  name,
  description,
  installType,
  architecture,
  recommended = false,
}: {
  asset: ReleaseAsset
  id: string
  name: string
  description: string
  installType: string
  architecture: string
  recommended?: boolean
}): DownloadOption {
  return {
    id,
    name,
    description,
    installType,
    architecture,
    size: formatFileSize(asset.size),
    status: "direct",
    actionLabel: "Download",
    actionUrl: asset.url,
    assetName: asset.name,
    recommended,
  }
}

function externalOption({
  id,
  name,
  description,
  installType,
  architecture,
  actionLabel,
  actionUrl,
  recommended = false,
}: {
  id: string
  name: string
  description: string
  installType: string
  architecture: string
  actionLabel: string
  actionUrl: string
  recommended?: boolean
}): DownloadOption {
  return {
    id,
    name,
    description,
    installType,
    architecture,
    size: UNKNOWN_VALUE,
    status: "external",
    actionLabel,
    actionUrl,
    recommended,
  }
}

function unavailableOption(
  platform: "Windows" | "macOS" | "Linux" | "Python"
): DownloadOption {
  return {
    id: `${platform.toLowerCase()}-unavailable`,
    name: `${platform} native package`,
    description: `No native ${platform} package is published in this release.`,
    installType: "Native package",
    architecture: UNKNOWN_VALUE,
    size: UNKNOWN_VALUE,
    status: "unavailable",
    actionLabel: "Unavailable",
  }
}

function nativePackageOptions(
  release: LatestRelease,
  platform: NativePlatform
) {
  const options: DownloadOption[] = []

  for (const { pattern, ...details } of NATIVE_PACKAGES[platform]) {
    const asset = release.assets.find(({ name }) => pattern.test(name))

    if (asset) {
      options.push(
        directOption({
          asset,
          ...details,
          recommended: options.length === 0,
        })
      )
    }
  }

  return options
}

function pythonPackageOption(platform: PlatformSlug, recommended: boolean) {
  return externalOption({
    id: `${platform}-pypi`,
    name: "Python package",
    description: "Install the OS-independent package published on PyPI.",
    installType: "PyPI package",
    architecture: "Any",
    actionLabel: "View on PyPI",
    actionUrl: PYPI_URL,
    recommended,
  })
}

function buildFromSourceOption(platform: PlatformSlug) {
  return externalOption({
    id: `${platform}-source`,
    name: "Build from source",
    description: "For developers, packagers, and distribution maintainers.",
    installType: "Source",
    architecture: "Any",
    actionLabel: "Build instructions",
    actionUrl: DOCUMENTATION_URL,
  })
}

export function getPlatformDownload(
  platform: PlatformSlug,
  release: LatestRelease
): PlatformDownload {
  if (platform === "python") {
    return {
      label: "Python",
      description: "Install the OS-independent Python package from PyPI.",
      requirements: [PYTHON_REQUIREMENT, "pip"],
      installation:
        "Use the install command below, then launch Gambit Pairing from your terminal.",
      command: PYTHON_INSTALL_COMMAND,
      launchCommand: PYTHON_LAUNCH_COMMAND,
      options: [
        pythonPackageOption(platform, true),
        buildFromSourceOption(platform),
      ],
    }
  }

  if (platform === "windows") {
    const options = nativePackageOptions(release, platform)

    return {
      label: "Windows",
      description:
        "Use the installer for a standard setup, or choose a portable build.",
      requirements: ["64-bit Windows"],
      installation:
        "Download the Setup.exe, open it, and follow the installer prompts.",
      options: options.length > 0 ? options : [unavailableOption("Windows")],
    }
  }

  const nativeOptions = nativePackageOptions(release, platform)
  const platformLabel = platform === "macos" ? "macOS" : "Linux"
  const hasNativePackage = nativeOptions.length > 0

  return {
    label: platformLabel,
    description: hasNativePackage
      ? `Choose a native ${platformLabel} package or install from PyPI.`
      : `The current release has no native ${platformLabel} package. Use the OS-independent Python package or build from source.`,
    requirements: [PYTHON_REQUIREMENT, "pip"],
    installation:
      "Install the published Python package, then run gambit-pairing from your applications menu or terminal.",
    command: PYTHON_INSTALL_COMMAND,
    notice: hasNativePackage
      ? undefined
      : `Version ${release.version} does not include a native ${platformLabel} release asset.`,
    options: hasNativePackage
      ? nativeOptions.concat(
          pythonPackageOption(platform, false),
          buildFromSourceOption(platform)
        )
      : [
          pythonPackageOption(platform, true),
          buildFromSourceOption(platform),
          unavailableOption(platformLabel),
        ],
  }
}

export function getDownloadOptions(
  platform: PlatformSlug,
  release: LatestRelease
) {
  return getPlatformDownload(platform, release).options
}
