import type { Metadata } from "next"
import Link from "next/link"

import { DownloadPage } from "@/components/download/download-page"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteNavigation } from "@/components/navigation/site-navigation"
import { FancyText } from "@/components/ui/fancy-text"
import { getLatestRelease } from "@/lib/github/client"

export const metadata: Metadata = {
  title: "Download Gambit Pairing",
  description:
    "Download free, open-source Gambit Pairing chess tournament software for Windows, macOS, or Linux.",
  alternates: {
    canonical: "/download",
  },
}

export default async function DownloadRoute() {
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

      <DownloadPage latestRelease={latestRelease} />
      <SiteFooter />
    </main>
  )
}
