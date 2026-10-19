import { GitHubDataError } from "./errors"

export const GITHUB_API_BASE_URL =
  "https://api.github.com/repos/gambit-devs/gambit-pairing"
const REQUEST_TIMEOUT_MS = 15_000

const GITHUB_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "gambit-pairing-site",
  "X-GitHub-Api-Version": "2022-11-28",
}

const RAW_HEADERS = {
  "User-Agent": "gambit-pairing-site",
}

function getGitHubHeaders() {
  const token = process.env.GITHUB_TOKEN

  return token
    ? { ...GITHUB_HEADERS, Authorization: `Bearer ${token}` }
    : GITHUB_HEADERS
}

type RequestOptions = {
  timeoutMs?: number
}

async function requestGitHub<T>(
  url: string,
  label: string,
  headers: Record<string, string>,
  readBody: (response: Response) => Promise<T>,
  { timeoutMs = REQUEST_TIMEOUT_MS }: RequestOptions
): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      headers,
      cache: "force-cache",
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new GitHubDataError(
        `GitHub ${label} request failed with ${response.status} ${response.statusText}.`
      )
    }

    return await readBody(response)
  } catch (error) {
    if (error instanceof GitHubDataError) throw error

    if (error instanceof Error && error.name === "AbortError") {
      throw new GitHubDataError(
        `GitHub ${label} request timed out after ${timeoutMs}ms.`
      )
    }

    const reason = error instanceof Error ? ` ${error.message}` : ""
    throw new GitHubDataError(`GitHub ${label} request failed.${reason}`)
  } finally {
    clearTimeout(timeout)
  }
}

export function fetchGitHubJson(
  url: string,
  label: string,
  options: RequestOptions = {}
): Promise<unknown> {
  return requestGitHub(
    url,
    label,
    getGitHubHeaders(),
    async (response) => {
      try {
        return await response.json()
      } catch {
        throw new GitHubDataError(
          `GitHub ${label} response was not valid JSON.`
        )
      }
    },
    options
  )
}

export function fetchGitHubText(
  url: string,
  label: string,
  options: RequestOptions = {}
): Promise<string> {
  return requestGitHub(
    url,
    label,
    RAW_HEADERS,
    (response) => response.text(),
    options
  )
}
