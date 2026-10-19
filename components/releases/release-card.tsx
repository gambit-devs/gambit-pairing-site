import { Download } from "lucide-react"

import { Markdown } from "@/components/markdown/markdown"
import { Badge } from "@/components/ui/badge"
import type { Release } from "@/lib/github/types"
import {
  DOWNLOAD_LINK_CLASS_NAME,
  SECTION_LABEL_CLASS_NAME,
} from "@/lib/site/styles"
import { formatBytes } from "@/lib/utils"

const NO_NOTES = "No release notes were published for this version."

export function ReleaseCard({
  release,
  isLatest,
}: {
  release: Release
  isLatest: boolean
}) {
  const downloadsId = `${release.tag}-downloads`
  const notesId = `${release.tag}-notes`

  return (
    <article id={release.tag} className="py-10 first:pt-0">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{release.version}</h2>
        {isLatest ? (
          <Badge className="bg-[var(--download-button)] text-white">
            Latest
          </Badge>
        ) : null}
        {release.prerelease ? (
          <Badge variant="outline">Pre-release</Badge>
        ) : null}
      </header>
      <p className="mt-2 text-sm text-muted-foreground">
        <time dateTime={release.publishedAt}>{release.date}</time>
      </p>

      <section aria-labelledby={downloadsId} className="mt-8">
        <h3 id={downloadsId} className={SECTION_LABEL_CLASS_NAME}>
          Downloads
        </h3>
        <ul className="mt-3 divide-y divide-border border-y border-border">
          {release.assets.map((asset) => (
            <li
              key={asset.url}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm break-words">{asset.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(asset.size)}
                </p>
              </div>
              <a href={asset.url} className={DOWNLOAD_LINK_CLASS_NAME}>
                <Download aria-hidden="true" className="size-3.5" />
                Download
              </a>
            </li>
          ))}
          <li className="flex items-center justify-between gap-4 py-3 text-sm">
            <span className="text-muted-foreground">Source code (zip)</span>
            <a
              href={release.sourceUrl}
              className="underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Download
            </a>
          </li>
        </ul>
      </section>

      <section aria-labelledby={notesId} className="mt-8">
        <h3 id={notesId} className={SECTION_LABEL_CLASS_NAME}>
          Release notes
        </h3>
        <Markdown
          source={release.body || NO_NOTES}
          className="mt-3 text-sm [&_h1]:mt-6 [&_h1]:text-xl [&_h2]:mt-6 [&_h2]:text-lg [&_h3]:mt-4 [&_h3]:text-base"
        />
      </section>
    </article>
  )
}
