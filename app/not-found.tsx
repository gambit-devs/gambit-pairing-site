import type { Metadata } from "next"
import Link from "next/link"

import { HomeButton } from "@/components/not-found/home-button"
import { NotFoundArtwork } from "@/components/not-found/not-found-artwork"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteNavigation } from "@/components/navigation/site-navigation"
import { FancyText } from "@/components/ui/fancy-text"
import { getLatestRelease } from "@/lib/github/client"

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

        <h1 className="mt-10 text-4xl font-bold tracking-tight sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          This page does not exist.
        </p>

        <div className="mt-8">
          <HomeButton />
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
