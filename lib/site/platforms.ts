export const PLATFORM_OPTIONS = [
  { label: "Windows", slug: "windows" },
  { label: "macOS", slug: "macos" },
  { label: "Linux", slug: "linux" },
] as const

export const DOWNLOAD_PLATFORM_OPTIONS = [
  ...PLATFORM_OPTIONS,
  { label: "Python", slug: "python" },
] as const

export type PlatformSlug = (typeof DOWNLOAD_PLATFORM_OPTIONS)[number]["slug"]

export const PLATFORM_DETAILS = {
  windows: { label: "Windows" },
  macos: { label: "macOS" },
  linux: { label: "Linux" },
  python: { label: "Python" },
} satisfies Record<PlatformSlug, { label: string }>

export function isPlatformSlug(value: string): value is PlatformSlug {
  return Object.prototype.hasOwnProperty.call(PLATFORM_DETAILS, value)
}

export function platformDownloadPath(platform: PlatformSlug) {
  return `/download/${platform}` as const
}
