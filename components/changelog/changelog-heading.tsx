import { ExternalLink } from "lucide-react"

import { RELEASES_URL } from "@/lib/site/config"

export function ChangelogHeading() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <h1
        id="changelog-heading"
        className="text-4xl font-bold tracking-tight sm:text-5xl"
      >
        Changelog
      </h1>
      <a
        href={RELEASES_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        View on GitHub
        <ExternalLink aria-hidden="true" className="size-3.5" />
      </a>
    </div>
  )
}
