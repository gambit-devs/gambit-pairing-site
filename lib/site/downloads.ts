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

const UNKNOWN_VALUE = "—"
const PYTHON_REQUIREMENT = "Python 3.9 or newer"
const PYTHON_INSTALL_COMMAND = "python3 -m pip install gambit-pairing"
const PYTHON_LAUNCH_COMMAND = "gambit-pairing"

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

function normalizedName(asset: ReleaseAsset) {
  return asset.name.toLowerCase()
}

function matchesPlatform(asset: ReleaseAsset, platform: PlatformSlug) {
  const name = normalizedName(asset)

  if (platform === "windows") {
    return (
      /\.(exe|msi|zip)$/.test(name) &&
      /(windows?|win32|win64|x86_64|amd64|x64|portable|installer|setup)/.test(
        name
      )
    )
  }

  if (platform === "macos") {
    return (
      /\.(dmg|pkg)$/.test(name) ||
      (/\.zip$/.test(name) &&
        /(macos?|osx|darwin|apple|silicon|arm64|aarch64|universal)/.test(name))
    )
  }

  return (
    /\.(appimage|deb|rpm|tar\.gz|tar\.xz)$/.test(name) || /linux/.test(name)
  )
}

function detectArchitecture(name: string, fallback: string) {
  const normalized = name.toLowerCase()

  if (/universal/.test(normalized)) return "Universal"
  if (/(arm64|aarch64|apple[-_ ]?silicon|m1|m2|m3|m4)/.test(normalized)) {
    return "arm64"
  }
  if (/(x86_64|x86-64|amd64|x64|win64|intel)/.test(normalized)) {
    return "x86_64"
  }

  return fallback
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
    architecture: detectArchitecture(asset.name, architecture),
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

function windowsOptions(release: LatestRelease) {
  const assets = release.assets.filter((asset) =>
    matchesPlatform(asset, "windows")
  )
  const installer = assets.find(
    (asset) =>
      /\.(msi|exe)$/.test(normalizedName(asset)) &&
      !/(portable|standalone)/.test(normalizedName(asset))
  )
  const portable = assets.find((asset) =>
    /(portable|standalone)/.test(normalizedName(asset))
  )
  const directory = assets.find(
    (asset) =>
      /\.zip$/.test(normalizedName(asset)) &&
      /(directory|archive)/.test(normalizedName(asset))
  )
  const usedAssets = new Set(
    [installer, portable, directory]
      .filter((asset): asset is ReleaseAsset => Boolean(asset))
      .map((asset) => asset.name)
  )
  const options: DownloadOption[] = []

  if (installer) {
    options.push(
      directOption({
        asset: installer,
        id: "windows-installer",
        name: "Windows x64 installer",
        description: "Recommended for most Windows users.",
        installType: "MSI installer",
        architecture: "x86_64",
        recommended: true,
      })
    )
  }

  if (portable) {
    options.push(
      directOption({
        asset: portable,
        id: "windows-portable",
        name: "Windows x64 portable",
        description: "Run Gambit Pairing without installing it.",
        installType: "Portable executable",
        architecture: "x86_64",
        recommended: options.length === 0,
      })
    )
  }

  if (directory) {
    options.push(
      directOption({
        asset: directory,
        id: "windows-directory",
        name: "Windows x64 directory",
        description: "Extract the archive and run the application in place.",
        installType: "ZIP archive",
        architecture: "x86_64",
        recommended: options.length === 0,
      })
    )
  }

  for (const asset of assets.filter(({ name }) => !usedAssets.has(name))) {
    options.push(
      directOption({
        asset,
        id: `windows-${asset.name}`,
        name: asset.name,
        description: "Additional asset from the latest GitHub release.",
        installType: "Release asset",
        architecture: "x86_64",
        recommended: options.length === 0,
      })
    )
  }

  return options.length > 0 ? options : [unavailableOption("Windows")]
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

function nativeUnixOptions(
  release: LatestRelease,
  platform: "macos" | "linux"
) {
  return release.assets
    .filter((asset) => matchesPlatform(asset, platform))
    .map((asset, index) => {
      const name = normalizedName(asset)
      const installType = /\.dmg$/.test(name)
        ? "Disk image"
        : /\.pkg$/.test(name)
          ? "Installer package"
          : /appimage/.test(name)
            ? "AppImage"
            : /\.deb$/.test(name)
              ? "Debian package"
              : /\.rpm$/.test(name)
                ? "RPM package"
                : "Release asset"

      return directOption({
        asset,
        id: `${platform}-${asset.name}`,
        name: asset.name,
        description: "Native package from the latest GitHub release.",
        installType,
        architecture: "x86_64",
        recommended: index === 0,
      })
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
    return {
      label: "Windows",
      description:
        "Use the installer for a standard setup, or choose a portable build.",
      requirements: ["64-bit Windows"],
      installation:
        "Download the MSI, open it, and follow the installer prompts.",
      options: windowsOptions(release),
    }
  }

  const nativeOptions = nativeUnixOptions(release, platform)
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
