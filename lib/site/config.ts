export const SITE_URL = "https://gambit-devs.org"
export const REPOSITORY_URL = "https://github.com/gambit-devs/gambit-pairing"
export const ORGANIZATION_URL = "https://github.com/gambit-devs"
export const DISCORD_URL = "https://discord.gg/yBrzH97hd6"
export const PYPI_URL = "https://pypi.org/project/gambit-pairing/"
export const DOCUMENTATION_URL = `${REPOSITORY_URL}/tree/main/docs`
export const ISSUES_URL = `${REPOSITORY_URL}/issues`
export const PULL_REQUESTS_URL = `${REPOSITORY_URL}/pulls`
export const RELEASES_URL = `${REPOSITORY_URL}/releases`
export const LATEST_RELEASE_URL = `${RELEASES_URL}/latest`
export const USER_DOCS_REPOSITORY_URL =
  "https://github.com/gambit-devs/user-docs"
export const USER_DOCS_BRANCH = "main"
export const USER_DOCS_API_URL =
  "https://api.github.com/repos/gambit-devs/user-docs"
export const USER_DOCS_RAW_URL = `https://raw.githubusercontent.com/gambit-devs/user-docs/${USER_DOCS_BRANCH}`

export const SITE_ANCHORS = {
  faq: "/#faq",
  screenshots: "/#screenshots",
  downloads: "/download",
  docs: "/docs",
  changelog: "/changelog",
  latestRelease: "/changelog/latest",
} as const
