import {
  USER_DOCS_BRANCH,
  USER_DOCS_RAW_URL,
  USER_DOCS_REPOSITORY_URL,
} from "../site/config"
import { isExternalUrl } from "../utils"

export type DocPage = {
  path: string
  slug: string[]
  title: string
  markdown: string
}

type DocsNavItem = {
  title: string
  href: string
  path: string
}

export type DocsNavGroup = {
  folder: string
  label: string | null
  items: DocsNavItem[]
}

type DocLinkContext = {
  fromPath: string
  docPaths: ReadonlySet<string>
}

const DOCS_ROUTE = "/docs"
const DOC_EXTENSION = ".md"

export function isDocPath(path: string) {
  return (
    path.endsWith(DOC_EXTENSION) &&
    path.split("/").every((segment) => !segment.startsWith("."))
  )
}

function directoryOf(path: string) {
  const index = path.lastIndexOf("/")

  return index === -1 ? "" : path.slice(0, index)
}

function isReadme(path: string) {
  return path.split("/").at(-1)?.toLowerCase() === `readme${DOC_EXTENSION}`
}

function humanize(segment: string) {
  const text = segment.replace(/[-_]+/g, " ").trim()

  return text.charAt(0).toUpperCase() + text.slice(1)
}

// "guide/install.md" -> ["guide", "install"], "guide/README.md" -> ["guide"]
export function docSlugFromPath(path: string) {
  const segments = path.slice(0, -DOC_EXTENSION.length).split("/")

  return isReadme(path) ? segments.slice(0, -1) : segments
}

export function docHref(slug: string[]) {
  if (slug.length === 0) return DOCS_ROUTE

  return `${DOCS_ROUTE}/${slug.map((segment) => encodeURIComponent(segment)).join("/")}`
}

export function findDocPage(pages: DocPage[], slug: string[]) {
  const key = slug.join("/")

  return pages.find((page) => page.slug.join("/") === key)
}

export function getDocTitle(markdown: string, path: string) {
  const withoutCodeBlocks = markdown.replace(/```[\s\S]*?```/g, "")
  const heading = withoutCodeBlocks.match(/^#\s+(.+)$/m)

  if (heading) return heading[1].trim()

  return humanize(docSlugFromPath(path).at(-1) ?? "Overview")
}

function joinRepoPath(fromPath: string, relativePath: string) {
  const segments = relativePath.startsWith("/")
    ? []
    : directoryOf(fromPath).split("/").filter(Boolean)

  for (const segment of relativePath.split("/")) {
    if (segment === "" || segment === ".") continue

    if (segment === "..") {
      segments.pop()
    } else {
      segments.push(segment)
    }
  }

  return segments.join("/")
}

export function resolveDocLink(
  href: string,
  { fromPath, docPaths }: DocLinkContext
) {
  if (href.startsWith("#") || isExternalUrl(href)) return href

  const hashIndex = href.indexOf("#")
  const target = hashIndex === -1 ? href : href.slice(0, hashIndex)
  const hash = hashIndex === -1 ? "" : href.slice(hashIndex)
  const repoPath = joinRepoPath(fromPath, target)
  const docPath = [repoPath, `${repoPath}/README.md`].find((candidate) =>
    docPaths.has(candidate)
  )

  if (docPath) return `${docHref(docSlugFromPath(docPath))}${hash}`

  return `${USER_DOCS_REPOSITORY_URL}/blob/${USER_DOCS_BRANCH}/${repoPath}${hash}`
}

export function resolveDocAssetSrc(src: string, fromPath: string) {
  if (isExternalUrl(src)) return src

  return `${USER_DOCS_RAW_URL}/${joinRepoPath(fromPath, src)}`
}

function compareNavItems(a: DocsNavItem, b: DocsNavItem) {
  if (isReadme(a.path) !== isReadme(b.path)) return isReadme(a.path) ? -1 : 1

  return a.title.localeCompare(b.title)
}

export function buildDocsNav(pages: DocPage[]): DocsNavGroup[] {
  const folders = new Map<string, DocsNavItem[]>()

  for (const page of pages) {
    const folder = directoryOf(page.path)
    const items = folders.get(folder) ?? []

    items.push({ title: page.title, href: docHref(page.slug), path: page.path })
    folders.set(folder, items)
  }

  return [...folders.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([folder, items]) => ({
      folder,
      label: folder === "" ? null : folder.split("/").map(humanize).join(" / "),
      items: items.sort(compareNavItems),
    }))
}
