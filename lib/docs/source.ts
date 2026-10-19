import "server-only"

import { cache } from "react"

import { normalizeDocTree } from "../github/normalize"
import { fetchGitHubJson, fetchGitHubText } from "../github/request"
import {
  USER_DOCS_API_URL,
  USER_DOCS_BRANCH,
  USER_DOCS_RAW_URL,
} from "../site/config"
import { docSlugFromPath, getDocTitle, type DocPage } from "./paths"

function encodeRepoPath(path: string) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
}

export const getDocsPages = cache(async (): Promise<DocPage[]> => {
  const paths = normalizeDocTree(
    await fetchGitHubJson(
      `${USER_DOCS_API_URL}/git/trees/${USER_DOCS_BRANCH}?recursive=1`,
      "documentation tree"
    )
  )

  return Promise.all(
    paths.map(async (path) => {
      const markdown = await fetchGitHubText(
        `${USER_DOCS_RAW_URL}/${encodeRepoPath(path)}`,
        `documentation page ${path}`
      )

      return {
        path,
        slug: docSlugFromPath(path),
        title: getDocTitle(markdown, path),
        markdown,
      }
    })
  )
})
