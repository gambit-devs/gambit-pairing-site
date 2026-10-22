import { LATEST_RELEASE_API_URL } from "../site/config"
import { normalizeRelease } from "./normalize"
import type { LatestRelease } from "./types"

// Runs in the browser, so it cannot use the server-only client or its token.
// Unauthenticated requests share GitHub's small per-IP limit, so callers keep
// the release from the last build when this fails.
export async function fetchLatestRelease(
  signal: AbortSignal
): Promise<LatestRelease> {
  const response = await fetch(LATEST_RELEASE_API_URL, { signal })

  if (!response.ok) {
    throw new Error(
      `GitHub latest release request failed with ${response.status}.`
    )
  }

  return normalizeRelease(await response.json())
}
