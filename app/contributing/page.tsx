import type { Metadata } from "next"
import Link from "next/link"

import { SiteFooter } from "@/components/layout/site-footer"
import { SiteNavigation } from "@/components/navigation/site-navigation"
import { FancyText } from "@/components/ui/fancy-text"
import { getLatestRelease } from "@/lib/github/client"
import { REPOSITORY_URL } from "@/lib/site/config"

export const metadata: Metadata = {
  title: "Contributing",
  description:
    "How to contribute to Gambit Pairing, free and open-source Swiss tournament software.",
  alternates: {
    canonical: "/contributing",
  },
}

export default async function ContributingPage() {
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

      <section className="mx-auto w-full max-w-3xl px-6 pt-14 pb-16 sm:pt-20">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Contributing
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          This page is still in development.
        </p>
        <a
          href={REPOSITORY_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex font-semibold text-[color:var(--download-button)] underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          View the project on GitHub
        </a>
      </section>

      <SiteFooter />
    </main>
  )
}
