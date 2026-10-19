import type { Metadata } from "next"
import Link from "next/link"

import { ChangelogHeading } from "@/components/changelog/changelog-heading"
import { PreviousReleasesDivider } from "@/components/changelog/previous-releases-divider"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteNavigation } from "@/components/navigation/site-navigation"
import { ReleaseCard } from "@/components/releases/release-card"
import { FancyText } from "@/components/ui/fancy-text"
import { getLatestRelease, getReleases } from "@/lib/github/client"
import { splitReleases } from "@/lib/github/release-list"

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Every published version of Gambit Pairing, with release notes and downloads for Windows, macOS, and Linux.",
  alternates: {
    canonical: "/changelog",
  },
}

export default async function ChangelogPage() {
  const [latestRelease, releases] = await Promise.all([
    getLatestRelease(),
    getReleases(),
  ])
  const { latest, previous } = splitReleases(releases, latestRelease.version)

  return (
    <main className="flex min-h-svh flex-col bg-background pt-8 text-foreground">
      <header className="flex flex-col items-center gap-8">
        <Link href="/" aria-label="Gambit Pairing home">
          <FancyText
            className="text-center text-5xl leading-none font-black text-foreground/10"
            fillClassName="text-foreground"
          >
            Gambit Pairing
          </FancyText>
        </Link>
        <SiteNavigation latestVersion={latestRelease.version} />
      </header>

      <section
        aria-labelledby="changelog-heading"
        className="mx-auto mt-12 w-full max-w-3xl px-6 pb-20 sm:mt-16"
      >
        <ChangelogHeading />

        {releases.length === 0 ? (
          <p className="mt-10 text-muted-foreground">
            No releases have been published yet.
          </p>
        ) : (
          <>
            {latest ? (
              <div className="mt-10">
                <ReleaseCard
                  release={latest}
                  isLatest={latest.version === latestRelease.version}
                />
              </div>
            ) : null}

            {previous.length > 0 ? (
              <>
                <div className="mt-12">
                  <PreviousReleasesDivider />
                </div>
                <div className="mt-10 divide-y divide-border">
                  {previous.map((release) => (
                    <ReleaseCard
                      key={release.id}
                      release={release}
                      isLatest={release.version === latestRelease.version}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </>
        )}
      </section>

      <SiteFooter />
    </main>
  )
}
