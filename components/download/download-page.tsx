import { PlatformDownloadSelector } from "@/components/download/platform-download-selector"
import type { LatestRelease } from "@/lib/github/types"
import { OPEN_SOURCE_LINKS } from "@/lib/site/downloads"

export function DownloadPage({
  latestRelease,
}: {
  latestRelease: LatestRelease
}) {
  return (
    <section
      aria-label="Download options"
      className="mt-12 flex w-full justify-center px-4 sm:mt-16 sm:px-6"
    >
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Downloads
        </h1>

        <div className="mt-10">
          <PlatformDownloadSelector latestRelease={latestRelease} />
        </div>

        <nav
          aria-label="Open-source resources"
          className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 text-sm text-muted-foreground"
        >
          {OPEN_SOURCE_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}
