import type { Metadata } from "next"
import Link from "next/link"

import { NotFoundArtwork } from "@/components/not-found/not-found-artwork"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteNavigation } from "@/components/navigation/site-navigation"
import { FancyText } from "@/components/ui/fancy-text"
import { getLatestRelease } from "@/lib/github/client"
import { SITE_ANCHORS } from "@/lib/site/config"

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: true,
  },
}

export default async function NotFound() {
  const latestRelease = await getLatestRelease()

  return (
    <main className="flex min-h-svh flex-col pt-8">
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

      <section className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-10 pb-16 text-center sm:pt-14">
        <NotFoundArtwork />

        <p className="mt-10 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Error 404
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          This square is empty. The page may have moved, or the address may be
          wrong.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex h-12 items-center bg-[var(--download-button)] px-6 font-bold text-white transition-none hover:bg-[var(--download-button-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:bg-[var(--download-button-active)]"
          >
            Back to home
          </Link>
          <Link
            href={SITE_ANCHORS.downloads}
            className="inline-flex h-12 items-center border border-border px-6 font-semibold transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Download Gambit Pairing
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
